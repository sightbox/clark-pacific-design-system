// Figma 2.5: one use_figma call per addendum component.
// Usage: CP_REG=a25/registry25.json CP_FLAG_PREFIX="Flagged/2.5" node a25/build.js <a25-id> > call.js
// Needs the stored converter (node a25/install.js, run once). Builds the artboard from ex/a25/<id>.json, turns it into a component named exactly as manifest.additions25,
// writes description = intent + behaviour, and places a yellow dev-note frame (plain frame) to its right.
// Re-running replaces the component and note with the same name.
const fs = require('fs'); const path = require('path');
process.env.CP_REG = process.env.CP_REG || path.join(__dirname, 'registry25.json');
process.env.CP_FLAG_PREFIX = process.env.CP_FLAG_PREFIX || 'Flagged/2.5';
const { plan } = require('../planner');
const T = path.join(__dirname, '..');
const id = process.argv[2];
const man = JSON.parse(fs.readFileSync(path.join(T, '../../design_handoff_figma_build/manifest.json'))).additions25.components;
const idx = man.findIndex(c => c.id === id); if (idx < 0) throw new Error('not in manifest: ' + id);
const m = man[idx];
const tree = JSON.parse(fs.readFileSync(path.join(T, 'ex/a25', id + '.json')));
const { plan: p, warnings } = plan(tree, { bp: 'Desktop', name: m.name });
// icons whose stroke colour/weight sit on the <path>s read as black / 0 from the <svg>: the paths are Dark Charcoal at the icon's own weight
// placeholder captions set in system monospace fonts -> the 2.0 placeholder caption style (Inter)
(function fixFonts(n) { if (n.t === 'T' && n.ff && !['Poppins', 'Inter'].includes(n.ff)) { n.ff = 'Inter'; n.fw = 400; n.s = 'Utility/Placeholder Caption'; } (n.k || []).forEach(fixFonts); })(p);
(function fixIcons(n) { if (n.t === 'C' && n.icon) { if (!n.col || /#000000 100%$/.test(n.col)) n.col = 'Text/Dark Charcoal'; if (!n.stw) delete n.stw; } (n.k || []).forEach(fixIcons); })(p);
const note = { title: m.name, id: m.id, group: m.group, interactive: !!m.interactive, behavior: m.behavior || [], intent: m.intent || '' };
const code = `const PLAN=${JSON.stringify(p)};\nconst NOTE=${JSON.stringify(note)};\nconst L=await (eval('('+figma.root.getSharedPluginData('a25','lib')+')'))(figma);\nreturn await L.make(PLAN,NOTE,${idx});`;
process.stdout.write(code);
process.stderr.write(`chars=${code.length} warnings=${JSON.stringify(warnings)}\n`);
