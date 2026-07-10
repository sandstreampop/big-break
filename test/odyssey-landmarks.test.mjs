// The Odyssey's itinerary contract (slice 3): the Landmarks are FIXED beats —
// they fire in every Telling — and every door on every landmark drives the
// run to a terminal state (working agreement: verify the flow, not the
// feature). DOM-free: drives the real engine on dist/, mirroring the golden
// driver's loop (tools/pack-core.mjs) with a door-picking policy.
//
// Run: npm run build && node --test test/odyssey-landmarks.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { odysseyPack } from '../dist/js/packs/odyssey.js';
import * as engine from '../dist/js/engine.js';

// One full seeded run; policy(ev, state) picks the side ('left'|'right').
function driveRun(seed, { fire = 'kings_hall', path = 'nostos', policy } = {}) {
  const state = engine.newRun(odysseyPack, fire, [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state);
  const meta = engine.mulberry32(seed ^ 0xBADA55);
  const played = [];
  let finale = null;
  let guard = 0;
  while (state.phase !== 'ended' && guard++ < 300) {
    if (state.phase === 'crossroads') { engine.commitPath(state, path); continue; }
    const ev = engine.drawNextCard(state, play);
    if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
    else {
      played.push(ev.id);
      const side = policy ? policy(ev, state) : (meta() < 0.5 ? 'left' : 'right');
      engine.resolveSwipe(state, side, play, {});
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') finale = engine.evaluateFinale(state);
  }
  return { state, played, finale };
}

test('the itinerary is fixed: the Cyclops fires in every telling', () => {
  for (let i = 1; i <= 40; i++) {
    const { state, played } = driveRun(1000 + i);
    const failedEarly = state.ending && !['nostos', 'kleos'].includes(state.ending.key)
      && state.act === 1;
    if (!failedEarly) {
      assert.ok(played.some((id) => id.startsWith('ody_cyclops')),
        `run ${i}: no Cyclops landmark (played: ${played.join(',')})`);
    }
    // A run that reached judgment passed the Underworld too.
    if (state.ending && ['nostos', 'kleos'].includes(state.ending.key)) {
      assert.ok(played.includes('ody_underworld'),
        `run ${i} reached the finale without the Underworld`);
      assert.ok(played.includes('ody_tiresias'),
        `run ${i} met the Underworld but never the prophet`);
    }
  }
});

test('the name-brag is a choice: exactly one flag, and the sea remembers', () => {
  const shout = driveRun(7, { policy: (ev) => (ev.id === 'ody_cyclops_name' ? 'right' : 'left') });
  assert.ok(shout.state.flags.includes('ody_named'), 'shouting did not set ody_named');
  assert.ok(!shout.state.flags.includes('ody_nobody'));
  const swallow = driveRun(7, { policy: () => 'left' });
  assert.ok(swallow.state.flags.includes('ody_nobody'), 'swallowing did not set ody_nobody');
  assert.ok(!swallow.state.flags.includes('ody_named'));
});

test('the prophet answers the question you pressed — knowledge as a boon flag', () => {
  const bow = driveRun(11, { policy: (ev) => (ev.id === 'ody_tiresias' ? 'left' : 'left') });
  if (bow.played.includes('ody_tiresias')) {
    assert.ok(bow.state.flags.includes('ody_fore_bow'));
    assert.ok(!bow.state.flags.includes('ody_fore_sea'));
  }
  const sea = driveRun(11, { policy: (ev) => (ev.id === 'ody_tiresias' ? 'right' : 'left') });
  if (sea.played.includes('ody_tiresias')) {
    assert.ok(sea.state.flags.includes('ody_fore_sea'));
  }
});

test('every landmark door drives the run to a terminal state', () => {
  for (const side of ['left', 'right']) {
    for (const path of ['nostos', 'kleos']) {
      for (let i = 0; i < 10; i++) {
        const { state } = driveRun(5000 + i, {
          path,
          policy: (ev) => ((ev.tags || []).includes('landmark') ? side : (i % 2 ? 'left' : 'right')),
        });
        assert.ok(state.ending, `landmark door ${side}/${path} seed ${i}: run never ended`);
      }
    }
  }
});

test('which doors open depends on the voyage: both Cyclops variants surface', () => {
  let strong = 0, plain = 0;
  for (let i = 0; i < 60; i++) {
    const { played } = driveRun(9000 + i, { fire: i % 2 ? 'soldiers_camp' : 'kings_hall' });
    if (played.includes('ody_cyclops_strong')) strong++;
    if (played.includes('ody_cyclops')) plain++;
  }
  assert.ok(strong > 0, 'the Might-door variant never opened');
  assert.ok(plain > 0, 'the default variant never opened');
});

test('the Hall is the finale: the path climax lands as the last card', () => {
  let judged = 0;
  for (let i = 0; i < 30 && judged < 6; i++) {
    for (const path of ['nostos', 'kleos']) {
      const { played, finale } = driveRun(4200 + i, { path });
      if (!finale) continue;
      judged++;
      const hall = played.filter((id) => id.startsWith('ody_hall_'));
      assert.equal(hall.length, 1, `${path}: hall climax count ${hall.length}`);
      assert.equal(played[played.length - 1], `ody_hall_${path}`,
        `${path}: the hall was not the last card (${played[played.length - 1]})`);
    }
  }
  assert.ok(judged >= 4, `too few judged runs to trust the assertion (${judged})`);
});
