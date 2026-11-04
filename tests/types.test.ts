import { expectTypeOf, test } from "bun:test";
import { createClient } from "@/index";
import type { EditorialArtwork, EditorialCard, Offer } from "@/types/common";
import type { Ref, Resource } from "@/types/resource";
import type {
  PersonalRecommendation,
  RecommendationExtend,
  RecommendationType,
} from "@/types/resources/personal-recommendation";

const am = createClient({
  developerToken: "token",
  fetch: (() => Promise.resolve(Response.json({}))) as unknown as typeof fetch,
});

test("extend-only attributes exist only when requested", () => {
  const plain = () => am.albums.get("1");
  const extended = () =>
    am.albums.get("1", { extend: ["offers", "editorialArtwork"] });
  type Plain = Awaited<ReturnType<typeof plain>>;
  type Extended = Awaited<ReturnType<typeof extended>>;
  expectTypeOf<Plain>().not.toHaveProperty("offers");
  expectTypeOf<Extended["offers"]>().toEqualTypeOf<Offer[]>();
  expectTypeOf<
    Extended["editorialArtwork"]
  >().toEqualTypeOf<EditorialArtwork>();
  expectTypeOf<Extended["name"]>().toEqualTypeOf<string>();
});

test("recommendation shelves type their items and per-shelf meta", () => {
  type Shelf = PersonalRecommendation<"editorialCard">;
  type Item = Shelf["contents"][number];
  expectTypeOf<Item["type"]>().toEqualTypeOf<RecommendationType>();
  expectTypeOf<NonNullable<Item["meta"]>["editorialCard"]>().toEqualTypeOf<
    string | undefined
  >();
  expectTypeOf<
    NonNullable<NonNullable<Item["meta"]>["reason"]>["stringForDisplay"]
  >().toEqualTypeOf<string>();
  expectTypeOf<Shelf["display"]["kind"]>().toExtend<string>();
  expectTypeOf<
    NonNullable<Shelf["meta"]>["cachePolicy"]["updateDate"]
  >().toEqualTypeOf<string>();
  expectTypeOf<
    Extract<Item, { type: "playlists" }>["editorialCard"]
  >().toEqualTypeOf<Record<string, EditorialCard> | undefined>();
  expectTypeOf<"editorialCard">().toExtend<RecommendationExtend>();
  expectTypeOf<"playlistCount">().toExtend<RecommendationExtend>();
  expectTypeOf<PersonalRecommendation["contents"][number]>().not.toHaveProperty(
    "editorialCard"
  );
});

test("recommendations type extends across shelf items", () => {
  const extended = () =>
    am.me.recommendations({ extend: ["editorialCard"], name: "listen-now" });
  type Shelves = Awaited<ReturnType<typeof extended>>;
  type Item = Shelves[number]["contents"][number];
  expectTypeOf<
    Extract<Item, { type: "albums" }>["editorialCard"]
  >().toEqualTypeOf<Record<string, EditorialCard> | undefined>();
  const _check = () => {
    // @ts-expect-error control-center needs parameters amp does not send
    am.me.recommendations({ name: "control-center" });
    // @ts-expect-error lyricsExcerpt is not on any shelf item
    am.me.recommendations({ extend: ["lyricsExcerpt"] });
  };
});

test("fields narrow both base and extended attributes", () => {
  const sparse = () =>
    am.albums.get("1", { extend: ["offers"], fields: ["name"] });
  const kept = () =>
    am.albums.get("1", { extend: ["offers"], fields: ["name", "offers"] });
  type Sparse = Awaited<ReturnType<typeof sparse>>;
  type Kept = Awaited<ReturnType<typeof kept>>;
  expectTypeOf<Sparse>().not.toHaveProperty("offers");
  expectTypeOf<Sparse>().not.toHaveProperty("artistName");
  expectTypeOf<Kept["offers"]>().toEqualTypeOf<Offer[]>();
});

test("invalid extends do not compile", () => {
  const _check = () => {
    // @ts-expect-error artwork is a base attribute, not an extend
    am.albums.get("1", { extend: ["artwork"] });
    // @ts-expect-error lyricsExcerpt only exists on songs
    am.albums.get("1", { extend: ["lyricsExcerpt"] });
  };
});

