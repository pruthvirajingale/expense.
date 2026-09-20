const CACHE = "expense-pwa-v1";
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  new URL("index.html", BASE).href,
  new URL("manifest.json", BASE).href,
  new URL("icons/icon-192.png", BASE).href,
  new URL("icons/icon-512.png", BASE).href,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE && key.startsWith("expense-"))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(
      (cachedResponse) =>
        cachedResponse ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(new URL("index.html", BASE).href)),
    ),
  );
});
