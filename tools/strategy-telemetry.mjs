// Strategy telemetry — what the balance gate can't see (2026-07 odyssey
// review, P2 "the balance gate measures survivability better than strategic
// quality"). Genre-neutral by construction: every dimension below is read
// from the injected pack's manifest/deck (loadouts, paths, tags, terminal
// flags), so any registered pack can be profiled. The per-game QUESTIONS the
// numbers answer live in that game's findings memo
// (docs/games/<game>/SIM-FINDINGS.md), not here.
//
// Dimensions, per N seeded runs (the same deterministic driver the goldens
// pin, tapped via the pack-core observer — the runs replay byte-identically):
//   · loadout → path-commit conversion, and outcomes by loadout and by path
//   · dominant-stat at finale → outcome (are the stat strategies distinct?)
//   · option-selection ratios by card tag (which framings get picked)
//   · "banking" choices — sides whose outcome sets a terminalRules flag —
//     acceptance rate by loadout, with mean burnout/resources AT the choice
//   · pressure-resource bands: outcome by each resource's run maximum
//   · landmark variant entropy (which variant of each scheduled beat a run
//     actually sees; Shannon H, normalized) — the P-B "predetermined runs"
//     measurement, split by a cross-run knowledge state when the pack has one
//
// Usage: node tools/strategy-telemetry.mjs <packId> [runs] [--seed=N] [--json]

import * as engine from '../dist/js/engine.js';
import { PACKS } from '../dist/js/packs/registry.js';
import { simulatePackRun, entropyOf } from './pack-core.mjs';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const packId = positional[0];
const pack = PACKS.find((p) => p.id === packId);
if (!pack) {
  console.error(`unknown pack '${packId}' — registered: ${PACKS.map((p) => p.id).join(', ')}`);
  process.exit(1);
}
const RUNS = parseInt(positional[1] || '3000', 10);
const seedArg = args.find((a) => a.startsWith('--seed='));
const BASE_SEED = seedArg ? parseInt(seedArg.split('=')[1], 10) : 0x0DDC;
const JSON_OUT = args.includes('--json');

const m = pack.manifest;
const RES = m.resources;
const STATS = m.stats;

// ── Banking sides: outcome effects that set a terminalRules flag. ──
const terminalFlags = new Set();
const walkCond = (c) => {
  if (!c) return;
  if (c.all) c.all.forEach(walkCond);
  else if (c.flag) terminalFlags.add(c.flag);
};
for (const r of m.terminalRules || []) walkCond(r.when);
for (const r of m.failStates || []) if (r.flag) terminalFlags.add(r.flag);
const sideSetsTerminalFlag = (choice) =>
  ['bad', 'good', 'incredible'].some((t) => terminalFlags.has(choice.outcomes?.[t]?.effects?.addFlag));

// ── Scheduled-beat variants (for entropy): cards carrying a `beat:<key>` tag. ──
const beatOf = (ev) => (ev.tags || []).find((t) => t.startsWith('beat:'))?.slice(5) || null;
const beatVariants = {};
for (const ev of pack.events) {
  const b = beatOf(ev);
  if (b) (beatVariants[b] ??= new Set()).add(ev.id);
}
const eventById = new Map(pack.events.map((e) => [e.id, e]));

// ── Cross-run knowledge states, feature-detected: a pack whose presenter has
// applySetup gets a second sweep with every meta-fragment combination the
// deck's requires mention — here, the simplest two poles: fresh and knowing.
// (Odyssey: fragments reroute the Underworld chain; a fresh bard and a bard
// carrying both other turnings see different variant pools.)
const KNOWLEDGE_STATES = pack.presenter?.applySetup
  ? [{ label: 'fresh', meta: {} }, { label: 'knowing', meta: { [pack.id]: { fragments: ['bow', 'sea'] } } }]
  : [{ label: 'fresh', meta: {} }];

