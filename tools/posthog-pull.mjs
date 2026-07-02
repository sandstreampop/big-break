#!/usr/bin/env node
// Pull BIG BREAK telemetry from PostHog (EU) via the HogQL query API.
// Runs the insights from docs/telemetry.md plus overview queries and
// writes them into telemetry/ as:
//   telemetry/latest.json  — machine-readable, deterministic (clean diffs)
//   telemetry/summary.md   — the same data as human-readable tables
// It also prints the JSON between markers so a CI job log carries the
// full result. Output is deterministic: no fetch timestamps, and every
// query has a stable ORDER BY — the files only change when data does.
//
// Needs POSTHOG_TOKEN — a personal API key with query:read (the
// POSTHOGREADALLTOKEN secret in the github-pages environment).

import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.POSTHOG_TOKEN;
const HOST = process.env.POSTHOG_HOST || 'https://eu.posthog.com';
const OUT_DIR = process.env.OUT_DIR || 'telemetry';
// The game's project API key (js/analytics.js) — used to pick the right
// project when the personal key can see more than one.
const PROJECT_KEY = 'phc_C8Ch39GjAbPHvP6GE7boSFEuzqCDeMMc5oy4UJLnao6q';

if (!TOKEN) {
  console.error('POSTHOG_TOKEN is empty — is POSTHOGREADALLTOKEN set in this environment?');
  process.exit(1);
}

