# Plan d'implémentation — Refonte navigation « Plongée continue »

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer la navigation snap section-par-section de FishDex par une plongée sous-marine continue pilotée par un unique scroll (GSAP ScrollTrigger scrub + aimantation douce), où la caméra nage en avant, traverse physiquement chaque section, et où le contenu dépassé est réabsorbé par la profondeur.

**Architecture :** Un état partagé `diveState` est piloté par une seule instance ScrollTrigger (scrub+snap) sur le scroll natif de la page. Toute la géométrie de l'expérience (courbe caméra, ancres de sections, dégradé de profondeur, paliers de qualité) vit dans un module pur unique `diveConfig.ts`. La visibilité de chaque section (émergence → lecture → traversée → réabsorption) est une fonction pure `sectionVisibility(d)` testée unitairement. Les composants R3F (CameraRig, HtmlSections, Scene, PostProcessing, WaterSurface) ne font que lire ces modules et appliquer le rendu par frame.

**Tech Stack :** Next 16 (App Router, client components), React 19, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing 3, three 0.184 + three-stdlib, gsap 3 (ScrollTrigger), vitest (nouveau, pour les modules purs).

**Référence spec :** `docs/superpowers/specs/2026-06-01-dive-navigation-refonte-design.md`

---

## Structure des fichiers

| Fichier | Responsabilité | Action |
|---|---|---|
| `vitest.config.ts` | Config test pour les modules purs | Créer |
| `components/canvas/diveConfig.ts` | Source de vérité : courbe caméra, sections, dégradé profondeur, paliers qualité + helpers purs | Créer |
| `components/canvas/diveConfig.test.ts` | Tests des helpers de `diveConfig` | Créer |
| `components/canvas/sectionVisibility.ts` | Fonction pure distance→{opacity,blur,spread,darken,desaturate} | Créer |
| `components/canvas/sectionVisibility.test.ts` | Tests de la fonction de visibilité | Créer |
| `components/canvas/qualityTier.ts` | Détection palier de qualité (pure, env injecté) | Créer |
| `components/canvas/qualityTier.test.ts` | Tests de détection | Créer |
| `components/canvas/useScrollProgress.ts` | ScrollTrigger unique scrub+snap, `diveState`, hooks de compat | Réécrire |
| `components/canvas/CameraRig.tsx` | Suit la courbe selon `diveState.progress` + nage + parallaxe | Réécrire |
| `components/canvas/UI/HtmlSections.tsx` | Sections en volumes multi-couches Z, pilotées par `sectionVisibility` | Réécrire |
| `components/canvas/Scene.tsx` | Re-monte WaterSurface, recâble DynamicEnvironment via diveConfig | Modifier |
| `components/canvas/PostProcessing.tsx` | Crossing de surface discret + intensités liées à la profondeur | Modifier |
| `components/canvas/WaterSurface.tsx` | Visible au-dessus de l'eau, teinte au passage | Modifier |
| `components/canvas/Environment/FishingFloat.tsx` | Reliquat du « bite » abandonné | Supprimer |
| `components/canvas/Environment/FishingLine.tsx` | Reliquat du « bite » abandonné | Supprimer |
| `components/Navigation.tsx` | Indicateur de progression dérivé de `diveState` | Modifier |
| `components/Background3D.tsx` | dpr/montage selon palier qualité | Modifier |
| `app/page.tsx` | Spacer de scroll + canvas fixe ; retrait HeroPortal | Modifier |
| `components/HeroPortal.tsx` | Ancien hero CSS | Supprimer |
| `public/images/new/portal.png`, `curtain-left.png`, `curtain-right.png` | Assets HeroPortal inutilisés | Supprimer |

**Convention de vérification** : aucune infra de test n'existe avant ce plan. Les **modules purs** (diveConfig, sectionVisibility, qualityTier) sont développés en TDD avec vitest. Les **composants R3F** (visuels, non testables unitairement de façon utile) sont vérifiés par `npx tsc --noEmit` (typecheck, doit être **silencieux** = succès) puis par une **checklist visuelle manuelle** via `npm run dev`. Baseline actuelle : `npx tsc --noEmit` passe sans erreur.

---

## Task 1: Mise en place de vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)

- [ ] **Step 1: Installer vitest**

Run:
```bash
npm install -D vitest@^2
```
Expected: ajoute `vitest` aux devDependencies, exit 0.

