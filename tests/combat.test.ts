import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame } from '../src/game/fishing.ts';
import { SPECIES } from '../src/game/catalog.ts';
import { wheelTurns } from '../src/game/reeling.ts';
import { stepCombat } from '../src/game/combat.ts';
import { hookFish, manageFight } from './support/combat.ts';

test('La molette accepte les deux sens et normalise ses unités', () => {
  assert.equal(wheelTurns(-100), wheelTurns(100));assert.equal(wheelTurns(NaN), 0);assert.equal(wheelTurns(10, 1), wheelTurns(160));
});
test('Un appui immobile récupère du fil jusqu’au relâchement ; transitions et reset arrêtent la commande', () => {
 const g=hookFish(SPECIES[0]);g.holdReel(true);const before=g.lineLength;
 for(let i=0;i<30;i++)g.update(1/60);assert.ok(g.lineLength<before);assert.equal(g.reelSpeed,1.6);assert.equal(g.reeling,true);
 g.holdReel(false);assert.equal(g.reeling,false);g.update(1/60);assert.equal(g.reelSpeed,0);
 g.holdReel(true);g.reset();assert.equal(g.reeling,false);g.holdReel(true);assert.equal(g.reeling,false);
 const lure=new FishingGame(()=>0);lure.setMethod('lure');lure.cast();for(let i=0;i<72;i++)lure.update(1/60);lure.holdReel(true);
 for(let i=0;i<360&&lure.phase==='waiting';i++)lure.update(1/60);assert.equal(lure.phase,'bite');assert.equal(lure.reeling,false);
});
test('Une impulsion de molette s’épuise ; release interrompt immédiatement les tours en attente', () => {
  const g = new FishingGame(() => 0); g.cast(); g.phase = 'bite'; g.strike();
  g.reel(0.2); for (let i = 0; i < 15; i++) g.update(1 / 60);
  assert.equal(g.reeling, false); g.reel(0.4); g.release();
  assert.equal(g.reeling, false); g.update(1 / 60); assert.equal(g.reelSpeed, 0);
});

const input = { yaw: 0, lift: .28, bearing: 0, force: 1.4, power: 1, reelSpeed: 0, motion: 'burst' as const };
const state = { distance: 10, lineLength: 9.8, tension: .5, fatigue: 0 };
function simulate(speed: number, force = 1.4, motion: 'burst' | 'return' = 'burst', seconds = 2) {
  let next = stepCombat(state, { ...input, reelSpeed: speed, force, motion }, 1/60);
  for (let i = 1; i < seconds*60; i++) next = stepCombat(next, { ...input, reelSpeed: speed, force, motion }, 1/60);
  return next;
}
test('Un départ maintient la traction sans moulinage et le frein rend du fil', () => {
  const next = simulate(0); assert.ok(next.tension > .6 && next.tension < .97); assert.ok(next.lineLength > state.lineLength); assert.ok(next.dragSpeed > .2);
});
test('Le frein et la résistance mécanique évitent une pénalité de bouton', () => {
  const gentle = simulate(0), forced = simulate(2.4);
  assert.ok(forced.tension < .97);assert.ok(forced.tension >= gentle.tension);assert.ok(forced.dragSpeed > 0);
});
test('Un retour crée du mou ; récupérer le fil rétablit le contact dans ce même mouvement', () => {
  const idle = simulate(0, 1, 'return'), reel = simulate(1.6, 1, 'return');
  assert.ok(idle.slack > .3); assert.ok(idle.tension < .025); assert.ok(reel.slack < idle.slack); assert.ok(reel.tension > .1);
});
test('La force relative permet de ramener un petit poisson pendant son départ', () => {
  const small = simulate(1.6, .5), large = simulate(1.6, 1.4);
  assert.ok(small.distance < state.distance); assert.ok(large.distance > state.distance);
});
test('Orientation et hauteur modifient progressivement les forces, sans seuil binaire', () => {
  const a = stepCombat(state, input, .05), b = stepCombat(state, {...input,yaw:.05},.05), c = stepCombat(state,{...input,yaw:1,lift:.9},.05);
  assert.ok(a.alignment > b.alignment && b.alignment > c.alignment && c.alignment > 0);
  assert.ok(c.tension > b.tension); assert.ok(Math.abs(a.tension-b.tension)<.03);
});
test('Contact prolongé et récupération ramènent les quinze espèces, avec fatigue causale', () => {
  for (const fish of SPECIES.filter(f=>f.mode==='capture')) {
    const g = hookFish(fish); let peak = 0;
    for (let i=0;i<100*60 && ['fighting','landing'].includes(g.phase);i++){manageFight(g);peak=Math.max(peak,g.fatigue)}
    assert.equal(g.phase,'caught',fish.name);assert.ok(peak>0);assert.equal(g.result?.speciesId,fish.id);
  }
});
test('Sans récupération, le temps ne garantit aucune capture', () => {
  const g=hookFish(SPECIES[2]);for(let i=0;i<120*60&&g.phase==='fighting';i++)g.update(1/60);
  assert.notEqual(g.phase,'caught');assert.equal(g.result,null);
});
test('Les erreurs brèves sont tolérées, le mou prolongé fait décrocher', () => {
  const g=hookFish(SPECIES[2]);g.lineLength+=8;
  for(let i=0;i<60;i++)g.update(1/60);assert.equal(g.phase,'fighting');
  for(let i=0;i<360&&g.phase==='fighting';i++)g.update(1/60);assert.equal(g.phase,'lost');assert.match(g.failure,/décroché/);
});
