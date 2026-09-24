const { chromium } = require('playwright-core'); const path=require('path');
(async()=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(4000);
const hs=await p.evaluate(()=>[...document.querySelectorAll('h2')].map(h=>{const r=h.getBoundingClientRect();return [h.textContent.trim(),r.top+scrollY]}));
console.log(JSON.stringify(hs));
for(let i=1;i<4;i++){const y0=hs[i][1]-20,y1=hs[i+1][1]-20;let y=y0,k=0;while(y<y1){const h=Math.min(1400,y1-y);await p.screenshot({path:`/tmp/doc_s${i}_${k}.png`,clip:{x:0,y,width:1440,height:h},fullPage:true});y+=h;k++;}}
await b.close();})();
