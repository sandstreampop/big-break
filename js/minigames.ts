// BIG BREAK — minigames. One-thumb skill moments (≤30s) that replace pure
// dice on flagship choices: your performance becomes a roll bonus.
//
// Data hook: a choice with `minigame: 'take'` triggers that game before the
// swipe resolves. The UI passes the resulting bonus into resolveSwipe as
// opts.bonus — the engine stays DOM-free and the simulator models the same
// hook with a mid-skill distribution (tools/simulate.mjs).
//
// Contract per game: register(id, { name, icon, how, run(stage, ctx, done) })
//   - `how` is one line of instructions shown on the intro card
//   - run() builds DOM inside `stage`, calls done(score 0..1) exactly once
//   - games must be pointer-only, portrait, and finish themselves ≤30s
//
// Scoring is shared so every game speaks the same language:
//   score < .35 → BOTCHED  (−8)   .35–.65 → SCRAPPY (+4)
//   .65–.88     → SOLID    (+14)  ≥ .88   → GOLDEN  (+24)

import { sfx } from './audio.js';
import { flagshipSong } from './engine.js';

// tiny shared feedback: sound + a haptic tick (games call these freely)
export const fx = {
  hit() { try { sfx.mgHit(); navigator.vibrate?.(8); } catch (e) {} },
  miss() { try { sfx.mgMiss(); navigator.vibrate?.(20); } catch (e) {} },
};

const GAMES = {};
export function register(id, def) { GAMES[id] = def; }
export function minigameById(id) { return GAMES[id] || null; }

export function verdictFor(score) {
  if (score == null) return { label: 'Skipped', bonus: 0, cls: 'mg-skip' };
  if (score < 0.35) return { label: 'BOTCHED', bonus: -8, cls: 'mg-bad' };
  if (score < 0.65) return { label: 'SCRAPPY', bonus: 4, cls: 'mg-ok' };
  if (score < 0.88) return { label: 'SOLID', bonus: 14, cls: 'mg-good' };
  return { label: 'GOLDEN', bonus: 24, cls: 'mg-gold' };
}

const el = (tag, cls?, html?) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Runs the full flow: intro (play/skip) → game → verdict beat.
// Resolves { score, verdict } — score null when skipped.
export function playMinigame(id, ctx: any = {}) {
  const def = GAMES[id];
  if (!def) return Promise.resolve({ score: null, verdict: verdictFor(null) });
  return new Promise((resolve) => {
    const layer = el('div', 'mg-layer');
    const box = el('div', 'mg-box');
    layer.append(box);
    document.querySelector('#app').append(layer);

    let finished = false;
    const finish = (score, detail = null) => {
      if (finished) return;
      finished = true;
      const verdict = verdictFor(score);
      if (score == null) { layer.remove(); resolve({ score, verdict, detail: null }); return; }
      // verdict beat: one readable moment before the card resolves
      try {
        if (verdict.label === 'GOLDEN') { sfx.mgGolden(); navigator.vibrate?.([20, 30, 20, 30, 40]); }
        else if (verdict.label === 'BOTCHED') { sfx.mgBotched(); navigator.vibrate?.(60); }
        else sfx.good();
      } catch (e) {}
      box.innerHTML = '';
      box.append(el('div', `mg-verdict ${verdict.cls}`, verdict.label));
      box.append(el('div', 'mg-verdict-sub',
        `${verdict.bonus >= 0 ? '+' : ''}${verdict.bonus} on this roll`));
      setTimeout(() => { layer.remove(); resolve({ score, verdict, detail }); }, 950);
    };

    // intro card — {song} names your actual flagship song when you have one
    const songTitle = ctx.run ? (flagshipSong(ctx.run)?.title || null) : null;
    box.append(el('div', 'mg-title', `${def.icon} ${def.name}`));
    box.append(el('div', 'mg-how', def.how.replaceAll('{song}', songTitle ? `“${songTitle}”` : 'the song')));
    const play = el('button', 'btn primary mg-btn', '▶ Play');
    play.addEventListener('click', () => {
      box.innerHTML = '';
      const stage = el('div', 'mg-stage');
      // burnout bleeds into your hands: past 60 the whole stage trembles
      const burnout = ctx.run?.stats?.burnout || 0;
      if (burnout >= 60 && !ctx.relaxed) {
        stage.classList.add('mg-shaky');
        box.append(el('div', 'mg-shaky-note', '🔥 Your hands are shaking.'));
      }
      box.append(stage);
      // hard cap: no game may hold the run hostage
      const cap = setTimeout(() => finish(0.2), 32000);
      // relaxed mode: a gentler curve (score lifted toward the middle) —
      // GOLDEN still requires real play; BOTCHED requires really missing
      const soften = (s) => (ctx.relaxed ? Math.min(1, s * 0.85 + 0.18) : s);
      // games may pass a payload with their score (e.g. the hooks you grabbed)
      def.run(stage, ctx, (score, detail) => { clearTimeout(cap); finish(soften(Math.max(0, Math.min(1, score))), detail); });
    });
    box.append(play);
    if (ctx.noSkip) {
      // The Showman's Pact: the show must go on
      box.append(el('div', 'mg-how mg-noskip', '🎪 Under contract: no skipping. The show must go on.'));
    } else {
      const skip = el('button', 'btn ghost mg-btn', 'Skip — just roll');
      skip.addEventListener('click', () => finish(null));
      box.append(skip);
    }
  });
}

