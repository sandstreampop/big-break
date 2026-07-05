// Stirling — the voiceover as a bark engine (ADR-0008). A condition-filtered,
// priority-weighted line bucket with no-repeat-until-exhausted selection (the
// Hades pattern): guaranteed authored lines at key beats, opportunistic
// templated reactions on notable results, rate-limited so he lands rather
// than nags. Selection is SEEDED (the run RNG) and the no-repeat state lives
// on run-state, so the goldens stay deterministic. He is comedy AND diegetic
// legibility: the ceremony forecast/verdict lines must reflect the real
// `Bond ≥ floor OR Public ≥ floor` state (ADR-0002) — the delivery jokes,
// the odds never lie.
//
// Two channels:
//  · result-time barks — this plugin's afterResolve sets result.overlayNote,
//    rendered by the shell's generic overlay-note channel.
//  · deal-time beat lines (forecast on a ceremony line-up, the verdict
//    explain, scene stamps) — stirlingDealNote below, PURE (no rng, no state
//    writes): render must be idempotent for resume, and the sims never render,
//    so a render-time RNG draw would fork the seeded stream. Variety comes
//    from a flavorSeed rotation instead.

import {
  BarkDef, REACT_INCREDIBLE, REACT_BAD, REACT_TAGGED,
  BEAT_VERDICT, BEAT_REACT, FORECAST, SCENE_STAMP,
} from '../stirling-lines.js';
import { ceremonyOutlook } from './coupling.js';
import type { Plugin, RunState, GameEvent } from '../../../types.js';

// The light player-stance colouring (the Stanley-Parable model): derived from
// recent play, selects tone-tagged variants. Flavour, not a mechanic.
export function stirlingStance(state: RunState): 'rooting' | 'clocking' | 'mess' {
  const DIRT = ['li_casa_kiss', 'li_head_turned', 'li_strayed_official', 'li_code_broke', 'li_casa_recouple'];
  const dirt = DIRT.filter((f) => (state.flags || []).includes(f)).length;
  if (dirt >= 2) return 'mess';
  if ((state.stats?.savvy ?? 0) >= 55) return 'clocking';
  return 'rooting';
}

// Seeded pick: stance-filter → drop lines already heard this run → (reset the
// pool's no-repeat slice when exhausted) → highest-priority tier → seeded
// draw. Consumes rng ONLY when a line is returned, so the draw stream is a
// pure function of play state.
function pickBark(state: RunState, pool: BarkDef[], rng: () => number): BarkDef | null {
  if (!pool || !pool.length) return null;
  const stance = stirlingStance(state);
  let elig = pool.filter((l) => !l.stance || l.stance === stance);
  if (!elig.length) elig = pool;
  const seen: string[] = state.stirlingSeen || [];
  let fresh = elig.filter((l) => !seen.includes(l.id));
  if (!fresh.length) {
    state.stirlingSeen = seen.filter((id) => !elig.some((l) => l.id === id));
    fresh = elig;
  }
  const top = Math.max(...fresh.map((l) => l.priority || 0));
  const cands = fresh.filter((l) => (l.priority || 0) === top);
  const pick = cands[Math.floor(rng() * cands.length)];
  (state.stirlingSeen = state.stirlingSeen || []).push(pick.id);
  return pick;
}

const OPPORTUNISTIC_COOLDOWN = 3; // cards between reaction barks — he breathes

// ---------- Deal-time beat lines (pure at render; recorded at resolve) ----------
// The render side (stirlingDealNote → the presenter's overlay read) must be
// PURE: deals re-render on resume and the sims never render, so a render-time
// write or rng draw would fork the seeded stream. No-repeat still lives on
// run-state (ADR-0008): the same selection is recomputed in this plugin's
// modifyEffects — pre-effect state, one card later on the log, sim-visible —
// and THAT is where the shown line is remembered (and a dry pool reset).

// Deterministic pick from a deal pool: skip lines already heard this run,
// rotate through the unheard remainder by per-run entropy × season progress.
// `offset` re-aligns the log length between deal (N) and resolve (N+1).
function dealPick(state: RunState, pool: BarkDef[], offset: number): BarkDef | null {
  if (!pool || !pool.length) return null;
  const seen: string[] = state.stirlingSeen || [];
  let fresh = pool.filter((l) => !seen.includes(l.id));
  if (!fresh.length) fresh = pool; // exhausted — the resolve side resets it
  const at = (state.flavorSeed || 1) + (state.cardLog || []).length + offset;
  return fresh[((at % fresh.length) + fresh.length) % fresh.length];
}
const asNote = (l: BarkDef | null) => (l ? { html: `🎙️ ${l.text}`, cls: 'note-stirling' } : null);

// The chosen-side ceremony line-ups — where the forecast lands (ADR-0008's
// whole legibility fix aimed at the beat that felt like a coin flip).
const CEREMONY_LINEUP = new Set(['li_recoup1_exposed', 'li_recoup2_exposed']);
const CEREMONY_LINEUP_SINGLE = new Set(['li_recoup1_exposed_single', 'li_recoup2_exposed_single']);

