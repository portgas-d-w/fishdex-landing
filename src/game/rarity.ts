import { SPECIES, type SpeciesId } from './catalog.ts';
import type { Specimen } from './specimens.ts';
import registry from './fish-registry.json' with {type:'json'};
// Classification éditoriale du prototype, distincte de présence locale et résistance.
export const RARITIES = [
  { id:'common', name:'Commun', rank:1 }, { id:'uncommon', name:'Peu commun', rank:2 },
  { id:'rare', name:'Rare', rank:3 }, { id:'exceptional', name:'Exceptionnel', rank:4 },
  { id:'legendary', name:'Légendaire', rank:5 },
] as const;
export type RarityId = typeof RARITIES[number]['id'];
export const rarityName = (id:RarityId) => RARITIES.find(r=>r.id===id)!.name;
export const SPECIES_RARITY:Record<SpeciesId,RarityId> = {
  ...Object.fromEntries(registry.species.map(s=>[s.id,s.rarity as RarityId])),
  roach:'common',perch:'common',carp:'uncommon',pike:'uncommon',zander:'rare',bream:'common',
  tench:'uncommon',rudd:'common',bleak:'common',crucian:'uncommon',whitebream:'common',
  gudgeon:'common',chub:'uncommon',ide:'uncommon',catfish:'rare',
};
export function specimenRarity(s:Pick<Specimen,'speciesId'|'length'|'coloration'|'mirage'>):RarityId {
  const f=SPECIES.find(f=>f.id===s.speciesId)!, size=(s.length-f.min)/(f.max-f.min);
  // Aucun individu « légendaire » aléatoire : ces rencontres ne sont pas conçues ici.
  if(s.mirage || size>=.92) return 'exceptional';
  if(s.coloration==='golden'||size>=.75) return 'rare';
  return SPECIES_RARITY[s.speciesId];
}
export const catalogueRarity = (id:string):RarityId =>
  id.startsWith('kit-')||id==='starter'||id==='pole-starter'?'common':
  ['precision','tooth-leader','minnow','pole-elastic'].includes(id)?'rare':'uncommon';
