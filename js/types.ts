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
// The stat/resource NAMES a run carries are the pack manifest's, not a shared
// union: a run's stats are Record<string, number> (RunState.stats), read
// generically off manifest.stats. (The old music-specific StatId/ResourceId
// unions are gone — WP7 — so the shared types name no genre's stats.)
export type Tier = 'bad' | 'good' | 'incredible';
export type Side = 'left' | 'right';
// forceTier may also script the encore-gated tutorial outcome.
export type ForceTier = Tier | 'encoreUp';

export interface StatMeta { name: string; icon: string; }

// A pack-declared fail-state rule (WP3): a run ends the moment a stat or
// resource crosses a threshold. Declared in the manifest so checkFailStates
// names no genre's stats — the engine owns only the universal burnout fail (its
// own slot); every other fail (a music career cancelled on zero cred, a debt
// spiral) is the pack's, read generically through gateValue. `key` is any
// manifest stat/resource; `fromAct` gates the rule to an act onward; `flag`
// requires a run flag be set; `ending` is the ending key to surface.
export interface FailStateRule {
  key: string;
  cmp: '<=' | '>=' | '<' | '>';
  value: number;
  fromAct?: number;
  flag?: string;
  ending: string;
}

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
  // Engine-known resources: applied in manifest order by the pack's
  // applyResource plugins, with a generic additive default (WP5). Still
  // enumerated here as typed keys for the packs that use them; a genre declares
  // any further resource verbs via declaration merging.
  fame?: number; money?: number; hits?: number; pathProgress?: number; rivalry?: number;
  // Flag / chain / promise control — the genuinely genre-neutral control verbs.
  addFlag?: string; removeFlag?: string; chainEventId?: string;
  addPromise?: PromiseSpec;
}

