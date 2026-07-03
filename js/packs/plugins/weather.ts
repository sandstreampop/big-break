// Scene Weather subsystem, as a music pack plugin. Weather is a run-start era
// (Vinyl Revival, Streaming Gold Rush…) that recolors the deck, bends rolls,
// and tilts income. Extracted from the engine so the core names no weather:
// the plugin draws the era at run start and folds its hooks in through the
// neutral modify-hooks the engine fires at each site.

import type { Plugin } from '../../types.js';

export const weatherPlugin: Plugin = {
  id: 'weather',

  // The weather eligibility predicate (WP1): a card can gate on the current era.
  requires: {
    weatherIs: (s, arg) => s.weather === arg,
  },
};
