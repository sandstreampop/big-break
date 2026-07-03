// Contracts: optional run modifiers signed at run start (pick at most one).
// Each bends the rules against you (or sideways) for a Legacy Point
// multiplier. Two are available from the first finished run; the rest are
// Career Wall unlocks.

export const CONTRACTS = [
  {
    id: 'nepo_baby', name: 'Nepo Baby', icon: '🍼', lpMult: 1.3,
    unlockedByDefault: true,
    desc: 'Start with $600 of family money. All Cred gains halved — everyone knows.',
    mods: { startMoney: 600, statGainMult: { cred: 0.5 } },
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
    mods: { fameGainMult: 0.5, statGainMult: { cred: 1.25 } },
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
    mods: { releaseDeadline: { stat: 'cred', statLabel: 'Cred', statLoss: 4, fameLoss: 8 } },
  },
  {
    id: 'kazoo_clause', name: 'The Kazoo Clause', icon: '🎺', lpMult: 2.0,
    unlockedByDefault: false,
    desc: 'The only instrument offered is the kazoo. Sign here. SIGN HERE.',
    mods: { forceInstrument: 'kazoo' },
  },

  // ---- Wave 2 ----
  {
    id: 'diy_or_die', name: 'DIY or Die', icon: '🩹', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'No middlemen, no merch firms, no easy money: money gains −40%, Cred gains +25%. The scene sees everything.',
    mods: { moneyGainMult: 0.6, statGainMult: { cred: 1.25 } },
  },
  {
    id: 'the_bet', name: 'The Bet', icon: '🎲', lpMult: 1.5,
    unlockedByDefault: false,
    desc: 'Walk in with $0 and wider luck ([-20,+20]). Somebody at the pawn shop said you couldn’t. Prove something.',
    mods: { startMoney: 0, jitter: [-20, 20] },
  },
  {
    id: 'grindset', name: 'The Grindset', icon: '🏃', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'Sleep is a competitor: Rest/Home choices roll −8. The hustle never blinks. Neither, apparently, do you.',
    mods: { rollTagBonus: [{ tags: ['rest', 'home'], bonus: -8 }] },
  },
  {
    id: 'stage_fright', name: 'Stage Fright', icon: '🫣', lpMult: 1.5,
    unlockedByDefault: false,
    desc: 'The lights, the eyes, the everything: Live choices roll −8. Build a career from the safe side of the glass.',
    mods: { rollTagBonus: [{ tags: ['live'], bonus: -8 }] },
  },
  {
    id: 'analog_only', name: 'Analog Only', icon: '📻', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'You deleted the accounts. All of them. Social choices roll −8; Cred gains +20%. The feed cannot hurt you now.',
    mods: { rollTagBonus: [{ tags: ['social'], bonus: -8 }], statGainMult: { cred: 1.2 } },
  },
  {
    id: 'opening_slot', name: 'Opening Slot Forever', icon: '🎟️', lpMult: 1.5,
    unlockedByDefault: false,
    desc: 'Contractually never the headliner: Fame gains −40%. The crowd is still filing in. Win them anyway.',
    mods: { fameGainMult: 0.6 },
  },
  {
    id: 'day_job', name: 'The Day Job', icon: '💼', lpMult: 1.3,
    unlockedByDefault: false,
    desc: 'Health insurance and a standing 9 a.m.: money gains +30%, Burnout gains +25%. The meeting could have been a song.',
    mods: { moneyGainMult: 1.3, burnoutGainMult: 1.25 },
  },
  {
    id: 'loan_shark', name: 'The Handshake Loan', icon: '🦈', lpMult: 1.5,
    unlockedByDefault: false,
    desc: 'Start with $500 from a man named Sal. The debt clause is active from card one. Sal is patient. Curtis is not.',
    mods: { startMoney: 500, startFlag: 'debt' },
  },
  {
    id: 'metronome', name: 'The Metronome', icon: '⏲️', lpMult: 1.4,
    unlockedByDefault: false,
    desc: 'No wild nights, no Encores, luck narrowed to [-8,+8]. Grind out a career on pure, joyless arithmetic.',
    mods: { jitter: [-8, 8], disableEncore: true },
  },
];

export function contractById(id) {
  return CONTRACTS.find((c) => c.id === id) || null;
}
