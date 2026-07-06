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
  selectPack, setRun, setMeta, metaFor, fillText, itemById, vibeFor,
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

// ---------- Instrument select ----------

function startNewRun(daily = false, comeback = false) {
  const seed = daily ? hashStr('bigbreak-daily-' + todayStr()) : Math.floor(Math.random() * 1e9) + 1;
  let chosenContract = null;
  let chosenGenre = null;
  let chosenVenue = null;
  let chosenInst = null;
  const s = $('#screen-instruments');

  // Committing is a separate, explicit act — tapping an instrument only
  // selects it, so the optional pickers below can't be silently skipped.
  const beginRun = () => {
    const inst = activePack.loadoutById(chosenInst);
    if (!inst) return;
    sfx.commit();
    const lv = masteryLevel(inst.id);
    setRun(engine.newRun(activePack, inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta)));
    engine.applyMastery(run, lv);
    run.seed = seed + 2;
    run.daily = daily ? todayStr() : null;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    if (chosenContract) signContract(run, chosenContract);
    run.genre = chosenGenre;
    run.venue = chosenVenue;
    if (!daily) {
      // The nemesis returns: bias normal runs toward your most-faced rival
      const counts: any = meta.rivalCounts || {};
      const [topRival, topCount] = (Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0] || [null, 0]) as [any, number];
      if (topRival && topCount >= 2 && Math.random() < 0.45) run.rival = topRival;
    }
    if (comeback) engine.applyComeback(run);
    run.nemesis = (meta.rivalCounts?.[run.rival] || 0) >= 2; // 3rd+ meeting
    run.firstRun = (meta.runs || 0) === 0; // a pack may key onboarding off this
    run.history = (meta.history || []).slice(); // the memory ledger (packs author off it; sims never set it)
    save.saveRun(run);
    // Genre-neutral spine only; the pack contributes its own taxonomy
    // (music: instrument/contract/genre/venue/mastery) via PRES.runProps.
    track('run_start', {
      mode: daily ? 'daily' : comeback ? 'comeback' : 'normal',
      career_runs: meta.runs || 0,
      ...(PRES.runProps?.(run, 'start') || {}),
    });
    nav.dealCard();
  };

  const buildScreen = () => {
    const cMods: any = contractById(chosenContract)?.mods || {};
    const pool = cMods.forceInstrument
      ? [cMods.forceInstrument]
      : activePack.id === 'music'
      ? save.unlockedInstrumentIds(meta) // music: default + Career-Wall unlocks
      : activePack.loadouts.filter((i) => i.unlockedByDefault || i.unlockedBy?.(meta)).map((i) => i.id);
    // A pack may offer its whole roster (e.g. persona × gender picks) instead
    // of the seeded three.
    const offered = PRES.offerAllLoadouts
      ? pool.map((id) => activePack.loadoutById(id)).filter(Boolean)
      : engine.offerLoadouts(pool, engine.mulberry32(seed));
    if (chosenInst && !offered.some((i) => i.id === chosenInst)) chosenInst = null;
    const keepScroll = s.scrollTop;
    s.innerHTML = '';
    const isMusic = activePack.id === 'music';
    s.append(el('h2', 'screen-head', comeback ? (PRES.comeback?.head || 'The Second Act') : daily ? `${PRES.daily?.name || 'Daily Grind'} — ${todayStr()}` : (isMusic ? 'Choose your weapon' : 'Choose your player')));
    s.append(el('p', 'screen-sub', comeback
      ? (PRES.comeback?.sub || 'You were somebody. Start famous, bruised, and 25% burned out already — the industry remembers you, which cuts both ways.')
      : daily
      ? 'Same run for everyone today: same instruments, same deck, same luck. Only the swipes are yours.'
      : (isMusic ? 'Each one is almost useless. That’s the point.' : 'Who are you, when the cameras are always on?')));
    renderInstrumentRow(s, offered, chosenInst, (id) => { chosenInst = id; buildScreen(); });
    // Venue + genre pickers are music subsystems (this pack has neither for
    // other genres). Contracts self-gate below (a pack with none shows none).
    if (isMusic) {
      // Home venue picker (Pass 41): adopt a room to build across the run
      const venues = offerVenues(engine.mulberry32(seed + 13));
      s.append(el('h3', 'contract-head', 'Optional: adopt a home venue'));
      const vRow = el('div', 'genre-row');
      for (const v of venues) {
        const chip = el('button', 'contract-chip venue-pick-chip' + (chosenVenue === v.id ? ' signed' : ''),
          `${v.icon} <b>${v.name}</b><br><span>${v.flavor} Build it by playing ${v.tags.join('/')} shows.</span>`);
        chip.addEventListener('click', () => {
          sfx.ui();
          chosenVenue = chosenVenue === v.id ? null : v.id;
          buildScreen();
        });
        vRow.append(chip);
      }
      s.append(vRow);
      // Genre picker (Pass 21): optional sound identity
      const genres = offerGenres(engine.mulberry32(seed + 7));
      s.append(el('h3', 'contract-head', 'Optional: claim a sound'));
      const gRow = el('div', 'genre-row');
      for (const g of genres) {
        const chip = el('button', 'contract-chip genre-chip' + (chosenGenre === g.id ? ' signed' : ''),
          `${g.icon} <b>${g.name}</b> · ${g.blurb}<br><span>${g.flavor}</span>`);
        chip.addEventListener('click', () => {
          sfx.ui();
          chosenGenre = chosenGenre === g.id ? null : g.id;
          buildScreen();
        });
        gRow.append(chip);
      }
      s.append(gRow);
    }
    // Contract picker (Pass 9): optional clause, at most one — a music
    // subsystem, like the venue/genre pickers above.
    const contracts = isMusic ? save.unlockedContractIds(meta).map((id) => contractById(id)).filter(Boolean) : [];
    if (contracts.length && !daily) {
      s.append(el('h3', 'contract-head', 'Optional: sign a contract'));
      const row = el('div', 'contract-row');
      for (const c of contracts) {
        const chip = el('button', 'contract-chip' + (chosenContract === c.id ? ' signed' : ''),
          `${c.icon} <b>${c.name}</b> ×${c.lpMult} LP<br><span>${c.desc}</span>`);
        chip.addEventListener('click', () => {
          sfx.ui();
          chosenContract = chosenContract === c.id ? null : c.id;
          buildScreen();
        });
        row.append(chip);
      }
      s.append(row);
    }

    // Sticky commit bar: always visible, states the full loadout
    const inst = chosenInst ? activePack.loadoutById(chosenInst) : null;
    const bar = el('div', 'start-bar');
    const extras = [
      chosenVenue ? venueById(chosenVenue)?.icon : null,
      chosenGenre ? genreById(chosenGenre)?.icon : null,
      chosenContract ? contractById(chosenContract)?.icon : null,
    ].filter(Boolean).join(' ');
    const sb = btn(inst ? `▶ Start the run — ${inst.name}${extras ? ' · ' + extras : ''}` : (isMusic ? 'Pick an instrument to start' : 'Pick your player to start'), inst ? 'primary' : '', beginRun);
    sb.id = 'start-run-btn';
    if (!inst) sb.disabled = true;
    bar.append(sb);
    s.append(bar);
    s.scrollTop = keepScroll;
  };
  buildScreen();
  show('#screen-instruments');
}

