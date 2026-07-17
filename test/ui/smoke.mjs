// UI smoke test (Phase G.1) — the browser coverage the golden masters never had.
// Boots EACH game in a real headless Chromium, plays a scripted run all the way
// to the finale by clicking, and fails on ANY uncaught page error or console
// error. This is what catches the class of bug the engine goldens are blind to:
// a genre-neutral engine that still crashes in a genre-shaped UI (e.g. a finale
// that threw on a missing ending key before the Presenter landed).
//
// Playwright + Chromium are provided by the environment (global install). Run:
//   npm run build && node test/ui/smoke.mjs
// Exits non-zero on any failure so it can gate alongside the sims.

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { skipUnlessRequired } from './require-browser.mjs';

const require = createRequire(import.meta.url);

// Resolve Playwright from the local project, then common global locations
// (this environment ships it globally). If it genuinely isn't installed, skip
// cleanly rather than failing a browserless CI — where a browser exists, the
// test runs for real and its failures are hard failures.
function loadChromium() {
  const candidates = [
    'playwright', 'playwright-core',
    '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
    '/usr/local/lib/node_modules/playwright',
  ];
  for (const c of candidates) {
    try { return require(c).chromium; } catch { /* keep looking */ }
  }
  return null;
}
const chromium = loadChromium();
if (!chromium) {
  skipUnlessRequired('⚠ Playwright not found — skipping UI smoke test (install Playwright + Chromium to run it).');
}