// ═══════════ THE TAKE — studio timing (tap the sweet spot, 3 takes) ═══════════
register('take', {
  name: 'The Take', icon: '🎚️',
  how: 'The needle sweeps. Tap when it’s in the golden zone. Three takes of {song} — the zone shrinks each time. Tape is rolling.',
  run(stage, ctx, done) {
    const takes = [0.30, 0.20, 0.12]; // zone width per take (fraction of bar)
    const scores = [];
    let take = 0;

    stage.append(el('div', 'mg-take-label', 'TAKE 1'));
    const bar = el('div', 'mg-bar');
    const zone = el('div', 'mg-zone');
    const needle = el('div', 'mg-needle');
    bar.append(zone, needle);
    stage.append(bar);
    stage.append(el('div', 'mg-hint', 'tap anywhere to lock the take'));
    const dots = el('div', 'mg-dots', '○ ○ ○');
    stage.append(dots);

    let pos = 0, dir = 1, raf = null, last = performance.now();
    const SPEED = 0.85; // bar-widths per second

    function layoutZone() {
      const w = takes[take];
      const center = 0.35 + Math.random() * 0.3; // zone wanders, stays inboard
      zone.dataset.lo = center - w / 2;
      zone.dataset.hi = center + w / 2;
      zone.style.left = `${(center - w / 2) * 100}%`;
      zone.style.width = `${w * 100}%`;
      stage.querySelector('.mg-take-label').textContent = `TAKE ${take + 1}`;
    }
    layoutZone();

    function frame(now) {
      const dt = (now - last) / 1000;
      last = now;
      pos += dir * SPEED * dt;
      if (pos >= 1) { pos = 1; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      needle.style.left = `${pos * 100}%`;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    let locking = false;
    function lock() {
      if (locking) return;
      locking = true;
      const lo = +zone.dataset.lo, hi = +zone.dataset.hi;
      const c = (lo + hi) / 2, half = (hi - lo) / 2;
      // 1.0 dead-center → fades to 0 outside the zone
      const s = Math.max(0, 1 - Math.abs(pos - c) / (half * 1.6));
      scores.push(s);
      (s > 0.55 ? fx.hit : fx.miss)();
      needle.classList.add(s > 0.55 ? 'mg-hit' : 'mg-miss');
      dots.textContent = scores.map((x) => (x > 0.55 ? '●' : '✕')).join(' ') +
        (scores.length < 3 ? ' ○'.repeat(3 - scores.length) : '');
      setTimeout(() => {
        needle.classList.remove('mg-hit', 'mg-miss');
        take++;
        if (take >= takes.length) {
          cancelAnimationFrame(raf);
          stage.removeEventListener('pointerdown', lock);
          done(scores.reduce((a, b) => a + b, 0) / scores.length);
        } else {
          layoutZone();
        }
        locking = false;
      }, 240);
    }
    stage.addEventListener('pointerdown', lock);
  },
});

// ═══════════ CROWD WAVE — live rhythm (tap when the note hits the ring) ═══════════
register('crowd', {
  name: 'Crowd Wave', icon: '🎤',
  how: 'The crowd wants {song}. Notes fly toward the ring — tap ON the beat: each hit lifts the room, each miss drops it. Eight notes. Own it.',
  run(stage, ctx, done) {
    const NOTES = 8;
    const TRAVEL = 1500;   // ms from spawn to ring
    const GAP = 650;       // ms between notes
    const results = [];

    const meter = el('div', 'mg-crowdmeter');
    const meterFill = el('div', 'mg-crowdfill');
    meter.append(meterFill);
    const lane = el('div', 'mg-lane');
    const ring = el('div', 'mg-ring');
    lane.append(ring);
    stage.append(meter, lane, el('div', 'mg-hint', 'tap anywhere on the beat'));

    const live = []; // { node, born }
    let spawned = 0, judged = 0, over = false;

    function crowd() {
      const avg = results.length ? results.reduce((a, b) => a + b, 0) / results.length : 0.5;
      meterFill.style.width = `${Math.round(avg * 100)}%`;
      meterFill.className = 'mg-crowdfill ' + (avg > 0.65 ? 'mg-crowd-hot' : avg < 0.35 ? 'mg-crowd-cold' : '');
    }
    crowd();

    const spawner = setInterval(() => {
      if (spawned >= NOTES) { clearInterval(spawner); return; }
      spawned++;
      const n = el('div', 'mg-note', '♪');
      n.style.animationDuration = `${TRAVEL}ms`;
      lane.append(n);
      live.push({ node: n, born: performance.now() });
    }, GAP);

    // a note that sails past the ring untapped is a miss
    const sweeper = setInterval(() => {
      const now = performance.now();
      for (let i = live.length - 1; i >= 0; i--) {
        if (now - live[i].born > TRAVEL + 160) {
          live[i].node.classList.add('mg-note-miss');
          setTimeout((node) => node.remove(), 250, live[i].node);
          live.splice(i, 1);
          results.push(0); judged++; crowd(); maybeEnd();
        }
      }
    }, 60);

    function maybeEnd() {
      if (judged >= NOTES && !over) {
        over = true;
        clearInterval(spawner); clearInterval(sweeper);
        stage.removeEventListener('pointerdown', tap);
        setTimeout(() => done(results.reduce((a, b) => a + b, 0) / NOTES), 250);
      }
    }

    function tap() {
      if (over || !live.length) return;
      // judge the note nearest the ring
      const now = performance.now();
      let best = 0, bestDiff = Infinity;
      for (let i = 0; i < live.length; i++) {
        const diff = Math.abs(now - live[i].born - TRAVEL);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      }
      const { node } = live[best];
      live.splice(best, 1);
      // ±90ms perfect, fades to 0 at ±330ms
      const s = Math.max(0, 1 - Math.max(0, bestDiff - 90) / 240);
      results.push(s); judged++;
      (s > 0.5 ? fx.hit : fx.miss)();
      node.classList.add(s > 0.5 ? 'mg-note-hit' : 'mg-note-miss');
      ring.classList.add(s > 0.5 ? 'mg-ring-hit' : 'mg-ring-miss');
      setTimeout(() => ring.classList.remove('mg-ring-hit', 'mg-ring-miss'), 160);
      setTimeout((n2) => n2.remove(), 250, node);
      crowd(); maybeEnd();
    }
    stage.addEventListener('pointerdown', tap);
  },
});

// ═══════════ IDEA GRAB — songwriting (grab hooks, leave clichés) ═══════════
const IG_HOOKS = [
  'parking lot halo', 'rent-controlled heart', 'voicemail from July',
  'glitter in the drain', 'borrowed summer', 'basement cathedral',
  'landlord of my dreams', 'soft launch goodbye', 'group chat ghost',
  'terminal romantic', 'discount miracle', 'midnight layover',
  'apology tour', 'unskippable you', 'feral honeymoon',
];
const IG_CLICHES = [
  'baby baby yeah', 'hands up tonight', 'party never ends',
  'oh girl oh girl', 'live laugh love', 'turn it up loud',
  'dance the night away', 'you and me forever', 'burning like fire',
  'higher and higher', 'rock this town', 'feel the beat',
];
register('ideas', {
  name: 'Idea Grab', icon: '✍️',
  how: 'Lines float up from the notebook. GRAB the fresh ink — the vivid, specific ones (“feral honeymoon”). DODGE the faded clichés you’ve heard a thousand times (“baby baby yeah”). Fresh glows. Stale fades. 15 seconds.',
  run(stage, ctx, done) {
    const DURATION = 15000;
    const hooks = [...IG_HOOKS].sort(() => Math.random() - 0.5).slice(0, 7);
    const cliches = [...IG_CLICHES].sort(() => Math.random() - 0.5).slice(0, 5);
    const queue = [...hooks.map((t) => ({ t, good: true })), ...cliches.map((t) => ({ t, good: false }))]
      .sort(() => Math.random() - 0.5);

    const field = el('div', 'mg-field');
    const tally = el('div', 'mg-dots', '');
    const clock = el('div', 'mg-take-label', '15');
    stage.append(clock, field, tally, el('div', 'mg-hint', 'grab the glowing ink · dodge the faded clichés'));

    let grabbed = 0, stung = 0, over = false;
    const kept = []; // the hooks you actually caught — one may become a song title
    const t0 = performance.now();

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((DURATION - (performance.now() - t0)) / 1000));
      clock.textContent = String(left);
      if (left <= 0) end();
    }, 250);

    const spawner = setInterval(() => {
      const item = queue.shift();
      if (!item) { clearInterval(spawner); return; }
      // the tell: fresh hooks glow like wet ink, clichés float up faded —
      // you've heard them a thousand times and they LOOK like it
      const w = el('button', 'mg-word' + (item.good ? ' mg-word-fresh' : ' mg-word-stale'), item.t);
      w.style.left = `${6 + Math.random() * 55}%`;
      w.style.animationDuration = `${5200 + Math.random() * 1600}ms`;
      w.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (over || w.dataset.donePick) return;
        w.dataset.donePick = '1';
        if (item.good) { grabbed++; kept.push(item.t); fx.hit(); w.classList.add('mg-word-hit'); }
        else {
          stung++; fx.miss(); w.classList.add('mg-word-sting');
          w.textContent = 'cliché.'; // the sting teaches the rule
        }
        tally.textContent = `💡 ${grabbed}${stung ? `  💩 ${stung}` : ''}`;
        setTimeout(() => w.remove(), 340);
      });
      w.addEventListener('animationend', () => w.remove());
      field.append(w);
    }, 1050);

    function end() {
      if (over) return;
      over = true;
      clearInterval(ticker); clearInterval(spawner);
      done(Math.max(0, (grabbed - stung * 1.5) / 7), { hooks: kept });
    }
  },
});

