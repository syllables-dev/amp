import { hosts, webPlayer } from "@/config";
import { chunk } from "@/internal/batcher";
import type { RawResource } from "@/internal/transport";

const developerToken = process.env.AMP_DEVELOPER_TOKEN;
const userToken = process.env.AMP_USER_TOKEN;

if (!developerToken) {
  console.error(
    "Set AMP_DEVELOPER_TOKEN (and AMP_USER_TOKEN for library types)."
  );
  process.exit(1);
}

const headers = {
  authorization: `Bearer ${developerToken}`,
  origin: webPlayer.origin,
  referer: webPlayer.referer,
  ...(userToken ? { "media-user-token": userToken } : {}),
};

interface Document {
  data?: RawResource[];
  next?: string;
  results?: Record<string, unknown>;
}

const catalog: Record<string, { extend: string[]; include: string[] }> = {
  albums: {
    extend: [
      "artistUrl",
      "editorialArtwork",
      "editorialVideo",
      "offers",
      "plainEditorialNotes",
    ],
    include: ["artists", "genres", "library", "record-labels", "tracks"],
  },
  "apple-curators": {
    extend: ["editorialArtwork", "plainEditorialNotes", "playlistCount"],
    include: ["playlists"],
  },
  artists: {
    extend: [
      "artistBio",
      "bornOrFormed",
      "editorialArtwork",
      "editorialVideo",
      "hasBiographyContent",
      "hero",
      "isGroup",
      "keyColor",
      "origin",
      "plainEditorialNotes",
    ],
    include: ["albums", "genres", "music-videos", "playlists", "station"],
  },
  "music-videos": {
    extend: ["artistUrl", "editorialArtwork", "offers", "plainEditorialNotes"],
    include: ["albums", "artists", "genres", "library", "songs"],
  },
  playlists: {
    extend: [
      "editorialArtwork",
      "editorialVideo",
      "plainEditorialCard",
      "plainEditorialNotes",
      "trackCount",
    ],
    include: ["curator", "library", "tracks"],
  },
  songs: {
    extend: [
      "artistUrl",
      "editorialArtwork",
      "extendedAssetUrls",
      "lyricsExcerpt",
      "offers",
    ],
    include: [
      "albums",
      "artists",
      "composers",
      "credits",
      "genres",
      "library",
      "lyrics",
      "music-videos",
      "station",
    ],
  },
  stations: {
    extend: ["editorialArtwork", "editorialVideo", "plainEditorialNotes"],
    include: [],
  },
};

const terms = [
  "love",
  "jazz",
  "classical",
  "radio",
  "rock",
  "hip hop",
  "k-pop",
  "live",
  "chill",
  "soundtrack",
];
const sampleSize = Number(process.env.AUDIT_SAMPLE ?? 300);
const only = new Set(process.argv.slice(2));

const get = async (path: string, query: Record<string, string> = {}) => {
  const url = new URL(path, hosts.api);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  for (const delay of [0, 1000, 3000, 6000]) {
    // biome-ignore lint/performance/noAwaitInLoops: retries wait for the rate limit in order
    await Bun.sleep(delay);
    const response = await fetch(url, { headers });
    if (response.status === 429 || response.status >= 500) {
      continue;
    }
    const text = await response.text();
    return (response.ok && text ? JSON.parse(text) : {}) as Document;
  }
  return {} as Document;
};

const collect = async () => {
  const found = new Map<string, Set<string>>();
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === "object") {
      const { id, type } = value as Partial<RawResource>;
      if (typeof id === "string" && typeof type === "string") {
        found.set(type, (found.get(type) ?? new Set()).add(id));
      }
      Object.values(value).forEach(visit);
    }
  };
  const requests = ["us", "hk"].flatMap((storefront) => [
    get(`/v1/catalog/${storefront}/charts`, {
      limit: "50",
      types: "albums,music-videos,playlists,songs",
    }),
    ...terms.map((term) =>
      get(`/v1/catalog/${storefront}/search`, {
        limit: "25",
        term,
        types: Object.keys(catalog).join(","),
      })
    ),
  ]);
  for (const document of await Promise.all(requests)) {
    visit(document);
  }
  return found;
};

