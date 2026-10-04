import methods from './techniques-data.json' with {type:'json'};
import recipes from './recipes-data.json' with {type:'json'};
import type { MethodId } from './specimens.ts';
export const TECHNIQUE_IDS=['coup','grande_canne','anglaise','bolognaise','fond','feeder','method_feeder','carpe','stalking','surface','leurre','verticale','mort_manie','toc','mouche','nymphe_fil','bombette','gambe','traine','clonk','ultraleger','carpodrome'] as const;
export type TechniqueId=typeof TECHNIQUE_IDS[number];
export type PresentationEngine='fixed'|'drift'|'bottom'|'feeder'|'surface'|'retrieve'|'vertical'|'fly'|'troll'|'clonk';
export type ContextId='pond'|'river'|'deep'|'boat';
export interface Technique {id:TechniqueId;name:string;base:MethodId;engine:PresentationEngine;reel:boolean;level:number;target:number;reach:number;context:ContextId[];signal:string;instruction:string;defaultRecipe:string;rod:string;sections:boolean}
// Prototype configuration. Physical effects live in presentation/combat/rig engines, not in rarity.
const settings:Record<TechniqueId,[MethodId,PresentationEngine,number,number,ContextId[],string,string,string,string,boolean]>={
 coup:['pole','fixed',1,6.4,['pond','river'],'Flotteur','Sondez, placez et amorcez ; observez le flotteur.','flotteur_fixe','pole-starter',false],
 grande_canne:['pole','fixed',3,12,['pond','river'],'Flotteur et élastique','Placez à portée ; déboîtez progressivement après le combat.','plombee_etalee','long-pole',true],
 anglaise:['float','fixed',3,23,['pond','river'],'Waggler','Réglez le stop et contrôlez la bannière au moulinet.','waggler_fixe','starter',false],
 bolognaise:['float','drift',4,23,['river'],'Flotteur en dérive','Accompagnez le courant ; maintenez Retenir pour ralentir la dérive.','bolo_derive','bolo-rod',false],
 fond:['bottom','bottom',3,23,['pond','river','deep'],'Fil et scion','Laissez poser puis réglez le contact avant de ferrer.','fond_coulissant','starter',false],
 feeder:['bottom','feeder',6,23,['pond','river'],'Scion sensible','Remplissez la cage avant chaque lancer ; renouvelez le dépôt.','feeder_coulissant','feeder-rod',false],
 method_feeder:['bottom','feeder',6,23,['pond'],'Départ et scion','Garnissez le feeder ; esche groupée, montage semi-fixe.','method_inline','feeder-rod',false],
 carpe:['bottom','bottom',6,23,['pond','deep'],'Départ du fil','Choisissez cheveu, flottabilité et fixation du lest.','cheveu_coulissant','heavy-rod',false],
 stalking:['float','surface',3,8,['pond'],'Inspection de l’esche','Approche discrète, placement proche, patience avant la prise.','surface_libre','starter',false],
 surface:['float','surface',4,18,['pond'],'Prise en surface','Déposez l’esche flottante, accompagnez sa dérive, ferrez la prise.','surface_libre','starter',false],
 leurre:['lure','retrieve',1,23,['pond','river','deep'],'Contact et fil','Descente, vitesse, animations et pauses.','poisson_nageur','starter',false],
 verticale:['lure','vertical',6,6,['deep','boat'],'Fil vertical','Choisissez la couche ; petites levées et pauses sous le poste.','tete_plombee','deep-rod',false],
 mort_manie:['bottom','retrieve',6,23,['pond','river','deep'],'Contact de la monture','Tirées, relâchés et pauses ; le poisson-appât est consommé.','mort_manie_monture','heavy-rod',false],
 toc:['float','drift',4,12,['river'],'Indicateur et contact','Plombée progressive et contact ; accompagnez la dérive.','toc_etage','bolo-rod',false],
 mouche:['lure','fly',6,23,['river','pond'],'Mouche, indicateur ou soie','Préparez la soie par un aller-retour de canne, puis projetez par glissement.','seche','fly-rod',false],
 nymphe_fil:['float','drift',6,12,['river'],'Indicateur de ligne','Réglez l’immersion ; retenez et accompagnez la nymphe.','toc_nymphe','fly-rod',false],
 bombette:['float','retrieve',4,23,['pond','river'],'Contact et bannière','Corps porteur distinct de l’esche : descente, récupération et pauses.','bombette_flot','starter',false],
 gambe:['lure','vertical',10,6,['deep','boat'],'Scion et potences','Trois imitations à couches distinctes ; levées douces, une réception à la fois.','gambe_nymphes','deep-rod',false],
 traine:['lure','troll',6,23,['boat'],'Contact du leurre','Déployez puis réglez vitesse et parcours ; le bateau anime le leurre.','traine_lac','heavy-rod',false],
 clonk:['bottom','clonk',10,6,['boat'],'Bulles puis fil','Placez à profondeur, courte série sonore puis pause ; aucune réaction garantie.','clonk_vertical','heavy-rod',false],
 ultraleger:['lure','retrieve',3,18,['pond','river'],'Contact sensible','Petit leurre et ensemble léger : précision contre réserve de résistance.','tete_plombee','light-rod',false],
 carpodrome:['pole','fixed',6,12,['pond'],'Flotteur et élastique','Amorçage et grande canne adaptée ; déboîtez sous tension contrôlée.','flotteur_fixe','long-pole',true],
};
const PUBLIC_NAMES:Record<TechniqueId,string>={coup:'Au flotteur',leurre:'Lancer et animer',ultraleger:'Petits leurres',mort_manie:'Poisson-appât animé',feeder:'Cage d’amorce',method_feeder:'Appât groupé',anglaise:'Flotteur à distance',bombette:'Lancer un appât léger',fond:'Au fond',carpe:'Posé pour la carpe',surface:'Appât en surface',stalking:'Approche discrète',grande_canne:'Déposer avec le kit',carpodrome:'Carpe au coup',bolognaise:'Flotteur en rivière',toc:'Dérive naturelle',mouche:'Présenter une mouche',nymphe_fil:'Nymphe sous l’eau',verticale:'Sous le poste',gambe:'Train d’imitations',traine:'Pêcher en déplacement',clonk:'Attirer en profondeur'};
export const TECHNIQUES:readonly Technique[]=methods.map(m=>{const id=m.id as TechniqueId,[base,engine,level,reach,context,signal,instruction,defaultRecipe,rod,sections]=settings[id];return {id,name:PUBLIC_NAMES[id]??m.name,base,engine,level,reach,context,signal,instruction,defaultRecipe,rod,sections,reel:m.requiresReel,target:level===1?1:level<=4?3:level<=6?6:10};});
export const RECIPES=recipes;
export const techniqueById=(id:TechniqueId)=>TECHNIQUES.find(t=>t.id===id)!;
export const recipeById=(id:string)=>RECIPES.find(r=>r.id===id);
export const defaultTechnique=(base:MethodId):TechniqueId=>base==='pole'?'coup':base==='float'?'anglaise':base==='bottom'?'fond':'leurre';
export const techniqueFor=(config:{method:MethodId;technique?:TechniqueId})=>techniqueById(config.technique??defaultTechnique(config.method));
export const compatibleRecipes=(id:TechniqueId)=>RECIPES.filter(r=>r.techniques.includes(id));
export const techniqueContext=(id:TechniqueId,context:ContextId)=>techniqueById(id).context.includes(context);
export const TECHNIQUE_CONFIG={version:2,feederDiffusion:35,pvaSolidDissolve:8,pvaMeshDissolve:4,clonkCooldown:25,noiseDecay:12,branchCount:3,branchSpacing:.5,landingSeconds:1};
