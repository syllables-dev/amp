import type {
  LyricsPlayParams,
  NoExtend,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface LyricsAttributes {
  playParams: LyricsPlayParams;
  ttml: string;
}

export interface LyricsEntry {
  attributes: LyricsAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
