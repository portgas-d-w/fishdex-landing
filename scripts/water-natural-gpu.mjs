import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}),rows=[];
try{for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const page=await browser.newPage({viewport});await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto(process.env.GAME_URL??'http://127.0.0.1:5179');await page.locator('body[data-ready=true]').waitFor({state:'attached'});
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!window.__fishingQA);await page.evaluate(()=>window.__fishingQA.pauseSimulation());
 const samples=[];
 for(const quality of ['low','standard','high']){
  await page.evaluate(q=>window.__fishingQA.waterQuality(q),quality);await page.waitForTimeout(1500);
  samples.push(await page.evaluate(async quality=>{
   const q=window.__fishingQA,scene=q.waterScene(),gl=document.querySelector('#world').getContext('webgl2'),ext=gl?.getExtension('EXT_disjoint_timer_query_webgl2');
   if(!ext)return {quality,supported:false,reason:'WebGL2 elapsed timer unavailable'};
   const target=scene.customRenderTargets.find(t=>t.name==='pond-selective-reflection'),water=scene.getMeshByName('water'),pending=[],values={reflection:[],surface:[]};let current;
   function begin(kind){if(current||pending.length>=16)return;const query=gl.createQuery();gl.beginQuery(ext.TIME_ELAPSED_EXT,query);current={kind,query};}
   function end(){if(!current)return;gl.endQuery(ext.TIME_ELAPSED_EXT);pending.push(current);current=null;}
   const beforeR=target.onBeforeRenderObservable.add(()=>begin('reflection')),afterR=target.onAfterRenderObservable.add(end),beforeW=water.onBeforeRenderObservable.add(()=>begin('surface')),afterW=water.onAfterRenderObservable.add(end);
   const poll=()=>{for(let n=pending.length-1;n>=0;n--){const row=pending[n];if(gl.getQueryParameter(row.query,gl.QUERY_RESULT_AVAILABLE)){if(!gl.getParameter(ext.GPU_DISJOINT_EXT))values[row.kind].push(gl.getQueryParameter(row.query,gl.QUERY_RESULT)/1e6);gl.deleteQuery(row.query);pending.splice(n,1);}}};
   const polling=scene.onAfterRenderObservable.add(poll);target.resetRefreshCounter();await new Promise(r=>setTimeout(r,4000));
   target.onBeforeRenderObservable.remove(beforeR);target.onAfterRenderObservable.remove(afterR);water.onBeforeRenderObservable.remove(beforeW);water.onAfterRenderObservable.remove(afterW);
   await new Promise(r=>setTimeout(r,200));poll();scene.onAfterRenderObservable.remove(polling);for(const row of pending)gl.deleteQuery(row.query);
   const stats=v=>{v.sort((a,b)=>a-b);return {count:v.length,medianMs:v[Math.floor(v.length*.5)]??null,p95Ms:v[Math.floor(v.length*.95)]??null,minMs:v[0]??null,maxMs:v.at(-1)??null};};
   return {quality,supported:true,reflection:stats(values.reflection),surface:stats(values.surface),water:q.water().water,glError:gl.getError()};
  },quality));console.log(name,quality,JSON.stringify(samples.at(-1)));
 }
 rows.push({name,viewport,samples});await page.close();await writeFile('docs/apercus/eau-naturelle/gpu-passes.json',JSON.stringify({device:'Chromium Windows SwiftShader; temps du GPU logiciel, pas iPhone',lowReflectionResetOnceForMeasurement:true,rows},null,2)+'\n');
}}finally{await browser.close();}
