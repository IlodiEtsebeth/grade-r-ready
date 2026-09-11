// This file exists only to clean up the old service worker that some devices
// already have installed. It immediately unregisters itself and clears any
// caches, then every open tab gets reloaded once so the page continues
// without a service worker from then on.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.navigate(client.url);
      }
    })(),
  );
});