function renderInstrumentRow(s, offered, chosenId, onPick) {
  const row = el('div', 'pick-row');
  for (const inst of offered) {
    const card = el('div', 'pick-card' + (inst.id === chosenId ? ' selected' : ''));
    card.append(artFor(inst.art, 'pick-art'));
    const lv = masteryLevel(inst.id);
    // A persona may carry a gender tag (packs where the pick is persona × gender).
    const genderTag = inst.genderLabel ? ` <span class="mastery">${inst.genderLabel}</span>` : '';
    card.append(el('h3', '', inst.name + genderTag + (lv ? ` <span class="mastery">${'★'.repeat(lv)}</span>` : '')));
    card.append(el('p', 'pick-flavor', inst.flavor || ''));
    card.append(el('p', 'pick-mods', modsText(inst.modifiers) + (lv ? ` · Mastery +${lv} to all stats` : '')));
    // A pack's loadouts may not carry a signature quirk.
    if (inst.quirk) card.append(el('p', 'pick-quirk', `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`));
    activatable(card, () => { sfx.ui(); onPick(inst.id); }, inst.name);
    row.append(card);
  }
  s.append(row);
}

// Mastery level for an instrument: earned by finishing (and winning) runs
function masteryLevel(instrumentId) {
  const st = meta.lifetime?.byInstrument?.[instrumentId];
  if (!st) return 0;
  return Math.min(3, Math.floor(st.runs / 2) + st.wins);
}

function modsText(mods) {
  return Object.entries(mods)
    .map(([k, v]: [string, any]) => `${v > 0 ? '+' : ''}${v} ${STAT_META[k]?.name || k}`)
    .join(' · ');
}

function resumeRun() {
  if (run.phase === 'crossroads') nav.crossroads();
  else if (run.phase === 'finale') nav.finalSet();
  else nav.dealCard();
}

// The Gauntlet (Pass 28): one fixed, seeded build per ISO week — same
// instrument, genre, and contract for everyone. Often cursed. Always fair.
function startGauntlet() {
  const week = weekStr();
  const seed = hashStr('bigbreak-gauntlet-' + week);
  const rng = engine.mulberry32(seed);
  const basics = INSTRUMENTS.filter((i) => i.unlockedByDefault);
  const inst = basics[Math.floor(rng() * basics.length)];
  const contract = CONTRACTS[Math.floor(rng() * CONTRACTS.length)];
  const genre = offerGenres(rng)[0];

  const s = $('#screen-instruments');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', `The Gauntlet — ${week}`));
  s.append(el('p', 'screen-sub', 'One build, chosen by fate, same for everyone this week. No substitutions. The kitchen is closed.'));
  const sheet = el('div', 'pick-row');
  const card = el('div', 'pick-card');
  card.append(artFor(inst.art, 'pick-art'));
  card.append(el('h3', '', inst.name));
  card.append(el('p', 'pick-flavor', inst.flavor));
  card.append(el('p', 'pick-mods', modsText(inst.modifiers)));
  card.append(el('p', 'pick-quirk',
    `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}<br><br>` +
    `${genre.icon} <b>${genre.name}</b> — ${genre.blurb}<br>` +
    `${contract.icon} <b>${contract.name}</b> ×${contract.lpMult} LP — ${contract.desc}`));
  card.addEventListener('click', () => {
    sfx.commit();
    setRun(engine.newRun(activePack, inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta)));
    engine.applyMastery(run, masteryLevel(inst.id));
    run.seed = seed + 2;
    run.gauntlet = week;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    run.genre = genre.id;
    signContract(run, contract.id);
    save.saveRun(run);
    // Same shape as the normal run_start: neutral spine + the pack's own props
    // via PRES.runProps. The gauntlet run carries instrument/contract/genre/
    // mastery on `run` (venue unset → 'none'), so music's runProps reproduces
    // the exact keys this used to inline.
    track('run_start', {
      mode: 'gauntlet',
      career_runs: meta.runs || 0,
      ...(PRES.runProps?.(run, 'start') || {}),
    });
    nav.dealCard();
  });
  keyable(card, inst.name);
  sheet.append(card);
  s.append(sheet);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-instruments');
}



function startTutorial() {
  const seed = Math.floor(Math.random() * 1e9) + 1;
  setRun(engine.newTutorialRun(activePack, engine.mulberry32(seed)));
  run.seed = seed + 2;
  save.saveRun(run);
  track('tutorial_start', { replay: !!meta.tutorialDone });
  nav.dealCard();
}

// The First Gig wrap-up: lessons recapped in-fiction, walk-in LP, and the
// game opens up for real play.
function renderTutorialEnd() {
  save.clearRun();
  const firstTime = !meta.tutorialDone;
  track('tutorial_complete', { first_time: firstTime });
  meta.tutorialDone = true;
  // the generic coach marks would re-teach what the gig just taught
  meta.coach = { ...(meta.coach || {}), card: true, result: true };
  if (firstTime) {
    meta.lp += 15;
    meta.lpEarnedTotal = (meta.lpEarnedTotal || 0) + 15;
  }
  save.saveMeta(meta);
  music.setMood('ending');
  sfx.win();

  const s = $('#screen-ending');
  s.innerHTML = '';
  const wrap = el('div', 'ending-wrap');
  // The wrap-up copy is the pack's (presenter.tutorial.end); the music game's
  // First Gig is the built-in default.
  const tend = PRES.tutorial?.end || {
    verdict: 'SOUNDCHECK COMPLETE', title: 'The First Gig', art: 'ev_tut_set',
    text: 'Nineteen people, four of them on purpose, and nobody left. Dee flips the clipboard shut: “Tuesday’s yours if you want it.” That’s the whole tutorial — the career ahead is longer, meaner, and much funnier.',
    lessons: [
      { cls: 'notice-gear', html: '👆 <b>Swipe or tap</b> — every card is one decision, left or right.' },
      { cls: 'notice-gear', html: '🎸 <b>Stat icons</b> on a choice show what it rolls against. Build what your path needs.' },
      { cls: 'notice-gear', html: '<b>The risk tell</b> — ● safe · ▲ dicey · ■ likely bad · ✦ big upside. Read it before you leap.' },
      { cls: 'notice-bad', html: '🔥 <b>Burnout</b> drags every roll and ends careers at 100. Rest is a real move.' },
      { cls: 'notice-encore', html: '🎇 <b>Encores</b> — an INCREDIBLE banks one; arm it on the card that matters.' },
    ],
  };
  wrap.append(artFor(tend.art || 'ev_tut_set', 'ending-art', { fame: 12, network: 40, burnout: 10 }));
  wrap.append(el('div', 'verdict verdict-success', tend.verdict));
  wrap.append(el('h2', 'ending-title', tend.title));
  wrap.append(el('p', 'ending-text', tend.text));
  const list = el('div', 'result-notices');
  for (const l of tend.lessons) list.append(el('div', 'notice ' + l.cls, l.html));
  wrap.append(list);
  if (firstTime) wrap.append(el('p', 'lp-award', '+15 Legacy Points — walk-in money for the Career Wall'));
  const menu = el('div', 'menu');
  menu.append(btn(PRES.tutorial?.end.next || '▶ Start your real career', 'primary', () => nav.newRun()));
  menu.append(btn('🏠 Title', '', () => { nav.title(); show('#screen-title', 'back'); }));
  wrap.append(menu);
  s.append(wrap);
  show('#screen-ending');
}

