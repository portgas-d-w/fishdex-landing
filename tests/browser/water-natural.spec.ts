import {test,expect} from '@playwright/test';
async function boot(page:any){
 await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!(window as any).__fishingQA);
 await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
}
test('Eau naturelle : surface et reflet perturbés, extinction et pause sans croissance',async({page})=>{
 await boot(page);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const result=await page.evaluate(async()=>{
  const q=(window as any).__fishingQA,scene=q.waterScene(),mat=scene.getMaterialByName('pond-water');q.waterQuality('standard');
  const before=q.snapshot();q.waterDemo('cast_impact');q.advance(.45);
  let effects=true;
  const observer=scene.onBeforeRenderObservable.add(()=>{
   mat.setFloat('time',30);mat.setFloat('waveCount',effects?q.water().water.activeSurfaceWaves:0);
   for(const m of scene.meshes)if(m.name.startsWith('water-contact-')||m.name.startsWith('water-drop-'))m.setEnabled(false);
  });
  async function pixels(){return new Promise<number[]>(resolve=>scene.onAfterRenderObservable.addOnce(async()=>resolve(Array.from(await scene.getEngine().readPixels(0,0,scene.getEngine().getRenderWidth(),scene.getEngine().getRenderHeight())))));}
  // Same scene, clock and reflection texture; disable only the shader's local perturbations.
  await pixels();effects=false;const calm=await pixels();effects=true;const disturbed=await pixels();
  let changed=0;for(let n=0;n<calm.length;n+=4)if(Math.abs(calm[n]-disturbed[n])+Math.abs(calm[n+1]-disturbed[n+1])+Math.abs(calm[n+2]-disturbed[n+2])>=4)changed++;
  const active=q.water().water.activeSurfaceWaves;await new Promise(r=>setTimeout(r,150));const paused=q.water().water.activeSurfaceWaves;
  scene.onBeforeRenderObservable.remove(observer);q.advance(3);await pixels();const expired=q.water().water.activeSurfaceWaves;
  return {changed,active,paused,expired,meshesBefore:before.totalMeshes,meshesAfter:q.snapshot().totalMeshes};
 });
 expect(result.changed).toBeGreaterThan(40);expect(result.active).toBeGreaterThan(0);expect(result.paused).toBe(result.active);expect(result.expired).toBe(0);expect(result.meshesAfter).toBe(result.meshesBefore);expect(errors).toEqual([]);
});
test('Eau naturelle : textures filtrées, qualités, reflet économe en cache et turbidité réglable',async({page})=>{
 await boot(page);
 const textures=await page.evaluate(()=>{
  const scene=(window as any).__fishingQA.waterScene();return scene.getMaterialByName('pond-water').getActiveTextures().filter((t:any)=>t.name==='pond-ripple-normals'||t.name==='pond-bathymetry-contacts').map((t:any)=>({name:t.name,size:t.getSize(),gamma:t.gammaSpace,mips:t.getInternalTexture().generateMipMaps,sampling:t.samplingMode,wrap:t.wrapU}));
 });
 const normals=textures.find((t:any)=>t.name==='pond-ripple-normals')!;expect(normals.size.width).toBe(128);expect(normals.gamma).toBe(false);expect(normals.mips).toBe(true);expect(normals.sampling).toBe(3);
 const depth=textures.find((t:any)=>t.name==='pond-bathymetry-contacts')!;expect(depth.size.width).toBe(256);expect(depth.wrap).toBe(0);
 const before=await page.evaluate(()=>(window as any).__fishingQA.snapshot().totalMeshes);
 for(let n=0;n<9;n++){
  await page.evaluate(q=>(window as any).__fishingQA.waterQuality(q),['low','standard','high'][n%3]);await page.waitForTimeout(100);
  expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().getMeshByName('water').isReady(true))).toBe(true);
 }
 await page.evaluate(()=>(window as any).__fishingQA.waterQuality('low'));await page.waitForTimeout(200);
 const a=await page.evaluate(()=>(window as any).__fishingQA.water());await page.waitForTimeout(300);const b=await page.evaluate(()=>(window as any).__fishingQA.water());
 expect(b.water.reflectionRenders).toBe(a.water.reflectionRenders);
 expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().customRenderTargets.length)).toBe(1);
 await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();await page.locator('#water-tools-open').click();
 await page.locator('#water-turbidity').focus();await page.locator('#water-turbidity').press('Home');for(let n=0;n<23;n++)await page.locator('#water-turbidity').press('ArrowRight');await expect(page.locator('#water-turbidity-value')).toHaveText('1.50');
 expect((await page.evaluate(()=>(window as any).__fishingQA.water())).water.turbidity).toBe(1.5);
 expect(await page.locator('#water-tools').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().totalMeshes)).toBe(before);
});
