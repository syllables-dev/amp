import type { Context, ResultsDocument } from "@/client/context";
import type { PageOptions, Scope } from "@/client/options";
import { hosts } from "@/config";
import { camelCase, hydrator } from "@/internal/hydrate";
import { toPage } from "@/internal/pages";
import type {
  Query,
  RawDocument,
  RawRelationship,
  RawResource,
} from "@/internal/transport";
import type {
  CamelCase,
  Page,
  Resource,
  SearchType,
  Suggestions,
  UpTo,
} from "@/types";

export type SearchResults<T extends SearchType> = {
  [K in T as CamelCase<K>]: Page<Resource<K>>;
};

interface SuggestionsDocument extends RawDocument {
  results?: {
    suggestions?: {
      kind: string;
      searchTerm?: string;
      displayTerm?: string;
      content?: RawResource;
    }[];
  };
}

interface HintsDocument extends RawDocument {
  results?: { terms?: string[] };
}

const searchTypes = ["albums", "artists", "playlists", "songs"] as const;

const edgeHost = (scope: { edge?: boolean }) =>
  scope.edge ? hosts.edge : undefined;

export const searchPages = async (
  context: Context,
  path: string,
  query: Query,
  types: readonly string[],
  key: (type: string) => string,
  host?: string
) => {
  const document = await context.sendMap<ResultsDocument<RawRelationship>>({
    host,
    path,
    query: { ...query, types },
  });
  return Object.fromEntries(
    types.map((type) => [
      key(type),
      toPage(
        context.sendMap,
        {
          path,
          query: { ...query, types: [type] },
          select: (current: ResultsDocument<RawRelationship>) =>
            current.results?.[type],
        },
        document
      ),
    ])
  );
};

export const createSearch = (context: Context) => {
  const search = async <
    const T extends SearchType = (typeof searchTypes)[number],
  >(
    term: string,
    scope: PageOptions<UpTo<50>> & { edge?: boolean; types?: readonly T[] } = {}
  ): Promise<SearchResults<T>> =>
    searchPages(
      context,
      await context.catalogPath(scope, "search"),
      { ...context.pageQuery(scope), term },
      scope.types ?? searchTypes,
      camelCase,
      edgeHost(scope)
    ) as never;

  const suggestions = async <
    const T extends SearchType = (typeof searchTypes)[number],
  >(
    term: string,
    scope: Scope & {
      edge?: boolean;
      limit?: UpTo<10>;
      types?: readonly T[];
    } = {}
  ): Promise<Suggestions<T>> => {
    const document = await context.send<SuggestionsDocument>({
      host: edgeHost(scope),
      path: await context.catalogPath(scope, "search", "suggestions"),
      query: {
        kinds: "terms,topResults",
        l: context.language(scope),
        "limit[results:terms]": scope.limit,
        "limit[results:topResults]": scope.limit,
        term,
        types: scope.types ?? searchTypes,
      },
    });
    const entries = document.results?.suggestions ?? [];
    const resolve = hydrator<Resource<T>>(document);
    return {
      terms: entries.flatMap((entry) =>
        entry.kind === "terms" && entry.searchTerm
          ? [
              {
                displayTerm: entry.displayTerm ?? entry.searchTerm,
                searchTerm: entry.searchTerm,
              },
            ]
          : []
      ),
      topResults: entries.flatMap((entry) =>
        entry.content ? [resolve(entry.content)] : []
      ),
    };
  };

  const hints = async (
    term: string,
    scope: Scope & { edge?: boolean; limit?: number } = {}
  ) => {
    const document = await context.send<HintsDocument>({
      host: edgeHost(scope),
      path: await context.catalogPath(scope, "search", "hints"),
      query: { ...context.pageQuery(scope), term },
    });
    return document.results?.terms ?? [];
  };

  return Object.assign(search, { hints, suggestions });
};
