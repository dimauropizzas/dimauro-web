const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,n] of [[1100,'d'],[390,'m']]){
const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'?lang=es#grupos');await p.waitForTimeout(800);
await p.evaluate(()=>{var x=document.getElementById('pop');if(x)x.remove()});
await p.fill('#gpv','20');await p.dispatchEvent('#gpv','input');await p.dispatchEvent('#gpv','change');await p.waitForTimeout(200);
await p.locator('#gexp').screenshot({path:n+'1.png'});
await p.locator('.evpick').nth(3).click();await p.waitForTimeout(200);
await p.locator('#gexp').screenshot({path:n+'2.png'});
await p.click('#gver');await p.waitForTimeout(300);
await p.fill('#gday','2026-12-14');await p.dispatchEvent('#gday','change');await p.waitForTimeout(300);
await p.locator('#gexp').screenshot({path:n+'3.png'});
console.log(n,errs)}
await b.close()})()
