import { describe, expect, test } from "bun:test";
import { fakeApi, song } from "../helpers";

describe("lyric search", () => {
  test("lyric matches read the song bubble and keep their snippets", async () => {
    const api = fakeApi(() => ({
      body: {
        resources: { songs: { "1": song("1") } },
        results: {
          song: {
            data: [
              {
                id: "1",
                meta: { snippets: [{ kind: "lyric", text: "<mark>a</mark>" }] },
                type: "songs",
              },
            ],
          },
        },
      },
    }));
    const page = await api.client.search.lyrics("a");
    expect(api.urls[0]?.searchParams.get("with")).toBe(
      "lyricHighlights,serverBubbles"
    );
    expect(page.items[0]?.name).toBe("song 1");
    expect(page.items[0]?.meta?.snippets?.[0]?.text).toBe("<mark>a</mark>");
  });
});
