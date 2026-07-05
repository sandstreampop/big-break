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
import { sfx, music, ambient, setSoundEnabled, setMusicEnabled, initAudio } from './audio.js';
import { initAnalytics, track, setAnalyticsEnabled, analyticsEnabled, exportEvents } from './analytics.js';
import { playMinigame, minigameById } from './minigames.js';
import { CSS_CONTRACT } from './version.js';

// The game this session is playing. Defaults to music; boot(pack) sets it so
// the same UI drives either pack. Taxonomy (PATHS/STAT_META) is read from the
// active pack's manifest, resolved in boot() after the pack is chosen.
let activePack = musicPack;
let PATHS = musicPack.manifest.paths;
let STAT_META = musicPack.manifest.statMeta;
let RESOURCE_META = musicPack.manifest.resourceMeta || {};
// The active pack's Presenter: endings, exit interviews, wall, trophies, and
// flavor generators. The UI reads this instead of importing music's meta and
// flavor modules, so any pack renders its own endings (Phase G).
let PRES = musicPack.presenter;
let meta = save.loadMeta();
let run = null;

const $ = (sel) => document.querySelector(sel);

// Display name/icon for ANY taxonomy key — stat, burnout, or resource — read
// from the pack manifest (Phase G.4). Replaces the old fame/hits label
// special-cases so a genre whose gates name any stat or resource renders them.
const metaFor = (key) => STAT_META[key] || RESOURCE_META[key] || { name: key, icon: '' };
const el = (tag, cls?, html?) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Fill {token} placeholders with this run's identities. A pack that ships its
// own token vocabulary provides presenter.fillTokens; the default resolves the
// music tokens ({rival}/{genre}/{song}/{venue}…) exactly as before.
function fillText(s) {
  if (!s || !run) return s;
  if (PRES.fillTokens) return PRES.fillTokens(run, s);
  const r = rivalById(run.rival);
  const g = genreById(run.genre);
  return s.replaceAll('{rival}', r.name).replaceAll('{rivalVibe}', r.vibe)
    .replaceAll('{genre}', g ? g.name : 'your genre')
    .replaceAll('{collabArtist}', collabArtistFor(run))
    .replaceAll('{song}', flagshipSong(run)?.title || 'the song')
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

// The delivery contract, verified at boot: the build stamps the stylesheet's
// content hash into both css/style.css (--bb-css-v) and js/version.js. When
// they disagree, this client is running MIXED deploys — typically fresh JS
// with a stale cached stylesheet (HTTP cache or service worker), which renders
// new markup unstyled and collapses the phone layout (the unstyled-stage /
// buttons-over-the-card bug). Self-heal by re-pulling every stylesheet with a
// cache-busting query; if the network is truly gone the layout stays degraded
// but we've warned, and the next online visit heals.
function healStaleStylesheets() {
  if (CSS_CONTRACT === 'dev') return; // unstamped source build — nothing to verify
  const readV = () =>
    (getComputedStyle(document.documentElement).getPropertyValue('--bb-css-v') || '').replace(/["'\s]/g, '');
  if (readV() === CSS_CONTRACT) return;
  console.warn(`stylesheet contract mismatch (css "${readV() || 'none'}" ≠ js "${CSS_CONTRACT}") — refetching styles`);
  for (const link of Array.from(document.querySelectorAll('link[rel="stylesheet"]'))) {
    const base = (link.getAttribute('href') || '').split('?')[0];
    if (base) link.setAttribute('href', `${base}?v=${CSS_CONTRACT}&heal=${Date.now()}`);
  }
}

export function boot(pack = musicPack) {
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
  activePack = pack;
  PATHS = pack.manifest.paths;
  STAT_META = pack.manifest.statMeta;
  RESOURCE_META = pack.manifest.resourceMeta || {};
  PRES = pack.presenter || musicPack.presenter;
  registerArt(PRES.art); // a pack's own art slots join the scene painter
  save.setSaveNamespace(pack.id === 'music' ? '' : pack.id);
  meta = save.loadMeta();
  engine.useContentPack(pack); // this game's content; set before any engine call
  initAnalytics(meta.settings, pack.id);
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
      renderTitle();
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
      run = saved;
      resumeRun();
    }));
    menu.append(btn('✚ New Run (abandon current)', '', () => {
      save.clearRun();
      startNewRun();
    }));
  } else if (!meta.tutorialDone && (meta.runs || 0) === 0 && activePack.tutorialEvents.length) {
    // First install: the game opens with a playable lesson, not a manual.
    // (Only packs that ship a tutorial deck; labels are the pack's.)
    menu.append(btn(PRES.tutorial?.offer || '▶ Play — Your First Gig', 'primary', startTutorial));
    menu.append(btn(PRES.tutorial?.skip || 'Skip the gig — I know the drill', 'ghost', () => {
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
  const dailyName = PRES.daily?.name || 'Daily Grind';
  menu.append(btn(
    dailyDone
      ? `📅 ${dailyName} ✓ (${dailyDone.result ? dailyDone.result.toUpperCase() : 'DNF'} — replay?)`
      : `📅 ${dailyName} — ${today}`,
    '', () => { save.clearRun(); startNewRun(true); }));
  // Comeback mode exists only for packs that ship the transform.
  if (meta.successPaths?.length > 0 && activePack.comeback) {
    menu.append(btn(PRES.comeback?.label || '🦅 Comeback Run (×1.2 LP)', '', () => { save.clearRun(); startNewRun(false, true); }));
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
      '', () => { save.clearRun(); startGauntlet(); }));
  }
  if ((PRES.wallItems || []).length) menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', renderWall));
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
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
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
    const inst = activePack.loadoutById(chosenInst);
    if (!inst) return;
    sfx.commit();
    const lv = masteryLevel(inst.id);
    run = engine.newRun(activePack, inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta));
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
    track('run_start', {
      instrument: inst.id, contract: chosenContract || 'none',
      genre: chosenGenre || 'none', venue: chosenVenue || 'none',
      mode: daily ? 'daily' : comeback ? 'comeback' : 'normal',
      mastery: lv, career_runs: meta.runs || 0,
    });
    dealCard();
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
    .map(([k, v]: [string, any]) => `${v > 0 ? '+' : ''}${v} ${STAT_META[k]?.name || k}`)
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
    run = engine.newRun(activePack, inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta));
    engine.applyMastery(run, masteryLevel(inst.id));
    run.seed = seed + 2;
    run.gauntlet = week;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    run.genre = genre.id;
    signContract(run, contract.id);
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

