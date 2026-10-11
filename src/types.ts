export type Token = string | (() => string | Promise<string>);

export type ContentRating = "clean" | "explicit";

export type AudioTrait =
  | "atmos"
  | "hi-res-lossless"
  | "lossless"
  | "lossy-stereo"
  | "spatial"
  | "surround"
  | (string & {});

export interface Artwork {
  alt?: string;
  bgColor?: string;
  defaultCropCode?: string;
  gradient?: Record<string, unknown>;
  hasP3: boolean;
  height: number;
  imageTraits?: string[];
  recommendedCropCodes?: string[];
  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
  textGradient?: string[];
  url: string;
  width: number;
}

export type EditorialArtwork = Record<string, Artwork>;

export interface MotionVideo {
  previewFrame: Artwork;
  video: string;
}

export type EditorialVideo = Record<string, MotionVideo>;

export interface EditorialNotes {
  name?: string;
  short?: string;
  standard?: string;
  tagline?: string;
}

export interface PlayParams<K extends string = string> {
  id: string;
  kind: K;
}

export interface PlaylistPlayParams extends PlayParams<"playlist"> {
  versionHash: string;
}

export interface StationPlayParams extends PlayParams<"radioStation"> {
  format: "stream" | "tracks" | (string & {});
  hasDrm: boolean;
  mediaType: number;
  stationHash: string;
  streamingKind?: number;
}

export interface LibraryPlayParams<K extends string = string>
  extends PlayParams<K> {
  catalogId?: string;
  globalId?: string;
  isLibrary: true;
  reporting?: boolean;
  reportingId?: string;
}

export interface LyricsPlayParams {
  catalogId: string;
  displayType: number;
  id: string;
}

export interface Offer {
  buyParams?: string;
  expectedReleaseDate?: string;
  price?: number;
  priceFormatted?: string;
  type: "buy" | "preorder" | "subscription" | (string & {});
}

export interface AudioPreview {
  url: string;
}

export interface VideoPreview {
  artwork: Artwork;
  hlsUrl: string;
  url: string;
}

export interface ExtendedAssetUrls {
  enhancedHls?: string;
  lightweight?: string;
  lightweightPlus?: string;
  plus?: string;
  superLightweight?: string;
}

export interface HeroItem {
  content: { artwork?: Artwork }[];
}

export interface AlbumAttributes {
  artistName: string;
  artwork: Artwork;
  audioTraits: AudioTrait[];
  classicalUrl?: string;
  contentRating?: ContentRating;
  copyright?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isPrerelease: boolean;
  isSingle: boolean;
  name: string;
  playParams?: PlayParams<"album">;
  recordLabel: string;
  releaseDate: string;
  trackCount: number;
  upc: string;
  url: string;
}

export interface SongAttributes {
  albumArtistName: string;
  albumName: string;
  artistName: string;
  artwork: Artwork;
  attribution?: string;
  audioLocale: string;
  audioTraits: AudioTrait[];
  composerName?: string;
  contentRating?: ContentRating;
  discNumber: number;
  durationInMillis: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isrc: string;
  isVocalAttenuationAllowed: boolean;
  movementCount?: number;
  movementName?: string;
  movementNumber?: number;
  name: string;
  playParams?: PlayParams<"song">;
  previews: AudioPreview[];
  releaseDate: string;
  trackNumber: number;
  url: string;
  workName?: string;
}

export interface ArtistAttributes {
  artwork?: Artwork;
  classicalUrl?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  name: string;
  url: string;
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

export interface MusicVideoAttributes {
  albumArtistName?: string;
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  discNumber?: number;
  durationInMillis: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  has4K: boolean;
  hasHDR: boolean;
  isrc: string;
  name: string;
  playParams: PlayParams<"musicVideo">;
  previews: VideoPreview[];
  releaseDate: string;
  trackNumber?: number;
  url: string;
  videoTraits: string[];
}

export interface StationAttributes {
  airTime?: { end: string; start: string };
  appBundleId?: string;
  artwork: Artwork;
  band?: string;
  contentRating?: ContentRating;
  durationInMillis?: number;
  editorialNotes?: EditorialNotes;
  frequency?: string;
  isLive: boolean;
  kind:
    | "artistSeeded"
    | "discovery"
    | "editorial"
    | "query"
    | "songSeeded"
    | "streaming"
    | "user"
    | (string & {});
  mediaKind: "audio" | "video" | (string & {});
  name: string;
  playParams: StationPlayParams;
  radioUrl: string;
  requiresSubscription: boolean;
  stationProviderName?: string;
  streamingRadioSubType?: string;
  supportedDrms?: string[];
  url: string;
}

export interface AppleCuratorAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNotes;
  kind: "Curator" | "Genre" | "Show" | (string & {});
  name: string;
  shortName: string;
  showHostName?: string;
  url: string;
}

