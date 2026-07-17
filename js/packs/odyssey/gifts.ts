// The Guest-Gifts (pass 17) — the odyssey's Legacy wall. Xenia, the old law:
// a guest-friend's gift, once given, rides every telling after. This is the
// pack's LP sink — before this, a telling paid 13–70 Legacy a night into a
// purse with nothing to buy (the music game has had its Career Wall since
// D.1; the fire deserved its own shelf).
//
// Mechanics ride the engine's generic PerkDef knobs (js/types.ts): run-start
// bumps, act-break work, pity/encore/heal dials. The engine names no gift id;
// the catalog (ODYSSEY_WALL_ITEMS, kind 'perk') maps purchases to the table
// below through the shell's generic wall (js/ui/menus.ts renderWall).
//
// GOLDEN-SAFE by construction: sims and golden traces call newRun with
// perks [] (tools/pack-core.mjs), so nothing here can move a seeded draw.
//
// HONESTY notes: no gift grants a hull — the bard's arithmetic (crewAtLaunch
// → the recap's count, the sand's names, the prophecy's crewLost) assumes the
// launch count is the fire's, and a bought hull would miscount the dead.
// Every desc states its mechanic plainly; 'a quarter deeper' means ×1.25.

import type { PerkDef } from '../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const ODYSSEY_PERKS: Record<string, PerkDef> = {
  // ── Run-start gifts ──
  troy_coin: { onRunStart: (s) => { s.renown = (s.renown || 0) + 1; } },
  gift_chart: { onRunStart: (s) => { s.stats.lore = clamp(s.stats.lore + 4, 1, 100); } },
  beggars_patches: { onRunStart: (s) => { s.stats.guile = clamp(s.stats.guile + 4, 1, 100); } },
  guest_spear: { onRunStart: (s) => { s.stats.might = clamp(s.stats.might + 4, 1, 100); } },
  carved_owl: { onRunStart: (s) => { s.athena = (s.athena || 0) + 1; } },
  mentors_blessing: {
    onRunStart: (s) => {
      for (const k of ['might', 'guile', 'lore']) s.stats[k] = clamp(s.stats[k] + 3, 1, 100);
    },
  },
  // ── Engine-dial gifts ──
  mixed_bowl: { burnoutHealMult: 1.25 },
  salt_cloak: { pityPerBonus: 3, pityCapBonus: 6 },
  cheese_wind: { encoreCapBonus: 1 },
  // ── Cosmetic gifts (no hooks — the SURFACES read the purchase) ──
  // The red-figure glaze: every vase surface (ending, gallery, poster)
  // checks meta.unlockedWall for gift_red_glaze. An empty PerkDef keeps the
  // shell's generic wall/perk plumbing untouched and the seeded stream
  // trivially safe.
  red_glaze: {},
  // ── Act-break gifts ──
  patient_libation: {
    onActBreak: (s, notes) => {
      if ((s.poseidon || 0) > 0) {
        s.poseidon -= 1;
        notes.push('🍷 The Patient Libation: poured at landfall — the sea eases a point.');
      }
    },
  },
};

// The catalog the shell's wall renders (kind 'perk' → target = table key).
// Costs calibrated to real earnings: a telling pays 13–70 LP (avg ≈ 39), so
// tier 1 is one night's work, tier 2 two, tier 3 a good week at the fire.
export const ODYSSEY_WALL_ITEMS = [
  // Tier 1
  { id: 'gift_troy_coin', tier: 1, cost: 25, kind: 'perk', target: 'troy_coin',
    name: 'A Coin from Troy', desc: 'Begin every telling with Renown 1 — someone in the crowd has heard the name before you say it.' },
  { id: 'gift_mixed_bowl', tier: 1, cost: 30, kind: 'perk', target: 'mixed_bowl',
    name: 'The Well-Mixed Bowl', desc: 'Despair relief lands a quarter deeper. The wine is cut the old way — water first, then honesty.' },
  { id: 'gift_chart', tier: 1, cost: 35, kind: 'perk', target: 'gift_chart',
    name: 'The Pilot’s Gift-Chart', desc: 'Begin with Lore 4 higher. Real soundings, real headlands, one coffee ring that is probably Crete.' },
  { id: 'gift_patches', tier: 1, cost: 35, kind: 'perk', target: 'beggars_patches',
    name: 'A Beggar’s Good Patches', desc: 'Begin with Guile 4 higher — the disguise work comes pre-broken-in.' },
  // Tier 2
  { id: 'gift_carved_owl', tier: 2, cost: 60, kind: 'perk', target: 'carved_owl',
    name: 'A Small Owl, Carved', desc: 'Begin every telling with Athena 1. The goddess notices the pocket it rides in.' },
  { id: 'gift_guest_spear', tier: 2, cost: 65, kind: 'perk', target: 'guest_spear',
    name: 'A Guest-Friend’s Spear', desc: 'Begin with Might 4 higher. It has a name, a history, and excellent balance.' },
  { id: 'gift_salt_cloak', tier: 2, cost: 70, kind: 'perk', target: 'salt_cloak',
    name: 'The Salt-Cured Cloak', desc: 'Bad stretches turn faster: each bad landing adds more mercy to the next roll, and the mercy stacks higher. This cloak has been through weather.' },
  // Tier 3
  { id: 'gift_libation', tier: 3, cost: 120, kind: 'perk', target: 'patient_libation',
    name: 'The Patient Libation', desc: 'At every act break, if the sea holds a grudge, pour: Poseidon eases 1. Jaw creaking is normal and expected.' },
  { id: 'gift_cheese_wind', tier: 3, cost: 130, kind: 'perk', target: 'cheese_wind',
    name: 'A Wind Held in Cheesecloth', desc: 'The telling can bank a THIRD following wind, one past the fire’s usual two. Aiolos owed somebody a favor; the bag is smaller and honest this time.' },
  { id: 'gift_mentor', tier: 3, cost: 150, kind: 'perk', target: 'mentors_blessing',
    name: 'The Mentor’s Blessing', desc: 'Begin with Might, Guile, and Lore each 3 higher — tonight’s Odysseus arrives already sung a little larger.' },
  // Tier 4 — prestige, purely cosmetic (pass 44)
  { id: 'gift_red_glaze', tier: 4, cost: 250, kind: 'perk', target: 'red_glaze',
    name: 'The Red-Figure Glaze', desc: 'A rival workshop’s secret, bought outright: your vases fire the new way — figures left in living clay, the ground burned black. Changes nothing but how the nights look on the shelf, in the gallery, and on the poster that leaves the fire. Which is to say: everything.' },
];

// The wall's chrome, re-voiced (Presenter.wallCopy): this fire trades in
// guest-gifts, not careers.
export const ODYSSEY_WALL_COPY = {
  button: '🏺 The Guest-Gifts',
  head: 'The Guest-Gifts',
  sub: 'Legacy buys the bard better nights. A gift once given rides every telling after.',
};
