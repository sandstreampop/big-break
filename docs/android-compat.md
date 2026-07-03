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
[`tools/android/`](../tools/android/README.md). Nothing in the game has been
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
pushes the primary controls under Chrome's address bar. **Was:** `css/style.css`
used `height:100dvh` **with no fallback**, so Android Chrome < 108 (and old
system WebView / Samsung Internet, which lag Chrome) dropped the declaration and
`#app` collapsed to auto height. **FIXED:** each `100dvh` now has a `100vh`
fallback line before it. → guarded by `dvh-has-vh-fallback` (✅) +
`short-viewport-controls-reachable` (✅). Live URL-bar resize is still 📱.

**Risk 3 — Android Back / edge-swipe.** Two problems iOS never has: (a) the
hardware/gesture **Back** button, and (b) OS **edge swipes** claimed for Back.
**Was:** **zero History-API integration** — from an in-progress run, Back
navigated the whole PWA away (`screen-game` → blank page), so a reflexive Back
to close an overlay **exited the game mid-run**. **FIXED:** `installBackGuard()`
in `js/ui.ts` keeps a trap `history` entry and intercepts `popstate` — Back now
dismisses an open overlay (running its continue handler) or returns to the title
(the run is saved on every swipe), and only exits from the title. → guarded by
`back-gesture-does-not-exit-game` (✅, all devices). Edge-swipe conflict is 📱.

**Risk 4 — Web Audio unlock on Android.** Both platforms gate audio behind a
gesture; Android latency/route differences bite. **Our code is OK**: audio inits
on first `pointerdown` and `resume()`s on a suspended context. → **Guarded** by
`web-audio-unlocks-on-gesture` (✅). Real latency *feel* is 📱.

### Tier 2 — layout / feel / a meaningful minority

**Risk 5 — `user-scalable=no` blocked accessibility zoom. FIXED.** iOS Safari
*ignores* `user-scalable=no` (so it was invisible to iOS QA); **Android Chrome
honoured it**, so low-vision users couldn't pinch-zoom, and `js/platform.ts`'s
`visualViewport` recovery snapped any zoom back to 1:1. **FIXED (product-approved):**
dropped `user-scalable=no`/`maximum-scale` from the viewport meta, switched
zoom-blocking to `touch-action: manipulation` (keeps swipes, restores deliberate
pinch-zoom), and removed the `visualViewport` recovery. This is the *same* fix as
the iOS double-tap-zoom trap (R1) — see [`docs/ios-compat.md`](./ios-compat.md). →
`accessibility-zoom-not-blocked` flipped `PROVEN → FIXED?` and was **promoted to a
must-pass guard**; the live-zoom feel remains 📱.

**Risk 6 — PWA install / `apple-*` no-ops.** `apple-mobile-web-app-*` tags do
nothing on Android; there's no `beforeinstallprompt` handling, so Android users
get no custom install affordance. Manifest is otherwise decent (`display:
standalone`, `theme_color`, maskable 512 icon). Lower churn; retention drag.
*(Not yet a probe — add a Lighthouse-CI installability gate; see harness README.)*

**Risk 7 — Service worker offline.** Network-first SW; must still cold-start
offline. **OK today** → guarded by `offline-boot-from-cache` (✅).

**Risk 8 — localStorage eviction / lost runs.** Losing a roguelike run is the
genre's worst failure. **Was:** no `navigator.storage.persist()` request, so
saves were eviction-eligible under Android storage pressure (common on budget
devices). **FIXED:** `installMobileGuards()` now calls
`navigator.storage.persist()` at boot (writes were already try/catch-wrapped). →
guarded by `requests-persistent-storage` (✅) + `run-survives-reload` (✅).
*Further hardening (not done):* move the career to IndexedDB for a larger quota.

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
| **A. Headless emulation** | Playwright Chromium + Android descriptors | Risks 1,2(partial),3,4,5(static),7,8 | **`tools/android/` — built, wired into `.github/workflows/android.yml`** |
| **B. Real Chrome-on-Android (AVD)** | `reactivecircus/android-emulator-runner` + Playwright `_android` | live URL-bar resize, real touch, gesture insets | documented; recommended nightly |
| **C. Device farm** | BrowserStack / Sauce / LambdaTest | GPU/FPS, One-UI gesture nav, Samsung Internet, WebView, fonts/emoji, high-refresh | documented; release gate |

Layer A runs on every push/PR (separate from the Pages deploy gate — a known
Android bug shouldn't block shipping the iOS-solid game, but an Android
*regression* is loud). See [`tools/android/README.md`](../tools/android/README.md).

## Current harness result (against `dist/`)

`node tools/android/run.mjs` — 5-device matrix:

- All regression guards green across all Android devices, **0 regressions**.
- **4 bugs fixed and promoted to guards** (Risks 2, 3, 8, and now **5**) — the
  probes that proved them now assert the fix stays in place.
- **0 known bugs still open.** Risk 5 (`accessibility-zoom-not-blocked`) was the
  last one; it landed with the iOS work and was promoted to must-pass.
- **5 documented SKIPs** requiring a real device / farm.

No open product decisions. Risk 5 (accessibility zoom) was **approved and
implemented** — `user-scalable=no`/`maximum-scale` dropped, `touch-action:
manipulation` blocks double-tap-zoom while keeping deliberate pinch-zoom, and the
`visualViewport` recovery is removed. Same fix as iOS R1
([`docs/ios-compat.md`](./ios-compat.md)).
