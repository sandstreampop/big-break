// BIG BREAK — the front-of-house menus.
//
// The title screen (attract mode, the day's tagline + news, and the menu that
// launches every mode) and the between-run screens reached from it: the Career
// Wall (spend LP), the Trophy Room, the Résumé (lifetime stats), and Settings.
// The title's launch buttons and every screen's Back go through the nav seam;
// the sub-screens are reached directly from the title (same module).

import * as save from '../save.js';
import { sfx, music, setSoundEnabled, setMusicEnabled } from '../audio.js';
import { track, setAnalyticsEnabled, analyticsEnabled, exportEvents } from '../analytics.js';
import { el, $, activatable, btn, show, openPortrait, responsivePicture, reducedMotion, hashStr, todayStr, weekStr, escapeHtml } from './dom.js';
import { activePack, PATHS, PRES, meta, run, setRun, setMeta, failLabelFor } from './context.js';
import { showHelp, showReleaseNotes } from './inspectors.js';
import { nav } from './nav.js';
import { APP_VERSION } from '../version.js';
import { RELEASE_NOTES, versionLabel, notesSkewed } from '../release-notes.js';

// Version skew (chip ⚠) is reported to telemetry once per session, not once
// per title render.
let versionSkewTracked = false;

export function renderTitle() {
  music.setMood('title');
  const s = $('#screen-title');
  s.innerHTML = '';
  s.classList.remove('title-veiled');
  const saved = save.loadRun(activePack.id);
  // A pack-rendered title stage behind the menu (presenter.titleScene — the
  // odyssey's threshold). The pack draws into its own host; if it returns
  // true it takes the veil: the screen wears .title-veiled (the pack's CSS
  // hides the menu) until the pack calls lift(). Menu structure and
  // routing below stay shell-owned; packs without the hook are untouched.
  if (PRES.titleScene) {
    const stageHost = el('div', 'title-scene');
    s.append(stageHost);
    const veiled = PRES.titleScene(stageHost, {
      resumed: !!saved,
      lift: () => s.classList.remove('title-veiled'),
    });
    if (veiled === true) s.classList.add('title-veiled');
  }
  // floating notes (attract mode)
  if (!reducedMotion()) {
    const notes = el('div', 'title-notes');
    const glyphs = PRES.title?.glyphs || ['♪', '♫', '♩', '♬'];
    for (let i = 0; i < 9; i++) {
      const n = el('span', 'title-note', glyphs[i % glyphs.length]);
      n.style.left = (5 + (i * 37) % 90) + '%';
      n.style.animationDelay = (i * 1.7) + 's';
      n.style.animationDuration = (9 + (i * 13) % 7) + 's';
      n.style.fontSize = (14 + (i * 7) % 14) + 'px';
      notes.append(n);
    }
    s.append(notes);
  }
  s.append(el('div', 'title-logo', PRES.title?.logo || ''));
  const dayNum = hashStr(todayStr());
  const taglines = PRES.title?.taglines || [];
  if (taglines.length) s.append(el('p', 'title-tag', taglines[dayNum % taglines.length]));

  const menu = el('div', 'menu');
  if (saved) {
    menu.append(btn('▶ Resume Run', 'primary', () => {
      setRun(saved);
      nav.resumeRun();
    }));
    menu.append(btn('✚ New Run (abandon current)', '', () => {
      save.clearRun();
      nav.newRun();
    }));
  } else if (!meta.tutorialDone && (meta.runs || 0) === 0 && activePack.tutorialEvents.length) {
    // First install: the game opens with a playable lesson, not a manual.
    // (Only packs that ship a tutorial deck; labels are the pack's.)
    menu.append(btn(PRES.tutorial?.offer || '▶ Play — Your First Gig', 'primary', nav.startTutorial));
    menu.append(btn(PRES.tutorial?.skip || 'Skip the gig — I know the drill', 'ghost', () => {
      track('tutorial_skip', {});
      meta.tutorialDone = true;
      save.saveMeta(meta);
      nav.newRun();
    }));
  } else {
    menu.append(btn('▶ New Run', 'primary', () => nav.newRun()));
  }
  const today = todayStr();
  const dailyDone = meta.dailyResults?.[today];
  const dailyName = PRES.daily?.name || 'Daily Grind';
  menu.append(btn(
    dailyDone
      ? `📅 ${dailyName} ✓ (${dailyDone.result ? dailyDone.result.toUpperCase() : 'DNF'} — replay?)`
      : `📅 ${dailyName} — ${today}`,
    '', () => { save.clearRun(); nav.newRun(true); }));
  // Comeback mode exists only for packs that ship the transform.
  if (meta.successPaths?.length > 0 && activePack.comeback) {
    menu.append(btn(PRES.comeback?.label || '🦅 Comeback Run (×1.2 LP)', '', () => { save.clearRun(); nav.newRun(false, true); }));
  }
  // The Gauntlet builds its weekly loadout from pack data; only packs that
  // declare the mode offer it.
  if (meta.runs > 0 && PRES.gauntlet) {
    const week = weekStr();
    const gDone = meta.gauntletResults?.[week];
    menu.append(btn(
      gDone
        ? `⚔️ The Gauntlet ✓ (${gDone.result ? gDone.result.toUpperCase() : 'DNF'} — replay?)`
        : `⚔️ The Gauntlet — ${week}`,
      '', () => { save.clearRun(); PRES.startGauntlet?.(); }));
  }
  if ((PRES.wallItems || []).length) menu.append(btn(`${PRES.wallCopy?.button || '🏆 Career Wall'} (${meta.lp} LP)`, '', nav.wall));
  // Packs with a fixed named cast (the villa's 16) offer a browsable gallery.
  if (PRES.roster) menu.append(btn('👥 Meet the Cast', '', renderRoster));
  menu.append(btn('🎖 Trophy Room', '', renderTrophies));
  if (meta.runs > 0) menu.append(btn('📊 The Résumé', '', renderResume));
  menu.append(btn('⚙ Settings', '', renderSettings));
  s.append(menu);
  // Today's flavor headline + the footer stat line are the pack's (music's
  // evergreen news pool, its runs/best/legacy line).
  const news = PRES.title?.news?.(dayNum);
  if (news) s.append(el('p', 'title-news', `📰 ${news.text} <span>— ${news.src}</span>`));
  if (PRES.title?.foot) s.append(el('p', 'title-foot', PRES.title.foot(meta)));
  // The deploy's identity, always on the front door (and visible even under
  // a pack's title veil — the chip carries data-veil-exempt, the generic
  // contract a veiling pack's CSS honors; see css/odyssey.css): the stamped
  // version + build (versionLabel — the SAME string the What's-New sheet
  // shows), tap for the release notes. This is the "am I seeing the right
  // version?" surface, so it renders unconditionally. If the changelog module
  // and the version stamp arrived from different deploys (per-module SW
  // caching), the chip itself wears the warning — the player shouldn't have
  // to open the sheet to learn the identity on screen is suspect. A native
  // <button> with its text as the accessible name: the version IS the
  // payload, so a screen reader must hear it, not a generic label.
  const skewed = notesSkewed();
  const chip = el('button', 'version-chip', escapeHtml(versionLabel()) + (skewed ? ' ⚠' : ''));
  chip.title = 'Version and release notes';
  chip.setAttribute('data-veil-exempt', '1');
  chip.addEventListener('click', () => { sfx.ui(); showReleaseNotes(); });
  if (skewed && !versionSkewTracked) {
    versionSkewTracked = true;
    track('version_skew', { app: APP_VERSION, notes: RELEASE_NOTES[0].version });
  }
  s.append(chip);
}

