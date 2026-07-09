// The pack report: one readable page that answers "is this pack sound, and
// how does it actually play?" — the authoring loop's feedback step (contract →
// content → simulation), for humans and LLMs alike. Where validate-packs is a
// pass/fail gate and simulate-pack a balance gate, this is the DIAGNOSTIC: it
// runs the same validator and the same genre-neutral driver, then reports what
// an author needs to REPAIR or TUNE, in that order.
//
//   Contract    — validatePack errors/warnings (schema + semantics)
//   Taxonomy    — the manifest at a glance (stats, resources, run shape, paths)
//   Deck        — counts per segment, delivery classes, gated share
//   Vocabulary  — effect-verb and governing-stat usage; DECLARED-BUT-NEVER-USED
//                 keys (a stat no card moves is dead taxonomy)
//   Simulation  — seeded Monte-Carlo: run length, outcome mix vs the pack's
//                 own balance band, fail states, path pick/success, card reach
//                 (dead cards first), stat/resource averages at the finale
//
// Usage: node tools/pack-report.mjs <packId> [--runs=N] [--seed=N] [--json]
//        node tools/pack-report.mjs --all [--runs=N] [--json]
// Deterministic by default (pinned seed) so two reports on the same build are
// byte-identical — diffs mean the PACK changed. --json emits the full report
// object for tooling / an LLM repair loop.

import { PACKS } from '../dist/js/packs/registry.js';
import { validatePack, formatIssue } from '../dist/js/validate.js';
import { CORE_EFFECT_VERBS, mulberry32 } from '../dist/js/engine.js';
import { simulatePackRun } from './pack-core.mjs';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flag = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : dflt;
};
const JSON_OUT = args.includes('--json');
const ALL = args.includes('--all');
const RUNS = parseInt(flag('runs', '1000'), 10);
const SEED = parseInt(flag('seed', String(0x5EED)), 10);

const packs = ALL ? PACKS : PACKS.filter((p) => p.id === positional[0]);
if (!packs.length) {
  console.error(`usage: node tools/pack-report.mjs <packId>|--all [--runs=N] [--seed=N] [--json]`);
  console.error(`registered: ${PACKS.map((p) => p.id).join(', ')}`);
  process.exit(1);
}

const pct = (n, d) => (d ? ((100 * n) / d).toFixed(1) + '%' : '—');

// ── Static deck analysis: what the corpus declares, before any run. ──
function analyzeDeck(pack) {
  const m = pack.manifest;
  const events = pack.events;
  const perAct = m.segments.map((_, i) => ({
    act: i + 1,
    total: 0, open: 0, gated: 0,
  }));
  const delivery = { chainOnly: 0, finaleCard: 0, shop: 0, flashpoint: 0, packGated: 0 };
  const effectUse = new Map();   // verb -> cards that move it
  const governUse = new Map();   // stat -> choices governed by it
  const chainTargets = new Set();
  for (const ev of events) {
    const acts = Array.isArray(ev.act) ? ev.act : [ev.act];
    for (const a of acts) {
      const row = perAct[a - 1];
      if (!row) continue;
      row.total++;
      if (ev.requires || ev.chainOnly || ev.finaleCard || (ev.pathAffinity || []).length) row.gated++;
      else row.open++;
    }
    if (ev.chainOnly) delivery.chainOnly++;
    if (ev.finaleCard) delivery.finaleCard++;
    if (ev.shop) delivery.shop++;
    if (ev.flashpoint) delivery.flashpoint++;
    if (ev.pack) delivery.packGated++;
    for (const side of ['left', 'right']) {
      const c = ev.choices?.[side];
      if (!c) continue;
      for (const k of Object.keys(c.governingStats || {})) {
        governUse.set(k, (governUse.get(k) || 0) + 1);
      }
      for (const t of ['bad', 'good', 'incredible']) {
        const fx = c.outcomes?.[t]?.effects || {};
        for (const k of Object.keys(fx)) effectUse.set(k, (effectUse.get(k) || 0) + 1);
        if (fx.chainEventId) chainTargets.add(fx.chainEventId);
      }
    }
  }
  // Dead taxonomy: declared keys no card ever moves (a plugin may still move
  // them — flagged as "unused by the deck", not "unusable").
  const unusedStats = m.stats.filter((s) => !effectUse.has(s));
  const unusedResources = m.resources.filter((r) => !effectUse.has(r));
  const ungoverned = m.stats.filter((s) => !governUse.has(s));
  // Finale coverage: which committed paths have a climax card authored.
  const finaleByPath = Object.fromEntries(Object.keys(m.paths).map((pid) => [
    pid, events.filter((e) => e.finaleCard && e.pathAffinity?.includes(pid)).length,
  ]));
  return { perAct, delivery, effectUse, governUse, unusedStats, unusedResources, ungoverned, finaleByPath, chains: chainTargets.size };
}

