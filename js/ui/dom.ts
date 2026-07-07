// BIG BREAK — UI DOM & animation primitives.
//
// The genre-neutral, flow-neutral bottom layer every screen builds on: the
// element factory, the accessibility helpers, the screen-transition and the
// overlay engine. These are pure mechanism — they know nothing about the run,
// the deck, or which screen comes next — so every screen module can depend on
// them without pulling in the flow. The one game-state touch is reading
// meta.settings for reduced-motion / haptics, which the context exposes.

import { sfx } from '../audio.js';
import { CSS_CONTRACT } from '../version.js';
import { meta } from './context.js';

export const $ = (sel) => document.querySelector(sel);

export const el = (tag, cls?, html?) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Make a click-only div/span keyboard-operable (Epic 7): a real button role,
// focusable, and Enter/Space activates it exactly like a click. Copies the
// risk-dot aria-label pattern. Returns the element. Use in place of a bare
// `node.addEventListener('click', handler)` on non-<button> interactive elements.
export function activatable<T extends HTMLElement>(node: T, handler: (e: Event) => void, label?: string): T {
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  if (label) node.setAttribute('aria-label', label);
  node.addEventListener('click', handler);
  node.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
  });
  return node;
}

// Same keyboard operability for an element whose click handler is ALREADY
// wired (multi-line handlers we don't want to restructure): Enter/Space just
// synthesizes the click. Returns the element.
export function keyable<T extends HTMLElement>(node: T, label?: string): T {
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  if (label) node.setAttribute('aria-label', label);
  node.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); }
  });
  return node;
}

export function btn(label, cls, onTap) {
  const b = el('button', 'btn ' + (cls || ''), label);
  b.addEventListener('click', () => { sfx.ui(); onTap(); });
  return b;
}

