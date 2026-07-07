// The music pack's result-overlay + card-choice presentation, moved out of
// js/ui/card.ts so the shared card screen names no music subsystem. The shell
// renders the generic result (tier, recap, delta chips, the deltas.notices
// channel, the shared gear-slot flow); these hooks add music's own voice:
// the subsystem notices, the rivalry/money/hit chip flourishes, the on-swipe
// minigame, and the contract-driven risk/encore gates.

import { minigameById, playMinigame } from './minigames.js';
import { contractById } from './data/contracts.js';
import { rivalById } from './data/rivals.js';
import { instrumentById } from './data/instruments.js';
import { track } from '../../analytics.js';
import { meta } from '../../ui/context.js';
import * as save from '../../save.js';
import { CONFIG } from '../../config.js';

// The rivalry / money / hit chip flourishes (else the shell's generic chip).
export function musicDeltaChip(key: string, amount: number, state: any): { cls: string; html: string } | null {
  const sign = amount > 0 ? '+' : '';
  if (key === 'rivalry') {
    const r = rivalById(state.rival);
    const nemesis = (meta.rivalCounts?.[state.rival] || 0) >= 3;
    return { cls: 'chip chip-rival',
      html: `⚔ ${amount > 0 ? 'Feud with' : 'Peace with'} ${nemesis ? 'your nemesis ' : ''}${r.name} ${sign}${amount}` };
  }
  if (key === 'money') {
    const good = amount > 0;
    return { cls: 'chip ' + (good ? 'chip-good' : 'chip-bad'), html: `${amount > 0 ? '+' : '−'}$${Math.abs(amount)}` };
  }
  if (key === 'hits') {
    return { cls: 'chip ' + (amount > 0 ? 'chip-good' : 'chip-bad'), html: `${sign}${amount} Hit!` };
  }
  return null;
}

// Music's result-overlay extras: the subsystem notices (gear/venue/song/band/
// hustle lines), whether the beat celebrates (viral debut), and the cash sound.
export function musicResultExtras(result: any, state: any) {
  const notices: { cls: string; html: string }[] = [];
  const notice = (cls: string, html: string) => notices.push({ cls, html });

  if (result.minigameInfo) {
    const m = result.minigameInfo;
    notice(m.bonus >= 0 ? 'notice-good' : 'notice-bad',
      `🎮 Performance: <b>${m.label}</b> — ${m.bonus >= 0 ? '+' : ''}${m.bonus} on that roll`);
  }
  if (result.encoreRefunded) notice('notice-encore', '🔥🎇 <b>ENCORE REFUNDED</b> — you spent it ON A ROLL and it came back');
  else if (result.encoreSpent) notice('notice-encore', '🎇 Encore spent — that roll was boosted');
  if (result.encoreEarned) notice('notice-encore', '🎇 <b>Encore earned</b> — bank it for the right card');
  if (!result.streakWasHot && (result.hotStreak || 0) === CONFIG.hotStreakAt && !state.tutorial) {
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
  const celebrate = (result.deltas.songDebuts || []).some((sd: any) => sd.viral);
  const cash = result.deltas.some((d: any) => d.key === 'money' && d.amount > 0);
  return { notices, celebrate, cash };
}

// A chosen card's on-swipe minigame: your performance becomes the swipe bonus.
// Returns a promise resolving to the perf (or null when there's no minigame /
// the player disabled them / it's the tutorial).
export function musicChoiceMinigame(choice: any, state: any): Promise<any> | null {
  const mgId = choice?.minigame;
  if (!(mgId && minigameById(mgId) && meta.settings.minigames !== false && !state.tutorial)) return null;
  const mgMods: any = contractById(state.contract)?.mods || {};
  return playMinigame(mgId, {
    run: state, rivalName: rivalById(state.rival)?.name,
    noSkip: !!mgMods.forceMinigames, relaxed: meta.settings.relaxedMinigames === true,
  }).then(({ score, verdict, detail }: any) => {
    // instrument hook: some gear makes performance moments play easier
    const mgHook = score == null ? 0 : (instrumentById(state.loadout)?.quirk?.hooks?.mgBonus || 0);
    let bonus = verdict.bonus + mgHook;
    // The Showman's Pact: botching on stage, under contract, hurts double
    if (verdict.label === 'BOTCHED' && mgMods.mgBotchDouble) bonus = verdict.bonus * 2;
    track('minigame', { id: mgId, card: state.currentEventId, score, bonus, skipped: score == null });
    if (score != null) {
      meta.minigamesPlayed = meta.minigamesPlayed || {};
      meta.minigamesPlayed[mgId] = (meta.minigamesPlayed[mgId] || 0) + 1;
      if (verdict.label === 'GOLDEN') meta.mgGolden = (meta.mgGolden || 0) + 1;
      save.saveMeta(meta);
    }
    return score != null ? { id: mgId, ...verdict, bonus, detail } : null;
  });
}

// Fold a minigame performance into the run's fiction: the scrapbook label and
// the skill-echo flags later cards key off.
export function musicRecordPerf(perf: any, state: any) {
  const logEntry = state.cardLog?.[state.cardLog.length - 1];
  if (logEntry) logEntry.m = perf.label; // the scrapbook remembers the performance
  if (perf.label === 'GOLDEN' && !state.flags.includes('mg_golden')) state.flags.push('mg_golden');
  if (perf.label === 'GOLDEN' && state.stats.burnout >= 60 && !state.flags.includes('mg_steady')) state.flags.push('mg_steady');
  if (perf.label === 'BOTCHED' && !state.flags.includes('mg_botched')) state.flags.push('mg_botched');
}

// Contract-driven card UI gates.
export const musicHideRisk = (state: any) => !!contractById(state.contract)?.mods?.hideRisk;
export const musicEncoreDisabled = (state: any) => !!contractById(state.contract)?.mods?.disableEncore;
export const musicChoiceHasMinigame = (choice: any, state: any) =>
  !!(choice.minigame && meta.settings.minigames !== false && !state.tutorial);
