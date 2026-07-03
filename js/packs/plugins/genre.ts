// Sound-identity (genre) subsystem, as a music pack plugin. A committed genre
// carries tag-matched roll bonuses and colors song titles. Extracted from the
// engine so the core names no genre: the plugin folds its roll bonus in through
// the neutral modifyRoll hook.

import type { Plugin } from '../../types.js';

export const genrePlugin: Plugin = {
  id: 'genre',

  // The genre eligibility predicate (WP1): a card can gate on having committed
  // to any sound.
  requires: {
    genreAny: (s, arg) => !arg || !!s.genre,
  },
};
