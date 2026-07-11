// Render the bard-chatter voice sample in the REAL odyssey skin (pixel font,
// ember theme, the .overlay-note double-rule box that odyssey.css already
// designates as "the bard's voice") and screenshot it — so the human judges
// the lines as a player would meet them, without a deploy. Throwaway review
// tool; not a gate.
//
//   npm run build && node tools/render-bard-sample.mjs

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const chromium = (() => {
  for (const c of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(c).chromium; } catch { /* keep looking */ }
  }
  return null;
})();
if (!chromium) { console.error('Playwright not found.'); process.exit(1); }

const root = fileURLToPath(new URL('../dist', import.meta.url));
const OUT = fileURLToPath(new URL('../docs/games/odyssey/bard-chatter-shots', import.meta.url));
mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const abs = normalize(join(root, p));
    if (!abs.startsWith(root)) { res.writeHead(403).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(abs)] || 'application/octet-stream' });
    res.end(await readFile(abs));
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// The twelve, tagged by the surface they'd fire on: 'note' = between-card
// overlay-note (the bard's-voice box); 'act' = act-break / cold-open frame
// (the act-intro card: badge + prose).
const LINES = [
  { n: 1, tag: 'woodpile · cold open', surface: 'act', badge: 'THE FIRE', name: 'A telling begins',
    text: 'Twelve ships, I said. The woman by the woodpile wants it on the record that her grandfather sailed with a man who counted eleven. Her grandfather, friends, also counted his own fingers twice and made nine. Twelve ships. Drink.' },
  { n: 2, tag: 'the fee · mid-run', surface: 'note',
    text: 'The wine has reached me, and it has reached me EMPTY. I saw the hands it passed. I will remember those hands in the part where the men drown — they will drown a little slower, and enjoy it less.' },
  { n: 3, tag: 'the horse · running gag', surface: 'note',
    text: 'Someone at the back still wants the horse. Friend, the horse was three years and one poem ago, and we are at SEA. You have wandered into the wrong fire and paid the wrong bard — and I have taken your coin, and I am keeping it.' },
  { n: 4, tag: 'Phemios · rivalry', surface: 'note',
    text: 'Phemios of Smyrna sang this last market-day with a drum. A DRUM, friends, as if the sea keeps time. He gave the Cyclops a limp, for pathos. The Cyclops does not want a limp. The Cyclops wants an eye, and before the night is out he will be short the one he has.' },
  { n: 5, tag: 'retelling wink · after a re-roll', surface: 'note',
    text: 'A man from Kyme called me a liar once, because last winter I sang the storm before the meadow. Friend: every telling is true. That is what a sea story is — the one truth, reshuffled, until an ordering of it finally gets him home.' },
  { n: 6, tag: 'potter’s boy · after the name-brag', surface: 'note',
    text: 'The potter’s boy, who has said nothing for an hour, wants to know why the clever man did not simply keep his mouth shut. It is the best question anyone has asked at this fire, boy. Hold on to it. Ask it again when you have heard the price.' },
  { n: 7, tag: 'vanity · before Circe', surface: 'note',
    text: 'I will do the witch’s voice now. I have practised the witch’s voice. My wife has asked me, more than once, to stop practising the witch’s voice. Attend, friends — this next part is craft.' },
  { n: 8, tag: 'woodpile · mid-run correction', surface: 'note',
    text: 'Nine days becalmed, I said. The woodpile says seven. Fine — seven days becalmed, and on the seventh a bard quietly shaved off two to be home for his supper. The song is written, friends, by whoever still has a voice left at midnight.' },
  { n: 9, tag: 'requests · teasing the sirens', surface: 'note',
    text: 'You want the singers. Everyone wants the singers. We will get to the singers — the singers are the far side of a very long sea, and they are the whole reason you keep this cup of mine filled between here and there.' },
  { n: 10, tag: 'bodily comedy · before the Underworld', surface: 'note',
    text: 'There is a boy in this telling who dies falling off a roof. Not in the war, friends — off a ROOF, drunk, on the one quiet morning everyone was packing to leave. Homer put him there on purpose. I keep him there on purpose. Somebody has to be the reason you check the ladder.' },
  { n: 11, tag: 'the Nobody wink · after the escape', surface: 'note',
    text: 'He told the giant his name was Nobody. Sit with that. It is the stupidest joke in the poem, and it saves more men than his spear ever does — and there is a lesson in it, friends, that I have never once in my life managed to take.' },
  { n: 12, tag: 'the fee · banking the fire', surface: 'act', badge: 'THE FIRE BURNS LOW', name: 'Bank the telling',
    text: 'And there we bank the fire. Whether he reaches the bed of living oak, you find out tomorrow — and bring the good wine, not the vinegar Phemios’s crowd calls a vintage. The homecoming costs extra. The homecomings always do.' },
];

function buildDOM(lines) {
  // Real classes: .overlay-note (bard's voice box) inside a static
  // has-set-piece card-area; act frames as .result-card with badge + prose.
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const blocks = lines.map((l) => {
    const label = `<div class="bs-label">#${l.n} · ${esc(l.tag)}</div>`;
    if (l.surface === 'act') {
      return `${label}<div class="result-card" style="margin:0 auto 22px;max-width:372px">
        <div class="tier-badge">${esc(l.badge)}</div>
        <p class="result-text act-name">${esc(l.name)}</p>
        <p class="result-text">${esc(l.text)}</p></div>`;
    }
    return `${label}<div id="card-area" class="has-set-piece" style="position:static;margin:0 auto 22px;max-width:372px;min-height:0">
      <div class="overlay-note sp-ody">${esc(l.text)}</div></div>`;
  }).join('');
  return `<div style="padding:16px 8px 40px">
    <div class="bs-title">THE ODYSSEY — bard chatter, in-skin sample</div>${blocks}</div>`;
}

const STYLE = `
  body { overflow:auto !important; height:auto !important; }
  #app,.screen { display:none !important; }
  .bs-title { font-size:15px; letter-spacing:.12em; text-align:center; color:var(--accent,#e0a13a); margin:6px 0 20px; }
  .bs-label { font-size:11px; letter-spacing:.06em; opacity:.6; text-align:center; margin:0 0 6px; }`;

const browser = await chromium.launch();
for (const [w, label] of [[390, '390'], [320, '320']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${base}/odyssey/`);
  await page.waitForSelector('#screen-title', { timeout: 15000 }).catch(() => {});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(({ html, style }) => {
    const s = document.createElement('style'); s.textContent = style; document.head.appendChild(s);
    const host = document.createElement('div'); host.id = 'bard-sample'; host.innerHTML = html;
    document.body.appendChild(host);
  }, { html: buildDOM(LINES), style: STYLE });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, `bard-sample-${label}.png`), fullPage: true });
  // Also a tight crop of two representative single notes at 390 for a clean look.
  if (w === 390) {
    for (const n of [3, 4, 10]) {
      const el = await page.$(`#bard-sample .has-set-piece:nth-of-type(1)`);
      void el;
    }
  }
  await ctx.close();
  console.log(`wrote bard-sample-${label}.png`);
}
await browser.close();
server.close();
console.log(`\nshots in ${OUT}`);
