# Refonte navigation « Plongée continue » — FishDex

**Date :** 2026-06-01
**Branche :** `feat/landing-mobile-perf-deploy`
**Statut :** Design validé, en attente de plan d'implémentation

## Objectif

Transformer la navigation entre les 7 sections du site FishDex en une expérience de
scroll immersive donnant la sensation physique de plonger dans un lac puis d'explorer
les profondeurs comme un poisson. Premium, fluide, cinématographique. L'utilisateur ne
doit jamais avoir l'impression de faire défiler un site web classique.

## Décisions cadrées (avec l'utilisateur)

| Sujet | Décision |
|---|---|
| Périmètre | Refonte de la **couche navigation** (scroll, caméra, sections), **conservation** de l'environnement 3D (UnderwaterBackground, GodRays, Caustics, Particles, Fauna, PostProcessing), du contenu/assets des sections, et du fallback DOM mobile. |
| Modèle de mouvement | **Scroll continu (scrub) + aimantation douce** (GSAP ScrollTrigger `scrub` + `snap`). Abandon du snap molette section-par-section. |
| Entrée / surface | **Lac 3D réel** (restauration de `WaterSurface`) avec plongée à travers la surface et **réfraction** réelle au passage. |
| Traversée du contenu | **Parallaxe profonde** : sections en volumes multi-couches Z, qui s'écartent et défilent autour de la caméra quand on les transperce. |
| Mobile | **Plongée 3D allégée** via paliers de qualité (`qualityTier`). Fallback DOM plat uniquement si `prefers-reduced-motion` / WebGL absent / device très faible. |

## Problème actuel à résoudre

Le code de la branche contient **deux systèmes de scroll en conflit** :
1. `HeroPortal.tsx` — parallaxe CSS pilotée par le **scroll natif** (via un spacer + `getBoundingClientRect`).
2. `useScrollProgress.ts` — **désactive** le scroll (`document.body.style.overflow = 'hidden'`) et capture molette/touch pour un **snap** discret section-par-section.

Ces deux logiques sont structurellement incompatibles. La refonte les remplace par un
**système de scroll unique**.

## Principe fondateur : timeline de scroll unique

- Le `<Canvas>` reste `position: fixed`, plein écran, en fond.
- Un conteneur de scroll vide (`height: ~800vh`, soit ≈ 8 segments) fabrique la distance de défilement.
- Une **unique** instance `ScrollTrigger` en `scrub` lit la progression `0 → 1` et l'écrit
  dans un état partagé `diveState.progress`.
- **Aimantation douce** : `ScrollTrigger.snap({ snapTo: [ancres], duration: {min:.2,max:.6}, directional:true, ease:'power2.inOut' })`.
- Aucun fondu événementiel (`section_enter`/`section_leave` supprimés), aucune capture de molette, aucun `overflow:hidden`.

Le seul DOM scrollable est le spacer ; tout le visible est le canvas fixe. → satisfait
« jamais une longue page web verticale » et « jamais plusieurs sections simultanées ».

## Architecture des modules

### `components/canvas/diveConfig.ts` (nouveau) — source de vérité

- `CAMERA_CURVE`: `THREE.CatmullRomCurve3` décrivant le couloir de nage : départ
  hauteur d'homme (`y≈3.5`, légère inclinaison vers l'eau), descente sous `y=0`
  (plongée), puis avance majoritairement en Z avec dérives douces gauche/droite/haut/bas.
