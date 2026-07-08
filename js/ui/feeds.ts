// BIG BREAK — the second screen (ADR-0014): the nation's feeds.
//
// A pack-supplied FeedBundle (presenter.feeds) is surfaced as a one-line
// teaser + a button at pivotal moments; tapping opens a phone-shaped browser
// layer ABOVE the current overlay (progressive disclosure — the scene took
// space first). The layer lives outside #overlay so its own taps never trip
// the overlay's tap-to-continue; the teaser button stops propagation so
// opening the feeds doesn't also advance the game. Pure presentation: the
// result/interstitial/ending screens hand it a bundle; it never routes.
//
// The unread contract (2026-07): the "Read the feeds" CTA is a NOTIFICATION,
// not wallpaper. It appears ONLY when the nation has posted something you
// haven't seen, and it carries a badge with the count. Once you read, it
// collapses to a quiet "caught up" chip — there's no button to re-press for
// stale posts, so pressing it always pays out genuinely new content (that's
// the whole novelty). The next pivotal beat re-arms it. Inside the browser,
// the new posts are highlighted above the ones you've already read.
//
// This lives entirely in the genre-neutral shell: the inbox is session state
// (a live UI signal), never RunState/engine/save — so sims, which never
// render, never touch it and the goldens never move.

import { el, vibrate } from './dom.js';
import { fillText, run } from './context.js';
import { sfx } from '../audio.js';

const FEED_MOOD_DOT = { up: '🟢', split: '🟡', down: '🔴', feral: '🟣', soft: '🩷' };
const FEED_MOOD_LINE = {
  up: 'the room is warm on you right now',
  split: 'the room is split — read both hands',
  down: 'the room has turned',
  feral: 'the room is feral',
  soft: 'the room is soft on you',
};

// ---------- The nation's inbox (session-scoped) ----------
//
// Posts arrive as the run plays. We keep them per channel, split into `unread`
// (new since your last open — highlighted) and `seen` (already read — dimmed
// context, newest first, capped so the browser stays readable). This is the
// single source of truth for BOTH the badge count and the CTA gate.

interface InboxChannel {
  id: string; name: string; icon: string; skin: string;
  mood?: string; handle?: string; header?: string;
  unread: any[]; // FeedPost[] new since last open
  seen: any[];   // FeedPost[] already read (newest first, capped)
}
const SEEN_CAP = 8; // per channel — enough for real "earlier" context, not a wall

const inbox = {
  run: null as any,             // identity guard — a new run object resets the inbox
  headline: 'The nation',
  channels: new Map<string, InboxChannel>(),
  order: [] as string[],        // channel display order (first-seen wins)
  accounted: new Set<string>(), // moment keys already ingested (dedupe re-renders)
};

function resetInbox() {
  inbox.channels.clear();
  inbox.order = [];
  inbox.accounted.clear();
  inbox.headline = 'The nation';
}
// Re-point the inbox at the current run. setRun() swaps the object on a new
// run / reload, so pointer identity is a reliable "this is a different run".
function ensureRun() {
  if (inbox.run !== run) { inbox.run = run; resetInbox(); }
}
function unreadCount(): number {
  let n = 0;
  for (const c of inbox.channels.values()) n += c.unread.length;
  return n;
}

// Fold one moment's bundle into the inbox. Idempotent per moment `key`, so a
// re-render of the same overlay can't double-count. Returns the live unread
// total after ingesting.
function ingest(bundle: any, key: string): number {
  ensureRun();
  if (bundle?.headline) inbox.headline = bundle.headline;
  if (!inbox.accounted.has(key)) {
    inbox.accounted.add(key);
    for (const ch of bundle.channels || []) {
      let entry = inbox.channels.get(ch.id);
      if (!entry) {
        entry = { id: ch.id, name: ch.name, icon: ch.icon, skin: ch.skin, unread: [], seen: [] };
        inbox.channels.set(ch.id, entry);
        inbox.order.push(ch.id);
      }
      // Latest standing colour + chrome — the feed is an honest instrument, so
      // it reflects where the wing sits NOW, not where it sat when you last read.
      entry.mood = ch.mood; entry.handle = ch.handle; entry.header = ch.header;
      entry.name = ch.name; entry.icon = ch.icon; entry.skin = ch.skin;
      // The above-fold `posts` are the arrivals we count as "new"; the `more`
      // fold rides along after them so nothing's lost, but the timeline itself
      // is now the "show more", so we don't count the fold in the badge.
      entry.unread.push(...(ch.posts || []), ...(ch.more || []));
    }
  }
  return unreadCount();
}

// ---------- The teaser (Tier 0) ----------

