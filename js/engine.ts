// BIG BREAK — game engine (spec §4, §7, §8.4). Pure logic, no DOM:
// the same module runs in the browser and in tools/simulate.mjs.

import { CONFIG } from './config.js';
import type { Pack, RunState, Song, Plugin } from './types.js';

// ---------- Injected content pack (Phase 2: IoC) ----------
// The engine imports NO content module. All music-specific content arrives as
// a Pack, set at run start (newRun) and re-affirmed at boot/resume via
// useContentPack. One game session runs one active pack; a second game is a
// second Pack against this same engine. Everything below reads PACK.* where it
// used to import PACK.events / instruments / venues / arcs / weather / etc.
let PACK: Pack;

// Fill absent OPTIONAL capabilities with inert defaults (Phase E — ISP). The
// engine feature-detects a genre's capabilities by letting a pack omit the ones
// it doesn't use; normalizing once here means the rest of the engine can call
// PACK.rollWeather / accessoryById / etc unconditionally without a stub in
// every pack. A pack that provides a capability is untouched (byte-green); a
// pack that omits it gets a no-op, so the mystery/probe stubs delete entirely.
function normalizePack(pack: Pack): Pack {
  const none = () => null;
  return {
    ...pack,
    instruments: pack.instruments || [],
    instrumentById: pack.instrumentById || none,
    accessories: pack.accessories || [],
    accessoryById: pack.accessoryById || none,
    gearPool: pack.gearPool || (() => []),
    arcs: pack.arcs || [],
    arcById: pack.arcById || none,
    contractById: pack.contractById || none,
    genreById: pack.genreById || none,
    hustleById: pack.hustleById || none,
    bandmateById: pack.bandmateById || none,
    recruitCandidate: pack.recruitCandidate || none,
    rollSeeds: pack.rollSeeds || (() => []),
    rollWeather: pack.rollWeather || (() => null),
    weatherHooks: pack.weatherHooks || (() => ({})),
  };
}

export function useContentPack(pack: Pack): void {
  PACK = normalizePack(pack);
}
export function activePack(): Pack {
  return PACK;
}

// Tutorial cards live outside PACK.events so they can never enter normal decks;
// chains and resume still need to find them by id. Exported as a plugin-facing
// service so a subsystem (seeds) can inspect the deck without importing it.
export function findEvent(id) {
  return PACK.events.find((e) => e.id === id) || PACK.tutorialEvents.find((e) => e.id === id) || null;
}

function contractMods(state): Record<string, any> {
  return PACK.contractById(state.contract)?.mods || {};
}