const root = fileURLToPath(new URL('../../dist', import.meta.url));
if (!existsSync(root)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// The stamped release identity (tools/build.mjs → dist/js/version.js): what
// the title screen's version chip and the What's-New sheet must display.
// Imported from the BUILT module (the same way test/release-notes.test.mjs
// reads it — one reader, no second regex parser to drift) so the assertion
// is against what actually ships.
const { APP_VERSION } = await import(pathToFileURL(join(root, 'js/version.js')).href);
if (!APP_VERSION || APP_VERSION === 'dev') {
  console.error('dist/js/version.js carries no stamped APP_VERSION — tools/build.mjs must stamp it.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

// Minimal static server over dist/ (directory → index.html).
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    const body = await readFile(abs);
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

// localStorage seed for a clean, fast, deterministic run: no tutorial, no
// resume, no minigames, reduced motion, silent. Keyed per pack namespace
// (music = empty suffix; other packs = `_<id>`).
function seedScript(nsSuffix) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  return `
    try {
      localStorage.setItem('bigbreak_meta_v1${nsSuffix}', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1${nsSuffix}');
    } catch (e) {}
  `;
}

// A TRUE first-install seed: no tutorialDone, zero runs — the state a brand-new
// player boots into, where the title opens on the playable tutorial. Used by the
// FTUE guard below; the main suite keeps tutorialDone:true for fast seeded runs.
function seedScriptFresh(nsSuffix) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 0, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  return `
    try {
      localStorage.setItem('bigbreak_meta_v1${nsSuffix}', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1${nsSuffix}');
    } catch (e) {}
  `;
}

// Click a selector by dispatching a NATIVE click (element.click()) inside the
// page. This bypasses Playwright's pointer-interception actionability check —
// the game's handlers are plain click listeners, and overlays with a delayed
// dismiss listener would otherwise "intercept pointer events" and stall us.
async function clickJS(page, sel, timeout = 10000) {
  await page.waitForSelector(sel, { timeout });
  await page.evaluate((s) => document.querySelector(s)?.click(), sel);
}

// A pack title stage may VEIL the menu until its ritual runs (the odyssey's
// kindling threshold). Play through it the way a player would: touch the
// scene (twice — the second tap is the sanctioned skip), wait for the lift.
// No-op for packs without a veil.
async function passThreshold(page) {
  const veiled = await page.evaluate(() => !!document.querySelector('#screen-title.title-veiled'));
  if (!veiled) return;
  await page.evaluate(() => { const sc = document.querySelector('.title-scene'); sc?.click(); sc?.click(); });
  await page.waitForFunction(() => !document.querySelector('#screen-title.title-veiled'), { timeout: 3000 });
}

// The setup screen now opens on the identity step (name → gender → personality):
// type a name and, if the pack offers a gender axis, pick one — the personality
// cards only appear once a required gender is chosen. Idempotent and pack-safe.
async function enterIdentity(page) {
  await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
  await page.evaluate(() => {
    const n = document.querySelector('#player-name');
    if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
    if (!document.querySelector('.identity-gender-chip.selected')) {
      document.querySelector('.identity-gender-chip')?.click();
    }
  });
}

// axe-core a11y gate (Epic 7 / decision 3). Inject the bundled axe source into
// the page and scan the current screen for WCAG 2 A/AA violations. We gate on
// SERIOUS + CRITICAL only (the ones that actually lock out AT/keyboard users);
// minor/moderate are reported but don't fail, so the gate is meaningful without
// being a wall. REPORT_ONLY=1 prints findings without failing (calibration).
const AXE_SRC = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_REPORT_ONLY = !!process.env.AXE_REPORT_ONLY;
async function axeScan(page, label, where) {
  await page.evaluate((src) => {
    if (!window.axe) { const s = document.createElement('script'); s.textContent = src; document.head.appendChild(s); }
  }, AXE_SRC);
  const res = await page.evaluate(async () => await window.axe.run(document, {
    resultTypes: ['violations'],
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  }));
  const bad = (res.violations || []).filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const fmt = (vs) => vs.map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help}`).join('\n    ');
  if (res.violations?.length) console.log(`  a11y @ ${label}/${where}: ${res.violations.length} rule(s); serious+critical: ${bad.length}\n    ${fmt(res.violations)}`);
  if (bad.length && !AXE_REPORT_ONLY) throw new Error(`[${label}] axe serious/critical a11y violations @ ${where}:\n    ${fmt(bad)}`);
  return bad.length;
}

async function playToFinale(page, label, pathIndex = 0, finaleDoor = 0, expect = {}) {
  let siblingChecked = false;
  let wordsTakeChecked = false;
  let friezeChecked = 0;
  let friezeTapped = false;

  // The frieze never lies: the strip's data attributes must restate the
  // saved RunState under the vision's own mappings — checked on the live
  // card AND behind a result overlay (the state mutates on resolve and the
  // shell re-renders the tableau with the result). Two independent
  // statements of the mapping: this test and js/packs/odyssey/frieze.ts.
  const friezeTruth = async (where) => {
    const t = await page.evaluate((ns) => {
      // A commit in flight (state saved, result not yet rendered) is not a
      // lie — the words-take marks flag that window, but ONLY until the
      // result overlay opens (the marks persist under it, and the tableau
      // re-renders WITH the result, so behind a live result the band must
      // already be truthful again).
      if (document.querySelector('#choice-buttons .choice-btn.chosen') &&
          !document.querySelector('#overlay.active .tier-badge')) return { inFlight: true };
      const run = JSON.parse(localStorage.getItem('bigbreak_run_v1' + ns) || 'null');
      const f = document.querySelector('#tableau .frieze');
      if (!run || !f) return { missing: !f, noRun: !run };
      return {
        exp: Math.round(run.expedition ?? 0), pos: Math.round(run.poseidon ?? 0),
        ath: Math.round(run.athena ?? 0), ren: Math.round(run.renown ?? 0),
        act: run.act || 1, played: run.cardsPlayedInAct || 0,
        twistAct: run.actTwist?.act ?? 0, twistDelta: run.actTwist?.delta ?? 0,
        doneCyclops: (run.flags || []).includes('ody_done_cyclops'),
        doneUnder: (run.flags || []).includes('ody_done_underworld'),
        rowers: +f.dataset.rowers, sea: f.dataset.sea,
        owl: f.dataset.owl === '1', deeds: +f.dataset.deeds,
        horizon: f.dataset.horizon || '',
      };
    }, expect.friezeNs);
    if (t.inFlight) return; // between commit and result — re-sampled next beat
    if (t.missing) throw new Error(`[${label}] no frieze on the ${where}`);
    if (t.noRun) return; // pre-save edge; the next check will have both
    const wantRowers = Math.max(0, Math.min(12, t.exp));
    const wantSea = t.pos >= 8 ? 'wrath' : t.pos >= 4 ? 'mid' : 'calm';
    const wantOwl = t.ath >= 3;
    const wantDeeds = Math.min(6, Math.ceil(Math.max(0, t.ren) / 2));
    if (t.rowers !== wantRowers || t.sea !== wantSea || t.owl !== wantOwl || t.deeds !== wantDeeds) {
      throw new Error(`[${label}] the frieze lies on the ${where}: state exp=${t.exp} pos=${t.pos} ath=${t.ath} ren=${t.ren} vs band rowers=${t.rowers} sea=${t.sea} owl=${t.owl} deeds=${t.deeds}`);
    }
    // The horizon (I4): geography's forecast restated independently. Acts
    // run 9/10/9 cards — plus this run's act twist, exactly as
    // engine.actLength folds it (min length 3) — landmarks close acts 1 and
    // 2; gulls close the tale.
    const rawLen = { 1: 9, 2: 10, 3: 9 };
    const ends = {};
    for (const a of [1, 2, 3]) {
      ends[a] = Math.max(3, rawLen[a] + (t.twistAct === a ? t.twistDelta : 0)) - 1;
    }
    const loom = (beatAct) => (t.act > beatAct ? 0 : t.act < beatAct ? null
      : (ends[beatAct] - t.played) <= 2 ? Math.max(0, ends[beatAct] - t.played) : null);
    let wantHor = '';
    if (!t.doneCyclops) { const n = loom(1); if (n !== null) wantHor = `cave:${n}`; }
    else if (!t.doneUnder) { const n = loom(2); if (n !== null) wantHor = `ash:${n}`; }
    else if (t.act === 3 && ends[3] - t.played <= 2) wantHor = `gulls:${Math.max(0, ends[3] - t.played)}`;
    if (t.horizon !== wantHor) {
      throw new Error(`[${label}] the horizon lies on the ${where}: act ${t.act} played ${t.played} done(c/u)=${t.doneCyclops}/${t.doneUnder} → want "${wantHor}", band says "${t.horizon}"`);
    }
    friezeChecked++;
  };
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });

  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  await passThreshold(page);
  // The version chip + What's-New sheet (working agreement: a new interactive
  // control gets driven on EVERY surface it appears on, then the run must
  // still reach a terminal screen — the rest of this function IS that
  // assertion). expect.chipPass is set explicitly by the GAMES loop for each
  // game's first pass (an explicit knob, not arithmetic re-derived from loop
  // internals — so a future path-cycling change can't silently strand it).
  // The chip must carry the stamped version, the sheet's top note must match
  // it (the release-notes gate's runtime face), a stamped build must never
  // show its own mixed-delivery warning — and the SECOND surface, Settings →
  // What's new, gets the same drive plus the return trip back to the title.
  // Chip taps here are REAL Playwright clicks (hit-tested), so an element
  // stacked over the chip fails the suite instead of passing a synthetic
  // element.click() that ignores occlusion.
  if (expect.chipPass) {
    const chipText = await page.$eval('#screen-title .version-chip', (el) => el.textContent);
    if (!chipText.startsWith(`v${APP_VERSION}`)) {
      throw new Error(`[${label}] version chip says "${chipText}", build stamped v${APP_VERSION}`);
    }
    await page.click('#screen-title .version-chip', { timeout: 10000 });
    await page.waitForSelector('#overlay.active .release-notes', { timeout: 4000 });
    const sheet = await page.evaluate(() => ({
      current: document.querySelector('#overlay.active .release-current')?.textContent || '',
      topHead: document.querySelector('#overlay.active .release-head')?.textContent || '',
      skew: !!document.querySelector('#overlay.active .release-skew'),
    }));
    if (!sheet.current.includes(`v${APP_VERSION}`)) throw new Error(`[${label}] What's-New sheet reports "${sheet.current}", want v${APP_VERSION}`);
    if (!sheet.topHead.includes(`v${APP_VERSION}`)) throw new Error(`[${label}] top release note is "${sheet.topHead}", want v${APP_VERSION} (notes/version drift)`);
    if (sheet.skew) throw new Error(`[${label}] a clean build shows the mixed-delivery warning`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 4000 });
    // Surface two: Settings → What's new, then Back must land on the title.
    await page.evaluate(() => [...document.querySelectorAll('#screen-title .menu button')]
      .find((b) => b.textContent.includes('Settings'))?.click());
    await page.waitForSelector('#screen-settings.active', { timeout: 5000 });
    const opened = await page.evaluate(() => {
      const b = [...document.querySelectorAll('#screen-settings button')]
        .find((x) => x.textContent.includes('What’s new'));
      if (!b) return false;
      b.click();
      return true;
    });
    if (!opened) throw new Error(`[${label}] Settings has no What's-new entry`);
    await page.waitForSelector('#overlay.active .release-notes', { timeout: 4000 });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 4000 });
    await page.evaluate(() => [...document.querySelectorAll('#screen-settings button')]
      .find((b) => b.textContent.includes('← Back'))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 5000 });
  }
  await clickJS(page, 'button.btn.primary');
  await page.waitForSelector('#screen-setup.active', { timeout: 10000 });
  await enterIdentity(page);
  await clickJS(page, '.pick-card');
  await clickJS(page, '#start-run-btn');
  // The first #screen-crossroads is the path pick; commit the requested summit
  // so every path's finale gets exercised. Later crossroads reuses (Brammies,
  // Final Set) just take the first option.
  let pickedPath = false;

  // State-machine loop: whatever screen/overlay is up, advance it — all via
  // native clicks — until the ending screen. Overlays dismiss by clicking
  // #overlay, but their listener attaches on a 250ms timeout, so wait first.
  const deadline = Date.now() + 90000;
  let guard = 0;
  let scannedCard = false;
  let lightboxRuns = 0;
  let cardCastRuns = 0;
  let feedRuns = 0;
  while (Date.now() < deadline && guard++ < 800) {
    if (errors.length) break;
    const k = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      if (q('#screen-ending.active')) return 'ending';
      if (q('#overlay.active')) return 'overlay';
      if (q('#screen-crossroads.active .pick-card')) return 'cross';
      if (q('#screen-game.active .choice-btn.choice-left')) return 'card';
      return 'wait';
    });
    if (k === 'ending') break;
    if (k === 'overlay') {
      // Regression guard — the portrait soft-lock (2026-07): a portrait opened
      // from WITHIN this overlay (a result beat's reacting face) must stack on
      // the dedicated #overlay-top layer and leave THIS overlay — and its
      // pending advance() — fully intact. The original bug reused the single
      // #overlay, so closing the lightbox destroyed the result overlay without
      // advancing the run, dead-ending the game. If that regressed, the run
      // would never reach the finale asserted below; these checks localize it.
      // Twice per run is plenty to guard the path; exercising every result
      // overlay (30+/run) only lengthens the run and the parallel-Chromium
      // window under `node --test` without adding coverage.
      const faceSel = '#overlay.active .result-face-tappable, #overlay.active .inspect-face-tappable';
      if (lightboxRuns < 2 && await page.$(faceSel)) {
        await page.evaluate((s) => document.querySelector(s).click(), faceSel);
        await page.waitForSelector('#overlay-top.active .portrait-lightbox-img', { timeout: 4000 });
        // SOTA image serving (2026-07): a wired portrait must render as a
        // responsive <picture> — AVIF+WebP <source>s and an <img> carrying a
        // srcset/sizes plus intrinsic width/height. This is the ONLY coverage
        // that the preprocessing→<picture> pipeline actually reaches the DOM
        // (goldens/sims are DOM-free), and it rides the gated result→lightbox
        // path so a break here also blocks the finale-reached assertion below.
        const pic = await page.evaluate(() => {
          const img = document.querySelector('#overlay-top.active .portrait-lightbox-img');
          const picture = img?.closest('picture');
          const types = picture ? [...picture.querySelectorAll('source')].map((s) => s.type) : [];
          return {
            inPicture: !!picture,
            hasAvif: types.includes('image/avif'),
            hasWebp: types.includes('image/webp'),
            hasSrcset: !!img?.getAttribute('srcset'),
            hasDims: !!img?.getAttribute('width') && !!img?.getAttribute('height'),
          };
        });
        if (!pic.inPicture || !pic.hasAvif || !pic.hasWebp)
          throw new Error(`[${label}] wired portrait is not a responsive <picture> (avif=${pic.hasAvif} webp=${pic.hasWebp})`);
        if (!pic.hasSrcset || !pic.hasDims)
          throw new Error(`[${label}] portrait <img> missing srcset/intrinsic dimensions (srcset=${pic.hasSrcset} dims=${pic.hasDims})`);
        const stacked = await page.evaluate(() =>
          !!document.querySelector('#overlay-top.active') && !!document.querySelector('#overlay.active'));
        if (!stacked) throw new Error(`[${label}] portrait lightbox did not stack over its parent overlay`);
        await page.waitForFunction(() => {
          const t = document.querySelector('#overlay-top.active');
          return !t || t.hasAttribute('data-armed');
        }, { timeout: 4000 });
        await page.evaluate(() => document.querySelector('#overlay-top.active')?.click());
        await page.waitForTimeout(150);
        const survived = await page.evaluate(() =>
          !document.querySelector('#overlay-top.active') && !!document.querySelector('#overlay.active'));
        if (!survived) throw new Error(`[${label}] closing the lightbox destroyed the underlying overlay (soft-lock regression)`);
        lightboxRuns++;
      }
      // The unread-feed notification (2026-07): the "Read the feeds" CTA only
      // shows with a badge when the nation has posted something new. Opening it
      // must (1) stack the phone browser OVER this overlay without destroying it
      // (it lives outside #overlay — same soft-lock class as the lightbox) and
      // (2) surface the arrivals HIGHLIGHTED as new. Reading is per-post: tapping
      // a new post marks it read (the unread badge ticks DOWN); "mark all read"
      // clears the rest and (3) collapses the CTA to a "caught up" chip so
      // there's no button left to re-press for stale content. The count is now
      // pool-randomised (5–25), so we assert a sane range, not a fixed number.
      // Then the run must still reach the finale (working agreement rule 1:
      // drive the new control, then assert advance).
      const ctaSel = '#overlay.active .feed-open-btn-new';
      if (feedRuns < 2 && await page.$(ctaSel)) {
        const badge0 = await page.evaluate((s) => {
          const b = document.querySelector(s + ' .feed-badge');
          return b ? parseInt(b.textContent, 10) : NaN;
        }, ctaSel);
        if (!Number.isFinite(badge0)) throw new Error(`[${label}] the feed CTA is showing without an unread badge`);
        if (badge0 < 5 || badge0 > 99) throw new Error(`[${label}] unread badge ${badge0} outside the expected pool range (5–25, 99+ cap)`);
        // The chrome re-voicing (Presenter.feedChrome): the teaser kicker must
        // speak the pack's world — a default leaking through here means the
        // shell ignored the hook (or the pack lost it).
        if (expect.feedKicker) {
          const kick = await page.evaluate(() => document.querySelector('#overlay.active .feed-teaser-kicker')?.textContent || '');
          if (!kick.includes(expect.feedKicker)) throw new Error(`[${label}] feed kicker reads "${kick}" — expected it to carry "${expect.feedKicker}" (feedChrome regression)`);
        }
        await page.evaluate((s) => document.querySelector(s).click(), ctaSel);
        await page.waitForSelector('#feed-layer .feed-post-new', { timeout: 4000 });
        const view = await page.evaluate(() => ({
          overlayAlive: !!document.querySelector('#overlay.active'),
          newPosts: document.querySelectorAll('#feed-layer .feed-post-new').length,
          hasNewMark: !!document.querySelector('#feed-layer .feed-newmark'),
        }));
        if (!view.overlayAlive) throw new Error(`[${label}] opening the feeds destroyed the result overlay (soft-lock regression)`);
        if (!view.newPosts || !view.hasNewMark) throw new Error(`[${label}] the feeds opened but new posts are not highlighted`);
        // Tap one new post to mark it read — the CTA badge must drop by one.
        await page.evaluate(() => document.querySelector('#feed-layer .feed-post-new')?.click());
        await page.waitForFunction((prev) => {
          const b = document.querySelector('#overlay.active .feed-open-btn-new .feed-badge');
          return !!b && parseInt(b.textContent, 10) === prev - 1;
        }, badge0, { timeout: 4000 }).catch(() => { throw new Error(`[${label}] tapping a new post did not decrement the unread badge`); });
        // Clear the rest, then confirm the CTA collapses to "caught up".
        await page.evaluate(() => document.querySelector('#feed-layer .feed-markall')?.click());
        await page.evaluate(() => document.querySelector('#feed-layer .feed-close')?.click());
        await page.waitForFunction(() => !document.querySelector('#feed-layer'), { timeout: 4000 });
        const collapsed = await page.evaluate(() =>
          !!document.querySelector('#overlay.active .feed-caughtup') &&
          !document.querySelector('#overlay.active .feed-open-btn-new'));
        if (!collapsed) throw new Error(`[${label}] the feed CTA did not collapse to "caught up" after reading all`);
        feedRuns++;
      }
      if (expect.friezeNs && friezeChecked === 1) {
        // Behind a live result overlay: the state just mutated, and the
        // shell re-renders the tableau with the result — the band must
        // already say so (the world updates WITH the outcome).
        const isResult = await page.evaluate(() => !!document.querySelector('#overlay.active .tier-badge'));
        if (isResult) await friezeTruth('result overlay');
        // The tableau is inert behind the modal: it re-renders UNDER the
        // result overlay and is keyboard-reachable there — activating it must
        // NOT open the inspect panel on the shared #overlay, which would
        // destroy the result overlay and its pending advance() (the
        // portrait-lightbox incident's class). Drive it, then require the
        // result overlay to still be standing.
        if (isResult) {
          const survived = await page.evaluate(() => {
            const tab = document.querySelector('#tableau');
            if (!tab) return 'no-tableau';
            tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            tab.click();
            const ov = document.querySelector('#overlay.active');
            return ov && ov.querySelector('.tier-badge') && !ov.querySelector('.inspect-panel') ? 'ok' : 'destroyed';
          });
          if (survived === 'destroyed')
            throw new Error(`[${label}] activating the tableau behind a result overlay replaced the overlay — the pending advance() is gone`);
        }
      }
      // Wait for the overlay to be dismissable rather than racing a fixed
      // sleep against the arm delay: either the click-to-dismiss listener is
      // live (data-armed) or there's a gear button we click directly.
      await page.waitForFunction(() => {
        const ov = document.querySelector('#overlay.active');
        if (!ov) return true;
        return ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
      }, { timeout: 5000 });
      await page.evaluate(() => {
        const ov = document.querySelector('#overlay.active');
        if (!ov) return;
        const gear = ov.querySelector('.gear-choices button');
        (gear || ov).click(); // gear-shelf / exit-interview button, else dismiss
      });
    } else if (k === 'cross') {
      const idx = pickedPath ? finaleDoor : pathIndex;
      pickedPath = true;
      await page.evaluate((i) => {
        const cards = document.querySelectorAll('#screen-crossroads.active .pick-card');
        (cards[i] || cards[0])?.click();
      }, idx);
      await page.waitForTimeout(60);
    } else if (k === 'card') {
      if (!scannedCard) { await axeScan(page, label, 'game-card'); scannedCard = true; }
      // Sibling isolation for the alive-fabric seams (F1): a pack that does
      // NOT implement presenter.tableau must render no #tableau node, and a
      // full-HUD pack without diegeticHud keeps its stat rail — the seams are
      // invisible until a pack opts in.
      if (expect.friezeNs) await friezeTruth('live card');
      // The tableau is a new interactive control on the play screen: drive
      // it (tap → the hard-ruled inspect panel with the numbers → dismiss)
      // and prove the card is still live after (working agreement rule 1).
      if (expect.friezeNs && !friezeTapped && await page.$('#tableau')) {
        friezeTapped = true;
        await page.evaluate(() => document.querySelector('#tableau')?.click());
        await page.waitForSelector('#overlay.active .inspect-panel', { timeout: 4000 });
        const legible = await page.evaluate(() => {
          const t = document.querySelector('#overlay.active .inspect-panel')?.textContent || '';
          return /of 10/.test(t) && /Despair/.test(t) && /stroke \d+ of \d+/.test(t);
        });
        if (!legible) throw new Error(`[${label}] the frieze inspect panel does not state the numbers plainly`);
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          return !ov || ov.hasAttribute('data-armed');
        }, { timeout: 4000 });
        await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        await page.waitForTimeout(120);
        const cardLives = await page.evaluate(() =>
          !document.querySelector('#overlay.active') && !!document.querySelector('#screen-game.active .choice-btn.choice-left'));
        if (!cardLives) throw new Error(`[${label}] closing the frieze inspect panel left no live card`);
      }
      if (!siblingChecked) {
        siblingChecked = true;
        const shape = await page.evaluate(() => ({
          tableau: !!document.querySelector('#tableau'),
          rail: !!document.querySelector('#hud .stat-rail'),
          compact: !!document.querySelector('#hud .drawer-btn'),
        }));
        if (expect.tableau !== undefined && shape.tableau !== expect.tableau) {
          throw new Error(`[${label}] tableau seam leaked: expected tableau=${expect.tableau}, got ${shape.tableau}`);
        }
        if (expect.rail !== undefined && shape.rail !== expect.rail && !shape.compact) {
          throw new Error(`[${label}] stat rail shape changed: expected rail=${expect.rail}, got ${shape.rail}`);
        }
      }
      // The card-cast strip (presenter.cardCast) puts scene portraits ON the
      // dealt card, and a real portrait taps through to the full-size lightbox.
      // Unlike the result beat, the card is NOT an overlay — so the lightbox
      // opens on the dedicated #overlay-top and closing it must return to a live
      // card that still swipes to the finale (working agreement rule 1: drive a
      // new control, then assert the run still advances). Once per run is plenty.
      const chipSel = '#screen-game.active .card-cast .cast-chip-tappable';
      if (cardCastRuns < 1 && await page.$(chipSel)) {
        await page.evaluate((s) => document.querySelector(s).click(), chipSel);
        await page.waitForSelector('#overlay-top.active .portrait-lightbox-img', { timeout: 4000 });
        await page.waitForFunction(() => {
          const t = document.querySelector('#overlay-top.active');
          return !t || t.hasAttribute('data-armed');
        }, { timeout: 4000 });
        await page.evaluate(() => document.querySelector('#overlay-top.active')?.click());
        await page.waitForTimeout(120);
        const cardLives = await page.evaluate(() =>
          !document.querySelector('#overlay-top.active') && !!document.querySelector('#screen-game.active .choice-btn.choice-left'));
        if (!cardLives) throw new Error(`[${label}] closing a card-cast lightbox left no live card behind`);
        cardCastRuns++;
      }
      await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
      // The words take (I1, generic mechanism): finishSwipe marks the
      // committed line synchronously — chosen on the swiped side, unchosen
      // on the other. The classes persist until the next deal rebuilds the
      // buttons, so right after the click both must be present.
      if (!wordsTakeChecked) {
        wordsTakeChecked = true;
        const marks = await page.evaluate(() => ({
          chosen: !!document.querySelector('#choice-buttons .choice-btn.choice-left.chosen'),
          unchosen: !!document.querySelector('#choice-buttons .choice-btn.choice-right.unchosen'),
        }));
        if (!marks.chosen || !marks.unchosen) {
          throw new Error(`[${label}] the words did not take: chosen=${marks.chosen} unchosen=${marks.unchosen} after a left commit`);
        }
      }
      await page.waitForTimeout(60);
    } else {
      await page.waitForTimeout(80);
    }
  }

  const reached = !!(await page.$('#screen-ending.active'));
  if (reached) await axeScan(page, label, 'ending');
  if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
  if (!reached) throw new Error(`[${label}] never reached #screen-ending (finale) within budget`);
  const hasVerdict = await page.$('#screen-ending .verdict, #screen-ending .ending-title');
  if (!hasVerdict) throw new Error(`[${label}] ending screen rendered but has no verdict/title`);
  return { lightboxRuns, cardCastRuns, feedRuns };
}

