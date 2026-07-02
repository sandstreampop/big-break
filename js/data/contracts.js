// Contracts: optional run modifiers signed at run start (pick at most one).
// Each bends the rules against you (or sideways) for a Legacy Point
// multiplier. Two are available from the first finished run; the rest are
// Career Wall unlocks.

export const CONTRACTS = [
  {
    id: 'nepo_baby', name: 'Nepo Baby', icon: '🍼', lpMult: 1.3,
    unlockedByDefault: true,
    desc: 'Start with $600 of family money. All Cred gains halved — everyone knows.',
    mods: { startMoney: 600, credGainMult: 0.5 },
  },
  {
    id: 'straight_edge', name: 'Straight Edge', icon: '❌', lpMult: 1.5,
    unlockedByDefault: true,
    desc: 'No shortcuts: Burnout gains +30%, and Burnout relief is 30% weaker. Feel everything.',
    mods: { burnoutGainMult: 1.3, burnoutHealMult: 0.7 },
  },
  {
    id: 'one_take', name: 'One-Take Wonder', icon: '📼', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'No Encores. Luck swings wider ([-22,+22]). Tape is rolling. Tape is always rolling.',
    mods: { disableEncore: true, jitter: [-22, 22] },
  },
  {
    id: 'showman', name: 'The Showman’s Pact', icon: '🎪', lpMult: 1.5,
    unlockedByDefault: false,
    desc: 'No skipping performance minigames — ever. Botching one hurts double (−16). The show, contractually, must go on.',
    mods: { forceMinigames: true, mgBotchDouble: true },
  },
  {
    id: 'ghostwriter', name: 'The Ghostwriter Clause', icon: '👻', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'Your name appears nowhere. Fame gains halved; Cred gains +25%. The work is the signature.',
    mods: { fameGainMult: 0.5, credGainMult: 1.25 },
  },
  {
    id: 'imposter', name: 'Imposter Syndrome', icon: '🎭', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'The risk dots are hidden. You have no idea how any of this is going to go. Just like real life.',
    mods: { hideRisk: true },
  },
  {
    id: 'overnight', name: 'Overnight Success', icon: '⏱️', lpMult: 1.6,
    unlockedByDefault: false,
    desc: 'Shorter career: acts run 6/9/6 cards. Hit the same gates with eight fewer chances.',
    mods: { actLengths: { 1: 6, 2: 9, 3: 6 } },
  },
  {
    id: 'deadline', name: 'The Deadline', icon: '📠', lpMult: 1.6,
    unlockedByDefault: false,
    desc: 'A label single deal: ship a song to the chart EVERY act, or the silence costs you (−8 Fame, −4 Cred at the act break). Write fast. Release faster.',
    mods: { releaseDeadline: true },
  },
  {
    id: 'kazoo_clause', name: 'The Kazoo Clause', icon: '🎺', lpMult: 2.0,
    unlockedByDefault: false,
    desc: 'The only instrument offered is the kazoo. Sign here. SIGN HERE.',
    mods: { forceInstrument: 'kazoo' },
  },
];

export function contractById(id) {
  return CONTRACTS.find((c) => c.id === id) || null;
}
