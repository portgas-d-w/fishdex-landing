import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}),rows=[];
async function tools(p){await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();await p.locator('#water-tools-open').click();}
try{for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const page=await browser.newPage({viewport});await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto(process.env.GAME_URL??'http://127.0.0.1:5179');await page.locator('body[data-ready=true]').waitFor({state:'attached'});
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!window.__fishingQA);await page.evaluate(()=>{window.__fishingQA.pauseSimulation();window.__fishingQA.waterQuality('standard');});
 const samples=[];
 for(const post of ['cove','reed-bank','timber','jetty']){
  await tools(page);await page.locator('#water-post').selectOption(post);await page.locator('[data-close=water-tools]').click();for(const s of ['[data-close=test-tools]','[data-close=help]','[data-close=menu]'])if(await page.locator(s).isVisible())await page.locator(s).click();await page.waitForTimeout(300);
  await page.screenshot({path:`docs/apercus/eau-naturelle/after-${name}-${post}-contacts.png`});samples.push({post,...await page.evaluate(()=>({snapshot:window.__fishingQA.snapshot(),water:window.__fishingQA.water()}))});
 }
 await tools(page);await page.locator('#water-turbidity').focus();await page.locator('#water-turbidity').press('Home');await page.screenshot({path:`docs/apercus/eau-naturelle/after-${name}-turbidity-clear.png`});await page.locator('[data-close=water-tools]').click();for(const s of ['[data-close=test-tools]','[data-close=help]','[data-close=menu]'])if(await page.locator(s).isVisible())await page.locator(s).click();await page.waitForTimeout(200);await page.screenshot({path:`docs/apercus/eau-naturelle/after-${name}-clear-floor.png`});
 rows.push({name,viewport,samples});await page.close();await writeFile('docs/apercus/eau-naturelle/contact-details.json',JSON.stringify(rows,null,2)+'\n');
}}finally{await browser.close();}