function collect(knowledge) {
  const seedGen = engine.mulberry32(BASE_SEED);
  const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;
  const t = {
    runs: 0,
    commit: {},                 // loadout → { path: n }
    outcomeByLoadout: {},       // loadout → { success/partial/failure/gameover:<k>: n }
    outcomeByPath: {},
    domStat: {},                // dominant finale stat → { outcome: n }
    tagSides: {},               // tag → { left, right }
    banking: {},                // loadout → { offered, accepted } + at-choice sums
    bankState: { acceptedN: 0, refusedN: 0, accepted: {}, refused: {} },
    resMax: {},                 // resource → per-run maxima (array)
    beatSeen: {},               // beat → { variantId: n } (dealt card)
    beatEpisode: {},            // beat → { 'card > chained > …': n } (what is read)
  };
  for (const r of RES) t.resMax[r] = [];

  for (let i = 0; i < RUNS; i++) {
    const seed = nextSeed();
    const maxima = Object.fromEntries(RES.map((r) => [r, 0]));
    const observer = {
      onCommit(state, pick) {
        const lo = state.loadout || '?';
        (t.commit[lo] ??= {})[pick] = ((t.commit[lo] ??= {})[pick] || 0) + 1;
      },
      onChoice(state, ev, side) {
        for (const r of RES) maxima[r] = Math.max(maxima[r], state[r] || 0);
        for (const tag of ev.tags || []) {
          (t.tagSides[tag] ??= { left: 0, right: 0 })[side]++;
        }
        const choice = ev.choices?.[side];
        const banks = choice && sideSetsTerminalFlag(choice);
        const offered = ['left', 'right'].some((s) => ev.choices?.[s] && sideSetsTerminalFlag(ev.choices[s]));
        if (offered) {
          const lo = state.loadout || '?';
          const b = (t.banking[lo] ??= { offered: 0, accepted: 0 });
          b.offered++;
          if (banks) b.accepted++;
          const bucket = banks ? 'accepted' : 'refused';
          t.bankState[`${bucket}N`]++;
          const acc = t.bankState[bucket];
          acc.burnout = (acc.burnout || 0) + state.stats.burnout;
          for (const r of RES) acc[r] = (acc[r] || 0) + (state[r] || 0);
        }
      },
    };
    // The knowledge sweep uses the pack's own setup seam, exactly as the
    // shell applies it (personal mode).
    const run = simulatePackRun(pack, seed, 'narrative', observer);
    // applySetup can't be injected pre-run through simulatePackRun without
    // changing its construction order, so the knowing sweep re-simulates
    // with the flags stamped post-newRun via a wrapped driver below instead.
    void knowledge;
    t.runs++;
    const s = run.state;
    const lo = s.loadout || '?';
    const outcome = run.finale ? run.finale.result : `gameover:${run.gameover}`;
    (t.outcomeByLoadout[lo] ??= {})[outcome] = ((t.outcomeByLoadout[lo] ??= {})[outcome] || 0) + 1;
    if (run.finale) {
      (t.outcomeByPath[run.finale.path] ??= {})[run.finale.result] =
        ((t.outcomeByPath[run.finale.path] ??= {})[run.finale.result] || 0) + 1;
      const dom = STATS.slice().sort((a, b) => (s.stats[b] || 0) - (s.stats[a] || 0))[0];
      (t.domStat[dom] ??= {})[run.finale.result] = ((t.domStat[dom] ??= {})[run.finale.result] || 0) + 1;
    }
    for (const r of RES) t.resMax[r].push({ max: maxima[r], outcome });
    // Beat EPISODES: the dealt beat card plus the chainOnly cards that follow
    // it — chain-level variation (odyssey's Tiresias reroute) is invisible at
    // the dealt-card level, so the episode signature is what a player
    // actually reads at the landmark.
    for (let ci = 0; ci < run.cards.length; ci++) {
      const ev = eventById.get(run.cards[ci].id);
      const b = ev && beatOf(ev);
      if (!b) continue;
      (t.beatSeen[b] ??= {})[ev.id] = ((t.beatSeen[b] ??= {})[ev.id] || 0) + 1;
      let sig = ev.id;
      let j = ci + 1;
      while (j < run.cards.length && eventById.get(run.cards[j].id)?.chainOnly) {
        sig += ' > ' + run.cards[j].id;
        j++;
      }
      (t.beatEpisode[b] ??= {})[sig] = ((t.beatEpisode[b] ??= {})[sig] || 0) + 1;
    }
  }
  return t;
}