// Act length can be shortened by a contract (Overnight Success) or bent
// by this run's act twist (U5: the tour got cut short / extended)
export function actLength(state, act) {
  if (state.tutorial) return PACK.tutorialEvents.length;
  // A subsystem may shorten/lengthen the act (a contract's Overnight Success);
  // the core owns only the per-act default and the run's act twist.
  const base = foldActLength(state, act, CONFIG.actLengths[act]);
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
  PACK = normalizePack(pack); // this run's content pack; also settable via useContentPack
  const inst = PACK.instrumentById(instrumentId);
  // Stats are the pack's, not a hardwired list: roll each core stat in manifest
  // order (music order skill→cred→creativity→network keeps the seeded draws
  // byte-identical), then burnout. A pack with different stats just works.
  const stats: Record<string, number> = {};
  for (const s of pack.manifest.stats) stats[s] = randInt(rng, CONFIG.statStartMin, CONFIG.statStartMax);
  stats.burnout = CONFIG.burnoutStart;
  const state: RunState = {
    version: 1,
    packId: pack.id, // which genre this run belongs to (save/import guard, analytics)
    phase: 'card', // card | crossroads | ended
    act: 1,
    cardsPlayedInAct: 0,
    shopPlayedInAct: false,
    stats,
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
    // rival + rivalry: set by the rival plugin's onConstruct (Phase 4.3).
    // seeds / flashpointAt / actTwist / weather: seeded construction, drawn
    // in a FROZEN order right after this literal (see below) — the golden
    // pins that order; reordering shifts every downstream draw.
    rival: null,
    rivalry: 3,
    seeds: [],
    seenCards: null, // per-player seen-card ids (set by the UI from meta)
    flashpointAt: null,
    flashpointSeen: false,
    hotStreak: 0,
    actTwist: null,
    weather: null,
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
  // Seeded construction draws, in FROZEN order (chartSeed above, then rival via
  // onConstruct, seeds, flashpoint, actTwist; the weather draw now lands at the
  // onRunStart tail). A subsystem's construction draw lands exactly where the
  // old inline draw did; reordering here invalidates the entire golden corpus.
  firePlugins('onConstruct', state, rng); // rival draw, then the seeds draw
  // Rush: ~25% of runs schedule one flashpoint (U2); ~20% bend an act (U5)
  state.flashpointAt = rng() < CONFIG.flashpointChance
    ? randInt(rng, CONFIG.flashpointWindow[0], CONFIG.flashpointWindow[1]) : null;
  state.actTwist = rng() < CONFIG.actTwistChance
    ? { act: randInt(rng, 2, 3), delta: rng() < 0.5 ? -CONFIG.actTwistDelta : CONFIG.actTwistDelta }
    : null;
  if (inst) {
    for (const [k, v] of Object.entries(inst.modifiers || {})) {
      if (k in state.stats) state.stats[k] = clamp(state.stats[k] + v, 1, 100);
    }
  }
  // Career Wall perks: always-on run-start bonuses. Pack-declared (D.1) — the
  // engine runs each perk's onRunStart; it no longer names any perk. The bumps
  // touch independent fields, so order is immaterial (byte-green).
  state.perks = perks;
  for (const p of activePerks(state)) p.onRunStart?.(state);
  // Run-start subsystem hook, fired at the tail of construction. The weather
  // plugin draws the era here and pays its walk-in bonus (no rng is consumed
  // between the old inline weather draw and this point in the golden corpus, so
  // the era lands at the same ordinal); the songs plugin mints the Old
  // Notebook's opening demo. Seeded draws land where the old inline ones did.
  firePlugins('onRunStart', state, rng);
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
  const dl = contractMods(state).releaseDeadline;
  if (!dl) return [];
  const shipped = (state.songs || []).some((s) => s.releasedAct === act);
  if (shipped) return [`📠 The Deadline: act ${act} shipped. The label is quiet, which is love.`];
  // The penalty stat is named by the contract mod, not the engine (WP3): the
  // 'cred' literal was the last music-stat name in this audit. (The whole audit
  // moves to the songs subsystem in WP6.)
  state.fame = Math.max(0, state.fame - dl.fameLoss);
  state.stats[dl.stat] = clamp(state.stats[dl.stat] - dl.statLoss, 0, 100);
  return [`📠 The Deadline: nothing shipped in act ${act}. The label notes the silence. −${dl.fameLoss} Fame, −${dl.statLoss} ${dl.statLabel}`];
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
  // Teaching stats + starting persona are pack-declared (D.3), not hardcoded
  // music values. Only a pack that ships tutorialEvents reaches here.
  const t = pack.tutorialStart;
  const state = newRun(pack, t?.instrument ?? pack.instruments[0].id, [], rng, []);
  state.tutorial = true;
  if (t?.stats) state.stats = { ...t.stats } as RunState['stats'];
  if (t?.money !== undefined) state.money = t.money;
  if (t?.fame !== undefined) state.fame = t.fame;
  state.pendingChainId = PACK.tutorialEvents[0].id;
  return state;
}

// Comeback Mode (unlocked by any Success): start as a faded name. The transform
// itself hardcodes music stats (cred/network), so it's a pack-provided
// capability (WP3) — the engine only dispatches to it, naming no stat. A pack
// without a comeback mode omits it and this is a no-op.
export function applyComeback(state) {
  PACK.comeback?.(state);
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

export function actMatches(ev, act) {
  return Array.isArray(ev.act) ? ev.act.includes(act) : ev.act === act;
}

function meetsRequires(ev, state) {
  return requiresOk(ev.requires, state);
}

// The neutral keys requiresOk resolves inline; everything else is dispatched to
// a pack-registered predicate (WP1). Kept in sync with the core Requires type.
const REQUIRES_NEUTRAL = new Set([
  'anyOf', 'flagsAll', 'flagsNone', 'moneyMax', 'moneyMin', 'burnoutMin',
  'stats', 'min', 'max',
]);

// The merged predicate registry for the active pack (WP1 — the sibling of the
// effectVerbs registry). Each plugin's `requires` map contributes its keys;
// requiresOk dispatches an unknown key here. Memoized per pack — building it is
// cheap but this sits in the deck hot path. A key two plugins both claim is an
// authoring conflict, but last-wins is harmless (packs don't collide).
let _reqPredsFor: Pack | null = null;
let _reqPreds: Record<string, (state: any, arg: any) => boolean> = {};
function requiresPredicates(): Record<string, (state: any, arg: any) => boolean> {
  if (_reqPredsFor === PACK) return _reqPreds;
  const preds: Record<string, (state: any, arg: any) => boolean> = {};
  for (const p of orderedPlugins()) {
    if (p.requires) for (const [k, fn] of Object.entries(p.requires)) preds[k] = fn;
  }
  _reqPredsFor = PACK;
  _reqPreds = preds;
  return preds;
}

// Evaluate a Requires gate. Exported as a plugin-facing service so a subsystem
// (seeds) can test its own arc-lit conditions with the same semantics.
export function requiresOk(r, state) {
  if (!r) return true;
  // anyOf: alternative gates — the card fires if ANY branch is satisfied
  // (e.g. nemesis_soundcheck accepts a cross-run nemesis OR an in-run feud)
  if (r.anyOf && !r.anyOf.some((alt) => requiresOk(alt, state))) return false;
  if (r.flagsAll && !r.flagsAll.every((f) => state.flags.includes(f))) return false;
  if (r.flagsNone && r.flagsNone.some((f) => state.flags.includes(f))) return false;
  if (r.moneyMax !== undefined && state.money > r.moneyMax) return false;
  if (r.moneyMin !== undefined && state.money < r.moneyMin) return false;
  if (r.burnoutMin !== undefined && state.stats.burnout < r.burnoutMin) return false;
  // Generic stat/resource gates, resolved through gateValue for ANY manifest
  // key: `stats` uses the legacy `{ <key>Min: n }` shape; `min`/`max` the plain
  // `{ <key>: n }` form. No genre's key is named.
  if (r.stats) {
    for (const [key, val] of Object.entries(r.stats)) {
      if (gateValue(state, key.replace(/Min$/, '')) < (val as number)) return false;
    }
  }
  if (r.min) {
    for (const [key, val] of Object.entries(r.min)) if (gateValue(state, key) < (val as number)) return false;
  }
  if (r.max) {
    for (const [key, val] of Object.entries(r.max)) if (gateValue(state, key) > (val as number)) return false;
  }
  // Every other key is a subsystem predicate the owning plugin registered
  // (WP1). Consumes no rng, returns a plain boolean — so the gate is a pure
  // conjunction and evaluation order is immaterial (byte-green). An unregistered
  // key is a no-op here and is caught structurally by the "requires key owned"
  // invariant.
  const preds = requiresPredicates();
  for (const key of Object.keys(r)) {
    if (REQUIRES_NEUTRAL.has(key)) continue;
    const pred = preds[key];
    if (pred && !pred(state, (r as any)[key])) return false;
  }
  return true;
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
    // Scheduled subsystem forcing (Story Seeds R1): an unlit seeded arc gets its
    // setup card dealt on schedule, same mechanism as the shop slot above. The
    // seeds plugin owns the arc data; the engine just gives it the slot.
    pool = foldDeckPool(state, pool, { shopDue });
    // U3 spotlight: while ON A ROLL, the deck leans all the way into
    // what this player has never seen — streaks are for discovering.
    if (streakHot && !shopDue && state.seenCards) {
      const seenSet = new Set(state.seenCards);
      const unseen = pool.filter((e) => !seenSet.has(e.id));
      if (unseen.length) pool = unseen;
    }
  }
  // Personal novelty (R2): cards THIS player has never seen draw heavier.
  // On a first install everything is unseen, so nothing shifts.
  const seen = state.seenCards ? new Set(state.seenCards) : null;
  let total = 0;
  const weights = pool.map((ev) => {
    const affine = ev.pathAffinity && ev.pathAffinity.includes(state.path);
    let w = (ev.weight || 1) *
      (affine ? CONFIG.pathWeightMult : 1) *
      (seen && !seen.has(ev.id) ? CONFIG.noveltyWeightMult : 1);
    // Subsystem deck bias (seeded-arc payoff/setup boost, then the weather
    // era's recolor), folded in after the core path/novelty factors — the same
    // slot the inline seed/weather multipliers sat. In the golden corpus the
    // novelty factor is always 1 (seenCards unset), so the ×1 is a true no-op
    // and this grouping is byte-exact with the old inline order.
    w = foldDeckWeight(state, ev, w);
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

// ---------- Plugin dispatch (Phase 4, hardened in Phase F) ----------
// The lifecycle hooks a plugin may implement. Typed, so a typo'd hook name is
// a COMPILE error, not a silent no-op (the old (p as any)[hook] swallowed it).
type PluginHook = 'onConstruct' | 'onRunStart' | 'modifyEffects' | 'onEffect'
  | 'afterResolve' | 'onActBreak' | 'onTick' | 'onFinale';

// Plugins fire in ascending `priority` (default 0), ties broken by registration
// order (a stable sort) — so ordering is INTENTIONAL and declared, not pinned
// by array position alone. With no priorities set it is exactly registration
// order, so existing packs are byte-green.
function orderedPlugins(): Plugin[] {
  const plugins = PACK.plugins;
  if (!plugins) return [];
  return plugins
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.priority ?? 0) - (b.p.priority ?? 0) || a.i - b.i)
    .map((x) => x.p);
}

// Fire a lifecycle hook across the active pack's plugins. Empty/absent registry
// = no-op, so wiring a dispatch point in is byte-green until a plugin uses it.
function firePlugins(hook: PluginHook, ...args: any[]): void {
  for (const p of orderedPlugins()) {
    const fn = p[hook] as ((...a: any[]) => void) | undefined;
    if (fn) fn.apply(p, args);
  }
}

// ── The neutral modify-hook folds (WP6-infra). Each gathers a subsystem's
// contribution at the exact site the old inline code sat, in registration
// order — so a subsystem stops being named by the core without moving any draw. ──

// Additive roll bonus summed across plugins (gear/genre/band/weather/contract).
function sumRollBonus(state, choice, ctx): number {
  let bonus = 0;
  for (const p of orderedPlugins()) bonus += p.modifyRoll?.(state, choice, ctx) ?? 0;
  return bonus;
}
// Fold each plugin's jitter transform (contract override → weather widen).
function foldJitter(state, jitter: [number, number], ctx): [number, number] {
  for (const p of orderedPlugins()) if (p.modifyJitter) jitter = p.modifyJitter(state, jitter, ctx);
  return jitter;
}
// The per-resolution gain-hook bags a subsystem contributes (contract, weather),
// applied by the stat/burnout loops after the instrument's own (core).
function gainBags(state): any[] {
  const bags: any[] = [];
  for (const p of orderedPlugins()) { const b = p.gainHooks?.(state); if (b) bags.push(b); }
  return bags;
}
// Does any subsystem disable the Encore mechanic this run?
function encoreDisabled(state): boolean {
  for (const p of orderedPlugins()) if (p.blocksEncore?.(state)) return true;
  return false;
}
// Fold each plugin's deck-weight multiplier (weather recolor, seeded-arc bias).
function foldDeckWeight(state, ev, weight: number): number {
  for (const p of orderedPlugins()) if (p.weightDeck) weight = p.weightDeck(state, ev, weight);
  return weight;
}
// Let each plugin force a scheduled category into the draw pool (seed setup slot).
function foldDeckPool(state, pool, ctx): any[] {
  for (const p of orderedPlugins()) if (p.refineDeck) pool = p.refineDeck(state, pool, ctx);
  return pool;
}
// Product of each plugin's Legacy Points multiplier (contract, weather). Starts
// at 1 (identity), so the accumulation is byte-exact with the old `mult *= …`.
function scoreMult(state): number {
  let mult = 1;
  for (const p of orderedPlugins()) mult *= p.scoreMult?.(state) ?? 1;
  return mult;
}
// Fold each plugin's act-length override (a contract can shorten an act).
function foldActLength(state, act, base: number): number {
  for (const p of orderedPlugins()) if (p.modifyActLength) base = p.modifyActLength(state, act, base);
  return base;
}

// ---------- Perks (Career-Wall modifiers, pack-declared — D.1) ----------
// The active run's perk definitions, looked up from the pack's perk table. The
// engine no longer knows any perk id; it sums/applies whatever the perks
// declare at the matching lifecycle point.
function activePerks(state): import('./types.js').PerkDef[] {
  const table = PACK.perks || {};
  return (state.perks || []).map((id) => table[id]).filter(Boolean);
}
// Product of a numeric perk knob across the active perks (default 1 → identity).
function perkMult(state, key: string): number {
  return activePerks(state).reduce((m, p) => m * ((p as any)[key] ?? 1), 1);
}
// Sum of a numeric perk knob across the active perks (default 0).
function perkSum(state, key: string): number {
  return activePerks(state).reduce((n, p) => n + ((p as any)[key] ?? 0), 0);
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
  // The instrument's tag bonus is core (the loadout is core); genre and band
  // tag bonuses fold in via modifyRoll below (genre/band plugins).
  for (const tb of inst?.quirk?.hooks?.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }

  const burnoutPenalty = -(state.stats.burnout * CONFIG.burnoutCoeff);
  const pityPer = CONFIG.pityPerBad + perkSum(state, 'pityPerBonus');
  const pityBonus = Math.min((state.badStreak || 0) * pityPer, CONFIG.pityCap + perkSum(state, 'pityCapBonus'));
  // Subsystem roll bonuses (contract clauses; genre/band/weather/gear follow),
  // folded in at the old inline slot in registration order. `rollCtx.applied`
  // is where the gear plugin records the accessories whose bonus fired.
  const rollCtx: any = { applied, tags: choice.tags };
  const pluginRollBonus = sumRollBonus(state, choice, rollCtx);
  const encoreBonus = opts.encore && !encoreDisabled(state) ? CONFIG.encoreBonus : 0;
  // Performance bonus: a minigame result (UI-side skill) folded into the roll
  const perfBonus = opts.bonus || 0;
  // Base jitter is the instrument's or the per-act default; a subsystem may
  // override it (contract) or widen it (weather) via modifyJitter, in
  // registration order (contract override before weather widen).
  let jitter: [number, number] = inst?.quirk?.hooks?.jitter ||
    CONFIG.jitterByAct?.[state.act] || [CONFIG.jitterMin, CONFIG.jitterMax];
  jitter = foldJitter(state, jitter, rollCtx);
  const base = CONFIG.rollBase + aptitude * CONFIG.aptitudeScale +
    gearBonus + quirkBonus + pluginRollBonus + burnoutPenalty + pityBonus + encoreBonus + perfBonus;
  return { aptitude, gearBonus, quirkBonus, burnoutPenalty, pityBonus, encoreBonus, perfBonus, base, jitter, appliedAccessories: applied };
}

// The keys an INCREDIBLE payload scales (§2E): every core stat the pack
// declares (symmetric across genres) plus the two magnitude resources fame &
// money. Exported so the cross-pack symmetry invariant guards the real engine
// set, not a copy of it.
export function incredibleTargets(): string[] {
  return [...PACK.manifest.stats, 'fame', 'money'];
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
  const useEncore = !!opts.encore && (state.encore || 0) > 0 && !encoreDisabled(state);
  if (useEncore) state.encore -= 1;

  // Shop affordability: a declined card is comedy, not a roll (spec §8 shop note)
  if (choice.cost && state.money < choice.cost) {
    (state.tierLog = state.tierLog || []).push('declined');
    (state.cardLog = state.cardLog || []).push({ e: ev.id, t: 'declined', a: state.act, s: side });
    const result: any = {
      tier: 'declined',
      text: 'Your card declines with an audible, judgmental beep. You pretend you “forgot your other wallet.” Everyone pretends to believe you.',
      deltas: applyEffects(state, PACK.manifest.declinePenalty || {}, ev, choice, rng),
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
  const encoreCap = CONFIG.encoreCap + perkSum(state, 'encoreCapBonus');
  if (tier === 'incredible' && (state.encore || 0) < encoreCap && !encoreDisabled(state)) {
    state.encore = (state.encore || 0) + 1;
    encoreEarned = true;
  }
  if (tier === 'incredible' && useEncore) state.encoreChained = true;
  // U3: riding the streak — an armed Encore that lands INCREDIBLE while
  // ON A ROLL refunds its token on top of the normal earn, cap be damned.
  let encoreRefunded = false;
  if (streakWasHot && useEncore && tier === 'incredible' && !encoreDisabled(state)) {
    state.encore = (state.encore || 0) + 1;
    encoreRefunded = true;
  }

  const outcome = choice.outcomes[tier];
  const effects = { ...outcome.effects };
  // U1: rarer × bigger — INCREDIBLE payloads land ~25% harder. The scaled set
  // is the MAGNITUDE payloads: every core stat the pack declares (§2E: this is
  // symmetric across genres — a mystery INCREDIBLE now boosts nerve/charm/
  // insight/alliance, which the hardcoded music list silently skipped) plus the
  // two magnitude resources fame & money. STRUCTURAL/story counters —
  // hits (a hit is a hit), pathProgress (momentum), rivalry (a feud) — stay
  // authored, exactly as the old list did. For music the set is identical
  // (skill/cred/creativity/network/fame/money), so music stays byte-green.
  if (tier === 'incredible' && CONFIG.incrediblePayloadMult) {
    for (const k of incredibleTargets()) {
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

  // One per-card context object (Phase F), shared by modifyEffects and
  // afterResolve so a subsystem can snapshot state between them WITHOUT
  // module-level scratch (the venue plugin used to keep `venueThisCard` at
  // module scope — safe only because runs are single-threaded; this fixes that).
  const cardCtx: any = { ev, choice, tier, rng };

  // Home-venue show bonus (venue plugin, Phase 4.2): lifts fame/cred on a
  // Good/Incredible night in your adopted room, before effects land.
  firePlugins('modifyEffects', state, effects, cardCtx);

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
  // Same cardCtx as modifyEffects, so the venue snapshot survives across them.
  firePlugins('afterResolve', state, result, cardCtx);

  // Lucky Pick-style gear: lost when it applied and things went Bad
  // (the Roadie Insurance perk keeps it bolted down)
  if (tier === 'bad' && !activePerks(state).some((p) => p.keepGearOnBad)) {
    for (const acc of c.appliedAccessories) {
      if (acc.loseOnBad && state.accessories.includes(acc.id)) {
        state.accessories = state.accessories.filter((a) => a !== acc.id);
        result.gearLost = acc;
      }
    }
  }

  if (effects.chainEventId) state.pendingChainId = effects.chainEventId;

  // Burnout coping interstitials: crossing a threshold interrupts the deck once
  // per run with a forced chain card (unless a chain is already queued). The
  // rules are PACK-DECLARED (D.3) — ordered high→low priority, first match
  // wins — so the card ids and any extra condition (music's "you have a hit",
  // which reads song state) live in the pack, not the core. A pack with no
  // interstitials (mystery, probe) never triggers this at all.
  const interstitials = PACK.interstitials || [];
  if (!state.pendingChainId && !state.tutorial && !ev.finaleCard &&
      interstitials.length && !interstitials.some((r) => r.id === ev.id)) {
    state.copingSeen = state.copingSeen || [];
    const b = state.stats.burnout;
    for (const r of interstitials) {
      if (state.copingSeen.includes(r.id)) continue;
      if (b < r.burnoutMin) continue;
      if (r.belowFail && b >= CONFIG.burnoutFail) continue;
      if (r.cond && !r.cond(state)) continue;
      state.copingSeen.push(r.id);
      state.pendingChainId = r.id;
      break;
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

  // Per-resolution gain-multiplier bags a subsystem contributes (contract, then
  // weather, in registration order), applied by the stat/burnout loops right
  // after the instrument's own (which is core — instruments are core). The core
  // keeps the multiplier MECHANIC; the SOURCES are plugins (WP6-infra).
  const bags = gainBags(state);
  for (const stat of stats()) {
    let v = effects[stat] || 0;
    if (!v) continue;
    // Positive stat gains scale by the instrument (core), then each subsystem's
    // per-stat multiplier — all generic, no stat named.
    if (v > 0 && hooks.statGainMult?.[stat]) v = Math.round(v * hooks.statGainMult[stat]);
    for (const bag of bags) if (v > 0 && bag.statGainMult?.[stat]) v = Math.round(v * bag.statGainMult[stat]);
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
    for (const bag of bags) if (v > 0 && bag.burnoutGainMult) v *= bag.burnoutGainMult;
    for (const bag of bags) if (v < 0 && bag.burnoutHealMult) v *= bag.burnoutHealMult;
    if (v < 0) v *= perkMult(state, 'burnoutHealMult');
    v = Math.round(v);
    if (v) {
      const before = state.stats.burnout;
      state.stats.burnout = clamp(before + v, 0, 100);
      push('burnout', state.stats.burnout - before);
    }
  }

  // Resource pass (WP5): iterate the pack's declared resources in manifest
  // order (so the delta order and the RNG-consuming 'hits' slot don't move),
  // dispatching each to a plugin's applyResource. The core names NO resource and
  // owns NO bespoke arithmetic — every clamp/multiplier/siphon (fame≥0, money's
  // mults+siphon, rivalry's 0–10, the songs 'hits' mint) lives in the pack's
  // plugins. A resource no plugin claims applies as a plain additive default, so
  // a novel genre resource (the probe's 'points') isn't silently dropped.
  // Per-resolution plugin context (Phase F): the deltas/hooks/accs/mg the
  // handlers read, plus a chartTitleHandled handshake for the songs plugin.
  const pctx: any = { ev, choice, tier, rng, deltas, hooks, accs, mg, chartTitleHandled: false };
  for (const res of PACK.manifest.resources) {
    let handled = false;
    for (const p of orderedPlugins()) {
      const rd = p.applyResource?.(res, effects, state, pctx);
      if (rd !== undefined && rd !== null) { if (rd) push(res, rd); handled = true; break; }
    }
    if (handled) continue;
    const v = effects[res] || 0;
    if (v) { state[res] = (state[res] || 0) + v; push(res, v); }
  }

  // Subsystem effect handlers, fired at this exact ordinal so their deltas/RNG
  // land where the old inline blocks did (byte-green): venue (adoptVenue),
  // songs (write/hype/release/album/polish/chartTitle), loadout (setInstrument),
  // band roster (grant/removeBandmate), hustle (grantHustle), gear
  // (grant/removeGear). The core owns only the neutral flag control below (WP4).
  firePlugins('onEffect', state, effects, pctx);
  if (effects.addFlag && !state.flags.includes(effects.addFlag)) state.flags.push(effects.addFlag);
  if (effects.removeFlag) state.flags = state.flags.filter((f) => f !== effects.removeFlag);
  return deltas;
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

function startAct(state, act) {
  state.act = act;
  state.cardsPlayedInAct = 0;
  state.shopPlayedInAct = false;
  state.phase = 'card';
  const notes = [];
  // Career Wall perks that fire at every act break (pack-declared — D.1).
  for (const p of activePerks(state)) p.onActBreak?.(state, notes);
  // Act-break plugins (Phase 4.4 band quirks, then Phase 4.5 songs: deadline
  // audit + chart week). Registration order [band, songs] reproduces the old
  // inline order — band quirks (notebook draws RNG) before the audit/tick.
  firePlugins('onActBreak', state, act, notes);
  // U5: the act twist is telegraphed the moment the act opens
  if (state.actTwist && state.actTwist.act === act) {
    notes.push(state.actTwist.delta < 0
      ? `✂️ The routing collapses — this leg runs ${-state.actTwist.delta} cards SHORT. Make them count.`
      : `➕ The promoter adds dates — this leg runs ${state.actTwist.delta} cards LONG. Pace yourself.`);
  }
  return notes;
}

// The Deadline contract's final audit when the career is evaluated. Hustle
// income at the finale now lands via hustlePlugin.onFinale (fired just before
// this in evaluateFinale); the deadline audit relocates to the songs subsystem
// in WP6. Notes are collected for parity but evaluateFinale discards them.
export function finalePayout(state) {
  return [...deadlineAudit(state, 3)];
}

export function checkFailStates(state) {
  if (state.tutorial) return null; // the first gig cannot end a career
  // The one universal fail: the engine owns the burnout slot, so every pack
  // fails when it maxes out. Everything else is the pack's, declared as
  // failStates and read generically through gateValue — the core names no
  // genre's stat (WP3). Rules are evaluated in declared order, after burnout, so
  // the old burnout → cancelled → debt precedence is preserved by the music
  // manifest's rule order.
  if (state.stats.burnout >= CONFIG.burnoutFail) return 'burnout';
  for (const rule of PACK.manifest.failStates || []) {
    if (rule.fromAct !== undefined && state.act < rule.fromAct) continue;
    if (rule.flag && !state.flags.includes(rule.flag)) continue;
    const v = gateValue(state, rule.key);
    const hit = rule.cmp === '<=' ? v <= rule.value
      : rule.cmp === '>=' ? v >= rule.value
      : rule.cmp === '<' ? v < rule.value : v > rule.value;
    if (hit) return rule.ending;
  }
  return null;
}

// ---------- Finale (spec §7.1) ----------

export function evaluateFinale(state) {
  state.phase = 'ended';
  firePlugins('onFinale', state); // songs plugin: one last chart week (Phase 4.5)
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
  // Sum the pack's core stats generically (§2E-class fix): the hardcoded
  // skill+cred+creativity+network read undefined→NaN for any non-music pack,
  // so a mystery/probe career scored NaN LP (serialized as null). Reading
  // manifest.stats is identical for music (same four keys) and correct for
  // every genre.
  const statSum = PACK.manifest.stats.reduce((n, k) => n + (s[k] || 0), 0);
  const base = Math.round((state.fame + statSum) / CONFIG.lpStatDivisor);
  const result = state.ending?.result;
  const bonus = result ? CONFIG.lpEndingBonus[result] : CONFIG.lpEndingBonus.failstate;
  // Subsystem score multipliers (contract lpMult, weather lpMult), folded in
  // registration order — the same order the old `mult *= …` used. The comeback
  // bonus is flag-based and genre-neutral, so it stays core.
  let mult = scoreMult(state);
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