export function reducedMotion() {
  if (meta.settings.reducedMotion !== null) return meta.settings.reducedMotion;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function vibrate(pattern) {
  if (meta.settings.haptics === false) return;
  try { navigator.vibrate?.(pattern); } catch (e) {}
}

// ---------- Screen router ----------

// Direction-aware screen transition (Epic 6): forward navigation rises in from
// below, going back drops in from above — a sense of place instead of one flat
// cross-fade. Vertical-only (no horizontal travel) so it can't trip the phone
// no-h-overflow contract; disabled under prefers-reduced-motion via CSS.
export function show(id, dir: 'forward' | 'back' = 'forward') {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active', 'nav-back'));
  const s = $(id);
  if (dir === 'back') s.classList.add('nav-back');
  s.classList.add('active');
}

// ---------- Overlay engine (Epic 4) ----------
// Every simple modal was a verbatim copy of the same five lines: clear the
// shared #overlay, activate it, build content, then — after a short delay so
// the tap that OPENED it doesn't immediately dismiss it — arm a
// tap-anywhere-to-close listener. This centralizes that. `build` receives the
// overlay node and a `close()` it may wire to its own buttons; `onClose` runs
// after close; `armMs` overrides the dismiss-arm delay. It also fixes a latent
// bug the copies shared: opening a new overlay during the arm window used to
// leave the previous overlay's click listener attached to the shared node —
// here a stale listener is torn down on open, and close() is idempotent.
export function openOverlay(
  build: (ov: HTMLElement, close: () => void) => void,
  opts: { armMs?: number; onClose?: () => void; dismissable?: boolean } = {},
) {
  const ov = $('#overlay');
  const stale = (ov as any)._bbClose;
  if (stale) { ov.removeEventListener('click', stale); (ov as any)._bbClose = null; }
  ov.innerHTML = '';
  ov.classList.add('active');
  ov.removeAttribute('data-armed'); // set once the dismiss listener is live (below)
  // Accessibility (Epic 7): the modal announces itself, takes focus, closes on
  // Escape, and restores focus to whatever opened it. Screen-reader + keyboard
  // users got none of this before.
  const prevFocus = document.activeElement as HTMLElement | null;
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('tabindex', '-1');
  let closed = false;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
  const close = () => {
    if (closed) return;
    closed = true;
    ov.classList.remove('active');
    ov.removeEventListener('click', close);
    document.removeEventListener('keydown', onKey);
    ov.removeAttribute('aria-modal');
    ov.removeAttribute('role');
    (ov as any)._bbClose = null;
    prevFocus?.focus?.();
    opts.onClose?.();
  };
  build(ov, close);
  (ov as any)._bbClose = close;
  document.addEventListener('keydown', onKey);
  ov.focus?.();
  // A forced-choice overlay (dismissable:false) never arms backdrop-click
  // dismissal — the player must pick a button (Escape still cancels). Others
  // arm the tap-to-dismiss listener after a short delay so the opening tap
  // can't immediately close it.
  if (opts.dismissable !== false) {
    setTimeout(() => {
      ov.addEventListener('click', close);
      // Real "listener is live" signal so tests can waitForFunction on it
      // instead of racing a fixed sleep against this same arm delay.
      ov.setAttribute('data-armed', '1');
    }, opts.armMs ?? 200);
  }
  return close;
}

// ---------- Portrait lightbox ----------
// Press a face → see it big. A genre-neutral overlay that enlarges a single
// portrait image with an optional caption block (name / sub / note). Pure
// mechanism: the shell knows how to blow up an <img> and label it; the pack
// decides which faces carry a `portraitSrc` worth enlarging. Falls back to
// nothing when there's no real image (an emoji glyph has no "bigger" form),
// so callers can wire it unconditionally and it no-ops on emoji-only faces.
export function openPortrait(
  src?: string,
  cap: { name?: string; sub?: string | null; note?: string | null; mood?: string | null } = {},
): void {
  if (!src) return;
  openOverlay((ov) => {
    const box = el('div', 'portrait-lightbox');
    const frame = el('div', 'portrait-lightbox-frame',
      `<img class="portrait-lightbox-img" src="${src}" alt="${cap.name || ''}" draggable="false">`);
    if (cap.mood) frame.append(el('span', 'portrait-lightbox-mood', cap.mood));
    box.append(frame);
    if (cap.name || cap.sub || cap.note) {
      const capBox = el('div', 'portrait-lightbox-cap');
      if (cap.name) capBox.append(el('div', 'portrait-lightbox-name',
        cap.name + (cap.sub ? `<span class="portrait-lightbox-sub">${cap.sub}</span>` : '')));
      if (cap.note) capBox.append(el('div', 'portrait-lightbox-note', cap.note));
      box.append(capBox);
    }
    box.append(el('div', 'tap-hint', 'tap to close'));
    ov.append(box);
  });
}

export function spawnConfetti(host) {
  if (reducedMotion()) return;
  const box = el('div', 'confetti-box');
  for (let i = 0; i < 26; i++) {
    const p = el('span', 'confetti');
    p.style.left = 50 + (Math.random() * 40 - 20) + '%';
    p.style.background = `hsl(${Math.floor(Math.random() * 360)} 90% 65%)`;
    p.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
    p.style.setProperty('--dy', -(80 + Math.random() * 220) + 'px');
    p.style.setProperty('--rot', Math.floor(Math.random() * 720 - 360) + 'deg');
    p.style.animationDelay = (Math.random() * 0.12) + 's';
    box.append(p);
  }
  host.append(box);
  setTimeout(() => box.remove(), 1600);
}

// Coach marks stay up until the player taps them — reading speed is the
// player's business, not a timer's. A new card clears any stale mark.
export function coachMark(text) {
  if (!$('#screen-game').classList.contains('active')) return;
  const old = document.querySelector('.coach');
  if (old) old.remove();
  const c = el('div', 'coach', text + '<span class="coach-x">tap to dismiss</span>');
  c.addEventListener('click', () => c.remove());
  $('#screen-game').append(c);
}

// ---------- Date / hash helpers ----------

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
export function weekStr() {
  // ISO week label, e.g. 2026-W27
  const d = new Date();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0) + 1;
}

// ---------- Stale-stylesheet self-heal ----------

// The delivery contract, verified at boot: the build stamps the stylesheet's
// content hash into both css/style.css (--bb-css-v) and js/version.js. When
// they disagree, this client is running MIXED deploys — typically fresh JS
// with a stale cached stylesheet (HTTP cache or service worker), which renders
// new markup unstyled and collapses the phone layout (the unstyled-stage /
// buttons-over-the-card bug). Self-heal by re-pulling every stylesheet with a
// cache-busting query; if the network is truly gone the layout stays degraded
// but we've warned, and the next online visit heals.
export function healStaleStylesheets() {
  if (CSS_CONTRACT === 'dev') return; // unstamped source build — nothing to verify
  const readV = () =>
    (getComputedStyle(document.documentElement).getPropertyValue('--bb-css-v') || '').replace(/["'\s]/g, '');
  if (readV() === CSS_CONTRACT) return;
  console.warn(`stylesheet contract mismatch (css "${readV() || 'none'}" ≠ js "${CSS_CONTRACT}") — refetching styles`);
  for (const link of Array.from(document.querySelectorAll('link[rel="stylesheet"]'))) {
    const base = (link.getAttribute('href') || '').split('?')[0];
    if (base) link.setAttribute('href', `${base}?v=${CSS_CONTRACT}&heal=${Date.now()}`);
  }
}
