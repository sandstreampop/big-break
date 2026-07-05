// Content linter: audits EVERY registered pack's event corpus (Phase A.3 — so
// no pack's deck ships unlinted) plus the music pack's reactive-text generators
// (DMs, headlines, epilogue) for template mistakes, style drift, and
// unreachable gating. Run: node tools/lint-content.mjs
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
//   taste  — no hype punctuation (house rule, every pack: ≤1 '!', no '!!'/'!?');
//            plus, for a pack with a taste block, its cliché blocklist and
//            outcome-length cap. The checker is genre-neutral (taste-core.mjs);
//            the data is the game's own (docs/games/<game>/taste.mjs, mirroring
//            that game's VOICE.md)
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
import { ARCS as MUSIC_ARCS } from '../dist/js/data/arcs.js';
import { bangIssue, tasteIssues, hasDialogue } from './taste-core.mjs';
// Each pack's taste DATA lives with the game; the checker above is genre-neutral.
import { LOVE_ISLAND_TASTE } from '../docs/games/love-island/taste.mjs';

// The engine's NEUTRAL deck-eligibility vocabulary (the core Requires type);
// each pack adds the predicate keys its own plugins register (Plugin.requires),
// mirroring how requiresOk actually dispatches. 'gear' is a legacy music key.
const NEUTRAL_REQ = ['anyOf', 'flagsAll', 'flagsNone', 'burnoutMin', 'stats', 'min', 'max', 'gear'];
const knownReqFor = (pack) => new Set([
  ...NEUTRAL_REQ,
  ...(pack.plugins || []).flatMap((p) => Object.keys(p.requires || {})),
]);

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
    // Story-arc data now lives in the music seeds plugin's data module, not on
    // the Pack (WP7), so the linter reads it from the descriptor.
    arcs: MUSIC_ARCS,
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
  probe: { tokens: [], weatherIds: [] },
  // Love Island: the taste block (cliché blocklist + outcome-length cap) is the
  // game's own data (docs/games/love-island/taste.mjs, mirroring VOICE.md).
  // Tokens are the pack's presenter-filled identities. The "arc" here is the
  // producers plugin's scheduled-beat delivery (Bombshells, Movie Night, the
  // girls' Recoupling, Meet the Parents): those cards are requires-gated
  // VARIANTS with their own forced delivery window, exactly the class the
  // dark-gated exemption exists for.
  'love-island': {
    tokens: ['partner', 'rival', 'ex', 'mate', 'bombshell'],
    weatherIds: [],
    taste: LOVE_ISLAND_TASTE,
    // Flags set by the pack's PLUGINS (not by a card's addFlag), so the
    // required-flag reachability check knows they exist.
    pluginFlags: ['li_revealed', 'li_partner_revealed', 'li_betrayed', 'li_sympathy',
      'li_stranded', 'li_came_clean', 'li_dumped_single', 'li_rival_active',
      'li_fed_the_rival', 'li_secret_detonated',
      'li_comeback'], // set by the redemption-season transform (pack.ts liComeback)
    arcs: [{
      id: 'li_scheduled_beats',
      setup: ['li_bomb1', 'li_bomb2', 'li_bomb2_steal', 'li_bomb2_single',
        'li_movienight_reveal', 'li_movienight_clean',
        'li_recoup1_choose', 'li_recoup1_choose_single',
        'li_recoup1_exposed', 'li_recoup1_exposed_single',
        'li_parents', 'li_parents_messy',
        'li_enc_rival_1',
        'li_enc_partner_1_sweet', 'li_enc_partner_1_game', 'li_enc_partner_1_slow',
        'li_enc_rmove_poach', 'li_enc_rmove_rumour',
        'li_enc_p3_high', 'li_enc_p3_low', 'li_second_wave'],
      payoffs: [],
    }],
  },
};

const issues = [];
let totalEvents = 0;
let totalReactive = 0;

