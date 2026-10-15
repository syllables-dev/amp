import { describe, expect, test } from "bun:test";
import { AmpError, createClient } from "@/index";
import { version } from "../package.json";
import albumMap from "./fixtures/album-map.json";

interface Reply {
  body?: unknown;
  cacheControl?: string;
  delay?: number;
  status?: number;
}

const fakeApi = (
  reply: (url: URL) => Reply,
  options: { userToken?: string } = {}
) => {
  const urls: URL[] = [];
  const fetcher = (input: string | URL | Request) => {
    const url = new URL(String(input));
    urls.push(url);
    const {
      status = 200,
      body,
      cacheControl = "max-age=60",
      delay = 0,
    } = reply(url);
    return Bun.sleep(delay).then(
      () =>
        new Response(body === undefined ? "" : JSON.stringify(body), {
          headers: { "cache-control": cacheControl },
          status,
        })
    );
  };
  return {
    client: createClient({
      developerToken: "token",
      fetch: fetcher as typeof fetch,
      storefront: "hk",
      userToken: options.userToken,
    }),
    urls,
  };
};

const song = (id: string) => ({
  attributes: { name: `song ${id}` },
  id,
  type: "songs",
});

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

describe("capped relationships", () => {
  const playlist = (next?: string) => ({
    data: [{ id: "pl.1", type: "playlists" }],
    resources: {
      playlists: {
        "pl.1": {
          attributes: { name: "mix" },
          id: "pl.1",
          relationships: {
            tracks: { data: [{ id: "0", type: "songs" }], next },
          },
          type: "playlists",
        },
      },
      songs: { "0": song("0") },
    },
  });

  test("gets follow next links until the relationship is whole", async () => {
    const api = fakeApi((url) => {
      if (!url.pathname.endsWith("/tracks")) {
        return {
          body: playlist("/v1/catalog/hk/playlists/pl.1/tracks?offset=1"),
        };
      }
      const offset = url.searchParams.get("offset") ?? "";
      return {
        body: {
          data: [{ id: offset, type: "songs" }],
          next:
            offset === "1"
              ? "/v1/catalog/hk/playlists/pl.1/tracks?offset=2"
              : undefined,
          resources: { songs: { [offset]: song(offset) } },
        },
      };
    });
    const result = await api.client.playlists.get("pl.1");
    expect(result.tracks.map((track) => track.id)).toEqual(["0", "1", "2"]);
    expect(api.urls[1]?.searchParams.get("limit")).toBe("300");
  });

  test("complete: false keeps Apple's first page", async () => {
    const api = fakeApi(() => ({
      body: playlist("/v1/catalog/hk/playlists/pl.1/tracks?offset=1"),
    }));
    const result = await api.client.playlists.get("pl.1", { complete: false });
    expect(result.tracks).toHaveLength(1);
    expect(api.urls).toHaveLength(1);
  });

  test("a known total loads the remaining pages in parallel", async () => {
    const api = fakeApi(
      (url) => {
        const offset = Number(url.searchParams.get("offset") ?? 0);
        const body = url.pathname.endsWith("/tracks")
          ? {
              data: [{ id: String(offset), type: "library-songs" }],
              next: "/v1/me/library/playlists/p.1/tracks?offset=999",
            }
          : {
              data: [
                {
                  attributes: { name: "mine" },
                  id: "p.1",
                  relationships: {
                    tracks: {
                      data: Array.from({ length: 100 }, (_, index) => ({
                        id: String(index),
                        type: "library-songs",
                      })),
                      meta: { total: 250 },
                      next: "/v1/me/library/playlists/p.1/tracks?offset=100",
                    },
                  },
                  type: "library-playlists",
                },
              ],
            };
        return { body };
      },
      { userToken: "user" }
    );
    const result = await api.client.library.playlists.get("p.1", {
      include: ["tracks"],
    });
    expect(
      api.urls.slice(1).map((url) => url.searchParams.get("offset"))
    ).toEqual(["100", "200"]);
    expect(result.tracks.map((track) => track.id).slice(99)).toEqual([
      "99",
      "100",
      "200",
    ]);
  });
});

describe("pagination", () => {
  test("next pages keep the original query", async () => {
    const api = fakeApi((url) => ({
      body: {
        data: [song(url.searchParams.get("offset") ?? "0")],
        next: url.searchParams.has("offset")
          ? undefined
          : "/v1/catalog/hk/playlists/pl.1/tracks?offset=1",
      },
    }));
    const names: string[] = [];
    for await (const track of api.client.paginate(
      api.client.playlists.related("pl.1", "tracks", { language: "en-GB" })
    )) {
      names.push(track.type === "songs" ? track.name : "");
    }
    expect(names).toEqual(["song 0", "song 1"]);
    expect(api.urls[1]?.searchParams.get("l")).toBe("en-GB");
    expect(api.urls[1]?.searchParams.get("format[resources]")).toBe("map");
  });
});

