import type {
  AttributeName,
  CatalogType,
  Extend,
  LibraryType,
  Relationship,
  Token,
  UpTo,
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
