// Balance simulator: plays thousands of runs through the real engine.
// Usage: node tools/simulate.mjs [runs] [policy] [--seed=N]
//   policy: smart (default) | random | narrative
//   --seed: base seed for the deterministic run stream (default 0x1B16B00B)
//
// `narrative` models a human following the story (whim-heavy, decent
// instincts) with a human-shaped loadout: genres, venues, event packs,
// comeback runs, cross-run nemeses, and minigame flags — so pack-gated
// and flag-gated content is structurally reachable and the reach report
// below means something. Judge feel by `narrative`, not `smart`.
//
// Every run is now SEEDED (see tools/sim-core.mjs): the same base seed
// replays the same corpus of careers byte-for-byte, so this report is
// reproducible and the golden-master oracle can trust it.

import { CONFIG } from '../dist/js/config.js';
import { EVENTS } from '../dist/js/packs/music/data/events.js';
import { ARCS, arcById } from '../dist/js/packs/music/data/arcs.js';
import * as engine from '../dist/js/engine.js';
import { arcLit } from '../dist/js/packs/music/plugins/seeds.js';
import { simulateRun } from './sim-core.mjs';
import { musicPack } from '../dist/js/packs/music/pack.js';

// The success band is the PACK's declared contract (manifest.balanceBand),
// not this tool's opinion — one source for every driver (simulate-pack,
// pack-report, and this music-specific gate all read the same numbers).
const BAND = musicPack.manifest.balanceBand || { successMin: 25, successMax: 40 };

const args = process.argv.slice(2);
const seedArg = args.find((a) => a.startsWith('--seed='));
const positional = args.filter((a) => !a.startsWith('--'));
// --check: the CI gate. A fixed seed set under the human model (narrative),
// evaluated against hard balance/reach invariants; exit(1) on any breach.
// Separate from the free-running Monte-Carlo feel report.
const CHECK = args.includes('--check');
const RUNS = parseInt(positional[0] || (CHECK ? '4000' : '4000'), 10);
const POLICY = CHECK ? 'narrative' : (positional[1] || 'smart');
const CHECK_SEED = 0xC4EC; // pinned so the gate is reproducible run-to-run
const BASE_SEED = seedArg ? parseInt(seedArg.split('=')[1], 10) : (CHECK ? CHECK_SEED : 0x1B16B00B);

// Top-level seeded generator hands each run its own base seed, so the whole
// sim is reproducible from BASE_SEED while every career stays independent.
const seedGen = engine.mulberry32(BASE_SEED);
const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;

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

for (let i = 0; i < RUNS; i++) {
  const run = simulateRun(nextSeed(), POLICY);
  const state = run.state;
  const seenThisRun = new Set();
  let cards = 0;
  let badCards = 0;
  let spikes = 0;

  tally.drySum += run.dry;
  for (const c of run.cards) {
    cards++;
    seenThisRun.add(c.id);
    const sk = (tally.skew[c.id] = tally.skew[c.id] || { left: 0, right: 0 });
    sk[c.side]++;
    tally.tierCounts[c.tier]++;
    tally.tiersByAct[c.act][c.tier]++;
    if (c.tier === 'bad') badCards++;
    if (c.spike) spikes++;
    if (c.flashpoint) tally.flashpoints++;
  }

  if (run.finale) {
    const key = `${run.finale.path}:${run.finale.result}`;
    tally.byPathResult[key] = (tally.byPathResult[key] || 0) + 1;
    const f = tally.finaleStats;
    f.skill += state.stats.skill; f.cred += state.stats.cred;
    f.creativity += state.stats.creativity; f.network += state.stats.network;
    f.burnout += state.stats.burnout; f.fame += state.fame; f.hits += state.hits;
    f.count++;
  }
  if (run.gameover) {
    tally.byEnding[run.gameover] = (tally.byEnding[run.gameover] || 0) + 1;
    if (run.gameover === 'burnout') tally.burnoutDeaths++;
  }

  tally.ended++;
  tally.cardsSum += cards;
  tally.cardCountHist[cards] = (tally.cardCountHist[cards] || 0) + 1;
  tally.lpTotal += run.lp;
  tally.lpValues.push(run.lp);
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
    if (arcLit(state, arcId)) tally.seedsLit++;
    if (arc.payoffs.some((id) => seenThisRun.has(id))) tally.seedsPaid++;
  }
  if (cards >= 10) {
    const badPct = badCards / cards;
    tally.worstRunBadPct = Math.max(tally.worstRunBadPct, badPct);
    if (badPct > 0.6) tally.runsOver60Bad++;
  }
}

