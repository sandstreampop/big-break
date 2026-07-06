// BIG BREAK — the genre-agnostic game engine. Pure logic, no DOM: the same
// module runs in the browser and in the sims. It imports no content module.

import { CONFIG } from './config.js';
import type { Pack, RunState, Plugin, GameEvent, Choice, Side, Requires, Tier, GainBag } from './types.js';

// ---------- Injected content pack ----------
// A genre is a Pack, injected at run start (newRun) and re-affirmed at
// boot/resume (useContentPack); one session runs one active pack. Every
// subsystem lives in that pack's plugins, which own their data — the engine
// never reaches for a genre's content by name, so a genre that omits a
// subsystem needs no stub. The whole surface the core touches is the Pack:
// id, manifest, events, tutorialEvents, loadouts, and its optional
// plugins/presenter/perks/interstitials.
let PACK: Pack;
export function useContentPack(pack: Pack): void {
  PACK = pack;
}
export function activePack(): Pack {
  return PACK;
}

// Tutorial cards live outside PACK.events so they can never enter normal decks;
// chains and resume still need to find them by id. Exported as a plugin-facing
// service so a subsystem (seeds) can inspect the deck without importing it.
export function findEvent(id: string): GameEvent | null {
  return PACK.events.find((e) => e.id === id) || PACK.tutorialEvents.find((e) => e.id === id) || null;
}

// The run's macro shape: the manifest's ordered segment list (ADR-0010).
// `state.act` is the 1-indexed position in it; the last segment terminates in
// the finale. The engine hardcodes no segment count.
function segments(): import('./types.js').SegmentDef[] {
  return PACK.manifest.segments;
}

// The number of cards a segment runs: the manifest's declared length, which a
// subsystem may bend (modifyActLength), plus this run's act twist.
export function actLength(state: RunState, act: number) {
  if (state.tutorial) return PACK.tutorialEvents.length;
  const base = foldActLength(state, act, segments()[act - 1]?.length ?? 0);
  const twist = state.actTwist && state.actTwist.act === act ? state.actTwist.delta : 0;
  return Math.max(3, base + twist);
}

// The pack's core stats. Order is load-bearing — it fixes the order stat deltas
// are recorded, which the goldens pin — so a pack must keep it stable.
const stats = () => PACK.manifest.stats;

function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ---------- Seeded, resume-safe RNG ----------
// Every run carries a seed + draw counter, so a run replays identically
// after a tab death, and Daily Grind runs are identical for everyone.

