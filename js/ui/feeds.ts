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

import { el, vibrate, activatable } from './dom.js';
import { fillText, run, PRES } from './context.js';
import { sfx } from '../audio.js';
import { mulberry32 } from '../engine.js';

const FEED_MOOD_DOT = { up: '🟢', split: '🟡', down: '🔴', feral: '🟣', soft: '🩷' };
const FEED_MOOD_LINE = {
  up: 'the room is warm on you right now',
  split: 'the room is split — read both hands',
  down: 'the room has turned',
  feral: 'the room is feral',
  soft: 'the room is soft on you',
};

// The chrome copy around the pack's bundle (Presenter.feedChrome): the pack
// may re-voice the shell's labels so the surface speaks ITS world. Read at
// call time (PRES is a live binding set at boot), defaults preserved exactly
// so packs without the hook are byte-identical to before it existed.
const chrome = () => ({
  kicker: '📲 The second screen',
  caughtUp: '📲 You’re all caught up on the feeds',
  openLabel: 'Read the feeds',
  foot: 'you can’t un-see the comments · tap ✕ to go back',
  headline: 'The nation',
  ...(PRES?.feedChrome || {}),
});
const moodLine = (mood?: string) =>
  PRES?.feedChrome?.moodLines?.[mood as 'up'] || FEED_MOOD_LINE[mood as 'up'] || 'the room has opinions';

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
  inbox.headline = chrome().headline;
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

