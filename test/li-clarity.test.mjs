// The Clarity Layer (v3) unit tests: every player-facing string the four
// clarity reads can emit passes the pack's taste floor; the reads are PURE
// (no rng draws, no state writes — deals re-render on resume and the sims
// never render); and the ceremony stakes are TRUTHFUL (they must agree with
// the coupling plugin's real survival arithmetic, the ADR-0008 contract).
//
// Strategy: drive real seeded seasons with the generic pack driver and run
// the clarity reads at every deal/result — harvesting the strings the layer
// actually produces, not a hand-picked subset.
//
// Run: node --test test/li-clarity.test.mjs (build first)

import test from 'node:test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import {
  villaStage, villaResultStage, villaRecap, villaSetPiece,
} from '../dist/js/packs/love-island/clarity.js';
import { ceremonyOutlook } from '../dist/js/packs/love-island/plugins/coupling.js';
import { LOVE_ISLAND_TASTE } from '../docs/games/love-island/taste.mjs';
import { tasteIssues } from '../tools/taste-core.mjs';

const strip = (h) => String(h).replace(/<[^>]+>/g, '');

// Harvest every string the clarity layer emits across seeded seasons.
function harvest(seasons = 40) {
  const texts = new Map(); // text -> where
  const put = (where, s) => { if (s) texts.set(strip(s), where); };
  for (let seed = 100; seed < 100 + seasons; seed++) {
    const meta = engine.mulberry32(seed);
    const personas = loveIslandPack.loadouts.map((l) => l.id);
    const state = engine.newRun(loveIslandPack, personas[Math.floor(meta() * personas.length)], [], engine.mulberry32(seed + 1), []);
    state.seed = seed + 2;
    const play = engine.stateRng(state);
    let guard = 0;
    while (state.phase !== 'ended' && guard++ < 200) {
      if (state.phase === 'crossroads') {
        const paths = Object.keys(loveIslandPack.manifest.paths);
        engine.commitPath(state, paths[Math.floor(meta() * paths.length)]);
        continue;
      }
      const ev = engine.drawNextCard(state, play);
      if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
      else {
        // Deal-time reads, before the swipe (exactly when the shell calls them).
        for (const slot of villaStage(state, ev) || []) {
          put('stage', slot.read); put('stage', slot.name);
          for (const l of slot.sheet?.lines || []) put('stage-sheet', l);
        }
        const sp = villaSetPiece(state, ev);
        if (sp) {
          put('set-piece', sp.banner); put('set-piece', sp.sub);
          for (const s of sp.stakes || []) put('set-piece', s.html);
        }
        const side = meta() < 0.5 ? 'left' : 'right';
        const result = engine.resolveSwipe(state, side, play, {});
        const rs = villaResultStage(state, result);
        for (const r of rs?.reads || []) put('result-read', r.html);
        if (rs?.portrait?.sub) put('result-portrait', rs.portrait.sub);
      }
      const step = engine.advance(state);
      if (step.kind === 'actStart') {
        const rec = villaRecap(state, step.act, state.flavorSeed || 1);
        if (rec) {
          put('recap', rec.kicker); put('recap', rec.title);
          for (const b of rec.blocks) { put('recap', b.label); put('recap', b.html); }
        }
      } else if (step.kind === 'finale') { engine.evaluateFinale(state); }
    }
  }
  return texts;
}

const HARVEST = harvest();

test('the clarity layer produces every surface across seeded seasons', () => {
  const wheres = new Set(HARVEST.values());
  for (const w of ['stage', 'stage-sheet', 'set-piece', 'result-read', 'recap']) {
    assert.ok(wheres.has(w), `no '${w}' strings harvested — the surface never fired`);
  }
  assert.ok(HARVEST.size > 80, `suspiciously small harvest (${HARVEST.size})`);
});

