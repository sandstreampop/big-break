// The mobile matrix — the phone-playability contract, enforced.
//
// "Playable on all phones" is a claim about three axes, and this harness
// drives real seasons in headless Chromium across all of them:
//
//   1. SIZE   — every phone class from the 320px-wide iPhone SE 1 / zoomed
//               Androids up to big flagships, both games. On every dealt
//               card, overlay, and picker screen the layout invariants below
//               must hold.
//   1b. TEXT MODE — at every full-screen set-piece beat of an odyssey season
//               at the 320px floor, big-text (body.big-text → #app zoomed
//               1.18×) is toggled on and the beat box must stay unclipped
//               horizontally (INCIDENTS.md #3).
//   2. ENGINE — a legacy pass with every `:has()` rule stripped from the CSS
//               (Safari < 15.4, Chrome < 105 drop them silently). The layout
//               must not hang off modern selectors; JS-set classes are the
//               source of truth (see renderDealtCard's `has-set-piece`).
//   3. DELIVERY — a version-skew pass: the stylesheet is served WITHOUT its
//               build stamp (emulating a stale cached CSS from an older
//               deploy — the real-phone bug where fresh JS renders new markup
//               that stale CSS has no rules for: unstyled 16px stage text,
//               choice buttons overlapping the card). The boot probe in
//               js/ui.ts must detect the mismatch and re-pull the stylesheet
//               past the cache; this pass fails if the self-heal regresses.
//
// Invariants audited on every visited state:
//   - no page errors;
//   - no horizontal overflow of the document;
//   - both choice buttons fully on-screen and NOT overlapping the card;
//   - the card fits the viewport and the PROMPT is never internally scrolled;
//   - overlays (result cards / set-piece beats) fit the viewport, and their
//     content is never clipped/scrolled horizontally inside the card;
//   - picker cards never overflow horizontally.
//
// Run: npm run build && node test/ui/mobile-matrix.mjs        (full matrix)
//      node test/ui/mobile-matrix.mjs quick                    (2 viewports)
// Exits non-zero on any failure so it gates alongside the other UI suites.

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skipUnlessRequired } from './require-browser.mjs';

const require = createRequire(import.meta.url);
function loadChromium() {
  for (const c of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(c).chromium; } catch { /* keep looking */ }
  }
  return null;
}

const root = fileURLToPath(new URL('../../dist', import.meta.url));
if (!existsSync(root)) { console.error('dist/ not found — run `npm run build` first.'); process.exit(1); }

// ---- static gate: the delivery stamp must exist and agree everywhere ----
// (No browser needed, so this never skips: a build that stops stamping fails
// even on a browserless CI.)
function checkDeliveryStamp() {
  const errs = [];
  const css = readFileSync(join(root, 'css/style.css'), 'utf8');
  const cssV = (css.match(/--bb-css-v:\s*"([a-f0-9]+)"/) || [])[1];
  if (!cssV) errs.push('dist/css/style.css has no --bb-css-v stamp');
  const verJs = readFileSync(join(root, 'js/version.js'), 'utf8');
  const jsV = (verJs.match(/CSS_CONTRACT = '([a-f0-9]+)'/) || [])[1];
  if (!jsV) errs.push('dist/js/version.js has no stamped CSS_CONTRACT');
  if (cssV && jsV && cssV !== jsV) errs.push(`stamp mismatch: css "${cssV}" vs js "${jsV}"`);
  // Every shipped sheet carries its own per-file stamp, so the boot probe can
  // spot a stale PACK sheet next to an agreeing style.css — the skew that
  // blanked the odyssey fires (INCIDENTS.md 2026-07).
  for (const f of readdirSync(join(root, 'css')).filter((n) => n.endsWith('.css'))) {
    const key = f.replace(/\.css$/, '').replace(/[^a-z0-9-]/gi, '');
    const v = (readFileSync(join(root, 'css', f), 'utf8')
      .match(new RegExp(`--bb-css-v-${key}:\\s*"([a-f0-9]+)"`)) || [])[1];
    if (!v) errs.push(`dist/css/${f} has no per-sheet --bb-css-v-${key} stamp`);
    else if (jsV && v !== jsV) errs.push(`per-sheet stamp mismatch: ${f} "${v}" vs js "${jsV}"`);
  }
  for (const html of ['index.html', 'love-island/index.html', 'odyssey/index.html']) {
    const p = join(root, html);
    if (!existsSync(p)) continue;
    const t = readFileSync(p, 'utf8');
    if (!/style\.css\?v=[a-f0-9]+/.test(t)) errs.push(`${html}: stylesheet URL is unversioned`);
    if (!/\.js\?v=[a-f0-9]+/.test(t)) errs.push(`${html}: entry script URL is unversioned`);
  }
  return { errs, cssV };
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };

// The server can degrade the stylesheet per test condition:
//   stripHas  — drop every rule whose selector uses :has()  (legacy engines)
//   stripStamp— drop the --bb-css-v stamp unless the request carries a heal
//               query (version-skew emulation: the first fetch is "stale",
//               the probe's cache-busted refetch gets the true file)
let cssMode = { stripHas: false, stripStamp: false };
const server = createServer(async (req, res) => {
  try {
    const [rawPath, query = ''] = (req.url || '/').split('?');
    let p = decodeURIComponent(rawPath);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    let body = await readFile(abs);
    if (p.endsWith('.css')) {
      let css = body.toString();
      if (cssMode.stripHas) css = css.replace(/(^|\})\s*[^{}@]*:has\([^{]*\{[^{}]*\}/g, '$1');
      if (cssMode.stripStamp && !query.includes('heal=')) css = css.replace(/:root\s*\{\s*--bb-css-v:[^}]*\}/g, '');
      body = Buffer.from(css);
    }
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});

const seedMeta = {
  lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
  successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
  tutorialDone: true, coach: { card: true, result: true },
  settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
};
const seedScript = (nsSuffix) => `try {
  localStorage.setItem('bigbreak_meta_v1${nsSuffix}', ${JSON.stringify(JSON.stringify(seedMeta))});
  localStorage.removeItem('bigbreak_run_v1${nsSuffix}');
} catch (e) {}`;

// Every phone class we claim to support. 320×568 is the floor (iPhone SE 1,
// small/zoomed Androids); 375×667 the short-phone case ADR-0009 pins.
const VIEWPORTS = [
  { w: 320, h: 568, label: 'iPhone-SE1' },
  { w: 360, h: 640, label: 'small-Android' },
  { w: 375, h: 667, label: 'iPhone-SE2' },
  { w: 375, h: 812, label: 'iPhone-X' },
  { w: 390, h: 844, label: 'iPhone-15' },
  { w: 412, h: 915, label: 'Pixel-7' },
];
const QUICK = process.argv.includes('quick');
// Dev escape hatch: BB_MATRIX_ONLY=worst runs just the worst-case card pass
// (red/green verification of that guard without the full matrix). CI never
// sets it, so the gate always runs everything.
const ONLY = process.env.BB_MATRIX_ONLY || '';
const MATRIX_VPS = QUICK ? VIEWPORTS.filter((v) => v.label === 'iPhone-SE1' || v.label === 'iPhone-X') : VIEWPORTS;

const GAMES = [
  { label: 'music', path: '/', ns: '' },
  { label: 'love-island', path: '/love-island/', ns: '_love-island' },
  { label: 'odyssey', path: '/odyssey/', ns: '_odyssey' },
];

// The generic layout invariants, evaluated inside the page for whatever state
// is currently up. Returns a list of violation strings (empty = clean).
function auditFn() {
  const problems = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  const doc = document.documentElement;
  if (doc.scrollWidth > vw + 1) problems.push(`document overflows horizontally (${doc.scrollWidth} > ${vw})`);
  const visible = (n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  const game = document.querySelector('#screen-game.active');
  const overlay = document.querySelector('#overlay.active');
  if (game && !overlay) {
    const card = game.querySelector('.card');
    const cr = card?.getBoundingClientRect();
    if (cr && cr.bottom > vh + 1) problems.push(`card bottom ${Math.round(cr.bottom)} exceeds viewport ${vh}`);
    for (const side of ['choice-left', 'choice-right']) {
      const b = game.querySelector('.choice-btn.' + side);
      if (!b || !visible(b)) continue;
      const r = b.getBoundingClientRect();
      if (r.bottom > vh + 1 || r.top < -1 || r.left < -1 || r.right > vw + 1) {
        problems.push(`${side} not fully on-screen (${Math.round(r.top)}..${Math.round(r.bottom)} of ${vh})`);
      }
      if (cr && r.top < cr.bottom - 2 && r.bottom > cr.top + 2 && r.left < cr.right - 2 && r.right > cr.left + 2) {
        problems.push(`${side} overlaps the card (button top ${Math.round(r.top)} < card bottom ${Math.round(cr.bottom)})`);
      }
    }
    const prompt = game.querySelector('.card-prompt');
    if (prompt && prompt.scrollHeight > prompt.clientHeight + 2) {
      problems.push(`prompt clipped (${prompt.scrollHeight} > ${prompt.clientHeight})`);
    }
  }
  if (overlay) {
    const box = overlay.querySelector('.result-card, .mg-box');
    if (box && visible(box)) {
      const r = box.getBoundingClientRect();
      if (r.top < -1 || r.bottom > vh + 1) problems.push(`overlay card off-screen vertically (${Math.round(r.top)}..${Math.round(r.bottom)} of ${vh})`);
      if (r.left < -1 || r.right > vw + 1) problems.push(`overlay card off-screen horizontally`);
      // Content wider than the card doesn't move its rect — the card's
      // overflow-y:auto computes overflow-x to auto, so oversize text (e.g. a
      // set-piece banner in a wide display face) silently clips inside it.
      if (box.scrollWidth > box.clientWidth + 1) {
        problems.push(`overlay content clipped horizontally inside the card (${box.scrollWidth} > ${box.clientWidth})`);
      }
    }
  }
  for (const pick of document.querySelectorAll('.screen.active .pick-card')) {
    const r = pick.getBoundingClientRect();
    if (r.width && (r.left < -1 || r.right > vw + 1)) { problems.push('pick-card overflows horizontally'); break; }
  }
  // The identity step (name field + gender chips) must fit the narrowest phone too.
  for (const id of document.querySelectorAll('.screen.active .identity-name, .screen.active .identity-gender-chip')) {
    const r = id.getBoundingClientRect();
    if (r.width && (r.left < -1 || r.right > vw + 1)) { problems.push('identity control overflows horizontally'); break; }
  }
  // The tableau strip (presenter.tableau) must fit and never scroll sideways.
  const tab = document.querySelector('#tableau');
  if (tab && tab.offsetHeight) {
    const r = tab.getBoundingClientRect();
    if (r.left < -1 || r.right > vw + 1) problems.push('tableau overflows horizontally');
    if (tab.scrollWidth > tab.clientWidth + 1) problems.push(`tableau content clipped horizontally (${tab.scrollWidth} > ${tab.clientWidth})`);
  }
  return problems;
}

// Drive one full season at one viewport, auditing every state we pass.
async function driveSeason(browser, base, game, vp, tag) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  await ctx.addInitScript(seedScript(game.ns));
  const page = await ctx.newPage();
  const violations = [];
  let cardsAudited = 0;
  page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));

  const audit = async (state) => {
    for (const p of await page.evaluate(auditFn)) violations.push(`${state}: ${p}`);
  };

  try {
    await page.goto(`${base}${game.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await audit('title');
    await page.evaluate(() => document.querySelector('button.btn.primary')?.click());
    // Identity step (name → gender → personality): fill the name and pick a
    // gender so the personality cards appear (the villa gates them on gender).
    await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
    await page.evaluate(() => {
      const n = document.querySelector('#player-name');
      if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
      if (!document.querySelector('.identity-gender-chip.selected')) document.querySelector('.identity-gender-chip')?.click();
    });
    await page.waitForSelector('#screen-setup.active .pick-card', { timeout: 10000 });
    await audit('setup');
    await page.evaluate(() => document.querySelector('.pick-card')?.click());
    await page.evaluate(() => document.querySelector('#start-run-btn')?.click());

    const deadline = Date.now() + 90000;
    let guard = 0;
    while (Date.now() < deadline && guard++ < 800) {
      if (violations.length > 12) break; // enough evidence; don't drown the report
      const k = await page.evaluate(() => {
        const q = (s) => document.querySelector(s);
        if (q('#screen-ending.active')) return 'ending';
        if (q('#overlay.active')) return 'overlay';
        if (q('#screen-crossroads.active .pick-card')) return 'cross';
        if (q('#screen-game.active .choice-btn.choice-left')) return 'card';
        return 'wait';
      });
      if (k === 'ending') { await audit('ending'); break; }
      if (k === 'overlay') {
        // Wait for the dismiss listener to go live (data-armed) or a gear
        // button to click, instead of racing the fixed arm delay.
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          if (!ov) return true;
          return ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
        }, { timeout: 5000 });
        await audit('overlay');
        await page.evaluate(() => {
          const ov = document.querySelector('#overlay.active');
          (ov?.querySelector('.gear-choices button') || ov)?.click();
        });
      } else if (k === 'cross') {
        await audit('crossroads');
        await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
        await page.waitForTimeout(60);
      } else if (k === 'card') {
        const id = await page.evaluate(() => document.querySelector('.card-context')?.textContent?.slice(0, 44) || '?');
        for (const p of await page.evaluate(auditFn)) violations.push(`card "${id}": ${p}`);
        cardsAudited++;
        await page.evaluate(() => { document.querySelector('.coach')?.remove(); document.querySelector('#screen-game.active .choice-btn.choice-left')?.click(); });
        await page.waitForTimeout(70);
      } else {
        await page.waitForTimeout(80);
      }
    }
    if (cardsAudited < 12) violations.push(`only ${cardsAudited} cards audited — the season did not play out`);
  } catch (e) {
    violations.push(`drive error: ${e.message}`);
  } finally {
    await ctx.close();
  }

  const uniq = [...new Set(violations)];
  if (uniq.length) {
    console.error(`✗ ${tag} ${game.label} @ ${vp.label} (${vp.w}×${vp.h}) — ${uniq.length} violation(s):\n    ${uniq.slice(0, 10).join('\n    ')}`);
    return false;
  }
  console.log(`✓ ${tag} ${game.label} @ ${vp.label} (${vp.w}×${vp.h}): ${cardsAudited} cards audited, invariants hold`);
  return true;
}

// The big-text beat check (INCIDENTS.md #3): drive an odyssey season at the
// 320px floor; at every full-screen set-piece beat, toggle body.big-text on,
// require the beat box's content unclipped horizontally, toggle it back off
// so the season keeps playing under the layout the SIZE pass already gates.
// The landmarks fire in every telling (test/odyssey-landmarks.test.mjs), so
// missing beats means the drive broke — fail loudly, never silently skip.
async function driveBigTextBeatCheck(browser, base) {
  const game = GAMES.find((g) => g.label === 'odyssey');
  const vp = VIEWPORTS.find((v) => v.label === 'iPhone-SE1');
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  await ctx.addInitScript(seedScript(game.ns));
  const page = await ctx.newPage();
  const violations = [];
  let beatsChecked = 0;
  page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));
  try {
    await page.goto(`${base}${game.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('button.btn.primary')?.click());
    await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
    await page.evaluate(() => {
      const n = document.querySelector('#player-name');
      if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
      if (!document.querySelector('.identity-gender-chip.selected')) document.querySelector('.identity-gender-chip')?.click();
    });
    await page.waitForSelector('#screen-setup.active .pick-card', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('.pick-card')?.click());
    await page.evaluate(() => document.querySelector('#start-run-btn')?.click());

    const deadline = Date.now() + 90000;
    let guard = 0;
    while (Date.now() < deadline && guard++ < 800) {
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
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          if (!ov) return true;
          return ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
        }, { timeout: 5000 });
        const beat = await page.evaluate(() => {
          const box = document.querySelector('#overlay.active .sp-beat');
          if (!box) return null;
          const banner = box.querySelector('.sp-beat-banner')?.textContent || '?';
          document.body.classList.add('big-text');
          const m = { banner, sw: box.scrollWidth, cw: box.clientWidth };
          document.body.classList.remove('big-text');
          return m;
        });
        if (beat) {
          beatsChecked++;
          if (beat.sw > beat.cw + 1) violations.push(`big-text beat "${beat.banner}" clipped horizontally (${beat.sw} > ${beat.cw})`);
        }
        await page.evaluate(() => {
          const ov = document.querySelector('#overlay.active');
          (ov?.querySelector('.gear-choices button') || ov)?.click();
        });
      } else if (k === 'cross') {
        await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
        await page.waitForTimeout(60);
      } else if (k === 'card') {
        await page.evaluate(() => { document.querySelector('.coach')?.remove(); document.querySelector('#screen-game.active .choice-btn.choice-left')?.click(); });
        await page.waitForTimeout(70);
      } else {
        await page.waitForTimeout(80);
      }
    }
    if (beatsChecked < 2) violations.push(`only ${beatsChecked} set-piece beats measured — the landmarks did not play out`);
  } catch (e) {
    violations.push(`drive error: ${e.message}`);
  } finally {
    await ctx.close();
  }
  const uniq = [...new Set(violations)];
  if (uniq.length) {
    console.error(`✗ big-text ${game.label} @ ${vp.label} (${vp.w}×${vp.h}) — ${uniq.length} violation(s):\n    ${uniq.slice(0, 10).join('\n    ')}`);
    return false;
  }
  console.log(`✓ big-text ${game.label} @ ${vp.label} (${vp.w}×${vp.h}): ${beatsChecked} set-piece beats unclipped under 1.18× zoom`);
  return true;
}

