// The ONE derivation of a stylesheet's per-sheet stamp key (INCIDENTS.md #6:
// every shipped sheet carries `--bb-css-v-<key>` so the boot probe can spot a
// stale PACK sheet next to an agreeing style.css). Three parties must agree
// on the key or the skew detection silently dies in one direction (probe
// drift → permanent heal-refetch on every boot; writer drift → stale sheets
// pass unseen): tools/build.mjs WRITES the stamp, js/ui/dom.ts's
// healStaleStylesheets READS it at boot, and test/ui/mobile-matrix.mjs gates
// it statically. All three import THIS function — the derivation exists
// nowhere else (test/css-stamp-key pins that).
//
// Standalone on purpose: no DOM, no imports — tools/build.mjs dynamic-imports
// the compiled dist/js/css-key.js after tsc runs.
export function cssStampKey(hrefOrFile: string): string {
  const base = hrefOrFile.split('?')[0].split('/').pop() || '';
  return base.replace(/\.css$/, '').replace(/[^a-z0-9-]/gi, '');
}