// ── Seeded Monte-Carlo over the genre-neutral driver. ──
function simulate(pack) {
  const seedGen = mulberry32(SEED);
  const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;
  const t = {
    cards: 0, dry: 0, lp: 0,
    tiers: { bad: 0, good: 0, incredible: 0, declined: 0 },
    outcomes: { success: 0, partial: 0, failure: 0 },
    fails: {}, byPath: {}, reach: {},
    resSum: {}, statSum: {}, finaleCount: 0,
  };
  for (let i = 0; i < RUNS; i++) {
    const run = simulatePackRun(pack, nextSeed());
    t.cards += run.cards.length;
    t.dry += run.dry;
    t.lp += run.lp;
    const seen = new Set();
    for (const c of run.cards) {
      t.tiers[c.tier] = (t.tiers[c.tier] || 0) + 1;
      seen.add(c.id);
    }
    for (const id of seen) t.reach[id] = (t.reach[id] || 0) + 1;
    if (run.finale) {
      t.outcomes[run.finale.result]++;
      const bp = (t.byPath[run.finale.path] ||= { picks: 0, success: 0 });
      bp.picks++;
      if (run.finale.result === 'success') bp.success++;
      for (const r of pack.manifest.resources) t.resSum[r] = (t.resSum[r] || 0) + (run.state[r] || 0);
      for (const s of [...pack.manifest.stats, 'burnout']) t.statSum[s] = (t.statSum[s] || 0) + (run.state.stats[s] || 0);
      t.finaleCount++;
    }
    if (run.gameover) t.fails[run.gameover] = (t.fails[run.gameover] || 0) + 1;
  }
  // Card reach: dead first, then rare.
  const rows = pack.events.map((e) => ({
    id: e.id,
    gated: !!(e.requires || e.chainOnly || e.finaleCard || (e.pathAffinity || []).length || e.pack),
    runs: t.reach[e.id] || 0,
  }));
  t.dead = rows.filter((r) => !r.runs);
  t.rare = rows.filter((r) => r.runs > 0 && r.runs / RUNS < 0.05);
  t.eventCount = rows.length;
  return t;
}

function buildReport(pack) {
  const v = validatePack(pack);
  const deck = analyzeDeck(pack);
  const sim = simulate(pack);
  const m = pack.manifest;
  const band = m.balanceBand || null;
  const successPct = (100 * sim.outcomes.success) / RUNS;
  return {
    pack: pack.id,
    runs: RUNS,
    seed: SEED,
    contract: {
      ok: v.ok,
      errors: v.errors,
      warnings: v.warnings,
    },
    taxonomy: {
      stats: m.stats,
      resources: m.resources,
      segments: m.segments.map((s) => s.crossroads ? `${s.length}✕` : s.length),
      paths: Object.keys(m.paths),
      failStates: (m.failStates || []).map((f) => `${f.ending} (${f.key} ${f.cmp} ${f.value})`),
      plugins: (pack.plugins || []).map((p) => p.id),
    },
    deck: {
      events: pack.events.length,
      tutorialEvents: pack.tutorialEvents.length,
      perAct: deck.perAct,
      delivery: deck.delivery,
      chains: deck.chains,
      finaleByPath: deck.finaleByPath,
    },
    vocabulary: {
      effectUse: Object.fromEntries([...deck.effectUse.entries()].sort((a, b) => b[1] - a[1])),
      governUse: Object.fromEntries([...deck.governUse.entries()].sort((a, b) => b[1] - a[1])),
      unusedStats: deck.unusedStats,
      unusedResources: deck.unusedResources,
      ungovernedStats: deck.ungoverned,
    },
    simulation: {
      avgCards: sim.cards / RUNS,
      avgLp: sim.lp / RUNS,
      deckDryEvents: sim.dry,
      tiers: sim.tiers,
      outcomes: sim.outcomes,
      successPct,
      balanceBand: band,
      inBand: band ? successPct >= band.successMin && successPct <= band.successMax : null,
      failStates: sim.fails,
      paths: sim.byPath,
      deadCards: sim.dead,
      rareCards: sim.rare.map((r) => r.id),
      finaleAverages: {
        stats: Object.fromEntries(Object.entries(sim.statSum).map(([k, s]) => [k, +(s / (sim.finaleCount || 1)).toFixed(1)])),
        resources: Object.fromEntries(Object.entries(sim.resSum).map(([k, s]) => [k, +(s / (sim.finaleCount || 1)).toFixed(1)])),
      },
    },
  };
}

