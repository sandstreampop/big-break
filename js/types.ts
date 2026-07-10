// BIG BREAK — the boundary types. They describe the authored content schema
// (events, effects, requires) and the stat/resource taxonomy, so the compiler
// catches this codebase's most exposed bug class: renamed-key drift and
// hallucinated effect/requires keys in hand-authored, string-keyed data. The
// authored shapes carry NO index signatures — an unknown key is a type error,
// which is the whole point.

// ---------- Stat / resource taxonomy ----------
// The stat/resource names a run carries are the pack manifest's, not a shared
// union: a run's stats are Record<string, number> (RunState.stats), read
// generically off manifest.stats, so the shared types name no genre's stats.
export type Tier = 'bad' | 'good' | 'incredible';
export type Side = 'left' | 'right';
// forceTier may also script the encore-gated tutorial outcome.
export type ForceTier = Tier | 'encoreUp';

export interface StatMeta { name: string; icon: string; }

// The art painter's reactive-scene inputs — three generic 0..100-ish intensity
// dials the SVG scenes read (roughly: prominence, ambient glow, and strain).
// Genre-neutral: each pack maps its own meters onto them via presenter.vibe.
export interface SceneVibe { scale: number; glow: number; heat: number; }

// A responsive raster-image descriptor — the runtime half of the SOTA image
// pipeline (the authoring half is tools/image-core.mjs `buildResponsiveSet`).
// `avif`/`webp`/`jpeg` are ready-to-use `srcset` strings ("path 96w, …") across
// a width ladder; `src` is the universal <img> fallback; `w`/`h` are that
// fallback's intrinsic pixels so the box is reserved before load (no layout
// shift). The shell serves it through `<picture>` (js/ui/dom.ts), letting the
// browser pick the smallest format it supports at the exact rendered size.
export interface ImageVariant {
  w: number;
  h: number;
  // The universal <img> fallback src. Optional in the registered map because
  // the map is KEYED by it (the render site already holds the src it looks up);
  // buildResponsiveSet still returns it so the pack's wire step can build the
  // slot→src PORTRAITS map from the same descriptor.
  src?: string;
  avif?: string;
  webp?: string;
  jpeg?: string;
}

// A pack-declared fail-state rule: a run ends the moment a stat or resource
// crosses a threshold. Declared in the manifest so checkFailStates names no
// genre's stat — the engine owns only the universal burnout fail; every other
// fail is the pack's, read through gateValue. `key` is any manifest
// stat/resource; `fromAct` gates the rule to an act onward; `flag` requires a
// run flag be set; `ending` is the ending key to surface.
export interface FailStateRule {
  key: string;
  cmp: '<=' | '>=' | '<' | '>';
  value: number;
  fromAct?: number;
  flag?: string;
  ending: string;
}

// ---------- Terminal rules (the honest generalization of FailStateRule) ----------
// A run can end for reasons that are not threshold failures: a temptation
// accepted, a debt called in, a flag a card set. FailStateRule could only say
// "resource crosses value", so flag-triggered endings were encoded as an
// always-true comparison with the flag doing the real work (love-island's
// li_dumped_single, odyssey's banked tellings — see the 2026-07 odyssey
// review, Required #1). TerminalRule models exactly the conditions the engine
// actually supports — a threshold, a flag, or a conjunction of both — and
// nothing more: this is deliberately NOT an expression language.
export type TerminalCondition =
  // A stat/resource threshold: `key` is any manifest stat, "burnout", a
  // resource, or a plugin-owned state slot, read through gateValue.
  | { key: string; cmp: '<=' | '>=' | '<' | '>'; value: number }
  // A run flag is set.
  | { flag: string }
  // Every listed condition holds.
  | { all: TerminalCondition[] };

