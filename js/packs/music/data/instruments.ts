// Instruments (spec §5). `modifiers` are applied to starting stats.
// `quirk.hooks` is a small typed system the engine understands:
//   rollTagBonus:   [{ tags:[...], bonus:N }]  extra roll on matching choices
//   jitter:         [min,max]                  overrides luck jitter
//   statGainMult:   {stat: N}                  multiplies positive gains of a stat
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
      hooks: { onIncredible: { fame: 8 }, statGainMult: { cred: 0.5 } },
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
    id: 'triangle', name: 'The Triangle', family: 'percussion',
    art: 'instrument_triangle', unlockedByDefault: false,
    flavor: 'One note. You have one note. It is, admittedly, a perfect note.',
    modifiers: { cred: 6, skill: 4 },
    quirk: {
      id: 'ding', name: 'Ding',
      desc: 'Safe choices roll +8 (precision is your whole thing); Risky choices roll −4.',
      hooks: { rollTagBonus: [{ tags: ['safe'], bonus: 8 }, { tags: ['risky'], bonus: -4 }] },
    },
  },
  {
    id: 'hurdy_gurdy', name: 'Hurdy-Gurdy', family: 'strings',
    art: 'instrument_hurdy', unlockedByDefault: false,
    flavor: 'A medieval drone machine with a crank. Airport security has QUESTIONS.',
    modifiers: { creativity: 8, network: -4 },
    quirk: {
      id: 'the_drone', name: 'The Drone',
      desc: 'Roots/Indie choices roll +8; Mainstream rolls −6. The crank waits for no trend.',
      hooks: { rollTagBonus: [{ tags: ['roots', 'indie'], bonus: 8 }, { tags: ['mainstream'], bonus: -6 }] },
    },
  },
  {
    id: 'workhorse', name: 'The ’59 Workhorse', family: 'strings',
    art: 'instrument_workhorse', unlockedByDefault: false,
    flavor: 'A guitar that has already played every room you’re scared of. It remembers the changes even when you don’t.',
    modifiers: { skill: 8, cred: 4 },
    quirk: {
      id: 'road_hands', name: 'Road Hands',
      desc: 'Every performance minigame plays +4 easier — the Workhorse has done this before. Live choices roll +4.',
      hooks: { mgBonus: 4, rollTagBonus: [{ tags: ['live'], bonus: 4 }] },
    },
  },
  {
    id: 'omnichord', name: 'Omnichord', family: 'electronic',
    art: 'instrument_omnichord', unlockedByDefault: false,
    flavor: 'A plastic harp from 1981 that sounds like a sunrise in an elevator. Strum plate included. Dignity sold separately.',
    modifiers: { creativity: 8, network: 2 },
    quirk: {
      id: 'strum_of_fate', name: 'Strum of Fate',
      desc: 'Indie/Electronic choices roll +7; Incredible outcomes grant +3 bonus Creativity (the sunrise chord).',
      hooks: { rollTagBonus: [{ tags: ['indie', 'electronic'], bonus: 7 }], onIncredible: { creativity: 3 } },
    },
  },
  {
    id: 'washboard', name: 'Washboard & Thimbles', family: 'percussion',
    art: 'instrument_washboard', unlockedByDefault: false,
    flavor: 'Laundry equipment, weaponized. Comes with a spoon holster you didn’t ask about.',
    modifiers: { cred: 6, network: 4 },
    quirk: {
      id: 'tip_magnet', name: 'Tip Magnet',
      desc: 'Roots/Busk choices roll +9 and money gains are increased 15%. People PAY for authenticity.',
      hooks: { rollTagBonus: [{ tags: ['roots', 'busk'], bonus: 9 }], moneyGainMult: 1.15 },
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
  {
    id: 'loop_station', name: 'Loop Station', family: 'electronic',
    art: 'instrument_loopstation', unlockedByDefault: false,
    flavor: 'One pedal, infinite yous. The band is you. The argument is also you.',
    modifiers: { creativity: 7, skill: 3 },
    quirk: {
      id: 'the_overdub', name: 'The Overdub',
      desc: 'Demos you tape are +8 quality and releases ship with +10 hype. Write-tagged choices roll +6. Songs made in layers stick.',
      hooks: { rollTagBonus: [{ tags: ['write'], bonus: 6 }], demoQuality: 8, releaseHype: 10 },
    },
  },

  // ---- Wave 3: four more junk-shop starters ----
  {
    id: 'spoons', name: 'Grandpa’s Spoons', family: 'percussion',
    art: 'instrument_spoons', unlockedByDefault: true,
    flavor: 'Two soup spoons and a lineage. Grandpa played these through a recession. So will you.',
    modifiers: { network: 8, creativity: -6 },
    quirk: {
      id: 'kitchen_rhythm', name: 'Kitchen Rhythm',
      desc: 'Roots/Family choices roll +9. Every kitchen is a venue if the wrists are honest.',
      hooks: { rollTagBonus: [{ tags: ['roots', 'family'], bonus: 9 }] },
    },
  },
  {
    id: 'recorder', name: 'Third-Grade Recorder', family: 'wind',
    art: 'instrument_recorder', unlockedByDefault: true,
    flavor: 'The beige one. It still smells like the pencil case. Every adult within earshot flinches on instinct.',
    modifiers: { skill: 8, cred: -8 },
    quirk: {
      id: 'muscle_memory', name: 'Muscle Memory',
      desc: 'Practice/Safe choices roll +9 — your hands learned this before fear existed.',
      hooks: { rollTagBonus: [{ tags: ['practice', 'safe'], bonus: 9 }] },
    },
  },
  {
    id: 'stylophone', name: 'Stylophone', family: 'electronic',
    art: 'instrument_stylophone', unlockedByDefault: true,
    flavor: 'A synthesizer the size of a sandwich, played with a pen. Sounds like a wasp with a dream.',
    modifiers: { creativity: 8, network: -6 },
    quirk: {
      id: 'pen_pal', name: 'Pen Pal',
      desc: 'Electronic/Home choices roll +8; Live rolls −3 (the pen strap snapped in 2011).',
      hooks: { rollTagBonus: [{ tags: ['electronic', 'home'], bonus: 8 }, { tags: ['live'], bonus: -3 }] },
    },
  },
  {
    id: 'washtub', name: 'Washtub Bass', family: 'strings',
    art: 'instrument_washtub', unlockedByDefault: true,
    flavor: 'One string, one broomstick, one galvanized tub. The low end of the people.',
    modifiers: { cred: 8, skill: -6 },
    quirk: {
      id: 'the_thump', name: 'The Thump',
      desc: 'Live/Roots choices roll +7 and money gains are increased 10%. Crowds trust a tub.',
      hooks: { rollTagBonus: [{ tags: ['live', 'roots'], bonus: 7 }], moneyGainMult: 1.1 },
    },
  },

  // ---- Wave 3: Career Wall unlocks ----
  {
    id: 'accordion', name: 'The Estate-Sale Accordion', family: 'keys',
    art: 'instrument_accordion', unlockedByDefault: false,
    flavor: 'Came with a box of sheet music and one letter you have chosen not to read yet.',
    modifiers: { cred: 6, creativity: 4 },
    quirk: {
      id: 'the_bellows', name: 'The Bellows',
      desc: 'Roots/Busk choices roll +8; Mainstream rolls −4. The old country does not chart. It endures.',
      hooks: { rollTagBonus: [{ tags: ['roots', 'busk'], bonus: 8 }, { tags: ['mainstream'], bonus: -4 }] },
    },
  },
  {
    id: 'banjo', name: 'Porch Banjo', family: 'strings',
    art: 'instrument_banjo', unlockedByDefault: false,
    flavor: 'Sun-bleached, porch-tuned, incapable of irony. Every song it touches becomes 20% more honest.',
    modifiers: { cred: 6, skill: 4 },
    quirk: {
      id: 'front_porch', name: 'Front Porch',
      desc: 'Roots/Write choices roll +8. Songs written on a porch arrive pre-broken-in.',
      hooks: { rollTagBonus: [{ tags: ['roots', 'write'], bonus: 8 }] },
    },
  },
  {
    id: 'saxophone', name: 'Pawn-Shop Saxophone', family: 'wind',
    art: 'instrument_sax', unlockedByDefault: false,
    flavor: 'Dented in a way that suggests a story the pawnbroker refused to tell. Plays like it misses someone.',
    modifiers: { skill: 6, cred: 6 },
    quirk: {
      id: 'the_wail', name: 'The Wail',
      desc: 'Live/Tone choices roll +8, but live choices add +1 Burnout — it takes lungs.',
      hooks: { rollTagBonus: [{ tags: ['live', 'tone'], bonus: 8 }], liveBurnout: 1 },
    },
  },
  {
    id: 'talkbox', name: 'The Talkbox', family: 'electronic',
    art: 'instrument_talkbox', unlockedByDefault: false,
    flavor: 'A tube, an amp, and your own skull as a speaker cabinet. Dentists hate this one trick.',
    modifiers: { creativity: 6, network: 4 },
    quirk: {
      id: 'mouth_full_of_future', name: 'Mouth Full of Future',
      desc: 'Vocal/Mainstream choices roll +8. Incredible outcomes grant +4 bonus Fame (nobody forgets the tube).',
      hooks: { rollTagBonus: [{ tags: ['vocal', 'mainstream'], bonus: 8 }], onIncredible: { fame: 4 } },
    },
  },
  {
    id: 'gig_harp', name: 'The Gig Harp', family: 'strings',
    art: 'instrument_harp', unlockedByDefault: false,
    flavor: 'Yes, it fits in the van. Barely. The van now has a favorite child.',
    modifiers: { skill: 6, creativity: 6 },
    quirk: {
      id: 'forty_seven_strings', name: 'Forty-Seven Strings',
      desc: 'Studio/Tone choices roll +9; Tour rolls −5 (the load-in is a saga).',
      hooks: { rollTagBonus: [{ tags: ['studio', 'tone'], bonus: 9 }, { tags: ['tour'], bonus: -5 }] },
    },
  },
  {
    id: 'haunted_808', name: '808 (Haunted)', family: 'electronic',
    art: 'instrument_808', unlockedByDefault: false,
    flavor: 'Previous owner vanished at the peak of a regional scene. The kick drum knows things.',
    modifiers: { creativity: 8, cred: 2 },
    quirk: {
      id: 'the_knock', name: 'The Knock',
      desc: 'Write/Electronic choices roll +8. Demos you tape are +6 quality — the ghost punches in overnight.',
      hooks: { rollTagBonus: [{ tags: ['write', 'electronic'], bonus: 8 }], demoQuality: 6 },
    },
  },
  {
    id: 'upright_susan', name: 'Upright Bass Named Susan', family: 'strings',
    art: 'instrument_susan', unlockedByDefault: false,
    flavor: 'Susan has played on 400 records and outlived three owners. You do not play Susan. You accompany her.',
    modifiers: { skill: 8, network: 2 },
    quirk: {
      id: 'susan_knows', name: 'Susan Knows',
      desc: 'Studio/Roots choices roll +8 and performance minigames play +2 easier. Susan has done this before.',
      hooks: { rollTagBonus: [{ tags: ['studio', 'roots'], bonus: 8 }], mgBonus: 2 },
    },
  },
  {
    id: 'bagpipes', name: 'The Bagpipes', family: 'wind',
    art: 'instrument_bagpipes', unlockedByDefault: false,
    flavor: 'There is no volume knob. There is no off switch. There is only the drone, and the neighborhood’s new opinion of you.',
    modifiers: { cred: 6, network: 4 },
    quirk: {
      id: 'weapon_of_attention', name: 'Weapon of Attention',
      desc: 'Busk choices roll +10 and Fame swings are amplified 25%. Nobody has ever half-noticed a bagpipe.',
      hooks: { rollTagBonus: [{ tags: ['busk'], bonus: 10 }], fameSwingMult: 1.25 },
    },
  },
  {
    id: 'steel_pan', name: 'Steel Pan', family: 'percussion',
    art: 'instrument_steelpan', unlockedByDefault: false,
    flavor: 'Hammered out of a barrel into pure sunshine. Weather-proof, mood-proof, landlord-resistant.',
    modifiers: { network: 6, skill: 4 },
    quirk: {
      id: 'carnival_logic', name: 'Carnival Logic',
      desc: 'Live/Busk choices roll +8 and money gains are increased 10%. Joy tips well.',
      hooks: { rollTagBonus: [{ tags: ['live', 'busk'], bonus: 8 }], moneyGainMult: 1.1 },
    },
  },
  {
    id: 'mellotron', name: 'Mellotron (Two Keys Stick)', family: 'keys',
    art: 'instrument_mellotron', unlockedByDefault: false,
    flavor: 'Every key plays a tape of an orchestra that disbanded in 1967. F# is a choir. G is regret.',
    modifiers: { creativity: 8, skill: 2 },
    quirk: {
      id: 'tape_choir', name: 'Tape Choir',
      desc: 'Studio/Tone choices roll +9, demos are +6 quality; Live rolls −5 (the tapes hate humidity).',
      hooks: { rollTagBonus: [{ tags: ['studio', 'tone'], bonus: 9 }, { tags: ['live'], bonus: -5 }], demoQuality: 6 },
    },
  },
  {
    id: 'autoharp', name: 'Grandmother’s Autoharp', family: 'strings',
    art: 'instrument_autoharp', unlockedByDefault: false,
    flavor: 'Thirty-six strings and a row of chord bars worn smooth by somebody who sang every Sunday. It remembers the altos.',
    modifiers: { cred: 6, creativity: 4 },
    quirk: {
      id: 'sunday_chords', name: 'Sunday Chords',
      desc: 'Write/Family/Roots choices roll +7; Incredible outcomes grant +3 bonus Cred (the congregation approves).',
      hooks: { rollTagBonus: [{ tags: ['write', 'family', 'roots'], bonus: 7 }], onIncredible: { cred: 3 } },
    },
  },
  {
    id: 'the_laptop', name: 'The Laptop (Stickers Load-Bearing)', family: 'electronic',
    art: 'instrument_laptop', unlockedByDefault: false,
    flavor: 'A decade of sessions, one coffee incident, and a fan that screams in B♭. The whole studio, if the studio were dying.',
    modifiers: { creativity: 6, network: 4 },
    quirk: {
      id: 'bounce_to_disk', name: 'Bounce to Disk',
      desc: 'Record/Write choices roll +7 and releases ship with +8 hype; Live rolls −3 (it sleeps mid-set).',
      hooks: { rollTagBonus: [{ tags: ['record', 'write'], bonus: 7 }, { tags: ['live'], bonus: -3 }], releaseHype: 8 },
    },
  },
];

export function instrumentById(id) {
  return INSTRUMENTS.find((i) => i.id === id) || null;
}
