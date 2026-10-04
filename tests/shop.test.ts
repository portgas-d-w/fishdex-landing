import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SHOP_PRODUCTS,SHOP_DEPARTMENTS,shopGroups,shopProducts,shopCompatible,shopMethods} from '../src/game/shop.ts';
import {emptySave} from '../src/game/save.ts';
import {COMPONENTS,techniqueConfig,slotsFor} from '../src/game/rig.ts';
import {TECHNIQUES} from '../src/game/techniques.ts';
import {ITEMS,rodCompatible} from '../src/game/economy.ts';

test('Boutique : chaque article achetable a un seul rayon ; aquarium séparé et sous-rayons remplis',()=>{
 assert.equal(new Set(SHOP_PRODUCTS.map(p=>p.id)).size,SHOP_PRODUCTS.length);
 assert.equal(SHOP_PRODUCTS.length,ITEMS.length+COMPONENTS.filter(i=>!i.free).length);
 for(const d of [...SHOP_DEPARTMENTS,{id:'decor' as const}])for(const g of shopGroups(d.id))assert.ok(shopProducts(emptySave(),{department:d.id,group:g}).length);
 assert.ok(SHOP_PRODUCTS.every(p=>p.department==='decor'?p.item?.kind==='decor':p.item?.kind!=='decor'));
 assert.deepEqual(new Set(shopGroups('line')),new Set(['Nylon','Bas de ligne','Corps de ligne','Soies','Backing']));
});
test('Boutique : filtre de compatibilité identique aux emplacements et techniques des 22 préparations',()=>{
 for(const t of TECHNIQUES){const s=emptySave();s.equipped=t.rod as typeof s.equipped;s.tackle.config=techniqueConfig(t.id);
  for(const p of SHOP_PRODUCTS){const i=p.component,c=s.tackle.config;
   const expected=i?slotsFor(c.method,c.recipe,c.technique).includes(i.slot)&&i.methods.includes(c.method)&&(!i.techniques||i.techniques.includes(t.id)):p.item?.kind==='rod'&&rodCompatible(p.id,c.method,t.id);
   assert.equal(shopCompatible(p,s),expected,`${t.id} / ${p.id}`);
   if(expected)assert.ok(shopMethods(p).some(m=>m.id===t.id),`Méthode de fiche absente : ${t.id} / ${p.id}`);
  }
 }
});
test('Boutique : recherche générale inclut le rayon sans confondre compatibilité, argent et accès',()=>{
 const s=emptySave(),before=JSON.stringify(s);
 assert.ok(shopProducts(s,{query:'aquarium'}).some(p=>p.id==='plants'));
 assert.ok(shopProducts(s,{department:'bait',compatible:true}).some(p=>p.id==='corn'));
 assert.ok(!shopProducts(s,{department:'bait',compatible:true}).some(p=>p.id==='minnow'));
 assert.equal(shopProducts(s,{query:'zzintrouvable'}).length,0);
 assert.equal(JSON.stringify(s),before);
});
