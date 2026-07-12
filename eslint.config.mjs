// Lint gate (2026-07 staff review, Pass 3) — a CORRECTNESS net, not a style
// cop. Formatting/naming stay with the codebase's existing idiom (see
// CLAUDE.md); rules here exist to catch real defect classes the type checker
// misses in plain-JS tooling and un-strict TS alike.
//
// Same shape as tsconfig.strict.json: the TS rule set applies to a FRONTIER
// (the strict-clean core) and widens file-by-file; the JS rule set covers the
// whole tooling/test ring from day one. `npm run lint:code` runs it; CI gates
// it in pages.yml.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// The strict frontier (mirror tsconfig.strict.json's include — one list to
// scan, two enforcers: tsc for types, eslint for the classes tsc waves past).
const TS_FRONTIER = [
  'js/engine.ts',
  'js/types.ts',
  'js/config.ts',
  'js/platform.ts',
  'js/validate.ts',
  'js/api.ts',
  'js/save.ts',
  'js/analytics.ts',
  'js/version.ts',
];

// Correctness-only overrides shared by both rings.
const CORRECTNESS = {
  eqeqeq: ['error', 'smart'],
  'no-unused-vars': ['error', {
    args: 'none',              // callback signatures document intent
    caughtErrors: 'none',      // `catch (e) { /* best-effort */ }` is idiomatic here
    varsIgnorePattern: '^_',
  }],
  'no-empty': ['error', { allowEmptyCatch: true }], // swallow-and-play-on is a documented posture
};

export default [
  // Build output, vendored/generated trees, and the docs site (its own
  // isolated toolchain) are never linted.
  { ignores: ['dist/**', 'docs-site/**', 'assets/**', 'telemetry/**', 'sw.js'] },

  // Ring 1: the tooling + test ring (plain ESM JS, runs in Node).
  {
    files: ['tools/**/*.mjs', 'test/**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly', process: 'readonly', URL: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly',
        fetch: 'readonly', Buffer: 'readonly', globalThis: 'writable',
        TextEncoder: 'readonly', TextDecoder: 'readonly',
        AbortController: 'readonly', structuredClone: 'readonly',
        performance: 'readonly', crypto: 'readonly',
      },
    },
    rules: { ...js.configs.recommended.rules, ...CORRECTNESS },
  },

  // Ring 1b: suites/harnesses that pass callbacks into Playwright's
  // page.evaluate() — those callbacks execute in the BROWSER context, so the
  // browser globals are real there even though the file runs under Node.
  {
    files: ['test/ui/**/*.mjs', 'tools/ios/**/*.mjs', 'tools/android/**/*.mjs', 'tools/device-pass.mjs', 'tools/render-bard-sample.mjs', 'tools/render-bard-live.mjs'],
    languageOptions: {
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly', getComputedStyle: 'readonly',
        Event: 'readonly', PointerEvent: 'readonly', KeyboardEvent: 'readonly',
      },
    },
  },

  // Ring 2: the strict TS frontier.
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: TS_FRONTIER })),
  {
    files: TS_FRONTIER,
    rules: {
      ...CORRECTNESS,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_',
      }],
      // The frontier files still carry documented `any` escape hatches
      // (open meta records, plugin annotations); tsc's strict gate is the
      // arbiter of typing progress, not this rule.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off', // the vendored PostHog snippet needs its @ts-ignore
    },
  },
];
