---
title: Versioning & migration
description: What stays compatible as the engine evolves — your pack, your players' saves, and the machine-readable contract for tool builders.
---

Three things you ship have a compatibility promise: the **pack** you wrote,
the **saves** your players accumulate, and the **save codes** they move
between devices. Each has a version number and a plain rule for when it
changes, so "will an engine update break my game?" always has a checkable
answer.

## Your pack

The pack format has a version — `PACK_CONTRACT_VERSION`, importable from the
public API alongside `validatePack`. It only goes up when a change would make
a **previously valid pack invalid**: a new required field, a removed verb, a
tightened rule. New *optional* capabilities and new *warnings* don't bump it,
because they can't break a pack that already validates.

What that means for you: a pack that passes `validatePack` today keeps
passing until the contract version changes — and if you generate packs with a
tool or a model, record the version they were written against.

## Your players' saves

Saves are built to survive engine updates without you doing anything:

- **New fields don't break old saves.** When a save is loaded, anything the
  save doesn't have yet gets its current default. An old save simply gains
  the new features.
- **Renamed fields are migrated in place.** When a field has to change shape,
  the loader rewrites old saves as they're read — players keep their
  progress.
- **A save can't leak between games.** Each game's saves live in their own
  namespace, every run is stamped with the game it belongs to, and the resume
  screen refuses a run from a different game.

The save format's version (`SAVE_SCHEMA_VERSION`) only bumps if an old save
could no longer be read correctly — which the rules above exist to avoid.

## Save codes

Players can export a whole career as a `BB1.…` code and paste it on another
device. Codes are tagged with the game they came from, so pasting a code into
the wrong game is politely rejected instead of corrupting a career. The
envelope's version (`EXPORT_CODE_VERSION`) only changes if the code format
itself does.

## Building tools? There's a machine-readable contract

If you're building something *around* the engine — an editor plugin, a
generation pipeline, a validator UI — you don't need to read TypeScript to
know the rules. The repo publishes
[`docs/pack-contract.json`](https://github.com/sandstreampop/big-break/blob/main/docs/pack-contract.json),
which contains:

- the three version numbers above;
- the **effect verbs** and **requires keys** every pack may use without
  declaring anything (everything else is declared by the pack itself);
- the complete catalog of **issue codes** the validator can emit —
  `effect-verb-unknown`, `chain-target-missing`, and the rest — so your tool
  can react to a code instead of parsing an error message.

The file is generated from the engine itself and kept in sync automatically,
and issue codes are treated as a stable API: one being renamed or removed
counts as a breaking change and bumps `PACK_CONTRACT_VERSION`.
