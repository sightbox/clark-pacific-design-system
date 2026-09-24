// node mkstore.js "<title to delete>" -> store_rt.js
const fs=require('fs');const title=process.argv[2]||'';
let rt=fs.readFileSync('runtime.js','utf8').split('\n').filter(l=>!/^\s*\/\/ /.test(l)).join('\n');
rt=rt.replace("report:report.map(r=>`${r.tag} | ${r.variant} | unplaced ${r.unplaced.length} | hidden ${r.hidden.length} | items off ${r.hiddenItems.length}`)}","report:report.map(r=>r.tag+' | '+r.variant+' | unplaced '+r.unplaced.length+' | '+r.unplaced.map(u=>u.slice(0,40)).join(' / ')+' | hidden '+r.hidden.length+' | items off '+r.hiddenItems.length)}");
if(rt.includes('`'))throw new Error('backtick');
const code=`const RT=${JSON.stringify(rt)};
new Function('SPEC','figma','return (async()=>{'+RT+'})');
figma.root.setSharedPluginData('cpbuild','pagert',RT);
const T=${JSON.stringify(title)};const del=[];
if(T){for(const pid of ['81:2','81:3']){const pg=await figma.getNodeByIdAsync(pid);await pg.loadAsync();for(const n of [...pg.children])if(n.name===T||n.name==='Build notes / '+T){del.push(n.id);n.remove();}}}
return {stored:RT.length,deleted:del};`;
fs.writeFileSync('store_rt.js',code);console.log(code.length);
