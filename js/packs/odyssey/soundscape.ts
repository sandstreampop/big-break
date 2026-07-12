// The Odyssey — the soundscape (the Sound Law, NORTH-STAR.md; ADR-0001).
// Silence is the identity: registering this turns the shell's lo-fi engine
// and generic blips OFF for the odyssey, and every shell cue routes here by
// name — almost all of them to silence, deliberately.
//
// THE LEXICON (I6): a sacred few authored sound-events. One meaning, one
// sound, never reused — the table below is the canon, and
// test/odyssey-sound.test.mjs holds it to that law (distinct recipes, no
// alias meanings). Each entry is named like a character:
//   the stroke     — a choice committed (the only frequent one; more feel
//                    than sound: an oar knocking the thole pin)
//   the wave       — Poseidon moves against you
//   the owl-note   — Athena moves for you
//   the fragment-chime — a piece of Tiresias' prophecy is banked
//   the bow-string — plucked once, at the Hall: the game's one musical note
//   dawn birds     — Ithaca, sighted
//   the gutter     — the ember dies with the run (Despair, or the sea)
//   the hush       — a temptation opens: what SOUNDS is nothing; the
//                    ambience thins (anti-ceremony; wired fully in I7)
//
// All synthesis is WebAudio into the shell's gesture-unlocked context
// (getCtx()); the shell gates every routed cue on the player's sound
// setting. The hearth whisper (the one continuous ambience) lives in
// alive.ts — the fire alone may whisper, and only at frame beats.

import { getCtx } from '../../audio.js';
import { meta } from '../../ui/context.js';
import type { Presenter } from '../../types.js';

type Recipe = () => void;

function tone(freq: number, dur: number, peak: number, type: OscillatorType = 'sine', when = 0, glideTo?: number): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01 + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur * 0.8);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseSwell(dur: number, peak: number, cutoff: number, when = 0): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01 + when;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(cutoff, t);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + dur * 0.45);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(lp).connect(g).connect(ctx.destination);
  src.start(t);
  src.stop(t + dur + 0.05);
}

// ── The canon. One meaning each; recipes deliberately unalike. ──
export const LEXICON: Record<string, Recipe> = {
  // *the stroke* — low, short, woody: an oar against the thole pin.
  stroke() {
    const ctx = getCtx();
    if (!ctx) return;
    tone(94, 0.11, 0.09, 'sine', 0, 58);
  },
  // *the wave* — a dark swell from below, no pitch to hum along to.
  wave() { noiseSwell(0.7, 0.05, 320); },
  // *the owl-note* — one small round call, high and brief, twice-gentle.
  owlNote() { tone(988, 0.09, 0.045, 'sine'); tone(784, 0.14, 0.04, 'sine', 0.09); },
  // *the fragment-chime* — struck metal, inharmonic, long decay: something
  // old put away in a chest.
  fragmentChime() { tone(1244, 0.9, 0.045, 'triangle'); tone(1661, 0.7, 0.03, 'triangle', 0.02); },
  // *the bow-string* — the one musical note in the game, plucked once. In
  // Homer the string "sings like a swallow": a taut fundamental with a
  // bright fifth riding it.
  bowString() { tone(196, 1.1, 0.08, 'sawtooth', 0, 194); tone(294, 0.8, 0.035, 'triangle', 0.02); },
  // *dawn birds* — Ithaca sighted: three small unmetered calls, then quiet.
  dawnBirds() {
    tone(1568, 0.07, 0.035, 'sine');
    tone(1760, 0.06, 0.03, 'sine', 0.16);
    tone(1480, 0.09, 0.03, 'sine', 0.4);
  },
  // *the gutter* — the ember dies with the run: a low fall into nothing.
  gutter() { tone(220, 1.4, 0.06, 'sine', 0, 55); },
};

// The shell cues this pack chooses to voice. Everything absent is silence —
// deliberately: no ui blip, no result stinger, no win fanfare (anti-goals).
// Exported so the sound test can pin the TABLE (exactly one voiced cue),
// not merely that unvoiced cues don't throw.
export const EVENTS: Record<string, Recipe> = {
  swipe: LEXICON.stroke,
};

// The haptic grammar: the shell's built-in vibration moments, re-voiced.
// The game's pulse is authored, not inherited. (The god-pulse, deep-buzz
// and crowd-stir ride the pack's own moments in alive.ts / presenter.)
const HAPTICS: Record<string, number[] | null> = {
  'swipe': [10],
  'result-bad': null,
  'result-incredible': null,
  'set-piece': null,
  'set-piece-blow': [60, 40, 90], // a blow still LANDS (the sea is real)
  'flashpoint': null,
  'hush': null, // the absence IS the cue
};

export const odysseySoundscape: NonNullable<Presenter['soundscape']> = {
  event(name: string) { EVENTS[name]?.(); },
  // No shell-driven continuous ambience: the tale is silent, the deep is
  // dead silent, and the hearth whisper (alive.ts) belongs to frame beats
  // only. 'off' is honored trivially — nothing is running.
  ambience() { /* silence, deliberately */ },
  haptic(name: string) { return name in HAPTICS ? HAPTICS[name] : null; },
};

// ── The lexicon's call sites (pure mappings + one gated player) ──

// The one lexicon speaker: honors the player's sound toggle (direct pack
// calls bypass the shell's routed gate, so the gate lives here too).
export function speak(name: keyof typeof LEXICON): void {
  if (meta?.settings?.sound === false) return;
  LEXICON[name]?.();
}

// Which lexicon event a card result speaks — ONE at most, by priority:
// the Hall's bow answers everything; a banked prophecy fragment outranks
// the gods; Poseidon outranks Athena when both move (his sea, his say).
// Pure and unit-tested (test/odyssey-sound.test.mjs).
export function resultCue(result: { event?: { id?: string } | null; deltas?: { key: string; amount: number }[] }): string | null {
  const id = result?.event?.id || '';
  if (id.startsWith('ody_hall_')) return 'bowString';
  if (id === 'ody_tiresias' || id === 'ody_tiresias_oar') return 'fragmentChime';
  const ds = Array.isArray(result?.deltas) ? result.deltas : [];
  const delta = (k: string) => ds.filter((d) => d.key === k).reduce((n, d) => n + (d.amount || 0), 0);
  if (delta('poseidon') > 0) return 'wave';
  if (delta('athena') > 0) return 'owlNote';
  return null;
}

// Which lexicon event an ending speaks. Kleos already sang at the Hall;
// the banked tellings keep the quiet they chose (the cup just sets down).
export function endingCue(endingKey: string | null | undefined, result: string | null | undefined): string | null {
  if (endingKey === 'nostos') return result === 'failure' ? 'gutter' : 'dawnBirds';
  if (endingKey === 'wrath' || endingKey === 'burnout') return 'gutter';
  return null;
}
