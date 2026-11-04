import type {
  Artwork,
  AudioTrait,
  ContentRating,
  EditorialArtwork,
  EditorialCard,
  EditorialNotes,
  EditorialVideo,
  Offer,
  PlainEditorialCard,
  PlayParams,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface AlbumAttributes {
  artistName: string;
  artwork: Artwork;
  audioTraits: AudioTrait[];
  classicalUrl?: string;
  contentRating?: ContentRating;
  copyright?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isPrerelease: boolean;
  isSingle: boolean;
  name: string;
  playParams?: PlayParams<"album">;
  recordLabel: string;
  releaseDate: string;
  trackCount: number;
  upc: string;
  url: string;
}

export interface AlbumExtended {
  artistUrl?: string;
  editorialArtwork: EditorialArtwork;
  editorialCard?: Record<string, EditorialCard>;
  editorialVideo?: EditorialVideo;
  offers: Offer[];
  plainEditorialCard?: Record<string, PlainEditorialCard>;
  plainEditorialNotes?: EditorialNotes;
  versionHash: string;
}

export interface AlbumViews {
  "appears-on": "playlists";
  "audio-extras": "stations";
  "more-by-artist": "albums";
  "other-versions": "albums";
  "related-videos": "music-videos";
  "video-extras": "uploaded-videos";
  "you-might-also-like": "albums";
}

export type Album = Resource<"albums">;

export interface AlbumsEntry {
  attributes: AlbumAttributes;
  defaults: "tracks";
  extended: AlbumExtended;
  optional: "library";
  partial: never;
  refs: "artists";
  relationships: {
    artists: "artists";
    genres: "genres";
    library: "library-albums";
    "record-labels": "record-labels";
    tracks: "music-videos" | "songs";
  };
  singleOnly: never;
  views: AlbumViews;
}
