// The Odyssey — the vase, fired (pass 43): the ending keepsake as a PNG
// poster for the share sheet. The Night's Vase already chooses tonight's
// figures (vase.ts readVoyage → nightVase); this module rasterizes that
// exact band onto a canvas — each pixel-art SVG drawn as a TRUE black-figure
// silhouette (offscreen source-in fill, no canvas filters, so Safari and
// Chromium agree) — inside a terracotta panel under the verdict line the
// text share uses (share.ts shareVerdictParts; one source, no drift).
//
// STYLE.md box law, at poster scale: radius 0, no gradients, no shadows —
// flat night ground, flat clay panel, a hard double rule (bone outside,
// clay-dark inside), silhouettes on terracotta.

import type { Presenter } from '../../types.js';
import { nightVase } from './vase.js';
import { shareVerdictParts } from './share.js';
import { meta as sessionMeta } from '../../ui/context.js';

const W = 1080, H = 1080;
const NIGHT = '#120a06';
const CLAY = '#6b3018';
const CLAY_DARK = '#23120a';
const CLAY_LIGHT = '#93502e';
const BONE = '#e8d5b0';
const DIM = '#b08d62';

// The vase html wraps each figure's SVG in a span; the poster needs the raw
// SVGs plus their aspect (viewBox-only sprites have no intrinsic size — the
// CSS sizes them in the app; here the canvas must).
function svgsOf(html: string): { svg: string; aspect: number }[] {
  const out: { svg: string; aspect: number }[] = [];
  for (const m of html.matchAll(/<svg[\s\S]*?<\/svg>/g)) {
    const vb = m[0].match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
    const w = vb ? Number(vb[1]) : 300, h = vb ? Number(vb[2]) : 150;
    out.push({ svg: m[0], aspect: h > 0 ? w / h : 2 });
  }
  return out;
}

// The sprites are viewBox-only (the app sizes them in CSS) — but canvas
// drawImage silently fails on an SVG with no intrinsic size, so the poster
// stamps explicit width/height onto the string before rastering.
function loadSvg(svg: string, w: number, h: number): Promise<HTMLImageElement> {
  // Inline-in-HTML sprites carry no xmlns — standalone image documents
  // refuse to parse without it.
  const ns = svg.includes('xmlns=') ? '' : 'xmlns="http://www.w3.org/2000/svg" ';
  const sized = svg.replace('<svg ', `<svg ${ns}width="${Math.max(1, Math.round(w))}" height="${Math.max(1, Math.round(h))}" `);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('svg raster failed'));
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(sized);
  });
}

// Draw one sprite as a flat silhouette: raster to an offscreen canvas at
// target size, then source-in fill with the glaze color.
function silhouette(img: HTMLImageElement, w: number, h: number, color: string): HTMLCanvasElement {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.round(w));
  off.height = Math.max(1, Math.round(h));
  const c = off.getContext('2d')!;
  c.imageSmoothingEnabled = false;
  c.drawImage(img, 0, 0, off.width, off.height);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = color;
  c.fillRect(0, 0, off.width, off.height);
  return off;
}

export const odysseyShareImage: NonNullable<Presenter['shareImage']> = async (summary, lp, endingTitle) => {
  try {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;

    // The red-figure glaze (pass 44): a bought cosmetic — the panel fires
    // black and the figures stay living clay. Ground/figure colors swap;
    // everything else identical.
    const red = !!(sessionMeta?.unlockedWall || []).includes('gift_red_glaze');
    const panelFill = red ? '#1a0d06' : CLAY;
    const glaze = red ? '#c8622f' : CLAY_DARK;

    // The night ground.
    ctx.fillStyle = NIGHT;
    ctx.fillRect(0, 0, W, H);

    // Header — the telling's name, plain bone.
    ctx.fillStyle = BONE;
    ctx.font = '900 88px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('THE ODYSSEY', 80, 150);
    ctx.fillStyle = DIM;
    ctx.font = '600 40px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(String(endingTitle || '').slice(0, 44), 80, 214);

    // The vase panel: hard double rule (bone outline, clay-dark border).
    const px = 80, py = 280, pw = W - 160, ph = 520;
    ctx.fillStyle = panelFill;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = CLAY_LIGHT; ctx.lineWidth = 3;
    ctx.strokeRect(px - 8.5, py - 8.5, pw + 17, ph + 17);
    ctx.strokeStyle = CLAY_DARK; ctx.lineWidth = 6;
    ctx.strokeRect(px + 3, py + 3, pw - 6, ph - 6);

    // Tonight's band — the same chooser the ending screen used. The state
    // adapter mirrors share.ts's (summary → RunState shape).
    const vase = nightVase({
      flags: summary.flags || [],
      expedition: summary.expedition,
      athena: summary.athena,
      poseidon: summary.poseidon,
      ending: { key: summary.endingKey ?? null, result: summary.result ?? null },
      path: summary.path ?? null,
    } as any, true);
    const bandHtml = vase.html.split('ody-vase-sea')[0];
    const seaHtml = 'ody-vase-sea' + (vase.html.split('ody-vase-sea')[1] || '');
    const figs = svgsOf(bandHtml);
    const sea = svgsOf(seaHtml)[0];

    const FIG_H = 180, GAP = 36;
    const widths = figs.map((f) => FIG_H * f.aspect);
    const total = widths.reduce((a, b) => a + b, 0) + GAP * Math.max(0, figs.length - 1);
    const scale = total > pw - 80 ? (pw - 80) / total : 1;
    let x = px + (pw - total * scale) / 2;
    const figY = py + 90;
    for (let i = 0; i < figs.length; i++) {
      const w = widths[i] * scale, h = FIG_H * scale;
      const img = await loadSvg(figs[i].svg, w, h);
      ctx.drawImage(silhouette(img, w, h, glaze), Math.round(x), Math.round(figY + (FIG_H * scale - h)));
      x += w + GAP * scale;
    }
    // The water the sea wore, wide under the band.
    if (sea) {
      const sh = 44, sw = sh * sea.aspect;
      const img = await loadSvg(sea.svg, sw, sh);
      ctx.drawImage(silhouette(img, sw, sh, glaze), Math.round(px + (pw - sw) / 2), py + ph - 100);
    }

    // The verdict — the same line the text share leads with.
    const { fire, road, verdict } = shareVerdictParts(summary);
    ctx.fillStyle = BONE;
    ctx.font = '800 52px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`${verdict}`, 80, 900);
    ctx.fillStyle = DIM;
    ctx.font = '500 38px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`${fire} → ${road}`.slice(0, 52), 80, 956);
    ctx.fillText(`+${Math.max(0, Math.round(lp || 0))} Legacy`, 80, 1010);

    // Footer — where to sail it.
    ctx.fillStyle = DIM;
    ctx.font = '500 30px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('sandstreampop.github.io/big-break/odyssey', 80, H - 36);

    const blob: Blob | null = await new Promise((r) => c.toBlob(r, 'image/png'));
    return blob ? new File([blob], 'odyssey-vase.png', { type: 'image/png' }) : null;
  } catch {
    // The share must degrade to text, never break the sheet.
    return null;
  }
};
