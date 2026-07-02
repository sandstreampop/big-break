// BIG BREAK — UI: screens, card swipe physics, result presentation.

import { CONFIG, PATHS, STAT_META } from './config.js';
import { ENDINGS, WALL_ITEMS, TROPHIES, EXIT_INTERVIEWS } from './data/meta.js';
import { instrumentById, INSTRUMENTS } from './data/instruments.js';
import { rivalById } from './data/rivals.js';
import { accessoryById } from './data/accessories.js';
import { EVENTS } from './data/events.js';
import * as engine from './engine.js';
import * as save from './save.js';
import { artFor, sceneFor } from './art.js';
import { buildChart, buildChartWithMovement, playerChartInfo, collabArtistFor } from './charts.js';
import { CONTRACTS, contractById } from './data/contracts.js';
import { hustleById } from './data/hustles.js';
import { generateHeadlines } from './headlines.js';
import { offerGenres, genreById } from './data/genres.js';
import { weatherById } from './data/weather.js';
import { offerVenues, venueById, VENUE_TIERS } from './data/venues.js';
import { bandmateById } from './data/band.js';
import { generateDMs } from './dms.js';
import { buildEpilogue } from './epilogue.js';
import { renderShareImage } from './sharecard.js';
import { buildDiscography } from './discography.js';
import { sfx, music, ambient, setSoundEnabled, setMusicEnabled, initAudio } from './audio.js';
import { initAnalytics, track, setAnalyticsEnabled, analyticsEnabled, exportEvents } from './analytics.js';
import { playMinigame, minigameById } from './minigames.js';
import { songPlayer, catalogDJ, catalogRadio, songKey } from './composer.js';

let meta = save.loadMeta();
let run = null;

// Audible songs: every ▶ in the DOM tracks the one playing slot
songPlayer.onchange = () => {
  document.querySelectorAll('.sb-play').forEach((b) => {
    b.textContent = songPlayer.playingKey === b.dataset.songkey ? '⏸' : '▶';
    b.classList.toggle('playing', songPlayer.playingKey === b.dataset.songkey);
  });
};

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Fill {rival}/{rivalVibe}/{genre}/{collabArtist} placeholders with this run's identities
function fillText(s) {
  if (!s || !run) return s;
  const r = rivalById(run.rival);
  const g = genreById(run.genre);
  return s.replaceAll('{rival}', r.name).replaceAll('{rivalVibe}', r.vibe)
    .replaceAll('{genre}', g ? g.name : 'your genre')
    .replaceAll('{collabArtist}', collabArtistFor(run))
    .replaceAll('{song}', engine.flagshipSong(run)?.title || 'the song')
    .replaceAll('{hitSong}', (run.songs || []).find((x) => x.crowned)?.title || 'the hit')
    .replaceAll('{fadedSong}', (run.songs || []).find((x) => x.status === 'faded' && x.peak)?.title || 'your old single')
    .replaceAll('{venue}', venueById(run.venue)?.name || 'the venue');
}

