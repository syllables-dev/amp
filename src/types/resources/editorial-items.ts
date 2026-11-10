import type {
  EditorialArtwork,
  EditorialCards,
  EditorialNotes,
  NoRelationships,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface EditorialLink {
  feature: "external" | (string & {});
  target: "external" | (string & {});
  url: string;
}

export interface EditorialItemAttributes {
  editorialArtwork: EditorialArtwork;
  editorialNotes: EditorialNotes;
  link: EditorialLink;
  url: string;
}

export type EditorialItem = Resource<"editorial-items">;

export interface EditorialItemsEntry {
  attributes: EditorialItemAttributes;
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
