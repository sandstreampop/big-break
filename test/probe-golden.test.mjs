// Probe-pack golden net. The probe has zero subsystems, so this snapshot pins
// the engine's PURE genre-neutral core: a phase that re-couples the spine to a
// genre trips here even when the real pack stays green. Same discipline as the
// music golden; regenerate with: node tools/gen-probe-golden.mjs
//
// Run: node --test test/probe-golden.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { probePack } from '../dist/js/packs/probe.js';
import { tracePackRun, packCorpus, PROBE_GOLDEN_SEED, PROBE_CORPUS_SIZE } from '../tools/pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(here + '/../tools/golden/probe.json', 'utf8'));
const byKey = new Map(golden.traces.map((t) => [t.seed, t]));
const seeds = packCorpus(PROBE_GOLDEN_SEED, PROBE_CORPUS_SIZE);

test('probe golden corpus is present and sized', () => {
  assert.equal(golden.traces.length, seeds.length,
    'probe corpus size drifted — run node tools/gen-probe-golden.mjs');
});

for (const seed of seeds) {
  test(`probe golden seed=${seed}`, () => {
    const expected = byKey.get(seed);
    assert.ok(expected, `no probe golden trace for ${seed} — run node tools/gen-probe-golden.mjs`);
    const actual = JSON.parse(JSON.stringify(tracePackRun(probePack, seed)));
    assert.deepEqual(actual, expected);
  });
}
