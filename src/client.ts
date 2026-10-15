import { defaults, hosts } from "@/config";
import { AmpError } from "@/errors";
import { type Operations, operationHosts } from "@/generated/operations";
import { createBatcher } from "@/internal/batcher";
import { completeRelationships } from "@/internal/complete";
import { camelCase, hydrator } from "@/internal/hydrate";
import {
  loadPage,
  mapped,
  type PageSource,
  paginate,
  toPage,
  walk,
} from "@/internal/pages";
import {
  createTransport,
  type Query,
  type RawDocument,
  type RawRelationship,
  type RawResource,
} from "@/internal/transport";
import type {
  AttributeName,
  CamelCase,
  CatalogType,
  Chart,
  ChartType,
  CreditCategory,
  Defaults,
  Extend,
  LibrarySearchType,
  LibraryType,
  Listable,
  Page,
  RecentlyAddedType,
  Relationship,
  RelationshipLimit,
  Resource,
  SearchType,
  Storefront,
  Suggestions,
  Target,
  Token,
  UpTo,
  View,
  ViewLimit,
  ViewTarget,
  WithViews,
} from "@/types";

export interface ClientOptions {
  cache?: boolean;
  developerToken: Token;
  fetch?: typeof fetch;
  language?: string;
  storefront?: string;
  userToken?: Token;
}

export interface Scope {
  language?: string;
  storefront?: string;
}

export interface PageOptions<L extends number = number> extends Scope {
  limit?: L;
}

export interface GetOptions<
  T extends CatalogType,
  I extends Relationship<T>,
  F extends AttributeName<T>,
  E extends Extend<T>,
  V extends View<T>,
> extends Scope {
  complete?: boolean;
  extend?: readonly E[];
  fields?: readonly F[];
  include?: readonly I[];
  views?: readonly V[];
}

export interface LibraryOptions<
  T extends LibraryType,
  I extends Relationship<T>,
  E extends Extend<T>,
> extends PageOptions<UpTo<100>> {
  complete?: boolean;
  extend?: readonly E[];
  include?: readonly I[];
}

export type LibrarySort =
  | "name"
  | "-name"
  | "artistName"
  | "-artistName"
  | "albumName"
  | "-albumName"
  | "dateAdded"
  | "-dateAdded"
  | "releaseDate"
  | "-releaseDate";

export interface LibraryListOptions<
  T extends LibraryType,
  I extends Relationship<T>,
  E extends Extend<T>,
> extends LibraryOptions<T, I, E> {
  sort?: LibrarySort;
}

export interface CatalogCollection<T extends CatalogType> {
  get: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
  >(
    id: string,
    options?: GetOptions<T, I, F, E, V>
  ) => Promise<Resource<T, I | Defaults<T>, F, E> & WithViews<T, V>>;
  getMany: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
  >(
    ids: readonly string[],
    options?: GetOptions<T, I, F, E, V>
  ) => Promise<(Resource<T, I | Defaults<T>, F, E> & WithViews<T, V>)[]>;
  related: <R extends Relationship<T>>(
    id: string,
    relationship: R,
    options?: PageOptions<RelationshipLimit<T, R>>
  ) => Promise<Page<Resource<Target<T, R>>>>;
  view: <V extends View<T>>(
    id: string,
    view: V,
    options?: PageOptions<ViewLimit<T, V>>
  ) => Promise<Page<Resource<ViewTarget<T, V>>>>;
}

export interface LibraryCollection<T extends LibraryType> {
  all: <const I extends Listable<T> = never, const E extends Extend<T> = never>(
    options?: LibraryListOptions<T, I, E>
  ) => AsyncGenerator<Resource<T, I, PropertyKey, E>>;
  get: <
    const I extends Relationship<T> = never,
    const E extends Extend<T> = never,
  >(
    id: string,
    options?: LibraryOptions<T, I, E>
  ) => Promise<Resource<T, I, PropertyKey, E>>;
  list: <
    const I extends Listable<T> = never,
    const E extends Extend<T> = never,
  >(
    options?: LibraryListOptions<T, I, E>
  ) => Promise<Page<Resource<T, I, PropertyKey, E>>>;
  related: <R extends Relationship<T>>(
    id: string,
    relationship: R,
    options?: PageOptions<RelationshipLimit<T, R>>
  ) => Promise<Page<Resource<Target<T, R>>>>;
}

