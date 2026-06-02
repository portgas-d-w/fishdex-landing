import { Effect } from 'postprocessing';
import * as THREE from 'three';

/**
 * ShaderPass custom (Effect postprocessing v6, GLSL3) qui distord l'écran :
 * `mainUv` décale les UV de sampling selon le champ de vélocité du fluide.
 */
const FRAGMENT = /* glsl */ `
uniform sampler2D uMap;
uniform float uStrength;

void mainUv(inout vec2 uv) {
  vec2 disp = texture(uMap, uv).rg;
  uv += disp * uStrength;
}
`;

// Texture de repli 1x1 (vélocité nulle) pour ne jamais sampler un sampler null.
function createFallbackTexture(): THREE.DataTexture {
  const tex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return tex;
}

export class FluidDisplacementEffect extends Effect {
  constructor(strength = 0.03) {
    super('FluidDisplacementEffect', FRAGMENT, {
      uniforms: new Map<string, THREE.Uniform>([
        ['uMap', new THREE.Uniform(createFallbackTexture())],
        ['uStrength', new THREE.Uniform(strength)],
      ]),
    });
  }

  /** Branche la texture de vélocité courante (sortie ping-pong). */
  set map(texture: THREE.Texture | null) {
    const uniform = this.uniforms.get('uMap');
    if (uniform) uniform.value = texture;
  }

  set strength(value: number) {
    const uniform = this.uniforms.get('uStrength');
    if (uniform) uniform.value = value;
  }
}
