import type {SaveData} from './save.ts';
import type {TechniqueId} from './techniques.ts';
export const CURRICULUM_CONFIG={version:1,maxLevel:150,baseXP:50,incrementXP:6,maxIncrement:160,questReward:45,cleanBonus:.1};
export const FAMILIES=[
 {id:'bordure',name:'Bordure',real:'Canne au coup',level:1,quest:1,entry:'coup',methods:['coup'],skills:['depth','strike','receive']},
 {id:'exploration',name:'Exploration',real:'Spinning / casting',level:15,quest:5,entry:'leurre',methods:['leurre','ultraleger','mort_manie'],skills:['layer','animation','receive']},
 {id:'precision',name:'Précision',real:'Canne feeder',level:30,quest:20,entry:'feeder',methods:['feeder','method_feeder'],skills:['deposit','diffusion','receive']},
 {id:'distance',name:'Distance',real:'Canne anglaise',level:45,quest:35,entry:'anglaise',methods:['anglaise','bombette'],skills:['depth','contact','receive']},
 {id:'puissance',name:'Puissance',real:'Posé / carpe',level:60,quest:50,entry:'fond',methods:['fond','carpe','surface','stalking'],skills:['departure','drag','receive']},
 {id:'controle',name:'Contrôle',real:'Grande canne à déboîter',level:75,quest:65,entry:'grande_canne',methods:['grande_canne','carpodrome'],skills:['elastic','kit','receive']},
 {id:'riviere',name:'Rivière',real:'Toc / bolognaise',level:90,quest:80,entry:'toc',methods:['toc','bolognaise'],skills:['drift','strike','receive']},
 {id:'soie',name:'Soie',real:'Mouche / nymphe',level:105,quest:95,entry:'mouche',methods:['mouche','nymphe_fil'],skills:['deposit','manual','receive']},
 {id:'profondeur',name:'Profondeur',real:'Verticale / gambe',level:120,quest:110,entry:'verticale',methods:['verticale','gambe'],skills:['layers','rise','receive']},
 {id:'traine',name:'Traîne',real:'Ensemble de traîne',level:135,quest:125,entry:'traine',methods:['traine'],skills:['passage','boat','receive']},
 {id:'silure',name:'Silure',real:'Ensemble avec clonk',level:150,quest:140,entry:'clonk',methods:['clonk'],skills:['depth','clonk','receive']},
] as const;
export type FamilyId=typeof FAMILIES[number]['id'];
export interface Curriculum {version:1;legacy:FamilyId[];quests:Partial<Record<FamilyId,{steps:string[];rewarded:boolean}>>;skills:Partial<Record<FamilyId,string[]>>}
export const initialCurriculum=():Curriculum=>({version:1,legacy:[],quests:{},skills:{}});
export const familyFor=(id:TechniqueId)=>FAMILIES.find(f=>(f.methods as readonly string[]).includes(id))!;
export const xpThreshold=(level:number)=>{let xp=0;for(let l=1;l<Math.min(150,level);l++)xp+=50+Math.min(6*(l-1),160);return xp;};
export const curriculumLevel=(xp:number)=>{let l=1;while(l<150&&xp>=xpThreshold(l+1))l++;return l;};
export const questComplete=(s:SaveData,id:FamilyId)=>{const f=FAMILIES.find(f=>f.id===id)!;return f.skills.every(k=>s.curriculum?.quests[id]?.steps.includes(k));};
export const familyAvailable=(s:SaveData,id:FamilyId)=>s.development?.kind==='sandbox'||s.progression.legacy&&!s.curriculum?.legacy.length||!!s.curriculum?.legacy.includes(id)||curriculumLevel(s.xp)>=FAMILIES.find(f=>f.id===id)!.level||questComplete(s,id);
export const masteryRank=(s:SaveData,id:FamilyId)=>Math.min(5,1+(s.curriculum?.skills[id]?.length??0));
const VARIANTS:Partial<Record<TechniqueId,number>>={ultraleger:2,mort_manie:3,method_feeder:2,bombette:2,carpodrome:2,nymphe_fil:3,gambe:2,stalking:2};
export const variantRank=(id:TechniqueId)=>VARIANTS[id]??1;
export function learnSkill(s:SaveData,id:FamilyId,skill:string,quest=false){
 s.curriculum??=initialCurriculum();
 if(quest){const f=FAMILIES.find(f=>f.id===id)!;if(!(f.skills as readonly string[]).includes(skill))return false;const q=s.curriculum.quests[id]??={steps:[],rewarded:false};if(!q.steps.includes(skill))q.steps.push(skill);if(questComplete(s,id)&&!q.rewarded){q.rewarded=true;s.coins+=id==='bordure'?0:CURRICULUM_CONFIG.questReward;}return questComplete(s,id);}
 const allowed=['contact','trajectory','retrieval','receive'];if(!allowed.includes(skill))return false;const list=s.curriculum.skills[id]??=[];if(!list.includes(skill))list.push(skill);return true;
}
export function parseCurriculum(v:unknown):Curriculum {
 if(!v||typeof v!=='object')throw Error('Parcours invalide');const d=v as Curriculum;
 if(d.version!==1||!Array.isArray(d.legacy)||d.legacy.some(id=>!FAMILIES.some(f=>f.id===id))||new Set(d.legacy).size!==d.legacy.length||!d.quests||!d.skills)throw Error('Droits de famille invalides');
 for(const [id,q]of Object.entries(d.quests)){const f=FAMILIES.find(f=>f.id===id);if(!f||!Array.isArray(q.steps)||q.steps.some(k=>!(f.skills as readonly string[]).includes(k))||new Set(q.steps).size!==q.steps.length||typeof q.rewarded!=='boolean'||q.rewarded&&!f.skills.every(k=>q.steps.includes(k)))throw Error('Quête invalide');}
 for(const [id,keys]of Object.entries(d.skills))if(!FAMILIES.some(f=>f.id===id)||!Array.isArray(keys)||keys.some(k=>!['contact','trajectory','retrieval','receive'].includes(k))||new Set(keys).size!==keys.length)throw Error('Maîtrise invalide');return structuredClone(d);
}
