# iOS / WebKit compatibility — churn risks, fixes, and the test harness

## Why this exists

Big Break was built and QA'd **iOS-first**, then hardened for Android (see
[`docs/android-compat.md`](./android-compat.md) + `tools/android/`). But the iOS
build itself was **never defended by an automated harness** — and WebKit (the
engine of *every* iOS browser and most in-app WebViews, by App Store rule) has
its own high-churn bugs. This is the iOS half of the one cross-platform
mobile-compat program described in
[`docs/mobile-compat-handoff.md`](./mobile-compat-handoff.md): **parity with
Android** — the same "does the core verb survive on a real phone" guarantees,
each backed by a repeatable harness (`tools/ios/`, [README](../tools/ios/README.md)).

> Source-access note: the version-fluid facts below (iOS feature versions, ITP
> timing, tool support) are the ones flagged in the handoff §6 and should be
> re-verified against the *actual target iOS range* and current tool versions
> before acting on a specific minor version. The behavioural findings are what
> the harness guards.

## The three verification tiers

- **Tier 1 — headless WebKit in CI** (`tools/ios/`, every push). Logic, DOM/CSS
  invariants, handler wiring, layout at fixed viewports. Fast regression gate,
  **not a phone**: Playwright's `webkit` is desktop WebKit, so it can't reproduce
  real zoom, toolbars, GPU, safe-area, audio, standalone, or eviction.
- **Tier 2 — real iOS device / device farm** (nightly / pre-release). The only
  place that reproduces the hardware/chrome behaviours. See the matrix below.
- **Tier 3 — manual release checklist**. The handful of things *no* automation
  can reach (the Ring/Silent switch; audible quality; in-app WebViews). Below.

Silent truncation is a lie: every requirement below is either a **green Tier-1
guard**, or an explicit **Tier-2/3 `SKIP`** with a named owner. Nothing that can
only run on hardware is quietly dropped and presented as covered.

---

## Risk register (ordered by likely churn impact)

Legend for "harness": ✅ green Tier-1 guard · 🔧 fixed + guarded · ⚠️ Tier-1
asserts the wiring, real behaviour is Tier-2 · 📱 Tier-2 device/farm · 🙋 Tier-3
manual only.

### R1 — Double-tap / pinch-zoom trap ⭐ (the flagship, FIXED)
- **Symptom:** during fast tapping, two taps within ~300 ms read as
  double-tap-to-zoom; the full-bleed game jumps to 2–3× centered on the thumb and
  there's no obvious one-handed way back to 1×. Many quit.
- **Cause:** iOS Safari **ignores `user-scalable=no`/`maximum-scale`** (an
  accessibility decision since iOS 10), so the Android-style meta zoom-lock does
  nothing on iOS. Double-tap-zoom is native unless the element opts out.
- **Fix (product-approved, handoff §7):** dropped `user-scalable=no`/`maximum-scale`
  from the viewport meta (`index.html`, `mystery.html`); moved zoom-blocking to
  **`touch-action: manipulation`** on tappable/draggable surfaces (`css/style.css`),
  which disables double-tap-zoom while **keeping accessibility pinch-zoom**; added
  a belt-and-suspenders **non-passive `touchend`** guard that `preventDefault`s a
  second single-finger tap in the double-tap window (`js/platform.js`, pinch-safe);
  and **removed** both the `gesturestart`/`gesturechange` block and the
  `visualViewport` "zoom recovery" (the Visual Viewport API is read-only — you
  cannot set zoom — and the recovery hack fought a user zooming for accessibility).
  This single change fixes the iOS trap **and** the Android accessibility-zoom
  block; the Android `accessibility-zoom-not-blocked` probe flipped green and was
  promoted to `must-pass` at the same time.
- **Harness:** 🔧 Tier-1 `zoom-defense-wired` (static) + `fast-tap-not-dropped`
  (device) guard the wiring; the **actual** "does it still zoom / is there a stuck
  state" check is 📱 `double-tap-pinch-zoom-actual` (headless WebKit has no visual
  zoom engine — it can neither reproduce nor validate the fix).

### R2 — Viewport height & the Safari toolbars
- **Symptom:** bottom controls clipped under the toolbar at rest; layout jumps as
  the URL bar collapses/expands during play.
