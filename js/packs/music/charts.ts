// The Big Break Hot 10 — a procedural fake chart the run climbs.
// Deterministic per (flavorSeed, act): stable while you check it mid-act,
// reshuffles between acts. Your songs enter based on fame + hits; the
// rival is always lurking somewhere in it.

import { rivalById } from './data/rivals.js';
import { rivalChartPos } from './songs.js';

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
  'Barefoot', 'Borrowed', 'Glitter', 'Basement', 'Terminal', 'Soft Launch', 'Rent-Controlled',
  'Load-Bearing', 'Off-Brand', 'Beige', 'Volunteer', 'Decaf', 'Municipal', 'Freelance',
  'Non-Refundable', 'Heirloom', 'Understudy', 'Long-Weekend', 'Pre-Owned', 'Lukewarm',
  'Sponsored', 'Invasive', 'Orthopedic', 'Diplomatic', 'Leap-Year', 'Adjacent', 'Uninsured'];
const NOUN = ['Halo', 'Arithmetic', 'Girlfriend', 'Layover', 'Apology', 'Mercury', 'Cowboy',
  'Situationship', 'Voicemail', 'Angel Investor', 'Summer', 'Blackout', 'Merch Table',
  'Heartbeat', 'Landlord', 'Renaissance', 'Group Chat', 'Encore', 'Mood Board', 'Sequel',
  'Deductible', 'Casserole', 'Frontage Road', 'Middle Seat', 'Understudy', 'Escrow',
  'Houseguest', 'Comet', 'Intermission', 'Warranty', 'Getaway Car', 'Peninsula',
  'Security Deposit', 'Last Call', 'Carousel', 'Alibi', 'Greenhouse', 'Layaway', 'Plus-One'];
const SUFFIX = ['', '', '', ' (Remix)', ' (Sped Up)', ' — Acoustic', ' (feat. no one)', ' II',
  ' (Demo)', ' (Deluxe)', ' — Live From the Van', ' (Radio Edit)', ' Pt. 2'];

const ARTISTS = ['The Algorithm', 'Brayden', 'Yacht Arithmetic', 'DJ Mattress Emporium',
  'The Nepo Babies', 'Craig (Bagpipes)', 'GRIND™ presents: Hustle', 'Soup Man',
  'Vibe Committee', 'The Petersen Twins', 'Focus Beats for Chinchillas', 'Todd',
  'The Other Bands', 'Juniper (Film Student)', 'Approachable Lightning', 'The 11 Writers',
  'Gravy Boat Summer', 'The Municipal Waste Committee (Reformed)', 'Ampersandra',
  'Twelve Ostriches', 'HOA Meeting', 'The Sad Dads', 'Lil Escrow', 'Parallel Parking Champion',
  'The Regional Managers', 'Doreen', 'Free Sample Society', 'Weighted Blanket',
  'CAPS LOCK ENERGY', 'The Adjunct Professors', 'Sincerely, The Building', 'Notary Public Image'];

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

// The chart artist who slides into your DMs about a feature — fixed per run
// (derived from flavorSeed) so the offer, the song title, and the act-3
// callback all name the same person.
export function collabArtistFor(state) {
  return ARTISTS[(state.flavorSeed || 1) % ARTISTS.length];
}
// Your songs can carry your genre's vocabulary: pass a genre (with
// titleWords) and roughly two-thirds of titles borrow its adjective,
// noun, or both. Industry filler always uses the generic pools.
export function songName(rng, genre = null) {
  const tw = genre?.titleWords;
  const adj = tw && rng() < 0.66 ? pick(rng, tw.adj) : pick(rng, ADJ);
  const noun = tw && rng() < 0.66 ? pick(rng, tw.noun) : pick(rng, NOUN);
  return adj + ' ' + noun + pick(rng, SUFFIX);
}

// Your chart footprint, from REAL songs: charting entries and best peak
export function playerChartInfo(state) {
  const songs = (state.songs || []).filter((s) => s.status === 'charting' && s.pos);
  const peak = (state.songs || []).reduce((best, s) => (s.peak && (!best || s.peak < best) ? s.peak : best), null);
  return { entries: songs.length, peak };
}

// The filler rows + the lurking rival (deterministic per flavorSeed+act)
function industryRows(state) {
  const rng = mulberry32((state.flavorSeed || 1) * 7919 + state.act * 104729);
  const rival = rivalById(state.rival);
  const rows = [];
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
  const rivalPos = rivalChartPos(state);
  rows[rivalPos - 1] = {
    artist: rival.name, song: songName(rng), weeks: 2 + Math.floor(rng() * 6),
    you: false, rival: true,
  };
  return rows;
}

export function buildChart(state) {
  const rows = industryRows(state);
  // your REAL songs occupy their simulated positions
  const yours = (state.songs || [])
    .filter((s) => s.status === 'charting' && s.pos)
    .sort((a, b) => a.pos - b.pos);
  const taken = new Set();
  for (const s of yours) {
    let p = s.pos;
    while ((taken.has(p) || rows[p - 1]?.rival) && p < 10) p++; // never evict the rival row
    if (taken.has(p) || rows[p - 1]?.rival) continue; // chart is full below you
    taken.add(p);
    rows[p - 1] = {
      artist: 'YOU', song: s.title, weeks: s.weeks,
      you: true, rival: false,
      songMove: s.prevPos ? s.prevPos - s.pos : null, songNew: !s.prevPos,
    };
  }
  return rows.map((r, i) => ({ ...r, pos: i + 1 }));
}

// Chart with movement (▲ risers, ▼ fallers, NEW). Your rows carry real
// simulated movement; the industry filler compares acts as before.
export function buildChartWithMovement(state) {
  const now = buildChart(state);
  if ((state.act || 1) <= 1) {
    return { rows: now.map((r) => ({ ...r, move: r.you ? r.songMove : null, isNew: !!(r.you && r.songNew) })), dethroned: null };
  }
  const prev = industryRows({ ...state, act: state.act - 1 });
  const prevByArtist = new Map(prev.map((r, i) => [r.artist, i + 1]));
  const rows = now.map((r) => {
    if (r.you) return { ...r, move: r.songMove, isNew: !!r.songNew };
    const was = prevByArtist.get(r.artist);
    if (was === undefined) return { ...r, move: null, isNew: true };
    return { ...r, move: was - r.pos, isNew: false };
  });
  const prevTop = prev[0];
  const dethroned = prevTop && now[0] && (prevTop.artist !== now[0].artist)
    ? prevTop.artist : null;
  return { rows, dethroned };
}
