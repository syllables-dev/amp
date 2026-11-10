import type {
  Artwork,
  EditorialArtwork,
  EditorialNotes,
  EditorialVideo,
} from "@/types/common";
import type { Resource } from "@/types/resource";

export interface HeroItem {
  content: { artwork?: Artwork }[];
}

export interface ArtistAttributes {
  artwork?: Artwork;
  classicalUrl?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  name: string;
  url: string;
}

export interface ArtistExtended {
  artistBio?: string;
  bornOrFormed?: string;
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  hasBiographyContent: boolean;
  hasBonusContent: boolean;
  hasMusicEvents: boolean;
  hero: HeroItem[];
  isGroup: boolean;
  keyColor?: string;
  origin?: string;
  plainEditorialNotes?: EditorialNotes;
}

export interface ArtistViews {
  "all-upcoming-concerts": "concerts";
  "appears-on-albums": "albums";
  "compilation-albums": "albums";
  "featured-albums": "albums";
  "featured-playlists": "playlists";
  "featured-release": "albums" | "playlists";
  "full-albums": "albums";
  "latest-release": "albums";
  "live-albums": "albums";
  "more-to-hear": "stations";
  "more-to-see": "music-movies" | "uploaded-videos";
  "nearby-upcoming-concerts": "concerts";
  playlists: "playlists";
  "radio-shows": "apple-curators";
  "similar-artists": "artists";
  singles: "albums";
  "top-music-videos": "music-videos";
  "top-songs": "songs";
}

export type Artist = Resource<"artists">;

export interface ArtistsEntry {
  attributes: ArtistAttributes;
  defaults: never;
  embedded: never;
  extended: ArtistExtended;
  optional: never;
  partial: "station";
  refs: "albums";
  relationships: {
    albums: "albums";
    genres: "genres";
    "music-videos": "music-videos";
    playlists: "playlists";
    station: "stations";
  };
  singleOnly: never;
  views: ArtistViews;
}
