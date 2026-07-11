// The Odyssey — the figure vocabulary (F2): every black-figure pixel
// silhouette the living frieze, the hearth, and the ceremonies compose from.
// Authored as pixel maps (see px.ts); reviewed in the gallery
// (tools/odyssey-gallery.mjs) before anything moves. STYLE.md law 7 +
// the Motion Law (adr/0001): flat fills, chunky pixels, 2–3 frames, steps().
//
// Composition contract: every factory returns an SVG *string* (the dom
// toolkit and presenter html slots consume strings). State-driven variation
// is a FUNCTION ARGUMENT (rowers aboard, sea state, cup level) — the caller
// reads RunState, the figures never do.

import { sprite, tile, type SpriteOpts } from './px.js';

// ---------- The ship (the frieze's protagonist) ----------
// Long black hull, swan-neck stern (left), ram bow (right), one mast with
// the yard crossed. Rowers are composited INTO the map as removable units —
// each is a man-shape above the gunwale; lose crew and the bench empties.
// The dwindling is visible, cumulative, and personal (NORTH-STAR: the
// Expedition are the rowers).

const HULL_W = 40;
export const SHIP_MAX_ROWERS = 12;
// Bench columns (x of each rower's 2px-wide seat), evenly spread amidships —
// none adjacent to the mast (col 18) or the bow post, so every rower is his
// own pixels (test/odyssey-frieze.test.mjs pins per-bench fidelity).
const BENCHES = [5, 7, 9, 11, 13, 15, 21, 23, 25, 27, 29, 31];

function blankRow(w: number): string { return '.'.repeat(w); }

// Stamp `glyph` rows into `rows` at (x, y), transparent-safe.
function stamp(rows: string[], glyph: string[], x: number, y: number): void {
  glyph.forEach((g, gy) => {
    const ty = y + gy;
    if (ty < 0 || ty >= rows.length) return;
    let row = rows[ty];
    for (let gx = 0; gx < g.length; gx++) {
      const c = g[gx];
      if (c === '.' || c === ' ') continue;
      const tx = x + gx;
      if (tx < 0 || tx >= row.length) continue;
      row = row.slice(0, tx) + c + row.slice(tx + 1);
    }
    rows[ty] = row;
  });
}

// One rower: head + leaning torso over the gunwale, two stroke poses.
const ROWER_BACK = ['.#', '##', '.#'];
const ROWER_FORE = ['#.', '##', '#.'];

// The hull map WITHOUT rowers; mast amidships, yard crossed, stays furled.
function hullRows(): string[] {
  return [
    '..................#.....................',
    '..............#######...................',
    '..................#.....................',
    '..................#.....................',
    '..##..............#.....................',
    '..#...............#.....................',
    '..#...............#.....................', // rower row (heads)
    '..##..............#.....................', // rower row (torso)
    '...#..............#..............####...', // rower row (arms) + bow post
    '...##################################...', // gunwale
    '....################################....',
    '......############################......', // keel
  ];
}

// The ship with `rowers` of SHIP_MAX_ROWERS aboard, two-frame stroke.
// Frame 0 leans back, frame 1 leans forward; a lost rower's bench is simply
// empty in both frames. Renown figures may ride the stern (see sternFigures).
export function ship(rowers: number, opts: SpriteOpts = {}): string {
  const n = Math.max(0, Math.min(SHIP_MAX_ROWERS, Math.round(rowers)));
  const frames = [ROWER_BACK, ROWER_FORE].map((pose) => {
    const rows = hullRows();
    for (let i = 0; i < n; i++) stamp(rows, pose, BENCHES[i], 6);
    return rows;
  });
  return sprite(frames, { cls: 'ody-ship', label: `the ship, ${n} rowers`, ...opts });
}

