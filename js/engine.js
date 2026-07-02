// BIG BREAK — game engine (spec §4, §7, §8.4). Pure logic, no DOM:
// the same module runs in the browser and in tools/simulate.mjs.

import { CONFIG } from './config.js';
import { EVENTS } from './data/events.js';
import { INSTRUMENTS, instrumentById } from './data/instruments.js';
import { ACCESSORIES, accessoryById } from './data/accessories.js';
import { randomRival } from './data/rivals.js';
import { contractById } from './data/contracts.js';
import { hustleById } from './data/hustles.js';
import { genreById } from './data/genres.js';
import { venueById, VENUE_TIERS } from './data/venues.js';

function contractMods(state) {
  return contractById(state.contract)?.mods || {};
}

// Act length can be shortened by a contract (Overnight Success)
export function actLength(state, act) {
  return contractMods(state).actLengths?.[act] ?? CONFIG.actLengths[act];
}

const STATS = ['skill', 'cred', 'creativity', 'network'];

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

// ---------- Run lifecycle ----------

export function offerInstruments(unlockedInstrumentIds, rng = Math.random) {
  const pool = INSTRUMENTS.filter((i) => unlockedInstrumentIds.includes(i.id));
  const picks = [];
  const bag = [...pool];
  while (picks.length < 3 && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}

export function newRun(instrumentId, unlockedPacks, rng = Math.random, perks = []) {
  const inst = instrumentById(instrumentId);
  const state = {
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
    hustles: [],    // persistent income sources (see data/hustles.js)
    rival: randomRival(rng).id,
    rivalry: 3, // 0 = allies, 10 = blood feud; starts ambiguous
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
  return state;
}

// Instrument mastery (earned across runs): +level to every core stat
export function applyMastery(state, level) {
  const lv = Math.max(0, Math.min(3, level | 0));
  if (!lv) return;
  state.mastery = lv;
  for (const k of STATS) state.stats[k] = clamp(state.stats[k] + lv, 1, 100);
}

export function signContract(state, contractId) {
  state.contract = contractId;
  const mods = contractMods(state);
  if (mods.startMoney !== undefined) state.money = mods.startMoney;
}

// ---------- Deck assembly (spec §8.4) ----------

function actMatches(ev, act) {
  return Array.isArray(ev.act) ? ev.act.includes(act) : ev.act === act;
}

function meetsRequires(ev, state) {
  const r = ev.requires;
  if (!r) return true;
  if (r.flagsAll && !r.flagsAll.every((f) => state.flags.includes(f))) return false;
  if (r.flagsNone && r.flagsNone.some((f) => state.flags.includes(f))) return false;
  if (r.moneyMax !== undefined && state.money > r.moneyMax) return false;
  if (r.moneyMin !== undefined && state.money < r.moneyMin) return false;
  if (r.burnoutMin !== undefined && state.stats.burnout < r.burnoutMin) return false;
  if (r.fameMin !== undefined && state.fame < r.fameMin) return false;
  if (r.gear && !r.gear.every((g) => state.accessories.includes(g))) return false;
  if (r.rivalryMin !== undefined && (state.rivalry ?? 0) < r.rivalryMin) return false;
  if (r.rivalryMax !== undefined && (state.rivalry ?? 0) > r.rivalryMax) return false;
  if (r.genreAny && !state.genre) return false;
  if (r.hustleMin !== undefined && (state.hustles || []).length < r.hustleMin) return false;
  if (r.stats) {
    for (const [key, val] of Object.entries(r.stats)) {
      const stat = key.replace(/Min$/, '');
      const cur = stat === 'hits' ? state.hits : (state.stats[stat] ?? 0);
      if (cur < val) return false;
    }
  }
  return true;
}

function pathEligible(ev, state) {
  if (!ev.pathAffinity || ev.pathAffinity.length === 0) return true;
  if (state.act === 1) return false; // path cards never appear pre-commit
  return ev.pathAffinity.includes(state.path);
}

export function eligibleEvents(state) {
  return EVENTS.filter(
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
    const ev = EVENTS.find((e) => e.id === state.currentEventId);
    if (ev) return ev;
    state.currentEventId = null;
  }
  if (state.pendingChainId) {
    const ev = EVENTS.find((e) => e.id === state.pendingChainId);
    state.pendingChainId = null;
    if (ev) {
      state.currentEventId = ev.id;
      return ev;
    }
  }
  let pool = eligibleEvents(state);
  if (!pool.length) return null; // act runs dry -> caller advances act
  // Guarantee an opportunity/shop card once per act (spec §8.4.4)
  const shopDue = state.cardsPlayedInAct >= CONFIG.shopSlot[state.act] && !state.shopPlayedInAct;
  if (shopDue) {
    const shops = pool.filter((e) => e.shop);
    if (shops.length) pool = shops;
  }
  let total = 0;
  const weights = pool.map((ev) => {
    const affine = ev.pathAffinity && ev.pathAffinity.includes(state.path);
    const w = (ev.weight || 1) * (affine ? CONFIG.pathWeightMult : 1);
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
  return state.accessories.map(accessoryById).filter(Boolean);
}

function accessoryActive(acc, state) {
  if (acc.compatibility?.universal) return true;
  const inst = instrumentById(state.instrument);
  return !!inst && (acc.compatibility?.families || []).includes(inst.family);
}

function tagsIntersect(a, b) {
  return a && b && a.some((t) => b.includes(t));
}

// Roll components for a choice; used by both resolution and the risk tell.
// opts.encore adds the armed-Encore bonus so odds and rolls stay in sync.
export function rollComponents(state, choice, opts = {}) {
  const gs = choice.governingStats || {};
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

  const inst = instrumentById(state.instrument);
  let quirkBonus = 0;
  for (const tb of inst?.quirk?.hooks?.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }
  for (const gb of genreById(state.genre)?.bonuses || []) {
    if (tagsIntersect(gb.tags, choice.tags)) quirkBonus += gb.bonus;
  }

  const burnoutPenalty = -(state.stats.burnout * CONFIG.burnoutCoeff);
  const pityBonus = Math.min((state.badStreak || 0) * CONFIG.pityPerBad, CONFIG.pityCap);
  const cMods = contractMods(state);
  const encoreBonus = opts.encore && !cMods.disableEncore ? CONFIG.encoreBonus : 0;
  const jitter = cMods.jitter || inst?.quirk?.hooks?.jitter || [CONFIG.jitterMin, CONFIG.jitterMax];
  const base = CONFIG.rollBase + aptitude * CONFIG.aptitudeScale +
    gearBonus + quirkBonus + burnoutPenalty + pityBonus + encoreBonus;
  return { aptitude, gearBonus, quirkBonus, burnoutPenalty, pityBonus, encoreBonus, base, jitter, appliedAccessories: applied };
}

// Risk tell (spec §10): probability each tier fires, given uniform jitter.
export function choiceOdds(state, choice, opts = {}) {
  const c = rollComponents(state, choice, opts);
  const base = c.base;
  const [jMin, jMax] = c.jitter;
  const span = jMax - jMin + 1;
  let bad = 0, incredible = 0;
  for (let j = jMin; j <= jMax; j++) {
    const r = base + j;
    if (r < CONFIG.tierBadBelow) bad++;
    else if (r >= CONFIG.tierIncredibleAt) incredible++;
  }
  return { bad: bad / span, good: (span - bad - incredible) / span, incredible: incredible / span };
}

export function resolveSwipe(state, side, rng = Math.random, opts = {}) {
  const ev = EVENTS.find((e) => e.id === state.currentEventId);
  const choice = ev.choices[side];
  const useEncore = !!opts.encore && (state.encore || 0) > 0 && !contractMods(state).disableEncore;
  if (useEncore) state.encore -= 1;

  // Shop affordability: a declined card is comedy, not a roll (spec §8 shop note)
  if (choice.cost && state.money < choice.cost) {
    (state.tierLog = state.tierLog || []).push('declined');
    (state.cardLog = state.cardLog || []).push({ e: ev.id, t: 'declined', a: state.act, s: side });
    const result = {
      tier: 'declined',
      text: 'Your card declines with an audible, judgmental beep. You pretend you “forgot your other wallet.” Everyone pretends to believe you.',
      deltas: applyEffects(state, { cred: -2 }, ev, choice, rng),
      event: ev, side,
    };
    finishCard(state, ev);
    return result;
  }

  const c = rollComponents(state, choice, { encore: useEncore });
  const jitter = randInt(rng, c.jitter[0], c.jitter[1]);
  const roll = c.base + jitter;
  let tier;
  if (roll < CONFIG.tierBadBelow) tier = 'bad';
  else if (roll >= CONFIG.tierIncredibleAt) tier = 'incredible';
  else tier = 'good';
  state.badStreak = tier === 'bad' ? (state.badStreak || 0) + 1 : 0;
  (state.tierLog = state.tierLog || []).push(tier);
  (state.cardLog = state.cardLog || []).push({ e: ev.id, t: tier, a: state.act, s: side });
  let encoreEarned = false;
  const encoreCap = (state.perks || []).includes('crowdwork') ? CONFIG.encoreCap + 1 : CONFIG.encoreCap;
  if (tier === 'incredible' && (state.encore || 0) < encoreCap && !contractMods(state).disableEncore) {
    state.encore = (state.encore || 0) + 1;
    encoreEarned = true;
  }
  if (tier === 'incredible' && useEncore) state.encoreChained = true;

  const outcome = choice.outcomes[tier];
  const effects = { ...outcome.effects };

  // Instrument quirk: bonus effects on Incredible (e.g. Kazoo's Novelty)
  const inst = instrumentById(state.instrument);
  if (tier === 'incredible' && inst?.quirk?.hooks?.onIncredible) {
    for (const [k, v] of Object.entries(inst.quirk.hooks.onIncredible)) {
      effects[k] = (effects[k] || 0) + v;
    }
  }

  // Home venue: a show in your adopted room. The home crowd lifts a Good/
  // Incredible night (flat fame+cred by venue level), and every show there
  // builds the room toward a local institution.
  const venue = venueById(state.venue);
  let venueHosted = false;
  if (venue && tier !== 'bad' && tier !== 'declined' && tagsIntersect(venue.tags, choice.tags)) {
    venueHosted = true;
    const bonus = VENUE_TIERS[state.venueLevel]?.showBonus || 0;
    if (bonus) {
      effects.fame = (effects.fame || 0) + bonus;
      effects.cred = (effects.cred || 0) + Math.ceil(bonus / 2);
    }
  }

  const deltas = applyEffects(state, effects, ev, choice, rng, tier, c.appliedAccessories);
  const result = {
    tier, roll: Math.round(roll), text: outcome.text, deltas, event: ev, side,
    encoreEarned, encoreSpent: useEncore,
  };

  // Build the room: venue-tagged shows (any tier — you showed up) level it up
  if (venue && tagsIntersect(venue.tags, choice.tags)) {
    state.venueShows = (state.venueShows || 0) + 1;
    const newLevel = Math.min(VENUE_TIERS.length - 1, Math.floor(state.venueShows / 2));
    if (newLevel > state.venueLevel) {
      state.venueLevel = newLevel;
      result.venueLeveled = { venue, level: newLevel, tier: VENUE_TIERS[newLevel] };
    } else if (venueHosted && (VENUE_TIERS[state.venueLevel]?.showBonus || 0) > 0) {
      result.venueHosted = { venue, tier: VENUE_TIERS[state.venueLevel] };
    }
  }

  // Lucky Pick-style gear: lost when it applied and things went Bad
  if (tier === 'bad') {
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
  if (!state.pendingChainId && ev.id !== 'coping_50' && ev.id !== 'coping_75') {
    state.copingSeen = state.copingSeen || [];
    const b = state.stats.burnout;
    if (b >= 75 && !state.copingSeen.includes('coping_75') && b < CONFIG.burnoutFail) {
      state.copingSeen.push('coping_75');
      state.pendingChainId = 'coping_75';
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
  state.currentEventId = null;
}

// Applies an effects payload; returns display deltas [{key, amount}].
function applyEffects(state, effects, ev, choice, rng, tier, appliedAccessories = []) {
  const deltas = [];
  const inst = instrumentById(state.instrument);
  const hooks = inst?.quirk?.hooks || {};
  const accs = equippedAccessories(state).filter((a) => accessoryActive(a, state));
  const tags = choice?.tags || [];

  const push = (key, amount) => { if (amount) deltas.push({ key, amount }); };

  const cMods = contractMods(state);
  for (const stat of STATS) {
    let v = effects[stat] || 0;
    if (!v) continue;
    if (stat === 'cred' && v > 0 && hooks.credGainMult) v = Math.round(v * hooks.credGainMult);
    if (stat === 'cred' && v > 0 && cMods.credGainMult) v = Math.round(v * cMods.credGainMult);
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
    if (v < 0 && cMods.burnoutHealMult) v *= cMods.burnoutHealMult;
    if (v < 0 && (state.perks || []).includes('therapist')) v *= 1.25;
    v = Math.round(v);
    if (v) {
      const before = state.stats.burnout;
      state.stats.burnout = clamp(before + v, 0, 100);
      push('burnout', state.stats.burnout - before);
    }
  }

  {
    let v = effects.fame || 0;
    if (v && hooks.fameSwingMult) v = Math.round(v * hooks.fameSwingMult);
    if (v) {
      const before = state.fame;
      state.fame = Math.max(0, state.fame + v);
      push('fame', state.fame - before);
    }
  }

  {
    let v = effects.money || 0;
    if (v > 0) {
      if (hooks.moneyGainMult) v = Math.round(v * hooks.moneyGainMult);
      for (const acc of accs) {
        if (acc.moneySiphon) v = Math.round(v * (1 - acc.moneySiphon));
      }
    }
    if (v) { state.money += v; push('money', v); }
  }

  if (effects.hits) { state.hits += effects.hits; push('hits', effects.hits); }
  if (effects.pathProgress) { state.pathProgress += effects.pathProgress; push('pathProgress', effects.pathProgress); }
  if (effects.rivalry) {
    const before = state.rivalry ?? 3;
    state.rivalry = clamp(before + effects.rivalry, 0, 10);
    push('rivalry', state.rivalry - before);
  }

  if (effects.chartTitle) {
    state.chartTitles = state.chartTitles || [];
    state.chartTitles.unshift(effects.chartTitle);
  }
  if (effects.addFlag && !state.flags.includes(effects.addFlag)) state.flags.push(effects.addFlag);
  if (effects.removeFlag) state.flags = state.flags.filter((f) => f !== effects.removeFlag);

  if (effects.setInstrument) {
    const newInst = instrumentById(effects.setInstrument);
    if (newInst && state.instrument !== newInst.id) {
      state.instrument = newInst.id;
      state.swappedInstrument = true;
      deltas.instrumentSet = newInst;
    }
  }
  if (effects.grantHustle) {
    state.hustles = state.hustles || [];
    if (!state.hustles.includes(effects.grantHustle)) {
      state.hustles.push(effects.grantHustle);
      deltas.hustleGained = hustleById(effects.grantHustle);
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
  const basics = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder', 'merch_cannon'];
  const goods = ['pedalboard', 'vintage_mic', 'loud_amp', 'loop_pedal', 'in_ears', 'cursed_8track', 'stage_fan', 'humidifier'];
  const ids = grant === 'random_basic' ? basics : goods;
  let pool = ids.filter((id) => !owned.has(id)).map(accessoryById).filter(Boolean);
  if (!pool.length) {
    pool = ACCESSORIES.filter((a) => a.unlockedByDefault && !owned.has(a.id));
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
    const basics = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder'];
    const goods = ['pedalboard', 'vintage_mic', 'loud_amp', 'cursed_8track', 'stage_fan', 'in_ears'];
    const ids = grant === 'random_basic' ? basics : goods;
    candidates = ids.filter((id) => !owned.has(id)).map(accessoryById).filter(Boolean);
    if (!candidates.length) {
      candidates = ACCESSORIES.filter((a) => a.unlockedByDefault && !owned.has(a.id));
    }
  } else {
    const acc = accessoryById(grant);
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
  const acc = accessoryById(accId);
  const deltas = [];
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
  for (const acc of equippedAccessories(state)) {
    if (acc.upkeep) {
      state.money -= acc.upkeep;
      notes.push(`${acc.name}: −$${acc.upkeep} upkeep`);
    }
  }
  for (const id of state.hustles || []) {
    const h = hustleById(id);
    if (h) {
      state.money += h.moneyPerAct;
      notes.push(`${h.icon} ${h.name}: +$${h.moneyPerAct}`);
    }
  }
  return notes;
}

// Hustles pay out one final time when the career is evaluated
export function finalePayout(state) {
  const notes = [];
  for (const id of state.hustles || []) {
    const h = hustleById(id);
    if (h) {
      state.money += h.moneyPerAct;
      notes.push(`${h.icon} ${h.name}: +$${h.moneyPerAct}`);
    }
  }
  return notes;
}

export function checkFailStates(state) {
  if (state.stats.burnout >= CONFIG.burnoutFail) return 'burnout';
  if (state.act >= CONFIG.credFailFromAct && state.stats.cred <= 0) return 'cancelled';
  if (state.money <= CONFIG.debtFailMoney && state.flags.includes('debt')) return 'debt';
  return null;
}

// ---------- Finale (spec §7.1) ----------

export function evaluateFinale(state) {
  state.phase = 'ended';
  finalePayout(state);
  const gates = CONFIG.winGates[state.path];
  const readings = Object.entries(gates).map(([key, target]) => {
    const value = key === 'fame' ? state.fame : key === 'hits' ? state.hits : state.stats[key];
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
  const mult = contractById(state.contract)?.lpMult || 1;
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
    // Hot 10 peak (mirrors js/charts.js playerChartInfo)
    chartPeak: (state.fame + state.hits * 15) >= 20
      ? Math.max(1, Math.min(10, 11 - Math.floor((state.fame + state.hits * 15) / 12)))
      : null,
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
  };
}
