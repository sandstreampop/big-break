// Venue subsystem, extracted as a plugin (Phase 4.2 — the canary). Zero RNG:
// pure state mutation. The engine dispatches modifyEffects (home-venue show
// bonus), onEffect (adoptVenue / venueLove), and afterResolve (build the room
// toward an institution). All logic lifted verbatim from the old inline
// blocks, so the golden stays green.

import { venueById, VENUE_TIERS } from '../../data/venues.js';
import { tagsIntersect } from '../../engine.js';
import type { Plugin } from '../../types.js';

// Per-card scratch: the engine's old inline code captured `venue`/`venueHosted`
// ONCE, before applyEffects — so a card that adopts a venue never also levels
// it the same card. modifyEffects (fires before effects land) records that
// snapshot; afterResolve (fires after) reuses it. Runs are single-threaded and
// sequential, and both hooks fire once per card in order, so a module-level
// scratch is safe.
let venueThisCard: any = null;
let hostedThisCard = false;

export const venuePlugin: Plugin = {
  id: 'venue',

  // A show in your adopted room lifts a Good/Incredible night (flat fame+cred
  // by venue level). Applied to the effects payload before it lands.
  modifyEffects(state, effects, ctx) {
    venueThisCard = venueById(state.venue); // snapshot before adoptVenue can fire
    hostedThisCard = false;
    const venue = venueThisCard;
    if (venue && ctx.tier !== 'bad' && ctx.tier !== 'declined' && tagsIntersect(venue.tags, ctx.choice?.tags)) {
      hostedThisCard = true;
      const bonus = VENUE_TIERS[state.venueLevel]?.showBonus || 0;
      if (bonus) {
        effects.fame = (effects.fame || 0) + bonus;
        effects.cred = (effects.cred || 0) + Math.ceil(bonus / 2);
      }
    }
  },

  onEffect(state, effects) {
    if (effects.adoptVenue && !state.venue) {
      state.venue = effects.adoptVenue;
      state.venueLevel = Math.min(3, effects.venueLoveStart || 0);
    }
    if (effects.venueLove && state.venue) {
      state.venueLevel = Math.min(3, (state.venueLevel || 0) + effects.venueLove);
    }
  },

  // Build the room: any venue-tagged show (any tier — you showed up) levels it
  // up. ×0.75 so a home room becomes an institution within one career. Uses the
  // snapshot from modifyEffects so a just-adopted venue doesn't level this card.
  afterResolve(state, result, ctx) {
    const venue = venueThisCard;
    if (venue && tagsIntersect(venue.tags, ctx.choice?.tags)) {
      state.venueShows = (state.venueShows || 0) + 1;
      const newLevel = Math.min(VENUE_TIERS.length - 1, Math.floor(state.venueShows * 0.75));
      if (newLevel > state.venueLevel) {
        state.venueLevel = newLevel;
        result.venueLeveled = { venue, level: newLevel, tier: VENUE_TIERS[newLevel] };
      } else if (hostedThisCard && (VENUE_TIERS[state.venueLevel]?.showBonus || 0) > 0) {
        result.venueHosted = { venue, tier: VENUE_TIERS[state.venueLevel] };
      }
    }
  },
};
