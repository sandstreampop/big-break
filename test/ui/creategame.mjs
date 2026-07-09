// createGame on a BARE page — the outside-embedder contract, driven for real.
// The shipped games carry the screen scaffold in their HTML; an outside user
// following the docs gets a page with ONE stylesheet link and a five-line
// module script. This boots exactly that page (served virtually over dist/)
// with the zero-presenter probe pack, then plays it to a terminal screen —
// so "createGame({ pack }).start() gives you a playable game" is a tested
// claim, not a docs promise. Verifies, in one pass:
//   • ensureScaffold builds the shell's DOM contract on an empty <body>
//   • a pack with NO presenter renders on the shell's neutral fallbacks
//   • an invalid pack is REJECTED by start() before any UI exists
//
// Run: npm run build && node test/ui/creategame.mjs
// (own port — the browser suites bind fixed ports and must not run in parallel)

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skipUnlessRequired } from './require-browser.mjs';

const require = createRequire(import.meta.url);
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
  skipUnlessRequired('⚠ Playwright not found — skipping createGame embed test.');
}

const root = fileURLToPath(new URL('../../dist', import.meta.url));
if (!existsSync(root)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// The bare page an embedder writes, per the docs: one stylesheet, one module
// script, empty body. Also exposes a broken-pack path for the rejection test.
const BARE_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Bare embed</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <script type="module">
    import { createGame } from '/js/api.js';
    import { probePack } from '/js/packs/probe.js';
    window.__rejectInvalid = async () => {
      const broken = { id: 'broken' };
      const game = createGame({ pack: broken });
      try { await game.start(); return 'started (BUG)'; }
      catch (e) { return { ok: game.validation.ok, threw: e.message.slice(0, 80) }; }
    };
    const game = createGame({ pack: probePack });
    window.__validation = game.validation;
    await game.start();
    window.__started = true;
  </script>
</body>
</html>
`;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/bare.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(BARE_PAGE);
      return;
    }
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

const PORT = 8221; // own port — smoke=8199, crowding=8207, matrix=8213
async function clickJS(page, sel, timeout = 10000) {
  await page.waitForSelector(sel, { timeout });
  await page.evaluate((s) => document.querySelector(s)?.click(), sel);
}

async function main() {
  await new Promise((ok) => server.listen(PORT, ok));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });

  try {
    // Quiet, fast, deterministic settings for the probe's namespace (mirrors
    // the smoke suite's seed): no sound, reduced motion, analytics off — an
    // embed test must not attempt external requests.
    await page.addInitScript(() => {
      const meta = {
        lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
        successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
        tutorialDone: true, coach: { card: true, result: true },
        settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
      };
      try {
        localStorage.setItem('bigbreak_meta_v1_probe', JSON.stringify(meta));
        localStorage.removeItem('bigbreak_run_v1_probe');
      } catch {}
    });
    await page.goto(`http://localhost:${PORT}/bare.html`);

    // 1. The bare page boots: scaffold built, validation ran, title is up.
    await page.waitForFunction(() => window.__started === true, null, { timeout: 15000 });
    const validation = await page.evaluate(() => window.__validation);
    if (!validation.ok) throw new Error('probe pack failed validation at createGame');
    await page.waitForSelector('#screen-title.active', { timeout: 10000 });
    const scaffold = await page.evaluate(() => ({
      screens: document.querySelectorAll('#app section.screen').length,
      overlay: !!document.querySelector('#overlay'),
      overlayTop: !!document.querySelector('#overlay-top'),
    }));
    if (scaffold.screens < 9 || !scaffold.overlay || !scaffold.overlayTop) {
      throw new Error(`scaffold incomplete: ${JSON.stringify(scaffold)}`);
    }

    // 2. An invalid pack is rejected before any boot.
    const rejection = await page.evaluate(() => window.__rejectInvalid());
    if (rejection === 'started (BUG)' || rejection.ok !== false) {
      throw new Error(`invalid pack was not rejected: ${JSON.stringify(rejection)}`);
    }

    // 3. Play the zero-presenter pack to a terminal screen (the flow rule:
    // presence isn't behaviour — the embedded game must actually END).
    await clickJS(page, 'button.btn.primary');
    await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
    await page.evaluate(() => {
      const n = document.querySelector('#player-name');
      if (n && !n.value.trim()) { n.value = 'Embedder'; n.dispatchEvent(new Event('input', { bubbles: true })); }
      document.querySelector('.identity-gender-chip')?.click();
    });
    await clickJS(page, '.pick-card');
    await clickJS(page, '#start-run-btn');

    // Fixed-cadence driver (the swipe fly-out and the overlay's delayed
    // dismiss listener both swallow too-eager clicks): read the state every
    // 400ms and take exactly one action. A probe run is ~25 actions.
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
      if (errors.length) break;
      await page.waitForTimeout(400);
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
        await page.evaluate(() => document.querySelector('#overlay.active')?.click());
      } else if (k === 'cross') {
        await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click());
      } else if (k === 'card') {
        await page.evaluate(() => document.querySelector('.choice-btn.choice-left')?.click());
      }
    }

    const ended = await page.$('#screen-ending.active');
    if (errors.length) throw new Error(`page errors:\n  ${errors.join('\n  ')}`);
    if (!ended) throw new Error('embedded probe run never reached a terminal screen');

    console.log('✓ createGame embed: bare page + probe pack → scaffold built, invalid pack rejected, run played to a terminal screen, no page errors');
  } catch (e) {
    console.error(`✗ createGame embed: ${e.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

main();
