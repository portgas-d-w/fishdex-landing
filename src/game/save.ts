import { emptyTackle, changeMethod, parseTackle, resolveRig, component } from './rig.ts';
import type { Tackle } from './rig.ts';
import { BADGE_RULES } from './structure.ts';
import { SPECIES } from './catalog.ts';
import type { SpeciesId } from './catalog.ts';
import type { Catch } from './fishing.ts';
import { weightFor, uniqueId, ZERO_REWARD, variantKey } from './specimens.ts';
import type { Specimen } from './specimens.ts';
import { ITEMS, rewardFor, BADGES, levelFor, accessLevel } from './economy.ts';
import type { ItemId } from './economy.ts';

// Même clé : migration atomique sans abandonner l’ancien carnet.
export const SAVE_KEY = 'au-fil-de-leau.save.v1';
export const MAX_SAVE_BYTES = 5_000_000;
export interface RecordEntry { count: number; best: number; last: string }
export interface SaveData {
  version: 4; tackle: Tackle; total: number; records: Partial<Record<SpeciesId, RecordEntry>>;
  legacyRecords: Partial<Record<SpeciesId, RecordEntry>>; journal: Specimen[]; favorites: string[];
  variants: Record<string, RecordEntry>; xp: number; coins: number; badges: string[];
  inventory: ItemId[]; equipped: ItemId;
  aquarium: { floor: 'sand' | 'gravel'; background: 'dawn' | 'night'; plants: boolean; rocks: boolean; light: 'warm' | 'cool' };
  settings: { sound: boolean; quality: 'eco' | 'high'; reelMode: 'hold' };
  preparation: { method: 'float' | 'lure' | 'bottom'; bait: 'worm' | 'lure'; location: 'willow-pond' };
}
export const emptySave = (): SaveData => ({ version: 4, tackle: emptyTackle(), total: 0, records: {}, legacyRecords: {}, journal: [], favorites: [], variants: {}, xp: 0, coins: 0, badges: [], inventory: ['starter'], equipped: 'starter', aquarium: { floor: 'sand', background: 'dawn', plants: false, rocks: false, light: 'warm' }, settings: { sound: false, quality: 'eco', reelMode: 'hold' }, preparation: { method: 'float', bait: 'worm', location: 'willow-pond' } });
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
  if(s.baitItem!==undefined && !['bait','lure'].includes(component(string(s.baitItem))?.slot??''))throw new Error('Esche inconnue.');
  return { ...(s.baitItem!==undefined?{baitItem:string(s.baitItem)}:{}), id: string(s.id), speciesId: species.id, form: choice(s.form, ['common']), coloration: choice(s.coloration, ['natural', 'golden']), mirage: bool(s.mirage), length: s.length, weight: s.weight, date: date(s.date), location: string(s.location), method: choice(s.method, ['float', 'lure', 'bottom']), equipment: choice(s.equipment, ITEMS.filter(i => i.kind === 'rod').map(i => i.id)), bait: choice(s.bait, ['worm', 'lure']), target: { x: target.x, z: target.z }, controlled: bool(s.controlled), reward };
}
export function parseSave(raw: string): SaveData {
  if (raw.length > MAX_SAVE_BYTES) throw new Error('Fichier de sauvegarde trop volumineux.');
  const data = object(JSON.parse(raw)); if (data.version !== 1 && data.version !== 2 && data.version !== 3 && data.version !== 4) throw new Error('Format de sauvegarde non pris en charge.');
  const result = emptySave(); result.records = entries(data.records);
  result.total = Object.values(result.records).reduce((sum, r) => sum + r.count, 0);
  if (result.total !== data.total) throw new Error('Le total de prises est incohérent.');
  const settings = data.settings ? object(data.settings) : {};
  result.settings = { sound: settings.sound === true, quality: settings.quality === 'high' ? 'high' : 'eco', reelMode: 'hold' };
  if (data.version === 3 || data.version === 4) { const p = object(data.preparation); result.preparation = { method: choice(p.method, ['float','lure','bottom']), bait: choice(p.bait, ['worm','lure']), location: choice(p.location, ['willow-pond']) }; if ((result.preparation.method === 'lure') !== (result.preparation.bait === 'lure')) throw new Error('Montage incompatible.'); }
  if (data.version === 1) { result.legacyRecords = structuredClone(result.records); return result; }
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
  if (data.version === 4) result.tackle = parseTackle(data.tackle);
  else changeMethod(result.tackle, result.preparation.method);
  if (result.tackle.config.method !== result.preparation.method) throw new Error('Montage incompatible.');
  if (result.tackle.active && !result.tackle.active.resolved) {
    // Reprise conservatrice : ligne ramenée, aucune prise créée, portion utilisée consommée une fois.
    resolveRig(result.tackle, result.tackle.active.id, 'return');
  }
  return result;
}
export function recordCatch(save: SaveData, caught: Catch): { first: boolean; record: boolean; variant: boolean } {
  if (caught.id && save.journal.some(s => s.id === caught.id)) return { first: false, record: false, variant: false };
  const previous = save.records[caught.speciesId]; const result = { first: !previous, record: !previous || caught.length > previous.best, variant: false };
  const s: Specimen = { ...(caught.baitItem?{baitItem:caught.baitItem}:{}), id: caught.id ?? uniqueId(), speciesId: caught.speciesId, form: 'common', coloration: caught.coloration ?? 'natural', mirage: caught.mirage ?? false, length: caught.length, weight: weightFor(caught.speciesId, caught.length), date: caught.date, location: 'L’étang des Saules', method: caught.method ?? 'float', equipment: caught.equipment ?? save.equipped, bait: caught.bait ?? 'worm', target: caught.target ?? { x: -1.5, z: 7 }, controlled: caught.controlled ?? false, reward: ZERO_REWARD() };
  result.variant = !save.variants[variantKey(s)];
  s.reward = rewardFor(s, result.first, result.record);
  addRecord(save.records, s.speciesId, s); addRecord(save.variants, variantKey(s), s);
  save.journal.push(s); save.total++; save.xp += s.reward.xp; save.coins += s.reward.coins;
  const badges = new Set(save.badges);
  for (const rule of BADGE_RULES) if (rule.value(save) >= rule.target) badges.add(rule.id);
  save.badges = [...badges];
  return result;
}
export function purchase(save: SaveData, id: ItemId): string {
  const item = ITEMS.find(i => i.id === id); if (!item) return 'Article inconnu.';
  if (save.inventory.includes(id)) return 'Déjà dans votre inventaire.';
  if (levelFor(save.xp) < accessLevel(item.id)) return 'Niveau 2 requis.';
  if (save.coins < item.price) return 'Quelques photos de plus pour cet achat.';
  save.coins -= item.price; save.inventory.push(id); return '';
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
