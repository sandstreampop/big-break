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

  // ── Open vocabulary is safe (Phase C): every effect verb an eligible card
  // names must be OWNED — a manifest stat/resource, a genre-neutral core verb,
  // or a verb exactly one plugin declares (effectVerbs). A hallucinated or
  // stranded verb (a card that names a subsystem the pack doesn't ship) is a
  // silent no-op the engine would swallow; this catches it. ──
  test(`[${pack.id}] no eligible card names an unknown effect verb`, () => {
    const CORE_VERBS = ['burnout', 'chartTitle', 'addFlag', 'removeFlag', 'chainEventId',
      'addPromise', 'setInstrument', 'grantBandmate', 'removeBandmate', 'grantHustle',
      'removeGear', 'grantGear'];
    const known = new Set([
      ...pack.manifest.stats, ...pack.manifest.resources, ...CORE_VERBS,
      ...(pack.plugins || []).flatMap((p) => p.effectVerbs || []),
    ]);
    const scan = (effects, where) => {
      if (!effects) return;
      for (const k of Object.keys(effects)) {
        assert.ok(known.has(k), `${where}: unknown effect verb '${k}'`);
      }
      // Promises carry their own reward/penalty payloads.
      if (effects.addPromise) {
        scan(effects.addPromise.reward, `${where}.promise.reward`);
        scan(effects.addPromise.penalty, `${where}.promise.penalty`);
      }
    };
    for (const ev of [...pack.events, ...pack.tutorialEvents]) {
      for (const side of ['left', 'right']) {
        const c = ev.choices?.[side];
        if (!c) continue;
        for (const t of ['bad', 'good', 'incredible']) scan(c.outcomes?.[t]?.effects, `${ev.id}.${side}.${t}`);
      }
    }
  });

  // ── §2E symmetry: the INCREDIBLE payload multiplier must scale EVERY core
  // stat the pack declares — not a hardcoded music list that silently skips a
  // second genre's stats. Guards against re-coupling the multiplier to one
  // genre's vocabulary. This is a property per-pack goldens are blind to: each
  // pack's golden encodes its own (formerly asymmetric) output as "correct". ──
  test(`[${pack.id}] INCREDIBLE multiplier scales every manifest stat`, () => {
    engine.useContentPack(pack);
    const targets = new Set(engine.incredibleTargets());
    for (const s of pack.manifest.stats) {
      assert.ok(targets.has(s), `stat '${s}' is not in the INCREDIBLE payload set`);
    }
  });

  // ── The core can actually RUN this pack: boot, play every act to a terminal
  // state, judge the finale — no throw, finite readings, and a finite LP ≥ 1
  // (the legacyPoints genre-asymmetry fix: hardcoded music stats scored NaN for
  // any other genre). This is the property the probe pack holds with zero
  // stubs (Phase E). ──
  test(`[${pack.id}] a full run reaches a terminal state with finite readings and LP`, () => {
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
      assert.ok(Number.isFinite(run.lp) && run.lp >= 1, `LP=${run.lp} not a finite ≥1 number`);
    }
  });
}
