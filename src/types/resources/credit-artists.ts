import type {
  Artwork,
  NoExtend,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface CreditArtistAttributes {
  artwork?: Artwork;
  name: string;
  roleNames: string[];
}

export interface CreditArtistsEntry {
  attributes: CreditArtistAttributes;
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
