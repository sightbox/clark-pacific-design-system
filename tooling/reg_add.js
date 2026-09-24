// node reg_add.js item|set <name> '<json result>'  — records built sets into registry.json (textNames from out.meta.json)
const fs=require('fs');const R=JSON.parse(fs.readFileSync('registry.json'));const [kind,name,res]=process.argv.slice(2);const r=JSON.parse(res);
const meta=JSON.parse(fs.readFileSync('out.meta.json'));
if(kind==='item'){R.items=R.items||{};R.items[name]={id:r.set,variants:r.variants,textNames:meta.textNames,iconSwap:(r.props||[]).includes('Icon')};}
else{R.built=R.built||{};R.built[name]={id:r.set,variants:r.variants,props:r.props};}
fs.writeFileSync('registry.json',JSON.stringify(R));console.log('ok',Object.keys(R.items||{}),Object.keys(R.built||{}));
