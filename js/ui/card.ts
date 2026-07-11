// BIG BREAK — the run loop: the card, its swipe physics, and the result.
//
// The heart of play and the tightest cycle in the game: deal a card → drag or
// tap → resolve the swipe → show the result → advance, which deals the next
// card. That loop stays whole inside this one deep module; its only exit to the
// rest of the flow is routeAdvance (from the nav seam), which the result's
// dismiss and the forced-choice overlays call to move on. Everything below —
// the stage, set-piece beat, drag gesture, lean/risk tells, minigame handoff,
// and the result overlay with its notices and gear choosers — is internal.

import * as engine from '../engine.js';
import * as save from '../save.js';
import { CONFIG } from '../config.js';
import { artFor, sceneFor } from '../art.js';
import { sfx, ambient } from '../audio.js';
import { track } from '../analytics.js';
import {
  el, $, activatable, btn, reducedMotion, vibrate, openOverlay, openPortrait,
  spawnConfetti, coachMark, show, responsivePicture,
} from './dom.js';
import {
  activePack, run, PRES, meta, metaFor, fillText, itemById, vibeFor, STAT_META,
} from './context.js';
import { renderHud, spawnStatFloaters } from './hud.js';
import { showInspect } from './inspectors.js';
import { feedTeaser } from './feeds.js';
import { routeAdvance } from './nav.js';

let currentCard = null;
let currentEvent = null; // the event behind currentCard (minigame lookup)
let encoreArmed = false;
let lastSwipeSide = null; // Epic 6 morph: the direction the last card flew, so
                          // the result card can spring in from that same side


// A face's inner HTML: a real portrait image when the presenter supplies one
// (face object carries `portraitSrc`), else the emoji glyph — the same
// "real asset wins, else fall back" rule js/art.ts uses for scene art. The mood
// emoji rides on top as a badge either way. Genre-neutral: the shell renders
// whatever the pack's face object carries; only packs that generate portraits
// set the field.
function faceInner(f: { face?: string; moodFace?: string | null; portraitSrc?: string }): string {
  // Stage/result faces (44–64px CSS) — in view immediately, so load eagerly.
  const base = f.portraitSrc
    ? responsivePicture(f.portraitSrc, { className: 'face-portrait', sizes: '64px', eager: true })
    : (f.face || '');
  return `${base}${f.moodFace ? `<span class="stage-moodface">${f.moodFace}</span>` : ''}`;
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
    slot.append(el('div', 'stage-face', faceInner(s)));
    slot.append(el('div', 'stage-name', s.name));
    if (s.read) slot.append(el('div', 'stage-read', s.read));
    if (s.sheet) activatable(slot, () => { sfx.ui(); showInspect(s.sheet); });
    host.append(slot);
  }
}

export function dealCard() {
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

  // The bard's own beat (presenter.preCardBeat): a named speaker's full-screen
  // turn BEFORE the card — the odyssey bard leaning in between cards, distinct
  // from a playable choice card. One tap to continue, then the scene/card
  // deals. Fires ahead of the set-piece so the frame voice precedes the beat
  // it is framing. (No re-show risk within a deal: continue calls proceedDeal,
  // not dealCard; a resumed run simply re-hears the line, harmless.)
  const beat = PRES.preCardBeat?.(run, ev);
  if (beat && beat.blocks?.length) {
    showBardBeat(beat, () => proceedDeal(ev));
    return;
  }
  proceedDeal(ev);
}

