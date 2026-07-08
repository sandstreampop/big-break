// BIG BREAK — progression screens: the act structure between the cards.
//
// The beats that punctuate a run: the Act-1 Crossroads path choice, the act
// interstitial ("previously on" + chart week + trades), a pack's optional
// act-start set piece (music's Brammies), and the pre-finale Final Set where
// you pick the closer that pushes you over a gate. Each reads the run + the
// pack presenter and, when it's time to move on, calls the nav seam
// (nav.dealCard / nav.actInterstitial / nav.finale) — it never touches another
// screen module directly.

import * as engine from '../engine.js';
import * as save from '../save.js';
import { CONFIG } from '../config.js';
import { sfx } from '../audio.js';
import { el, $, keyable, vibrate, openOverlay, spawnConfetti, show } from './dom.js';
import { activePack, run, PRES, PATHS, metaFor, fillText } from './context.js';
import { pathFit, gateReadout } from './gates.js';
import { feedTeaser } from './feeds.js';
import { nav } from './nav.js';

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

export function renderFinalSet() {
  // The pre-finale set piece is the pack's (head/sub/options); the shared
  // screen below renders it and annotates each closer against the win gates.
  const fs = PRES.finalSet!(run);
  renderFinalSetScreen(fs.head, fs.sub, fs.options);
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

export function actInterstitial(step) {
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
    const intro = PRES.actIntro?.[step.act];
    if (intro) {
      box.append(el('p', 'result-text act-name', intro.name));
      box.append(el('p', 'result-text', intro.text));
    }
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

  // The act-break standings panel is the pack's (music's "This week on the Hot
  // 10"): the shell renders the rows it returns and fires the celebration beat
  // if the week earned one. Packs without standings return null.
  const chart = PRES.actBreakChart?.(run);
  if (chart) {
    const cw = el('div', 'act-break-chart');
    cw.append(el('div', 'trades-head', chart.head));
    for (const r of chart.rows) cw.append(el('div', r.cls, r.html));
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
  if (recapFeed) box.append(feedTeaser(recapFeed, true, { key: `recap:${step.act}` }));
  box.append(el('p', 'tap-hint', 'tap to continue'));
  ov.append(box);
  if (chart?.celebrate) { spawnConfetti(ov); sfx.win(); vibrate([30, 40, 30, 40, 80]); }
 }, { armMs: 250, onClose: () => nav.dealCard() });
}

// ---------- Crossroads (spec §7.2) ----------

export function renderCrossroads() {
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
