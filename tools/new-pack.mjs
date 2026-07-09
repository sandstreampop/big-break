#!/usr/bin/env node
// Scaffold a new game pack — the outside-user paved road, one command:
//
//   npm run new-pack -- <id> "<Display Name>" [emoji]
//   node tools/new-pack.mjs space-cats "Space Cats" 🐈
//
// Writes three things and nothing else:
//   js/packs/<id>.ts      a complete, VALID, playable starter pack
//   <id>.html             the game's entry page (createGame boots it)
//   js/packs/registry.ts  + one import and the two array entries
//
// The starter passes every gate on day one (test/newpack.test.mjs holds the
// template to that), so the author always refactors from green:
//
//   npm run build && node tools/validate-packs.mjs <id>   # contract
//   node tools/pack-report.mjs <id>                       # how it plays
//   npm run check                                          # the whole net
//   → open /dist/<id>/ (any static server) and play it

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validPackId, packExportName, starterPackSource, starterHtml, patchRegistry } from './newpack-core.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [id, name, icon] = process.argv.slice(2);

function die(msg) {
  console.error(`✗ ${msg}`);
  console.error('\nusage: npm run new-pack -- <id> "<Display Name>" [emoji]');
  console.error("       e.g. npm run new-pack -- space-cats \"Space Cats\" 🐈");
  process.exit(1);
}

if (!id || !name) die('need a pack id and a display name.');
if (!validPackId(id)) die(`'${id}' is not a valid pack id — kebab-case letters/digits, starting with a letter (e.g. space-cats).`);

const packPath = resolve(root, `js/packs/${id}.ts`);
const htmlPath = resolve(root, `${id}.html`);
const registryPath = resolve(root, 'js/packs/registry.ts');
if (existsSync(packPath)) die(`js/packs/${id}.ts already exists — pick another id.`);
if (existsSync(htmlPath)) die(`${id}.html already exists — pick another id.`);
if (existsSync(resolve(root, `js/packs/${id}`))) die(`js/packs/${id}/ already exists — pick another id.`);

// The registry patch throws with a hand-fix message if the file has drifted;
// do it FIRST so a failure leaves nothing half-scaffolded.
const registry = patchRegistry(readFileSync(registryPath, 'utf8'), id);

writeFileSync(packPath, starterPackSource(id, name));
writeFileSync(htmlPath, starterHtml(id, name, icon || '🎲'));
writeFileSync(registryPath, registry);

console.log(`✓ scaffolded '${name}' (${id})
  js/packs/${id}.ts      the pack — your game lives here (search TODO)
  ${id}.html             the entry page (served at /${id}/ by the build)
  js/packs/registry.ts   registered (import + PACKS + GAME_PACKS)

Next:
  npm run build && node tools/validate-packs.mjs ${id}
  node tools/pack-report.mjs ${id}
  npx http-server dist   # then open http://localhost:8080/${id}/

The starter is already valid, balanced, and playable — refactor from green.
Docs: quickstart → authoring/* → authoring/llm (co-writing it with a model).`);
