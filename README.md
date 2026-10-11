# @syllables-dev/amp

Typed client for the API behind the Apple Music web player (`amp-api.music.apple.com`). Zero dependencies, about 4 KB gzipped.

```ts
import { createClient } from "@syllables-dev/amp";

const am = createClient({ developerToken, userToken });

const album = await am.albums.get("1752214909");
album.name;
album.tracks.map((track) => track.name);
```

## How the API is shaped

Everything in Apple Music is a **resource**: an object with an `id`, a `type` (`albums`, `songs`, `library-playlists`, ...) and attributes such as `name` or `artwork`.

Resources point at each other through **relationships**. An album has `artists` and `tracks`, a song has `albums`. Some relationships arrive as bare references (`{ id, type }`), some arrive as full objects without asking (an album's `tracks`), and the rest are left out entirely. Ask for full objects with `include`:

```ts
const song = await am.songs.get("1752214910", { include: ["albums", "artists"] });
song.albums[0].name;
```

**Views** are editorial shelves attached to a resource, like "More by Sabrina Carpenter":

```ts
const album = await am.albums.get("1752214909", { views: ["more-by-artist"] });
album.views.moreByArtist.items[0].name;
```

`extend` asks for attributes the API leaves out by default (`offers`, `editorialArtwork`, ...). `fields` trims the response down to the attributes you name.

## What the types promise

Every option changes the result type to match what the API sends back:

| You pass | The result type |
| --- | --- |
| nothing | Attributes Apple always sends are required, ones it sometimes omits are optional. Relationships the API sends as references are optional `{ id, type }[]`; the rest do not exist on the type. |
| `include: ["genres"]` | `genres` becomes a required array of full objects. A few relationships, such as `library`, can be absent even when included and stay optional. |
| `extend: ["offers"]` | `offers` appears. Without it, `album.offers` is a compile error. |
| `fields: ["name"]` | Only `name` remains. Extended attributes need to be listed in `fields` too, as the API drops them otherwise. |
| `views: ["top-songs"]` | `views.topSongs` is required and its items are typed as songs. Views you did not ask for are not on the type. |

Invalid combinations do not compile: `extend: ["artwork"]` (artwork is always sent), `include: ["playlists"]` on a library song (no such relationship), or `include: ["tracks"]` on `library.albums.list()` (Apple only allows it when fetching one album).

These rules come from sampling thousands of live responses, not from Apple's documentation. `bun run audit` reruns the sampling and prints how often each attribute, extend and relationship appears, so the types can be rechecked when Apple changes the API.

Included relationships are capped by Apple: a playlist's `tracks` stops at 100 and an artist's `albums` at 25. Use `related()` to read the full list.

Kebab-case names from the API become camelCase on hydrated objects: `record-labels` is `recordLabels`, `more-by-artist` is `moreByArtist`.

## Tokens

amp does not ship or fetch any token. Every client is created with the caller's own credentials, and `createClient` throws if `developerToken` is missing.

| Option | What it is |
| --- | --- |
| `developerToken` | The web player's JWT. Required for everything. |
| `userToken` | The signed-in account's `Media-User-Token`. Required for `library` and `me`, and used to detect the storefront. |
| `storefront` | Two-letter region such as `us` or `hk`. Detected from the user token when omitted, otherwise `us`. |
| `language` | BCP 47 tag such as `en-GB`. Defaults to the storefront's language. |

Either token may be a function returning a string or a promise, so it can refresh itself:

```ts
createClient({ developerToken: () => tokens.current() });
```

Where the tokens come from is up to you. The developer token is the JWT the web player at music.apple.com sends in its `Authorization` header, and it expires after a few months. The user token is the `media-user-token` cookie or header of a signed-in session. Treat both like passwords: keep them in environment variables or a secret store, never in source.

Requests always send `Origin: https://music.apple.com` and `Referer: https://music.apple.com/`, which the token requires, and identify themselves as `User-Agent: syllables-amp/<version>`. Browsers do not allow setting `Origin`, so use the client from a server, a worker, or Bun.

## Hosts

Requests go to `amp-api.music.apple.com`. Search, suggestions and hints take `edge: true` to use `amp-api-edge.music.apple.com` instead, like the web player does:

```ts
await am.search("espresso", { edge: true });
await am.search.hints("tay", { edge: true });
```

Edge search is several times faster but ignores `offset` and returns no `next` link, so results stop at the first page. Endpoints that live on other services, such as playback and purchase, keep their own host.

Apple runs a few other API hosts that the client does not target:

| Host | What it is |
| --- | --- |
| `amp-api-preview.music.apple.com` | Pre-release deployment. Not reachable from the public internet. |
| `amp-api-conversation.music.apple.com` | Conversational search service. Rejects the web player token with an empty 401. |
| `classical-api.music.apple.com` | Separate, versioned API for Apple Music Classical. The Classical app itself still reads catalog data from `amp-api`. |
| `library-sync.music.apple.com` | Library sync service for the native apps. Rejects the web player token with an empty 401. |

## Catalog

`albums`, `songs`, `artists`, `playlists`, `musicVideos`, `stations`, `curators`, `appleCurators`, `recordLabels` and `genres` share one shape:

```ts
await am.artists.get(id, { include, extend, fields, views });
await am.artists.getMany([a, b, c]);
await am.artists.related(id, "albums", { limit: 50 });
await am.artists.view(id, "top-songs");
```

Songs add lyrics and credits:

```ts
await am.songs.lyrics(id);
await am.songs.syllableLyrics(id);
await am.songs.credits(id);
```

## Search and charts

```ts
const results = await am.search("espresso", { types: ["songs", "artists"], limit: 10 });
results.songs.items;

await am.search.suggestions("tay");
await am.search.hints("tay");

const charts = await am.charts({ types: ["songs"] });
charts.songs[0].items;
```

## Library

```ts
const page = await am.library.songs.list({ sort: "-dateAdded", include: ["catalog"] });
page.total;
page.items;

for await (const song of am.library.songs.all()) {
  console.log(song.name);
}

await am.library.playlists.related(playlistId, "tracks");
await am.library.search("taylor");
await am.library.recentlyAdded();
```

## Pages

List-style calls return a `Page`: `items`, an optional `total`, and `next()` when more exist. `am.paginate(page)` turns any page into an async iterator.

## Every other endpoint

`request` reaches all 118 endpoints in the spec, with path and query parameters typed from it:

```ts
await am.request("GET /v1/catalog/{storefront}/songs/{id}", {
  id: "1752214910",
  extend: ["lyricsExcerpt"],
});
```

`{storefront}` fills itself in. The response is the raw JSON document.

## Speed

- **Batching.** `get` calls made in the same tick for the same type and options become one request to `/v1/catalog/{storefront}?ids[type]=...`, in chunks of 100. Eight concurrent `songs.get` calls cost one round trip.
- **Resource maps.** Every request asks for `format[resources]=map`, so a resource that appears several times in a response is sent once. An album with its tracks and their albums is about 2.7 times smaller this way.
- **Caching.** GET responses are cached in memory for their `Cache-Control: max-age`, and concurrent identical requests share one fetch. Pass `cache: false` to turn this off.
- **Parallel library walks.** `library.*.all()` reads `total` from the first page, then loads the rest up to six at a time while still yielding in order.

## Errors

Failures throw `AmpError`, carrying `status`, Apple's `code` (`40400`, `40005`, ...), the offending `parameter` when there is one, and `correlationId`. An empty 401 means the developer token is invalid or expired, or the request lacks an `apple.com` Origin.

## Development

`src/generated/operations.ts` is generated from the OpenAPI spec in the docs site:

```sh
bun run generate
```

Resource types in `src/types.ts` are written by hand, because the spec does not describe response bodies per type. `bun run audit` samples live responses with `AMP_DEVELOPER_TOKEN` (and `AMP_USER_TOKEN`) from the environment and prints what Apple actually returns, which is the reference for those types:

```sh
bun run audit albums songs
```
