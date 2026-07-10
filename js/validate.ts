// BIG BREAK — the pack contract validator. TypeScript catches a *developer's*
// mistakes at compile time; this catches a *generated or imported* pack's
// mistakes at run/tool time. LLM output is external input even when it lands
// in the repo, so a pack is treated as hostile until it passes:
//
//   1. SCHEMA    — is the pack shaped correctly? (fields, value types)
//   2. SEMANTICS — do its references resolve? (ids, stats, resources, verbs,
//                  requires keys, chain targets, paths, gates)
//
// Stage 3 (simulation — does it PLAY?) lives in the tooling ring on top of
// this: tools/validate-packs.mjs is the CI gate, tools/pack-report.mjs the
// author-facing report, tools/simulate-pack.mjs --check the balance gate.
//
// Every issue is written to be REPAIRABLE by the author or an LLM without
// reading engine source: it names the offending path, states the defect in
// one sentence, lists the declared vocabulary it failed against, and suggests
// a fix (including the closest declared key when one is plausibly a typo).
//
// Genre-neutral and DOM-free like the engine: it imports no pack, names no
// genre's stats or verbs, and reads everything off the candidate pack itself.

import type { Pack, Requires, PackIssue, PackValidation } from './types.js';
import { CORE_EFFECT_VERBS, REQUIRES_NEUTRAL_KEYS } from './engine.js';

export type { PackIssue, PackValidation } from './types.js';

// The pack contract's version, for external tools and generated packs to pin
// against (it also rides in docs/pack-contract.json, the machine-readable
// contract artifact). Bump policy: a change that makes a previously-VALID
// pack invalid (new required field, removed verb/requires key, tightened
// semantics) bumps this; purely additive vocabulary or new WARNINGS do not.
export const PACK_CONTRACT_VERSION = 1;

export const TIERS = ['bad', 'good', 'incredible'] as const;
export const SIDES = ['left', 'right'] as const;
const FORCE_TIERS = ['bad', 'good', 'incredible', 'encoreUp'];
const CMPS = ['<=', '>=', '<', '>'];

// ---------- small predicates ----------
const isObj = (v: unknown): v is Record<string, any> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isInt = (v: unknown): v is number => Number.isInteger(v);

// Render an already-invalid value inside an error message WITHOUT trusting it:
// JSON.stringify throws on BigInt and circular structures — exactly the kind
// of value a hostile pack carries — so the renderer itself must be total.
function show(v: unknown): string {
  try {
    const s = JSON.stringify(v);
    return s === undefined ? String(v) : s;
  } catch {
    return Object.prototype.toString.call(v);
  }
}

// Render a declared-vocabulary list for an error message. Complete when short,
// truncated with a count when long — the reader needs the shape, not a wall.
function list(keys: Iterable<string>): string {
  const arr = [...keys];
  if (!arr.length) return '(none declared)';
  if (arr.length <= 16) return arr.join(', ');
  return arr.slice(0, 16).join(', ') + `, … (${arr.length} total)`;
}

// Levenshtein distance, for "did you mean" suggestions on unknown keys. The
// candidate sets are small (a manifest's stats, a pack's verbs), so the O(n·m)
// classic is plenty.
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[n];
}

// The closest declared key to an unknown one, when close enough to plausibly
// be a typo (distance scales with key length; unrelated words suggest nothing).
export function closestKey(key: string, candidates: Iterable<string>): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  const lower = key.toLowerCase();
  for (const c of candidates) {
    const d = editDistance(lower, c.toLowerCase());
    if (d < bestD) { bestD = d; best = c; }
  }
  const threshold = key.length <= 4 ? 1 : key.length <= 8 ? 2 : 3;
  return best !== null && bestD <= threshold ? best : null;
}

// ---------- the validator ----------

class Collector {
  errors: PackIssue[] = [];
  warnings: PackIssue[] = [];
  error(code: string, path: string, message: string, fix?: string): void {
    this.errors.push({ severity: 'error', code, path, message, fix });
  }
  warn(code: string, path: string, message: string, fix?: string): void {
    this.warnings.push({ severity: 'warning', code, path, message, fix });
  }
}

// Validate a candidate pack. Returns every issue found (it never throws and
// never stops at the first defect — a repair loop wants the whole list), with
// `ok` true only when there are zero errors. Warnings are ship-with-eyes-open.
export function validatePack(candidate: unknown): PackValidation {
  const c = new Collector();
  // The never-throws contract is structural, not aspirational: a genuinely
  // adversarial pack (throwing getters, Proxies, revoked references) must
  // still come back as a REPORT, not an exception — so the walk itself is
  // fenced. Anything that escapes the targeted guards below lands here as an
  // invalid-pack verdict with whatever issues were already collected.
  try {
    walkPack(c, candidate);
  } catch (e) {
    c.error('validator-crash', 'pack',
      `The validator crashed while reading this pack: ${e instanceof Error ? e.message : String(e)}. A field is actively hostile (a throwing getter, a Proxy) or malformed beyond the checks above.`,
      'Make the pack plain data: literal objects/arrays/strings/numbers plus the loadoutById/plugin functions — no getters, no Proxies.');
  }
  return finish(c);
}

