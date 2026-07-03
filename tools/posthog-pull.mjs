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

  // --- how many unique players? (report a RANGE, never a false single) ---
  // distinct_installs is the CEILING (localStorage identity double-counts a
  // human across browsers/incognito). real_players_est strips dev/owner/
  // localhost and is the working floor. tagged_installs uses the install_id
  // super-property (js/analytics.js) — populated from this pass forward, so
  // it reads 0 for historical events. The truth sits between the floor and
  // the ceiling; cookieless analytics cannot collapse it to one number.
  unique_players: {
    title: 'Unique players (distinct installs = ceiling; real_players_est = testing stripped)',
    sql: `
    SELECT
      count(DISTINCT person_id) AS distinct_installs,
      count(DISTINCT nullIf(properties.install_id, '')) AS tagged_installs,
      count(DISTINCT if(
        coalesce(properties.env, '') != 'dev'
        AND coalesce(toString(properties.is_owner), '') NOT IN ('true', '1')
        AND coalesce(properties.$host, '') NOT IN ('localhost', '127.0.0.1', ''),
        person_id, NULL)) AS real_players_est
    FROM events`,
  },
  players_by_env: {
    title: 'Players by env / owner tag (populated from this telemetry pass forward)',
    sql: `
    SELECT
      coalesce(properties.env, '(untagged)') AS env,
      coalesce(toString(properties.is_owner), '(untagged)') AS is_owner,
      count(DISTINCT person_id) AS players, count() AS events
    FROM events GROUP BY env, is_owner ORDER BY players DESC, env, is_owner`,
  },

  // --- who is playing: separate real players from dev/owner traffic ---
  // PostHog attaches $host/$current_url/$geoip/$browser to EVERY event by
  // default (autocapture off only disables DOM-click capture, not these).
  // None of it is PII — it's the coarse metadata any web request carries.
  // We deliberately stay at host/country/device granularity (never city,
  // never per-person rows) so the committed file can't deanonymize anyone.
  players_by_host: {
    title: 'Players by host (localhost / 127.* / file: is owner testing; the github.io host is real play)',
    sql: `
    SELECT properties.$host AS host,
           count(DISTINCT person_id) AS players,
           count() AS events,
           countIf(event = 'run_end') AS run_ends
    FROM events GROUP BY host ORDER BY players DESC, events DESC, host`,
  },
  players_by_geo: {
    title: 'Players by country (spread beyond your own = genuine reach)',
    sql: `
    SELECT properties.$geoip_country_code AS country,
           count(DISTINCT person_id) AS players, count() AS events
    FROM events GROUP BY country ORDER BY players DESC, events DESC, country`,
  },
  players_by_device: {
    title: 'Players by device / browser / OS (many browsers, one human = inflated player count)',
    sql: `
    SELECT properties.$device_type AS device, properties.$browser AS browser,
           properties.$os AS os,
           count(DISTINCT person_id) AS players, count() AS events
    FROM events GROUP BY device, browser, os
    ORDER BY players DESC, events DESC, device, browser, os`,
  },

  // --- how the data clusters across players (the pseudoreplication check) ---
  // Histograms, NOT per-person rows: keeps the file identifier-free and
  // diff-stable while still showing "one tester with 30 runs" vs "a spread".
  runs_per_player_dist: {
    title: 'Distribution of finished runs per player (is it one whale or many players?)',
    sql: `
    SELECT run_ends, count() AS players
    FROM (
      SELECT person_id, countIf(event = 'run_end') AS run_ends
      FROM events GROUP BY person_id
    )
    WHERE run_ends > 0
    GROUP BY run_ends ORDER BY run_ends`,
  },
  active_days_per_player_dist: {
    title: 'Distribution of active days per player (engagement depth)',
    sql: `
    SELECT active_days, count() AS players
    FROM (
      SELECT person_id, count(DISTINCT toDate(timestamp)) AS active_days
      FROM events GROUP BY person_id
    )
    GROUP BY active_days ORDER BY active_days`,
  },
  players_by_first_day: {
    title: 'New players by first-seen day (acquisition curve)',
    sql: `
    SELECT first_day AS day, count() AS new_players
    FROM (
      SELECT person_id, min(toDate(timestamp)) AS first_day
      FROM events GROUP BY person_id
    )
    GROUP BY day ORDER BY day`,
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

  // --- coverage feeds (diffed against the content catalogs below) ---
  card_seen: {
    title: 'Every card ever swiped (coverage feed)',
    sql: `
    SELECT properties.card AS card, count() AS swipes
    FROM events WHERE event = 'swipe' AND properties.tutorial = false
    GROUP BY card ORDER BY card`,
  },
  finale_endings: {
    title: 'Finale endings reached (path × outcome)',
    sql: `
    SELECT properties.path AS path, properties.outcome AS outcome, count() AS runs
    FROM events
    WHERE event = 'run_end' AND properties.outcome IN ('success','partial','failure')
    GROUP BY path, outcome ORDER BY path, outcome`,
  },
  by_venue: {
    title: 'Run starts by home venue',
    sql: `
    SELECT properties.venue AS venue, count() AS runs
    FROM events WHERE event = 'run_start'
    GROUP BY venue ORDER BY runs DESC, venue`,
  },
  rival_seen: {
    title: 'Rivals faced (tracked since app 2.2)',
    sql: `
    SELECT properties.rival AS rival, count() AS runs
    FROM events WHERE event = 'run_end' AND properties.rival != 'none'
    GROUP BY rival ORDER BY runs DESC, rival`,
  },
  exit_seen: {
    title: 'Exit-interview choices taken (tracked since app 2.2)',
    sql: `
    SELECT properties.exit AS exit, count() AS n
    FROM events WHERE event = 'run_end' AND properties.exit != 'none'
    GROUP BY exit ORDER BY n DESC, exit`,
  },
  trophy_seen: {
    title: 'Trophies earned (tracked since app 2.2)',
    sql: `
    SELECT properties.id AS trophy, count() AS n
    FROM events WHERE event = 'trophy'
    GROUP BY trophy ORDER BY n DESC, trophy`,
  },
  band_seen: {
    title: 'Bandmates recruited (tracked since app 2.2)',
    sql: `
    SELECT arrayJoin(splitByChar(',', coalesce(properties.band, ''))) AS id, count() AS n
    FROM events WHERE event = 'run_end' AND coalesce(properties.band, '') != ''
    GROUP BY id ORDER BY n DESC, id`,
  },
  gear_seen: {
    title: 'Gear owned at run end (tracked since app 2.2)',
    sql: `
    SELECT arrayJoin(splitByChar(',', coalesce(properties.gear, ''))) AS id, count() AS n
    FROM events WHERE event = 'run_end' AND coalesce(properties.gear, '') != ''
    GROUP BY id ORDER BY n DESC, id`,
  },
  hustle_seen: {
    title: 'Hustles held at run end (tracked since app 2.2)',
    sql: `
    SELECT arrayJoin(splitByChar(',', coalesce(properties.hustles, ''))) AS id, count() AS n
    FROM events WHERE event = 'run_end' AND coalesce(properties.hustles, '') != ''
    GROUP BY id ORDER BY n DESC, id`,
  },
};

