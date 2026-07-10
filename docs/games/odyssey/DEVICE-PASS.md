# Device pass — evidence + the physical-device checklist (Required #4)

Run: `npm run build && node tools/device-pass.mjs` (real headless Chromium
over the built dist/, 2026-07-10). Repeatable on demand; not a CI gate (the
smoke/crowding/mobile-matrix suites gate — this is the deeper, slower
persistence/offline sweep the review demanded).

## Scenario results

| # | Scenario | Result | Evidence |
|---|---|---|---|
| A | Save mid-run → reload → resume → still advances | **PASS** | saved at 3 cards / act 1; resume offered; state identical after resume; run advanced 2 further cards |
| B | Completed run → reload → progression persists | **PASS** | run ended; `runs`, `lp`, `meta.odyssey` (a banked `bow` fragment!) and history identical across reload |
| C | Offline: SW registered from /odyssey/, reload, fonts, playable | **PASS** | SW scope `/`; offline reload reaches the title; pixel font served from cache; a NEW run started and played offline |
| D | Daily isolation, through an actually-played run | **PASS** | personal control run stamps `ody_frag_*` flags; the played daily has none, `daily: true`; meta fragments untouched |
| E | Screenshots at 320/390/430 (title, card, long result) | captured | `device-pass/*.png` (9 shots + the digit-glyph exhibit) |

## What this pass FOUND (both fixed in the same commit)

1. **Offline was silently dead for every game — INCIDENTS #4.** The service
   worker's precache list still named the pre-refactor file layout; 20 of 32
   paths 404'd, `addAll` rejected, the worker never installed — for months,
   while the README promised a PWA. Also: only the music entry ever
   *registered* the worker (love-island deliberately, odyssey by omission).
   Fixed (real paths, per-entry resilient install, per-game offline
   navigation fallback, all three entries register) and rot-proofed by
   `test/sw-core.test.mjs`. Scenario C is the behavioral proof.
2. **Digit legibility: '-2' reads as '-8' at delta-chip size.** The pixel
   font's '2' closes its loop; '5' reads as 'S'
   (`device-pass/digit-glyphs.png`; this document's author misread the
   result-chip screenshot before checking the engine's actual budget).
   Numbers are gameplay-critical. Recorded as a STYLE wart in
   IMPLEMENTATION-PLAN; the fix (clean face or tabular numerals for chip
   numerals only) is a visual-identity call for the human, ticketed with the
   key-art pass. NOT unilaterally restyled here.

Also verified in passing: the fi/fl ligature kill is working (the 320px
result shot renders "Fight"/"fleet" cleanly), and the choice buttons carry a
double-tap guard (`commitSwipe`'s `currentCard` null check) — the wedge our
synthetic clicker hit requires bypassing the pointer pipeline.

## What headless Chromium CANNOT verify — the physical-device checklist

Hand this list to whoever holds real hardware; none of it is automatable
here:

- [ ] **Non-Retina Android rendering** of Pixelify Sans (the emulated pass
      renders at exact device-pixel ratios; a cheap 1× panel does not).
- [ ] **Sustained readability** — three full runs on a phone in one sitting;
      does the pixel body fatigue? (Big-text mode is the escape hatch —
      does anyone find it?)
- [ ] **The digit wart on glass**: at arm's length, is `-2` readable on the
      delta chips, or does the loop close entirely? (See finding 2.)
- [ ] **The capital-C aperture** ("Cut" vs "Out") in real play.
- [ ] **Real touch**: swipe-to-choose feel, double-tap behavior, fat-finger
      accuracy of the two choice buttons at 320px.
- [ ] **True offline** (airplane mode, not DevTools): install to home
      screen, cold-start offline, complete a run. iOS Safari PWA quirks
      (storage eviction, SW lifetime) cannot be emulated in Chromium at all.
- [ ] **iOS Safari specifically** — different engine, different SW rules,
      different font rasterizer; this whole pass ran on Chromium.
- [ ] **Battery/thermal** over a 10-minute session (reduced-motion off).

## Screenshots

`title-{320,390,430}.png` · `card-{320,390,430}.png` ·
`result-{320,390,430}.png` (the long-outcome surface, cap 650) ·
`digit-glyphs.png` (the 2/8 · 5/S exhibit, three sizes).
