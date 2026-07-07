// Generic, pack-agnostic deterministic run driver. It reads EVERYTHING from the
// injected pack's manifest (stats, resources, paths, winGates) and knows nothing
// about any one genre — which is what lets the cross-pack property invariants and
// the probe pack's golden run the SAME driver over every registered pack, the
// executable proof that a run is genre-neutral.
//
// One run is fully reproducible from its integer `seed`, exactly as the
// browser drives it: newRun on mulberry32(seed+1), state.seed = seed+2, then
// drawNextCard / resolveSwipe on the seeded play RNG.

import * as engine from '../dist/js/engine.js';
import { equipAccessory } from '../dist/js/packs/music/plugins/gear.js';

// Sum of (value / gate target) across a path's winGates, read generically via
// the engine's gateValue — no per-resource special-casing.
export function pathScore(pack, state, pathId) {
  const g = pack.manifest.winGates[pathId];
  let s = 0;
  for (const [k, target] of Object.entries(g)) s += engine.gateValue(state, k) / target;
  return s;
}

function sideScore(state, choice) {
  const o = engine.choiceOdds(state, choice);
  let s = o.good + 2.4 * o.incredible - 1.4 * o.bad;
  const avgBurn = ['bad', 'good', 'incredible']
    .reduce((n, t) => n + (choice.outcomes[t].effects.burnout || 0), 0) / 3;
  if (state.stats.burnout > 55) s -= avgBurn * 0.12;
  if (choice.cost && state.money < choice.cost) s -= 3;
  return s;
}

// Play one full career for `pack` deterministically from `seed`. Genre-neutral:
// picks a default persona, commits the compass-preferred summit, whim-swipes on
// a seeded meta stream, and force-advances a dry act — all in terms the manifest
// defines. Returns the record the invariants and golden both consume.
export function simulatePackRun(pack, seed, policy = 'narrative') {
  const meta = engine.mulberry32(seed >>> 0 || 1);
  const personas = pack.loadouts.filter((i) => i.unlockedByDefault).map((i) => i.id);
  const persona = personas[Math.floor(meta() * personas.length)] || pack.loadouts[0].id;
  const state = engine.newRun(pack, persona, [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state);
  const pathIds = Object.keys(pack.manifest.paths);

  const cards = [];
  let dry = 0, finale = null, gameover = null, guard = 0;
  while (state.phase !== 'ended' && guard++ < 300) {
    if (state.phase === 'crossroads') {
      const best = pathIds.slice().sort((a, b) => pathScore(pack, state, b) - pathScore(pack, state, a))[0];
      const pick = policy === 'random' || meta() < 0.4
        ? pathIds[Math.floor(meta() * pathIds.length)] : best;
      engine.commitPath(state, pick);
      continue;
    }
    const ev = engine.drawNextCard(state, play);
    if (!ev) {
      dry++;
      state.cardsPlayedInAct = engine.actLength(state, state.act);
    } else {
      const side = meta() < 0.6
        ? (meta() < 0.5 ? 'left' : 'right')
        : (sideScore(state, ev.choices.left) >= sideScore(state, ev.choices.right) ? 'left' : 'right');
      const act = state.act;
      const result = engine.resolveSwipe(state, side, play, {});
      cards.push({ id: ev.id, side, tier: result.tier, act, deltas: result.deltas.map((d) => [d.key, d.amount]) });
      const pend = result.deltas.pendingGear ||
        (result.deltas.pendingGearChoices ? result.deltas.pendingGearChoices[0] : null);
      if (pend) equipAccessory(state, pend.id);
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') {
      const res = engine.evaluateFinale(state);
      finale = { path: state.path, result: res.result,
        readings: res.readings.map((r) => ({ key: r.key, target: r.target, value: r.value, met: r.met, ratio: Number(r.ratio.toFixed(6)) })) };
    } else if (step.kind === 'gameover') {
      gameover = step.endingKey;
    }
  }
  return { seed, cards, dry, finale, gameover, lp: engine.legacyPoints(state), state };
}

// JSON-serializable trace: the manifest's stats + resources by name, the
// finale readings, the ending, and the per-card deltas. Genre-neutral, so it
// pins ANY pack's runtime behavior.
export function tracePackRun(pack, seed) {
  const run = simulatePackRun(pack, seed);
  const s = run.state;
  const stats = {};
  for (const k of [...pack.manifest.stats, 'burnout']) stats[k] = s.stats[k];
  const resources = {};
  for (const k of pack.manifest.resources) resources[k] = s[k] ?? 0;
  return {
    seed,
    cards: run.cards,
    dry: run.dry,
    finale: run.finale,
    gameover: run.gameover,
    lp: run.lp,
    stats,
    resources,
    ending: s.ending,
  };
}

// Golden corpus constants — kept HERE (a side-effect-free module) so each
// checker and generator import them without triggering a golden rewrite.
export const PROBE_GOLDEN_SEED = 0x9403B;
export const PROBE_CORPUS_SIZE = 20;
export const LI_GOLDEN_SEED = 0x10A11D;
export const LI_CORPUS_SIZE = 24;

// A small pinned corpus for a pack, seeds drawn from one generator so the
// generator and checker always agree.
export function packCorpus(goldenSeed, size) {
  const gen = engine.mulberry32(goldenSeed);
  const out = [];
  for (let i = 0; i < size; i++) out.push(Math.floor(gen() * 1e9) + 1);
  return out;
}
