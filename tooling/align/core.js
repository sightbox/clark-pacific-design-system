// ALIGN core. Params injected above: PAGE_ID, BP ('Desktop'|'Mobile'), FROM, TO (section index range), DRY
const pg=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(pg);
const TSl=await figma.getLocalTextStylesAsync();const PSl=await figma.getLocalPaintStylesAsync();const PS=Object.fromEntries(PSl.map(s=>[s.name,s]));
const hex=c=>'#'+[c.r,c.g,c.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('').toUpperCase();
const CMAP={'#FFFFFF@100':'Neutral/White','#004A9F@100':'Primary/Blue','#F0F0F0@100':'Neutral/BG Alt','#52565A@100':'Text/Dark Charcoal','#FF8600@100':'Accent/Orange','#000000@12':'Track/Light','#009663@100':'Sustainability/Green','#FFFFFF@25':'Overlay/On-dark divider','#DEDFE0@100':'Neutral/Border','#52565A@84':'Overlay/Scrim','#FFFFFF@30':'Flagged/On-dark muted','#7F8A92@100':'Neutral/Mid Gray','#FFFFFF@55':'Outline/On-dark','#52565A@28':'Text/Faded','#FFFFFF@38':'Text/Faded on dark','#000000@18':'Flagged/Dot inactive','#FFFFFF@32':'Flagged/Accent line on photo','#003D84@100':'State/Primary Hover','#52565A@12':'State/Hover fill on light','#FFFFFF@12':'State/Hover fill on dark',
  // off-token remaps (reported)
  '#241F20@50':'Overlay/Scrim','#FFFFFF@90':'Neutral/White','#FFFFFF@45':'Text/Faded on dark'};
const REMAPPED=new Set(['#241F20@50','#FFFFFF@90','#FFFFFF@45']);
const W={Thin:100,ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,'Semi Bold':600,Bold:700};
const lhpx=(lh,fs,fam)=>lh.unit==='AUTO'?fs*(fam==='Inter'?1.21:1.5):lh.unit==='PERCENT'?fs*lh.value/100:lh.value;
const lspct=(ls,fs)=>ls.unit==='PIXELS'?ls.value/fs*100:ls.value;
const desktopTiers=new Set(TSl.filter(s=>s.name.startsWith('Desktop/')).map(s=>s.name.split('/')[1]));
function pick(f,fs,lh,ls,tc){let b=null,bd=1e9;
  for(const s of TSl){if(s.fontName.family!==f.family)continue;const [pre,tier]=s.name.split('/');
    let d=Math.abs(s.fontSize-fs)*10+Math.abs((W[s.fontName.style]||400)-(W[f.style]||400))/100*6+(s.textCase===tc?0:8)
      +Math.abs(s.letterSpacing.value-lspct(ls,fs))*0.8+Math.abs(lhpx(s.lineHeight,s.fontSize,f.family)-lhpx(lh,fs,f.family))*0.5;
    if(pre!=='Utility'){const shared=pre==='Mobile'&&!desktopTiers.has(tier);if(!shared&&pre!==BP)d+=3;}
    if(d<bd){bd=d;b=s;}}
  return b;}
const inInst=n=>{let q=n.parent;while(q&&q.type!=='PAGE'){if(q.type==='INSTANCE')return true;q=q.parent;}return false;};
const inLegend=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/^(x|y)-axis-legend$/.test(q.name))return true;q=q.parent;}return false;};
const isStrip=n=>n.type==='FRAME'&&Math.round(n.height)===34&&Math.round(n.width)>=390&&n.findOne(x=>x.type==='TEXT')&&n.findAll(x=>x.type==='TEXT').every(t=>t.fontName!==figma.mixed&&t.fontName.family==='Inter'&&t.fontName.style==='Semi Bold');
const isChip=n=>n.type==='FRAME'&&n.height<=26&&n.children&&n.children.length===1&&n.children[0].type==='TEXT'&&n.children[0].fontName!==figma.mixed&&n.children[0].fontName.family==='Inter'&&n.children[0].fontName.style==='Semi Bold'&&n.children[0].fontSize===11;
const isTag=n=>isStrip(n)||isChip(n);
const isGlyph=s=>!/[A-Za-z0-9]{2,}/.test(s);
const secs=pg.children.slice(FROM,TO);
const R={sections:secs.length,tags:0,texts:0,textLinked:0,textSkip:{},paints:0,paintLinked:0,offColor:{},remapped:{},gradients:0,legendsSkipped:0,glyphs:0};
const fonts=new Set();for(const s of TSl)fonts.add(s.fontName.family+'|'+s.fontName.style);
const jobs=[];
for(const sec of secs){const isComp=/\(Components\)/.test(sec.name);
  // 1 tags (page frames only): hide + rename
  if(!isComp){const seen=new Set();for(const c of sec.findAll(x=>isTag(x))){let q=c.parent,cov=false;while(q&&q!==sec){if(seen.has(q.id)){cov=true;break;}q=q.parent;}if(cov)continue;seen.add(c.id);R.tags++;jobs.push({k:'tag',n:c});}}
  for(const n of sec.findAll(()=>true)){if(inInst(n))continue;if(inLegend(n)){R.legendsSkipped++;continue;}
    let tagAnc=false;{let q=n;while(q&&q!==sec){if(isTag(q)){tagAnc=true;break;}q=q.parent;}}if(tagAnc)continue;
    // paints (non-text)
    if(n.type!=='TEXT'){for(const kind of ['fills','strokes']){if(!(kind in n)||n[kind]===figma.mixed||!n[kind].length)continue;const vis=n[kind].filter(f=>f.visible!==false);
        if(vis.length!==1){if(vis.some(f=>f.type!=='SOLID'))R.gradients++;continue;}const f=vis[0];if(f.type!=='SOLID'){R.gradients++;continue;}
        R.paints++;const key=hex(f.color)+'@'+Math.round((f.opacity??1)*100);const st=CMAP[key];
        if(key.endsWith('@0')&&kind==='strokes'){jobs.push({k:'clearStroke',n});continue;}
        if(!st){R.offColor[key+' '+kind]=(R.offColor[key+' '+kind]||0)+1;continue;}if(REMAPPED.has(key))R.remapped[key]=(R.remapped[key]||0)+1;
        R.paintLinked++;jobs.push({k:kind,n,st:PS[st]});}}
    else{R.texts++;const segs=n.getStyledTextSegments(['fontName','fontSize','lineHeight','letterSpacing','textCase','fills']);segs.forEach(g=>fonts.add(g.fontName.family+'|'+g.fontName.style));
      const m=segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a);const glyph=isGlyph(n.characters);
      // fills per segment
      const fj=[];let fillOk=true;for(const g of segs){const f=g.fills.filter(x=>x.visible!==false);if(f.length!==1||f[0].type!=='SOLID'){fillOk=false;continue;}const key=hex(f[0].color)+'@'+Math.round((f[0].opacity??1)*100);const st=CMAP[key];if(!st){R.offColor[key+' text']=(R.offColor[key+' text']||0)+1;fillOk=false;continue;}if(REMAPPED.has(key))R.remapped[key]=(R.remapped[key]||0)+1;fj.push([g.start,g.end,PS[st]]);}
      R.paints+=segs.length;R.paintLinked+=fj.length;
      let s=null;if(glyph){R.glyphs++;}else{s=pick(m.fontName,m.fontSize,m.lineHeight,m.letterSpacing,m.textCase);
        const wd=s?Math.abs((W[s.fontName.style]||400)-(W[m.fontName.style]||400)):999;const mixed=new Set(segs.map(g=>g.fontName.style)).size>1;
        const ok=s&&(s.textCase===m.textCase)&&Math.abs(s.fontSize-m.fontSize)<=2&&(mixed||wd<=100);
        if(!ok){const k=`${m.fontName.family[0]} ${m.fontName.style} ${m.fontSize}/${Math.round(lhpx(m.lineHeight,m.fontSize,m.fontName.family))} ${m.textCase[0]} ~${s&&s.name}`;R.textSkip[k]=(R.textSkip[k]||0)+1;s=null;}else R.textLinked++;}
      jobs.push({k:'text',n,s,segs,fj});}}}
