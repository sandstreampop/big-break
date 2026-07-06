// The Couple-Web — a scripted-first drama manager (ADR-0013). The villa's
// other couples get lives: authored THREADS (each thread IS one NPC couple's
// storyline) surface as witness / gossip / consequence cards, at most TWO
// foregrounded at a time (the working-memory ceiling — Miller's 7±2 is total
// load, shared with your couple, the Rival, the factions). NOT autonomous
// agents: every NPC move is an authored beat; state decides WHICH beats
// surface and WHEN, the Reigns "bag" decides how loudly — a lit thread's
// current-stage cards bloat the deck (weightDeck ×THREAD_MULT), everything
// else about the thread stays out of the pool entirely (threadStageIs), and
// a RESOLVED thread's cards are removed for good, so a long deck never silts
// up.
//
// The web's cast: three fixed NPC couples (Marco+Sophia · Dev+Tash ·
// Kai+Chloe — six islanders, bombshells push the tracked set toward eight)
// plus the dynamic seats ({rival}, {mate}) for the feud thread. Fixed casting
// keeps the beats AUTHORED (coherence axis) — a thread whose islander the
// player couples with simply goes dark (guard below): you can't watch a
// triangle you're a corner of.
//
// Witness, don't steer: the player's choices set influence flags that select
// RESOLUTION VARIANTS (autonomy axis) — they never command the couple. A
// thread that reaches the end of its window unresolved resolves OFFSCREEN
// (quiet default outcome), so no storyline dangles into the Final (pacing +
// dramatic-arc axes); the weekly recap reports it, because the world moved
// whether you watched or not.
//
// This plugin also owns THE STORY (`state.story`) — the couple-web's ledger
// of the player couple's own arc (survived ruptures, redemptions,
// tested-and-came-backs). It's the Win-the-Villa story gate (manifest
// winGates.winvilla.story, read via gateValue). Beats are AUTHORED
// (`storyBeat: '<why>'` on the card that earns it) wherever possible; the two
// automatic milestones below fire on unmistakable structural events, so the
// cause is always traceable (the legible-cause contract).

import { moveFactionSpread, type FactionKey } from './factions.js';
import type { Plugin, RunState } from '../../../types.js';

// ---------- Balance knobs (the couple-web's own numbers) ----------
export const COUPLEWEB = {
  threadMult: 4,      // deck-weight bloat on a lit thread's current-stage cards
  heatCap: 12,        // the bloat's ceiling as a thread heats (doubles per week lit)
  arcMult: 6,         // the player's own arcs (ick, repair) ride the bag too
  maxLit: 2,          // foreground ceiling (hard rule — the cognitive-load cap)
  storyGate: 2,       // mirrors manifest winGates.winvilla.story
};

// ---------- The authored threads ----------
// `stages` = how many beats BEFORE the resolution stage (cards advance via
// threadBeat; resolution cards live at stage === stages). `window` = the
// weeks it may light (inclusive); `cascadeOnly` threads light via the
// threadLight verb, never the scheduler. Order = lighting priority.
export interface ThreadDef {
  id: string;
  cast: string[];             // fixed cast ids the guard watches (may be empty)
  window: [number, number];
  stages: number;
  cascadeOnly?: boolean;
  offscreen: string;          // the quiet default outcome when time runs out
}

// Every thread runs ONE on-screen beat (drawn from that thread's beat
// VARIANTS — different runs see a different scene) and then its resolution.
// The season's free deck slots are scarce (tentpoles, chains and the Casa
// week own most draws), so a longer authored arc mostly dies offscreen —
// measured, not guessed: at 2 beats + resolution only ~10% of threads ended
// on camera; at 1 + 1 the drama lands inside its window.
export const THREADS: ThreadDef[] = [
  // Marco (villain with a skincare routine) & Sophia (brand deal in human
  // form), with Amber (main character, self-cast) as the third corner — the
  // showmance with a wandering eye. The season's loudest B-plot. All three
  // are guarded: you can't watch a triangle any corner of which you married.
  { id: 'triangle', cast: ['marco', 'sophia', 'amber'], window: [2, 4], stages: 1, offscreen: 'quiet' },
  // Dev (nicest man in any postcode) & Tash (everyone's type on paper) —
  // the achingly slow real one. The quiet favourite.
  { id: 'slowburn', cast: ['dev', 'tash'], window: [2, 5], stages: 1, offscreen: 'parked' },
  // Kai (golden-retriever scaffolder) & Chloe (savage in gel nails) — a
  // sweetheart lovebombing a game-player who is banking it.
  { id: 'lovebomb', cast: ['kai', 'chloe'], window: [3, 5], stages: 1, offscreen: 'wobbles' },
  // {rival} vs {mate} — the cross-couple cold war. Dynamic seats, so it can
  // always light; deliberately LAST in priority.
  { id: 'feud', cast: [], window: [4, 5], stages: 1, offscreen: 'simmer' },
  // The cascade: Sophia, scorched by the triangle, rebounds AT your couple.
  // Lights only when the triangle resolves loudly — the domino the charter
  // asked for, one card at a time.
  { id: 'scorched', cast: ['sophia'], window: [3, 5], stages: 1, cascadeOnly: true, offscreen: 'exit' },
];
const threadDef = (id: string) => THREADS.find((t) => t.id === id) || null;

