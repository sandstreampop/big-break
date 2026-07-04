// Regenerate the LOVE ISLAND golden snapshot (tools/golden/love-island.json).
// Pins the villa pack's full seeded runtime behavior — coupling draws, beat
// scheduling, recoupling verdicts, reveals, per-card deltas, finale readings.
// Re-baseline action — run only when the pack's balance/content deliberately
// changes. Run: node tools/gen-li-golden.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import { tracePackRun, packCorpus, LI_GOLDEN_SEED, LI_CORPUS_SIZE } from './pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(here + '/golden', { recursive: true });
const seeds = packCorpus(LI_GOLDEN_SEED, LI_CORPUS_SIZE);
const traces = seeds.map((seed) => tracePackRun(loveIslandPack, seed));
const header = JSON.stringify({ goldenSeed: LI_GOLDEN_SEED, corpusSize: LI_CORPUS_SIZE }).slice(1, -1);
const body = traces.map((t) => JSON.stringify(t)).join(',\n');
writeFileSync(here + '/golden/love-island.json', `{${header},\n"traces":[\n${body}\n]}\n`);
console.log(`wrote ${traces.length} love-island golden traces -> tools/golden/love-island.json`);
