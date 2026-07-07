// Android test harness — core plumbing.
//
// Why this exists: js/platform.ts and js/ui.ts were written and tested against
// iOS Safari only. This harness drives the *emitted dist/* (what actually
// ships) inside Playwright's Chromium under real Android device descriptors —
// UA, viewport, deviceScaleFactor, and touch input — so Android-specific
// behaviour is reproducible in CI and regressions can't sneak back.
//
// It has NO third-party runtime deps beyond Playwright (declared in
// package.json). The static server below is a ~40-line node:http server so the
// harness never shells out to python and serves modules with the right MIME.

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
export const DIST = join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// A minimal static file server rooted at `dir`. Directory requests resolve to
// index.html so sub-path entries work exactly like the deployed site.
export async function serve(dir = DIST) {
  if (!existsSync(dir)) {
    throw new Error(`dist not found at ${dir} — run "npm run build" first (the harness tests the emitted site, not source).`);
  }
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
      let filePath = join(dir, p);
      // Directory → index.html
      try {
        if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
      } catch { /* fall through to readFile which will 404 */ }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    async close() { await new Promise((r) => server.close(r)); },
  };
}

// Launch a persistent Chromium context emulating one Android device. Persistent
// context is required for real touch emulation with a device descriptor.
export async function launchDevice(chromium, device) {
  const ctx = await chromium.launchPersistentContext('', {
    ...device.descriptor,
    headless: true,
    args: ['--headless=new'],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  return { ctx, page };
}

// Attach console/pageerror collectors. Returns a live array + a filter that
// drops noise we can't control in the sandbox (the PostHog analytics CDN is
// network-blocked here; that failure is already handled gracefully in
// js/analytics.ts and must not be counted as a game error).
export function collectErrors(page) {
  const errors = [];
  const isNoise = (t) =>
    /posthog|i\.posthog\.com|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|net::ERR_/i.test(t) ||
    /Failed to load resource/i.test(t);
  page.on('console', (m) => { if (m.type() === 'error' && !isNoise(m.text())) errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => { if (!isNoise(e.message)) errors.push('pageerror: ' + e.message); });
  return errors;
}

// ---- game-aware interaction helpers ----

// Click the title-screen "Play" button (music pack). Falls back to the first
// button on the title if the label ever changes.
export async function startRun(page) {
  await page.waitForSelector('#screen-title.active', { timeout: 8000 });
  const clicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#screen-title button, #screen-title .btn, #screen-title [role=button]')];
    const play = btns.find((b) => /play/i.test(b.textContent || '')) || btns[0];
    if (!play) return false;
    play.click();
    return true;
  });
  if (!clicked) throw new Error('no Play button on title screen');
  // A run may route through a loadout picker first.
  await page.waitForTimeout(400);
  if (await page.locator('#screen-setup.active').count()) {
    await page.evaluate(() => {
      const c = document.querySelector('#screen-setup .pick-card, #screen-setup button, #screen-setup .btn');
      c && c.click();
    });
    await page.waitForTimeout(400);
  }
}

// Real touch input via the Chrome DevTools Protocol. `page.mouse.*` emits
// pointerType:"mouse" and — critically — does NOT generate touch events, so it
// never exercises touch-action, passive-listener interventions, or Android's
// scroll/pull-to-refresh arbitration. CDP Input.dispatchTouchEvent produces
// browser-level *trusted* touch, which is what a thumb actually does. (Chromium
// only — that's fine, the Android matrix is all Chromium.)
export async function touchSwipe(page, dir = 'right', opts = {}) {
  const card = page.locator('#card-area .card').first();
  await card.waitFor({ state: 'visible', timeout: 8000 });
  const box = await card.boundingBox();
  const y = box.y + box.height / 2;
  const startX = box.x + box.width / 2;
  const dist = opts.distance ?? box.width * 0.9;
  const endX = dir === 'right' ? startX + dist : startX - dist;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
  const steps = opts.steps ?? 10;
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX + ((endX - startX) * i) / steps, y }],
    });
    await page.waitForTimeout(opts.stepDelay ?? 8);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await page.waitForTimeout(150);
}

// A burst of fast taps at (x,y) via trusted CDP touch — models the one-thumb
// tapping minigames and stresses the double-tap-zoom guard in js/platform.ts.
export async function fastTap(page, x, y, count = 6, gapMs = 90) {
  const cdp = await page.context().newCDPSession(page);
  for (let i = 0; i < count; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(gapMs);
  }
  await cdp.detach();
}

// Dismiss a result/info overlay if one is up (tap-to-continue).
export async function dismissOverlay(page) {
  if (await page.locator('#overlay.active').count()) {
    const box = await page.locator('#overlay').boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.85);
    await page.waitForTimeout(200);
  }
}

// ---- assertions ----
export function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}
