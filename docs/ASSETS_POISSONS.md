# Ressources de poissons — 1 octobre 2026, version 0.2.0

Source privée : assets-source/riverfishpack.zip, River fish / TricksUp, pack fourni par le propriétaire. Archive originale non modifiée, exclue de Git et du déploiement, jamais envoyée à une IA. Licence originale conservée ; aucune nouvelle licence attribuée aux ressources tierces.

Inventaire reproductible des **50 FBX** : scripts/inventory-pack.py, résultat PACK_INVENTAIRE.json (dimensions, polygones, textures, animations). Blender 5.1.2 en ligne de commande : **zéro armature et zéro action pour les 50 sources**, textures sources 1024². Quinze conversions puis textures embarquées 512² JPEG qualité 85 : **1 731 232 octets, 8 652 triangles au total**. Modèles normalisés à deux unités de présentation ; détails individuels dans public/models/manifest.json.

| Espèce biologique | GLB | Correspondance provisoire par nom et silhouette |
| --- | --- | --- |
| Rutilus rutilus — gardon | Roach | Argenté, nageoires rouges |
| Perca fluviatilis — perche | EuropeanPerch | Rayures et dorsale épineuse |
| Cyprinus carpio — carpe commune | CommonCarp | Carpe écaillée ; pas une miroir/koï |
| Esox lucius — brochet | NorthernPike | Corps long et museau aplati |
| Sander lucioperca — sandre | Zander | Corps allongé, deux dorsales |
| Abramis brama — brème commune | CommonBream | Corps haut et comprimé |
| Tinca tinca — tanche | Tench | Corps olive, nageoires arrondies |
| Scardinius erythrophthalmus — rotengle | Rudd | Nageoires rouges, bouche relevée |
| Alburnus alburnus — ablette | Bleak | Petit corps argenté allongé |
| Carassius carassius — carassin | CrucianCarp | Corps trapu bronze |
| Blicca bjoerkna — brème bordelière | WhiteBream | Corps haut, grands yeux |
| Gobio gobio — goujon | Gudgeon | Taches et barbillons |
| Squalius cephalus — chevesne | Chub | Grande bouche, corps robuste |
| Leuciscus idus — ide mélanote | Ide | Flancs argentés et dos sombre |
| Silurus glanis — silure glane | WelsCatfish | Corps long, tête aplatie et barbillons |

Atlas rendu inspecté : [poissons-atlas.jpg](apercus/poissons-atlas.jpg). Ces associations ne constituent pas une validation taxonomique d’expert. Les 35 autres sources restent privées et non chargées par le jeu.

Conversion : FISH_MODELS permet de choisir les modèles dans scripts/convert_fish.py, puis python scripts/optimize-models.py. Reconvertir depuis l’archive avant réoptimisation pour éviter la recompression répétée. Géométrie inchangée par l’optimisation. src/render/appearance.ts centralise ressources, orientation et robes ; la progression dépend d’identifiants d’espèce, pas des noms GLB.

88 illustrations FishDex en WebP ≤360×240 : **556 892 octets**. Sources locales public/fishes, varieties, mutations, aucun contenu utilisateur. Import reproductible : node scripts/import-fishdex.mjs <dossier FishDex> avec Python/Pillow. Provenance et SHA256 dans src/game/fishdex.json. Aucun seed exécuté, aucune base distante consultée. Illustrations pour l’encyclopédie ; photos de prises issues du rendu exact du spécimen.

## Animations livrées et limites

Nage du corps/queue par courbe centrale inextensible et rotations de sections ; tête stable, normales tournées, nageoires attachées. Trajectoires variées, niveaux espacés et proportions de gabarit conservées. Le budget de hauteur réduit toutes les tailles ensemble si nécessaire. Animation procédurale légère provisoire, sans squelette ni nage anatomique finalisée.

Débattement intermittent dans la fiche et tapis simple pour les spécimens ≥60 cm. Coloration naturelle/dorée/Mirage, espèce et longueur conservées du lancer au souvenir et à l’aquarium. La fiche normalise le cadrage pour rester lisible ; l’aquarium exprime les différences relatives de gabarit.

**Absents : respiration bouche/opercules, présentation suspendue au fil, poisson 3D au bord et arrivée à l’épuisette.** Aucun modèle d’anguille intégré. Pour un remplacement futur, fournir un rig/clip adapté à chaque forme dans la correspondance visuelle sans modifier les captures sauvegardées.
