import type { SpeciesId, BaitId } from './catalog.ts';
export type MethodId = 'float' | 'lure' | 'bottom';
export interface Reward { base: number; discovery: number; record: number; coins: number; xp: number }
export interface Specimen {
  id: string; speciesId: SpeciesId; form: 'common'; coloration: 'natural' | 'golden'; mirage: boolean;
  length: number; weight: number; date: string; location: string; method: MethodId;
  equipment: string; bait: BaitId; target: { x: number; z: number }; controlled: boolean; reward: Reward;
}
export const WEIGHT_FORMULA: Record<SpeciesId, [number, number]> = {
  roach: [0.0196, 2.91], perch: [0.0221, 2.86], carp: [0.0149, 2.99], pike: [0.0084, 3.04], zander: [0.0115, 3.02],
  bream: [0.0180, 2.94], tench: [0.0210, 2.89], rudd: [0.0177, 3], bleak: [0.0082, 3.01], crucian: [0.0251, 3.03], whitebream: [0.0191, 2.99], gudgeon: [0.0082, 3.07], chub: [0.0123, 3], ide: [0.0100, 3.06], catfish: [0.0621, 2.73],
};
export function weightFor(id: SpeciesId, length: number) { const [a, b] = WEIGHT_FORMULA[id]; return Math.round(a * length ** b) / 1000; }
export function variantKey(s: Pick<Specimen, 'speciesId' | 'form' | 'coloration' | 'mirage'>) { return `${s.speciesId}:${s.form}:${s.coloration}:${s.mirage ? 'mirage' : 'regular'}`; }
export function uniqueId() { return globalThis.crypto.randomUUID(); }
export const ZERO_REWARD = (): Reward => ({ base: 0, discovery: 0, record: 0, coins: 0, xp: 0 });
