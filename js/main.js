import { boot } from './ui.js';

// ---- iOS zoom lockdown (spec §12): the game must always fill the screen ----
// Layer 1: kill Safari's non-standard pinch gesture events.
for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}

// Layer 2: kill double-tap zoom. Preventing default on the second touchend
// also suppresses its native click, so re-dispatch a synthetic click when
// the tap didn't move — otherwise fast tapping (overlays, minigames) would
// silently drop every second tap.
let lastTouchEnd = 0;
let touchDownX = 0;
let touchDownY = 0;
document.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touchDownX = t.clientX;
  touchDownY = t.clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd < 350 && e.cancelable) {
    e.preventDefault();
    const t = e.changedTouches[0];
    const moved = Math.hypot(t.clientX - touchDownX, t.clientY - touchDownY) > 12;
    if (!moved && e.target && e.target.dispatchEvent) {
      e.target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  }
  lastTouchEnd = now;
}, { passive: false });

// Layer 3: recovery. iOS's accessibility override can zoom anyway, and once
// zoomed the page is stuck. Watch the visual viewport and snap back to 1:1
// by re-asserting the viewport meta (rewriting maximum-scale re-clamps).
const vpMeta = document.querySelector('meta[name="viewport"]');
if (window.visualViewport && vpMeta) {
  const baseContent = vpMeta.getAttribute('content');
  let unzoomTimer = 0;
  window.visualViewport.addEventListener('resize', () => {
    if (window.visualViewport.scale <= 1.02) return;
    clearTimeout(unzoomTimer);
    unzoomTimer = setTimeout(() => {
      if (window.visualViewport.scale <= 1.02) return;
      vpMeta.setAttribute('content', baseContent.replace('maximum-scale=1', 'maximum-scale=1.0001'));
      requestAnimationFrame(() => vpMeta.setAttribute('content', baseContent));
    }, 250);
  });
}

// Offline support (PWA): network-first SW, registered post-load so it never
// competes with first paint
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

boot();