// ---------- The Brammies (Pass 44) ----------
// Procedural awards night: you're nominated against your rival and two
// chart acts. You pick what to PREPARE; the seeded outcome pays off
// against your preparation.

function showBrammies(step) {
  const rng = engine.mulberry32((run.flavorSeed || 1) * 7 + 44);
  const rival = rivalById(run.rival);
  const genre = genreById(run.genre);
  const category = genre
    ? `Best Emerging ${genre.name} Act`
    : ['Best New Act (Regional)', 'Breakthrough Artist To Watch', 'Best Live Act Under 500 Cap'][Math.floor(rng() * 3)];
  const chart = buildChart(run).filter((r) => !r.you && !r.rival).slice(0, 2);
  const nominees = [rival.name, ...chart.map((r) => r.artist)];
  // your odds scale with fame; the rival feeds on feud heat
  const winChance = Math.min(0.85, Math.max(0.2, run.fame / 110 - (run.rivalry >= 7 ? 0.1 : 0)));
  const youWin = rng() < winChance;

  const s = $('#screen-crossroads');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', '🏆 The Brammies'));
  s.append(el('p', 'screen-sub',
    `You’re nominated: <b>${category}</b>. Also nominated: ${nominees.join(', ')}. The envelope exists. The cameras are ON you. What do you rehearse in the hotel mirror?`));
  const row = el('div', 'pick-row');

  const outcomes = (prepared) => {
    run.brammy = youWin ? 'won' : 'lost';
    let text, deltas;
    if (youWin && prepared === 'speech') {
      text = `They call your name. The speech lands — every thank-you in order, the joke placed just right, one genuine crack in your voice you didn’t rehearse. The clip travels for weeks.`;
      run.fame += 12; run.stats.cred = Math.min(100, run.stats.cred + 4);
      deltas = '★ +12 Fame · 🤟 +4 Cred';
    } else if (youWin && prepared === 'lossface') {
      text = `They call your name and you walk up with nothing. The fumbling, unprepared, honest mess of a speech is somehow MORE charming. “Authentic,” says everyone. You thanked your landlord.`;
      run.fame += 8; run.stats.cred = Math.min(100, run.stats.cred + 6);
      deltas = '★ +8 Fame · 🤟 +6 Cred';
    } else if (!youWin && prepared === 'speech') {
      text = `${rival.name} wins. The camera finds you mid-expression — the exact face of someone with a folded speech in their pocket. The GIF is instant. The speech stays folded forever.`;
      run.fame += 3; run.stats.burnout = Math.min(100, run.stats.burnout + 6); run.rivalry = Math.min(10, (run.rivalry ?? 3) + 2);
      deltas = '★ +3 Fame · 🔥 +6 Burnout · ⚔ Feud +2';
    } else {
      text = `${rival.name} wins. Your gracious-loss face — rehearsed to perfection — broadcasts pure class to four million viewers. Industry folk remember losers who clap like that.`;
      run.fame += 5; run.stats.cred = Math.min(100, run.stats.cred + 5); run.stats.network = Math.min(100, run.stats.network + 4);
      deltas = '★ +5 Fame · 🤟 +5 Cred · 📱 +4 Network';
    }
    save.saveRun(run);
    openOverlay((ov) => {
      const box = el('div', `result-card tier-${youWin ? 'incredible' : 'good'}`);
      if (youWin) { spawnConfetti(ov); sfx.win(); } else sfx.good();
      box.append(el('div', 'tier-badge', youWin ? 'AND THE BRAMMY GOES TO... YOU' : `AND THE BRAMMY GOES TO... ${rival.name.toUpperCase()}`));
      box.append(el('p', 'result-text', text));
      box.append(el('p', 'pick-mods', deltas));
      box.append(el('p', 'tap-hint', 'tap to continue'));
      ov.append(box);
    }, { armMs: 300, onClose: () => { nav.actInterstitial(step); show('#screen-game'); } });
  };

  const speech = el('div', 'pick-card path-card');
  speech.append(el('div', 'path-icon', '📜'));
  speech.append(el('h3', '', 'Rehearse the acceptance speech'));
  speech.append(el('p', 'pick-flavor', 'Thank-yous ranked by billing. One tasteful joke. Belief, laminated.'));
  speech.addEventListener('click', () => { sfx.commit(); outcomes('speech'); });
  const loss = el('div', 'pick-card path-card');
  loss.append(el('div', 'path-icon', '🙂'));
  loss.append(el('h3', '', 'Rehearse the gracious-loss face'));
  loss.append(el('p', 'pick-flavor', 'Chin up, warm applause, zero visible eye-twitch. Oscar-grade humility.'));
  loss.addEventListener('click', () => { sfx.commit(); outcomes('lossface'); });
  row.append(speech, loss);
  s.append(row);
  show('#screen-crossroads');
}

// The Final Set (Pass 32): pick your closer before the career is judged.
// The player MUST be able to see their gates and each closer's impact on
// them — otherwise this is a blind choice. So we render the committed
// path's gate readout up top and annotate every closer against it.

