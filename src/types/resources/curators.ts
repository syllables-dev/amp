import type {
  Artwork,
  EditorialArtwork,
  EditorialNotes,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface CuratorAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNotes;
  name: string;
  url: string;
}

export interface CuratorExtended {
  editorialArtwork: EditorialArtwork;
  plainEditorialNotes?: EditorialNotes;
  playlistCount: number;
}

export type Curator = Resource<"curators">;

export interface CuratorsEntry {
  attributes: CuratorAttributes;
  defaults: never;
  extended: CuratorExtended;
  optional: never;
  partial: never;
  refs: "playlists";
  relationships: { playlists: "playlists" };
  singleOnly: never;
  views: NoViews;
}
