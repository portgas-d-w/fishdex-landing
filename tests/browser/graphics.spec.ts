import {ensureLegacyProfile} from './helpers';
import {test,expect} from '@playwright/test';
import {openMenuPage} from './helpers';
test('Qualité élevée avec ombres limitées puis retour au rendu mobile, sans erreur de shader',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'settings-open');await page.locator('#quality').click();await expect(page.locator('#quality')).toHaveText('Qualité élevée');await page.locator('[data-close="settings"]').click();await page.locator('[data-close="menu"]').click();await page.waitForTimeout(1500);await page.screenshot({path:`test-results/regression/structure/final-${info.project.name}-high-lake.png`});await openMenuPage(page,'settings-open');await page.locator('#quality').click();await expect(page.locator('#quality')).toHaveText('Économie mobile');expect(errors).toEqual([]);
});
test('Sauvegarde corrompue récupérable, original conservé avant une nouvelle écriture',async({page})=>{
 const raw='{"version":99,"souvenir":"ne pas effacer"}';await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',s);},raw);
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'settings-open');await expect(page.locator('#export-recovery')).toBeVisible();await page.locator('#sound').click();expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.recovery'))).toBe(raw);const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(s.version).toBe(7);expect(s.total).toBe(0);
 const download=page.waitForEvent('download');await page.locator('#export-recovery').click();expect((await download).suggestedFilename()).toBe('au-fil-de-leau-recuperation.json');
});
