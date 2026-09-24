// Usage: node extract.js <html file> <selector> <out.json> [viewportWidth]
// Renders the page in Chrome and dumps a computed-layout tree for the element matched by selector.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const [file, selector, out, vw] = process.argv.slice(2);
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: Number(vw || 1600), height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const tree = await page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;
    const R = root.getBoundingClientRect();
    const rect = (r) => ({ x: +(r.left - R.left).toFixed(2), y: +(r.top - R.top).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
    const INLINE = new Set(['inline', 'contents']);
    const isInlineText = (el) => {
      const cs = getComputedStyle(el);
      if (!INLINE.has(cs.display) && el.tagName !== 'BR') return false;
      if (['SVG', 'svg', 'IMG'].includes(el.tagName)) return false;
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderTopWidth !== '0px' || cs.position === 'absolute') return false;
      return [...el.children].every(isInlineText);
    };
    const isTextBox = (el) => {
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!hasText && !(el.children.length && [...el.children].every(isInlineText) && el.textContent.trim())) return false;
      return [...el.children].every(isInlineText);
    };
    const textStyle = (cs) => ({
      ff: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), fw: +cs.fontWeight, fs: parseFloat(cs.fontSize),
      lh: cs.lineHeight === 'normal' ? null : parseFloat(cs.lineHeight),
      ls: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing), tt: cs.textTransform, c: cs.color,
      td: cs.textDecorationLine !== 'none' ? cs.textDecorationLine : undefined, fst: cs.fontStyle === 'italic' ? 'i' : undefined,
    });
    const runs = (el) => {
      const out = [];
      const rec = (n) => {
        if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' '); if (t) out.push({ t, ...textStyle(getComputedStyle(n.parentElement)) }); }
        else if (n.nodeType === 1) { if (n.tagName === 'BR') out.push({ t: '\n', ...textStyle(getComputedStyle(n.parentElement)) }); else n.childNodes.forEach(rec); }
      };
      el.childNodes.forEach(rec);
      // trim leading/trailing whitespace across runs
      if (out.length) { out[0].t = out[0].t.replace(/^ /, ''); out[out.length - 1].t = out[out.length - 1].t.replace(/ $/, ''); }
      return out.filter(r => r.t.length);
    };
    const box = (el, cs) => {
      const b = {};
      const bg = cs.backgroundColor; if (bg !== 'rgba(0, 0, 0, 0)') b.bg = bg;
      if (cs.backgroundImage !== 'none') b.bgi = cs.backgroundImage;
      const sides = ['Top', 'Right', 'Bottom', 'Left'];
      const bw = sides.map(s => cs['border' + s + 'Style'] !== 'none' ? (parseFloat(el.style['border' + s + 'Width']) || parseFloat(cs['border' + s + 'Width'])) : 0);
      if (bw.some(v => v)) { b.bw = bw; b.bc = sides.map(s => cs['border' + s + 'Color']); }
      const pad = sides.map(s => parseFloat(cs['padding' + s])); if (pad.some(v => v)) b.pad = pad;
      const rad = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(s => parseFloat(cs['border' + s + 'Radius']) || 0);
      if (rad.some(v => v)) b.rad = rad;
      if (+cs.opacity !== 1) b.op = +cs.opacity;
      if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') b.clip = 1;
      if (cs.boxShadow !== 'none') b.sh = cs.boxShadow;
      if (cs.transform !== 'none') b.tf = cs.transform;
      if (cs.clipPath && cs.clipPath !== 'none') b.cp = cs.clipPath;
      if (cs.transform !== 'none') { b.ow = el.offsetWidth; b.oh = el.offsetHeight; }
      return b;
    };
    const walk = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && cs.position !== 'absolute') return null;
      const n = { tag: el.tagName.toLowerCase(), r: rect(r) };
      if (el.className && typeof el.className === 'string') n.cls = el.className;
      if (el.dataset && el.dataset.component) n.comp = el.dataset.component;
      const st = el.style; const dcl = {};
      ['width','height','flex','flexGrow','flexBasis','maxWidth','minWidth','minHeight','margin','marginLeft','marginRight','alignSelf','aspectRatio'].forEach(k => { if (st[k]) dcl[k] = st[k]; });
      if (Object.keys(dcl).length) n.dcl = dcl;
      n.fg = +cs.flexGrow || undefined; n.as = cs.alignSelf !== 'auto' ? cs.alignSelf : undefined;
      if (cs.position === 'absolute' || cs.position === 'fixed') n.abs = 1;
      Object.assign(n, box(el, cs));
      if (el.tagName.toLowerCase() === 'svg') { n.type = 'svg'; n.svg = el.outerHTML; n.color = cs.color; return n; }
      if (el.tagName === 'IMG') { n.type = 'img'; n.src = el.getAttribute('src'); return n; }
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
        n.type = 'input'; n.ph = el.getAttribute('placeholder') || el.value || ''; n.ts = textStyle(cs); n.ts.c = el.value ? cs.color : 'rgb(127, 138, 146)'; return n;
      }
      n.d = cs.display;
      if (cs.display.includes('flex')) {
        n.fd = cs.flexDirection; n.wrap = cs.flexWrap === 'wrap' ? 1 : 0; n.jc = cs.justifyContent; n.ai = cs.alignItems;
        n.gap = [parseFloat(cs.rowGap) || 0, parseFloat(cs.columnGap) || 0];
      } else if (cs.display.includes('grid')) {
        n.gap = [parseFloat(cs.rowGap) || 0, parseFloat(cs.columnGap) || 0]; n.gtc = cs.gridTemplateColumns;
      }
      if (isTextBox(el)) {
        n.type = 'text'; n.runs = runs(el); n.ta = cs.textAlign; n.ts = textStyle(cs);
        { const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter(q => q.width > 0);
          const L = {}; for (const q of rs) { const key = Math.round((q.top + q.bottom) / 2 / 4); (L[key] = L[key] || []).push(q); }
          const widths = Object.values(L).map(a => Math.max(...a.map(q => q.right)) - Math.min(...a.map(q => q.left)));
          n.iw = +Math.max(0, ...widths).toFixed(1); n.lines = widths.length; }
        return n;
      }
      n.type = 'frame';
      n.kids = [];
      el.childNodes.forEach(c => {
        if (c.nodeType === 3 && c.textContent.trim()) {
          const range = document.createRange(); range.selectNodeContents(c);
          n.kids.push({ type: 'text', tag: '#text', r: rect(range.getBoundingClientRect()), runs: [{ t: c.textContent.trim().replace(/\s+/g, ' '), ...textStyle(cs) }], ta: cs.textAlign, ts: textStyle(cs) });
        } else if (c.nodeType === 1) { const k = walk(c); if (k) n.kids.push(k); }
      });
      return n;
    };
    return walk(root);
  }, selector);
  fs.writeFileSync(out, JSON.stringify(tree));
  console.log(out, JSON.stringify(tree).length);
  await browser.close();
})();
