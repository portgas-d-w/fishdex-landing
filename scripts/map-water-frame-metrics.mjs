import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const results=[];
async function tools(p){await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();}
try{
 for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
  const page=await browser.newPage({viewport});await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));
  await page.goto(process.env.GAME_URL??'http://127.0.0.1:5179');await page.locator('body[data-ready=true]').waitFor({state:'attached'});
  await tools(page);await page.locator('#test-toggle').click();await page.locator('#test-badge').waitFor();await page.waitForFunction(()=>!!window.__fishingQA);await page.evaluate(()=>window.__fishingQA.pauseSimulation());
  const rows=[];
  for(const controlledCombat of [false,true]){
   if(controlledCombat){await tools(page);await page.locator('#test-technique').selectOption('leurre');await page.locator('#test-kit').click();await page.locator('#test-species').selectOption('roach');await page.locator('#test-length').fill('10');await page.locator('#test-fight').click();await page.evaluate(()=>window.__fishingQA.advance(.02));}
   for(const quality of ['low','standard','high']){
    await page.evaluate(q=>window.__fishingQA.waterQuality(q),quality);await page.waitForTimeout(250);
    rows.push(await page.evaluate(async ({quality,controlledCombat})=>{
     const q=window.__fishingQA,scene=q.waterScene(),frames=[],start=performance.now();
     const driver=controlledCombat?scene.onBeforeRenderObservable.add(()=>q.advance(1/60,'smart')):null;
     const observer=scene.onAfterRenderObservable.add(()=>{
      const meshes=scene.getActiveMeshes().data.slice(0,scene.getActiveMeshes().length);
      frames.push({...q.rendering(),visibleTriangles:meshes.filter(m=>m.getClassName()!=='LinesMesh').reduce((n,m)=>n+m.getTotalIndices()/3,0),transparentMeshes:meshes.filter(m=>m.material?.needAlphaBlendingForMesh(m)).length});
     });
     await new Promise(resolve=>setTimeout(resolve,3000));scene.onAfterRenderObservable.remove(observer);if(driver)scene.onBeforeRenderObservable.remove(driver);
     const durationMs=performance.now()-start,cpu=frames.map(f=>f.cpuFrameMs).sort((a,b)=>a-b),draws=frames.map(f=>f.drawCalls),triangles=frames.map(f=>f.visibleTriangles),snapshot=q.snapshot();
     return {quality,controlledCombat,durationMs,frames:frames.length,fps:frames.length*1000/durationMs,drawCallsMin:Math.min(...draws),drawCallsMax:Math.max(...draws),visibleTrianglesMin:Math.min(...triangles),visibleTrianglesMax:Math.max(...triangles),cpuMedianMs:cpu[Math.floor(cpu.length/2)],cpuP95Ms:cpu[Math.floor(cpu.length*.95)],resolution:{width:frames[0]?.width,height:frames[0]?.height},transparentMeshesMax:Math.max(...frames.map(f=>f.transparentMeshes)),totalMeshes:snapshot.totalMeshes,total:snapshot.total,phase:snapshot.phase,water:q.water()};
    },{quality,controlledCombat}));
   }
  }
  results.push({name,viewport,renderer:'Windows Chromium ANGLE SwiftShader, aucun appareil physique',controlledCombat:'pilote DEV : même simulation et commandes, aucune réception automatique',rows});console.log(name,rows.map(r=>({quality:r.quality,combat:r.controlledCombat,draws:[r.drawCallsMin,r.drawCallsMax],triangles:r.visibleTrianglesMax})));
  await page.close();
 }
}finally{await browser.close();}
await writeFile('docs/apercus/carte-eau/frame-metrics.json',JSON.stringify(results,null,2)+'\n');
