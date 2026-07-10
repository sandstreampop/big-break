// The Odyssey — the sea's shared card factory + effect budgets (slice 4).
// One tuning table for the whole deck: every door is one of the three
// approaches (fight it, trick it, know the rite against it) at one of two
// stakes (plain, or `risky` — the cards that court the deep). The WORDS are
// bespoke per card (events-act*.ts); the NUMBERS live here so the balance
// band is tuned in one place and the golden diff of a retune reads clean.

import type { GameEvent, Effect } from '../../types.js';

export type Approach = 'might' | 'guile' | 'lore';
type Tier = 'bad' | 'good' | 'incredible';

// The tuned budgets (carried over from the green skeleton, band 35–50):
const BUDGETS: Record<'plain' | 'risky', Record<Approach, Record<Tier, Effect>>> = {
  plain: {
    might: {
      bad: { might: -2, expedition: -1, burnout: 3 },
      good: { might: 4, burnout: 1 },
      incredible: { might: 6, renown: 1 },
    },
    guile: {
      bad: { guile: -1, expedition: -1, burnout: 2 },
      good: { guile: 4, burnout: -1 },
      incredible: { guile: 7, renown: 1, burnout: -2 },
    },
    lore: {
      bad: { lore: -1, poseidon: 1, burnout: 3 },
      good: { lore: 4, athena: 1, burnout: -2 },
      incredible: { lore: 6, athena: 2, burnout: -3 },
    },
  },
  risky: {
    might: {
      bad: { might: -2, expedition: -2, poseidon: 1, burnout: 4 },
      good: { might: 5, renown: 1, burnout: 1 },
      incredible: { might: 6, renown: 2 },
    },
    guile: {
      bad: { guile: -2, expedition: -2, burnout: 4 },
      good: { guile: 5, renown: 1 },
      incredible: { guile: 6, renown: 2 },
    },
    lore: {
      bad: { lore: -2, poseidon: 1, expedition: -1, burnout: 3 },
      good: { lore: 5, athena: 1, renown: 1 },
      incredible: { lore: 6, athena: 2, renown: 1 },
    },
  },
};

export interface SeaSide {
  label: string;
  approach: Approach;
  risky?: boolean;
  bad: string;
  good: string;
  incredible: string;
  // A side may add effects ON TOP of its budget (a card's bespoke sting —
  // e.g. Maron's wine, Elpenor's foreshadowing flag). Merged additively.
  extra?: Partial<Record<Tier, Effect>>;
}

function side(s: SeaSide) {
  const budget = BUDGETS[s.risky ? 'risky' : 'plain'][s.approach];
  const merge = (t: Tier): Effect => {
    const out: Record<string, unknown> = { ...budget[t] };
    for (const [k, v] of Object.entries(s.extra?.[t] ?? {})) {
      out[k] = typeof v === 'number' && typeof out[k] === 'number' ? (out[k] as number) + v : v;
    }
    return out as Effect;
  };
  return {
    label: s.label,
    tags: ['sea', s.approach],
    governingStats: { [s.approach]: 1 },
    outcomes: {
      bad: { text: s.bad, effects: merge('bad') },
      good: { text: s.good, effects: merge('good') },
      incredible: { text: s.incredible, effects: merge('incredible') },
    },
  };
}

export function sea(id: string, act: number | number[], opts: {
  tags?: string[];
  prompt: string; recap: string;
  left: SeaSide; right: SeaSide;
}): GameEvent {
  return {
    id,
    act,
    tags: opts.tags,
    prompt: opts.prompt,
    recap: opts.recap,
    choices: { left: side(opts.left), right: side(opts.right) },
  };
}
