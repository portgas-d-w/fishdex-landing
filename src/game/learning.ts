import {FAMILIES,curriculumLevel,learnSkill,type FamilyId} from './curriculum.ts';
import {createTestSave} from './development.ts';
import {techniqueConfig} from './rig.ts';
import {techniqueById} from './techniques.ts';
import {postLocation} from './posts.ts';
import {refreshRights} from './progression.ts';
import type {SaveData} from './save.ts';
import type {FishingGame} from './fishing.ts';
export const SKILL_LABELS:Record<string,string>={depth:'Ajuster la profondeur',strike:'Ferrer sur la touche',receive:'Recevoir la prise',layer:'Explorer une couche utile',animation:'Changer l’animation',deposit:'Déposer deux fois sur le même coup',diffusion:'Laisser diffuser l’amorce',contact:'Reprendre le contact après du mou',departure:'Accompagner un départ',drag:'Ajuster le frein en combat',elastic:'Laisser travailler l’élastique',kit:'Revenir au kit sans créer de fil',drift:'Accompagner une dérive',manual:'Reprendre la ligne à la main',layers:'Essayer deux profondeurs',rise:'Contrôler une remontée',passage:'Déployer une ligne en déplacement',boat:'Ralentir et placer le bateau',clonk:'Faire une série puis respecter la pause'};
/** Le prêt n’est jamais sérialisé dans la clé normale. Seuls les gestes acquis le sont. */
export class LearningSession {
 readonly loan:SaveData;readonly family;private previousPhase='idle';private casts:{x:number;z:number}[]=[];private firstDepth:number;private firstDrag:number;private firstPoint?:{x:number;z:number};private depths=new Map<number,number>();private hadSlack=false;private movedBoat=false;
 readonly normal:SaveData;readonly id:FamilyId;
 constructor(normal:SaveData,id:FamilyId){this.normal=normal;this.id=id;
  this.family=FAMILIES.find(f=>f.id===id)!;if(!this.family||curriculumLevel(normal.xp)<this.family.quest&&normal.development?.kind!=='sandbox')throw Error('Quête non accessible à ce niveau.');
  this.loan=createTestSave('rules');const t=techniqueById(this.family.entry);this.loan.inventory=[...new Set([...this.loan.inventory,t.rod])] as SaveData['inventory'];this.loan.equipped=t.rod as SaveData['equipped'];this.loan.progression.methods=[t.base];this.loan.progression.techniques=[t.id];this.loan.tackle.config=techniqueConfig(t.id);this.loan.preparation.method=t.base;this.loan.preparation.bait=t.base==='lure'?'lure':'worm';const post=t.context.includes('pond')?'jetty':t.context.includes('river')?'river':t.context.includes('boat')?'boat':'deep';this.loan.progression.posts=[post];this.loan.preparation.post=post;this.loan.preparation.location=postLocation(post);this.firstDepth=this.loan.tackle.config.depth;this.firstDrag=this.loan.tackle.config.drag??.5;
 }
 sample(g:FishingGame){const before=JSON.stringify(this.normal.curriculum?.quests[this.id]);
  const mark=(k:string)=>learnSkill(this.normal,this.id,k,true),c=g.config;
  if(Math.abs(c.depth-this.firstDepth)>.15){mark('depth');}
  if(g.phase==='waiting'&&this.previousPhase==='casting'){this.casts.push({...g.target});this.firstPoint??={...g.target};if(this.id==='soie'&&g.presentationState.flyEnergy>=.6)mark('deposit');if(this.casts.length>=2&&Math.hypot(g.target.x-this.casts[0].x,g.target.z-this.casts[0].z)<1)mark('deposit');}
  if(g.phase==='waiting'){
   if(g.presentationDepth>.25&&g.presentationState.activity>.1)mark('layer');if(g.presentationState.animation>.15)mark('animation');if(g.feederConcentration>0&&g.elapsed>1)mark('diffusion');if(g.presentationDepth>.5){const key=Math.round(c.depth*5);this.depths.set(key,Math.max(this.depths.get(key)??0,g.presentationDepth));}if(this.depths.size>=2&&Math.max(...this.depths.keys())-Math.min(...this.depths.keys())>=3&&Math.max(...this.depths.values())-Math.min(...this.depths.values())>=.5)mark('layers');if(this.firstPoint&&g.restrained&&Math.hypot(g.presentationState.point.x-this.firstPoint.x,g.presentationState.point.z-this.firstPoint.z)>.15)mark('drift');if(g.presentationState.boat.z>1&&g.boatSpeed>0){mark('passage');this.movedBoat=true;}
  }
  if(['fighting','landing'].includes(g.phase)){
   if(this.previousPhase==='bite')mark('strike');if(g.pulling&&g.rodLift<.55)mark('departure');if(g.elasticExtension>.12)mark('elastic');if(g.rodSections<=2.5&&g.detachedSections>0)mark('kit');if(Math.abs((c.drag??.5)-this.firstDrag)>.05)mark('drag');if(g.slack>.3)this.hadSlack=true;if(this.hadSlack&&g.tension>.08&&g.tension<.85)mark('contact');if(g.manualRetrieved>.5)mark('manual');if(g.presentationDepth>1&&g.fishPosition.y>-.6&&g.fishDistance<g.distance-1)mark('rise');if(this.movedBoat&&g.boatSpeed<=.3)mark('boat');
  }
  if(g.clonkPulse>0&&g.clonkRemaining<=.01)mark('clonk');if(g.phase==='caught')mark('receive');this.previousPhase=g.phase;const changed=before!==JSON.stringify(this.normal.curriculum?.quests[this.id]);if(changed)refreshRights(this.normal);return changed;
 }
}