// ---------- Career Wall ----------

export function renderWall() {
  const s = $('#screen-wall');
  const keepScroll = s.scrollTop;
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', PRES.wallCopy?.head || 'The Career Wall'));
  s.append(el('p', 'screen-sub', PRES.wallCopy?.sub || 'Spend Legacy Points to widen the random pools.'));
  // balance rides along while you shop
  s.append(el('div', 'wall-balance', `Balance: <b>${meta.lp} LP</b>`));

  const list = el('div', 'wall-list');
  let lastTier = 0;
  // stable-sort by tier so each tier renders as one section (the authored
  // list interleaves tiers now that the wall has a second wing)
  for (const item of [...(PRES.wallItems || [])].sort((a, b) => a.tier - b.tier)) {
    if (item.tier !== lastTier) {
      lastTier = item.tier;
      list.append(el('h3', 'wall-tier', `Tier ${item.tier}`));
    }
    const owned = meta.unlockedWall.includes(item.id);
    const row = el('div', 'wall-item' + (owned ? ' owned' : ''));
    row.append(el('div', 'wall-info', `<b>${item.name}</b><br><span>${item.desc}</span>`));
    if (owned) {
      row.append(el('span', 'wall-owned', 'UNLOCKED'));
    } else {
      const canBuy = meta.lp >= item.cost;
      const b = btn(`${item.cost} LP`, canBuy ? 'primary' : 'disabled', () => {
        if (meta.lp < item.cost) return;
        meta.lp -= item.cost;
        meta.unlockedWall.push(item.id);
        save.saveMeta(meta);
        sfx.cash();
        renderWall();
      });
      if (!canBuy) b.disabled = true;
      row.append(b);
    }
    list.append(row);
  }
  s.append(list);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-wall');
  s.scrollTop = keepScroll;
}

