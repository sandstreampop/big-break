// Music's share payload: the default share text and the poster image. Moved
// out of js/ui/endings.ts so the shared ending screen ships no share-card
// composer and names no genre — it just calls presenter.shareText /
// presenter.shareImage and runs the generic navigator.share dance.

import { renderShareImage } from '../sharecard.js';
import { buildDefaultShareText } from '../share-text.js';
import { genreById } from '../data/genres.js';
import { instrumentById } from '../data/instruments.js';
import { DEFAULT_FAIL_LABELS } from '../share-text.js';
import { PATHS } from './music-manifest.js';

export function musicShareText(summary: any, lp: number): string {
  const inst = instrumentById(summary.loadout);
  const genre = summary.genre ? genreById(summary.genre) : null;
  const pathName = (genre ? genre.name + ' ' : '') + (summary.path ? PATHS[summary.path].name : 'the void');
  return buildDefaultShareText(summary, lp, {
    loadoutName: inst ? inst.name : null,
    pathName,
    failLabels: DEFAULT_FAIL_LABELS,
    url: 'https://sandstreampop.github.io/big-break/',
  });
}

export async function musicShareImage(summary: any, lp: number, endingTitle: string): Promise<File | null> {
  const inst = instrumentById(summary.loadout);
  const genre = summary.genre ? genreById(summary.genre) : null;
  const res = summary.result ? summary.result.toUpperCase()
    : DEFAULT_FAIL_LABELS[summary.endingKey] || 'GAME OVER';
  const blob = await renderShareImage({
    headline: `${endingTitle}`,
    subline: `${inst ? inst.name : '?'} → ${genre ? genre.name + ' ' : ''}${summary.path ? PATHS[summary.path].name : 'the void'} → ${res}`,
    tierLog: summary.tierLog,
    songLine: (() => {
      const best = (summary.songs || []).filter((x: any) => x.peak)
        .sort((a: any, b: any) => (b.crowned - a.crowned) || (a.peak - b.peak))[0];
      return best ? `${best.crowned ? '👑 ' : '♪ '}“${best.title}” — peaked #${best.peak}` : null;
    })(),
    statLine: `★${summary.fame} fame · ${summary.hits} hits · +${lp} LP${summary.chartPeak ? ` · Hot 10 #${summary.chartPeak}` : ''}`,
    footer: 'play: sandstreampop.github.io/big-break',
  });
  return blob ? new File([blob as BlobPart], 'big-break-run.png', { type: 'image/png' }) : null;
}
