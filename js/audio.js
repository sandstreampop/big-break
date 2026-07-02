// WebAudio: short synthesized cues + a generative lo-fi soundtrack.
// Everything is synthesized — no assets, works offline. iOS requires a
// user gesture before audio starts; init() is called on first pointerdown.

let ctx = null;
let enabled = true;
let musicEnabled = true;

export function setSoundEnabled(v) { enabled = v; }
export function setMusicEnabled(v) {
  musicEnabled = v;
  if (!v) music.stop();
  else music.start(music.mood || 'title');
}

export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) { ctx = null; }
  if (ctx && musicEnabled) music.start(music.mood || 'title');
}

// The composer (audible songs) shares this context and honors the toggles
export function audioCtx() {
  initAudio();
  return ctx;
}
export function audioState() {
  return { sound: enabled, music: musicEnabled };
}

function blip(freq, dur, type = 'triangle', gainPeak = 0.08, when = 0) {
  if (!ctx || !enabled) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(gainPeak, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// ---------- Generative lo-fi soundtrack ----------
// A chord-pad progression with optional bass/hats, scheduled ahead of time.
// Moods: title (slow, warm), act1 (garage haze), act2 (busier, hats),
// act3 (tense, deep bass), ending (spacious).

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
// chords as midi note arrays (voiced low-mid, lo-fi friendly)
const CH = {
  Am7: [57, 60, 64, 67], Fmaj7: [53, 57, 60, 64], Cmaj7: [48, 52, 55, 59],
  G7: [55, 59, 62, 65], Dm7: [50, 53, 57, 60], Em7: [52, 55, 59, 62],
  Bbmaj7: [58, 62, 65, 69], E7: [52, 56, 59, 62],
};
const MOODS = {
  title:  { bpm: 72,  barsPerChord: 2, prog: [CH.Am7, CH.Fmaj7, CH.Cmaj7, CH.G7], hats: false, bass: false, cutoff: 640 },
  act1:   { bpm: 82,  barsPerChord: 2, prog: [CH.Cmaj7, CH.Am7, CH.Fmaj7, CH.G7], hats: false, bass: true,  cutoff: 720 },
  act2:   { bpm: 96,  barsPerChord: 1, prog: [CH.Dm7, CH.G7, CH.Cmaj7, CH.Am7],  hats: true,  bass: true,  cutoff: 900 },
  act3:   { bpm: 90,  barsPerChord: 1, prog: [CH.Am7, CH.Bbmaj7, CH.Am7, CH.E7], hats: true,  bass: true,  cutoff: 820 },
  ending: { bpm: 66,  barsPerChord: 2, prog: [CH.Fmaj7, CH.Cmaj7, CH.Am7, CH.G7], hats: false, bass: false, cutoff: 600 },
  // Path identities (Pass 52): the score follows who you're becoming
  act2_megastar:   { bpm: 104, barsPerChord: 1, prog: [CH.Cmaj7, CH.G7, CH.Am7, CH.Fmaj7], hats: true,  bass: true, cutoff: 1050 },
  act3_megastar:   { bpm: 100, barsPerChord: 1, prog: [CH.Fmaj7, CH.G7, CH.Am7, CH.Cmaj7], hats: true,  bass: true, cutoff: 980 },
  act2_studio:     { bpm: 86,  barsPerChord: 1, prog: [CH.Dm7, CH.G7, CH.Cmaj7, CH.Em7],   hats: false, bass: true, cutoff: 760 },
  act3_studio:     { bpm: 82,  barsPerChord: 1, prog: [CH.Bbmaj7, CH.Em7, CH.Dm7, CH.G7],  hats: false, bass: true, cutoff: 700 },
  act2_hitfactory: { bpm: 100, barsPerChord: 1, prog: [CH.Am7, CH.Fmaj7, CH.Cmaj7, CH.G7], hats: true,  bass: true, cutoff: 940 },
  act3_hitfactory: { bpm: 96,  barsPerChord: 1, prog: [CH.Am7, CH.Em7, CH.Fmaj7, CH.E7],   hats: true,  bass: true, cutoff: 880 },
};

function padChord(notes, t, dur, cutoff, dest) {
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, t);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.038, t + dur * 0.3);
  g.gain.setValueAtTime(0.038, t + dur * 0.7);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
  filter.connect(g).connect(dest);
  for (const n of notes) {
    for (const det of [-4, 4]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(midi(n), t);
      o.detune.setValueAtTime(det, t);
      o.connect(filter);
      o.start(t);
      o.stop(t + dur + 0.6);
    }
  }
}

