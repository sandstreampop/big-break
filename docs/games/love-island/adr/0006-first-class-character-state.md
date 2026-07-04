# First-class character state: opinion, mood, and a secret (v2)

The playtest verdict was that "the partner, the rival and the gossip need to be
first-class — the partner is just a name and a Bond at the top of the screen."
This ADR promotes the villa's people from flavour to run-state. It is
**pack-owned** (the engine names no character or relationship concept); it lives in
the Coupling plugin and a new characters plugin, and extends the existing
latent-flag machinery of ADR-0002.

## The three-part state

Each **active** character — the Partner, the single season-long **Rival**
(ADR-0002's Rival, now named and persistent), and the current bombshell — carries:

1. **Opinion of you**, in **visible tiers** (e.g. cold → cool → warm → smitten),
   not a raw hidden float. The Persona lesson from the research
   ([`../V2-RESEARCH.md`](../V2-RESEARCH.md)): a relationship lands when its level
   is legible and gates things. Opinion tiers gate **encounter branches** and feed
   **recoupling survival**.
2. **Mood**, a transient modifier set by recent beats and by gossip deployed at
   them (ADR-0007). Mood colours the character's **portrait** (art direction:
   mood-driven faces) and **dialogue**, and can nudge a roll or a telegraph. It is
   *not* a banked resource — it decays / resets.
3. **A secret** — one hidden agenda/flag per character. Gossip and encounters can
   **surface** it for mechanical effect (e.g. a Rival's secret, deployed at a
   ceremony, swings the survival check). Secrets extend the Reveal latent-flag
   system already owned by Coupling (ADR-0002), not a parallel mechanism.

## Relationship to the existing Bond

Bond stays the **numeric backing** of the Partner's opinion (preserving the
`Bond ≥ bondFloor OR Public ≥ publicFloor` survival math of ADR-0002); v2 adds a
**tiered presentation** over that number and extends the same opinion/mood/secret
*shape* to the Rival and the active bombshell. No survival-rule change — this is a
presentation-and-schema extension, not a rebalance.

## Why visible tiers, not a spreadsheet

Legibility must stay **qualitative** (see the legibility-vs-immersion caution in
the research). Tiers and mood are read out **diegetically** — through portraits,
dialogue, and Stirling (ADR-0008) — never as raw numbers on the HUD. That satisfies
the "outcomes felt unearned" complaint without turning the player into a min-maxer.

## Why pack-owned

Relationships, moods, and secrets are villa-specific vocabulary. The engine core
must not name them (it stays genre-free); the music pack has no analog. This is
plugin state on run-state plus presenter reads — new files only.

## Why this is hard to reverse

It defines the run-state schema for characters (per-character opinion/mood/secret)
and the portrait/HUD reads that depend on it, and it is **golden-affecting** (the
seeded traces will encode the new state). Pinned deliberately.
