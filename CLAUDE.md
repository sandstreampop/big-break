# Repo conventions

- **Push all work to `main`.** The owner tracks latest there. Do not leave
  work stranded on feature branches unless asked.
- **Deploys go straight from `main`.** `.github/workflows/pages.yml` uploads
  the repo as a Pages artifact and deploys it via `actions/deploy-pages`
  (Pages Source = "GitHub Actions"). One workflow, one deployer — no
  `gh-pages` branch. Latest push to `main` wins (`cancel-in-progress: true`).
- Play URL: https://sandstreampop.github.io/big-break/
- All balance knobs live in `js/config.js`. Validate any balance change with
  `node tools/simulate.mjs 4000 narrative` (the `narrative` policy models a
  human; judge feel by it, not by `smart`).
- Engine (`js/engine.js`) must stay DOM-free — the simulator imports it in Node.
