import { SPECIES } from './catalog.ts';
import type { SpeciesId } from './catalog.ts';
import type { Catch } from './fishing.ts';

export const SAVE_KEY = 'au-fil-de-leau.save.v1';
export interface RecordEntry { count: number; best: number; last: string }
export interface SaveData {
  version: 1; total: number;
  records: Partial<Record<SpeciesId, RecordEntry>>;
  settings: { sound: boolean; quality: 'eco' | 'high' };
}
export const emptySave = (): SaveData => ({ version: 1, total: 0, records: {}, settings: { sound: false, quality: 'eco' } });
export function parseSave(raw: string): SaveData {
  if (raw.length > 100_000) throw new Error('Fichier de sauvegarde trop volumineux.');
  const input: unknown = JSON.parse(raw);
  if (!input || typeof input !== 'object') throw new Error('Sauvegarde invalide.');
  const data = input as Record<string, unknown>;
  if (data.version !== 1 || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) throw new Error('Format de sauvegarde non pris en charge.');
  const result = emptySave();
  for (const [id, value] of Object.entries(data.records)) {
    const species = SPECIES.find(s => s.id === id);
    if (!species || !value || typeof value !== 'object') throw new Error('Espèce inconnue ou fiche invalide.');
    const entry = value as Record<string, unknown>;
    if (typeof entry.count !== 'number' || !Number.isSafeInteger(entry.count) || entry.count < 1 || entry.count > 10_000_000 || typeof entry.best !== 'number' || !Number.isFinite(entry.best) || entry.best < species.min || entry.best > species.max || typeof entry.last !== 'string' || !Number.isFinite(Date.parse(entry.last))) throw new Error('Une fiche de poisson est invalide.');
    result.records[species.id] = { count: entry.count, best: entry.best, last: entry.last };
    result.total += entry.count;
  }
  if (result.total !== data.total) throw new Error('Le total de prises est incohérent.');
  const settings = data.settings as Record<string, unknown> | undefined;
  result.settings.sound = settings?.sound === true;
  result.settings.quality = settings?.quality === 'high' ? 'high' : 'eco';
  return result;
}
export function recordCatch(save: SaveData, caught: Catch): { first: boolean; record: boolean } {
  const previous = save.records[caught.speciesId];
  const result = { first: !previous, record: !previous || caught.length > previous.best };
  save.records[caught.speciesId] = { count: (previous?.count ?? 0) + 1, best: Math.max(previous?.best ?? 0, caught.length), last: caught.date };
  save.total++;
  return result;
}
export function loadSave(storage: Pick<Storage, 'getItem'>): { data: SaveData; warning: string } {
  try {
    const raw = storage.getItem(SAVE_KEY);
    return { data: raw ? parseSave(raw) : emptySave(), warning: '' };
  } catch {
    return { data: emptySave(), warning: 'La sauvegarde locale est inaccessible ou invalide. Exporte ton carnet pour le conserver.' };
  }
}
export function persistSave(save: SaveData, storage: Pick<Storage, 'setItem'>): boolean {
  try { storage.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}
