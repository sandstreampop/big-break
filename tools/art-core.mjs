// Genre-neutral art-generation mechanism (see CLAUDE.md: "Clean generic
// engine, specific implementations"). This file knows NOTHING about Love
// Island, contestants, or moods — it's the reusable plumbing a per-game driver
// (e.g. tools/gen-li-art.mjs) calls with a list of already-assembled jobs:
//   { slot, kind, prompt, refs?: string[], out }
// It handles the Gemini REST calls (draft + Pro tiers), a deterministic
// plan/manifest, a browsable contact sheet, and cost estimation. Zero deps —
// Node's built-in fetch does the HTTP, mirroring the repo's no-dependency tools.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, relative } from 'node:path';

// Model tiers. Preview image-model ids churn, so both are env-overridable — a
// driver never hard-codes them and a stale default is a one-line fix, not a
// code change. `pro` is Nano Banana Pro (Gemini 3 Pro Image): best-in-class
// identity preservation across a set, which is the whole reason we picked it
// for a fixed cast worn across a mood matrix. `draft` is plain Nano Banana
// (Gemini 2.5 Flash Image): cheap + fast, for the throwaway exploration pass.
export const MODELS = {
  draft: process.env.GEMINI_DRAFT_MODEL || 'gemini-2.5-flash-image',
  pro: process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview',
};

// Per-image list price (USD), July 2026. Estimation only — swap freely; the
// driver prints these so a run never surprises you. draft ≈ Flash Image;
// pro2k/pro4k ≈ Nano Banana Pro standard / 4K.
export const PRICES = { draft: 0.039, pro2k: 0.134, pro4k: 0.24 };

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';

// Stable 8-hex digest of a string — the plan's identity for a job. Same prompt
// ⇒ same hash, so a re-plan is diffable and a manifest tells you at a glance
// which prompts changed since the last render.
export function promptHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// One image call. Returns { ok, bytes } on success (and writes the PNG to
// job.out), or { ok:false, error } — the caller decides whether to retry or
// skip. refs are file paths to prior renders fed back as reference images: the
// identity-lock seam (a mood render references its hero portrait).
export async function generateImage({ apiKey, model, prompt, refs = [], out }) {
  const parts = [{ text: prompt }];
  for (const ref of refs) {
    if (!existsSync(ref)) return { ok: false, error: `reference image missing: ${ref}` };
    parts.push({ inlineData: { mimeType: 'image/png', data: readFileSync(ref).toString('base64') } });
  }
  const url = `${API_ROOT}/${model}:generateContent?key=${apiKey}`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'] } }),
    });
  } catch (e) { return { ok: false, error: `network: ${e.message}` }; }
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}` };
  const json = await res.json();
  const cand = json.candidates?.[0]?.content?.parts || [];
  const img = cand.find((p) => p.inlineData?.data);
  if (!img) {
    const text = cand.find((p) => p.text)?.text || 'no image in response';
    return { ok: false, error: `no image returned (${text.slice(0, 200)})` };
  }
  const buf = Buffer.from(img.inlineData.data, 'base64');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buf);
  return { ok: true, bytes: buf.length };
}

// Retry wrapper: exponential backoff on transient failures (matches the repo's
// git-op retry ethos). Terminal 4xx (bad prompt/key) fail fast.
export async function generateWithRetry(job, { tries = 3 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    const r = await generateImage(job);
    if (r.ok) return r;
    last = r;
    if (/HTTP 4\d\d/.test(r.error || '')) break; // client error — retrying won't help
    await new Promise((res) => setTimeout(res, 1000 * 2 ** i));
  }
  return last;
}

// ---------- manifest (the deterministic plan) ----------
export function writeManifest(path, jobs) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ generatedBy: 'tools/art-core.mjs', jobs }, null, 2) + '\n');
}
export function readManifest(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { jobs: [] };
}

// ---------- contact sheet (curation surface) ----------
// One self-contained HTML page: every job as a card with its rendered image (or
// a "PLANNED" placeholder in a dry run), the prompt, and its reference. This is
// what a human eyeballs to approve/reroll — the entire HITL review surface.
export function writeContactSheet(path, { title, jobs, estimate }) {
  const base = dirname(path);
  const card = (j) => {
    const rel = j.out ? relative(base, j.out) : '';
    const img = j.out && existsSync(j.out)
      ? `<img src="${rel}" loading="lazy" alt="">`
      : `<div class="ph">PLANNED<br><small>dry run — no image yet</small></div>`;
    const refs = (j.refs || []).map((r) => `<code>${relative(base, r)}</code>`).join(' ');
    return `<figure class="c">
      <div class="img">${img}</div>
      <figcaption>
        <b>${j.slot}</b> <span class="k">${j.kind}</span> <span class="hash">${j.promptHash || ''}</span>
        <p class="prompt">${escapeHtml(j.prompt)}</p>
        ${refs ? `<p class="ref">ref: ${refs}</p>` : ''}
      </figcaption>
    </figure>`;
  };
  const html = `<!doctype html><meta charset="utf-8"><title>${title}</title>
<style>
  :root { color-scheme: dark; }
  body { background:#14101f; color:#e9e4f5; font:14px/1.4 system-ui,sans-serif; margin:0; padding:24px; }
  h1 { font-size:19px; } .est { color:#b7a9d9; margin:0 0 18px; }
  .grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); }
  .c { margin:0; background:#1e1830; border:1px solid #362b52; border-radius:12px; overflow:hidden; }
  .img { aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; background:#0d0a16; }
  .img img { width:100%; height:100%; object-fit:cover; } .ph { color:#6c5f8f; text-align:center; font-size:12px; }
  figcaption { padding:10px 12px; } .k { color:#8ee6c8; font-size:11px; text-transform:uppercase; }
  .hash { color:#5b4f7d; font-size:10px; float:right; }
  .prompt { color:#c8bde6; font-size:11px; margin:6px 0 0; white-space:pre-wrap; }
  .ref { color:#7d70a3; font-size:10px; margin:4px 0 0; } code { color:#e0b0ff; }
</style>
<h1>${title}</h1><p class="est">${escapeHtml(estimate || '')}</p>
<div class="grid">${jobs.map(card).join('')}</div>`;
  mkdirSync(base, { recursive: true });
  writeFileSync(path, html);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

// ---------- cost estimation ----------
export function estimateCost({ heroes, moods, candidates, tier = 'pro2k' }) {
  const drafts = (heroes + moods) * candidates;
  const finals = heroes + moods;
  const draftUsd = drafts * PRICES.draft;
  const finalUsd = finals * PRICES[tier];
  return {
    drafts, finals, draftUsd, finalUsd, total: draftUsd + finalUsd,
    line: `${drafts} drafts (~$${draftUsd.toFixed(2)}) + ${finals} finals @ ${tier} (~$${finalUsd.toFixed(2)}) = ~$${(draftUsd + finalUsd).toFixed(2)}`,
  };
}
