// Emits a use_figma prelude that syncs the stored converter with a25/lib25.js via in-place string patches.
// Usage: node a25/patch.js '<old>' '<new>'  (or with no args: full re-store check by length)
const fs=require('fs'),path=require('path');const lib=fs.readFileSync(path.join(__dirname,'lib25.js'),'utf8');
const [o,n]=process.argv.slice(2);
process.stdout.write(`{let L=figma.root.getSharedPluginData('a25','lib');const o=${JSON.stringify(o)},n=${JSON.stringify(n)};if(L.includes(o)&&!L.includes(n)){L=L.replace(o,n);figma.root.setSharedPluginData('a25','lib',L);}if(L.length!==${lib.length})throw new Error('stored lib out of sync: '+L.length+' vs ${lib.length}');}\n`);
