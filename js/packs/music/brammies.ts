// The Brammies (Pass 44) — music's procedural awards-night set piece, shown at
// the start of the final act (presenter.actStartOverlay gates it). A bespoke
// pack screen: it renders with the shell's neutral dom toolkit and, when done,
// calls the shell's `onDone` to fall through to the normal act interstitial.

import * as engine from '../../engine.js';
import { rivalById } from './data/rivals.js';
import { genreById } from './data/genres.js';
import { buildChart } from './charts.js';
import { el, $, show, openOverlay, spawnConfetti } from '../../ui/dom.js';
import { run } from '../../ui/context.js';
import { sfx } from '../../audio.js';
import * as save from '../../save.js';

export function showBrammies(step: any, onDone: () => void) {
  const rng = engine.mulberry32((run.flavorSeed || 1) * 7 + 44);
  const rival = rivalById(run.rival);
  const genre = genreById(run.genre);
  const category = genre
    ? `Best Emerging ${genre.name} Act`
    : ['Best New Act (Regional)', 'Breakthrough Artist To Watch', 'Best Live Act Under 500 Cap'][Math.floor(rng() * 3)];
  const chart = buildChart(run).filter((r: any) => !r.you && !r.rival).slice(0, 2);
  const nominees = [rival.name, ...chart.map((r: any) => r.artist)];
  // your odds scale with fame; the rival feeds on feud heat
  const winChance = Math.min(0.85, Math.max(0.2, run.fame / 110 - (run.rivalry >= 7 ? 0.1 : 0)));
  const youWin = rng() < winChance;

  const s = $('#screen-crossroads');
  s.innerHTML = '';
  s.append(el('h2', 'screen-head', '🏆 The Brammies'));
  s.append(el('p', 'screen-sub',
    `You’re nominated: <b>${category}</b>. Also nominated: ${nominees.join(', ')}. The envelope exists. The cameras are ON you. What do you rehearse in the hotel mirror?`));
  const row = el('div', 'pick-row');

  const outcomes = (prepared: string) => {
    run.brammy = youWin ? 'won' : 'lost';
    let text, deltas;
    if (youWin && prepared === 'speech') {
      text = `They call your name. The speech lands — every thank-you in order, the joke placed just right, one genuine crack in your voice you didn’t rehearse. The clip travels for weeks.`;
      run.fame += 12; run.stats.cred = Math.min(100, run.stats.cred + 4);
      deltas = '★ +12 Fame · 🤟 +4 Cred';
    } else if (youWin && prepared === 'lossface') {
      text = `They call your name and you walk up with nothing. The fumbling, unprepared, honest mess of a speech is somehow MORE charming. “Authentic,” says everyone. You thanked your landlord.`;
      run.fame += 8; run.stats.cred = Math.min(100, run.stats.cred + 6);
      deltas = '★ +8 Fame · 🤟 +6 Cred';
    } else if (!youWin && prepared === 'speech') {
      text = `${rival.name} wins. The camera finds you mid-expression — the exact face of someone with a folded speech in their pocket. The GIF is instant. The speech stays folded forever.`;
      run.fame += 3; run.stats.burnout = Math.min(100, run.stats.burnout + 6); run.rivalry = Math.min(10, (run.rivalry ?? 3) + 2);
      deltas = '★ +3 Fame · 🔥 +6 Burnout · ⚔ Feud +2';
    } else {
      text = `${rival.name} wins. Your gracious-loss face — rehearsed to perfection — broadcasts pure class to four million viewers. Industry folk remember losers who clap like that.`;
      run.fame += 5; run.stats.cred = Math.min(100, run.stats.cred + 5); run.stats.network = Math.min(100, run.stats.network + 4);
      deltas = '★ +5 Fame · 🤟 +5 Cred · 📱 +4 Network';
    }
    save.saveRun(run);
    openOverlay((ov) => {
      const box = el('div', `result-card tier-${youWin ? 'incredible' : 'good'}`);
      if (youWin) { spawnConfetti(ov); sfx.win(); } else sfx.good();
      box.append(el('div', 'tier-badge', youWin ? 'AND THE BRAMMY GOES TO... YOU' : `AND THE BRAMMY GOES TO... ${rival.name.toUpperCase()}`));
      box.append(el('p', 'result-text', text));
      box.append(el('p', 'pick-mods', deltas));
      box.append(el('p', 'tap-hint', 'tap to continue'));
      ov.append(box);
    }, { armMs: 300, onClose: () => { onDone(); show('#screen-game'); } });
  };

  const speech = el('div', 'pick-card path-card');
  speech.append(el('div', 'path-icon', '📜'));
  speech.append(el('h3', '', 'Rehearse the acceptance speech'));
  speech.append(el('p', 'pick-flavor', 'Thank-yous ranked by billing. One tasteful joke. Belief, laminated.'));
  speech.addEventListener('click', () => { sfx.commit(); outcomes('speech'); });
  const loss = el('div', 'pick-card path-card');
  loss.append(el('div', 'path-icon', '🙂'));
  loss.append(el('h3', '', 'Rehearse the gracious-loss face'));
  loss.append(el('p', 'pick-flavor', 'Chin up, warm applause, zero visible eye-twitch. Oscar-grade humility.'));
  loss.addEventListener('click', () => { sfx.commit(); outcomes('lossface'); });
  row.append(speech, loss);
  s.append(row);
  show('#screen-crossroads');
}
