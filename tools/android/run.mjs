// Android harness runner.
//
//   node tools/android/run.mjs                 # full matrix × probes
//   node tools/android/run.mjs --quick         # Pixel 7 only (fast PR smoke)
//   node tools/android/run.mjs --device=galaxy-s9
//   node tools/android/run.mjs --probe=back-gesture-does-not-exit-game
//   node tools/android/run.mjs --strict        # also fail if a known-bug is now fixed (promote it)
//
// Exit code: non-zero if any REGRESSION GUARD (must-pass) fails — that is the
// CI gate. Known bugs that still reproduce are reported but do NOT fail the
// build; a known bug that has started passing is flagged for promotion.

import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { chromium, devices as PW_DEVICES } from 'playwright';
import { serve, launchDevice, collectErrors, DIST, ROOT } from './harness.mjs';
import { buildMatrix } from './devices.mjs';
import { PROBES } from './probes.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => (args.find((a) => a.startsWith(`--${name}=`)) || '').split('=')[1];

const QUICK = flag('quick');
const STRICT = flag('strict');
const ONLY_DEVICE = opt('device');
const ONLY_PROBE = opt('probe');

const C = { reset: '\x1b[0m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', bold: '\x1b[1m' };
const paint = (c, s) => `${c}${s}${C.reset}`;

// Status kinds
const PASS = 'PASS', FAIL = 'FAIL', PROVEN = 'PROVEN', FIXED = 'FIXED?', SKIP = 'SKIP';
const badge = {
  [PASS]: paint(C.green, '  PASS '),
  [FAIL]: paint(C.red, '  FAIL '),
  [PROVEN]: paint(C.yellow, ' PROVEN'), // known bug reproduced (expected)
  [FIXED]: paint(C.cyan, ' FIXED?'),   // known bug no longer reproduces
  [SKIP]: paint(C.dim, '  SKIP '),
};

function classify(expectation, threw) {
  if (expectation === 'manual') return SKIP;
  if (expectation === 'must-pass') return threw ? FAIL : PASS;
  if (expectation === 'known-bug') return threw ? PROVEN : FIXED;
  return threw ? FAIL : PASS;
}

async function main() {
  if (!existsSync(DIST)) {
    console.log(paint(C.dim, 'dist/ missing — running `npm run build`…'));
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  }

  let matrix = buildMatrix(PW_DEVICES);
  if (QUICK) matrix = matrix.filter((d) => d.id === 'pixel-7');
  if (ONLY_DEVICE) matrix = matrix.filter((d) => d.id === ONLY_DEVICE);
  if (!matrix.length) throw new Error(`no devices matched (device=${ONLY_DEVICE})`);

  let probes = PROBES;
  if (ONLY_PROBE) probes = probes.filter((p) => p.id === ONLY_PROBE);
  if (!probes.length) throw new Error(`no probes matched (probe=${ONLY_PROBE})`);

  const server = await serve(DIST);
  console.log(paint(C.bold, '\nBIG BREAK — Android harness') + paint(C.dim, `  (serving dist/ at ${server.origin})`));
  console.log(paint(C.dim, `devices: ${matrix.map((d) => d.id).join(', ')}\n`));

  const results = [];
  const record = (r) => { results.push(r); print(r); };
  const print = (r) => {
    const where = r.device ? paint(C.dim, ` @${r.device}`) : (r.scope === 'static' ? paint(C.dim, ' @static') : '');
    let line = `${badge[r.status]}  ${r.probe}${where}`;
    if (r.status === FAIL || r.status === PROVEN) line += paint(C.dim, `\n         ↳ ${r.error}`);
    if (r.status === SKIP && r.why) line += paint(C.dim, `\n         ↳ ${r.why}`);
    console.log(line);
  };

  try {
    // ---- static probes (no browser), once each ----
    for (const p of probes.filter((x) => x.scope === 'static')) {
      let threw = null;
      try { await p.run(); } catch (e) { threw = e.message; }
      record({ probe: p.id, title: p.title, scope: 'static', risk: p.risk, expectation: p.expectation, status: classify(p.expectation, threw), error: threw });
    }

    // ---- manual probes: report as documented SKIPs ----
    for (const p of probes.filter((x) => x.expectation === 'manual')) {
      record({ probe: p.id, title: p.title, risk: p.risk, expectation: 'manual', status: SKIP, why: p.why });
    }

    // ---- device probes × matrix ----
    const devProbes = probes.filter((x) => x.scope === 'device' && x.expectation !== 'manual');
    for (const device of matrix) {
      for (const p of devProbes) {
        let ctx, page, threw = null;
        try {
          ({ ctx, page } = await launchDevice(chromium, device));
          const errors = collectErrors(page);
          await page.goto(server.origin + '/', { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(250);
          await p.run(page, ctx, { errors, device });
        } catch (e) {
          threw = (e && e.message) || String(e);
        } finally {
          if (ctx) await ctx.close().catch(() => {});
        }
        record({ probe: p.id, title: p.title, device: device.id, risk: p.risk, expectation: p.expectation, status: classify(p.expectation, threw), error: threw });
      }
    }
  } finally {
    await server.close();
  }

  // ---- summary ----
  const count = (s) => results.filter((r) => r.status === s).length;
  const regressions = results.filter((r) => r.status === FAIL);
  const proven = [...new Set(results.filter((r) => r.status === PROVEN).map((r) => r.probe))];
  const fixed = [...new Set(results.filter((r) => r.status === FIXED).map((r) => r.probe))];

  console.log(paint(C.bold, '\n──────── summary ────────'));
  console.log(`${paint(C.green, PASS)} ${count(PASS)}   ${paint(C.red, FAIL)} ${count(FAIL)}   `
    + `${paint(C.yellow, PROVEN)} ${count(PROVEN)}   ${paint(C.cyan, FIXED)} ${count(FIXED)}   ${paint(C.dim, SKIP)} ${count(SKIP)}`);

  if (proven.length) {
    console.log(paint(C.yellow, `\nKnown Android bugs reproduced (expected — prove-before-fix):`));
    for (const id of proven) console.log(paint(C.dim, `  • ${id}`));
  }
  if (fixed.length) {
    console.log(paint(C.cyan, `\nKnown bugs that no longer reproduce — promote to must-pass:`));
    for (const id of fixed) console.log(paint(C.dim, `  • ${id}`));
  }
  if (regressions.length) {
    console.log(paint(C.red, `\nREGRESSIONS (must-pass failed):`));
    for (const r of regressions) console.log(paint(C.dim, `  • ${r.probe} @${r.device || 'static'} — ${r.error}`));
  }

  await writeFile(join(ROOT, 'tools', 'android', 'report.json'),
    JSON.stringify({ generatedAgainst: 'dist/', devices: matrix.map((d) => d.id), results }, null, 2));
  console.log(paint(C.dim, `\nreport.json written.`));

  const failStrict = STRICT && fixed.length > 0;
  process.exit(regressions.length || failStrict ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