export interface CuratorAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNotes;
  name: string;
  url: string;
}

export interface SocialProfileAttributes {
  artwork?: Artwork;
  handle?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  name: string;
  url?: string;
}

export interface RecordLabelAttributes {
  artwork: Artwork;
  description?: EditorialNotes;
  editorialArtwork: EditorialArtwork;
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
  explicitContentPolicy: "allowed" | "opt-in" | "prohibited" | (string & {});
  name: string;
  supportedLanguageTags: string[];
}

export interface LyricsAttributes {
  playParams: LyricsPlayParams;
  ttml: string;
}

export interface SyllableLyricsAttributes {
  playParams: LyricsPlayParams;
  ttml: string;
}

export interface CreditCategoryAttributes {
  kind:
    | "composer-and-lyrics"
    | "performer"
    | "production-and-engineering"
    | (string & {});
  title: string;
}

export interface CreditArtistAttributes {
  artwork?: Artwork;
  name: string;
  roleNames: string[];
}

export interface UploadedVideoAttributes {
  artistName: string;
  artwork: Artwork;
  assetTokens?: Record<string, string>;
  contentRatingsBySystem?: Record<string, unknown>;
  durationInMilliseconds?: number;
  editorialArtwork?: EditorialArtwork;
  editorialNotes?: EditorialNotes;
  editorialVideo?: EditorialVideo;
  name: string;
  playParams: PlayParams<"uploadedVideo">;
  postUrl?: string;
  uploadDate?: string;
  uploadingArtistName?: string;
}

export interface MusicMovieAttributes {
  artistName?: string;
  artwork: Artwork;
  contentRatingsBySystem?: Record<string, unknown>;
  copyright?: string;
  description?: EditorialNotes;
  genreNames?: string[];
  movieClips?: Record<string, unknown>[];
  name: string;
  offers?: Record<string, unknown>[];
  releaseDate?: string;
  studioName?: string;
  supportedLocales?: Record<string, unknown>;
  url: string;
  videoTraits?: string[];
}

export interface LibrarySongAttributes {
  albumName: string;
  artistName: string;
  artwork?: Artwork;
  contentRating?: ContentRating;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  name: string;
  playParams?: LibraryPlayParams<"song">;
  releaseDate?: string;
  trackNumber: number;
}

export interface LibraryAlbumAttributes {
  artistName: string;
  artwork: Artwork;
  dateAdded: string;
  genreNames: string[];
  name: string;
  playParams: LibraryPlayParams<"album">;
  releaseDate?: string;
  trackCount: number;
}

export interface LibraryArtistAttributes {
  name: string;
}

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

export interface LibraryMusicVideoAttributes {
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  durationInMillis: number;
  genreNames: string[];
  name: string;
  playParams: LibraryPlayParams<"musicVideo">;
  releaseDate?: string;
  trackNumber?: number;
}

export interface AlbumExtended {
  artistUrl?: string;
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  offers: Offer[];
  plainEditorialNotes?: EditorialNotes;
}

export interface SongExtended {
  artistUrl: string;
  editorialArtwork: EditorialArtwork;
  extendedAssetUrls?: ExtendedAssetUrls;
  lyricsExcerpt?: string;
  offers: Offer[];
}

export interface ArtistExtended {
  artistBio?: string;
  bornOrFormed?: string;
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  hasBiographyContent: boolean;
  hero: HeroItem[];
  isGroup: boolean;
  keyColor?: string;
  origin?: string;
  plainEditorialNotes?: EditorialNotes;
}

export interface PlaylistExtended {
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  plainEditorialCard?: Record<string, unknown>;
  plainEditorialNotes?: EditorialNotes;
  trackCount: number;
}

