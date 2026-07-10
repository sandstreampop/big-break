// Regenerate the ODYSSEY golden snapshot (tools/golden/odyssey.json).
// Re-baseline action — run only when the odyssey deck/manifest or the core
// deliberately changes, then eyeball the one-line-per-run diff.
// Run: node tools/gen-odyssey-golden.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { tracePackRun, packCorpus, ODYSSEY_GOLDEN_SEED, ODYSSEY_CORPUS_SIZE } from './pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(here + '/golden', { recursive: true });
const seeds = packCorpus(ODYSSEY_GOLDEN_SEED, ODYSSEY_CORPUS_SIZE);
const traces = seeds.map((seed) => tracePackRun(odysseyPack, seed));
const header = JSON.stringify({ goldenSeed: ODYSSEY_GOLDEN_SEED, corpusSize: ODYSSEY_CORPUS_SIZE }).slice(1, -1);
const body = traces.map((t) => JSON.stringify(t)).join(',\n');
writeFileSync(here + '/golden/odyssey.json', `{${header},\n"traces":[\n${body}\n]}\n`);
console.log(`wrote ${traces.length} odyssey golden traces -> tools/golden/odyssey.json`);
