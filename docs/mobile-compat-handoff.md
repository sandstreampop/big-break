# Mobile compatibility — engineering handoff (Android done, iOS next)

**Status:** Android tier landed on `main` (harness + 3 fixes). iOS parity is the
open work. **This document is implementation-agnostic on purpose.** A large
refactor is in flight, so file names, function names, and module boundaries
*will* move. What must NOT move is the **goal, the requirements, and the
acceptance criteria** below. Wherever a concrete symbol is named, it is tagged
`(impl, may move)` and is only a pointer to today's code — treat the requirement
as authoritative, not the pointer.

> How to read this: every requirement is written as an **invariant + acceptance
> criteria + verification tier**. If the refactor changes *how* an invariant is
> satisfied, that's fine — re-point the harness probe at the new seam and keep
> the invariant green. If a change would *break* an invariant, it's a churn
> regression and must be caught.

---

## 1. Why this work exists (the durable context)

The game was built and QA'd **iOS-first**, then shipped to Android with zero
Android-specific handling. Telemetry made the cost concrete — on the reference
pull, **iOS Safari ≈ 225 events/player vs Android Chrome ≈ 12** (~18× fewer
events before churn). That triggered the Android hardening pass. The mirror-image
risk is now the point of this handoff: **the iOS build has never been
defended by an automated harness**, and iOS/WebKit has its own set of
high-churn, real-world bugs (documented in §4) — the flagship being *double-tap
during fast tapping zooms the game and traps the user zoomed-in*.

**The mission:** one cross-platform mobile-compat program with **parity between
Android and iOS** — the same class of "does the core verb survive on a real
phone" guarantees on both, each backed by a repeatable harness that (a) guards
the behaviors that work today and (b) **proves a bug reproducibly before anyone
fixes it** ("prove-before-fix").

### What is already DONE (on `main`)
- **Android harness** — Playwright/Chromium under real Android device
  descriptors, trusted-touch gestures, a `must-pass` / `known-bug` / `manual`
  probe contract, and a CI job that gates regressions without blocking the
  deploy. Lives at `tools/android/` `(impl, may move)`. Details:
  [`docs/android-compat.md`](./android-compat.md).
- **Three Android churn bugs fixed** and promoted to regression guards: Back
  button no longer unloads the PWA mid-run; `dvh` has a `vh` fallback; durable
  storage is requested.
- **One Android risk left as a deliberate `known-bug`:** the viewport hard-
  disables zoom (`user-scalable=no`). This is *directly entangled with the iOS
  work* — see the headline requirement R1 below.

### What is OPEN (this handoff)
1. Apply the cross-platform requirements (§3) and iOS-specific requirements (§4)
   to the (refactored) codebase.
2. Build the **iOS testing harness** to match the Android one (§5).
3. ~~Resolve the zoom product decision (R1)~~ **— DONE: APPROVED 2026-07-03
   (§7). Implementation deferred until scheduled.** Fixes an Android *and* an iOS
   churn bug at once.

---

## 2. Principles that outlive the refactor

1. **Test the emitted artifact, not the source.** The harness drives the built
   site (today `dist/`), so what's verified is what ships. A refactor that
   changes the build layout must keep "harness runs against the deployable" true.
2. **Prove-before-fix.** Every known bug gets a probe that asserts the *correct*
   behavior and therefore fails today. That red is the reproducible proof. When
   the fix lands, the probe goes green and is promoted to a permanent regression
   guard. Do not fix a mobile bug without a probe that was red first.
3. **Three verification tiers, and be honest about which one a check belongs to:**
   - **Tier 1 — headless emulation in CI** (fast, every push). Catches logic,
     DOM/CSS invariants, handler wiring, layout at fixed viewports.
   - **Tier 2 — real device / device farm** (nightly / pre-release). The only
     place that reproduces real zoom, real toolbars, real GPU, safe-area, real
     audio, standalone PWA, storage eviction.
   - **Tier 3 — manual checklist** (release gate). The handful of things *no*
     automation can reach (e.g. the iOS ring/silent switch).
   Silent truncation is a lie: if a check can only run in Tier 2/3, it must be
   *marked* as such, never quietly dropped from Tier 1 and presented as covered.
