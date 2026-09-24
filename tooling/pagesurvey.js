const { chromium } = require('playwright-core'); const path=require('path');
(async()=>{const [file,vw]=process.argv.slice(2);const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:+vw||1440,height:1000}});
await p.goto('file://'+path.resolve(file));await p.evaluate(()=>document.fonts.ready);
const r=await p.evaluate(()=>{const f=document.querySelector('[data-cp-page-frame]');const R=f.getBoundingClientRect();
const kids=[...f.children].map(e=>{const r=e.getBoundingClientRect();return [e.tagName,e.getAttribute('data-component')||'',(e.id||'')+'.'+(e.className||'').toString().slice(0,30),Math.round(r.top-R.top),Math.round(r.width),Math.round(r.height),e.children.length]});
return {w:R.width,h:R.height,path:f.tagName+'#'+f.id+'.'+f.className,kids}});
console.log(JSON.stringify(r,null,0).replace(/\],\[/g,'],\n['));await b.close();})();