const out = {};
for (const [name, { sql }] of Object.entries(QUERIES)) {
  try {
    // The query API silently truncates at 100 rows unless the HogQL has
    // an explicit LIMIT — coverage diffs need the full result.
    const limited = /\bLIMIT\s+\d+/i.test(sql) ? sql : sql + '\n    LIMIT 10000';
    const r = await api(`/api/projects/${projectId}/query/`, {
      query: { kind: 'HogQLQuery', query: limited },
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

// ---- telemetry/coverage.md — content the players never/rarely reach ----
// Diffs the game's content catalogs (js/data/*, js/minigames.js) against
// the coverage-feed queries above. This is what the queries can't say on
// their own: PostHog only knows what happened, the repo knows what exists.
async function buildCoverage() {
  const imp = (p) => import(new URL('../' + p, import.meta.url));
  const [ev, meta, contracts, genres, instruments, venues, rivals, band, accessories, hustles] =
    await Promise.all([
      imp('js/data/events.js'), imp('js/data/meta.js'), imp('js/data/contracts.js'),
      imp('js/data/genres.js'), imp('js/data/instruments.js'), imp('js/data/venues.js'),
      imp('js/data/rivals.js'), imp('js/data/band.js'), imp('js/data/accessories.js'),
      imp('js/data/hustles.js'),
    ]);
  const mgSrc = fs.readFileSync(new URL('../js/minigames.js', import.meta.url), 'utf8');
  const minigameIds = [...mgSrc.matchAll(/register\('([\w-]+)'/g)].map((m) => m[1]);

  const cardNote = (e) => ['act ' + e.act, e.requires && 'gated', e.chainOnly && 'chain-only',
    e.finaleCard && 'finale', e.pack && 'pack:' + e.pack].filter(Boolean).join(' · ');
  const ids = (arr, note) => arr.map((x) => ({ id: x.id, note: note ? note(x) : '' }));

  // seen-count extractor: default is [id, count] from a query's first two
  // columns; finale endings key on path/outcome instead.
  const seenMap = (queryName, keyFn) => {
    const rows = out[queryName]?.results;
    const map = new Map();
    for (const r of rows || []) {
      const [k, n] = keyFn ? keyFn(r) : [r[0], r[1]];
      if (k !== null && k !== '') map.set(String(k), (map.get(String(k)) || 0) + Number(n));
    }
    return { map, failed: !rows };
  };

  const SINCE = 'tracked since app 2.2 — "never" means "not since tracking began"';
  const CATALOGS = [
    { title: 'Cards', unit: 'swipes', rareBelow: 5, from: 'card_seen',
      items: ids(ev.EVENTS, cardNote) },
    { title: 'Minigames', unit: 'plays', rareBelow: 3, from: 'minigame_stats',
      items: minigameIds.map((id) => ({ id, note: '' })) },
    { title: 'Finale endings (path × outcome)', unit: 'runs', rareBelow: 2, from: 'finale_endings',
      keyFn: (r) => [r[0] + '/' + r[1], r[2]],
      items: ['megastar', 'studio', 'hitfactory'].flatMap((p) =>
        ['success', 'partial', 'failure'].map((o) => ({ id: p + '/' + o, note: '' }))) },
    { title: 'Game-over endings', unit: 'deaths', rareBelow: 2, from: 'death_causes',
      items: Object.keys(meta.ENDINGS).filter((k) => meta.ENDINGS[k].title)
        .map((id) => ({ id, note: '' })) },
    { title: 'Exit interviews', unit: 'picks', rareBelow: 2, from: 'exit_seen', since: SINCE,
      items: Object.entries(meta.EXIT_INTERVIEWS).flatMap(([k, v]) =>
        ['left', 'right'].map((s) => ({ id: v[s].exit, note: k + ' / ' + s }))) },
    { title: 'Trophies', unit: 'earns', rareBelow: 2, from: 'trophy_seen', since: SINCE,
      items: ids(meta.TROPHIES) },
    { title: 'Contracts', unit: 'runs', rareBelow: 3, from: 'by_contract',
      items: ids(contracts.CONTRACTS) },
    { title: 'Instruments', unit: 'runs', rareBelow: 3, from: 'by_instrument',
      items: ids(instruments.INSTRUMENTS) },
    { title: 'Genres', unit: 'runs', rareBelow: 3, from: 'by_genre',
      items: [...ids(genres.GENRES), ...ids(genres.GENRES_WAVE2, () => 'wave 2')] },
    { title: 'Home venues', unit: 'runs', rareBelow: 3, from: 'by_venue',
      items: ids(venues.VENUES) },
    { title: 'Rivals', unit: 'runs', rareBelow: 2, from: 'rival_seen', since: SINCE,
      items: ids(rivals.RIVALS) },
    { title: 'Bandmates', unit: 'runs', rareBelow: 2, from: 'band_seen', since: SINCE,
      items: [...ids(band.BANDMATES), ...ids(band.BANDMATES_WAVE2, () => 'wave 2')] },
    { title: 'Gear', unit: 'runs', rareBelow: 2, from: 'gear_seen', since: SINCE,
      items: ids(accessories.ACCESSORIES) },
    { title: 'Hustles', unit: 'runs', rareBelow: 2, from: 'hustle_seen', since: SINCE,
      items: ids(hustles.HUSTLES) },
  ];

  const coverage = {};
  let cmd = '# BIG BREAK — content coverage\n\n';
  cmd += 'Which content players actually reach, diffed against everything the\n';
  cmd += 'game ships. Auto-generated by `tools/posthog-pull.mjs`; the observed\n';
  cmd += 'side comes from `telemetry/latest.json`, the catalog side from\n';
  cmd += '`js/data/*` and `js/minigames.js`. "Never" sections are the cut/fix\n';
  cmd += 'candidates — or the content that needs better signposting.\n\n';
  if (range) cmd += `**Data through:** ${range[1]} · ${range[2]} events · ${range[3]} players\n\n`;

  const summaryRows = [];
  let body = '';
  for (const c of CATALOGS) {
    const { map, failed } = seenMap(c.from, c.keyFn);
    // dedupe: an id can appear in two waves of the same catalog
    const uniq = [...new Map(c.items.map((it) => [it.id, it])).values()];
    const rows = uniq.map((it) => ({ ...it, n: map.get(it.id) || 0 }));
    const never = rows.filter((r) => r.n === 0);
    const rare = rows.filter((r) => r.n > 0 && r.n < c.rareBelow)
      .sort((a, b) => a.n - b.n || (a.id < b.id ? -1 : 1));
    coverage[c.title] = {
      total: rows.length, seen: rows.length - never.length,
      never: never.map((r) => r.id), rare: rare.map((r) => ({ id: r.id, n: r.n })),
    };
    summaryRows.push(`| ${c.title} | ${rows.length - never.length}/${rows.length} | ${never.length} | ${rare.length} |`);

    body += `## ${c.title} — ${rows.length - never.length}/${rows.length} seen\n\n`;
    if (c.since) body += `_${c.since}._\n\n`;
    if (failed) body += `⚠️ feed query \`${c.from}\` failed — treating everything as unseen.\n\n`;
    if (never.length) {
      body += `### Never reached (${never.length})\n\n| id | notes |\n|---|---|\n`;
      body += never.map((r) => `| ${r.id} | ${r.note} |`).join('\n') + '\n\n';
    }
    if (rare.length) {
      body += `### Rarely reached (< ${c.rareBelow} ${c.unit})\n\n| id | ${c.unit} | notes |\n|---|---|---|\n`;
      body += rare.map((r) => `| ${r.id} | ${r.n} | ${r.note} |`).join('\n') + '\n\n';
    }
    if (!never.length && !rare.length) body += 'Full coverage. 🎉\n\n';
  }

  cmd += '| catalog | seen | never | rare |\n|---|---|---|---|\n';
  cmd += summaryRows.join('\n') + '\n\n' + body;
  fs.writeFileSync(path.join(OUT_DIR, 'coverage.md'), cmd);
  return coverage;
}

try {
  out.coverage = await buildCoverage();
  console.log('# coverage: written');
} catch (e) {
  console.log(`# coverage: ERROR ${e.message}`);
}
// rewrite latest.json now that it also carries the coverage block
fs.writeFileSync(path.join(OUT_DIR, 'latest.json'), JSON.stringify(out, null, 2) + '\n');

console.log('===POSTHOG_RESULTS_BEGIN===');
console.log(JSON.stringify(out));
console.log('===POSTHOG_RESULTS_END===');
