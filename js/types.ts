// BIG BREAK — boundary types (Phase 1). These describe the authored content
// schema (events, effects, requires) and the stat/resource taxonomy exactly
// as they stand today, so the compiler catches the bug class this codebase is
// most exposed to: renamed-key drift and hallucinated effect/requires keys in
// hand-authored, string-keyed data. NO index signatures on the authored
// shapes — an unknown key is a type error, which is the whole point.
//
// These are the "type the boundaries first" types the plan calls for. The
// full generic Pack<S extends StatSchema> manifest is deferred until the
// manifest actually exists (Phase 2/3); this file types what is real today.

// ---------- Stat / resource taxonomy ----------
// The four core stats the engine iterates as STATS (burnout is tracked in
// state.stats too but handled by its own block, not in this list).
export type StatId = 'skill' | 'cred' | 'creativity' | 'network';
// Resources with bespoke handlers in applyEffects (Phase 3 genericizes these).
export type ResourceId = 'fame' | 'money' | 'hits' | 'pathProgress' | 'rivalry';
export type Tier = 'bad' | 'good' | 'incredible';
export type Side = 'left' | 'right';
// forceTier may also script the encore-gated tutorial outcome.
export type ForceTier = Tier | 'encoreUp';

export interface StatMeta { name: string; icon: string; }

// ---------- Effects (the payload a choice outcome applies) ----------
// A short-horizon objective a card can arm (Promises).
export interface PromiseSpec {
  label: string;
  tags: string[];
  cards: number;
  reward?: Effect;
  penalty?: Effect;
}

export interface Effect {
  // core stats
  skill?: number; cred?: number; creativity?: number; network?: number;
  burnout?: number;
  // resources
  fame?: number; money?: number; hits?: number; pathProgress?: number; rivalry?: number;
  // flags & chaining
  addFlag?: string; removeFlag?: string; chainEventId?: string;
  addPromise?: PromiseSpec;
  // venue subsystem
  adoptVenue?: string; venueLove?: number; venueLoveStart?: number;
  // songs subsystem
  chartTitle?: string; hypeSong?: number; polishDemo?: number; writeSong?: boolean;
  // number in data today; the engine also accepts a truthy flag (=> default)
  albumDrop?: number | boolean; releaseDemo?: number | boolean;
  // instrument / band / hustle / gear
  setInstrument?: string; grantBandmate?: string; removeBandmate?: string;
  grantHustle?: string; removeGear?: string; grantGear?: string;
  // legacy no-op present in a few authored cards (value 0); ignored by the
  // engine. Typed so the byte-green rename passes; a lint can retire it later.
  tone?: number;
}

// ---------- Requires (deck-eligibility gate) ----------
export interface Requires {
  anyOf?: Requires[];
  nemesis?: boolean;
  weatherIs?: string;
  flagsAll?: string[]; flagsNone?: string[];
  moneyMax?: number; moneyMin?: number;
  burnoutMin?: number;
  fameMin?: number; fameMax?: number;
  gear?: string[];
  rivalryMin?: number; rivalryMax?: number;
  genreAny?: boolean;
  venueAny?: boolean; venueNone?: boolean; venueIs?: string; venueLevelMin?: number;
  rivalIs?: string;
  hustleMin?: number;
  bandMin?: number; bandMax?: number; bandHas?: string;
  demoMin?: number; chartingMin?: number; songsMin?: number; fadedMin?: number;
  // { <stat>Min: number } — keys are dynamic, values numeric.
  stats?: Record<string, number>;
}

// ---------- Choice / outcome / event ----------
export interface Outcome { text: string; effects: Effect; }

export interface Choice {
  label: string;
  tags?: string[];
  // Governed by core stats; a few cards also name 'fame' here — the engine
  // reads state.stats[key], where fame is absent, so it contributes 0 (a
  // latent authored no-op preserved as-is). Typed to accept it.
  governingStats?: Partial<Record<StatId | 'fame', number>>;
  cost?: number;
  minigame?: string;
  outcomes: Record<Tier, Outcome>;
}

// ---------- Content pack (Phase 2: inversion of control) ----------
// Everything the engine used to import as hardwired music content is now
// injected as a Pack at run start (newRun) / boot (useContentPack). A second
// game is a second Pack against the same engine. Content-module helper
// functions are typed loosely here; the load-bearing manifest types (stats,
// winGates, resource taxonomy) formalize in Phase 3 as the taxonomy is
// genericized. `charts`/songs stay engine-side until the Phase 4 plugin split.
// A summit the player commits to; its winGates entry is the finale bar.
export interface PathDef {
  id: string;
  name: string;
  blurb: string;
  gateLabel: string;
  icon: string;
}

