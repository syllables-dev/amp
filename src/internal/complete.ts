import { follow, pastEnd, remainingOffsets } from "@/internal/pages";
import type {
  Query,
  RawDocument,
  RawRelationship,
  RawResource,
  Send,
} from "@/internal/transport";
import { capOf, pageLimits } from "@/limits";

const filling = new WeakMap<RawRelationship, Promise<void>>();

const counts: Readonly<
  Record<string, { attribute: string; extended: boolean; relationship: string }>
> = {
  albums: { attribute: "trackCount", extended: false, relationship: "tracks" },
  "library-albums": {
    attribute: "trackCount",
    extended: false,
    relationship: "tracks",
  },
  playlists: {
    attribute: "trackCount",
    extended: true,
    relationship: "tracks",
  },
};

export const countExtend = (type: string) => {
  const count = counts[type];
  return count?.extended ? count.attribute : undefined;
};

const countOf = (resource: RawResource, name: string) => {
  const count = counts[resource.type];
  const value =
    count?.relationship === name
      ? resource.attributes?.[count.attribute]
      : undefined;
  return typeof value === "number" ? value : undefined;
};

const followAll = async (
  load: (link: string) => Promise<RawDocument>,
  next: string | null | undefined
) => {
  const pages: RawDocument[] = [];
  for (let link = next; link; ) {
    // biome-ignore lint/performance/noAwaitInLoops: without a total each page names the next
    const page = await load(link);
    pages.push(page);
    link = page.next;
  }
  return pages;
};

const fetchRest = async (
  send: Send,
  next: string,
  loaded: number,
  total: { count: number; exact: boolean } | undefined,
  query: Query
) => {
  const load = (link: string, offset?: number) => {
    const request = follow(link, query);
    return send(
      offset === undefined
        ? request
        : { ...request, query: { ...request.query, offset } }
    );
  };
  const size = Number(query.limit) || loaded;
  if (!(total && size)) {
    return followAll(load, next);
  }
  const offsets = remainingOffsets(total.count, loaded, size);
  if (total.exact) {
    return Promise.all(offsets.map((offset) => load(next, offset)));
  }
  const pages = await Promise.all(
    offsets.map((offset) => load(next, offset).catch(pastEnd))
  );
  const last = pages.findLast((page) => page.data?.length);
  return [...pages, ...(await followAll(load, last?.next))];
};

const merge = (
  document: RawDocument,
  relationship: RawRelationship,
  pages: RawDocument[]
) => {
  const resources = document.resources ?? {};
  for (const page of pages) {
    relationship.data?.push(...(page.data ?? []));
    for (const [type, entries] of Object.entries(page.resources ?? {})) {
      resources[type] ??= {};
      const target = resources[type];
      for (const [id, entry] of Object.entries(entries)) {
        target[id] ??= entry;
      }
    }
  }
  document.resources = resources;
  relationship.next = undefined;
};

const totalOf = (
  resource: RawResource,
  name: string,
  meta: RawRelationship["meta"]
) => {
  if (meta?.total) {
    return { count: meta.total, exact: true };
  }
  const count = countOf(resource, name);
  return count ? { count, exact: false } : undefined;
};

export const completeRelationships = (
  send: Send,
  document: RawDocument,
  resource: RawResource,
  query: Query
) =>
  Promise.all(
    Object.entries(resource.relationships ?? {}).flatMap(
      ([name, relationship]) => {
        const { data, meta, next } = relationship;
        if (!(next && data)) {
          return [];
        }
        const pending =
          filling.get(relationship) ??
          fetchRest(send, next, data.length, totalOf(resource, name, meta), {
            ...query,
            limit: capOf(pageLimits.relationships, resource.type, name),
          }).then(
            (pages) => merge(document, relationship, pages),
            (error: unknown) => {
              filling.delete(relationship);
              throw error;
            }
          );
        filling.set(relationship, pending);
        return [pending];
      }
    )
  );