// ═══════════ WORK THE ROOM — networking (keep 4 conversations alive) ═══════════
register('room', {
  name: 'Work the Room', icon: '🥂',
  how: 'Four conversations, one of you. Interest drains — tap a person to keep theirs alive. Anyone who hits empty walks off. 18 seconds. Nobody leaves.',
  run(stage, ctx, done) {
    const DURATION = 18000;
    const PEOPLE = [
      { icon: '🎩', name: 'Dario', drain: 0.075 },
      { icon: '🎚️', name: 'Grub', drain: 0.05 },
      { icon: '📝', name: 'the blogger', drain: 0.095 },
      { icon: '💼', name: 'A&R Kim', drain: 0.065 },
    ];
    const grid = el('div', 'mg-room');
    const clock = el('div', 'mg-take-label', '18');
    stage.append(clock, grid, el('div', 'mg-hint', 'tap whoever is fading'));

    const state = PEOPLE.map((p) => ({ ...p, level: 0.9, gone: false }));
    const cards = state.map((p) => {
      const c = el('button', 'mg-guest');
      c.innerHTML = `<span class="mg-guest-icon">${p.icon}</span><span class="mg-guest-name">${p.name}</span><span class="mg-guest-meter"><span class="mg-guest-fill"></span></span>`;
      c.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (p.gone || over) return;
        p.level = Math.min(1, p.level + 0.38);
        fx.hit();
        c.classList.add('mg-guest-talk');
        setTimeout(() => c.classList.remove('mg-guest-talk'), 200);
      });
      grid.append(c);
      return c;
    });

    let over = false;
    const t0 = performance.now();
    let uptimeSum = 0, samples = 0;

    const timer = setInterval(() => {
      const elapsed = performance.now() - t0;
      clock.textContent = String(Math.max(0, Math.ceil((DURATION - elapsed) / 1000)));
      state.forEach((p, i) => {
        if (p.gone) return;
        p.level -= p.drain * 0.12; // per tick (120ms)
        if (p.level <= 0) {
          p.gone = true;
          cards[i].classList.add('mg-guest-gone');
          cards[i].querySelector('.mg-guest-name').textContent = 'left.';
        } else {
          cards[i].querySelector('.mg-guest-fill').style.width = `${p.level * 100}%`;
          cards[i].querySelector('.mg-guest-fill').style.background =
            p.level < 0.28 ? 'var(--bad)' : p.level < 0.55 ? 'var(--accent)' : 'var(--good)';
        }
      });
      uptimeSum += state.filter((p) => !p.gone).length / state.length;
      samples++;
      if (elapsed >= DURATION) {
        over = true;
        clearInterval(timer);
        const alive = state.filter((p) => !p.gone).length / state.length;
        const avgLevel = state.reduce((a, p) => a + Math.max(0, p.level), 0) / state.length;
        done(alive * 0.55 + (uptimeSum / samples) * 0.25 + avgLevel * 0.2);
      }
    }, 120);
  },
});