// ---------- Trophy Room ----------

function renderTrophies() {
  const s = $('#screen-trophies');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Trophy Room'));
  const allTrophies = PRES.trophies || [];
  s.append(el('p', 'screen-sub', `${meta.trophies.length}/${allTrophies.length} collected. Each one cost you something.`));

  const owned = new Set(meta.trophies);
  const pct = allTrophies.length ? Math.round((100 * meta.trophies.length) / allTrophies.length) : 0;
  const meter = el('div', 'trophy-meter');
  const fill = el('div', 'trophy-meter-fill');
  fill.style.width = pct + '%';
  meter.append(fill);
  s.append(meter);

  const CATS = [['endings', 'Ways It Ends'], ['feats', 'Feats'], ['career', 'The Long Game']];
  for (const [cat, label] of CATS) {
    const group = allTrophies.filter((t) => (t.cat || 'feats') === cat);
    if (!group.length) continue;
    s.append(el('h3', 'wall-tier', label));
    const grid = el('div', 'trophy-grid');
    for (const t of group) {
      const has = owned.has(t.id);
      const cell = el('div', 'trophy' + (has ? ' owned' : ''));
      if (has) {
        cell.append(el('div', 'trophy-icon', t.icon));
        cell.append(el('div', 'trophy-name', t.name));
        cell.append(el('div', 'trophy-desc', t.desc));
      } else if (t.secret) {
        cell.append(el('div', 'trophy-icon', '❓'));
        cell.append(el('div', 'trophy-name', '???'));
        cell.append(el('div', 'trophy-desc', 'Some trophies announce themselves only once.'));
      } else {
        cell.append(el('div', 'trophy-icon locked-icon', t.icon));
        cell.append(el('div', 'trophy-name', t.name));
        cell.append(el('div', 'trophy-desc', t.desc));
      }
      grid.append(cell);
    }
    s.append(grid);
  }

  if (meta.runHistory?.length) {
    s.append(el('h3', 'wall-tier', 'Past Lives'));
    const hist = el('div', 'history-list');
    for (const h of meta.runHistory) {
      const inst = activePack.loadoutById(h.loadout ?? h.instrument); // h.instrument: pre-rename saves
      const res = h.result ? h.result.toUpperCase()
        : failLabelFor(h.endingKey) || 'DNF';
      const pathName = h.path ? PATHS[h.path].name : '—';
      const stat = PRES.historyStat?.(h) || '';
      hist.append(el('div', 'history-row res-' + (h.result || 'fail'),
        `<span>${h.daily ? '📅 ' : ''}${inst ? inst.name : '?'} → ${pathName}</span>` +
        `<b>${res}</b><span class="hist-stat">${stat}</span>`));
    }
    s.append(hist);
  }
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-trophies');
}

