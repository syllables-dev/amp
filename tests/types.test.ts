import { expect, expectTypeOf, test } from "bun:test";
import { createClient } from "@/index";
import type { EditorialArtwork, Offer } from "@/types";

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
  expect(true).toBe(true);
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
  expect(true).toBe(true);
});

test("invalid extends do not compile", () => {
  const check = () => {
    // @ts-expect-error artwork is a base attribute, not an extend
    am.albums.get("1", { extend: ["artwork"] });
    // @ts-expect-error lyricsExcerpt only exists on songs
    am.albums.get("1", { extend: ["lyricsExcerpt"] });
  };
  expect(typeof check).toBe("function");
});