describe("library", () => {
  test("all() loads remaining pages in parallel but yields them in order", async () => {
    const api = fakeApi(
      (url) => {
        const offset = Number(url.searchParams.get("offset") ?? 0);
        const body = {
          data: [0, 1].map((step) => ({
            attributes: { name: String(offset + step) },
            id: String(offset + step),
            type: "library-songs",
          })),
          meta: { total: 8 },
          next:
            offset + 2 < 8
              ? `/v1/me/library/songs?offset=${offset + 2}`
              : undefined,
        };
        return {
          body,
          cacheControl: "no-store",
          delay: offset === 2 ? 20 : 0,
        };
      },
      { userToken: "user" }
    );
    const ids: string[] = [];
    for await (const entry of api.client.library.songs.all({ limit: 2 })) {
      ids.push(entry.id);
    }
    expect(ids).toEqual(["0", "1", "2", "3", "4", "5", "6", "7"]);
    expect(api.urls).toHaveLength(4);
  });
});

describe("tokens", () => {
  test("a client without a developer token fails at creation", () => {
    expect(() => createClient({ developerToken: "" })).toThrow(
      "developerToken"
    );
  });

  test("a token function that returns nothing fails before any request", async () => {
    const api = { calls: 0 };
    const client = createClient({
      developerToken: () => "",
      fetch: (() => {
        api.calls += 1;
        return Promise.resolve(new Response("{}"));
      }) as unknown as typeof fetch,
      storefront: "hk",
    });
    await expect(client.search.hints("a")).rejects.toThrow("empty token");
    expect(api.calls).toBe(0);
  });
});

describe("transport", () => {
  test("requests send the web player origin and the package user agent", async () => {
    const sent: Headers[] = [];
    const client = createClient({
      developerToken: "token",
      fetch: ((_input: string, init: RequestInit) => {
        sent.push(new Headers(init.headers));
        return Promise.resolve(Response.json({ results: {} }));
      }) as unknown as typeof fetch,
      storefront: "hk",
      userToken: "user",
    });
    await client.search.hints("a");
    expect(Object.fromEntries(sent[0] ?? [])).toEqual({
      authorization: "Bearer token",
      "media-user-token": "user",
      origin: "https://music.apple.com",
      referer: "https://music.apple.com/",
      "user-agent": `syllables-amp/${version}`,
    });
  });

  test("identical gets within max-age are served from cache", async () => {
    const api = fakeApi(() => ({ body: { results: { terms: ["a"] } } }));
    await api.client.search.hints("a");
    await api.client.search.hints("a");
    expect(api.urls).toHaveLength(1);
  });

  test("no-store responses are not cached", async () => {
    const api = fakeApi(() => ({
      body: { results: { terms: ["a"] } },
      cacheControl: "no-cache, no-store, private",
    }));
    await api.client.search.hints("a");
    await api.client.search.hints("a");
    expect(api.urls).toHaveLength(2);
  });

  test("api errors expose code and offending parameter", async () => {
    const api = fakeApi(() => ({
      body: {
        errors: [
          {
            code: "40005",
            source: { parameter: "limit" },
            status: "400",
            title: "Invalid Parameter Value",
          },
        ],
      },
      status: 400,
    }));
    const error = await api.client.search.hints("a").catch((caught) => caught);
    expect(error).toMatchObject({
      code: "40005",
      parameter: "limit",
      status: 400,
    });
  });

  test("an empty 401 explains the origin requirement", async () => {
    const api = fakeApi(() => ({ status: 401 }));
    const error = await api.client.search.hints("a").catch((caught) => caught);
    expect(String(error.message)).toContain("Origin");
  });
});

describe("edge", () => {
  test("only searches with edge: true use amp-api-edge", async () => {
    const api = fakeApi(() => ({ body: { results: {} } }));
    await api.client.search("a", { edge: true });
    await api.client.search.hints("a", { edge: true });
    await api.client.search.suggestions("a");
    expect(api.urls.map((url) => url.host)).toEqual([
      "amp-api-edge.music.apple.com",
      "amp-api-edge.music.apple.com",
      "amp-api.music.apple.com",
    ]);
  });
});

describe("raw requests", () => {
  test("path params are filled and the rest becomes the query", async () => {
    const api = fakeApi(() => ({ body: { data: [] } }));
    await api.client.request("GET /v1/catalog/{storefront}/songs/{id}", {
      extend: ["offers", "lyricsExcerpt"],
      id: "42",
    });
    expect(api.urls[0]?.pathname).toBe("/v1/catalog/hk/songs/42");
    expect(api.urls[0]?.searchParams.get("extend")).toBe(
      "offers,lyricsExcerpt"
    );
  });
});
