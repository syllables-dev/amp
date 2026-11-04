import type {
  Artwork,
  EditorialArtwork,
  LibraryExtended,
  LibraryPlayParams,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface LibraryAlbumAttributes {
  artistName: string;
  artwork: Artwork;
  dateAdded: string;
  genreNames: string[];
  name: string;
  playParams: LibraryPlayParams<"album">;
  releaseDate?: string;
  trackCount: number;
}

export interface LibraryAlbumExtended extends LibraryExtended {
  editorialArtwork: EditorialArtwork;
}

export type LibraryAlbum = Resource<"library-albums">;

export interface LibraryAlbumsEntry {
  attributes: LibraryAlbumAttributes;
  defaults: never;
  extended: LibraryAlbumExtended;
  optional: never;
  partial: "artists";
  refs: never;
  relationships: {
    artists: "library-artists";
    catalog: "albums";
    tracks: "library-music-videos" | "library-songs";
  };
  singleOnly: "tracks";
  views: NoViews;
}
