// new-pack scaffolder — the pure mechanism (fs-free, testable). The CLI wrapper
// is tools/new-pack.mjs; this module generates the three artifacts a new game
// needs and the registry patch that registers it:
//
//   starterPackSource(id, name)  → js/packs/<id>.ts   (a complete, VALID pack)
//   starterHtml(id, name, icon)  → <id>.html          (the game's entry page)
//   patchRegistry(src, id)       → the edited js/packs/registry.ts source
//
// The starter pack is not lorem ipsum: it validates clean, lints clean, plays
// to a terminal state, and lands inside its own declared balance band — the
// paved road STARTS on the road. test/newpack.test.mjs transpiles the emitted
// TypeScript with the repo's pinned tsc and drives the resulting pack through
// validatePack + the genre-neutral sim driver, so the template can never rot
// into an artifact that fails the gates it tells its author to run.
//
// Everything is written in placeholder-neutral voice ("Resolve", "Prepare")
// with TODO markers where the author's theme goes.

// A pack id: kebab-case, js-module and URL safe.
export function validPackId(id) {
  return typeof id === 'string' && /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(id) && id.length <= 32;
}

// The camelCase export name for a pack id ('space-cats' → spaceCatsPack).
export function packExportName(id) {
  return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()) + 'Pack';
}

// ---------- the starter pack ----------
// Small enough to read in one sitting, complete enough to demonstrate every
// core concept: two stats, one resource, two summits (a real crossroads
// decision), three segments, a card factory + bespoke cards, one chain pair,
// and a declared balance band the sim gate holds it to.

