export interface Operations {
  "GET /v1/catalog/{storefront}": {
    "storefront"?: string;
    "ids[albums]"?: readonly string[];
    "ids[songs]"?: readonly string[];
    "ids[artists]"?: readonly string[];
    "ids[curators]"?: readonly string[];
    "ids[apple-curators]"?: readonly string[];
    "ids[playlists]"?: readonly string[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "extend[curators]"?: readonly ("plainEditorialNotes" | "playlistCount")[];
    "extend[apple-curators]"?: readonly ("plainEditorialNotes" | "playlistCount")[];
    "relate"?: readonly ("catalog" | "library")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artists" | "curator")[];
    "extend"?: readonly ("artistBio" | "artistUrl" | "bornOrFormed" | "credits" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "followState" | "hasBiographyContent" | "hasCollaboration" | "hasTastePreferences" | "hero" | "hideListeningTo" | "isCollaborativeHost" | "isGroup" | "keyColor" | "lockupStyle" | "lyricsExcerpt" | "notificationSettings" | "offers" | "origin" | "pendingFollowersCount" | "plainEditorialCard" | "plainEditorialNotes" | "playlistCount" | "seeAllDisplay" | "seoDescription" | "seoTitle" | "trackCount" | "uber")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/{type}/{id}": {
    "storefront"?: string;
    "type": "albums" | "apple-curators" | "artists" | "audio-analysis" | "classical-works" | "concerts" | "curators" | "genres" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "songs" | "station-genres" | "stations" | "tv-episodes" | "tv-seasons" | "tv-shows" | "uploaded-audios" | "uploaded-videos" | "venues";
    "id": string;
    "fields"?: string;
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "fields[songs]"?: readonly ("albumName" | "artistName" | "artistUrl" | "artwork" | "audioTraits" | "composerName" | "contentRating" | "curatorName" | "durationInMillis" | "extendedAssetUrls" | "hasLyrics" | "name" | "playParams" | "previews" | "url")[];
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "include[albums]"?: readonly ("artists" | "composers" | "tracks")[];
    "include[music-videos]"?: readonly ("artists" | "catalog" | "composers" | "tracks")[];
    "include[playlists]"?: readonly ("curator" | "tracks")[];
    "include[groupings]"?: readonly string[];
    "include[concerts]"?: readonly ("venues" | "artists" | "playlists")[];
    "extend[concerts]"?: readonly ("eventDataProviders" | "ticketDataProvider" | "tickets" | "url")[];
    "omit[resource:artists]"?: readonly "autos"[];
    "relate[songs]"?: readonly "albums"[];
    "meta[albums:tracks]"?: readonly "popularity"[];
    "limit[tracks]"?: number;
    "filter[personal-mix]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artist-biography-canvas" | "artists" | "bands" | "canvas" | "catalog" | "contents" | "credits" | "curator" | "default-playable-content" | "episodes" | "followees" | "followers" | "grouping" | "listening-to" | "lyrics" | "music-videos" | "pending-followers" | "persons" | "playlists" | "radio-show" | "record-labels" | "shareable-playlists" | "shared-playlists" | "show" | "social-profile" | "tracks" | "tv-seasons")[];
    "extend"?: readonly ("artistBio" | "artistUrl" | "bornOrFormed" | "credits" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "followState" | "hasBiographyContent" | "hasCollaboration" | "hasTastePreferences" | "hero" | "hideListeningTo" | "isCollaborativeHost" | "isGroup" | "keyColor" | "lockupStyle" | "lyricsExcerpt" | "notificationSettings" | "offers" | "origin" | "pendingFollowersCount" | "plainEditorialCard" | "plainEditorialNotes" | "playlistCount" | "seeAllDisplay" | "seoDescription" | "seoTitle" | "trackCount" | "uber")[];
    "views"?: readonly ("all-upcoming-concerts" | "appears-on" | "appears-on-albums" | "audio-extras" | "collaborators" | "compilation-albums" | "contributors" | "cross-merchandise" | "featured-albums" | "featured-artists" | "featured-on-albums" | "featured-release" | "full-albums" | "latest-release" | "latest-releases" | "live-albums" | "more-by-artist" | "more-by-curator" | "more-in-genre" | "more-to-hear" | "more-to-see" | "more-upcoming-concerts" | "music-artists" | "music-videos" | "nearby-upcoming-concerts" | "other-episodes" | "other-versions" | "playlists" | "radio-shows" | "related-videos" | "similar-artists" | "singles" | "subscribers" | "top-releases" | "top-songs" | "video-extras" | "you-might-also-like")[];
    "with"?: readonly ("album" | "attributes" | "cityCharts" | "concerts" | "dailyGlobalTopCharts" | "friendsMix" | "library" | "lightProfiles" | "lyricHighlights" | "lyrics" | "marketingItems" | "naturalLanguage" | "nonOnboarded" | "nonSubscribers" | "pivot-meta" | "serverBubbles" | "shared" | "social" | "subtitles" | "voice")[];
    "types"?: readonly ("activities" | "albums" | "apple-curators" | "artists" | "concerts" | "curators" | "editorial-items" | "library-albums" | "library-playlists" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "social-profiles" | "social-upsells" | "songs" | "stations" | "tv-episodes" | "tv-shows" | "uploaded-audios" | "uploaded-videos")[];
    "sparse"?: readonly ("library-albums" | "library-playlists")[];
    "displayFilter[kind]"?: readonly ("MusicCardShelf" | "MusicCircleCoverShelf" | "MusicConcertsEmptyShelf" | "MusicCoverGrid" | "MusicCoverShelf" | "MusicHorizontalLockupGrid" | "MusicNotesHeroShelf" | "MusicSocialCardShelf" | "MusicSuperHeroShelf" | "musicSuperHero")[];
    "timezone"?: string;
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/{type}": {
    "storefront"?: string;
    "type": "albums" | "apple-curators" | "artists" | "audio-analysis" | "classical-works" | "concerts" | "curators" | "genres" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "songs" | "station-genres" | "stations" | "tv-episodes" | "tv-seasons" | "tv-shows" | "uploaded-audios" | "uploaded-videos" | "venues";
    "ids"?: string;
    "filter[upc]"?: string;
    "filter[isrc]"?: string;
    "filter[equivalents]"?: string;
    "filter[identity]"?: string;
    "meta[stations]"?: readonly "inflectionPoints"[];
    "fields"?: readonly string[];
    "fields[tv-episodes]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("episodes" | "show")[];
    "include[groupings]"?: readonly string[];
    "include[albums]"?: readonly string[];
    "include[songs]"?: readonly string[];
    "include[music-videos]"?: readonly string[];
    "omit[resource:artists]"?: readonly "autos"[];
    "extend"?: readonly "credits"[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/songs/{id}/albums": {
    "storefront"?: string;
    "id": string;
    "limit"?: number;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/catalog/{storefront}/{type}/{id}/{relationship}": {
    "storefront"?: string;
    "type": "albums" | "apple-curators" | "artists" | "audio-analysis" | "classical-works" | "concerts" | "curators" | "genres" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "songs" | "station-genres" | "stations" | "tv-episodes" | "tv-seasons" | "tv-shows" | "uploaded-audios" | "uploaded-videos" | "venues";
    "id": string;
    "relationship": "albums" | "artists" | "audio-analysis" | "composers" | "credits" | "curator" | "episodes" | "events" | "genres" | "library" | "lyrics" | "music-videos" | "playlists" | "record-labels" | "seasons" | "songs" | "station" | "stations" | "syllable-lyrics" | "tracks" | "tv-seasons" | "venues" | "works";
    "limit"?: number;
    "offset"?: number;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artist-biography-canvas" | "artists" | "bands" | "canvas" | "catalog" | "contents" | "credits" | "curator" | "default-playable-content" | "episodes" | "followees" | "followers" | "grouping" | "listening-to" | "lyrics" | "music-videos" | "pending-followers" | "persons" | "playlists" | "radio-show" | "record-labels" | "shareable-playlists" | "shared-playlists" | "show" | "social-profile" | "tracks" | "tv-seasons")[];
    "extend"?: readonly ("artistBio" | "artistUrl" | "bornOrFormed" | "credits" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "followState" | "hasBiographyContent" | "hasCollaboration" | "hasTastePreferences" | "hero" | "hideListeningTo" | "isCollaborativeHost" | "isGroup" | "keyColor" | "lockupStyle" | "lyricsExcerpt" | "notificationSettings" | "offers" | "origin" | "pendingFollowersCount" | "plainEditorialCard" | "plainEditorialNotes" | "playlistCount" | "seeAllDisplay" | "seoDescription" | "seoTitle" | "trackCount" | "uber")[];
    "fields"?: readonly string[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/artists/{id}/view/{view}": {
    "storefront"?: string;
    "id": string;
    "view": "appears-on-albums" | "featured-albums" | "featured-playlists" | "featured-release" | "full-albums" | "latest-release" | "live-albums" | "more-to-hear" | "more-to-see" | "playlists" | "radio-shows" | "similar-artists" | "singles" | "top-music-videos" | "top-songs";
    "limit"?: number;
    "with"?: readonly "attributes"[];
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "include[albums]"?: readonly ("artists" | "composers" | "tracks")[];
    "include[music-videos]"?: readonly ("artists" | "catalog" | "composers" | "tracks")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/catalog/{storefront}/{type}/{id}/view/{viewId}": {
    "storefront"?: string;
    "type": string;
    "id": string;
    "viewId": string;
    "limit"?: number;
    "with"?: readonly string[];
    "include[songs]"?: readonly string[];
    "include[concerts]"?: readonly string[];
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "extend"?: readonly string[];
    "art[url]"?: readonly ("c" | "f")[];
  };
  "GET /v1/catalog/{storefront}/artists/{id}": {
    "storefront"?: string;
    "id": string;
    "include[canvas-shelves-collection]"?: readonly "contents"[];
    "include[canvas-shelves-group]"?: readonly "children"[];
    "extend[canvas-shelves-header]"?: readonly "badge"[];
    "relate[canvas-shelves-collection]"?: readonly "see-all"[];
    "limit[canvas-shelves-collection:contents]"?: number;
    "limit[canvas-shelves-collection:contents{displayStyle}]"?: string;
    "filter[canvas-shelves-collection:contents{type}]"?: string;
    "include[concerts]"?: readonly ("artists" | "playlists" | "venues")[];
    "extend[concerts]"?: readonly ("eventDataProviders" | "ticketDataProvider" | "tickets" | "url")[];
    "extend[playlists]"?: readonly string[];
    "limit[artists:top-songs]"?: number;
    "geoHashLocation"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("artist-biography-canvas" | "artists" | "bands" | "canvas" | "default-playable-content" | "persons" | "record-labels")[];
    "extend"?: readonly ("artistBio" | "bornOrFormed" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "hasBiographyContent" | "hero" | "isGroup" | "keyColor" | "origin" | "plainEditorialNotes" | "seoDescription" | "seoTitle")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "fields"?: readonly string[];
  };
  "GET /v1/catalog/{storefront}/albums/{id}": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "offers" | "seoDescription" | "seoTitle")[];
    "include"?: readonly ("artists" | "record-labels")[];
    "views"?: readonly ("appears-on" | "audio-extras" | "more-by-artist" | "other-versions" | "related-videos" | "video-extras" | "you-might-also-like")[];
    "meta[albums:tracks]"?: readonly "popularity"[];
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "include[music-videos]"?: readonly ("artists" | "catalog" | "composers" | "tracks")[];
    "include[playlists]"?: readonly ("curator" | "tracks")[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[record-labels]"?: readonly ("name" | "url")[];
    "fields[curators]"?: readonly ("name" | "url")[];
    "fields[catalog]"?: readonly string[];
    "include[catalog]"?: readonly string[];
    "limit[artists:top-songs]"?: number;
    "fields"?: readonly string[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/playlists/{id}": {
    "storefront"?: string;
    "id": string;
    "fields[playlists]"?: readonly string[];
    "fields[collaborators]"?: readonly string[];
    "include[reactions]"?: readonly string[];
    "with"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("editorialArtwork" | "editorialVideo" | "followState" | "offers" | "seoDescription" | "seoTitle" | "trackCount")[];
    "include"?: readonly ("curator" | "tracks")[];
    "views"?: readonly ("featured-artists" | "more-by-curator")[];
    "limit[tracks]"?: number;
    "limit[view.more-by-curator]"?: number;
    "limit[view.featured-artists]"?: number;
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "include[music-videos]"?: readonly ("artists" | "catalog" | "composers" | "tracks")[];
    "fields[songs]"?: readonly ("albumName" | "artistName" | "artistUrl" | "artwork" | "audioTraits" | "composerName" | "contentRating" | "curatorName" | "durationInMillis" | "extendedAssetUrls" | "hasLyrics" | "name" | "playParams" | "previews" | "url")[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url" | "audioTraits" | "copyright")[];
    "fields[curators]"?: readonly ("name" | "url")[];
    "fields[apple-curators]"?: readonly ("name" | "url")[];
    "fields[social-profiles]"?: readonly ("artwork" | "handle" | "name")[];
    "fields[record-labels]"?: readonly string[];
    "fields[catalog]"?: readonly string[];
    "include[catalog]"?: readonly string[];
    "include[playlists]"?: readonly string[];
    "meta[albums:tracks]"?: string;
    "limit[artists:top-songs]"?: number;
    "meta[playlists:tracks]"?: readonly "contributors"[];
    "relate[playlists]"?: readonly "tracks"[];
    "associate[playlists:tracks]"?: readonly ("collaborators" | "reactions")[];
    "limit[collaborators]"?: number;
    "limit[view.contributors]"?: number;
    "filter[personal-mix]"?: string;
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/songs/{id}": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("extendedAssetUrls" | "lyricsExcerpt" | "offers")[];
    "include"?: readonly ("albums" | "artists" | "credits" | "lyrics" | "music-videos")[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/charts": {
    "storefront"?: string;
    "types"?: readonly ("albums" | "music-videos" | "playlists" | "songs")[];
    "chart"?: string;
    "genre"?: string;
    "limit"?: number;
    "with"?: readonly ("cityCharts" | "dailyGlobalTopCharts")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "fields[playlists]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "curatorName" | "editorialArtwork" | "lastModifiedDate" | "name" | "playParams" | "releaseDate" | "tracks" | "url")[];
    "include[songs]"?: readonly string[];
    "relate[songs]"?: readonly string[];
    "include[albums]"?: readonly string[];
    "include[music-videos]"?: readonly string[];
    "fields[artists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly "tracks"[];
    "extend"?: readonly "artistUrl"[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/genres": {
    "storefront"?: string;
    "ids[l]"?: string;
    "ids[platform]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/catalog/{storefront}/contents": {
    "storefront"?: string;
    "ids"?: string;
    "filter[post]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("artists" | "curator")[];
  };
  "POST /v1/catalog/{storefront}/concerns": {
    "storefront"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/catalog/{storefront}/search": {
    "storefront"?: string;
    "term": string;
    "types"?: readonly ("activities" | "albums" | "apple-curators" | "artists" | "curators" | "editorial-items" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "songs" | "stations" | "tv-episodes" | "uploaded-videos")[];
    "limit"?: number;
    "offset"?: number;
    "with"?: readonly ("lyricHighlights" | "lyrics" | "naturalLanguage" | "serverBubbles" | "subtitles")[];
    "groups"?: string;
    "art[music-videos:url]"?: readonly ("c" | "f")[];
    "relate[albums]"?: readonly "artists"[];
    "relate[songs]"?: readonly "albums"[];
    "relate[editorial-items]"?: readonly string[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "include[albums]"?: readonly ("artists" | "composers" | "tracks")[];
    "include[stations]"?: readonly ("events" | "radio-show")[];
    "include[editorial-items]"?: readonly string[];
    "include[artists]"?: readonly string[];
    "include[music-videos]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly "artistUrl"[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/search/suggestions": {
    "storefront"?: string;
    "term": string;
    "kinds": string;
    "types"?: readonly ("activities" | "albums" | "artists" | "editorial-items" | "music-movies" | "music-videos" | "playlists" | "record-labels" | "songs" | "stations" | "tv-episodes")[];
    "limit[results:terms]"?: number;
    "limit[results:topResults]"?: number;
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "with"?: readonly "naturalLanguage"[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/catalog/{storefront}/search/hints": {
    "storefront"?: string;
    "term": string;
    "limit"?: number;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
  };
  "GET /v1/storefronts": {
    "l"?: string;
  };
  "GET /v1/storefronts/{id}": {
    "id": string;
    "l"?: string;
  };
  "GET /v1/editorial/{storefront}/groupings": {
    "storefront"?: string;
    "name"?: string;
    "ids"?: string;
    "genre"?: string;
    "tabs"?: "subscriber" | "nonsubscriber";
    "omit[resource:artists]"?: readonly ("autos" | "relationships")[];
    "relate[songs]"?: readonly "albums"[];
    "include[stations]"?: readonly ("events" | "radio-show")[];
    "include[albums]"?: readonly string[];
    "include[music-videos]"?: readonly string[];
    "include[songs]"?: readonly string[];
    "extend[station-events]"?: readonly "editorialVideo"[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artist-biography-canvas" | "artists" | "bands" | "canvas" | "catalog" | "contents" | "credits" | "curator" | "default-playable-content" | "episodes" | "followees" | "followers" | "grouping" | "listening-to" | "lyrics" | "music-videos" | "pending-followers" | "persons" | "playlists" | "radio-show" | "record-labels" | "shareable-playlists" | "shared-playlists" | "show" | "social-profile" | "tracks" | "tv-seasons")[];
    "extend"?: readonly ("artistUrl" | "editorialArtwork" | "plainEditorialNotes")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/editorial/{storefront}/groupings/{id}": {
    "storefront"?: string;
    "id": string;
    "include[groupings]"?: readonly "curator"[];
    "tabs"?: "subscriber" | "nonsubscriber";
    "include[songs]"?: readonly string[];
    "include[music-videos]"?: readonly string[];
    "include[albums]"?: readonly string[];
    "fields[artists]"?: readonly string[];
    "fields[albums]"?: readonly string[];
    "omit[resource:artists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artist-biography-canvas" | "artists" | "bands" | "canvas" | "catalog" | "contents" | "credits" | "curator" | "default-playable-content" | "episodes" | "followees" | "followers" | "grouping" | "listening-to" | "lyrics" | "music-videos" | "pending-followers" | "persons" | "playlists" | "radio-show" | "record-labels" | "shareable-playlists" | "shared-playlists" | "show" | "social-profile" | "tracks" | "tv-seasons")[];
    "extend"?: readonly ("artistUrl" | "editorialArtwork" | "plainEditorialNotes")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/editorial/{storefront}/rooms/{id}": {
    "storefront"?: string;
    "id": string;
    "omit[resource:artists]"?: readonly ("autos" | "relationships")[];
    "relate[songs]"?: readonly "albums"[];
    "extend[albums]"?: readonly "artistUrl"[];
    "include[groupings]"?: readonly string[];
    "include[albums]"?: readonly string[];
    "include[songs]"?: readonly string[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url" | "editorialNotes")[];
    "fields[albums]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "editorialArtwork" | "editorialNotes" | "editorialVideo" | "genreNames" | "name" | "plainEditorialNotes" | "playParams" | "releaseDate" | "trackCount" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("albums" | "artist-biography-canvas" | "artists" | "bands" | "canvas" | "catalog" | "contents" | "credits" | "curator" | "default-playable-content" | "episodes" | "followees" | "followers" | "grouping" | "listening-to" | "lyrics" | "music-videos" | "pending-followers" | "persons" | "playlists" | "radio-show" | "record-labels" | "shareable-playlists" | "shared-playlists" | "show" | "social-profile" | "tracks" | "tv-seasons")[];
    "extend"?: readonly ("offers" | "seoDescription" | "seoTitle")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/editorial/{storefront}/multirooms/{id}": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("editorialArtwork" | "lockupStyle" | "seoDescription" | "seoTitle" | "uber")[];
    "art[url]"?: readonly ("c" | "f")[];
  };
  "GET /v1/editorial/{storefront}/multiplex/{id}": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/recommendations/{storefront}": {
    "storefront"?: string;
    "name": string;
    "types"?: readonly ("activities" | "apple-curators" | "editorial-items")[];
    "with"?: readonly "concerts"[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("artistBio" | "artistUrl" | "bornOrFormed" | "credits" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "followState" | "hasBiographyContent" | "hasCollaboration" | "hasTastePreferences" | "hero" | "hideListeningTo" | "isCollaborativeHost" | "isGroup" | "keyColor" | "lockupStyle" | "lyricsExcerpt" | "notificationSettings" | "offers" | "origin" | "pendingFollowersCount" | "plainEditorialCard" | "plainEditorialNotes" | "playlistCount" | "seeAllDisplay" | "seoDescription" | "seoTitle" | "trackCount" | "uber")[];
    "art[url]"?: readonly ("c" | "f")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/concerts/{storefront}/hub": {
    "storefront"?: string;
    "geoHashLocation": string;
    "containers": string;
    "limit[concerts-this-week]"?: number;
    "limit[popular-concerts]"?: number;
    "filter[date]"?: string;
    "filter[genre]"?: string;
    "include[concerts]"?: readonly ("artists" | "playlists" | "venues")[];
    "art[artists:url]"?: readonly ("c" | "f")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("editorialArtwork" | "hero")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/lyrics/{storefront}/snippet/songs/{id}": {
    "storefront"?: string;
    "id": string;
    "ts": string;
    "te": string;
    "tk": string;
    "l": string;
    "with"?: readonly "album"[];
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/engagement/{storefront}/upsell/marketing-items": {
    "storefront"?: string;
    "serviceType": "music";
    "placement": "musicAppLaunch" | "musicListenNowUpsell" | "musicPlaybackUpsell" | "musicPreBuyFlow" | "musicSharedListenUpsell";
    "limit"?: number;
    "with"?: readonly "voice"[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "POST /v1/engagement/{storefront}/upsell": {
    "storefront"?: string;
    "types"?: readonly ("marketing-items" | "message-items")[];
    "meta[marketing-items]"?: readonly "metrics"[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "include"?: readonly "contents"[];
    body: unknown;
  };
  "GET /v1/me/account": {
    "meta"?: "subscription";
    "challenge[subscriptionCapabilities]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("hasTastePreferences" | "notificationSettings")[];
  };
  "PATCH /v1/me/account": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/me/storefront": {
    "l"?: string;
  };
  "GET /v1/me/taste/taste-preferences": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "POST /v1/me/taste/taste-preferences": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "POST /v1/me/favorites": {
    "ids[artists]"?: readonly string[];
    "ids[playlists]"?: readonly string[];
    "ids[albums]"?: readonly string[];
    "ids[stations]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
  };
  "DELETE /v1/me/favorites": {
    "ids[artists]"?: readonly string[];
    "ids[playlists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
  };
  "GET /v1/me/recent/radio-stations": {
    "limit"?: number;
    "include[stations]"?: readonly ("events" | "radio-show")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/me/recommendations": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("editorialArtwork" | "editorialVideo" | "plainEditorialCard" | "plainEditorialNotes")[];
    "with"?: readonly ("friendsMix" | "library" | "marketingItems" | "social" | "voice")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/me/recommendations/{id}/view/see-all": {
    "id": string;
    "name"?: string;
    "action"?: string;
    "include[personal-recommendation]"?: readonly ("contents" | "primary-content")[];
    "include[library-playlists]"?: readonly ("catalog" | "playlists" | "tracks")[];
    "limit[contents]"?: number;
    "with"?: readonly ("friendsMix" | "library" | "social")[];
    "geoHashLocation"?: string;
    "include[concerts]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("artistBio" | "artistUrl" | "bornOrFormed" | "credits" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "followState" | "hasBiographyContent" | "hasCollaboration" | "hasTastePreferences" | "hero" | "hideListeningTo" | "isCollaborativeHost" | "isGroup" | "keyColor" | "lockupStyle" | "lyricsExcerpt" | "notificationSettings" | "offers" | "origin" | "pendingFollowersCount" | "plainEditorialCard" | "plainEditorialNotes" | "playlistCount" | "seeAllDisplay" | "seoDescription" | "seoTitle" | "trackCount" | "uber")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "POST /v1/me/recommendations/suggested": {
    "contexts"?: "playlist-suggested-songs";
    "types"?: readonly "songs"[];
    "meta"?: string;
    "limit"?: number;
    "action"?: "save";
    "fields[songs]"?: readonly ("albumName" | "artistName" | "artistUrl" | "artwork" | "audioTraits" | "composerName" | "contentRating" | "curatorName" | "durationInMillis" | "extendedAssetUrls" | "hasLyrics" | "name" | "playParams" | "previews" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly "songs"[];
    "omit[resource]"?: readonly "autos"[];
    body: unknown;
  };
  "GET /v1/me/library": {
    "ids[songs]"?: readonly string[];
    "ids[albums]"?: readonly string[];
    "ids[library-songs]"?: readonly string[];
    "relate"?: readonly "library"[];
    "fields"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("artists" | "curator")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "POST /v1/me/library": {
    "ids[songs]"?: readonly string[];
    "ids[albums]"?: readonly string[];
    "ids[playlists]"?: readonly string[];
    "ids[music-videos]"?: readonly string[];
    "representation"?: "ids";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/{type}/{id}": {
    "type": "songs" | "albums" | "artists" | "music-videos" | "playlists";
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "DELETE /v1/me/library/{type}/{id}": {
    "type": "library-songs" | "library-albums" | "library-artists" | "library-music-videos" | "library-playlists" | "library-playlist-folders";
    "id": string;
  };
  "GET /v1/me/library/{type}/{id}/{relationship}": {
    "type": "songs" | "albums" | "artists" | "music-videos" | "playlists";
    "id": string;
    "relationship": "tracks";
    "limit"?: number;
    "offset"?: number;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/songs": {
    "limit"?: number;
    "offset"?: number;
    "sort"?: "name" | "-name" | "artistName" | "-artistName" | "albumName" | "-albumName" | "dateAdded" | "-dateAdded" | "releaseDate" | "-releaseDate" | "type" | "-type";
    "meta"?: "sorts";
    "include[library-songs]"?: readonly ("albums" | "artists" | "catalog" | "playlists")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/music-videos": {
    "limit"?: number;
    "offset"?: number;
    "sort"?: "name" | "-name" | "artistName" | "-artistName" | "albumName" | "-albumName" | "dateAdded" | "-dateAdded" | "releaseDate" | "-releaseDate" | "type" | "-type";
    "meta"?: string;
    "include[library-music-videos]"?: readonly ("albums" | "artists" | "catalog" | "playlists")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/artists": {
    "limit"?: number;
    "offset"?: number;
    "sort"?: "name" | "-name" | "artistName" | "-artistName" | "albumName" | "-albumName" | "dateAdded" | "-dateAdded" | "releaseDate" | "-releaseDate" | "type" | "-type";
    "meta"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly "catalog"[];
  };
  "GET /v1/me/library/artists/{id}": {
    "id": string;
    "include[library-artists]"?: readonly ("albums" | "catalog")[];
    "include[library-albums]"?: readonly ("artists" | "catalog" | "tracks")[];
    "fields[library-artists]"?: readonly ("artwork" | "classicalUrl" | "name" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/me/library/albums": {
    "limit"?: number;
    "offset"?: number;
    "fields[albums]"?: readonly string[];
    "sort"?: string;
    "meta"?: string;
    "includeOnly"?: string;
    "include[library-albums]"?: readonly string[];
    "include[albums]"?: readonly string[];
    "fields[artists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/albums/{id}": {
    "id": string;
    "includeOnly"?: string;
    "include[library-albums]"?: readonly ("artists" | "catalog" | "tracks")[];
    "include[albums]"?: readonly ("artists" | "composers" | "tracks")[];
    "extend[albums]"?: readonly "artistUrl"[];
    "include[music-videos]"?: readonly string[];
    "fields[artists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/recently-added": {
    "limit"?: number;
    "offset"?: number;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("artists" | "catalog" | "playlists" | "tracks")[];
  };
  "GET /v1/me/library/search": {
    "term": string;
    "types"?: readonly ("library-albums" | "library-artists" | "library-playlists" | "library-songs")[];
    "limit"?: number;
    "include[library-artists]"?: readonly ("albums" | "catalog")[];
    "include[library-songs]"?: readonly ("albums" | "artists" | "catalog" | "playlists")[];
    "fields[library-artists]"?: readonly ("artwork" | "classicalUrl" | "name" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/import/jobs/{sessionId}/progress": {
    "sessionId": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "PUT /v1/me/ratings/{type}/{id}": {
    "type": string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/ratings/{type}/{id}": {
    "type": string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/library/playlists": {
    "sort"?: "name" | "-name" | "artistName" | "-artistName" | "albumName" | "-albumName" | "dateAdded" | "-dateAdded" | "releaseDate" | "-releaseDate" | "type" | "-type";
    "filter[featured]"?: "made-for-you" | "suggested";
    "filter[library-mix]"?: string;
    "include[library-playlists]"?: readonly ("catalog" | "playlists" | "tracks")[];
    "fields[library-playlists]"?: readonly ("artwork" | "dateAdded" | "name" | "playParams")[];
    "fields[playlists]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "curatorName" | "editorialArtwork" | "lastModifiedDate" | "name" | "playParams" | "releaseDate" | "tracks" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "omit[resource]"?: readonly "autos"[];
  };
  "POST /v1/me/library/playlists": {
    "with"?: readonly "shared"[];
    "l"?: string;
    body: unknown;
  };
  "GET /v1/me/library/playlists/{id}": {
    "id": string;
    "extend[library-playlists]"?: readonly "tags"[];
    "extend[playlists]"?: readonly ("artistNames" | "editorialArtwork" | "editorialVideo" | "extendedAssetUrls" | "trackCount")[];
    "include[library-playlists]"?: readonly ("catalog" | "playlists" | "tracks")[];
    "relate"?: readonly "catalog"[];
    "sort"?: string;
    "art[library-music-videos:url]"?: readonly ("c" | "f")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("artists" | "catalog" | "tracks")[];
    "extend"?: readonly ("followState" | "hasCollaboration" | "isCollaborativeHost")[];
    "omit[resource]"?: readonly "autos"[];
  };
  "PATCH /v1/me/library/playlists/{id}": {
    "id": string;
    "with"?: readonly "shared"[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/me/library/playlists/{id}/tracks": {
    "id": string;
    "limit"?: number;
    "offset"?: number;
    "include[songs]"?: readonly ("albums" | "artists" | "composers")[];
    "fields[library-songs]"?: readonly ("artwork" | "id" | "name" | "url")[];
    "fields[artists]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "POST /v1/me/library/playlists/{id}/tracks": {
    "id": string;
    "representation"?: "resources" | "ids";
    "l"?: string;
    body: unknown;
  };
  "DELETE /v1/me/library/playlists/{id}/tracks": {
    "id": string;
    "ids[library-songs]": readonly string[];
    "mode": "all";
  };
  "PUT /v1/me/library/playlists/{id}/tracks": {
    "id": string;
    "l"?: string;
    body: unknown;
  };
  "GET /v1/me/library/playlists/{id}/catalog": {
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("followState" | "hasCollaboration" | "isCollaborativeHost")[];
    "include"?: readonly ("artists" | "catalog" | "playlists" | "tracks")[];
  };
  "POST /v1/me/library/playlists/{id}/catalog": {
    "id": string;
    "l"?: string;
    body?: unknown;
  };
  "GET /v1/me/library/playlists/{id}/parent": {
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "PUT /v1/me/library/playlists/{id}/parent": {
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/me/library/playlist-folders/{id}/children": {
    "id": string;
    "offset"?: number;
    "extend[library-playlists]"?: readonly "tags"[];
    "fields[playlists]"?: readonly ("artistName" | "artistUrl" | "artwork" | "contentRating" | "curatorName" | "editorialArtwork" | "lastModifiedDate" | "name" | "playParams" | "releaseDate" | "tracks" | "url")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly "catalog"[];
    "extend"?: readonly "hasCollaboration"[];
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/me/library/pins": {
    "meta"?: "libraryPin";
    "limit"?: number;
    "include[library-songs]"?: readonly ("albums" | "artists" | "catalog" | "playlists")[];
    "include[library-artists]"?: readonly ("albums" | "catalog")[];
    "fields[artists]"?: readonly ("artwork" | "editorialArtwork" | "genreNames" | "inFavorites" | "name" | "plainEditorialNotes" | "url")[];
    "include[library-music-videos]"?: readonly string[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "POST /v1/me/library/pins/{id}": {
    "id": string;
    "after"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body?: unknown;
  };
  "PATCH /v1/me/library/pins/{id}": {
    "id": string;
    "action": "play" | "shuffle";
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "DELETE /v1/me/library/pins/{id}": {
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/social/profile": {
    "ids"?: string;
    "filter[handle]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("followees" | "followers" | "listening-to" | "pending-followers" | "shareable-playlists" | "shared-playlists" | "social-profile")[];
    "extend"?: readonly ("followState" | "hideListeningTo" | "pendingFollowersCount")[];
    "with"?: readonly "nonOnboarded"[];
  };
  "PATCH /v1/me/social/profile": {
    "with"?: readonly "nonSubscribers"[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    body: unknown;
  };
  "POST /v1/me/social/profile/followees": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/social/profile/followees": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "POST /v1/me/social/profile/followers": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/social/profile/followers": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/social/profile/pending-followees": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "POST /v1/me/social/profile/blocked-profiles": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/social/profile/blocked-profiles": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/me/social/profile/pending-followers": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("followState" | "hideListeningTo" | "pendingFollowersCount")[];
  };
  "POST /v1/me/social/profile/pending-followers": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "DELETE /v1/me/social/profile/pending-followers": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "PUT /v1/me/social/profile/shared-playlists": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    body: unknown;
  };
  "GET /v1/me/social/suggested-handles": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/social/{storefront}/social-profiles": {
    "storefront"?: string;
    "ids"?: string;
    "filter[handle]"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "include"?: readonly ("followees" | "followers" | "listening-to" | "pending-followers" | "shareable-playlists" | "shared-playlists" | "social-profile")[];
    "extend"?: readonly "followState"[];
    "art[url]"?: readonly ("c" | "f")[];
  };
  "GET /v1/social/{storefront}/search": {
    "storefront"?: string;
    "term": string;
    "limit"?: number;
    "art[social-profiles:url]"?: readonly ("c" | "f")[];
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "with"?: readonly ("lyrics" | "serverBubbles")[];
    "art[url]"?: readonly ("c" | "f")[];
  };
  "GET /v1/social/badging-map": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "omit[resource]"?: readonly "autos"[];
  };
  "GET /v1/social/{storefront}/onboarding-upsell": {
    "storefront"?: string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/social/recommended-friends": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "DELETE /v1/social/recommended-friends": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    body: unknown;
  };
  "GET /v1/play/assets": {
    "id": string;
    "kind": string;
    "keyFormat"?: "web";
    "includeLicenseUrls"?: boolean;
    "hlsEncryption"?: "CBC" | "CTR";
    "hlsProfile"?: "enhancedHls";
  };
  "POST /v1/me/stations/next-tracks/{id}": {
    "id": string;
    "limit"?: number;
  };
  "POST /v1/me/stations/continuous": {
    "limit[results:tracks]"?: number;
    "with"?: readonly "tracks"[];
    body: unknown;
  };
  "POST /v1/me/recommendations/pivots": {
    body?: unknown;
  };
  "POST /WebObjects/MZPlay.woa/wa/webPlayback": {
    body: unknown;
  };
  "POST /WebObjects/MZPlay.woa/wa/acquireWebPlaybackLicense": {
    body: unknown;
  };
  "POST /WebObjects/MZPlay.woa/wa/fpsRequest": {
    body: unknown;
  };
  "POST /v1/hls/streaming-key-delivery": {
    body: unknown;
  };
  "GET /WebObjects/MZPlay.woa/wa/widevineCert": {

  };
  "POST /WebObjects/MZPlay.woa/wa/revokeMusicSDKAuthorizationSrv": {
    body: unknown;
  };
  "POST /commerce/account/authenticateMusicKitRequest": {
    body: unknown;
  };
  "GET /account/web/info": {

  };
  "GET /account/web/infoRefresh": {

  };
  "POST /account/web/logout": {

  };
  "GET /commerce/web/subscription/offers/music": {

  };
  "POST /account/v1/affiliation/association": {
    body: unknown;
  };
  "POST /WebObjects/MZPlay.woa/wa/renewMusicToken": {

  };
  "GET /v1/web/status": {

  };
  "GET /v1/regions": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/regions/{id}": {
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/me/social-profile": {
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "extend"?: readonly ("followState" | "hideListeningTo" | "pendingFollowersCount")[];
  };
  "GET /v1/catalog/{storefront}/songs/{id}/lyrics": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
  };
  "GET /v1/catalog/{storefront}/songs/{id}/syllable-lyrics": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "l[lyrics]"?: string;
    "l[script]"?: string;
    "extend"?: "ttmlLocalizations";
  };
  "GET /v1/catalog/{storefront}/songs/{id}/credits": {
    "storefront"?: string;
    "id": string;
    "l"?: string;
    "platform"?: "web" | "iphone" | "ipad" | "desktop" | "appletv" | "watch";
    "format[resources]"?: "map";
    "art[url]"?: readonly ("c" | "f")[];
    "extend"?: readonly ("artistUrl" | "credits" | "extendedAssetUrls" | "lyricsExcerpt" | "offers")[];
    "include"?: readonly ("albums" | "artists" | "credits" | "lyrics" | "music-videos")[];
  };
}

export const operationHosts: Partial<Record<keyof Operations, string>> = {
  "POST /v1/engagement/{storefront}/upsell": "https://amp-api-edge.media.apple.com",
  "POST /WebObjects/MZPlay.woa/wa/webPlayback": "https://play.itunes.apple.com",
  "POST /WebObjects/MZPlay.woa/wa/acquireWebPlaybackLicense": "https://play.itunes.apple.com",
  "POST /WebObjects/MZPlay.woa/wa/fpsRequest": "https://play.itunes.apple.com",
  "POST /v1/hls/streaming-key-delivery": "https://play.itunes.apple.com",
  "GET /WebObjects/MZPlay.woa/wa/widevineCert": "https://play.itunes.apple.com",
  "POST /WebObjects/MZPlay.woa/wa/revokeMusicSDKAuthorizationSrv": "https://play.itunes.apple.com",
  "POST /commerce/account/authenticateMusicKitRequest": "https://buy.music.apple.com",
  "GET /account/web/info": "https://buy.music.apple.com",
  "GET /account/web/infoRefresh": "https://buy.music.apple.com",
  "POST /account/web/logout": "https://buy.music.apple.com",
  "GET /commerce/web/subscription/offers/music": "https://buy.music.apple.com",
  "POST /account/v1/affiliation/association": "https://buy.music.apple.com",
  "POST /WebObjects/MZPlay.woa/wa/renewMusicToken": "https://play.music.apple.com",
  "GET /v1/web/status": "https://musicstatus.music.apple.com",
};
