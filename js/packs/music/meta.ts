// Music's meta-save bookkeeping and ending-screen extras, moved out of
// js/ui/endings.ts so the shared close-of-run logic names no music resource,
// path id, or subsystem. The shell owns the genre-neutral spine (runs, LP,
// trophies loop, run history, lifetime swipe counts); these hooks add music's:
// its best-fame / nemesis ledger, its special trophy predicates (which name
// music path ids), and its chart-legacy + contract-multiplier ending lines.

import { contractById } from './data/contracts.js';
import { instrumentById } from './data/instruments.js';
import { PATHS } from './manifest.js';

// The Résumé's lifetime-stat rows (a `head` row is a section label). Music owns
// its whole résumé — the shell just lays out label/value rows — so the shared
// menu names no fame/hit/instrument. A pack without this hook gets the shell's
// minimal neutral résumé (runs/swipes/incredibles/legacy).
export function musicResume(meta: any): { label: string; value: string; head?: boolean }[] {
  const lt = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byLoadout: {}, byPath: {}, hits: 0, moneyBest: 0 };
  const rows: { label: string; value: string; head?: boolean }[] = [
    { label: 'Careers attempted', value: String(meta.runs) },
    { label: 'Decisions swiped', value: String(lt.swipes) },
    { label: 'Incredibles rolled', value: String(lt.incredibles) },
    { label: 'Faceplants survived', value: String(lt.bads) },
    { label: 'Hits written', value: String(lt.hits) },
    { label: 'Best bank balance', value: `$${lt.moneyBest}` },
    { label: 'Best fame', value: `★${meta.best.fame || 0}` },
    { label: 'Legacy earned', value: `${meta.lpEarnedTotal} LP` },
    { label: 'Dailies played', value: String(Object.keys(meta.dailyResults || {}).length) },
  ];
  const mgPlays = Object.values(meta.minigamesPlayed || {}).reduce((a: any, b: any) => a + b, 0) as number;
  if (mgPlays) rows.push({ label: 'Performances played', value: `${mgPlays} (${Object.keys(meta.minigamesPlayed).length} kinds)` });
  if (meta.mgGolden) rows.push({ label: 'GOLDEN moments', value: String(meta.mgGolden) });
  rows.push({ label: 'By path', value: '', head: true });
  for (const [pid, p] of Object.entries<any>(lt.byPath)) {
    rows.push({ label: `${PATHS[pid]?.icon || ''} ${PATHS[pid]?.name || pid}`, value: `${p.wins}/${p.runs} won (${p.runs ? Math.round((100 * p.wins) / p.runs) : 0}%)` });
  }
  const instRuns = Object.entries<any>(lt.byLoadout).sort((a, b) => b[1].runs - a[1].runs);
  if (instRuns.length) {
    rows.push({ label: 'Weapon of choice', value: '', head: true });
    for (const [iid, st] of instRuns.slice(0, 3)) {
      rows.push({ label: instrumentById(iid)?.name || iid, value: `${st.runs} run${st.runs === 1 ? '' : 's'}, ${st.wins} win${st.wins === 1 ? '' : 's'}` });
    }
  }
  return rows;
}

// The trailing stat shown on each Past-Lives history row (music: peak fame).
export const musicHistoryStat = (h: any): string => `★${h.fame}`;

// Pack-specific meta writes at the end of a run (best score, nemesis ledger,
// the music-only lifetime aggregates). The shell does the neutral bookkeeping.
export function musicRecordMeta(meta: any, summary: any) {
  meta.best.fame = Math.max(meta.best.fame || 0, summary.fame || 0);
  if (summary.rival) {
    meta.rivalCounts = meta.rivalCounts || {};
    meta.rivalCounts[summary.rival] = (meta.rivalCounts[summary.rival] || 0) + 1;
  }
  // Music's lifetime extras: hits written + best bank. (The generic per-loadout
  // and per-path records live in the shell — they feed engine loadout-mastery.)
  const lt = meta.lifetime;
  if (lt) {
    lt.hits = (lt.hits || 0) + (summary.hits || 0);
    lt.moneyBest = Math.max(lt.moneyBest || 0, summary.money || 0);
  }
}

// Music's Past-Lives row field: the run's peak fame (shown by historyStat).
export const musicHistoryEntry = (summary: any) => ({ fame: summary.fame || 0 });

// The "special" trophy predicates — the ones whose condition reads the meta
// ledger (and names music's own path ids). Pack-owned so the shell's trophy
// loop names no genre; a trophy with `special: 'x'` fires when specials.x()
// returns true.
export const musicTrophySpecials: Record<string, (meta: any) => boolean> = {
  all_paths: (meta) => ['megastar', 'studio', 'hitfactory'].every((p) => meta.successPaths.includes(p)),
  daily_3: (meta) => Object.keys(meta.dailyResults || {}).length >= 3,
  wall_5: (meta) => meta.unlockedWall.length >= 5,
  mastery_3: (meta) => Object.values(meta.lifetime?.byLoadout || {})
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
