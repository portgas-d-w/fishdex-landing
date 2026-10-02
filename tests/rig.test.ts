import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyTackle, starterConfig, COMPONENTS, reserveRig, resolveRig, buyComponent, validateRig, applyPreset, changeMethod, rigWarnings, detachedNodes, rigControl } from '../src/game/rig.ts';
import { emptySave, parseSave, recordCatch } from '../src/game/save.ts';
import { PROFILES, encounterWeight, presentation } from '../src/game/profiles.ts';
import { SPECIES } from '../src/game/catalog.ts';
import { FishingGame } from '../src/game/fishing.ts';

function paid() {const t=emptyTackle();for(const c of COMPONENTS.filter(c=>!c.free))buyComponent(t,c.id,10000);Object.assign(t.config.components,{main_line:'fine-line',leader:'fine-leader',float:'loaded-float',weight:'light-shot',hook:'wide-hook',bait:'corn',reel:'smooth-reel'});return t;}
test('Réservation atomique, absence de stock bloquante ; un preset ne duplique rien',()=>{
  const t=paid(),stock=structuredClone(t.stock);assert.deepEqual(reserveRig(t,'cast','starter'),[]);assert.deepEqual(t.stock,stock);assert.ok(reserveRig(t,'second','starter').length);
  const p={id:'p',name:'corn',rod:'starter' as const,config:structuredClone(t.config)};assert.ok(applyPreset(t,p).length);resolveRig(t,'cast','return');assert.deepEqual(applyPreset(t,p),[]);assert.equal(t.stock.corn,14);
  t.stock.corn=0;assert.ok(validateRig(t).some(e=>e.includes('Maïs')));const before=JSON.stringify(t);assert.ok(reserveRig(t,'empty','starter').length);assert.equal(JSON.stringify(t),before);assert.ok(applyPreset(t,p).length);
});
test('Casse du bas de ligne : flotteur, plombs, moulinet et bobine conservés ; événement idempotent',()=>{
  const t=paid();reserveRig(t,'leader','balanced');const losses=resolveRig(t,'leader','leader',12);
  assert.deepEqual(losses,{'fine-leader':.6,'wide-hook':1,corn:1});assert.equal(t.stock['fine-line'],100);assert.equal(t.stock['loaded-float'],1);assert.equal(t.stock['smooth-reel'],1);
  const before=JSON.stringify(t);assert.deepEqual(resolveRig(t,'leader','main_line',20),{});assert.equal(JSON.stringify(t),before);
});
test('Casse du fil : seuls mètres engagés et branches aval détachées sont perdus',()=>{
  const t=paid();reserveRig(t,'main','precision');resolveRig(t,'main','main_line',12.3);assert.equal(t.stock['fine-line'],87.7);assert.equal(t.stock['loaded-float'],0);assert.equal(t.stock['smooth-reel'],1);assert.equal(t.stock['light-shot'],4);
});
test('Coulissement : stop retient, sortie ouverte perd le lest ; clip détache sa branche seule',()=>{
  for(const fix of ['sliding-fix','open-slide','lead-clip']){const t=paid();changeMethod(t,'bottom');t.config.components.weight='paid-bottom';t.config.components.attachment=fix;reserveRig(t,fix,'starter');
    const lost=detachedNodes(t.active!.nodes,fix==='lead-clip'?'lead_release':'leader').map(n=>n.slot);
    assert.equal(lost.includes('weight'),fix!=='sliding-fix');assert.equal(lost.includes('main_line'),false);if(fix==='lead-clip'){assert.deepEqual(lost,['weight']);resolveRig(t,fix,'lead_release');assert.equal(t.stock['paid-bottom'],2);assert.equal(t.stock['fine-leader'],10);}
  }
});
test('Décrochage consomme une esche, conserve les objets ; kit mélangé ne protège pas les achats',()=>{
  const t=paid();reserveRig(t,'unhook','starter');assert.deepEqual(resolveRig(t,'unhook','unhook'),{corn:1});
  const mixed=emptyTackle();buyComponent(mixed,'loaded-float',100);mixed.config.components.float='loaded-float';reserveRig(mixed,'mix','starter');assert.deepEqual(resolveRig(mixed,'mix','main_line'),{'loaded-float':1});assert.equal(mixed.stock['loaded-float'],0);
  mixed.config=starterConfig();for(let n=0;n<30;n++){assert.deepEqual(reserveRig(mixed,`free${n}`,'starter'),[]);resolveRig(mixed,`free${n}`,'main_line',40);}assert.deepEqual(validateRig(mixed),[]);assert.deepEqual(mixed.stock,{'loaded-float':0});assert.ok(buyComponent(mixed,'kit-float',0).error);
});
test('Migration v3 préserve journal, achats, XP, monnaie et favoris, cercle devient appui',()=>{
  const s=emptySave();s.inventory.push('balanced');s.equipped='balanced';recordCatch(s,{id:'keep',speciesId:'roach',length:25,date:'2026-10-01T12:00:00Z'});s.favorites=['keep'];
  const old={...s,version:3,settings:{...s.settings,reelMode:'circle'},preparation:{...s.preparation,method:'bottom',bait:'worm'}};delete (old as any).tackle;
  const next=parseSave(JSON.stringify(old));assert.equal(next.version,4);assert.equal(next.settings.reelMode,'hold');assert.equal(next.tackle.config.method,'bottom');assert.deepEqual(next.journal,s.journal);assert.deepEqual(next.inventory,s.inventory);assert.equal(next.xp,s.xp);assert.equal(next.coins,s.coins);assert.deepEqual(next.favorites,s.favorites);
});
test('Rechargement d’une ligne réservée : retour conservateur, esche consommée une fois, aucune prise',()=>{
  const s=emptySave();s.tackle=paid();reserveRig(s.tackle,'interrupted','starter');const next=parseSave(JSON.stringify(s));assert.equal(next.tackle.stock.corn,14);assert.equal(next.tackle.stock['fine-line'],100);assert.equal(next.total,0);assert.equal(next.tackle.active!.resolved,true);assert.deepEqual(parseSave(JSON.stringify(next)),next);
  assert.deepEqual(parseSave(JSON.stringify({...next,tackle:{...next.tackle,active:{...next.tackle.active,nodes:[{item:'fake'}]}}})),next);
});
test('Import rejette quantités négatives, incompatibilités et presets dupliqués sans effacer la sauvegarde',()=>{
  for(const mutate of [(s:ReturnType<typeof emptySave>)=>s.tackle.stock.corn=-1,(s:ReturnType<typeof emptySave>)=>s.tackle.config.components.float='minnow',(s:ReturnType<typeof emptySave>)=>s.tackle.stock.corn=NaN,(s:ReturnType<typeof emptySave>)=>s.tackle.presets=[{id:'x',name:'X',rod:'starter',config:starterConfig()},{id:'x',name:'Y',rod:'starter',config:starterConfig()}]]){const s=emptySave();mutate(s);assert.throws(()=>parseSave(JSON.stringify(s)));}
});
test('Portance distingue lest intégré et masse externe ; fil/reel modifient le contrôle',()=>{
  const t=paid();assert.deepEqual(rigWarnings(t.config),[]);t.config.components.weight='heavy-shot';assert.match(rigWarnings(t.config)[0],/immerge/);assert.notEqual(rigControl(t.config),rigControl(starterConfig()));
});
test('Quinze profils, rencontres bornées à habitat, strate et régime ; aucune table universelle',()=>{
  assert.equal(Object.keys(PROFILES).length,15);
  for(const s of SPECIES)assert.ok(PROFILES[s.id].source_ids.length);
  const c=starterConfig();assert.equal(encounterWeight('catfish','reeds',c,1.2,1),0);assert.equal(encounterWeight('carp','open',c,4,.4),0);assert.ok(encounterWeight('carp','open',c,4,4)>0);assert.equal(encounterWeight('bleak','open',c,4,4),0);
  c.components.bait='corn';assert.equal(encounterWeight('pike','willow',c,2,1),0);assert.equal(encounterWeight('zander','willow',starterConfig('lure'),2,2),0);
  assert.ok(presentation({...c,depth:.4},4).depth<presentation({...c,depth:3},4).depth);
  const found=new Set();for(const spot of ['reeds','open','willow'] as const)for(const method of ['float','bottom','lure'] as const)for(const depth of [.5,1,2,4])for(const s of SPECIES)if(encounterWeight(s.id,spot,starterConfig(method),4,depth)>0)found.add(s.id);assert.equal(found.size,15);
});
test('Chaîne réelle : stock réservé au lancer valide, retour libéré ; lancer refusé sans perte',()=>{
  const t=paid(),g=new FishingGame(()=>0);g.tackle=t;assert.equal(g.cast({x:40,z:4}),false);assert.equal(t.active,null);assert.equal(g.cast({x:0,z:6}),true);assert.equal(t.active!.resolved,false);g.reset();assert.equal(t.stock.corn,14);assert.equal(t.stock['loaded-float'],1);assert.equal(t.active!.resolved,true);
});
test('Capture au montage payé : esche enregistrée et débitée une fois, récompense et reload conservés',()=>{
  const s=emptySave();s.tackle=paid();const g=new FishingGame(()=>0);g.tackle=s.tackle;g.cast({x:0,z:6});
  for(let i=0;i<900&&g.phase!=='bite';i++)g.update(1/60);assert.equal(g.phase,'bite');g.strike();
  for(let i=0;i<6000&&g.phase==='fighting';i++){g.orient(g.direction,g.pulling?.28:.55);if(g.tension<.72||g.slack>.05)g.reel(1.6/60);g.update(1/60);}
  assert.equal(g.phase,'caught');assert.equal(g.result!.baitItem,'corn');assert.equal(s.tackle.stock.corn,14);assert.equal(s.tackle.stock['loaded-float'],1);
  recordCatch(s,g.result!);const balance=s.coins;recordCatch(s,g.result!);assert.equal(s.coins,balance);assert.equal(s.total,1);assert.equal(parseSave(JSON.stringify(s)).journal[0].baitItem,'corn');g.reset();assert.equal(s.tackle.stock.corn,14);
});
