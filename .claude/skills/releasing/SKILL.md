---
name: releasing
description: Cut a release of big-break — version bump, release notes, and the tag/release workflow. Use when shipping a player-visible change to main, bumping the version, writing release notes, or cutting a tag.
---

# Releasing

The full process is `docs/RELEASING.md` — read it before cutting anything. This
skill is the short form plus the two things that bite.

## Every merge to main that changes what a player sees

Both of these, in the same merge:

1. Bump `version` in `package.json` — it is the source of truth for the number.
2. Add the matching **top** entry in `js/release-notes.ts`.

`test/release-notes.test.mjs` gates the pair, so a bump without notes (or notes
without a bump) fails `npm run ci`. The build stamps version + git sha + commit
date into every title screen's version chip, so the deployed URL is checkable
against main at a glance.

## Cutting a tag / GitHub release

**Sessions cannot push tag refs** — the managed git gateway allows branch
pushes only. Do not try; use the workflow instead:

- GitHub → Actions → **"Cut a release"** (`.github/workflows/release.yml`), or a
  `workflow_dispatch` with `tag` + the **full 40-char** `sha`.
- It runs with the built-in `GITHUB_TOKEN` — no extra credentials needed.
