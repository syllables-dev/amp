import type {
  Artwork,
  ContentRating,
  EditorialArtwork,
  EditorialCards,
  EditorialNotes,
  Offer,
  PlayParams,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface VideoPreview {
  artwork: Artwork;
  hlsUrl: string;
  url: string;
}

export interface MusicVideoAttributes {
  albumArtistName?: string;
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  discNumber?: number;
  durationInMillis: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  has4K: boolean;
  hasHDR: boolean;
  isrc: string;
  name: string;
  playParams: PlayParams<"musicVideo">;
  previews: VideoPreview[];
  releaseDate: string;
  trackNumber?: number;
  url: string;
  videoTraits: string[];
}

export interface MusicVideoExtended extends EditorialCards {
  artistUrl: string;
  editorialArtwork: EditorialArtwork;
  offers: Offer[];
  plainEditorialNotes?: EditorialNotes;
}

export interface MusicVideoViews {
  "more-by-artist": "music-videos";
  "more-in-genre": "music-videos";
}

export type MusicVideo = Resource<"music-videos">;

export interface MusicVideosEntry {
  attributes: MusicVideoAttributes;
  defaults: never;
  embedded: never;
  extended: MusicVideoExtended;
  optional: "library";
  partial: never;
  refs: "albums" | "artists";
  relationships: {
    albums: "albums";
    artists: "artists";
    genres: "genres";
    library: "library-music-videos";
    songs: "songs";
  };
  singleOnly: never;
  views: MusicVideoViews;
}
