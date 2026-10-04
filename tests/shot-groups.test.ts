import test from 'node:test';import assert from 'node:assert/strict';
import {moveShotGroup} from '../src/game/rig-layout.ts';
import {emptyTackle,techniqueConfig,reserveRig,resolveRig,parseTackle,floatLoad} from '../src/game/rig.ts';
import {rigPreview} from '../src/game/gear-advice.ts';
test('Plombs multiples : espacement conservé, masse et quantité réelles, perte selon segment sans duplication',()=>{
 const t=emptyTackle();t.config=techniqueConfig('coup');t.config.components.weight='light-shot';t.stock['light-shot']=5;
 const single=floatLoad(t.config);t.config.shots=[.1,.2,.3];assert.ok(floatLoad(t.config)>single+1.3);const fast=rigPreview(t.config,3,2).depth;
 assert.ok(moveShotGroup(t.config,[0,1,2],.7));assert.deepEqual(t.config.shots,[.6,.7,.8]);assert.ok(rigPreview(t.config,3,2).depth<fast);assert.equal(t.stock['light-shot'],5);assert.equal(moveShotGroup(t.config,[0],.7),false);
 assert.deepEqual(parseTackle(t).config.shots,[.6,.7,.8]);assert.deepEqual(reserveRig(t,'weights','pole-starter'),[]);assert.equal(t.active!.reserved['light-shot'],3);assert.deepEqual(t.active!.nodes.filter(n=>n.slot==='weight').map(n=>n.offset),[.6,.7,.8]);resolveRig(t,'weights','leader');assert.equal(t.stock['light-shot'],5);
 t.active=null;reserveRig(t,'line','pole-starter');assert.equal(resolveRig(t,'line','main_line')['light-shot'],3);assert.equal(t.stock['light-shot'],2);assert.deepEqual(resolveRig(t,'line','main_line'),{});assert.ok(reserveRig(t,'missing','pole-starter').length);const invalid=structuredClone(t);invalid.config.shots=[.1,.11];assert.throws(()=>parseTackle(invalid));
});