function reducedMotion() {
  if (meta.settings.reducedMotion !== null) return meta.settings.reducedMotion;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------- Screen router ----------

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ---------- Title ----------

export function boot() {
  initAnalytics(meta.settings);
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
  renderTitle();
  show('#screen-title');
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
    const glyphs = ['♪', '♫', '♩', '♬'];
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
  s.append(el('div', 'title-logo', 'BIG<br>BREAK'));
  const dayNum = hashStr(todayStr());
  s.append(el('p', 'title-tag', TAGLINES[dayNum % TAGLINES.length]));

  const saved = save.loadRun();
  const menu = el('div', 'menu');
  if (saved) {
    menu.append(btn('▶ Resume Run', 'primary', () => {
      run = saved;
      resumeRun();
    }));
    menu.append(btn('✚ New Run (abandon current)', '', () => {
      save.clearRun();
      startNewRun();
    }));
  } else if (!meta.tutorialDone && (meta.runs || 0) === 0) {
    // First install: the game opens with a playable lesson, not a manual
    menu.append(btn('▶ Play — Your First Gig', 'primary', startTutorial));
    menu.append(btn('Skip the gig — I know the drill', 'ghost', () => {
      track('tutorial_skip', {});
      meta.tutorialDone = true;
      save.saveMeta(meta);
      startNewRun();
    }));
  } else {
    menu.append(btn('▶ New Run', 'primary', () => startNewRun()));
  }
  const today = todayStr();
  const dailyDone = meta.dailyResults?.[today];
  menu.append(btn(
    dailyDone
      ? `📅 Daily Grind ✓ (${dailyDone.result ? dailyDone.result.toUpperCase() : 'DNF'} — replay?)`
      : `📅 Daily Grind — ${today}`,
    '', () => { save.clearRun(); startNewRun(true); }));
  if (meta.successPaths?.length > 0) {
    menu.append(btn('🦅 Comeback Run (×1.2 LP)', '', () => { save.clearRun(); startNewRun(false, true); }));
  }
  if (meta.runs > 0) {
    const week = weekStr();
    const gDone = meta.gauntletResults?.[week];
    menu.append(btn(
      gDone
        ? `⚔️ The Gauntlet ✓ (${gDone.result ? gDone.result.toUpperCase() : 'DNF'} — replay?)`
        : `⚔️ The Gauntlet — ${week}`,
      '', () => { save.clearRun(); startGauntlet(); }));
  }
  menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', renderWall));
  menu.append(btn('🎖 Trophy Room', '', renderTrophies));
  if (meta.runs > 0) menu.append(btn('📊 The Résumé', '', renderResume));
  menu.append(btn('⚙ Settings', '', renderSettings));
  s.append(menu);
  // Today in the industry — flavor headline from the evergreen pool
  const fakeState = {
    chartSeed: dayNum, act: 1, cardLog: [], fame: 0, money: 50, hits: 0,
    stats: { burnout: 0, cred: 50, skill: 0 }, rival: 'vanta', instrument: 'kazoo',
    hustles: [], rivalry: 3,
  };
  const news = generateHeadlines(fakeState, 1)[0];
  if (news) s.append(el('p', 'title-news', `📰 ${news.text} <span>— ${news.src}</span>`));
  s.append(el('p', 'title-foot', `Runs: ${meta.runs} · Best fame: ${meta.best.fame} · Legacy: ${meta.lpEarnedTotal} LP`));
}

function btn(label, cls, onTap) {
  const b = el('button', 'btn ' + (cls || ''), label);
  b.addEventListener('click', () => { sfx.ui(); onTap(); });
  return b;
}

// ---------- Instrument select ----------

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function weekStr() {
  // ISO week label, e.g. 2026-W27
  const d = new Date();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0) + 1;
}

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
    const inst = instrumentById(chosenInst);
    if (!inst) return;
    sfx.commit();
    const lv = masteryLevel(inst.id);
    run = engine.newRun(inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta));
    engine.applyMastery(run, lv);
    run.seed = seed + 2;
    run.daily = daily ? todayStr() : null;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    if (chosenContract) engine.signContract(run, chosenContract);
    run.genre = chosenGenre;
    run.venue = chosenVenue;
    if (!daily) {
      // The nemesis returns: bias normal runs toward your most-faced rival
      const counts = meta.rivalCounts || {};
      const [topRival, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [null, 0];
      if (topRival && topCount >= 2 && Math.random() < 0.45) run.rival = topRival;
    }
    if (comeback) engine.applyComeback(run);
    run.nemesis = (meta.rivalCounts?.[run.rival] || 0) >= 2; // 3rd+ meeting
    save.saveRun(run);
    track('run_start', {
      instrument: inst.id, contract: chosenContract || 'none',
      genre: chosenGenre || 'none', venue: chosenVenue || 'none',
      mode: daily ? 'daily' : comeback ? 'comeback' : 'normal',
      mastery: lv, career_runs: meta.runs || 0,
    });
    dealCard();
  };

  const buildScreen = () => {
    const cMods = contractById(chosenContract)?.mods || {};
    const pool = cMods.forceInstrument
      ? [cMods.forceInstrument]
      : save.unlockedInstrumentIds(meta);
    const offered = engine.offerInstruments(pool, engine.mulberry32(seed));
    if (chosenInst && !offered.some((i) => i.id === chosenInst)) chosenInst = null;
    const keepScroll = s.scrollTop;
    s.innerHTML = '';
    s.append(el('h2', 'screen-head', comeback ? 'The Second Act' : daily ? `Daily Grind — ${todayStr()}` : 'Choose your weapon'));
    s.append(el('p', 'screen-sub', comeback
      ? 'You were somebody. Start famous, bruised, and 25% burned out already — the industry remembers you, which cuts both ways.'
      : daily
      ? 'Same run for everyone today: same instruments, same deck, same luck. Only the swipes are yours.'
      : 'Each one is almost useless. That’s the point.'));
    renderInstrumentRow(s, offered, chosenInst, (id) => { chosenInst = id; buildScreen(); });
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
    // Contract picker (Pass 9): optional clause, at most one
    const contracts = save.unlockedContractIds(meta).map((id) => contractById(id)).filter(Boolean);
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
    const inst = chosenInst ? instrumentById(chosenInst) : null;
    const bar = el('div', 'start-bar');
    const extras = [
      chosenVenue ? venueById(chosenVenue)?.icon : null,
      chosenGenre ? genreById(chosenGenre)?.icon : null,
      chosenContract ? contractById(chosenContract)?.icon : null,
    ].filter(Boolean).join(' ');
    const sb = btn(inst ? `▶ Start the run — ${inst.name}${extras ? ' · ' + extras : ''}` : 'Pick an instrument to start', inst ? 'primary' : '', beginRun);
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
    card.append(el('h3', '', inst.name + (lv ? ` <span class="mastery">${'★'.repeat(lv)}</span>` : '')));
    card.append(el('p', 'pick-flavor', inst.flavor));
    card.append(el('p', 'pick-mods', modsText(inst.modifiers) + (lv ? ` · Mastery +${lv} to all stats` : '')));
    card.append(el('p', 'pick-quirk', `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`));
    card.addEventListener('click', () => { sfx.ui(); onPick(inst.id); });
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
    .map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${STAT_META[k]?.name || k}`)
    .join(' · ');
}

function resumeRun() {
  if (run.phase === 'crossroads') renderCrossroads();
  else if (run.phase === 'finale') renderFinalSet();
  else dealCard();
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
    run = engine.newRun(inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta));
    engine.applyMastery(run, masteryLevel(inst.id));
    run.seed = seed + 2;
    run.gauntlet = week;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    run.genre = genre.id;
    engine.signContract(run, contract.id);
    save.saveRun(run);
    track('run_start', {
      instrument: inst.id, contract: contract.id,
      genre: genre.id, venue: 'none',
      mode: 'gauntlet', mastery: masteryLevel(inst.id), career_runs: meta.runs || 0,
    });
    dealCard();
  });
  sheet.append(card);
  s.append(sheet);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
  s.append(menu);
  show('#screen-instruments');
}

// ---------- Game screen ----------

function renderHud() {
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
  const top = el('div', 'hud-top');
  const actWrap = el('span', 'hud-act-wrap');
  actWrap.append(el('span', 'hud-act', run.tutorial
    ? 'FIRST GIG · The Rubber Room'
    : `ACT ${run.act} · ${['', 'The Garage', 'The Grind', 'The Reckoning'][run.act]}`));
  if (!run.tutorial) {
    const chartingN = (run.songs || []).filter((s) => s.status === 'charting' && s.pos).length;
    const chartBtn = el('button', 'chart-btn', chartingN ? `📈<span class="chart-badge">${chartingN}</span>` : '📈');
    chartBtn.addEventListener('click', () => { sfx.ui(); showChart(); });
    actWrap.append(chartBtn);
  }
  const helpBtn = el('button', 'chart-btn', '❓');
  helpBtn.addEventListener('click', () => { sfx.ui(); showHelp(); });
  actWrap.append(helpBtn);
  top.append(actWrap);
  const counters = el('span', 'hud-counters');
  if (run.encore > 0) counters.append(el('span', 'hud-encore', `🎇${run.encore > 1 ? '×' + run.encore : ''}`));
  if (run.pathProgress > 0 && run.path) counters.append(el('span', 'hud-momentum', `▲${run.pathProgress}`));
  counters.append(el('span', 'hud-fame', `★ ${run.fame}`));
  counters.append(el('span', 'hud-money' + (run.money < 0 ? ' neg' : ''), `$${run.money}`));
  if (run.path === 'hitfactory' || run.hits > 0) counters.append(el('span', 'hud-hits', `♪ ${run.hits} hit${run.hits === 1 ? '' : 's'}`));
  top.append(counters);
  hud.append(top);

  // U3: the hot streak is a visible thing you're riding
  if (!run.tutorial && (run.hotStreak || 0) >= CONFIG.hotStreakAt) {
    const roll = el('div', 'on-a-roll', `🔥 ON A ROLL ×${run.hotStreak} — the deck is showing you things`);
    hud.append(roll);
  }

  const rail = el('div', 'stat-rail');
  for (const key of ['skill', 'cred', 'creativity', 'network', 'burnout']) {
    const v = run.stats[key];
    const item = el('div', 'stat' + (key === 'burnout' ? ' stat-burnout' : ''));
    item.dataset.stat = key;
    item.addEventListener('click', () => { sfx.ui(); showInspectStat(key); });
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
    c.addEventListener('click', () => { sfx.ui(); showInspect(sheet); });
    gearRow.append(c);
  };
  const inst = instrumentById(run.instrument);
  chip('gear-chip inst-chip', inst.name, {
    art: inst.art, title: inst.name, lines: [
      inst.flavor, `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`,
      `Family: ${inst.family} — gear with a family requirement only works when it matches.`,
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
  for (const id of run.accessories) {
    const acc = accessoryById(id);
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
  return (acc.compatibility?.families || []).includes(instrumentById(run.instrument).family);
}

let currentCard = null;
let currentEvent = null; // the event behind currentCard (minigame lookup)
let encoreArmed = false;
let prevStats = null; // for stat-rail delta floaters

function vibrate(pattern) {
  if (meta.settings.haptics === false) return;
  try { navigator.vibrate?.(pattern); } catch (e) {}
}

// Floating +N/−N chips over the stat rail when values changed since last card
function spawnStatFloaters() {
  if (!prevStats || reducedMotion()) { prevStats = snapshotStats(); return; }
  const cur = snapshotStats();
  document.querySelectorAll('#hud .stat').forEach((item) => {
    const key = item.dataset.stat;
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

function spawnConfetti(host) {
  if (reducedMotion()) return;
  const box = el('div', 'confetti-box');
  for (let i = 0; i < 26; i++) {
    const p = el('span', 'confetti');
    p.style.left = 50 + (Math.random() * 40 - 20) + '%';
    p.style.background = `hsl(${Math.floor(Math.random() * 360)} 90% 65%)`;
    p.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
    p.style.setProperty('--dy', -(80 + Math.random() * 220) + 'px');
    p.style.setProperty('--rot', Math.floor(Math.random() * 720 - 360) + 'deg');
    p.style.animationDelay = (Math.random() * 0.12) + 's';
    box.append(p);
  }
  host.append(box);
  setTimeout(() => box.remove(), 1600);
}

function dealCard() {
  encoreArmed = false;
  show('#screen-game');
  // a lesson about the LAST card shouldn't float over the next one
  document.querySelector('.coach')?.remove();
  renderHud();
  catalogRadio.tick(run); // Stage C: a rich catalog starts scoring its own run
  spawnStatFloaters();
  const ev = engine.drawNextCard(run, engine.stateRng(run));
  if (!ev) { // deck ran dry — act ends early
    run.cardsPlayedInAct = engine.actLength(run, run.act);
    routeAdvance(engine.advance(run));
    return;
  }
  save.saveRun(run);

  const area = $('#card-area');
  area.innerHTML = '';

  const card = el('div', 'card' + (ev.flashpoint ? ' flashpoint' : ''));
  ambient(sceneFor(ev.art));
  if (ev.flashpoint) {
    // U2: the moment must be LEGIBLE — foil frame, sting, badge
    sfx.flashpoint();
    vibrate([20, 30, 20, 30, 60]);
    card.append(el('div', 'flashpoint-badge', '⚡ FLASHPOINT'));
  }
  card.append(artFor(ev.art, 'card-art', {
    fame: run.fame, network: run.stats.network, burnout: run.stats.burnout,
  }));
  card.append(el('div', 'card-context', fillText(ev.context)));
  // Some cards carry a richer text variant when the rival is a true
  // cross-run nemesis (3rd+ meeting) rather than an in-run feud.
  card.append(el('div', 'card-prompt', fillText(run.nemesis && ev.promptNemesis ? ev.promptNemesis : ev.prompt)));
  const hintL = el('div', 'swipe-hint hint-left', '');
  const hintR = el('div', 'swipe-hint hint-right', '');
  card.append(hintL, hintR);
  area.append(card);
  currentCard = card;
  currentEvent = ev;

  // Tap-friendly fallback buttons (spec §10/§12)
  const controls = $('#choice-buttons');
  controls.innerHTML = '';
  const bL = el('button', 'choice-btn choice-left');
  const bR = el('button', 'choice-btn choice-right');
  bL.addEventListener('click', () => commitSwipe('left'));
  bR.addEventListener('click', () => commitSwipe('right'));
  controls.append(bL, bR);

  // Risk dots recompute when an Encore is armed/disarmed.
  // The Imposter Syndrome contract hides them entirely.
  const hideRisk = !!contractById(run.contract)?.mods?.hideRisk;
  const dot = (o) => hideRisk ? '<span class="risk risk-hidden">?</span>' : riskDot(riskClass(o));
  const paintOdds = () => {
    const opts = { encore: encoreArmed };
    const oL = engine.choiceOdds(run, ev.choices.left, opts);
    const oR = engine.choiceOdds(run, ev.choices.right, opts);
    hintL.innerHTML = `${dot(oL)}${fillText(ev.choices.left.label)}`;
    hintR.innerHTML = `${fillText(ev.choices.right.label)}${dot(oR)}`;
    // Structured two-tier layout: a compact meta strip (direction, risk
    // tell, governing stats), then the label — long labels wrap cleanly
    // instead of scattering icons across lines.
    const mg = (c) => (c.minigame && meta.settings.minigames !== false && !run.tutorial ? '<span class="mg-flag">🎮</span>' : '');
    bL.innerHTML = `<span class="choice-meta"><span class="dir">◀</span>${dot(oL)}<span class="gov-row">${govIcons(ev.choices.left)}</span>${mg(ev.choices.left)}</span><span class="btn-label">${fillText(ev.choices.left.label)}</span>`;
    bR.innerHTML = `<span class="choice-meta"><span class="dir">▶</span>${dot(oR)}<span class="gov-row">${govIcons(ev.choices.right)}</span>${mg(ev.choices.right)}</span><span class="btn-label">${fillText(ev.choices.right.label)}</span>`;
  };
  paintOdds();

  // Encore arm toggle (Pass 2 mechanic)
  const encoreBar = $('#encore-bar');
  encoreBar.innerHTML = '';
  if ((run.encore || 0) > 0 && !contractById(run.contract)?.mods?.disableEncore) {
    const eb = el('button', 'encore-btn', `🎇 Encore ready — spend for a boosted roll`);
    eb.addEventListener('click', () => {
      encoreArmed = !encoreArmed;
      eb.classList.toggle('armed', encoreArmed);
      currentCard?.classList.toggle('encore-glow', encoreArmed);
      eb.textContent = encoreArmed
        ? '🎇 ENCORE ARMED — this swipe rolls hot'
        : '🎇 Encore ready — spend for a boosted roll';
      sfx.ui();
      paintOdds();
    });
    encoreBar.append(eb);
  }

  if (!reducedMotion()) {
    card.classList.add('deal-in');
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('deal-in')));
    attachDrag(card, bL, bR);
  } else {
    attachDrag(card, bL, bR); // drag still works, snap without spring
  }

  // Tutorial: each First Gig card carries its own one-concept coach mark
  if (run.tutorial && ev.coach) {
    run.coached = run.coached || [];
    if (!run.coached.includes(ev.id)) {
      run.coached.push(ev.id);
      coachMark(ev.coach);
    }
    return;
  }

  // First-run coaching (once per install)
  meta.coach = meta.coach || {};
  if (!run.tutorial && !meta.coach.card) {
    meta.coach.card = true;
    save.saveMeta(meta);
    coachMark('Drag the card left/right — or tap a button below. The colored dot is your <b>risk tell</b>. Tap ❓ up top anytime.');
  }
}

// Which stats a choice rolls against, as icons (primary bright, secondary dim)
function govIcons(choice) {
  const entries = Object.entries(choice.governingStats || {}).sort((a, b) => b[1] - a[1]);
  return entries.map(([k, w]) =>
    `<span class="gov${w >= 0.8 ? '' : ' gov-dim'}" title="${STAT_META[k]?.name || k}">${STAT_META[k]?.icon || ''}</span>`
  ).join('');
}

// Vague risk tell (spec §10): color + shape (colorblind-safe) from odds
const RISK_GLYPH = { 'risk-low': '●', 'risk-mid': '▲', 'risk-high': '■', 'risk-hot': '✦' };
function riskClass(odds) {
  if (odds.bad > 0.5) return 'risk-high';
  if (odds.bad > 0.18) return 'risk-mid';
  if (odds.incredible > 0.35) return 'risk-hot'; // spicy: big upside
  return 'risk-low';
}
function riskDot(cls) {
  return `<span class="risk ${cls}" aria-label="risk: ${cls.slice(5)}">${RISK_GLYPH[cls] || ''}</span>`;
}

function attachDrag(card, bL, bR) {
  let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false, pid = null;
  let samples = []; // recent (t, x) for flick-velocity detection
  const threshold = Math.min(110, window.innerWidth * 0.28);
  const FLICK_V = 0.45;   // px/ms — a confident flick commits early
  const FLICK_MIN = 24;   // but never off a near-tap

  card.addEventListener('pointerdown', (e) => {
    dragging = true;
    pid = e.pointerId;
    startX = e.clientX; startY = e.clientY;
    samples = [[performance.now(), e.clientX]];
    card.setPointerCapture(pid);
    card.classList.add('dragging');
  });
  card.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pid) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    const now = performance.now();
    samples.push([now, e.clientX]);
    while (samples.length > 2 && now - samples[0][0] > 90) samples.shift();
    if (!reducedMotion()) {
      card.style.transform =
        `translate3d(${dx}px, ${dy * 0.15}px, 0) rotate(${dx * 0.055}deg)`;
    }
    const t = Math.min(1, Math.abs(dx) / 70);
    card.querySelector('.hint-left').style.opacity = dx < 0 ? t : 0;
    card.querySelector('.hint-right').style.opacity = dx > 0 ? t : 0;
    const wasArmed = bL.classList.contains('armed') || bR.classList.contains('armed');
    bL.classList.toggle('armed', dx < -threshold);
    bR.classList.toggle('armed', dx > threshold);
    const isArmed = bL.classList.contains('armed') || bR.classList.contains('armed');
    if (isArmed && !wasArmed) vibrate(10); // tactile "past the point of no return"
  });
  const release = (e) => {
    if (!dragging || (pid !== null && e.pointerId !== pid)) return;
    dragging = false;
    card.classList.remove('dragging');
    bL.classList.remove('armed');
    bR.classList.remove('armed');
    // flick velocity over the last ~90ms of the gesture
    let v = 0;
    if (samples.length >= 2) {
      const [t0, x0] = samples[0];
      const [t1, x1] = samples[samples.length - 1];
      if (t1 > t0) v = (x1 - x0) / (t1 - t0);
    }
    const flick = Math.abs(v) >= FLICK_V && Math.abs(dx) >= FLICK_MIN && Math.sign(v) === Math.sign(dx);
    if (Math.abs(dx) > threshold || flick) {
      commitSwipe(dx < 0 ? 'left' : 'right', dx, dy);
    } else {
      card.style.transform = '';
      card.querySelector('.hint-left').style.opacity = 0;
      card.querySelector('.hint-right').style.opacity = 0;
    }
    dx = 0; dy = 0;
  };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
}

function commitSwipe(side, dx = 0, dy = 0) {
  if (!currentCard) return;
  // Flagship choices carry a minigame: your performance becomes the bonus.
  const mgId = currentEvent?.choices?.[side]?.minigame;
  if (mgId && minigameById(mgId) && meta.settings.minigames !== false && !run.tutorial) {
    const card = currentCard;
    currentCard = null; // freeze the card while the minigame runs
    card.style.transform = ''; // snap back from any drag offset
    const mgMods = contractById(run.contract)?.mods || {};
    playMinigame(mgId, { run, rivalName: rivalById(run.rival)?.name, noSkip: !!mgMods.forceMinigames, relaxed: meta.settings.relaxedMinigames === true }).then(({ score, verdict, detail }) => {
      // instrument hook: some gear makes performance moments play easier
      const mgHook = score == null ? 0 : (instrumentById(run.instrument)?.quirk?.hooks?.mgBonus || 0);
      let bonus = verdict.bonus + mgHook;
      // The Showman's Pact: botching on stage, under contract, hurts double
      if (verdict.label === 'BOTCHED' && mgMods.mgBotchDouble) bonus = verdict.bonus * 2;
      track('minigame', { id: mgId, card: currentEvent?.id, score, bonus, skipped: score == null });
      if (score != null) {
        meta.minigamesPlayed = meta.minigamesPlayed || {};
        meta.minigamesPlayed[mgId] = (meta.minigamesPlayed[mgId] || 0) + 1;
        if (verdict.label === 'GOLDEN') meta.mgGolden = (meta.mgGolden || 0) + 1;
        save.saveMeta(meta);
      }
      currentCard = card; // hand back for the normal path
      finishSwipe(side, dx, dy, score != null ? { id: mgId, ...verdict, bonus, detail } : null);
    });
    return;
  }
  finishSwipe(side, dx, dy, null);
}

function finishSwipe(side, dx = 0, dy = 0, perf = null) {
  if (!currentCard) return;
  const card = currentCard;
  currentCard = null;
  sfx.swipe();

  const armed = encoreArmed;
  const result = engine.resolveSwipe(run, side, engine.stateRng(run), {
    encore: encoreArmed, bonus: perf?.bonus || 0,
    mgDetail: perf ? { label: perf.label, hooks: perf.detail?.hooks } : null,
  });
  if (perf) {
    result.minigameInfo = perf;
    const logEntry = run.cardLog?.[run.cardLog.length - 1];
    if (logEntry) logEntry.m = perf.label; // the scrapbook remembers the performance
    // skill echoes: standout performances enter the fiction as flags
    if (perf.label === 'GOLDEN' && !run.flags.includes('mg_golden')) run.flags.push('mg_golden');
    if (perf.label === 'GOLDEN' && run.stats.burnout >= 60 && !run.flags.includes('mg_steady')) run.flags.push('mg_steady');
    if (perf.label === 'BOTCHED' && !run.flags.includes('mg_botched')) run.flags.push('mg_botched');
  }
  track('swipe', {
    card: result.event?.id, side, tier: result.tier,
    act: run.act, path: run.path || null, tutorial: !!run.tutorial,
    encore_armed: armed, burnout: run.stats.burnout,
  });
  // Personal novelty ledger (R2): remember what this player has seen so
  // future decks steer toward what they haven't.
  if (!run.tutorial && result.event) {
    meta.seenCards = meta.seenCards || [];
    if (!meta.seenCards.includes(result.event.id)) {
      meta.seenCards.push(result.event.id);
      if (meta.seenCards.length > CONFIG.seenCardsCap) {
        meta.seenCards = meta.seenCards.slice(-CONFIG.seenCardsCap);
      }
      save.saveMeta(meta);
    }
  }
  encoreArmed = false;
  $('#encore-bar').innerHTML = '';
  save.saveRun(run);

  const fly = () => showResult(result);
  if (reducedMotion()) {
    card.style.opacity = '0';
    setTimeout(fly, 120);
  } else {
    const off = (side === 'left' ? -1 : 1) * (window.innerWidth * 1.1);
    card.style.transition = 'transform .38s cubic-bezier(.2,.7,.3,1), opacity .38s';
    card.style.transform = `translate3d(${off}px, ${dy * 0.4}px, 0) rotate(${(side === 'left' ? -1 : 1) * 24}deg)`;
    card.style.opacity = '0';
    setTimeout(fly, 240);
  }
}

// ---------- Inspector (Pass 30): tap any chip or stat ----------

const STAT_INFO = {
  skill: 'Raw musicianship. Feeds the <b>Studio Legend</b> gate and steadies live/studio choices.',
  cred: 'Industry respect — the floor under every path. Hits 0 in Act 2+ and you’re cancelled.',
  creativity: 'Original ideas. Feeds the <b>Hit Factory</b> gate and weird/indie choices.',
  network: 'Who owes you a favor. Feeds the <b>Megastar</b> gate and every deal.',
  burnout: 'The danger stat. Every point drags all rolls down; at 100 you quit music for a fintech. Rest cards and coping moments push it back.',
};

function showInspect(sheet) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  const box = el('div', 'result-card');
  box.append(el('div', 'tier-badge', 'INSPECT'));
  if (sheet.art) box.append(artFor(sheet.art, 'inspect-art'));
  box.append(el('p', 'result-text', `${sheet.emoji ? sheet.emoji + ' ' : ''}<b>${sheet.title}</b>`));
  for (const line of sheet.lines || []) box.append(el('p', 'gear-blurb', line));
  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  const done = () => { ov.classList.remove('active'); ov.removeEventListener('click', done); };
  setTimeout(() => ov.addEventListener('click', done), 200);
}

function showInspectStat(key) {
  showInspect({
    emoji: STAT_META[key].icon,
    title: `${STAT_META[key].name}: ${run.stats[key]}`,
    lines: [STAT_INFO[key]],
  });
}

// ---------- Help sheet + first-run coach marks (Pass 12) ----------

function showHelp() {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
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
  box.append(el('p', 'help-block',
    '🔥 <b>Burnout</b> is the danger stat: it drags every roll down and ends your career at 100. Rest is a real decision.'));
  box.append(el('p', 'help-block',
    '🎇 Rolling an INCREDIBLE banks an <b>Encore</b> — arm it later to boost the swipe that matters.'));
  box.append(el('p', 'help-block',
    '▲ <b>Momentum</b> from big wins can push a near-miss finale over the line. ★ Fame and $ money are score and fuel, not stats.'));
  box.append(el('p', 'tap-hint', 'tap to close'));
  ov.append(box);
  const done = () => { ov.classList.remove('active'); ov.removeEventListener('click', done); };
  setTimeout(() => ov.addEventListener('click', done), 200);
}

// Coach marks stay up until the player taps them — reading speed is the
// player's business, not a timer's. A new card clears any stale mark.
function coachMark(text) {
  if (!$('#screen-game').classList.contains('active')) return;
  const old = document.querySelector('.coach');
  if (old) old.remove();
  const c = el('div', 'coach', text + '<span class="coach-x">tap to dismiss</span>');
  c.addEventListener('click', () => c.remove());
  $('#screen-game').append(c);
}

// ---------- The Hot 10 chart overlay (Pass 6) ----------

function showChart() {
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
  const songs = (engine.ensureSongs(run) || []).slice().reverse();
  if (songs.length) {
    box.append(el('div', 'trades-head songbook-head', '♪ YOUR SONGBOOK'));
    const book = el('div', 'songbook');
    for (const s of songs) {
      const row = el('div', 'songbook-row sb-' + s.status + (s.crowned ? ' sb-crowned' : ''));
      // ♪ hear it: every song is renderable from its fingerprint
      const play = el('button', 'sb-play', songPlayer.playingKey === songKey(s) ? '⏸' : '▶');
      play.dataset.songkey = songKey(s);
      play.addEventListener('click', (e) => {
        e.stopPropagation();
        sfx.ui();
        songPlayer.play(s);
      });
      row.append(play);
      let state;
      if (s.crowned) state = `👑 HIT — peaked #${s.peak}`;
      else if (s.status === 'charting' && s.pos) state = `charting #${s.pos} · wk ${s.weeks}${s.peak && s.peak < s.pos ? ` · peak #${s.peak}` : ''}`;
      else if (s.status === 'charting') state = 'shipped — off the chart';
      else if (s.status === 'faded') state = s.peak ? `faded — peaked #${s.peak}, ${s.weeks} wk${s.weeks === 1 ? '' : 's'}` : 'faded — never charted';
      else state = s.quality >= 68 ? 'demo — might be undeniable' : s.quality >= 52 ? 'demo — something’s there' : s.quality >= 38 ? 'demo — rough but honest' : 'demo — it exists';
      row.append(el('b', '', `“${s.title}”`));
      row.append(el('span', 'sb-state', state));
      // tap a song to unfold its biography
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
  setTimeout(() => ov.addEventListener('click', done), 200);
  save.saveRun(run); // chartTitles may have been generated
}

