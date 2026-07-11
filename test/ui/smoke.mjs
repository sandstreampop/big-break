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
    // run 9/10/9 cards; landmarks close acts 1 and 2; gulls close the tale.
    const ends = { 1: 8, 2: 9, 3: 8 };
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
      if (expect.friezeNs && friezeChecked === 1) {
        // Behind a live result overlay: the state just mutated, and the
        // shell re-renders the tableau with the result — the band must
        // already say so (the world updates WITH the outcome).
        const isResult = await page.evaluate(() => !!document.querySelector('#overlay.active .tier-badge'));
        if (isResult) await friezeTruth('result overlay');
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
  // `expect` pins each pack's HUD shape (sibling isolation for the F1 seams):
  // tableau = does the pack render a #tableau strip; rail = does its full HUD
  // keep the numeric stat rail. Flip a pack's entry ONLY when it deliberately
  // opts into the seam.
  { label: 'music', url: `${base}/`, ns: '', paths: 3, expect: { tableau: false, rail: true } },
  { label: 'love-island', url: `${base}/love-island/`, ns: '_love-island', paths: 3, expect: { tableau: false } },
  // paths counts PASSES here: odyssey cycles its 2 paths and drives a
  // different Hall door each pass (the gated pre-finale surface — working
  // agreement: a new control on a gated surface gets an explicit exercise).
  // I3: odyssey opts into the tableau (the living frieze) + diegeticHud —
  // the strip must exist, the numeric rail must be gone, and the frieze's
  // data attributes must agree with the saved RunState (friezeNs).
  { label: 'odyssey', url: `${base}/odyssey/`, ns: '_odyssey', paths: 3, pathCycle: 2, expect: { tableau: true, rail: false, friezeNs: '_odyssey' } },
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
      const { lightboxRuns, cardCastRuns, feedRuns } = await playToFinale(page, `${g.label} path#${pi}`, pathPick, g.pathCycle ? pi : 0, g.expect || {});
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
    const dismissToState = async (want, timeout = 15000) => {
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
      beatSeen: !!sessionStorage.getItem('bb_cer_hush') || true, // beat already passed in force(); check the card instead
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
    if (!(await dismissToState('ending'))) throw new Error(`[${label}] accepting the meadow did not reach a terminal screen`);

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
    if (!(await dismissToState('ending'))) throw new Error(`[${label}] the sea's answer did not end the telling`);
    const wrath = await page.evaluate(() => ({
      gutter: !!document.querySelector('#screen-ending .ending-scene.ending-gutter'),
      verdict: document.querySelector('#screen-ending .verdict, #screen-ending .ending-title')?.textContent || '',
    }));
    if (!wrath.gutter) throw new Error(`[${label}] the death ending did not gutter the ember (scene missing)`);
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: the meadow hushes and releases, accepting banks a terminal telling, the wrath ending gutters the ember`);
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
      await page.evaluate(() => {
        const sc = document.querySelector('.title-scene');
        sc.click();
        sc.click();
      });
      const skipped = await page.waitForFunction(() =>
        !!document.querySelector('.title-scene .threshold.kindle-lit') &&
        !document.querySelector('#screen-title.title-veiled'),
      { timeout: 700 }).then(() => true).catch(() => false);
      if (!skipped) throw new Error(`[${label}] the second tap did not skip the kindling`);
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
    const still = await page.waitForFunction(() => {
      const t = document.querySelector('#tableau.tableau-still');
      if (!t) return null;
      const f = t.querySelector('svg.px-anim .pxf');
      return f ? { anim: getComputedStyle(f).animationName } : { anim: 'no-frames' };
    }, { timeout: 15000 }).then((h) => h.jsonValue()).catch(() => null);
    if (!still || (still.anim !== 'none' && still.anim !== 'no-frames')) {
      throw new Error(`[${label}] the in-game reduced-motion toggle does not still the frieze (got ${still && still.anim})`);
    }
    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: resistance holds (150px pull → ${Math.round(mid)}px), the ember leans and snaps, the sweep commits, the words take, the run advances, the toggle stills the band`);
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

    if (errors.length) throw new Error(`[${label}] page errors:\n  ${errors.join('\n  ')}`);
    console.log(`✓  ${label}: heckle reads as content (${h.heckleContrast.toFixed(1)}:1, ${h.sizeRatio.toFixed(2)}× size), paced reveal in speaking order, tap jumps ahead, reduced-motion safe, beat advances to the card`);
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
}

await browser.close();
server.close();
if (failed) { console.error(`\n✗ ${failed} game(s) failed the UI smoke test.`); process.exit(1); }
console.log(`\n✓ all ${GAMES.length} games + FTUE guard passed the UI smoke test.`);
