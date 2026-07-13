// BIG BREAK — inspector overlays.
//
// The tap-to-inspect surfaces: a generic detail sheet (showInspect), the stat
// inspector, the status drawer (ADR-0009 Tier 3 — the full picture the compact
// HUD stopped force-feeding), and the how-to-play help. All are genre-neutral:
// they render from the manifest + run state + presenter copy, never a genre's
// data. (A pack's bespoke screens — music's Hot 10 — live in the pack.) None
// route the game forward, so they sit safely below the flow.

import { openOverlay, openPortrait, el, activatable, escapeHtml, responsivePicture } from './dom.js';
import { activePack, run, STAT_META, PRES, metaFor, itemById, genderLabelFor } from './context.js';
import { sfx } from '../audio.js';
import { artFor } from '../art.js';
import { RELEASE_NOTES, versionLabel, notesSkewed } from '../release-notes.js';

// The tableau's inspect panel (world-is-HUD): the numeric truth behind a
// pack's diegetic strip, stated plainly in hard-ruled blocks at a size where
// the type is legible. Generic mechanism — the pack supplies the blocks.
export function showInspectPanel(blocks: { title: string; lines: string[] }[]) {
  openOverlay((ov) => {
    const box = el('div', 'result-card inspect-panel');
    box.append(el('div', 'tier-badge', 'INSPECT'));
    for (const b of blocks) {
      box.append(el('p', 'result-text inspect-panel-title', `<b>${b.title}</b>`));
      for (const line of b.lines) box.append(el('p', 'gear-blurb', line));
    }
    box.append(el('p', 'tap-hint', 'tap to close'));
    ov.append(box);
  });
}

export function showInspect(sheet) {
  openOverlay((ov) => {
    const box = el('div', 'result-card');
    box.append(el('div', 'tier-badge', 'INSPECT'));
    if (sheet.art) box.append(artFor(sheet.art, 'inspect-art'));
    // A character sheet leads with their face. When a real portrait is wired
    // (a pack's cast) it renders as the profile pic and taps through to the
    // full-size lightbox; otherwise the emoji glyph carries it. The mood emoji
    // rides on top as a badge either way. Generic: the shell only knows the
    // shape {portraitSrc?, face?, moodFace?}; the pack fills it.
    if (sheet.portraitSrc || sheet.face) {
      const badge = sheet.moodFace ? `<span class="stage-moodface">${sheet.moodFace}</span>` : '';
      const face = el('div', 'inspect-face' + (sheet.faceCls ? ' ' + sheet.faceCls : ''),
        (sheet.portraitSrc
          ? responsivePicture(sheet.portraitSrc, { className: 'face-portrait', sizes: '88px', eager: true })
          : (sheet.face || '')) + badge);
      if (sheet.portraitSrc) {
        face.classList.add('inspect-face-tappable');
        activatable(face, (e) => {
          e.stopPropagation();
          sfx.ui();
          openPortrait(sheet.portraitSrc, { name: sheet.name || sheet.title, sub: sheet.faceSub, note: sheet.faceNote });
        }, `Enlarge ${sheet.name || sheet.title || 'portrait'}`);
      }
      box.append(face);
    }
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

  // Who you are (name → gender → personality), the same order you set it in.
  // Neutral: the name is universal, the gender label resolves through the pack's
  // own axis, and the persona is the loadout.
  if (run.name || run.gender) {
    const gl = genderLabelFor(run.gender);
    box.append(el('p', 'drawer-identity', `👤 <b>${run.name ? escapeHtml(run.name) : 'You'}</b>${gl ? ` · ${gl}` : ''}`));
  }
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
    lines: [PRES.statInfo?.[key]].filter(Boolean),
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
  // flavor) — presenter.helpBlocks. The intro above is the universal swipe
  // mechanic, so it stays in the shell.
  for (const b of PRES.helpBlocks || []) box.append(el('p', 'help-block', b));
  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  });
}

// ---------- What's New (the release-notes sheet) ----------
// The answer to "am I looking at the right deploy?": the running build's
// stamped identity (js/version.ts, written by tools/build.mjs) up top, then
// the changelog (js/release-notes.ts), newest first. If the stamped version
// and the top note disagree, the client is running mixed module versions
// (the SW caches modules individually) — say so instead of leaving the
// player to wonder, and a refresh reconciles it.
export function showReleaseNotes() {
  openOverlay((ov) => {
    const box = el('div', 'result-card help-sheet release-notes');
    box.append(el('div', 'tier-badge', 'WHAT’S NEW'));
    // The exact string the title chip shows (versionLabel) — one assembly,
    // two surfaces, zero chance of them disagreeing about the identity.
    box.append(el('p', 'release-current', `You are playing <b>${escapeHtml(versionLabel())}</b>`));
    if (notesSkewed()) {
      box.append(el('p', 'release-skew',
        '⚠ These notes came from a different version than the running build — an update is mid-delivery. Refresh to finish it.'));
    }
    for (const r of RELEASE_NOTES) {
      box.append(el('h3', 'release-head', `v${escapeHtml(r.version)} <span class="release-date">— ${escapeHtml(r.date)}</span>`));
      box.append(el('p', 'release-title', escapeHtml(r.title)));
      const ul = el('ul', 'release-list');
      for (const n of r.notes) ul.append(el('li', '', escapeHtml(n)));
      box.append(ul);
    }
    box.append(el('p', 'tap-hint', 'tap to close'));
    ov.append(box);
  });
}

