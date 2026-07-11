// The Odyssey — the stroke (I1): the swipe feel profile behind the core
// gesture, performed ~28 times a run. Drag carries water-resistance (the
// card is an oar pulled through water — displacement saturates as the pull
// deepens); release is one stroke — the commit animation sweeps the card
// flat across the band in vase-frames (css/odyssey.css `.ody-stroke`,
// steps() per the Motion Law), and the arm tick is a single firm knock.
// Pure math here; the shell's thresholds read RAW dx, so resistance changes
// how the pull LOOKS, never how far the finger must travel to commit.

import type { Presenter } from '../../types.js';

// Saturating pull: near-1:1 for the first few pixels, flattening toward
// ~120px of visual travel however hard the finger hauls. tanh keeps the
// response smooth and monotonic; the water gives, then holds.
const REACH = 120;
const GIVE = 150;

export const odysseyFeel: NonNullable<Presenter['feel']> = {
  drag(dx: number, dy: number) {
    const pull = Math.tanh(Math.abs(dx) / GIVE) * REACH * Math.sign(dx);
    return {
      x: pull,
      y: dy * 0.08,          // the water damps vertical wander harder
      rot: pull * 0.02,      // barely any tilt — an oar, not a playing card
    };
  },
  commitClass: 'ody-stroke',
  armVibrate: [14],          // one firm knock at the point of no return
};
