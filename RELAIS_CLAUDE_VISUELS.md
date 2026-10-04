# Relais Claude — chantier visuel Blender, première carte

Mise à jour : 4 octobre 2026 (soir), Claude Code. Mission : `CHANTIER_CLAUDE_VISUELS_BLENDER_FISHDEX.zip` (docs 01–06, `plan_lots.json`).

## Base et branche

- Worktree : `.claude/worktrees/fishdex-first-map-visuals-7815a5`, branche `claude/fishdex-first-map-visuals-7815a5`, base `main` d2ffa28 (0.15.0).
- Gameplay Codex : `codex/gameplay-progression-atelier`, déjà fusionné dans `main` (lot 5). Aucun fichier `src/game/*`, `src/main.ts`, `src/render/world.ts`, `src/ui/*`, `package.json` modifié par ce chantier.
- Checkout principal : seul `DEMARRER_AVEC_CODEX.md` modifié par le propriétaire, non touché.
- Blender : `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe` (5.1.2), scripts `bpy` en `-b --factory-startup`.

## État des lots

| Lot | État | Preuves |
| --- | --- | --- |
| 0 Audit | Terminé | `production_3d/environment/AUDIT_VISUELS.md`, `docs/apercus/visuels-blender/before/` |
| 1 Chaîne Blender | Terminé | `tools/fdx_blender.py`, étalon `build_calibration.py`, viewer `viewer/index.html`, `reports/engine-import/calibration` |
| 2 Poste pilote | Terminé | ponton + berges + sol ; `docs/apercus/visuels-blender/pilot-v1/` (5 vues, matin/couvert/soir) |
| 3 Végétation et carte | Terminé (première passe) | arbres, buissons, rideau forestier, roseaux, herbe, nénuphars, bois immergé ; `lot3/` (6 postes ×2 formats), `reeds-v2/` |
| 4 Eau et événements | Terminé | `production_3d/environment/reports/EAU_EVENEMENTS.md`, `docs/apercus/visuels-blender/eau/` (+ `water-scenarios.json`), `lot4/` |
| 5 Optimisation / livraison | À faire | — |

## Ressources produites (toutes « poste_integre » d’après `production_3d/environment/manifest.json`)

| Famille registre | GLB | Script / source | Triangles LOD0 / LOD1 / LOD2 |
| --- | --- | --- | --- |
| `pier_jetty` (remplace `pier_deck`+`pier_pile`) | `fdx-pier-jetty.glb` 475 Ko | `build_pier.py` / `pier_jetty.blend` | 1 832 / 692 / 60 |
| `bank_earth` ×3 | `fdx-bank-earth.glb` 347 Ko | `build_bank.py` / `bank_earth.blend` | 720 / 96 / 24 |
| `tree_alder` ×3, `tree_oak` ×3, `tree_willow` ×2, `shrub` ×3, `fallen_log` ×2, `submerged_branches` ×3 | `fdx-trees.glb` 3,0 Mo (écorce 512, atlas feuillage 1024 PNG8, imposteurs 1024) | `build_trees.py` (+ `make_foliage_atlas.py`) / `trees.blend` | aulne ~3,5 k / 0,9 k / 4 ; chêne ~2 k / 0,56 k / 4 ; saule ~2 k / 0,5 k / 4 ; buisson ~0,9 k / 0,38 k / 4 ; tronc 394 / 153 / 20 ; branches ~350 / 120 / 30 |
| `reeds` (obstacles), `reeds_shore` (décor), `grass_clump` ×3 | `fdx-reeds.glb` 270 Ko (couleurs de sommet, sans texture) | `build_reeds.py` / `reeds.blend` | roseaux ~900 / 400 / 70 ; herbe ~160 / 50 / 24 |
| `lily_cluster` ×3 | `fdx-lily.glb` 62 Ko | `build_lily.py` (+ `make_lily_texture.py`) / `lily.blend` | ~170 / 70 / 35 |
| Sol | `public/map-assets/ground-macro.jpg` 63 Ko + `ground-detail.png` 215 Ko | `ground-fields.mts` + `bake_ground.py` | — |

Placement (dans `src/render/pond-scenery.ts`, graines déterministes, sans consommer l’aléa historique) : ponton (0,0,−4) ; `banks()` 6 modules max par poste sur le vrai contour ; `willows()` 5 saules repères ≥16 m des postes ; `backdrop()` 2 rangs d’arbres au bord du terrain ; `shoreReeds()` massifs hors secteurs de lancer (marge 7° à la Bordure des roseaux, 18° ailleurs) ; nénuphars en 7 bouquets (P02/P04) ; bois immergé aux obstacles réels de P06 (pivot au niveau de l’eau).

## Fichiers modifiés (rôle visuel uniquement)

