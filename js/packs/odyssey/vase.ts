// The Night's Vase (pass 23) — the ending screen paints TONIGHT's voyage.
//
// A black-figure frieze band composed purely from the ended run: the fleet
// at its final count, the water the sea actually wore, the beats the telling
// actually faced (the cave island, the trench's ash, the warm island), and
// the ending's motif — the homecoming star and gulls, the trident for the
// wrath, the set-down cup for a banked telling, the guttered ember for the
// beach. Every figure is the pack's own pixel work (art/figures.ts); this
// module only CHOOSES and ORDERS them, left to right, the way a vase reads.
//
// PURE: a function of the ended state alone — no rng, no Date, no module
// state — so the same telling always fires the same vase (testable), and
// nothing here can touch a seeded stream (goldens indifferent; the vase
// renders after the run has ended).

import type { RunState } from '../../types.js';
import {
  ship, seaStrip, island, cyclopsIsland, ashBand, owl, trident, cup, gulls, star, ember,
} from './art/figures.js';
import type { SeaState } from './art/figures.js';

// The chosen motifs, exposed for tests and the aria label: a legible list of
// what the vase depicts, in paint order.
export interface NightVase { html: string; motifs: string[]; }

export function nightVase(state: RunState, still = false): NightVase {
  const flags = state.flags || [];
  const key = state.ending?.key ?? state.path ?? null;
  const result = state.ending?.result ?? null;
  const motifs: string[] = [];
  const figs: string[] = [];
  const opts = still ? { cls: 'px-still' } : {};
  const put = (motif: string, html: string, cls = '') => {
    motifs.push(motif);
    figs.push(`<span class="ody-vase-fig${cls ? ' ' + cls : ''}">${html}</span>`);
  };

  // The fleet, at tonight's final count — the vase does not flatter.
  const hulls = Math.max(0, Math.round(state.expedition ?? 0));
  put(`the ship, ${hulls} rowing`, ship(hulls, opts));

  // The voyage's stations, in itinerary order, only if actually faced.
  if (flags.includes('ody_done_cyclops')) put('the cave island', cyclopsIsland(opts));
  if (flags.includes('ody_done_underworld')) put('the trench', ashBand(24, { stretch: false, ...opts }));
  if (flags.includes('ody_stayed_lotus') || flags.includes('ody_stayed_circe') || flags.includes('ody_stayed_calypso')) {
    put('the warm island, near', island(true, opts));
  } else if (flags.includes('ody_done_calypso') || flags.includes('ody_done_circe') || flags.includes('ody_done_lotus')) {
    put('the island passed', island(false, opts));
  }

  // The powers, when they truly attended.
  if ((state.athena ?? 0) >= 6) put('the owl', owl(opts));
  if ((state.poseidon ?? 0) >= 7 || key === 'wrath') put('the trident', trident(opts));

  // The ending's motif closes the band.
  if (key === 'nostos' && result === 'success') {
    put('the star', star(opts));
    put('the gulls of the home shore', gulls(opts));
  } else if (key === 'kleos' && result === 'success') {
    put('the raised cup', cup('full', opts));
  } else if (key === 'lotus' || key === 'circe' || key === 'calypso') {
    put('the cup, set down', cup('down', opts));
  } else if (key === 'burnout') {
    put('the last ember', ember(opts));
  } else if (key === 'wrath') {
    // The trident above already closes a wrath band; the sea says the rest.
  } else {
    put('the cup, half-poured', cup('half', opts));
  }

  // The water the sea wore, under everything.
  const sea: SeaState = (state.poseidon ?? 0) >= 7 ? 'wrath' : (state.poseidon ?? 0) >= 4 ? 'mid' : 'calm';
  motifs.push(`the sea, ${sea}`);

  const label = `tonight’s vase: ${motifs.join('; ')}`;
  const html =
    `<div class="ody-vase" role="img" aria-label="${label.replace(/"/g, '&quot;')}">` +
    `<div class="ody-vase-band">${figs.join('')}</div>` +
    `<div class="ody-vase-sea">${seaStrip(sea, 96, opts)}</div>` +
    `</div>`;
  return { html, motifs };
}
