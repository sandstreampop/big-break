// Drift-proof code transclusion.
//
// Every code sample on this site that shows real engine/pack code is pulled
// from the actual source with Vite's `?raw` import, then sliced here — never
// retyped into a fenced block. If the source changes, the sample changes with
// it; if a named region is deleted or renamed, `region()` THROWS and the docs
// build fails. That throw is the drift gate: a sample can never silently go
// stale, because a missing region is a hard build error, not a wrong-but-
// rendering block.
//
// Regions are marked in the source with a pair of line comments:
//
//   // #region manifest
//   const manifest: PackManifest = { ... };
//   // #endregion manifest
//
// The markers themselves are stripped from the emitted sample.

/** Strip a trailing newline so `<Code>` doesn't render a blank final line. */
export function whole(raw: string): string {
  return raw.replace(/\n$/, '');
}

/**
 * Return the source between `// #region NAME` and `// #endregion NAME`,
 * with the marker lines removed and shared leading indentation dedented.
 * Throws if the region is missing — that is the drift gate.
 */
export function region(raw: string, name: string): string {
  const lines = raw.split('\n');
  const startRe = new RegExp(`//\\s*#region\\s+${escapeRe(name)}\\s*$`);
  const endRe = new RegExp(`//\\s*#endregion(\\s+${escapeRe(name)})?\\s*$`);

  let start = -1;
  let end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && startRe.test(lines[i])) {
      start = i;
      continue;
    }
    if (start !== -1 && endRe.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start === -1) {
    throw new Error(
      `snippet region "${name}" not found. A transcluded sample points at a ` +
        `region that no longer exists — re-mark the source or fix the doc.`,
    );
  }
  if (end === -1) {
    throw new Error(`snippet region "${name}" has no matching // #endregion.`);
  }

  const body = lines.slice(start + 1, end);
  return dedent(body).join('\n').replace(/\n+$/, '');
}

function dedent(lines: string[]): string[] {
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^\s*/)?.[0].length ?? 0);
  const common = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(common));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
