# Repo conventions

- Push work to `main`. CI gates it, then Pages deploys `dist/` (see
  `.github/workflows/pages.yml`).
- **Working agreement (human + agent).** The full process — seven rules, the
  pre-merge contract, the hand-off format — is `docs/WORKING-AGREEMENT.md`;
  escaped defects are logged in `docs/INCIDENTS.md`. The rules that bind every
  task, in short:
  - **Verify behaviour, not presence.** A change is done when the app reaches a
    terminal state *after you interact with the new thing*, gated surfaces first
    (see "Ship UI the way it's played" below) — not when it renders.
  - **Invariants are executable, not commentary.** A rule that matters becomes a
    test / hook / type, never only a comment.
  - **Writer ≠ grader.** Before merging non-trivial or multi-surface work, get a
    fresh-context check — the `verifier` subagent (`.claude/agents/verifier.md`)
    or `/code-review` — then run the skeptic's behavioural check. Don't pass your
    own happy path.
  - **Small, reversible batches.** Prefer three small merges to one wide one; say
    what each slice does and doesn't cover.
  - **Guardrail the irreversible.** Merge/deploy only with the full gate suite
    green *and named*. Genuinely destructive commands (force-push without lease,
    `reset --hard`, `rm -rf`, history rewrite, remote deletes, `DROP`) are
    planning-only until the human confirms — enforced by the `guard-destructive`
    PreToolUse hook in `.claude/settings.json`, not left to memory.
  - **Every incident becomes a rule.** Close each escaped defect with an
    `INCIDENTS.md` entry + a rule + (where possible) a test that would catch it.
  - **End every hand-off** with three phone-readable lines —
    `verified ✓ … / not verified ⚠ … / watch-out …` — so oversight has something
    to interrogate instead of a wall of confidence.
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
- **Clean generic engine, specific implementations.** The split above is the
  repo's spine, applied everywhere — not just `engine.ts`. A shared file stays
  genre-neutral (mechanism, types, generic tools); anything specific to one game
  lives with that game. Per-game artifacts go under `docs/games/<game>/` (design
  record, ADRs, and the writing-taste layer: `VOICE.md`, `GUIDING_EXAMPLES.md`,
  `taste.mjs`); per-game runtime code goes under `js/packs/<game>/`. Shared
  tools follow the same rule: `tools/lint-content.mjs` and
  `tools/taste-core.mjs` are the genre-neutral checkers; they *import* each
  game's taste data from that game's folder rather than hard-coding it. Extract
  generic mechanism to a testable `tools/*-core.mjs` (see `pack-core`,
  `sim-core`, `taste-core`) rather than growing a shared file with game specifics.
- **The UI is a layered DAG under `js/ui/`.** `js/ui.ts` is the composition
  root — it boots the app and, in one typed `Nav` wiring object, is the single
  place the concrete screens are named. Everything else is a module with a
  strict downward dependency direction: `context` (session state — `run`/`meta`/
  the active pack — as ES live bindings + the pack-aware readers) and `dom`
  (element factory, overlay engine, screen transition — pure mechanism) at the
  bottom; `gates`/`feeds`/`inspectors`/`hud` are leaf render helpers (forward
  edges only, never route); `nav` is the ONE `Nav` interface every screen calls
  through to move between screens; and `card`/`progression`/`endings`/`newrun`/
  `menus` are the deep screen modules. **No screen module imports another** —
  transitions go through `nav` (dependency inversion), so the graph stays
  acyclic. Adding a screen adds one `Nav` method + one module; only the
  composition root changes.
- **The shell names no genre.** Every file under `js/ui/` (and the shared
  `js/*` layer — `engine`/`save`/`art`/`audio`/…) reads a pack ONLY through the
  `Presenter` interface (`js/types.ts`) + the manifest — never a genre module.
  A pack's UI-facing flavor (HUD chips, result notices, the pre-finale set, the
  setup pickers, share, act set-pieces, bespoke screens like music's Hot 10)
  lives behind presenter hooks the shell feature-detects; a bespoke pack screen
  may render with the neutral `dom` toolkit. So the interface surface to scan is
  one file: `Presenter` (+ `Pack`/`PackManifest`/`RunState`) in `js/types.ts`.
  Each game is a self-contained folder — `js/packs/music/` and
  `js/packs/love-island/` mirror each other (manifest, presenter, deck,
  plugins, data). `RunState` in `js/types.ts` is the genre-neutral core; each
  pack adds its own fields via `declare module '../../types.js'` in its
  `pack.ts`, so a field like `fame` is defined in `js/packs/music/pack.ts`.
- Seeded behavior is pinned by golden masters (music, love-island, and the
  zero-subsystem probe). A golden diff is a bug unless intended — then
  re-baseline deliberately (`tools/gen-golden.mjs`, `tools/gen-li-golden.mjs`,
  `tools/gen-probe-golden.mjs`).
- Cross-pack invariants (`test/invariants.test.mjs`) guard the class of bug
  per-pack goldens are blind to (a core that behaves differently per genre).
- **The pack contract is validated, not assumed.** `validatePack`
  (`js/validate.ts`) is the runtime half of the authoring contract: schema +
  semantic checks (unknown effect verbs/requires keys, dangling chains,
  unresolvable gates, out-of-range acts, missing tiers…) with author-facing,
  LLM-repairable errors (path + declared vocabulary + suggested fix).
  TypeScript guards hand-written packs at compile time; this guards *generated
  or imported* packs — treat those as hostile input until
  `node tools/validate-packs.mjs` (a `npm run check` gate) passes.
