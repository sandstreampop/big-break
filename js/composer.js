// BIG BREAK — the composer (moonshot: Make the Songs Real).
//
// Every song the game tracks gets a deterministic, synthesized sound that
// is a fingerprint of the night you had:
//   GENRE picks the recipe (scale, tempo, drums, parody level),
//   INSTRUMENT sets the topline timbre (a kazoo SOUNDS like a kazoo),
//   the Idea-Grab HOOK becomes the melody (the thing you caught at 3 a.m.
//     is the thing you hear),
//   QUALITY TIER grows the arrangement (demo → charting → crowned HIT),
//   the minigame VERDICT sets the timing (BOTCHED is loose, GOLDEN locked).
//
// Two layers of determinism (see docs/moonshot-audible-songs.md §3):
//   - COMPOSITION (this file's pure half) is a seed-exact function of the
//     song's stamped facts. Node-importable, no Web Audio, fully testable.
//   - RENDER (browser half) turns a composition into an AudioBuffer via
//     OfflineAudioContext — memoized per session, never persisted.
//
// No unseeded randomness or wall-clock anywhere in the compose/render path.

import { mulberry32 } from './engine.js';
import { genreById } from './data/genres.js';
import { instrumentById } from './data/instruments.js';
import { music, audioCtx, audioState } from './audio.js';

// ---------- seeds ----------

export function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

// ---------- musical raw material ----------

export const SCALES = {
  minorPentatonic: [0, 3, 5, 7, 10],
  major:           [0, 2, 4, 5, 7, 9, 11],
  naturalMinor:    [0, 2, 3, 5, 7, 8, 10],
  dorian:          [0, 2, 3, 5, 7, 9, 10],
  phrygianDom:     [0, 1, 4, 5, 7, 8, 10],
};

export const DEFAULT_RECIPE = {
  scale: 'major', root: 57, bpmRange: [88, 104],
  drum: 'four', lead: 'reed', bed: 'plain', parody: 0, tropes: [],
};

// Instrument → topline timbre. Family fallback keeps every unlockable
// instrument audible; a missing everything falls back to 'reed'.
const INSTRUMENT_TIMBRE = {
  kazoo: 'kazoo', melodica: 'reed', own_voice: 'formant',
  electric_guitar: 'pluck', cigarbox_guitar: 'twang', modular_synth: 'acid',
  sampler: 'chopped', loop_station: 'looped', theremin: 'theremin',
  omnichord: 'bell', toy_glockenspiel: 'bell', triangle: 'bell',
  hurdy_gurdy: 'drone', bucket_drums: 'thump', washboard: 'scratch',
};
const FAMILY_TIMBRE = {
  strings: 'pluck', keys: 'reed', electronic: 'acid',
  voice: 'formant', wind: 'reed', percussion: 'thump',
};

export function timbreFor(instrumentId) {
  if (INSTRUMENT_TIMBRE[instrumentId]) return INSTRUMENT_TIMBRE[instrumentId];
  const family = instrumentById(instrumentId)?.family;
  return FAMILY_TIMBRE[family] || 'reed';
}

const TIER_RANK = { demo: 0, charting: 1, faded: 1, crowned: 2 };
export function songRank(song) {
  if (song.crowned) return 2;
  return TIER_RANK[song.status] ?? 0;
}

// verdict → timing tightness (0 = falling apart, 1 = locked in)
const VERDICT_TIGHT = { BOTCHED: 0.25, SCRAPPY: 0.55, SOLID: 0.8, GOLDEN: 1 };

// ---------- the hook becomes the melody (the emotional core) ----------
// Identical hook → identical topline, independent of tier/id/instrument.

export function hookToMelody(hook, recipe, fallback = 'untitled', bars = 4, notesPerBar = 4) {
  const scale = SCALES[recipe.scale] || SCALES.major;
  const src = hook || fallback || 'untitled';
  const prng = mulberry32(xmur3('melody|' + src + '|' + recipe.scale));
  const n = bars * notesPerBar;
  const notes = [];
  const chars = src.replace(/[^a-z]/gi, '').toLowerCase();
  for (let i = 0; i < n; i++) {
    // the hook's letters bias the contour; the prng fills the gaps
    const c = chars.length ? chars.charCodeAt(i % chars.length) - 97 : 0;
    const degree = (c + Math.floor(prng() * scale.length)) % scale.length;
    const octave = prng() < 0.22 ? 12 : 0;
    notes.push(recipe.root + 12 + scale[degree] + octave);
  }
  return notes;
}

