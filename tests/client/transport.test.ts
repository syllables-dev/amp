import { describe, expect, test } from "bun:test";
import { createClient } from "@/index";
import { version } from "../../package.json";
import { fakeApi } from "../helpers";

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
