// BIG BREAK — UI: screens, card swipe physics, result presentation.

import { CONFIG, PATHS, STAT_META } from './config.js';
import { ENDINGS, WALL_ITEMS, TROPHIES } from './data/meta.js';
import { instrumentById, INSTRUMENTS } from './data/instruments.js';
import { rivalById } from './data/rivals.js';
import { accessoryById } from './data/accessories.js';
import { EVENTS } from './data/events.js';
import * as engine from './engine.js';
import * as save from './save.js';
import { artFor } from './art.js';
import { buildChart, playerChartInfo } from './charts.js';
import { CONTRACTS, contractById } from './data/contracts.js';
import { hustleById } from './data/hustles.js';
import { generateHeadlines } from './headlines.js';
import { sfx, music, setSoundEnabled, setMusicEnabled, initAudio } from './audio.js';

let meta = save.loadMeta();
let run = null;

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Fill {rival}/{rivalVibe} placeholders with this run's generated rival
function fillText(s) {
  if (!s || !run) return s;
  const r = rivalById(run.rival);
  return s.replaceAll('{rival}', r.name).replaceAll('{rivalVibe}', r.vibe);
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
  setSoundEnabled(meta.settings.sound);
  setMusicEnabled(meta.settings.music !== false);
  music.setMood('title');
  document.addEventListener('pointerdown', initAudio, { once: true });
  renderTitle();
  show('#screen-title');
}

function renderTitle() {
  music.setMood('title');
  const s = $('#screen-title');
  s.innerHTML = '';
  s.append(el('div', 'title-logo', 'BIG<br>BREAK'));
  s.append(el('p', 'title-tag', 'Swipe your way from a damp garage to the top of the music industry — before the industry breaks you first.'));

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
  menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', renderWall));
  menu.append(btn('🎖 Trophy Room', '', renderTrophies));
  menu.append(btn('⚙ Settings', '', renderSettings));
  s.append(menu);
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
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0) + 1;
}

function startNewRun(daily = false) {
  const seed = daily ? hashStr('bigbreak-daily-' + todayStr()) : Math.floor(Math.random() * 1e9) + 1;
  let chosenContract = null;
  const s = $('#screen-instruments');

  const buildScreen = () => {
    const cMods = contractById(chosenContract)?.mods || {};
    const pool = cMods.forceInstrument
      ? [cMods.forceInstrument]
      : save.unlockedInstrumentIds(meta);
    const offered = engine.offerInstruments(pool, engine.mulberry32(seed));
    s.innerHTML = '';
    s.append(el('h2', 'screen-head', daily ? `Daily Grind — ${todayStr()}` : 'Choose your weapon'));
    s.append(el('p', 'screen-sub', daily
      ? 'Same run for everyone today: same instruments, same deck, same luck. Only the swipes are yours.'
      : 'Each one is almost useless. That’s the point.'));
    renderInstrumentRow(s, offered, seed, daily, () => chosenContract);
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
  };
  buildScreen();
  show('#screen-instruments');
}

function renderInstrumentRow(s, offered, seed, daily, getContract) {
  const row = el('div', 'pick-row');
  for (const inst of offered) {
    const card = el('div', 'pick-card');
    card.append(artFor(inst.art, 'pick-art'));
    card.append(el('h3', '', inst.name));
    card.append(el('p', 'pick-flavor', inst.flavor));
    card.append(el('p', 'pick-mods', modsText(inst.modifiers)));
    card.append(el('p', 'pick-quirk', `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`));
    card.addEventListener('click', () => {
      sfx.commit();
      run = engine.newRun(inst.id, save.unlockedPackIds(meta), engine.mulberry32(seed + 1));
      run.seed = seed + 2;
      run.daily = daily ? todayStr() : null;
      const contract = getContract();
      if (contract) engine.signContract(run, contract);
      save.saveRun(run);
      dealCard();
    });
    row.append(card);
  }
  s.append(row);
}

