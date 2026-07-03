// The music pack's magnitude resources — fame, money, pathProgress — as a
// plugin. These are the "how big" meters (the summits gate on fame; money buys
// gear; pathProgress is momentum toward the finale clutch). Their bespoke apply
// arithmetic (fame clamps at 0 and honors the instrument's fame-swing; money
// siphons through gear and multiplies by weather/contract) is extracted from
// the engine's RESOURCE_APPLY table so the core names no music resource; here it
// starts by owning the fame eligibility predicates.

import type { Plugin } from '../../types.js';

export const economyPlugin: Plugin = {
  id: 'economy',

  // The fame eligibility predicates (WP1): fame is a music resource, so its
  // gate lives with the pack, not the shared Requires. (Cards author `fameMin`;
  // a generic pack would use the neutral `min: { fame: n }` instead.)
  requires: {
    fameMin: (s, arg) => (s.fame ?? 0) >= arg,
    fameMax: (s, arg) => (s.fame ?? 0) <= arg,
  },
};
