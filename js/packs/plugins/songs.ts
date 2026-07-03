// Songs / charts subsystem, extracted behind the plugin interface (Phase 4.5).
// This is the load-bearing subsystem for the hitfactory win-path, so the
// extraction is deliberately surgical: the song EFFECT handlers (write, hype,
// release, album, polish, chartTitle) run in onEffect at the exact spot the
// old inline block did; the act-break chart tick + deadline audit run in
// onActBreak (after the band plugin); the finale's last chart week runs in
// onFinale. All of it calls the engine's existing song machinery (addSong,
// releaseSong, chartTick, deadlineAudit, crownCheck…), so seeded behavior is
// unchanged and the golden holds.
//
// NOTE on hits: the "instant classic" (effects.hits) stays in the engine's
// resource loop, and crownCheck increments state.hits from chartTick. Both
// increment sites remain engine-side and untouched — no double-count, no
// re-baseline. A pack that omits this plugin simply never charts songs.

import { addSong, releaseSong, chartTick, deadlineAudit } from '../../engine.js';
import { collabArtistFor, songName } from '../../charts.js';
import { genreById } from '../../data/genres.js';
import { equippedActive } from '../../data/accessories.js';
import type { Plugin } from '../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const songsPlugin: Plugin = {
  id: 'songs',
  effectVerbs: ['hits', 'chartTitle', 'hypeSong', 'albumDrop', 'releaseDemo', 'polishDemo', 'writeSong'],

  // The songs eligibility predicates (WP1): demos in the vault, songs on the
  // chart, total written, faded-but-charted. Registered here so the shared
  // Requires names no song machinery.
  requires: {
    demoMin: (s, arg) => (s.songs || []).filter((x: any) => x.status === 'demo').length >= arg,
    chartingMin: (s, arg) => (s.songs || []).filter((x: any) => x.status === 'charting' && x.pos).length >= arg,
    songsMin: (s, arg) => (s.songs || []).length >= arg,
    fadedMin: (s, arg) => (s.songs || []).filter((x: any) => x.status === 'faded' && x.peak).length >= arg,
  },

  // The Old Notebook perk: every career starts with one demo already taped.
  // Moved here from the engine (D.2) so song NAMING lives with the songs
  // subsystem — the last thing that made the core import charts.ts. Fires at
  // the tail of newRun, so its seeded draw lands exactly where it used to.
  onRunStart(state, rng) {
    if (!(state.perks || []).includes('notebook')) return;
    addSong(state, { title: songName(rng), status: 'demo', quality: 46 + Math.floor(rng() * 16) });
    state.flags.push('notebook_demo'); // events/epilogue can reference it
  },

  // #region apply-resource
  // The 'hits' resource is the songs subsystem's (an "instant classic" mints a
  // charting song). Applied at the resource's ordinal slot in applyEffects, so
  // the RNG stream and delta order match the old engine-inline block byte-for-
  // byte. Returns the hits delta; pushes song debuts onto ctx.deltas.
  applyResource(res, effects, state, ctx) {
    if (res !== 'hits') return undefined; // decline — not ours
    const n = (effects as any).hits || 0;
    if (!n) return 0; // claim it, nothing to mint
    const { deltas, rng, ev } = ctx as any;
    for (let i = 0; i < n; i++) {
      const s = addSong(state, {
        title: effects.chartTitle
          ? effects.chartTitle.replace('{collabArtist}', collabArtistFor(state))
          : songName(rng, genreById(state.genre)),
        quality: 68 + Math.round((rng ? rng() : 0.5) * 12),
        origin: ev?.id || null, status: 'charting', hype: 60,
      });
      if (!s.crowned) { s.crowned = true; state.hits += 1; }
      (deltas.songDebuts = deltas.songDebuts || []).push({ title: s.title, pos: s.pos, hit: true, viral: !!s.viral });
    }
    ctx.chartTitleHandled = !!effects.chartTitle;
    return n;
  },
  // #endregion apply-resource

  onEffect(state, effects, ctx) {
    const { deltas, hooks = {}, mg = null, tier, rng, ev } = ctx;
    const accs = equippedActive(state);
    if (effects.chartTitle && !ctx.chartTitleHandled) {
      const tierQ = tier === 'incredible' ? 66 : tier === 'good' ? 58 : 50;
      const s = addSong(state, {
        title: effects.chartTitle.replace('{collabArtist}', collabArtistFor(state)),
        quality: tierQ, origin: ev?.id || null, status: 'charting', hype: 62,
      });
      (deltas.songDebuts = deltas.songDebuts || []).push({ title: s.title, pos: s.pos, hit: s.crowned, viral: !!s.viral });
    }
    if (effects.hypeSong) {
      // Promo: pour hype into your best charting song. Hype decays hard every
      // chart week (×0.55), so this is how a song SURVIVES.
      const charting = (state.songs || []).filter((s) => s.status === 'charting' && s.pos);
      if (charting.length) {
        const top = charting.slice().sort((a, b) => a.pos! - b.pos!)[0];
        top.hype = clamp(top.hype + effects.hypeSong, 0, 100);
        deltas.songHyped = { title: top.title, hype: top.hype, gain: effects.hypeSong };
      }
    }
    if (effects.albumDrop) {
      // THE ALBUM: everything ships at once. Every vault demo releases with the
      // album's hype; every charting song gets the halo bump.
      const hype = (typeof effects.albumDrop === 'number' ? effects.albumDrop : 60) + (hooks.releaseHype || 0) + accs.reduce((n, a) => n + (a.releaseHype || 0), 0) + ((state.perks || []).includes('promoter') ? 6 : 0);
      const demos = (state.songs || []).filter((s) => s.status === 'demo');
      for (const d of demos) {
        releaseSong(state, d.id, hype);
        (deltas.songDebuts = deltas.songDebuts || []).push({ title: d.title, pos: d.pos, hit: d.crowned, released: true, viral: !!d.viral });
      }
      for (const s of (state.songs || []).filter((x) => x.status === 'charting' && x.pos && !demos.includes(x))) {
        s.hype = clamp(s.hype + 12, 0, 100);
      }
      deltas.albumOut = { tracks: demos.length };
    }
    if (effects.releaseDemo) {
      // Release day: your best demo goes to the chart.
      const demos = (state.songs || []).filter((s) => s.status === 'demo');
      if (demos.length) {
        const best = demos.slice().sort((a, b) => b.quality - a.quality)[0];
        const hype = (typeof effects.releaseDemo === 'number' ? effects.releaseDemo : 55) + (hooks.releaseHype || 0) + accs.reduce((n, a) => n + (a.releaseHype || 0), 0) + ((state.perks || []).includes('promoter') ? 6 : 0);
        releaseSong(state, best.id, hype);
        (deltas.songDebuts = deltas.songDebuts || []).push({ title: best.title, pos: best.pos, hit: best.crowned, released: true, viral: !!best.viral });
      }
    }
    if (effects.polishDemo) {
      // The vault appreciates: unreleased material gets better.
      const demos = (state.songs || []).filter((s) => s.status === 'demo');
      if (demos.length) {
        const best = demos.slice().sort((a, b) => b.quality - a.quality)[0];
        best.quality = clamp(best.quality + effects.polishDemo, 1, 100);
        deltas.songPolished = { title: best.title, quality: best.quality, gain: effects.polishDemo };
      }
    }
    if (effects.writeSong) {
      // Songwriting writes a REAL song: quality reads the outcome tier, the
      // writing minigame, and creativity. A grabbed hook becomes the title.
      const base = tier === 'incredible' ? 64 : tier === 'good' ? 50 : 36;
      const verdictAdj = { BOTCHED: -10, SCRAPPY: 0, SOLID: 8, GOLDEN: 16 }[mg?.label as string] || 0;
      const creaAdj = Math.round(((state.stats.creativity || 0) - 40) * 0.2);
      const gearAdj = accs.reduce((n, a) => n + (a.demoQuality || 0), 0);
      const perkAdj = (state.perks || []).includes('golden_ears') ? 6 : 0;
      const instAdj = (hooks.demoQuality || 0) + gearAdj + perkAdj;
      const jit = Math.round((rng ? rng() : 0.5) * 10 - 5);
      const grabbedHooks = mg?.hooks || [];
      const title = grabbedHooks.length
        ? grabbedHooks[Math.floor((rng ? rng() : 0.5) * grabbedHooks.length)].replace(/(^|\s)[a-z]/g, (c: string) => c.toUpperCase())
        : songName(rng, genreById(state.genre));
      const s = addSong(state, {
        title, quality: base + verdictAdj + creaAdj + instAdj + jit,
        origin: ev?.id || null, status: 'demo',
      });
      deltas.songWritten = { title: s.title, quality: s.quality, fromHook: grabbedHooks.length > 0 };
    }
    ctx.chartTitleHandled = false; // reset the per-resolution handshake
  },

  // #region act-break
  // Act break: audit the act that just ended for a shipped release, then run a
  // chart week. Fires after the band plugin, matching the old inline order.
  onActBreak(state, act, notes) {
    notes.push(...deadlineAudit(state, act - 1));
    notes.push(...chartTick(state));
  },

  // One last chart week before the career is judged.
  onFinale(state) {
    chartTick(state);
  },
  // #endregion act-break
};
