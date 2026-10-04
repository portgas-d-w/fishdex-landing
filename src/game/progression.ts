import {familyFor,familyAvailable,masteryRank,variantRank} from './curriculum.ts';
import { levelFor, ITEMS, rodCompatible, accessLevel, type ItemId, type RodId } from './economy.ts';
import { POSTS, ALL_POSTS, type PostId } from './posts.ts';
import { component, buyComponent, starterConfig, techniqueConfig, validateRig, type Slot } from './rig.ts';
import {TECHNIQUES,techniqueById,defaultTechnique,type TechniqueId} from './techniques.ts';
import type { MethodId } from './specimens.ts';
import type { SaveData } from './save.ts';
export const PROGRESSION_CONFIG = {version:1,reedsLevel:3,precisionCatches:2,lureFirstCatch:1};
export function postUnlockProgress(save:SaveData,id:PostId){
 const level=levelFor(save.xp);if(id==='reed-bank')return [{label:'Niveau',value:level,target:PROGRESSION_CONFIG.reedsLevel},{label:'Prises au coup dans le cercle du ponton',value:save.progression.precision,target:PROGRESSION_CONFIG.precisionCatches}];
 const rules:Partial<Record<PostId,[number,MethodId|'total',number]>>={point:[6,'lure',6],timber:[10,'lure',12],river:[4,'pole',3],deep:[10,'lure',8],boat:[6,'lure',6],estuary:[4,'total',8],pacific:[4,'total',8],managed:[4,'total',8],'cold-lake':[6,'total',16],american:[6,'total',16],asian:[6,'total',16]};
 const rule=rules[id];if(!rule)return [];return [{label:'Niveau',value:level,target:rule[0]},{label:rule[1]==='total'?'Captures':rule[1]==='pole'?'Prises au coup':'Prises aux leurres',value:rule[1]==='total'?save.total:save.progression.mastery[rule[1]]??0,target:rule[2]}];
}
export interface Rights { methods:MethodId[]; posts:PostId[]; precision:number; initiation:boolean; mastery:Partial<Record<MethodId,number>>; legacy:boolean;techniques?:TechniqueId[];techniqueMastery?:Partial<Record<TechniqueId,number>> }
export const initialRights = ():Rights => ({methods:['pole'],posts:['jetty','cove','bank'],precision:0,initiation:false,mastery:{},legacy:false});
export const methodAccess = (save:SaveData,method:MethodId) => save.development?.kind==='sandbox'||save.progression.methods.includes(method);
export function refreshRights(save:SaveData) {
  const p=save.progression;
  p.techniques??=p.methods.map(defaultTechnique);p.techniqueMastery??={};
  if(!p.methods.includes('pole'))p.methods.push('pole');
  if(levelFor(save.xp)>=PROGRESSION_CONFIG.reedsLevel || p.precision>=PROGRESSION_CONFIG.precisionCatches) if(!p.posts.includes('reed-bank'))p.posts.push('reed-bank');
  for(const post of POSTS.filter(p=>p.initial))if(!p.posts.includes(post.id))p.posts.push(post.id);
  for(const [id,level,method,target] of [['point',6,'lure',6],['timber',10,'lure',12],['river',4,'pole',3],['deep',10,'lure',8],['boat',6,'lure',6]] as const)if(levelFor(save.xp)>=level||(p.mastery[method]??0)>=target)if(!p.posts.includes(id))p.posts.push(id);
  if(levelFor(save.xp)>=4||save.total>=8)for(const id of ['estuary','pacific','managed'] as const)if(!p.posts.includes(id))p.posts.push(id);
  if(levelFor(save.xp)>=6||save.total>=16)for(const id of ['cold-lake','american','asian'] as const)if(!p.posts.includes(id))p.posts.push(id);
  for(const t of TECHNIQUES)if(familyAvailable(save,familyFor(t.id).id)&&masteryRank(save,familyFor(t.id).id)>=variantRank(t.id)){
    if(!p.techniques.includes(t.id))p.techniques.push(t.id);
    if(!p.methods.includes(t.base))p.methods.push(t.base);
  }
  if(p.methods.includes('lure')&&!p.techniques.includes('leurre'))p.techniques.push('leurre');
}
export const techniqueAccess=(s:SaveData,id:TechniqueId)=>s.development?.kind==='sandbox'||s.progression.techniques?.includes(id)===true;
export const techniqueCondition=(s:SaveData,id:TechniqueId)=>{if(techniqueAccess(s,id))return '';const f=familyFor(id);return !familyAvailable(s,f.id)?`${f.name} : niveau ${f.level} OU quête d’apprentissage terminée (accessible niveau ${f.quest}).`:`Maîtrise ${variantRank(id)} de ${f.name} ; réussites distinctes de conduite.`;};
export function switchTechnique(save:SaveData,id:TechniqueId,recipe?:string):string {
  if(save.tackle.active&&!save.tackle.active.resolved)return 'Ramenez la ligne avant de changer de technique.';
  if(!techniqueAccess(save,id))return techniqueCondition(save,id);
  const t=techniqueById(id),old=save.tackle.config;
  save.tackle.techniqueSetups??={};
  if(old.technique)save.tackle.techniqueSetups[old.technique]={rod:save.equipped as RodId,config:structuredClone(old)};
  const kept=save.tackle.techniqueSetups[id];
  let next:typeof old;try{next=recipe?techniqueConfig(id,recipe):kept?.config??techniqueConfig(id);}catch{return 'Recette incompatible.';}
  const rod=kept&&!recipe&&save.inventory.includes(kept.rod)&&rodCompatible(kept.rod,t.base,id)?kept.rod:t.rod as RodId;
  if(!save.inventory.includes(rod)){const item=ITEMS.find(i=>i.id===rod);if(!item||item.price!==0)return 'Canne compatible non possédée.';save.inventory.push(rod);}
  // No purchase/consumption at selection. Missing stock remains visible and blocks the cast.
  save.equipped=rod;save.tackle.config=structuredClone(next);save.preparation.method=t.base;save.preparation.bait=t.base==='lure'?'lure':'worm';return '';
}
export function initiateLures(save:SaveData):string {
  if(!familyAvailable(save,'exploration'))return 'Exploration : niveau 15 OU quête accessible dès le niveau 5.';
  save.progression.initiation=true;
  if(!save.progression.methods.includes('lure'))save.progression.methods.push('lure');
  return '';
}
export const postAccess = (save:SaveData,id:PostId) => ALL_POSTS.find(p=>p.id===id)?.implemented===true && (save.development?.kind==='sandbox'||save.progression.posts.includes(id));
export const postCondition = (save:SaveData,id:PostId) => ['estuary','pacific','managed'].includes(id)?'Niveau 4 OU 8 captures.':['cold-lake','american','asian'].includes(id)?'Niveau 6 OU 16 captures.':id==='reed-bank' ? `Niveau ${PROGRESSION_CONFIG.reedsLevel} OU ${PROGRESSION_CONFIG.precisionCatches} prises au coup dans le cercle du ponton (${save.progression.precision}/${PROGRESSION_CONFIG.precisionCatches}).` : id==='river'?'Niveau 4 OU 3 prises au coup.':id==='timber'?'Niveau 10 OU 12 prises aux leurres.':id==='deep'?'Niveau 10 OU 8 prises aux leurres.':'Niveau 6 OU 6 prises aux leurres.';
export function itemCondition(save:SaveData,id:string):string {
  if(save.development?.kind==='sandbox'&&(ITEMS.some(i=>i.id===id)||component(id)))return '';
  const item=ITEMS.find(i=>i.id===id), c=component(id);
  if(item && save.inventory.includes(item.id) || c && !c.free && (save.tackle.stock[id]??0)>0)return ''; // droit acquis
  if(item) {
    if(item.kind==='rod'&&!TECHNIQUES.some(t=>techniqueAccess(save,t.id)&&rodCompatible(id,t.base,t.id)))return 'Ouvrez une famille compatible par niveau OU quête.';
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
  if(!rodCompatible(id,save.tackle.config.method,save.tackle.config.technique))return 'Canne incompatible avec cette pratique.';
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
  if(save.tackle.config.technique){const id=save.tackle.config.technique,t=techniqueById(id);save.equipped=t.rod as RodId;save.tackle.config=techniqueConfig(id);return '';}
  save.equipped=m==='pole'?'pole-starter':'starter';save.tackle.config=starterConfig(m);
  return ''; // aucun gain, aucun débit et aucune modification de la réserve
}