// The worst-case card pass (INCIDENTS.md #5): the SIZE pass drives seasons
// off random seeds, so a game's single longest card — under its worst chrome
// (hot-streak banner, encore bar, carried chips, set-piece ribbon) — can go
// unaudited for many green runs, and a clipping prompt can reach main. This
// pass is deterministic: it force-deals each pack's longest-prompt cards
// through the app's own resume path (saved run's currentEventId — the smoke
// suite's bard-check precedent) with worst-case run state patched in
// (hotStreak, a banked encore, the pack's carried flags), at the 320px floor,
// and requires the full generic audit to hold on every one.
async function driveWorstCards(browser, base, game, candidates, worstFlags) {
  const vp = VIEWPORTS.find((v) => v.label === 'iPhone-SE1');
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  // Seed ONCE per tab (sessionStorage guard) — the plain seedScript wipes the
  // saved run on every navigation, and this pass reloads to RESUME that run.
  await ctx.addInitScript(`try {
    if (!sessionStorage.getItem('bb_worst_seeded')) {
      sessionStorage.setItem('bb_worst_seeded', '1');
      localStorage.setItem('bigbreak_meta_v1${game.ns}', ${JSON.stringify(JSON.stringify(seedMeta))});
      localStorage.removeItem('bigbreak_run_v1${game.ns}');
    }
  } catch (e) {}`);
  // On every navigation: if a forced card is requested, patch the SAVED run
  // before the app boots (an evaluate-time patch would be clobbered — the app
  // flushes the run to localStorage on pagehide).
  await ctx.addInitScript(`try {
    const id = sessionStorage.getItem('bb_worst_card');
    if (id) {
      const key = 'bigbreak_run_v1${game.ns}';
      const raw = localStorage.getItem(key);
      if (raw) {
        const run = JSON.parse(raw);
        run.currentEventId = id;
        run.pendingChainId = null;
        run.hotStreak = 5;
        run.encore = 1;
        for (const f of ${JSON.stringify(worstFlags)}) if (!run.flags.includes(f)) run.flags.push(f);
        localStorage.setItem(key, JSON.stringify(run));
      }
    }
  } catch (e) {}`);
  const page = await ctx.newPage();
  const violations = [];
  let cardsForced = 0;
  page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));

  // Reach a live dealt card from the current screen (dismissing beats/results).
  const reachCard = async () => {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      const k = await page.evaluate(() => {
        const q = (s) => document.querySelector(s);
        if (q('#overlay.active')) return 'overlay';
        if (q('#screen-game.active .choice-btn.choice-left')) return 'card';
        return 'wait';
      });
      if (k === 'card') return true;
      if (k === 'overlay') {
        await page.waitForFunction(() => {
          const ov = document.querySelector('#overlay.active');
          return !ov || ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
        }, { timeout: 5000 });
        await page.evaluate(() => {
          const ov = document.querySelector('#overlay.active');
          (ov?.querySelector('.gear-choices button') || ov)?.click();
        });
      } else {
        await page.waitForTimeout(80);
      }
    }
    return false;
  };

  try {
    await page.goto(`${base}${game.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await page.evaluate(() => document.querySelector('button.btn.primary')?.click());
    await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
    await page.evaluate(() => {
      const n = document.querySelector('#player-name');
      if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
      if (!document.querySelector('.identity-gender-chip.selected')) document.querySelector('.identity-gender-chip')?.click();
    });
    await page.waitForSelector('#screen-setup.active .pick-card', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('.pick-card')?.click());
    await page.evaluate(() => document.querySelector('#start-run-btn')?.click());
    if (!(await reachCard())) violations.push('never reached a first dealt card');

    for (const cand of candidates) {
      if (violations.length > 10) break;
      await page.evaluate((id) => sessionStorage.setItem('bb_worst_card', id), cand.id);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#screen-title.active', { timeout: 15000 });
      // With a saved run present the primary button is Resume.
      await page.evaluate(() => document.querySelector('button.btn.primary')?.click());
      if (!(await reachCard())) { violations.push(`forced card ${cand.id}: never dealt`); continue; }
      const dealt = await page.evaluate(() => document.querySelector('.card-prompt')?.textContent || '');
      // Token-free sanity that the FORCED card is what we are measuring.
      if (!cand.prompt.includes('{') && dealt.slice(0, 24) !== cand.prompt.slice(0, 24)) {
        violations.push(`forced card ${cand.id}: a different card was dealt`);
        continue;
      }
      cardsForced++;
      for (const p of await page.evaluate(auditFn)) {
        violations.push(`forced card ${cand.id} [prompt ${cand.prompt.length} chars]: ${p}`);
      }
    }
    if (cardsForced < Math.min(3, candidates.length)) {
      violations.push(`only ${cardsForced}/${candidates.length} worst cards force-dealt`);
    }
  } catch (e) {
    violations.push(`drive error: ${e.message}`);
  } finally {
    await ctx.close();
  }
  const uniq = [...new Set(violations)];
  if (uniq.length) {
    console.error(`✗ worst-cards ${game.label} @ 320×568 — ${uniq.length} violation(s):\n    ${uniq.slice(0, 10).join('\n    ')}`);
    return false;
  }
  console.log(`✓ worst-cards ${game.label} @ 320×568: ${cardsForced} longest-prompt cards dealt under worst-case run state, invariants hold`);
  return true;
}

// The version-skew pass: serve a stamp-less stylesheet first (stale cache
// emulation) and require the boot probe to detect the mismatch and heal it.
async function driveSkewHeal(browser, base, expectV) {
  cssMode = { stripHas: false, stripStamp: true };
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  await ctx.addInitScript(seedScript('_love-island'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  let ok = false;
  try {
    await page.goto(`${base}/love-island/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    // The probe swaps the <link> href with ?v=…&heal=…; wait for the healed
    // stylesheet to land and re-expose the stamp.
    await page.waitForFunction(
      (v) => (getComputedStyle(document.documentElement).getPropertyValue('--bb-css-v') || '').replace(/["'\s]/g, '') === v,
      expectV, { timeout: 10000 },
    );
    ok = errors.length === 0;
    if (!ok) console.error(`✗ skew-heal: healed but with page errors:\n    ${errors.join('\n    ')}`);
    else console.log(`✓ skew-heal: stale (stamp-less) stylesheet detected at boot and re-pulled — contract "${expectV}" restored`);
  } catch (e) {
    console.error(`✗ skew-heal: the stale-stylesheet self-heal did not happen (${e.message.split('\n')[0]})`);
  } finally {
    await ctx.close();
    cssMode = { stripHas: false, stripStamp: false };
  }
  return ok;
}

// ---- run everything ----
let failed = 0;

const stamp = checkDeliveryStamp();
if (stamp.errs.length) {
  failed++;
  console.error(`✗ delivery stamp: ${stamp.errs.join('; ')}`);
} else {
  console.log(`✓ delivery stamp present and consistent (css/js contract "${stamp.cssV}")`);
}

const chromium = loadChromium();
if (!chromium) {
  skipUnlessRequired('⚠ Playwright not found — skipping the browser matrix (static delivery checks ran).', { code: failed ? 1 : 0 });
}
let browser;
try { browser = await chromium.launch({ headless: true }); }
catch {
  skipUnlessRequired('⚠ Chromium binary not installed — skipping the browser matrix (static delivery checks ran).', { code: failed ? 1 : 0 });
}

const PORT = 8213;
await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;

// Pass 1 — SIZE: the full viewport matrix, both games, honest CSS.
cssMode = { stripHas: false, stripStamp: false };
if (!ONLY) for (const game of GAMES) {
  for (const vp of MATRIX_VPS) {
    if (!(await driveSeason(browser, base, game, vp, 'matrix'))) failed++;
  }
}

// Pass 1b — TEXT MODE: big-text zooms #app 1.18× (style.css), shrinking every
// card's effective interior. INCIDENTS.md #3's rule — a pack's display face
// must keep the set-piece banner unclipped in every text-size mode — is
// enforced surgically: at each full-screen beat of an odyssey season at the
// 320px floor, flip big-text on, measure the box, flip it back. (A whole
// big-text season is NOT gated yet: the mode has pre-existing vertical-layout
// debt at 320px — buttons below the fold under zoom — which is its own
// remediation, out of this guard's scope.)
if (!ONLY && !(await driveBigTextBeatCheck(browser, base))) failed++;

// Pass 1c — WORST CASE: each pack's longest-prompt cards, force-dealt through
// the app's resume path at the 320px floor under worst-case run state. The
// random-seed SIZE seasons only sometimes catch the single tallest card under
// its heaviest chrome (INCIDENTS.md #5).
{
  const { GAME_PACKS } = await import(new URL('js/packs/registry.js', `file://${root}/`).href);
  // The carried-state flags that put maximum chrome on the HUD, per pack.
  const WORST_FLAGS = { odyssey: ['ody_named', 'ody_fore_bow'] };
  for (const game of GAMES) {
    const pack = GAME_PACKS.find((p) => p.id === game.label);
    if (!pack) { failed++; console.error(`✗ worst-cards: no pack for ${game.label}`); continue; }
    const candidates = pack.events
      .filter((e) => e.prompt)
      .sort((a, b) => (b.prompt.length + (b.context || '').length) - (a.prompt.length + (a.context || '').length))
      .slice(0, 5)
      .map((e) => ({ id: e.id, prompt: e.prompt }));
    if (!(await driveWorstCards(browser, base, game, candidates, WORST_FLAGS[game.label] || []))) failed++;
  }
}

// Pass 2 — ENGINE: legacy engines drop :has() rules; the layout must survive.
cssMode = { stripHas: true, stripStamp: false };
if (!ONLY) for (const game of GAMES) {
  const vp = VIEWPORTS.find((v) => v.label === 'iPhone-SE2'); // shortest mainstream phone
  if (!(await driveSeason(browser, base, game, vp, 'legacy-css'))) failed++;
}
cssMode = { stripHas: false, stripStamp: false };

// Pass 3 — DELIVERY: stale stylesheet must be detected and healed at boot.
if (!ONLY && !stamp.errs.length && !(await driveSkewHeal(browser, base, stamp.cssV))) failed++;

await browser.close();
server.close();
if (failed) {
  console.error(`\n✗ the phone-playability contract is broken (${failed} cell(s)).`);
  process.exit(1);
}
console.log('\n✓ the phone-playability contract holds: every viewport, legacy engines, and stale-CSS delivery.');