// ═══════════ TIGHTEN UP — band rehearsal (echo the pattern) ═══════════
register('tighten', {
  name: 'Tighten Up', icon: '🥁',
  how: 'Rehearsing {song}: the band plays a pattern — watch the pads, play it back in order. Three rounds, each one longer. Tight is a decision.',
  run(stage, ctx, done) {
    const PADS = ['🎸', '🥁', '🎹', '🎺'];
    const rounds = [3, 4, 5];
    let round = 0, earned = 0;
    const total = rounds.reduce((a, b) => a + b, 0);

    const label = el('div', 'mg-take-label', 'WATCH');
    const grid = el('div', 'mg-room mg-pads');
    stage.append(label, grid, el('div', 'mg-hint', 'repeat what the band plays'));
    const pads = PADS.map((icon, i) => {
      const b = el('button', 'mg-pad', icon);
      b.dataset.i = i;
      grid.append(b);
      return b;
    });

    let seq = [], pos = 0, accepting = false;

    function flash(i, ms = 320) {
      pads[i].classList.add('mg-pad-on');
      setTimeout(() => pads[i].classList.remove('mg-pad-on'), ms);
    }

    function playRound() {
      seq = Array.from({ length: rounds[round] }, () => Math.floor(Math.random() * 4));
      pos = 0; accepting = false;
      label.textContent = `WATCH — round ${round + 1}`;
      seq.forEach((i, k) => setTimeout(() => flash(i), 420 + k * 480));
      setTimeout(() => { accepting = true; label.textContent = 'YOUR TURN'; }, 420 + seq.length * 480);
    }

    function endRound(clean) {
      accepting = false;
      round++;
      if (round >= rounds.length) {
        setTimeout(() => done(earned / total), 420);
      } else {
        label.textContent = clean ? 'TIGHT. NEXT.' : 'AGAIN — from the top';
        setTimeout(playRound, 800);
      }
    }

    pads.forEach((b, i) => b.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (!accepting) return;
      if (i === seq[pos]) {
        fx.hit();
        flash(i, 180);
        earned++; pos++;
        if (pos >= seq.length) endRound(true);
      } else {
        fx.miss();
        b.classList.add('mg-pad-bad');
        setTimeout(() => b.classList.remove('mg-pad-bad'), 300);
        endRound(false); // botched round: keep what you earned, move on
      }
    }));

    playRound();
  },
});

// ═══════════ KILL THE FEEDBACK — soundcheck reflexes (tap the hot channel) ═══════════
register('feedback', {
  name: 'Kill the Feedback', icon: '🔊',
  how: 'Channels squeal at random — tap the HOT one fast before it melts the room. Wrong channel costs you. Ten squeals. The board shows no mercy.',
  run(stage, ctx, done) {
    const CHANNELS = 6, SQUEALS = 10;
    const board = el('div', 'mg-board');
    const tally = el('div', 'mg-dots', '');
    stage.append(board, tally, el('div', 'mg-hint', 'tap the squealing channel'));

    const strips = [];
    for (let i = 0; i < CHANNELS; i++) {
      const s = el('button', 'mg-strip', `<span class="mg-strip-led"></span><span class="mg-strip-fader"></span>`);
      board.append(s);
      strips.push(s);
    }

    let fired = 0, resolved = 0, hits = 0, wrongs = 0, over = false;
    let hot = -1, hotAt = 0, burnTimer = null;

    function scoreboard() {
      tally.textContent = `killed ${hits}/${SQUEALS}${wrongs ? `  ✕${wrongs}` : ''}`;
    }
    scoreboard();

    function clearHot(burned) {
      if (hot < 0) return;
      strips[hot].classList.remove('mg-strip-hot');
      if (burned) strips[hot].classList.add('mg-strip-burnt');
      setTimeout((k) => strips[k]?.classList.remove('mg-strip-burnt'), 350, hot);
      hot = -1;
      clearTimeout(burnTimer);
    }

    function nextSqueal() {
      if (over) return;
      if (fired >= SQUEALS) return; // resolution of last one ends the game
      fired++;
      hot = Math.floor(Math.random() * CHANNELS);
      hotAt = performance.now();
      strips[hot].classList.add('mg-strip-hot');
      // unanswered squeal burns out after 1.5s = miss
      burnTimer = setTimeout(() => {
        clearHot(true);
        resolved++;
        scoreboard();
        maybeEnd();
        setTimeout(nextSqueal, 260 + Math.random() * 420);
      }, 1500);
    }

    function maybeEnd() {
      if (resolved >= SQUEALS && !over) {
        over = true;
        // reward accuracy, punish trigger-happiness
        done(Math.max(0, (hits - wrongs * 0.75) / SQUEALS));
      }
    }

    strips.forEach((s, i) => s.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (over) return;
      if (i === hot) {
        // faster kill = closer to perfect; anything under 350ms is elite
        const dt = performance.now() - hotAt;
        fx.hit();
        hits += dt < 350 ? 1 : dt < 900 ? 0.85 : 0.6;
        clearHot(false);
        resolved++;
        scoreboard();
        maybeEnd();
        setTimeout(nextSqueal, 260 + Math.random() * 420);
      } else {
        wrongs++;
        fx.miss();
        s.classList.add('mg-strip-wrong');
        setTimeout(() => s.classList.remove('mg-strip-wrong'), 250);
        scoreboard();
      }
    }));

    setTimeout(nextSqueal, 700);
  },
});

