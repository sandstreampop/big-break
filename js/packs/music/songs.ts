// BIG BREAK — the songs / charts subsystem. Music's flagship win-path
// machinery, kept out of the genre-agnostic core so it holds no song logic.
// DOM-free like the engine and charts.ts: it runs in the browser and in the
// sims. It draws the seeded play RNG through the engine's stateRng (so the
// stream stays shared), and reads its own weather/contract data directly (the
// way every other music plugin reads its data module).
//
// state.hits is incremented in exactly ONE place — the `crown` helper — called
// both when a charting song cracks the top 3 (crownCheck) and when an "instant
// classic" is minted below it (the songs plugin's hits handler).

import { CONFIG } from '../../config.js';
import { stateRng } from '../../engine.js';
import { weatherHooks } from './data/weather.js';
import { contractById } from './data/contracts.js';
import type { Song } from '../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// The one and only place state.hits changes: crowning a song IS the hit.
export function crown(state: any, s: any): void {
  s.crowned = true;
  state.hits += 1;
}

export function ensureSongs(state: any) {
  if (!state.songs) state.songs = [];
  // migrate old saves: chart titles become charting songs
  if (!state.songs.length && (state.chartTitles || []).length) {
    for (const title of state.chartTitles) {
      state.songs.push({
        id: 'legacy_' + state.songs.length, title, quality: 58, hype: 40,
        status: 'charting', origin: null, act: state.act,
        pos: null, prevPos: null, peak: null, weeks: 0, crowned: false,
      });
    }
    positionAll(state);
  }
  return state.songs;
}

function positionSong(state: any, s: any, rng: () => number) {
  const power = s.quality * 0.45 + s.hype * 0.35 + Math.min(100, state.fame) * 0.25 + (rng() * 16 - 8);
  if (power >= 88) return 1;
  if (power < 30) return null;
  return Math.max(1, Math.min(10, Math.round(11 - power / 9)));
}

function positionAll(state: any) {
  const rng = stateRng(state);
  for (const s of state.songs) {
    if (s.status !== 'charting') continue;
    s.pos = positionSong(state, s, rng);
  }
}

export function addSong(state: any, { title, quality, origin = null, status = 'demo', hype = 0 }: any) {
  ensureSongs(state);
  const s: Song = {
    id: 'song_' + (state.songs.length + 1) + '_' + (state.rngUses || 0),
    title, quality: clamp(Math.round(quality), 1, 100), hype: clamp(Math.round(hype), 0, 100),
    status: status as Song['status'], origin, act: state.act,
    pos: null, prevPos: null, peak: null, weeks: 0, crowned: false,
  };
  state.songs.push(s);
  // keep the legacy list in sync (discography, older UI paths)
  state.chartTitles = state.chartTitles || [];
  if (!state.chartTitles.includes(title)) state.chartTitles.unshift(title);
  if (status === 'charting') debutSong(state, s);
  return s;
}

export function releaseSong(state: any, songId: string, hype = 55) {
  ensureSongs(state);
  const s = state.songs.find((x: any) => x.id === songId);
  if (!s || s.status === 'charting') return null;
  s.status = 'charting';
  // Scene Weather: some eras are kind to release day (Vinyl Revival…)
  s.hype = clamp(Math.round(hype + (weatherHooks(state).releaseHype || 0)), 0, 100);
  debutSong(state, s);
  return s;
}

function debutSong(state: any, s: any) {
  const rng = stateRng(state);
  s.releasedAct = state.act; // The Deadline contract audits this
  s.pos = positionSong(state, s, rng);
  // The overnight-viral jackpot — 1 in 20 releases catches the wave.
  // Charts are the game's natural slot machine; this is the triple-7s.
  if (s.pos && !state.tutorial && rng() < CONFIG.viralChance) {
    s.viral = true;
    s.hype = clamp(s.hype + 30, 0, 100);
    s.pos = Math.max(1, s.pos - CONFIG.viralPosBoost);
  }
  if (s.pos) {
    s.weeks = 1;
    s.peak = s.pos;
    crownCheck(state, s);
  }
}

