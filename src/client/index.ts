import { createCatalog, createSongs } from "@/client/catalog";
import { createCharts } from "@/client/charts";
import { createContext } from "@/client/context";
import { createLibrary } from "@/client/library";
import type { ClientOptions, PageOptions, Scope } from "@/client/options";
import { createRequest } from "@/client/request";
import { createSearch } from "@/client/search";
import { paginate } from "@/internal/pages";
import type { Storefront } from "@/types";

export const createClient = (options: ClientOptions) => {
  if (!options.developerToken) {
    throw new TypeError(
      "createClient needs a developerToken. amp does not ship one: bring your own web player token."
    );
  }
  const context = createContext(options);
  const catalog = createCatalog(context);
  return {
    albums: catalog("albums"),
    appleCurators: catalog("apple-curators"),
    artists: catalog("artists"),
    charts: createCharts(context),
    curators: catalog("curators"),
    genres: catalog("genres"),
    library: createLibrary(context),
    me: {
      storefront: async () => {
        context.requireUser();
        const document = await context.send({ path: "/v1/me/storefront" });
        return context.single<Storefront>(
          document,
          "storefronts",
          document.data?.[0]?.id ?? ""
        );
      },
    },
    musicVideos: catalog("music-videos"),
    paginate,
    playlists: catalog("playlists"),
    recordLabels: catalog("record-labels"),
    request: createRequest(context),
    search: createSearch(context),
    songs: createSongs(context),
    stations: catalog("stations"),
    storefronts: {
      get: async (id: string, scope: Scope = {}) =>
        context.single<Storefront>(
          await context.send({
            path: `/v1/storefronts/${id}`,
            query: { l: context.language(scope) },
          }),
          "storefronts",
          id
        ),
      list: (scope: PageOptions = {}) =>
        context.page<Storefront>({
          path: "/v1/storefronts",
          query: context.pageQuery(scope),
        }),
    },
  };
};

export type Client = ReturnType<typeof createClient>;
