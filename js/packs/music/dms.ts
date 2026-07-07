// The DM inbox: between acts, people from your run text you. Every message
// is gated on actual run state (flags, gear, rivalry, history), so it reads
// as memory, not filler. Seeded like headlines for daily consistency.

import { mulberry32 } from '../../engine.js';
import { rivalById } from './data/rivals.js';

export function generateDMs(state, count = 2) {
  const rival = rivalById(state.rival);
  const flags = state.flags || [];
  const pool = [];
  const add = (cond, from, text) => { if (cond) pool.push({ from, text }); };

  add(flags.includes('debt'), 'Curtis',
    'Checking in! Balance unchanged. No pressure. The clipboard and I hope the music is going well. It would be good for everyone if the music went well.');
  add(state.money < 0 && !flags.includes('debt'), 'Your bank (automated)',
    'Your account balance is: creative. Reply STOP to stop receiving reality.');
  add(flags.includes('keyholder'), 'Todd',
    'hey. someone left the reverb — I mean walk-in — open again. also u still work here technically? asking for corporate');
  add(flags.includes('union_card'), 'Local 47-adjacent',
    'REMINDER: monthly meeting Tues. Agenda: parking validation (contd.), scale rates, parking validation (new business).');
  add(flags.includes('song_sold'), 'That producer',
    'the song’s doing numbers. no hard feelings about the door thing, right? doors everywhere. plenty of doors.');
  add(flags.includes('song_growing'), 'You (note to self, 3:12 a.m.)',
    'don’t let anyone touch the ending. the ending is the whole door.');
  add(flags.includes('song_finished'), 'The vocal coach',
    'I heard it. You walked through. — no reply necessary, obviously');
  add(flags.includes('grounded'), 'Someone who loves you',
    'saw a kazoo in a shop window and thought of you. proud of you. eat something green.');
  add(state.accessories?.includes('managers_card'), 'Dario',
    'big things cooking. HUGE. can’t say more. also did my 10% land weird last month? ignore that. HUGE things.');
  add(state.accessories?.includes('energy_drink'), 'GRIND™ Brand Team',
    'Reminder: per section 4.2, the hat must appear in all photos. We noticed a hatless photo. We are not angry. We are GRIND™.');
  add(!!state.nemesis, rival.name,
    'you again. of course it’s you again. the universe has one (1) bit and we’re it. see you at the top, or wherever.');
  add((state.rivalry ?? 3) >= 7, rival.name,
    'heard your new stuff. it’s fine. anyway I booked the room you wanted. the big one. see you around, champ.');
  add((state.rivalry ?? 3) <= 1, rival.name,
    'crowd tonight was singing YOUR song between sets. thought you’d want to know. proud of you, weirdo.');
  add(state.swappedLoadout, 'The superfan',
    'guitar update: I told my mom it went to someone going somewhere. she cried. no pressure!! (some pressure)');
  add((state.copingSeen || []).includes('coping_75'), 'Brayden (Cold Plunge)',
    'DISCOMFORT IS A DOOR. also we miss you in the comments. the water misses you. 11% off code: SHIVER');
  add((state.hustles || []).includes('compost_corner'), 'Craig (Bagpipes)',
    'compost corner accords hold. a mime tried to claim 11am. I handled it. you owe me one (1) duet.');
  add(flags.includes('home_studio'), 'The landlord',
    'shed update: the pinball guy asked if YOU would move so HE could have it. said no obviously. rent’s the same. the wiring question expires never.');
  add((state.hustles || []).includes('shed_rental'), 'Shed calendar (automated)',
    'This week: Tue (noise duo, deposit paid), Thu (harpist??), Sat 2AM–6AM (unnamed, cash, polite). The room is winning.');
  add(flags.includes('helped_bloom'), 'Static Bloom 🌸',
    'played a stadium last night. encore amp cut out. crowd of 40,000 and I told them about YOURS. they cheered for an amp. thought you should know.');
  add(flags.includes('snubbed_bloom'), 'Static Bloom 🌸',
    'no hard feelings btw. the rental amp taught us distortion. anyway. interviewer asked about our origin story today. we kept it vague. -ish.');
  add(flags.includes('docu_crew'), 'Juniper 🎬',
    'logging footage. found 40 seconds of you tuning + staring at nothing. it’s the best thing i’ve ever shot. this is going IN.');
  add((state.hustles || []).includes('wedding_circuit'), 'Braydenn’s mom',
    'the Hendersons want you for their vow renewal!!! i said you’d “check the tour schedule” (I know there’s no tour rn — I said it for LEVERAGE)');
  add(flags.includes('mg_golden'), 'Grub',
    'people keep asking me about your hands. i tell them the truth. faders don’t lie.');
  add(state.venueLevel >= 3, 'Your venue’s owner',
    'kid asked me tonight who plays here. said “the one who made this place a place.” they didn’t get it. they will.');
  add(state.hits >= 2, 'Unknown number',
    'hey it’s the A&R from the thing. loved the thing. do you have more things? call me. don’t text. calls only. it’s a whole thing.');
  add(state.stats.burnout >= 60, 'Your calendar',
    'This is a wellness notification. You have 0 (zero) days off scheduled. This notification counts as your day off.');
  add(flags.includes('someone'), 'Them ❤️',
    'saw a poster with your face downtown and told the bus stop “I know the kitchen version.” anyway. eat something green. proud of you.');
  add(flags.includes('someone_lost'), 'Them',
    'heard the new one. the bridge. yeah. anyway — glad you’re okay. (I’m glad you’re okay.)');
  add((state.flags || []).includes('comeback'), 'Your old tour manager',
    'saw the announcement. knew you weren’t done. nobody with your soundcheck habits is ever done. van’s gone but I still have the trailer. call me.');
  add(state.brammy === 'won', 'The Brammys (official)',
    'Reminder: winners must return the trophy if career claims in the speech prove false within 24 months. Congrats again!');
  add(state.fame >= 60, 'Mom',
    'A lady at the store had your face on her shirt?? I told her I made you. She did not believe me. Call your mother.');

  // the wave's systems text too
  add(state.contract === 'deadline', 'A&R (label single deal)',
    'friendly reminder per clause 4: a song ships THIS act. attached: a calendar invite titled “inspiration.” it recurs.');
  add((state.hustles || []).includes('sync_royalties'), 'The supervisor (yogurt)',
    'campaign renewed for Q3!! the probiotic demo loves you. checks incoming. PS my kid says your old song is “retro.” growth!');
  add(flags.includes('room_saved'), 'The sound guy',
    'plaque went up today. some tourist asked who saved the room. told him “the scene.” he asked who that was. told him “everyone who ever carried an amp up those stairs.” he bought a shirt.');
  add(flags.includes('chart_passed_rival') && (state.rivalry ?? 3) >= 5, rival.name,
    'enjoy the chart position. positions are temporary. I have booked studio time. lots of it. tell your fan account to stretch first.');
  add(flags.includes('notebook_demo'), 'You (note on the old notebook)',
    'past you left present you a demo. past you had no idea what was coming. play it for them sometime.');

  // the songs text too — every message quotes the real catalog
  const songs = state.songs || [];
  const charting = songs.filter((s) => s.status === 'charting' && s.pos).sort((a, b) => a.pos - b.pos)[0];
  const crowned = songs.find((s) => s.crowned);
  const bestDemo = songs.filter((s) => s.status === 'demo').sort((a, b) => b.quality - a.quality)[0];
  const faded = songs.find((s) => s.status === 'faded' && s.peak);
  add(!!charting && charting.pos <= 3, 'Unknown number',
    `it’s the A&R. “${charting?.title}” is top 3 and my boss thinks it was MY idea. it can keep being my idea for the right split. calls only.`);
  add(!!charting && charting.pos > 3, 'The sound guy',
    `heard “${charting?.title}” on the radio during load-in. didn’t tell anyone it was you. wanted the room to find out on its own. they did.`);
  add(!!crowned && flags.includes('superfan'), 'Row zero',
    `“${crowned?.title}” hit and I have RECEIPTS — I posted about it ${3 + ((state.flavorSeed || 1) % 9)} months ago. pinned it. no caption. the caption is the timestamp.`);
  add(!!bestDemo && bestDemo.quality >= 60, 'Nadia ✒️',
    `played “${bestDemo?.title}” for exactly one person in the writing room. they went quiet. that’s the good quiet. ship it or I steal it (legally I cannot steal it) (ship it)`);
  add(!!faded, 'Spotify Wrapped (unofficial)',
    `fun fact: someone in Ohio has played “${faded?.title}” every day since it fell off the chart. one person. every day. songs don’t die, they relocate.`);
  add(!!crowned && (state.rivalry ?? 3) >= 6, rival.name,
    `my producer played me “${crowned?.title}” as a REFERENCE today. didn’t tell him. won’t tell him. this text self-destructs.`);
  add(flags.includes('album_out'), 'The engineer who eats standing up',
    'still think about the album sessions. track 7 hits different at 2am on the bus. that’s all. that’s the text.');

  const rng = mulberry32((state.flavorSeed || 1) * 53 + state.act * 613);
  const picks = [];
  const bag = [...pool];
  while (picks.length < count && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}
