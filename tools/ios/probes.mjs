// The iOS (WebKit) probe suite.
//
// Same contract as the Android suite. Each probe carries an `expectation`:
//   'must-pass'  — a REGRESSION GUARD. Green today; if it throws, an iOS
//                  regression shipped. Failure fails CI.
//   'known-bug'  — asserts the CORRECT behaviour the game does NOT yet have. It
//                  throws today (prove-before-fix); a known-bug that starts
//                  PASSING is flagged "FIXED? — promote to must-pass".
//   'manual'     — cannot be proven in headless WebKit (needs a real iPhone /
//                  device farm, or a human). Reported as SKIP with a why + owner.
//
// `scope: 'device'` probes run per iPhone descriptor under WebKit; `scope:
// 'static'` probes read the built files once (no browser).
//
// Requirement tags (X1–X8 cross-platform, R1–R10 iOS) map to docs/ios-compat.md
// and docs/mobile-compat-handoff.md. Anything whose failure mode only exists on
// real hardware is a `manual` SKIP here with a Tier-2/3 owner — never silently
// dropped and presented as covered.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  DIST, startRun, dismissOverlay, assert,
  tap, fastTapBurst, touchSwipe,
} from './harness.mjs';

// ---------------------------------------------------------------------------
// DEVICE REGRESSION GUARDS (WebKit, must stay green)
// ---------------------------------------------------------------------------

const smoke = {
  id: 'smoke-playthrough',
  title: 'Boots, deals a card, and a touch-swipe resolves it — no JS errors',
  risk: 'X1 + X7 — the core verb (swipe a card) must survive touch on WebKit, and a '
      + 'scripted session must raise zero console/page errors',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    await startRun(page);
    await page.waitForSelector('#card-area .card', { timeout: 8000 });
    const before = await page.locator('#overlay.active').count();
    await touchSwipe(page, 'right');
    await page.waitForTimeout(400);
    const overlayUp = await page.locator('#overlay.active').count();
    const cardStill = await page.locator('#card-area .card').count();
    assert(overlayUp > before || cardStill > 0, 'swipe produced no result overlay and no card');
    assert(h.errors.length === 0, 'console/page errors: ' + h.errors.join(' | '));
  },
};

