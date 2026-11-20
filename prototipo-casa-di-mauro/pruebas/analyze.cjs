const H=require('./h.cjs');const r=JSON.parse(require('fs').readFileSync(''+(process.argv[2]||'scen_out.json')+''));
for(const lang of ['en','pt']){const seen=new Map();
 for(const st of r[lang].steps)for(const [k,s] of st.strings){const h=H.spanishHits(lang,s);if(h.length){const key=s;if(!seen.has(key))seen.set(key,{h,step:st.name,k})}}
 console.log('=== '+lang+' hits:',seen.size);for(const [s,v] of seen)console.log(v.step,'|',v.k,'|',v.h.join(','),'|',s.slice(0,140));}
const keys=Object.keys(r.es.amts);let ok=true;
for(const k of keys){const a=JSON.stringify(r.es.amts[k]),b=JSON.stringify(r.en.amts[k]),c=JSON.stringify(r.pt.amts[k]);const same=a===b&&a===c;if(!same)ok=false;console.log(k,same?'IGUAL':'DIFERENTE',a.slice(0,90),same?'':b+' '+c)}
console.log('calculos identicos',ok);
