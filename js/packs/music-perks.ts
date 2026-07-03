// The music genre's Career-Wall perks (D.1), declared as data instead of ~14
// hardcoded id checks scattered through the engine. Each perk supplies only the
// hooks/knobs it uses; the engine applies them generically at the matching
// lifecycle point. (The 'notebook' perk mints a demo and so lives with the
// songs subsystem — songsPlugin.onRunStart — not here.)

import type { PerkDef, RunState } from '../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const MUSIC_PERKS: Record<string, PerkDef> = {
  // ── Run-start bonuses ──
  savings: { onRunStart: (s) => { s.money += 120; } },
  demo: { onRunStart: (s) => { if (!s.flags.includes('demo_in_pocket')) s.flags.push('demo_in_pocket'); } },
  calluses: { onRunStart: (s) => { s.stats.skill = clamp(s.stats.skill + 6, 1, 100); } },
  couch: { onRunStart: (s) => { s.stats.network = clamp(s.stats.network + 6, 1, 100); } },
  warmup: { onRunStart: (s) => { s.encore = 1; } }, // walk in with one banked
  perfect_pitch: { onRunStart: (s) => { s.stats.creativity = clamp(s.stats.creativity + 6, 1, 100); } },
  stage_legs: { onRunStart: (s) => { s.stats.cred = clamp(s.stats.cred + 6, 1, 100); } },
  headliner: { onRunStart: (s) => { s.fame += 8; } }, // somebody remembers the name

  // ── Engine-dial knobs ──
  thick_skin: { pityPerBonus: 3, pityCapBonus: 6 }, // bad streaks bounce back harder
  crowdwork: { encoreCapBonus: 1 },                 // the hot streak gets a third act
  insurance: { keepGearOnBad: true },               // gear never lost on a Bad
  therapist: { burnoutHealMult: 1.25 },             // burnout relief 25% stronger
  cheap_rent: { hustleMult: 1.2 },                  // hustle income +20%

  // ── Act-break income / upkeep ──
  merch_table: {
    onActBreak: (s, notes) => { s.money += 45; notes.push('🧺 The Folding Merch Table: +$45'); },
  },
  street_team: {
    onActBreak: (s, notes) => { s.fame += 2; notes.push('📣 The Street Team: +2 Fame (the flyers went up overnight)'); },
  },
  roadie_friend: {
    onActBreak: (s, notes) => {
      if (s.stats.burnout > 0) {
        const before = s.stats.burnout;
        s.stats.burnout = Math.max(0, before - 3);
        if (s.stats.burnout !== before) notes.push('🧤 A Friend With A Truck: −3 Burnout');
      }
    },
  },
  archivist: {
    onActBreak: (s: RunState, notes) => {
      const demos = (s.songs || []).filter((x) => x.status === 'demo');
      for (const d of demos) d.quality = clamp(d.quality + 2, 1, 100);
      if (demos.length) notes.push(`🗃️ The Archivist: ${demos.length} vault demo${demos.length === 1 ? '' : 's'} +2 quality`);
    },
  },
};