// What one closer does to the win gates, in plain language. Reads everything
// through the manifest (gateValue, the momentum/cost resource roles), so any
// pack's closers get an honest readout.
function closerImpact(opt) {
  const gates = activePack.manifest.winGates[run.path] || {};
  const pathName = run.path ? PATHS[run.path].name : 'your path';
  const statName = metaFor(opt.stat).name;

  // A momentum-resource closer that isn't itself a gate: the clutch readout.
  if (opt.stat === activePack.manifest.momentumResource && gates[opt.stat] === undefined) {
    const cur = engine.gateValue(run, opt.stat) || 0;
    const after = cur + opt.amount;
    const allNear = pathFit(run.path).readings.every((r) => r.ratio >= CONFIG.nearMissRatio);
    if (after >= CONFIG.momentumForUpgrade && allNear) {
      return { text: `${statName} ${cur}→${after}. Every gate is near-met — this can upgrade a Partial to a SUCCESS.`, clutch: true };
    }
    if (allNear) {
      return { text: `${statName} ${cur}→${after}. Gates are close, but you need ${CONFIG.momentumForUpgrade}+ ${statName} to force the upgrade.`, clutch: false };
    }
    return { text: `${statName} ${cur}→${after}. Only clutches a win when EVERY gate is ≥85% — some aren't yet.`, clutch: false };
  }

  if (opt.stat === 'money' && activePack.manifest.costResource === 'money') {
    return { text: `Money isn't a win gate — but it clears debt (no Curtis ending) and pads your Legacy Points.`, clutch: false };
  }

  const isCoreStat = opt.stat in run.stats;
  const cur = engine.gateValue(run, opt.stat) || 0;
  const after = isCoreStat ? Math.min(100, cur + opt.amount) : cur + opt.amount;
  const target = gates[opt.stat];
  if (target === undefined) {
    return { text: `${statName} ${cur}→${after}. Not part of the ${pathName} gate — helps your Legacy, not your ending.`, clutch: false };
  }
  if (cur >= target) {
    return { text: `${statName} gate already cleared (${cur}/${target}). Pure bonus.`, clutch: false };
  }
  if (after >= target) {
    return { text: `${statName} ${cur}→${after} — CLEARS the ${target} gate. ✓`, clutch: true };
  }
  return { text: `${statName} ${cur}→${after}, gate wants ${target} (still ${target - after} short).`, clutch: false };
}

function renderFinalSet() {
  // A pack may bring its own pre-finale set piece (head/sub/options); the
  // music Final Set below is the default.
  if (PRES.finalSet) {
    const fs = PRES.finalSet(run);
    renderFinalSetScreen(fs.head, fs.sub, fs.options);
    return;
  }
  const flags = run.flags || [];
  const options = [];
  if (flags.includes('song_finished')) {
    options.push({ title: '“The Door”', blurb: 'The one you found at 3 a.m. and finished anyway.', stat: 'pathProgress', amount: 1, label: '+1 Momentum', apply: () => { run.pathProgress += 1; } });
  }
  // the crowd-pleaser is your ACTUAL hit — closing with it feeds the final
  // chart week (evaluateFinale ticks the chart before judgment)
  const hit = (run.songs || []).filter((x) => x.status === 'charting' && x.pos).sort((a, b) => a.pos - b.pos)[0]
    || (run.songs || []).find((x) => x.crowned);
  options.push({
    title: hit ? `“${hit.title}”` : (run.chartTitles?.[0] ? `“${run.chartTitles[0]}”` : '“The Crowd-Pleaser”'),
    blurb: hit && hit.pos ? `Charting at #${hit.pos} right now. The room knows the first chord.` : 'The one they scream for. Give the people what they want.',
    stat: 'fame', amount: 5, label: hit ? '+5 Fame · feeds the final chart week' : '+5 Fame',
    apply: () => { run.fame += 5; if (hit) hit.hype = Math.min(100, hit.hype + 25); },
  });
  // a great unreleased demo can debut LIVE as your closer — it enters the
  // chart in the finale's last tick, and might even crown
  const vault = (run.songs || []).filter((x) => x.status === 'demo').sort((a, b) => b.quality - a.quality)[0];
  if (vault && vault.quality >= 55) {
    options.push({
      title: `“${vault.title}” (unreleased)`,
      blurb: 'Debut the vault song. Right now. Live. Careers should end on a first.',
      stat: 'cred', amount: 3, label: '+3 Cred · releases it tonight',
      apply: () => { run.stats.cred = Math.min(100, run.stats.cred + 3); releaseSong(run, vault.id, 58); },
    });
  }
  options.push({ title: '“The Deep Cut”', blurb: 'Track 9. The heads nod. The heads matter.', stat: 'cred', amount: 4, label: '+4 Cred', apply: () => { run.stats.cred = Math.min(100, run.stats.cred + 4); } });
  if (flags.includes('debt') || run.money < 0) {
    // debt outranks storytelling: the Curtis closer must survive the 3-slot cut
    options.splice(Math.min(2, options.length), 0,
      { title: '“Curtis (Reprise)”', blurb: 'A ballad for the politest man you owe.', stat: 'money', amount: 100, label: '+$100', apply: () => { run.money += 100; } });
  } else {
    options.push({ title: '“The Instrumental”', blurb: 'No words. Just proof.', stat: 'skill', amount: 4, label: '+4 Skill', apply: () => { run.stats.skill = Math.min(100, run.stats.skill + 4); } });
  }

  const pathName = run.path ? PATHS[run.path].name : 'your path';
  renderFinalSetScreen('The Final Set',
    `Last night of the run — your <b>${pathName}</b> career gets judged after this. Pick the closer that pushes you over a gate.`,
    options);
}

// The pre-finale choice screen shell: gate readout + up to three closers.
function renderFinalSetScreen(head, sub, options) {
  const s = $('#screen-crossroads'); // reuse the 3-option screen
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', head));
  const pathName = run.path ? PATHS[run.path].name : 'your path';
  s.append(el('p', 'screen-sub', sub));

  // Gate readout for the committed path, so the choice is informed
  const { readings } = pathFit(run.path);
  const gates = gateReadout(readings, { className: 'gate-readout compass finalset-gates' });
  gates.prepend(el('div', 'trades-head', `🎯 ${pathName.toUpperCase()} — WHAT YOU STILL NEED`));
  if ((run.pathProgress || 0) > 0) {
    gates.append(el('p', 'momentum-note', `▲ Momentum ×${run.pathProgress} — near-met gates can still upgrade to a win.`));
  }
  s.append(gates);

  const row = el('div', 'pick-row');
  for (const opt of options.slice(0, 3)) {
    const impact = closerImpact(opt);
    const card = el('div', 'pick-card path-card' + (impact.clutch ? ' clutch' : ''));
    card.append(el('div', 'path-icon', impact.clutch ? '🏆' : (PATHS[run.path]?.icon || '🎵')));
    const optHead = el('h3', '', opt.title);
    if (impact.clutch) optHead.innerHTML += ' <span class="clutch-badge">clutch</span>';
    card.append(optHead);
    card.append(el('p', 'pick-flavor', opt.blurb));
    card.append(el('p', 'pick-mods', opt.label));
    card.append(el('p', 'closer-impact' + (impact.clutch ? ' clutch' : ''), impact.text));
    card.addEventListener('click', () => {
      sfx.commit();
      opt.apply(run);
      nav.finale();
    });
    keyable(card, opt.title);
    row.append(card);
  }
  s.append(row);
  show('#screen-crossroads');
}

