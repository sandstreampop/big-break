# ADR-0001 — Global declaration merging is a scaling ceiling, not a current defect

- **Status:** accepted (decision deferred, deliberately)
- **Date:** 2026-07-10
- **Context:** 2026-07 Odyssey staff review, P2 "Global declaration merging
  weakens pack isolation." Engine-level, so this ADR lives at repo level
  rather than under any one game.

## The mechanism as it stands

Every pack adds its own effect verbs and run-state fields to the SHARED
`Effect` and `RunState` interfaces via `declare module` in its own
composition root (`js/packs/music/pack.ts`, `js/packs/love-island/pack.ts`,
`js/packs/odyssey/pack.ts`). The shared types in `js/types.ts` name no genre;
adding a pack edits no shared file. That was the design goal, and at three
packs it delivers:

- **Hallucinated-key detection** — `Effect` has no index signature, so a
  card naming an undeclared verb is a compile error, the single most exposed
  authoring bug class.
- **Zero-friction pack authoring** — a pack declares `fame?: number` once
  and every effect literal type-checks.
- **Runtime isolation is real and tested** — manifests scope what the engine
  actually reads (`gateValue`, resource loops), the neutrality gate derives
  its blocklist from every registered pack, and cross-pack invariants +
  `createEngine` isolation tests pin behavior.

## Why it works at three packs

The merged surface is small (music ~15 verbs, love-island ~10, odyssey 7),
collisions are avoided by convention (`ody_*` flags; distinct verb names),
and every pack is first-party — one review gate sees all declarations.

## The failure modes at five-plus (the ceiling)

1. **Cross-pack access type-checks.** `state.poseidon` compiles inside the
   music pack. Isolation is runtime-only; the compiler actively *blesses*
   the violation. Today the neutrality gate polices the engine, but nothing
   polices pack-A-reads-pack-B's-field.
2. **Union-by-accumulation documentation.** TypeDoc renders `RunState` with
   every genre's optionals; at five packs the public API reference reads as
   noise, and external authors can't tell core from residue.
3. **Naming collisions.** Two packs declaring `heat?: number` with different
   semantics merge silently — declaration merging unions same-named fields
   with compatible types instead of erroring.
4. **External packs can't participate.** A runtime-loaded (JSON-only) pack
   has no `declare module`; its vocabulary would be invisible to the type
   layer entirely. The compile-time half of the contract is first-party-only
   by construction — one more reason the README now calls the current state
   *internal* extensibility.

## Candidate remedies (evaluated, none adopted yet)

- **Vocabulary-parameterized types** — `Pack<V extends Vocab>`,
  `RunState<V>`, `Effect<V>`: real compile-time isolation and collision
  detection, at the cost of generics rippling through the engine, every
  plugin signature, and the UI seam. The heaviest option; the one that most
  helps an SDK future.
- **Namespaced pack state** — `run.packState['odyssey'].poseidon`: cheap
  runtime isolation and it composes with external JSON packs, but it
  sacrifices flat-field ergonomics (`gateValue` reads, effect literals,
  golden traces all flatten today) and by itself loses hallucinated-key
  checking unless paired with per-pack generated types.
- **Status quo + guard** — keep merging, add an invariant that greps each
  pack's source for other packs' declared fields (the cross-pack analogue of
  the engine-neutrality gate). Cheapest; closes failure mode 1's *practical*
  risk while leaving 2–4 open.

## Decision

**Defer.** The review itself says "I would not block this merge solely on
that," and the honest fork — SDK for TypeScript authors vs content-pack
runtime — is exactly the open product question the JSON-only experiment
(`docs/SPRINT-TECH-DEBT.md` backlog) is designed to answer. Choosing a type
architecture before knowing which product this is would be premature in both
directions.

**Tripwires that reopen this ADR:**

- a fourth/fifth pack lands (doc-pollution and collision odds stop being
  hypothetical);
- the JSON-only experiment graduates from experiment (external packs need a
  typed story);
- any observed cross-pack field access (adopt the status-quo guard the same
  week);
- a naming collision between packs (adopt parameterization or namespacing —
  convention has failed at that point).
