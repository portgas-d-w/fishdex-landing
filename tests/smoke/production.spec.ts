import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { SPECIES } from '../../src/game/catalog';
import { emptySave, recordCatch, purchase } from '../../src/game/save';

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
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  expect(await page.evaluate(() => '__fishingQA' in window)).toBe(false);
  expect(models).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/smoke-${info.project.name}-lake.png` });
  await page.locator('[data-spot="reeds"]').click();
  await page.locator('#sound').click();
  await expect(page.locator('#sound')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#action').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'bite');
  await page.locator('#action').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'fighting');
  const bounds = (await page.locator('#action').boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + 20;
  const touch = info.project.name === 'mobile' ? await context.newCDPSession(page) : undefined;
  let held = false;
  const setHeld = async (next: boolean) => {
    if (held === next) return;
    if (touch) await touch.send('Input.dispatchTouchEvent', { type: next ? 'touchStart' : 'touchEnd', touchPoints: next ? [{ x, y }] : [] });
    else { await page.mouse.move(x, y); if (next) await page.mouse.down(); else await page.mouse.up(); }
    held = next;
  };
  await setHeld(true);
  await expect(page.locator('#action')).toHaveClass(/reeling/);
  if (touch) {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 5, y: 300 }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    held = false;
  } else {
    await page.mouse.move(5, 300); await page.mouse.up(); held = false;
  }
  await expect(page.locator('#action')).not.toHaveClass(/reeling/);
  const deadline = Date.now() + 80_000;
  while (Date.now() < deadline && await page.locator('body').getAttribute('data-phase') === 'fighting') {
    const tension = Number((await page.locator('#tension-meter').getAttribute('aria-valuenow')) || 0);
    const pulling = (await page.locator('#fight-note').textContent())?.startsWith('Il tire');
    await setHeld(tension < (pulling ? 35 : 65));
    await page.waitForTimeout(100);
  }
  await setHeld(false);
  await expect(page.locator('#caught')).toBeVisible();
  await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('#preview-error')).toBeHidden();
  expect(models).toHaveLength(1);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/smoke-${info.project.name}-catch.png` });
  await page.locator('#release-fish').click();
  await page.reload();
  await expect(page.locator('#collection-count')).toHaveText(`1 / ${SPECIES.length}`);
  await page.locator('#collection-open').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-save').click();
  const download = await downloadPromise;
  const bytes = await readFile((await download.path())!);
  expect(JSON.parse(bytes.toString()).total).toBe(1);
  await page.evaluate(() => localStorage.removeItem('au-fil-de-leau.save.v1'));
  await page.reload();
  await expect(page.locator('#collection-count')).toHaveText(`0 / ${SPECIES.length}`);
  await page.locator('#collection-open').click();
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
  await page.locator('#shop-open').click(); await page.locator('[data-buy="balanced"]').click(); await page.locator('[data-equip="balanced"]').click();
  await expect(page.locator('#shop-balance')).toContainText('Canne souple'); await page.locator('[data-close="shop"]').click();
  await page.locator('#aquarium-open').click(); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded', 'true');
  await page.locator('#aq-plants').check(); await page.locator('#aq-rocks').check(); await page.locator('#aq-floor').selectOption('gravel');
  await page.locator('#aquarium').evaluate(e => e.scrollTop = 0); await page.screenshot({ path: `test-results/smoke-${info.project.name}-aquarium.png` });
  await page.locator('[data-aq-view="build-2"]').click(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('#photo-state')).toContainText('Photo conservée'); await page.locator('#release-fish').click();
  await page.locator('[data-aq-remove="build-0"]').click(); await expect(page.locator('#aquarium-state')).toContainText('4 / 5');
  await page.locator('[data-close="aquarium"]').click(); await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));
  expect(stored.total).toBe(5); expect(stored.xp).toBe(seed.xp); expect(stored.coins).toBe(seed.coins - 70); expect(stored.equipped).toBe('balanced');
  expect(stored.favorites).toHaveLength(4); expect(stored.aquarium.floor).toBe('gravel');
  await page.locator('#collection-open').click(); await expect(page.locator('[data-photo="build-2"] img')).toBeVisible(); await page.locator('[data-close="collection"]').click();
  await page.locator('#dex-open').click(); await page.locator('#dex-state').selectOption('playable'); await expect(page.locator('.dex-card')).toHaveCount(SPECIES.length);
  await page.locator('#dex-search').fill('gardon'); await expect(page.locator('.dex-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});