// ---------- State reads (shared with the presenter/clarity layer) ----------

export interface ThreadState { lit: boolean; stage: number; resolved: string | null; litWeek?: number }
export function threadState(state: RunState, id: string): ThreadState {
  return state.threads?.[id] || { lit: false, stage: 0, resolved: null };
}
// A thread is DEAD when the player's own love life has swallowed its cast —
// you can't witness a storyline you're inside. Exes are fine (they moved on;
// so does the plot).
export function threadBroken(state: RunState, id: string): boolean {
  const def = threadDef(id);
  return !!def && def.cast.includes(state.partner || '');
}
export function litThreads(state: RunState): string[] {
  return THREADS.filter((t) => threadState(state, t.id).lit && !threadState(state, t.id).resolved &&
    !threadBroken(state, t.id)).map((t) => t.id);
}

const note = (pctx: any, cls: string, html: string) => {
  const d = pctx?.deltas;
  if (d) (d.notices = d.notices || []).push({ cls, html });
};

// Bank a beat of the player couple's own arc. Exported for tests; cards
// reach it through the storyBeat verb.
export function addStory(state: RunState, why: string, pctx?: any) {
  state.story = (state.story || 0) + 1;
  note(pctx, 'notice-encore', `📖 <b>That’s a storyline now.</b> ${why} The nation keeps a ledger of these. (${state.story}${state.path === 'winvilla' ? `/${COUPLEWEB.storyGate}` : ''})`);
}

function light(state: RunState, id: string, week: number) {
  const t = (state.threads[id] = state.threads[id] || { lit: false, stage: 0, resolved: null });
  if (t.lit || t.resolved) return;
  t.lit = true;
  t.litWeek = week;
}

function resolve(state: RunState, id: string, outcome: string, pctx?: any) {
  const t = (state.threads[id] = state.threads[id] || { lit: false, stage: 0, resolved: null });
  if (t.resolved) return;
  t.resolved = outcome;
  t.lit = false;
  const flag = `li_web_${id}_${outcome}`;
  if (!state.flags.includes(flag)) state.flags.push(flag);
}

// The faction payoffs a thread's ENDING throws off — the nation watches the
// other couples too. Applied on resolution (authored outcomes may pay more
// on top; offscreen resolutions pay nothing — nobody filmed it).
const RESOLUTION_SPREAD: Record<string, Partial<Record<FactionKey, number>>> = {
  'triangle:showdown': { drama: 5, selfrespect: 3 },
  'triangle:quiet': { romantics: 2, drama: -1 },
  'slowburn:together': { romantics: 5 },
  'slowburn:parked': { drama: 1 },
  'lovebomb:wakes': { selfrespect: 4 },
  'lovebomb:doubles': { drama: 4, romantics: -1 },
  'feud:peace': { romantics: 2, selfrespect: 2 },
  'feud:coldwar': { drama: 4 },
  'scorched:loud': { drama: 5, romantics: -2 },
  'scorched:grace': { selfrespect: 5, romantics: 2 },
};

