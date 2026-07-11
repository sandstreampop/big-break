// The bard's frame chatter (2026-07 review product-risk-1; the human's
// "where is the personality"). The tale-voice ships inside the cards; THIS is
// the missing layer — the performer working the fire: the hecklers, the
// vanity, the fee, the running gags. It surfaces as a between-card
// `.overlay-note` (the box odyssey.css already calls "the bard's voice").
//
// Variance without complexity: one flat tagged pool + a sparse seeded picker,
// exactly the deck's own pattern. Two anti-groan levers do the work —
//   1. SCARCITY: a hard per-run cap (BARD_CAP) shows only a few of the pool
//      each run, so a small pool feels curated and non-repeating for several
//      runs; and no line repeats within a run.
//   2. PLAYER-CAUSED: reactive lines fire off state the player CAUSED (shouted
//      the name, chose Nobody, a bad streak, renown high), so the bard reads
//      as responding to THIS telling, not shuffling a deck.
// (The recurring-ensemble "you again" meta-variants — the retelling-wink
// replay hook — are v2, gated on the playtest per the action plan.)
//
// GOLDEN-SAFE BY CONSTRUCTION: selection draws only from the run's separate
// `flavorSeed` stream (never the play RNG), and writes only pack-owned
// non-golden run fields (`bardLine`/`bardShown`), so card draws — and every
// golden — are byte-identical. Pinned by test/odyssey-bard.test.mjs.

import { mulberry32 } from '../../engine.js';
import type { Plugin, RunState } from '../../types.js';

// Pack-owned run state for the chatter (declaration-merged, like the rest of
// odyssey's vocabulary). `bardLine` is the id to render on the current deal;
// `bardShown` is the run's no-repeat + cap ledger.
declare module '../../types.js' {
  interface RunState {
    bardLine?: string | null;
    bardShown?: string[];
  }
}

type Kind = 'open' | 'reactive' | 'ambient';
interface Chatter {
  id: string;
  kind: Kind;
  text: string;
  // Eligibility: reactive/ambient lines only fire when this holds (open lines
  // ignore it — they fire once, at the cold open).
  when?: (s: RunState) => boolean;
}

// ~14 lines across the personality engines. Held to the taste floor (curly
// quotes, ≤2 `!`, no blocklist cliché) and harvested by tools/lint-content.mjs
// so the linter scans them like any presenter copy.
export const CHATTER: Chatter[] = [
  // ── The cold open: the bard takes the fire (one, on the first card). ──
  { id: 'bc_open_room', kind: 'open',
    text: 'Come in — there is room at the fire, though the man with the cart must leave the cart. Tonight I sing the long way home. You know where it ends, friends. You do not know how. How is tonight’s business.' },
  { id: 'bc_open_wine', kind: 'open',
    text: 'The wine goes left, friends, and if it reaches me empty I will remember your faces. Troy is ash behind us; one captain the gods argued about at supper will take ten years to cross what a gull crosses in a week. Sit.' },

  // ── Reactive: fire on sight off state the player CAUSED. ──
  { id: 'bc_named', kind: 'reactive', when: (s) => (s.flags || []).includes('ody_named'),
    text: 'He shouted the name at the water, whole. The potter’s boy — silent an hour — wants to know why the clever man could not keep his mouth shut. Best question at this fire, boy. Ask it again when you have heard the price.' },
  { id: 'bc_nobody', kind: 'reactive', when: (s) => (s.flags || []).includes('ody_nobody'),
    text: 'Nobody, he told the giant. Write that down, you that write things down. It is the stupidest joke in the poem, and it saves more men than his spear ever does, and there is a lesson in it I have never once managed to live by.' },
  { id: 'bc_streak', kind: 'reactive', when: (s) => (s.badStreak || 0) >= 2,
    text: 'The sea is winning the argument, friends, and it wins the way it always wins — not by being stronger. By not being tired. Row anyway. The bard has seen worse benches than yours reach home.' },
  { id: 'bc_hot', kind: 'reactive', when: (s) => (s.renown || 0) >= 6,
    text: 'This is the part Phemios of Smyrna cannot do, friends: the man is good, the telling knows it, and the fire leans in without being asked. Phemios would reach for the drum here. Watch me not.' },

  // ── Ambient sea: the crowd-work, sparse and seeded (kept short — they share
  // the card with the prompt). ──
  { id: 'bc_woodpile', kind: 'ambient',
    text: 'The woman by the woodpile wants it on record that her grandfather sailed with a man who counted fewer ships than I do. Her grandfather, friends, counted his own fingers twice and made nine.' },
  { id: 'bc_drum', kind: 'ambient',
    text: 'Phemios of Smyrna does this part with a drum. A DRUM, friends, as if the sea keeps time. He gives the Cyclops a limp, for pathos. The Cyclops does not want a limp.' },
  { id: 'bc_horse', kind: 'ambient',
    text: 'Someone at the back still wants the horse. Wrong poem, friend — the horse was three years and one telling ago, and it is carpenters’ work besides. I have your coin, and I am keeping it.' },
  { id: 'bc_fee', kind: 'ambient',
    text: 'The cup has reached me empty again, friends. I saw the hands it passed. I will remember those hands in the part where the men drown; they will drown a little slower, and enjoy it less.' },
  { id: 'bc_singers', kind: 'ambient',
    text: 'You want the singers. Everyone wants the singers. They are a long sea away yet — and they are the whole reason you keep this cup of mine filled between here and there.' },
  { id: 'bc_ladder', kind: 'ambient',
    text: 'There is a boy in this telling who dies falling off a roof — not in the war, friends, off a ROOF, drunk, the morning everyone was leaving. Homer put him there on purpose. Somebody has to be the reason you check the ladder.' },
  { id: 'bc_true', kind: 'ambient',
    text: 'A man from Kyme called me a liar once, for singing the storm before the meadow. Friend: every telling is true. That is what a sea story is — the one truth, reshuffled, until an ordering of it gets him home.' },
  { id: 'bc_deep', kind: 'ambient', when: (s) => (s.act || 1) >= 3,
    text: 'The fire burns low now, and I will sing softer, because the last sea is a corridor with teeth on both walls — and beyond it, home, wearing a stranger’s face.' },
];

