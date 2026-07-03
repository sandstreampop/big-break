// Regenerate the golden-master snapshot (tools/golden/master.json).
// Run: node tools/gen-golden.mjs
//
// This is a RE-BASELINE action. Only run it when you have deliberately
// changed seeded behavior (a re-baseline-risk step) or the corpus itself;
// then eyeball the git diff to confirm the change is exactly what you
// intended before committing. A byte-green refactor must leave this file
// UNCHANGED — that clean diff is the proof the step changed nothing.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpus, GOLDEN_SEED, CORPUS_SIZE, POLICIES } from './golden-corpus.mjs';
import { runTrace } from './sim-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dir = here + '/golden';
mkdirSync(dir, { recursive: true });

const traces = corpus().map(({ seed, policy }) => runTrace(seed, policy));
// One compact trace per line: valid JSON, but a run that drifts shows up as
// exactly one changed line, so a re-baseline diff is instantly legible.
const header = JSON.stringify({ goldenSeed: GOLDEN_SEED, corpusSize: CORPUS_SIZE, policies: POLICIES }).slice(1, -1);
const body = traces.map((t) => JSON.stringify(t)).join(',\n');
writeFileSync(dir + '/master.json', `{${header},\n"traces":[\n${body}\n]}\n`);
console.log(`wrote ${traces.length} golden traces -> tools/golden/master.json`);
