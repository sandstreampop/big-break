// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';

// Two independent TypeDoc passes, each with its own output tree and sidebar
// group. Splitting the pack-authoring surface (types.ts) from the run-driving
// surface (engine.ts exports) matches how the two audiences actually read the
// reference — and, because each pass has a single entry point, neither emits a
// multi-module landing page with cross-module links to chase.
const [typesTypeDoc, typesSidebarGroup] = createStarlightTypeDocPlugin();
const [engineTypeDoc, engineSidebarGroup] = createStarlightTypeDocPlugin();

// Shared TypeDoc options: reframe for embedders, not maintainers.
const typeDocOptions = {
  excludeInternal: true,
  hideGenerator: true,
  sort: ['source-order'],
};

// The docs site is a SIBLING of the games under the same GitHub Pages deploy.
// The games live at the Pages root (https://sandstreampop.github.io/big-break/);
// the docs are copied into dist/docs by the engine build, so they serve at
// /big-break/docs/. `base` must match that path exactly or every internal link
// 404s once deployed.
export default defineConfig({
  site: 'https://sandstreampop.github.io',
  base: '/big-break/docs',
  // Emit plain, relative-friendly output that drops cleanly under dist/docs.
  outDir: './dist',
  trailingSlash: 'always',
  // Code samples are transcluded from the engine source one level up (../js).
  // `@engine` and `@snippet` aliases make those imports depth-independent, so a
  // chapter's `?raw` import path never depends on how deep in the sidebar tree
  // its file lives. `fs.allow: ['..']` lets Vite read the sibling source in both
  // `astro dev` and `astro build`.
  vite: {
    resolve: {
      alias: {
        '@engine': fileURLToPath(new URL('../js', import.meta.url)),
        '@snippet': fileURLToPath(new URL('./src/lib/snippet.ts', import.meta.url)),
      },
    },
    server: { fs: { allow: ['..'] } },
  },
  integrations: [
    starlight({
      title: 'Big Break Engine',
      description:
        'Build your own 3-act swipe-roguelike. A game is a Pack — adding a genre edits new files only, no shared type, no engine line.',
      tagline: 'A 3-act swipe-roguelike SDK.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/sandstreampop/big-break',
        },
      ],
      // Expressive Code (syntax highlighting + Twoslash) is configured in
      // ec.config.mjs — required because the `<Code>` component can't serialize
      // the Twoslash plugin function from inline config.
      plugins: [
        // The pack-authoring contract — every type a pack author touches.
        // Reference cannot drift from the types by construction: it IS the
        // types' doc comments.
        typesTypeDoc({
          entryPoints: ['../js/types.ts'],
          tsconfig: './tsconfig.typedoc.json',
          output: 'reference/types',
          sidebar: { label: 'Reference: types', collapsed: true },
          typeDoc: typeDocOptions,
        }),
        // The run-driving contract — the engine functions a host/UI calls.
        engineTypeDoc({
          entryPoints: ['../js/engine.ts'],
          tsconfig: './tsconfig.typedoc.json',
          output: 'reference/engine',
          sidebar: { label: 'Reference: engine functions', collapsed: true },
          typeDoc: typeDocOptions,
        }),
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'What is Big Break?', link: '/' },
            { label: 'Three commands to a game', slug: 'three-commands' },
            { label: 'Quickstart (build it by hand)', slug: 'quickstart' },
          ],
        },
        {
          label: 'Core concepts',
          items: [
            { label: 'The run lifecycle', slug: 'concepts/lifecycle' },
            { label: 'The Pack contract', slug: 'concepts/pack' },
          ],
        },
        {
          label: 'Authoring a game',
          items: [
            { label: 'The manifest', slug: 'authoring/manifest' },
            { label: 'The deck', slug: 'authoring/deck' },
            { label: 'Effects & the open vocabulary', slug: 'authoring/effects' },
            { label: 'Subsystems (plugins)', slug: 'authoring/plugins' },
            { label: 'Progression: perks, interstitials, tutorial', slug: 'authoring/progression' },
            { label: 'The presenter', slug: 'authoring/presenter' },
          ],
        },
        {
          label: 'Validate & generate',
          items: [
            { label: 'Validation & the repair loop', slug: 'authoring/validation' },
            { label: 'Authoring with an LLM', slug: 'authoring/llm' },
          ],
        },
        {
          label: 'Ship it',
          items: [
            { label: 'Balance & the safety net', slug: 'shipping/balance' },
            { label: 'Building & shipping', slug: 'shipping/build' },
            { label: 'Case study: the villa pack', slug: 'shipping/second-genre' },
          ],
        },
        {
          label: 'Recipes',
          items: [{ label: 'Cookbook', slug: 'cookbook' }],
        },
        // The two autogenerated TypeDoc reference groups.
        typesSidebarGroup,
        engineSidebarGroup,
      ],
    }),
  ],
});