export function starterPackSource(id, name) {
  const exportName = packExportName(id);
  return `// ${name} — a Big Break content pack, scaffolded by tools/new-pack.mjs.
//
// This starter is a complete, valid, playable game so you always refactor
// from green. The loop to keep while you reshape it into YOUR game:
//
//   npm run build
//   node tools/validate-packs.mjs ${id}     # the contract (repairable errors)
//   node tools/pack-report.mjs ${id}        # how it actually plays
//   node tools/simulate-pack.mjs ${id} --check   # the balance gate
//
// Then open /${id}/ in the browser build. Docs: /docs/quickstart and
// /docs/authoring/* (or /docs/authoring/llm to co-write it with a model).

import type { Pack, PackManifest, GameEvent } from '../types.js';

// ── 1. Your effect vocabulary ──────────────────────────────────────────────
// Your stats/resources become legal effect keys via declaration merging —
// a typo'd key in a card is a COMPILE error, and the validator catches the
// same mistake in generated/JSON content at tool time.
declare module '../types.js' {
  interface Effect {
    nerve?: number;   // TODO: rename to your first stat
    craft?: number;   // TODO: rename to your second stat
    standing?: number; // TODO: rename to your resource
  }
  interface RunState {
    standing?: number;
  }
}

// ── 2. The manifest: your genre's taxonomy ─────────────────────────────────
const manifest: PackManifest = {
  // The 0–100 meters choices roll against. TODO: name your own.
  stats: ['nerve', 'craft'],
  // Unbounded counters (score, currency, reputation…). TODO: name your own.
  resources: ['standing'],
  // The run's shape: three segments, the crossroads (path commit) after the
  // first. Lengths are cards per segment.
  segments: [
    { length: 6, crossroads: true },
    { length: 8 },
    { length: 6 },
  ],
  // The summits a run commits to at the crossroads. TODO: make them yours.
  paths: {
    steady: {
      id: 'steady',
      name: 'The Steady Road',
      blurb: 'Win by holding your nerve and banking standing.',
      gateLabel: 'Nerve 55 · Standing 30',
      icon: '🛤️',
    },
    daring: {
      id: 'daring',
      name: 'The Daring Line',
      blurb: 'Win on craft. Higher bar, brighter story.',
      gateLabel: 'Craft 62 · Standing 24',
      icon: '⚡',
    },
  },
  // The finale judges the committed path against these bars.
  winGates: {
    steady: { nerve: 55, standing: 30 },
    daring: { craft: 62, standing: 24 },
  },
  // HUD labels — every stat PLUS the engine's built-in attrition meter
  // ('burnout'), which you rename into your theme here.
  statMeta: {
    nerve: { name: 'Nerve', icon: '🫀' },
    craft: { name: 'Craft', icon: '🛠️' },
    burnout: { name: 'Strain', icon: '🌡️' },
  },
  resourceMeta: {
    standing: { name: 'Standing', icon: '⭐' },
  },
  // The roguelike success band the balance gate (simulate-pack --check) holds
  // this pack to. Tune your gates until you sit inside it.
  balanceBand: { successMin: 20, successMax: 45 },
};

// ── 3. The deck ────────────────────────────────────────────────────────────
// A factory keeps the starter readable; real packs grow bespoke cards fast.
// Every choice needs all three tiers — bad / good / incredible.
function card(id: string, act: number | number[], opts: {
  prompt: string; recap: string;
  left: string; right: string;
  risky?: boolean;
}): GameEvent {
  const swing = opts.risky ? 2 : 0;
  return {
    id,
    act,
    prompt: opts.prompt,
    recap: opts.recap,
    choices: {
      left: {
        label: opts.left,
        tags: ['push'],
        governingStats: { nerve: 1 },
        outcomes: {
          bad: { text: 'It slips, publicly.', effects: { nerve: -2 - swing, burnout: 4 } },
          good: { text: 'It lands. People noticed.', effects: { nerve: 4, standing: 3 + swing, burnout: 2 } },
          incredible: { text: 'It lands so cleanly it looks rehearsed.', effects: { nerve: 6, standing: 6 + swing } },
        },
      },
      right: {
        label: opts.right,
        tags: ['prepare'],
        governingStats: { craft: 1 },
        outcomes: {
          bad: { text: 'You overthink it into a knot.', effects: { craft: -1 - swing, burnout: 3 } },
          good: { text: 'Quiet work, real progress.', effects: { craft: 4, standing: 1, burnout: -2 } },
          incredible: { text: 'The practice pays off all at once.', effects: { craft: 7, standing: 3 + swing, burnout: -3 } },
        },
      },
    },
  };
}

// TODO: replace these prompts with your world. Aim for 2× each segment's
// length per act, concrete moments (not summaries), and keep most cards
// ungated. The two-card chain shows the chainEventId mechanic.
const EVENTS: GameEvent[] = [
  card('a1_opening', 1, {
    prompt: 'First morning. The door everyone said would stay shut is ajar.',
    recap: 'The shut door stood ajar.',
    left: 'Walk through it', right: 'Study the hinges first',
  }),
  card('a1_rumor', 1, {
    prompt: 'A rumor about you arrives before you do. It is almost flattering.',
    recap: 'A rumor beat you to the room.',
    left: 'Lean into it', right: 'Correct the record',
  }),
  card('a1_mentor', 1, {
    prompt: 'Someone senior offers advice you did not ask for. Some of it is good.',
    recap: 'Unsolicited advice, partly good.',
    left: 'Take the useful half', right: 'Take notes on all of it',
  }),
  card('a1_shortcut', 1, {
    prompt: 'There is a shortcut. Everyone knows about it. Nobody admits using it.',
    recap: 'The shortcut everyone denies using.',
    left: 'Use it once', right: 'Map where it actually goes',
    risky: true,
  }),
  card('a1_smalltest', 1, {
    prompt: 'A small test, low stakes — except the right people are watching.',
    recap: 'A small test with the right audience.',
    left: 'Show off a little', right: 'Do it by the book',
  }),
  card('a1_neighbor', 1, {
    prompt: 'Your closest rival introduces themselves. They are annoyingly likable.',
    recap: 'The likable rival said hello.',
    left: 'Match their energy', right: 'Watch how they work',
  }),
  // A two-card beat, written out in full: accepting the favor CHAINS into
  // a1_favor_due (below), which is chainOnly — unreachable except through
  // this card. This is the pattern for any multi-card story moment.
  {
    id: 'a1_favor',
    act: 1,
    prompt: 'A stranger fixes a problem for you before you can ask. “You owe me one,” they say, pleasantly.',
    recap: 'A stranger banked a favor on you.',
    choices: {
      left: {
        label: 'Accept the debt',
        tags: ['push'],
        governingStats: { nerve: 1 },
        outcomes: {
          bad: { text: 'You accept too quickly. They notice.', effects: { nerve: -2, burnout: 3, chainEventId: 'a1_favor_due' } },
          good: { text: 'Fine. One favor. How bad can it be.', effects: { standing: 3, chainEventId: 'a1_favor_due' } },
          incredible: { text: 'You accept with such grace it becomes THEIR story.', effects: { nerve: 5, standing: 5, chainEventId: 'a1_favor_due' } },
        },
      },
      right: {
        label: 'Refuse politely',
        tags: ['prepare'],
        governingStats: { craft: 1 },
        outcomes: {
          bad: { text: 'The refusal comes out ruder than you meant.', effects: { craft: -1, burnout: 3 } },
          good: { text: 'You decline cleanly. They respect it.', effects: { craft: 3, standing: 1 } },
          incredible: { text: 'You refuse so well they offer to owe YOU one.', effects: { craft: 5, standing: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_favor_due',
    act: 1,
    chainOnly: true, // only reachable through a1_favor's chain
    prompt: 'The favor comes due at the worst possible moment, as favors do.',
    recap: 'The favor came due.',
    choices: {
      left: {
        label: 'Pay it in full',
        tags: ['push'],
        governingStats: { nerve: 1 },
        outcomes: {
          bad: { text: 'Paying it costs more than it bought.', effects: { nerve: -2, burnout: 4 } },
          good: { text: 'Paid, witnessed, done. Word gets around.', effects: { nerve: 3, standing: 4 } },
          incredible: { text: 'You overpay on purpose. Now the story is generosity.', effects: { nerve: 5, standing: 7 } },
        },
      },
      right: {
        label: 'Negotiate the terms',
        tags: ['prepare'],
        governingStats: { craft: 1 },
        outcomes: {
          bad: { text: 'Haggling over a favor. The room cools.', effects: { craft: -1, standing: -2, burnout: 3 } },
          good: { text: 'You trade it down to something honest.', effects: { craft: 4, standing: 1 } },
          incredible: { text: 'The renegotiation is so deft it becomes a partnership.', effects: { craft: 6, standing: 4 } },
        },
      },
    },
  },

  card('a2_deep_water', 2, {
    prompt: 'The middle stretch. The work is harder and the applause is quieter.',
    recap: 'Harder work, quieter applause.',
    left: 'Push the pace', right: 'Consolidate what works',
  }),
  card('a2_offer', 2, {
    prompt: 'An offer arrives that solves this month and mortgages next year.',
    recap: 'A tempting, expensive offer.',
    left: 'Take the deal', right: 'Read every clause',
    risky: true,
  }),
  card('a2_slump', 2, {
    prompt: 'Nothing is wrong, exactly. Nothing is right either.',
    recap: 'The flat stretch.',
    left: 'Force a breakthrough', right: 'Trust the routine',
  }),
  card('a2_audience', 2, {
    prompt: 'Your work reaches someone you never expected. They have opinions.',
    recap: 'An unexpected audience with opinions.',
    left: 'Engage head-on', right: 'Let the work answer',
  }),
  card('a2_rival_move', 2, {
    prompt: 'The likable rival makes a bold move. It is, infuriatingly, good.',
    recap: 'The rival made a genuinely good move.',
    left: 'Answer it publicly', right: 'Study it and counter later',
    risky: true,
  }),
  card('a2_maintenance', 2, {
    prompt: 'Everything needs fixing at once, as if the tools held a meeting.',
    recap: 'Everything broke at once.',
    left: 'Patch and keep moving', right: 'Stop and fix it properly',
  }),
  card('a2_ally', 2, {
    prompt: 'Someone offers to carry half of it. Accepting means owing; refusing means carrying.',
    recap: 'An offer to share the load.',
    left: 'Share the load', right: 'Carry it yourself',
  }),
  card('a2_night', 2, {
    prompt: 'A long night where the work finally gets quiet enough to hear.',
    recap: 'The long, quiet night.',
    left: 'Ride it till morning', right: 'Bank it and rest',
  }),

  card('a3_stakes', 3, {
    prompt: 'The finish is visible now, which somehow makes everything heavier.',
    recap: 'The visible finish line.',
    left: 'Sprint early', right: 'Hold your pacing',
  }),
  card('a3_doubt', 3, {
    prompt: 'The doubt shows up right on schedule, wearing your voice.',
    recap: 'The scheduled doubt arrived.',
    left: 'Argue with it', right: 'Work through it',
  }),
  card('a3_legacy', 3, {
    prompt: 'Someone younger asks how you did it. You realize you have an answer.',
    recap: 'Someone asked how you did it.',
    left: 'Tell the true version', right: 'Show them instead',
  }),
  card('a3_last_gamble', 3, {
    prompt: 'One last swing, the kind you only get to take once.',
    recap: 'The once-only swing.',
    left: 'Take the swing', right: 'Set up the sure thing',
    risky: true,
  }),
  card('a3_rival_end', 3, {
    prompt: 'The rival, at the end, offers a hand. It seems genuine. It might be.',
    recap: 'The rival offered a hand.',
    left: 'Take it', right: 'Nod, and finish your own way',
  }),
  card('a3_quiet', 3, {
    prompt: 'A quiet moment before the finale. The room where it started.',
    recap: 'Back where it started.',
    left: 'Say the thing out loud', right: 'Let it stay a feeling',
  }),
];

// ── 4. The pack ────────────────────────────────────────────────────────────
const loadouts = [
  { id: 'keen', name: 'The Keen One', family: 'starter', unlockedByDefault: true },
  { id: 'careful', name: 'The Careful One', family: 'starter', unlockedByDefault: true },
];

export const ${exportName}: Pack = {
  id: '${id}',
  manifest,
  plugins: [],
  events: EVENTS,
  tutorialEvents: [],
  loadouts,
  loadoutById: (lid) => loadouts.find((l) => l.id === lid) ?? null,
};
`;
}

