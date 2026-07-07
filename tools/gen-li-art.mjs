// Love Island — contestant portrait generator (the workflow driver).
// Mirrors the tools/gen-li-golden.mjs pattern: an LI-specific tool that imports
// the built pack + a generic core (tools/art-core.mjs). It reads the FIXED cast
// (cast.ts) and the mood set (characters.ts), composes prompts from the style
// lock (docs/games/love-island/art/style.mjs), and generates a coherent
// portrait set with Nano Banana Pro — identity locked across moods by feeding
// each hero portrait back as a reference image.
//
// The human's entire job is: set GEMINI_API_KEY, run one command, glance at the
// contact sheet. Everything else — prompt assembly, retries, wiring the images
// into the runtime, the cost estimate — is automated.
//
//   node tools/gen-li-art.mjs                 # dry run: plan + cost + contact sheet, $0, no key
//   node tools/gen-li-art.mjs --generate --pilot     # render 2 contestants (Marco, Priya) + moods, then wire
//   node tools/gen-li-art.mjs --generate              # render the full cast (16 × 7)
//   node tools/gen-li-art.mjs --reroll=marco_fuming   # redo one slot
//   node tools/gen-li-art.mjs --wire                  # (re)wire whatever's in final/ into the game
//
// Build first (tools import dist/): npm run build.

import { readdirSync, copyFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CAST, castById } from '../dist/js/packs/love-island/cast.js';
import { MOODS } from '../dist/js/packs/love-island/plugins/characters.js';
import { STYLE_PREAMBLE, NEGATIVE, MOOD_EXPRESSIONS, SHAPE_HINTS, genderNote } from '../docs/games/love-island/art/style.mjs';
import {
  MODELS, generateWithRetry, writeManifest, readManifest, writeContactSheet,
  estimateCost, promptHash,
} from './art-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const ART = resolve(ROOT, 'docs/games/love-island/art');       // source-of-truth renders + plan
const FINAL = resolve(ART, 'final');                            // approved / current portraits
const PUBLIC = resolve(ROOT, 'docs/games/love-island/public/art/cast'); // deploy pipeline → dist/love-island/art/cast/
const DATA_TS = resolve(ROOT, 'js/packs/love-island/portraits.data.ts'); // the wired map (generated)
const MANIFEST = resolve(ART, 'manifest.json');
const SHEET = resolve(ART, 'contact-sheet.html');

// ---------- args ----------
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const doGenerate = has('--generate');
const doWireOnly = has('--wire') && !doGenerate;
const reroll = val('reroll', null);
const tier = val('tier', 'pro2k');                       // pro2k | pro4k | draft
const model = tier === 'draft' ? MODELS.draft : MODELS.pro;
const candidates = Number(val('candidates', 1));

// Which contestants: --pilot (Marco+Priya), --only=a,b,c, or the whole cast.
const selectIds = reroll ? [reroll.split('_')[0]]
  : has('--pilot') ? ['marco', 'priya']
  : val('only', null) ? val('only', '').split(',').map((s) => s.trim())
  : CAST.map((c) => c.id);
const selected = [...new Set(selectIds)].map(castById).filter(Boolean);

// ---------- prompt assembly (LI-specific; style DATA comes from style.mjs) ----------
function heroPrompt(cast) {
  return [
    STYLE_PREAMBLE,
    `Subject: a ${genderNote(cast.gender)} contestant, "${cast.vibe}".`,
    `${SHAPE_HINTS[cast.shape] || ''}.`,
    'Neutral, warm, relaxed-confident expression — this is their base look.',
    `Avoid: ${NEGATIVE}.`,
  ].join(' ');
}
function moodPrompt(cast, mood) {
  return [
    'Re-render the SAME PERSON as the reference image — identical face, hair, skin tone, and styling. Do not change who they are.',
    `They are the ${genderNote(cast.gender)} known as "${cast.vibe}".`,
    `Change only the expression/posture to: ${MOOD_EXPRESSIONS[mood]}.`,
    'Keep the same head-and-shoulders framing, villa golden-hour lighting, and semi-stylised look.',
    `Avoid: ${NEGATIVE}.`,
  ].join(' ');
}

// ---------- build the job list (hero + 6 moods per contestant) ----------
const MOOD_KEYS = Object.keys(MOODS);
function jobsFor(cast) {
  const hero = { slot: cast.id, kind: 'hero', castId: cast.id, mood: null,
    prompt: heroPrompt(cast), refs: [], out: resolve(FINAL, `${cast.id}.png`) };
  const moods = MOOD_KEYS.map((m) => ({ slot: `${cast.id}_${m}`, kind: 'mood', castId: cast.id, mood: m,
    prompt: moodPrompt(cast, m), refs: [hero.out], out: resolve(FINAL, `${cast.id}_${m}.png`) }));
  return [hero, ...moods];
}
let jobs = selected.flatMap(jobsFor);
if (reroll) jobs = jobs.filter((j) => j.slot === reroll);
jobs.forEach((j) => { j.promptHash = promptHash(j.prompt); j.model = model; });

