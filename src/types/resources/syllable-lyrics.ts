import type {
  LyricsPlayParams,
  NoExtend,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface SyllableLyricsAttributes {
  playParams: LyricsPlayParams;
  ttml: string;
}

export interface SyllableLyricsEntry {
  attributes: SyllableLyricsAttributes;
  defaults: never;
  embedded: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