4. **Emulation is a fast regression gate, not a phone.** Neither Chromium-with-a-
   mobile-viewport nor Playwright's WebKit build is a real device. Requirements
   whose failure mode only exists on real hardware MUST have a Tier-2/3 owner.
5. **Parity, not sameness.** Android and iOS need the *same guarantees*; the
   *mechanisms* differ (e.g. trusted touch is CDP on Chromium but not available
   on WebKit — see §5). Mirror the contract, not the code.

---

## 3. Cross-platform requirements (both Android and iOS)

Each is an invariant the product must hold on both platforms. `T1/T2/T3` = the
tier that can actually verify it.

| # | Requirement (invariant) | Acceptance criteria | Verify |
|---|---|---|---|
| X1 | **The core swipe verb survives real touch.** A left/right drag with real (touch, not mouse) input resolves a card; the page does not scroll or rubber-band instead. | Scripted touch drag resolves a card; page scroll offset unchanged; no passive-listener/scroll-intervention warning. | T1 + T2 feel |
| X2 | **Fast tapping never zooms, selects text, flashes a highlight, or drops taps.** A burst of rapid taps in a minigame registers every tap and triggers no zoom, no selection loupe, no tap-highlight, no long-press callout. | Tap-burst registers N taps = N activations; zoom scale stays 1; no text selected. Zoom part is T2. | T1 (drop/wiring) + **T2 (actual zoom)** |
| X3 | **Full-screen layout fits the visible viewport with the browser chrome shown**, and does not clip primary controls under the URL/tool bars or the home indicator / gesture area. | At a short (chrome-visible) viewport, HUD + card + choice controls are within the viewport; no horizontal overflow; safe-area insets respected. | T1 (short viewport) + **T2 (live bar resize, notch)** |
| X4 | **Audio unlocks on a user gesture** and recovers after interruption/backgrounding. | After a synthetic gesture the audio context reaches `running`; a state-change→resume handler exists. Audibility & interruptions are T2/T3. | T1 (wiring) + T3 (audible) |
| X5 | **A run is never lost to navigation or storage.** Hardware/gesture Back does not unload the game mid-run; run state is persisted on every meaningful change and on `visibilitychange`/`pagehide`; durable storage is requested; the app resumes (or cleanly restores) after backgrounding. | Back keeps the app alive (closes overlay / returns a screen); state round-trips across reload; persistence is requested. Eviction/backgrounding are T2. | T1 (logic) + **T2 (eviction, resume)** |
| X6 | **The PWA cold-starts offline** from cache. | With the network offline, a reload boots to a playable screen. | T1 |
| X7 | **No uncaught console/page errors** across a scripted session on either platform's device descriptors. | Zero non-noise console errors / pageerrors through boot + a full swipe. | T1 |
| X8 | **Motion is refresh-rate independent.** Animation speed is driven by elapsed time, not per-frame constants (safe on 60/90/120 Hz). | Code review + timing probe; CSS transitions (duration-based) are inherently safe. | T1 review + T2 |

> Android status for these: X1, X4, X6, X7 are green guards; X5 largely fixed
> (Back + persist); X3 partially guarded (short-viewport) with live-resize on
> T2. iOS must reach the same coverage.

---

## 4. iOS-specific requirements & bug register (the research)

WebKit is the engine of **every** iOS browser and most in-app WebViews (App
Store rules), so "test on iOS Chrome" buys almost nothing Safari doesn't — and
in-app WebViews (Instagram/Facebook) are *worse* (often no service worker,
ephemeral storage, no Add-to-Home-Screen). Prioritized by frequency × churn.

### R1 — Double-tap / pinch zoom trap ⭐ (the flagship iOS bug, and it unifies with the Android zoom decision)

- **Symptom:** During fast tapping, two taps within ~300 ms are read as
  **double-tap-to-zoom**; the full-bleed game jumps to 2–3× zoom centered on the
  thumb, and because there's no scrollable overflow or other text to
  double-tap, the user has **no obvious way back to 1×** one-handed. Many quit.
  This is the user-reported seed bug.