// When `when` holds (checked after every card, in declared order, after the
// engine's universal burnout fail), the run ends with `ending`. `fromAct`
// arms the rule from that act onward. Legacy `failStates` rules are
// normalized onto this shape at engine creation and evaluated first, so the
// two lists compose deterministically.
export interface TerminalRule {
  when: TerminalCondition;
  ending: string;
  fromAct?: number;
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

// Effect is the OPEN payload vocabulary. It declares only the genre-neutral core:
// the engine's burnout slot, the resources the engine applies by name, and
// flag/chain/promise control. Every pack's OWN vocabulary — its core stats and
// its subsystem verbs — is added by that pack via declaration merging in its own
// file (see packs/music.ts, packs/probe.ts), so adding a genre
// edits no shared type. There is no index signature, so a truly unknown key is
// still a compile error (hallucinated-key detection); the runtime guard that a
// card names no verb outside its pack's declared set is the cross-pack "no
// unknown verb" invariant.
export interface Effect {
  // The engine's universal burnout slot.
  burnout?: number;
  // Flag / chain / promise control — the genuinely genre-neutral control
  // verbs. EVERY resource verb is the owning genre's, declared in that pack's
  // own `declare module` Effect augmentation (music: fame/money/pathProgress/…;
  // love-island: public/bond/…) — so this shared interface names no genre.
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
  // hardcoded branch, and a pack can gate on a subsystem counter its plugin
  // maintains). `stats` keeps the
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
  // keys are open strings, looked up on state.stats. A key that isn't a core
  // stat (e.g. a resource authored here) resolves to 0 — a latent no-op.
  governingStats?: Record<string, number>;
  cost?: number;
  outcomes: Record<Tier, Outcome>;
  // A pack may add its own per-choice fields (e.g. music's `minigame?: string`)
  // via a Choice augmentation in its pack.ts — the core names none.
}

// ---------- Content pack ----------
// A genre is a Pack, injected at run start (newRun) / boot (useContentPack); a
// second game is a second Pack against the same engine.
// A summit the player commits to; its winGates entry is the finale bar.
export interface PathDef {
  id: string;
  name: string;
  blurb: string;
  gateLabel: string;
  icon: string;
}

// One leg of a run's macro shape (ADR-0010). A run is an ordered, LINEAR list
// of segments the engine walks front to back — no branching graph. Each
// segment runs `length` cards (before act twists and plugin overrides); a
// segment flagged `crossroads` ends at the commit slot (the player picks a
// path before the next segment starts); the final segment always terminates
// in the finale. `state.act` is the 1-indexed position in this list.
export interface SegmentDef {
  length: number;
  crossroads?: boolean;
}

// The pack manifest: the genre's taxonomy, split out from the balance knobs in
// config. Numbers here are still balance-tuned, but the SHAPE — which stats
// exist, which gate which path — is what makes a pack a genre.
export interface PackManifest {
  stats: string[];
  resources: string[];
  // The run structure: how many segments ("acts", "weeks" — the pack's word),
  // how long each runs, where the crossroads sits. The engine hardcodes no
  // count — three acts and thirty weeks are the same machinery.
  segments: SegmentDef[];
  paths: Record<string, PathDef>;
  winGates: Record<string, Record<string, number>>;
  statMeta: Record<string, StatMeta>;
  // Display name/icon for each resource — the sibling of statMeta, so the UI can
  // label any winGates/delta key generically. A pack without an entry falls back
  // to the raw key.
  resourceMeta?: Record<string, StatMeta>;
  // Non-zero starting values for the pack's resources. The engine initializes
  // every manifest resource to 0 by default; a resource that starts elsewhere
  // declares its value here, so newRun names no resource.
  resourceStart?: Record<string, number>;
  // Resources that count toward Legacy Points, alongside the core stats. The
  // engine names none; a pack that omits this scores on stats alone.
  lpResources?: string[];
  // Resource ROLES the engine asks for by function rather than by name: the
  // shop-cost currency, the resources an INCREDIBLE payload scales, and the
  // resource the finale's momentum clutch reads. A pack that omits a role opts
  // out of that mechanic.
  costResource?: string;
  incredibleResources?: string[];
  momentumResource?: string;
  // Pack-declared fail states, evaluated in order after the engine's universal
  // burnout fail. LEGACY shape, kept working: rules here are normalized onto
  // terminalRules at engine creation (and evaluated before it). New packs
  // should declare terminalRules — this shape can only express thresholds, so
  // flag-triggered endings need a dummy always-true comparison.
  failStates?: FailStateRule[];
  // Pack-declared terminal rules — the honest shape for every non-burnout way
  // a run can end: thresholds, flag triggers, or conjunctions (TerminalRule).
  // Evaluated in declared order after failStates. A pack that declares
  // neither list can only fail on burnout.
  terminalRules?: TerminalRule[];
  // The penalty for declining a shop card you can't afford. Pack-declared so the
  // core names no stat; a pack that omits it declines for free.
  declinePenalty?: Effect;
  // The copy shown when a costed choice is declined for lack of the cost
  // resource. Pack-declared so the core ships no genre's joke; a pack that
  // omits it gets the engine's default line.
  declineText?: string;
  // The finale success rate the balance gate holds the pack to (percent of all
  // runs that end in a `success` outcome). Pack-declared so the generic balance
  // driver (tools/simulate-pack.mjs --check) names no genre's numbers; a pack
  // that omits it falls back to the tool's default band.
  balanceBand?: { successMin: number; successMax: number };
}

// ---------- Plugin framework ----------
// Subsystems are pack-owned plugins the engine dispatches to at lifecycle
// points, instead of hardwired inline logic. A second genre supplies its own
// subsystem plugins against this same hook set. All hooks are optional.
export interface PluginContext {
  ev: GameEvent | null;
  choice: Choice | null;
  tier?: Tier | 'declined';
  rng: () => number;
  // Resolution internals exposed to onEffect so a plugin can apply its own
  // effect keys and record the structured deltas the UI stages. Present on the
  // applyEffects dispatch.
  deltas?: any;
  hooks?: Record<string, any>;
  accs?: any[];
  mg?: any;
  // The accessories whose roll bonus fired this card, exposed on the per-card
  // ctx so a plugin (gear's lose-on-bad) can read them. Generic name — the core
  // names no gear concept; a non-gear pack simply never sets or reads it.
  applied?: any[];
  // Per-resolution scratch a plugin stashes for itself across the hooks of ONE
  // card: the engine hands the same context object to modifyEffects/onEffect/
  // afterResolve of a card, so a plugin needs no module-level state. Opaque to
  // the core — a plugin owns its own keys, so the shared type names no genre
  // (music formerly leaked chartTitleHandled/venueThisCard/hostedThisCard here).
  scratch?: Record<string, unknown>;
}
// A per-resolution "gain-multiplier bag" a plugin contributes via gainHooks.
// The engine's stat/burnout loops apply these right after the loadout's own
// multipliers, in registration order. Every field is optional and multiplicative
// (identity 1), so a plugin returning an empty bag changes nothing.
export interface GainBag {
  statGainMult?: Record<string, number>; // per-stat positive-gain multiplier
  burnoutGainMult?: number;              // scales burnout GAIN (positive deltas)
  burnoutHealMult?: number;              // scales burnout RELIEF (negative deltas)
}

// ---------- The modify-hook contexts ----------
// The engine builds a small per-mechanic context for the fold hooks, distinct
// from the resolution-time PluginContext above. Previously each was `any`;
// these type exactly the fields the hooks read/write.

// Built in rollComponents, handed to modifyRoll/modifyJitter: `applied` is the
// array a plugin pushes the items whose bonus fired onto (read back for
// lose-on-bad + burnout side-effects); `tags` are the current choice's tags.
export interface RollCtx {
  applied: any[];
  tags?: string[]; // the choice's tags (optional, straight off Choice.tags)
}
// Handed to modifyBurnout: the choice tags plus the accessories whose roll
// bonus fired (for per-item burnout side-effects).
export interface BurnoutCtx {
  tags: string[];
  appliedAccessories: any[];
}
// Handed to refineDeck: whether a shop was already forced into this draw.
export interface DeckRefineCtx {
  shopDue: boolean;
}

// The rich object resolveSwipe builds and hands to afterResolve. The core
// resolution fields are typed here; subsystem plugins annotate it with their
// own UI-render hints (gearLost, venueLeveled, overlayNote, songDebuts, …) via
// the index signature, so the shared type names no genre while the core shape
// stays checked. Was `result: any`.
export interface SwipeResult {
  tier: Tier | 'declined';
  roll: number;
  text: string;
  deltas: any[];
  event: GameEvent | null;
  side: Side;
  encoreEarned?: boolean;
  encoreSpent?: boolean;
  encoreRefunded?: boolean;
  hotStreak?: number;
  streakWasHot?: boolean;
  promisesKept?: any[];
  promisesBroken?: any[];
  promiseMade?: any;
  [key: string]: any; // plugin-added resolution annotations
}

export interface Plugin {
  id: string;
  // Plugins fire in ascending priority (default 0), ties broken by registration
  // order — so a pack declares its ordering intent rather than relying on array
  // position.
  priority?: number;
  // The effect verbs this plugin owns. The core owns the closed neutral set
  // (stat/resource deltas, burnout, addFlag/removeFlag/chainEventId, addPromise);
  // every other key an eligible card may name must be declared here by exactly
  // one plugin. The cross-pack "no unknown verb" invariant checks each card's
  // effect keys against manifest.stats ∪ manifest.resources ∪ core ∪ these.
  effectVerbs?: string[];
  // The eligibility predicates this plugin owns. requiresOk dispatches any
  // `requires` key outside the neutral core to the predicate registered here —
  // `(state, arg) => boolean`, where `arg` is the value the card authored (e.g.
  // `venueIs: 'basement'` calls the `venueIs` predicate with 'basement'). The
  // core owns the neutral set (anyOf/flags/burnout + generic stats/min/max);
  // every other key must be declared by exactly one plugin.
  requires?: Record<string, (state: RunState, arg: any) => boolean>;
  // Seeded construction draws at run start. Fired in registration order, so the
  // pack fixes the draw order.
  onConstruct?(state: RunState, rng: () => number): void;
  // Fired once at the tail of newRun, after perks — a plugin's run-start setup.
  onRunStart?(state: RunState, rng: () => number): void;
  // Apply a manifest resource this plugin owns, at the resource's ordinal slot
  // in applyEffects. Returns the delta to record, 0 to claim it with no delta,
  // or undefined/null to decline (the engine then tries the next plugin, else a
  // generic additive default). May push structured deltas onto ctx.deltas.
  applyResource?(res: string, effects: Effect, state: RunState, ctx: PluginContext): number | null | undefined;
  // Mutate the effects payload before it lands.
  modifyEffects?(state: RunState, effects: Effect, ctx: PluginContext): void;
  // Apply the plugin's own effect keys.
  onEffect?(state: RunState, effects: Effect, ctx: PluginContext): void;
  // React after a card resolves.
  afterResolve?(state: RunState, result: SwipeResult, ctx: PluginContext): void;
  // Act-break work; push notes.
  onActBreak?(state: RunState, act: number, notes: string[]): void;
  // A periodic tick; push notes.
  onTick?(state: RunState, notes: string[]): void;
  // Fired once as the finale is evaluated.
  onFinale?(state: RunState): void;