test('every clarity string passes the taste floor (VOICE.md)', () => {
  const issues = [];
  for (const [text, where] of HARVEST) {
    for (const iss of tasteIssues(text, LOVE_ISLAND_TASTE)) issues.push(`[${where}] "${text}": ${iss}`);
    if (/\w'\w/.test(text)) issues.push(`[${where}] "${text}": straight apostrophe`);
    if (text.includes('  ')) issues.push(`[${where}] "${text}": double space`);
  }
  assert.deepEqual(issues, []);
});

test('clarity reads never speak a raw relationship number', () => {
  // ADR-0006: opinion/Bond reach the player as tiers and weather, not floats.
  const offenders = [];
  for (const [text, where] of HARVEST) {
    if (where === 'set-piece' || where === 'recap') continue; // no numbers there either, but the ban is on relationship reads
    if (/(Bond|opinion)[^.]*\b\d{2,}\b/i.test(text)) offenders.push(`[${where}] ${text}`);
  }
  assert.deepEqual(offenders, []);
});

test('the reads are pure: no rng consumed, no state mutated', () => {
  const seed = 4242;
  const state = engine.newRun(loveIslandPack, 'retriever_girl', [], engine.mulberry32(seed), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state);
  const ev = engine.drawNextCard(state, play);
  const before = JSON.stringify(state);
  villaStage(state, ev);
  villaSetPiece(state, ev);
  villaRecap(state, 2, state.flavorSeed || 1);
  assert.equal(JSON.stringify(state), before, 'a clarity read mutated run state');
});

test('ceremony stakes tell the truth about the survival check', () => {
  const state = engine.newRun(loveIslandPack, 'retriever_girl', [], engine.mulberry32(9), []);
  state.seed = 11;
  state.partner = 'kai';
  state.act = 2;
  const lineup = loveIslandPack.events.find((e) => e.id === 'li_recoup1_exposed');
  for (const [bond, pub] of [[80, 50], [10, 50], [10, 2], [80, 2]]) {
    state.bond = bond; state.public = pub;
    const o = ceremonyOutlook(state);
    const sp = villaSetPiece(state, lineup);
    const bondStake = sp.stakes.find((s) => strip(s.html).includes('Bond'));
    const pubStake = sp.stakes.find((s) => strip(s.html).includes('public'));
    assert.equal(bondStake.cls === 'sp-safe', o.bondSafe, `bond stake lies at bond=${bond}`);
    assert.equal(pubStake.cls === 'sp-safe', o.publicSafe, `public stake lies at public=${pub}`);
  }
});

test('the stage never seats the same islander as Partner and bombshell', () => {
  const state = engine.newRun(loveIslandPack, 'retriever_girl', [], engine.mulberry32(9), []);
  state.seed = 11;
  state.partner = 'luca';
  state.bombshellId = 'luca';
  state.charOpinion = { rival: 30, bombshell: 46 };
  const slots = villaStage(state, null) || [];
  assert.equal(slots.filter((s) => s.name === 'Luca').length, 1);
});

test('cross-season memory predicates read the history ledger (R9)', () => {
  const { charactersPlugin } = require('../dist/js/packs/love-island/plugins/characters.js');
  const s = { partner: 'kai', rival: 'chloe', history: [{ partner: 'kai', rival: 'meg', exes: 'tyler,dev' }] };
  assert.equal(charactersPlugin.requires.partnerAgainIs(s, true), true, 'kai is a returning partner');
  assert.equal(charactersPlugin.requires.rivalAgainIs(s, true), false, 'chloe is a fresh rival');
  assert.equal(charactersPlugin.requires.partnerAgainIs({ ...s, partner: 'reece' }, true), false);
  assert.equal(charactersPlugin.requires.partnerAgainIs({ ...s, partner: 'dev' }, true), true, 'exes count');
  // Sims never stamp history — the gates fail closed (meta content stays out of goldens).
  assert.equal(charactersPlugin.requires.partnerAgainIs({ partner: 'kai' }, true), false);
});
