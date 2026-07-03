// The iOS device matrix the WebKit harness runs against.
//
// The game was built and QA'd on iOS first, but the iOS build has NEVER been
// defended by an automated harness (docs/mobile-compat-handoff.md §1). This
// matrix mirrors the Android one's shape — a modern flagship, a common modern
// phone, a NARROW/older device (layout stress), and a synthetic "Safari toolbars
// visible" short-viewport profile — adapted to iPhone descriptors.
//
// Each entry names a Playwright built-in iPhone descriptor (real UA + viewport +
// deviceScaleFactor + hasTouch/isMobile, defaultBrowserType: 'webkit') plus an
// optional viewport override. Note Playwright's iPhone viewports are already
// shorter than the physical screen (they bake in Safari's chrome); the explicit
// urlbar profile makes the toolbar stand-in deterministic on top of that.

/** @param {import('playwright').devices} devices */
export function buildMatrix(devices) {
  const pick = (name) => {
    const d = devices[name];
    if (!d) throw new Error(`Playwright has no device descriptor "${name}"`);
    return d;
  };

  const modern = pick('iPhone 15 Pro');

  return [
    { id: 'iphone-15-pro', label: 'iPhone 15 Pro (modern flagship)', descriptor: modern, tier: 'modern' },
    { id: 'iphone-14', label: 'iPhone 14 (common modern)', descriptor: pick('iPhone 14'), tier: 'modern' },
    // iPhone SE: 320px CSS width AND an older iOS-10 UA — the layout stress case
    // and the pre-15.4 (no svh) fallback case in one device.
    { id: 'iphone-se', label: 'iPhone SE (narrow 320px, older iOS UA)', descriptor: pick('iPhone SE'), tier: 'small' },
    {
      id: 'iphone-15-pro-urlbar',
      label: 'iPhone 15 Pro with Safari toolbars visible (short viewport)',
      // Same device, ~120px shorter: the state the app FIRST paints in on iOS
      // Safari before the URL bar collapses. iOS's bar animates differently from
      // Android's and this transition was never felt by an automated test.
      descriptor: { ...modern, viewport: { ...modern.viewport, height: modern.viewport.height - 120 } },
      tier: 'urlbar',
    },
  ];
}