// FTUE guard (2026-07): the first-install flow the main suite skips (it seeds
// tutorialDone:true). Boots a brand-new player, plays the scripted tutorial to
// its wrap-up, then hands off into a real Season — and asserts the two things
// the FTUE polish depends on:
//   1. the scoreboard counters stay HIDDEN during the tutorial (progressive
//      disclosure — an unexplained row of numbers on card one is noise), and
//      APPEAR for the real run;
//   2. tutorial → wrap-up → setup → first real card actually connects (working
//      agreement rule 1: drive the flow, assert it reaches a live card).
// Packs under guard: love-island (counters-HUD FTUE) and odyssey (diegetic
// FTUE — the frieze, not counters, is the real-run HUD proof; its title veil
// and cold-open bard beat are part of the driven flow). Music's tutorial
// rides the same shell gate and is covered by construction.
// opts.realHud: 'counters' (default) asserts the scoreboard appears for the
// real run; 'tableau' asserts the pack's world-strip does instead.
async function playTutorialFtue(page, label, opts = {}) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_(TUNNEL|CONNECTION|NAME)/.test(m.text())) errors.push(`console.error: ${m.text()}`); });

  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  // A pack's title stage may veil the menu behind its ritual (the odyssey
  // threshold) — play through it first, the way a player would.
  await passThreshold(page);
  // Fresh install → the primary button is the playable tutorial.
  await clickJS(page, '#screen-title.active button.btn.primary');
  await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });

  // Assertion 1a: no scoreboard counters during the tutorial.
  const tutCounters = await page.$$eval('#hud .hud-counters > *', (els) => els.length);
  if (tutCounters !== 0) throw new Error(`[${label}] tutorial HUD is showing ${tutCounters} scoreboard counter(s) — should be hidden until the real run`);

  // Play the scripted chain: dismiss the coach mark, take the left choice, clear
  // the result beat, repeat — until the wrap-up screen. Bounded well above the
  // three-card tutorial so a stall fails loudly rather than hanging.
  const deadline = Date.now() + 40000;
  let guard = 0;
  while (Date.now() < deadline && guard++ < 40) {
    if (errors.length) break;
    if (await page.$('#screen-ending.active')) break;
    await page.evaluate(() => document.querySelector('.coach')?.click());
    const onCard = await page.$('#screen-game.active .choice-btn.choice-left');
    if (onCard) {
      await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
    }
    await page.waitForTimeout(150);
    // Clear any result overlay (wait for its arm delay, then click to dismiss).
    if (await page.$('#overlay.active')) {
      await page.waitForFunction(() => {
        const ov = document.querySelector('#overlay.active');
        return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
      }, { timeout: 4000 }).catch(() => {});
      await page.evaluate(() => {
        const ov = document.querySelector('#overlay.active');
        if (ov) (ov.querySelector('.gear-choices button') || ov).click();
      });
      await page.waitForTimeout(120);
    }
  }
  await page.waitForSelector('#screen-ending.active', { timeout: 8000 });

  // Assertion 2a: the wrap-up teaches by recap — a handful of lessons, not a
  // manual — and hands off with a "start your Season" button.
  const lessons = await page.$$eval('#screen-ending.active .result-notices .notice', (els) => els.length);
  if (lessons < 3 || lessons > 6) throw new Error(`[${label}] tutorial wrap-up shows ${lessons} lessons — expected a tight 3–6`);

  await clickJS(page, '#screen-ending.active button.btn.primary');
  await page.waitForSelector('#screen-setup.active', { timeout: 8000 });
  await enterIdentity(page);
  await clickJS(page, '.pick-card');
  await clickJS(page, '#start-run-btn');

  // Assertion 1b + 2b: the real run deals a live card — through any pack
  // beats on the way (the odyssey's cold-open bard beat rides #overlay) —
  // AND the pack's real-run HUD proof shows, proving the tutorial gate
  // flipped and the handoff works.
  {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const k = await page.evaluate(() => {
        if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
        if (document.querySelector('#overlay.active')) return 'overlay';
        return 'wait';
      });
      if (k === 'card') break;
      if (k === 'overlay') {
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          return !ov || ov.hasAttribute('data-armed');
        }, { timeout: 8000 }).catch(() => {});
        await page.evaluate(() => document.querySelector('#overlay.active')?.click());
      }
      await page.waitForTimeout(150);
    }
  }
  await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });
  if ((opts.realHud || 'counters') === 'tableau') {
    const strip = await page.$('#tableau');
    if (!strip) throw new Error(`[${label}] real run shows no #tableau world-strip — the diegetic HUD handoff failed`);
  } else {
    const realCounters = await page.$$eval('#hud .hud-counters > *', (els) => els.length);
    if (realCounters === 0) throw new Error(`[${label}] real run has no scoreboard counters — the tutorial HUD gate didn't flip`);
  }

  if (errors.length) throw new Error(`[${label}] page errors during FTUE:\n  ${errors.join('\n  ')}`);
  return { lessons };
}

const PORT = 8199;
await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;
// The Playwright PACKAGE can be installed without its browser BINARY (e.g. a CI
// job that runs `npm ci` but not `npx playwright install`). Honor the same
// "skip cleanly on browserless CI" contract as the missing-package case above,
// rather than hard-failing — where a browser exists, the test runs for real.
let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (e) {
  skipUnlessRequired('⚠ Chromium browser binary not installed — skipping UI smoke test (run `npx playwright install chromium` to run it).', { cleanup: () => server.close() });
}

const GAMES = [
  // `expect` pins each pack's HUD shape (sibling isolation for the F1 seams):
  // tableau = does the pack render a #tableau strip; rail = does its full HUD
  // keep the numeric stat rail. Flip a pack's entry ONLY when it deliberately
  // opts into the seam.
  { label: 'music', url: `${base}/`, ns: '', paths: 3, expect: { tableau: false, rail: true } },
  { label: 'love-island', url: `${base}/love-island/`, ns: '_love-island', paths: 3, expect: { tableau: false, feedRequired: true, feedKicker: 'The second screen' } },
  // paths counts PASSES here: odyssey cycles its 2 paths and drives a
  // different Hall door each pass (the gated pre-finale surface — working
  // agreement: a new control on a gated surface gets an explicit exercise).
  // I3: odyssey opts into the tableau (the living frieze) + diegeticHud —
  // the strip must exist, the numeric rail must be gone, and the frieze's
  // data attributes must agree with the saved RunState (friezeNs).
  // Pass 15: the odyssey ships feeds (word travels) with a re-voiced chrome —
  // the kicker must read the pack's copy, never the phone-era default.
  { label: 'odyssey', url: `${base}/odyssey/`, ns: '_odyssey', paths: 3, pathCycle: 2, expect: { tableau: true, rail: false, friezeNs: '_odyssey', feedRequired: true, feedKicker: 'Word travels' } },
];

let failed = 0;
for (const g of GAMES) {
  // Play each game once per summit, so every path's Final Set + ending screen
  // renders. A run that fails early (fail state) simply never reaches the pick.
  let feedTotal = 0;
  for (let pi = 0; pi < g.paths; pi++) {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    await ctx.addInitScript(seedScript(g.ns));
    const page = await ctx.newPage();
    try {
      await page.goto(g.url, { waitUntil: 'domcontentloaded' });
      const pathPick = g.pathCycle ? pi % g.pathCycle : pi;
      // chipPass: drive the version chip + What's-New surfaces exactly once
      // per game — an explicit knob (see playToFinale), stated here at the
      // loop that knows what "first pass" means.
      const { lightboxRuns, cardCastRuns, feedRuns } = await playToFinale(page, `${g.label} path#${pi}`, pathPick, g.pathCycle ? pi : 0, { ...(g.expect || {}), chipPass: pi === 0 });
      feedTotal += feedRuns || 0;
      const lb = lightboxRuns ? ` (portrait-lightbox stack verified ×${lightboxRuns})` : '';
      const cc = cardCastRuns ? ` (card-cast lightbox verified ×${cardCastRuns})` : '';
      const fd = feedRuns ? ` (unread-feed notification verified ×${feedRuns})` : '';
      console.log(`✓  ${g.label} path#${pi}: booted and played to a terminal screen, no page errors${lb}${cc}${fd}`);
    } catch (e) {
      failed++;
      console.error(`✗  ${e.message}`);
    } finally {
      await ctx.close();
    }
  }
  // A pack that ships feeds must actually SURFACE them in play — the generic
  // probe only fires when a CTA appears, so a moment-grammar regression (no
  // landmark ever speaks) would otherwise pass silently.
  if (g.expect?.feedRequired && !feedTotal) {
    failed++;
    console.error(`✗  [${g.label}] ships Presenter.feeds but no unread-feed CTA ever surfaced across ${g.paths} full runs`);
  }
}

// FTUE guard: the first-install tutorial flow (love-island), which the seeded
// main loop above deliberately skips.
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(seedScriptFresh('_love-island'));
  const page = await ctx.newPage();
  try {
    await page.goto(`${base}/love-island/`, { waitUntil: 'domcontentloaded' });
    const { lessons } = await playTutorialFtue(page, 'love-island FTUE');
    console.log(`✓  love-island FTUE: first-install tutorial → wrap-up (${lessons} lessons) → real Season, counters gated correctly`);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  } finally {
    await ctx.close();
  }
}

// FTUE guard: the odyssey's First Telling — the same first-install flow
// through the pack's own chrome (the kindling threshold veil, the diegetic
// frieze-not-counters HUD, the cold-open bard beat on the first real deal).
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(seedScriptFresh('_odyssey'));
  const page = await ctx.newPage();
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    const { lessons } = await playTutorialFtue(page, 'odyssey FTUE', { realHud: 'tableau' });
    console.log(`✓  odyssey FTUE: first-install First Telling → wrap-up (${lessons} lessons) → real telling deals with the frieze up`);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  } finally {
    await ctx.close();
  }
}

