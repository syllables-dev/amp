import type { Context } from "@/client/context";
import { type Operations, operationHosts } from "@/generated/operations";
import type { Query } from "@/internal/transport";

export type RequestParams<K extends keyof Operations> =
  Record<string, never> extends Operations[K]
    ? [params?: Operations[K]]
    : [params: Operations[K]];

export const createRequest =
  (context: Context) =>
  async <K extends keyof Operations>(
    operation: K,
    ...[params]: RequestParams<K>
  ) => {
    const [method = "GET", template = ""] = operation.split(" ");
    const { body, ...values }: Record<string, unknown> = { ...params };
    if (template.includes("{storefront}")) {
      values.storefront ??= await context.resolveStorefront();
    }
    const path = template.replace(/\{([^}]+)\}/g, (_match, name: string) => {
      const value = values[name];
      delete values[name];
      return encodeURIComponent(String(value));
    });
    return context.send({
      body,
      host: operationHosts[operation],
      method,
      path,
      query: values as Query,
    });
  };