// ═══════════ MERCH RUSH — the table after the show (find what they want) ═══════════
register('merch', {
  name: 'Merch Rush', icon: '👕',
  how: 'The line is deep and everybody wants something different. Tap the item each customer asks for before their patience runs out. Eight customers. Exact change is a myth.',
  run(stage, ctx, done) {
    const ITEMS = ['👕', '🧢', '📼', '📀', '🧣', '📛'];
    const CUSTOMERS = 8;
    const PATIENCE = 2600; // ms per customer

    const ask = el('div', 'mg-ask');
    const patience = el('div', 'mg-crowdmeter');
    const pFill = el('div', 'mg-crowdfill');
    patience.append(pFill);
    const grid = el('div', 'mg-merch');
    const tally = el('div', 'mg-dots', '');
    stage.append(ask, patience, grid, tally);

    // shelf: shuffled every customer so it's search, not memory
    let want = null, servedAt = 0, served = 0, doneCount = 0, over = false;
    let pTimer = null, tickTimer = null;

    function shelf() {
      grid.innerHTML = '';
      [...ITEMS].sort(() => Math.random() - 0.5).forEach((it) => {
        const b = el('button', 'mg-item', it);
        b.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          if (over || !want) return;
          if (it === want) {
            const dt = performance.now() - servedAt;
            served += dt < 1100 ? 1 : dt < 2000 ? 0.8 : 0.6;
            fx.hit();
            b.classList.add('mg-item-yes');
            next(true);
          } else {
            fx.miss();
            b.classList.add('mg-item-no');
            setTimeout(() => b.classList.remove('mg-item-no'), 220);
            served = Math.max(0, served - 0.15); // fumbling the order
          }
        });
        grid.append(b);
      });
    }

    function next(soldOrLost) {
      clearTimeout(pTimer); clearInterval(tickTimer);
      if (want !== null) {
        doneCount++;
        tally.textContent = `served ${Math.round(served * 10) / 10}/${CUSTOMERS}`;
        want = null;
      }
      if (doneCount >= CUSTOMERS) {
        over = true;
        setTimeout(() => done(served / CUSTOMERS), 300);
        return;
      }
      setTimeout(() => {
        want = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        servedAt = performance.now();
        ask.innerHTML = `customer wants: <b>${want}</b>`;
        shelf();
        pFill.style.width = '100%';
        pFill.className = 'mg-crowdfill';
        tickTimer = setInterval(() => {
          const left = 1 - (performance.now() - servedAt) / PATIENCE;
          pFill.style.width = `${Math.max(0, left * 100)}%`;
          if (left < 0.33) pFill.classList.add('mg-crowd-cold');
        }, 80);
        pTimer = setTimeout(() => { ask.innerHTML = 'they left. line moves on.'; next(false); }, PATIENCE);
      }, 320);
    }

    shelf();
    next(false);
  },
});

// ═══════════ HAT TRICK — busking (drag the hat, catch the coins) ═══════════
register('hat', {
  name: 'Hat Trick', icon: '🎩',
  how: 'The crowd is throwing coins. DRAG the hat to catch them — streaks are worth extra, pavement gets nothing. Fifteen coins. Gravity is a critic.',
  run(stage, ctx, done) {
    const COINS = 15;
    const FALL = 1900; // ms to cross the field

    const field = el('div', 'mg-field mg-hatfield');
    const hat = el('div', 'mg-hat', '🎩');
    field.append(hat);
    const tally = el('div', 'mg-dots', 'streak ×0');
    stage.append(field, tally, el('div', 'mg-hint', 'drag anywhere — the hat follows'));

    let hatX = 0.5, caught = 0, judged = 0, streak = 0, bestBonus = 0, over = false;
    const place = () => { hat.style.left = `${hatX * 100}%`; };
    place();

    // the hat follows the pointer horizontally, wherever you touch
    const track = (e) => {
      const r = field.getBoundingClientRect();
      hatX = Math.max(0.06, Math.min(0.94, (e.clientX - r.left) / r.width));
      place();
    };
    stage.addEventListener('pointerdown', track);
    stage.addEventListener('pointermove', (e) => { if (e.buttons || e.pressure > 0) track(e); });

    let spawned = 0;
    const spawner = setInterval(() => {
      if (spawned >= COINS || over) { clearInterval(spawner); return; }
      spawned++;
      const coin = el('div', 'mg-coin', '🪙');
      const x = 0.08 + Math.random() * 0.84;
      coin.style.left = `${x * 100}%`;
      coin.style.animationDuration = `${FALL}ms`;
      field.append(coin);
      setTimeout(() => {
        if (over) return;
        const dx = Math.abs(x - hatX);
        judged++;
        if (dx < 0.11) {
          streak++;
          caught += 1 + Math.min(0.5, (streak - 1) * 0.1); // streak sweetener
          bestBonus = Math.max(bestBonus, streak);
          fx.hit();
          coin.classList.add('mg-coin-caught');
          hat.classList.add('mg-hat-pop');
          setTimeout(() => hat.classList.remove('mg-hat-pop'), 150);
        } else {
          streak = 0;
          fx.miss();
          coin.classList.add('mg-coin-lost');
        }
        tally.textContent = `streak ×${streak}`;
        setTimeout(() => coin.remove(), 260);
        if (judged >= COINS) {
          over = true;
          // 15 clean catches with streaks ≈ 19+; normalize so ~13 flat catches = solid
          setTimeout(() => done(Math.min(1, caught / 17)), 300);
        }
      }, FALL - 60);
    }, 820);
  },
});

