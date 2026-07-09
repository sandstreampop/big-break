// The pack-contract gate: run validatePack (js/validate.ts — schema +
// semantics, author-facing errors) over EVERY registered pack, and exit
// non-zero on any error. This is the CI teeth behind "a generated pack is
// hostile input until it passes": the same validator an authoring loop calls
// programmatically, run here over the packs that actually ship.
//
// It complements (not replaces) the other rings:
//   tools/lint-content.mjs      — voice/taste/style floors (the WORDS)
//   test/invariants.test.mjs    — cross-pack engine properties
//   tools/simulate-pack.mjs     — stage 3: does it PLAY (balance gate)
//
// Run: npm run build && node tools/validate-packs.mjs
//      node tools/validate-packs.mjs <packId>   (one pack, e.g. while authoring)

import { PACKS } from '../dist/js/packs/registry.js';
import { validatePack, formatValidation } from '../dist/js/validate.js';

const only = process.argv[2];
const packs = only ? PACKS.filter((p) => p.id === only) : PACKS;
if (only && !packs.length) {
  console.error(`unknown pack '${only}' — registered: ${PACKS.map((p) => p.id).join(', ')}`);
  process.exit(1);
}

let errors = 0;
let warnings = 0;
for (const pack of packs) {
  const v = validatePack(pack);
  errors += v.errors.length;
  warnings += v.warnings.length;
  console.log(formatValidation(pack.id, v));
  console.log('');
}

if (errors) {
  console.error(`✗ pack contract: ${errors} error(s) across ${packs.length} pack(s) — fix the issues above (each names its path and a suggested fix).`);
  process.exit(1);
}
console.log(`PACK CONTRACT CLEAN — ${packs.length} pack(s), ${warnings} warning(s)`);
