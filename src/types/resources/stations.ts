import type {
  Artwork,
  ContentRating,
  EditorialArtwork,
  EditorialCard,
  EditorialNotes,
  EditorialVideo,
  NoRelationships,
  NoViews,
  PlainEditorialCard,
  PlayParams,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface StationPlayParams extends PlayParams<"radioStation"> {
  format: "stream" | "tracks" | (string & {});
  hasDrm: boolean;
  mediaType: number;
  stationHash: string;
  streamingKind?: number;
}

export interface StationAttributes {
  airTime?: { end: string; start: string };
  appBundleId?: string;
  artwork: Artwork;
  band?: string;
  contentRating?: ContentRating;
  durationInMillis?: number;
  editorialNotes?: EditorialNotes;
  frequency?: string;
  isLive: boolean;
  kind:
    | "artistSeeded"
    | "discovery"
    | "editorial"
    | "query"
    | "songSeeded"
    | "streaming"
    | "user"
    | (string & {});
  mediaKind: "audio" | "video" | (string & {});
  name: string;
  playParams: StationPlayParams;
  radioUrl: string;
  requiresSubscription: boolean;
  stationProviderName?: string;
  streamingRadioSubType?: string;
  supportedDrms?: string[];
  url: string;
}

export interface StationExtended {
  editorialArtwork: EditorialArtwork;
  editorialCard?: Record<string, EditorialCard>;
  editorialVideo?: EditorialVideo;
  plainEditorialCard?: Record<string, PlainEditorialCard>;
  plainEditorialNotes?: EditorialNotes;
}

export type Station = Resource<"stations">;

export interface StationsEntry {
  attributes: StationAttributes;
  defaults: never;
  embedded: never;
  extended: StationExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
