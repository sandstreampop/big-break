// The Odyssey — the ember (I2; STYLE.md law 6, NORTH-STAR micro-moment 4).
// The soul-cursor: a small pixel flame, the fire of the telling, standing
// under the card between the two doors. It is REACTIVE, never advisory —
// it mirrors the player's own hand (leans with the drag, proportional to
// distance, never toward the "right" answer) and snaps upright on release;
// it dims as Despair rises. Pack-scoped: mounted from the odyssey entry
// after boot, listeners of its own, no shell change at all. The sims never
// import this module (main-odyssey.ts only).
//
// Motion discipline (ADR-0001): the flame's flicker is a 3-frame steps()
// cycle (css/odyssey.css); the lean is QUANTIZED into discrete frames —
// the ember leans the way a vase-painting would, in steps, not a tween.
// Reduced motion (OS pref or in-game toggle): no flicker (frame 0), no
// lean; the dim-with-Despair read stays (information, not motion).

import { run } from '../../ui/context.js';
import { reducedMotion } from '../../ui/dom.js';
import { ember } from './art/figures.js';

const LEAN_STEP_PX = 36;  // one lean frame per this much pull
const LEAN_DEG = 7;       // degrees per lean frame
const MAX_LEAN = 3;       // frames of lean either way

function despairDim(): number {
  const d = (run?.stats?.burnout ?? 0) / 100;
  // Full flame down to a low ebb, never out — the run ending is the only
  // thing that guts the ember (I7's ceremony), not a bad afternoon.
  return 1 - 0.55 * Math.max(0, Math.min(1, d));
}

export function initOdysseyEmber(): void {
  if (typeof document === 'undefined') return;
  let host: HTMLElement | null = null;

  // The ember stands BETWEEN the two doors: mounted into #choice-buttons
  // (absolutely positioned over the gap — css/odyssey.css), re-mounted every
  // deal because renderDealtCard rebuilds that row. Pointer-events: none —
  // it is a witness, never a control.
  const mount = () => {
    const row = document.querySelector('#choice-buttons');
    if (!row || row.querySelector('#ody-ember')) return;
    host = document.createElement('div');
    host.id = 'ody-ember';
    host.setAttribute('aria-hidden', 'true');
    host.innerHTML = ember();
    row.append(host);
    refresh();
  };

  const refresh = () => {
    if (!host) return;
    host.style.opacity = String(despairDim());
    host.classList.toggle('ember-still', reducedMotion());
  };

  // The lean: track a drag on the live card with our own pointer listeners
  // (capture phase — the card stops propagation of nothing, but stay safe).
  let startX: number | null = null;
  document.addEventListener('pointerdown', (e) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest?.('#card-area .card')) startX = e.clientX;
  }, true);
  document.addEventListener('pointermove', (e) => {
    if (startX === null || !host || reducedMotion()) return;
    const dx = e.clientX - startX;
    const step = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, Math.round(dx / LEAN_STEP_PX)));
    host.style.setProperty('--ember-lean', `${step * LEAN_DEG}deg`);
    host.style.setProperty('--ember-stretch', String(1 + Math.abs(step) * 0.08));
    host.classList.toggle('ember-wind', step !== 0);
  }, true);
  const snap = () => {
    startX = null;
    if (!host) return;
    host.style.setProperty('--ember-lean', '0deg');
    host.style.setProperty('--ember-stretch', '1');
    host.classList.remove('ember-wind');
  };
  document.addEventListener('pointerup', snap, true);
  document.addEventListener('pointercancel', snap, true);

  // Re-mount and re-read Despair on every deal — renderDealtCard rebuilds
  // the choice row exactly once per beat, so its childList is the pulse.
  const arm = () => {
    const row = document.querySelector('#choice-buttons');
    if (!row) { setTimeout(arm, 120); return; }
    mount();
    new MutationObserver(() => { mount(); refresh(); snap(); })
      .observe(row, { childList: true });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }
}
