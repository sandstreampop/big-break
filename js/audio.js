// Tiny WebAudio feedback synth. No assets, no loops — just short cues.
// iOS requires a user gesture before audio starts; init() is called on
// the first pointerdown anywhere.

let ctx = null;
let enabled = true;

export function setSoundEnabled(v) { enabled = v; }

export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) { ctx = null; }
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
  ui() { blip(880, 0.05, 'sine', 0.03); },
  cash() { blip(988, 0.07, 'square', 0.03); blip(1319, 0.09, 'square', 0.03, 0.05); },
};