  // ── The modify-hooks. The engine fires each in registration order to fold a
  // plugin's contribution into a core mechanic without naming the plugin. Each
  // is genre-neutral. ──

  // Additive roll bonus, summed into rollComponents' base. `ctx.applied` is an
  // array a plugin pushes the items whose bonus fired onto (read back for
  // lose-on-bad and burnout side-effects). Consumes no rng and is called for the
  // risk-tell too, so keep it pure.
  modifyRoll?(state: RunState, choice: Choice, ctx: RollCtx): number;
  // Transform the roll's jitter band [lo,hi] — a plugin may override or widen it.
  // Returns the new band.
  modifyJitter?(state: RunState, jitter: [number, number], ctx: RollCtx): [number, number];
  // Override the number of cards an act runs.
  modifyActLength?(state: RunState, act: number, base: number): number;
  // A Legacy Points multiplier this plugin contributes, folded into the score
  // product. Identity is 1, so a plugin that returns nothing leaves the score
  // float-exactly unchanged.
  scoreMult?(state: RunState): number;
  // Scale a card's deck weight. Returns the new weight.
  weightDeck?(state: RunState, ev: GameEvent, weight: number): number;
  // Force a category of card into the draw pool at a scheduled slot, the way the
  // shop slot works. Returns a narrowed pool, or the pool unchanged. `ctx.shopDue`
  // says a shop was already forced this draw. Fired after the shop slot, before
  // weighting.
  refineDeck?(state: RunState, pool: GameEvent[], ctx: DeckRefineCtx): GameEvent[];
  // A per-resolution "gain hooks" bag { statGainMult?, burnoutGainMult?,
  // burnoutHealMult? } a plugin contributes, applied by the engine's stat/burnout
  // loops in registration order right after the loadout's own — the core keeps
  // the multiplier mechanic while the sources stay plugins.
  gainHooks?(state: RunState): GainBag | null | undefined;
  // Whether this plugin disables the Encore mechanic this run. OR'd across plugins.
  blocksEncore?(state: RunState): boolean;
  // Adjust the burnout delta a card lands, between the loadout's own burnout
  // hooks and the gain-multiplier bags. `ctx.tags` are the choice tags,
  // `ctx.appliedAccessories` the items whose roll bonus fired.
  modifyBurnout?(state: RunState, v: number, ctx: BurnoutCtx): number;
  // The run-state slots this plugin owns, with their fresh-run defaults. newRun
  // applies these generically (arrays copied per run) so the engine's state
  // literal names no genre.
  stateDefaults?: Record<string, any>;
}

// A burnout-threshold interstitial: crossing the bar interrupts the deck once
// per run with a forced chain card. Pack-declared, so the card ids and any extra
// condition live in the pack — the engine only knows the burnout threshold.
export interface InterstitialRule {
  id: string;           // the chainOnly card to queue
  burnoutMin: number;   // fires when the engine's burnout slot ≥ this
  belowFail?: boolean;  // only while still below the burnout fail threshold
  cond?: (state: RunState) => boolean; // extra pack-owned condition
}

// An always-on run modifier, pack-declared so the engine branches on no perk id.
// Each perk supplies only the hooks/knobs it needs; the engine sums/applies them
// generically at the matching lifecycle point. The knobs are engine mechanics,
// so any genre's perks can bend the same dials — the ids and arithmetic are the
// pack's.
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

// ---------- The second screen (ADR-0014): pack-supplied social feeds ----------
// A generic presentation surface: at a pivotal moment the shell asks the pack
// for the OUTSIDE WORLD's reaction, rendered as platform-skinned social feeds
// the player can open (progressive disclosure) to gauge public standing. The
// shell knows the shape and the chrome; the pack owns every word and which
// community says it. Pure reads of state, like recap/setPiece — no genre is
// named here, and a pack that omits Presenter.feeds renders no second screen.

// One post in a feed. `body` is a diegetic quote (a member of the public
// speaking), so it carries the same cliché-exemption as quoted dialogue.
export interface FeedPost {
  author: string;         // display handle / name
  avatar?: string;        // an emoji glyph for the poster
  body: string;           // the post text
  meta?: string;          // a secondary line (timestamp, flair, "OP")
  reactions?: string;     // a flavour reaction tally ("2.4k · 88 replies")
  pinned?: boolean;       // rendered first, styled as pinned / top comment
  replies?: FeedPost[];   // one level of nested replies (comments)
}
// One community's feed. `skin` selects the platform styling; `mood` is a
// temperature cue the shell may colour. `more` posts sit behind a fold.
export interface FeedChannel {
  id: string;
  name: string;           // display name ("the bird app")
  handle?: string;        // channel chrome sub-label ("v/TheVilla · 2.1M")
  icon: string;           // emoji badge for the tab
  skin: string;           // css skin class ("feed-bird", "feed-forum", …)
  mood?: 'up' | 'down' | 'split' | 'feral' | 'soft';
  header?: string;        // a chrome line (group rules, subreddit banner)
  posts: FeedPost[];
  more?: FeedPost[];
}
// The bundle the shell renders: a one-line teaser (Tier 0) plus the channels
// the browser opens to (Tiers 1–3).
export interface FeedBundle {
  teaser: string;
  headline?: string;
  channels: FeedChannel[];
}
// Which pivotal window the shell is asking about.
export type FeedMoment =
  | { kind: 'result'; ev: GameEvent; tier: Tier | 'declined'; side: Side }
  | { kind: 'recap'; act: number }
  | { kind: 'ending'; endingKey: string };

// The Presenter: the genre's UI-facing flavor, provided by the pack so the UI
// shell reads it instead of statically importing one genre's content. Fields are
// optional; the UI falls back to neutral behavior when a pack omits one.
export interface Presenter {
  // Ending copy: path id → { success, partial, failure } and fail-state keys
  // → { title, art?, text } (see data/meta.ts shape).
  endings: Record<string, any>;
  // Run-state-dependent ending copy, PURE: the shell passes the judged run
  // and everything else the presentation may depend on, explicitly, at the
  // moment it renders the ending screen. Return `{ title, text }` to replace
  // the static `endings` entry, or null/undefined to fall through to it.
  // This is the sanctioned way to vary an ending on the run that earned it
  // (odyssey's Oar Road success variant): derive from the ARGUMENTS. Do not
  // note run state from a plugin hook into presenter-module scope for a
  // getter to read later — that side-channel leaked across engine instances
  // (judge A, judge B, render A → A gets B's ending) until the 2026-07
  // odyssey review had it removed.
  presentFinale?: (ctx: {
    run: RunState;
    ending: string;
    result: 'success' | 'partial' | 'failure' | null;
    meta: any;
  }) => { title: string; text: string } | null | undefined;
  exitInterviews?: Record<string, any>;
  wallItems?: any[];
  trophies?: any[];
  // Flavor generators (pure: state → copy). The UI calls these for the act
  // interstitial (headlines/dms) and the ending screen (epilogue/discography).
  epilogue?: (state: RunState) => string;
  headlines?: (state: RunState, seed: number) => { text: string; src: string }[];
  dms?: (state: RunState, seed: number) => { from: string; text: string }[];
  discography?: (state: RunState) => any[];

