import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySave} from '../src/game/save.ts';
import {refreshRights} from '../src/game/progression.ts';
import {accessibleFishRoutes} from '../src/game/fish-access.ts';
import {objectives,trackedObjective} from '../src/game/objectives.ts';
import {parseSave} from '../src/game/save.ts';
import {postUnlockProgress,postAccess} from '../src/game/progression.ts';
import {ALL_POSTS} from '../src/game/posts.ts';
import {recordCatch} from '../src/game/save.ts';
import {filterJournal} from '../src/game/structure.ts';

test('Recherche et tri du carnet se combinent sans modifier les souvenirs',()=>{
 const s=emptySave();recordCatch(s,{id:'small',speciesId:'roach',length:20,date:'2026-10-01T12:00:00Z'});recordCatch(s,{id:'large',speciesId:'roach',length:30,date:'2026-10-02T12:00:00Z'});recordCatch(s,{id:'perch',speciesId:'perch',length:25,date:'2026-10-03T12:00:00Z'});const original=JSON.stringify(s);
 assert.deepEqual(filterJournal(s,{query:'GARDON',sort:'length',minLength:25}).map(f=>f.id),['large']);assert.equal(filterJournal(s,{query:'flotteur'}).length,3);assert.equal(filterJournal(s,{query:'introuvable'}).length,0);assert.equal(filterJournal(s,{}).length,3);assert.equal(JSON.stringify(s),original);
});

test('Le conseil gardon privilégie le coup gratuit ouvert et ne modifie pas la partie',()=>{
 const save=emptySave();refreshRights(save);const before=JSON.stringify(save),routes=accessibleFishRoutes(save,'roach');
 assert.equal(routes[0]?.ready,true);assert.equal(routes[0]?.technique,'coup');assert.equal(JSON.stringify(save),before);
});
test('Suivre et abandonner un objectif survit à la sauvegarde, sans récompense',()=>{
 const save=emptySave();save.ui={trackedObjective:'tech:feeder'};const restored=parseSave(JSON.stringify(save));
 assert.equal(trackedObjective(restored).id,'tech:feeder');assert.equal(restored.coins,0);assert.equal(restored.xp,0);
 delete restored.ui;assert.equal(trackedObjective(restored).id,'first');
});
test('Les chemins alternatifs des postes correspondent aux droits du moteur',()=>{
 for(const post of ALL_POSTS.filter(p=>!p.initial))for(const path of postUnlockProgress(emptySave(),post.id)){
  const save=emptySave();if(path.label==='Niveau')save.xp=80*(path.target-1)**2;else if(path.label.includes('cercle'))save.progression.precision=path.target;else if(path.label==='Captures')save.total=path.target;else save.progression.mastery[path.label.includes('coup')?'pole':'lure']=path.target;
  refreshRights(save);assert.equal(postAccess(save,post.id),true,post.id+' / '+path.label);
 }
});
test('Exploration explique sa maîtrise et sa disponibilité séparément',()=>{
 const goal=objectives(emptySave()).find(g=>g.id==='tech:leurre')!;
 assert.equal(goal.paths.length,1);assert.equal(goal.paths[0].label,'Maîtrise de Exploration');assert.equal(goal.complete,false);
});
test('Un habitat fermé conserve une cause de déblocage sans faux trajet',()=>{
 const save=emptySave();refreshRights(save);const routes=accessibleFishRoutes(save,'saumon-roi');
 assert.ok(routes.length>0);assert.ok(routes.every(r=>!r.ready&&r.reasons.length>0));assert.equal(save.preparation.post,'jetty');
});
