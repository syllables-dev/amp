import type {
  Artwork,
  AudioTrait,
  ContentRating,
  EditorialArtwork,
  EditorialNotes,
  NoViews,
  Offer,
  PlayParams,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface AudioPreview {
  url: string;
}

export interface ExtendedAssetUrls {
  enhancedHls?: string;
  lightweight?: string;
  lightweightPlus?: string;
  plus?: string;
  superLightweight?: string;
}

export interface SongAttributes {
  albumArtistName: string;
  albumName: string;
  artistName: string;
  artwork: Artwork;
  attribution?: string;
  audioLocale: string;
  audioTraits: AudioTrait[];
  composerName?: string;
  contentRating?: ContentRating;
  discNumber: number;
  durationInMillis: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isrc: string;
  isVocalAttenuationAllowed: boolean;
  movementCount?: number;
  movementName?: string;
  movementNumber?: number;
  name: string;
  playParams?: PlayParams<"song">;
  previews: AudioPreview[];
  releaseDate: string;
  trackNumber: number;
  url: string;
  workName?: string;
}

export interface SpatialOffsets {
  alignmentDurationLimitInMilliseconds: number;
  endOffsetInMilliseconds: number;
  isCloseMatch: boolean;
  isLongAudio: boolean;
  offsets: { offsetInMilliseconds: number; timeStampInMilliseconds: number }[];
  spatialLeadingSilenceInMilliseconds: number;
  spatialTrailingSilenceInMilliseconds: number;
  startOffsetInMilliseconds: number;
  stereoLeadingSilenceInMilliseconds: number;
  stereoTrailingSilenceInMilliseconds: number;
  timeDrift: number;
  version: number;
}

export interface UniversalTag {
  namespace:
    | "EditorialEra"
    | "EditorialEvents"
    | "EditorialGenres"
    | "EditorialMoodsAndActivities"
    | (string & {});
  score: number;
  tag: string;
}

export interface SongExtended {
  artistUrl: string;
  editorialArtwork: EditorialArtwork;
  extendedAssetUrls?: ExtendedAssetUrls;
  lyricsExcerpt?: string;
  offers: Offer[];
  spatialOffsets?: SpatialOffsets;
  supportsSelfieSing: boolean;
  supportsSmartTransitions: boolean;
  unitags2: UniversalTag[];
}

export type Song = Resource<"songs">;

export interface LyricSnippet {
  kind: "lyric" | (string & {});
  text: string;
}

export type LyricMatch = Song & { meta?: { snippets?: LyricSnippet[] } };

export interface SongsEntry {
  attributes: SongAttributes;
  defaults: never;
  extended: SongExtended;
  optional: "library" | "lyrics";
  partial: never;
  refs: "albums" | "artists";
  relationships: {
    albums: "albums";
    artists: "artists";
    "audio-analysis": "audio-analysis";
    composers: "artists";
    credits: "role-categories";
    "flexml-analysis": "flexml-analysis";
    genres: "genres";
    library: "library-songs";
    lyrics: "lyrics";
    "music-videos": "music-videos";
    "raw-genres": "genres";
    station: "stations";
  };
  singleOnly: never;
  views: NoViews;
}