function actInterstitial(step) {
 openOverlay((ov) => {
  // The act recap (presenter.recap): a pack's full-screen "previously on"
  // takeover — kicker, title, labeled blocks — in place of the default
  // act-intro copy. The rest of the interstitial (twist note, press, inbox)
  // still rides below it.
  const recap = PRES.recap?.(run, step.act, run.flavorSeed || 1);
  const box = el('div', 'result-card act-card' + (recap ? ' recap-card' : ''));
  if (recap) {
    if (recap.kicker) box.append(el('div', 'recap-kicker', recap.kicker));
    box.append(el('p', 'result-text act-name', recap.title));
    for (const b of recap.blocks || []) {
      const blk = el('div', 'recap-block ' + (b.cls || ''));
      if (b.label) blk.append(el('div', 'recap-label', b.label));
      blk.append(el('div', 'recap-body', fillText(b.html)));
      box.append(blk);
    }
  } else {
    box.append(el('div', 'tier-badge', `${PRES.actWord || 'ACT'} ${step.act}`));
    const intro = PRES.actIntro?.[step.act] || (step.act === 2
      ? { name: 'THE GRIND', text: 'The garage is behind you. Everything now costs something.' }
      : { name: 'THE RECKONING', text: 'Higher stakes, fewer excuses. The summit is visible. So is the drop.' });
    box.append(el('p', 'result-text act-name', intro.name));
    box.append(el('p', 'result-text', intro.text));
  }
  for (const n of step.notes || []) {
    if (n.startsWith('♪')) continue; // chart news gets its own stage below
    if (n.startsWith('✂️') || n.startsWith('➕')) {
      // U5: the act twist is a headline, not a line item. A pack may reword
      // the engine's neutral note in its own voice.
      const twist = PRES.twistNote && run.actTwist ? PRES.twistNote(run.actTwist.delta) : n;
      box.append(el('p', 'act-twist-note', twist));
      continue;
    }
    box.append(el('p', 'upkeep-note', n.startsWith('🧳') || n.startsWith('🔥') ? n : `💸 ${n}`));
  }

  // This week on the Hot 10: your songs move while you weren't looking
  const week = run.lastChartWeek;
  const crowns = (week?.moves || []).filter((m) => m.kind === 'crown');
  if (week && week.moves.length) {
    const cw = el('div', 'chart-week');
    cw.append(el('div', 'trades-head', '📈 THIS WEEK ON THE HOT 10'));
    for (const m of week.moves) {
      if (m.kind === 'crown') {
        const row = el('div', 'chart-week-row crown');
        row.innerHTML = `<span class="cw-move">👑 #${m.to}</span><b>“${m.title}”</b><span class="cw-note">top 3 — that’s a HIT</span>`;
        cw.append(row);
      } else if (m.kind === 'debut') {
        const row = el('div', 'chart-week-row debut');
        row.innerHTML = `<span class="cw-move">NEW #${m.to}</span><b>“${m.title}”</b><span class="cw-note">debuts</span>`;
        cw.append(row);
      } else if (m.kind === 'climb') {
        const row = el('div', 'chart-week-row climb');
        row.innerHTML = `<span class="cw-move">▲ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">up from #${m.from}</span>`;
        cw.append(row);
      } else if (m.kind === 'slip') {
        const row = el('div', 'chart-week-row slip');
        row.innerHTML = `<span class="cw-move">▼ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">was #${m.from}</span>`;
        cw.append(row);
      } else if (m.kind === 'hold') {
        const row = el('div', 'chart-week-row hold');
        row.innerHTML = `<span class="cw-move">= #${m.to}</span><b>“${m.title}”</b><span class="cw-note">${m.weeks} wks on chart</span>`;
        cw.append(row);
      } else if (m.kind === 'drop') {
        const row = el('div', 'chart-week-row dropoff');
        row.innerHTML = `<span class="cw-move">OFF</span><b>“${m.title}”</b><span class="cw-note">gone after ${m.weeks} wk${m.weeks === 1 ? '' : 's'}</span>`;
        cw.append(row);
      } else if (m.kind === 'rivalPassed') {
        const row = el('div', 'chart-week-row rivalwar');
        row.innerHTML = `<span class="cw-move">⚔️ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">passes ${rivalById(run.rival)?.name || 'your rival'} (#${m.from}). First blood.</span>`;
        cw.append(row);
      } else if (m.kind === 'rivalNeck') {
        const row = el('div', 'chart-week-row rivalwar');
        row.innerHTML = `<span class="cw-move">⚔️ #${m.to}</span><b>“${m.title}”</b><span class="cw-note">one slot from ${rivalById(run.rival)?.name || 'your rival'} (#${m.from}). It knows.</span>`;
        cw.append(row);
      }
    }
    box.append(cw);
  }

  // The Trades: procedural press about YOUR run (Pass 14). When the pack
  // ships a full-screen recap (ADR-0009), the press + inbox flavour folds
  // behind one tap — the story blocks are the moment.
  const flavourHost = recap ? el('details', 'recap-fold') : box;
  if (recap) {
    flavourHost.append(el('summary', 'recap-fold-head', '📰 Meanwhile, outside the villa…'));
    box.append(flavourHost);
  }
  const headlines = PRES.headlines?.(run, 2) || [];
  if (headlines.length) {
    const paper = el('div', 'trades');
    paper.append(el('div', 'trades-head', '📰 MEANWHILE, IN THE TRADES'));
    for (const h of headlines) {
      paper.append(el('div', 'trades-row', `<b>${h.text}</b><span>— ${h.src}</span>`));
    }
    flavourHost.append(paper);
  }
  // The inbox: people from your run remember you (Pass 22)
  const dms = PRES.dms?.(run, 2) || [];
  if (dms.length) {
    const inbox = el('div', 'inbox');
    inbox.append(el('div', 'trades-head', '💬 YOUR PHONE, MEANWHILE'));
    for (const dm of dms) {
      const bubble = el('div', 'dm-bubble');
      bubble.append(el('div', 'dm-from', dm.from));
      bubble.append(el('div', 'dm-text', dm.text));
      inbox.append(bubble);
    }
    flavourHost.append(inbox);
  }
  // ADR-0014 — the week from the outside: the nation's feeds at the act break.
  const recapFeed = PRES.feeds?.(run, { kind: 'recap', act: step.act });
  if (recapFeed) box.append(feedTeaser(recapFeed, true));
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  if (crowns.length) { spawnConfetti(ov); sfx.win(); vibrate([30, 40, 30, 40, 80]); }
 }, { armMs: 250, onClose: () => nav.dealCard() });
}

// ---------- Crossroads (spec §7.2) ----------

