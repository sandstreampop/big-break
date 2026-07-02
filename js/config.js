// BIG BREAK — central tuning knobs (spec §4.3).
// Everything a balancer might touch lives here; content lives in js/data/*.

export const CONFIG = {
  // Run start
  statStartMin: 18,
  statStartMax: 28,
  burnoutStart: 0,
  moneyStart: 25,          // R4: broke means broke — Curtis is content

  // Acts (spec §2): cards drawn per act
  actLengths: { 1: 8, 2: 12, 3: 8 },
  // 0-indexed slot within each act where a shop/opportunity card is forced
  // if one is eligible and none has appeared yet this act (spec §8.4.4)
  shopSlot: { 1: 2, 2: 4, 3: 2 },

  // Resolution (spec §4.1)
  // roll = rollBase + aptitude*aptitudeScale + gear + quirks + pity
  //        - burnout*burnoutCoeff + jitter
  // rollBase is a competence floor so low starting stats read as "risky",
  // not "hopeless" — raw stats start ~20 and would otherwise map straight
  // into the Bad band.
  rollBase: 14,
  aptitudeScale: 0.8,
  tierBadBelow: 30,        // roll < this  -> Bad
  tierIncredibleAt: 75,    // roll >= this -> Incredible
  burnoutCoeff: 0.4,       // penalty = -(burnout * coeff)
  jitterMin: -15,
  jitterMax: 15,
  // Pity: each consecutive Bad adds a stacking roll bonus (bad-luck brake)
  pityPerBad: 6,
  pityCap: 18,
  // Encore: rolling an Incredible banks a token (cap below); the player can
  // arm one on a later card for a flat roll bonus — spend the hot streak
  // when it matters.
  encoreBonus: 18,
  encoreCap: 2,

  // Deck assembly (spec §8.4)
  pathWeightMult: 2.5,     // weight boost for events matching committed path

  // Story Seeds & novelty (Reach & Rush §2 R1–R2)
  seedCount: 2,            // hidden arcs each run roots for
  seedPayoffMult: 4,       // weight boost for a lit seeded arc's payoffs
  seedSetupMult: 4,        // weight boost for an unlit seeded arc's setups
  // 0-indexed card slot per act where an unlit seeded arc's setup card is
  // forced into the deal (if eligible) — the shop-slot mechanism, reused
  seedSetupSlot: { 1: 4, 2: 6 },
  noveltyWeightMult: 1.75, // weight boost for cards this player never saw
  seenCardsCap: 600,       // meta.seenCards ring-buffer cap

  // Equipment
  accessorySlots: 3,

  // Fail states (spec §7.3)
  burnoutFail: 100,
  credFailFromAct: 2,      // cred <= 0 fails only in act 2+
  debtFailMoney: -300,     // hard fail if money <= this AND 'debt' flag set

  // Finale evaluation (spec §7.1)
  // Success: every gate met. Partial: avg satisfaction >= partialRatio.
  // Momentum (pathProgress) upgrade: if every gate >= nearMissRatio and
  // momentum >= momentumForUpgrade, a Partial upgrades to Success.
  partialRatio: 0.72,
  nearMissRatio: 0.85,
  momentumForUpgrade: 3,   // R4: gates are meaner, so the clutch is kinder

  // R4 (can-lose pass): gates sit slightly above the old comfortable
  // ceiling so a cruisy run books a Partial, not an automatic Success —
  // the finale should be a judgment, not a formality.
  winGates: {
    megastar:   { fame: 101, network: 77, cred: 38 },
    studio:     { skill: 70, cred: 62, network: 49 },
    hitfactory: { creativity: 92, cred: 64, hits: 4 },
  },

  // Passive burnout per card resolved in each act — the grind wears you
  // down even when things go well, so rest stays a real decision.
  // R4: acts 2–3 wear harder; the coping interstitials and the fear
  // content behind high burnout are authored and deserve an audience.
  actWear: { 1: 0, 2: 2, 3: 3 },

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
    gateLabel: 'Fame 105 · Network 78 · Cred 38',
    icon: '★',
  },
  studio: {
    id: 'studio',
    name: 'Studio Legend',
    blurb: 'The most-called session musician alive. Nobody knows your face. Everybody knows your take.',
    gateLabel: 'Skill 74 · Cred 65 · Network 50',
    icon: '♫',
  },
  hitfactory: {
    id: 'hitfactory',
    name: 'Hit Factory',
    blurb: 'The producer-songwriter behind everyone’s hits. Your name is in small print on big money.',
    gateLabel: 'Creativity 92 · Cred 64 · 4 Hits',
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
