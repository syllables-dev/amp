import { describe, expect, test } from "bun:test";
import { AmpError } from "@/index";
import albumMap from "../fixtures/album-map.json";
import { fakeApi, song } from "../helpers";

describe("catalog gets", () => {
  test("concurrent gets share one multi-fetch request", async () => {
    const api = fakeApi((url) => ({
      body: {
        data: (url.searchParams.get("ids[songs]") ?? "")
          .split(",")
          .filter((id) => id !== "404")
          .map((id) => ({ id, type: "songs" })),
        resources: {
          songs: Object.fromEntries(
            ["1", "2", "3"].map((id) => [id, song(id)])
          ),
        },
      },
    }));
    const [first, second, missing] = await Promise.allSettled([
      api.client.songs.get("1"),
      api.client.songs.get("2"),
      api.client.songs.get("404"),
    ]);
    expect(api.urls).toHaveLength(1);
    expect(api.urls[0]?.pathname).toBe("/v1/catalog/hk");
    expect(first.status === "fulfilled" && first.value.name).toBe("song 1");
    expect(second.status === "fulfilled" && second.value.name).toBe("song 2");
    expect(missing.status === "rejected" && missing.reason).toBeInstanceOf(
      AmpError
    );
    expect(missing.status === "rejected" && missing.reason).toMatchObject({
      status: 404,
    });
  });

  test("batches respect each type's id limit", async () => {
    const api = fakeApi((url) => ({
      body: {
        data: [...url.searchParams.values()]
          .filter((value) => value.includes(","))
          .flatMap((list) => list.split(","))
          .map((id) => ({
            id,
            type: url.searchParams.has("ids[songs]") ? "songs" : "playlists",
          })),
      },
    }));
    const ids = Array.from({ length: 301 }, (_, index) => String(index));
    await Promise.all([
      api.client.songs.getMany(ids),
      api.client.playlists.getMany(ids.slice(0, 120)),
    ]);
    const sizes = api.urls.map((url) => {
      const type = url.searchParams.has("ids[songs]") ? "songs" : "playlists";
      return `${type}:${url.searchParams.get(`ids[${type}]`)?.split(",").length}`;
    });
    expect(sizes.sort((a, b) => a.localeCompare(b))).toEqual([
      "playlists:20",
      "playlists:50",
      "playlists:50",
      "songs:1",
      "songs:300",
    ]);
  });

  test("fields only trim the resource being read, not what it includes", async () => {
    const api = fakeApi(() => ({
      body: {
        data: [{ id: "1", type: "songs" }],
        resources: { songs: { "1": song("1") } },
      },
    }));
    await api.client.songs.get("1", { fields: ["name"], include: ["credits"] });
    expect(api.urls[0]?.searchParams.get("fields[songs]")).toBe("name");
    expect(api.urls[0]?.searchParams.has("fields")).toBe(false);
  });

  test("a view shelf says when apple cut it short, and its view continues from there", async () => {
    const api = fakeApi((url) => ({
      body: url.pathname.endsWith("/view/top-songs")
        ? {
            data: [{ id: "3", type: "songs" }],
            resources: { songs: { "3": song("3") } },
          }
        : {
            data: [{ id: "1", type: "artists" }],
            resources: {
              artists: {
                "1": {
                  attributes: { name: "artist" },
                  id: "1",
                  type: "artists",
                  views: {
                    singles: { data: [] },
                    "top-songs": {
                      data: [{ id: "2", type: "songs" }],
                      next: "/v1/catalog/hk/artists/1/view/top-songs?offset=1",
                    },
                  },
                },
              },
              songs: { "2": song("2") },
            },
          },
    }));
    const artist = await api.client.artists.get("1", {
      complete: false,
      views: ["singles", "top-songs"],
    });
    expect(artist.views.topSongs.hasMore).toBe(true);
    expect(artist.views.singles.hasMore).toBe(false);
    const rest = await api.client.artists.view("1", "top-songs", {
      offset: artist.views.topSongs.items.length,
    });
    expect(api.urls.at(-1)?.searchParams.get("offset")).toBe("1");
    expect(rest.items.map((item) => item.id)).toEqual(["3"]);
  });

  test("a view's page size is sent under apple's type:view key", async () => {
    const api = fakeApi(() => ({
      body: {
        data: [{ id: "1", type: "artists" }],
        resources: {
          artists: {
            "1": { attributes: {}, id: "1", type: "artists", views: {} },
          },
        },
      },
    }));
    await api.client.artists.get("1", {
      complete: false,
      viewLimits: { "top-songs": 20 },
      views: ["top-songs"],
    });
    expect(api.urls[0]?.searchParams.get("limit[artists:top-songs]")).toBe(
      "20"
    );
  });

  test("a renamed id resolves through meta.formerIds", async () => {
    const api = fakeApi(() => ({
      body: {
        data: [{ id: "new", type: "songs" }],
        resources: {
          songs: { new: { ...song("new"), meta: { formerIds: ["old"] } } },
        },
      },
    }));
    expect((await api.client.songs.get("old")).id).toBe("new");
  });

  test("each map reference keeps its own meta", async () => {
    const album = (id: string, extra: object = {}) => ({
      attributes: { name: `album ${id}` },
      id,
      type: "albums",
      ...extra,
    });
    const api = fakeApi(() => ({
      body: {
        data: [{ id: "1", type: "albums" }],
        resources: {
          albums: {
            "1": album("1", {
              views: {
                "more-by-artist": {
                  data: [
                    { id: "2", meta: { reason: "new" }, type: "albums" },
                    { id: "3", type: "albums" },
                  ],
                },
                "other-versions": {
                  data: [
                    { id: "2", type: "albums" },
                    { id: "3", meta: { reason: "remaster" }, type: "albums" },
                  ],
                },
              },
            }),
            "2": album("2"),
            "3": album("3", { meta: { source: "catalog" } }),
          },
        },
      },
    }));
    const { views } = await api.client.albums.get("1", {
      views: ["more-by-artist", "other-versions"],
    });
    const [byArtistNew, byArtistOld] = views.moreByArtist.items;
    const [versionNew, versionOld] = views.otherVersions.items;
    expect(byArtistNew?.meta).toEqual({ reason: "new" });
    expect(versionNew?.meta).toBeUndefined();
    expect(byArtistOld?.meta).toEqual({ source: "catalog" });
    expect(versionOld?.meta).toEqual({ reason: "remaster", source: "catalog" });
    expect(byArtistNew?.name).toBe("album 2");
  });

  test("cyclic map responses hydrate into serializable objects", async () => {
    const api = fakeApi(() => ({ body: albumMap }));
    const album = await api.client.albums.get("1752214909", {
      views: ["more-by-artist"],
    });
    const [track] = album.tracks;
    expect(album.tracks).toHaveLength(12);
    expect(track?.type === "songs" && track.albums?.[0]).toEqual({
      href: "/v1/catalog/hk/albums/1752214909?l=en-GB",
      id: "1752214909",
      type: "albums",
    });
    expect(() => JSON.stringify(album)).not.toThrow();
  });
});
