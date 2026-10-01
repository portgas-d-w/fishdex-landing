import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame } from '../src/game/fishing.ts';
import { SPECIES, pickSpecies } from '../src/game/catalog.ts';
import { emptySave, loadSave, parseSave, persistSave, recordCatch } from '../src/game/save.ts';

function advance(game: FishingGame, seconds: number) { for (let i = 0; i < seconds * 60; i++) game.update(1 / 60); }
function hooked(random = 0) {
  const game = new FishingGame(() => random); game.cast(); advance(game, 1.2); advance(game, 7.1); game.strike();
  assert.equal(game.phase, 'fighting'); return game;
}
test('Le ver ne sélectionne aucun brochet ni sandre ; le leurre aucune carpe ni gardon', () => {
  for (const spot of ['reeds', 'open', 'willow'] as const) for (let i = 0; i <= 100; i++) {
    assert.ok(!['pike', 'zander'].includes(pickSpecies(spot, 'worm', i / 100).id));
    assert.ok(!['roach', 'carp'].includes(pickSpecies(spot, 'lure', i / 100).id));
  }
});
test('Tous les poissons sont accessibles depuis au moins une combinaison', () => {
  const found = new Set();
  for (const spot of ['reeds', 'open', 'willow'] as const) for (const bait of ['worm', 'lure'] as const) for (let i = 0; i < 100; i++) found.add(pickSpecies(spot, bait, i / 100).id);
  assert.equal(found.size, SPECIES.length);
});
test('Ignorer une touche fait perdre le poisson sans enregistrer de prise', () => {
  const game = new FishingGame(() => 0); game.cast(); advance(game, 10);
  assert.equal(game.phase, 'lost'); assert.equal(game.result, null);
});
test('Mouliner en permanence finit par casser le fil', () => {
  const game = hooked(); game.fish = SPECIES.find(s => s.id === 'pike')!; game.orient(-1, 1); for (let i = 0; i < 1800 && game.phase === 'fighting'; i++) { game.reel(2 / 60); game.update(1 / 60); }
  assert.equal(game.phase, 'lost'); assert.match(game.failure, /cassé/);
});
test('Laisser le fil détendu trop longtemps fait décrocher le poisson', () => {
  const game = hooked(); game.orient(0, 0); advance(game, 10); assert.equal(game.phase, 'lost'); assert.match(game.failure, /décroché/);
});
test('Un combat géré ramène chacun des quinze poissons', () => {
  for (const fish of SPECIES) {
    const game = hooked(); game.fish = fish;
    for (let i = 0; i < 60 * 80 && game.phase === 'fighting'; i++) {
      game.orient(game.direction, game.pulling ? 0.2 : 0.68); game.reel((game.pulling ? 0.1 : 1.6) / 60); game.update(1 / 60);
    }
    assert.equal(game.phase, 'caught', fish.name);
    assert.equal(game.result?.speciesId, fish.id);
    assert.ok(game.result!.length >= fish.min && game.result!.length <= fish.max);
  }
});
test('Le carnet garde le meilleur record et peut être exporté puis restauré', () => {
  const save = emptySave(); const date = '2026-09-30T18:00:00.000Z';
  assert.deepEqual(recordCatch(save, { speciesId: 'perch', length: 32, date }), { first: true, record: true });
  assert.deepEqual(recordCatch(save, { speciesId: 'perch', length: 20, date }), { first: false, record: false });
  assert.equal(save.records.perch!.best, 32); assert.equal(save.total, 2);
  assert.deepEqual(parseSave(JSON.stringify(save)), save);
});
test('Une sauvegarde corrompue, inconnue ou incohérente est refusée', () => {
  for (const data of [null, { version: 2 }, { version: 1, total: 0, records: { shark: {} } }, { version: 1, total: 4, records: {} }, { version: 1, total: 1, records: { perch: { count: 1, best: -100, last: 'not-a-date' } } }]) assert.throws(() => parseSave(JSON.stringify(data)));
  assert.throws(() => parseSave('x'.repeat(100001)));
});
test('Un stockage indisponible ne fait pas planter le jeu', () => {
  assert.equal(persistSave(emptySave(), { setItem() { throw new Error('quota'); } }), false);
  const loaded = loadSave({ getItem() { throw new Error('private'); } });
  assert.equal(loaded.data.total, 0); assert.ok(loaded.warning);
});
