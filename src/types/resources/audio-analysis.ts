import type { NoRelationships, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface AnalysisValue {
  beginning: number;
  ending: number;
  main: number;
}

export interface Tempo extends AnalysisValue {
  percentDeviation: number;
}

export interface MusicalKey {
  mode: "major" | "minor" | (string & {});
  tonic: string;
}

export interface Loudness {
  peak: number;
  range: number;
  value: number;
}

export interface TimeRange {
  endInMilliseconds: number;
  startInMilliseconds: number;
}

export interface VocalActivity extends TimeRange {
  strength:
    | "very-low"
    | "low"
    | "medium"
    | "high"
    | "very-high"
    | (string & {});
}

export interface AudioAnalysisAttributes {
  acousticness?: AnalysisValue;
  beats: { barsInMilliseconds: number[]; beatsInMilliseconds: number[] };
  bpm?: Tempo;
  danceability?: AnalysisValue;
  energy?: AnalysisValue;
  key: { beginning?: MusicalKey; ending?: MusicalKey; main?: MusicalKey };
  loudness: { beginning: Loudness; ending: Loudness; main: Loudness };
  melodicness?: AnalysisValue;
  valence?: AnalysisValue;
  vocalActivity?: VocalActivity[];
}

export interface AudioAnalysisExtended {
  fades: { fadeIn: TimeRange; fadeOut: TimeRange };
  loudnessCurve: { value: number[] };
}

export type AudioAnalysis = Resource<"audio-analysis">;

export interface AudioAnalysisEntry {
  attributes: AudioAnalysisAttributes;
  defaults: never;
  embedded: never;
  extended: AudioAnalysisExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