  // ── Generic shell hooks (all optional). Every field below is a mechanism
  // slot the UI feature-detects; when absent, the shell renders its original
  // (music-era) defaults, so pack #1 is byte-identical without declaring any
  // of them. No hook names a genre; each pack brings its own copy/data. ──

  // Title screen: logo html, rotating taglines, attract-mode glyphs, the
  // footer line, and the flavor-news item.
  title?: {
    logo: string;
    taglines: string[];
    glyphs?: string[];
    foot?: (meta: any) => string;
    news?: (dayNum: number) => { text: string; src: string } | null;
  };
  // The Settings screen's "about" footer line (the pack's tagline/credit).
  aboutLine?: string;
  // The Résumé's lifetime-stat rows (a `head` row is a section label) and the
  // trailing stat on each Past-Lives history row. Pack-owned so the shared menu
  // names no meter; a pack without them gets the shell's minimal neutral résumé.
  resume?: (meta: any) => { label: string; value: string; head?: boolean }[];
  historyStat?: (h: any) => string;
  // The pack's own fields to store on a Past-Lives run-history row (music: its
  // peak fame), merged over the shell's neutral row (loadout/path/result/…).
  historyEntry?: (summary: any) => Record<string, any>;
  // Whether this pack ships on-swipe minigames (gates the Settings toggles for
  // them; a pack without minigames doesn't show the rows).
  minigameSettings?: boolean;
  // 1-indexed act names (HUD strip, scrapbook) + act-break interstitial copy.
  actNames?: string[];
  actIntro?: Record<number, { name: string; text: string }>;
  // Whether the pack wants to intercept an act-start with its own special
  // overlay (music's Brammies) instead of the default act interstitial. The
  // shell no longer hardcodes the genre's trigger (music's "act 3, fame ≥ 25")
  // — the pack owns the condition; a pack that omits this always gets the
  // default interstitial.
  actStartOverlay?: (state: RunState) => boolean;
  // The pack's special act-start screen (music's Brammies), shown when
  // actStartOverlay says so. It renders with the shell's dom toolkit and calls
  // `onDone` to fall through to the normal act interstitial.
  actStartScreen?: (step: any, onDone: () => void) => void;
  // The act-break chart/standings panel (music's "This week on the Hot 10"):
  // the panel heading plus rendered rows plus whether the week warrants a
  // celebration beat. Null when the pack has no standings to show at this break.
  actBreakChart?: (state: RunState) => { head: string; rows: { cls: string; html: string }[]; celebrate: boolean } | null;
  // The pack's noun for a run segment ("ACT", "WEEK" — ADR-0010: the count is
  // data, and so is the word). The shell renders it wherever it numbers a
  // segment; packs that omit it get the original 'ACT'.
  actWord?: string;
  // The HUD's counter chips (top-right): the pack's resource readout (score,
  // currency, streak…). The shell renders whatever chips this returns.
  hudCounters?: (state: RunState) => { html: string; cls?: string }[];
  // The HUD's gear row (full-HUD packs): the run's persona/loadout and its
  // acquired kit as tappable chips. Each chip is a descriptor the shell renders
  // and wires to a tap-to-inspect sheet; the pack owns what's on it. A pack
  // that omits this (or opts into compactHud) shows no gear row.
  gearChips?: (state: RunState) => { cls: string; html: string; sheet: any }[];
  // Extra HUD action buttons beside the act label (e.g. a chart/standings
  // screen). `badge` is an optional count bubble; `onTap` opens the pack's own
  // screen (packs render bespoke screens with the shell's dom toolkit). The
  // shell always shows its generic Help (and, in compactHud, the status
  // drawer); these are the pack's additions.
  hudButtons?: (state: RunState) => { icon: string; badge?: string | null; onTap: () => void }[];
  // Resolve an equipped-item id (the gear mechanic's per-pack catalog) for
  // HUD chips and swap flows.
  itemById?: (id: string) => any;
  // Fill a card's {tokens} with this run's identities.
  fillTokens?: (state: RunState, text: string) => string;
  // Per-stat inspector blurbs and the help sheet's body.
  statInfo?: Record<string, string>;
  helpBlocks?: string[];
  // Copy for the banked-bonus (encore) mechanic's arm toggle.
  encore?: { ready: string; armed: string };
  // Tutorial copy: the title-screen offer/skip/replay labels and the wrap-up
  // screen (verdict ribbon, title, art slot, closing text, lesson recap).
  // The tutorial MECHANISM (tutorialEvents/tutorialStart, coach marks,
  // forceTier) is engine/shell-generic; only the words are the pack's.
  tutorial?: {
    offer: string; skip: string; replay: string;
    hud?: string; // the HUD act-strip label while the tutorial runs
    end: {
      verdict: string; title: string; art?: string; text: string;
      lessons: { cls: string; html: string }[];
      next?: string; // the "start the real thing" button label
      lpNote?: string; // the first-time LP-award caption (genre-neutral default in the shell)
    };
  };
  // Crossroads copy, and the pre-finale choice screen (head/sub/options; an
  // option is { title, blurb, stat, amount, label, apply(state) }).
  crossroads?: { head: string; sub: string };
  finalSet?: (state: RunState) => { head: string; sub: string; options: any[] };
  // Share text for a finished run.
  shareText?: (summary: any, lp: number) => string;
  // An optional share poster image (music composes one; text-only packs omit
  // it and the shell shares shareText alone).
  shareImage?: (summary: any, lp: number, endingTitle: string) => Promise<File | null>;
  // Pack-specific meta-save writes at run end (best score, nemesis ledger, the
  // pack's lifetime aggregates). The shell does the genre-neutral bookkeeping.
  recordMeta?: (meta: any, summary: any) => void;
  // The "special" trophy predicates keyed by a trophy's `special` id — the ones
  // whose condition reads the meta ledger (and may name the pack's path ids).
  trophySpecials?: Record<string, (meta: any) => boolean>;
  // Ending-screen extras: the pack's legacy lines (music's chart legacy) and an
  // LP-award suffix note (music's contract multiplier).
  endingExtras?: (summary: any, state: RunState) => { lines: { cls: string; html: string }[]; lpNote: string };
  // Pack-owned telemetry props (Epic 5). The shell owns the genre-NEUTRAL spine
  // of the run_start / run_end events (mode, outcome, path, cards, burnout, lp,
  // career_runs) and merges the pack's OWN taxonomy here — so a second game
  // reports ITS concepts (its persona, its meters) instead of music's
  // instrument/genre/venue/fame/hits. A pure read of state; `moment` is
  // 'start' | 'end'. (The pack's summarize() fields already ride run_end
  // generically; this is for the props that aren't in summarize.)
  runProps?: (state: RunState, moment: 'start' | 'end') => Record<string, any>;
  // Short verdict labels for the pack's fail-state endings (ribbon/history).
  failLabels?: Record<string, string>;
  // The act-twist note (engine pushes a neutral marker; packs word it).
  twistNote?: (delta: number) => string;
  // Extra class(es) for a dealt card (authority tiers, ceremony framing).
  cardClass?: (ev: GameEvent) => string | null;
  // The overlay-note channel: a commentary popover one layer above the dealt
  // card (a pack's narrator/telemetry voice). MUST be pure — same state, same
  // note — because deals re-render on resume and the sims never render.
  // Result-side notes ride result.overlayNote (set by a pack plugin) instead.
  overlayNote?: (state: RunState, ev: GameEvent) => { html: string; cls?: string } | null;
  // The people in this scene: a portrait strip rendered on the dealt card
  // (name + face, an optional mood face and sub-label, an optional class for
  // mood-driven styling). Same purity rule as overlayNote. A pack without
  // characters simply omits it.
  cardCast?: (state: RunState, ev: GameEvent) => {
    name: string; face: string; moodFace?: string | null; sub?: string | null; cls?: string;
    // A real portrait image (a pack's generated cast); when present the shell
    // shows it as the profile pic and taps it through to a full-size lightbox,
    // else it renders the emoji `face`. Same "real asset wins" rule as scene art.
    portraitSrc?: string;
  }[] | null;

