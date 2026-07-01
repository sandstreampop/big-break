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
import { sfx, setSoundEnabled, initAudio } from './audio.js';

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
  document.addEventListener('pointerdown', initAudio, { once: true });
  renderTitle();
  show('#screen-title');
}

function renderTitle() {
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
    menu.append(btn('▶ New Run', 'primary', startNewRun));
  }
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

function startNewRun() {
  const offered = engine.offerInstruments(save.unlockedInstrumentIds(meta));
  const s = $('#screen-instruments');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', 'Choose your weapon'));
  s.append(el('p', 'screen-sub', 'Each one is almost useless. That’s the point.'));
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
      run = engine.newRun(inst.id, save.unlockedPackIds(meta));
      save.saveRun(run);
      dealCard();
    });
    row.append(card);
  }
  s.append(row);
  show('#screen-instruments');
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
  const top = el('div', 'hud-top');
  top.append(el('span', 'hud-act', `ACT ${run.act} · ${['', 'The Garage', 'The Grind', 'The Reckoning'][run.act]}`));
  const counters = el('span', 'hud-counters');
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
  for (const id of run.accessories) {
    const acc = accessoryById(id);
    const active = accActive(acc);
    gearRow.append(el('span', 'gear-chip' + (active ? '' : ' inert'), acc.name + (active ? '' : ' 💤')));
  }
  hud.append(gearRow);
}

function accActive(acc) {
  if (acc.compatibility?.universal) return true;
  return (acc.compatibility?.families || []).includes(instrumentById(run.instrument).family);
}

let currentCard = null;

function dealCard() {
  show('#screen-game');
  renderHud();
  const ev = engine.drawNextCard(run);
  if (!ev) { // deck ran dry — act ends early
    run.cardsPlayedInAct = CONFIG.actLengths[run.act];
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

  const odds = {
    left: engine.choiceOdds(run, ev.choices.left),
    right: engine.choiceOdds(run, ev.choices.right),
  };
  hintL.innerHTML = `<span class="risk ${riskClass(odds.left)}"></span>${ev.choices.left.label}`;
  hintR.innerHTML = `${ev.choices.right.label}<span class="risk ${riskClass(odds.right)}"></span>`;

  // Tap-friendly fallback buttons (spec §10/§12)
  const controls = $('#choice-buttons');
  controls.innerHTML = '';
  const bL = el('button', 'choice-btn choice-left');
  bL.innerHTML = `<span class="dir">◀</span><span class="risk ${riskClass(odds.left)}"></span> ${ev.choices.left.label}`;
  const bR = el('button', 'choice-btn choice-right');
  bR.innerHTML = `${ev.choices.right.label} <span class="risk ${riskClass(odds.right)}"></span><span class="dir">▶</span>`;
  bL.addEventListener('click', () => commitSwipe('left'));
  bR.addEventListener('click', () => commitSwipe('right'));
  controls.append(bL, bR);

  if (!reducedMotion()) {
    card.classList.add('deal-in');
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('deal-in')));
    attachDrag(card, bL, bR);
  } else {
    attachDrag(card, bL, bR); // drag still works, snap without spring
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

  const result = engine.resolveSwipe(run, side);
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

// ---------- Result overlay ----------

const TIER_LABEL = {
  bad: 'BAD', good: 'GOOD', incredible: 'INCREDIBLE', declined: 'DECLINED',
};

function showResult(result) {
  if (result.tier === 'incredible') sfx.incredible();
  else if (result.tier === 'good') sfx.good();
  else sfx.bad();

  const ov = $('#overlay');
  ov.innerHTML = '';
  ov.classList.add('active');

  const box = el('div', `result-card tier-${result.tier}`);
  box.append(el('div', 'tier-badge', TIER_LABEL[result.tier]));
  box.append(el('p', 'result-text', fillText(result.text)));

  const chips = el('div', 'delta-chips');
  for (const d of result.deltas) {
    chips.append(deltaChip(d.key, d.amount));
  }
  if (result.gearLost) chips.append(el('span', 'chip chip-bad', `− ${result.gearLost.name} (lost!)`));
  box.append(chips);

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
  renderEndingScreen(ending, lp, earned, evalr);
}

function renderGameOver(endingKey) {
  const summary = engine.runSummary(run);
  const lp = engine.legacyPoints(run);
  const earned = finishMeta(summary, lp);
  sfx.gameover();
  renderEndingScreen(ENDINGS[endingKey], lp, earned, null);
}

function renderEndingScreen(ending, lp, trophies, evalr) {
  const s = $('#screen-ending');
  s.innerHTML = '';
  const wrap = el('div', 'ending-wrap');
  wrap.append(artFor(ending.art, 'ending-art'));
  wrap.append(el('h2', 'ending-title', ending.title));
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

  wrap.append(el('p', 'lp-award', `+${lp} Legacy Points`));
  for (const t of trophies) {
    wrap.append(el('p', 'trophy-toast', `${t.icon} Trophy: <b>${t.name}</b> — ${t.desc}`));
  }

  const menu = el('div', 'menu');
  menu.append(btn('▶ Run It Back', 'primary', startNewRun));
  menu.append(btn(`🏆 Career Wall (${meta.lp} LP)`, '', renderWall));
  menu.append(btn('🏠 Title', '', () => { renderTitle(); show('#screen-title'); }));
  wrap.append(menu);
  s.append(wrap);
  show('#screen-ending');
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
  menu.append(btn(`Sound: ${meta.settings.sound ? 'ON' : 'OFF'}`, '', () => {
    meta.settings.sound = !meta.settings.sound;
    setSoundEnabled(meta.settings.sound);
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
