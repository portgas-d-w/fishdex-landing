# Livraison — visuels Blender de la première carte (Étang des Saules)

4 octobre 2026, Claude Code, branche `claude/fishdex-first-map-visuals-7815a5` sur `main` d2ffa28 (gameplay 0.15.0 inclus, aucun fichier gameplay modifié).

## Ce qui change à l’écran

- **Sol** : prairie variée, terre de berge, vase humide à la ligne d’eau, sentiers derrière chaque poste, graviers (P03/P05), prairie humide (P02/P04), sédiment visible sous l’eau peu profonde — fin du « beige de plage ».
- **Ponton P01** : planches individuelles patinées, longerons, chevêtres, lisses, croix de Saint-André, pieux ancrés dans le fond réel avec film d’algues à la ligne d’eau ; trois LOD.
- **Berges** : lèvres de terre érodée avec racines fines le long du vrai contour, de part et d’autre de chaque poste.
- **Arbres** : aulnes colonnaires, chênes à houppier large, saules pleureurs repères en rive, buissons ; rideau forestier continu en fond ; imposteurs lointains rendus depuis Blender ; léger balancement au vent (GPU).
- **Roseaux et herbe** : roselières denses (phragmites + massettes) aux obstacles réels et en massifs de rive hors des secteurs de lancer ; touffes d’herbe vertes.
- **Nénuphars** : bouquets de feuilles échancrées au lieu de tirets alignés.
- **Bois immergé P06** : tronc couché à bout cassé et branches mortes émergeant aux volumes d’accroche réels.
- **Eau** : rides d’impact lisibles et proportionnées, gouttes et petite gerbe pour les franchissements massifs réels (pools bornés), reflet planaire de la rive boisée opposée (profils standard/élevé).

Comparaisons réelles (même caméra, même ambiance) : `docs/apercus/visuels-blender/comparaison-avant-apres.jpg` et `comparaison-poste-pilote.jpg` ; séries complètes `before/` et `after/`.

## Sources livrées

| Dossier | Contenu |
| --- | --- |
| `production_3d/environment/tools/` | `fdx_blender.py` (bibliothèque bpy), `build_calibration.py`, `build_pier.py`, `build_bank.py`, `build_trees.py`, `build_reeds.py`, `build_lily.py`, préparation textures (`prepare_textures.py`, `make_foliage_atlas.py`, `make_lily_texture.py`, `quantize_png.py`), sol (`ground-fields.mts`, `bake_ground.py`), contrôles (`engine-check.mjs`, `capture-ingame.mjs`, `water-scenarios.mjs`, `build-manifest.mjs`, `make_post_previews.py`) |
| `production_3d/environment/source/` | `.blend` éditables (étalon, ponton, berges, arbres/bois, roseaux, nénuphars) |
| `production_3d/environment/textures/` | sources CC0 Poly Haven + `PROVENANCE.json`, textures préparées |
| `production_3d/environment/reports/` | rapports d’export, imports moteur, `EAU_EVENEMENTS.md`, `PERFORMANCES.md` |
| `production_3d/environment/manifest.json` | statut par famille (source → export → import moteur → poste intégré) et licences |
| `production_3d/environment/viewer/` | viewer moteur isolé (même Babylon, mêmes lumières et conversion de matériaux que le jeu) |

`production_3d/` est exclu du déploiement (`.vercelignore`) ; seuls `public/models/environment/fdx-*.glb` et `public/map-assets/ground-*` partent en production.

## Reconstruire

```
python production_3d/environment/tools/prepare_textures.py
python production_3d/environment/tools/make_foliage_atlas.py
python production_3d/environment/tools/make_lily_texture.py
node --experimental-strip-types production_3d/environment/tools/ground-fields.mts
python production_3d/environment/tools/bake_ground.py
"C:\Program Files\Blender Foundation\Blender 5.1\blender.exe" -b --factory-startup --python production_3d/environment/tools/build_pier.py
```
(idem `build_bank.py`, `build_trees.py`, `build_reeds.py`, `build_lily.py`), puis `node production_3d/environment/tools/build-manifest.mjs`.

## Ouvrir et tester

1. `VITE_E2E=1 npx vite --host 127.0.0.1 --port 5180 --strictPort` puis http://127.0.0.1:5180 ; Menu → Aide → Outils de test → profil de test → choisir un poste.
2. Viewer d’un asset : http://127.0.0.1:5180/production_3d/environment/viewer/index.html?glb=/models/environment/fdx-trees.glb
3. Captures et mesures : `node production_3d/environment/tools/capture-ingame.mjs <dossier> --pilot` ; eau : `node production_3d/environment/tools/water-scenarios.mjs eau`.

## Procédure téléphone (à faire par le propriétaire, non réalisée ici)

Sur iPhone 14 Pro, Safari, après publication : ouvrir fishdex.fr, attendre l’étang, visiter les six postes (Menu → Carte), rester 2 minutes par poste au repos puis lancer/combattre une prise au ponton. Noter : saccades, chauffe, lisibilité du fil et du flotteur sur le nouveau sol, arbres qui « sautent » de niveau de détail, durée de chargement en 4G. Passer en Qualité élevée (Réglages) et répéter au ponton.

## Limites honnêtes

- Mesures uniquement sur Chromium SwiftShader (rendu logiciel) ; aucune mesure iPhone ni GPU réel.
- Bureau logiciel 1440×900 : ~21 → ~14 FPS (triangles ×2, surface ×4 en CPU) ; profil mobile éco par défaut ~28–30 FPS (plafond 30), à confirmer sur appareil.
- Brouillard existant (`world.ts`, fichier commun non modifié) : les arbres lointains restent un peu délavés.
- `fish_surface_break`, `fish_dive`, `rain_surface` ne sont pas émis par la simulation : leur rendu existe mais n’apparaît pas en jeu.
- Anciennes ressources gratuites (`free-tree-birch`, `free-bush`, `free-lily`, `free-reeds`, `free-grass`, `ground-atlas.jpg`) conservées dans `public/` pour un retour arrière par simple changement du registre ; elles ne sont plus chargées.
