// Regenerate the MYSTERY golden snapshot (tools/golden/mystery.json).
// Run: node tools/gen-mystery-golden.mjs
// Re-baseline action — run only when mystery behavior deliberately changes.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpus, traceMysteryRun, GOLDEN_SEED, CORPUS_SIZE } from './mystery-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(here + '/golden', { recursive: true });
const traces = corpus().map((seed) => traceMysteryRun(seed));
const header = JSON.stringify({ goldenSeed: GOLDEN_SEED, corpusSize: CORPUS_SIZE }).slice(1, -1);
const body = traces.map((t) => JSON.stringify(t)).join(',\n');
writeFileSync(here + '/golden/mystery.json', `{${header},\n"traces":[\n${body}\n]}\n`);
console.log(`wrote ${traces.length} mystery golden traces -> tools/golden/mystery.json`);
