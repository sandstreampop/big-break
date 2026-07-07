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
// A GenerateContentRequest body: prompt text + any reference images inlined.
// Shared by the sync and batch paths so the two never drift. Throws if a
// reference file is missing (a mood asking for a hero that didn't render).
function buildRequest(prompt, refs = []) {
  const parts = [{ text: prompt }];
  for (const ref of refs) {
    if (!existsSync(ref)) throw new Error(`reference image missing: ${ref}`);
    parts.push({ inlineData: { mimeType: 'image/png', data: readFileSync(ref).toString('base64') } });
  }
  return { contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'] } };
}

// Pull the first inline image out of a GenerateContentResponse, or a reason.
function extractImage(genResponse) {
  const parts = genResponse?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data);
  if (img) return { data: img.inlineData.data };
  const text = parts.find((p) => p.text)?.text || 'no image in response';
  return { error: `no image returned (${text.slice(0, 200)})` };
}

export async function generateImage({ apiKey, model, prompt, refs = [], out }) {
  let body;
  try { body = buildRequest(prompt, refs); } catch (e) { return { ok: false, error: e.message }; }
  const url = `${API_ROOT}/${model}:generateContent?key=${apiKey}`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) { return { ok: false, error: `network: ${e.message}` }; }
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}` };
  const img = extractImage(await res.json());
  if (img.error) return { ok: false, error: img.error };
  const buf = Buffer.from(img.data, 'base64');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buf);
  return { ok: true, bytes: buf.length };
}

// Retry wrapper: exponential backoff on transient failures (matches the repo's
// git-op retry ethos). Terminal 4xx (bad prompt/key) fail fast.
export async function generateWithRetry(job, { tries = 4 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    const r = await generateImage(job);
    if (r.ok) return r;
    last = r;
    // Fail fast ONLY on genuinely unretryable client errors (bad request / auth
    // / not-found / bad model id). Everything else — 408 timeout, 429 rate
    // limit, 5xx, network blips — is transient and RETRIED with exponential
    // backoff. (A 429 was previously misclassified as fatal; it isn't.)
    if (/HTTP (400|401|403|404)/.test(r.error || '')) break;
    await new Promise((res) => setTimeout(res, 1500 * 2 ** i));
  }
  return last;
}

// ---------- BATCH engine (crash-proof + 50% cheaper) ----------
// The Batch API generates asynchronously and RETAINS results server-side, so a
// failure on our side after Google has generated+billed an image cannot lose
// it — we just re-fetch the same batch. The batch's resource name is persisted
// by the caller, so a dead runner resumes the SAME batch (no re-submission, no
// double charge). API shape confirmed against the v1beta discovery document:
//   create : POST v1beta/models/{model}:batchGenerateContent  → Operation
//   poll   : GET  v1beta/{operation.name}                     → Operation
//   result : batch.output.inlinedResponses[] (each carries back our metadata)

const V1 = 'https://generativelanguage.googleapis.com/v1beta';

// Submit one batch of image requests. jobs: [{ prompt, refs, slot }]. Returns
// the Operation name to poll (also the resumable handle). Throws on create
// failure (nothing is billed for a rejected create).
export async function submitBatch({ apiKey, model, displayName, jobs }) {
  const m = model.startsWith('models/') ? model : `models/${model}`; // schema: "models/{model}"
  const requests = jobs.map((j) => ({ request: buildRequest(j.prompt, j.refs), metadata: { slot: j.slot } }));
  const body = { batch: { displayName, model: m, inputConfig: { requests: { requests } } } };
  const res = await fetch(`${V1}/${m}:batchGenerateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`batch create HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const op = await res.json();
  if (!op.name) throw new Error(`batch create returned no operation name: ${JSON.stringify(op).slice(0, 200)}`);
  return op.name;
}

// Poll a batch operation once. Returns { done, state, batch, error }. The batch
// resource (with .state and .output) rides in op.response when finished, or
// op.metadata while running.
export async function getBatch({ apiKey, name }) {
  const res = await fetch(`${V1}/${name}?key=${apiKey}`, { headers: { 'content-type': 'application/json' } });
  if (!res.ok) throw new Error(`batch poll HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const op = await res.json();
  const batch = op.response || op.metadata || {};
  const state = batch.state || (op.done ? 'BATCH_STATE_SUCCEEDED' : 'BATCH_STATE_RUNNING');
  return { done: !!op.done || state === 'BATCH_STATE_SUCCEEDED', state, batch, error: op.error };
}

const BATCH_TERMINAL_BAD = ['BATCH_STATE_FAILED', 'BATCH_STATE_CANCELLED', 'BATCH_STATE_EXPIRED'];
export function isBatchFailed(state) { return BATCH_TERMINAL_BAD.includes(state); }

// Write out every image a finished batch returned, mapping each response to its
// job by the metadata.slot we attached. Returns per-slot results.
export function collectBatch(batch, bySlot) {
  const responses = batch.output?.inlinedResponses?.inlinedResponses || [];
  let ok = 0, fail = 0; const results = [];
  responses.forEach((r, i) => {
    const slot = r.metadata?.slot;
    const job = (slot && bySlot[slot]) || null;
    if (!job) { fail++; results.push({ slot: slot || `#${i}`, error: 'no matching job' }); return; }
    if (r.error) { fail++; results.push({ slot, error: r.error.message || JSON.stringify(r.error).slice(0, 120) }); return; }
    const img = extractImage(r.response);
    if (img.error) { fail++; results.push({ slot, error: img.error }); return; }
    const buf = Buffer.from(img.data, 'base64');
    mkdirSync(dirname(job.out), { recursive: true });
    writeFileSync(job.out, buf);
    ok++; results.push({ slot, bytes: buf.length });
  });
  return { ok, fail, results };
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
// batch: true applies the Batch API's 50% discount to the finals.
export function estimateCost({ heroes, moods, candidates, tier = 'pro2k', batch = false }) {
  const drafts = (heroes + moods) * candidates;
  const finals = heroes + moods;
  const rate = PRICES[tier] * (batch ? 0.5 : 1);
  const draftUsd = drafts * PRICES.draft;
  const finalUsd = finals * rate;
  const how = batch ? `${tier} batch (50% off)` : tier;
  return {
    drafts, finals, draftUsd, finalUsd, total: draftUsd + finalUsd,
    line: `${drafts} drafts (~$${draftUsd.toFixed(2)}) + ${finals} finals @ ${how} (~$${finalUsd.toFixed(2)}) = ~$${(draftUsd + finalUsd).toFixed(2)}`,
  };
}