- [ ] **Step 2: Créer la config vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['components/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Ajouter le script de test**

Modify `package.json` scripts (ajouter la ligne `test`):
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
```

- [ ] **Step 4: Vérifier que le runner démarre (aucun test encore)**

Run: `npm test`
Expected: vitest s'exécute et affiche « No test files found » (ou 0 test). Exit 0 ou message d'absence de tests — pas de crash de config.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for pure-logic unit tests"
```

---

## Task 2: Module `diveConfig.ts` — source de vérité (TDD)

**Files:**
- Create: `components/canvas/diveConfig.ts`
- Test: `components/canvas/diveConfig.test.ts`

Ce module ne dépend que de `three` (Vector3, MathUtils, Color). Tous les nombres marqués `// TUNE` sont des constantes de ressenti, ajustables visuellement plus tard sans changer la structure.

- [ ] **Step 1: Écrire les tests**

Create `components/canvas/diveConfig.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  SECTIONS,
  START_Z,
  END_Z,
  SURFACE_CROSSING_PROGRESS,
  cameraPosAt,
  cameraLookAt,
  sampleDepthGrading,
} from './diveConfig';

describe('SECTIONS', () => {
  it('a 8 arrêts (1 bord de lac + 7 sections de contenu)', () => {
    expect(SECTIONS).toHaveLength(8);
  });

  it('a des readingProgress strictement croissants dans [0,1]', () => {
    for (let i = 0; i < SECTIONS.length; i++) {
      expect(SECTIONS[i].readingProgress).toBeGreaterThanOrEqual(0);
      expect(SECTIONS[i].readingProgress).toBeLessThanOrEqual(1);
      if (i > 0) {
        expect(SECTIONS[i].readingProgress).toBeGreaterThan(SECTIONS[i - 1].readingProgress);
      }
    }
  });

  it('place chaque plan de section devant la caméra à sa position de lecture', () => {
    // À la lecture, la caméra (qui regarde vers -Z) doit avoir le plan devant
    // elle, donc sectionZ < cameraZ d'environ READING_DISTANCE.
    for (const s of SECTIONS) {
      const camZ = cameraPosAt(s.readingProgress).z;
      expect(s.sectionZ).toBeLessThan(camZ);
    }
  });
});

describe('cameraPosAt', () => {
  it('part au-dessus de l’eau et descend sous la surface', () => {
    expect(cameraPosAt(0).y).toBeGreaterThan(1); // hauteur d’homme
    expect(cameraPosAt(1).y).toBeLessThan(0);    // immergé
  });

  it('avance de façon monotone en Z (de START_Z vers END_Z)', () => {
    expect(cameraPosAt(0).z).toBeCloseTo(START_Z, 1);
    expect(cameraPosAt(1).z).toBeCloseTo(END_Z, 1);
    let prev = cameraPosAt(0).z;
    for (let p = 0.05; p <= 1.0001; p += 0.05) {
      const z = cameraPosAt(p).z;
      expect(z).toBeLessThan(prev + 1e-6); // jamais en arrière
      prev = z;
    }
  });

  it('traverse y=0 autour de SURFACE_CROSSING_PROGRESS', () => {
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS).y).toBeCloseTo(0, 0);
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS - 0.03).y).toBeGreaterThan(0);
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS + 0.03).y).toBeLessThan(0);
  });
});

describe('cameraLookAt', () => {
  it('regarde vers l’avant (cible plus négative en Z que la caméra)', () => {
    const p = 0.5;
    expect(cameraLookAt(p).z).toBeLessThan(cameraPosAt(p).z);
  });
});

describe('sampleDepthGrading', () => {
  it('épaissit le fog avec la profondeur', () => {
    expect(sampleDepthGrading(1).fogDensity).toBeGreaterThan(sampleDepthGrading(0).fogDensity);
  });

  it('assombrit l’ambiance avec la profondeur', () => {
    expect(sampleDepthGrading(1).ambientIntensity).toBeLessThan(sampleDepthGrading(0).ambientIntensity);
  });

  it('interpole entre keyframes (valeur intermédiaire bornée)', () => {
    const mid = sampleDepthGrading(0.5).fogDensity;
    expect(mid).toBeGreaterThan(sampleDepthGrading(0).fogDensity);
    expect(mid).toBeLessThan(sampleDepthGrading(1).fogDensity);
  });
});
```

- [ ] **Step 2: Lancer les tests (échec attendu)**

Run: `npm test -- diveConfig`
Expected: FAIL — `Cannot find module './diveConfig'`.

- [ ] **Step 3: Implémenter `diveConfig.ts`**

Create `components/canvas/diveConfig.ts`:
```ts
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

// p where the smoothstep-driven Y crosses 0 (résolu numériquement plus bas).
export const SURFACE_CROSSING_PROGRESS = solveSurfaceCrossing();

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

export const SECTIONS: DiveSection[] = READING_PROGRESSES.map((rp, index) => ({
  index,
  readingProgress: rp,
  // Le plan est posé READING_DISTANCE devant la caméra à sa position de lecture.
  sectionZ: cameraPosAt(rp).z - READING_DISTANCE,
  distanceFactor: index === 7 ? 42 : 30, // TUNE — section finale plus large
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
```

- [ ] **Step 4: Lancer les tests (succès attendu)**

Run: `npm test -- diveConfig`
Expected: PASS (tous les tests verts).

- [ ] **Step 5: Commit**

```bash
git add components/canvas/diveConfig.ts components/canvas/diveConfig.test.ts
git commit -m "feat: diveConfig — single source of truth for dive geometry"
```

---

## Task 3: Module `sectionVisibility.ts` — émergence/traversée/réabsorption (TDD)

**Files:**
- Create: `components/canvas/sectionVisibility.ts`
- Test: `components/canvas/sectionVisibility.test.ts`

`d = cameraZ - sectionZ`. À la lecture `d ≈ +READING_DISTANCE` (plan devant). Quand la caméra avance, `d` décroît ; `d=0` = caméra dans le plan (traversée) ; `d<0` = plan derrière (réabsorption).

- [ ] **Step 1: Écrire les tests**

Create `components/canvas/sectionVisibility.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { sectionVisibility } from './sectionVisibility';

describe('sectionVisibility', () => {
  it('invisible quand la section est loin devant dans le fog', () => {
    const v = sectionVisibility(60);
    expect(v.opacity).toBe(0);
  });

  it('émerge progressivement à l’approche (flou qui se résorbe)', () => {
    const v = sectionVisibility(22); // entre FOG_REVEAL et READ_FAR
    expect(v.opacity).toBeGreaterThan(0);
    expect(v.opacity).toBeLessThan(1);
    expect(v.blur).toBeGreaterThan(0);
    expect(v.darken).toBe(0);
  });

  it('est nette et pleinement opaque en zone de lecture', () => {
    const v = sectionVisibility(12); // ~ READING_DISTANCE
    expect(v.opacity).toBeCloseTo(1, 2);
    expect(v.blur).toBeLessThan(1);
    expect(v.darken).toBeCloseTo(0, 2);
    expect(v.spread).toBeCloseTo(0, 2);
  });

  it('écarte les couches à la traversée', () => {
    const reading = sectionVisibility(12).spread;
    const crossing = sectionVisibility(0).spread;
    expect(crossing).toBeGreaterThan(reading);
  });

  it('réabsorbe par la profondeur AVANT de disparaître (occlusion)', () => {
    const v = sectionVisibility(-14); // derrière la caméra, en réabsorption
    expect(v.darken).toBeGreaterThan(0.3);     // assombrie
    expect(v.desaturate).toBeGreaterThan(0.3); // désaturée
    expect(v.opacity).toBeGreaterThan(0);      // pas encore totalement effacée
  });

  it('est totalement réabsorbée en profondeur', () => {
    const v = sectionVisibility(-40);
    expect(v.opacity).toBe(0);
  });

  it('darken et desaturate restent dans [0,1]', () => {
    for (let d = 30; d >= -45; d -= 1) {
      const v = sectionVisibility(d);
      expect(v.darken).toBeGreaterThanOrEqual(0);
      expect(v.darken).toBeLessThanOrEqual(1);
      expect(v.desaturate).toBeGreaterThanOrEqual(0);
      expect(v.desaturate).toBeLessThanOrEqual(1);
      expect(v.opacity).toBeGreaterThanOrEqual(0);
      expect(v.opacity).toBeLessThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Lancer les tests (échec attendu)**

Run: `npm test -- sectionVisibility`
Expected: FAIL — `Cannot find module './sectionVisibility'`.

- [ ] **Step 3: Implémenter `sectionVisibility.ts`**

Create `components/canvas/sectionVisibility.ts`:
```ts
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
```

- [ ] **Step 4: Lancer les tests (succès attendu)**

Run: `npm test -- sectionVisibility`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/canvas/sectionVisibility.ts components/canvas/sectionVisibility.test.ts
git commit -m "feat: sectionVisibility — emergence, traversal, depth reabsorption"
```

---

## Task 4: Module `qualityTier.ts` — paliers de qualité (TDD)

**Files:**
- Create: `components/canvas/qualityTier.ts`
- Test: `components/canvas/qualityTier.test.ts`

- [ ] **Step 1: Écrire les tests**

Create `components/canvas/qualityTier.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { detectQualityTier, QUALITY_TIERS, type DeviceEnv } from './qualityTier';

const base: DeviceEnv = {
  width: 1920, dpr: 2, cores: 8, hasWebGL: true, reducedMotion: false,
};

describe('detectQualityTier', () => {
  it('reduced-motion → fallback DOM', () => {
    expect(detectQualityTier({ ...base, reducedMotion: true })).toBe('dom-fallback');
  });

  it('pas de WebGL → fallback DOM', () => {
    expect(detectQualityTier({ ...base, hasWebGL: false })).toBe('dom-fallback');
  });

  it('desktop puissant → high', () => {
    expect(detectQualityTier(base)).toBe('high');
  });

  it('mobile correct → med', () => {
    expect(detectQualityTier({ ...base, width: 600, dpr: 2, cores: 8 })).toBe('med');
  });

  it('mobile faible → low', () => {
    expect(detectQualityTier({ ...base, width: 600, dpr: 1, cores: 2 })).toBe('low');
  });

  it('chaque palier non-fallback a des paramètres de rendu', () => {
    for (const tier of ['high', 'med', 'low'] as const) {
      const p = QUALITY_TIERS[tier];
      expect(p.dprCap).toBeGreaterThan(0);
      expect(p.particleScale).toBeGreaterThan(0);
      expect(p.waterRes).toBeGreaterThan(0);
      expect(typeof p.postProcessing).toBe('boolean');
    }
  });
});
```

- [ ] **Step 2: Lancer les tests (échec attendu)**

Run: `npm test -- qualityTier`
Expected: FAIL — `Cannot find module './qualityTier'`.

- [ ] **Step 3: Implémenter `qualityTier.ts`**

Create `components/canvas/qualityTier.ts`:
```ts
export type QualityTier = 'high' | 'med' | 'low' | 'dom-fallback';

export interface DeviceEnv {
  width: number;
  dpr: number;
  cores: number;
  hasWebGL: boolean;
  reducedMotion: boolean;
}

export interface TierParams {
  dprCap: number;
  particleScale: number; // multiplicateur sur le nombre de particules
  postProcessing: boolean;
  waterRes: number;      // résolution des render targets de l’eau
}

export const QUALITY_TIERS: Record<Exclude<QualityTier, 'dom-fallback'>, TierParams> = {
  high: { dprCap: 2,   particleScale: 1,   postProcessing: true,  waterRes: 512 },
  med:  { dprCap: 1.5, particleScale: 0.6, postProcessing: true,  waterRes: 256 },
  low:  { dprCap: 1,   particleScale: 0.3, postProcessing: false, waterRes: 256 },
};

export function detectQualityTier(env: DeviceEnv): QualityTier {
  if (env.reducedMotion || !env.hasWebGL) return 'dom-fallback';
  if (env.width <= 768) return env.cores <= 4 ? 'low' : 'med';
  if (env.cores <= 4) return 'med';
  return 'high';
}

// Helper d’exécution navigateur (non testé unitairement).
export function readDeviceEnv(): DeviceEnv {
  const hasWebGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  })();
  return {
    width: window.innerWidth,
    dpr: window.devicePixelRatio || 1,
    cores: navigator.hardwareConcurrency || 4,
    hasWebGL,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}
```

- [ ] **Step 4: Lancer les tests (succès attendu)**

Run: `npm test -- qualityTier`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/canvas/qualityTier.ts components/canvas/qualityTier.test.ts
git commit -m "feat: qualityTier — device-based performance tiers"
```

---

## Task 5: Réécriture de `useScrollProgress.ts` — ScrollTrigger unique scrub+snap

**Files:**
- Modify (réécriture complète): `components/canvas/useScrollProgress.ts`

Le nouveau module : (a) expose `diveState` mutable, (b) garde `useScrollProgress()`/`useScrollVelocity()` (refs `{current}`) pour les composants d’environnement existants, (c) installe **une** instance ScrollTrigger scrub+snap, (d) supprime tout le hijack molette/phases/événements.

- [ ] **Step 1: Réécrire le fichier**

Replace the entire contents of `components/canvas/useScrollProgress.ts` with:
```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION_ANCHORS, START_Z, cameraPosAt } from './diveConfig';

