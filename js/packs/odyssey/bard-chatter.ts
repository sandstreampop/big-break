// The bard's frame chatter (2026-07 review product-risk-1; the human's
// "where is the personality"). The tale-voice ships inside the cards; THIS is
// the missing layer — the performer working the fire: the hecklers, the
// vanity, the fee, the running gags.
//
// It surfaces as the bard's OWN full-screen beat between cards (the shell's
// generic preCardBeat hook → showBardBeat), distinct from a playable choice
// card: the bard speaks in quotes, and a heckler is a SEPARATE attributed
// quote — dialogue, not a caption. (v1 shipped it as a box stacked on the
// card; the human, rightly, wanted the bard on his own screen.)
//
// Variance without complexity: one flat pool of dialogue scripts + a sparse
// seeded picker, the deck's own pattern. Anti-groan levers —
//   1. SCARCITY: a hard per-run cap (BARD_CAP) + no repeat within a run, so a
//      small pool feels curated and stays fresh for several runs.
//   2. PLAYER-CAUSED: reactive scripts fire off state the player CAUSED
//      (shouted the name, a bad streak, renown high), so the bard answers
//      THIS telling, not a shuffle.
// (The recurring-ensemble "you again" meta-variants are v2, gated on the
// playtest per the action plan.)
//
// GOLDEN-SAFE BY CONSTRUCTION: selection draws only from the run's separate
// `flavorSeed` stream (never the play RNG) and writes only pack-owned
// non-golden run fields, so card draws — and every golden — are byte-
// identical. Pinned by test/odyssey-bard.test.mjs.

import { mulberry32 } from '../../engine.js';
import { hearthScene } from './hearth.js';
import type { Plugin, RunState, GameEvent } from '../../types.js';

declare module '../../types.js' {
  interface RunState {
    bardLine?: string | null;
    bardShown?: string[];
  }
}

type Kind = 'open' | 'reactive' | 'ambient';
// A dialogue block: the bard's own speech (`who` omitted) or a heckler's
// interjection (`who` = the attribution the screen prints). Text is stored
// WITHOUT surrounding quotes; the shell wraps every block in curly quotes so
// bard and heckler alike read as spoken lines.
interface Block { who?: string; text: string; }
interface Chatter {
  id: string;
  kind: Kind;
  blocks: Block[];
  when?: (s: RunState) => boolean;
}

