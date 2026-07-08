// Behaviour lock for the destructive-command guard (tools/hooks/guard-destructive.mjs),
// the structural half of working-agreement rule 6. This test IS the invariant:
// the guard must block the irreversible set and wave through the normal workflow.
// Runs under `node --test test/*.test.mjs` (the CI gate), so a regression in the
// guard fails the build rather than silently un-guarding the repo.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HOOK = resolve(dirname(fileURLToPath(import.meta.url)), '../tools/hooks/guard-destructive.mjs');

// Returns true if the guard BLOCKS the command (exit 2), false if it allows it.
function blocks(command) {
  const res = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_input: { command } }),
    encoding: 'utf8',
  });
  return res.status === 2;
}

// The irreversible set — every one MUST be blocked.
const BLOCK = [
  'git push --force origin main',
  'git push -f origin x',
  'git push -uf origin x',
  'git push origin main --force',
  'git reset --hard HEAD~1',
  'git reset --hard',
  'rm -rf dist',
  'rm -fr build',
  'rm -r -f dist',                       // split short flags (review finding #1)
  'rm -R -f dist',                       // capital -R + split
  'rm --recursive --force dist',         // long options
  'sudo rm -rf /var/data',
  'cd tmp && rm -rf junk',               // dangerous in a later segment
  'git clean -fdx',
  'git clean -fd',
  'git filter-branch --tree-filter x HEAD',
  'git filter-repo --path x',
  'git push origin --delete feature',
  'git push origin :feature',
  'git push --mirror origin',
  'psql -c "DROP TABLE users"',          // SQL danger lives inside quotes
  'sqlite3 app.db "DROP TABLE logs"',
  'mysql -e "TRUNCATE TABLE sessions"',
];

// The normal workflow + innocent look-alikes — every one MUST be allowed.
const ALLOW = [
  'git push -u origin claude/roster-ui-integration-szgfc0',
  'git push origin main',
  'git push --force-with-lease origin main',
  'git push --force-with-lease=main origin main',
  'git checkout -B main origin/main',
  'git merge --ff-only feature',
  'git commit -m "add guard blocking rm -rf and force-push"',  // pattern named in the MESSAGE (review finding #2)
  'echo "never run git push --force"',
  'git grep "reset --hard"',
  'git commit -m "note: we should drop table later"',          // SQL words, no DB context
  'git reset --soft HEAD~1',
  'rm -f scratchpad.mjs',                                       // force, not recursive
  'rm dist/one-file.js',
  'git clean -n',                                               // dry run
  'npm run build',
  'npm run ci',
  'npm rm leftpad',
  'git add -A',
  'git fetch origin main',
  'node tools/hooks/guard-destructive.mjs',
];

test('guard blocks every irreversible command', () => {
  for (const c of BLOCK) assert.equal(blocks(c), true, `should BLOCK: ${c}`);
});

test('guard allows the normal workflow and innocent look-alikes', () => {
  for (const c of ALLOW) assert.equal(blocks(c), false, `should ALLOW: ${c}`);
});
