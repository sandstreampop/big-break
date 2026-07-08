// BIG BREAK — UI composition root.
//
// The UI is a layered set of modules under js/ui/ — a clean dependency graph:
//   context   session state (run/meta/pack) as live bindings + pack-aware reads
//   dom       element factory, overlay engine, screen transition — pure mechanism
//   gates · feeds · inspectors · hud   leaf render helpers (forward edges only)
//   nav       the ONE navigation contract every screen calls through (Nav)
//   card · progression · endings · newrun · menus   the deep screen modules
// No screen module imports another — they transition through `nav` — so the
// graph is a DAG. This file is the top of it: it binds every screen renderer
// into the nav seam (the one place they are named) and boots the app. It is
// the only module allowed to know all the screens.

import * as engine from './engine.js';
import * as save from './save.js';
import type { Pack } from './types.js';
import { registerArt } from './art.js';
import { sfx, music, setSoundEnabled, setMusicEnabled, initAudio } from './audio.js';
import { initAnalytics, track } from './analytics.js';
import { PRES, meta, run, selectPack, setMeta } from './ui/context.js';
import { $, show, healStaleStylesheets, topOverlay, anyOverlayActive, registerImageVariants } from './ui/dom.js';
import { nav, type Nav } from './ui/nav.js';
import { dealCard, commitSwipe } from './ui/card.js';
import { renderCrossroads, actInterstitial, renderFinalSet } from './ui/progression.js';
import { renderFinale, renderGameOver } from './ui/endings.js';
import { startNewRun, startTutorial, resumeRun, renderTutorialEnd } from './ui/newrun.js';
import { renderTitle, renderWall } from './ui/menus.js';

// The composition root: bind every screen renderer into the navigation seam.
// This is the ONE place the concrete screens are named — the `: Nav` annotation
// makes a missing or misnamed transition a compile error. Every other module
// calls through `nav`, never each other.
const wiring: Nav = {
  dealCard,
  crossroads: renderCrossroads,
  actInterstitial,
  finalSet: renderFinalSet,
  finale: renderFinale,
  gameOver: renderGameOver,
  tutorialEnd: renderTutorialEnd,
  newRun: startNewRun,
  startTutorial,
  resumeRun,
  title: renderTitle,
  wall: renderWall,
};

export function boot(pack: Pack) {
  Object.assign(nav, wiring);
  // Guard the CSS↔JS pairing before anything renders; re-check once the DOM
  // (and any still-streaming stylesheet) has settled.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', healStaleStylesheets, { once: true });
  } else {
    healStaleStylesheets();
  }
  // Select this session's game. Music keeps the original save keys (existing
  // players' careers survive); other packs get their own namespace so the two
  // games never clobber each other's meta or in-progress run.
  selectPack(pack);
  registerArt(PRES.art); // a pack's own art slots join the scene painter
  registerImageVariants(PRES.imageVariants); // a pack's responsive portraits join the <picture> layer
  save.setSaveNamespace(pack.saveNamespace ?? pack.id);
  setMeta(save.loadMeta());
  engine.useContentPack(pack); // this game's content; set before any engine call
  initAnalytics(meta.settings, pack.id);
  // Protect the run: an unresolvable gate key (a content typo) falls back to 0
  // in the engine rather than crashing; the shell routes the anomaly to
  // telemetry so it's caught, and warns in the console for dev visibility.
  engine.setGateAnomalyReporter((key) => {
    track('gate_anomaly', { key });
    try { console.error(`[gate] unresolved key '${key}' — read as 0 (content typo?)`); } catch { /* noop */ }
  });
  setSoundEnabled(meta.settings.sound);
  setMusicEnabled(meta.settings.music !== false);
  music.setMood('title');
  document.body.classList.toggle('big-text', !!meta.settings.bigText);
  document.addEventListener('pointerdown', initAudio, { once: true });
  // Keyboard support: arrow keys swipe, when a card is up and no overlay
  document.addEventListener('keydown', (e) => {
    if (!$('#screen-game').classList.contains('active')) return;
    if (anyOverlayActive()) return; // a modal (incl. the lightbox layer) has focus
    if (e.key === 'ArrowLeft') commitSwipe('left');
    else if (e.key === 'ArrowRight') commitSwipe('right');
  });
  nav.title();
  show('#screen-title');
  installBackGuard();
  installPersistOnHide();
}

// X5/R7: iOS aggressively freezes and often COLD-RELOADS a backgrounded tab or
// standalone app (in-memory state lost). The run is already saved on every swipe,
// but a minigame in progress or an armed encore between saves could be lost — so
// flush the run and meta the instant we lose visibility (visibilitychange:hidden
// is the reliable mobile signal; pagehide is the belt-and-suspenders for older
// WebKit that doesn't always fire it). Writes are try/catch-wrapped in save.js.
function installPersistOnHide() {
  const flush = () => {
    try {
      if (run && run.phase !== 'ended') save.saveRun(run);
      save.saveMeta(meta);
    } catch (e) { /* storage unavailable — nothing more we can do */ }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}

// Android Back / gesture guard. iOS has no Back button, so navigation was pure
// screen-swapping with no history integration — meaning on Android the hardware
// Back button unloads the whole PWA mid-run (rage-quit / lost screen). We keep a
// single "trap" history entry so Back never unloads the game: it dismisses an
// open overlay exactly as a tap would (running that overlay's continue handler),
// or returns to the title from any in-game screen (the run is saved on every
// swipe, so nothing is lost). On the title with nothing left to trap, Back is
// allowed to proceed so the user can still leave.
function installBackGuard() {
  try { history.pushState({ bb: 1 }, ''); } catch (e) { /* history unavailable */ }
  window.addEventListener('popstate', () => {
    // Dismiss the TOPMOST overlay layer (the lightbox before the sheet beneath
    // it), so Back peels one layer at a time instead of blowing past them.
    const ov = topOverlay();
    if (ov) {
      try { history.pushState({ bb: 1 }, ''); } catch (e) {}
      ov.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return;
    }
    if (!$('#screen-title').classList.contains('active')) {
      try { history.pushState({ bb: 1 }, ''); } catch (e) {}
      show('#screen-title');
      nav.title();
      sfx.ui();
      return;
    }
    // On the title with no trap left — let Back exit the app.
  });
}

