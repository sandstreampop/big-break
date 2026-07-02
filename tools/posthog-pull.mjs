#!/usr/bin/env node
// Pull BIG BREAK telemetry from PostHog (EU) via the HogQL query API.
// Runs the insights from docs/telemetry.md plus a few overview queries,
// prints the results as JSON between markers, and writes
// posthog-results.json for artifact upload.
//
// Needs POSTHOG_TOKEN — a personal API key with query:read (the
// POSTHOGREADALLTOKEN secret in the gh-pages environment).

import fs from 'node:fs';

const TOKEN = process.env.POSTHOG_TOKEN;
const HOST = process.env.POSTHOG_HOST || 'https://eu.posthog.com';
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
let projectName = '(from env)';
if (!projectId) {
  const projects = await api('/api/projects/');
  const list = projects.results || [];
  const hit = list.find((p) => p.api_token === PROJECT_KEY) || list[0];
  if (!hit) { console.error('No projects visible to this token.'); process.exit(1); }
  projectId = hit.id;
  projectName = hit.name;
}
console.log(`# project: ${projectName} (id ${projectId})`);

const QUERIES = {
  // --- overview ---
  overview_by_event: `
    SELECT event, count() AS n, count(DISTINCT person_id) AS players
    FROM events GROUP BY event ORDER BY n DESC`,
  date_range: `
    SELECT min(timestamp) AS first_event, max(timestamp) AS last_event,
           count() AS events, count(DISTINCT person_id) AS players
    FROM events`,
  by_app_version: `
    SELECT properties.app_version AS version, count() AS events,
           count(DISTINCT person_id) AS players
    FROM events GROUP BY version ORDER BY events DESC`,
  activity_by_day: `
    SELECT toDate(timestamp) AS day,
           countIf(event = 'run_start') AS run_starts,
           countIf(event = 'run_end') AS run_ends,
           count(DISTINCT person_id) AS players
    FROM events GROUP BY day ORDER BY day`,

  // --- Insight 1: degenerate choices (fake-choice detector) ---
  degenerate_choices: `
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
    ORDER BY skew DESC`,
  degenerate_choices_low_n: `
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
    HAVING swipes >= 5
    ORDER BY skew DESC
    LIMIT 100`,

  // --- Insight 2: win rate per path ---
  win_rate_per_path: `
    SELECT
      properties.path AS path,
      count() AS runs,
      round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct,
      round(100 * countIf(properties.outcome = 'partial') / count()) AS partial_pct,
      round(100 * countIf(properties.outcome IN ('failure','gameover')) / count()) AS loss_pct
    FROM events
    WHERE event = 'run_end' AND properties.path != ''
    GROUP BY path
    ORDER BY runs DESC`,
  outcomes_overall: `
    SELECT properties.outcome AS outcome, count() AS runs,
           round(avg(properties.cards)) AS avg_cards,
           round(avg(properties.fame)) AS avg_fame,
           round(avg(properties.hits), 1) AS avg_hits
    FROM events WHERE event = 'run_end'
    GROUP BY outcome ORDER BY runs DESC`,

  // --- Insight 3: death causes ---
  death_causes: `
    SELECT properties.cause AS cause, count() AS deaths
    FROM events
    WHERE event = 'run_end' AND properties.outcome = 'gameover'
    GROUP BY cause
    ORDER BY deaths DESC`,

  // --- Insight 4: run-length distribution ---
  run_length: `
    SELECT properties.cards AS cards, count() AS runs
    FROM events
    WHERE event = 'run_end'
    GROUP BY cards
    ORDER BY cards`,

  // --- Insight 5 (SQL approximation): tutorial funnel per player ---
  funnel_per_player: `
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

  // --- Insight 6 (SQL approximation): return rate by day ---
  retention_approx: `
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

  // --- Insight 7: first-choice skew by instrument ---
  by_instrument: `
    SELECT
      properties.instrument AS instrument,
      count() AS runs,
      round(avg(properties.cards)) AS avg_cards,
      round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct
    FROM events
    WHERE event = 'run_end'
    GROUP BY instrument
    ORDER BY runs DESC`,

  // --- extras: mode + contract splits ---
  by_mode: `
    SELECT properties.mode AS mode, count() AS runs,
           count(DISTINCT person_id) AS players
    FROM events WHERE event = 'run_start'
    GROUP BY mode ORDER BY runs DESC`,
  by_contract: `
    SELECT properties.contract AS contract, count() AS runs,
           round(100 * countIf(properties.outcome = 'success') / count()) AS win_pct
    FROM events WHERE event = 'run_end'
    GROUP BY contract ORDER BY runs DESC`,
};

const out = {};
for (const [name, sql] of Object.entries(QUERIES)) {
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

fs.writeFileSync('posthog-results.json', JSON.stringify(out, null, 2));
console.log('===POSTHOG_RESULTS_BEGIN===');
console.log(JSON.stringify(out));
console.log('===POSTHOG_RESULTS_END===');
