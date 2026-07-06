// Producers — the format's scheduler, as a plugin. The villa doesn't drift:
// production imposes the beats. v4 S2 (ADR-0011): the season is SIX WEEKS
// (manifest SEGMENTS), and a week is a run of quiet daily beats that ENDS on
// a tentpole — the peak-end rule as a schedule. This plugin places the
// tentpoles with the same delivery-by-force machinery as before (refineDeck
// windows, the engine's shop-slot mechanism generalized), queues the forced
// chains (the arrival on card one, the boys' Recoupling opening Final Week),
// and owns the villa's per-week feel ladders (jitter, wear, the late-week
// daybed slot) that used to ride the shared per-act CONFIG tables — ADR-0010
// left those keyed 1–3, and weeks 4–6 get theirs from here instead.
//
// A beat card carries a `beat:<key>` tag; when its window opens the pool
// narrows to that beat's eligible variants, and outside its window a beat
// card never enters the pool at all. Resolving any variant marks the beat
// done (a li_done_<key> flag). A window that reaches the end of its week
// unfired (a wobble interstitial or an encounter chain ate the last slot)
// ROLLS FORWARD: it stays due at the top of the next week, so a tentpole is
// delayed a day at worst, never lost — events.ts gives beat cards one week
// of act slack for exactly this.

import { actLength } from '../../../engine.js';
import { islanderTypeById } from '../cast.js';
import { CONFIG } from '../../../config.js';
import type { Plugin } from '../../../types.js';

// The season's schedule. `at` is the 0-indexed card slot within the week
// where the window opens ('end' = the week's LAST draw, resolved against the
// live actLength so act twists keep the tentpole on the final card;
// 'end-1' = one earlier, for tentpoles whose verdict chains one more card and
// should still close the week). Order is chronological = priority order.
const BEATS: { key: string; act: number; at: number | 'end' | 'end-1' }[] = [
  // W1 — Arrival: you MEET your partner and start building the connection first
  // (Hillevi's core note: too much rival, too little partner — so the season's
  // first authored scene is your couple, not an antagonist). Week peaks on a
  // Bombshell.
  { key: 'partnerenc1', act: 1, at: 1 },
  { key: 'bomb1', act: 1, at: 'end' },
  // W2 — The Graft: NOW the Rival surfaces — as one thread in the villa, not
  // the season's opening antagonist. Week peaks on the first big Challenge, and
  // the Crossroads (the commit slot) follows it.
  { key: 'rivalenc', act: 2, at: 1 },
  { key: 'challenge1', act: 2, at: 'end' },
  // W3 — Casa Amor: the split lands late and the 5-card arc overruns the
  // nominal length, so the week closes on the return verdict.
  { key: 'casa', act: 3, at: 'end' },
  // W4 — fallout week: the ride-or-die forms, the Rival makes their move,
  // and the week peaks on Movie Night.
  { key: 'bestieenc', act: 4, at: 1 },
  { key: 'rivalmove', act: 4, at: 3 },
  { key: 'movienight', act: 4, at: 'end' },
  // W5 — the girls' Recoupling closes the week (its verdict chains one card).
  { key: 'bomb2', act: 5, at: 2 },
  { key: 'recoup1', act: 5, at: 'end-1' },
  // W6 — Final Week: the second-wave rival (if the first fell), the Partner
  // at altitude, Meet the Parents. The week opens on the boys' Recoupling
  // (onActBreak) and ends on the Final itself — the engine queues the climax
  // card and nothing here may displace it.
  { key: 'wave', act: 6, at: 1 },
  { key: 'partnerenc', act: 6, at: 2 },
  { key: 'parents', act: 6, at: 4 },
];

// Per-week feel ladders (the villa's own — weeks 4–6 sit past the shared
// CONFIG tables' 1–3 keys, and weeks 2–3 need villa values, not tour values).
// Jitter REPLACES the engine's per-act band (no LI persona carries a jitter
// quirk, so overriding is safe); wear is a DELTA on top of whatever
// CONFIG.actWear already added for that index, landing at the target ladder:
//   wear   W1 0 · W2 0 · W3 1 · W4 2 · W5 2 · W6 3
//   jitter W1–2 ±15 · W3–5 ±18 · W6 ±22
const WEEK_JITTER: Record<number, [number, number]> = {
  2: [-15, 15], 3: [-18, 18], 4: [-18, 18], 5: [-18, 18], 6: [-22, 22],
};
const WEEK_WEAR_DELTA: Record<number, number> = { 2: -2, 3: -2, 4: 2, 5: 2, 6: 3 };