export function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rngCache = new WeakMap();
export function stateRng(state: RunState) {
  if (!state.seed) { // legacy saves: fall back to Math.random
    return Math.random;
  }
  return () => {
    let c = rngCache.get(state);
    if (!c || c.uses !== (state.rngUses || 0) || c.seed !== state.seed) {
      const gen = mulberry32(state.seed!);
      for (let i = 0; i < (state.rngUses || 0); i++) gen();
      c = { gen, uses: state.rngUses || 0, seed: state.seed };
      rngCache.set(state, c);
    }
    c.uses += 1;
    state.rngUses = c.uses;
    return c.gen();
  };
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// Read any stat- or resource-key's value generically: core stats live in
// state.stats, resources live top-level. Every winGates/requires key resolves
// through here, so the core special-cases no key.
export function gateValue(state: RunState, key: string): number {
  return (key in state.stats) ? state.stats[key] : (state[key] ?? 0);
}

// ---------- Run lifecycle ----------

export function offerLoadouts(unlockedLoadoutIds: string[], rng: () => number = Math.random) {
  const pool = PACK.loadouts.filter((i) => unlockedLoadoutIds.includes(i.id));
  const picks = [];
  const bag = [...pool];
  while (picks.length < 3 && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}

export function newRun(pack: Pack, loadoutId: string, unlockedPacks: string[], rng: () => number = Math.random, perks: string[] = []) {
  PACK = pack; // this run's content pack; also settable via useContentPack
  const inst = PACK.loadoutById(loadoutId);
  // Roll each core stat in manifest order, then burnout. Manifest order fixes
  // the seeded draw order, so a pack must keep it stable (the goldens pin it).
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
    badStreak: 0,
    encore: 0,
    encoreChained: false,
    copingSeen: [],
    // Per-run entropy for a pack's cosmetic/flavor randomness, distinct from the
    // play RNG `seed`. Drawn here as the first construction draw — the goldens
    // pin its ordinal, so it must stay first.
    flavorSeed: Math.floor(rng() * 1e9) + 1,
    seed: null,     // play RNG seed (set by caller; null = legacy Math.random)
    rngUses: 0,
    daily: null,    // 'YYYY-MM-DD' when this is a Daily Grind run
    gauntlet: null, // 'YYYY-Www' when this is a weekly Gauntlet run
    tierLog: [],
    cardLog: [],    // [{e: eventId, t: tier, a: act, s: side}] — scrapbook
    promises: [],   // short-horizon objectives [{label,tags,remaining,reward,penalty}]
    seenCards: null, // per-player seen-card ids (set by the UI from meta)
    flashpointAt: null,
    flashpointSeen: false,
    hotStreak: 0,
    actTwist: null,
    path: null,
    loadout: loadoutId,
    firstLoadout: loadoutId,
    flags: [],
    usedEvents: [],
    unlockedPacks: unlockedPacks || [],
    currentEventId: null,
    pendingChainId: null,
    ending: null, // { key, result } once ended
  };
  // Resources initialized from the manifest (0, or a declared resourceStart),
  // in manifest order — so the core names no genre's resource.
  for (const r of pack.manifest.resources) state[r] = pack.manifest.resourceStart?.[r] ?? 0;
  // Each plugin's run-state slots, applied generically from its stateDefaults
  // (arrays copied per run) so the core state literal declares no genre's field.
  // onConstruct (below) may then overwrite a slot with a seeded draw.
  for (const p of orderedPlugins()) {
    if (!p.stateDefaults) continue;
    for (const [k, v] of Object.entries(p.stateDefaults)) state[k] = Array.isArray(v) ? v.slice() : v;
  }
  // Seeded construction draws, in FROZEN order: flavorSeed above, then the
  // plugins' onConstruct draws, then flashpoint and actTwist here, then the
  // onRunStart draws at the tail. Reordering any of these invalidates the
  // entire golden corpus.
  firePlugins('onConstruct', state, rng);
  // ~25% of runs schedule one flashpoint; ~20% bend a segment by
  // ±actTwistDelta. The twist lands on any segment after the first (for the
  // classic 3-segment shape that's randInt(rng, 2, 3) — the exact draw the
  // goldens pin).
  state.flashpointAt = rng() < CONFIG.flashpointChance
    ? randInt(rng, CONFIG.flashpointWindow[0], CONFIG.flashpointWindow[1]) : null;
  state.actTwist = rng() < CONFIG.actTwistChance
    ? { act: randInt(rng, 2, pack.manifest.segments.length), delta: rng() < 0.5 ? -CONFIG.actTwistDelta : CONFIG.actTwistDelta }
    : null;
  if (inst) {
    for (const [k, v] of Object.entries(inst.modifiers || {})) {
      if (k in state.stats) state.stats[k] = clamp(state.stats[k] + (v as number), 1, 100);
    }
  }
  // Always-on run-start perk bonuses, pack-declared. The bumps touch independent
  // fields, so their order is immaterial.
  state.perks = perks;
  for (const p of activePerks(state)) p.onRunStart?.(state);
  // Run-start subsystem hook, fired at the tail of construction — its seeded
  // draws land after every construction draw above, so the plugins own the tail
  // of the frozen draw order.
  firePlugins('onRunStart', state, rng);
  return state;
}

// The scripted onboarding run: a pack-declared teaching setup (fixed stats,
// persona, resources) played as one long chain. Only a pack that ships
// tutorialEvents reaches here.
export function newTutorialRun(pack: Pack, rng = Math.random) {
  const t = pack.tutorialStart;
  const state = newRun(pack, t?.loadout ?? pack.loadouts[0].id, [], rng, []);
  state.tutorial = true;
  if (t?.stats) state.stats = { ...t.stats } as RunState['stats'];
  if (t?.resources) for (const [k, v] of Object.entries(t.resources)) state[k] = v;
  state.pendingChainId = PACK.tutorialEvents[0].id;
  return state;
}

// A pack-provided run transform applied when the player has unlocked it (music's
// comeback mode restarts a career as a faded name). It hardcodes the pack's own
// stats, so the engine only dispatches to it; a pack without one is a no-op.
export function applyComeback(state: RunState) {
  PACK.comeback?.(state);
}

// Loadout mastery (earned across runs): +level to every core stat
export function applyMastery(state: RunState, level: number) {
  const lv = Math.max(0, Math.min(3, level | 0));
  if (!lv) return;
  state.mastery = lv;
  for (const k of stats()) state.stats[k] = clamp(state.stats[k] + lv, 1, 100);
}

// ---------- Deck assembly ----------

export function actMatches(ev: GameEvent, act: number) {
  return Array.isArray(ev.act) ? ev.act.includes(act) : ev.act === act;
}

function meetsRequires(ev: GameEvent, state: RunState) {
  return requiresOk(ev.requires, state);
}

// The neutral keys requiresOk resolves inline; every other key is dispatched to
// a pack-registered predicate. Kept in sync with the core Requires type.
const REQUIRES_NEUTRAL = new Set([
  'anyOf', 'flagsAll', 'flagsNone', 'burnoutMin', 'stats', 'min', 'max',
]);

// The merged predicate registry for the active pack — each plugin's `requires`
// map contributes its keys, and requiresOk dispatches a non-neutral key here.
// Memoized per pack: building it is cheap but this sits in the deck hot path.
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
// can test its own conditions with the same semantics.
export function requiresOk(r: Requires | null | undefined, state: RunState) {
  if (!r) return true;
  // anyOf: alternative gates — the card fires if ANY branch is satisfied.
  if (r.anyOf && !r.anyOf.some((alt) => requiresOk(alt, state))) return false;
  if (r.flagsAll && !r.flagsAll.every((f) => state.flags.includes(f))) return false;
  if (r.flagsNone && r.flagsNone.some((f) => state.flags.includes(f))) return false;
  if (r.burnoutMin !== undefined && state.stats.burnout < r.burnoutMin) return false;
  // Generic stat/resource gates, resolved through gateValue for any manifest
  // key: `stats` uses the `{ <key>Min: n }` shape; `min`/`max` the plain
  // `{ <key>: n }` form.
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
  // Every other key is a subsystem predicate its owning plugin registered. Each
  // consumes no rng and returns a plain boolean, so the gate is a pure
  // conjunction whose evaluation order is immaterial. An unregistered key is a
  // no-op here, caught structurally by the "requires key owned" invariant.
  const preds = requiresPredicates();
  for (const key of Object.keys(r)) {
    if (REQUIRES_NEUTRAL.has(key)) continue;
    const pred = preds[key];
    if (pred && !pred(state, (r as any)[key])) return false;
  }
  return true;
}

function pathEligible(ev: GameEvent, state: RunState) {
  if (!ev.pathAffinity || ev.pathAffinity.length === 0) return true;
  if (!state.path) return false; // path cards never appear pre-commit
  return ev.pathAffinity.includes(state.path);
}

export function eligibleEvents(state: RunState) {
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

export function drawNextCard(state: RunState, rng: () => number = Math.random) {
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
  // Flashpoints live outside the normal deck: max one per run, only in runs that
  // scheduled one, dealt when the window opens — or summoned early by a hot
  // streak.
  const streakHot = !state.tutorial && (state.hotStreak || 0) >= CONFIG.hotStreakAt;
  const flashDue = state.flashpointAt != null && !state.flashpointSeen &&
    ((state.cardLog || []).length >= state.flashpointAt || streakHot);
  const flashes = flashDue ? pool.filter((e) => e.flashpoint) : [];
  pool = pool.filter((e) => !e.flashpoint);
  if (!pool.length && !flashes.length) return null;
  if (flashes.length) {
    pool = flashes;
  } else {
    // Guarantee an opportunity/shop card once per act.
    const shopDue = state.cardsPlayedInAct >= CONFIG.shopSlot[state.act] && !state.shopPlayedInAct;
    if (shopDue) {
      const shops = pool.filter((e) => e.shop);
      if (shops.length) pool = shops;
    }
    // A plugin may force a scheduled category of card into the pool, the same
    // way the shop slot above does (the seeds plugin deals an unlit arc's setup).
    pool = foldDeckPool(state, pool, { shopDue });
    // On a hot streak, lean the deck all the way into cards this player has
    // never seen — streaks are for discovering.
    if (streakHot && !shopDue && state.seenCards) {
      const seenSet = new Set(state.seenCards);
      const unseen = pool.filter((e) => !seenSet.has(e.id));
      if (unseen.length) pool = unseen;
    }
  }
  // Personal novelty: cards this player has never seen draw heavier. On a first
  // install everything is unseen, so nothing shifts.
  const seen = state.seenCards ? new Set(state.seenCards) : null;
  let total = 0;
  const weights = pool.map((ev) => {
    const affine = ev.pathAffinity && ev.pathAffinity.includes(state.path as string);
    let w = (ev.weight || 1) *
      (affine ? CONFIG.pathWeightMult : 1) *
      (seen && !seen.has(ev.id) ? CONFIG.noveltyWeightMult : 1);
    // Plugin deck-weight bias, folded in after the core path/novelty factors.
    // The novelty factor is 1 whenever seenCards is unset (as in the goldens),
    // so that ×1 is a true no-op and this grouping stays float-exact.
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

// ---------- Resolution ----------

export function tagsIntersect(a?: string[], b?: string[]) {
  return a && b && a.some((t) => b.includes(t));
}

// ---------- Plugin dispatch ----------
// The lifecycle hooks a plugin may implement. Typed, so a typo'd hook name is a
// COMPILE error rather than a silent no-op.
type PluginHook = 'onConstruct' | 'onRunStart' | 'modifyEffects' | 'onEffect'
  | 'afterResolve' | 'onActBreak' | 'onTick' | 'onFinale';

// Plugins fire in ascending `priority` (default 0), ties broken by registration
// order (a stable sort) — so a pack declares its ordering intent rather than
// relying on array position alone.
function orderedPlugins(): Plugin[] {
  const plugins = PACK.plugins;
  if (!plugins) return [];
  return plugins
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.priority ?? 0) - (b.p.priority ?? 0) || a.i - b.i)
    .map((x) => x.p);
}

// Fire a lifecycle hook across the active pack's plugins. Empty/absent registry
// is a no-op, so a dispatch point costs nothing until a plugin uses it.
function firePlugins(hook: PluginHook, ...args: any[]): void {
  for (const p of orderedPlugins()) {
    const fn = p[hook] as ((...a: any[]) => void) | undefined;
    if (fn) fn.apply(p, args);
  }
}

// ── Plugin-fold combinators. The five ways the engine combines a plugin hook's
// contribution to a core mechanic, each iterating orderedPlugins() ONCE, in
// registration/priority order. Every modify-fold below is a one-line adapter
// over one of these — so "how does the engine combine plugin X?" is answered in
// exactly one place, and the core keeps the mechanic while never naming a
// plugin. A hook that returns undefined (i.e. the plugin didn't implement it)
// contributes the combinator's identity. ──

// Σ of a numeric hook (identity 0).
function sum(fn: (p: Plugin) => number | undefined): number {
  let n = 0;
  for (const p of orderedPlugins()) n += fn(p) ?? 0;
  return n;
}
// Π of a numeric hook (identity 1) — float-exact, so no-multiplier runs are unchanged.
function product(fn: (p: Plugin) => number | undefined): number {
  let m = 1;
  for (const p of orderedPlugins()) m *= fn(p) ?? 1;
  return m;
}
// OR of a predicate hook (identity false), short-circuiting.
function some(fn: (p: Plugin) => boolean | undefined): boolean {
  for (const p of orderedPlugins()) if (fn(p)) return true;
  return false;
}
// Gather each plugin's truthy contribution into a list.
function collect<T>(fn: (p: Plugin) => T | undefined | null): T[] {
  const out: T[] = [];
  for (const p of orderedPlugins()) { const v = fn(p); if (v) out.push(v); }
  return out;
}
// Thread an accumulator through the plugins that implement the hook — each
// receives the running value and returns the next (undefined = leave unchanged).
function foldChain<T>(seed: T, fn: (p: Plugin, acc: T) => T | undefined): T {
  let acc = seed;
  for (const p of orderedPlugins()) { const next = fn(p, acc); if (next !== undefined) acc = next; }
  return acc;
}

// ── The modify-folds: one adapter per core mechanic, over the combinators above. ──

// Additive roll bonus, summed across plugins.
function sumRollBonus(state: RunState, choice: Choice, ctx: any): number {
  return sum((p) => p.modifyRoll?.(state, choice, ctx));
}
// Fold each plugin's transform of the roll's jitter band.
function foldJitter(state: RunState, jitter: [number, number], ctx: any): [number, number] {
  return foldChain(jitter, (p, j) => p.modifyJitter?.(state, j, ctx));
}
// The per-resolution gain-multiplier bags plugins contribute, applied by the
// stat/burnout loops after the loadout's own (core).
function gainBags(state: RunState): GainBag[] {
  return collect((p) => p.gainHooks?.(state));
}
// Does any plugin disable the Encore mechanic this run?
function encoreDisabled(state: RunState): boolean {
  return some((p) => p.blocksEncore?.(state));
}
// Fold each plugin's burnout-delta adjustment, between the loadout's own burnout
// hooks and the gain-multiplier bags.
function foldBurnout(state: RunState, v: number, ctx: any): number {
  return foldChain(v, (p, x) => p.modifyBurnout?.(state, x, ctx));
}
// Fold each plugin's deck-weight multiplier.
function foldDeckWeight(state: RunState, ev: GameEvent, weight: number): number {
  return foldChain(weight, (p, w) => p.weightDeck?.(state, ev, w));
}
// Let each plugin force a scheduled category into the draw pool.
function foldDeckPool(state: RunState, pool: GameEvent[], ctx: any): GameEvent[] {
  return foldChain(pool, (p, pl) => p.refineDeck?.(state, pl, ctx));
}
// Product of each plugin's Legacy Points multiplier. Starts at 1 (identity), so
// a run with no multipliers scores float-exactly the unmultiplied base.
function scoreMult(state: RunState): number {
  return product((p) => p.scoreMult?.(state));
}
// Fold each plugin's act-length override.
function foldActLength(state: RunState, act: number, base: number): number {
  return foldChain(base, (p, b) => p.modifyActLength?.(state, act, b));
}

// ---------- Perks (pack-declared run modifiers) ----------
// The active run's perk definitions, looked up from the pack's perk table. The
// engine knows no perk id; it sums/applies whatever the perks declare at the
// matching lifecycle point.
function activePerks(state: RunState): import('./types.js').PerkDef[] {
  const table = PACK.perks || {};
  return (state.perks || []).map((id: string) => table[id]).filter(Boolean);
}
// Product of a numeric perk knob across the active perks (default 1 → identity).
function perkMult(state: RunState, key: string): number {
  return activePerks(state).reduce((m, p) => m * ((p as any)[key] ?? 1), 1);
}
// Sum of a numeric perk knob across the active perks (default 0).
function perkSum(state: RunState, key: string): number {
  return activePerks(state).reduce((n, p) => n + ((p as any)[key] ?? 0), 0);
}

// Roll components for a choice; used by both resolution and the risk tell.
// opts.encore adds the armed-Encore bonus so odds and rolls stay in sync.
export function rollComponents(state: RunState, choice: Choice, opts: any = {}) {
  const gs: Record<string, number> = choice.governingStats || {};
  let sum = 0, wsum = 0;
  for (const [stat, w] of Object.entries(gs)) {
    sum += (state.stats[stat] ?? 0) * w;
    wsum += w;
  }
  const aptitude = wsum ? sum / wsum : 30;

  // Items whose roll bonus fired this card, recorded by a plugin's modifyRoll
  // via rollCtx.applied; resolution reads them back for lose-on-bad and burnout
  // side effects.
  const applied: any[] = [];

  const inst = PACK.loadoutById(state.loadout);
  let quirkBonus = 0;
  // The loadout's tag bonus is core; every subsystem tag bonus folds in via
  // modifyRoll below.
  for (const tb of inst?.quirk?.hooks?.rollTagBonus || []) {
    if (tagsIntersect(tb.tags, choice.tags)) quirkBonus += tb.bonus;
  }

  const burnoutPenalty = -(state.stats.burnout * CONFIG.burnoutCoeff);
  const pityPer = CONFIG.pityPerBad + perkSum(state, 'pityPerBonus');
  const pityBonus = Math.min((state.badStreak || 0) * pityPer, CONFIG.pityCap + perkSum(state, 'pityCapBonus'));
  // Subsystem roll bonuses, folded in in registration order; rollCtx.applied
  // collects the items whose bonus fired.
  const rollCtx: any = { applied, tags: choice.tags };
  const pluginRollBonus = sumRollBonus(state, choice, rollCtx);
  const encoreBonus = opts.encore && !encoreDisabled(state) ? CONFIG.encoreBonus : 0;
  // Performance bonus: a minigame result (UI-side skill) folded into the roll.
  const perfBonus = opts.bonus || 0;
  // Base jitter is the loadout's or the per-act default; plugins may override or
  // widen it via modifyJitter, in registration order.
  let jitter: [number, number] = inst?.quirk?.hooks?.jitter ||
    CONFIG.jitterByAct?.[state.act] || [CONFIG.jitterMin, CONFIG.jitterMax];
  jitter = foldJitter(state, jitter, rollCtx);
  // The loadout's quirk bonus is core; every subsystem bonus arrives via
  // pluginRollBonus. All are integers, so the sum is grouping-independent.
  const base = CONFIG.rollBase + aptitude * CONFIG.aptitudeScale +
    quirkBonus + pluginRollBonus + burnoutPenalty + pityBonus + encoreBonus + perfBonus;
  return { aptitude, quirkBonus, burnoutPenalty, pityBonus, encoreBonus, perfBonus, base, jitter, appliedAccessories: applied };
}

// The keys an INCREDIBLE payload scales: every core stat the pack declares plus
// the magnitude resources its manifest designates. Exported so the cross-pack
// symmetry invariant guards the real engine set, not a copy of it.
export function incredibleTargets(): string[] {
  return [...PACK.manifest.stats, ...(PACK.manifest.incredibleResources || [])];
}

// Rolls compress above the soft cap, so a maxed-out build still sweats the
// jitter instead of auto-clearing the INCREDIBLE bar every card.
function softCap(roll: number) {
  return roll > CONFIG.rollSoftCap
    ? CONFIG.rollSoftCap + (roll - CONFIG.rollSoftCap) * 0.5
    : roll;
}

// Risk tell: probability each tier fires, given uniform jitter.
export function choiceOdds(state: RunState, choice: Choice, opts: any = {}) {
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

export function resolveSwipe(state: RunState, side: Side, rng: () => number = Math.random, opts: any = {}) {
  const ev = findEvent(state.currentEventId)!;
  const choice = ev.choices[side];
  const useEncore = !!opts.encore && (state.encore || 0) > 0 && !encoreDisabled(state);
  if (useEncore) state.encore -= 1;

  // Shop affordability: a declined card is comedy, not a roll. The currency is
  // the manifest's cost-resource role, not a named one.
  const costResource = PACK.manifest.costResource;
  if (choice.cost && costResource && state[costResource] < choice.cost) {
    (state.tierLog = state.tierLog || []).push('declined');
    (state.cardLog = state.cardLog || []).push({ e: ev.id, t: 'declined', a: state.act, s: side });
    const result: any = {
      tier: 'declined',
      text: PACK.manifest.declineText ||
        'Your card declines with an audible, judgmental beep. You pretend you “forgot your other wallet.” Everyone pretends to believe you.',
      deltas: applyEffects(state, PACK.manifest.declinePenalty || {}, ev, choice, rng),
      event: ev, side,
    };
    finishCard(state, ev);
    return result;
  }

  const c = rollComponents(state, choice, { encore: useEncore, bonus: opts.bonus || 0 });
  const jitter = randInt(rng, c.jitter[0], c.jitter[1]);
  const roll = softCap(c.base + jitter);
  let tier: Tier;
  if (roll < CONFIG.tierBadBelow) tier = 'bad';
  else if (roll >= CONFIG.tierIncredibleAt) tier = 'incredible';
  else tier = 'good';
  // Tutorial cards can script their outcome so each lesson lands
  // deterministically ('encoreUp': incredible only if the Encore was armed)
  const forced = ev.forceTier?.[side];
  if (forced) tier = forced === 'encoreUp' ? (useEncore ? 'incredible' : 'good') : forced;
  state.badStreak = tier === 'bad' ? (state.badStreak || 0) + 1 : 0;
  // Was the hot streak already lit when this swipe happened?
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
  // Riding the streak: an armed Encore that lands INCREDIBLE while the hot streak
  // is lit refunds its token on top of the normal earn, cap be damned.
  let encoreRefunded = false;
  if (streakWasHot && useEncore && tier === 'incredible' && !encoreDisabled(state)) {
    state.encore = (state.encore || 0) + 1;
    encoreRefunded = true;
  }

  const outcome = choice.outcomes[tier];
  // Open record: the generic INCREDIBLE-scaling and quirk-bonus blocks below
  // write manifest-keyed verbs the closed `Effect` type deliberately doesn't
  // enumerate, so the working payload is indexed by string here.
  const effects: Record<string, any> = { ...outcome.effects };
  // Rarer × bigger: INCREDIBLE scales the magnitude payloads — every core stat
  // plus the manifest's designated magnitude resources (incredibleTargets).
  // Structural/story counters (a pack's hits, momentum, rivalry) are not in that
  // set, so they stay exactly as authored.
  if (tier === 'incredible' && CONFIG.incrediblePayloadMult) {
    for (const k of incredibleTargets()) {
      if ((effects[k] || 0) > 0) effects[k] = Math.round(effects[k] * CONFIG.incrediblePayloadMult);
    }
  }

  // Loadout quirk: bonus effects on Incredible.
  const inst = PACK.loadoutById(state.loadout);
  if (tier === 'incredible' && inst?.quirk?.hooks?.onIncredible) {
    for (const [k, v] of Object.entries(inst.quirk.hooks.onIncredible)) {
      effects[k] = (effects[k] || 0) + v;
    }
  }

  // One per-card context object, handed to modifyEffects/onEffect/afterResolve
  // of this card so a plugin can stash per-card scratch without module-level
  // state (module scope would be unsafe if runs were ever concurrent).
  const cardCtx: any = { ev, choice, tier, rng, scratch: {} };

  // Let plugins mutate the effects payload before it lands.
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
      if (tagsIntersect(p.tags, choice.tags) && (tier as string) !== 'declined') {
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
  if (effects.addPromise && (tier as string) !== 'declined') {
    state.promises = state.promises || [];
    if (state.promises.length < 2) { // at most two open promises
      state.promises.push({ ...effects.addPromise, remaining: effects.addPromise.cards });
      result.promiseMade = effects.addPromise;
    }
  }

  // Let plugins react after the card resolves, sharing the same cardCtx as
  // modifyEffects so a per-card snapshot survives across the two hooks.
  firePlugins('afterResolve', state, result, cardCtx);

  // An applied item flagged loseOnBad is dropped when the card goes Bad, unless
  // a perk keeps gear bolted down.
  if (tier === 'bad' && !activePerks(state).some((p) => p.keepGearOnBad)) {
    for (const acc of c.appliedAccessories) {
      if (acc.loseOnBad && state.accessories.includes(acc.id)) {
        state.accessories = state.accessories.filter((a: string) => a !== acc.id);
        result.gearLost = acc;
      }
    }
  }

  if (effects.chainEventId) state.pendingChainId = effects.chainEventId;

  // Burnout coping interstitials: crossing a threshold interrupts the deck once
  // per run with a forced chain card (unless a chain is already queued). The
  // rules are pack-declared and evaluated high→low, first match wins — so the
  // card ids and any extra condition live in the pack; the engine knows only the
  // burnout threshold. A pack that ships none never triggers this.
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

function finishCard(state: RunState, ev: GameEvent) {
  if (!state.usedEvents.includes(ev.id)) state.usedEvents.push(ev.id);
  state.cardsPlayedInAct += 1;
  if (ev.shop) state.shopPlayedInAct = true;
  if (ev.flashpoint) state.flashpointSeen = true; // one per run, spent
  state.currentEventId = null;
}

// Applies an effects payload; returns display deltas [{key, amount}]. Exported
// so a plugin can apply its own payload through the full resolution pipeline.
export function applyEffects(state: RunState, effects: any, ev: GameEvent | null, choice: Choice | null, rng: () => number, tier?: any, appliedAccessories: any[] = [], mg: any = null): any[] {
  const deltas: any = [];
  const inst = PACK.loadoutById(state.loadout);
  const hooks: Record<string, any> = inst?.quirk?.hooks || {};
  const tags = choice?.tags || [];

  const push = (key: string, amount: number) => { if (amount) deltas.push({ key, amount }); };

  // The per-resolution gain-multiplier bags plugins contribute, applied by the
  // stat/burnout loops right after the loadout's own — the core keeps the
  // multiplier mechanic while the sources stay plugins.
  const bags = gainBags(state);
  for (const stat of stats()) {
    let v = effects[stat] || 0;
    if (!v) continue;
    // Positive stat gains scale by the loadout, then each plugin's per-stat
    // multiplier — all generic, no stat named.
    if (v > 0 && hooks.statGainMult?.[stat]) v = Math.round(v * hooks.statGainMult[stat]);
    for (const bag of bags) if (v > 0 && bag.statGainMult?.[stat]) v = Math.round(v * bag.statGainMult[stat]);
    const before = state.stats[stat];
    state.stats[stat] = clamp(before + v, 0, 100);
    push(stat, state.stats[stat] - before);
  }

  // Burnout, in order: the loadout's tag multiplier, then plugin adjustments
  // (modifyBurnout), the loadout's live-show cost, the gain-multiplier bags and
  // the perk heal — plus passive act wear.
  {
    let v = (effects.burnout || 0) + (ev ? (CONFIG.actWear[state.act] || 0) : 0);
    if (v > 0 && hooks.burnoutTagMult && tagsIntersect(hooks.burnoutTagMult.tags, tags)) v *= hooks.burnoutTagMult.mult;
    v = foldBurnout(state, v, { tags, appliedAccessories });
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

  // Resource pass: iterate the pack's resources in manifest order — so the delta
  // order and any RNG-consuming resource slot stay put — dispatching each to a
  // plugin's applyResource. The core names no resource and owns no resource
  // arithmetic (every clamp/multiplier lives in the owning plugin). A resource
  // no plugin claims applies as a plain additive default, so a novel resource is
  // never silently dropped. pctx is the per-resolution context the handlers read.
  const pctx: any = { ev, choice, tier, rng, deltas, hooks, mg, scratch: {} };
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

  // Plugin effect handlers, fired at this exact ordinal so their deltas and any
  // RNG land in the frozen draw order. The core owns only the neutral flag
  // control below.
  firePlugins('onEffect', state, effects, pctx);
  if (effects.addFlag && !state.flags.includes(effects.addFlag)) state.flags.push(effects.addFlag);
  if (effects.removeFlag) state.flags = state.flags.filter((f) => f !== effects.removeFlag);
  return deltas;
}

// ---------- Segment / phase advancement ----------

// Call after each resolved card. Walks the manifest's segment list (ADR-0010):
// a finished non-terminal segment either opens the crossroads (its commit
// slot) or starts the next segment; the terminal segment queues the path's
// climax card, then ends in the finale. Returns one of:
// { kind:'card' } | { kind:'crossroads' } | { kind:'actStart', act, notes } |
// { kind:'finale' } | { kind:'gameover', endingKey }
export function advance(state: RunState) {
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
    const terminal = state.act >= segments().length;
    // Every run's final card is its path's climax event, queued here so chains
    // and coping interstitials can never displace it.
    if (terminal && state.path) {
      const climax = PACK.events.find(
        (e) => e.finaleCard && e.pathAffinity?.includes(state.path!) && !state.usedEvents.includes(e.id)
      );
      if (climax) {
        state.pendingChainId = climax.id;
        return { kind: 'card' };
      }
    }
    if (terminal) {
      state.phase = 'finale'; // UI runs the Final Set, then evaluateFinale ends it
      return { kind: 'finale' };
    }
    if (segments()[state.act - 1]?.crossroads) {
      state.phase = 'crossroads'; // the commit slot; commitPath starts the next segment
      return { kind: 'crossroads' };
    }
    const next = state.act + 1;
    const notes = startAct(state, next);
    return { kind: 'actStart', act: next, notes };
  }
  return { kind: 'card' };
}

export function commitPath(state: RunState, pathId: string) {
  state.path = pathId;
  return startAct(state, state.act + 1);
}

function startAct(state: RunState, act: number) {
  state.act = act;
  state.cardsPlayedInAct = 0;
  state.shopPlayedInAct = false;
  state.phase = 'card';
  const notes: string[] = [];
  // Pack-declared perks that fire at every act break.
  for (const p of activePerks(state)) p.onActBreak?.(state, notes);
  // Act-break plugins, fired in registration order — load-bearing, because a
  // plugin may draw RNG here and the goldens pin the sequence.
  firePlugins('onActBreak', state, act, notes);
  // The act twist is telegraphed the moment the act opens.
  if (state.actTwist && state.actTwist.act === act) {
    notes.push(state.actTwist.delta < 0
      ? `✂️ The routing collapses — this leg runs ${-state.actTwist.delta} cards SHORT. Make them count.`
      : `➕ The promoter adds dates — this leg runs ${state.actTwist.delta} cards LONG. Pace yourself.`);
  }
  return notes;
}

export function checkFailStates(state: RunState) {
  if (state.tutorial) return null; // the tutorial can't end a run
  // The one universal fail: the engine owns the burnout slot, so every pack
  // fails when it maxes out. Every other fail is pack-declared (manifest
  // failStates), read through gateValue, and evaluated in declared order after
  // burnout — so a pack controls its own fail precedence.
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

// ---------- Finale ----------

export function evaluateFinale(state: RunState) {
  state.phase = 'ended';
  // Fire the finale hook so plugins can run their last-tick payout; the engine
  // owns none of it.
  firePlugins('onFinale', state);
  const mr = PACK.manifest.momentumResource;
  const gates = PACK.manifest.winGates[state.path!] as Record<string, number>;
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
    // Momentum clutch: a near-miss with enough of the manifest's momentum
    // resource still summits. A pack that designates none can't clutch.
    const momentum = mr ? (state[mr] ?? 0) : 0;
    if (
      result === 'partial' &&
      readings.every((r) => r.ratio >= CONFIG.nearMissRatio) &&
      momentum >= CONFIG.momentumForUpgrade
    ) {
      result = 'success';
    }
  }
  state.ending = { key: state.path, result };
  return { result, readings, momentum: mr ? (state[mr] ?? 0) : 0 };
}

// ---------- Legacy Points ----------

export function legacyPoints(state: RunState) {
  const s = state.stats;
  // Sum the pack's core stats generically off manifest.stats, so the score is
  // correct for any genre's stat set.
  const statSum = PACK.manifest.stats.reduce((n, k) => n + (s[k] || 0), 0);
  // The resources that count toward Legacy Points are the pack's; the engine
  // names none. A pack with no lpResources scores on stats alone.
  const resSum = (PACK.manifest.lpResources || []).reduce((n, k) => n + (gateValue(state, k) || 0), 0);
  const base = Math.round((resSum + statSum) / CONFIG.lpStatDivisor);
  const result = state.ending?.result;
  const bonus = result ? CONFIG.lpEndingBonus[result] : CONFIG.lpEndingBonus.failstate;
  // Plugin score multipliers, folded in registration order. Every genre-specific
  // scoring rule — music's comeback ×1.2 among them — lives in a pack plugin's
  // scoreMult (identity 1), so the core names no flag.
  const mult = scoreMult(state);
  return Math.max(1, Math.round((base + bonus) * mult));
}

// The end-of-run snapshot the UI renders and the golden pins. The core emits
// only the pack-agnostic spine — ending, path, loadout, stats, the manifest's
// resources by name, the tier/card logs, and the encore/coping mechanics it
// owns. Every genre-specific field (a rival, a chart peak, a contract, a home
// venue) is contributed by the pack's summarize capability, so the core names
// no subsystem.
export function runSummary(state: RunState) {
  const summary: Record<string, any> = {
    endingKey: state.ending?.key ?? null,
    result: state.ending?.result ?? null,
    path: state.path,
    loadout: state.loadout,
    stats: { ...state.stats },
    encoreChained: !!state.encoreChained,
    copingCount: (state.copingSeen || []).length,
    tierLog: state.tierLog || [],
    cardLog: state.cardLog || [],
    daily: state.daily || null,
    gauntlet: state.gauntlet || null,
    flags: [...(state.flags || [])],
  };
  for (const r of PACK.manifest.resources) summary[r] = state[r] ?? 0;
  return Object.assign(summary, PACK.summarize?.(state) || {});
}
