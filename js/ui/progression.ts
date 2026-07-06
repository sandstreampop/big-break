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
import { rivalById } from '../data/rivals.js';
import { genreById } from '../data/genres.js';
import { buildChart } from '../charts.js';
import { releaseSong } from '../songs.js';
import { sfx } from '../audio.js';
import { el, $, keyable, vibrate, openOverlay, spawnConfetti, show } from './dom.js';
import { activePack, run, PRES, PATHS, metaFor, fillText } from './context.js';
import { pathFit, gateReadout } from './gates.js';
import { feedTeaser } from './feeds.js';
import { nav } from './nav.js';

// ---------- The Brammies (Pass 44) ----------
// Procedural awards night: you're nominated against your rival and two
// chart acts. You pick what to PREPARE; the seeded outcome pays off
// against your preparation.

export function showBrammies(step) {
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

export function renderFinalSet() {
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
