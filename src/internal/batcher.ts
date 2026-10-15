import {
  isFresh,
  type Query,
  type RawDocument,
  remember,
  type Send,
} from "@/internal/transport";

interface Batch {
  documents: Promise<Map<string, RawDocument>>;
  ids: Set<string>;
}

export const idLimits: Record<string, number> = {
  artists: 50,
  genres: 300,
  playlists: 50,
  songs: 300,
};

export const chunk = (ids: string[], type: string) => {
  const size = idLimits[type] ?? 100;
  return Array.from({ length: Math.ceil(ids.length / size) }, (_, index) =>
    ids.slice(index * size, index * size + size)
  );
};

export const createBatcher = (send: Send) => {
  const batches = new Map<string, Batch>();
  const known = new Map<string, RawDocument>();

  const flush = async (
    storefront: string,
    type: string,
    query: Query,
    ids: string[]
  ) => {
    const documents = new Map<string, RawDocument>();
    await Promise.all(
      chunk(ids, type).map(async (group) => {
        const document = await send({
          path: `/v1/catalog/${storefront}`,
          query: { ...query, [`ids[${type}]`]: group },
        });
        for (const id of group) {
          documents.set(id, document);
        }
      })
    );
    return documents;
  };

  return async (storefront: string, type: string, id: string, query: Query) => {
    const key = `${storefront}\n${type}\n${JSON.stringify(query, Object.keys(query).sort())}`;
    const slot = `${key}\n${id}`;
    const remembered = known.get(slot);
    if (remembered && isFresh(remembered)) {
      return remembered;
    }
    known.delete(slot);
    let batch = batches.get(key);
    if (!batch) {
      const ids = new Set<string>();
      const documents = new Promise<Map<string, RawDocument>>(
        (resolve, reject) => {
          setTimeout(() => {
            batches.delete(key);
            flush(storefront, type, query, [...ids]).then(resolve, reject);
          }, 0);
        }
      );
      batch = { documents, ids };
      batches.set(key, batch);
    }
    batch.ids.add(id);
    const document = (await batch.documents).get(id) ?? {};
    if (isFresh(document)) {
      remember(known, slot, document, 2000);
    }
    return document;
  };
};
