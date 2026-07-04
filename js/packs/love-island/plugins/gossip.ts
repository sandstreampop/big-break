// Gossip — held intel as a currency (ADR-0007). NOT the manifest's scalar
// cost-resource: gossip is an inventory of discrete, typed items you GATHER
// (inside encounters, and in the Beach Hut confessional — which echoes a
// distorted version back out) and DEPLOY by choice (tell your Partner / drop
// it to the Rival / keep it). A deployment shifts a target's opinion or mood
// and cascades along the small Partner ↔ You ↔ Rival network; a held Rival
// SECRET cashes out at the ceremony (the coupling plugin reads secretSpent —
// see the climax encounter). Pack-owned; the engine names none of this.

import { castById } from '../cast.js';
import { roleCastId, secretOf, MOODS } from './characters.js';
import type { Plugin, RunState } from '../../../types.js';

export const GOSSIP = {
  intelCap: 3,        // held feelings — old news goes stale beyond this
  tellBond: 4,        // telling your Partner a feeling: Bond gain
  tellBondSecret: 7,  // …a secret lands harder
  tellRivalHit: -5,   // the Rival hears you told — opinion cost
  dropRivalGain: 6,   // feeding the Rival intel: opinion gain
  dropRivalSecret: 10,
  dropBondRisk: -2,   // your Partner clocks the huddle
};

export interface IntelItem { about: string; label: string; }

// Everything you currently HOLD: gathered feelings plus surfaced, unspent
// secrets (the characters plugin's). One inventory in the player's head.
export function heldIntel(state: RunState): { feelings: IntelItem[]; secrets: string[] } {
  const secrets = (['partner', 'rival', 'bombshell'] as const)
    .filter((r) => {
      const s = secretOf(state, r);
      return s.known && !s.spent && s.def && roleCastId(state, r);
    });
  return { feelings: state.intel || [], secrets };
}
export function intelCount(state: RunState): number {
  const h = heldIntel(state);
  return h.feelings.length + h.secrets.length;
}

const note = (pctx: any, cls: string, html: string) => {
  const d = pctx.deltas;
  (d.notices = d.notices || []).push({ cls, html });
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const moveOpinion = (state: RunState, role: 'rival' | 'bombshell', v: number) => {
  if (!roleCastId(state, role)) return;
  state.charOpinion[role] = clamp((state.charOpinion[role] ?? 0) + v, 0, 100);
};
const setMood = (state: RunState, role: string, mood: string) => {
  if (MOODS[mood] && roleCastId(state, role as any)) state.charMood[role] = { id: mood, ttl: 4 };
};

export const gossipPlugin: Plugin = {
  id: 'gossip',
  effectVerbs: ['gainIntel', 'deployIntel'],
  stateDefaults: {
    intel: [],           // gathered feelings [{about, label}]
    intelDeployed: 0,    // how many deployments this Season (scrapbook)
  },

  requires: {
    // Gate a deploy beat on holding anything at all (or a specific amount).
    intelMin: (s, arg) => intelCount(s) >= (arg as number),
    // 'rival:true' — do you hold intel ABOUT that role (feeling or secret)?
    intelAboutIs: (s, arg) => {
      const [role, want] = String(arg).split(':');
      const h = heldIntel(s);
      const has = h.secrets.includes(role) || h.feelings.some((i) => i.about === role);
      return has === (want !== 'false');
    },
  },

  onEffect(state, effects, pctx) {
    const e = effects as any;

    // GATHER: a beat hands you a feeling. The inventory is small on purpose —
    // stale whispers fall off the back.
    if (e.gainIntel && e.gainIntel.about && roleCastId(state, e.gainIntel.about)) {
      state.intel = state.intel || [];
      state.intel.push({ about: e.gainIntel.about, label: e.gainIntel.label || 'something they said' });
      const who = castById(roleCastId(state, e.gainIntel.about));
      note(pctx, 'notice-encore', `🤫 <b>Intel.</b> ${who ? who.name : 'Someone'} — ${e.gainIntel.label}. Filed.`);
      if (state.intel.length > GOSSIP.intelCap) {
        const stale = state.intel.shift();
        note(pctx, 'notice-bad', `🗞️ Old news goes stale: “${stale.label}” stops being currency.`);
      }
    }

    // DEPLOY: spend what you hold. The target is who you TELL; the cascade
    // runs along the Partner ↔ You ↔ Rival network and stays readable.
    if (e.deployIntel) {
      const to = e.deployIntel as 'partner' | 'rival';
      const h = heldIntel(state);
      // A feeling spends first; with none held, a surfaced secret goes — the
      // big note gets broken only when the small ones are gone.
      const item = h.feelings[h.feelings.length - 1] || null;
      const secretRole = !item ? h.secrets.find((r) => r !== to) || h.secrets[0] || null : null;
      if (!item && !secretRole) return;
      const isSecret = !!secretRole;
      if (item) state.intel = (state.intel || []).filter((x) => x !== item);
      else (state.secretSpent = state.secretSpent || []).push(secretRole);
      state.intelDeployed = (state.intelDeployed || 0) + 1;
      const label = item ? item.label : secretOf(state, secretRole as any).def?.label || 'the secret';

      if (to === 'partner' && state.partner) {
        const gain = isSecret ? GOSSIP.tellBondSecret : GOSSIP.tellBond;
        const before = state.bond;
        state.bond = clamp(state.bond + gain, 0, 100);
        if (state.bond !== before) pctx.deltas.push({ key: 'bond', amount: state.bond - before });
        setMood(state, 'partner', 'buzzing');
        moveOpinion(state, 'rival', GOSSIP.tellRivalHit);
        setMood(state, 'rival', 'fuming');
        const p = castById(state.partner);
        note(pctx, 'notice-good', `🤝 <b>You tell ${p ? p.name : 'your partner'} everything.</b> “${label}.” The couple tightens; the villa’s walls take notes.`);
      } else if (to === 'rival' && state.rival) {
        moveOpinion(state, 'rival', isSecret ? GOSSIP.dropRivalSecret : GOSSIP.dropRivalGain);
        setMood(state, 'rival', 'scheming');
        if (state.partner) {
          const before = state.bond;
          state.bond = clamp(state.bond + GOSSIP.dropBondRisk, 0, 100);
          if (state.bond !== before) pctx.deltas.push({ key: 'bond', amount: state.bond - before });
          setMood(state, 'partner', 'torn');
        }
        if (!state.flags.includes('li_fed_the_rival')) state.flags.push('li_fed_the_rival');
        const r = castById(state.rival);
        note(pctx, 'notice-gear', `🐍 <b>You feed ${r ? r.name : 'the rival'} the good stuff.</b> “${label}.” Leverage banked — and the huddle didn’t go unnoticed.`);
      }
    }
  },
};