- Before pushing a balance/content change: `npm run ci` (build + every gate +
  `node --test`; `npm run check` is the same minus `node --test`, and
  `npm run test:ui` runs just the browser suites — see `package.json` for the
  exact chains). The UI smoke test drives each game to its finale in headless
  Chromium — the only coverage the goldens don't have. Judge feel with
  `node tools/simulate.mjs 4000 narrative` (music) or
  `node tools/simulate-pack.mjs <packId> 3000` (any pack, generic driver).
- **Ship UI the way it's played: verify the FLOW, not the feature.** A change
  isn't done when the new thing renders — it's done when the game still reaches
  an ending *after you interact with it*. Presence ≠ behaviour. This rule is
  written in blood: the portrait lightbox (2026-07) rendered perfectly and
  passed every gate, but tapping-to-close it on a **result** overlay soft-locked
  the run — a second overlay on the shared `#overlay` destroyed the first
  without running the `onClose` that calls `advance()` (full 5 whys:
  `docs/INCIDENTS.md` #1). The process fixes, now mandatory:
  - **A new interactive control must be driven on EVERY surface it appears on —
    and the progression-gated surfaces first** (result / ceremony / finale
    overlays, the crossroads, the finale). A control that's harmless on one
    surface can be gamebreaking on another. After interacting, assert the run
    still advances to a terminal screen.
  - **Never open an overlay from within an overlay on the shared `#overlay`.**
    A modal opened from inside a modal renders on the dedicated top layer
    (`openPortrait` / `openOverlay(..., { host: '#overlay-top' })`). `#overlay`
    holds exactly one overlay; opening a second destroys the first (and its
    pending `advance()`). This is the one true overlay-stacking rule.
  - **Any new control inside an overlay gets a smoke assertion** that clicks it
    and then confirms the run still reaches the finale (see the portrait-lightbox
    guard in `test/ui/smoke.mjs` — it stacks the lightbox off a live result
    overlay and checks the parent overlay survives, then that the run still
    reaches the finale; bounded to twice/run to keep the suite fast). The smoke suite's
    generic "dismiss every overlay" loop is blind to controls *inside* overlays,
    so new ones need their own explicit exercise or they ship untested.
  - **Goldens/sims are DOM-free and can't see any of this.** UI regressions are
    caught only by driving real Chromium to an ending — so the finale-reached
    assertion is load-bearing, not a formality.
- **Phones are the platform.** `test/ui/mobile-matrix.mjs` is the
  phone-playability contract and a CI gate (pages.yml installs Chromium so all
  three browser suites really run): both games across every phone class down
  to 320px wide, a legacy-engine pass (CSS with every `:has()` rule stripped),
  and a stale-stylesheet delivery pass. The rules that keep it green: layout
  never hangs off `:has()` (the JS that inserts a piece toggles a real class,
  e.g. `has-set-piece`); shipped stylesheet/script URLs are always
  version-stamped (`tools/build.mjs` adds `?v=` and the `--bb-css-v` ↔
  `js/version.js` contract that `js/ui.ts` verifies and self-heals at boot);
  and on the smallest phones the ambient tiers yield before the prompt clips
  (ADR-0009 Tier 1). Delivery skew is part of the platform: HTML/CSS/JS cache
  and evict independently on phones, so **a stylesheet may only HIDE content
  under a class the same deploy's script adds** — the scriptless default is
  visible, and any mixed-deploy pairing degrades to everything-shows-at-once,
  never a blank surface (INCIDENTS.md #6; SKEW-LAW probe in
  test/ui/smoke.mjs, per-sheet `--bb-css-v-<name>` stamps in the boot probe).
- **Raster images have ONE road: preprocess, then serve responsively — never a
  raw `<img>`.** A master is never shipped or rendered directly; EVERY portrait
  render site goes through `responsivePicture` (`js/ui/dom.ts`), fed by the
  pack's `Presenter.imageVariants`. A raw portrait `<img>` string anywhere in
  `js/` is a regression `test/portrait-serving.test.mjs` fails on. The pipeline
  — preprocess, ladder, wiring — is the `pack-art` skill (design record:
  ADR-0015, love-island).
- Docs site lives in `docs-site/` (Starlight, isolated toolchain — its own
  `package.json`/`node_modules`, never the engine's pinned tsc; conventions in
  `docs-site/CLAUDE.md`). It deploys as a sibling at `/big-break/docs/` from the
  same Pages workflow and its `npm run build` is a CI gate. In pack source:
  `// #region` markers are transcluded by the docs and a missing region throws —
  editing inside them is comment-only and golden-safe, but don't delete them.
- Releases: a merge to main that changes what a player sees bumps
  `package.json` `version` (the source of truth for the number) AND adds the
  matching top entry in `js/release-notes.ts` — gated by
  `test/release-notes.test.mjs`. Sessions cannot push tag refs (branch pushes
  only), so tags/releases are cut by the `release.yml` workflow. Full process:
  `docs/RELEASING.md` / the `releasing` skill.

Play: [music](https://sandstreampop.github.io/big-break/) ·
[love island](https://sandstreampop.github.io/big-break/love-island/) ·
[the odyssey](https://sandstreampop.github.io/big-break/odyssey/) ·
[docs](https://sandstreampop.github.io/big-break/docs/)
