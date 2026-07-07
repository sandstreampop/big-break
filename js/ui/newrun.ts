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
import { artFor } from '../art.js';
import { sfx, music } from '../audio.js';
import { el, $, activatable, btn, show, hashStr, todayStr } from './dom.js';
import { activePack, run, PRES, meta, setRun, STAT_META, vibeFor } from './context.js';
import { nav } from './nav.js';

// ---------- Instrument select ----------

export function startNewRun(daily = false, comeback = false) {
  const seed = daily ? hashStr('bigbreak-daily-' + todayStr()) : Math.floor(Math.random() * 1e9) + 1;
  // The pack's optional pre-run selections (music: contract/genre/venue). The
  // shell treats it as an opaque bag; only the pack's setup hooks read it.
  const sel: any = {};
  let chosenInst = null;
  const s = $('#screen-instruments');

  // Committing is a separate, explicit act — tapping a loadout only selects it,
  // so the pack's optional pickers can't be silently skipped.
  const beginRun = () => {
    const inst = activePack.loadoutById(chosenInst);
    if (!inst) return;
    sfx.commit();
    setRun(engine.newRun(activePack, inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1), save.unlockedPerkIds(meta)));
    engine.applyMastery(run, masteryLevel(inst.id));
    run.seed = seed + 2;
    run.daily = daily ? todayStr() : null;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    // The pack applies its own setup choices + run-init (music: sign contract,
    // stamp sound/venue, nemesis bias) before any comeback transform.
    PRES.applySetup?.(run, sel, meta, daily);
    if (comeback) engine.applyComeback(run);
    run.firstRun = (meta.runs || 0) === 0; // a pack may key onboarding off this
    run.history = (meta.history || []).slice(); // the memory ledger (packs author off it; sims never set it)
    save.saveRun(run);
    // Genre-neutral spine only; the pack contributes its own taxonomy via
    // PRES.runProps.
    track('run_start', {
      mode: daily ? 'daily' : comeback ? 'comeback' : 'normal',
      career_runs: meta.runs || 0,
      ...(PRES.runProps?.(run, 'start') || {}),
    });
    nav.dealCard();
  };

  const buildScreen = () => {
    const pool = PRES.loadoutPool?.(meta, sel)
      || activePack.loadouts.filter((i) => i.unlockedByDefault || i.unlockedBy?.(meta)).map((i) => i.id);
    // A pack may offer its whole roster (persona × gender picks) instead of a
    // seeded three.
    const offered = PRES.offerAllLoadouts
      ? pool.map((id) => activePack.loadoutById(id)).filter(Boolean)
      : engine.offerLoadouts(pool, engine.mulberry32(seed));
    if (chosenInst && !offered.some((i) => i.id === chosenInst)) chosenInst = null;
    const keepScroll = s.scrollTop;
    s.innerHTML = '';
    const picker = PRES.loadoutPicker || { head: 'Choose your loadout', sub: '' };
    s.append(el('h2', 'screen-head', comeback ? (PRES.comeback?.head || 'The Second Act')
      : daily ? `${PRES.daily?.name || 'Daily Grind'} — ${todayStr()}` : picker.head));
    s.append(el('p', 'screen-sub', comeback ? (PRES.comeback?.sub || '')
      : daily ? 'Same run for everyone today: same loadouts, same deck, same luck. Only the swipes are yours.'
      : picker.sub));
    renderInstrumentRow(s, offered, chosenInst, (id) => { chosenInst = id; buildScreen(); });
    // The pack's optional pre-run choices (music's venue/genre/contract).
    PRES.setupExtras?.(s, { seed, sel, rebuild: buildScreen, daily });

    // Sticky commit bar: always visible, states the full loadout
    const inst = chosenInst ? activePack.loadoutById(chosenInst) : null;
    const bar = el('div', 'start-bar');
    const extras = PRES.setupSummary?.(sel) || '';
    const sb = btn(inst ? `▶ Start the run — ${inst.name}${extras ? ' · ' + extras : ''}` : (picker.head.includes('player') ? 'Pick your player to start' : 'Pick an instrument to start'), inst ? 'primary' : '', beginRun);
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
  // The wrap-up copy is the pack's (presenter.tutorial.end).
  const tend = PRES.tutorial!.end;
  wrap.append(artFor(tend.art || '', 'ending-art', vibeFor()));
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


