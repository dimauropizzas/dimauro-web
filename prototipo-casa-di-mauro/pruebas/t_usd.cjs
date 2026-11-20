const H=require('./h.cjs');
(async()=>{const b=await H.launch();let ok=true;const chk=(n,c,d)=>{console.log((c?'OK  ':'FALLA ')+n+(d?' · '+d:''));if(!c)ok=false};
const room=async(p)=>{await p.fill('#ci','2026-12-10');await p.fill('#co','2026-12-13');await p.selectOption('#pp','4');await p.dispatchEvent('#co','change');await p.click('#rooms .stp[data-r="m"] .mas');await p.click('#rooms .stp[data-r="r"] .mas');await p.click('#rsv');await p.selectOption('#gq','4');await p.selectOption('#dall','cc')};
for(const lang of ['es','en','pt']){
  const p=await H.newPage(b,{lang});
  await H.go(p,lang,'#alojamiento');await H.closePop(p);
  await room(p);
  const clp=H.amounts(await p.evaluate(()=>document.getElementById('mbox').innerText));
  const clpPage=await p.evaluate(()=>document.querySelectorAll('.usd').length);
  await p.evaluate(()=>setCur('USD'));await p.waitForTimeout(300);
  const usd=H.amounts(await p.evaluate(()=>document.getElementById('mbox').innerText));
  const mb=await p.evaluate(()=>document.getElementById('mbox').innerText);
  const n=await p.evaluate(()=>document.querySelectorAll('#mbox .usd').length);
  chk(lang+': CLP no cambia al pasar a USD',JSON.stringify(clp)===JSON.stringify(usd),clp.length+' montos');
  chk(lang+': sin referencia en modo CLP',clpPage===0);
  chk(lang+': referencia ≈ US$ junto a cada monto',n>=clp.length-0,n+' refs / '+clp.length+' montos');
  const note=await p.evaluate(()=>document.querySelector('#mbox .fxn')?.innerText||'');
  const bar=await p.evaluate(()=>{const e=document.getElementById('fxbar');return e.hidden?'':e.innerText});
  chk(lang+': nota CLP en checkout',/CLP/.test(note)&&note.length>40,note.slice(0,110));
  chk(lang+': barra con tipo de cambio 950 (valor fijo)',/950/.test(bar)&&bar.length>40,bar.slice(0,140));
  const sample=await p.evaluate(()=>{const e=document.querySelector('#mbox .usd');return e?e.innerText:''});
  chk(lang+': formato US$',/^≈ US\$ [\d.,]+$/.test(sample.trim()),sample);
  await p.click('#cl');
  // precio por noche hab. matrimonial 48.000 -> 50,53 -> US$ 51
  const pr=await p.evaluate(()=>document.querySelector('#rooms .room .price').innerText.replace(/\s+/g,' '));
  chk(lang+': precio por noche con referencia',/48[.,]000/.test(pr)&&/US\$ 51/.test(pr),pr);
  await p.click('#tools [data-lang="'+(lang==='es'?'en':'es')+'"]');
  const pr2=await p.evaluate(()=>document.querySelector('#rooms .room .price').innerText.replace(/\s+/g,' '));
  chk(lang+': USD se mantiene al cambiar idioma',/US\$ 51/.test(pr2),pr2);
  chk(lang+': sin errores',p.errs.length===0,p.errs.join('|'));
  await p.context().close();
}
// tipo de cambio en vivo (simulado) + caché 6 h + fallback + timeout
{const p=await H.newPage(b,{lang:'en',fxRoute:r=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({serie:[{fecha:'2026-11-20T03:00:00.000Z',valor:900}]})})});
 await H.go(p,'en','#alojamiento','&cur=usd');await H.closePop(p);await p.waitForTimeout(600);
 const pr=await p.evaluate(()=>document.querySelector('#rooms .room .price').innerText.replace(/\s+/g,' '));
 const bar=await p.evaluate(()=>document.getElementById('fxbar').innerText);
 chk('en: tipo de cambio en vivo 900 -> 48.000 = US$ 53',/US\$ 53/.test(pr),pr+' | '+bar);
 chk('en: barra cita mindicador.cl y fecha',/mindicador\.cl/.test(bar)&&/2026/.test(bar),bar);
 const c=await p.evaluate(()=>localStorage.getItem('cdm_fx'));chk('caché localStorage cdm_fx',/900/.test(c||''),c);
 const nreq=p.reqs.length;await p.reload();await p.waitForTimeout(700);
 const pr3=await p.evaluate(()=>document.querySelector('#rooms .room .price')?.innerText.replace(/\s+/g,' ')||'');
 chk('recarga usa caché (sin nueva petición)',p.reqs.length===nreq&&/US\$ 53/.test(pr3),'peticiones '+p.reqs.length+' '+pr3);
 // caché vencida (7 h) -> vuelve a pedir
 await p.evaluate(()=>localStorage.setItem('cdm_fx',JSON.stringify({rate:900,fecha:'2026-11-19',ts:Date.now()-7*36e5})));
 await p.reload();await p.waitForTimeout(800);chk('caché vencida: vuelve a consultar',p.reqs.length>nreq,'peticiones '+p.reqs.length);
 chk('sin errores',p.errs.length===0,p.errs.join('|'));await p.context().close()}
{const p=await H.newPage(b,{lang:'es',fxRoute:r=>{/* nunca responde: timeout corto */}});
 const t0=Date.now();await H.go(p,'es','#alojamiento','&cur=usd');await H.closePop(p);
 await p.waitForFunction(()=>true);await p.waitForTimeout(4500);
 const pr=await p.evaluate(()=>document.querySelector('#rooms .room .price').innerText.replace(/\s+/g,' '));
 const bar=await p.evaluate(()=>document.getElementById('fxbar').innerText);
 chk('es: red colgada -> sigue con 950 (US$ 51) tras el timeout',/US\$ 51/.test(pr)&&/valor fijo/.test(bar),pr+' | '+bar);
 chk('sin errores',p.errs.length===0,p.errs.join('|'));await p.context().close()}
{const p=await H.newPage(b,{lang:'es'});await p.addInitScript("window.CDM_CONFIG={base:'x',key:'',keyExp:'',usdClp:1000}");
 await H.go(p,'es','#alojamiento','&cur=usd');await H.closePop(p);
 const pr=await p.evaluate(()=>document.querySelector('#rooms .room .price').innerText.replace(/\s+/g,' '));
 chk('CDM_CONFIG.usdClp=1000 -> 48.000 = US$ 48',/US\$ 48/.test(pr),pr);await p.context().close()}
{const p=await H.newPage(b,{lang:'es'});await H.go(p,'es','#grupos','&cur=usd');await H.closePop(p);
 const r=await p.evaluate(()=>[CLP(5000),CLP(950),CLP(150000),CLP(0)]);console.log('  formatos',JSON.stringify(r));
 chk('redondeo: <US$10 con 2 decimales, resto enteros',/5,26/.test(r[0])&&/US\$ 1\b/.test(r[1].replace('1,00','1'))&&/US\$ 158/.test(r[2])&&!/US/.test(r[3]),r.join(' ; '))}
console.log(ok?'USD: TODO OK':'USD: HAY FALLAS');await b.close()})()
