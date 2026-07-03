// Golden-master regression net (Phase 0.2). Regenerates every corpus trace
// from the CURRENT engine source and deep-compares it to the checked-in
// snapshot (tools/golden/master.json). A failure means seeded runtime
// behavior changed: on a [byte-green] step that is a BUG; on a deliberate
// [re-baseline-risk] step, regenerate with `node tools/gen-golden.mjs` and
// review the (localized, one-line-per-run) diff.
//
// Run: node --test   (or: node --test test/golden.test.mjs)

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpus } from '../tools/golden-corpus.mjs';
import { runTrace } from '../tools/sim-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(here + '/../tools/golden/master.json', 'utf8'));
const byKey = new Map(golden.traces.map((t) => [`${t.seed}:${t.policy}`, t]));

test('golden corpus is present and sized as expected', () => {
  assert.equal(golden.traces.length, corpus().length,
    'corpus size drifted from the snapshot — run node tools/gen-golden.mjs');
});

for (const { seed, policy } of corpus()) {
  test(`golden ${policy} seed=${seed}`, () => {
    const expected = byKey.get(`${seed}:${policy}`);
    assert.ok(expected, `no golden trace for ${seed}:${policy} — run node tools/gen-golden.mjs`);
    // JSON round-trip the fresh trace so number/shape comparison matches the
    // snapshot's parsed form exactly (e.g. dropped undefined keys).
    const actual = JSON.parse(JSON.stringify(runTrace(seed, policy)));
    assert.deepEqual(actual, expected);
  });
}