// The chorus answers the verse: same hook, salted differently, lifted an
// octave where there's headroom (octaves preserve the scale).
function hookToChorus(hook, recipe, fallback) {
  const m = hookToMelody((hook || fallback || 'untitled') + '|chorus', recipe, fallback);
  return m.map((n) => (n < recipe.root + 22 ? n + 12 : n));
}

// ---------- arrangement ----------

// Sections per rank: a demo is a sketch, a charting song has a shape,
// a crowned HIT gets the full arc (with a final chorus for the tropes).
function sectionsFor(rank, beat) {
  const plans = [
    [['intro', 1], ['verse', 4], ['outro', 1]],
    [['intro', 2], ['verse', 4], ['chorus', 4], ['outro', 2]],
    [['intro', 2], ['verse', 4], ['chorus', 4], ['verse', 4], ['chorus', 4], ['final', 4], ['outro', 2]],
  ];
  let plan = plans[rank];
  // slow genres would balloon: trim repeats to keep crowned songs ≤ ~75s
  const barDur = beat * 4;
  while (plan.length > 3 && plan.reduce((s, [, b]) => s + b, 0) * barDur > 75) {
    const i = plan.findIndex(([name], idx) => idx > 0 && (name === 'verse' || name === 'chorus'));
    plan = plan.filter((_, idx) => idx !== i);
  }
  return plan.map(([name, bars]) => ({ name, bars }));
}

// Layers by rank (monotonic: demo ⊆ charting ⊆ crowned)
function layersFor(rank) {
  const layers = ['topline', 'bass'];
  if (rank >= 1) layers.push('pad', 'drums');
  if (rank >= 2) layers.push('counter', 'fx');
  return layers;
}

// A 4-chord loop in scale degrees, picked by the song's core seed
const CHORD_LOOPS = [
  [0, 5, 3, 4], [0, 3, 4, 3], [5, 3, 0, 4], [0, 4, 5, 3], [3, 4, 0, 0], [0, 2, 3, 4],
];

// ---------- compose: fingerprint → deterministic composition ----------

export function composeSong(song) {
  const recipe = genreById(song.genre)?.sound || DEFAULT_RECIPE;
  const rank = songRank(song);
  // The core seed EXCLUDES tier: a song keeps its tempo/chords/feel as it
  // grows — same song, bigger (Stage B's audible growth arc).
  const core = [song.id || '', song.title || '', song.genre || '', song.instrument || '', song.hook || ''].join('~');
  const seed = xmur3(core);
  const prng = mulberry32(seed);
  const [lo, hi] = recipe.bpmRange;
  const bpm = Math.round(lo + prng() * (hi - lo));
  const beat = 60 / bpm;
  const chords = CHORD_LOOPS[Math.floor(prng() * CHORD_LOOPS.length)];
  const melody = hookToMelody(song.hook, recipe, song.title);
  const chorusMelody = hookToChorus(song.hook, recipe, song.title);
  const sections = sectionsFor(rank, beat);
  const layers = layersFor(rank);
  const density = 0.4 + 0.25 * rank + prng() * 0.05;
  const tightness = VERDICT_TIGHT[song.verdict] ?? 0.7;
  const totalBars = sections.reduce((s, x) => s + x.bars, 0);
  return {
    seed, bpm, beat, rank,
    root: recipe.root,
    scale: recipe.scale,
    drum: recipe.drum || 'four',
    bed: recipe.bed || 'plain',
    parody: recipe.parody || 0,
    tropes: recipe.tropes || [],
    timbre: timbreFor(song.instrument),
    chords, melody, chorusMelody,
    sections, layers, density, tightness,
    totalBars,
    duration: totalBars * beat * 4 + 1.6, // tail for release/echo
  };
}

// Stable hash of a composition (determinism tests hash THIS, never PCM)
export function hashComposition(c) {
  return xmur3(JSON.stringify([
    c.seed, c.bpm, c.rank, c.root, c.scale, c.drum, c.timbre, c.chords,
    c.melody, c.chorusMelody, c.sections, c.layers,
    Math.round(c.density * 1000), Math.round(c.tightness * 1000),
  ]));
}

