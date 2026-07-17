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
import { addSong } from '../dist/js/packs/music/songs.js';
import { PACKS } from '../dist/js/packs/registry.js';
import { musicPack } from '../dist/js/packs/music/pack.js';
import { generateDMs } from '../dist/js/packs/music/dms.js';
import { generateHeadlines } from '../dist/js/packs/music/headlines.js';
import { buildEpilogue } from '../dist/js/packs/music/epilogue.js';
import { WEATHER } from '../dist/js/packs/music/data/weather.js';
import { ARCS as MUSIC_ARCS } from '../dist/js/packs/music/data/arcs.js';
import { bangIssue, tasteIssues, hasDialogue, quotedSpans, argotPresenceIssues, tellIssues, feedIssues } from './taste-core.mjs';
// Each pack's taste DATA lives with the game; the checker above is genre-neutral.
import { LOVE_ISLAND_TASTE } from '../docs/games/love-island/taste.mjs';
import { MUSIC_TASTE } from '../docs/games/music/taste.mjs';
import { ODYSSEY_TASTE } from '../docs/games/odyssey/taste.mjs';
// The second screen's content (ADR-0014) isn't in pack.events, so import its
// flat corpus so the feed floor can lint it (bodies + Narrator chrome).
import { feedBodyCorpus, feedChromeCorpus } from '../dist/js/packs/love-island/feeds.js';
// The odyssey bard's frame chatter — a flat pool of presenter-voice lines held
// to the same taste floor as the rest of the presenter copy.
import { CHATTER as ODYSSEY_CHATTER } from '../dist/js/packs/odyssey/bard-chatter.js';
import { feedBodyCorpus as odysseyFeedBodies, feedChromeCorpus as odysseyFeedChrome } from '../dist/js/packs/odyssey/feeds.js';
// The crew pool (names in the sand) — every name/detail passes the floor.
import { CREW as ODYSSEY_CREW } from '../dist/js/packs/odyssey/crew.js';

