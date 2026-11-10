import type { NoExtend, NoRelationships, NoViews } from "@/types/common";

export interface GainRamp {
  gainTimeInSeconds: number[];
  gainValue: number[];
  timeInSeconds: number;
}

export interface EntryPoint extends GainRamp {
  tags: string[];
}

export interface ExitPoint extends GainRamp {
  fadeToBlack: number;
}

export interface FlexmlAnalysisAttributes {
  arousal?: { value: number[] };
  entryPoints: EntryPoint[];
  exitPoints: ExitPoint[];
  valence?: { value: number[] };
  videoEvents: { score: number[]; timeInSeconds: number[] };
  visualTempo: { samplingFrequency: number; value: number[] };
}

export interface FlexmlAnalysisEntry {
  attributes: FlexmlAnalysisAttributes;
  defaults: never;
  embedded: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
