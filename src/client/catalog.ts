import type { Context } from "@/client/context";
import type { GetOptions, PageOptions, Scope } from "@/client/options";
import { hydrator } from "@/internal/hydrate";
import type { Query } from "@/internal/transport";
import type {
  AttributeName,
  CatalogType,
  CreditCategory,
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
} from "@/types";

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

export interface SongCollection extends CatalogCollection<"songs"> {
  credits: (id: string, options?: Scope) => Promise<CreditCategory[]>;
  lyrics: (id: string, options?: Scope) => Promise<string>;
  syllableLyrics: (id: string, options?: Scope) => Promise<string>;
}

export const createCatalog =
  (context: Context) =>
  <T extends CatalogType>(type: T): CatalogCollection<T> => {
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
      l: context.language(scope),
      views: scope.views,
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
        return context.expand<Resource<T, Defaults<T>>>(document, ref, scope);
      }
      if (missing === "throw") {
        throw context.notFound(type, id);
      }
    };
    const related = async <R>(
      id: string,
      segment: string,
      scope: PageOptions
    ) =>
      context.page<R>({
        path: await context.catalogPath(scope, type, id, segment),
        query: context.pageQuery(scope),
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
