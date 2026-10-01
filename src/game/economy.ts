import { SPECIES } from './catalog.ts';
import type { Specimen, Reward } from './specimens.ts';
export const ITEMS = [
  { id: 'starter', name: 'Canne de bordure', price: 0, kind: 'rod', power: 1, description: 'Réutilisable. Les trois montages de base sont inclus.' },
  { id: 'balanced', name: 'Canne souple', price: 70, kind: 'rod', power: 1.18, description: '18 % de récupération et d’amortissement en plus.' },
  { id: 'precision', name: 'Canne de précision', price: 160, kind: 'rod', power: 1.32, description: '32 % de récupération et d’amortissement en plus.' },
  { id: 'plants', name: 'Bosquet aquatique', price: 35, kind: 'decor', power: 1, description: 'Des plantes dans votre aquarium.' },
  { id: 'rocks', name: 'Rochers de rivière', price: 40, kind: 'decor', power: 1, description: 'Un abri minéral dans votre aquarium.' },
] as const;
export type ItemId = typeof ITEMS[number]['id'];
export const REWARD_BASE = { roach: 12, perch: 15, carp: 22, pike: 25, zander: 20 };
export function rewardFor(s: Specimen, first: boolean, record: boolean): Reward {
  const species = SPECIES.find(f => f.id === s.speciesId)!;
  const size = (s.length - species.min) / (species.max - species.min);
  const base = Math.round(REWARD_BASE[s.speciesId] * (1 + size * 0.6) * (s.mirage ? 1.8 : s.coloration === 'golden' ? 1.15 : 1));
  const discovery = first ? 20 : 0, best = record && !first ? 10 : 0;
  return { base, discovery, record: best, coins: base + discovery + best, xp: 20 + Math.round(size * 15) + (first ? 20 : 0) };
}
export const levelFor = (xp: number) => 1 + Math.floor(Math.sqrt(xp / 80));
export const BADGES = { first: 'Première rencontre', diversity: 'Les cinq de l’étang', contact: 'Main légère : combat contrôlé', lure: 'Au leurre', bottom: 'Au fond', collector: 'Dix souvenirs', record: 'Un nouveau record' };
