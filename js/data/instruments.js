// Instruments (spec §5). `modifiers` are applied to starting stats.
// `quirk.hooks` is a small typed system the engine understands:
//   rollTagBonus:   [{ tags:[...], bonus:N }]  extra roll on matching choices
//   jitter:         [min,max]                  overrides luck jitter
//   credGainMult:   N                          multiplies positive cred deltas
//   moneyGainMult:  N                          multiplies positive money deltas
//   fameSwingMult:  N                          multiplies fame deltas (both signs)
//   burnoutTagMult: { tags:[...], mult:N }     scales burnout gained on matching choices
//   onIncredible:   { fame:N, ... }            bonus effects when an Incredible fires
//   liveBurnout:    N                          flat burnout added on `live` choices

export const INSTRUMENTS = [
  {
    id: 'kazoo', name: 'Kazoo', family: 'wind',
    art: 'instrument_kazoo', unlockedByDefault: true,
    flavor: 'Technically a membranophone. Spiritually a cry for help.',
    modifiers: { creativity: 8, cred: -12 },
    quirk: {
      id: 'novelty', name: 'Novelty',
      desc: 'Incredible outcomes grant bonus Fame, but Cred gains are halved.',
      hooks: { onIncredible: { fame: 8 }, credGainMult: 0.5 },
    },
  },
  {
    id: 'melodica', name: 'Melodica', family: 'keys',
    art: 'instrument_melodica', unlockedByDefault: true,
    flavor: 'A piano you blow into. Smells faintly of every owner it ever had.',
    modifiers: { skill: 8, network: -6 },
    quirk: {
      id: 'busker', name: 'Busker',
      desc: 'Money gains are increased 20%.',
      hooks: { moneyGainMult: 1.2 },
    },
  },
  {
    id: 'bucket_drums', name: 'Bucket Drums', family: 'percussion',
    art: 'instrument_buckets', unlockedByDefault: true,
    flavor: 'Five-gallon, food-grade, unstoppable.',
    modifiers: { network: 8, skill: -6 },
    quirk: {
      id: 'street_energy', name: 'Street Energy',
      desc: 'Half Burnout gained from live choices.',
      hooks: { burnoutTagMult: { tags: ['live'], mult: 0.5 } },
    },
  },
  {
    id: 'cigarbox_guitar', name: 'Cigar-box Guitar', family: 'strings',
    art: 'instrument_cigarbox', unlockedByDefault: true,
    flavor: 'Three strings. All of them load-bearing.',
    modifiers: { cred: 8, creativity: -6 },
    quirk: {
      id: 'authentic', name: 'Authentic',
      desc: 'Blues/roots-tagged choices roll +10.',
      hooks: { rollTagBonus: [{ tags: ['blues', 'roots'], bonus: 10 }] },
    },
  },
  {
    id: 'toy_glockenspiel', name: 'Toy Glockenspiel', family: 'keys',
    art: 'instrument_glock', unlockedByDefault: true,
    flavor: 'Ages 3 and up. You are up.',
    modifiers: { creativity: 8, skill: -6 },
    quirk: {
      id: 'twee', name: 'Twee',
      desc: 'Indie-tagged choices roll +10; mainstream-tagged roll −5.',
      hooks: { rollTagBonus: [{ tags: ['indie'], bonus: 10 }, { tags: ['mainstream'], bonus: -5 }] },
    },
  },
  {
    id: 'theremin', name: 'Theremin', family: 'electronic',
    art: 'instrument_theremin', unlockedByDefault: true,
    flavor: 'You play the air. The air is winning.',
    modifiers: { creativity: 8, cred: -8 },
    quirk: {
      id: 'chaos', name: 'Chaos',
      desc: 'Luck swings wider ([-25,+25]) and Fame swings are amplified 25%.',
      hooks: { jitter: [-25, 25], fameSwingMult: 1.25 },
    },
  },

  // ---- Career Wall unlocks (spec §5 stretch pool) ----
  {
    id: 'electric_guitar', name: 'Electric Guitar', family: 'strings',
    art: 'instrument_electric', unlockedByDefault: false,
    flavor: 'An actual instrument. Feels like cheating.',
    modifiers: { skill: 6, cred: 6 },
    quirk: {
      id: 'plugged_in', name: 'Plugged In',
      desc: 'Live-tagged choices roll +8.',
      hooks: { rollTagBonus: [{ tags: ['live'], bonus: 8 }] },
    },
  },
  {
    id: 'sampler', name: 'Sampler / MPC', family: 'electronic',
    art: 'instrument_sampler', unlockedByDefault: false,
    flavor: 'Sixteen pads. Infinite lawsuits.',
    modifiers: { creativity: 6, network: 4 },
    quirk: {
      id: 'crate_digger', name: 'Crate Digger',
      desc: 'Studio/record-tagged choices roll +8.',
      hooks: { rollTagBonus: [{ tags: ['studio', 'record'], bonus: 8 }] },
    },
  },
  {
    id: 'modular_synth', name: 'Modular Synth', family: 'electronic',
    art: 'instrument_modular', unlockedByDefault: false,
    flavor: 'A wall of blinking cables. It has never made the same sound twice. Neither have you.',
    modifiers: { creativity: 8, skill: 4 },
    quirk: {
      id: 'patch_bay', name: 'Patch Bay',
      desc: 'Studio/Tone choices roll +8; Live choices roll −4 (it crashes. live. always).',
      hooks: { rollTagBonus: [{ tags: ['studio', 'tone'], bonus: 8 }, { tags: ['live'], bonus: -4 }] },
    },
  },
  {
    id: 'own_voice', name: 'Your Own Voice', family: 'voice',
    art: 'instrument_voice', unlockedByDefault: false,
    flavor: 'Free, portable, and everyone has an opinion about it.',
    modifiers: { network: 6, cred: 4 },
    quirk: {
      id: 'frontperson', name: 'Frontperson',
      desc: 'Vocal-tagged choices roll +10, but live choices add +2 Burnout (it lives in your throat).',
      hooks: { rollTagBonus: [{ tags: ['vocal'], bonus: 10 }], liveBurnout: 2 },
    },
  },
];

export function instrumentById(id) {
  return INSTRUMENTS.find((i) => i.id === id) || null;
}