- **Cause:** iOS Safari **deliberately ignores `user-scalable=no` and
  `maximum-scale`** (an accessibility decision since iOS 10) — so the Android-
  style "disable zoom in the meta tag" does **nothing** on iOS. Double-tap-zoom
  is a native gesture unless the element opts out.
- **Requirement:** Fast tapping and card dragging MUST NOT trigger zoom, and the
  user MUST retain accessibility pinch-zoom. The mechanism that actually works
  on iOS is **`touch-action: manipulation`** on tappable/draggable surfaces
  (spec-supported; disables double-tap-zoom while keeping pinch) plus, as
  belt-and-suspenders, a **non-passive** `touchend` guard that `preventDefault`s
  a second tap within the double-tap window. **Do NOT** rely on the viewport
  meta zoom-lock, and **do NOT** try to "recover" from zoom by rewriting the
  viewport meta / poking `visualViewport` — the Visual Viewport API is
  **read-only** (you cannot set zoom), the meta directive is ignored anyway, and
  the recovery hack *fights* a user who is intentionally zooming for
  accessibility.
- **⚠️ This unifies with the open Android decision.** Android's `known-bug`
  (`user-scalable=no` blocks pinch-zoom) and iOS R1 have the **same correct
  fix**: drop `user-scalable=no` / `maximum-scale` from the viewport, switch the
  zoom-blocking mechanism to `touch-action: manipulation`, and remove/soften the
  `visualViewport` "zoom recovery" `(impl: today in the shared mobile guards,
  may move)`. That single change resolves the iOS trap **and** the Android
  accessibility block. It reverses a *documented deliberate* "game always fills
  the screen" choice, so it needs an explicit product sign-off — **but the
  research shows the current approach is counterproductive on iOS**, so this
  should be the recommended default. **Product decision: APPROVED (2026-07-03);
  implementation deferred until scheduled — see §7.**
- **Acceptance:** on a real iPhone, tapping ~5×/s never zooms; pinch-zoom works;
  no stuck-zoom state exists.
- **Verify:** T1 can assert `touch-action: manipulation` is present on tappables
  and the double-tap guard is wired; **the actual "does it still zoom" check is
  Tier-2 real-device only** (headless WebKit has no visual zoom engine — it can
  neither reproduce the bug nor validate the fix).

### R2 — Viewport height & the Safari toolbars
- **Symptom:** bottom controls clipped under Safari's toolbar at rest; layout
  jumps as the URL bar collapses/expands during play.
- **Cause:** `100vh` measures the **large** viewport (bar hidden), so content
  overflows when the bar is shown; `vh` doesn't track the animated bar.
- **Requirement:** full-screen surfaces use **dynamic viewport units** —
  prefer **`svh`** for the play field (never clips, never reflows) with `dvh`
  where live-tracking is wanted, always with a `vh` fallback for pre-15.4 iOS.
  Combine with `viewport-fit=cover` + `env(safe-area-inset-*)` (R6).
- **Verify:** T1 short-viewport clip check + CSS assertion; **live bar-resize
  reflow is T2** (no browser chrome in headless).

### R3 — Web Audio: gesture-unlock, the silent switch, and interruptions
- **R3a Gesture unlock:** context is born `suspended`; must `resume()` inside the
  first gesture. *T1 asserts `running` after a synthetic gesture.*
