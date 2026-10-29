import { type Context, unprefix } from "@/client/context";
import type {
  LibraryListOptions,
  LibraryOptions,
  PageOptions,
} from "@/client/options";
import { searchPages } from "@/client/search";
import { camelCase } from "@/internal/hydrate";
import { walk } from "@/internal/pages";
import type {
  CamelCase,
  Extend,
  LibrarySearchType,
  LibraryType,
  Listable,
  Page,
  RecentlyAddedType,
  Relationship,
  RelationshipLimit,
  Resource,
  Target,
  UpTo,
} from "@/types";

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

export type LibrarySearchResults<T extends LibrarySearchType> = {
  [K in T as CamelCase<K extends `library-${infer Rest}` ? Rest : K>]: Page<
    Resource<K>
  >;
};

const librarySearchTypes = [
  "library-albums",
  "library-artists",
  "library-playlists",
  "library-songs",
] as const;

const libraryPath = (type: LibraryType) => `/v1/me/library/${unprefix(type)}`;

export const createLibrary = (context: Context) => {
  const collection = <T extends LibraryType>(type: T): LibraryCollection<T> => {
    const query = (scope: LibraryOptions<T, Relationship<T>, Extend<T>>) => ({
      extend: scope.extend,
      include: scope.include,
      l: context.language(scope),
    });
    const source = (
      scope: LibraryListOptions<T, Relationship<T>, Extend<T>> = {}
    ) => {
      context.requireUser();
      return {
        path: libraryPath(type),
        query: { ...query(scope), limit: scope.limit ?? 100, sort: scope.sort },
      };
    };
    return {
      all: (scope) => walk(context.sendMap, source(scope)) as never,
      get: async (id, scope = {}) => {
        context.requireUser();
        const document = await context.sendMap({
          path: `${libraryPath(type)}/${id}`,
          query: query(scope),
        });
        return context.single(document, type, id, scope);
      },
      list: (scope) => context.page(source(scope)) as never,
      related: (id, relationship, scope = {}) => {
        context.requireUser();
        return context.page({
          path: `${libraryPath(type)}/${id}/${relationship}`,
          query: context.pageQuery(scope),
        });
      },
    };
  };

  const search = async <
    const T extends LibrarySearchType = (typeof librarySearchTypes)[number],
  >(
    term: string,
    scope: PageOptions<UpTo<25>> & { types?: readonly T[] } = {}
  ): Promise<LibrarySearchResults<T>> => {
    context.requireUser();
    return (await searchPages(
      context,
      "/v1/me/library/search",
      { ...context.pageQuery(scope), term },
      scope.types ?? librarySearchTypes,
      (type) => camelCase(unprefix(type))
    )) as never;
  };

  return {
    albums: collection("library-albums"),
    artists: collection("library-artists"),
    musicVideos: collection("library-music-videos"),
    playlists: collection("library-playlists"),
    recentlyAdded: (scope: PageOptions<UpTo<25>> = {}) => {
      context.requireUser();
      return context.page<Resource<RecentlyAddedType>>({
        path: "/v1/me/library/recently-added",
        query: { ...context.pageQuery(scope), limit: scope.limit ?? 25 },
      });
    },
    search,
    songs: collection("library-songs"),
  };
};
