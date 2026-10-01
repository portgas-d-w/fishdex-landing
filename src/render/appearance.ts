import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import type { Specimen } from '../game/specimens';
import type { SpeciesId } from '../game/catalog';
// Une seule correspondance remplaÃ§able, indÃ©pendante de la progression.
export const VISUALS: Record<SpeciesId, { model: string; tailSign: number; swim: 'body-wave' }> = {
  roach: { model: 'Roach', tailSign: 1, swim: 'body-wave' },
  perch: { model: 'EuropeanPerch', tailSign: 1, swim: 'body-wave' },
  carp: { model: 'CommonCarp', tailSign: 1, swim: 'body-wave' },
  pike: { model: 'NorthernPike', tailSign: 1, swim: 'body-wave' },
  zander: { model: 'Zander', tailSign: 1, swim: 'body-wave' },
};
export function applyAppearance(container: AssetContainer, specimen?: Pick<Specimen, 'coloration' | 'mirage'>) {
  for (const material of container.materials) {
    const mat = material as typeof material & { albedoColor?: Color3; emissiveColor?: Color3 };
    if (mat.albedoColor) mat.albedoColor = specimen?.coloration === 'golden' ? new Color3(1, 0.76, 0.34) : Color3.White();
    if (mat.emissiveColor) mat.emissiveColor = specimen?.mirage ? new Color3(0.08, 0.06, 0.13) : Color3.Black();
  }
}
