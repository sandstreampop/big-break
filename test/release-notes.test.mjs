// The release process is executable, not commentary (docs/RELEASING.md).
//
// The contract this pins: the version a player sees on the deployed title
// screen (js/version.ts APP_VERSION, stamped by tools/build.mjs from
// package.json) always has a matching entry at the top of the in-app
// changelog (js/release-notes.ts). Without this gate the two drift the first
// time someone bumps one and forgets the other — and the whole point of the
// version chip ("am I seeing the right deploy, without question?") dies
// quietly. Runs against the BUILT dist/, so what's tested is what ships.
//
// Run: npm run build && node --test test/release-notes.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const { RELEASE_NOTES } = await import(pathToFileURL(join(ROOT, 'dist/js/release-notes.js')).href);
const version = await import(pathToFileURL(join(ROOT, 'dist/js/version.js')).href);

const SEMVER = /^\d+\.\d+\.\d+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

test('package.json version is plain semver', () => {
  assert.match(pkg.version, SEMVER);
});

test('the build stamps APP_VERSION from package.json', () => {
  assert.equal(version.APP_VERSION, pkg.version,
    'dist/js/version.js must carry the package.json version — tools/build.mjs stamps it');
});

test('the newest release note matches the shipped version', () => {
  assert.ok(RELEASE_NOTES.length >= 1, 'at least one release note exists');
  assert.equal(RELEASE_NOTES[0].version, pkg.version,
    'bumping package.json version requires a matching entry at the TOP of js/release-notes.ts ' +
    '(and adding a note requires the bump) — see docs/RELEASING.md');
});

test('every entry is well-formed: semver, ISO date, non-empty title and notes', () => {
  for (const r of RELEASE_NOTES) {
    assert.match(r.version, SEMVER, `version "${r.version}"`);
    assert.match(r.date, ISO_DATE, `date "${r.date}" (v${r.version})`);
    assert.ok(!Number.isNaN(Date.parse(r.date)), `date "${r.date}" parses (v${r.version})`);
    assert.ok(r.title && r.title.trim(), `title present (v${r.version})`);
    assert.ok(Array.isArray(r.notes) && r.notes.length >= 1, `notes present (v${r.version})`);
    for (const n of r.notes) assert.ok(n && n.trim(), `no empty note lines (v${r.version})`);
  }
});

test('entries are newest-first: versions strictly descending, dates non-increasing, no duplicates', () => {
  const num = (v) => v.split('.').map(Number);
  const cmp = (a, b) => {
    const [A, B] = [num(a), num(b)];
    for (let i = 0; i < 3; i++) if (A[i] !== B[i]) return A[i] - B[i];
    return 0;
  };
  for (let i = 1; i < RELEASE_NOTES.length; i++) {
    const prev = RELEASE_NOTES[i - 1], cur = RELEASE_NOTES[i];
    assert.ok(cmp(prev.version, cur.version) > 0,
      `v${prev.version} must be newer than v${cur.version} (entry ${i})`);
    assert.ok(prev.date >= cur.date,
      `date ${prev.date} (v${prev.version}) must not precede ${cur.date} (v${cur.version})`);
  }
});
