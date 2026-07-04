// Shared mobile/platform guards, reused by every game entry so mobile behavior
// lives in one place. Import and call `installMobileGuards()` once from an entry
// module. Every guard here is cross-platform (Android + iOS/WebKit); the
// platform-specific reasoning is in docs/android-compat.md and docs/ios-compat.md.

export function installMobileGuards(): void {
  installZoomPolicy();
  installDurableStorage();
  installKeyboardScrollIntoView();
  installIosInstallHint();
}

// ---- R1: zoom policy (fast tapping must not zoom; pinch-zoom must survive) ----
// The mechanism that actually works cross-platform is `touch-action: manipulation`
// on tappable/draggable surfaces (css/style.css) — it disables double-tap-zoom
// while KEEPING accessibility pinch-zoom. We deliberately do NOT:
//   - lock zoom via the viewport meta (maximum-scale/user-scalable): iOS ignores
//     it (a11y decision since iOS 10) and Android honors it, blocking low-vision
//     users. Removed from index.html.
//   - preventDefault Safari's `gesturestart`/`gesturechange` events: that was an
//     iOS zoom lockdown that ALSO killed pinch-zoom. Removed.
//   - "recover" from zoom by rewriting the viewport meta or poking visualViewport:
//     the Visual Viewport API is read-only (you cannot set zoom), the meta
//     directive is ignored on iOS anyway, and it fights a user who is
//     intentionally zooming for accessibility. Removed.
//
// What remains is a belt-and-suspenders double-tap guard: a NON-PASSIVE touchend
// listener that preventDefaults a second single-finger tap inside the ~300ms
// double-tap window, so a burst of fast taps never registers as double-tap-zoom
// even on an engine that lags `touch-action`. It is pinch-safe: it ignores any
// gesture that ever had more than one finger down (a real pinch), so deliberate
// zoom is untouched. Preventing default on that touchend also suppresses its
// synthetic click, so we re-dispatch one for a stationary tap — otherwise fast
// tapping (overlays, minigames) would silently drop every second tap.
function installZoomPolicy(): void {
  let lastTouchEnd = 0;
  let touchDownX = 0;
  let touchDownY = 0;
  let maxTouches = 0;
  document.addEventListener('touchstart', (e) => {
    maxTouches = Math.max(maxTouches, e.touches.length);
    const t = e.changedTouches[0];
    touchDownX = t.clientX;
    touchDownY = t.clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    const singleFinger = maxTouches <= 1;
    if (e.touches.length === 0) maxTouches = 0; // gesture fully lifted — reset
    if (!singleFinger) { lastTouchEnd = now; return; } // never fight a pinch
    if (now - lastTouchEnd < 300 && e.cancelable) {
      e.preventDefault();
      const t = e.changedTouches[0];
      const moved = Math.hypot(t.clientX - touchDownX, t.clientY - touchDownY) > 12;
      if (!moved && e.target && (e.target as any).dispatchEvent) {
        (e.target as any).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }
    lastTouchEnd = now;
  }, { passive: false });
}

// ---- X5/R7: durable saves — ask to survive storage pressure / ITP eviction ----
// A roguelike career lives in localStorage. Android evicts best-effort storage
// under memory pressure; WebKit's ITP deletes all script-writable storage after
// 7 days of no interaction (home-screen-installed apps get a durability
// exemption). Requesting persistence makes the origin exempt where the browser
// grants it (writes are already try/catch-wrapped in js/save.ts). Note: on iOS
// `persist()` is reported non-granting for browser tabs — export/A2HS remain the
// real durability path for a precious save (see docs/ios-compat.md R7).
function installDurableStorage(): void {
  try { navigator.storage?.persist?.().catch(() => {}); } catch (e) { /* older browsers */ }
}

// ---- R10: keyboard / visual viewport (save-code entry) ----
// When a text input is focused, the iOS keyboard covers it because the layout
// viewport doesn't resize (only the visual viewport). Nudge the focused field
// into view. The real behavior is Tier-2 (no soft keyboard in headless); this is
// the cheap, safe wiring. Normal text inputs (the save-code field) keep their
// native behavior — this only scrolls, never blocks.
function installKeyboardScrollIntoView(): void {
  document.addEventListener('focusin', (e) => {
    const t = e.target as HTMLElement | null;
    if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA')) return;
    setTimeout(() => { try { t.scrollIntoView({ block: 'center' }); } catch (err) {} }, 250);
  });
}

// ---- R7: iOS "Add to Home Screen" coach-mark ----
// iOS has no `beforeinstallprompt` / install UI — installation is a manual
// Share → "Add to Home Screen". A tab-scoped save is ephemeral (ITP 7-day
// eviction), so players who care about their run should install. Show a one-time,
// dismissible coach-mark ONLY when we're on iOS Safari and NOT already
// standalone. Never depends on an install event.
function installIosInstallHint(): void {
  const ua = navigator.userAgent || '';
  const isIOS = /iP(hone|od|ad)/.test(ua)
    || (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1); // iPadOS 13+ reports as Mac
  if (!isIOS) return;
  const standalone = (navigator as any).standalone === true
    || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  if (standalone) return;
  // In-app WebViews (Instagram/Facebook) can't Add-to-Home-Screen at all — the
  // right nudge there is "Open in Safari" (see docs/ios-compat.md R7 / Tier-3).
  const inAppWebView = /(FBAN|FBAV|Instagram|Line|GSA)/i.test(ua);
  let dismissed = false;
  try { dismissed = localStorage.getItem('bb_a2hs_hint_v1') === 'dismissed'; } catch (e) {}
  if (dismissed) return;
  const build = () => {
    if (document.querySelector('.ios-install-hint')) return;
    const hint = document.createElement('div');
    hint.className = 'ios-install-hint';
    hint.innerHTML = inAppWebView
      ? `<span>For a save that lasts, open in <b>Safari</b> — then tap Share and “Add to Home Screen”.</span>`
      : `<span>Tap Share <b>&#x2191;</b> then <b>“Add to Home Screen”</b> — keeps your run and plays full-screen.</span>`;
    const close = document.createElement('button');
    close.className = 'ios-install-x';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '✕';
    const dismiss = () => {
      hint.remove();
      try { localStorage.setItem('bb_a2hs_hint_v1', 'dismissed'); } catch (e) {}
    };
    close.addEventListener('click', dismiss);
    hint.appendChild(close);
    document.body.appendChild(hint);
  };
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build, { once: true });
}

// Register the offline service worker (network-first), post-load so it never
// competes with first paint. `swPath` lets each game point at its own SW (or
// skip it by not calling this).
export function registerServiceWorker(swPath = './sw.js'): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swPath).catch(() => {});
    });
  }
}
