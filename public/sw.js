const CACHE_PURGE_VERSION = "grs-cache-purge-20260614";

async function purgeCaches() {
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(purgeCaches());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await purgeCaches();
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await self.registration.unregister();
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// Keep a stable token in the file so browser update checks fetch a new script.
self.__GRS_CACHE_PURGE_VERSION__ = CACHE_PURGE_VERSION;
