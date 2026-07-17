// The Odyssey — the modes (pass 7 of the player-experience series): the
// Scarred Telling (comeback) and the Same Sea (daily), both of which the
// title screen was offering with another genre's words or not at all.
//
// THE SCARRED TELLING — unlocked by any full homecoming (the shell's gate:
// meta.successPaths non-empty + Pack.comeback present). The bard retells a
// man already worn by your own tellings: the fleet sails bled, the sea
// already provoked, Despair already aboard — but tonight's Odysseus is a
// veteran, sharper in all three ways, and the fire pays extra for a hard
// story done well (scoreMult ×1.2 on the comeback flag; the music-economy
// precedent, engine-neutral).
//
// THE SAME SEA — the daily's copy. The mechanism (shared date seed, results
// ledger, streaks) is shell-generic; only the words are ours.

import type { Pack, Plugin, Presenter, RunState } from '../../types.js';

const clampStat = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// The scarred fleet's launch count — every fire launches the same nine on a
// comeback night (the transform SETS it), and the crew ledger measures
// tonight's losses against THIS baseline, not the fresh-telling twelve:
// the three (or five) missing men are last telling's scars, already named,
// and must not be double-counted as tonight's dead (or silently price the
// every-man-home feat out of the mode).
export const SCARRED_LAUNCH = 9;

// The transform runs after newRun (and after the fires plugin's grants), so
// it SETS the scars rather than adding them — the same fire always launches
// the same scarred fleet.
export const odysseyComeback: NonNullable<Pack['comeback']> = (state: RunState) => {
  state.expedition = SCARRED_LAUNCH;
  state.poseidon = 2;
  state.renown = (state.renown || 0) + 1;
  for (const k of ['might', 'guile', 'lore']) {
    state.stats[k] = clampStat((state.stats[k] || 0) + 6, 1, 100);
  }
  state.stats.burnout = 22;
  if (!state.flags.includes('comeback')) state.flags.push('comeback');
};

// The fire pays extra for a hard story done well. No rng, no state slots —
// golden-safe by construction (the flag never exists in seeded sim runs).
export const odysseyModesPlugin: Plugin = {
  id: 'odyssey_modes',
  scoreMult: (state) => ((state.flags || []).includes('comeback') ? 1.2 : 1),
};

export const ODYSSEY_COMEBACK_COPY: NonNullable<Presenter['comeback']> = {
  label: '🌊 The Scarred Telling (×1.2 LP)',
  head: 'The Scarred Telling',
  sub: 'You have brought a telling home whole, so the fire asks for the harder one: tonight the fleet sails already bled — nine hulls out of Troy, whichever fire you sing at — the sea already muttering, the weight already aboard. But tonight’s Odysseus is a veteran of your tellings, sharper in all three ways, and a hard story done well pays half again.',
};

export const ODYSSEY_DAILY_COPY: NonNullable<Presenter['daily']> = {
  name: 'The Same Sea',
  calendarHead: '🌊 The Tide Log',
  endNote: (summary: any) => {
    const n = summary?.dailyStreak || 1;
    const streak = n > 1 ? `Night ${n} of your streak at this fire.` : 'Streak: night one.';
    return `🌊 That was tonight’s shared sea — every bard alive sang the same water: same winds, same islands, same giant. ${streak} Tomorrow’s telling opens at midnight. Compare endings, not routes; the routes are the good part.`;
  },
};