// ═══════════ ON MESSAGE — the interview (say it or deflect, 2s each) ═══════════
const OM_GOLD = [
  '“We recorded it in a shed. I’d do it again.”',
  '“The new songs scare me a little. Good sign.”',
  '“Craig? Craig is a genius. Print that.”',
  '“I practice more now than when I was broke.”',
  '“The fans finish the chorus better than I do.”',
  '“Every band is four arguments in a trench coat.”',
  '“I still get nervous. You should always be nervous.”',
];
const OM_TRAPS = [
  '“Honestly, THIS city’s fans are smarter than the last one’s—”',
  '“The label? Ha. Don’t get me started on the label—”',
  '“It’s about my ex. Their name? Sure, it’s—”',
  '“Streaming is theft and my fans who use it are—”',
  '“I could write {rival}’s songs in my sleep—”',
  '“Off the record? The festival books whoever pays—”',
];
register('interview', {
  name: 'On Message', icon: '🎙️',
  how: 'Quotes surface mid-interview — you have two seconds each: SAY the gold, DEFLECT the career-enders. Ten quotes. The mic is always on.',
  run(stage, ctx, done) {
    const gold = [...OM_GOLD].sort(() => Math.random() - 0.5).slice(0, 5);
    const traps = [...OM_TRAPS].sort(() => Math.random() - 0.5).slice(0, 5);
    const queue = [...gold.map((t) => ({ t, good: true })), ...traps.map((t) => ({ t, good: false }))]
      .sort(() => Math.random() - 0.5);

    const quote = el('div', 'mg-quote', '');
    const timerBar = el('div', 'mg-crowdmeter');
    const timerFill = el('div', 'mg-crowdfill');
    timerBar.append(timerFill);
    const row = el('div', 'mg-omrow');
    const sayBtn = el('button', 'btn mg-say', '💬 Say it');
    const zipBtn = el('button', 'btn mg-zip', '🤐 Deflect');
    row.append(zipBtn, sayBtn);
    const tally = el('div', 'mg-dots', '');
    stage.append(quote, timerBar, row, tally);

    const WINDOW = 2000;
    let idx = -1, right = 0, over = false, deadline = null, tick = null, current = null;

    function judge(saidIt) {
      if (over || !current) return;
      clearTimeout(deadline); clearInterval(tick);
      const correct = saidIt === current.good;
      if (correct) right++;
      (correct ? fx.hit : fx.miss)();
      quote.classList.add(correct ? 'mg-quote-good' : 'mg-quote-bad');
      tally.textContent = `on message: ${right}/${idx + 1}`;
      current = null;
      setTimeout(next, 420);
    }

    function next() {
      quote.classList.remove('mg-quote-good', 'mg-quote-bad');
      idx++;
      if (idx >= queue.length) {
        over = true;
        setTimeout(() => done(right / queue.length), 300);
        return;
      }
      current = queue[idx];
      quote.textContent = current.t.replace('{rival}', ctx.rivalName || 'your rival');
      const t0 = performance.now();
      timerFill.style.width = '100%';
      timerFill.className = 'mg-crowdfill';
      tick = setInterval(() => {
        const left = 1 - (performance.now() - t0) / WINDOW;
        timerFill.style.width = `${Math.max(0, left * 100)}%`;
        if (left < 0.35) timerFill.classList.add('mg-crowd-cold');
      }, 60);
      // silence on a gold quote wastes it; silence on a trap is SAFE
      deadline = setTimeout(() => {
        if (over || !current) return;
        clearInterval(tick);
        const wasTrap = !current.good;
        if (wasTrap) right++; // saying nothing dodges the trap
        quote.classList.add(wasTrap ? 'mg-quote-good' : 'mg-quote-bad');
        tally.textContent = `on message: ${right}/${idx + 1}`;
        current = null;
        setTimeout(next, 420);
      }, WINDOW);
    }

    sayBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); judge(true); });
    zipBtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); judge(false); });
    next();
  },
});

// ═══════════ HOLD THE NOTE — sustain (hold to rise, release to fall) ═══════════
register('note', {
  name: 'Hold the Note', icon: '🎵',
  how: 'The big note in {song}: PRESS to push it up, RELEASE to let it fall — keep it inside the drifting band. Fifteen seconds. It doesn’t sing itself.',
  run(stage, ctx, done) {
    const DURATION = 15000;
    const gauge = el('div', 'mg-gauge');
    const band = el('div', 'mg-band');
    const pitch = el('div', 'mg-pitch');
    gauge.append(band, pitch);
    const clock = el('div', 'mg-take-label', '15');
    stage.append(clock, gauge, el('div', 'mg-hint', 'hold anywhere · release to drop'));

    let level = 0.5, bandC = 0.5, bandW = 0.26, holding = false;
    let inside = 0, samples = 0, over = false;
    let drift = (Math.random() - 0.5) * 0.2;
    const t0 = performance.now();

    stage.addEventListener('pointerdown', () => { holding = true; });
    stage.addEventListener('pointerup', () => { holding = false; });
    stage.addEventListener('pointercancel', () => { holding = false; });

    let last = t0;
    function frame(now) {
      if (over) return;
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      // physics: hold pushes up, gravity pulls down
      level += (holding ? 0.55 : -0.5) * dt;
      level = Math.max(0, Math.min(1, level));
      // the band wanders, tightening over time
      if (Math.random() < 0.02) drift = (Math.random() - 0.5) * 0.24;
      bandC = Math.max(0.18, Math.min(0.82, bandC + drift * dt));
      bandW = Math.max(0.14, 0.26 - ((now - t0) / DURATION) * 0.1);
      // paint
      pitch.style.bottom = `${level * 100}%`;
      band.style.bottom = `${(bandC - bandW / 2) * 100}%`;
      band.style.height = `${bandW * 100}%`;
      const ok = Math.abs(level - bandC) < bandW / 2;
      pitch.classList.toggle('mg-pitch-in', ok);
      inside += ok ? 1 : 0; samples++;
      const leftS = Math.max(0, Math.ceil((DURATION - (now - t0)) / 1000));
      clock.textContent = String(leftS);
      if (now - t0 >= DURATION) {
        over = true;
        done(inside / samples);
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  },
});

// ═══════════ PACK THE VAN — load-out (tap biggest-first) ═══════════
register('pack', {
  name: 'Pack the Van', icon: '🚐',
  how: 'Physics is law: BIGGEST first. Tap the gear in size order before the venue locks up. Wrong order wastes precious seconds.',
  run(stage, ctx, done) {
    const GEAR = ['🥁', '🔊', '🎹', '🎸', '🎺', '🎻', '🎤', '🪇'];
    // sizes descend with index — shuffle display, demand size order
    const items = GEAR.map((icon, i) => ({ icon, size: GEAR.length - i }))
      .sort(() => Math.random() - 0.5);

    const clock = el('div', 'mg-take-label', '20');
    const field = el('div', 'mg-packgrid');
    const tally = el('div', 'mg-dots', 'van: empty');
    stage.append(clock, field, tally, el('div', 'mg-hint', 'biggest first — the drums are always first'));

    let next = GEAR.length; // size we need next (8, then 7, ...)
    let packed = 0, fumbles = 0, over = false;
    const t0 = performance.now();
    const DURATION = 20000;

    items.forEach((it) => {
      const b = el('button', 'mg-gear', it.icon);
      // visual size cue: font scales with size
      b.style.fontSize = `${18 + it.size * 3.2}px`;
      b.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (over || b.dataset.gone) return;
        if (it.size === next) {
          b.dataset.gone = '1';
          fx.hit();
          b.classList.add('mg-gear-in');
          packed++; next--;
          tally.textContent = `van: ${packed}/${GEAR.length}`;
          if (packed >= GEAR.length) end();
        } else {
          fumbles++;
          fx.miss();
          b.classList.add('mg-gear-no');
          setTimeout(() => b.classList.remove('mg-gear-no'), 220);
        }
      });
      field.append(b);
    });

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((DURATION - (performance.now() - t0)) / 1000));
      clock.textContent = String(left);
      if (left <= 0) end();
    }, 250);

    function end() {
      if (over) return;
      over = true;
      clearInterval(ticker);
      // full pack fast & clean = golden; fumbles and leftovers cost
      const t = (performance.now() - t0) / 1000;
      const speed = packed >= GEAR.length ? Math.max(0, 1 - Math.max(0, t - 9) / 16) : 0;
      done(Math.max(0, (packed / GEAR.length) * 0.7 + speed * 0.3 - fumbles * 0.05));
    }
  },
});

