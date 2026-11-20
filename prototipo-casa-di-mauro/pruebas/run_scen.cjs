const H=require('./h.cjs'),{runAll}=require('./scen.cjs');
const W=+process.argv[2]||390,OUT=process.argv[3]||'scen_out.json',SH=process.argv[4]==='shots';
(async()=>{const b=await H.launch();const res={};
for(const lang of ['es','en','pt']){const p=await H.newPage(b,{lang,w:W,h:W===360?780:844});
  try{res[lang]=await runAll(p,lang,{shots:SH})}catch(e){console.log('FALLO',lang,e.message.split('\n').slice(0,4).join(' | '));res[lang]={steps:[],amts:{}}}
  res[lang].errs=p.errs;res[lang].faltan=await p.evaluate(()=>window.__faltan).catch(()=>[]);}
require('fs').writeFileSync(OUT,JSON.stringify(res));
for(const l of ['es','en','pt']){const ov=res[l].steps.filter(s=>s.ov&&s.ov.o>0).map(s=>s.name+':'+s.ov.o+' '+s.ov.who);console.log(W,l,'pasos',res[l].steps.length,'errs',res[l].errs,'faltan',res[l].faltan,'overflow',ov)}
await b.close()})()
