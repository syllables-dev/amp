import type { Context, ResultsDocument } from "@/client/context";
import type { PageOptions } from "@/client/options";
import { camelCase } from "@/internal/hydrate";
import { toPage } from "@/internal/pages";
import type { RawRelationship } from "@/internal/transport";
import type { CamelCase, Chart, ChartType, Resource, UpTo } from "@/types";

export type ChartExtra = "cityCharts" | "dailyGlobalTopCharts";

export type Charts<
  T extends ChartType,
  W extends ChartExtra = never,
  E extends string = never,
> = {
  [K in T as CamelCase<K>]: Chart<Resource<K, never, PropertyKey, E>>[];
} & { [K in W]: Chart<Resource<"playlists", never, PropertyKey, E>>[] };

interface ChartSlice extends RawRelationship {
  chart?: string;
  name?: string;
  shortName?: string;
}

const chartTypes = ["albums", "playlists", "songs"] as const;

export const createCharts =
  (context: Context) =>
  async <
    const T extends ChartType = (typeof chartTypes)[number],
    const W extends ChartExtra = never,
    const E extends "artistUrl" = never,
  >(
    scope: PageOptions<UpTo<200>> & {
      types?: readonly T[];
      with?: readonly W[];
      extend?: readonly E[];
      genre?: string;
      chart?: string;
    } = {}
  ): Promise<Charts<T, W, E>> => {
    const types = scope.types ?? chartTypes;
    const extras = scope.with ?? [];
    const path = await context.catalogPath(scope, "charts");
    const query = {
      ...context.pageQuery(scope),
      chart: scope.chart,
      extend: scope.extend,
      genre: scope.genre,
      types,
    };
    const document = await context.sendMap<ResultsDocument<ChartSlice[]>>({
      path,
      query: { ...query, with: extras.length > 0 ? extras : undefined },
    });
    const toCharts = (key: string) =>
      (document.results?.[key] ?? []).map((slice, index) => ({
        id: slice.chart ?? "",
        name: slice.name ?? "",
        shortName: slice.shortName,
        ...toPage(
          context.sendMap,
          {
            path,
            query: { ...query, chart: undefined, types: undefined },
            select: (loaded: ResultsDocument<ChartSlice[]>) =>
              loaded.results?.[key]?.[loaded === document ? index : 0],
          },
          document
        ),
      }));
    return Object.fromEntries([
      ...types.map((type) => [camelCase(type), toCharts(type)]),
      ...extras.map((extra) => [extra, toCharts(extra)]),
    ]) as never;
  };
