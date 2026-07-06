// Venue subsystem, as a plugin. Zero RNG: pure state mutation. The engine
// dispatches modifyEffects (home-venue show bonus), onEffect (adoptVenue /
// venueLove), and afterResolve (build the room toward an institution).

import { venueById, VENUE_TIERS } from '../../data/venues.js';
import { tagsIntersect } from '../../engine.js';
import type { Plugin } from '../../types.js';

export const venuePlugin: Plugin = {
  id: 'venue',
  effectVerbs: ['adoptVenue', 'venueLove', 'venueLoveStart'],
  // The venue run-state slots: adopted room + its level and show count.
  stateDefaults: { venue: null, venueLevel: 0, venueShows: 0 },

  // The venue eligibility predicates: a card can gate on having adopted a
  // room, on a specific room, or on the room's level. Registered here so the
  // shared Requires names no venue.
  requires: {
    venueAny: (s, arg) => !arg || !!s.venue,
    venueNone: (s, arg) => !arg || !s.venue,
    venueIs: (s, arg) => s.venue === arg,
    venueLevelMin: (s, arg) => !!s.venue && (s.venueLevel || 0) >= arg,
  },

  // A show in your adopted room lifts a Good/Incredible night (flat fame+cred
  // by venue level). Applied to the effects payload before it lands.
  //
  // The snapshot (venue as it was BEFORE adoptVenue could fire this card, plus
  // whether the room was hosted) lives on the per-card ctx the engine hands to
  // both modifyEffects and afterResolve — not on module scope, so it
  // is correct even if two runs resolve at once.
  modifyEffects(state, effects, ctx) {
    ctx.scratch.venueThisCard = venueById(state.venue); // snapshot before adoptVenue can fire
    ctx.scratch.hostedThisCard = false;
    const venue: any = ctx.scratch.venueThisCard;
    if (venue && ctx.tier !== 'bad' && ctx.tier !== 'declined' && tagsIntersect(venue.tags, ctx.choice?.tags)) {
      ctx.scratch.hostedThisCard = true;
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
    const venue: any = ctx.scratch.venueThisCard;
    if (venue && tagsIntersect(venue.tags, ctx.choice?.tags)) {
      state.venueShows = (state.venueShows || 0) + 1;
      const newLevel = Math.min(VENUE_TIERS.length - 1, Math.floor(state.venueShows * 0.75));
      if (newLevel > state.venueLevel) {
        state.venueLevel = newLevel;
        result.venueLeveled = { venue, level: newLevel, tier: VENUE_TIERS[newLevel] };
      } else if (ctx.scratch.hostedThisCard && (VENUE_TIERS[state.venueLevel]?.showBonus || 0) > 0) {
        result.venueHosted = { venue, tier: VENUE_TIERS[state.venueLevel] };
      }
    }
  },
};
