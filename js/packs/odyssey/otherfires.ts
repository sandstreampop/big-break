// The Odyssey — the other fires (pass 33): the shared-water modes get a
// fleet to compare against.
//
// The Same Sea's own closing note says "compare endings, not routes" — but
// the fire had nothing to compare against. This module sails tonight's
// EXACT water a hundred more times, in the player's own browser, and counts
// how those tellings ended. No server, no other players' data — the engine
// is DOM-free and fully deterministic, so a bot fleet seeded from the
// shared day/week seed produces the SAME hundred endings on every phone
// that plays that day. What the panel says is literally true: this is how
// tonight's water treats a hundred crews.
//
// Honesty rules:
// - The fleet sails the player's exact run seed (same construction stream,
//   same play stream) — the same water, the same luck. Divergence comes
//   only from choices, exactly as it does between two real players on the
//   daily. Each bot's choices ride its own whim stream (mulberry32 off the
//   shared seed + bot index), never the play RNG, mirroring
//   tools/pack-core.mjs's proven separation.
// - Bots carry no perks, no history, no meta — the shared-water law
//   (applySetup early-returns for daily/gauntlet) means the player's run
//   forked on nothing personal either, so the comparison is fair.
// - Deterministic by construction: no Date, no Math.random. The seed comes
//   in; the tally comes out. Same day → same fleet for everyone.
//
// The drive loop mirrors tools/pack-core.mjs (the genre-neutral driver the
// invariants and the probe golden trust) — narrative policy: whim-swipes
// most of the time, the safer side sometimes, the compass-preferred summit
// usually. The browser painter chunks the fleet across timeouts so phones
// never jank; Node tests call the synchronous core directly.

import * as engine from '../../engine.js';
import { hashStr } from '../../ui/dom.js';
import type { Pack, RunState, Choice } from '../../types.js';

// ── The buckets: every ending class the fire can name. ──
export type FireBucket = 'home' | 'glory' | 'short' | 'banked' | 'sea' | 'despair';
export const BUCKET_ORDER: FireBucket[] = ['home', 'glory', 'short', 'banked', 'sea', 'despair'];
export const BUCKET_COPY: Record<FireBucket, string> = {
  home: 'came home whole',
  glory: 'sang the Glory',
  short: 'fell at the last water',
  banked: 'banked at a temptation',
  sea: 'the sea answered',
  despair: 'the rowing ended',
};

export interface FleetTally { total: number; counts: Record<FireBucket, number>; }

// Which shared water an ended run sailed, and the seed every fire on it
// shares. The seed strings are the cross-file contract with the shell's
// starters (js/ui/newrun.ts startNewRun / startGauntletGeneric) — if those
// strings ever change, this must change with them or the fleet sails
// different water than the player did.
export function fleetSeedFor(summary: any): { seed: number; label: string } | null {
  if (summary?.daily) return { seed: hashStr('bigbreak-daily-' + summary.daily), label: `The Same Sea — ${summary.daily}` };
  if (summary?.gauntlet) return { seed: hashStr('bigbreak-gauntlet-' + summary.gauntlet), label: `The Gauntlet — week ${summary.gauntlet}` };
  return null;
}

// The player's own telling, in the same bucket space (pure summary read).
export function bucketOfSummary(summary: any): FireBucket {
  const key = summary?.endingKey ?? summary?.path ?? null;
  const result = summary?.result ?? null;
  if (key === 'nostos' && result === 'success') return 'home';
  if (key === 'kleos' && result === 'success') return 'glory';
  if (key === 'lotus' || key === 'circe' || key === 'calypso') return 'banked';
  if (key === 'wrath') return 'sea';
  if (key === 'burnout') return 'despair';
  return 'short';
}

function sideScore(state: RunState, choice: Choice): number {
  const o = engine.choiceOdds(state, choice);
  let s = o.good + 2.4 * o.incredible - 1.4 * o.bad;
  const avgBurn = (['bad', 'good', 'incredible'] as const)
    .reduce((n, t) => n + ((choice.outcomes[t].effects as any).burnout || 0), 0) / 3;
  if (state.stats.burnout > 55) s -= avgBurn * 0.12;
  if (choice.cost && (state as any).money < choice.cost) s -= 3;
  return s;
}

function pathScore(pack: Pack, state: RunState, pathId: string): number {
  const g = pack.manifest.winGates[pathId];
  let s = 0;
  for (const [k, target] of Object.entries(g)) s += engine.gateValue(state, k) / (target as number);
  return s;
}

