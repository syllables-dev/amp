import { describe, expect, test } from "bun:test";
import { AmpError, createClient } from "@/index";
import albumMap from "./fixtures/album-map.json";

interface Reply {
  body?: unknown;
  cacheControl?: string;
  status?: number;
}

const fakeApi = (reply: (url: URL) => Reply) => {
  const urls: URL[] = [];
  const fetcher = (input: string | URL | Request) => {
    const url = new URL(String(input));
    urls.push(url);
    const { status = 200, body, cacheControl = "max-age=60" } = reply(url);
    return Promise.resolve(
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
    const urls: URL[] = [];
    const client = createClient({
      developerToken: "token",
      fetch: ((input: string | URL | Request) => {
        const url = new URL(String(input));
        urls.push(url);
        const offset = Number(url.searchParams.get("offset") ?? 0);
        const body = {
          data: [0, 1].map((step) => ({
            attributes: { name: String(offset + step) },
            id: String(offset + step),
            type: "library-songs",
          })),
          meta: { total: 7 },
          next:
            offset + 2 < 7
              ? `/v1/me/library/songs?offset=${offset + 2}`
              : undefined,
        };
        return Bun.sleep(offset === 2 ? 20 : 0).then(
          () =>
            new Response(JSON.stringify(body), {
              headers: { "cache-control": "no-store" },
            })
        );
      }) as typeof fetch,
      storefront: "hk",
      userToken: "user",
    });
    const ids: string[] = [];
    for await (const entry of client.library.songs.all({ limit: 2 })) {
      ids.push(entry.id);
    }
    expect(ids).toEqual(["0", "1", "2", "3", "4", "5", "6", "7"]);
    expect(urls).toHaveLength(4);
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
  const hostsFor = async (edge?: boolean) => {
    const seen = new Set<string>();
    const client = createClient({
      developerToken: "token",
      edge,
      fetch: ((input: string | URL | Request) => {
        seen.add(new URL(String(input)).host);
        return Promise.resolve(Response.json({ data: [], results: {} }));
      }) as typeof fetch,
      storefront: "hk",
    });
    await client.search("a");
    await client.request("GET /v1/editorial/{storefront}/groupings", {});
    return [...seen];
  };

  test("amp-api serves everything by default", async () => {
    expect(await hostsFor()).toEqual(["amp-api.music.apple.com"]);
  });

  test("edge sends every request to amp-api-edge", async () => {
    expect(await hostsFor(true)).toEqual(["amp-api-edge.music.apple.com"]);
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
