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

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

// Runs the full flow: intro (play/skip) → game → verdict beat.
// Resolves { score, verdict } — score null when skipped.
export function playMinigame(id, ctx = {}) {
  const def = GAMES[id];
  if (!def) return Promise.resolve({ score: null, verdict: verdictFor(null) });
  return new Promise((resolve) => {
    const layer = el('div', 'mg-layer');
    const box = el('div', 'mg-box');
    layer.append(box);
    document.querySelector('#app').append(layer);

    let finished = false;
    const finish = (score) => {
      if (finished) return;
      finished = true;
      const verdict = verdictFor(score);
      if (score == null) { layer.remove(); resolve({ score, verdict }); return; }
      // verdict beat: one readable moment before the card resolves
      box.innerHTML = '';
      box.append(el('div', `mg-verdict ${verdict.cls}`, verdict.label));
      box.append(el('div', 'mg-verdict-sub',
        `${verdict.bonus >= 0 ? '+' : ''}${verdict.bonus} on this roll`));
      setTimeout(() => { layer.remove(); resolve({ score, verdict }); }, 950);
    };

    // intro card
    box.append(el('div', 'mg-title', `${def.icon} ${def.name}`));
    box.append(el('div', 'mg-how', def.how));
    const play = el('button', 'btn primary mg-btn', '▶ Play');
    const skip = el('button', 'btn ghost mg-btn', 'Skip — just roll');
    play.addEventListener('click', () => {
      box.innerHTML = '';
      const stage = el('div', 'mg-stage');
      box.append(stage);
      // hard cap: no game may hold the run hostage
      const cap = setTimeout(() => finish(0.2), 32000);
      def.run(stage, ctx, (score) => { clearTimeout(cap); finish(Math.max(0, Math.min(1, score))); });
    });
    skip.addEventListener('click', () => finish(null));
    box.append(play, skip);
  });
}

// ═══════════ THE TAKE — studio timing (tap the sweet spot, 3 takes) ═══════════
register('take', {
  name: 'The Take', icon: '🎚️',
  how: 'The needle sweeps. Tap when it’s in the golden zone. Three takes — the zone shrinks each time. Tape is rolling.',
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
  how: 'Notes fly toward the ring. Tap ON the beat — each hit lifts the crowd, each miss drops it. Eight notes. Own the room.',
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
  how: 'Lines float up from the notebook. GRAB the hooks. Let the clichés drift by — touching one costs you. 15 seconds of inspiration.',
  run(stage, ctx, done) {
    const DURATION = 15000;
    const hooks = [...IG_HOOKS].sort(() => Math.random() - 0.5).slice(0, 7);
    const cliches = [...IG_CLICHES].sort(() => Math.random() - 0.5).slice(0, 5);
    const queue = [...hooks.map((t) => ({ t, good: true })), ...cliches.map((t) => ({ t, good: false }))]
      .sort(() => Math.random() - 0.5);

    const field = el('div', 'mg-field');
    const tally = el('div', 'mg-dots', '');
    const clock = el('div', 'mg-take-label', '15');
    stage.append(clock, field, tally, el('div', 'mg-hint', 'tap the lines worth keeping'));

    let grabbed = 0, stung = 0, over = false;
    const t0 = performance.now();

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((DURATION - (performance.now() - t0)) / 1000));
      clock.textContent = String(left);
      if (left <= 0) end();
    }, 250);

    const spawner = setInterval(() => {
      const item = queue.shift();
      if (!item) { clearInterval(spawner); return; }
      const w = el('button', 'mg-word', item.t);
      w.style.left = `${6 + Math.random() * 55}%`;
      w.style.animationDuration = `${5200 + Math.random() * 1600}ms`;
      w.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (over || w.dataset.donePick) return;
        w.dataset.donePick = '1';
        if (item.good) { grabbed++; w.classList.add('mg-word-hit'); }
        else { stung++; w.classList.add('mg-word-sting'); }
        tally.textContent = `💡 ${grabbed}${stung ? `  💩 ${stung}` : ''}`;
        setTimeout(() => w.remove(), 300);
      });
      w.addEventListener('animationend', () => w.remove());
      field.append(w);
    }, 1050);

    function end() {
      if (over) return;
      over = true;
      clearInterval(ticker); clearInterval(spawner);
      done(Math.max(0, (grabbed - stung * 1.5) / 7));
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
  how: 'The band plays a pattern — watch the pads. Then play it back, in order. Three rounds, each one longer. Tight is a decision.',
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
        flash(i, 180);
        earned++; pos++;
        if (pos >= seq.length) endRound(true);
      } else {
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
        hits += dt < 350 ? 1 : dt < 900 ? 0.85 : 0.6;
        clearHot(false);
        resolved++;
        scoreboard();
        maybeEnd();
        setTimeout(nextSqueal, 260 + Math.random() * 420);
      } else {
        wrongs++;
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
            b.classList.add('mg-item-yes');
            next(true);
          } else {
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
          coin.classList.add('mg-coin-caught');
          hat.classList.add('mg-hat-pop');
          setTimeout(() => hat.classList.remove('mg-hat-pop'), 150);
        } else {
          streak = 0;
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
