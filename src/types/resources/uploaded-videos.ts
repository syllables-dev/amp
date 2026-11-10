import type {
  Artwork,
  EditorialArtwork,
  EditorialCards,
  EditorialNotes,
  EditorialVideo,
  NoRelationships,
  NoViews,
  PlayParams,
} from "@/types/common";

export interface UploadedVideoAttributes {
  artistName: string;
  artwork: Artwork;
  assetTokens: Record<string, string>;
  contentRatingsBySystem: Record<string, unknown>;
  durationInMilliseconds: number;
  editorialArtwork?: EditorialArtwork;
  editorialNotes?: EditorialNotes;
  editorialVideo?: EditorialVideo;
  name: string;
  playParams: PlayParams<"uploadedVideo">;
  postUrl: string;
  uploadDate: string;
  uploadingArtistName?: string;
}

export interface UploadedVideosEntry {
  attributes: UploadedVideoAttributes;
  defaults: never;
  embedded: never;
  extended: EditorialCards;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
