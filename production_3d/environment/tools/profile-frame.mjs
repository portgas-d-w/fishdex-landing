// Décomposition du temps d'image (SceneInstrumentation) au poste ponton, profil par défaut, bureau et mobile.
// node production_3d/environment/tools/profile-frame.mjs [url]  — Chromium SwiftShader, pas un iPhone.
import {chromium} from '@playwright/test';
const url=process.argv[2]??'http://127.0.0.1:5180';const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{for(const vp of [{width:1440,height:900},{width:390,height:844}]){
 const p=await browser.newPage({viewport:vp});await p.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));
 await p.goto(url);await p.locator('body[data-ready=true]').waitFor({state:'attached',timeout:120000});
 await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();await p.locator('#test-toggle').click();await p.waitForFunction(()=>!!window.__fishingQA,null,{timeout:120000});await p.locator('body[data-ready=true]').waitFor({state:'attached'});await p.waitForTimeout(3000);
 const r=await p.evaluate(async()=>{const s=window.__fishingQA.waterScene();const SI=s.getEngine().constructor;const mod=await import('/node_modules/.vite/deps/@babylonjs_core_Instrumentation_sceneInstrumentation.js').catch(()=>null);
  let n=0,t0=performance.now();const times={eval:0,render:0,frame:0};let last=performance.now();const o=s.onAfterRenderObservable.add(()=>{n++;});
  const b=s.onBeforeActiveMeshesEvaluationObservable.add(()=>{times._e=performance.now();});const a=s.onAfterActiveMeshesEvaluationObservable.add(()=>{times.eval+=performance.now()-times._e;});
  const rb=s.onBeforeRenderTargetsRenderObservable.add(()=>{});const db=s.onBeforeDrawPhaseObservable.add(()=>{times._d=performance.now();});const da=s.onAfterDrawPhaseObservable.add(()=>{times.render+=performance.now()-times._d;});
  await new Promise(r=>setTimeout(r,4000));const dt=performance.now()-t0;[o,b,a,rb,db,da].forEach(x=>x&&x.remove?.());s.onAfterRenderObservable.remove(o);s.onBeforeActiveMeshesEvaluationObservable.remove(b);s.onAfterActiveMeshesEvaluationObservable.remove(a);s.onBeforeDrawPhaseObservable.remove(db);s.onAfterDrawPhaseObservable.remove(da);
  return{fps:+(n*1000/dt).toFixed(1),evalMsPerFrame:+(times.eval/n).toFixed(2),drawMsPerFrame:+(times.render/n).toFixed(2),meshes:s.meshes.length,active:s.getActiveMeshes().length,w:s.getEngine().getRenderWidth(),h:s.getEngine().getRenderHeight()};});
 console.log(JSON.stringify({vp,...r}));await p.close();}}finally{await browser.close();}
