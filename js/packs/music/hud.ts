// The music pack's HUD data: the counter chips (score/currency/streak) and the
// gear row (instrument + acquired kit), returned as descriptors the shared HUD
// renders. Moved out of js/ui/hud.ts so the generic HUD names no instrument,
// venue, contract, hustle, or resource — it renders whatever the pack returns.

import { instrumentById } from './data/instruments.js';
import { accessoryById } from './data/accessories.js';
import { weatherById } from './data/weather.js';
import { contractById } from './data/contracts.js';
import { genreById } from './data/genres.js';
import { venueById, VENUE_TIERS } from './data/venues.js';
import { bandmateById } from './data/band.js';
import { hustleById } from './data/hustles.js';

export function musicHudCounters(s: any) {
  const out: { html: string; cls?: string }[] = [];
  if (s.encore > 0) out.push({ cls: 'hud-encore', html: `🎇${s.encore > 1 ? '×' + s.encore : ''}` });
  if (s.pathProgress > 0 && s.path) out.push({ cls: 'hud-momentum', html: `▲${s.pathProgress}` });
  out.push({ cls: 'hud-fame', html: `★ ${s.fame}` });
  out.push({ cls: 'hud-money' + (s.money < 0 ? ' neg' : ''), html: `$${s.money}` });
  if (s.path === 'hitfactory' || s.hits > 0) out.push({ cls: 'hud-hits', html: `♪ ${s.hits} hit${s.hits === 1 ? '' : 's'}` });
  return out;
}

function accActive(acc: any, run: any) {
  if (acc.compatibility?.universal) return true;
  return (acc.compatibility?.families || []).includes(instrumentById(run.loadout).family);
}

export function musicGearChips(run: any) {
  const chips: { cls: string; html: string; sheet: any }[] = [];
  const push = (cls: string, html: string, sheet: any) => chips.push({ cls, html, sheet });

  const inst = instrumentById(run.loadout);
  push('gear-chip inst-chip', inst.name, {
    art: inst.art, title: inst.name, lines: [
      inst.flavor,
      ...(inst.quirk ? [`<b>${inst.quirk.name}:</b> ${inst.quirk.desc}`] : []),
      ...(inst.family ? [`Family: ${inst.family} — gear with a family requirement only works when it matches.`] : []),
    ],
  });
  // Scene Weather (M2): the era this career happens inside
  const weather = weatherById(run.weather);
  if (weather && !run.tutorial) push('gear-chip weather-chip', `${weather.icon} ${weather.name}`, {
    emoji: weather.icon, title: `${weather.name} (scene weather)`,
    lines: [weather.flavor, `<b>This run:</b> ${weather.blurb}`,
      'Rolled once per career. Dailies and Gauntlets share theirs with everyone.'],
  });
  const contract = contractById(run.contract);
  if (contract) push('gear-chip contract-chip-mini', `${contract.icon} ${contract.name}`, {
    emoji: contract.icon, title: `${contract.name} (contract, ×${contract.lpMult} LP)`, lines: [contract.desc],
  });
  const genre = genreById(run.genre);
  if (genre) push('gear-chip genre-chip-mini', `${genre.icon} ${genre.name}`, {
    emoji: genre.icon, title: `${genre.name} (your sound)`, lines: [genre.flavor, `<b>Effect:</b> ${genre.blurb}`],
  });
  const venue = venueById(run.venue);
  if (venue) {
    const tier = VENUE_TIERS[run.venueLevel] || VENUE_TIERS[0];
    push('gear-chip venue-chip-mini', `${venue.icon} ${'★'.repeat(run.venueLevel)}${'☆'.repeat(3 - run.venueLevel)}`, {
      emoji: venue.icon, title: `${venue.name} — ${tier.name}`,
      lines: [venue.flavor,
        `<b>Home crowd:</b> ${venue.tags.join('/')} shows here add +${tier.showBonus} Fame (and half that Cred). ${run.venueShows || 0} shows played.`,
        run.venueLevel < 3 ? 'Play more shows here to build it toward a local institution.' : 'This room is a local institution. It’s yours.'],
    });
  }
  for (const id of run.accessories || []) {
    const acc = accessoryById(id);
    if (!acc) continue;
    const active = accActive(acc, run);
    push('gear-chip' + (active ? '' : ' inert'), acc.name + (active ? '' : ' 💤'), {
      art: acc.art, title: acc.name, lines: [
        acc.flavor, `<b>Effect:</b> ${acc.blurb}`,
        active ? '' : '💤 <b>Dormant:</b> this item doesn’t fit your current instrument’s family.',
      ].filter(Boolean),
    });
  }
  for (const p of run.promises || []) {
    push('gear-chip promise-chip', `🤞 ${p.label} (${p.remaining})`, {
      emoji: '🤞', title: `Promise: ${p.label}`,
      lines: [`Play a <b>${p.tags.join(' or ')}</b> choice within <b>${p.remaining}</b> card${p.remaining === 1 ? '' : 's'} to keep it.`,
        'Kept promises pay off. Broken ones cost you.'],
    });
  }
  for (const bid of run.band || []) {
    const bm = bandmateById(bid);
    if (bm) push('gear-chip band-chip-mini', `${bm.icon} ${bm.name}`, {
      emoji: bm.icon, title: `${bm.name} — ${bm.role}`,
      lines: [bm.flavor, `<b>In the band:</b> ${bm.quirkDesc}`],
    });
  }
  for (const id of run.hustles || []) {
    const h = hustleById(id);
    if (h) push('gear-chip hustle-chip', `${h.icon} +$${h.moneyPerAct}/act`, {
      emoji: h.icon, title: `${h.name} (side hustle)`,
      lines: [h.blurb, `<b>Pays:</b> $${h.moneyPerAct} at every act break and at the finale.`],
    });
  }
  return chips;
}
