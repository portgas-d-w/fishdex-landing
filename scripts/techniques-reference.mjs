import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const folder='docs/apercus/v2/reference';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
const rows=[];
try {
 for(const [stage,url] of [['before','http://127.0.0.1:5176'],['after','http://127.0.0.1:5177']])for(const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.glb'))requests.push(r.url());});
  await page.addInitScript(()=>{Math.random=()=>0;localStorage.setItem('au-fil-de-leau.gestures.v3','3');});await page.goto(url);await page.locator('body[data-ready=true]').waitFor({state:'attached'});await page.evaluate(()=>window.__fishingQA.pauseSimulation());await page.waitForTimeout(1500);
  const measure=async(label)=>{
   const snapshot=()=>page.evaluate(()=>({at:performance.now(),...window.__fishingQA.snapshot(),render:window.__fishingQA.rendering()}));
   const first=await snapshot(),samples=[];for(let i=0;i<20;i++){await page.waitForTimeout(150);samples.push(await snapshot());}
   const last=samples.at(-1),cpu=samples.map(x=>x.render.cpuFrameMs).sort((a,b)=>a-b);
   await page.screenshot({path:`${folder}/${stage}-${name}-${label}.png`});
   rows.push({stage,viewport,label,camera:last.camera,sceneId:last.sceneId,engines:last.engines,totalMeshes:last.totalMeshes,fps:+((last.lakeFrames-first.lakeFrames)/((last.at-first.at)/1000)).toFixed(2),cpuSubmissionMedianMs:cpu[10],cpuSubmissionP95Ms:cpu[18],...last.render,initialModelRequests:[...requests],errors:[...errors]});
  };
  await measure('jetty');await page.locator('#prepare-open').click();await page.screenshot({path:`${folder}/${stage}-${name}-preparation.png`});await page.locator('[data-close=preparation]').click();
  if(stage==='after'){
   await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.locator('body[data-ready=true]').waitFor({state:'attached'});await page.evaluate(()=>window.__fishingQA.pauseSimulation());
   for(const [tech,label] of [['bolognaise','river'],['gambe','deep'],['traine','boat']]){
    await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-technique').selectOption(tech);await page.locator('#test-kit').click();
    for(const id of ['test-tools','help','menu'])await page.locator(`[data-close=${id}]`).click();await page.waitForTimeout(500);await measure(label);
   }
  }
  await context.close();
 }
}finally{await browser.close();}
const comparison=['desktop','mobile'].map(name=>{const width=name==='desktop'?1440:390,a=rows.find(r=>r.stage==='before'&&r.viewport.width===width),b=rows.find(r=>r.stage==='after'&&r.viewport.width===width);return {name,identicalCamera:JSON.stringify(a.camera)===JSON.stringify(b.camera),renderSizeEqual:a.width===b.width&&a.height===b.height,beforeFps:a.fps,afterFps:b.fps,beforeDrawCalls:a.drawCalls,afterDrawCalls:b.drawCalls,beforeVertices:a.vertices,afterVertices:b.vertices};});
await writeFile(`${folder}/measurements.json`,JSON.stringify({baseline:'3b92834',renderer:'Windows Chromium headless ANGLE SwiftShader, eco, DPR 1; 20 samples; not a phone GPU',comparison,rows},null,2));console.log(JSON.stringify(comparison,null,2));
