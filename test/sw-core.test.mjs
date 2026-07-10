// The service worker's precache list stays true (INCIDENTS #4).
//
// The offline story died silently for months because sw.js CORE kept the
// pre-refactor file layout: cache.addAll rejects on ANY 404, install fails,
// and the worker never activates — no offline for any game, no error
// surfaced anywhere, while the README promised a PWA. Two guards:
//   1. Every CORE path exists in dist/ (the list can't rot).
//   2. The install handler is the resilient per-entry form, not bare
//      addAll(CORE) (a future missing file degrades precache instead of
//      bricking the whole worker).
//
// Run: npm run build && node --test test/sw-core.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const src = readFileSync(join(ROOT, 'sw.js'), 'utf8');

const coreMatch = src.match(/const CORE = \[([\s\S]*?)\];/);
assert.ok(coreMatch, 'sw.js declares a CORE precache list');
const CORE = [...coreMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

test('every sw.js CORE path exists in dist/', () => {
  assert.ok(CORE.length >= 5, `CORE parsed (${CORE.length} entries)`);
  const missing = CORE
    .map((p) => (p === './' ? 'index.html' : p))
    .filter((p) => !existsSync(join(ROOT, 'dist', p)));
  assert.deepEqual(missing, [],
    `sw.js precaches files that do not exist — addAll would reject and the worker would never install: ${missing.join(', ')}`);
});

test('the install handler tolerates per-entry failures (no bare addAll)', () => {
  assert.ok(!/\.addAll\(\s*CORE\s*\)/.test(src),
    'install uses bare cache.addAll(CORE) — one missing file silently kills offline for every game; cache entries individually (Promise.allSettled)');
  assert.match(src, /allSettled/, 'install caches CORE entries individually');
});

test('every game entry registers the shared root service worker', () => {
  for (const [entry, expected] of [
    ['js/main.ts', /registerServiceWorker\('\.\/sw\.js'\)/],
    ['js/main-love-island.ts', /registerServiceWorker\('\.\.\/sw\.js'\)/],
    ['js/main-odyssey.ts', /registerServiceWorker\('\.\.\/sw\.js'\)/],
  ]) {
    const s = readFileSync(join(ROOT, entry), 'utf8');
    assert.match(s, expected, `${entry} must register the root service worker (offline is a three-game promise)`);
  }
});
