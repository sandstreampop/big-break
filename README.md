# BIG BREAK

**An engine, and a game built on it.** A swipe-left/right roguelike *core* —
seeded, DOM-free, genre-agnostic — with swappable **content packs**. Pack #1 is
a satirical music-career game. The core carries no genre shape, so another game
can ride the same engine and the same UI shell without forking either.

**Play (no install; phone Safari/Chrome, works offline as a PWA):**

- 🎸 **Big Break** — the music game: https://sandstreampop.github.io/big-break/

**Build a game on the engine:** 📚 **Docs** — https://sandstreampop.github.io/big-break/docs/

A run is 5–10 minutes. Failing is frequent and funny; you swipe from nobody to
one of three summits while the world does its best to grind you into content.

---

## What this repo is

It started as one game (Big Break) and has been refactored into a **stable core
+ content packs**, so a second game can ride the same engine instead of forking
it.

- **The engine** (`js/engine.ts`) is genre-agnostic and DOM-free: it knows
  *rolls, decks, acts, fail states, finales, and a seeded RNG*, but imports
  **no** content. Everything genre-specific is injected.
- **A pack** supplies the world: its stat/resource taxonomy and finale gates
  (the *manifest*), its event deck, and its subsystem *plugins*. Swap the pack,
  get a different game — no engine edits.
- **The same UI shell** (`js/ui.ts`) drives either pack, reading the taxonomy
  from whichever pack booted.

```
            ┌─────────────────────────── engine (genre-agnostic core) ───┐
            │ resolution · deck assembly · acts · fail states · finale    │
            │ seeded RNG · plugin dispatch · manifest-driven taxonomy     │
            └───────────────▲───────────────────────────▲────────────────┘
                            │ injects                    │ injects
                 ┌──────────┴──────────┐      ┌──────────┴──────────┐
                 │  music pack (#1)    │      │  your pack (#2)     │
                 │  manifest + deck +  │      │  manifest + deck +  │
                 │  venue/rival/band/  │      │  your own plugins   │
                 │  songs plugins      │      │  (no engine edits)  │
                 └─────────────────────┘      └─────────────────────┘
```

---

## Pack #1 — Big Break (music)

You're a nobody with an almost-useless instrument. Swipe from a damp garage to
**Megastar**, **Studio Legend**, or **Hit Factory** while the industry tries to
grind you into content. Legacy Points persist across runs and buy instruments,
gear, event packs, contracts, and perks on the Career Wall.

Highlights (523 cards deep): a **resolution engine** (stats + gear + quirks −
burnout ± luck → Bad/Good/Incredible, with telegraphed risk dots and a pity
brake); **Encores** you bank and arm; a named **rival** and chart war; **songs
that are real** — you write demos, ship them, fight weekly chart decay, and a
top-3 week crowns a certified HIT that feeds the Hit Factory win-path; **Story
Seeds**, **Flashpoints**, **hot streaks**, overnight-viral releases, **Scene
Weather** era-mutators; **venues & a band**; **contracts, hustles, genres,
Daily Grind, the Gauntlet, Mastery**; fifteen one-thumb **performance
minigames**; procedural **headlines, DMs, epilogues, and a discography**
generated from what actually happened in your run.

---

## Architecture

| Piece | Where | What |
|---|---|---|
| Engine (core) | `js/engine.ts` | Genre-agnostic rules; imports no content. Reads the active pack via `useContentPack` / `newRun(pack, …)`. |
| Boundary types | `js/types.ts` | `Pack`, `PackManifest`, `GameEvent`, `Effect`, `Plugin`, `RunState` — the typed seams between engine and packs. |
| Balance knobs | `js/config.ts` | Pure numeric tuning (roll shape, thresholds, wear, pity, LP…). No taxonomy. |
| Pack manifest | `js/packs/*-manifest.ts` | The genre's taxonomy: stat/resource lists, paths, `winGates`, stat metadata. |
| Packs | `js/packs/music.ts` | Bundle a manifest + event deck + plugins + content helpers. |
| Plugins | `js/packs/plugins/*` | Subsystems dispatched by the engine at lifecycle hooks (`onConstruct`, `modifyEffects`, `onEffect`, `afterResolve`, `onActBreak`, `onFinale`). Music: venue, rival, band, songs. |
| Content | `js/data/*.ts` | Event decks and the music game's instruments/accessories/etc. |
| UI shell | `js/ui.ts` | Screens + swipe physics; pack-driven via `boot(pack)`. |
| Entries | `js/main.ts` (music) | Thin per-game boot; shared guards in `js/platform.ts`. |

