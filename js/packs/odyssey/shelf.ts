// The Odyssey — the fragment/amphora shelf (Replay-legibility slice 2 + 3):
// the ONE shared component that renders the prophecy ladder as a distinct,
// non-prose, Odyssey-native beat (ADR-0002). Slice 2 fires it on the
// mid-run result overlay when a turning lands; slice 3 reuses it whole for
// the run-end ledger — so every helper here takes plain data in and returns
// an HTML string out, nothing screen-specific baked in.
//
// Pure and DOM-free at import time (Node-safe: no `document`, no vibrate, no
// reducedMotion — those live in presenter.ts/alive.ts, which call in from
// the browser side). The only import is the pixel-figure vocabulary
// (art/px.ts's sprite()), itself pure string-building.

import { sprite } from './art/px.js';

export type Turning = 'sea' | 'bow' | 'oar';

// The turning names, in shelf order — exported so slice 3's ledger copy
// ("you carried home the sea turning") reads off the same table, never a
// second hand-typed copy of the words.
export const TURNING_NAMES: Record<Turning, string> = {
  sea: 'the sea turning',
  bow: 'the bow turning',
  oar: 'the oar road',
};

const TURNING_ORDER: Turning[] = ['sea', 'bow', 'oar'];

export interface HeldTurnings {
  sea: boolean;
  bow: boolean;
  oar: boolean;
  count: number;
}

// What the bard currently carries — cross-run knowledge (ody_frag_*, stamped
// at setup from the meta save) UNIONED with what THIS telling itself just
// heard (ody_fore_*/ody_oar_road, the chain-only landmark's own flags) so a
// turning heard for the first time tonight shows filled immediately, not
// only after the next telling's setup stamp.
export function heldTurnings(flags: string[]): HeldTurnings {
  const sea = flags.includes('ody_frag_sea') || flags.includes('ody_fore_sea');
  const bow = flags.includes('ody_frag_bow') || flags.includes('ody_fore_bow');
  const oar = flags.includes('ody_frag_oar') || flags.includes('ody_oar_road');
  return { sea, bow, oar, count: [sea, bow, oar].filter(Boolean).length };
}

// Which turning, if any, the bard heard THIS telling — present only as the
// fresh fore_*/oar_road flag (never the cross-run frag_* stamp, which is
// old knowledge, not tonight's landing). Oar Road implies the whole
// prophecy was walked, so it outranks a same-telling bow/sea flag.
export function justLanded(flags: string[]): Turning | null {
  if (flags.includes('ody_oar_road')) return 'oar';
  if (flags.includes('ody_fore_bow')) return 'bow';
  if (flags.includes('ody_fore_sea')) return 'sea';
  return null;
}

// A small fired-clay amphora — the filled slot's mark. Two-tone: a gold
// neck (the gods' one light, STYLE.md's palette) over a terracotta-deep
// body. One frame (the container's own class drives the fill motion; the
// glyph itself never animates on its own — Motion Law clause 1, chrome-free
// figure, not chrome).
const AMPHORA = [
  '....g....',
  '...ggg...',
  '....g....',
  '...TTT...',
  '..TTTTT..',
  '.TTTTTTT.',
  '.TTTTTTT.',
  '.TTTTTTT.',
  '..TTTTT..',
  '...TTT...',
  '....T....',
];
function amphoraGlyph(): string {
  return sprite([AMPHORA], { cls: 'ody-amphora' });
}

// An empty niche — the honest un-filled slot (Q5a's honest floor starts
// here in slice 2's own idiom; slice 3's ledger renders the same mark).
const NICHE = [
  '.........',
  '.........',
  '.........',
  '.#######.',
  '#.......#',
  '#.......#',
  '#.......#',
  '#########',
];
function nicheGlyph(): string {
  return sprite([NICHE], { cls: 'ody-niche' });
}

export interface FragmentShelfOpts {
  held: HeldTurnings;
  justFilled?: Turning | null;
  animate?: boolean;
}

// The shelf itself: three slots, sea/bow/oar, in fixed order (the same
// order the prophecy is always spoken in this pack). A filled slot carries
// the amphora mark; an empty one the niche. The just-landed slot (if any,
// and only when motion is on) gets `.ody-slot-new` — the FILL animation's
// hook; reduced motion simply never adds the class, so the slot lands
// already filled and legible with nothing left to animate.
export function fragmentShelf(opts: FragmentShelfOpts): string {
  const { held, justFilled = null, animate = true } = opts;
  const slots = TURNING_ORDER.map((k) => {
    const filled = held[k];
    const isNew = animate !== false && justFilled === k;
    const cls = ['ody-slot', filled ? 'ody-slot-filled' : 'ody-slot-empty', isNew ? 'ody-slot-new' : '']
      .filter(Boolean).join(' ');
    const mark = filled ? amphoraGlyph() : nicheGlyph();
    return `<div class="${cls}"><div class="ody-slot-mark">${mark}</div><div class="ody-slot-label">${TURNING_NAMES[k]}</div></div>`;
  });
  return `<div class="ody-shelf">${slots.join('')}</div>`;
}
