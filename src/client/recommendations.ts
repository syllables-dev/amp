import type { Context } from "@/client/context";
import type { RecommendationOptions } from "@/client/options";
import { hydrator } from "@/internal/hydrate";
import type {
  PersonalRecommendation,
  RecommendationExtend,
} from "@/types/resources/personal-recommendation";

export const utcOffset = (date = new Date()) => {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes < 0 ? "-" : "+";
  const hours = String(Math.floor(Math.abs(minutes) / 60)).padStart(2, "0");
  const rest = String(Math.abs(minutes) % 60).padStart(2, "0");
  return `${sign}${hours}:${rest}`;
};

export const createRecommendations =
  (context: Context) =>
  async <const E extends RecommendationExtend = never>(
    options: RecommendationOptions<E> = {}
  ): Promise<PersonalRecommendation<E>[]> => {
    const document = await context.sendMap({
      path: "/v1/me/recommendations",
      query: {
        extend: options.extend,
        l: context.language(options),
        name: options.name,
        timezone:
          options.timezone ??
          (options.name === "listen-now" ? utcOffset() : undefined),
      },
    });
    return (document.data ?? []).map(
      hydrator<PersonalRecommendation<E>>(document)
    );
  };
