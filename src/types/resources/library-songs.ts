import type {
  Artwork,
  ContentRating,
  LibraryExtended,
  LibraryPlayParams,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface LibrarySongAttributes {
  albumName: string;
  artistName: string;
  artwork?: Artwork;
  contentRating?: ContentRating;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  name: string;
  playParams?: LibraryPlayParams<"song">;
  releaseDate?: string;
  trackNumber: number;
}

export type LibrarySong = Resource<"library-songs">;

export interface LibrarySongsEntry {
  attributes: LibrarySongAttributes;
  defaults: never;
  embedded: never;
  extended: LibraryExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: {
    albums: "library-albums";
    artists: "library-artists";
    catalog: "songs";
  };
  singleOnly: never;
  views: NoViews;
}
