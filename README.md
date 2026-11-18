# amp

Typed client with zero dependencies for the API behind the Apple Music web and iOS player.

## Install

```sh
bun add @syllables-dev/amp
```

## Usage

```ts
import { createClient } from "@syllables-dev/amp";

const am = createClient({ developerToken: process.env.AMP_DEVELOPER_TOKEN ?? "" });
const album = await am.albums.get("1752214909");
```

Full documentation lives at [docs.syllables.dev/packages/amp](https://docs.syllables.dev/packages/amp).

## Development

```sh
bun install
bun test
bun run check
bun run tsgo
bun run audit albums songs
```

## License

MIT
