// The golden-master corpus: a fixed set of (seed, policy) tuples the oracle
// snapshots and every later refactor is proven against. Seeds come from one
// pinned generator so the generator (gen-golden.mjs) and the checker
// (test/golden.test.mjs) always agree on the exact corpus. The per-run
// loadout is itself seed-derived (see sim-core.mjs), so a (seed, policy)
// pair fully determines a career — the plan's (seed, loadout, policy) tuple
// with the loadout folded into the seed.
//
// Bumping GOLDEN_SEED or CORPUS_SIZE changes the corpus and is a deliberate
// re-baseline (regenerate master.json). Byte-green refactors never touch it.

import * as engine from '../dist/js/engine.js';

export const GOLDEN_SEED = 0x60D5EED; // "golden seed"
export const CORPUS_SIZE = 24;        // distinct careers per policy
export const POLICIES = ['smart', 'narrative', 'random'];

export function corpus() {
  const gen = engine.mulberry32(GOLDEN_SEED);
  const out = [];
  for (let i = 0; i < CORPUS_SIZE; i++) {
    const seed = Math.floor(gen() * 1e9) + 1;
    for (const policy of POLICIES) out.push({ seed, policy });
  }
  return out;
}
