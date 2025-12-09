const CACHE_NAME = "banner-cache-v1";
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // 1 month

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName === CACHE_NAME) {
            return caches.open(cacheName).then((cache) => {
              return cache.keys().then((requests) => {
                return Promise.all(
                  requests.map((request) => {
                    return cache.match(request).then((response) => {
                      if (!response) return;

                      const dateHeader = response.headers.get("date");
                      const lastFetched = dateHeader ? new Date(dateHeader).getTime() : 0;

                      if (Date.now() - lastFetched > ONE_MONTH_IN_MS) {
                        return cache.delete(request);
                      }
                    });
                  })
                );
              });
            });
          }
        })
      );
    })
  );
});

// Handle fetch events
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Cache requests from the same origin and Cloudinary
  if (url.origin === self.origin || url.host === "res.cloudinary.com") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          // Cache the response if it's an image
          if (event.request.destination === "image") {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        });
      })
    );
  } else {
    // For external requests not from Cloudinary, fetch directly
    event.respondWith(fetch(event.request));
  }
});