- `SECTIONS`: tableau de 7 entrées `{ id, readingProgress, sectionZ, distanceFactor }`.
  `readingProgress` = valeur `0..1` où la caméra est pile en lecture face à la section
  (= ancres d'aimantation). `sectionZ` = position du volume dans la scène.
- **Rythme narratif** : l'espacement Z et la distance de visibilité du fog sont calibrés
  pour que la section suivante **émerge relativement vite** après la traversée de la
  précédente, afin d'éviter tout « couloir vide » et de garder un bon rythme. La fenêtre
  noire entre deux sections doit rester brève (juste assez pour réabsorber la section
  traversée — voir occlusion ci-dessous), pas un long tunnel sans contenu.
- `SURFACE_CROSSING_PROGRESS`: valeur `0..1` du franchissement de la surface.
- `DEPTH_KEYFRAMES`: keyframes `{ progress, fogDensity, fogColor, ambientIntensity, ambientColor }`
  pour le dégradé de profondeur.
- `QUALITY_TIERS`: paramètres par palier (voir section Mobile/perf).

### `components/canvas/useScrollProgress.ts` (réécrit)

- `initScrollTracking()` : enregistre `ScrollTrigger`, crée l'instance unique
  scrub+snap sur le conteneur de scroll, met à jour `diveState` à chaque tick
  (`progress`, `cameraZ` dérivé de la courbe, `velocity`).
- Expose `diveState` (objet mutable partagé) + hooks de lecture.
- `prefers-reduced-motion` → ne lance rien (le fallback DOM prend le relais).
- Supprime : machine à phases SURFACE/BITING/DIVING, hijack molette/touch, `overflow:hidden`,
  événements `section_enter`/`section_leave`, `navigateToSection`, `CAMERA_Z_TARGETS`.

### `components/canvas/CameraRig.tsx` (réécrit)

- Lit `diveState.progress`, échantillonne `CAMERA_CURVE.getPointAt(progress)` →
  position cible ; oriente la caméra le long de la tangente.
- Ajoute : ondulation sinusoïdale très faible (respiration/nage), rotation inertielle
  selon `diveState.velocity`, parallaxe souris subtile (déjà présente).
- Damping pour lisser, sans double-easing (le scrub est déjà lissé).

### `components/canvas/UI/HtmlSections.tsx` (réécrit)

- Chaque section = `<group position={[0,0,sectionZ]}>` contenant des **sous-couches**
  à offsets 3D réels (`label z=-25`, `titre z=0`, `contenu z=+15`).
- Rendu **piloté par la distance** `d = cameraZ − sectionZ`, recalculé chaque frame :
  - loin → opacité 0, noyé dans le fog ;
  - approche → fondu 0→1 + flou qui se résorbe ;
  - `d ≈ 0` → net, centré, lisible ;
  - `d > 0` (traversée) → couches s'écartent / défilent autour de la caméra à vitesses
    différentes + flou.
- **Occlusion progressive (réabsorption par la profondeur)** : une section traversée
  ne disparaît pas par simple fondu d'opacité. À mesure qu'elle s'éloigne derrière la
  caméra, ses couleurs sont **tirées vers la couleur du fog** et **assombries** (desaturation
  + perte de luminosité), puis noyées dans la densité du fog/obscurité sous-marine, comme
  réabsorbées par la profondeur. L'opacité ne fait que finaliser ce qui est déjà avalé
  par l'eau, jamais l'inverse.
- Espacement `sectionZ` choisi > distance de visibilité du fog → une seule section visible.
- Contenu HTML riche **conservé** (grilles, cartes prix, timeline) via `<Html transform>`.

### `components/canvas/Scene.tsx` (modifié)

- Re-monte `<WaterSurface />`.
- `DynamicEnvironment` recâblé pour interpoler le fog/ambiance/lumières depuis
  `diveState.progress` (via `DEPTH_KEYFRAMES`) au lieu des phases.

### `components/canvas/WaterSurface.tsx` + `PostProcessing.tsx` (modifiés)

- `WaterSurface` : visible quand `camera.y > −1` ; teinte sous-marine au passage.
- `PostProcessing` : franchissement de surface **discret et crédible** — une réfraction
  /ondulation brève et subtile au passage de `y=0` (pas d'effet spectaculaire : ni gros
  coup de FOV, ni voile de gouttelettes appuyé). Légère aberration chromatique tolérée si
  elle reste imperceptible consciemment. L'objectif est le réalisme du passage sous l'eau,
  pas la démonstration. Intensités des effets liées à la profondeur.

### `app/page.tsx` (modifié)

- Retrait de `HeroPortal`. Le hero (section 1, bord du lac) devient la première
  section de l'expérience.
- Ajout du conteneur de scroll (spacer `~800vh`) ; le `<Canvas>` (via `Background3D`)
  reste fixe.

### `components/qualityTier.ts` (nouveau)

- Détection du palier : `high | med | low | dom-fallback` selon largeur écran,
  `devicePixelRatio`, `navigator.hardwareConcurrency`, présence WebGL,
  `prefers-reduced-motion`.

## Mobile & performance

| Palier | Cible | Réglages |
|---|---|---|
| **high** | Desktop | post-process complet, particules pleines, eau 512, dpr≤2 |
| **med** | Mobile correct | post-process allégé, particules réduites, eau 256, dpr≤1.5 |
| **low** | Mobile faible | post-process off, particules minimales, eau 256, dpr≤1 |
| **dom-fallback** | reduced-motion / WebGL absent / très faible | `MobileExperience.tsx` (DOM plat scrollable) |

- Le scroll natif + `ScrollTrigger.snap` exploite le momentum tactile mobile.
- Réduction **dynamique** des particules possible selon le FPS mesuré.
- La courbe de caméra et les ancres sont identiques sur tous les paliers (même
  narration) ; seuls les coûts de rendu changent.

## Critères d'acceptation

1. Un seul système de scroll ; plus aucun `overflow:hidden` ni capture molette.
2. La caméra avance en continu proportionnellement au scroll ; à l'arrêt, recalage doux
   sur la section la plus proche.
3. Entrée : bord du lac lisible → avancée → franchissement de surface avec réfraction
   **discrète et crédible** → sous l'eau, sans coupure visible.
4. À aucun moment deux sections ne sont simultanément visibles ; chaque section émerge
   du fog au dernier moment, et **émerge relativement vite** après la traversée de la
   précédente (pas de couloir vide prolongé).
5. En quittant une section, la caméra **traverse** son contenu (couches qui défilent
   autour) ; la section traversée est ensuite **progressivement réabsorbée par la
   profondeur** (tirée vers la couleur du fog + assombrie), pas un simple fondu d'opacité,
   avant que la suivante n'émerge.
6. Texte toujours parfaitement lisible en position de lecture.
7. Mouvement lent, cinématographique, sans à-coups.
8. Fonctionne desktop + mobile (iPhone/Android) ; cible 60 fps ; fallback DOM si
   reduced-motion/WebGL absent.

## Hors périmètre

- Refonte du contenu rédactionnel des sections (on réutilise tel quel).
- Refonte graphique des assets (réutilisation des images existantes).
- Nouveaux effets de faune/flore au-delà de l'existant.
