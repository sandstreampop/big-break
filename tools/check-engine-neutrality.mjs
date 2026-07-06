// Engine neutrality guard (Epic 3) — makes the repo's spine self-enforcing.
//
// CLAUDE.md's governing rule: js/engine.ts "names no genre's stats, resources,
// effect verbs, or perk ids." That was enforced only by review and by the
// goldens noticing behavior drift. This turns it into a gate.
//
// The blocklist is DERIVED, not hand-listed: it reads every registered pack's
// manifest (stats + resources) and its plugins (effectVerbs + requires-predicate
// keys), so a third genre's vocabulary is policed automatically the moment it's
// registered — the tool imports each game's specifics and stays genre-neutral
// itself, exactly like lint-content / taste-core.
//
// It scans js/engine.ts with COMMENTS STRIPPED (the core is free to *describe* a
// genre in prose; it must not *name* one in code), and matches whole-word, so a
// pack verb `chartTitle` never false-matches an unrelated substring. A hit means
// a genre concept leaked into the core.
//
// Runs against the built dist/ (the pinned toolchain, like every other
// consumer): `node tools/check-engine-neutrality.mjs`. Wired into `npm run
// typecheck`-adjacent gating via `npm run check` and pages.yml.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryUrl = pathToFileURL(resolve(root, 'dist/js/packs/registry.js')).href;
const { GAME_PACKS } = await import(registryUrl);

// Engine-owned neutral vocabulary the core is ALLOWED to name: the universal
// burnout slot and the closed control verbs the core itself resolves (see the
// `Effect` core in types.ts). These are not genre concepts.
const ENGINE_OWNED = new Set([
  'burnout', 'addFlag', 'removeFlag', 'chainEventId', 'addPromise',
  'anyOf', 'flagsAll', 'flagsNone', 'burnoutMin', 'stats', 'min', 'max',
]);

// Extra genre nouns that aren't in any manifest/verb list but must still never
// appear in core LOGIC (pack flags / mode ids the engine must not branch on —
// e.g. the 'comeback' ×1.2 scoring rule this epic moved into a pack plugin).
// A leak here is a genre STRING LITERAL in engine code, so matches inside a
// `PACK.<name>` capability dispatch are exempt below — the engine feature-
// detecting an optional pack hook (PACK.comeback / PACK.summarize) is the
// architecture, not a leak.
const EXTRA_GENRE_TOKENS = ['comeback'];
// Capability names the engine legitimately dispatches to via `PACK.<name>` — a
// match there is the generic feature-detect, not the core naming a genre.
const PACK_CAPABILITY_OK = /\bPACK\.\w+/g;

// Build the derived blocklist from every registered pack.
const blocked = new Map(); // token -> "why (which pack/source)"
for (const pack of GAME_PACKS) {
  const m = pack.manifest || {};
  for (const s of m.stats || []) if (!ENGINE_OWNED.has(s)) blocked.set(s, `${pack.id} stat`);
  for (const r of m.resources || []) if (!ENGINE_OWNED.has(r)) blocked.set(r, `${pack.id} resource`);
  for (const p of pack.plugins || []) {
    for (const v of p.effectVerbs || []) if (!ENGINE_OWNED.has(v)) blocked.set(v, `${pack.id}/${p.id} effect verb`);
    for (const k of Object.keys(p.requires || {})) if (!ENGINE_OWNED.has(k)) blocked.set(k, `${pack.id}/${p.id} requires key`);
  }
}
for (const t of EXTRA_GENRE_TOKENS) blocked.set(t, 'known pack flag/mode id');

// Strip // line comments and /* */ block comments so prose describing a genre
// doesn't trip the guard — only code counts. (Good enough for this codebase's
// comment style; not a full tokenizer.)
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // avoid eating "://" in urls
}

const enginePath = resolve(root, 'js/engine.ts');
// Strip comments, then blank out `PACK.<name>` capability dispatches — the
// engine feature-detecting an optional pack hook is generic, not a leak; a
// genre concept named anywhere ELSE (a stat access, a flag string literal) is.
const code = stripComments(readFileSync(enginePath, 'utf8')).replace(PACK_CAPABILITY_OK, ' PACK ');

const hits = [];
for (const [token, why] of blocked) {
  const re = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  // Report every offending line for a precise diff.
  const lines = code.split('\n');
  lines.forEach((line, i) => {
    if (re.test(line)) hits.push({ token, why, line: i + 1, text: line.trim().slice(0, 90) });
  });
}

if (hits.length) {
  console.error(`ENGINE NEUTRALITY: ${hits.length} genre leak(s) in js/engine.ts`);
  console.error('The genre-agnostic core must name no pack stat/resource/verb/flag.\n');
  for (const h of hits) {
    console.error(`  engine.ts:${h.line}  "${h.token}" (${h.why})`);
    console.error(`      ${h.text}`);
  }
  console.error('\nMove the genre-specific logic into the owning pack plugin (see Epic 3).');
  process.exit(1);
}

console.log(`ENGINE NEUTRAL — js/engine.ts names none of ${blocked.size} pack tokens across ${GAME_PACKS.length} packs.`);
