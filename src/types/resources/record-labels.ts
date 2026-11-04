import type {
  Artwork,
  EditorialArtwork,
  EditorialNotes,
  NoExtend,
  NoRelationships,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface RecordLabelAttributes {
  artwork: Artwork;
  description?: EditorialNotes;
  editorialArtwork: EditorialArtwork;
  name: string;
  url: string;
}

export interface RecordLabelViews {
  "latest-releases": "albums";
  "top-releases": "albums";
}

export type RecordLabel = Resource<"record-labels">;

export interface RecordLabelsEntry {
  attributes: RecordLabelAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: RecordLabelViews;
}
