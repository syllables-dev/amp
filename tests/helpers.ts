import { createClient } from "@/index";

export interface Reply {
  body?: unknown;
  cacheControl?: string;
  delay?: number;
  status?: number;
}

export const fakeApi = (
  reply: (url: URL) => Reply,
  options: { userToken?: string } = {}
) => {
  const urls: URL[] = [];
  const fetcher = (input: string | URL | Request) => {
    const url = new URL(String(input));
    urls.push(url);
    const {
      status = 200,
      body,
      cacheControl = "max-age=60",
      delay = 0,
    } = reply(url);
    return Bun.sleep(delay).then(
      () =>
        new Response(body === undefined ? "" : JSON.stringify(body), {
          headers: { "cache-control": cacheControl },
          status,
        })
    );
  };
  return {
    client: createClient({
      developerToken: "token",
      fetch: fetcher as typeof fetch,
      storefront: "hk",
      userToken: options.userToken,
    }),
    urls,
  };
};

export const song = (id: string) => ({
  attributes: { name: `song ${id}` },
  id,
  type: "songs",
});