// ---------- The sea (Poseidon's mood) ----------
// Tileable strips: calm meander-water at peace, chop as he stirs, oxblood
// rollers at wrath. One tile authored; tile() repeats it to band width.
const SEA_CALM_TILE = [
  '#...#...',
  '.#.#.#.#',
  '........',
];
const SEA_MID_TILE = [
  '.##.....',
  '#..##..#',
  '.....##.',
];
const SEA_WRATH_TILE = [
  'o.oo...o',
  'oo.ooo.o',
  '.ooo.ooo',
  'ooooooo.',
];
export type SeaState = 'calm' | 'mid' | 'wrath';
const SEA_TILES: Record<SeaState, string[]> = {
  calm: SEA_CALM_TILE, mid: SEA_MID_TILE, wrath: SEA_WRATH_TILE,
};

// A sea strip `width` pixels wide. Two frames: the tile and the tile shifted
// half a wavelength — the slow water of the band (steps(), ember-slow).
export function seaStrip(state: SeaState, width = 96, opts: SpriteOpts = {}): string {
  const t = SEA_TILES[state];
  const shift = t.map((row) => row.slice(4) + row.slice(0, 4));
  return sprite([tile(t, width), tile(shift, width)], {
    cls: `ody-sea ody-sea-${state}`, label: `the sea, ${state}`, ...opts,
  });
}

// ---------- The fire (the hearth's heart) ----------
// Three frames, ember-slow. Gold heart, flame body, deep base — the one
// warm thing on the night field.
const FIRE_F0 = [
  '....r....',
  '....r....',
  '...rr.r..',
  '...rrrr..',
  '..rrgrr..',
  '..rggrr..',
  '.rrgggrr.',
  '.RrggrrR.',
  '.RRrrrRR.',
  '..#####..',
];
const FIRE_F1 = [
  '.........',
  '..r..r...',
  '...rrr...',
  '...rrr.r.',
  '..rgrrrr.',
  '..rggrr..',
  '.rrgggrr.',
  '.RrggrrR.',
  '.RRrrrRR.',
  '..#####..',
];
const FIRE_F2 = [
  '.........',
  '....r....',
  '..r.rr...',
  '..rrrr...',
  '..rrgrr..',
  '.rrggrr..',
  '.rgggrrr.',
  '.RrggrrR.',
  '.RRrrrRR.',
  '..#####..',
];
export function fire(opts: SpriteOpts = {}): string {
  return sprite([FIRE_F0, FIRE_F1, FIRE_F2], { cls: 'ody-fire', label: 'the fire', ...opts });
}

// A cold hearth (the threshold before kindling; the ember guttered).
const HEARTH_COLD = [
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '....a....',
  '...a.a...',
  '..a.a.a..',
  '..#####..',
];
export function coldHearth(opts: SpriteOpts = {}): string {
  return sprite([HEARTH_COLD], { cls: 'ody-fire ody-fire-cold', label: 'a cold hearth', ...opts });
}

// ---------- The ember (the soul-cursor, I2's raw material) ----------
// A small pixel flame. Three frames; the caller dims it with Despair
// (opacity/desaturation is CSS's business, the shape is authored here).
const EMBER_F0 = [
  '...r...',
  '..rr...',
  '..rgr..',
  '.rggr..',
  '.rggrr.',
  '.Rggr..',
  '..RR...',
];
const EMBER_F1 = [
  '...r...',
  '...rr..',
  '..rgr..',
  '..ggrr.',
  '.rggr..',
  '..ggR..',
  '..RR...',
];
const EMBER_F2 = [
  '..r....',
  '..rr...',
  '..grr..',
  '.rggr..',
  '.rggr..',
  '..ggR..',
  '..RR...',
];
export function ember(opts: SpriteOpts = {}): string {
  return sprite([EMBER_F0, EMBER_F1, EMBER_F2], { cls: 'ody-ember', label: 'the ember', ...opts });
}

