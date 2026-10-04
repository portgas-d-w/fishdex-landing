# Relais Claude — chantier visuel Blender, première carte

Mise à jour : 4 octobre 2026, Claude Code. Mission : `CHANTIER_CLAUDE_VISUELS_BLENDER_FISHDEX.zip` (docs 01–06, `plan_lots.json`).

## Base et branche

- Worktree : `.claude/worktrees/fishdex-first-map-visuals-7815a5`, branche `claude/fishdex-first-map-visuals-7815a5`, base `main` d2ffa28 (0.15.0).
- Gameplay Codex : `codex/gameplay-progression-atelier`, déjà fusionné dans `main` (lot 5). Aucun fichier `src/game/*`, `src/main.ts`, `src/render/world.ts`, `package.json` modifié par ce chantier.
- Checkout principal : seul `DEMARRER_AVEC_CODEX.md` modifié par le propriétaire, non touché.
- Blender : `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe` (5.1.2), scripts `bpy` en `-b --factory-startup`.

## État des lots

| Lot | État | Preuves |
| --- | --- | --- |
| 0 Audit | Terminé | `production_3d/environment/AUDIT_VISUELS.md`, `docs/apercus/visuels-blender/before/` (+ `reference.json`) |
| 1 Chaîne Blender | Terminé | `tools/fdx_blender.py`, étalon `tools/build_calibration.py` → `exports/calibration.glb`, viewer moteur `viewer/index.html`, `reports/engine-import/calibration` (flèche +Z, repère −X, poteau (−0,4 ; −0,4), cube posé y=0) |
| 2 Poste pilote | En cours (ponton, berge, sol intégrés et vérifiés) | `docs/apercus/visuels-blender/pilot-v1/` |
| 3–5 | À faire | — |

## Ressources produites et intégrées

| Asset | Fichiers | Triangles | Statut |
| --- | --- | --- | --- |
| Ponton P01 `pier_jetty` | `tools/build_pier.py` → `source/pier_jetty.blend`, `public/models/environment/fdx-pier-jetty.glb` (475 Ko) | LOD0 1 832 / LOD1 692 / LOD2 60, 1 matériau | Poste intégré (remplace `pier_deck`+`pier_pile` procéduraux, gardés en secours) |
| Berge érodée `bank_earth` ×3 variantes | `tools/build_bank.py` → `source/bank_earth.blend`, `fdx-bank-earth.glb` (371 Ko) | 720/96/24 par variante | Poste intégré : 6 modules max par poste sur le vrai contour |
| Sol macro + détail | `tools/ground-fields.mts` + `tools/bake_ground.py` → `public/map-assets/ground-macro.jpg` (63 Ko), `ground-detail.png` (215 Ko) | — | Intégré dans `map-materials.ts` (remplace `ground-atlas.jpg`, désormais inutilisé) |

Manifest : `production_3d/environment/manifest.json` (`node production_3d/environment/tools/build-manifest.mjs`). Licences : `textures/source/PROVENANCE.json` (Poly Haven CC0).

## Fichiers modifiés (raccord moteur, rôle visuel)

- `src/render/environment-materials.ts` (nouveau) : conversion PBR→Standard partagée ; `environmentLoadOptions` charge les GLB `fdx-*` sans tampon sRGB (sinon base color ~4× trop sombre en StandardMaterial).
- `src/render/environment-lod.ts` (nouveau) : LOD `<nom>_lodN` reliés seulement si `lod.levels` est déclaré au registre ; les instances suivent le LOD de leur source.
- `src/render/pond-scenery.ts` : `replacesFamilies`, variantes (`variants` + `Placement.variant`), prédicat d’instanciation LOD0, placement `pier_jetty`, pieux de secours alignés, `banks()` le long du contour.
- `src/render/environment-registry.json` v3 : entrées `pier_jetty`, `bank_earth`.
- `src/render/map-materials.ts` : `ground()` macro + `detailMap` (PNG gris+alpha obligatoire : un JPEG sans alpha donne une normale de détail nulle → sol blanc).
- `.gitignore` (champs `.f32`, journaux), `.vercelignore` (`production_3d`).

## Paramètres retenus

- Axes : Blender −Y → Babylon +Z, Blender +X → Babylon −X (rotation 180°, pas de miroir).
- Couleurs de sommet : multiplicateurs encodés sRGB (`fx.vcol`) car l’exporteur linéarise COLOR_0.
- Ponton : pivot niveau de l’eau, axe, milieu ; placement (0,0,−4) ; dessus y=0,355 ; pieux ancrés −0,45 m sous `pondGround`. LOD 24 m / 60 m.
- Berges : lèvre au contour, +z vers l’eau, dos enterré sous `pondGround`. LOD 20 / 45 m, rien au-delà de 110 m.
- Sol : macro 1024² (invertY=false, ligne 0 = z −31), détail tuilé 3 m, anisotropie 4.

## Mesures (Chromium SwiftShader, pas un iPhone)

Avant : mobile 390×844 30,0–30,4 FPS (plafond éco), bureau 20,2–21,8 FPS, 17–38 k triangles visibles. Pilote : mobile ponton 30,2 FPS / 22,1 k tri ; bureau 14,9 FPS / 38,1 k tri (rendu logiciel, à re-mesurer sur GPU ; le coût CPU SwiftShader du detailMap n’est pas représentatif).

## Limites connues

- Arbres lointains encore en proxies sphériques, bouleau automne, buissons fluo, nénuphars en tirets, bois immergé cylindrique : lot 3.
- Les GLB `free-*` gardent le chargement sRGB matériel historique (probablement trop sombres : rochers presque noirs) — à évaluer en lot 3 avant de changer leur rendu.
- Le reflet planaire n’est rafraîchi que toutes les 6 images en standard : une caméra déplacée brutalement (vues de contrôle) montre un reflet en retard ; caméra de jeu fixe non concernée.

## Prochaine action exacte

1. Finir le lot 2 : vérifier ambiances couvert/soir (`node production_3d/environment/tools/capture-ingame.mjs pilot-v2 --posts jetty --pilot`), contact des pieux avec l’eau, puis captures avant/après définitives.
2. Lot 3 : produire arbres (aulne, chêne, saule) avec LOD lointain + fond forestier, buissons, nénuphars, tronc/branches immergés (P06), puis compositions des six postes.

Serveur de travail : `VITE_E2E=1 npx vite --host 127.0.0.1 --port 5180 --strictPort` ; contrôle moteur isolé : `MSYS_NO_PATHCONV=1 node production_3d/environment/tools/engine-check.mjs <id> /models/environment/<fichier>.glb`.