function renderCrossroads() {
  run.phase = 'crossroads';
  save.saveRun(run);
  const s = $('#screen-crossroads');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', PRES.crossroads?.head || 'The Crossroads'));
  s.append(el('p', 'screen-sub', PRES.crossroads?.sub ||
    'Act 1 is over. Pick a summit — the deck follows your choice. No refunds. The bars show how your build lines up with each gate <i>right now</i>.'));
  const fits = Object.keys(PATHS).map((id) => ({ id, ...pathFit(id) }));
  const bestFit = fits.reduce((a, b) => (b.fit > a.fit ? b : a));
  const row = el('div', 'pick-row');
  for (const p of Object.values(PATHS)) {
    const card = el('div', 'pick-card path-card path-' + p.id);
    card.append(el('div', 'path-icon', p.icon));
    const head = el('h3', '', p.name);
    if (bestFit.id === p.id && bestFit.fit > 0.2) head.innerHTML += ' <span class="fit-badge">closest fit</span>';
    card.append(head);
    card.append(el('p', 'pick-flavor', p.blurb));
    const { readings } = fits.find((f) => f.id === p.id);
    const gates = gateReadout(readings, { className: 'gate-readout compass', prefix: false });
    card.append(gates);
    card.addEventListener('click', () => {
      sfx.commit();
      const notes = engine.commitPath(run, p.id);
      save.saveRun(run);
      nav.actInterstitial({ kind: 'actStart', act: run.act, notes });
      show('#screen-game');
    });
    keyable(card, p.name);
    row.append(card);
  }
  s.append(row);
  show('#screen-crossroads');
}

// ---------- Endings ----------

function finishMeta(summary, lp) {
  meta.runs += 1;
  meta.lp += lp;
  meta.lpEarnedTotal += lp;
  meta.best.fame = Math.max(meta.best.fame, summary.fame || 0);
  meta.best.lp = Math.max(meta.best.lp, lp);
  if (summary.daily) {
    meta.dailyResults = meta.dailyResults || {};
    if (!meta.dailyResults[summary.daily]) {
      meta.dailyResults[summary.daily] = { result: summary.result, path: summary.path, fame: summary.fame || 0 };
    }
    summary.dailyStreak = dailyStreakFor(summary.daily); // trophies + share read it
  }
  if (summary.gauntlet) {
    meta.gauntletResults = meta.gauntletResults || {};
    if (!meta.gauntletResults[summary.gauntlet]) {
      meta.gauntletResults[summary.gauntlet] = { result: summary.result, path: summary.path, fame: summary.fame || 0 };
    }
  }
  // The memory ledger: the last five runs' scalar summary fields, kept on
  // meta and stamped onto future runs (run.history) so a pack can author
  // remembers-you content. Generic: same flattener as the telemetry props.
  const compact: any = {};
  for (const [k, v] of Object.entries(summary)) {
    if (Array.isArray(v)) { if (v.length <= 8 && v.every((x) => typeof x !== 'object')) compact[k] = v.join(','); }
    else if (v === null || typeof v !== 'object') compact[k] = v;
  }
  meta.history = [...(meta.history || []).slice(-4), compact];

  // Lifetime aggregates (Pass 25)
  const lt = meta.lifetime = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byInstrument: {}, byPath: {}, hits: 0, moneyBest: 0 };
  lt.swipes += (summary.tierLog || []).length;
  lt.incredibles += (summary.tierLog || []).filter((t) => t === 'incredible').length;
  lt.bads += (summary.tierLog || []).filter((t) => t === 'bad').length;
  lt.hits += summary.hits || 0;
  lt.moneyBest = Math.max(lt.moneyBest, summary.money || 0);
  const bi = lt.byInstrument[summary.loadout] = lt.byInstrument[summary.loadout] || { runs: 0, wins: 0 };
  bi.runs += 1;
  if (summary.result === 'success') bi.wins += 1;
  if (summary.path) {
    const bp = lt.byPath[summary.path] = lt.byPath[summary.path] || { runs: 0, wins: 0 };
    bp.runs += 1;
    if (summary.result === 'success') bp.wins += 1;
  }

  // Nemesis bookkeeping (Pass 47): count rival encounters across runs
  if (summary.rival) {
    meta.rivalCounts = meta.rivalCounts || {};
    meta.rivalCounts[summary.rival] = (meta.rivalCounts[summary.rival] || 0) + 1;
  }
  meta.runHistory = meta.runHistory || [];
  meta.runHistory.unshift({
    date: todayStr(),
    instrument: summary.loadout,
    path: summary.path,
    result: summary.result,
    endingKey: summary.endingKey,
    fame: summary.fame || 0,
    daily: !!summary.daily,
  });
  meta.runHistory = meta.runHistory.slice(0, 10);

  const earned = [];
  const specials = {
    all_paths: () => ['megastar', 'studio', 'hitfactory'].every((p) => meta.successPaths.includes(p)),
    daily_3: () => Object.keys(meta.dailyResults || {}).length >= 3,
    wall_5: () => meta.unlockedWall.length >= 5,
    mastery_3: () => Object.values(meta.lifetime?.byInstrument || {})
      .some((st: any) => Math.min(3, Math.floor(st.runs / 2) + st.wins) >= 3),
    exits_3: () => (meta.exitSeen || []).length >= 3,
    nemesis_3: () => Object.values(meta.rivalCounts || {}).some((n: any) => n >= 3),
    mg_6: () => Object.keys(meta.minigamesPlayed || {}).length >= 6,
    mg_12: () => Object.keys(meta.minigamesPlayed || {}).length >= 12,
  };
  for (const t of (PRES.trophies || [])) {
    if (meta.trophies.includes(t.id)) continue;
    let ok = false;
    if (t.special) ok = !!specials[t.special]?.();
    else if (t.check) ok = t.check(summary);
    if (ok) { meta.trophies.push(t.id); earned.push(t); }
  }
  for (const t of earned) track('trophy', { id: t.id });
  save.saveMeta(meta);
  save.clearRun();
  return earned;
}

// Telemetry mode of a run, derived from run state so run_end can always
// report it — including runs started before mode was tracked at start.
function runMode(r) {
  return r.gauntlet ? 'gauntlet'
    : r.daily ? 'daily'
    : (r.flags || []).includes('comeback') ? 'comeback'
    : 'normal';
}

// Content touched during a run, for coverage analysis (which rivals, band
// members, gear, and hustles players actually meet). Lists are sorted,
// comma-joined strings so HogQL can splitByChar+arrayJoin them.
function runContentProps(r, summary) {
  // The pack's own run-summary fields ride run_end generically (R3/G2):
  // scalars as-is, arrays joined, objects skipped — a pack instruments its
  // subsystems by extending its summarize, never this file. Genre-specific
  // props NOT in summarize (music's gear/instrument/chart_peak) come from
  // PRES.runProps; only the genre-neutral run-meta keys live here now.
  const packProps = {};
  if (activePack.summarize) {
    for (const [k, v] of Object.entries(activePack.summarize(r))) {
      if (Array.isArray(v)) {
        if (v.every((x) => typeof x !== 'object')) packProps[k] = v.join(',');
      } else if (v === null || typeof v !== 'object') packProps[k] = v;
    }
  }
  return {
    career_runs: meta.runs || 0,
    last_card: (r.cardLog || [])[r.cardLog?.length - 1]?.e || 'none',
    ...packProps,
  };
}

