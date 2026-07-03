// Regenerate the PROBE golden snapshot (tools/golden/probe.json). The probe is
// the zero-subsystem pack, so its golden pins PURE-CORE behavior: any future
// phase that shifts the engine's genre-neutral spine shows up here even if both
// real packs happen to stay green. Re-baseline action — run only when the core
// or the probe deck deliberately changes.
// Run: node tools/gen-probe-golden.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { probePack } from '../dist/js/packs/probe.js';
import { tracePackRun, packCorpus, PROBE_GOLDEN_SEED, PROBE_CORPUS_SIZE } from './pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(here + '/golden', { recursive: true });
const seeds = packCorpus(PROBE_GOLDEN_SEED, PROBE_CORPUS_SIZE);
const traces = seeds.map((seed) => tracePackRun(probePack, seed));
const header = JSON.stringify({ goldenSeed: PROBE_GOLDEN_SEED, corpusSize: PROBE_CORPUS_SIZE }).slice(1, -1);
const body = traces.map((t) => JSON.stringify(t)).join(',\n');
writeFileSync(here + '/golden/probe.json', `{${header},\n"traces":[\n${body}\n]}\n`);
console.log(`wrote ${traces.length} probe golden traces -> tools/golden/probe.json`);
