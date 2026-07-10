// Persistence (spec §9): meta progression + in-progress run resume.
// iOS Safari unloads tabs aggressively, so the run is saved on every swipe.

// Per-game storage namespace. The music game keeps the original keys (so
// existing players' saves survive); a second game sets its own suffix at boot
// so the two never clobber each other's meta or in-progress run.
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
    playerName: '',             // the playable character's name, remembered across runs (editable each start)
    playerGender: null,         // the last-picked gender id, pre-selected next start
    unlockedWall: [],           // Career Wall item ids purchased
    trophies: [],               // trophy ids earned
    successPaths: [],           // paths won (for EGOT-Adjacent)
    firstTimeBonuses: [],       // `${path}_${result}` milestones already paid
    best: { lp: 0 },          // neutral score record; a pack adds its own (music: best.fame)
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
// subsystems (lifetime.byPath/byLoadout, rivalCounts, minigamesPlayed…),
// so it's typed as an open record during the strictness ramp.
export function loadMeta(): any {
  const meta = { ...defaultMeta(), ...(read(metaKey()) || {}) };
  // Migration: the per-loadout mastery aggregate was once keyed `byInstrument`
  // (a music noun in genre-neutral persistence). Rename in place so existing
  // careers keep their mastery; harmless when neither key is present.
  const lt = meta.lifetime;
  if (lt && lt.byInstrument && !lt.byLoadout) {
    lt.byLoadout = lt.byInstrument;
    delete lt.byInstrument;
  }
  return meta;
}
export function saveMeta(meta) {
  write(metaKey(), meta);
}

// A run resumes only if it belongs to THIS namespace's pack. Namespacing keeps
// packs' localStorage separate already; the packId check is belt-and-suspenders
// for a run written by a bad import or a pre-tag export code. A run from an
// older build (no packId stamped) still resumes — back-compat.
export function loadRun(expectedPackId?: string) {
  const run = read(runKey());
  if (!(run && run.version === 1 && run.phase !== 'ended')) return null;
  if (expectedPackId && run.packId && run.packId !== expectedPackId) return null;
  return run;
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

// Note: the pack-aware unlock pools (wall unlocks, unlocked packs/perks) live
// in js/ui/context.ts (they read the active pack's wall catalog), and the
// music-specific pools (instruments, contracts) live in the music pack. This
// module stays pure persistence — it names no genre.
