export type Token = string | (() => string | Promise<string>);

export type ContentRating = "clean" | "explicit";

export type AudioTrait =
  | "atmos"
  | "hi-res-lossless"
  | "lossless"
  | "lossy-stereo"
  | "spatial"
  | (string & {});

export interface Artwork {
  bgColor?: string;
  defaultCropCode?: string;
  hasP3?: boolean;
  height: number | null;
  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
  url: string;
  width: number | null;
}

export interface PlayParams {
  catalogId?: string;
  globalId?: string;
  id: string;
  isLibrary?: boolean;
  kind: string;
  reporting?: boolean;
  reportingId?: string;
  versionHash?: string;
}

export interface EditorialNotes {
  name?: string;
  short?: string;
  standard?: string;
  tagline?: string;
}

export interface MotionVideo {
  previewFrame: Artwork;
  video: string;
}

export interface Offer {
  buyParams: string;
  price: number;
  priceFormatted: string;
  type: string;
}

export interface Preview {
  artwork?: Artwork;
  hlsUrl?: string;
  url: string;
}

export interface AlbumAttributes {
  artistName: string;
  artistUrl?: string;
  artwork: Artwork;
  audioTraits: AudioTrait[];
  contentRating?: ContentRating;
  copyright?: string;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  editorialVideo?: Record<string, MotionVideo>;
  genreNames: string[];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isPrerelease: boolean;
  isSingle: boolean;
  name: string;
  offers?: Offer[];
  plainEditorialNotes?: EditorialNotes;
  playParams?: PlayParams;
  recordLabel?: string;
  releaseDate?: string;
  trackCount: number;
  upc?: string;
  url: string;
}

export interface SongAttributes {
  albumArtistName?: string;
  albumName: string;
  artistName: string;
  artistUrl?: string;
  artwork: Artwork;
  audioLocale?: string;
  audioTraits: AudioTrait[];
  composerName?: string;
  contentRating?: ContentRating;
  discNumber?: number;
  durationInMillis: number;
  editorialArtwork?: Record<string, Artwork>;
  extendedAssetUrls?: Record<string, string>;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics?: boolean;
  isAppleDigitalMaster?: boolean;
  isMasteredForItunes?: boolean;
  isrc?: string;
  isVocalAttenuationAllowed?: boolean;
  lyricsExcerpt?: string;
  name: string;
  offers?: Offer[];
  playParams?: PlayParams;
  previews: Preview[];
  releaseDate?: string;
  trackNumber?: number;
  url: string;
}

export interface ArtistAttributes {
  artistBio?: string;
  artwork?: Artwork;
  bornOrFormed?: string;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  editorialVideo?: Record<string, MotionVideo>;
  genreNames: string[];
  hasBiographyContent?: boolean;
  hero?: unknown[];
  isGroup?: boolean;
  keyColor?: string;
  name: string;
  origin?: string;
  plainEditorialNotes?: EditorialNotes;
  url: string;
}

export interface PlaylistAttributes {
  artwork?: Artwork;
  audioTraits: AudioTrait[];
  curatorName: string;
  curatorSocialHandle?: string;
  description?: EditorialNotes;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  editorialPlaylistKind?: string;
  editorialPlaylistSubKind?: string;
  editorialVideo?: Record<string, MotionVideo>;
  hasCollaboration: boolean;
  isChart: boolean;
  lastModifiedDate?: string;
  name: string;
  offers?: Offer[];
  plainEditorialCard?: Record<string, unknown>;
  plainEditorialNotes?: EditorialNotes;
  playlistType:
    | "editorial"
    | "external"
    | "personal-mix"
    | "replay"
    | "user-shared"
    | (string & {});
  playParams?: PlayParams;
  supportsSing: boolean;
  trackCount?: number;
  url: string;
}