test("relationships follow what the API sends", () => {
  const plain = () => am.albums.get("1");
  const included = () => am.albums.get("1", { include: ["genres", "library"] });
  const playlist = () => am.playlists.get("1", { include: ["curator"] });
  type Plain = Awaited<ReturnType<typeof plain>>;
  type Included = Awaited<ReturnType<typeof included>>;
  type Playlist = Awaited<ReturnType<typeof playlist>>;
  expectTypeOf<Plain>().not.toHaveProperty("genres");
  expectTypeOf<Plain["tracks"][number]["type"]>().toEqualTypeOf<
    "music-videos" | "songs"
  >();
  expectTypeOf<NonNullable<Plain["artists"]>[number]>().toEqualTypeOf<
    Ref<"artists">
  >();
  expectTypeOf<Included["genres"][number]["name"]>().toEqualTypeOf<string>();
  expectTypeOf<Included["library"]>().toEqualTypeOf<
    Resource<"library-albums">[] | undefined
  >();
  expectTypeOf<Playlist["curator"][number]>().toEqualTypeOf<
    | Ref<"apple-curators" | "artists" | "curators" | "social-profiles">
    | Resource<"apple-curators" | "artists" | "curators" | "social-profiles">
  >();
});

test("library lists reject includes that need a single fetch", () => {
  const _check = () => {
    am.library.albums.get("1", { include: ["tracks"] });
    am.library.albums.list({ include: ["catalog", "artists"] });
    // @ts-expect-error tracks can only be included when fetching one album
    am.library.albums.list({ include: ["tracks"] });
    // @ts-expect-error library songs have no playlists relationship
    am.library.songs.get("1", { include: ["playlists"] });
  };
});

test("requested views are present and typed by view", () => {
  const withViews = () =>
    am.artists.get("1", { views: ["top-songs", "more-to-see"] });
  const plain = () => am.artists.get("1");
  const page = () => am.artists.view("1", "similar-artists");
  type WithViews = Awaited<ReturnType<typeof withViews>>;
  type Plain = Awaited<ReturnType<typeof plain>>;
  type ViewPage = Awaited<ReturnType<typeof page>>;
  expectTypeOf<
    WithViews["views"]["topSongs"]["items"][number]["type"]
  >().toEqualTypeOf<"songs">();
  expectTypeOf<
    WithViews["views"]["moreToSee"]["items"][number]["type"]
  >().toEqualTypeOf<"music-movies" | "uploaded-videos">();
  expectTypeOf<WithViews["views"]>().not.toHaveProperty("singles");
  expectTypeOf<Plain>().not.toHaveProperty("views");
  expectTypeOf<ViewPage["items"][number]["type"]>().toEqualTypeOf<"artists">();
});

test("limits stop at Apple's cap for each relationship, view and search", () => {
  const _check = () => {
    am.playlists.related("pl.1", "tracks", { limit: 300 });
    // @ts-expect-error playlist tracks stop at 300
    am.playlists.related("pl.1", "tracks", { limit: 301 });
    am.playlists.related("pl.1", "curator", { limit: 1 });
    // @ts-expect-error a playlist has one curator
    am.playlists.related("pl.1", "curator", { limit: 2 });
    am.artists.view("1", "top-songs", { limit: 100 });
    // @ts-expect-error latest-release holds one album
    am.artists.view("1", "latest-release", { limit: 2 });
    am.search("a", { limit: 50 });
    // @ts-expect-error search stops at 50
    am.search("a", { limit: 51 });
    // @ts-expect-error suggestions stop at 10
    am.search.suggestions("a", { limit: 11 });
    // @ts-expect-error library pages stop at 100
    am.library.songs.list({ limit: 101 });
  };
});

test("nearby concerts need a geohash", () => {
  const _check = () => {
    am.artists.view("1", "nearby-upcoming-concerts", { geoHash: "u09t" });
    am.artists.get("1", {
      geoHash: "u09t",
      views: ["nearby-upcoming-concerts"],
    });
    // @ts-expect-error nearby concerts need a geohash
    am.artists.view("1", "nearby-upcoming-concerts");
    // @ts-expect-error nearby concerts need a geohash
    am.artists.get("1", { views: ["nearby-upcoming-concerts"] });
    // @ts-expect-error a geohash only applies to nearby concerts
    am.artists.get("1", { geoHash: "u09t", views: ["top-songs"] });
    am.artists.view("1", "top-songs");
  };
});
