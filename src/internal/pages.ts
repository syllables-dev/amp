import { hosts } from "@/config";
import { hydrator } from "@/internal/hydrate";
import type {
  Query,
  RawDocument,
  RawRelationship,
  Send,
} from "@/internal/transport";
import type { Page } from "@/types";

export interface PageSource<D extends RawDocument> {
  path: string;
  query: Query;
  select?: (document: D) => RawRelationship | undefined;
}

export const toPage = <T, D extends RawDocument = RawDocument>(
  send: Send,
  source: PageSource<D>,
  document: D
): Page<T> => {
  const slice = source.select ? source.select(document) : document;
  const resolve = hydrator<T>(document);
  const next = slice?.next ? new URL(slice.next, hosts.api) : undefined;
  return {
    items: (slice?.data ?? []).map(resolve),
    next: next
      ? () =>
          loadPage<T, D>(send, {
            ...source,
            path: next.pathname,
            query: {
              ...source.query,
              ...Object.fromEntries(next.searchParams),
            },
          })
      : undefined,
    total: document.meta?.total,
  };
};

export const loadPage = async <T, D extends RawDocument = RawDocument>(
  send: Send,
  source: PageSource<D>
) =>
  toPage<T, D>(
    send,
    source,
    await send<D>({
      path: source.path,
      query: { ...source.query, "format[resources]": "map" },
    })
  );

export async function* paginate<T>(page: Page<T> | Promise<Page<T>>) {
  let current: Page<T> | undefined = await page;
  while (current) {
    const upcoming: Promise<Page<T>> | undefined = current.next?.();
    upcoming?.catch(() => undefined);
    yield* current.items;
    // biome-ignore lint/performance/noAwaitInLoops: pages are cursor-linked
    current = await upcoming;
  }
}

export async function* walk<T>(send: Send, source: PageSource<RawDocument>) {
  const first = await loadPage<T>(send, source);
  const size = first.items.length;
  if (!(first.next && first.total && size)) {
    yield* paginate(first);
    return;
  }
  yield* first.items;
  const offsets = Array.from(
    { length: Math.ceil((first.total - size) / size) },
    (_, index) => size * (index + 1)
  );
  const pending: Promise<Page<T>>[] = [];
  let cursor = 0;
  const refill = () => {
    while (pending.length < 6 && cursor < offsets.length) {
      const upcoming = loadPage<T>(send, {
        ...source,
        query: { ...source.query, offset: offsets[cursor] },
      });
      upcoming.catch(() => undefined);
      pending.push(upcoming);
      cursor += 1;
    }
  };
  refill();
  for (let upcoming = pending.shift(); upcoming; upcoming = pending.shift()) {
    refill();
    // biome-ignore lint/performance/noAwaitInLoops: pages are yielded in order while later ones load
    yield* (await upcoming).items;
  }
}
