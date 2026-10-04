import {chromium} from '@playwright/test';
import {build,preview} from 'vite';
import {mkdir,writeFile,copyFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
// Build a separate, consistent Babylon bundle: mixing dev optimiser modules breaks shader stores.
const root=resolve('.migration/free-map-sky'),output=resolve('public/map-assets/sky-day.env');
await mkdir(root+'/public',{recursive:true});await copyFile('assets-source/free-map-01/sky-1k.hdr',root+'/public/sky.hdr');
await writeFile(root+'/index.html','<canvas width="128" height="128"></canvas><script type="module" src="/sky.ts"></script>');
await writeFile(root+'/sky.ts',`
import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {FreeCamera} from '@babylonjs/core/Cameras/freeCamera';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {HDRCubeTexture} from '@babylonjs/core/Materials/Textures/hdrCubeTexture';
import {HDRFiltering} from '@babylonjs/core/Materials/Textures/Filtering/hdrFiltering';
import {CreateEnvTextureAsync} from '@babylonjs/core/Misc/environmentTextureTools';
const engine=new Engine(document.querySelector('canvas')!,false),scene=new Scene(engine);new FreeCamera('camera',new Vector3(0,0,-1),scene);engine.runRenderLoop(()=>scene.render());
let texture:HDRCubeTexture;
new Promise<void>((resolve,reject)=>{texture=new HDRCubeTexture('/sky.hdr',scene,128,false,true,false,false,resolve,reject);}).then(async()=>{await new HDRFiltering(engine,{quality:64}).prefilter(texture);(window as any).skyResult=Array.from(new Uint8Array(await CreateEnvTextureAsync(texture)));}).catch(e=>{(window as any).skyFailure=String(e);});
`);
await build({configFile:false,root,logLevel:'warn',build:{outDir:'dist',emptyOutDir:true}});
const server=await preview({configFile:false,root,build:{outDir:'dist'},preview:{host:'127.0.0.1',port:4182,strictPort:true}});
let browser;
try{
 browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage();await page.goto('http://127.0.0.1:4182');await page.waitForFunction(()=>window.skyResult||window.skyFailure,null,{timeout:90000});
 const result=await page.evaluate(()=>({data:window.skyResult,error:window.skyFailure}));if(result.error)throw Error(result.error);await writeFile(output,Buffer.from(result.data));console.log('Prefiltered 128px / quality64 offline environment', (await readFile(output)).length,'bytes');
}finally{await browser?.close();await new Promise(r=>server.httpServer.close(r));}