// ---------- How loud is the nation this beat? ----------
//
// The pack hands us a fat bundle (~50 posts across five channels) every time,
// so a "count everything" badge is always the same number — dull. Instead we
// draw a VOLUME from a pool: most beats are a handful, some are a pile-on. The
// draw is seeded off the run + the moment, so it's stable within a run (a
// re-render or a reload lands on the same number) but genuinely varies run to
// run AND beat to beat — sometimes the villa barely trends, sometimes it breaks
// the internet.
//
// The pool is weighted toward the low-mid end with a long tail to 25, so the
// 5–25 spread feels organic rather than uniform. (Skips accumulate on top, so
// the badge can still climb past 25 if you ignore it — that's real unread.)
const VOLUME_POOL = [5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 25];

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h >>> 0;
}
// A generator keyed to this run and this moment — variance across runs, stable
// within one. Falls back through flavorSeed → seed → 1 for legacy/sim states.
function volumeRng(key: string): () => number {
  const base = ((run?.flavorSeed ?? run?.seed ?? 1) >>> 0) || 1;
  const seed = (Math.imul(base, 2654435761) ^ hashStr(key)) >>> 0 || 1;
  return mulberry32(seed);
}
function shuffled<T>(rng: () => number, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Deal `n` posts across the bundle's channels, round-robin over a shuffled
// channel order so which platforms lead the beat varies, and each channel's
// own posts come out in authored order. Returns a per-channel-id list of the
// posts that actually surface this beat (≤ what the pack generated).
function dealArrivals(rng: () => number, bundle: any, n: number): Map<string, any[]> {
  const chans: { id: string; pool: any[]; out: any[] }[] = (bundle.channels || []).map((ch: any) => ({
    id: ch.id, pool: [...(ch.posts || []), ...(ch.more || [])], out: [] as any[],
  }));
  const order = shuffled(rng, chans);
  let budget = n, progressed = true;
  while (budget > 0 && progressed) {
    progressed = false;
    for (const c of order) {
      if (budget <= 0) break;
      if (c.out.length < c.pool.length) { c.out.push(c.pool[c.out.length]); budget--; progressed = true; }
    }
  }
  const map = new Map<string, any[]>();
  for (const c of chans) map.set(c.id, c.out);
  return map;
}

// Fold one moment's bundle into the inbox. Idempotent per moment `key`, so a
// re-render of the same overlay can't double-count. Returns the live unread
// total after ingesting.
function ingest(bundle: any, key: string): number {
  ensureRun();
  if (bundle?.headline) inbox.headline = bundle.headline;
  if (!inbox.accounted.has(key)) {
    inbox.accounted.add(key);
    // Draw this beat's volume from the pool, then deal exactly that many posts
    // across the channels — so the badge total varies (5–25) instead of always
    // being the full bundle.
    const rng = volumeRng(key);
    const volume = VOLUME_POOL[Math.floor(rng() * VOLUME_POOL.length)];
    const arrivals = dealArrivals(rng, bundle, volume);
    for (const ch of bundle.channels || []) {
      const fresh = arrivals.get(ch.id) || [];
      if (!fresh.length && !inbox.channels.has(ch.id)) continue; // a silent channel this beat with no history — skip
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
      entry.unread.push(...fresh);
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
      wrap.append(el('div', 'feed-caughtup', chrome().caughtUp));
      return;
    }
    wrap.classList.remove('feed-teaser-quiet');

    wrap.append(el('div', 'feed-teaser-kicker', chrome().kicker));
    wrap.append(el('div', 'feed-teaser-line', fillText(bundle.teaser)));

    const chips = el('div', 'feed-teaser-chips');
    for (const ch of bundle.channels) {
      chips.append(el('span', 'feed-chip ' + ch.skin, `${ch.icon}<span class="feed-chip-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`));
    }
    wrap.append(chips);

    const open = chrome().openLabel;
    const label = unread > 0
      ? `${open}<span class="feed-badge">${unread > 99 ? '99+' : unread}<span class="feed-badge-lbl">new</span></span>`
      : `${open}  →`;
    const b = el('button', 'btn feed-open-btn' + (unread > 0 ? ' feed-open-btn-new' : ''), label);
    b.setAttribute('aria-label', unread > 0 ? `${open} — ${unread} new posts` : open);
    b.addEventListener('click', (e) => {
      if (inOverlay) e.stopPropagation();
      sfx.ui();
      // The browser marks posts read as you tap them (or "mark all read");
      // `onChange` repaints the teaser live, so when you've cleared everything
      // the CTA collapses to "caught up" — no button left to re-press for
      // content you've already seen.
      openFeedBrowser({ onChange: paint });
    });
    wrap.append(b);
  };
  paint();
  return wrap;
}

// `isNew` posts render highlighted and TAPPABLE — tapping marks that one post
// read. `onRead` (given only for new posts) runs the mark-read on activation.
function feedPostEl(p, isNew: boolean, onRead?: (p: any, node: HTMLElement) => void) {
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
  if (isNew && onRead) {
    post.append(el('div', 'feed-tap-hint', 'tap to mark read'));
    activatable(post, (e) => { e.stopPropagation(); onRead(p, post); }, `Mark ${fillText(p.author)}’s post read`);
  }
  return post;
}

// `onChange` fires whenever the unread set changes (a tap, or "mark all read"),
// so the teaser behind the browser repaints live and its CTA collapses the
// moment you're caught up.
export function openFeedBrowser(opts: { onChange?: () => void } = {}) {
  ensureRun();
  document.getElementById('feed-layer')?.remove();

  const layer = el('div', 'feed-layer');
  layer.id = 'feed-layer';
  vibrate(10);
  const phone = el('div', 'feed-phone');

  const bar = el('div', 'feed-bar');
  bar.append(el('div', 'feed-bar-title', inbox.headline || chrome().headline));
  const barBtns = el('div', 'feed-bar-btns');
  const markAllBtn = el('button', 'feed-markall', '✓ Mark all read');
  const close = el('button', 'feed-close', '✕');
  close.addEventListener('click', (e) => { e.stopPropagation(); layer.remove(); });
  barBtns.append(markAllBtn, close);
  bar.append(barBtns);
  phone.append(bar);

  const tabs = el('div', 'feed-tabs');
  const body = el('div', 'feed-body');
  phone.append(tabs, body);

  // Render live from the inbox — NOT a snapshot — so a tap that moves a post
  // from unread→seen is reflected as soon as we re-render. Opening does NOT
  // mark everything read: you read by tapping (or "mark all read").
  const channels = () => inbox.order.map((id) => inbox.channels.get(id)!).filter((c) => c.unread.length || c.seen.length);
  let current = 0;

  const renderTabs = (list: InboxChannel[]) => {
    tabs.innerHTML = '';
    list.forEach((ch, i) => {
      const n = ch.unread.length;
      const dot = n
        ? `<span class="feed-tab-new">${n > 9 ? '9+' : n}</span>`
        : `<span class="feed-tab-dot">${FEED_MOOD_DOT[ch.mood] || '⚪'}</span>`;
      const tab = el('button', 'feed-tab ' + ch.skin + (i === current ? ' active' : '') + (n ? ' has-new' : ''),
        `<span class="feed-tab-ico">${ch.icon}</span><span class="feed-tab-name">${ch.name}</span>${dot}`);
      tab.addEventListener('click', (e) => { e.stopPropagation(); sfx.ui(); current = i; render(true); });
      tabs.append(tab);
      if (i === current) (tab as HTMLElement).scrollIntoView?.({ inline: 'center', block: 'nearest' });
    });
  };

  const renderBody = (ch: InboxChannel, keepScroll: boolean) => {
    const s = keepScroll ? body.scrollTop : 0;
    body.innerHTML = '';
    body.className = 'feed-body ' + ch.skin + ' mood-' + (ch.mood || 'split');
    if (ch.header) body.append(el('div', 'feed-header', fillText(ch.header)));
    body.append(el('div', 'feed-moodline mood-' + (ch.mood || 'split'),
      `${FEED_MOOD_DOT[ch.mood] || '⚪'} ${moodLine(ch.mood)}`));
    // New arrivals first — highlighted, and each tappable to mark read.
    if (ch.unread.length) {
      body.append(el('div', 'feed-newmark', `✨ ${ch.unread.length} new · tap one to mark it read`));
      for (const p of ch.unread.slice()) body.append(feedPostEl(p, true, (post, node) => readOne(ch, post, node)));
    }
    // Then the "earlier" context — what you've already read, dimmed.
    if (ch.seen.length) {
      if (ch.unread.length) body.append(el('div', 'feed-divider', '· · · earlier · · ·'));
      for (const p of ch.seen) body.append(feedPostEl(p, false));
    }
    body.append(el('div', 'feed-foot', chrome().foot));
    body.scrollTop = s;
  };

  const render = (keepScroll = false) => {
    const list = channels();
    if (!list.length) { layer.remove(); return; }
    if (current >= list.length) current = list.length - 1;
    renderTabs(list);
    renderBody(list[current], keepScroll);
    markAllBtn.style.display = unreadCount() > 0 ? '' : 'none';
  };

  // Mark ONE post read: move it unread→seen in the inbox, then re-render in
  // place (it drops from the NEW group into "earlier", dimmed) and repaint the
  // teaser behind us.
  const readOne = (ch: InboxChannel, post: any, node: HTMLElement) => {
    const i = ch.unread.indexOf(post);
    if (i < 0) return;
    ch.unread.splice(i, 1);
    ch.seen.unshift(post);
    ch.seen = ch.seen.slice(0, SEEN_CAP);
    sfx.ui(); vibrate(8);
    node.classList.remove('feed-post-new'); // instant feedback before the re-render
    render(true);
    opts.onChange?.();
  };

  markAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    for (const c of inbox.channels.values()) {
      if (c.unread.length) { c.seen = [...c.unread, ...c.seen].slice(0, SEEN_CAP); c.unread = []; }
    }
    sfx.ui(); vibrate(12);
    render(true);
    opts.onChange?.();
  });

  layer.append(phone);
  layer.addEventListener('click', (e) => { if (e.target === layer) layer.remove(); });
  document.body.append(layer);
  // Open to the first channel with new posts (the reason you're here), else the
  // first channel.
  const list = channels();
  const firstNew = list.findIndex((c) => c.unread.length);
  current = firstNew >= 0 ? firstNew : 0;
  render(false);
}
