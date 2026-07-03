// Expressive Code config, in its own file so the `<Code>` component (used for
// transcluded snippets) can render — Starlight requires EC options that aren't
// JSON-serializable (the Twoslash plugin is a function) to live here rather
// than inline in astro.config.mjs. Starlight auto-detects this file.
import ecTwoSlash from 'expressive-code-twoslash';

export default {
  // Twoslash type-checks inline TS samples at build time and adds
  // hover-for-type in the rendered docs. A sample that stops compiling fails
  // the build — a hard drift gate on top of transcluded real code.
  plugins: [ecTwoSlash()],
  themes: ['github-dark', 'github-light'],
};
