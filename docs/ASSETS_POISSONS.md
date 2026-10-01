# Ressources de poissons — 1 octobre 2026

Source privée : `assets-source/riverfishpack.zip`, River fish / TricksUp, pack fourni par le propriétaire. 50 FBX nommés ; archive non modifiée, exclue de Git et du déploiement, aucun envoi à une IA. Licence originale conservée, aucune nouvelle licence attribuée aux ressources tierces.

Les cinq GLB initiaux ont 480–660 triangles, longueur de présentation 2 unités, textures PNG 512² intégrées, 833 376 octets au total. Dimensions sources, triangles et poids individuels : `public/models/manifest.json`.

| Identité biologique | Modèle | Correspondance |
| --- | --- | --- |
| Rutilus rutilus — gardon | Roach | Écailles argentées, nageoires rouges |
| Perca fluviatilis — perche | EuropeanPerch | Corps rayé, dorsale épineuse |
| Cyprinus carpio — carpe commune | CommonCarp | Corps trapu, écailles de carpe commune ; pas une miroir/koï |
| Esox lucius — brochet | NorthernPike | Corps long, museau de brochet |
| Sander lucioperca — sandre | Zander | Silhouette allongée, deux dorsales |

Les sources FBX sont statiques sans squelette ni animation livrés selon l’inventaire initial. Les GLB n’ont ni skins ni animations. `src/render/appearance.ts` centralise une correspondance remplaçable par espèce/forme/coloration, sans dépendance de la progression au nom GLB.

88 illustrations de fiches FishDex ont été copiées et optimisées en WebP ≤360×240 (557 Ko au total). Elles proviennent des fichiers locaux `public/fishes`, `varieties`, `mutations` ; aucun contenu utilisateur. Import reproductible : `node scripts/import-fishdex.mjs <dossier FishDex>` avec Python/Pillow. Origines et SHA256 des fichiers de données dans `src/game/fishdex.json`. Leur statut ne prouve pas l’état de la base distante. Les illustrations sont utilisées pour l’encyclopédie, les captures utilisent une photo du rendu exact du spécimen.

Aquarium : nage par courbe centrale inextensible et rotation des sections du corps, tête stable, queue ondulante. Géométrie/texture conservées, nageoires attachées. Cette déformation légère n’est pas un rig anatomique complet. Les spécimens occupent des niveaux distincts pour réduire les intersections et restent dans le bassin. Respiration bouche/opercules, débattement suspendu et tapis : encore absents. L’aperçu de capture oscille la caméra, il ne constitue pas une nage.
