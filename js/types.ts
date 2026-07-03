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
