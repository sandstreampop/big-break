// The Odyssey — the threshold (I5; NORTH-STAR "The threshold — kindling the
// fire"). The title screen is the fireside BEFORE the telling: near-dark, a
// cold hearth, seated silhouettes waiting, stars over the sea. The player's
// first touch KINDLES the fire — the screen warms in three vase-steps
// (~1s, steps not easing), and the menu appears as the bard's patter. The
// same tap skips (a second touch mid-kindling completes it at once).
// Resume means the fire is still burning from last time: the scene starts
// lit and the menu is simply there. Ritual, not friction.
//
// Reduced motion (OS pref or in-game toggle): the first tap lights the fire
// and lifts the veil immediately — no sequence, same ritual.
//
// Runs through the shell's titleScene seam: the shell owns the menu and the
// routing; this module owns the scene and when the veil lifts.

import type { Presenter } from '../../types.js';
import { reducedMotion, activatable } from '../../ui/dom.js';
import { fire, coldHearth, crowdWoman, crowdBoy, crowdHorseMan, emptyPlace, star, seaStrip } from './art/figures.js';

const KINDLE_STEPS = ['kindle-1', 'kindle-2', 'kindle-lit'];
const STEP_MS = 340; // three steps ≈ one second of catching flame

function sceneHtml(lit: boolean): string {
  return (
    `<div class="threshold ${lit ? 'kindle-lit' : 'threshold-dark'}${reducedMotion() ? ' px-still' : ''}">` +
    `<span class="th-star th-star-1">${star()}</span>` +
    `<span class="th-star th-star-2">${star()}</span>` +
    `<span class="th-star th-star-3">${star()}</span>` +
    `<span class="hearth-row">` +
    `<span class="fig fig-woman">${crowdWoman()}</span>` +
    `<span class="fig fig-boy">${crowdBoy()}</span>` +
    `<span class="fig fig-fire th-fire">${lit ? fire() : coldHearth()}</span>` +
    `<span class="fig fig-horse">${crowdHorseMan()}</span>` +
    `<span class="fig fig-empty">${emptyPlace()}</span>` +
    `</span>` +
    // The living threshold (pass 45): the sea the telling is about, calm,
    // running at the fireside's feet. It drifts only once the fire is lit
    // and only when motion is welcome (CSS gates on .kindle-lit and
    // :not(.px-still)); reduced motion gets the same water, still.
    `<span class="th-sea">${seaStrip('calm', 160)}</span>` +
    `</div>`
  );
}

// Once kindled, the fire burns for the whole session — returning to the
// title mid-evening must not demand the ritual again. (A fresh visit starts
// cold; Resume means it never went out.)
let litThisSession = false;

export const odysseyTitleScene: NonNullable<Presenter['titleScene']> = (host, ctx) => {
  if (ctx.resumed || litThisSession) {
    // The fire is still burning from last time — and it stays lit for the
    // rest of the evening: a resumed boot counts as kindled, or the title
    // would go cold and demand the ritual again once that run ends.
    litThisSession = true;
    host.innerHTML = sceneHtml(true);
    return false;
  }
  host.innerHTML = sceneHtml(false);
  const scene = host.firstElementChild as HTMLElement;
  let step = -1;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const finish = () => {
    if (timer) { clearTimeout(timer); timer = null; }
    litThisSession = true;
    scene.classList.remove('threshold-dark', 'kindle-1', 'kindle-2');
    scene.classList.add('kindle-lit');
    const hearth = scene.querySelector('.th-fire');
    if (hearth) hearth.innerHTML = fire();
    ctx.lift();
  };
  const advance = () => {
    step++;
    if (step >= KINDLE_STEPS.length - 1 || reducedMotion()) { finish(); return; }
    scene.classList.remove('threshold-dark');
    scene.classList.add(KINDLE_STEPS[step]);
    timer = setTimeout(advance, STEP_MS);
  };
  // First touch kindles; a touch during the kindling completes it at once.
  // Keyboard-operable too (Enter/Space) — the veiled menu is out of reach
  // until the fire lights, so the kindle itself must never need a pointer.
  activatable(host, () => {
    if (scene.classList.contains('kindle-lit')) return;
    if (step >= 0) { finish(); return; }
    advance();
  }, 'Kindle the fire');
  return true; // take the veil until the fire is lit
};
