#!/usr/bin/env node
// PreToolUse guard (working-agreement rule 6: guardrail the irreversible).
//
// Blocks a small set of genuinely destructive / hard-to-reverse shell commands
// so they become a planning-only proposal the human must confirm, rather than
// something an agent can do on its own. STRUCTURAL enforcement — the rule can't
// be forgotten, because the command won't run.
//
// Wired as a Bash PreToolUse hook in .claude/settings.json. Reads the tool call
// as JSON on stdin; exit 0 = allow, exit 2 = block (stderr is fed back to the
// agent). Behaviour is locked by test/guard-destructive.test.mjs.
//
// Design notes (both learned from an independent review of the first cut):
//  · Match STRUCTURE, not raw substrings — otherwise `git commit -m "drop the
//    rm -rf hack"` self-blocks. Quoted spans are stripped before shell-structural
//    rules run, so a pattern named inside a message is invisible to them.
//  · Detect recursive + force INDEPENDENTLY across an `rm` invocation, so the
//    split forms (`rm -r -f`, `rm -R --force`, `rm --recursive --force`) are
//    caught, not just the bundled `rm -rf`.
//  · SQL DROP/TRUNCATE is the exception: its danger lives INSIDE quotes
//    (`psql -c "DROP TABLE …"`), so it's matched on the raw command, but only
//    when a DB-client / SQL context is also present (so a commit message that
//    merely says "drop table later" is not blocked).
// It stays conservative: when in doubt it allows, and the other rules (review,
// gates, the pre-merge contract) still apply. `--force-with-lease` for a
// documented re-baseline is explicitly allowed.

import { readFileSync } from 'node:fs';

function readStdin() {
  try { return readFileSync(0, 'utf8'); } catch { return ''; }
}

let cmd = '';
try {
  cmd = String(JSON.parse(readStdin() || '{}')?.tool_input?.command ?? '');
} catch {
  process.exit(0); // unparseable input — never block on our own error
}
if (!cmd.trim()) process.exit(0);

// Remove quoted spans so a pattern named inside a string (a commit message, an
// echo) can't trip the shell-structural rules.
const stripQuotes = (s) =>
  s.replace(/'[^']*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');

const stripped = stripQuotes(cmd).replace(/\s+/g, ' ').trim();
const segments = stripped.split(/(?:&&|\|\||[;|&\n])/).map((s) => s.trim()).filter(Boolean);

// rm is dangerous when it is BOTH recursive and force, in any flag spelling.
function isDangerousRm(seg) {
  const toks = seg.split(' ').filter(Boolean);
  const idx = toks.findIndex((t) => t === 'rm' || t.endsWith('/rm'));
  if (idx === -1) return false;
  let recursive = false, force = false;
  for (const t of toks.slice(idx + 1)) {
    if (!t.startsWith('-')) continue;
    if (t === '--recursive') recursive = true;
    else if (t === '--force') force = true;
    else if (/^-[A-Za-z]+$/.test(t)) {            // bundled short flags, e.g. -rf, -r, -R, -fv
      if (/[rR]/.test(t)) recursive = true;
      if (/f/.test(t)) force = true;
    }
  }
  return recursive && force;
}

const isForcePush = (seg) =>
  /\bgit\b[^]*\bpush\b/.test(seg) &&
  !/--force-with-lease/.test(seg) &&
  (/--force(?![-\w])/.test(seg) || /(?:^|\s)-[A-Za-z]*f\b/.test(seg));

const RULES = [
  { why: 'force-push without --force-with-lease can clobber remote history irreversibly. Use --force-with-lease for a deliberate re-baseline, or confirm with the human.',
    hit: (seg) => isForcePush(seg) },
  { why: 'a remote branch/ref deletion (git push --delete / push <remote> :ref) is destructive on the shared remote — confirm first.',
    hit: (seg) => /\bgit\b[^]*\bpush\b/.test(seg) && (/(?:^|\s)--delete\b/.test(seg) || /\bpush\s+\S+\s+:\S/.test(seg)) },
  { why: 'git reset --hard discards uncommitted work and can drop commits with no easy recovery. Prefer a soft/mixed reset, or confirm.',
    hit: (seg) => /\bgit\b[^]*\breset\b[^]*--hard\b/.test(seg) },
  { why: 'git clean -f with -d/-x deletes untracked (and ignored) files irreversibly. Dry-run first (git clean -n), or confirm.',
    hit: (seg) => /\bgit\b[^]*\bclean\b/.test(seg) && /(?:^|\s)-[A-Za-z]*f/.test(seg) && /(?:^|\s)-[A-Za-z]*[dx]/.test(seg) },
  { why: 'history rewriting (filter-branch / filter-repo) is irreversible on shared history — confirm first.',
    hit: (seg) => /\bgit\b[^]*\bfilter-(?:branch|repo)\b/.test(seg) },
  { why: 'git push --mirror overwrites all remote refs — almost never intended from an agent. Confirm first.',
    hit: (seg) => /\bgit\b[^]*\bpush\b[^]*--mirror\b/.test(seg) },
  { why: 'recursive force-remove (rm -r -f, any flag spelling) is irreversible. Confirm the exact path, or remove specific files without -r.',
    hit: (seg) => isDangerousRm(seg) },
];

// SQL danger lives inside quotes, so match the RAW command — but only with a
// DB-client / SQL context present, so a message mentioning "drop table" is safe.
const sqlDanger =
  /\b(?:DROP\s+(?:DATABASE|TABLE|SCHEMA)|TRUNCATE\s+TABLE)\b/i.test(cmd) &&
  /(?:\bpsql\b|\bmysql\b|\bmariadb\b|\bsqlite3?\b|\bmongo\w*\b|\bprisma\b|\bdrizzle\b|--command\b|--execute\b|(?:^|\s)-[ce]\b|\.sql\b)/i.test(cmd);

let why = null;
for (const seg of segments) {
  const r = RULES.find((rule) => { try { return rule.hit(seg); } catch { return false; } });
  if (r) { why = r.why; break; }
}
if (!why && sqlDanger) why = 'a destructive SQL statement (DROP / TRUNCATE) can wipe data with no undo. Confirm first.';
if (!why) process.exit(0);

process.stderr.write(
  `⛔ guard-destructive blocked an irreversible command (working-agreement rule 6).\n\n` +
  `  command: ${cmd}\n` +
  `  reason:  ${why}\n\n` +
  `Planning-only until the human explicitly confirms. If it is genuinely intended,\n` +
  `ask them to confirm and run it, or adjust the command (--force-with-lease instead\n` +
  `of --force; a scoped rm without -r).\n`,
);
process.exit(2);
