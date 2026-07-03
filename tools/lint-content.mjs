// Content linter: audits EVERY registered pack's event corpus (Phase A.3 —
// closing the "mystery deck is unlinted" hole) plus the music pack's reactive-
// text generators (DMs, headlines, epilogue) for template mistakes, style
// drift, and unreachable gating. Run: node tools/lint-content.mjs
//
// Structural checks run over every pack, reading the pack itself (events, arcs)
// so a new genre is linted for free. The genre-specific inputs a check needs —
// the known {token} vocabulary, the weather catalog, the reactive-text
// exerciser — come from a per-pack DESCRIPTOR the tool owns (the flavor layer
// isn't pack-injectable yet; that's the Presenter phase). A pack with no
// descriptor gets the structural checks only.
//
// Checks (per pack):
//   events — unknown {tokens}, unknown requires keys, straight apostrophes,
//            double spaces, weight-0 events nothing can reach, arc refs,
//            weather refs, dark-gated deck share, required-flag reachability
//   reactive text (music) — a maximal run state exercises every generator
//            branch; any unfilled {token} or "undefined" leaking into copy fails

import * as engine from '../dist/js/engine.js';
import { addSong } from '../dist/js/songs.js';
import { PACKS } from '../dist/js/packs/registry.js';
import { musicPack } from '../dist/js/packs/music.js';
import { generateDMs } from '../dist/js/dms.js';
import { generateHeadlines } from '../dist/js/headlines.js';
import { buildEpilogue } from '../dist/js/epilogue.js';
import { WEATHER } from '../dist/js/data/weather.js';

// Requires keys are the engine's generic deck-eligibility vocabulary (the
// Requires type), shared by every pack.
const KNOWN_REQ = new Set(['flagsAll', 'flagsNone', 'moneyMax', 'moneyMin', 'burnoutMin', 'fameMin', 'fameMax',
  'gear', 'rivalryMin', 'rivalryMax', 'genreAny', 'venueAny', 'venueNone', 'venueLevelMin', 'venueIs', 'rivalIs',
  'hustleMin', 'bandMin', 'bandMax', 'bandHas', 'demoMin', 'chartingMin', 'songsMin', 'fadedMin', 'nemesis', 'stats',
  'anyOf', 'weatherIs']);

// Engine/UI-set flags every pack can rely on existing (fail states, minigame
// echoes, comeback). Pack-specific flags are discovered from the deck's addFlag.
const ENGINE_FLAGS = ['comeback', 'chart_passed_rival', 'mg_golden', 'mg_botched', 'mg_steady',
  'has_loop_pedal', 'demo_in_pocket', 'notebook_demo', 'debt', 'song_finished'];

// Per-pack genre-specific lint inputs. Structural checks read the pack; these
// supply the parts that aren't yet on the pack contract.
const DESCRIPTORS = {
  music: {
    tokens: ['song', 'hitSong', 'fadedSong', 'venue', 'rival', 'rivalVibe', 'genre', 'collabArtist'],
    weatherIds: WEATHER.map((w) => w.id),
    // The maximal-state reactive-text exerciser: one run state that lights up
    // every generator branch at once, so an unfilled token or undefined leak
    // in DMs/headlines/epilogue fails the lint.
    reactive() {
      const st = engine.newRun(musicPack, 'kazoo', [], Math.random, ['notebook']);
      st.act = 3; st.path = 'hitfactory'; st.fame = 95; st.money = 900; st.rivalry = 8;
      st.contract = 'deadline'; st.genre = 'gothgrass'; st.venue = 'planetarium'; st.venueLevel = 3;
      st.nemesis = true; st.brammy = 'won'; st.stats.burnout = 65;
      st.hustles = ['sync_royalties', 'shed_rental', 'wedding_circuit', 'compost_corner'];
      st.band = ['nadia', 'fish', 'ludo'];
      st.flags.push('superfan', 'fan_family', 'room_saved', 'album_out', 'dedication_private',
        'chart_passed_rival', 'someone', 'home_studio', 'song_finished', 'mg_golden', 'constellation');
      addSong(st, { title: 'Maximal Hit', quality: 92, status: 'charting', hype: 90 });
      addSong(st, { title: 'Faded One', quality: 50, status: 'charting', hype: 10 });
      st.songs[1].status = 'faded'; st.songs[1].peak = 7; st.songs[1].weeks = 1;
      addSong(st, { title: 'Vault Best', quality: 75, status: 'demo' });
      return [
        ...generateDMs(st, 99).map((d) => d.text),
        ...generateHeadlines(st, 99).map((h) => h.text),
        buildEpilogue(st),
      ];
    },
  },
  mystery: { tokens: [], weatherIds: [] },
  probe: { tokens: [], weatherIds: [] },
};

const issues = [];
let totalEvents = 0;
let totalReactive = 0;

