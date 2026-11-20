// e4.js actualizado: el original usaba .dsel/.dnum (UI de comidas anterior, ya inexistente); aquí se usan .dl/.dc/#dall actuales. Se corre en es.
const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#alojamiento');await p.waitForTimeout(900);
await p.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove()});
await p.evaluate(()=>{var K=MAINC;var s=document.getElementById(K.pp);document.getElementById(K.ci).value='2026-12-23';document.getElementById(K.co).value='2026-12-27';if(s)s.value='2';S.sel={m:1};S.pack='nav';S.ctx=null;openCheckout()});
await p.waitForTimeout(300);
await p.selectOption('#gq','2');
await p.selectOption('.dl[data-d="2026-12-23"]','c');await p.selectOption('.dc[data-d="2026-12-23"]','c');
await p.selectOption('.dl[data-d="2026-12-24"]','b');
await p.selectOption('.dl[data-d="2026-12-27"]','b');
const rows=async()=>p.evaluate(()=>[...document.querySelectorAll('table.sum tr')].map(t=>t.innerText.replace(/\s+/g,' ')));
console.log(await rows());
await p.selectOption('#dall','cc');
console.log(await rows());
console.log(er);await b.close()})()
