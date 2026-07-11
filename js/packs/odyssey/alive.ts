// The Odyssey — the hearth's whisper and the haptic grammar's ambient half
// (I6). DOM-side, pack-scoped, mounted from the odyssey entry beside the
// ember: it OBSERVES the shell's surfaces and never routes anything.
//
// The Sound Law: the fire alone may whisper — one continuous ambience in
// the whole game, a barely-audible hearth crackle, and only where a hearth
// is actually on screen (the kindled threshold, a bard beat, an act intro's
// fireside). The tale is silent; the deep places are dead silent.
//
// The haptic grammar (felt, not heard): a long low buzz as the deep
// approaches (the frieze drains toward the Underworld — once per step
// nearer), and the crowd's stir at a cliffhanger (a landmark set-piece
// beat opens). The god-pulse rides the presenter's result hook. All of it
// behind the shell's haptics toggle (dom.vibrate).

import { getCtx } from '../../audio.js';
import { vibrate } from '../../ui/dom.js';
import { meta } from '../../ui/context.js';

// ── The whisper: sparse, tiny, filtered crackle pops while a hearth shows.
let whisperTimer: ReturnType<typeof setTimeout> | null = null;

function crackleOnce(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  const dur = 0.02 + Math.random() * 0.05;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2400 + Math.random() * 2600;
  const g = ctx.createGain();
  g.gain.value = 0.012 + Math.random() * 0.012; // barely audible, by law
  src.connect(bp).connect(g).connect(ctx.destination);
  src.start(t);
}

function whisperOn(): void {
  if (whisperTimer) return;
  const pop = () => {
    // Honor the toggles live: sound + music both gate the ambience.
    if (meta?.settings?.sound !== false && meta?.settings?.music !== false) crackleOnce();
    whisperTimer = setTimeout(pop, 90 + Math.random() * 420);
  };
  whisperTimer = setTimeout(pop, 60);
}

function whisperOff(): void {
  if (whisperTimer) { clearTimeout(whisperTimer); whisperTimer = null; }
}

// A hearth is on screen when: the kindled threshold is the active screen, a
// bard beat is up, or an act intro's fireside scene is up.
function hearthShowing(): boolean {
  if (document.querySelector('#screen-title.active .threshold.kindle-lit')) return true;
  if (document.querySelector('#overlay.active .bard-beat')) return true;
  if (document.querySelector('#overlay.active .act-card .beat-scene')) return true;
  return false;
}

// ── The deep-buzz: one long low pulse per step nearer the Underworld.
let lastDrainNear: string | null = null;
function checkDrain(): void {
  const drain = document.querySelector('#tableau .frieze-drain');
  const near = drain ? (drain.className.match(/near-(\d)/)?.[1] ?? null) : null;
  if (near !== null && near !== lastDrainNear) vibrate([180]);
  lastDrainNear = near;
}

// ── The crowd's stir: the room moves at once when a landmark beat opens.
let stirredFor: Element | null = null;
function checkStir(): void {
  const beat = document.querySelector('#overlay.active .sp-beat.sp-ody');
  if (beat && beat !== stirredFor) vibrate([15, 60, 15, 60, 15]);
  stirredFor = beat;
}

export function initOdysseyAlive(): void {
  if (typeof document === 'undefined') return;
  const sync = () => {
    if (hearthShowing()) whisperOn();
    else whisperOff();
    checkDrain();
    checkStir();
  };
  const arm = () => {
    const app = document.querySelector('#app') || document.body;
    new MutationObserver(sync).observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    sync();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }
  // No whisper in a hidden tab (and the frame engine pauses there too).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') whisperOff();
    else if (hearthShowing()) whisperOn();
  });
}
