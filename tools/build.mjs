// Build the deployable dist/ (Phase 0.5). Two steps, no bundler magic:
//   1. tsc emits the JS module graph to dist/ (1:1 layout, ESM, es2022).
//   2. copy the static deployables (html, css, manifest, assets) 1:1.
// The result is a complete site rooted at dist/ with import paths and the
// sw.js cache list structurally identical to source — just under dist/.
//
// Run: node tools/build.mjs   (or: npm run build)

import { execSync } from 'node:child_process';
import {
  cpSync, rmSync, existsSync, mkdirSync, copyFileSync,
  readFileSync, writeFileSync, appendFileSync, readdirSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, join } from 'node:path';
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
  // A pack may ship its own PWA manifest (<id>.webmanifest) — installed as
  // /<id>/manifest.webmanifest so Add-to-Home-Screen installs THAT game.
  const wm = resolve(root, `${pack.id}.webmanifest`);
  if (existsSync(wm)) copyFileSync(wm, resolve(dist, pack.id, 'manifest.webmanifest'));
  // A game's public-facing docs pages (docs/games/<id>/public/) deploy as
  // siblings of its index.html — e.g. a roadmap walkthrough at
  // /<id>/roadmap.html. Data-driven like the html copy above; a game
  // without a public/ folder copies nothing.
  const pub = resolve(root, 'docs/games', pack.id, 'public');
  if (existsSync(pub)) cpSync(pub, resolve(dist, pack.id), { recursive: true });
  entries.push(`${pack.id} at /${pack.id}/`);
}

// 4. Version-stamp the delivery (the CSS↔JS contract + cache-busted URLs).
// Every mobile client caches somewhere (HTTP cache with Pages' max-age, the
// PWA service worker, iOS's aggressive disk cache); without fingerprints a
// flaky connection can pair fresh JS with a months-old stylesheet, and the
// new markup renders unstyled (the collapsed-phone-layout bug class).
// Three stamps make that skew both impossible to fetch and self-healing:
//   a. cssV (content hash of EVERY shipped stylesheet — style.css alone once
//      let a pack-css-only change ship under an unchanged ?v=, so caches kept
//      serving the old theme) appended to dist/css/style.css as `--bb-css-v`
//      AND written into dist/js/version.js — the runtime probe in js/ui.ts
//      compares them at boot and re-pulls a stale stylesheet.
//   b. every stylesheet/script URL in the shipped HTML gets ?v=<hash>, so a
//      re-fetched HTML atomically re-fetches matching assets.
// Pinned end-to-end by test/ui/mobile-matrix.mjs (skew-heal pass).
const hashOf = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 12);
const cssFiles = readdirSync(resolve(dist, 'css')).filter((f) => f.endsWith('.css')).sort();
const cssV = hashOf(cssFiles.map((f) => f + '\n' + readFileSync(resolve(dist, 'css', f), 'utf8')).join('\n'));
appendFileSync(resolve(dist, 'css/style.css'), `\n:root { --bb-css-v: "${cssV}"; }\n`);
writeFileSync(resolve(dist, 'js/version.js'),
  `// stamped by tools/build.mjs — see js/version.ts\nexport const CSS_CONTRACT = '${cssV}';\n`);

const jsFiles = [];
(function walk(dir) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) walk(p);
    else if (d.name.endsWith('.js')) jsFiles.push(p);
  }
})(resolve(dist, 'js'));
const jsV = hashOf(jsFiles.sort().map((p) => p + '\n' + readFileSync(p, 'utf8')).join('\n'));

const htmlEntries = [resolve(dist, 'index.html'),
  ...GAME_PACKS.filter((p) => p.id !== 'music').map((p) => resolve(dist, p.id, 'index.html'))];
for (const h of htmlEntries) {
  if (!existsSync(h)) continue;
  const stamped = readFileSync(h, 'utf8').replace(
    /((?:href|src)=")([^"?]+\.(css|js))(")/g,
    (m, pre, url, ext, post) => `${pre}${url}?v=${ext === 'css' ? cssV : jsV}${post}`,
  );
  writeFileSync(h, stamped);
}

console.log(`build ok -> dist/ (music at /${entries.length ? ', ' + entries.join(', ') : ''}) [css v${cssV}, js v${jsV}]`);