export interface MusicVideoAttributes {
  albumArtistName?: string;
  albumName?: string;
  artistName: string;
  artistUrl?: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  discNumber?: number;
  durationInMillis: number;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  has4K: boolean;
  hasHDR: boolean;
  isrc?: string;
  name: string;
  offers?: Offer[];
  plainEditorialNotes?: EditorialNotes;
  playParams?: PlayParams;
  previews: Preview[];
  releaseDate?: string;
  trackNumber?: number;
  url: string;
  videoTraits: string[];
}

export interface StationAttributes {
  airTime?: { start: string; end: string };
  artwork: Artwork;
  contentRating?: ContentRating;
  durationInMillis?: number;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  editorialVideo?: Record<string, MotionVideo>;
  isLive: boolean;
  kind: string;
  mediaKind: string;
  name: string;
  plainEditorialNotes?: EditorialNotes;
  playParams?: PlayParams;
  radioUrl: string;
  requiresSubscription: boolean;
  stationProviderName?: string;
  supportedDrms?: string[];
  url: string;
}

export interface CuratorAttributes {
  artwork?: Artwork;
  editorialArtwork?: Record<string, Artwork>;
  editorialNotes?: EditorialNotes;
  kind?: string;
  name: string;
  plainEditorialNotes?: EditorialNotes;
  playlistCount?: number;
  shortName?: string;
  url: string;
}

export interface RecordLabelAttributes {
  artwork?: Artwork;
  description?: EditorialNotes;
  name: string;
  url: string;
}

export interface GenreAttributes {
  name: string;
  parentId?: string;
  parentName?: string;
  url: string;
}

export interface StorefrontAttributes {
  defaultLanguageTag: string;
  explicitContentPolicy: string;
  name: string;
  supportedLanguageTags: string[];
}

export interface LyricsAttributes {
  playParams?: PlayParams;
  ttml: string;
}

export interface SyllableLyricsAttributes {
  playParams?: PlayParams;
  ttml?: string;
  ttmlLocalizations?: string;
}

export interface CreditCategoryAttributes {
  kind: string;
  title: string;
}

export interface CreditArtistAttributes {
  artwork?: Artwork;
  name: string;
  roleNames: string[];
}

export interface LibrarySongAttributes {
  albumName: string;
  artistName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  dateAdded?: string;
  discNumber?: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  name: string;
  playParams?: PlayParams;
  releaseDate?: string;
  trackNumber?: number;
}

export interface LibraryAlbumAttributes {
  artistName: string;
  artwork: Artwork;
  dateAdded: string;
  editorialArtwork?: Record<string, Artwork>;
  genreNames: string[];
  name: string;
  playParams?: PlayParams;
  releaseDate?: string;
  trackCount: number;
}

export interface LibraryArtistAttributes {
  artwork?: Artwork;
  name: string;
  url?: string;
}

export interface LibraryPlaylistAttributes {
  artwork?: Artwork;
  canDelete: boolean;
  canEdit: boolean;
  dateAdded: string;
  description?: EditorialNotes;
  hasCatalog: boolean;
  hasCollaboration: boolean;
  isCollaborativeHost?: boolean;
  isPublic: boolean;
  lastModifiedDate?: string;
  name: string;
  playParams?: PlayParams;
}

export interface LibraryMusicVideoAttributes {
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  durationInMillis: number;
  genreNames: string[];
  name: string;
  playParams?: PlayParams;
  releaseDate?: string;
  trackNumber?: number;
}

