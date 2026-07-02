// SPIKE (2026-07-02): de-risks the "audible songs" moonshot composition core.
// Proves — in pure Node, no Web Audio — that a song's *musical content* can be
// derived deterministically from its fingerprint, in-scale, tempo-in-range,
// with the topline melody a stable function of the grabbed Idea-Grab hook, and
// arrangement density that grows monotonically with quality tier.
//
// This is NOT the shipping composer. It outputs an event list (notes + layers),
// not audio. Rendering that event list through Web Audio's OfflineAudioContext
// is Stage A's remaining (browser-only) work. Run: `node docs/spikes/composer-core.mjs`
//
// The PRNG is copied verbatim from js/engine.js so the shipping code can reuse it.

// ---- engine.js mulberry32 (verbatim) ----
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- string -> 32-bit seed (xmur3) ----
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

// ---- scales as semitone offsets from a root MIDI note ----
const SCALES = {
  minorPentatonic: [0, 3, 5, 7, 10],
  major:           [0, 2, 4, 5, 7, 9, 11],
  naturalMinor:    [0, 2, 3, 5, 7, 8, 10],
  dorian:          [0, 2, 3, 5, 7, 9, 10],
  phrygianDom:     [0, 1, 4, 5, 7, 8, 10], // exotic/parody flavor
};

// ---- a few genre sound recipes (the data-driven §6 schema) ----
const SOUND_RECIPES = {
  doom_jazz:   { scale: 'dorian',          root: 45, bpmRange: [56, 72],  drum: 'brush', parody: 0.8 },
  yacht_metal: { scale: 'minorPentatonic', root: 40, bpmRange: [120, 150], drum: 'chug',  parody: 0.9 },
  hyperpop:    { scale: 'major',           root: 60, bpmRange: [150, 176], drum: 'trap',  parody: 0.7 },
  bedroom_pop: { scale: 'major',           root: 55, bpmRange: [78, 96],  drum: 'soft',  parody: 0.3 },
  gothgrass:   { scale: 'naturalMinor',    root: 50, bpmRange: [96, 120], drum: 'brush', parody: 0.6 },
};
const DEFAULT_RECIPE = { scale: 'major', root: 57, bpmRange: [88, 104], drum: 'four', parody: 0 };

// instrument -> topline timbre tag (the shipping composer maps this to an oscillator/wavetable)
const INSTRUMENT_TIMBRE = {
  kazoo: 'reedy-buzz', loop_station: 'looped-pad', guitar: 'pluck',
  sampler: 'chopped', voice: 'formant', default: 'triangle-lead',
};

const TIER_RANK = { demo: 0, charting: 1, crowned: 2 };

// ---- derive the topline melody from the grabbed hook (THE emotional core) ----
// Same hook + same genre => same melody, independent of quality/verdict.
function hookToMelody(hook, recipe, bars = 4, notesPerBar = 4) {
  const scale = SCALES[recipe.scale] || SCALES.major;
  const prng = mulberry32(xmur3('melody|' + (hook || 'untitled') + '|' + recipe.scale));
  const n = bars * notesPerBar;
  const notes = [];
  const chars = (hook || 'untitled').replace(/[^a-z]/gi, '').toLowerCase();
  for (let i = 0; i < n; i++) {
    // the hook's letters bias the contour; the prng fills the gaps deterministically
    const c = chars.length ? chars.charCodeAt(i % chars.length) - 97 : 0;
    const degree = (c + Math.floor(prng() * scale.length)) % scale.length;
    const octave = prng() < 0.22 ? 12 : 0; // occasional lift
    notes.push(recipe.root + scale[degree] + octave);
  }
  return notes;
}

// ---- arrangement: density/layers grow with quality tier ----
function arrange(recipe, tier, prng) {
  const rank = TIER_RANK[tier] ?? 0;
  const layers = ['topline'];
  layers.push('bass');                       // always
  if (rank >= 1) layers.push('pad', 'drums'); // released songs get a bed + kit
  if (rank >= 2) layers.push('counter', 'fx'); // crowned hits get the full treatment
  const density = 0.4 + 0.25 * rank + prng() * 0.05; // 0.4 (demo) -> ~0.9 (crowned)
  return { layers, density };
}

