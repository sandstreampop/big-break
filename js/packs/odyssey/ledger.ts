// The Odyssey — the fire explains itself (pass 4 of the player-experience
// series): the clarity bundle. Four shell seams this pack left empty, each
// a place a player could ask "what does this mean / what have I done across
// nights" and get silence or another genre's words:
//   · statInfo — the tap-a-meter blurbs. Reachable today via the Despair
//     danger pip (the shell now shows it on world-is-HUD packs too — this
//     pass's hud.ts change); might/guile/lore entries are registered but
//     DORMANT until a surface calls showInspectStat for them (their numbers
//     live in the frieze inspect panel);
//   · helpBlocks — the pack's half of the Help sheet (the shell's half is
//     the universal swipe mechanics; without these the sheet never mentions
//     the fleet, the gods, the band, or the prophecy);
//   · resume/historyStat/historyEntry — The Résumé and Past-Lives rows,
//     which fell back to the shell's minimal neutral record;
//   · twistNote — the act-twist headline, which fell back to the engine's
//     neutral scissors/plus note.
// All pure reads. Voice: the bard pricing his own ledger.

import { FIRES } from './fires.js';

export const ODYSSEY_STAT_INFO: Record<string, string> = {
  might: 'The strong arm — boarding, rowing-down, the spear set in the deck. Feeds every door that says <b>fight it</b>, and the Hall’s bow speaks for it at the last.',
  guile: 'The trick, the mask, the name withheld. Feeds every door that says <b>trick it</b> — and the beggar’s rags in the Hall are cut from it.',
  lore: 'The rite known against the thing — omens read, libations poured, the guest-law said whole. Feeds every door that says <b>know it</b>, and the goddess marks the bookkeeping.',
  burnout: 'Despair — the weight of the rowing. Hard nights raise it; rest and rites bring it down. When it fills, the telling ends on a beach, quietly. The ember under your card dims with it.',
};

export const ODYSSEY_HELP_BLOCKS: string[] = [
  '⚔️🪢📜 <b>Three ways at any trouble</b> — fight it (Might), trick it (Guile), know the rite against it (Lore). The icons on each button say which; build the ones your road needs.',
  '🏺 <b>The painted band is the voyage itself</b>: the rowers are your Expedition, the water is Poseidon’s mood, the owl sits the mast when Athena is with you, and deeds walk the wake. <b>Tap the band</b> for the plain numbers, any time.',
  '⛵ <b>The Expedition</b> is men and timber as one dwindling thing — twelve ships out of Troy, and no bench ever refills. Low is not death; it closes doors. The Homecoming needs hulls left to bring home.',
  '🔱 <b>Poseidon</b> is the sea’s ledger: provoke it (a name shouted, a rite skipped) and it fills. <b>At ten, the wave.</b> 🦉 <b>Athena</b> is earned by rites and cunning — she tips the last scale in the Hall. 🌟 <b>Renown</b> is deeds of legend, tallied as performed; the Glory road is paved with it.',
  '⛵ <b>The Crossroads</b> (after the cave) asks what tonight’s telling rows for: <b>Nostos</b> — the Homecoming (hulls kept, the goddess earned, the sea unprovoked) — or <b>Kleos</b> — the Glory (Renown, paid for in wrath). The Hall judges you against the road you chose.',
  '🌬 <b>A following wind</b>: an INCREDIBLE landing banks one. Arm it before a stroke that matters and the roll rides it.',
  '🏛 <b>The prophecy has three turnings</b>, and they are the only thing that crosses from fire to fire — knowledge, never power. Carry the sea and the bow turnings home, and one night the dead will offer you the third question.',
];

// The Résumé — the bard's own ledger, read whole from the pack meta save.
export function odysseyResume(meta: any): { label: string; value: string; head?: boolean }[] {
  const lt = meta.lifetime || { swipes: 0, incredibles: 0, bads: 0, byLoadout: {}, byPath: {} };
  const ody = meta.odyssey || {};
  const t = ody.tellings || { count: 0, byEnding: {}, named: 0, nobody: 0, crewLostTotal: 0 };
  const frags: string[] = ody.fragments || [];
  const rows: { label: string; value: string; head?: boolean }[] = [
    { label: 'Nights at the fire', value: String(t.count || meta.runs || 0) },
    { label: 'Strokes pulled', value: String(lt.swipes) },
    { label: 'Landings sung INCREDIBLY', value: String(lt.incredibles) },
    { label: 'Bad water survived', value: String(lt.bads) },
    { label: 'Men named in the sand', value: String(t.crewLostTotal || 0) },
    { label: 'Turnings of the prophecy held', value: `${frags.length} of 3` },
    { label: 'Legacy earned', value: `${meta.lpEarnedTotal || 0} LP` },
  ];
  if (ody.oarRoad) rows.push({ label: 'The Oar Road', value: 'sung end to end' });
  if (t.named || t.nobody) {
    rows.push({ label: 'The name at the cave', value: '', head: true });
    rows.push({ label: '🗣 Shouted whole', value: `${t.named || 0} telling${t.named === 1 ? '' : 's'}` });
    rows.push({ label: '◌ Went down with the anchor-stone', value: `${t.nobody || 0} telling${t.nobody === 1 ? '' : 's'}` });
  }
  const byEnding: [string, number][] = Object.entries(t.byEnding || {}) as [string, number][];
  if (byEnding.length) {
    rows.push({ label: 'How the tellings ended', value: '', head: true });
    const NAMES: Record<string, string> = {
      nostos: '⛵ The Homecoming', kleos: '🌟 The Glory', wrath: '🌊 The sea answered',
      lotus: '🌸 Banked at the meadow', circe: '🏺 Banked at the soft year',
      calypso: '🏝 Banked at the island', burnout: '🌫 The rowing ended',
    };
    for (const [k, n] of byEnding.sort((a, b) => b[1] - a[1])) {
      rows.push({ label: NAMES[k] || k, value: `×${n}` });
    }
  }
  const fireRuns = Object.entries<any>(lt.byLoadout || {}).sort((a, b) => b[1].runs - a[1].runs);
  if (fireRuns.length) {
    rows.push({ label: 'Where you sing', value: '', head: true });
    for (const [fid, st] of fireRuns.slice(0, 4)) {
      const fire = FIRES.find((f) => f.id === fid);
      rows.push({ label: fire?.name || fid, value: `${st.runs} night${st.runs === 1 ? '' : 's'}, ${st.wins} won` });
    }
  }
  return rows;
}

// Past-Lives rows: what the telling banked (renown) and what it cost (men).
export const odysseyHistoryEntry = (summary: any) => ({
  renown: Math.max(0, Math.round(summary.renown || 0)),
  crewLost: Math.max(0, Math.round(summary.crewLost || 0)),
});
export const odysseyHistoryStat = (h: any): string =>
  h.renown == null && h.crewLost == null ? '' : `🌟${h.renown ?? 0} · ⚰${h.crewLost ?? 0}`;

// The act twist, in the bard's mouth (the engine's note is neutral scissors).
export const odysseyTwistNote = (delta: number): string => delta < 0
  ? `✂️ The wind is with the telling — this sea runs ${-delta} stroke${delta === -1 ? '' : 's'} SHORT. Spend them well.`
  : `➕ The sea has opinions tonight — this stretch runs ${delta} stroke${delta === 1 ? '' : 's'} LONG. Ration accordingly.`;
