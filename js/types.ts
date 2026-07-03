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

// Effect is the OPEN payload vocabulary (Phase C — the §2A OCP fix). This
// declares only the GENRE-NEUTRAL core: the engine's burnout slot, the
// engine-known resources it applies by name, the universal structural verbs it
// resolves inline, and flag/chain/promise control. Every pack's OWN vocabulary
// — its core stats and its subsystem verbs — is added by that pack via
// declaration merging in its OWN file (see packs/music.ts, packs/mystery.ts,
// packs/probe.ts), so adding a genre edits NO shared type. That is the OCP
// boundary the god-union violated: the shared type no longer enumerates any
// genre's keys, yet a truly unknown key is still a compile error (no index
// signature), preserving hallucinated-key detection. The runtime guard that a
// card names no verb outside its pack's declared set lives in the cross-pack
// "no unknown verb" invariant.
export interface Effect {
  // The engine's universal burnout slot.
  burnout?: number;
  // Engine-known resources (RESOURCE_APPLY + the songs hits/chartTitle block,
  // engine-resident until the songs subsystem fully owns them in Phase D).
  fame?: number; money?: number; hits?: number; pathProgress?: number; rivalry?: number;
  chartTitle?: string;
  // Flag / chain / promise control (genre-neutral).
  addFlag?: string; removeFlag?: string; chainEventId?: string;
  addPromise?: PromiseSpec;
  // Content-structural verbs the engine resolves inline today (loadout / roster
  // / gear). Music-shaped; the keys follow their handlers to a plugin in Phase D.
  setInstrument?: string; grantBandmate?: string; removeBandmate?: string;
  grantHustle?: string; removeGear?: string; grantGear?: string;
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
  // Governed by the pack's stats (looked up dynamically on state.stats), so
  // keys are open strings. A few music cards name 'fame' here — the engine
  // reads state.stats['fame'], which is absent, so it contributes 0 (a latent
  // authored no-op preserved as-is).
  governingStats?: Record<string, number>;
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
  // Display name/icon for each resource (Phase G.4) — the sibling of statMeta,
  // so the UI can label ANY winGates/delta key generically instead of
  // special-casing fame/hits. A pack without an entry falls back to the raw key.
  resourceMeta?: Record<string, StatMeta>;
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
  // The effect verbs this subsystem owns (Phase C — the open registry's
  // declaration half). The core owns the closed neutral set (stat/resource
  // deltas, burnout, addFlag/removeFlag/chainEventId, addPromise); every other
  // key an eligible card may name must be declared here by exactly one plugin.
  // The cross-pack "no unknown verb" invariant checks each card's effect keys
  // against manifest.stats ∪ manifest.resources ∪ core ∪ these.
  effectVerbs?: string[];
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

// A burnout-threshold interstitial: crossing the bar interrupts the deck once
// per run with a forced chain card. Pack-declared (D.3) so the ids and any
// extra condition (e.g. music's "you have a hit") live in the pack, not the
// core — the engine only knows the generic burnout threshold.
export interface InterstitialRule {
  id: string;           // the chainOnly card to queue
  burnoutMin: number;   // fires when the engine's burnout slot ≥ this
  belowFail?: boolean;  // only while still below the burnout fail threshold
  cond?: (state: RunState) => boolean; // extra pack-owned condition
}

// The scripted onboarding run's fixed setup (D.3): teaching stats and the
// starting persona, declared by the pack instead of hardcoded music values.
export interface TutorialStart {
  instrument: string;
  stats: Record<string, number>;
  money?: number;
  fame?: number;
}

// The Presenter (Phase G): the genre's UI-facing flavor, provided by the pack
// so the UI shell reads it instead of statically importing music content. This
// is what carries the refactor through the UI — a mystery run reaches its
// finale rendering MYSTERY endings/epilogue, not music's (which crashed on an
// unknown path key). Fields are optional; the UI falls back to sensible
// neutral behavior when a pack omits one.
export interface Presenter {
  // Ending copy: path id → { success, partial, failure } and fail-state keys
  // (burnout/cancelled/debt) → { title, art?, text } (see data/meta.ts shape).
  endings: Record<string, any>;
  exitInterviews?: Record<string, any>;
  wallItems?: any[];
  trophies?: any[];
  // Flavor generators (pure: state → copy). The UI calls these for the act
  // interstitial (headlines/dms) and the ending screen (epilogue/discography).
  epilogue?: (state: RunState) => string;
  headlines?: (state: RunState, seed: number) => { text: string; src: string }[];
  dms?: (state: RunState, seed: number) => { from: string; text: string }[];
  discography?: (state: RunState) => any[];
}

export interface Pack {
  id: string;
  manifest: PackManifest;
  plugins?: Plugin[];
  events: GameEvent[];
  tutorialEvents: GameEvent[];
  // Optional pack capabilities (feature-detected by the engine / UI).
  interstitials?: InterstitialRule[];
  tutorialStart?: TutorialStart;
  presenter?: Presenter;
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
