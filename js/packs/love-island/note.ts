// Shared LI helper: push a result-notice onto the generic deltas.notices
// channel (the cascade the result beat renders). This four-liner was copy-
// pasted verbatim into five villa plugins; it lives here now, imported by all.
export const note = (pctx: any, cls: string, html: string) => {
  const d = pctx?.deltas;
  if (d) (d.notices = d.notices || []).push({ cls, html });
};
