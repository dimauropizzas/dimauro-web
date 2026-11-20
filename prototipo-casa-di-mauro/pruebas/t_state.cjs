const H=require('./h.cjs');
(async()=>{const b=await H.launch();let ok=true;const chk=(n,c,d)=>{console.log((c?'OK  ':'FALLA ')+n+(d?' · '+d:''));if(!c)ok=false};
const txt=(p,s)=>p.evaluate(s=>{const e=document.querySelector(s);return e?e.innerText:''},s);
// ---------- Habitaciones + checkout abierto
{const p=await H.newPage(b,{lang:'es'});await H.go(p,'es','#alojamiento');await H.closePop(p);
 await p.fill('#ci','2026-12-10');await p.fill('#co','2026-12-13');await p.selectOption('#pp','4');await p.dispatchEvent('#co','change');
 await p.click('#rooms .stp[data-r="m"] .mas');await p.click('#rooms .stp[data-r="r"] .mas');
 await p.click('#rsv');await p.selectOption('#gq','4');await p.selectOption('.dl[data-d="2026-12-10"]','b');await p.selectOption('.dc[data-d="2026-12-10"]','c');
 await p.fill('#gn','Ana Test');await p.fill('#gm','ana@x.cl');await p.fill('#gw','+5691111');
 const a0=H.amounts(await txt(p,'#mbox')),sel0=await p.evaluate(()=>JSON.stringify(S.sel));
 for(const l of ['en','pt','es']){
  await p.evaluate(l=>setLang(l),l);await p.waitForTimeout(150);
  const open=await p.evaluate(()=>!document.getElementById('modal').hidden);
  const a=H.amounts(await txt(p,'#mbox')),vals=await p.evaluate(()=>[gn.value,gm.value,gw.value,gq.value,document.querySelector('.dl[data-d="2026-12-10"]').value,document.querySelector('.dc[data-d="2026-12-10"]').value,JSON.stringify(S.sel),document.documentElement.lang]);
  chk('checkout abierto sobrevive a '+l,open&&JSON.stringify(a)===JSON.stringify(a0)&&vals[0]==='Ana Test'&&vals[1]==='ana@x.cl'&&vals[2]==='+5691111'&&vals[3]==='4'&&vals[4]==='b'&&vals[5]==='c'&&vals[6]===sel0&&vals[7]===l,JSON.stringify(vals)+' '+a.length+' montos');}
 await p.evaluate(()=>closeModal());
 await p.click('#tools [data-lang="pt"]');
 const q=await p.evaluate(()=>[...document.querySelectorAll('#rooms .stp .q')].map(x=>x.textContent).join(','));const bar=await txt(p,'#rooms .sbar');
 chk('selección de habitaciones y barra intactas en pt',q==='1,1'&&/CLP/.test(bar)&&/combina/i.test(bar),q+' | '+bar.replace(/\s+/g,' ').slice(0,90));
 chk('URL ?lang=pt y localStorage',/lang=pt/.test(p.url())&&await p.evaluate(()=>localStorage.getItem('cdm_lang'))==='pt',p.url().slice(-40));
 const hl=await p.evaluate(()=>[document.documentElement.lang,document.title,document.querySelector('meta[name=description]').content,[...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l=>l.hreflang).join(',')]);
 chk('html lang, title, description, hreflang',hl[0]==='pt'&&/Pousada/.test(hl[1])&&/Pousada/.test(hl[2])&&hl[3]==='es,en,pt-BR,x-default',hl.join(' | ').slice(0,200));
 chk('sin errores',p.errs.length===0,p.errs.join('|'));await p.context().close()}
// ---------- Grupos
{const p=await H.newPage(b,{lang:'es'});await H.go(p,'es','#grupos');await H.closePop(p);
 await p.fill('#gpv','20');await p.dispatchEvent('#gpv','input');await p.dispatchEvent('#gpv','change');
 await p.click('#gcal button[data-d="2026-12-07"]');await p.click('#gcal button[data-d="2026-12-10"]');await p.click('input[name="gpl"][value="c"]');
 await p.click('.evpick >> nth=1');await p.click('#gver');await p.click('.evdia >> nth=3');await p.click('.evb >> nth=0');
 const st=()=>p.evaluate(()=>JSON.stringify([G.p,G.f,G.o,G.pl,G.e,G.ev,G.cur,G.day,G.modo,G.m]));
 const s0=await st(),am0=H.amounts(await txt(p,'#gbar')+' '+await txt(p,'#gevb'));
 await p.click('#tools [data-lang="en"]');await p.waitForTimeout(200);
 const s1=await st(),am1=H.amounts(await txt(p,'#gbar')+' '+await txt(p,'#gevb'));
 chk('Grupos: estado y totales intactos al pasar a en',s0===s1&&JSON.stringify(am0)===JSON.stringify(am1),am1.join(','));
 await p.click('#gcot');await p.fill('#gn','Colegio X');await p.evaluate(()=>setLang('pt'));
 chk('Grupos: resumen abierto conserva lo escrito en pt',await p.evaluate(()=>!document.getElementById('modal').hidden&&gn.value==='Colegio X'),'');
 chk('Grupos: lista de experiencias y texto en pt',/Pizza Libre/.test(await txt(p,'#exps'))&&/pessoa/.test(await txt(p,'#exps')),'');
 await p.evaluate(()=>closeModal());
 await p.fill('#gpv','200');await p.dispatchEvent('#gpv','input');const m1=await txt(p,'#gtope');await p.click('#tools [data-lang="es"]');const m2=await txt(p,'#gtope');
 chk('Grupos: aviso de tope se re-traduce',/capacidades|capacidad/i.test(m2)&&/capacidade/i.test(m1),m1.slice(0,50)+' -> '+m2.slice(0,50));
 chk('sin errores',p.errs.length===0,p.errs.join('|'));await p.context().close()}
// ---------- Romántica, aventura, escapada, chat
{const p=await H.newPage(b,{lang:'es'});await H.go(p,'es','#alojamiento');await H.closePop(p);
 await p.click('.tab[data-tab="esc"]');await p.click('.et[data-k="rom"]');await p.click('#rcalc .cg button[data-d="2026-12-18"]');await p.click('#rst .mas');
 const r0=H.amounts(await txt(p,'#rbar'));await p.click('#tools [data-lang="en"]');
 const r1=H.amounts(await txt(p,'#rbar')),rs=await p.evaluate(()=>[R.f,R.n,!document.getElementById('rpanel').hidden]);
 chk('Romántica: fecha, habitaciones y total intactos',JSON.stringify(r0)===JSON.stringify(r1)&&rs[0]==='2026-12-18'&&rs[1]===2&&rs[2],r1.join(',')+' '+(await txt(p,'#rbar')).replace(/\s+/g,' ').slice(0,80));
 await p.click('#rback');await p.evaluate(()=>openAdv());await p.click('#acal button[data-d="2026-12-07"]');await p.click('#acal button[data-d="2026-12-10"]');
 await p.click('#arooms .stp[data-r="m"] .mas');await p.selectOption('#agq','2');await p.click('.mstp[data-k="mp"] .mas');
 const a0=H.amounts(await txt(p,'#abar'));await p.click('#tools [data-lang="pt"]');const a1=H.amounts(await txt(p,'#abar'));
 const as=await p.evaluate(()=>[A.f,A.o,AB.g,AB.mp,S.sel.m,document.getElementById('agq').value]);
 chk('Aventura: fechas, habitación, personas y media pensión intactas',JSON.stringify(a0)===JSON.stringify(a1)&&as.join()==='2026-12-07,2026-12-10,2,1,1,2',as.join()+' '+a1);
 await p.click('#aback');await p.click('.et[data-k="ny"]');await p.click('#erooms .stp[data-r="m"] .mas');await p.click('#tools [data-lang="en"]');
 chk('Escapada Año Nuevo: panel y selección intactos',await p.evaluate(()=>!document.getElementById('epanel').hidden&&S.sel.m===1&&/New Year/.test(document.getElementById('etit').textContent)&&/New Year/.test(document.querySelector('#einc').innerText)),await txt(p,'#etit'));
 await p.click('#cb');await p.click('#cq button:nth-child(1)');await p.click('#cq button:nth-child(4)');await p.click('#tools [data-lang="es"]').catch(()=>{});
 await p.evaluate(()=>setLang('pt'));
 const ch=await p.evaluate(()=>[document.querySelectorAll('#cm .me').length,document.getElementById('cm').innerText.slice(0,160),document.getElementById('chat').dataset.lang,decodeURIComponent(document.getElementById('cwa').href)]);
 chk('Rayén: 2 preguntas conservadas, saludo y mensaje WhatsApp en pt, data-lang',ch[0]===2&&/Rayén/.test(ch[1])&&/Quantos|Onde/.test(ch[1])&&ch[2]==='pt'&&/portugu/i.test(ch[3]),ch.join(' | ').replace(/\n/g,' '));
 chk('sin errores',p.errs.length===0,p.errs.join('|'));await p.context().close()}
// ---------- Idioma inicial
async function langWith(opts,url,pre){const ctx=await b.newContext({locale:opts.locale||'en-US',viewport:{width:390,height:800}});const p=await ctx.newPage();if(pre)await p.addInitScript(pre);await p.route('**/mindicador.cl/**',r=>r.abort());await p.route('https://fonts.googleapis.com/**',r=>r.abort());const er=[];p.on('pageerror',e=>er.push(e.message));
 await p.goto(url);await p.waitForTimeout(400);const l=await p.evaluate(()=>document.documentElement.lang);await ctx.close();return [l,er]}
const U=H.URL0;
chk('navigator pt-BR sin nada -> pt',(await langWith({locale:'pt-BR'},U))[0]==='pt');
chk('navigator en-GB -> en',(await langWith({locale:'en-GB'},U))[0]==='en');
chk('navigator es-CL -> es',(await langWith({locale:'es-CL'},U))[0]==='es');
chk('navigator fr-FR -> es (por defecto)',(await langWith({locale:'fr-FR'},U))[0]==='es');
chk('?lang=en gana a navigator pt',(await langWith({locale:'pt-BR'},U+'?lang=en'))[0]==='en');
chk('localStorage gana a navigator',(await langWith({locale:'pt-BR'},U,"try{localStorage.setItem('cdm_lang','en')}catch(e){}"))[0]==='en');
chk('?lang gana a localStorage',(await langWith({locale:'pt-BR'},U+'?lang=es',"try{localStorage.setItem('cdm_lang','en')}catch(e){}"))[0]==='es');
const bl=await langWith({locale:'pt-BR'},U,"Storage.prototype.getItem=function(){throw new Error('bloqueado')};Storage.prototype.setItem=function(){throw new Error('bloqueado')}");
chk('localStorage bloqueado: funciona (navigator pt) y sin errores',bl[0]==='pt'&&bl[1].length===0,bl[1].join('|'));
{const p=await H.newPage(b,{lang:'es'});await p.addInitScript("Storage.prototype.getItem=function(){throw new Error('bloqueado')};Storage.prototype.setItem=function(){throw new Error('bloqueado')}");await H.go(p,'es','#alojamiento','&cur=usd');await H.closePop(p);await p.click('#tools [data-lang="en"]');await p.evaluate(()=>setCur('CLP'));
 chk('localStorage bloqueado: selector de idioma y moneda siguen operando',await p.evaluate(()=>document.documentElement.lang==='en'&&CUR==='CLP')&&p.errs.length===0,p.errs.join('|'));await p.context().close()}
console.log(ok?'ESTADO/IDIOMA: TODO OK':'ESTADO/IDIOMA: HAY FALLAS');await b.close()})()