async function api(path, body) {
  const res = await fetch(HOST + path, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${(await res.text()).slice(0, 500)}`);
  return res.json();
}

let projectId = process.env.POSTHOG_PROJECT_ID;
if (!projectId) {
  const projects = await api('/api/projects/');
  const list = projects.results || [];
  const hit = list.find((p) => p.api_token === PROJECT_KEY) || list[0];
  if (!hit) { console.error('No projects visible to this token.'); process.exit(1); }
  projectId = hit.id;
  console.log(`# project: ${hit.name} (id ${projectId})`);
}

// Each entry: title for summary.md + the HogQL. Keys are the stable ids
// in latest.json. Every query needs a total ORDER BY for clean diffs.
const QUERIES = {
  // --- overview ---
  overview_by_event: {
    title: 'Events overview',
    sql: `
    SELECT event, count() AS n, count(DISTINCT person_id) AS players
    FROM events GROUP BY event ORDER BY n DESC, event`,
  },
  date_range: {
    title: 'Data range',
    sql: `
    SELECT min(timestamp) AS first_event, max(timestamp) AS last_event,
           count() AS events, count(DISTINCT person_id) AS players
    FROM events`,
  },
  by_app_version: {
    title: 'By app version',
    sql: `
    SELECT properties.app_version AS version, count() AS events,
           count(DISTINCT person_id) AS players
    FROM events GROUP BY version ORDER BY events DESC, version`,
  },
  activity_by_day: {
    title: 'Activity by day',
    sql: `
    SELECT toDate(timestamp) AS day,
           countIf(event = 'run_start') AS run_starts,
           countIf(event = 'run_end') AS run_ends,
           countIf(event = 'swipe') AS swipes,
           count(DISTINCT person_id) AS players
    FROM events GROUP BY day ORDER BY day`,
  },

  // --- Insight 1: degenerate choices (fake-choice detector) ---
  degenerate_choices: {
    title: 'Degenerate choices (n ≥ 20; skew ≥ 85 is suspect)',
    sql: `
    SELECT
      properties.card AS card,
      count() AS swipes,
      round(100 * countIf(properties.side = 'left')  / count()) AS left_pct,
      round(100 * countIf(properties.side = 'right') / count()) AS right_pct,
      greatest(
        round(100 * countIf(properties.side = 'left')  / count()),
        round(100 * countIf(properties.side = 'right') / count())
      ) AS skew,
      round(100 * countIf(properties.tier = 'bad') / count()) AS bad_pct
    FROM events
    WHERE event = 'swipe' AND properties.tutorial = false
    GROUP BY card
    HAVING swipes >= 20
    ORDER BY skew DESC, swipes DESC, card`,
  },
  degenerate_choices_low_n: {
    title: 'Choice skew, low sample (5 ≤ n < 20; directional only)',
    sql: `
    SELECT
      properties.card AS card,
      count() AS swipes,
      round(100 * countIf(properties.side = 'left')  / count()) AS left_pct,
      round(100 * countIf(properties.side = 'right') / count()) AS right_pct,
      greatest(
        round(100 * countIf(properties.side = 'left')  / count()),
        round(100 * countIf(properties.side = 'right') / count())
      ) AS skew,
      round(100 * countIf(properties.tier = 'bad') / count()) AS bad_pct
    FROM events
    WHERE event = 'swipe' AND properties.tutorial = false
    GROUP BY card
    HAVING swipes >= 5 AND swipes < 20
    ORDER BY skew DESC, swipes DESC, card
    LIMIT 100`,
  },
  tier_by_act: {
    title: 'Swipe outcome tiers by act',
    sql: `
    SELECT
      properties.act AS act,
      count() AS swipes,
      round(100 * countIf(properties.tier = 'bad') / count()) AS bad_pct,
      round(100 * countIf(properties.tier = 'good') / count()) AS good_pct,
      round(100 * countIf(properties.tier = 'incredible') / count()) AS incredible_pct,
      round(100 * countIf(properties.tier = 'declined') / count()) AS declined_pct
    FROM events
    WHERE event = 'swipe' AND properties.tutorial = false
    GROUP BY act ORDER BY act`,
  },

  // --- Insight 2: win rate per path ---
  win_rate_per_path: {
    title: 'Win rate per path (target band: 25–40% success)',
    sql: `
    SELECT
      properties.path AS path,
      count() AS runs,
      round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct,
      round(100 * countIf(properties.outcome = 'partial') / count()) AS partial_pct,
      round(100 * countIf(properties.outcome IN ('failure','gameover')) / count()) AS loss_pct
    FROM events
    WHERE event = 'run_end' AND properties.path != ''
    GROUP BY path
    ORDER BY runs DESC, path`,
  },
  outcomes_overall: {
    title: 'Outcomes overall',
    sql: `
    SELECT properties.outcome AS outcome, count() AS runs,
           round(avg(properties.cards)) AS avg_cards,
           round(avg(properties.fame)) AS avg_fame,
           round(avg(properties.hits), 1) AS avg_hits,
           round(avg(properties.burnout)) AS avg_burnout,
           round(avg(properties.chart_peak), 1) AS avg_chart_peak
    FROM events WHERE event = 'run_end'
    GROUP BY outcome ORDER BY runs DESC, outcome`,
  },
  run_end_by_mode: {
    title: 'Runs by mode (mode on run_end since v2.1 telemetry)',
    sql: `
    SELECT properties.mode AS mode, count() AS runs,
           round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct
    FROM events WHERE event = 'run_end'
    GROUP BY mode ORDER BY runs DESC, mode`,
  },

  // --- Insight 3: death causes ---
  death_causes: {
    title: 'Death causes (gameovers)',
    sql: `
    SELECT properties.cause AS cause, count() AS deaths
    FROM events
    WHERE event = 'run_end' AND properties.outcome = 'gameover'
    GROUP BY cause
    ORDER BY deaths DESC, cause`,
  },

  // --- Insight 4: run-length distribution ---
  run_length: {
    title: 'Run-length distribution (cards per run)',
    sql: `
    SELECT properties.cards AS cards, count() AS runs
    FROM events
    WHERE event = 'run_end'
    GROUP BY cards
    ORDER BY cards`,
  },

  // --- Insight 5 (SQL approximation): tutorial funnel per player ---
  funnel_per_player: {
    title: 'Funnel per player (visitors → tutorial → runs → replay)',
    sql: `
    SELECT
      count() AS players,
      countIf(t_start > 0) AS tutorial_start,
      countIf(t_complete > 0) AS tutorial_complete,
      countIf(t_skip > 0) AS tutorial_skip,
      countIf(runs >= 1) AS ran_once,
      countIf(run_ends >= 1) AS finished_once,
      countIf(runs >= 2) AS ran_twice
    FROM (
      SELECT person_id,
        countIf(event = 'tutorial_start') AS t_start,
        countIf(event = 'tutorial_complete') AS t_complete,
        countIf(event = 'tutorial_skip') AS t_skip,
        countIf(event = 'run_start') AS runs,
        countIf(event = 'run_end') AS run_ends
      FROM events GROUP BY person_id
    )`,
  },

  // --- Insight 6 (SQL approximation): return rate by day ---
  retention_approx: {
    title: 'Retention approximation (players who ran on a later day)',
    sql: `
    SELECT
      count() AS players,
      countIf(active_days > 1) AS multi_day_players,
      countIf(has(days, first_day + 1)) AS d1_returners,
      countIf(arrayExists(d -> d >= first_day + 7, days)) AS d7plus_returners
    FROM (
      SELECT person_id,
             groupUniqArray(toDate(timestamp)) AS days,
             min(toDate(timestamp)) AS first_day,
             count(DISTINCT toDate(timestamp)) AS active_days
      FROM events WHERE event = 'run_start'
      GROUP BY person_id
    )`,
  },

  // --- Insight 7: first-choice skew by instrument ---
  by_instrument: {
    title: 'Runs by instrument',
    sql: `
    SELECT
      properties.instrument AS instrument,
      count() AS runs,
      round(avg(properties.cards)) AS avg_cards,
      round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct
    FROM events
    WHERE event = 'run_end'
    GROUP BY instrument
    ORDER BY runs DESC, instrument`,
  },

  // --- splits: mode / contract / genre at run start ---
  by_mode: {
    title: 'Run starts by mode',
    sql: `
    SELECT properties.mode AS mode, count() AS runs,
           count(DISTINCT person_id) AS players
    FROM events WHERE event = 'run_start'
    GROUP BY mode ORDER BY runs DESC, mode`,
  },
  by_contract: {
    title: 'Runs by contract',
    sql: `
    SELECT properties.contract AS contract, count() AS runs,
           round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct
    FROM events WHERE event = 'run_end'
    GROUP BY contract ORDER BY runs DESC, contract`,
  },
  by_genre: {
    title: 'Run starts by genre',
    sql: `
    SELECT properties.genre AS genre, count() AS runs
    FROM events WHERE event = 'run_start'
    GROUP BY genre ORDER BY runs DESC, genre`,
  },

  // --- minigames ---
  minigame_stats: {
    title: 'Minigames (plays, score, skip rate)',
    sql: `
    SELECT properties.id AS game, count() AS plays,
           round(avg(properties.score), 1) AS avg_score,
           round(avg(properties.bonus), 1) AS avg_bonus,
           round(100 * countIf(properties.skipped = true) / count()) AS skip_pct
    FROM events WHERE event = 'minigame'
    GROUP BY game ORDER BY plays DESC, game`,
  },
};

const out = {};
for (const [name, { sql }] of Object.entries(QUERIES)) {
  try {
    const r = await api(`/api/projects/${projectId}/query/`, {
      query: { kind: 'HogQLQuery', query: sql },
    });
    out[name] = { columns: r.columns, results: r.results };
    console.log(`# ${name}: ${r.results?.length ?? 0} rows`);
  } catch (e) {
    out[name] = { error: String(e.message) };
    console.log(`# ${name}: ERROR ${e.message}`);
  }
}

// ---- telemetry/latest.json — deterministic machine output ----
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'latest.json'), JSON.stringify(out, null, 2) + '\n');

