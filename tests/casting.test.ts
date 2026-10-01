import test from 'node:test';
import assert from 'node:assert/strict';
import { aimFromGesture, inspectTarget, CastGesture } from '../src/game/casting.ts';
import { FishingGame } from '../src/game/fishing.ts';
test('Gestes normalisés : court, long, diagonal et hors eau', () => {
  assert.equal(aimFromGesture(2, -5, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, -140, 390, 844).valid, true);
  assert.equal(aimFromGesture(150, -140, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, -500, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, 120, 390, 844).valid, false);
  assert.deepEqual(aimFromGesture(30, -140, 390, 844).point, aimFromGesture(60, -280, 780, 1688).point);
  assert.equal(inspectTarget({ x: NaN, z: 5 }).valid, false);
});
test('Une cible refusée conserve l’état ; les coordonnées choisissent l’habitat', () => {
  const game = new FishingGame(() => 0);
  assert.equal(game.cast({ x: 15, z: 7 }), false); assert.equal(game.phase, 'idle');
  assert.equal(game.cast({ x: 4.2, z: 8.5 }), true);
  assert.deepEqual(game.target, { x: 4.2, z: 8.5 }); assert.equal(game.spot, 'willow');
});
test('Le lancer part du tiers bas et exige un relâchement central, vers l’eau', () => {
 assert.equal(CastGesture.canStart(500,844),false);assert.equal(CastGesture.canStart(700,844),true);
 const g=new CastGesture({x:180,y:700,time:0},390,844);
 g.move({x:180,y:600,time:80});assert.equal(g.aim({x:180,y:600,time:90}).valid,false);
 g.move({x:190,y:400,time:160});assert.equal(g.aim({x:190,y:400,time:170}).valid,true);
 assert.ok(g.pose({x:210,y:400,time:170}).lift>.5);
 assert.equal(g.aim({x:190,y:400,time:700}).valid,false);
});
test('La vitesse récente domine la puissance ; amplitude, direction et équipement contribuent', () => {
 const swing=(duration:number, dx=0,power=1)=>{const g=new CastGesture({x:180,y:700,time:0},390,844,power);for(let i=1;i<=100;i++)g.move({x:180+dx*i/100,y:700-300*i/100,time:duration*i/100});return g.aim({x:180+dx,y:400,time:duration+5});};
 const slow=swing(1800),fast=swing(150);assert.ok(slow.valid && fast.valid);assert.ok(fast.point.z>slow.point.z+8);
 const diagonal=swing(150,60);assert.ok(diagonal.valid);assert.ok(diagonal.point.x>0);assert.ok(swing(150,0,1.4).point.z>fast.point.z);
 assert.equal(swing(150,200).valid,false);
});
