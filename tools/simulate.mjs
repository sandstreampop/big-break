// Balance simulator: plays thousands of runs through the real engine.
// Usage: node tools/simulate.mjs [runs] [policy]
//   policy: smart (default) | random | narrative
//
// `narrative` models a human following the story (whim-heavy, decent
// instincts) with a human-shaped loadout: genres, venues, event packs,
// comeback runs, cross-run nemeses, and minigame flags — so pack-gated
// and flag-gated content is structurally reachable and the reach report
// below means something. Judge feel by `narrative`, not `smart`.

import { CONFIG, PATHS } from '../js/config.js';
import { INSTRUMENTS } from '../js/data/instruments.js';
import { EVENTS } from '../js/data/events.js';
import { GENRES } from '../js/data/genres.js';
import { VENUES } from '../js/data/venues.js';
import { ARCS, arcById } from '../js/data/arcs.js';
import * as engine from '../js/engine.js';

const RUNS = parseInt(process.argv[2] || '4000', 10);
const POLICY = process.argv[3] || 'smart';

const DEFAULT_INSTRUMENTS = INSTRUMENTS.filter((i) => i.unlockedByDefault).map((i) => i.id);
const ALL_PACKS = ['pack_divebar', 'pack_festival'];

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
  skew: {},
  ended: 0, byEnding: {}, byPathResult: {},
  lpTotal: 0, lpValues: [], fameSum: 0, burnoutDeaths: 0,
  cardsSum: 0, drySum: 0,
  finaleStats: { skill: 0, cred: 0, creativity: 0, network: 0, burnout: 0, fame: 0, hits: 0, count: 0 },
  tierCounts: { bad: 0, good: 0, incredible: 0, declined: 0 },
  tiersByAct: { 1: { bad: 0, good: 0, incredible: 0, declined: 0 },
                2: { bad: 0, good: 0, incredible: 0, declined: 0 },
                3: { bad: 0, good: 0, incredible: 0, declined: 0 } },
  worstRunBadPct: 0, runsOver60Bad: 0,
  reach: {},          // eventId -> number of runs in which it appeared
  seedsRolled: 0, seedsLit: 0, seedsPaid: 0, // Story Seeds funnel (R1)
  flashpoints: 0, // U2: runs that hit their flashpoint
  spikeSum: 0,        // total ±20-point swing moments across all runs
  spikeRuns0: 0,      // runs with zero swing moments
  cardCountHist: {},  // cards-per-run distribution (rhythm variance)
};