// ---- compose: song fingerprint -> deterministic event list (no audio) ----
function composeSong(song) {
  const recipe = SOUND_RECIPES[song.genre] || DEFAULT_RECIPE;
  const seed = xmur3([song.id, song.genre, song.instrument, song.hook, song.status].join('~'));
  const prng = mulberry32(seed);
  const [lo, hi] = recipe.bpmRange;
  const bpm = Math.round(lo + prng() * (hi - lo));
  const melody = hookToMelody(song.hook, recipe);
  const { layers, density } = arrange(recipe, song.status, prng);
  return {
    seed, bpm, melody, layers, density,
    timbre: INSTRUMENT_TIMBRE[song.instrument] || INSTRUMENT_TIMBRE.default,
    scale: recipe.scale, root: recipe.root, parody: recipe.parody,
  };
}

// stable hash of a composition, for the "byte-identical" determinism check
function hashComposition(c) {
  return xmur3(JSON.stringify([c.seed, c.bpm, c.melody, c.layers, Math.round(c.density * 1000), c.timbre]));
}

// ═══════════════════════════ INVARIANT TESTS ═══════════════════════════
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗ FAIL'}  ${name}`); };

const base = { id: 'song_3_812', genre: 'doom_jazz', instrument: 'kazoo', hook: 'parking lot halo', status: 'demo' };

// 1. Determinism: same fingerprint -> byte-identical composition
ok('determinism: same song renders identically',
  hashComposition(composeSong(base)) === hashComposition(composeSong({ ...base })));

// 2. In-scale: every topline note is a member of the genre scale
{
  const c = composeSong(base);
  const scale = SCALES[c.scale];
  const inScale = c.melody.every((m) => scale.includes(((m - c.root) % 12 + 12) % 12));
  ok('in-scale: all topline notes belong to the genre scale', inScale);
}

// 3. Tempo in range for the genre recipe
{
  let allIn = true;
  for (const g of Object.keys(SOUND_RECIPES)) {
    const [lo, hi] = SOUND_RECIPES[g].bpmRange;
    const c = composeSong({ ...base, genre: g });
    if (c.bpm < lo || c.bpm > hi) allIn = false;
  }
  ok('tempo: bpm sits within the recipe range for every genre', allIn);
}

// 4. Hook fidelity: same hook -> same topline; different hook -> different topline
{
  const a = composeSong(base).melody.join(',');
  const same = composeSong({ ...base, id: 'other_id', status: 'crowned' }).melody.join(',');
  const diff = composeSong({ ...base, hook: 'feral honeymoon' }).melody.join(',');
  ok('hook fidelity: identical hook yields identical topline (independent of tier/id)', a === same);
  ok('hook fidelity: a different hook yields a different topline', a !== diff);
}

// 5. Monotonic growth: arrangement density/layers rise with quality tier
{
  const demo = composeSong({ ...base, status: 'demo' });
  const chart = composeSong({ ...base, status: 'charting' });
  const crown = composeSong({ ...base, status: 'crowned' });
  ok('growth: layer count is monotonic demo <= charting <= crowned',
    demo.layers.length <= chart.layers.length && chart.layers.length <= crown.layers.length);
  ok('growth: density rises demo < charting < crowned',
    demo.density < chart.density && chart.density < crown.density);
}

// 6. Instrument -> distinct timbre tag
ok('instrument: timbre reflects the instrument played',
  composeSong({ ...base, instrument: 'kazoo' }).timbre !== composeSong({ ...base, instrument: 'loop_station' }).timbre);

// 7. Robustness: a hookless / genreless song still composes (fallback recipe)
{
  let survived = true;
  try {
    const c = composeSong({ id: 'x', genre: undefined, instrument: undefined, hook: undefined, status: 'demo' });
    survived = Array.isArray(c.melody) && c.melody.length > 0 && c.bpm > 0;
  } catch (e) { survived = false; }
  ok('robustness: missing genre/instrument/hook falls back without crashing', survived);
}

console.log(`\n${pass} passed, ${fail} failed`);

// ── demo: what a couple of real songs "sound like" as event data ──
console.log('\n--- sample compositions ---');
for (const s of [
  base,
  { id: 'song_7_140', genre: 'yacht_metal', instrument: 'guitar', hook: 'leveraged sundeck', status: 'crowned' },
  { id: 'song_2_44', genre: 'hyperpop', instrument: 'sampler', hook: 'group chat ghost', status: 'charting' },
]) {
  const c = composeSong(s);
  console.log(`${s.genre}/${s.instrument} "${s.hook}" [${s.status}] -> ${c.bpm}bpm ${c.scale} · ${c.layers.length} layers (d=${c.density.toFixed(2)}) · ${c.timbre}\n   topline: ${c.melody.join(' ')}`);
}

process.exit(fail ? 1 : 0);
