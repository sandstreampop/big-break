// BIG BREAK — telemetry. Product analytics for playtest-driven balance:
// swipe-direction skew per card, run-length + death-cause distributions,
// win rate per path, tutorial funnel, drop-off. No PII: every event is
// game state (card ids, tiers, paths, stat totals) — never player input.
//
// Two sinks, always both:
//   1. a local ring buffer in localStorage — authoritative, offline-proof,
//      exportable as a diagnostics blob (the "poor-man's session replay").
//   2. PostHog, loaded async — retention/funnels/dashboards. If the CDN is
//      unreachable (offline PWA) events still land in the ring buffer.
//
// The engine stays DOM-free and never imports this; all hooks live in the
// UI layer. Respects a settings opt-out.

const PH_KEY = 'phc_C8Ch39GjAbPHvP6GE7boSFEuzqCDeMMc5oy4UJLnao6q';
const PH_HOST = 'https://eu.i.posthog.com';
const RING_KEY = 'bigbreak_events_v1';
const RING_MAX = 600;
const APP_VERSION = '2.2';

let enabled = true;
let loaded = false;
// Which game this session is playing — rides on every event so the two games'
// telemetry can be told apart in one stream (Phase H).
let activePackId = 'music';

// ---- local ring buffer (never depends on network) ----
function pushRing(rec) {
  try {
    const raw = localStorage.getItem(RING_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(rec);
    while (arr.length > RING_MAX) arr.shift();
    localStorage.setItem(RING_KEY, JSON.stringify(arr));
  } catch (e) { /* private mode / quota — telemetry is best-effort */ }
}

export function exportEvents() {
  return localStorage.getItem(RING_KEY) || '[]';
}

// ---- non-PII identity, so the telemetry pull can COUNT unique players ----
// install_id is a random UUID that pins one browser install (not PII, not
// tied to any person). env/is_owner let the pull strip your own testing:
// env is derived from the hostname, is_owner is a self-set flag (?dev=1)
// that persists in localStorage. All three ride along as PostHog super-
// properties on every event. Caveat by design: a human on two browsers or
// in incognito still mints two install_ids — cookieless analytics can only
// bound the true head-count, never pin it exactly.
const OWNER_KEY = 'bigbreak_owner';
const INSTALL_KEY = 'bigbreak_install_id';

function installId() {
  try {
    let id = localStorage.getItem(INSTALL_KEY);
    if (!id) {
      id = (globalThis.crypto?.randomUUID?.())
        || 'ins-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
      localStorage.setItem(INSTALL_KEY, id);
    }
    return id;
  } catch (e) { return null; } // private mode: fall back to PostHog's own id
}

function identity() {
  const host = (typeof location !== 'undefined' && location.hostname) || '';
  const env = (host === '' || host === 'localhost' || /^127\.|^0\.0\.0\.0$/.test(host))
    ? 'dev' : 'prod';
  let is_owner = false;
  try {
    if (new URLSearchParams(location.search).get('dev') === '1')
      localStorage.setItem(OWNER_KEY, '1');
    is_owner = localStorage.getItem(OWNER_KEY) === '1';
  } catch (e) { /* private mode */ }
  return { install_id: installId(), env, is_owner };
}

// ---- PostHog async loader (official snippet, gated on opt-in) ----
function loadPostHog() {
  if (loaded || !enabled || typeof window === 'undefined') return;
  loaded = true;
  // @ts-ignore — official PostHog loader snippet (vendored, minified)
  !function (t, e) { var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);
  try {
    window.posthog.init(PH_KEY, {
      api_host: PH_HOST,
      person_profiles: 'identified_only',
      autocapture: false,          // we send explicit game events, not DOM clicks
      capture_pageview: true,      // pageviews power retention out of the box
      capture_pageleave: true,     // drop-off
      disable_session_recording: true, // replay is a later opt-in (one flag)
      persistence: 'localStorage',     // no cookie banner surface
    });
    // Attach install_id/env/is_owner to every future capture so the pull
    // can dedupe installs and subtract owner/dev traffic from head-counts.
    window.posthog.register(identity());
  } catch (e) { /* offline / blocked — ring buffer still captures */ }
}

// ---- public API ----
export function initAnalytics(settings, packId = 'music') {
  enabled = settings?.analytics !== false;
  activePackId = packId;
  if (enabled) loadPostHog();
}

export function setAnalyticsEnabled(on) {
  enabled = on;
  try {
    if (!on) window.posthog?.opt_out_capturing?.();
    else { loadPostHog(); window.posthog?.opt_in_capturing?.(); }
  } catch (e) {}
}

export function analyticsEnabled() { return enabled; }

export function track(event, props = {}) {
  const tagged = { ...props, pack: activePackId };
  const rec = { event, props: tagged, ts: Date.now() };
  pushRing(rec);
  if (!enabled) return;
  try { window.posthog?.capture?.(event, { ...tagged, app_version: APP_VERSION }); } catch (e) {}
}
