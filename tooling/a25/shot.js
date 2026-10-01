// Screenshot addendum artboards from the source HTML. Usage: node a25/shot.js <outdir> <a25-id>...
const { chromium } = require('playwright-core'); const path = require('path');
(async () => { const [out, ...ids] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + path.resolve(__dirname, '../../handoff/source/kits/additions-2.5.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  for (const id of ids) { const el = await p.$('#' + id + ' > div'); await el.screenshot({ path: path.join(out, id + '.png') }); }
  await b.close(); })();
