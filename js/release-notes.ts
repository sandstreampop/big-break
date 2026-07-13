// BIG BREAK — the player-facing changelog, newest first.
//
// One app-level log for the whole site (every game ships from one build, so
// they share one version). The shell renders it (menus.ts: the title screen's
// version chip and Settings → What's New); this module is data + types only
// and imports nothing — it sits in the shared layer under the same
// no-pack-imports rule as the rest (tools/check-engine-neutrality.mjs).
// Prose may of course NAME a game — a changelog is product metadata, like the
// README — it just can't import one.
//
// The process contract (docs/RELEASING.md, enforced by
// test/release-notes.test.mjs): a merge to main that changes what a player
// sees bumps package.json `version` AND adds an entry here, same number,
// newest first. The gate fails the build when the top entry and package.json
// disagree, so the number on the deployed title screen always has a matching
// note behind it.

export interface ReleaseNote {
  /** semver, matching package.json at the commit the entry shipped in */
  version: string;
  /** ISO date (YYYY-MM-DD) the entry was cut */
  date: string;
  /** one-line headline for the release */
  title: string;
  /** player-readable bullet points — what changed, in plain words */
  notes: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '0.2.0',
    date: '2026-07-13',
    title: 'You can now tell which version you’re playing',
    notes: [
      'Every game’s title screen shows a version chip (number · build · date) — tap it for these notes.',
      'What’s New is also in Settings, and it tells you when a newer version is waiting behind a refresh.',
      'Releases now follow a written process (docs/RELEASING.md): every player-visible change ships with a version bump and a note here, enforced by the build gates.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-07-12',
    title: 'Everything before the changelog existed',
    notes: [
      'Three games on one engine: Big Break (music), Love Island, and The Odyssey.',
      'Runs, daily challenges, the Gauntlet, trophies, career wall, saves that survive refreshes — the era before releases had numbers.',
    ],
  },
];