const kindOf = (value: unknown) => {
  if (value === null) {
    return "null";
  }
  return Array.isArray(value) ? "array" : typeof value;
};

class Profile {
  readonly attributes = new Map<
    string,
    { count: number; kinds: Set<string> }
  >();
  readonly relationships = new Map<
    string,
    { count: number; refs: number; full: number }
  >();
  total = 0;

  add(resource: RawResource) {
    this.total += 1;
    for (const [name, value] of Object.entries(resource.attributes ?? {})) {
      const entry = this.attributes.get(name) ?? { count: 0, kinds: new Set() };
      entry.count += 1;
      entry.kinds.add(kindOf(value));
      this.attributes.set(name, entry);
    }
    for (const [name, relationship] of Object.entries(
      resource.relationships ?? {}
    )) {
      const entry = this.relationships.get(name) ?? {
        count: 0,
        full: 0,
        refs: 0,
      };
      entry.count += 1;
      for (const item of relationship.data ?? []) {
        if (item.attributes) {
          entry.full += 1;
        } else {
          entry.refs += 1;
        }
      }
      this.relationships.set(name, entry);
    }
  }
}

const share = (count: number, total: number) =>
  count === total ? "always" : `${count}/${total}`;

const fetchMany = async (
  type: string,
  ids: string[],
  query: Record<string, string>
) => {
  const profile = new Profile();
  const documents = await Promise.all(
    chunk(ids, type).map((group) =>
      get("/v1/catalog/us", { ...query, [`ids[${type}]`]: group.join(",") })
    )
  );
  for (const resource of documents.flatMap((document) => document.data ?? [])) {
    if (resource.type === type) {
      profile.add(resource);
    }
  }
  return profile;
};

const report = (
  type: string,
  base: Profile,
  extended: Map<string, Profile>,
  included: Profile
) => {
  console.log(`\n## ${type} (${base.total} sampled)`);
  for (const [name, entry] of [...base.attributes].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    console.log(
      `  ${name.padEnd(28)} ${share(entry.count, base.total).padEnd(10)} ${[...entry.kinds].join(" | ")}`
    );
  }
  for (const [name, profile] of extended) {
    const entry = profile.attributes.get(name);
    console.log(
      `  extend ${name.padEnd(21)} ${entry ? share(entry.count, profile.total) : "never returned"}`
    );
  }
  for (const [name, entry] of base.relationships) {
    console.log(
      `  default ${name.padEnd(20)} ${share(entry.count, base.total).padEnd(10)} ${entry.full ? "full objects" : "refs"}`
    );
  }
  for (const [name, entry] of included.relationships) {
    console.log(
      `  include ${name.padEnd(20)} ${share(entry.count, included.total).padEnd(10)} ${entry.refs ? `${entry.refs} bare refs` : ""}`
    );
  }
};

const found = await collect();
for (const [type, { extend, include }] of Object.entries(catalog)) {
  if (only.size && !only.has(type)) {
    continue;
  }
  const ids = [...(found.get(type) ?? [])].slice(0, sampleSize);
  const small = ids.slice(0, 100);
  // biome-ignore lint/performance/noAwaitInLoops: one type at a time keeps under the rate limit
  const [base, included, ...perExtend] = await Promise.all([
    fetchMany(type, ids, {}),
    include.length
      ? fetchMany(type, small, { include: include.join(",") })
      : new Profile(),
    ...extend.map((name) => fetchMany(type, small, { extend: name })),
  ]);
  report(
    type,
    base,
    new Map(
      extend.map((name, index) => [name, perExtend[index] ?? new Profile()])
    ),
    included
  );
}
