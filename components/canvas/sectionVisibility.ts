import * as THREE from 'three';

// Toutes les bornes sont en unités de distance d = cameraZ - sectionZ.
const FOG_REVEAL = 36;   // TUNE — au-delà (devant), invisible dans le fog
const READ_FAR = 16;     // TUNE — début de la zone de lecture nette
const READ_NEAR = 6;     // TUNE — fin de la zone de lecture (avant traversée)
const OCCLUDE_END = -34; // TUNE — totalement réabsorbé par la profondeur
const MAX_BLUR = 14;     // TUNE — flou max (px) à l’émergence
const MAX_SPREAD = 1;    // 0..1 — écartement des couches à la traversée

const clamp01 = (x: number) => THREE.MathUtils.clamp(x, 0, 1);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export interface Visibility {
  opacity: number;    // 0..1
  blur: number;       // px (filtre CSS)
  spread: number;     // 0..1 — écartement parallaxe des couches
  darken: number;     // 0..1 — fondu vers le noir/fog (réabsorption)
  desaturate: number; // 0..1 — perte de saturation (réabsorption)
}

export function sectionVisibility(d: number): Visibility {
  // 1) Loin devant : invisible.
  if (d >= FOG_REVEAL) {
    return { opacity: 0, blur: MAX_BLUR, spread: 0, darken: 0, desaturate: 0 };
  }

  // 2) Émergence : de FOG_REVEAL → READ_FAR, opacité monte, flou se résorbe.
  if (d >= READ_FAR) {
    const t = smooth(FOG_REVEAL, READ_FAR, d); // 0 (loin) → 1 (proche)
    return {
      opacity: t,
      blur: THREE.MathUtils.lerp(MAX_BLUR, 0, t),
      spread: 0,
      darken: 0,
      desaturate: 0,
    };
  }

  // 3) Lecture : nette, opaque, sans écartement.
  if (d >= READ_NEAR) {
    return { opacity: 1, blur: 0, spread: 0, darken: 0, desaturate: 0 };
  }

  // 4) Traversée : de READ_NEAR → 0, les couches s’écartent, léger flou.
  if (d >= 0) {
    const t = smooth(READ_NEAR, 0, d); // 0 (lecture) → 1 (caméra dans le plan)
    return {
      opacity: 1,
      blur: THREE.MathUtils.lerp(0, 4, t),
      spread: t * MAX_SPREAD,
      darken: 0,
      desaturate: 0,
    };
  }

  // 5) Réabsorption (d < 0) : la profondeur avale la section.
  //    D’abord assombrissement/désaturation, puis l’opacité finalise.
  const u = smooth(0, OCCLUDE_END, d); // 0 (vient de passer) → 1 (avalée)
  return {
    opacity: 1 - smooth(0.55, 1, u), // reste ~1 jusqu’à u≈0.55, puis fond
    blur: THREE.MathUtils.lerp(4, MAX_BLUR, u),
    spread: MAX_SPREAD,
    darken: u,
    desaturate: u,
  };
}
