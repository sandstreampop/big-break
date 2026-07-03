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
    id: 'four_track', name: 'Thrift-Store Four-Track', art: 'gear_fourtrack', unlockedByDefault: true,
    flavor: 'Someone recorded a divorce on this. It adds warmth.',
    compatibility: { universal: true },
    appliesTo: ['record', 'write'], modifier: 6,
    demoQuality: 6,
    blurb: 'Record/Write +6 · demos you tape are +6 quality (tape warmth is real)',
  },
  {
    id: 'publicist_rolodex', name: 'The Publicist’s Rolodex', art: 'gear_rolodex', unlockedByDefault: true,
    flavor: 'A retired publicist’s actual rolodex. Half the cards just say “owes me.”',
    compatibility: { universal: true },
    appliesTo: ['social', 'deal'], modifier: 6,
    releaseHype: 8,
    blurb: 'Social/Deal +6 · releases ship with +8 hype (the cards remember)',
  },
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

  {
    id: 'cursed_8track', name: 'Cursed 8-Track', art: 'gear_8track', unlockedByDefault: true,
    flavor: 'Recorded over something in 1974. It remembers.',
    compatibility: { universal: true },
    appliesTo: ['studio', 'tone'], modifier: 9,
    counterTags: [{ tags: ['live'], modifier: -3 }],
    blurb: 'Studio/Tone +9 · Live −3 (it whispers on stage)',
  },
  {
    id: 'merch_cannon', name: 'T-Shirt Cannon', art: 'gear_cannon', unlockedByDefault: true,
    flavor: 'Air-powered generosity. Aim above the waist.',
    compatibility: { universal: true },
    appliesTo: ['live', 'fame'], modifier: 8,
    sideEffect: { burnoutPerMatch: 1 },
    blurb: 'Live/Fame +8 · +1 Burnout per use (cardio)',
  },
  {
    id: 'field_recorder', name: 'Field Recorder', art: 'gear_recorder', unlockedByDefault: true,
    flavor: 'Everything is a sample if you believe in yourself.',
    compatibility: { universal: true },
    appliesTo: ['record', 'write'], modifier: 8,
    blurb: 'Record/Write +8',
  },
  {
    id: 'stage_fan', name: 'Clip-On Stage Fan', art: 'gear_fan', unlockedByDefault: true,
    flavor: 'The wind machine of the people.',
    compatibility: { universal: true },
    appliesTo: ['fame', 'mainstream'], modifier: 7,
    blurb: 'Fame/Mainstream +7 · hair: cinematic',
  },
  {
    id: 'humidifier', name: 'Tour Humidifier', art: 'gear_humidifier', unlockedByDefault: true,
    flavor: 'For the voice. Also, honestly, for the vibes.',
    compatibility: { families: ['voice', 'wind'] },
    appliesTo: ['vocal', 'live'], modifier: 9,
    blurb: 'Vocal/Live +9 (voice & wind only)',
  },
  {
    id: 'setlist_binder', name: 'Setlist Binder', art: 'gear_binder', unlockedByDefault: true,
    flavor: 'Laminated. Tabbed. Feared by chaos.',
    compatibility: { universal: true },
    appliesTo: ['safe'], modifier: 7,
    blurb: 'Safe choices +7 · preparation is a genre',
  },
  {
    id: 'cowbell', name: 'Cowbell', art: 'gear_cowbell', unlockedByDefault: true,
    flavor: 'The prescription is known. The dosage is infinite.',
    compatibility: { universal: true },
    appliesTo: ['live'], modifier: 6,
    sideEffect: { burnoutPerMatch: 1 },
    blurb: 'Live +6 · +1 Burnout per use (you cannot stop)',
  },
  {
    id: 'van_bunk', name: 'Van Bunk Conversion', art: 'gear_bunk', unlockedByDefault: true,
    flavor: 'A plywood shelf and a dream of lumbar support.',
    compatibility: { universal: true },
    appliesTo: ['tour'], modifier: 6,
    burnoutTagMult: { tags: ['tour'], mult: 0.7 },
    blurb: 'Tour +6 · less Tour burnout (sleep is gear)',
  },
  {
    id: 'fog_machine', name: 'Fog Machine (Craigslist)', art: 'gear_fog', unlockedByDefault: true,
    flavor: 'Previous owner: a haunted house. It remembers October.',
    compatibility: { universal: true },
    appliesTo: ['live', 'fame'], modifier: 9,
    counterTags: [{ tags: ['studio'], modifier: -3 }],
    sideEffect: { burnoutPerMatch: 1 },
    blurb: 'Live/Fame +9 · Studio −3 · +1 Burnout per use (the fumes)',
  },
  {
    id: 'lucky_cable', name: 'The One Good Cable', art: 'gear_cable', unlockedByDefault: true,
    flavor: 'Every musician owns exactly one. Guard it with your life.',
    compatibility: { universal: true },
    appliesTo: ['studio', 'live'], modifier: 5,
    loseOnBad: true,
    blurb: 'Studio/Live +5 · lost on a Bad outcome (someone “borrows” it)',
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

  // ---- Wave 3 ----
  {
    id: 'gaff_tape', name: 'Industrial Gaffer Tape', art: 'gear_gafftape', unlockedByDefault: true,
    flavor: 'Holds down cables, setlists, and the entire concept of live music.',
    compatibility: { universal: true },
    appliesTo: ['live', 'tour'], modifier: 6,
    blurb: 'Live/Tour +6 · fixes everything except the band',
  },
  {
    id: 'musician_earplugs', name: 'Musician’s Earplugs', art: 'gear_earplugs', unlockedByDefault: true,
    flavor: 'The molded kind. Your future self already sent a thank-you note.',
    compatibility: { universal: true },
    appliesTo: [], modifier: 0,
    burnoutTagMult: { tags: ['live', 'practice'], mult: 0.7 },
    blurb: 'Less Burnout from Live/Practice choices (hearing is a career plan)',
  },
  {
    id: 'tip_qr', name: 'Tip-Jar QR Stand', art: 'gear_qr', unlockedByDefault: true,
    flavor: 'Nobody carries cash. Everybody carries guilt. Monetize the second thing.',
    compatibility: { universal: true },
    appliesTo: ['busk', 'solo'], modifier: 8,
    blurb: 'Busk/Solo +8 · contactless gratitude',
  },
  {
    id: 'pocket_metronome', name: 'Pocket Metronome', art: 'gear_metronome', unlockedByDefault: true,
    flavor: 'Tick. Tock. The truth, at any tempo you can’t argue with.',
    compatibility: { universal: true },
    appliesTo: ['practice', 'safe'], modifier: 7,
    blurb: 'Practice/Safe +7 · the click forgives no one',
  },
  {
    id: 'stage_cape', name: 'The Stage Cape', art: 'gear_cape', unlockedByDefault: true,
    flavor: 'Floor-length, wine-dark, machine washable. You are a different person in the cape. That’s the point.',
    compatibility: { universal: true },
    appliesTo: ['fame', 'mainstream'], modifier: 9,
    counterTags: [{ tags: ['indie'], modifier: -3 }],
    blurb: 'Fame/Mainstream +9 · Indie −3 (the basement distrusts capes)',
  },
  {
    id: 'wireless_rig', name: 'Wireless Rig', art: 'gear_wireless', unlockedByDefault: true,
    flavor: 'Roam the crowd. Climb the bar. Regret nothing until the battery dies.',
    compatibility: { families: ['strings', 'electronic', 'voice'] },
    appliesTo: ['live'], modifier: 10,
    sideEffect: { burnoutPerMatch: 1 },
    blurb: 'Live +10 · +1 Burnout per use (you WILL climb something)',
  },
  {
    id: 'rice_cooker', name: 'Tour Rice Cooker', art: 'gear_ricecooker', unlockedByDefault: true,
    flavor: 'One appliance between you and a fourth consecutive gas-station dinner. The green room smells like home now.',
    compatibility: { universal: true },
    appliesTo: ['tour'], modifier: 5,
    burnoutTagMult: { tags: ['tour'], mult: 0.75 },
    blurb: 'Tour +5 · less Tour burnout (hot food is morale)',
  },
  {
    id: 'contact_mic', name: 'Contact Mic', art: 'gear_contactmic', unlockedByDefault: true,
    flavor: 'Tapes to anything. Everything has a voice now. The radiator is in the band.',
    compatibility: { families: ['electronic', 'percussion'] },
    appliesTo: ['record', 'tone'], modifier: 9,
    blurb: 'Record/Tone +9 (electronic & percussion only)',
  },
  {
    id: 'thermos', name: 'The Big Thermos', art: 'gear_thermos', unlockedByDefault: true,
    flavor: 'Forty ounces of whatever keeps the songs coming. The lid is also a cup, which feels like abundance.',
    compatibility: { universal: true },
    appliesTo: ['write', 'practice'], modifier: 6,
    blurb: 'Write/Practice +6 · steam rising off the work',
  },
  {
    id: 'press_pass', name: 'Laminated Press Pass (Expired)', art: 'gear_presspass', unlockedByDefault: true,
    flavor: 'From a festival that no longer exists. Worn with confidence, it opens doors. Worn with panic, it opens conversations with security.',
    compatibility: { universal: true },
    appliesTo: ['social', 'network'], modifier: 7,
    loseOnBad: true,
    blurb: 'Social/Network +7 · lost on a Bad outcome (security finally reads it)',
  },
  {
    id: 'union_card', name: 'Union Card', art: 'gear_unioncard', unlockedByDefault: true,
    flavor: 'Local 47. Dues hurt monthly; scale heals forever.',
    compatibility: { universal: true },
    appliesTo: ['deal', 'studio'], modifier: 8,
    upkeep: 12,
    blurb: 'Deal/Studio +8 · $12 dues per act',
  },
  {
    id: 'mascot_head', name: 'The Mascot Head', art: 'gear_mascot', unlockedByDefault: true,
    flavor: 'A raccoon, probably. Found backstage at a minor-league stadium. Wearing it is a decision the crowd respects.',
    compatibility: { universal: true },
    appliesTo: ['fame', 'social'], modifier: 8,
    sideEffect: { burnoutPerMatch: 1 },
    blurb: 'Fame/Social +8 · +1 Burnout per use (it is 100 degrees in the raccoon)',
  },
  {
    id: 'demo_trunk', name: 'Trunk of Demo CDs', art: 'gear_demotrunk', unlockedByDefault: true,
    flavor: 'Two hundred jewel cases, hand-Sharpied. Physical media as a contact sport.',
    compatibility: { universal: true },
    appliesTo: ['network', 'busk'], modifier: 6,
    releaseHype: 4,
    blurb: 'Network/Busk +6 · releases ship with +4 hype (the trunk empties somewhere)',
  },
  {
    id: 'lucky_socks', name: 'The Lucky Socks', art: 'gear_socks', unlockedByDefault: true,
    flavor: 'Unwashed since the good show. The band has voted on this. The vote failed.',
    compatibility: { universal: true },
    appliesTo: ['*'], modifier: 3,
    loseOnBad: true,
    blurb: 'All rolls +3 · lost on a Bad outcome (someone finally does laundry)',
  },
  {
    id: 'pedal_tuner', name: 'Stage Tuner Pedal', art: 'gear_tuner', unlockedByDefault: true,
    flavor: 'Mutes, tunes, forgives. The difference between “raw” and “out of tune” is this box.',
    compatibility: { families: ['strings'] },
    appliesTo: ['live', 'safe'], modifier: 7,
    blurb: 'Live/Safe +7 (strings only) · in tune, on purpose',
  },
  {
    id: 'shoebox_archive', name: 'The Shoebox Archive', art: 'gear_shoebox', unlockedByDefault: true,
    flavor: 'Every voice memo since the beginning, on paper, somehow. Ideas go in. Better ideas come out.',
    compatibility: { universal: true },
    appliesTo: ['write'], modifier: 7,
    demoQuality: 5,
    blurb: 'Write +7 · demos you tape are +5 quality (the box remembers)',
  },
  {
    id: 'merch_suitcase', name: 'Merch Suitcase (Hard Shell)', art: 'gear_suitcase', unlockedByDefault: true,
    flavor: 'Shirts, pins, one hat nobody buys. Rolls through any airport like a tiny corporation.',
    compatibility: { universal: true },
    appliesTo: ['tour', 'network'], modifier: 6,
    blurb: 'Tour/Network +6 · commerce travels with you',
  },
  {
    id: 'green_room_kit', name: 'Green-Room Survival Kit', art: 'gear_greenkit', unlockedByDefault: true,
    flavor: 'Throat spray, earplugs, a granola bar from an unknown decade, and a phone charger that fits everything.',
    compatibility: { universal: true },
    appliesTo: [], modifier: 0,
    burnoutTagMult: { tags: ['live', 'fame'], mult: 0.75 },
    blurb: 'Less Burnout from Live/Fame choices (someone finally packed)',
  },
  {
    id: 'projector', name: 'Thrift-Store Projector', art: 'gear_projector', unlockedByDefault: true,
    flavor: 'Casts public-domain nature films behind every set. You are now “multimedia.” Ticket prices agree.',
    compatibility: { universal: true },
    appliesTo: ['live', 'tone'], modifier: 8,
    counterTags: [{ tags: ['busk'], modifier: -3 }],
    blurb: 'Live/Tone +8 · Busk −3 (daylight defeats it)',
  },
  {
    id: 'fake_manager', name: 'The Fake Manager Voice', art: 'gear_fakemanager', unlockedByDefault: true,
    flavor: 'A second phone and a firmer register. “Yes, this is Jordan, calling on behalf of the artist.” You are Jordan. Jordan gets results.',
    compatibility: { universal: true },
    appliesTo: ['deal', 'network'], modifier: 9,
    counterTags: [{ tags: ['family'], modifier: -3 }],
    blurb: 'Deal/Network +9 · Family −3 (your mother knows Jordan’s voice)',
  },
  // ---- Wave 3: Career Wall unlocks ----
  {
    id: 'flight_case', name: 'Anvil Flight Case', art: 'gear_flightcase', unlockedByDefault: false,
    flavor: 'Drop it off a loading dock. Drop a piano on it. The gear inside outlives us all.',
    compatibility: { universal: true },
    appliesTo: ['tour', 'live'], modifier: 7,
    blurb: 'Tour/Live +7 · the gear arrives alive',
  },
  {
    id: 'home_booth', name: 'The Closet Vocal Booth', art: 'gear_homebooth', unlockedByDefault: false,
    flavor: 'Every coat you own, repurposed as acoustic treatment. Sounds like a million bucks. Smells like every winter since 2009.',
    compatibility: { universal: true },
    appliesTo: ['record', 'vocal'], modifier: 10,
    demoQuality: 4,
    blurb: 'Record/Vocal +10 · demos +4 quality',
  },
  {
    id: 'monitor_wedge', name: 'A Monitor That Works', art: 'gear_monitor', unlockedByDefault: false,
    flavor: 'You can hear yourself. Clearly. For the first time. It changes a person.',
    compatibility: { universal: true },
    appliesTo: ['live', 'vocal'], modifier: 9,
    blurb: 'Live/Vocal +9 · self-awareness, the good kind',
  },
];