export interface SongCollection extends CatalogCollection<"songs"> {
  credits: (id: string, options?: Scope) => Promise<CreditCategory[]>;
  lyrics: (id: string, options?: Scope) => Promise<string>;
  syllableLyrics: (id: string, options?: Scope) => Promise<string>;
}

export type SearchResults<T extends SearchType> = {
  [K in T as CamelCase<K>]: Page<Resource<K>>;
};

export type LibrarySearchResults<T extends LibrarySearchType> = {
  [K in T as CamelCase<K extends `library-${infer Rest}` ? Rest : K>]: Page<
    Resource<K>
  >;
};

export type Charts<T extends ChartType> = {
  [K in T as CamelCase<K>]: Chart<Resource<K>>[];
};

export type RequestParams<K extends keyof Operations> =
  Record<string, never> extends Operations[K]
    ? [params?: Operations[K]]
    : [params: Operations[K]];

interface ResultsDocument<S> extends RawDocument {
  results?: Record<string, S | undefined>;
}

interface ChartSlice extends RawRelationship {
  chart?: string;
  name?: string;
  shortName?: string;
}

interface SuggestionsDocument extends RawDocument {
  results?: {
    suggestions?: {
      kind: string;
      searchTerm?: string;
      displayTerm?: string;
      content?: RawResource;
    }[];
  };
}

interface HintsDocument extends RawDocument {
  results?: { terms?: string[] };
}

const searchTypes = ["albums", "artists", "playlists", "songs"] as const;

const chartTypes = ["albums", "playlists", "songs"] as const;

const librarySearchTypes = [
  "library-albums",
  "library-artists",
  "library-playlists",
  "library-songs",
] as const;

const unprefix = (type: string) => type.slice("library-".length);

const libraryPath = (type: LibraryType) => `/v1/me/library/${unprefix(type)}`;

