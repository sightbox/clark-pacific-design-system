// Mobile (390) extraction of the 45 addendum components.
// Renders handoff/source/kits/additions-2.5.html at a 390 viewport, applies the handoff's static mobile reflow rules
// (handoff/reference/cp-static-mobile.js: type map, 20px gutters, stacked grids/rows) to each artboard's 1440 frame,
// then extracts it with the same walker as extract-batch.js.
// Usage (from tooling/): node a25/extract-mobile.js [outdir=ex/a25m] [shotsDir]
const { chromium } = require('playwright-core'); const fs = require('fs'); const path = require('path');
const T = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(T, 'extract.js'), 'utf8');
const fn = eval(src.slice(src.indexOf('const tree = await page.evaluate((sel) => {') + 'const tree = await page.evaluate('.length, src.indexOf('}, selector);') + 1));
const rules = fs.readFileSync(path.join(T, '../handoff/reference/cp-static-mobile.js'), 'utf8')
  .replace('root.cpStaticMobile = function', 'root.cpMobilize = mobilize; root.cpStaticMobile = function');
const file = path.join(T, '../handoff/source/kits/additions-2.5.html');
(async () => {
  const outdir = path.resolve(T, process.argv[2] || 'ex/a25m'), shots = process.argv[3];
  const ids = [...new Set([...fs.readFileSync(file, 'utf8').matchAll(/id="(a25-[^"]*)"/g)].map(m => m[1]))];
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file://' + file); await p.evaluate(() => document.fonts.ready);
  await p.addScriptTag({ content: rules });
  await p.evaluate(ids => {
    const $$ = (r, s) => [...r.querySelectorAll(s)];
    const txt = e => (e.textContent || '').replace(/\s+/g, ' ').trim();
    // single line, clipped at the frame edge (sources mark these overflow-x:auto = "scrolls horizontally at narrow widths")
    const hscroll = (row, itemW) => { Object.assign(row.style, { display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflow: 'hidden', gridTemplateColumns: '' });
      [...row.children].forEach(c => { if (c.style.position === 'absolute') return; c.style.flex = itemW ? `0 0 ${itemW}px` : '0 0 auto'; c.style.maxWidth = 'none'; if (itemW) c.style.width = itemW + 'px'; }); };
    const dots = (n, after) => { const d = document.createElement('div'); d.setAttribute('style', 'display:flex;gap:8px;justify-content:center;align-items:center;margin-top:20px;');
      for (let i = 0; i < n; i++) { const k = document.createElement('div'); k.setAttribute('style', `width:${i ? 6 : 26}px;height:6px;border-radius:3px;background:${i ? 'rgb(222,223,224)' : 'rgb(255,134,0)'};`); d.appendChild(k); }
      after.insertAdjacentElement('afterend', d); };
    const FIX = {
      'a25-carousel-image-content-3-up': f => carousel(f), 'a25-carousel-image-content-4-up': f => carousel(f),
      'a25-carousel-product-highlights': f => { $$(f, 'div').filter(e => /^[‹›]$/.test(txt(e)) && e.children.length <= 1 && e.parentElement.children.length === 3).forEach(e => { const row = e.parentElement; e.style.display = 'none'; [...row.children].forEach(c => { if (c.style.display !== 'none') { c.style.flex = '1 1 auto'; c.style.width = '100%'; } }); }); },
      'a25-careers-open-positions-list': f => { $$(f, 'div').filter(e => e.children.length === 4 && /^Apply$/i.test(txt(e.lastElementChild))).forEach(r => { Object.assign(r.style, { flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', columnGap: '8px', rowGap: '12px' }); const t = r.firstElementChild; t.style.flex = '0 0 100%'; t.style.width = '100%'; [...r.children].slice(1).forEach(c => { c.style.flex = '0 0 auto'; c.style.width = 'auto'; }); r.lastElementChild.style.marginLeft = 'auto'; }); },
      'a25-products-structural-components-strip': f => { const row = $$(f, 'div').find(e => e.children.length >= 6 && [...e.children].every(c => /COMPONENT/.test(txt(c)))); hscroll(row, 140); },
      'a25-about-timeline-horizontal': f => { const sc = $$(f, 'div').find(e => e.style.overflowX === 'auto' || e.style.overflow === 'hidden' && e.querySelector('[style*="border-radius: 50%"]')); const inner = sc && sc.firstElementChild; if (inner) { Object.assign(inner.style, { minWidth: '960px', width: '960px', flexDirection: 'row', flexWrap: 'nowrap', display: 'flex' }); [...inner.children].forEach(c => { if (c.style.position !== 'absolute') { c.style.flex = '1 1 0'; c.style.width = 'auto'; } }); sc.style.overflow = 'hidden'; } },
      'a25-stats-row-accent-dividers': f => { $$(f, 'div').filter(e => e.style.display === 'grid').forEach(g => g.style.rowGap = '32px'); },
      'a25-stats-row-light-infinite-facade': f => { $$(f, 'div').filter(e => e.style.display === 'grid').forEach(g => g.style.rowGap = '32px'); },
      'a25-sustainability-stats-band': f => { $$(f, 'div').filter(e => e.style.display === 'grid').forEach(g => { g.style.margin = '0 20px'; g.style.rowGap = '32px'; [...g.children].forEach(c => { c.style.padding = '0 12px 0 0'; c.style.borderLeft = 'none'; }); }); }
    };
    function carousel(f) {
      const grid = $$(f, 'div').find(e => e.style.display === 'grid' && e.children.length >= 3 && [...e.children].every(c => c.querySelector('[style*="aspect-ratio"]')));
      if (!grid) return; const n = grid.children.length;
      $$(f, 'div').filter(e => e.style.position === 'absolute' && /^[‹›]$/.test(txt(e))).forEach(a => a.style.display = 'none');
      hscroll(grid, 300); grid.style.gap = '12px'; grid.style.background = 'transparent';
      const wrap = grid.parentElement; wrap.style.border = 'none'; wrap.style.overflow = 'hidden'; dots(n, wrap);
    }
    for (const id of ids) {
      const art = document.getElementById(id); if (!art) continue;
      art.style.padding = '0'; art.style.width = '390px';
      const f = art.querySelector(':scope > div'); if (!f) continue;
      const scrollers = $$(f, 'div').filter(e => e.style.overflowX === 'auto');
      window.cpMobilize(f, document);
      // the rules only touch descendants; here the artboard frame itself often carries the section padding
      { const SC = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 120], snap = v => SC.reduce((a, q) => Math.abs(q - v) < Math.abs(a - v) ? q : a, 0);
        for (const k of ['Left', 'Right']) { const v = parseFloat(f.style['padding' + k]) || 0; if (v >= 40) f.style['padding' + k] = '20px'; else if (v >= 28) f.style['padding' + k] = '16px'; }
        for (const k of ['Top', 'Bottom']) { const v = parseFloat(f.style['padding' + k]) || 0; if (v >= 56) f.style['padding' + k] = snap(v * 0.6) + 'px'; } }
      scrollers.forEach(s => { if (!s.querySelector('[style*="min-width: 900px"], [style*="border-radius: 50%"]')) hscroll(s); });
      $$(f, '*').forEach(e => { if (parseFloat(e.style.marginLeft) < 0) e.style.marginLeft = '0px'; });
      if (FIX[id]) FIX[id](f);
    }
  }, ids);
  await p.waitForTimeout(500);
  fs.mkdirSync(outdir, { recursive: true }); if (shots) fs.mkdirSync(shots, { recursive: true });
  const report = [];
  for (const id of ids) {
    const t = await p.evaluate(fn, '#' + id + ' > div'); if (!t) { console.log('MISSING', id); continue; }
    fs.writeFileSync(path.join(outdir, id + '.json'), JSON.stringify(t));
    const el = await p.$('#' + id + ' > div'); const bb = await el.boundingBox();
    report.push(`${id} ${Math.round(bb.width)}×${Math.round(bb.height)}`);
    if (shots) await el.screenshot({ path: path.join(shots, id + '.png') });
  }
  await b.close(); console.log(report.join('\n'));
})();
