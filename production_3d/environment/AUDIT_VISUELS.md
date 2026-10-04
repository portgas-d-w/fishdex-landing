# Audit visuel — Étang des Saules (lot 0)

Date : 4 octobre 2026. Agent : Claude Code. Base `main` d2ffa28 (0.15.0), branche `claude/fishdex-first-map-visuals-7815a5` (worktree séparé).

## Moteur et contraintes relevés

| Point | État réel |
| --- | --- |
| Moteur | Babylon.js core/loaders 9.28.0, scène main gauche (`useRightHandedSystem=false`), Vite 8.3.1, Node 24.15.0 |
| Chargeur GLB | `LoadAssetContainerAsync` + `instantiateModelsToScene` dans `src/render/pond-scenery.ts` (`replace(family,url)`) |
| Registre | `src/render/environment-registry.json` v2 : une ressource par famille, chemin `/models/environment/*.glb`, contrôle de dimensions ±35 %, fallback procédural conservé |
| Matériaux runtime | `StandardMaterial` (conversion PBR→Standard pour `free-*`), alpha-test pour feuillage. Le PBR a été écarté après mesure par Codex |
| Textures | JPEG/PNG, pas de KTX2 ni de décodeur Basis installé ; atlas sol 1024 unique sur 180×140 m |
| Qualité | Rendu `eco` (DPR 1, largeur interne ≤1024, 30 FPS plafonnés) / `high` (DPR ≤1,5, ombres 512² figées) ; eau `low/standard/high` (MirrorTexture 0/256/512) |
| Eau | `src/render/pond-water.ts` + `water-shaders.ts` : ShaderMaterial, atlas profondeur/contacts 256², 3–4 couches de rides, événements `game.waterEvents` |
| Lumière | Hémisphérique + directionnelle, ciel photo + `.env` préfiltré au matin ; ambiances `morning/overcast/evening` |
| Carte | `willow-pond` « Étang des Saules », 6 postes : jetty P01, cove P02, bank P03, reed-bank P04, point P05, timber P06 (le nom n’est pas changé) |
| Blender | `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`, version 5.1.2 |
| Axes | Export glTF +Y up : Blender −Y → Babylon +Z (vers l’eau au ponton), Blender +X → Babylon −X (rotation de 180°, pas de miroir) — à confirmer par la scène étalon |

## Coordination Codex

Chantier gameplay : `codex/gameplay-progression-atelier`, entièrement fusionné dans `main` (lot 5, 0.15.0, b26029b + docs d2ffa28). Le checkout principal ne porte que `DEMARRER_AVEC_CODEX.md` modifié par le propriétaire (non touché). Fichiers communs sensibles : `src/main.ts`, `src/render/world.ts` (rendu + gameplay mêlés), `package.json`, `src/game/*`. Ce chantier écrit d’abord dans `production_3d/`, `public/models/environment/`, `public/map-assets/`, `src/render/pond-scenery.ts`, `map-materials.ts`, `environment-registry.json`, `pond-water.ts`, `water-shaders.ts`.

## Captures de référence

`docs/apercus/visuels-blender/before/` : six postes mobile 390×844 et bureau 1440×900 (matin, eau standard, interface masquée), ponton en couvert/soir et cinq vues de contrôle (côté, depuis l’eau, plongée, contact bas, rive opposée). Mesures dans `reference.json` — Chromium SwiftShader (rendu logiciel), **pas un iPhone**.

| Profil | FPS | Triangles visibles |
| --- | --- | --- |
| Mobile 390×844 (eco plafonné 30) | 30,0–30,4 | 17–24,5 k |
| Bureau 1440×900 | 20,2–21,8 | 28,6–37,8 k |

## Diagnostic observé

1. **Sol** : l’atlas 1024 sur 180 m répète chaque matière en tuiles de ~18 px ; le mélange donne un beige uniforme « plage/désert » sur toutes les rives. Plus gros défaut de l’image.
2. **Arbres lointains** : proxies procéduraux (cylindre + 2–4 icosphères) → forêt de sphères identiques sur tout l’horizon. Le bouleau GLB proche a un feuillage jaune d’automne incohérent avec les proxies verts.
3. **Ponton** : boîtes en damier (texture de planches répétée par 2 m sur des lattes de 0,27 m), aucun longeron/chevêtre, 4 pieux trop courts qui dépassent comme des bornes ; bord de dalle visible de côté.
4. **Berge** : aucun talus ni humidité de contact ; la terre s’enfonce sous l’eau sans transition.
5. **Buissons** Quaternius vert fluo saturé ; touffes d’herbe très sombres en premier plan.
6. **Nénuphars** : feuilles écrasées en tirets alignés (contrat 0,32×0,01×0,25 m), lecture de « traits » à distance.
7. **Bois immergé** : tronc cylindre lisse + branches-bâtons alignées, flottant.
8. **Eau** : correcte (reflets, absorption) ; garder. Contact berge/eau absent, raccord à améliorer.

## Classement des ressources

| Ressource | Classement | Décision |
| --- | --- | --- |
| Eau (shader, profils, événements) | Suffisant | Conserver, finitions de contact et humidité de rive seulement |
| Ciel photo + `.env` | Suffisant | Conserver ; harmoniser intensités |
| Massettes `free-reeds` | À harmoniser | Conserver, teinte/densité à vérifier |
| Herbe `free-grass` | À harmoniser | Couleur trop sombre/saturée |
| Buisson `free-bush` | À adapter | Désaturer, réduire ; remplacer si possible |
| Rochers `free-rock*` | À harmoniser | Conserver, ancrage |
| Bouleau `free-tree-birch` | À adapter | Feuillage automne incohérent ; remplacer par aulne/chêne/saule produits |
| Proxies arbres lointains | À produire | LOD lointains réels + fond forestier |
| Ponton + pieux | À produire | P0 Blender, poste pilote |
| Berge de terre | À produire | P0 Blender, raccord du ponton |
| Texture sol | À produire | Macro-couleur + détail tuilé (pas de beige moyen) |
| Nénuphars `free-lily` | À adapter | Bouquets réels produits |
| Tronc / branches immergées | À produire | P0 Blender, P06 |
| Saule | À produire | P1, repère de rive |
| Chemins `path_patch` | Bloqué/désactivé | Désactivés par Codex ; P2 |
| Ponton/raccord `world.ts` (canne, fil, filet) | Bloqué par raccord commun | Non touché : gameplay |

## Ordre retenu

Lot 1 chaîne Blender (étalon, viewer moteur isolé) → lot 2 ponton + berge + sol + lumière → lot 3 arbres/végétation/autres postes → lot 4 eau/événements → lot 5 mesures/livraison.