// État partagé, lu chaque frame par les composants R3F.
export const diveState = {
  progress: 0,
  cameraZ: START_Z,
  velocity: 0,
};

// Refs de compatibilité pour les composants d’environnement existants
// (GodRays, Caustics, Fauna, Particles, …) qui lisent `.current`.
const scrollProgress = { current: 0 };
const scrollVelocity = { current: 0 };

export function useScrollProgress() {
  return scrollProgress;
}
export function useScrollVelocity() {
  return scrollVelocity;
}

let initialized = false;

export function initScrollTracking() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // le fallback DOM prend le relais

  let lastProgress = 0;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    scrub: 1, // lissage du scrub (~1s de catch-up) → mouvement cinématographique
    snap: {
      snapTo: SECTION_ANCHORS,
      duration: { min: 0.2, max: 0.6 },
      delay: 0.05,
      ease: 'power2.inOut',
      directional: true,
    },
    onUpdate: (self) => {
      const p = self.progress;
      diveState.progress = p;
      diveState.cameraZ = cameraPosAt(p).z;
      // Vélocité = variation de progress par update, lissée et amplifiée.
      const dv = (p - lastProgress) * 60;
      diveState.velocity = dv;
      lastProgress = p;

      scrollProgress.current = p;
      scrollVelocity.current = dv;
    },
  });

  ScrollTrigger.refresh();
}
```

- [ ] **Step 2: Vérifier le typecheck (échecs attendus chez les consommateurs)**

Run: `npx tsc --noEmit`
Expected: erreurs **attendues** dans les fichiers qui importent encore les exports supprimés (`cinematicState`, `cinematicEvents`, `SECTION_Z_POSITIONS`, `CAMERA_Z_TARGETS`, `TOTAL_SECTIONS`) : `CameraRig.tsx`, `HtmlSections.tsx`, `Scene.tsx`, `PostProcessing.tsx`, `Navigation.tsx`, `FishingFloat.tsx`, `FishingLine.tsx`. Ces fichiers sont corrigés/supprimés dans les Tasks 6–12. **Ne pas commiter tant que `npx tsc --noEmit` n’est pas vert** (à la fin de la Task 12).

- [ ] **Step 3: (pas de commit isolé)**

Ce changement fait partie d’un lot qui ne compile qu’une fois les Tasks 6–12 terminées. On ne commite pas ici ; le commit groupé arrive en Task 12, Step final. Passer directement à la Task 6.

---

## Task 6: Suppression des reliquats du « bite » (FishingFloat / FishingLine)

**Files:**
- Delete: `components/canvas/Environment/FishingFloat.tsx`
- Delete: `components/canvas/Environment/FishingLine.tsx`

Ces composants pilotaient l’ancienne cinématique de morsure (`phase`/`biteProgress`), abandonnée. Ils ne sont plus montés par `Scene.tsx`.

- [ ] **Step 1: Confirmer qu’ils ne sont importés nulle part**

Run: `git grep -n "FishingFloat\|FishingLine" -- "*.tsx" "*.ts"`
Expected: aucune occurrence d’`import … FishingFloat`/`FishingLine` en dehors de ces deux fichiers eux-mêmes. (S’il en existe une, retirer aussi cet import.)

- [ ] **Step 2: Supprimer les fichiers**

```bash
git rm components/canvas/Environment/FishingFloat.tsx components/canvas/Environment/FishingLine.tsx
```

- [ ] **Step 3: Vérifier que ces deux fichiers ne génèrent plus d’erreurs**

Run: `npx tsc --noEmit`
Expected: les erreurs liées à `FishingFloat.tsx`/`FishingLine.tsx` ont disparu (d’autres erreurs des Tasks 7–12 subsistent). Pas de commit isolé (lot Task 12).

---

## Task 7: Mise à jour de `Navigation.tsx` — progression dérivée de `diveState`

**Files:**
- Modify: `components/Navigation.tsx`

L’indicateur ne s’abonne plus à `section_enter`/`section_leave`. Il lit `diveState.progress` en rAF et calcule la section active = ancre la plus proche.

- [ ] **Step 1: Lire le fichier actuel**

Run: `Read components/Navigation.tsx` (prendre connaissance du JSX existant : points de progression + hint).

- [ ] **Step 2: Remplacer l’abonnement aux événements par une boucle rAF**

Dans `components/Navigation.tsx` :

Remplacer l’import :
```ts
import { cinematicEvents, TOTAL_SECTIONS } from './canvas/useScrollProgress';
```
par :
```ts
import { diveState } from './canvas/useScrollProgress';
import { SECTION_ANCHORS, TOTAL_SECTIONS } from './canvas/diveConfig';
```

Remplacer le `useEffect` qui ajoute/retire les listeners `section_enter`/`section_leave` (et lit `cinematicState.activeSection`) par :
```ts
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      // Section active = ancre la plus proche du progress courant.
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < SECTION_ANCHORS.length; i++) {
        const dist = Math.abs(SECTION_ANCHORS[i] - diveState.progress);
        if (dist < best) { best = dist; nearest = i; }
      }
      setActiveIndex((prev) => (prev === nearest ? prev : nearest));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