// --skip-existing: never re-pay for a portrait already on disk. A full run
// after a pilot (or a re-run of a job that half-finished) only spends on the
// slots still missing. reroll deliberately overwrites, so it ignores this.
if (doGenerate && has('--skip-existing') && !reroll) {
  const before = jobs.length;
  jobs = jobs.filter((j) => !existsSync(j.out));
  console.log(`   --skip-existing: ${before - jobs.length} already rendered, ${jobs.length} to render (only pay for the gap)\n`);
}

const est = estimateCost({
  heroes: jobs.filter((j) => j.kind === 'hero').length,
  moods: jobs.filter((j) => j.kind === 'mood').length,
  candidates: doGenerate ? candidates : 0,
  tier: tier === 'draft' ? 'draft' : tier,
});

// ---------- wiring: final/*.png → public + portraits.data.ts ----------
function wire() {
  mkdirSync(PUBLIC, { recursive: true });
  const map = {};
  const files = existsSync(FINAL) ? readdirSync(FINAL).filter((f) => f.endsWith('.png')) : [];
  for (const f of files) {
    copyFileSync(resolve(FINAL, f), resolve(PUBLIC, f));
    map[f.replace(/\.png$/, '')] = `art/cast/${f}`; // key: "marco" or "marco_fuming"; path relative to /love-island/
  }
  const body = `// GENERATED by tools/gen-li-art.mjs --wire. Do not edit by hand.
// Maps a portrait slot ("<castId>" or "<castId>_<mood>") to its deploy path,
// served from docs/games/love-island/public/ → dist/love-island/. Empty until
// portraits are generated; an empty map means every face falls back to its
// emoji glyph (identical to pre-art behaviour), so this file is golden-safe.
export const PORTRAITS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
  writeFileSync(DATA_TS, body);
  return { count: files.length, map };
}

// ---------- run ----------
console.log(`\n🎨 Love Island portraits — ${selected.length} contestant(s), ${jobs.length} slot(s)`);
console.log(`   tier=${tier} model=${model}`);
console.log(`   ${est.line}\n`);

if (doWireOnly) {
  const { count } = wire();
  console.log(`🔌 wired ${count} portrait(s) → ${DATA_TS}`);
  console.log('   next: npm run build  (then open the Love Island game — portraits replace the emoji faces)');
  process.exit(0);
}

if (!doGenerate) {
  // Dry run — the safe default. Plans, costs, and writes a contact sheet of the
  // prompts. Spends nothing and needs no API key.
  writeManifest(MANIFEST, jobs);
  writeContactSheet(SHEET, {
    title: 'Love Island portraits — PLAN (dry run)',
    jobs, estimate: `${est.line}  ·  no images rendered yet — this is the plan`,
  });
  console.log(`📋 dry run. Wrote plan → ${MANIFEST}`);
  console.log(`   Review the prompts → ${SHEET}`);
  console.log('\n   To render for real:');
  console.log('     export GEMINI_API_KEY=...            # your Google AI Studio key');
  console.log('     node tools/gen-li-art.mjs --generate --pilot   # cheap 2-contestant pilot first');
  process.exit(0);
}

// Generate (paid). Requires a key.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('✗ GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey and:');
  console.error('    export GEMINI_API_KEY=...');
  process.exit(1);
}

// Heroes first (moods reference their hero portrait, so the file must exist).
const heroes = jobs.filter((j) => j.kind === 'hero');
const moods = jobs.filter((j) => j.kind === 'mood');
let ok = 0, fail = 0;
// One job never aborts the batch: a per-job try/catch means a single crash,
// timeout, or exhausted-retry is recorded and skipped, and every OTHER image
// still renders. Whatever succeeds is written to disk immediately, so a later
// interruption can only ever cost the in-flight image — never the batch.
for (const phase of [heroes, moods]) {
  for (const job of phase) {
    process.stdout.write(`  → ${job.slot} (${job.kind}) … `);
    try {
      const r = await generateWithRetry({ apiKey, model: job.model, prompt: job.prompt, refs: job.refs, out: job.out });
      if (r.ok) { ok++; job.status = 'rendered'; job.bytes = r.bytes; console.log(`ok (${(r.bytes / 1024).toFixed(0)} KB)`); }
      else { fail++; job.status = 'failed'; job.error = r.error; console.log(`FAILED — ${r.error}`); }
    } catch (e) {
      fail++; job.status = 'failed'; job.error = String(e && e.message || e); console.log(`CRASHED — ${job.error}`);
    }
  }
}
writeManifest(MANIFEST, jobs);
writeContactSheet(SHEET, { title: 'Love Island portraits — rendered', jobs, estimate: est.line });
console.log(`\n✅ rendered ${ok}, failed ${fail}. Contact sheet → ${SHEET}`);

// Wire whatever succeeded (idempotent). Re-running with --skip-existing later
// resumes exactly where this left off — already-rendered slots are never
// re-paid for.
if (!has('--no-wire') && ok > 0) {
  const { count } = wire();
  console.log(`🔌 wired ${count} portrait(s) → ${DATA_TS}`);
  console.log('   next: npm run build  (then open Love Island — portraits replace the emoji faces)');
}