// Resolve an equipped-item id through the active pack's catalog (presenter
// hook), else music's accessories — the original static default.
function itemById(id) {
  return PRES.itemById?.(id) || accessoryById(id);
}

function accActive(acc) {
  if (acc.compatibility?.universal) return true;
  return (acc.compatibility?.families || []).includes(activePack.loadoutById(run.loadout).family);
}

let currentCard = null;
let currentEvent = null; // the event behind currentCard (minigame lookup)
let encoreArmed = false;
let prevStats = null; // for stat-rail delta floaters

function vibrate(pattern) {
  if (meta.settings.haptics === false) return;
  try { navigator.vibrate?.(pattern); } catch (e) {}
}

// The art system's reactive-scene inputs for this run — a pack maps its own
// meters onto them (presenter.vibe); the default is music's trio.
function vibeFor() {
  if (run && PRES.vibe) return PRES.vibe(run);
  return run
    ? { fame: run.fame, network: run.stats.network, burnout: run.stats.burnout }
    : { fame: 0, network: 0, burnout: 0 };
}

// Floating +N/−N chips over the stat rail when values changed since last card
function spawnStatFloaters() {
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

// The persistent character stage (presenter.stage). Lives between the HUD and
// the card area; each slot is a face + a short qualitative read, tappable when
// the pack backs it with an inspector sheet. Genre-neutral: the shell renders
// slots, the pack decides who is on stage and what their state reads as.
function renderStage(ev) {
  let host = $('#stage');
  if (!host) {
    host = el('div', '');
    host.id = 'stage';
    $('#card-area').before(host);
  }
  host.innerHTML = '';
  host.classList.toggle('stage-compact', !!PRES.compactHud);
  const slots = PRES.stage?.(run, ev || null);
  if (!slots || !slots.length) return;
  for (const s of slots) {
    const slot = el('div', 'stage-slot' + (s.cls ? ' ' + s.cls : '') + (s.live ? ' stage-live' : ''));
    slot.append(el('div', 'stage-label', s.label));
    slot.append(el('div', 'stage-face', `${s.face}${s.moodFace ? `<span class="stage-moodface">${s.moodFace}</span>` : ''}`));
    slot.append(el('div', 'stage-name', s.name));
    if (s.read) slot.append(el('div', 'stage-read', s.read));
    if (s.sheet) slot.addEventListener('click', () => { sfx.ui(); showInspect(s.sheet); });
    host.append(slot);
  }
}

function dealCard() {
  encoreArmed = false;
  show('#screen-game');
  // a lesson about the LAST card shouldn't float over the next one
  document.querySelector('.coach')?.remove();
  renderHud();
  spawnStatFloaters();
  const ev = engine.drawNextCard(run, engine.stateRng(run));
  if (!ev) { // deck ran dry — act ends early
    run.cardsPlayedInAct = engine.actLength(run, run.act);
    routeAdvance(engine.advance(run));
    return;
  }
  save.saveRun(run);

  // The persistent character stage (presenter.stage): the run's load-bearing
  // people as first-class faces, re-read every deal, spotlighting whoever the
  // scene is about. Packs without one leave the slot empty.
  renderStage(ev);

  // A set-piece is a SEQUENCE, not a stack (ADR-0009): the framed moment —
  // banner, scene line, stakes, feel cues — plays first as its own beat,
  // then the card deals with the whole screen to itself. `spSeen` makes the
  // beat once per moment — keyed by the pack's arc key when it gives one
  // (a whole arc beats once, later cards keep the ribbon), else by card id
  // (a resumed run goes straight to the card).
  const sp = PRES.setPiece?.(run, ev);
  const spKey = sp && (sp.key || ev.id);
  if (sp && !(run.spSeen || {})[spKey]) {
    (run.spSeen = run.spSeen || {})[spKey] = true;
    save.saveRun(run);
    showSetPieceBeat(sp, () => renderDealtCard(ev, sp));
    return;
  }
  renderDealtCard(ev, sp);
}

// The framed moment: full-screen banner + stakes, one tap to the card.
// The feel cues (R11's mood contract) play here, at the beat.
function showSetPieceBeat(sp, cont) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
  vibrate(sp.mood === 'blow' ? [60, 40, 90] : [12, 30, 12]);
  const box = el('div', 'result-card sp-beat ' + (sp.cls || ''));
  if (sp.mood === 'triumph') { spawnConfetti(ov); sfx.win(); }
  if (sp.mood === 'blow' && !reducedMotion()) box.classList.add('shake');
  box.append(el('div', 'set-piece-banner sp-beat-banner', sp.banner));
  if (sp.sub) box.append(el('div', 'set-piece-sub sp-beat-sub', fillText(sp.sub)));
  if (sp.stakes?.length) {
    const st = el('div', 'set-piece-stakes sp-beat-stakes');
    for (const stake of sp.stakes) st.append(el('div', 'sp-stake ' + (stake.cls || ''), fillText(stake.html)));
    box.append(st);
  }
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  const done = () => { ov.classList.remove('active'); ov.removeEventListener('click', done); cont(); };
  setTimeout(() => ov.addEventListener('click', done), 250);
}