// ═══════════════════ BROWSER HALF: render + play ═══════════════════
// Everything below touches Web Audio only inside function bodies, so the
// module stays Node-importable for tools/test-composer.mjs.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// Deterministic noise buffer — the songs' percussion is seeded, always
// (the live lo-fi soundtrack is allowed unseeded noise; the SONGS are not)
function seededNoise(ctx, seed, seconds = 0.5) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const d = buf.getChannelData(0);
  const prng = mulberry32(seed);
  for (let i = 0; i < d.length; i++) d[i] = prng() * 2 - 1;
  return buf;
}

function env(ctx, t, attack, peak, dur, release = 0.08) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.setValueAtTime(peak, Math.max(t + attack, t + dur - release));
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  return g;
}

// One topline note in the song's instrument timbre
function voiceNote(ctx, timbre, note, t, dur, dest, prng, prevNote) {
  const f = midi(note);
  const oscs = [];
  const mk = (type, freq, det = 0) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (det) o.detune.setValueAtTime(det, t);
    oscs.push(o);
    return o;
  };
  let out; // node chain end that connects to dest
  switch (timbre) {
    case 'kazoo': {
      mk('sawtooth', f); mk('square', f, 14); mk('sawtooth', f * 2, -10);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.setValueAtTime(1500, t); bp.Q.value = 2.2;
      const g = env(ctx, t, 0.02, 0.16, dur);
      oscs.forEach((o) => o.connect(bp));
      bp.connect(g); out = g;
      // the buzz: fast shallow pitch wobble
      const lfo = mk('sine', 26); const lg = ctx.createGain(); lg.gain.value = 9;
      lfo.connect(lg); oscs.slice(0, 3).forEach((o) => lg.connect(o.detune));
      break;
    }
    case 'formant': case 'gang': {
      mk('sawtooth', f, -6); mk('sawtooth', f, 6);
      if (timbre === 'gang') { mk('sawtooth', f, -18); mk('sawtooth', f, 18); }
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.setValueAtTime(750, t); bp.Q.value = 1.1;
      const g = env(ctx, t, 0.05, timbre === 'gang' ? 0.14 : 0.17, dur);
      oscs.forEach((o) => o.connect(bp)); bp.connect(g); out = g;
      const lfo = mk('sine', 5.2); const lg = ctx.createGain(); lg.gain.value = 6;
      lfo.connect(lg); lg.connect(oscs[0].detune);
      break;
    }
    case 'pluck': case 'twang': {
      mk('sawtooth', f);
      const lp = ctx.createBiquadFilter();
      lp.type = timbre === 'twang' ? 'bandpass' : 'lowpass';
      lp.frequency.setValueAtTime(timbre === 'twang' ? 1300 : 2800, t);
      lp.frequency.exponentialRampToValueAtTime(timbre === 'twang' ? 500 : 500, t + Math.min(dur, 0.5));
      if (timbre === 'twang') lp.Q.value = 2.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.2, dur * 0.9));
      oscs[0].connect(lp); lp.connect(g); out = g;
      break;
    }
    case 'acid': {
      mk('sawtooth', f);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.Q.value = 8;
      lp.frequency.setValueAtTime(300, t);
      lp.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.35);
      lp.frequency.exponentialRampToValueAtTime(420, t + dur);
      const g = env(ctx, t, 0.01, 0.15, dur);
      oscs[0].connect(lp); lp.connect(g); out = g;
      break;
    }
    case 'chip': {
      mk('square', f); mk('square', f * 2, 4).detune.setValueAtTime(4, t);
      const g = env(ctx, t, 0.005, 0.09, dur, 0.02);
      oscs[0].connect(g);
      const g2 = ctx.createGain(); g2.gain.value = 0.25; oscs[1].connect(g2); g2.connect(g);
      out = g;
      break;
    }
    case 'chopped': {
      const o = mk('square', f);
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.94, t + Math.min(dur, 0.3));
      const g = env(ctx, t, 0.004, 0.13, Math.min(dur, 0.22), 0.02);
      o.connect(g); out = g;
      break;
    }
    case 'bell': {
      mk('sine', f); mk('sine', f * 2.76);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.6, dur));
      oscs[0].connect(g);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.06, t);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      oscs[1].connect(g2); g2.connect(g); out = g;
      break;
    }
    case 'theremin': {
      const o = mk('sine', prevNote ? midi(prevNote) : f);
      o.frequency.exponentialRampToValueAtTime(f, t + Math.min(0.12, dur * 0.3)); // glide
      const g = env(ctx, t, 0.06, 0.18, dur);
      const lfo = mk('sine', 6); const lg = ctx.createGain(); lg.gain.value = 12;
      lfo.connect(lg); lg.connect(o.detune);
      o.connect(g); out = g;
      break;
    }
    case 'looped': {
      mk('triangle', f);
      const g = env(ctx, t, 0.01, 0.16, Math.min(dur, 0.3), 0.03);
      oscs[0].connect(g);
      // the loop-station echo: two deterministic repeats
      const d1 = ctx.createDelay(1.2); d1.delayTime.value = 0.28;
      const dg = ctx.createGain(); dg.gain.value = 0.4;
      g.connect(d1); d1.connect(dg); dg.connect(d1);
      const merge = ctx.createGain(); g.connect(merge); dg.connect(merge);
      out = merge;
      break;
    }
    case 'drone': {
      mk('sawtooth', f); mk('sawtooth', midi(note - 5), 5); // fifth below rides along
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(1600, t);
      const g = env(ctx, t, 0.05, 0.11, dur);
      oscs.forEach((o) => o.connect(lp)); lp.connect(g); out = g;
      break;
    }
    case 'thump': {
      const o = mk('sine', f);
      o.frequency.exponentialRampToValueAtTime(Math.max(50, f * 0.5), t + 0.12);
      const g = env(ctx, t, 0.004, 0.3, Math.min(dur, 0.3), 0.05);
      o.connect(g); out = g;
      break;
    }
    case 'scratch': {
      const src = ctx.createBufferSource();
      src.buffer = seededNoise(ctx, Math.floor(f * 1000) | 1);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.setValueAtTime(f * 4, t); bp.Q.value = 3;
      const g = env(ctx, t, 0.005, 0.2, Math.min(dur, 0.18), 0.03);
      src.connect(bp); bp.connect(g);
      src.start(t); src.stop(t + Math.min(dur, 0.2) + 0.05);
      out = g;
      break;
    }
    case 'reed': default: {
      mk('square', f); mk('sawtooth', f, 7);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(1900, t);
      const g = env(ctx, t, 0.035, 0.14, dur);
      oscs.forEach((o) => o.connect(lp)); lp.connect(g); out = g;
      break;
    }
  }
  out.connect(dest);
  for (const o of oscs) { o.start(t); o.stop(t + dur + 0.6); }
}

