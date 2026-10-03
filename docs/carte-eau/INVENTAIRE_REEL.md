# Inventaire réel — carte 0.12

Mesure issue des placements de la scène et du registre, 3 octobre 2026. Les nombres décrivent les objets placés ou les pools alloués ; les textures/composites ne sont pas additionnés aux instances GLB. Les entrées absentes sont des améliorations futures facultatives.

| Famille | Quantité réelle | État | Priorité future |
| --- | ---: | --- | --- |
| bank_earth | 1 | shared_terrain | P0 |
| bank_rock | 0 | absent_optional_future | P1 |
| bank_roots | 0 | absent_optional_future | P1 |
| pebble_cluster | 0 | absent_optional_future | P1 |
| tree_alder | 62 | procedural_to_refine | P1 |
| tree_willow | 12 | procedural_to_refine | P1 |
| tree_oak | 60 | procedural_to_refine | P1 |
| forest_backdrop | 0 | absent_optional_future | P1 |
| shrub | 13 | procedural_to_refine | P1 |
| grass_clump | 45 | procedural_to_refine | P1 |
| reeds | 3 | procedural_to_refine | P0 |
| sedges | 0 | absent_optional_future | P1 |
| lily_cluster | 36 | procedural_to_refine | P0 |
| submerged_plants | 0 | absent_optional_future | P1 |
| rock_small | 20 | procedural_to_refine | P1 |
| rock_landmark | 1 | procedural_to_refine | P1 |
| fallen_log | 1 | procedural_to_refine | P0 |
| submerged_branches | 2 | procedural_to_refine | P0 |
| stump | 0 | absent_optional_future | P2 |
| pier_deck | 4 | procedural_to_refine | P0 |
| pier_pile | 4 | procedural_to_refine | P0 |
| path_patch | 18 | procedural_to_refine | P2 |
| bench | 0 | absent_optional_future | P2 |
| sign_post | 0 | absent_optional_future | P2 |
| angler_proxy | 1 | existing_proxy | P2 |
| floating_leaves | 0 | absent_optional_future | P2 |
| tex_ground_earth | 1 | procedural_sufficient | P0 |
| tex_shore_mud | 0 | absent_optional_future | P0 |
| tex_sand_gravel | 0 | absent_optional_future | P1 |
| tex_grass_ground | 0 | absent_optional_future | P1 |
| tex_wood_weathered | 2 | procedural_sufficient | P0 |
| tex_rock | 0 | absent_optional_future | P1 |
| water_normals | 0 | procedural_sufficient | P0 |
| water_contact_mask | 1 | procedural_sufficient | P0 |
| fx_ripple | 28 | functional_pool | P0 |
| fx_splash | 48 | functional_pool | P0 |
| fx_foam_local | 0 | absent_optional_future | P2 |
| sky_environment | 1 | procedural_sufficient | P0 |
| water_audio | 1 | synthetic_fallback | P1 |
| spot_previews | 12 | rendered_references | P1 |

281 placements environnementaux, regroupés spatialement ; collisions et réception restent dans src/game. Les 33 GLB naturels des poissons sont réutilisés à la demande, aucun chargé au démarrage de la carte. Registre runtime : 14 familles placées ; les entrées de terrain, texture, son, ciel et PNJ ont leur implémentation spécifique référencée dans le manifeste.

Les dimensions/pivots du registre runtime décrivent les représentations réellement placées et priment sur les dimensions indicatives du dossier initial. Fournir GLB métrique/LOD, matériaux opaques sobres et raccords du ponton ; ne pas corriger une collision par changement silencieux du décor. Pour les lightmaps : UV2 + PNG linéaire, affectation explicite côté Babylon, essai matin puis désactivation couvert/soirée. Sources .blend et textures de travail restent hors du build et du dépôt public.
