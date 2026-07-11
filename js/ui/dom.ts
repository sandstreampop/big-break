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
import { meta, PRES } from './context.js';
import type { ImageVariant } from '../types.js';

export const $ = (sel) => document.querySelector(sel);

export const el = (tag, cls?, html?) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Escape a string for safe interpolation into an `el(..., html)` template.
// `el` assigns `innerHTML`, so any FREE-TEXT value (chiefly the player's own
// name, typed at setup) must be escaped before it lands in markup or it becomes
// a DOM-XSS vector. Authored/manifest copy needs no escaping; player input does.
export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));

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

// ---------- Responsive image serving (the SOTA `<picture>` layer) ----------
// The runtime half of the image pipeline; the authoring half that produces the
// files + descriptors is tools/image-core.mjs. A pack registers its variant
// descriptors at boot (registerImageVariants, wired from js/ui.ts exactly like
// registerArt), and every portrait `<img>` the shell renders flows through
// responsivePicture(). The browser then fetches the smallest format it supports
// at the exact rendered size — a 96px AVIF for a face chip, a 768px one for the
// lightbox — instead of one giant master everywhere. Genre-neutral: the shell
// is handed a generic src→variant map and names no game.
const IMG_VARIANTS: Record<string, ImageVariant> = {};

// Merge a pack's variant map into the registry (first registration wins, like
// registerArt). Keyed by the fallback src a face object carries (`portraitSrc`).
export function registerImageVariants(map?: Record<string, ImageVariant>): void {
  for (const [src, v] of Object.entries(map || {})) {
    if (!(src in IMG_VARIANTS)) IMG_VARIANTS[src] = v;
  }
}

export interface PictureOpts {
  className?: string;   // class on the <img> — the styling target (e.g. face-portrait)
  sizes?: string;       // the CSS layout width, e.g. "44px" or "min(78vw, 360px)"
  alt?: string;
  eager?: boolean;      // loading="eager" (default lazy) — for a portrait already in view
  priority?: boolean;   // fetchpriority="high" — for the single most important portrait
}

