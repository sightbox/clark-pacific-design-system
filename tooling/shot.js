// node shot.js <html> <vw> <out-prefix> <selector...>
const { chromium } = require('playwright-core'); const path=require('path');
(async()=>{const [file,vw,out,...sels]=process.argv.slice(2);const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:+vw,height:1000},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(file));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
let i=0;for(const s of sels){const e=await p.$(s);if(!e){console.log('missing',s);continue;}await e.screenshot({path:`${out}_${i++}.png`});}
await b.close();})();
