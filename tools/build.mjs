// Build the deployable dist/ (Phase 0.5). Two steps, no bundler magic:
//   1. tsc emits the JS module graph to dist/ (1:1 layout, ESM, es2022).
//   2. copy the static deployables (html, css, manifest, assets) 1:1.
// The result is a complete site rooted at dist/ with import paths and the
// sw.js cache list structurally identical to source — just under dist/.
//
// Run: node tools/build.mjs   (or: npm run build)

import { execSync } from 'node:child_process';
import { cpSync, rmSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

// Clean so a removed source file never lingers in the deployable.
rmSync(dist, { recursive: true, force: true });

// 1. Compile the JS graph (js/**/* + sw.js) to dist/ per the frozen tsconfig.
execSync('npx tsc', { cwd: root, stdio: 'inherit' });

// 2. Copy static deployables verbatim. sw.js is a standalone service worker
// (no imports) — copied as-is rather than compiled, so it stays byte-exact.
const STATIC = ['index.html', 'manifest.webmanifest', 'css', 'assets', 'sw.js'];
for (const p of STATIC) {
  const src = resolve(root, p);
  if (existsSync(src)) cpSync(src, resolve(dist, p), { recursive: true });
}

// 3. Every game ships from one build, DATA-DRIVEN from the pack registry (no
// hand-copied per-pack step). The music game is the site root (index.html);
// every other registered pack is a sibling entry at dist/<id>/, served by its
// own <id>.html (which references the shared compiled js/css/assets with ../).
// A third pack is a new registry entry + an <id>.html — not a build edit.
const { GAME_PACKS } = await import(pathToFileURL(resolve(dist, 'js/packs/registry.js')).href);
const entries = [];
for (const pack of GAME_PACKS) {
  if (pack.id === 'music') continue; // music is the site root
  const html = resolve(root, `${pack.id}.html`);
  if (!existsSync(html)) {
    console.warn(`  (skip) no ${pack.id}.html for pack '${pack.id}'`);
    continue;
  }
  mkdirSync(resolve(dist, pack.id), { recursive: true });
  copyFileSync(html, resolve(dist, pack.id, 'index.html'));
  entries.push(`${pack.id} at /${pack.id}/`);
}

console.log(`build ok -> dist/ (music at /${entries.length ? ', ' + entries.join(', ') : ''})`);