// The engine's NEUTRAL deck-eligibility vocabulary, imported from the engine's
// own exported set (single source — a drift here was a silent lint hole); each
// pack adds the predicate keys its own plugins register (Plugin.requires),
// mirroring how requiresOk actually dispatches. 'gear' is a legacy music key.
const NEUTRAL_REQ = [...engine.REQUIRES_NEUTRAL_KEYS, 'gear'];
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
    // Music's taste floor (cliché blocklist + outcome-length cap) — the game's
    // own data (docs/games/music/taste.mjs, mirroring its VOICE.md).
    taste: MUSIC_TASTE,
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
  // The Odyssey: taste is the game's own data (docs/games/odyssey/taste.mjs,
  // mirroring its VOICE.md — cliché + tells blocklists, maxBang: 2, outcome
  // cap 420). Wired ahead of the pack per the working agreement: no content
  // before the taste gate exists; the floor activates the moment the pack
  // registers.
  odyssey: {
    tokens: [], weatherIds: [], taste: ODYSSEY_TASTE,
    // ADR-0014 (pass 15): the second screen's copy, linted via the feed
    // floor — bodies as quoted mouths, chrome as narration.
    feedBodies: odysseyFeedBodies, feedChrome: odysseyFeedChrome,
    // The itinerary's requires-gated landmark variants (delivered by force —
    // the odyssey_itinerary beat windows), same delivery-owned class as LI's
    // scheduled beats.
    arcs: [{ id: 'ody_itinerary', setup: ['ody_cyclops_strong'], payoffs: [] }],
    // The bard's frame prose lives on the presenter; hold it to the same
    // floor as the deck. State-dependent hooks are exercised across their
    // flag variants so every authored branch is scanned.
    presenterCopy(pack) {
      // The frieze inspect strings below resolve act lengths through the
      // engine's module-level actLength (twist-aware), which dispatches to
      // the ACTIVE pack instance — activate this one first.
      engine.useContentPack(pack);
      const pres = pack.presenter || {};
      const out = [pres.aboutLine];
      out.push(pres.title?.logo, ...(pres.title?.taglines || []));
      out.push(pres.actWord, ...(pres.actNames || []));
      out.push(pres.encore?.ready, pres.encore?.armed);
      for (const a of Object.values(pres.actIntro || {})) out.push(a.name, a.text);
      out.push(pres.crossroads?.head, pres.crossroads?.sub);
      out.push(pres.loadoutPicker?.head, pres.loadoutPicker?.sub);
      // Endings — the static table, plus the run-varied finale copy: the Oar
      // Road success variant is derived purely by presentFinale from a mock
      // judged run, so its verses are scanned at the same floor.
      for (const e of Object.values(pres.endings || {})) {
        if (e.title) out.push(e.title, e.text);
        else for (const v of Object.values(e)) out.push(v.title, v.text);
      }
      const oar = pres.presentFinale?.({
        run: { ending: { result: 'success' }, flags: ['ody_oar_road'], poseidon: 0 },
        ending: 'nostos', result: 'success', meta: {},
      });
      out.push(oar?.title, oar?.text);
      out.push(...Object.values(pres.failLabels || {}));
      for (const m of [undefined, { odyssey: { fragments: ['bow'] } }, { odyssey: { oarRoad: true } }]) {
        out.push(pres.title?.foot?.(m));
      }
      for (const l of pack.loadouts) out.push(l.name, l.flavor, l.quirk?.name, l.quirk?.desc);
      for (const pth of Object.values(pack.manifest.paths)) out.push(pth.name, pth.blurb, pth.gateLabel);
      const flagStates = [[], ['ody_named', 'ody_fore_bow'], ['ody_nobody', 'ody_fore_sea']];
      for (const flags of flagStates) {
        const mock = { flags, stats: { might: 50, guile: 50, lore: 50 }, athena: 2, path: 'nostos' };
        const fs = pres.finalSet?.(mock);
        if (fs) {
          out.push(fs.head, fs.sub);
          for (const o of fs.options) out.push(o.title, o.blurb, o.label);
        }
        for (const c of pres.carriedChips?.(mock) || []) {
          out.push(c.html, c.sheet?.title, ...(c.sheet?.lines || []));
        }
      }
      for (const ev of pack.events.filter((e) => (e.tags || []).includes('landmark') || (e.tags || []).includes('temptation'))) {
        const sp = pres.setPiece?.({ flags: [] }, ev);
        if (sp) out.push(sp.banner, sp.sub);
      }
      // The result-side lexicon notices (the fragment's gold fret) and the
      // names in the sand (a two-man loss composes the longest line).
      const lossState = { loadout: 'kings_hall', flavorSeed: 7, expedition: 10, stats: {}, flags: [] };
      for (const mock of [
        { event: { id: 'ody_tiresias' }, deltas: [] },
        { event: { id: 'ody_tiresias_oar' }, deltas: [] },
        { event: { id: 'ody_a1_squall' }, deltas: [{ key: 'expedition', amount: -2 }] },
      ]) {
        for (const n of pres.resultExtras?.(mock, lossState)?.notices || []) out.push(n.html);
      }
      // Every crew name/detail (the pool the loss lines draw from).
      for (const m of ODYSSEY_CREW) out.push(`${m.name}, ${m.detail}`);
      // The frame chatter (bard-chatter.ts): every dialogue block. The shell
      // prints each block wrapped in curly quotes — spoken mouths, exempt
      // from the cliché blocklist per VOICE law 8 — so scan them AS the
      // screen shows them; the `who` attributions are chrome (narration
      // voice) and scan bare.
      for (const c of ODYSSEY_CHATTER) {
        for (const b of c.blocks) { out.push(`“${b.text}”`); out.push(b.who); }
      }
      // The frieze inspect panel (tableau one-tap truth): narration-voice UI
      // copy across the states that vary its lines — this is the surface the
      // 'wine-dark' lapse shipped on unscanned.
      for (const mock of [
        { act: 1, cardsPlayedInAct: 2, stats: { burnout: 10 }, expedition: 12, poseidon: 0, athena: 0, renown: 0, flags: [] },
        { act: 2, cardsPlayedInAct: 4, stats: { burnout: 40 }, expedition: 9, poseidon: 5, athena: 3, renown: 4, flags: ['ody_done_cyclops'] },
        { act: 3, cardsPlayedInAct: 6, stats: { burnout: 80 }, expedition: 14, poseidon: 9, athena: 6, renown: 12, flags: ['ody_done_cyclops', 'ody_done_underworld'] },
      ]) {
        for (const b of pres.tableau?.(mock, null)?.inspect || []) out.push(b.title, ...(b.lines || []));
      }
      // The player-experience passes' presenter prose (2026-07): every batch
      // below shipped before this harvest knew its field, so its first lint
      // runs were vacuously green — the exact trap the taste gate exists to
      // close. Scan them all AS the screen shows them.
      // Pass 1 — the tutorial frame (offer/skip/replay/hud + the wrap-up).
      const tut = pres.tutorial;
      if (tut) {
        out.push(tut.offer, tut.skip, tut.replay, tut.hud);
        out.push(tut.end?.verdict, tut.end?.title, tut.end?.text, tut.end?.next, tut.end?.lpNote);
        for (const l of tut.end?.lessons || []) out.push(l.html);
      }
      // Pass 2 — the trophy shelf (names + descriptions).
      for (const t of pres.trophies || []) out.push(t.name, t.desc);
      // Pass 3 — the act recap, across the states that vary its lines and a
      // few seeds so every variant pool member is scanned.
      for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
        for (const flags of [[], ['ody_named'], ['ody_nobody']]) {
          for (const exp of [12, 7, 3]) {
            const mock = { act: 2, loadout: 'kings_hall', flags, stats: { burnout: 20 }, expedition: exp, athena: 4, poseidon: seed % 10, renown: 3, flavorSeed: seed };
            for (const b of pres.recap?.(mock, 2, seed)?.blocks || []) {
              if (!b.cls?.includes('recap-scene')) out.push(b.label, b.html);
            }
          }
        }
      }
      // Pass 4 — the clarity bundle (stat blurbs, help sheet, twist notes;
      // the Résumé's row labels are ledger chrome, scanned for tells too).
      out.push(...Object.values(pres.statInfo || {}));
      out.push(...(pres.helpBlocks || []));
      out.push(pres.twistNote?.(-2), pres.twistNote?.(2));
      for (const r of pres.resume?.({ runs: 3, lpEarnedTotal: 40, lifetime: { swipes: 90, incredibles: 2, bads: 5, byLoadout: { kings_hall: { runs: 2, wins: 1 } }, byPath: {} }, odyssey: { fragments: ['sea'], oarRoad: true, tellings: { count: 3, byEnding: { nostos: 1, wrath: 2 }, named: 2, nobody: 1, crewLostTotal: 9 } } }) || []) {
        out.push(r.label);
      }
      // Pass 6 — the fire's last word (exit interviews + finale epilogues,
      // every arm and every variant; spoken lines already carry their quotes
      // in the data, so they scan as the screen shows them).
      for (const iv of Object.values(pres.exitInterviews || {})) {
        out.push(iv.context, iv.prompt);
        for (const side of ['left', 'right']) out.push(iv[side]?.label, iv[side]?.text);
      }
      for (const [key, result] of [['nostos', 'success'], ['kleos', 'success'], ['nostos', 'partial'], ['nostos', 'failure']]) {
        for (let s = 1; s <= 8; s++) out.push(pres.epilogue?.({ ending: { key, result }, flavorSeed: s }));
      }
      // Pass 8 — the telling travels: the day's harbor rumors and the share
      // record across every ending class (the one string that leaves the app).
      for (let d = 0; d < 12; d++) {
        const n = pres.title?.news?.(d);
        if (n) { out.push(n.text, n.src); }
      }
      const shareBase = {
        loadout: 'kings_hall', path: 'nostos', tierLog: ['good'], flags: [],
        expedition: 8, renown: 6, poseidon: 1, daily: null,
      };
      for (const [result, endingKey] of [['success', 'nostos'], ['partial', 'nostos'], ['failure', 'nostos'], [null, 'wrath'], [null, 'lotus'], [null, 'circe'], [null, 'calypso'], [null, 'burnout']]) {
        out.push(pres.shareText?.({ ...shareBase, result, endingKey }, 30));
      }
      // Pass 12 — The Benches: every roster note (both fresh and veteran
      // metas, so the ledger-reactive lines are scanned too).
      for (const m of [undefined, { odyssey: { tellings: { count: 6, crewLostTotal: 14 } } }]) {
        for (const g of pres.roster?.(m)?.groups || []) {
          for (const mem of g.members) { out.push(mem.name, mem.sub, mem.note); }
        }
      }
      // Pass 15 — the second screen's shell-chrome re-voicing (narration
      // register; the bundle's own copy is linted by the feed floor).
      const fc = pres.feedChrome || {};
      out.push(fc.kicker, fc.caughtUp, fc.openLabel, fc.foot, fc.headline,
        ...Object.values(fc.moodLines || {}));
      // And the channel chrome the bundle carries (names, handles, headers) —
      // narration too; exercise a few states so every channel surfaces.
      for (const exp of [12, 3]) {
        const mock = { flags: ['ody_named'], flavorSeed: 5, cardLog: [], expedition: exp, athena: 5, poseidon: 2, renown: 6, burnout: 30, stats: {} };
        const b = pres.feeds?.(mock, { kind: 'recap', act: 2 });
        out.push(b?.teaser, b?.headline);
        for (const ch of b?.channels || []) out.push(ch.name, ch.handle, ch.header);
      }
      return out.filter(Boolean);
    },
  },
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
    // ADR-0014: the second screen's content, linted via the feed floor below.
    feedBodies: feedBodyCorpus, feedChrome: feedChromeCorpus,
    arcs: [{
      id: 'li_scheduled_beats',
      setup: ['li_bomb1', 'li_bomb2', 'li_bomb2_steal', 'li_bomb2_single',
        'li_movienight_reveal', 'li_movienight_clean',
        // v5 tentpole variants (gated ones only; the no-requires bomb1/
        // challenge1 variants aren't dark and need no registration).
        'li_bomb2_charm', 'li_bomb2_lads', 'li_bomb2_single_spark',
        'li_movienight_reveal_casa', 'li_movienight_clean_others',
        'li_recoup1_choose', 'li_recoup1_choose_single',
        'li_recoup1_exposed', 'li_recoup1_exposed_single',
        'li_parents', 'li_parents_messy',
        'li_enc_rival_1',
        'li_enc_partner_1_sweet', 'li_enc_partner_1_game', 'li_enc_partner_1_slow',
        'li_enc_rmove_poach', 'li_enc_rmove_rumour',
        'li_enc_p3_high', 'li_enc_p3_low', 'li_second_wave'],
      payoffs: [],
    }, {
      // The couple-web (ADR-0013): thread cards are requires-gated stage
      // VARIANTS with their own forced surfacing (the drama manager's lit
      // windows + weighted bag), and the player-arc cards (ick, repair) are
      // flag-gated storylines — the same delivery-owned class as the
      // scheduled beats above.
      id: 'li_couple_web',
      setup: ['li_web_tri_0', 'li_web_tri_1', 'li_web_tri_showdown', 'li_web_tri_fizzle',
        'li_web_slow_0', 'li_web_slow_1', 'li_web_slow_together', 'li_web_slow_parked',
        'li_web_love_0', 'li_web_love_1', 'li_web_love_wakes', 'li_web_love_doubles',
        'li_web_feud_0', 'li_web_feud_peace', 'li_web_feud_coldwar',
        'li_web_sco_0', 'li_web_sco_loud', 'li_web_sco_grace',
        'li_web_cb_showdown', 'li_web_cb_together', 'li_web_cb_wakes',
        // v5 doubling — new couple-web threads (situationship · politeones ·
        // podcast · oldflame · wrecking) and new player arcs (the falling, the
        // fame friction), plus the second-scenario ick triggers and alternate
        // repair openers. Same delivery-owned class as the originals above.
        'li_web_situationship_0', 'li_web_situationship_1', 'li_web_sit_called', 'li_web_sit_strung',
        'li_web_polite_0', 'li_web_polite_1', 'li_web_polite_spark', 'li_web_polite_fade',
        'li_web_podcast_0', 'li_web_podcast_1', 'li_web_podcast_real', 'li_web_podcast_brand',
        'li_web_oldflame_0', 'li_web_oldflame_1', 'li_web_oldflame_rekindle', 'li_web_oldflame_closure',
        'li_web_wrecking_0', 'li_web_wrecking_1', 'li_web_wrecking_chaos', 'li_web_wrecking_fizzle',
        'li_ick_sweet', 'li_ick_game', 'li_ick_slow', 'li_ick_resurface', 'li_ick_theirs',
        'li_ick_sweet2', 'li_ick_game2', 'li_ick_slow2',
        'li_repair_mine_0', 'li_repair_mine_1', 'li_repair_theirs_0', 'li_repair_theirs_1',
        'li_repair_mine_alt0', 'li_repair_theirs_alt0',
        'li_fall_start', 'li_fall_talk', 'li_fall_resurface',
        'li_fame_start', 'li_fame_talk', 'li_fame_resurface',
        'li_nation_correction'],
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

  // Duplicate-id guard: the deck draws by iterating events in declaration order
  // and subtracting weights (engine.drawNextCard), so a repeated id silently
  // DOUBLES that card's presence and total weight in the pool — a bug the
  // per-pack goldens are blind to. Music's deck alone spans events.ts + the
  // 26k-line events2.ts with two divergent id namespaces (a1_/n1_/nm_/np_) and
  // nothing else enforcing uniqueness.
  {
    const seenIds = new Set();
    for (const ev of EVENTS) {
      if (seenIds.has(ev.id)) tag(`duplicate event id '${ev.id}' (doubles its deck weight)`);
      seenIds.add(ev.id);
    }
  }

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
    const texts = [ev.prompt, ev.promptNemesis, ev.recap, ev.context];
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
        // Show-don't-tell: meta-summary phrases that point at a moment instead
        // of rendering it (scanned over narration; dialogue is exempt).
        for (const iss of tellIssues(t, desc.taste.tells)) tag(`${ev.id}: ${iss}`);
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

  // ── Positive-presence argot floor (a pack's taste.requiredArgot) ──
  // The counterpart to the cliché blocklist: a genre's REAL dialect must
  // actually appear in its characters' mouths, or the villa has quietly
  // forgotten how to talk. Scanned over QUOTED spans corpus-wide (the narrator
  // never gets this argot; the Islanders must). See the pack's VOICE.md.
  if (desc.taste?.requiredArgot) {
    let spoken = '';
    for (const ev of EVENTS) {
      const texts = [ev.prompt, ev.context];
      for (const side of ['left', 'right']) {
        const c = ev.choices?.[side];
        if (!c) continue;
        texts.push(c.label);
        for (const t of ['bad', 'good', 'incredible']) texts.push(c.outcomes?.[t]?.text);
      }
      for (const t of texts) if (t) spoken += ' ' + quotedSpans(t);
    }
    for (const iss of argotPresenceIssues(spoken, desc.taste.requiredArgot)) tag(iss);
  }

  // ── The second-screen feed floor (ADR-0014, a pack's taste.feeds) ──
  // Feed content lives in the presenter, not the deck, so it's linted from the
  // pack's exported corpus: post bodies as quoted mouths (cliché/bang exempt),
  // teaser chrome as narration (house rules), plus length/token/uniqueness and
  // a coverage floor. See VOICE.md § the second screen.
  if (desc.feedBodies && desc.taste?.feeds) {
    for (const iss of feedIssues({
      bodies: desc.feedBodies(), chrome: (desc.feedChrome || (() => []))(),
      taste: desc.taste, knownTokens: [...knownTokens],
    })) tag(iss);
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

  // Presenter copy (endings, act intros, crossroads, taglines, the pre-finale
  // set…) is player-facing prose the deck checker never sees — goldens and
  // sims are DOM-free, so without this floor a cliché in an ending ships
  // silently (the odyssey slice-2 verifier's finding). A pack declares
  // presenterCopy() on its descriptor returning its authored presenter
  // strings (exercising state-dependent hooks in their reachable variants);
  // they get the same taste + structural floor as deck copy.
  if (desc.presenterCopy) {
    const copy = desc.presenterCopy(pack);
    totalReactive += copy.length;
    for (const t of copy) {
      if (!t) continue;
      if (/\w'\w/.test(t)) tag(`presenter: straight apostrophe: ${t.slice(0, 60)}`);
      if (t.includes('  ')) tag(`presenter: double space: ${t.slice(0, 60)}`);
      if (desc.taste) {
        for (const i of tasteIssues(t, desc.taste)) tag(`presenter: ${i}`);
        for (const i of tellIssues(t, desc.taste.tells)) tag(`presenter: ${i}`);
      } else {
        const b = bangIssue(t);
        if (b) tag(`presenter: ${b}`);
      }
    }
  }
}

if (issues.length) {
  console.error(issues.join('\n'));
  console.error(`\n${issues.length} issue(s) across ${PACKS.length} packs, ${totalEvents} events`);
  process.exit(1);
}
console.log(`LINT CLEAN — ${PACKS.length} packs, ${totalEvents} events, ${totalReactive} reactive strings`);
