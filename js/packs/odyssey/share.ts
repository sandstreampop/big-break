// The Odyssey — the telling travels (pass 8 of the player-experience
// series): the share text and the harbor news.
//
// SHARE: the ending screen's 📣 button is shell chrome that was sharing an
// EMPTY STRING for this pack (PRES.shareText?.() || ''). Now a finished
// telling travels as a compact record: which fire, which road, how it
// ended, the night's weather strip, the vase's band as glyphs (pass 32),
// the fleet's arithmetic, and the prophecy's honest floor. Pure read of the
// summary — same purity law as everything else here.
//
// NEWS: the title screen's flavor-news slot (title.news), previously empty
// for this pack — one harbor rumor a day, rotating on the shell's day
// number. The world outside the fire, in the bard's economy: rival bards,
// guild notices, the trade road.

import type { Presenter, RunState } from '../../types.js';
import { odysseyManifest } from './manifest.js';
import { FIRES } from './fires.js';
import { heldTurnings } from './shelf.js';
import { vaseGlyphs } from './vase.js';

const TIER_EMOJI: Record<string, string> = { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };

// Short verdicts for the early endings (caps for the share line; the
// ending-screen ribbon uses presenter.failLabels' fuller forms).
const END_VERDICT: Record<string, string> = {
  wrath: 'THE SEA ANSWERED',
  lotus: 'BANKED AT THE MEADOW',
  circe: 'BANKED AT THE SOFT YEAR',
  calypso: 'BANKED AT THE ISLAND',
  burnout: 'THE ROWING ENDED',
};

export const odysseyShareText: NonNullable<Presenter['shareText']> = (summary: any, lp: number) => {
  const mode = summary.gauntlet ? ` · The Gauntlet ${summary.gauntlet}`
    : summary.daily ? ` · The Same Sea ${summary.daily}`
    : (summary.flags || []).includes('comeback') ? ' · The Scarred Telling' : '';
  const fire = FIRES.find((f) => f.id === summary.loadout)?.name || 'A fire';
  const road = summary.path ? (odysseyManifest.paths[summary.path]?.name || summary.path) : 'no road chosen';
  const verdict = summary.result ? summary.result.toUpperCase()
    : END_VERDICT[summary.endingKey] || 'THE TELLING ENDED';
  const strip = (summary.tierLog || []).map((t: string) => TIER_EMOJI[t] || '⬜').join('');
  // The vase travels (pass 32): the Night's Vase's band, as glyphs — chosen
  // by the SAME reader the painted vase uses (vase.ts readVoyage), so what a
  // player pastes is what their ending screen painted.
  const band = vaseGlyphs({
    flags: summary.flags || [],
    expedition: summary.expedition,
    athena: summary.athena,
    poseidon: summary.poseidon,
    ending: { key: summary.endingKey ?? null, result: summary.result ?? null },
    path: summary.path ?? null,
  } as RunState);
  const held = heldTurnings(summary.flags || []);
  const bits = [
    `⛵ ${Math.max(0, Math.round(summary.expedition ?? 0))} hulls`,
    `🌟 ${Math.max(0, Math.round(summary.renown ?? 0))} renown`,
    `🔱 sea at ${Math.max(0, Math.round(summary.poseidon ?? 0))}`,
    `🏺 ${held.count} of 3 turnings`,
    ...(summary.dailyStreak > 1 ? [`🔥 night ${summary.dailyStreak}`] : []),
  ];
  return `THE ODYSSEY${mode}\n${fire} → ${road} → ${verdict}\n${strip}\n🏺 ${band}\n${bits.join(' · ')} · +${lp} LP\nhttps://sandstreampop.github.io/big-break/odyssey/`;
};

// One harbor rumor a day — evergreen, in-fiction, seeded by the shell's day
// number so every player sees the same rumor on the same day.
export const HARBOR_NEWS: { text: string; src: string }[] = [
  { text: 'Phemios of Smyrna adds a SECOND drum to the storm passage. The sea, reached for comment, remains unimpressed.', src: 'the harbor talk' },
  { text: 'A crew out of Pylos swears the Gate ran flat at both tides this week. The pilots are re-drawing nothing until someone sober confirms it.', src: 'the pilots’ bench' },
  { text: 'The woman by the woodpile has counted the ships in every telling this month. The bard maintains it is twelve. She maintains her grandfather could count.', src: 'the fireside ledger' },
  { text: 'Wine prices are up in Ismaros. Priests of Apollo cite “demand from a certain quarter.”', src: 'the trade road' },
  { text: 'A boy in the third row can now recite the shout at the giant, word for word. His mother is not grateful to anyone in particular.', src: 'a local complaint' },
  { text: 'Two fires down the coast, a bard tried the Sirens with a chorus. The chorus has not been paid, on the grounds that nobody remembers the middle of the evening.', src: 'guild notices' },
  { text: 'The potter’s boy has begun charging other children a fig each to hear him retell last night’s telling. The guild is watching him with interest and some alarm.', src: 'guild notices' },
  { text: 'A man at the fish market claims to have met Odysseus. Prices at his stall have doubled. The fish remain ordinary.', src: 'the harbor talk' },
  { text: 'The temple steps have asked for more omens in the weather and fewer jokes about the fee. The bard has agreed to half of this.', src: 'temple notices' },
  { text: 'Someone has planted an oar upright in a barley field, a long walk inland. The farmers call it art. The sailors will not walk past it.', src: 'the trade road' },
];

export const odysseyNews = (dayNum: number): { text: string; src: string } | null =>
  HARBOR_NEWS[Math.abs(dayNum) % HARBOR_NEWS.length] || null;