```

Conserver le reste du composant (le rendu des `TOTAL_SECTIONS` points et le bouton « next » conditionné par `activeIndex < TOTAL_SECTIONS - 1`). Si un handler de clic « next » appelait `navigateToSection`/`cinematicState`, le remplacer par un scroll programmatique :
```ts
    const goNext = () => {
      const next = Math.min(activeIndex + 1, TOTAL_SECTIONS - 1);
      const y = SECTION_ANCHORS[next] * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
```
(et brancher `onClick={goNext}` sur le bouton « next » s’il existe).

- [ ] **Step 3: Vérifier le typecheck de Navigation**

Run: `npx tsc --noEmit`
Expected: plus d’erreur provenant de `Navigation.tsx` (erreurs restantes = Tasks 8–12). Pas de commit isolé.

---

## Task 8: Réécriture de `CameraRig.tsx` — suivi de la courbe

**Files:**
- Modify (réécriture complète): `components/canvas/CameraRig.tsx`

- [ ] **Step 1: Réécrire le fichier**

Replace the entire contents of `components/canvas/CameraRig.tsx` with:
```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from './useScrollProgress';
import { cameraPosAt, cameraLookAt } from './diveConfig';

export default function CameraRig() {
  const smoothVel = useRef(0);
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { progress, velocity } = diveState;
    smoothVel.current = THREE.MathUtils.damp(smoothVel.current, velocity, 3, delta);

    const camera = state.camera;

    // 1) Position cible sur la courbe (le scrub lisse déjà le progress).
    const target = cameraPosAt(progress);
    // Léger damping résiduel pour absorber les micro-saccades de scroll.
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, 8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, 8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 9, delta);

    // 2) Orientation : viser le point d’anticipation + parallaxe souris subtile.
    const look = cameraLookAt(progress);
    const mouseX = state.pointer.x * 2.0; // amplitude douce
    const mouseY = state.pointer.y * 1.2;
    tmpLook.current.set(look.x + mouseX, look.y + mouseY, look.z);

    // Inertie de tangage selon la vélocité de scroll (très légère).
    const inertia = THREE.MathUtils.clamp(smoothVel.current * 0.4, -0.6, 0.6);
    tmpLook.current.y -= inertia;

    // lookAt amorti : on interpole la position courante de visée.
    tmpPos.current.lerp(tmpLook.current, 1 - Math.exp(-6 * delta));
    camera.lookAt(tmpPos.current);
  });

  return null;
}
```

- [ ] **Step 2: Vérifier le typecheck de CameraRig**

Run: `npx tsc --noEmit`
Expected: plus d’erreur provenant de `CameraRig.tsx`. Pas de commit isolé.

---

## Task 9: Réécriture de `HtmlSections.tsx` — volumes multi-couches pilotés par distance

**Files:**
- Modify (réécriture complète): `components/canvas/UI/HtmlSections.tsx`

Chaque section devient un `<group>` à `sectionZ` contenant 3 sous-couches (`label` z=-2.5, `titre` z=0, `contenu` z=+1.5 en unités locales — échelle réduite pour rester dans le champ). La visibilité (opacity/blur/spread/darken/desaturate) est calculée **par frame** via `sectionVisibility(diveState.cameraZ - sectionZ)` et appliquée en style CSS sur le wrapper `<Html>`. Le `darken`/`desaturate` réabsorbent vers la couleur du fog.

> Le contenu rédactionnel des 7 sections (concept, univers, sessions, espèces, galerie, premium, communauté+CTA) est **identique à l’existant** — on réutilise tel quel le JSX déjà présent dans le fichier. Seuls le wrapper et le découpage en couches changent.

- [ ] **Step 1: Réécrire l’ossature du wrapper de section**

Replace the top of `components/canvas/UI/HtmlSections.tsx` (imports + composant `HtmlSection`) with:
```tsx
"use client";