// The Deadline contract: a song must ship every act. Called at each act break
// (auditing the act that just ended) and once more at the finale. The penalty
// stat is named by the contract mod, not hardcoded.
export function deadlineAudit(state: any, act: number) {
  const dl = (contractById(state.contract)?.mods || {}).releaseDeadline;
  if (!dl) return [];
  const shipped = (state.songs || []).some((s: any) => s.releasedAct === act);
  if (shipped) return [`📠 The Deadline: act ${act} shipped. The label is quiet, which is love.`];
  state.fame = Math.max(0, state.fame - dl.fameLoss);
  state.stats[dl.stat] = clamp(state.stats[dl.stat] - dl.statLoss, 0, 100);
  return [`📠 The Deadline: nothing shipped in act ${act}. The label notes the silence. −${dl.fameLoss} Fame, −${dl.statLoss} ${dl.statLabel}`];
}

function crownCheck(state: any, s: any, notes?: string[]) {
  if (s.pos && s.pos <= 3 && !s.crowned) {
    crown(state, s);
    if (notes) notes.push(`♪ “${s.title}” cracks the top 3 — that’s a HIT`);
    return true;
  }
  return false;
}

// One chart week passes: act breaks and the finale call this. Returns notes
// (strings) and records the structured week on state.lastChartWeek so the
// act interstitial can stage it as a real moment (resume-safe: plain data).
export function chartTick(state: any) {
  ensureSongs(state);
  const rng = stateRng(state);
  const notes: string[] = [];
  const moves: any[] = [];
  for (const s of state.songs) {
    if (s.status !== 'charting') continue;
    s.prevPos = s.pos ?? null;
    s.pos = positionSong(state, s, rng);
    if (s.pos) {
      s.weeks += 1;
      if (s.peak == null || s.pos < s.peak) s.peak = s.pos;
      if (crownCheck(state, s, notes)) {
        moves.push({ title: s.title, kind: 'crown', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else if (!s.prevPos) {
        notes.push(`♪ “${s.title}” debuts at #${s.pos}`);
        moves.push({ title: s.title, kind: 'debut', from: null, to: s.pos, weeks: s.weeks });
      } else if (s.pos < s.prevPos) {
        notes.push(`♪ “${s.title}” climbs to #${s.pos}`);
        moves.push({ title: s.title, kind: 'climb', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else if (s.pos > s.prevPos) {
        notes.push(`♪ “${s.title}” slips to #${s.pos}`);
        moves.push({ title: s.title, kind: 'slip', from: s.prevPos, to: s.pos, weeks: s.weeks });
      } else {
        moves.push({ title: s.title, kind: 'hold', from: s.prevPos, to: s.pos, weeks: s.weeks });
      }
    } else {
      if (s.prevPos) {
        notes.push(`♪ “${s.title}” drops off the Hot 10 after ${s.weeks} week${s.weeks === 1 ? '' : 's'}`);
        moves.push({ title: s.title, kind: 'drop', from: s.prevPos, to: null, weeks: s.weeks });
      }
      s.status = 'faded';
    }
    s.hype = Math.round(s.hype * 0.55);
  }
  // The chart war: your best song vs the rival's single, same ten slots
  const best = state.songs.filter((s: any) => s.status === 'charting' && s.pos)
    .sort((a: any, b: any) => a.pos - b.pos)[0];
  if (best) {
    const rp = rivalChartPos(state);
    if (best.pos < rp && !state.flags.includes('chart_passed_rival')) {
      state.flags.push('chart_passed_rival');
      notes.push(`♪ “${best.title}” passes your rival on the chart. First blood.`);
      moves.push({ title: best.title, kind: 'rivalPassed', from: rp, to: best.pos, weeks: best.weeks });
    } else if (Math.abs(best.pos - rp) === 1) {
      moves.push({ title: best.title, kind: 'rivalNeck', from: rp, to: best.pos, weeks: best.weeks });
    }
  }
  state.lastChartWeek = moves.length ? { act: state.act, moves } : null;
  return notes;
}

// Where the rival's single sits on the Hot 10 (shared with charts.ts so the
// rendered chart and the chart-war logic never disagree): they start high and
// sink as your fame grows — but a hot rivalry keeps them sharp.
export function rivalChartPos(state: any) {
  return Math.max(1, Math.min(10,
    9 - Math.floor(state.fame / 22) - Math.floor((state.rivalry ?? 3) / 3)));
}

// The song most worth talking about right now (for {song} templating)
export function flagshipSong(state: any) {
  ensureSongs(state);
  const charting = state.songs.filter((s: any) => s.status === 'charting' && s.pos);
  if (charting.length) return charting.sort((a: any, b: any) => a.pos - b.pos)[0];
  const demos = state.songs.filter((s: any) => s.status === 'demo');
  if (demos.length) return demos[demos.length - 1];
  return state.songs[state.songs.length - 1] || null;
}
