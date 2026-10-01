export type SpeciesId = 'roach' | 'perch' | 'carp' | 'pike' | 'zander' | 'bream' | 'tench' | 'rudd' | 'bleak' | 'crucian' | 'whitebream' | 'gudgeon' | 'chub' | 'ide' | 'catfish';
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
  { id: 'bream', name: 'Brème commune', latin: 'Abramis brama', model: 'CommonBream', min: 20, max: 75, strength: 0.95, color: '#b9ac85', description: 'Un corps haut et aplati. Elle explore les fonds calmes en bancs.' },
  { id: 'tench', name: 'Tanche', latin: 'Tinca tinca', model: 'Tench', min: 20, max: 60, strength: 1.10, color: '#9caa68', description: 'Une robe olive et de petites écailles. Elle fréquente la végétation du bord.' },
  { id: 'rudd', name: 'Rotengle', latin: 'Scardinius erythrophthalmus', model: 'Rudd', min: 12, max: 40, strength: 0.72, color: '#c7b98e', description: 'Nageoires rouges et bouche tournée vers la surface. Cherchez près des herbiers.' },
  { id: 'bleak', name: 'Ablette', latin: 'Alburnus alburnus', model: 'Bleak', min: 10, max: 25, strength: 0.55, color: '#c8d8d4', description: 'Petite silhouette argentée, elle anime la surface en bancs.' },
  { id: 'crucian', name: 'Carassin commun', latin: 'Carassius carassius', model: 'CrucianCarp', min: 15, max: 45, strength: 0.82, color: '#c3a176', description: 'Un corps trapu aux reflets bronze, à l’aise dans les eaux lentes.' },
  { id: 'whitebream', name: 'Brème bordelière', latin: 'Blicca bjoerkna', model: 'WhiteBream', min: 15, max: 36, strength: 0.75, color: '#c6c6aa', description: 'Plus petite et argentée que la brème commune, avec de grands yeux.' },
  { id: 'gudgeon', name: 'Goujon', latin: 'Gobio gobio', model: 'Gudgeon', min: 8, max: 20, strength: 0.58, color: '#acb396', description: 'Un petit poisson de fond, reconnaissable à ses barbillons et ses taches.' },
  { id: 'chub', name: 'Chevesne', latin: 'Squalius cephalus', model: 'Chub', min: 20, max: 65, strength: 1.02, color: '#b8c3a4', description: 'Omnivore opportuniste, il suit aussi les petits leurres sous les arbres.' },
  { id: 'ide', name: 'Ide mélanote', latin: 'Leuciscus idus', model: 'Ide', min: 20, max: 60, strength: 0.98, color: '#bbba95', description: 'Un poisson au dos sombre et aux flancs argentés. Il chasse parfois en surface.' },
  { id: 'catfish', name: 'Silure glane', latin: 'Silurus glanis', model: 'WelsCatfish', min: 50, max: 160, strength: 1.48, color: '#919c83', description: 'Sans écailles, avec de longs barbillons. Ses départs lourds demandent une main calme.' },
];
export const SPOTS: readonly { id: SpotId; name: string; hint: string; number: string }[] = [
  { id: 'reeds', name: 'La roselière', hint: 'Bordure peu profonde', number: '01' },
  { id: 'open', name: 'L’eau libre', hint: 'Au-delà des nénuphars', number: '02' },
  { id: 'willow', name: 'Sous le saule', hint: 'Une ombre tranquille', number: '03' },
];
// Pondérations de gameplay, pas des probabilités biologiques.
const WEIGHTS: Record<SpotId, Record<BaitId, number[]>> = {
  reeds: { worm: [6, 4, 1, 0, 0, 2, 4, 5, 4, 3, 2, 3, 2, 1, 1], lure: [0, 6, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1] },
  open: { worm: [3, 2, 3, 0, 0, 6, 1, 2, 4, 2, 4, 2, 2, 2, 2], lure: [0, 2, 0, 3, 5, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2] },
  willow: { worm: [2, 2, 7, 0, 0, 3, 5, 2, 1, 3, 1, 1, 4, 3, 2], lure: [0, 3, 0, 6, 2, 0, 0, 0, 0, 0, 0, 0, 4, 3, 2] },
};
export function pickSpecies(spot: SpotId, bait: BaitId, random: number, method = 'float'): Species {
  const weights = WEIGHTS[spot][bait].map((weight, i) => method === 'bottom' ? weight * (['carp', 'bream', 'tench', 'crucian', 'whitebream', 'catfish', 'gudgeon'].includes(SPECIES[i].id) ? 1.8 : 0.45) : weight);
  let roll = Math.min(0.999999, Math.max(0, random)) * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return SPECIES[i];
  }
  return SPECIES[SPECIES.length - 1];
}