// ---------- the entry HTML ----------
// Mirrors love-island.html: served at /<id>/ by the data-driven build, so the
// shared assets resolve with ../. The entry module is inline: on the paved
// road a new pack needs NO main-<id>.ts — createGame does scaffold + boot.
export function starterHtml(id, name, icon = '🎲') {
  const exportName = packExportName(id);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <!-- Served at /${id}/ (tools/build.mjs copies this to dist/${id}/index.html),
       so shared assets resolve with ../ -->
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="${name.toUpperCase()}">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#12101a">
  <title>${name} — a Big Break game</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E${icon}%3C/text%3E%3C/svg%3E">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <script type="module">
    import { createGame } from '../js/api.js';
    import { ${exportName} } from '../js/packs/${id}.js';
    // createGame validates the pack, builds the screen scaffold on this bare
    // page, installs the mobile guards, and boots the shell.
    createGame({ pack: ${exportName} }).start();
  </script>
</body>
</html>
`;
}

// ---------- the registry patch ----------
// Registers the pack in js/packs/registry.ts: one import line + membership in
// PACKS and GAME_PACKS. String-surgery on the known structure, failing LOUDLY
// when the file has drifted rather than guessing.
export function patchRegistry(source, id) {
  const exportName = packExportName(id);
  if (source.includes(`packs/${id}.js`) || source.includes(exportName)) {
    throw new Error(`registry already references '${id}' — pick another id or remove the old pack first.`);
  }
  const importLine = `import { ${exportName} } from './${id}.js';\n`;
  // After the last existing import.
  const imports = [...source.matchAll(/^import .*;\n/gm)];
  if (!imports.length) throw new Error('registry patch: no import lines found — js/packs/registry.ts has changed shape; register the pack by hand.');
  const last = imports[imports.length - 1];
  let out = source.slice(0, last.index + last[0].length) + importLine + source.slice(last.index + last[0].length);
  // Into both arrays. PACKS ends with probePack (the test fixture stays last);
  // GAME_PACKS lists the player-facing packs.
  const packsRe = /(export const PACKS: Pack\[\] = \[[^\]]*?),?\s*probePack\];/;
  if (!packsRe.test(out)) throw new Error('registry patch: PACKS array not in the expected shape; register the pack by hand.');
  out = out.replace(packsRe, (_, head) => `${head}, ${exportName}, probePack];`);
  const gameRe = /(export const GAME_PACKS: Pack\[\] = \[[^\]]*?)\];/;
  if (!gameRe.test(out)) throw new Error('registry patch: GAME_PACKS array not in the expected shape; register the pack by hand.');
  out = out.replace(gameRe, (_, head) => `${head}, ${exportName}];`);
  return out;
}
