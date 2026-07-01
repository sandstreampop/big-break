# BIG BREAK

*A satirical, swipe-left/right music-career roguelike for mobile web.*

You're a nobody with an almost-useless instrument. Swipe your way from a damp
garage to one of three summits of the music industry — Megastar, Studio
Legend, or Hit Factory — while the industry does everything it can to grind
you into content. A full run takes 5–10 minutes. Failing is frequent and
funny; Legacy Points persist across runs and unlock new instruments, gear,
and event packs on the Career Wall.

**Play it:** open the deployed URL on your phone (portrait). Swipe the card
left/right, or use the buttons. The colored dot next to each choice is a
vague risk tell — green is safe, red can go badly, purple glows when a big
upside is in reach. Watch the 🔥 Burnout bar: hit 100 and you quit music to
do UX for a fintech.

## Running locally

Pure static files, no build step:

```
python3 -m http.server 8000
# → http://localhost:8000
```

## Project layout

- `index.html`, `css/style.css` — shell (portrait-first, 100dvh, safe-area aware)
- `js/config.js` — **every tuning knob** (tier thresholds, burnout coefficient, win gates, LP formula)
- `js/data/` — all content, data-driven per the design spec:
  - `events.js` — 62 event cards (3 acts, path decks, chains, shops, unlockable pack)
  - `instruments.js`, `accessories.js` — gear with quirk/modifier hooks
  - `meta.js` — endings copy, Career Wall unlocks, trophies
  - `assets.js` — art-slot → file manifest (placeholders render until real art lands)
- `js/engine.js` — resolution rolls, deck assembly, fail states, finale evaluation (DOM-free)
- `js/ui.js` — screens + swipe physics (Pointer Events, reduced-motion aware)
- `js/save.js` — localStorage persistence; runs autosave every swipe and resume after tab death
- `tools/simulate.mjs` — balance harness: `node tools/simulate.mjs 4000 smart`

## Art pipeline

Every card/instrument/ending references a named art slot and currently
renders a labeled placeholder. To ship real art: export per the specs in
`assets/assets.json`, drop files in `assets/art/`, and register paths in
`js/data/assets.js`. No other code changes.

## Balancing

All numbers live in `js/config.js`. Validate changes with the simulator —
current tuning gives a focused player roughly a 20–35% success rate per path,
with burnout and cred-collapse as real threats to careless play.
