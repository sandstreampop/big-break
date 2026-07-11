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
import { fileURLToPath } from 'node:url';
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

async function playToFinale(page, label, pathIndex = 0, finaleDoor = 0) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });

  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
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
// Love-island only — it's the pack whose FTUE this exercises; music's tutorial
// rides the same shell gate and is covered by construction.
async function playTutorialFtue(page, label) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_(TUNNEL|CONNECTION|NAME)/.test(m.text())) errors.push(`console.error: ${m.text()}`); });

  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
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

  // Assertion 1b + 2b: the real Season deals a live card AND the scoreboard
  // counters now show — proving the tutorial gate flipped and the handoff works.
  await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });
  const realCounters = await page.$$eval('#hud .hud-counters > *', (els) => els.length);
  if (realCounters === 0) throw new Error(`[${label}] real run has no scoreboard counters — the tutorial HUD gate didn't flip`);

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
  { label: 'music', url: `${base}/`, ns: '', paths: 3 },
  { label: 'love-island', url: `${base}/love-island/`, ns: '_love-island', paths: 3 },
  // paths counts PASSES here: odyssey cycles its 2 paths and drives a
  // different Hall door each pass (the gated pre-finale surface — working
  // agreement: a new control on a gated surface gets an explicit exercise).
  { label: 'odyssey', url: `${base}/odyssey/`, ns: '_odyssey', paths: 3, pathCycle: 2 },
];

let failed = 0;
for (const g of GAMES) {
  // Play each game once per summit, so every path's Final Set + ending screen
  // renders. A run that fails early (fail state) simply never reaches the pick.
  for (let pi = 0; pi < g.paths; pi++) {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    await ctx.addInitScript(seedScript(g.ns));
    const page = await ctx.newPage();
    try {
      await page.goto(g.url, { waitUntil: 'domcontentloaded' });
      const pathPick = g.pathCycle ? pi % g.pathCycle : pi;
      const { lightboxRuns, cardCastRuns, feedRuns } = await playToFinale(page, `${g.label} path#${pi}`, pathPick, g.pathCycle ? pi : 0);
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

// Bard-beat reading-order guard (2026-07, "text hierarchy" pass): the beat
// screen's dialogue must be READ top-to-bottom (a heckle sets up the bard's
// reply), but first fixation goes to the biggest/brightest block — the reply.
// The two defenses live in css/odyssey.css (STYLE.md law 9) and both are
// asserted here because goldens/sims are DOM-free and blind to them:
//   1. static hierarchy — the heckle is content, not chrome: near-body size
//      (≥0.9× the bard's) and ≥7:1 contrast on the field, cued `who:`;
//   2. temporal order — lines reveal in speaking order (monotonic
//      animation-delays from the shell's --beat-i), the hint after the last
//      line; with reduced motion everything is visible at once (no
//      invisible-text lock).
// Then the beat must still advance to a live card (flow, not just presence).
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
    await clickJS(page, 'button.btn.primary');
    await enterIdentity(page);
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');

    // The cold open always fires on the first deal — the wiring check: the
    // shell must stamp the sequence custom properties the CSS stagger reads.
    await page.waitForSelector('#overlay.active .bard-beat .bard-line', { timeout: 10000 });
    const open = await page.evaluate(() => {
      const line = document.querySelector('#overlay.active .bard-beat .bard-line');
      const hint = document.querySelector('#overlay.active .bard-beat .tap-hint');
      return {
        anim: getComputedStyle(line).animationName,
        lineDelay: parseFloat(getComputedStyle(line).animationDelay),
        hintDelay: parseFloat(getComputedStyle(hint).animationDelay),
      };
    });
    if (open.anim !== 'bard-line-in') throw new Error(`[${label}] beat line is not animated by the reveal (animation-name=${open.anim})`);
    if (open.lineDelay !== 0) throw new Error(`[${label}] first line must reveal immediately (delay=${open.lineDelay}s)`);
    if (open.hintDelay <= 0.4) throw new Error(`[${label}] tap-hint must enter after the dialogue (delay=${open.hintDelay}s)`);

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
        delays: lines.map((l) => parseFloat(getComputedStyle(l).animationDelay)),
        hintDelay: parseFloat(getComputedStyle(hint).animationDelay),
        whoText: (who?.textContent || '').trim(),
        sizeRatio: parseFloat(getComputedStyle(heckle).fontSize) / parseFloat(getComputedStyle(bard).fontSize),
        heckleContrast: contrast(getComputedStyle(heckle).color, bodyBg),
        bardBrighter: lum(getComputedStyle(bard).color) > lum(getComputedStyle(heckle).color),
      };
    });
    if (h.order[0] !== 'heckle' || !h.order.includes('bard'))
      throw new Error(`[${label}] dialogue order broken: ${h.order.join(' → ')}`);
    for (let i = 1; i < h.delays.length; i++) {
      if (!(h.delays[i] > h.delays[i - 1]))
        throw new Error(`[${label}] reveal delays not in speaking order: ${h.delays.join(', ')}`);
    }
    if (!(h.hintDelay > h.delays[h.delays.length - 1]))
      throw new Error(`[${label}] tap-hint (${h.hintDelay}s) must enter after the last line (${h.delays.join(', ')})`);
    if (!/^[^—–-].*:$/.test(h.whoText))
      throw new Error(`[${label}] speaker cue "${h.whoText}" must read as a cue (name + colon, no dash — a dash-attribution names the source of the quote ABOVE it)`);
    if (h.sizeRatio < 0.9)
      throw new Error(`[${label}] heckle demoted below the hierarchy floor: ${h.sizeRatio.toFixed(2)}× the bard's size (need ≥0.9×)`);
    if (h.heckleContrast < 7)
      throw new Error(`[${label}] heckle contrast ${h.heckleContrast.toFixed(1)}:1 — setup text must stay content (≥7:1), not dim chrome`);
    if (!h.bardBrighter)
      throw new Error(`[${label}] the bard must stay the brightest voice on the panel`);

    // Reduced motion (OS preference): every line visible at once — the
    // opacity:0 floor must never survive without its animation.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const still = await page.evaluate(() =>
      [...document.querySelectorAll('#overlay.active .bard-beat .bard-line, #overlay.active .bard-beat .tap-hint')]
        .map((l) => ({ opacity: getComputedStyle(l).opacity, anim: getComputedStyle(l).animationName })));
    if (still.some((s) => s.opacity !== '1' || s.anim !== 'none'))
      throw new Error(`[${label}] reduced motion must show all lines instantly: ${JSON.stringify(still)}`);

    // The flow, not the feature: dismissing the beat must land on a live card.
    await page.waitForFunction(() => document.querySelector('#overlay.active')?.hasAttribute('data-armed'), { timeout: 5000 });
    await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    await page.waitForSelector('#screen-game.active .choice-btn.choice-left', { timeout: 10000 });

    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: heckle reads as content (${h.heckleContrast.toFixed(1)}:1, ${h.sizeRatio.toFixed(2)}× size), reveal follows speaking order, reduced-motion safe, beat advances to the card`);
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
}

await browser.close();
server.close();
if (failed) { console.error(`\n✗ ${failed} game(s) failed the UI smoke test.`); process.exit(1); }
console.log(`\n✓ all ${GAMES.length} games + FTUE guard passed the UI smoke test.`);
