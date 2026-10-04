import {curriculumLevel} from './curriculum.ts';
import { techniqueById,type TechniqueId } from './techniques.ts';
import { SPECIES } from './catalog.ts';
import type { Specimen, Reward } from './specimens.ts';
export const ITEMS = [
  { id: 'pole-starter', name: 'Canne au coup 6 m', price: 0, kind: 'rod', power: 1, description: 'Kit gratuit sans moulinet. Placement proche, longueur de ligne fixe.' },
  { id: 'pole-elastic', name: 'Canne au coup amortie', price: 65, kind: 'rod', power: 1.12, description: 'Meilleur amortissement au coup ; portée de placement 6,4 m, sans moulinet.' },
  { id: 'starter', name: 'Canne de bordure', price: 0, kind: 'rod', power: 1, description: 'Réutilisable. Les trois montages de base sont inclus.' },
  { id: 'balanced', name: 'Canne souple', price: 70, kind: 'rod', power: 1.18, description: '18 % de récupération et d’amortissement en plus.' },
  { id: 'precision', name: 'Canne de précision', price: 160, kind: 'rod', power: 1.32, description: '32 % de récupération et d’amortissement en plus.' },
  {id:'long-pole',name:'Grande canne 12 m de secours',price:0,kind:'rod',power:1.12,description:'Emmanchements, élastique et déboîtement ; sans moulinet.'},
  {id:'bolo-rod',name:'Canne de dérive de secours',price:0,kind:'rod',power:1,description:'Contrôle de bannière au courant, toc et bolognaise.'},
  {id:'feeder-rod',name:'Canne feeder de secours',price:0,kind:'rod',power:1.1,description:'Scion sensible ; lecture du dépôt et de la touche.'},
  {id:'heavy-rod',name:'Canne forte de secours',price:0,kind:'rod',power:1.32,description:'Réserve de contrôle pour carpe, monture, traîne et clonk.'},
  {id:'deep-rod',name:'Canne verticale de secours',price:0,kind:'rod',power:1.18,description:'Couche profonde et petites levées ; contrôle direct du fil.'},
  {id:'fly-rod',name:'Canne à mouche de secours',price:0,kind:'rod',power:1.08,description:'Masse de soie et préparation du lancer ; ligne ou moulinet.'},
  {id:'light-rod',name:'Canne ultralégère de secours',price:0,kind:'rod',power:.92,description:'Petites présentations, précision et résistance limitée.'},
  { id: 'plants', name: 'Bosquet aquatique', price: 35, kind: 'decor', power: 1, description: 'Des plantes dans votre aquarium.' },
  { id: 'rocks', name: 'Rochers de rivière', price: 40, kind: 'decor', power: 1, description: 'Un abri minéral dans votre aquarium.' },
] as const;
export type ItemId = typeof ITEMS[number]['id'];
export type RodId = Exclude<ItemId,'plants'|'rocks'>;
export const rodCompatible = (id:string,method:string,technique?:TechniqueId) => {
 if(technique){const t=techniqueById(technique);if(t.base!==method)return false;if(t.sections)return id==='long-pole';if(technique==='coup')return ['pole-starter','pole-elastic','long-pole'].includes(id);if(['mouche','nymphe_fil'].includes(technique))return id==='fly-rod';if(technique==='ultraleger')return id==='light-rod';if(id===t.rod)return true;return t.context.includes('pond')&&['starter','balanced','precision','heavy-rod'].includes(id)&&method!=='pole';}
 return method==='pole'?['pole-starter','pole-elastic','long-pole'].includes(id):['starter','balanced','precision','bolo-rod','feeder-rod','heavy-rod','deep-rod','fly-rod','light-rod'].includes(id);
};
export const REWARD_BASE = { roach: 12, perch: 15, carp: 22, pike: 25, zander: 20, bream: 16, tench: 18, rudd: 12, bleak: 10, crucian: 14, whitebream: 13, gudgeon: 10, chub: 17, ide: 17, catfish: 28 };
export function rewardFor(s: Specimen, first: boolean, record: boolean): Reward {
  const species = SPECIES.find(f => f.id === s.speciesId)!;
  const size = (s.length - species.min) / (species.max - species.min);
  const base = Math.round(((REWARD_BASE as Record<string,number>)[s.speciesId]??Math.min(22,Math.round(8+species.strength*6))) * (1 + size * 0.6) * (s.mirage ? 1.8 : s.coloration === 'golden' ? 1.15 : 1));
  const discovery = first ? 20 : 0, best = record && !first ? 10 : 0;
  return { base, discovery, record: best, coins: base + discovery + best, xp: 40 + Math.round(size * 15) + (first ? 20 : 0) };
}
export const levelFor = (xp: number) => curriculumLevel(xp);
export const BADGES = { first: 'Première rencontre', diversity: 'Les espèces de l’étang', contact: 'Main légère : combat contrôlé', lure: 'Au leurre', bottom: 'Au fond', collector: 'Dix souvenirs', record: 'Un nouveau record' };

export const accessLevel = (id: string) => id === 'precision' ? 2 : id === 'pole-elastic' ? 3 : 1;
