// Extract many artboards in one browser session. Usage: node batch.js <html> <outdir> <vw> id1 id2 ...
const { chromium } = require('playwright-core'); const fs=require('fs'); const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'extract.js'),'utf8');
const fnBody=src.slice(src.indexOf('const tree = await page.evaluate((sel) => {')+'const tree = await page.evaluate('.length, src.indexOf('}, selector);')+1);
const fn=eval(fnBody);
(async()=>{let [file,outdir,vw,prefix]=process.argv.slice(2);const ids=[...new Set([...fs.readFileSync(file,'utf8').matchAll(new RegExp('id="('+prefix+'[^"]*)"','g'))].map(m=>m[1]))];
 const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:+vw,height:1000},deviceScaleFactor:2});
 await p.goto('file://'+path.resolve(file));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
 fs.mkdirSync(outdir,{recursive:true});
 for(const id of ids){const t=await p.evaluate(fn,'#'+id+' > div');if(!t){console.log('MISSING',id);continue;}fs.writeFileSync(path.join(outdir,id.replace(/[^\w-]/g,'_')+'.json'),JSON.stringify(t));}
 await b.close();})();
