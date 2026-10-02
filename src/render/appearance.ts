import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import type { Specimen } from '../game/specimens';
import type { SpeciesId } from '../game/catalog';
import {SPECIES} from '../game/catalog';
// Une seule correspondance remplaÃ§able, indÃ©pendante de la progression.
export const VISUALS: Record<SpeciesId, { model: string; tailSign: number; swim: 'body-wave' }> = {
  ...Object.fromEntries(SPECIES.map(s=>[s.id,{model:s.model,tailSign:1,swim:'body-wave' as const}])),
  roach: { model: 'Roach', tailSign: 1, swim: 'body-wave' },
  perch: { model: 'EuropeanPerch', tailSign: 1, swim: 'body-wave' },
  carp: { model: 'CommonCarp', tailSign: 1, swim: 'body-wave' },
  pike: { model: 'NorthernPike', tailSign: 1, swim: 'body-wave' },
  zander: { model: 'Zander', tailSign: 1, swim: 'body-wave' },
  bream: { model: 'CommonBream', tailSign: 1, swim: 'body-wave' },
  tench: { model: 'Tench', tailSign: 1, swim: 'body-wave' },
  rudd: { model: 'Rudd', tailSign: 1, swim: 'body-wave' },
  bleak: { model: 'Bleak', tailSign: 1, swim: 'body-wave' },
  crucian: { model: 'CrucianCarp', tailSign: 1, swim: 'body-wave' },
  whitebream: { model: 'WhiteBream', tailSign: 1, swim: 'body-wave' },
  gudgeon: { model: 'Gudgeon', tailSign: 1, swim: 'body-wave' },
  chub: { model: 'Chub', tailSign: 1, swim: 'body-wave' },
  ide: { model: 'Ide', tailSign: 1, swim: 'body-wave' },
  catfish: { model: 'WelsCatfish', tailSign: 1, swim: 'body-wave' },
};
export function applyAppearance(container: AssetContainer, specimen?: Pick<Specimen, 'coloration' | 'mirage'|'appearanceId'>) {
  const app=specimen?.appearanceId??'',albino=app.includes('albinos'),gold=app.includes('gold')||app.includes('dore')||app.includes('jaune')||app.includes('ogon')||specimen?.coloration==='golden';
  for (const material of container.materials) {
    const mat = material as typeof material & { albedoColor?: Color3; emissiveColor?: Color3; metallic?: number; roughness?: number };
    if (mat.metallic !== undefined) mat.metallic = 0;
    if (mat.roughness !== undefined) mat.roughness = .72;
    if (mat.albedoColor) mat.albedoColor = specimen?.coloration === 'golden' ? new Color3(1, 0.76, 0.34) : Color3.White();
    if(mat.albedoColor&&gold)mat.albedoColor=new Color3(1,.8,.42);
    if(albino){const p=material as typeof material&{albedoTexture?:unknown;diffuseTexture?:unknown;diffuseColor?:Color3};if('albedoTexture' in p)p.albedoTexture=null;if('diffuseTexture' in p)p.diffuseTexture=null;if(mat.albedoColor)mat.albedoColor=new Color3(.94,.88,.8);if(p.diffuseColor)p.diffuseColor=new Color3(.94,.88,.8);}
    if (mat.emissiveColor) mat.emissiveColor = specimen?.mirage ? new Color3(0.08, 0.06, 0.13) : Color3.Black();
  }
}
