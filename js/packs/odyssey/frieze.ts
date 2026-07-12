// The Odyssey — the living frieze (I3; NORTH-STAR "The living frieze" +
// "The world is the HUD"). The vase-band across the top of the play screen
// is a READOUT OF STATE, never decoration:
//   · the Expedition are the rowers — lose crew, a bench empties;
//   · Poseidon's wrath is the sea — meander-calm, chop, oxblood rollers;
//   · Athena is the owl — on the mast when she is with you, absent when not;
//   · Renown trails the ship — deeds as small figures walking the wake;
//   · the ship advances one notch per stroke — ~28 strokes Troy → Ithaca.
// Numeric truth lives one tap away: the inspect panel states every number
// plainly, at a size where the pixel face is legible (this demotes digits to
// inspection size — the digit-legibility wart's mitigation).
//
// PURE read of state (deals re-render on resume; the sims never render).
// The mapping truths (data-* attributes ↔ RunState) are pinned by the
// frieze-never-lies smoke assertion; the sprite truths (ship(n) really draws
// n rowers) by test/odyssey-frieze.test.mjs.

import type { Presenter, RunState } from '../../types.js';
import { actLength } from '../../engine.js';
import { odysseyManifest } from './manifest.js';
import { BEATS } from './itinerary.js';
import {
  ship, seaStrip, sternFigures, owl, gulls, cyclopsIsland, ashBand,
  SHIP_MAX_ROWERS, type SeaState,
} from './art/figures.js';

export function seaStateOf(poseidon: number): SeaState {
  return poseidon >= 8 ? 'wrath' : poseidon >= 4 ? 'mid' : 'calm';
}

// The stroke count: completed segments plus this act's cards — through
// engine.actLength, which folds the run's act twist, so a shaved or
// stretched act never desynchronizes the ship from the water it actually
// crossed. (The itinerary plugin resolves its 'end' slots the same way;
// INCIDENTS #3's class — two readers of one schedule disagreeing — is
// exactly what raw segment lengths here would reintroduce.)
export function notchOf(s: RunState): { played: number; total: number } {
  const acts = odysseyManifest.segments.length;
  let played = 0;
  let total = 0;
  for (let a = 1; a <= acts; a++) {
    const len = actLength(s, a);
    total += len;
    if (a < (s.act || 1)) played += len;
  }
  played += s.cardsPlayedInAct || 0;
  return { played: Math.min(total, played), total };
}

const ACT_NAMES = ['', 'The Sack and the Sea', 'Witches and the Dead', 'The Narrow Way'];

// ── The horizon (I4): geography looms, divinity strikes. Everything
// ceremonial is visible before it arrives — the Cyclops's island grows on
// the band's right edge two-three cards out, the band drains toward ash as
// the Underworld nears, gulls appear near Ithaca. The distances are knowable
// because THE ITINERARY IS FIXED (itinerary.ts BEATS: cyclops closes act 1,
// the Underworld closes act 2, Ithaca closes the telling). The gods get no
// forecast, deliberately. `near` counts down: 2 → far, 1 → close, 0 → upon
// you (the set-piece then takes the whole screen).
export type Horizon = { kind: 'cave' | 'ash' | 'gulls'; near: 0 | 1 | 2 } | null;
const LOOM = 2; // cards of forewarning

const beatActOf = (key: string) => BEATS.find((b) => b.key === key)?.act ?? 99;

export function horizonOf(s: RunState): Horizon {
  const flags = s.flags || [];
  const act = s.act || 1;
  const played = s.cardsPlayedInAct || 0;
  // The REAL act length (twist folded) — the landmark's 'end' window is the
  // act's actual last slot, and the forecast must loom against that.
  const endSlot = (a: number) => actLength(s, a) - 1;
  const looming = (beatAct: number): 0 | 1 | 2 | null => {
    if (act > beatAct) return 0; // rolled forward — due immediately
    if (act < beatAct) return null;
    const d = endSlot(beatAct) - played;
    return d <= LOOM ? (Math.max(0, d) as 0 | 1 | 2) : null;
  };
  if (!flags.includes('ody_done_cyclops')) {
    const n = looming(beatActOf('cyclops'));
    return n === null ? null : { kind: 'cave', near: n };
  }
  if (!flags.includes('ody_done_underworld')) {
    const n = looming(beatActOf('underworld'));
    return n === null ? null : { kind: 'ash', near: n };
  }
  if (act === 3) {
    const d = endSlot(3) - played;
    if (d <= LOOM) return { kind: 'gulls', near: Math.max(0, d) as 0 | 1 | 2 };
  }
  return null;
}

