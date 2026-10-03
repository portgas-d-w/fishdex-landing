import {EXTRA_COMPONENTS,EXTRA_SLOT_NAMES} from './catalogue-components.ts';
import {recipeById,techniqueById,type TechniqueId} from './techniques.ts';
import { ITEMS,rodCompatible, type RodId } from './economy.ts';
import type { MethodId } from './specimens.ts';

export type Slot = 'reel' | 'elastic' | 'main_line' | 'leader' | 'float' | 'weight' | 'attachment' | 'hook' | 'bait' | 'lure' | 'backing'|'fly_line'|'tippet'|'feeder'|'bombette'|'fly'|'groundbait'|'swivel'|'snap'|'stop'|'bead'|'lead_clip'|'tube'|'boom'|'hair'|'pva'|'indicator'|'jig_head'|'nail_weight'|'wire_arm'|'harness'|'clonk'|'landing';
export interface Component {
  id: string; name: string; slot: Slot; methods: MethodId[]; family: string;
  free: boolean; price: number; pack: number; unit: 'pièce' | 'm' | 'portion';
  techniques?:string[]; buoyancy?:'float'|'sink'|'balanced'; sinkSpeed?:number; size?:number; retention?:number; diffusion?:number; length?:number;
  consumable?:boolean;
  strength?: number; control?: number; mass?: number; capacity?: number; integrated?: number;
  diet?: 'invertebrates' | 'plants' | 'fish'; description: string;
}
const all: MethodId[] = ['pole','float', 'bottom', 'lure'];
// Valeurs de jeu déclarées, pas des fiches de produits commerciaux ni des forces mesurées.
export const COMPONENTS: Component[] = [
  { id:'kit-elastic',name:'Élastique d’initiation',slot:'elastic',methods:['pole'],family:'elastique',free:true,price:0,pack:1,unit:'pièce',control:1,description:'Amortit le départ au coup ; aucun frein ni récupération de ligne.' },
  { id:'soft-elastic',name:'Élastique progressif',slot:'elastic',methods:['pole'],family:'elastique',free:false,price:18,pack:1,unit:'pièce',control:1.18,description:'Amortissement accru, conservé sur la canne après rupture du bas de ligne.' },
  { id:'kit-reel', name:'Moulinet d’initiation', slot:'reel', methods:['float','bottom','lure'], family:'moulinet_spinning', free:true, price:0, pack:1, unit:'pièce', control:1, description:'Frein automatique et récupération de base.' },
  { id:'smooth-reel', name:'Moulinet au frein souple', slot:'reel', methods:['float','bottom','lure'], family:'moulinet_spinning', free:false, price:55, pack:1, unit:'pièce', control:1.12, description:'Contrôle et récupération améliorés de 12 % ; frein selon le réglage du montage, conservé à la casse.' },
  { id:'kit-line', name:'Nylon d’initiation', slot:'main_line', methods:all, family:'nylon', free:true, price:0, pack:100, unit:'m', strength:1, description:'Bobine gratuite renouvelable ; résistance de jeu 1.' },
  { id:'fine-line', name:'Nylon discret', slot:'main_line', methods:all, family:'nylon', free:false, price:18, pack:100, unit:'m', strength:.82, description:'Plus discret, résistance de jeu 0,82. Seuls les mètres détachés sont perdus.' },
  { id:'strong-line', name:'Nylon renforcé', slot:'main_line', methods:all, family:'nylon', free:false, price:24, pack:100, unit:'m', strength:1.22, description:'Résistance de jeu 1,22 ; présentation moins discrète.' },
  { id:'kit-leader', name:'Bas de ligne d’initiation', slot:'leader', methods:all, family:'bas_nylon', free:true, price:0, pack:10, unit:'m', strength:.9, description:'Segment de 0,6 m. Renouvelable ; protection dentaire limitée.' },
  { id:'fine-leader', name:'Bas de ligne fin', slot:'leader', methods:['pole','float','bottom'], family:'bas_nylon', free:false, price:12, pack:10, unit:'m', strength:.72, description:'Segment de 0,6 m, discret mais plus fragile.' },
  { id:'tooth-leader', name:'Bas de ligne anti-dents', slot:'leader', methods:['lure'], family:'bas_acier', free:false, price:20, pack:10, unit:'m', strength:1.12, description:'Protection de jeu contre les dents ; plus visible.' },
  { id:'kit-float', name:'Flotteur 2 g', slot:'float', methods:['pole','float'], family:'flotteur', free:true, price:0, pack:1, unit:'pièce', capacity:2, integrated:0, description:'Portance nominale 2 g, aucun lest intégré.' },
  { id:'loaded-float', name:'Flotteur préplombé 3 g', slot:'float', methods:['pole','float'], family:'waggler', free:false, price:14, pack:1, unit:'pièce', capacity:3, integrated:2, description:'Portance 3 g, lest intégré 2 g. Réduire la plombée externe.' },
  { id:'kit-shot', name:'Plombée 1,7 g', slot:'weight', methods:['pole','float'], family:'plombs_fendus', free:true, price:0, pack:1, unit:'pièce', mass:1.7, description:'Petits lests : étalés ou groupés.' },
  { id:'light-shot', name:'Plombée 0,7 g', slot:'weight', methods:['pole','float'], family:'plombs_fendus', free:false, price:6, pack:5, unit:'pièce', mass:.7, description:'Adaptée au flotteur préplombé ; descente plus lente.' },
  { id:'heavy-shot', name:'Plombée 3 g', slot:'weight', methods:['pole','float'], family:'plombs_fendus', free:false, price:6, pack:5, unit:'pièce', mass:3, description:'Un excès de masse immerge le flotteur et réduit la lisibilité.' },
  { id:'kit-bottom', name:'Lest de fond 10 g', slot:'weight', methods:['bottom'], family:'plomb_fond', free:true, price:0, pack:1, unit:'pièce', mass:10, description:'Lest de fond, séparé du bas de ligne.' },
  { id:'paid-bottom', name:'Lest de fond 15 g', slot:'weight', methods:['bottom'], family:'plomb_fond', free:false, price:8, pack:3, unit:'pièce', mass:15, description:'Descente directe ; peut être libéré avec une fixation clip.' },
  { id:'kit-fix', name:'Fixation fixe', slot:'attachment', methods:all, family:'fixation', free:true, price:0, pack:1, unit:'pièce', description:'Le composant reste attaché à son segment.' },
  { id:'sliding-fix', name:'Fixation coulissante avec stop', slot:'attachment', methods:['pole','float','bottom'], family:'stop', free:false, price:6, pack:5, unit:'pièce', description:'Le stop retient le composant sur le fil principal après une rupture du bas de ligne.' },
  { id:'open-slide', name:'Fixation coulissante ouverte', slot:'attachment', methods:['bottom'], family:'fixation', free:false, price:6, pack:5, unit:'pièce', description:'Sans stop terminal, le lest peut sortir après rupture du bas de ligne.' },
  { id:'lead-clip', name:'Clip de libération du lest', slot:'attachment', methods:['bottom'], family:'clip_plomb', free:false, price:8, pack:5, unit:'pièce', description:'Une libération détache seulement le lest.' },
  { id:'kit-hook', name:'Hameçon sans ardillon', slot:'hook', methods:['pole','float','bottom'], family:'hamecon', free:true, price:0, pack:1, unit:'pièce', description:'Calibre fin de jeu, pour esches de base.' },
  { id:'wide-hook', name:'Hameçon large', slot:'hook', methods:['pole','float','bottom'], family:'hamecon', free:false, price:8, pack:10, unit:'pièce', description:'Accepte les esches végétales ; petits poissons moins accessibles.' },
  { id:'kit-worm', name:'Ver d’initiation', slot:'bait', methods:['pole','float','bottom'], family:'ver_terre', free:true, price:0, pack:1, unit:'portion', diet:'invertebrates', description:'Une portion par ligne utilisée ; renouvelable gratuitement.' },
  { id:'corn', name:'Maïs', slot:'bait', methods:['pole','float','bottom'], family:'mais', free:false, price:8, pack:15, unit:'portion', diet:'plants', description:'Esche végétale ; candidats filtrés par profil, habitat et profondeur.' },
  { id:'kit-lure', name:'Petit leurre d’initiation', slot:'lure', methods:['lure'], family:'leurre_dur', free:true, price:0, pack:1, unit:'pièce', diet:'fish', mass:5, description:'Armement intégré ; récupération par appui, aucune esche séparée.' },
  { id:'minnow', name:'Poisson nageur 7 g', slot:'lure', methods:['lure'], family:'leurre_dur', free:false, price:22, pack:1, unit:'pièce', diet:'fish', mass:7, description:'Plonge davantage pendant la récupération ; perdu seulement si détaché.' },
];
COMPONENTS.push(...EXTRA_COMPONENTS);
export const component = (id: string) => COMPONENTS.find(c => c.id === id);
export const SLOT_NAMES: Record<Slot,string> = {...EXTRA_SLOT_NAMES, reel:'Moulinet', elastic:'Élastique', main_line:'Fil', leader:'Bas de ligne', float:'Bouchon', weight:'Plombée / lest', attachment:'Fixation', hook:'Hameçon', bait:'Esche', lure:'Leurre et armement' };
export interface RigConfig { method: MethodId; technique?:TechniqueId; recipe?:string; leaderLength?:number; branchCount?:number; drag?:number; components: Partial<Record<Slot,string>>; depth: number; distribution:'spread'|'grouped'|'touch' }
export interface Preset { id:string; name:string; rod:RodId; config:RigConfig;favorite?:boolean }
export interface RigNode { slot:Slot; item:string; parent:Slot|'rod'; quantity:number; attachment:'fixed'|'sliding'|'clip'; retained?:boolean;branch?:number;offset?:number }
export type Outcome = 'return'|'catch'|'unhook'|'leader'|'main_line'|'hook'|'lead_release'|'weight_branch'|'tippet';
export interface ActiveRig { id:string; rod:string; config:RigConfig; nodes:RigNode[]; reserved:Record<string,number>; resolved:boolean; outcome?:Outcome; losses:Record<string,number>;used?:boolean;hookedBranch?:number }
export interface Tackle { unlimitedStock?:boolean; techniqueSetups?:Partial<Record<TechniqueId,{rod:RodId;config:RigConfig}>>; stock:Record<string,number>; config:RigConfig; presets:Preset[]; setups:Partial<Record<MethodId,{rod:RodId;config:RigConfig}>>; active:ActiveRig|null }
export const slotsFor = (method:MethodId,recipe?:string,technique?:TechniqueId):Slot[] => recipe&&recipeById(recipe)?[...new Set([...(method==='pole'?['elastic']:['reel']),...(technique==='nymphe_fil'&&recipe==='nymphe'?['main_line','indicator','leader','tippet','fly']:recipeById(recipe)!.slots),'landing'])] as Slot[] : method === 'pole' ? ['elastic','main_line','float','attachment','weight','leader','hook','bait'] : method === 'lure' ? ['reel','main_line','attachment','leader','lure'] : ['reel','main_line', ...(method === 'float' ? ['float' as Slot] : []),'attachment','weight','leader','hook','bait'];
export function starterConfig(method:MethodId = 'float'):RigConfig {
  return {method,depth:1,distribution:'spread',components:Object.fromEntries(slotsFor(method).map(slot=>[slot,slot === 'weight' && method === 'bottom' ? 'kit-bottom' : COMPONENTS.find(c=>c.free && c.slot===slot && c.methods.includes(method))!.id]))};
}
export const emptyTackle = ():Tackle => ({stock:{},config:starterConfig(),presets:[],setups:{},active:null});
export function techniqueConfig(id:TechniqueId,recipeId=techniqueById(id).defaultRecipe):RigConfig {
  const t=techniqueById(id),r=recipeById(recipeId);
  if(!r?.techniques.includes(id))throw Error('Recette incompatible avec la technique.');
  const c:RigConfig={method:t.base,technique:id,recipe:recipeId,depth:t.engine==='vertical'||t.engine==='clonk'?6:t.engine==='drift'?1.2:1,distribution:recipeId==='plombee_groupee'?'grouped':'spread',leaderLength:id==='bombette'?2.4:recipeId==='method_inline'||recipeId==='method_elastique'?.15:.6,branchCount:id==='gambe'?3:1,drag:.5,components:{}};
  for(const slot of slotsFor(t.base,r.id,id))c.components[slot]=`kit2:${slot}`;
  if(c.components.float)c.components.float='kit-float';
  if(c.components.weight&&['pole','float'].includes(t.base))c.components.weight='kit-shot';
  if(c.components.bait)c.components.bait=t.engine==='surface'?'kit2:bread':id==='mort_manie'?'kit2:deadfish':id==='carpe'||id==='method_feeder'?'kit2:wafter':'kit-worm';
  if(['chod','ronnie'].includes(r.id))c.components.bait='kit2:popup';
  if(r.id==='seche')c.components.fly='kit2:dry-fly';if(r.id==='streamer')c.components.fly='kit2:streamer';
  if(r.id==='pellet_waggler'){c.components.float='kit2:pellet-float';c.components.bait='kit2:wafter';}
  if(r.id==='topwater')c.components.lure='kit2:topwater';
  if(r.id==='bombette_coul')c.components.bombette='kit2:sinking-bombette';
  return c;
}
export const quantityFor=(config:RigConfig,slot:Slot,metres=config.method==='pole'?(config.technique?techniqueById(config.technique).reach:6.4):45)=>['main_line','fly_line','backing'].includes(slot)?metres:slot==='leader'?config.leaderLength??.6:slot==='tippet'?.5:slot==='fly'&&config.technique==='gambe'?config.branchCount??3:1;
export function changeMethod(t:Tackle, method:MethodId) {
  const old=t.config; const next=starterConfig(method); next.depth=old.depth; next.distribution=old.distribution;
  for(const slot of slotsFor(method)) { const item=component(old.components[slot] ?? ''); if(item?.methods.includes(method)) next.components[slot]=item.id; }
  t.config=next;
}
export function available(t:Tackle,id:string) { const c=component(id); if(c?.free || t.unlimitedStock) return Infinity; return Math.max(0,(t.stock[id]??0)-(t.active && !t.active.resolved ? t.active.reserved[id]??0 : 0)); }
export function rigWarnings(config:RigConfig):string[] {
  if(config.recipe&&!config.components.float)return [];
  if(config.method!=='float'&&config.method!=='pole') return [];
  const f=component(config.components.float??'');
  const mass=floatLoad(config);
  return mass>(f?.capacity??0)+.15 ? ['Cette plombée immerge le flotteur. Réduisez les lests.'] : mass<(f?.capacity??0)*.6 ? ['Flotteur peu équilibré : touche moins lisible et esche plus lente.'] : [];
}
export function floatLoad(config:RigConfig){
  const f=component(config.components.float??''),w=component(config.components.weight??'');
  return (w?.mass??0)+(f?.integrated??0)+(config.technique?component(config.components.bait??config.components.fly??'')?.mass??.15:.15);
}
export function validateRig(t:Tackle,config=t.config, metres=config.method==='pole'?6.4:45):string[] {
  const errors:string[]=[];
  if(config.technique&&(!techniqueById(config.technique)||techniqueById(config.technique).base!==config.method||!recipeById(config.recipe??'')?.techniques.includes(config.technique)))errors.push('Technique ou recette incompatible.');
  for(const slot of slotsFor(config.method,config.recipe,config.technique)) {
    const c=component(config.components[slot]??'');
    if(!c || c.slot!==slot || !c.methods.includes(config.method)||config.technique&&c.techniques&&!c.techniques.includes(config.technique)) { errors.push(`${SLOT_NAMES[slot]} absent ou incompatible.`); continue; }
    const quantity=quantityFor(config,slot,config.technique?undefined:metres);
    if(available(t,c.id)+1e-8<quantity) errors.push(`${c.name} : stock insuffisant (${quantity} ${c.unit} requis).`);
  }
  return errors;
}
export function reserveRig(t:Tackle,id:string,rod:string):string[] {
  if(t.active && !t.active.resolved) return ['Une ligne est déjà en service.'];
  const errors=validateRig(t); if(!rodCompatible(rod,t.config.method,t.config.technique)) errors.push('Canne incompatible avec cette pratique.'); if(errors.length) return errors;
  const config=structuredClone(t.config), reserved:Record<string,number>={};
  const mode=['sliding-fix','open-slide'].includes(config.components.attachment??'')?'sliding':config.components.attachment==='lead-clip'?'clip':'fixed';
  const backbone:Slot=config.components.main_line?'main_line':'fly_line';
  const nodes=slotsFor(config.method,config.recipe,config.technique).map((slot):RigNode=>{
    const item=config.components[slot]!, quantity=quantityFor(config,slot);
    if(!component(item)!.free) reserved[item]=(reserved[item]??0)+quantity;
    const parent:RigNode['parent']=['reel','main_line','backing','landing','clonk'].includes(slot)||slot==='elastic'&&config.method==='pole'?'rod':slot==='fly_line'?'backing':slot==='elastic'&&config.components.feeder?'feeder':slot==='tippet'?'leader':slot==='hair'?'hook':slot==='bait'?config.components.hair?'hair':config.components.harness?'harness':config.components.hook?'hook':'leader':slot==='fly'?config.components.tippet?'tippet':'leader':slot==='lure'?config.components.jig_head?'jig_head':config.components.hook?'hook':'leader':['hook','jig_head','harness'].includes(slot)?'leader':slot==='weight'&&['drop_shot','split_shot','tokyo'].includes(config.recipe??'')?'leader':backbone;
    const sliding=['fond_coulissant','cheveu_coulissant','feeder_coulissant','feeder_potence','waggler_coulissant'].includes(config.recipe??'');
    const clip=config.recipe==='carpe_clip'||!!config.components.lead_clip;
    return {slot,item,quantity,parent,attachment:slot==='weight'||slot==='float'||slot==='feeder'?clip?'clip':sliding?'sliding':mode:'fixed',retained:!!config.components.stop||!!config.components.bead||config.components.attachment==='sliding-fix'};
  });
  if(config.technique==='gambe'){const at=nodes.findIndex(n=>n.slot==='fly'),fly=nodes[at];nodes.splice(at,1,...Array.from({length:config.branchCount??3},(_,branch)=>({...fly,quantity:1,branch,offset:branch*.5})));}
  if(config.recipe==='method_elastique'){const leader=nodes.find(n=>n.slot==='leader');if(leader)leader.parent='elastic';}
  t.active={id,rod,config,nodes,reserved,resolved:false,losses:{},...(config.technique?{used:false}:{})}; return [];
}
// Parcours des attaches, y compris branches et sortie d'un élément coulissant.
export function detachedNodes(nodes:RigNode[],outcome:Outcome):RigNode[] {
  const removed=new Set<Slot>();
  if(outcome==='main_line') {removed.add('main_line');removed.add('fly_line');}
  if(outcome==='leader') removed.add('leader');
  if(outcome==='hook') {removed.add('hook');removed.add('harness');removed.add('fly');}
  if(outcome==='weight_branch')removed.add('weight');if(outcome==='tippet')removed.add('tippet');
  if(outcome==='lead_release' && nodes.some(n=>n.slot==='weight'&&n.attachment==='clip')) removed.add('weight');
  for(let changed=true;changed;) { changed=false; for(const n of nodes) if(!removed.has(n.slot) && (removed.has(n.parent as Slot) || outcome==='leader' && n.attachment==='sliding' && !n.retained && n.parent==='main_line')) {removed.add(n.slot);changed=true;} }
  return nodes.filter(n=>removed.has(n.slot));
}
export function resolveRig(t:Tackle,id:string,outcome:Outcome,engagedMetres=10):Record<string,number> {
  const a=t.active; if(!a || a.id!==id || a.resolved) return {};
  const detached=detachedNodes(a.nodes,outcome), losses:Record<string,number>={};
  for(const n of a.nodes) {
    const c=component(n.item)!;
    if(c.free || !(detached.includes(n) || a.used!==false&&c.consumable!==false&&['bait','groundbait','pva'].includes(n.slot))) continue;
    if(outcome==='hook'&&n.slot==='fly'&&n.branch!==undefined&&n.branch!==(a.hookedBranch??0))continue;
    const quantity=['main_line','fly_line'].includes(n.slot)?Math.min(n.quantity,Math.max(0,engagedMetres)):n.quantity;
    losses[n.item]=(losses[n.item]??0)+quantity;
  }
  if(outcome==='weight_branch'&&a.config.recipe==='drop_shot'){const leader=a.nodes.find(n=>n.slot==='leader');if(leader&&!component(leader.item)!.free)losses[leader.item]=(losses[leader.item]??0)+Math.min(.2,leader.quantity);}
  for(const [item,n] of Object.entries(losses)) t.stock[item]=Math.max(0,Math.round(((t.stock[item]??0)-n)*1000)/1000);
  a.resolved=true; a.outcome=outcome; a.losses=losses; return losses;
}
export function buyComponent(t:Tackle,id:string,coins:number,count=1):{error:string;coins:number} {
  const c=component(id); if(!c || c.free || !Number.isSafeInteger(count) || count<1 || count>20) return {error:'Achat invalide.',coins};
  if((t.stock[id]??0)+c.pack*count>100000) return {error:'Stock maximum atteint.',coins};
  const cost=c.price*count; if(coins<cost) return {error:'Solde insuffisant. Le kit gratuit reste disponible.',coins};
  t.stock[id]=(t.stock[id]??0)+c.pack*count; return {error:'',coins:coins-cost};
}
export function applyPreset(t:Tackle,p:Preset):string[] {
  if(!rodCompatible(p.rod,p.config.method,p.config.technique))return ['Canne incompatible avec cet ensemble.'];
  const errors=validateRig(t,p.config); if(errors.length) return errors;
  t.config=structuredClone(p.config); return [];
}
export function rigControl(config:RigConfig):number {
  const line=component(config.components.main_line??config.components.fly_line??'')?.strength??1;
  const leader=component(config.components.leader??'')?.strength??.9;
  const reel=component(config.components[config.method==='pole'?'elastic':'reel']??'')?.control??1;
  const point=config.technique&&config.components.tippet?component(config.components.tippet)?.strength??1:1.3;
  return Math.max(.65,Math.min(1.3,Math.sqrt(Math.min(line,leader,point)/.9)*reel));
}
export function weakestLink(config:RigConfig):'leader'|'main_line'|'tippet' {
  const links=[{slot:'main_line' as const,strength:(component(config.components.main_line??config.components.fly_line??'')?.strength??1)*.95},{slot:'leader' as const,strength:(component(config.components.leader??'')?.strength??.9)*.9},...(config.components.tippet?[{slot:'tippet' as const,strength:component(config.components.tippet)?.strength??.85}]:[])];
  return links.sort((a,b)=>a.strength-b.strength)[0].slot;
}