// Build the markup for one responsive image. When variants are registered for
// `src`, emits a `<picture>` with AVIF→WebP→JPEG `<source>`s (the browser takes
// the first it can decode) plus an `<img>` fallback carrying width/height (the
// box is reserved before load → zero layout shift), a jpeg `srcset`+`sizes` (the
// right rung), and loading/decoding/fetchpriority hints. With NO variants
// registered (music, or art not yet preprocessed) it degrades to a plain `<img>`
// that still gets the loading hints — correct everywhere, fastest where wired.
export function responsivePicture(src: string, opts: PictureOpts = {}): string {
  const { className, sizes, alt = '', eager = false, priority = false } = opts;
  const cls = className ? ` class="${className}"` : '';
  const load = eager ? 'eager' : 'lazy';
  const prio = priority ? ' fetchpriority="high"' : '';
  const sz = sizes ? ` sizes="${sizes}"` : '';
  const v = IMG_VARIANTS[src];
  const img =
    `<img${cls} src="${src}"` +
    (v ? `${v.jpeg ? ` srcset="${v.jpeg}"${sz}` : ''} width="${v.w}" height="${v.h}"` : '') +
    ` alt="${alt}" loading="${load}" decoding="async"${prio} draggable="false">`;
  if (!v || (!v.avif && !v.webp)) return img;
  const source = (type: string, srcset?: string) =>
    srcset ? `<source type="${type}" srcset="${srcset}"${sz}>` : '';
  // `.rp { display: contents }` keeps the <img> sizing against the real circular
  // parent (.cast-face etc.), not the inline <picture> box it lives in.
  return `<picture class="rp">${source('image/avif', v.avif)}${source('image/webp', v.webp)}${img}</picture>`;
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

// A NAMED vibration moment (the haptic grammar seam): a pack soundscape may
// re-voice the shell's built-in haptics by name — a pattern replaces the
// default, null silences it, undefined (or no soundscape) keeps the shell's.
// The settings gate stays in vibrate().
export function vibrateNamed(name: string, fallback: number | number[]) {
  const custom = PRES?.soundscape?.haptic?.(name);
  if (custom === null) return;
  const pattern = custom !== undefined ? custom : fallback;
  // An empty pattern means "this moment has no default voice" — a no-op,
  // NOT navigator.vibrate([]) (which cancels an in-flight vibration).
  if (Array.isArray(pattern) && !pattern.length) return;
  vibrate(pattern);
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
// The overlay layers, back to front. #overlay is the single shared modal
// surface every screen's sheets/results render into; #overlay-top is a
// dedicated layer ABOVE it for a modal opened FROM WITHIN another modal (the
// portrait lightbox opened off a result/inspector face). They are SEPARATE
// nodes on purpose: openOverlay is a strict singleton per node (it wipes its
// host and tears down the host's listeners on open), so a lightbox that reused
// #overlay would destroy the result overlay underneath it WITHOUT running that
// overlay's onClose — the run's `advance()` — and closing the lightbox would
// leave the game soft-locked. A second node keeps the underlying overlay (and
// its pending onClose) fully intact.
const OVERLAY_LAYERS = ['#overlay-top', '#overlay'];
// The active overlay closest to the user — the one Escape/Back should act on,
// so a keypress dismisses only the top layer, never the one beneath it.
export function topOverlay(): HTMLElement | null {
  for (const sel of OVERLAY_LAYERS) {
    const n = $(sel);
    if (n && n.classList.contains('active')) return n as HTMLElement;
  }
  return null;
}
// True while ANY overlay layer is up — used to suppress screen-level input
// (arrow-key swipes) behind a modal, whichever layer it's on.
export function anyOverlayActive(): boolean {
  return OVERLAY_LAYERS.some((sel) => $(sel)?.classList.contains('active'));
}

export function openOverlay(
  build: (ov: HTMLElement, close: () => void) => void,
  opts: { armMs?: number; onClose?: () => void; dismissable?: boolean; host?: string } = {},
) {
  const ov = $(opts.host || '#overlay');
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
  // Escape closes only the TOPMOST layer, so a lightbox stacked over a result
  // dismisses the lightbox first (and leaves the result — and its pending
  // advance — untouched). Both layers listen on document; the guard makes the
  // non-topmost listener a no-op for this keypress.
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && topOverlay() === ov) close(); };
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
  // Render on the dedicated TOP layer (#overlay-top), never the shared
  // #overlay — a portrait is almost always opened from WITHIN another overlay
  // (a result beat, an inspect sheet), and reusing #overlay would tear that
  // overlay down (see OVERLAY_LAYERS) and soft-lock the run.
  openOverlay((ov) => {
    const box = el('div', 'portrait-lightbox');
    // The lightbox is the largest a portrait renders (≤360px CSS → up to the
    // 768 rung on a 2×/3× phone). It opens on demand and is the focus of the
    // screen, so load it eagerly at high priority.
    const frame = el('div', 'portrait-lightbox-frame',
      responsivePicture(src, {
        className: 'portrait-lightbox-img', sizes: 'min(78vw, 360px)',
        alt: cap.name || '', eager: true, priority: true,
      }));
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
  }, { host: '#overlay-top' });
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
  const readVar = (name: string) =>
    (getComputedStyle(document.documentElement).getPropertyValue(name) || '').replace(/["'\s]/g, '');
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  // Verify every loaded sheet by ITS OWN stamp (--bb-css-v-<name>), not just
  // style.css's legacy --bb-css-v: each file caches and evicts independently,
  // and a stale PACK sheet next to an agreeing style.css is exactly the skew
  // that blanked the odyssey fires (INCIDENTS.md 2026-07).
  const staleLink = links.some((link) => {
    const base = (link.getAttribute('href') || '').split('?')[0];
    if (!base.endsWith('.css')) return false;
    const key = (base.split('/').pop() || '').replace(/\.css$/, '').replace(/[^a-z0-9-]/gi, '');
    return readVar(`--bb-css-v-${key}`) !== CSS_CONTRACT;
  });
  if (readVar('--bb-css-v') === CSS_CONTRACT && !staleLink) return;
  console.warn(`stylesheet contract mismatch (css "${readVar('--bb-css-v') || 'none'}"${staleLink ? ' + per-sheet stamp' : ''} ≠ js "${CSS_CONTRACT}") — refetching styles`);
  for (const link of links) {
    const base = (link.getAttribute('href') || '').split('?')[0];
    if (base) link.setAttribute('href', `${base}?v=${CSS_CONTRACT}&heal=${Date.now()}`);
  }
}
