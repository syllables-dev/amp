import { describe, expect, test } from "bun:test";
import { fakeApi } from "../helpers";

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

  test("account requests without a user token fail before reaching apple", async () => {
    const api = fakeApi(() => ({ body: { data: [] } }));
    await expect(api.client.library.songs.list()).rejects.toThrow(
      "needs a userToken"
    );
    await expect(
      api.client.request("GET /v1/me/library/songs")
    ).rejects.toThrow("needs a userToken");
    expect(api.urls).toHaveLength(0);
  });
});
