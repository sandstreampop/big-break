// BIG BREAK — UI session context.
//
// The single source of truth for the state the whole UI reads: which game
// (pack) is being played, its taxonomy (paths/stat+resource meta), its
// presenter, the persistent meta-save, and the run in progress. These were
// module-level `let`s inside ui.ts that every screen silently reached into —
// an ambient-state leak. Here they are explicit ES *live bindings*: importers
// read `run`/`meta`/`PRES`/… directly and always see the current value, while
// the only writes go through the setters below. So a screen module never has
// to be handed state or thread it through call signatures — it imports the
// context and reads it, and the setters keep every reader in sync.

import { musicPack } from '../packs/music.js';
import * as save from '../save.js';
import { rivalById } from '../data/rivals.js';
import { accessoryById } from '../data/accessories.js';
import { genreById } from '../data/genres.js';
import { venueById } from '../data/venues.js';
import { collabArtistFor } from '../charts.js';
import { flagshipSong } from '../songs.js';
import { DEFAULT_FAIL_LABELS } from '../share-text.js';
import type { Pack, Presenter, StatMeta, RunState } from '../types.js';

// The game this session is playing. Defaults to music; selectPack() sets it so
// the same UI drives either pack. Taxonomy (PATHS/STAT_META/…) is read from the
// active pack's manifest, resolved by selectPack() once the pack is chosen.
export let activePack: Pack = musicPack;
export let PATHS = musicPack.manifest.paths;
export let STAT_META = musicPack.manifest.statMeta;
export let RESOURCE_META: Record<string, StatMeta> = musicPack.manifest.resourceMeta || {};
// The active pack's Presenter: endings, exit interviews, wall, trophies, and
// flavor generators. The UI reads this instead of importing music's meta and
// flavor modules, so any pack renders its own endings (Phase G).
export let PRES: Presenter = musicPack.presenter as Presenter;
export let meta = save.loadMeta();
export let run: RunState | null = null;

// Point the context at a game. Called once, from boot(), before anything
// renders. Music keeps the original save keys; other packs get their own
// namespace (the caller sets that) so the two games never clobber each other.
export function selectPack(pack: Pack) {
  activePack = pack;
  PATHS = pack.manifest.paths;
  STAT_META = pack.manifest.statMeta;
  RESOURCE_META = pack.manifest.resourceMeta || {};
  PRES = (pack.presenter || musicPack.presenter) as Presenter;
}

// The two reassignments. Screens mutate `run`/`meta` fields freely (that's an
// object mutation, visible everywhere); replacing the whole object — a new run,
// a reloaded meta after reset/import — goes through these so the live bindings
// re-point for every reader.
export function setRun(r: RunState | null) { run = r; }
export function setMeta(m: any) { meta = m; }

// Resolve an equipped-item id through the active pack's catalog (presenter
// hook), else music's accessories — the original static default.
export function itemById(id) {
  return PRES.itemById?.(id) || accessoryById(id);
}

// The art system's reactive-scene inputs for this run — a pack maps its own
// meters onto them (presenter.vibe); the default is music's trio. Read by the
// card art and the ending art, so it lives here below both.
export function vibeFor() {
  if (run && PRES.vibe) return PRES.vibe(run);
  return run
    ? { fame: run.fame, network: run.stats.network, burnout: run.stats.burnout }
    : { fame: 0, network: 0, burnout: 0 };
}

// Short verdict label for the pack's fail-state endings (ribbon, history,
// share). Music's trio is the default; a pack overrides via presenter. Read by
// both the ending screen and the trophy room's history, so it lives here.
export function failLabelFor(endingKey) {
  const labels = PRES.failLabels || DEFAULT_FAIL_LABELS;
  return labels[endingKey];
}

// Display name/icon for ANY taxonomy key — stat, burnout, or resource — read
// from the pack manifest (Phase G.4). Replaces the old fame/hits label
// special-cases so a genre whose gates name any stat or resource renders them.
export const metaFor = (key: string): StatMeta =>
  STAT_META[key] || RESOURCE_META[key] || { name: key, icon: '' };

// Fill {token} placeholders with this run's identities. A pack that ships its
// own token vocabulary provides presenter.fillTokens; the default resolves the
// music tokens ({rival}/{genre}/{song}/{venue}…) exactly as before.
export function fillText(s: string): string {
  if (!s || !run) return s;
  if (PRES.fillTokens) return PRES.fillTokens(run, s);
  const r = rivalById(run.rival);
  const g = genreById(run.genre);
  return s.replaceAll('{rival}', r.name).replaceAll('{rivalVibe}', r.vibe)
    .replaceAll('{genre}', g ? g.name : 'your genre')
    .replaceAll('{collabArtist}', collabArtistFor(run))
    .replaceAll('{song}', flagshipSong(run)?.title || 'the song')
    .replaceAll('{hitSong}', (run.songs || []).find((x) => x.crowned)?.title || 'the hit')
    .replaceAll('{fadedSong}', (run.songs || []).find((x) => x.status === 'faded' && x.peak)?.title || 'your old single')
    .replaceAll('{venue}', venueById(run.venue)?.name || 'the venue');
}
