import { useFrame } from '@react-three/fiber';
import { useFluidSimulation } from './useFluidSimulation';
import type { FluidDisplacementEffect } from './FluidDisplacementEffect';

/**
 * Fait tourner la simulation de fluide chaque frame (priorité par défaut 0, donc
 * AVANT le rendu du composer en priorité 1) et branche la texture résultante sur
 * l'Effect de displacement.
 */
export default function FluidLayer({ effect }: { effect: FluidDisplacementEffect }) {
  const sim = useFluidSimulation();

  useFrame((_, delta) => {
    const texture = sim.step(Math.min(delta, 1 / 30));
    effect.map = texture;
  });

  return null;
}
