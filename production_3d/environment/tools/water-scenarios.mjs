// Recette visuelle de l'eau : chaque événement réel, 30 impacts, 10 transitions de poste, profils low/standard/high.
// node production_3d/environment/tools/water-scenarios.mjs [dossier]   (serveur VITE_E2E=1 sur 5180)
// Chromium SwiftShader : vérifie bornes des pools, nettoyage et absence de fuite ; pas une mesure d'iPhone.
import {chromium} from '@playwright/test';import {mkdir,writeFile} from 'node:fs/promises';
const folder=`docs/apercus/visuels-blender/${process.argv[2]??'eau'}`;await mkdir(folder,{recursive:true});
const TYPES=['cast_impact','line_deposit','float_enter','float_motion','bite_float','float_submerge','float_resurface','strike_surface','lure_surface','lure_submerge','bait_sink','feeder_impact','groundbait_impact','fish_near_surface','fish_surface_turn','fish_surface_break','fish_dive','line_surface_drag','obstacle_disturbance','net_enter','net_capture','net_exit','fish_release','ambient_surface','rain_surface','boat_wake'];
const SHOTS=['cast_impact','feeder_impact','float_motion','fish_surface_break','net_capture'];
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const report={device:'Chromium Windows SwiftShader, viewport 390×844, aucun iPhone',profiles:{}};
async function tools(p){await p.locator('#menu-open').click();await p.locator('#help-open').click();await p.locator('#test-open').click();}
async function close(p){for(const id of ['water-tools','test-tools','help','menu'])if(await p.locator('#'+id).isVisible())await p.locator('[data-close='+id+']').click();}
const counts=p=>p.evaluate(()=>{const q=window.__fishingQA,s=q.waterScene(),w=q.water().water;return{meshes:s.meshes.length,materials:s.materials.length,textures:s.textures.length,geometries:s.geometries.length,renderTargets:s.customRenderTargets.length,rings:w.activeRings,drops:w.activeDrops,crowns:w.activeCrowns,waves:w.activeSurfaceWaves,capacity:w.capacity,reflectionObjects:w.reflectionObjects};});
try{
 const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await p.goto(process.env.GAME_URL??'http://127.0.0.1:5180');await p.locator('body[data-ready=true]').waitFor({state:'attached',timeout:120000});
 await tools(p);await p.locator('#test-toggle').click();await p.waitForFunction(()=>!!window.__fishingQA,null,{timeout:120000});await p.locator('body[data-ready=true]').waitFor({state:'attached',timeout:120000});await p.waitForTimeout(2000);
 for(const quality of ['low','standard','high']){
  await p.evaluate(q=>{window.__fishingQA.waterQuality(q);window.__fishingQA.ambience('morning');document.querySelector('#app').style.visibility='hidden';},quality);await p.waitForTimeout(800);
  const events={};
  for(const type of TYPES){await p.evaluate(t=>window.__fishingQA.waterDemo(t),type);await p.waitForTimeout(140);const c=await counts(p);events[type]={rings:c.rings,drops:c.drops,crowns:c.crowns,waves:c.waves};
   if(SHOTS.includes(type)){await p.screenshot({path:`${folder}/${quality}-${type}.jpg`,type:'jpeg',quality:86});}
   await p.waitForTimeout(2600);}
  const before=await counts(p);let peak={rings:0,drops:0,crowns:0,waves:0};
  for(let i=0;i<30;i++){await p.evaluate(()=>window.__fishingQA.waterDemo('cast_impact'));await p.waitForTimeout(60);const c=await counts(p);peak={rings:Math.max(peak.rings,c.rings),drops:Math.max(peak.drops,c.drops),crowns:Math.max(peak.crowns,c.crowns),waves:Math.max(peak.waves,c.waves)};}
  await p.waitForTimeout(3200);const after=await counts(p);
  report.profiles[quality]={events,impacts30:{peak,capacity:before.capacity,clearedAfter3s:after.rings===0&&after.drops===0&&after.crowns===0&&after.waves===0,before:{meshes:before.meshes,materials:before.materials,textures:before.textures},after:{meshes:after.meshes,materials:after.materials,textures:after.textures}},reflectionObjects:after.reflectionObjects};
  console.log(quality,JSON.stringify(report.profiles[quality].impacts30));
 }
 await p.evaluate(()=>{document.querySelector('#app').style.visibility='';window.__fishingQA.waterQuality('standard');});
 const start=await counts(p);const order=['cove','bank','reed-bank','point','timber','jetty','cove','bank','point','jetty'];const trail=[];
 for(const post of order){await tools(p);await p.locator('#test-post').selectOption(post);await close(p);await p.evaluate(()=>window.__fishingQA.waterDemo('cast_impact'));await p.waitForTimeout(1200);trail.push({post,...await counts(p)});}
 await p.waitForTimeout(3000);const end=await counts(p);
 report.transitions10={start,end,trail,growth:{meshes:end.meshes-start.meshes,materials:end.materials-start.materials,textures:end.textures-start.textures,geometries:end.geometries-start.geometries,renderTargets:end.renderTargets-start.renderTargets},effectsClearedAtEnd:end.rings===0&&end.drops===0};
 report.errors=errors;console.log('transitions',JSON.stringify(report.transitions10.growth),'errors',errors.length);
}finally{await browser.close();await writeFile(`${folder}/water-scenarios.json`,JSON.stringify(report,null,2)+'\n');}