// drums: seeded percussion. kick = sine drop, snare/hat = seeded noise.
function drumHit(ctx, kind, t, dest, seed, level = 1) {
  if (kind === 'kick') {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5 * level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.2);
    return;
  }
  if (kind === 'blip') {
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(kindFreq(seed), t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05 * level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.08);
    return;
  }
  const src = ctx.createBufferSource();
  src.buffer = seededNoise(ctx, seed);
  const f = ctx.createBiquadFilter();
  if (kind === 'snare') { f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.9; }
  else if (kind === 'hat') { f.type = 'highpass'; f.frequency.value = 7000; }
  else { f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.5; } // brush swish
  const g = ctx.createGain();
  const durs = { snare: 0.12, hat: 0.04, brush: 0.3 };
  const lvls = { snare: 0.18, hat: 0.07, brush: 0.05 };
  g.gain.setValueAtTime((lvls[kind] ?? 0.1) * level, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (durs[kind] ?? 0.1));
  src.connect(f); f.connect(g); g.connect(dest);
  src.start(t); src.stop(t + 0.35);
}
function kindFreq(seed) { return 800 + (seed % 800); }

// 16-step drum patterns per recipe style: [step, kind, level]
const DRUM_PATTERNS = {
  four:  [[0, 'kick'], [4, 'snare'], [8, 'kick'], [12, 'snare'], [2, 'hat', 0.7], [6, 'hat', 0.7], [10, 'hat', 0.7], [14, 'hat', 0.7]],
  stomp: [[0, 'kick'], [2, 'kick', 0.6], [4, 'snare'], [8, 'kick'], [10, 'kick', 0.6], [12, 'snare'], [14, 'snare', 0.5]],
  trap:  [[0, 'kick'], [6, 'kick', 0.8], [10, 'kick', 0.7], [8, 'snare'], [0, 'hat', 0.6], [2, 'hat', 0.6], [4, 'hat', 0.6], [6, 'hat', 0.9], [7, 'hat', 0.5], [8, 'hat', 0.6], [10, 'hat', 0.6], [12, 'hat', 0.6], [14, 'hat', 0.8], [15, 'hat', 0.5]],
  brush: [[0, 'brush', 0.8], [8, 'brush', 0.6], [4, 'hat', 0.4], [12, 'hat', 0.4]],
  chug:  [[0, 'kick'], [3, 'kick', 0.8], [6, 'kick', 0.8], [8, 'kick'], [11, 'kick', 0.8], [4, 'snare'], [12, 'snare'], [14, 'hat', 0.6]],
  soft:  [[0, 'kick', 0.7], [10, 'kick', 0.5], [4, 'snare', 0.5], [12, 'snare', 0.5], [6, 'hat', 0.4], [14, 'hat', 0.4]],
  blip:  [[0, 'kick', 0.8], [4, 'blip'], [8, 'kick', 0.7], [12, 'blip'], [2, 'blip', 0.5], [10, 'blip', 0.5], [14, 'blip', 0.7]],
  none:  [],
};

