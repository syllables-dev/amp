import type { Context } from "@/client/context";
import type {
  GetOptions,
  Located,
  PageOptions,
  Scope,
  ViewArgs,
} from "@/client/options";
import { hydrator } from "@/internal/hydrate";
import type { Query } from "@/internal/transport";
import type { CatalogType } from "@/types/registry";
import type {
  AttributeName,
  Defaults,
  Extend,
  Page,
  Relationship,
  RelationshipLimit,
  Resource,
  Target,
  View,
  ViewLimit,
  ViewTarget,
  WithViews,
} from "@/types/resource";
import type { CreditCategory } from "@/types/resources/role-categories";

export interface CatalogCollection<T extends CatalogType> {
  get: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
  >(
    id: string,
    options?: GetOptions<T, I, F, E, V> & Located<V>
  ) => Promise<Resource<T, I | Defaults<T>, F, E> & WithViews<T, V>>;
  getMany: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
  >(
    ids: readonly string[],
    options?: GetOptions<T, I, F, E, V> & Located<V>
  ) => Promise<(Resource<T, I | Defaults<T>, F, E> & WithViews<T, V>)[]>;
  related: <R extends Relationship<T>>(
    id: string,
    relationship: R,
    options?: PageOptions<RelationshipLimit<T, R>>
  ) => Promise<Page<Resource<Target<T, R>>>>;
  view: <V extends View<T>>(
    id: string,
    view: V,
    ...[options]: ViewArgs<V, ViewLimit<T, V>>
  ) => Promise<Page<Resource<ViewTarget<T, V>>>>;
}

export interface SongCollection extends CatalogCollection<"songs"> {
  credits: (id: string, options?: Scope) => Promise<CreditCategory[]>;
  lyrics: (id: string, options?: Scope) => Promise<string>;
  syllableLyrics: (id: string, options?: Scope) => Promise<string>;
}

const countExtends: Partial<Record<CatalogType, string>> = {
  playlists: "trackCount",
};

export const createCatalog =
  (context: Context) =>
  <T extends CatalogType>(type: T): CatalogCollection<T> => {
    type AnyGetOptions = Omit<
      GetOptions<T, Relationship<T>, AttributeName<T>, Extend<T>, View<T>>,
      "meta" | "viewLimits"
    > & {
      geoHash?: string;
      meta?: Readonly<Partial<Record<string, readonly string[]>>>;
      viewLimits?: Readonly<Partial<Record<string, number>>>;
    };
    const counter = countExtends[type];
    const addsCount = (scope: AnyGetOptions) =>
      counter !== undefined &&
      scope.complete !== false &&
      !scope.extend?.some((name) => name === counter);
    const withCount = (
      names: readonly string[] | undefined,
      scope: AnyGetOptions
    ) => (counter && addsCount(scope) ? [...(names ?? []), counter] : names);
    const query = (scope: AnyGetOptions): Query => ({
      extend: withCount(scope.extend, scope),
      [`fields[${type}]`]:
        scope.fields && withCount(scope.fields.map(String), scope),
      geoHashLocation: scope.geoHash,
      include: scope.include,
      l: context.language(scope),
      views: scope.views,
      ...Object.fromEntries(
        Object.entries(scope.meta ?? {}).map(([relationship, names]) => [
          `meta[${type}:${relationship}]`,
          names,
        ])
      ),
      ...Object.fromEntries(
        Object.entries(scope.viewLimits ?? {}).map(([view, limit]) => [
          `limit[${type}:${view}]`,
          limit,
        ])
      ),
    });
    const fetchOne = async (
      id: string,
      scope: AnyGetOptions,
      missing: "throw" | "skip"
    ) => {
      const document = scope.views?.length
        ? await context.sendMap({
            path: await context.catalogPath(scope, type, id),
            query: query(scope),
          })
        : await context.batch(
            await context.resolveStorefront(scope),
            type,
            id,
            query(scope)
          );
      const ref = context.locate(document, type, id);
      if (ref) {
        const resource = await context.expand<Resource<T, Defaults<T>>>(
          document,
          ref,
          scope
        );
        if (counter && addsCount(scope)) {
          delete (resource as Record<string, unknown>)[counter];
        }
        return resource;
      }
      if (missing === "throw") {
        throw context.notFound(type, id);
      }
    };
    const related = async <R>(
      id: string,
      segment: string,
      scope: PageOptions & { geoHash?: string }
    ) =>
      context.page<R>({
        path: await context.catalogPath(scope, type, id, segment),
        query: { ...context.pageQuery(scope), geoHashLocation: scope.geoHash },
      });
    return {
      get: (id, scope) => fetchOne(id, scope ?? {}, "throw") as never,
      getMany: async (ids, scope) =>
        (
          await Promise.all(ids.map((id) => fetchOne(id, scope ?? {}, "skip")))
        ).filter((resource) => resource !== undefined) as never,
      related: (id, relationship, scope = {}) =>
        related(id, relationship, scope),
      view: (id, view, ...[scope]) => related(id, `view/${view}`, scope ?? {}),
    };
  };

export const createSongs = (context: Context): SongCollection => {
  const lyricsAttributes = async (id: string, kind: string, scope: Scope) => {
    const document = await context.send({
      path: await context.catalogPath(scope, "songs", id, kind),
      query: { l: context.language(scope) },
    });
    return document.data?.[0]?.attributes;
  };
  return {
    ...createCatalog(context)("songs"),
    credits: async (id, scope = {}) => {
      const document = await context.sendMap({
        path: await context.catalogPath(scope, "songs", id, "credits"),
        query: { l: context.language(scope) },
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
};
