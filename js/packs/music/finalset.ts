// Music's Final Set (Pass 32): the pre-finale closer choice. Returns the
// {head, sub, options} the shared pre-finale screen renders; each option is a
// closer with an honest gate-impact readout (computed by the shell). Moved out
// of js/ui/progression.ts so the shared screen ships no music closer.

import { releaseSong } from './songs.js';
import { PATHS } from './manifest.js';

export function musicFinalSet(run: any) {
  const flags = run.flags || [];
  const options: any[] = [];
  if (flags.includes('song_finished')) {
    options.push({ title: '“The Door”', blurb: 'The one you found at 3 a.m. and finished anyway.', stat: 'pathProgress', amount: 1, label: '+1 Momentum', apply: () => { run.pathProgress += 1; } });
  }
  // the crowd-pleaser is your ACTUAL hit — closing with it feeds the final
  // chart week (evaluateFinale ticks the chart before judgment)
  const hit = (run.songs || []).filter((x: any) => x.status === 'charting' && x.pos).sort((a: any, b: any) => a.pos - b.pos)[0]
    || (run.songs || []).find((x: any) => x.crowned);
  options.push({
    title: hit ? `“${hit.title}”` : (run.chartTitles?.[0] ? `“${run.chartTitles[0]}”` : '“The Crowd-Pleaser”'),
    blurb: hit && hit.pos ? `Charting at #${hit.pos} right now. The room knows the first chord.` : 'The one they scream for. Give the people what they want.',
    stat: 'fame', amount: 5, label: hit ? '+5 Fame · feeds the final chart week' : '+5 Fame',
    apply: () => { run.fame += 5; if (hit) hit.hype = Math.min(100, hit.hype + 25); },
  });
  // a great unreleased demo can debut LIVE as your closer — it enters the
  // chart in the finale's last tick, and might even crown
  const vault = (run.songs || []).filter((x: any) => x.status === 'demo').sort((a: any, b: any) => b.quality - a.quality)[0];
  if (vault && vault.quality >= 55) {
    options.push({
      title: `“${vault.title}” (unreleased)`,
      blurb: 'Debut the vault song. Right now. Live. Careers should end on a first.',
      stat: 'cred', amount: 3, label: '+3 Cred · releases it tonight',
      apply: () => { run.stats.cred = Math.min(100, run.stats.cred + 3); releaseSong(run, vault.id, 58); },
    });
  }
  options.push({ title: '“The Deep Cut”', blurb: 'Track 9. The heads nod. The heads matter.', stat: 'cred', amount: 4, label: '+4 Cred', apply: () => { run.stats.cred = Math.min(100, run.stats.cred + 4); } });
  if (flags.includes('debt') || run.money < 0) {
    // debt outranks storytelling: the Curtis closer must survive the 3-slot cut
    options.splice(Math.min(2, options.length), 0,
      { title: '“Curtis (Reprise)”', blurb: 'A ballad for the politest man you owe.', stat: 'money', amount: 100, label: '+$100', apply: () => { run.money += 100; } });
  } else {
    options.push({ title: '“The Instrumental”', blurb: 'No words. Just proof.', stat: 'skill', amount: 4, label: '+4 Skill', apply: () => { run.stats.skill = Math.min(100, run.stats.skill + 4); } });
  }

  const pathName = run.path ? PATHS[run.path].name : 'your path';
  return {
    head: 'The Final Set',
    sub: `Last night of the run — your <b>${pathName}</b> career gets judged after this. Pick the closer that pushes you over a gate.`,
    options,
  };
}