export interface MusicVideoExtended {
  artistUrl: string;
  editorialArtwork: EditorialArtwork;
  offers: Offer[];
  plainEditorialNotes?: EditorialNotes;
}

export interface StationExtended {
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  plainEditorialNotes?: EditorialNotes;
}

export interface CuratorExtended {
  editorialArtwork: EditorialArtwork;
  plainEditorialNotes?: EditorialNotes;
  playlistCount: number;
}

export interface LibraryExtended {
  inFavorites: boolean;
}

export interface LibraryAlbumExtended extends LibraryExtended {
  editorialArtwork: EditorialArtwork;
}

export interface LibraryPlaylistExtended extends LibraryExtended {
  editorialArtwork: EditorialArtwork;
  isCollaborativeHost: boolean;
  trackCount: number;
}

export type NoExtend = Record<never, never>;

export type NoViews = Record<never, never>;

export interface AlbumViews {
  "appears-on": "playlists";
  "audio-extras": "stations";
  "more-by-artist": "albums";
  "other-versions": "albums";
  "related-videos": "music-videos";
  "video-extras": "uploaded-videos";
  "you-might-also-like": "albums";
}

export interface ArtistViews {
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
  playlists: "playlists";
  "radio-shows": "apple-curators";
  "similar-artists": "artists";
  singles: "albums";
  "top-music-videos": "music-videos";
  "top-songs": "songs";
}

export interface MusicVideoViews {
  "more-by-artist": "music-videos";
  "more-in-genre": "music-videos";
}

export interface PlaylistViews {
  "featured-artists": "artists";
  "more-by-curator": "playlists";
}

export interface RecordLabelViews {
  "latest-releases": "albums";
  "top-releases": "albums";
}

export type NoRelationships = Record<never, never>;

