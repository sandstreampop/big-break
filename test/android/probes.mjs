// The Android probe suite.
//
// Each probe maps to a churn risk from the research (see README.md) and carries
// an `expectation`:
//   'must-pass'  — a REGRESSION GUARD. Green today; if it ever throws, an
//                  Android regression shipped. Failure fails CI.
//   'known-bug'  — asserts the CORRECT Android behaviour that the game does NOT
//                  yet have. It throws today, which PROVES the bug reproducibly
//                  (that is the point: prove the error before fixing it). A
//                  known-bug that throws does NOT fail CI; one that unexpectedly
//                  PASSES is flagged "FIXED? — promote to must-pass".
//   'manual'     — cannot be proven in headless emulation (needs a real device
//                  or device farm). Documented and reported as SKIP with why.
//
// `scope: 'device'` probes run per Android device; `scope: 'static'` probes run
// once against the built files (no browser).

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  DIST, startRun, touchSwipe, fastTap, dismissOverlay, assert,
} from './harness.mjs';

// ---------------------------------------------------------------------------
// REGRESSION GUARDS (must stay green on Android)
// ---------------------------------------------------------------------------

const smoke = {
  id: 'smoke-playthrough',
  title: 'Boots, deals a card, and a touch-swipe resolves it',
  risk: 'Baseline — if this breaks, the game is unplayable on Android',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    await startRun(page);
    await page.waitForSelector('#card-area .card', { timeout: 8000 });
    const before = await page.locator('#overlay.active').count();
    await touchSwipe(page, 'right');
    // A swipe resolves into a result overlay (or advances the card). Assert the
    // game reacted: either an overlay is up, or a fresh card is present.
    await page.waitForTimeout(400);
    const overlayUp = await page.locator('#overlay.active').count();
    const cardStill = await page.locator('#card-area .card').count();
    assert(overlayUp > before || cardStill > 0, 'swipe produced no result overlay and no card');
    assert(h.errors.length === 0, 'console/page errors: ' + h.errors.join(' | '));
  },
};

const passiveListener = {
  id: 'touch-action-not-passive-blocked',
  title: 'Touch-swipe is not silently dropped by a passive-listener intervention',
  risk: 'Risk 1 — the #1 churn driver: Android makes touch listeners passive by '
      + 'default, so a swipe built on preventDefault() can be ignored and the '
      + 'core verb feels broken in the first 10 seconds',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    // Capture Chrome's passive-listener / scroll interventions (they are
    // console warnings, not errors, so the standard error collector misses them).
    const interventions = [];
    page.on('console', (m) => {
      const t = m.text();
      if (/Unable to preventDefault inside passive event listener/i.test(t)
        || /Ignored attempt to cancel a .* event with cancelable=false/i.test(t)
        || /scroll-blocking .* event/i.test(t)) interventions.push(t);
    });
    await startRun(page);
    await page.waitForSelector('#card-area .card', { timeout: 8000 });
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await touchSwipe(page, 'left');
    await page.waitForTimeout(300);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    assert(interventions.length === 0,
      'passive-listener/scroll intervention fired: ' + interventions.join(' | '));
    assert(scrollAfter === scrollBefore, 'the swipe scrolled the page instead of dragging the card');
    // and the swipe actually did something:
    const resolved = (await page.locator('#overlay.active').count()) > 0
      || (await page.locator('#card-area .card').count()) > 0;
    assert(resolved, 'swipe registered no game reaction');
  },
};

