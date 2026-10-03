import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const stage=process.argv[2]??'before',url=process.env.GAME_URL??'http://127.0.0.1:5179',folder='docs/apercus/mobile-materiel';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const rows=[];
try{for(const [name,viewport]of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'}),page=await context.newPage(),errors=[],models=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.glb'))models.push(r.url());});
 await page.addInitScript(()=>{Math.random=()=>0;localStorage.setItem('au-fil-de-leau.gestures.v3','3');});
 await page.goto(url);await page.locator('body[data-ready=true]').waitFor({state:'attached'});await page.evaluate(()=>window.__fishingQA.pauseSimulation());
 await page.waitForTimeout(1000);const first=await page.evaluate(()=>({at:performance.now(),...window.__fishingQA.snapshot()}));
 await page.waitForTimeout(3500);const last=await page.evaluate(()=>({at:performance.now(),...window.__fishingQA.snapshot(),render:window.__fishingQA.rendering()}));
 await page.screenshot({path:`${folder}/${stage}-${name}-jetty.png`});await page.locator('#menu-open').click();await page.locator('#dex-open').click();await page.screenshot({path:`${folder}/${stage}-${name}-fishdex.png`});
 await page.locator('[data-close=encyclopedia]').click();await page.locator('#equipment-open').click();await page.screenshot({path:`${folder}/${stage}-${name}-material.png`});await page.locator('[data-work-rig]').first().click();await page.screenshot({path:`${folder}/${stage}-${name}-rig.png`});
 rows.push({name,viewport,camera:last.camera,fps:+((last.lakeFrames-first.lakeFrames)/((last.at-first.at)/1000)).toFixed(2),totalMeshes:last.totalMeshes,engines:last.engines,render:last.render,startupModelRequests:models,errors});await context.close();
}}finally{await browser.close();}
await writeFile(`${folder}/${stage}-measurements.json`,JSON.stringify({stage,renderer:'Windows Chromium ANGLE SwiftShader eco DPR1; pas un appareil physique',rows},null,2));console.log(JSON.stringify(rows.map(({name,fps,totalMeshes,errors,startupModelRequests})=>({name,fps,totalMeshes,errors,startupModelRequests}))));
