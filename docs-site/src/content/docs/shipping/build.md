---
title: Building & shipping
description: One build command, one folder to serve — how your game goes from source to a playable URL.
---

Shipping a Big Break game is deliberately boring. There is one build command,
it produces one folder, and every registered game ships from it. There is no
bundler to configure and no per-game build step to maintain.

## Build

```bash
npm run build
```

This compiles the TypeScript to `dist/` and copies the static files (HTML,
CSS, assets, the offline service worker) alongside it. `dist/` is the complete,
servable site.

## Where your game appears

The build reads the [registry](/big-break/docs/concepts/pack/#the-registry-one-place-a-genre-is-declared)
and emits an entry for **every** registered game — you never edit a build file:

- the music game owns the site root (`dist/index.html`);
- every other pack in `GAME_PACKS` gets its own folder at `dist/<id>/`, sharing
  the same compiled engine, styles, and assets.

So after `npm run new-pack -- space-cats "Space Cats"` and a build, your game
is at `dist/space-cats/`:

```bash
npx http-server dist
# → http://localhost:8080/space-cats/
```

## Adding a game entry by hand

The scaffolder does all of this for you. If you're wiring a pack manually
instead, a playable entry is three small pieces:

1. Add your pack to `GAME_PACKS` in the registry.
2. Add a three-line entry module — `js/main-yourgame.ts` calling
   `createGame({ pack: yourgamePack }).start()`.
3. Add `yourgame.html` (copy a scaffolded one and point its script tag at
   `js/main-yourgame.js`). The build turns it into `dist/yourgame/index.html`.

A registered pack with no matching HTML entry is skipped with a warning, so
you can register a pack for testing long before you give it a page.

## Two games, one site, separate saves

Because every game is served from the same place, isolation is handled for
you:

- **Saves** are namespaced per game, and save codes are tagged with the game
  they came from — a player can't paste one game's career into another.
- **Analytics** (if you wire them) carry the game's id on every event, so a
  shared site still measures each game separately.

## Publishing

Pushing to `main` publishes: the site rebuilds, the full test suite runs —
contract validation, balance gates, and browser playthroughs of every game —
and only if everything passes does the new build go live on GitHub Pages.
A failing check blocks the publish, so a broken build can't reach players.

That's the entire pipeline. If `npm run check` passes on your machine, the
publish will pass too.
