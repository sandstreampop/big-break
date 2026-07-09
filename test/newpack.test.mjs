// The scaffolder's contract: the starter pack it emits is VALID, PLAYABLE,
// and IN ITS OWN BALANCE BAND — the paved road starts on the road, and this
// test is what keeps the template from rotting into an artifact that fails
// the very gates it tells its author to run.
//
// It tests the REAL artifact: the emitted TypeScript source is transpiled
// with the repo's pinned tsc, imported, and driven through validatePack and
// the genre-neutral sim driver. The registry patch is exercised against the
// real registry source.
//
// Run: npm run build && node --test test/newpack.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { validPackId, packExportName, starterPackSource, starterMainSource, starterHtml, patchRegistry } from '../tools/newpack-core.mjs';
import { validatePack, formatValidation } from '../dist/js/validate.js';
import { simulatePackRun } from '../tools/pack-core.mjs';

// Build the starter pack OBJECT from the emitted source: strip types with the
// pinned compiler, drop the type-only import (its target doesn't exist in the
// temp dir), and import the result.
async function loadStarter(id, name) {
  const source = starterPackSource(id, name)
    .replace(/^import type .*$/m, ''); // type-only import of ../types.js
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const dir = mkdtempSync(join(tmpdir(), 'newpack-'));
  const file = join(dir, `${id}.mjs`);
  writeFileSync(file, js);
  const mod = await import(pathToFileURL(file).href);
  return mod[packExportName(id)];
}

test('the emitted starter pack passes the contract with zero errors', async () => {
  const pack = await loadStarter('space-cats', 'Space Cats');
  assert.ok(pack, 'export name resolves');
  const v = validatePack(pack);
  assert.deepEqual(v.errors.map((e) => `${e.code} @ ${e.path}`), [],
    `starter must validate clean:\n${formatValidation('space-cats', v)}`);
  assert.deepEqual(v.warnings, [], 'starter must not even warn');
});

test('the starter plays to a terminal state and lands inside its own balance band', async () => {
  const pack = await loadStarter('space-cats', 'Space Cats');
  // Deterministic mini Monte-Carlo on the same driver the balance gate uses.
  const RUNS = 300;
  let success = 0, terminal = 0, dry = 0;
  for (let seed = 1; seed <= RUNS; seed++) {
    const run = simulatePackRun(pack, seed * 7919);
    if (run.state.phase === 'ended') terminal++;
    if (run.finale?.result === 'success') success++;
    dry += run.dry;
  }
  assert.equal(terminal, RUNS, 'every seeded run must reach a terminal state');
  // The invariant the real balance gate enforces (deck-dry events = 0): an
  // act must never run out of eligible cards, INCLUDING runs where the act
  // twist stretches a segment by +2. The first template shipped exactly
  // segment-length decks and failed simulate-pack --check while this suite
  // was green — this assertion is why that can't recur.
  assert.equal(dry, 0, `${dry} deck-dry events across ${RUNS} runs — acts need a card buffer (twist adds +2)`);
  const pct = (100 * success) / RUNS;
  const band = pack.manifest.balanceBand;
  assert.ok(pct >= band.successMin && pct <= band.successMax,
    `starter success ${pct.toFixed(1)}% must sit inside its declared band ${band.successMin}–${band.successMax}% (retune the template's winGates)`);
});

test('the starter chain beat works: the favor card leads to its chainOnly follow-up', async () => {
  const pack = await loadStarter('space-cats', 'Space Cats');
  const due = pack.events.find((e) => e.id === 'a1_favor_due');
  assert.ok(due.chainOnly, 'follow-up is chainOnly');
  const favor = pack.events.find((e) => e.id === 'a1_favor');
  for (const t of ['bad', 'good', 'incredible']) {
    assert.equal(favor.choices.left.outcomes[t].effects.chainEventId, 'a1_favor_due');
  }
});

test('starter texts hold the house style floors the linter enforces', async () => {
  const pack = await loadStarter('space-cats', 'Space Cats');
  for (const ev of pack.events) {
    const texts = [ev.prompt, ev.recap];
    for (const side of ['left', 'right']) {
      const c = ev.choices[side];
      texts.push(c.label, ...['bad', 'good', 'incredible'].map((t) => c.outcomes[t].text));
    }
    for (const t of texts) {
      if (!t) continue;
      assert.ok(!/\w'\w/.test(t), `straight apostrophe in ${ev.id}: ${t}`);
      assert.ok(!t.includes('  '), `double space in ${ev.id}: ${t}`);
      assert.ok((t.match(/!/g) || []).length <= 1 && !/!!|!\?/.test(t), `hype punctuation in ${ev.id}: ${t}`);
    }
  }
});

test('id validation and export naming', () => {
  assert.ok(validPackId('space-cats'));
  assert.ok(validPackId('probe2'));
  for (const bad of ['Space', '2cats', 'a--b', 'a_b', '', 'x'.repeat(40), 'cats-']) {
    assert.ok(!validPackId(bad), `should reject '${bad}'`);
  }
  assert.equal(packExportName('space-cats'), 'spaceCatsPack');
});

test('the registry patch registers the pack in the REAL registry source', () => {
  const src = readFileSync(new URL('../js/packs/registry.ts', import.meta.url), 'utf8');
  const out = patchRegistry(src, 'space-cats');
  assert.match(out, /import \{ spaceCatsPack \} from '\.\/space-cats\.js';/);
  assert.match(out, /PACKS: Pack\[\] = \[.*spaceCatsPack, probePack\]/s);
  assert.match(out, /GAME_PACKS: Pack\[\] = \[.*spaceCatsPack\]/s);
  // Idempotence guard: patching twice must refuse, not duplicate.
  assert.throws(() => patchRegistry(out, 'space-cats'), /already references/);
  // Drifted registry fails loudly, never silently mis-registers.
  assert.throws(() => patchRegistry('// nothing here', 'space-cats'), /register the pack by hand/);
});

test('the entry html references the entry module via a stampable src attribute', () => {
  const html = starterHtml('space-cats', 'Space Cats', '🐈');
  // src= (not an inline import): tools/build.mjs stamps ?v= onto attributes
  // only, so an inline module would dodge the cache-busting contract.
  assert.match(html, /<script type="module" src="\.\.\/js\/main-space-cats\.js"><\/script>/);
  assert.ok(!/import \{/.test(html), 'no inline module imports in the entry html');
  assert.match(html, /..\/css\/style.css/);
});

test('the entry module boots through createGame', () => {
  const main = starterMainSource('space-cats', 'Space Cats');
  assert.match(main, /import \{ createGame \} from '\.\/api\.js';/);
  assert.match(main, /import \{ spaceCatsPack \} from '\.\/packs\/space-cats\.js';/);
  assert.match(main, /createGame\(\{ pack: spaceCatsPack \}\)\.start\(\)/);
});
