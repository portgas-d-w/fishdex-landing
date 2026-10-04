import {component,slotsFor,techniqueConfig,validateRig,type RigConfig,type Slot,type Tackle} from './rig.ts';
export interface RigPosition {segment:'main_line'|'leader';metres:number}
export function positionRule(c:RigConfig,slot:Slot){
 const item=component(c.components[slot]??''),length=c.leaderLength??.6;
 if(slot==='float')return {segment:'main_line' as const,min:.2,max:25,movable:c.recipe!=='waggler_coulissant',role:'Profondeur sous le flotteur'};
 if(slot==='stop'&&c.components.float)return {segment:'main_line' as const,min:.2,max:25,movable:true,role:'Butée du flotteur coulissant'};
 if(slot==='weight'&&item?.family==='plombs_fendus')return {segment:'main_line' as const,min:.05,max:Math.max(.1,c.depth-.05),movable:true,role:'Distance du lest à l’hameçon ; groupe conservé'};
 if(slot==='leader')return {segment:'leader' as const,min:.1,max:3,movable:true,role:'Longueur du bas de ligne'};
 if(slot==='hair')return {segment:'leader' as const,min:.01,max:.08,movable:true,role:'Longueur du cheveu'};
 return {segment:'leader' as const,min:length,max:length,movable:false,role:'Raccord fixe ; choisir une autre recette pour le déplacer'};
}
export function positionOf(c:RigConfig,slot:Slot){return c.positions?.[slot]?.metres??(slot==='float'||slot==='stop'?c.depth:slot==='leader'?c.leaderLength??.6:slot==='weight'?Math.max(.05,c.depth*(c.distribution==='grouped'?.25:.7)):slot==='hair'?.025:c.leaderLength??.6);}
export function moveRigPart(c:RigConfig,slot:Slot,metres:number){const r=positionRule(c,slot);if(!r.movable||!Number.isFinite(metres))return false;const n=Math.round(Math.max(r.min,Math.min(r.max,metres))*100)/100;c.positions??={};c.positions[slot]={segment:r.segment,metres:n};if(slot==='float'||slot==='stop')c.depth=n;if(slot==='leader')c.leaderLength=n;if(slot==='weight')c.distribution=n/c.depth<.45?'grouped':'spread';return true;}
export function layoutErrors(c:RigConfig){const errors:string[]=[];for(const [key,p]of Object.entries(c.positions??{})){const slot=key as Slot,r=positionRule(c,slot);if(!c.components[slot]||!r.movable||p.segment!==r.segment||!Number.isFinite(p.metres)||p.metres<r.min-.001||p.metres>r.max+.001)errors.push('Position ou segment impossible : '+key);}return errors;}
export function descentFactor(c:RigConfig){const p=c.positions?.weight;return p?Math.max(.55,Math.min(1.6,1.45-p.metres/Math.max(.2,c.depth))):1;}
/** Stock commun : le brouillon ne possède que des références, engagées par reserveRig au lancer. */
export class RigDraft {
 config:RigConfig;readonly original:string;
 constructor(t:Tackle){this.config=structuredClone(t.config);this.original=JSON.stringify(t.config);}
 transform(recipe:string){if(!this.config.technique)return [];const old=this.config,next=techniqueConfig(old.technique!,recipe);const changed:string[]=[];for(const slot of slotsFor(next.method,next.recipe,next.technique)){const i=component(old.components[slot]??'');if(i&&i.methods.includes(next.method)&&(!i.techniques||i.techniques.includes(next.technique!)))next.components[slot]=i.id;if(next.components[slot]!==old.components[slot])changed.push(slot);}next.depth=old.depth;next.leaderLength=old.leaderLength??next.leaderLength;next.drag=old.drag??next.drag;this.config=next;return changed;}
 apply(t:Tackle){if(t.active&&!t.active.resolved)return ['Ramenez la ligne avant de modifier le montage.'];if(JSON.stringify(t.config)!==this.original)return ['La préparation a changé : rouvrez le brouillon.'];const errors=[...validateRig(t,this.config),...layoutErrors(this.config)];if(errors.length)return errors;t.config=structuredClone(this.config);return [];}
}
