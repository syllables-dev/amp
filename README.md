# @syllables-dev/amp

Typed client for the API behind the Apple Music web player (`amp-api.music.apple.com`), Zero dependencies.

## Install

```sh
bun add @syllables-dev/amp
```

## Quick start

Copy the developer token from the `Authorization` header of any `amp-api` request on music.apple.com, and keep it in an environment variable.

```ts
import { createClient } from "@syllables-dev/amp";

const am = createClient({ developerToken: process.env.AMP_DEVELOPER_TOKEN ?? "" });

const album = await am.albums.get("1752214909");
album.name;
album.tracks.map((track) => track.name);

const results = await am.search("espresso", { types: ["songs"], limit: 5 });
results.songs.items.map((song) => song.name);

const song = await am.songs.get("1752214910", { include: ["albums", "artists"] });
song.albums[0]?.name;
```

Run it on a server, in a worker, or in Bun. Apple requires an `Origin: https://music.apple.com` header, which browsers do not allow a page to set.

## Documentation

Full guides live at [docs.syllables.dev/packages/amp](https://docs.syllables.dev/packages/amp):

- [Getting started](https://docs.syllables.dev/packages/amp/getting-started)
- [Tokens](https://docs.syllables.dev/packages/amp/tokens)
- [Usage](https://docs.syllables.dev/packages/amp/usage): catalog, search, charts, lyrics, and your library
- [Options and types](https://docs.syllables.dev/packages/amp/options): `include`, `extend`, `fields`, `views`, and limits
- [Advanced](https://docs.syllables.dev/packages/amp/advanced): pages, errors, raw requests, and caching

## Development

```sh
bun run generate
bun run audit albums songs
```

`generate` rebuilds `src/generated/operations.ts` from the OpenAPI spec in the docs site. `audit` samples live responses with `AMP_DEVELOPER_TOKEN` (and `AMP_USER_TOKEN`) from the environment and prints what Apple actually returns, which is the reference for the hand-written types in `src/types.ts`.

## License

MIT
