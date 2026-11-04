import type { NoRelationships, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface GenreAttributes {
  name: string;
  parentId?: string;
  parentName?: string;
  url: string;
}

export interface GenreExtended {
  chartLabel: string;
}

export type Genre = Resource<"genres">;

export interface GenresEntry {
  attributes: GenreAttributes;
  defaults: never;
  extended: GenreExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
