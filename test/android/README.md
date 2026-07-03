# Android compatibility harness

The game was built and QA'd on **iOS only**. `js/platform.ts` is entirely
iOS-specific (Safari pinch-gesture events, `visualViewport` zoom recovery), and
telemetry shows the cost: on the last pull, **iOS Safari = 7 players / 1575
events (~225 each); Android Chrome = 4 players / 49 events (~12 each)** — Android
players generate ~18× fewer events before they leave. Something on Android is
turning them away.

This harness drives the **emitted `dist/`** (what actually ships) through
Playwright's Chromium under real **Android device descriptors** (UA, viewport,
`deviceScaleFactor`, real touch input), so Android behaviour is reproducible in
CI. Its job is twofold:

1. **Prove the errors before we fix them.** Several probes assert the *correct*
   Android behaviour the game doesn't have yet. They fail today — on purpose —
   which is a repeatable proof of each bug. Fix the game and they flip green.
2. **Guard against regressions.** The rest assert the core verbs still work on
   Android; they're green today and must stay green.

## Run it

```bash
npm run android            # full matrix × probes (builds dist/ first)
npm run android:quick      # Pixel 7 only — fast local loop
node test/android/run.mjs --device=galaxy-s9
node test/android/run.mjs --probe=back-gesture-does-not-exit-game
node test/android/run.mjs --strict   # also fail if a known-bug now passes
```

Requires `npm ci` (pulls `playwright`) and a Chromium: `npx playwright install
chromium` (CI does this; the Claude web sandbox ships one pre-installed).

## How to read the output

| Badge | Meaning | Gates CI? |
|---|---|---|
| `PASS` | regression guard is green | — |
| `FAIL` | **regression** — a must-pass guard broke | **yes, exit 1** |
| `PROVEN` | a known Android bug reproduced (expected) | no |
| `FIXED?` | a known bug no longer reproduces — **promote it to `must-pass`** | only with `--strict` |
| `SKIP` | can't be proven headless — needs a real device / farm | no |

`report.json` (git-ignored) is written each run and uploaded as a CI artifact.

## The probes → the risks they map to

Full risk analysis with citations is in [`docs/android-compat.md`](../../docs/android-compat.md).

### Regression guards (`must-pass` — green today)
| Probe | Asserts |
|---|---|
| `smoke-playthrough` | boots, deals a card, a **real touch-swipe** resolves it, no console errors |
| `touch-action-not-passive-blocked` | the swipe is **not** silently dropped by Android's passive-listener/scroll intervention (Risk 1) and doesn't scroll the page |
| `web-audio-unlocks-on-gesture` | `AudioContext` reaches `running` after a touch gesture (Risk 4) |
| `run-survives-reload` | an in-progress run persists to `localStorage` across a reload (Risk 8) |
| `offline-boot-from-cache` | the PWA cold-starts offline from the service-worker cache (Risk 7) |
| `short-viewport-controls-reachable` | with the URL bar visible (short viewport), the card + choice buttons stay on-screen and there's no horizontal overflow (Risk 2) |
| `back-gesture-does-not-exit-game` | **Risk 3, FIXED.** Android Back closes an overlay / returns to title instead of unloading the PWA — `installBackGuard()` in `js/ui.ts` keeps a trap history entry and intercepts `popstate`. |
| `dvh-has-vh-fallback` | **Risk 2, FIXED.** `style.css` declares a `100vh` fallback before each `100dvh`, so pre-108 Chrome / old WebView still get a height. |
| `requests-persistent-storage` | **Risk 8, FIXED.** `installMobileGuards()` calls `navigator.storage.persist()` so saves survive Android storage pressure. |

### Known bugs (`known-bug` — **failing today = proof**)
| Probe | The bug it proves |
|---|---|
| `accessibility-zoom-not-blocked` | **Risk 5.** `user-scalable=no` in the viewport meta. iOS Safari *ignores* it (invisible to iOS QA); **Android Chrome honours it**, blocking low-vision pinch-zoom — and `js/platform.ts` snaps any zoom back to 1:1. **Left as a known-bug on purpose:** `platform.ts`/`style.css` document the zoom-lock as a deliberate "game always fills the screen" choice, so restoring zoom is a product decision, not a bug fix. |

### Documented `SKIP`s (need a real device / farm — see below)
`urlbar-live-resize`, `edge-swipe-vs-back-gesture`, `backdrop-filter-fps`,
`high-refresh-timing`, `fonts-emoji-textscale`.

## Why real touch, not mouse

`page.mouse.*` emits `pointerType:"mouse"` and does **not** generate touch
events, so it never exercises `touch-action`, passive-listener interventions, or
Android's scroll/pull-to-refresh arbitration — the exact things at issue. The
harness dispatches **trusted CDP touch** (`Input.dispatchTouchEvent`) for swipes
and taps (`harness.mjs → touchSwipe`/`fastTap`). Chromium-only, which is fine:
the Android matrix is all Chromium.

## Headless (this harness) vs. what needs a real device

Emulation is **desktop Chromium with a mobile viewport/UA/touch** — a fast
regression gate, *not* a phone. It cannot reproduce:

- **Live URL-bar resize** — desktop Chromium has no collapsing toolbar, so
  `dvh`/`svh`/`lvh` all equal `vh`. (We approximate with a short-viewport
  profile; the live animated resize needs a real device.)
- **Real GPU** — `backdrop-filter` blur FPS on low-end Android (emulation uses
  SwiftShader).
- **Gesture-nav edge-swipe** conflict with horizontal card swipes.
- **High-refresh (90/120 Hz)** timing, real **audio latency**, real
  **Roboto/Noto** metrics + emoji glyphs + Android large-text/bold-text reflow.

Two ways to close that gap, both documented in `docs/android-compat.md`:

- **Free middle tier** — a real Android **emulator (AVD)** in GitHub Actions via
  [`reactivecircus/android-emulator-runner`](https://github.com/ReactiveCircus/android-emulator-runner),
  driven by Playwright's experimental `_android` (real Chrome-on-Android, real
  URL-bar resize). Good nightly job.
- **Release gate** — a device farm (BrowserStack / Sauce Labs / LambdaTest) on a
  few representative real devices for GPU/FPS, One-UI gesture nav, Samsung
  Internet, and in-app WebView.

## Files

- `harness.mjs` — static server for `dist/`, device launch, trusted-touch
  swipe/tap helpers, error collector, game-aware actions (`startRun`, …).
- `devices.mjs` — the Android device matrix.
- `probes.mjs` — the probes, each tagged `must-pass` / `known-bug` / `manual`.
- `run.mjs` — the CLI runner + reporting + CI exit contract.
