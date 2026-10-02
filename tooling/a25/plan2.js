// Plan a 2.0 kit artboard (extracted by a25/extract-mobile.js with KIT=desktop-kit.html) as a Mobile variant.
// Usage (from tooling/): CP_REG=registry.json node a25/plan2.js <ex-json> > plan.json
process.env.CP_REG = process.env.CP_REG || 'registry.json';
process.env.CP_FLAG_PREFIX = process.env.CP_FLAG_PREFIX || 'Flagged/2.5';
const fs = require('fs'); const { plan } = require('../planner');
const tree = JSON.parse(fs.readFileSync(process.argv[2]));
const { plan: p, warnings } = plan(tree, { bp: 'Mobile', name: 'Mobile' });
(function fix(n) { if (n.t === 'T' && n.ff && !['Poppins', 'Inter'].includes(n.ff)) { n.ff = 'Inter'; n.fw = 400; n.s = 'Utility/Placeholder Caption'; } if (n.t === 'C' && n.icon) { if (!n.col || /#000000 100%$/.test(n.col)) n.col = 'Text/Dark Charcoal'; if (!n.stw) delete n.stw; } (n.k || []).forEach(fix); })(p);
process.stdout.write(JSON.stringify(p));
process.stderr.write('warnings=' + JSON.stringify(warnings).slice(0, 400) + '\n');
