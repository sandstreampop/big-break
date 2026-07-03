// Mystery pack balance simulator + gate (Phase 5). Deterministic, seeded,
// driving the MYSTERY pack through the same engine as the music game — the
// proof the engine is genre-agnostic. Shares its single-run driver with the
// mystery golden (tools/mystery-core.mjs). The music golden is untouched.
//
// Usage: node tools/mystery-sim.mjs [runs] [--seed=N] [--check]

import * as engine from '../dist/js/engine.js';
import { mysteryPack } from '../dist/js/packs/mystery.js';
import { simulateMysteryRun, PATH_IDS } from './mystery-core.mjs';

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const seedArg = args.find((a) => a.startsWith('--seed='));
const RUNS = parseInt(args.find((a) => !a.startsWith('--')) || '4000', 10);
const BASE_SEED = seedArg ? parseInt(seedArg.split('=')[1], 10) : (CHECK ? 0x111ED : 0x5EED);

const seedGen = engine.mulberry32(BASE_SEED);
const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;

const tally = { byResult: { success: 0, partial: 0, failure: 0 }, byPath: {}, gameover: {},
  drySum: 0, cardsSum: 0, reach: {}, finale: { count: 0, stats: {}, clues: 0 } };
const pathSuccess = {};

for (let i = 0; i < RUNS; i++) {
  const run = simulateMysteryRun(nextSeed());
  const state = run.state;
  tally.drySum += run.dry;
  tally.cardsSum += run.cards.length;
  for (const c of run.cards) tally.reach[c.id] = (tally.reach[c.id] || 0) + 1;
  if (run.finale) {
    tally.byResult[run.finale.result]++;
    tally.byPath[`${run.finale.path}:${run.finale.result}`] = (tally.byPath[`${run.finale.path}:${run.finale.result}`] || 0) + 1;
    if (run.finale.result === 'success') pathSuccess[run.finale.path] = (pathSuccess[run.finale.path] || 0) + 1;
    const f = tally.finale; f.count++; f.clues += state.clues || 0;
    for (const s of mysteryPack.manifest.stats) f.stats[s] = (f.stats[s] || 0) + state.stats[s];
  }
  if (run.gameover) tally.gameover[run.gameover] = (tally.gameover[run.gameover] || 0) + 1;
}

const pct = (n) => ((100 * n) / RUNS).toFixed(1) + '%';
console.log(`\n=== MYSTERY simulation — ${RUNS} runs, seed=${BASE_SEED} ===`);
console.log(`avg cards/run: ${(tally.cardsSum / RUNS).toFixed(1)}   deck-dry: ${tally.drySum} (avg ${(tally.drySum / RUNS).toFixed(2)}/run)`);
console.log(`finale: success ${pct(tally.byResult.success)} | partial ${pct(tally.byResult.partial)} | failure ${pct(tally.byResult.failure)}`);
for (const [k, v] of Object.entries(tally.gameover)) console.log(`  gameover ${k}: ${v} (${pct(v)})`);
console.log('by path:');
for (const [k, v] of Object.entries(tally.byPath).sort()) console.log(`  ${k}: ${v} (${pct(v)})`);
if (tally.finale.count) {
  const c = tally.finale.count;
  const st = mysteryPack.manifest.stats.map((s) => `${s} ${(tally.finale.stats[s] / c).toFixed(0)}`).join(' ');
  console.log(`avg finale: ${st} clues ${(tally.finale.clues / c).toFixed(1)}`);
}
console.log(`reach: ${Object.keys(tally.reach).length}/${mysteryPack.events.length} events drawn`);

if (CHECK) {
  const successPct = (100 * tally.byResult.success) / RUNS;
  const avgDry = tally.drySum / RUNS;
  const winnable = PATH_IDS.every((p) => (pathSuccess[p] || 0) > 0);
  const checks = [
    { name: 'success band 25–50%', ok: successPct >= 25 && successPct <= 50, detail: `${successPct.toFixed(1)}%` },
    { name: 'deck rarely dry (avg < 1.0/run)', ok: avgDry < 1.0, detail: `${avgDry.toFixed(2)}` },
    { name: 'all three summits winnable', ok: winnable, detail: PATH_IDS.map((p) => `${p}:${pathSuccess[p] || 0}`).join(' ') },
  ];
  console.log(`\n=== mystery --check gates (seed=${BASE_SEED}, ${RUNS} runs) ===`);
  let failed = 0;
  for (const c of checks) { console.log(`  ${c.ok ? '✓' : '✗ FAIL'}  ${c.name}  (${c.detail})`); if (!c.ok) failed++; }
  if (failed) { console.error(`\n✗ ${failed} mystery gate(s) breached.\n`); process.exit(1); }
  console.log(`\n✓ all ${checks.length} mystery gates passed.\n`);
}
