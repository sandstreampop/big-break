// The Odyssey — the soundscape (the Sound Law, NORTH-STAR.md; ADR-0001).
// Silence is the identity: registering this turns the shell's lo-fi engine
// and generic blips OFF for the odyssey, and every shell cue routes here by
// name. v0 (I1) voices exactly ONE event — *the stroke*, the faint oar-thunk
// of a committed choice, the only frequent sound in the game — and answers
// everything else with silence. The rest of the sacred-few lexicon (the
// wave, the owl-note, the fragment-chime, the gutter, dawn birds, the
// bow-string) lands in I6, each with one meaning, never reused; the
// one-meaning-one-sound table is unit-tested there.
//
// All synthesis is WebAudio into the shell's gesture-unlocked context
// (getCtx()); the shell gates every call on the player's sound setting
// before it reaches us, and haptics stay behind the shell's haptics toggle.

import { getCtx } from '../../audio.js';
import type { Presenter } from '../../types.js';

// *the stroke* — a low, short, woody thunk: an oar knocking the thole pin,
// more feel than sound. One meaning: a choice was committed.
function stroke(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(94, t);
  osc.frequency.exponentialRampToValueAtTime(58, t + 0.07);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.09, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.16);
}

// The shell cues this pack chooses to voice. Everything absent is silence —
// deliberately: no ui blip, no result stinger, no win fanfare (anti-goals).
const EVENTS: Record<string, () => void> = {
  swipe: stroke,
};

// The haptic grammar (v0): the stroke's tick on commit. The shell's built-in
// vibration moments are silenced — the game's pulse is authored, not
// inherited (I6 adds the god-pulse, the deep-buzz, the crowd-stir).
const HAPTICS: Record<string, number[] | null> = {
  'swipe': [10],
  'result-bad': null,
  'result-incredible': null,
  'set-piece': null,
  'set-piece-blow': [60, 40, 90], // a blow still LANDS (the sea is real)
  'flashpoint': null,
};

export const odysseySoundscape: NonNullable<Presenter['soundscape']> = {
  event(name: string) { EVENTS[name]?.(); },
  // v0: no continuous ambience anywhere — the hearth whisper arrives with
  // the hearth (I5/I6). The deep places are dead silent already.
  ambience() { /* silence, deliberately */ },
  haptic(name: string) { return name in HAPTICS ? HAPTICS[name] : null; },
};
