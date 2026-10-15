import { follow, remainingOffsets } from "@/internal/pages";
import type {
  Query,
  RawDocument,
  RawRelationship,
  RawResource,
  Send,
} from "@/internal/transport";
import { pageLimits } from "@/limits";

const filling = new WeakMap<RawRelationship, Promise<void>>();

const caps: Record<string, Record<string, number> | undefined> =
  pageLimits.relationships;

const fetchRest = async (
  send: Send,
  next: string,
  loaded: number,
  total: number | undefined,
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
  if (total && size) {
    return Promise.all(
      remainingOffsets(total, loaded, size).map((offset) => load(next, offset))
    );
  }
  const pages: RawDocument[] = [];
  for (let link = next; link; ) {
    // biome-ignore lint/performance/noAwaitInLoops: without a total each page names the next
    const page = await load(link);
    pages.push(page);
    link = page.next ?? "";
  }
  return pages;
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
          fetchRest(send, next, data.length, meta?.total, {
            ...query,
            limit: caps[resource.type]?.[name],
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
