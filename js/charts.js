// The Big Break Hot 10 — a procedural fake chart the run climbs.
// Deterministic per (chartSeed, act): stable while you check it mid-act,
// reshuffles between acts. Your songs enter based on fame + hits; the
// rival is always lurking somewhere in it.

import { rivalById } from './data/rivals.js';

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ADJ = ['Conditional', 'Parking Lot', 'Emotional', 'Lowercase', 'Infinite', 'Discount',
  'Golden Hour', 'Feral', 'Corporate', 'Midnight', 'Artisanal', 'Post-', 'Unskippable',
  'Barefoot', 'Borrowed', 'Glitter', 'Basement', 'Terminal', 'Soft Launch', 'Rent-Controlled'];
const NOUN = ['Halo', 'Arithmetic', 'Girlfriend', 'Layover', 'Apology', 'Mercury', 'Cowboy',
  'Situationship', 'Voicemail', 'Angel Investor', 'Summer', 'Blackout', 'Merch Table',
  'Heartbeat', 'Landlord', 'Renaissance', 'Group Chat', 'Encore', 'Mood Board', 'Sequel'];
const SUFFIX = ['', '', '', ' (Remix)', ' (Sped Up)', ' — Acoustic', ' (feat. no one)', ' II'];

const ARTISTS = ['The Algorithm', 'Brayden', 'Yacht Arithmetic', 'DJ Mattress Emporium',
  'The Nepo Babies', 'Craig (Bagpipes)', 'GRIND™ presents: Hustle', 'Soup Man',
  'Vibe Committee', 'The Petersen Twins', 'Focus Beats for Chinchillas', 'Todd',
  'The Other Bands', 'Juniper (Film Student)', 'Approachable Lightning', 'The 11 Writers'];

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function songName(rng) { return pick(rng, ADJ) + ' ' + pick(rng, NOUN) + pick(rng, SUFFIX); }

// Your chart footprint: how many songs you have on, and your peak position
export function playerChartInfo(state) {
  const score = state.fame + state.hits * 15;
  const entries = Math.min(3, (state.hits > 0 ? 1 : 0) + (state.fame >= 45 ? 1 : 0) + (state.fame >= 85 ? 1 : 0));
  if (entries === 0 || score < 20) return { entries: 0, peak: null };
  const peak = Math.max(1, Math.min(10, 11 - Math.floor(score / 12)));
  return { entries, peak };
}

export function buildChart(state) {
  const rng = mulberry32((state.chartSeed || 1) * 7919 + state.act * 104729);
  const rival = rivalById(state.rival);
  const info = playerChartInfo(state);

  const rows = [];
  // filler industry product
  const artists = [...ARTISTS];
  for (let i = 0; i < 10; i++) {
    const ai = Math.floor(rng() * artists.length);
    rows.push({
      artist: artists.splice(ai, 1)[0] || 'Various',
      song: songName(rng),
      weeks: 1 + Math.floor(rng() * 11),
      you: false, rival: false,
    });
  }
  // the rival always lurks; they thrive on the feud
  const rivalPos = Math.max(1, Math.min(10,
    9 - Math.floor(state.fame / 22) - Math.floor((state.rivalry ?? 3) / 3)));
  rows[rivalPos - 1] = {
    artist: rival.name, song: songName(rng), weeks: 2 + Math.floor(rng() * 6),
    you: false, rival: true,
  };
  // your songs
  if (info.entries > 0) {
    const titles = (state.chartTitles || []).slice();
    while (titles.length < info.entries) titles.push(songName(rng));
    state.chartTitles = titles;
    for (let e = 0; e < info.entries; e++) {
      const pos = Math.min(10, info.peak + e * 3 + Math.floor(rng() * 2));
      rows[pos - 1] = {
        artist: 'YOU', song: titles[e], weeks: Math.max(1, state.act - 1),
        you: true, rival: false,
      };
    }
  }
  return rows.map((r, i) => ({ ...r, pos: i + 1 }));
}
