import type { NoExtend, NoViews } from "@/types/common";
import type { Extend, Resource } from "@/types/resource";

export type RecommendationType =
  | "albums"
  | "apple-curators"
  | "editorial-items"
  | "playlists"
  | "stations";

export interface DisplayString {
  stringForDisplay: string;
}

export interface PersonalRecommendationAttributes {
  display: {
    decorations: ("explanation" | (string & {}))[];
    kind:
      | "MusicConcertsEmptyShelf"
      | "MusicCoverShelf"
      | "MusicNamedBrickShelf"
      | "MusicNotesHeroShelf"
      | (string & {});
  };
  hasSeeAll: boolean;
  isGroupRecommendation: boolean;
  kind:
    | "concerts-for-you"
    | "music-recommendations"
    | "recently-played"
    | "your-favorites"
    | (string & {});
  nextUpdateDate: string;
  resourceTypes: (RecommendationType | (string & {}))[];
  title?: DisplayString;
  version: number;
}

export interface RecommendationReason extends DisplayString {
  contentIds?: string[];
}

export interface RecommendedMeta {
  editorialCard?: string;
  reason?: RecommendationReason;
}

export interface PersonalRecommendationMeta {
  cachePolicy: { updateDate: string };
  metrics: Record<string, string>;
}

export type RecommendationExtend = {
  [T in RecommendationType]: Extend<T>;
}[RecommendationType];

export type Recommended<
  T extends RecommendationType = RecommendationType,
  E extends string = never,
> = Resource<T, never, PropertyKey, E> & { meta?: RecommendedMeta };

export type PersonalRecommendation<E extends string = never> = Omit<
  Resource<"personal-recommendation">,
  "contents" | "meta"
> & {
  contents: Recommended<RecommendationType, E>[];
  meta?: PersonalRecommendationMeta;
};

export interface PersonalRecommendationEntry {
  attributes: PersonalRecommendationAttributes;
  defaults: "contents";
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: { contents: RecommendationType };
  singleOnly: never;
  views: NoViews;
}
