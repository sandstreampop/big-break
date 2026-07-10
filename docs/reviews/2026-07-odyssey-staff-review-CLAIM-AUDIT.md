# Claim audit — Odyssey staff review (Pass 0)

Every factual assertion in `2026-07-odyssey-staff-review.md`, checked against
`main` (`2f52056`). An adversarial review deserves an adversarial fact-check
back. Verdicts: **confirmed** / **confirmed, with a correction that changes a
later pass's shape** / **corrected**.

## 1. The `poseidon >= -999` encoding — **confirmed, with a correction**

`js/packs/odyssey/pack.ts:109–113`: three rules of the form
`{ key: 'poseidon', cmp: '>=', value: -999, flag: 'ody_stayed_*', ending: … }`,
with the comment saying exactly what the review says it says: "the always-true
numeric … the flag is the trigger."

**Correction that matters:** the pattern is not an Odyssey invention. Love
Island shipped it first — `js/packs/love-island/manifest.ts:141`:
`{ key: 'bond', cmp: '>=', value: 0, flag: 'li_dumped_single', ending: 'dumped' }`
(`bond >= 0` is always true). So the semantic drift of `failStates` is a
**pre-existing engine-contract defect with two packs already leaning on it**,
not clever misuse by the third pack. This strengthens Pass 2: the fix belongs
in the shared contract (a real flag-condition shape), and the migration must
cover love-island's encoding too, not only the lotus/circe/calypso rules.

## 2. The `noteFinale` side-channel — **confirmed**

- The mutable module state: `js/packs/odyssey/presenter.ts:14–15`
  (`let judgedRun: RunState | null`; `noteFinale` writes it).
- The write: `itineraryPlugin.onFinale` → `noteFinale(state)`
  (`js/packs/odyssey/pack.ts:247–249`), fired from
  `evaluateFinale`'s `firePlugins('onFinale', state)` (`js/engine.ts:1010`).
- The read: a getter — `get success() { return oarRoadWalked() ? … }`
  (`js/packs/odyssey/presenter.ts:80`) — consulted when the shell renders
  ending copy (`js/ui/endings.ts:193–194`, `PRES.endings?.[key]`).

The temporal choreography the review describes (meta → setup → flags →
itinerary → noteFinale → presenter) is real, and the state is **module-level,
not engine-instance-level** — `createEngine` isolation (`engine-instance.test.mjs`)
does not cover it. Pass 3's two-engine leak test is the right first move.

## 3. Suite + CI presence (Required #3) — **confirmed, one gap found and fixed**

Present in `.github/workflows/pages.yml` and real: audit, build, strict
typecheck, lint, engine-neutrality, validate-packs, content lint, music
balance gate, love-island balance gate, `node --test test/*.test.mjs` (which
sweeps `odyssey-golden`, `odyssey-landmarks`, `odyssey-prophecy`,
`invariants`), smoke + crowding + mobile-matrix + createGame in real Chromium
(odyssey included in all three suites' target lists), docs build.

**The gap:** no `simulate-pack.mjs odyssey --check` step — the odyssey
balance band (`balanceBand: {35,50}`, `pack.ts:116`) was declared and passes
locally (39.1% at seed 49370) but gated nothing. Fixed in this pass:
`pages.yml` now runs the odyssey balance gate beside love-island's.

## 4. `pack.ts` is 275 lines carrying several responsibilities — **confirmed**

`wc -l js/packs/odyssey/pack.ts` = 275. Contents: module augmentation
(25–41), manifest (45–117), loadouts/FIRES (124–164), two plugins (166–250),
assembly + summarize (253–275). The review's proposed split
(manifest / fires / prophecy / assembly) maps cleanly. → Pass 5.

## 5. Declaration merging weakens isolation — **confirmed as described**

`js/packs/odyssey/pack.ts:25–41` augments the shared `Effect` and `RunState`;
music (`js/packs/music/pack.ts:71`) and love-island
(`js/packs/love-island/pack.ts:27`) do the same. The review's "not blocking,
mark it as a scaling ceiling" framing matches reality. → Pass 10 ADR.

## 6. Burnout-for-Despair — **confirmed, but it is a designed seam**

`js/packs/odyssey/pack.ts:86` re-labels the engine's universal burnout slot
(`statMeta.burnout = { name: 'Despair' }`). The engine owns exactly one
universal fail (`js/engine.ts:991`) and packs own its display name via
`statMeta` — music calls it burnout, love-island gates it differently
(`fromAct: 6`, value 79). Renaming through a manifest-declared display slot is
the mechanism working as designed, not a workaround. → Pass 4 verdict.

## 7. Equipment-for-Fires — **confirmed at the naming layer only**

The Fires are `loadouts` (generic engine concept: `family`, `quirk`,
`modifiers`, `grants` applied by a pack plugin). The generic mechanism fits.
What *is* music-flavored is presenter surface naming: the HUD hook is
`gearChips` (`js/packs/odyssey/presenter.ts:127`) — a pack showing prophecy
boons renders them through a hook named for guitar gear. → Pass 4 decides
rename vs. document.

## 8. Smaller factual checks

| Review claim | Verdict |
|---|---|
| Seven commits, 39 files (`5fa8593..cb6c447`) | confirmed (7 commits; `git diff --stat` 39 files) |
| CSS refactor: 97 custom properties, 2,742 declarations identity-checked | confirmed — commit `cbf9c20` added `tools/css-identity.mjs` (resolves `var()` and diffs resolved declarations; 2742/2742 identical) |
| "No engine concepts named prophecy/cyclops/bardKnowledge/trueEnding" | confirmed — `grep -i` over `js/engine.ts` finds none; the neutrality gate (`tools/check-engine-neutrality.mjs`) enforces the class |
| Standard success 39–46% | confirmed — 39.1% at the gate seed; the band is 35–50 |
| Tests target the invariants listed | confirmed — `test/odyssey-landmarks.test.mjs`, `test/odyssey-prophecy.test.mjs`, `test/odyssey-golden.test.mjs` |
| fi/fl ligature + capital-C font defects documented | confirmed — `css/odyssey.css:219–221` (corrupt fi/fl glyphs, ligatures force-disabled) + `docs/games/odyssey/IMPLEMENTATION-PLAN.md:39` |

## Consequences for later passes

1. **Pass 2 widens:** the terminal-rule migration must also carry
   love-island's `li_dumped_single` rule — the defect is shared, and leaving
   LI on the old encoding would preserve the exact trap for the next author.
2. **Pass 3 stands as planned** — the leak surface is module scope, so the
   two-engine test is the right proof shape.
3. **Pass 4 arrives pre-shaped:** Despair is a designed seam (document);
   Fires-as-loadouts is sound mechanism with one music-flavored hook name
   (`gearChips`) to judge.
