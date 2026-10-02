import raw from './fish-profiles.json' with { type: 'json' };
import type { SpeciesId, SpotId } from './catalog.ts';
import type { RigConfig } from './rig.ts';
import { component, rigWarnings } from './rig.ts';
export const PROFILES = raw;
export const PROFILE_IDS = Object.fromEntries(Object.entries(raw).map(([id,p])=>[id,p.id]));
// Présence locale de l'étang et strates de présentation : choix de jeu explicites.
// Un lieu futur n'est jamais ajouté par une affinité d'appât.
const STRATA:Record<SpeciesId,'surface'|'middle'|'bottom'|'mixed'> = {
  roach:'middle', perch:'mixed', carp:'bottom', pike:'mixed', zander:'bottom',
  bream:'bottom', tench:'bottom', rudd:'surface', bleak:'surface', crucian:'bottom',
  whitebream:'bottom', gudgeon:'bottom', chub:'mixed', ide:'middle', catfish:'bottom',
};
const PRESENCE:Record<SpotId,SpeciesId[]> = {
  reeds:['roach','perch','carp','pike','bream','tench','rudd','bleak','crucian','whitebream','gudgeon','chub','ide'],
  open:['roach','perch','carp','pike','zander','bream','rudd','bleak','crucian','whitebream','gudgeon','chub','ide','catfish'],
  willow:['roach','perch','carp','pike','bream','tench','rudd','crucian','whitebream','chub','ide','catfish'],
};
export function presentation(config:RigConfig,waterDepth:number) {
  const weight=component(config.components.weight??'')?.mass??1.7;
  const lure=component(config.components.lure??'');
  const depth=config.method==='bottom'?waterDepth:config.method==='lure'?Math.min(waterDepth,.6+(lure?.mass??5)*.12):Math.min(waterDepth,config.depth);
  const sinkSpeed=config.distribution==='spread'?.28:config.distribution==='touch'?.42:.65;
  return {depth,sinkSpeed:sinkSpeed*Math.max(.4,weight/1.7),quality:rigWarnings(config).length?.35:1};
}
export function encounterWeight(id:SpeciesId,spot:SpotId,config:RigConfig,waterDepth:number,currentDepth:number) {
  if(!PRESENCE[spot].includes(id)) return 0;
  const p=PROFILES[id]; const bait=component(config.components[config.method==='lure'?'lure':'bait']??'');
  const diet=bait?.diet;
  const offered=diet==='fish'?['poissons','alevins']:diet==='plants'?['vegetaux','graines','algues']:['invertebres','invertebres_benthiques','insectes'];
  if(!p.diet_tags.some(tag=>offered.includes(tag))) return 0;
  const band=STRATA[id], ratio=currentDepth/waterDepth;
  if(band==='surface' && currentDepth>.85 || band==='bottom' && ratio<.65 || band==='middle' && (ratio>.9 || currentDepth<.3)) return 0;
  if(config.components.hook==='wide-hook' && ['bleak','gudgeon'].includes(id)) return 0;
  const line=config.components.main_line, leader=config.components.leader;
  const discretion=(line==='fine-line'?1.15:line==='strong-line'?.83:1)*(leader==='fine-leader'?1.12:leader==='tooth-leader'?.85:1);
  return (band==='mixed'?.7:1)*discretion*presentation(config,waterDepth).quality;
}
