import test from 'node:test';
import assert from 'node:assert/strict';
import {emptySave,purchase,parseSave} from '../src/game/save.ts';
import {createTestSave,prepareTestKit} from '../src/game/development.ts';
import {refreshRights,switchTechnique,restoreFreeKit} from '../src/game/progression.ts';
import {xpThreshold,recipeCondition,learnSkill} from '../src/game/curriculum.ts';
import {LearningSession} from '../src/game/learning.ts';
import {FishingGame} from '../src/game/fishing.ts';

test('La fin du prêt ouvre immédiatement la méthode sans rechargement ni canne offerte',()=>{
 const parent=emptySave();parent.xp=xpThreshold(20);learnSkill(parent,'precision','deposit',true);learnSkill(parent,'precision','diffusion',true);
 const loan=new LearningSession(parent,'precision'),g=new FishingGame();g.phase='caught';assert.equal(loan.sample(g),true);
 assert.ok(parent.progression.techniques?.includes('feeder'));assert.deepEqual(parent.inventory,['starter','pole-starter']);assert.equal(parent.coins,45);
 assert.equal(loan.sample(g),false);assert.equal(parent.coins,45);assert.match(switchTechnique(parent,'feeder'),/canne|poss|achat/i);
});

test('Deux lancers annulés ne valident pas deux dépôts ; deux impacts réels le font',()=>{
 const parent=emptySave();parent.xp=xpThreshold(20);const loan=new LearningSession(parent,'precision'),g=new FishingGame(()=>.99);g.tackle=loan.loan.tackle;g.equipment=loan.loan.equipped;g.method='bottom';g.rights=loan.loan.progression;
 for(let attempt=0;attempt<2;attempt++){g.fillFeeder();assert.ok(g.cast({x:0,z:3.2}));loan.sample(g);g.reset();loan.sample(g);}
 assert.equal(parent.curriculum!.quests.precision?.steps.includes('deposit')??false,false);
 for(let attempt=0;attempt<2;attempt++){g.fillFeeder();assert.ok(g.cast({x:0,z:3.2}));loan.sample(g);for(let n=0;n<100;n++){g.update(1/60);loan.sample(g);}g.reset();loan.sample(g);}
 assert.ok(parent.curriculum!.quests.precision?.steps.includes('deposit'));assert.equal(parent.total,0);assert.equal(parent.coins,0);
});

test('Disponibilité ne donne aucune canne payante ; kit de scénario comptabilisé une fois',()=>{
 const normal=emptySave();normal.xp=xpThreshold(105);refreshRights(normal);const inventory=[...normal.inventory];
 assert.ok(switchTechnique(normal,'mouche'));assert.deepEqual(normal.inventory,inventory);assert.ok(purchase(normal,'fly-rod'));
 normal.coins=100;assert.equal(purchase(normal,'fly-rod'),'');assert.equal(switchTechnique(normal,'mouche'),'');assert.equal(normal.coins,0);
 const s=createTestSave();assert.equal(s.inventory.includes('fly-rod'),false);assert.equal(prepareTestKit(s,'mouche'),'');assert.equal(s.development!.theoreticalCost,100);assert.equal(prepareTestKit(s,'mouche'),'');assert.equal(s.development!.theoreticalCost,100);assert.equal(parseSave(JSON.stringify(s)).equipped,'fly-rod');
});
test('Variantes par réussites distinctes, secours sans achat et prêt ne valide aucun geste au repos',()=>{
 const s=emptySave();s.xp=xpThreshold(105);refreshRights(s);assert.ok(recipeCondition(s,'mouche','streamer'));learnSkill(s,'soie','receive');assert.equal(recipeCondition(s,'mouche','streamer'),'');
 s.tackle.config.technique='mouche';assert.equal(restoreFreeKit(s),'');assert.equal(s.tackle.config.technique,'coup');assert.deepEqual(s.inventory,['starter','pole-starter']);
 const parent=emptySave();parent.xp=xpThreshold(5);const loan=new LearningSession(parent,'exploration'),g=new FishingGame();g.tackle=loan.loan.tackle;assert.equal(loan.sample(g),false);assert.deepEqual(parent.curriculum!.quests,{});assert.equal(parent.total,0);assert.equal(parent.coins,0);assert.throws(()=>new LearningSession(createTestSave('rules'),'exploration'));
});
