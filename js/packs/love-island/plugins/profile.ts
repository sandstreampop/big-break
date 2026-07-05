// Profile — the Love Island pack's magnitude meters and the Edit economy.
// Owns Public (the vote), Followers (post-show clout, fed by drama), Graft
// (the cost resource), and the Angle verbs (the gear reskin: slot-limited
// Edit, swap-and-discard shelf, `loseOnBad` = exposed, no upkeep). The
// Influencer's Followers-on-drama quirk is read off pctx.hooks
// (`followersOnDrama`) — a pack-custom key the engine never names.

import { tagsIntersect } from '../../../engine.js';
import { ANGLES, angleById } from '../angles.js';
import type { Plugin } from '../../../types.js';

export const profilePlugin: Plugin = {
  id: 'profile',
  effectVerbs: ['grantAngle', 'removeAngle'],
  stateDefaults: { accessories: [] }, // the Edit: equipped Angle ids

  requires: {
    angleHas: (s, arg) => (s.accessories || []).includes(arg),
  },

  // Equipped Angles add tag-matched roll bonuses; the ones that fire are
  // recorded on ctx.applied so the engine's lose-on-bad ("exposed") works.
  // Pure — the risk tell calls this too.
  modifyRoll(state, choice, ctx) {
    let bonus = 0;
    for (const id of state.accessories || []) {
      const a = angleById(id);
      if (a && tagsIntersect(a.appliesTo, choice.tags)) {
        bonus += a.modifier;
        ctx.applied.push(a);
      }
    }
    return bonus;
  },

  applyResource(res, effects, state, ctx) {
    const e = effects as any;
    const hooks = (ctx as any).hooks || {};
    // (`public` moved to the factions plugin in ADR-0012 — it's the derived
    // aggregate now, and the factions plugin is its single writer.)
    if (res === 'followers') {
      let v = e.followers || 0;
      // The Influencer: drama/camera moments that LAND throw off bonus Followers.
      const drama = hooks.followersOnDrama;
      if (drama && ((ctx as any).tier === 'good' || (ctx as any).tier === 'incredible') &&
          tagsIntersect(drama.tags, (ctx as any).choice?.tags || [])) {
        v += drama.bonus;
      }
      // Exclusive couples forgo the field-player clout (ADR-0002's real cost).
      if (v > 0 && state.exclusive) v = Math.round(v * 0.6);
      if (!v) return 0;
      const before = state.followers;
      state.followers = Math.max(0, before + v);
      return state.followers - before;
    }
    if (res === 'graft') {
      const v = e.graft || 0;
      if (!v) return 0;
      const before = state.graft;
      state.graft = Math.max(0, before + v);
      return state.graft - before;
    }
    return undefined; // bond is the coupling plugin's
  },

  // The build pays out (R1/A3): an equipped Angle with a per-act stat grant
  // compounds at every act break — the Brand's early-pick reward.
  onActBreak(state, _act, notes) {
    for (const id of state.accessories || []) {
      const a = angleById(id);
      if (!a?.perAct) continue;
      for (const [k, v] of Object.entries(a.perAct)) {
        if (k in state.stats) state.stats[k] = Math.min(100, Math.max(0, state.stats[k] + (v as number)));
        notes.push(`✨ The ${a.name} edit compounds: +${v} ${k === 'charisma' ? 'Charisma' : k}. The camera keeps finding you.`);
      }
    }
  },

  onEffect(state, effects, pctx) {
    const e = effects as any;
    const { deltas, rng } = pctx as any;
    if (e.removeAngle) state.accessories = (state.accessories || []).filter((a: string) => a !== e.removeAngle);
    if (e.grantAngle) {
      if (e.grantAngle === 'shelf') {
        // The daybed shelf: up to three Angles you don't already have; the
        // player picks one (the UI's gear-shelf flow, reskinned by copy).
        const owned = new Set(state.accessories || []);
        const bag = ANGLES.filter((a) => !owned.has(a.id));
        const shelf: any[] = [];
        while (shelf.length < 3 && bag.length) {
          shelf.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
        }
        if (shelf.length > 1) deltas.pendingGearChoices = shelf;
        else if (shelf.length === 1) deltas.pendingGear = shelf[0];
      } else {
        const a = angleById(e.grantAngle);
        if (a && !(state.accessories || []).includes(a.id)) deltas.pendingGear = a;
      }
    }
  },
};