// ---------- Small figures over the band ----------
// Renown trails the ship: deeds of legend as small figures at the stern.
// A small figure in profile, walking in the ship's wake — head forward,
// body leaning, legs mid-stride (a procession, not a row of crosses).
const STERN_FIGURE = [
  '.##..',
  '.##..',
  '.###.',
  '.##..',
  '.#.#.',
  '#..#.',
];
export function sternFigures(count: number, opts: SpriteOpts = {}): string {
  const n = Math.max(0, Math.min(6, Math.round(count)));
  const w = Math.max(1, n * 6);
  const rows = Array.from({ length: 6 }, () => '.'.repeat(w));
  for (let i = 0; i < n; i++) stamp(rows, STERN_FIGURE, i * 6, 0);
  return sprite([rows], { cls: 'ody-stern-figures', label: `renown, ${n} deeds`, ...opts });
}

// ---------- Geography (the horizon's raw material) ----------
// Land masses loom at the band's edge (I4 scales them as they near). Flat
// bases sit on the sea line.
const ISLAND_FAR = [
  '.....##.......',
  '...######.....',
  '..########....',
  '.###########..',
  '##############',
];
const ISLAND_NEAR = [
  '......##........',
  '....######......',
  '...#########....',
  '..###########...',
  '.#############..',
  '################',
];
export function island(near = false, opts: SpriteOpts = {}): string {
  return sprite([near ? ISLAND_NEAR : ISLAND_FAR], { cls: 'ody-island', label: 'an island', ...opts });
}

// The Cyclops's island: the same mass with the cave mouth open in it.
const CYCLOPS_ISLAND = [
  '......###.......',
  '....#######.....',
  '...#########....',
  '..###########...',
  '.#############..',
  '.####...######..',
  '.###.....#####..',
  '#####...#######.',
];
export function cyclopsIsland(opts: SpriteOpts = {}): string {
  return sprite([CYCLOPS_ISLAND], { cls: 'ody-island ody-island-cave', label: 'the cave island', ...opts });
}

// ---------- The Cyclops (ceremony scale) ----------
// The one figure big enough to fill the band. One gold eye — the only light
// on him. Two frames: the eye searches.
const CYCLOPS_BASE = [
  '.......######.......',
  '......########......',
  '......##@#####......',
  '......########......',
  '.......######.......',
  '.....##########.....',
  '...##############...',
  '..################..',
  '..##.##########.##..',
  '..##.##########.##..',
  '..##.##########.##..',
  '..##.##########.##..',
  '..##.##########.##..',
  '..##.##########.##..',
  '.....##########.....',
  '.....##########.....',
  '.....####..####.....',
  '.....####..####.....',
  '.....####..####.....',
  '....#####..#####....',
];
function cyclopsFrame(eyeShift: number): string[] {
  return CYCLOPS_BASE.map((row) => {
    const i = row.indexOf('@');
    if (i < 0) return row;
    const bare = row.replace('@', '#');
    const x = i + eyeShift;
    return bare.slice(0, x) + 'g' + bare.slice(x + 1);
  });
}
export function cyclops(opts: SpriteOpts = {}): string {
  return sprite([cyclopsFrame(0), cyclopsFrame(2)], { cls: 'ody-cyclops', label: 'the Cyclops', ...opts });
}

// ---------- The ash band (the Underworld nearing) ----------
// Drifting motes over a band the CSS drains toward ash. Two frames, shifted.
const ASH_TILE = [
  'a..a.a..',
  '.a...a.a',
  '..a.a...',
  'a....a..',
];
export function ashBand(width = 96, opts: SpriteOpts = {}): string {
  const shift = ASH_TILE.map((row) => row.slice(3) + row.slice(0, 3));
  return sprite([tile(ASH_TILE, width), tile(shift, width)], { cls: 'ody-ash', label: 'the ash', ...opts });
}

// ---------- The hearth crowd (the canon ensemble, firelit clay) ----------
// Seated silhouettes in terracotta-deep — dark warm shapes on the night
// field, lit by the fire they face. Two frames each: a body shifts when it
// speaks; the spindle turns; the stillness is the ground (Motion Law).

