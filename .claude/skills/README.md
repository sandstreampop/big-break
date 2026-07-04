# Vendored skills

Project skills for Claude Code, checked in so they're available to anyone
working in this repo (invoke with `/<skill-name>`).

## Source

Vendored from [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT-licensed — see [`LICENSE`](./LICENSE)). Update with
`npx skills add mattpocock/skills` and re-copy the folders below.

## What's here

- **grill-with-docs** — the entry point. A relentless, one-question-at-a-time
  interview to sharpen a plan or design that also writes the paper trail as it
  goes. Composes the two below: it runs a `grilling` session using
  `domain-modeling`. (`disable-model-invocation: true` — user-invoked only, via
  `/grill-with-docs`.)
- **grilling** — the interview engine on its own (no doc artifacts).
- **domain-modeling** — the glossary + ADR discipline: how to sharpen terms into
  `CONTEXT.md` and record hard decisions as ADRs. Includes `CONTEXT-FORMAT.md`
  and `ADR-FORMAT.md`.

The Love Island design under `docs/games/love-island/` was produced with
`grill-with-docs`; the catalogue convention lives in the root `CONTEXT-MAP.md`.
