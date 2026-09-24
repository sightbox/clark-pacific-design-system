// Match page sections to component-set variants by aligning their text sequences.
// node match.js <desk|mob> <page.json> [...]  -> prints report, writes ex/match/<bp>/<page>.json
const fs=require('fs');const path=require('path');const {clean,at,removeAndReflow,shiftTo}=require('./clean');
const {iconOf}=require('./extras');
const iconsDFS=(n,acc=[])=>{if(n.type==='svg'||n.type==='img'){const c=iconOf(n);if(c)acc.push(c);return acc;}(n.kids||[]).forEach(k=>iconsDFS(k,acc));return acc;};
const SETS=JSON.parse(fs.readFileSync(path.join(__dirname,'sets.json')));
// variant lookup tolerant of properties added after the specs were written (Slide, State): prefer Slide=1 / State=Default
const variantId=(set,vname)=>{const S=SETS[set];if(!S)return undefined;if(S[vname])return S[vname];const want=vname.split(', ');const c=Object.keys(S).filter(k=>want.every(x=>k.split(', ').includes(x)));const def=k=>/Slide=1|State=Default/.test(k)?1:0;c.sort((a,b)=>def(b)-def(a));return c.length?S[c[0]]:undefined;};
const load=src=>clean(JSON.parse(fs.readFileSync(path.join(__dirname,'ex',src+'.json'))));
function variantTree(v){let t=load(v.src.split('#')[0]);if(v.path)t=at(t,v.path);t=JSON.parse(JSON.stringify(t));
  if(v.drop)for(const d of [...v.drop].sort((a,b)=>{const A=a.split('.').map(Number),B=b.split('.').map(Number);for(let i=0;i<Math.max(A.length,B.length);i++){if((A[i]??-1)!==(B[i]??-1))return (B[i]??-1)-(A[i]??-1);}return 0;}))removeAndReflow(t,d);
  if(v.path)shiftTo(t,t.r.x,t.r.y);return t;}
const role=runs=>{const c=runs.map(r=>r.t).join('');const r0=runs.reduce((a,r)=>r.t.length>a.t.length?r:a,runs[0]);const fs=r0.fs,fw=Math.max(...runs.map(r=>r.fw));if(!/[A-Za-z0-9]{2,}/.test(c))return 'glyph';if(fs>=24)return 'head';if(r0.tt==='uppercase'&&fs<=16)return 'label';if(fw>=500)return 'title';return 'body';};
// text leaves in DFS order: {c, key, runs}
const leaves=(n,acc=[],item=null)=>{if(n.__item!==undefined)item=n.__item;
  if(n.type==='text'&&n.runs[0].ff==='Inter'){}else if(n.type==='text'){const r0=n.runs[0];acc.push({c:n.runs.map(r=>r.t).join(''),key:role(n.runs),runs:n.runs,item});}
  else if(n.type==='input')acc.push({c:n.ph,key:'input',item});
  (n.kids||[]).forEach(k=>leaves(k,acc,item));return acc;};

// locate announcement bar / header subtrees (paths) near the top of a tree
function findPaths(t){const out={};const walk=(n,p,d)=>{if(d>3)return;const tx=leaves(n).map(x=>x.c).join(' ');
  if(!out.ann&&n.type==='frame'&&n.r.h<100&&n.r.y<130&&/Learn more/.test(tx)&&tx.length<200)out.ann=p;
  else if(!out.hdr&&n.type==='frame'&&n.kids&&n.kids[0]&&n.kids[0].type==='img'&&n.r.y<140&&n.r.h>=50&&n.r.h<=100&&n.r.w>=380)out.hdr=p;
  else (n.kids||[]).forEach((k,i)=>walk(k,p===''?String(i):p+'.'+i,d+1));};walk(t,'',0);return out;}
const dropPath=(t,p)=>{if(p==='')return null;removeAndReflow(t,p);return t;};
// Needleman-Wunsch on text keys
// Needleman-Wunsch on text roles: deleting a variant text (hide it) is cheap, leaving page copy unplaced is not
function align(A,B){const n=A.length,m=B.length;const GD=-0.4,GI=-1.5;const S=(a,b)=>a.key===b.key?(a.c===b.c?2.2:2):-2.5;
  const D=[...Array(n+1)].map(()=>new Float64Array(m+1));for(let i=1;i<=n;i++)D[i][0]=i*GD;for(let j=1;j<=m;j++)D[0][j]=j*GI;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)D[i][j]=Math.max(D[i-1][j-1]+S(A[i-1],B[j-1]),D[i-1][j]+GD,D[i][j-1]+GI);
  const ops=[];let i=n,j=m;const eq=(x,y)=>Math.abs(x-y)<1e-9;while(i>0||j>0){if(i>0&&j>0&&eq(D[i][j],D[i-1][j-1]+S(A[i-1],B[j-1]))){ops.push(['M',i-1,j-1]);i--;j--;}else if(i>0&&eq(D[i][j],D[i-1][j]+GD)){ops.push(['D',i-1,-1]);i--;}else{ops.push(['I',-1,j-1]);j--;}}
  ops.reverse();return {score:D[n][m],ops};}