// The woman by the woodpile, spindle hanging from her outstretched hand.
const WOMAN_F0 = [
  '....TT......',
  '...TTTT.....',
  '...TTTT.....',
  '....TT......',
  '...TTTTT....',
  '..TTTTTTTb..',
  '..TTTTTT.b..',
  '..TTTTT..b..',
  '..TTTTT..T..',
  '..TTTTTT....',
  '..TTTTTTT...',
  '.##########.',
];
const WOMAN_F1 = [
  '....TT......',
  '...TTTT.....',
  '...TTTT.....',
  '....TT......',
  '...TTTTT....',
  '..TTTTTTTb..',
  '..TTTTTT.b..',
  '..TTTTT..b..',
  '..TTTTT..b..',
  '..TTTTTT.T..',
  '..TTTTTTT...',
  '.##########.',
];
export function crowdWoman(opts: SpriteOpts = {}): string {
  return sprite([WOMAN_F0, WOMAN_F1], { cls: 'ody-crowd ody-crowd-woman', label: 'the woman by the woodpile', ...opts });
}

// The potter's boy, knees hugged, all eyes.
const BOY_F0 = [
  '...TT...',
  '..TTTT..',
  '..TTTT..',
  '...TT...',
  '..TTTT..',
  '.TTTTTT.',
  '.TT..TT.',
  '.TTTTTT.',
  '..TTTT..',
  '.######.',
];
const BOY_F1 = [
  '....TT..',
  '...TTTT.',
  '...TTTT.',
  '...TT...',
  '..TTTT..',
  '.TTTTTT.',
  '.TT..TT.',
  '.TTTTTT.',
  '..TTTT..',
  '.######.',
];
export function crowdBoy(opts: SpriteOpts = {}): string {
  return sprite([BOY_F0, BOY_F1], { cls: 'ody-crowd ody-crowd-boy', label: 'the potter’s boy', ...opts });
}

// The man who wants the horse — hand forever half-raised to request it.
const HORSEMAN_F0 = [
  '....TT....',
  '...TTTT...',
  '...TTTT...',
  '....TT..T.',
  '...TTTT.T.',
  '..TTTTTTT.',
  '..TTTTTT..',
  '..TTTTT...',
  '..TTTTTT..',
  '..TTTTTTT.',
  '.#########',
];
const HORSEMAN_F1 = [
  '....TT....',
  '...TTTT...',
  '...TTTT...',
  '....TT....',
  '...TTTT...',
  '..TTTTTT..',
  '..TTTTTTT.',
  '..TTTTT.T.',
  '..TTTTTT..',
  '..TTTTTTT.',
  '.#########',
];
export function crowdHorseMan(opts: SpriteOpts = {}): string {
  return sprite([HORSEMAN_F0, HORSEMAN_F1], { cls: 'ody-crowd ody-crowd-horseman', label: 'the man who wants the horse', ...opts });
}

// An empty place at the fire — where Phemios of Smyrna pointedly isn't.
const EMPTY_PLACE = [
  '........',
  '........',
  '........',
  '........',
  '........',
  '........',
  '........',
  '........',
  '........',
  '.######.',
];
export function emptyPlace(opts: SpriteOpts = {}): string {
  return sprite([EMPTY_PLACE], { cls: 'ody-crowd ody-crowd-empty', label: 'an empty place', ...opts });
}

// ---------- The god totems ----------
// Athena is the owl (gold eyes — the gods' one light); Poseidon the trident.
const OWL_F0 = [
  '.#...#.',
  '.##.##.',
  '.#g#g#.',
  '.#####.',
  '..###..',
  '..#.#..',
];
const OWL_F1 = [
  '.#...#.',
  '.##.##.',
  '.#####.',
  '.#####.',
  '..###..',
  '..#.#..',
];
export function owl(opts: SpriteOpts = {}): string {
  return sprite([OWL_F0, OWL_F1], { cls: 'ody-owl', label: 'the owl', ...opts });
}

const TRIDENT = [
  '#..#..#',
  '#..#..#',
  '##.#.##',
  '.#####.',
  '...#...',
  '...#...',
  '...#...',
  '...#...',
  '...#...',
  '...#...',
];
export function trident(opts: SpriteOpts = {}): string {
  return sprite([TRIDENT], { cls: 'ody-trident', label: 'the trident', ...opts });
}

