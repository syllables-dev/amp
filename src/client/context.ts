import type { ClientOptions, PageOptions, Scope } from "@/client/options";
import { defaults } from "@/config";
import { AmpError } from "@/errors";
import { createBatcher } from "@/internal/batcher";
import { completeRelationships } from "@/internal/complete";
import { hydrator } from "@/internal/hydrate";
import { loadPage, mapped, type PageSource } from "@/internal/pages";
import {
  createTransport,
  type RawDocument,
  type RawResource,
} from "@/internal/transport";

export interface ResultsDocument<S> extends RawDocument {
  results?: Record<string, S | undefined>;
}

export type Context = ReturnType<typeof createContext>;

const locate = (document: RawDocument, type: string, id: string) => {
  const direct = document.resources?.[type]?.[id];
  if (direct) {
    return direct;
  }
  const candidates = [
    ...Object.values(document.resources?.[type] ?? {}),
    ...(document.data ?? []).filter((entry) => entry.type === type),
  ];
  return (
    candidates.find((entry) => entry.id === id) ??
    candidates.find(
      (entry) =>
        Array.isArray(entry.meta?.formerIds) &&
        entry.meta.formerIds.includes(id)
    )
  );
};

const notFound = (type: string, id: string) =>
  new AmpError(404, {
    code: "40400",
    detail: `No ${type} with id ${id}`,
    title: "Resource Not Found",
  });

export const unprefix = (type: string) => type.slice("library-".length);

export const createContext = (options: ClientOptions) => {
  const send = createTransport(options);
  const sendMap = mapped(send);
  const batch = createBatcher(sendMap);
  let detected: Promise<string> | undefined;

  const detectStorefront = async () => {
    if (!options.userToken) {
      return defaults.storefront;
    }
    const document = await send({ path: "/v1/me/storefront" });
    return document.data?.[0]?.id ?? defaults.storefront;
  };

  const resolveStorefront = (scope: Scope = {}) => {
    const chosen = scope.storefront ?? options.storefront;
    if (chosen) {
      return Promise.resolve(chosen);
    }
    detected ??= detectStorefront();
    return detected;
  };

  const language = (scope: Scope = {}) => scope.language ?? options.language;

  const expand = async <T>(
    document: RawDocument,
    ref: RawResource,
    scope?: Scope & { complete?: boolean }
  ) => {
    if (scope && scope.complete !== false) {
      await completeRelationships(sendMap, document, ref, {
        l: language(scope),
      });
    }
    return hydrator<T>(document)(ref);
  };

  return {
    batch,
    catalogPath: async (scope: Scope, ...segments: string[]) =>
      [`/v1/catalog/${await resolveStorefront(scope)}`, ...segments].join("/"),
    expand,
    language,
    locate,
    notFound,
    page: <T>(source: PageSource<RawDocument>) => loadPage<T>(sendMap, source),
    pageQuery: (scope: PageOptions) => ({
      l: language(scope),
      limit: scope.limit,
    }),
    requireUser: () => {
      if (!options.userToken) {
        throw new Error(
          "This request reads a personal library and needs a userToken."
        );
      }
    },
    resolveStorefront,
    send,
    sendMap,
    single: <T>(
      document: RawDocument,
      type: string,
      id: string,
      scope?: Scope & { complete?: boolean }
    ) => {
      const ref = locate(document, type, id);
      if (!ref) {
        throw notFound(type, id);
      }
      return expand<T>(document, ref, scope);
    },
  };
};
