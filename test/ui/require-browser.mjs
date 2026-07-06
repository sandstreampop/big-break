// Shared browserless-skip policy for the headless UI suites.
//
// A dev or agent box often has no Chromium, so the suites normally skip green
// rather than hard-fail on a missing browser. The footgun that creates: `npm
// run check` on a browserless box passes while testing nothing. CI sets
// REQUIRE_BROWSER=1, which flips a missing browser into a HARD failure — the
// gate can never go green without actually running the browser suites.
export function skipUnlessRequired(msg, { cleanup, code = 0 } = {}) {
  console.log(msg);
  if (cleanup) { try { cleanup(); } catch { /* best-effort */ } }
  if (process.env.REQUIRE_BROWSER) {
    console.error('✗ REQUIRE_BROWSER=1 is set but no usable browser was found — refusing to skip.');
    process.exit(1);
  }
  process.exit(code);
}
