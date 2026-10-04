import {test, expect} from '@playwright/test';
import {legacySave} from '../support/legacy';
import {openMenuPage} from './helpers';

for (const advanced of [false,true]) test(`Référence et parcours UI ${advanced?'avancé':'vierge'}`,async({page},info)=>{
  const save=legacySave(); if(advanced){save.xp=10000;save.coins=500;save.tackle.stock.corn=15;}
  await page.addInitScript(({save,advanced})=>{localStorage.setItem('au-fil-de-leau.gestures.v3','3');if(advanced&&!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(save));},{save,advanced});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
  for(const [entry,dialog] of [['equipment-open','preparation'],['shop-open','shop'],['dex-open','encyclopedia'],['progress-open','progression'],['locations-open','locations'],['collection-open','collection'],['help-open','help']]){
    await openMenuPage(page,entry);await expect(page.locator(`#${dialog}`)).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`docs/apercus/refonte-ui/${process.env.UI_STAGE??'avant'}/${info.project.name}-${advanced?'avance':'vierge'}-${dialog}.png`});
    await page.locator(`[data-close="${dialog}"]`).first().click();
  }
  expect(errors).toEqual([]);
});

test('Lot 01 : retours de fiche, recherche, réserve inchangée et dispositions étroites',async({page},info)=>{
  await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));
  await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await page.locator('#prepare-open').click();await page.locator('[data-work-rig]').first().click();
  await page.locator('[data-slot="bait"]').click();
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!).tackle.stock);
  await page.locator('[data-component-info="kit-worm"]').click();await expect(page.locator('#component-detail')).toBeVisible();
  await page.locator('[data-close="component-detail"]').click();await expect(page.locator('[data-choose-component="kit-worm"]')).toBeVisible();
  await page.locator('[data-close="component-sheet"]').click();await expect(page.locator('#rig-sheet')).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!).tackle.stock)).toEqual(before);
  await page.locator('#rig-done').click();await page.locator('[data-work-tab="bag"]').click();
  await page.locator('#bag-search').fill('inexistantzz');await expect(page.locator('#bag-items')).toContainText('Aucun objet trouvé');
  await page.locator('#bag-reset').click();await expect(page.locator('#bag-search')).toHaveValue('');
  for(const [width,height] of [[320,740],[430,932],[844,390]]){
    await page.setViewportSize({width,height});
    const overflow=await page.locator('#preparation').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth,children:[...e.querySelectorAll('*')].filter(x=>x.getBoundingClientRect().right>e.getBoundingClientRect().right).map(x=>[x.tagName,x.id,x.className,x.getBoundingClientRect().width])}));expect(overflow.scroll,JSON.stringify({width,...overflow})).toBeLessThanOrEqual(overflow.width+1);
    await page.screenshot({path:`docs/apercus/refonte-ui/01-apres/${info.project.name}-${width}-sac.png`});
  }
});
