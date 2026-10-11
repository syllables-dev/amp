export const pageLimits = {
  relationships: {
    albums: { artists: 10, "record-labels": 10, tracks: 300 },
    "apple-curators": { playlists: 25 },
    artists: { albums: 100, "music-videos": 100, playlists: 10 },
    curators: { playlists: 10 },
    "library-albums": { artists: 10, tracks: 300 },
    "library-artists": { albums: 100 },
    "library-music-videos": { albums: 10, artists: 10 },
    "library-playlists": { tracks: 100 },
    "library-songs": { albums: 10, artists: 10 },
    "music-videos": { albums: 10, artists: 10, songs: 10 },
    playlists: { curator: 1, tracks: 300 },
    songs: {
      albums: 10,
      artists: 10,
      composers: 10,
      credits: 5,
      "music-videos": 10,
    },
  },
  views: {
    artists: { "featured-release": 1, "latest-release": 1 },
    playlists: { "featured-artists": 200, "more-by-curator": 200 },
  },
} as const;