function printReport(r, pack) {
  const line = (s = '') => console.log(s);
  line(`\n═══ PACK REPORT — ${r.pack} (${r.runs} seeded runs, seed=${r.seed}) ═══`);

  // 1. Contract first: a pack that violates it isn't worth tuning yet.
  line(`\n── contract ──`);
  if (r.contract.ok && !r.contract.warnings.length) line('  ✓ schema + semantics clean');
  else {
    for (const i of [...r.contract.errors, ...r.contract.warnings]) line(formatIssue(i).replace(/^/gm, '  '));
    if (!r.contract.ok) line(`  → repair the errors above before tuning; the numbers below may be artifacts.`);
  }

  const tx = r.taxonomy;
  line(`\n── taxonomy ──`);
  line(`  stats      ${tx.stats.join(', ')}`);
  line(`  resources  ${tx.resources.join(', ')}`);
  line(`  run shape  [${tx.segments.join(' · ')}] cards (✕ = crossroads)`);
  line(`  paths      ${tx.paths.join(', ') || '(none)'}`);
  if (tx.failStates.length) line(`  fails      burnout (engine) + ${tx.failStates.join(', ')}`);
  else line(`  fails      burnout (engine) only`);
  if (tx.plugins.length) line(`  plugins    ${tx.plugins.join(', ')}`);

  const d = r.deck;
  line(`\n── deck ──`);
  line(`  ${d.events} events (+${d.tutorialEvents} tutorial)`);
  for (const row of d.perAct) {
    line(`  act ${row.act}: ${String(row.total).padStart(3)} eligible · ${row.open} open / ${row.gated} gated (${pct(row.gated, row.total)} gated)`);
  }
  const del = d.delivery;
  line(`  delivery: ${del.chainOnly} chain-only · ${del.finaleCard} finale · ${del.shop} shop · ${del.flashpoint} flashpoint · ${del.packGated} unlock-gated · ${d.chains} chain targets`);
  const missingFinale = Object.entries(d.finaleByPath).filter(([, n]) => !n).map(([p]) => p);
  if (missingFinale.length && Object.values(d.finaleByPath).some((n) => n)) {
    line(`  ⚠ paths without a finale (climax) card: ${missingFinale.join(', ')} — their runs end without a path set-piece`);
  }

  const voc = r.vocabulary;
  line(`\n── vocabulary (cards moving each key) ──`);
  const fmtUse = (o) => Object.entries(o).map(([k, n]) => `${k} ${n}`).join(' · ');
  line(`  effects:   ${fmtUse(voc.effectUse)}`);
  line(`  governs:   ${fmtUse(voc.governUse) || '(no card declares governingStats)'}`);
  if (voc.unusedStats.length) line(`  ⚠ declared stats no card moves: ${voc.unusedStats.join(', ')}`);
  if (voc.unusedResources.length) line(`  ⚠ declared resources no card moves: ${voc.unusedResources.join(', ')} (fine if a plugin owns them)`);
  if (voc.ungovernedStats.length) line(`  ⚠ stats governing no choice: ${voc.ungovernedStats.join(', ')} (the meter never matters to a roll)`);

  const s = r.simulation;
  line(`\n── simulation (${r.runs} runs) ──`);
  line(`  avg run length ${s.avgCards.toFixed(1)} cards · avg LP ${s.avgLp.toFixed(1)} · deck-dry events ${s.deckDryEvents}${s.deckDryEvents ? ' ⚠ (an act ran out of cards)' : ''}`);
  const tt = s.tiers, tot = tt.bad + tt.good + tt.incredible + tt.declined || 1;
  line(`  tiers: bad ${pct(tt.bad, tot)} / good ${pct(tt.good, tot)} / incredible ${pct(tt.incredible, tot)} / declined ${pct(tt.declined, tot)}`);
  const oc = s.outcomes;
  const bandTxt = s.balanceBand
    ? (s.inBand ? `✓ in band ${s.balanceBand.successMin}–${s.balanceBand.successMax}%` : `⚠ OUT OF BAND ${s.balanceBand.successMin}–${s.balanceBand.successMax}%`)
    : '(no balanceBand declared — add one to gate deploys on it)';
  line(`  outcomes: success ${pct(oc.success, r.runs)} · partial ${pct(oc.partial, r.runs)} · failure ${pct(oc.failure, r.runs)} — ${bandTxt}`);
  const fails = Object.entries(s.failStates).sort((a, b) => b[1] - a[1]);
  line(`  fail states: ${fails.length ? fails.map(([k, n]) => `${k} ${pct(n, r.runs)}`).join(' · ') : '(none hit)'}`);
  for (const [pid, b] of Object.entries(s.paths)) {
    line(`  path ${pid}: picked ${pct(b.picks, r.runs)} · wins ${pct(b.success, b.picks)} of picks`);
  }
  line(`  card reach: ${s.deadCards.length ? `⚠ ${s.deadCards.length} never drawn` : '✓ every card appeared'}${s.rareCards.length ? ` · ${s.rareCards.length} under 5%` : ''}`);
  for (const dc of s.deadCards) {
    line(`    never: ${dc.gated ? '[gated]' : '[OPEN ⚠]'} ${dc.id}`);
  }
  const fa = s.finaleAverages;
  line(`  at the finale — stats: ${Object.entries(fa.stats).map(([k, v2]) => `${k} ${v2}`).join(' · ')}`);
  line(`                  resources: ${Object.entries(fa.resources).map(([k, v2]) => `${k} ${v2}`).join(' · ')}`);
  line('');
}

const reports = packs.map((p) => buildReport(p));
if (JSON_OUT) {
  console.log(JSON.stringify(ALL ? reports : reports[0], null, 2));
} else {
  reports.forEach((r, i) => printReport(r, packs[i]));
}
// A contract error makes the report itself a failure signal for scripting.
process.exit(reports.every((r) => r.contract.ok) ? 0 : 1);