// ---------- The wine cup (the clock of the night) ----------
// A kylix, seen a little from above so the wine shows. Four states: full at
// Act I, half, dregs by Act III, and set down — the Calypso cash-out.
export type CupLevel = 'full' | 'half' | 'dregs' | 'down';
function cupRows(level: CupLevel): string[] {
  // Set down (the Calypso cash-out): the kylix turned over on the ground,
  // one spilt drop beside it. He simply sets it down.
  if (level === 'down') {
    return [
      '............',
      '............',
      '.....##.....',
      '.....##.....',
      '...######...',
      '.##########.',
      'o...........',
    ];
  }
  const wineTop = level === 'full' ? 'oooooo' : '......';
  const wineMid = level === 'full' || level === 'half' ? 'oooooo' : (level === 'dregs' ? '..oo..' : '......');
  return [
    '............',
    `#.#${wineTop}#.#`,
    `.##${wineMid}##.`,
    '..########..',
    '.....##.....',
    '.....##.....',
    '...######...',
  ];
}
export function cup(level: CupLevel, opts: SpriteOpts = {}): string {
  return sprite([cupRows(level)], { cls: `ody-cup ody-cup-${level}`, label: `the cup, ${level}`, ...opts });
}

// ---------- The oar (the prophecy's key) ----------
const OAR = [
  '....#',
  '....#',
  '...#.',
  '...#.',
  '..#..',
  '..#..',
  '.#...',
  '.#...',
  '##...',
  '##...',
  '##...',
];
export function oar(opts: SpriteOpts = {}): string {
  return sprite([OAR], { cls: 'ody-oar', label: 'the oar', ...opts });
}

// ---------- Gulls and stars (Ithaca nearing; the night over the fire) ----------
const GULLS_F0 = [
  'b.b....b.b..',
  '.b......b...',
  '......b.b...',
  '.......b....',
];
const GULLS_F1 = [
  '.b.b........',
  'b...b..b.b..',
  '........b...',
  '............',
];
export function gulls(opts: SpriteOpts = {}): string {
  return sprite([GULLS_F0, GULLS_F1], { cls: 'ody-gulls', label: 'gulls', ...opts });
}

const STAR_F0 = [
  '.....',
  '.....',
  '..b..',
  '.....',
  '.....',
];
const STAR_F1 = [
  '.....',
  '..b..',
  '.bbb.',
  '..b..',
  '.....',
];
export function star(opts: SpriteOpts = {}): string {
  return sprite([STAR_F0, STAR_F1], { cls: 'ody-star', label: 'a star', ...opts });
}

// The gallery's review registry: every sprite in its representative states.
// tools/odyssey-gallery.mjs renders this; the smoke of F2 is a human eye.
export const GALLERY: Record<string, () => string> = {
  'ship — full benches (12)': () => ship(12),
  'ship — six lost (6)': () => ship(6),
  'ship — last men (2)': () => ship(2),
  'sea — calm': () => seaStrip('calm', 96),
  'sea — stirring': () => seaStrip('mid', 96),
  'sea — wrath': () => seaStrip('wrath', 96),
  'the fire': () => fire(),
  'a cold hearth': () => coldHearth(),
  'the ember': () => ember(),
  'renown at the stern (4)': () => sternFigures(4),
  'an island, far': () => island(false),
  'an island, near': () => island(true),
  'the cave island': () => cyclopsIsland(),
  'the Cyclops': () => cyclops(),
  'the ash': () => ashBand(96),
  'the woman by the woodpile': () => crowdWoman(),
  'the potter’s boy': () => crowdBoy(),
  'the man who wants the horse': () => crowdHorseMan(),
  'an empty place (Phemios)': () => emptyPlace(),
  'the owl': () => owl(),
  'the trident': () => trident(),
  'the cup — full': () => cup('full'),
  'the cup — half': () => cup('half'),
  'the cup — dregs': () => cup('dregs'),
  'the cup — set down': () => cup('down'),
  'the oar': () => oar(),
  'gulls': () => gulls(),
  'a star': () => star(),
};
