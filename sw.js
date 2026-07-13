// BIG BREAK service worker: network-first (updates always win when online),
// cache fallback (every game works offline once visited).
//
// Registered with scope '/' by all three game entries (js/main.ts,
// js/main-love-island.ts, js/main-odyssey.ts), so whichever page a player
// lands on first installs the one shared shell.
//
// Hard-learned rules (INCIDENTS #4 — offline was silently dead for months):
//  · CORE lists only files that EXIST; test/sw-core.test.mjs fails the build
//    if an entry rots. The old list kept the pre-refactor js/data/* layout —
//    addAll rejected, install failed, and no game had offline at all while
//    the README promised it.
//  · Install must be RESILIENT anyway: entries cache individually, so one
//    bad path degrades precaching instead of bricking the whole worker.
//  · The deep JS module graph is NOT precached — the dynamic fetch handler
//    caches every module the page actually loads, which is both complete
//    and layout-proof. CORE is just the boot shell per game.
//  · The navigation fallback is per-game: an offline /odyssey/ reload gets
//    odyssey's shell, never the music page.

// v30: js/version.js grew named exports (APP_VERSION/BUILD_SHA/BUILD_DATE)
// that boot-critical modules now import. ES modules cache individually here,
// so a stale cached version.js next to fresh importers would throw a
// missing-export error and blank the boot — bump the cache so activation
// evicts every pre-0.2.0 module. RULE (the INCIDENTS #6 class, JS flavor):
// bump this name on any deploy that changes a shared module's EXPORT SHAPE.
const CACHE = 'bigbreak-v30';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'css/style.css', 'css/love-island.css', 'css/odyssey.css',
  'love-island/index.html', 'odyssey/index.html',
  'assets/icon-180.png', 'assets/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // Individually, tolerating failures: a missing file must degrade the
      // precache, never abort the install (that failure mode ships silent).
      .then((c) => Promise.allSettled(CORE.map((p) => c.add(p))))
      .then(() => self.skipWaiting())
  );
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
        // Only cache good responses — a 404/500 must never become the
        // offline copy of an asset.
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })
        // The app-shell fallback is for NAVIGATIONS only (answering a failed
        // CSS/JS fetch with cached HTML poisons the page) — and it is
        // per-game: fall back to the shell of the game being navigated to.
        .then((hit) => {
          if (hit) return hit;
          if (e.request.mode !== 'navigate') return Response.error();
          const shell = url.pathname.includes('/love-island') ? 'love-island/index.html'
            : url.pathname.includes('/odyssey') ? 'odyssey/index.html' : './';
          return caches.match(shell, { ignoreSearch: true });
        }))
  );
});
