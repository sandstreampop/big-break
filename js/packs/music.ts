// The music pack (pack #1). Assembles everything the engine used to import
// as hardwired content into a single injectable Pack. This is the only place
// that knows the music game's content modules; the engine imports none of
// them. A second game (mystery, pack #2) is a sibling of this file.

import { EVENTS } from '../data/events.js';
import { TUTORIAL_EVENTS } from '../data/tutorial.js';
import { INSTRUMENTS, instrumentById } from '../data/instruments.js';
import { ACCESSORIES, accessoryById } from '../data/accessories.js';
import { randomRival } from '../data/rivals.js';
import { contractById } from '../data/contracts.js';
import { hustleById } from '../data/hustles.js';
import { genreById } from '../data/genres.js';
import { venueById, VENUE_TIERS } from '../data/venues.js';
import { bandmateById, recruitCandidate } from '../data/band.js';
import { ARCS, arcById, rollSeeds } from '../data/arcs.js';
import { weatherHooks, rollWeather } from '../data/weather.js';
import { musicManifest } from './music-manifest.js';
import { venuePlugin } from './plugins/venue.js';
import { rivalPlugin } from './plugins/rival.js';
import { bandPlugin } from './plugins/band.js';
import { songsPlugin } from './plugins/songs.js';
import { musicPresenter } from './music-presenter.js';
import type { Pack, RunState } from '../types.js';

// "You have a hit" — the condition on the songs-era coping interstitial. Reads
// song state, so it lives here in music content, not in the core (D.3).
const hasHit = (s: RunState) =>
  (s.songs || []).some((x: any) => x.crowned || (x.status === 'charting' && x.pos && x.pos <= 5));

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
  }
}

export const musicPack: Pack = {
  id: 'music',
  manifest: musicManifest,
  // Order matters: onActBreak fires band quirks (notebook draws RNG) before
  // songs' deadline audit + chart week, matching the old inline order.
  plugins: [venuePlugin, rivalPlugin, bandPlugin, songsPlugin],
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
  instruments: INSTRUMENTS,
  accessories: ACCESSORIES,
  arcs: ARCS,
  VENUE_TIERS,
  instrumentById,
  accessoryById,
  randomRival,
  contractById,
  hustleById,
  genreById,
  venueById,
  bandmateById,
  recruitCandidate,
  arcById,
  rollSeeds,
  weatherHooks,
  rollWeather,
};
