import type {
  Artwork,
  AudioTrait,
  EditorialArtwork,
  EditorialCard,
  EditorialNotes,
  EditorialVideo,
  PlainEditorialCard,
  PlayParams,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface ChartLocation {
  countryCode: string;
  name: string;
}

export interface PlaylistPlayParams extends PlayParams<"playlist"> {
  versionHash: string;
}

export interface PlaylistAttributes {
  artwork?: Artwork;
  audioTraits: AudioTrait[];
  curatorName?: string;
  curatorSocialHandle?: string;
  description?: EditorialNotes;
  editorialNotes?: EditorialNotes;
  editorialPlaylistKind?: string;
  editorialPlaylistSubKind?: string;
  hasCollaboration: boolean;
  isChart: boolean;
  lastModifiedDate?: string;
  name: string;
  playlistType:
    | "editorial"
    | "external"
    | "personal-mix"
    | "replay"
    | "user-shared"
    | (string & {});
  playParams: PlaylistPlayParams;
  supportsSing: boolean;
  url: string;
}

export interface PlaylistExtended {
  artistNamesList?: string[];
  editorialArtwork: EditorialArtwork;
  editorialCard?: Record<string, EditorialCard>;
  editorialVideo?: EditorialVideo;
  geoLocation?: ChartLocation;
  plainEditorialCard?: Record<string, PlainEditorialCard>;
  plainEditorialNotes?: EditorialNotes;
  trackCount: number;
  trackTypes: ("music-videos" | "songs")[];
  versionHash: string;
}

export interface PlaylistViews {
  "featured-artists": "artists";
  "more-by-curator": "playlists";
}

export type Playlist = Resource<"playlists">;

export interface PlaylistsEntry {
  attributes: PlaylistAttributes;
  defaults: "tracks";
  embedded: never;
  extended: PlaylistExtended;
  optional: "library";
  partial: "curator";
  refs: "curator";
  relationships: {
    curator: "apple-curators" | "artists" | "curators" | "social-profiles";
    library: "library-playlists";
    tracks: "music-videos" | "songs";
  };
  singleOnly: never;
  views: PlaylistViews;
}
