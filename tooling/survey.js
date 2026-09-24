const fs=require('fs');const path=require('path');const {plan}=require('./planner');
for(const dir of process.argv.slice(2)){for(const f of fs.readdirSync(dir)){const t=JSON.parse(fs.readFileSync(path.join(dir,f)));
 const bp=dir.includes('desk')?'Desktop':'Mobile';const {plan:p,warnings}=plan(t,{bp});
 let n=0,texts=0;const w=x=>{n++;if(x.t==='T')texts++;(x.k||[]).forEach(w)};w(p);
 console.log(dir.split('/').pop().padEnd(7),f.replace('.json','').padEnd(42),'h='+t.r.h.toFixed(0).padStart(5),'nodes='+String(n).padStart(4),'texts='+String(texts).padStart(4),'chars='+String(JSON.stringify(p).length).padStart(6),warnings.length?warnings.join(' | ').slice(0,160):'');}}