// ---------- render: composition → AudioBuffer (offline) ----------

export async function renderSong(comp) {
  if (typeof OfflineAudioContext === 'undefined') return null;
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, Math.ceil(comp.duration * sr), sr);
  const master = ctx.createGain();
  // polish rises with rank: a demo is thin and dry, a HIT is full and loud
  master.gain.value = [0.62, 0.8, 0.95][comp.rank] || 0.7;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = [3800, 8500, 16000][comp.rank] || 8000;
  const comprsr = ctx.createDynamicsCompressor();
  comprsr.threshold.value = -18; comprsr.ratio.value = comp.rank >= 2 ? 6 : 3;
  tone.connect(comprsr); comprsr.connect(master); master.connect(ctx.destination);
  const bus = tone;
  // space rises with rank too: one deterministic feedback echo
  let wet = null;
  if (comp.rank >= 1) {
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = comp.beat * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.25;
    wet = ctx.createGain(); wet.gain.value = comp.rank >= 2 ? 0.22 : 0.12;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(bus);
    wet._in = delay;
  }
  const send = (node) => { node.connect(bus); if (wet) node.connect(wet._in); };

  const scale = SCALES[comp.scale] || SCALES.major;
  const prng = mulberry32(comp.seed ^ 0x9e3779b9); // render-side humanize
  const loose = (1 - comp.tightness) * 0.045; // BOTCHED drifts, GOLDEN locks
  const beat = comp.beat;
  const step = beat / 4;
  let t = 0.05;
  let bar = 0;
  let prevNote = null;
  const finalLift = comp.tropes.includes('keyChangeFinale') ? 2
    : comp.tropes.includes('pitchLift') ? 12 : 0;

  for (const sec of comp.sections) {
    const isChorus = sec.name === 'chorus' || sec.name === 'final';
    const isFinal = sec.name === 'final';
    const lift = isFinal ? finalLift : 0;
    const melody = isChorus ? comp.chorusMelody : comp.melody;
    const secGain = sec.name === 'intro' || sec.name === 'outro' ? 0.7 : 1;
    for (let b = 0; b < sec.bars; b++, bar++) {
      const barT = t + b * beat * 4;
      const chordDeg = comp.chords[bar % 4];
      const chordRoot = comp.root + scale[chordDeg % scale.length];
      // bass — always
      if (comp.layers.includes('bass') && sec.name !== 'intro') {
        const bo = ctx.createOscillator();
        bo.type = 'triangle';
        bo.frequency.setValueAtTime(midi(chordRoot - 12 + lift), barT);
        const bg = env(ctx, barT, 0.02, 0.2 * secGain, beat * 3.4, 0.3);
        bo.connect(bg); send(bg);
        bo.start(barT); bo.stop(barT + beat * 4);
        if (comp.drum === 'chug' || comp.drum === 'stomp') {
          const b2 = ctx.createOscillator();
          b2.type = 'triangle';
          b2.frequency.setValueAtTime(midi(chordRoot - 12 + lift), barT + beat * 2);
          const g2 = env(ctx, barT + beat * 2, 0.02, 0.16 * secGain, beat * 1.4, 0.2);
          b2.connect(g2); send(g2);
          b2.start(barT + beat * 2); b2.stop(barT + beat * 4);
        }
      }
      // pad bed — rank 1+
      if (comp.layers.includes('pad')) {
        const padNotes = [chordRoot, chordRoot + scale[2 % scale.length], chordRoot + 7].map((n) => n + lift);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.setValueAtTime(comp.bed === 'detuned' ? 700 : 1100, barT);
        const pg = env(ctx, barT, beat, 0.05 * secGain, beat * 4, 0.5);
        lp.connect(pg); send(pg);
        for (const n of padNotes) {
          for (const det of comp.bed === 'detuned' ? [-14, 10] : [-5, 5]) {
            const o = ctx.createOscillator();
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(midi(n), barT);
            o.detune.setValueAtTime(det, barT);
            o.connect(lp); o.start(barT); o.stop(barT + beat * 4 + 0.5);
          }
        }
      }
      // drums — rank 1+
      if (comp.layers.includes('drums') && sec.name !== 'intro') {
        for (const [st, kind, lvl] of DRUM_PATTERNS[comp.drum] || DRUM_PATTERNS.four) {
          const jitter = (prng() * 2 - 1) * loose * 0.5;
          drumHit(ctx, kind, barT + st * step + Math.max(0, jitter), bus,
            comp.seed + st * 7 + bar, (lvl ?? 1) * secGain * (isChorus ? 1.1 : 1));
        }
      }
      // topline — the hook, in the instrument's voice
      if (comp.layers.includes('topline') && sec.name !== 'intro' && sec.name !== 'outro') {
        for (let i = 0; i < 4; i++) {
          const idx = (b * 4 + i) % melody.length;
          // density decides how busy the line is; sparse songs breathe
          if (prng() > comp.density + (isChorus ? 0.18 : 0)) continue;
          const note = melody[idx] + lift;
          const jitter = (prng() * 2 - 1) * loose;
          const nT = barT + i * beat + Math.max(0, jitter);
          const dur = beat * (prng() < 0.25 ? 1.7 : 0.9);
          const tap = ctx.createGain();
          tap.gain.value = 1;
          send(tap);
          voiceNote(ctx, comp.timbre, note, nT, dur, tap, prng, prevNote);
          prevNote = note;
        }
      }
      // counter-melody arp — rank 2
      if (comp.layers.includes('counter') && isChorus) {
        for (let i = 0; i < 8; i++) {
          if (prng() > 0.8) continue;
          const n = chordRoot + 12 + scale[(i * 2) % scale.length] + lift;
          const o = ctx.createOscillator();
          o.type = 'triangle';
          o.frequency.setValueAtTime(midi(n), barT + i * beat * 0.5);
          const g = env(ctx, barT + i * beat * 0.5, 0.01, 0.05, beat * 0.4, 0.05);
          o.connect(g); send(g);
          o.start(barT + i * beat * 0.5); o.stop(barT + i * beat * 0.5 + beat);
        }
      }
      // gang chorus (folk punk / shanty): the crowd joins the hook
      if (comp.tropes.includes('gangChorus') || comp.tropes.includes('heaveHo')) {
        if (isChorus && comp.rank >= 1) {
          const stabT = barT + beat * (comp.tropes.includes('heaveHo') ? 1.5 : 2);
          voiceNote(ctx, 'gang', comp.root + 12 + scale[chordDeg % scale.length], stabT, beat * 0.8, bus, prng, null);
        }
      }
    }
    t += sec.bars * beat * 4;
  }
  return ctx.startRendering();
}

