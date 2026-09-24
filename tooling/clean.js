// Cleans an extracted artboard tree: strips kit build aids and collapses plain wrappers.
const isTag = n => (n.type === 'frame' && n.bg === 'rgb(240, 240, 240)' && n.bw && n.bw[2] === 1 && n.kids && n.kids.length >= 1 && n.kids.every(k => k.type === 'text') && n.r.h < 50)
  || (n.type === 'text' && n.pad && n.pad[0] === 12 && n.pad[1] === 20 && n.r.h < 50 && n.r.w > 1000 && (n.bg === 'rgb(240, 240, 240)' || n.bg === 'rgba(255, 255, 255, 0.25)'));
const isAid = n => n.type === 'frame' && n.kids && n.kids[0] && n.kids[0].type === 'frame' && n.kids[0].kids && n.kids[0].kids.length === 2 && n.kids[0].kids[0].r.w === 6 && n.kids[0].kids[0].r.h === 6;
const isEmpty = n => n.type === 'frame' && (!n.kids || !n.kids.length) && !n.bg && !n.bw && !n.bgi;
function strip(n, depth) {
  if (!n.kids) return n;
  const tags = n.kids.filter(k => depth <= 3 && isTag(k) && !k.abs);
  let kids = n.kids.filter(k => !(depth <= 3 && isTag(k)));
  if (!(n.fd && n.fd.startsWith('row')) && !n.gtc) for (const t of tags.sort((a, b) => b.r.y - a.r.y)) {
    const nxt = kids.filter(k => !k.abs && k.r.y >= t.r.y).sort((a, b) => a.r.y - b.r.y)[0];
    const d = nxt ? nxt.r.y - t.r.y : t.r.h;
    for (const k of kids) if (k.r.y >= t.r.y) shiftTo(k, 0, d);
    n.r = { ...n.r, h: n.r.h - d };
  }
  const ai = kids.findIndex(isAid); if (depth <= 1 && ai > 0) kids = kids.slice(0, ai);
  if (depth <= 2) { while (kids.length && isEmpty(kids[kids.length - 1])) kids.pop(); while (kids.length && isEmpty(kids[0])) kids.shift(); }
  n.kids = kids.map(k => strip(k, depth + 1));
  return n;
}
function collapse(n) {
  // merge single plain wrapper chains at the root
  while (n.kids && n.kids.length === 1 && n.kids[0].type === 'frame' && !n.kids[0].abs && Math.abs(n.kids[0].r.w - n.r.w) < 1 && !n.pad && !n.bw && !(n.d || '').includes('flex')) {
    const c = n.kids[0];
    if (n.bg && c.bg && n.bg !== c.bg) break;
    const bg = c.bg || n.bg; const clip = c.clip || n.clip;
    n = { ...c, bg, clip };
  }
  return n;
}
function shiftTo(n, dx, dy) { n.r = { ...n.r, x: +(n.r.x - dx).toFixed(2), y: +(n.r.y - dy).toFixed(2) }; (n.kids || []).forEach(k => shiftTo(k, dx, dy)); }
function clean(tree) {
  let t = strip(JSON.parse(JSON.stringify(tree)), 0);
  t = collapse(t);
  // recompute height from children when trailing aids were removed
  const flowK = (t.kids || []).filter(k => !k.abs);
  if (flowK.length && !t.pad) { const b = Math.max(...flowK.map(k => k.r.y + k.r.h)); if (b < t.r.y + t.r.h) t.r = { ...t.r, h: b - t.r.y }; }
  shiftTo(t, t.r.x, t.r.y);
  return t;
}
// Select a subtree by dotted path of child indices ("" = root)
function at(t, p) { if (p === '' || p === undefined) return t; return p.split('.').reduce((n, i) => n.kids[+i], t); }
// Remove a node and close the gap it leaves in vertical flow (shifts following siblings, shrinks ancestors)
function removeAndReflow(tree, p) {
  const parts = p.split('.').map(Number); const idx = parts.pop();
  const chain = [tree]; let cur = tree; for (const i of parts) { cur = cur.kids[i]; chain.push(cur); }
  const par = chain[chain.length - 1]; const node = par.kids[idx];
  const isRow = x => (x.fd && x.fd.startsWith('row')) || x.gtc;
  par.kids.splice(idx, 1);
  if (node.abs || isRow(par)) return;
  const nextFlow = par.kids.slice(idx).find(k => !k.abs);
  const delta = nextFlow ? nextFlow.r.y - node.r.y : node.r.h;
  const cutY = node.r.y;
  // walk up: in each ancestor, shift later content up and shrink
  let child = null;
  for (let c = chain.length - 1; c >= 0; c--) {
    const A = chain[c];
    for (const k of A.kids) {
      if (k === child) continue;
      if (k.abs) { if (Math.abs(k.r.h - A.r.h) < 1 && k.r.y <= cutY) k.r = { ...k.r, h: k.r.h - delta }; else if (k.r.y >= cutY) shiftTo(k, 0, delta); }
      else if (k.r.y >= cutY && !isRow(A)) shiftTo(k, 0, delta);
    }
    A.r = { ...A.r, h: A.r.h - delta };
    if (c > 0 && isRow(chain[c - 1])) break;
    child = A;
  }
}
module.exports = { clean, at, shiftTo, removeAndReflow };