import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Image from 'next/image';
import { Search, Camera, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { diveState } from '../useScrollProgress';
import { SECTIONS, sampleDepthGrading } from '../diveConfig';
import { sectionVisibility } from '../sectionVisibility';

interface LayeredSectionProps {
  index: number; // 0..7 ; correspond à SECTIONS[index]
  children: React.ReactNode;
}

/**
 * Section = volume à plusieurs couches de profondeur, posé à SECTIONS[index].sectionZ.
 * La visibilité est pilotée chaque frame par la distance caméra↔section :
 * émergence → lecture → traversée → réabsorption par la profondeur.
 */
function LayeredSection({ index, children }: LayeredSectionProps) {
  const cfg = SECTIONS[index];
  const wrapperRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const d = diveState.cameraZ - cfg.sectionZ;
    const v = sectionVisibility(d);

    // Réabsorption : on tire vers la couleur du fog courant + on assombrit.
    const fog = sampleDepthGrading(diveState.progress).fogColor;
    const fogRGB = `${Math.round(fog.r * 255)}, ${Math.round(fog.g * 255)}, ${Math.round(fog.b * 255)}`;

    el.style.opacity = String(v.opacity);
    el.style.filter = `blur(${v.blur.toFixed(2)}px) saturate(${(1 - v.desaturate).toFixed(3)}) brightness(${(1 - v.darken * 0.85).toFixed(3)})`;
    // Voile de fog qui « avale » la section en réabsorption.
    el.style.setProperty('--fog-rgb', fogRGB);
    el.style.setProperty('--fog-veil', String(v.darken));
    // Écartement des couches à la traversée (parallaxe via translateZ croissant).
    el.style.setProperty('--layer-spread', String(v.spread));
    el.style.pointerEvents = v.opacity > 0.9 ? 'auto' : 'none';
    el.style.display = v.opacity <= 0.001 ? 'none' : 'block';
  });

  return (
    <group position={[0, 0, cfg.sectionZ]}>
      <Html transform sprite={false} center distanceFactor={cfg.distanceFactor} style={{ width: '100vw', pointerEvents: 'none' }}>
        <div ref={wrapperRef} className="dive-section-wrapper">
          {children}
        </div>
      </Html>
    </group>
  );
}
```

> **Note couches** : la parallaxe « profonde » est obtenue en posant, dans le JSX de chaque section, les sous-blocs avec `style={{ transform: 'translateZ(calc(var(--layer-spread) * -40px))' }}` pour le label (recule), `... * 0px` pour le titre, `... * 25px` pour le contenu (avance). On réutilise les `translateZ` déjà présents dans le JSX existant en les multipliant par `var(--layer-spread)` afin qu’ils ne s’écartent qu’à la traversée. Conserver le contenu interne tel quel sinon.

- [ ] **Step 2: Adapter le composant exporté `HtmlSections`**

Replace the `export default function HtmlSections()` wrapper so each of the 7 content sections is wrapped in `<LayeredSection index={N}>` (N = 1..7), reusing the **existing inner JSX verbatim**. Exemple pour la première (concept, index 1) — reproduire le même schéma pour les indices 2 à 7 avec leur contenu existant :
```tsx
export default function HtmlSections() {
  return (
    <group>
      <LayeredSection index={1}>
        {/* …JSX existant de la section CONCEPT, inchangé… */}
      </LayeredSection>

      <LayeredSection index={2}>
        {/* …JSX existant de la section UNIVERS, inchangé… */}
      </LayeredSection>

      {/* …idem index 3 (SESSIONS), 4 (ESPÈCES), 5 (GALERIE), 6 (PREMIUM), 7 (COMMUNAUTÉ+CTA)… */}
    </group>
  );
}
```
(Index 0 = bord du lac : géré en Task 12 dans `app/page.tsx`, pas ici.)

- [ ] **Step 3: Ajouter le style du voile de fog**

Add to `app/globals.css` (le voile qui matérialise la réabsorption) :
```css
.dive-section-wrapper {
  position: relative;
}
.dive-section-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: rgba(var(--fog-rgb, 5, 13, 18), var(--fog-veil, 0));
  transition: none;
}
```

- [ ] **Step 4: Vérifier le typecheck de HtmlSections**

Run: `npx tsc --noEmit`
Expected: plus d’erreur provenant de `HtmlSections.tsx`. Pas de commit isolé.

---

## Task 10: `Scene.tsx` — re-monter WaterSurface + recâbler DynamicEnvironment

**Files:**
- Modify: `components/canvas/Scene.tsx`

- [ ] **Step 1: Remplacer les imports et `DynamicEnvironment`**

Dans `components/canvas/Scene.tsx` :

Remplacer les imports liés à l’ancien état :
```ts
import { cinematicState } from './useScrollProgress';
import { SECTION_Z_POSITIONS } from './useScrollProgress';
```
par :
```ts
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
```

Remplacer entièrement la fonction `DynamicEnvironment` par une version pilotée par `diveState.progress` :
```tsx
function DynamicEnvironment() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame((state, delta) => {
    const g = sampleDepthGrading(diveState.progress);
    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.damp(fogRef.current.density, g.fogDensity, 4, delta);
      fogRef.current.color.lerp(g.fogColor, 1 - Math.exp(-4 * delta));
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, g.ambientIntensity, 4, delta);
      ambientRef.current.color.lerp(g.ambientColor, 1 - Math.exp(-4 * delta));
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#7a8c84', 0.0025]} />
      <ambientLight ref={ambientRef} intensity={0.5} color="#9fb8c0" />
    </>
  );
}
```

- [ ] **Step 2: Monter `<WaterSurface />` dans la scène**

Dans le `return` de `export default function Scene()`, ajouter `<WaterSurface />` juste avant `<UnderwaterBackground />` :
```tsx
      {/* Surface du lac (visible au-dessus de l’eau) */}
      <WaterSurface />

      {/* 3D Elements */}
      <UnderwaterBackground />
