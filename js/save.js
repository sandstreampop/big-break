// Persistence (spec §9): meta progression + in-progress run resume.
// iOS Safari unloads tabs aggressively, so the run is saved on every swipe.

import { INSTRUMENTS } from './data/instruments.js';

const META_KEY = 'bigbreak_meta_v1';
const RUN_KEY = 'bigbreak_run_v1';

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

export function loadMeta() {
  return { ...defaultMeta(), ...(read(META_KEY) || {}) };
}
export function saveMeta(meta) {
  write(META_KEY, meta);
}

export function loadRun() {
  const run = read(RUN_KEY);
  return run && run.version === 1 && run.phase !== 'ended' ? run : null;
}
export function saveRun(state) {
  write(RUN_KEY, state);
}
export function clearRun() {
  try { localStorage.removeItem(RUN_KEY); } catch (e) {}
}

export function resetAll() {
  try {
    localStorage.removeItem(META_KEY);
    localStorage.removeItem(RUN_KEY);
  } catch (e) {}
}

export function unlockedInstrumentIds(meta) {
  const fromWall = new Set(meta.unlockedWall);
  return INSTRUMENTS.filter(
    (i) => i.unlockedByDefault ||
      ['inst_electric', 'inst_sampler', 'inst_voice'].some(
        (w) => fromWall.has(w) && wallTarget(w) === i.id
      )
  ).map((i) => i.id);
}

function wallTarget(wallId) {
  return { inst_electric: 'electric_guitar', inst_sampler: 'sampler', inst_voice: 'own_voice' }[wallId];
}

export function unlockedPackIds(meta) {
  return meta.unlockedWall.filter((id) => id.startsWith('pack_'));
}

export function unlockedContractIds(meta) {
  if (meta.runs < 1) return []; // contracts appear after your first finished run
  const wall = new Set(meta.unlockedWall);
  const wallTargets = {
    ct_one_take: 'one_take', ct_imposter: 'imposter',
    ct_overnight: 'overnight', ct_kazoo: 'kazoo_clause',
  };
  const ids = ['nepo_baby', 'straight_edge'];
  for (const [wallId, cid] of Object.entries(wallTargets)) {
    if (wall.has(wallId)) ids.push(cid);
  }
  return ids;
}