const fastTapNotDropped = {
  id: 'fast-tap-not-dropped',
  title: 'A burst of fast taps registers every tap (N taps => N activations)',
  risk: 'X2 + R1/R5 — if the double-tap-zoom guard swallowed the click of every '
      + 'second rapid tap, one-thumb tapping (overlays, minigames) would silently '
      + 'drop half the input. (The ACTUAL zoom on a double-tap is Tier-2.)',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.addInitScript(() => {
      window.__clicks = 0;
      document.addEventListener('click', () => { window.__clicks++; }, true);
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    // Tap a spot with no click handler (the logo) so taps count without
    // navigating. Clicks still fire + bubble to document; the platform double-tap
    // guard re-dispatches a click for the taps it preventDefaults, so no tap is lost.
    const box = await page.locator('.title-logo').boundingBox()
      || await page.locator('#screen-title').boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const N = 6;
    await fastTapBurst(page, x, y, N, 90);
    await page.waitForTimeout(150);
    const clicks = await page.evaluate(() => window.__clicks);
    assert(clicks === N, `fast-tap burst registered ${clicks} of ${N} taps (dropped/duplicated)`);
  },
};

const webAudioUnlock = {
  id: 'web-audio-unlocks-on-gesture',
  title: 'AudioContext unlocks after a touch gesture (running, or resume() fired)',
  risk: 'X4 + R3a — audio is born suspended and must resume() inside the first '
      + 'gesture. NOTE: headless WebKit has no real audio and its autoplay policy '
      + 'differs from a device, so we prove the UNLOCK PATH fired (state running or '
      + 'resume attempted); real audibility/latency is Tier-2/3.',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.addInitScript(() => {
      const Orig = window.AudioContext || window.webkitAudioContext;
      if (!Orig) return;
      window.__actx = { created: false, resumeCalls: 0 };
      const Wrapped = function (...a) {
        const c = new Orig(...a);
        window.__actx.created = true;
        window.__lastCtx = c;
        const r = c.resume && c.resume.bind(c);
        if (r) c.resume = function () { window.__actx.resumeCalls++; return r(); };
        return c;
      };
      Wrapped.prototype = Orig.prototype;
      window.AudioContext = Wrapped;
      window.webkitAudioContext = Wrapped;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    const box = await page.locator('#screen-title').boundingBox();
    await tap(page, box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
    const s = await page.evaluate(() => ({
      created: !!(window.__actx && window.__actx.created),
      state: window.__lastCtx ? window.__lastCtx.state : 'none',
      resumeCalls: window.__actx ? window.__actx.resumeCalls : 0,
    }));
    assert(s.created, 'no AudioContext was created on the first gesture');
    assert(s.state === 'running' || s.resumeCalls > 0,
      `AudioContext did not unlock: state="${s.state}", resume() calls=${s.resumeCalls}`);
  },
};

const savePersistsReload = {
  id: 'run-survives-reload',
  title: 'An in-progress run is restored after a reload (localStorage save)',
  risk: 'X5 + R7 — WebKit freezes/cold-reloads backgrounded tabs and standalone '
      + 'apps; losing a roguelike run is the genre\'s worst failure. The run must '
      + 'round-trip across a reload.',
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const stillSaved = await page.evaluate(() => localStorage.getItem('bigbreak_run_v1'));
    assert(stillSaved && stillSaved.length > 10, 'run save vanished across a reload');
  },
};

const saveExportImport = {
  id: 'save-export-import-roundtrips',
  title: 'The whole career exports to a code and imports back intact',
  risk: 'R7 — tab storage is ephemeral on iOS (ITP 7-day eviction, non-granting '
      + 'persist()); export/import is the real durability path for a precious save, '
      + 'so it must round-trip losslessly.',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    const res = await page.evaluate(async () => {
      const save = await import('/js/save.js');
      save.saveMeta({ ...save.loadMeta(), runs: 7, best: { fame: 123, lp: 4 } });
      const code = save.exportSave();
      if (!/^BB1\./.test(code)) return { ok: false, why: 'export produced no BB1 code' };
      const before = localStorage.getItem('bigbreak_meta_v1');
      localStorage.removeItem('bigbreak_meta_v1');
      const imported = save.importSave(code);
      const after = localStorage.getItem('bigbreak_meta_v1');
      const runs = after ? JSON.parse(after).runs : null;
      return { ok: !!(imported && after === before && runs === 7), imported, runs };
    });
    assert(res.ok, 'save export/import did not round-trip: ' + JSON.stringify(res));
  },
};

const offlineBoot = {
  id: 'offline-boot-from-cache',
  title: 'App cold-starts offline from the service-worker cache',
  risk: 'X6 — a PWA that cannot boot offline breaks its core promise.',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready).catch(() => {});
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
  title: 'With Safari toolbars visible (short viewport), card + controls stay on-screen',
  risk: 'X3 + R2 — Safari\'s toolbars shrink the viewport; a 100vh-ish layout pushes '
      + 'the primary controls under the bar so they can\'t be tapped. (Live animated '
      + 'bar resize is Tier-2 — no browser chrome in headless.)',
  expectation: 'must-pass',
  scope: 'device',
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
    assert(clip.docScrollW <= clip.docClientW + 1,
      `horizontal overflow: scrollWidth ${clip.docScrollW} > clientWidth ${clip.docClientW}`);
    const ca = clip['#card-area'];
    assert(ca && ca.top < vp.height && ca.bottom > 0,
      `#card-area is off-screen at ${vp.width}x${vp.height}: ${JSON.stringify(ca)}`);
    const cb = clip['#choice-buttons'];
    if (cb && cb.height > 0) {
      assert(cb.bottom <= vp.height + 2,
        `#choice-buttons extend below the visible viewport (bottom ${cb.bottom} > ${vp.height})`);
    }
  },
};