// ---------- Result overlay ----------

const TIER_LABEL = {
  bad: 'BAD', good: 'GOOD', incredible: 'INCREDIBLE', declined: 'DECLINED',
};

function showResult(result) {
  if (result.tier === 'incredible') { sfx.incredible(); vibrate([30, 40, 30, 40, 60]); }
  else if (result.tier === 'good') sfx.good();
  else { sfx.bad(); vibrate(80); }

  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');

  const box = el('div', `result-card tier-${result.tier}`);
  if (result.tier === 'incredible') spawnConfetti(ov);
  if ((result.tier === 'bad' || result.tier === 'declined') && !reducedMotion()) {
    box.classList.add('shake');
    ov.classList.add('flash-bad');
    setTimeout(() => ov.classList.remove('flash-bad'), 500);
  }
  box.append(el('div', 'tier-badge', TIER_LABEL[result.tier]));
  box.append(el('p', 'result-text', fillText(result.text)));

  // Numeric stat deltas: compact uniform chips.
  const chips = el('div', 'delta-chips');
  for (const d of result.deltas) {
    chips.append(deltaChip(d.key, d.amount));
  }
  box.append(chips);

  // Everything with a sentence to say gets a full-width notice row —
  // long text wraps inside its own row instead of a distorted pill.
  const notices = el('div', 'result-notices');
  const notice = (cls, html) => notices.append(el('div', `notice ${cls}`, html));
  if (result.minigameInfo) {
    const m = result.minigameInfo;
    notice(m.bonus >= 0 ? 'notice-good' : 'notice-bad',
      `🎮 Performance: <b>${m.label}</b> — ${m.bonus >= 0 ? '+' : ''}${m.bonus} on that roll`);
  }
  if (result.encoreRefunded) notice('notice-encore', '🔥🎇 <b>ENCORE REFUNDED</b> — you spent it ON A ROLL and it came back');
  else if (result.encoreSpent) notice('notice-encore', '🎇 Encore spent — that roll was boosted');
  if (result.encoreEarned) notice('notice-encore', '🎇 <b>Encore earned</b> — bank it for the right card');
  if (!result.streakWasHot && (result.hotStreak || 0) === CONFIG.hotStreakAt && !run.tutorial) {
    notice('notice-encore', '🔥 <b>ON A ROLL</b> — three clean cards straight. While it lasts, the deck deals what you’ve never seen.');
  }
  if (result.gearLost) notice('notice-bad', `🧰 <b>${result.gearLost.name}</b> — lost!`);
  if (result.venueLeveled) notice('notice-gear', `${result.venueLeveled.venue.icon} <b>${result.venueLeveled.venue.name}</b> levels up: ${result.venueLeveled.tier.name}`);
  else if (result.venueHosted) notice('notice-good', `${result.venueHosted.venue.icon} Home crowd: +${result.venueHosted.tier.showBonus} on that roll`);
  for (const p of result.promisesKept || []) notice('notice-good', `🤞 <b>Promise kept:</b> ${p.label}`);
  for (const p of result.promisesBroken || []) notice('notice-bad', `💔 <b>Promise broken:</b> ${p.label}`);
  if (result.promiseMade) notice('notice-gear', `🤞 <b>Promised:</b> ${result.promiseMade.label} — ${result.promiseMade.cards} cards to deliver`);
  const joined = result.deltas.bandmateJoined;
  if (joined) notice('notice-gear', `${joined.icon} <b>${joined.name}</b> (${joined.role}) joins the band — ${joined.quirkDesc}`);
  if (result.deltas.bandmateLeft) notice('notice-bad', `${result.deltas.bandmateLeft.icon} <b>${result.deltas.bandmateLeft.name}</b> quits the band`);
  const hustle = result.deltas.hustleGained;
  if (hustle) notice('notice-gear', `${hustle.icon} <b>Side hustle: ${hustle.name}</b> (+$${hustle.moneyPerAct}/act)${hustle.blurb ? ' — ' + hustle.blurb : ''}`);
  const newInst = result.deltas.instrumentSet;
  if (newInst) notice('notice-gear', `🎸 <b>Now playing: ${newInst.name}</b> — <b>${newInst.quirk.name}:</b> ${newInst.quirk.desc}`);
  if (result.deltas.albumOut) {
    const n = result.deltas.albumOut.tracks;
    notice('notice-encore', `💿 <b>THE ALBUM IS OUT</b> — ${n ? `${n} vault song${n > 1 ? 's' : ''} ship at once` : 'the catalog gets the halo'} and every charting song feels it`);
  }
  const sh = result.deltas.songHyped;
  if (sh) notice('notice-good', `📣 <b>“${sh.title}”</b> is everywhere this week — hype ${sh.gain >= 0 ? '+' + sh.gain : sh.gain} (next chart week will show it)`);
  const sp = result.deltas.songPolished;
  if (sp) notice('notice-good', `🎛 <b>“${sp.title}”</b> gets better in the vault — the mix tightens (quality ${sp.quality})`);
  const sw = result.deltas.songWritten;
  if (sw) {
    const feel = sw.quality >= 68 ? 'it might be undeniable' : sw.quality >= 52 ? 'something’s there'
      : sw.quality >= 38 ? 'rough, but honest' : 'well… it exists';
    notice('notice-good', `🎙 <b>Demo taped: “${sw.title}”</b>${sw.fromHook ? ' <i>(that hook you grabbed)</i>' : ''} — ${feel}`);
  }
  for (const sd of result.deltas.songDebuts || []) {
    if (sd.viral) notice('notice-viral', `🌋 <b>OVERNIGHT VIRAL</b> — “${sd.title}” detonates on release and debuts at <b>#${sd.pos}</b>${sd.hit ? ' — instant HIT 👑' : ''}. Nobody can explain it. Nobody wants to.`);
    else if (sd.hit) notice('notice-encore', `👑 <b>“${sd.title}”</b> enters the Hot 10 at <b>#${sd.pos}</b> — instant HIT`);
    else if (sd.pos) notice('notice-good', `♪ <b>“${sd.title}”</b> debuts at <b>#${sd.pos}</b> on the Hot 10`);
    else notice('notice-bad', `♪ <b>“${sd.title}”</b> ships… and misses the Hot 10. For now, hype can bring it back.`);
  }
  if ((result.deltas.songDebuts || []).some((sd) => sd.viral)) { spawnConfetti(ov); sfx.win(); }
  box.append(notices);

  // Shop shelf: choose which item you actually bought (Pass 33)
  const shelf = result.deltas.pendingGearChoices;
  if (shelf?.length) {
    box.append(el('p', 'gear-blurb', '🧰 The shelf — pick one:'));
    const list = el('div', 'gear-choices');
    for (const acc of shelf) {
      list.append(btn(`${acc.name} — ${acc.blurb}`, '', () => {
        ov.classList.remove('active');
        if (run.accessories.length < CONFIG.accessorySlots) {
          engine.equipAccessory(run, acc.id);
          save.saveRun(run);
          routeAdvance(engine.advance(run));
        } else {
          gearChooser(acc, result);
        }
      }));
    }
    box.append(list);
    ov.append(box);
    if (result.deltas.some((d) => d.key === 'money' && d.amount > 0)) sfx.cash();
    return; // wait for the shelf pick
  }

  // Gear gained?
  const pending = result.deltas.pendingGear;
  if (pending) {
    if (run.accessories.length < CONFIG.accessorySlots) {
      const extra = engine.equipAccessory(run, pending.id) || [];
      save.saveRun(run);
      for (const d of extra) chips.append(deltaChip(d.key, d.amount));
      notice('notice-gear', `🧰 <b>${pending.name}</b> is yours${pending.blurb ? ' — ' + pending.blurb : ''}`);
    } else {
      box.append(el('p', 'gear-blurb', `🧰 <b>${pending.name}</b> is yours — but your ${CONFIG.accessorySlots} slots are full.`));
      box.append(btn('Choose what to keep', 'primary', () => {
        ov.classList.remove('active');
        gearChooser(pending, result);
      }));
      ov.append(box);
      if (result.deltas.some((d) => d.key === 'money' && d.amount > 0)) sfx.cash();
      return; // wait for chooser
    }
  }

  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  if (result.deltas.some((d) => d.key === 'money' && d.amount > 0)) sfx.cash();

  const done = () => {
    ov.classList.remove('active');
    ov.removeEventListener('click', done);
    routeAdvance(engine.advance(run));
    meta.coach = meta.coach || {};
    if (!run.tutorial && !meta.coach.result) {
      meta.coach.result = true;
      save.saveMeta(meta);
      coachMark('Outcomes have three tiers — your stats and gear tilt the roll. Build what your path needs; watch 🔥 Burnout.');
    }
  };
  setTimeout(() => ov.addEventListener('click', done), 250);
}

