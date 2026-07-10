# Working agreement — human + coding agent

How we (a human maintainer and a Claude Code agent) ship changes to this repo
without escaped defects. It exists because the constraint in this partnership
has moved: it's no longer *can the agent write the code* — it's **can the change
be trusted without watching it happen**, which is the whole game when review
happens from a phone and the agent merges to `main` itself.

This is the canonical process. `CLAUDE.md` carries the load-bearing rules the
agent must follow every task; this doc is the *why* and the full form. The
origin story and the research behind each rule is the July-2026 process retro.

The seven rules, then the two templates that operationalize them (the
**pre-merge contract** and the **hand-off format**).

---

## 1. Verify behaviour, not presence

A change is **done** when the app reaches a *terminal state after you interact
with the new thing* — not when the new thing renders. "It renders" ≠ "it works."

- For any new interactive control, drive it on **every surface it appears on**,
  and **the progression-gated surfaces first** (a result / ceremony / finale
  overlay, the crossroads, the finale). A control that's harmless on one surface
  can be gamebreaking on another.
- After interacting, assert the run still **advances to an ending**.
- The DOM-free goldens and sims cannot see any of this — only driving real
  Chromium to an ending can. That assertion is load-bearing, not a formality.

*This is the direct fix for the portrait-lightbox soft-lock (INCIDENTS #1). See
the "Ship UI the way it's played" section of `CLAUDE.md` for the enforced form.*

## 2. Invariants are executable, not commentary

If a constraint matters, it becomes a **test, a hook, or a type** — never only a
code comment. Comments are advisory; the build can't fail on them.

- The "one overlay at a time; never nest on `#overlay`" rule lived only in a
  comment, so it was silently broken. It is now a smoke assertion.
- When you rely on an invariant, ask: *what would fail the build if someone
  broke this?* If the answer is "nothing," you haven't finished encoding it.

## 3. Small, reversible batches

Land multi-surface features as **thin vertical slices**, each independently
built, verified, and shippable. Prefer three small merges to one wide one.

- Larger changesets carry disproportionately more risk (DORA 2024: AI adoption
  tracked a ~7% drop in delivery *stability*, driven by bigger batches). Speed
  is fine; big batches are the tax.
- State explicitly what each slice **does and does not** cover.

## 4. Independent verification — the writer is never the grader

Before calling subtle or multi-surface work "done," get a **fresh-context**
check that sees only the diff and the criteria, not the reasoning that produced
it.

- Use the `verifier` subagent (`.claude/agents/verifier.md`) or the bundled
  `/code-review` skill, or spawn a subagent to review the diff against the plan.
- Then run the behavioural check a skeptic would run (rule 1). Do not grade your
  own happy path — that is exactly how the soft-lock passed.
- Caveat: a reviewer told to find gaps will over-report. Act on **correctness**
  gaps, not style preferences; chasing everything yields defensive cruft.
- **The taste gate is hygiene, never editorial approval** (2026-07 odyssey
  review): the cliché/tells blocklists and caps catch recognizable lapses;
  they cannot judge rhythm, tension, or whether prose stays pleasurable on
  the third run. A green taste lint never substitutes for a human verdict on
  content — writing is where writer ≠ grader binds hardest. Batches of
  authored copy still go to the human loop (`docs/games/<game>/
  taste-feedback/`), lint-clean or not.

## 5. Design against automation bias — the agent's and the human's

People defer to systems that sound confident, especially under low-friction
review (a phone). The counter is to make the uncertainty visible.

- The agent reports **evidence, not assertions**: the check it ran, its output,
  and — critically — **what it did *not* verify and where it is unsure.**
- Every hand-off ends with the **hand-off format** below.
- The human's job is to interrogate the ⚠ lines, not bless the ✓ lines.

## 6. Guardrail the irreversible

Treat merge-to-`main` and deploy as the production surface, and put structure
(not good intentions) in front of the genuinely destructive.

- Before merge/deploy: the **full local gate suite ran green** and the agent
  **says so by name** — not "should pass."
- Genuinely destructive actions (history rewrite, non-lease force-push, `reset
  --hard`, `rm -rf`, branch deletion, dropping data) are a **planning-only
  proposal until the human confirms.** This is enforced structurally by the
  `guard-destructive` PreToolUse hook (`.claude/settings.json`), not left to
  discipline. `--force-with-lease` for a documented re-baseline is allowed.

## 7. Every incident becomes a rule

Each escaped defect closes out with (a) an entry in `docs/INCIDENTS.md`, (b) a
rule here or in `CLAUDE.md`, and (c) where possible, a test that would have
caught it. That is how the partnership gets *monotonically* safer instead of
relearning the same lesson. Keep `CLAUDE.md` lean while doing it — prune a rule
the moment a test makes it redundant.

---

## The pre-merge contract

Before the agent says "merged to `main`," **all** of these are true, and the
agent has said so:

1. **Built clean**, and the **full gate suite ran green** — named, not assumed
   (`npm run ci`, or the explicit list in `CLAUDE.md`).
2. Every **new interactive control** was driven on every surface — **gated
   surfaces first** — and the flow **reached a terminal state** afterward.
3. Every **invariant** relied on is enforced by a test / hook / type, not a comment.
4. A **fresh-context check** looked at the diff (or the skeptic's behavioural
   check was run).
5. The change is as **small and reversible** as it can be.
6. The hand-off states **what was verified, what wasn't, and where it's unsure.**

If any line is false, it isn't merged — it's a draft with an honest status.

## The hand-off format

Every non-trivial hand-off ends with three lines, phone-readable:

```
verified ✓   <what was actually exercised, and how>
not verified ⚠  <what was not checked, and why>
watch-out     <the riskiest assumption / where to look first if it breaks>
```

Omit a line only when it is genuinely empty (and say "nothing" rather than
dropping it silently).

---

## What NOT to change

Process can rot a small team as surely as bugs can. Protect these:

- **Don't slow the generation.** The fix is a tighter *verify* step, not a
  slower *write* step.
- **Don't over-engineer from reviews.** Flag correctness gaps only.
- **Don't bloat `CLAUDE.md`.** Every rule costs attention on every future task;
  cut any rule a test has made redundant.
- **Keep the gates fast.** Slow gates get skipped (the soft-lock assertion is
  bounded to twice per run for this reason).
- **Don't turn "zero engine edits" into a goal.** It is a *diagnostic* (packs
  should mostly be content), not a virtue to preserve by routing a pack
  through a bad public seam — that is how the always-true `poseidon >= -999`
  encoding shipped. Revised stance, per the 2026-07 odyssey review: an engine
  edit is *welcome* when it simplifies the pack contract for the next game
  (the terminalRules and presentFinale seams are the precedent). The bar is
  "does the fourth game get easier to write," not "did the engine stay
  frozen."

## Signals we're improving

- **Escaped defects** (found in the deployed app, not by a gate) → trending to 0;
  each produces a rule + a test.
- **% of interactive changes landed behind a behavioural check** → all of them.
- **Batch size** (surfaces touched / LOC per merge) → trending down.
- **Verified-unwatched ratio** — how often a hand-off is accepted without the
  human re-running anything, because the evidence is in the message.
- **Rework rate** — how often a "done" change comes back.
