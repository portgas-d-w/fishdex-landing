import test from 'node:test';
import assert from 'node:assert/strict';
import { emptySave,parseSave,recordCatch,purchase } from '../src/game/save.ts';
import { initialRights,initiateLures,switchPractice,restoreFreeKit,postAccess,refreshRights,purchaseComponent } from '../src/game/progression.ts';
import { inspectPostTarget,POSTS,populationWeight,worldPoint } from '../src/game/posts.ts';
import { FishingGame } from '../src/game/fishing.ts';
import { starterConfig,reserveRig,resolveRig,validateRig } from '../src/game/rig.ts';
import { stepCombat } from '../src/game/combat.ts';
import { SPECIES } from '../src/game/catalog.ts';
import { specimenRarity, SPECIES_RARITY } from '../src/game/rarity.ts';
import { oldV4 } from './support/legacy.ts';
const caught=(id:string)=>({id,speciesId:'roach' as const,length:18,date:'2026-10-02T12:00:00Z',method:'pole' as const,post:'jetty' as const,target:{x:0,z:3.2}});
const tick=(g:FishingGame,seconds:number)=>{for(let i=0;i<seconds*60;i++)g.update(1/60);};
const manage=(g:FishingGame)=>{g.orient(g.direction,g.hasReel?(g.pulling?.28:.55):Math.max(0,Math.min(1,(g.lineLength-g.fishDistance+(g.pulling?.12:.5)*1.1)/Math.max(1.5,g.lineLength-1.3))));if(g.hasReel&&(g.tension<.72||g.slack>.05))g.reel(1.6/60);g.update(1/60);};
test('Nouvelle partie : trois postes, coup sans moulinet et kit gratuit complet ; accès vérifiés en logique',()=>{
 const s=emptySave();assert.deepEqual(s.progression,initialRights());assert.deepEqual(validateRig(s.tackle),[]);assert.equal(s.tackle.config.components.reel,undefined);
 assert.ok(switchPractice(s,'lure'));assert.ok(initiateLures(s));assert.ok(purchaseComponent(s,'minnow'));assert.equal(s.coins,0);
 recordCatch(s,caught('first'));assert.equal(initiateLures(s),'');assert.equal(switchPractice(s,'lure'),'');assert.ok(s.tackle.config.components.reel);assert.equal(s.equipped,'starter');assert.equal(purchaseComponent(s,'unknown'),'Contenu à venir ou inconnu.');
});
test('Migration v4 conserve possessions, stock, espèces, individus/favoris, gains et capacités déjà ouvertes',()=>{
 const old=oldV4(),modern=emptySave();recordCatch(modern,{...caught('kept'),method:'float'});Object.assign(old,{total:modern.total,records:modern.records,journal:modern.journal,variants:modern.variants,coins:123,xp:40,badges:modern.badges,favorites:['kept'],inventory:['starter','precision','plants'],equipped:'precision'});old.tackle.stock.corn=30;
 const s=parseSave(JSON.stringify(old));assert.equal(s.version,5);assert.equal(s.coins,123);assert.equal(s.xp,40);assert.deepEqual(s.favorites,['kept']);assert.deepEqual(s.journal,old.journal);assert.equal(s.equipped,'precision');assert.equal(s.tackle.stock.corn,30);assert.deepEqual(s.progression.methods,['pole','float','lure','bottom']);assert.deepEqual(parseSave(JSON.stringify(s)),s);
});
test('OU d’accès, défi réalisable avec kit, déblocage permanent et idempotence ; futurs inactifs même à haut niveau',()=>{
 const s=emptySave();recordCatch(s,caught('a'));assert.equal(postAccess(s,'reed-bank'),false);recordCatch(s,caught('b'));assert.equal(postAccess(s,'reed-bank'),true);recordCatch(s,caught('b'));assert.equal(s.progression.precision,2);assert.equal(s.total,2);
 s.xp=0;refreshRights(s);assert.equal(postAccess(parseSave(JSON.stringify(s)),'reed-bank'),true);
 const level=emptySave();level.xp=320;refreshRights(level);assert.equal(postAccess(level,'reed-bank'),true);level.xp=100000;refreshRights(level);assert.equal(postAccess(level,'point'),false);assert.equal(postAccess(level,'timber'),false);
});
test('Changer de pratique conserve les deux recettes et la réserve ; secours ne donne aucun gain',()=>{
 const s=emptySave();recordCatch(s,caught('a'));initiateLures(s);s.tackle.config.depth=.4;s.tackle.stock.corn=12;
 const coins=s.coins,xp=s.xp;switchPractice(s,'lure');s.tackle.config.components.leader='kit-leader';switchPractice(s,'pole');assert.equal(s.tackle.config.depth,.4);assert.equal(s.equipped,'pole-starter');
 s.tackle.config.components.bait='corn';s.tackle.stock.corn=0;assert.ok(validateRig(s.tackle).length);assert.equal(restoreFreeKit(s),'');assert.equal(s.tackle.config.components.bait,'kit-worm');assert.equal(s.coins,coins);assert.equal(s.xp,xp);assert.equal(s.tackle.stock.corn,0);
});
test('Postes déplacent les ancrages dans une scène commune, secteurs et portées refusent sans réservation',()=>{
 assert.equal(POSTS.length,6);assert.notDeepEqual(worldPoint('cove',{x:0,z:4}),worldPoint('bank',{x:0,z:4}));assert.equal(inspectPostTarget('jetty',{x:0,z:15},'pole',6.4).valid,false);assert.equal(inspectPostTarget('reed-bank',{x:6,z:5}).valid,false);
 const s=emptySave(),g=new FishingGame(()=>0);g.rights=s.progression;g.setMethod('pole');g.tackle=s.tackle;assert.equal(g.setPost('reed-bank'),false);assert.equal(g.cast({x:0,z:15}),false);assert.equal(s.tackle.active,null);assert.equal(g.setPost('cove'),true);assert.equal(g.cast({x:0,z:3}),true);assert.equal(g.setPost('bank'),false);assert.equal(s.tackle.active?.resolved,false);
});
test('Rareté du spécimen indépendante des droits et de la force : grand commun exceptionnel, pas de légendaire aléatoire',()=>{
 assert.equal(SPECIES_RARITY.roach,'common');assert.equal(specimenRarity({...caught('a'),length:38,coloration:'natural',mirage:false}),'exceptional');for(const f of SPECIES)assert.notEqual(specimenRarity({speciesId:f.id,length:f.max,coloration:'golden',mirage:true}),'legendary');
 assert.ok(populationWeight('cove','tench','plants')>populationWeight('bank','tench','plants'));assert.equal(populationWeight('cove','zander','plants'),0);
});
test('Coup : vraie première prise, longueur fixe, pas de moulinage ni de frein ; fatigue et canne causalement utiles',()=>{
 const s=emptySave(),g=new FishingGame(()=>0);g.setMethod('pole');g.tackle=s.tackle;assert.equal(g.cast({x:0,z:3.2}),true);tick(g,15);assert.equal(g.phase,'lost'); // touche ignorée
 g.reset();g.cast({x:0,z:3.2});for(let i=0;i<900&&g.phase!=='bite';i++)g.update(1/60);assert.equal(g.phase,'bite');g.strike();const line=g.lineLength;g.holdReel(true);g.reel(100);g.update(1/60);assert.equal(g.reelSpeed,0);assert.equal(g.lineLength,line);assert.equal(g.dragSpeed,0);
 for(let i=0;i<9000&&g.phase==='fighting';i++)manage(g);assert.equal(g.phase,'caught',g.failure);assert.equal(g.lineLength,line);assert.equal(g.result?.method,'pole');assert.ok(g.fatigue>0);
});
test('Leurre : pas de sélection au lancer ; descente, animation/récupération puis pause réellement actives',()=>{
 const g=new FishingGame(()=>0);g.setMethod('lure');g.cast({x:0,z:8});assert.equal(g.fish,null);tick(g,12);assert.equal(g.phase,'waiting');assert.ok(g.presentationDepth>1);
 for(let i=0;i<700&&g.phase==='waiting';i++){g.orient(Math.sin(i/12)*.3,.5);g.reel(1.6/60);g.update(1/60);}assert.equal(g.phase,'bite');assert.notEqual(g.fish,null);
});
test('Le même individu conserve son noyau : l’environnement ajoute accrochages, jamais une force globale',()=>{
 const state={distance:8,lineLength:8.2,tension:.3,fatigue:.1},input={yaw:.2,lift:.5,bearing:.3,force:1,power:1,reelSpeed:1,motion:'cruise' as const};assert.deepEqual(stepCombat(state,input,1/60),stepCombat(state,{...input},1/60));
 const g=new FishingGame(()=>0);g.setPost('cove');g.cast({x:2.8,z:4.5});tick(g,4.3);assert.equal(g.snagged,true);assert.equal(g.tryFreeSnag(),false);g.orient(-.8,.1);assert.equal(g.tryFreeSnag(),true);assert.equal(g.snagged,false);
});
test('Perte au coup : bas de ligne et aval payants seulement, réserve et élastique préservés, résolution unique',()=>{
 const s=emptySave();s.tackle.stock={'soft-elastic':1,'fine-leader':10,'wide-hook':10,corn:15,'loaded-float':1};Object.assign(s.tackle.config.components,{elastic:'soft-elastic',leader:'fine-leader',hook:'wide-hook',bait:'corn',float:'loaded-float'});reserveRig(s.tackle,'pole-paid','pole-starter');const loss=resolveRig(s.tackle,'pole-paid','leader',5);assert.deepEqual(loss,{'fine-leader':.6,'wide-hook':1,corn:1});assert.equal(s.tackle.stock['soft-elastic'],1);assert.equal(s.tackle.stock['loaded-float'],1);assert.deepEqual(resolveRig(s.tackle,'pole-paid','leader',5),{});assert.equal(s.equipped,'pole-starter');
});
test('Assistance expérimentale : appui indispensable et récupération plus efficace quand le poisson cède',()=>{
 const state={distance:8,lineLength:8.2,tension:.3,fatigue:.2},input={yaw:0,lift:.5,bearing:0,force:1,power:1,reelSpeed:0,motion:'return' as const};
 assert.deepEqual(stepCombat(state,input,.05),stepCombat(state,{...input,assisted:true},.05));
 const manual=stepCombat(state,{...input,reelSpeed:1.6},.05),assisted=stepCombat(state,{...input,reelSpeed:1.6,assisted:true},.05);assert.ok(assisted.lineLength<manual.lineLength);
 const pole=stepCombat(state,{...input,adapter:'pole',reelSpeed:100,assisted:true},.05);assert.equal(pole.lineLength,state.lineLength);assert.equal(pole.dragSpeed,0);
});
