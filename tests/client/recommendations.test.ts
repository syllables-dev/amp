import { describe, expect, test } from "bun:test";
import { utcOffset } from "@/client/recommendations";
import { fakeApi } from "../helpers";

describe("recommendations", () => {
  const shelf = (id: string, contents: object[]) => ({
    attributes: {
      display: { decorations: [], kind: "MusicCoverShelf" },
      hasSeeAll: false,
      isGroupRecommendation: false,
      kind: "music-recommendations",
      nextUpdateDate: "2026-01-01T00:00:00Z",
      resourceTypes: ["playlists"],
      title: { stringForDisplay: `shelf ${id}` },
      version: 1,
    },
    id,
    meta: { cachePolicy: { updateDate: "2026-01-01T00:00:00Z" }, metrics: {} },
    relationships: { contents: { data: contents, href: `/shelf/${id}` } },
    type: "personal-recommendation",
  });
  const home = {
    data: [
      { id: "1", type: "personal-recommendation" },
      { id: "2", type: "personal-recommendation" },
    ],
    resources: {
      "personal-recommendation": {
        "1": shelf("1", [
          {
            id: "pl.1",
            meta: {
              editorialCard: "emc.1",
              reason: { stringForDisplay: "For You" },
            },
            type: "playlists",
          },
        ]),
        "2": shelf("2", [{ id: "pl.1", type: "playlists" }]),
      },
      playlists: {
        "pl.1": { attributes: { name: "mix" }, id: "pl.1", type: "playlists" },
      },
    },
  };

  test("offsets are formatted as ISO 8601", () => {
    const at = (minutes: number) =>
      ({ getTimezoneOffset: () => minutes }) as unknown as Date;
    expect(utcOffset(at(480))).toBe("-08:00");
    expect(utcOffset(at(-330))).toBe("+05:30");
    expect(utcOffset(at(0))).toBe("+00:00");
  });

  test("listen-now sends the shelf name and a timezone offset", async () => {
    const api = fakeApi(() => ({ body: home }), { userToken: "user" });
    await api.client.me.recommendations({ name: "listen-now" });
    await api.client.me.recommendations({
      name: "listen-now",
      timezone: "+08:00",
    });
    await api.client.me.recommendations();
    expect(
      api.urls.map(({ pathname, searchParams }) => [
        pathname,
        searchParams.get("format[resources]"),
        searchParams.get("name"),
        searchParams.get("timezone"),
      ])
    ).toEqual([
      ["/v1/me/recommendations", "map", "listen-now", utcOffset()],
      ["/v1/me/recommendations", "map", "listen-now", "+08:00"],
      ["/v1/me/recommendations", "map", null, null],
    ]);
  });
});