// Bard-beat reading-order guard (2026-07, "text hierarchy" pass): the beat
// screen's dialogue must be READ top-to-bottom (a heckle sets up the bard's
// reply), but first fixation goes to the biggest/brightest block — the reply.
// The two defenses live in css/odyssey.css (STYLE.md law 9) and both are
// asserted here because goldens/sims are DOM-free and blind to them:
//   1. static hierarchy — the heckle is content, not chrome: near-body size
//      (≥0.9× the bard's) and ≥7:1 contrast on the field, cued `who:`;
//   2. temporal order — the shell paces the lines in speaking order (the
//      first line lands with the panel, later ones wait ~1.5s each), a tap
//      while lines are pending JUMPS to the next line instead of dismissing,
//      and only a fully revealed panel dismisses on tap; with reduced motion
//      everything is visible at once (no invisible-text lock).
// Then the beat must still advance to a live card (flow, not just presence).
// The hush is not a trap, and the ceremonies advance (I7): force each
// temptation through the app's own resume path (currentEventId — the
// worst-cards precedent) and drive BOTH arms; force the wrath ending
// (poseidon at the brink + the name shouted) so the death ceremony (the
// guttering ember, the cold hearth) renders and the run terminates.
async function checkOdysseyCeremony(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey ceremony';
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_cer_seeded')) {
      sessionStorage.setItem('bb_cer_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    }
    const patch = sessionStorage.getItem('bb_cer_patch');
    if (patch) {
      const key = 'bigbreak_run_v1_odyssey';
      const run = JSON.parse(localStorage.getItem(key) || 'null');
      if (run) {
        Object.assign(run, JSON.parse(patch));
        localStorage.setItem(key, JSON.stringify(run));
      }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    // Reach a first card so a run is saved.
    await page.waitForFunction(() =>
      document.querySelector('#screen-game.active .choice-btn.choice-left') || document.querySelector('#overlay.active'),
    { timeout: 15000 });

    // Force a state, resume, reach the target card through its beats.
    const force = async (patch) => {
      await page.evaluate((p) => sessionStorage.setItem('bb_cer_patch', p), JSON.stringify(patch));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      await page.evaluate(() => document.querySelector('button.btn.primary')?.click()); // Resume
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') return;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 });
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
      throw new Error(`[${label}] forced card never dealt`);
    };
    // strict: the decisive click must END the telling by itself — if another
    // live card or a crossroads shows up, the mechanic under test failed;
    // never play through to a natural ending and call that a pass.
    const dismissToState = async (want, timeout = 15000, strict = false) => {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          // A card is LIVE only while its buttons are unmarked — during the
          // commit's flight the old buttons still stand, chosen/unchosen.
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === want) return true;
        if (strict && (k === 'card' || k === 'cross')) return false;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 });
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
          await page.waitForTimeout(60);
        } else if (k === 'card' && want === 'ending') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
          await page.waitForTimeout(70);
        } else await page.waitForTimeout(80);
      }
      return false;
    };

    // Arm 1 — the hush REFUSED: the temptation's beat plays as a hush (no
    // shake, mood-hush on the beat and then the card), refuse (left), and
    // the run continues to a live next beat.
    await force({ currentEventId: 'ody_tempt_lotus', pendingChainId: null, spSeen: {} });
    const hush = await page.evaluate(() => ({
      cardHush: !!document.querySelector('#card-area.mood-hush'),
      bodyHush: !!document.body.classList.contains('ody-hush'),
      banner: document.querySelector('#card-area .set-piece-banner')?.textContent || '',
    }));
    if (!hush.cardHush || !/MEADOW/.test(hush.banner)) {
      throw new Error(`[${label}] the meadow did not hush (mood-hush=${hush.cardHush}, banner="${hush.banner}")`);
    }
    if (!hush.bodyHush) throw new Error(`[${label}] the hush did not reach the world (body.ody-hush missing)`);
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
    if (!(await dismissToState('card'))) throw new Error(`[${label}] refusing the meadow did not continue the telling`);
    const unhushed = await page.evaluate(() => !document.body.classList.contains('ody-hush'));
    if (!unhushed) throw new Error(`[${label}] the hush outlived the temptation`);

    // Arm 2 — the hush ACCEPTED: sitting down in the shade ENDS the telling
    // at a told ending (banked, terminal) — the hush is never a soft-lock.
    await force({ currentEventId: 'ody_tempt_lotus', pendingChainId: null, spSeen: {}, flags: [] });
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-right')?.click());
    if (!(await dismissToState('ending', 15000, true))) throw new Error(`[${label}] accepting the meadow did not itself end the telling`);
    // The trophy shelf pays on the gated surface (pass 2): a banked telling
    // must EARN — the toast on the ending screen and the id in the meta save
    // (behaviour, not presence: this is the write path finishRun really runs).
    const banked = await page.evaluate(() => ({
      toast: [...document.querySelectorAll('#screen-ending .trophy-toast')].map((t) => t.textContent || '').join(' | '),
      metaIds: (JSON.parse(localStorage.getItem('bigbreak_meta_v1_odyssey') || '{}').trophies) || [],
    }));
    if (!banked.metaIds.includes('ody_banked'))
      throw new Error(`[${label}] the banked telling earned no ody_banked trophy (meta has: ${banked.metaIds.join(',') || 'none'})`);
    if (!/Lamp in the Window/.test(banked.toast))
      throw new Error(`[${label}] the ending screen shows no trophy toast for the banked telling (toasts: "${banked.toast}")`);

    // Arm 3 — the wrath ceremony: the sea at the brink + the name shouted =
    // the death ending; the guttered-ember scene renders and the run ends.
    await page.evaluate(() => sessionStorage.removeItem('bb_cer_patch'));
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    // Arm 2 ended (and cleared) the run, so the primary button is New Run.
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    await page.waitForFunction(() =>
      document.querySelector('#screen-game.active .choice-btn.choice-left') || document.querySelector('#overlay.active'),
    { timeout: 15000 });
    await force({ currentEventId: 'ody_cyclops_name', pendingChainId: null, spSeen: { cyclops: true }, poseidon: 8 });
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-right')?.click()); // shout the name: poseidon +3 → 11
    if (!(await dismissToState('ending', 15000, true))) throw new Error(`[${label}] the sea's answer did not itself end the telling`);
    const wrath = await page.evaluate(() => ({
      gutter: !!document.querySelector('#screen-ending .ending-scene.ending-gutter'),
      verdict: document.querySelector('#screen-ending .verdict, #screen-ending .ending-title')?.textContent || '',
      // The exit interview (pass 6): the wrath ending now asks one last
      // question on the way out (a forced overlay the driver answers via its
      // gear-choices button); the chosen answer must land on the ending
      // screen as the epilogue's exit-text — proof the interview flow ran
      // and did not eat the ending (INCIDENTS #1 class).
      exitText: document.querySelector('#screen-ending .exit-text')?.textContent || '',
      // Progressive disclosure (pass 27): this run holds NO turnings, so
      // the ledger must be the single inviting line — no shelf, no count.
      firstLine: document.querySelector('#screen-ending .ody-ledger-first')?.textContent || '',
      shelf: !!document.querySelector('#screen-ending .ody-shelf'),
    }));
    if (!wrath.gutter) throw new Error(`[${label}] the death ending did not gutter the ember (scene missing)`);
    if (!/The trench teaches the first/.test(wrath.firstLine) || wrath.shelf) {
      throw new Error(`[${label}] a no-turnings ending should show one inviting line, not the shelf ceremony (shelf=${wrath.shelf})`);
    }
    if (wrath.exitText.length < 60) throw new Error(`[${label}] the exit interview's answer never reached the ending screen (exit-text: "${wrath.exitText.slice(0, 60)}")`);

    // Later the same evening: this run booted RESUMED (force() reloads, then
    // Resume) — that boot must count as kindled, so returning to the title
    // after the telling ends finds the fire still lit and unveiled, never a
    // second demand for the ritual.
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-ending button')].find((b) => /Title/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    const backLit = await page.evaluate(() => ({
      veil: !!document.querySelector('#screen-title.title-veiled'),
      lit: !!document.querySelector('.title-scene .threshold.kindle-lit'),
    }));
    if (backLit.veil || !backLit.lit)
      throw new Error(`[${label}] the fire went cold after the telling (veil=${backLit.veil} lit=${backLit.lit}) — a resumed boot must count as kindled`);
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: the meadow hushes and releases, accepting banks a terminal telling, the wrath ending gutters the ember, the fire stays lit after the telling`);
  } finally {
    await ctx.close();
  }
}

// Replay legibility slice 2 (docs/games/odyssey/REPLAY-LEGIBILITY-PLAN.md,
// ADR-0002): the fragment-banked notice is now a real Odyssey-native beat —
// a filled amphora slot on the shelf, not a sentence in the result prose.
// Per the working agreement's "verify the flow, gated surface first" rule
// AND the portrait-lightbox incident (INCIDENTS.md, 2026-07): a new control
// on a result overlay must be driven LIVE, not just asserted present in
// isolation, and the run must still reach a terminal screen afterward — a
// control that renders fine but eats the overlay's onClose (which is what
// advances the run) soft-locks exactly like the lightbox did. So this drives
// the pop off a LIVE result overlay, asserts the shelf (and the confetti
// anti-goal) THERE, dismisses it normally, and only then checks the run
// still finishes.
async function checkOdysseyFragmentPop(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: false, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey fragment pop';
  const ctx = await browser.newContext();
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_pop_seeded')) {
      sessionStorage.setItem('bb_pop_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    }
    const patch = sessionStorage.getItem('bb_pop_patch');
    if (patch) {
      const key = 'bigbreak_run_v1_odyssey';
      const run = JSON.parse(localStorage.getItem(key) || 'null');
      if (run) {
        Object.assign(run, JSON.parse(patch));
        localStorage.setItem(key, JSON.stringify(run));
      }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');

    // Reach a live card (the cold-open bard beat fires first — dismiss it).
    const reachCard = async () => {
      const deadline = Date.now() + 30000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') return;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 });
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
      throw new Error(`[${label}] never reached a live card`);
    };
    await reachCard();

    // Force a state, resume, reach the target card through its beats — the
    // worst-cards precedent (checkOdysseyCeremony's force()).
    const force = async (patch) => {
      await page.evaluate((p) => sessionStorage.setItem('bb_pop_patch', p), JSON.stringify(patch));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      await page.evaluate(() => document.querySelector('button.btn.primary')?.click()); // Resume
      await reachCard();
    };
    const dismissToState = async (want, timeout = 15000, strict = false) => {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === want) return true;
        if (strict && (k === 'card' || k === 'cross')) return false;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 });
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
          await page.waitForTimeout(60);
        } else if (k === 'card' && want === 'ending') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
          await page.waitForTimeout(70);
        } else await page.waitForTimeout(80);
      }
      return false;
    };

    // Force the Tiresias card, answer it (either side banks a fore_* flag —
    // resultCue keys off the event id, not the side chosen) — the result
    // overlay is where the pop must fire.
    await force({ currentEventId: 'ody_tiresias', pendingChainId: null, spSeen: {} });
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
    await page.waitForSelector('#overlay.active', { timeout: 10000 });

    // The gated surface first: assert the shelf LIVE, on the still-open
    // result overlay — a filled slot (the turning landed), and the anti-goal
    // (no confetti) right there with it, not just in the unit test.
    const live = await page.evaluate(() => ({
      shelf: !!document.querySelector('#overlay.active .ody-shelf'),
      filled: document.querySelectorAll('#overlay.active .ody-slot-filled').length,
      confetti: !!document.querySelector('#overlay.active .confetti'),
    }));
    if (!live.shelf) throw new Error(`[${label}] no .ody-shelf on the live result overlay — the fragment pop did not render`);
    if (live.filled < 1) throw new Error(`[${label}] the shelf shows no filled slot on the live overlay (the turning did not land)`);
    if (live.confetti) throw new Error(`[${label}] confetti rendered on the live overlay — INCIDENTS #7's anti-goal ("no confetti with a Greek accent") violated`);

    // Dismiss the LIVE overlay exactly the way a player would, then prove
    // firing the pop off it did NOT soft-lock the run (the portrait-
    // lightbox class of bug: an overlay's onClose is what advances the
    // run — a control that eats it dead-ends the telling).
    await page.waitForFunction(() => document.querySelector('#overlay.active')?.hasAttribute('data-armed'), { timeout: 8000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());

    // Localize the soft-lock concern FIRST (the portrait-lightbox class of
    // bug): dismissing the pop overlay must ADVANCE the telling to a live
    // next state — a card, the crossroads, another beat, or the ending —
    // never leave the same pop overlay standing with its pending advance()
    // eaten. This is the assertion that actually distinguishes a soft-lock
    // from a slow traverse.
    const advanced = await page.waitForFunction(() =>
      document.querySelector('#screen-ending.active') ||
      document.querySelector('#screen-crossroads.active .pick-card') ||
      (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active .ody-shelf')) ||
      document.querySelector('#overlay.active .bard-beat, #overlay.active .sp-beat'),
    { timeout: 10000 }).then(() => true).catch(() => false);
    if (!advanced) throw new Error(`[${label}] dismissing the fragment pop did not advance the telling — the pop soft-locked the run (INCIDENTS #1 class)`);

    // Then the WHOLE flow still reaches a terminal screen. Generous budget:
    // the forced Tiresias sits deep in act 2, so this is a full traverse to
    // the finale — the same span the generic playToFinale budgets 90s for.
    if (!(await dismissToState('ending', 90000))) throw new Error(`[${label}] the run never reached the finale after the fragment pop`);
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: the turning lands as a filled amphora slot on the LIVE result overlay (no confetti), dismissing it advances the run, and the telling still reaches the finale`);
  } finally {
    await ctx.close();
  }
}

// The act recap (pass 3): the interstitial between acts is a pack takeover
// ("previously on tonight's telling") — a NEW surface on the progression-
// gated path, so per the working agreement it is driven live: force the
// last card of act 2, resolve it, assert the recap overlay renders the
// run's REAL state (the fleet count, the name's fate, the hearth scene),
// then dismiss it and prove act 3 still deals — the interstitial must
// never become the overlay that eats the advance (INCIDENTS #1 class).
async function checkOdysseyRecap(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey recap';
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_rec_seeded')) {
      sessionStorage.setItem('bb_rec_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    }
    const patch = sessionStorage.getItem('bb_rec_patch');
    if (patch) {
      const key = 'bigbreak_run_v1_odyssey';
      const run = JSON.parse(localStorage.getItem(key) || 'null');
      if (run) {
        Object.assign(run, JSON.parse(patch));
        localStorage.setItem(key, JSON.stringify(run));
      }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    const reachCard = async () => {
      const deadline = Date.now() + 30000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') return;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 });
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
      throw new Error(`[${label}] never reached a live card`);
    };
    await reachCard();

    // The last card of act 2, with a telling that has a story to recap:
    // three benches empty, the name swallowed, the sea calm, beats done.
    await page.evaluate((p) => sessionStorage.setItem('bb_rec_patch', p), JSON.stringify({
      act: 2, path: 'nostos', cardsPlayedInAct: 9, actTwist: null,
      currentEventId: 'ody_a2_harbor', pendingChainId: null, spSeen: {},
      expedition: 9, poseidon: 0, athena: 4,
      flags: ['ody_done_cyclops', 'ody_done_underworld', 'ody_done_circe', 'ody_done_lotus', 'ody_nobody', 'ody_fore_sea'],
    }));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('button.btn.primary')?.click()); // Resume
    await reachCard();

    // Resolve the act's last card, clear its result — the next overlay must
    // be the act-3 interstitial wearing the recap takeover.
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
    const sawRecap = await page.waitForFunction(() => {
      const ov = document.querySelector('#overlay.active');
      if (!ov) return false;
      if (ov.querySelector('.recap-card')) return 'recap';
      // a result overlay first — clear it once armed
      if (ov.hasAttribute('data-armed')) ov.click();
      return false;
    }, { timeout: 15000 }).then(() => true).catch(() => false);
    if (!sawRecap) throw new Error(`[${label}] the act-3 interstitial never showed the recap takeover`);

    const recap = await page.evaluate(() => {
      const card = document.querySelector('#overlay.active .recap-card');
      // The forced card's own outcome may have moved expedition (a risky
      // side loses 1-2 hulls on a bad roll) — the truth the recap must
      // state is the LIVE run's count, read from the same save it reads.
      const run = JSON.parse(localStorage.getItem('bigbreak_run_v1_odyssey') || '{}');
      return {
        kicker: card?.querySelector('.recap-kicker')?.textContent || '',
        blocks: [...(card?.querySelectorAll('.recap-block') || [])].map((b) => b.textContent || ''),
        scene: !!card?.querySelector('.recap-scene .hearth-row'),
        text: card?.textContent || '',
        expedition: Math.round(run.expedition ?? -1),
      };
    });
    if (!recap.scene) throw new Error(`[${label}] the recap lost the hearth (no .recap-scene .hearth-row)`);
    if (!recap.kicker) throw new Error(`[${label}] the recap has no kicker`);
    if (recap.blocks.length < 4) throw new Error(`[${label}] recap shows ${recap.blocks.length} blocks — expected scene + count + name + gods + road`);
    if (recap.expedition < 6 || recap.expedition > 11) throw new Error(`[${label}] forced state drifted out of the mid-count band (expedition=${recap.expedition}) — retune the force patch`);
    if (!recap.text.includes(String(recap.expedition))) throw new Error(`[${label}] the count block does not state the fleet's real count (${recap.expedition})`);
    if (!/Nobody|anchor-stone|unprovoked/i.test(recap.text)) throw new Error(`[${label}] the name block does not tell the swallowed name`);
    if (!/calm|mercy|patience/i.test(recap.text)) throw new Error(`[${label}] the gods block does not read the calm sea`);
    if (!/The road ahead/i.test(recap.text)) throw new Error(`[${label}] the road-ahead overture is missing`);
    // Negative probes (the 2026-07 recap review's escape class): the shell's
    // act-break chrome must not leak another genre's copy onto this surface,
    // and a pack without headlines/dms must get NO flavour fold at all —
    // an empty disclosure widget is a lie about content.
    const leak = await page.evaluate(() => ({
      villa: /villa/i.test(document.querySelector('#overlay.active .act-card')?.textContent || ''),
      fold: !!document.querySelector('#overlay.active .recap-fold'),
    }));
    if (leak.villa) throw new Error(`[${label}] the act break leaked villa copy onto the odyssey surface`);
    if (leak.fold) throw new Error(`[${label}] an empty flavour fold rendered (odyssey ships no headlines/dms)`);

    // Dismiss the interstitial: act 3 must still deal a live card (through
    // any bard beat) — the takeover must never eat the advance.
    await page.waitForFunction(() => {
      const ov = document.querySelector('#overlay.active');
      return !ov || ov.hasAttribute('data-armed');
    }, { timeout: 8000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    await reachCard();
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: act break recaps the run's real state (count ${recap.expedition}, Nobody, calm sea, hearth intact) and act 3 still deals`);
  } finally {
    await ctx.close();
  }
}

// The clarity bundle (pass 4): two surfaces that previously rendered the
// shell's neutral fallbacks now carry the pack's own copy — the Help sheet
// (❓ on the HUD) and the Résumé (title menu). Driven live, per the working
// agreement: open each, assert the odyssey's nouns actually render, close,
// and prove the screen underneath is still alive.
// The weekly Gauntlet via the GENERIC starter (pass 18): before it existed,
// a pack with presenter.gauntlet and no bespoke startGauntlet had a title
// button that cleared your run and then did NOTHING (love-island shipped
// exactly that dead button). Drive the FLOW for both generic-starter packs:
// title → Gauntlet → the week's one drawn build → tap → a live dealt run
// whose saved state carries run.gauntlet = this week.
async function checkGauntletGeneric(browser, base, { label, path, ns, subNeedle }) {
  const meta = {
    lp: 0, lpEarnedTotal: 30, runs: 2, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    playerName: 'Tester', playerGender: 'w',
    lifetime: { swipes: 40, incredibles: 1, bads: 4, byLoadout: {}, byPath: {} },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1${ns}', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1${ns}');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    if (ns === '_odyssey') await passThreshold(page);
    const opened = await page.evaluate(() => {
      const b = [...document.querySelectorAll('#screen-title button')].find((x) => /The Gauntlet/.test(x.textContent || ''));
      if (b) b.click();
      return !!b;
    });
    if (!opened) throw new Error(`[${label}] the title never offers The Gauntlet`);
    await page.waitForSelector('#screen-setup.active', { timeout: 8000 });
    const sheet = await page.evaluate(() => document.querySelector('#screen-setup')?.textContent || '');
    if (!/The Gauntlet — \d{4}-W\d/.test(sheet)) throw new Error(`[${label}] the sheet never names the week`);
    if (!sheet.includes(subNeedle)) throw new Error(`[${label}] the sheet subtitle never says "${subNeedle}"`);
    await clickJS(page, '#screen-setup .pick-card');
    // The tap must mint a live run: a card deals (or an opening beat renders)
    // and the SAVED run carries the week — flow, not presence.
    await page.waitForFunction((key) => !!localStorage.getItem(key), `bigbreak_run_v1${ns}`, { timeout: 10000 });
    const minted = await page.evaluate((key) => {
      const run = JSON.parse(localStorage.getItem(key));
      return { gauntlet: run.gauntlet || null, loadout: run.loadout, gender: run.gender || null, flags: run.flags || [] };
    }, `bigbreak_run_v1${ns}`);
    if (!/^\d{4}-W\d+$/.test(minted.gauntlet || '')) throw new Error(`[${label}] the run never carries the week (gauntlet: ${minted.gauntlet})`);
    // The shared-seed contract, both halves the verifier caught (2026-07):
    // a gendered persona keeps its OWN gender (the remembered player pick
    // must not overwrite the mechanical axis the rival pool hangs off)...
    if (/_girl$|_boy$/.test(minted.loadout)) {
      const encoded = minted.loadout.endsWith('_boy') ? 'boy' : 'girl';
      if (minted.gender !== encoded) throw new Error(`[${label}] the week's ${minted.loadout} plays as '${minted.gender}' — the persona's own gender was overwritten`);
    }
    // ...and a bard's private repertoire never forks the week: no fragment
    // flags in a gauntlet run, however decorated the meta is.
    if (minted.flags.some((f) => f.startsWith('ody_frag_'))) {
      throw new Error(`[${label}] personal prophecy fragments leaked into the shared week: ${minted.flags.filter((f) => f.startsWith('ody_frag_'))}`);
    }
    // The FLOW (working agreement rule 1): the week's build must still carry
    // a full run to a terminal screen, not just deal its first card.
    {
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === 'ending') break;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 }).catch(() => {});
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
        } else if (k === 'card') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
        }
        await page.waitForTimeout(90);
      }
    }
    if (!(await page.$('#screen-ending.active'))) throw new Error(`[${label}] the week's run never reached a terminal screen`);
    // The other fires (pass 33, odyssey): a shared-water ending must count
    // the fleet — the placeholder fills asynchronously, so wait for rows,
    // then hold the panel to its own arithmetic: all 100 tellings counted,
    // exactly one row marked as the player's own fire.
    let firesNote = '';
    if (ns === '_odyssey') {
      await page.waitForFunction(
        () => document.querySelectorAll('#ody-otherfires .ody-fire-row').length > 0,
        null, { timeout: 20000 });
      const fires = await page.evaluate(() => ({
        total: [...document.querySelectorAll('#ody-otherfires .ody-fire-n')].reduce((n, x) => n + Number(x.textContent), 0),
        you: document.querySelectorAll('#ody-otherfires .ody-fire-you').length,
        head: document.querySelector('#ody-otherfires .ody-fires-head')?.textContent || '',
      }));
      if (fires.total !== 100) throw new Error(`[${label}] the other fires counted ${fires.total} tellings, not 100`);
      if (fires.you !== 1) throw new Error(`[${label}] expected exactly one 'your fire' row, got ${fires.you}`);
      if (!/other fires/i.test(fires.head)) throw new Error(`[${label}] the fleet panel lost its heading ("${fires.head}")`);
      firesNote = ', and the other fires count all 100 tellings with the player\'s own marked';
    }
    if (errors.length) throw new Error(`[${label}] ${errors[0]}`);
    console.log(`✓  ${label}: the Gauntlet deals the week's build (${minted.loadout}), keeps the shared seed unforked, and the run reaches a terminal screen${firesNote}`);
  } finally {
    await ctx.close();
  }
}

