// BIG BREAK — inspector overlays.
//
// The tap-to-inspect surfaces: a generic detail sheet (showInspect), the stat
// inspector, the status drawer (ADR-0009 Tier 3 — the full picture the compact
// HUD stopped force-feeding), the how-to-play help, and the Hot 10 chart +
// songbook. All are self-contained overlays the HUD and card screens open;
// none of them route the game forward, so they sit safely below the flow.

import { openOverlay, el, activatable, keyable, $ } from './dom.js';
import { activePack, run, STAT_META, PRES, metaFor, itemById } from './context.js';
import { sfx } from '../audio.js';
import { artFor } from '../art.js';
import { playerChartInfo, buildChartWithMovement } from '../charts.js';
import { ensureSongs } from '../songs.js';
import { EVENTS } from '../data/events.js';
import * as save from '../save.js';

const STAT_INFO = {
  skill: 'Raw musicianship. Feeds the <b>Studio Legend</b> gate and steadies live/studio choices.',
  cred: 'Industry respect — the floor under every path. Hits 0 in Act 2+ and you’re cancelled.',
  creativity: 'Original ideas. Feeds the <b>Hit Factory</b> gate and weird/indie choices.',
  network: 'Who owes you a favor. Feeds the <b>Megastar</b> gate and every deal.',
  burnout: 'The danger stat. Every point drags all rolls down; at 100 you quit music for a fintech. Rest cards and coping moments push it back.',
};

export function showInspect(sheet) {
  openOverlay((ov) => {
    const box = el('div', 'result-card');
    box.append(el('div', 'tier-badge', 'INSPECT'));
    if (sheet.art) box.append(artFor(sheet.art, 'inspect-art'));
    box.append(el('p', 'result-text', `${sheet.emoji ? sheet.emoji + ' ' : ''}<b>${sheet.title}</b>`));
    for (const line of sheet.lines || []) box.append(el('p', 'gear-blurb', line));
    box.append(el('p', 'tap-hint', 'tap to close'));
    ov.append(box);
  });
}

// The status drawer (ADR-0009 Tier 3): the full picture the compact HUD
// stopped force-feeding — stats with bars, resources, persona, equipped
// items. Generic: rendered entirely from manifest + run state; tapping a
// stat row opens its inspector.
export function showStatusDrawer() {
  openOverlay((ov) => {
  const box = el('div', 'result-card drawer-sheet');
  box.append(el('div', 'tier-badge', 'THE FULL PICTURE'));

  const inst = activePack.loadoutById(run.loadout);
  if (inst) {
    box.append(el('p', 'drawer-persona', `<b>${inst.name}</b>${inst.quirk ? ` — <b>${inst.quirk.name}:</b> ${inst.quirk.desc}` : ''}`));
  }

  const list = el('div', 'drawer-stats');
  for (const key of [...activePack.manifest.stats, 'burnout']) {
    const v = run.stats[key];
    const row = el('div', 'drawer-stat' + (key === 'burnout' && v >= 70 ? ' danger' : key === 'burnout' && v >= 45 ? ' warn' : ''));
    row.append(el('span', 'drawer-stat-name', `${STAT_META[key].icon} ${STAT_META[key].name}`));
    const bar = el('div', 'stat-bar');
    bar.append(el('div', 'stat-fill', ''));
    (bar.querySelector('.stat-fill') as HTMLElement).style.width = `${v}%`;
    row.append(bar);
    row.append(el('span', 'drawer-stat-val', String(v)));
    activatable(row, (e) => { e.stopPropagation(); sfx.ui(); showInspectStat(key); });
    list.append(row);
  }
  box.append(list);

  const resRow = el('div', 'drawer-resources');
  for (const key of activePack.manifest.resources) {
    const m = metaFor(key);
    resRow.append(el('span', 'chip chip-good', `${m.icon} ${run[key] ?? 0} ${m.name}`));
  }
  box.append(resRow);

  if ((run.accessories || []).length) {
    const gear = el('div', 'result-notices');
    for (const id of run.accessories) {
      const acc = itemById(id);
      if (acc) gear.append(el('div', 'notice notice-gear', `<b>${acc.name}</b> — ${acc.blurb}`));
    }
    box.append(gear);
  }

  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  });
}

export function showInspectStat(key) {
  showInspect({
    emoji: STAT_META[key].icon,
    title: `${STAT_META[key].name}: ${run.stats[key]}`,
    lines: [(PRES.statInfo || STAT_INFO)[key]].filter(Boolean),
  });
}

// ---------- Help sheet + first-run coach marks (Pass 12) ----------

