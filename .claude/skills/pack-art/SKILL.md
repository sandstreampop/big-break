---
name: pack-art
description: Add or re-wire raster art (cast portraits, set-piece images) for a pack — the preprocess-then-serve-responsively pipeline. Use when adding image masters to a game, regenerating an image manifest, or rendering an image in the shell.
---

# Pack art — the one road for raster images

The rule is in the root `CLAUDE.md` and is load-bearing: **a master image is
never shipped or rendered directly.** This skill is the pipeline behind it.
Design record: `docs/games/love-island/adr/0015-sota-image-pipeline.md`.

Why it exists: the cast portraits' first drop rendered
`<img class="face-portrait" src="${portraitSrc}">` inline at ~6 sites, shipping
750KB 1024² masters to 30px chips.

## The two generic halves

**1. Authoring (build time, never in the Pages build).**
`tools/image-core.mjs` → `buildResponsiveSet(masterPath, outDir, opts)` turns a
master into a `DEFAULT_LADDER` (`[96, 192, 384, 768]`) × `FORMATS`
(`['avif', 'webp', 'jpeg']`) ladder plus a descriptor
(`{ w, h, src, avif, webp, jpeg }`). It is sharp-backed, so `sharp` is a
**devDependency only** — variants are committed and copied 1:1 by the build.
`cleanVariantDir(dir)` clears stale output.

**2. Serving (runtime).** `js/ui/dom.ts` → `responsivePicture(src, opts)` emits
a `<picture>`: AVIF → WebP `<source>`s plus an `<img>` with `srcset`/`sizes`,
intrinsic `width`/`height`, and loading hints (`opts`: `className`, `sizes`,
`alt`, `eager`, `priority`).

## Paved road for new art

1. Drop masters in the pack's art folder.
2. Run the pack's wiring tool — for love-island,
   `node tools/gen-li-art.mjs --wire` (preprocess + regenerate the manifest;
   it writes `js/packs/love-island/portraits.data.ts`, which is GENERATED —
   never hand-edit it).
3. Register the `src → ImageVariant` map via `Presenter.imageVariants`
   (`js/types.ts`), wired at boot like `registerArt`. Absent/empty is still
   correct — you just lose format/size negotiation.
4. Render **only** through `responsivePicture`. The shell stays genre-neutral;
   the pack supplies the variants.

## The guard

`test/portrait-serving.test.mjs` is a static scan over `js/**/*.ts`: a raw
portrait `<img>` literal (portrait class, or a `portraitSrc` interpolated into
a tag) fails the build. Goldens and sims are DOM-free and cannot see this, which
is why the scan exists — don't work around it, route through the one road.