// ═══════════ TRADING BARS — the duel (answer the phrase BACKWARDS) ═══════════
register('duel', {
  name: 'Trading Bars', icon: '🥊',
  how: 'The duel rule: they play a phrase, you answer it MIRRORED — same pads, reverse order. Three exchanges. The crowd keeps score.',
  run(stage, ctx, done) {
    const PADS = ['🎸', '🥁', '🎹', '🎺'];
    const rounds = [3, 4, 5];
    let round = 0, earned = 0;
    const total = rounds.reduce((a, b) => a + b, 0);

    const label = el('div', 'mg-take-label', 'THEY PLAY');
    const grid = el('div', 'mg-room mg-pads');
    stage.append(label, grid, el('div', 'mg-hint', 'answer in REVERSE order'));
    const pads = PADS.map((icon, i) => {
      const b = el('button', 'mg-pad', icon);
      b.dataset.i = i;
      grid.append(b);
      return b;
    });

    let seq = [], answer = [], pos = 0, accepting = false;

    function flash(i, ms = 300, cls = 'mg-pad-on') {
      pads[i].classList.add(cls);
      setTimeout(() => pads[i].classList.remove(cls), ms);
    }

    function playRound() {
      seq = Array.from({ length: rounds[round] }, () => Math.floor(Math.random() * 4));
      answer = [...seq].reverse();
      pos = 0; accepting = false;
      label.textContent = `${(ctx.rivalName || 'THEY').toUpperCase()} PLAYS`;
      seq.forEach((i, k) => setTimeout(() => flash(i), 420 + k * 460));
      setTimeout(() => { accepting = true; label.textContent = 'ANSWER — MIRRORED'; }, 420 + seq.length * 460);
    }

    function endRound(clean) {
      accepting = false;
      round++;
      if (round >= rounds.length) {
        setTimeout(() => done(earned / total), 420);
      } else {
        label.textContent = clean ? 'THE CROWD ROARS' : 'THEY SMIRK. AGAIN.';
        setTimeout(playRound, 850);
      }
    }

    pads.forEach((b, i) => b.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (!accepting) return;
      if (i === answer[pos]) {
        fx.hit();
        flash(i, 170, 'mg-pad-you');
        earned++; pos++;
        if (pos >= answer.length) endRound(true);
      } else {
        fx.miss();
        flash(i, 280, 'mg-pad-bad');
        endRound(false);
      }
    }));

    playRound();
  },
});

// ═══════════ THE MIXDOWN — find the sweet spot on three faders ═══════════
register('mixdown', {
  name: 'The Mixdown', icon: '🎛️',
  how: 'Three faders, three hidden sweet spots. DRAG each until its meter runs hot — the mix of {song} is due in 18 seconds. Trust your ears. They’re lying, but trust them.',
  run(stage, ctx, done) {
    const DURATION = 18000;
    const CHANNELS = [
      { name: 'LOW', target: 0.15 + Math.random() * 0.7 },
      { name: 'MID', target: 0.15 + Math.random() * 0.7 },
      { name: 'HIGH', target: 0.15 + Math.random() * 0.7 },
    ];
    const clock = el('div', 'mg-take-label', '18');
    const mixer = el('div', 'mg-mixer');
    stage.append(clock, mixer, el('div', 'mg-hint', 'drag the faders — green means close'));

    const closeness = (ch) => Math.max(0, 1 - Math.abs(ch.level - ch.target) / 0.45);
    const chans = CHANNELS.map((c) => {
      const ch: any = { ...c, level: 0.5 };
      const track = el('div', 'mg-fader');
      const rail = el('div', 'mg-fader-rail');
      const knob = el('div', 'mg-fader-knob');
      const vu = el('div', 'mg-fader-vu');
      const label = el('div', 'mg-fader-name', c.name);
      track.append(rail, knob, vu, label);
      mixer.append(track);
      const paint = () => {
        knob.style.bottom = `${8 + ch.level * 76}%`;
        const cl = closeness(ch);
        vu.className = 'mg-fader-vu ' + (cl > 0.82 ? 'vu-hot' : cl > 0.5 ? 'vu-warm' : 'vu-cold');
      };
      paint();
      const drag = (e) => {
        const r = track.getBoundingClientRect();
        const prev = closeness(ch);
        ch.level = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
        const now = closeness(ch);
        if (now > 0.82 && prev <= 0.82) fx.hit();
        paint();
      };
      track.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        track.setPointerCapture(e.pointerId);
        drag(e);
      });
      track.addEventListener('pointermove', (e) => { if (e.buttons || e.pressure > 0) drag(e); });
      ch.score = () => closeness(ch);
      return ch;
    });

    let over = false;
    const t0 = performance.now();
    const lock = el('button', 'btn primary mg-btn', 'PRINT IT');
    lock.addEventListener('click', () => end());
    stage.append(lock);

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((DURATION - (performance.now() - t0)) / 1000));
      clock.textContent = String(left);
      if (left <= 0) end();
    }, 200);

    function end() {
      if (over) return;
      over = true;
      clearInterval(ticker);
      // avg closeness; a tiny early-print sweetener rewards confidence
      const base = chans.reduce((a, c) => a + c.score(), 0) / chans.length;
      const early = Math.max(0, (DURATION - (performance.now() - t0)) / DURATION) * 0.06;
      done(Math.min(1, base + (base > 0.5 ? early : 0)));
    }
  },
});