// ---------- cache + player ----------

const bufferCache = new Map(); // key → AudioBuffer (session-only)
const CACHE_CAP = 24;

export function songKey(song) {
  return composeSong(song).seed + ':' + songRank(song);
}

export async function bufferFor(song) {
  const key = songKey(song);
  if (bufferCache.has(key)) return bufferCache.get(key);
  const buf = await renderSong(composeSong(song));
  if (buf) {
    if (bufferCache.size >= CACHE_CAP) {
      bufferCache.delete(bufferCache.keys().next().value);
    }
    bufferCache.set(key, buf);
  }
  return buf;
}

// The catalog player: one song at a time, shared gain, ducks the lo-fi
// soundtrack while your actual song plays, restores it after.
export const songPlayer = {
  _src: null,
  _gain: null,
  playingKey: null,
  onchange: null, // UI hook

  _bus(ctx) {
    if (!this._gain) {
      this._gain = ctx.createGain();
      this._gain.gain.value = 1;
      this._gain.connect(ctx.destination);
    }
    return this._gain;
  },

  async play(song, { onended, gain = 0.9 } = {}) {
    const st = audioState();
    if (!st.sound && !st.music) return false; // fully muted = fully muted
    const ctx = audioCtx();
    if (!ctx) return false;
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }
    const key = songKey(song);
    if (this.playingKey === key) { this.stop(); return false; } // toggle
    this.stop(true);
    const buf = await bufferFor(song);
    if (!buf) return false;
    music.suppress(true); // your song takes the room; lo-fi waits outside
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(this._bus(ctx));
    src.onended = () => {
      if (this._src === src) {
        this._src = null;
        this.playingKey = null;
        music.suppress(false);
        this.onchange?.();
        onended?.();
      }
    };
    this._src = src;
    this.playingKey = key;
    src.start();
    this.onchange?.();
    return true;
  },

  stop(silent = false) {
    if (this._src) {
      const s = this._src;
      this._src = null;
      this.playingKey = null;
      try { s.onended = null; s.stop(); } catch (e) {}
      music.suppress(false);
      this.onchange?.();
    }
  },
};

