import type { pageLimits } from "@/limits";
import type { NoViews } from "@/types/common";
import type { Registry, ResourceType } from "@/types/registry";

export type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

export type Attributes<T extends ResourceType> = Registry[T]["attributes"];

export type Relationship<T extends ResourceType> =
  keyof Registry[T]["relationships"] & string;

export type Target<
  T extends ResourceType,
  R extends Relationship<T>,
> = Registry[T]["relationships"][R] & ResourceType;

export type View<T extends ResourceType> = keyof Registry[T]["views"] & string;

export type ViewTarget<
  T extends ResourceType,
  V extends View<T>,
> = Registry[T]["views"][V] & ResourceType;

export type Extended<T extends ResourceType> = Registry[T]["extended"];

export type Extend<T extends ResourceType> = keyof Extended<T> & string;

export type AttributeName<T extends ResourceType> =
  | (keyof Attributes<T> & string)
  | Extend<T>;

type Count<N extends number, A extends number[] = []> = A["length"] extends N
  ? Exclude<A[number], 0> | N
  : Count<N, [...A, A["length"]]>;

export type UpTo<N extends number> = number extends N ? number : Count<N>;

type Cap<C, T, K, D> = T extends keyof C
  ? K extends keyof C[T]
    ? UpTo<C[T][K] & number>
    : D
  : D;

export type RelationshipLimit<T extends ResourceType, R extends string> = Cap<
  typeof pageLimits.relationships,
  T,
  R,
  number
>;

export type ViewLimit<T extends ResourceType, V extends string> = Cap<
  typeof pageLimits.views,
  T,
  V,
  UpTo<100>
>;

export type Defaults<T extends ResourceType> = Registry[T]["defaults"] &
  Relationship<T>;

export type Embedded<T extends ResourceType> = Registry[T]["embedded"] &
  Relationship<T>;

export type Refs<T extends ResourceType> = Registry[T]["refs"] &
  Relationship<T>;

export type SingleOnly<T extends ResourceType> = Registry[T]["singleOnly"] &
  Relationship<T>;

export type Listable<T extends ResourceType> = Exclude<
  Relationship<T>,
  SingleOnly<T>
>;

type Included<
  T extends ResourceType,
  R extends Relationship<T>,
> = R extends Registry[T]["partial"]
  ? (Ref<Target<T, R>> | Resource<Target<T, R>, Embedded<Target<T, R>>>)[]
  : Resource<Target<T, R>, Embedded<Target<T, R>>>[];

export interface Ref<T extends ResourceType = ResourceType> {
  href?: string;
  id: string;
  type: T;
}

export interface Shelf<T extends ResourceType = ResourceType> {
  hasMore: boolean;
  items: Resource<T>[];
  title?: string;
}

type Sparse<A, F extends PropertyKey> = Pick<A, Extract<keyof A, F>>;

type Requested<T extends ResourceType, I extends string> = Extract<
  Relationship<T>,
  I
>;

export type Resource<
  T extends ResourceType,
  I extends string = never,
  F extends PropertyKey = PropertyKey,
  E extends string = never,
> = T extends ResourceType
  ? Ref<T> &
      Sparse<Attributes<T> & Pick<Extended<T>, Extract<E, Extend<T>>>, F> & {
        [R in Exclude<Refs<T>, I> as CamelCase<R>]?: Ref<Target<T, R>>[];
      } & {
        [R in Exclude<
          Requested<T, I>,
          Registry[T]["optional"]
        > as CamelCase<R>]: Included<T, R>;
      } & {
        [R in Extract<
          Requested<T, I>,
          Registry[T]["optional"]
        > as CamelCase<R>]?: Included<T, R>;
      } & {
        meta?: Record<string, unknown>;
      }
  : never;

export type WithViews<T extends ResourceType, V extends string> = [V] extends [
  never,
]
  ? NoViews
  : {
      views: {
        [K in Extract<V, View<T>> as CamelCase<K>]: Shelf<ViewTarget<T, K>>;
      };
    };

export type AnyResource = Resource<ResourceType>;

export interface Page<T> {
  items: T[];
  next?: () => Promise<Page<T>>;
  total?: number;
}

export interface Chart<T> extends Page<T> {
  id: string;
  name: string;
  shortName?: string;
}

export interface Suggestions<T extends ResourceType = ResourceType> {
  terms: { searchTerm: string; displayTerm: string }[];
  topResults: Resource<T>[];
}
