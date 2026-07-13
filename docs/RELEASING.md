# Releasing — the versioning process

The problem this process exists to kill: standing on the deployed site and not
knowing, immediately and without question, whether you're seeing the version
you think you shipped. The answer is a **release identity that is visible in
the app, stamped by the build, and gated so it can't drift**.

## The scheme

Semver, `MAJOR.MINOR.PATCH`. **`package.json` `version` is the single source
of truth for the number** (it already is for tags — see the release workflow
note in CLAUDE.md).

- **PATCH** — fixes, balance/content tuning, copy. Nothing new to learn.
- **MINOR** — a new player-visible feature, mode, screen, or game.
- **MAJOR** — an era: breaking saves, or a change that redefines the product.

## The rule that binds every merge to main

> A merge that changes **what a player sees or plays** bumps `package.json`
> `version` AND adds a matching entry at the **top** of `js/release-notes.ts`
> — same number, ISO date, a player-readable headline + bullets.

Internal-only merges (docs, tests, tooling, CI) don't bump. When in doubt,
bump — a spare patch number is free; an unexplained change on the deployed
site is not.

This is executable, not commentary (`test/release-notes.test.mjs`, in the
`node --test` CI gate):

- the built `dist/js/version.js` `APP_VERSION` equals `package.json` —
  the stamp can't rot;
- the **top** release note equals `package.json` — bump without a note, or
  note without a bump, fails the build;
- every entry is well-formed (semver, ISO date, non-empty notes) and the log
  is newest-first with no duplicate versions.

What the test *cannot* see is a player-visible change merged with **no** bump
at all — that half of the rule is on the author (this file), and the review
prompt for it is in CLAUDE.md.

## What the build stamps, and what the player sees

`tools/build.mjs` writes into `dist/js/version.js` (source defaults live in
`js/version.ts`, `'dev'`/empty until stamped):

- `APP_VERSION` — from `package.json`;
- `BUILD_SHA` — `git rev-parse --short HEAD` (`+dev` suffix when the tree was
  dirty, so an ad-hoc local build can never impersonate a release);
- `BUILD_DATE` — the **commit** date, not wall clock: rebuilding the same
  commit stamps identically.

Every game's title screen renders the **version chip** (top-right):
`v0.2.0 · a1b2c3d · 2026-07-13` — the one assembly of that string is
`versionLabel()` in `js/release-notes.ts`, rendered identically by the chip
and the sheet. On the odyssey the chip carries `data-veil-exempt`, the generic
contract the threshold veil honors (`css/odyssey.css`), so it's readable from
the very first frame; a future veiling pack copies the
`:not([data-veil-exempt])` guards, not a shell class name. Tapping the chip
(or Settings → *What's new*) opens the release-notes sheet. `notesSkewed()`
cross-checks the stamped version against the top note at runtime: the chip
wears ⚠ (and reports `version_skew` to telemetry), and the sheet explains
"mixed delivery — refresh" (the service worker caches modules individually,
so halves of two deploys can meet; see INCIDENTS #6 for the CSS flavor of
this bug class).

Browser coverage (`test/ui/smoke.mjs`): the chip is driven on every game's
title — text matches the stamped version, the sheet's top note matches, the
mixed-delivery warning is absent on a clean build, and the run still reaches
its finale afterwards; on the odyssey, the chip is additionally asserted
visible under the veil, and reading the notes must not kindle the fire.

## Verifying a deploy (the 30-second check)

1. Open the game — e.g. <https://sandstreampop.github.io/big-break/odyssey/>.
2. Read the chip. The **sha** must equal `main`'s HEAD (short); the **number**
   must equal `package.json` on that commit.
3. Tap it. The top note describes what you just shipped.

If the chip shows the old sha, the Pages deploy hasn't finished (or failed) —
check the "CI + Deploy to GitHub Pages" run. If the sheet shows the
mixed-delivery warning, a client cache is mid-update — refresh.

## Known limits (reviewed and accepted, 2026-07)

- **Stamping the sha costs JS-cache stability.** `BUILD_SHA` lives in
  `dist/js/version.js`, so the `jsV` hash — and every `?v=` JS URL — changes
  on *every* commit, including CSS-only deploys. Deliberate trade: the deploy
  identity is worth a re-fetch (the SW is network-first anyway).
- **A stale pack stylesheet can hide the odyssey chip under the veil** (old
  odyssey.css has no `data-veil-exempt` guard). Degrades safe — the chip
  appears once the fire is kindled, and the boot probe self-heals stale CSS —
  but during that exact mixed-delivery window the chip is not "first frame".
  Unfixable for already-shipped sheets.
- **Export-shape skew**: adding named exports to a shared module (as 0.2.0
  did to `js/version.ts`) can crash a client whose SW cache holds the old
  module beside fresh importers. **Rule: bump `sw.js` `CACHE` on any deploy
  that changes a shared module's export shape** (0.2.0 → `bigbreak-v30`).
- **A player-visible change merged with no bump at all** is not
  machine-caught (a jsV-based gate would fire on every commit, because the
  sha is in the hash). The author owns that half; "when in doubt, bump".

## Cutting a numbered GitHub release (optional)

The number on main is the release; a git tag is ceremony for milestones.
Sessions can't push tag refs — use the `release.yml` workflow
(Actions → "Cut a release") with the tag and the full 40-char sha.
