// Render the bard chatter AS PLAYED: drive two real seeded odyssey runs in
// Chromium, screenshot each card where the bard actually interjects, and
// stack them so the human sees the variance between seeds (same game, two
// different chatter transcripts). Throwaway verification tool, not a gate.
//
//   npm run build && node tools/render-bard-live.mjs

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const chromium = (() => {
  for (const c of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(c).chromium; } catch { /* keep looking */ }
  }
  return null;
})();
if (!chromium) { console.error('Playwright not found.'); process.exit(1); }

const root = fileURLToPath(new URL('../dist', import.meta.url));
const OUT = fileURLToPath(new URL('../docs/games/odyssey/bard-chatter-shots', import.meta.url));
mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2',
  '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(await readFile(abs));
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const seedMeta = `try {
  localStorage.setItem('bigbreak_meta_v1_odyssey', ${JSON.stringify(JSON.stringify({
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [], successPaths: [],
    firstTimeBonuses: [], best: { fame: 0, lp: 0 }, tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
  }))});
  localStorage.removeItem('bigbreak_run_v1_odyssey');
} catch (e) {}`;

async function captureRun(browser, label) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.addInitScript(seedMeta);
  // Personal runs seed from Math.random() (js/ui/newrun.ts), so each capture
  // is a naturally distinct telling — different flavorSeed, different chatter.
  await page.goto(`${base}/odyssey/`);
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  await page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(t))?.click(), '▶ New Run');
  await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
  await page.evaluate(() => {
    const n = document.querySelector('#player-name');
    if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
    if (!document.querySelector('.identity-gender-chip.selected')) document.querySelector('.identity-gender-chip')?.click();
  });
  await page.evaluate(() => document.querySelector('.pick-card')?.click());
  await page.evaluate(() => document.querySelector('#start-run-btn')?.click());
  await page.waitForSelector('#screen-game.active', { timeout: 15000 });

  const shots = [];
  const deadline = Date.now() + 90000;
  let guard = 0, idx = 0;
  while (Date.now() < deadline && guard++ < 400) {
    const k = await page.evaluate(() => {
      if (document.querySelector('#screen-ending.active')) return 'ending';
      if (document.querySelector('#overlay.active')) return 'overlay';
      if (document.querySelector('#screen-crossroads.active .pick-card')) return 'cross';
      if (document.querySelector('#screen-game.active .choice-btn.choice-left')) return 'card';
      return 'wait';
    });
    if (k === 'ending') break;
    if (k === 'card') {
      // A bard note present on THIS card? Screenshot it.
      const hasNote = await page.$('#screen-game.active .overlay-note.bard-note');
      if (hasNote && shots.length < 3) {
        idx++;
        const path = join(OUT, `live-${label}-${idx}.png`);
        await page.screenshot({ path });
        shots.push(path);
      }
      await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
      await page.waitForTimeout(70);
    } else if (k === 'overlay') {
      await page.waitForFunction(() => { const o = document.querySelector('#overlay.active'); return !o || o.hasAttribute('data-armed') || !!o.querySelector('.gear-choices button'); }, { timeout: 8000 }).catch(() => {});
      await page.evaluate(() => { const o = document.querySelector('#overlay.active'); if (o) (o.querySelector('.gear-choices button') || o).click(); });
    } else if (k === 'cross') {
      await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
      await page.waitForTimeout(60);
    } else await page.waitForTimeout(120);
  }
  await ctx.close();
  console.log(`${label}: captured ${shots.length} bard-note card(s)`);
  return shots;
}

const browser = await chromium.launch();
await captureRun(browser, 'runA');
await captureRun(browser, 'runB');
await browser.close();
server.close();
console.log(`\nshots in ${OUT}`);