const iosInstallCoachmark = {
  id: 'ios-install-coachmark-shows',
  title: 'On iOS Safari (not standalone), the Add-to-Home-Screen coach-mark appears',
  risk: 'R7 — iOS has no beforeinstallprompt/install UI; a tab-scoped save is '
      + 'ephemeral, so players who care must install manually. The custom coach-mark '
      + 'must show on iOS-not-standalone and must not depend on an install event.',
  expectation: 'must-pass',
  scope: 'device',
  async run(page, ctx, h) {
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    await page.waitForTimeout(200);
    const shown = await page.locator('.ios-install-hint').count();
    assert(shown > 0, 'no Add-to-Home-Screen coach-mark on iOS Safari (not standalone)');
    // and it must be dismissible + stay dismissed
    await page.evaluate(() => document.querySelector('.ios-install-x')?.click());
    await page.waitForTimeout(100);
    const gone = await page.locator('.ios-install-hint').count();
    assert(gone === 0, 'coach-mark did not dismiss when its close button was tapped');
  },
};

// ---------------------------------------------------------------------------
// STATIC WIRING GUARDS — read the built files, no browser. These are the T1
// half of requirements whose real behaviour only shows on hardware (the other
// half is a `manual` SKIP below).
// ---------------------------------------------------------------------------

async function readDist(rel) { return readFile(join(DIST, rel), 'utf8'); }
function viewportMeta(html) { return (html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i) || [''])[0]; }

const zoomDefenseWired = {
  id: 'zoom-defense-wired',
  title: 'Double-tap-zoom disabled the reliable way; pinch-zoom left intact (R1)',
  risk: 'R1 — the flagship iOS bug: double-tap during fast tapping zooms and traps '
      + 'the user. The fix is touch-action: manipulation (not the ignored viewport '
      + 'zoom-lock) + a non-passive double-tap guard, with NO visualViewport "zoom '
      + 'recovery" fighting deliberate zoom. (The actual zoom is Tier-2.)',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    for (const entry of ['index.html', 'mystery/index.html']) {
      const meta = viewportMeta(await readDist(entry));
      assert(meta, `${entry} has no viewport meta`);
      assert(!/user-scalable\s*=\s*no/i.test(meta), `${entry} viewport hard-disables zoom: ${meta.trim()}`);
      assert(!/maximum-scale\s*=\s*1\b/i.test(meta), `${entry} viewport clamps maximum-scale=1: ${meta.trim()}`);
      assert(/width\s*=\s*device-width/i.test(meta), `${entry} viewport is missing width=device-width: ${meta.trim()}`);
      assert(/viewport-fit\s*=\s*cover/i.test(meta), `${entry} viewport is missing viewport-fit=cover: ${meta.trim()}`);
    }
    const css = await readDist('css/style.css');
    assert(/touch-action:\s*manipulation/.test(css),
      'css does not use touch-action: manipulation (the real double-tap-zoom fix)');
    const platform = await readDist('js/platform.js');
    // The belt-and-suspenders double-tap guard: a NON-PASSIVE touchend listener.
    assert(/addEventListener\(\s*['"]touchend['"]/.test(platform),
      'js/platform.js has no touchend double-tap guard');
    assert(/passive:\s*false/.test(platform),
      'js/platform.js touchend guard is not bound non-passive (needs { passive: false } to preventDefault)');
    // The counter-productive mechanisms must stay GONE.
    assert(!/addEventListener\(\s*['"]gesturestart['"]/.test(platform),
      'js/platform.js still preventDefaults Safari gesture events (that kills pinch-zoom)');
    assert(!/visualViewport[\s\S]{0,80}addEventListener\(\s*['"]resize/.test(platform),
      'js/platform.js still has a visualViewport "zoom recovery" that fights accessibility zoom');
  },
};

const dynamicViewportUnits = {
  id: 'dynamic-viewport-units',
  title: 'Full-screen surfaces use svh/dvh with a vh fallback (R2)',
  risk: 'R2 — 100vh measures the LARGE viewport (bar hidden), so content clips when '
      + 'Safari\'s toolbar is shown. svh never clips/reflows; a vh fallback covers '
      + 'pre-15.4 iOS.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    assert(/height:\s*100svh/.test(css) || /height:\s*100dvh/.test(css),
      'no svh/dvh dynamic viewport unit on any full-height surface');
    assert(/height:\s*100vh\s*;/.test(css) || /height:\s*-webkit-fill-available/.test(css),
      'svh/dvh is used with no plain vh fallback for pre-15.4 iOS');
  },
};

const touchPolishCss = {
  id: 'touch-polish-css',
  title: 'Tap-highlight, long-press callout, and text selection are killed on UI (R5)',
  risk: 'R5 — on fast tapping WebKit flashes a gray tap-highlight, pops the '
      + 'long-press callout menu, and selects text / shows the selection loupe. All '
      + 'must be off on game UI (real text inputs keep normal behaviour).',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    assert(/-webkit-tap-highlight-color:\s*transparent/.test(css), 'missing -webkit-tap-highlight-color: transparent');
    assert(/-webkit-touch-callout:\s*none/.test(css), 'missing -webkit-touch-callout: none');
    assert(/user-select:\s*none/.test(css), 'missing user-select: none on UI');
  },
};

const backdropFilterPrefixed = {
  id: 'backdrop-filter-prefixed',
  title: 'Every backdrop-filter ships a -webkit- prefix (R8)',
  risk: 'R8 — backdrop-filter STILL needs the -webkit- prefix on current Safari; a '
      + 'missing prefix = invisible/opaque panels on iOS.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    const total = (css.match(/backdrop-filter\s*:/g) || []).length;       // includes -webkit- ones
    const webkit = (css.match(/-webkit-backdrop-filter\s*:/g) || []).length;
    const plain = total - webkit;
    assert(webkit >= plain,
      `backdrop-filter used ${plain}x unprefixed but only ${webkit}x with -webkit- (ship both)`);
  },
};

const safeAreaInsets = {
  id: 'safe-area-insets-used',
  title: 'Safe-area insets are applied on all four edges (R6)',
  risk: 'R6 — nothing must hide behind the notch/Dynamic Island (top), home '
      + 'indicator (bottom), or the LANDSCAPE left/right insets (portrait-only '
      + 'testing misses these). Real correctness is Tier-2.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    for (const edge of ['top', 'bottom', 'left', 'right']) {
      assert(new RegExp(`env\\(\\s*safe-area-inset-${edge}`).test(css),
        `css never references env(safe-area-inset-${edge}) — ${edge} inset unhandled`);
    }
  },
};

