// Device-equivalent verification pass (2026-07 odyssey review, Required #4).
// Drives real headless Chromium through the scenarios a human would run on a
// phone: save mid-run → reload → resume; completed-run progression across
// reload; offline (service worker + font); daily-mode isolation from personal
// meta through an actually-played run; and screenshots of the pixel font at
// 320/390/430px on the known trouble surfaces. Evidence generator, not a CI
// gate (the smoke/crowding/matrix suites gate) — run on demand:
//
//   npm run build && node tools/device-pass.mjs [--shots-dir=path]
//
// Prints PASS/FAIL per scenario, exits non-zero on any FAIL, and writes
// screenshots for the human eye (headless Chromium cannot judge sustained
// readability — see the physical-device checklist in
// docs/games/odyssey/DEVICE-PASS.md).

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
function loadChromium() {
  for (const c of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(c).chromium; } catch { /* keep looking */ }
  }
  return null;
}
const chromium = loadChromium();
if (!chromium) { console.error('Playwright not found.'); process.exit(1); }

const root = fileURLToPath(new URL('../dist', import.meta.url));
if (!existsSync(root)) { console.error('dist/ not found — run `npm run build` first.'); process.exit(1); }

const shotsArg = process.argv.find((a) => a.startsWith('--shots-dir='));
const SHOTS = shotsArg ? shotsArg.split('=')[1] : fileURLToPath(new URL('../docs/games/odyssey/device-pass', import.meta.url));
mkdirSync(SHOTS, { recursive: true });

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    const body = await readFile(abs);
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const NS = '_odyssey';
const URL_ODY = `${base}/odyssey/`;

const seedMeta = (extra = {}) => {
  const meta = {
    lp: 0, lpEarnedTotal: 0, runs: 1, unlockedWall: [], trophies: [],
    successPaths: [], firstTimeBonuses: [], best: { fame: 0, lp: 0 },
    tutorialDone: true, coach: { card: true, result: true },
    settings: { sound: false, music: false, reducedMotion: true, minigames: false, haptics: false, analytics: false },
    ...extra,
  };
  // Init scripts re-run on every navigation (including reload) — guard so
  // the seed applies ONCE per context, or reloads would wipe the very saved
  // run the resume scenario exists to verify.
  return `try {
    if (!localStorage.getItem('__devicepass_seeded')) {
      localStorage.setItem('bigbreak_meta_v1${NS}', ${JSON.stringify(JSON.stringify(meta))});
      localStorage.removeItem('bigbreak_run_v1${NS}');
      localStorage.setItem('__devicepass_seeded', '1');
    }
  } catch (e) {}`;
};

