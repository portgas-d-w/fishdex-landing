import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySave} from '../src/game/save.ts';
import {refreshRights} from '../src/game/progression.ts';
import {accessibleFishRoutes} from '../src/game/fish-access.ts';

test('Le conseil gardon privilégie le coup gratuit ouvert et ne modifie pas la partie',()=>{
 const save=emptySave();refreshRights(save);const before=JSON.stringify(save),routes=accessibleFishRoutes(save,'roach');
 assert.equal(routes[0]?.ready,true);assert.equal(routes[0]?.technique,'coup');assert.equal(JSON.stringify(save),before);
});
test('Un habitat fermé conserve une cause de déblocage sans faux trajet',()=>{
 const save=emptySave();refreshRights(save);const routes=accessibleFishRoutes(save,'saumon-roi');
 assert.ok(routes.length>0);assert.ok(routes.every(r=>!r.ready&&r.reasons.length>0));assert.equal(save.preparation.post,'jetty');
});