function renderFinale() {
  const evalr = engine.evaluateFinale(run);
  const summary = engine.runSummary(run);

  // success bookkeeping before trophies (all_paths depends on it)
  if (evalr.result === 'success' && !meta.successPaths.includes(run.path)) {
    meta.successPaths.push(run.path);
  }
  let lp = engine.legacyPoints(run);
  const milestone = `${run.path}_${evalr.result}`;
  if (!meta.firstTimeBonuses.includes(milestone)) {
    meta.firstTimeBonuses.push(milestone);
    lp += CONFIG.lpFirstTimeMilestone;
  }
  const earned = finishMeta(summary, lp);

  const ending = PRES.endings[run.path][evalr.result];
  track('run_end', {
    outcome: evalr.result, path: run.path, cause: 'finale', mode: runMode(run),
    cards: (summary.cardLog || []).length, burnout: run.stats.burnout, lp,
    ...runContentProps(run, summary),
    ...(PRES.runProps?.(run, 'end') || {}),
  });
  if (evalr.result === 'success') sfx.winPath(run.path); else if (evalr.result === 'failure') sfx.gameover(); else sfx.good();
  renderEndingScreen(ending, lp, earned, evalr, summary);
}

function renderGameOver(endingKey) {
  const interview = PRES.exitInterviews?.[endingKey];
  if (interview && !run.exitChoice) {
    showExitInterview(endingKey, interview);
    return;
  }
  const summary = engine.runSummary(run);
  (summary as any).exitChoice = run.exitChoice || null;
  let lp = engine.legacyPoints(run) + (run.exitLpBonus || 0);
  const earned = finishMeta(summary, lp);
  track('run_end', {
    outcome: 'gameover', path: run.path || null, cause: endingKey, mode: runMode(run),
    cards: (summary.cardLog || []).length, burnout: run.stats.burnout, lp,
    exit: run.exitChoice || 'none',
    ...runContentProps(run, summary),
    ...(PRES.runProps?.(run, 'end') || {}),
  });
  sfx.gameover();
  renderEndingScreen(PRES.endings[endingKey], lp, earned, null, summary);
}

// The Exit Interview (Pass 45): one final choice inside a fail state
function showExitInterview(endingKey, interview) {
  // Forced choice: no backdrop dismiss. Each button records its exit then
  // close()s; the game-over screen renders once, on close (Escape skips it).
  openOverlay((ov, close) => {
    const box = el('div', 'result-card');
    box.append(el('div', 'tier-badge', 'ONE LAST QUESTION'));
    box.append(el('p', 'card-context', interview.context));
    box.append(el('p', 'result-text', interview.prompt));
    const list = el('div', 'gear-choices');
    for (const side of ['left', 'right']) {
      const opt = interview[side];
      list.append(btn(opt.label, side === 'left' ? 'primary' : '', () => {
        run.exitChoice = opt.exit;
        run.exitLpBonus = opt.lp;
        run.exitText = opt.text;
        meta.exitSeen = meta.exitSeen || [];
        if (!meta.exitSeen.includes(endingKey)) meta.exitSeen.push(endingKey);
        save.saveMeta(meta);
        close();
      }));
    }
    box.append(list);
    ov.append(box);
  }, { dismissable: false, onClose: () => nav.gameOver(endingKey) });
}

const TIER_EMOJI = SHARE_TIER_EMOJI;

// Short verdict labels for the pack's fail-state endings (ribbon, history,
// share). Music's trio is the default; a pack overrides via presenter.
function failLabelFor(endingKey) {
  const labels = PRES.failLabels || DEFAULT_FAIL_LABELS;
  return labels[endingKey];
}

// Consecutive daily-mode days ending at `d` (inclusive) — the streak the
// share card and the pack's end note read. Pure ledger walk.
function dailyStreakFor(d) {
  const done = meta.dailyResults || {};
  let n = 0;
  const day = new Date(d + 'T12:00:00Z');
  while (done[day.toISOString().slice(0, 10)]) { n++; day.setUTCDate(day.getUTCDate() - 1); }
  return n;
}

function shareTextFor(summary, lp) {
  if (PRES.shareText) return PRES.shareText(summary, lp);
  // The genre-specific pieces are resolved here (loadout name, the genre-prefixed
  // path label); the neutral template lives in share-text.ts and is snapshot-tested.
  const inst = activePack.loadoutById(summary.loadout);
  const genre = summary.genre ? genreById(summary.genre) : null;
  const pathName = (genre ? genre.name + ' ' : '') + (summary.path ? PATHS[summary.path].name : 'the void');
  return buildDefaultShareText(summary, lp, {
    loadoutName: inst ? inst.name : null,
    pathName,
    failLabels: PRES.failLabels,
    url: 'https://sandstreampop.github.io/big-break/',
  });
}

