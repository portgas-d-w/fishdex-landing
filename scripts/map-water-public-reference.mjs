import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const url=process.env.GAME_URL??'https://www.fishdex.fr',folder=process.argv[2]??'docs/apercus/carte-eau';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const rows=[];
try{for(const [name,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));
 await page.goto(url);await page.locator('body[data-ready=true]').waitFor({state:'attached'});await page.waitForTimeout(2000);
 const metrics=await page.evaluate(()=>{
  const resources=performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize,duration:r.duration}));
  const canvas=document.querySelector('#world');
  return {finalUrl:location.href,userAgent:navigator.userAgent,navigation:performance.getEntriesByType('navigation').map(n=>({transferSize:n.transferSize,encodedBodySize:n.encodedBodySize,decodedBodySize:n.decodedBodySize,domContentLoaded:n.domContentLoadedEventEnd})),resources,totals:resources.reduce((s,r)=>({transferSize:s.transferSize+r.transferSize,encodedBodySize:s.encodedBodySize+r.encodedBodySize,decodedBodySize:s.decodedBodySize+r.decodedBodySize}),{transferSize:0,encodedBodySize:0,decodedBodySize:0}),canvas:{width:canvas.width,height:canvas.height},initialFishGlbs:resources.filter(r=>r.name.endsWith('.glb')).length,qa:'__fishingQA' in window};
 });
 await page.screenshot({path:`${folder}/production-${name}-jetty.png`});
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#water-tools-open').click();
 await page.screenshot({path:`${folder}/production-${name}-water-tools.png`});
 rows.push({name,viewport,coldContext:true,throttling:false,...metrics,errors});await context.close();
}}finally{await browser.close();}
await writeFile(`${folder}/production-cold.json`,JSON.stringify({date:new Date().toISOString(),url,device:'Windows Chromium SwiftShader; aucun appareil physique',rows},null,2)+'\n');
console.log(JSON.stringify(rows.map(({name,totals,initialFishGlbs,qa,errors})=>({name,totals,initialFishGlbs,qa,errors}))));