for (const pack of PACKS) {
  const desc = DESCRIPTORS[pack.id] || { tokens: [], weatherIds: [] };
  // Tutorial decks are player-facing copy too — same floor, no exceptions.
  const EVENTS = [...pack.events, ...(pack.tutorialEvents || [])];
  const ARCS = desc.arcs || [];
  const knownTokens = new Set(desc.tokens);
  const weatherIds = new Set(desc.weatherIds);
  const tag = (msg) => issues.push(`[${pack.id}] ${msg}`);
  totalEvents += EVENTS.length;

  const KNOWN_REQ = knownReqFor(pack);
  const checkRequires = (evId, r) => {
    for (const k of Object.keys(r || {})) {
      if (!KNOWN_REQ.has(k)) tag(`${evId}: unknown requires key ${k}`);
      if (k === 'anyOf') for (const alt of r.anyOf) checkRequires(evId, alt);
    }
  };

  for (const ev of EVENTS) {
    // Outcome texts get the length cap too; keep them tagged so the taste floor
    // can tell an outcome from a scene-setting prompt.
    const outcomeTexts = new Set();
    const texts = [ev.prompt, ev.promptNemesis, ev.context];
    for (const side of ['left', 'right']) {
      const c = ev.choices?.[side];
      if (!c) continue;
      texts.push(c.label);
      for (const t of ['bad', 'good', 'incredible']) {
        const txt = c.outcomes?.[t]?.text;
        texts.push(txt);
        if (txt) outcomeTexts.add(txt);
      }
    }
    for (const t of texts) {
      if (!t) continue;
      for (const m of t.matchAll(/\{(\w+)\}/g)) {
        if (!knownTokens.has(m[1])) tag(`${ev.id}: unknown token {${m[1]}}`);
      }
      if (/\w'\w/.test(t)) tag(`${ev.id}: straight apostrophe: ${t.slice(0, 50)}`);
      if (t.includes('  ')) tag(`${ev.id}: double space: ${t.slice(0, 50)}`);
      // Taste floor: no-hype-punctuation is a house rule (every pack, via
      // bangIssue); a pack with a taste block also gets its cliché blocklist +
      // outcome-length cap. tasteIssues bundles the bang check, so packs with a
      // taste block go through it and everyone else gets the standalone bang.
      if (desc.taste) {
        for (const iss of tasteIssues(t, desc.taste, { outcome: outcomeTexts.has(t) })) {
          tag(`${ev.id}: ${iss}`);
        }
      } else {
        const bang = bangIssue(t);
        if (bang) tag(`${ev.id}: ${bang}`);
      }
    }
    checkRequires(ev.id, ev.requires);
    if (ev.weight === 0 && !ev.chainOnly && !ev.finaleCard && !ev.shop) {
      tag(`${ev.id}: weight 0 but not chainOnly`);
    }
  }

  // ── Dialogue-first floor (a pack's taste.dialogue) ──
  // Per-card: tags in requireTags are conversations with a person — their
  // prompt must contain speech. Corpus-wide: minimum shares of prompts and
  // outcomes that speak, a ratchet against register drift back to
  // wall-to-wall narrator (see the pack's VOICE.md v2 addendum).
  if (desc.taste?.dialogue) {
    const d = desc.taste.dialogue;
    let prompts = 0, promptsSpeak = 0, outs = 0, outsSpeak = 0;
    for (const ev of EVENTS) {
      prompts++;
      const speaks = hasDialogue(ev.prompt);
      if (speaks) promptsSpeak++;
      if ((d.requireTags || []).some((t) => (ev.tags || []).includes(t)) && !speaks) {
        tag(`${ev.id}: '${(d.requireTags || []).join('/')}' card whose prompt never speaks — encounters are conversations`);
      }
      for (const side of ['left', 'right']) {
        const c = ev.choices?.[side];
        if (!c) continue;
        for (const t of ['bad', 'good', 'incredible']) {
          const txt = c.outcomes?.[t]?.text;
          if (!txt) continue;
          outs++;
          if (hasDialogue(txt)) outsSpeak++;
        }
      }
    }
    if (d.promptMinShare && prompts && promptsSpeak / prompts < d.promptMinShare) {
      tag(`dialogue floor: only ${(100 * promptsSpeak / prompts).toFixed(0)}% of prompts speak (< ${100 * d.promptMinShare}%)`);
    }
    if (d.outcomeMinShare && outs && outsSpeak / outs < d.outcomeMinShare) {
      tag(`dialogue floor: only ${(100 * outsSpeak / outs).toFixed(0)}% of outcomes speak (< ${100 * d.outcomeMinShare}%)`);
    }
  }

  // ── M3 authoring rules (Reach & Rush §3) ──

  // 1. Every flag a card requires must be set somewhere (or by the engine/UI,
  //    or by one of the pack's own plugins — descriptor.pluginFlags)
  {
    const setFlags = new Set([...ENGINE_FLAGS, ...(desc.pluginFlags || [])]);
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
    // One check per segment the pack's manifest declares (ADR-0010) — the
    // linter assumes no act count.
    for (const act of pack.manifest.segments.map((_, i) => i + 1)) {
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
