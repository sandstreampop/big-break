// Ambient browser globals the game touches that aren't in the default lib:
// the PostHog async loader attaches window.posthog; older Safari exposes
// webkitAudioContext. Declared here so the presentation layer type-checks
// without per-site casts.
export {};

declare global {
  interface Window {
    posthog?: any;
    webkitAudioContext?: typeof AudioContext;
  }
}
