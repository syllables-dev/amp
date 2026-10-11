import { version } from "../package.json";

export const hosts = {
  api: "https://amp-api.music.apple.com",
  edge: "https://amp-api-edge.music.apple.com",
};

export const webPlayer = {
  origin: "https://music.apple.com",
  referer: "https://music.apple.com/",
};

export const userAgent = `syllables-amp/${version}`;

export const defaults = {
  storefront: "us",
};
