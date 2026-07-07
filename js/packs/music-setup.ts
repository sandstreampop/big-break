// Music's run-setup: the optional venue/genre/contract pickers on the loadout
// screen, the run-init those choices drive (contract signing, nemesis bias),
// and the weekly Gauntlet's fixed build. Moved out of js/ui/newrun.ts so the
// shared setup flow names no instrument, venue, genre, or contract — it manages
// the loadout pick and calls presenter hooks for everything genre-specific.

import * as engine from '../engine.js';
import * as save from '../save.js';
import { track } from '../analytics.js';
import { signContract } from './plugins/contract.js';
import { contractById, CONTRACTS } from '../data/contracts.js';
import { genreById, offerGenres } from '../data/genres.js';
import { venueById, offerVenues } from '../data/venues.js';
import { INSTRUMENTS } from '../data/instruments.js';
import { artFor } from '../art.js';
import { sfx } from '../audio.js';
import { el, $, keyable, btn, show, hashStr, weekStr } from '../ui/dom.js';
import { activePack, run, meta, setRun, PRES, unlockedPackIds, unlockedPerkIds } from '../ui/context.js';
import { nav } from '../ui/nav.js';
import { musicUnlockedInstrumentIds, musicUnlockedContractIds } from './music-save.js';

// The music loadout pool: a contract may force a single instrument; otherwise
// it's the default set plus Career-Wall unlocks.
export function musicLoadoutPool(m: any, sel: any): string[] {
  const cMods: any = contractById(sel.contract)?.mods || {};
  return cMods.forceInstrument ? [cMods.forceInstrument] : musicUnlockedInstrumentIds(m);
}

// The icons for the chosen extras, shown on the sticky commit button.
export function musicSetupSummary(sel: any): string {
  return [
    sel.venue ? venueById(sel.venue)?.icon : null,
    sel.genre ? genreById(sel.genre)?.icon : null,
    sel.contract ? contractById(sel.contract)?.icon : null,
  ].filter(Boolean).join(' ');
}

// The optional venue / genre / contract pickers, rendered into the setup
// screen below the loadout row. Mutates `sel` and calls `rebuild` on a pick.
export function musicRenderSetupExtras(host: HTMLElement, ctx: { seed: number; sel: any; rebuild: () => void; daily: boolean }) {
  const { seed, sel, rebuild, daily } = ctx;
  // Home venue picker (Pass 41): adopt a room to build across the run
  const venues = offerVenues(engine.mulberry32(seed + 13));
  host.append(el('h3', 'contract-head', 'Optional: adopt a home venue'));
  const vRow = el('div', 'genre-row');
  for (const v of venues) {
    const chip = el('button', 'contract-chip venue-pick-chip' + (sel.venue === v.id ? ' signed' : ''),
      `${v.icon} <b>${v.name}</b><br><span>${v.flavor} Build it by playing ${v.tags.join('/')} shows.</span>`);
    chip.addEventListener('click', () => { sfx.ui(); sel.venue = sel.venue === v.id ? null : v.id; rebuild(); });
    vRow.append(chip);
  }
  host.append(vRow);
  // Genre picker (Pass 21): optional sound identity
  const genres = offerGenres(engine.mulberry32(seed + 7));
  host.append(el('h3', 'contract-head', 'Optional: claim a sound'));
  const gRow = el('div', 'genre-row');
  for (const g of genres) {
    const chip = el('button', 'contract-chip genre-chip' + (sel.genre === g.id ? ' signed' : ''),
      `${g.icon} <b>${g.name}</b> · ${g.blurb}<br><span>${g.flavor}</span>`);
    chip.addEventListener('click', () => { sfx.ui(); sel.genre = sel.genre === g.id ? null : g.id; rebuild(); });
    gRow.append(chip);
  }
  host.append(gRow);
  // Contract picker (Pass 9): optional clause, at most one
  const contracts = musicUnlockedContractIds(meta).map((id) => contractById(id)).filter(Boolean);
  if (contracts.length && !daily) {
    host.append(el('h3', 'contract-head', 'Optional: sign a contract'));
    const row = el('div', 'contract-row');
    for (const c of contracts) {
      const chip = el('button', 'contract-chip' + (sel.contract === c.id ? ' signed' : ''),
        `${c.icon} <b>${c.name}</b> ×${c.lpMult} LP<br><span>${c.desc}</span>`);
      chip.addEventListener('click', () => { sfx.ui(); sel.contract = sel.contract === c.id ? null : c.id; rebuild(); });
      row.append(chip);
    }
    host.append(row);
  }
}

