# Repo conventions

- **Push all work to `main`.** The owner tracks latest there. Do not leave
  work stranded on feature branches unless asked.
- `gh-pages` is a deploy artifact published by `.github/workflows/pages.yml`
  on every push to `main` — never commit to it by hand.
- Play URLs: https://sandstreampop.github.io/big-break/ (once Pages is
  enabled in Settings) and https://raw.githack.com/sandstreampop/big-break/gh-pages/index.html
- All balance knobs live in `js/config.js`. Validate any balance change with
  `node tools/simulate.mjs 4000 narrative` (the `narrative` policy models a
  human; judge feel by it, not by `smart`).
- Engine (`js/engine.js`) must stay DOM-free — the simulator imports it in Node.
