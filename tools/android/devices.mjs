// The Android device matrix the harness runs against.
//
// The game was developed and tested on iOS only (see js/platform.ts — every
// guard in it is iOS-specific). Telemetry now shows Android players, and their
// engagement is a fraction of iOS's (see tools/android/README.md). This matrix
// is deliberately spread across the *shape* of the Android install base that
// iOS never exercises:
//   - a modern flagship (baseline: if this is broken, everything is)
//   - a modern Samsung (the single most common Android OEM)
//   - a NARROW, older mid-ranger (320px CSS width — the layout stress case)
//   - a common mid-range Pixel
//   - a synthetic "URL bar visible" profile: the same flagship but ~120px
//     shorter, modelling Chrome's address bar occupying the viewport before
//     the user scrolls. iOS Safari's bar behaves differently and this
//     transition was never felt on iOS.
//
// Each entry names a Playwright built-in descriptor (real UA + viewport +
// deviceScaleFactor + hasTouch/isMobile) plus an optional viewport override.

/** @param {import('playwright').devices} devices */
export function buildMatrix(devices) {
  const pick = (name) => {
    const d = devices[name];
    if (!d) throw new Error(`Playwright has no device descriptor "${name}"`);
    return d;
  };

  const pixel7 = pick('Pixel 7');

  return [
    { id: 'pixel-7', label: 'Pixel 7 (modern flagship)', descriptor: pixel7, tier: 'modern' },
    { id: 'galaxy-s24', label: 'Galaxy S24 (modern Samsung)', descriptor: pick('Galaxy S24'), tier: 'modern' },
    { id: 'pixel-5', label: 'Pixel 5 (common mid-range)', descriptor: pick('Pixel 5'), tier: 'mid' },
    { id: 'galaxy-s9', label: 'Galaxy S9+ (narrow 320px, older)', descriptor: pick('Galaxy S9+'), tier: 'small' },
    {
      id: 'pixel-7-urlbar',
      label: 'Pixel 7 with URL bar visible (short viewport)',
      // Same device, but the visible viewport is shorter because Chrome's
      // address bar is on screen. This is the state the app FIRST paints in
      // on Android, before any scroll collapses the bar.
      descriptor: { ...pixel7, viewport: { ...pixel7.viewport, height: pixel7.viewport.height - 120 } },
      tier: 'urlbar',
    },
  ];
}
