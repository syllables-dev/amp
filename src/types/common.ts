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
  long?: string;
  name?: string;
  short?: string;
  standard?: string;
  tagline?: string;
}

interface CardContent {
  display: { decorations: string[] };
  editorialArtwork?: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  kind: "musicSuperHero" | (string & {});
  subtitle?: string;
  title?: string;
}

export interface EditorialCard extends CardContent {
  editorialNotes?: EditorialNotes;
}

export interface PlainEditorialCard extends CardContent {
  plainEditorialNotes?: EditorialNotes;
}

export interface PlayParams<K extends string = string> {
  id: string;
  kind: K;
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

export interface EditorialCards {
  editorialCard?: Record<string, EditorialCard>;
  plainEditorialCard?: Record<string, PlainEditorialCard>;
}

export interface LibraryExtended {
  inFavorites: boolean;
}

export type NoExtend = Record<never, never>;

export type NoViews = Record<never, never>;

export type NoRelationships = Record<never, never>;