// ---- telemetry/summary.md — the same data as markdown tables ----
function mdTable({ columns, results }) {
  if (!columns?.length) return '_no columns_\n';
  if (!results?.length) return '_no rows_\n';
  const esc = (v) => (v === null || v === undefined ? '—' : String(v).replace(/\|/g, '\\|'));
  const lines = [
    `| ${columns.join(' | ')} |`,
    `|${columns.map(() => '---').join('|')}|`,
    ...results.map((row) => `| ${row.map(esc).join(' | ')} |`),
  ];
  return lines.join('\n') + '\n';
}

const range = out.date_range?.results?.[0];
let md = '# BIG BREAK — telemetry summary\n\n';
md += 'Auto-generated by `tools/posthog-pull.mjs` (see `docs/telemetry.md`).\n';
md += 'Machine-readable version: `telemetry/latest.json`.\n\n';
if (range) md += `**Data through:** ${range[1]} · ${range[2]} events · ${range[3]} players (since ${range[0]})\n\n`;
for (const [name, { title }] of Object.entries(QUERIES)) {
  md += `## ${title}\n\n`;
  md += out[name].error ? `Query error: \`${out[name].error}\`\n` : mdTable(out[name]);
  md += '\n';
}
fs.writeFileSync(path.join(OUT_DIR, 'summary.md'), md);

console.log('===POSTHOG_RESULTS_BEGIN===');
console.log(JSON.stringify(out));
console.log('===POSTHOG_RESULTS_END===');
