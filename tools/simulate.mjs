// Balance simulator: plays thousands of runs through the real engine.
// Usage: node tools/simulate.mjs [runs] [policy]
//   policy: smart (default) | random

import { CONFIG, PATHS } from '../js/config.js';
import { INSTRUMENTS } from '../js/data/instruments.js';
import { EVENTS } from '../js/data/events.js';
import * as engine from '../js/engine.js';

const RUNS = parseInt(process.argv[2] || '4000', 10);
const POLICY = process.argv[3] || 'smart';

const DEFAULT_INSTRUMENTS = INSTRUMENTS.filter((i) => i.unlockedByDefault).map((i) => i.id);

function pathScore(state, pathId) {
  const g = CONFIG.winGates[pathId];
  let s = 0;
  for (const [k, target] of Object.entries(g)) {
    const v = k === 'fame' ? state.fame : k === 'hits' ? state.hits : state.stats[k];
    s += v / target;
  }
  return s;
}

// Rough per-side desirability for a "decent player"
function scoreChoice(state, choice) {
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

const tally = {
  ended: 0, byEnding: {}, byPathResult: {},
  lpTotal: 0, fameSum: 0, burnoutDeaths: 0,
  cardsSum: 0, drySum: 0,
  finaleStats: { skill: 0, cred: 0, creativity: 0, network: 0, burnout: 0, fame: 0, hits: 0, count: 0 },
  tierCounts: { bad: 0, good: 0, incredible: 0, declined: 0 },
  tiersByAct: { 1: { bad: 0, good: 0, incredible: 0, declined: 0 },
                2: { bad: 0, good: 0, incredible: 0, declined: 0 },
                3: { bad: 0, good: 0, incredible: 0, declined: 0 } },
  worstRunBadPct: 0, runsOver60Bad: 0,
};

for (let i = 0; i < RUNS; i++) {
  const inst = DEFAULT_INSTRUMENTS[Math.floor(Math.random() * DEFAULT_INSTRUMENTS.length)];
  const state = engine.newRun(inst, []);
  let cards = 0;
  let badCards = 0;
  let guard = 0;

  while (state.phase !== 'ended' && guard++ < 200) {
    if (state.phase === 'crossroads') {
      const best = Object.keys(PATHS).sort((a, b) => pathScore(state, b) - pathScore(state, a))[0];
      engine.commitPath(state, POLICY === 'random' ? Object.keys(PATHS)[Math.floor(Math.random() * 3)] : best);
      continue;
    }
    const ev = engine.drawNextCard(state);
    if (!ev) {
      tally.drySum++;
      state.cardsPlayedInAct = CONFIG.actLengths[state.act];
    } else {
      cards++;
      let side;
      if (POLICY === 'random') {
        side = Math.random() < 0.5 ? 'left' : 'right';
      } else if (POLICY === 'narrative') {
        // A human following the story: usually whim, sometimes the safer side
        side = Math.random() < 0.65
          ? (Math.random() < 0.5 ? 'left' : 'right')
          : (scoreChoice(state, ev.choices.left) >= scoreChoice(state, ev.choices.right) ? 'left' : 'right');
      } else {
        side = scoreChoice(state, ev.choices.left) >= scoreChoice(state, ev.choices.right) ? 'left' : 'right';
      }
      const act = state.act;
      // Encore usage: smart spends in act 2+, narrative spends on a whim
      const armEncore = (state.encore || 0) > 0 &&
        (POLICY === 'smart' ? state.act >= 2 : Math.random() < 0.5);
      const result = engine.resolveSwipe(state, side, Math.random, { encore: armEncore });
      tally.tierCounts[result.tier]++;
      tally.tiersByAct[act][result.tier]++;
      if (result.tier === 'bad') badCards++;
      const pend = result.deltas.pendingGear;
      if (pend) {
        if (state.accessories.length >= CONFIG.accessorySlots) {
          state.accessories.splice(Math.floor(Math.random() * state.accessories.length), 1);
        }
        engine.equipAccessory(state, pend.id);
      }
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') {
      const res = engine.evaluateFinale(state);
      const key = `${state.path}:${res.result}`;
      tally.byPathResult[key] = (tally.byPathResult[key] || 0) + 1;
      const f = tally.finaleStats;
      f.skill += state.stats.skill; f.cred += state.stats.cred;
      f.creativity += state.stats.creativity; f.network += state.stats.network;
      f.burnout += state.stats.burnout; f.fame += state.fame; f.hits += state.hits;
      f.count++;
    } else if (step.kind === 'gameover') {
      tally.byEnding[step.endingKey] = (tally.byEnding[step.endingKey] || 0) + 1;
      if (step.endingKey === 'burnout') tally.burnoutDeaths++;
    }
  }
  tally.ended++;
  tally.cardsSum += cards;
  tally.lpTotal += engine.legacyPoints(state);
  tally.fameSum += state.fame;
  if (cards >= 10) {
    const badPct = badCards / cards;
    tally.worstRunBadPct = Math.max(tally.worstRunBadPct, badPct);
    if (badPct > 0.6) tally.runsOver60Bad++;
  }
}

const pct = (n) => ((100 * n) / RUNS).toFixed(1) + '%';
console.log(`\n=== BIG BREAK simulation — ${RUNS} runs, policy=${POLICY} ===`);
console.log(`avg cards/run: ${(tally.cardsSum / RUNS).toFixed(1)}   deck-dry events: ${tally.drySum}`);
const t = tally.tierCounts, tot = t.bad + t.good + t.incredible + t.declined;
console.log(`tiers: bad ${((100 * t.bad) / tot).toFixed(1)}% / good ${((100 * t.good) / tot).toFixed(1)}% / incredible ${((100 * t.incredible) / tot).toFixed(1)}% / declined ${((100 * t.declined) / tot).toFixed(1)}%`);
for (const act of [1, 2, 3]) {
  const a = tally.tiersByAct[act], atot = a.bad + a.good + a.incredible + a.declined || 1;
  console.log(`  act ${act}: bad ${((100 * a.bad) / atot).toFixed(1)}% / good ${((100 * a.good) / atot).toFixed(1)}% / incredible ${((100 * a.incredible) / atot).toFixed(1)}%`);
}
console.log(`worst single-run bad rate: ${(100 * tally.worstRunBadPct).toFixed(0)}%   runs >60% bad: ${tally.runsOver60Bad} (${pct(tally.runsOver60Bad)})`);
console.log(`\nfail states (early game-overs):`);
for (const [k, v] of Object.entries(tally.byEnding)) console.log(`  ${k}: ${v} (${pct(v)})`);
console.log(`\nfinale outcomes:`);
const rollup = { success: 0, partial: 0, failure: 0 };
for (const [k, v] of Object.entries(tally.byPathResult).sort()) {
  console.log(`  ${k}: ${v} (${pct(v)})`);
  rollup[k.split(':')[1]] += v;
}
console.log(`  → success ${pct(rollup.success)} | partial ${pct(rollup.partial)} | failure ${pct(rollup.failure)}`);
if (tally.finaleStats.count) {
  const f = tally.finaleStats, c = f.count;
  console.log(`\navg finale stats: skill ${(f.skill / c).toFixed(0)} cred ${(f.cred / c).toFixed(0)} crea ${(f.creativity / c).toFixed(0)} net ${(f.network / c).toFixed(0)} burn ${(f.burnout / c).toFixed(0)} fame ${(f.fame / c).toFixed(0)} hits ${(f.hits / c).toFixed(1)}`);
}
console.log(`avg LP/run: ${(tally.lpTotal / RUNS).toFixed(1)}\n`);
