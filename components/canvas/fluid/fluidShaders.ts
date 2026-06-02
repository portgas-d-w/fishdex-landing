/**
 * GLSL pour la simulation de fluide (champ de vélocité ping-pong) et le pass de
 * displacement. Le vertex et le fragment de simulation sont en GLSL1
 * (ShaderMaterial three). Le fragment de displacement (Effect postprocessing v6)
 * est en GLSL3 et fourni séparément dans FluidDisplacementEffect.ts.
 */

// Quad plein écran : position déjà en clip-space (PlaneGeometry(2,2)).
export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Simulation Navier-Stokes « inspirée » : advection semi-lagrangienne du champ
 * de vélocité par lui-même + dissipation + forçage au curseur (splat gaussien).
 * Pas de projection de pression (volontairement omise : robuste et suffisante
 * pour une distorsion d'écran). La vélocité (rg) sert de displacement.
 */
export const SIM_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D uPrev;
uniform float uDt;
uniform float uDissipation;
uniform vec2 uPointer;
uniform vec2 uPointerVel;
uniform float uRadius;
uniform float uForce;
uniform float uActive;

void main() {
  // Advection : on remonte le champ le long de la vélocité courante.
  vec2 vel = texture2D(uPrev, vUv).xy;
  vec2 coord = vUv - vel * uDt;
  vec2 advected = texture2D(uPrev, coord).xy;

  // Dissipation
  advected *= uDissipation;

  // Forçage curseur : splat gaussien orienté par la vélocité du pointeur.
  vec2 diff = vUv - uPointer;
  float g = exp(-dot(diff, diff) / uRadius) * uActive;
  advected += uPointerVel * uForce * g;

  // Garde-fou anti-emballement.
  advected = clamp(advected, -1.0, 1.0);

  gl_FragColor = vec4(advected, 0.0, 1.0);
}
`;
