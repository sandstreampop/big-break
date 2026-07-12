// INCIDENTS.md #6 hardening: the per-sheet stamp key (--bb-css-v-<key>) is
// derived in exactly ONE place — js/css-key.ts. The stamp writer
// (tools/build.mjs), the boot probe (js/ui/dom.ts healStaleStylesheets) and
// the delivery gate (test/ui/mobile-matrix.mjs) all IMPORT it; a private
// copy in any of them is the drift this test exists to catch (a probe-side
// drift means every boot warns + cache-bust-refetches all sheets forever; a
// writer-side drift silently kills the skew detection). Runs against dist/
// (build first).

import test from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const { cssStampKey } = await import('../dist/js/css-key.js');

test('cssStampKey derives the shipped keys from every href shape', () => {
  assert.equal(cssStampKey('style.css'), 'style');
  assert.equal(cssStampKey('../css/love-island.css?v=abc123'), 'love-island');
  assert.equal(cssStampKey('/big-break/css/odyssey.css'), 'odyssey');
  assert.equal(cssStampKey('css/odyssey.css?v=x&heal=1'), 'odyssey');
});

test('the derivation is single-sourced — writer, probe and gate import it', () => {
  for (const f of ['tools/build.mjs', 'js/ui/dom.ts', 'test/ui/mobile-matrix.mjs']) {
    const src = readFileSync(new URL('../' + f, import.meta.url), 'utf8');
    assert.ok(src.includes('cssStampKey'), `${f} must import the shared cssStampKey`);
    assert.ok(!/\.replace\(\/\\\.css\$\//.test(src),
      `${f} has grown its own key derivation — import js/css-key.ts instead`);
  }
});
