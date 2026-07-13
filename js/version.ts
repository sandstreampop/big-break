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

// The player-facing release identity, stamped by the same build step:
//   APP_VERSION  package.json `version` — the number a release note is filed
//                under (docs/RELEASING.md is the process; test/release-notes
//                .test.mjs is the gate that keeps notes and number in step).
//   BUILD_SHA    short git commit the build was cut from ('+dev' when the
//                tree was dirty), so the deployed site is checkable against
//                the repo at a glance.
//   BUILD_DATE   the commit date (not wall clock — a rebuild of the same
//                commit stamps identically).
// All three render in the title screen's version chip and the What's-New
// overlay (js/ui/menus.ts) — the "am I seeing the right deploy?" surface.
export const APP_VERSION = 'dev';
export const BUILD_SHA = '';
export const BUILD_DATE = '';
