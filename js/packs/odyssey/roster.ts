// The Odyssey — The Benches (pass 12 of the player-experience series): the
// pack's cast gallery, on the shell's generic roster seam. Three circles the
// player already lives with but has never been able to LOOK at: the crew the
// bard names when the sand takes them (crew.ts — the same men, in the same
// words), the fire's canon ensemble (the hecklers who interrupt every
// telling), and the two powers whose ledger the whole voyage is.
//
// Faces are the pack's own black-figure sprites (art/figures.ts) — the
// roster-face slot renders html, so the gallery wears the game's idiom, not
// emoji. Pure read of meta (one line reacts to the telling-ledger); the
// reduced-motion stamp mirrors the endingExtras precedent.

import type { Presenter } from '../../types.js';
import { CREW } from './crew.js';
import { ship, fire, crowdWoman, crowdBoy, crowdHorseMan, emptyPlace, owl, trident, oar, cup } from './art/figures.js';
import { reducedMotion } from '../../ui/dom.js';

const still = () => (typeof window !== 'undefined' && reducedMotion() ? ' px-still' : '');
const fig = (svg: string, cls = '') => `<span class="fig roster-fig ${cls}${still()}">${svg}</span>`;

export const odysseyRoster: NonNullable<Presenter['roster']> = (meta: any) => {
  const t = meta?.odyssey?.tellings;
  const nights = t?.count || 0;
  const lost = t?.crewLostTotal || 0;
  return {
    title: 'The Benches',
    sub: 'Who rows, who listens, who keeps the ledger. The bard introduces everyone once — the sea does its own introductions after.',
    groups: [
      {
        label: 'The powers',
        members: [
          { name: 'Athena', face: fig(owl()), sub: 'the owl on the mast',
            note: 'Watches the whole voyage. Not loved — watched. At sea that is the better coin, and she tips the last scale in the Hall.' },
          { name: 'Poseidon', face: fig(trident()), sub: 'the sea’s ledger',
            note: 'Keeps the grudge the way stone keeps heat. Provoke him to ten and the telling ends where tellings end when the water answers.' },
        ],
      },
      {
        label: 'The fire',
        members: [
          { name: 'The bard', face: fig(cup('full')), sub: 'tonight’s voice',
            note: nights >= 5
              ? `Has sung the long way home at this fire ${nights} nights now, and still checks the cup between verses.`
              : 'Sings the long way home for wine, figs, and the attention of the back row. Checks the cup between verses.' },
          { name: 'The woman by the woodpile', face: fig(crowdWoman()), sub: 'the fact-checker',
            note: 'Counts the ships in every telling. Her grandfather knew a rower. The bard maintains it is twelve; she maintains her grandfather could count.' },
          { name: 'The potter’s boy', face: fig(crowdBoy()), sub: 'the deadpan',
            note: 'Asks the load-bearing questions — why the shout, whether the man on the beach ever stands up — at exactly the hour they weigh most.' },
          { name: 'The man who wants the horse', face: fig(crowdHorseMan()), sub: 'the running request',
            note: 'Wants the horse. It is the wrong poem, friend; that one costs extra, and he has been told, and he will ask again tomorrow.' },
          { name: 'Phemios of Smyrna', face: fig(emptyPlace()), sub: 'the empty place',
            note: 'The rival. Not here — ask the bard why, and pour yourself something first. Does the storm passage with a drum. A DRUM.' },
        ],
      },
      {
        label: 'The benches',
        members: [
          { name: 'The Expedition', face: fig(ship(12), 'roster-fig-wide'),
            sub: 'twelve ships out of Troy',
            note: lost > 0
              ? `Men and timber as one dwindling thing. Across your tellings the sand has taken ${lost} of them, each named once.`
              : 'Men and timber as one dwindling thing. When a bench empties, the bard names the man once, and the sand keeps the count.' },
          ...CREW.map((m) => ({
            name: m.name,
            face: fig(oar(), 'roster-fig-oar'),
            note: m.detail.charAt(0).toUpperCase() + m.detail.slice(1) + '.',
          })),
          { name: 'The fire itself', face: fig(fire()), sub: 'lit at your first touch',
            note: 'Burns for as long as the telling does. Banked between nights. It has never once learned to cheer for a comfortable ending.' },
        ],
      },
    ],
  };
};
