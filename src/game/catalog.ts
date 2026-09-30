export type SpeciesId = 'roach' | 'perch' | 'carp' | 'pike' | 'zander';
export type SpotId = 'reeds' | 'open' | 'willow';
export type BaitId = 'worm' | 'lure';

export interface Species {
  id: SpeciesId; name: string; latin: string; model: string;
  min: number; max: number; strength: number; color: string; description: string;
}

export const SPECIES: readonly Species[] = [
  { id: 'roach', name: 'Gardon', latin: 'Rutilus rutilus', model: 'Roach', min: 12, max: 38, strength: 0.7, color: '#b4c7bc', description: 'Des reflets argentés, des nageoires rouges. Il aime les bordures calmes.' },
  { id: 'perch', name: 'Perche', latin: 'Perca fluviatilis', model: 'EuropeanPerch', min: 15, max: 45, strength: 0.95, color: '#aec286', description: 'Une robe rayée et des démarrages vifs. La roselière est son terrain de chasse.' },
  { id: 'carp', name: 'Carpe', latin: 'Cyprinus carpio', model: 'CommonCarp', min: 30, max: 90, strength: 1.22, color: '#ddbb78', description: 'Patiente, puissante. Sous le saule, ses départs mettent le fil à l’épreuve.' },
  { id: 'pike', name: 'Brochet', latin: 'Esox lucius', model: 'NorthernPike', min: 40, max: 110, strength: 1.35, color: '#96b594', description: 'Le prédateur de l’étang. Une attaque franche, suivie de brusques accélérations.' },
  { id: 'zander', name: 'Sandre', latin: 'Sander lucioperca', model: 'Zander', min: 30, max: 85, strength: 1.15, color: '#b6becb', description: 'Discret dans l’eau profonde, il surprend par ses coups de tête.' },
];
export const SPOTS: readonly { id: SpotId; name: string; hint: string; number: string }[] = [
  { id: 'reeds', name: 'La roselière', hint: 'Bordure peu profonde', number: '01' },
  { id: 'open', name: 'L’eau libre', hint: 'Au-delà des nénuphars', number: '02' },
  { id: 'willow', name: 'Sous le saule', hint: 'Une ombre tranquille', number: '03' },
];
// Pondérations de gameplay, pas des probabilités biologiques.
const WEIGHTS: Record<SpotId, Record<BaitId, number[]>> = {
  reeds: { worm: [6, 4, 1, 0, 0], lure: [0, 6, 0, 3, 1] },
  open: { worm: [3, 2, 3, 0, 0], lure: [0, 2, 0, 3, 5] },
  willow: { worm: [2, 2, 7, 0, 0], lure: [0, 3, 0, 6, 2] },
};
export function pickSpecies(spot: SpotId, bait: BaitId, random: number): Species {
  const weights = WEIGHTS[spot][bait];
  let roll = Math.min(0.999999, Math.max(0, random)) * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return SPECIES[i];
  }
  return SPECIES[SPECIES.length - 1];
}
