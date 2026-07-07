// BIG BREAK — the in-game HUD.
//
// The top strip and (in full mode) the stat rail + gear row: act label, chart
// and help buttons, resource counters, burnout vignette, and the tappable gear
// chips. Genre-neutral — everything is read from the manifest + run state, and
// the compact-HUD pack collapses the rail/gear into the status drawer. Also the
// stat-delta floaters. It opens inspector overlays (a forward edge) but never
// routes the game forward.

import { el, $, activatable, reducedMotion } from './dom.js';
import { activePack, run, PRES, STAT_META } from './context.js';
import { sfx, music } from '../audio.js';
import { CONFIG } from '../config.js';
import { showInspect, showInspectStat, showStatusDrawer, showHelp } from './inspectors.js';

let prevStats = null; // for stat-rail delta floaters

export function renderHud() {
  const hud = $('#hud');
  hud.innerHTML = '';
  // Path-flavored score after the Crossroads (falls back to the base act mood)
  const moodKey = run.path && run.act > 1 ? `act${run.act}_${run.path}` : 'act' + run.act;
  music.setMood(moodKey);
  music.setStress(run.stats.burnout / 100);
  // Burnout vignette: the screen itself runs hot as you do
  const game = $('#screen-game');
  game.classList.toggle('burnout-warm', run.stats.burnout >= 50 && run.stats.burnout < 72);
  game.classList.toggle('burnout-hot', run.stats.burnout >= 72);
  const compact = !!PRES.compactHud; // ADR-0009: one ambient strip, drawer for the rest
  const top = el('div', 'hud-top');
  const actWrap = el('span', 'hud-act-wrap');
  const actNames = PRES.actNames || ['', 'The Garage', 'The Grind', 'The Reckoning'];
  actWrap.append(el('span', 'hud-act', run.tutorial
    ? (PRES.tutorial?.hud || 'FIRST GIG · The Rubber Room')
    : `${PRES.actWord || 'ACT'} ${run.act} · ${actNames[run.act]}`));
  // Pack-contributed HUD buttons (e.g. music's Hot 10). The shell always shows
  // Help below; the pack adds its own screens.
  for (const b of PRES.hudButtons?.(run) || []) {
    const bEl = el('button', 'chart-btn', b.badge ? `${b.icon}<span class="chart-badge">${b.badge}</span>` : b.icon);
    bEl.addEventListener('click', () => { sfx.ui(); b.onTap(); });
    actWrap.append(bEl);
  }
  const helpBtn = el('button', 'chart-btn', '❓');
  helpBtn.addEventListener('click', () => { sfx.ui(); showHelp(); });
  actWrap.append(helpBtn);
  if (compact) {
    // Tier 3 entry point: everything the rail and gear row used to force-feed.
    const drawerBtn = el('button', 'chart-btn drawer-btn', '☰');
    drawerBtn.addEventListener('click', () => { sfx.ui(); showStatusDrawer(); });
    actWrap.append(drawerBtn);
  }
  top.append(actWrap);
  const counters = el('span', 'hud-counters');
  for (const c of PRES.hudCounters?.(run) || []) counters.append(el('span', c.cls || 'hud-counter', c.html));
  if (compact) {
    // Salience over permanence (ADR-0009): the danger meter earns a chip
    // only once it matters; the hot streak rides as a small chip, not a
    // banner. Both tap through to their explanation.
    const b = run.stats.burnout;
    if (!run.tutorial && b >= 45) {
      const pip = el('span', 'hud-danger' + (b >= 70 ? ' danger' : ' warn'), STAT_META.burnout.icon);
      pip.addEventListener('click', () => { sfx.ui(); showInspectStat('burnout'); });
      counters.append(pip);
    }
    if (!run.tutorial && (run.hotStreak || 0) >= CONFIG.hotStreakAt) {
      counters.append(el('span', 'hud-streak', `🔥×${run.hotStreak}`));
    }
  }
  top.append(counters);
  hud.append(top);

  // Compact mode ends the HUD here: the rail, the streak banner, and the
  // gear row live in the status drawer (Tier 3), one tap away.
  if (compact) return;

  // U3: the hot streak is a visible thing you're riding
  if (!run.tutorial && (run.hotStreak || 0) >= CONFIG.hotStreakAt) {
    const roll = el('div', 'on-a-roll', `🔥 ON A ROLL ×${run.hotStreak} — the deck is showing you things`);
    hud.append(roll);
  }

  const rail = el('div', 'stat-rail');
  for (const key of [...activePack.manifest.stats, 'burnout']) {
    const v = run.stats[key];
    const item = el('div', 'stat' + (key === 'burnout' ? ' stat-burnout' : ''));
    item.dataset.stat = key;
    activatable(item, () => { sfx.ui(); showInspectStat(key); });
    if (key === 'burnout' && v >= 70) item.classList.add('danger');
    else if (key === 'burnout' && v >= 45) item.classList.add('warn');
    item.title = STAT_META[key].name;
    const head = el('span', 'stat-head');
    head.append(el('span', 'stat-icon', STAT_META[key].icon));
    head.append(el('span', 'stat-val', String(v)));
    item.append(head);
    const bar = el('div', 'stat-bar');
    bar.append(el('div', 'stat-fill', ''));
    bar.querySelector('.stat-fill').style.width = `${v}%`;
    item.append(bar);
    rail.append(item);
  }
  hud.append(rail);

  // The gear row: the pack's persona + acquired kit as tappable inspect chips.
  // The shell renders whatever descriptors the pack returns; it names none of
  // the kit (instrument, venue, contract, hustle…).
  const gearRow = el('div', 'gear-row');
  for (const c of PRES.gearChips?.(run) || []) {
    const chip = el('span', c.cls, c.html);
    activatable(chip, () => { sfx.ui(); showInspect(c.sheet); });
    gearRow.append(chip);
  }
  hud.append(gearRow);
}

// Floating +N/−N chips over the stat rail when values changed since last card
export function spawnStatFloaters() {
  if (!prevStats || reducedMotion()) { prevStats = snapshotStats(); return; }
  const cur = snapshotStats();
  document.querySelectorAll('#hud .stat').forEach((item) => {
    const key = (item as HTMLElement).dataset.stat;
    const d = cur[key] - (prevStats[key] ?? cur[key]);
    if (!d) return;
    const goodDelta = key === 'burnout' ? d < 0 : d > 0;
    const f = el('span', 'stat-floater ' + (goodDelta ? 'up' : 'down'), (d > 0 ? '+' : '') + d);
    item.append(f);
    setTimeout(() => f.remove(), 1400);
  });
  prevStats = cur;
}
function snapshotStats() {
  // The floaters spawn over the stat rail (.stat items keyed by stat id), so
  // only the manifest stats matter here — a genre-neutral snapshot.
  return { ...run.stats };
}