```

- [ ] **Step 3: Vérifier le typecheck de Scene**

Run: `npx tsc --noEmit`
Expected: plus d’erreur provenant de `Scene.tsx`. Pas de commit isolé.

---

## Task 11: `WaterSurface.tsx` + `PostProcessing.tsx` — crossing discret & profondeur

**Files:**
- Modify: `components/canvas/WaterSurface.tsx`
- Modify: `components/canvas/PostProcessing.tsx`

- [ ] **Step 1: WaterSurface — visibilité par hauteur caméra (déjà correcte, on confirme)**

Dans `components/canvas/WaterSurface.tsx`, le `useFrame` masque déjà l’eau quand la caméra plonge (`ref.current.visible = camera.position.y > -2`). Aligner le seuil sur la croisière (`> -1`) et garder l’animation des vagues :
```ts
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta * 0.2;
      ref.current.visible = camera.position.y > -1;
    }
  });
```
Aucun autre changement (l’import depuis `useScrollProgress` n’existe pas ici).

- [ ] **Step 2: PostProcessing — remplacer l’ancien état par diveState + crossing discret**

Replace the entire contents of `components/canvas/PostProcessing.tsx` with:
```tsx
import React, { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from './useScrollProgress';
import { SURFACE_CROSSING_PROGRESS, SECTIONS } from './diveConfig';

export default function PostProcessing() {
  const dofRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);
  const chromaRef = useRef<any>(null);

  useFrame((state, delta) => {
    const { progress } = diveState;
    const camY = state.camera.position.y;

    // 1) DoF : focus sur la section de lecture la plus proche du progress.
    if (dofRef.current && dofRef.current.target) {
      let nearest = SECTIONS[0];
      let best = Infinity;
      for (const s of SECTIONS) {
        const dist = Math.abs(s.readingProgress - progress);
        if (dist < best) { best = dist; nearest = s; }
      }
      dofRef.current.target.set(0, 0, nearest.sectionZ);
    }

    // 2) Profondeur : grain + vignette croissants une fois immergé.
    const submerged = THREE.MathUtils.clamp((1.5 - camY) / 3.0, 0, 1);
    if (noiseRef.current?.blendMode) {
      const tgt = submerged * 0.03;
      noiseRef.current.blendMode.opacity.value = THREE.MathUtils.damp(noiseRef.current.blendMode.opacity.value, tgt, 4, delta);
    }
    if (vignetteRef.current?.uniforms) {
      const d = vignetteRef.current.uniforms.get('darkness');
      if (d) d.value = THREE.MathUtils.damp(d.value, submerged * 1.0, 4, delta);
    }

    // 3) Crossing de surface : réfraction DISCRÈTE et brève.
    //    Petite bosse d’aberration chromatique autour du franchissement,
    //    sinon valeur de repos quasi nulle. Pas d’effet spectaculaire.
    if (chromaRef.current?.offset) {
      const w = 0.04; // largeur de la fenêtre de crossing en progress
      const t = THREE.MathUtils.clamp(1 - Math.abs(progress - SURFACE_CROSSING_PROGRESS) / w, 0, 1);
      const pulse = t * t; // 0 hors fenêtre → 1 au passage
      const amt = 0.0008 + pulse * 0.0018; // repos ~0.0008, pic ~0.0026 (subtil)
      chromaRef.current.offset.set(amt, amt);
    }
  });

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dofRef} target={new THREE.Vector3(0, 0, 0)} focalLength={0.02} bokehScale={2} />
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={1.2} radius={0.8} mipmapBlur />
      <ChromaticAberration ref={chromaRef} offset={new THREE.Vector2(0.0008, 0.0008)} radialModulation={false} modulationOffset={0} />
      <Noise ref={noiseRef} opacity={0} />
      <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
    </EffectComposer>
  );
}
```

- [ ] **Step 3: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: plus d’erreur provenant de `PostProcessing.tsx`/`WaterSurface.tsx`. Pas de commit isolé.

---

## Task 12: `app/page.tsx` — spacer de scroll, retrait HeroPortal, section bord-de-lac

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/HeroPortal.tsx`
- Delete: `public/images/new/portal.png`, `public/images/new/curtain-left.png`, `public/images/new/curtain-right.png`

