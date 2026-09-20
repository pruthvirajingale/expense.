const CACHE = "expense-pwa-v4";
const BASE = self.registration.scope;
const INDEX = new URL("index.html", BASE).href;
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const NAV_TIMEOUT_MS = 3000;

// App shell: everything needed to launch the app with no network.
const ASSETS = [
  INDEX,
  new URL("manifest.json", BASE).href,
  new URL("icon-192.png", BASE).href,
  new URL("icon-512.png", BASE).href,
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

// Pages: try the network first so updates show up right away, but fall back
// to the cached app shell when offline or when the network is too slow.
async function handleNavigation() {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([
      fetch(INDEX, { cache: "no-cache" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), NAV_TIMEOUT_MS),
      ),
    ]);
    if (response.ok) cache.put(INDEX, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(INDEX);
    return cached || Response.error();
  }
}

// Everything else: serve from cache instantly and refresh it in the background.
async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then((response) => {
      // Opaque responses come from cross-origin <link> requests (Google Fonts CSS).
      if (response.ok || response.type === "opaque") {
        cache.put(event.request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation());
    return;
  }

  if (url.origin === self.location.origin || FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event));
  }
});
