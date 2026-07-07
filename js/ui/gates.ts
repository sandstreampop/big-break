// BIG BREAK — win-gate readout.
//
// The path/win-gate math (pathFit) and its DOM readout (gateReadout) — the
// ✓/✗ stat-vs-target bars shared by the crossroads, the final-set screen, and
// the ending scoreboard (the gate-row DOM was hand-duplicated three times
// before it was centralized). Pure helpers: they read the run + manifest and
// build elements; they never route anywhere, so both the progression and the
// endings modules can depend on them without a cycle.

import * as engine from '../engine.js';
import { activePack, run, metaFor } from './context.js';
import { el } from './dom.js';

export function pathFit(pathId) {
  const gates = activePack.manifest.winGates[pathId];
  const readings = Object.entries<number>(gates).map(([key, target]) => {
    const value = engine.gateValue(run, key);
    return { key, target, value, ratio: Math.min(1, value / target) };
  });
  const fit = readings.reduce((s, r) => s + r.ratio, 0) / readings.length;
  return { readings, fit };
}

// The ✓/✗ stat/resource-vs-target bar readout, shared by the crossroads,
// final-set, and ending screens. `metOf` decides the pass state (some callers
// carry r.met, others compare value>=target); `prefix` toggles the ✓/✗ before
// the name (crossroads omits it).
export function gateReadout(readings, opts: { className?: string; prefix?: boolean; metOf?: (r: any) => boolean } = {}) {
  const { className = 'gate-readout', prefix = true, metOf = (r: any) => r.value >= r.target } = opts;
  const gates = el('div', className);
  for (const r of readings) {
    const met = metOf(r);
    const grow = el('div', 'gate-row' + (met ? ' met' : ''));
    const name = metaFor(r.key).name;
    grow.append(el('span', 'gate-name', prefix ? `${met ? '✓' : '✗'} ${name}` : name));
    const bar = el('div', 'gate-bar');
    const fill = el('div', 'gate-fill');
    fill.style.width = `${Math.round(r.ratio * 100)}%`;
    bar.append(fill);
    grow.append(bar);
    grow.append(el('span', 'gate-nums', `${r.value}/${r.target}`));
    gates.append(grow);
  }
  return gates;
}
