// Instance matchers (primitives), gradients, polygons and shadows for the planner.
const fs = require('fs');
const path = require('path');
const REG = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json')));

// ---- Icon geometry index (same canonicalisation for the index and for lookups)
function geomKey(svg) {
  svg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
  const els = [...svg.matchAll(/<(path|polyline|polygon|line|circle|rect|ellipse)\b([^>]*?)\/?>/g)];
  const keep = ['d', 'points', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'rx', 'ry'];
  const out = els.map(([, tag, attrs]) => {
    const a = {}; for (const m of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) if (keep.includes(m[1])) a[m[1]] = m[2].replace(/\s+/g, ' ').trim();
    return tag + '(' + Object.keys(a).sort().map(k => k + '=' + a[k]).join(';') + ')';
  });
  return out.sort().join('|');
}
const ICON_NAMES = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'))).map(o => o.n);
const RAW = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons_raw.json')));
const GEOM = {};
RAW.forEach((r, i) => { GEOM[geomKey(r.svg)] = ICON_NAMES[i]; });

function svgColorAttr(svg, attr) {
  const m = svg.match(new RegExp('<svg[^>]*\\s' + attr + '="([^"]*)"'));
  return m ? m[1] : null;
}
function normColor(c) {
  if (!c) return null;
  c = c.trim();
  if (c === 'none' || c === 'transparent') return null;
  if (c === 'white') return 'rgb(255, 255, 255)';
  const h = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (h) { let x = h[1]; if (x.length === 3) x = x.split('').map(v => v + v).join(''); return `rgb(${parseInt(x.slice(0, 2), 16)}, ${parseInt(x.slice(2, 4), 16)}, ${parseInt(x.slice(4, 6), 16)})`; }
  return c.replace(/rgba?\(([^)]*)\)/, (m, p) => { const v = p.split(',').map(s => s.trim()); return v.length === 4 ? `rgba(${v.join(', ')})` : `rgb(${v.join(', ')})`; });
}

function matchIcon(k, colorRef, warn) {
  if (k.type !== 'svg') return null;
  const name = GEOM[geomKey(k.svg)];
  if (!name) { warn.add('unknown svg icon'); return null; }
  let col = normColor(svgColorAttr(k.svg, 'stroke')) || normColor(svgColorAttr(k.svg, 'fill'));
  if (col === 'currentColor' || !col) col = k.color;
  // Filled polygon icons (play) keep fill colour from the inner element
  const inner = k.svg.match(/<(?:polygon|path|circle)[^>]*fill="([^"]*)"/);
  const sw = parseFloat(svgColorAttr(k.svg, 'stroke-width') || '0');
  return { t: 'C', comp: REG.icons[name], name: 'Icon / ' + name, w: k.r.w, h: k.r.h, col: colorRef(col, warn), stw: sw, icon: 1 };
}

const CPFILES = { EnergyCycle: 'CP/Energy Cycle', GearTool: 'CP/Gear Tool', Timer: 'CP/Timer', TargetBudget: 'CP/Target Budget', ReducedWaste: 'CP/Reduced Waste', Structure: 'CP/Structure', Crane: 'CP/Crane', ReducedSiteImpact: 'CP/Reduced Site Impact' };
function matchImgIcon(k) {
  if (k.type !== 'img' || !k.src) return null;
  const m = k.src.match(/CP_v01_(\w+)_Line\.svg/); if (!m || !CPFILES[m[1]]) return null;
  const name = CPFILES[m[1]];
  return { t: 'C', comp: REG.icons[name], name: 'Icon / ' + name, w: k.r.w, h: k.r.h, col: 'Text/Dark Charcoal', stw: 1.15, icon: 1 };
}
function matchLogo(k) {
  if (k.type !== 'img' || !k.src) return null;
  const tone = /Long_White/.test(k.src) ? 'White' : /Long_Web/.test(k.src) ? 'Web' : null;
  if (!tone) return null;
  return { t: 'C', comp: REG.sets['Logo / Long'].variants['Tone=' + tone], name: 'Logo / Long', w: k.r.w, h: k.r.h, scale: 1 };
}

