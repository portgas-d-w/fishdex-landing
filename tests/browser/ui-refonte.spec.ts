import {test, expect} from '@playwright/test';
import {legacySave} from '../support/legacy';
import {openMenuPage} from './helpers';
import {emptySave,recordCatch} from '../../src/game/save';

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

test('Lot 02 : inconnus, conseil débutant, préparation explicite, filtres et recharge',async({page},info)=>{
  const seed=emptySave();recordCatch(seed,{id:'ui-roach',speciesId:'roach',length:20,date:'2026-10-04T00:00:00Z',method:'pole'});
  await page.addInitScript(s=>{localStorage.setItem('au-fil-de-leau.gestures.v3','3');if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},seed);
  await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'dex-open');
  await expect(page.locator('.dex-tile')).toHaveCount(66);await expect(page.locator('#dex-progress')).toContainText('1 / 66');
  await page.locator('#dex-search').fill('brochet');await expect(page.locator('.dex-tile')).toHaveCount(0);
  await page.locator('#dex-search').fill('002');await page.locator('.dex-tile').click();await expect(page.locator('#species-sheet-title')).toContainText('À découvrir');
  await expect(page.locator('#species-sheet')).not.toContainText('Perche');await expect(page.locator('#species-sheet img')).not.toHaveAttribute('alt',/Perche/i);
  await page.locator('[data-close="species-sheet"]').click();await page.locator('#dex-search').fill('gardon');await page.locator('.dex-tile').click();
  await expect(page.locator('#species-sheet')).toContainText('Coup à canne télescopique');await expect(page.locator('#species-sheet')).not.toContainText('Modèle exact du pack');
  const previous=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'));
  await page.screenshot({path:`docs/apercus/refonte-ui/${process.env.UI_STAGE??'02-apres'}/${info.project.name}-gardon-decouvert.png`});
  await page.locator('#species-prepare').click();await expect(page.locator('#encounter-advice')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(previous);
  await page.locator('[data-close="preparation"]').click();await expect(page.locator('#species-sheet')).toBeVisible();
  await page.locator('[data-close="species-sheet"]').click();await expect(page.locator('#dex-search')).toHaveValue('gardon');
  await page.locator('#dex-search').fill('');await page.locator('#dex-habitat').selectOption('here');const here=await page.locator('.dex-tile').count();expect(here).toBeLessThan(66);expect(here).toBeGreaterThan(0);
  await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'dex-open');await expect(page.locator('#dex-progress')).toContainText('1 / 66');
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
    await page.screenshot({path:`docs/apercus/refonte-ui/${process.env.UI_STAGE??'01-apres'}/${info.project.name}-${width}-sac.png`});
  }
});

test('Lot 03 : objectif suivi, 22 techniques, carte locale et observation utile',async({page},info)=>{
 await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await openMenuPage(page,'progress-open');await expect(page.locator('#progress-view')).toContainText('Ma première capture');
 await page.locator('[data-progress-tab="techniques"]').click();await expect(page.locator('[data-progress-technique]')).toHaveCount(22);
 await page.locator('[data-follow-goal="tech:feeder"]').click();await page.locator('[data-progress-tab="path"]').click();await expect(page.locator('#progress-view .next-step').first()).toContainText('Feeder');
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'progress-open');await expect(page.locator('#progress-view .next-step').first()).toContainText('Feeder');
 await page.locator('[data-goal-unfollow]').click();await expect(page.locator('#progress-view .next-step').first()).toContainText('Ma première capture');
 await page.locator('#progress-map').click();await expect(page.locator('#map [data-post]')).toHaveCount(6);await page.locator('[data-post="reed-bank"]').click();await expect(page.locator('#post-select')).toBeDisabled();await expect(page.locator('#post-sheet')).toContainText('Niveau 3 OU 2');
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));
 await page.locator('#map-other').click();await page.locator('[data-location="running-river"]').click();await page.locator('[data-preview-post="river"]').click();await expect(page.locator('#map [data-post]')).toHaveCount(1);await expect(page.locator('#post-select')).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!).preparation.post)).toBe(before.preparation.post);
 await page.screenshot({path:`docs/apercus/refonte-ui/${process.env.UI_STAGE??'03-apres'}/${info.project.name}-riviere-verrouillee.png`});
 for(const id of ['map','location-sheet','locations','progression'])if(await page.locator(`#${id}`).isVisible())await page.locator(`[data-close="${id}"]`).click();
 await openMenuPage(page,'observe-open');await expect(page.locator('#observation-destinations [data-preview-post]')).not.toHaveCount(0);await page.locator('#observation-destinations [data-preview-post]').first().click();await expect(page.locator('#map')).toBeVisible();
});
