// node gen.js <desk|mob> <file.html> -> pages/call_<bp>_<name>.js
const fs=require('fs'),path=require('path');const [bp,file]=process.argv.slice(2);
const M=JSON.parse(fs.readFileSync(path.join(__dirname,'..','ex/match',bp,file.replace('.html','.json'))));
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'..','..','..','..','..','..','..','dev','null').replace(/.*/,path.join(__dirname,'titles.json'))).toString()||'{}');
const title=(bp==='desk'?'Desktop / ':'Mobile / ')+(names[file]||file.replace('.html','').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()));
const sections=M.sections.map(s=>({tag:s.tag,kind:s.kind,top:s.top,h:s.h,pieces:(s.pieces||[]).map(p=>({id:p.id,set:p.set,variant:p.variant,overlay:p.overlay,texts:p.texts,icons:p.icons}))}));
const iconIds=Object.values(JSON.parse(fs.readFileSync(path.join(__dirname,'..','registry.json'))).icons);
const SPEC={iconIds,file,title,bp:bp==='desk'?'Desktop':'Mobile',refPage:bp==='desk'?'2:4':'2:5',outPage:bp==='desk'?'81:2':'81:3',width:bp==='desk'?1440:390,sections};
const code='const SPEC='+JSON.stringify(SPEC)+';\nconst rt=eval("(async function(SPEC){"+figma.root.getSharedPluginData("cpbuild","pagert")+"})");\nreturn await rt(SPEC);';
const out=path.join(__dirname,`call_${bp}_${file.replace('.html','')}.js`);fs.writeFileSync(out,code);console.log(out,code.length);