function bassNote(note, t, dur, dest) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(midi(note - 24), t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.055, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.1);
}

let noiseBuf = null;
function ensureNoise() {
  if (noiseBuf || !ctx) return;
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function hat(t, dest, open = false) {
  ensureNoise();
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(open ? 0.02 : 0.014, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (open ? 0.12 : 0.04));
  src.connect(hp).connect(g).connect(dest);
  src.start(t);
}

export const music = {
  mood: null,
  stress: 0, // 0..1 (burnout): darkens the filter, drags the tempo
  _timer: null,
  _nextTime: 0,
  _step: 0,
  _gain: null,
  _suppressed: false, // a real song from the catalog has the room

  setStress(v) { this.stress = Math.max(0, Math.min(1, v)); },

  // While one of the player's own songs plays, the lo-fi score yields the
  // stage and refuses to restart until the song is done (composer.js).
  suppress(v) {
    this._suppressed = !!v;
    if (v) this.stop();
    else if (ctx && musicEnabled) this.start(this.mood || 'title');
  },

  start(mood) {
    this.mood = mood;
    if (!ctx || !musicEnabled || this._suppressed) return;
    if (!this._gain) {
      this._gain = ctx.createGain();
      this._gain.gain.value = 1;
      this._gain.connect(ctx.destination);
    }
    if (this._timer) return; // scheduler already running; mood picks up next chord
    this._nextTime = ctx.currentTime + 0.1;
    this._step = 0;
    this._timer = setInterval(() => this._schedule(), 180);
  },

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  },

  setMood(mood) {
    if (this.mood === mood) return;
    this.mood = mood;
    if (ctx && musicEnabled && !this._timer) this.start(mood);
  },

  _schedule() {
    if (!ctx || !musicEnabled) return;
    if (ctx.state === 'suspended') { ctx.resume(); return; }
    const m = MOODS[this.mood] || MOODS.title;
    // stress (burnout) drags the tempo and closes the filter
    const beat = 60 / (m.bpm * (1 - 0.12 * this.stress));
    const cutoff = m.cutoff * (1 - 0.45 * this.stress);
    const chordDur = beat * 4 * m.barsPerChord;
    // schedule chord-by-chord, 0.4s lookahead
    while (this._nextTime < ctx.currentTime + 0.4) {
      const t = this._nextTime;
      const chord = m.prog[this._step % m.prog.length];
      padChord(chord, t, chordDur, cutoff, this._gain);
      if (m.bass) {
        bassNote(chord[0], t, beat * 1.6, this._gain);
        bassNote(chord[0], t + beat * 2, beat * 1.2, this._gain);
        if (m.barsPerChord === 2) {
          bassNote(chord[0], t + beat * 4, beat * 1.6, this._gain);
          bassNote(chord[0] + (this._step % 2 ? -2 : 3), t + beat * 6, beat * 1.2, this._gain);
        }
      }
      if (m.hats) {
        const bars = m.barsPerChord;
        for (let b = 0; b < bars * 4; b++) {
          hat(t + b * beat + beat * 0.5, this._gain, b % 4 === 3);
        }
      }
      this._nextTime += chordDur;
      this._step += 1;
    }
  },
};