// The Guest-Gifts (pass 17): the odyssey's LP wall is a NEW title surface
// with a purchase control — drive the FLOW (working agreement rule 1): open
// the re-voiced wall, buy a gift with real LP, then start a telling and
// assert the gift actually landed in the live run's state. Presence of the
// wall is nothing; a coin that mints Renown in play is the feature.
async function checkOdysseyGifts(browser, base) {
  const meta = {
    lp: 100, lpEarnedTotal: 100, runs: 2, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    lifetime: { swipes: 40, incredibles: 1, bads: 4, byLoadout: {}, byPath: {} },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey guest-gifts';
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1_odyssey');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);

    // The wall button wears the pack's chrome, never the career default.
    const btnText = await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].map((b) => b.textContent || '').find((t) => /Guest-Gifts/.test(t)) || '');
    if (!btnText) throw new Error(`[${label}] the title screen never offers The Guest-Gifts`);
    if (!/100 LP/.test(btnText)) throw new Error(`[${label}] the wall button hides the balance: "${btnText}"`);
    if (await page.evaluate(() => [...document.querySelectorAll('#screen-title button')].some((b) => /Career Wall/.test(b.textContent || '')))) {
      throw new Error(`[${label}] the career-era label leaked through the wallCopy hook`);
    }
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].find((b) => /Guest-Gifts/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-wall.active', { timeout: 8000 });
    const wall = await page.evaluate(() => document.querySelector('#screen-wall')?.textContent || '');
    for (const needle of ['The Guest-Gifts', 'A gift once given rides every telling after', 'A Coin from Troy', 'Tier 3']) {
      if (!wall.includes(needle)) throw new Error(`[${label}] the wall never says "${needle}"`);
    }

    // Buy the coin (25 LP): the row flips to UNLOCKED and the balance drops.
    await page.evaluate(() => {
      const row = [...document.querySelectorAll('#screen-wall .wall-item')].find((r) => /A Coin from Troy/.test(r.textContent || ''));
      row?.querySelector('button')?.click();
    });
    await page.waitForFunction(() => {
      const row = [...document.querySelectorAll('#screen-wall .wall-item')].find((r) => /A Coin from Troy/.test(r.textContent || ''));
      return row && /UNLOCKED/.test(row.textContent || '');
    }, { timeout: 4000 });
    const balance = await page.evaluate(() => document.querySelector('#screen-wall .wall-balance')?.textContent || '');
    if (!/75 LP/.test(balance)) throw new Error(`[${label}] 100 − 25 should leave 75, wall says "${balance}"`);

    // Now the flow: back to the fire, start a telling, and the coin MINTS —
    // the live run holds the extra Renown (kings_hall starts 3+1, others 0+1).
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-wall button')].find((b) => /Back/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });
    await clickJS(page, 'button.btn.primary');
    await page.waitForSelector('#screen-setup.active', { timeout: 10000 });
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    await page.waitForFunction(() => !!localStorage.getItem('bigbreak_run_v1_odyssey'), { timeout: 10000 });
    const minted = await page.evaluate(() => {
      const run = JSON.parse(localStorage.getItem('bigbreak_run_v1_odyssey'));
      return { renown: run.renown || 0, loadout: run.loadout, perks: run.perks || [] };
    });
    if (!minted.perks.includes('troy_coin')) throw new Error(`[${label}] the bought gift never reached newRun (perks: ${JSON.stringify(minted.perks)})`);
    const expected = (minted.loadout === 'kings_hall' ? 3 : 0) + 1;
    if (minted.renown !== expected) throw new Error(`[${label}] the coin did not mint: renown ${minted.renown}, expected ${expected} at ${minted.loadout}`);

    if (errors.length) throw new Error(`[${label}] ${errors[0]}`);
    console.log(`✓  odyssey guest-gifts: the wall wears xenia chrome, the coin buys (100→75 LP), and the bought gift mints Renown ${minted.renown} in the live telling at ${minted.loadout}`);
  } finally {
    await ctx.close();
  }
}

async function checkOdysseyClarity(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 55, runs: 3, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    lifetime: { swipes: 90, incredibles: 4, bads: 12, byLoadout: { kings_hall: { runs: 3, wins: 1 } }, byPath: {} },
    odyssey: { fragments: ['sea'], tellings: { count: 3, byEnding: { nostos: 1, wrath: 2 }, named: 2, nobody: 1, crewLostTotal: 11 } },
    // The streak flame (pass 31): yesterday's daily done + today's open →
    // the title's daily button must wear 🔥1 (a live streak, not a dead one).
    dailyResults: { [new Date(Date.now() - 864e5).toISOString().slice(0, 10)]: { result: 'success', path: 'nostos' } },
    // The gallery of nights (pass 24): one painted row (vase fields) and one
    // pre-vase row — the Trophy Room must paint exactly the one that can be.
    runHistory: [
      { date: '2026-07-16', loadout: 'kings_hall', path: 'nostos', result: 'success', endingKey: 'nostos', daily: false, renown: 7, crewLost: 3, vExp: 9, vAth: 6, vPos: 2, vSt: 'cui' },
      { date: '2026-07-15', loadout: 'temple_steps', path: null, result: null, endingKey: 'wrath', daily: false, renown: 3, crewLost: 12 },
    ],
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey clarity';
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1_odyssey');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);

    // The streak flame (pass 31): yesterday's Same Sea is done and today is
    // open — the daily button must carry the live flame.
    const dailyBtn = await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].map((b) => b.textContent || '').find((t) => /Same Sea/.test(t)) || '');
    if (!/🔥1/.test(dailyBtn)) throw new Error(`[${label}] the live streak wears no flame: "${dailyBtn}"`);

    // The Résumé — the bard's ledger, from the title menu.
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].find((b) => /Résumé/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-settings.active', { timeout: 8000 });
    const resume = await page.evaluate(() => document.querySelector('#screen-settings')?.textContent || '');
    for (const needle of ['Nights at the fire', 'Men named in the sand', '1 of 3', 'anchor-stone', 'The sea answered']) {
      if (!resume.includes(needle)) throw new Error(`[${label}] the Résumé never says "${needle}"`);
    }
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-settings button')].find((b) => /Back/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });

    // The Benches (pass 12): the roster gallery is a NEW title-screen surface
    // — open it, assert the three circles render with sprite faces, and close
    // back to a live title (flow, not presence).
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].find((b) => /Meet the Cast/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-roster.active', { timeout: 8000 });
    const roster = await page.evaluate(() => ({
      heads: [...document.querySelectorAll('#screen-roster .wall-tier')].map((h) => h.textContent || ''),
      cells: document.querySelectorAll('#screen-roster .roster-cell').length,
      sprites: document.querySelectorAll('#screen-roster .roster-face svg').length,
      text: document.querySelector('#screen-roster')?.textContent || '',
    }));
    for (const needle of ['The powers', 'The fire', 'The benches']) {
      if (!roster.heads.some((h) => h.includes(needle))) throw new Error(`[${label}] roster missing the "${needle}" circle`);
    }
    if (roster.cells < 20) throw new Error(`[${label}] roster shows only ${roster.cells} cells — the crew is missing`);
    if (roster.sprites < 20) throw new Error(`[${label}] roster faces are not the pack's sprites (${roster.sprites} svgs)`);
    if (!/Phemios of Smyrna/.test(roster.text)) throw new Error(`[${label}] the empty place is not on the roster`);
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-roster button')].find((b) => /Back/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });

    // The gallery of nights (pass 24): the Trophy Room's Past Lives paints
    // the ONE row that carries vase fields — sized, captioned, and the
    // pre-vase row honestly unpainted.
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].find((b) => /Trophy Room/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-trophies.active', { timeout: 8000 });
    const gallery = await page.evaluate(() => {
      const g = document.querySelector('#screen-trophies .history-gallery');
      const nights = g ? [...g.querySelectorAll('.ody-gallery-night')] : [];
      return {
        present: !!g,
        nights: nights.length,
        caption: nights[0]?.querySelector('figcaption')?.textContent || '',
        figHeights: nights[0] ? [...nights[0].querySelectorAll('.ody-vase-fig svg')].map((s) => s.getBoundingClientRect().height) : [],
      };
    });
    if (!gallery.present || gallery.nights !== 1) throw new Error(`[${label}] the gallery paints ${gallery.nights} nights — expected exactly the one painted row`);
    if (gallery.caption !== 'Home') throw new Error(`[${label}] the remembered homecoming captions "${gallery.caption}"`);
    if (!gallery.figHeights.length || gallery.figHeights.some((h) => h < 4 || h > 30)) {
      throw new Error(`[${label}] gallery vase figures mis-sized (${gallery.figHeights.map((h) => Math.round(h)).join(',')})`);
    }
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-trophies button')].find((b) => /Back/.test(b.textContent || ''))?.click());
    await page.waitForSelector('#screen-title.active', { timeout: 8000 });

    // The Help sheet — from a live run's HUD.
    await clickJS(page, '#screen-title.active button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    {
      const deadline = Date.now() + 25000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') break;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 });
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
    }
    await page.evaluate(() =>
      [...document.querySelectorAll('#hud .hud-btn')].find((b) => (b.textContent || '').includes('❓'))?.click());
    await page.waitForSelector('#overlay.active .help-sheet', { timeout: 5000 });
    const help = await page.evaluate(() => document.querySelector('#overlay.active .help-sheet')?.textContent || '');
    for (const needle of ['Expedition', 'Poseidon', 'Athena', 'Renown', 'prophecy']) {
      if (!help.includes(needle)) throw new Error(`[${label}] the Help sheet never says "${needle}"`);
    }
    // Dismiss the sheet; the card must still be live (rule 1).
    await page.waitForFunction(() => {
      const ov = document.querySelector('#overlay.active');
      return !ov || ov.hasAttribute('data-armed');
    }, { timeout: 8000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 8000 });
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: the Résumé reads as the bard's ledger and the Help sheet speaks Odyssey — both close back to a live screen`);
  } finally {
    await ctx.close();
  }
}