  // ── Result / card hooks (the pack's own outcome presentation). The shell
  // renders the generic result (tier, recap, delta chips, the deltas.notices
  // channel, gear-slot flow) and the generic card; these let a pack add its
  // subsystem voice without the shell naming a genre concept. ──

  // Custom chip (class + html) for a single stat/resource delta (music's
  // rivalry feud line, its $ money format, its 'Hit!'). Return null for the
  // generic "{icon} {±n} {name}" chip the shell builds from the manifest.
  deltaChip?: (key: string, amount: number, state: RunState) => { cls: string; html: string } | null;
  // Extra result-overlay presentation for this pack: its subsystem notices
  // (gear/venue/song lines…), whether the beat celebrates (confetti + win
  // sting), and whether it plays the cash sound. The shell renders the generic
  // tier/recap/chips and the deltas.notices channel; this adds the pack's own.
  resultExtras?: (result: any, state: RunState) => {
    notices?: { cls: string; html: string }[]; celebrate?: boolean; cash?: boolean;
  } | null;
  // A chosen card's on-swipe minigame (a pack that ships performance beats).
  // The shell freezes the card, awaits the returned promise, and applies the
  // perf as the swipe bonus; returns null when the choice has none (or the
  // player disabled them). The pack runs its own minigame screens here.
  choiceMinigame?: (choice: any, state: RunState) => Promise<any> | null;
  // Whether a choice's button shows the "has a minigame" flag.
  choiceHasMinigame?: (choice: any, state: RunState) => boolean;
  // Record a minigame performance into the run's own fiction (the scrapbook
  // label, skill-echo flags). Called after the swipe resolves, when a perf ran.
  recordPerf?: (perf: any, state: RunState) => void;
  // Per-run UI gates a pack's modifiers can set: hide the risk tell, or disable
  // the banked-bonus (encore) bar. (Music's contracts drive these.)
  hideRisk?: (state: RunState) => boolean;
  encoreDisabled?: (state: RunState) => boolean;
  // Equip an item into the run's gear slots (the shared gear-slot result flow
  // calls this; the pack owns the catalog + equip rules). Returns any extra
  // stat deltas the equip produced, for the result chips.
  equipItem?: (state: RunState, id: string, dropId?: string) => any[] | undefined;

