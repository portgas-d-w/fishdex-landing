import test from 'node:test';
import assert from 'node:assert/strict';
import {SPECIES,LEGACY_SPECIES} from '../src/game/catalog.ts';
import {FISH_REGISTRY,APPEARANCES,canonicalFishId} from '../src/game/fish-registry.ts';
import {fishRoutes} from '../src/game/fish-access.ts';
import {ALL_POSTS,populationWeight,postLocation} from '../src/game/posts.ts';
import {PROFILES,techniqueEncounterWeight} from '../src/game/profiles.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {TECHNIQUES,techniqueById} from '../src/game/techniques.ts';
import {createTestSave,ProfileStorage,TEST_SAVE_KEY} from '../src/game/development.ts';
import {switchTechnique} from '../src/game/progression.ts';
import {ITEMS} from '../src/game/economy.ts';
import {component,validateRig} from '../src/game/rig.ts';
import {ObservationSession} from '../src/game/observations.ts';
import {emptySave,recordCatch,recordObservation,discoveredFish,parseSave,SAVE_KEY,toggleFavorite} from '../src/game/save.ts';
import {weightFor} from '../src/game/specimens.ts';

test('Identités réconciliées : 64 espèces, deux hybrides, pas de records/alias dans le dénominateur',()=>{
 assert.equal(SPECIES.length,66);assert.equal(FISH_REGISTRY.species.filter(s=>s.kind==='species').length,64);assert.equal(FISH_REGISTRY.species.filter(s=>s.kind==='hybrid').length,2);
 assert.equal(new Set(SPECIES.map(s=>s.id)).size,SPECIES.length);assert.equal(APPEARANCES.length,29);
 for(const old of LEGACY_SPECIES){const s=SPECIES.find(s=>s.id===old.id)!;assert.equal(s.min,old.min);assert.equal(s.max,old.max);assert.equal(s.model,old.model);}
 for(const [alias,id]of [['nase','hotu'],['soufie','blageon'],['carpe-herbivore','amour-blanc'],['brochet-trophee','pike'],['esturgeon-baeri','esturgeon-siberien'],['truite-de-mer','truite-fario']])assert.equal(canonicalFishId(alias),id);
 assert.notEqual(canonicalFishId('sandre-dore'),canonicalFishId('sandre'));assert.notEqual(canonicalFishId('carpe-koi'),canonicalFishId('carpe-commune'));
 assert.equal(FISH_REGISTRY.species.find(s=>s.id==='truite-tiger')!.latin,'Salmo trutta × Salvelinus fontinalis');assert.equal(FISH_REGISTRY.pending.length,1);assert.equal(FISH_REGISTRY.pending[0].id,'placeholder');
 for(const s of SPECIES){assert.ok(fishRoutes(s.id).length,s.id);assert.ok(PROFILES[s.id].source_ids.length,s.id);for(const value of Object.values(PROFILES[s.id].attributes))assert.ok(value>=0&&value<=1);}
 for(const a of APPEARANCES){const routes=fishRoutes(a.parent);assert.ok(routes.some(r=>!a.post||r.post===a.post),a.id);}
});
test('Les espèces observées ne mordent pas ; les continents et les habitats sont séparés',()=>{
 const config=createTestSave().tackle.config;
 for(const s of SPECIES.filter(s=>s.mode==='observation')){assert.equal(techniqueEncounterWeight(s.id,config,2,1,1,0,1),0);const game=new FishingGame();game.testMode=true;assert.match(game.testEncounter(s.id,s.min,127,true),/invalide/i);}
 for(const post of ['jetty','cove','bank'] as const)for(const id of ['sandre-dore','silure-mandarin','saumon-roi'])assert.equal(populationWeight(post,id,'margin'),0);
 assert.ok(populationWeight('american','sandre-dore','dropoff')>0);assert.ok(populationWeight('asian','silure-mandarin','margin')>0);assert.ok(populationWeight('pacific','saumon-roi','margin')>0);
});