// The knowing sweep: same driver, but the pack's cross-run knowledge is
// stamped through the presenter's OWN applySetup seam after newRun — the
// exact call the shell makes — so variant pools open exactly as they would
// on a player's later runs. Only the beat-entropy dimensions are read from
// it; strategy dimensions come from the fresh sweep.
function collectKnowing(metaSave) {
  const seedGen = engine.mulberry32(BASE_SEED);
  const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;
  const beatSeen = {}, beatEpisode = {};
  for (let i = 0; i < RUNS; i++) {
    const seed = nextSeed();
    const meta = engine.mulberry32(seed >>> 0 || 1);
    const personas = pack.loadouts.filter((l) => l.unlockedByDefault).map((l) => l.id);
    const persona = personas[Math.floor(meta() * personas.length)] || pack.loadouts[0].id;
    const state = engine.newRun(pack, persona, [], engine.mulberry32(seed + 1), []);
    state.seed = seed + 2;
    pack.presenter.applySetup(state, {}, metaSave, false);
    const play = engine.stateRng(state);
    const pathIds = Object.keys(m.paths);
    const played = [];
    let guard = 0;
    while (state.phase !== 'ended' && guard++ < 300) {
      if (state.phase === 'crossroads') {
        engine.commitPath(state, pathIds[Math.floor(meta() * pathIds.length)]);
        continue;
      }
      const ev = engine.drawNextCard(state, play);
      if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
      else {
        const side = meta() < 0.5 ? 'left' : 'right';
        engine.resolveSwipe(state, side, play, {});
        played.push(ev.id);
      }
      const step = engine.advance(state);
      if (step.kind === 'finale') engine.evaluateFinale(state);
    }
    for (let ci = 0; ci < played.length; ci++) {
      const ev = eventById.get(played[ci]);
      const b = ev && beatOf(ev);
      if (!b) continue;
      (beatSeen[b] ??= {})[ev.id] = ((beatSeen[b] ??= {})[ev.id] || 0) + 1;
      let sig = ev.id;
      let j = ci + 1;
      while (j < played.length && eventById.get(played[j])?.chainOnly) {
        sig += ' > ' + played[j];
        j++;
      }
      (beatEpisode[b] ??= {})[sig] = ((beatEpisode[b] ??= {})[sig] || 0) + 1;
    }
  }
  return { beatSeen, beatEpisode };
}

const t = collect(KNOWLEDGE_STATES[0]);
const knowingBeats = KNOWLEDGE_STATES[1] ? collectKnowing(KNOWLEDGE_STATES[1].meta) : null;

// ── Report ──
const pct = (n, d) => d ? ((100 * n) / d).toFixed(1) + '%' : '–';
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
console.log(`\n═══ STRATEGY TELEMETRY — ${pack.id} (${RUNS} seeded runs, seed=${BASE_SEED}) ═══`);

console.log('\n── loadout → path conversion ──');
for (const [lo, paths] of Object.entries(t.commit)) {
  const total = sum(paths);
  const cells = Object.entries(paths).sort((a, b) => b[1] - a[1])
    .map(([p, n]) => `${p} ${pct(n, total)}`).join(' · ');
  console.log(`  ${lo.padEnd(18)} ${cells}   (${total} commits)`);
}

