import type { NoExtend, NoRelationships, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface StorefrontAttributes {
  defaultLanguageTag: string;
  explicitContentPolicy: "allowed" | "opt-in" | "prohibited" | (string & {});
  name: string;
  supportedLanguageTags: string[];
}

export type Storefront = Resource<"storefronts">;

export interface StorefrontsEntry {
  attributes: StorefrontAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
