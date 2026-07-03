// BIG BREAK — game engine (spec §4, §7, §8.4). Pure logic, no DOM:
// the same module runs in the browser and in tools/simulate.mjs.

import { CONFIG } from './config.js';
import { collabArtistFor, songName } from './charts.js';
import type { Pack, RunState, Song } from './types.js';

// ---------- Injected content pack (Phase 2: IoC) ----------
// The engine imports NO content module. All music-specific content arrives as
// a Pack, set at run start (newRun) and re-affirmed at boot/resume via
// useContentPack. One game session runs one active pack; a second game is a
// second Pack against this same engine. Everything below reads PACK.* where it
// used to import PACK.events / instruments / venues / arcs / weather / etc.
let PACK: Pack;
export function useContentPack(pack: Pack): void {
  PACK = pack;
}
export function activePack(): Pack {
  return PACK;
}

// Tutorial cards live outside PACK.events so they can never enter normal decks;
// chains and resume still need to find them by id.
function findEvent(id) {
  return PACK.events.find((e) => e.id === id) || PACK.tutorialEvents.find((e) => e.id === id) || null;
}

function contractMods(state): Record<string, any> {
  return PACK.contractById(state.contract)?.mods || {};
}

// Act length can be shortened by a contract (Overnight Success) or bent
// by this run's act twist (U5: the tour got cut short / extended)
export function actLength(state, act) {
  if (state.tutorial) return PACK.tutorialEvents.length;
  const base = contractMods(state).actLengths?.[act] ?? CONFIG.actLengths[act];
  const twist = state.actTwist && state.actTwist.act === act ? state.actTwist.delta : 0;
  return Math.max(3, base + twist);
}

// The core stat list is genre taxonomy — read from the injected pack manifest
// (Phase 3.1), not hardwired. Order is load-bearing (it fixes the order stat
// deltas are recorded), so a pack must keep it stable.
const stats = () => PACK.manifest.stats;

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ---------- Seeded, resume-safe RNG ----------
// Every run carries a seed + draw counter, so a run replays identically
// after a tab death, and Daily Grind runs are identical for everyone.

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rngCache = new WeakMap();
export function stateRng(state) {
  if (!state.seed) { // legacy saves: fall back to Math.random
    return Math.random;
  }
  return () => {
    let c = rngCache.get(state);
    if (!c || c.uses !== (state.rngUses || 0) || c.seed !== state.seed) {
      const gen = mulberry32(state.seed);
      for (let i = 0; i < (state.rngUses || 0); i++) gen();
      c = { gen, uses: state.rngUses || 0, seed: state.seed };
      rngCache.set(state, c);
    }
    c.uses += 1;
    state.rngUses = c.uses;
    return c.gen();
  };
}
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// Read a gate key's value generically, without special-casing 'fame'/'hits'
// (Phase 3.3): core stats live in state.stats, resources live top-level. Any
// pack's winGates/requires keys resolve through here, so a genre without
// "fame" doesn't trip a hardcoded branch.
export function gateValue(state, key): number {
  return (key in state.stats) ? state.stats[key] : (state[key] ?? 0);
}

// Per-resource apply logic (Phase 3.2). applyEffects iterates these in
// manifest.resources order so deltas — and the RNG-consuming songs block —
// stay exactly where they were. Each resource keeps its OWN arithmetic (no
// forced single formula): fame clamps at 0 and honors fameSwing on any sign;
// money siphons on gains and may go negative; rivalry clamps 0–10 off a
// default of 3; pathProgress is a raw add. Returns the delta to record (0 =
// nothing recorded). 'hits' is the songs subsystem — applied inline in
// applyEffects and extracted in Phase 4.5, so it has no handler here.
type ResourceCtx = { hooks: Record<string, any>; cMods: Record<string, any>; wHooks: Record<string, any>; accs: any[] };
const RESOURCE_APPLY: Record<string, (state: any, v: number, ctx: ResourceCtx) => number> = {
  fame(state, v, { hooks, cMods, wHooks }) {
    if (v && hooks.fameSwingMult) v = Math.round(v * hooks.fameSwingMult);
    if (v > 0 && cMods.fameGainMult) v = Math.round(v * cMods.fameGainMult);
    if (v > 0 && wHooks.fameGainMult) v = Math.round(v * wHooks.fameGainMult);
    if (!v) return 0;
    const before = state.fame;
    state.fame = Math.max(0, state.fame + v);
    return state.fame - before;
  },
  money(state, v, { hooks, cMods, wHooks, accs }) {
    if (v > 0) {
      if (hooks.moneyGainMult) v = Math.round(v * hooks.moneyGainMult);
      if (wHooks.moneyGainMult) v = Math.round(v * wHooks.moneyGainMult);
      if (cMods.moneyGainMult) v = Math.round(v * cMods.moneyGainMult);
      for (const acc of accs) {
        if (acc.moneySiphon) v = Math.round(v * (1 - acc.moneySiphon));
      }
    }
    if (!v) return 0;
    state.money += v;
    return v;
  },
  pathProgress(state, v) {
    if (!v) return 0;
    state.pathProgress += v;
    return v;
  },
  rivalry(state, v) {
    if (!v) return 0;
    const before = state.rivalry ?? 3;
    state.rivalry = clamp(before + v, 0, 10);
    return state.rivalry - before;
  },
};

// ---------- Run lifecycle ----------

