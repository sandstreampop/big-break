// The Night's Vase (pass 23) — the ending screen paints TONIGHT's voyage.
//
// A black-figure frieze band composed purely from the ended run: the fleet
// at its final count, the water the sea actually wore, the beats the telling
// actually faced (the cave island, the trench's ash, the warm island), and
// the ending's motif — the homecoming star and gulls, the trident for the
// wrath, the set-down cup for a banked telling, the guttered ember for the
// beach. Every figure is the pack's own pixel work (art/figures.ts); this
// module only CHOOSES and ORDERS them, left to right, the way a vase reads.
//
// PURE: a function of the ended state alone — no rng, no Date, no module
// state — so the same telling always fires the same vase (testable), and
// nothing here can touch a seeded stream (goldens indifferent; the vase
// renders after the run has ended).

import type { RunState } from '../../types.js';
import {
  ship, seaStrip, island, cyclopsIsland, ashBand, owl, trident, cup, gulls, star, ember,
} from './art/figures.js';
import type { SeaState } from './art/figures.js';

// The chosen motifs, exposed for tests and the aria label: a legible list of
// what the vase depicts, in paint order.
export interface NightVase { html: string; motifs: string[]; }

// ── The gallery of nights (pass 24) ──
// A Past-Lives row stores the vase's needs as four tiny scalars (via
// presenter.historyEntry): final hulls, the two powers, and the stations
// faced packed into a short string. vaseFromHistory re-hydrates a minimal
// state and reuses nightVase whole, so a remembered night paints with
// exactly the live vase's rules. Rows from before pass 24 lack the fields
// and return null — old nights stay unpainted rather than lying.
const STATION_CODES: [string, string][] = [
  ['c', 'ody_done_cyclops'], ['u', 'ody_done_underworld'],
  ['L', 'ody_stayed_lotus'], ['C', 'ody_stayed_circe'], ['K', 'ody_stayed_calypso'],
  ['l', 'ody_done_lotus'], ['i', 'ody_done_circe'], ['k', 'ody_done_calypso'],
];
export function encodeStations(flags: string[]): string {
  return STATION_CODES.filter(([, f]) => flags.includes(f)).map(([c]) => c).join('');
}
export function vaseFromHistory(h: any, still = false): NightVase | null {
  if (h?.vExp == null || typeof h.vSt !== 'string') return null;
  const flags = STATION_CODES.filter(([c]) => h.vSt.includes(c)).map(([, f]) => f);
  return nightVase({
    flags,
    expedition: h.vExp,
    athena: h.vAth ?? 0,
    poseidon: h.vPos ?? 0,
    ending: { key: h.endingKey ?? null, result: h.result ?? null },
    path: h.path ?? null,
  } as RunState, still);
}

// ── The voyage, read once (pass 32) ──
// The single chooser both renderers share: which figures tonight's telling
// earned, in paint order, plus the water the sea wore. nightVase turns the
// tokens into pixel figures; vaseGlyphs turns the SAME tokens into the share
// text's band — one source, so the vase a player sees and the band they
// paste can never disagree.
type VaseTokenKind =
  | 'ship' | 'cyclops' | 'trench' | 'islandNear' | 'islandPassed'
  | 'owl' | 'trident' | 'star' | 'gulls' | 'cupFull' | 'cupDown' | 'cupHalf' | 'ember';
interface VaseToken { kind: VaseTokenKind; hulls?: number; }

