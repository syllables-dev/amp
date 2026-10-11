import { defaults } from "@/config";
import { AmpError } from "@/errors";
import { type Operations, operationHosts } from "@/generated/operations";
import { createBatcher } from "@/internal/batcher";
import { camelCase, hydrator } from "@/internal/hydrate";
import {
  loadPage,
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
  AnyResource,
  Attributes,
  CamelCase,
  CatalogType,
  Chart,
  ChartType,
  CreditCategory,
  Defaults,
  Extend,
  LibrarySearchType,
  LibraryType,
  Page,
  Relationship,
  Resource,
  SearchType,
  Storefront,
  Suggestions,
  Target,
  Token,
  View,
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

export interface PageOptions extends Scope {
  limit?: number;
}

export interface GetOptions<
  T extends CatalogType,
  I extends Relationship<T>,
  F extends keyof Attributes<T>,
> extends Scope {
  extend?: readonly Extend<T>[];
  fields?: readonly F[];
  include?: readonly I[];
  views?: readonly View<T>[];
}

export interface LibraryOptions<
  T extends LibraryType,
  I extends Relationship<T>,
> extends PageOptions {
  extend?: readonly Extend<T>[];
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
> extends LibraryOptions<T, I> {
  sort?: LibrarySort;
}

export interface CatalogCollection<T extends CatalogType> {
  get: <
    const I extends Relationship<T> = never,
    const F extends keyof Attributes<T> = keyof Attributes<T>,
  >(
    id: string,
    options?: GetOptions<T, I, F>
  ) => Promise<Resource<T, I | Defaults<T>, F>>;
  getMany: <
    const I extends Relationship<T> = never,
    const F extends keyof Attributes<T> = keyof Attributes<T>,
  >(
    ids: readonly string[],
    options?: GetOptions<T, I, F>
  ) => Promise<Resource<T, I | Defaults<T>, F>[]>;
  related: <R extends Relationship<T>>(
    id: string,
    relationship: R,
    options?: PageOptions
  ) => Promise<Page<Resource<Target<T, R>>>>;
  view: (
    id: string,
    view: View<T>,
    options?: PageOptions
  ) => Promise<Page<AnyResource>>;
}

export interface LibraryCollection<T extends LibraryType> {
  all: <const I extends Relationship<T> = never>(
    options?: LibraryListOptions<T, I>
  ) => AsyncGenerator<Resource<T, I>>;
  get: <const I extends Relationship<T> = never>(
    id: string,
    options?: LibraryOptions<T, I>
  ) => Promise<Resource<T, I>>;
  list: <const I extends Relationship<T> = never>(
    options?: LibraryListOptions<T, I>
  ) => Promise<Page<Resource<T, I>>>;
  related: <R extends Relationship<T>>(
    id: string,
    relationship: R,
    options?: PageOptions
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

const libraryPath = (type: LibraryType) =>
  `/v1/me/library/${type.slice("library-".length)}`;

export const createClient = (options: ClientOptions) => {
  if (!options.developerToken) {
    throw new TypeError(
      "createClient needs a developerToken. amp does not ship one: bring your own web player token."
    );
  }
  const send = createTransport(options);
  const batch = createBatcher(send);
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

  const requireUser = () => {
    if (!options.userToken) {
      throw new Error(
        "This request reads a personal library and needs a userToken."
      );
    }
  };

  const locate = (document: RawDocument, type: string, id: string) => {
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

  const single = <T>(document: RawDocument, type: string, id: string) => {
    const ref = locate(document, type, id);
    if (!ref) {
      throw new AmpError(404, {
        code: "40400",
        detail: `No ${type} with id ${id}`,
        title: "Resource Not Found",
      });
    }
    return hydrator<T>(document)(ref);
  };

  const page = <T>(source: PageSource<RawDocument>) =>
    loadPage<T>(send, source);

  const catalog = <T extends CatalogType>(type: T): CatalogCollection<T> => {
    const query = (
      scope: GetOptions<T, Relationship<T>, keyof Attributes<T>>
    ): Query => ({
      extend: scope.extend,
      fields: scope.fields?.map(String),
      include: scope.include,
      l: language(scope),
      views: scope.views,
    });
    const fetchOne = async (
      id: string,
      scope: GetOptions<T, Relationship<T>, keyof Attributes<T>>,
      missing: "throw" | "skip"
    ) => {
      const storefront = await resolveStorefront(scope);
      const document = scope.views?.length
        ? await send({
            path: `/v1/catalog/${storefront}/${type}/${id}`,
            query: { ...query(scope), "format[resources]": "map" },
          })
        : await batch(storefront, type, id, query(scope));
      if (missing === "skip" && !locate(document, type, id)) {
        return;
      }
      return single<Resource<T, Defaults<T>>>(document, type, id);
    };
    return {
      get: (id, scope = {}) => fetchOne(id, scope, "throw") as never,
      getMany: async (ids, scope = {}) =>
        (
          await Promise.all(ids.map((id) => fetchOne(id, scope, "skip")))
        ).filter((resource) => resource !== undefined) as never,
      related: async (id, relationship, scope = {}) =>
        page({
          path: `/v1/catalog/${await resolveStorefront(scope)}/${type}/${id}/${relationship}`,
          query: { l: language(scope), limit: scope.limit },
        }),
      view: async (id, view, scope = {}) =>
        page({
          path: `/v1/catalog/${await resolveStorefront(scope)}/${type}/${id}/view/${view}`,
          query: { l: language(scope), limit: scope.limit },
        }),
    };
  };

  const library = <T extends LibraryType>(type: T): LibraryCollection<T> => {
    const source = (scope: LibraryListOptions<T, Relationship<T>> = {}) => {
      requireUser();
      return {
        path: libraryPath(type),
        query: {
          extend: scope.extend,
          include: scope.include,
          l: language(scope),
          limit: scope.limit ?? 100,
          sort: scope.sort,
        },
      };
    };
    return {
      all: (scope) => walk(send, source(scope)) as never,
      get: async (id, scope = {}) => {
        requireUser();
        const document = await send({
          path: `${libraryPath(type)}/${id}`,
          query: {
            extend: scope.extend,
            "format[resources]": "map",
            include: scope.include,
            l: language(scope),
          },
        });
        return single(document, type, id);
      },
      list: (scope) => page(source(scope)) as never,
      related: (id, relationship, scope = {}) => {
        requireUser();
        return page({
          path: `${libraryPath(type)}/${id}/${relationship}`,
          query: { l: language(scope), limit: scope.limit },
        });
      },
    };
  };

  const songs: SongCollection = {
    ...catalog("songs"),
    credits: async (id, scope = {}) => {
      const document = await send({
        path: `/v1/catalog/${await resolveStorefront(scope)}/songs/${id}/credits`,
        query: { "format[resources]": "map", l: language(scope) },
      });
      return (document.data ?? []).map(hydrator<CreditCategory>(document));
    },
    lyrics: async (id, scope = {}) => {
      const document = await send({
        path: `/v1/catalog/${await resolveStorefront(scope)}/songs/${id}/lyrics`,
        query: { l: language(scope) },
      });
      return String(document.data?.[0]?.attributes?.ttml ?? "");
    },
    syllableLyrics: async (id, scope = {}) => {
      const document = await send({
        path: `/v1/catalog/${await resolveStorefront(scope)}/songs/${id}/syllable-lyrics`,
        query: { l: language(scope) },
      });
      const attributes = document.data?.[0]?.attributes;
      return String(attributes?.ttml ?? attributes?.ttmlLocalizations ?? "");
    },
  };

  const search = async <
    const T extends SearchType = "albums" | "artists" | "playlists" | "songs",
  >(
    term: string,
    scope: PageOptions & { types?: readonly T[] } = {}
  ): Promise<SearchResults<T>> => {
    const types = scope.types ?? ["albums", "artists", "playlists", "songs"];
    const source = {
      path: `/v1/catalog/${await resolveStorefront(scope)}/search`,
      query: { l: language(scope), limit: scope.limit, term, types },
    };
    const document = await send<ResultsDocument<RawRelationship>>({
      ...source,
      query: { ...source.query, "format[resources]": "map" },
    });
    return Object.fromEntries(
      types.map((type) => [
        camelCase(type),
        toPage(
          send,
          {
            path: source.path,
            query: { ...source.query, types: [type] },
            select: (current: ResultsDocument<RawRelationship>) =>
              current.results?.[type],
          },
          document
        ),
      ])
    ) as never;
  };

  const suggestions = async (
    term: string,
    scope: Scope & { types?: readonly SearchType[]; limit?: number } = {}
  ): Promise<Suggestions> => {
    const document = await send<SuggestionsDocument>({
      path: `/v1/catalog/${await resolveStorefront(scope)}/search/suggestions`,
      query: {
        kinds: "terms,topResults",
        l: language(scope),
        "limit[results:terms]": scope.limit,
        "limit[results:topResults]": scope.limit,
        term,
        types: scope.types ?? ["albums", "artists", "playlists", "songs"],
      },
    });
    const entries = document.results?.suggestions ?? [];
    const resolve = hydrator(document);
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
    scope: Scope & { limit?: number } = {}
  ) => {
    const document = await send<HintsDocument>({
      path: `/v1/catalog/${await resolveStorefront(scope)}/search/hints`,
      query: { l: language(scope), limit: scope.limit, term },
    });
    return document.results?.terms ?? [];
  };

  const charts = async <
    const T extends ChartType = "albums" | "playlists" | "songs",
  >(
    scope: PageOptions & {
      types?: readonly T[];
      genre?: string;
      chart?: string;
    } = {}
  ): Promise<Charts<T>> => {
    const types = scope.types ?? ["albums", "playlists", "songs"];
    const path = `/v1/catalog/${await resolveStorefront(scope)}/charts`;
    const query = {
      chart: scope.chart,
      genre: scope.genre,
      l: language(scope),
      limit: scope.limit,
      types,
    };
    const document = await send<ResultsDocument<ChartSlice[]>>({
      path,
      query: { ...query, "format[resources]": "map" },
    });
    return Object.fromEntries(
      types.map((type) => [
        camelCase(type),
        (document.results?.[type] ?? []).map((slice) => ({
          id: slice.chart ?? "",
          name: slice.name ?? "",
          ...toPage(
            send,
            { path, query: { ...query, chart: slice.chart, types: [type] } },
            { ...document, data: slice.data, next: slice.next }
          ),
        })),
      ])
    ) as never;
  };

  const librarySearch = async <
    const T extends LibrarySearchType =
      | "library-albums"
      | "library-artists"
      | "library-playlists"
      | "library-songs",
  >(
    term: string,
    scope: PageOptions & { types?: readonly T[] } = {}
  ): Promise<LibrarySearchResults<T>> => {
    requireUser();
    const types = scope.types ?? [
      "library-albums",
      "library-artists",
      "library-playlists",
      "library-songs",
    ];
    const source = {
      path: "/v1/me/library/search",
      query: { l: language(scope), limit: scope.limit, term, types },
    };
    const document = await send<ResultsDocument<RawRelationship>>({
      ...source,
      query: { ...source.query, "format[resources]": "map" },
    });
    return Object.fromEntries(
      types.map((type) => [
        camelCase(type.slice("library-".length)),
        toPage(
          send,
          {
            path: source.path,
            query: { ...source.query, types: [type] },
            select: (current: ResultsDocument<RawRelationship>) =>
              current.results?.[type],
          },
          document
        ),
      ])
    ) as never;
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
      recentlyAdded: (scope: PageOptions = {}) => {
        requireUser();
        return page<AnyResource>({
          path: "/v1/me/library/recently-added",
          query: { l: language(scope), limit: scope.limit ?? 25 },
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
          query: { l: language(scope), limit: scope.limit },
        }),
    },
  };
};

export type Client = ReturnType<typeof createClient>;
