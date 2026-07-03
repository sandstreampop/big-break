# Repo conventions

- Push work to `main`. CI gates it, then Pages deploys `dist/` (see
  `.github/workflows/pages.yml`).
- Source is TypeScript, built to `dist/` with `npm run build`. Tools and tests
  import the built `dist/` — **build before you test**.
- `engine.ts` is the genre-agnostic core: keep it DOM-free (sims import it in
  Node) and content-free (it imports no `data/` or `packs/` module). Content
  lives in `js/packs/*`, numeric tuning in `js/config.ts`, genre taxonomy in
  `js/packs/*-manifest.ts`.
- Seeded behavior is pinned by golden masters. A golden diff is a bug unless
  intended — then re-baseline deliberately (`tools/gen-golden.mjs`,
  `tools/gen-mystery-golden.mjs`).
- Before pushing a balance/content change: `npm run build`, then
  `node tools/lint-content.mjs && node tools/simulate.mjs --check &&
  node tools/mystery-sim.mjs --check && node --test`. Judge feel with
  `node tools/simulate.mjs 4000 narrative`.

Play: [music](https://sandstreampop.github.io/big-break/) ·
[mystery](https://sandstreampop.github.io/big-break/mystery/)
