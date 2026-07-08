// Guard: portrait images have ONE road — the responsive <picture> layer
// (js/ui/dom.ts responsivePicture), never a hand-rolled <img> string. See the
// "Raster images have ONE road" rule in CLAUDE.md and ADR-0015 (love-island).
//
// The barnsjukdom this locks out: the cast portraits' first drop rendered
// `<img class="face-portrait" src="${portraitSrc}">` inline at ~6 sites, each
// shipping a 750KB master to a 30px chip. They now all route through
// responsivePicture, which emits AVIF/WebP sources + srcset/sizes + intrinsic
// dims. A future session that hand-rolls a portrait <img> anywhere in the shell
// bypasses all of that SILENTLY — goldens/sims are DOM-free and the browser
// smoke suite only checks the paths it happens to drive. This static scan is the
// backstop: a raw portrait <img> literal in js/ fails the build.
//
// Run: node --test test/portrait-serving.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'js');

function tsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...tsFiles(p));
    else if (name.endsWith('.ts')) out.push(p);
  }
  return out;
}

// A raw <img> literal that carries a portrait class — the exact shape of the
// pre-pipeline render sites. responsivePicture builds its <img> from a `cls`
// VARIABLE, so it never contains these class names as a literal; a match here
// therefore means someone hand-rolled a portrait image outside the road.
const RAW_PORTRAIT_IMG = /<img\b[^>]*\b(?:face-portrait|portrait-lightbox-img)\b/;

test('no hand-rolled portrait <img> anywhere in js/ — all go through responsivePicture', () => {
  const offenders = [];
  for (const file of tsFiles(JS_ROOT)) {
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (RAW_PORTRAIT_IMG.test(line)) offenders.push(`${file}:${i + 1}  ${line.trim()}`);
    });
  }
  assert.equal(
    offenders.length, 0,
    `portrait <img> must be built by responsivePicture (js/ui/dom.ts), not hand-rolled.\n` +
    `Route these through responsivePicture(src, { className, sizes }):\n  ${offenders.join('\n  ')}`,
  );
});

test('responsivePicture is the single portrait producer and is exported', () => {
  const dom = readFileSync(join(JS_ROOT, 'ui', 'dom.ts'), 'utf8');
  assert.match(dom, /export function responsivePicture\b/, 'responsivePicture must exist in js/ui/dom.ts');
  assert.match(dom, /export function registerImageVariants\b/, 'registerImageVariants must exist (the pack registration seam)');
});
