// Odyssey-pack golden net: pins the skeleton's seeded behavior (deck draws,
// tiers, resources, endings) so a balance/content change is always DELIBERATE.
// Same discipline as the music/LI goldens; regenerate with:
// node tools/gen-odyssey-golden.mjs
//
// Run: node --test test/odyssey-golden.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { odysseyPack } from '../dist/js/packs/odyssey.js';
import { tracePackRun, packCorpus, ODYSSEY_GOLDEN_SEED, ODYSSEY_CORPUS_SIZE } from '../tools/pack-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(here + '/../tools/golden/odyssey.json', 'utf8'));
const byKey = new Map(golden.traces.map((t) => [t.seed, t]));
const seeds = packCorpus(ODYSSEY_GOLDEN_SEED, ODYSSEY_CORPUS_SIZE);

test('odyssey golden corpus is present and sized', () => {
  assert.equal(golden.traces.length, seeds.length,
    'odyssey corpus size drifted — run node tools/gen-odyssey-golden.mjs');
});

for (const seed of seeds) {
  test(`odyssey golden seed=${seed}`, () => {
    const expected = byKey.get(seed);
    assert.ok(expected, `no odyssey golden trace for ${seed} — run node tools/gen-odyssey-golden.mjs`);
    const actual = JSON.parse(JSON.stringify(tracePackRun(odysseyPack, seed)));
    assert.deepEqual(actual, expected);
  });
}