export function offerInstruments(unlockedInstrumentIds, rng = Math.random) {
  const pool = PACK.instruments.filter((i) => unlockedInstrumentIds.includes(i.id));
  const picks = [];
  const bag = [...pool];
  while (picks.length < 3 && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}

export function newRun(pack: Pack, instrumentId, unlockedPacks, rng = Math.random, perks = []) {
  PACK = pack; // this run's content pack; also settable via useContentPack
  const inst = PACK.instrumentById(instrumentId);
  const state: RunState = {
    version: 1,
    phase: 'card', // card | crossroads | ended
    act: 1,
    cardsPlayedInAct: 0,
    shopPlayedInAct: false,
    stats: {
      skill: randInt(rng, CONFIG.statStartMin, CONFIG.statStartMax),
      cred: randInt(rng, CONFIG.statStartMin, CONFIG.statStartMax),
      creativity: randInt(rng, CONFIG.statStartMin, CONFIG.statStartMax),
      network: randInt(rng, CONFIG.statStartMin, CONFIG.statStartMax),
      burnout: CONFIG.burnoutStart,
    },
    fame: 0,
    money: CONFIG.moneyStart,
    hits: 0,
    pathProgress: 0,
    badStreak: 0,
    encore: 0,
    encoreChained: false,
    copingSeen: [],
    chartSeed: Math.floor(rng() * 1e9) + 1,
    chartTitles: [],
    seed: null,     // play RNG seed (set by caller; null = legacy Math.random)
    rngUses: 0,
    daily: null,    // 'YYYY-MM-DD' when this is a Daily Grind run
    gauntlet: null, // 'YYYY-Www' when this is a weekly Gauntlet run
    tierLog: [],
    cardLog: [],    // [{e: eventId, t: tier, a: act, s: side}] — scrapbook
    contract: null, // signed contract id (see data/contracts.js)
    genre: null,    // sound identity (see data/genres.js)
    venue: null,    // adopted home venue (see data/venues.js)
    venueLevel: 0,
    venueShows: 0,
    band: [],       // recruited bandmates (see data/band.js), max 3
    promises: [],   // short-horizon objectives [{label,tags,remaining,reward,penalty}]
    hustles: [],    // persistent income sources (see data/hustles.js)
    rival: PACK.randomRival(rng).id,
    rivalry: 3, // 0 = allies, 10 = blood feud; starts ambiguous
    // Story Seeds (R1): this run secretly roots for these arcs — their
    // setup cards get a guaranteed window, their payoffs draw hot.
    seeds: PACK.rollSeeds(rng, CONFIG.seedCount),
    seenCards: null, // per-player seen-card ids (set by the UI from meta)
    // Rush: ~25% of runs schedule one flashpoint card (U2); ~20% of runs
    // have one act play short or long (U5); hot streaks tracked live (U3)
    flashpointAt: rng() < CONFIG.flashpointChance
      ? randInt(rng, CONFIG.flashpointWindow[0], CONFIG.flashpointWindow[1]) : null,
    flashpointSeen: false,
    hotStreak: 0,
    actTwist: rng() < CONFIG.actTwistChance
      ? { act: randInt(rng, 2, 3), delta: rng() < 0.5 ? -CONFIG.actTwistDelta : CONFIG.actTwistDelta }
      : null,
    // Scene Weather (M2): one visible modifier recolors the whole run
    weather: PACK.rollWeather(rng),
    path: null,
    instrument: instrumentId,
    firstInstrument: instrumentId,
    accessories: [],
    flags: [],
    usedEvents: [],
    unlockedPacks: unlockedPacks || [],
    currentEventId: null,
    pendingChainId: null,
    ending: null, // { key, result } once ended
  };
  if (inst) {
    for (const [k, v] of Object.entries(inst.modifiers || {})) {
      if (k in state.stats) state.stats[k] = clamp(state.stats[k] + v, 1, 100);
    }
  }
  // Career Wall perks: always-on run-start bonuses
  state.perks = perks;
  if (perks.includes('savings')) state.money += 120;
  if (perks.includes('demo') && !state.flags.includes('demo_in_pocket')) state.flags.push('demo_in_pocket');
  if (perks.includes('calluses')) state.stats.skill = clamp(state.stats.skill + 6, 1, 100);
  if (perks.includes('couch')) state.stats.network = clamp(state.stats.network + 6, 1, 100);
  if (perks.includes('warmup')) state.encore = 1; // walk in with one banked
  if (perks.includes('perfect_pitch')) state.stats.creativity = clamp(state.stats.creativity + 6, 1, 100);
  if (perks.includes('stage_legs')) state.stats.cred = clamp(state.stats.cred + 6, 1, 100);
  if (perks.includes('headliner')) state.fame += 8; // somebody remembers the name
  state.money += PACK.weatherHooks(state).startMoney || 0; // Scene Weather walk-in
  if (perks.includes('notebook')) {
    // The Old Notebook: every career starts with one demo already taped
    addSong(state, {
      title: songName(rng), status: 'demo',
      quality: 46 + Math.floor(rng() * 16),
    });
    state.flags.push('notebook_demo'); // events/epilogue can reference it
  }
  return state;
}

// ---------- Songs (first-class citizens) ----------
// A song is written (demo), released (charting), climbs or fades. The Hot 10
// ticks at every act break and the finale: position comes from quality +
// hype + fame, hype decays, peaks are recorded, and cracking the top 3
// crowns the song — THAT is what the hits counter counts from now on.

export function ensureSongs(state) {
  if (!state.songs) state.songs = [];
  // migrate old saves: chart titles become charting songs
  if (!state.songs.length && (state.chartTitles || []).length) {
    for (const title of state.chartTitles) {
      state.songs.push({
        id: 'legacy_' + state.songs.length, title, quality: 58, hype: 40,
        status: 'charting', origin: null, act: state.act,
        pos: null, prevPos: null, peak: null, weeks: 0, crowned: false,
      });
    }
    positionAll(state);
  }
  return state.songs;
}

function positionSong(state, s, rng) {
  const power = s.quality * 0.45 + s.hype * 0.35 + Math.min(100, state.fame) * 0.25 + (rng() * 16 - 8);
  if (power >= 88) return 1;
  if (power < 30) return null;
  return Math.max(1, Math.min(10, Math.round(11 - power / 9)));
}

function positionAll(state) {
  const rng = stateRng(state);
  for (const s of state.songs) {
    if (s.status !== 'charting') continue;
    s.pos = positionSong(state, s, rng);
  }
}

export function addSong(state, { title, quality, origin = null, status = 'demo', hype = 0 }) {
  ensureSongs(state);
  const s: Song = {
    id: 'song_' + (state.songs.length + 1) + '_' + (state.rngUses || 0),
    title, quality: clamp(Math.round(quality), 1, 100), hype: clamp(Math.round(hype), 0, 100),
    status: status as Song['status'], origin, act: state.act,
    pos: null, prevPos: null, peak: null, weeks: 0, crowned: false,
  };
  state.songs.push(s);
  // keep the legacy list in sync (discography, older UI paths)
  state.chartTitles = state.chartTitles || [];
  if (!state.chartTitles.includes(title)) state.chartTitles.unshift(title);
  if (status === 'charting') debutSong(state, s);
  return s;
}

export function releaseSong(state, songId, hype = 55) {
  ensureSongs(state);
  const s = state.songs.find((x) => x.id === songId);
  if (!s || s.status === 'charting') return null;
  s.status = 'charting';
  // Scene Weather: some eras are kind to release day (Vinyl Revival…)
  s.hype = clamp(Math.round(hype + (PACK.weatherHooks(state).releaseHype || 0)), 0, 100);
  debutSong(state, s);
  return s;
}

function debutSong(state, s) {
  const rng = stateRng(state);
  s.releasedAct = state.act; // The Deadline contract audits this
  s.pos = positionSong(state, s, rng);
  // U4: the overnight-viral jackpot — 1 in 20 releases catches the wave.
  // Charts are the game's natural slot machine; this is the triple-7s.
  if (s.pos && !state.tutorial && rng() < CONFIG.viralChance) {
    s.viral = true;
    s.hype = clamp(s.hype + 30, 0, 100);
    s.pos = Math.max(1, s.pos - CONFIG.viralPosBoost);
  }
  if (s.pos) {
    s.weeks = 1;
    s.peak = s.pos;
    crownCheck(state, s);
  }
}

// The Deadline contract: a song must ship every act. Called at each act
// break (auditing the act that just ended) and once more at the finale.
export function deadlineAudit(state, act) {
  if (!contractMods(state).releaseDeadline) return [];
  const shipped = (state.songs || []).some((s) => s.releasedAct === act);
  if (shipped) return [`📠 The Deadline: act ${act} shipped. The label is quiet, which is love.`];
  state.fame = Math.max(0, state.fame - 8);
  state.stats.cred = clamp(state.stats.cred - 4, 0, 100);
  return [`📠 The Deadline: nothing shipped in act ${act}. The label notes the silence. −8 Fame, −4 Cred`];
}

function crownCheck(state, s, notes?) {
  if (s.pos && s.pos <= 3 && !s.crowned) {
    s.crowned = true;
    state.hits += 1;
    if (notes) notes.push(`♪ “${s.title}” cracks the top 3 — that’s a HIT`);
    return true;
  }
  return false;
}

// One chart week passes: act breaks and the finale call this. Returns notes
// (strings) and records the structured week on state.lastChartWeek so the
// act interstitial can stage it as a real moment (resume-safe: plain data).
export function chartTick(state) {
  ensureSongs(state);
  const rng = stateRng(state);
  const notes = [];
  const moves = [];
  for (const s of state.songs) {
    if (s.status !== 'charting') continue;
    s.prevPos = s.pos ?? null;
    s.pos = positionSong(state, s, rng);
    if (s.pos) {
      s.weeks += 1;
      if (s.peak == null || s.pos < s.peak) s.peak = s.pos;
      if (crownCheck(state, s, notes)) {
        moves.push({ title: s.title, kind: 'crown', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else if (!s.prevPos) {
        notes.push(`♪ “${s.title}” debuts at #${s.pos}`);
        moves.push({ title: s.title, kind: 'debut', from: null, to: s.pos, weeks: s.weeks });
      } else if (s.pos < s.prevPos) {
        notes.push(`♪ “${s.title}” climbs to #${s.pos}`);
        moves.push({ title: s.title, kind: 'climb', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else if (s.pos > s.prevPos) {
        notes.push(`♪ “${s.title}” slips to #${s.pos}`);
        moves.push({ title: s.title, kind: 'slip', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else {
        moves.push({ title: s.title, kind: 'hold', from: s.prevPos, to: s.pos, weeks: s.weeks });
      }
    } else {
      if (s.prevPos) {
        notes.push(`♪ “${s.title}” drops off the Hot 10 after ${s.weeks} week${s.weeks === 1 ? '' : 's'}`);
        moves.push({ title: s.title, kind: 'drop', from: s.prevPos, to: null, weeks: s.weeks });
      }
      s.status = 'faded';
    }
    s.hype = Math.round(s.hype * 0.55);
  }
  // The chart war: your best song vs the rival's single, same ten slots
  const best = state.songs.filter((s) => s.status === 'charting' && s.pos)
    .sort((a, b) => a.pos - b.pos)[0];
  if (best) {
    const rp = rivalChartPos(state);
    if (best.pos < rp && !state.flags.includes('chart_passed_rival')) {
      state.flags.push('chart_passed_rival');
      notes.push(`♪ “${best.title}” passes your rival on the chart. First blood.`);
      moves.push({ title: best.title, kind: 'rivalPassed', from: rp, to: best.pos, weeks: best.weeks });
    } else if (Math.abs(best.pos - rp) === 1) {
      moves.push({ title: best.title, kind: 'rivalNeck', from: rp, to: best.pos, weeks: best.weeks });
    }
  }
  state.lastChartWeek = moves.length ? { act: state.act, moves } : null;
  return notes;
}

// Where the rival's single sits on the Hot 10 (shared with charts.js so the
// rendered chart and the chart-war logic never disagree): they start high
// and sink as your fame grows — but a hot rivalry keeps them sharp.
export function rivalChartPos(state) {
  return Math.max(1, Math.min(10,
    9 - Math.floor(state.fame / 22) - Math.floor((state.rivalry ?? 3) / 3)));
}

// The song most worth talking about right now (for {song} templating)
export function flagshipSong(state) {
  ensureSongs(state);
  const charting = state.songs.filter((s) => s.status === 'charting' && s.pos);
  if (charting.length) return charting.sort((a, b) => a.pos - b.pos)[0];
  const demos = state.songs.filter((s) => s.status === 'demo');
  if (demos.length) return demos[demos.length - 1];
  return state.songs[state.songs.length - 1] || null;
}

// The First Gig: a scripted 9-card onboarding run. Fixed teaching stats so
// every risk tell reads exactly as the cards describe it (skill ●,
// network ●, cred ▲, creativity ■); the deck is one long chain.
export function newTutorialRun(pack: Pack, rng = Math.random) {
  const state = newRun(pack, 'melodica', [], rng, []);
  state.tutorial = true;
  state.stats = { skill: 40, cred: 30, creativity: 8, network: 35, burnout: 5 };
  state.money = 40;
  state.fame = 0;
  state.pendingChainId = PACK.tutorialEvents[0].id;
  return state;
}

// Comeback Mode (unlocked by any Success): start as a faded name.
// Fame and contacts arrive pre-loaded; cred and burnout arrive bruised.
export function applyComeback(state) {
  state.fame = 45;
  state.money = 300;
  state.stats.cred = Math.max(8, state.stats.cred - 8);
  state.stats.network = clamp(state.stats.network + 15, 1, 100);
  state.stats.burnout = 25;
  if (!state.flags.includes('comeback')) state.flags.push('comeback');
}

// Instrument mastery (earned across runs): +level to every core stat
export function applyMastery(state, level) {
  const lv = Math.max(0, Math.min(3, level | 0));
  if (!lv) return;
  state.mastery = lv;
  for (const k of stats()) state.stats[k] = clamp(state.stats[k] + lv, 1, 100);
}

export function signContract(state, contractId) {
  state.contract = contractId;
  const mods = contractMods(state);
  if (mods.startMoney !== undefined) state.money = mods.startMoney;
  // e.g. The Handshake Loan: walk in flush, walk in owing (debt fail-state armed)
  if (mods.startFlag && !state.flags.includes(mods.startFlag)) state.flags.push(mods.startFlag);
}

// ---------- Deck assembly (spec §8.4) ----------

function actMatches(ev, act) {
  return Array.isArray(ev.act) ? ev.act.includes(act) : ev.act === act;
}

function meetsRequires(ev, state) {
  return requiresOk(ev.requires, state);
}

function requiresOk(r, state) {
  if (!r) return true;
  // anyOf: alternative gates — the card fires if ANY branch is satisfied
  // (e.g. nemesis_soundcheck accepts a cross-run nemesis OR an in-run feud)
  if (r.anyOf && !r.anyOf.some((alt) => requiresOk(alt, state))) return false;
  if (r.nemesis && !state.nemesis) return false;
  if (r.weatherIs && state.weather !== r.weatherIs) return false;
  if (r.flagsAll && !r.flagsAll.every((f) => state.flags.includes(f))) return false;
  if (r.flagsNone && r.flagsNone.some((f) => state.flags.includes(f))) return false;
  if (r.moneyMax !== undefined && state.money > r.moneyMax) return false;
  if (r.moneyMin !== undefined && state.money < r.moneyMin) return false;
  if (r.burnoutMin !== undefined && state.stats.burnout < r.burnoutMin) return false;
  if (r.fameMin !== undefined && state.fame < r.fameMin) return false;
  if (r.fameMax !== undefined && state.fame > r.fameMax) return false;
  if (r.gear && !r.gear.every((g) => state.accessories.includes(g))) return false;
  if (r.rivalryMin !== undefined && (state.rivalry ?? 0) < r.rivalryMin) return false;
  if (r.rivalryMax !== undefined && (state.rivalry ?? 0) > r.rivalryMax) return false;
  if (r.genreAny && !state.genre) return false;
  if (r.venueAny && !state.venue) return false;
  if (r.venueLevelMin !== undefined && (!state.venue || (state.venueLevel || 0) < r.venueLevelMin)) return false;
  if (r.venueIs && state.venue !== r.venueIs) return false;
  if (r.rivalIs && state.rival !== r.rivalIs) return false;
  if (r.venueNone && state.venue) return false;
  if (r.hustleMin !== undefined && (state.hustles || []).length < r.hustleMin) return false;
  if (r.bandMin !== undefined && (state.band || []).length < r.bandMin) return false;
  if (r.bandMax !== undefined && (state.band || []).length > r.bandMax) return false;
  if (r.bandHas && !(state.band || []).includes(r.bandHas)) return false;
  if (r.demoMin !== undefined && (state.songs || []).filter((s) => s.status === 'demo').length < r.demoMin) return false;
  if (r.chartingMin !== undefined && (state.songs || []).filter((s) => s.status === 'charting' && s.pos).length < r.chartingMin) return false;
  if (r.songsMin !== undefined && (state.songs || []).length < r.songsMin) return false;
  if (r.fadedMin !== undefined && (state.songs || []).filter((s) => s.status === 'faded' && s.peak).length < r.fadedMin) return false;
  if (r.stats) {
    for (const [key, val] of Object.entries(r.stats)) {
      const stat = key.replace(/Min$/, '');
      const cur = gateValue(state, stat);
      if (cur < (val as number)) return false;
    }
  }
  return true;
}

// Is a story arc's condition satisfied for this run? (sim + UI reporting)
export function arcLit(state, arcId) {
  const arc = PACK.arcById(arcId);
  return !!arc && requiresOk(arc.lit, state);
}

function pathEligible(ev, state) {
  if (!ev.pathAffinity || ev.pathAffinity.length === 0) return true;
  if (state.act === 1) return false; // path cards never appear pre-commit
  return ev.pathAffinity.includes(state.path);
}

export function eligibleEvents(state) {
  return PACK.events.filter(
    (ev) =>
      !ev.chainOnly &&
      actMatches(ev, state.act) &&
      !state.usedEvents.includes(ev.id) &&
      (!ev.pack || state.unlockedPacks.includes(ev.pack)) &&
      pathEligible(ev, state) &&
      meetsRequires(ev, state)
  );
}

export function drawNextCard(state, rng = Math.random) {
  // Resuming a saved run mid-card: re-deal the same card
  if (state.currentEventId) {
    const ev = findEvent(state.currentEventId);
    if (ev) return ev;
    state.currentEventId = null;
  }
  if (state.pendingChainId) {
    const ev = findEvent(state.pendingChainId);
    state.pendingChainId = null;
    if (ev) {
      state.currentEventId = ev.id;
      return ev;
    }
  }
  let pool = eligibleEvents(state).filter((e) => !e.finaleCard); // climax is queued by advance()
  if (!pool.length) return null; // act runs dry -> caller advances act
  // Flashpoints (U2) live outside the normal deck: max one per run, only
  // in runs that scheduled one, dealt when the window opens — or summoned
  // early by a hot streak (U3). Unique frame + sting; the story you retell.
  const streakHot = !state.tutorial && (state.hotStreak || 0) >= CONFIG.hotStreakAt;
  const flashDue = state.flashpointAt != null && !state.flashpointSeen &&
    ((state.cardLog || []).length >= state.flashpointAt || streakHot);
  const flashes = flashDue ? pool.filter((e) => e.flashpoint) : [];
  pool = pool.filter((e) => !e.flashpoint);
  if (!pool.length && !flashes.length) return null;
  if (flashes.length) {
    pool = flashes;
  } else {
    // Guarantee an opportunity/shop card once per act (spec §8.4.4)
    const shopDue = state.cardsPlayedInAct >= CONFIG.shopSlot[state.act] && !state.shopPlayedInAct;
    if (shopDue) {
      const shops = pool.filter((e) => e.shop);
      if (shops.length) pool = shops;
    }
    // Story Seeds (R1): an unlit seeded arc gets its setup card dealt on
    // schedule — same mechanism as the shop slot. Acts 1–2 only (an arc
    // seeded in act 3 could never pay off).
    if (!shopDue && !state.tutorial && state.act <= 2 &&
        state.cardsPlayedInAct >= (CONFIG.seedSetupSlot[state.act] ?? 99)) {
      const due = [];
      for (const arcId of state.seeds || []) {
        const arc = PACK.arcById(arcId);
        if (!arc || requiresOk(arc.lit, state)) continue; // already lit
        if (arc.setup.some((id) => state.usedEvents.includes(id))) continue; // setup came & went
        due.push(...arc.setup);
      }
      if (due.length) {
        const setups = pool.filter((e) => due.includes(e.id));
        if (setups.length) pool = setups;
      }
    }
    // U3 spotlight: while ON A ROLL, the deck leans all the way into
    // what this player has never seen — streaks are for discovering.
    if (streakHot && !shopDue && state.seenCards) {
      const seenSet = new Set(state.seenCards);
      const unseen = pool.filter((e) => !seenSet.has(e.id));
      if (unseen.length) pool = unseen;
    }
  }
  // Lit seeded arcs: their payoff cards draw hot for the rest of the run.
  // Unlit ones: their setups draw warm even before the guaranteed slot.
  const litPayoffs = new Set();
  const warmSetups = new Set();
  for (const arcId of state.seeds || []) {
    const arc = PACK.arcById(arcId);
    if (!arc) continue;
    if (requiresOk(arc.lit, state)) for (const id of arc.payoffs) litPayoffs.add(id);
    else for (const id of arc.setup) warmSetups.add(id);
  }
  // Personal novelty (R2): cards THIS player has never seen draw heavier.
  // On a first install everything is unseen, so nothing shifts.
  const seen = state.seenCards ? new Set(state.seenCards) : null;
  // Scene Weather (M2): the mutator recolors the deck itself
  const wMults = PACK.weatherHooks(state).weightTagMult || [];
  let total = 0;
  const weights = pool.map((ev) => {
    const affine = ev.pathAffinity && ev.pathAffinity.includes(state.path);
    let w = (ev.weight || 1) *
      (affine ? CONFIG.pathWeightMult : 1) *
      (litPayoffs.has(ev.id) ? CONFIG.seedPayoffMult : 1) *
      (warmSetups.has(ev.id) ? CONFIG.seedSetupMult : 1) *
      (seen && !seen.has(ev.id) ? CONFIG.noveltyWeightMult : 1);
    for (const wm of wMults) {
      if (tagsIntersect(wm.tags, ev.tags || [])) w *= wm.mult;
    }
    total += w;
    return w;
  });
  let roll = rng() * total;
  let chosen = pool[pool.length - 1];
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) { chosen = pool[i]; break; }
  }
  state.currentEventId = chosen.id;
  return chosen;
}

// ---------- Resolution (spec §4.1) ----------

function equippedAccessories(state) {
  return state.accessories.map(PACK.accessoryById).filter(Boolean);
}

function accessoryActive(acc, state) {
  if (acc.compatibility?.universal) return true;
  const inst = PACK.instrumentById(state.instrument);
  return !!inst && (acc.compatibility?.families || []).includes(inst.family);
}

export function tagsIntersect(a, b) {
  return a && b && a.some((t) => b.includes(t));
}

// ---------- Plugin dispatch (Phase 4) ----------
// Fire a lifecycle hook across the active pack's plugins, in registration
// order. Empty/absent registry = no-op, so wiring a dispatch point in is
// byte-green until a plugin implements it.
function firePlugins(hook: string, ...args: any[]): void {
  const plugins = PACK.plugins;
  if (!plugins) return;
  for (const p of plugins) {
    const fn = (p as any)[hook];
    if (fn) fn.apply(p, args);
  }
}

// Roll components for a choice; used by both resolution and the risk tell.
// opts.encore adds the armed-Encore bonus so odds and rolls stay in sync.
export function rollComponents(state, choice, opts: any = {}) {
  const gs: Record<string, number> = choice.governingStats || {};
  let sum = 0, wsum = 0;
  for (const [stat, w] of Object.entries(gs)) {
    sum += (state.stats[stat] ?? 0) * w;
    wsum += w;
  }
  const aptitude = wsum ? sum / wsum : 30;

  let gearBonus = 0;
  const applied = []; // accessories whose modifier fired (for side effects)
  for (const acc of equippedAccessories(state)) {
    if (!accessoryActive(acc, state)) continue;
    if (acc.modifier && (acc.appliesTo?.includes('*') || tagsIntersect(acc.appliesTo, choice.tags))) {
      gearBonus += acc.modifier;
      applied.push(acc);
    }
    for (const ct of acc.counterTags || []) {
      if (tagsIntersect(ct.tags, choice.tags)) gearBonus += ct.modifier;
    }
  }

  const inst = PACK.instrumentById(state.instrument);
  let quirkBonus = 0;
  for (const tb of inst?.quirk?.hooks?.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }
  for (const gb of PACK.genreById(state.genre)?.bonuses || []) {
    if (tagsIntersect(gb.tags, choice.tags)) quirkBonus += gb.bonus;
  }
  for (const bid of state.band || []) {
    const bm = PACK.bandmateById(bid);
    if (bm && tagsIntersect(bm.bonus.tags, choice.tags)) quirkBonus += bm.bonus.bonus;
  }

  const wHooks = PACK.weatherHooks(state);
  for (const tb of wHooks.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }

  const burnoutPenalty = -(state.stats.burnout * CONFIG.burnoutCoeff);
  const pityPer = CONFIG.pityPerBad + ((state.perks || []).includes('thick_skin') ? 3 : 0);
  const pityBonus = Math.min((state.badStreak || 0) * pityPer, CONFIG.pityCap + ((state.perks || []).includes('thick_skin') ? 6 : 0));
  const cMods = contractMods(state);
  // Contract clauses can bend tag-matched rolls (Stage Fright, Analog Only…)
  for (const tb of cMods.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }
  const encoreBonus = opts.encore && !cMods.disableEncore ? CONFIG.encoreBonus : 0;
  // Performance bonus: a minigame result (UI-side skill) folded into the roll
  const perfBonus = opts.bonus || 0;
  let jitter = cMods.jitter || inst?.quirk?.hooks?.jitter ||
    CONFIG.jitterByAct?.[state.act] || [CONFIG.jitterMin, CONFIG.jitterMax];
  if (wHooks.jitterWiden) jitter = [jitter[0] - wHooks.jitterWiden, jitter[1] + wHooks.jitterWiden];
  const base = CONFIG.rollBase + aptitude * CONFIG.aptitudeScale +
    gearBonus + quirkBonus + burnoutPenalty + pityBonus + encoreBonus + perfBonus;
  return { aptitude, gearBonus, quirkBonus, burnoutPenalty, pityBonus, encoreBonus, perfBonus, base, jitter, appliedAccessories: applied };
}

// U1: rolls compress above the soft cap — a maxed-out build still sweats
// the jitter instead of auto-clearing the INCREDIBLE bar every card.
function softCap(roll) {
  return roll > CONFIG.rollSoftCap
    ? CONFIG.rollSoftCap + (roll - CONFIG.rollSoftCap) * 0.5
    : roll;
}

// Risk tell (spec §10): probability each tier fires, given uniform jitter.
export function choiceOdds(state, choice, opts: any = {}) {
  const c = rollComponents(state, choice, opts);
  const base = c.base;
  const [jMin, jMax] = c.jitter;
  const span = jMax - jMin + 1;
  let bad = 0, incredible = 0;
  for (let j = jMin; j <= jMax; j++) {
    const r = softCap(base + j);
    if (r < CONFIG.tierBadBelow) bad++;
    else if (r >= CONFIG.tierIncredibleAt) incredible++;
  }
  return { bad: bad / span, good: (span - bad - incredible) / span, incredible: incredible / span };
}

export function resolveSwipe(state, side, rng = Math.random, opts: any = {}) {
  const ev = findEvent(state.currentEventId);
  const choice = ev.choices[side];
  const useEncore = !!opts.encore && (state.encore || 0) > 0 && !contractMods(state).disableEncore;
  if (useEncore) state.encore -= 1;

  // Shop affordability: a declined card is comedy, not a roll (spec §8 shop note)
  if (choice.cost && state.money < choice.cost) {
    (state.tierLog = state.tierLog || []).push('declined');
    (state.cardLog = state.cardLog || []).push({ e: ev.id, t: 'declined', a: state.act, s: side });
    const result: any = {
      tier: 'declined',
      text: 'Your card declines with an audible, judgmental beep. You pretend you “forgot your other wallet.” Everyone pretends to believe you.',
      deltas: applyEffects(state, { cred: -2 }, ev, choice, rng),
      event: ev, side,
    };
    finishCard(state, ev);
    return result;
  }

  const c = rollComponents(state, choice, { encore: useEncore, bonus: opts.bonus || 0 });
  const jitter = randInt(rng, c.jitter[0], c.jitter[1]);
  const roll = softCap(c.base + jitter);
  let tier;
  if (roll < CONFIG.tierBadBelow) tier = 'bad';
  else if (roll >= CONFIG.tierIncredibleAt) tier = 'incredible';
  else tier = 'good';
  // Tutorial cards can script their outcome so each lesson lands
  // deterministically ('encoreUp': incredible only if the Encore was armed)
  const forced = ev.forceTier?.[side];
  if (forced) tier = forced === 'encoreUp' ? (useEncore ? 'incredible' : 'good') : forced;
  state.badStreak = tier === 'bad' ? (state.badStreak || 0) + 1 : 0;
  // U3: the hot streak — was it already lit when this swipe happened?
  const streakWasHot = !state.tutorial && (state.hotStreak || 0) >= CONFIG.hotStreakAt;
  state.hotStreak = (tier === 'good' || tier === 'incredible') ? (state.hotStreak || 0) + 1 : 0;
  (state.tierLog = state.tierLog || []).push(tier);
  (state.cardLog = state.cardLog || []).push({ e: ev.id, t: tier, a: state.act, s: side });
  let encoreEarned = false;
  const encoreCap = (state.perks || []).includes('crowdwork') ? CONFIG.encoreCap + 1 : CONFIG.encoreCap;
  if (tier === 'incredible' && (state.encore || 0) < encoreCap && !contractMods(state).disableEncore) {
    state.encore = (state.encore || 0) + 1;
    encoreEarned = true;
  }
  if (tier === 'incredible' && useEncore) state.encoreChained = true;
  // U3: riding the streak — an armed Encore that lands INCREDIBLE while
  // ON A ROLL refunds its token on top of the normal earn, cap be damned.
  let encoreRefunded = false;
  if (streakWasHot && useEncore && tier === 'incredible' && !contractMods(state).disableEncore) {
    state.encore = (state.encore || 0) + 1;
    encoreRefunded = true;
  }

  const outcome = choice.outcomes[tier];
  const effects = { ...outcome.effects };
  // U1: rarer × bigger — INCREDIBLE payloads land ~25% harder (positive
  // stat/fame/money gains only; costs and story effects stay authored)
  if (tier === 'incredible' && CONFIG.incrediblePayloadMult) {
    for (const k of ['skill', 'cred', 'creativity', 'network', 'fame', 'money']) {
      if ((effects[k] || 0) > 0) effects[k] = Math.round(effects[k] * CONFIG.incrediblePayloadMult);
    }
  }

  // Instrument quirk: bonus effects on Incredible (e.g. Kazoo's Novelty)
  const inst = PACK.instrumentById(state.instrument);
  if (tier === 'incredible' && inst?.quirk?.hooks?.onIncredible) {
    for (const [k, v] of Object.entries(inst.quirk.hooks.onIncredible)) {
      effects[k] = (effects[k] || 0) + v;
    }
  }

  // Home-venue show bonus (venue plugin, Phase 4.2): lifts fame/cred on a
  // Good/Incredible night in your adopted room, before effects land.
  firePlugins('modifyEffects', state, effects, { ev, choice, tier, rng });

  const deltas = applyEffects(state, effects, ev, choice, rng, tier, c.appliedAccessories, opts.mgDetail || null);
  const result: any = {
    tier, roll: Math.round(roll), text: outcome.text, deltas, event: ev, side,
    encoreEarned, encoreSpent: useEncore, encoreRefunded,
    hotStreak: state.hotStreak, streakWasHot,
  };

  // Promises (short-horizon objectives): a matching-tagged choice fulfills;
  // the deadline lapsing breaks. Checked before this card's own addPromise.
  if ((state.promises || []).length) {
    const kept = [], remaining = [];
    for (const p of state.promises) {
      if (tagsIntersect(p.tags, choice.tags) && tier !== 'declined') {
        kept.push(p);
      } else if (p.remaining <= 1) {
        (result.promisesBroken = result.promisesBroken || []).push(p);
      } else {
        remaining.push({ ...p, remaining: p.remaining - 1 });
      }
    }
    state.promises = remaining;
    for (const p of kept) {
      applyEffects(state, p.reward || {}, null, null, rng).forEach((d) => deltas.push(d));
      (result.promisesKept = result.promisesKept || []).push(p);
    }
    for (const p of result.promisesBroken || []) {
      applyEffects(state, p.penalty || {}, null, null, rng).forEach((d) => deltas.push(d));
    }
  }
  if (effects.addPromise && tier !== 'declined') {
    state.promises = state.promises || [];
    if (state.promises.length < 2) { // at most two open promises
      state.promises.push({ ...effects.addPromise, remaining: effects.addPromise.cards });
      result.promiseMade = effects.addPromise;
    }
  }

  // Build the room (venue plugin, Phase 4.2): venue-tagged shows level it up.
  firePlugins('afterResolve', state, result, { ev, choice, tier, rng });

  // Lucky Pick-style gear: lost when it applied and things went Bad
  // (the Roadie Insurance perk keeps it bolted down)
  if (tier === 'bad' && !(state.perks || []).includes('insurance')) {
    for (const acc of c.appliedAccessories) {
      if (acc.loseOnBad && state.accessories.includes(acc.id)) {
        state.accessories = state.accessories.filter((a) => a !== acc.id);
        result.gearLost = acc;
      }
    }
  }

  if (effects.chainEventId) state.pendingChainId = effects.chainEventId;

  // Burnout coping interstitials: crossing a threshold interrupts the deck
  // once per run with a forced coping card (unless a chain is already queued)
  if (!state.pendingChainId && !state.tutorial && !ev.finaleCard && ev.id !== 'coping_50' && ev.id !== 'coping_75' && ev.id !== 'coping_song') {
    state.copingSeen = state.copingSeen || [];
    const b = state.stats.burnout;
    const hasHit = (state.songs || []).some((x) => x.crowned || (x.status === 'charting' && x.pos && x.pos <= 5));
    if (b >= 75 && !state.copingSeen.includes('coping_75') && b < CONFIG.burnoutFail) {
      state.copingSeen.push('coping_75');
      state.pendingChainId = 'coping_75';
    } else if (b >= 62 && hasHit && !state.copingSeen.includes('coping_song')) {
      // the songs-era coping moment: your own hit has become noise
      state.copingSeen.push('coping_song');
      state.pendingChainId = 'coping_song';
    } else if (b >= 50 && !state.copingSeen.includes('coping_50')) {
      state.copingSeen.push('coping_50');
      state.pendingChainId = 'coping_50';
    }
  }
  finishCard(state, ev);
  return result;
}

function finishCard(state, ev) {
  if (!state.usedEvents.includes(ev.id)) state.usedEvents.push(ev.id);
  state.cardsPlayedInAct += 1;
  if (ev.shop) state.shopPlayedInAct = true;
  if (ev.flashpoint) state.flashpointSeen = true; // one per run, spent
  state.currentEventId = null;
}

// Applies an effects payload; returns display deltas [{key, amount}].
function applyEffects(state, effects, ev, choice, rng, tier?, appliedAccessories = [], mg = null) {
  const deltas: any = [];
  const inst = PACK.instrumentById(state.instrument);
  const hooks: Record<string, any> = inst?.quirk?.hooks || {};
  const accs = equippedAccessories(state).filter((a) => accessoryActive(a, state));
  const tags = choice?.tags || [];

  const push = (key, amount) => { if (amount) deltas.push({ key, amount }); };

  const cMods = contractMods(state);
  const wHooks = PACK.weatherHooks(state);
  for (const stat of stats()) {
    let v = effects[stat] || 0;
    if (!v) continue;
    if (stat === 'cred' && v > 0 && hooks.credGainMult) v = Math.round(v * hooks.credGainMult);
    if (stat === 'cred' && v > 0 && cMods.credGainMult) v = Math.round(v * cMods.credGainMult);
    if (v > 0 && wHooks.statGainMult?.[stat]) v = Math.round(v * wHooks.statGainMult[stat]);
    const before = state.stats[stat];
    state.stats[stat] = clamp(before + v, 0, 100);
    push(stat, state.stats[stat] - before);
  }

  // Burnout: quirk + accessory multipliers on tag-matched gains, plus per-use
  // side effects and passive act wear
  {
    let v = (effects.burnout || 0) + (ev ? (CONFIG.actWear[state.act] || 0) : 0);
    if (v > 0) {
      if (hooks.burnoutTagMult && tagsIntersect(hooks.burnoutTagMult.tags, tags)) v *= hooks.burnoutTagMult.mult;
      for (const acc of accs) {
        if (acc.burnoutTagMult && tagsIntersect(acc.burnoutTagMult.tags, tags)) v *= acc.burnoutTagMult.mult;
      }
    }
    for (const acc of appliedAccessories) {
      if (acc.sideEffect?.burnoutPerMatch) v += acc.sideEffect.burnoutPerMatch;
    }
    if (hooks.liveBurnout && tags.includes('live')) v += hooks.liveBurnout;
    if (v > 0 && cMods.burnoutGainMult) v *= cMods.burnoutGainMult;
    if (v > 0 && wHooks.burnoutGainMult) v *= wHooks.burnoutGainMult;
    if (v < 0 && cMods.burnoutHealMult) v *= cMods.burnoutHealMult;
    if (v < 0 && (state.perks || []).includes('therapist')) v *= 1.25;
    v = Math.round(v);
    if (v) {
      const before = state.stats.burnout;
      state.stats.burnout = clamp(before + v, 0, 100);
      push('burnout', state.stats.burnout - before);
    }
  }

  // Resource pass (Phase 3.2): iterate the pack's declared resources in order.
  // Each keeps its own arithmetic (RESOURCE_APPLY); 'hits' is the songs
  // subsystem, applied inline here (extracted in Phase 4.5). Order is the
  // manifest's, matching the old block order fame → money → hits →
  // pathProgress → rivalry, so deltas and RNG-consuming draws don't move.
  const rctx: ResourceCtx = { hooks, cMods, wHooks, accs };
  for (const res of PACK.manifest.resources) {
    if (res === 'hits') {
      if (effects.hits) {
        // an "instant classic": the fiction says this song is a hit — make it one
        for (let i = 0; i < effects.hits; i++) {
          const s = addSong(state, {
            title: effects.chartTitle
              ? effects.chartTitle.replace('{collabArtist}', collabArtistFor(state))
              : songName(rng, PACK.genreById(state.genre)),
            quality: 68 + Math.round((rng ? rng() : 0.5) * 12),
            origin: ev?.id || null, status: 'charting', hype: 60,
          });
          if (!s.crowned) { s.crowned = true; state.hits += 1; } else { /* crowned at debut */ }
          (deltas.songDebuts = deltas.songDebuts || []).push({ title: s.title, pos: s.pos, hit: true, viral: !!s.viral });
        }
        push('hits', effects.hits);
        state._chartTitleHandled = !!effects.chartTitle;
      }
      continue;
    }
    const fn = RESOURCE_APPLY[res];
    if (!fn) continue;
    const d = fn(state, effects[res] || 0, rctx);
    if (d) push(res, d);
  }

  // Plugin effect handlers (Phase 4.2: venue adoptVenue/venueLove; more
  // subsystems fold in here through Phase 4.5). No RNG, no deltas pushed.
  firePlugins('onEffect', state, effects, { ev, choice, tier, rng });
  if (effects.chartTitle && !state._chartTitleHandled) {
    const tierQ = tier === 'incredible' ? 66 : tier === 'good' ? 58 : 50;
    const s = addSong(state, {
      title: effects.chartTitle.replace('{collabArtist}', collabArtistFor(state)),
      quality: tierQ, origin: ev?.id || null, status: 'charting', hype: 62,
    });
    (deltas.songDebuts = deltas.songDebuts || []).push({ title: s.title, pos: s.pos, hit: s.crowned, viral: !!s.viral });
  }
  if (effects.hypeSong) {
    // Promo: pour hype into your best charting song. Hype decays hard every
    // chart week (×0.55), so this is how a song SURVIVES — the next act
    // break will show what the push bought.
    const charting = (state.songs || []).filter((s) => s.status === 'charting' && s.pos);
    if (charting.length) {
      const top = charting.slice().sort((a, b) => a.pos - b.pos)[0];
      top.hype = clamp(top.hype + effects.hypeSong, 0, 100);
      deltas.songHyped = { title: top.title, hype: top.hype, gain: effects.hypeSong };
    }
  }
  if (effects.albumDrop) {
    // THE ALBUM: everything ships at once. Every vault demo releases with
    // the album's hype; every charting song gets the halo bump.
    const hype = (typeof effects.albumDrop === 'number' ? effects.albumDrop : 60) + (hooks.releaseHype || 0) + accs.reduce((n, a) => n + (a.releaseHype || 0), 0) + ((state.perks || []).includes('promoter') ? 6 : 0);
    const demos = (state.songs || []).filter((s) => s.status === 'demo');
    for (const d of demos) {
      releaseSong(state, d.id, hype);
      (deltas.songDebuts = deltas.songDebuts || []).push({ title: d.title, pos: d.pos, hit: d.crowned, released: true, viral: !!d.viral });
    }
    for (const s of (state.songs || []).filter((x) => x.status === 'charting' && x.pos && !demos.includes(x))) {
      s.hype = clamp(s.hype + 12, 0, 100);
    }
    deltas.albumOut = { tracks: demos.length };
  }
  if (effects.releaseDemo) {
    // Release day: your best demo goes to the chart. The number is the hype
    // it ships with — the fiction (tier) decides how loud the drop lands.
    const demos = (state.songs || []).filter((s) => s.status === 'demo');
    if (demos.length) {
      const best = demos.slice().sort((a, b) => b.quality - a.quality)[0];
      const hype = (typeof effects.releaseDemo === 'number' ? effects.releaseDemo : 55) + (hooks.releaseHype || 0) + accs.reduce((n, a) => n + (a.releaseHype || 0), 0) + ((state.perks || []).includes('promoter') ? 6 : 0);
      releaseSong(state, best.id, hype);
      (deltas.songDebuts = deltas.songDebuts || []).push({ title: best.title, pos: best.pos, hit: best.crowned, released: true, viral: !!best.viral });
    }
  }
  if (effects.polishDemo) {
    // The vault appreciates: unreleased material gets better
    const demos = (state.songs || []).filter((s) => s.status === 'demo');
    if (demos.length) {
      const best = demos.slice().sort((a, b) => b.quality - a.quality)[0];
      best.quality = clamp(best.quality + effects.polishDemo, 1, 100);
      deltas.songPolished = { title: best.title, quality: best.quality, gain: effects.polishDemo };
    }
  }
  if (effects.writeSong) {
    // Songwriting writes a REAL song: a demo lands in the notebook. Quality
    // reads the outcome tier, how the writing minigame went, and who you are
    // (creativity). A hook you grabbed in Idea Grab becomes the title.
    const base = tier === 'incredible' ? 64 : tier === 'good' ? 50 : 36;
    const verdictAdj = { BOTCHED: -10, SCRAPPY: 0, SOLID: 8, GOLDEN: 16 }[mg?.label] || 0;
    const creaAdj = Math.round(((state.stats.creativity || 0) - 40) * 0.2);
    const gearAdj = accs.reduce((n, a) => n + (a.demoQuality || 0), 0);
    const perkAdj = (state.perks || []).includes('golden_ears') ? 6 : 0;
    const instAdj = (hooks.demoQuality || 0) + gearAdj + perkAdj; // Loop Station / four-track: layers stick
    const jit = Math.round((rng ? rng() : 0.5) * 10 - 5);
    const grabbedHooks = mg?.hooks || [];
    const title = grabbedHooks.length
      ? grabbedHooks[Math.floor((rng ? rng() : 0.5) * grabbedHooks.length)].replace(/(^|\s)[a-z]/g, (c) => c.toUpperCase())
      : songName(rng, PACK.genreById(state.genre));
    const s = addSong(state, {
      title, quality: base + verdictAdj + creaAdj + instAdj + jit,
      origin: ev?.id || null, status: 'demo',
    });
    deltas.songWritten = { title: s.title, quality: s.quality, fromHook: grabbedHooks.length > 0 };
  }
  state._chartTitleHandled = false;
  if (effects.addFlag && !state.flags.includes(effects.addFlag)) state.flags.push(effects.addFlag);
  if (effects.removeFlag) state.flags = state.flags.filter((f) => f !== effects.removeFlag);

  if (effects.setInstrument) {
    const newInst = PACK.instrumentById(effects.setInstrument);
    if (newInst && state.instrument !== newInst.id) {
      state.instrument = newInst.id;
      state.swappedInstrument = true;
      deltas.instrumentSet = newInst;
    }
  }
  if (effects.grantBandmate) {
    state.band = state.band || [];
    if (state.band.length < 3) {
      const bm = effects.grantBandmate === 'random'
        ? PACK.recruitCandidate(state, rng)
        : (!state.band.includes(effects.grantBandmate) ? PACK.bandmateById(effects.grantBandmate) : null);
      if (bm) {
        state.band.push(bm.id);
        deltas.bandmateJoined = bm;
      }
    }
  }
  if (effects.removeBandmate) {
    state.band = state.band || [];
    if (effects.removeBandmate === 'first') {
      const gone = PACK.bandmateById(state.band[0]);
      state.band = state.band.slice(1);
      if (gone) deltas.bandmateLeft = gone;
    } else {
      state.band = state.band.filter((b) => b !== effects.removeBandmate);
    }
  }
  if (effects.grantHustle) {
    state.hustles = state.hustles || [];
    if (!state.hustles.includes(effects.grantHustle)) {
      state.hustles.push(effects.grantHustle);
      deltas.hustleGained = PACK.hustleById(effects.grantHustle);
    }
  }
  if (effects.removeGear) state.accessories = state.accessories.filter((a) => a !== effects.removeGear);
  if (effects.grantGear) {
    if (effects.grantGear === 'random_basic' || effects.grantGear === 'random_good') {
      // Shops have shelves: offer up to 3 candidates, the player chooses
      const opts = gearShelf(state, effects.grantGear, rng);
      if (opts.length > 1) deltas.pendingGearChoices = opts;
      else if (opts.length === 1) deltas.pendingGear = opts[0];
    } else {
      const acc = resolveGearGrant(state, effects.grantGear, rng);
      if (acc) deltas.pendingGear = acc; // UI equips (or swaps) it; sim auto-equips
    }
  }
  return deltas;
}

function gearShelf(state, grant, rng = Math.random) {
  const owned = new Set(state.accessories);
  const basics = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder', 'merch_cannon', 'cowbell', 'four_track',
    'gaff_tape', 'tip_qr', 'pocket_metronome', 'lucky_socks', 'thermos', 'demo_trunk'];
  const goods = ['pedalboard', 'vintage_mic', 'loud_amp', 'loop_pedal', 'in_ears', 'cursed_8track', 'stage_fan', 'humidifier', 'publicist_rolodex',
    'wireless_rig', 'contact_mic', 'stage_cape', 'projector', 'press_pass', 'mascot_head', 'shoebox_archive', 'green_room_kit', 'rice_cooker'];
  const ids = grant === 'random_basic' ? basics : goods;
  let pool = ids.filter((id) => !owned.has(id)).map(PACK.accessoryById).filter(Boolean);
  if (!pool.length) {
    pool = PACK.accessories.filter((a) => a.unlockedByDefault && !owned.has(a.id));
  }
  const shelf = [];
  const bag = [...pool];
  while (shelf.length < 3 && bag.length) {
    shelf.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return shelf;
}

// Resolves 'random_basic'/'random_good' or a concrete accessory id to an
// accessory the player doesn't already own.
function resolveGearGrant(state, grant, rng = Math.random) {
  const owned = new Set(state.accessories);
  let candidates;
  if (grant === 'random_basic' || grant === 'random_good') {
    const basics = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder',
      'gaff_tape', 'tip_qr', 'pocket_metronome', 'thermos'];
    const goods = ['pedalboard', 'vintage_mic', 'loud_amp', 'cursed_8track', 'stage_fan', 'in_ears',
      'wireless_rig', 'contact_mic', 'stage_cape', 'projector'];
    const ids = grant === 'random_basic' ? basics : goods;
    candidates = ids.filter((id) => !owned.has(id)).map(PACK.accessoryById).filter(Boolean);
    if (!candidates.length) {
      candidates = PACK.accessories.filter((a) => a.unlockedByDefault && !owned.has(a.id));
    }
  } else {
    const acc = PACK.accessoryById(grant);
    candidates = acc && !owned.has(acc.id) ? [acc] : [];
  }
  if (!candidates.length) return null;
  return candidates[Math.floor(rng() * candidates.length)];
}

// Equip an accessory (after any UI slot decision). Fires onAcquire effects.
export function equipAccessory(state, accId, replaceId = null) {
  if (replaceId) state.accessories = state.accessories.filter((a) => a !== replaceId);
  if (state.accessories.length >= CONFIG.accessorySlots) return null;
  state.accessories.push(accId);
  const acc = PACK.accessoryById(accId);
  const deltas: any = [];
  if (acc?.grantsFlag && !state.flags.includes(acc.grantsFlag)) state.flags.push(acc.grantsFlag);
  if (acc?.onAcquire) {
    const d = applyEffects(state, acc.onAcquire, null, null, Math.random);
    deltas.push(...d);
  }
  return deltas;
}

// ---------- Act / phase advancement ----------

// Call after each resolved card. Returns one of:
// { kind:'card' } | { kind:'crossroads' } | { kind:'actStart', act, notes } |
// { kind:'finale' } | { kind:'gameover', endingKey }
export function advance(state) {
  const failed = checkFailStates(state);
  if (failed) {
    state.phase = 'ended';
    state.ending = { key: failed, result: null };
    return { kind: 'gameover', endingKey: failed };
  }
  if (state.pendingChainId) return { kind: 'card' };
  if (state.cardsPlayedInAct >= actLength(state, state.act)) {
    if (state.tutorial) {
      state.phase = 'ended';
      state.ending = { key: 'tutorial', result: null };
      return { kind: 'tutorialEnd' };
    }
    // The Last Door: every run's final card is its path's climax event —
    // queued here so chains/coping can never displace it.
    if (state.act === 3 && state.path) {
      const climax = PACK.events.find(
        (e) => e.finaleCard && e.pathAffinity?.includes(state.path) && !state.usedEvents.includes(e.id)
      );
      if (climax) {
        state.pendingChainId = climax.id;
        return { kind: 'card' };
      }
    }
    if (state.act === 1) {
      state.phase = 'crossroads';
      return { kind: 'crossroads' };
    }
    if (state.act === 2) {
      const notes = startAct(state, 3);
      return { kind: 'actStart', act: 3, notes };
    }
    state.phase = 'finale'; // UI runs the Final Set, then evaluateFinale ends it
    return { kind: 'finale' };
  }
  return { kind: 'card' };
}

export function commitPath(state, pathId) {
  state.path = pathId;
  return startAct(state, 2);
}

// Story Seeds: a dud seed re-rolls at the Crossroads. If an arc can no
// longer light (setups spent or act-1-only and gone), the run quietly
// roots for a different story instead of carrying dead weight into act 2.
function refreshSeeds(state) {
  if (!(state.seeds || []).length) return;
  const rng = stateRng(state);
  const alive = (arc) =>
    requiresOk(arc.lit, state) ||
    arc.setup.some((id) => {
      const ev = findEvent(id);
      return ev && !state.usedEvents.includes(id) && actMatches(ev, 2);
    });
  const taken = new Set(state.seeds);
  state.seeds = state.seeds.map((arcId) => {
    const arc = PACK.arcById(arcId);
    if (arc && alive(arc)) return arcId;
    const pool = PACK.arcs.filter((a) => !taken.has(a.id) && alive(a));
    if (!pool.length) return arcId;
    const pick = pool[Math.floor(rng() * pool.length)].id;
    taken.add(pick);
    return pick;
  });
}

function startAct(state, act) {
  if (act === 2) refreshSeeds(state);
  state.act = act;
  state.cardsPlayedInAct = 0;
  state.shopPlayedInAct = false;
  state.phase = 'card';
  const notes = [];
  for (const acc of equippedAccessories(state)) {
    if (acc.upkeep) {
      state.money -= acc.upkeep;
      notes.push(`${acc.name}: −$${acc.upkeep} upkeep`);
    }
  }
  for (const id of state.hustles || []) {
    const h = PACK.hustleById(id);
    if (h) {
      const pay = Math.round(h.moneyPerAct * (PACK.weatherHooks(state).hustleMult || 1) *
        ((state.perks || []).includes('cheap_rent') ? 1.2 : 1));
      state.money += pay;
      notes.push(`${h.icon} ${h.name}: +$${pay}`);
    }
  }
  // Career Wall perks that fire at every act break
  const perks = state.perks || [];
  if (perks.includes('merch_table')) {
    state.money += 45;
    notes.push('🧺 The Folding Merch Table: +$45');
  }
  if (perks.includes('street_team')) {
    state.fame += 2;
    notes.push('📣 The Street Team: +2 Fame (the flyers went up overnight)');
  }
  if (perks.includes('roadie_friend') && state.stats.burnout > 0) {
    const before = state.stats.burnout;
    state.stats.burnout = Math.max(0, before - 3);
    if (state.stats.burnout !== before) notes.push('🧤 A Friend With A Truck: −3 Burnout');
  }
  if (perks.includes('archivist')) {
    const demos = (state.songs || []).filter((s) => s.status === 'demo');
    for (const d of demos) d.quality = clamp(d.quality + 2, 1, 100);
    if (demos.length) notes.push(`🗃️ The Archivist: ${demos.length} vault demo${demos.length === 1 ? '' : 's'} +2 quality`);
  }
  for (const bid of state.band || []) {
    const bm = PACK.bandmateById(bid);
    if (bm?.actQuirk?.money) {
      state.money += bm.actQuirk.money;
      notes.push(`${bm.icon} ${bm.name}: +$${bm.actQuirk.money} merch`);
    }
    if (bm?.actQuirk?.burnout) {
      const before = state.stats.burnout;
      state.stats.burnout = Math.max(0, before + bm.actQuirk.burnout);
      if (state.stats.burnout !== before) notes.push(`${bm.icon} ${bm.name}: ${bm.actQuirk.burnout} Burnout`);
    }
    if (bm?.actQuirk?.fame) {
      state.fame += bm.actQuirk.fame;
      notes.push(`${bm.icon} ${bm.name}: +${bm.actQuirk.fame} Fame (word travels)`);
    }
    if (bm?.actQuirk?.demo) { // (deadline audit runs below, after quirks)
      // Nadia's notebook: a fresh "spare" appears every act break
      const rng = stateRng(state);
      const s = addSong(state, {
        title: songName(rng, PACK.genreById(state.genre)), status: 'demo',
        quality: 42 + Math.round(rng() * 26),
      });
      notes.push(`${bm.icon} ${bm.name}: leaves a demo on your amp — “${s.title}”`);
    }
  }
  notes.push(...deadlineAudit(state, act - 1));
  notes.push(...chartTick(state));
  // U5: the act twist is telegraphed the moment the act opens
  if (state.actTwist && state.actTwist.act === act) {
    notes.push(state.actTwist.delta < 0
      ? `✂️ The routing collapses — this leg runs ${-state.actTwist.delta} cards SHORT. Make them count.`
      : `➕ The promoter adds dates — this leg runs ${state.actTwist.delta} cards LONG. Pace yourself.`);
  }
  return notes;
}

// Hustles pay out one final time when the career is evaluated
export function finalePayout(state) {
  const notes = [];
  notes.push(...deadlineAudit(state, 3));
  for (const id of state.hustles || []) {
    const h = PACK.hustleById(id);
    if (h) {
      const pay = Math.round(h.moneyPerAct * (PACK.weatherHooks(state).hustleMult || 1) *
        ((state.perks || []).includes('cheap_rent') ? 1.2 : 1));
      state.money += pay;
      notes.push(`${h.icon} ${h.name}: +$${pay}`);
    }
  }
  return notes;
}

export function checkFailStates(state) {
  if (state.tutorial) return null; // the first gig cannot end a career
  if (state.stats.burnout >= CONFIG.burnoutFail) return 'burnout';
  if (state.act >= CONFIG.credFailFromAct && state.stats.cred <= 0) return 'cancelled';
  if (state.money <= CONFIG.debtFailMoney && state.flags.includes('debt')) return 'debt';
  return null;
}

// ---------- Finale (spec §7.1) ----------

export function evaluateFinale(state) {
  state.phase = 'ended';
  chartTick(state); // one last chart week before judgment
  finalePayout(state);
  const gates = PACK.manifest.winGates[state.path] as Record<string, number>;
  const readings = Object.entries(gates).map(([key, target]) => {
    const value = gateValue(state, key);
    return { key, target, value, met: value >= target, ratio: Math.min(1, value / target) };
  });
  let result;
  if (readings.every((r) => r.met)) {
    result = 'success';
  } else {
    const avg = readings.reduce((s, r) => s + r.ratio, 0) / readings.length;
    result = avg >= CONFIG.partialRatio ? 'partial' : 'failure';
    // Momentum clutch: a near-miss with enough path progress still summits
    if (
      result === 'partial' &&
      readings.every((r) => r.ratio >= CONFIG.nearMissRatio) &&
      state.pathProgress >= CONFIG.momentumForUpgrade
    ) {
      result = 'success';
    }
  }
  state.ending = { key: state.path, result };
  return { result, readings, momentum: state.pathProgress };
}

// ---------- Legacy Points (spec §9) ----------

export function legacyPoints(state) {
  const s = state.stats;
  const base = Math.round((state.fame + s.skill + s.cred + s.creativity + s.network) / CONFIG.lpStatDivisor);
  const result = state.ending?.result;
  const bonus = result ? CONFIG.lpEndingBonus[result] : CONFIG.lpEndingBonus.failstate;
  let mult = PACK.contractById(state.contract)?.lpMult || 1;
  mult *= PACK.weatherHooks(state).lpMult || 1;
  if ((state.flags || []).includes('comeback')) mult *= 1.2;
  return Math.max(1, Math.round((base + bonus) * mult));
}

export function runSummary(state) {
  return {
    endingKey: state.ending?.key ?? null,
    result: state.ending?.result ?? null,
    path: state.path,
    fame: state.fame,
    money: state.money,
    hits: state.hits,
    burnout: state.stats.burnout,
    stats: { ...state.stats },
    instrument: state.instrument,
    pathProgress: state.pathProgress,
    rivalry: state.rivalry ?? 3,
    rival: state.rival,
    encoreChained: !!state.encoreChained,
    copingCount: (state.copingSeen || []).length,
    chartPeak: (state.songs || []).reduce((best, s) => (s.peak && (!best || s.peak < best) ? s.peak : best), null),
    songs: (state.songs || []).map((s) => ({ ...s })),
    tierLog: state.tierLog || [],
    cardLog: state.cardLog || [],
    daily: state.daily || null,
    gauntlet: state.gauntlet || null,
    contract: state.contract || null,
    hustles: (state.hustles || []).length,
    swapped: !!state.swappedInstrument,
    flags: [...(state.flags || [])],
    genre: state.genre || null,
    venue: state.venue || null,
    venueLevel: state.venueLevel || 0,
    weather: state.weather || null,
    band: [...(state.band || [])],
    brammy: state.brammy || null, // 'won' | 'lost' | null (Awards night)
  };
}
