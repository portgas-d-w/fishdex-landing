# Performances — chantier visuel première carte (lot 5)

Instrument : `production_3d/environment/tools/capture-ingame.mjs` (Playwright, 3 s par poste après 2,5 s de stabilisation, simulation en pause, interface masquée). Navigateur : Chromium sous Windows avec **SwiftShader (rendu logiciel CPU)**, DPR 1. Ce n’est **ni un GPU mobile ni un iPhone** : les chiffres servent à comparer avant/après dans des conditions identiques, pas à promettre une cadence sur appareil. Le profil éco plafonne le rendu à 30 images/s.

## Profil mobile par défaut (390×844, qualité éco, eau « low » sans reflet planaire)

| Poste | FPS avant | FPS après | Triangles visibles avant → après | Appels de dessin avant → après | p95 image avant → après (ms) |
| --- | --- | --- | --- | --- | --- |
| jetty | 30.0 | 29.5 | 18.7 k → 36.0 k | 44 → 21 | 54 → 56 |
| cove | 30.0 | 30.1 | 23.5 k → 39.2 k | 63 → 23 | 34 → 51 |
| bank | 30.3 | 30.3 | 17.2 k → 38.8 k | 51 → 19 | 34 → 37 |
| reed-bank | 30.3 | 29.7 | 24.5 k → 43.6 k | 79 → 22 | 35 → 54 |
| point | 30.3 | 30.1 | 17.5 k → 34.1 k | 52 → 21 | 35 → 42 |
| timber | 30.0 | 28.0 | 23.4 k → 44.0 k | 71 → 22 | 35 → 62 |

Prêt (data-ready) : 1361 ms avant, 1683 ms après (serveur de dev local, cache froid, mesure unique).

## Profil de comparaison des captures (eau « standard » avec reflet planaire 256², matin)

| Format | Poste | FPS avant → après | Triangles visibles avant → après | Appels de dessin avant → après |
| --- | --- | --- | --- | --- |
| mobile | jetty | 30.4 → 30.2 | 18.7 k → 36.0 k | 44 → 21 |
| mobile | cove | 30.0 → 29.6 | 23.5 k → 39.2 k | 63 → 23 |
| mobile | bank | 30.2 → 30.3 | 17.2 k → 38.8 k | 51 → 19 |
| mobile | reed-bank | 30.3 → 28.9 | 24.5 k → 43.6 k | 79 → 35 |
| mobile | point | 30.3 → 30.0 | 17.5 k → 34.1 k | 52 → 33 |
| mobile | timber | 30.2 → 29.4 | 23.4 k → 44.0 k | 71 → 22 |
| desktop | jetty | 20.2 → 13.0 | 30.6 k → 70.1 k | 121 → 28 |
| desktop | cove | 21.1 → 13.8 | 32.4 k → 76.0 k | 147 → 28 |
| desktop | bank | 21.8 → 14.2 | 31.9 k → 78.6 k | 187 → 45 |
| desktop | reed-bank | 21.3 → 13.8 | 35.5 k → 91.4 k | 193 → 35 |
| desktop | point | 20.8 → 14.1 | 28.6 k → 71.1 k | 123 → 28 |
| desktop | timber | 20.3 → 13.9 | 37.8 k → 89.6 k | 190 → 32 |

## Chargement et ressources

- Fichiers de décor chargés (`/models/environment/`, `/map-assets/`) : 17 fichiers / 2.44 Mio avant → 16 fichiers / 5.01 Mio après (cible chantier : ≤ 6 Mio critiques, ≤ 18 Mio carte complète).
- Nouveaux GLB : `fdx-bank-earth.glb` 339 Ko, `fdx-lily.glb` 60 Ko, `fdx-pier-jetty.glb` 464 Ko, `fdx-reeds.glb` 264 Ko, `fdx-trees.glb` 2274 Ko.
- Sol : `ground-macro.jpg` 63 Ko + `ground-detail.png` 215 Ko (remplacent `ground-atlas.jpg` 126 Ko, qui n’est plus chargé).
- Textures décodées (estimation RGBA8 + mipmaps sur `scene.textures`, max des postes) : 17.4 Mio avant → 18.7 Mio après. Ce n’est pas la VRAM réelle.
- Dix transitions de poste (`water-scenarios.mjs`) : aucune croissance de meshes, matériaux, textures, géométries ni cibles de rendu ; pools d’eau vides à la fin.

## Lecture

- L’instanciation (GLB partagés + LOD par instance) divise les appels de dessin par 2 à 5 alors que les triangles visibles doublent (arbres réels au lieu de sphères, berges, roseaux).
- Bisection en rendu logiciel : masquer tous les arbres ne change pas le FPS ; le terrain plein écran et le filtrage anisotrope dominent le coût SwiftShader (anisotropie ramenée à 2/1 sur le sol).
- Le bureau 1440×900 logiciel passe de ~21 à ~14 FPS (même machine, même instrument) : surface de pixels ×4 en rendu CPU ; à vérifier sur GPU réel, non représentatif d’un téléphone.
- Qualité : éco ×0,85 et élevée ×1,25 sur les distances de LOD du registre ; eau low/standard/high inchangée en principe (reflet trié par taille apparente, 60 objets max).

## À mesurer sur appareil (non fait)

iPhone 14 Pro Safari : cadence prolongée 10 min par poste, frame times pendant combat proche et épuisette, chauffe, mémoire GPU, chargement réseau 4G froid. Procédure : `production_3d/environment/LIVRAISON.md`.
