# BIG BREAK

*A satirical, swipe-left/right music-career roguelike for mobile web.*

You're a nobody with an almost-useless instrument. Swipe your way from a damp
garage to one of three summits of the music industry — Megastar, Studio
Legend, or Hit Factory — while the industry does everything it can to grind
you into content. A full run takes 5–10 minutes. Failing is frequent and
funny; Legacy Points persist across runs and buy instruments, gear, event
packs, contracts, and perks on the Career Wall.

**Play it (no install, phone Safari/Chrome):**
- https://sandstreampop.github.io/big-break/
- Mirror: https://raw.githack.com/sandstreampop/big-break/gh-pages/index.html

It's a PWA: add it to your home screen and it works offline.

## The systems (v2.0)

- **Resolution engine** — every swipe rolls stats + gear + quirks − burnout
  ± luck into Bad / Good / Incredible. Colored risk dots telegraph danger
  (❓ in-game explains everything); a pity brake makes losing streaks bend
  back toward playable.
- **Encores** — Incredibles bank a token you can arm on a later card for a
  hot roll. The dots update live while armed.
- **Rival** — each run generates a named rival woven through all three acts;
  the rivalry meter gates an Act 3 showdown or supergroup.
- **The Unfinished Song** — a run-spanning storyline: find four chords at
  3 a.m., grow or sell the fragment, and reckon with it in Act 3.
- **Burnout** — the danger stat: passive grind wear per card, coping
  interstitials at 50/75, a screen that literally runs hot, and a fintech
  UX job waiting at 100.
- **The world reacts** — a procedural Hot 10 chart your songs can enter,
  and act-break trade headlines generated from your actual run.
- **Side hustles** — some outcomes grant income that pays out every act.
- **Instrument arcs** — mid-run swap events (the gift guitar, the pawn-shop
  sampler, the vocal coach).
- **Daily Grind** — a seeded daily run identical for everyone, with an
  emoji share card.
- **Contracts** — opt-in run modifiers (kazoo-only, hidden risk dots,
  6/9/6 acts...) for LP multipliers.
- **Career Wall & Trophy Room** — unlocks (instruments/gear/packs/
  contracts/perks), 25+ satirical trophies, and your last 10 careers.
- **Genres** — claim a sound (Doom Jazz, Yacht Metal...) that tilts
  tag-matched odds; the scene politics cards react to it.
- **The world talks back** — trade headlines AND text messages from
  people you've met (Curtis checks in politely), plus procedural
  epilogues on every ending.
- **The Gauntlet** — a weekly forced-build challenge; **Mastery** —
  instruments level up (★–★★★) the more you finish runs with them.
- **The Final Set** — pick your closer before the career is judged.
- **Poster share cards** — runs export as a 1080×1080 PNG via the share
  sheet; saves export/import as backup codes.
- **Venues & the band** — adopt a home venue and level it 0–3 for show
  bonuses; recruit up to three bandmates, each with tag bonuses, a
  per-act quirk, and their own spotlight episodes.
- **The Last Door** — every path ends on a bespoke climax card (the label
  meeting, the call, the credits) before the Final Set.
- **The Brammies & Exit Interviews** — an awards-night interstitial before
  Act 3, and a final question on every burnout/cancelled/debt game over
  whose answer changes your exit (and your LP).
- **Comeback Mode & the Nemesis** — lose badly enough, often enough, and
  new run types remember: washed-up comeback starts, and a rival who has
  beaten you before returning meaner.
- **Someone** — a quiet three-card relationship arc that has nothing to do
  with your career, which is the point.
- **Promises & contracts** — deadline objectives you swipe into existence
  and must keep, on top of opt-in LP-multiplier contracts.
- **The Montage & The Collab** — a three-city world-tour chain (Tokyo →
  Berlin → São Paulo), and a Hot 10 chart artist who steps out of the
  chart to DM you about a feature — both branches echo in Act 3.
- **Discography** — every run leaves a record: an album-by-album career
  writeup generated from what actually happened — including records that
  only exist because a storyline did ("The Shed Sessions").
- **Performance minigames (v3)** — twelve one-thumb skill moments (≤30s)
  on flagship choices: studio takes, crowd rhythm, lyric-grabbing,
  networking triage, band-pattern echo, feedback whack-a-mole, merch
  rush, coin-catch busking, interview speed-reads, held notes, van
  Tetris, and a mirrored duel with your rival. Verdicts (BOTCHED →
  GOLDEN) tilt the roll, burnout makes your hands shake, gear and
  contracts bet on your skill, and the scrapbook remembers every one.
  Skippable, with a relaxed mode in Settings.
- **Deep arcs & constellations** — multi-beat storylines (the
  Documentary, the Shed, Static Bloom's amp debt, the Dirt Circuit,
  late-night TV) that branch on how you played — and rare
  "constellation" events that only exist when two arcs collide.

## Running locally

Pure static files, no build step:

```
python3 -m http.server 8000   # → http://localhost:8000
```

## Project layout

- `js/config.js` — **every tuning knob** (roll shape, tier thresholds, wear,
  win gates, LP formula, pity/encore numbers)
- `js/data/` — all content: `events.js` (130+ cards), `instruments.js`,
  `accessories.js`, `rivals.js`, `contracts.js`, `hustles.js`, `genres.js`,
  `venues.js`, `band.js`, `meta.js` (endings/wall/trophies), `assets.js`
  (art-slot manifest)
- `js/engine.js` — DOM-free rules: rolls, deck assembly, fail states,
  finale, seeded RNG (`tools/simulate.mjs` drives it in Node)
- `js/ui.js` — screens + swipe physics; `js/art.js` — generative SVG scenes;
  `js/audio.js` — synthesized SFX + per-act lo-fi soundtrack;
  `js/charts.js` / `js/headlines.js` — the world's reactions
- `sw.js`, `manifest.webmanifest` — offline/PWA layer

## Balancing

Change knobs in `js/config.js`, then:

```
node tools/simulate.mjs 4000 narrative
```

The `narrative` policy models a human following the story — judge feel by
it (target: ~20% Bad, a scrappy Act 1, Incredibles blooming in Act 3, and
burnout worth respecting). `smart`/`random` bound the extremes; focused
play should win roughly 20–55% by path (Hit Factory is deliberately the
friendliest when you commit to it — it is a factory).

## Art pipeline

Every slot renders a generated SVG scene until real art lands: export per
`assets/assets.json`, drop files in `assets/art/`, register in
`js/data/assets.js`. No code changes.
