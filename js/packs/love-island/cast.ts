// Love Island — the Cast (named NPC Islanders) and the playable Types.
// Pack-owned data: the engine reads only Pack.loadouts/loadoutById; everything
// else (gender pools, bombshells, the Rival) is consumed by this pack's own
// plugins and presenter. Vocabulary per docs/games/love-island/CONTEXT.md.

// ---------- Playable Types (the engine's loadouts) ----------
// Gender is mechanical (ADR-0003): it sets the pool you couple from, your Casa
// side, and your chooser/chosen position at each Recoupling. It's chosen WITH
// the Type at Season start, so each Type ships as two selectable personas.
// `quirk.hooks` uses the engine's native keys (rollTagBonus, statGainMult,
// burnoutTagMult) plus pack-custom keys the OWNING plugins read off pctx.hooks
// (bondGainMult → coupling, followersOnDrama → profile) — the engine names none.

const TYPES = [
  {
    key: 'retriever', name: 'The Golden Retriever',
    flavor: 'Heart on sleeve. Sleeve already damp.',
    modifiers: { loyalty: 8, savvy: -6 },
    quirk: {
      id: 'devoted', name: 'Devoted',
      desc: 'Loyalty gains ×1.25 and Bond builds 30% faster. Feelings arrive early and unpack.',
      hooks: { statGainMult: { loyalty: 1.25 }, bondGainMult: 1.3 },
    },
  },
  {
    key: 'gameplayer', name: 'The Game-Player',
    flavor: 'Reads the room. Files the room. Wins the room later.',
    modifiers: { savvy: 8, loyalty: -6 },
    quirk: {
      id: 'ten_moves_ahead', name: 'Ten Moves Ahead',
      desc: 'Strategy and recoupling choices roll +10; drama puts half as much In Your Head.',
      hooks: {
        rollTagBonus: [{ tags: ['strategy', 'recoupling'], bonus: 10 }],
        burnoutTagMult: { tags: ['drama'], mult: 0.5 },
      },
    },
  },
  {
    key: 'influencer', name: 'The Influencer',
    flavor: 'Here for the right reasons. The right reasons follow her account.',
    modifiers: { charisma: 8, loyalty: -6 },
    quirk: {
      id: 'ring_light', name: 'Ring Light',
      desc: 'Drama and camera moments that land throw off +3 bonus Followers.',
      hooks: { followersOnDrama: { tags: ['drama', 'camera'], bonus: 3 } },
    },
  },
  {
    key: 'heartthrob', name: 'The Heartthrob',
    flavor: 'Everyone fancies them. Including, inconveniently, everyone.',
    modifiers: { rizz: 8, savvy: -6 },
    quirk: {
      id: 'head_turner', name: 'Head-Turner',
      desc: 'Flirt and date choices roll +10 — but drama lands 30% harder In Your Head, and Rivals smell blood.',
      hooks: {
        rollTagBonus: [{ tags: ['flirt', 'date'], bonus: 10 }],
        burnoutTagMult: { tags: ['drama'], mult: 1.3 },
        rivalMagnet: true, // coupling plugin: the Rival penalty bites at a friendlier floor
      },
    },
  },
];

// Two personas per Type — the gender pick IS the persona pick.
export const ISLANDER_TYPES = TYPES.flatMap((t) => (['girl', 'boy'] as const).map((gender) => ({
  id: `${t.key}_${gender}`,
  name: t.name,
  family: 'islander',
  gender,
  genderLabel: gender === 'girl' ? '♀ girl' : '♂ boy',
  art: `li_type_${t.key}`,
  unlockedByDefault: true,
  flavor: t.flavor,
  modifiers: t.modifiers,
  quirk: t.quirk,
})));

export function islanderTypeById(id: string) {
  return ISLANDER_TYPES.find((t) => t.id === id) || null;
}

// ---------- The Cast ----------
// Named NPC Islanders, each a recognizable Type. Your Partner draws from the
// opposite gender; your Rival from your own. Bombshells join mid-Season.
export interface CastMember {
  id: string;
  name: string;
  gender: 'girl' | 'boy';
  vibe: string;       // one-phrase identity, used by presenter flavor
  face: string;        // portrait glyph — the base of the mood-driven portrait
  bombshell?: boolean; // arrives mid-Season, not in the day-one pool
}

export const CAST: CastMember[] = [
  // day-one boys
  { id: 'kai', name: 'Kai', gender: 'boy', vibe: 'golden-retriever scaffolder', face: '🐶' },
  { id: 'tyler', name: 'Tyler', gender: 'boy', vibe: 'semi-pro winker', face: '😉' },
  { id: 'reece', name: 'Reece', gender: 'boy', vibe: 'protein-first romantic', face: '💪' },
  { id: 'dev', name: 'Dev', gender: 'boy', vibe: 'nicest man in any postcode', face: '🫶' },
  { id: 'marco', name: 'Marco', gender: 'boy', vibe: 'villain with a skincare routine', face: '🧴' },
  { id: 'jamal', name: 'Jamal', gender: 'boy', vibe: 'aspiring podcast', face: '🎙️' },
  // day-one girls
  { id: 'priya', name: 'Priya', gender: 'girl', vibe: 'girl-next-door, next door is Surrey', face: '🌷' },
  { id: 'chloe', name: 'Chloe', gender: 'girl', vibe: 'savage in gel nails', face: '💅' },
  { id: 'amber', name: 'Amber', gender: 'girl', vibe: 'main character, self-cast', face: '👑' },
  { id: 'sophia', name: 'Sophia', gender: 'girl', vibe: 'brand deal in human form', face: '🛍️' },
  { id: 'meg', name: 'Meg', gender: 'girl', vibe: 'funny on purpose, chaotic by accident', face: '🤸' },
  { id: 'tash', name: 'Tash', gender: 'girl', vibe: 'everyone’s type on paper', face: '📋' },
  // bombshells
  { id: 'luca', name: 'Luca', gender: 'boy', vibe: 'abs with a boat licence', face: '🛥️', bombshell: true },
  { id: 'ollie', name: 'Ollie', gender: 'boy', vibe: 'rugby lad, feelings pending', face: '🏉', bombshell: true },
  { id: 'bella', name: 'Bella', gender: 'girl', vibe: 'arrives mid-sentence, stays mid-drama', face: '🌪️', bombshell: true },
  { id: 'zara', name: 'Zara', gender: 'girl', vibe: 'model, knows your partner from home', face: '📸', bombshell: true },
];

export function castById(id: string | null | undefined): CastMember | null {
  return CAST.find((c) => c.id === id) || null;
}

// The pool you couple FROM (the opposite gender, hetero format for launch —
// ADR-0003). `bombshells` gates who is in the villa yet.
export function couplePool(state: any, { bombshells = false } = {}): CastMember[] {
  const want = state.gender === 'girl' ? 'boy' : 'girl';
  return CAST.filter((c) => c.gender === want && (bombshells || !c.bombshell || (state.flags || []).includes(`li_arrived_${c.id}`)));
}

// Same-gender pool — Rivals and code-mates come from here.
export function sameGenderPool(state: any): CastMember[] {
  return CAST.filter((c) => c.gender === state.gender && !c.bombshell);
}