async function clickJS(page, sel, timeout = 10000) {
  await page.waitForSelector(sel, { timeout });
  await page.evaluate((s) => document.querySelector(s)?.click(), sel);
}
async function clickText(page, text, timeout = 10000) {
  await page.waitForFunction((t) => [...document.querySelectorAll('button')].some((b) => b.textContent.includes(t)), text, { timeout });
  await page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(t))?.click(), text);
}
async function enterIdentity(page) {
  await page.waitForSelector('#screen-setup.active #player-name', { timeout: 10000 });
  await page.evaluate(() => {
    const n = document.querySelector('#player-name');
    if (n && !n.value.trim()) { n.value = 'Tester'; n.dispatchEvent(new Event('input', { bubbles: true })); }
    if (!document.querySelector('.identity-gender-chip.selected')) document.querySelector('.identity-gender-chip')?.click();
  });
}
async function startRun(page, { daily = false } = {}) {
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  if (daily) await clickText(page, '📅');
  else await clickText(page, '▶ New Run');
  await page.waitForSelector('#screen-setup.active', { timeout: 10000 });
  await enterIdentity(page);
  await clickJS(page, '.pick-card');
  await clickJS(page, '#start-run-btn');
  await page.waitForSelector('#screen-game.active', { timeout: 15000 });
}
// Advance whatever is up (card / overlay / crossroads) until `pred` holds.
async function driveUntil(page, pred, maxMs = 120000) {
  const deadline = Date.now() + maxMs;
  let guard = 0;
  const tally = { card: 0, overlay: 0, cross: 0, wait: 0, ending: 0 };
  driveUntil.lastTally = tally;
  while (Date.now() < deadline && guard++ < 900) {
    if (await pred()) return true;
    const k = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      if (q('#screen-ending.active')) return 'ending';
      if (q('#overlay.active')) return 'overlay';
      if (q('#screen-crossroads.active .pick-card')) return 'cross';
      if (q('#screen-game.active .choice-btn.choice-left')) return 'card';
      return 'wait';
    });
    tally[k] = (tally[k] || 0) + 1;
    if (k === 'ending') return pred();
    if (k === 'overlay') {
      // Same protocol as the smoke suite: wait until the overlay's dismiss
      // listener is armed (or a gear-choice button exists), then click.
      await page.waitForFunction(() => {
        const ov = document.querySelector('#overlay.active');
        if (!ov) return true;
        return ov.hasAttribute('data-armed') || !!ov.querySelector('.gear-choices button');
      }, { timeout: 8000 }).catch(() => {});
      await page.evaluate(() => {
        const ov = document.querySelector('#overlay.active');
        if (!ov) return;
        (ov.querySelector('.gear-choices button') || ov).click();
      });
    }
    else if (k === 'cross') { await page.evaluate(() => document.querySelector('#screen-crossroads.active .pick-card')?.click()); await page.waitForTimeout(60); }
    else if (k === 'card') {
      // Smoke-suite parity: debounce after the choice click. Without it, a
      // second click can land in the resolve window and open a second result
      // overlay over the first (the INCIDENTS #1 wipe), wedging the run.
      await page.evaluate(() => document.querySelector('#screen-game.active .choice-btn.choice-left')?.click());
      await page.waitForTimeout(60);
    }
    else await page.waitForTimeout(150);
  }
  return pred();
}
const runStore = (page) => page.evaluate((ns) => {
  const raw = localStorage.getItem('bigbreak_run_v1' + ns);
  if (!raw) return null;
  const r = JSON.parse(raw);
  const run = r.run || r;
  return { act: run.act, cards: (run.cardLog || []).length, flags: run.flags || [], daily: !!run.daily, stats: run.stats };
}, NS);
const metaStore = (page) => page.evaluate((ns) => JSON.parse(localStorage.getItem('bigbreak_meta_v1' + ns) || '{}'), NS);

const results = [];
const record = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`  ${ok ? '✓ PASS' : '✗ FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`); };

const browser = await chromium.launch();
console.log('═══ DEVICE PASS — odyssey (headless Chromium) ═══');

// ── Scenario A: save mid-run → reload → resume, then keep playing ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(seedMeta());
  await page.goto(URL_ODY);
  await startRun(page);
  await driveUntil(page, async () => ((await runStore(page))?.cards || 0) >= 3, 60000);
  const before = await runStore(page);
  await page.reload();
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  const offered = await page.evaluate(() => [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Resume Run')));
  await clickText(page, '▶ Resume Run');
  await page.waitForSelector('#screen-game.active, #screen-crossroads.active', { timeout: 15000 });
  const after = await runStore(page);
  const resumed = offered && after && after.cards === before.cards && after.act === before.act;
  const advanced = await driveUntil(page, async () => ((await runStore(page))?.cards || 0) >= before.cards + 2
    || await page.evaluate(() => !!document.querySelector('#screen-ending.active')), 60000);
  record('A · save mid-run → reload → resume → still advances', !!(resumed && advanced),
    `saved at ${before?.cards} cards act ${before?.act}; resume offered=${offered}; resumed identical=${!!resumed}; advanced=${advanced}`);
  await ctx.close();
}

// ── Scenario B: completed-run progression persists across reload ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(seedMeta());
  await page.goto(URL_ODY);
  await startRun(page);
  const ended = await driveUntil(page, () => page.evaluate(() => !!document.querySelector('#screen-ending.active')), 150000);
  if (!ended) {
    console.log('  [B debug] state tally:', JSON.stringify(driveUntil.lastTally));
    console.log('  [B debug] stuck at:', await page.evaluate(() => ({
      active: [...document.querySelectorAll('.screen.active')].map((s) => s.id),
      overlay: !!document.querySelector('#overlay.active'),
      overlayArmed: document.querySelector('#overlay.active')?.hasAttribute('data-armed'),
      overlayText: document.querySelector('#overlay.active')?.textContent?.slice(0, 120),
      card: !!document.querySelector('#screen-game.active .choice-btn.choice-left'),
    })));
  }
  const metaAtEnd = await metaStore(page);
  await page.reload();
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  const metaAfter = await metaStore(page);
  const persisted = ended && metaAfter.runs === metaAtEnd.runs && metaAfter.lp === metaAtEnd.lp
    && JSON.stringify(metaAfter.odyssey || null) === JSON.stringify(metaAtEnd.odyssey || null)
    && (metaAfter.history || []).length === (metaAtEnd.history || []).length;
  record('B · completed run → reload → progression persists', !!persisted,
    `ended=${ended}; runs ${metaAtEnd.runs}→${metaAfter.runs}; lp ${metaAtEnd.lp}→${metaAfter.lp}; odyssey=${JSON.stringify(metaAfter.odyssey || null)}`);
  await ctx.close();
}

