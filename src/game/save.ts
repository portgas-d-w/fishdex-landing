import { initialRights, refreshRights, itemCondition, type Rights } from './progression.ts';
import {ALL_POSTS as POSTS} from './posts.ts';
import {TECHNIQUE_IDS,defaultTechnique,recipeById} from './techniques.ts';

import { emptyTackle, changeMethod, parseTackle, resolveRig, component, starterConfig } from './rig.ts';
import type { Tackle } from './rig.ts';
import { BADGE_RULES } from './structure.ts';
import { SPECIES } from './catalog.ts';
import type { SpeciesId } from './catalog.ts';
import type { Catch } from './fishing.ts';
import { weightFor, uniqueId, ZERO_REWARD, variantKey } from './specimens.ts';
import type { Specimen } from './specimens.ts';
import { ITEMS, rewardFor, BADGES, rodCompatible } from './economy.ts';
import type { ItemId } from './economy.ts';

// Même clé : migration atomique sans abandonner l’ancien carnet.
export const SAVE_KEY = 'au-fil-de-leau.save.v1';
export const MAX_SAVE_BYTES = 5_000_000;
export interface RecordEntry { count: number; best: number; last: string }
export interface SaveData {
  version: 6; development?:import('./development.ts').DevelopmentProfile; progression:Rights; tackle: Tackle; total: number; records: Partial<Record<SpeciesId, RecordEntry>>;
  legacyRecords: Partial<Record<SpeciesId, RecordEntry>>; journal: Specimen[]; favorites: string[];
  variants: Record<string, RecordEntry>; xp: number; coins: number; badges: string[];
  inventory: ItemId[]; equipped: ItemId;
  aquarium: { floor: 'sand' | 'gravel'; background: 'dawn' | 'night'; plants: boolean; rocks: boolean; light: 'warm' | 'cool' };
  settings: { sound: boolean; quality: 'eco' | 'high'; reelMode: 'hold'; combatMode:'manual'|'assisted' };
  preparation: { method: 'pole' | 'float' | 'lure' | 'bottom'; bait: 'worm' | 'lure'; location: 'willow-pond'|'running-river'|'deep-lake'|'light-boat'; post:import('./posts.ts').PostId };
}
export const emptySave = (): SaveData => ({ version:6,progression:initialRights(),tackle:{...emptyTackle(),config:starterConfig('pole')},total:0,records:{},legacyRecords:{},journal:[],favorites:[],variants:{},xp:0,coins:0,badges:[],inventory:['starter','pole-starter'],equipped:'pole-starter',aquarium:{floor:'sand',background:'dawn',plants:false,rocks:false,light:'warm'},settings:{sound:false,quality:'eco',reelMode:'hold',combatMode:'manual'},preparation:{method:'pole',bait:'worm',location:'willow-pond',post:'jetty'} });
function object(v: unknown): Record<string, unknown> { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Sauvegarde invalide.'); return v as Record<string, unknown>; }
function integer(v: unknown, max = 1_000_000_000) { if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0 || v > max) throw new Error('Valeur de progression invalide.'); return v; }
function string(v: unknown, max = 150) { if (typeof v !== 'string' || !v.length || v.length > max) throw new Error('Texte de sauvegarde invalide.'); return v; }
function choice<T extends string>(v: unknown, values: readonly T[]): T { if (!values.includes(v as T)) throw new Error('Choix de sauvegarde inconnu.'); return v as T; }
function bool(v: unknown) { if (typeof v !== 'boolean') throw new Error('Option invalide.'); return v; }
function date(v: unknown) { const d = string(v); if (!Number.isFinite(Date.parse(d))) throw new Error('Date invalide.'); return d; }
function entries(value: unknown): SaveData['records'] {
  const records: SaveData['records'] = {};
  for (const [id, v] of Object.entries(object(value))) {
    const species = SPECIES.find(s => s.id === id); if (!species) throw new Error('Espèce inconnue.'); const r = object(v);
    const count = integer(r.count, 10_000_000);
    if (count < 1 || typeof r.best !== 'number' || !Number.isFinite(r.best) || r.best < species.min || r.best > species.max) throw new Error('Une fiche de poisson est invalide.');
    records[species.id] = { count, best: r.best, last: date(r.last) };
  }
  return records;
}
function addRecord(records: Record<string, RecordEntry | undefined>, key: string, s: Pick<Specimen, 'length' | 'date'>) {
  const p = records[key]; records[key] = { count: (p?.count ?? 0) + 1, best: Math.max(p?.best ?? 0, s.length), last: s.date };
}
function specimen(value: unknown): Specimen {
  const s = object(value); const species = SPECIES.find(f => f.id === s.speciesId);
  if (!species || typeof s.length !== 'number' || !Number.isFinite(s.length) || s.length < species.min || s.length > species.max) throw new Error('Spécimen invalide.');
  if (typeof s.weight !== 'number' || !Number.isFinite(s.weight) || Math.abs(s.weight - weightFor(species.id, s.length)) > 0.002) throw new Error('Poids incohérent.');
  const target = object(s.target); if (typeof target.x !== 'number' || typeof target.z !== 'number' || !Number.isFinite(target.x) || !Number.isFinite(target.z) || Math.abs(target.x) > 11 || target.z < 1.5 || target.z > 22) throw new Error('Lieu invalide.');
  const r = object(s.reward);
  const reward = { base: integer(r.base, 10000), discovery: integer(r.discovery, 10000), record: integer(r.record, 10000), coins: integer(r.coins, 30000), xp: integer(r.xp, 10000) };
  if (reward.coins !== reward.base + reward.discovery + reward.record) throw new Error('Récompense incohérente.');
  if(s.baitItem!==undefined && !['bait','lure','fly'].includes(component(string(s.baitItem))?.slot??''))throw new Error('Esche inconnue.');
  if(s.recipe!==undefined&&(!recipeById(string(s.recipe))||s.technique===undefined||!recipeById(string(s.recipe))!.techniques.includes(s.technique as string)))throw Error('Recette de capture invalide.');
  return {...(s.technique!==undefined?{technique:choice(s.technique,TECHNIQUE_IDS)}:{}),...(s.recipe!==undefined?{recipe:string(s.recipe)}:{}), ...(s.baitItem!==undefined?{baitItem:string(s.baitItem)}:{}), ...(s.post!==undefined?{post:choice(s.post,POSTS.map(p=>p.id))}:{}), ...(s.microzone!==undefined?{microzone:choice(s.microzone,['margin','plants','open-water','dropoff','wood'] as const)}:{}), id: string(s.id), speciesId: species.id, form: choice(s.form, ['common']), coloration: choice(s.coloration, ['natural', 'golden']), mirage: bool(s.mirage), length: s.length, weight: s.weight, date: date(s.date), location: string(s.location), method: choice(s.method, ['pole','float', 'lure', 'bottom']), equipment: choice(s.equipment, ITEMS.filter(i => i.kind === 'rod').map(i => i.id)), bait: choice(s.bait, ['worm', 'lure']), target: { x: target.x, z: target.z }, controlled: bool(s.controlled), reward };
}
export function parseSave(raw: string): SaveData {
  if (raw.length > MAX_SAVE_BYTES) throw new Error('Fichier de sauvegarde trop volumineux.');
  const data = object(JSON.parse(raw)); if (data.version !== 1 && data.version !== 2 && data.version !== 3 && data.version !== 4 && data.version !== 5 && data.version !== 6) throw new Error('Format de sauvegarde non pris en charge.');
  const result = emptySave(); result.records = entries(data.records);
  result.total = Object.values(result.records).reduce((sum, r) => sum + r.count, 0);
  if (result.total !== data.total) throw new Error('Le total de prises est incohérent.');
  const settings = data.settings ? object(data.settings) : {};
  if(data.development!==undefined){const d=object(data.development);result.development={kind:choice(d.kind,['sandbox','rules']),unlimitedMoney:bool(d.unlimitedMoney),unlimitedStock:bool(d.unlimitedStock),theoreticalCost:integer(d.theoreticalCost)};}
  result.settings = { sound: settings.sound === true, quality: settings.quality === 'high' ? 'high' : 'eco', reelMode:'hold',combatMode:settings.combatMode==='assisted'?'assisted':'manual' };
  if (data.version === 3 || data.version === 4 || data.version >= 5) { const p = object(data.preparation); result.preparation = { method: choice(p.method, ['pole','float','lure','bottom']), bait: choice(p.bait, ['worm','lure']), location: choice(p.location, ['willow-pond','running-river','deep-lake','light-boat']),post:data.version>=5?choice(p.post,POSTS.map(p=>p.id)):'jetty' }; if ((result.preparation.method === 'lure') !== (result.preparation.bait === 'lure')) throw new Error('Montage incompatible.'); }
  if (data.version === 1) { result.legacyRecords = structuredClone(result.records); migrateRights(result);return result; }
  if (data.version === 2) result.preparation={method:'float',bait:'worm',location:'willow-pond',post:'jetty'};
  result.legacyRecords = entries(data.legacyRecords);
  if (!Array.isArray(data.journal) || data.journal.length > 10000) throw new Error('Journal invalide.');
  result.journal = data.journal.map(specimen);
  const ids = new Set(result.journal.map(s => s.id)); if (ids.size !== result.journal.length) throw new Error('Capture dupliquée.');
  const rebuilt = structuredClone(result.legacyRecords);
  for (const s of result.journal) { addRecord(rebuilt, s.speciesId, s); addRecord(result.variants, variantKey(s), s); }
  for (const id of new Set([...Object.keys(rebuilt), ...Object.keys(result.records)])) {
    const a = rebuilt[id as SpeciesId], b = result.records[id as SpeciesId];
    if (!a || !b || a.count !== b.count || a.best !== b.best || a.last !== b.last) throw new Error('Journal et records incohérents.');
  }
  if (!Array.isArray(data.favorites) || data.favorites.length > 5 || new Set(data.favorites).size !== data.favorites.length || !data.favorites.every(id => typeof id === 'string' && ids.has(id))) throw new Error('Favoris invalides.');
  result.favorites = [...data.favorites]; result.xp = integer(data.xp); result.coins = integer(data.coins);
  if (!Array.isArray(data.badges) || !data.badges.every(b => typeof b === 'string' && Object.hasOwn(BADGES, b)) || new Set(data.badges).size !== data.badges.length) throw new Error('Badges invalides.'); result.badges = [...data.badges];
  if (!Array.isArray(data.inventory) || !data.inventory.includes('starter') || new Set(data.inventory).size !== data.inventory.length) throw new Error('Inventaire invalide.');
  result.inventory = data.inventory.map(i => choice(i, ITEMS.map(v => v.id)));
  result.equipped = choice(data.equipped, ITEMS.filter(i => i.kind === 'rod').map(i => i.id));
  if (!result.inventory.includes(result.equipped)) throw new Error('Matériel non possédé.');
  const aq = object(data.aquarium); result.aquarium = { floor: choice(aq.floor, ['sand', 'gravel']), background: choice(aq.background, ['dawn', 'night']), light: choice(aq.light, ['warm', 'cool']), plants: bool(aq.plants), rocks: bool(aq.rocks) };
  if ((result.aquarium.plants && !result.inventory.includes('plants')) || (result.aquarium.rocks && !result.inventory.includes('rocks'))) throw new Error('Décoration non possédée.');
  if (data.version === 4 || data.version >= 5) result.tackle = parseTackle(data.tackle);
  else changeMethod(result.tackle, result.preparation.method);
  if (result.tackle.config.method !== result.preparation.method || !rodCompatible(result.equipped,result.preparation.method,result.tackle.config.technique)) throw new Error('Montage incompatible.');
  if (result.tackle.active && !result.tackle.active.resolved) {
    // Reprise conservatrice : ligne ramenée, aucune prise créée, portion utilisée consommée une fois.
    resolveRig(result.tackle, result.tackle.active.id, 'return');
  }
  if(data.version<5) migrateRights(result);
  else {
    const p=object(data.progression);
    if(!Array.isArray(p.methods)||!p.methods.every(m=>['pole','float','lure','bottom'].includes(m))||new Set(p.methods).size!==p.methods.length)throw new Error('Droits de pratique invalides.');
    if(!Array.isArray(p.posts)||!p.posts.every(id=>POSTS.some(post=>post.id===id&&post.implemented))||new Set(p.posts).size!==p.posts.length)throw new Error('Droits de poste invalides.');
    const mastery:Rights['mastery']={}; for(const [method,n] of Object.entries(object(p.mastery))) {if(!['pole','float','lure','bottom'].includes(method))throw new Error('Maîtrise inconnue.');mastery[method as keyof typeof mastery]=integer(n,10000000);}
    const techniques=p.techniques===undefined?p.methods.map((m:import('./specimens.ts').MethodId)=>defaultTechnique(m)):p.techniques;
    if(!Array.isArray(techniques)||!techniques.every(id=>TECHNIQUE_IDS.includes(id))||new Set(techniques).size!==techniques.length)throw Error('Droits de technique invalides.');
    const techniqueMastery:Rights['techniqueMastery']={};if(p.techniqueMastery!==undefined)for(const [id,n]of Object.entries(object(p.techniqueMastery))){if(!TECHNIQUE_IDS.includes(id as typeof TECHNIQUE_IDS[number]))throw Error('Maîtrise inconnue.');techniqueMastery[id as typeof TECHNIQUE_IDS[number]]=integer(n,10000000);}
    result.progression={methods:p.methods,posts:p.posts,precision:integer(p.precision,result.total),initiation:bool(p.initiation),legacy:bool(p.legacy),mastery,techniques,techniqueMastery};
    if(!p.methods.includes(result.preparation.method)||!p.posts.includes(result.preparation.post)||result.tackle.config.technique&&!result.development&& !techniques.includes(result.tackle.config.technique))throw new Error('Préparation non ouverte.');
    refreshRights(result);
  }
  if(!result.inventory.includes('pole-starter'))result.inventory.push('pole-starter');
  return result;
}
function migrateRights(save:SaveData) {
  save.progression={...initialRights(),legacy:true,initiation:true,methods:['pole','float','lure','bottom']};
  for(const s of save.journal)save.progression.mastery[s.method]=(save.progression.mastery[s.method]??0)+1;
  if(!save.inventory.includes('pole-starter'))save.inventory.push('pole-starter');
  if(save.preparation.method==='pole') { save.preparation.method='float';save.tackle.config=starterConfig('float');save.equipped='starter'; }
  refreshRights(save);
}
export function recordCatch(save: SaveData, caught: Catch): { first: boolean; record: boolean; variant: boolean } {
  if (caught.id && save.journal.some(s => s.id === caught.id)) return { first: false, record: false, variant: false };
  const previous = save.records[caught.speciesId]; const result = { first: !previous, record: !previous || caught.length > previous.best, variant: false };
  const s: Specimen = { ...(caught.baitItem?{baitItem:caught.baitItem}:{}),...(caught.post?{post:caught.post}:{}),...(caught.microzone?{microzone:caught.microzone}:{}), ...(caught.technique?{technique:caught.technique}:{}),...(caught.recipe?{recipe:caught.recipe}:{}), id: caught.id ?? uniqueId(), speciesId: caught.speciesId, form: 'common', coloration: caught.coloration ?? 'natural', mirage: caught.mirage ?? false, length: caught.length, weight: weightFor(caught.speciesId, caught.length), date: caught.date, location: caught.location??'L’étang des Saules', method: caught.method ?? 'float', equipment: caught.equipment ?? save.equipped, bait: caught.bait ?? 'worm', target: caught.target ?? { x: -1.5, z: 7 }, controlled: caught.controlled ?? false, reward: ZERO_REWARD() };
  result.variant = !save.variants[variantKey(s)];
  s.reward = rewardFor(s, result.first, result.record);
  addRecord(save.records, s.speciesId, s); addRecord(save.variants, variantKey(s), s);
  save.journal.push(s); save.total++; save.xp += s.reward.xp; save.coins += s.reward.coins;
  save.progression.mastery[s.method]=(save.progression.mastery[s.method]??0)+1;
  if(s.technique){save.progression.techniqueMastery??={};save.progression.techniqueMastery[s.technique]=(save.progression.techniqueMastery[s.technique]??0)+1;}
  if(s.method==='pole'&&s.post==='jetty'&&Math.hypot(s.target.x,s.target.z-3.2)<=1.2)save.progression.precision++;
  refreshRights(save);
  const badges = new Set(save.badges);
  for (const rule of BADGE_RULES) if (rule.value(save) >= rule.target) badges.add(rule.id);
  save.badges = [...badges];
  return result;
}
export function purchase(save: SaveData, id: ItemId): string {
  const item = ITEMS.find(i => i.id === id); if (!item) return 'Article inconnu.';
  if (save.inventory.includes(id)) return 'Déjà dans votre inventaire.';
  const access=itemCondition(save,id);if(access)return access;
  if (!save.development?.unlimitedMoney && save.coins < item.price) return 'Quelques photos de plus pour cet achat.';
  if(save.development)save.development.theoreticalCost+=item.price; if(!save.development?.unlimitedMoney)save.coins -= item.price; save.inventory.push(id); return '';
}
export function toggleFavorite(save: SaveData, id: string): string {
  if (!save.journal.some(s => s.id === id)) return 'Capture introuvable.';
  if (save.favorites.includes(id)) { save.favorites = save.favorites.filter(f => f !== id); return ''; }
  if (save.favorites.length >= 5) return 'Cinq favoris maximum. Retirez-en un pour faire une place.';
  save.favorites.push(id); return '';
}
export function loadSave(storage: Pick<Storage, 'getItem'>): { data: SaveData; warning: string; recovery?: string } {
  let raw: string | null = null;
  try { raw = storage.getItem(SAVE_KEY); return { data: raw ? parseSave(raw) : emptySave(), warning: '' }; }
  catch { return { data: emptySave(), warning: 'La sauvegarde locale est inaccessible ou invalide. Un fichier de récupération peut être exporté dans Réglages.', recovery: raw ?? undefined }; }
}
export function persistSave(save: SaveData, storage: Pick<Storage, 'setItem'>): boolean {
  try { storage.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}
