// BIG BREAK — central BALANCE knobs (spec §4.3): pure numeric tuning.
// The genre TAXONOMY (paths, winGates, stat/resource lists, stat metadata)
// lives in the pack manifest (js/packs/*-manifest.ts), split out in Phase 2.2
// so a second genre supplies its own. Content lives in js/data/*.

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
  // U1 (Rush): INCREDIBLE is an event, not a default. 75→82, and the
  // roll compresses above softCap so a maxed build still sweats jitter.
  // Rarer × bigger (see incrediblePayloadMult) ≈ same EV, more variance.
  tierIncredibleAt: 80,
  rollSoftCap: 90,         // roll above this is halved (soft diminishing)
  incrediblePayloadMult: 1.3, // positive stat/fame/money gains on Incredible
  burnoutCoeff: 0.4,       // penalty = -(burnout * coeff)
  jitterMin: -15,
  jitterMax: 15,
  // U1: jitter widens with the acts — late game keeps both tails alive.
  // Instrument/contract jitter overrides still win.
  jitterByAct: { 1: [-15, 15], 2: [-18, 18], 3: [-22, 22] },
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

  // Rush (design doc §4)
  flashpointChance: 0.25,  // U2: ~this share of runs contains a flashpoint
  flashpointWindow: [8, 22], // global card index where the window opens
  hotStreakAt: 3,          // U3: non-Bad tiers in a row to light ON A ROLL
  viralChance: 0.05,       // U4: 1-in-20 song releases go overnight viral
  viralPosBoost: 4,        // chart slots an overnight-viral debut jumps
  actTwistChance: 0.2,     // U5: once per run, an act plays ±2 cards
  actTwistDelta: 2,

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
  nearMissRatio: 0.83,
  momentumForUpgrade: 3,   // R4: gates are meaner, so the clutch is kinder

  // (winGates moved to the pack manifest — see js/packs/music-manifest.ts)

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