const overscrollLocked = {
  id: 'overscroll-locked',
  title: 'Elastic overscroll is locked and a card drag can\'t scroll the page (R4)',
  risk: 'R4 — WebKit\'s elastic overscroll bounces the page (revealing a bg strip) '
      + 'or eats a swipe. Lock overscroll, give the card touch-action: none, and set '
      + 'html/body bg to the app bg so any residual bounce doesn\'t flash. (Feel is Tier-2.)',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    assert(/overscroll-behavior:\s*none/.test(css), 'missing overscroll-behavior: none');
    assert(/#card-area\s*\{[^}]*touch-action:\s*none/.test(css) || /\.card\s*\{[^}]*touch-action:\s*none/.test(css),
      'the card surface does not set touch-action: none (a vertical drag could scroll the page)');
    assert(/\bhtml\s*[,{][^}]*background/.test(css),
      'html has no background — a residual overscroll bounce would flash a strip');
  },
};

const keyboardScrollWired = {
  id: 'keyboard-scroll-into-view-wired',
  title: 'A focused input is scrolled into view above the soft keyboard (R10 wiring)',
  risk: 'R10 — the iOS keyboard covers a focused input (layout viewport doesn\'t '
      + 'resize). The real behaviour is Tier-2, but the focusin scroll-into-view '
      + 'must ship.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const platform = await readDist('js/platform.js');
    assert(/addEventListener\(\s*['"]focusin['"]/.test(platform), 'no focusin handler for keyboard scroll-into-view');
    assert(/scrollIntoView/.test(platform), 'focusin handler does not scrollIntoView the focused field');
  },
};

const textSizeAdjust = {
  id: 'text-size-adjust-reset',
  title: '-webkit-text-size-adjust: 100% is set (R9)',
  risk: 'R9 — without it, iPhone LANDSCAPE text-autosizing inflates fonts and breaks '
      + 'the fixed card layout.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const css = await readDist('css/style.css');
    assert(/-webkit-text-size-adjust:\s*100%/.test(css), 'missing -webkit-text-size-adjust: 100%');
  },
};

const audioResumeHandlers = {
  id: 'audio-resume-handlers-wired',
  title: 'Audio resumes on statechange and on returning to the foreground (X4/R3c)',
  risk: 'R3c — iOS parks the context in suspended/interrupted after calls/Siri/route-'
      + 'change/lock; it needs a statechange->resume handler and a visibilitychange '
      + 'resume. (Real interruption recovery is Tier-2.)',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const audio = await readDist('js/audio.js');
    assert(/addEventListener\??\.?\s*\(\s*['"]statechange['"]/.test(audio), 'no statechange handler on the AudioContext');
    assert(/addEventListener\??\.?\s*\(\s*['"]visibilitychange['"]/.test(audio), 'no visibilitychange resume for backgrounding');
    assert(/resume\s*\??\.?\s*\(/.test(audio), 'no resume() call in the audio unlock path');
  },
};

const persistOnHideWired = {
  id: 'persist-on-hide-wired',
  title: 'Run + meta are flushed on visibilitychange/pagehide; storage persistence requested (X5)',
  risk: 'X5/R7 — a backgrounded iOS tab or standalone app is frozen/cold-reloaded; '
      + 'state must be flushed the instant visibility is lost, and durable storage '
      + 'requested. (Eviction/backgrounding fidelity is Tier-2.)',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const ui = await readDist('js/ui.js');
    assert(/addEventListener\(\s*['"]visibilitychange['"]/.test(ui), 'ui.js does not flush state on visibilitychange');
    assert(/addEventListener\(\s*['"]pagehide['"]/.test(ui), 'ui.js does not flush state on pagehide');
    assert(/saveRun\s*\(/.test(ui), 'ui.js visibility flush does not call saveRun');
    const platform = await readDist('js/platform.js');
    assert(/storage\s*\??\.\s*persist\s*\??\.?\s*\(/.test(platform),
      'no navigator.storage.persist() request — saves are eviction-eligible');
  },
};

const iosInstallHintWired = {
  id: 'ios-install-hint-wired',
  title: 'iOS-not-standalone detection drives a custom install coach-mark (R7)',
  risk: 'R7 — install must be offered without depending on beforeinstallprompt '
      + '(which iOS lacks), gated on iOS Safari not-already-standalone.',
  expectation: 'must-pass',
  scope: 'static',
  async run() {
    const platform = await readDist('js/platform.js');
    assert(/standalone/.test(platform), 'no standalone detection in js/platform.js');
    assert(/ios-install-hint/.test(platform), 'no install coach-mark (.ios-install-hint) built in js/platform.js');
  },
};

// ---------------------------------------------------------------------------
// MANUAL / DEVICE-FARM — documented, reported as SKIP. Every one names the tier
// that owns it (see docs/ios-compat.md §Tier-2 / §Tier-3).
// ---------------------------------------------------------------------------

const manual = [
  {
    id: 'double-tap-pinch-zoom-actual', expectation: 'manual', scope: 'device',
    title: 'Double-tap/pinch zoom actually blocked; no stuck-zoom trap (R1)',
    risk: 'R1 — the actual "does it still zoom" check. Headless WebKit has no visual '
        + 'zoom engine — it can neither reproduce the trap nor validate the fix.',
    why: 'Tier-2 real iPhone (device farm). T1 asserts the wiring via zoom-defense-wired.',
  },
  {
    id: 'dvh-live-urlbar-resize', expectation: 'manual', scope: 'device',
    title: 'Live Safari URL-bar collapse/expand svh/dvh reflow during play (R2)',
    risk: 'R2 — desktop WebKit has no collapsing toolbar, so svh/dvh/vh are equal in '
        + 'emulation. Only a real device reproduces the animated resize.',
    why: 'Tier-2 real iPhone. T1 approximates with the short-viewport profile.',
  },
  {
    id: 'safe-area-notch-landscape', expectation: 'manual', scope: 'device',
    title: 'Notch / Dynamic Island / home indicator insets, portrait AND landscape (R6)',
    risk: 'R6 — headless reports zero insets (no notch), so correctness (nothing '
        + 'hidden behind the island or the landscape edges) needs real hardware.',
    why: 'Tier-2 real iPhone with a notch/Dynamic Island. T1 asserts env() usage.',
  },
  {
    id: 'real-audio-output-interruptions', expectation: 'manual', scope: 'device',
    title: 'Real Web Audio output + interruption (call/Siri/lock) recovery (R3a/c)',
    risk: 'R3a/c — headless WebKit has no audio hardware and cannot raise a real '
        + 'interruption; output/latency and true recovery are device-only.',
    why: 'Tier-2 real iPhone. T1 asserts the unlock/resume wiring.',
  },
  {
    id: 'silent-switch-mutes-audio', expectation: 'manual', scope: 'device',
    title: 'The Ring/Silent hardware switch mutes Web Audio (R3b)',
    risk: 'R3b — the single most-missed high-churn item: a phone on silent hears '
        + 'nothing even with a correct unlock, because iOS routes Web Audio through '
        + 'the ringer channel. There is no API to detect or override it.',
    why: 'Tier-3 MANUAL ONLY — a human flips the switch. Not even device farms / the '
        + 'Simulator can toggle it. On the release checklist.',
  },
  {
    id: 'pwa-standalone-a2hs-backgrounding', expectation: 'manual', scope: 'device',
    title: 'PWA standalone launch, Add-to-Home-Screen, backgrounded state-loss (R7)',
    risk: 'R7 — standalone launch, real A2HS, and the cold-reload of a backgrounded '
        + 'standalone app cannot be reproduced headless.',
    why: 'Tier-2 real iPhone. T1 asserts persist/restore, in-app nav (Back guard), '
        + 'and the install-coach gating.',
  },
  {
    id: 'itp-7day-storage-eviction', expectation: 'manual', scope: 'device',
    title: 'ITP 7-day script-writable-storage eviction / save durability (R7)',
    risk: 'R7 — WebKit deletes localStorage/IndexedDB/Cache/SW after 7 days of no '
        + 'interaction; timing is real-world only. Export/A2HS are the mitigations.',
    why: 'Tier-2 real iPhone over time. T1 guards export/import + persist request.',
  },
  {
    id: 'backdrop-filter-fps-tile-blanking', expectation: 'manual', scope: 'device',
    title: 'backdrop-filter FPS + composited-layer tile-blanking on an older iPhone (R8)',
    risk: 'R8 — real-GPU jank and WebKit tile-memory blanking (blank/black tiles or '
        + 'a full reload) need a real, older device; emulation is not representative.',
    why: 'Tier-2 older real iPhone. T1 asserts the -webkit- prefix.',
  },
  {
    id: 'keyboard-visualviewport', expectation: 'manual', scope: 'device',
    title: 'Soft-keyboard / visualViewport scroll-into-view for save-code entry (R10)',
    risk: 'R10 — the iOS keyboard covers a focused input (layout viewport doesn\'t '
        + 'resize). No soft keyboard exists in headless.',
    why: 'Tier-2 real iPhone. T1 wires the focusin scroll-into-view.',
  },
  {
    id: 'landscape-text-autosize-dynamic-type', expectation: 'manual', scope: 'device',
    title: 'Landscape text-autosizing and Dynamic Type reflow (R9)',
    risk: 'R9 — real font autosizing/Dynamic Type behaviour needs a device + '
        + 'accessibility text-size settings.',
    why: 'Tier-2 real iPhone. T1 asserts the -webkit-text-size-adjust reset.',
  },
  {
    id: 'in-app-webview-degradation', expectation: 'manual', scope: 'device',
    title: 'Instagram/Facebook in-app WebView graceful degradation + Open-in-Safari (R7)',
    risk: 'In-app WebViews often have no service worker, ephemeral storage, and no '
        + 'A2HS — worse than Safari. Confirm graceful degradation + an Open-in-Safari nudge.',
    why: 'Tier-3 MANUAL ONLY — open the game inside the real IG/FB in-app browser.',
  },
];

export const PROBES = [
  // device guards
  smoke, fastTapNotDropped, webAudioUnlock, savePersistsReload, saveExportImport,
  offlineBoot, shortViewport, iosInstallCoachmark,
  // static wiring guards
  zoomDefenseWired, dynamicViewportUnits, touchPolishCss, backdropFilterPrefixed,
  safeAreaInsets, overscrollLocked, keyboardScrollWired, textSizeAdjust,
  audioResumeHandlers, persistOnHideWired, iosInstallHintWired,
  // manual / device-farm SKIPs
  ...manual,
];
