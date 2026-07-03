// The music pack (pack #1). Assembles everything the engine used to import
// as hardwired content into a single injectable Pack. This is the only place
// that knows the music game's content modules; the engine imports none of
// them. A second game (mystery, pack #2) is a sibling of this file.

import { EVENTS } from '../data/events.js';
import { TUTORIAL_EVENTS } from '../data/tutorial.js';
import { INSTRUMENTS, instrumentById } from '../data/instruments.js';
import { ACCESSORIES, accessoryById, gearPool } from '../data/accessories.js';
import { contractById } from '../data/contracts.js';
import { hustleById } from '../data/hustles.js';
import { genreById } from '../data/genres.js';
import { bandmateById, recruitCandidate } from '../data/band.js';
import { ARCS, arcById, rollSeeds } from '../data/arcs.js';
import { weatherHooks, rollWeather } from '../data/weather.js';
import { musicManifest } from './music-manifest.js';
import { venuePlugin } from './plugins/venue.js';
import { rivalPlugin } from './plugins/rival.js';
import { bandPlugin } from './plugins/band.js';
import { songsPlugin } from './plugins/songs.js';
import { weatherPlugin } from './plugins/weather.js';
import { genrePlugin } from './plugins/genre.js';
import { hustlePlugin } from './plugins/hustle.js';
import { economyPlugin } from './plugins/economy.js';
import { gearPlugin } from './plugins/gear.js';
import { loadoutPlugin } from './plugins/loadout.js';
import { musicPresenter } from './music-presenter.js';
import { MUSIC_PERKS } from './music-perks.js';
import type { Pack, RunState } from '../types.js';

// "You have a hit" — the condition on the songs-era coping interstitial. Reads
// song state, so it lives here in music content, not in the core (D.3).
const hasHit = (s: RunState) =>
  (s.songs || []).some((x: any) => x.crowned || (x.status === 'charting' && x.pos && x.pos <= 5));

const clampStat = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Comeback Mode (WP3): unlocked by any Success, a career restarts as a faded
// name — fame and contacts pre-loaded, cred and burnout bruised. It hardcodes
// music stats (cred/network), so it's the pack's, dispatched by the engine's
// applyComeback. A pack without a comeback mode omits this.
const musicComeback = (state: RunState) => {
  state.fame = 45;
  state.money = 300;
  state.stats.cred = Math.max(8, state.stats.cred - 8);
  state.stats.network = clampStat(state.stats.network + 15, 1, 100);
  state.stats.burnout = 25;
  if (!state.flags.includes('comeback')) state.flags.push('comeback');
};

// The music genre's effect vocabulary, declared by the pack rather than baked
// into the shared Effect union (Phase C). Its four core stats and its venue /
// songs subsystem verbs — added here, editing no shared type.
declare module '../types.js' {
  interface Effect {
    // music core stats
    skill?: number; cred?: number; creativity?: number; network?: number;
    // venue subsystem
    adoptVenue?: string; venueLove?: number; venueLoveStart?: number;
    // songs subsystem
    hypeSong?: number; polishDemo?: number; writeSong?: boolean;
    albumDrop?: number | boolean; releaseDemo?: number | boolean;
    chartTitle?: string;
    // structural verbs (WP4): loadout / roster / hustle / gear — owned by their
    // plugins, no longer enumerated on the shared Effect.
    setInstrument?: string; grantBandmate?: string; removeBandmate?: string;
    grantHustle?: string; removeGear?: string; grantGear?: string;
  }
  // The music genre's eligibility vocabulary (WP1): its subsystem-shaped
  // `requires` keys, added to the shared Requires by declaration merging (the
  // sibling of the Effect augmentation above) so the core Requires names no
  // music subsystem. Each key is backed by a predicate a plugin registers.
  interface Requires {
    // fame (economy) · rival · weather · genre · hustle · venue · band · songs
    fameMin?: number; fameMax?: number;
    nemesis?: boolean; rivalIs?: string; rivalryMin?: number; rivalryMax?: number;
    weatherIs?: string;
    genreAny?: boolean;
    hustleMin?: number;
    venueAny?: boolean; venueNone?: boolean; venueIs?: string; venueLevelMin?: number;
    bandMin?: number; bandMax?: number; bandHas?: string;
    demoMin?: number; chartingMin?: number; songsMin?: number; fadedMin?: number;
  }
}

export const musicPack: Pack = {
  id: 'music',
  manifest: musicManifest,
  // Order matters: onConstruct draws rival (then seeds); onRunStart draws
  // weather before songs' notebook demo; onActBreak fires band quirks (notebook
  // draws RNG) before songs' deadline audit + chart week — matching the old
  // inline order so the seeded stream is unchanged.
  plugins: [venuePlugin, rivalPlugin, weatherPlugin, genrePlugin, loadoutPlugin, gearPlugin, hustlePlugin, bandPlugin, songsPlugin, economyPlugin],
  events: EVENTS,
  tutorialEvents: TUTORIAL_EVENTS,
  // Burnout coping interstitials, high→low priority (D.3): the ids and the
  // "you have a hit" condition live here, not in the engine.
  interstitials: [
    { id: 'coping_75', burnoutMin: 75, belowFail: true },
    { id: 'coping_song', burnoutMin: 62, cond: hasHit },
    { id: 'coping_50', burnoutMin: 50 },
  ],
  // The First Gig onboarding run's fixed teaching setup (D.3).
  tutorialStart: { instrument: 'melodica', stats: { skill: 40, cred: 30, creativity: 8, network: 35, burnout: 5 }, money: 40, fame: 0 },
  presenter: musicPresenter,
  perks: MUSIC_PERKS,
  comeback: musicComeback,
  instruments: INSTRUMENTS,
  accessories: ACCESSORIES,
  gearPool,
  arcs: ARCS,
  instrumentById,
  accessoryById,
  contractById,
  hustleById,
  genreById,
  bandmateById,
  recruitCandidate,
  arcById,
  rollSeeds,
  weatherHooks,
  rollWeather,
};
