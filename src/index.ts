// biome-ignore-all lint/performance/noBarrelFile: file defines package public surface
export type { CatalogCollection, SongCollection } from "@/client/catalog";
export type { ChartExtra, Charts } from "@/client/charts";
export { type Client, createClient } from "@/client/index";
export type {
  LibraryCollection,
  LibrarySearchResults,
} from "@/client/library";
export type {
  ClientOptions,
  GetOptions,
  LibraryListOptions,
  LibraryOptions,
  LibrarySort,
  PageOptions,
  Scope,
} from "@/client/options";
export type { SearchResults } from "@/client/search";
export { AmpError, type ApiError } from "@/errors";
export type { Operations } from "@/generated/operations";
export type * from "@/types";
