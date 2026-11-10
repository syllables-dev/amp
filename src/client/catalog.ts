import type { Context } from "@/client/context";
import type {
  GetOptions,
  Located,
  PageOptions,
  Scope,
  ViewArgs,
} from "@/client/options";
import { countExtend } from "@/internal/complete";
import { hydrator } from "@/internal/hydrate";
import type { Query, RawDocument, RawResource } from "@/internal/transport";
import { capOf, chunk, filterLimits } from "@/limits";
import type { CatalogType } from "@/types/registry";
import type {
  AttributeName,
  Defaults,
  Extend,
  Page,
  RelatedExtend,
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

type FilterCaps = typeof filterLimits;

export type CatalogFilter<T extends CatalogType> = T extends keyof FilterCaps
  ? {
      [K in keyof FilterCaps[T]]: { readonly [P in K]: readonly string[] };
    }[keyof FilterCaps[T]]
  : never;

export type FilterOptions<
  T extends CatalogType,
  I extends Relationship<T>,
  F extends AttributeName<T>,
  E extends Extend<T>,
  X extends RelatedExtend<T>,
> = Omit<GetOptions<T, I, F, E, never, X>, "viewLimits" | "views">;

export interface CatalogCollection<T extends CatalogType> {
  filter: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const X extends RelatedExtend<T> = never,
  >(
    by: CatalogFilter<T>,
    options?: FilterOptions<T, I, F, E, X>
  ) => Promise<Resource<T, I | Defaults<T>, F, E, X>[]>;
  get: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
    const X extends RelatedExtend<T> = never,
  >(
    id: string,
    options?: GetOptions<T, I, F, E, V, X> & Located<V>
  ) => Promise<Resource<T, I | Defaults<T>, F, E, X> & WithViews<T, V>>;
  getMany: <
    const I extends Relationship<T> = never,
    const F extends AttributeName<T> = AttributeName<T>,
    const E extends Extend<T> = never,
    const V extends View<T> = never,
    const X extends RelatedExtend<T> = never,
  >(
    ids: readonly string[],
    options?: GetOptions<T, I, F, E, V, X> & Located<V>
  ) => Promise<(Resource<T, I | Defaults<T>, F, E, X> & WithViews<T, V>)[]>;
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

export const createCatalog =
  (context: Context) =>
  <T extends CatalogType>(type: T): CatalogCollection<T> => {
    type AnyGetOptions = Omit<
      GetOptions<T, Relationship<T>, AttributeName<T>, Extend<T>, View<T>>,
      "extendRelated" | "meta" | "viewLimits"
    > & {
      extendRelated?: Readonly<Partial<Record<string, readonly string[]>>>;
      geoHash?: string;
      meta?: Readonly<Partial<Record<string, readonly string[]>>>;
      viewLimits?: Readonly<Partial<Record<string, number>>>;
    };
    const counter = countExtend(type);
    const addedCount = (scope: AnyGetOptions) =>
      counter !== undefined &&
      scope.complete !== false &&
      !scope.extend?.some((name) => name === counter)
        ? [counter]
        : [];
    const relatedNames = (scope: AnyGetOptions) =>
      Object.values(scope.extendRelated ?? {}).flatMap((names) => names ?? []);
    const extendNames = (scope: AnyGetOptions) => {
      const names = [
        ...new Set([
          ...(scope.extend ?? []),
          ...relatedNames(scope),
          ...addedCount(scope),
        ]),
      ];
      return names.length > 0 ? names : undefined;
    };
    const query = (scope: AnyGetOptions): Query => ({
      extend: extendNames(scope),
      [`fields[${type}]`]: scope.fields && [
        ...scope.fields,
        ...addedCount(scope),
      ],
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
    const finish = async (
      document: RawDocument,
      ref: RawResource,
      scope: AnyGetOptions
    ) => {
      const relatedExtend = relatedNames(scope);
      const resource = await context.expand<Resource<T, Defaults<T>>>(
        document,
        ref,
        scope.complete === false
          ? undefined
          : {
              extend: relatedExtend.length > 0 ? relatedExtend : undefined,
              l: context.language(scope),
            }
      );
      for (const name of addedCount(scope)) {
        delete (resource as Record<string, unknown>)[name];
      }
      return resource;
    };
    const filter = async (
      by: Record<string, readonly string[]>,
      scope: AnyGetOptions
    ) => {
      const path = await context.catalogPath(scope, type);
      const documents = await Promise.all(
        Object.entries(by).flatMap(([name, values]) =>
          chunk(values, capOf(filterLimits, type, name) ?? values.length).map(
            (group) =>
              context.sendMap({
                path,
                query: { ...query(scope), [`filter[${name}]`]: group },
              })
          )
        )
      );
      return Promise.all(
        documents.flatMap((document) =>
          (document.data ?? []).map((ref) =>
            finish(
              document,
              context.locate(document, ref.type, ref.id) ?? ref,
              scope
            )
          )
        )
      );
    };
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
        return finish(document, ref, scope);
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
      filter: (by, scope) =>
        filter(by as Record<string, readonly string[]>, scope ?? {}) as never,
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
