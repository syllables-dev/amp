import type { RawDocument, RawResource } from "@/internal/transport";
import type { AnyResource } from "@/types";

export const camelCase = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_match, letter: string) =>
    letter.toUpperCase()
  );

export const hydrator = <T = AnyResource>(document: RawDocument) => {
  const built = new Map<string, Record<string, unknown>>();
  const building = new Set<string>();

  const build = (ref: RawResource): Record<string, unknown> => {
    const key = `${ref.type}/${ref.id}`;
    const existing = built.get(key);
    if (existing) {
      return existing;
    }
    const raw = document.resources?.[ref.type]?.[ref.id] ?? ref;
    const stub = { href: raw.href, id: raw.id, type: raw.type };
    if (
      building.has(key) ||
      !(raw.attributes || raw.relationships || raw.views)
    ) {
      return stub;
    }
    building.add(key);
    const node: Record<string, unknown> = { ...stub, ...raw.attributes };
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
    if (raw.meta) {
      node.meta = raw.meta;
    }
    building.delete(key);
    built.set(key, node);
    return node;
  };

  return (ref: RawResource) => build(ref) as T;
};