export const friezeTableau: NonNullable<Presenter['tableau']> = (s) => {
  const rowers = Math.max(0, Math.min(SHIP_MAX_ROWERS, Math.round(s.expedition ?? 0)));
  const wrath = Math.max(0, Math.round(s.poseidon ?? 0));
  const sea = seaStateOf(wrath);
  const athena = Math.max(0, Math.round(s.athena ?? 0));
  const hasOwl = athena >= 3;
  const renown = Math.max(0, Math.round(s.renown ?? 0));
  const deeds = Math.min(6, Math.ceil(renown / 2));
  const despair = Math.round(s.stats?.burnout ?? 0);
  const { played, total } = notchOf(s);
  // Troy sits at the band's left edge, Ithaca off its right; the hull is
  // wide, so the travel stops short of the rim.
  const x = 2 + (played / Math.max(1, total)) * 58;

  const hor = horizonOf(s);
  const horAttr = hor ? `${hor.kind}:${hor.near}` : '';
  let horHtml = '';
  if (hor?.kind === 'cave') {
    horHtml = `<span class="frieze-horizon frieze-cave near-${hor.near}">${cyclopsIsland()}</span>`;
  } else if (hor?.kind === 'gulls') {
    horHtml = `<span class="frieze-horizon frieze-gulls near-${hor.near}">${gulls()}</span>`;
  } else if (hor?.kind === 'ash') {
    // The deep doesn't rise on the horizon — the WORLD drains toward it:
    // an ash veil over the whole band, thickening as the Underworld nears.
    horHtml = `<span class="frieze-ashveil near-${hor.near}">${ashBand(128, { stretch: true })}</span>`;
  }

  const html =
    `<div class="frieze${hor?.kind === 'ash' ? ` frieze-drain near-${hor.near}` : ''}"` +
    ` data-rowers="${rowers}" data-sea="${sea}" data-owl="${hasOwl ? 1 : 0}"` +
    ` data-deeds="${deeds}" data-notch="${played}" data-horizon="${horAttr}">` +
    `<div class="frieze-sea frieze-sea-${sea}">${seaStrip(sea, 128, { stretch: true })}</div>` +
    horHtml +
    `<div class="frieze-ship" style="left:${x.toFixed(1)}%">` +
    (hasOwl ? `<span class="frieze-owl">${owl()}</span>` : '') +
    (deeds ? `<span class="frieze-deeds">${sternFigures(deeds)}</span>` : '') +
    `<span class="frieze-hull">${ship(rowers)}</span>` +
    `</div>` +
    `</div>`;

  const expTrue = Math.round(s.expedition ?? 0);
  const inspect = [
    {
      title: `⛵ The Expedition — ${expTrue}${expTrue > SHIP_MAX_ROWERS ? ` (the band seats ${SHIP_MAX_ROWERS})` : ' of 12'}`,
      lines: ['Men and timber as one dwindling thing. The bench does not refill.'],
    },
    {
      title: `🔱 Poseidon — ${wrath} of 10`,
      lines: ['The sea is his mood: meander-calm, then chop, then oxblood. At ten it takes its answer.'],
    },
    {
      title: `🦉 Athena — ${athena}`,
      lines: ['When she is with you, the owl sits the mast.'],
    },
    {
      title: `🌟 Renown — ${renown}`,
      lines: ['Deeds of legend, tallied as performed. They walk behind the ship.'],
    },
    {
      title: `🌫️ Despair — ${despair} of 100`,
      lines: ['When it fills, the telling ends on a beach, quietly. The ember dims with it.'],
    },
    {
      title: `The telling — stroke ${played} of ${total}`,
      lines: [`Act ${s.act || 1} · ${ACT_NAMES[s.act || 1] || ''}`],
    },
  ];

  return { html, cls: 'ody-frieze', inspect };
};