function renderEndingScreen(ending, lp, trophies, evalr, summary) {
  if (summary?.daily) summary.dailyStreak = dailyStreakFor(summary.daily);
  music.setMood('ending');
  const s = $('#screen-ending');
  s.innerHTML = '';
  const wrap = el('div', 'ending-wrap');
  wrap.append(artFor(ending.art, 'ending-art', vibeFor()));
  // Verdict ribbon: outcome legible before a single line of prose
  const resKey = summary?.result || null;
  const resLabel = resKey
    ? { success: 'SUCCESS', partial: 'PARTIAL CREDIT', failure: 'FAILURE' }[resKey]
    : failLabelFor(summary?.endingKey) || 'THE END';
  const pathLabel = summary?.path ? PATHS[summary.path].name.toUpperCase() + ' · ' : '';
  wrap.append(el('div', `verdict verdict-${resKey || 'over'}`, `${pathLabel}${resLabel}`));
  wrap.append(el('h2', 'ending-title', ending.title));
  const finalPress = (PRES.headlines?.(run, 1) || [])[0];
  if (finalPress) {
    wrap.append(el('p', 'trades-row ending-press', `<b>${finalPress.text}</b><span>— ${finalPress.src}</span>`));
  }
  wrap.append(el('p', 'ending-text', ending.text));

  // Chart legacy: what the Hot 10 will remember
  {
    const songs = summary?.songs || run.songs || [];
    const charted = songs.filter((x) => x.peak).length;
    const crowned = songs.filter((x) => x.crowned).length;
    const peak = summary?.chartPeak;
    if (charted) {
      const bits = [`peak <b>#${peak}</b>`, `${charted} song${charted > 1 ? 's' : ''} charted`];
      if (crowned) bits.push(`${crowned} certified hit${crowned > 1 ? 's' : ''} 👑`);
      wrap.append(el('p', 'chart-legacy', `📈 Chart legacy: ${bits.join(' · ')}`));
    }
  }

  // Scoreboard first (how you were judged), memorabilia after
  if (evalr) {
    wrap.append(el('h3', 'wall-tier', 'The Judgment'));
    const gates = gateReadout(evalr.readings, { metOf: (r) => r.met });
    if (evalr.momentum >= CONFIG.momentumForUpgrade &&
        summary?.result === 'success' && !evalr.readings.every((r) => r.met)) {
      const mr = activePack.manifest.momentumResource;
      gates.append(el('p', 'momentum-note', `${metaFor(mr).icon} ${metaFor(mr).name} carried you over the line.`));
    }
    wrap.append(gates);
  }
  const endContract = summary?.contract ? contractById(summary.contract) : null;
  wrap.append(el('p', 'lp-award', `+${lp} Legacy Points${endContract ? ` <span class="lp-mult">(${endContract.icon} ${endContract.name} ×${endContract.lpMult})</span>` : ''}`));
  for (const t of trophies) {
    wrap.append(el('p', 'trophy-toast', `${t.icon} Trophy: <b>${t.name}</b> — ${t.desc}`));
  }

  const disc = PRES.discography?.(run) || [];
  if (disc.length) {
    wrap.append(el('h3', 'wall-tier', 'The Discography'));
    const list = el('div', 'disc-list');
    for (const d of disc) {
      list.append(el('div', 'disc-row', `<b>“${d.title}”</b>${d.fact ? `<i class="disc-fact">${d.fact}</i>` : ''}<span>— ${d.review}</span>`));
    }
    wrap.append(list);
  }
  const epilogue = PRES.epilogue?.(run) || '';
  if (run.exitText || epilogue) {
    wrap.append(el('h3', 'wall-tier', 'Epilogue'));
    if (run.exitText) wrap.append(el('p', 'epilogue-text exit-text', run.exitText));
    if (epilogue) wrap.append(el('p', 'epilogue-text', epilogue));
  }

  // ADR-0014 — your phone, returned: the season's final feeds. On the ending
  // screen the teaser is inline (no overlay to stop-propagate against).
  const endFeed = PRES.feeds?.(run, { kind: 'ending', endingKey: summary?.endingKey || 'finale' });
  if (endFeed) {
    wrap.append(el('h3', 'wall-tier', 'Your Phone, Returned'));
    wrap.append(feedTeaser(endFeed, false));
  }

  if (summary?.tierLog?.length) {
    wrap.append(el('p', 'tier-strip', summary.tierLog.map((t) => TIER_EMOJI[t] || '⬜').join('')));
  }

  // The daily loop's closing beat: the pack's "come back tomorrow" note.
  if (summary?.daily && PRES.daily?.endNote) {
    wrap.append(el('p', 'daily-note', PRES.daily.endNote(summary)));
  }

  const menu = el('div', 'menu');
  if (summary?.cardLog?.length) {
    menu.append(btn('📖 Scrapbook (how it went down)', '', () => showScrapbook(summary)));
  }
  if (summary) {
    const shareBtn = btn('📣 Share this run', '', async () => {
      const text = shareTextFor(summary, lp);
      try {
        // Prefer a poster image via the native sheet (Pass 38). The poster
        // composer is music-shaped; a pack with its own shareText shares text.
        if (PRES.shareText) {
          if (navigator.share) await navigator.share({ text });
          else { await navigator.clipboard.writeText(text); shareBtn.textContent = '📋 Copied!'; }
          return;
        }
        const inst = activePack.loadoutById(summary.loadout);
        const genre = summary.genre ? genreById(summary.genre) : null;
        const res = summary.result ? summary.result.toUpperCase()
          : failLabelFor(summary.endingKey) || 'GAME OVER';
        const blob = await renderShareImage({
          headline: `${ending.title}`,
          subline: `${inst ? inst.name : '?'} → ${genre ? genre.name + ' ' : ''}${summary.path ? PATHS[summary.path].name : 'the void'} → ${res}`,
          tierLog: summary.tierLog,
          songLine: (() => {
            const best = (summary.songs || []).filter((x) => x.peak)
              .sort((a, b) => (b.crowned - a.crowned) || (a.peak - b.peak))[0];
            return best ? `${best.crowned ? '👑 ' : '♪ '}“${best.title}” — peaked #${best.peak}` : null;
          })(),
          statLine: `★${summary.fame} fame · ${summary.hits} hits · +${lp} LP${summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : ''}`,
          footer: 'play: sandstreampop.github.io/big-break',
        });
        const file = blob ? new File([blob as BlobPart], 'big-break-run.png', { type: 'image/png' }) : null;
        if (file && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text });
        } else if (navigator.share) {
          await navigator.share({ text });
        } else {
          await navigator.clipboard.writeText(text);
          shareBtn.textContent = '📋 Copied!';
        }
      } catch (e) { /* user cancelled the share sheet */ }
    });
    menu.append(shareBtn);
  }
  menu.append(btn('▶ Run It Back', 'primary', () => nav.newRun()));
  menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', nav.wall));
  menu.append(btn('🏠 Title', '', () => { nav.title(); show('#screen-title', 'back'); }));
  wrap.append(menu);
  s.append(wrap);
  show('#screen-ending');
}

// ---------- Scrapbook (Pass 11) ----------

function showScrapbook(summary) {
  openOverlay((ov) => {
  const box = el('div', 'result-card scrapbook');
  box.append(el('div', 'tier-badge', 'THE SCRAPBOOK'));
  let lastAct = 0;
  for (const entry of summary.cardLog) {
    if (entry.a !== lastAct) {
      lastAct = entry.a;
      const actNames = PRES.actNames || ['', 'The Garage', 'The Grind', 'The Reckoning'];
      box.append(el('h3', 'scrap-act', `${PRES.actWord || 'ACT'} ${entry.a} · ${actNames[entry.a]}`));
    }
    const ev = activePack.events.find((e) => e.id === entry.e);
    if (!ev) continue;
    const choice = ev.choices[entry.s];
    const row = el('div', 'scrap-row t-' + entry.t);
    row.append(el('span', 'scrap-tier', TIER_EMOJI[entry.t] || '⬜'));
    const perfBadge = entry.m ? ` <span class="scrap-mg scrap-mg-${entry.m.toLowerCase()}">🎮 ${entry.m}</span>` : '';
    row.append(el('span', 'scrap-text',
      `<b>${fillText(ev.context)}</b> — “${choice ? choice.label : '?'}”${perfBadge}`));
    box.append(row);
  }
  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  });
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
