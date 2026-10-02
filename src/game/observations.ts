import {speciesById} from './catalog.ts';
import {populationWeight,inspectPostTarget,type PostId} from './posts.ts';
import {weightFor,uniqueId} from './specimens.ts';
import {chooseAppearance,appearanceFor} from './fish-registry.ts';
export interface Observation {id:string;speciesId:string;appearanceId?:string;seed:number;length:number;weight:number;date:string;post:PostId;duration:number;target:{x:number;z:number};xp:number}
export class ObservationSession {
 elapsed=0;holding=false;complete=false;cancelled=false;
 readonly specimen:Observation;
 readonly post:PostId;
 constructor(post:PostId,id:string,seed:number,random:()=>number=Math.random,scenario?:{appearanceId?:string;length?:number}){
  this.post=post;
  const species=speciesById(id);if(!species||species.mode!=='observation')throw Error('Espèce hors observation');
  const target={x:0,z:5},aim=inspectPostTarget(post,target);
  if(!aim.valid||populationWeight(post,id,aim.microzone)<=0)throw Error('Espèce absente de cet habitat');
  const length=scenario?.length??Math.round((species.min+(species.max-species.min)*(.15+random()*.55))*10)/10;
  if(!Number.isFinite(length)||length<species.min||length>species.max||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Scénario individuel invalide');
  const appearanceId=scenario?.appearanceId==='natural'?undefined:scenario?.appearanceId??chooseAppearance(id,post,random);
  if(appearanceId&&!appearanceFor(id,appearanceId))throw Error('Apparence invalide');
  this.specimen={id:uniqueId(),speciesId:id,...(appearanceId?{appearanceId}:{}),seed,length,weight:weightFor(id,length),date:new Date().toISOString(),post,duration:0,target,xp:0};
 }
 step(dt:number){if(!this.holding||this.complete||this.cancelled||!Number.isFinite(dt)||dt<=0)return;this.elapsed=Math.min(12,this.elapsed+Math.min(.1,dt));if(this.elapsed>=12){this.complete=true;this.specimen.duration=this.elapsed;}}
 release(){this.holding=false;}
 cancel(){this.cancelled=true;this.release();}
}
