import test from 'node:test';
import assert from 'node:assert/strict';
import {techniqueConfig,floatLoad} from '../src/game/rig.ts';
import {initialPresentation,stepPresentation} from '../src/game/presentation.ts';
import {inspectPostTarget} from '../src/game/posts.ts';
import {activityWeight} from '../src/game/profiles.ts';
import {createTestSave,prepareTestKit} from '../src/game/development.ts';
import {switchTechnique} from '../src/game/progression.ts';
import {FishingGame} from '../src/game/fishing.ts';

const input={dt:1/60,waterDepth:3,reelSpeed:1,lift:.5,current:0,wind:0,boatSpeed:0,boatTurn:0,clonk:false,restrained:false};
test('PVA : aucune amorce avant dissolution, diffusion limitée ensuite',()=>{
 const c=techniqueConfig('carpe','pva_filet'),s=initialPresentation();s.pvaRemaining=4;
 for(let n=0;n<239;n++)stepPresentation(c,s,input);
 assert.equal(s.feederRemaining,0);assert.equal(s.activity,0);
 for(let n=0;n<3;n++)stepPresentation(c,s,input);
 assert.ok(s.feederRemaining>34&&s.activity>0);
 for(let n=0;n<36*60;n++)stepPresentation(c,s,input);
 assert.equal(s.feederRemaining,0);
});
test('Tenue de l’esche, charge réelle et animation rotative ont un effet causal',()=>{
 const c=techniqueConfig('surface'),a=initialPresentation(),b=initialPresentation();
 const hardy=techniqueConfig('surface');hardy.components.bait='kit2:popup';
 for(let n=0;n<30*60;n++){a.animation=1;b.animation=1;stepPresentation(c,a,input);stepPresentation(hardy,b,input);}
 assert.equal(a.baitLife,0);assert.equal(a.activity,0);assert.equal(b.baitLife,1);
 const float=techniqueConfig('anglaise');const before=floatLoad(float);float.components.bait='kit2:deadfish';assert.ok(floatLoad(float)>before+9);
 const rotate=techniqueConfig('leurre','cuiller'),s=initialPresentation();stepPresentation(rotate,s,input);assert.ok(s.terminalAngle>0);
});
test('Profondeur accessible de 6 à 18 m, soie préparée pour la distance, droits en test normal',()=>{
 assert.equal(inspectPostTarget('deep',{x:0,z:1.5},'lure',6).depth,6);
 const deep=inspectPostTarget('deep',{x:0,z:4.5},'lure',6);assert.equal(deep.depth,18);assert.ok(deep.valid);
 const save=createTestSave(),g=new FishingGame(()=>.01);prepareTestKit(save,'mouche');g.tackle=save.tackle;g.rights=save.progression;g.method='lure';g.equipment='fly-rod';g.setPost('river');g.prepareFly();g.prepareFly();
 assert.equal(g.cast({x:0,z:20}),false);assert.match(g.failure,/davantage de soie/);g.prepareFly();assert.equal(g.cast({x:0,z:20}),true);
 const normal=createTestSave('rules'),closed=new FishingGame();switchTechnique(normal,'coup');closed.tackle=normal.tackle;closed.rights=normal.progression;closed.testMode=true;closed.method='lure';assert.equal(closed.cast({x:0,z:3.2}),false);
 assert.ok(activityWeight('catfish','day')<activityWeight('catfish','night'));
});
test('Dérive et diffusion restent comparables à 30, 60 et 120 pas par seconde',()=>{
 const c=techniqueConfig('bolognaise'),states=[30,60,120].map(hz=>{const s=initialPresentation();s.feederRemaining=35;for(let n=0;n<hz*10;n++)stepPresentation(c,s,{...input,dt:1/hz,reelSpeed:0,current:.45,wind:.3});return s;});
 for(const s of states){assert.ok(Math.abs(s.point.x-states[0].point.x)<.001);assert.ok(Math.abs(s.feederRemaining-25)<.001);assert.ok(Math.abs(s.depth-states[0].depth)<.02);}
});