function deltaChip(key, amount) {
  const sign = amount > 0 ? '+' : '';
  if (key === 'rivalry') {
    const r = rivalById(run.rival);
    const nemesis = (meta.rivalCounts?.[run.rival] || 0) >= 3;
    return el('span', 'chip chip-rival',
      `⚔ ${amount > 0 ? 'Feud with' : 'Peace with'} ${nemesis ? 'your nemesis ' : ''}${r.name} ${sign}${amount}`);
  }
  const goodDelta = key === 'burnout' ? amount < 0 : amount > 0;
  if (key === 'money') {
    return el('span', 'chip ' + (goodDelta ? 'chip-good' : 'chip-bad'),
      `${amount > 0 ? '+' : '−'}$${Math.abs(amount)}`);
  }
  const label = key === 'fame' ? 'Fame' : key === 'hits' ? 'Hit!'
    : key === 'pathProgress' ? 'Momentum' : (STAT_META[key]?.name || key);
  const icon = key === 'fame' ? '★' : key === 'hits' ? '♪'
    : key === 'pathProgress' ? '▲' : (STAT_META[key]?.icon || '');
  return el('span', 'chip ' + (goodDelta ? 'chip-good' : 'chip-bad'),
    `${icon} ${sign}${amount} ${label}`);
}

