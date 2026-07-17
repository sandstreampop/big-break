// The site directory (pass 50) is pinned to the pack registry BOTH ways: a
// registered game missing from js/games.ts would ship invisible (no front
// door names it), and a directory entry with no registered pack would be a
// dead link on every title screen. Either drift fails here, not in a
// player's thumb. The display names are pinned to each game's own title
// logo, so the directory can never call a game something its front door
// doesn't.

import test from 'node:test';
import assert from 'node:assert';
import { GAMES, ROOT_GAME, otherGames, gameHref } from '../dist/js/games.js';
import { GAME_PACKS } from '../dist/js/packs/registry.js';

test('the directory and the registry name exactly the same games, in order', () => {
  assert.deepStrictEqual(GAMES.map((g) => g.id), GAME_PACKS.map((p) => p.id));
});

test('the root game is registered and stays the build root', () => {
  assert.ok(GAME_PACKS.some((p) => p.id === ROOT_GAME), 'ROOT_GAME must be a registered pack');
  // tools/build.mjs hardcodes music as the site root (index.html); if that
  // ever changes, gameHref's layout arithmetic changes with it — this pin
  // makes that a deliberate two-file edit instead of a silent 404.
  assert.strictEqual(ROOT_GAME, 'music');
});

test('every entry names its game the way the game names itself', () => {
  for (const g of GAMES) {
    const pack = GAME_PACKS.find((p) => p.id === g.id);
    const logo = String(pack?.presenter?.title?.logo || '').replace(/<br\s*\/?>/g, ' ');
    assert.strictEqual(g.name, logo, `${g.id}: directory name vs title logo`);
    assert.ok(g.tag && g.tag.length <= 80, `${g.id}: tag present and tooltip-sized`);
  }
});

test('otherGames always excludes the host and keeps everyone else', () => {
  for (const g of GAMES) {
    const others = otherGames(g.id);
    assert.strictEqual(others.length, GAMES.length - 1, g.id);
    assert.ok(!others.some((o) => o.id === g.id), g.id);
  }
});

test('gameHref walks the built site layout from every page to every other', () => {
  assert.strictEqual(gameHref('music', 'odyssey'), 'odyssey/');
  assert.strictEqual(gameHref('music', 'love-island'), 'love-island/');
  assert.strictEqual(gameHref('odyssey', 'music'), '../');
  assert.strictEqual(gameHref('odyssey', 'love-island'), '../love-island/');
  assert.strictEqual(gameHref('love-island', 'odyssey'), '../odyssey/');
  assert.strictEqual(gameHref('love-island', 'music'), '../');
});
