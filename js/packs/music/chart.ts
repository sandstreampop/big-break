// The music pack's Hot 10 + Songbook overlay — a bespoke pack screen the shell
// knows nothing about. It's opened from a HUD button the pack contributes
// (presenter.hudButtons) and renders itself with the shell's neutral dom
// toolkit (el/$/keyable). This is how a pack ships a rich custom screen without
// the generic UI ever naming a chart or a song.

import { el, $, keyable } from '../../ui/dom.js';
import { run } from '../../ui/context.js';
import { playerChartInfo, buildChartWithMovement } from './charts.js';
import { ensureSongs } from './songs.js';
import { EVENTS } from './data/events.js';
import { rivalById } from './data/rivals.js';
import * as save from '../../save.js';

// The act-break "This week on the Hot 10" panel: the run's songs moved while
// you weren't looking. Returns rendered rows (+ whether a crown warrants the
// confetti/win beat) for the shared act interstitial; null when the songs
// subsystem hasn't produced a chart week (so the shell renders no panel).
export function musicActBreakChart(state: any): { rows: { cls: string; html: string }[]; celebrate: boolean } | null {
  const week = state.lastChartWeek;
  if (!week || !week.moves?.length) return null;
  const rivalName = () => rivalById(state.rival)?.name || 'your rival';
  const rows: { cls: string; html: string }[] = [];
  for (const m of week.moves) {
    if (m.kind === 'crown') rows.push({ cls: 'chart-week-row crown', html: `<span class="cw-move">👑 #${m.to}</span><b>“${m.title}”</b><span class="cw-note">top 3 — that’s a HIT</span>` });
    else if (m.kind === 'debut') rows.push({ cls: 'chart-week-row debut', html: `<span class="cw-move">NEW #${m.to}</span><b>“${m.title}”</b><span class="cw-note">debuts</span>` });
    else if (m.kind === 'climb') rows.push({ cls: 'chart-week-row climb', html: `<span class="cw-move">▲ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">up from #${m.from}</span>` });
    else if (m.kind === 'slip') rows.push({ cls: 'chart-week-row slip', html: `<span class="cw-move">▼ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">was #${m.from}</span>` });
    else if (m.kind === 'hold') rows.push({ cls: 'chart-week-row hold', html: `<span class="cw-move">= #${m.to}</span><b>“${m.title}”</b><span class="cw-note">${m.weeks} wks on chart</span>` });
    else if (m.kind === 'drop') rows.push({ cls: 'chart-week-row dropoff', html: `<span class="cw-move">OFF</span><b>“${m.title}”</b><span class="cw-note">gone after ${m.weeks} wk${m.weeks === 1 ? '' : 's'}</span>` });
    else if (m.kind === 'rivalPassed') rows.push({ cls: 'chart-week-row rivalwar', html: `<span class="cw-move">⚔️ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">passes ${rivalName()} (#${m.from}). First blood.</span>` });
    else if (m.kind === 'rivalNeck') rows.push({ cls: 'chart-week-row rivalwar', html: `<span class="cw-move">⚔️ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">one slot from ${rivalName()} (#${m.from}). It knows.</span>` });
  }
  const celebrate = week.moves.some((m: any) => m.kind === 'crown');
  return { rows, celebrate };
}

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