// Scene ambiences: one subtle synthesized texture as a card deals
export function ambient(scene) {
  if (!ctx || !enabled) return;
  const t = ctx.currentTime + 0.05;
  const g = ctx.createGain();
  g.connect(ctx.destination);
  switch (scene) {
    case 'stage': case 'arena': case 'festival': { // crowd murmur swell
      ensureNoise();
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.4);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.4);
      src.connect(lp).connect(g);
      src.start(t); src.stop(t + 1.5);
      break;
    }
    case 'phone': blip(1245, 0.09, 'sine', 0.035); blip(1661, 0.12, 'sine', 0.03, 0.09); break;
    case 'studio': blip(98, 0.25, 'sine', 0.045); blip(65, 0.3, 'sine', 0.04, 0.1); break; // tape thunk
    case 'office': blip(2200, 0.03, 'square', 0.018); blip(1800, 0.03, 'square', 0.015, 0.13); break; // pen ticks
    case 'shop': blip(880, 0.06, 'triangle', 0.03); blip(1319, 0.08, 'triangle', 0.03, 0.06); break; // door chime
    case 'crisis': blip(415, 0.3, 'sawtooth', 0.025); break;
    default: break;
  }
}

export const sfx = {
  swipe() { blip(320, 0.08, 'sine', 0.05); },
  commit() { blip(440, 0.1, 'triangle', 0.06); blip(660, 0.12, 'triangle', 0.05, 0.06); },
  bad() { blip(220, 0.18, 'sawtooth', 0.05); blip(165, 0.25, 'sawtooth', 0.05, 0.12); },
  good() { blip(523, 0.12, 'triangle', 0.06); blip(659, 0.15, 'triangle', 0.06, 0.08); },
  incredible() {
    [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.16, 'triangle', 0.07, i * 0.07));
  },
  gameover() { [330, 277, 233, 196].forEach((f, i) => blip(f, 0.3, 'sawtooth', 0.045, i * 0.16)); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => blip(f, 0.22, 'triangle', 0.07, i * 0.09)); },
  winPath(path) {
    if (path === 'megastar') { // stadium: big major climb, doubled octaves
      [523, 659, 784, 1047].forEach((f, i) => { blip(f, 0.25, 'triangle', 0.07, i * 0.09); blip(f * 2, 0.2, 'triangle', 0.04, i * 0.09); });
      blip(1568, 0.5, 'triangle', 0.08, 0.4);
    } else if (path === 'studio') { // warm jazz resolve: ii-V-I shimmer
      [587, 698, 880].forEach((f, i) => blip(f, 0.3, 'sine', 0.06, i * 0.12));
      [523, 659, 784, 988].forEach((f) => blip(f, 0.8, 'sine', 0.035, 0.42));
    } else if (path === 'hitfactory') { // synth stack pulse
      [440, 440, 554, 659].forEach((f, i) => blip(f, 0.14, 'square', 0.05, i * 0.11));
      [880, 1109, 1319].forEach((f, i) => blip(f, 0.4, 'sawtooth', 0.03, 0.5 + i * 0.05));
    } else this.win();
  },
  ui() { blip(880, 0.05, 'sine', 0.03); },
  // U2: the flashpoint sting — a rising shimmer that says THIS ONE COUNTS
  flashpoint() {
    [392, 523, 659, 784, 1047].forEach((f, i) => blip(f, 0.12, 'sawtooth', 0.035, i * 0.05));
    blip(1568, 0.6, 'triangle', 0.06, 0.28);
    blip(1976, 0.5, 'triangle', 0.04, 0.34);
  },
  // minigame feedback: light, fast, distinct from result stingers
  mgHit() { blip(1175, 0.06, 'triangle', 0.05); },
  mgMiss() { blip(196, 0.1, 'sawtooth', 0.04); },
  mgGolden() { [784, 988, 1175, 1568].forEach((f, i) => blip(f, 0.14, 'triangle', 0.06, i * 0.06)); },
  mgBotched() { blip(147, 0.3, 'sawtooth', 0.05); blip(139, 0.35, 'sawtooth', 0.04, 0.1); },
  cash() { blip(988, 0.07, 'square', 0.03); blip(1319, 0.09, 'square', 0.03, 0.05); },
};
