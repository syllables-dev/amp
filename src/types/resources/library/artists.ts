import type { LibraryExtended, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface LibraryArtistAttributes {
  name: string;
}

export type LibraryArtist = Resource<"library-artists">;

export interface LibraryArtistsEntry {
  attributes: LibraryArtistAttributes;
  defaults: never;
  embedded: never;
  extended: LibraryExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: { albums: "library-albums"; catalog: "artists" };
  singleOnly: "albums";
  views: NoViews;
}