console.log('\n── outcomes by loadout ──');
for (const [lo, o] of Object.entries(t.outcomeByLoadout)) {
  const total = sum(o);
  const succ = o.success || 0;
  const rows = Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${pct(n, total)}`).join(' · ');
  console.log(`  ${lo.padEnd(18)} win ${pct(succ, total).padStart(6)} | ${rows}`);
}

console.log('\n── outcomes by path ──');
for (const [p, o] of Object.entries(t.outcomeByPath)) {
  const total = sum(o);
  console.log(`  ${p.padEnd(10)} success ${pct(o.success || 0, total)} · partial ${pct(o.partial || 0, total)} · failure ${pct(o.failure || 0, total)}  (${total} finales)`);
}

console.log('\n── dominant finale stat → outcome (are the stat strategies distinct?) ──');
for (const [st, o] of Object.entries(t.domStat)) {
  const total = sum(o);
  console.log(`  ${st.padEnd(10)} success ${pct(o.success || 0, total)} · partial ${pct(o.partial || 0, total)} · failure ${pct(o.failure || 0, total)}  (${total} runs)`);
}

console.log('\n── banking choices (sides that set a terminal flag) ──');
if (!terminalFlags.size) console.log('  (this pack declares no flag-triggered terminal rules)');
for (const [lo, b] of Object.entries(t.banking)) {
  console.log(`  ${lo.padEnd(18)} offered ${b.offered} · accepted ${b.accepted} (${pct(b.accepted, b.offered)})`);
}
if (t.bankState.acceptedN || t.bankState.refusedN) {
  for (const bucket of ['accepted', 'refused']) {
    const n = t.bankState[`${bucket}N`] || 1;
    const acc = t.bankState[bucket];
    const line = ['burnout', ...RES].map((k) => `${k} ${((acc[k] || 0) / n).toFixed(1)}`).join(' · ');
    console.log(`  at-choice state (${bucket}, n=${t.bankState[`${bucket}N`]}): ${line}`);
  }
}

console.log('\n── outcome by pressure-resource band (per-run maximum, tercile split) ──');
for (const r of RES) {
  const rows = t.resMax[r];
  const vals = rows.map((x) => x.max).sort((a, b) => a - b);
  if (!vals.length || vals[vals.length - 1] === vals[0]) continue;
  const lo = vals[Math.floor(vals.length / 3)];
  const hi = vals[Math.floor((2 * vals.length) / 3)];
  const bands = [[`≤${lo}`, (x) => x <= lo], [`${lo + 1}–${hi}`, (x) => x > lo && x <= hi], [`>${hi}`, (x) => x > hi]];
  const cells = bands.map(([label, f]) => {
    const inBand = rows.filter((x) => f(x.max));
    const wins = inBand.filter((x) => x.outcome === 'success').length;
    const enders = inBand.filter((x) => String(x.outcome).startsWith('gameover')).length;
    return `${label}: win ${pct(wins, inBand.length)} · gameover ${pct(enders, inBand.length)} (n=${inBand.length})`;
  }).join('  |  ');
  console.log(`  ${r.padEnd(11)} ${cells}`);
}

console.log('\n── option-selection ratios by tag (≥100 sightings) ──');
for (const [tag, s] of Object.entries(t.tagSides).sort((a, b) => sum(b[1]) - sum(a[1]))) {
  const total = s.left + s.right;
  if (total < 100) continue;
  console.log(`  ${tag.padEnd(14)} left ${pct(s.left, total)} · right ${pct(s.right, total)}  (${total})`);
}

const printBeats = (seen, episodes) => {
  for (const [beat, counts] of Object.entries(seen)) {
    const e = entropyOf(counts);
    const declared = beatVariants[beat]?.size || 0;
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1])
      .map(([id, n]) => `${id} ${pct(n, e.total)}`).join(' · ');
    console.log(`  ${beat.padEnd(11)} dealt-card H=${e.h} bits · ${e.variants}/${declared} declared variants seen · top ${pct(e.topShare * e.total, e.total)}`);
    console.log(`    ${rows}`);
    const ep = episodes?.[beat];
    // Show the episode view whenever a chain extends the beat — uniform
    // episodes are the finding (everyone reads the same scene), so they
    // print too; only chainless beats (episode === dealt card) are elided.
    if (ep && Object.keys(ep).some((sig) => sig.includes(' > '))) {
      const ee = entropyOf(ep);
      {
        const eRows = Object.entries(ep).sort((a, b) => b[1] - a[1]).slice(0, 6)
          .map(([sig, n]) => `${sig} ${pct(n, ee.total)}`).join(' · ');
        console.log(`    episode (card + its chain) H=${ee.h} bits · ${ee.variants} distinct readings · top ${pct(ee.topShare * ee.total, ee.total)}`);
        console.log(`      ${eRows}`);
      }
    }
  }
};
console.log('\n── landmark variant entropy (what a run actually sees at each beat) ──');
printBeats(t.beatSeen, t.beatEpisode);
if (knowingBeats) {
  console.log('\n── the same beats, for the knowing bard (cross-run knowledge applied) ──');
  printBeats(knowingBeats.beatSeen, knowingBeats.beatEpisode);
}

if (JSON_OUT) {
  const out = { pack: pack.id, runs: RUNS, seed: BASE_SEED, ...t, knowingBeats };
  console.log('\n' + JSON.stringify(out, null, 1));
}
console.log();
