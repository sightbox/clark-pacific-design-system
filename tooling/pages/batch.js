// node batch.js <desk|mob> file1.html file2.html ... -> batch_<bp>_<n>.js (≤45KB each)
const fs=require('fs'),path=require('path');const [bp,...files]=process.argv.slice(2);
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'titles.json')));
const iconIds=Object.values(JSON.parse(fs.readFileSync(path.join(__dirname,'..','registry.json'))).icons);
const specOf=file=>{const M=JSON.parse(fs.readFileSync(path.join(__dirname,'..','ex/match',bp,file.replace('.html','.json'))));
  const title=(bp==='desk'?'Desktop / ':'Mobile / ')+(names[file]||file.replace('.html','').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()));
  return {file,title,bp:bp==='desk'?'Desktop':'Mobile',refPage:bp==='desk'?'2:4':'2:5',outPage:bp==='desk'?'81:2':'81:3',width:bp==='desk'?1440:390,
    sections:M.sections.map(s=>({tag:s.tag,kind:s.kind,top:s.top,h:s.h,pieces:(s.pieces||[]).map(p=>({id:p.id,set:p.set,variant:p.variant,overlay:p.overlay,texts:p.texts,icons:p.icons&&p.icons.length?p.icons:undefined}))}))};};
// shared text dictionary: whole piece-text arrays and 8-item nav prefixes that repeat across all pages of this bp
const ALL=fs.readFileSync(path.join(__dirname,'order.txt'),'utf8').split(/\s+/).filter(Boolean).map(specOf);
const cnt={};const bump=a=>{const k=JSON.stringify(a);cnt[k]=(cnt[k]||0)+1;};
for(const S of ALL)for(const sec of S.sections)for(const p of sec.pieces)if(p.texts){bump(p.texts);if(p.texts.length>8)bump(p.texts.slice(0,8));}
const DICT=Object.entries(cnt).filter(([k,v])=>v>=3&&k.length>200).sort((a,b)=>b[0].length-a[0].length).map(([k])=>JSON.parse(k));
const DK=DICT.map(a=>JSON.stringify(a));
fs.writeFileSync(path.join(__dirname,'dict_'+bp+'.js'),`figma.root.setSharedPluginData('cpbuild','dict_${bp}',${JSON.stringify(JSON.stringify(DICT))});return {entries:${DICT.length}};`);
const SETS=JSON.parse(fs.readFileSync(path.join(__dirname,'..','sets.json')));
const SO=(()=>{for(const S of ALL)for(const sec of S.sections)for(const p of sec.pieces)if(p.set==='Brand Sign-off Band')return p;})();
const pack=specs=>JSON.parse(JSON.stringify(specs)).map(S=>{for(const sec of S.sections)for(const p of sec.pieces)if(p.texts){
  {const m=/Hero \/ (.+)$/.exec(sec.tag);const HV=SETS.Hero||{};const v=m&&'Type='+m[1]+', Breakpoint='+S.bp;if(p.set==='Hero'&&v&&HV[v]&&p.variant!==v){p.id=HV[v];p.variant=v;}}
  if(SO&&p.set!==SO.set&&JSON.stringify(p.texts)===JSON.stringify(SO.texts)){p.id=SO.id;p.set=SO.set;p.variant=SO.variant;sec.tag='Brand Sign-off Band';}const k=DK.indexOf(JSON.stringify(p.texts));
  if(k>=0){p.texts=['@'+k];continue;}const k8=p.texts.length>8?DK.indexOf(JSON.stringify(p.texts.slice(0,8))):-1;if(k8>=0)p.texts=['@'+k8,...p.texts.slice(8)];}return S;});
const wrap=specs=>`const ICONS=${JSON.stringify(iconIds)};const DICT=JSON.parse(figma.root.getSharedPluginData('cpbuild','dict_${bp}'));const SPECS=${JSON.stringify(pack(specs))};
for(const S of SPECS)for(const sec of S.sections)for(const p of sec.pieces)if(p.texts)p.texts=p.texts.flatMap(x=>typeof x==='string'&&x[0]==='@'?DICT[+x.slice(1)]:[x]);
const rt=eval("(async function(SPEC){"+figma.root.getSharedPluginData("cpbuild","pagert")+"})");
const out=await figma.getNodeByIdAsync(SPECS[0].outPage);await out.loadAsync();const res=[];
for(const S of SPECS){S.iconIds=ICONS;for(const n of [...out.children])if(n.name===S.title||n.name==='Build notes / '+S.title)n.remove();
  try{const r=await rt(S);res.push(S.title+' h'+r.height+' :: '+r.report.filter(x=>!/unplaced 0 \\|  \\|/.test(x)||/poor fit/.test(x)).map(x=>/poor fit/.test(x)?'FALLBACK '+x.split(' | ').slice(0,2).join(' | ').slice(0,160):x.split(' | ').filter((_,i)=>i!==1).join(' | ')).join(' ;; '));}catch(e){res.push(S.title+' FAILED '+e.message);}}
return res;`;
let cur=[],n=0;const outFiles=[];
const flush=()=>{if(!cur.length)return;const f=path.join(__dirname,`batch_${bp}_${++n}.js`);fs.writeFileSync(f,wrap(cur));outFiles.push(path.basename(f)+' '+cur.map(s=>s.file).join(',')+' '+fs.statSync(f).size);cur=[];};
for(const f of files){const s=specOf(f);if(cur.length&&wrap([...cur,s]).length>(+process.env.LIMIT||45000))flush();cur.push(s);}flush();
console.log(outFiles.join('\n'));
