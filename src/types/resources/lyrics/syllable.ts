import type {
  LyricsPlayParams,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface SyllableLyricsAttributes {
  playParams: LyricsPlayParams;
  ttml?: string;
}

export interface SyllableLyricsExtended {
  ttmlLocalizations?: string;
}

export interface SyllableLyricsEntry {
  attributes: SyllableLyricsAttributes;
  defaults: never;
  embedded: never;
  extended: SyllableLyricsExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
