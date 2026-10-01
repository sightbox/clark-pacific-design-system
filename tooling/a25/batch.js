// Packs many addendum builds into use_figma calls of at most LIMIT bytes.
// Usage: LIMIT=45000 node a25/batch.js <outdir> [id ...]   (no ids = every manifest component except those listed in SKIP)
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const T=path.join(__dirname,'..');const out=process.argv[2];let ids=process.argv.slice(3);
const man=JSON.parse(fs.readFileSync(path.join(T,'../../design_handoff_figma_build/manifest.json'))).additions25.components;
const skip=(process.env.SKIP||'').split(',').filter(Boolean);
if(!ids.length)ids=man.map(c=>c.id).filter(i=>!skip.includes(i));
const LIMIT=+(process.env.LIMIT||45000);
const head="const L=await (eval('('+figma.root.getSharedPluginData('a25','lib')+')'))(figma);const R=[];\n";
let cur=[],size=head.length,n=0;const files=[];
const flush=()=>{if(!cur.length)return;const f=path.join(out,`b${String(++n).padStart(2,'0')}.js`);fs.writeFileSync(f,head+cur.join('')+"return R;");files.push([f,cur.length,size]);cur=[];size=head.length;};
for(const id of ids){
  const c=execFileSync('node',[path.join(__dirname,'build.js'),id],{cwd:T,stdio:['ignore','pipe','ignore']}).toString();
  const plan=c.match(/^const PLAN=(.*);$/m)[1],note=c.match(/^const NOTE=(.*);$/m)[1],idx=c.match(/L\.make\(PLAN,NOTE,(\d+)\)/)[1];
  const part=`try{R.push(await L.make(${plan},${note},${idx}));}catch(e){R.push({err:${JSON.stringify(id)}+': '+e.message});}\n`;
  if(size+part.length>LIMIT)flush();cur.push(part);size+=part.length;}
flush();for(const [f,k,s] of files)console.log(path.basename(f),k,s);