- **R3b The Ring/Silent hardware switch mutes Web Audio ⭐** (very commonly
  missed): a phone on silent hears **nothing**, even with a correct unlock and
  `state === 'running'`, because iOS routes Web Audio through the ringer channel.
  There is **no API** to detect or override it; the only mitigation is routing
  audio through an inline `<video>`/`<audio>` media element that rides the media
  channel. For an audio-forward game this is large, **invisible** churn (the
  dev's phone is off-silent, so they never see it). **Verify: Tier-3 MANUAL
  ONLY** — a human flips the switch on a real device. Put it on the release
  checklist; it cannot be automated anywhere, device farms included.
- **R3c Interruption/backgrounding:** iOS adds an `'interrupted'` context state
  after calls/Siri/route-change/lock; must `resume()` on `visibilitychange`/
  gesture. *T2 for the real interruption; T1 asserts a state-change handler.*

### R4 — Overscroll / rubber-band hijacking swipes
- **Symptom:** the page bounces (revealing a background-color strip) or a swipe
  is eaten by scroll; `position:fixed` jumps during the bounce.
- **Cause:** elastic overscroll is baked into WebKit; `overscroll-behavior`
  only shipped on iOS ~Safari 16 (version-fluid).
- **Requirement:** lock the app to a fixed full-screen container with scroll
  only where needed; `overscroll-behavior: none` where supported; `touch-action`
  on the card so a vertical drag can't scroll the page; set `html,body`
  background to the app background so any residual bounce doesn't flash.
- **Verify:** T1 asserts CSS/handlers + synthetic drag math; **feel is T2**.

### R5 — Touch polish cluster (amplified by fast tapping)
Requirement: eliminate all of these on game UI (keep normal behavior on real
text inputs like a save-code field): the legacy ~350 ms tap delay (mooted by a
responsive `width=device-width` viewport + `touch-action: manipulation`; drive
actions off `pointerup`/`pointerdown`, not `click`); the `-webkit-tap-highlight-
color` gray flash → `transparent`; the `-webkit-touch-callout` long-press menu →
`none`; text selection / selection-loupe on rapid taps → `user-select: none`;
and `:active` press states not firing without a `touchstart` listener → drive
press state from `pointerdown`. **Verify: mostly T1** (DOM/CSS assertions);
visual confirmation of the flash/loupe is T2.

### R6 — Safe area / notch / Dynamic Island / home indicator
Requirement: `viewport-fit=cover` + `env(safe-area-inset-*)` padding so nothing
hides behind the notch/Dynamic Island (top), home indicator (bottom), or the
**landscape** left/right insets (portrait-only testing misses these). **Verify:
T1 asserts `env(safe-area-inset-*)` is used; correctness is T2** (headless
reports zero insets — no notch).

### R7 — PWA on iOS + storage eviction (save-loss ⭐ for a roguelike)
- **No `beforeinstallprompt` / no install UI:** install is manual Share →
  "Add to Home Screen." Requirement: detect iOS-not-standalone and show a custom
  coach-mark; don't depend on an install event.
- **Standalone traps:** no URL bar ⇒ no back button; out-of-scope links leave
  the app; backgrounded standalone apps are often **cold-reloaded** (in-memory
  state lost). Requirement: keep all navigation in-app (ties to X5); persist run
  state on every change and on `visibilitychange`/`pagehide`.
- **ITP 7-day eviction ⭐:** since 2020, WebKit deletes **all script-writable
  storage** (localStorage, IndexedDB, Cache API, SW regs) after **7 days of
  Safari use without interacting with the site** — first-party included. A
  player returning after a week can find their **save gone**. Home-Screen-
  installed web apps historically get a durability exemption (relaxed further in
  iOS 17.4), and `navigator.storage.persist()` is **reported unavailable/non-
  granting on iOS** (version-fluid — re-verify). Requirement: treat browser-tab
  storage as *ephemeral* — offer **export / cloud save** for anything precious,
  and push Add-to-Home-Screen for players who care about their save.
- **Verify:** logic (persist/restore, in-app nav, install-coach gating) is T1;
  eviction timing, standalone launch, and backgrounded reload are **T2/manual**.

### R8 — Rendering / compositing on older iPhones
- `backdrop-filter` **still requires `-webkit-` prefix** on current Safari
  (version-fluid; ship both) and can't take CSS variables as its value — a
  missing prefix = invisible/opaque panels; it's GPU-expensive and janks on old
  devices. Over-promotion (`will-change`, 3D transforms, many composited layers)
  blows WebKit's tile-memory budget → **blank/black tiles or a full page
  reload** (which compounds the standalone state-loss in R7). SVG filter
  `drop-shadow` flickers/mis-renders on first paint — relevant to the game's SVG
  card art.
- Requirement: ship `-webkit-backdrop-filter` alongside `backdrop-filter`;
  promote only the actively-animating element and un-promote after; prefer
  `box-shadow`/gradients over SVG `drop-shadow` on cards.
- **Verify:** T1 catches a missing prefix / gross screenshot diffs; real GPU
  jank & tile-blanking are **T2 on an older iPhone**.

### R9 — Fonts / text-scaling / emoji
`-webkit-text-size-adjust: 100%` on `html` to stop iPhone **landscape**
text-autosizing from breaking the fixed card layout; prefer inline **SVG** for
load-bearing icons (Apple Color Emoji sizing/baseline is inconsistent and
version-dependent); optionally opt into Dynamic Type. **Verify: T1 asserts the
reset; visual/rotation/Dynamic-Type checks are T2.**

### R10 — On-screen keyboard / visual viewport (save-code entry)
When a text input is focused, the iOS keyboard covers it because the **layout
viewport doesn't resize** (only the visual viewport). Requirement: use
`visualViewport` height/resize to scroll the focused field into view. **Verify:
T2** (no soft keyboard in headless).

---

## 5. iOS testing harness — requirements to match Android

**Goal:** the same two-tier, prove-before-fix contract the Android harness
provides, adapted to WebKit's constraints. Mirror the *contract and probe
shape*, not the code.

### 5.1 Contract to mirror (from the Android harness)
- A runner with a **`must-pass` / `known-bug` / `manual` + PASS/FAIL/PROVEN/
  FIXED?/SKIP** exit contract: a regression in a green guard fails CI; a
  known-bug that still reproduces is reported but does not fail; a known-bug that
  starts passing is flagged "promote to must-pass"; things emulation can't reach
  are explicit `SKIP`s with a reason.
- Runs against the **emitted build**; serves it locally; collects console/page
  errors with a documented noise filter.
- A **device matrix** (a modern iPhone, an older/smaller iPhone, and a short
  "chrome-visible" viewport profile), and a **short-viewport** profile as the
  URL-bar stand-in.
- Lives beside the Android harness in the tooling tree (NOT under any directory
  the unit-test runner auto-discovers — the Android harness had to be moved out
  of `test/` for exactly this reason; keep that lesson).

### 5.2 The porting constraints (do not miss these — they're WebKit-specific)
- **Use the WebKit engine**, with iPhone device descriptors. Playwright's
  `webkit` is a **desktop WebKit build, NOT Safari and NOT iOS** — good for
  layout/DOM/JS-engine and CSS-parse fidelity, useless for the hardware/chrome
  behaviors (zoom, toolbars, GPU, safe-area, audio, standalone, eviction).
- **CDP does not exist on WebKit.** The Android harness gets *trusted* touch via
  `newCDPSession` → `Input.dispatchTouchEvent`; that is **Chromium-only** and
  will not port. On WebKit: taps → `page.touchscreen.tap()` (trusted, but
  tap-only); swipes / double-tap / pinch → hand-built `TouchEvent` sequences via
  `dispatchEvent`. **Caveat:** dispatched events have `isTrusted === false`, so
  they exercise *your handler logic* but not the browser's real gesture
  arbitration (zoom/scroll). Document this fidelity gap in the harness, the same
  way the Android one documents "mouse ≠ touch."
- `page.mouse.*` is **not** a touch substitute (emits `pointerType:"mouse"`, no
  touch events) — same rule as Android.
- **Correction to common lore:** `isMobile` **is** supported on WebKit (it's
  unsupported only on *Firefox*); pair iPhone descriptors with the WebKit
  project. Don't spread a mobile descriptor into Firefox.

### 5.3 Tier 1 — headless WebKit gate in CI (every push). MUST probe:
- Core verbs: boot → deal → **touch-swipe resolves** → no console errors (X1, X7).
- **Fast-tap burst**: N taps ⇒ N activations, no dropped/duplicated taps (X2 wiring).
- **Zoom-defense wiring (not the zoom itself):** `touch-action: manipulation`
  present on tappable/draggable surfaces; double-tap `preventDefault` guard bound
  as non-passive (R1, R5).
- **Audio unlock:** context reaches `running` after a synthetic gesture; a
  state-change→resume handler exists (X4, R3a/c).
- **Save/restore logic:** run persists across reload; export/import round-trips
  (X5, R7 logic).
- **Offline cold-start** from cache (X6).
- **Short-viewport layout:** no clip of HUD/card/controls, no horizontal
  overflow (X3, R2 approximation).
- **Static CSS/DOM invariants** (cheap and high-value): `dvh`/`svh` used with a
  `vh` fallback; `-webkit-backdrop-filter` shipped alongside `backdrop-filter`;
  `-webkit-tap-highlight-color: transparent`; `-webkit-touch-callout: none`;
  `user-select: none` on UI; `-webkit-text-size-adjust: 100%`;
  `env(safe-area-inset-*)` used; viewport meta has `width=device-width` +
  `viewport-fit=cover`; (once R1 is decided) viewport does **not** hard-disable
  zoom (R1–R9 wiring).

### 5.4 Tier 2 — real iOS device / device farm (nightly / pre-release). MUST cover:
Everything headless WebKit cannot reproduce — each is a `SKIP` in Tier 1 with a
pointer here: **actual double-tap/pinch zoom & the stuck-zoom trap** (R1); **live
URL-bar resize / `dvh`/`svh`** and safe-area/notch/home-indicator, **portrait and
landscape** (R2, R6); **real Web Audio** output/latency and interruption recovery
(R3a/c); **PWA standalone / Add-to-Home-Screen**, in-app-WebView degradation, and
**backgrounded state-loss** (R7); **ITP 7-day eviction** save durability (R7);
**GPU compositing / `backdrop-filter` FPS / tile-blanking** on an older iPhone
(R8); **keyboard/visualViewport** save-code entry (R10); landscape text-autosizing
and Dynamic Type (R9).

**Real-device options (pick per budget):** device farms (**BrowserStack / Sauce
Labs / LambdaTest**) give real iPhones for web/Safari + PWA and are the right
home for the SKIP list; as of mid-2025 BrowserStack & LambdaTest also **bridge
Playwright to real iOS Safari** (proprietary, not upstream Playwright). Open-
standards path: **Appium + XCUITest driving Mobile Safari** (`browserName:
Safari`), and **`safaridriver`** (Apple's WebDriver — drives real iOS devices &
the Simulator **since iOS 13**, from a macOS host). A **macOS-runner iOS
Simulator** runs *real* iOS WebKit (engine fidelity for viewport/standalone/CSS)
but still can't do the silent switch, real GPU, or real audio, and costs ~10×
Linux CI — a fidelity bump, not a hardware tier. **Firebase Test Lab is not
usable** for a pure web PWA (native-binary/XCUITest oriented; no "run this URL in
Safari" flow). **Lighthouse's PWA category was removed in 2024** — don't gate on
a PWA score; use a manual manifest/meta checklist, and note Lighthouse runs on
Chromium so it is not an iOS signal.

### 5.5 Tier 3 — manual release checklist (cannot be automated anywhere)
- **Flip the Ring/Silent switch** and confirm audio behavior (R3b) — the single
  most-missed high-churn item; not even device farms or the Simulator can toggle
  it.
- Confirm **audible** sound quality on a real device.
- Open the game inside the **Instagram/Facebook in-app WebView** (no SW /
  ephemeral storage / no A2HS) and confirm graceful degradation + an "Open in
  Safari" nudge.

### 5.6 Probe → tier map (iOS)
| Concern | T1 headless WebKit | T2 real device | T3 manual |
|---|---|---|---|
| Swipe resolves, no JS errors | ✅ (untrusted touch) | ✅ | — |
| Fast-tap not dropped; zoom-guard wired | ✅ | ✅ | — |
| Double-tap/pinch actually blocked; no stuck-zoom | ❌ | ✅ | — |
| dvh/svh + live URL-bar resize | ~ (short vp only) | ✅ | — |
| Safe-area / notch / landscape insets | ❌ (asserts usage) | ✅ | — |
| Audio unlock wiring | ✅ | ✅ | — |
| **Silent switch mutes audio** | ❌ | ❌ | ✅ |
| Real audio output / interruptions | ❌ | ✅ | — |
| PWA standalone / A2HS / backgrounding | ❌ | ✅ | — |
| ITP 7-day save eviction | ❌ | ✅ | — |
| backdrop-filter FPS / tile-blanking | ❌ (asserts prefix) | ✅ | — |
| Keyboard / visualViewport | ❌ | ✅ | — |

### 5.7 Definition of done (iOS harness)
1. A WebKit Tier-1 runner exists with parity to Android's contract, wired into
   CI (separate from the deploy gate — a known iOS bug must not block shipping,
   but an iOS *regression* must go red).
2. Every R-requirement has either a green Tier-1 guard, a red Tier-1 `known-bug`
   probe (prove-before-fix), or an explicit Tier-2/3 `SKIP` with an owner.
3. The Tier-2 device-farm matrix and the Tier-3 manual checklist are documented
   and runnable, with the SKIP list mapped to them.
4. R1's zoom decision is resolved; if approved, the double-tap-zoom fix is in and
   the Android accessibility-zoom `known-bug` flips green at the same time.

---

## 6. Version-fluid facts to re-verify (don't trust stale numbers)
These shifted historically and/or were mis-stated in common lore — confirm
against the *actual target iOS range and current tool versions* during the work:
- `user-scalable=no` / `maximum-scale` **ignored on iOS since iOS 10**; the real
  double-tap fix is **`touch-action: manipulation`** (reliable ~iOS 9.3+).
- Dynamic viewport units (`dvh/svh/lvh`) **Safari 15.4**; `overscroll-behavior`
  on iOS **~Safari 16**; safe-area `env()` **iOS 11**; flex `gap` **iOS 14.5**
  (not 14.1 — that's macOS); Web Push (installed PWA only) **iOS 16.4**.
- `backdrop-filter` **still needs `-webkit-` prefix** on current Safari (some
  sources wrongly say unprefixed shipped in 17 — ship both).
- ITP 7-day script-writable-storage eviction **since 2020**, with the installed-
  web-app durability exemption relaxed in **iOS 17.4**; `navigator.storage.
  persist()` **reported non-granting on iOS** — re-verify.
- Tooling: `isMobile` **is** supported on WebKit (unsupported only on Firefox);
  CDP/`Input.dispatchTouchEvent` is **Chromium-only**; `safaridriver` drives real
  iOS + Simulator **since iOS 13** (macOS host); **Lighthouse PWA category
  removed 2024**; the **Playwright-on-real-iOS-Safari** bridges (BrowserStack Jun
  2025, LambdaTest Jul 2025) are proprietary and 2025-fresh.

## 7. Product decision — RESOLVED: APPROVED (implementation deferred)
**Status: APPROVED by product (2026-07-03). Implementation intentionally NOT
started yet — do not begin the code change until the refactor owner schedules
it.** This section is retained as the decision record.

The approved direction: drop the viewport zoom-lock
(`user-scalable=no`/`maximum-scale`), move zoom-blocking to
`touch-action: manipulation`, and remove the counter-productive `visualViewport`
"zoom recovery." Rationale: it fixes the iOS double-tap trap (R1) *and* the
Android accessibility-zoom block in one move, and the current lock is ignored by
iOS anyway. It reverses the documented "game always fills the screen" intent —
that trade-off was accepted in this approval.

When implementation is scheduled: land the change behind a red `known-bug` probe
first (prove-before-fix), then flip both the iOS R1 guard and the Android
`accessibility-zoom-not-blocked` probe green and promote them. Everything else in
§4 is a bug fix with no such tension.

---

*Sources underpinning this handoff (primary where reachable): WebKit blog
(autoplay policies; "Full Third-Party Cookie Blocking and More" / ITP 7-day cap;
Storage Policy updates; Web Push for Web Apps; WebDriver in iOS 13); Apple
Developer docs (Configuring Web Applications; audio session guide re the silent
switch; Testing with WebDriver in Safari); MDN (viewport meta & `user-scalable`;
`touch-action`; `AudioContext.state`; Visual Viewport API; `text-size-adjust`;
storage eviction); CSS Values & Units L4 and web.dev (dynamic viewport units);
Can I Use (`backdrop-filter`, viewport units, flex `gap`); Playwright docs
(Browsers; Emulation; Touchscreen; Touch events; CDPSession Chromium-only);
BrowserStack / LambdaTest 2025 Playwright-on-iOS announcements; and corroborating
developer write-ups for the real-world pain points (double-tap-zoom trap, silent-
switch muting, standalone reload/state-loss, composited-layer tile blanking).
Version-fluid claims are flagged in §6 and must be re-verified against the target
iOS range.*
