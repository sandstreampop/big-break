// BIG BREAK telemetry analyzer.
// Turns an exported event log into the balance signals that matter —
// no PostHog login, works the instant a playtester sends their blob.
//
//   node tools/analyze-events.mjs events.json        # file arg
//   pbpaste | node tools/analyze-events.mjs           # or stdin
//
// Input: the ring-buffer JSON from the in-game "Send session data" button
// (an array of { event, props, ts }). Multiple blobs can be concatenated
// into one array. PostHog CSV/JSON exports also work if reshaped to that
// array; the in-game export is the primary source.
//
// Flags the same things the sim can't see because they need real humans:
//   - degenerate choices (a card everyone swipes the same way = fake choice)
//   - win rate per path (target band configurable)
//   - death-cause breakdown, run-length distribution, tutorial funnel.

import { readFileSync } from 'node:fs';

const SKEW_FLAG = 85;   // % one-direction that marks a choice as suspect
const MIN_SAMPLES = 20; // don't judge a card on a handful of swipes
const WIN_TARGET = [25, 40]; // roguelike success band (%)

function readInput() {
  const arg = process.argv[2];
  const raw = arg ? readFileSync(arg, 'utf8') : readFileSync(0, 'utf8');
  const text = raw.trim();
  if (!text) return [];
  const data = JSON.parse(text);
  return Array.isArray(data) ? data : (data.events || data.results || []);
}

// PostHog exports nest under `properties`; the in-game blob uses `props`.
const propsOf = (e) => e.props || e.properties || {};
const nameOf = (e) => e.event || e.name;

function pct(n, d) { return d ? Math.round((100 * n) / d) : 0; }
function bar(p, width = 24) {
  const f = Math.round((p / 100) * width);
  return '█'.repeat(f) + '·'.repeat(width - f);
}

function analyze(events) {
  const swipes = events.filter((e) => nameOf(e) === 'swipe');
  const runEnds = events.filter((e) => nameOf(e) === 'run_end');
  const out = [];

  out.push(`# BIG BREAK telemetry — ${events.length} events (${swipes.length} swipes, ${runEnds.length} finished runs)\n`);

  // ---- degenerate-choice detector ----
  const byCard = new Map();
  for (const e of swipes) {
    const p = propsOf(e);
    if (p.tutorial) continue; // the tutorial is scripted; skew is expected
    const c = byCard.get(p.card) || { n: 0, left: 0, right: 0, bad: 0 };
    c.n++;
    if (p.side === 'left') c.left++; else if (p.side === 'right') c.right++;
    if (p.tier === 'bad') c.bad++;
    byCard.set(p.card, c);
  }
  const cards = [...byCard.entries()]
    .map(([card, c]) => ({ card, ...c, skew: Math.max(pct(c.left, c.n), pct(c.right, c.n)), badPct: pct(c.bad, c.n) }))
    .filter((c) => c.n >= MIN_SAMPLES)
    .sort((a, b) => b.skew - a.skew);
  out.push(`## Degenerate choices  (≥${SKEW_FLAG}% one direction on ≥${MIN_SAMPLES} swipes = fake choice — cut or fix)`);
  const flagged = cards.filter((c) => c.skew >= SKEW_FLAG);
  if (!flagged.length) out.push('  none flagged — every card with enough data is a real decision ✓');
  for (const c of flagged) {
    const dir = c.left >= c.right ? 'LEFT' : 'RIGHT';
    out.push(`  ⚠ ${c.card.padEnd(22)} ${String(c.skew).padStart(3)}% → ${dir}  (${c.n} swipes, ${c.badPct}% bad)`);
  }
  if (cards.length > flagged.length) {
    out.push(`  … ${cards.length - flagged.length} other cards within healthy range.`);
  }
  out.push('');

  // ---- win rate per path ----
  const byPath = new Map();
  for (const e of runEnds) {
    const p = propsOf(e);
    const path = p.path || '(no path)';
    const b = byPath.get(path) || { runs: 0, success: 0, partial: 0, loss: 0 };
    b.runs++;
    if (p.outcome === 'success') b.success++;
    else if (p.outcome === 'partial') b.partial++;
    else b.loss++;
    byPath.set(path, b);
  }
  out.push(`## Win rate per path  (target success band ${WIN_TARGET[0]}–${WIN_TARGET[1]}%)`);
  for (const [path, b] of byPath) {
    const w = pct(b.success, b.runs);
    const flag = path === '(no path)' ? '' : w < WIN_TARGET[0] ? '  ⚠ too hard' : w > WIN_TARGET[1] ? '  ⚠ too easy' : '  ✓';
    out.push(`  ${path.padEnd(12)} ${bar(w)} ${String(w).padStart(3)}% win  (${b.success}/${b.runs}, ${pct(b.partial, b.runs)}% partial)${flag}`);
  }
  out.push('');

  // ---- death causes ----
  const causes = new Map();
  for (const e of runEnds) {
    const p = propsOf(e);
    if (p.outcome !== 'gameover') continue;
    causes.set(p.cause, (causes.get(p.cause) || 0) + 1);
  }
  out.push('## Death causes  (early game-overs)');
  const totalDeaths = [...causes.values()].reduce((a, b) => a + b, 0);
  if (!totalDeaths) out.push('  none — no run hit a fail state.');
  for (const [cause, n] of [...causes.entries()].sort((a, b) => b[1] - a[1])) {
    out.push(`  ${String(cause).padEnd(12)} ${n}  (${pct(n, runEnds.length)}% of all runs)`);
  }
  out.push('');

  // ---- run-length distribution ----
  const lengths = runEnds.map((e) => propsOf(e).cards).filter((n) => Number.isFinite(n));
  if (lengths.length) {
    lengths.sort((a, b) => a - b);
    const mean = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
    const median = lengths[Math.floor(lengths.length / 2)];
    out.push('## Run length');
    out.push(`  mean ${mean} cards · median ${median} · min ${lengths[0]} · max ${lengths[lengths.length - 1]}`);
    out.push('');
  }

  // ---- tutorial funnel ----
  const tStart = events.filter((e) => nameOf(e) === 'tutorial_start').length;
  const tDone = events.filter((e) => nameOf(e) === 'tutorial_complete').length;
  const tSkip = events.filter((e) => nameOf(e) === 'tutorial_skip').length;
  if (tStart || tSkip) {
    out.push('## Tutorial funnel  (per-session counts; use PostHog funnels for per-player)');
    out.push(`  started ${tStart} · completed ${tDone} (${pct(tDone, tStart)}%) · skipped ${tSkip}`);
    out.push('');
  }

  return out.join('\n');
}

const events = readInput();
console.log(analyze(events));
