import {chromium,devices} from 'playwright';
import {mkdir} from 'node:fs/promises';
const [url,stage='avant']=process.argv.slice(2),root=`docs/apercus/boutique-rayons/${stage}`;
await mkdir(root,{recursive:true});
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
async function settle(page){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.locator('dialog:modal img').evaluateAll(imgs=>Promise.all(imgs.filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}).map(i=>i.decode().catch(()=>{}))));
}
for(const format of ['desktop','mobile']){
 const context=await browser.newContext(format==='desktop'?{viewport:{width:1440,height:900}}:{...devices['iPhone 13'],viewport:{width:390,height:844}});
 if(process.env.VERCEL_OIDC_TOKEN){const origin=new URL(url).origin;await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}}));}
 const page=await context.newPage();await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));
 await page.goto(url);await page.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});
 await page.locator('#menu-open').click();await page.locator('#shop-open').click();await settle(page);await page.screenshot({path:`${root}/${format}-accueil.png`});
 if(await page.locator('[data-shop-department="bait"]').count())await page.locator('[data-shop-department="bait"]').click();else await page.locator('#shop-family').selectOption('bait');
 await settle(page);await page.screenshot({path:`${root}/${format}-appats.png`});
 await context.close();
}
await browser.close();
