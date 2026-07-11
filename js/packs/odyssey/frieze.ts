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
import { odysseyManifest } from './manifest.js';
import {
  ship, seaStrip, sternFigures, owl, SHIP_MAX_ROWERS, type SeaState,
} from './art/figures.js';

export function seaStateOf(poseidon: number): SeaState {
  return poseidon >= 8 ? 'wrath' : poseidon >= 4 ? 'mid' : 'calm';
}

// The stroke count: completed segments plus this act's cards. Act twists can
// stretch or shave an act by a card or two — the notch is the voyage's felt
// position, and the inspect panel carries the exact count beside it.
export function notchOf(s: RunState): { played: number; total: number } {
  const segs = odysseyManifest.segments;
  let played = 0;
  for (let a = 1; a < (s.act || 1); a++) played += segs[a - 1]?.length || 0;
  played += s.cardsPlayedInAct || 0;
  const total = segs.reduce((n, seg) => n + seg.length, 0);
  return { played: Math.min(total, played), total };
}

const ACT_NAMES = ['', 'The Sack and the Sea', 'Witches and the Dead', 'The Narrow Way'];

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

  const html =
    `<div class="frieze" data-rowers="${rowers}" data-sea="${sea}" data-owl="${hasOwl ? 1 : 0}"` +
    ` data-deeds="${deeds}" data-notch="${played}">` +
    `<div class="frieze-sea frieze-sea-${sea}">${seaStrip(sea, 128, { stretch: true })}</div>` +
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
      lines: ['The sea is his mood: calm, then rough, then wine-dark. At ten it takes its answer.'],
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
