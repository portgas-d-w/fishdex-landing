import raw from './fish-profiles.json' with { type: 'json' };
import type { SpeciesId, SpotId } from './catalog.ts';
import type { RigConfig } from './rig.ts';
import { component, rigWarnings } from './rig.ts';
import {offeredComponent} from './presentation.ts';
import {techniqueFor} from './techniques.ts';
import registry from './fish-registry.json' with {type:'json'};
import {speciesById} from './catalog.ts';
export const PROFILES = Object.fromEntries(registry.species.map(s=>[s.id,raw[s.id as keyof typeof raw]??s.profile])) as Record<string,typeof registry.species[number]['profile']>;
export const PROFILE_IDS = Object.fromEntries(Object.entries(raw).map(([id,p])=>[id,p.id]));
// Relative activity for the prototype, not a measured biological probability.
// Undocumented/conditional profiles stay neutral.
export function activityWeight(id:SpeciesId,time:'day'|'dusk'|'night') {
  const a=PROFILES[id].activity;
  if(a.includes('nuit'))return time==='day'?.6:1;
  if(a==='jour'||a==='jour_aube_crepuscule')return time==='night'?.5:1;
  if(a==='faible_lumiere')return time==='day'?.75:1;
  return 1;
}
// Présence locale de l'étang et strates de présentation : choix de jeu explicites.
// Un lieu futur n'est jamais ajouté par une affinité d'appât.
const STRATA:Record<SpeciesId,'surface'|'middle'|'bottom'|'mixed'> = {
  ...Object.fromEntries(registry.species.map(s=>[s.id,s.stratum])) as Record<SpeciesId,'surface'|'middle'|'bottom'|'mixed'>,
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
  if(speciesById(id)?.mode!=='capture')return 0;
  if(Object.hasOwn(raw,id)&&!PRESENCE[spot].includes(id)) return 0;
  const p=PROFILES[id]; const bait=component(config.components[config.method==='lure'?'lure':'bait']??'');
  const diet=bait?.diet;
  const offered=diet==='fish'?['poissons','alevins']:diet==='plants'?['vegetaux','graines','algues']:['invertebres','invertebres_benthiques','insectes','petits_invertebres','micro_invertebres','larves'];
  if(!p.diet_tags.some(tag=>offered.includes(tag))) return 0;
  const band=STRATA[id], ratio=currentDepth/waterDepth;
  if(band==='surface' && currentDepth>.85 || band==='bottom' && ratio<.65 || band==='middle' && (ratio>.9 || currentDepth<.3)) return 0;
  if(config.components.hook==='wide-hook' && ['bleak','gudgeon'].includes(id)) return 0;
  const line=config.components.main_line, leader=config.components.leader;
  const discretion=(line==='fine-line'?1.15:line==='strong-line'?.83:1)*(leader==='fine-leader'?1.12:leader==='tooth-leader'?.85:1);
  return (band==='mixed'?.7:1)*discretion*presentation(config,waterDepth).quality;
}
export function techniqueEncounterWeight(id:SpeciesId,config:RigConfig,waterDepth:number,depth:number,activity:number,noise:number,contact:number) {
  const species=speciesById(id);if(!species||species.mode!=='capture')return 0;
  const t=techniqueFor(config),p=PROFILES[id],bait=offeredComponent(config);
  if(!bait||activity<=0)return 0;
  const offered=bait.diet==='fish'?['poissons','alevins']:bait.diet==='plants'?['vegetaux','graines','algues']:['invertebres','invertebres_benthiques','insectes','petits_invertebres','micro_invertebres','larves'];
  if(!p.diet_tags.some(tag=>offered.includes(tag)))return 0;
  if(t.engine==='clonk'&&id!=='catfish')return 0;
  const surface=depth<.15,band=STRATA[id],ratio=depth/waterDepth;
  if(surface&&band!=='surface'&&band!=='mixed'&&!['carp','chub','rudd','bleak','ide','pike','perch'].includes(id))return 0;
  if(!surface&&(band==='surface'&&depth>.85||band==='bottom'&&ratio<.6||band==='middle'&&(ratio>.92||depth<.3)))return 0;
  if((bait.size??8)>35&&['bleak','roach','gudgeon','rudd','whitebream','crucian'].includes(id))return 0;
  if((bait.size??8)>35&&species.max<35)return 0;
  if((config.components.hook==='wide-hook'||(component(config.components.hook??'')?.size??6)>10)&&['bleak','gudgeon'].includes(id))return 0;
  if((component(config.components.hook??'')?.size??6)>10&&species.max<25)return 0;
  const sizeQuality=(bait.size??8)<15&&['pike','catfish'].includes(id)?.25:1;
  const signalQuality=rigWarnings(config).length?.35:1;
  const discretion=(config.components.main_line==='fine-line'?1.15:config.components.main_line==='strong-line'?.83:1)*(config.components.leader==='fine-leader'?1.12:config.components.leader==='tooth-leader'?.85:1);
  return sizeQuality*signalQuality*discretion*Math.max(.05,1-noise*(.4+p.attributes.agility*.3))*(t.engine==='drift'?.4+contact*.6:1);
}