export function showHelp() {
  openOverlay((ov) => {
  const box = el('div', 'result-card help-sheet');
  box.append(el('div', 'tier-badge', 'HOW THIS WORKS'));
  box.append(el('p', 'help-block',
    '<b>Swipe</b> left or right (or tap the buttons). Every choice rolls against your stats — the stats named by the choice tilt the odds.'));
  box.append(el('p', 'help-block',
    'Outcomes come in three tiers: <b style="color:var(--bad)">BAD</b>, <b style="color:var(--good)">GOOD</b>, and <b style="color:var(--hot)">INCREDIBLE</b>.'));
  const legend = el('div', 'help-legend');
  legend.innerHTML = `
    <div><span class="risk risk-low">●</span> safe bet</div>
    <div><span class="risk risk-mid">▲</span> could go either way</div>
    <div><span class="risk risk-high">■</span> likely to go badly</div>
    <div><span class="risk risk-hot">✦</span> big upside in reach</div>`;
  box.append(el('p', 'help-block',
    'The small stat icons on each button show <b>what the choice rolls against</b> — bright is the main stat, faded is secondary. Build the stats your path needs, then pick fights you can win.'));
  box.append(el('p', 'help-block', 'The dot next to each choice is your <b>risk tell</b>:'));
  box.append(legend);
  // The subsystem cheat-sheet is the pack's (its meters, its banked-bonus
  // flavor); the music trio is the default.
  const helpBlocks = PRES.helpBlocks || [
    '🔥 <b>Burnout</b> is the danger stat: it drags every roll down and ends your career at 100. Rest is a real decision.',
    '🎇 Rolling an INCREDIBLE banks an <b>Encore</b> — arm it later to boost the swipe that matters.',
    '▲ <b>Momentum</b> from big wins can push a near-miss finale over the line. ★ Fame and $ money are score and fuel, not stats.',
  ];
  for (const b of helpBlocks) box.append(el('p', 'help-block', b));
  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  });
}

// ---------- The Hot 10 chart overlay (Pass 6) ----------

export function showChart() {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  const box = el('div', 'result-card chart-card');
  box.append(el('div', 'tier-badge', 'THE BIG BREAK HOT 10'));
  const info = playerChartInfo(run);
  box.append(el('p', 'chart-sub', info.entries
    ? `You have ${info.entries} song${info.entries > 1 ? 's' : ''} charting. Peak: #${info.peak}.`
    : 'You are not on it. The chart does not know you exist. Yet.'));
  const { rows, dethroned } = buildChartWithMovement(run);
  if (dethroned) box.append(el('p', 'chart-sub', `📉 ${dethroned} lost the top spot this act. The group chats are merciless.`));
  const list = el('div', 'chart-list');
  for (const row of rows) {
    const r = el('div', 'chart-row' + (row.you ? ' you' : '') + (row.rival ? ' rival' : ''));
    const moveHtml = row.isNew
      ? '<span class="chart-move new">NEW</span>'
      : row.move > 0 ? `<span class="chart-move up">▲${row.move}</span>`
      : row.move < 0 ? `<span class="chart-move down">▼${-row.move}</span>`
      : '<span class="chart-move flat">—</span>';
    r.append(el('span', 'chart-pos', `${row.pos}`));
    r.append(el('span', 'chart-song', `<b>${row.song}</b><br><span>${row.artist}</span>`));
    r.append(el('span', 'chart-weeks', `${moveHtml} ${row.weeks}w`));
    list.append(r);
  }
  box.append(list);

  // The Songbook: every song you've written, in whatever state it's in
  const songs = (ensureSongs(run) || []).slice().reverse();
  if (songs.length) {
    box.append(el('div', 'trades-head songbook-head', '♪ YOUR SONGBOOK'));
    const book = el('div', 'songbook');
    for (const s of songs) {
      const row = el('div', 'songbook-row sb-' + s.status + (s.crowned ? ' sb-crowned' : ''));
      let state;
      if (s.crowned) state = `👑 HIT — peaked #${s.peak}`;
      else if (s.status === 'charting' && s.pos) state = `charting #${s.pos} · wk ${s.weeks}${s.peak && s.peak < s.pos ? ` · peak #${s.peak}` : ''}`;
      else if (s.status === 'charting') state = 'shipped — off the chart';
      else if (s.status === 'faded') state = s.peak ? `faded — peaked #${s.peak}, ${s.weeks} wk${s.weeks === 1 ? '' : 's'}` : 'faded — never charted';
      else state = s.quality >= 68 ? 'demo — might be undeniable' : s.quality >= 52 ? 'demo — something’s there' : s.quality >= 38 ? 'demo — rough but honest' : 'demo — it exists';
      row.innerHTML = `<b>“${s.title}”</b><span class="sb-state">${state}</span>`;
      // tap a song to unfold its biography
      keyable(row, s.title);
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = row.nextElementSibling?.classList?.contains('sb-detail');
        book.querySelectorAll('.sb-detail').forEach((d) => d.remove());
        if (open) return;
        const origin = s.origin ? EVENTS.find((ev) => ev.id === s.origin) : null;
        const bits = [];
        bits.push(`written in act ${s.act}${origin?.context ? ` — ${origin.context.replace(/\{\w+\}/g, '…')}` : ''}`);
        bits.push(`quality ${s.quality} · hype ${s.hype}`);
        if (s.peak) bits.push(`chart life: debuted, peaked #${s.peak}, ${s.weeks} week${s.weeks === 1 ? '' : 's'}${s.crowned ? ' — certified HIT 👑' : ''}`);
        else if (s.status === 'demo') bits.push('still in the vault — a release card ships it');
        else bits.push('shipped, never charted — the sync desk may still call');
        const d = el('div', 'sb-detail', bits.join('<br>'));
        row.after(d);
      });
      book.append(row);
    }
    box.append(book);
    const demos = songs.filter((s) => s.status === 'demo').length;
    if (demos) box.append(el('p', 'chart-sub sb-hint', `${demos} demo${demos > 1 ? 's' : ''} in the vault — release cards decide when they ship.`));
  }

  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  const done = () => {
    ov.classList.remove('active');
    ov.removeEventListener('click', done);
  };
  ov.removeAttribute('data-armed');
  setTimeout(() => { ov.addEventListener('click', done); ov.setAttribute('data-armed', '1'); }, 200);
  save.saveRun(run); // chartTitles may have been generated
}
