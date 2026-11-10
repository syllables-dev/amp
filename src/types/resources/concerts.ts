import type { NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface Ticket {
  url: string;
  vendor: string;
}

export interface EventDataProvider {
  name: string;
  url: string;
}

export interface ConcertAttributes {
  endISODateTime: string;
  name: string;
  startISODateTime: string;
  timezone: string;
  url: string;
}

export interface ConcertExtended {
  eventDataProviders: EventDataProvider[];
  tickets: Ticket[];
}

export type Concert = Resource<"concerts">;

export interface ConcertsEntry {
  attributes: ConcertAttributes;
  defaults: never;
  embedded: never;
  extended: ConcertExtended;
  optional: never;
  partial: never;
  refs: never;
  relationships: {
    artists: "artists";
    playlists: "playlists";
    venues: "venues";
  };
  singleOnly: never;
  views: NoViews;
}