export function parseTackle(value:unknown):Tackle {
  const obj=(v:unknown):Record<string,unknown>=> {if(!v || typeof v!=='object' || Array.isArray(v)) throw new Error('Matériel invalide.'); return v as Record<string,unknown>;};
  const text=(v:unknown,max=100)=>{if(typeof v!=='string'||!v.length||v.length>max) throw new Error('Référence de matériel invalide.');return v;};
  const number=(v:unknown,min:number,max:number)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new Error('Quantité de matériel invalide.');return v;};
  const config=(v:unknown):RigConfig=>{
    const c=obj(v); if(!['pole','float','bottom','lure'].includes(c.method as string)||!['spread','grouped','touch'].includes(c.distribution as string))throw new Error('Recette invalide.');
    if(c.technique!==undefined&&(!techniqueById(c.technique as TechniqueId)||!recipeById(c.recipe as string)?.techniques.includes(c.technique as string)||techniqueById(c.technique as TechniqueId).base!==c.method))throw Error('Technique invalide.');
    if(c.recipe!==undefined&&(c.technique===undefined||!recipeById(c.recipe as string)))throw Error('Recette inconnue.');
    const method=c.method as MethodId, components:RigConfig['components']={};
    for(const [slot,id] of Object.entries(obj(c.components))) { const item=component(text(id)); if(!slotsFor(method,c.recipe as string|undefined,c.technique as TechniqueId|undefined).includes(slot as Slot)||!item||item.slot!==slot||!item.methods.includes(method)||c.technique&&item.techniques&&!item.techniques.includes(c.technique as string)) throw new Error('Composant incompatible.');components[slot as Slot]=item.id; }
    if(slotsFor(method,c.recipe as string|undefined,c.technique as TechniqueId|undefined).some(slot=>!components[slot])) throw new Error('Montage incomplet.');
    if(c.technique!==undefined&&!Number.isInteger(c.branchCount))throw Error('Nombre de potences invalide.');
    return {method,components,depth:number(c.depth,.2,25),distribution:c.distribution as RigConfig['distribution'],...(c.technique!==undefined?{technique:c.technique as TechniqueId,recipe:text(c.recipe),leaderLength:number(c.leaderLength,.1,3),branchCount:number(c.branchCount,1,3),drag:number(c.drag,.1,.9)}:{})};
  };
  const d=obj(value), t=emptyTackle();t.config=config(d.config);
  for(const [id,n] of Object.entries(obj(d.stock))) {if(!component(id)||component(id)!.free)throw new Error('Stock inconnu.');t.stock[id]=number(n,0,100000);if(component(id)!.unit!=='m'&&!Number.isSafeInteger(t.stock[id]))throw new Error('Quantité indivisible invalide.');}
  if(!Array.isArray(d.presets)||d.presets.length>12)throw new Error('Ensembles invalides.');
  const rod=(v:unknown)=>{if(!ITEMS.some(i=>i.kind==='rod'&&i.id===v))throw new Error('Canne inconnue.');return v as Preset['rod'];};
  t.presets=d.presets.map(v=>{const p=obj(v);return {id:text(p.id),name:text(p.name,40),rod:rod(p.rod),config:config(p.config),...(p.favorite===true?{favorite:true}:{})};});
  if(new Set(t.presets.map(p=>p.id)).size!==t.presets.length)throw new Error('Ensemble dupliqué.');
  if(d.setups!==undefined) for(const [method,v] of Object.entries(obj(d.setups))) { if(!['pole','float','bottom','lure'].includes(method))throw new Error('Pratique inconnue.'); const p=obj(v),c=config(p.config),r=rod(p.rod);if(c.method!==method||!rodCompatible(r,method))throw new Error('Ensemble incompatible.');t.setups[method as MethodId]={rod:r,config:c}; }
  if(d.techniqueSetups!==undefined){t.techniqueSetups={};for(const [id,value] of Object.entries(obj(d.techniqueSetups))){const p=obj(value),c=config(p.config),r=rod(p.rod);if(c.technique!==id||!rodCompatible(r,c.method,c.technique))throw Error('Ensemble de technique incompatible.');t.techniqueSetups[id as TechniqueId]={rod:r,config:c};}}
  if(d.active!==null) {
    const a=obj(d.active); if(typeof a.resolved!=='boolean') throw new Error('Ligne en service invalide.');
    const activeConfig=config(a.config), original=t.config;t.config=activeConfig;
    // Reconstruction du graphe fiable ; aucune attache/quantité importée arbitraire.
    const shadow:Tackle={...t,stock:Object.fromEntries(COMPONENTS.filter(c=>!c.free).map(c=>[c.id,100000])),active:null};
    if(reserveRig(shadow,text(a.id),rod(a.rod)).length)throw new Error('Ligne réservée incompatible.');t.config=original;
    t.active=shadow.active!;t.active.resolved=a.resolved;if(a.used!==undefined){if(typeof a.used!=='boolean')throw Error('État d’utilisation invalide.');t.active.used=a.used;}else t.active.used=true;
    if(a.hookedBranch!==undefined){t.active.hookedBranch=number(a.hookedBranch,0,(activeConfig.branchCount??1)-1);if(!Number.isInteger(t.active.hookedBranch))throw Error('Potence invalide.');}
    if(a.resolved) {
      if(!['return','catch','unhook','leader','main_line','hook','lead_release','weight_branch','tippet'].includes(a.outcome as string))throw new Error('Résolution invalide.');
      t.active.outcome=a.outcome as Outcome;
      for(const [id,n] of Object.entries(obj(a.losses))) {if(!component(id)||component(id)!.free)throw new Error('Perte inconnue.');t.active.losses[id]=number(n,0,45);}
    } else for(const [id,n] of Object.entries(t.active.reserved)) if((t.stock[id]??0)<n)throw new Error('Réservation sans stock.');
  }
  return t;
}
