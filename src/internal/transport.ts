import { hosts, webPlayer } from "@/config";
import { AmpError, type ApiError } from "@/errors";
import type { Token } from "@/types";

export type QueryValue =
  | string
  | number
  | boolean
  | readonly string[]
  | null
  | undefined;

export type Query = Record<string, QueryValue>;

export interface RawRelationship {
  data?: RawResource[];
  href?: string;
  next?: string | null;
}

export interface RawView extends RawRelationship {
  attributes?: { title?: string };
}

export interface RawResource {
  attributes?: Record<string, unknown>;
  href?: string;
  id: string;
  meta?: Record<string, unknown>;
  relationships?: Record<string, RawRelationship>;
  type: string;
  views?: Record<string, RawView>;
}

export type ResourceMap = Record<string, Record<string, RawResource>>;

export interface RawDocument {
  data?: RawResource[];
  errors?: ApiError[];
  meta?: { total?: number } & Record<string, unknown>;
  next?: string | null;
  resources?: ResourceMap;
}

export interface Request {
  body?: unknown;
  host?: string;
  method?: string;
  path: string;
  query?: Query;
}

export interface TransportOptions {
  cache?: boolean;
  developerToken: Token;
  edge?: boolean;
  fetch?: typeof fetch;
  userToken?: Token;
}

export type Send = <D extends RawDocument = RawDocument>(
  request: Request
) => Promise<D>;

const serialize = (query: Query = {}) => {
  const params = new URLSearchParams();
  for (const key of Object.keys(query).sort()) {
    const value = query[key];
    if (value === undefined || value === null) {
      continue;
    }
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  return params.toString();
};

const isSearch = (path: string) => {
  const [, version, area, , section] = path.split("/");
  return version === "v1" && area === "catalog" && section === "search";
};

const readToken = (token?: Token) =>
  typeof token === "function" ? token() : token;

const maxAge = (header: string | null) => {
  const directives = (header ?? "").split(",").map((part) => part.trim());
  if (directives.includes("no-store") || directives.includes("no-cache")) {
    return 0;
  }
  const age = directives.find((part) => part.startsWith("max-age="));
  return age ? Number(age.slice("max-age=".length)) || 0 : 0;
};

const expiry = new WeakMap<object, number>();

export const isFresh = (document: object) =>
  (expiry.get(document) ?? 0) > Date.now();

export const createTransport = (options: TransportOptions): Send => {
  const cache = new Map<string, { expires: number; document: unknown }>();
  const inflight = new Map<string, Promise<unknown>>();
  const call = options.fetch ?? fetch;
  const route = (path: string) =>
    options.edge && isSearch(path) ? hosts.edge : hosts.api;

  const authorize = async (request: Request) => {
    const [developerToken, userToken] = await Promise.all([
      readToken(options.developerToken),
      readToken(options.userToken),
    ]);
    if (!developerToken) {
      throw new TypeError(
        "The developerToken function returned an empty token."
      );
    }
    return {
      authorization: `Bearer ${developerToken}`,
      origin: webPlayer.origin,
      referer: webPlayer.referer,
      ...(userToken ? { "media-user-token": userToken } : {}),
      ...(request.body === undefined
        ? {}
        : { "content-type": "application/json" }),
    };
  };

  const load = async (url: string, request: Request) => {
    const headers = await authorize(request);
    const response = await call(url, {
      body:
        request.body === undefined ? undefined : JSON.stringify(request.body),
      headers,
      method: request.method ?? "GET",
    });
    const text = await response.text();
    const document: RawDocument = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new AmpError(response.status, document.errors?.[0]);
    }
    const seconds = maxAge(response.headers.get("cache-control"));
    if (
      options.cache !== false &&
      (request.method ?? "GET") === "GET" &&
      seconds > 0
    ) {
      if (cache.size >= 500) {
        cache.delete(cache.keys().next().value ?? "");
      }
      const expires = Date.now() + seconds * 1000;
      expiry.set(document, expires);
      cache.set(url, { document, expires });
    }
    return document;
  };

  return <D extends RawDocument = RawDocument>(request: Request) => {
    const search = serialize(request.query);
    const url = `${request.host ?? route(request.path)}${request.path}${search ? `?${search}` : ""}`;
    if (request.method !== undefined && request.method !== "GET") {
      return load(url, request) as Promise<D>;
    }
    const cached = cache.get(url);
    if (cached && cached.expires > Date.now()) {
      return Promise.resolve(cached.document as D);
    }
    const pending = inflight.get(url) ?? load(url, request);
    if (!inflight.has(url)) {
      inflight.set(url, pending);
      pending.then(
        () => inflight.delete(url),
        () => inflight.delete(url)
      );
    }
    return pending as Promise<D>;
  };
};