const pct = (n) => ((100 * n) / RUNS).toFixed(1) + '%';
const gates = {}; // gate metrics stashed by the report blocks, checked below
console.log(`\n=== BIG BREAK simulation — ${RUNS} runs, policy=${POLICY}, seed=${BASE_SEED} ===`);
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
// Songs win-path guard (Phase 4.5): hitfactory is the hits-gated summit, so
// its reachability is the canary that the extracted songs subsystem still
// mints and crowns songs.
gates.hitfactorySuccessPct = (100 * (tally.byPathResult['hitfactory:success'] || 0)) / RUNS;
{
  // R4 gate: careers should be losable — the manifest's declared success band
  const s = (100 * rollup.success) / RUNS;
  const inBand = s >= BAND.successMin && s <= BAND.successMax;
  gates.successPct = s;
  console.log(`  success band ${BAND.successMin}–${BAND.successMax}%: ${inBand ? '✓ in band' : `✗ OUT OF BAND (${s.toFixed(1)}%)`}`);
}
if (tally.finaleStats.count) {
  const f = tally.finaleStats, c = f.count;
  gates.avgHits = f.hits / c;
  console.log(`\navg finale stats: skill ${(f.skill / c).toFixed(0)} cred ${(f.cred / c).toFixed(0)} crea ${(f.creativity / c).toFixed(0)} net ${(f.network / c).toFixed(0)} burn ${(f.burnout / c).toFixed(0)} fame ${(f.fame / c).toFixed(0)} hits ${(f.hits / c).toFixed(1)}`);
}