function walkPack(c: Collector, candidate: unknown): void {
  const pack = candidate as Pack;

  if (!isObj(candidate)) {
    c.error('pack-not-object', 'pack',
      `A pack must be an object, got ${candidate === null ? 'null' : typeof candidate}.`,
      'Export an object literal implementing the Pack interface (see js/packs/probe.ts for the smallest valid pack).');
    return;
  }
  if (!isStr(pack.id)) {
    c.error('pack-id-missing', 'pack.id',
      'A pack must declare a non-empty string `id` — it namespaces saves, registry lookup, and telemetry.',
      "Add e.g. `id: 'my-game'`.");
  }

  // ── Stage 1a: the manifest (the genre's taxonomy). Everything downstream
  // resolves against it, so collect its vocabulary even when partly broken. ──
  const m: any = isObj((pack as any).manifest) ? (pack as any).manifest : null;
  if (!m) {
    c.error('manifest-missing', 'pack.manifest',
      'A pack must carry a `manifest` object — it declares the stats, resources, run segments, paths, and winGates the engine reads.',
      'Add a PackManifest (see the manifest section of js/packs/probe.ts).');
    return;
  }

  const stats: string[] = Array.isArray(m.stats) ? m.stats.filter(isStr) : [];
  const resources: string[] = Array.isArray(m.resources) ? m.resources.filter(isStr) : [];

  if (!Array.isArray(m.stats) || !m.stats.length || stats.length !== m.stats.length) {
    c.error('manifest-stats-invalid', 'manifest.stats',
      'manifest.stats must be a non-empty array of stat names (strings). These are the 0–100 meters choices roll against.',
      "Declare at least one stat, e.g. `stats: ['focus']`.");
  }
  if (!Array.isArray(m.resources) || !m.resources.length || resources.length !== m.resources.length) {
    c.error('manifest-resources-invalid', 'manifest.resources',
      'manifest.resources must be a non-empty array of resource names (strings). Resources are unbounded counters (score, currency, momentum).',
      "Declare at least one resource, e.g. `resources: ['points']`.");
  }
  for (const k of stats) {
    if (resources.includes(k)) {
      c.error('stat-resource-overlap', `manifest`,
        `"${k}" is declared as both a stat and a resource — the engine would apply its effects twice.`,
        `Keep "${k}" in exactly one of manifest.stats / manifest.resources.`);
    }
  }
  if (stats.includes('burnout') || resources.includes('burnout')) {
    c.error('burnout-reserved', 'manifest',
      '"burnout" is the engine-owned attrition slot: every pack gets it automatically (rename it via statMeta.burnout).',
      'Remove "burnout" from manifest.stats/resources; keep its statMeta entry to label it.');
  }

  // Segments: the run's macro shape (ADR-0010) — linear, walked front to back.
  const segments: any[] = Array.isArray(m.segments) ? m.segments : [];
  if (!Array.isArray(m.segments) || !segments.length) {
    c.error('segments-missing', 'manifest.segments',
      'manifest.segments must be a non-empty array — it is the run structure (how many acts/weeks, how long each runs).',
      'Declare e.g. `segments: [{ length: 8, crossroads: true }, { length: 12 }, { length: 8 }]`.');
  }
  segments.forEach((seg, i) => {
    if (!isObj(seg) || !isInt(seg.length) || seg.length < 1) {
      c.error('segment-length-invalid', `manifest.segments[${i}]`,
        'Each segment needs an integer `length` ≥ 1 (the cards it runs before the next break).',
        `Give segment ${i + 1} a positive integer length.`);
    }
  });
  if (segments.length && isObj(segments[segments.length - 1]) && segments[segments.length - 1].crossroads) {
    c.error('crossroads-terminal', `manifest.segments[${segments.length - 1}]`,
      'The terminal segment cannot be a crossroads — the finale shadows it, so the commit slot would be dead data.',
      'Move `crossroads: true` to an earlier segment.');
  }

  // Paths & winGates: the summits and the bars that judge them.
  const paths: Record<string, any> = isObj(m.paths) ? m.paths : {};
  const winGates: Record<string, any> = isObj(m.winGates) ? m.winGates : {};
  const pathIds = Object.keys(paths);
  if (!isObj(m.paths)) {
    c.error('paths-invalid', 'manifest.paths',
      'manifest.paths must be an object of path id → PathDef ({} for a pack with no committed summit).',
      'Declare at least one path, or an empty object.');
  }
  for (const [pid, def] of Object.entries(paths)) {
    if (!isObj(def) || !isStr(def.name)) {
      c.error('path-def-invalid', `manifest.paths.${pid}`,
        `Path "${pid}" needs at least a display \`name\` (plus blurb/gateLabel/icon for the crossroads screen).`,
        `Give "${pid}" a name string.`);
    } else if (def.id !== pid) {
      c.error('path-id-mismatch', `manifest.paths.${pid}`,
        `Path "${pid}" declares id "${def.id}" — the record key and the id field must agree (both are used for lookup).`,
        `Set \`id: '${pid}'\`.`);
    }
  }
  {
    const a = pathIds.slice().sort().join(',');
    const b = Object.keys(winGates).sort().join(',');
    if (a !== b) {
      c.error('paths-wingates-mismatch', 'manifest.winGates',
        `paths and winGates must describe the same set of summits (paths: [${list(pathIds)}] vs winGates: [${list(Object.keys(winGates))}]).`,
        'Add a winGates entry for every path, and delete gates for paths that no longer exist.');
    }
  }
  if (pathIds.length && segments.length && !segments.some((s) => isObj(s) && s.crossroads)) {
    c.error('crossroads-missing', 'manifest.segments',
      'This pack declares paths but no segment is a crossroads — the player can never commit one, so the finale would judge winGates[null].',
      'Mark one non-terminal segment `crossroads: true`.');
  }

  // The gate vocabulary: what a winGates/failStates/requires key may resolve
  // to — a stat, the engine's burnout slot, a resource, or a run-state slot a
  // plugin owns (stateDefaults materialize top-level on state, so gateValue
  // and getRes read them exactly like manifest resources).
  const plugins: any[] = Array.isArray((pack as any).plugins) ? (pack as any).plugins : [];
  const pluginStateKeys = plugins.flatMap((p) => isObj(p) && isObj(p.stateDefaults) ? Object.keys(p.stateDefaults) : []);
  // What a resource-shaped field (roles, resourceMeta) may name: a declared
  // resource or a plugin-owned slot (e.g. a momentum counter a plugin ticks).
  const resourceLike = new Set([...resources, ...pluginStateKeys]);
  const resourceLikeLine = `Declared resources: ${list(resources)}; plugin-owned state slots: ${list(pluginStateKeys)}.`;
  // Core RunState mechanics counters newRun ALWAYS initializes — gateValue
  // resolves them via `key in state`, so a pack may legitimately gate on them
  // (they are genre-neutral, declared on the shared RunState).
  const GATEABLE_CORE_FIELDS = ['act', 'cardsPlayedInAct', 'encore', 'hotStreak', 'badStreak'];
  const gateKeys = new Set([...stats, 'burnout', ...resourceLike, ...GATEABLE_CORE_FIELDS]);
  const gateVocabLine = `Gate keys resolve to a manifest stat (${list(stats)}), a resource (${list(resources)}), "burnout", or a plugin-owned state slot (${list(pluginStateKeys)}).`;

  for (const [pid, gates] of Object.entries(winGates)) {
    if (!isObj(gates)) continue;
    for (const [key, target] of Object.entries(gates)) {
      if (!gateKeys.has(key)) {
        const near = closestKey(key, gateKeys);
        c.error('wingate-key-unresolved', `manifest.winGates.${pid}.${key}`,
          `winGates.${pid} gates on "${key}", but "${key}" is not a declared stat, resource, or plugin state slot — the summit could never be judged. ${gateVocabLine}`,
          near ? `Use "${near}" (closest match), or declare "${key}" in the manifest.` : `Declare "${key}" in manifest.stats/resources, or gate on a declared key.`);
      }
      if (!isNum(target) || target <= 0) {
        c.error('wingate-target-invalid', `manifest.winGates.${pid}.${key}`,
          `winGates.${pid}.${key} must be a positive number (the finale divides value/target for the readings).`,
          'Set a positive numeric target.');
      }
    }
  }

  // statMeta must label every stat plus the engine's burnout slot, or the HUD
  // renders undefined.
  const statMeta: Record<string, any> = isObj(m.statMeta) ? m.statMeta : {};
  for (const s of [...stats, 'burnout']) {
    const meta = statMeta[s];
    if (!isObj(meta) || !isStr(meta.name) || !isStr(meta.icon)) {
      c.error('statmeta-missing', `manifest.statMeta.${s}`,
        `statMeta is missing a { name, icon } entry for "${s}" — the HUD and result chips label stats from it (burnout included; rename it there).`,
        `Add \`${s}: { name: '…', icon: '…' }\` to manifest.statMeta.`);
    }
  }
  // resourceMeta / resourceStart may only name declared resources. The issue
  // codes are spelled as LITERALS at the call sites (a ternary, not a
  // computed template): the contract-artifact generator
  // (tools/gen-contract-artifact.mjs) extracts the catalog from these call
  // sites and REJECTS a code it can't read, so every emittable code stays
  // visible to external repair loops.
  for (const [field, rec] of [['resourceMeta', m.resourceMeta], ['resourceStart', m.resourceStart]] as const) {
    if (rec === undefined) continue;
    if (!isObj(rec)) {
      c.error(field === 'resourceMeta' ? 'resourcemeta-invalid' : 'resourcestart-invalid',
        `manifest.${field}`, `manifest.${field} must be an object keyed by resource name.`);
      continue;
    }
    for (const k of Object.keys(rec)) {
      // resourceStart is applied by newRun to manifest resources only;
      // resourceMeta may also label a plugin-owned slot (it can surface in
      // winGates readings and delta chips).
      const vocab = field === 'resourceStart' ? new Set(resources) : resourceLike;
      if (!vocab.has(k)) {
        const near = closestKey(k, vocab);
        c.error(field === 'resourceMeta' ? 'resourcemeta-unknown-resource' : 'resourcestart-unknown-resource',
          `manifest.${field}.${k}`,
          `manifest.${field} names "${k}", but "${k}" is not a declared resource${field === 'resourceStart' ? '' : ' or plugin-owned state slot'}. ${resourceLikeLine}`,
          near ? `Use "${near}" (closest match), or add "${k}" to manifest.resources.` : `Add "${k}" to manifest.resources, or remove this entry.`);
      }
    }
  }
  // Role resources: the manifest asks for these by FUNCTION; each must name a
  // declared resource or the mechanic silently never fires.
  const roleFields: [string, unknown][] = [
    ['costResource', m.costResource], ['momentumResource', m.momentumResource],
    ...(Array.isArray(m.lpResources) ? m.lpResources.map((r: unknown, i: number): [string, unknown] => [`lpResources[${i}]`, r]) : []),
    ...(Array.isArray(m.incredibleResources) ? m.incredibleResources.map((r: unknown, i: number): [string, unknown] => [`incredibleResources[${i}]`, r]) : []),
  ];
  for (const [field, val] of roleFields) {
    if (val === undefined) continue;
    // Role reads go through getRes/gateValue, which also resolve plugin-owned
    // state slots — so a plugin-ticked counter is a valid momentum resource.
    if (!isStr(val) || !resourceLike.has(val)) {
      const near = isStr(val) ? closestKey(val, resourceLike) : null;
      c.error('role-resource-unknown', `manifest.${field}`,
        `manifest.${field} names "${String(val)}", but it is not a declared resource or plugin-owned state slot, so the mechanic it opts into would read a key that never exists. ${resourceLikeLine}`,
        near ? `Use "${near}" (closest match).` : `Name a declared resource (or plugin state slot), or drop the field to opt out.`);
    }
  }
  // Fail states: shape + key resolution (a typo here is a fail that can never
  // fire — or one that fires instantly).
  const failStates: any[] = Array.isArray(m.failStates) ? m.failStates : [];
  failStates.forEach((rule, i) => {
    const where = `manifest.failStates[${i}]`;
    if (!isObj(rule) || !isStr(rule.key) || !isNum(rule.value) || !isStr(rule.ending) || !CMPS.includes(rule.cmp)) {
      c.error('failstate-invalid', where,
        `Each fail state needs { key, cmp (one of ${CMPS.join(' ')}), value, ending }.`,
        'Fix the rule shape (see FailStateRule in js/types.ts).');
      return;
    }
    if (!gateKeys.has(rule.key)) {
      const near = closestKey(rule.key, gateKeys);
      c.error('failstate-key-unresolved', `${where}.key`,
        `Fail state "${rule.ending}" watches "${rule.key}", but "${rule.key}" is not a declared stat, resource, or plugin state slot — the rule could never trip. ${gateVocabLine}`,
        near ? `Use "${near}" (closest match), or declare "${rule.key}" in the manifest.` : `Watch a declared key instead.`);
    }
  });
  if (m.balanceBand !== undefined) {
    const b = m.balanceBand;
    if (!isObj(b) || !isNum(b.successMin) || !isNum(b.successMax) ||
        b.successMin < 0 || b.successMax > 100 || b.successMin > b.successMax) {
      c.error('balanceband-invalid', 'manifest.balanceBand',
        'balanceBand must be { successMin, successMax } with 0 ≤ successMin ≤ successMax ≤ 100 (the % of runs that end in success).',
        'Fix the band, e.g. `{ successMin: 25, successMax: 40 }`.');
    }
  }

  // ── Stage 1b: plugins (shape + ownership uniqueness). ──
  const pluginEffectVerbs = new Set<string>();
  const pluginRequireKeys = new Set<string>();
  {
    const seenIds = new Map<string, number>();
    const reqOwners = new Map<string, string>();
    plugins.forEach((p, i) => {
      if (!isObj(p) || !isStr(p.id)) {
        c.error('plugin-id-missing', `plugins[${i}]`,
          'Every plugin needs a non-empty string id (ordering diagnostics and ownership checks key off it).');
        return;
      }
      if (seenIds.has(p.id)) {
        c.error('plugin-id-duplicate', `plugins[${i}]`,
          `Plugin id "${p.id}" is declared twice (also at plugins[${seenIds.get(p.id)}]).`,
          'Give each plugin a unique id.');
      }
      seenIds.set(p.id, i);
      for (const v of Array.isArray(p.effectVerbs) ? p.effectVerbs : []) {
        if (isStr(v)) pluginEffectVerbs.add(v);
      }
      for (const k of isObj(p.requires) ? Object.keys(p.requires) : []) {
        const owner = reqOwners.get(k);
        if (owner) {
          c.error('requires-key-conflict', `plugins[${i}].requires.${k}`,
            `requires predicate "${k}" is registered by both "${owner}" and "${p.id}" — a card's gate must have exactly one owner.`,
            'Keep the predicate in one plugin.');
        }
        reqOwners.set(k, p.id);
        pluginRequireKeys.add(k);
      }
    });
  }

  // ── Stage 1c: loadouts (a run always starts as SOMEONE). ──
  const loadouts: any[] = Array.isArray((pack as any).loadouts) ? (pack as any).loadouts : [];
  if (!loadouts.length) {
    c.error('loadouts-empty', 'pack.loadouts',
      'A pack must ship at least one loadout (persona) — newRun starts a run as one.',
      "Add e.g. `loadouts: [{ id: 'runner', name: 'The Runner', unlockedByDefault: true }]` and a matching loadoutById.");
  } else {
    const ids = new Set<string>();
    loadouts.forEach((l, i) => {
      if (!isObj(l) || !isStr(l.id)) {
        c.error('loadout-id-missing', `loadouts[${i}]`, 'Every loadout needs a non-empty string id.');
        return;
      }
      if (ids.has(l.id)) c.error('loadout-id-duplicate', `loadouts[${i}]`, `Loadout id "${l.id}" is declared twice.`, 'Give each loadout a unique id.');
      ids.add(l.id);
    });
    if (!loadouts.some((l) => isObj(l) && l.unlockedByDefault)) {
      c.warn('loadouts-none-default', 'pack.loadouts',
        'No loadout is unlockedByDefault — a fresh install would have nothing to offer at run start.',
        'Mark at least one loadout `unlockedByDefault: true`.');
    }
    if (typeof (pack as any).loadoutById !== 'function') {
      c.error('loadoutbyid-missing', 'pack.loadoutById',
        'A pack must provide loadoutById(id) — the engine resolves the run’s persona through it.',
        'Add `loadoutById: (id) => loadouts.find((l) => l.id === id) ?? null`.');
    } else {
      for (const l of loadouts) {
        if (!isObj(l) || !isStr(l.id)) continue;
        let got: unknown;
        try { got = (pack as any).loadoutById(l.id); } catch (e) {
          c.error('loadoutbyid-throws', 'pack.loadoutById', `loadoutById("${l.id}") threw: ${(e as Error).message}`);
          break;
        }
        if (!got) {
          c.error('loadoutbyid-incomplete', 'pack.loadoutById',
            `loadoutById("${l.id}") returned nothing for a loadout the pack itself declares — the two must agree.`,
            'Make loadoutById cover every entry in pack.loadouts.');
        }
      }
    }
  }

  // ── Stage 2: the deck. Shape per event, then reference resolution against
  // the vocabulary collected above. ──
  const events: any[] = Array.isArray((pack as any).events) ? (pack as any).events : [];
  const tutorialEvents: any[] = Array.isArray((pack as any).tutorialEvents) ? (pack as any).tutorialEvents : [];
  if (!Array.isArray((pack as any).events) || !events.length) {
    c.error('events-empty', 'pack.events',
      'A pack must ship a non-empty `events` deck — with nothing to draw, every act runs dry instantly.',
      'Author at least a handful of cards per segment (see the deck section of js/packs/probe.ts).');
  }
  if (!Array.isArray((pack as any).tutorialEvents)) {
    c.error('tutorialevents-missing', 'pack.tutorialEvents',
      'pack.tutorialEvents must be an array ([] for a pack with no scripted tutorial) — the engine indexes into it.',
      'Add `tutorialEvents: []`.');
  }

  const allEvents: any[] = [...events, ...tutorialEvents];
  const eventIds = new Set<string>();
  {
    const seen = new Map<string, string>();
    allEvents.forEach((ev, i) => {
      if (!isObj(ev) || !isStr(ev.id)) return; // shape error reported below
      const where = i < events.length ? `events[${i}]` : `tutorialEvents[${i - events.length}]`;
      const prev = seen.get(ev.id);
      if (prev) {
        c.error('event-id-duplicate', `${where} "${ev.id}"`,
          `Event id "${ev.id}" is declared twice (also at ${prev}). The deck draws by iterating ids, so a duplicate silently doubles that card's weight.`,
          'Give every event a unique id.');
      }
      seen.set(ev.id, where);
      eventIds.add(ev.id);
    });
  }

  // What an effects payload may name: a stat, a resource, a genre-neutral core
  // verb, or a verb exactly one plugin owns.
  const effectVocab = new Set([...stats, ...resources, ...CORE_EFFECT_VERBS, ...pluginEffectVerbs]);
  const effectVocabLine = `An effect key must be a declared stat (${list(stats)}), a resource (${list(resources)}), a core verb (${list(CORE_EFFECT_VERBS)}), or a plugin-owned verb (${list(pluginEffectVerbs)}).`;
  const requiresVocab = new Set([...REQUIRES_NEUTRAL_KEYS, ...pluginRequireKeys]);
  const requiresVocabLine = `A requires key must be a neutral core predicate (${list(REQUIRES_NEUTRAL_KEYS)}) or a predicate a plugin registers (${list(pluginRequireKeys)}).`;

  const checkEffects = (effects: any, where: string, evId: string): void => {
    if (effects === undefined) return;
    if (!isObj(effects)) {
      c.error('effects-invalid', where, `Event "${evId}": effects must be an object of verb → payload.`);
      return;
    }
    for (const [k, v] of Object.entries(effects)) {
      if (!effectVocab.has(k)) {
        const near = closestKey(k, effectVocab);
        c.error('effect-verb-unknown', where,
          `Event "${evId}" uses effect key "${k}", but "${k}" is not declared anywhere — the engine would silently drop it. ${effectVocabLine}`,
          near ? `Use "${near}" (closest match), or declare "${k}" in the manifest or a plugin's effectVerbs.` : `Declare "${k}" in manifest.stats/resources or a plugin's effectVerbs, or remove it.`);
        continue;
      }
      // Numeric payloads for the numeric vocabulary; control verbs have their
      // own shapes. Plugin verbs carry plugin-defined payloads — not checked.
      if ((stats.includes(k) || resources.includes(k) || k === 'burnout') && !isNum(v)) {
        c.error('effect-value-invalid', where,
          `Event "${evId}": effect "${k}" must be a number, got ${show(v)}.`,
          `Set "${k}" to the numeric delta to apply.`);
      }
      if ((k === 'addFlag' || k === 'removeFlag' || k === 'chainEventId') && !isStr(v)) {
        c.error('effect-value-invalid', where,
          `Event "${evId}": "${k}" must be a non-empty string, got ${show(v)}.`);
      }
    }
    if (isStr(effects.chainEventId) && !eventIds.has(effects.chainEventId)) {
      const near = closestKey(effects.chainEventId, eventIds);
      c.error('chain-target-missing', where,
        `Event "${evId}" chains to "${effects.chainEventId}", but no event with that id exists — the chain would silently drop and the follow-up never plays.`,
        near ? `Use "${near}" (closest match), or author the "${effects.chainEventId}" card.` : `Author the "${effects.chainEventId}" card, or remove the chain.`);
    }
    if (effects.addPromise !== undefined) {
      const p = effects.addPromise;
      if (!isObj(p) || !isStr(p.label) || !Array.isArray(p.tags) || !isInt(p.cards) || p.cards < 1) {
        c.error('promise-invalid', `${where}.addPromise`,
          `Event "${evId}": addPromise needs { label, tags: string[], cards: int ≥ 1 } (plus optional reward/penalty effects).`);
      } else {
        checkEffects(p.reward, `${where}.addPromise.reward`, evId);
        checkEffects(p.penalty, `${where}.addPromise.penalty`, evId);
      }
    }
  };

  const checkRequires = (r: any, where: string, evId: string): void => {
    if (r === undefined) return;
    if (!isObj(r)) {
      c.error('requires-invalid', where, `Event "${evId}": requires must be an object.`);
      return;
    }
    for (const k of Object.keys(r)) {
      if (!requiresVocab.has(k)) {
        const near = closestKey(k, requiresVocab);
        c.error('requires-key-unknown', where,
          `Event "${evId}" gates on "${k}", but "${k}" is neither a neutral predicate nor registered by any plugin — the gate would silently pass. ${requiresVocabLine}`,
          near ? `Use "${near}" (closest match), or register "${k}" in a plugin's \`requires\`.` : `Register "${k}" in a plugin's \`requires\` map, or gate on a neutral predicate.`);
      }
    }
    // The generic gates resolve their inner keys through gateValue — an
    // unresolvable key reads as unmet forever (a card that can never appear).
    for (const [field, strip] of [['stats', true], ['min', false], ['max', false]] as const) {
      const rec = (r as Requires)[field];
      if (rec === undefined) continue;
      if (!isObj(rec)) {
        c.error('requires-gate-invalid', `${where}.${field}`, `Event "${evId}": requires.${field} must be an object of key → number.`);
        continue;
      }
      for (const [key, val] of Object.entries(rec)) {
        const resolved = strip ? key.replace(/Min$/, '') : key;
        if (!gateKeys.has(resolved)) {
          const near = closestKey(resolved, gateKeys);
          c.error('requires-gate-key-unresolved', `${where}.${field}.${key}`,
            `Event "${evId}" gates on "${resolved}", but "${resolved}" is not a declared stat, resource, or plugin state slot — the gate reads 0 forever, so the card would ${field === 'max' ? 'always' : 'never'} appear. ${gateVocabLine}`,
            near ? `Use "${near}${strip && key.endsWith('Min') ? 'Min' : ''}" (closest match), or declare "${resolved}" in the manifest.` : `Gate on a declared key.`);
        }
        if (!isNum(val)) {
          c.error('requires-gate-value-invalid', `${where}.${field}.${key}`,
            `Event "${evId}": requires.${field}.${key} must be a number, got ${show(val)}.`);
        }
      }
    }
    if (r.anyOf !== undefined) {
      if (!Array.isArray(r.anyOf)) {
        c.error('requires-anyof-invalid', `${where}.anyOf`, `Event "${evId}": anyOf must be an array of alternative requires gates.`);
      } else {
        r.anyOf.forEach((alt: any, i: number) => checkRequires(alt, `${where}.anyOf[${i}]`, evId));
      }
    }
    for (const field of ['flagsAll', 'flagsNone'] as const) {
      if (r[field] !== undefined && (!Array.isArray(r[field]) || !r[field].every(isStr))) {
        c.error('requires-flags-invalid', `${where}.${field}`, `Event "${evId}": ${field} must be an array of flag strings.`);
      }
    }
  };

  allEvents.forEach((ev, i) => {
    const where = i < events.length ? `events[${i}]` : `tutorialEvents[${i - events.length}]`;
    if (!isObj(ev)) {
      c.error('event-invalid', where, 'An event must be an object (see GameEvent in js/types.ts).');
      return;
    }
    const label = isStr(ev.id) ? `${where} "${ev.id}"` : where;
    const evId = isStr(ev.id) ? ev.id : '(missing id)';
    if (!isStr(ev.id)) {
      c.error('event-id-missing', where, 'Every event needs a non-empty string id — chains, resume, and the used-card ledger key off it.');
    }

    // act: which segment(s) the card is eligible in — must exist in the run.
    const acts = Array.isArray(ev.act) ? ev.act : [ev.act];
    if (!acts.length || !acts.every(isInt)) {
      c.error('event-act-invalid', `${label}.act`,
        `Event "${evId}": \`act\` must be an integer or integer array (the 1-indexed segment(s) this card can appear in).`,
        `Set act to a value between 1 and ${segments.length || '<segment count>'}.`);
    } else if (segments.length) {
      for (const a of acts) {
        if (a < 1 || a > segments.length) {
          // chainOnly/finaleCard cards are dealt directly (chains, the climax
          // queue) and never pass through actMatches — a wrong act there is
          // inert metadata, not a dead card. Everything else it kills.
          if (ev.chainOnly || ev.finaleCard) {
            c.warn('event-act-out-of-range', `${label}.act`,
              `Event "${evId}" declares act ${a}, but this pack's run has only ${segments.length} segment(s). Inert here (the card is chain/finale-delivered, which ignores act) — but it reads as a mistake.`,
              `Use an act between 1 and ${segments.length}.`);
          } else {
            c.error('event-act-out-of-range', `${label}.act`,
              `Event "${evId}" declares act ${a}, but this pack's run has only ${segments.length} segment(s) — the card could never be drawn.`,
              `Use an act between 1 and ${segments.length}, or add segments to the manifest.`);
          }
        }
      }
    }

    if (ev.weight !== undefined && (!isNum(ev.weight) || ev.weight < 0)) {
      c.error('event-weight-invalid', `${label}.weight`, `Event "${evId}": weight must be a number ≥ 0.`);
    }
    if (ev.weight === 0 && !ev.chainOnly && !ev.finaleCard && !ev.shop) {
      c.warn('event-weight-zero', `${label}.weight`,
        `Event "${evId}" has weight 0 but is not chainOnly/finaleCard/shop — nothing can ever deal it.`,
        'Give it a positive weight, or mark how it is delivered (chainOnly, finaleCard, shop).');
    }
    if (ev.flashpoint && !(ev.weight === undefined || ev.weight > 0)) {
      c.error('flashpoint-weight-zero', `${label}.weight`,
        `Event "${evId}" is a flashpoint with weight 0 — the flashpoint window would open onto nothing.`,
        'Give the flashpoint a positive weight.');
    }

    for (const p of Array.isArray(ev.pathAffinity) ? ev.pathAffinity : []) {
      if (!pathIds.includes(p)) {
        const near = closestKey(String(p), pathIds);
        c.error('path-affinity-unknown', `${label}.pathAffinity`,
          `Event "${evId}" is affine to path "${p}", but no such path is declared — the card could never appear. Declared paths: ${list(pathIds)}.`,
          near ? `Use "${near}" (closest match), or declare the path in manifest.paths.` : `Use a declared path id.`);
      }
    }

    checkRequires(ev.requires, `${label}.requires`, evId);

    if (isObj(ev.forceTier)) {
      for (const [side, ft] of Object.entries(ev.forceTier)) {
        if (!SIDES.includes(side as any)) {
          c.error('forcetier-side-invalid', `${label}.forceTier`, `Event "${evId}": forceTier keys must be "left"/"right", got "${side}".`);
        }
        if (!FORCE_TIERS.includes(ft as string)) {
          c.error('forcetier-value-invalid', `${label}.forceTier.${side}`,
            `Event "${evId}": forceTier must be one of ${FORCE_TIERS.map((t) => `"${t}"`).join(', ')}, got ${show(ft)}.`);
        }
      }
    }

    // Choices: both sides, each with a label and all three tier outcomes —
    // the engine indexes outcomes[tier] unconditionally after a roll.
    if (!isObj(ev.choices)) {
      c.error('choices-missing', `${label}.choices`,
        `Event "${evId}" has no \`choices\` — every card needs a left and a right side.`,
        'Add `choices: { left: {...}, right: {...} }`.');
      return;
    }
    for (const side of SIDES) {
      const ch = ev.choices[side];
      const cw = `${label}.choices.${side}`;
      if (!isObj(ch)) {
        c.error('choice-missing', cw,
          `Event "${evId}" is missing its ${side} choice — a swipe that side would crash the resolution.`,
          `Author choices.${side} with a label and bad/good/incredible outcomes.`);
        continue;
      }
      if (!isStr(ch.label)) {
        c.error('choice-label-missing', `${cw}.label`, `Event "${evId}": choices.${side} needs a non-empty label (the button text).`);
      }
      if (ch.cost !== undefined && (!isNum(ch.cost) || ch.cost < 0)) {
        c.error('choice-cost-invalid', `${cw}.cost`, `Event "${evId}": cost must be a number ≥ 0.`);
      }
      if (isNum(ch.cost) && ch.cost > 0 && !isStr(m.costResource)) {
        c.warn('cost-without-cost-resource', `${cw}.cost`,
          `Event "${evId}" prices choices.${side} at ${ch.cost}, but the manifest declares no costResource — the price is silently never charged (nor gated).`,
          'Declare `costResource` in the manifest, or drop the cost.');
      }
      // governingStats keys must be CORE STATS: rollComponents reads them off
      // state.stats only, so a resource/typo key silently contributes aptitude
      // 0 while still counting its weight — a hidden difficulty bug.
      if (ch.governingStats !== undefined) {
        if (!isObj(ch.governingStats)) {
          c.error('governing-stats-invalid', `${cw}.governingStats`, `Event "${evId}": governingStats must be an object of stat → weight.`);
        } else {
          for (const [k, w] of Object.entries(ch.governingStats)) {
            if (!stats.includes(k)) {
              const near = closestKey(k, stats);
              c.error('governing-stat-unknown', `${cw}.governingStats`,
                `Event "${evId}" governs its ${side} choice on "${k}", but "${k}" is not a declared stat — it reads as aptitude 0 while its weight still counts, silently dragging the roll down. Declared stats: ${list(stats)}.`,
                near ? `Use "${near}" (closest match).` : `Govern on one of the declared stats${resources.includes(k) ? ` ("${k}" is a resource; resources cannot govern rolls)` : ''}.`);
            }
            if (!isNum(w)) {
              c.error('governing-weight-invalid', `${cw}.governingStats.${k}`, `Event "${evId}": governingStats.${k} must be a numeric weight.`);
            }
          }
        }
      }
      if (!isObj(ch.outcomes)) {
        c.error('outcomes-missing', `${cw}.outcomes`,
          `Event "${evId}": choices.${side} has no outcomes — the engine indexes outcomes[tier] after every roll.`,
          'Author all three: bad, good, incredible.');
        continue;
      }
      for (const t of TIERS) {
        const o = ch.outcomes[t];
        const ow = `${cw}.outcomes.${t}`;
        if (!isObj(o)) {
          c.error('outcome-missing', ow,
            `Event "${evId}": choices.${side} is missing its "${t}" outcome — a ${t} roll on this card would crash.`,
            `Author outcomes.${t} with text + effects (all three tiers are mandatory).`);
          continue;
        }
        if (typeof o.text !== 'string') {
          c.error('outcome-text-missing', `${ow}.text`, `Event "${evId}": outcomes.${t} needs a text string (the beat the player reads).`);
        }
        if (!isObj(o.effects)) {
          c.error('outcome-effects-missing', `${ow}.effects`,
            `Event "${evId}": outcomes.${t} needs an effects object ({} for a beat that changes nothing).`,
            'Add `effects: {}` at minimum.');
        } else {
          checkEffects(o.effects, `${ow}.effects`, evId);
        }
      }
    }
  });

  // Manifest-level effects payloads go through the same vocabulary check.
  if (m.declinePenalty !== undefined) checkEffects(m.declinePenalty, 'manifest.declinePenalty', '(manifest.declinePenalty)');

  // ── Stage 2b: optional capabilities that reference the deck. ──
  const interstitials: any[] = Array.isArray((pack as any).interstitials) ? (pack as any).interstitials : [];
  interstitials.forEach((r, i) => {
    const where = `interstitials[${i}]`;
    if (!isObj(r) || !isStr(r.id) || !isNum(r.burnoutMin)) {
      c.error('interstitial-invalid', where, 'Each interstitial rule needs { id, burnoutMin } (plus optional belowFail/cond).');
      return;
    }
    if (!eventIds.has(r.id)) {
      const near = closestKey(r.id, eventIds);
      c.error('interstitial-target-missing', `${where}.id`,
        `Interstitial rule ${i} queues card "${r.id}", but no event with that id exists — crossing the burnout bar would deal nothing.`,
        near ? `Use "${near}" (closest match), or author the card.` : 'Author the card, or remove the rule.');
    } else {
      const target = allEvents.find((e) => isObj(e) && e.id === r.id);
      if (target && !target.chainOnly) {
        c.warn('interstitial-not-chainonly', `${where}.id`,
          `Interstitial card "${r.id}" is not chainOnly, so it can ALSO be drawn as a normal deck card — usually unintended for a threshold beat.`,
          'Mark the card `chainOnly: true`.');
      }
    }
  });

  const ts: any = (pack as any).tutorialStart;
  if (ts !== undefined) {
    if (!isObj(ts) || !isStr(ts.loadout)) {
      c.error('tutorialstart-invalid', 'pack.tutorialStart', 'tutorialStart needs at least { loadout, stats }.');
    } else {
      let tsLoadout: unknown = null;
      try { tsLoadout = typeof (pack as any).loadoutById === 'function' ? (pack as any).loadoutById(ts.loadout) : true; }
      catch { tsLoadout = null; } // a throwing lookup = unresolved
      if (!tsLoadout) {
        c.error('tutorialstart-loadout-unknown', 'pack.tutorialStart.loadout',
          `tutorialStart starts as loadout "${ts.loadout}", but loadoutById does not resolve it. Declared loadouts: ${list(loadouts.filter((l) => isObj(l) && isStr(l.id)).map((l) => l.id))}.`,
          'Name a declared loadout id.');
      }
      for (const k of isObj(ts.stats) ? Object.keys(ts.stats) : []) {
        if (k !== 'burnout' && !stats.includes(k)) {
          const near = closestKey(k, stats);
          c.error('tutorialstart-stat-unknown', `pack.tutorialStart.stats.${k}`,
            `tutorialStart sets stat "${k}", but "${k}" is not a declared stat. Declared stats: ${list(stats)}.`,
            near ? `Use "${near}" (closest match).` : 'Set only declared stats (resources go in tutorialStart.resources).');
        }
      }
      for (const k of isObj(ts.resources) ? Object.keys(ts.resources) : []) {
        if (!resources.includes(k)) {
          const near = closestKey(k, resources);
          c.error('tutorialstart-resource-unknown', `pack.tutorialStart.resources.${k}`,
            `tutorialStart sets resource "${k}", but "${k}" is not a declared resource. Declared resources: ${list(resources)}.`,
            near ? `Use "${near}" (closest match).` : 'Set only declared resources.');
        }
      }
    }
    if (!tutorialEvents.length) {
      c.warn('tutorialstart-without-deck', 'pack.tutorialStart',
        'tutorialStart is declared but tutorialEvents is empty — the scripted onboarding has no cards to play.',
        'Author tutorialEvents, or drop tutorialStart.');
    }
  }

}

function finish(c: Collector): PackValidation {
  return { ok: c.errors.length === 0, errors: c.errors, warnings: c.warnings };
}

// ---------- reporting ----------

// Render one issue the way the repair loop wants it: defect, location,
// suggested fix — pasteable straight back into an LLM (or a human's head).
export function formatIssue(issue: PackIssue): string {
  const mark = issue.severity === 'error' ? '✗' : '⚠';
  const lines = [`${mark} [${issue.code}] ${issue.path}`, `  ${issue.message}`];
  if (issue.fix) lines.push(`  Suggested fix: ${issue.fix}`);
  return lines.join('\n');
}

// Render a whole validation: errors first (they block), then warnings, then
// the verdict line the gate prints.
export function formatValidation(packId: string, v: PackValidation): string {
  const out: string[] = [];
  for (const e of v.errors) out.push(formatIssue(e));
  for (const w of v.warnings) out.push(formatIssue(w));
  out.push(v.ok
    ? `✓ [${packId}] pack contract OK (${v.warnings.length} warning${v.warnings.length === 1 ? '' : 's'})`
    : `✗ [${packId}] ${v.errors.length} error(s), ${v.warnings.length} warning(s) — the pack violates the contract above.`);
  return out.join('\n\n');
}
