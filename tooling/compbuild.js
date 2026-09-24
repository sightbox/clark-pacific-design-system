// Generates use_figma scripts for component sets from specs.
// node compbuild.js <spec.json> <step> [chunk]   step = items:<i> | set
const fs=require('fs');const path=require('path');
const {plan}=require('./planner');const {clean,at}=require('./clean');
const REGF=path.join(__dirname,'registry.json');const REG=JSON.parse(fs.readFileSync(REGF));
const builder=fs.readFileSync(path.join(__dirname,'builder.js'),'utf8');
const load=src=>clean(JSON.parse(fs.readFileSync(path.join(__dirname,'ex',src+'.json'))));
const textsDFS=(n,acc=[])=>{if(n.type==='text')acc.push(n.runs.map(r=>r.t).join(''));else if(n.type==='input')acc.push(n.ph);(n.kids||[]).forEach(k=>textsDFS(k,acc));return acc;};
const isGlyph=s=>!/[A-Za-z0-9]{2,}/.test(s);
// planner post-pass: name text props (pn) on plan nodes, skipping instance subtrees
const TIER=s=>s.split('/')[1];
function nameTexts(p,names){
  const used={};let idx=0;
  const walk=n=>{if(n.t==='C')return;if(n.t==='T'){const exp=names?names[idx]:undefined;idx++;
      if(exp===null)return;
      if(!exp&&isGlyph(n.c)){n.n='Glyph';return;}
      const tier=TIER(n.s||'x/Text');
      const headTier=/^(Display|Heading)/.test(tier)&&tier!=='Heading XS';
      if(headTier&&(!exp||(n.runs&&n.runs.length))){n.n=exp||'Heading';return;} // two-tier headline: editable layer, no property (keeps keyword run)
      if(n.runs&&n.runs.length){n.n=exp||tier;return;} // mixed-weight copy: editable layer, keeps its runs
      if(exp){n.pn=exp;n.pnx=1;return;}
      if(isGlyph(n.c))return;
      let base=TIER(n.s||'x/Text');used[base]=(used[base]||0)+1;n.pn=base+(used[base]>1?' '+used[base]:'');}
    (n.k||[]).forEach(walk);};
  walk(p);
  // rename first occurrences that later got duplicates: "Body" -> "Body 1"
  const dup={};const w2=n=>{if(n.t==='C')return;if(n.pn){const b=n.pn.replace(/ \d+$/,'');dup[b]=(dup[b]||0)+1;}(n.k||[]).forEach(w2);};w2(p);
  const w3=n=>{if(n.t==='C')return;if(n.pn&&!/ \d+$/.test(n.pn)&&dup[n.pn]>1)n.pn=n.pn+' 1';(n.k||[]).forEach(w3);};w3(p);
  return p;
}
// Replace item occurrences in the extracted tree with instance markers
function markInstances(tree,uses){
  for(const u of uses){const node=at(tree,u.path);
    const item=REG.items[u.item];if(!item)throw new Error('item not in registry: '+u.item);
    const vid=item.variants[u.variant];if(!vid)throw new Error('variant missing '+u.variant);
    const names=item.textNames[u.variant]||[];const texts=textsDFS(node);
    const props={};let j=0;for(const t of texts){const nm=names[j++];if(nm)props[nm]=t;}
    if(item.iconSwap){const ic=require('./extras').iconOf(node);if(ic)props['Icon']=ic;}
    node.__inst={t:'C',comp:vid,name:u.item,props,show:u.show,nm:u.nm||u.item};
  }
}
function makePlan(src,bp,name,opts){
  let tree=load(src.split('#')[0]);let parentHint=null;
  if(opts.path){const parts=opts.path.split('.');parts.pop();const par=at(tree,parts.join('.'));if(par&&(par.gtc||(par.fd&&par.fd.startsWith('row'))))parentHint=par;tree=at(tree,opts.path);}
  tree=JSON.parse(JSON.stringify(tree));
  if(opts.drop){ // remove listed descendants (paths relative to the selected root), deepest first
    const {removeAndReflow}=require('./clean');
    for(const d of [...opts.drop].sort((a,b)=>{const A=a.split('.').map(Number),B=b.split('.').map(Number);for(let i=0;i<Math.max(A.length,B.length);i++){if((A[i]??-1)!==(B[i]??-1))return (B[i]??-1)-(A[i]??-1);}return 0;}))removeAndReflow(tree,d);
  }
  if(opts.path){const {shiftTo}=require('./clean');shiftTo(tree,tree.r.x,tree.r.y);}
  if(opts.usesAll){const ua=opts.usesAll;const par=at(tree,ua.parent);opts.uses=(opts.uses||[]).concat(par.kids.map((k,i)=>({path:(ua.parent?ua.parent+'.':'')+i,item:ua.item,variant:(ua.variants&&ua.variants[i])||ua.variant,show:'Show item '+(i+1),nm:ua.item+' '+(i+1)})));}
  if(opts.uses)markInstances(tree,opts.uses);
  const {plan:p,warnings}=plan(tree,{bp,name,parentHint});
  nameTexts(p,opts.names);
  return {p,warnings};
}
const [specFile,step]=process.argv.slice(2);
const spec=JSON.parse(fs.readFileSync(specFile));
let roots=[],setName,kind,desc,textNames={};
if(step.startsWith('items:')){
  const it=spec.items[+step.split(':')[1]];setName=it.name;kind='item';desc=it.desc||'';
  for(const v of it.variants){const vname=Object.entries(v.props).map(([k,x])=>`${k}=${x}`).join(', ');
    const {p,warnings}=makePlan(v.src,v.bp,vname,{path:v.path,names:v.names,drop:v.drop});p.K=1;p.sw='FIXED';p.sh='HUG';
    if(v.width)p.w=v.width;
    roots.push(p);if(warnings.length)process.stderr.write(vname+': '+warnings.join(' | ')+'\n');
    const tn=[];const w=n=>{if(n.t==='C')return;if(n.t==='T')tn.push(n.pn||null);(n.k||[]).forEach(w);};w(p);textNames[vname]=tn;}
}else{
  setName=spec.name;kind='set';desc=spec.desc||'';
  for(const v of spec.variants){const vname=Object.entries(v.props).map(([k,x])=>`${k}=${x}`).join(', ');
    const {p,warnings}=makePlan(v.src,v.bp,vname,{path:v.path,uses:v.uses,usesAll:v.usesAll,names:v.names,drop:v.drop});p.K=1;p.sw='FIXED';
    roots.push(p);if(warnings.length)process.stderr.write(vname+': '+warnings.join(' | ')+'\n');}
}
// share a text property across variants only when the content matches; otherwise suffix with the breakpoint
{const seen={};roots.forEach((r,ri)=>{const props=r.n.split(', ').map(x=>x.split('='));const other=props.filter(x=>x[0]!=='Breakpoint').map(x=>x[1]);const bpv=(props.find(x=>x[0]==='Breakpoint')||[])[1];const bp=[...other,bpv].filter(Boolean).join(' · ')||('V'+ri);const mine={};
  const w=n=>{if(n.t==='C')return;if(n.t==='T'&&n.pn&&!n.pnx){if(seen[n.pn]!==undefined&&seen[n.pn]!==n.c&&!mine[n.pn]){n.pn=n.pn+' · '+bp;}mine[n.pn]=1;}(n.k||[]).forEach(w);};w(r);
  const w2=n=>{if(n.t==='C')return;if(n.t==='T'&&n.pn&&seen[n.pn]===undefined)seen[n.pn]=n.c;(n.k||[]).forEach(w2);};w2(r);});}
