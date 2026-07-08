// Unit tests for the genre-neutral image PREPROCESSING engine
// (tools/image-core.mjs) — the authoring half of the SOTA image pipeline. The
// runtime half (js/ui/dom.ts responsivePicture) is exercised by the browser
// smoke suite; this pins the mechanism that produces the variant files +
// descriptor: the width ladder, the modern-format ladder, no-upscale, and a
// ready-to-serve srcset shape.
//
// sharp is a devDependency used only by authoring tools, never the Pages build.
// If the native binary is absent on some platform, skip rather than fail — the
// deploy gate must not hinge on an optional toolchain.
//
// Run: node --test test/image-core.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let sharp;
try { sharp = (await import('sharp')).default; } catch { /* skip below */ }
const CORE = await import('../tools/image-core.mjs');

// A synthetic 1024² master (the shape the cast portraits are). Written once,
// reused across tests. Skips the whole suite cleanly if sharp is unavailable.
async function makeMaster(dir) {
  const p = join(dir, 'master.png');
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: { r: 200, g: 120, b: 60 } } })
    .png().toFile(p);
  return p;
}

test('image-core: DEFAULT_LADDER + FORMATS are the tuned constants', () => {
  assert.deepEqual(CORE.DEFAULT_LADDER, [96, 192, 384, 768]);
  // AVIF first so <picture> offers the smallest format the browser can decode.
  assert.deepEqual(CORE.FORMATS, ['avif', 'webp', 'jpeg']);
});

test('buildResponsiveSet: emits the full ladder × formats + a serve-ready descriptor', { skip: !sharp && 'sharp unavailable' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'imgcore-'));
  try {
    const master = await makeMaster(dir);
    const out = join(dir, 'out');
    const d = await CORE.buildResponsiveSet(master, out, { name: 'zara', publicPrefix: 'art/cast/' });

    // One file per (width × format): 4 × 3 = 12.
    const files = readdirSync(out);
    assert.equal(files.length, 12, `expected 12 variant files, got ${files.join(', ')}`);
    for (const w of CORE.DEFAULT_LADDER) {
      for (const ext of ['avif', 'webp', 'jpg']) {
        assert.ok(files.includes(`zara-${w}.${ext}`), `missing zara-${w}.${ext}`);
      }
    }

    // Descriptor: fallback src is the 384 jpeg, dims are the fallback's, and
    // each format field is a comma-joined srcset with a `w` descriptor per rung.
    assert.equal(d.src, 'art/cast/zara-384.jpg');
    assert.equal(d.w, 384);
    assert.equal(d.h, 384); // square master → square variant
    for (const fmt of ['avif', 'webp', 'jpeg']) {
      const entries = d[fmt].split(', ');
      assert.equal(entries.length, 4, `${fmt} srcset should have 4 rungs`);
      assert.match(entries[0], /^art\/cast\/zara-96\.\w+ 96w$/);
      assert.match(entries[3], /768w$/);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('buildResponsiveSet: modern formats are dramatically smaller than the master', { skip: !sharp && 'sharp unavailable' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'imgcore-'));
  try {
    const master = await makeMaster(dir);
    const out = join(dir, 'out');
    await CORE.buildResponsiveSet(master, out, { name: 'z', publicPrefix: '' });
    // A face-chip rung (192 AVIF) must be a tiny fraction of a full master.
    const avif192 = statSync(join(out, 'z-192.avif')).size;
    assert.ok(avif192 < 60_000, `192 AVIF should be small, was ${avif192}B`);
    // AVIF ≤ WebP ≤ JPEG at the same rung (the reason AVIF is offered first).
    const at = (ext) => statSync(join(out, `z-384.${ext}`)).size;
    assert.ok(at('avif') <= at('webp'), 'AVIF should not exceed WebP');
    assert.ok(at('webp') <= at('jpg'), 'WebP should not exceed JPEG');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('buildResponsiveSet: never upscales past the master width', { skip: !sharp && 'sharp unavailable' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'imgcore-'));
  try {
    // A 200px master: only the 96 and 192 rungs are valid (no 384/768 upscale).
    const master = join(dir, 'small.png');
    await sharp({ create: { width: 200, height: 200, channels: 3, background: { r: 10, g: 20, b: 30 } } }).png().toFile(master);
    const out = join(dir, 'out');
    const d = await CORE.buildResponsiveSet(master, out, { name: 's' });
    const files = readdirSync(out);
    assert.ok(files.includes('s-96.avif') && files.includes('s-192.avif'), 'valid rungs emitted');
    assert.ok(!files.some((f) => /-(384|768)\./.test(f)), 'no rung larger than the master');
    // Fallback falls back to the largest available rung when 384 is absent.
    assert.equal(d.src, 's-192.jpg');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('cleanVariantDir: wipes an image-only sink but refuses one with strays', () => {
  const base = mkdtempSync(join(tmpdir(), 'imgcore-'));
  try {
    // An image-only sink → wiped and recreated empty (so a removed slot can
    // never leave an orphaned variant behind to deploy).
    const sink = join(base, 'cast');
    mkdirSync(sink);
    writeFileSync(join(sink, 'zara-96.avif'), 'x');
    writeFileSync(join(sink, 'zara-96.jpg'), 'x');
    CORE.cleanVariantDir(sink);
    assert.ok(existsSync(sink), 'sink recreated');
    assert.equal(readdirSync(sink).length, 0, 'sink emptied');

    // A dir holding a non-image entry → refuse to wipe (guards against pointing
    // the tool at the wrong directory and destroying source).
    const mixed = join(base, 'mixed');
    mkdirSync(mixed);
    writeFileSync(join(mixed, 'keep.ts'), 'source');
    assert.throws(() => CORE.cleanVariantDir(mixed), /non-image entries/);
    assert.ok(existsSync(join(mixed, 'keep.ts')), 'source left intact');

    // A missing dir → no-op, no throw.
    CORE.cleanVariantDir(join(base, 'nope'));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
