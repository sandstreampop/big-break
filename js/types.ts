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
  // Resources the engine applies in manifest order (via a pack's applyResource,
  // else a generic additive default). Enumerated here for the packs that use
  // them; a genre declares any further resource verbs via declaration merging.
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
  minigame?: string;
  outcomes: Record<Tier, Outcome>;
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

// The pack manifest: the genre's taxonomy, split out from the balance knobs in
// config. Numbers here are still balance-tuned, but the SHAPE — which stats
// exist, which gate which path — is what makes a pack a genre.
export interface PackManifest {
  stats: string[];
  resources: string[];
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
  // burnout fail. A pack that declares none can only fail on burnout.
  failStates?: FailStateRule[];
  // The penalty for declining a shop card you can't afford. Pack-declared so the
  // core names no stat; a pack that omits it declines for free.
  declinePenalty?: Effect;
  // The copy shown when a costed choice is declined for lack of the cost
  // resource. Pack-declared so the core ships no genre's joke; a pack that
  // omits it gets the engine's default line.
  declineText?: string;
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
  // Per-resolution scratch a plugin stashes for itself across the hooks of ONE
  // card: the engine hands the same context object to modifyEffects/onEffect/
  // afterResolve of a card, so a plugin needs no module-level state.
  chartTitleHandled?: boolean; // songs: has the engine's hits block minted the chartTitle already?
  venueThisCard?: any;         // venue: the room as it was before adoptVenue could fire this card
  hostedThisCard?: boolean;    // venue: did the adopted room host this card's show?
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
  afterResolve?(state: RunState, result: any, ctx: PluginContext): void;
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
  modifyRoll?(state: RunState, choice: Choice, ctx: any): number;
  // Transform the roll's jitter band [lo,hi] — a plugin may override or widen it.
  // Returns the new band.
  modifyJitter?(state: RunState, jitter: [number, number], ctx: any): [number, number];
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
  refineDeck?(state: RunState, pool: GameEvent[], ctx: any): GameEvent[];
  // A per-resolution "gain hooks" bag { statGainMult?, burnoutGainMult?,
  // burnoutHealMult? } a plugin contributes, applied by the engine's stat/burnout
  // loops in registration order right after the loadout's own — the core keeps
  // the multiplier mechanic while the sources stay plugins.
  gainHooks?(state: RunState): any;
  // Whether this plugin disables the Encore mechanic this run. OR'd across plugins.
  blocksEncore?(state: RunState): boolean;
  // Adjust the burnout delta a card lands, between the loadout's own burnout
  // hooks and the gain-multiplier bags. `ctx.tags` are the choice tags,
  // `ctx.appliedAccessories` the items whose roll bonus fired.
  modifyBurnout?(state: RunState, v: number, ctx: any): number;
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

// The Presenter: the genre's UI-facing flavor, provided by the pack so the UI
// shell reads it instead of statically importing one genre's content. Fields are
// optional; the UI falls back to neutral behavior when a pack omits one.
export interface Presenter {
  // Ending copy: path id → { success, partial, failure } and fail-state keys
  // → { title, art?, text } (see data/meta.ts shape).
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
  // 1-indexed act names (HUD strip, scrapbook) + act-break interstitial copy.
  actNames?: string[];
  actIntro?: Record<number, { name: string; text: string }>;
  // The HUD's counter chips (top-right), replacing the default resource row.
  hudCounters?: (state: RunState) => { html: string; cls?: string }[];
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
    };
  };
  // Crossroads copy, and the pre-finale choice screen (head/sub/options; an
  // option is { title, blurb, stat, amount, label, apply(state) }).
  crossroads?: { head: string; sub: string };
  finalSet?: (state: RunState) => { head: string; sub: string; options: any[] };
  // Share text for a finished run.
  shareText?: (summary: any, lp: number) => string;
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
  }[] | null;

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
    sheet?: { title: string; lines: string[] };
  }[] | null;
  // The result beat: a pack's presentation of HOW the swipe landed, rendered
  // inside the result overlay — a reacting portrait plus qualitative movement
  // lines, replacing the numeric chips it claims via hideChipKeys.
  resultStage?: (state: RunState, result: any) => {
    portrait?: { face: string; moodFace?: string | null; name?: string; sub?: string | null; cls?: string } | null;
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
  // Set-piece framing on a dealt card: a ceremonial banner plus explicit
  // stakes-in lines rendered above the card, and a class for scene styling.
  // The honest-forecast contract applies: stakes must reflect real state.
  setPiece?: (state: RunState, ev: GameEvent) => {
    banner: string; sub?: string; stakes?: { html: string; cls?: string }[]; cls?: string;
    // Optional feel cue the shell plays generically: 'triumph' (confetti,
    // win sting) or 'blow' (shake, heavy haptic). Content-free.
    mood?: 'triumph' | 'blow';
  } | null;
  // The art system's reactive-scene inputs, mapped from this pack's state.
  vibe?: (state: RunState) => { fame: number; network: number; burnout: number };
  // Art slots this pack registers with the generated-scene painter:
  // slot id → { e: emoji badge, s: scene id }.
  art?: Record<string, { e: string; s: string }>;
  // Offer every unlocked persona at run start instead of a random 3.
  offerAllLoadouts?: boolean;
  // This pack ships the weekly Gauntlet mode (its build draws on pack data).
  gauntlet?: boolean;
  // Daily-mode copy: the mode's display name (title button, persona screen)
  // and an end-screen note (streak-aware "come back tomorrow"). The daily
  // MECHANISM (shared date seed, results ledger) is engine/shell-generic.
  daily?: { name: string; endNote?: (summary: any) => string };
  // Comeback-mode copy (title button, persona-screen header/sub); the
  // TRANSFORM stays Pack.comeback. Music's Second Act is the default.
  comeback?: { label: string; head: string; sub: string };
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

// The mutable per-run state. The engine reads/writes many string-keyed subsystem
// fields, so typing here stays light: the load-bearing types are the authored
// content boundary above. Known fields are typed; the index signature keeps the
// dynamic subsystem fields ergonomic.
export interface RunState {
  version: number;
  phase: string;
  act: number;
  stats: Record<string, number>;
  // Resources are pack-defined and initialized generically from
  // manifest.resources — they live on the index signature, not as fixed fields,
  // so this type names no genre's resource.
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