// ---------- Requires (deck-eligibility gate) ----------
// The open eligibility vocabulary, sibling of the open `Effect`. It declares
// only the genre-neutral predicates the core resolves inline — flag and burnout
// gates plus the generic stat/resource gates (`stats`/`min`/`max`), which
// resolve ANY manifest key through gateValue. Every subsystem-shaped predicate
// — a venue's tier, a rival's feud, a money threshold — is a plugin-registered
// predicate (Plugin.requires), added to this type by the owning pack via
// declaration merging in its OWN file (see packs/music.ts), so the shared
// Requires names no genre's subsystems. A key that is neither neutral nor
// registered is an authoring error, caught by the cross-pack "requires key
// owned" invariant.
export interface Requires {
  anyOf?: Requires[];
  flagsAll?: string[]; flagsNone?: string[];
  burnoutMin?: number;
  // Generic stat/resource gates — keys are ANY manifest stat or resource,
  // resolved through gateValue (so a pack without "fame" doesn't trip a
  // hardcoded branch, and a mystery card can gate on `clues`). `stats` keeps the
  // legacy `{ <key>Min: n }` shape; `min`/`max` are the plain `{ <key>: n }`
  // form. Values numeric.
  stats?: Record<string, number>;
  min?: Record<string, number>; max?: Record<string, number>;
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
  // Non-zero starting values for the pack's resources (WP7-clean). The engine
  // initializes every manifest resource to 0 by default; a resource that starts
  // elsewhere (music's money, the rivalry/feud meter) declares its value here.
  // Keeps the engine's newRun from naming a single resource.
  resourceStart?: Record<string, number>;
  // Resources that count toward Legacy Points, alongside the core stats
  // (music: fame). The engine names none; a pack that omits this scores on
  // stats alone.
  lpResources?: string[];
  // Resource ROLES the engine asks for by function rather than by name (WP-B):
  // the shop-cost currency, the resources an INCREDIBLE payload scales, and the
  // resource the finale's momentum clutch reads. Music designates money/fame/
  // pathProgress; a pack that omits a role opts out of that mechanic.
  costResource?: string;
  incredibleResources?: string[];
  momentumResource?: string;
  // Pack-declared fail states (WP3), evaluated in order after the engine's
  // universal burnout fail. A pack without any (mystery, probe) can only fail on
  // burnout.
  failStates?: FailStateRule[];
  // The penalty for declining a shop card you can't afford (WP3): music docks a
  // little cred (the walk-of-shame). Pack-declared so the core names no stat; a
  // pack that omits it declines for free.
  declinePenalty?: Effect;
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
  // Per-resolution scratch a subsystem stashes for itself across the hooks of
  // ONE card (Phase F) — replaces module-level plugin state. The engine hands
  // the same context object to modifyEffects/onEffect/afterResolve of a card.
  chartTitleHandled?: boolean; // songs: has the engine's hits block minted the chartTitle already?
  venueThisCard?: any;         // venue: the room as it was before adoptVenue could fire this card
  hostedThisCard?: boolean;    // venue: did the adopted room host this card's show?
}
export interface Plugin {
  id: string;
  // Explicit ordering (Phase F): plugins fire in ascending priority (default
  // 0), ties broken by registration order. Lets a pack declare intent instead
  // of relying on array position.
  priority?: number;
  // The effect verbs this subsystem owns (Phase C — the open registry's
  // declaration half). The core owns the closed neutral set (stat/resource
  // deltas, burnout, addFlag/removeFlag/chainEventId, addPromise); every other
  // key an eligible card may name must be declared here by exactly one plugin.
  // The cross-pack "no unknown verb" invariant checks each card's effect keys
  // against manifest.stats ∪ manifest.resources ∪ core ∪ these.
  effectVerbs?: string[];
  // The eligibility predicates this subsystem owns (Phase WP1 — the open
  // Requires registry's declaration half). requiresOk dispatches any `requires`
  // key outside the neutral core to the predicate registered here — `(state,
  // arg) => boolean`, where `arg` is the value the card authored for the key
  // (e.g. `venueIs: 'basement'` calls the `venueIs` predicate with 'basement').
  // The core owns the neutral set (anyOf/flags/money/burnout + generic
  // stats/min/max); every other key must be declared by exactly one plugin.
  requires?: Record<string, (state: RunState, arg: any) => boolean>;
  // Seeded construction draws at run start (weather, rival). Fired in
  // registration order, so the pack fixes the draw order.
  onConstruct?(state: RunState, rng: () => number): void;
  // Fired once at the tail of newRun, after perks — a subsystem's run-start
  // setup (e.g. the songs plugin minting the notebook-perk demo).
  onRunStart?(state: RunState, rng: () => number): void;
  // Apply a manifest resource this subsystem OWNS (e.g. songs' 'hits'), at the
  // resource's ordinal slot in applyEffects. Returns the delta to record, 0 to
  // claim it with no delta, or undefined/null to decline (the engine then tries
  // the next plugin, else a generic additive default). May push structured
  // deltas (song debuts) onto ctx.deltas.
  applyResource?(res: string, effects: Effect, state: RunState, ctx: PluginContext): number | null | undefined;
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

  // ── The neutral modify-hooks (WP6-infra). The engine fires these at the exact
  // site of the code they replace, in registration order, so a subsystem folds
  // its bonus/multiplier in without the core naming it. Each is genre-neutral
  // and something a second genre would plausibly want. ──

