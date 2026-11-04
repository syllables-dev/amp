import type { NoExtend, NoRelationships, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface StructuredAddress {
  address: string | null;
  city: string;
  country: string;
  countryIsoCode: string;
  postCode: string | null;
  region: string | null;
}

export interface VenueAttributes {
  geoLocation: GeoLocation;
  name: string;
  structuredAddress: StructuredAddress;
}

export type Venue = Resource<"venues">;

export interface VenuesEntry {
  attributes: VenueAttributes;
  defaults: never;
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: NoRelationships;
  singleOnly: never;
  views: NoViews;
}
