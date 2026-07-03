// Deterministic single-run driver for the MYSTERY pack + its golden trace.
// Sibling of tools/sim-core.mjs, but drives pack #2 through the same engine —
// the proof the engine is genre-agnostic. Each run is reproducible from its
// integer seed exactly as the music sim is.

import * as engine from '../dist/js/engine.js';
import { mysteryPack } from '../dist/js/packs/mystery.js';

export const PATHS = mysteryPack.manifest.paths;
export const PATH_IDS = Object.keys(PATHS);
export const PERSONAS = mysteryPack.loadouts.map((p) => p.id);

export function pathScore(state, pathId) {
  const g = mysteryPack.manifest.winGates[pathId];
  let s = 0;
  for (const [k, target] of Object.entries(g)) s += engine.gateValue(state, k) / target;
  return s;
}
function sideScore(state, choice) {
  const o = engine.choiceOdds(state, choice);
  let s = o.good + 2.4 * o.incredible - 1.4 * o.bad;
  const avgBurn = (['bad', 'good', 'incredible'].reduce((n, t) => n + (choice.outcomes[t].effects.burnout || 0), 0)) / 3;
  if (state.stats.burnout > 55) s -= avgBurn * 0.12;
  if (choice.cost && state.money < choice.cost) s -= 3;
  return s;
}

// Play one full mystery career deterministically from `seed`. Returns a record
// the sim tally and golden oracle both consume; `state` is the final state.
export function simulateMysteryRun(seed) {
  const meta = engine.mulberry32(seed >>> 0 || 1);
  const persona = PERSONAS[Math.floor(meta() * PERSONAS.length)];
  const state = engine.newRun(mysteryPack, persona, [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state);
  const cards = [];
  let dry = 0, finale = null, gameover = null, guard = 0;
  while (state.phase !== 'ended' && guard++ < 200) {
    if (state.phase === 'crossroads') {
      const best = PATH_IDS.slice().sort((a, b) => pathScore(state, b) - pathScore(state, a))[0];
      const pick = meta() < 0.4 ? PATH_IDS[Math.floor(meta() * PATH_IDS.length)] : best;
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
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') {
      const res = engine.evaluateFinale(state);
      finale = { path: state.path, result: res.result };
    } else if (step.kind === 'gameover') {
      gameover = step.endingKey;
    }
  }
  return { seed, cards, dry, finale, gameover, lp: engine.legacyPoints(state), state };
}

export function traceMysteryRun(seed) {
  const run = simulateMysteryRun(seed);
  const s = run.state;
  return {
    seed,
    cards: run.cards,
    dry: run.dry,
    finale: run.finale,
    gameover: run.gameover,
    lp: run.lp,
    stats: { ...s.stats },
    fame: s.fame, money: s.money, clues: s.clues || 0,
    pathProgress: s.pathProgress, rivalry: s.rivalry,
    ending: s.ending,
  };
}

export const GOLDEN_SEED = 0x3117; // mystery golden corpus seed
export const CORPUS_SIZE = 40;
export function corpus() {
  const gen = engine.mulberry32(GOLDEN_SEED);
  const out = [];
  for (let i = 0; i < CORPUS_SIZE; i++) out.push(Math.floor(gen() * 1e9) + 1);
  return out;
}
