// Cross-pack property invariants (Phase A.1). These are the guard class that
// per-pack byte-goldens structurally CANNOT be: properties that must hold for
// EVERY registered pack. A per-pack golden encodes one genre's own output as
// "correct", so two same-shaped genres that behave differently on a core
// mechanic (the §2E INCREDIBLE-multiplier asymmetry is the poster child) each
// pass their own golden while the core is quietly wrong. These tests iterate
// the whole registry and assert the invariants that make the core genre-neutral.
//
// Run: node --test test/invariants.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { PACKS } from '../dist/js/packs/registry.js';
import { simulatePackRun } from '../tools/pack-core.mjs';

// A fresh, un-played run for a pack (default persona, no seed → construction
// draws only). Enough to probe manifest wiring without playing cards.
function freshRun(pack) {
  const persona = (pack.instruments.find((i) => i.unlockedByDefault) || pack.instruments[0]).id;
  return engine.newRun(pack, persona, [], engine.mulberry32(1), []);
}

for (const pack of PACKS) {
  // ── Manifest coherence: the taxonomy has to be internally consistent, or
  // the HUD/finale read undefined. ──
  test(`[${pack.id}] manifest is coherent`, () => {
    const m = pack.manifest;
    assert.ok(m.stats.length >= 1, 'at least one core stat');
    assert.ok(m.resources.length >= 1, 'at least one resource');
    // statMeta covers every core stat plus the engine's burnout slot.
    for (const s of [...m.stats, 'burnout']) {
      assert.ok(m.statMeta[s], `statMeta missing '${s}'`);
      assert.equal(typeof m.statMeta[s].name, 'string');
    }
    // paths and winGates describe the same set of summits.
    assert.deepEqual(Object.keys(m.paths).sort(), Object.keys(m.winGates).sort(),
      'paths and winGates key sets must match');
  });

  // ── Generic readers: every winGates key must resolve through the engine's
  // gateValue (§3.3), with no fame/hits/clues special-case. A key that can't
  // be read is a summit that can never be judged. ──
  test(`[${pack.id}] every winGates key resolves via gateValue`, () => {
    const state = freshRun(pack);
    for (const gates of Object.values(pack.manifest.winGates)) {
      for (const key of Object.keys(gates)) {
        const v = engine.gateValue(state, key);
        assert.equal(typeof v, 'number', `gateValue('${key}') is not a number`);
        assert.ok(Number.isFinite(v), `gateValue('${key}') is not finite`);
      }
    }
  });

  // ── The core can actually RUN this pack: boot, play every act to a terminal
  // state, judge the finale — no throw, finite readings. This is the property
  // the probe pack exists to hold with zero stubs (Phase E). (LP finiteness is
  // asserted in Phase B, alongside the legacyPoints genre-asymmetry fix — today
  // legacyPoints hardcodes music stats, so a non-music LP is NaN.) ──
  test(`[${pack.id}] a full run reaches a terminal state with finite readings`, () => {
    for (const seed of [11, 424242, 987654321]) {
      const run = simulatePackRun(pack, seed);
      assert.equal(run.state.phase, 'ended', 'run did not terminate');
      assert.ok(run.finale || run.gameover, 'neither finale nor gameover');
      if (run.finale) {
        for (const r of run.finale.readings) {
          assert.ok(Number.isFinite(r.value), `reading '${r.key}' value not finite`);
          assert.ok(Number.isFinite(r.ratio), `reading '${r.key}' ratio not finite`);
        }
      }
    }
  });
}
