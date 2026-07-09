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
  const persona = (pack.loadouts.find((i) => i.unlockedByDefault) || pack.loadouts[0]).id;
  return engine.newRun(pack, persona, [], engine.mulberry32(1), []);
}

// Plugin registration order is load-bearing: the engine folds hooks in array
// order, and several plugins draw RNG in onConstruct/onRunStart/onActBreak, so
// a reorder silently shifts the whole seeded stream. The packs' own comments
// say "order matters" but nothing asserted it — a reorder would surface only as
// a cryptic golden diff. Pin the known-good order per pack so it fails LOUDLY
// (re-baseline the goldens deliberately if a reorder is intended).
const EXPECTED_PLUGIN_ORDER = {
  music: ['venue', 'rival', 'seeds', 'contract', 'weather', 'genre', 'loadout', 'gear', 'hustle', 'band', 'songs', 'economy'],
  'love-island': ['coupling', 'profile', 'characters', 'gossip', 'factions', 'coupleweb', 'producers', 'stirling'],
};

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

  // ── Run structure (ADR-0010): the manifest's segment list is the run's
  // macro shape, and the engine hardcodes no act count — so the list itself
  // must be well-formed. Linear, at least one segment, every length a positive
  // integer; a crossroads (the commit slot) can't sit on the terminal segment
  // (the finale shadows it — a commit with nothing after it is dead data); and
  // a pack that declares summits must offer a commit slot somewhere, or the
  // finale judges winGates[null]. ──
  test(`[${pack.id}] manifest declares a well-formed segment list`, () => {
    const m = pack.manifest;
    assert.ok(Array.isArray(m.segments) && m.segments.length >= 1, 'at least one segment');
    m.segments.forEach((seg, i) => {
      assert.ok(Number.isInteger(seg.length) && seg.length >= 1,
        `segment ${i + 1} length must be a positive integer`);
    });
    assert.ok(!m.segments[m.segments.length - 1].crossroads,
      'the terminal segment cannot be a crossroads');
    if (Object.keys(m.paths).length) {
      assert.ok(m.segments.some((s) => s.crossroads),
        'a pack with summits needs a crossroads segment to commit one');
    }
  });

  // ── Generic readers: every winGates key must resolve through the engine's
  // gateValue (§3.3), with no fame/hits special-case. A key that can't
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
    // The genuinely genre-neutral effect verbs — the engine's burnout slot plus
    // flag/chain/promise control, imported from the engine so this guards the
    // REAL set. Every music structural verb (setInstrument, grant/removeBandmate,
    // grantHustle, removeGear, grantGear) and chartTitle has left this list for
    // its owning plugin's effectVerbs (WP4); that the list SHRANK to this is the
    // proof the leak is gone.
    const known = new Set([
      ...pack.manifest.stats, ...pack.manifest.resources, ...engine.CORE_EFFECT_VERBS,
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

  // ── Open eligibility is safe (WP1): every `requires` key an eligible card
  // names must be OWNED — a genre-neutral core predicate (flags/money/burnout +
  // the generic stats/min/max gates) or a predicate exactly one plugin
  // registers (Plugin.requires). A stranded key (a card gating on a subsystem
  // the pack doesn't ship) is a silent no-op the engine swallows; this catches
  // it. Sibling of the effect-verb invariant, and the proof that the core
  // Requires names no genre's subsystems. ──
  test(`[${pack.id}] no eligible card names an unknown requires key`, () => {
    const NEUTRAL = engine.REQUIRES_NEUTRAL_KEYS;
    // Merge every plugin's predicate registry; assert no two plugins claim the
    // same key ("registered by exactly one plugin").
    const owners = new Map();
    for (const p of pack.plugins || []) {
      for (const key of Object.keys(p.requires || {})) {
        assert.ok(!owners.has(key), `requires key '${key}' registered by both '${owners.get(key)}' and '${p.id}'`);
        owners.set(key, p.id);
      }
    }
    const known = new Set([...NEUTRAL, ...owners.keys()]);
    const scan = (r, where) => {
      if (!r) return;
      for (const k of Object.keys(r)) {
        assert.ok(known.has(k), `${where}: unknown requires key '${k}'`);
      }
      if (r.anyOf) r.anyOf.forEach((alt, i) => scan(alt, `${where}.anyOf[${i}]`));
    };
    for (const ev of [...pack.events, ...pack.tutorialEvents]) scan(ev.requires, `${ev.id}.requires`);
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

  // ── Every DECLARED gate key resolves to a real stat or resource. ──
  // This is the loud, developer-facing catch that lets gateValue fall back
  // gracefully at runtime (a typo reads 0 + reports telemetry instead of
  // crashing a player's run): a mistyped winGates/failStates key fails HERE,
  // pre-ship, instead of silently making a gate unreachable in production.
  test(`[${pack.id}] all winGates/failStates keys resolve to a stat or resource`, () => {
    const m = pack.manifest;
    // Resolvable = a stat, universal burnout, a manifest resource, OR a plugin
    // stateDefault field (materialized top-level on state, so gateValue reads it
    // via `key in state` — e.g. LI's `story`, owned by the couple-web plugin).
    const known = new Set([...(m.stats || []), 'burnout', ...(m.resources || [])]);
    for (const p of pack.plugins || []) for (const k of Object.keys(p.stateDefaults || {})) known.add(k);
    for (const [path, gate] of Object.entries(m.winGates || {})) {
      for (const key of Object.keys(gate)) {
        assert.ok(known.has(key), `winGates.${path}.${key} is not a declared stat/resource`);
      }
    }
    for (const rule of m.failStates || []) {
      assert.ok(known.has(rule.key), `failState '${rule.ending}' key '${rule.key}' is not a declared stat/resource`);
    }
  });

  // ── Plugin registration order (per-pack, seeded-stream-critical). ──
  test(`[${pack.id}] plugin registration order is stable`, () => {
    const ids = (pack.plugins || []).map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate plugin ids');
    for (const id of ids) assert.ok(id, 'a plugin is missing an id');
    const expected = EXPECTED_PLUGIN_ORDER[pack.id];
    if (expected) {
      assert.deepEqual(ids, expected,
        'plugin order changed — this shifts the seeded RNG stream; re-baseline the goldens deliberately if intended');
    }
  });
}