const textOf = (n) => (n.runs || []).map(r => r.t).join('');
function onlyText(k) { return k.type === 'frame' && k.kids && k.kids.length === 1 && k.kids[0].type === 'text' ? k.kids[0] : (k.type === 'text' ? k : null); }

function matchButton(k, bp, colorRef, warn) {
  if (k.type !== 'frame' && k.type !== 'text') return null;
  if (!(k.d || '').includes('flex') && k.type !== 'text') return null;
  const t = onlyText(k); if (!t) return null;
  const ts = t.ts || t.runs[0];
  if (!(ts.fs === 14 && ts.fw === 600 && ts.tt === 'uppercase')) return null;
  if (t.runs.length !== 1) return null;
  let type = null;
  const bg = k.bg && colorRef(k.bg, warn);
  const bw = k.bw || [0, 0, 0, 0];
  const bc = k.bc && colorRef(k.bc[0], warn);
  if (bg === 'Primary/Blue' && !k.bw) type = 'Primary';
  else if (!k.bg && bw.every(v => v === 1.5) && bc === 'Text/Dark Charcoal') type = 'Secondary';
  else if (!k.bg && bw.every(v => v === 1.5) && bc === 'Outline/On-dark') type = 'On-dark';
  if (!type) return null;
  const pad = k.pad || [0, 0, 0, 0];
  if (bp === 'Desktop' && !(pad[0] === 16 && pad[1] === 32 && pad[2] === 16 && pad[3] === 32)) return null;
  if (bp === 'Mobile' && Math.abs(k.r.h - 48) > 1) {
    if (!(pad[0] === 16 && pad[1] === 32)) return null;
  }
  const mobileFull = bp === 'Mobile' && Math.abs(k.r.h - 48) <= 1;
  const v = `Type=${type}, State=Default, Breakpoint=${mobileFull ? 'Mobile' : 'Desktop'}`;
  return { t: 'C', comp: REG.sets.Button.variants[v], name: 'Button', props: { [REG.sets.Button.label]: textOf(t) }, w: k.r.w, h: k.r.h, full: mobileFull ? 1 : 0 };
}

function matchTextLink(k, bp, colorRef, warn) {
  if (k.type !== 'frame' || !k.kids || k.kids.length !== 2) return null;
  const [lab, track] = k.kids;
  if (lab.type !== 'text' || track.type !== 'frame') return null;
  const ts = lab.ts || lab.runs[0];
  if (ts.fw !== 600 || ts.tt !== 'uppercase' || lab.runs.length !== 1) return null;
  const gap = +(track.r.y - (lab.r.y + lab.r.h)).toFixed(1);
  const bar = track.kids && track.kids[0];
  const trackCol = track.bg && colorRef(track.bg, warn);
  // Card Read More: 13px, gap 12, 2px Border track, 40px bar
  if (ts.fs === 13 && gap === 12 && Math.round(track.r.h) === 2 && trackCol === 'Neutral/Border' && bar && Math.round(bar.r.w) === 40) {
    const acc = colorRef(bar.bg, warn) === 'Primary/Blue' ? 'Blue' : colorRef(bar.bg, warn) === 'Accent/Orange' ? 'Orange' : null;
    if (!acc) return null;
    return { t: 'C', comp: REG.sets['Text Link / Card'].variants[`Accent=${acc}, State=Default`], name: 'Text Link / Card', props: { [REG.sets['Text Link / Card'].label]: textOf(lab) }, w: k.r.w, h: k.r.h, stretch: 1 };
  }
  // Canonical standalone desktop link: 14px, gap 8, 3px track (Track/Light or on-dark divider)
  if (ts.fs === 14 && gap === 8 && Math.round(track.r.h) === 3 && (trackCol === 'Track/Light' || trackCol === 'Overlay/On-dark divider')) {
    const labCol = colorRef(ts.c, warn);
    let color = 'Orange';
    if (labCol === 'Neutral/White') color = 'On dark';
    else if (bar) { const bc = colorRef(bar.bg, warn); color = bc === 'Primary/Blue' ? 'Blue' : bc === 'Sustainability/Green' ? 'Green' : 'Orange'; }
    if (/green/.test(k.cls || '')) color = 'Green';
    if (/blue/.test(k.cls || '')) color = 'Blue';
    return { t: 'C', comp: REG.sets['Text Link'].variants[`Color=${color}, State=Default, Breakpoint=Desktop`], name: 'Text Link', props: { [REG.sets['Text Link'].label]: textOf(lab) }, w: k.r.w, h: k.r.h };
  }
  // Mobile link: 12px padding, 14px label, 2px bar under label
  if (bp === 'Mobile' && ts.fs === 14 && gap === 12 && Math.round(track.r.h) === 2 && k.pad && k.pad[0] === 12 && (!track.kids || !track.kids.length)) {
    const bc = colorRef(track.bg, warn);
    const color = bc === 'Primary/Blue' ? 'Blue' : bc === 'Sustainability/Green' ? 'Green' : 'Orange';
    return { t: 'C', comp: REG.sets['Text Link'].variants[`Color=${colorRef(ts.c, warn) === 'Neutral/White' ? 'On dark' : color}, State=Default, Breakpoint=Mobile`], name: 'Text Link', props: { [REG.sets['Text Link'].label]: textOf(lab) }, w: k.r.w, h: k.r.h };
  }
  return null;
}

