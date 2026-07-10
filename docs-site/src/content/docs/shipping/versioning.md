---
title: Versioning & migration
description: The three versioned contracts (pack, save schema, export code), when each bumps, and the machine-readable contract artifact external tools consume.
---

Big Break has three versioned contracts. Each is an exported constant — not a
comment, not a convention — and each has a stated bump policy, so "did this
change break old content or old saves?" is a question with a checkable answer.

## The three contracts

| Contract | Constant | Lives in | Covers |
|---|---|---|---|
| Pack contract | `PACK_CONTRACT_VERSION` | `js/validate.ts` (re-exported from `js/api.ts`) | The shape and semantics `validatePack` holds a pack to |
| Save schema | `SAVE_SCHEMA_VERSION` | `js/save.ts` | The in-progress run written to `localStorage` on every swipe |
| Export code | `EXPORT_CODE_VERSION` | `js/save.ts` | The `BB1.…` save-code envelope players move between devices |

## Bump policy

**Pack contract** — bumps when a previously **valid** pack becomes invalid: a
new required field, a removed core effect verb or requires key, tightened
semantics. It does **not** bump for additive vocabulary or new *warnings* —
those can't break an existing pack. A generated pack (or an external authoring
tool) should record the contract version it was written against.

**Save schema** — bumps only when an old payload can no longer be read
correctly. Additive fields never bump it: `loadMeta()` merges saved data over
current defaults, so a missing new field gets its default, and targeted inline
migrations rename old keys in place (see the `byInstrument → byLoadout`
migration in `js/save.ts`). The engine stamps every new run with this version;
a cross-pack invariant test pins the engine's stamp to the constant, so the
two can't drift apart silently.

**Export code** — bumps only if the envelope itself changes shape. The
envelope is namespace-tagged (`ns`), so a code pasted into the wrong game is
rejected rather than silently corrupting a career; codes predating the tag
still import.

The resume path is guarded twice: per-pack `localStorage` namespacing keeps
two games' saves apart, and `loadRun(expectedPackId)` refuses a run stamped
with a foreign `packId` (a bad import, a hand-edited code) even inside the
right namespace.

## The machine-readable contract artifact

External toolchains — editor integrations, CLIs, remote LLM authoring loops —
shouldn't need to import this repo's TypeScript to know the contract. The
repo ships [`docs/pack-contract.json`](https://github.com/sandstreampop/big-break/blob/main/docs/pack-contract.json):

- the three contract versions above,
- the engine's **core effect verbs** and **genre-neutral requires keys** (what
  a pack may use without declaring anything — everything else a pack declares
  itself and is validated against its own declarations),
- the validator's full **issue-code catalog**: every stable code
  `validatePack` can emit (`effect-verb-unknown`, `chain-target-missing`, …)
  with its severities, so a repair loop can key on codes instead of parsing
  message prose.

The artifact is *generated from runtime truth* — the built engine and
validator, plus the validator's source for the code catalog — and committed
like a golden master: `test/contract-artifact.test.mjs` regenerates it on
every CI run and fails on drift. Regenerate deliberately with:

```bash
npm run build && node tools/gen-contract-artifact.mjs
```

Renaming or removing an issue code is a **breaking change** for external
consumers: the drift test spot-pins the codes repair loops most commonly key
on, and an intended rename should bump `PACK_CONTRACT_VERSION`.
