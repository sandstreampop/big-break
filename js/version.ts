// The CSS↔JS delivery contract. The build (tools/build.mjs) stamps the
// deployed stylesheet's content hash BOTH here (rewriting dist/js/version.js)
// and into dist/css/style.css as `:root { --bb-css-v: "<hash>" }`. At boot the
// UI shell compares the two: a mismatch means the client is running mixed
// deploys — e.g. fresh JS with a stale cached stylesheet, the bug class where
// new markup renders unstyled and the layout collapses on phones — and the
// shell re-pulls the stylesheets past every cache (see healStaleStylesheets in
// js/ui.ts, pinned by test/ui-mobile-matrix.mjs's skew-heal pass).
//
// 'dev' is the unstamped source value; the boot check is a no-op under it, so
// running straight from tsc output (no build step) never self-heals in a loop.
export const CSS_CONTRACT = 'dev';