const BY_ID: Record<string, Chatter> = Object.fromEntries(CHATTER.map((c) => [c.id, c]));

// Scarcity is the anti-groan lever: a hard ceiling on interjections per run,
// so a small pool feels curated and any one run shows only a slice.
const BARD_CAP = 4;
// How often the bard volunteers an AMBIENT aside on a silent card (reactive
// lines ignore this — they fire as soon as their cause is true). Tuned so a
// typical run lands ~2–3 asides under the cap.
const AMBIENT_P = 0.24;

const eligible = (kind: Kind, s: RunState) =>
  CHATTER.filter((c) => c.kind === kind && !(s.bardShown || []).includes(c.id) && (!c.when || c.when(s)));

// The genre-owned selector. Deterministic in `flavorSeed`, so a run's chatter
// transcript is fixed for that run but varies run-to-run; the `salt` spreads
// successive decisions across the stream without ever touching play RNG.
function pick(s: RunState, salt: number): string | null {
  if ((s.bardShown || []).length >= BARD_CAP) return null;
  const rng = mulberry32(((s.flavorSeed || 1) >>> 0) + 0x9e37 * (salt + 1));
  // A caused line outranks crowd-work: the bard answers the run first.
  const reactive = eligible('reactive', s);
  let chosen: Chatter | undefined;
  if (reactive.length) chosen = reactive[Math.floor(rng() * reactive.length)];
  else if (rng() < AMBIENT_P) {
    const amb = eligible('ambient', s);
    if (amb.length) chosen = amb[Math.floor(rng() * amb.length)];
  }
  if (!chosen) return null;
  s.bardShown = [...(s.bardShown || []), chosen.id];
  return chosen.id;
}

export const bardPlugin: Plugin = {
  id: 'odyssey_bard',
  // The cold open lands on the first card. flavorSeed is already set at
  // construction; this reads it and draws NOTHING from the play rng.
  onRunStart(state) {
    state.bardShown = [];
    const opens = CHATTER.filter((c) => c.kind === 'open');
    if (!opens.length) { state.bardLine = null; return; }
    const rng = mulberry32(((state.flavorSeed || 1) >>> 0) + 1);
    const o = opens[Math.floor(rng() * opens.length)];
    state.bardLine = o.id;
    state.bardShown = [o.id];
  },
  // After each card, decide what (if anything) the bard says on the NEXT deal.
  // Salt with the card count so successive decisions don't collide.
  afterResolve(state) {
    state.bardLine = pick(state, (state.bardShown || []).length + (state.cardsPlayedInAct || 0));
  },
};

// The presenter's overlayNote body: a pure read of the pending line. Never
// covers a landmark's set-piece — that beat IS the moment, the bard hushes.
export function bardOverlayNote(run: RunState, ev: { tags?: string[] }) {
  if ((ev.tags || []).includes('landmark')) return null;
  const id = run.bardLine;
  if (!id || !BY_ID[id]) return null;
  return { html: BY_ID[id].text, cls: 'bard-note' };
}
