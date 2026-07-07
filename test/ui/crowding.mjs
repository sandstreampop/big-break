// The screen contract, enforced (ADR-0009). Drives real villa seasons in
// headless Chromium at phone viewports and fails if any dealt card breaks
// the three-tier layout:
//   1. the PROMPT is never internally scrolled (clipped text = unreachable);
//   2. both choice buttons sit fully inside the viewport;
//   3. the ambient tiers (HUD + stage) stay inside their height budget;
//   4. compact mode is actually on (no permanent stat rail).
// A future card, pool, or feature that re-crowds the screen turns this red.
//
// Run: npm run build && node test/ui/crowding.mjs

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const chromium = loadChromium();
if (!chromium) {
  skipUnlessRequired('⚠ Playwright not found — skipping UI crowding test.');
}
const root = fileURLToPath(new URL('../../dist', import.meta.url));
if (!existsSync(root)) { console.error('dist/ not found — run `npm run build` first.'); process.exit(1); }

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(await readFile(abs));
  } catch { res.writeHead(404).end(); }
});
const PORT = 8207;
await new Promise((r) => server.listen(PORT, r));

const meta = {
  lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
  successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
  tutorialDone: true, coach: { card: true, result: true },
  settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
};

const AMBIENT_BUDGET = 190; // px: hud strip + stage, per ADR-0009

let browser;
try { browser = await chromium.launch({ headless: true }); }
catch { skipUnlessRequired('⚠ Chromium binary not installed — skipping UI crowding test.', { cleanup: () => server.close() }); }

const VIEWPORTS = [
  { w: 390, h: 844, label: 'iPhone-15-ish' },
  { w: 375, h: 667, label: 'iPhone-SE' },
];

let failed = 0;
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  await ctx.addInitScript(`try {
    localStorage.setItem('bigbreak_meta_v1_love-island', ${JSON.stringify(JSON.stringify(meta))});
    localStorage.removeItem('bigbreak_run_v1_love-island');
  } catch (e) {}`);
  const page = await ctx.newPage();
  const violations = [];
  let cardsChecked = 0, ribbonsSeen = 0, beatsSeen = 0;
  page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));

  await page.goto(`http://127.0.0.1:${PORT}/love-island/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('New Run'))?.click());
  // Identity step first (name → gender → personality): the villa's pick-cards
  // only appear once a gender is chosen.
  await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
  await page.evaluate(() => {
    const n = document.querySelector('#player-name');
    if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
    document.querySelector('.identity-gender-chip')?.click();
  });
  await page.waitForSelector('#screen-setup.active .pick-card', { timeout: 10000 });
  await page.evaluate(() => document.querySelector('.pick-card')?.click());
  await page.evaluate(() => document.querySelector('#start-run-btn')?.click());

  const deadline = Date.now() + 90000;
  let guard = 0;
  while (Date.now() < deadline && guard++ < 700) {
    if (violations.length > 6) break;
    const k = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      if (q('#screen-ending.active')) return 'ending';
      if (q('#overlay.active .sp-beat')) return 'beat';
      if (q('#overlay.active')) return 'overlay';
      if (q('#screen-crossroads.active .pick-card')) return 'cross';
      if (q('#screen-game.active .choice-btn.choice-left')) return 'card';
      return 'wait';
    });
    if (k === 'ending') break;
    if (k === 'beat') {
      beatsSeen++;
      await page.waitForFunction(() => document.querySelector('#overlay.active[data-armed]'), { timeout: 5000 });
      await page.evaluate(() => document.querySelector('#overlay.active')?.click());
    } else if (k === 'overlay') {
      await page.waitForFunction(() => {
        const ov = document.querySelector('#overlay.active');
        if (!ov) return true;
        return ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
      }, { timeout: 5000 });
      await page.evaluate(() => {
        const ov = document.querySelector('#overlay.active');
        (ov?.querySelector('.gear-choices button') || ov)?.click();
      });
    } else if (k === 'cross') {
      await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
      await page.waitForTimeout(60);
    } else if (k === 'card') {
      const audit = await page.evaluate((BUDGET) => {
        const out = { id: document.querySelector('.card-context')?.textContent?.slice(0, 44) || '?', problems: [], ribbon: !!document.querySelector('.set-piece-slim') };
        const prompt = document.querySelector('.card-prompt');
        if (!prompt) { out.problems.push('no prompt element'); return out; }
        if (prompt.scrollHeight > prompt.clientHeight + 2) {
          out.problems.push(`prompt clipped (${prompt.scrollHeight} > ${prompt.clientHeight})`);
        }
        for (const side of ['choice-left', 'choice-right']) {
          const b = document.querySelector('.choice-btn.' + side);
          const r = b?.getBoundingClientRect();
          if (!r || r.bottom > window.innerHeight + 1 || r.top < 0) out.problems.push(`${side} off-screen`);
        }
        const hud = document.querySelector('#hud');
        const stage = document.querySelector('#stage');
        const ambient = (hud?.offsetHeight || 0) + (stage?.offsetHeight || 0);
        if (ambient > BUDGET) out.problems.push(`ambient tiers ${ambient}px > budget`);
        if (document.querySelector('#hud .stat-rail')) out.problems.push('stat rail resident (compact mode off)');
        return out;
      }, AMBIENT_BUDGET);
      cardsChecked++;
      if (audit.ribbon) ribbonsSeen++;
      for (const p of audit.problems) violations.push(`[${vp.label}] ${audit.id}: ${p}`);
      await page.evaluate(() => { document.querySelector('.coach')?.remove(); document.querySelector('#screen-game.active .choice-btn.choice-left')?.click(); });
      await page.waitForTimeout(90);
    } else {
      await page.waitForTimeout(80);
    }
  }

  if (cardsChecked < 20) violations.push(`[${vp.label}] only ${cardsChecked} cards audited — season did not complete`);
  // v3.2: the beat grammar is global — act 1's schedule alone (Day One, the
  // Rival, the first Bombshell, the Graft) plus the Casa text guarantees 5+.
  if (beatsSeen < 5) violations.push(`[${vp.label}] only ${beatsSeen} set-piece beats played — the global beat grammar regressed`);
  if (ribbonsSeen < 1) violations.push(`[${vp.label}] no set-piece ribbon card ever audited`);
  const uniq = [...new Set(violations)];
  if (uniq.length) {
    failed++;
    console.error(`✗ ${vp.label} (${vp.w}×${vp.h}) — ${uniq.length} violation(s):\n  ${uniq.slice(0, 12).join('\n  ')}`);
  } else {
    console.log(`✓ ${vp.label} (${vp.w}×${vp.h}): ${cardsChecked} cards audited (${beatsSeen} beats, ${ribbonsSeen} ribbons) — no clipped prompts, buttons on-screen, tiers in budget`);
  }
  await ctx.close();
}

await browser.close();
server.close();
if (failed) { console.error('\n✗ the screen contract is broken (ADR-0009).'); process.exit(1); }
console.log('\n✓ the screen contract holds on all audited viewports.');
