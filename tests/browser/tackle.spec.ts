import {receiveByGesture,chooseComponent} from './helpers';
import {ensureLegacyProfile} from './helpers';
import { test, expect } from '@playwright/test';
import {legacySave as emptySave} from '../support/legacy';
import { starterConfig } from '../../src/game/rig';
import { castByGesture, openMenuPage, chooseMethod } from './helpers';

test('Atelier mobile/bureau, montage, achats, sac, ensemble, catalogue et retours stables',async({page},info)=>{
 const seed=emptySave();seed.coins=150;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},seed);
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.locator('#prepare-open').click();
 await expect(page.locator('[data-work-tab="rod"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.rod-pin')).toHaveCount(5);
 await page.screenshot({path:`test-results/regression/montages/${info.project.name}-canne.png`});
 await page.locator('[data-slot="rod"]').click();await expect(page.locator('[data-choose-rod="starter"]')).toBeVisible();await page.locator('[data-choose-rod="starter"]').click();
 await page.locator('[data-work-rig]').first().click();await expect(page.locator('.rig-part')).toHaveCount(6);await page.locator('#rig-depth').fill('0.4');await page.locator('#rig-depth').dispatchEvent('change');
 await expect(page.locator('#rig-depth')).toHaveValue('0.4');await page.screenshot({path:`test-results/regression/montages/${info.project.name}-montage.png`});await page.locator('#rig-done').click();
 await page.locator('[data-work-tab="sets"]').click();await page.locator('#preset-name').fill('Bordure');await page.locator('#preset-save').click();await expect(page.locator('[data-preset]')).toHaveCount(1);
 await page.locator('[data-work-tab="rod"]').click();await chooseMethod(page,'bottom');await page.locator('[data-work-rig]').first().click();await expect(page.locator('.rig-float')).toHaveCount(0);await expect(page.locator('.rig-weight')).toBeVisible();await page.locator('#rig-done').click();
 await page.locator('[data-work-tab="sets"]').click();await page.locator('[data-preset]').click();await page.locator('[data-work-tab="rod"]').click();await expect(page.locator('[data-work-rig]').first()).toContainText('Flotteur');
 await page.locator('[data-close="preparation"]').click();await openMenuPage(page,'shop-open');await page.locator('[data-component-buy="loaded-float"]').click();await page.locator('#component-count').fill('2');await expect(page.locator('#component-total')).toContainText('28 écus');await page.locator('#component-confirm').click();
 await page.locator('#library-shop > summary').click();await page.locator('#library-load-shop').click();await expect(page.locator('#library-list-shop [data-research]')).toHaveCount(84);await page.locator('#library-type-shop').selectOption('Montages');await expect(page.locator('#library-list-shop [data-research]')).toHaveCount(55);await page.locator('#library-query-shop').fill('waggler');await page.locator('[data-research="montages:waggler_coulissant"]').click();await expect(page.locator('#research-sheet')).toContainText('Adaptation prototype disponible');await expect(page.locator('#research-sheet [data-component-buy]')).toHaveCount(0);await page.locator('[data-close="research-sheet"]').click();await expect(page.locator('#library-query-shop')).toHaveValue('waggler');await page.locator('[data-close="shop"]').click();
 await openMenuPage(page,'equipment-open');await page.locator('[data-work-tab="bag"]').click();await expect(page.locator('#bag-items [data-component-info="loaded-float"]')).toBeVisible();await expect(page.locator('#bag-items')).toContainText('2 pièces');await page.screenshot({path:`test-results/regression/montages/${info.project.name}-sac.png`});
 await page.locator('[data-work-tab="rod"]').click();await page.locator('[data-work-rig]').first().click();await page.locator('[data-slot="float"]').click();await chooseComponent(page,'loaded-float');await expect(page.locator('#rig-sheet-validation')).toContainText('immerge');await page.locator('#rig-done').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.locator('#prepare-open').click();await expect(page.locator('[data-work-tab="rod"]')).toHaveAttribute('aria-pressed','true');await page.locator('[data-work-rig]').first().click();await expect(page.locator('.rig-float')).toContainText('préplombé');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(saved.version).toBe(7);expect(saved.coins).toBe(122);expect(saved.tackle.stock['loaded-float']).toBe(2);expect(saved.tackle.presets).toHaveLength(1);expect(errors).toEqual([]);
});

test('Stock manquant bloque le lancer, preset explique le manque et kit à zéro argent relance',async({page})=>{
 const seed=emptySave();seed.tackle.config.components.bait='corn';seed.tackle.presets=[{id:'missing',name:'Maïs absent',rod:'starter',config:structuredClone(seed.tackle.config)}];
 await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},seed);
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 const w=page.viewportSize()!.width,h=page.viewportSize()!.height;await page.mouse.move(w*.45,h*.8);await page.mouse.down();await page.mouse.move(w*.45,h*.45,{steps:8});await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');await expect(page.locator('#toast')).toContainText('stock insuffisant');
 await page.locator('#prepare-open').click();await page.locator('[data-work-tab="sets"]').click();await page.locator('[data-preset]').click();await expect(page.locator('#preset-error')).toContainText('Maïs');await page.locator('[data-starter]').click();await page.locator('[data-close="preparation"]').click();await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(20));await expect(page.locator('body')).toHaveAttribute('data-phase','bite');await page.locator('#strike').click();await page.evaluate(()=>(window as any).__fishingQA.advance(100,'smart'));await receiveByGesture(page);await expect(page.locator('#caught')).toBeVisible();await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');
});

test('Ligne en service et reprise : matériel figé, réservation persistée puis libérée sans doublon',async({page})=>{
 const seed=emptySave();seed.tackle.stock.corn=3;seed.tackle.config=starterConfig('bottom');seed.tackle.config.components.bait='corn';seed.preparation.method='bottom';
 await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},seed);
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());await castByGesture(page);await openMenuPage(page,'equipment-open');await page.locator('[data-slot="main_line"]').click();await page.locator('[data-choose-component="kit-line"]').click();await expect(page.locator('#toast')).toContainText('Ramenez la ligne');await page.locator('[data-close="component-sheet"]').click();
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(saved.tackle.stock.corn).toBe(2);expect(saved.tackle.active.resolved).toBe(true);expect(saved.total).toBe(0);
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(saved.tackle.stock.corn).toBe(2);
});
