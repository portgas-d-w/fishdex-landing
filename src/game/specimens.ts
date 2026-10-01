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
};
export function weightFor(id: SpeciesId, length: number) { const [a, b] = WEIGHT_FORMULA[id]; return Math.round(a * length ** b) / 1000; }
export function variantKey(s: Pick<Specimen, 'speciesId' | 'form' | 'coloration' | 'mirage'>) { return `${s.speciesId}:${s.form}:${s.coloration}:${s.mirage ? 'mirage' : 'regular'}`; }
export function uniqueId() { return globalThis.crypto.randomUUID(); }
export const ZERO_REWARD = (): Reward => ({ base: 0, discovery: 0, record: 0, coins: 0, xp: 0 });