// The set-piece-or-card tail of a deal, reachable directly or after a
// preCardBeat. A set-piece is a SEQUENCE, not a stack (ADR-0009): the framed
// moment plays as its own beat, then the card deals with the whole screen to
// itself. `spSeen` makes the beat once per moment — keyed by the pack's arc
// key when it gives one, else by card id (a resumed run goes straight to it).
function proceedDeal(ev) {
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

// The bard's full-screen beat: a fireside panel of quoted dialogue — the
// bard's own lines and any heckler's interjection, each a separate attributed
// quote — with one tap to continue. Mirrors showSetPieceBeat's shape (a
// dismissable overlay whose close proceeds), so it carries the same
// no-soft-lock guarantee: dismissing always continues to the card.
function showBardBeat(beat, cont) {
  openOverlay((ov) => {
    const box = el('div', 'bard-beat ' + (beat.cls || ''));
    box.append(el('div', 'bard-beat-kicker', 'AT THE FIRE'));
    const dlg = el('div', 'bard-beat-dialogue');
    for (const b of beat.blocks) {
      const isBard = !b.who || b.who === 'bard';
      const line = el('div', 'bard-line ' + (isBard ? 'is-bard' : 'is-heckle'));
      if (!isBard) line.append(el('div', 'bard-who', '— ' + b.who));
      line.append(el('div', 'bard-quote', '“' + fillText(b.text) + '”'));
      dlg.append(line);
    }
    box.append(dlg);
    box.append(el('p', 'tap-hint', beat.cont || 'tap to continue'));
    ov.append(box);
  }, { armMs: 250, onClose: cont });
}

// The framed moment: full-screen banner + stakes, one tap to the card.
// The feel cues (R11's mood contract) play here, at the beat.
function showSetPieceBeat(sp, cont) {
  openOverlay((ov) => {
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
  }, { armMs: 250, onClose: cont });
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
      const inner = c.portraitSrc
        ? responsivePicture(c.portraitSrc, { className: 'face-portrait', sizes: '30px', eager: true })
        : (c.face || '');
      const chip = el('div', 'cast-chip' + (c.cls ? ' ' + c.cls : ''),
        `<span class="cast-face">${inner}${c.moodFace ? `<span class="cast-moodface">${c.moodFace}</span>` : ''}</span>` +
        `<span class="cast-id"><span class="cast-name">${c.name}</span>${c.sub ? `<span class="cast-sub">${c.sub}</span>` : ''}</span>`);
      // A real portrait taps through to the full-size lightbox; emoji faces
      // stay inert (nothing to enlarge).
      if (c.portraitSrc) {
        chip.classList.add('cast-chip-tappable');
        activatable(chip, (e) => { e.stopPropagation(); sfx.ui(); openPortrait(c.portraitSrc, { name: c.name, sub: c.sub }); }, `Enlarge ${c.name}`);
      }
      strip.append(chip);
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

  // Risk dots recompute when an Encore is armed/disarmed. A pack modifier may
  // hide them entirely (music's Imposter Syndrome contract).
  const hideRisk = !!PRES.hideRisk?.(run);
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
    const mg = (c) => (PRES.choiceHasMinigame?.(c, run) ? '<span class="mg-flag">🎮</span>' : '');
    bL.innerHTML = `<span class="choice-meta"><span class="dir">◀</span>${dot(oL)}<span class="gov-row">${govIcons(ev.choices.left)}</span>${mg(ev.choices.left)}</span><span class="btn-label">${fillText(ev.choices.left.label)}</span>`;
    bR.innerHTML = `<span class="choice-meta"><span class="dir">▶</span>${dot(oR)}<span class="gov-row">${govIcons(ev.choices.right)}</span>${mg(ev.choices.right)}</span><span class="btn-label">${fillText(ev.choices.right.label)}</span>`;
  };
  paintOdds();

  // Encore arm toggle (Pass 2 mechanic)
  const encoreBar = $('#encore-bar');
  encoreBar.innerHTML = '';
  if ((run.encore || 0) > 0 && !PRES.encoreDisabled?.(run)) {
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

export function commitSwipe(side, dx = 0, dy = 0) {
  if (!currentCard) return;
  // A chosen card may carry a pack minigame (music's performance beats): the
  // shell freezes the card, the pack runs its own screen, and its perf becomes
  // the swipe bonus. Packs without one resolve straight through.
  const mg = PRES.choiceMinigame?.(currentEvent?.choices?.[side], run);
  if (mg) {
    const card = currentCard;
    currentCard = null; // freeze the card while the minigame runs
    card.style.transform = ''; // snap back from any drag offset
    mg.then((perf) => {
      currentCard = card; // hand back for the normal path
      finishSwipe(side, dx, dy, perf);
    });
    return;
  }
  finishSwipe(side, dx, dy, null);
}

function finishSwipe(side, dx = 0, dy = 0, perf = null) {
  if (!currentCard) return;
  const card = currentCard;
  currentCard = null;
  lastSwipeSide = side; // the result card will spring in from this side (morph)
  sfx.swipe();

  const armed = encoreArmed;
  const result = engine.resolveSwipe(run, side, engine.stateRng(run), {
    encore: encoreArmed, bonus: perf?.bonus || 0,
    mgDetail: perf ? { label: perf.label, hooks: perf.detail?.hooks } : null,
  });
  if (perf) {
    result.minigameInfo = perf; // carry the pack's perf onto the result
    PRES.recordPerf?.(perf, run); // the pack folds it into its own fiction
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


// ---------- Result overlay ----------

const TIER_LABEL = {
  bad: 'BAD', good: 'GOOD', incredible: 'INCREDIBLE', declined: 'DECLINED',
};

function showResult(result) {
  if (result.tier === 'incredible') { sfx.incredible(); vibrate([30, 40, 30, 40, 60]); }
  else if (result.tier === 'good') sfx.good();
  else { sfx.bad(); vibrate(80); }

  // Forced-choice paths (shop shelf pick / gear-full chooser) don't arm the
  // tap-to-continue dismiss — you must pick a button. The normal path advances
  // on dismiss (tap or Escape). `handled` lets a button do its own routing and
  // suppress the default advance in onClose.
  const shelf0 = result.deltas.pendingGearChoices;
  const pending0 = result.deltas.pendingGear;
  const forced = !!(shelf0 && shelf0.length) ||
    (!!pending0 && (run.accessories || []).length >= CONFIG.accessorySlots);
  let handled = false;
  const onClose = () => {
    if (handled) return;
    routeAdvance(engine.advance(run));
    meta.coach = meta.coach || {};
    if (!run.tutorial && !meta.coach.result) {
      meta.coach.result = true;
      save.saveMeta(meta);
      coachMark('Outcomes have three tiers — your stats and gear tilt the roll. Build what your path needs; watch 🔥 Burnout.');
    }
  };
  openOverlay((ov, close) => {
  const box = el('div', `result-card tier-${result.tier}`);
  // Announce the outcome to assistive tech (Epic 7): a swipe result was
  // previously silent for screen-reader users. role="status" makes the card a
  // polite live region, so the tier + text + deltas are read on reveal.
  box.setAttribute('role', 'status');
  if (result.tier === 'incredible') spawnConfetti(ov);
  if ((result.tier === 'bad' || result.tier === 'declined') && !reducedMotion()) {
    box.classList.add('shake');
    ov.classList.add('flash-bad');
    setTimeout(() => ov.classList.remove('flash-bad'), 500);
  } else if (!reducedMotion() && lastSwipeSide) {
    // Shared-element morph (Epic 6): the swiped card just flew off in a
    // direction — the result card springs in from that same side, so the two
    // moments read as one continuous gesture instead of two separate reveals.
    box.classList.add('morph-in');
    box.style.setProperty('--morph-dx', `${(lastSwipeSide === 'left' ? -1 : 1) * 34}px`);
  }
  box.append(el('div', 'tier-badge', TIER_LABEL[result.tier]));
  // The recap strip: ground the outcome in what it answered. A player who put
  // the phone down mid-run reads the moment they were in and the call they
  // made, on the same screen as how it landed. `recap` is the authored one-
  // line summary; `context` (the scene label) is the fallback. The chosen
  // choice's label is the "what I chose" half — declined cards keep the recap
  // (you still made a call) but have no landed choice to echo.
  const rev = result.event;
  if (rev) {
    const recapText = rev.recap || rev.context;
    const chosen = result.side && rev.choices?.[result.side]?.label;
    if (recapText || chosen) {
      const recap = el('div', 'result-recap');
      if (recapText) recap.append(el('div', 'recap-event', fillText(recapText)));
      if (chosen) {
        recap.append(el('div', 'recap-choice',
          `<span class="recap-you">You chose</span> ${fillText(chosen)}`));
      }
      box.append(recap);
    }
  }
  // The result beat (presenter.resultStage): the pack's read of HOW this
  // landed — a reacting portrait front and centre, then qualitative movement
  // lines below the outcome text. The keys it claims lose their numeric chip.
  const rs = PRES.resultStage?.(run, result);
  if (rs?.portrait) {
    const p = rs.portrait;
    const po = el('div', 'result-portrait' + (p.cls ? ' ' + p.cls : ''));
    const face = el('div', 'result-face', faceInner(p));
    // Press the reacting face to see it full-size (real portraits only).
    if (p.portraitSrc) {
      face.classList.add('result-face-tappable');
      activatable(face, (e) => { e.stopPropagation(); sfx.ui(); openPortrait(p.portraitSrc, { name: p.name, sub: p.sub }); }, `Enlarge ${p.name || 'portrait'}`);
    }
    po.append(face);
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

  // ADR-0014 — the second screen. The outside world reacts to this beat. It
  // sits directly UNDER the result (the outcome is what matters first), but
  // above the mechanical chips/notices so it's a prominent, tappable
  // invitation — not a footnote below the fold. On the big moments only;
  // ambient cards return null and stay quiet.
  const feedBundle = PRES.feeds?.(run, { kind: 'result', ev: result.event, tier: result.tier, side: result.side });
  if (feedBundle) box.append(feedTeaser(feedBundle, true, { key: `result:${result.event?.id || '?'}:${run.cardLog?.length ?? 0}` }));

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
  // The generic notices channel: pack plugins push {cls, html} sentences the
  // shell can't know about.
  for (const n of result.deltas.notices || []) notice(n.cls || 'notice-gear', fillText(n.html));
  // The pack's own result voice (music's gear/venue/song/band lines, its
  // viral celebration, its cash sound) — presenter.resultExtras.
  const extras = PRES.resultExtras?.(result, run);
  for (const n of extras?.notices || []) notice(n.cls, fillText(n.html));
  if (extras?.celebrate) { spawnConfetti(ov); sfx.win(); }
  box.append(notices);
  if (extras?.cash) sfx.cash();

  // Shop shelf: choose which item you actually bought (Pass 33)
  const shelf = result.deltas.pendingGearChoices;
  if (shelf?.length) {
    box.append(el('p', 'gear-blurb', '🧰 The shelf — pick one:'));
    const list = el('div', 'gear-choices');
    for (const acc of shelf) {
      list.append(btn(`${acc.name} — ${acc.blurb}`, '', () => {
        handled = true; close();
        if ((run.accessories || []).length < CONFIG.accessorySlots) {
          PRES.equipItem?.(run, acc.id);
          save.saveRun(run);
          routeAdvance(engine.advance(run));
        } else {
          gearChooser(acc, result);
        }
      }));
    }
    box.append(list);
    ov.append(box);
    return; // wait for the shelf pick
  }

  // Gear gained?
  const pending = result.deltas.pendingGear;
  if (pending) {
    if ((run.accessories || []).length < CONFIG.accessorySlots) {
      const extra = PRES.equipItem?.(run, pending.id) || [];
      save.saveRun(run);
      for (const d of extra) chips.append(deltaChip(d.key, d.amount));
      notice('notice-gear', `🧰 <b>${pending.name}</b> is yours${pending.blurb ? ' — ' + pending.blurb : ''}`);
    } else {
      box.append(el('p', 'gear-blurb', `🧰 <b>${pending.name}</b> is yours — but your ${CONFIG.accessorySlots} slots are full.`));
      box.append(btn('Choose what to keep', 'primary', () => {
        handled = true; close();
        gearChooser(pending, result);
      }));
      ov.append(box);
        return; // wait for chooser
    }
  }

  // Unbounded staggered reveal (Epic 6): number every chip and notice in
  // document order so the CSS cascade (--ri) keeps flowing across the whole
  // result — the old nth-child ladder silently stopped after the first few.
  [...box.querySelectorAll('.chip, .notice')].forEach(
    (e, i) => (e as HTMLElement).style.setProperty('--ri', String(i)));
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  }, { dismissable: !forced, armMs: 250, onClose });
}

function deltaChip(key, amount) {
  // A pack may give a key its own chip flourish (music's rivalry/money/hit);
  // otherwise the generic manifest-driven chip below covers any stat/resource.
  const custom = PRES.deltaChip?.(key, amount, run);
  if (custom) return el('span', custom.cls, custom.html);
  const sign = amount > 0 ? '+' : '';
  const goodDelta = key === 'burnout' ? amount < 0 : amount > 0;
  const label = metaFor(key).name;
  const icon = metaFor(key).icon;
  return el('span', 'chip ' + (goodDelta ? 'chip-good' : 'chip-bad'),
    `${icon} ${sign}${amount} ${label}`);
}

function gearChooser(newAcc, result) {
  // Forced choice: no backdrop dismiss. Each button does its own setup then
  // close(); the shared advance runs once, on close (Escape = leave behind).
  openOverlay((ov, close) => {
    const box = el('div', 'result-card');
    box.append(el('div', 'tier-badge', 'GEAR FULL'));
    box.append(el('p', 'result-text', `Swap something out for the <b>${newAcc.name}</b>?`));
    const list = el('div', 'gear-choices');
    for (const id of run.accessories || []) {
      const acc = itemById(id);
      if (!acc) continue;
      list.append(btn(`Drop ${acc.name}`, '', () => {
        PRES.equipItem?.(run, newAcc.id, id);
        save.saveRun(run);
        close();
      }));
    }
    list.append(btn(`Leave the ${newAcc.name} behind`, 'ghost', () => close()));
    box.append(list);
    ov.append(box);
  }, { dismissable: false, onClose: () => routeAdvance(engine.advance(run)) });
}

