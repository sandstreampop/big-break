// Composer invariant tests (moonshot §7 A) — the deaf agent's safety net.
// Promoted from docs/spikes/composer-core.mjs against the REAL module.
// Hashes the COMPOSITION (event data), never rendered PCM (§3).
// Run: node tools/test-composer.mjs

import {
  composeSong, hashComposition, SCALES, timbreFor, songRank, xmur3,
} from '../js/composer.js';
import { GENRES } from '../js/data/genres.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log(`${cond ? '✓' : '✗ FAIL'}  ${name}`); };

const base = {
  id: 'song_3_812', title: 'Parking Lot Halo', genre: 'doom_jazz',
  instrument: 'kazoo', hook: 'parking lot halo', status: 'demo', verdict: 'SOLID',
};

// 1. Determinism: same fingerprint → byte-identical composition
ok('determinism: same song composes identically',
  hashComposition(composeSong(base)) === hashComposition(composeSong({ ...base })));

// 2. In-scale: every topline note belongs to the genre scale
{
  const c = composeSong(base);
  const scale = SCALES[c.scale];
  const inScale = [...c.melody, ...c.chorusMelody]
    .every((m) => scale.includes(((m - c.root) % 12 + 12) % 12));
  ok('in-scale: verse and chorus toplines belong to the genre scale', inScale);
}

// 3. Tempo in range for every authored genre recipe
{
  let allIn = true;
  for (const g of GENRES) {
    const [lo, hi] = g.sound.bpmRange;
    const c = composeSong({ ...base, genre: g.id });
    if (c.bpm < lo || c.bpm > hi) { allIn = false; console.log(`   bpm out of range for ${g.id}: ${c.bpm}`); }
  }
  ok('tempo: bpm sits within the recipe range for every genre', allIn);
}

// 4. Hook fidelity: same hook → same topline (independent of tier/id);
//    different hook → different topline
{
  const a = composeSong(base).melody.join(',');
  const same = composeSong({ ...base, id: 'other_id', status: 'crowned', crowned: true }).melody.join(',');
  const diff = composeSong({ ...base, hook: 'feral honeymoon' }).melody.join(',');
  ok('hook fidelity: identical hook yields identical topline across tiers/ids', a === same);
  ok('hook fidelity: a different hook yields a different topline', a !== diff);
}

// 5. Monotonic growth: layers, density, sections, duration rise with tier
{
  const demo = composeSong({ ...base, status: 'demo' });
  const chart = composeSong({ ...base, status: 'charting' });
  const crown = composeSong({ ...base, status: 'charting', crowned: true });
  ok('growth: layer count is monotonic demo ≤ charting ≤ crowned',
    demo.layers.length <= chart.layers.length && chart.layers.length <= crown.layers.length);
  ok('growth: density rises demo < charting < crowned',
    demo.density < chart.density && chart.density < crown.density);
  ok('growth: sections grow demo < charting ≤ crowned',
    demo.sections.length < chart.sections.length && chart.sections.length <= crown.sections.length);
  ok('growth: duration rises demo < charting < crowned',
    demo.duration < chart.duration && chart.duration < crown.duration);
  // Stage B core promise: same song, bigger — tempo/key/melody stay put
  ok('same song, bigger: bpm identical across tiers', demo.bpm === chart.bpm && chart.bpm === crown.bpm);
  ok('same song, bigger: chord loop identical across tiers',
    demo.chords.join() === crown.chords.join());
}

// 6. Instrument → distinct timbre; family fallback holds
ok('instrument: kazoo and loop station sound different',
  composeSong({ ...base, instrument: 'kazoo' }).timbre !== composeSong({ ...base, instrument: 'loop_station' }).timbre);
ok('instrument: unknown instruments fall back to a real timbre',
  typeof timbreFor('not_a_real_instrument') === 'string' && timbreFor('not_a_real_instrument').length > 0);

// 7. Verdict → timing tightness ordering (BOTCHED loose … GOLDEN locked)
{
  const t = (v) => composeSong({ ...base, verdict: v }).tightness;
  ok('verdict: BOTCHED < SCRAPPY < SOLID < GOLDEN tightness',
    t('BOTCHED') < t('SCRAPPY') && t('SCRAPPY') < t('SOLID') && t('SOLID') < t('GOLDEN'));
  ok('verdict: missing verdict still composes (legacy songs)',
    typeof composeSong({ ...base, verdict: null }).tightness === 'number');
}

// 8. Robustness: hookless / genreless / instrumentless songs still compose
{
  let survived = true;
  try {
    const c = composeSong({ id: 'x', title: 'Legacy Tune' });
    survived = Array.isArray(c.melody) && c.melody.length > 0 && c.bpm > 0 && c.duration > 0;
  } catch (e) { survived = false; console.log('   threw:', e.message); }
  ok('robustness: missing genre/instrument/hook/verdict falls back cleanly', survived);
}

// 9. Distinctness: two different songs never compose identically
{
  const a = composeSong(base);
  const b = composeSong({ ...base, id: 'song_9_100', title: 'Different Tune', hook: 'different tune' });
  ok('distinctness: two songs never sound identical', hashComposition(a) !== hashComposition(b));
}

// 10. All 9 genres carry a full sound recipe with a known scale
{
  const okRecipes = GENRES.every((g) =>
    g.sound && SCALES[g.sound.scale] && g.sound.bpmRange?.length === 2 && g.sound.drum);
  ok('recipes: all genres ship a complete sound recipe', okRecipes);
}

// 11. Duration stays inside the design window (crowned ≤ ~90s, demo ≥ 8s)
{
  let allIn = true;
  for (const g of GENRES) {
    const demo = composeSong({ ...base, genre: g.id, status: 'demo' });
    const crown = composeSong({ ...base, genre: g.id, status: 'charting', crowned: true });
    if (demo.duration < 6 || crown.duration > 90) { allIn = false; console.log(`   duration out of window for ${g.id}: demo ${demo.duration.toFixed(1)}s crowned ${crown.duration.toFixed(1)}s`); }
  }
  ok('duration: demos ≥6s, crowned arrangements ≤90s, every genre', allIn);
}

// 12. No wall-clock, no Math.random in the compose path (grep-level guard)
{
  const src = await import('node:fs').then((fs) => fs.readFileSync(new URL('../js/composer.js', import.meta.url), 'utf8'));
  ok('purity: composer.js never calls Math.random or Date.now',
    !/Math\.random\s*\(|Date\.now\s*\(/.test(src));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
