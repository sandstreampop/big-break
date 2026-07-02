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