function gearChooser(newAcc, result) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  const box = el('div', 'result-card');
  box.append(el('div', 'tier-badge', 'GEAR FULL'));
  box.append(el('p', 'result-text', `Swap something out for the <b>${newAcc.name}</b>?`));
  const list = el('div', 'gear-choices');
  for (const id of run.accessories) {
    const acc = accessoryById(id);
    list.append(btn(`Drop ${acc.name}`, '', () => {
      engine.equipAccessory(run, newAcc.id, id);
      save.saveRun(run);
      ov.classList.remove('active');
      routeAdvance(engine.advance(run));
    }));
  }
  list.append(btn(`Leave the ${newAcc.name} behind`, 'ghost', () => {
    ov.classList.remove('active');
    routeAdvance(engine.advance(run));
  }));
  box.append(list);
  ov.append(box);
}

// ---------- Flow routing ----------

function routeAdvance(step) {
  save.saveRun(run);
  switch (step.kind) {
    case 'card': dealCard(); break;
    case 'crossroads': renderCrossroads(); break;
    case 'actStart':
      // The Brammies (Pass 44): awards night before the final act,
      // if you've made enough noise to be nominated
      if (step.act === 3 && run.fame >= 25 && !run.brammy) showBrammies(step);
      else actInterstitial(step);
      break;
    case 'finale': renderFinalSet(); break;
    case 'gameover': renderGameOver(step.endingKey); break;
    case 'tutorialEnd': renderTutorialEnd(); break;
  }
}

