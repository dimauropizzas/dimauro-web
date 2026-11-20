const H=require('./h.cjs');
const CAPS=process.env.CDM_CAPS||'./capturas/';
// Recorre las vistas de la web con selectores independientes del idioma. Devuelve {steps:[{name,strings}], amts:{escenario:[numeros]}}
async function runAll(p,lang,opt={}){
  const steps=[],amts={};
  const snap=async name=>{const ov=await p.evaluate(()=>{const W=window.innerWidth,o=document.documentElement.scrollWidth-W;let who='';if(o>0){for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(r.width&&r.right>W+1&&getComputedStyle(e).position!=='fixed'){who=e.tagName+'.'+e.className+'#'+e.id+' '+Math.round(r.right);break}}}return {o,who}});steps.push({name,strings:await H.collect(p),ov})};
  const txt=async sel=>p.evaluate(s=>{const e=document.querySelector(s);return e?e.innerText:''},sel);
  const shot=async n=>{if(opt.shots)await p.screenshot({path:CAPS+n+'_'+lang+'.png'})};
  // --- Inicio (con ventana de reinauguración)
  await H.go(p,lang,'#inicio');await p.waitForTimeout(700);
  await snap('inicio+pop');await shot('01_inicio_pop');
  await H.closePop(p);await snap('inicio');await shot('01_inicio');
  await p.click('#cb');await p.click('#cq button:nth-child(3)');await p.click('#cq button:nth-child(4)');await snap('rayen');await shot('09_rayen');await p.click('#cx');
  // --- Alojamiento: habitaciones
  await H.go(p,lang,'#alojamiento');await H.closePop(p);
  await p.fill('#ci','2026-12-10');await p.fill('#co','2026-12-13');await p.selectOption('#pp','4');await p.dispatchEvent('#co','change');
  await snap('alojamiento');
  await p.click('#rooms .tgm >> nth=0');await snap('opciones-alimentacion');await p.click('#mcl');
  await p.click('#rooms .stp[data-r="m"] .mas');await p.click('#rooms .stp[data-r="r"] .mas');await snap('alojamiento-seleccion');
  await p.click('#rsv');await p.selectOption('#gq','4');await p.selectOption('#dall','cc');
  await p.fill('#gn','Ana Test');await p.fill('#gw','+5691111');
  await snap('checkout-comidas');await shot('02_checkout');
  amts.rooms=H.amounts(await txt('#mbox'));
  await p.click('#go');await snap('pago-demo');await p.click('#ok');await snap('reserva-confirmada');await p.click('#cl3');
  // --- Escapadas
  await p.click('.tab[data-tab="esc"]');await snap('escapadas');
  await p.click('.et[data-k="nav"]');await snap('escapada-navidad');
  await p.click('#erooms .stp[data-r="t"] .mas');await p.click('#erooms .sbar .btn');await p.selectOption('#gq','2');await p.selectOption('#dall','bc');await snap('checkout-navidad');
  amts.nav=H.amounts(await txt('#mbox'));await p.click('#cl');
  await p.click('#eback');await p.click('.et[data-k="ny"]');await p.click('#erooms .stp[data-r="m"] .mas');await p.click('#erooms .sbar .btn');await p.selectOption('#gq','2');
  await p.click('.mstp[data-k="nye"] .mas');await p.click('.mstp[data-k="nye"] .mas');await p.selectOption('#dall','cc');await snap('checkout-anonuevo');
  amts.ny=H.amounts(await txt('#mbox'));await p.click('#cl');
  await p.click('#einc .eg >> nth=1');await snap('opciones-anonuevo');await p.click('#mcl').catch(()=>{});await p.evaluate(()=>closeModal());
  await p.click('#eback');
  await p.click('.et[data-k="rom"]');await p.click('#rcalc .cg button[data-d="2026-12-18"]');await p.click('#rst .mas');await snap('romantica');
  amts.rom=H.amounts((await txt('#rcalc'))+' '+(await txt('#rbar')));
  await p.click('#rrs');await snap('checkout-romantica');amts.romck=H.amounts(await txt('#mbox'));
  await p.click('#rgo');await snap('pago-romantica');await p.click('#rok');await snap('confirmada-romantica');await p.click('#rcl3');
  await p.click('#rback');
  await p.evaluate(()=>openAdv());await snap('aventura-inicio');
  await p.click('#acal button[data-d="2026-12-07"]');await p.click('#acal button[data-d="2026-12-10"]');
  await p.click('#arooms .stp[data-r="m"] .mas');await p.selectOption('#agq','2');await p.click('.mstp[data-k="mp"] .mas');await snap('aventura');
  amts.adv=H.amounts(await txt('#abar'));
  await p.click('#ars');await snap('checkout-aventura');amts.advck=H.amounts(await txt('#mbox'));
  await p.click('#vgo');await p.click('#vok');await snap('confirmada-aventura');await p.click('#vcl3');
  // --- Grupos
  await H.go(p,lang,'#grupos');await H.closePop(p);await snap('grupos-inicio');await shot('03_grupos');
  await p.click('#exps .exo >> nth=3');await snap('ficha-experiencia');await shot('04_ficha_exp');await p.click('#mbox #cl4');
  await p.fill('#gpv','20');await p.dispatchEvent('#gpv','input');await p.dispatchEvent('#gpv','change');
  await p.click('#gcal button[data-d="2026-12-07"]');await p.click('#gcal button[data-d="2026-12-10"]');await p.click('input[name="gpl"][value="c"]');
  await p.click('.evpick >> nth=1');await snap('grupos-ficha');await p.click('#gver');await p.click('.evdia >> nth=3');await p.click('.evb >> nth=0');
  await p.click('.evpick >> nth=4');await p.click('#gver');await p.click('.evdia >> nth=1');await p.click('.evb >> nth=0');
  await snap('grupos-seleccion');await shot('05_grupos_sel');
  await p.click('#gcot');await snap('grupos-resumen');amts.grp=H.amounts(await txt('#mbox'));await shot('06_grupos_resumen');
  await p.click('#ggo');await p.click('#gok');await snap('grupos-confirmada');await p.click('#gc3');
  await p.fill('#gpv','200');await p.dispatchEvent('#gpv','input');await snap('grupos-tope');await p.fill('#gpv','5');await p.dispatchEvent('#gpv','change');await snap('grupos-minimo');
  await p.click('#gmodo button[data-m="exp"]');await p.fill('#gpv','30');await p.dispatchEvent('#gpv','input');await p.dispatchEvent('#gpv','change');
  await p.click('.evpick >> nth=0');await p.click('#gver');await p.fill('#gday','2026-12-11');await p.dispatchEvent('#gday','change');await snap('exp-solo-dia');
  await p.click('.evb[data-b="a"]');await p.click('.evpick >> nth=3');await p.click('#gver');await p.fill('#gday','2026-12-14');await p.dispatchEvent('#gday','change');await p.click('.evb[data-b="b"]');
  await p.evaluate(()=>{document.getElementById('gday').dispatchEvent(new Event('change'))});
  await snap('exp-solo-seleccion');await p.click('#gcot');await snap('exp-solo-resumen');amts.exp=H.amounts(await txt('#mbox'));await p.click('#cl4');
  await p.fill('#gpv','8');await p.dispatchEvent('#gpv','input');await p.dispatchEvent('#gpv','change');await p.click('.evpick >> nth=0');await p.click('#gver').catch(()=>{});await snap('exp-solo-chico');
  // --- Pizzería
  await H.go(p,lang,'#pizzeria');await H.closePop(p);await snap('pizzeria');
  return {steps,amts}}
module.exports={runAll,CAPS};
