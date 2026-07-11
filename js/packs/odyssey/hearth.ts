// The Odyssey — the living hearth (I5; NORTH-STAR "The living hearth" +
// micro-moment 3, the wine cup as the clock). Frame beats become a SCENE,
// not a text box: the breathing fire, the canon heckler ensemble as seated
// black-figure silhouettes — the woman by the woodpile with her spindle,
// the potter's boy, the man who wants the horse, and an empty place where
// Phemios of Smyrna pointedly isn't — and the bard's cup, emptying across
// the night (Act I full, Act III dregs; a Calypso cash-out sets it down —
// the ending's business, I7). A figure SHIFTS when it speaks (frame two,
// held — a pose, not a tween), keyed off tonight's dialogue blocks.
//
// Pure composition: state + blocks in, markup out. The shell renders it in
// the generic beat-scene slot; the sims never call this.

import type { RunState } from '../../types.js';
import { fire, cup, crowdWoman, crowdBoy, crowdHorseMan, emptyPlace, type CupLevel } from './art/figures.js';

// Who sits where: the ensemble's canon seats around the fire. A speaking
// heckler's figure takes its second frame (css: .fig-speaking) for the beat.
const SEATS: { cls: string; match: RegExp; svg: () => string }[] = [
  { cls: 'fig-woman', match: /woodpile/, svg: crowdWoman },
  { cls: 'fig-boy', match: /potter/, svg: crowdBoy },
  { cls: 'fig-horse', match: /horse/, svg: crowdHorseMan },
];

export function cupLevelFor(act: number): CupLevel {
  return act >= 3 ? 'dregs' : act === 2 ? 'half' : 'full';
}

// The hearth scene: crowd left, fire centre, cup + the empty place right.
// `speakers` are the beat's `who` attributions (undefined = the bard).
export function hearthScene(state: RunState, speakers: (string | undefined)[] = []): string {
  const spoken = speakers.filter(Boolean).map((w) => (w as string).toLowerCase());
  const seat = (s: typeof SEATS[number]) => {
    const speaking = spoken.some((w) => s.match.test(w));
    return `<span class="fig ${s.cls}${speaking ? ' fig-speaking' : ''}">${s.svg()}</span>`;
  };
  return (
    `<span class="hearth-row">` +
    seat(SEATS[0]) + seat(SEATS[1]) +
    `<span class="fig fig-fire">${fire()}</span>` +
    seat(SEATS[2]) +
    `<span class="fig fig-cup">${cup(cupLevelFor(state.act || 1))}</span>` +
    `<span class="fig fig-empty" title="Phemios of Smyrna is not here">${emptyPlace()}</span>` +
    `</span>`
  );
}
