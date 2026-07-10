# Context Map

This repo is a genre-neutral career-climb game engine plus a catalogue of games
built on it. Each game is a `Pack` (see `CLAUDE.md`) and its own domain context,
with its own glossary and decisions under `docs/games/<game>/`.

## Contexts

- **Engine** — the genre-neutral core (`js/engine.ts`, `js/types.ts`). Names no
  genre; a game plugs in as a `Pack`. No `CONTEXT.md` of its own yet.
- **Big Break** (music) — the shipping game (`js/packs/music*.ts`, `js/data/`).
  Design predates this catalogue; no `CONTEXT.md` yet.
- [Love Island](./docs/games/love-island/grill.md) — a second game, in design.
  Glossary: [`docs/games/love-island/CONTEXT.md`](./docs/games/love-island/CONTEXT.md).
  Decisions: [`docs/games/love-island/adr/`](./docs/games/love-island/adr/).
- [The Odyssey](./docs/games/odyssey/grill.md) — the third game: a bard at a
  campfire retells the long way home (`js/packs/odyssey/`).
  Glossary: [`docs/games/odyssey/CONTEXT.md`](./docs/games/odyssey/CONTEXT.md).
  Voice law: [`docs/games/odyssey/VOICE.md`](./docs/games/odyssey/VOICE.md);
  visual law: [`docs/games/odyssey/STYLE.md`](./docs/games/odyssey/STYLE.md).

## Convention

A new game's design docs live in `docs/games/<game>/`:

- `CONTEXT.md` — the game's glossary (vocabulary only; see the domain-modeling
  format).
- `grill.md` — the grilling doc: the design record and design→engine mapping.
- `adr/NNNN-*.md` — decisions specific to that game.

Engine-wide / cross-game decisions (if any) belong in a root `docs/adr/`.