- [ ] **Step 1: Retirer HeroPortal et ajouter le spacer de scroll**

Dans `app/page.tsx` :

Supprimer l’import :
```ts
import HeroPortal from '../components/HeroPortal'
```

Remplacer le bloc `<HeroPortal> … </HeroPortal>` par un **hero fixe** (bord du lac, lisible au-dessus du canvas) + un **spacer de scroll** qui fabrique la hauteur de défilement. Le hero reste en overlay fixe et se fond quand on commence à plonger :
```tsx
      {/* HERO — bord du lac, overlay fixe par-dessus le canvas */}
      <div id="dive-hero" className="dive-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Bêta ouverte · 2026
        </div>
        <h1 className="hero-title">Complétez votre FishDex.</h1>
        <p className="hero-subtitle">
          Identifiez. Collectionnez. Revivez. L&apos;application qui transforme chaque sortie en expédition.
        </p>
        <div className="hero-ctas">
          <a href="https://app.fishdex.fr" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Rejoindre la bêta
          </a>
          <a href="#explore" className="btn-secondary">Découvrir FishDex</a>
        </div>
        <div className="hero-scroll-hint"><span>Plonger</span><div className="hero-scroll-line" /></div>
      </div>

      {/* SPACER — fabrique la distance de scroll (≈ 8 segments) ; le visuel est le canvas fixe */}
      <div id="dive-scroll" className="dive-scroll-spacer" aria-hidden="true" />
```

- [ ] **Step 2: Faire fondre le hero au début de la plongée**

Ajouter, dans le `useEffect` existant de `app/page.tsx`, une boucle rAF qui estompe `#dive-hero` selon le scroll (le hero disparaît pendant le franchissement de surface) :
```ts
    const hero = document.getElementById('dive-hero')
    let heroRaf = 0
    const fadeHero = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (hero) {
        const o = Math.max(0, 1 - p / 0.10) // disparu à ~10% du scroll
        hero.style.opacity = String(o)
        hero.style.pointerEvents = o < 0.05 ? 'none' : 'auto'
      }
      heroRaf = requestAnimationFrame(fadeHero)
    }
    heroRaf = requestAnimationFrame(fadeHero)
```
et l’ajouter au cleanup : `cancelAnimationFrame(heroRaf)`.

- [ ] **Step 3: Ajouter les styles du hero et du spacer**

Add to `app/globals.css`:
```css
.dive-hero {
  position: fixed;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  padding: 0 24px;
  pointer-events: auto;
  will-change: opacity;
}
.dive-scroll-spacer {
  position: relative;
  width: 100%;
  height: 800vh; /* 8 segments — TUNE selon le ressenti de longueur */
  pointer-events: none;
}
.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.7;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hero-scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
  animation: hero-scroll-pulse 2s ease-in-out infinite;
}
@keyframes hero-scroll-pulse { 0%,100% { opacity: 0.3 } 50% { opacity: 0.9 } }
```

- [ ] **Step 4: Supprimer HeroPortal et ses assets**

```bash
git rm components/HeroPortal.tsx public/images/new/portal.png public/images/new/curtain-left.png public/images/new/curtain-right.png
```
Puis retirer du CSS les règles devenues mortes : dans `app/globals.css`, supprimer tous les sélecteurs `.hero-portal-*` (container, spacer, viewport, layer, sky, frame, curtain-left/right, content, scroll-hint, scroll-line) s’ils existent.

- [ ] **Step 5: Vérifier le typecheck complet (doit être VERT)**

Run: `npx tsc --noEmit`
Expected: **silencieux** (aucune erreur). Toutes les ruptures introduites en Task 5 sont désormais résolues.

- [ ] **Step 6: Commit groupé (Tasks 5–12)**

```bash
git add -A
git commit -m "feat: continuous scrub+snap dive navigation (camera, sections, env, surface, hero)"
```

---

## Task 13: Paliers de qualité — câblage dans `Background3D.tsx`

**Files:**
- Modify: `components/Background3D.tsx`

Monter le canvas dès que le palier n’est pas `dom-fallback` (donc **aussi sur mobile**, en qualité réduite). Plafonner le dpr selon le palier.

- [ ] **Step 1: Décider du montage et du dpr via le palier**

Dans `components/Background3D.tsx` :

Ajouter l’import :
```ts
import { detectQualityTier, readDeviceEnv, QUALITY_TIERS, type QualityTier } from './canvas/qualityTier';
```