// Route a card to its deal-time pool and pick. Everything read here (ids,
// lastCeremony, ceremonyOutlook) is identical at deal time and at
// modifyEffects time (effects have not applied yet), so both sides agree.
function stirlingDealSelect(state: RunState, ev: GameEvent, offset: number): { line: BarkDef; pool: BarkDef[] } | null {
  if (state.tutorial || !ev) return null;
  const tags = ev.tags || [];
  const from = (pool: BarkDef[]) => {
    const line = dealPick(state, pool, offset);
    return line ? { line, pool } : null;
  };

  // The verdict, explained — so held/rescued/dumped reads as earned, not
  // rolled. Reads the coupling plugin's recorded check (state.lastCeremony),
  // so the explanation matches what actually decided it.
  if (ev.id === 'li_recoup_held') {
    return from(state.lastCeremony?.secretPlayed ? BEAT_VERDICT.held_secret : BEAT_VERDICT.held);
  }
  if (ev.id === 'li_recoup_rescued') return from(BEAT_VERDICT.rescued);
  if (ev.id === 'li_recoup_dumped') return from(BEAT_VERDICT.dumped);

  // The line-up forecast: a qualitative, HONEST read of the real check.
  if (CEREMONY_LINEUP.has(ev.id)) {
    const o = ceremonyOutlook(state);
    return from(FORECAST[o.bondSafe ? 'bondSafe' : o.publicSafe ? 'publicSafe' : 'danger']);
  }
  if (CEREMONY_LINEUP_SINGLE.has(ev.id)) {
    return from(ceremonyOutlook(state).publicSafe ? FORECAST.publicSafe : FORECAST.single);
  }

  // Scene stamps on the other watched beats.
  if (ev.id === 'li_bomb2_steal') return from(SCENE_STAMP.steal);
  if (tags.includes('beat:movienight')) return from(SCENE_STAMP.movienight);
  if (tags.includes('beat:parents')) return from(SCENE_STAMP.parents);
  if (ev.finaleCard) return from(SCENE_STAMP.finale);
  return null;
}

export function stirlingDealNote(state: RunState, ev: GameEvent) {
  return asNote(stirlingDealSelect(state, ev, 0)?.line || null);
}

// ---------- The plugin (result-time barks) ----------

export const stirlingPlugin: Plugin = {
  id: 'stirling',
  stateDefaults: {
    stirlingSeen: [],       // no-repeat-until-exhausted, per run
    stirlingCool: 0,        // opportunistic rate limit (cards)
    stirlingSecretSeen: 0,  // how many surfaced secrets he's reacted to
  },

  // The deal-note's no-repeat write, on the resolve path: recompute the exact
  // line the deal showed (cardLog is one longer here, hence offset -1; the
  // effects payload has NOT applied yet, so every state read matches the
  // deal), remember it, and reset the pool once it runs dry.
  modifyEffects(state, _effects, ctx) {
    const sel = stirlingDealSelect(state, (ctx as any).ev, -1);
    if (!sel) return;
    const seen: string[] = (state.stirlingSeen = state.stirlingSeen || []);
    if (!seen.includes(sel.line.id)) seen.push(sel.line.id);
    if (sel.pool.every((l) => seen.includes(l.id))) {
      state.stirlingSeen = seen.filter((id) => !sel.pool.some((l) => l.id === id));
    }
  },

  afterResolve(state, result, cardCtx) {
    if (state.tutorial) return;
    const ev = cardCtx.ev as GameEvent | null;
    if (!ev) return;
    state.stirlingCool = Math.max(0, (state.stirlingCool || 0) - 1);
    const tier = cardCtx.tier as string | undefined;
    const effects = tier && tier !== 'declined' && cardCtx.choice
      ? (cardCtx.choice.outcomes as any)?.[tier]?.effects : null;
    const say = (pool: BarkDef[]) => {
      const l = pickBark(state, pool, cardCtx.rng);
      if (l) result.overlayNote = { html: `🎙️ ${l.text}`, cls: 'note-stirling' };
      return !!l;
    };

    // ── Guaranteed beats (authored, high-priority, no cooldown) ──
    if (effects?.casaReturn) {
      say(state.pendingChainId === 'li_casa_betrayed' ? BEAT_REACT.casa_betrayed : BEAT_REACT.casa_held);
      return;
    }
    if (effects?.stealRoll) {
      say(state.partner ? BEAT_REACT.steal_survived : BEAT_REACT.steal_lost);
      return;
    }
    // A secret was surfaced this card — compared against the characters
    // plugin's MONOTONIC surface counter (the held list itself can shrink
    // when a Partner changes, which must not eat a later surface's bark).
    const surfaced = state.secretSurfacedCount || 0;
    if (surfaced > (state.stirlingSecretSeen || 0)) {
      state.stirlingSecretSeen = surfaced;
      say(BEAT_REACT.secret);
      return;
    }
    if (ev.id === 'li_enc_rival_3_pact') { say(BEAT_REACT.enc_pact); return; }
    if (ev.id === 'li_enc_rival_3_war') { say(BEAT_REACT.enc_war); return; }
    if (ev.id === 'li_wobble_50' || ev.id === 'li_wobble_75') { say(BEAT_REACT.wobble); return; }
    if (ev.id === 'li_wobble_break') { say(BEAT_REACT.wobble_break); return; }
    const beat = (ev.tags || []).find((t) => t.startsWith('beat:'));
    if ((beat === 'beat:bomb1' || beat === 'beat:bomb2') && ev.id !== 'li_bomb2_steal') {
      say(BEAT_REACT.bombshell);
      return;
    }

    // ── Opportunistic reactions (templated, tier × tags, rate-limited) ──
    if ((state.stirlingCool || 0) > 0) return;
    if (tier !== 'incredible' && tier !== 'bad') return;
    const tags = cardCtx.choice?.tags || [];
    const tagKey = Object.keys(REACT_TAGGED).find((k) => tags.includes(k));
    const tagged = tagKey ? REACT_TAGGED[tagKey][tier as 'incredible' | 'bad'] || [] : [];
    // Tag-matched lines outrank the generic pool while any are unheard.
    const pool = [...tagged.map((l) => ({ ...l, priority: 1 })),
      ...(tier === 'incredible' ? REACT_INCREDIBLE : REACT_BAD)];
    if (say(pool)) state.stirlingCool = OPPORTUNISTIC_COOLDOWN;
  },
};
