// const CACHE_NAME = "do-image-cache-v5";

// console.log("🟢 Service Worker loaded");

// self.addEventListener("install", () => {
//   console.log("🟡 SW installing...");
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   console.log("🟢 SW activating...");

//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys.map((key) => {
//           if (key !== CACHE_NAME) {
//             console.log("❌ Deleting old cache:", key);
//             return caches.delete(key);
//           }
//         })
//       )
//     )
//   );

//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   const req = event.request;

//   // ❌ Never cache HTML / JS / API
//   if (req.method !== "GET" || req.destination !== "image") return;

//   const url = new URL(req.url);

//   // ✅ DigitalOcean Spaces + same-origin images
//   if (
//     url.hostname.includes("digitaloceanspaces.com") ||
//     url.origin === self.location.origin
//   ) {
//     console.log("📸 Image request:", req.url);
//     event.respondWith(imageHandler(req));
//   }
// });

// async function imageHandler(request) {
//   const cache = await caches.open(CACHE_NAME);
//   const cached = await cache.match(request);

//   try {
//     console.log("🌐 Fetching fresh:", request.url);

//     const fresh = await fetch(request, { cache: "no-store" });

//     if (fresh && fresh.status === 200) {
//       console.log("💾 Updating cache:", request.url);
//       cache.put(request, fresh.clone());
//     }

//     // Fast UX: show cached first if available
//     return cached || fresh;
//   } catch (error) {
//     console.warn("⚠ Network failed, using cache:", request.url);
//     return cached || Response.error();
//   }
// }