if(DRY){const top=(o,k=40)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,k).map(([a,b])=>b+' '+a);return {...R,textSkip:top(R.textSkip),offColor:top(R.offColor)};}
for(const f of fonts){const [family,style]=f.split('|');try{await figma.loadFontAsync({family,style});}catch(e){}}
let done=0,moved=0;const ml=[];
for(const j of jobs){const n=j.n;
  if(j.k==='tag'){n.visible=false;const t=n.findOne(x=>x.type==='TEXT');n.name='Annotation / '+(t?t.characters:'tag');done++;continue;}
  if(j.k==='clearStroke'){n.strokes=[];done++;continue;}
  if(j.k==='fills'){await n.setFillStyleIdAsync(j.st.id);done++;continue;}
  if(j.k==='strokes'){await n.setStrokeStyleIdAsync(j.st.id);done++;continue;}
  if(j.k==='text'){const h0=n.height;
    if(j.s){await n.setTextStyleIdAsync(j.s.id);for(const g of j.segs){if(Math.abs((W[g.fontName.style]||400)-(W[j.s.fontName.style]||400))>100)n.setRangeFontName(g.start,g.end,g.fontName);}
      const main=j.segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a);for(const g of j.segs)if(g!==main&&g.fontSize!==main.fontSize)n.setRangeFontSize(g.start,g.end,g.fontSize);}
    for(const [a,b,st] of j.fj)await n.setRangeFillStyleIdAsync(a,b,st.id);
    if(Math.abs(n.height-h0)>4){moved++;if(ml.length<30)ml.push(n.id+' dh'+Math.round(n.height-h0)+' '+n.textAutoResize);}done++;}}
return {...R,textSkip:Object.keys(R.textSkip).length,offColor:R.offColor,applied:done,textsChangedHeight:moved,movedSample:ml};