// ═══════════ THE SETLIST — build the arc (calm → loud, 5 songs) ═══════════
register('setlist', {
  name: 'The Setlist', icon: '📜',
  how: 'Five songs, one arc. Tap them CALMEST → LOUDEST before the house lights drop. The bars are the energy. Openers whisper, closers detonate.',
  run(stage, ctx, done) {
    const DURATION = 14000;
    // your actual catalog headlines the set; house standards fill the gaps
    const FILLER = ['The Fast One', 'The Sad One', 'Soundcheck Jam', 'Deep Cut', 'The Old Opener', 'New One (Untitled)'];
    const titles = [...new Set((ctx.run?.songs || []).map((s) => s.title))].slice(0, 5);
    for (const f of FILLER) { if (titles.length >= 5) break; titles.push(f); }
    const energies = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const songs = titles.map((t, i) => ({ t, e: energies[i] }));

    const clock = el('div', 'mg-take-label', '14');
    const list = el('div', 'mg-setlist');
    const progress = el('div', 'mg-dots', '○ ○ ○ ○ ○');
    stage.append(clock, list, progress, el('div', 'mg-hint', 'tap the calmest song still standing'));

    let expected = 1, correct = 0, wrong = 0, over = false;
    const t0 = performance.now();

    for (const s of [...songs].sort(() => Math.random() - 0.5)) {
      const chip = el('button', 'mg-set-chip');
      chip.innerHTML = `<b>${s.t}</b><span class="mg-set-bars">${'▮'.repeat(s.e)}${'▯'.repeat(5 - s.e)}</span>`;
      chip.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (over || chip.dataset.locked) return;
        if (s.e === expected) {
          chip.dataset.locked = '1';
          chip.classList.add('mg-set-locked');
          chip.querySelector('b').textContent = `${expected}. ${s.t}`;
          fx.hit();
          correct++; expected++;
          progress.textContent = Array.from({ length: 5 }, (_, i) => (i < correct ? '●' : '○')).join(' ');
          if (expected > 5) end();
        } else {
          wrong++;
          fx.miss();
          chip.classList.add('mg-set-wrong');
          setTimeout(() => chip.classList.remove('mg-set-wrong'), 260);
        }
      });
      list.append(chip);
    }

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((DURATION - (performance.now() - t0)) / 1000));
      clock.textContent = String(left);
      if (left <= 0) end();
    }, 200);

    function end() {
      if (over) return;
      over = true;
      clearInterval(ticker);
      const early = expected > 5 ? Math.max(0, (DURATION - (performance.now() - t0)) / DURATION) * 0.12 : 0;
      done(Math.max(0, correct / 5 - wrong * 0.1 + early));
    }
  },
});

// ═══════════ THE PROMPTER — mid-song, the next line is GONE (taste under fire) ═══════════
// Same taste rule Idea Grab teaches: the vivid, specific line is yours; the
// clichés are everyone's. Five lines, one blank each, the band won't stop.
const PR_LINES = [
  { lead: 'We kissed in the ___ of the parking lot', right: 'cathedral light', wrong: ['moonlight, baby', 'middle, tonight'] },
  { lead: 'My heart is a ___ nobody returns', right: 'library book', wrong: ['burning fire', 'lonely road'] },
  { lead: 'You left like a ___ in a rented house', right: 'security deposit', wrong: ['ghost at night', 'summer rain'] },
  { lead: 'Love is just ___ with better lighting', right: 'a soundcheck', wrong: ['a battlefield', 'a fire burning'] },
  { lead: 'I keep your voice in the ___ drawer', right: 'takeout-menu', wrong: ['top secret', 'broken heart'] },
  { lead: 'We danced like the ___ was watching', right: 'landlord', wrong: ['whole world', 'night sky'] },
  { lead: 'Missing you is my ___ now', right: 'part-time job', wrong: ['whole life', 'burning flame'] },
  { lead: 'Your goodbye sounded like a ___', right: 'dial tone from 2009', wrong: ['broken dream', 'sad, sad song'] },
];
register('prompter', {
  name: 'The Prompter', icon: '🎤',
  how: 'Mid-song and the next line is GONE. Five lines, one blank each — tap the line YOU would have written: the vivid, specific one. The clichés belong to everyone else. Three seconds a line. The band won’t stop.',
  run(stage, ctx, done) {
    const lines = [...PR_LINES].sort(() => Math.random() - 0.5).slice(0, 5);
    const label = el('div', 'mg-take-label', 'LINE 1');
    const lead = el('div', 'mg-prompter-lead', '');
    const opts = el('div', 'mg-prompter-opts');
    const dots = el('div', 'mg-dots', '○ ○ ○ ○ ○');
    stage.append(label, lead, opts, dots, el('div', 'mg-hint', 'tap the line you’d have written'));

    let i = 0, score = 0, over = false, timer = null;
    const results = [];

    function paintDots() {
      dots.textContent = Array.from({ length: 5 }, (_, k) =>
        k < results.length ? (results[k] ? '●' : '✕') : '○').join(' ');
    }

    function next() {
      if (over) return;
      if (i >= lines.length) { over = true; done(score / lines.length); return; }
      const L = lines[i];
      label.textContent = `LINE ${i + 1}`;
      lead.textContent = `“${L.lead}…”`;
      opts.innerHTML = '';
      const options = [L.right, ...L.wrong].sort(() => Math.random() - 0.5);
      let answered = false;
      const answer = (ok) => {
        if (answered || over) return;
        answered = true;
        clearTimeout(timer);
        results.push(ok);
        if (ok) { score += 1; fx.hit(); } else { fx.miss(); }
        paintDots();
        i += 1;
        setTimeout(next, 260);
      };
      for (const o of options) {
        const b = el('button', 'mg-prompter-opt', o);
        b.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          b.classList.add(o === L.right ? 'mg-word-hit' : 'mg-word-sting');
          answer(o === L.right);
        });
        opts.append(b);
      }
      timer = setTimeout(() => answer(false), 3200); // the band moved on
    }
    next();
  },
});
