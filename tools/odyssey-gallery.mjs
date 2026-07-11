// The Odyssey figure gallery (F2's review surface): renders every sprite in
// js/packs/odyssey/art/ at review scale on the vase ground, as one HTML page.
// Dev tool only — never a build input, never shipped. Build first:
//   npm run build && node tools/odyssey-gallery.mjs [out.html]
// Then open the page (or screenshot it headlessly) and LOOK — F2's gate is
// an eyeball, per the plan ("reviewable in a gallery before anything moves").

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const { GALLERY } = await import(`file://${dist}/js/packs/odyssey/art/figures.js`);

const out = process.argv[2] || 'odyssey-gallery.html';
const cells = Object.entries(GALLERY).map(([name, make]) => {
  const svg = make();
  return `<figure>
    <div class="cell band">${svg}</div>
    <div class="cell night">${svg}</div>
    <figcaption>${name}</figcaption>
  </figure>`;
}).join('\n');

writeFileSync(out, `<!doctype html><meta charset="utf-8">
<title>Odyssey figure gallery</title>
<style>
  body { background: #161210; color: #e8e0cd; font: 14px/1.5 monospace; padding: 24px; }
  h1 { font-size: 16px; letter-spacing: .2em; }
  main { display: flex; flex-wrap: wrap; gap: 18px; }
  figure { margin: 0; }
  figcaption { margin-top: 6px; color: #8f8577; font-size: 12px; max-width: 320px; }
  .cell { padding: 12px; display: grid; place-items: center; }
  .cell.band { background: #c96f4a; }        /* the amphora ground */
  .cell.night { background: #221a14; border-top: 1px solid #333; }
  svg.px { image-rendering: pixelated; height: 96px; width: auto; display: block; }
  svg.px.ody-sea { height: 40px; }
  /* review-time animation so multi-frame sprites can be judged in motion */
  .pxf { visibility: hidden; }
  svg[data-frames="1"] g, svg:not([data-frames]) g { visibility: visible; }
  svg[data-frames="2"] .f0 { animation: f2a 1.6s steps(1) infinite; }
  svg[data-frames="2"] .f1 { animation: f2b 1.6s steps(1) infinite; }
  svg[data-frames="3"] .f0 { animation: f3a 1.8s steps(1) infinite; }
  svg[data-frames="3"] .f1 { animation: f3b 1.8s steps(1) infinite; }
  svg[data-frames="3"] .f2 { animation: f3c 1.8s steps(1) infinite; }
  @keyframes f2a { 0%, 49% { visibility: visible; } 50%, 100% { visibility: hidden; } }
  @keyframes f2b { 0%, 49% { visibility: hidden; } 50%, 100% { visibility: visible; } }
  @keyframes f3a { 0%, 32% { visibility: visible; } 33%, 100% { visibility: hidden; } }
  @keyframes f3b { 0%, 32% { visibility: hidden; } 33%, 65% { visibility: visible; } 66%, 100% { visibility: hidden; } }
  @keyframes f3c { 0%, 65% { visibility: hidden; } 66%, 100% { visibility: visible; } }
</style>
<h1>THE ODYSSEY — FIGURE VOCABULARY</h1>
<p>Each figure on the amphora ground (terracotta) and the night field. Multi-frame sprites cycle at review tempo.</p>
<main>${cells}</main>
`);
console.log(`gallery → ${out} (${Object.keys(GALLERY).length} figures)`);