// ---------- the catalog DJ (Stage C: your songs score the run) ----------
// At the big beats (act breaks, endings), the score stops being generic
// lo-fi and becomes YOUR catalog — if the catalog has earned it. Early
// acts stay sparse; a late-career run scores itself. Muted stays muted,
// thin catalogs fall back to MOODS, and any failure is silent.

export const catalogDJ = {
  // The song most worth hearing right now: crowned first, then best peak,
  // then best charting, then loudest demo.
  pick(songs) {
    const pool = (songs || []).filter((s) => s.title);
    if (!pool.length) return null;
    const score = (s) => (s.crowned ? 300 : 0) + (s.peak ? 100 - s.peak * 4 : 0) +
      (s.status === 'charting' ? 50 : 0) + (s.quality || 0) / 2 + (s.hype || 0) / 4;
    return pool.slice().sort((a, b) => score(b) - score(a))[0];
  },

  // Act-break underscore: play the newest/best track under the reveal.
  // Only once the catalog is real (a charting song or better).
  async actBreak(run) {
    try {
      const songs = run?.songs || [];
      const worthy = songs.filter((s) => s.status === 'charting' || s.crowned || s.peak);
      if (!worthy.length) return false; // thin catalog → MOODS carries on
      const pick = this.pick(worthy);
      if (!pick) return false;
      return await songPlayer.play(pick);
    } catch (e) { return false; }
  },

  // The finale/ending: the career plays itself out — best song, full size.
  async ending(run) {
    try {
      const pick = this.pick(run?.songs);
      if (!pick) return false;
      return await songPlayer.play(pick);
    } catch (e) { return false; }
  },
};

// The catalog radio (Stage C): once the catalog is REAL, the generic
// lo-fi score starts yielding to your own songs mid-act — sparse early,
// self-scoring late. Round-robin (deterministic), soft gain, and the
// lo-fi returns the moment a song ends. Thin catalogs / muted players /
// act 1 are untouched: silence and MOODS stay first-class.
export const catalogRadio = {
  _next: 0,
  _lastAt: -99,
  tick(run) {
    try {
      if (!run || run.tutorial || (run.act || 1) < 2) return;
      if (!audioState().music) return;
      if (songPlayer.playingKey) return; // something's already on
      const played = (run.cardLog || []).length;
      if (played - this._lastAt < 8) return; // let the lo-fi breathe between spins
      const cat = (run.songs || []).filter((s) => s.status === 'charting' || s.crowned || s.peak);
      if (cat.length < 2) return; // the catalog hasn't earned the booth yet
      this._lastAt = played;
      const pick = cat[this._next++ % cat.length];
      songPlayer.play(pick, { gain: 0.5 });
    } catch (e) { /* the radio never breaks the game */ }
  },
};