const beatTag = (ev: any) => (ev.tags || []).find((t: string) => t.startsWith('beat:'));
const atSlot = (at: number | 'end' | 'end-1', len: number) =>
  at === 'end' ? len - 1 : at === 'end-1' ? Math.max(0, len - 2) : at;

export const producersPlugin: Plugin = {
  id: 'producers',
  stateDefaults: { rivalMagnet: false },

  // The Season opens on the arrival Text — the first coupling is card one.
  // rivalMagnet (the Heartthrob's poaching exposure) is stamped here so the
  // coupling plugin's ceremony math stays a pure state read.
  onRunStart(state) {
    const hooks: any = islanderTypeById(state.loadout)?.quirk?.hooks || {};
    state.rivalMagnet = !!hooks.rivalMagnet;
    // The Bombshell persona (R8): no mixer — you arrive INTO a coupled villa.
    state.pendingChainId = hooks.bombshellStart ? 'li_arrival_bomb' : 'li_arrival';
  },

  // Final Week opens on the exposed Recoupling (ADR-0002/0003): R2 is the
  // boys' ceremony — your gender decides which side of it you stand on.
  // (Casa Amor is no longer an act-break chain: it's week 3's end-of-week
  // tentpole, delivered by its beat window above.)
  onActBreak(state, act, notes) {
    if (state.tutorial) return;
    if (act === 6) {
      const chooser = state.gender === 'boy'; // R2: the boys choose
      state.pendingChainId = chooser
        ? (state.partner ? 'li_recoup2_choose' : 'li_recoup2_choose_single')
        : (state.partner ? 'li_recoup2_exposed' : 'li_recoup2_exposed_single');
      notes.push(chooser
        ? '🔥 Tonight there’s a recoupling, and the boys have the power. You are the boys.'
        : '🔥 Tonight there’s a recoupling, and the boys have the power. You are not the boys.');
    }
  },

  // The villa's jitter ladder, keyed by week (see the table above). The
  // engine's own per-act band only knows indices 1–3.
  modifyJitter(state, jitter) {
    if (state.tutorial) return jitter;
    return WEEK_JITTER[state.act] ?? jitter;
  },

  // The villa's wear ladder: a delta on CONFIG.actWear's contribution for
  // this index, landing on the week table above. (The villa authors no
  // Promises, so every payload folded here belongs to a resolved card.)
  modifyBurnout(state, v) {
    if (state.tutorial) return v;
    return v + (WEEK_WEAR_DELTA[state.act] ?? 0);
  },

  // Beat delivery: outside its window a beat card never enters the pool; when
  // a window opens, the pool narrows to that beat's eligible variants. Shop
  // draws keep priority when a shop is actually available (the daybed already
  // owns its slot); the beat simply takes the next draw. A window with no
  // eligible variant right now yields to the NEXT beat rather than blocking
  // the schedule — v2 added beats whose variants are state-gated by design
  // (the rival's move, the second wave), and a fully-covered beat is
  // unaffected (it always has an eligible hit). A window from an EARLIER week
  // that never fired is still due (at slot 0) — the roll-forward guarantee.
  refineDeck(state, pool, ctx) {
    if (state.tutorial) return pool;
    const beats = pool.filter((e: any) => beatTag(e));
    const rest = pool.filter((e: any) => !beatTag(e));
    // Defer to the engine's shop slot only when it can actually deliver —
    // a shop-less week must not suppress its own tentpole.
    if (ctx.shopDue && pool.some((e: any) => e.shop)) return rest.length ? rest : pool;
    // Weeks past the shared shopSlot table (4+): force the daybed once per
    // week the way the engine does for weeks 1–3, before any beat fires.
    if (!ctx.shopDue && CONFIG.shopSlot[state.act] === undefined &&
        !state.shopPlayedInAct && (state.cardsPlayedInAct || 0) >= 2) {
      const shops = rest.filter((e: any) => e.shop);
      if (shops.length) return shops;
    }
    const len = actLength(state, state.act);
    for (const b of BEATS) {
      if (b.act > state.act) continue;
      if (state.flags.includes(`li_done_${b.key}`)) continue;
      const at = b.act < state.act ? 0 : atSlot(b.at, len);
      if ((state.cardsPlayedInAct || 0) < at) continue;
      const hit = beats.filter((e: any) => beatTag(e) === `beat:${b.key}`);
      if (hit.length) return hit;
      // no eligible variant this draw — the next beat may still be due
    }
    return rest.length ? rest : pool;
  },

  // Any variant resolving closes its beat's window.
  afterResolve(state, _result, cardCtx) {
    const tag = cardCtx.ev && beatTag(cardCtx.ev);
    if (tag) {
      const flag = `li_done_${tag.slice(5)}`;
      if (!state.flags.includes(flag)) state.flags.push(flag);
    }
  },
};