function startTutorial() {
  const seed = Math.floor(Math.random() * 1e9) + 1;
  run = engine.newTutorialRun(engine.mulberry32(seed));
  run.seed = seed + 2;
  save.saveRun(run);
  track('tutorial_start', { replay: !!meta.tutorialDone });
  dealCard();
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
  wrap.append(artFor('ev_tut_set', 'ending-art', { fame: 12, network: 40, burnout: 10 }));
  wrap.append(el('div', 'verdict verdict-success', 'SOUNDCHECK COMPLETE'));
  wrap.append(el('h2', 'ending-title', 'The First Gig'));
  wrap.append(el('p', 'ending-text',
    'Nineteen people, four of them on purpose, and nobody left. Dee flips the clipboard shut: “Tuesday’s yours if you want it.” That’s the whole tutorial — the career ahead is longer, meaner, and much funnier.'));
  const list = el('div', 'result-notices');
  const lessons = [
    ['notice-gear', '👆 <b>Swipe or tap</b> — every card is one decision, left or right.'],
    ['notice-gear', '🎸 <b>Stat icons</b> on a choice show what it rolls against. Build what your path needs.'],
    ['notice-gear', '<b>The risk tell</b> — ● safe · ▲ dicey · ■ likely bad · ✦ big upside. Read it before you leap.'],
    ['notice-bad', '🔥 <b>Burnout</b> drags every roll and ends careers at 100. Rest is a real move.'],
    ['notice-encore', '🎇 <b>Encores</b> — an INCREDIBLE banks one; arm it on the card that matters.'],
  ];
  for (const [cls, html] of lessons) list.append(el('div', 'notice ' + cls, html));
  wrap.append(list);
  if (firstTime) wrap.append(el('p', 'lp-award', '+15 Legacy Points — walk-in money for the Career Wall'));
  const menu = el('div', 'menu');
  menu.append(btn('▶ Start your real career', 'primary', () => startNewRun()));
  menu.append(btn('🏠 Title', '', () => { renderTitle(); show('#screen-title'); }));
  wrap.append(menu);
  s.append(wrap);
  show('#screen-ending');
}

// ---------- The Brammies (Pass 44) ----------
// Procedural awards night: you're nominated against your rival and two
// chart acts. You pick what to PREPARE; the seeded outcome pays off
// against your preparation.

function showBrammies(step) {
  const rng = engine.mulberry32((run.chartSeed || 1) * 7 + 44);
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
    const ov = $('#overlay');
    ov.innerHTML = '';
    ov.classList.add('active');
    const box = el('div', `result-card tier-${youWin ? 'incredible' : 'good'}`);
    if (youWin) { spawnConfetti(ov); sfx.win(); } else sfx.good();
    box.append(el('div', 'tier-badge', youWin ? 'AND THE BRAMMY GOES TO... YOU' : `AND THE BRAMMY GOES TO... ${rival.name.toUpperCase()}`));
    box.append(el('p', 'result-text', text));
    box.append(el('p', 'pick-mods', deltas));
    box.append(el('p', 'tap-hint', 'tap to continue'));
    ov.append(box);
    const done = () => {
      ov.classList.remove('active');
      ov.removeEventListener('click', done);
      actInterstitial(step);
      show('#screen-game');
    };
    setTimeout(() => ov.addEventListener('click', done), 300);
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

// What one closer does to the win gates, in plain language.
function closerImpact(opt) {
  const gates = CONFIG.winGates[run.path] || {};
  const pathName = run.path ? PATHS[run.path].name : 'your path';

  if (opt.stat === 'pathProgress') {
    const cur = run.pathProgress || 0;
    const after = cur + opt.amount;
    const allNear = pathFit(run.path).readings.every((r) => r.ratio >= CONFIG.nearMissRatio);
    if (after >= CONFIG.momentumForUpgrade && allNear) {
      return { text: `Momentum ${cur}→${after}. Every gate is near-met — this can upgrade a Partial to a SUCCESS.`, clutch: true };
    }
    if (allNear) {
      return { text: `Momentum ${cur}→${after}. Gates are close, but you need ${CONFIG.momentumForUpgrade}+ Momentum to force the upgrade.`, clutch: false };
    }
    return { text: `Momentum ${cur}→${after}. Only clutches a win when EVERY gate is ≥85% — some aren't yet.`, clutch: false };
  }

  if (opt.stat === 'money') {
    return { text: `Money isn't a win gate — but it clears debt (no Curtis ending) and pads your Legacy Points.`, clutch: false };
  }

  const statName = opt.stat === 'fame' ? 'Fame' : STAT_META[opt.stat].name;
  const cur = opt.stat === 'fame' ? run.fame : run.stats[opt.stat];
  const after = opt.stat === 'fame' ? cur + opt.amount : Math.min(100, cur + opt.amount);
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
    apply: () => { run.fame += 5; if (hit) { hit.hype = Math.min(100, hit.hype + 25); run.finalCloser = hit.id; } },
  });
  // a great unreleased demo can debut LIVE as your closer — it enters the
  // chart in the finale's last tick, and might even crown
  const vault = (run.songs || []).filter((x) => x.status === 'demo').sort((a, b) => b.quality - a.quality)[0];
  if (vault && vault.quality >= 55) {
    options.push({
      title: `“${vault.title}” (unreleased)`,
      blurb: 'Debut the vault song. Right now. Live. Careers should end on a first.',
      stat: 'cred', amount: 3, label: '+3 Cred · releases it tonight',
      apply: () => { run.stats.cred = Math.min(100, run.stats.cred + 3); engine.releaseSong(run, vault.id, 58); run.finalCloser = vault.id; },
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

  const s = $('#screen-crossroads'); // reuse the 3-option screen
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Final Set'));
  const pathName = run.path ? PATHS[run.path].name : 'your path';
  s.append(el('p', 'screen-sub', `Last night of the run — your <b>${pathName}</b> career gets judged after this. Pick the closer that pushes you over a gate.`));

  // Gate readout for the committed path, so the choice is informed
  const { readings } = pathFit(run.path);
  const gates = el('div', 'gate-readout compass finalset-gates');
  gates.append(el('div', 'trades-head', `🎯 ${pathName.toUpperCase()} — WHAT YOU STILL NEED`));
  for (const r of readings) {
    const grow = el('div', 'gate-row' + (r.value >= r.target ? ' met' : ''));
    const name = r.key === 'fame' ? 'Fame' : r.key === 'hits' ? 'Hits' : STAT_META[r.key].name;
    grow.append(el('span', 'gate-name', `${r.value >= r.target ? '✓' : '✗'} ${name}`));
    const bar = el('div', 'gate-bar');
    const fill = el('div', 'gate-fill');
    fill.style.width = `${Math.round(r.ratio * 100)}%`;
    bar.append(fill);
    grow.append(bar);
    grow.append(el('span', 'gate-nums', `${r.value}/${r.target}`));
    gates.append(grow);
  }
  if ((run.pathProgress || 0) > 0) {
    gates.append(el('p', 'momentum-note', `▲ Momentum ×${run.pathProgress} — near-met gates can still upgrade to a win.`));
  }
  s.append(gates);

  const row = el('div', 'pick-row');
  for (const opt of options.slice(0, 3)) {
    const impact = closerImpact(opt);
    const card = el('div', 'pick-card path-card' + (impact.clutch ? ' clutch' : ''));
    card.append(el('div', 'path-icon', impact.clutch ? '🏆' : '🎵'));
    const head = el('h3', '', opt.title);
    if (impact.clutch) head.innerHTML += ' <span class="clutch-badge">clutch</span>';
    card.append(head);
    card.append(el('p', 'pick-flavor', opt.blurb));
    card.append(el('p', 'pick-mods', opt.label));
    card.append(el('p', 'closer-impact' + (impact.clutch ? ' clutch' : ''), impact.text));
    card.addEventListener('click', () => {
      sfx.commit();
      opt.apply();
      renderFinale();
    });
    row.append(card);
  }
  s.append(row);
  show('#screen-crossroads');
}

function actInterstitial(step) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  const box = el('div', 'result-card act-card');
  box.append(el('div', 'tier-badge', `ACT ${step.act}`));
  box.append(el('p', 'result-text act-name', step.act === 2 ? 'THE GRIND' : 'THE RECKONING'));
  box.append(el('p', 'result-text', step.act === 2
    ? 'The garage is behind you. Everything now costs something.'
    : 'Higher stakes, fewer excuses. The summit is visible. So is the drop.'));
  for (const n of step.notes || []) {
    if (n.startsWith('♪')) continue; // chart news gets its own stage below
    if (n.startsWith('✂️') || n.startsWith('➕')) {
      // U5: the act twist is a headline, not a line item
      box.append(el('p', 'act-twist-note', n));
      continue;
    }
    box.append(el('p', 'upkeep-note', `💸 ${n}`));
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

  // The Trades: procedural press about YOUR run (Pass 14)
  const headlines = generateHeadlines(run, 2);
  if (headlines.length) {
    const paper = el('div', 'trades');
    paper.append(el('div', 'trades-head', '📰 MEANWHILE, IN THE TRADES'));
    for (const h of headlines) {
      paper.append(el('div', 'trades-row', `<b>${h.text}</b><span>— ${h.src}</span>`));
    }
    box.append(paper);
  }
  // The inbox: people from your run remember you (Pass 22)
  const dms = generateDMs(run, 2);
  if (dms.length) {
    const inbox = el('div', 'inbox');
    inbox.append(el('div', 'trades-head', '💬 YOUR PHONE, MEANWHILE'));
    for (const dm of dms) {
      const bubble = el('div', 'dm-bubble');
      bubble.append(el('div', 'dm-from', dm.from));
      bubble.append(el('div', 'dm-text', dm.text));
      inbox.append(bubble);
    }
    box.append(inbox);
  }
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  if (crowns.length) { spawnConfetti(ov); sfx.win(); vibrate([30, 40, 30, 40, 80]); }
  // Stage C: the act break plays YOUR song under the reveal (if the
  // catalog has earned it — otherwise the lo-fi score carries on)
  if (week && week.moves.length) catalogDJ.actBreak(run);
  const done = () => {
    ov.classList.remove('active');
    ov.removeEventListener('click', done);
    dealCard();
  };
  setTimeout(() => ov.addEventListener('click', done), 250);
}

// ---------- Crossroads (spec §7.2) ----------

function pathFit(pathId) {
  const gates = CONFIG.winGates[pathId];
  const readings = Object.entries(gates).map(([key, target]) => {
    const value = key === 'fame' ? run.fame : key === 'hits' ? run.hits : run.stats[key];
    return { key, target, value, ratio: Math.min(1, value / target) };
  });
  const fit = readings.reduce((s, r) => s + r.ratio, 0) / readings.length;
  return { readings, fit };
}

function renderCrossroads() {
  run.phase = 'crossroads';
  save.saveRun(run);
  const s = $('#screen-crossroads');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Crossroads'));
  s.append(el('p', 'screen-sub', 'Act 1 is over. Pick a summit — the deck follows your choice. No refunds. The bars show how your build lines up with each gate <i>right now</i>.'));
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
    const gates = el('div', 'gate-readout compass');
    for (const r of readings) {
      const grow = el('div', 'gate-row' + (r.value >= r.target ? ' met' : ''));
      const name = r.key === 'fame' ? 'Fame' : r.key === 'hits' ? 'Hits' : STAT_META[r.key].name;
      grow.append(el('span', 'gate-name', name));
      const bar = el('div', 'gate-bar');
      const fill = el('div', 'gate-fill');
      fill.style.width = `${Math.round(r.ratio * 100)}%`;
      bar.append(fill);
      grow.append(bar);
      grow.append(el('span', 'gate-nums', `${r.value}/${r.target}`));
      gates.append(grow);
    }
    card.append(gates);
    card.addEventListener('click', () => {
      sfx.commit();
      const notes = engine.commitPath(run, p.id);
      save.saveRun(run);
      actInterstitial({ kind: 'actStart', act: 2, notes });
      show('#screen-game');
    });
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
  meta.best.fame = Math.max(meta.best.fame, summary.fame);
  meta.best.lp = Math.max(meta.best.lp, lp);
  if (summary.daily) {
    meta.dailyResults = meta.dailyResults || {};
    if (!meta.dailyResults[summary.daily]) {
      meta.dailyResults[summary.daily] = { result: summary.result, path: summary.path, fame: summary.fame };
    }
  }
  if (summary.gauntlet) {
    meta.gauntletResults = meta.gauntletResults || {};
    if (!meta.gauntletResults[summary.gauntlet]) {
      meta.gauntletResults[summary.gauntlet] = { result: summary.result, path: summary.path, fame: summary.fame };
    }
  }
  // Lifetime aggregates (Pass 25)
  const lt = meta.lifetime = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byInstrument: {}, byPath: {}, hits: 0, moneyBest: 0 };
  lt.swipes += (summary.tierLog || []).length;
  lt.incredibles += (summary.tierLog || []).filter((t) => t === 'incredible').length;
  lt.bads += (summary.tierLog || []).filter((t) => t === 'bad').length;
  lt.hits += summary.hits || 0;
  lt.moneyBest = Math.max(lt.moneyBest, summary.money);
  const bi = lt.byInstrument[summary.instrument] = lt.byInstrument[summary.instrument] || { runs: 0, wins: 0 };
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
    instrument: summary.instrument,
    path: summary.path,
    result: summary.result,
    endingKey: summary.endingKey,
    fame: summary.fame,
    daily: !!summary.daily,
    // Audible songs §5.4: store the fingerprints, not the audio — every
    // past career stays re-renderable forever from a handful of strings
    songs: (summary.songs || []).slice(0, 12).map((s) => ({
      id: s.id, title: s.title, genre: s.genre ?? null, instrument: s.instrument ?? null,
      hook: s.hook ?? null, verdict: s.verdict ?? null,
      status: s.status, crowned: !!s.crowned, peak: s.peak ?? null,
    })),
  });
  meta.runHistory = meta.runHistory.slice(0, 10);

  const earned = [];
  const specials = {
    all_paths: () => ['megastar', 'studio', 'hitfactory'].every((p) => meta.successPaths.includes(p)),
    daily_3: () => Object.keys(meta.dailyResults || {}).length >= 3,
    wall_5: () => meta.unlockedWall.length >= 5,
    mastery_3: () => Object.values(meta.lifetime?.byInstrument || {})
      .some((st) => Math.min(3, Math.floor(st.runs / 2) + st.wins) >= 3),
    exits_3: () => (meta.exitSeen || []).length >= 3,
    nemesis_3: () => Object.values(meta.rivalCounts || {}).some((n) => n >= 3),
    mg_6: () => Object.keys(meta.minigamesPlayed || {}).length >= 6,
    mg_12: () => Object.keys(meta.minigamesPlayed || {}).length >= 12,
  };
  for (const t of TROPHIES) {
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
  const join = (a) => (a || []).slice().sort().join(',');
  return {
    rival: r.rival || 'none',
    band: join(summary.band),
    gear: join(r.accessories),
    hustles: join(r.hustles),
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

  const ending = ENDINGS[run.path][evalr.result];
  track('run_end', {
    outcome: evalr.result, path: run.path, cause: 'finale', mode: runMode(run),
    cards: (summary.cardLog || []).length, fame: summary.fame, hits: summary.hits,
    burnout: run.stats.burnout, lp, instrument: summary.instrument,
    contract: summary.contract || 'none', chart_peak: summary.chartPeak || null,
    ...runContentProps(run, summary),
  });
  if (evalr.result === 'success') sfx.winPath(run.path); else if (evalr.result === 'failure') sfx.gameover(); else sfx.good();
  renderEndingScreen(ending, lp, earned, evalr, summary);
}

function renderGameOver(endingKey) {
  const interview = EXIT_INTERVIEWS[endingKey];
  if (interview && !run.exitChoice) {
    showExitInterview(endingKey, interview);
    return;
  }
  const summary = engine.runSummary(run);
  summary.exitChoice = run.exitChoice || null;
  let lp = engine.legacyPoints(run) + (run.exitLpBonus || 0);
  const earned = finishMeta(summary, lp);
  track('run_end', {
    outcome: 'gameover', path: run.path || null, cause: endingKey, mode: runMode(run),
    cards: (summary.cardLog || []).length, fame: summary.fame, hits: summary.hits,
    burnout: run.stats.burnout, lp, instrument: summary.instrument,
    contract: summary.contract || 'none', chart_peak: summary.chartPeak || null,
    exit: run.exitChoice || 'none',
    ...runContentProps(run, summary),
  });
  sfx.gameover();
  renderEndingScreen(ENDINGS[endingKey], lp, earned, null, summary);
}

// The Exit Interview (Pass 45): one final choice inside a fail state
function showExitInterview(endingKey, interview) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
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
      ov.classList.remove('active');
      renderGameOver(endingKey);
    }));
  }
  box.append(list);
  ov.append(box);
}

