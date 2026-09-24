const { chromium } = require('playwright-core'); const path=require('path');const fs=require('fs');
(async()=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(4000);await p.evaluate(()=>document.fonts.ready);
const info=await p.evaluate(()=>({h:document.body.scrollHeight,heads:[...document.querySelectorAll('h1,h2,h3,h4,[id]')].slice(0,200).map(e=>e.tagName+'#'+(e.id||'')+' '+(e.textContent||'').trim().slice(0,70)),text:document.body.innerText.slice(0,15000)}));
fs.writeFileSync('/tmp/doc.txt',info.text);console.log(info.h);console.log(info.heads.join('\n'));
await p.screenshot({path:'/tmp/doc_full.png',fullPage:true});await b.close();})();
