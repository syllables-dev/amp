import type { AlbumsEntry } from "@/types/resources/albums";
import type { AudioAnalysisEntry } from "@/types/resources/analysis/audio";
import type { FlexmlAnalysisEntry } from "@/types/resources/analysis/flexml";
import type { AppleCuratorsEntry } from "@/types/resources/apple-curators";
import type { ArtistsEntry } from "@/types/resources/artists";
import type { ConcertsEntry } from "@/types/resources/concerts";
import type { CreditArtistsEntry } from "@/types/resources/credits/artists";
import type { RoleCategoriesEntry } from "@/types/resources/credits/categories";
import type { CuratorsEntry } from "@/types/resources/curators";
import type { EditorialItemsEntry } from "@/types/resources/editorial-items";
import type { GenresEntry } from "@/types/resources/genres";
import type { LibraryAlbumsEntry } from "@/types/resources/library/albums";
import type { LibraryArtistsEntry } from "@/types/resources/library/artists";
import type { LibraryMusicVideosEntry } from "@/types/resources/library/music-videos";
import type { LibraryPlaylistsEntry } from "@/types/resources/library/playlists";
import type { LibrarySongsEntry } from "@/types/resources/library/songs";
import type { LyricsEntry } from "@/types/resources/lyrics/plain";
import type { SyllableLyricsEntry } from "@/types/resources/lyrics/syllable";
import type { MusicMoviesEntry } from "@/types/resources/music-movies";
import type { MusicVideosEntry } from "@/types/resources/music-videos";
import type { PersonalRecommendationEntry } from "@/types/resources/personal-recommendation";
import type { PlaylistsEntry } from "@/types/resources/playlists";
import type { RecordLabelsEntry } from "@/types/resources/record-labels";
import type { SocialProfilesEntry } from "@/types/resources/social-profiles";
import type { SongsEntry } from "@/types/resources/songs";
import type { StationsEntry } from "@/types/resources/stations";
import type { StorefrontsEntry } from "@/types/resources/storefronts";
import type { UploadedVideosEntry } from "@/types/resources/uploaded-videos";
import type { VenuesEntry } from "@/types/resources/venues";

export interface Registry {
  albums: AlbumsEntry;
  "apple-curators": AppleCuratorsEntry;
  artists: ArtistsEntry;
  "audio-analysis": AudioAnalysisEntry;
  concerts: ConcertsEntry;
  "credit-artists": CreditArtistsEntry;
  curators: CuratorsEntry;
  "editorial-items": EditorialItemsEntry;
  "flexml-analysis": FlexmlAnalysisEntry;
  genres: GenresEntry;
  "library-albums": LibraryAlbumsEntry;
  "library-artists": LibraryArtistsEntry;
  "library-music-videos": LibraryMusicVideosEntry;
  "library-playlists": LibraryPlaylistsEntry;
  "library-songs": LibrarySongsEntry;
  lyrics: LyricsEntry;
  "music-movies": MusicMoviesEntry;
  "music-videos": MusicVideosEntry;
  "personal-recommendation": PersonalRecommendationEntry;
  playlists: PlaylistsEntry;
  "record-labels": RecordLabelsEntry;
  "role-categories": RoleCategoriesEntry;
  "social-profiles": SocialProfilesEntry;
  songs: SongsEntry;
  stations: StationsEntry;
  storefronts: StorefrontsEntry;
  "syllable-lyrics": SyllableLyricsEntry;
  "uploaded-videos": UploadedVideosEntry;
  venues: VenuesEntry;
}

export type ResourceType = keyof Registry;

export type CatalogType =
  | "albums"
  | "apple-curators"
  | "artists"
  | "audio-analysis"
  | "concerts"
  | "curators"
  | "genres"
  | "music-videos"
  | "playlists"
  | "record-labels"
  | "songs"
  | "stations";

export type LibraryType = Extract<ResourceType, `library-${string}`>;

export type SearchType = Exclude<
  CatalogType,
  "audio-analysis" | "concerts" | "genres"
>;

export type LibrarySearchType =
  | "library-albums"
  | "library-artists"
  | "library-playlists"
  | "library-songs";

export type ChartType = "albums" | "music-videos" | "playlists" | "songs";

export type RecentlyAddedType =
  | "albums"
  | "library-albums"
  | "library-playlists"
  | "playlists"
  | "stations";
