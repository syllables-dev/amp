import type {
  Artwork,
  EditorialArtwork,
  EditorialNotes,
  LibraryExtended,
  LibraryPlayParams,
  NoViews,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface LibraryPlaylistAttributes {
  artwork?: Artwork;
  canDelete: boolean;
  canEdit: boolean;
  dateAdded: string;
  description?: EditorialNotes;
  hasCatalog: boolean;
  hasCollaboration: boolean;
  isPublic: boolean;
  lastModifiedDate?: string;
  name: string;
  playParams: LibraryPlayParams<"playlist">;
}

export interface LibraryPlaylistExtended extends LibraryExtended {
  editorialArtwork: EditorialArtwork;
  isCollaborativeHost: boolean;
  trackCount: number;
}

export type LibraryPlaylist = Resource<"library-playlists">;

export interface LibraryPlaylistsEntry {
  attributes: LibraryPlaylistAttributes;
  defaults: never;
  embedded: never;
  extended: LibraryPlaylistExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: {
    catalog: "playlists";
    tracks: "library-music-videos" | "library-songs";
  };
  singleOnly: "tracks";
  views: NoViews;
}
