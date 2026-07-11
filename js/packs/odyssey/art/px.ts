// The Odyssey — the pixel-map helper behind the figure vocabulary (F2).
//
// Every figure in the vase-band is authored as a PIXEL MAP: rows of
// characters, one character per pixel, converted here to a chunky inline SVG
// (flat fills, no strokes, crispEdges — STYLE.md law 7: black-figure pixel
// silhouettes). Maps are data a reviewer can read and an author can edit in
// place; the SVG is derived, never hand-written. Pack-scoped: nothing under
// the shared shell imports this.
//
// Conventions:
//   '.' and ' '  — transparent (skip)
//   any other character — a fill from the sprite's palette
// The default palette is the black-figure discipline: '#' figure-black on
// whatever ground the CSS gives the band; accent characters are named vase
// colors (see PALETTE). Flat fills only — a gradient here is a lapse.

export type PxPalette = Record<string, string>;

// The vase palette (STYLE.md tokens, frozen values — CSS custom properties
// don't reach into <img>-less inline SVG cleanly across the pack, and these
// are the STYLE.md working values by law).
export const PALETTE: PxPalette = {
  '#': '#1a1410', // figure-black — the silhouettes
  't': '#c96f4a', // terracotta — the ground / lit clay
  'T': '#7a3d28', // terracotta-deep — panel fills, shadow clay
  'g': '#d9a441', // gold — selection, the gods, the ember's heart
  'o': '#722f37', // oxblood — the sea when it speaks
  'b': '#e8e0cd', // bone — rules, foam, starlight
  'a': '#8f8577', // ash — the dimmed, the dead, the drained
  'r': '#e25822', // flame — the fire's body (ember-orange)
  'R': '#a33b12', // flame-deep — the fire's base
};

// One pixel-map frame → the inner <g> markup (rows of horizontal-run <rect>s,
// merged for compactness). Exported for tests; render sprites via sprite().
export function frameToRects(rows: string[], palette: PxPalette = PALETTE): string {
  const rects: string[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.' || c === ' ') { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === c) w++;
      const fill = palette[c];
      if (fill) rects.push(`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${fill}"/>`);
      x += w;
    }
  });
  return rects.join('');
}

export interface SpriteOpts {
  palette?: PxPalette;
  cls?: string;       // extra class on the <svg>
  label?: string;     // accessible name; omitted = decorative (aria-hidden)
  stretch?: boolean;  // preserveAspectRatio=none — for band strips that fill their box
}

// A (possibly multi-frame) sprite as one inline SVG string. Frames are
// stacked <g class="pxf f0/f1/f2"> groups; the pack's stylesheet owns the
// steps() cycling (data-frames carries the count) and reduced-motion
// collapses to frame 0. A single frame renders with no animation hooks at
// all. Sizing is the CSS's business — the svg fills its box, pixels stay
// chunky via crispEdges + pixelated.
export function sprite(frames: string[][], opts: SpriteOpts = {}): string {
  const palette = opts.palette || PALETTE;
  const w = Math.max(...frames.flatMap((f) => f.map((r) => r.length)));
  const h = Math.max(...frames.map((f) => f.length));
  const body = frames.length === 1
    ? frameToRects(frames[0], palette)
    : frames.map((f, i) => `<g class="pxf f${i}">${frameToRects(f, palette)}</g>`).join('');
  const aria = opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true"';
  return `<svg class="px${frames.length > 1 ? ' px-anim' : ''}${opts.cls ? ' ' + opts.cls : ''}"` +
    ` viewBox="0 0 ${w} ${h}" preserveAspectRatio="${opts.stretch ? 'none' : 'xMidYMid meet'}"` +
    ` shape-rendering="crispEdges" data-frames="${frames.length}"${aria}>${body}</svg>`;
}

// Repeat a frame's rows horizontally to fill a band `width` pixels wide —
// for the sea strips and meander borders, whose maps author one TILE.
export function tile(rows: string[], width: number): string[] {
  return rows.map((row) => {
    let out = '';
    while (out.length < width) out += row;
    return out.slice(0, width);
  });
}