// The pack manifest: the genre's TAXONOMY, split out of the balance knobs in
// config (Phase 2.2). stats/resources are the stat/resource lists Phase 3
// genericizes the engine against; paths/winGates/statMeta are the finale and
// HUD taxonomy. Numbers here are still balance-tuned, but the SHAPE (which
// stats exist, which gate which path) is what makes a pack a genre.
export interface PackManifest {
  stats: string[];
  resources: string[];
  paths: Record<string, PathDef>;
  winGates: Record<string, Record<string, number>>;
  statMeta: Record<string, StatMeta>;
}

// ---------- Plugin framework (Phase 4) ----------
// Subsystems (venue, rival, band, songs) are pack-owned plugins the engine
// dispatches to at lifecycle points, instead of hardwired inline logic. A
// second genre supplies its OWN subsystem plugins (a suspicion track, a
// clue board…) against this same hook set. All hooks are optional.
export interface PluginContext {
  ev: GameEvent | null;
  choice: Choice | null;
  tier?: Tier | 'declined';
  rng: () => number;
  // Resolution internals exposed to onEffect so a subsystem can apply its own
  // effect keys (the songs plugin writes/releases/hypes songs and records the
  // structured deltas the UI stages). Present on the applyEffects dispatch.
  deltas?: any;
  hooks?: Record<string, any>;
  accs?: any[];
  mg?: any;
}
export interface Plugin {
  id: string;
  // Seeded construction draws at run start (weather, rival). Fired in
  // registration order, so the pack fixes the draw order.
  onConstruct?(state: RunState, rng: () => number): void;
  // Mutate the effects payload before it lands (e.g. a home-venue show bonus).
  modifyEffects?(state: RunState, effects: Effect, ctx: PluginContext): void;
  // Apply the plugin's own effect keys (adoptVenue, hits, …).
  onEffect?(state: RunState, effects: Effect, ctx: PluginContext): void;
  // React after a card resolves (e.g. level up the home room).
  afterResolve?(state: RunState, result: any, ctx: PluginContext): void;
  // Act-break work (income quirks, chart tick, deadline audit); push notes.
  onActBreak?(state: RunState, act: number, notes: string[]): void;
  // A chart week / periodic tick; push notes.
  onTick?(state: RunState, notes: string[]): void;
  // Fired once as the finale is evaluated (e.g. one last chart week).
  onFinale?(state: RunState): void;
}

export interface Pack {
  id: string;
  manifest: PackManifest;
  plugins?: Plugin[];
  events: GameEvent[];
  tutorialEvents: GameEvent[];
  instruments: any[];
  accessories: any[];
  arcs: any[];
  VENUE_TIERS: any[];
  instrumentById: (id: string) => any;
  accessoryById: (id: string) => any;
  randomRival: (rng: () => number) => any;
  contractById: (id: string) => any;
  hustleById: (id: string) => any;
  genreById: (id: string) => any;
  venueById: (id: string) => any;
  bandmateById: (id: string) => any;
  recruitCandidate: (state: any, rng?: () => number) => any;
  arcById: (id: string) => any;
  rollSeeds: (rng: () => number, count: number) => string[];
  weatherHooks: (state: any) => Record<string, any>;
  rollWeather: (rng: () => number) => string;
}

// ---------- Runtime run state ----------
// A song, first-class citizen of the charts subsystem.
export interface Song {
  id: string;
  title: string;
  quality: number;
  hype: number;
  status: 'demo' | 'charting' | 'faded';
  origin: string | null;
  act: number;
  pos: number | null;
  prevPos: number | null;
  peak: number | null;
  weeks: number;
  crowned: boolean;
  releasedAct?: number;
  viral?: boolean;
}

// The mutable per-run state. The engine reads/writes many string-keyed fields
// across subsystems (songs, venue, band, seeds, weather, flags…). Per the
// plan, typing here stays LIGHT — the load-bearing types are the authored
// content boundary above. Known fields are typed; the index signature keeps
// the many dynamic/subsystem fields ergonomic during the strictness ramp.
export interface RunState {
  version: number;
  phase: string;
  act: number;
  stats: Record<StatId | 'burnout', number>;
  fame: number;
  money: number;
  hits: number;
  flags: string[];
  songs?: Song[];
  seed: number | null;
  rngUses?: number;
  path: string | null;
  [key: string]: any;
}

export interface GameEvent {
  id: string;
  act: number | number[];
  pathAffinity?: string[];
  weight?: number;
  tags?: string[];
  requires?: Requires;
  pack?: string;
  chainOnly?: boolean;
  finaleCard?: boolean;
  flashpoint?: boolean;
  shop?: boolean;
  prompt?: string;
  promptNemesis?: string;
  context?: string;
  art?: string;
  coach?: string;      // tutorial coaching text
  tutorial?: boolean;  // tutorial-only marker
  forceTier?: Partial<Record<Side, ForceTier>>;
  choices: Record<Side, Choice>;
}
