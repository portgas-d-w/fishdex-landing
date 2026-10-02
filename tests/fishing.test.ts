import { encounterWeight } from '../src/game/profiles.ts';
import { starterConfig } from '../src/game/rig.ts';
import { hookFish, manageFight } from './support/combat.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame } from '../src/game/fishing.ts';
import { LEGACY_SPECIES, SPECIES } from '../src/game/catalog.ts';
import { emptySave, loadSave, parseSave, persistSave, recordCatch } from '../src/game/save.ts';

function advance(game: FishingGame, seconds: number) { for (let i = 0; i < seconds * 60; i++) game.update(1 / 60); }
function hooked(random = 0) {
  const game = new FishingGame(() => random); game.cast(); advance(game, 1.2); advance(game, 7.1); game.strike();
  assert.equal(game.phase, 'fighting'); return game;
}
test('Les appâts proposés respectent le régime ; espèces absentes jamais sélectionnées', () => {
 const worm=starterConfig(),lure=starterConfig('lure');
 for (const spot of ['reeds','open','willow'] as const) for(const depth of [.4,1,2,4]) {
  for(const id of ['pike','zander'] as const)assert.equal(encounterWeight(id,spot,worm,4,depth),0);
  for(const id of ['roach','carp'] as const)assert.equal(encounterWeight(id,spot,lure,4,depth),0);
 }
});
test('Chaque poisson reste accessible avec le kit dans un habitat et une strate adaptés',()=>{
 const found=new Set();for(const spot of ['reeds','open','willow'] as const)for(const method of ['float','bottom','lure'] as const)for(const depth of [.4,1,2,4])for(const fish of SPECIES.filter(f=>LEGACY_SPECIES.some(s=>s.id===f.id)))if(encounterWeight(fish.id,spot,starterConfig(method),4,depth)>0)found.add(fish.id);
 assert.equal(found.size,LEGACY_SPECIES.length);
});

test('Ignorer une touche fait perdre le poisson sans enregistrer de prise', () => {
  const game = new FishingGame(() => 0); game.cast(); advance(game, 10);
  assert.equal(game.phase, 'lost'); assert.equal(game.result, null);
});
test('Mouliner en permanence finit par casser le fil', () => {
  const game = hookFish(SPECIES.find(s => s.id === 'pike')!); game.orient(-1, 1); for (let i = 0; i < 1800 && game.phase === 'fighting'; i++) { game.reel(2 / 60); game.update(1 / 60); }
  assert.equal(game.phase, 'lost'); assert.match(game.failure, /Rupture/);
});
test('Laisser le fil détendu trop longtemps fait décrocher le poisson', () => {
  const game = hooked(); game.orient(0, 0); game.lineLength += 8; advance(game, 10); assert.equal(game.phase, 'lost'); assert.match(game.failure, /décroché/);
});
test('Un combat géré ramène chacun des quinze poissons', () => {
  for (const fish of SPECIES) {
    const game = hookFish(fish);
    for (let i = 0; i < 60 * 80 && game.phase === 'fighting'; i++) {
      manageFight(game);
    }
    assert.equal(game.phase, 'caught', fish.name);
    assert.equal(game.result?.speciesId, fish.id);
    assert.ok(game.result!.length >= fish.min && game.result!.length <= fish.max);
  }
});
test('Le carnet garde le meilleur record et peut être exporté puis restauré', () => {
  const save = emptySave(); const date = '2026-09-30T18:00:00.000Z';
  assert.deepEqual(recordCatch(save, { speciesId: 'perch', length: 32, date }), { first: true, record: true, variant: true });
  assert.deepEqual(recordCatch(save, { speciesId: 'perch', length: 20, date }), { first: false, record: false, variant: false });
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