// ---------- Meet the Cast (the roster gallery) ----------
// A browsable gallery of a pack's fixed cast (the villa's 16). Genre-neutral:
// the shell renders grouped face cards from PRES.roster and taps each through
// to the full-size lightbox; the pack owns who's in it and how they read. Only
// shown for packs that declare a roster (music has none).

function renderRoster() {
  const data = PRES.roster?.(meta);
  const s = $('#screen-roster');
  s.innerHTML = '';
  if (!data) { nav.title(); show('#screen-title', 'back'); return; }
  s.append(el('h2', 'screen-head', data.title));
  if (data.sub) s.append(el('p', 'screen-sub', data.sub));
  for (const group of data.groups) {
    if (!group.members.length) continue;
    s.append(el('h3', 'wall-tier', group.label));
    const grid = el('div', 'roster-grid');
    for (const m of group.members) {
      const cell = el('div', 'roster-cell' + (m.cls ? ' ' + m.cls : ''));
      const face = el('div', 'roster-face',
        m.portraitSrc
          ? responsivePicture(m.portraitSrc, { className: 'face-portrait', sizes: '84px' })
          : (m.face || ''));
      cell.append(face);
      cell.append(el('div', 'roster-name', m.name));
      if (m.sub) cell.append(el('div', 'roster-shape', m.sub));
      if (m.note) cell.append(el('div', 'roster-note', m.note));
      // Tap the whole card to enlarge; emoji-only faces still open a caption.
      if (m.portraitSrc) {
        cell.classList.add('roster-cell-tappable');
        activatable(cell, () => { sfx.ui(); openPortrait(m.portraitSrc, { name: m.name, sub: m.sub, note: m.note }); }, `Enlarge ${m.name}`);
      }
      grid.append(cell);
    }
    s.append(grid);
  }
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-roster');
}

// ---------- The Résumé (lifetime stats, Pass 25) ----------

function renderResume() {
  const s = $('#screen-settings'); // reuse a spare screen container
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Résumé'));
  s.append(el('p', 'screen-sub', 'References available upon request.'));

  // The lifetime-stat rows are the pack's (presenter.resume) — the shell knows
  // the label/value/section layout, never the meters. A pack without the hook
  // gets this minimal neutral record.
  const rows = PRES.resume?.(meta) || [
    { label: 'Careers attempted', value: String(meta.runs) },
    { label: 'Decisions swiped', value: String(meta.lifetime?.swipes || 0) },
    { label: 'Incredibles rolled', value: String(meta.lifetime?.incredibles || 0) },
    { label: 'Legacy earned', value: `${meta.lpEarnedTotal} LP` },
  ];
  const list = el('div', 'wall-list');
  for (const r of rows) {
    if (r.head) { list.append(el('h3', 'wall-tier', r.label)); continue; }
    const item = el('div', 'wall-item');
    item.append(el('div', 'wall-info', `<b>${r.label}</b>`));
    item.append(el('span', 'resume-val', r.value));
    list.append(item);
  }
  s.append(list);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-settings');
}

// ---------- Settings ----------

