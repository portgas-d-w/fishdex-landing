// Import moteur réel des GLB dans le viewer isolé (Babylon du jeu, conversion mobile identique).
// node production_3d/environment/tools/engine-check.mjs <id> <url.glb>[,<url2.glb>] [persp,side,top,game]
// Serveur : VITE_E2E=1 npx vite --host 127.0.0.1 --port 5180 (GAME_URL pour changer l'adresse).
import {chromium} from '@playwright/test';import {mkdir,writeFile} from 'node:fs/promises';
const [id,glbs,viewsArg='persp,side,top,game']=process.argv.slice(2);
const out=`production_3d/environment/reports/engine-import/${id}`;await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const p=await browser.newPage({viewport:{width:960,height:640}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await p.goto(`${process.env.GAME_URL??'http://127.0.0.1:5180'}/production_3d/environment/viewer/index.html?glb=${encodeURIComponent(glbs)}`);
 await p.waitForFunction(()=>window.__viewer?.ready,null,{timeout:120000});
 const err=await p.evaluate(()=>window.__viewer.error);if(err)throw Error("viewer: "+err+" "+errors.join(" | "));const info=await p.evaluate(()=>window.__viewer.info);const shots=[];
 for(const v of viewsArg.split(',')){await p.evaluate(v=>window.__viewer.frame(v),v);await p.waitForTimeout(600);const f=`${out}/${v}.png`;await p.screenshot({path:f});shots.push(f);}
 const result={id,glbs:glbs.split(','),device:'Chromium SwiftShader, viewer isolé',info,errors,shots};
 await writeFile(`${out}/report.json`,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({id,errors,info:info.map(i=>({url:i.url,tri:i.triangles,size:i.sizeXYZ,min:i.boundsMin,max:i.boundsMax,meshes:i.meshes.map(m=>[m.name,m.centerWorld,m.materialClass,m.hasNormalMap])}))},null,1));
}finally{await browser.close();}
