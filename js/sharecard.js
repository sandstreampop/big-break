// Canvas share card: a poster-style PNG of the run for the group chat.

const TIER_COLOR = {
  bad: '#ff6b6b', good: '#5fd68a', incredible: '#c084fc', declined: '#ffb347',
};

export async function renderShareImage({ headline, subline, tierLog, statLine, footer, songLine }) {
  const W = 1080, H = 1080;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1b1726');
  bg.addColorStop(1, '#0e0c14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // logo
  const grad = ctx.createLinearGradient(80, 0, 720, 0);
  grad.addColorStop(0, '#ffb347');
  grad.addColorStop(0.6, '#ff5b7f');
  grad.addColorStop(1, '#c084fc');
  ctx.fillStyle = grad;
  ctx.font = '900 150px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('BIG', 80, 200);
  ctx.fillText('BREAK', 80, 340);

  // headline (result)
  ctx.fillStyle = '#f2eefb';
  ctx.font = '800 64px -apple-system, "Segoe UI", sans-serif';
  wrapText(ctx, headline, 80, 470, W - 160, 74);

  // subline (build)
  ctx.fillStyle = '#a89fc0';
  ctx.font = '500 40px -apple-system, "Segoe UI", sans-serif';
  wrapText(ctx, subline, 80, 610, W - 160, 52);

  // tier strip
  const tiles = (tierLog || []).slice(0, 32);
  const size = Math.min(56, Math.floor((W - 160) / Math.max(1, Math.min(tiles.length, 16))) - 8);
  tiles.forEach((t, i) => {
    const col = i % 16, row = Math.floor(i / 16);
    ctx.fillStyle = TIER_COLOR[t] || '#3b3352';
    roundRect(ctx, 80 + col * (size + 8), 700 + row * (size + 8), size, size, 10);
  });

  // the song the run will be remembered for
  if (songLine) {
    ctx.fillStyle = '#f0c33c';
    ctx.font = 'italic 600 38px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(songLine, 80, 868);
  }

  // stat line
  ctx.fillStyle = '#ffb347';
  ctx.font = '700 48px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(statLine, 80, 920);

  // footer
  ctx.fillStyle = '#7a7292';
  ctx.font = '500 34px -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(footer, 80, 990);

  return new Promise((resolve) => c.toBlob(resolve, 'image/png'));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.fill();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = String(text).split(' ');
  let line = '', yy = y;
  for (const w of words) {
    const probe = line ? line + ' ' + w : w;
    if (ctx.measureText(probe).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w; yy += lineH;
    } else line = probe;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}