---

## Build & run

The source is **TypeScript**, compiled with a pinned `tsc` to `dist/` (ESM,
1:1 layout — no bundler). `dist/` is the deployable.

```bash
npm ci            # install the pinned toolchain
npm run build     # tsc → dist/ + copy static assets; emits the game:
                  #   dist/index.html → music (site root)
python3 -m http.server 8000 --directory dist   # → http://localhost:8000/
```

## The safety net

The engine carries a seeded RNG, so refactors are proven **byte-green**:
identical seeded output on a fixed corpus. Everything below gates the deploy
(see `.github/workflows/pages.yml`) and runs against the **emitted `dist/`**, so
what's tested is what ships.

```bash
node --test                         # golden masters: music (72 traces) + the
                                    # zero-subsystem probe. A diff means seeded
                                    # behavior changed.
node tools/simulate.mjs --check     # music balance/reach gates (success band,
                                    # 0 dead cards, seed funnel, songs win-path)
node tools/lint-content.mjs         # content template/style/gating audit
```

Re-baseline the goldens *only* when you deliberately change seeded behavior:
`node tools/gen-golden.mjs` (music) / `node tools/gen-probe-golden.mjs` (probe),
then eyeball the one-line-per-run diff.

For **feel** (not a gate), run the Monte-Carlo report — judge by `narrative`,
which models a human following the story:

```bash
node tools/simulate.mjs 4000 narrative   # reach report, variance, seeds funnel
```

## Deploy

**The game AND the docs site ship from `main`, one workflow, one artifact.**
Push to `main` → CI builds `dist/`, runs every gate above (plus the docs build),
and (only if green) deploys the whole `dist/` to GitHub Pages. The music game
lands at the root, the docs at `/docs/`, sharing one deploy. No `gh-pages`
branch, no second deployer. A second game would deploy as a sibling at
`/<pack-id>/` from the same artifact.

## Docs

The developer documentation (for building your own game on the engine) lives in
[`docs-site/`](docs-site/) — a Starlight site with its own isolated toolchain.
The API reference is autogenerated by TypeDoc from `js/types.ts` + `js/engine.ts`,
and prose samples are transcluded from the real pack source, so the docs can't
drift (the build is a CI gate). Dev locally with `cd docs-site && npm ci && npm
run dev`.

## Releasing

Cut a tag + GitHub Release from **Actions → "Cut a release"** (workflow_dispatch,
inputs `tag` + full-40-char `sha`). It runs `release.yml` with the built-in
`GITHUB_TOKEN` — the way to create tags here, since automation/session
credentials can push branches but not tag refs. Bump `version` in
`package.json` to match.

## Adding a second game

1. Write a manifest (`js/packs/yourgame-manifest.ts`): stat list, resource
   list, `paths`, `winGates`, stat metadata.
2. Write an event deck (`js/data/yourgame-events.ts`) against `GameEvent`.
3. Assemble a `Pack` (`js/packs/yourgame.ts`): manifest + deck + any subsystem
   plugins. Provide only the capabilities your genre uses — the engine
   feature-detects the rest, so there's nothing to stub.
4. Register it in `js/packs/registry.ts`, add a thin entry
   (`js/yourgame-main.ts` → `boot(yourgamePack)`) and an HTML entry the build
   copies to `dist/yourgame/`.
5. Give it a `--check` gate and a golden corpus; wire both into CI.

The engine doesn't change.

## Balancing

Numeric feel lives in `js/config.ts`; a genre's difficulty shape lives in its
manifest's `winGates`. Change a knob, then run the relevant `--check` and the
golden test. The music sim's gates: success 25–40%, 0 never-drawn ungated
cards, story-seed funnel ≥65%, and a hits/hitfactory win-path guard so the
songs subsystem can't silently break.

## Art

Every art slot renders a generated SVG scene until real art lands (packs and
cards without a slot get a neutral tile). To add real art: export per
`assets/assets.json`, drop files in `assets/art/`, register in
`js/data/assets.js`. No code changes.
