# Big Break — documentation site

A [Starlight](https://starlight.astro.build/) (Astro) docs site for the Big Break
engine, aimed at developers building their own games on it. It is **isolated**
from the engine's pinned toolchain: its own `package.json` and `node_modules`, so
installing Astro never perturbs the engine's emit-sensitive `tsc`.

## Develop

```bash
cd docs-site
npm ci
npm run dev     # local dev server
npm run build   # static build → docs-site/dist/
```

The site's `base` is `/big-break/docs/` — it deploys as a **sibling** of the
games under the same GitHub Pages artifact (see `.github/workflows/pages.yml`,
which builds this and copies `docs-site/dist/` to `dist/docs/`). Push to `main`
and the games and docs redeploy together.

## How the docs can't drift

Three layers keep the site honest, all enforced by `npm run build` (and therefore
by CI, where the docs build is a gate):

1. **API reference** — [TypeDoc](https://typedoc.org/) reads `js/types.ts` and
   `js/engine.ts` and generates the reference from their doc comments. It *is* the
   types, so it can't disagree with them. Split into two sections: **types** (the
   pack-authoring contract) and **engine** (the run-driving functions).
2. **Transcluded samples** — every code block showing real engine/pack code is
   pulled from the source at build time via a `?raw` import and sliced by named
   `// #region` markers (`src/lib/snippet.ts`). Delete or rename a region and the
   build **throws** — a hard drift gate.
3. **Twoslash** — inline illustrative TS samples are type-checked at build
   (`ec.config.mjs`); a sample that stops compiling fails the build, and readers
   get hover-for-type in the rendered docs.

## Layout

- `src/content/docs/**` — the authored chapters (prose).
- `src/content/docs/reference/**` — **generated** by TypeDoc; git-ignored.
- `src/lib/snippet.ts` — the transclusion / region helpers.
- `astro.config.mjs` — Starlight + the two TypeDoc passes + aliases.
- `ec.config.mjs` — Expressive Code (syntax highlight + Twoslash).
- `tsconfig.typedoc.json` — mirrors the engine's frozen compiler options so
  TypeDoc resolves the engine's bundler-style imports.
