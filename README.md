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

It's a PWA: add it to your home screen and it works offline.

## The systems (v4)

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
- **Songs are real (v4)** — writing events tape actual demos (Idea Grab
  hooks become titles, minigame verdicts set quality), release cards
  decide when they ship, hype fights the weekly chart decay, and a
  top-3 week crowns a certified HIT. The act-break chart moment, the
  Songbook (tap 📈), the rival chart war, the trades, the epilogue,
  the discography, and the share poster all read the same catalog.
- **The world reacts** — a procedural Hot 10 chart your songs enter at
  simulated positions, and act-break trade headlines generated from
  your actual run — including your actual song titles.
- **Side hustles** — some outcomes grant income that pays out every act.
- **Instrument arcs** — mid-run swap events (the gift guitar, the pawn-shop
  sampler, the vocal coach).
- **Daily Grind** — a seeded daily run identical for everyone, with an
  emoji share card.
- **Contracts** — opt-in run modifiers (kazoo-only, hidden risk dots,
  6/9/6 acts...) for LP multipliers.
- **Career Wall & Trophy Room** — unlocks (instruments/gear/packs/
  contracts/perks), 50+ satirical trophies, and your last 10 careers.
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
- **Venues & the band** — adopt one of seven home venues (the diner,
  the laundromat, the decommissioned planetarium...) and level it 0–3
  for show bonuses — level 2+ rooms can face the SOLD PENDING notice
  and be saved by a benefit; recruit up to three bandmates (including
  Nadia, who tapes you a demo every act break), each with tag bonuses,
  a per-act quirk, and spotlight episodes.
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
- **Performance minigames (v3)** — fifteen one-thumb skill moments (≤30s)
  on flagship choices: studio takes, crowd rhythm, lyric-grabbing,
  networking triage, band-pattern echo, feedback whack-a-mole, merch
  rush, coin-catch busking, interview speed-reads, held notes, van
  Tetris, a three-fader mixdown, a setlist-arc builder starring your
  actual songs, a forgotten-lyric prompter that tests taste under
  stage lights, and a mirrored duel with your rival. Verdicts (BOTCHED →
  GOLDEN) tilt the roll, burnout makes your hands shake, gear and
  contracts bet on your skill, and the scrapbook remembers every one.
  Skippable, with a relaxed mode in Settings.
- **Deep arcs & constellations** — multi-beat storylines (the
  Documentary, the Shed, Static Bloom's amp debt, the Dirt Circuit,
  late-night TV, the First Fan, the Album, Save The Room) that branch
  on how you played — and rare "constellation" events that only exist
  when two arcs collide (the Fan Wars, the Deep Cut, the Dedication).
- **The songwriter meta-build** — every meta system has a songs-first
  path: the Loop Station instrument, the four-track and the
  publicist's rolodex, Nadia, The Deadline contract (ship a song
  every act or the silence bills you), and the Old Notebook /
  Promoter perks.

## Running locally

Pure static files, no build step:

```
python3 -m http.server 8000   # → http://localhost:8000
```

## Project layout

- `js/config.js` — **every tuning knob** (roll shape, tier thresholds, wear,
  win gates, LP formula, pity/encore numbers)
- `js/data/` — all content: `events.js` (200+ cards), `instruments.js`,
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
node tools/lint-content.mjs   # template/style/gating audit of all content
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
