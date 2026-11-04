import type {
  Artwork,
  NoExtend,
  NoRelationships,
  NoViews,
} from "@/types/common";

export interface SocialProfileAttributes {
  artwork?: Artwork;
  handle?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  name: string;
  url?: string;
}

export interface SocialProfilesEntry {
  attributes: SocialProfileAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