// One bot's telling of the shared water. `whimSeed` is the bot's identity;
// `seed` is the water's. Mirrors pack-core's narrative policy.
export function sailOne(pack: Pack, seed: number, whimSeed: number): FireBucket {
  const whim = engine.mulberry32(whimSeed >>> 0 || 1);
  const personas = pack.loadouts.filter((i) => i.unlockedByDefault).map((i) => i.id);
  const persona = personas[Math.floor(whim() * personas.length)] || pack.loadouts[0].id;
  const state = engine.newRun(pack, persona, [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  const play = engine.stateRng(state);
  const pathIds = Object.keys(pack.manifest.paths);

  let finale: { path: string | null; result: string } | null = null;
  let gameover: string | null = null;
  let guard = 0;
  while (state.phase !== 'ended' && guard++ < 300) {
    if (state.phase === 'crossroads') {
      const best = pathIds.slice().sort((a, b) => pathScore(pack, state, b) - pathScore(pack, state, a))[0];
      const pick = whim() < 0.4 ? pathIds[Math.floor(whim() * pathIds.length)] : best;
      engine.commitPath(state, pick);
      continue;
    }
    const ev = engine.drawNextCard(state, play);
    if (!ev) {
      state.cardsPlayedInAct = engine.actLength(state, state.act);
    } else {
      const side = whim() < 0.6
        ? (whim() < 0.5 ? 'left' : 'right')
        : (sideScore(state, ev.choices.left) >= sideScore(state, ev.choices.right) ? 'left' : 'right');
      const result = engine.resolveSwipe(state, side, play, {});
      const pend = (result.deltas as any).pendingGear ||
        ((result.deltas as any).pendingGearChoices ? (result.deltas as any).pendingGearChoices[0] : null);
      if (pend) pack.presenter?.equipItem?.(state, pend.id);
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') {
      const res = engine.evaluateFinale(state);
      finale = { path: state.path, result: res.result };
    } else if (step.kind === 'gameover') {
      gameover = (step as any).endingKey;
    }
  }
  if (finale) {
    if (finale.result === 'success') return finale.path === 'kleos' ? 'glory' : 'home';
    return 'short';
  }
  return bucketOfSummary({ endingKey: gameover });
}

// The whole fleet, synchronously (Node tests; small n). Pure in (pack,
// seed, n) — no module state, no clock.
export function sailFleet(pack: Pack, seed: number, n: number): FleetTally {
  const counts = { home: 0, glory: 0, short: 0, banked: 0, sea: 0, despair: 0 } as Record<FireBucket, number>;
  for (let i = 0; i < n; i++) counts[sailOne(pack, seed, (seed ^ ((i + 1) * 0x9e3779b9)) >>> 0)]++;
  return { total: n, counts };
}

export const FLEET_SIZE = 100;

// The panel's rows, as HTML (pure; testable). The player's bucket is marked
// as their own fire even when no bot landed there.
export function fleetRows(tally: FleetTally, yours: FireBucket): string {
  const max = Math.max(1, ...BUCKET_ORDER.map((b) => tally.counts[b]));
  return BUCKET_ORDER
    .filter((b) => tally.counts[b] > 0 || b === yours)
    .map((b) => {
      const n = tally.counts[b];
      const w = Math.max(2, Math.round((100 * n) / max));
      const you = b === yours;
      return `<div class="ody-fire-row${you ? ' ody-fire-you' : ''}">` +
        `<span class="ody-fire-label">${BUCKET_COPY[b]}${you ? ' — your fire' : ''}</span>` +
        `<span class="ody-fire-bar"><i style="width:${w}%"></i></span>` +
        `<span class="ody-fire-n">${n}</span></div>`;
    }).join('');
}

// The browser painter: fills the placeholder the ending screen rendered,
// a few tellings per timeout so the ending screen never stutters. Reads
// the finished panel's data from the DOM it owns; touches nothing else.
export function paintOtherFires(host: HTMLElement, pack: Pack, summary: any): void {
  const water = fleetSeedFor(summary);
  if (!water) return;
  const counts = { home: 0, glory: 0, short: 0, banked: 0, sea: 0, despair: 0 } as Record<FireBucket, number>;
  const yours = bucketOfSummary(summary);
  let done = 0;
  const CHUNK = 10;
  const step = () => {
    if (!host.isConnected) return; // the screen moved on; stop counting
    for (let i = 0; i < CHUNK && done < FLEET_SIZE; i++, done++) {
      counts[sailOne(pack, water.seed, (water.seed ^ ((done + 1) * 0x9e3779b9)) >>> 0)]++;
    }
    if (done < FLEET_SIZE) {
      host.querySelector('.ody-fires-wait')!.textContent = `Word is coming up the beach — ${done} fires heard from…`;
      setTimeout(step, 0);
    } else {
      host.innerHTML =
        `<div class="ody-fires-head">Word from the other fires</div>` +
        `<div class="ody-fires-sub">${water.label} · the same water, ${FLEET_SIZE} tellings.</div>` +
        fleetRows({ total: FLEET_SIZE, counts }, yours);
    }
  };
  setTimeout(step, 0);
}