- **Cause:** `100vh` measures the **large** viewport (bar hidden), so content
  overflows when the bar is shown; `vh` doesn't track the animated bar.
- **Fix:** the play field (`#app`) uses **`100svh`** (the small viewport — never
  clips under the toolbar, never reflows as it animates) with a **`100vh`
  fallback** for pre-15.4 iOS. Combined with `viewport-fit=cover` +
  `env(safe-area-inset-*)` (R6).
- **Harness:** ✅ Tier-1 `dynamic-viewport-units` (static) +
  `short-viewport-controls-reachable` (device approximation); live animated
  bar-resize reflow is 📱 `dvh-live-urlbar-resize`.

### R3 — Web Audio: gesture-unlock, the silent switch, interruptions
- **R3a Gesture unlock:** context is born `suspended`; must `resume()` inside the
  first gesture (`initAudio` on first `pointerdown`, `js/ui.js`/`js/audio.js`). ⚠️
  Tier-1 `web-audio-unlocks-on-gesture` proves the unlock path fires; real output
  is 📱 `real-audio-output-interruptions`.
- **R3b The Ring/Silent switch mutes Web Audio ⭐** — a phone on silent hears
  **nothing** even with a correct unlock, because iOS routes Web Audio through the
  ringer channel. **No API** detects or overrides it; the only mitigation is
  routing audio through an inline media element. For an audio-forward game this is
  large, *invisible* churn (the dev's phone is off-silent). 🙋 **Tier-3 manual
  only** — `silent-switch-mutes-audio`, on the release checklist. Not even device
  farms or the Simulator can toggle it.
- **R3c Interruption/backgrounding:** iOS adds an `'interrupted'` state after
  calls/Siri/route-change/lock; we `resume()` on `statechange` and on
  `visibilitychange` (`js/audio.js`). ⚠️ Tier-1 `audio-resume-handlers-wired`
  asserts the handlers; the real interruption is 📱.

### R4 — Overscroll / rubber-band hijacking swipes
- **Cause:** elastic overscroll is baked into WebKit; `overscroll-behavior` only
  shipped ~Safari 16.
- **Fix:** the app is a fixed full-screen container; `html, body` set
  `overscroll-behavior: none`; `#card-area`/`.card` set `touch-action: none` so a
  vertical drag can't scroll the page; `html`/`body` background is the app
  background so any residual bounce doesn't flash a strip.
- **Harness:** ✅ covered by the CSS assertions + the swipe device probe; feel is 📱.

### R5 — Touch polish cluster (amplified by fast tapping)
- **Fix:** the legacy ~350 ms tap delay is mooted by `width=device-width` +
  `touch-action: manipulation`, and actions run off pointer events, not a delayed
  `click`; `-webkit-tap-highlight-color: transparent`; `-webkit-touch-callout:
  none`; `user-select: none` on UI (real text inputs like the save-code field keep
  normal behaviour); `:active` press states fire because the drag uses pointer
  events.
- **Harness:** ✅ Tier-1 `touch-polish-css` (static) + `fast-tap-not-dropped`;
  visual confirmation of the flash/loupe is 📱.

### R6 — Safe area / notch / Dynamic Island / home indicator
- **Fix:** `viewport-fit=cover` + `env(safe-area-inset-*)` padding on **all four**
  edges (top, bottom, **and left/right for landscape** — portrait-only testing
  misses these). `--safe-left`/`--safe-right` vars in `css/style.css`.
- **Harness:** ✅ Tier-1 `safe-area-insets-used` asserts all four edges; real notch
  correctness (portrait + landscape) is 📱 `safe-area-notch-landscape` (headless
  reports zero insets).

### R7 — PWA on iOS + storage eviction (save-loss ⭐ for a roguelike)
- **No `beforeinstallprompt`:** install is manual Share → "Add to Home Screen." We
  detect **iOS-not-standalone** and show a custom, dismissible coach-mark
  (`installIosInstallHint`, `js/platform.js`) — never depending on an install
  event. In-app WebViews get an "Open in Safari" variant.
- **Standalone traps:** no URL bar ⇒ no Back button; backgrounded standalone apps
  are often cold-reloaded (in-memory state lost). We keep all navigation in-app
  (the Back guard, `installBackGuard`) and persist run/meta on every change **and**
  on `visibilitychange`/`pagehide` (`installPersistOnHide`).
- **ITP 7-day eviction ⭐:** WebKit deletes **all script-writable storage**
  (localStorage, IndexedDB, Cache, SW regs) after 7 days of Safari use without
  interacting with the site. Home-screen-installed apps get a durability exemption
  (relaxed in iOS 17.4), and `navigator.storage.persist()` is reported
  non-granting for browser tabs on iOS (re-verify). We request `persist()`
  anyway, treat tab storage as **ephemeral**, and offer **export/import** for a
  precious career + push Add-to-Home-Screen.
- **Harness:** ✅ Tier-1 `run-survives-reload`, `save-export-import-roundtrips`,
  `ios-install-coachmark-shows`, `persist-on-hide-wired`, `ios-install-hint-wired`,
  and the Back guard (shared with Android). Standalone launch / backgrounded
  reload is 📱 `pwa-standalone-a2hs-backgrounding`; 7-day eviction is 📱
  `itp-7day-storage-eviction`; in-app-WebView degradation is 🙋
  `in-app-webview-degradation`.

### R8 — Rendering / compositing on older iPhones
- **Fix:** ship `-webkit-backdrop-filter` alongside `backdrop-filter` (still needs
  the prefix on current Safari — a missing prefix = invisible/opaque panels).
  Prefer `box-shadow`/gradients over SVG `drop-shadow` on cards. Over-promotion
  (`will-change`, 3D transforms, many composited layers) blows WebKit's tile-memory
  budget → blank tiles / a full reload; the actively-animating card is the only
  promoted element.
- **Harness:** ✅ Tier-1 `backdrop-filter-prefixed` catches a missing prefix; real
  GPU jank / tile-blanking is 📱 `backdrop-filter-fps-tile-blanking` on an older iPhone.

### R9 — Fonts / text-scaling / emoji
- **Fix:** `-webkit-text-size-adjust: 100%` on `html` stops iPhone **landscape**
  text-autosizing from breaking the fixed card layout.
- **Harness:** ✅ Tier-1 `text-size-adjust-reset`; landscape autosizing / Dynamic
  Type is 📱 `landscape-text-autosize-dynamic-type`.

### R10 — On-screen keyboard / visual viewport (save-code entry)
- **Fix:** on input focus, `scrollIntoView` nudges the field up (the layout
  viewport doesn't resize under the keyboard — only the visual viewport).
- **Harness:** the real soft-keyboard behaviour is 📱 `keyboard-visualviewport`
  (no soft keyboard in headless); the focusin wiring ships.

---

## Cross-platform requirement status (handoff §3)

| # | Invariant | iOS status |
|---|---|---|
| X1 | Core swipe verb survives real touch | ✅ `smoke-playthrough` (synthetic-pointer swipe; real arbitration 📱) |
| X2 | Fast tapping never zooms/selects/drops taps | ✅ `fast-tap-not-dropped`; actual zoom 📱 |
| X3 | Full-screen fits with chrome shown | ✅ `short-viewport-controls-reachable`; live resize 📱 |
| X4 | Audio unlocks on gesture, recovers after interruption | ⚠️ `web-audio-unlocks-on-gesture` + `audio-resume-handlers-wired`; audible 🙋/📱 |
| X5 | A run is never lost to navigation/storage | ✅ Back guard + `run-survives-reload` + `persist-on-hide-wired`; eviction 📱 |
| X6 | PWA cold-starts offline | ✅ `offline-boot-from-cache` |
| X7 | No uncaught console/page errors | ✅ asserted in `smoke-playthrough` |
| X8 | Motion is refresh-rate independent | ✅ CSS transitions are duration-based (review); JS rAF timing 📱 |

---

## Tier 2 — real iOS device / device-farm matrix (nightly / pre-release)

Everything headless WebKit can't reproduce, each mapped from its Tier-1 `SKIP`:

| Concern (probe) | R | Device profile |
|---|---|---|
| Double-tap/pinch zoom actually blocked, no stuck-zoom (`double-tap-pinch-zoom-actual`) | R1 | any modern iPhone, one-thumb fast tapping |
| Live URL-bar resize svh/dvh reflow (`dvh-live-urlbar-resize`) | R2 | modern iPhone, scroll to collapse/expand the bar |
| Notch / Dynamic Island / home-indicator, **portrait + landscape** (`safe-area-notch-landscape`) | R6 | iPhone 15 Pro (Dynamic Island) + a notch device |
| Real audio output + interruption recovery (`real-audio-output-interruptions`) | R3a/c | any iPhone; take a call / trigger Siri mid-run |
| PWA standalone / A2HS / backgrounded reload (`pwa-standalone-a2hs-backgrounding`) | R7 | installed to Home Screen, then backgrounded |
| ITP 7-day save eviction (`itp-7day-storage-eviction`) | R7 | Safari tab, no visit for 7 days, then return |
| backdrop-filter FPS / tile-blanking (`backdrop-filter-fps-tile-blanking`) | R8 | an **older** iPhone (e.g. iPhone SE / 11) |
| Keyboard / visualViewport save-code entry (`keyboard-visualviewport`) | R10 | any iPhone, focus the import field |
| Landscape text-autosizing / Dynamic Type (`landscape-text-autosize-dynamic-type`) | R9 | any iPhone, landscape + large Dynamic Type |

**Real-device options (pick per budget):**
- **Device farms** — BrowserStack / Sauce Labs / LambdaTest give real iPhones for
  Safari + PWA and are the right home for this list. As of mid-2025 BrowserStack
  & LambdaTest also bridge Playwright to real iOS Safari (proprietary, not upstream
  Playwright).
- **Open-standards** — Appium + XCUITest driving Mobile Safari (`browserName:
  Safari`), and **`safaridriver`** (Apple's WebDriver; drives real iOS devices &
  the Simulator since iOS 13, from a macOS host).
- **macOS-runner iOS Simulator** — runs *real* iOS WebKit (engine fidelity for
  viewport/standalone/CSS) but **still can't** do the silent switch, real GPU, or
  real audio, and costs ~10× Linux CI. A fidelity bump, not a hardware tier.
- **Not usable:** Firebase Test Lab (native-binary/XCUITest oriented; no "run this
  URL in Safari" flow). And **don't gate on a Lighthouse PWA score** — that
  category was removed in 2024, and Lighthouse runs on Chromium (not an iOS signal);
  use the manual manifest/meta checklist below instead.

---

## Tier 3 — manual release checklist (cannot be automated anywhere)

- [ ] **Flip the Ring/Silent switch** and confirm audio behaviour (R3b,
  `silent-switch-mutes-audio`) — the single most-missed high-churn item; not even
  device farms or the Simulator can toggle it.
- [ ] Confirm **audible** sound quality on a real device (R3a).
- [ ] Open the game inside the **Instagram/Facebook in-app WebView** (R7,
  `in-app-webview-degradation`): confirm graceful degradation (no SW / ephemeral
  storage / no A2HS) and that the "Open in Safari" nudge appears.
- [ ] Manifest/meta sanity (replaces the removed Lighthouse PWA score): standalone
  display, theme color, `apple-touch-icon`, `viewport-fit=cover`, no zoom-lock.

---

## Version-fluid facts to re-verify (handoff §6)

- `user-scalable=no`/`maximum-scale` **ignored on iOS since iOS 10**; the real
  double-tap fix is **`touch-action: manipulation`** (reliable ~iOS 9.3+).
- Dynamic viewport units (`dvh/svh/lvh`) **Safari 15.4**; `overscroll-behavior`
  **~Safari 16**; safe-area `env()` **iOS 11**; flex `gap` **iOS 14.5**.
- `backdrop-filter` **still needs `-webkit-`** on current Safari — ship both.
- ITP 7-day script-writable-storage eviction **since 2020**; installed-web-app
  durability exemption relaxed **iOS 17.4**; `navigator.storage.persist()` reported
  **non-granting on iOS** — re-verify.
- Tooling: `isMobile` **is** supported on WebKit (unsupported only on Firefox);
  CDP/`Input.dispatchTouchEvent` is **Chromium-only**; `safaridriver` drives real
  iOS + Simulator **since iOS 13**; **Lighthouse PWA category removed 2024**; the
  Playwright-on-real-iOS-Safari bridges (BrowserStack Jun 2025, LambdaTest Jul
  2025) are proprietary and 2025-fresh.
