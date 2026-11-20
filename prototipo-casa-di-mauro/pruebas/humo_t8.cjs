const {chromium}=require('playwright');const http=require('http');
const log=[];
const srv=http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','*');res.setHeader('Access-Control-Allow-Methods','*');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
  let b='';req.on('data',c=>b+=c);req.on('end',()=>{
    const u=new URL(req.url,'http://x');log.push(req.method+' '+u.pathname+u.search+' '+b+' auth='+req.headers.authorization);
    const J=(o,st=200)=>{res.writeHead(st,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
    if(u.pathname.endsWith('/disponibilidad')){
      const p=+u.searchParams.get('personas');const act=u.searchParams.get('actividad');const cap=act==='casino_party'?80:100;
      const mk=(d,h,id,conf)=>{const libre=cap-conf;return {sesion_id:id,inicio:d+'T'+(h===13?'16':'21')+':00:00+00:00',hay:libre>=p&&(p>=15||conf>=15),cupos_disponibles:libre,confirmados:conf}};
      return J({ok:true,sesiones:[mk('2026-12-10',13,1,0),mk('2026-12-10',18,2,0),mk('2026-12-11',13,3,50),mk('2026-12-11',18,4,0),mk('2026-12-24',13,5,0)]})}
    if(u.pathname.endsWith('/reservas')&&req.method==='POST')return J({ok:true,reserva_id:777,total:300000,anticipo:150000},201);
    if(u.pathname.endsWith('/pago'))return J({ok:true,urlPago:'http://localhost:'+srv.address().port+'/khipu-demo'});
    if(u.pathname.includes('/reservas/777'))return J({ok:true,estado:'confirmada'});
    if(u.pathname==='/khipu-demo'){res.writeHead(200);return res.end('khipu')}
    J({ok:false},404)})});
srv.listen(0,async()=>{const port=srv.address().port;
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1000,height:1000}});
await ctx.addInitScript(`window.CDM_CONFIG={base:'http://localhost:${port}',key:'',keyExp:'secreto-x'}`);
const p=await ctx.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#grupos');await p.waitForTimeout(800);
await p.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove()});
await p.evaluate(()=>gModo('exp'));
await p.fill('#gpv','30');await p.waitForTimeout(200);
await p.locator('.evpick').nth(0).click();await p.click('#gver');await p.waitForTimeout(600);
await p.fill('#gday','2026-12-11');await p.dispatchEvent('#gday','change');await p.waitForTimeout(300);
console.log('bloques 30p:',await p.evaluate(()=>[...document.querySelectorAll('.evb')].map(x=>x.textContent.replace(/\s+/g,' ')+(x.disabled?' [X]':''))));
await p.locator('.evb[data-b="a"]').click();await p.waitForTimeout(200);
console.log('seleccion',await p.evaluate(()=>JSON.stringify(G.ev)));
await p.fill('#gday','2026-12-24');await p.dispatchEvent('#gday','change');await p.waitForTimeout(200);
console.log('24 dic:',await p.evaluate(()=>document.getElementById('gdisp').textContent.trim().slice(0,80)));
await p.click('#gcot');await p.waitForTimeout(300);
await p.click('#ggo');await p.waitForTimeout(200);console.log('sin datos:',await p.evaluate(()=>document.querySelector('.livemsg')&&document.querySelector('.livemsg').textContent));
await p.fill('#gn','Colegio X');await p.fill('#gw','+56911112222');await p.fill('#gm','a@b.cl');
await Promise.all([p.waitForNavigation({timeout:5000}).catch(()=>{}),p.click('#ggo')]);await p.waitForTimeout(500);
console.log('fue a:',p.url());
// chips <15
const p2=await ctx.newPage();p2.on('pageerror',e=>er.push(e.message));
await p2.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#grupos');await p2.waitForTimeout(800);
await p2.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove();gModo('exp')});
await p2.fill('#gpv','15');
await p2.evaluate(()=>{});
await p2.close();
const p3=await ctx.newPage();p3.on('pageerror',e=>er.push(e.message));
await p3.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#grupos');await p3.waitForTimeout(800);
await p3.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove();gModo('exp')});
await p3.evaluate(()=>{G.p=8;G.pset=true;gdraw()});
await p3.locator('.evpick').nth(0).click();await p3.click('#gver');await p3.waitForTimeout(600);
console.log('chips 8p:',await p3.evaluate(()=>[...document.querySelectorAll('.evdia')].map(x=>x.textContent)));
console.log(log.filter(l=>/reservas|pago/.test(l)).map(l=>l.slice(0,230)));console.log('errs',er);await b.close();srv.close()})
