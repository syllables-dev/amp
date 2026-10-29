import { expectTypeOf, test } from "bun:test";
import { createClient } from "@/index";
import type { EditorialArtwork, Offer, Ref, Resource } from "@/types";

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

test("suggestions and recently added carry their resource types", () => {
  const suggest = () => am.search.suggestions("a", { types: ["songs"] });
  const recent = () => am.library.recentlyAdded();
  type Suggest = Awaited<ReturnType<typeof suggest>>;
  type Recent = Awaited<ReturnType<typeof recent>>;
  expectTypeOf<
    Suggest["topResults"][number]["type"]
  >().toEqualTypeOf<"songs">();
  expectTypeOf<Recent["items"][number]["type"]>().toEqualTypeOf<
    "albums" | "library-albums" | "library-playlists" | "playlists" | "stations"
  >();
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

test("chart extras appear only when requested with", () => {
  const plain = () => am.charts({ types: ["songs"] });
  const extended = () =>
    am.charts({ types: ["songs"], with: ["dailyGlobalTopCharts"] });
  type Plain = Awaited<ReturnType<typeof plain>>;
  type Extended = Awaited<ReturnType<typeof extended>>;
  expectTypeOf<Plain>().not.toHaveProperty("dailyGlobalTopCharts");
  expectTypeOf<
    Extended["dailyGlobalTopCharts"][number]["items"][number]
  >().toEqualTypeOf<Resource<"playlists">>();
  // @ts-expect-error a chart extra not asked for stays off the result
  expectTypeOf<Extended["cityCharts"]>();
});