// Apply the music setup choices + run-init to a freshly minted run: sign the
// contract, stamp the sound/venue, bias toward the nemesis, and flag a 3rd+
// meeting. (Runs after the engine's newRun/applyMastery; before comeback.)
export function musicApplySetup(r: any, sel: any, m: any, daily: boolean) {
  if (sel.contract) signContract(r, sel.contract);
  r.genre = sel.genre;
  r.venue = sel.venue;
  if (!daily) {
    // The nemesis returns: bias normal runs toward your most-faced rival
    const counts: any = m.rivalCounts || {};
    const [topRival, topCount] = (Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0] || [null, 0]) as [any, number];
    if (topRival && topCount >= 2 && Math.random() < 0.45) r.rival = topRival;
  }
  r.nemesis = (m.rivalCounts?.[r.rival] || 0) >= 2; // 3rd+ meeting
}

const masteryLevel = (id: string) => {
  const st = meta.lifetime?.byInstrument?.[id];
  return st ? Math.min(3, Math.floor(st.runs / 2) + st.wins) : 0;
};
const modsText = (mods: any) => Object.entries(mods)
  .map(([k, v]: [string, any]) => `${v > 0 ? '+' : ''}${v} ${activePack.manifest.statMeta[k]?.name || k}`).join(' · ');

// The Gauntlet (Pass 28): one fixed, seeded build per ISO week — same
// instrument, genre, and contract for everyone. Often cursed. Always fair.
export function musicStartGauntlet() {
  const week = weekStr();
  const seed = hashStr('bigbreak-gauntlet-' + week);
  const rng = engine.mulberry32(seed);
  const basics = INSTRUMENTS.filter((i) => i.unlockedByDefault);
  const inst = basics[Math.floor(rng() * basics.length)];
  const contract = CONTRACTS[Math.floor(rng() * CONTRACTS.length)];
  const genre = offerGenres(rng)[0];

  const s = $('#screen-instruments');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', `The Gauntlet — ${week}`));
  s.append(el('p', 'screen-sub', 'One build, chosen by fate, same for everyone this week. No substitutions. The kitchen is closed.'));
  const sheet = el('div', 'pick-row');
  const card = el('div', 'pick-card');
  card.append(artFor(inst.art, 'pick-art'));
  card.append(el('h3', '', inst.name));
  card.append(el('p', 'pick-flavor', inst.flavor));
  card.append(el('p', 'pick-mods', modsText(inst.modifiers)));
  card.append(el('p', 'pick-quirk',
    `<b>${inst.quirk.name}:</b> ${inst.quirk.desc}<br><br>` +
    `${genre.icon} <b>${genre.name}</b> — ${genre.blurb}<br>` +
    `${contract.icon} <b>${contract.name}</b> ×${contract.lpMult} LP — ${contract.desc}`));
  card.addEventListener('click', () => {
    sfx.commit();
    setRun(engine.newRun(activePack, inst.id, unlockedPackIds(meta), engine.mulberry32(seed + 1), unlockedPerkIds(meta)));
    engine.applyMastery(run, masteryLevel(inst.id));
    run.seed = seed + 2;
    run.gauntlet = week;
    run.seenCards = (meta.seenCards || []).slice(); // novelty steering (R2)
    run.genre = genre.id;
    signContract(run, contract.id);
    save.saveRun(run);
    track('run_start', { mode: 'gauntlet', career_runs: meta.runs || 0, ...(PRES.runProps?.(run, 'start') || {}) });
    nav.dealCard();
  });
  keyable(card, inst.name);
  sheet.append(card);
  s.append(sheet);
  const menu = el('div', 'menu');
  menu.append(btn('← Back', '', () => { nav.title(); show('#screen-title', 'back'); }));
  s.append(menu);
  show('#screen-instruments');
}
