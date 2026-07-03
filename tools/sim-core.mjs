// Deterministic single-run driver + shared policy helpers.
//
// This is the seeded heart the balance simulator, the --check gate, and the
// golden-master oracle all share. One run is fully reproducible from its
// integer `seed`: the seed drives BOTH the engine's play RNG (via state.seed,
// exactly as the browser does) AND a separate meta-RNG for the sim's own
// choices (loadout, swipe sides, minigame skill).
//
// The sim mirrors the browser's call sequence exactly:
//   newRun(inst, packs, mulberry32(seed + 1), perks)   // construction rolls
//   state.seed = seed + 2                               // play RNG seed
//   drawNextCard(state, stateRng(state))
//   resolveSwipe(state, side, stateRng(state), opts)
// so a simulated career replays byte-identically to a real one on the same
// seed. The sim's whim (which side, how the minigame went) lives on a distinct
// meta stream (mulberry32(seed)) so it never perturbs the game's internal draws.

import { CONFIG } from '../dist/js/config.js';
import { INSTRUMENTS } from '../dist/js/data/instruments.js';
import { GENRES } from '../dist/js/data/genres.js';
import { VENUES } from '../dist/js/data/venues.js';
import * as engine from '../dist/js/engine.js';
import { musicPack } from '../dist/js/packs/music.js';
import { equipAccessory } from '../dist/js/packs/plugins/gear.js';
const PATHS = musicPack.manifest.paths;

export const DEFAULT_INSTRUMENTS = INSTRUMENTS.filter((i) => i.unlockedByDefault).map((i) => i.id);
export const ALL_PACKS = ['pack_divebar', 'pack_festival', 'pack_wedding', 'pack_cruise'];

export function pathScore(state, pathId) {
  const g = musicPack.manifest.winGates[pathId];
  let s = 0;
  for (const [k, target] of Object.entries(g)) {
    const v = engine.gateValue(state, k);
    s += v / target;
  }
  return s;
}

// Rough per-side desirability for a "decent player"
export function scoreChoice(state, choice) {
  const odds = engine.choiceOdds(state, choice);
  let score = odds.good + 2.4 * odds.incredible - 1.4 * odds.bad;
  // burnout hygiene: read the outcome payloads
  const avgBurnout =
    ((choice.outcomes.bad.effects.burnout || 0) +
      (choice.outcomes.good.effects.burnout || 0) +
      (choice.outcomes.incredible.effects.burnout || 0)) / 3;
  if (state.stats.burnout > 55) score -= avgBurnout * 0.12;
  if (state.stats.burnout > 55 && avgBurnout < 0) score += 1.2;
  if (choice.cost && state.money < choice.cost) score -= 3;
  return score;
}

// A "spike moment": one card that visibly bends the run — a single ±18
// stat/fame delta, ±$180, or a ≥30-point total swing.
export function isSpike(result) {
  let total = 0;
  for (const d of result.deltas) {
    if (d.key === 'money') {
      if (Math.abs(d.amount) >= 180) return true;
      total += Math.abs(d.amount) / 10;
    } else {
      if (Math.abs(d.amount) >= 18) return true;
      total += Math.abs(d.amount);
    }
  }
  return total >= 30;
}

