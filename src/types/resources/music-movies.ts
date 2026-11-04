import type {
  Artwork,
  EditorialNotes,
  NoExtend,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface MusicMovieAttributes {
  artistName?: string;
  artwork: Artwork;
  contentRatingsBySystem?: Record<string, unknown>;
  copyright?: string;
  description?: EditorialNotes;
  genreNames?: string[];
  movieClips?: Record<string, unknown>[];
  name: string;
  offers?: Record<string, unknown>[];
  releaseDate?: string;
  studioName?: string;
  supportedLocales?: Record<string, unknown>;
  url: string;
  videoTraits?: string[];
}

export interface MusicMoviesEntry {
  attributes: MusicMovieAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
