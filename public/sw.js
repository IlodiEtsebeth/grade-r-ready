// Minimal service worker — just enough to make the app installable.
// Intentionally does not cache anything yet, so it never serves stale data.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pass-through: always use the network.
});
