// Captures in-game reproductibles pour le chantier visuel (Chromium SwiftShader, pas un iPhone).
// Usage : node production_3d/environment/tools/capture-ingame.mjs <stage> [--posts jetty,cove] [--pilot] [--viewports mobile,desktop]
// Nécessite un serveur `VITE_E2E=1 vite --port 5180` (GAME_URL pour changer l'adresse).
import {chromium} from '@playwright/test';import {mkdir,writeFile} from 'node:fs/promises';
const args=process.argv.slice(2),stage=args[0]??'before',opt=(k,d)=>{const i=args.indexOf('--'+k);return i<0?d:args[i+1];};
const posts=opt('posts','jetty,cove,bank,reed-bank,point,timber').split(','),pilot=args.includes('--pilot'),viewports=opt('viewports','mobile,desktop').split(',');
const folder=`docs/apercus/visuels-blender/${stage}`;await mkdir(folder,{recursive:true});
const VIEWPORTS={mobile:{width:390,height:844},desktop:{width:1440,height:900}};
// Vues de contrôle du poste pilote (coordonnées monde, ponton centré en x=0, z∈[-8,0]).
const PILOT_VIEWS={
 'pier-side':{eye:[7.5,1.6,-3.5],target:[0,.2,-4]},
 'pier-from-water':{eye:[2.5,1.4,7],target:[0,.4,-3.5]},
 'pier-high':{eye:[-6,7,-12],target:[0,0,-2]},
 'pier-low-contact':{eye:[2.6,.45,-1.2],target:[0,0,-4.5]},
 'opposite-shore':{eye:[0,4.2,-9.5],target:[0,3,40]},
};
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}),results=[];
async function tools(p){await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();}
async function close(p){for(const id of ['water-tools','test-tools','help','menu'])if(await p.locator('#'+id).isVisible())await p.locator('[data-close='+id+']').click();}
async function measure(p,seconds=3){return p.evaluate(async(seconds)=>{const q=window.__fishingQA,s=q.waterScene(),samples=[];let last=performance.now(),start=last;const o=s.onAfterRenderObservable.add(()=>{const now=performance.now();samples.push(now-last);last=now;});await new Promise(r=>setTimeout(r,seconds*1000));s.onAfterRenderObservable.remove(o);samples.sort((a,b)=>a-b);const active=s.getActiveMeshes();return{render:q.rendering(),assets:q.water().assets.families,visibleTriangles:active.data.slice(0,active.length).reduce((n,m)=>n+m.getTotalIndices()/3,0),totalMeshes:s.meshes.length,materials:s.materials.length,textures:s.textures.length,decodedTexturesEstimateBytes:[...new Map(s.textures.map(t=>[t.getInternalTexture()?.uniqueId??t.uniqueId,t])).values()].reduce((n,t)=>{const z=t.getSize();return n+z.width*z.height*4*(t.isCube?6:1)*(t.noMipmap?1:4/3);},0),frames:samples.length,fps:samples.length/((last-start)/1000),frameMedian:samples[Math.floor(samples.length*.5)],frameP95:samples[Math.floor(samples.length*.95)],frameMax:samples[samples.length-1]};},seconds);}
async function shot(p,file){await p.evaluate(()=>document.querySelector('#app').style.visibility='hidden');await p.waitForTimeout(400);await p.screenshot({path:`${folder}/${file}.jpg`,type:'jpeg',quality:88});await p.evaluate(()=>document.querySelector('#app').style.visibility='');}
try{for(const name of viewports){
 const p=await browser.newPage({viewport:VIEWPORTS[name]}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+new URL(r.url()).pathname);});
 await p.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));const t0=Date.now();await p.goto(process.env.GAME_URL??'http://127.0.0.1:5180');await p.locator('body[data-ready=true]').waitFor({state:'attached',timeout:120000});const readyMs=Date.now()-t0;
 await tools(p);await p.locator('#test-toggle').click();await p.waitForFunction(()=>!!window.__fishingQA,null,{timeout:120000});await p.locator('body[data-ready=true]').waitFor({state:'attached',timeout:120000});
 await p.evaluate(()=>{const q=window.__fishingQA;q.pauseSimulation();q.waterQuality('standard');q.ambience('morning');});
 const entries=[];
 for(const post of posts){
  await tools(p);await p.locator('#test-post').selectOption(post);await close(p);await p.waitForTimeout(2500);
  const data=await measure(p);await shot(p,`${name}-${post}-morning`);entries.push({post,view:'game',ambience:'morning',...data});console.log(name,post,data.fps.toFixed(1),Math.round(data.visibleTriangles));
  if(pilot&&post==='jetty'){
   for(const amb of ['overcast','evening']){await p.evaluate(a=>window.__fishingQA.ambience(a),amb);await p.waitForTimeout(800);await shot(p,`${name}-${post}-${amb}`);}
   await p.evaluate(()=>window.__fishingQA.ambience('morning'));
   const saved=await p.evaluate(()=>{const c=window.__fishingQA.waterScene().activeCamera;return{pos:c.position.asArray(),target:c.getTarget().asArray()};});
   for(const [view,v]of Object.entries(PILOT_VIEWS)){await p.evaluate(v=>{const c=window.__fishingQA.waterScene().activeCamera;c.position.set(...v.eye);c.setTarget(c.position.constructor.FromArray(v.target));},v);await p.waitForTimeout(900);await shot(p,`${name}-pilot-${view}`);}
   await p.evaluate(v=>{const c=window.__fishingQA.waterScene().activeCamera;c.position.set(...v.pos);c.setTarget(c.position.constructor.FromArray(v.target));},saved);
  }
 }
 const transfer=await p.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/\/(models\/environment|map-assets)\//.test(e.name)).map(e=>({name:new URL(e.name).pathname,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize})));
 results.push({name,viewport:VIEWPORTS[name],device:'Chromium Windows SwiftShader (rendu logiciel), aucun iPhone',readyMs,entries,transfer,errors});await p.close();
}}finally{await browser.close();await writeFile(`${folder}/reference.json`,JSON.stringify(results,null,2)+'\n');}