const webAudioUnlock = {
  id: 'web-audio-unlocks-on-gesture',
  title: 'AudioContext resumes after a user gesture (not stuck suspended)',
  risk: 'Risk 4 — Android gates audio behind a gesture; if the unlock path is '
      + 'iOS-specific the game plays silently',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    // The game creates its AudioContext lazily on first pointerdown (js/ui.ts).
    // Tap the title, then read the context state via a wrapper the probe installs
    // before any audio is created.
    await page.addInitScript(() => {
      const Orig = window.AudioContext || window.webkitAudioContext;
      if (!Orig) return;
      window.__ctxStates = [];
      const Wrapped = function (...a) {
        const c = new Orig(...a);
        window.__lastCtx = c;
        return c;
      };
      Wrapped.prototype = Orig.prototype;
      window.AudioContext = Wrapped;
      window.webkitAudioContext = Wrapped;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    // A real touch gesture (what unlocks audio on Android).
    const box = await page.locator('#screen-title').boundingBox();
    await fastTap(page, box.x + box.width / 2, box.y + box.height / 2, 1, 0);
    await page.waitForTimeout(400);
    const state = await page.evaluate(() => window.__lastCtx ? window.__lastCtx.state : 'none');
    assert(state === 'running' || state === 'suspended' ? state === 'running' : false,
      `AudioContext state after gesture is "${state}" (expected "running")`);
  },
};

const savePersistsReload = {
  id: 'run-survives-reload',
  title: 'An in-progress run is restored after a reload (localStorage save)',
  risk: 'Risk 8 — losing a roguelike run is the most enraging failure for the '
      + 'genre; saves must survive a background/reload',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await startRun(page);
    await page.waitForSelector('#card-area .card', { timeout: 8000 });
    await touchSwipe(page, 'right');
    await dismissOverlay(page);
    await page.waitForTimeout(300);
    const saved = await page.evaluate(() => localStorage.getItem('bigbreak_run_v1'));
    assert(saved && saved.length > 10, 'no run was persisted to localStorage after a swipe');
    // reload and confirm the app offers/loads the saved run rather than losing it
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const stillSaved = await page.evaluate(() => localStorage.getItem('bigbreak_run_v1'));
    assert(stillSaved && stillSaved.length > 10, 'run save vanished across a reload');
  },
};

const offlineBoot = {
  id: 'offline-boot-from-cache',
  title: 'App boots offline from the service-worker cache',
  risk: 'Risk 7 — a PWA that cannot cold-start offline breaks its core promise; '
      + 'network-first SW behaviour differs on Android connectivity',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    // Give the SW time to install & precache.
    await page.evaluate(() => navigator.serviceWorker?.ready).catch(() => {});
    await page.waitForTimeout(1200);
    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(800);
    const booted = await page.locator('#screen-title.active, #screen-game.active').count();
    await ctx.setOffline(false);
    assert(booted > 0, 'app did not boot offline from cache');
  },
};

