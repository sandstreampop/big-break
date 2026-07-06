// BIG BREAK — starting (and resuming) a run.
//
// The setup flows that mint a run and hand off to the card loop: the loadout
// picker with its optional venue/genre/contract choices (startNewRun), the
// weekly fixed-build Gauntlet, the First Gig tutorial and its wrap-up, and
// resumeRun which drops a saved run back at its current phase. Each ends by
// handing control to the nav seam (nav.dealCard / nav.crossroads / …).

import * as engine from '../engine.js';
import * as save from '../save.js';
import { track } from '../analytics.js';
import { signContract } from '../packs/plugins/contract.js';
import { contractById, CONTRACTS } from '../data/contracts.js';
import { genreById, offerGenres } from '../data/genres.js';
import { venueById, offerVenues } from '../data/venues.js';
import { INSTRUMENTS } from '../data/instruments.js';
import { artFor } from '../art.js';
import { sfx, music } from '../audio.js';
import { el, $, activatable, keyable, btn, show, hashStr, weekStr, todayStr } from './dom.js';
import { activePack, run, PRES, meta, setRun, STAT_META } from './context.js';
import { nav } from './nav.js';

// ---------- Instrument select ----------

export function startNewRun(daily = false, comeback = false) {
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

export function resumeRun() {
  if (run.phase === 'crossroads') nav.crossroads();
  else if (run.phase === 'finale') nav.finalSet();
  else nav.dealCard();
}

// The Gauntlet (Pass 28): one fixed, seeded build per ISO week — same
// instrument, genre, and contract for everyone. Often cursed. Always fair.
export function startGauntlet() {
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



export function startTutorial() {
  const seed = Math.floor(Math.random() * 1e9) + 1;
  setRun(engine.newTutorialRun(activePack, engine.mulberry32(seed)));
  run.seed = seed + 2;
  save.saveRun(run);
  track('tutorial_start', { replay: !!meta.tutorialDone });
  nav.dealCard();
}

// The First Gig wrap-up: lessons recapped in-fiction, walk-in LP, and the
// game opens up for real play.
export function renderTutorialEnd() {
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