// The card, alone on its screen (ADR-0009 Tier 1); a set-piece card keeps
// only a slim ribbon for continuity.
function renderDealtCard(ev, sp) {
  const area = $('#card-area');
  area.innerHTML = '';
  // The set-piece layout keys off a real class, not `:has()` — engines without
  // :has() support (Safari < 15.4, Chrome < 105) silently drop such rules and
  // the banner/card stack collapses. The JS that inserts the set-piece is the
  // source of truth, so it marks the container itself.
  area.classList.toggle('has-set-piece', !!sp);
  if (sp) {
    area.append(el('div', 'set-piece set-piece-slim ' + (sp.cls || ''),
      `<div class="set-piece-banner">${sp.banner}</div>`));
  }

  // A pack may class up a card for its own framing tiers (e.g. a ceremony).
  const packCls = PRES.cardClass?.(ev);
  const card = el('div', 'card' + (ev.flashpoint ? ' flashpoint' : '') + (packCls ? ' ' + packCls : '') + (sp ? ' in-set-piece' : ''));
  ambient(sceneFor(ev.art));
  if (ev.flashpoint) {
    // U2: the moment must be LEGIBLE — foil frame, sting, badge
    sfx.flashpoint();
    vibrate([20, 30, 20, 30, 60]);
    card.append(el('div', 'flashpoint-badge', '⚡ FLASHPOINT'));
  }
  card.append(artFor(ev.art, 'card-art', vibeFor()));
  card.append(el('div', 'card-context', fillText(ev.context)));
  // The people in this scene: a pack's portrait strip (presenter.cardCast) —
  // persistent faces across a multi-beat scene, moods worn on the face.
  const cast = PRES.cardCast?.(run, ev);
  if (cast && cast.length) {
    const strip = el('div', 'card-cast');
    for (const c of cast) {
      strip.append(el('div', 'cast-chip' + (c.cls ? ' ' + c.cls : ''),
        `<span class="cast-face">${c.face}${c.moodFace ? `<span class="cast-moodface">${c.moodFace}</span>` : ''}</span>` +
        `<span class="cast-id"><span class="cast-name">${c.name}</span>${c.sub ? `<span class="cast-sub">${c.sub}</span>` : ''}</span>`));
    }
    card.append(strip);
  }
  // Some cards carry a richer text variant when the rival is a true
  // cross-run nemesis (3rd+ meeting) rather than an in-run feud.
  card.append(el('div', 'card-prompt', fillText(run.nemesis && ev.promptAlt ? ev.promptAlt : ev.prompt)));
  const hintL = el('div', 'swipe-hint hint-left', '');
  const hintR = el('div', 'swipe-hint hint-right', '');
  card.append(hintL, hintR);
  area.append(card);
  // A pack may float a commentary popover one layer above the card (the
  // overlay-note channel — e.g. a narrator's forecast on a ceremony card).
  const dealNote = PRES.overlayNote?.(run, ev);
  if (dealNote) area.append(el('div', 'overlay-note ' + (dealNote.cls || ''), fillText(dealNote.html)));
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
    // The lean-preview rides the tilt-reactive hints; a contract that hides
    // the risk tell hides this stakes read too.
    const leanL = hideRisk ? '' : leanPreview(ev.choices.left);
    const leanR = hideRisk ? '' : leanPreview(ev.choices.right);
    hintL.innerHTML = `${dot(oL)}${fillText(ev.choices.left.label)}${leanL}`;
    hintR.innerHTML = `${fillText(ev.choices.right.label)}${dot(oR)}${leanR}`;
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
    const encoreReady = PRES.encore?.ready || '🎇 Encore ready — spend for a boosted roll';
    const encoreArmedLabel = PRES.encore?.armed || '🎇 ENCORE ARMED — this swipe rolls hot';
    const eb = el('button', 'encore-btn', encoreReady);
    eb.addEventListener('click', () => {
      encoreArmed = !encoreArmed;
      eb.classList.toggle('armed', encoreArmed);
      currentCard?.classList.toggle('encore-glow', encoreArmed);
      eb.textContent = encoreArmed ? encoreArmedLabel : encoreReady;
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
    coachMark(PRES.compactHud
      ? 'Drag the card left/right — or tap a button below. The colored dot is your <b>risk tell</b>. Your full stats live under <b>☰</b> up top.'
      : 'Drag the card left/right — or tap a button below. The colored dot is your <b>risk tell</b>. Tap ❓ up top anytime.');
  }
}

// Lean-preview (qualitative, Reigns-form): for each stat/resource a side's
// outcomes touch, a magnitude dot (small • / big ●) tinted by direction —
// plus a volatility mark (◇) when the sign depends on how it lands.
// Direction and volatility, never numbers.
function leanPreview(choice) {
  const touched = new Map(); // key -> {pos, neg, maxAbs}
  for (const t of ['bad', 'good', 'incredible']) {
    const eff = choice.outcomes?.[t]?.effects || {};
    for (const [k, v] of Object.entries(eff)) {
      if (typeof v !== 'number' || !v) continue;
      // Only the pack's visible meters: core stats, burnout, and resources.
      if (!(k in run.stats) && !activePack.manifest.resources.includes(k)) continue;
      const rec = touched.get(k) || { pos: false, neg: false, maxAbs: 0 };
      if (v > 0) rec.pos = true; else rec.neg = true;
      rec.maxAbs = Math.max(rec.maxAbs, Math.abs(v));
      touched.set(k, rec);
    }
  }
  const chips = [];
  for (const [k, r] of touched) {
    const m = metaFor(k);
    // Burnout runs inverse: more of it is the bad direction.
    const goodDir = k === 'burnout' ? r.neg && !r.pos : r.pos && !r.neg;
    const volatile = r.pos && r.neg;
    const dotCls = volatile ? 'vol' : goodDir ? 'up' : 'down';
    const dot = volatile ? '◇' : r.maxAbs >= 6 ? '●' : '•';
    chips.push(`<span class="lean-chip" title="${m.name}">${m.icon}<span class="lean-dot ${dotCls}">${dot}</span></span>`);
  }
  return chips.length ? `<span class="lean-row">${chips.join('')}</span>` : '';
}

// Which stats a choice rolls against, as icons (primary bright, secondary dim)
function govIcons(choice) {
  const entries = Object.entries<any>(choice.governingStats || {}).sort((a: any, b: any) => b[1] - a[1]);
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
    // Capture can throw (a pointer the browser no longer considers active); the
    // drag still tracks via the card's own pointermove/up, so never let it break
    // the gesture.
    try { card.setPointerCapture(pid); } catch (e2) { /* capture unavailable */ }
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
    const mgMods: any = contractById(run.contract)?.mods || {};
    playMinigame(mgId, { run, rivalName: rivalById(run.rival)?.name, noSkip: !!mgMods.forceMinigames, relaxed: meta.settings.relaxedMinigames === true }).then(({ score, verdict, detail }) => {
      // instrument hook: some gear makes performance moments play easier
      const mgHook = score == null ? 0 : (activePack.loadoutById(run.loadout)?.quirk?.hooks?.mgBonus || 0);
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

// The status drawer (ADR-0009 Tier 3): the full picture the compact HUD
// stopped force-feeding — stats with bars, resources, persona, equipped
// items. Generic: rendered entirely from manifest + run state; tapping a
// stat row opens its inspector.
function showStatusDrawer() {
  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');
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
    row.addEventListener('click', (e) => { e.stopPropagation(); sfx.ui(); showInspectStat(key); });
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
  const done = () => { ov.classList.remove('active'); ov.removeEventListener('click', done); };
  setTimeout(() => ov.addEventListener('click', done), 200);
}

function showInspectStat(key) {
  showInspect({
    emoji: STAT_META[key].icon,
    title: `${STAT_META[key].name}: ${run.stats[key]}`,
    lines: [(PRES.statInfo || STAT_INFO)[key]].filter(Boolean),
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
  // The result beat (presenter.resultStage): the pack's read of HOW this
  // landed — a reacting portrait front and centre, then qualitative movement
  // lines below the outcome text. The keys it claims lose their numeric chip.
  const rs = PRES.resultStage?.(run, result);
  if (rs?.portrait) {
    const p = rs.portrait;
    const po = el('div', 'result-portrait' + (p.cls ? ' ' + p.cls : ''));
    po.append(el('div', 'result-face', `${p.face}${p.moodFace ? `<span class="stage-moodface">${p.moodFace}</span>` : ''}`));
    if (p.name) po.append(el('div', 'result-face-name', `${p.name}${p.sub ? `<span class="result-face-sub">${p.sub}</span>` : ''}`));
    box.append(po);
  }
  box.append(el('p', 'result-text', fillText(result.text)));
  // The overlay-note channel, result side: a pack plugin's commentary on how
  // this card landed (set on the result during resolution — already seeded).
  if (result.overlayNote) {
    box.append(el('div', 'overlay-note overlay-note-result ' + (result.overlayNote.cls || ''), fillText(result.overlayNote.html)));
  }
  if (rs?.reads?.length) {
    const reads = el('div', 'result-reads');
    for (const r of rs.reads) reads.append(el('div', 'result-read ' + (r.cls || ''), fillText(r.html)));
    box.append(reads);
  }

  // Numeric stat deltas: compact uniform chips (minus any key the pack's
  // result beat already voiced qualitatively).
  const hideChips = new Set(rs?.hideChipKeys || []);
  const chips = el('div', 'delta-chips');
  for (const d of result.deltas) {
    if (hideChips.has(d.key)) continue;
    chips.append(deltaChip(d.key, d.amount));
  }
  box.append(chips);

  // Everything with a sentence to say gets a full-width notice row —
  // long text wraps inside its own row instead of a distorted pill.
  const notices = el('div', 'result-notices');
  const notice = (cls, html) => notices.append(el('div', `notice ${cls}`, html));
  // Pack plugins push their own notices onto the deltas ({cls, html}) — the
  // generic channel for subsystem sentences the shell can't know about.
  for (const n of result.deltas.notices || []) notice(n.cls || 'notice-gear', fillText(n.html));
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
  const newInst = result.deltas.loadoutSet;
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
        if ((run.accessories || []).length < CONFIG.accessorySlots) {
          equipAccessory(run, acc.id);
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
    if ((run.accessories || []).length < CONFIG.accessorySlots) {
      const extra = equipAccessory(run, pending.id) || [];
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
  // 'Hit!' keeps its exclamation flourish; everything else reads the manifest
  // (metaFor covers any pack's stats + resources).
  const label = key === 'hits' ? 'Hit!' : metaFor(key).name;
  const icon = metaFor(key).icon;
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
  for (const id of run.accessories || []) {
    const acc = itemById(id);
    if (!acc) continue;
    list.append(btn(`Drop ${acc.name}`, '', () => {
      equipAccessory(run, newAcc.id, id);
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
  run = engine.newTutorialRun(activePack, engine.mulberry32(seed));
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
  menu.append(btn(PRES.tutorial?.end.next || '▶ Start your real career', 'primary', () => startNewRun()));
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
  const gates = el('div', 'gate-readout compass finalset-gates');
  gates.append(el('div', 'trades-head', `🎯 ${pathName.toUpperCase()} — WHAT YOU STILL NEED`));
  for (const r of readings) {
    const grow = el('div', 'gate-row' + (r.value >= r.target ? ' met' : ''));
    const name = metaFor(r.key).name;
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
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  if (crowns.length) { spawnConfetti(ov); sfx.win(); vibrate([30, 40, 30, 40, 80]); }
  const done = () => {
    ov.classList.remove('active');
    ov.removeEventListener('click', done);
    dealCard();
  };
  setTimeout(() => ov.addEventListener('click', done), 250);
}

// ---------- Crossroads (spec §7.2) ----------

function pathFit(pathId) {
  const gates = activePack.manifest.winGates[pathId];
  const readings = Object.entries<number>(gates).map(([key, target]) => {
    const value = engine.gateValue(run, key);
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
    const gates = el('div', 'gate-readout compass');
    for (const r of readings) {
      const grow = el('div', 'gate-row' + (r.value >= r.target ? ' met' : ''));
      const name = metaFor(r.key).name;
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
      actInterstitial({ kind: 'actStart', act: run.act, notes });
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
  const join = (a) => (a || []).slice().sort().join(',');
  // The pack's own run-summary fields ride run_end generically (R3/G2):
  // scalars as-is, arrays joined, objects skipped — a pack instruments its
  // subsystems by extending its summarize, never this file.
  const packProps = {};
  if (activePack.summarize) {
    for (const [k, v] of Object.entries(activePack.summarize(r))) {
      if (Array.isArray(v)) {
        if (v.every((x) => typeof x !== 'object')) packProps[k] = v.join(',');
      } else if (v === null || typeof v !== 'object') packProps[k] = v;
    }
  }
  return {
    rival: r.rival || 'none',
    band: join(summary.band),
    gear: join(r.accessories),
    hustles: join(r.hustles),
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
    cards: (summary.cardLog || []).length, fame: summary.fame, hits: summary.hits,
    burnout: run.stats.burnout, lp, instrument: summary.loadout,
    contract: summary.contract || 'none', chart_peak: summary.chartPeak || null,
    ...runContentProps(run, summary),
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
    cards: (summary.cardLog || []).length, fame: summary.fame, hits: summary.hits,
    burnout: run.stats.burnout, lp, instrument: summary.loadout,
    contract: summary.contract || 'none', chart_peak: summary.chartPeak || null,
    exit: run.exitChoice || 'none',
    ...runContentProps(run, summary),
  });
  sfx.gameover();
  renderEndingScreen(PRES.endings[endingKey], lp, earned, null, summary);
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

// Short verdict labels for the pack's fail-state endings (ribbon, history,
// share). Music's trio is the default; a pack overrides via presenter.
function failLabelFor(endingKey) {
  const labels = PRES.failLabels ||
    { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' };
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
  const inst = activePack.loadoutById(summary.loadout);
  const head = summary.gauntlet ? `BIG BREAK Gauntlet ${summary.gauntlet}`
    : summary.daily ? `BIG BREAK Daily ${summary.daily}` : 'BIG BREAK';
  const genre = summary.genre ? genreById(summary.genre) : null;
  const pathName = (genre ? genre.name + ' ' : '') + (summary.path ? PATHS[summary.path].name : 'the void');
  const res = summary.result ? summary.result.toUpperCase()
    : failLabelFor(summary.endingKey) || 'GAME OVER';
  const line = (summary.tierLog || []).map((t) => TIER_EMOJI[t] || '⬜').join('');
  const peak = summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : '';
  return `${head}\n${inst ? inst.name : '?'} → ${pathName} → ${res}\n${line}\n★${summary.fame}${peak} · +${lp} LP\nhttps://sandstreampop.github.io/big-break/`;
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
    const gates = el('div', 'gate-readout');
    for (const r of evalr.readings) {
      const row = el('div', 'gate-row' + (r.met ? ' met' : ''));
      const name = metaFor(r.key).name;
      row.append(el('span', 'gate-name', `${r.met ? '✓' : '✗'} ${name}`));
      const bar = el('div', 'gate-bar');
      const fill = el('div', 'gate-fill');
      fill.style.width = `${Math.round(r.ratio * 100)}%`;
      bar.append(fill);
      row.append(bar);
      row.append(el('span', 'gate-nums', `${r.value}/${r.target}`));
      gates.append(row);
    }
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
  const toggleRow = (label, value, onTap, pillText?) => {
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
      meta = save.loadMeta();
      renderTitle();
      show('#screen-title');
      return;
    }
  }));
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
  s.append(menu);
  if (activePack.id === 'music') s.append(el('p', 'title-foot', 'BIG BREAK v5 — a satirical music-career roguelike. All characters are archetypes; any resemblance to real A&R reps is statistically inevitable.'));
  show('#screen-settings');
}
