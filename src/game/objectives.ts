import {SPECIES} from './catalog.ts';
import {levelFor} from './economy.ts';
import {TECHNIQUES} from './techniques.ts';
import {ALL_POSTS} from './posts.ts';
import {PROGRESSION_CONFIG,postUnlockProgress,postAccess,postCondition,techniqueAccess,techniqueCondition} from './progression.ts';
import type {SaveData} from './save.ts';
export interface ObjectiveView {id:string;title:string;action:string;consequence:string;paths:{label:string;value:number;target:number}[];destination:string;complete:boolean;condition:string}
export function objectives(save:SaveData):ObjectiveView[]{
 const level=levelFor(save.xp),goals:ObjectiveView[]=[
  {id:'first',title:'Ma première capture',action:'Préparer le kit au coup',consequence:'Un souvenir au carnet et accès à l’initiation aux leurres.',paths:[{label:'Captures',value:save.total,target:1}],destination:'preparation',complete:save.total>0,condition:'Réussir une capture avec une pratique ouverte.'},
  {id:'initiation',title:'Découvrir les leurres',action:save.total?'Voir l’initiation':'Préparer ma première capture',consequence:'Ouvre définitivement le kit leurres après l’initiation.',paths:[{label:'Première capture',value:save.total,target:1}],destination:save.total?'initiation':'preparation',complete:save.progression.initiation,condition:'Première capture puis initiation aux leurres.'},
  {id:'reed-bank',title:'La bordure des roseaux',action:'Voir le défi du ponton',consequence:'Le pêcheur libère définitivement ce poste.',paths:[{label:'Niveau',value:level,target:PROGRESSION_CONFIG.reedsLevel},{label:'Prises au coup dans le cercle du ponton',value:save.progression.precision,target:PROGRESSION_CONFIG.precisionCatches}],destination:'map',complete:postAccess(save,'reed-bank'),condition:postCondition(save,'reed-bank')},
 ];
 for(const t of TECHNIQUES)goals.push({id:`tech:${t.id}`,title:t.name,action:techniqueAccess(save,t.id)?'Préparer mon matériel':'Voir les conditions',consequence:'Ouvre cette technique et sa canne de secours.',paths:[{label:'Niveau',value:level,target:t.level},{label:{pole:'Prises au coup',float:'Prises au flotteur',bottom:'Prises au fond',lure:'Prises aux leurres'}[t.base],value:save.progression.mastery[t.base]??0,target:t.target}],destination:'preparation',complete:techniqueAccess(save,t.id),condition:techniqueCondition(save,t.id)});
 goals.push({id:'collection',title:'Une nouvelle découverte',action:'Explorer le FishDex',consequence:'Enrichit la collection, sans créer une nouvelle espèce pour une taille.',paths:[{label:'Découvertes',value:new Set([...Object.keys(save.records),...save.observations.map(o=>o.speciesId)]).size,target:SPECIES.length}],destination:'encyclopedia',complete:new Set([...Object.keys(save.records),...save.observations.map(o=>o.speciesId)]).size===SPECIES.length,condition:'Découvrir les identités confirmées, par capture ou observation.'});
 for(const p of ALL_POSTS.filter(p=>!p.initial&&p.id!=='reed-bank'))goals.push({id:'post:'+p.id,title:p.name,action:'Voir ce poste',consequence:'Accès permanent à ce poste.',paths:postUnlockProgress(save,p.id),destination:'map',complete:postAccess(save,p.id),condition:postCondition(save,p.id)});
 const lure=goals.find(g=>g.id==='tech:leurre')!;lure.paths=[{label:'Première capture',value:save.total,target:1}];lure.action=save.total&&!lure.complete?'Voir l’initiation':'Préparer mon matériel';lure.destination=save.total&&!lure.complete?'initiation':'preparation';goals.find(g=>g.id==='tech:coup')!.paths=[];
 return goals;
}
export const validObjective=(id:unknown):id is string=>typeof id==='string'&&(['first','initiation','reed-bank','collection'].includes(id)||id.startsWith('tech:')&&TECHNIQUES.some(t=>t.id===id.slice(5))||id.startsWith('post:')&&ALL_POSTS.some(p=>p.id===id.slice(5)));
export function trackedObjective(save:SaveData){const goals=objectives(save);return goals.find(g=>g.id===save.ui?.trackedObjective)??goals.find(g=>!g.complete)??goals[0];}
export const DESTINATIONS=[{id:'willow-pond',name:'L’étang des Saules',posts:['jetty','cove','bank','reed-bank','point','timber']},{id:'running-river',name:'Rivière des Aulnes',posts:['river']},{id:'deep-lake',name:'Lac profond',posts:['deep','boat']},...ALL_POSTS.filter(p=>['cold-lake','estuary','pacific','american','asian','managed'].includes(p.id)).map(p=>({id:p.id,name:p.name,posts:[p.id]}))];
export const destinationForPost=(post:string)=>DESTINATIONS.find(d=>d.posts.includes(post))!;