// A "spike moment" (RUSH §5b): one card that visibly bends the run —
// a single ±18 stat/fame delta, ±$180, or a ≥30-point total swing.
function isSpike(result) {
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

for (let i = 0; i < RUNS; i++) {
  const inst = DEFAULT_INSTRUMENTS[Math.floor(Math.random() * DEFAULT_INSTRUMENTS.length)];
  // Human-shaped loadout: veterans have packs; most runs claim a sound
  // and adopt a room; some are comebacks facing an old nemesis.
  const packs = ALL_PACKS.filter(() => Math.random() < 0.5);
  const state = engine.newRun(inst, packs);
  if (POLICY !== 'smart' || Math.random() < 0.7) {
    if (Math.random() < 0.7) state.genre = GENRES[Math.floor(Math.random() * GENRES.length)].id;
    if (Math.random() < 0.6) state.venue = VENUES[Math.floor(Math.random() * VENUES.length)].id;
  }
  if (Math.random() < 0.15) engine.applyComeback(state);
  state.nemesis = Math.random() < 0.2; // 3rd+ meeting with this rival (meta-run)
  let cards = 0;
  let badCards = 0;
  let spikes = 0;
  let guard = 0;
  const seenThisRun = new Set();

  while (state.phase !== 'ended' && guard++ < 200) {
    if (state.phase === 'crossroads') {
      const ids = Object.keys(PATHS);
      const best = ids.sort((a, b) => pathScore(state, b) - pathScore(state, a))[0];
      // narrative: humans pick the summit they WANT about as often as the
      // one the compass suggests — every path's deck must stay reachable
      const pick = POLICY === 'random' ? ids[Math.floor(Math.random() * 3)]
        : POLICY === 'narrative' && Math.random() < 0.45 ? ids[Math.floor(Math.random() * 3)]
        : best;
      engine.commitPath(state, pick);
      continue;
    }
    const ev = engine.drawNextCard(state);
    if (!ev) {
      tally.drySum++;
      state.cardsPlayedInAct = engine.actLength(state, state.act);
    } else {
      cards++;
      seenThisRun.add(ev.id);
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
      // Minigame choices: model a mid-skill human (verdict distribution
      // roughly 15% botched / 35% scrappy / 35% solid / 15% golden), and
      // mirror ui.js's skill-echo flags so flag-gated cards are reachable.
      let mgBonus = 0;
      if (ev.choices[side].minigame) {
        const r = Math.random();
        mgBonus = r < 0.15 ? -8 : r < 0.5 ? 4 : r < 0.85 ? 14 : 24;
        if (r < 0.15 && !state.flags.includes('mg_botched')) state.flags.push('mg_botched');
        if (r >= 0.85) {
          if (!state.flags.includes('mg_golden')) state.flags.push('mg_golden');
          if (state.stats.burnout >= 60 && !state.flags.includes('mg_steady')) state.flags.push('mg_steady');
        }
      }
      const result = engine.resolveSwipe(state, side, Math.random, { encore: armEncore, bonus: mgBonus });
      const sk = (tally.skew[ev.id] = tally.skew[ev.id] || { left: 0, right: 0 });
      sk[side]++;
      tally.tierCounts[result.tier]++;
      tally.tiersByAct[act][result.tier]++;
      if (result.tier === 'bad') badCards++;
      if (isSpike(result)) spikes++;
      if (ev.flashpoint) tally.flashpoints++;
      const pend = result.deltas.pendingGear ||
        (result.deltas.pendingGearChoices ? result.deltas.pendingGearChoices[0] : null);
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
  tally.cardCountHist[cards] = (tally.cardCountHist[cards] || 0) + 1;
  const lp = engine.legacyPoints(state);
  tally.lpTotal += lp;
  tally.lpValues.push(lp);
  tally.fameSum += state.fame;
  tally.spikeSum += spikes;
  if (!spikes) tally.spikeRuns0++;
  for (const id of seenThisRun) tally.reach[id] = (tally.reach[id] || 0) + 1;
  // Story Seeds funnel: did each seeded arc light? did a payoff card land?
  for (const arcId of state.seeds || []) {
    const arc = arcById(arcId);
    if (!arc) continue;
    tally.seedsRolled++;
    // "lit" = the arc condition held by run end; "paid" = a payoff card landed
    if (engine.arcLit(state, arcId)) tally.seedsLit++;
    if (arc.payoffs.some((id) => seenThisRun.has(id))) tally.seedsPaid++;
  }
  if (cards >= 10) {
    const badPct = badCards / cards;
    tally.worstRunBadPct = Math.max(tally.worstRunBadPct, badPct);
    if (badPct > 0.6) tally.runsOver60Bad++;
  }
}

const pct = (n) => ((100 * n) / RUNS).toFixed(1) + '%';
console.log(`\n=== BIG BREAK simulation — ${RUNS} runs, policy=${POLICY} ===`);
console.log(`avg cards/run: ${(tally.cardsSum / RUNS).toFixed(1)}   deck-dry events: ${tally.drySum}`);
{
  // run-length spread (RUSH U5 wants the 29–32 metronome broken)
  const lens = Object.keys(tally.cardCountHist).map(Number).sort((a, b) => a - b);
  if (lens.length) console.log(`run length: ${lens[0]}–${lens[lens.length - 1]} cards (${lens.length} distinct lengths)`);
}
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
{
  // R4 gate: careers should be losable — success band 25–40% (narrative)
  const s = (100 * rollup.success) / RUNS;
  const inBand = s >= 25 && s <= 40;
  console.log(`  success band 25–40%: ${inBand ? '✓ in band' : `✗ OUT OF BAND (${s.toFixed(1)}%)`}`);
}
if (tally.finaleStats.count) {
  const f = tally.finaleStats, c = f.count;
  console.log(`\navg finale stats: skill ${(f.skill / c).toFixed(0)} cred ${(f.cred / c).toFixed(0)} crea ${(f.creativity / c).toFixed(0)} net ${(f.network / c).toFixed(0)} burn ${(f.burnout / c).toFixed(0)} fame ${(f.fame / c).toFixed(0)} hits ${(f.hits / c).toFixed(1)}`);
}

{
  // ── Story Seeds funnel (R1): target ≥65% of seeded arcs paying off ──
  const litPct = (100 * tally.seedsLit) / (tally.seedsRolled || 1);
  const paidPct = (100 * tally.seedsPaid) / (tally.seedsRolled || 1);
  console.log(`\nstory seeds: ${tally.seedsRolled} rolled · lit ${litPct.toFixed(0)}% · payoff drawn ${paidPct.toFixed(0)}% (target ≥65%)`);
}

{
  // ── Variance index (RUSH §5b): spike moments per run + LP spread ──
  const avgSpikes = tally.spikeSum / RUNS;
  const mean = tally.lpTotal / RUNS;
  const sd = Math.sqrt(tally.lpValues.reduce((s, v) => s + (v - mean) ** 2, 0) / RUNS);
  console.log(`\nvariance index: ${avgSpikes.toFixed(2)} spike moments/run (target ≥2)` +
    ` · ${pct(tally.spikeRuns0)} of runs flatlined (zero spikes) · LP stddev ${sd.toFixed(1)}` +
    ` · flashpoints in ${pct(tally.flashpoints)} of runs (target ~25%)`);
}

{
  // ── Card-reach report (REACH §5a): find the invisible content ──
  // Gates: 0 never-drawn ungated cards; ≤10 cards under 1% of runs.
  const rows = EVENTS.map((e) => ({
    id: e.id,
    gated: !!(e.requires || e.pack || e.chainOnly || e.finaleCard || (e.pathAffinity || []).length),
    flash: !!e.flashpoint, // windowed by design: ~25% of runs share the pool
    runs: tally.reach[e.id] || 0,
  }));
  const never = rows.filter((r) => !r.runs);
  const neverOpen = never.filter((r) => !r.gated && !r.flash);
  const under1 = rows.filter((r) => r.runs > 0 && r.runs / RUNS < 0.01 && !r.flash);
  const under5 = rows.filter((r) => r.runs / RUNS < 0.05 && !r.flash);
  console.log(`\ncard reach: ${rows.length - never.length}/${rows.length} cards appeared` +
    ` · never: ${never.length} (${neverOpen.length} ungated) · <1%: ${under1.length} · <5%: ${under5.length}`);
  console.log(`  gate — never-drawn ungated = 0: ${neverOpen.length === 0 ? '✓' : '✗ FAIL'}` +
    `   gate — cards under 1% ≤ 10: ${never.length + under1.length <= 10 ? '✓' : `✗ FAIL (${never.length + under1.length})`}`);
  if (never.length) {
    console.log('  never drawn:');
    for (const r of never) console.log(`    ${r.gated ? '[gated]' : '[OPEN ⚠️]'} ${r.id}`);
  }
  if (under1.length) {
    console.log('  under 1% of runs: ' + under1.map((r) => r.id).join(', '));
  }
}

{
  // Degenerate-choice report: cards the policy swipes one way ≥90% of the
  // time on ≥40 sightings. CAVEAT: under `smart` (pure odds-argmax) any
  // consistent odds edge saturates to ~100%, so this is a structural
  // linter for asymmetric rolls — the authoritative fake-choice detector
  // is the live swipe telemetry (see docs/telemetry.md, Insight 1).
  const rows = Object.entries(tally.skew)
    .map(([id, s]) => ({ id, n: s.left + s.right, skew: Math.round((100 * Math.max(s.left, s.right)) / (s.left + s.right)), dir: s.left >= s.right ? 'L' : 'R' }))
    .filter((r) => r.n >= 40 && r.skew >= 90)
    .sort((a, b) => b.skew - a.skew);
  if (rows.length) {
    console.log('\ndegenerate-choice suspects (≥90% one side, ≥40 plays):');
    for (const r of rows.slice(0, 12)) console.log(`  ${r.skew}% ${r.dir}  ${r.id} (${r.n})`);
  } else {
    console.log('\ndegenerate-choice suspects: none at ≥90% skew');
  }
}
console.log(`avg LP/run: ${(tally.lpTotal / RUNS).toFixed(1)}\n`);
