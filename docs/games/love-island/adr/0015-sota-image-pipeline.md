# SOTA image pipeline: preprocess once, serve responsively (v4)

The performance sprint (Viktor, 2026-07-08). The recently-wired cast portraits
(ADR-follow-on to "Wire the Love Island cast portraits", 2026-07) shipped the
usual *barnsjukdomar* of a first art drop: 16 contestant faces, each a **1024²
JPEG mislabelled `.png`**, ~750 KB apiece, **12 MB total** — and served RAW at
that one size everywhere, from a 30 px circular face chip to the 360 px
lightbox. A phone rendering a thumbnail was downloading a full master. The brief:
build the staff-engineer foundation so **today's images AND all future images**
are preprocessed and served in a state-of-the-art way — engine-generic where it
generalises, Love-Island-fast in the concrete.

## Research — the web patterns we're standing on

The consensus SOTA for images on the web in 2025–26, and what each implies for
us (a **static GitHub Pages** host — no server, so no `Accept`-header format
negotiation, no on-the-fly resize; every decision must be pre-baked into files
the browser then chooses between):

1. **Modern formats, best-first.** AVIF (~50 % smaller than JPEG) then WebP
   (~30 % smaller) then a JPEG floor. Browser support is effectively universal
   in 2026, but AVIF is newest, so it must be *offered first* and the browser
   takes the first it can decode. Static host ⇒ do this with
   `<picture>` + `<source type>` (client-side selection), not content
   negotiation.
2. **Right size, not one size.** `srcset` with `w` descriptors + a `sizes` hint
   lets the browser fetch the rung that matches the *rendered* box × the device
   pixel ratio. This alone is the 60–70 % mobile-payload win over a single
   master.
3. **No layout shift.** Intrinsic `width`/`height` on the `<img>` so the box is
   reserved before the bytes arrive (CLS → 0).
4. **Loading hints.** `loading="lazy"` for off-screen images (the roster wall),
   `decoding="async"` to keep decode off the paint path, and
   `fetchpriority="high"` on the *one* most important image (the opened
   lightbox) — used sparingly, or the boost cancels out.
5. **Never upscale**, and cache-bust by content (our variant filenames are
   width-stamped; the Pages cache + network-first SW handle the rest).

Sources: web.dev (browser-level lazy loading; Fetch Priority API), MDN
(`<img>`, `decoding`), DebugBear "Ultimate Guide to Responsive Images", and the
2025 image-optimization round-ups (AVIF/WebP/srcset/preload).

## Decision

**A two-halved, genre-neutral pipeline — a preprocessing engine at authoring
time and a `<picture>` serving layer at runtime — wired to Love Island through
the existing presenter-registration seam. Zero engine edits, zero golden
movement.** (Goldens/sims are DOM-free; portraits are a presenter/UI concern.)

- **Authoring half (generic, `tools/image-core.mjs`).** The image analogue of
  `tools/art-core.mjs`/`pack-core.mjs`: pure, testable mechanism, no game words,
  depends on `sharp` (a devDependency — used ONLY by art tools, never by the
  Pages build). `buildResponsiveSet(master, outDir, {name, publicPrefix})`
  resizes one master into the width ladder **[96, 192, 384, 768]** × **{AVIF,
  WebP, JPEG}** and returns a serve-ready descriptor (`w`, `h`, `src`, and a
  ready `srcset` string per format). Any pack's art tool calls it; nothing in it
  knows a genre.

- **Serving half (generic, shell).** `js/ui/dom.ts` gains a variant registry +
  `responsivePicture(src, opts)`, sitting in the bottom mechanism layer beside
  the element factory. It emits a `<picture>` with AVIF→WebP `<source>`s and an
  `<img>` fallback carrying `srcset`/`sizes`, intrinsic `width`/`height`, and
  `loading`/`decoding`/`fetchpriority`. `types.ts` gains the neutral
  `ImageVariant` descriptor + `Presenter.imageVariants`, registered at boot in
  `js/ui.ts` **exactly like `registerArt`** (dependency inversion — the shell is
  handed a generic `src → variant` map and names no game). Every portrait render
  site (card stage/result, roster wall, inspector, endings, lightbox) now routes
  through `responsivePicture`, so **every image, today's and future, gets the
  SOTA treatment the moment its variants are registered.** With no variants
  (music, or art not yet preprocessed) it degrades to a plain `<img>` that still
  carries the loading hints — correct everywhere, fastest where wired.

- **Concrete half (Love Island).** `gen-li-art.mjs --wire` now runs every
  committed master in `art/final/` through `image-core` into
  `public/art/cast/`, and generates two maps in `portraits.data.ts`: `PORTRAITS`
  (slot → fallback `src`, the shape face objects already carried) and
  `PORTRAIT_VARIANTS` (that `src` → its srcset ladder). The 750 KB masters never
  deploy.

## Consequences

- **The payload.** 12 MB of raw masters → 3.8 MB of variants *on disk across all
  sizes/formats* — but the browser fetches exactly ONE per context: a face chip
  now pulls a **~1.6 KB 96px AVIF** instead of a 750 KB master (~99.7 % less),
  the lightbox a ~40 KB 768px AVIF (~95 % less). High-definition where it's big,
  featherweight where it's small.
- **The ladder is tuned to the CSS.** Chips render at 30–88 px, the lightbox at
  ≤360 px; [96, 192, 384, 768] covers all of them across DPR 1–3 with one rung
  to spare. `.rp { display: contents }` keeps the `<img>` sizing against the
  real circular parent, so the `<picture>` wrapper is invisible to layout.
- **CI stays light.** The Pages build still just copies `public/` 1:1 — it never
  runs `sharp`. Preprocessing is a deliberate authoring step (like generation),
  and the variants are committed. Re-optimising the whole cast with a new ladder
  or quality is one `--wire`.
- **Verification.** `test/image-core.test.mjs` pins the engine (ladder, formats,
  no-upscale, srcset shape; skips cleanly if `sharp` is absent). The smoke suite
  asserts a wired portrait actually reaches the DOM as a responsive `<picture>`
  (AVIF+WebP sources, `srcset`, intrinsic dims) **on the gated
  result→lightbox→continue path** — so a pipeline break also blocks the
  finale-reached assertion (per the portrait-lightbox blood rule in CLAUDE.md).

## The paved road for future images

1. Drop/generate masters into a pack's `art/final/`.
2. Run the pack's `--wire` (preprocess + regenerate the variant manifest).
3. Expose the manifest via `Presenter.imageVariants`; render through
   `responsivePicture`. Done — SOTA by construction, no per-image work.
