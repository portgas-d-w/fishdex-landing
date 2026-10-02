import test from 'node:test';
import assert from 'node:assert/strict';
import {profileTrace} from '../src/game/profile-comparison.ts';
import {createTestSave} from '../src/game/development.ts';
import {PROFILES} from '../src/game/profiles.ts';
import {emptySave,parseSave,recordCatch} from '../src/game/save.ts';
import {filterJournal} from '../src/game/structure.ts';
import {switchTechnique} from '../src/game/progression.ts';
import {FISH_REGISTRY} from '../src/game/fish-registry.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {ITEMS} from '../src/game/economy.ts';
import {stepCombat} from '../src/game/combat.ts';

function fixture(post='jetty'){
 const save=createTestSave();assert.equal(switchTechnique(save,'anglaise','waggler_fixe'),'');save.preparation.post=post as typeof save.preparation.post;return save;
}
test('Six attributs causaux : même poisson, taille, kit, graine et commandes ; caches conditionnelles',()=>{
 const save=fixture(),original={...PROFILES.roach.attributes};const effects=[];
 try{for(const attr of Object.keys(original) as (keyof typeof original)[]){
  let difference=0;const post=attr==='cover_seeking'?'timber':'jetty',s=fixture(post);
  for(let seed=1;seed<=60;seed++){
   PROFILES.roach.attributes={...original,[attr]:0};const low=profileTrace(s,'roach',20,seed,{x:0,z:7},8);
   PROFILES.roach.attributes={...original,[attr]:1};const high=profileTrace(s,'roach',20,seed,{x:0,z:7},8);
   difference+=Math.abs(low.bearingRms-high.bearingRms)+Math.abs(low.fatigue-high.fatigue)+Math.abs(low.distance-high.distance)+Math.abs(low.burstSeconds-high.burstSeconds)+Math.abs(low.returnSeconds-high.returnSeconds);
  }
  assert.ok(difference>.05,`${attr} sans effet causal (${difference})`);effects.push({attr,difference});
 }
 PROFILES.roach.attributes={...original,cover_seeking:0};const low=profileTrace(save,'roach',20,127,{x:0,z:7},8);
 PROFILES.roach.attributes={...original,cover_seeking:1};assert.deepEqual(profileTrace(save,'roach',20,127,{x:0,z:7},8),low);
 }finally{PROFILES.roach.attributes=original;}
});
test('Rejeu reproductible, profils distincts, comparaison sans stock ni gains ; cadence 30/60/120 Hz',()=>{
 const save=fixture(),before=JSON.stringify(save),trace=profileTrace(save,'roach',20,127,{x:0,z:7},4);
 assert.deepEqual(profileTrace(save,'roach',20,127,{x:0,z:7},4),trace);assert.equal(JSON.stringify(save),before);
 assert.notEqual(profileTrace(save,'perch',20,127,{x:0,z:7},4).bearingRms,trace.bearingRms);
 assert.notEqual(profileTrace(save,'roach',20,128,{x:0,z:7},4).bearingRms,trace.bearingRms);
 for(const dt of [1/30,1/120]){const other=profileTrace(save,'roach',20,127,{x:0,z:7},4,dt);assert.ok(Math.abs(other.bearingRms-trace.bearingRms)<.03);assert.ok(Math.abs(other.fatigue-trace.fatigue)<.003);assert.ok(Math.abs(other.distance-trace.distance)<.05);}
 assert.throws(()=>profileTrace(save,'gobie',80,127,{x:0,z:7}),/limites/);
});
test('Sources résolues et propositions distinguées de la biologie',()=>{
 const ids=new Set([...FISH_REGISTRY.provenance.suppliedSources,...FISH_REGISTRY.provenance.additionalSources].map(s=>s.id));
 for(const fish of FISH_REGISTRY.species)for(const id of fish.profile.source_ids)assert.ok(ids.has(id),`${fish.id}/${id}`);
});
test('Identité historique non remappable conservée, exportable, sans modèle ni récompense inventés',()=>{
 const save=emptySave();recordCatch(save,{id:'old',speciesId:'roach',length:20,date:'2026-10-02T12:00:00Z'});save.favorites=['old'];
 const data=JSON.parse(JSON.stringify(save));data.version=6;data.journal[0].speciesId='taxon-ancien-inconnu';data.records['taxon-ancien-inconnu']=data.records.roach;delete data.records.roach;
 const migrated=parseSave(JSON.stringify(data));assert.equal(migrated.total,0);assert.equal(migrated.coins,save.coins);assert.equal(migrated.xp,save.xp);assert.equal(migrated.historical!.journal[0].id,'old');assert.equal(migrated.historical!.journal[0].speciesId,'taxon-ancien-inconnu');assert.deepEqual(migrated.historical!.favorites,['old']);assert.equal(migrated.historical!.records['taxon-ancien-inconnu'].count,1);assert.deepEqual(parseSave(JSON.stringify(migrated)),migrated);
});
test('Carnet : robe, poste, montage et pratique se combinent sans gains ni perte',()=>{
 const save=emptySave();recordCatch(save,{id:'koi',speciesId:'carpe-koi',length:25,date:'2026-10-02T12:00:00Z',appearanceId:'carpe-koi-kohaku',post:'managed',method:'float',technique:'anglaise',recipe:'waggler_fixe'});recordCatch(save,{id:'natural',speciesId:'carpe-koi',length:25,date:'2026-10-02T12:00:00Z'});
 assert.deepEqual(filterJournal(save,{variant:'carpe-koi-kohaku',post:'managed',recipe:'waggler_fixe',method:'anglaise'}).map(s=>s.id),['koi']);assert.deepEqual(filterJournal(save,{variant:'natural'}).map(s=>s.id),['natural']);assert.equal(filterJournal(save,{view:'variants'}).length,1);assert.deepEqual(parseSave(JSON.stringify(save)),save);
});
test('Courant et variation individuelle réelle modifient la traction ; la fatigue la réduit',()=>{
 const calm=profileTrace(fixture(),'roach',20,127,{x:0,z:7},4),current=profileTrace(fixture('river'),'roach',20,127,{x:0,z:7},4);
 assert.ok(Math.abs(calm.distance-current.distance)>.005);
 function encounter(individualRandom:number){
  let call=0;const save=fixture(),game=new FishingGame(()=>++call===2?individualRandom:.5);game.tackle=save.tackle;game.rights=save.progression;game.method='float';game.equipment=save.equipped;game.equipmentPower=ITEMS.find(i=>i.id===save.equipped)!.power;
  assert.equal(game.cast({x:0,z:3.2}),true);for(let n=0;n<7200&&['casting','waiting'].includes(game.phase);n++)game.update(1/60);assert.equal(game.phase,'bite');game.strike();return game;
 }
 const lower=encounter(.25),higher=encounter(.75);assert.equal(lower.fish!.id,higher.fish!.id);assert.equal(lower.fishLength,higher.fishLength);assert.equal(lower.specimenSeed,higher.specimenSeed);
 for(let n=0;n<120;n++){lower.orient(0,.5);higher.orient(0,.5);lower.update(1/60);higher.update(1/60);}assert.ok(Math.abs(lower.fishDistance-higher.fishDistance)>.005);
 const input={yaw:0,lift:.5,bearing:0,force:1,power:1,reelSpeed:0,motion:'burst' as const};const fresh=stepCombat({distance:10,lineLength:10,tension:.4,fatigue:0},input,1/60),tired=stepCombat({distance:10,lineLength:10,tension:.4,fatigue:.8},input,1/60);assert.ok(tired.relativeForce<fresh.relativeForce*.5);
});
test('Alias de robe historique remappé avec robe, gains et favoris conservés',()=>{
 const save=emptySave();recordCatch(save,{id:'mirror',speciesId:'carp',length:40,date:'2026-10-03T00:00:00Z'});save.favorites=['mirror'];const raw=JSON.parse(JSON.stringify(save));raw.version=6;raw.journal[0].speciesId='carpe-miroir';raw.records['carpe-miroir']=raw.records.carp;delete raw.records.carp;
 const migrated=parseSave(JSON.stringify(raw));assert.equal(migrated.journal[0].speciesId,'carp');assert.equal(migrated.journal[0].appearanceId,'carpe-miroir');assert.equal(migrated.coins,save.coins);assert.equal(migrated.xp,save.xp);assert.deepEqual(migrated.favorites,save.favorites);assert.deepEqual(parseSave(JSON.stringify(migrated)),migrated);
});