function matchAccentBar(k, colorRef, warn) {
  if (k.type !== 'frame' || (k.kids && k.kids.length) || Math.round(k.r.w) !== 40 || Math.round(k.r.h) !== 3 || !k.bg) return null;
  const c = colorRef(k.bg, warn);
  const m = { 'Primary/Blue': 'Blue', 'Accent/Orange': 'Orange', 'Sustainability/Green': 'Green' }[c];
  if (!m) return null;
  return { t: 'C', comp: REG.sets['Accent Bar'].variants['Color=' + m], name: 'Accent Bar', w: 40, h: 3 };
}

function matchPrimitive(k, bp, colorRef, warn) {
  return matchIcon(k, colorRef, warn) || matchImgIcon(k) || matchLogo(k) || matchButton(k, bp, colorRef, warn) || matchTextLink(k, bp, colorRef, warn) || matchAccentBar(k, colorRef, warn);
}

// ---- Gradients
function splitTop(s) { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
function parseColorStr(c) {
  if (c === 'transparent') return [0, 0, 0, 0];
  const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(',').map(parseFloat); if (p.length === 3) p.push(1); return p;
}
function parseGradient(bgi, w, h) {
  const m = bgi.match(/^(repeating-)?linear-gradient\((.*)\)$/s);
  if (!m) return null;
  if (m[1]) return { repeating: 1 };
  const parts = splitTop(m[2]);
  let angle = 180;
  if (/deg$/.test(parts[0])) { angle = parseFloat(parts.shift()); }
  else if (/^to /.test(parts[0])) { const d = parts.shift(); angle = { 'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270 }[d] ?? 180; }
  const rad = angle * Math.PI / 180;
  const L = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  const stops = parts.map(p => {
    const cm = p.match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]+)\s*(.*)$/i);
    const col = parseColorStr(cm[1]);
    let pos = null; const ps = cm[2].trim();
    if (ps) {
      const calc = ps.match(/calc\(([\d.]+)%\s*([+-])\s*([\d.]+)px\)/);
      if (calc) pos = +calc[1] / 100 + (calc[2] === '+' ? 1 : -1) * (+calc[3] / L);
      else if (/%$/.test(ps)) pos = parseFloat(ps) / 100;
      else if (/px$/.test(ps)) pos = parseFloat(ps) / L;
    }
    return [pos, col];
  });
  // Fill missing positions (evenly between known)
  if (stops[0][0] === null) stops[0][0] = 0;
  if (stops[stops.length - 1][0] === null) stops[stops.length - 1][0] = 1;
  for (let i = 1; i < stops.length - 1; i++) if (stops[i][0] === null) {
    let j = i; while (stops[j][0] === null) j++;
    const a = stops[i - 1][0], b = stops[j][0];
    for (let k = i; k < j; k++) stops[k][0] = a + (b - a) * (k - i + 1) / (j - i + 1);
  }
  return { angle, L, stops };
}
// Hard-stop thin line (hero accent line) → vector line inside the box
function accentLine(g, w, h) {
  const s = g.stops;
  if (s.length !== 4) return null;
  const vis = s.filter(x => x[1][3] > 0);
  if (vis.length !== 2 || Math.abs(vis[0][0] - vis[1][0]) * g.L > 3) return null;
  const pos = (vis[0][0] + vis[1][0]) / 2, width = Math.abs(vis[1][0] - vis[0][0]) * g.L;
  const rad = g.angle * Math.PI / 180;
  const dx = Math.sin(rad), dy = -Math.cos(rad);
  const cx = w / 2 - dx * g.L / 2 + dx * g.L * pos, cy = h / 2 - dy * g.L / 2 + dy * g.L * pos;
  // line direction perpendicular to gradient
  const px = -dy, py = dx;
  const pts = [];
  const tryT = (t) => { const x = cx + px * t, y = cy + py * t; if (x >= -0.01 && x <= w + 0.01 && y >= -0.01 && y <= h + 0.01) pts.push([+x.toFixed(2), +y.toFixed(2)]); };
  // intersect with the four edges
  if (Math.abs(px) > 1e-6) { tryT((0 - cx) / px); tryT((w - cx) / px); }
  if (Math.abs(py) > 1e-6) { tryT((0 - cy) / py); tryT((h - cy) / py); }
  const uniq = pts.filter((p, i) => pts.findIndex(q => Math.abs(q[0] - p[0]) < 0.5 && Math.abs(q[1] - p[1]) < 0.5) === i);
  if (uniq.length < 2) return null;
  return { a: uniq[0], b: uniq[1], width: +width.toFixed(2), color: vis[0][1] };
}
function gradientPaint(g, w, h) {
  const rad = g.angle * Math.PI / 180;
  const dx = Math.sin(rad), dy = -Math.cos(rad);
  const S = [w / 2 - dx * g.L / 2, h / 2 - dy * g.L / 2];
  const D = [dx * g.L, dy * g.L];
  const dd = D[0] * D[0] + D[1] * D[1];
  const a = D[0] * w / dd, b = D[1] * h / dd, tx = -(S[0] * D[0] + S[1] * D[1]) / dd;
  const c = -D[1] * w / dd, d = D[0] * h / dd, ty = 0.5 - (-D[1] * S[0] + D[0] * S[1]) / dd;
  return { tf: [[+a.toFixed(5), +b.toFixed(5), +tx.toFixed(5)], [+c.toFixed(5), +d.toFixed(5), +ty.toFixed(5)]], stops: g.stops.map(([p, c]) => [+Math.min(1, Math.max(0, p)).toFixed(4), c.map(v => +(+v).toFixed(3))]) };
}

