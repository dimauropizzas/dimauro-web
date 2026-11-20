const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#grupos');await p.waitForTimeout(800);
await p.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove()});
await p.screenshot({path:'g0.png'});
await p.evaluate(()=>{G.p=20;G.pset=true;G.f='2026-12-07';G.o='2026-12-10';G.n=3;G.pl='c';gcalDraw();gdraw()});
await p.locator('.evpick').nth(1).tap();await p.waitForTimeout(200);
await p.tap('#gver');await p.waitForTimeout(900);
console.log('scrollY',await p.evaluate(()=>[Math.round(scrollY),Math.round(document.getElementById('gdet').getBoundingClientRect().top),!!document.getElementById('gday').offsetParent,document.getElementById('gdisp').innerText.slice(0,120)]));
await p.screenshot({path:'g1.png'});
await p.locator('.evdia').nth(3).tap();await p.waitForTimeout(300);
await p.locator('.evb').first().tap();await p.waitForTimeout(200);
await p.locator('.evpick').nth(4).tap();await p.tap('#gver');await p.waitForTimeout(900);
await p.locator('.evdia').nth(1).tap();await p.waitForTimeout(300);await p.locator('.evb').nth(0).tap();await p.waitForTimeout(200);
await p.tap('#gcot');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>[...document.querySelectorAll('#mbox table tr')].map(t=>t.innerText.replace(/\s+/g,' '))));
console.log(er);await b.close()})()
