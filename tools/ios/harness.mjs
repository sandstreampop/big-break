// iOS (WebKit) test harness — core plumbing.
//
// Mirrors the Android harness CONTRACT, not its code (per docs/mobile-compat-
// handoff.md §5). The generic pieces — the static dist/ server, the console/page
// error collector, the game-aware `startRun`/`dismissOverlay` actions, the `assert`
// helper, and the ROOT/DIST paths — are shared verbatim from ../android/harness.mjs
// so the two harnesses can never drift on "what counts as an error" or "how you
// start a run." What's WebKit-SPECIFIC lives here:
//
//   - the engine is Playwright's `webkit` (Android uses `chromium`). Playwright's
//     webkit is a DESKTOP WebKit build, NOT Safari and NOT iOS — good for
//     layout/DOM/JS-engine and CSS-parse fidelity, useless for the hardware/chrome
//     behaviors (zoom, toolbars, GPU, safe-area, audio, standalone, eviction).
//     Those are Tier-2/3 (see probes.mjs `manual` + docs/ios-compat.md).
//   - CDP does not exist on WebKit, so the Android trick — `newCDPSession` →
//     Input.dispatchTouchEvent for *trusted* touch — does not port. On WebKit:
//       * taps  → page.touchscreen.tap()  (trusted, but tap-only)
//       * swipe → a hand-built PointerEvent sequence via dispatchEvent
//     Dispatched events are `isTrusted === false`, so they exercise the app's
//     handler logic but NOT WebKit's real gesture arbitration (zoom/scroll) — the
//     same fidelity gap the Android harness documents as "mouse ≠ touch."
//   - `page.mouse.*` is NOT a touch substitute (pointerType:"mouse", no touch
//     events) — same rule as Android.

import { existsSync } from 'node:fs';
import { webkit } from 'playwright';

// Shared, engine-agnostic plumbing — single source of truth with the Android harness.
export {
  serve, collectErrors, startRun, dismissOverlay, assert, ROOT, DIST,
} from '../android/harness.mjs';

// Is the WebKit browser binary actually installed? The browser download is a
// separate step from `npm ci` (CI runs `npx playwright install webkit`), and some
// sandboxes can't fetch it. When it's missing we SKIP the device probes with a
// clear reason rather than hard-failing — the static probes still run. This never
// masks a real failure: only a genuinely-absent binary trips it.
export function webkitAvailable() {
  try { return existsSync(webkit.executablePath()); } catch (e) { return false; }
}

export async function launchBrowser() {
  return webkit.launch({ headless: true });
}

// A fresh context per probe, emulating one iPhone (UA + viewport + DPR + touch +
// isMobile). isMobile IS supported on WebKit (it's unsupported only on Firefox),
// so iPhone descriptors pair correctly with the webkit project.
export async function newDevicePage(browser, device) {
  const ctx = await browser.newContext({ ...device.descriptor });
  const page = await ctx.newPage();
  return { ctx, page };
}

// ---- WebKit touch helpers ----

// A single trusted tap (WebKit's only trusted touch primitive).
export async function tap(page, x, y) {
  await page.touchscreen.tap(x, y);
}

// A burst of fast taps at one point — models one-thumb tapping (overlays,
// minigames) and stresses the double-tap-zoom guard. Trusted taps.
export async function fastTapBurst(page, x, y, count = 6, gapMs = 90) {
  for (let i = 0; i < count; i++) {
    await page.touchscreen.tap(x, y);
    if (gapMs) await page.waitForTimeout(gapMs);
  }
}

// Swipe the card. The card's drag is built on Pointer Events, and WebKit gives
// us neither a trusted swipe nor CDP — so we synthesize a
// pointerdown → pointermove×N → pointerup sequence (pointerType:'touch') on the
// card. CAVEAT: these are isTrusted:false, so this drives the app's drag HANDLER
// but not WebKit's real gesture arbitration — real zoom/scroll behavior is Tier-2.
export async function touchSwipe(page, dir = 'right', opts = {}) {
  const card = page.locator('#card-area .card').first();
  await card.waitFor({ state: 'visible', timeout: 8000 });
  const box = await card.boundingBox();
  const y = box.y + box.height / 2;
  const startX = box.x + box.width / 2;
  const dist = opts.distance ?? box.width * 0.9;
  const endX = dir === 'right' ? startX + dist : startX - dist;
  const steps = opts.steps ?? 12;
  const stepDelay = opts.stepDelay ?? 8;
  await page.evaluate(async ({ startX, endX, y, steps, stepDelay }) => {
    const at = document.elementFromPoint(startX, y);
    const target = (at && at.closest('.card')) || document.querySelector('#card-area .card');
    if (!target) throw new Error('no card element to swipe');
    const fire = (type, x) => target.dispatchEvent(new PointerEvent(type, {
      pointerId: 1, pointerType: 'touch', isPrimary: true,
      clientX: x, clientY: y, bubbles: true, cancelable: true,
    }));
    fire('pointerdown', startX);
    for (let i = 1; i <= steps; i++) {
      fire('pointermove', startX + ((endX - startX) * i) / steps);
      await new Promise((r) => setTimeout(r, stepDelay));
    }
    fire('pointerup', endX);
  }, { startX, endX, y, steps, stepDelay });
  await page.waitForTimeout(150);
}