function parsePolygon(cp, w, h) {
  const m = cp && cp.match(/^polygon\((.*)\)$/); if (!m) return null;
  const val = (v, dim) => { const c = v.match(/^calc\(([\d.]+)%\s*([+-])\s*([\d.]+)px\)$/); if (c) return +c[1] / 100 * dim + (c[2] === '+' ? 1 : -1) * +c[3]; return /%$/.test(v) ? parseFloat(v) / 100 * dim : parseFloat(v); };
  const pts = splitTop(m[1]).map(p => { const parts = p.trim().match(/calc\([^)]*\)|\S+/g); return parts.map((v, i) => val(v, i ? h : w)); });
  return 'M ' + pts.map(p => p.map(v => +v.toFixed(2)).join(' ')).join(' L ') + ' Z';
}
function parseShadow(sh) {
  const m = sh.match(/(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?/);
  if (!m) return null;
  return { c: parseColorStr(m[1]), x: +m[2], y: +m[3], r: +m[4], s: +(m[5] || 0) };
}
function iconOf(n){ if (n.type==='svg'||n.type==='img'){ const m = matchIcon(n,()=>null,new Set()) || matchImgIcon(n); return m ? m.comp : null; } for (const k of n.kids||[]) { const r = iconOf(k); if (r) return r; } return null; }
module.exports = { iconOf, matchPrimitive, parseGradient, accentLine, gradientPaint, parsePolygon, parseShadow, geomKey, REG };
