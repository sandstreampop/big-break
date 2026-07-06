// BIG BREAK — UI: screens, card swipe physics, result presentation.

import { CONFIG } from './config.js';
import { INSTRUMENTS } from './data/instruments.js';
import { rivalById } from './data/rivals.js';
import { accessoryById } from './data/accessories.js';
import { equipAccessory } from './packs/plugins/gear.js';
import { signContract } from './packs/plugins/contract.js';
import { ensureSongs, releaseSong, flagshipSong } from './songs.js';
import { EVENTS } from './data/events.js';
import * as engine from './engine.js';
import { musicPack } from './packs/music.js';
import * as save from './save.js';
import { artFor, sceneFor, registerArt } from './art.js';
import { buildChart, buildChartWithMovement, playerChartInfo, collabArtistFor } from './charts.js';
import { CONTRACTS, contractById } from './data/contracts.js';
import { hustleById } from './data/hustles.js';
import { offerGenres, genreById } from './data/genres.js';
import { weatherById } from './data/weather.js';
import { offerVenues, venueById, VENUE_TIERS } from './data/venues.js';
import { bandmateById } from './data/band.js';
import { renderShareImage } from './sharecard.js';
import { buildDefaultShareText, SHARE_TIER_EMOJI, DEFAULT_FAIL_LABELS } from './share-text.js';
import { sfx, music, ambient, setSoundEnabled, setMusicEnabled, initAudio } from './audio.js';
import { initAnalytics, track, setAnalyticsEnabled, analyticsEnabled, exportEvents } from './analytics.js';
import { playMinigame, minigameById } from './minigames.js';
import {
  activePack, PATHS, STAT_META, RESOURCE_META, PRES, meta, run,
  selectPack, setRun, setMeta, metaFor, fillText, itemById, vibeFor, failLabelFor,
} from './ui/context.js';
import {
  $, el, activatable, keyable, btn, reducedMotion, vibrate, show, openOverlay,
  spawnConfetti, coachMark, todayStr, weekStr, hashStr, healStaleStylesheets,
} from './ui/dom.js';
import { pathFit, gateReadout } from './ui/gates.js';
import { feedTeaser } from './ui/feeds.js';
import { renderHud, spawnStatFloaters } from './ui/hud.js';
import { showInspect, showHelp } from './ui/inspectors.js';
import { nav, routeAdvance, type Nav } from './ui/nav.js';
import { dealCard, commitSwipe } from './ui/card.js';
import { renderCrossroads, actInterstitial, showBrammies, renderFinalSet } from './ui/progression.js';
import { renderFinale, renderGameOver } from './ui/endings.js';
import { startNewRun, startTutorial, startGauntlet, resumeRun, renderTutorialEnd } from './ui/newrun.js';

// The composition root: bind every screen renderer into the navigation seam.
// This is the ONE place the concrete screens are named — the `: Nav` annotation
// makes a missing or misnamed transition a compile error. Every other module
// calls through `nav`, never each other.
const wiring: Nav = {
  dealCard,
  crossroads: renderCrossroads,
  actInterstitial,
  brammies: showBrammies,
  finalSet: renderFinalSet,
  finale: renderFinale,
  gameOver: renderGameOver,
  tutorialEnd: renderTutorialEnd,
  newRun: startNewRun,
  startTutorial,
  startGauntlet,
  resumeRun,
  title: renderTitle,
  wall: renderWall,
};

export function boot(pack = musicPack) {
  Object.assign(nav, wiring);
  // Guard the CSS↔JS pairing before anything renders; re-check once the DOM
  // (and any still-streaming stylesheet) has settled.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', healStaleStylesheets, { once: true });
  } else {
    healStaleStylesheets();
  }
  // Select this session's game. Music keeps the original save keys (existing
  // players' careers survive); other packs get their own namespace so the two
  // games never clobber each other's meta or in-progress run.
  selectPack(pack);
  registerArt(PRES.art); // a pack's own art slots join the scene painter
  save.setSaveNamespace(pack.id === 'music' ? '' : pack.id);
  setMeta(save.loadMeta());
  engine.useContentPack(pack); // this game's content; set before any engine call
  initAnalytics(meta.settings, pack.id);
  // Protect the run: an unresolvable gate key (a content typo) falls back to 0
  // in the engine rather than crashing; the shell routes the anomaly to
  // telemetry so it's caught, and warns in the console for dev visibility.
  engine.setGateAnomalyReporter((key) => {
    track('gate_anomaly', { key });
    try { console.error(`[gate] unresolved key '${key}' — read as 0 (content typo?)`); } catch { /* noop */ }
  });
  setSoundEnabled(meta.settings.sound);
  setMusicEnabled(meta.settings.music !== false);
  music.setMood('title');
  document.body.classList.toggle('big-text', !!meta.settings.bigText);
  document.addEventListener('pointerdown', initAudio, { once: true });
  // Keyboard support: arrow keys swipe, when a card is up and no overlay
  document.addEventListener('keydown', (e) => {
    if (!$('#screen-game').classList.contains('active')) return;
    if ($('#overlay').classList.contains('active')) return;
    if (e.key === 'ArrowLeft') commitSwipe('left');
    else if (e.key === 'ArrowRight') commitSwipe('right');
  });
  nav.title();
  show('#screen-title');
  installBackGuard();
  installPersistOnHide();
}

