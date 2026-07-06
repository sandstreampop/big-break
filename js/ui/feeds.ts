// BIG BREAK — the second screen (ADR-0014): the nation's feeds.
//
// A pack-supplied FeedBundle (presenter.feeds) is surfaced as a one-line
// teaser + a button at pivotal moments; tapping opens a phone-shaped browser
// layer ABOVE the current overlay (progressive disclosure — the scene took
// space first). The layer lives outside #overlay so its own taps never trip
// the overlay's tap-to-continue; the teaser button stops propagation so
// opening the feeds doesn't also advance the game. Pure presentation: the
// result/interstitial/ending screens hand it a bundle; it never routes.

import { el, vibrate } from './dom.js';
import { fillText } from './context.js';
import { sfx } from '../audio.js';

const FEED_MOOD_DOT = { up: '🟢', split: '🟡', down: '🔴', feral: '🟣', soft: '🩷' };
const FEED_MOOD_LINE = {
  up: 'the room is warm on you right now',
  split: 'the room is split — read both hands',
  down: 'the room has turned',
  feral: 'the room is feral',
  soft: 'the room is soft on you',
};

export function feedTeaser(bundle, inOverlay) {
  const wrap = el('div', 'feed-teaser');
  // A tap-through guard on the whole banner: tapping anywhere on it opens the
  // feeds rather than continuing (the result overlay dismisses on tap).
  if (inOverlay) wrap.addEventListener('click', (e) => e.stopPropagation());
  wrap.append(el('div', 'feed-teaser-kicker', '📲 The second screen'));
  wrap.append(el('div', 'feed-teaser-line', fillText(bundle.teaser)));
  const chips = el('div', 'feed-teaser-chips');
  for (const ch of bundle.channels) {
    chips.append(el('span', 'feed-chip ' + ch.skin, `${ch.icon}<span class="feed-chip-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`));
  }
  wrap.append(chips);
  const b = el('button', 'btn feed-open-btn', `Read the feeds  →`);
  b.addEventListener('click', (e) => { if (inOverlay) e.stopPropagation(); sfx.ui(); openFeedBrowser(bundle); });
  wrap.append(b);
  return wrap;
}

function feedPostEl(p) {
  const post = el('div', 'feed-post' + (p.pinned ? ' feed-pinned' : ''));
  const head = el('div', 'feed-post-head');
  if (p.avatar) head.append(el('span', 'feed-avatar', p.avatar));
  const idw = el('span', 'feed-idw');
  idw.append(el('span', 'feed-author', fillText(p.author)));
  if (p.pinned) idw.append(el('span', 'feed-pin-tag', '📌 pinned'));
  head.append(idw);
  post.append(head);
  post.append(el('div', 'feed-post-body', fillText(p.body)));
  if (p.meta) post.append(el('div', 'feed-post-meta', fillText(p.meta)));
  if (p.replies?.length) {
    const rs = el('div', 'feed-replies');
    for (const r of p.replies) {
      const rr = el('div', 'feed-reply');
      rr.append(el('span', 'feed-reply-author', `${r.avatar ? r.avatar + ' ' : ''}${fillText(r.author)}`));
      rr.append(el('span', 'feed-reply-body', fillText(r.body)));
      rs.append(rr);
    }
    post.append(rs);
  }
  return post;
}

export function openFeedBrowser(bundle) {
  document.getElementById('feed-layer')?.remove();
  const layer = el('div', 'feed-layer');
  layer.id = 'feed-layer';
  vibrate(10);
  const phone = el('div', 'feed-phone');

  const bar = el('div', 'feed-bar');
  bar.append(el('div', 'feed-bar-title', bundle.headline || 'The nation'));
  const close = el('button', 'feed-close', '✕');
  close.addEventListener('click', (e) => { e.stopPropagation(); layer.remove(); });
  bar.append(close);
  phone.append(bar);

  const tabs = el('div', 'feed-tabs');
  const body = el('div', 'feed-body');
  phone.append(tabs, body);

  const select = (i) => {
    const ch = bundle.channels[i];
    [...tabs.children].forEach((t, j) => {
      t.classList.toggle('active', j === i);
      if (j === i) (t as HTMLElement).scrollIntoView?.({ inline: 'center', block: 'nearest' });
    });
    body.innerHTML = '';
    body.className = 'feed-body ' + ch.skin + ' mood-' + (ch.mood || 'split');
    body.scrollTop = 0;
    if (ch.header) body.append(el('div', 'feed-header', fillText(ch.header)));
    body.append(el('div', 'feed-moodline mood-' + (ch.mood || 'split'),
      `${FEED_MOOD_DOT[ch.mood] || '⚪'} ${FEED_MOOD_LINE[ch.mood] || 'the room has opinions'}`));
    for (const p of ch.posts) body.append(feedPostEl(p));
    if (ch.more?.length) {
      const det = el('details', 'feed-more');
      det.append(el('summary', 'feed-more-head', 'show more replies'));
      for (const p of ch.more) det.append(feedPostEl(p));
      body.append(det);
    }
    body.append(el('div', 'feed-foot', 'you can’t un-see the comments · tap ✕ to go back'));
  };

  bundle.channels.forEach((ch, i) => {
    const tab = el('button', 'feed-tab ' + ch.skin, `<span class="feed-tab-ico">${ch.icon}</span><span class="feed-tab-name">${ch.name}</span><span class="feed-tab-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`);
    tab.addEventListener('click', (e) => { e.stopPropagation(); sfx.ui(); select(i); });
    tabs.append(tab);
  });

  layer.append(phone);
  layer.addEventListener('click', (e) => { if (e.target === layer) layer.remove(); });
  document.body.append(layer);
  select(0);
}
