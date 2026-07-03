# Repo conventions

- Push work to `main`. CI gates it, then Pages deploys `dist/` (see
  `.github/workflows/pages.yml`).
- Source is TypeScript, built to `dist/` with `npm run build`. Tools and tests
  import the built `dist/` — **build before you test**.
- Run `npm install` first (pins TypeScript 5.7.3). The build/golden oracle is
  toolchain-sensitive — `npx tsc` without the pinned install pulls a newer tsc
  whose emit differs.
- `engine.ts` is the genre-agnostic core: DOM-free (sims import it in Node) and
  genre-free — it imports no `data/`, `charts`, or content module, and names no
  genre's stats, resources, effect verbs, or perk ids. A genre is a `Pack`:
  manifest + deck + plugins + presenter (+ optional capabilities the engine
  feature-detects). Adding one edits new files only — no shared type, no engine
  line. Content lives in `js/packs/*`, numeric tuning in `js/config.ts`.
- Seeded behavior is pinned by golden masters (music, mystery, and the
  zero-subsystem probe). A golden diff is a bug unless intended — then
  re-baseline deliberately (`tools/gen-golden.mjs`,
  `tools/gen-mystery-golden.mjs`, `tools/gen-probe-golden.mjs`).
- Cross-pack invariants (`test/invariants.test.mjs`) guard the class of bug
  per-pack goldens are blind to (a core that behaves differently per genre).
- Before pushing a balance/content change: `npm run build`, then
  `node tools/lint-content.mjs && node tools/simulate.mjs --check &&
  node tools/mystery-sim.mjs --check && node --test && node test/ui-smoke.mjs`
  (`npm run check` runs all but `node --test`). The UI smoke test drives each
  game to its finale in headless Chromium — the only coverage the goldens
  don't have. Judge feel with `node tools/simulate.mjs 4000 narrative`.

Play: [music](https://sandstreampop.github.io/big-break/) ·
[mystery](https://sandstreampop.github.io/big-break/mystery/)
