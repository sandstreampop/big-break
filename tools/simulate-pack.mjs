// Generic pack balance report: Monte-Carlo over ANY registered pack using the
// genre-neutral driver (tools/pack-core.mjs). The music game keeps its richer,
// policy-aware simulator (tools/simulate.mjs); this is the shared feel/reach
// report a second genre tunes against.
//
// Usage: node tools/simulate-pack.mjs <packId> [runs] [--seed=N]

import * as engine from '../dist/js/engine.js';
import { PACKS } from '../dist/js/packs/registry.js';
import { simulatePackRun } from './pack-core.mjs';

const args = process.argv.slice(2);
const packId = args[0];
const pack = PACKS.find((p) => p.id === packId);
if (!pack) {
  console.error(`unknown pack '${packId}' — registered: ${PACKS.map((p) => p.id).join(', ')}`);
  process.exit(1);
}
const RUNS = parseInt(args[1] || '2000', 10);
const seedArg = args.find((a) => a.startsWith('--seed='));
const BASE_SEED = seedArg ? parseInt(seedArg.split('=')[1], 10) : 0x5EED;

const seedGen = engine.mulberry32(BASE_SEED);
const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;

const tally = {
  byPathResult: {}, byEnding: {}, lp: 0,
  cardsSum: 0, dry: 0,
  tiers: { bad: 0, good: 0, incredible: 0, declined: 0 },
  reach: {}, flags: {},
  res: {}, resCount: 0,
  stats: {}, statCount: 0,
};

for (let i = 0; i < RUNS; i++) {
  const run = simulatePackRun(pack, nextSeed());
  const s = run.state;
  tally.dry += run.dry;
  const seen = new Set();
  for (const c of run.cards) {
    tally.tiers[c.tier] = (tally.tiers[c.tier] || 0) + 1;
    seen.add(c.id);
  }
  tally.cardsSum += run.cards.length;
  for (const id of seen) tally.reach[id] = (tally.reach[id] || 0) + 1;
  for (const f of s.flags || []) tally.flags[f] = (tally.flags[f] || 0) + 1;
  if (run.finale) {
    const key = `${run.finale.path}:${run.finale.result}`;
    tally.byPathResult[key] = (tally.byPathResult[key] || 0) + 1;
    for (const r of pack.manifest.resources) tally.res[r] = (tally.res[r] || 0) + (s[r] || 0);
    for (const st of [...pack.manifest.stats, 'burnout']) tally.stats[st] = (tally.stats[st] || 0) + (s.stats[st] || 0);
    tally.resCount++;
  }
  if (run.gameover) tally.byEnding[run.gameover] = (tally.byEnding[run.gameover] || 0) + 1;
  tally.lp += run.lp;
}

const pct = (n) => ((100 * n) / RUNS).toFixed(1) + '%';
console.log(`\n=== ${pack.id} — ${RUNS} runs, seed=${BASE_SEED} (pack-core narrative) ===`);
console.log(`avg cards/run ${(tally.cardsSum / RUNS).toFixed(1)} · deck-dry events ${tally.dry} · avg LP ${(tally.lp / RUNS).toFixed(1)}`);
const t = tally.tiers, tot = t.bad + t.good + t.incredible + (t.declined || 0) || 1;
console.log(`tiers: bad ${((100 * t.bad) / tot).toFixed(1)}% / good ${((100 * t.good) / tot).toFixed(1)}% / incredible ${((100 * t.incredible) / tot).toFixed(1)}% / declined ${((100 * (t.declined || 0)) / tot).toFixed(1)}%`);

console.log('\nfail states:');
for (const [k, v] of Object.entries(tally.byEnding).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v} (${pct(v)})`);
console.log('finale outcomes:');
const rollup = { success: 0, partial: 0, failure: 0 };
for (const [k, v] of Object.entries(tally.byPathResult).sort()) {
  console.log(`  ${k}: ${v} (${pct(v)})`);
  rollup[k.split(':')[1]] += v;
}
console.log(`  → success ${pct(rollup.success)} | partial ${pct(rollup.partial)} | failure ${pct(rollup.failure)}`);

if (tally.resCount) {
  const line = pack.manifest.resources.map((r) => `${r} ${(tally.res[r] / tally.resCount).toFixed(1)}`).join(' · ');
  const sline = [...pack.manifest.stats, 'burnout'].map((s2) => `${s2} ${(tally.stats[s2] / tally.resCount).toFixed(0)}`).join(' · ');
  console.log(`\navg at finale — resources: ${line}`);
  console.log(`avg at finale — stats: ${sline}`);
}

// Flag funnel: how often the run-shaping flags fire (a pack's beats/reveals).
console.log('\nflag funnel (≥1% of runs):');
for (const [f, n] of Object.entries(tally.flags).sort((a, b) => b[1] - a[1])) {
  if (n / RUNS >= 0.01) console.log(`  ${f}: ${pct(n)}`);
}

// Reach: never-drawn and rare cards.
const rows = pack.events.map((e) => ({
  id: e.id,
  gated: !!(e.requires || e.chainOnly || e.finaleCard || (e.pathAffinity || []).length),
  runs: tally.reach[e.id] || 0,
}));
const never = rows.filter((r) => !r.runs);
const neverOpen = never.filter((r) => !r.gated);
const under5 = rows.filter((r) => r.runs > 0 && r.runs / RUNS < 0.05);
console.log(`\ncard reach: ${rows.length - never.length}/${rows.length} appeared · never ${never.length} (${neverOpen.length} ungated) · under 5%: ${under5.length}`);
if (never.length) for (const r of never) console.log(`  never: ${r.gated ? '[gated]' : '[OPEN ⚠️]'} ${r.id}`);
if (under5.length) console.log('  under 5%: ' + under5.map((r) => `${r.id}(${(100 * r.runs / RUNS).toFixed(1)}%)`).join(', '));
