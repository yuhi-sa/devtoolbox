var CACHE_NAME = "devtoolbox-v5";

var CORE_ASSETS = [
  "/devtoolbox/",
  "/devtoolbox/index.html",
  "/devtoolbox/css/style.css",
  "/devtoolbox/css/enhancements.css",
  "/devtoolbox/js/common.js",
  "/devtoolbox/js/favorites.js",
  "/devtoolbox/js/recent-tools.js",
  "/devtoolbox/js/homepage.js",
  "/devtoolbox/js/command-palette.js",
  "/devtoolbox/js/ads.js",
  "/devtoolbox/js/related-tools.js",
  "/devtoolbox/js/popular-tools.js",
  "/devtoolbox/js/usage-counter.js",
  "/devtoolbox/js/i18n.js",
  "/devtoolbox/js/lang-switcher.js",
  "/devtoolbox/en/",
  "/devtoolbox/en/index.html"
];

// Install: cache core assets
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, stale-while-revalidate for tool pages
self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Static assets: cache-first
  var isStaticAsset = /\.(css|js|svg|png|jpg|jpeg|woff2?)$/.test(url.pathname) ||
                      url.pathname === "/devtoolbox/" ||
                      url.pathname === "/devtoolbox/index.html" ||
                      url.pathname.indexOf("/devtoolbox/en/") === 0;

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        if (cached) return cached;
        return fetch(event.request).then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Tool pages: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        var fetchPromise = fetch(event.request).then(function(response) {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
        return cached || fetchPromise;
      });
    })
  );
});