// X5/R7: iOS aggressively freezes and often COLD-RELOADS a backgrounded tab or
// standalone app (in-memory state lost). The run is already saved on every swipe,
// but a minigame in progress or an armed encore between saves could be lost — so
// flush the run and meta the instant we lose visibility (visibilitychange:hidden
// is the reliable mobile signal; pagehide is the belt-and-suspenders for older
// WebKit that doesn't always fire it). Writes are try/catch-wrapped in save.js.
function installPersistOnHide() {
  const flush = () => {
    try {
      if (run && run.phase !== 'ended') save.saveRun(run);
      save.saveMeta(meta);
    } catch (e) { /* storage unavailable — nothing more we can do */ }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}

// Android Back / gesture guard. iOS has no Back button, so navigation was pure
// screen-swapping with no history integration — meaning on Android the hardware
// Back button unloads the whole PWA mid-run (rage-quit / lost screen). We keep a
// single "trap" history entry so Back never unloads the game: it dismisses an
// open overlay exactly as a tap would (running that overlay's continue handler),
// or returns to the title from any in-game screen (the run is saved on every
// swipe, so nothing is lost). On the title with nothing left to trap, Back is
// allowed to proceed so the user can still leave.
function installBackGuard() {
  try { history.pushState({ bb: 1 }, ''); } catch (e) { /* history unavailable */ }
  window.addEventListener('popstate', () => {
    const ov = $('#overlay');
    if (ov && ov.classList.contains('active')) {
      try { history.pushState({ bb: 1 }, ''); } catch (e) {}
      ov.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return;
    }
    if (!$('#screen-title').classList.contains('active')) {
      try { history.pushState({ bb: 1 }, ''); } catch (e) {}
      show('#screen-title');
      nav.title();
      sfx.ui();
      return;
    }
    // On the title with no trap left — let Back exit the app.
  });
}

const TAGLINES = [
  'Swipe your way from a damp garage to the top of the music industry — before the industry breaks you first.',
  'The kingdom is your career. The courtiers are A&R reps, algorithms, and your own burnout.',
  'Exposure is not legal tender. Swipe accordingly.',
  'Somewhere between the open mic and the stadium, there is a man named Curtis.',
  'Every swipe is a career decision. Most careers are twelve bad ones in a row.',
  'The nachos are load-bearing. The dream is real. The pay is exposure.',
  'Craig has the corner. Todd has the shifts. You have four chords and a feeling.',
];

function renderTitle() {
  music.setMood('title');
  const s = $('#screen-title');
  s.innerHTML = '';
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
  s.append(el('div', 'title-logo', PRES.title?.logo || 'BIG<br>BREAK'));
  const dayNum = hashStr(todayStr());
  const taglines = PRES.title?.taglines || TAGLINES;
  s.append(el('p', 'title-tag', taglines[dayNum % taglines.length]));

  const saved = save.loadRun();
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
      '', () => { save.clearRun(); nav.startGauntlet(); }));
  }
  if ((PRES.wallItems || []).length) menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', nav.wall));
  menu.append(btn('🎖 Trophy Room', '', renderTrophies));
  if (meta.runs > 0) menu.append(btn('📊 The Résumé', '', renderResume));
  menu.append(btn('⚙ Settings', '', renderSettings));
  s.append(menu);
  // Today's flavor headline: pack-provided title news, else the evergreen
  // generator pool exercised with the music-shaped fake state (music default).
  const fakeState = {
    flavorSeed: dayNum, act: 1, cardLog: [], fame: 0, money: 50, hits: 0,
    stats: { burnout: 0, cred: 50, skill: 0 }, rival: 'vanta', loadout: 'kazoo',
    hustles: [], rivalry: 3,
  };
  const news = PRES.title?.news
    ? PRES.title.news(dayNum)
    : (PRES.headlines?.(fakeState as any, 1) || [])[0];
  if (news) s.append(el('p', 'title-news', `📰 ${news.text} <span>— ${news.src}</span>`));
  s.append(el('p', 'title-foot', PRES.title?.foot
    ? PRES.title.foot(meta)
    : `Runs: ${meta.runs} · Best fame: ${meta.best.fame} · Legacy: ${meta.lpEarnedTotal} LP`));
}