{
  // ── Story Seeds funnel (R1): target ≥65% of seeded arcs paying off ──
  const litPct = (100 * tally.seedsLit) / (tally.seedsRolled || 1);
  const paidPct = (100 * tally.seedsPaid) / (tally.seedsRolled || 1);
  gates.seedLitPct = litPct;
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
  // The gate that matters: 0 never-drawn UNGATED cards (genuinely dead
  // content). The <1% count is a softer signal, and it must exclude content
  // that is rare BY DESIGN, not by neglect:
  //   • flashpoints — windowed to ~25% of runs, one per run
  //   • variety-pool gates (weatherIs / rivalIs / bandHas) — the doubling
  //     pass took weather to 24, rivals to 22, bandmates to 20, so a card
  //     keyed to one specific member tops out at ~4–5% of runs by pure
  //     arithmetic. That rarity IS the replayability (a rotating cast across
  //     runs), not buried content. Counting them would just penalize variety.
  // Everything else still has to clear the bar, so an over-gated OPEN-ish
  // card can't hide behind the exemption.
  const VARIETY_KEYS = ['weatherIs', 'rivalIs', 'bandHas'];
  const varietyGated = (r) => {
    if (!r) return false;
    for (const k of VARIETY_KEYS) if (r[k] !== undefined) return true;
    return (r.anyOf || []).some(varietyGated);
  };
  // Arc setup/payoff cards have their own delivery (Story Seeds boosts a
  // seeded arc's cards 4×) — tracked by the "payoff drawn" funnel above, not
  // by raw per-run frequency. Like packs/flashpoints, they're rare across ALL
  // runs by design but reliably reached in the runs that root for them.
  const arcCards = new Set(ARCS.flatMap((a) => [...a.setup, ...a.payoffs]));
  const rows = EVENTS.map((e) => ({
    id: e.id,
    gated: !!(e.requires || e.pack || e.chainOnly || e.finaleCard || (e.pathAffinity || []).length),
    flash: !!e.flashpoint,
    variety: varietyGated(e.requires), // rare by design, not by neglect
    arc: arcCards.has(e.id),           // scheduled by Story Seeds, not frequency
    runs: tally.reach[e.id] || 0,
  }));
  const exempt = (r) => r.flash || r.variety || r.arc;
  const never = rows.filter((r) => !r.runs);
  const neverOpen = never.filter((r) => !r.gated && !exempt(r));
  const under1 = rows.filter((r) => r.runs > 0 && r.runs / RUNS < 0.01 && !exempt(r));
  const under5 = rows.filter((r) => r.runs / RUNS < 0.05 && !exempt(r));
  const varietyRare = rows.filter((r) => r.variety && r.runs / RUNS < 0.05).length;
  console.log(`\ncard reach: ${rows.length - never.length}/${rows.length} cards appeared` +
    ` · never: ${never.length} (${neverOpen.length} ungated) · <1%: ${under1.length} · <5%: ${under5.length}` +
    ` · variety-gated rare (exempt): ${varietyRare}`);
  // Cap scales with deck size AND reflects reactive-content density: the
  // doubling pass added a large tail of state-gated act-3 cards (high-burnout
  // fear beats, broke-at-the-top, comeback-only, faded-song callbacks) that a
  // cautious, cash-flush narrative policy under-triggers. They aren't buried —
  // the ungated-never-drawn gate above is the real dead-content guard and
  // stays at 0 — they're conditional by design, waiting for the run that
  // earns them. 7% of the deck is the honest floor for that conditional tail.
  const under1Cap = Math.max(10, Math.round(EVENTS.length * 0.07));
  const under1Count = never.filter((r) => !exempt(r)).length + under1.length;
  gates.neverOpen = neverOpen.length;
  gates.under1Count = under1Count;
  gates.under1Cap = under1Cap;
  console.log(`  gate — never-drawn ungated = 0: ${neverOpen.length === 0 ? '✓' : '✗ FAIL'}` +
    `   gate — non-exempt under 1% ≤ ${under1Cap}: ${under1Count <= under1Cap ? '✓' : `✗ FAIL (${under1Count})`}`);
  if (never.length) {
    console.log('  never drawn:');
    for (const r of never) console.log(`    ${r.variety ? '[variety]' : r.arc ? '[arc]' : r.gated ? '[gated]' : (exempt(r) ? '[flash]' : '[OPEN ⚠️]')} ${r.id}`);
  }
  if (under1.length) {
    console.log('  under 1% of runs (non-exempt): ' + under1.map((r) => r.id).join(', '));
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

if (CHECK) {
  // ── CI gate (Phase 0.3) ── hard invariants on the human model. A breach
  // exits non-zero so the deploy workflow blocks. Thresholds sit where the
  // healthy game lives today (success ~32%, seed-lit ~87%, 0 dead cards)
  // with margin, so noise never trips them but real regressions do.
  const checks = [
    { name: `success band ${BAND.successMin}–${BAND.successMax}%`,
      ok: gates.successPct >= BAND.successMin && gates.successPct <= BAND.successMax,
      detail: `${gates.successPct.toFixed(1)}%` },
    { name: 'never-drawn ungated cards = 0',
      ok: gates.neverOpen === 0,
      detail: `${gates.neverOpen}` },
    { name: 'story-seed funnel: lit ≥ 65%',
      ok: gates.seedLitPct >= 65,
      detail: `${gates.seedLitPct.toFixed(0)}%` },
    { name: `non-exempt under-1% ≤ ${gates.under1Cap}`,
      ok: gates.under1Count <= gates.under1Cap,
      detail: `${gates.under1Count}` },
    // Songs win-path (Phase 4.5): the hitfactory summit must stay reachable and
    // songs must still be minted — guards the extracted subsystem's win-path.
    { name: 'songs win-path: hitfactory success ≥ 1%',
      ok: gates.hitfactorySuccessPct >= 1,
      detail: `${gates.hitfactorySuccessPct.toFixed(1)}%` },
    { name: 'songs minted: avg finale hits ≥ 0.2',
      ok: gates.avgHits >= 0.2,
      detail: `${(gates.avgHits ?? 0).toFixed(2)}` },
  ];
  console.log(`=== --check gates (seed=${BASE_SEED}, ${RUNS} runs, ${POLICY}) ===`);
  let failed = 0;
  for (const c of checks) {
    console.log(`  ${c.ok ? '✓' : '✗ FAIL'}  ${c.name}  (${c.detail})`);
    if (!c.ok) failed++;
  }
  if (failed) {
    console.error(`\n✗ ${failed} gate(s) breached — deploy blocked.\n`);
    process.exit(1);
  }
  console.log(`\n✓ all ${checks.length} gates passed.\n`);
}
