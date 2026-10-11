import {
  isFresh,
  type Query,
  type RawDocument,
  type Send,
} from "@/internal/transport";

interface Batch {
  documents: Promise<Map<string, RawDocument>>;
  ids: Set<string>;
}

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
    const chunks = Array.from(
      { length: Math.ceil(ids.length / 100) },
      (_, index) => ids.slice(index * 100, index * 100 + 100)
    );
    await Promise.all(
      chunks.map(async (chunk) => {
        const document = await send({
          path: `/v1/catalog/${storefront}`,
          query: {
            ...query,
            [`ids[${type}]`]: chunk,
            "format[resources]": "map",
          },
        });
        for (const id of chunk) {
          documents.set(id, document);
        }
      })
    );
    return documents;
  };

  return async (storefront: string, type: string, id: string, query: Query) => {
    const key = `${storefront}\n${type}\n${JSON.stringify(query, Object.keys(query).sort())}`;
    const remembered = known.get(`${key}\n${id}`);
    if (remembered && isFresh(remembered)) {
      return remembered;
    }
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
    if (known.size >= 2000) {
      known.delete(known.keys().next().value ?? "");
    }
    known.set(`${key}\n${id}`, document);
    return document;
  };
};
