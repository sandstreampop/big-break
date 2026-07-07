// Sound-identity (genre) subsystem, as a music pack plugin. A committed genre
// carries tag-matched roll bonuses and colors song titles. The core names no
// genre: the plugin folds its roll bonus in through the neutral modifyRoll hook.

import { genreById } from '../data/genres.js';
import { tagsIntersect } from '../../../engine.js';
import type { Plugin } from '../../../types.js';

export const genrePlugin: Plugin = {
  id: 'genre',
  stateDefaults: { genre: null }, // committed sound identity

  // The genre eligibility predicate: a card can gate on having committed
  // to any sound.
  requires: {
    genreAny: (s, arg) => !arg || !!s.genre,
  },

  // A committed sound carries tag-matched roll bonuses, folded into the roll.
  modifyRoll(state, choice, _ctx) {
    let b = 0;
    for (const gb of genreById(state.genre)?.bonuses || []) {
      if (tagsIntersect(gb.tags, choice.tags)) b += gb.bonus;
    }
    return b;
  },
};
