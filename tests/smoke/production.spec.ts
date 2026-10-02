import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { SPECIES } from '../../src/game/catalog';
import { recordCatch, purchase } from '../../src/game/save';
import {legacySave as emptySave,oldV4} from '../support/legacy';
import { openMenuPage } from '../browser/helpers';
import { realFishing } from './controls';

test.beforeEach(async ({ context }) => {
  const token = process.env.VERCEL_OIDC_TOKEN;
  if (!token || !process.env.GAME_URL) return;
  const origin = new URL(process.env.GAME_URL).origin;
  await context.route(`${origin}/**`, route => route.continue({
    headers: { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': token },
  }));
});

test('Le build permet une vraie prise, le chargement différé et le transfert du carnet', async ({ page, context }, info) => {
  const errors: string[] = [];
  const models: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (request.url().endsWith('.glb')) models.push(request.url()); });
  await page.addInitScript(() => { Math.random = () => 0; localStorage.setItem('au-fil-de-leau.gestures.v3', '3'); });
  await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},oldV4());
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  expect(await page.evaluate(() => '__fishingQA' in window)).toBe(false);
  expect(models).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/smoke-${info.project.name}-lake.png` });
  await openMenuPage(page, 'help-open');
  await page.locator('#sound').click();
  await expect(page.locator('#sound')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-close="help"]').click(); await page.locator('[data-close="menu"]').click();
  const fightPicture = expect(page.locator('body')).toHaveAttribute('data-phase', 'fighting').then(async () => {
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/smoke-${info.project.name}-fight.png` });
  });
  await realFishing(page, context, info.project.name === 'mobile');
  await fightPicture;
  await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('#preview-error')).toBeHidden();
  expect(models).toHaveLength(1);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/smoke-${info.project.name}-catch.png` });
  await page.locator('#release-fish').click();
  await page.reload();
  await expect(page.locator('#collection-count')).toHaveText(`1 / ${SPECIES.length}`);
  await openMenuPage(page, 'collection-open');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-save').click();
  const download = await downloadPromise;
  const bytes = await readFile((await download.path())!);
  expect(JSON.parse(bytes.toString()).total).toBe(1);
  await page.evaluate(() => localStorage.removeItem('au-fil-de-leau.save.v1'));
  await page.reload();
  await expect(page.locator('#collection-count')).toHaveText(`0 / ${SPECIES.length}`);
  await openMenuPage(page, 'collection-open');
  await page.locator('#save-file').setInputFiles({ name: 'carnet.json', mimeType: 'application/json', buffer: bytes });
  await expect(page.locator('#import-review')).toBeVisible();
  await page.locator('#confirm-import').click();
  await expect(page.locator('#collection-count')).toHaveText(`1 / ${SPECIES.length}`);
  expect(errors).toEqual([]);
});

test('Les quinze GLB servis sont intacts et les originaux restent exclus', async ({ request }) => {
  const headers = process.env.VERCEL_OIDC_TOKEN ? { 'x-vercel-trusted-oidc-idp-token': process.env.VERCEL_OIDC_TOKEN } : {};
  const manifestResponse = await request.get('/models/manifest.json', { headers });
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.models).toHaveLength(SPECIES.length);
  for (const model of manifest.models) {
    const response = await request.get(`/models/${model.model}.glb`, { headers });
    expect(response.ok()).toBe(true);
    const data = await response.body();
    expect(data.length).toBe(model.bytes);
    expect(data.subarray(0, 4).toString()).toBe('glTF');
    expect(data.readUInt32LE(4)).toBe(2);
    expect(data.readUInt32LE(8)).toBe(data.length);
  }
  const original = await request.get('/assets-source/riverfishpack.zip', { headers });
  expect((await original.body()).subarray(0, 2).toString()).not.toBe('PK');
});

test('Le build livre l’atelier, les lots, les ensembles et le catalogue documenté sans achat fictif', async ({ page }) => {
  const seed = emptySave(); seed.coins = 80;
  await page.addInitScript(data => {
    if (!localStorage.getItem('au-fil-de-leau.save.v1')) localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data));
  }, seed);
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await page.locator('#prepare-open').click();
  await expect(page.locator('[data-work-tab="rod"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.rod-pin')).toHaveCount(6);
  await page.locator('[data-work-rig]').first().click(); await page.locator('#rig-depth').fill('0.5');
  await page.locator('#rig-depth').dispatchEvent('change'); await page.locator('#rig-done').click();
  await page.locator('[data-work-tab="sets"]').click(); await page.locator('#preset-name').fill('Bordure livrée');
  await page.locator('#preset-save').click(); await expect(page.locator('[data-preset]')).toHaveCount(1);
  await page.locator('[data-close="preparation"]').click(); await openMenuPage(page, 'shop-open');
  await page.locator('[data-component-buy="corn"]').click(); await page.locator('#component-count').fill('2');
  await expect(page.locator('#component-total')).toContainText('16 écus'); await page.locator('#component-confirm').click();
  await page.locator('#library-load-shop').click(); await expect(page.locator('#library-list-shop [data-research]')).toHaveCount(84);
  await page.locator('#library-type-shop').selectOption('Montages'); await expect(page.locator('#library-list-shop [data-research]')).toHaveCount(55);
  await page.locator('#library-query-shop').fill('waggler'); await page.locator('[data-research="montages:waggler_coulissant"]').click();
  await expect(page.locator('#research-sheet')).toContainText('Adaptation prototype disponible'); await expect(page.locator('#research-sheet [data-component-buy]')).toHaveCount(0);
  await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));
  expect(stored.version).toBe(6); expect(stored.tackle.config.depth).toBe(0.5);
  expect(stored.tackle.presets).toHaveLength(1); expect(stored.tackle.stock.corn).toBe(30); expect(stored.coins).toBe(64);
  await page.locator('#prepare-open').click(); await page.locator('[data-work-tab="bag"]').click();
  await expect(page.locator('#bag-items [data-component-info="corn"]')).toBeVisible();
});

test('Nouvelle partie livrée : kit au coup, trois postes et vraie capture sans moulinet ni QA',async({page,context},info)=>{
 await page.addInitScript(()=>{Math.random=()=>0;localStorage.setItem('au-fil-de-leau.gestures.v3','3');});
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);await expect(page.locator('body')).toHaveAttribute('data-method','pole');
 await page.locator('#prepare-open').click();await expect(page.locator('[data-slot="elastic"]')).toBeVisible();await expect(page.locator('[data-slot="reel"]')).toHaveCount(0);await page.locator('[data-work-tab="bag"]').click();await page.locator('#bag-search').fill('flotteur');expect(await page.locator('#bag-items .compact-row').count()).toBeGreaterThanOrEqual(1);await page.locator('[data-close="preparation"]').click();
 await page.locator('#map-open').click();await expect(page.locator('#map [data-state="open"]')).toHaveCount(3);await page.locator('#map [data-post="reed-bank"]').click();await expect(page.locator('#post-select')).toBeDisabled();await expect(page.locator('#post-sheet')).toContainText('Niveau 3 OU 2');await page.screenshot({path:`test-results/smoke-${info.project.name}-map.png`});for(const p of ['cove','bank']){await page.locator(`#map [data-post="${p}"]`).click();await page.locator('#post-select').click();await expect(page.locator('body')).toHaveAttribute('data-post',p);await page.locator('#map-open').click();}await page.locator('#map [data-post="point"]').click();await expect(page.locator('#post-select')).toBeDisabled();await expect(page.locator('#post-sheet')).toContainText('Niveau 6 OU 6');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(saved.version).toBe(6);expect(saved.progression.methods).toEqual(['pole']);expect(saved.coins).toBe(0);expect(saved.total).toBe(0);
 await page.locator('#map [data-post="jetty"]').click();await page.locator('#post-select').click();await realFishing(page,context,info.project.name==='mobile',true);await expect(page.locator('#reel-control')).toBeHidden();await expect(page.locator('#catch-progression')).toContainText('initiation');const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(after.journal[0].method).toBe('pole');
});

