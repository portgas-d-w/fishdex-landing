import { legacySave as emptySave } from './support/legacy.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSave, recordCatch, purchase, toggleFavorite } from '../src/game/save.ts';
import { weightFor } from '../src/game/specimens.ts';
const caught = (id: string, length = 24) => ({ id, speciesId: 'roach' as const, length, date: '2026-10-01T12:00:00.000Z' });
test('Migration v1 conserve total et records sans fabriquer des individus ou gains', () => {
  const legacy = { version: 1, total: 8, records: { roach: { count: 8, best: 30, last: '2026-09-30T10:00:00Z' } }, settings: { sound: true, quality: 'eco' } };
  const save = parseSave(JSON.stringify(legacy)); assert.equal(save.version,6); assert.equal(save.total, 8); assert.equal(save.records.roach?.best, 30);
  assert.equal(save.journal.length, 0); assert.equal(save.coins, 0); assert.equal(save.xp, 0);
  recordCatch(save, caught('new')); assert.equal(save.total, 9); assert.deepEqual(parseSave(JSON.stringify(save)), save);
});
test('Capture, rémunération et XP uniques ; restauration sans rejeu', () => {
  const save = emptySave(); recordCatch(save, caught('one')); const coins = save.coins, xp = save.xp;
  recordCatch(save, caught('one')); assert.equal(save.total, 1); assert.equal(save.coins, coins); assert.equal(save.xp, xp);
  assert.equal(save.journal[0].weight, weightFor('roach', 24));
  assert.deepEqual(parseSave(JSON.stringify(save)), save);
});
test('Boutique effective, canne gratuite et favoris limités à cinq individus', () => {
  const save = emptySave(); assert.ok(purchase(save, 'balanced')); assert.deepEqual(save.inventory, ['starter','pole-starter']);
  for (let i = 0; i < 6; i++) recordCatch(save, caught(`fish-${i}`, 20 + i));
  const before = save.coins; assert.equal(purchase(save, 'balanced'), ''); assert.equal(save.coins, before - 70); assert.ok(purchase(save, 'balanced'));
  save.equipped = 'balanced';
  for (let i = 0; i < 5; i++) assert.equal(toggleFavorite(save, `fish-${i}`), '');
  assert.ok(toggleFavorite(save, 'fish-5')); assert.equal(save.favorites.length, 5);
  toggleFavorite(save, 'fish-0'); assert.equal(toggleFavorite(save, 'fish-5'), ''); assert.equal(save.favorites.length, 5);
  assert.deepEqual(parseSave(JSON.stringify(save)), save);
});
test('Import refuse journal dupliqué, monnaie négative, poids incohérent et favori orphelin', () => {
  const base = emptySave(); recordCatch(base, caught('one'));
  for (const mutate of [(s: typeof base) => s.journal.push(s.journal[0]), (s: typeof base) => s.coins = -1, (s: typeof base) => s.journal[0].weight = 40, (s: typeof base) => s.favorites.push('unknown'), (s: typeof base) => s.equipped = 'precision', (s: typeof base) => s.aquarium.rocks = true]) {
    const save = structuredClone(base); mutate(save); assert.throws(() => parseSave(JSON.stringify(save)));
  }
});
