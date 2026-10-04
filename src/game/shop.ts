import {ITEMS,rodCompatible} from './economy.ts';
import {COMPONENTS,slotsFor,type Component,type Slot} from './rig.ts';
import {componentAdvice} from './gear-advice.ts';
import type {SaveData} from './save.ts';
import {TECHNIQUES,RECIPES} from './techniques.ts';

export const SHOP_DEPARTMENTS = [
 {id:'rod',name:'Cannes',hint:'Placement et contrôle du poisson'},
 {id:'reel',name:'Moulinets',hint:'Récupérer le fil et régler le frein'},
 {id:'line',name:'Fils',hint:'Relier et protéger votre montage'},
 {id:'rig',name:'Montages',hint:'Présenter l’appât et lire la touche'},
 {id:'bait',name:'Appâts et leurres',hint:'Choisir ce que le poisson rencontre'},
 {id:'accessories',name:'Accessoires',hint:'Amortir et recevoir votre prise'},
] as const;
export type ShopDepartment=typeof SHOP_DEPARTMENTS[number]['id']|'decor';
export interface ShopProduct {id:string;name:string;description:string;price:number;department:ShopDepartment;group:string;family:string;component?:Component;item?:typeof ITEMS[number]}
const rigGroups:Partial<Record<Slot,string>>={float:'Flotteurs',weight:'Plombs',hook:'Hameçons',feeder:'Feeders'};
const groupFor=(i:Component)=>i.slot==='reel'?'Moulinets':i.slot==='main_line'?(i.family==='nylon'?'Nylon':'Corps de ligne'):['leader','tippet'].includes(i.slot)?'Bas de ligne':i.slot==='fly_line'?'Soies':i.slot==='backing'?'Backing':['bait','groundbait'].includes(i.slot)?'Appâts':['lure','fly'].includes(i.slot)?'Leurres et mouches':i.slot==='elastic'?'Élastiques':i.slot==='landing'?'Réception':i.slot==='clonk'?'Clonks':rigGroups[i.slot]??'Autres composants';
const departmentFor=(i:Component):ShopDepartment=>i.slot==='reel'?'reel':['main_line','leader','tippet','fly_line','backing'].includes(i.slot)?'line':['bait','groundbait','lure','fly'].includes(i.slot)?'bait':['elastic','landing','clonk'].includes(i.slot)?'accessories':'rig';
export const SHOP_PRODUCTS:readonly ShopProduct[]=[
 ...ITEMS.map(item=>({id:item.id,name:item.name,description:item.description,price:item.price,department:(item.kind==='rod'?'rod':'decor') as ShopDepartment,group:item.kind==='rod'?'Cannes':'Décorations',family:item.kind,item})),
 ...COMPONENTS.filter(i=>!i.free).map(i=>({id:i.id,name:i.name,description:i.description,price:i.price,department:departmentFor(i),group:groupFor(i),family:i.family,component:i})),
];
export const shopDepartmentName=(id:ShopDepartment)=>id==='decor'?'Décorations d’aquarium':SHOP_DEPARTMENTS.find(d=>d.id===id)!.name;
export function shopCompatible(p:ShopProduct,s:SaveData){
 const c=s.tackle.config,i=p.component;
 return i?slotsFor(c.method,c.recipe,c.technique).includes(i.slot)&&i.methods.includes(c.method)&&(!c.technique||!i.techniques||i.techniques.includes(c.technique)):p.item?.kind==='rod'&&rodCompatible(p.id,c.method,c.technique);
}
export function shopMethods(p:ShopProduct){
 const i=p.component;
 return TECHNIQUES.filter(t=>i?i.methods.includes(t.base)&&(!i.techniques||i.techniques.includes(t.id))&&RECIPES.some(r=>r.techniques.includes(t.id)&&slotsFor(t.base,r.id,t.id).includes(i.slot)):p.item?.kind==='rod'&&rodCompatible(p.id,t.base,t.id));
}
export function shopProducts(s:SaveData,{department,group='all',family='all',query='',compatible=false}:{department?:ShopDepartment;group?:string;family?:string;query?:string;compatible?:boolean}){
 const q=query.trim().toLocaleLowerCase('fr-FR');
 return SHOP_PRODUCTS.filter(p=>(!department||p.department===department)&&(group==='all'||p.group===group)&&(family==='all'||p.family===family)&&(!q||`${p.name} ${p.description} ${shopDepartmentName(p.department)}`.toLocaleLowerCase('fr-FR').includes(q))&&(!compatible||shopCompatible(p,s)));
}
export function shopGroups(department:ShopDepartment){
 const groups=[...new Set(SHOP_PRODUCTS.filter(p=>p.department===department).map(p=>p.group))];
 return groups.filter(g=>g!=='Autres composants').concat(groups.includes('Autres composants')?['Autres composants']:[]);
}
const familyNames:Record<string,string>={naturel:'Invertébrés naturels',vegetal:'Graines et végétaux',artificiel:'Appâts artificiels',prepare:'Appâts préparés',animal:'Appâts animaux',mais:'Maïs',bait:'Polyvalents',groundbait:'Amorces réglables',amorcage:'Amorces',leurre_dur:'Poissons nageurs',leurre_souple:'Leurres souples',leurre_metal:'Leurres métalliques',leurre:'Leurres variés',lure:'Polyvalents',fly:'Mouches réglables',mouche:'Mouches',bas_nylon:'Nylon',bas_acier:'Anti-dents',leader:'Polyvalents',tippet:'Pointes'};
export const shopFamilyName=(id:string)=>familyNames[id]??id.replaceAll('_',' ');
export function shopBenefit(p:ShopProduct){
 const i=p.component;if(!i)return p.item?.kind==='decor'?'Personnaliser mon bassin':p.id==='pole-starter'?'Placer une ligne fixe':p.id==='pole-elastic'?'Amortir au coup':p.description.split(/[.;]/)[0];
 const benefits:Partial<Record<Slot,string>>={reel:'Récupérer et laisser filer',elastic:'Amortir les départs',main_line:'Relier canne et montage',leader:'Protéger le terminal',tippet:'Porter une mouche fine',float:'Rendre la touche visible',weight:'Régler la descente',hook:'Porter l’esche',feeder:'Diffuser l’amorce au fond',bait:'Proposer une esche',lure:'Animer une imitation',fly:'Présenter une mouche',groundbait:'Amorcer une zone',landing:'Recevoir la prise',backing:'Réserve sous la soie',fly_line:'Porter le lancer à mouche'};
 return benefits[i.slot]??componentAdvice(i).role.split(/[.;]/)[0];
}
