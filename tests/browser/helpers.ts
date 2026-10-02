import { expect, type Page } from '@playwright/test';
export async function chooseMethod(page:Page,method:string) {
  await page.locator('[data-slot="method"]').click();
  await page.locator(`[data-choose-method="${method}"]`).click();
}
export async function castByGesture(page: Page) {
  const size = page.viewportSize()!;
  await page.mouse.move(size.width * 0.45, size.height * 0.80); await page.mouse.down();
  await page.mouse.move(size.width * 0.45, size.height * 0.45, { steps: 8 }); await page.mouse.up();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'casting');
}
export async function openMenuPage(page: Page, id: string) {
  if (!await page.locator('#menu').isVisible()) await page.locator('#menu-open').click();
  await page.locator(`#${id}`).click();
}
export async function holdMouseReel(page: Page) {
  const b = (await page.locator('#reel-control').boundingBox())!;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
}

import {legacySave} from '../support/legacy';
// Régressions des parcours déjà ouverts avant 0.8 ; la nouvelle partie a ses tests dédiés.
export async function ensureLegacyProfile(page:Page){await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},legacySave());}