  // ── The clarity screens: four sibling channels of the overlay note. Each is
  // a generic presentation SLOT the shell renders when a pack provides it —
  // the shell knows layout, never content, and a pack that omits one gets the
  // original shell behavior byte-for-byte. All four MUST be pure reads of
  // state (deals re-render on resume; the sims never render). ──

  // A persistent row of this run's load-bearing characters, rendered above
  // the dealt card and re-read every deal. `read` is a short qualitative
  // state label (a tier, a mood — never a raw number); `live` marks the
  // slot(s) the current scene is about; `sheet` backs a tap-to-inspect.
  stage?: (state: RunState, ev: GameEvent | null) => {
    label: string; name: string; face: string; moodFace?: string | null;
    read?: string | null; cls?: string; live?: boolean;
    // A real portrait image for this character; the shell shows it in place of
    // the emoji `face` and (via the inspect sheet) taps it through to a
    // full-size lightbox. Absent → emoji glyph, byte-identical to before.
    portraitSrc?: string;
    // `sheet` backs a tap-to-inspect. It may carry the character's face so the
    // inspector leads with an enlargeable profile pic (name/portraitSrc/moodFace).
    sheet?: {
      title: string; lines: string[];
      name?: string; face?: string; moodFace?: string | null; portraitSrc?: string;
      faceCls?: string; faceSub?: string | null; faceNote?: string | null;
    };
  }[] | null;
  // The result beat: a pack's presentation of HOW the swipe landed, rendered
  // inside the result overlay — a reacting portrait plus qualitative movement
  // lines, replacing the numeric chips it claims via hideChipKeys.
  resultStage?: (state: RunState, result: any) => {
    portrait?: { face: string; moodFace?: string | null; name?: string; sub?: string | null; cls?: string; portraitSrc?: string } | null;
    reads?: { html: string; cls?: string }[];
    hideChipKeys?: string[];
  } | null;
  // A full-screen act-transition takeover: the pack's own "previously on"
  // recap (title, kicker, labeled blocks), replacing the default act-intro
  // copy inside the act interstitial. `seed` is a per-run flavor seed for
  // line rotation — NOT the play RNG.
  recap?: (state: RunState, act: number, seed: number) => {
    kicker?: string; title: string;
    blocks: { label?: string; html: string; cls?: string }[];
  } | null;
  // The finale's reacting faces: who you leave the season standing beside (and
  // who you left in your wake). Rendered as a row of enlargeable portraits on
  // the ending screen, above the prose. Pure read of the finished run; a pack
  // without a cast omits it and the ending screen shows scene art alone.
  endingPortraits?: (summary: any, state: RunState) => {
    label?: string; name: string; face?: string; moodFace?: string | null;
    portraitSrc?: string; sub?: string | null; cls?: string;
  }[] | null;
  // "Meet the Cast": the pack's full roster as a browsable gallery reachable
  // from the title screen. Grouped sections (e.g. the boys / the girls /
  // bombshells), each member an enlargeable profile pic + a one-line read. The
  // shell renders the gallery and the tap-to-enlarge; the pack owns who's in it
  // and how they're described. A pack without a fixed cast omits this and no
  // roster button appears.
  roster?: (meta: any) => {
    title: string; sub?: string;
    groups: {
      label: string;
      members: { name: string; face?: string; portraitSrc?: string; note?: string | null; sub?: string | null; cls?: string }[];
    }[];
  } | null;
  // Set-piece framing on a dealt card: a ceremonial banner plus explicit
  // stakes-in lines rendered above the card, and a class for scene styling.
  // The honest-forecast contract applies: stakes must reflect real state.
  setPiece?: (state: RunState, ev: GameEvent) => {
    banner: string; sub?: string; stakes?: { html: string; cls?: string }[]; cls?: string;
    // Optional feel cue the shell plays generically: 'triumph' (confetti,
    // win sting) or 'blow' (shake, heavy haptic). Content-free.
    mood?: 'triumph' | 'blow';
    // Optional arc key: set-pieces sharing a key play their full-screen beat
    // once per run (the first card of the arc), and later cards in the arc
    // wear only the slim continuity ribbon — the frame is taught once.
    key?: string;
  } | null;
  // The art system's reactive-scene inputs, mapped from this pack's state. The
  // three axes are generic scene-intensity dials (see SceneVibe) — a pack maps
  // whichever of its meters drive the picture.
  vibe?: (state: RunState) => SceneVibe;
  // Art slots this pack registers with the generated-scene painter:
  // slot id → { e: emoji badge, s: scene id }.
  art?: Record<string, { e: string; s: string }>;
  // Responsive raster-image variants this pack registers with the shell's
  // `<picture>` serving layer (js/ui/dom.ts). Keyed by the fallback src a face
  // object carries (its `portraitSrc`) → the AVIF/WebP/JPEG srcset ladder +
  // intrinsic size for that image. Generated by a pack's art tool via
  // tools/image-core.mjs; empty/absent means every <img> the shell renders is a
  // plain optimised tag (still correct, just no format/size negotiation). This
  // is the seam that makes EVERY image — today's cast and any future art — get
  // the SOTA treatment automatically once its variants are registered.
  imageVariants?: Record<string, ImageVariant>;
  // Offer every unlocked persona at run start instead of a random 3.
  offerAllLoadouts?: boolean;
  // The player-gender axis the shell offers between the (universal, shell-owned)
  // name field and the personality picker — name → gender → personality. Each
  // option is { id, label, icon? }; the shell stores the pick on run.gender and
  // remembers it in meta. A pack that omits this shows no gender step (and the
  // shell renders name → personality). The id is the pack's to interpret: the
  // villa keys its coupling pool off it; music treats it as cosmetic.
  genderOptions?: { id: string; label: string; icon?: string }[];
  // ── Run setup (the loadout screen). The shell owns the loadout pick + start
  // button; these let a pack add its own selection layer. ──
  // The loadout-screen title/sub copy (music: "Choose your weapon"). Default
  // covers the base case; comeback/daily copy comes from comeback/daily.
  loadoutPicker?: { head: string; sub: string; empty?: string };
  // The candidate loadout ids to offer (music: contract-forced or unlocked).
  // Omitted → the shell offers every unlockedByDefault / unlockedBy loadout.
  loadoutPool?: (meta: any, sel: any) => string[];
  // Render the pack's optional pre-run choices (music's venue/genre/contract)
  // into the setup screen; mutate `sel` and call `rebuild` on a pick.
  setupExtras?: (host: HTMLElement, ctx: { seed: number; sel: any; rebuild: () => void; daily: boolean }) => void;
  // The chosen-extras summary shown on the sticky start button.
  setupSummary?: (sel: any) => string;
  // Apply the pack's setup choices + run-init to a freshly minted run (after
  // the engine's newRun, before any comeback transform).
  applySetup?: (state: RunState, sel: any, meta: any, daily: boolean) => void;
  // The weekly Gauntlet's fixed-build screen (the mode itself is pack data).
  startGauntlet?: () => void;
  // ADR-0009 (the screen contract): opt into the compact HUD. The stat
  // rail, persona/gear chips, and streak banner leave the permanent screen;
  // one ambient strip remains (act, counters, salience chips) and the full
  // picture moves to a tap-open status drawer. Packs that omit this render
  // the original shell byte-for-byte.
  compactHud?: boolean;
  // This pack ships the weekly Gauntlet mode (its build draws on pack data).
  gauntlet?: boolean;
  // Daily-mode copy: the mode's display name (title button, persona screen)
  // and an end-screen note (streak-aware "come back tomorrow"). The daily
  // MECHANISM (shared date seed, results ledger) is engine/shell-generic.
  daily?: { name: string; endNote?: (summary: any) => string };
  // Comeback-mode copy (title button, persona-screen header/sub); the
  // TRANSFORM stays Pack.comeback. Music's Second Act is the default.
  comeback?: { label: string; head: string; sub: string };