// `opts.key` identifies the pivotal moment (for idempotent ingest). `opts.always`
// keeps the CTA live even after reading — used on the terminal ending screen,
// where re-opening "your phone, returned" is the payoff, not spam.
export function feedTeaser(bundle: any, inOverlay: boolean, opts: { key?: string; always?: boolean } = {}) {
  const key = opts.key || `feed:${inbox.accounted.size}`;
  ingest(bundle, key);

  const wrap = el('div', 'feed-teaser');
  // A tap-through guard on the whole banner: tapping anywhere on it opens the
  // feeds rather than continuing (the result overlay dismisses on tap).
  if (inOverlay) wrap.addEventListener('click', (e) => e.stopPropagation());

  // Render (or re-render) the teaser body for the current unread state. Called
  // again after a read so the CTA collapses to "caught up" in place.
  const paint = () => {
    wrap.innerHTML = '';
    const unread = unreadCount();
    const active = unread > 0 || opts.always;

    if (!active) {
      // Read everything the nation's said so far — no CTA, just quiet closure.
      wrap.classList.add('feed-teaser-quiet');
      wrap.append(el('div', 'feed-caughtup', '📲 You’re all caught up on the feeds'));
      return;
    }
    wrap.classList.remove('feed-teaser-quiet');

    wrap.append(el('div', 'feed-teaser-kicker', '📲 The second screen'));
    wrap.append(el('div', 'feed-teaser-line', fillText(bundle.teaser)));

    const chips = el('div', 'feed-teaser-chips');
    for (const ch of bundle.channels) {
      chips.append(el('span', 'feed-chip ' + ch.skin, `${ch.icon}<span class="feed-chip-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`));
    }
    wrap.append(chips);

    const label = unread > 0
      ? `Read the feeds<span class="feed-badge">${unread > 99 ? '99+' : unread}<span class="feed-badge-lbl">new</span></span>`
      : `Read the feeds  →`;
    const b = el('button', 'btn feed-open-btn' + (unread > 0 ? ' feed-open-btn-new' : ''), label);
    b.setAttribute('aria-label', unread > 0 ? `Read the feeds — ${unread} new posts` : 'Read the feeds');
    b.addEventListener('click', (e) => {
      if (inOverlay) e.stopPropagation();
      sfx.ui();
      openFeedBrowser();
      // Reading clears the unread mark; repaint so the CTA becomes "caught up"
      // (or, on the ending, stays live). This is the anti-spam beat: no button
      // left over to re-press for content you've already seen.
      paint();
    });
    wrap.append(b);
  };
  paint();
  return wrap;
}

function feedPostEl(p, isNew: boolean) {
  const post = el('div', 'feed-post' + (p.pinned ? ' feed-pinned' : '') + (isNew ? ' feed-post-new' : ' feed-post-seen'));
  const head = el('div', 'feed-post-head');
  if (p.avatar) head.append(el('span', 'feed-avatar', p.avatar));
  const idw = el('span', 'feed-idw');
  idw.append(el('span', 'feed-author', fillText(p.author)));
  if (p.pinned) idw.append(el('span', 'feed-pin-tag', '📌 pinned'));
  if (isNew) idw.append(el('span', 'feed-new-tag', 'NEW'));
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

export function openFeedBrowser() {
  ensureRun();
  document.getElementById('feed-layer')?.remove();

  // Snapshot what's new for THIS viewing, THEN mark read — so this open shows
  // the arrivals highlighted, and everything downstream (the badge, the teaser)
  // immediately reads zero unread. Newest arrivals sit above the "earlier" ones.
  const view = inbox.order.map((id) => {
    const c = inbox.channels.get(id)!;
    return { ...c, newPosts: c.unread.slice(), seenPosts: c.seen.slice() };
  });
  for (const c of inbox.channels.values()) {
    c.seen = [...c.unread, ...c.seen].slice(0, SEEN_CAP);
    c.unread = [];
  }

  const layer = el('div', 'feed-layer');
  layer.id = 'feed-layer';
  vibrate(10);
  const phone = el('div', 'feed-phone');

  const bar = el('div', 'feed-bar');
  bar.append(el('div', 'feed-bar-title', inbox.headline || 'The nation'));
  const close = el('button', 'feed-close', '✕');
  close.addEventListener('click', (e) => { e.stopPropagation(); layer.remove(); });
  bar.append(close);
  phone.append(bar);

  const tabs = el('div', 'feed-tabs');
  const body = el('div', 'feed-body');
  phone.append(tabs, body);

  const select = (i) => {
    const ch = view[i];
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
    // New arrivals first, flagged and highlighted.
    if (ch.newPosts.length) {
      body.append(el('div', 'feed-newmark', `✨ ${ch.newPosts.length} new since you last looked`));
      for (const p of ch.newPosts) body.append(feedPostEl(p, true));
    }
    // Then the "earlier" context — what you've already read, dimmed.
    if (ch.seenPosts.length) {
      if (ch.newPosts.length) body.append(el('div', 'feed-divider', '· · · earlier · · ·'));
      for (const p of ch.seenPosts) body.append(feedPostEl(p, false));
    }
    body.append(el('div', 'feed-foot', 'you can’t un-see the comments · tap ✕ to go back'));
  };

  view.forEach((ch, i) => {
    const dot = ch.newPosts.length
      ? `<span class="feed-tab-new">${ch.newPosts.length > 9 ? '9+' : ch.newPosts.length}</span>`
      : `<span class="feed-tab-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`;
    const tab = el('button', 'feed-tab ' + ch.skin + (ch.newPosts.length ? ' has-new' : ''),
      `<span class="feed-tab-ico">${ch.icon}</span><span class="feed-tab-name">${ch.name}</span>${dot}`);
    tab.addEventListener('click', (e) => { e.stopPropagation(); sfx.ui(); select(i); });
    tabs.append(tab);
  });

  layer.append(phone);
  layer.addEventListener('click', (e) => { if (e.target === layer) layer.remove(); });
  document.body.append(layer);
  // Open to the first channel with new posts (the reason you're here), else the
  // first channel.
  const firstNew = view.findIndex((c) => c.newPosts.length);
  select(firstNew >= 0 ? firstNew : 0);
}
