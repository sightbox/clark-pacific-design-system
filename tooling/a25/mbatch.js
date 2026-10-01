// Packs Breakpoint=Mobile builds for plain 2.5 components into use_figma calls (needs sharedPluginData a25/mob, see a25/mob.js).
// Usage (from tooling/): CP_REG=registry.json LIMIT=45000 node a25/mbatch.js <outdir> [id ...]
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const T=path.join(__dirname,'..');const out=process.argv[2];let ids=process.argv.slice(3);
const man=JSON.parse(fs.readFileSync(path.join(T,'../handoff/manifest.json'))).additions25.components;
const skip=(process.env.SKIP||'').split(',').filter(Boolean);
if(!ids.length)ids=man.map(c=>c.id).filter(i=>!skip.includes(i));
const LIMIT=+(process.env.LIMIT||45000);
const head="const M=await (eval('('+figma.root.getSharedPluginData('a25','mob')+')'))(figma);const R=[];\n";
let cur=[],size=head.length,n=0;const files=[];fs.mkdirSync(out,{recursive:true});
const flush=()=>{if(!cur.length)return;const f=path.join(out,`m${String(++n).padStart(2,'0')}.js`);fs.writeFileSync(f,head+cur.join('')+"return R;");files.push([f,cur.length,size]);cur=[];size=head.length;};
for(const id of ids){
  const c=execFileSync('node',[path.join(__dirname,'build.js'),id],{cwd:T,env:{...process.env,CP_BP:'Mobile'},stdio:['ignore','pipe','ignore']}).toString();
  const plan=c.match(/^const PLAN=(.*);$/m)[1];const name=man.find(m=>m.id===id).name;
  const part=`try{R.push(await M.addPlain(${plan},${JSON.stringify(name)}));}catch(e){R.push({err:${JSON.stringify(id)}+': '+e.message});}\n`;
  if(size+part.length>LIMIT)flush();cur.push(part);size+=part.length;}
flush();for(const [f,k,s] of files)console.log(path.basename(f),k,s);
