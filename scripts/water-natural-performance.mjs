import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const folder='docs/apercus/eau-naturelle';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}),rows=[];
try{for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto(process.env.GAME_URL??'http://127.0.0.1:5179');await page.locator('body[data-ready=true]').waitFor({state:'attached'});
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!window.__fishingQA);await page.evaluate(()=>window.__fishingQA.pauseSimulation());
 const samples=[];
 for(const quality of ['low','standard','high'])for(const moving of [false,true]){
  await page.evaluate(q=>window.__fishingQA.waterQuality(q),quality);await page.waitForTimeout(2000);
  samples.push(await page.evaluate(async({quality,moving})=>{
   const q=window.__fishingQA,scene=q.waterScene(),engine=scene.getEngine(),frames=[],begin=q.water(),start=performance.now();let lastEvent=-1;
   const driver=scene.onBeforeRenderObservable.add(()=>{
    if(moving){q.advance(1/60);const t=q.water().clock;if(t-lastEvent>.5){q.waterDemo('lure_surface');q.waterDemo('cast_impact');lastEvent=t;}}
   });
   const observer=scene.onAfterRenderObservable.add(()=>frames.push({at:performance.now(),...q.rendering(),pass:q.water().water.reflectionCpuMs,waterCpu:q.water().water.surfaceSubmissionCpuMs??null}));
   await new Promise(r=>setTimeout(r,10000));scene.onBeforeRenderObservable.remove(observer);scene.onBeforeRenderObservable.remove(driver);
   const seconds=(performance.now()-start)/1000,rank=(values,f)=>values.slice().sort((a,b)=>a-b)[Math.floor(values.length*f)],deltas=frames.slice(1).map((f,n)=>f.at-frames[n].at),end=q.water();
   return {quality,moving,syntheticContacts:moving,seconds,frames:frames.length,fps:frames.length/seconds,cpuMedian:rank(frames.map(f=>f.cpuFrameMs),.5),cpuP95:rank(frames.map(f=>f.cpuFrameMs),.95),frameMedian:rank(deltas,.5),frameP95:rank(deltas,.95),drawMin:Math.min(...frames.map(f=>f.drawCalls)),drawMax:Math.max(...frames.map(f=>f.drawCalls)),reflectionSubmissions:end.water.reflectionRenders-begin.water.reflectionRenders,reflectionCpuP95:rank(frames.map(f=>f.pass),.95),surfaceSubmissionCpuP95:rank(frames.map(f=>f.waterCpu??0),.95),water:end.water,render:frames.at(-1),gpuTimerAvailable:!!engine.getCaps().timerQuery,glInfo:engine.getGlInfo(),snapshot:q.snapshot()};
  },{quality,moving}));
  console.log(name,quality,moving,samples.at(-1).fps.toFixed(2));
 }
 rows.push({name,viewport,samples,errors});await context.close();await writeFile(`${folder}/performance-steady.json`,JSON.stringify({device:'Windows Chromium SwiftShader; aucun téléphone physique',warmupPerRowSeconds:2,rows},null,2)+'\n');
}}finally{await browser.close();}
