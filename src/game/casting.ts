export interface WaterPoint { x: number; z: number }
export interface CastAim { point: WaterPoint; valid: boolean; reason: string; depth: number; habitat: 'reeds' | 'open' | 'willow' }
export function inspectTarget(point: WaterPoint): CastAim {
  const finite = Number.isFinite(point.x) && Number.isFinite(point.z);
  const distance = Math.hypot(point.x, point.z + 1);
  const water = finite && point.z >= 1.5 && point.z <= 22 && Math.abs(point.x) <= 11;
  const valid = water && distance <= 23;
  return { point, valid, reason: valid ? '' : water ? 'Trop loin : rapprochez la cible.' : 'Visez l’eau devant le ponton.',
    depth: point.z < 7 ? 1.2 : point.z < 13 ? 2.4 : 4,
    habitat: point.z > 12 ? 'open' : point.x > 2 ? 'willow' : 'reeds' };
}
// Les deltas normalisés rendent la sensibilité stable après redimensionnement.
export function aimFromGesture(dx: number, dy: number, width: number, height: number, sensitivity = 1): CastAim {
  const aim = inspectTarget({ x: dx / Math.max(1, width) * 42 * sensitivity, z: -dy / Math.max(1, height) * 65 * sensitivity });
  if (Math.hypot(dx, dy) < 14) return { ...aim, valid: false, reason: 'Glissez vers l’eau pour choisir votre distance.' };
  return aim;
}
