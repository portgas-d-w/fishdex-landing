import { emptySave, loadSave, persistSave, purchase, type SaveData, SAVE_KEY } from './save.ts';
import { COMPONENTS,techniqueConfig } from './rig.ts';
import { ITEMS,type RodId } from './economy.ts';
import { ALL_POSTS as POSTS } from './posts.ts';
import {TECHNIQUE_IDS,techniqueById,type TechniqueId} from './techniques.ts';
import {switchTechnique} from './progression.ts';

export const TEST_SAVE_KEY = 'au-fil-de-leau.test.save.v1';
export const PROFILE_KEY = 'au-fil-de-leau.active-profile';
export interface DevelopmentProfile { kind:'sandbox'|'rules'; unlimitedMoney:boolean; unlimitedStock:boolean; theoreticalCost:number }
export function createTestSave(kind:DevelopmentProfile['kind']='sandbox'):SaveData {
  const save=emptySave();
  save.tackle.config=techniqueConfig('coup');save.progression.techniques=['coup'];save.progression.techniqueMastery={};
  save.development={kind,unlimitedMoney:kind==='sandbox',unlimitedStock:false,theoreticalCost:0};
  if(kind==='sandbox') {
    save.progression.methods=['pole','float','bottom','lure'];
    save.progression.posts=POSTS.filter(p=>p.implemented).map(p=>p.id);
    save.progression.techniques=[...TECHNIQUE_IDS];save.progression.techniqueMastery={};
    save.inventory=ITEMS.filter(i=>i.kind==='rod'&&i.price===0).map(i=>i.id);
  }
  return save;
}
export const wallet=(save:SaveData)=>save.development?.unlimitedMoney?'∞':String(save.coins);
export function refillTestStock(save:SaveData) {
  if(!save.development)return false;
  for(const c of COMPONENTS.filter(c=>!c.free))save.tackle.stock[c.id]=Math.max(save.tackle.stock[c.id]??0,c.pack*3);
  return true;
}
// The adapter only substitutes the active save key; every other storage key is left intact.
export class ProfileStorage {
  active:'normal'|'test'='normal';
  private storage:Storage|undefined;
  readonly enabled:boolean;
  constructor(storage:Storage|undefined,enabled:boolean) {
    this.storage=storage;this.enabled=enabled;
    try{if(enabled&&storage?.getItem(PROFILE_KEY)==='test')this.active='test';}catch{/* normal without storage */}
  }
  getItem(key:string){return this.storage?.getItem(key===SAVE_KEY&&this.active==='test'?TEST_SAVE_KEY:key)??null;}
  setItem(key:string,value:string){if(!this.storage)throw Error('Stockage indisponible.');this.storage.setItem(key===SAVE_KEY&&this.active==='test'?TEST_SAVE_KEY:key,value);}
  load(){const loaded=loadSave(this);if(this.active==='test'&&!this.getItem(SAVE_KEY))loaded.data=createTestSave();if(this.active==='normal'&&loaded.data.development)return {data:emptySave(),warning:'Un carnet de test ne peut pas être utilisé dans la partie normale.',recovery:this.getItem(SAVE_KEY)??undefined};return loaded;}
  switchTo(active:'normal'|'test',current:SaveData){
    if(this.active==='normal'&&current.development)throw Error('Quittez le prêt avant de changer de profil.');
    if(!this.enabled&&active==='test')throw Error('Mode test désactivé dans ce build.');
    if(!persistSave(current,this))throw Error('Exportez votre carnet : impossible de le conserver avant changement de profil.');
    this.storage?.setItem(PROFILE_KEY,active);this.active=active;return this.load().data;
  }
  reset(kind:DevelopmentProfile['kind']){if(this.active!=='test')throw Error('Le profil normal ne peut pas être réinitialisé ici.');const save=createTestSave(kind);if(!persistSave(save,this))throw Error('Sauvegarde de test impossible.');return save;}
  accepts(save:SaveData){return this.active==='test'?!!save.development:!save.development;}
}

/** Achat explicite du kit de scénario, réservé au bac à sable ; aucun prêt normal modifié. */
export function prepareTestKit(save:SaveData,id:TechniqueId,recipe?:string){if(save.development?.kind!=='sandbox')return 'Le kit de scénario exige le bac à sable ; achetez le matériel en règles normales.';const rod=techniqueById(id).rod as RodId;if(!save.inventory.includes(rod)){const error=purchase(save,rod);if(error)return error;}const error=switchTechnique(save,id,recipe);if(!error)save.equipped=rod;return error;}