// ~14 dialogue scripts across the personality engines. Held to the taste
// floor (curly apostrophes, ≤2 `!`, no blocklist cliché) and harvested by
// tools/lint-content.mjs so the linter scans every block like presenter copy.
export const CHATTER: Chatter[] = [
  // ── The cold open: the bard takes the fire (one, on the first card). ──
  { id: 'bc_open_room', kind: 'open', blocks: [
    { text: 'Come in — there is room at the fire, though the man with the cart must leave the cart. Tonight I sing the long way home. You know where it ends, friends. You do not know how. How is tonight’s business.' },
  ] },
  { id: 'bc_open_wine', kind: 'open', blocks: [
    { text: 'The wine goes left, friends, and if it reaches me empty I will remember your faces. Troy is ash behind us — and one captain the gods argued about at supper will take ten years to cross what a gull crosses in a week. Sit.' },
  ] },

  // ── Reactive: fire off state the player CAUSED. ──
  { id: 'bc_named', kind: 'reactive', when: (s) => (s.flags || []).includes('ody_named'), blocks: [
    { text: 'He shouted the name at the water, whole — father and city and all.' },
    { who: 'the potter’s boy', text: 'Why did he not just keep his mouth shut?' },
    { text: 'Best question anyone has asked at this fire, boy. Hold on to it. Ask it again when you have heard what the shout cost.' },
  ] },
  { id: 'bc_nobody', kind: 'reactive', when: (s) => (s.flags || []).includes('ody_nobody'), blocks: [
    { text: 'He told the giant his name was Nobody. It is the stupidest joke in the poem, friends, and it saves more men than his spear ever does — and there is a lesson in it I have never once managed to live by.' },
  ] },
  { id: 'bc_streak', kind: 'reactive', when: (s) => (s.badStreak || 0) >= 2, blocks: [
    { text: 'The sea is winning the argument, friends, and it wins the way it always wins — not by being stronger. By not being tired. Row anyway. The bard has seen worse benches than yours reach home.' },
  ] },
  { id: 'bc_hot', kind: 'reactive', when: (s) => (s.renown || 0) >= 6, blocks: [
    { who: 'a voice at the back', text: 'Phemios sang it better.' },
    { text: 'Phemios of Smyrna does this part with a drum. A DRUM, as if the sea keeps time. The man is good, friends, and the telling knows it — compare us again when he has looked at real water.' },
  ] },

  // ── Ambient crowd-work: sparse, seeded. ──
  { id: 'bc_woodpile', kind: 'ambient', blocks: [
    { text: 'Twelve ships out of Troy.' },
    { who: 'the woman by the woodpile', text: 'Eleven. My grandfather sailed with a man who counted eleven.' },
    { text: 'Her grandfather counted his own fingers twice and made nine, friends. Twelve ships.' },
  ] },
  { id: 'bc_horse', kind: 'ambient', blocks: [
    { who: 'a man at the back', text: 'When do we get the horse?' },
    { text: 'Wrong poem, friend — the horse was three years and one telling ago, and it is carpenters’ work besides. I have your coin, and I am keeping it.' },
  ] },
  { id: 'bc_true', kind: 'ambient', blocks: [
    { who: 'a man from Kyme', text: 'Liar. Last winter you sang the storm before the meadow.' },
    { text: 'Every telling is true, friend. That is what a sea story is — the one truth, reshuffled, until an ordering of it finally gets him home.' },
  ] },
  { id: 'bc_singers', kind: 'ambient', blocks: [
    { who: 'someone by the fire', text: 'Sing the sirens.' },
    { text: 'Everyone wants the singers. They are a long sea away yet, friends — and they are the whole reason you keep this cup of mine filled between here and there.' },
  ] },
  { id: 'bc_fee', kind: 'ambient', blocks: [
    { text: 'The cup has reached me empty again, friends. I saw the hands it passed. I will remember those hands in the part where the men drown — they will drown a little slower, and enjoy it less.' },
  ] },
  { id: 'bc_ladder', kind: 'ambient', blocks: [
    { text: 'There is a boy in this telling who dies falling off a roof — not in the war, friends, off a ROOF, drunk, the morning everyone was leaving. Homer put him there on purpose. Somebody has to be the reason you check the ladder.' },
  ] },
  { id: 'bc_drum', kind: 'ambient', blocks: [
    { text: 'Phemios of Smyrna gives the Cyclops a limp, for pathos. The Cyclops does not want a limp, friends. The Cyclops wants an eye — and before the night is out he will be short the one he has.' },
  ] },
  { id: 'bc_deep', kind: 'ambient', when: (s) => (s.act || 1) >= 3, blocks: [
    { text: 'The fire burns low now, and I will sing softer, friends — the last sea is a corridor with teeth on both walls, and beyond it, home, wearing a stranger’s face.' },
  ] },
];

const BY_ID: Record<string, Chatter> = Object.fromEntries(CHATTER.map((c) => [c.id, c]));

// Scarcity is the anti-groan lever: a hard ceiling per run.
const BARD_CAP = 4;
// How often the bard volunteers an AMBIENT beat on a silent card (reactive
// scripts ignore this — they fire as soon as their cause is true).
const AMBIENT_P = 0.24;

const eligible = (kind: Kind, s: RunState) =>
  CHATTER.filter((c) => c.kind === kind && !(s.bardShown || []).includes(c.id) && (!c.when || c.when(s)));

// Deterministic in flavorSeed: a run's chatter is fixed for that run, varies
// run-to-run; `salt` spreads successive decisions without touching play RNG.
function pickId(s: RunState, salt: number): string | null {
  if ((s.bardShown || []).length >= BARD_CAP) return null;
  const rng = mulberry32(((s.flavorSeed || 1) >>> 0) + 0x9e37 * (salt + 1));
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
  onRunStart(state) {
    state.bardShown = [];
    const opens = CHATTER.filter((c) => c.kind === 'open');
    if (!opens.length) { state.bardLine = null; return; }
    const rng = mulberry32(((state.flavorSeed || 1) >>> 0) + 1);
    const o = opens[Math.floor(rng() * opens.length)];
    state.bardLine = o.id;
    state.bardShown = [o.id];
  },
  afterResolve(state) {
    state.bardLine = pickId(state, (state.bardShown || []).length + (state.cardsPlayedInAct || 0));
  },
};

// The shell's preCardBeat read: the dialogue script queued for this deal, or
// null (and never before a landmark — its set-piece IS the moment, the bard
// hushes). Pure; the shell consumes the line when the beat is dismissed.
export function bardBeat(run: RunState, ev: GameEvent) {
  if ((ev.tags || []).includes('landmark')) return null;
  const id = run.bardLine;
  if (!id || !BY_ID[id]) return null;
  const blocks = BY_ID[id].blocks;
  // The living hearth (I5): the beat plays in front of the fireside scene —
  // the fire, the seated ensemble (tonight's speaker mid-shift), the cup.
  return {
    blocks, cont: 'Go on —', cls: 'bard-beat',
    sceneHtml: hearthScene(run, blocks.map((b) => b.who)),
  };
}