// ---------- Career Wall ----------

function renderWall() {
  const s = $('#screen-wall');
  const keepScroll = s.scrollTop;
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Career Wall'));
  s.append(el('p', 'screen-sub', 'Spend Legacy Points to widen the random pools.'));
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
      const inst = activePack.loadoutById(h.instrument);
      const res = h.result ? h.result.toUpperCase()
        : failLabelFor(h.endingKey) || 'DNF';
      const pathName = h.path ? PATHS[h.path].name : '—';
      hist.append(el('div', 'history-row res-' + (h.result || 'fail'),
        `<span>${h.daily ? '📅 ' : ''}${inst ? inst.name : '?'} → ${pathName}</span>` +
        `<b>${res}</b><span class="hist-fame">★${h.fame}</span>`));
    }
    s.append(hist);
  }
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-trophies');
}

// ---------- The Résumé (lifetime stats, Pass 25) ----------

function renderResume() {
  const s = $('#screen-settings'); // reuse a spare screen container
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Résumé'));
  s.append(el('p', 'screen-sub', 'References available upon request. The references are Todd and Curtis.'));
  const lt = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byInstrument: {}, byPath: {}, hits: 0, moneyBest: 0 };

  const list = el('div', 'wall-list');
  const row = (label, value) => {
    const r = el('div', 'wall-item');
    r.append(el('div', 'wall-info', `<b>${label}</b>`));
    r.append(el('span', 'resume-val', String(value)));
    list.append(r);
  };
  row('Careers attempted', meta.runs);
  row('Decisions swiped', lt.swipes);
  row('Incredibles rolled', lt.incredibles);
  row('Faceplants survived', lt.bads);
  row('Hits written', lt.hits);
  row('Best bank balance', `$${lt.moneyBest}`);
  row('Best fame', `★${meta.best.fame}`);
  row('Legacy earned', `${meta.lpEarnedTotal} LP`);
  row('Dailies played', Object.keys(meta.dailyResults || {}).length);
  const mgPlays = Object.values(meta.minigamesPlayed || {}).reduce((a: any, b: any) => a + b, 0);
  if (mgPlays) row('Performances played', `${mgPlays} (${Object.keys(meta.minigamesPlayed).length} kinds)`);
  if (meta.mgGolden) row('GOLDEN moments', meta.mgGolden);

  list.append(el('h3', 'wall-tier', 'By path'));
  for (const [pid, p] of Object.entries<any>(lt.byPath)) {
    row(`${PATHS[pid]?.icon || ''} ${PATHS[pid]?.name || pid}`,
      `${p.wins}/${p.runs} won (${p.runs ? Math.round((100 * p.wins) / p.runs) : 0}%)`);
  }
  const instRuns = Object.entries<any>(lt.byInstrument).sort((a, b) => b[1].runs - a[1].runs);
  if (instRuns.length) {
    list.append(el('h3', 'wall-tier', 'Weapon of choice'));
    for (const [iid, st] of instRuns.slice(0, 3)) {
      row(activePack.loadoutById(iid)?.name || iid, `${st.runs} run${st.runs === 1 ? '' : 's'}, ${st.wins} win${st.wins === 1 ? '' : 's'}`);
    }
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
  toggleRow('Minigames', meta.settings.minigames !== false, () => {
    meta.settings.minigames = meta.settings.minigames === false;
  });
  toggleRow('Relaxed minigames', meta.settings.relaxedMinigames === true, () => {
    meta.settings.relaxedMinigames = meta.settings.relaxedMinigames !== true;
  });
  toggleRow('Anonymous analytics', analyticsEnabled(), () => {
    meta.settings.analytics = !analyticsEnabled();
    setAnalyticsEnabled(meta.settings.analytics);
  });

  menu.append(el('h3', 'contract-head', 'Career data'));
  menu.append(btn('❓ How to play', '', showHelp));
  if (activePack.tutorialEvents.length) menu.append(btn(PRES.tutorial?.replay || '🎓 Replay the first gig', '', () => { save.clearRun(); startTutorial(); }));
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
  if (activePack.id === 'music') s.append(el('p', 'title-foot', 'BIG BREAK v5 — a satirical music-career roguelike. All characters are archetypes; any resemblance to real A&R reps is statistically inevitable.'));
  show('#screen-settings');
}
