import type { RawDocument, RawResource } from "@/internal/transport";
import type { AnyResource } from "@/types";

interface Hydrated {
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export const camelCase = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_match, letter: string) =>
    letter.toUpperCase()
  );

const withMeta = (node: Hydrated, meta?: Record<string, unknown>): Hydrated =>
  meta ? { ...node, meta: { ...node.meta, ...meta } } : node;

export const hydrator = <T = AnyResource>(document: RawDocument) => {
  const built = new Map<string, Hydrated>();
  const building = new Set<string>();

  const build = (ref: RawResource): Hydrated => {
    const key = `${ref.type}/${ref.id}`;
    const existing = built.get(key);
    if (existing) {
      return withMeta(existing, ref.meta);
    }
    const entry = document.resources?.[ref.type]?.[ref.id];
    const raw = entry ?? ref;
    const stub = { href: raw.href, id: raw.id, type: raw.type };
    if (
      building.has(key) ||
      !(raw.attributes || raw.relationships || raw.views)
    ) {
      return stub;
    }
    building.add(key);
    const node: Hydrated = { ...stub, ...raw.attributes };
    for (const [name, relationship] of Object.entries(
      raw.relationships ?? {}
    )) {
      if (relationship.data) {
        node[camelCase(name)] = relationship.data.map(build);
      }
    }
    if (raw.views) {
      node.views = Object.fromEntries(
        Object.entries(raw.views).map(([name, view]) => [
          camelCase(name),
          {
            items: (view.data ?? []).map(build),
            title: view.attributes?.title,
          },
        ])
      );
    }
    if (entry?.meta) {
      node.meta = entry.meta;
    }
    building.delete(key);
    built.set(key, node);
    return withMeta(node, ref.meta);
  };

  return (ref: RawResource) => build(ref) as T;
};
