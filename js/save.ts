// Persistence (spec §9): meta progression + in-progress run resume.
// iOS Safari unloads tabs aggressively, so the run is saved on every swipe.

import { INSTRUMENTS } from './data/instruments.js';
import { WALL_ITEMS } from './data/meta.js';

// Per-game storage namespace. The music game keeps the original keys (so
// existing players' saves survive); a second game (mystery) sets its own
// suffix at boot so the two never clobber each other's meta or in-progress run.
let NS = '';
export function setSaveNamespace(ns: string): void {
  NS = ns ? `_${ns}` : '';
}
const metaKey = () => `bigbreak_meta_v1${NS}`;
const runKey = () => `bigbreak_run_v1${NS}`;

function defaultMeta() {
  return {
    lp: 0,
    lpEarnedTotal: 0,
    runs: 0,
    unlockedWall: [],           // Career Wall item ids purchased
    trophies: [],               // trophy ids earned
    successPaths: [],           // paths won (for EGOT-Adjacent)
    firstTimeBonuses: [],       // `${path}_${result}` milestones already paid
    best: { fame: 0, lp: 0 },
    settings: { sound: true, music: true, reducedMotion: null }, // null = follow system
  };
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* storage full or private mode — play on without saving */ }
}

// Meta is deserialized JSON progression, extended dynamically across many
// subsystems (lifetime.byPath/byInstrument, rivalCounts, minigamesPlayed…),
// so it's typed as an open record during the strictness ramp.
export function loadMeta(): any {
  return { ...defaultMeta(), ...(read(metaKey()) || {}) };
}
export function saveMeta(meta) {
  write(metaKey(), meta);
}

// A run resumes only if it belongs to THIS namespace's pack. Namespacing keeps
// packs' localStorage separate already; the packId check is belt-and-suspenders
// for a run written by an older build (no packId) or a bad import.
export function loadRun() {
  const run = read(runKey());
  return run && run.version === 1 && run.phase !== 'ended' ? run : null;
}
export function saveRun(state) {
  write(runKey(), state);
}
export function clearRun() {
  try { localStorage.removeItem(runKey()); } catch (e) {}
}

// Save portability: the whole career as a compact code. Tagged with the active
// pack's namespace so a code can't be pasted into the wrong game.
export function exportSave() {
  const payload = { v: 1, ns: NS, meta: read(metaKey()), run: read(runKey()) };
  return 'BB1.' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function importSave(code) {
  try {
    const raw = code.trim().replace(/^BB1\./, '');
    const payload = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (!payload || payload.v !== 1 || typeof payload.meta !== 'object') return false;
    // Reject a code from another game (§2G: a cross-pack import used to write a
    // foreign career into the active pack's keys — silent corruption). Codes
    // predating the tag (ns === undefined) still import, for back-compat.
    if (payload.ns !== undefined && payload.ns !== NS) return false;
    if (payload.meta) write(metaKey(), payload.meta);
    if (payload.run) write(runKey(), payload.run);
    else localStorage.removeItem(runKey());
    return true;
  } catch (e) {
    return false;
  }
}

export function resetAll() {
  try {
    localStorage.removeItem(metaKey());
    localStorage.removeItem(runKey());
  } catch (e) {}
}

function wallUnlocks(meta, kind) {
  const owned = new Set(meta.unlockedWall);
  return WALL_ITEMS.filter((w) => w.kind === kind && owned.has(w.id)).map((w) => w.target);
}

export function unlockedInstrumentIds(meta) {
  const fromWall = new Set(wallUnlocks(meta, 'instrument'));
  return INSTRUMENTS.filter((i) => i.unlockedByDefault || fromWall.has(i.id)).map((i) => i.id);
}

export function unlockedPackIds(meta) {
  return meta.unlockedWall.filter((id) => id.startsWith('pack_'));
}

export function unlockedPerkIds(meta) {
  return wallUnlocks(meta, 'perk');
}

export function unlockedContractIds(meta) {
  if (meta.runs < 1) return []; // contracts appear after your first finished run
  return ['nepo_baby', 'straight_edge', ...wallUnlocks(meta, 'contract')];
}
