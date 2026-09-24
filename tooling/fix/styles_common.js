const page=figma.root.children.find(p=>p.name.startsWith('02'));await figma.setCurrentPageAsync(page);
const TS=await figma.getLocalTextStylesAsync();
const W={Thin:100,ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,'Semi Bold':600,Bold:700};
const lhpx=(lh,fs,fam)=>lh.unit==='AUTO'?fs*(fam==='Inter'?1.21:1.5):lh.unit==='PERCENT'?fs*lh.value/100:lh.value;
const desktopTiers=new Set(TS.filter(s=>s.name.startsWith('Desktop/')).map(s=>s.name.split('/')[1]));
function pick(f,fs,lh,ls,tc,bp){let b=null,bd=1e9;
  for(const s of TS){if(s.fontName.family!==f.family)continue;const [pre,tier]=s.name.split('/');
    let d=Math.abs(s.fontSize-fs)*10+Math.abs((W[s.fontName.style]||400)-(W[f.style]||400))/100*6+(s.textCase===tc?0:8)
      +Math.abs(s.letterSpacing.value-ls.value)*0.8+Math.abs(lhpx(s.lineHeight,s.fontSize,f.family)-lhpx(lh,fs,f.family))*0.5;
    if(pre!=='Utility'){const shared=pre==='Mobile'&&!desktopTiers.has(tier);if(!shared&&pre!==bp)d+=3;}
    if(d<bd){bd=d;b=s;}}
  return {s:b,d:bd};}
const inInstance=n=>{let p=n.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return true;p=p.parent;}return false;};
const bpOf=n=>{let p=n;while(p&&p.type!=='PAGE'){if(p.type==='COMPONENT'&&/Breakpoint=Mobile/.test(p.name))return 'Mobile';if(p.type==='COMPONENT'&&/Breakpoint=Desktop/.test(p.name))return 'Desktop';p=p.parent;}return 'Desktop';};
function mainSeg(n){const segs=n.getStyledTextSegments(['fontName','fontSize','lineHeight','letterSpacing','textCase']);return {segs,m:segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a)};}