// The modes (pass 7): the Scarred Telling is a NEW way to start a run —
// driven end-to-end per the working agreement: unlock it (seeded success),
// start it from the title, and assert the run that deals is actually
// scarred (flag + nine hulls) with a live card up. The Same Sea's renamed
// daily button is asserted on the same boot.
// The sent water (pass 35): a ?sail= link is the share's playable half.
// Drive the WHOLE flow: the title offers the sender's sea, the setup
// speaks it, the minted run carries the seed and stays unforked (a
// decorated meta's private fragments must not board shared water), the
// telling reaches a terminal screen, and the other-fires fleet counts the
// same seed there.
async function checkOdysseySentWater(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 30, runs: 2, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    playerName: 'Tester', playerGender: 'w',
    odyssey: { fragments: ['teststub'] }, // bait: must NOT board the sent water
    lifetime: { swipes: 40, incredibles: 1, bads: 4, byLoadout: {}, byPath: {} },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1_odyssey');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  const label = 'odyssey sent water';
  try {
    await page.goto(`${base}/odyssey/?sail=777`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    const opened = await page.evaluate(() => {
      const b = [...document.querySelectorAll('#screen-title button')].find((x) => /Sail the sent water/.test(x.textContent || ''));
      if (b) b.click();
      return !!b;
    });
    if (!opened) throw new Error(`[${label}] the title never offers the sent water despite ?sail=`);
    await page.waitForSelector('#screen-setup.active .pick-card', { timeout: 8000 });
    const sheet = await page.evaluate(() => document.querySelector('#screen-setup')?.textContent || '');
    if (!/The Sent Water/.test(sheet)) throw new Error(`[${label}] the sheet never names the mode`);
    if (!sheet.includes('sends you its exact sea')) throw new Error(`[${label}] the sheet lost the bard's subtitle`);
    await clickJS(page, '#screen-setup .pick-card');
    await page.evaluate(() => document.querySelector('#start-run-btn')?.click());
    await page.waitForFunction(() => !!localStorage.getItem('bigbreak_run_v1_odyssey'), null, { timeout: 10000 });
    const minted = await page.evaluate(() => {
      const run = JSON.parse(localStorage.getItem('bigbreak_run_v1_odyssey'));
      return { challenge: run.challenge, baseSeed: run.baseSeed, daily: run.daily, flags: run.flags || [] };
    });
    if (minted.challenge !== '777') throw new Error(`[${label}] the run never carries the sent seed (challenge: ${minted.challenge})`);
    if (minted.baseSeed !== 777) throw new Error(`[${label}] baseSeed ${minted.baseSeed} — the share link would resend different water`);
    if (minted.daily) throw new Error(`[${label}] a challenge must not masquerade as the daily (daily: ${minted.daily})`);
    if (minted.flags.some((f) => f.startsWith('ody_frag_'))) {
      throw new Error(`[${label}] private prophecy fragments boarded the sent water: ${minted.flags.filter((f) => f.startsWith('ody_frag_'))}`);
    }
    {
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === 'ending') break;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 }).catch(() => {});
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
        } else if (k === 'card') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
        }
        await page.waitForTimeout(90);
      }
    }
    if (!(await page.$('#screen-ending.active'))) throw new Error(`[${label}] the sent water never reached a terminal screen`);
    await page.waitForFunction(
      () => document.querySelectorAll('#ody-otherfires .ody-fire-row').length > 0,
      null, { timeout: 20000 });
    const fires = await page.evaluate(() => ({
      total: [...document.querySelectorAll('#ody-otherfires .ody-fire-n')].reduce((n, x) => n + Number(x.textContent), 0),
      you: document.querySelectorAll('#ody-otherfires .ody-fire-you').length,
      label: document.querySelector('#ody-otherfires .ody-fires-sub')?.textContent || '',
    }));
    if (fires.total !== 100) throw new Error(`[${label}] the fleet counted ${fires.total} tellings, not 100`);
    if (fires.you !== 1) throw new Error(`[${label}] expected exactly one 'your fire' row, got ${fires.you}`);
    if (!/The Sent Water/.test(fires.label)) throw new Error(`[${label}] the fleet panel lost the water's name ("${fires.label}")`);
    if (errors.length) throw new Error(`[${label}] ${errors[0]}`);
    console.log(`✓  ${label}: ?sail=777 offers, mints, and finishes the sender's exact sea — unforked, terminal, and the fleet counts the same seed`);
  } finally {
    await ctx.close();
  }
}