export const coupleWebPlugin: Plugin = {
  id: 'coupleweb',
  effectVerbs: ['threadBeat', 'threadResolve', 'threadLight', 'storyBeat'],
  stateDefaults: {
    threads: {},        // thread id → { lit, stage, resolved, litWeek }
    story: 0,           // the player couple's own arc (the WtV story gate)
    webRedeemed: false, // the automatic redemption milestone fired
  },

  // Fresh thread ledger per run: newRun copies stateDefaults ARRAYS but
  // shares object references, so the map must be re-minted here or one run's
  // resolved threads would leak into the next (sim corpora play thousands).
  onRunStart(state) {
    state.threads = {};
  },

  requires: {
    // The bag's eligibility gate: a thread card exists in the pool ONLY at
    // its exact stage of a lit, unbroken thread. Arg 'triangle:1'; the
    // resolution stage is def.stages. Dormant, resolved, or broken → the
    // card is simply not in the deck.
    threadStageIs: (s, arg) => {
      const [id, stageStr] = String(arg).split(':');
      const t = threadState(s, id);
      return t.lit && !t.resolved && !threadBroken(s, id) && t.stage === Number(stageStr);
    },
    // Callback gate: how a thread ENDED ('triangle:showdown'; 'triangle:*'
    // matches any on-screen ending — offscreen endings don't count, nobody
    // saw them).
    threadOutcomeIs: (s, arg) => {
      const [id, want] = String(arg).split(':');
      const r = threadState(s, id).resolved;
      if (!r || r.startsWith('off_')) return false;
      return want === '*' || r === want;
    },
  },

  onEffect(state, effects, pctx) {
    const e = effects as any;
    if (e.threadBeat) {
      const t = (state.threads[e.threadBeat] = state.threads[e.threadBeat] || { lit: false, stage: 0, resolved: null });
      if (t.lit && !t.resolved) t.stage += 1;
    }
    if (e.threadResolve) {
      const [id, outcome] = String(e.threadResolve).split(':');
      if (id && outcome && !threadState(state, id).resolved) {
        resolve(state, id, outcome, pctx);
        moveFactionSpread(state, RESOLUTION_SPREAD[`${id}:${outcome}`] || {}, pctx);
      }
    }
    if (e.threadLight) {
      // A cascade: lights immediately if a foreground slot is free, else
      // arms itself for the next week turn (the scheduler below prefers it).
      const def = threadDef(e.threadLight);
      if (def && !threadState(state, e.threadLight).resolved && !threadBroken(state, e.threadLight)) {
        if (litThreads(state).length < COUPLEWEB.maxLit) light(state, e.threadLight, state.act);
        else (state.threads[e.threadLight] = state.threads[e.threadLight] || { lit: false, stage: 0, resolved: null }).pending = true;
      }
    }
    if (e.storyBeat) addStory(state, e.storyBeat, pctx);

    // The two AUTOMATIC story milestones — unmistakable structural events
    // (all other story beats are authored on cards via storyBeat). This
    // plugin registers after coupling, so the partner/flags it reads are
    // already resolved for THIS card:
    //  · redemption: you were betrayed at Casa (or left standing at a
    //    ceremony) and coupled up again anyway — jilted, then found something.
    //  · the public test: a bombshell steal came for your couple and it held.
    if ((e.couple || e.switchPartner) && !state.webRedeemed && state.partner &&
        (state.flags.includes('li_betrayed') || state.flags.includes('li_stranded'))) {
      state.webRedeemed = true;
      addStory(state, 'Jilted on national television — and back on the horse.', pctx);
    }
    if (e.stealRoll && state.partner) {
      addStory(state, 'A bombshell came for your couple, live, and it held.', pctx);
    }
  },

  // The scheduler: at each week turn, close out overdue threads (offscreen —
  // the world moves whether you watched or not), then light up to the
  // foreground cap: armed cascades first, then authored priority order.
  // No RNG — the schedule is a pure function of play state.
  onActBreak(state, week, _notes) {
    if (state.tutorial) return;
    state.threads = state.threads || {};
    for (const def of THREADS) {
      const t = threadState(state, def.id);
      if (t.lit && !t.resolved && week > def.window[1]) {
        resolve(state, def.id, `off_${def.offscreen}`);
      }
    }
    const litNow = () => litThreads(state).length;
    for (const def of THREADS) {
      if (litNow() >= COUPLEWEB.maxLit) break;
      const t = threadState(state, def.id);
      if (t.resolved || t.lit || threadBroken(state, def.id)) continue;
      const inWindow = week >= def.window[0] && week <= def.window[1];
      if ((t as any).pending && inWindow) { light(state, def.id, week); continue; }
      if (def.cascadeOnly) continue;
      if (inWindow) light(state, def.id, week);
    }
  },

  // The bag: a lit thread's cards draw heavy, and a thread that's been
  // heating for weeks bloats the deck harder (×2 per week lit, capped) —
  // the villa gets louder about what it's obsessed with until it pays off.
  // The player's own arcs (the ick, a live repair) ride the same bag: your
  // rupture is a foreground thread too.
  weightDeck(state, ev, weight) {
    const tags = ev.tags || [];
    const webTag = tags.find((t) => t.startsWith('web:'));
    if (webTag) {
      const id = webTag.slice(4);
      const t = threadState(state, id);
      if (!t.lit || t.resolved) return weight;
      const heat = Math.max(0, (state.act || 1) - (t.litWeek || state.act || 1));
      return weight * Math.min(COUPLEWEB.heatCap, COUPLEWEB.threadMult * Math.pow(2, heat));
    }
    if (tags.includes('ick') || tags.includes('repair')) return weight * COUPLEWEB.arcMult;
    return weight;
  },

};
