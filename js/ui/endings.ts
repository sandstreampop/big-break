// BIG BREAK — endings: judgment, game-over, and the ending screen.
//
// The close of a run: renderFinale evaluates the committed path and scores it;
// renderGameOver handles the fail states (with the optional exit interview);
// both land in renderEndingScreen — the verdict ribbon, gate scoreboard, LP,
// trophies, discography, epilogue, final feeds, share, and scrapbook. The
// meta-bookkeeping (finishMeta: LP, trophies, lifetime aggregates, run history)
// lives here too. When the player leaves the ending, it calls the nav seam
// (nav.newRun / nav.wall / nav.title).

import * as engine from '../engine.js';
import * as save from '../save.js';
import { CONFIG } from '../config.js';
import { artFor } from '../art.js';
import { sfx, music } from '../audio.js';
import { track } from '../analytics.js';
import { el, $, btn, show, openOverlay, todayStr } from './dom.js';
import { activePack, run, PRES, PATHS, meta, metaFor, fillText, vibeFor, failLabelFor } from './context.js';
import { gateReadout } from './gates.js';
import { feedTeaser } from './feeds.js';
import { nav } from './nav.js';

// ---------- Endings ----------

function finishMeta(summary, lp) {
  meta.runs += 1;
  meta.lp += lp;
  meta.lpEarnedTotal += lp;
  meta.best.lp = Math.max(meta.best.lp, lp);
  if (summary.daily) {
    meta.dailyResults = meta.dailyResults || {};
    if (!meta.dailyResults[summary.daily]) {
      meta.dailyResults[summary.daily] = { result: summary.result, path: summary.path };
    }
    summary.dailyStreak = dailyStreakFor(summary.daily); // trophies + share read it
  }
  if (summary.gauntlet) {
    meta.gauntletResults = meta.gauntletResults || {};
    if (!meta.gauntletResults[summary.gauntlet]) {
      meta.gauntletResults[summary.gauntlet] = { result: summary.result, path: summary.path };
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

  // Lifetime aggregates (Pass 25): the genre-neutral counts + the per-loadout
  // and per-path win records (generic — keyed by loadout/path; `byInstrument`
  // is the legacy key name, kept for save compatibility, and feeds the generic
  // loadout-mastery the engine applies). The pack folds in its own aggregates
  // (music's hits / best bank) via recordMeta below.
  const lt = meta.lifetime = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byInstrument: {}, byPath: {} };
  lt.swipes += (summary.tierLog || []).length;
  lt.incredibles += (summary.tierLog || []).filter((t) => t === 'incredible').length;
  lt.bads += (summary.tierLog || []).filter((t) => t === 'bad').length;
  lt.byInstrument = lt.byInstrument || {};
  const bi = lt.byInstrument[summary.loadout] = lt.byInstrument[summary.loadout] || { runs: 0, wins: 0 };
  bi.runs += 1;
  if (summary.result === 'success') bi.wins += 1;
  if (summary.path) {
    lt.byPath = lt.byPath || {};
    const bp = lt.byPath[summary.path] = lt.byPath[summary.path] || { runs: 0, wins: 0 };
    bp.runs += 1;
    if (summary.result === 'success') bp.wins += 1;
  }

  // The pack's own end-of-run meta writes (music: best fame, nemesis ledger,
  // lifetime hits/bank).
  PRES.recordMeta?.(meta, summary);
  meta.runHistory = meta.runHistory || [];
  meta.runHistory.unshift({
    date: todayStr(),
    loadout: summary.loadout,
    path: summary.path,
    result: summary.result,
    endingKey: summary.endingKey,
    daily: !!summary.daily,
    ...(PRES.historyEntry?.(summary) || {}), // the pack's own row fields (music: fame)
  });
  meta.runHistory = meta.runHistory.slice(0, 10);

  const earned = [];
  // A trophy fires on either a pure summary predicate (t.check) or a
  // ledger-reading "special" the pack supplies (presenter.trophySpecials) —
  // the shell's trophy loop names no genre.
  const specials = PRES.trophySpecials || {};
  for (const t of (PRES.trophies || [])) {
    if (meta.trophies.includes(t.id)) continue;
    let ok = false;
    if (t.special) ok = !!specials[t.special]?.(meta);
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

export function renderFinale() {
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

export function renderGameOver(endingKey) {
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

// The engine's universal outcome tiers → the share-grid glyphs (the tier strip
// and scrapbook). Genre-neutral: every pack rolls the same four tiers.
const TIER_EMOJI: Record<string, string> = { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };

// Consecutive daily-mode days ending at `d` (inclusive) — the streak the
// share card and the pack's end note read. Pure ledger walk.
function dailyStreakFor(d) {
  const done = meta.dailyResults || {};
  let n = 0;
  const day = new Date(d + 'T12:00:00Z');
  while (done[day.toISOString().slice(0, 10)]) { n++; day.setUTCDate(day.getUTCDate() - 1); }
  return n;
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

  // The pack's legacy lines (music's chart legacy) + its LP-award note (the
  // contract multiplier). The shell knows the layout, never the content.
  const endExtras = PRES.endingExtras?.(summary, run) || { lines: [], lpNote: '' };
  for (const line of endExtras.lines) wrap.append(el('p', line.cls, line.html));

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
  wrap.append(el('p', 'lp-award', `+${lp} Legacy Points${endExtras.lpNote}`));
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
      const text = PRES.shareText?.(summary, lp) || '';
      try {
        // A pack may compose a poster image (music); text-only packs share the
        // string. The native sheet is preferred; clipboard is the fallback.
        const file = PRES.shareImage ? await PRES.shareImage(summary, lp, ending.title) : null;
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

