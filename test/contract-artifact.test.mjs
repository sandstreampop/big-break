// docs/pack-contract.json is the machine-readable half of the pack contract
// that external tools (editors, CLIs, LLM authoring loops) consume. It is
// GENERATED from runtime truth (the built engine/validator) and committed —
// this test is the drift pin: change a vocabulary, an issue code, or a
// contract version and forget to regenerate, and CI fails here.
//
// Regenerate deliberately: npm run build && node tools/gen-contract-artifact.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildContractArtifact, renderContractArtifact, ARTIFACT_PATH } from '../tools/gen-contract-artifact.mjs';

test('docs/pack-contract.json matches the built engine + validator (regenerate if intended)', async () => {
  const fresh = renderContractArtifact(await buildContractArtifact());
  const committed = readFileSync(ARTIFACT_PATH, 'utf8');
  assert.equal(committed, fresh,
    'pack-contract.json drifted from the source of truth — run: npm run build && node tools/gen-contract-artifact.mjs');
});

test('the artifact carries the load-bearing sections', async () => {
  const a = await buildContractArtifact();
  assert.equal(a.packContractVersion, 1);
  assert.ok(a.coreEffectVerbs.length > 0, 'core effect verbs present');
  assert.ok(a.requiresNeutralKeys.length > 0, 'neutral requires keys present');
  assert.ok(Object.keys(a.issueCodes).length >= 50, 'the issue-code catalog is the full validator surface');
  // Spot-pin a few codes external repair loops key on — renaming one is a
  // BREAKING change for consumers (bump packContractVersion if intended).
  // resourcestart-unknown-resource is the regression pin for the verifier's
  // finding that template-literal codes silently vanished from the catalog.
  for (const code of ['effect-verb-unknown', 'requires-key-unknown', 'chain-target-missing', 'event-id-duplicate', 'resourcestart-unknown-resource']) {
    assert.ok(a.issueCodes[code], `issue code '${code}' vanished — breaking for external tools`);
  }
});
