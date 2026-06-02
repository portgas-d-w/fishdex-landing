import * as THREE from 'three';

// ---------------------------------------------------------------------------
// COULOIR DE NAGE (paramétrique : Z monotone + descente Y + dérives douces)
// ---------------------------------------------------------------------------
export const START_Z = 12;   // TUNE — caméra au bord du lac
export const END_Z = -150;   // TUNE — fond de la plongée
const Y_SURFACE = 3.5;       // TUNE — hauteur d’homme au départ
const Y_CRUISE = -1.8;       // TUNE — profondeur de croisière sous l’eau
const DIVE_END_P = 0.12;     // TUNE — la descente Y se termine à ce progress
const READING_DISTANCE = 12; // TUNE — distance plan↔caméra en lecture
const LOOK_AHEAD = 22;       // TUNE — la caméra vise ce nombre d’unités devant

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function cameraY(progress: number): number {
  const s = smoothstep(0, DIVE_END_P, progress);
  return THREE.MathUtils.lerp(Y_SURFACE, Y_CRUISE, s);
}

function solveSurfaceCrossing(): number {
  // Recherche dichotomique du p où cameraY(p) == 0.
  let lo = 0, hi = DIVE_END_P;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (cameraY(mid) > 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// p où la descente Y franchit la surface (y=0).
export const SURFACE_CROSSING_PROGRESS = solveSurfaceCrossing();

// Dérives organiques (faibles) pour la sensation de nage.
function swimX(progress: number): number {
  return Math.sin(progress * Math.PI * 6) * 1.1; // TUNE amplitude
}
function swimYWobble(progress: number): number {
  // Pas d’ondulation tant qu’on plonge ; douce une fois immergé.
  const gate = smoothstep(DIVE_END_P, DIVE_END_P + 0.05, progress);
  return Math.sin(progress * Math.PI * 5 + 1.3) * 0.25 * gate; // TUNE
}

export function cameraPosAt(progress: number): THREE.Vector3 {
  const z = THREE.MathUtils.lerp(START_Z, END_Z, progress); // Z linéaire = vitesse constante
  const y = cameraY(progress) + swimYWobble(progress);
  const x = swimX(progress);
  return new THREE.Vector3(x, y, z);
}

export function cameraLookAt(progress: number): THREE.Vector3 {
  const pos = cameraPosAt(progress);
  // Vise devant (Z plus négatif), avec une légère anticipation latérale.
  return new THREE.Vector3(
    swimX(progress + 0.02) * 0.5,
    pos.y * 0.6,
    pos.z - LOOK_AHEAD
  );
}

// ---------------------------------------------------------------------------
// SECTIONS — 8 arrêts (index 0 = bord du lac ; 1..7 = contenu sous l’eau)
// ---------------------------------------------------------------------------
export interface DiveSection {
  index: number;
  readingProgress: number; // ancre d’aimantation
  sectionZ: number;        // position du volume HTML dans la scène
  distanceFactor: number;  // pour drei <Html transform>
}

// Ancres réparties : départ à 0, fin proche de 1 avec une petite queue.
// Espacement resserré pour un bon rythme narratif (cf. spec : émergence rapide).
const READING_PROGRESSES = [0.0, 0.14, 0.27, 0.40, 0.53, 0.66, 0.79, 0.93]; // TUNE

// drei <Html transform> : taille apparente ∝ distanceFactor / distance.
// La caméra lit à READING_DISTANCE du plan, donc on dimensionne distanceFactor
// en proportion (ratio ≈ ancien 30/100 = 0.3 qui cadrait bien le contenu).
const APPARENT_RATIO = 0.3;      // TUNE — taille globale du contenu des sections
const APPARENT_RATIO_LAST = 0.42; // TUNE — section finale (plus large)

export const SECTIONS: DiveSection[] = READING_PROGRESSES.map((rp, index) => ({
  index,
  readingProgress: rp,
  // Le plan est posé READING_DISTANCE devant la caméra à sa position de lecture.
  sectionZ: cameraPosAt(rp).z - READING_DISTANCE,
  distanceFactor: READING_DISTANCE * (index === 7 ? APPARENT_RATIO_LAST : APPARENT_RATIO),
}));

export const SECTION_ANCHORS = SECTIONS.map((s) => s.readingProgress);
export const TOTAL_SECTIONS = SECTIONS.length;

// ---------------------------------------------------------------------------
// DÉGRADÉ DE PROFONDEUR (keyframes interpolées par progress)
// ---------------------------------------------------------------------------
interface DepthKeyframe {
  p: number;
  fogDensity: number;
  fogColor: string;
  ambientIntensity: number;
  ambientColor: string;
}

const DEPTH_KEYFRAMES: DepthKeyframe[] = [
  { p: 0.0,  fogDensity: 0.0025, fogColor: '#7a8c84', ambientIntensity: 0.5,  ambientColor: '#9fb8c0' }, // brume au-dessus
  { p: 0.12, fogDensity: 0.020,  fogColor: '#16302a', ambientIntensity: 0.35, ambientColor: '#2a4a40' }, // juste sous la surface
  { p: 0.5,  fogDensity: 0.030,  fogColor: '#0d2420', ambientIntensity: 0.28, ambientColor: '#16352a' }, // profondeur moyenne
  { p: 0.8,  fogDensity: 0.040,  fogColor: '#08171c', ambientIntensity: 0.18, ambientColor: '#0a2230' }, // sombre
  { p: 1.0,  fogDensity: 0.050,  fogColor: '#050d12', ambientIntensity: 0.12, ambientColor: '#05121a' }, // abysse
];

export interface DepthGrading {
  fogDensity: number;
  fogColor: THREE.Color;
  ambientIntensity: number;
  ambientColor: THREE.Color;
}

export function sampleDepthGrading(progress: number): DepthGrading {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let a = DEPTH_KEYFRAMES[0];
  let b = DEPTH_KEYFRAMES[DEPTH_KEYFRAMES.length - 1];
  for (let i = 0; i < DEPTH_KEYFRAMES.length - 1; i++) {
    if (p >= DEPTH_KEYFRAMES[i].p && p <= DEPTH_KEYFRAMES[i + 1].p) {
      a = DEPTH_KEYFRAMES[i];
      b = DEPTH_KEYFRAMES[i + 1];
      break;
    }
  }
  const t = a.p === b.p ? 0 : (p - a.p) / (b.p - a.p);
  return {
    fogDensity: THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t),
    fogColor: new THREE.Color(a.fogColor).lerp(new THREE.Color(b.fogColor), t),
    ambientIntensity: THREE.MathUtils.lerp(a.ambientIntensity, b.ambientIntensity, t),
    ambientColor: new THREE.Color(a.ambientColor).lerp(new THREE.Color(b.ambientColor), t),
  };
}
