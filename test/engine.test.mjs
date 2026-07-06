// Direct unit tests for the engine's resolution math (Epic 9).
//
// The engine had ZERO direct unit coverage: the goldens pin that seeded
// behavior didn't CHANGE, and the invariants assert genre-neutral properties,
// but nothing asserted that the core arithmetic is CORRECT. These do — against
// the flagship music pack, which previously had only black-box coverage. They
// derive their expectations from the manifest (winGates, resources) rather than
// hardcoding numbers, so they stay green across balance tuning and only fail if
// the MECHANIC breaks.
//
// Run: node --test test/engine.test.mjs   (swept up by node --test test/*.test.mjs)

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { packById } from '../dist/js/packs/registry.js';

const music = packById('music');
const PATH = Object.keys(music.manifest.winGates)[0];

function freshMusic(seed = 1) {
  const persona = (music.loadouts.find((i) => i.unlockedByDefault) || music.loadouts[0]).id;
  const s = engine.newRun(music, persona, [], engine.mulberry32(seed), []);
  engine.useContentPack(music);
  return s;
}
// Set a gate/stat/resource key generically (stats live in state.stats, resources top-level).
function setKey(s, key, v) { if (key in s.stats) s.stats[key] = v; else s[key] = v; }

test('mulberry32 is deterministic and stays in [0, 1)', () => {
  const a = engine.mulberry32(42), b = engine.mulberry32(42);
  for (let i = 0; i < 200; i++) {
    const x = a();
    assert.equal(x, b(), 'same seed must replay identically');
    assert.ok(x >= 0 && x < 1, `draw ${x} out of range`);
  }
});

test('gateValue: stats from state.stats, resources top-level, unknown key = 0', () => {
  const s = freshMusic();
  s.stats.skill = 37;
  s.fame = 88;
  assert.equal(engine.gateValue(s, 'skill'), 37);
  assert.equal(engine.gateValue(s, 'fame'), 88);
  assert.equal(engine.gateValue(s, 'no_such_key'), 0);
});

test('applyEffects: stat deltas apply, clamp to 0..100, and are reported', () => {
  const s = freshMusic();
  s.stats.skill = 50;
  const deltas = engine.applyEffects(s, { skill: 10 }, null, null, engine.mulberry32(1));
  assert.equal(s.stats.skill, 60);
  assert.ok(deltas.some((d) => d.key === 'skill' && d.amount === 10), 'delta reported');
  s.stats.skill = 95;
  engine.applyEffects(s, { skill: 20 }, null, null, engine.mulberry32(1));
  assert.equal(s.stats.skill, 100, 'clamps at 100');
});

test('choiceOdds is a probability distribution summing to 1', () => {
  const s = freshMusic();
  const choice = { governingStats: { skill: 1 }, outcomes: { bad: { text: '', effects: {} }, good: { text: '', effects: {} }, incredible: { text: '', effects: {} } } };
  const o = engine.choiceOdds(s, choice);
  assert.ok(Math.abs(o.bad + o.good + o.incredible - 1) < 1e-9, 'odds sum to 1');
  for (const k of ['bad', 'good', 'incredible']) assert.ok(o[k] >= 0 && o[k] <= 1, `${k} in range`);
});

test('choiceOdds: a higher governing stat cannot raise Bad odds or lower Incredible odds', () => {
  const choice = { governingStats: { skill: 1 }, outcomes: { bad: { text: '', effects: {} }, good: { text: '', effects: {} }, incredible: { text: '', effects: {} } } };
  const lo = freshMusic(); lo.stats.skill = 10; lo.stats.burnout = 0; lo.badStreak = 0;
  const hi = freshMusic(); hi.stats.skill = 90; hi.stats.burnout = 0; hi.badStreak = 0;
  const oLo = engine.choiceOdds(lo, choice);
  const oHi = engine.choiceOdds(hi, choice);
  assert.ok(oHi.bad <= oLo.bad, `bad: ${oHi.bad} !<= ${oLo.bad}`);
  assert.ok(oHi.incredible >= oLo.incredible, `incredible: ${oHi.incredible} !>= ${oLo.incredible}`);
});

test('evaluateFinale: meeting every gate is success; zeroing them is not', () => {
  const win = freshMusic(); win.path = PATH;
  for (const [k, target] of Object.entries(music.manifest.winGates[PATH])) setKey(win, k, target);
  assert.equal(engine.evaluateFinale(win).result, 'success');

  const lose = freshMusic(); lose.path = PATH;
  for (const k of Object.keys(music.manifest.winGates[PATH])) setKey(lose, k, 0);
  const mr = music.manifest.momentumResource; if (mr) lose[mr] = 0;
  assert.notEqual(engine.evaluateFinale(lose).result, 'success');
});

test('evaluateFinale: the momentum clutch upgrades a near-miss — and only with momentum', () => {
  const mr = music.manifest.momentumResource;
  assert.ok(mr, 'music designates a momentum resource');
  const nearMiss = () => {
    const s = freshMusic(); s.path = PATH;
    // floor(0.9·target) < target for every target ≥ 1, so no gate is fully met
    // (a genuine near-miss), while every ratio stays ≥ the clutch's nearMiss bar.
    for (const [k, target] of Object.entries(music.manifest.winGates[PATH])) {
      setKey(s, k, Math.min(100, Math.floor(target * 0.9)));
    }
    return s;
  };
  const withMo = nearMiss(); withMo[mr] = 999;
  const noMo = nearMiss(); noMo[mr] = 0;
  assert.equal(engine.evaluateFinale(withMo).result, 'success', 'near-miss + momentum clutches');
  assert.notEqual(engine.evaluateFinale(noMo).result, 'success', 'same near-miss without momentum does not');
});

test('legacyPoints: finite integer ≥ 1, and the comeback flag scores ×1.2 (Epic 3 move)', () => {
  const s = freshMusic(); s.path = PATH;
  engine.evaluateFinale(s); // sets ending.result, which legacyPoints reads
  const base = engine.legacyPoints(s);
  assert.ok(Number.isInteger(base) && base >= 1, `LP ${base}`);
  // legacyPoints is a pure read; toggling the flag exercises the economy
  // plugin's scoreMult (where the ×1.2 now lives instead of the engine).
  s.flags = [...(s.flags || []), 'comeback'];
  const cb = engine.legacyPoints(s);
  assert.ok(cb > base, `comeback ${cb} should exceed base ${base}`);
  assert.ok(Math.abs(cb - base * 1.2) <= 1.5, `comeback ${cb} ≈ base×1.2 (${base * 1.2})`);
});

test('checkFailStates: burnout at the fail threshold ends the run; a healthy fresh run does not', () => {
  const s = freshMusic(); s.act = 1; s.stats.burnout = 0;
  assert.equal(engine.checkFailStates(s), null);
  s.stats.burnout = 100;
  assert.equal(engine.checkFailStates(s), 'burnout');
});

test('incredibleTargets covers every core stat plus the manifest incredibleResources', () => {
  engine.useContentPack(music);
  const t = new Set(engine.incredibleTargets());
  for (const stat of music.manifest.stats) assert.ok(t.has(stat), `stat ${stat} missing`);
  for (const r of music.manifest.incredibleResources || []) assert.ok(t.has(r), `resource ${r} missing`);
});