function renderSettings() {
  const s = $('#screen-settings');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Settings'));
  const menu = el('div', 'menu');

  // A row with a real switch (knob for booleans, labeled pill for tri-state)
  const toggleRow = (label, value, onTap, pillText?) => {
    const row = el('button', 'setting-row');
    const sw = pillText !== undefined
      ? `<span class="switch-pill${value ? ' on' : ''}">${pillText}</span>`
      : `<span class="switch${value ? ' on' : ''}"></span>`;
    row.innerHTML = `<span>${label}</span>${sw}`;
    activatable(row, () => { onTap(); save.saveMeta(meta); renderSettings(); });
    menu.append(row);
  };

  menu.append(el('h3', 'contract-head', 'Sound & feel'));
  toggleRow('Sound effects', meta.settings.sound, () => {
    meta.settings.sound = !meta.settings.sound;
    setSoundEnabled(meta.settings.sound);
  });
  toggleRow('Music', meta.settings.music !== false, () => {
    meta.settings.music = meta.settings.music === false;
    setMusicEnabled(meta.settings.music);
  });
  toggleRow('Haptics', meta.settings.haptics !== false, () => {
    meta.settings.haptics = meta.settings.haptics === false;
  });
  toggleRow('Reduced motion', meta.settings.reducedMotion !== false && meta.settings.reducedMotion !== null, () => {
    meta.settings.reducedMotion =
      meta.settings.reducedMotion === null ? true
        : meta.settings.reducedMotion === true ? false : null;
  }, meta.settings.reducedMotion === null ? 'SYSTEM' : meta.settings.reducedMotion ? 'ON' : 'OFF');
  toggleRow('Large text', !!meta.settings.bigText, () => {
    meta.settings.bigText = !meta.settings.bigText;
    document.body.classList.toggle('big-text', meta.settings.bigText);
  });
  // Minigame toggles only for packs that ship on-swipe performance beats.
  if (PRES.minigameSettings) {
    toggleRow('Minigames', meta.settings.minigames !== false, () => {
      meta.settings.minigames = meta.settings.minigames === false;
    });
    toggleRow('Relaxed minigames', meta.settings.relaxedMinigames === true, () => {
      meta.settings.relaxedMinigames = meta.settings.relaxedMinigames !== true;
    });
  }
  toggleRow('Anonymous analytics', analyticsEnabled(), () => {
    meta.settings.analytics = !analyticsEnabled();
    setAnalyticsEnabled(meta.settings.analytics);
  });

  menu.append(el('h3', 'contract-head', 'Career data'));
  menu.append(btn('❓ How to play', '', showHelp));
  menu.append(btn(`📋 What’s new (v${escapeHtml(APP_VERSION)})`, '', showReleaseNotes));
  if (activePack.tutorialEvents.length) menu.append(btn(PRES.tutorial?.replay || '🎓 Replay the first gig', '', () => { save.clearRun(); nav.startTutorial(); }));
  const exportBtn = btn('📤 Export save (backup code)', '', async () => {
    const code = save.exportSave();
    try {
      if (navigator.share) await navigator.share({ text: code });
      else {
        await navigator.clipboard.writeText(code);
        exportBtn.textContent = '📋 Copied! Paste it somewhere safe.';
      }
    } catch (e) {
      prompt('Copy your save code:', code);
    }
  });
  menu.append(exportBtn);
  const diagBtn = btn('🔬 Send session data (for playtests)', '', async () => {
    const blob = exportEvents();
    try {
      if (navigator.share) await navigator.share({ text: blob });
      else { await navigator.clipboard.writeText(blob); diagBtn.textContent = '📋 Copied — paste it to the dev.'; }
    } catch (e) { prompt('Copy your session data:', blob); }
  });
  menu.append(diagBtn);
  menu.append(btn('📥 Import save (paste code)', '', () => {
    const code = prompt('Paste your BIG BREAK save code (starts with BB1.):');
    if (!code) return;
    if (save.importSave(code)) {
      alert('Career restored. Welcome back.');
      location.reload();
    } else {
      alert('That code didn’t scan. The bouncer shrugs.');
    }
  }));
  menu.append(btn('⚠ Reset all progress', 'danger', () => {
    if (confirm('Wipe every unlock, trophy, and Legacy Point? The industry forgets fast.')) {
      save.resetAll();
      setMeta(save.loadMeta());
      nav.title();
      show('#screen-title');
      return;
    }
  }));
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  if (PRES.aboutLine) s.append(el('p', 'title-foot', PRES.aboutLine));
  show('#screen-settings');
}
