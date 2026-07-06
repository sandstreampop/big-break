// BIG BREAK — the in-game HUD.
//
// The top strip and (in full mode) the stat rail + gear row: act label, chart
// and help buttons, resource counters, burnout vignette, and the tappable gear
// chips. Genre-neutral — everything is read from the manifest + run state, and
// the compact-HUD pack collapses the rail/gear into the status drawer. Also the
// stat-delta floaters. It opens inspector overlays (a forward edge) but never
// routes the game forward.

import { el, $, activatable, reducedMotion } from './dom.js';
import { activePack, run, PRES, STAT_META, itemById } from './context.js';
import { sfx, music } from '../audio.js';
import { CONFIG } from '../config.js';
import { showInspect, showInspectStat, showStatusDrawer, showChart, showHelp } from './inspectors.js';
import { weatherById } from '../data/weather.js';
import { contractById } from '../data/contracts.js';
import { genreById } from '../data/genres.js';
import { venueById, VENUE_TIERS } from '../data/venues.js';
import { bandmateById } from '../data/band.js';
import { hustleById } from '../data/hustles.js';

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
  // The Hot 10 belongs to the songs subsystem — only runs that carry it get
  // the chart button.
  if (!run.tutorial && run.songs) {
    const chartingN = (run.songs || []).filter((s) => s.status === 'charting' && s.pos).length;
    const chartBtn = el('button', 'chart-btn', chartingN ? `📈<span class="chart-badge">${chartingN}</span>` : '📈');
    chartBtn.addEventListener('click', () => { sfx.ui(); showChart(); });
    actWrap.append(chartBtn);
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
  if (PRES.hudCounters) {
    for (const c of PRES.hudCounters(run)) counters.append(el('span', c.cls || 'hud-fame', c.html));
  } else {
    if (run.encore > 0) counters.append(el('span', 'hud-encore', `🎇${run.encore > 1 ? '×' + run.encore : ''}`));
    if (run.pathProgress > 0 && run.path) counters.append(el('span', 'hud-momentum', `▲${run.pathProgress}`));
    counters.append(el('span', 'hud-fame', `★ ${run.fame}`));
    counters.append(el('span', 'hud-money' + (run.money < 0 ? ' neg' : ''), `$${run.money}`));
    if (run.path === 'hitfactory' || run.hits > 0) counters.append(el('span', 'hud-hits', `♪ ${run.hits} hit${run.hits === 1 ? '' : 's'}`));
  }
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

  const gearRow = el('div', 'gear-row');
  const chip = (cls, html, sheet) => {
    const c = el('span', cls, html);
    activatable(c, () => { sfx.ui(); showInspect(sheet); });
    gearRow.append(c);
  };
  const inst = activePack.loadoutById(run.loadout);
  chip('gear-chip inst-chip', inst.name, {
    art: inst.art, title: inst.name, lines: [
      inst.flavor,
      ...(inst.quirk ? [`<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`] : []),
      ...(inst.family ? [`Family: ${inst.family} — gear with a family requirement only works when it matches.`] : []),
    ],
  });
  // Scene Weather (M2): the era this career happens inside
  const weather = weatherById(run.weather);
  if (weather && !run.tutorial) chip('gear-chip weather-chip', `${weather.icon} ${weather.name}`, {
    emoji: weather.icon, title: `${weather.name} (scene weather)`,
    lines: [weather.flavor, `<b>This run:</b> ${weather.blurb}`,
      'Rolled once per career. Dailies and Gauntlets share theirs with everyone.'],
  });
  const contract = contractById(run.contract);
  if (contract) chip('gear-chip contract-chip-mini', `${contract.icon} ${contract.name}`, {
    emoji: contract.icon, title: `${contract.name} (contract, ×${contract.lpMult} LP)`, lines: [contract.desc],
  });
  const genre = genreById(run.genre);
  if (genre) chip('gear-chip genre-chip-mini', `${genre.icon} ${genre.name}`, {
    emoji: genre.icon, title: `${genre.name} (your sound)`, lines: [genre.flavor, `<b>Effect:</b> ${genre.blurb}`],
  });
  const venue = venueById(run.venue);
  if (venue) {
    const tier = VENUE_TIERS[run.venueLevel] || VENUE_TIERS[0];
    chip('gear-chip venue-chip-mini', `${venue.icon} ${'★'.repeat(run.venueLevel)}${'☆'.repeat(3 - run.venueLevel)}`, {
      emoji: venue.icon, title: `${venue.name} — ${tier.name}`,
      lines: [venue.flavor,
        `<b>Home crowd:</b> ${venue.tags.join('/')} shows here add +${tier.showBonus} Fame (and half that Cred). ${run.venueShows || 0} shows played.`,
        run.venueLevel < 3 ? 'Play more shows here to build it toward a local institution.' : 'This room is a local institution. It’s yours.'],
    });
  }
  for (const id of run.accessories || []) {
    const acc = itemById(id);
    if (!acc) continue;
    const active = accActive(acc);
    chip('gear-chip' + (active ? '' : ' inert'), acc.name + (active ? '' : ' 💤'), {
      art: acc.art, title: acc.name, lines: [
        acc.flavor, `<b>Effect:</b> ${acc.blurb}`,
        active ? '' : '💤 <b>Dormant:</b> this item doesn’t fit your current instrument’s family.',
      ].filter(Boolean),
    });
  }
  for (const p of run.promises || []) {
    chip('gear-chip promise-chip', `🤞 ${p.label} (${p.remaining})`, {
      emoji: '🤞', title: `Promise: ${p.label}`,
      lines: [`Play a <b>${p.tags.join(' or ')}</b> choice within <b>${p.remaining}</b> card${p.remaining === 1 ? '' : 's'} to keep it.`,
        'Kept promises pay off. Broken ones cost you.'],
    });
  }
  for (const bid of run.band || []) {
    const bm = bandmateById(bid);
    if (bm) chip('gear-chip band-chip-mini', `${bm.icon} ${bm.name}`, {
      emoji: bm.icon, title: `${bm.name} — ${bm.role}`,
      lines: [bm.flavor, `<b>In the band:</b> ${bm.quirkDesc}`],
    });
  }
  for (const id of run.hustles || []) {
    const h = hustleById(id);
    if (h) chip('gear-chip hustle-chip', `${h.icon} +$${h.moneyPerAct}/act`, {
      emoji: h.icon, title: `${h.name} (side hustle)`,
      lines: [h.blurb, `<b>Pays:</b> $${h.moneyPerAct} at every act break and at the finale.`],
    });
  }
  hud.append(gearRow);
}

function accActive(acc) {
  if (acc.compatibility?.universal) return true;
  return (acc.compatibility?.families || []).includes(activePack.loadoutById(run.loadout).family);
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
  return { ...run.stats, fame: run.fame, money: run.money };
}
