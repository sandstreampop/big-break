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

import type { Pack, Presenter, StatMeta, RunState } from '../types.js';

// The game this session is playing. `null` until boot() calls selectPack() with
// the pack an entrypoint chose — the shell names no genre, not even a default.
// (main.ts boots music; main-love-island.ts boots the villa.)
export let activePack: Pack = null as any;
export let PATHS: Record<string, any> = {};
export let STAT_META: Record<string, StatMeta> = {};
export let RESOURCE_META: Record<string, StatMeta> = {};
// The active pack's Presenter: endings, HUD/flavor hooks, feeds, and copy. The
// shell reads pack behavior ONLY through this interface — never a genre module.
export let PRES: Presenter = null as any;
export let meta: any = null;
export let run: RunState | null = null;

// Point the context at a game. Called once, from boot(), before anything
// renders — it resolves the pack's taxonomy and presenter into the live
// bindings the whole shell reads.
export function selectPack(pack: Pack) {
  activePack = pack;
  PATHS = pack.manifest.paths;
  STAT_META = pack.manifest.statMeta;
  RESOURCE_META = pack.manifest.resourceMeta || {};
  PRES = pack.presenter as Presenter;
}

// The two reassignments. Screens mutate `run`/`meta` fields freely (that's an
// object mutation, visible everywhere); replacing the whole object — a new run,
// a reloaded meta after reset/import — goes through these so the live bindings
// re-point for every reader.
export function setRun(r: RunState | null) { run = r; }
export function setMeta(m: any) { meta = m; }

// Resolve an equipped-item id through the active pack's item catalog
// (presenter hook) — for HUD chips and gear-swap flows. Null if the pack has
// no item mechanic.
export function itemById(id): any {
  return PRES.itemById?.(id) ?? null;
}

// The art system's reactive-scene inputs for this run — each pack maps its own
// meters onto the scene axes via presenter.vibe. Read by the card art and the
// ending art, so it lives here below both. Neutral zero when a pack opts out.
export function vibeFor() {
  return run && PRES.vibe ? PRES.vibe(run) : { fame: 0, network: 0, burnout: 0 };
}

// Short verdict label for the pack's fail-state endings (ribbon, history).
// Each pack supplies its own labels via presenter.failLabels.
export function failLabelFor(endingKey): string | undefined {
  return PRES.failLabels?.[endingKey];
}

// Career-Wall unlocks of a given kind: the targets of every owned wall item of
// that kind, read from the active pack's wall catalog (PRES.wallItems). Generic
// — `meta.unlockedWall` is a neutral list of purchased ids; the pack's catalog
// maps each to its kind + target. (Music-specific unlock pools — instruments,
// contracts — live in the music pack and call through here.)
export function wallUnlocks(m: any, kind: string): string[] {
  const owned = new Set(m.unlockedWall);
  return (PRES?.wallItems || []).filter((w: any) => w.kind === kind && owned.has(w.id)).map((w: any) => w.target);
}
// The wall-unlocked pack modules and perks — the genre-neutral args the engine's
// newRun takes. (Packs are keyed by a `pack_` id prefix; perks are a wall kind.)
export const unlockedPackIds = (m: any): string[] => m.unlockedWall.filter((id: string) => id.startsWith('pack_'));
export const unlockedPerkIds = (m: any): string[] => wallUnlocks(m, 'perk');

// Display name/icon for ANY taxonomy key — stat, burnout, or resource — read
// from the pack manifest. A genre whose gates name any stat or resource
// renders them without the shell knowing the vocabulary.
export const metaFor = (key: string): StatMeta =>
  STAT_META[key] || RESOURCE_META[key] || { name: key, icon: '' };

// Fill a card's {token} placeholders with this run's identities, using the
// active pack's token vocabulary (presenter.fillTokens). The neutral
// {playerName} token (the player's own name) is resolved by the shell first —
// it's universal, not a genre concept — so any pack's copy can address the
// player by name for free. (Deliberately NOT {me}: the villa already owns {me}
// as a per-channel nickname, so the shell stays off that token.)
export function fillText(s: string): string {
  if (!s || !run) return s;
  const named = run.name ? s.replaceAll('{playerName}', run.name) : s;
  return PRES.fillTokens ? PRES.fillTokens(run, named) : named;
}

// Human-readable label for a gender id, resolved through the active pack's
// gender axis (presenter.genderOptions). Neutral: the shell reads it to show
// the player's identity where stats live, without naming any option itself.
// Falls back to the raw id when the pack declares no matching option.
export function genderLabelFor(id: string | undefined | null): string {
  if (!id) return '';
  const opt = (PRES?.genderOptions || []).find((o) => o.id === id);
  return opt ? `${opt.icon ? opt.icon + ' ' : ''}${opt.label}` : id;
}
