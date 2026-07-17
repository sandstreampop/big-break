// BIG BREAK — the site's game directory: product metadata, the changelog's
// sibling (js/release-notes.ts). One build ships every game — music at the
// site root, every other registered pack at /<id>/ (tools/build.mjs) — but
// nothing on any title screen said the others existed, so a player who
// arrived at one game had no road to the rest. This module is the ONE place
// the directory lives; the shell renders it generically (menus.ts) and
// test/games-directory.test.mjs pins it to the pack registry both ways, so a
// fourth game can't ship invisible and a retired one can't linger here.
//
// Same neutrality license as the changelog: metadata may NAME a game — it
// just can't import one. This module imports nothing.

/** The pack served at the site root (tools/build.mjs: music is index.html). */
export const ROOT_GAME = 'music';

export interface GameEntry {
  /** pack id — must match a registered GAME_PACKS id (executable invariant) */
  id: string;
  /** player-facing name, spelled the way the game's own title logo spells it */
  name: string;
  /** one-breath hook, shown as the link's tooltip */
  tag: string;
}

export const GAMES: GameEntry[] = [
  { id: 'music', name: 'BIG BREAK', tag: 'Take a band from the garage to the arena.' },
  { id: 'love-island', name: 'THE VILLA', tag: 'Survive paradise, one recoupling at a time.' },
  { id: 'odyssey', name: 'THE ODYSSEY', tag: 'Row the long way home.' },
];

/** Every game except the one being played — the title screen's directory row. */
export function otherGames(currentId: string): GameEntry[] {
  return GAMES.filter((g) => g.id !== currentId);
}

/**
 * Relative href from one game's page to another's. Relative on purpose: the
 * site deploys under a project path (/big-break/ on Pages, / in the smoke
 * server), so absolute paths would break one host or the other. The layout is
 * build.mjs's: the root game at ./, every other game a sibling at ../<id>/
 * (or <id>/ seen from the root).
 *
 * These paths rely on every game page being served AT a trailing-slash URL
 * ('../' from /big-break/odyssey resolves to the domain root, not the site).
 * Safe by construction on both hosts: GitHub Pages 301-redirects directory
 * URLs to the slash form before the document loads, and the local test
 * server serves the slash form directly.
 */
export function gameHref(fromId: string, toId: string): string {
  const up = fromId === ROOT_GAME ? '' : '../';
  return toId === ROOT_GAME ? (up || './') : `${up}${toId}/`;
}