const group=spec.group;
// ---- slim calls using the stored library; externalise big subtrees into stash chunks
const LIMIT=40000;const key=(setName.replace(/[^\w]/g,'')+Date.now().toString(36)).slice(-24);
const calls=[];let ci=0;
const size=o=>JSON.stringify(o).length;
function externalise(rootsArr){
  // repeatedly move the largest kids-array (that fits in one call) out until the main payload fits
  while(size(rootsArr)>LIMIT){
    const cands=[];
    const walk=(n)=>{if(n&&n.k&&n.k.length&&!n.k.$stash){cands.push(n);n.k.forEach(walk);}};
    rootsArr.forEach(walk);
    cands.sort((a,b)=>size(b.k)-size(a.k));
    const pick=cands.find(c=>size(c.k)<=LIMIT)||cands[cands.length-1];
    if(!pick)break;
    if(size(pick.k)>LIMIT){ // split kids list into several stashes
      const parts=[];let cur=[];for(const k of pick.k){if(size(cur)+size(k)>LIMIT&&cur.length){parts.push(cur);cur=[];}cur.push(k);}if(cur.length)parts.push(cur);
      pick.k=parts.map(p=>{const id=key+'_'+(ci++);calls.push({stash:id,data:p});return {$stash:id};});pick.kspread=1;
    }else{const id=key+'_'+(ci++);calls.push({stash:id,data:pick.k});pick.k={$stash:id};}
  }
}
externalise(roots);
const LOAD='const lib=await eval("("+figma.root.getSharedPluginData("cpbuild","lib")+")")(figma);\n';
const files=[];
calls.forEach((c,i)=>{const code=LOAD+`return lib.stash(${JSON.stringify(c.stash)},0,JSON.stringify(${JSON.stringify(c.data)}));`;files.push(code);});
const RES=`const R=n=>{if(!n)return n;if(n.$stash)return JSON.parse(lib.stashGet(n.$stash));if(n.k&&n.k.$stash)n.k=JSON.parse(lib.stashGet(n.k.$stash));if(n.kspread)n.k=n.k.flatMap(x=>x&&x.$stash?JSON.parse(lib.stashGet(x.$stash)):[x]);if(Array.isArray(n.k))n.k=n.k.map(R);return n;};\n`;
const final=LOAD+(calls.length?RES:'')+`const ROOTS=${JSON.stringify(roots)};\nconst {out,set}=await lib.buildSet({ROOTS:${calls.length?'ROOTS.map(R)':'ROOTS'},GROUP:${JSON.stringify(group)},SETNAME:${JSON.stringify(setName)},DESC:${JSON.stringify(desc)}});\n`+(calls.length?`for(const c of ${JSON.stringify(calls.map(c=>c.stash))})lib.stashClear(c);\n`:'')+`await set.screenshot({scale:0.4});\nreturn out;`;
if(spec.iconSwap||(step.startsWith('items:')&&spec.items[+step.split(':')[1]].iconSwap)){
  files[files.length]=null; // placeholder removed below
  files.pop();
  const post=`\n// Icon instance-swap property\n{const icons=[];for(const c of set.children)for(const i of c.findAllWithCriteria({types:['INSTANCE']}))if(i.name.startsWith('Icon / ')&&i.parent&&!i.parent.type.includes('INSTANCE'))icons.push(i);\nif(icons.length){const def=icons[0].mainComponent.id;const key=set.addComponentProperty('Icon','INSTANCE_SWAP',def);for(const i of icons)i.componentPropertyReferences={...i.componentPropertyReferences,mainComponent:key};out.props.push('Icon');}}\n`;
  files.push(final.replace('await set.screenshot',post+'await set.screenshot'));
} else files.push(final);
files.forEach((f,i)=>fs.writeFileSync(path.join(__dirname,`out_${i+1}.js`),f));
for(let i=files.length+1;i<20;i++){const f=path.join(__dirname,`out_${i}.js`);if(fs.existsSync(f))fs.unlinkSync(f);}
fs.writeFileSync(path.join(__dirname,'out.meta.json'),JSON.stringify({kind,setName,textNames}));
process.stderr.write(`calls=${files.length} sizes=${files.map(f=>f.length).join(',')}\n`);
