import { levelFor, ITEMS, rodCompatible, accessLevel, type ItemId, type RodId } from './economy.ts';
import { POSTS, type PostId } from './posts.ts';
import { component, buyComponent, starterConfig, validateRig, type Slot } from './rig.ts';
import type { MethodId } from './specimens.ts';
import type { SaveData } from './save.ts';
export const PROGRESSION_CONFIG = {version:1,reedsLevel:3,precisionCatches:2,lureFirstCatch:1};
export interface Rights { methods:MethodId[]; posts:PostId[]; precision:number; initiation:boolean; mastery:Partial<Record<MethodId,number>>; legacy:boolean }
export const initialRights = ():Rights => ({methods:['pole'],posts:['jetty','cove','bank'],precision:0,initiation:false,mastery:{},legacy:false});
export const methodAccess = (save:SaveData,method:MethodId) => save.development?.kind==='sandbox'||save.progression.methods.includes(method);
export function refreshRights(save:SaveData) {
  const p=save.progression;
  if(!p.methods.includes('pole'))p.methods.push('pole');
  if(levelFor(save.xp)>=PROGRESSION_CONFIG.reedsLevel || p.precision>=PROGRESSION_CONFIG.precisionCatches) if(!p.posts.includes('reed-bank'))p.posts.push('reed-bank');
  if(levelFor(save.xp)>=3 || (p.mastery.pole??0)>=3) for(const m of ['float','bottom'] as MethodId[])if(!p.methods.includes(m))p.methods.push(m);
  for(const post of POSTS.filter(p=>p.initial))if(!p.posts.includes(post.id))p.posts.push(post.id);
}
export function initiateLures(save:SaveData):string {
  if(save.total<PROGRESSION_CONFIG.lureFirstCatch)return 'Réussissez une première capture avec le kit gratuit.';
  save.progression.initiation=true;
  if(!save.progression.methods.includes('lure'))save.progression.methods.push('lure');
  if(!save.inventory.includes('starter'))save.inventory.push('starter');
  return '';
}
export const postAccess = (save:SaveData,id:PostId) => POSTS.find(p=>p.id===id)?.implemented===true && (save.development?.kind==='sandbox'||save.progression.posts.includes(id));
export const postCondition = (save:SaveData,id:PostId) => id==='reed-bank' ? `Niveau ${PROGRESSION_CONFIG.reedsLevel} OU ${PROGRESSION_CONFIG.precisionCatches} prises au coup dans le cercle du ponton (${save.progression.precision}/${PROGRESSION_CONFIG.precisionCatches}).` : 'À venir : contraintes et scène locale à terminer.';
export function itemCondition(save:SaveData,id:string):string {
  if(save.development?.kind==='sandbox'&&(ITEMS.some(i=>i.id===id)||component(id)))return '';
  const item=ITEMS.find(i=>i.id===id), c=component(id);
  if(item && save.inventory.includes(item.id) || c && !c.free && (save.tackle.stock[id]??0)>0)return ''; // droit acquis
  if(item) {
    if(item.kind==='rod'&&!save.progression.methods.some(m=>rodCompatible(id,m)))return 'Ouvrez d’abord la pratique compatible.';
    if(levelFor(save.xp)<accessLevel(id)&&!(id==='pole-elastic'&&(save.progression.mastery.pole??0)>=3))return `Niveau ${accessLevel(id)}${id==='pole-elastic'?' OU 3 prises au coup':''}.`;
    return '';
  }
  if(!c)return 'Contenu à venir ou inconnu.';
  if(!c.methods.some(m=>methodAccess(save,m)))return 'Ouvrez une pratique compatible.';
  if(!c.free&&!save.progression.legacy&&['minnow','tooth-leader','soft-elastic'].includes(id)&&levelFor(save.xp)<3&&(save.progression.mastery[c.methods[0]]??0)<3)return 'Niveau 3 OU 3 prises dans la pratique compatible.';
  return '';
}
export function purchaseComponent(save:SaveData,id:string,count=1):string {
  const reason=itemCondition(save,id);if(reason)return reason;
  const result=buyComponent(save.tackle,id,save.development?.unlimitedMoney?1000000000:save.coins,count);if(!result.error){if(save.development)save.development.theoreticalCost+=(component(id)?.price??0)*count;if(!save.development?.unlimitedMoney)save.coins=result.coins;}return result.error;
}
export function switchPractice(save:SaveData,method:MethodId):string {
  if(save.tackle.active&&!save.tackle.active.resolved)return 'Ramenez la ligne avant de changer de pratique.';
  if(!methodAccess(save,method))return method==='lure'?'Après la première prise, terminez l’initiation aux leurres.':'Niveau 3 OU 3 prises au coup.';
  const old=save.tackle.config;
  save.tackle.setups[old.method]={rod:save.equipped as RodId,config:structuredClone(old)};
  const kept=save.tackle.setups[method];
  if(kept&&save.inventory.includes(kept.rod)&&!validateRig(save.tackle,kept.config).length){save.equipped=kept.rod;save.tackle.config=structuredClone(kept.config);}
  else {if(!rodCompatible(save.equipped,method))save.equipped=method==='pole'?'pole-starter':'starter';save.tackle.config=starterConfig(method);}
  save.preparation.method=method;save.preparation.bait=method==='lure'?'lure':'worm';return '';
}
export function equipRod(save:SaveData,id:ItemId):string {
  if(save.tackle.active&&!save.tackle.active.resolved)return 'Ramenez la ligne avant de changer de canne.';
  if(!save.inventory.includes(id))return 'Canne non possédée.';
  if(!rodCompatible(id,save.tackle.config.method))return 'Canne incompatible avec cette pratique.';
  save.equipped=id;return '';
}
export function equipComponent(save:SaveData,slot:Slot,id:string):string {
  if(save.tackle.active&&!save.tackle.active.resolved)return 'Ramenez la ligne avant de modifier le montage.';
  const c=component(id);
  if(!c||c.slot!==slot||!c.methods.includes(save.tackle.config.method))return 'Composant incompatible.';
  const reason=itemCondition(save,id);if(reason)return reason;
  const next=structuredClone(save.tackle.config);next.components[slot]=id;
  const errors=validateRig(save.tackle,next);if(errors.length)return errors.join(' ');
  save.tackle.config=next;return '';
}
export function restoreFreeKit(save:SaveData):string {
  if(save.tackle.active&&!save.tackle.active.resolved)return 'Ramenez la ligne avant de réparer.';
  const m=save.tackle.config.method;if(!methodAccess(save,m))return 'Pratique non ouverte.';
  save.equipped=m==='pole'?'pole-starter':'starter';save.tackle.config=starterConfig(m);
  return ''; // aucun gain, aucun débit et aucune modification de la réserve
}