  // ADR-0014 (the second screen): the outside world's reaction at a pivotal
  // moment, as platform-skinned social feeds. The shell renders a teaser +
  // "read the feeds" button; tapping opens the feed browser (one tab per
  // channel, a per-channel fold). MUST be a pure read of state — deals
  // re-render on resume and the sims never render — so derive off flavorSeed
  // and the run's own ledger, never the play RNG. `moment` says which window
  // this is (a card result, an act recap, or the ending). Return null to show
  // no feeds for a given moment (the shell then renders exactly as before).
  feeds?: (state: RunState, moment: FeedMoment) => FeedBundle | null;
}

export interface Pack {
  id: string;
  // The localStorage namespace for this pack's saves. The flagship uses '' so
  // careers predating multi-pack survive; a pack that omits it is namespaced by
  // its id. Lets boot() stay genre-neutral (no `id === 'music'` special-case).
  saveNamespace?: string;
  manifest: PackManifest;
  plugins?: Plugin[];
  events: GameEvent[];
  tutorialEvents: GameEvent[];
  // The loadout: at least one selectable persona and a lookup. Required — a
  // run always starts as SOMEONE.
  loadouts: any[];
  loadoutById: (id: string) => any;
  // Optional capabilities the engine feature-detects; a genre that doesn't ship
  // one simply omits it. Every subsystem lives in the pack's plugins, which own
  // their data by direct import, so this type names no genre and adding one edits
  // new files only.
  interstitials?: InterstitialRule[];
  tutorialStart?: TutorialStart;
  presenter?: Presenter;
  perks?: Record<string, PerkDef>;
  // An optional pack-provided run transform applied at run start when the player
  // has unlocked it (music's comeback mode restarts a career as a faded name).
  // It hardcodes the pack's own stats, so it lives with the pack, not the core.
  comeback?: (state: RunState) => void;
  // The genre-specific fields a pack adds to runSummary (its subsystems'
  // scrapbook data). The engine merges these over the neutral core summary; a
  // pack without subsystems omits it.
  summarize?: (state: RunState) => Record<string, any>;
}

// ---------- Pack validation (the pack contract's runtime half) ----------
// TypeScript checks a hand-authored pack at compile time; validatePack
// (js/validate.ts) checks a GENERATED or imported pack at tool/run time —
// LLM output is external input even when it lands in the repo. One issue is
// one repairable defect: a stable machine code, the path to the offending
// field, a one-sentence message that names the declared vocabulary it failed
// against, and (where one is plausible) a suggested fix.
export interface PackIssue {
  severity: 'error' | 'warning';
  code: string;    // stable machine key, e.g. 'effect-verb-unknown'
  path: string;    // where, e.g. 'events[17] "dragon-at-the-gate" → …effects'
  message: string; // the defect, self-contained (includes declared vocabulary)
  fix?: string;    // the actionable repair, pasteable back into an LLM
}
export interface PackValidation {
  ok: boolean; // zero errors (warnings don't block)
  errors: PackIssue[];
  warnings: PackIssue[];
}

// The flow step advance() returns — what the UI should render next. A
// discriminated union so a consumer's switch is exhaustively checkable (the
// old untyped return had a doc-comment that even omitted the tutorialEnd case).
export type AdvanceStep =
  | { kind: 'card' }
  | { kind: 'crossroads' }
  | { kind: 'actStart'; act: number; notes: string[] }
  | { kind: 'finale' }
  | { kind: 'gameover'; endingKey: string }
  | { kind: 'tutorialEnd' };

// ---------- Runtime run state ----------
// The mutable per-run state. The genre-neutral runtime fields are declared here;
// each pack adds its OWN subsystem fields (resources, subsystem slots) by
// declaration-merging this interface in the pack's own file — the same pattern
// Effect/Requires use — so this type names no genre's resource and the index
// signature that used to launder every typo through `any` is gone.
export interface RunState {
  // ── engine core ──
  version: number;
  packId?: string;                  // which genre this run belongs to (save guard)
  phase: string;
  act: number;
  stats: Record<string, number>;    // pack stats, resolved by name
  flags: string[];
  seed: number | null;
  rngUses?: number;
  path: string | null;
  // The playable character's name — genre-neutral player identity, entered at
  // setup (remembered across runs in meta, always editable). Cosmetic: the sims
  // never set it, so it's absent in golden state. Any pack's copy can address
  // the player by name via the neutral {playerName} token (resolved by the
  // shell in js/ui/context.ts). (A pack may also route its own token to the
  // name — the villa's feed fills {me} with it — but {playerName} is the
  // universal, cross-pack way.)
  name?: string;
  gender?: string;                  // the player's chosen gender id (pack-owned meaning)
  loadout: string;                  // the run's persona/instrument id
  perks?: string[];
  usedEvents: string[];
  seenCards?: string[] | null;      // novelty steering across runs (UI sets from meta)
  cardLog?: any[];                  // per-swipe ledger (summary/scrapbook)
  tierLog?: string[];               // outcome tiers, for the share grid
  ending?: { key?: string | null; result?: string | null } | null;
  // ── run structure / flow ──
  cardsPlayedInAct: number;
  shopPlayedInAct?: boolean;
  currentEventId: string | null;
  pendingChainId: string | null;
  flashpointAt?: number | null;
  flashpointSeen?: boolean;
  actTwist?: { act: number; delta: number } | null;
  flavorSeed?: number;
  copingSeen?: string[];
  // ── generic mechanics ──
  encore?: number;
  encoreChained?: boolean;
  hotStreak?: number;
  badStreak?: number;
  promises?: any[];
  mastery?: number;
  accessories?: string[];           // equipped item ids (gear / edit; pack-owned data)
  // ── mode / meta ──
  gauntlet?: string | number | null;
  daily?: string | null;
  tutorial?: boolean;
  firstRun?: boolean;
  firstLoadout?: string;            // id of the run's first loadout (swap detection)
  swappedLoadout?: boolean;
  coached?: string[];               // tutorial: ids of cards whose coach mark has shown
  history?: any[];
  unlockedPacks?: string[];
  // ── exit interview (generic shell) ──
  exitChoice?: string;
  exitLpBonus?: number;
  exitText?: string;
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
  // A short, plain restatement of the situation this card posed — the reminder
  // the result beat shows so a player never loses the thread of what they were
  // reacting to. Distinct from `context` (the card's scene/speaker label): a
  // recap summarises the MOMENT ("The open mic sign-up sheet is in front of
  // you"), phrased to read cleanly on the after-swipe screen. The shell falls
  // back to `context` when a card hasn't authored one.
  recap?: string;
  context?: string;
  art?: string;
  coach?: string;      // tutorial coaching text
  tutorial?: boolean;  // tutorial-only marker
  forceTier?: Partial<Record<Side, ForceTier>>;
  choices: Record<Side, Choice>;
}
