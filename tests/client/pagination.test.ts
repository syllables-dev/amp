import { describe, expect, test } from "bun:test";
import { fakeApi, song } from "../helpers";

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
    expect(api.urls[1]?.searchParams.get("platform")).toBe("web");
  });

  test("a next link apple leaves on the last page ends paging instead of failing", async () => {
    const api = fakeApi((url) =>
      url.searchParams.has("offset")
        ? { body: { errors: [{ code: "40400", status: "404" }] }, status: 404 }
        : {
            body: {
              data: [song("1")],
              next: "/v1/catalog/hk/artists/1/view/top-songs?offset=1",
            },
          }
    );
    const songs = await Array.fromAsync(
      api.client.paginate(api.client.artists.view("1", "top-songs"))
    );
    expect(songs.map((track) => track.id)).toEqual(["1"]);
  });

  test("chart next pages follow chartId and read results, not top-level data", async () => {
    const playlist = (id: string) => ({
      attributes: { name: `playlist ${id}` },
      id,
      type: "playlists",
    });
    const page = (type: string, id: string, chart: string, next?: string) => ({
      chart,
      data: [{ id, type }],
      next,
    });
    const nextPages: Record<string, unknown> = {
      "1": { songs: [page("songs", "2", "most-played")] },
      "2": { cityCharts: [page("playlists", "pl.2", "city-top")] },
    };
    const api = fakeApi((url) =>
      url.searchParams.has("chartId") &&
      (url.searchParams.has("chart") || url.searchParams.has("types"))
        ? { body: { errors: [{ code: "40000" }] }, status: 400 }
        : {
            body: {
              resources: {
                playlists: {
                  "pl.1": playlist("pl.1"),
                  "pl.2": playlist("pl.2"),
                },
                songs: { "1": song("1"), "2": song("2") },
              },
              results: nextPages[url.searchParams.get("chartId") ?? ""] ?? {
                cityCharts: [
                  page(
                    "playlists",
                    "pl.1",
                    "city-top",
                    "/v1/catalog/hk/charts?chartId=2&offset=1"
                  ),
                ],
                songs: [
                  page(
                    "songs",
                    "1",
                    "most-played",
                    "/v1/catalog/hk/charts?chartId=1&offset=1"
                  ),
                ],
              },
            },
          }
    );
    const charts = await api.client.charts({
      types: ["songs"],
      with: ["cityCharts"],
    });
    const songPage = await charts.songs[0]?.next?.();
    const cityPage = await charts.cityCharts[0]?.next?.();
    expect(api.urls[0]?.searchParams.get("with")).toBe("cityCharts");
    expect(charts.songs[0]?.items.map((track) => track.name)).toEqual([
      "song 1",
    ]);
    expect(songPage?.items.map((track) => track.name)).toEqual(["song 2"]);
    expect(cityPage?.items.map((list) => list.name)).toEqual(["playlist pl.2"]);
  });
});
