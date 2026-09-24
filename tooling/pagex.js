// Extract page sections. Usage: node pagex.js <pagesDir> <outdir> <vw> [file ...]
// Each section = sibling elements after a data-component marker until the next marker. Trailing unmarked elements: Brand Sign-off Band, Footer.
const { chromium } = require('playwright-core'); const fs=require('fs'); const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'extract.js'),'utf8');
const fn=eval(src.slice(src.indexOf('const tree = await page.evaluate((sel) => {')+'const tree = await page.evaluate('.length, src.indexOf('}, selector);')+1));
(async()=>{const [dir,outdir,vw,...only]=process.argv.slice(2);fs.mkdirSync(outdir,{recursive:true});
 const files=only.length?only:fs.readdirSync(dir).filter(f=>f.endsWith('.html'));
 const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:+vw,height:1000},deviceScaleFactor:2});
 for(const f of files){await p.goto('file://'+path.resolve(dir,f));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  const secs=await p.evaluate(()=>{const fr=document.querySelector('[data-cp-page-frame]');const out=[];let cur=null;let i=0;
   for(const e of fr.children){const tag=e.getAttribute('data-component');
    if(tag!==null&&e.getBoundingClientRect().height===0){cur={tag,els:[]};out.push(cur);continue;}
    if(!cur){cur={tag:null,els:[]};out.push(cur);}const tgt=out.find(x=>!x.els.length)||cur;
    const id='cpx'+(i++);e.setAttribute('data-cpx',id);tgt.els.push(id);}
   return {h:fr.getBoundingClientRect().height,secs:out};});
  // split trailing unmarked elements off the last marked section: the last section keeps its first element(s) up to the first element whose top-level bg changes? keep simple: last tagged section keeps 1 element; rest become Sign-off + Footer
  const S=secs.secs;const last=S[S.length-1];
  if(last.tag&&last.els.length>1){const extra=last.els.splice(1);const names=['Brand Sign-off Band','Footer'];
   extra.slice(-2).forEach((id,k)=>S.push({tag:names[k+(2-Math.min(2,extra.length))],auto:1,els:[id]}));}
  const out={file:f,vw:+vw,h:secs.h,sections:[]};
  for(const s of S){const trees=[];for(const id of s.els)trees.push(await p.evaluate(fn,'[data-cpx="'+id+'"]'));
   const tops=await p.evaluate(ids=>ids.map(id=>{const e=document.querySelector('[data-cpx="'+id+'"]');const r=e.getBoundingClientRect();return [r.top+scrollY,r.height]}),s.els);
   out.sections.push({tag:s.tag,auto:s.auto,top:tops.length?tops[0][0]:null,empty:tops.length?undefined:1,h:tops.reduce((a,t)=>a+t[1],0),trees});}
  fs.writeFileSync(path.join(outdir,f.replace('.html','.json')),JSON.stringify(out));
  console.log(f,out.sections.map(s=>s.tag+'('+s.trees.length+':'+Math.round(s.h)+')').join(' | '));}
 await b.close();})();