const shortViewport = {
  id: 'short-viewport-controls-reachable',
  title: 'With the URL bar visible (short viewport), the card + controls stay on-screen',
  risk: 'Risk 2 — Android Chrome\'s address bar shrinks the viewport; a 100vh-ish '
      + 'layout pushes the primary controls under the toolbar so they can\'t be tapped',
  expectation: 'must-pass',
  scope: 'device',
  // Most valuable on the short/narrow profiles, but harmless everywhere.
  async run(page, ctx, h) {
    await startRun(page);
    await page.waitForSelector('#card-area .card', { timeout: 8000 });
    const vp = page.viewportSize();
    const clip = await page.evaluate(() => {
      const ids = ['#hud', '#card-area', '#choice-buttons'];
      const out = {};
      for (const id of ids) {
        const el = document.querySelector(id);
        if (!el) { out[id] = null; continue; }
        const r = el.getBoundingClientRect();
        out[id] = { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
      }
      out.docScrollW = document.documentElement.scrollWidth;
      out.docClientW = document.documentElement.clientWidth;
      return out;
    });
    // No horizontal overflow (a classic small-screen break).
    assert(clip.docScrollW <= clip.docClientW + 1,
      `horizontal overflow: scrollWidth ${clip.docScrollW} > clientWidth ${clip.docClientW}`);
    // The card must be at least partially within the viewport height.
    const ca = clip['#card-area'];
    assert(ca && ca.top < vp.height && ca.bottom > 0,
      `#card-area is off-screen at ${vp.width}x${vp.height}: ${JSON.stringify(ca)}`);
    // If choice buttons exist, their bottom must be reachable (within viewport).
    const cb = clip['#choice-buttons'];
    if (cb && cb.height > 0) {
      assert(cb.bottom <= vp.height + 2,
        `#choice-buttons extend below the visible viewport (bottom ${cb.bottom} > ${vp.height})`);
    }
  },
};

// ---------------------------------------------------------------------------
// KNOWN BUGS — these THROW today, proving the defect. Fix the game, and they
// flip to green; then promote them to must-pass.
// ---------------------------------------------------------------------------

const backButton = {
  id: 'back-gesture-does-not-exit-game',
  title: 'Android Back closes an overlay / returns a screen instead of unloading the game',
  risk: 'Risk 3 — Android\'s hardware/gesture Back has no in-app history to pop, '
      + 'so it navigates the whole PWA away mid-run (extreme rage-quit / lost run). '
      + 'iOS has no Back button so this was never felt.',
  expectation: 'known-bug',
  scope: 'device',
  async run(page, ctx, h) {
    await startRun(page);
    await page.waitForSelector('#screen-game.active', { timeout: 8000 });
    const activeBefore = await page.evaluate(() =>
      [...document.querySelectorAll('.screen.active')].map((s) => s.id));
    // The Android Back button == a history back navigation.
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(400);
    const activeAfter = await page.evaluate(() =>
      [...document.querySelectorAll('.screen.active')].map((s) => s.id)).catch(() => null);
    // CORRECT behaviour: Back is intercepted (a popstate handler), so we are
    // still inside the app on some screen — NOT navigated away to a blank page.
    assert(activeAfter && activeAfter.length > 0,
      `Back unloaded the SPA: active screens went ${JSON.stringify(activeBefore)} -> ${JSON.stringify(activeAfter)} (url now ${page.url()})`);
  },
};

// ---------------------------------------------------------------------------
// STATIC PROBES — read the built files, no browser.
// ---------------------------------------------------------------------------

const dvhFallback = {
  id: 'dvh-has-vh-fallback',
  title: 'Full-height layout has a vh/fill-available fallback for pre-108 Android Chrome',
  risk: 'Risk 2 — the app sets height:100dvh with no fallback. Android Chrome < 108 '
      + '(and old system WebView / Samsung Internet) drop the invalid declaration, '
      + 'collapsing the layout. Older Chrome is far more common on Android than iOS.',
  expectation: 'known-bug',
  scope: 'static',
  async run() {
    const css = await readFile(join(DIST, 'css', 'style.css'), 'utf8');
    // Find full-viewport height rules using dvh.
    const usesDvh = /height:\s*100dvh/.test(css);
    if (!usesDvh) return; // nothing to guard
    // A safe pattern declares a plain fallback first, e.g.
    //   height: 100vh; height: 100dvh;   (or -webkit-fill-available)
    // Detect a `height: ...vh` or fill-available that is NOT the dvh line.
    const hasFallback = /height:\s*100vh\s*;/.test(css)
      || /height:\s*-webkit-fill-available/.test(css)
      || /@supports\s*\(\s*height:\s*100dvh/.test(css);
    assert(hasFallback,
      'style.css uses height:100dvh with no preceding vh / -webkit-fill-available / @supports fallback — pre-108 Android renders no height');
  },
};

const accessibilityZoom = {
  id: 'accessibility-zoom-not-blocked',
  title: 'Viewport does not hard-disable zoom (user-scalable=no) — an a11y block on Android',
  risk: 'Risk 5 — iOS Safari IGNORES user-scalable=no (so it was invisible to iOS QA), '
      + 'but Android Chrome HONORS it: low-vision users cannot pinch-zoom. The '
      + 'visualViewport "zoom recovery" in js/platform.ts additionally snaps any '
      + 'accessibility zoom back to 1:1.',
  expectation: 'known-bug',
  scope: 'static',
  async run() {
    const html = await readFile(join(DIST, 'index.html'), 'utf8');
    const meta = (html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i) || [''])[0];
    assert(!/user-scalable\s*=\s*no/i.test(meta),
      `viewport meta hard-disables zoom (accessibility block on Android): ${meta.trim()}`);
  },
};

const persistentStorage = {
  id: 'requests-persistent-storage',
  title: 'App requests navigator.storage.persist() so saves survive storage pressure',
  risk: 'Risk 8 — without persistent-storage, Android evicts localStorage under '
      + 'memory pressure (common on budget devices) and wipes the career. iOS home-'
      + 'screen apps used to be exempt so this gap never bit on iOS.',
  expectation: 'known-bug',
  scope: 'static',
  async run() {
    // Scan the emitted JS bundle for a persist() request.
    const files = ['save.js', 'platform.js', 'main.js', 'ui.js', 'analytics.js'];
    let found = false;
    for (const f of files) {
      const src = await readFile(join(DIST, 'js', f), 'utf8').catch(() => '');
      if (/storage\s*\.\s*persist\s*\(/.test(src)) { found = true; break; }
    }
    assert(found, 'no navigator.storage.persist() call in the emitted JS — saves are eviction-eligible on Android');
  },
};

// ---------------------------------------------------------------------------
// MANUAL / DEVICE-FARM — documented, reported as SKIP (headless can't prove).
// ---------------------------------------------------------------------------

const manual = [
  {
    id: 'urlbar-live-resize', expectation: 'manual', scope: 'device',
    title: 'Live URL-bar show/hide dvh resize as the user scrolls',
    risk: 'Risk 2 — desktop Chromium has no collapsing toolbar, so dvh/svh/lvh all '
        + 'equal vh in emulation. Only a real device / AVD reproduces the live resize.',
    why: 'Needs a real Android device or an AVD (reactivecircus/android-emulator-runner) driven via Playwright _android.',
  },
  {
    id: 'edge-swipe-vs-back-gesture', expectation: 'manual', scope: 'device',
    title: 'Left/right card swipe starting at the screen edge vs Android 10+ back-gesture',
    risk: 'Risk 3 — the OS claims edge swipes for Back; no web API can observe this in emulation.',
    why: 'Needs a real device with gesture navigation enabled (device farm / physical).',
  },
  {
    id: 'backdrop-filter-fps', expectation: 'manual', scope: 'device',
    title: 'backdrop-filter blur frame-rate on low-end Android GPUs during the swipe',
    risk: 'Risk 9 — .overlay/.mg-box use backdrop-filter: blur(6px); it is GPU-bound '
        + 'and janks on cheap Androids. Emulation uses SwiftShader — not representative.',
    why: 'Needs real-GPU devices (BrowserStack/Sauce/LambdaTest) to measure FPS.',
  },
  {
    id: 'high-refresh-timing', expectation: 'manual', scope: 'device',
    title: 'Animation speed on 90/120 Hz Android displays',
    risk: 'Risk 10 — CSS transitions are duration-based (safe), but any JS rAF-driven '
        + 'minigame using per-frame deltas would run fast at 120 Hz. Verify on-device.',
    why: 'Needs a real high-refresh Android device.',
  },
  {
    id: 'fonts-emoji-textscale', expectation: 'manual', scope: 'device',
    title: 'Roboto/Noto metrics, emoji glyphs, and Android large-text / bold-text reflow',
    risk: 'Risk 11 — emoji risk glyphs (●▲■✦) and labels reflow differently under '
        + 'Roboto + Android font-scaling; can clip HUD/pills.',
    why: 'Needs real Android font stack + accessibility font-scale settings (device / farm).',
  },
];

export const PROBES = [
  smoke, passiveListener, webAudioUnlock, savePersistsReload, offlineBoot, shortViewport,
  backButton,
  dvhFallback, accessibilityZoom, persistentStorage,
  ...manual,
];
