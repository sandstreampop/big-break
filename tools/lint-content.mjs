// Content linter: audits the event corpus and the reactive-text generators
// (DMs, headlines, epilogue) for template mistakes, style drift, and
// unreachable gating. Run: node tools/lint-content.mjs
//
// Checks:
//   events — unknown {tokens}, unknown requires keys, straight apostrophes,
//            double spaces, weight-0 events that nothing can reach
//   reactive text — a maximal run state exercises every generator branch;
//            any unfilled {token} or "undefined" leaking into copy fails

import { EVENTS } from '../js/data/events.js';
import * as engine from '../js/engine.js';
import { generateDMs } from '../js/dms.js';
import { generateHeadlines } from '../js/headlines.js';
import { buildEpilogue } from '../js/epilogue.js';

const KNOWN_TOKENS = new Set(['song', 'hitSong', 'fadedSong', 'venue', 'rival', 'rivalVibe', 'genre', 'collabArtist']);
const KNOWN_REQ = new Set(['flagsAll', 'flagsNone', 'moneyMax', 'moneyMin', 'burnoutMin', 'fameMin', 'fameMax',
  'gear', 'rivalryMin', 'rivalryMax', 'genreAny', 'venueAny', 'venueNone', 'venueLevelMin', 'venueIs', 'rivalIs',
  'hustleMin', 'bandMin', 'bandMax', 'bandHas', 'demoMin', 'chartingMin', 'songsMin', 'fadedMin', 'nemesis', 'stats',
  'anyOf']);

function checkRequires(evId, r) {
  for (const k of Object.keys(r || {})) {
    if (!KNOWN_REQ.has(k)) issues.push(`${evId}: unknown requires key ${k}`);
    if (k === 'anyOf') for (const alt of r.anyOf) checkRequires(evId, alt);
  }
}

const issues = [];

for (const ev of EVENTS) {
  const texts = [ev.prompt, ev.promptNemesis, ev.context];
  for (const side of ['left', 'right']) {
    const c = ev.choices?.[side];
    if (!c) continue;
    texts.push(c.label);
    for (const t of ['bad', 'good', 'incredible']) texts.push(c.outcomes?.[t]?.text);
  }
  for (const t of texts) {
    if (!t) continue;
    for (const m of t.matchAll(/\{(\w+)\}/g)) {
      if (!KNOWN_TOKENS.has(m[1])) issues.push(`${ev.id}: unknown token {${m[1]}}`);
    }
    if (/\w'\w/.test(t)) issues.push(`${ev.id}: straight apostrophe: ${t.slice(0, 50)}`);
    if (t.includes('  ')) issues.push(`${ev.id}: double space: ${t.slice(0, 50)}`);
  }
  checkRequires(ev.id, ev.requires);
  if (ev.weight === 0 && !ev.chainOnly && !ev.finaleCard && !ev.shop) {
    issues.push(`${ev.id}: weight 0 but not chainOnly`);
  }
}

// maximal state: light up every reactive-text branch at once
const st = engine.newRun('kazoo', [], Math.random, ['notebook']);
st.act = 3; st.path = 'hitfactory'; st.fame = 95; st.money = 900; st.rivalry = 8;
st.contract = 'deadline'; st.genre = 'gothgrass'; st.venue = 'planetarium'; st.venueLevel = 3;
st.nemesis = true; st.brammy = 'won'; st.stats.burnout = 65;
st.hustles = ['sync_royalties', 'shed_rental', 'wedding_circuit', 'compost_corner'];
st.band = ['nadia', 'fish', 'ludo'];
st.flags.push('superfan', 'fan_family', 'room_saved', 'album_out', 'dedication_private',
  'chart_passed_rival', 'someone', 'home_studio', 'song_finished', 'mg_golden', 'constellation');
engine.addSong(st, { title: 'Maximal Hit', quality: 92, status: 'charting', hype: 90 });
engine.addSong(st, { title: 'Faded One', quality: 50, status: 'charting', hype: 10 });
st.songs[1].status = 'faded'; st.songs[1].peak = 7; st.songs[1].weeks = 1;
engine.addSong(st, { title: 'Vault Best', quality: 75, status: 'demo' });

const reactive = [
  ...generateDMs(st, 99).map((d) => d.text),
  ...generateHeadlines(st, 99).map((h) => h.text),
  buildEpilogue(st),
];
for (const x of reactive) {
  if (/\{\w+\}/.test(x)) issues.push(`reactive: unfilled token: ${x.slice(0, 60)}`);
  if (/\bundefined\b|\bnull\b/.test(x)) issues.push(`reactive: undefined leak: ${x.slice(0, 60)}`);
}

if (issues.length) {
  console.error(issues.join('\n'));
  console.error(`\n${issues.length} issue(s) across ${EVENTS.length} events`);
  process.exit(1);
}
console.log(`LINT CLEAN — ${EVENTS.length} events, ${reactive.length} reactive strings`);