function rng(seed:number){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
function finish(game:FishingGame){
 if(game.phase==='bite')game.strike();
 for(let n=0;n<18000&&game.phase==='fighting';n++){game.orient(game.direction,game.hasReel?(game.pulling?.28:.55):Math.max(0,Math.min(1,(game.lineLength-game.fishDistance+(game.pulling?.12:.5)*1.1)/Math.max(1.5,game.lineLength-1.3))));if(game.hasReel&&(game.tension<.72||game.slack>.05))game.reel(1.6/60);game.holdSections(game.tension<.8);game.update(1/60);}
 if(game.phase!=='landing')return false;
 for(let n=0;n<1200;n++){game.holdSections(true);game.update(1/60);}return game.receive();
}
for(const species of SPECIES.filter(s=>s.mode==='capture'))test(`Poisson ${species.id}: rencontre sans forçage, combat, réception, identité, carnet et recharge`,()=>{
 const routes=fishRoutes(species.id).filter(r=>r.technique);
 let captured=false,last='';
 for(let attempt=1;attempt<=240&&!captured;attempt++){
  const route=routes[(attempt-1)%Math.min(4,routes.length)],save=createTestSave(),technique=route.technique!,t=techniqueById(technique);
  assert.equal(switchTechnique(save,technique,route.recipe!), '');save.tackle.config.depth=Math.max(.2,route.depth);
  const game=new FishingGame(rng(97+attempt*871));game.tackle=save.tackle;game.rights=save.progression;game.method=t.base;game.equipment=save.equipped;game.equipmentPower=ITEMS.find(i=>i.id===save.equipped)!.power;
  assert.equal(game.testMode,false);assert.equal(game.setPost(route.post),true);save.preparation.post=route.post;save.preparation.location=postLocation(route.post);
  assert.deepEqual(validateRig(save.tackle),[]);if(t.engine==='feeder')game.fillFeeder();if(t.engine==='fly'){game.prepareFly();game.prepareFly();}if(t.engine==='troll')game.setBoat(1,0);
  assert.equal(game.cast(route.point),true,game.failure);
  for(let n=0;n<7200&&['casting','waiting'].includes(game.phase);n++){if(game.phase==='waiting'){if(['retrieve','bottom','feeder'].includes(t.engine)||t.engine==='fly'&&save.tackle.config.recipe==='streamer')game.reel(.8/60);if(t.engine==='vertical'||t.engine==='clonk')game.orient(0,.5+Math.sin(n/20)*.2);if(t.engine==='drift')game.holdRestraint(true);if(t.engine==='clonk')game.clonk();}game.update(1/60);}
  last=`${route.post}/${t.id}/${route.recipe}/${game.phase}/${game.fish?.id}/${game.failure}`;
  if(game.fish?.id!==species.id)continue;
  const identity=game.specimenId,seed=game.specimenSeed,appearance={...game.appearance},length=game.fishLength;
  if(length>(component(save.tackle.config.components.landing??'')?.capacity??120))continue;
  if(!finish(game))continue;
  assert.equal(game.result!.id,identity);assert.equal(game.result!.seed,seed);assert.equal(game.result!.appearanceId,appearance.appearanceId);assert.equal(game.result!.length,length);assert.equal(game.result!.speciesId,species.id);
  recordCatch(save,game.result!);const coins=save.coins,xp=save.xp;recordCatch(save,game.result!);assert.equal(save.coins,coins);assert.equal(save.xp,xp);assert.equal(save.total,1);assert.deepEqual(parseSave(JSON.stringify(save)),save);captured=true;
 }
 assert.equal(captured,true,`${species.id} après 240 essais : ${last}`);
});
for(const species of SPECIES.filter(s=>s.mode==='observation'))test(`Observation ${species.id}: effort interrompable, photo enregistrable, découverte unique sans aquarium`,()=>{
 const route=fishRoutes(species.id)[0],save=createTestSave(),session=new ObservationSession(route.post,species.id,127,()=>.6);
 session.holding=true;for(let n=0;n<60;n++)session.step(.05);assert.ok(session.elapsed<12);session.release();const paused=session.elapsed;session.step(2);assert.equal(session.elapsed,paused);
 session.holding=true;for(let n=0;n<300;n++)session.step(.05);assert.equal(session.complete,true);assert.equal(session.specimen.weight,weightFor(species.id,session.specimen.length));assert.equal(recordObservation(save,session.specimen),true);const xp=save.xp;assert.equal(recordObservation(save,session.specimen),false);assert.equal(save.xp,xp);assert.equal(save.coins,0);assert.equal(save.total,0);assert.ok(discoveredFish(save).has(species.id));assert.equal(toggleFavorite(save,session.specimen.id),'Capture introuvable.');assert.deepEqual(parseSave(JSON.stringify(save)),save);
 const repeat=new ObservationSession(route.post,species.id,128,()=>.6);repeat.holding=true;for(let n=0;n<300;n++)repeat.step(.05);recordObservation(save,repeat.specimen);assert.equal(save.xp,xp);
});
test('Migration v6 avec cinq favoris, stocks et droits ; normal/test séparés',()=>{
 const save=emptySave();for(let n=0;n<5;n++){recordCatch(save,{id:'legacy-'+n,speciesId:'roach',length:18+n,date:'2026-10-02T12:00:00Z'});save.favorites.push('legacy-'+n);}save.coins=127;save.tackle.stock.corn=18;
 const v6={...save,version:6};delete (v6 as Partial<typeof save>).observations;const original=JSON.stringify(v6),migrated=parseSave(original);assert.equal(migrated.version,7);assert.deepEqual(migrated.journal,save.journal);assert.deepEqual(migrated.favorites,save.favorites);assert.deepEqual(migrated.observations,[]);assert.equal(migrated.coins,127);assert.equal(migrated.tackle.stock.corn,18);
 const values=new Map([[SAVE_KEY,original]]),storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,v:string)=>values.set(key,v)} as Storage,profiles=new ProfileStorage(storage,true);profiles.switchTo('test',migrated);const normal=values.get(SAVE_KEY);profiles.setItem(SAVE_KEY,JSON.stringify(createTestSave()));assert.equal(values.get(SAVE_KEY),normal);assert.ok(values.has(TEST_SAVE_KEY));
});
test('Apparences : parent validé, pas de puissance ajoutée, prime unique et ID persistant',()=>{
 const save=emptySave();for(const a of APPEARANCES.filter(a=>SPECIES.find(s=>s.id===a.parent)!.mode==='capture')){const s=SPECIES.find(s=>s.id===a.parent)!;const caught={id:'appearance-'+a.id,speciesId:s.id,length:s.min,date:'2026-10-02T12:00:00Z',appearanceId:a.id,seed:127};recordCatch(save,caught);assert.equal(save.journal.at(-1)!.reward.appearance,6);const before=save.coins;recordCatch(save,caught);assert.equal(save.coins,before);recordCatch(save,{...caught,id:'repeat-'+a.id});assert.equal(save.journal.at(-1)!.reward.appearance,undefined);}
 assert.deepEqual(parseSave(JSON.stringify(save)),save);
 assert.throws(()=>recordCatch(save,{speciesId:'roach',length:18,date:'2026-10-02',appearanceId:'silure-albinos'}));
 assert.equal(ALL_POSTS.length,15);assert.equal(TECHNIQUES.length,22);
});
