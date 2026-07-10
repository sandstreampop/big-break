// Pixel-identity net for the style.css tokenization (odyssey pre-slice).
// Parses a stylesheet, resolves var(--x[, fb]) against :root custom props,
// and emits an ordered list of (mediaStack | selector | prop | resolvedValue).
// Usage:
//   node css-identity.mjs snapshot <file.css> > baseline.json
//   node css-identity.mjs diff <baseline.json> <file.css>
// Exit 1 on any difference (custom-property declarations excluded — adding
// tokens is the point; everything they RESOLVE to must be unchanged).
import { readFileSync } from 'node:fs';

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Split on a char at paren/quote depth zero.
function splitTop(s, ch) {
  const out = [];
  let depth = 0, cur = '', q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ch && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// Parse into flat rules: { media: string, selector: string, decls: [[prop, value]] }
function parse(css) {
  css = stripComments(css);
  const rules = [];
  const stack = []; // at-rule preludes
  let i = 0;
  const n = css.length;
  let buf = '';
  while (i < n) {
    const c = css[i];
    if (c === '{') {
      const prelude = buf.trim();
      buf = '';
      if (prelude.startsWith('@')) {
        stack.push(prelude);
        i++;
        continue;
      }
      // find matching close brace at depth 0 (rule bodies never nest in this file)
      let j = i + 1, body = '';
      for (; j < n; j++) {
        if (css[j] === '}') break;
        body += css[j];
      }
      const decls = splitTop(body, ';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => {
          const k = d.indexOf(':');
          return [d.slice(0, k).trim(), d.slice(k + 1).trim()];
        });
      for (const sel of splitTop(prelude, ',').map((s) => s.trim().replace(/\s+/g, ' '))) {
        rules.push({ media: stack.join(' | '), selector: sel, decls });
      }
      i = j + 1;
      continue;
    }
    if (c === '}') { stack.pop(); i++; continue; }
    buf += c;
    i++;
  }
  return rules;
}

function rootVars(rules) {
  const map = new Map();
  for (const r of rules) {
    if (r.selector !== ':root' || r.media) continue;
    for (const [p, v] of r.decls) if (p.startsWith('--')) map.set(p, v);
  }
  return map;
}

function resolve(value, vars, depth = 0) {
  if (depth > 10) return value;
  const idx = value.indexOf('var(');
  if (idx === -1) return value;
  // find matching close paren
  let d = 0, j = idx + 4;
  for (; j < value.length; j++) {
    if (value[j] === '(') d++;
    else if (value[j] === ')') { if (d === 0) break; d--; }
  }
  const inner = value.slice(idx + 4, j);
  const parts = splitTop(inner, ',');
  const name = parts[0].trim();
  const fb = parts.slice(1).join(',').trim();
  const rep = vars.has(name) ? vars.get(name) : fb;
  return resolve(value.slice(0, idx) + rep + value.slice(j + 1), vars, depth + 1);
}

function norm(v) {
  return v
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/#([0-9a-fA-F]{3,8})\b/g, (m, h) => '#' + h.toLowerCase())
    .replace(/\b0?\.(\d)/g, '.$1')
    .trim();
}

function snapshot(file) {
  const rules = parse(readFileSync(file, 'utf8'));
  const vars = rootVars(rules);
  const out = [];
  for (const r of rules) {
    for (const [p, v] of r.decls) {
      if (p.startsWith('--')) continue; // token defs excluded; their RESOLUTION is compared
      out.push([r.media, r.selector, p, norm(resolve(v, vars))]);
    }
  }
  return out;
}

const [, , cmd, a, b] = process.argv;
if (cmd === 'snapshot') {
  console.log(JSON.stringify(snapshot(a), null, 0));
} else if (cmd === 'diff') {
  const base = JSON.parse(readFileSync(a, 'utf8'));
  const cur = snapshot(b);
  const key = (e) => e.join(' ␟ ');
  let bad = 0;
  if (base.length !== cur.length) {
    console.log(`declaration count changed: ${base.length} -> ${cur.length}`);
  }
  // Ordered compare — tokenization edits values in place, order must hold.
  for (let i = 0, j = 0; i < base.length && j < cur.length;) {
    if (key(base[i]) === key(cur[j])) { i++; j++; continue; }
    // same slot, different resolved value?
    if (base[i][0] === cur[j][0] && base[i][1] === cur[j][1] && base[i][2] === cur[j][2]) {
      console.log(`CHANGED ${base[i][1]} { ${base[i][2]} }\n  was: ${base[i][3]}\n  now: ${cur[j][3]}`);
      bad++; i++; j++; continue;
    }
    console.log(`MISALIGNED at base[${i}] ${key(base[i])}\n        vs cur[${j}] ${key(cur[j])}`);
    bad++;
    // try to resync: advance the shorter side
    if (base.length - i > cur.length - j) i++; else j++;
    if (bad > 40) { console.log('…too many differences, stopping'); break; }
  }
  if (bad === 0 && base.length === cur.length) {
    console.log(`IDENTICAL — ${cur.length} resolved declarations match`);
  } else {
    process.exit(1);
  }
}