// ── Scenario C: offline — service worker installed from /odyssey/, page + font survive a cut ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(seedMeta());
  await page.goto(URL_ODY);
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  const swReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(() => r(null), 8000))]);
    return reg ? reg.scope : 'none';
  });
  // Let the SW's dynamic fetch-caching settle, then cut the network.
  await page.waitForTimeout(1200);
  await ctx.setOffline(true);
  await page.reload();
  const offlineTitle = await page.waitForSelector('#screen-title.active', { timeout: 15000 }).then(() => true).catch(() => false);
  const fontOk = offlineTitle && await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some((f) => f.status === 'loaded');
  });
  const playable = offlineTitle && await (async () => {
    try { await startRun(page); return (await runStore(page)) !== null; } catch { return false; }
  })();
  record('C · offline: SW scope + reload + fonts + playable', !!(swReady && swReady !== 'none' && swReady !== 'unsupported' && offlineTitle && fontOk && playable),
    `sw=${swReady}; offline title=${offlineTitle}; fonts loaded=${fontOk}; run started offline=${playable}`);
  await ctx.setOffline(false);
  await ctx.close();
}

// ── Scenario D: a PLAYED daily inherits no personal progression, and banks none back ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(seedMeta({ odyssey: { fragments: ['bow', 'sea'] } }));
  await page.goto(URL_ODY);
  // Control first: a PERSONAL run stamps the fragment flags.
  await startRun(page);
  const personal = await runStore(page);
  const personalHasFrags = personal.flags.includes('ody_frag_bow') && personal.flags.includes('ody_frag_sea');
  // Abandon → daily.
  await page.reload();
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  await clickText(page, 'New Run (abandon');
  await page.waitForSelector('#screen-setup.active', { timeout: 10000 }).catch(() => {});
  await page.reload();
  await page.waitForSelector('#screen-title.active', { timeout: 15000 });
  await page.evaluate((ns) => localStorage.removeItem('bigbreak_run_v1' + ns), NS);
  await page.reload();
  await startRun(page, { daily: true });
  await driveUntil(page, async () => ((await runStore(page))?.cards || 0) >= 3, 60000);
  const daily = await runStore(page);
  const dailyClean = daily.daily === true && !daily.flags.some((f) => f.startsWith('ody_frag_'));
  const metaAfter = await metaStore(page);
  const metaIntact = JSON.stringify(metaAfter.odyssey?.fragments) === JSON.stringify(['bow', 'sea']);
  record('D · daily played: no inherited fragments; personal control has them; meta intact', !!(personalHasFrags && dailyClean && metaIntact),
    `personal flags ok=${personalHasFrags}; daily flags=${JSON.stringify(daily.flags.filter((f) => f.startsWith('ody_')))}; daily=${daily.daily}; meta=${JSON.stringify(metaAfter.odyssey)}`);
  await ctx.close();
}

// ── Scenario E: screenshots — pixel font at 320/390/430, title + card + long result ──
{
  for (const [w, h, label] of [[320, 568, '320'], [390, 844, '390'], [430, 932, '430']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.addInitScript(seedMeta());
    await page.goto(URL_ODY);
    await page.waitForSelector('#screen-title.active', { timeout: 15000 });
    await page.waitForTimeout(600); // fonts settle
    await page.screenshot({ path: join(SHOTS, `title-${label}.png`) });
    await startRun(page);
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, `card-${label}.png`) });
    // Drive to the first RESULT overlay (the long-outcome surface, cap 650).
    await page.evaluate(() => document.querySelector('.choice-btn.choice-left')?.click());
    await page.waitForSelector('#overlay.active', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, `result-${label}.png`) });
    await ctx.close();
  }
  record('E · screenshots at 320/390/430 (title, card, long result)', true, `9 shots → ${SHOTS}`);
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length ? '✗ ' + failed.length + ' scenario(s) FAILED' : '✓ all scenarios passed'} — evidence + physical-device checklist: docs/games/odyssey/DEVICE-PASS.md`);
process.exit(failed.length ? 1 : 0);
