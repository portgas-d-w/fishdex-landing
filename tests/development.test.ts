import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestSave, ProfileStorage, TEST_SAVE_KEY, wallet } from '../src/game/development.ts';
import { emptySave, parseSave, persistSave, purchase, SAVE_KEY } from '../src/game/save.ts';
import { purchaseComponent, switchPractice } from '../src/game/progression.ts';
import { validateRig, reserveRig, resolveRig } from '../src/game/rig.ts';
const storage=()=>{const map=new Map<string,string>();return {getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}} as Storage;};
test('Profils séparés, rechargement et retour préservent exactement le carnet normal',()=>{
 const db=storage(),normal=emptySave();normal.coins=43;persistSave(normal,db);const original=db.getItem(SAVE_KEY);const profiles=new ProfileStorage(db,true),sandbox=profiles.switchTo('test',normal);assert.equal(wallet(sandbox),'∞');purchase(sandbox,'precision');persistSave(sandbox,profiles);assert.equal(db.getItem(SAVE_KEY),original);assert.ok(db.getItem(TEST_SAVE_KEY));assert.equal(new ProfileStorage(db,true).load().data.inventory.includes('precision'),true);const restored=profiles.switchTo('normal',sandbox);assert.equal(restored.coins,43);assert.equal(restored.inventory.includes('precision'),false);assert.equal(db.getItem(SAVE_KEY),original);
});
test('Argent illimité : prix et stock appliqués, coût théorique fini, quantités invalides refusées',()=>{
 const s=createTestSave();assert.equal(purchase(s,'precision'),'');assert.equal(purchaseComponent(s,'corn',2),'');assert.equal(s.tackle.stock.corn,30);assert.equal(s.coins,0);assert.equal(s.development!.theoreticalCost,176);assert.ok(purchaseComponent(s,'corn',21));const parsed=parseSave(JSON.stringify(s));assert.equal(wallet(parsed),'∞');assert.equal(parsed.development!.theoreticalCost,176);assert.ok(Number.isFinite(parsed.coins));
});
test('Test en règles normales ne supprime ni prix ni stock insuffisant',()=>{
 const s=createTestSave('rules');assert.equal(wallet(s),'0');assert.ok(purchase(s,'precision'));assert.ok(purchaseComponent(s,'corn'));assert.deepEqual(s.progression.methods,['pole']);
});
test('Compatibilité et pertes restent actives : bas de ligne seul, réserve intacte, résolution unique',()=>{
 const s=createTestSave();purchaseComponent(s,'fine-leader');purchaseComponent(s,'wide-hook');purchaseComponent(s,'corn');s.tackle.config.components.leader='fine-leader';s.tackle.config.components.hook='wide-hook';s.tackle.config.components.bait='corn';assert.deepEqual(reserveRig(s.tackle,'test-line',s.equipped),[]);assert.equal(resolveRig(s.tackle,'test-line','leader')['fine-leader'],.6);assert.equal(s.tackle.stock['fine-leader'],9.4);assert.equal(s.tackle.stock.corn,14);assert.deepEqual(resolveRig(s.tackle,'test-line','leader'),{});s.tackle.active=null;s.tackle.config.components.lure='kit-lure';s.tackle.config.components.hook='minnow';assert.ok(validateRig(s.tackle).length);
});
test('Stock illimité distinct du portefeuille : désactivation révèle le stock réellement perdu',()=>{
 const s=createTestSave();s.tackle.config.components.leader='fine-leader';assert.ok(validateRig(s.tackle).length);s.tackle.unlimitedStock=true;assert.deepEqual(reserveRig(s.tackle,'infinite-stock',s.equipped),[]);resolveRig(s.tackle,'infinite-stock','leader');s.tackle.unlimitedStock=false;s.tackle.active=null;assert.ok(validateRig(s.tackle).length);assert.equal(s.coins,0);
});
test('Mode désactivé et import croisé refusés ; réinitialisation ne touche jamais le profil normal',()=>{
 const db=storage(),normal=emptySave();normal.coins=99;persistSave(normal,db);const disabled=new ProfileStorage(db,false);assert.throws(()=>disabled.switchTo('test',normal));assert.throws(()=>disabled.reset('sandbox'));assert.equal(disabled.accepts(createTestSave()),false);const p=new ProfileStorage(db,true);p.switchTo('test',normal);p.reset('rules');assert.equal(p.accepts(normal),false);assert.equal(JSON.parse(db.getItem(SAVE_KEY)!).coins,99);assert.ok(switchPractice(createTestSave('rules'),'lure'));
});