test('Le build conserve les favoris, le décor, les achats et les portraits sans rejouer les récompenses', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const seed = emptySave();
  for (const [i, fish] of SPECIES.slice(0, 5).entries()) {
    recordCatch(seed, { id: `build-${i}`, speciesId: fish.id, length: fish.min + 10, date: '2026-10-01T12:00:00Z', coloration: i === 2 ? 'golden' : 'natural' });
    seed.favorites.push(`build-${i}`);
  }
  purchase(seed, 'plants'); purchase(seed, 'rocks');
  await page.addInitScript(data => { if (!localStorage.getItem('au-fil-de-leau.save.v1')) localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)); }, seed);
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await openMenuPage(page, 'shop-open'); await page.locator('#shop [data-buy="balanced"]').click(); await page.locator('#purchase-yes').click(); await page.locator('#shop [data-equip="balanced"]').click();
  await expect(page.locator('#shop-balance')).toContainText('Canne souple'); await page.locator('[data-close="shop"]').click();
  await openMenuPage(page, 'aquarium-open'); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded', 'true');
  await page.locator('#aq-plants').check(); await page.locator('#aq-rocks').check(); await page.locator('#aq-floor').selectOption('gravel');
  await page.locator('#aquarium').evaluate(e => e.scrollTop = 0); await page.screenshot({ path: `test-results/smoke-${info.project.name}-aquarium.png` });
  await page.locator('[data-aq-view="build-2"]').click(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('#photo-state')).toContainText('Photo conservée'); await page.locator('#release-fish').click();
  await page.locator('[data-aq-remove="build-0"]').click(); await expect(page.locator('#aquarium-state')).toContainText('4 / 5');
  await page.locator('[data-close="aquarium"]').click(); await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));
  expect(stored.total).toBe(5); expect(stored.xp).toBe(seed.xp); expect(stored.coins).toBe(seed.coins - 70); expect(stored.equipped).toBe('balanced');
  expect(stored.favorites).toHaveLength(4); expect(stored.aquarium.floor).toBe('gravel');
  await openMenuPage(page, 'collection-open'); await expect(page.locator('[data-photo="build-2"] img')).toBeVisible(); await page.locator('[data-close="collection"]').click();
  await openMenuPage(page, 'dex-open'); await page.locator('#dex-state').selectOption('playable'); await expect(page.locator('.dex-tile')).toHaveCount(SPECIES.length);
  await page.locator('#dex-search').fill('gardon'); await expect(page.locator('.dex-tile')).toHaveCount(1);
  expect(errors).toEqual([]);
});