export interface Registry {
  albums: {
    attributes: AlbumAttributes;
    defaults: "tracks";
    extended: AlbumExtended;
    optional: "library";
    partial: never;
    refs: "artists";
    relationships: {
      artists: "artists";
      genres: "genres";
      library: "library-albums";
      "record-labels": "record-labels";
      tracks: "music-videos" | "songs";
    };
    singleOnly: never;
    views: AlbumViews;
  };
  "apple-curators": {
    attributes: AppleCuratorAttributes;
    defaults: never;
    extended: CuratorExtended;
    optional: never;
    partial: never;
    refs: "playlists";
    relationships: { playlists: "playlists" };
    singleOnly: never;
    views: NoViews;
  };
  artists: {
    attributes: ArtistAttributes;
    defaults: never;
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
  };
  "credit-artists": {
    attributes: CreditArtistAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  curators: {
    attributes: CuratorAttributes;
    defaults: never;
    extended: CuratorExtended;
    optional: never;
    partial: never;
    refs: "playlists";
    relationships: { playlists: "playlists" };
    singleOnly: never;
    views: NoViews;
  };
  genres: {
    attributes: GenreAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  "library-albums": {
    attributes: LibraryAlbumAttributes;
    defaults: never;
    extended: LibraryAlbumExtended;
    optional: never;
    partial: "artists";
    refs: never;
    relationships: {
      artists: "library-artists";
      catalog: "albums";
      tracks: "library-music-videos" | "library-songs";
    };
    singleOnly: "tracks";
    views: NoViews;
  };
  "library-artists": {
    attributes: LibraryArtistAttributes;
    defaults: never;
    extended: LibraryExtended;
    optional: never;
    partial: never;
    refs: never;
    relationships: { albums: "library-albums"; catalog: "artists" };
    singleOnly: "albums";
    views: NoViews;
  };
  "library-music-videos": {
    attributes: LibraryMusicVideoAttributes;
    defaults: never;
    extended: LibraryExtended;
    optional: never;
    partial: never;
    refs: never;
    relationships: {
      albums: "library-albums";
      artists: "library-artists";
      catalog: "music-videos";
    };
    singleOnly: never;
    views: NoViews;
  };
  "library-playlists": {
    attributes: LibraryPlaylistAttributes;
    defaults: never;
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
  };
  "library-songs": {
    attributes: LibrarySongAttributes;
    defaults: never;
    extended: LibraryExtended;
    optional: never;
    partial: never;
    refs: never;
    relationships: {
      albums: "library-albums";
      artists: "library-artists";
      catalog: "songs";
    };
    singleOnly: never;
    views: NoViews;
  };
  lyrics: {
    attributes: LyricsAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  "music-movies": {
    attributes: MusicMovieAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  "music-videos": {
    attributes: MusicVideoAttributes;
    defaults: never;
    extended: MusicVideoExtended;
    optional: "library";
    partial: never;
    refs: "albums" | "artists";
    relationships: {
      albums: "albums";
      artists: "artists";
      genres: "genres";
      library: "library-music-videos";
      songs: "songs";
    };
    singleOnly: never;
    views: MusicVideoViews;
  };
  playlists: {
    attributes: PlaylistAttributes;
    defaults: "tracks";
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
  };
  "record-labels": {
    attributes: RecordLabelAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: RecordLabelViews;
  };
  "role-categories": {
    attributes: CreditCategoryAttributes;
    defaults: "credit-artists";
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: { "credit-artists": "credit-artists" };
    singleOnly: never;
    views: NoViews;
  };
  "social-profiles": {
    attributes: SocialProfileAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  songs: {
    attributes: SongAttributes;
    defaults: never;
    extended: SongExtended;
    optional: "library" | "lyrics";
    partial: never;
    refs: "albums" | "artists";
    relationships: {
      albums: "albums";
      artists: "artists";
      composers: "artists";
      credits: "role-categories";
      genres: "genres";
      library: "library-songs";
      lyrics: "lyrics";
      "music-videos": "music-videos";
      station: "stations";
    };
    singleOnly: never;
    views: NoViews;
  };
  stations: {
    attributes: StationAttributes;
    defaults: never;
    extended: StationExtended;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  storefronts: {
    attributes: StorefrontAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  "syllable-lyrics": {
    attributes: SyllableLyricsAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
  };
  "uploaded-videos": {
    attributes: UploadedVideoAttributes;
    defaults: never;
    extended: NoExtend;
    optional: never;
    partial: never;
    refs: never;
    relationships: NoRelationships;
    singleOnly: never;
    views: NoViews;
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

export type View<T extends ResourceType> = keyof Registry[T]["views"] & string;

export type ViewTarget<
  T extends ResourceType,
  V extends View<T>,
> = Registry[T]["views"][V] & ResourceType;

export type Extended<T extends ResourceType> = Registry[T]["extended"];

export type Extend<T extends ResourceType> = keyof Extended<T> & string;

export type AttributeName<T extends ResourceType> =
  | (keyof Attributes<T> & string)
  | Extend<T>;

export type Defaults<T extends ResourceType> = Registry[T]["defaults"] &
  Relationship<T>;

export type Refs<T extends ResourceType> = Registry[T]["refs"] &
  Relationship<T>;

export type SingleOnly<T extends ResourceType> = Registry[T]["singleOnly"] &
  Relationship<T>;

export type Listable<T extends ResourceType> = Exclude<
  Relationship<T>,
  SingleOnly<T>
>;

type Included<
  T extends ResourceType,
  R extends Relationship<T>,
> = R extends Registry[T]["partial"]
  ? (Ref<Target<T, R>> | Resource<Target<T, R>>)[]
  : Resource<Target<T, R>>[];

export interface Ref<T extends ResourceType = ResourceType> {
  href?: string;
  id: string;
  type: T;
}

export interface Shelf {
  items: AnyResource[];
  title?: string;
}

type Sparse<A, F extends PropertyKey> = Pick<A, Extract<keyof A, F>>;

export type Resource<
  T extends ResourceType,
  I extends string = never,
  F extends PropertyKey = PropertyKey,
  E extends string = never,
> = T extends ResourceType
  ? Ref<T> &
      Sparse<Attributes<T> & Pick<Extended<T>, Extract<E, Extend<T>>>, F> & {
        [R in Exclude<Refs<T>, I> as CamelCase<R>]?: Ref<Target<T, R>>[];
      } & {
        [R in Exclude<
          Extract<Relationship<T>, I>,
          Registry[T]["optional"]
        > as CamelCase<R>]: Included<T, R>;
      } & {
        [R in Extract<
          Extract<Relationship<T>, I>,
          Registry[T]["optional"]
        > as CamelCase<R>]?: Included<T, R>;
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
