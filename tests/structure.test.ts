import test from 'node:test';
import assert from 'node:assert/strict';
import { emptySave, parseSave, recordCatch, purchase } from '../src/game/save.ts';
import { FAMILIES, GEAR, METHODS, LOCATIONS, gearState, preparation, filterJournal, speciesMastery, ANIMATION_STATES } from '../src/game/structure.ts';
const caught=(id:string,length=20)=>({id,speciesId:'roach' as const,length,date:'2026-10-01T12:00:00Z'});
test('Migration v2 conserve individus, favoris et gains et prépare un montage gratuit valide',()=>{
 const s=emptySave();recordCatch(s,caught('kept'));s.favorites=['kept'];
 const old={...s,version:2,settings:{sound:true,quality:'eco'}};delete (old as any).preparation;
 const next=parseSave(JSON.stringify(old));assert.equal(next.version,3);assert.deepEqual(next.journal,s.journal);assert.equal(next.coins,s.coins);assert.deepEqual(next.favorites,s.favorites);assert.equal(next.settings.reelMode,'hold');assert.ok(preparation(next.preparation.method,next.equipped,next.preparation.bait).valid);
 next.preparation={method:'lure',bait:'lure',location:'willow-pond'};next.settings.reelMode='circle';assert.deepEqual(parseSave(JSON.stringify(next)),next);
 next.preparation.bait='worm';assert.throws(()=>parseSave(JSON.stringify(next)),/incompatible/);
});
test('Tous les emplacements et familles ont un catalogue, futur distinct de verrouillé',()=>{
 for(const [id] of FAMILIES)assert.ok(GEAR.some(i=>i.family===id),id);
 for(const m of METHODS){for(const slot of m.slots)assert.ok(FAMILIES.some(f=>f[0]===slot)); if(m.available)assert.ok(preparation(m.id,'starter',m.bait).valid);else assert.equal(preparation(m.id,'starter',m.bait).valid,false);}
 const save=emptySave();assert.equal(gearState(GEAR.find(i=>i.id==='future-feeder')!,save),'future');assert.equal(gearState(GEAR.find(i=>i.id==='precision')!,save),'locked');save.coins=500;assert.match(purchase(save,'precision'),/Niveau/);save.xp=80;assert.equal(purchase(save,'precision'),'');assert.equal(save.equipped,'starter');
 assert.equal(LOCATIONS.filter(l=>l.available).length,1);assert.equal(ANIMATION_STATES.breathing,'absent');
});
test('Filtres combinés, tris et vues de carnet utilisent les individus, sans modifier la sauvegarde',()=>{
 const s=emptySave();recordCatch(s,caught('first',20));recordCatch(s,{...caught('gold',25),coloration:'golden',method:'bottom'});recordCatch(s,{...caught('mirage',23),mirage:true});s.favorites=['gold'];const before=JSON.stringify(s);
 assert.deepEqual(filterJournal(s,{species:'roach',variant:'golden',method:'bottom',favorite:true,minWeight:0,maxLength:26}).map(f=>f.id),['gold']);
 assert.deepEqual(filterJournal(s,{view:'first'}).map(f=>f.id),['first']);assert.deepEqual(filterJournal(s,{view:'records'}).map(f=>f.id),['gold']);assert.equal(filterJournal(s,{before:'2026-09-30'}).length,0);assert.equal(filterJournal(s,{sort:'rarity'})[0].id,'mirage');assert.equal(speciesMastery(s,'roach'),3);assert.equal(JSON.stringify(s),before);
 const old=parseSave(JSON.stringify({version:1,total:1,records:{roach:{count:1,best:22,last:'2026-09-30T12:00:00Z'}}})); recordCatch(old,caught('new-known',24)); assert.equal(filterJournal(old,{view:'first'}).length,0);
 for(let i=0;i<15;i++)recordCatch(s,caught(`latest-${i}`));assert.equal(filterJournal(s,{view:'latest'}).length,10);
});
test('Un nouvel objet configuré bénéficie des états communs sans logique de navigation spécifique',()=>{
 const item={...GEAR.find(i=>i.id==='future-feeder')!,id:'example-feeder',name:'Feeder exemple'};assert.equal(gearState(item,emptySave()),'future');
});
