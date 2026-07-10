// Image-core — the genre-neutral image PREPROCESSING engine (spec: SOTA image
// handling). It is to raster images what tools/art-core.mjs is to generation and
// tools/pack-core.mjs is to packs: pure, testable mechanism with no game words.
// It takes ONE master image and emits a responsive VARIANT SET — a small ladder
// of widths, each encoded in the modern formats (AVIF, WebP) plus a universal
// JPEG fallback — and returns a DESCRIPTOR the runtime serves through
// `<picture>`/`srcset` (see js/ui/dom.ts `responsivePicture`).
//
// Why this shape: GitHub Pages is a dumb static host — no server-side format
// negotiation, no on-the-fly resize. So the "right size, right format" decision
// is pre-baked into files at authoring time and pushed to the browser, which
// picks the best it supports via `<source type>` + the `w` descriptors in
// `srcset`. A 56px face chip then fetches a ~2KB 96px AVIF instead of a 750KB
// 1024² master — the whole point of the sprint.
//
// Any pack's art tool calls buildResponsiveSet(); nothing here knows a genre.
// Depends on `sharp` (a devDependency — used only by authoring tools, never by
// the Pages build, which just copies the committed variants 1:1).

import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// The default width ladder. Tuned for circular face chips (30–88px CSS) up to a
// portrait lightbox (≤360px CSS) across device-pixel-ratios 1–3:
//   30px chip  → 96   (DPR 3)
//   64px result→ 192  (DPR 3)
//   88px inspect→ 384 (DPR 3 = 264, headroom)
//   360px light→ 768  (DPR ~2)
// The browser downloads exactly one rung per context via `sizes`.
export const DEFAULT_LADDER = [96, 192, 384, 768];

// Per-format quality. AVIF/WebP tuned for retouched glam portraits: aggressive
// but visually transparent at the sizes we render. JPEG is the ancient-browser
// floor (mozjpeg for a smaller file at equal quality).
export const DEFAULT_QUALITY = { avif: 55, webp: 74, jpeg: 80 };

// The formats we emit, best-first. `<picture>` offers them in this order and the
// browser takes the first it can decode, so AVIF (smallest) must precede WebP.
export const FORMATS = ['avif', 'webp', 'jpeg'];
const EXT = { avif: 'avif', webp: 'webp', jpeg: 'jpg' };

// Lazily import sharp so a consumer that only reads descriptors (or a platform
// without the native binary) doesn't hard-crash at import time.
let _sharp;
async function loadSharp() {
  if (_sharp) return _sharp;
  const mod = await import('sharp');
  _sharp = mod.default;
  return _sharp;
}

// Build the responsive variant set for one master image.
//
//   masterPath  absolute path to the source (any format sharp reads)
//   outDir      directory the variant files are written into
//   opts.name   the file stem for outputs (`<name>-<w>.<ext>`)
//   opts.publicPrefix  web path prefix prepended to every srcset entry + src
//                      (e.g. "art/cast/") so the descriptor is deploy-ready
//   opts.ladder / opts.quality  overrides of the defaults above
//
// Returns { w, h, src, avif, webp, jpeg } where the three format fields are
// ready-to-use `srcset` strings ("path 96w, path 192w, …") and `src` is the
// universal <img> fallback. Widths larger than the master are dropped (never
// upscale). Idempotent by construction: it always re-encodes the requested
// rungs, so a re-run reflects the current master + settings exactly.
export async function buildResponsiveSet(masterPath, outDir, opts = {}) {
  const {
    name,
    publicPrefix = '',
    ladder = DEFAULT_LADDER,
    quality = DEFAULT_QUALITY,
  } = opts;
  if (!name) throw new Error('buildResponsiveSet: opts.name is required');

  const sharp = await loadSharp();
  const meta = await sharp(masterPath).metadata();
  const mw = meta.width || ladder[ladder.length - 1];
  const ar = meta.width && meta.height ? meta.height / meta.width : 1;

  // Never upscale. If the master is smaller than every rung, emit it at its own
  // width so there is always at least one variant.
  let widths = ladder.filter((w) => w <= mw);
  if (!widths.length) widths = [mw];

  mkdirSync(outDir, { recursive: true });

  const srcset = { avif: [], webp: [], jpeg: [] };
  for (const w of widths) {
    // width-only resize preserves the master's aspect ratio for any image.
    const pipeline = sharp(masterPath).resize(w);
    await pipeline.clone().avif({ quality: quality.avif }).toFile(join(outDir, `${name}-${w}.avif`));
    await pipeline.clone().webp({ quality: quality.webp }).toFile(join(outDir, `${name}-${w}.webp`));
    await pipeline.clone().jpeg({ quality: quality.jpeg, mozjpeg: true }).toFile(join(outDir, `${name}-${w}.jpg`));
    for (const f of FORMATS) srcset[f].push(`${publicPrefix}${name}-${w}.${EXT[f]} ${w}w`);
  }

  // Fallback <img> src: a mid rung (384 when present) — small enough to be a
  // cheap floor, large enough to look right on the ancient browsers that reach
  // for it. width/height carry the fallback's intrinsic size so the browser
  // reserves the box and the layout never shifts (CLS = 0).
  const fbW = widths.includes(384) ? 384 : widths[widths.length - 1];
  return {
    w: fbW,
    h: Math.round(fbW * ar),
    src: `${publicPrefix}${name}-${fbW}.${EXT.jpeg}`,
    avif: srcset.avif.join(', '),
    webp: srcset.webp.join(', '),
    jpeg: srcset.jpeg.join(', '),
  };
}

// Wipe a variant output directory so a re-run can never leave orphaned files
// from a renamed/removed slot (a stale variant would still deploy). Guarded to
// only clear a directory that looks like a variant sink (or is empty/absent).
export function cleanVariantDir(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  const stray = entries.filter((f) => !/\.(avif|webp|jpg|jpeg|png)$/i.test(f));
  if (stray.length) {
    throw new Error(`cleanVariantDir: refusing to wipe ${dir} — non-image entries present: ${stray.join(', ')}`);
  }
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