  // Additive roll bonus, summed into rollComponents' base at the gear/genre/
  // band/weather/contract slot. `ctx.applied` is an array a subsystem pushes the
  // items whose bonus fired onto (gear reads it back for lose-on-bad and burnout
  // side-effects). Consumes no rng; called for the risk-tell too, so keep it pure.
  modifyRoll?(state: RunState, choice: Choice, ctx: any): number;
  // Transform the roll's jitter band [lo,hi] — a subsystem may override it
  // (contract) or widen it (weather). Returns the new band.
  modifyJitter?(state: RunState, jitter: [number, number], ctx: any): [number, number];
  // Override the number of cards an act runs (a contract can shorten it).
  modifyActLength?(state: RunState, act: number, base: number): number;
  // A Legacy Points multiplier this subsystem contributes (a contract/era
  // mult). Returned as a factor the engine folds into the score product, so the
  // grouping matches the old `mult *= …` accumulation exactly.
  scoreMult?(state: RunState): number;
  // Scale a card's deck weight (weather recolors the deck; seeded arcs bias
  // their setup/payoff cards). Returns the new weight.
  weightDeck?(state: RunState, ev: GameEvent, weight: number): number;
  // Force a category of card into the draw pool at a scheduled slot (the way the
  // shop slot works) — the seeds plugin deals an unlit arc's setup on schedule.
  // Returns a narrowed pool, or the pool unchanged. `ctx.shopDue` says a shop
  // was already forced this draw. Fired after the shop slot, before weighting.
  refineDeck?(state: RunState, pool: GameEvent[], ctx: any): GameEvent[];
  // A per-resolution "gain hooks" bag: { statGainMult?, burnoutGainMult?,
  // burnoutHealMult? } a subsystem (contract, weather) contributes, applied by
  // the engine's stat/burnout loops in registration order right after the
  // instrument's own (which is core). Keeps the multiplier MECHANIC in the core
  // while the SOURCES are plugins.
  gainHooks?(state: RunState): any;
  // Whether this subsystem disables the Encore mechanic this run (a contract
  // clause). OR'd across plugins.
  blocksEncore?(state: RunState): boolean;
  // Adjust the burnout delta a card lands — gear's tag-matched multipliers and
  // per-match side effects fold in here, between the instrument's own burnout
  // hooks (core) and the contract/weather gain multipliers. `ctx.tags` are the
  // choice tags, `ctx.appliedAccessories` the gear whose roll bonus fired.
  modifyBurnout?(state: RunState, v: number, ctx: any): number;
  // The run-state slots this subsystem owns, with their fresh-run defaults (a
  // venue starts null, a band starts []). newRun applies these generically so
  // the engine's state literal names no genre — arrays are copied per run.
  stateDefaults?: Record<string, any>;
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

// A Career-Wall perk: an always-on run modifier (D.1). Pack-declared, so the
// engine stops branching on ~14 hardcoded music perk ids. Each perk supplies
// only the hooks/knobs it needs; the engine sums/applies them generically at
// the matching lifecycle point. The knobs (pity, encore cap, gear retention,
// burnout heal, hustle income) are ENGINE mechanics, so a second genre's perks
// can bend the same dials — the string ids and the arithmetic are the pack's.
export interface PerkDef {
  onRunStart?(state: RunState): void;             // run-start bumps (money/stats/flags/encore)
  onActBreak?(state: RunState, notes: string[]): void; // per-act income/heal, pushes notes
  pityPerBonus?: number;                          // adds to the per-bad pity step
  pityCapBonus?: number;                          // adds to the pity ceiling
  encoreCapBonus?: number;                         // raises the banked-encore cap
  keepGearOnBad?: boolean;                          // gear survives a Bad outcome
  burnoutHealMult?: number;                         // scales burnout RELIEF (negative deltas)
  hustleMult?: number;                              // scales hustle income per act
}

// The scripted onboarding run's fixed setup: teaching stats, starting persona,
// and any teaching resources (by name, applied generically), declared by the
// pack instead of hardcoded genre values.
export interface TutorialStart {
  loadout: string;
  stats: Record<string, number>;
  resources?: Record<string, number>;
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
  // The loadout: at least one selectable persona and a lookup. Required — a
  // run always starts as SOMEONE.
  loadouts: any[];
  loadoutById: (id: string) => any;
  // Optional capabilities the engine feature-detects (Phase E — ISP). A genre
  // that doesn't ship one simply omits it. Every music SUBSYSTEM (accessories,
  // arcs, contracts, genres, hustles, band, weather, seeds) is GONE from this
  // type (WP7): those live in the pack's plugins, which own their data by direct
  // import — exactly as venue/rival always did. Adding a genre edits new files
  // only; this type names no genre.
  interstitials?: InterstitialRule[];
  tutorialStart?: TutorialStart;
  presenter?: Presenter;
  perks?: Record<string, PerkDef>;
  // Comeback mode: an optional pack-provided run transform applied at run start
  // when the player has unlocked it (a music career restarts as a faded name).
  // Feature-detected — a pack without one omits it. Music's hardcodes its own
  // stats, so it lives with the pack, not the core.
  comeback?: (state: RunState) => void;
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
  stats: Record<string, number>;
  // Resources (fame/money/hits/… for music) are pack-defined and initialized
  // generically from manifest.resources — they live on the index signature, not
  // as fixed fields, so this type names no genre's resource.
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
  promptAlt?: string;   // an alternate prompt the presenter/UI may show in place of `prompt`
  context?: string;
  art?: string;
  coach?: string;      // tutorial coaching text
  tutorial?: boolean;  // tutorial-only marker
  forceTier?: Partial<Record<Side, ForceTier>>;
  choices: Record<Side, Choice>;
}