Remplacer la logique `reducedMotion` du `useEffect` + l’état `shouldRender` par un état de palier :
```tsx
  const [tier, setTier] = useState<QualityTier | null>(null);

  useEffect(() => {
    const t = detectQualityTier(readDeviceEnv());
    setTier(t);
    if (t !== 'dom-fallback') {
      initScrollTracking();
      ScrollTrigger.refresh();
    }
  }, []);

  // Avant détection : rien (évite un flash). Fallback DOM : dégradé CSS.
  if (tier === null) return null;
  if (tier === 'dom-fallback') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(to bottom, #0d2820 0%, #040a0d 100%)', pointerEvents: 'none' }} />
    );
  }

  const params = QUALITY_TIERS[tier];
```

Et utiliser `params.dprCap` sur le `<Canvas>` :
```tsx
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, params.dprCap) : 1}
```

- [ ] **Step 2: Exposer le palier à la scène (pour particules/post-process/eau)**

Passer le palier en prop à `Scene` :
```tsx
          <Scene tier={tier} />
```
et, dans `components/canvas/Scene.tsx`, accepter la prop (typée) et conditionner le post-process + transmettre l’échelle de particules :
```tsx
import type { QualityTier } from './qualityTier';
import { QUALITY_TIERS } from './qualityTier';

export default function Scene({ tier }: { tier: QualityTier }) {
  const params = tier === 'dom-fallback' ? QUALITY_TIERS.low : QUALITY_TIERS[tier];
  // …
  // Rendre <PostProcessing /> seulement si params.postProcessing :
  {params.postProcessing && <PostProcessing />}
  // …
}
```
(Si `EnvironmentParticles`/`WaterSurface` acceptent des props d’échelle/résolution, leur passer `params.particleScale` / `params.waterRes`. Sinon, laisser tel quel pour cette itération — la réduction du dpr + post-process off suffit au premier jet ; un TODO `// TUNE mobile particle count` peut être laissé dans `Particles.tsx`.)

- [ ] **Step 3: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: silencieux.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: quality tiers — mount lightweight 3D dive on mobile, cap dpr, gate post-processing"
```

---

## Task 14: Vérification d’intégration & build

**Files:** aucun (vérification).

- [ ] **Step 1: Lancer toute la suite de tests purs**

Run: `npm test`
Expected: PASS — diveConfig, sectionVisibility, qualityTier tous verts.

- [ ] **Step 2: Build de production**

Run: `npm run build`
Expected: build Next réussi, sans erreur de type ni d’ESLint bloquante.

- [ ] **Step 3: Vérification visuelle manuelle (desktop)**

Run: `npm run dev` puis ouvrir `http://localhost:3000`. Vérifier la checklist (= critères d’acceptation de la spec) :
- [ ] Le scroll est continu (pas de saut snap brutal) ; à l’arrêt, recalage doux sur une section.
- [ ] Au départ : bord du lac lisible, surface d’eau visible avec reflets.
- [ ] En scrollant : la caméra avance, franchit la surface (réfraction **discrète**), passe sous l’eau sans coupure ; le hero se fond.
- [ ] Une seule section visible à la fois ; chaque section émerge du fog au dernier moment et **assez vite** après la traversée de la précédente (pas de couloir vide).
- [ ] En quittant une section : la caméra **traverse** le contenu (couches qui s’écartent), puis la section est **assombrie/désaturée et avalée par le fog** (pas un simple fondu).
- [ ] Texte parfaitement lisible en position de lecture.
- [ ] Profondeur : l’ambiance s’assombrit et le fog s’épaissit en descendant.

- [ ] **Step 4: Vérification responsive (mobile émulé)**

Dans les DevTools, activer l’émulation mobile (largeur ≤ 768) et recharger :
- [ ] Le canvas 3D se monte quand même (palier `med`/`low`), la plongée fonctionne au toucher (momentum + snap).
- [ ] Activer `prefers-reduced-motion` → le canvas n’est pas monté, le fallback DOM (`MobileExperience`) s’affiche, scroll normal.

- [ ] **Step 5: Commit final (si ajustements de tuning)**

Si des constantes `// TUNE` ont été ajustées pendant la vérification :
```bash
git add -A
git commit -m "tune: dive navigation feel (camera/fog/section spacing)"
```

---

## Self-review (couverture spec)

- **Système de scroll unique / scrub+snap** → Task 5 (ScrollTrigger unique), Task 12 (spacer). Suppression hijack/overflow → Task 5.
- **Courbe caméra + nage + plongée** → Task 2 (diveConfig), Task 8 (CameraRig).
- **Traversée parallaxe profonde** → Task 3 (sectionVisibility.spread), Task 9 (couches translateZ × --layer-spread).
- **Occlusion progressive / réabsorption** → Task 3 (darken/desaturate avant opacity), Task 9 (filter + voile de fog).
- **Rythme narratif (émergence rapide)** → Task 2 (READING_PROGRESSES resserrés, FOG_REVEAL).
- **Surface 3D + réfraction discrète** → Task 10 (WaterSurface monté), Task 11 (crossing chroma subtil).
- **Dégradé de profondeur** → Task 2 (DEPTH_KEYFRAMES), Task 10 (DynamicEnvironment).
- **Mobile / paliers / fallback** → Task 4 (qualityTier), Task 13 (montage + dpr + post-process), Task 14 Step 4.
- **Suppression HeroPortal + assets** → Task 12.
- **Une seule section visible** → Task 2 (espacement Z) + Task 3 (FOG_REVEAL < espacement) ; vérifié Task 14 Step 3.
- **Nettoyage consommateurs (Navigation, bite)** → Task 6, Task 7.

Aucun placeholder de type « TODO/à compléter » non résolu (le seul TODO toléré est `// TUNE mobile particle count` en Task 13 Step 2, optionnel et explicitement borné). Types cohérents : `diveState`, `QualityTier`/`QUALITY_TIERS`, `DiveSection`, `Visibility`, `DepthGrading` utilisés de façon identique entre tasks.