export function accessoryById(id) {
  return ACCESSORIES.find((a) => a.id === id) || null;
}

// An accessory is INERT unless it's universal or matches the current
// instrument's family (the compatibility comedy). Resolved against the
// instrument roster directly (the loadout is core, but the gear plugin owns
// this — the engine no longer resolves accessories).
import { instrumentById } from './instruments.js';
export function accessoryActive(acc, state): boolean {
  if (acc.compatibility?.universal) return true;
  const inst = instrumentById(state.instrument);
  return !!inst && (acc.compatibility?.families || []).includes(inst.family);
}
// The equipped accessories that are currently active, in equip order.
export function equippedActive(state): any[] {
  return (state.accessories || []).map(accessoryById).filter(Boolean).filter((a) => accessoryActive(a, state));
}

// The shop shelves (WP2): which accessory ids a random_basic/random_good grant
// draws from. The multi-candidate "shelf" (a shop that offers up to 3) and the
// single-grant fallback use slightly different pools, preserved EXACTLY as they
// were authored inline in the engine — including that loud_amp/loop_pedal/
// in_ears intentionally recur across a shelf's basic and good lists. These are
// music content (accessory ids), so they live here, not in the genre-neutral
// core; the engine samples from whichever array gearPool returns.
const SHELF_BASIC = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder', 'merch_cannon', 'cowbell', 'four_track',
  'gaff_tape', 'tip_qr', 'pocket_metronome', 'lucky_socks', 'thermos', 'demo_trunk'];
const SHELF_GOOD = ['pedalboard', 'vintage_mic', 'loud_amp', 'loop_pedal', 'in_ears', 'cursed_8track', 'stage_fan', 'humidifier', 'publicist_rolodex',
  'wireless_rig', 'contact_mic', 'stage_cape', 'projector', 'press_pass', 'mascot_head', 'shoebox_archive', 'green_room_kit', 'rice_cooker'];
const GRANT_BASIC = ['lucky_pick', 'loop_pedal', 'in_ears', 'loud_amp', 'field_recorder', 'setlist_binder',
  'gaff_tape', 'tip_qr', 'pocket_metronome', 'thermos'];
const GRANT_GOOD = ['pedalboard', 'vintage_mic', 'loud_amp', 'cursed_8track', 'stage_fan', 'in_ears',
  'wireless_rig', 'contact_mic', 'stage_cape', 'projector'];

export function gearPool(grant: string, forShelf: boolean): string[] {
  if (forShelf) return grant === 'random_basic' ? SHELF_BASIC : SHELF_GOOD;
  return grant === 'random_basic' ? GRANT_BASIC : GRANT_GOOD;
}
