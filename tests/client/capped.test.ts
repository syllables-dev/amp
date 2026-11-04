import { describe, expect, test } from "bun:test";
import { fakeApi, song } from "../helpers";

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
