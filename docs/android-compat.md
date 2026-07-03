# Android compatibility — churn risks, code gaps, and the test harness

## Why this exists

Big Break was built and tested on **iOS only**. Two things say the bill is now
coming due on Android:

1. **The code is iOS-shaped.** `js/platform.ts` is *entirely* iOS-specific —
   Safari `gesturestart/change/end` events, `visualViewport` zoom recovery,
   `apple-mobile-web-app-*` meta tags. There is no Android-facing code anywhere.
2. **Telemetry shows the churn.** Last PostHog pull
   (`telemetry/summary.md`, "Players by device / browser / OS"):

   | device | browser | os | players | events | events/player |
   |---|---|---|---|---|---|
   | Mobile | Mobile Safari | iOS | 7 | 1575 | **~225** |
   | Mobile | Chrome | Android | 4 | 49 | **~12** |
   | Mobile | Facebook Mobile | iOS | 4 | 24 | ~6 |

   Android players produce **~18× fewer events per player** than iOS before they
   leave. Small n, but the direction is stark and consistent with a broken
   first session.

This doc is the prioritized risk register (with citations), the specific gaps
found in our code, and how each maps to the automated harness in
[`test/android/`](../test/android/README.md). Nothing in the game has been
changed yet — the harness **proves** the top bugs first.

> Source-access note: some primary docs (MDN, web.dev, WebKit blog, caniuse)
> are egress-blocked from the research sandbox; version numbers below are from
> vendor/search summaries citing those canonical URLs and should be
> spot-verified against the live pages before acting on a specific minor
> version. The *behavioural* findings are confirmed empirically by the harness.

---

## Risk register (ordered by likely churn impact)

Legend for "harness": ✅ proven/guarded headless · ⚠️ partial (needs real
device for full fidelity) · 📱 device-farm/manual only.

### Tier 1 — session killers

**Risk 1 — Touch-action / passive listeners silently break the swipe.**
Since Chrome 56, touch listeners on document-level nodes are *passive by
default*, so a swipe built on `preventDefault()` can be ignored and the page
scrolls instead. The fix is `touch-action` (declarative). **Our code is
actually OK here**: `#card-area`/`.card` set `touch-action: none`, `html/body`
set `overscroll-behavior: none` + `touch-action: pan-x pan-y`, and swipes use
Pointer Events with `setPointerCapture`. → **Guarded** by
`touch-action-not-passive-blocked` (✅, green — keep it green).

**Risk 2 — Viewport height & the Android URL bar.** `100vh`/`dvh` mis-sizing
pushes the primary controls under Chrome's address bar. **Gap:** `css/style.css`
uses `height:100dvh` **with no fallback**. Android Chrome < 108 (and old system
WebView / Samsung Internet, which lag Chrome) drop the invalid declaration and
`#app` collapses to auto height → broken layout. Older Chrome is far more common
on Android than old Safari is on iOS. → **Proven** by `dvh-has-vh-fallback`
(⚠️ static; live URL-bar resize is 📱). Short-viewport clipping is guarded by
`short-viewport-controls-reachable` (✅).
*Fix sketch:* add a fallback line — `height:100vh; height:100dvh;` — or an
`@supports (height:100dvh)` block.

**Risk 3 — Android Back / edge-swipe.** *(highest-value fix)* Two problems iOS
never has: (a) the hardware/gesture **Back** button, and (b) OS **edge swipes**
claimed for Back. **Gap:** there is **zero History-API integration** in the
codebase (no `pushState`/`popstate` anywhere). Empirically confirmed by the
harness: from an in-progress run, Back navigates the whole PWA away
(`screen-game` → blank page). An Android player who reflexively taps Back to
close an overlay instead **exits the game mid-run**. → **Proven** on every
device by `back-gesture-does-not-exit-game` (✅). Edge-swipe conflict is 📱.
*Fix sketch:* `history.pushState` on run start / overlay open; a `popstate`
handler that closes the overlay or returns a screen instead of unloading.

**Risk 4 — Web Audio unlock on Android.** Both platforms gate audio behind a
gesture; Android latency/route differences bite. **Our code is OK**: audio inits
on first `pointerdown` and `resume()`s on a suspended context. → **Guarded** by
`web-audio-unlocks-on-gesture` (✅). Real latency *feel* is 📱.

### Tier 2 — layout / feel / a meaningful minority