async function checkOdysseyModes(browser, base) {
  const meta = {
    lp: 20, lpEarnedTotal: 60, runs: 2, unlockedWall: [], trophies: [],
    successPaths: ['nostos'], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey modes';
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1_odyssey');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    const buttons = await page.$$eval('#screen-title button', (els) => els.map((b) => b.textContent || ''));
    if (!buttons.some((b) => /The Same Sea/.test(b))) throw new Error(`[${label}] the daily button does not say The Same Sea (got: ${buttons.join(' | ')})`);
    if (!buttons.some((b) => /Scarred Telling/.test(b))) throw new Error(`[${label}] no Scarred Telling button after a banked success`);
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-title button')].find((b) => /Scarred Telling/.test(b.textContent || ''))?.click());
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    {
      const deadline = Date.now() + 25000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') break;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 }).catch(() => {});
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
    }
    await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 8000 });
    const run = await page.evaluate(() => JSON.parse(localStorage.getItem('bigbreak_run_v1_odyssey') || '{}'));
    if (!(run.flags || []).includes('comeback')) throw new Error(`[${label}] the scarred run carries no comeback flag`);
    if (Math.round(run.expedition) !== 9) throw new Error(`[${label}] the scarred fleet is not nine hulls (expedition=${run.expedition})`);
    if (Math.round(run.poseidon) !== 2) throw new Error(`[${label}] the sea is not pre-provoked (poseidon=${run.poseidon})`);

    // The FLOW, not the feature (working agreement rule 1): the scarred
    // telling must still reach a terminal screen — through its own bard
    // beats (bc_scarred is comeback-only), the landmarks, the crossroads,
    // and whatever interview its ending asks. Same traverse budget as the
    // fragment pop's full run.
    {
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === 'ending') break;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 }).catch(() => {});
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
        } else if (k === 'card') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
        }
        await page.waitForTimeout(90);
      }
    }
    if (!(await page.$('#screen-ending.active'))) throw new Error(`[${label}] the scarred telling never reached a terminal screen`);
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: The Same Sea is offered, the Scarred Telling deals nine hulls + the grudge + the flag, and the scarred run reaches a terminal screen`);
  } finally {
    await ctx.close();
  }
}

// Replay legibility slice 3 (REPLAY-LEGIBILITY-PLAN.md, ADR-0002): the
// run-end progress ledger — the shelf with HONEST EMPTY SLOTS, at the exact
// moment the replay decision is made (the surface whose absence caused the
// museum-signal verdict). A "knowing bard" — two turnings already banked
// from a previous telling, via meta.odyssey.fragments — reaches a terminal
// ending; the ending screen must show the shelf (2 filled slots, reused
// whole from shelf.ts), the "N of 3" count, and the honest floor line naming
// the third turning (never teased, per Q5a). Forced straight to the meadow
// temptation and accepted, well short of the Underworld — the prophecy
// plugin reroutes Tiresias to the third-question variant the instant BOTH
// frag_bow and frag_sea are held (prophecy.ts), so a knowing bard who
// actually reaches the Underworld would land the third turning this same
// telling; forcing past it keeps the held count deterministically at two.
async function checkOdysseyLedger(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: false, minigames: false, haptics: false, analytics: false },
    odyssey: { fragments: ['bow', 'sea'] },
  };
  const label = 'odyssey run-end ledger';
  const ctx = await browser.newContext();
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_ldg_seeded')) {
      sessionStorage.setItem('bb_ldg_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    }
    const patch = sessionStorage.getItem('bb_ldg_patch');
    if (patch) {
      const key = 'bigbreak_run_v1_odyssey';
      const run = JSON.parse(localStorage.getItem(key) || 'null');
      if (run) {
        Object.assign(run, JSON.parse(patch));
        localStorage.setItem(key, JSON.stringify(run));
      }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary'); // New telling — applySetup stamps ody_frag_bow/ody_frag_sea from the knowing bard's meta
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');
    await page.waitForFunction(() =>
      document.querySelector('#screen-game.active .choice-btn.choice-left') || document.querySelector('#overlay.active'),
    { timeout: 15000 });

    // Force a state, resume, reach the target card (the worst-cards
    // precedent, checkOdysseyCeremony's force()). No `flags` key in the
    // patch — the run's existing flags (ody_frag_bow/ody_frag_sea, stamped
    // at setup) must survive Object.assign intact.
    const force = async (patch) => {
      await page.evaluate((p) => sessionStorage.setItem('bb_ldg_patch', p), JSON.stringify(patch));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      await page.evaluate(() => document.querySelector('button.btn.primary')?.click()); // Resume
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) return 'card';
          if (document.querySelector('#overlay.active')) return 'overlay';
          return 'wait';
        });
        if (k === 'card') return;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed');
          }, { timeout: 8000 });
          await page.evaluate(() => document.querySelector('#overlay.active')?.click());
        } else await page.waitForTimeout(80);
      }
      throw new Error(`[${label}] forced card never dealt`);
    };
    const dismissToState = async (want, timeout = 15000, strict = false) => {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        const k = await page.evaluate(() => {
          if (document.querySelector('#screen-ending.active')) return 'ending';
          if (document.querySelector('#overlay.active')) return 'overlay';
          if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
          if (document.querySelector('#screen-game.active .choice-btn.choice-left:not(.chosen):not(.unchosen)')) return 'card';
          return 'wait';
        });
        if (k === want) return true;
        if (strict && (k === 'card' || k === 'cross')) return false;
        if (k === 'overlay') {
          await page.waitForFunction(() => {
            const ov = document.querySelector('#overlay.active');
            return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
          }, { timeout: 8000 });
          await page.evaluate(() => {
            const ov = document.querySelector('#overlay.active');
            (ov?.querySelector('.gear-choices button') || ov)?.click();
          });
        } else if (k === 'cross') {
          await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
          await page.waitForTimeout(60);
        } else if (k === 'card' && want === 'ending') {
          await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
          await page.waitForTimeout(70);
        } else await page.waitForTimeout(80);
      }
      return false;
    };

    // Jump straight to the meadow temptation and accept it — a banked,
    // terminal ending well short of the Underworld, so the knowing bard's
    // two turnings stay exactly two (no third turning landed THIS telling).
    await force({ currentEventId: 'ody_tempt_lotus', pendingChainId: null, spSeen: {} });
    await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-right')?.click());
    if (!(await dismissToState('ending', 15000, true))) throw new Error(`[${label}] accepting the meadow did not itself end the telling`);

    const ledger = await page.evaluate(() => {
      const root = document.querySelector('#screen-ending.active .ody-ledger');
      return {
        present: !!root,
        shelf: !!root?.querySelector('.ody-shelf'),
        filled: root ? root.querySelectorAll('.ody-slot-filled').length : 0,
        text: root ? root.textContent : '',
      };
    });
    if (!ledger.present) throw new Error(`[${label}] no .ody-ledger on the ending screen — the run-end ledger did not render`);
    if (!ledger.shelf) throw new Error(`[${label}] the ledger has no .ody-shelf (shelf.ts not reused)`);
    if (ledger.filled < 2) throw new Error(`[${label}] the knowing bard's ledger shows fewer than 2 filled slots (${ledger.filled})`);
    if (!/of 3/.test(ledger.text)) throw new Error(`[${label}] the ledger text is missing the "of 3" count`);
    if (!/holds the other two/.test(ledger.text)) throw new Error(`[${label}] the ledger is missing the honest-floor line naming the third turning (${JSON.stringify(ledger.text)})`);

    // The Night's Vase (pass 23): a REAL ending must carry the painted band —
    // the ship at final count, at least one more figure, the sea beneath, and
    // an aria label that reads the whole thing (role=img).
    const vase = await page.evaluate(() => {
      const v = document.querySelector('#screen-ending.active .ody-vase');
      const figHeights = v ? [...v.querySelectorAll('.ody-vase-fig svg')].map((s) => s.getBoundingClientRect().height) : [];
      return {
        present: !!v,
        role: v?.getAttribute('role') || '',
        label: v?.getAttribute('aria-label') || '',
        figs: v ? v.querySelectorAll('.ody-vase-fig').length : 0,
        sea: !!v?.querySelector('.ody-vase-sea'),
        figHeights,
        bandHeight: v ? v.getBoundingClientRect().height : 0,
      };
    });
    if (!vase.present) throw new Error(`[${label}] no .ody-vase on the ending screen — the night went unpainted`);
    if (vase.role !== 'img' || !vase.label.includes('tonight’s vase')) throw new Error(`[${label}] the vase is not a labeled image (role=${vase.role})`);
    if (vase.figs < 2 || !vase.sea) throw new Error(`[${label}] the vase band is empty (figs=${vase.figs}, sea=${vase.sea})`);
    // SIZE is behaviour, not presence (the 2026-07 verifier catch): px.ts
    // emits viewBox-only SVGs, so without a CSS rule they render at the
    // browser's 300×150 default and clip inside the band's overflow:hidden.
    if (!vase.figHeights.length || vase.figHeights.some((h) => h < 8 || h > 60)) {
      throw new Error(`[${label}] vase figures mis-sized (heights: ${vase.figHeights.map((h) => Math.round(h)).join(',')}) — the sizing rule went missing`);
    }
    if (vase.bandHeight > 200) throw new Error(`[${label}] the vase towers ${Math.round(vase.bandHeight)}px — figures are rendering at SVG default size`);

    // The share button (pass 8): a new interactive control on the ending
    // screen (previously it copied an EMPTY string for this pack). Headless
    // Chromium has no navigator.share, so the shell takes the clipboard
    // branch — stub writeText, press the button, and assert the telling's
    // record actually travels (and the screen survives the press).
    await page.evaluate(() => {
      window.__shared = null;
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: (t) => { window.__shared = t; return Promise.resolve(); } },
        configurable: true,
      });
      // Pin the clipboard branch: a future headless Chromium exposing the
      // Web Share API would otherwise route the text to a share sheet and
      // starve this probe (verifier's catch — assert by pin, not omission).
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    });
    await page.evaluate(() =>
      [...document.querySelectorAll('#screen-ending button')].find((b) => /Share this run/.test(b.textContent || ''))?.click());
    await page.waitForFunction(() => window.__shared !== null, { timeout: 5000 });
    const shared = await page.evaluate(() => window.__shared || '');
    if (!/^THE ODYSSEY/.test(shared)) throw new Error(`[${label}] the share text does not open with the telling's name (got: "${shared.slice(0, 60)}")`);
    if (!/BANKED AT THE MEADOW/.test(shared)) throw new Error(`[${label}] the share text does not carry the banked verdict (got: "${shared}")`);
    if (!/2 of 3 turnings/.test(shared)) throw new Error(`[${label}] the share text does not carry the knowing bard's honest floor (got: "${shared}")`);
    if (/undefined|NaN/.test(shared)) throw new Error(`[${label}] the share text leaks (got: "${shared}")`);
    if (!(await page.$('#screen-ending.active'))) throw new Error(`[${label}] pressing share left no ending screen`);
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: the knowing bard's run-end screen shows the shelf (${ledger.filled} filled slots), the honest floor, the night's vase (${vase.figs} figures over the sea) — and the telling travels (share carries the verdict + turnings)`);
  } finally {
    await ctx.close();
  }
}

// The threshold (I5): the kindling title. Contract (the plan's named
// invariant — "kindling is skippable"): a fresh visit is veiled (the menu
// is out of reach) until a touch kindles the fire; letting it play lifts
// the veil in ~1s; a second tap mid-kindle completes it at once; and with a
// run in progress there is NO veil (the fire still burns). Each path must
// then reach the deal — ritual, never a lock.
async function checkOdysseyThreshold(browser, base) {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: false, minigames: false, haptics: false, analytics: false },
  };
  const label = 'odyssey threshold';
  const boot = async (ctx) => {
    const page = await ctx.newPage();
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    return page;
  };
  const veiled = (page) => page.evaluate(() => ({
    veil: document.querySelector('#screen-title')?.classList.contains('title-veiled') || false,
    menuHidden: (() => {
      const b = document.querySelector('#screen-title .menu button');
      return !!b && getComputedStyle(b).visibility === 'hidden';
    })(),
    lit: !!document.querySelector('.title-scene .threshold.kindle-lit'),
  }));

  // Pass A — let the kindling play out.
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(`try {
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    } catch (e) {}`);
    try {
      const page = await boot(ctx);
      const before = await veiled(page);
      if (!before.veil || !before.menuHidden) throw new Error(`[${label}] a fresh fire is not veiled (veil=${before.veil} hidden=${before.menuHidden})`);
      // The version chip answers "am I on the right deploy?" from the very
      // first frame — it must be VISIBLE under the veil (odyssey.css exempts
      // it), and tapping it must open the notes WITHOUT kindling the fire
      // (the chip sits above the scene; its tap is its own). Close, verify
      // the veil is still down and the hearth still cold, then kindle as
      // before — the ritual must survive the detour.
      const chip = await page.evaluate(() => {
        const c = document.querySelector('#screen-title .version-chip');
        return c ? { vis: getComputedStyle(c).visibility, pos: getComputedStyle(c).position } : null;
      });
      if (!chip) throw new Error(`[${label}] no version chip on the veiled threshold`);
      if (chip.vis !== 'visible') throw new Error(`[${label}] the veil hides the version chip (visibility=${chip.vis})`);
      if (chip.pos !== 'absolute') throw new Error(`[${label}] the :not() veil lift flattened the chip (position=${chip.pos})`);
      // A REAL hit-tested click (not element.click()): if the full-screen
      // kindle scene — or anything else — ever stacks over the chip, this
      // times out and fails, instead of a synthetic dispatch quietly passing
      // while a player's actual tap lands on the scene.
      await page.click('#screen-title .version-chip', { timeout: 5000 });
      await page.waitForSelector('#overlay.active .release-notes', { timeout: 4000 });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 4000 });
      const mid = await veiled(page);
      if (!mid.veil || mid.lit) throw new Error(`[${label}] reading the notes kindled the fire (veil=${mid.veil} lit=${mid.lit})`);
      await page.evaluate(() => document.querySelector('.title-scene').click());
      await page.waitForFunction(() => !!document.querySelector('.title-scene .threshold.kindle-lit'), { timeout: 3000 });
      await page.waitForFunction(() => !document.querySelector('#screen-title.title-veiled'), { timeout: 2000 });
      const after = await veiled(page);
      if (after.menuHidden) throw new Error(`[${label}] the fire lit but the menu never appeared`);
      // The flow reaches the deal: kindle → new run → a live card.
      await clickJS(page, 'button.btn.primary');
      await enterIdentity(page);
      await clickJS(page, '.pick-card');
      await clickJS(page, '#start-run-btn');
      const dealt = await page.waitForFunction(() =>
        document.querySelector('#screen-game.active .choice-btn.choice-left') || document.querySelector('#overlay.active'),
      { timeout: 15000 }).then(() => true).catch(() => false);
      if (!dealt) throw new Error(`[${label}] kindled, but the telling never dealt`);
    } finally { await ctx.close(); }
  }

  // Pass B — the same tap skips: two touches, lit at once.
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(`try {
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    } catch (e) {}`);
    try {
      const page = await boot(ctx);
      // The skip must be the SECOND TAP's doing, not the clock's: finish()
      // is synchronous, so the fire is lit the instant the second click
      // returns — checked in the same evaluate, no window for the natural
      // kindle (2×STEP_MS) to complete and fake the pass.
      const litAtOnce = await page.evaluate(() => {
        const sc = document.querySelector('.title-scene');
        sc.click();
        sc.click();
        return !!document.querySelector('.title-scene .threshold.kindle-lit');
      });
      if (!litAtOnce) throw new Error(`[${label}] the second tap did not skip the kindling`);
      await page.waitForFunction(() => !document.querySelector('#screen-title.title-veiled'), { timeout: 2000 });
    } finally { await ctx.close(); }
  }

  // Pass C — Resume: the fire still burns; no veil at all.
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(`try {
      if (!sessionStorage.getItem('bb_th_seeded')) {
        sessionStorage.setItem('bb_th_seeded', '1');
        localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
        localStorage.removeItem('bigbreak_run_v1_odyssey');
      }
    } catch (e) {}`);
    try {
      const page = await boot(ctx);
      // Kindle, start a run, play one card so a run is saved…
      await page.evaluate(() => {
        const sc = document.querySelector('.title-scene');
        sc.click();
        sc.click();
      });
      await clickJS(page, 'button.btn.primary');
      await enterIdentity(page);
      await clickJS(page, '.pick-card');
      await clickJS(page, '#start-run-btn');
      await page.waitForFunction(() =>
        document.querySelector('#screen-game.active .choice-btn.choice-left') || document.querySelector('#overlay.active'),
      { timeout: 15000 });
      // …then come back: the fire must still be burning, unveiled.
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      const back = await veiled(page);
      if (back.veil || back.menuHidden || !back.lit) {
        throw new Error(`[${label}] Resume re-veiled the fire (veil=${back.veil} hidden=${back.menuHidden} lit=${back.lit})`);
      }
    } finally { await ctx.close(); }
  }
  console.log(`✓  ${label}: veiled cold, kindles on touch, second tap skips, Resume burns unveiled — and the telling deals`);
}

// The oar-stroke (I1): the odyssey's swipe feel, driven with real pointer
// input under motion ON. Three assertions, per the working agreement (drive
// the new thing, then prove the run still advances):
//   1. water resistance — mid-drag, the card's visual x displacement is
//      meaningfully SMALLER than the raw pointer travel (feel.drag), and
//      non-zero (the card does follow the pull);
//   2. the commit sweeps — releasing past the threshold puts the pack's
//      commit class (.ody-stroke) on the card, and the chosen/unchosen marks
//      land on the buttons (the words take);
//   3. the flow survives — the result overlay arms and dismissing it deals
//      the next beat (card or overlay), no soft-lock.
async function checkOdysseyStroke(browser, base) {
  const ctx = await browser.newContext(); // motion ON: the resistance is under test
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: false, minigames: false, haptics: false, analytics: false },
  };
  // Seed ONCE per tab: the toggle assertion below reloads to resume, and an
  // unguarded seed would wipe the saved run and the patched setting.
  // Patches must ride the init script: the app flushes its in-memory run AND
  // meta to localStorage on pagehide, clobbering evaluate-time edits during
  // the reload itself (the bard-check precedent).
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_stroke_seeded')) {
      sessionStorage.setItem('bb_stroke_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1_odyssey');
    }
    if (sessionStorage.getItem('bb_stroke_rm')) {
      const key = 'bigbreak_meta_v1_odyssey';
      const m = JSON.parse(localStorage.getItem(key) || 'null');
      if (m) { m.settings.reducedMotion = true; localStorage.setItem(key, JSON.stringify(m)); }
      const rkey = 'bigbreak_run_v1_odyssey';
      const r = JSON.parse(localStorage.getItem(rkey) || 'null');
      if (r) { r.stats.burnout = 80; localStorage.setItem(rkey, JSON.stringify(r)); }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  const label = 'odyssey oar-stroke';
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');

    // Reach a live card (the cold-open bard beat fires first — dismiss it).
    const deadline = Date.now() + 30000;
    let onCard = false;
    while (Date.now() < deadline && !onCard) {
      const k = await page.evaluate(() => {
        if (document.querySelector('#overlay.active')) return 'overlay';
        if (document.querySelector('#screen-game.active .card') &&
            document.querySelector('#screen-game.active .choice-btn.choice-left')) return 'card';
        return 'wait';
      });
      if (k === 'card') { onCard = true; break; }
      if (k === 'overlay') {
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          return !ov || ov.hasAttribute('data-armed');
        }, { timeout: 8000 });
        await page.evaluate(() => document.querySelector('#overlay.active')?.click());
      } else await page.waitForTimeout(80);
    }
    if (!onCard) throw new Error(`[${label}] never reached a live card`);

    // The Motion Law is executable, not commentary: the pack sheet must
    // retire the shell's juice under FULL motion (this context has no
    // reduced-motion pref — the law is identity, not an accessibility mode).
    // Synthetic-node computed styles, the SKEW-LAW probe's pattern.
    const law = await page.evaluate(() => {
      const mk = (cls) => { const n = document.createElement('div'); n.className = cls; document.body.appendChild(n); return n; };
      const nodes = ['confetti', 'result-card', 'result-card shake', 'result-card morph-in', 'chip', 'notice'].map(mk);
      const [conf, rise, shake, morph, chip, notice] = nodes.map((n) => getComputedStyle(n));
      const out = {
        confetti: conf.display,
        rise: rise.animationName, shake: shake.animationName,
        morph: morph.animationName, chip: chip.animationName, notice: notice.animationName,
        screen: getComputedStyle(document.querySelector('.screen.active')).animationName,
        snap: getComputedStyle(document.querySelector('#screen-game .card')).transitionTimingFunction,
      };
      nodes.forEach((n) => n.remove());
      return out;
    });
    if (law.confetti !== 'none')
      throw new Error(`[${label}] Motion Law: confetti renders on the odyssey (display=${law.confetti})`);
    for (const k of ['rise', 'shake', 'morph', 'chip', 'notice', 'screen']) {
      if (law[k] !== 'none')
        throw new Error(`[${label}] Motion Law: shell juice '${k}' still animates (animation-name=${law[k]})`);
    }
    if (!/steps\(/.test(law.snap))
      throw new Error(`[${label}] Motion Law: the released oar eases back (${law.snap}) — must return in vase-frames (steps)`);

    // Drag the card 150px right with a real pointer, sample mid-drag.
    const box = await page.evaluate(() => {
      const r = document.querySelector('#screen-game.active .card').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y, { steps: 8 });
    const mid = await page.evaluate(() => {
      const t = document.querySelector('#screen-game.active .card').style.transform;
      const m = /translate3d\((-?[\d.]+)px/.exec(t || '');
      return m ? parseFloat(m[1]) : null;
    });
    if (mid === null || !(mid > 30)) throw new Error(`[${label}] the card does not follow the pull (visual x=${mid} at raw 150px)`);
    if (!(mid < 130)) throw new Error(`[${label}] no water resistance: visual x=${mid} at raw 150px (expected saturation well below the raw travel)`);
    // The ember (I2): standing between the doors, leaning with THIS drag.
    const emberMid = await page.evaluate(() => {
      const e = document.querySelector('#ody-ember');
      return e && { lean: e.style.getPropertyValue('--ember-lean'), wind: e.classList.contains('ember-wind') };
    });
    if (!emberMid) throw new Error(`[${label}] the ember is not mounted between the doors`);
    if (!emberMid.wind || !emberMid.lean || emberMid.lean === '0deg') {
      throw new Error(`[${label}] the ember does not lean with the drag (lean=${emberMid.lean || 'unset'})`);
    }
    // Haul past the threshold and release: the stroke commits.
    await page.mouse.move(box.x + 220, box.y, { steps: 4 });
    await page.mouse.up();
    const committed = await page.evaluate(() => ({
      stroke: !!document.querySelector('#screen-game .card.ody-stroke'),
      chosen: !!document.querySelector('#choice-buttons .choice-btn.choice-right.chosen'),
      unchosen: !!document.querySelector('#choice-buttons .choice-btn.choice-left.unchosen'),
    }));
    if (!committed.stroke) throw new Error(`[${label}] release did not sweep the card (.ody-stroke missing)`);
    if (!committed.chosen || !committed.unchosen) throw new Error(`[${label}] the words did not take on a dragged commit (chosen=${committed.chosen} unchosen=${committed.unchosen})`);
    // The ember snaps upright on release with the stroke.
    const emberEnd = await page.evaluate(() => {
      const e = document.querySelector('#ody-ember');
      return e && { lean: e.style.getPropertyValue('--ember-lean'), wind: e.classList.contains('ember-wind') };
    });
    if (!emberEnd || emberEnd.wind || (emberEnd.lean && emberEnd.lean !== '0deg')) {
      throw new Error(`[${label}] the ember did not snap upright on release (lean=${emberEnd && emberEnd.lean})`);
    }

    // The gated half: the result overlay arms, dismissing advances the run.
    await page.waitForSelector('#overlay.active', { timeout: 8000 });
    await page.waitForFunction(() => {
      const ov = document.querySelector('#overlay.active');
      return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
    }, { timeout: 8000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    const advanced = await page.waitForFunction(() =>
      (document.querySelector('#screen-game.active .choice-btn.choice-left') && !document.querySelector('#overlay.active')) ||
      document.querySelector('#overlay.active .bard-beat, #overlay.active .sp-beat') ||
      document.querySelector('#screen-crossroads.active, #screen-ending.active'),
    { timeout: 8000 }).then(() => true).catch(() => false);
    if (!advanced) throw new Error(`[${label}] the run did not advance after the stroke's result`);
    // The in-game reduced-motion toggle must reach the frieze (ADR-0001:
    // first-class under BOTH prefs; CSS media queries can't see this one, so
    // the shell stamps .tableau-still and the frames must stop).
    await page.evaluate(() => sessionStorage.setItem('bb_stroke_rm', '1'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await page.evaluate(() => document.querySelector('button.btn.primary')?.click()); // Resume
    // The band must really have frames to still (the ship's rowers are a
    // two-frame sprite, so svg.px-anim .pxf always exists on a live run) —
    // 'no frames found' is a FAILURE, not a vacuous pass: a sprite refactor
    // that renamed the classes would otherwise mute this assertion forever.
    const still = await page.waitForFunction(() => {
      const t = document.querySelector('#tableau.tableau-still');
      const f = t && t.querySelector('svg.px-anim .pxf');
      return f ? { anim: getComputedStyle(f).animationName } : null;
    }, { timeout: 15000 }).then((h) => h.jsonValue()).catch(() => null);
    if (!still || still.anim !== 'none') {
      throw new Error(`[${label}] the in-game reduced-motion toggle does not still the frieze (got ${still ? still.anim : 'no stilled band with frames'})`);
    }
    // The ember dims with Despair (I2): burnout was patched to 80 on this
    // reload, so the flame must burn low (1 − 0.55×0.8 = 0.56) — but never out.
    const emberDim = await page.waitForFunction(() => {
      const e = document.querySelector('#ody-ember');
      const o = e && parseFloat(e.style.opacity || '1');
      return e && Number.isFinite(o) && o < 0.7 ? { o } : null;
    }, { timeout: 8000 }).then((h) => h.jsonValue()).catch(() => null);
    if (!emberDim || emberDim.o < 0.3) {
      throw new Error(`[${label}] the ember does not dim with Despair (opacity=${emberDim && emberDim.o})`);
    }
    // Despair salience (pass 4): a world-is-HUD pack has no rail to wear the
    // warn colour, so at burnout 80 the danger pip must ride the counters —
    // and tapping it must explain itself (presenter.statInfo) and hand back
    // a live screen.
    const pip = await page.$('#hud .hud-danger');
    if (!pip) throw new Error(`[${label}] Despair at 80 shows no danger pip on the diegetic HUD`);
    await page.evaluate(() => document.querySelector('#hud .hud-danger')?.click());
    await page.waitForSelector('#overlay.active', { timeout: 4000 });
    const pipSheet = await page.evaluate(() => document.querySelector('#overlay.active')?.textContent || '');
    if (!/Despair/.test(pipSheet) || !/beach|rowing|ember/i.test(pipSheet)) {
      throw new Error(`[${label}] the Despair pip's sheet does not explain the meter (got: "${pipSheet.slice(0, 120)}")`);
    }
    await page.waitForFunction(() => {
      const ov = document.querySelector('#overlay.active');
      return !ov || ov.hasAttribute('data-armed');
    }, { timeout: 8000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 5000 });
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: resistance holds (150px pull → ${Math.round(mid)}px), the ember leans, snaps, and dims with Despair, the sweep commits, the words take, the run advances, the toggle stills the band`);
  } finally {
    await ctx.close();
  }
}

async function checkBardBeatHierarchy(browser, base) {
  const ctx = await browser.newContext(); // motion ON: the stagger is under test
  // Same seed as the main loop but with the in-game motion toggle OFF, so the
  // staggered reveal actually runs.
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: false, minigames: false, haptics: false, analytics: false },
  };
  // Init scripts re-run on EVERY navigation — an unguarded removeItem here
  // would delete the very run save the reload-and-resume loop below depends
  // on. Clear it once, on the first document only. The bc_horse patch ALSO
  // has to live here, not in a plain evaluate: the app flushes its in-memory
  // run to localStorage on pagehide (installPersistOnHide), so a patch made
  // before reload gets clobbered during the reload itself. An init script
  // runs after that flush and before the app boots — the one safe window.
  await ctx.addInitScript(`
    try {
      if (!sessionStorage.getItem('bb_beat_seeded')) {
        sessionStorage.setItem('bb_beat_seeded', '1');
        localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify(meta))});
        localStorage.removeItem('bigbreak_run_v1_odyssey');
      }
      const force = sessionStorage.getItem('bb_force_bard');
      if (force) {
        const key = 'bigbreak_run_v1_odyssey';
        const run = JSON.parse(localStorage.getItem(key) || 'null');
        if (run) { run.bardLine = force; localStorage.setItem(key, JSON.stringify(run)); }
      }
    } catch (e) {}
  `);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  const label = 'odyssey bard-beat hierarchy';
  try {
    await page.goto(`${base}/odyssey/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await passThreshold(page);
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');

    // SKEW LAW (INCIDENTS.md 2026-07): a bard line WITHOUT the shell's
    // `pending` mark must be visible by CSS default. A stylesheet whose BASE
    // state hides dialogue blanks the whole fire the moment it meets a
    // cached script from another deploy that never adds the reveal mark.
    // "Visible" here means readable, not pixel-exact: the shared sheet dims
    // the hint cosmetically (style.css .tap-hint opacity .8). The law is
    // about HIDING — anything below half is a hidden state in disguise.
    const bare = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.className = 'bard-beat';
      probe.innerHTML = '<div class="bard-line"><div class="bard-quote">probe</div></div><p class="tap-hint">probe</p>';
      document.body.appendChild(probe);
      const o = {
        line: getComputedStyle(probe.querySelector('.bard-line')).opacity,
        hint: getComputedStyle(probe.querySelector('.tap-hint')).opacity,
      };
      probe.remove();
      return o;
    });
    if (parseFloat(bare.line) < 0.5 || parseFloat(bare.hint) < 0.5)
      throw new Error(`[${label}] SKEW LAW violated: un-marked dialogue is hidden by CSS alone (line=${bare.line} hint=${bare.hint}) — this blanks the fire under deploy skew`);

    // The cold open always fires on the first deal — the wiring check: the
    // shell marks lines `revealed` and the theme sheet owns a real fade.
    await page.waitForSelector('#overlay.active .bard-beat .bard-line', { timeout: 10000 });
    const open = await page.evaluate(() => {
      const line = document.querySelector('#overlay.active .bard-beat .bard-line');
      return {
        revealed: line.classList.contains('revealed'),
        fade: parseFloat(getComputedStyle(line).transitionDuration),
      };
    });
    if (!open.revealed) throw new Error(`[${label}] the first line must land with the panel (no 'revealed' mark)`);
    if (!(open.fade > 0)) throw new Error(`[${label}] beat lines carry no reveal fade (transition-duration=${open.fade}s)`);

    // Force a heckle script (bc_horse: heckle → reply) onto the saved run and
    // resume: deterministic coverage of the two-voice hierarchy. Resume
    // re-deals the SAME saved card (engine.drawNextCard honors
    // currentEventId), and the cold-open beat above already proved that card
    // is non-landmark (a landmark suppresses beats), so bc_horse surfaces on
    // the first attempt; the loop is a defensive bound, not a randomizer.
    let shown = false;
    await page.evaluate(() => sessionStorage.setItem('bb_force_bard', 'bc_horse'));
    for (let attempt = 0; attempt < 4 && !shown; attempt++) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      await clickJS(page, 'button.btn.primary'); // ▶ Resume Run
      shown = await page.waitForSelector('#overlay.active .bard-beat .is-heckle', { timeout: 6000 })
        .then(() => true).catch(() => false);
    }
    if (!shown) throw new Error(`[${label}] could not surface a heckle beat to measure`);

    const h = await page.evaluate(() => {
      const lum = (c) => {
        const [r, g, b] = c.match(/\d+(\.\d+)?/g).map(Number);
        const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
      const lines = [...document.querySelectorAll('#overlay.active .bard-beat .bard-line')];
      const heckle = document.querySelector('#overlay.active .bard-beat .is-heckle .bard-quote');
      const bard = document.querySelector('#overlay.active .bard-beat .is-bard .bard-quote');
      const who = document.querySelector('#overlay.active .bard-beat .bard-who');
      const hint = document.querySelector('#overlay.active .bard-beat .tap-hint');
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      return {
        order: lines.map((l) => (l.classList.contains('is-heckle') ? 'heckle' : 'bard')),
        revealed: lines.map((l) => l.classList.contains('revealed')),
        pendingHidden: lines.map((l) => l.classList.contains('pending') && getComputedStyle(l).opacity === '0'),
        hintRevealed: hint.classList.contains('revealed'),
        whoText: (who?.textContent || '').trim(),
        sizeRatio: parseFloat(getComputedStyle(heckle).fontSize) / parseFloat(getComputedStyle(bard).fontSize),
        heckleContrast: contrast(getComputedStyle(heckle).color, bodyBg),
        bardBrighter: lum(getComputedStyle(bard).color) > lum(getComputedStyle(heckle).color),
      };
    });
    if (h.order[0] !== 'heckle' || !h.order.includes('bard'))
      throw new Error(`[${label}] dialogue order broken: ${h.order.join(' → ')}`);
    // Pacing: read within ms of the panel landing — the heckle (line 1) is on
    // screen, the reply (line 2, due ~1.5s later) is not, nor is the hint.
    if (!h.revealed[0] || h.revealed[1] || h.hintRevealed)
      throw new Error(`[${label}] reveal must pace in speaking order (revealed=${h.revealed.join(',')} hint=${h.hintRevealed})`);
    // …and the hiding is the shell's `pending` mark doing its job (the CSS
    // pair of the SKEW LAW probe above): the unspoken line is marked and
    // actually hidden; the spoken one is not marked.
    if (h.pendingHidden[0] || !h.pendingHidden[1])
      throw new Error(`[${label}] pending marks wrong (pendingHidden=${h.pendingHidden.join(',')}) — hiding must ride the shell's mark, not the stylesheet's default`);
    if (!/^[^—–-].*:$/.test(h.whoText))
      throw new Error(`[${label}] speaker cue "${h.whoText}" must read as a cue (name + colon, no dash — a dash-attribution names the source of the quote ABOVE it)`);
    if (h.sizeRatio < 0.9)
      throw new Error(`[${label}] heckle demoted below the hierarchy floor: ${h.sizeRatio.toFixed(2)}× the bard's size (need ≥0.9×)`);
    if (h.heckleContrast < 7)
      throw new Error(`[${label}] heckle contrast ${h.heckleContrast.toFixed(1)}:1 — setup text must stay content (≥7:1), not dim chrome`);
    if (!h.bardBrighter)
      throw new Error(`[${label}] the bard must stay the brightest voice on the panel`);

    // Tap while the reply is pending: it must JUMP to the next line — the
    // overlay stays up, the reply and the hint arrive early.
    await page.waitForFunction(() => document.querySelector('#overlay.active')?.hasAttribute('data-armed'), { timeout: 5000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    const jumped = await page.evaluate(() => ({
      alive: !!document.querySelector('#overlay.active'),
      revealed: [...document.querySelectorAll('#overlay.active .bard-beat .bard-line')].map((l) => l.classList.contains('revealed')),
      hintRevealed: !!document.querySelector('#overlay.active .bard-beat .tap-hint.revealed'),
    }));
    if (!jumped.alive)
      throw new Error(`[${label}] a tap during the reveal dismissed the beat — it must jump to the next line`);
    if (jumped.revealed.some((r) => !r) || !jumped.hintRevealed)
      throw new Error(`[${label}] the jump tap did not reveal the next line (revealed=${jumped.revealed.join(',')} hint=${jumped.hintRevealed})`);

    // Reduced motion (OS preference): the still state — everything visible,
    // no transition — the opacity:0 floor must never outlive its reveal.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const still = await page.evaluate(() =>
      [...document.querySelectorAll('#overlay.active .bard-beat .bard-line, #overlay.active .bard-beat .tap-hint')]
        .map((l) => ({ opacity: getComputedStyle(l).opacity, fade: parseFloat(getComputedStyle(l).transitionDuration) })));
    if (still.some((s) => s.opacity !== '1' || s.fade !== 0))
      throw new Error(`[${label}] reduced motion must show all lines instantly: ${JSON.stringify(still)}`);

    // The flow, not the feature: a tap on the fully revealed panel dismisses
    // and must land on a live card.
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });

    // The pacer dies with its beat: Escape a fresh beat while its reply is
    // still pending, then prove the NEXT overlay hears its very first tap.
    // #overlay is a persistent node — a beat whose capture listener outlived
    // it swallowed one tap per unrevealed line on every later overlay (dead
    // taps on progression-gated surfaces; soft-lock on a forced-choice one).
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    let paced = false;
    for (let attempt = 0; attempt < 4 && !paced; attempt++) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      await clickJS(page, 'button.btn.primary'); // ▶ Resume Run
      paced = await page.waitForSelector('#overlay.active .bard-beat .bard-line.pending', { timeout: 6000 })
        .then(() => true).catch(() => false);
    }
    if (!paced) throw new Error(`[${label}] could not surface a paced beat to Escape`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 5000 });
    await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('#tableau')?.click());
    await page.waitForSelector('#overlay.active .inspect-panel', { timeout: 4000 });
    await page.waitForFunction(() => document.querySelector('#overlay.active')?.hasAttribute('data-armed'), { timeout: 5000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    const heard = await page.waitForFunction(() => !document.querySelector('#overlay.active'), { timeout: 3000 })
      .then(() => true).catch(() => false);
    if (!heard)
      throw new Error(`[${label}] first tap after an Escaped beat was swallowed — a stale beat listener is squatting #overlay`);

    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: heckle reads as content (${h.heckleContrast.toFixed(1)}:1, ${h.sizeRatio.toFixed(2)}× size), paced reveal in speaking order, tap jumps ahead, reduced-motion safe, beat advances to the card, an Escaped beat leaves no stale tap-eater`);
    return true;
  } finally {
    await ctx.close();
  }
}
{
  try {
    await checkBardBeatHierarchy(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyStroke(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyThreshold(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyCeremony(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyFragmentPop(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyRecap(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyClarity(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyGifts(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkGauntletGeneric(browser, base, {
      label: 'odyssey gauntlet', path: '/odyssey/', ns: '_odyssey',
      subNeedle: 'the same sea for every bard alive this week',
    });
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkGauntletGeneric(browser, base, {
      label: 'love-island gauntlet (resurrected button)', path: '/love-island/', ns: '_love-island',
      subNeedle: 'One build, chosen by fate',
    });
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyModes(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseySentWater(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
  try {
    await checkOdysseyLedger(browser, base);
  } catch (e) {
    failed++;
    console.error(`✗  ${e.message}`);
  }
}

await browser.close();
server.close();
if (failed) { console.error(`\n✗ ${failed} game(s) failed the UI smoke test.`); process.exit(1); }
console.log(`\n✓ all ${GAMES.length} games + FTUE guard passed the UI smoke test.`);
