// BIG BREAK — central tuning knobs (spec §4.3).
// Everything a balancer might touch lives here; content lives in js/data/*.

export const CONFIG = {
  // Run start
  statStartMin: 18,
  statStartMax: 28,
  burnoutStart: 0,
  moneyStart: 40,

  // Acts (spec §2): cards drawn per act
  actLengths: { 1: 8, 2: 12, 3: 8 },
  // 0-indexed slot within each act where a shop/opportunity card is forced
  // if one is eligible and none has appeared yet this act (spec §8.4.4)
  shopSlot: { 1: 2, 2: 4, 3: 2 },

  // Resolution (spec §4.1)
  tierBadBelow: 31,        // roll < this  -> Bad
  tierIncredibleAt: 73,    // roll >= this -> Incredible
  burnoutCoeff: 0.35,      // penalty = -(burnout * coeff)
  jitterMin: -15,
  jitterMax: 15,

  // Deck assembly (spec §8.4)
  pathWeightMult: 2.5,     // weight boost for events matching committed path

  // Equipment
  accessorySlots: 3,

  // Fail states (spec §7.3)
  burnoutFail: 100,
  credFailFromAct: 2,      // cred <= 0 fails only in act 2+
  debtFailMoney: -400,     // hard fail if money <= this AND 'debt' flag set

  // Finale evaluation (spec §7.1)
  // Success: every gate met. Partial: avg satisfaction >= partialRatio.
  // Momentum (pathProgress) upgrade: if every gate >= nearMissRatio and
  // momentum >= momentumForUpgrade, a Partial upgrades to Success.
  partialRatio: 0.72,
  nearMissRatio: 0.85,
  momentumForUpgrade: 4,

  winGates: {
    megastar:   { fame: 80, network: 60, cred: 30 },
    studio:     { skill: 75, cred: 60, network: 40 },
    hitfactory: { creativity: 75, cred: 50, hits: 3 },
  },

  // Legacy Points (spec §9)
  lpStatDivisor: 10,
  lpEndingBonus: { success: 50, partial: 20, failure: 5, failstate: 5 },
  lpFirstTimeMilestone: 15, // first time reaching each ending kind per path
};

export const PATHS = {
  megastar: {
    id: 'megastar',
    name: 'Megastar',
    blurb: 'Worldwide famous frontperson. Stadiums chant a name your mother didn’t give you.',
    gateLabel: 'Fame 80 · Network 60 · Cred 30',
    icon: '★',
  },
  studio: {
    id: 'studio',
    name: 'Studio Legend',
    blurb: 'The most-called session musician alive. Nobody knows your face. Everybody knows your take.',
    gateLabel: 'Skill 75 · Cred 60 · Network 40',
    icon: '♫',
  },
  hitfactory: {
    id: 'hitfactory',
    name: 'Hit Factory',
    blurb: 'The producer-songwriter behind everyone’s hits. Your name is in small print on big money.',
    gateLabel: 'Creativity 75 · Cred 50 · 3 Hits',
    icon: '✎',
  },
};

export const STAT_META = {
  skill:      { name: 'Skill',      icon: '🎸' },
  cred:       { name: 'Cred',       icon: '🤟' },
  creativity: { name: 'Creativity', icon: '💡' },
  network:    { name: 'Network',    icon: '📱' },
  burnout:    { name: 'Burnout',    icon: '🔥' },
};
