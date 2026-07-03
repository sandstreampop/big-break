// Mystery-pack golden regression net (Phase 5). Same discipline as the music
// golden: regenerate every corpus trace from the current engine + mystery pack
// and deep-compare to the snapshot. Proves the second genre stays reproducible
// on the shared engine. Regenerate with: node tools/gen-mystery-golden.mjs
//
// Run: node --test test/mystery-golden.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpus, traceMysteryRun } from '../tools/mystery-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(here + '/../tools/golden/mystery.json', 'utf8'));
const byKey = new Map(golden.traces.map((t) => [t.seed, t]));

test('mystery golden corpus is present and sized', () => {
  assert.equal(golden.traces.length, corpus().length,
    'mystery corpus size drifted — run node tools/gen-mystery-golden.mjs');
});

for (const seed of corpus()) {
  test(`mystery golden seed=${seed}`, () => {
    const expected = byKey.get(seed);
    assert.ok(expected, `no mystery golden trace for ${seed} — run node tools/gen-mystery-golden.mjs`);
    const actual = JSON.parse(JSON.stringify(traceMysteryRun(seed)));
    assert.deepEqual(actual, expected);
  });
}
