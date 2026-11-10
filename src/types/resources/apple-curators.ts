import type {
  Artwork,
  EditorialNotes,
  EditorialVideo,
  NoViews,
} from "@/types/common";
import type { CuratorExtended } from "@/types/resources/curators";

export interface AppleCuratorAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNotes;
  kind: "Curator" | "Genre" | "Show" | (string & {});
  name: string;
  shortName: string;
  showHostName?: string;
  url: string;
}

export interface AppleCuratorExtended extends CuratorExtended {
  editorialVideo?: EditorialVideo;
}

export interface AppleCuratorsEntry {
  attributes: AppleCuratorAttributes;
  defaults: never;
  embedded: never;
  extended: AppleCuratorExtended;
  optional: never;
  partial: never;
  refs: "playlists";
  relationships: { playlists: "playlists" };
  singleOnly: never;
  views: NoViews;
}