// spec lookup: set name -> variants (with props string)
const specs={};for(const f of fs.readdirSync(path.join(__dirname,'specs'))){const s=JSON.parse(fs.readFileSync(path.join(__dirname,'specs',f)));
  if(s.name&&s.variants)specs[s.name]={spec:s,variants:s.variants.map(v=>({...v,vname:Object.entries(v.props).map(([k,x])=>`${k}=${x}`).join(', ')}))};}
const TAGMAP=[[/^Header \+ Hero \/ (.*)/,m=>['Hero',v=>v.props.Type===m[1],v=>v.props.Type===m[1]]],[/^CTA Banner \/ (.*)/,m=>['CTA Banner',v=>v.props.Surface===m[1]||(m[1]==='Light'&&/Light|White|BG Alt/.test(v.props.Surface))]],
  [/^CARBONSHIELD/,()=>['CARBONSHIELD®']],[/^Finishes Guide/,()=>['Finishes Guide · Graphic CTA']],[/^Leadership Card/,()=>['Leadership Grid']],
  [/^Form \/ Contact/,()=>['Form',v=>v.props.Type==='Contact']],[/^Card \/ Standard/,()=>['Related Content Row']],[/^(.*)$/,m=>[m[1]]]];
function candidates(tag,bp){for(const [re,f] of TAGMAP){const m=tag.match(re);if(m){const [set,filt,pref]=f(m);const s=specs[set];if(!s)return {set,list:[]};let list=s.variants.filter(v=>v.bp===bp&&(!filt||filt(v)));if(!list.length&&filt&&set==='Hero')list=s.variants.filter(v=>v.bp===bp);list.tagPref=pref;return {set,list};}}}
// mark item roots in a variant tree (usesAll parent kids) so deletions can be mapped to Show item N
function markItems(t,v){const ua=v.usesAll;if(ua){const par=at(t,ua.parent);par.kids.forEach((k,i)=>k.__item=i+1);}return t;}
const best_fmt=x=>(x.key+' '+x.c.slice(0,34)+(x.item?' #'+x.item:''));
const [bpArg,...pages]=process.argv.slice(2);const BP=bpArg==='mob'?'Mobile':'Desktop';
const outDir=path.join(__dirname,'ex/match',bpArg);fs.mkdirSync(outDir,{recursive:true});
let tot=0,hit=0;
for(const pf of pages){const P=JSON.parse(fs.readFileSync(pf));const res={file:P.file,bp:BP,sections:[]};
  for(const s of P.sections){tot++;
    let trees=s.trees.map(t=>clean(t));
    const pageOv={};trees.forEach((t,ti)=>{const f=findPaths(t);if(f.ann!==undefined&&!pageOv.ann)pageOv.ann={ti,p:f.ann,texts:leaves(at(t,f.ann))};if(f.hdr!==undefined&&!pageOv.hdr)pageOv.hdr={ti,p:f.hdr,dark:!!(t.bg&&t.bg!=='rgb(255, 255, 255)')};});
    const plFull=trees.flatMap(t=>leaves(t));
    if(s.tag.startsWith('One-off')||!s.trees.length){res.sections.push({top:Math.round(s.top||0),tag:s.tag,kind:'page-specific',h:Math.round(s.h)});continue;}
    const {set,list}=candidates(s.tag,BP);let best=null;
    for(const v of list){const vt=markItems(variantTree(v),v);const vl=leaves(vt);const vf=findPaths(vt);
      // page overlays the variant lacks are removed from the page side and emitted as separate instances
      const strip={ann:pageOv.ann&&vf.ann===undefined,hdr:pageOv.hdr&&vf.hdr===undefined};
      let pl=plFull;if(strip.ann||strip.hdr){const tt=trees.map(t=>JSON.parse(JSON.stringify(t)));
        const rm=[];if(strip.hdr)rm.push(pageOv.hdr);if(strip.ann)rm.push(pageOv.ann);
        rm.sort((a,b)=>b.p.length-a.p.length||b.p.localeCompare(a.p)).forEach(o=>{if(o.p==='')tt[o.ti]=null;else removeAndReflow(tt[o.ti],o.p);});
        pl=tt.filter(Boolean).flatMap(t=>leaves(t));}
      const {score,ops}=align(vl,pl);
      const mp=ops.filter(o=>o[0]==='M').length;const hr=Math.min(vt.r.h,s.h)/Math.max(vt.r.h,s.h);
      const tagBonus=(list.tagPref&&list.tagPref(v))?1.5:0;
      const cand={set,v,vname:v.vname,id:variantId(set,v.vname),score:+score.toFixed(1),fit:+(mp/Math.max(1,pl.length)).toFixed(2),hr:+hr.toFixed(2),vh:Math.round(vt.r.h),nv:vl.length,np:pl.length,ops,vl,pl,strip};
      cand.total=score+tagBonus+2*hr;
      if(process.env.DBG&&s.tag.includes(process.env.DBG)){console.log('--',v.vname,cand.score,cand.fit,cand.hr);for(const [op,i,j] of ops)console.log('   ',op,(i>=0?best_fmt(vl[i]):'').padEnd(50),j>=0?best_fmt(pl[j]):'');}
      if(!best||cand.total>best.total)best=cand;}
    if(!best){res.sections.push({top:Math.round(s.top),tag:s.tag,kind:'page-specific',why:'no candidates for '+set,h:Math.round(s.h)});continue;}
    // overrides keyed by (old text, occurrence) so the Figma side can find nodes regardless of extra layers
    const occ={};const vocc=best.vl.map(a=>{occ[a.c]=(occ[a.c]||0)+1;return occ[a.c];});
    const ov=[],hideT=[],unplaced=[];const keep=new Set(),itemDel=new Set();
    for(const [op,i,j] of best.ops){
      if(op==='M'){const a=best.vl[i],b=best.pl[j];if(a.item)keep.add(a.item);
        const rw=r=>r&&r.length>1?r.map(x=>[x.t.length,x.fw]):undefined;
        if(a.c!==b.c||JSON.stringify(rw(a.runs))!==JSON.stringify(rw(b.runs)))ov.push({old:a.c,occ:vocc[i],new:b.c,runs:rw(b.runs)});}
      else if(op==='D'){const a=best.vl[i];if(a.item)itemDel.add(a.item);else hideT.push({old:a.c,occ:vocc[i]});}
      else unplaced.push(best.pl[j].c);}
    const hideItems=[...itemDel].filter(x=>!keep.has(x)).sort((a,b)=>a-b);
    // texts inside partially-kept items are hidden individually
    for(const [op,i] of best.ops)if(op==='D'){const a=best.vl[i];if(a.item&&keep.has(a.item))hideT.push({old:a.c,occ:vocc[i]});}
    const realUnplaced=unplaced.filter(c=>/[A-Za-z0-9]{2,}/.test(c));
    const GLOBAL=new Set(['Footer','Brand Sign-off Band','Header','Announcement Bar']);const ok=GLOBAL.has(set)||(set==='Hero'&&list.tagPref&&list.tagPref(best.v))||best.fit>=0.6||(best.fit>=0.4&&realUnplaced.length<=2);
    const pieces=[];
    if(ok&&best.strip.ann)pieces.push({set:'Announcement Bar',id:SETS['Announcement Bar']['Breakpoint='+BP],overrides:[]});
    if(ok&&best.strip.hdr)pieces.push({set:'Header',id:SETS['Header'][`State=${pageOv.hdr.dark?'Over photo':'Solid'}, Breakpoint=${BP}`]||SETS['Header'][`State=Over photo, Breakpoint=${BP}`],overlay:pageOv.hdr.dark,overrides:[]});
    if(ok){hit++;pieces.push({set,variant:best.vname,id:best.id,overrides:ov,hide:hideT,hideItems,icons:trees.flatMap(t=>iconsDFS(t)),texts:best.pl.map(x=>({c:x.c,r:x.key,w:x.runs&&x.runs.length>1?x.runs.map(q=>[q.t.length,q.fw,Math.round(q.fs)]):undefined}))});}
    res.sections.push({top:Math.round(s.top),tag:s.tag,kind:ok?'instance':'page-specific',set,variant:best.vname,id:best.id,score:best.score,fit:best.fit,hr:best.hr,vh:best.vh,h:Math.round(s.h),pieces,unplaced:realUnplaced,nov:ov.length,nhide:hideT.length,hideItems});
  }
  fs.writeFileSync(path.join(outDir,path.basename(pf)),JSON.stringify(res,null,1));
  console.log('\n'+P.file);for(const r of res.sections)console.log(' ',r.kind==='instance'?'✓':'✗',r.tag.padEnd(36),r.variant?`${r.variant} [${r.id}] fit=${r.fit} sc=${r.score} h=${r.h}/${r.vh} ov=${r.nov} hideT=${r.nhide} hideI=${r.hideItems} ${r.pieces.length>1?'+'+r.pieces.slice(0,-1).map(p=>p.set).join('+'):''} un=${r.unplaced.length} ${r.unplaced.slice(0,3).map(x=>x.slice(0,28)).join(' | ')}`:(r.why||''));}
console.log(`\nmatched ${hit}/${tot}`);
