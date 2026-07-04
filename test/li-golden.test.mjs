// Love Island golden net. Pins the villa pack's seeded runtime behavior —
// the coupling subsystem's draws, the producers' beat schedule, recoupling
// verdicts, reveals, per-card deltas, finale readings — byte-for-byte. Same
// discipline as the music and probe goldens; a diff is a bug unless intended,
// then re-baseline deliberately: node tools/gen-li-golden.mjs
//
// Run: node --test test/li-golden.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import { tracePackRun, packCorpus, LI_GOLDEN_SEED, LI_CORPUS_SIZE } from '../tools/pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(here + '/../tools/golden/love-island.json', 'utf8'));
const byKey = new Map(golden.traces.map((t) => [t.seed, t]));
const seeds = packCorpus(LI_GOLDEN_SEED, LI_CORPUS_SIZE);

test('love-island golden corpus is present and sized', () => {
  assert.equal(golden.traces.length, seeds.length,
    'love-island corpus size drifted — run node tools/gen-li-golden.mjs');
});

for (const seed of seeds) {
  test(`love-island golden seed=${seed}`, () => {
    const expected = byKey.get(seed);
    assert.ok(expected, `no love-island golden trace for ${seed} — run node tools/gen-li-golden.mjs`);
    const actual = JSON.parse(JSON.stringify(tracePackRun(loveIslandPack, seed)));
    assert.deepEqual(actual, expected);
  });
}
