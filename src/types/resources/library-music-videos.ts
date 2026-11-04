import type {
  Artwork,
  LibraryExtended,
  LibraryPlayParams,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface LibraryMusicVideoAttributes {
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  durationInMillis: number;
  genreNames: string[];
  name: string;
  playParams: LibraryPlayParams<"musicVideo">;
  releaseDate?: string;
  trackNumber?: number;
}

export type LibraryMusicVideo = Resource<"library-music-videos">;

export interface LibraryMusicVideosEntry {
  attributes: LibraryMusicVideoAttributes;
  defaults: never;
  extended: LibraryExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: {
    albums: "library-albums";
    artists: "library-artists";
    catalog: "music-videos";
  };
  singleOnly: never;
  views: NoViews;
}
