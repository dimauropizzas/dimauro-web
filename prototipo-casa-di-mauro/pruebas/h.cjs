const {chromium}=require('playwright');
const URL0=process.env.CDM_URL||'file://'+require('path').resolve(__dirname,'../index.html');
const EXC=['casa di mauro','di mauro pizzas','di mauro','licán ray','coñaripe','camino a coñaripe','rayén','casino party','pizza libre','pizza party','parrillada party','playa ensenada','khipu','atiende.tech','atiende','whatsapp','instagram','@casadimaurolicanray','español','português','choripán','sopaipillas','brunch','pizzas'];
const ES_EN=['la','el','de','con','para','personas','persona','noches','noche','reserva','reservas','reservar','desde','hasta','tu','tus','abono','saldo','pago','pagar','los','las','del','una','por','que','habitación','habitaciones','desayuno','llegada','salida','cena','almuerzo','niños','cerrar','volver','inicio','elige','elegir','alojamiento','escapada','escapadas','precio','fecha','fechas','día','días','semana','mismo','también','cómo','dónde','cuántas','sin','más','menos','hostal','grupo','grupos','delegaciones','experiencia','experiencias','incluye','disponible','disponibilidad'];
const ES_PT=['el','con','personas','persona','noches','noche','hasta','tus','abono','pago','los','del','una','habitación','habitaciones','desayuno','llegada','salida','cena','almuerzo','niños','cerrar','volver','elige','elegir','alojamiento','fecha','fechas','día','días','mismo','también','cómo','dónde','cuántas','sin','más','hostal','delegaciones','incluye','disponibilidad','usted','esas','esos','estas','cuando','donde'];
function spanishHits(lang,str){
  let s=' '+str.toLowerCase()+' ';
  EXC.forEach(e=>{s=s.split(e).join(' ')});
  const hits=[];
  if(/[¿¡ñ]/.test(s))hits.push('char:'+(s.match(/[¿¡ñ]/)[0]));
  const words=s.split(/[^a-záéíóúüñ]+/).filter(Boolean);
  const list=lang==='en'?ES_EN:ES_PT;
  for(const w of words){if(list.includes(w))hits.push(w);if(/ción$|ciones$/.test(w))hits.push(w)}
  // pt: sin 'ção' ok. 'tu' como palabra suelta no se mira en pt (válido como pronombre raro) -> se quitó arriba si hace falta
  return [...new Set(hits)];
}
async function launch(){return chromium.launch()}
async function newPage(b,{lang='es',w=390,h=844,mobile=true,cur,storage,fxRoute}={}){
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,locale:'en-US'});
  const p=await ctx.newPage();p.errs=[];p.reqs=[];
  p.on('pageerror',e=>p.errs.push('pageerror:'+e.message));
  p.on('console',m=>{if(m.type()==='error'){const tx=m.text();if(!/Failed to load resource/.test(tx))p.errs.push('console:'+tx)}});
  await p.route('**/mindicador.cl/**',r=>{p.reqs.push('mindicador');fxRoute?fxRoute(r):r.abort()});
  await p.route('https://fonts.googleapis.com/**',r=>r.abort());
  return p}
async function go(p,lang,hash,extra=''){await p.goto(URL0+'?lang='+lang+extra+(hash||''));await p.waitForTimeout(700)}
async function closePop(p){await p.evaluate(()=>{var x=document.getElementById('pop');if(x)x.hidden=true;document.body.style.overflow=''})}
async function collect(p){return p.evaluate(()=>{
  const out=[];
  const vis=e=>{for(let n=e;n&&n!==document.documentElement;n=n.parentElement){const cs=getComputedStyle(n);if(cs.display==='none'||cs.visibility==='hidden'||n.hidden)return false}return true};
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){const tx=n.nodeValue.replace(/\s+/g,' ').trim();if(!tx)continue;const q=n.parentElement;if(!q||['SCRIPT','STYLE','NOSCRIPT'].includes(q.tagName))continue;if(!vis(q))continue;out.push(['text',tx])}
  document.querySelectorAll('[aria-label],[title],[placeholder],img[alt]').forEach(e=>{if(!vis(e))return;['aria-label','title','placeholder','alt'].forEach(a=>{const v=e.getAttribute(a);if(v&&v.trim())out.push([a,v.trim()])})});
  out.push(['doc','title:'+document.title]);const md=document.querySelector('meta[name=description]');if(md)out.push(['doc','desc:'+md.content]);
  return out})}
const amounts=txt=>{const r=[];const re=/(?<!US)(?:CLP )?\$\s?([\d.,]+)/g;let m;while(m=re.exec(txt)){r.push(+m[1].replace(/[.,]/g,''))}return r};
module.exports={chromium,URL0,launch,newPage,go,closePop,collect,spanishHits,amounts,EXC};
