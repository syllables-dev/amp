import type { NoExtend, NoViews } from "@/types/common";
import type { Resource } from "@/types/resource";

export interface CreditCategoryAttributes {
  kind:
    | "composer-and-lyrics"
    | "performer"
    | "production-and-engineering"
    | (string & {});
  title: string;
}

export type CreditCategory = Resource<"role-categories", "credit-artists">;

export interface RoleCategoriesEntry {
  attributes: CreditCategoryAttributes;
  defaults: "credit-artists";
  embedded: "credit-artists";
  extended: NoExtend;
  optional: never;
  partial: never;
  refs: never;
  relationships: { "credit-artists": "credit-artists" };
  singleOnly: never;
  views: NoViews;
}