function modsText(mods) {
  return Object.entries(mods)
    .map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${STAT_META[k]?.name || k}`)
    .join(' · ');
}

function resumeRun() {
  if (run.phase === 'crossroads') renderCrossroads();
  else dealCard();
}

// ---------- Game screen ----------

function renderHud() {
  const hud = $('#hud');
  hud.innerHTML = '';
  music.setMood('act' + run.act);
  // Burnout vignette: the screen itself runs hot as you do
  const game = $('#screen-game');
  game.classList.toggle('burnout-warm', run.stats.burnout >= 50 && run.stats.burnout < 72);
  game.classList.toggle('burnout-hot', run.stats.burnout >= 72);
  const top = el('div', 'hud-top');
  const actWrap = el('span', 'hud-act-wrap');
  actWrap.append(el('span', 'hud-act', `ACT ${run.act} · ${['', 'The Garage', 'The Grind', 'The Reckoning'][run.act]}`));
  const chartBtn = el('button', 'chart-btn', '📈');
  chartBtn.addEventListener('click', () => { sfx.ui(); showChart(); });
  actWrap.append(chartBtn);
  const helpBtn = el('button', 'chart-btn', '❓');
  helpBtn.addEventListener('click', () => { sfx.ui(); showHelp(); });
  actWrap.append(helpBtn);
  top.append(actWrap);
  const counters = el('span', 'hud-counters');
  if (run.encore > 0) counters.append(el('span', 'hud-encore', `🎇${run.encore > 1 ? '×' + run.encore : ''}`));
  counters.append(el('span', 'hud-fame', `★ ${run.fame}`));
  counters.append(el('span', 'hud-money' + (run.money < 0 ? ' neg' : ''), `$${run.money}`));
  if (run.path === 'hitfactory' || run.hits > 0) counters.append(el('span', 'hud-hits', `♪ ${run.hits} hit${run.hits === 1 ? '' : 's'}`));
  top.append(counters);
  hud.append(top);

  const rail = el('div', 'stat-rail');
  for (const key of ['skill', 'cred', 'creativity', 'network', 'burnout']) {
    const v = run.stats[key];
    const item = el('div', 'stat' + (key === 'burnout' ? ' stat-burnout' : ''));
    item.dataset.stat = key;
    if (key === 'burnout' && v >= 70) item.classList.add('danger');
    else if (key === 'burnout' && v >= 45) item.classList.add('warn');
    item.title = STAT_META[key].name;
    item.append(el('span', 'stat-icon', STAT_META[key].icon));
    const bar = el('div', 'stat-bar');
    bar.append(el('div', 'stat-fill', ''));
    bar.querySelector('.stat-fill').style.width = `${v}%`;
    item.append(bar);
    item.append(el('span', 'stat-val', String(v)));
    rail.append(item);
  }
  hud.append(rail);

  const gearRow = el('div', 'gear-row');
  const inst = instrumentById(run.instrument);
  gearRow.append(el('span', 'gear-chip inst-chip', `${inst.name}`));
  const contract = contractById(run.contract);
  if (contract) gearRow.append(el('span', 'gear-chip contract-chip-mini', `${contract.icon} ${contract.name}`));
  for (const id of run.accessories) {
    const acc = accessoryById(id);
    const active = accActive(acc);
    gearRow.append(el('span', 'gear-chip' + (active ? '' : ' inert'), acc.name + (active ? '' : ' 💤')));
  }
  for (const id of run.hustles || []) {
    const h = hustleById(id);
    if (h) gearRow.append(el('span', 'gear-chip hustle-chip', `${h.icon} +$${h.moneyPerAct}/act`));
  }
  hud.append(gearRow);
}

function accActive(acc) {
  if (acc.compatibility?.universal) return true;
  return (acc.compatibility?.families || []).includes(instrumentById(run.instrument).family);
}

let currentCard = null;
let encoreArmed = false;
let prevStats = null; // for stat-rail delta floaters

function vibrate(pattern) {
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
  renderHud();
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

  const card = el('div', 'card');
  card.append(artFor(ev.art, 'card-art'));
  card.append(el('div', 'card-context', fillText(ev.context)));
  card.append(el('div', 'card-prompt', fillText(ev.prompt)));
  const hintL = el('div', 'swipe-hint hint-left', '');
  const hintR = el('div', 'swipe-hint hint-right', '');
  card.append(hintL, hintR);
  area.append(card);
  currentCard = card;

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
  const dot = (o) => hideRisk ? '<span class="risk risk-hidden">?</span>' : `<span class="risk ${riskClass(o)}"></span>`;
  const paintOdds = () => {
    const opts = { encore: encoreArmed };
    const oL = engine.choiceOdds(run, ev.choices.left, opts);
    const oR = engine.choiceOdds(run, ev.choices.right, opts);
    hintL.innerHTML = `${dot(oL)}${ev.choices.left.label}`;
    hintR.innerHTML = `${ev.choices.right.label}${dot(oR)}`;
    bL.innerHTML = `<span class="dir">◀</span>${dot(oL)} ${ev.choices.left.label}`;
    bR.innerHTML = `${ev.choices.right.label} ${dot(oR)}<span class="dir">▶</span>`;
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

  // First-run coaching (once per install)
  meta.coach = meta.coach || {};
  if (!meta.coach.card) {
    meta.coach.card = true;
    save.saveMeta(meta);
    coachMark('Drag the card left/right — or tap a button below. The colored dot is your <b>risk tell</b>. Tap ❓ up top anytime.');
  }
}

// Vague risk tell (spec §10): dot color from odds of a Bad outcome
function riskClass(odds) {
  if (odds.bad > 0.5) return 'risk-high';
  if (odds.bad > 0.18) return 'risk-mid';
  if (odds.incredible > 0.35) return 'risk-hot'; // spicy: big upside
  return 'risk-low';
}

function attachDrag(card, bL, bR) {
  let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false, pid = null;
  const threshold = Math.min(110, window.innerWidth * 0.28);

  card.addEventListener('pointerdown', (e) => {
    dragging = true;
    pid = e.pointerId;
    startX = e.clientX; startY = e.clientY;
    card.setPointerCapture(pid);
    card.classList.add('dragging');
  });
  card.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pid) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    if (!reducedMotion()) {
      card.style.transform =
        `translate3d(${dx}px, ${dy * 0.15}px, 0) rotate(${dx * 0.055}deg)`;
    }
    const t = Math.min(1, Math.abs(dx) / 70);
    card.querySelector('.hint-left').style.opacity = dx < 0 ? t : 0;
    card.querySelector('.hint-right').style.opacity = dx > 0 ? t : 0;
    bL.classList.toggle('armed', dx < -threshold);
    bR.classList.toggle('armed', dx > threshold);
  });
  const release = (e) => {
    if (!dragging || (pid !== null && e.pointerId !== pid)) return;
    dragging = false;
    card.classList.remove('dragging');
    bL.classList.remove('armed');
    bR.classList.remove('armed');
    if (Math.abs(dx) > threshold) {
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
  const card = currentCard;
  currentCard = null;
  sfx.swipe();

  const result = engine.resolveSwipe(run, side, engine.stateRng(run), { encore: encoreArmed });
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
    <div><span class="risk risk-low"></span> safe bet</div>
    <div><span class="risk risk-mid"></span> could go either way</div>
    <div><span class="risk risk-high"></span> likely to go badly</div>
    <div><span class="risk risk-hot"></span> big upside in reach</div>`;
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

function coachMark(text) {
  if (!$('#screen-game').classList.contains('active')) return;
  const old = document.querySelector('.coach');
  if (old) old.remove();
  const c = el('div', 'coach', text + '<span class="coach-x">tap to dismiss</span>');
  c.addEventListener('click', () => c.remove());
  $('#screen-game').append(c);
  setTimeout(() => c.remove(), 9000);
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
  const list = el('div', 'chart-list');
  for (const row of buildChart(run)) {
    const r = el('div', 'chart-row' + (row.you ? ' you' : '') + (row.rival ? ' rival' : ''));
    r.append(el('span', 'chart-pos', `${row.pos}`));
    r.append(el('span', 'chart-song', `<b>${row.song}</b><br><span>${row.artist}</span>`));
    r.append(el('span', 'chart-weeks', `${row.weeks}w`));
    list.append(r);
  }
  box.append(list);
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

  const chips = el('div', 'delta-chips');
  if (result.encoreSpent) chips.append(el('span', 'chip chip-encore', '🎇 Encore spent'));
  if (result.encoreEarned) chips.append(el('span', 'chip chip-encore', '🎇 ENCORE earned — bank it for the right card'));
  for (const d of result.deltas) {
    chips.append(deltaChip(d.key, d.amount));
  }
  if (result.gearLost) chips.append(el('span', 'chip chip-bad', `− ${result.gearLost.name} (lost!)`));
  const hustle = result.deltas.hustleGained;
  if (hustle) {
    chips.append(el('span', 'chip chip-gear', `${hustle.icon} Side hustle: ${hustle.name} (+$${hustle.moneyPerAct}/act)`));
  }
  const newInst = result.deltas.instrumentSet;
  if (newInst) chips.append(el('span', 'chip chip-gear', `🎸 Now playing: ${newInst.name}`));
  box.append(chips);
  if (hustle?.blurb) box.append(el('p', 'gear-blurb', `${hustle.icon} ${hustle.blurb}`));
  if (newInst) box.append(el('p', 'gear-blurb', `🎸 <b>${newInst.name}</b> — <b>${newInst.quirk.name}:</b> ${newInst.quirk.desc}`));

  // Gear gained?
  const pending = result.deltas.pendingGear;
  if (pending) {
    if (run.accessories.length < CONFIG.accessorySlots) {
      const extra = engine.equipAccessory(run, pending.id) || [];
      save.saveRun(run);
      chips.append(el('span', 'chip chip-gear', `+ ${pending.name}`));
      for (const d of extra) chips.append(deltaChip(d.key, d.amount));
      if (pending.blurb) box.append(el('p', 'gear-blurb', `🧰 <b>${pending.name}</b> — ${pending.blurb}`));
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
    if (!meta.coach.result) {
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
    return el('span', 'chip chip-rival',
      `⚔ ${amount > 0 ? 'Feud with' : 'Peace with'} ${r.name} ${sign}${amount}`);
  }
  const label = key === 'fame' ? 'Fame' : key === 'money' ? '$' : key === 'hits' ? 'Hit!'
    : key === 'pathProgress' ? 'Momentum' : (STAT_META[key]?.name || key);
  const icon = key === 'fame' ? '★' : key === 'money' ? '' : key === 'hits' ? '♪'
    : key === 'pathProgress' ? '▲' : (STAT_META[key]?.icon || '');
  const goodDelta = key === 'burnout' ? amount < 0 : amount > 0;
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
    case 'actStart': actInterstitial(step); break;
    case 'finale': renderFinale(); break;
    case 'gameover': renderGameOver(step.endingKey); break;
  }
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
  for (const n of step.notes || []) box.append(el('p', 'upkeep-note', `💸 ${n}`));

  // The Trades: procedural press about YOUR run (Pass 14)
  const headlines = generateHeadlines(run);
  if (headlines.length) {
    const paper = el('div', 'trades');
    paper.append(el('div', 'trades-head', '📰 MEANWHILE, IN THE TRADES'));
    for (const h of headlines) {
      paper.append(el('div', 'trades-row', `<b>${h.text}</b><span>— ${h.src}</span>`));
    }
    box.append(paper);
  }
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  const done = () => {
    ov.classList.remove('active');
    ov.removeEventListener('click', done);
    dealCard();
  };
  setTimeout(() => ov.addEventListener('click', done), 250);
}

// ---------- Crossroads (spec §7.2) ----------

function renderCrossroads() {
  run.phase = 'crossroads';
  save.saveRun(run);
  const s = $('#screen-crossroads');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Crossroads'));
  s.append(el('p', 'screen-sub', 'Act 1 is over. Pick a summit — the deck follows your choice. No refunds.'));
  const row = el('div', 'pick-row');
  for (const p of Object.values(PATHS)) {
    const card = el('div', 'pick-card path-card path-' + p.id);
    card.append(el('div', 'path-icon', p.icon));
    card.append(el('h3', '', p.name));
    card.append(el('p', 'pick-flavor', p.blurb));
    card.append(el('p', 'pick-quirk', `<b>Finale gate:</b> ${p.gateLabel}`));
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
  meta.runHistory = meta.runHistory || [];
  meta.runHistory.unshift({
    date: todayStr(),
    instrument: summary.instrument,
    path: summary.path,
    result: summary.result,
    endingKey: summary.endingKey,
    fame: summary.fame,
    daily: !!summary.daily,
  });
  meta.runHistory = meta.runHistory.slice(0, 10);

  const earned = [];
  for (const t of TROPHIES) {
    if (meta.trophies.includes(t.id)) continue;
    let ok = false;
    if (t.special === 'all_paths') {
      ok = ['megastar', 'studio', 'hitfactory'].every((p) => meta.successPaths.includes(p));
    } else if (t.check) ok = t.check(summary);
    if (ok) { meta.trophies.push(t.id); earned.push(t); }
  }
  save.saveMeta(meta);
  save.clearRun();
  return earned;
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
  if (evalr.result === 'success') sfx.win(); else if (evalr.result === 'failure') sfx.gameover(); else sfx.good();
  renderEndingScreen(ending, lp, earned, evalr, summary);
}

function renderGameOver(endingKey) {
  const summary = engine.runSummary(run);
  const lp = engine.legacyPoints(run);
  const earned = finishMeta(summary, lp);
  sfx.gameover();
  renderEndingScreen(ENDINGS[endingKey], lp, earned, null, summary);
}

const TIER_EMOJI = { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };

function shareTextFor(summary, lp) {
  const inst = instrumentById(summary.instrument);
  const head = summary.daily ? `BIG BREAK Daily ${summary.daily}` : 'BIG BREAK';
  const pathName = summary.path ? PATHS[summary.path].name : 'the void';
  const res = summary.result ? summary.result.toUpperCase()
    : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[summary.endingKey] || 'GAME OVER';
  const line = (summary.tierLog || []).map((t) => TIER_EMOJI[t] || '⬜').join('');
  const peak = summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : '';
  return `${head}\n${inst ? inst.name : '?'} → ${pathName} → ${res}\n${line}\n★${summary.fame}${peak} · +${lp} LP\nhttps://sandstreampop.github.io/big-break/`;
}

function renderEndingScreen(ending, lp, trophies, evalr, summary) {
  music.setMood('ending');
  const s = $('#screen-ending');
  s.innerHTML = '';
  const wrap = el('div', 'ending-wrap');
  wrap.append(artFor(ending.art, 'ending-art'));
  wrap.append(el('h2', 'ending-title', ending.title));
  const finalPress = generateHeadlines(run, 1)[0];
  if (finalPress) {
    wrap.append(el('p', 'trades-row ending-press', `<b>${finalPress.text}</b><span>— ${finalPress.src}</span>`));
  }
  wrap.append(el('p', 'ending-text', ending.text));

  if (evalr) {
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

  if (summary?.tierLog?.length) {
    wrap.append(el('p', 'tier-strip', summary.tierLog.map((t) => TIER_EMOJI[t] || '⬜').join('')));
  }
  const endContract = summary?.contract ? contractById(summary.contract) : null;
  wrap.append(el('p', 'lp-award', `+${lp} Legacy Points${endContract ? ` <span class="lp-mult">(${endContract.icon} ${endContract.name} ×${endContract.lpMult})</span>` : ''}`));
  for (const t of trophies) {
    wrap.append(el('p', 'trophy-toast', `${t.icon} Trophy: <b>${t.name}</b> — ${t.desc}`));
  }

  const menu = el('div', 'menu');
  if (summary?.cardLog?.length) {
    menu.append(btn('📖 Scrapbook (how it went down)', '', () => showScrapbook(summary)));
  }
  if (summary) {
    const shareBtn = btn('📣 Share this run', '', async () => {
      const text = shareTextFor(summary, lp);
      try {
        if (navigator.share) await navigator.share({ text });
        else {
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
    row.append(el('span', 'scrap-text',
      `<b>${fillText(ev.context)}</b> — “${choice ? choice.label : '?'}”`));
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
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'The Career Wall'));
  s.append(el('p', 'screen-sub', `Spend Legacy Points to widen the random pools. Balance: <b>${meta.lp} LP</b>`));

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
}

// ---------- Trophy Room ----------

function renderTrophies() {
  const s = $('#screen-trophies');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Trophy Room'));
  s.append(el('p', 'screen-sub', `${meta.trophies.length}/${TROPHIES.length} collected. Each one cost you something.`));

  if (meta.runHistory?.length) {
    s.append(el('h3', 'wall-tier', 'Past Lives'));
    const hist = el('div', 'history-list');
    for (const h of meta.runHistory) {
      const inst = instrumentById(h.instrument);
      const res = h.result ? h.result.toUpperCase()
        : { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' }[h.endingKey] || 'DNF';
      const pathName = h.path ? PATHS[h.path].name : '—';
      hist.append(el('div', 'history-row res-' + (h.result || 'fail'),
        `<span>${h.daily ? '📅 ' : ''}${inst ? inst.name : '?'} → ${pathName}</span>` +
        `<b>${res}</b><span class="hist-fame">★${h.fame}</span>`));
    }
    s.append(hist);
  }
  const grid = el('div', 'trophy-grid');
  for (const t of TROPHIES) {
    const owned = meta.trophies.includes(t.id);
    const cell = el('div', 'trophy' + (owned ? ' owned' : ''));
    cell.append(el('div', 'trophy-icon', owned ? t.icon : '❓'));
    cell.append(el('div', 'trophy-name', owned ? t.name : '???'));
    cell.append(el('div', 'trophy-desc', owned ? t.desc : 'Keep grinding.'));
    grid.append(cell);
  }
  s.append(grid);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { renderTitle(); show('#screen-title'); }));
  s.append(menu);
  show('#screen-trophies');
}

// ---------- Settings ----------

function renderSettings() {
  const s = $('#screen-settings');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Settings'));
  const menu = el('div', 'menu');
  menu.append(btn(`Sound effects: ${meta.settings.sound ? 'ON' : 'OFF'}`, '', () => {
    meta.settings.sound = !meta.settings.sound;
    setSoundEnabled(meta.settings.sound);
    save.saveMeta(meta);
    renderSettings();
  }));
  menu.append(btn(`Music: ${meta.settings.music !== false ? 'ON' : 'OFF'}`, '', () => {
    meta.settings.music = meta.settings.music === false;
    setMusicEnabled(meta.settings.music);
    save.saveMeta(meta);
    renderSettings();
  }));
  const rmLabel = meta.settings.reducedMotion === null ? 'SYSTEM'
    : meta.settings.reducedMotion ? 'ON' : 'OFF';
  menu.append(btn(`Reduced motion: ${rmLabel}`, '', () => {
    meta.settings.reducedMotion =
      meta.settings.reducedMotion === null ? true
        : meta.settings.reducedMotion === true ? false : null;
    save.saveMeta(meta);
    renderSettings();
  }));
  menu.append(btn('❓ How to play', '', showHelp));
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
  s.append(el('p', 'title-foot', 'BIG BREAK v0.1 — a satirical music-career roguelike. All characters are archetypes; any resemblance to real A&R reps is statistically inevitable.'));
  show('#screen-settings');
}