export interface Registry {
  albums: {
    attributes: AlbumAttributes;
    relationships: {
      artists: "artists";
      genres: "genres";
      library: "library-albums";
      "record-labels": "record-labels";
      tracks: "songs" | "music-videos";
    };
    defaults: "tracks";
    extend:
      | "editorialArtwork"
      | "editorialVideo"
      | "extendedAssetUrls"
      | "offers";
    views:
      | "appears-on"
      | "audio-extras"
      | "more-by-artist"
      | "other-versions"
      | "related-videos"
      | "video-extras"
      | "you-might-also-like";
  };
  "apple-curators": {
    attributes: CuratorAttributes;
    relationships: { playlists: "playlists" };
    defaults: never;
    extend: "editorialArtwork" | "plainEditorialNotes" | "playlistCount";
    views: never;
  };
  artists: {
    attributes: ArtistAttributes;
    relationships: {
      albums: "albums";
      genres: "genres";
      "music-videos": "music-videos";
      playlists: "playlists";
      station: "stations";
    };
    defaults: never;
    extend:
      | "artistBio"
      | "bornOrFormed"
      | "editorialArtwork"
      | "editorialVideo"
      | "hasBiographyContent"
      | "hero"
      | "isGroup"
      | "keyColor"
      | "origin"
      | "plainEditorialNotes";
    views:
      | "appears-on-albums"
      | "compilation-albums"
      | "featured-albums"
      | "featured-playlists"
      | "full-albums"
      | "latest-release"
      | "live-albums"
      | "more-to-hear"
      | "more-to-see"
      | "playlists"
      | "radio-shows"
      | "similar-artists"
      | "singles"
      | "top-music-videos"
      | "top-songs";
  };
  "credit-artists": {
    attributes: CreditArtistAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: never;
  };
  curators: {
    attributes: CuratorAttributes;
    relationships: { playlists: "playlists" };
    defaults: never;
    extend: "editorialArtwork" | "plainEditorialNotes" | "playlistCount";
    views: never;
  };
  genres: {
    attributes: GenreAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: never;
  };
  "library-albums": {
    attributes: LibraryAlbumAttributes;
    relationships: {
      artists: "library-artists";
      catalog: "albums";
      tracks: "library-songs" | "library-music-videos";
    };
    defaults: never;
    extend: never;
    views: never;
  };
  "library-artists": {
    attributes: LibraryArtistAttributes;
    relationships: { albums: "library-albums"; catalog: "artists" };
    defaults: never;
    extend: never;
    views: never;
  };
  "library-music-videos": {
    attributes: LibraryMusicVideoAttributes;
    relationships: {
      albums: "library-albums";
      artists: "library-artists";
      catalog: "music-videos";
    };
    defaults: never;
    extend: never;
    views: never;
  };
  "library-playlists": {
    attributes: LibraryPlaylistAttributes;
    relationships: {
      catalog: "playlists";
      tracks: "library-songs" | "library-music-videos";
    };
    defaults: never;
    extend: "hasCollaboration" | "isCollaborativeHost";
    views: never;
  };
  "library-songs": {
    attributes: LibrarySongAttributes;
    relationships: {
      albums: "library-albums";
      artists: "library-artists";
      catalog: "songs";
      playlists: "library-playlists";
    };
    defaults: never;
    extend: never;
    views: never;
  };
  lyrics: {
    attributes: LyricsAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: never;
  };
  "music-videos": {
    attributes: MusicVideoAttributes;
    relationships: {
      albums: "albums";
      artists: "artists";
      genres: "genres";
      library: "library-music-videos";
      songs: "songs";
    };
    defaults: never;
    extend: "editorialArtwork" | "offers" | "plainEditorialNotes";
    views: "more-by-artist" | "more-in-genre";
  };
  playlists: {
    attributes: PlaylistAttributes;
    relationships: {
      curator: "curators" | "apple-curators";
      library: "library-playlists";
      tracks: "songs" | "music-videos";
    };
    defaults: "tracks";
    extend:
      | "editorialArtwork"
      | "editorialVideo"
      | "offers"
      | "plainEditorialCard"
      | "plainEditorialNotes"
      | "trackCount";
    views: "featured-artists" | "more-by-curator";
  };
  "record-labels": {
    attributes: RecordLabelAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: "latest-releases" | "top-releases";
  };
  "role-categories": {
    attributes: CreditCategoryAttributes;
    relationships: { "credit-artists": "credit-artists" };
    defaults: "credit-artists";
    extend: never;
    views: never;
  };
  songs: {
    attributes: SongAttributes;
    relationships: {
      albums: "albums";
      artists: "artists";
      composers: "artists";
      genres: "genres";
      library: "library-songs";
      lyrics: "lyrics";
      "music-videos": "music-videos";
      station: "stations";
    };
    defaults: never;
    extend: "extendedAssetUrls" | "lyricsExcerpt" | "offers";
    views: never;
  };
  stations: {
    attributes: StationAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: "editorialArtwork" | "editorialVideo" | "plainEditorialNotes";
    views: never;
  };
  storefronts: {
    attributes: StorefrontAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: never;
  };
  "syllable-lyrics": {
    attributes: SyllableLyricsAttributes;
    relationships: Record<never, never>;
    defaults: never;
    extend: never;
    views: never;
  };
}