- `src/render/environment-materials.ts` (nouveau) : PBR→Standard ; `environmentLoadOptions` charge **tous** les GLB du décor (`fdx-*`, `free-*`) sans tampon sRGB matériel (sinon couleurs ~4× trop sombres : rochers noirs, herbe noire). Feuillage : alpha-test, pas de `twoSidedLighting` (normales de volume exportées).
- `src/render/environment-lod.ts` (nouveau) : LOD `<nom>_lodN[_primitiveK]` reliés selon `lod.levels` du registre ; un niveau mono-primitive (imposteur) remplace le feuillage, l’écorce disparaît.
- `src/render/pond-scenery.ts` : `replacesFamilies`, `variants` (préfixes de nœuds), `allPlacements`, contrôle de dimensions par famille/variante, placements ci-dessus.
- `src/render/environment-registry.json` v3 : familles ci-dessus.
- `src/render/map-materials.ts` : sol macro + `detailMap` (PNG gris+alpha obligatoire), anisotropie 2/1.
- `src/render/pond-water.ts` : contacts (nénuphars ∝ échelle, branches immergées, roseaux de rive) ; rides lisibles (opacité ∝ perturbation, ≤0,38) ; gouttes 4,5 cm ; couronnes d’éclaboussure en pool (2/4/6) pour franchissements massifs réels ; reflet trié par taille apparente, 60 objets max.
- `.gitignore`, `.vercelignore` (`production_3d` exclu du déploiement).

## Paramètres et pièges retenus

- Axes : Blender −Y → Babylon +Z, Blender +X → Babylon −X (rotation 180°).
- Couleurs de sommet : multiplicateurs encodés sRGB (`fx.vcol`), l’exporteur linéarise COLOR_0.
- Alpha MASK glTF : nœud `Math > GREATER_THAN 0.5` entre alpha de texture et BSDF.
- Normales personnalisées (`normals_split_custom_set_from_vertices`) pour cartes de feuilles, imposteurs (vers le haut), roseaux, nénuphars.
- Imposteurs : rendu EEVEE ortho fond transparent, composé 4×4 dans Blender (numpy), couleur ×0,82.

## Mesures (Chromium SwiftShader = rendu logiciel CPU, **pas un iPhone**)

| Profil | Avant | Après lot 3 |
| --- | --- | --- |
| Mobile 390×844 éco (plafond 30) | 30,0–30,4 FPS, 17–24,5 k tri | 28,2–30,3 FPS, 36–44,5 k tri |
| Bureau 1440×900 | 20,2–21,8 FPS, 29–38 k tri | 12,9–14,0 FPS, 69–97 k tri |

Bisection : masquer les arbres ne change pas le FPS logiciel ; le terrain plein écran et le filtrage anisotrope dominent le coût SwiftShader. Non représentatif d’un GPU mobile : mesure physique iPhone toujours à faire.

## Limites connues

- Feuillage statique (pas de vent sur les GLB) ; anciens roseaux procéduraux animés remplacés.
- Arbres lointains délavés par le brouillard existant (`world.ts`, fichier commun non modifié).
- `ground-atlas.jpg`, `free-tree-birch.glb`, `free-bush.glb`, `free-lily.glb`, `free-reeds.glb`, `free-grass.glb` ne sont plus référencés par le registre (encore dans `public/`) : à retirer au lot 5 après vérification des tests/manifestes Codex qui les citent.
- Chemins `path_patch` toujours désactivés (choix Codex).

## Prochaine action exacte

Lot 5 : (1) synchroniser avec `main` (vérifier les nouveaux commits Codex, fusion sans écraser le gameplay) ; (2) mesure dédiée au profil par défaut (éco + eau low) et au profil haut sur les six postes ; (3) captures finales avant/après identiques (`capture-ingame.mjs after --pilot`) et planche comparative ; (4) retirer de `public/` les ressources plus référencées après vérification des tests et manifestes Codex (`ground-atlas.jpg`, `free-tree-birch.glb`, `free-bush.glb`, `free-lily.glb`, `free-reeds.glb`, `free-grass.glb`) ; (5) `npm run check` + suites Playwright du dépôt ; (6) prévisualisation puis production Vercel `portgas-d-ws-projects/fishdex-landing` si l’accès CLI est disponible.

Serveur : `VITE_E2E=1 npx vite --host 127.0.0.1 --port 5180 --strictPort` ; captures : `node production_3d/environment/tools/capture-ingame.mjs <dossier> [--posts …] [--pilot] [--viewports mobile,desktop]` ; import isolé : `MSYS_NO_PATHCONV=1 node production_3d/environment/tools/engine-check.mjs <id> /models/environment/<fichier>.glb` ; manifest : `node production_3d/environment/tools/build-manifest.mjs`.