**Risk 5 — `user-scalable=no` blocks accessibility zoom.** iOS Safari *ignores*
`user-scalable=no` (so it was invisible to iOS QA); **Android Chrome honours
it**, so low-vision users can't pinch-zoom. Worse, `js/platform.ts`'s
`visualViewport` recovery actively snaps any zoom back to 1:1 every 250 ms. →
**Proven** by `accessibility-zoom-not-blocked` (⚠️ static; the live recovery
loop is 📱). *Fix sketch:* drop `user-scalable=no`; gate the zoom-recovery loop
so it doesn't fight deliberate accessibility zoom.

**Risk 6 — PWA install / `apple-*` no-ops.** `apple-mobile-web-app-*` tags do
nothing on Android; there's no `beforeinstallprompt` handling, so Android users
get no custom install affordance. Manifest is otherwise decent (`display:
standalone`, `theme_color`, maskable 512 icon). Lower churn; retention drag.
*(Not yet a probe — add a Lighthouse-CI installability gate; see harness README.)*

**Risk 7 — Service worker offline.** Network-first SW; must still cold-start
offline. **OK today** → guarded by `offline-boot-from-cache` (✅).

**Risk 8 — localStorage eviction / lost runs.** Losing a roguelike run is the
genre's worst failure. **Gap:** no `navigator.storage.persist()` request, so
saves are eviction-eligible under Android storage pressure (common on budget
devices). Writes *are* wrapped in try/catch (good). → save-round-trip
**guarded** by `run-survives-reload` (✅); the missing persist() is **proven** by
`requests-persistent-storage` (⚠️ static). *Fix sketch:* call
`navigator.storage.persist()` at boot; consider IndexedDB for the career.

**Risk 9 — CSS/GPU jank (`backdrop-filter`).** `.overlay`/`.mg-box` use
`backdrop-filter: blur(6px)` (prefixed correctly). It's GPU-bound and janks on
cheap Androids during animation. → 📱 `backdrop-filter-fps` (emulation uses
SwiftShader — not representative).

**Risk 10 — Low-end perf & 90/120 Hz.** Swipe fly-out is a CSS transition
(duration-based, so refresh-rate-safe — good). Any JS rAF minigame using
per-frame deltas would run fast at 120 Hz. → 📱 `high-refresh-timing`; audit JS
motion for `timestamp`-delta timing.

### Tier 3 — polish

**Risk 11 — Fonts / emoji / text-scale.** Roboto/Noto metrics differ from SF
Pro; emoji risk glyphs (`●▲■✦`) and labels reflow under Android font-scaling and
can clip HUD pills; missing glyphs show tofu on old Android. → 📱
`fonts-emoji-textscale`.

**Risk 12 — `visualViewport` recovery mis-fires.** On Android the soft keyboard
and the URL bar both fire `visualViewport` resize; the iOS-tuned recovery can
yank the layout. Related to Risk 5; 📱.

---

## Coverage split

| Layer | Where | Catches | In this repo |
|---|---|---|---|
| **A. Headless emulation** | Playwright Chromium + Android descriptors | Risks 1,2(partial),3,4,5(static),7,8 | **`test/android/` — built, wired into `.github/workflows/android.yml`** |
| **B. Real Chrome-on-Android (AVD)** | `reactivecircus/android-emulator-runner` + Playwright `_android` | live URL-bar resize, real touch, gesture insets | documented; recommended nightly |
| **C. Device farm** | BrowserStack / Sauce / LambdaTest | GPU/FPS, One-UI gesture nav, Samsung Internet, WebView, fonts/emoji, high-refresh | documented; release gate |

Layer A runs on every push/PR (separate from the Pages deploy gate — a known
Android bug shouldn't block shipping the iOS-solid game, but an Android
*regression* is loud). See [`test/android/README.md`](../test/android/README.md).

## Current harness result (against `dist/`)

`node test/android/run.mjs` — 5-device matrix:

- **30 PASS** regression guards green across all Android devices, **0 regressions**.
- **4 known bugs PROVEN** (repeatably): `back-gesture-does-not-exit-game`,
  `dvh-has-vh-fallback`, `accessibility-zoom-not-blocked`,
  `requests-persistent-storage`.
- **5 documented SKIPs** requiring a real device / farm.

Recommended fix order by ROI: **Risk 3 (Back button)** → **Risk 2 (dvh
fallback)** → **Risk 8 (persist)** → **Risk 5 (a11y zoom)**. Each has a green
probe waiting to flip once fixed.
