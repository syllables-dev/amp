// biome-ignore-all lint/performance/noBarrelFile: file defines package public surface

export { type ConcertCity, concertCities } from "@/cities";
export type {
  CatalogCollection,
  CatalogFilter,
  FilterOptions,
  SongCollection,
} from "@/client/catalog";
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
  RecommendationOptions,
  Scope,
} from "@/client/options";
export type { SearchResults } from "@/client/search";
export { AmpError, type ApiError } from "@/errors";
export type { Operations } from "@/generated/operations";
export type * from "@/types/common";
export type * from "@/types/registry";
export type * from "@/types/resource";
export type * from "@/types/resources/albums";
export type * from "@/types/resources/analysis/audio";
export type * from "@/types/resources/analysis/flexml";
export type * from "@/types/resources/apple-curators";
export type * from "@/types/resources/artists";
export type * from "@/types/resources/concerts";
export type * from "@/types/resources/credits/artists";
export type * from "@/types/resources/credits/categories";
export type * from "@/types/resources/curators";
export type * from "@/types/resources/editorial-items";
export type * from "@/types/resources/genres";
export type * from "@/types/resources/library/albums";
export type * from "@/types/resources/library/artists";
export type * from "@/types/resources/library/music-videos";
export type * from "@/types/resources/library/playlists";
export type * from "@/types/resources/library/songs";
export type * from "@/types/resources/lyrics/plain";
export type * from "@/types/resources/lyrics/syllable";
export type * from "@/types/resources/music-movies";
export type * from "@/types/resources/music-videos";
export type * from "@/types/resources/personal-recommendation";
export type * from "@/types/resources/playlists";
export type * from "@/types/resources/record-labels";
export type * from "@/types/resources/social-profiles";
export type * from "@/types/resources/songs";
export type * from "@/types/resources/stations";
export type * from "@/types/resources/storefronts";
export type * from "@/types/resources/uploaded-videos";
export type * from "@/types/resources/venues";