const TIER_EMOJI = { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };

function shareTextFor(summary, lp) {
  const inst = instrumentById(summary.instrument);
  const head = summary.gauntlet ? `BIG BREAK Gauntlet ${summary.gauntlet}`
    : summary.daily ? `BIG BREAK Daily ${summary.daily}` : 'BIG BREAK';
  const genre = summary.genre ? genreById(summary.genre) : null;
  const pathName = (genre ? genre.name + ' ' : '') + (summary.path ? PATHS[summary.path].name : 'the void');
  const res = summary.result ? summary.result.toUpperCase()
    : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[summary.endingKey] || 'GAME OVER';
  const line = (summary.tierLog || []).map((t) => TIER_EMOJI[t] || '⬜').join('');
  const peak = summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : '';
  return `${head}\n${inst ? inst.name : '?'} → ${pathName} → ${res}\n${line}\n★${summary.fame}${peak} · +${lp} LP\nhttps://sandstreampop.github.io/big-break/`;
}

function renderEndingScreen(ending, lp, trophies, evalr, summary) {
  music.setMood('ending');
  // Stage C: the credits roll over your Final Set closer (or best song)
  {
    const closer = (run.songs || []).find((x) => x.id === run.finalCloser);
    if (closer) songPlayer.play(closer);
    else catalogDJ.ending(run);
  }
  const s = $('#screen-ending');
  s.innerHTML = '';
  const wrap = el('div', 'ending-wrap');
  wrap.append(artFor(ending.art, 'ending-art', {
    fame: run.fame, network: run.stats.network, burnout: run.stats.burnout,
  }));
  // Verdict ribbon: outcome legible before a single line of prose
  const resKey = summary?.result || null;
  const resLabel = resKey
    ? { success: 'SUCCESS', partial: 'PARTIAL CREDIT', failure: 'FAILURE' }[resKey]
    : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[summary?.endingKey] || 'THE END';
  const pathLabel = summary?.path ? PATHS[summary.path].name.toUpperCase() + ' · ' : '';
  wrap.append(el('div', `verdict verdict-${resKey || 'over'}`, `${pathLabel}${resLabel}`));
  wrap.append(el('h2', 'ending-title', ending.title));
  const finalPress = generateHeadlines(run, 1)[0];
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
    const gates = el('div', 'gate-readout');
    for (const r of evalr.readings) {
      const row = el('div', 'gate-row' + (r.met ? ' met' : ''));
      const name = r.key === 'fame' ? 'Fame' : r.key === 'hits' ? 'Hits' : STAT_META[r.key].name;
      row.append(el('span', 'gate-name', `${r.met ? '✓' : '✗'} ${name}`));
      const bar = el('div', 'gate-bar');
      const fill = el('div', 'gate-fill');
      fill.style.width = `${Math.round(r.ratio * 100)}%`;
      bar.append(fill);
      row.append(bar);
      row.append(el('span', 'gate-nums', `${r.value}/${r.target}`));
      gates.append(row);
    }
    if (evalr.momentum >= CONFIG.momentumForUpgrade) {
      gates.append(el('p', 'momentum-note', `▲ Momentum ×${evalr.momentum} carried you.`));
    }
    wrap.append(gates);
  }
  const endContract = summary?.contract ? contractById(summary.contract) : null;
  wrap.append(el('p', 'lp-award', `+${lp} Legacy Points${endContract ? ` <span class="lp-mult">(${endContract.icon} ${endContract.name} ×${endContract.lpMult})</span>` : ''}`));
  for (const t of trophies) {
    wrap.append(el('p', 'trophy-toast', `${t.icon} Trophy: <b>${t.name}</b> — ${t.desc}`));
  }

  const disc = buildDiscography(run);
  if (disc.length) {
    wrap.append(el('h3', 'wall-tier', 'The Discography'));
    const list = el('div', 'disc-list');
    for (const d of disc) {
      list.append(el('div', 'disc-row', `<b>“${d.title}”</b>${d.fact ? `<i class="disc-fact">${d.fact}</i>` : ''}<span>— ${d.review}</span>`));
    }
    wrap.append(list);
  }
  const epilogue = buildEpilogue(run);
  if (run.exitText || epilogue) {
    wrap.append(el('h3', 'wall-tier', 'Epilogue'));
    if (run.exitText) wrap.append(el('p', 'epilogue-text exit-text', run.exitText));
    if (epilogue) wrap.append(el('p', 'epilogue-text', epilogue));
  }

  if (summary?.tierLog?.length) {
    wrap.append(el('p', 'tier-strip', summary.tierLog.map((t) => TIER_EMOJI[t] || '⬜').join('')));
  }

  const menu = el('div', 'menu');
  if (summary?.cardLog?.length) {
    menu.append(btn('📖 Scrapbook (how it went down)', '', () => showScrapbook(summary)));
  }
  if (summary) {
    const shareBtn = btn('📣 Share this run', '', async () => {
      const text = shareTextFor(summary, lp);
      try {
        // Prefer a poster image via the native sheet (Pass 38)
        const inst = instrumentById(summary.instrument);
        const genre = summary.genre ? genreById(summary.genre) : null;
        const res = summary.result ? summary.result.toUpperCase()
          : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[summary.endingKey] || 'GAME OVER';
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
        const file = blob ? new File([blob], 'big-break-run.png', { type: 'image/png' }) : null;
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
  menu.append(btn('▶ Run It Back', 'primary', () => startNewRun()));
  menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', renderWall));
  menu.append(btn('🏠 Title', '', () => { renderTitle(); show('#screen-title'); }));
  wrap.append(menu);
  s.append(wrap);
  show('#screen-ending');
}

// ---------- Scrapbook (Pass 11) ----------

function showScrapbook(summary) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  const box = el('div', 'result-card scrapbook');
  box.append(el('div', 'tier-badge', 'THE SCRAPBOOK'));
  let lastAct = 0;
  for (const entry of summary.cardLog) {
    if (entry.a !== lastAct) {
      lastAct = entry.a;
      box.append(el('h3', 'scrap-act', `ACT ${entry.a} · ${['', 'The Garage', 'The Grind', 'The Reckoning'][entry.a]}`));
    }
    const ev = EVENTS.find((e) => e.id === entry.e);
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
  const done = () => { ov.classList.remove('active'); ov.removeEventListener('click', done); };
  setTimeout(() => ov.addEventListener('click', done), 200);
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
  for (const item of WALL_ITEMS) {
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
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
  s.append(menu);
  show('#screen-wall');
  s.scrollTop = keepScroll;
}

// ---------- Trophy Room ----------

function renderTrophies() {
  const s = $('#screen-trophies');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Trophy Room'));
  s.append(el('p', 'screen-sub', `${meta.trophies.length}/${TROPHIES.length} collected. Each one cost you something.`));

  const owned = new Set(meta.trophies);
  const pct = Math.round((100 * meta.trophies.length) / TROPHIES.length);
  const meter = el('div', 'trophy-meter');
  const fill = el('div', 'trophy-meter-fill');
  fill.style.width = pct + '%';
  meter.append(fill);
  s.append(meter);

  const CATS = [['endings', 'Ways It Ends'], ['feats', 'Feats'], ['career', 'The Long Game']];
  for (const [cat, label] of CATS) {
    const group = TROPHIES.filter((t) => (t.cat || 'feats') === cat);
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
      const inst = instrumentById(h.instrument);
      const res = h.result ? h.result.toUpperCase()
        : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[h.endingKey] || 'DNF';
      const pathName = h.path ? PATHS[h.path].name : '—';
      const row = el('div', 'history-row res-' + (h.result || 'fail'),
        `<span>${h.daily ? '📅 ' : ''}${inst ? inst.name : '?'} → ${pathName}</span>` +
        `<b>${res}</b><span class="hist-fame">★${h.fame}${h.songs?.length ? ' ♪' : ''}</span>`);
      // the ♪: past careers are still listenable — tap to unfold the record
      if (h.songs?.length) {
        row.addEventListener('click', () => {
          sfx.ui();
          const open = row.nextElementSibling?.classList?.contains('hist-songs');
          hist.querySelectorAll('.hist-songs').forEach((d) => d.remove());
          if (open) return;
          const book = el('div', 'hist-songs');
          for (const s of h.songs) {
            const srow = el('div', 'songbook-row sb-' + (s.status || 'demo') + (s.crowned ? ' sb-crowned' : ''));
            const play = el('button', 'sb-play', songPlayer.playingKey === songKey(s) ? '⏸' : '▶');
            play.dataset.songkey = songKey(s);
            play.addEventListener('click', (e) => { e.stopPropagation(); sfx.ui(); songPlayer.play(s); });
            srow.append(play);
            srow.append(el('b', '', `“${s.title}”`));
            srow.append(el('span', 'sb-state', s.crowned ? `👑 HIT — peaked #${s.peak}` : s.peak ? `peaked #${s.peak}` : s.status));
            book.append(srow);
          }
          row.after(book);
        });
      }
      hist.append(row);
    }
    s.append(hist);
  }
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
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
  const mgPlays = Object.values(meta.minigamesPlayed || {}).reduce((a, b) => a + b, 0);
  if (mgPlays) row('Performances played', `${mgPlays} (${Object.keys(meta.minigamesPlayed).length} kinds)`);
  if (meta.mgGolden) row('GOLDEN moments', meta.mgGolden);

  list.append(el('h3', 'wall-tier', 'By path'));
  for (const [pid, p] of Object.entries(lt.byPath)) {
    row(`${PATHS[pid]?.icon || ''} ${PATHS[pid]?.name || pid}`,
      `${p.wins}/${p.runs} won (${p.runs ? Math.round((100 * p.wins) / p.runs) : 0}%)`);
  }
  const instRuns = Object.entries(lt.byInstrument).sort((a, b) => b[1].runs - a[1].runs);
  if (instRuns.length) {
    list.append(el('h3', 'wall-tier', 'Weapon of choice'));
    for (const [iid, st] of instRuns.slice(0, 3)) {
      row(instrumentById(iid)?.name || iid, `${st.runs} run${st.runs === 1 ? '' : 's'}, ${st.wins} win${st.wins === 1 ? '' : 's'}`);
    }
  }
  s.append(list);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
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
  const toggleRow = (label, value, onTap, pillText) => {
    const row = el('button', 'setting-row');
    const sw = pillText !== undefined
      ? `<span class="switch-pill${value ? ' on' : ''}">${pillText}</span>`
      : `<span class="switch${value ? ' on' : ''}"></span>`;
    row.innerHTML = `<span>${label}</span>${sw}`;
    row.addEventListener('click', () => { onTap(); save.saveMeta(meta); renderSettings(); });
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
  menu.append(btn('🎓 Replay the first gig', '', () => { save.clearRun(); startTutorial(); }));
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
      meta = save.loadMeta();
      renderTitle();
      show('#screen-title');
      return;
    }
  }));
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
  s.append(menu);
  s.append(el('p', 'title-foot', 'BIG BREAK v2.0 — a satirical music-career roguelike. All characters are archetypes; any resemblance to real A&R reps is statistically inevitable.'));
  show('#screen-settings');
}
