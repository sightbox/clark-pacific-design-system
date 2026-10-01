// Stores a25/lib25.js in the 2.5 file (sharedPluginData a25/lib). Usage: node a25/install.js > call.js
const fs = require('fs'); const path = require('path');
const lib = fs.readFileSync(path.join(__dirname, 'lib25.js'), 'utf8');
process.stdout.write(`figma.root.setSharedPluginData('a25','lib',${JSON.stringify(lib)});
const L=await (eval('('+figma.root.getSharedPluginData('a25','lib')+')'))(figma);
return {stored:figma.root.getSharedPluginData('a25','lib').length,fns:Object.keys(L)};`);
