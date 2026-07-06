// The default end-of-run share string (the "growth surface": the exact text a
// player copies out). The music game and any pack without its own
// presenter.shareText use it. Kept genre-neutral and DOM-free: every
// genre-specific piece (loadout name, composed path label, fail labels) is
// resolved by the caller and passed in, so this module names no genre and can
// be snapshot-tested without a browser.

export const SHARE_TIER_EMOJI: Record<string, string> =
  { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };

// Short verdict labels for the default pack's fail-state endings. A pack
// overrides via presenter.failLabels.
export const DEFAULT_FAIL_LABELS: Record<string, string> =
  { burnout: 'BURNED OUT', cancelled: 'CANCELLED', debt: 'REPOSSESSED' };

export interface ShareDeps {
  loadoutName: string | null;              // instrument/persona display name
  pathName: string;                        // composed path label (e.g. "Indie The Hitmaker")
  failLabels?: Record<string, string>;     // pack override, else DEFAULT_FAIL_LABELS
  url: string;
}

export function buildDefaultShareText(summary: any, lp: number, deps: ShareDeps): string {
  const head = summary.gauntlet ? `BIG BREAK Gauntlet ${summary.gauntlet}`
    : summary.daily ? `BIG BREAK Daily ${summary.daily}` : 'BIG BREAK';
  const res = summary.result ? summary.result.toUpperCase()
    : (deps.failLabels || DEFAULT_FAIL_LABELS)[summary.endingKey] || 'GAME OVER';
  const line = (summary.tierLog || []).map((t: string) => SHARE_TIER_EMOJI[t] || '⬜').join('');
  const peak = summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : '';
  return `${head}\n${deps.loadoutName ?? '?'} → ${deps.pathName} → ${res}\n${line}\n★${summary.fame}${peak} · +${lp} LP\n${deps.url}`;
}
