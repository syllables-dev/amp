// biome-ignore-all lint/performance/noBarrelFile: file defines package public surface
export {
  type CatalogCollection,
  type Charts,
  type Client,
  type ClientOptions,
  createClient,
  type GetOptions,
  type LibraryCollection,
  type LibraryListOptions,
  type LibraryOptions,
  type LibrarySearchResults,
  type LibrarySort,
  type PageOptions,
  type Scope,
  type SearchResults,
  type SongCollection,
} from "@/client";
export { AmpError, type ApiError } from "@/errors";
export type { Operations } from "@/generated/operations";
export type * from "@/types";
