// Music's meta-save bookkeeping and ending-screen extras, moved out of
// js/ui/endings.ts so the shared close-of-run logic names no music resource,
// path id, or subsystem. The shell owns the genre-neutral spine (runs, LP,
// trophies loop, run history, lifetime swipe counts); these hooks add music's:
// its best-fame / nemesis ledger, its special trophy predicates (which name
// music path ids), and its chart-legacy + contract-multiplier ending lines.

import { contractById } from './data/contracts.js';

// Pack-specific meta writes at the end of a run (best score, nemesis ledger,
// the music-only lifetime aggregates). The shell does the neutral bookkeeping.
export function musicRecordMeta(meta: any, summary: any) {
  meta.best.fame = Math.max(meta.best.fame || 0, summary.fame || 0);
  if (summary.rival) {
    meta.rivalCounts = meta.rivalCounts || {};
    meta.rivalCounts[summary.rival] = (meta.rivalCounts[summary.rival] || 0) + 1;
  }
  const lt = meta.lifetime;
  if (lt) {
    lt.hits += summary.hits || 0;
    lt.moneyBest = Math.max(lt.moneyBest || 0, summary.money || 0);
  }
}

// The "special" trophy predicates — the ones whose condition reads the meta
// ledger (and names music's own path ids). Pack-owned so the shell's trophy
// loop names no genre; a trophy with `special: 'x'` fires when specials.x()
// returns true.
export const musicTrophySpecials: Record<string, (meta: any) => boolean> = {
  all_paths: (meta) => ['megastar', 'studio', 'hitfactory'].every((p) => meta.successPaths.includes(p)),
  daily_3: (meta) => Object.keys(meta.dailyResults || {}).length >= 3,
  wall_5: (meta) => meta.unlockedWall.length >= 5,
  mastery_3: (meta) => Object.values(meta.lifetime?.byInstrument || {})
    .some((st: any) => Math.min(3, Math.floor(st.runs / 2) + st.wins) >= 3),
  exits_3: (meta) => (meta.exitSeen || []).length >= 3,
  nemesis_3: (meta) => Object.values(meta.rivalCounts || {}).some((n: any) => n >= 3),
  mg_6: (meta) => Object.keys(meta.minigamesPlayed || {}).length >= 6,
  mg_12: (meta) => Object.keys(meta.minigamesPlayed || {}).length >= 12,
};

// The ending screen's music extras: the chart-legacy line and the contract
// LP-multiplier note appended to the Legacy Points award.
export function musicEndingExtras(summary: any, run: any): { lines: { cls: string; html: string }[]; lpNote: string } {
  const lines: { cls: string; html: string }[] = [];
  const songs = summary?.songs || run.songs || [];
  const charted = songs.filter((x: any) => x.peak).length;
  const crowned = songs.filter((x: any) => x.crowned).length;
  const peak = summary?.chartPeak;
  if (charted) {
    const bits = [`peak <b>#${peak}</b>`, `${charted} song${charted > 1 ? 's' : ''} charted`];
    if (crowned) bits.push(`${crowned} certified hit${crowned > 1 ? 's' : ''} 👑`);
    lines.push({ cls: 'chart-legacy', html: `📈 Chart legacy: ${bits.join(' · ')}` });
  }
  const endContract = summary?.contract ? contractById(summary.contract) : null;
  const lpNote = endContract ? ` <span class="lp-mult">(${endContract.icon} ${endContract.name} ×${endContract.lpMult})</span>` : '';
  return { lines, lpNote };
}
