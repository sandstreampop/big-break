---
title: Building & shipping
description: The build, the data-driven multi-entry output, adding a game entry, and save/telemetry namespacing.
---

Shipping a Big Break game is deliberately boring: there's no bundler and no
per-game build step. The source is TypeScript compiled 1:1 to `dist/`, and every
registered pack ships from that one build.

## The build

```bash
npm run build   # node tools/build.mjs
```

Two steps, no magic:

1. `tsc` emits the JS module graph to `dist/` (ESM, `es2022`, 1:1 layout — the
   import paths in `dist/` are structurally identical to source).
2. static deployables (HTML, CSS, assets, the service worker) are copied verbatim.

Because `target` is `es2022`, `tsc` does no down-levelling and injects no
helpers — the emit is behaviorally identical to the source, which is what lets
the golden master police it.

## The multi-entry output is data-driven

The build reads the [registry](/big-break/docs/concepts/pack/#the-registry-one-place-a-genre-is-declared)
and emits an entry for **every** game pack — no hand-copied per-pack step:

- the music pack is the site root (`dist/index.html`);
- every other pack in `GAME_PACKS` becomes a sibling at `dist/<id>/`, served by
  its own `<id>.html`, which references the shared compiled `js/`/`css/`/`assets`
  with `../`.

So the mystery game lives at `/mystery/` and shares the exact same compiled
engine as the root game.

## Adding a game entry

To put your pack in front of players:

1. Register it in `GAME_PACKS` (see [The Pack contract](/big-break/docs/concepts/pack/)).
2. Add a thin entry module — `js/yourgame-main.ts` that calls `boot(yourgamePack)`.
3. Add an HTML entry `yourgame.html` (copy `mystery.html`). The build copies it to
   `dist/yourgame/index.html` automatically.

That's it — the build maps over the registry, so there's no build file to edit.
A pack in `GAME_PACKS` without a matching `<id>.html` is skipped with a warning.

## Save and telemetry namespacing

Because multiple games share one origin, per-pack isolation matters:

- **Saves** are namespaced by pack id, and share/replay codes are pack-tagged, so
  a music save never loads into the mystery game.
- **Telemetry** events carry a `pack` dimension, so analytics slice cleanly per
  genre. If you wire analytics, keep that dimension — it's what makes a shared
  build measurable per game. (See the engine's analytics schema in the repo.)

## Deploy

Deploy is a single path: push to `main` → CI builds `dist/`, runs the full
[safety net](/big-break/docs/shipping/balance/), and — only if green — publishes
`dist/` to GitHub Pages. Both games (and this docs site) ship from that one
workflow, one artifact. There's no `gh-pages` branch and no second deployer.

See the CI workflow at `.github/workflows/pages.yml` for the exact gate order.