export const createClient = (options: ClientOptions) => {
  if (!options.developerToken) {
    throw new TypeError(
      "createClient needs a developerToken. amp does not ship one: bring your own web player token."
    );
  }
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

  const catalogPath = async (scope: Scope, ...segments: string[]) =>
    [`/v1/catalog/${await resolveStorefront(scope)}`, ...segments].join("/");

  const pageQuery = (scope: PageOptions) => ({
    l: language(scope),
    limit: scope.limit,
  });

  const requireUser = () => {
    if (!options.userToken) {
      throw new Error(
        "This request reads a personal library and needs a userToken."
      );
    }
  };

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

  const single = <T>(
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
  };

  const page = <T>(source: PageSource<RawDocument>) =>
    loadPage<T>(sendMap, source);

  const catalog = <T extends CatalogType>(type: T): CatalogCollection<T> => {
    type AnyGetOptions = GetOptions<
      T,
      Relationship<T>,
      AttributeName<T>,
      Extend<T>,
      View<T>
    >;
    const query = (scope: AnyGetOptions): Query => ({
      extend: scope.extend,
      fields: scope.fields?.map(String),
      include: scope.include,
      l: language(scope),
      views: scope.views,
    });
    const fetchOne = async (
      id: string,
      scope: AnyGetOptions,
      missing: "throw" | "skip"
    ) => {
      const document = scope.views?.length
        ? await sendMap({
            path: await catalogPath(scope, type, id),
            query: query(scope),
          })
        : await batch(await resolveStorefront(scope), type, id, query(scope));
      const ref = locate(document, type, id);
      if (ref) {
        return expand<Resource<T, Defaults<T>>>(document, ref, scope);
      }
      if (missing === "throw") {
        throw notFound(type, id);
      }
    };
    const related = async <R>(
      id: string,
      segment: string,
      scope: PageOptions
    ) =>
      page<R>({
        path: await catalogPath(scope, type, id, segment),
        query: pageQuery(scope),
      });
    return {
      get: (id, scope = {}) => fetchOne(id, scope, "throw") as never,
      getMany: async (ids, scope = {}) =>
        (
          await Promise.all(ids.map((id) => fetchOne(id, scope, "skip")))
        ).filter((resource) => resource !== undefined) as never,
      related: (id, relationship, scope = {}) =>
        related(id, relationship, scope),
      view: (id, view, scope = {}) => related(id, `view/${view}`, scope),
    };
  };

  const library = <T extends LibraryType>(type: T): LibraryCollection<T> => {
    const query = (scope: LibraryOptions<T, Relationship<T>, Extend<T>>) => ({
      extend: scope.extend,
      include: scope.include,
      l: language(scope),
    });
    const source = (
      scope: LibraryListOptions<T, Relationship<T>, Extend<T>> = {}
    ) => {
      requireUser();
      return {
        path: libraryPath(type),
        query: { ...query(scope), limit: scope.limit ?? 100, sort: scope.sort },
      };
    };
    return {
      all: (scope) => walk(sendMap, source(scope)) as never,
      get: async (id, scope = {}) => {
        requireUser();
        const document = await sendMap({
          path: `${libraryPath(type)}/${id}`,
          query: query(scope),
        });
        return single(document, type, id, scope);
      },
      list: (scope) => page(source(scope)) as never,
      related: (id, relationship, scope = {}) => {
        requireUser();
        return page({
          path: `${libraryPath(type)}/${id}/${relationship}`,
          query: pageQuery(scope),
        });
      },
    };
  };

  const lyricsAttributes = async (id: string, kind: string, scope: Scope) => {
    const document = await send({
      path: await catalogPath(scope, "songs", id, kind),
      query: { l: language(scope) },
    });
    return document.data?.[0]?.attributes;
  };

  const songs: SongCollection = {
    ...catalog("songs"),
    credits: async (id, scope = {}) => {
      const document = await sendMap({
        path: await catalogPath(scope, "songs", id, "credits"),
        query: { l: language(scope) },
      });
      return (document.data ?? []).map(hydrator<CreditCategory>(document));
    },
    lyrics: async (id, scope = {}) =>
      String((await lyricsAttributes(id, "lyrics", scope))?.ttml ?? ""),
    syllableLyrics: async (id, scope = {}) => {
      const attributes = await lyricsAttributes(id, "syllable-lyrics", scope);
      return String(attributes?.ttml ?? attributes?.ttmlLocalizations ?? "");
    },
  };

  const edgeHost = (scope: { edge?: boolean }) =>
    scope.edge ? hosts.edge : undefined;

  const searchPages = async (
    path: string,
    query: Query,
    types: readonly string[],
    key: (type: string) => string,
    host?: string
  ) => {
    const document = await sendMap<ResultsDocument<RawRelationship>>({
      host,
      path,
      query: { ...query, types },
    });
    return Object.fromEntries(
      types.map((type) => [
        key(type),
        toPage(
          sendMap,
          {
            path,
            query: { ...query, types: [type] },
            select: (current: ResultsDocument<RawRelationship>) =>
              current.results?.[type],
          },
          document
        ),
      ])
    );
  };

  const search = async <
    const T extends SearchType = (typeof searchTypes)[number],
  >(
    term: string,
    scope: PageOptions<UpTo<50>> & { edge?: boolean; types?: readonly T[] } = {}
  ): Promise<SearchResults<T>> =>
    searchPages(
      await catalogPath(scope, "search"),
      { ...pageQuery(scope), term },
      scope.types ?? searchTypes,
      camelCase,
      edgeHost(scope)
    ) as never;

  const suggestions = async <
    const T extends SearchType = (typeof searchTypes)[number],
  >(
    term: string,
    scope: Scope & {
      edge?: boolean;
      limit?: UpTo<10>;
      types?: readonly T[];
    } = {}
  ): Promise<Suggestions<T>> => {
    const document = await send<SuggestionsDocument>({
      host: edgeHost(scope),
      path: await catalogPath(scope, "search", "suggestions"),
      query: {
        kinds: "terms,topResults",
        l: language(scope),
        "limit[results:terms]": scope.limit,
        "limit[results:topResults]": scope.limit,
        term,
        types: scope.types ?? searchTypes,
      },
    });
    const entries = document.results?.suggestions ?? [];
    const resolve = hydrator<Resource<T>>(document);
    return {
      terms: entries.flatMap((entry) =>
        entry.kind === "terms" && entry.searchTerm
          ? [
              {
                displayTerm: entry.displayTerm ?? entry.searchTerm,
                searchTerm: entry.searchTerm,
              },
            ]
          : []
      ),
      topResults: entries.flatMap((entry) =>
        entry.content ? [resolve(entry.content)] : []
      ),
    };
  };

  const hints = async (
    term: string,
    scope: Scope & { edge?: boolean; limit?: number } = {}
  ) => {
    const document = await send<HintsDocument>({
      host: edgeHost(scope),
      path: await catalogPath(scope, "search", "hints"),
      query: { ...pageQuery(scope), term },
    });
    return document.results?.terms ?? [];
  };

  const charts = async <
    const T extends ChartType = (typeof chartTypes)[number],
  >(
    scope: PageOptions<UpTo<200>> & {
      types?: readonly T[];
      genre?: string;
      chart?: string;
    } = {}
  ): Promise<Charts<T>> => {
    const types = scope.types ?? chartTypes;
    const path = await catalogPath(scope, "charts");
    const query = {
      ...pageQuery(scope),
      chart: scope.chart,
      genre: scope.genre,
      types,
    };
    const document = await sendMap<ResultsDocument<ChartSlice[]>>({
      path,
      query,
    });
    return Object.fromEntries(
      types.map((type) => [
        camelCase(type),
        (document.results?.[type] ?? []).map((slice) => ({
          id: slice.chart ?? "",
          name: slice.name ?? "",
          shortName: slice.shortName,
          ...toPage(
            sendMap,
            { path, query: { ...query, chart: slice.chart, types: [type] } },
            { ...document, data: slice.data, next: slice.next }
          ),
        })),
      ])
    ) as never;
  };

  const librarySearch = async <
    const T extends LibrarySearchType = (typeof librarySearchTypes)[number],
  >(
    term: string,
    scope: PageOptions<UpTo<25>> & { types?: readonly T[] } = {}
  ): Promise<LibrarySearchResults<T>> => {
    requireUser();
    return (await searchPages(
      "/v1/me/library/search",
      { ...pageQuery(scope), term },
      scope.types ?? librarySearchTypes,
      (type) => camelCase(unprefix(type))
    )) as never;
  };

  const request = async <K extends keyof Operations>(
    operation: K,
    ...[params]: RequestParams<K>
  ) => {
    const [method = "GET", template = ""] = operation.split(" ");
    const { body, ...values }: Record<string, unknown> = { ...params };
    if (template.includes("{storefront}")) {
      values.storefront ??= await resolveStorefront();
    }
    const path = template.replace(/\{([^}]+)\}/g, (_match, name: string) => {
      const value = values[name];
      delete values[name];
      return encodeURIComponent(String(value));
    });
    return send({
      body,
      host: operationHosts[operation],
      method,
      path,
      query: values as Query,
    });
  };

  return {
    albums: catalog("albums"),
    appleCurators: catalog("apple-curators"),
    artists: catalog("artists"),
    charts,
    curators: catalog("curators"),
    genres: catalog("genres"),
    library: {
      albums: library("library-albums"),
      artists: library("library-artists"),
      musicVideos: library("library-music-videos"),
      playlists: library("library-playlists"),
      recentlyAdded: (scope: PageOptions<UpTo<25>> = {}) => {
        requireUser();
        return page<Resource<RecentlyAddedType>>({
          path: "/v1/me/library/recently-added",
          query: { ...pageQuery(scope), limit: scope.limit ?? 25 },
        });
      },
      search: librarySearch,
      songs: library("library-songs"),
    },
    me: {
      storefront: async () => {
        requireUser();
        const document = await send({ path: "/v1/me/storefront" });
        return single<Storefront>(
          document,
          "storefronts",
          document.data?.[0]?.id ?? ""
        );
      },
    },
    musicVideos: catalog("music-videos"),
    paginate,
    playlists: catalog("playlists"),
    recordLabels: catalog("record-labels"),
    request,
    search: Object.assign(search, { hints, suggestions }),
    songs,
    stations: catalog("stations"),
    storefronts: {
      get: async (id: string, scope: Scope = {}) =>
        single<Storefront>(
          await send({
            path: `/v1/storefronts/${id}`,
            query: { l: language(scope) },
          }),
          "storefronts",
          id
        ),
      list: (scope: PageOptions = {}) =>
        page<Storefront>({
          path: "/v1/storefronts",
          query: pageQuery(scope),
        }),
    },
  };
};

export type Client = ReturnType<typeof createClient>;
