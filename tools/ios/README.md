# iOS (WebKit) compatibility harness

The game was built and QA'd on **iOS first**, then hardened for Android with a
dedicated harness (`tools/android/`). But the **iOS build was never defended by
an automated harness** — and WebKit (the engine of *every* iOS browser and most
in-app WebViews, by App Store rule) has its own set of high-churn, real-world
bugs, the flagship being *double-tap during fast tapping zooms the game and traps
the user zoomed-in*. This harness is the iOS mirror of the Android one: same
`must-pass` / `known-bug` / `manual` contract, adapted to WebKit's constraints.

It drives the **emitted `dist/`** (what actually ships) through Playwright's
**WebKit** under real **iPhone device descriptors** (UA, viewport, DPR, touch,
`isMobile`), so iOS behaviour is reproducible in CI. Its job is twofold:

1. **Guard the core verbs and the R1–R10 wiring** — swipe resolves on touch,
   fast taps aren't dropped, audio unlocks, saves survive, the zoom-defense is
   wired, safe-area/dynamic-viewport/backdrop-prefix CSS is present. Green today,
   must stay green.
2. **Prove-before-fix** — any known iOS bug gets a probe that asserts the
   *correct* behaviour and therefore fails today; when the fix lands it flips
   green and is promoted to a permanent guard. (There are none open right now:
   R1's fix landed with the harness — see below.)

## Run it

```bash
npm run ios              # full iPhone matrix × probes (builds dist/ first)
npm run ios:quick        # iPhone 15 Pro only — fast local loop
node tools/ios/run.mjs --device=iphone-se
node tools/ios/run.mjs --probe=zoom-defense-wired
node tools/ios/run.mjs --strict   # also fail if a known-bug now passes
```

Requires `npm ci` (pulls `playwright`) and the WebKit browser:
`npx playwright install webkit` (CI does this). **If WebKit isn't installed** the
device probes report as `SKIP` with a reason and the static probes still run —
never a false green, never a hard crash.

## How to read the output

| Badge | Meaning | Gates CI? |
|---|---|---|
| `PASS` | regression guard is green | — |
| `FAIL` | **regression** — a must-pass guard broke | **yes, exit 1** |
| `PROVEN` | a known iOS bug reproduced (expected) | no |
| `FIXED?` | a known bug no longer reproduces — **promote it to `must-pass`** | only with `--strict` |
| `SKIP` | can't be proven headless — needs a real device / farm / human | no |

`report.json` (git-ignored) is written each run and uploaded as a CI artifact.

## The device matrix (`devices.mjs`)

- **iPhone 15 Pro** — modern flagship baseline.
- **iPhone 14** — common modern phone.
- **iPhone SE** — narrow 320px CSS width *and* an older iOS-10 UA: the layout
  stress case and the pre-15.4 (no `svh`) fallback case in one device.
- **iPhone 15 Pro (short viewport)** — ~120px shorter, the URL-bar stand-in for
  the state the app first paints in before Safari's toolbar collapses.

## The probes → the requirements they map to

Full risk analysis and the Tier-2/3 owners are in
[`docs/ios-compat.md`](../../docs/ios-compat.md).

### Device regression guards (`must-pass`, WebKit)
| Probe | Asserts |
|---|---|
| `smoke-playthrough` | boots, deals a card, a synthetic-touch swipe resolves it, no console errors (X1, X7) |
| `fast-tap-not-dropped` | a burst of fast taps registers **every** tap (N taps ⇒ N clicks) — the double-tap guard doesn't swallow every second tap (X2, R1/R5) |
| `web-audio-unlocks-on-gesture` | after a tap the `AudioContext` is `running` **or** `resume()` fired (X4, R3a) |
| `run-survives-reload` | an in-progress run round-trips across a reload (X5, R7) |
| `save-export-import-roundtrips` | the whole career exports to a code and imports back intact (R7) |
| `offline-boot-from-cache` | the PWA cold-starts offline from the SW cache (X6) |
| `short-viewport-controls-reachable` | with Safari toolbars visible, card + choice buttons stay on-screen, no horizontal overflow (X3, R2) |
| `ios-install-coachmark-shows` | on iOS-not-standalone the Add-to-Home-Screen coach-mark appears and is dismissible (R7) |

### Static wiring guards (`must-pass`, read the built files)
| Probe | Asserts |
|---|---|
| `zoom-defense-wired` | viewport has NO `user-scalable=no`/`maximum-scale=1` (both entries) but has `width=device-width` + `viewport-fit=cover`; CSS uses `touch-action: manipulation`; a non-passive `touchend` double-tap guard exists; the `gesturestart` block and `visualViewport` "zoom recovery" are **gone** (R1) |
| `dynamic-viewport-units` | full-height surfaces use `svh`/`dvh` with a `vh` fallback (R2) |
| `touch-polish-css` | `-webkit-tap-highlight-color: transparent`, `-webkit-touch-callout: none`, `user-select: none` (R5) |
| `backdrop-filter-prefixed` | every `backdrop-filter` ships a `-webkit-` prefix (R8) |
| `safe-area-insets-used` | `env(safe-area-inset-*)` on **all four** edges — landscape included (R6) |
| `text-size-adjust-reset` | `-webkit-text-size-adjust: 100%` (R9) |
| `audio-resume-handlers-wired` | `statechange` + `visibilitychange` → `resume()` (X4, R3c) |
| `persist-on-hide-wired` | run/meta flushed on `visibilitychange`/`pagehide`; `navigator.storage.persist()` requested (X5) |
| `ios-install-hint-wired` | iOS-not-standalone detection drives the install coach-mark, no dependence on `beforeinstallprompt` (R7) |

### Documented `SKIP`s (need a real device / farm / human — see `docs/ios-compat.md`)
`double-tap-pinch-zoom-actual` (R1), `dvh-live-urlbar-resize` (R2),
`safe-area-notch-landscape` (R6), `real-audio-output-interruptions` (R3a/c),
**`silent-switch-mutes-audio` (R3b, Tier-3 only)**,
`pwa-standalone-a2hs-backgrounding` (R7), `itp-7day-storage-eviction` (R7),
`backdrop-filter-fps-tile-blanking` (R8), `keyboard-visualviewport` (R10),
`landscape-text-autosize-dynamic-type` (R9),
**`in-app-webview-degradation` (R7, Tier-3 only)**.

## WebKit vs Chromium — the porting constraints (do not miss these)

- **Use the WebKit engine** with iPhone descriptors. Playwright's `webkit` is a
  **desktop WebKit build, NOT Safari and NOT iOS** — good for layout/DOM/JS-engine
  and CSS-parse fidelity, useless for the hardware/chrome behaviours (zoom,
  toolbars, GPU, safe-area, audio, standalone, eviction). Those are the `SKIP`s.
- **CDP does not exist on WebKit.** The Android harness gets *trusted* touch via
  `newCDPSession` → `Input.dispatchTouchEvent` — Chromium-only, does not port.
  Here: taps use `page.touchscreen.tap()` (trusted, tap-only); swipes use a
  hand-built `PointerEvent` sequence via `dispatchEvent`. Dispatched events have
  `isTrusted === false`, so they exercise the app's handler logic but **not**
  WebKit's real gesture arbitration (zoom/scroll) — the same fidelity gap the
  Android harness documents as "mouse ≠ touch." Real gesture arbitration is Tier-2.
- **`page.mouse.*` is not a touch substitute** (emits `pointerType:"mouse"`, no
  touch events) — same rule as Android.
- **`isMobile` IS supported on WebKit** (unsupported only on Firefox); pair the
  iPhone descriptors with the WebKit project, which `devices.mjs` does.

## Files

- `harness.mjs` — WebKit launch + iPhone context, trusted-tap / synthetic-swipe
  helpers, and the shared static server / error collector / game actions
  re-exported from `../android/harness.mjs` (single source of truth).
- `devices.mjs` — the iPhone device matrix.
- `probes.mjs` — the probes, each tagged `must-pass` / `known-bug` / `manual`.
- `run.mjs` — the CLI runner + reporting + CI exit contract (with graceful
  WebKit-missing `SKIP`s).
