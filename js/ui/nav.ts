// BIG BREAK — the navigation seam.
//
// The screens form a cycle by nature: you deal cards, hit the crossroads,
// play the finale, see an ending, then run it back — every screen can reach
// most others. Wired as direct imports that graph is a tangle of import
// cycles. This module cuts it: `Nav` is the ONE narrow contract for every
// transition between screens, and every screen calls `nav.<transition>()`
// instead of importing a sibling. No screen module imports another; they all
// depend only on this abstraction (dependency inversion), so the module graph
// is a clean DAG. Read `Nav` and you have the whole flow of the game on one
// screen. The composition root (ui.ts boot) fills `nav` with the concrete
// screen renderers once, at startup.

import * as save from '../save.js';
import { run, PRES } from './context.js';

// Every way the game moves from one screen to another. The single source of
// truth for the game's flow — adding a screen adds one method here, and only
// the composition root and the new screen module change.
export interface Nav {
  dealCard(): void;                          // deal the next card (the run loop)
  crossroads(): void;                        // the Act-1 path choice
  actInterstitial(step: any): void;          // the act break "previously on"
  brammies(step: any): void;                 // a pack's act-start set piece
  finalSet(): void;                          // the pre-finale closer choice
  finale(): void;                            // judge the run, show the ending
  gameOver(endingKey: string): void;         // a fail-state ending
  tutorialEnd(): void;                       // the First Gig wrap-up
  newRun(daily?: boolean, comeback?: boolean): void;
  startTutorial(): void;
  startGauntlet(): void;
  resumeRun(): void;                          // continue a saved run at its phase
  title(): void;                             // the title screen
  wall(): void;                              // the Career Wall
}

// The singleton every screen calls through. It is assembled once by the
// composition root; until then its slots are empty (nothing renders before
// boot), which is why it is typed as a partial and filled via Object.assign.
export const nav = {} as Nav;

// The engine's advance() returns a Step describing what comes next; this maps
// each step kind onto a transition. It's the only place that reads a Step, and
// it dispatches through `nav` so it needs no import of any screen module.
export function routeAdvance(step) {
  save.saveRun(run);
  switch (step.kind) {
    case 'card': nav.dealCard(); break;
    case 'crossroads': nav.crossroads(); break;
    case 'actStart':
      // A pack may intercept the act-start with its own special overlay
      // (music's Brammies before the final act); the trigger condition lives
      // in the pack's presenter, not hardcoded here.
      if (PRES.actStartOverlay?.(run)) nav.brammies(step);
      else nav.actInterstitial(step);
      break;
    case 'finale': nav.finalSet(); break;
    case 'gameover': nav.gameOver(step.endingKey); break;
    case 'tutorialEnd': nav.tutorialEnd(); break;
  }
}
