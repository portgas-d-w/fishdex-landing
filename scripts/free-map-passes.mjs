import {chromium} from '@playwright/test';import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}),rows=[];
try{for(const [name,viewport]of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const p=await browser.newPage({viewport});await p.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await p.goto('http://127.0.0.1:5179');await p.locator('body[data-ready=true]').waitFor({state:'attached'});
 await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();await p.locator('#test-toggle').click();await p.waitForFunction(()=>!!window.__fishingQA);await p.evaluate(()=>window.__fishingQA.pauseSimulation());
 const samples=[];for(const quality of ['low','standard','high']){
  await p.evaluate(q=>window.__fishingQA.waterQuality(q),quality);await p.waitForTimeout(2000);
  samples.push(await p.evaluate(async quality=>{
   const q=window.__fishingQA,s=q.waterScene(),gl=document.querySelector('#world').getContext('webgl2'),ext=gl?.getExtension('EXT_disjoint_timer_query_webgl2'),values={main:[],reflection:[],surface:[],terrain:[]},pending=[],frames=[];let current,last=performance.now(),start=last,main=false;
   const begin=kind=>{if(!ext||current||pending.length>=16)return;const query=gl.createQuery();gl.beginQuery(ext.TIME_ELAPSED_EXT,query);current={kind,query};};
   const end=kind=>{if(current?.kind!==kind)return;gl.endQuery(ext.TIME_ELAPSED_EXT);pending.push(current);current=null;};
   const hooks=[],on=(o,f)=>hooks.push([o,o.add(f)]),target=s.customRenderTargets.find(t=>t.name==='pond-selective-reflection'),water=s.getMeshByName('water'),ground=s.getMeshByName('pond-shared-terrain');
   on(target.onBeforeRenderObservable,()=>begin('reflection'));on(target.onAfterRenderObservable,()=>end('reflection'));
   on(s.onBeforeDrawPhaseObservable,()=>{main=!main;if(main)begin('main');});on(s.onAfterDrawPhaseObservable,()=>end('main'));
   for(const [kind,mesh]of [['surface',water],['terrain',ground]]){on(mesh.onBeforeRenderObservable,()=>{if(!main)begin(kind);});on(mesh.onAfterRenderObservable,()=>end(kind));}
   const poll=()=>{for(let i=pending.length-1;i>=0;i--){const r=pending[i];if(gl.getQueryParameter(r.query,gl.QUERY_RESULT_AVAILABLE)){if(!gl.getParameter(ext.GPU_DISJOINT_EXT))values[r.kind].push(gl.getQueryParameter(r.query,gl.QUERY_RESULT)/1e6);gl.deleteQuery(r.query);pending.splice(i,1);}}};
   on(s.onAfterRenderObservable,()=>{const now=performance.now();frames.push(now-last);last=now;if(ext)poll();});target.resetRefreshCounter();await new Promise(r=>setTimeout(r,6000));for(const [o,h]of hooks)o.remove(h);if(ext){await new Promise(r=>setTimeout(r,200));poll();for(const r of pending)gl.deleteQuery(r.query);}
   const stats=v=>{v.sort((a,b)=>a-b);return{count:v.length,medianMs:v[Math.floor(v.length*.5)]??null,p95Ms:v[Math.floor(v.length*.95)]??null};};
   return{quality,gpuSoftwareTimer:!!ext,fps:frames.length/((last-start)/1000),frame:stats(frames),passes:Object.fromEntries(Object.entries(values).map(([k,v])=>[k,stats(v)])),render:q.rendering(),water:q.water(),decodedTextureEstimateBytes:[...new Set([...s.textures,...s.materials.flatMap(m=>m.getActiveTextures())])].reduce((n,t)=>{const z=t.getSize();return n+z.width*z.height*4*(t.isCube?6:1)*(t.noMipmap?1:4/3);},0)};
  },quality));console.log(name,quality,samples.at(-1).fps,samples.at(-1).passes);
 }
 rows.push({name,viewport,samples});await p.close();await writeFile('docs/apercus/assets-gratuits/quality-passes.json',JSON.stringify({device:'Windows Chromium SwiftShader DPR1; GPU logiciel, aucun iPhone; renderer eco, eau trois profils; main exclut RTT; sous-passes mesurées dans des frames alternées',rows},null,2)+'\n');
}}finally{await browser.close();}