// Play one full career deterministically from `seed` under `policy`
// ('smart' | 'narrative' | 'random'). Returns a record both the Monte-Carlo
// tally and the golden-master oracle consume; `state` is the final state.
export function simulateRun(seed, policy) {
  const meta = engine.mulberry32(seed >>> 0 || 1); // sim's own whim; never 0
  const inst = DEFAULT_INSTRUMENTS[Math.floor(meta() * DEFAULT_INSTRUMENTS.length)];
  // Human-shaped loadout: veterans have packs; most runs claim a sound
  // and adopt a room; some are comebacks facing an old nemesis.
  const packs = ALL_PACKS.filter(() => meta() < 0.5);
  const state = engine.newRun(musicPack, inst, packs, engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state); // seeded play RNG, exactly like the browser
  if (policy !== 'smart' || meta() < 0.7) {
    if (meta() < 0.7) state.genre = GENRES[Math.floor(meta() * GENRES.length)].id;
    if (meta() < 0.6) state.venue = VENUES[Math.floor(meta() * VENUES.length)].id;
  }
  if (meta() < 0.15) engine.applyComeback(state);
  state.nemesis = meta() < 0.2; // 3rd+ meeting with this rival (meta-run)

  const cards = [];   // resolved cards in order: {id, side, tier, act, spike, flashpoint}
  let dry = 0;
  let finale = null;
  let gameover = null;
  let guard = 0;

  while (state.phase !== 'ended' && guard++ < 200) {
    if (state.phase === 'crossroads') {
      const ids = Object.keys(PATHS);
      const best = ids.sort((a, b) => pathScore(state, b) - pathScore(state, a))[0];
      // narrative: humans pick the summit they WANT about as often as the
      // one the compass suggests — every path's deck must stay reachable
      const pick = policy === 'random' ? ids[Math.floor(meta() * 3)]
        : policy === 'narrative' && meta() < 0.45 ? ids[Math.floor(meta() * 3)]
        : best;
      engine.commitPath(state, pick);
      continue;
    }
    const ev = engine.drawNextCard(state, play);
    if (!ev) {
      dry++;
      state.cardsPlayedInAct = engine.actLength(state, state.act);
    } else {
      let side;
      if (policy === 'random') {
        side = meta() < 0.5 ? 'left' : 'right';
      } else if (policy === 'narrative') {
        // A human following the story: usually whim, sometimes the safer side
        side = meta() < 0.65
          ? (meta() < 0.5 ? 'left' : 'right')
          : (scoreChoice(state, ev.choices.left) >= scoreChoice(state, ev.choices.right) ? 'left' : 'right');
      } else {
        side = scoreChoice(state, ev.choices.left) >= scoreChoice(state, ev.choices.right) ? 'left' : 'right';
      }
      const act = state.act;
      // Encore usage: smart spends in act 2+, narrative spends on a whim
      const armEncore = (state.encore || 0) > 0 &&
        (policy === 'smart' ? state.act >= 2 : meta() < 0.5);
      // Minigame choices: model a mid-skill human (verdict distribution
      // roughly 15% botched / 35% scrappy / 35% solid / 15% golden), and
      // mirror ui.js's skill-echo flags so flag-gated cards are reachable.
      let mgBonus = 0;
      if (ev.choices[side].minigame) {
        const r = meta();
        mgBonus = r < 0.15 ? -8 : r < 0.5 ? 4 : r < 0.85 ? 14 : 24;
        if (r < 0.15 && !state.flags.includes('mg_botched')) state.flags.push('mg_botched');
        if (r >= 0.85) {
          if (!state.flags.includes('mg_golden')) state.flags.push('mg_golden');
          if (state.stats.burnout >= 60 && !state.flags.includes('mg_steady')) state.flags.push('mg_steady');
        }
      }
      const result = engine.resolveSwipe(state, side, play, { encore: armEncore, bonus: mgBonus });
      cards.push({
        id: ev.id, side, tier: result.tier, act,
        spike: isSpike(result), flashpoint: !!ev.flashpoint,
        // stat/resource deltas this card moved — the golden master's finest
        // behavioral grain (a refactor that shifts any number trips here)
        deltas: result.deltas.map((d) => [d.key, d.amount]),
      });
      const pend = result.deltas.pendingGear ||
        (result.deltas.pendingGearChoices ? result.deltas.pendingGearChoices[0] : null);
      if (pend) {
        if (state.accessories.length >= CONFIG.accessorySlots) {
          state.accessories.splice(Math.floor(meta() * state.accessories.length), 1);
        }
        equipAccessory(state, pend.id);
      }
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') {
      const res = engine.evaluateFinale(state);
      finale = { path: state.path, result: res.result, readings: res.readings };
    } else if (step.kind === 'gameover') {
      gameover = step.endingKey;
    }
  }

  return {
    seed, policy, cards, dry, finale, gameover,
    lp: engine.legacyPoints(state),
    state,
  };
}

// Comprehensive, JSON-serializable snapshot of one run's RUNTIME behavior —
// the golden-master oracle. Captures the tier/card log with per-card deltas,
// finale readings, LP, and the full run summary (stats, resources, songs,
// band, flags, chart peak). A byte-green refactor must reproduce this
// object exactly; any diff is a behavior change to explain, not accept.
export function runTrace(seed, policy) {
  const run = simulateRun(seed, policy);
  const s = run.state;
  return {
    seed, policy,
    cards: run.cards,
    dry: run.dry,
    finale: run.finale
      ? { path: run.finale.path, result: run.finale.result,
          readings: run.finale.readings.map((r) => ({
            key: r.key, target: r.target, value: r.value, met: r.met,
            ratio: Number(r.ratio.toFixed(6)),
          })) }
      : null,
    gameover: run.gameover,
    lp: run.lp,
    summary: engine.runSummary(s),
  };
}