function readVoyage(state: RunState): { tokens: VaseToken[]; sea: SeaState } {
  const flags = state.flags || [];
  const key = state.ending?.key ?? state.path ?? null;
  const result = state.ending?.result ?? null;
  const tokens: VaseToken[] = [];

  // The fleet, at tonight's final count — the vase does not flatter.
  tokens.push({ kind: 'ship', hulls: Math.max(0, Math.round(state.expedition ?? 0)) });

  // The voyage's stations, in itinerary order, only if actually faced.
  if (flags.includes('ody_done_cyclops')) tokens.push({ kind: 'cyclops' });
  if (flags.includes('ody_done_underworld')) tokens.push({ kind: 'trench' });
  if (flags.includes('ody_stayed_lotus') || flags.includes('ody_stayed_circe') || flags.includes('ody_stayed_calypso')) {
    tokens.push({ kind: 'islandNear' });
  } else if (flags.includes('ody_done_calypso') || flags.includes('ody_done_circe') || flags.includes('ody_done_lotus')) {
    tokens.push({ kind: 'islandPassed' });
  }

  // The powers, when they truly attended.
  if ((state.athena ?? 0) >= 6) tokens.push({ kind: 'owl' });
  if ((state.poseidon ?? 0) >= 7 || key === 'wrath') tokens.push({ kind: 'trident' });

  // The ending's motif closes the band.
  if (key === 'nostos' && result === 'success') {
    tokens.push({ kind: 'star' }, { kind: 'gulls' });
  } else if (key === 'kleos' && result === 'success') {
    tokens.push({ kind: 'cupFull' });
  } else if (key === 'lotus' || key === 'circe' || key === 'calypso') {
    tokens.push({ kind: 'cupDown' });
  } else if (key === 'burnout') {
    tokens.push({ kind: 'ember' });
  } else if (key === 'wrath') {
    // The trident above already closes a wrath band; the sea says the rest.
  } else {
    tokens.push({ kind: 'cupHalf' });
  }

  // The water the sea wore, under everything.
  const sea: SeaState = (state.poseidon ?? 0) >= 7 ? 'wrath' : (state.poseidon ?? 0) >= 4 ? 'mid' : 'calm';
  return { tokens, sea };
}

// The band as plain glyphs — the vase the share text can carry. Same tokens,
// same order; the trailing waves are the sea's mood (calm shows none).
const TOKEN_GLYPHS: Record<VaseTokenKind, string> = {
  ship: '⛵', cyclops: '👁', trench: '🕳', islandNear: '🏝', islandPassed: '🌴',
  owl: '🦉', trident: '🔱', star: '⭐', gulls: '🕊', cupFull: '🍷', cupDown: '🫗',
  cupHalf: '🍶', ember: '🌫',
};
export function vaseGlyphs(state: RunState): string {
  const { tokens, sea } = readVoyage(state);
  const band = tokens.map((t) => TOKEN_GLYPHS[t.kind]).join('');
  return sea === 'wrath' ? `${band} 🌊🌊` : sea === 'mid' ? `${band} 🌊` : band;
}

export function nightVase(state: RunState, still = false): NightVase {
  const motifs: string[] = [];
  const figs: string[] = [];
  const opts = still ? { cls: 'px-still' } : {};
  const put = (motif: string, html: string, cls = '') => {
    motifs.push(motif);
    figs.push(`<span class="ody-vase-fig${cls ? ' ' + cls : ''}">${html}</span>`);
  };

  const { tokens, sea } = readVoyage(state);
  for (const t of tokens) {
    if (t.kind === 'ship') put(`the ship, ${t.hulls} rowing`, ship(t.hulls!, opts));
    else if (t.kind === 'cyclops') put('the cave island', cyclopsIsland(opts));
    else if (t.kind === 'trench') put('the trench', ashBand(24, { stretch: false, ...opts }));
    else if (t.kind === 'islandNear') put('the warm island, near', island(true, opts));
    else if (t.kind === 'islandPassed') put('the island passed', island(false, opts));
    else if (t.kind === 'owl') put('the owl', owl(opts));
    else if (t.kind === 'trident') put('the trident', trident(opts));
    else if (t.kind === 'star') put('the star', star(opts));
    else if (t.kind === 'gulls') put('the gulls of the home shore', gulls(opts));
    else if (t.kind === 'cupFull') put('the raised cup', cup('full', opts));
    else if (t.kind === 'cupDown') put('the cup, set down', cup('down', opts));
    else if (t.kind === 'cupHalf') put('the cup, half-poured', cup('half', opts));
    else if (t.kind === 'ember') put('the last ember', ember(opts));
  }
  motifs.push(`the sea, ${sea}`);

  const label = `tonight’s vase: ${motifs.join('; ')}`;
  const html =
    `<div class="ody-vase" role="img" aria-label="${label.replace(/"/g, '&quot;')}">` +
    `<div class="ody-vase-band">${figs.join('')}</div>` +
    `<div class="ody-vase-sea">${seaStrip(sea, 96, opts)}</div>` +
    `</div>`;
  return { html, motifs };
}
