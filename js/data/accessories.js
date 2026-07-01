// Accessories (spec §6). Engine-understood fields:
//   compatibility: { universal:true } | { families:[...] }  — mismatched
//     items equip but are INERT (comedy + a reason to swap instruments).
//   appliesTo: [tags]  + modifier: N     roll bonus on matching choices
//   counterTags: [{ tags:[...], modifier:N }]   e.g. amp hurts studio takes
//   sideEffect: { burnoutPerMatch:N }    burnout each time it applies
//   burnoutTagMult: { tags:[...], mult:N }  scales burnout on matching choices
//   moneySiphon: 0.1                     cut of positive money outcomes
//   loseOnBad: true                      lost when it applied and the roll went Bad
//   onAcquire: effects payload           fired once when equipped

export const ACCESSORIES = [
  {
    id: 'loud_amp', name: 'Loud Amp', art: 'gear_amp', unlockedByDefault: true,
    flavor: 'Goes to 10. Knows no other number.',
    compatibility: { families: ['strings', 'electronic'] },
    appliesTo: ['live'], modifier: 12,
    counterTags: [{ tags: ['studio'], modifier: -4 }],
    sideEffect: { burnoutPerMatch: 2 },
    blurb: 'Live +12 · Studio −4 · +2 Burnout per use',
  },
  {
    id: 'loop_pedal', name: 'Loop Pedal', art: 'gear_loop', unlockedByDefault: true,
    flavor: 'You, but four of you, slightly out of time.',
    compatibility: { universal: true },
    appliesTo: ['solo', 'busk'], modifier: 10,
    grantsFlag: 'has_loop_pedal', // unlocks one-person-band events
    blurb: 'Solo/Busk +10 · unlocks one-person-band opportunities',
  },
  {
    id: 'pedalboard', name: 'Boutique Pedalboard', art: 'gear_pedalboard', unlockedByDefault: true,
    flavor: 'Worth more than the van it rides in.',
    compatibility: { families: ['strings', 'electronic'] },
    appliesTo: ['studio', 'tone'], modifier: 10,
    upkeep: 15, // money per act, paid at act start
    blurb: 'Studio/Tone +10 · $15 upkeep per act',
  },
  {
    id: 'lucky_pick', name: 'Lucky Pick', art: 'gear_pick', unlockedByDefault: true,
    flavor: 'Found in a couch at a venue that no longer exists.',
    compatibility: { families: ['strings'] },
    appliesTo: ['*'], modifier: 4, // '*' = every choice (strings only, via compat)
    loseOnBad: true,
    blurb: 'All rolls +4 (strings only) · lost on a Bad outcome',
  },
  {
    id: 'in_ears', name: 'In-Ear Monitors', art: 'gear_inears', unlockedByDefault: true,
    flavor: 'Silence, then the click, then your whole life.',
    compatibility: { universal: true },
    appliesTo: [], modifier: 0,
    burnoutTagMult: { tags: ['tour', 'live'], mult: 0.5 },
    blurb: 'Half Burnout gained from Tour/Live choices',
  },
  {
    id: 'vintage_mic', name: 'Vintage Mic', art: 'gear_mic', unlockedByDefault: true,
    flavor: 'It has recorded better people than you. It says so, warmly.',
    compatibility: { families: ['voice', 'keys'] },
    appliesTo: ['record', 'vocal'], modifier: 12,
    blurb: 'Record/Vocal +12 (voice & keys only)',
  },
  {
    id: 'energy_drink', name: 'Energy Drink Sponsorship', art: 'gear_energy', unlockedByDefault: true,
    flavor: 'GRIND™: Taste The Hustle. You are contractually psyched.',
    compatibility: { universal: true },
    appliesTo: [], modifier: 0,
    onAcquire: { burnout: -20, cred: -8, addFlag: 'debt' },
    blurb: '−20 Burnout now · −8 Cred · you now owe GRIND™ a debt',
  },
  {
    id: 'managers_card', name: "Manager's Card", art: 'gear_manager', unlockedByDefault: true,
    flavor: 'It just says DARIO and a QR code. The QR code is a Venmo.',
    compatibility: { universal: true },
    appliesTo: ['deal', 'network'], modifier: 10,
    moneySiphon: 0.1,
    blurb: 'Deal/Network +10 · Dario takes 10% of your money gains',
  },

  // ---- Career Wall unlocks ----
  {
    id: 'tour_van', name: 'Tour Van (Runs)', art: 'gear_van', unlockedByDefault: false,
    flavor: '240,000 miles. The check-engine light is load-bearing.',
    compatibility: { universal: true },
    appliesTo: ['tour', 'live'], modifier: 6,
    burnoutTagMult: { tags: ['tour'], mult: 0.6 },
    blurb: 'Tour/Live +6 · less Tour burnout',
  },
  {
    id: 'ring_light', name: 'Ring Light', art: 'gear_ringlight', unlockedByDefault: false,
    flavor: 'You now have a good side. It cost $34.99.',
    compatibility: { universal: true },
    appliesTo: ['social', 'fame'], modifier: 10,
    blurb: 'Social/Fame choices +10',
  },
  {
    id: 'session_rolodex', name: 'Session Rolodex', art: 'gear_rolodex', unlockedByDefault: false,
    flavor: 'Physical. Alphabetized. Feared.',
    compatibility: { universal: true },
    appliesTo: ['network', 'deal', 'studio'], modifier: 8,
    blurb: 'Network/Deal/Studio +8',
  },
];

export function accessoryById(id) {
  return ACCESSORIES.find((a) => a.id === id) || null;
}
