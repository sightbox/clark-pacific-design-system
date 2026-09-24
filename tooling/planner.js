// Converts an extracted DOM layout tree (extract.js) into a compact Figma build plan.
// Usage (module): plan(tree, { bp: 'Desktop'|'Mobile' }) -> { plan, warnings }
const PALETTE = {
  '0,74,159,1': 'Primary/Blue', '255,134,0,1': 'Accent/Orange', '0,150,99,1': 'Sustainability/Green',
  '82,86,90,1': 'Text/Dark Charcoal', '127,138,146,1': 'Neutral/Mid Gray', '240,240,240,1': 'Neutral/BG Alt',
  '222,223,224,1': 'Neutral/Border', '255,255,255,1': 'Neutral/White', '82,86,90,0.84': 'Overlay/Scrim',
  '255,255,255,0.25': 'Overlay/On-dark divider', '82,86,90,0.28': 'Text/Faded', '255,255,255,0.38': 'Text/Faded on dark',
  '0,0,0,0.12': 'Track/Light', '255,255,255,0.55': 'Outline/On-dark',
  '255,255,255,0.3': 'Flagged/On-dark muted', '255,255,255,0.32': 'Flagged/Accent line on photo', '0,0,0,0.18': 'Flagged/Dot inactive',
};
const X = require('./extras');
const WEIGHTS = { 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' };
// Mirrors the text styles created in Figma: [tier, dSize, mSize, weight, upper, lsPct]
const TIERS = [
  ['Display XL', 92, 52, 200, 1, -4], ['Display L', 84, 44, 200, 1, -4], ['Display M', 72, 40, 200, 1, -4],
  ['Heading LG', 49, 32, 300, 1, -4], ['Heading', 45, 30, 300, 1, -4], ['Heading MD', 35, 26, 400, 1, -4],
  ['Heading SM', 30, 22, 300, 1, -4], ['Heading XS', 25, 20, 600, 1, -1], ['Lead', 26, 20, 400, 0, -1],
  ['Card Title', 18, 16, 600, 1, -1], ['Body', 18, 16, 400, 0, 0], ['Body Light', 16, 14, 300, 0, 0],
  ['Body Small', 14, 14, 400, 0, 0], ['Eyebrow', 16, 14, 600, 1, 6], ['Eyebrow Small', 13, 13, 600, 1, 6],
  ['Button', 14, 14, 600, 1, 2], ['Label', 12, 12, 600, 1, 6], ['Label Tiny', 10, 10, 600, 1, 10],
  ['Caption', 13, 13, 400, 0, 0], ['Meta', 12, 12, 400, 0, 0], ['Fine Print', 11, 11, 400, 0, 0],
];

function parseColor(s) {
  const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(',').map(v => parseFloat(v)); if (p.length === 3) p.push(1);
  return p;
}
function colorRef(s, warn) {
  const p = parseColor(s); if (!p) return null;
  if (p[3] === 0) return null;
  const key = `${p[0]},${p[1]},${p[2]},${+p[3].toFixed(2)}`;
  if (PALETTE[key]) return PALETTE[key];
  warn.add('unmapped color ' + key);
  return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + '@' + +p[3].toFixed(2);
}
const near = (a, b, t = 1.5) => Math.abs(a - b) <= t;

function pickTextStyle(ts, bp) {
  if (ts.ff === 'Inter') return 'Utility/Placeholder Caption';
  const upper = ts.tt === 'uppercase' ? 1 : 0;
  const lsPct = ts.fs ? Math.round((ts.ls / ts.fs) * 100) : 0;
  let best = null, bestScore = -Infinity;
  for (const [tier, d, m, w, up, ls] of TIERS) {
    const size = bp === 'Mobile' ? m : d;
    let score = 0;
    if (size === ts.fs) score += 100; else score -= Math.abs(size - ts.fs) * 10;
    if (up === upper) score += 20;
    if (w === ts.fw) score += 10;
    if (ls === lsPct) score += 5;
    if (score > bestScore) { bestScore = score; best = tier; }
  }
  return `${bp}/${best}`;
}

function textNode(n, bp, warn, ctx) {
  const ts = n.ts || n.runs[0];
  let chars = '', runs = [];
  // base style = style of the run with the most characters
  const count = {};
  for (const r of n.runs) { const k = r.fw + '|' + r.c + '|' + r.fs + '|' + (r.fst || ''); count[k] = (count[k] || 0) + r.t.length; }
  const baseKey = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  const base = n.runs.find(r => r.fw + '|' + r.c + '|' + r.fs + '|' + (r.fst || '') === baseKey);
  for (const r of n.runs) {
    const s = chars.length; chars += r.t;
    const k = r.fw + '|' + r.c + '|' + r.fs + '|' + (r.fst || '');
    if (k !== baseKey) runs.push([s, chars.length, r.fw, colorRef(r.c, warn), r.fs, r.fst ? 1 : 0, r.ff]);
  }
  if (base.fw === 700) warn.add('font weight 700 used: ' + chars.slice(0, 30));
  const t = { t: 'T', c: chars, s: pickTextStyle(base, bp), ff: base.ff, fw: base.fw, fs: base.fs, col: colorRef(base.c, warn) };
  if (base.fst) t.it = 1;
  t.lh = base.lh ? +base.lh.toFixed(2) : null;
  if (!t.lh && n.r.h <= base.fs * 1.9) t.lh = +n.r.h.toFixed(2);
  t.ls = base.fs ? +((base.ls / base.fs) * 100).toFixed(1) : 0;
  t.tc = base.tt === 'uppercase' ? 'U' : base.tt === 'capitalize' ? 'C' : base.tt === 'lowercase' ? 'L' : undefined;
  if (base.td && base.td.includes('underline')) t.ud = 1;
  if (n.ta && ['center', 'right', 'end'].includes(n.ta)) t.ta = n.ta === 'center' ? 'C' : 'R';
  if (runs.length) t.runs = runs;
  t.w = +n.r.w.toFixed(1); t.h = +n.r.h.toFixed(1);
  const lineH = base.lh || base.fs * 1.5;
  t.multi = n.r.h > lineH * 1.5 ? 1 : 0;
  return t;
}

function isBuildAid(n) {
  // Kit section labels: inline-flex with a 6x6 square + small uppercase label, or empty spacers at root end
  if (n.type !== 'frame') return false;
  const f = n.kids && n.kids[0];
  if (f && f.type === 'frame' && f.d && f.d.includes('flex') && f.kids && f.kids.length === 2 && f.kids[0].r.w === 6 && f.kids[0].r.h === 6) return true;
  return false;
}

function frameNode(n, bp, warn, parent, depth) {
  const f = { t: 'F' };
  if (n.cls) f.n = n.cls.split(' ')[0];
  const bw = n.bw || [0, 0, 0, 0];
  const pad = n.pad || [0, 0, 0, 0];
  const fill = n.bg ? colorRef(n.bg, warn) : null;
  if (fill) f.f = fill;
  let extraAbs = [];
  if (n.bgi) {
    const g = X.parseGradient(n.bgi, n.r.w, n.r.h);
    if (!g) warn.add('unparsed background-image: ' + n.bgi.slice(0, 60));
    else if (g.repeating) warn.add('dropped repeating gradient texture');
    else {
      const line = X.accentLine(g, n.r.w, n.r.h);
      if (line) extraAbs.push({ t: 'L', n: 'Accent line', a: line.a, b: line.b, sw: line.width, col: colorRef(`rgba(${line.color.join(', ')})`, warn) });
      else f.gr = X.gradientPaint(g, n.r.w, n.r.h);
    }
  }
  if (n.sh) { const sh = X.parseShadow(n.sh); if (sh) f.fx = sh; }
  if (n.bw) {
    const c = n.bc[bw.findIndex(v => v)];
    f.st = { c: colorRef(c, warn), w: bw };
  }
  if (n.rad) f.rad = n.rad;
  if (n.op !== undefined) f.op = n.op;
  if (n.clip) f.clip = 1;
  if (n.tf) {
    const m = n.tf.match(/matrix\(([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)\)/);
    const rotated = m && (Math.abs(+m[2]) > 0.01 || Math.abs(+m[3]) > 0.01);
    if (m && !rotated) { /* translate/scale only: bounding rect already reflects it (caller makes it absolute) */ }
    else if (m && n.ow !== undefined) {
      const [a, b, c, d] = m.slice(1, 5).map(Number); const w = n.ow, h = n.oh;
      const cxw = n.r.x + n.r.w / 2, cyw = n.r.y + n.r.h / 2;
      const tx = cxw - (a * w / 2 + c * h / 2), ty = cyw - (b * w / 2 + d * h / 2);
      f.rt = [[+a.toFixed(5), +c.toFixed(5), +tx.toFixed(2)], [+b.toFixed(5), +d.toFixed(5), +ty.toFixed(2)]];
      f.rw = w; f.rh = h;
    } else warn.add('unhandled transform ' + n.tf);
  }

  const kidsAll = (n.kids || []).filter(k => !(depth === 0 && isBuildAid(k)));
  for (const k of kidsAll) { if (k.tf && !k.abs) { const mm = k.tf.match(/matrix\(([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)\)/); if (mm && Math.abs(+mm[2]) < 0.01 && Math.abs(+mm[3]) < 0.01 && !(+mm[1] === 1 && +mm[4] === 1 && +mm[5] === 0 && +mm[6] === 0)) k.abs = 1; } }
  const flow = kidsAll.filter(k => !k.abs);
  const abs = kidsAll.filter(k => k.abs);

  // Layout direction
  let dir;
  if (n.fd) dir = n.fd.startsWith('row') ? 'H' : 'V';
  else if (n.gtc) dir = 'H';
  else if (flow.length > 1 && flow.every(k => k.d && k.d.startsWith('inline')) && flow.every((k, i) => i === 0 || near(k.r.y, flow[0].r.y, 4))) dir = 'H';
  else dir = 'V';
  const grid = !!n.gtc && flow.length > 0;
  let wrap = n.wrap || grid;
  const overlapsV = (a, b) => a.r.y < b.r.y + b.r.h - 1 && b.r.y < a.r.y + a.r.h - 1;
  if (wrap && flow.every(k => overlapsV(k, flow[0]))) wrap = 0; // wrap container that didn't actually wrap
  f.l = dir;
  if (wrap) { f.wr = 1; }

  // Content box
  const cx = n.r.x + bw[3] + pad[3], cy = n.r.y + bw[0] + pad[0];
  const cw = n.r.w - bw[1] - bw[3] - pad[1] - pad[3], ch = n.r.h - bw[0] - bw[2] - pad[0] - pad[2];

  // Padding: CSS padding + border, but primary-axis start/end derived from child rects (absorbs margins)
  let P = [pad[0] + bw[0], pad[1] + bw[1], pad[2] + bw[2], pad[3] + bw[3]];
  const kidsOut = [];
  if (flow.length) {
    const minY = Math.min(...flow.map(k => k.r.y)), maxY = Math.max(...flow.map(k => k.r.y + k.r.h));
    const minX = Math.min(...flow.map(k => k.r.x)), maxX = Math.max(...flow.map(k => k.r.x + k.r.w));
    const jc = n.jc || 'normal';
    const between = /space-between/.test(jc);
    const centerMain = /center/.test(jc);
    const endMain = /flex-end|^end/.test(jc);
    if (dir === 'V' && !between && !centerMain && !endMain) { P[0] = Math.max(0, minY - n.r.y); P[2] = Math.max(0, n.r.y + n.r.h - maxY); }
    if (dir === 'V' && endMain) { P[2] = Math.max(0, n.r.y + n.r.h - maxY); }
    if (dir === 'H' && !between && !centerMain && !wrap) {
      if (n.jc && /end|right/.test(n.jc)) P[1] = Math.max(0, n.r.x + n.r.w - maxX);
      else P[3] = Math.max(0, minX - n.r.x);
    }
    // H rows: cross-axis padding from rects (absorbs child margins) unless children are centred/stretched
    if (dir === 'H' && !wrap && !/center|end|baseline/.test(n.ai || 'normal')) {
      P[0] = Math.max(pad[0] + bw[0], +(minY - n.r.y).toFixed(1));
      if (!(n.dcl && n.dcl.height)) P[2] = Math.max(pad[2] + bw[2], +(n.r.y + n.r.h - maxY).toFixed(1));
    }
    // V stacks whose height is fixed by CSS (declared height / stretched) keep CSS bottom padding
    if (dir === 'V' && n.dcl && n.dcl.height) P[2] = pad[2] + bw[2];
    // stretched by a flex row / grid track: height comes from the parent, keep CSS bottom padding
    const stretched = parent && ((parent.fd && parent.fd.startsWith('row') && /stretch|normal/.test(parent.ai || 'normal')) || parent.gtc) && !(n.dcl && n.dcl.height) && !n.as;
    if (dir === 'V' && stretched && !between && !centerMain) P[2] = pad[2] + bw[2];
    if (dir === 'V' && !wrap) { /* counter axis keep CSS */ }
    // Spacing
    if (wrap) {
      f.g = n.gap ? n.gap[1] : 0; f.cg = n.gap ? n.gap[0] : 0;
      // derive from rects when gap is zero but items are spaced
      const row0 = flow.filter(k => overlapsV(k, flow[0]));
      if (row0.length > 1) f.g = +(row0[1].r.x - (row0[0].r.x + row0[0].r.w)).toFixed(1);
      const row1 = flow.find(k => !overlapsV(k, flow[0]));
      if (row1) f.cg = +(row1.r.y - (flow[0].r.y + Math.max(...row0.map(k => k.r.h)))).toFixed(1);
      flow.forEach(k => kidsOut.push(k));
      if (centerMain) f.pa = 'C';
    } else if (between) {
      f.pa = 'SB';
      flow.forEach(k => kidsOut.push(k));
    } else {
      const gaps = [];
      for (let i = 1; i < flow.length; i++) {
        const a = flow[i - 1].r, b = flow[i].r;
        gaps.push(dir === 'V' ? b.y - (a.y + a.h) : b.x - (a.x + a.w));
      }
      const pos = gaps.map(g => Math.max(0, +g.toFixed(1)));
      const minG = pos.length ? Math.min(...pos) : 0;
      const uniform = pos.every(g => Math.abs(g - minG) < 1);
      // A spacer between two items adds 2×itemSpacing + its own height. Use spacers of (gap − 2·min) when possible,
      // otherwise switch the stack to itemSpacing 0 with explicit spacers for every gap.
      const zeroMode = !uniform && pos.some(g => g - minG >= 1 && g - 2 * minG < 0);
      f.g = uniform ? minG : zeroMode ? 0 : minG;
      flow.forEach((k, i) => {
        if (i > 0 && !uniform) {
          const gap = pos[i - 1];
          const sp = zeroMode ? gap : +(gap - 2 * minG).toFixed(1);
          if (zeroMode ? sp >= 1 : gap - minG >= 1) kidsOut.push({ spacer: Math.max(0, sp) });
        }
        kidsOut.push(k);
      });
      if (centerMain) f.pa = 'C';
      if (n.jc && /flex-end|end|right/.test(n.jc)) f.pa = 'E';
    }
    // Counter-axis alignment
    const ai = n.ai || 'normal';
    if (/center/.test(ai)) f.ca = 'C';
    else if (/flex-end|end/.test(ai)) f.ca = 'E';
    else if (/baseline/.test(ai)) f.ca = 'B';
    else if (dir === 'V' && !n.fd) {
      // block flow: detect horizontally centered children (margin auto / text-align centre on inline-blocks)
      const narrow = flow.filter(k => k.r.w < cw - 2);
      if (narrow.length && narrow.every(k => near(k.r.x - cx, cx + cw - (k.r.x + k.r.w), 2)) && narrow.some(k => k.r.x - cx > 4)) f.ca = 'C';
    }
  }
  f.p = P.map(v => +v.toFixed(1));
  f.w = +n.r.w.toFixed(1); f.h = +n.r.h.toFixed(1);

  // Children, in source DOM order (absolute layers keep their stacking position; spacers precede their flow item)
  f.k = [];
  const spacerBefore = new Map(); { let pend = null; for (const k of kidsOut) { if (k.spacer) pend = k; else { if (pend) spacerBefore.set(k, pend); pend = null; } } }
  for (const k of kidsAll) {
    if (k.abs) {
      // an 'inset:0' layer resolved against the wrong ancestor: clamp it to this container
      if (k.r.w > n.r.w * 1.5 && k.r.h > n.r.h * 1.5) { const {shiftTo} = require('./clean'); shiftTo(k, k.r.x - n.r.x, k.r.y - n.r.y); k.r = { ...n.r }; }
      const c = child(k, bp, warn, { n, dir, cw, ch, abs: true }, depth + 1);
      c.abs = [+(k.r.x - n.r.x).toFixed(1), +(k.r.y - n.r.y).toFixed(1)];
      if (c.rt) { c.rt[0][2] = +(c.rt[0][2] - n.r.x).toFixed(2); c.rt[1][2] = +(c.rt[1][2] - n.r.y).toFixed(2); }
      c.sw = 'FIXED'; c.sh = 'FIXED';
      f.k.push(c); continue;
    }
    const sp = spacerBefore.get(k);
    if (sp) f.k.push({ t: 'F', n: 'Spacer', w: dir === 'V' ? 1 : sp.spacer, h: dir === 'V' ? sp.spacer : 1, sw: dir === 'V' ? 'FILL' : 'FIXED', sh: 'FIXED', l: 'N', spacer: 1 });
    const c = child(k, bp, warn, { n, dir, cw, ch, wrap, grid }, depth + 1);
    if (wrap && c.sw === 'FIXED') c.w = Math.floor(c.w * 10) / 10 - 0.2; // exact-fit wrap rows must not overflow on rounding
    f.k.push(c);
  }
  for (const e of extraAbs) f.k.push(e);
  if (!f.k.length && (fill === 'Text/Dark Charcoal' || fill === 'Neutral/BG Alt') && n.r.w >= 120 && n.r.h >= 120 && !f.n) f.n = 'Placeholder / Photo';
  // Placeholder naming: grey block holding a single Inter caption
  if ((fill === 'Text/Dark Charcoal' || fill === 'Neutral/BG Alt')) {
    const cap = findInter(n);
    if (cap) f.n = 'Placeholder / ' + cap.slice(0, 60);
  }
  return f;
}
function findInter(n) {
  if (n.type === 'text') return (n.ts && n.ts.ff === 'Inter') ? n.runs.map(r => r.t).join('') : null;
  for (const k of n.kids || []) { const r = findInter(k); if (r) return r; }
  return null;
}

function sizing(k, out, ctx) {
  const { dir, cw, ch, wrap, grid, n: parent } = ctx;
  const d = k.dcl || {};
  const declW = d.width && /px$/.test(d.width), declH = (d.height && /px$/.test(d.height)) || (d.minHeight && /px$/.test(d.minHeight) && near(k.r.h, parseFloat(d.minHeight), 1)) || !!d.aspectRatio;
  const pctW = d.width && /%$/.test(d.width);
  const grow = (k.fg || 0) > 0 || (d.flex && /^[1-9]/.test(d.flex));
  const inline = k.d && k.d.startsWith('inline');
  let sw, sh;
  if (dir === 'V') {
    if (declW) sw = 'FIXED';
    else if (inline) sw = 'HUG';
    else if (parent.fd && parent.ai && !/stretch|normal/.test(parent.ai) && !pctW) sw = near(k.r.w, cw, 1) ? 'FILL' : 'HUG';
    else sw = near(k.r.w, cw, 1.5) ? 'FILL' : (pctW ? 'FILL' : 'FIXED');
    if (grow) sh = 'FILL'; else sh = declH ? 'FIXED' : 'HUG';
  } else {
    if (grid && !declH) { out.sw = 'FIXED'; out.sh = 'FIXED'; return; }
    if (grid || wrap) sw = 'FIXED';
    else if (declW) sw = 'FIXED';
    else if (grow || pctW) sw = 'FILL';
    else sw = 'HUG';
    const ai = parent.ai || 'normal';
    if (declH) sh = 'FIXED';
    else if (/stretch|normal/.test(ai) && !k.as && near(k.r.h, ch, 1.5) && !grid) sh = 'FILL';
    else sh = 'HUG';
  }
  out.sw = sw; out.sh = sh;
}

function child(k, bp, warn, ctx, depth) {
  let out;
  if (k.__inst) {
    out = { ...k.__inst, w: k.r.w, h: k.r.h };
    out.sw = (ctx.dir === 'V' && near(k.r.w, ctx.cw, 1.5)) || (ctx.dir === 'H' && (k.fg || (k.dcl && k.dcl.flex))) ? 'FILL' : 'FIXED';
    out.sh = 'FIXED';
    return out;
  }
  const inst = X.matchPrimitive(k, bp, colorRef, warn);
  if (inst) {
    out = inst; out.sw = 'FIXED'; out.sh = 'FIXED';
    if ((inst.stretch || inst.full) && ctx.dir === 'V' && near(k.r.w, ctx.cw, 1.5)) out.sw = 'FILL';
    else if (inst.stretch && ctx.dir === 'H' && (k.fg || (k.dcl && k.dcl.flex))) out.sw = 'FILL';
    return out;
  }
  if ((!k.kids || !k.kids.length) && k.bw && k.bc && !k.bg) {
    const tr = k.bc.map(c => /rgba\([^)]*,\s*0\)|transparent/.test(c));
    const [t, r, b, l] = k.bw;
    if (l > 0 && t > 0 && b > 0 && r === 0 && tr[0] && tr[2] && !tr[3]) {
      return { t: 'P', n: 'Play triangle', d: `M 0 0 L ${l} ${(t + b) / 2} L 0 ${t + b} Z`, w: l, h: t + b, f: colorRef(k.bc[3], warn), sw: 'FIXED', sh: 'FIXED' };
    }
  }
  if (k.cp && (!k.kids || !k.kids.length)) {
    const d = X.parsePolygon(k.cp, k.r.w, k.r.h);
    if (d) { const fc = k.bg ? colorRef(k.bg, warn) : null; const big = k.r.w > 150 && k.r.h > 150;
      const out = { t: 'P', n: big && (fc === 'Text/Dark Charcoal' || fc === 'Neutral/BG Alt') ? 'Placeholder / Photo (notched)' : 'Notch', d, w: k.r.w, h: k.r.h, f: fc, sw: 'FIXED', sh: 'FIXED' };
      if (big && ctx.dir === 'V' && near(k.r.w, ctx.cw, 1.5)) out.fillW = 1; return out; }
  }
  if (k.type === 'text') {
    // A text box with its own background/border/padding becomes a frame wrapping a text node
    if (k.bg || k.bw || k.pad) {
      const inner = textNode(k, bp, warn, ctx);
      const wrapper = { ...k, type: 'frame', kids: [], d: k.d };
      out = frameNode(wrapper, bp, warn, ctx.n, depth);
      const P = out.p; inner.sw = 'HUG'; inner.sh = 'HUG';
      const innerW = k.r.w - P[1] - P[3];
      if (inner.multi) { inner.sw = 'FILL'; }
      out.k = [inner]; out.l = 'V';
      if (k.ta === 'center') out.ca = 'C';
      sizing(k, out, ctx);
      return out;
    }
    out = textNode(k, bp, warn, ctx);
    sizing(k, out, ctx);
    // text sizing refinement
    if (!ctx.abs && out.sw === 'FIXED' && out.c.includes('\n') && k.r.w < ctx.cw - 2) out.sw = 'HUG'; // explicit line breaks: let lines set the width
    // single-line text that nearly fills its box: Figma glyphs run ~0.5% wider than Chrome, so hug instead of risking a wrap
    const boxW = k.r.w - (k.pad ? k.pad[1] + k.pad[3] : 0);
    if (!ctx.abs && !out.multi && k.iw && k.iw >= boxW - 8 && (out.sw === 'FILL' || out.sw === 'FIXED') && out.ta !== 'C' && out.ta !== 'R') out.sw = 'HUG';
    if (ctx.abs) { out.sw = 'FIXED'; }
    else if (out.sw === 'HUG' && out.multi) out.sw = 'FIXED';
    if (out.sh === 'FILL' && ctx.dir === 'H') out.sh = 'HUG';
    // widest text in a space-between row takes the free space so longer copy wraps
    if (ctx.dir === 'H' && /space-between/.test(ctx.n.jc || '') && !ctx.wrap) {
      const flow = (ctx.n.kids || []).filter(x => !x.abs);
      const widest = flow.reduce((a, b) => (b.r.w > a.r.w ? b : a), flow[0]);
      if (widest === k && flow.length > 1) out.sw = 'FILL';
    }
    return out;
  }
  if (k.type === 'svg') {
    let svg = k.svg.replace(/currentColor/g, k.color || '#52565A');
    out = { t: 'S', svg, w: k.r.w, h: k.r.h };
    sizing(k, out, ctx); out.sw = 'FIXED'; out.sh = 'FIXED';
    return out;
  }
  if (k.type === 'img') { out = { t: 'I', src: k.src, w: k.r.w, h: k.r.h, sw: 'FIXED', sh: 'FIXED' }; return out; }
  if (k.type === 'input') {
    const P = k.pad || [0, 0, 0, 0];
    out = { t: 'F', n: 'Input', l: 'H', ca: 'C', w: k.r.w, h: k.r.h, p: [P[0] + (k.bw ? k.bw[0] : 0), P[1], P[2] + (k.bw ? k.bw[2] : 0), P[3]], k: [] };
    if (k.bg) out.f = colorRef(k.bg, warn);
    if (k.bw) out.st = { c: colorRef(k.bc[k.bw.findIndex(v => v)], warn), w: k.bw };
    const t = textNode({ runs: [{ t: k.ph, ...k.ts }], ts: k.ts, r: { w: k.r.w, h: k.ts.lh || k.ts.fs * 1.5 } }, bp, warn);
    t.sw = 'FILL'; t.sh = 'HUG'; t.multi = 0;
    out.k.push(t);
    sizing(k, out, ctx);
    if (out.sh === 'HUG') out.sh = 'FIXED';
    return out;
  }
  out = frameNode(k, bp, warn, ctx.n, depth);
  sizing(k, out, ctx);
  // a hugging frame can't contain fill-width children (circular) — pin it to its source width
  if (out.sw === 'HUG' && out.k && out.k.some(c => c.t === 'T' && c.sw === 'FILL')) out.sw = 'FIXED';
  if (!out.k.length) { out.l = 'N'; if (out.sw === 'HUG') out.sw = 'FIXED'; if (out.sh === 'HUG') out.sh = 'FIXED'; }
  return out;
}

function plan(tree, { bp = 'Desktop', name = 'Frame', parentHint = null } = {}) {
  const warn = new Set();
  const root = frameNode(tree, bp, warn, parentHint, 0);
  root.n = name; root.sw = 'FIXED';
  const d = tree.dcl || {};
  root.sh = (d.height && /px$/.test(d.height)) || (d.minHeight && /px$/.test(d.minHeight)) ? 'FIXED' : 'HUG';
  if (root.sw === 'FIXED' && root.k && root.k.some(c => c.sw === 'FILL')) {}
  return { plan: root, warnings: [...warn] };
}
module.exports = { plan, PALETTE };