export type ResourceType = keyof Registry;

export type CatalogType =
  | "albums"
  | "apple-curators"
  | "artists"
  | "curators"
  | "genres"
  | "music-videos"
  | "playlists"
  | "record-labels"
  | "songs"
  | "stations";

export type LibraryType = Extract<ResourceType, `library-${string}`>;

export type SearchType =
  | "albums"
  | "apple-curators"
  | "artists"
  | "curators"
  | "music-videos"
  | "playlists"
  | "record-labels"
  | "songs"
  | "stations";

export type LibrarySearchType =
  | "library-albums"
  | "library-artists"
  | "library-playlists"
  | "library-songs";

export type ChartType = "albums" | "music-videos" | "playlists" | "songs";

export type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

export type Attributes<T extends ResourceType> = Registry[T]["attributes"];

export type Relationship<T extends ResourceType> =
  keyof Registry[T]["relationships"] & string;

export type Target<
  T extends ResourceType,
  R extends Relationship<T>,
> = Registry[T]["relationships"][R] & ResourceType;

export type View<T extends ResourceType> = Registry[T]["views"];

export type Extend<T extends ResourceType> = Registry[T]["extend"];

export type Defaults<T extends ResourceType> = Registry[T]["defaults"] &
  Relationship<T>;

export interface Ref<T extends ResourceType = ResourceType> {
  href?: string;
  id: string;
  type: T;
}

export interface Shelf {
  items: AnyResource[];
  title?: string;
}

export type Resource<
  T extends ResourceType,
  I extends string = never,
  F extends keyof Attributes<T> = keyof Attributes<T>,
> = T extends ResourceType
  ? Ref<T> &
      Pick<Attributes<T>, F> & {
        [R in Exclude<Relationship<T>, I> as CamelCase<R>]?: Ref<
          Target<T, R>
        >[];
      } & {
        [R in Extract<Relationship<T>, I> as CamelCase<R>]: Resource<
          Target<T, R>
        >[];
      } & {
        views?: { [V in View<T> as CamelCase<V>]?: Shelf };
        meta?: Record<string, unknown>;
      }
  : never;

export type AnyResource = Resource<ResourceType>;

export type Album = Resource<"albums">;
export type Song = Resource<"songs">;
export type Artist = Resource<"artists">;
export type Playlist = Resource<"playlists">;
export type MusicVideo = Resource<"music-videos">;
export type Station = Resource<"stations">;
export type Curator = Resource<"curators">;
export type RecordLabel = Resource<"record-labels">;
export type Genre = Resource<"genres">;
export type Storefront = Resource<"storefronts">;
export type CreditCategory = Resource<"role-categories", "credit-artists">;
export type LibrarySong = Resource<"library-songs">;
export type LibraryAlbum = Resource<"library-albums">;
export type LibraryArtist = Resource<"library-artists">;
export type LibraryPlaylist = Resource<"library-playlists">;
export type LibraryMusicVideo = Resource<"library-music-videos">;

export interface Page<T> {
  items: T[];
  next?: () => Promise<Page<T>>;
  total?: number;
}

export interface Chart<T> extends Page<T> {
  id: string;
  name: string;
}

export interface Suggestions {
  terms: { searchTerm: string; displayTerm: string }[];
  topResults: AnyResource[];
}
