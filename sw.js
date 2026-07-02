// BIG BREAK service worker: network-first (updates always win when online),
// cache fallback (full game works offline once visited).

const CACHE = 'bigbreak-v14';
const CORE = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/main.js', 'js/ui.js', 'js/engine.js', 'js/save.js', 'js/audio.js',
  'js/art.js', 'js/charts.js', 'js/headlines.js', 'js/config.js', 'js/analytics.js', 'js/minigames.js',
  'js/data/events.js', 'js/data/tutorial.js', 'js/data/instruments.js', 'js/data/accessories.js',
  'js/data/meta.js', 'js/data/rivals.js', 'js/data/contracts.js',
  'js/data/hustles.js', 'js/data/assets.js', 'js/data/genres.js',
  'js/data/venues.js', 'js/data/band.js', 'js/dms.js', 'js/epilogue.js', 'js/sharecard.js', 'js/discography.js',
  'assets/icon-180.png', 'assets/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })
        .then((hit) => hit || caches.match('./')))
  );
});
