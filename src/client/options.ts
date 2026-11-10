import type { Token } from "@/types/common";
import type { CatalogType, LibraryType } from "@/types/registry";
import type {
  AttributeName,
  Extend,
  RelatedExtend,
  Relationship,
  UpTo,
  View,
  ViewLimit,
} from "@/types/resource";
import type { RecommendationExtend } from "@/types/resources/personal-recommendation";

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

export interface RecommendationOptions<E extends RecommendationExtend> {
  extend?: readonly E[];
  language?: string;
  name?: "listen-now" | "search-landing";
  timezone?: string;
}

export interface PageOptions<L extends number = number> extends Scope {
  limit?: L;
  offset?: number;
}

export type TrackMeta<T extends CatalogType> = T extends "albums"
  ? { readonly tracks?: readonly "popularity"[] }
  : never;

export interface GetOptions<
  T extends CatalogType,
  I extends Relationship<T>,
  F extends AttributeName<T>,
  E extends Extend<T>,
  V extends View<T>,
  X extends RelatedExtend<T> = RelatedExtend<T>,
> extends Scope {
  complete?: boolean;
  extend?: readonly E[];
  extendRelated?: X;
  fields?: readonly F[];
  include?: readonly I[];
  meta?: TrackMeta<T>;
  viewLimits?: { readonly [K in V]?: ViewLimit<T, K> };
  views?: readonly V[];
}

export type Located<V extends string> = "nearby-upcoming-concerts" extends V
  ? { geoHash: string }
  : { geoHash?: never };

export type ViewArgs<
  V extends string,
  L extends number,
> = "nearby-upcoming-concerts" extends V
  ? [options: PageOptions<L> & Located<V>]
  : [options?: PageOptions<L>];

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
