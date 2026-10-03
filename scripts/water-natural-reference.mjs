import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const stage=process.argv[2]??'before',folder='docs/apercus/eau-naturelle',url=process.env.GAME_URL??'http://127.0.0.1:5179';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
async function tools(p){await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();}
async function sample(page,label,seconds=3){return page.evaluate(async({label,seconds})=>{
 const q=window.__fishingQA,scene=q.waterScene(),frames=[],start=performance.now();
 const observer=scene.onAfterRenderObservable.add(()=>frames.push({...q.rendering(),at:performance.now()}));
 await new Promise(r=>setTimeout(r,seconds*1000));scene.onAfterRenderObservable.remove(observer);
 const sorted=key=>frames.map(f=>f[key]).sort((a,b)=>a-b),cpu=sorted('cpuFrameMs'),draws=sorted('drawCalls'),dt=frames.slice(1).map((f,i)=>f.at-frames[i].at).sort((a,b)=>a-b);
 return {label,seconds:(performance.now()-start)/1000,frames:frames.length,fps:frames.length*1000/(performance.now()-start),cpuMedian:cpu[Math.floor(cpu.length*.5)],cpuP95:cpu[Math.floor(cpu.length*.95)],frameMedian:dt[Math.floor(dt.length*.5)],frameP95:dt[Math.floor(dt.length*.95)],drawMin:draws[0],drawMax:draws.at(-1),water:q.water(),render:frames.at(-1),snapshot:q.snapshot()};
 },{label,seconds});}
try{for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,recordVideo:name==='mobile'?{dir:'.migration/water-natural-video',size:viewport}:undefined}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{Math.random=()=>0;localStorage.setItem('au-fil-de-leau.gestures.v3','3');});await page.goto(url);await page.locator('body[data-ready=true]').waitFor({state:'attached'});
 await tools(page);await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!window.__fishingQA);await page.evaluate(()=>window.__fishingQA.pauseSimulation());
 const rows=[];
 for(const quality of ['low','standard','high']){
  await page.evaluate(q=>{const a=window.__fishingQA;a.waterQuality(q);a.ambience('morning');a.waterScene().onBeforeRenderObservable.add(()=>a.waterScene().getMaterialByName('pond-water').setFloat('time',30));},quality);
  await page.waitForTimeout(200);await page.screenshot({path:`${folder}/${stage}-${name}-${quality}-rest.png`});rows.push(await sample(page,quality+'-rest'));
 }
 await page.evaluate(()=>window.__fishingQA.waterQuality('standard'));
 await tools(page);await page.locator('#test-technique').selectOption('leurre');await page.locator('#test-kit').click();
 for(const selector of ['[data-close="test-tools"]','[data-close="help"]','[data-close="menu"]'])if(await page.locator(selector).isVisible())await page.locator(selector).click();
 const touch=await context.newCDPSession(page),x=viewport.width*.45;
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:30,x,y:viewport.height*.8}]});
 for(let n=1;n<=8;n++){await page.waitForTimeout(30);await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:30,x,y:viewport.height*(.8-.35*n/8)}]});}
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.evaluate(()=>window.__fishingQA.advance(.7));await page.waitForTimeout(100);await page.screenshot({path:`${folder}/${stage}-${name}-cast.png`});const cast=await page.evaluate(()=>window.__fishingQA.snapshot());
 await page.evaluate(()=>{const a=window.__fishingQA;a.waterDemo('cast_impact');a.waterDemo('lure_surface');});
 const effects=[];
 for(const age of [.15,.65,1.4]){await page.evaluate(t=>window.__fishingQA.advance(t),age===.15?.15:age===.65?.5:.75);await page.waitForTimeout(100);await page.screenshot({path:`${folder}/${stage}-${name}-moving-${age}.png`});effects.push(await page.evaluate(()=>window.__fishingQA.water()));}
 rows.push(await sample(page,'moving'));const start=await page.evaluate(()=>window.__fishingQA.snapshot());
 for(let n=0;n<10;n++)await page.evaluate(q=>window.__fishingQA.waterQuality(q),['high','standard','low'][n%3]);
 await page.waitForTimeout(150);const end=await page.evaluate(()=>window.__fishingQA.snapshot());
 results.push({name,viewport,rows,cast,effects,transitions:{start,end},errors});
 const video=page.video();await context.close();if(video)await video.saveAs(`${folder}/${stage}-${name}-movement.webm`);
 await writeFile(`${folder}/${stage}-measurements.json`,JSON.stringify({stage,renderer:'Windows Chromium SwiftShader, DPR1; aucun iPhone physique',results},null,2)+'\n');console.log(name,rows.map(r=>({label:r.label,fps:r.fps,cpuP95:r.cpuP95,draws:[r.drawMin,r.drawMax]})),errors);
}}finally{await browser.close();}
