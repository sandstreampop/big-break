// The Odyssey — the act recap (pass 3 of the player-experience series):
// the bard banks the fire between acts and tells the crowd what tonight's
// telling has ALREADY cost — the count, the name, the gods — before naming
// the water ahead. Rides the shell's generic `recap` takeover (the
// "previously on" seam, js/ui/progression.ts): when this returns a spec, it
// replaces the static actIntro copy; act 1 returns null so the opening
// night keeps its fixed overture (there is nothing to recap yet).
//
// PURE read of (state, act, seed): deals re-render on resume and the sims
// never render, so nothing here may touch the play RNG or write state.
// Variants rotate on flavorSeed — the same telling always recaps itself the
// same way; the next telling words it differently.
//
// The hearth scene rides the first block (the act intros carried it via
// actIntro.scene; a recap must not cost the fire its own picture).

import type { Presenter, RunState } from '../../types.js';
import { mulberry32 } from '../../engine.js';
import { hearthScene } from './hearth.js';
import { seaStateOf } from './frieze.js';
import { crewAtLaunch } from './crew.js';
import { reducedMotion } from '../../ui/dom.js';

// One qualitative line per meter, in the bard's mouth. Each pool is small
// and seed-rotated; every line states the SAME truth (the numbers live in
// the frieze's inspect panel — this is the telling, not the ledger).
const pick = <T,>(rng: () => number, pool: T[]): T => pool[Math.floor(rng() * pool.length)];

function countLine(s: RunState, rng: () => number): string {
  const launch = crewAtLaunch(s.loadout);
  const now = Math.max(0, Math.round(s.expedition ?? 0));
  const lost = Math.max(0, launch - now);
  if (lost === 0) {
    return pick(rng, [
      `Count the benches, friends: <b>every man who left Troy is still pulling</b>. Say it quietly. The sea hates to hear it said.`,
      `The muster this morning came up <b>whole — all ${now} aboard</b>. The bard has sung this stretch a hundred nights and rarely gets to say that.`,
    ]);
  }
  const bench = lost === 1 ? 'one bench sits empty' : `${lost} benches sit empty`;
  if (now <= 5) {
    return pick(rng, [
      `The count is down to <b>${now}</b>, friends — ${bench}, and the ship rides light in the worst way. What is left fits around one fire.`,
      `<b>${now} remain.</b> The rest are names now — the bard says each one once, and the sand keeps the count.`,
    ]);
  }
  return pick(rng, [
    `The count stands at <b>${now}</b> — ${bench} since Troy, and no bench refills. The rowing goes on around the gaps.`,
    `<b>${now} still pull.</b> ${bench.charAt(0).toUpperCase() + bench.slice(1)}, and the men have stopped looking at them, which is how sailors grieve.`,
  ]);
}

function nameLine(s: RunState, rng: () => number): string | null {
  const flags = s.flags || [];
  if (flags.includes('ody_named')) {
    return pick(rng, [
      `And the name, friends — you heard him shout it. Father and city and all, straight at the water. <b>The sea has it now</b>, and the sea does not forget.`,
      `The giant knows the name. So does the water it was shouted over. <b>Renown travels fast; wrath swims faster.</b>`,
    ]);
  }
  if (flags.includes('ody_nobody')) {
    return pick(rng, [
      `And the name went down with the anchor-stone — <b>Nobody blinded the giant</b>, and Nobody is who the sea is looking for. Let it look.`,
      `He swallowed the name, friends. The stupidest joke in the poem is still holding the door shut. <b>The sea was left unprovoked.</b>`,
    ]);
  }
  return null;
}

function godsLine(s: RunState, rng: () => number): string {
  const wrath = Math.max(0, Math.round(s.poseidon ?? 0));
  const athena = Math.max(0, Math.round(s.athena ?? 0));
  const sea = seaStateOf(wrath);
  const owl = athena >= 3
    ? pick(rng, ['the owl sits the mast and the men pretend not to be glad of it', 'the owl has kept the mast three watches running'])
    : pick(rng, ['the mast stands bare — the goddess is watching other water tonight', 'no owl on the mast yet, and the men notice that too']);
  const water = sea === 'wrath'
    ? `<b>the sea runs oxblood</b> — at ten it takes its answer, and it is not far off ten`
    : sea === 'mid'
      ? `the sea has a chop on it with a grudge inside — <b>the trident is half-raised</b>`
      : `the sea lies meander-calm, which is either mercy or patience`;
  return `As for the gods, friends: ${owl}; and ${water}.`;
}

// The acts' fixed overtures — THE single source (presenter.actIntro reads
// these too, so the opening night and a recapped night can never drift
// apart on the same water). Act 1 renders only via actIntro (recap is null
// there); acts 2-3 close the recap as "The road ahead".
export const ACT_TEXT: Record<number, string> = {
  1: 'Twelve ships out of Troy, friends — riding low, heavy with bronze and with men who had lived, every rower pulling for a wife who had learned to run a farm without him. And listen how the water was, that first week: easy, foam like combed wool, the kind of sea that makes a captain generous at supper. That is the sea’s oldest trick. It shows you your harbour in your mind’s eye. Then it asks your name.',
  2: 'Throw on a branch; the tale goes narrow here. The islands stop being places a chart would admit to, and the dangers stop being weather. What is left of the fleet sails into waters where the right word matters more than the strong arm — and where the wrong word is very, very easy to say.',
  3: 'Now the fire burns low, friends, and I will sing softer, because the last sea is a corridor with teeth on both walls, and beyond it — home, wearing a stranger’s face. Everything he still has fits in one hull. Everything he wants is one island further than the sea would like.',
};
const ROAD = ACT_TEXT;

const KICKERS = [
  'THE FIRE IS BANKED. THE CUP GOES ROUND.',
  'THROW ON A BRANCH — THE TALE DRAWS BREATH.',
  'THE BARD REFILLS HIS CUP AND COUNTS THE HOUSE.',
];

export const odysseyRecap: NonNullable<Presenter['recap']> = (state, act, seed) => {
  if (act <= 1 || act > 3) return null;
  // One rng per recap, salted by act so act 2 and act 3 of the same telling
  // don't repeat each other's variants. flavorSeed only — never the play RNG.
  const rng = mulberry32(((seed || 1) >>> 0) + act * 0x51ed);
  const name = nameLine(state, rng);
  // The in-game reduced-motion toggle is invisible to CSS media queries —
  // stamp px-still on the scene block (the actIntro slot's exact pattern).
  // Node-guarded: the recap unit test imports this file without a window.
  const still = typeof window !== 'undefined' && reducedMotion() ? ' px-still' : '';
  const blocks: { label?: string; html: string; cls?: string }[] = [
    { html: hearthScene(state), cls: 'recap-scene' + still },
    { label: 'The count', html: countLine(state, rng) },
  ];
  if (name) blocks.push({ label: 'The name', html: name });
  blocks.push({ label: 'The gods', html: godsLine(state, rng) });
  blocks.push({ label: 'The road ahead', html: ROAD[act] || '' });
  return {
    kicker: pick(rng, KICKERS),
    title: act === 2 ? 'Witches and the Dead' : 'The Narrow Way',
    blocks,
  };
};