for (const pack of PACKS) {
  const desc = DESCRIPTORS[pack.id] || { tokens: [], weatherIds: [] };
  const EVENTS = pack.events;
  const ARCS = pack.arcs || [];
  const knownTokens = new Set(desc.tokens);
  const weatherIds = new Set(desc.weatherIds);
  const tag = (msg) => issues.push(`[${pack.id}] ${msg}`);
  totalEvents += EVENTS.length;

  const checkRequires = (evId, r) => {
    for (const k of Object.keys(r || {})) {
      if (!KNOWN_REQ.has(k)) tag(`${evId}: unknown requires key ${k}`);
      if (k === 'anyOf') for (const alt of r.anyOf) checkRequires(evId, alt);
    }
  };

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
        if (!knownTokens.has(m[1])) tag(`${ev.id}: unknown token {${m[1]}}`);
      }
      if (/\w'\w/.test(t)) tag(`${ev.id}: straight apostrophe: ${t.slice(0, 50)}`);
      if (t.includes('  ')) tag(`${ev.id}: double space: ${t.slice(0, 50)}`);
    }
    checkRequires(ev.id, ev.requires);
    if (ev.weight === 0 && !ev.chainOnly && !ev.finaleCard && !ev.shop) {
      tag(`${ev.id}: weight 0 but not chainOnly`);
    }
  }

  // ── M3 authoring rules (Reach & Rush §3) ──

  // 1. Every flag a card requires must be set somewhere (or by the engine/UI)
  {
    const setFlags = new Set(ENGINE_FLAGS);
    const addFrom = (effects) => { if (effects?.addFlag) setFlags.add(effects.addFlag); };
    for (const ev of EVENTS) {
      for (const side of ['left', 'right']) {
        const c = ev.choices?.[side];
        if (!c) continue;
        for (const t of ['bad', 'good', 'incredible']) addFrom(c.outcomes?.[t]?.effects);
      }
    }
    const requiredFlags = (r) => !r ? [] : [
      ...(r.flagsAll || []), ...(r.flagsNone || []),
      ...(r.anyOf || []).flatMap(requiredFlags),
    ];
    for (const ev of EVENTS) {
      for (const f of requiredFlags(ev.requires)) {
        if (!setFlags.has(f)) tag(`${ev.id}: requires flag '${f}' that nothing sets`);
      }
    }
  }

  // 2. Dark-gated share of any act's deck ≤45%. "Dark" = gated by requires with
  //    no scheduler rooting for it (arc/pack/chain/finale/flash have their own
  //    delivery). Everything else must stay majority-open.
  {
    const arcIds = new Set(ARCS.flatMap((a) => [...a.setup, ...a.payoffs]));
    for (const act of [1, 2, 3]) {
      const inAct = EVENTS.filter((e) =>
        !e.chainOnly && !e.finaleCard && !e.flashpoint && !e.pack &&
        (Array.isArray(e.act) ? e.act.includes(act) : e.act === act));
      if (!inAct.length) continue;
      const dark = inAct.filter((e) => e.requires && !arcIds.has(e.id));
      const share = dark.length / inAct.length;
      if (share > 0.45) tag(`act ${act}: dark-gated share ${(100 * share).toFixed(0)}% > 45% (${dark.length}/${inAct.length}) — register arcs or open the gates`);
    }
  }

  // 3. The Story Seeds registry must point at real cards
  {
    const ids = new Set(EVENTS.map((e) => e.id));
    for (const arc of ARCS) {
      for (const id of [...arc.setup, ...arc.payoffs]) {
        if (!ids.has(id)) tag(`arc ${arc.id}: references unknown card '${id}'`);
      }
    }
  }

  // 4. weatherIs gates must reference real weather; flashpoints must be drawable
  {
    const weatherRefs = (r) => !r ? [] : [r.weatherIs, ...(r.anyOf || []).flatMap(weatherRefs)].filter(Boolean);
    for (const ev of EVENTS) {
      for (const w of weatherRefs(ev.requires)) {
        if (!weatherIds.has(w)) tag(`${ev.id}: unknown weather '${w}'`);
      }
      if (ev.flashpoint && !(ev.weight > 0)) tag(`${ev.id}: flashpoint needs weight > 0`);
    }
  }

  // 5. Reactive-text generators (only packs that declare an exerciser today)
  if (desc.reactive) {
    const reactive = desc.reactive();
    totalReactive += reactive.length;
    for (const x of reactive) {
      if (/\{\w+\}/.test(x)) tag(`reactive: unfilled token: ${x.slice(0, 60)}`);
      if (/\bundefined\b|\bnull\b/.test(x)) tag(`reactive: undefined leak: ${x.slice(0, 60)}`);
    }
  }
}

if (issues.length) {
  console.error(issues.join('\n'));
  console.error(`\n${issues.length} issue(s) across ${PACKS.length} packs, ${totalEvents} events`);
  process.exit(1);
}
console.log(`LINT CLEAN — ${PACKS.length} packs, ${totalEvents} events, ${totalReactive} reactive strings`);
