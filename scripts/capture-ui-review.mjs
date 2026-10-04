import {chromium,devices} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {emptySave,recordCatch} from '../src/game/save.ts';
const [url,stage]=process.argv.slice(2),root=`docs/apercus/refonte-ui/${stage}`;
await mkdir(root,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const metrics=[];
for(const format of ['desktop','mobile'])for(const advanced of [false,true]){
 const save=emptySave();if(advanced){for(const [i,id]of ['roach','perch','roach'].entries())recordCatch(save,{id:'review-'+i,speciesId:id,length:20+i*4,date:`2026-10-0${i+1}T12:00:00Z`,method:'pole'});save.favorites=['review-0'];save.coins=500;save.xp=10000;}
 const context=await browser.newContext(format==='desktop'?{viewport:{width:1440,height:900}}:{...devices['iPhone 13'],viewport:{width:390,height:844}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(save=>{localStorage.setItem('au-fil-de-leau.gestures.v3','3');localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(save));},save);
 await page.goto(url);await page.waitForFunction(()=>document.body.dataset.ready==='true',null,{timeout:60000});await page.waitForTimeout(1000);
 if(!advanced)metrics.push({format,...await page.evaluate(()=>{const entries=performance.getEntriesByType('resource');return{readyMs:performance.now(),resources:entries.length,decodedBytes:entries.reduce((n,e)=>n+e.decodedBodySize,0),models:entries.filter(e=>/\/models\/.+\.glb/.test(e.name)).map(e=>new URL(e.name).pathname),entry:entries.find(e=>/\/assets\/index-.*\.js/.test(e.name))?.name};})});
 await page.locator('#menu-open').click();await page.screenshot({path:`${root}/${format}-${advanced?'avance':'vierge'}-menu.png`});
 for(const [entry,id]of [['equipment-open','preparation'],['shop-open','shop'],['dex-open','encyclopedia'],['progress-open','progression'],['locations-open','locations'],['collection-open','collection'],['help-open','help'],['aquarium-open','aquarium']]){
  await page.locator('#'+entry).click();if(id==='aquarium')await page.waitForFunction(()=>document.querySelector('#aquarium-canvas')?.dataset.loaded==='true',{},{timeout:40000});await page.screenshot({path:`${root}/${format}-${advanced?'avance':'vierge'}-${id}.png`});await page.locator(`[data-close="${id}"]`).first().click();
 }
 metrics.push({format,advanced,errors});await context.close();
}
await browser.close();await writeFile(`${root}/chargement.json`,JSON.stringify({url,stage,date:new Date().toISOString(),fixtures:'Profils de revue locaux générés par recordCatch ; aucun gain utilisateur ni capture en conditions naturelles.',metrics},null,2));console.log('Captures et mesures enregistrées : '+root);
