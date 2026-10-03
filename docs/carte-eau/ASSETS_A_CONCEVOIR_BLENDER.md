# Assets de la carte — Liste de production après livraison

## Audit de livraison 0.12 — 3 octobre 2026

La carte est livrée avec ses objets procéduraux. L'inventaire effectif et les quantités sont dans `INVENTAIRE_REEL.md` et `assets_manifest.json` actualisé ; les dimensions/pivots de `src/render/environment-registry.json` priment pour les familles réellement placées. Captures des six postes : `../apercus/carte-eau/post-{desktop,mobile}-{id}.png`. 281 placements, regroupés par zones, 14 familles remplaçables ; aucune série Blender produite pendant ce chantier.

P0 : embellir berge/contact du sol et ponton proche à partir des proportions finales. P1 : arbres, roseaux, nénuphars, roches et bois immergé. P2 : accessoires absents facultatifs et sons enregistrés. Les normales d'eau, masque de profondeur/rive, ciel, pools et textures procédurales fonctionnent déjà ; ne pas les commander à nouveau comme des dépendances obligatoires. Valider chaque substitution par famille, sans modifier les volumes de fil ou la réception. Les lightmaps/LOD finaux sont une étape future à fournir puis tester ; leur absence ne bloque pas le jeu actuel.

La carte doit d’abord être complète avec ses ressources actuelles et des modèles provisoires remplaçables. Cette liste prépare son embellissement, sans imposer de génération pendant le chantier de carte. Les valeurs sont des budgets de conception, pas un inventaire d’assets déjà fabriqués.

## 1. Priorités et suivi

**P0** : eau, contact de berge et objets proches dominants. **P1** : végétation et matières qui donnent l’identité des six postes. **P2** : accessoires et vie ambiante après validation des performances.

`assets_manifest.json` contient les entrées machine, les variantes demandées, dimensions, pivots, budgets et emplacements prévus. Les variantes sont des modèles distincts à créer ; les instances sur la carte réutilisent ces modèles. Leur nombre peut varier selon les mesures : ne pas produire un fichier pour chaque brin d’herbe.

À la livraison de la carte, Codex renseigne pour chaque famille : existant suffisant, provisoire à remplacer, absent, référence utilisée, postes concernés, quantité réelle et emplacement de chargement. Déduire le nombre de tâches de production restantes de cet audit ; ne pas commander à nouveau un asset déjà satisfaisant.

## 2. Livrable standard d’un modèle Blender

Pour chaque famille produite ultérieurement : source `.blend`, script `.py` reproductible si généré par l’IA, modèles `.glb` glTF 2.0, textures sources PNG, manifest de dimensions/pivots/LOD, et aperçus PNG de contrôle. La carte ne charge que les fichiers d’exécution nécessaires ; sources et aperçus de contrôle restent dans la documentation ou les sources d’assets.

Échelle métrique : 1 unité = 1 m. Origine/pivot conforme au tableau. Transformations appliquées sur le maillage quand approprié ; zéro scale négatif, zéro objet parasite caché exporté. Maillage sans trous accidentels, faces inversées, géométrie en suspension ou pièces déconnectées injustifiées.

Convention source Blender : Z vertical. Convention GLB : Y vertical après export. L’orientation du moteur existant est conservée. Valider avec un cube de 1 m, une flèche directionnelle et un modèle asymétrique avant de produire la série ; ne pas ajouter une rotation automatique une deuxième fois dans le jeu.

Chaque GLB livré contient un LOD par fichier ou une hiérarchie explicitement gérée par le registre : aucun mécanisme LOD supposé à partir du nom. Fichiers conseillés : `env_<id>_v01_lod0.glb`, `..._lod1.glb`, `..._lod2.glb`. La convention peut suivre le dépôt si elle est déjà cohérente. Les budgets portent sur triangles exportés, pas les faces quadrangulaires dans Blender.

Matériaux PBR métalliques/roughness simples, idéalement 1–2 par asset répétitif, au plus 3 pour un objet proche justifié. Les matériaux du bois, de la terre, des feuilles et des pierres ne sont pas métalliques. Pas de shader Blender complexe que glTF ignore ; précalculer les détails utiles dans les textures.

Opaques par défaut. Feuillages en alpha-mask lorsque adaptés, avec faces double côté uniquement si nécessaires. Limiter cartes superposées et petits détails transparents. Vérifier de profil et depuis toutes les caméras du jeu.

Collisions simples séparées : boîte/capsule/volume convexe ou données JSON du registre. Aucun maillage de collision aussi détaillé que l’objet visible. Les volumes d’accrochage du fil ont un rôle propre, distinct des collisions caméra.

Sockets/repères nommés pour ponton, PNJ et réception lorsque utiles ; conserver leur position lors d’une amélioration. Pour les modules raccordables, extrémités et dimensions cohérentes, sans interstices visibles à échelle normale.

## 3. Textures et compression

Base color et emissive : espace sRGB. Normal tangent OpenGL +Y, roughness/metallic/occlusion : données linéaires. Texture ORM : rouge = occlusion, vert = roughness, bleu = metallic. Pour les surfaces naturelles, metallic généralement nul.

Sources : PNG sans perte pour données/alpha ; base color PNG ou JPEG de qualité suffisante. Les images du GLB glTF de base sont PNG/JPEG. KTX2 via extension et pipeline d’optimisation seulement après vérification du loader ; WebP n’est pas un format universel à placer sans extension dans un GLB.

Runtime : PNG/JPEG ou KTX2/Basis si le dépôt le prend en charge. Préférer UASTC ou qualité appropriée pour normales/masques sensibles ; ETC1S peut servir aux couleurs moins critiques si son résultat est contrôlé. Héberger les décodeurs requis avec le projet quand cette configuration est nécessaire.

Tailles usuelles : 512 ou 1024 px ; 2048 pour quelques matériaux proches dominants, pas chaque objet. Mipmaps et répétition lorsqu’elles sont prévues ; vérifier coutures et fréquence à l’échelle métrique. Les textures de ridules d’eau sont répétables ; les atlas d’impact ne le sont pas forcément.

Pour lightmaps futures : deuxième UV sans chevauchement, marge suffisante, bake avec ambiance documentée et affectation moteur explicite. Ne pas confondre lumière précalculée et albedo. Une carte de roughness ne reçoit pas une ombre colorée.

## 4. Animations et mouvement

Végétation : mouvement léger piloté dans le moteur depuis un masque de poids ou la hauteur locale, avec base fixée et variation de phase. Pas de squelette individuel pour chaque arbre/roseau.

PNJ : au plus une pose assise et une boucle idle légère si nécessaire. Une représentation existante est prioritaire ; aucune génération de personnage réaliste obligatoire pour ouvrir les postes.

Les shaders d’eau et leurs paramètres vivent dans le moteur ; Blender fournit éventuellement normales, masques ou textures de référence. Un rendu Cycles magnifique ne prouve pas que le GLB contient cette eau.

## 5. Brief artistique commun

Nature d’étang tempéré, matières naturelles crédibles et proportions lisibles à hauteur de pêcheur. Silhouettes irrégulières, variations modérées, aucune dominante turquoise artificielle. Une famille conserve la même résolution visuelle ; éviter de mélanger arbre photoréaliste, rocher plastique et ponton cartoon.

Prévoir pour chaque asset trois contrôles : isolé, intégré au poste, puis sur écran mobile. Les captures in-game de la carte livrée sont les références de composition, lumière et échelle pour le travail Blender ultérieur.

## 6. Brief réutilisable pour Claude / Blender

« Lis la fiche de l’asset dans `assets_manifest.json` et les captures du poste. Crée uniquement la famille demandée, à l’échelle métrique, avec dimensions/pivot/LOD/texture définis. Respecte le style naturel de FishDex. Livre la source Blender, le script reproductible si applicable, les GLB et textures compatibles avec le loader du projet, et trois vues de contrôle. Vérifie géométrie, normales, UV, matériaux, dimensions et orientation à l’export. Ne change pas le code de pêche, les collisions ou les autres familles ; signale toute dimension qui exige une adaptation de leur registre. »

## 7. Liste des familles

Le tableau ci-dessous est généré depuis le manifest fourni. Les variantes et budgets sont des cibles de départ à ajuster après l’audit de la carte.

| ID | Famille | Priorité | Variantes | Dimensions typiques X × hauteur × profondeur | Triangles LOD0 / 1 / 2 | Texture cible | Postes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `bank_earth` | Berge de terre et racines fines | P0 | 3 | 4 × 1.2 × 2 m | 2200 / 800 / 250 | 1024 px | P01, P02, P03 |
| `bank_rock` | Berge rocheuse basse | P1 | 2 | 4 × 1.3 × 2 m | 2500 / 900 / 250 | 1024 px | P05, P06 |
| `bank_roots` | Berge avec racines exposées | P1 | 2 | 3 × 1.5 × 2 m | 3000 / 1000 / 250 | 1024 px | P04, P06 |
| `pebble_cluster` | Amas de galets | P1 | 3 | 1.2 × 0.15 × 0.8 m | 900 / 350 / 100 | 512 px | P02, P03, P05 |
| `tree_alder` | Aulne de berge | P1 | 3 | 5 × 10 × 5 m | 8000 / 2600 / 500 | 1024 px | P02, P04, P06 |
| `tree_willow` | Saule penché | P1 | 2 | 8 × 9 × 7 m | 9000 / 3000 / 600 | 1024 px | P04, P06 |
| `tree_oak` | Arbre de fond de rive | P1 | 3 | 7 × 14 × 7 m | 8000 / 2200 / 350 | 1024 px | P01, P02, P03, P04, P05, P06 |
| `forest_backdrop` | Groupe forestier lointain | P1 | 2 | 20 × 14 × 4 m | 1400 / 600 / 180 | 1024 px | P01, P02, P03, P04, P05, P06 |
| `shrub` | Buisson bas | P1 | 3 | 1.8 × 1.3 × 1.5 m | 1600 / 600 / 120 | 512 px | P01, P02, P03, P04, P05, P06 |
| `grass_clump` | Touffe d’herbe de rive | P1 | 4 | 0.55 × 0.5 × 0.55 m | 180 / 60 / 12 | 512 px | P01, P02, P03, P04, P05, P06 |
| `reeds` | Touffe de roseaux | P0 | 3 | 1 × 2.2 × 1 m | 750 / 260 / 70 | 1024 px | P04, P02 |
| `sedges` | Laîches / plantes de bordure | P1 | 3 | 0.8 × 0.8 × 0.8 m | 400 / 140 / 40 | 512 px | P02, P04, P06 |
| `lily_cluster` | Amas de nénuphars | P0 | 3 | 1.6 × 0.12 × 1.3 m | 500 / 180 / 40 | 1024 px | P02, P04 |
| `submerged_plants` | Herbiers visibles peu profonds | P1 | 3 | 1.1 × 1.2 × 1.1 m | 650 / 220 / 50 | 512 px | P02, P04 |
| `rock_small` | Pierre de rive | P1 | 4 | 0.65 × 0.45 × 0.55 m | 500 / 180 / 50 | 512 px | P01, P02, P03, P05 |
| `rock_landmark` | Rocher repère | P1 | 2 | 2.6 × 1.6 × 2 m | 2200 / 750 / 200 | 1024 px | P05, P06 |
| `fallen_log` | Tronc tombé partiellement immergé | P0 | 2 | 5 × 0.8 × 1.2 m | 2400 / 800 / 200 | 1024 px | P06 |
| `submerged_branches` | Branches immergées | P0 | 3 | 2.8 × 1.1 × 2 m | 1600 / 550 / 120 | 1024 px | P06 |
| `stump` | Souche de rive | P2 | 2 | 1.2 × 0.9 × 1.1 m | 1800 / 600 / 160 | 1024 px | P04, P06 |
| `pier_deck` | Module de ponton en bois | P0 | 2 | 2 × 0.18 × 2.4 m | 1200 / 400 / 120 | 1024 px | P01 |
| `pier_pile` | Pieux et traverse de ponton | P0 | 2 | 0.25 × 2 × 0.25 m | 500 / 180 / 50 | 1024 px | P01 |
| `path_patch` | Portion de sentier en terre | P2 | 3 | 4 × 0.03 × 1.5 m | 240 / 80 / 20 | 1024 px | P01, P02, P03, P04, P05, P06 |
| `bench` | Banc simple de rive | P2 | 1 | 1.6 × 0.85 × 0.55 m | 2000 / 650 / 150 | 1024 px | P01, P03 |
| `sign_post` | Panneau de repère | P2 | 1 | 0.6 × 1.5 × 0.15 m | 700 / 250 / 60 | 512 px | P01 |
| `angler_proxy` | Pêcheur occupant un poste | P2 | 1 | 0.8 × 1.35 × 0.9 m | 6000 / 2200 / 800 | 1024 px | P04, P06 |
| `floating_leaves` | Petites feuilles de surface | P2 | 3 | 0.18 × 0.005 × 0.12 m | 12 / 4 / 2 | 512 px | P02, P04 |
| `tex_ground_earth` | Terre sèche et humide | P0 | 2 | Selon fiche / sans volume | — | 1024 px | P01, P02, P03, P04, P05, P06 |
| `tex_shore_mud` | Vase et bordure humide | P0 | 2 | Selon fiche / sans volume | — | 1024 px | P02, P04, P06 |
| `tex_sand_gravel` | Sable et gravier | P1 | 2 | Selon fiche / sans volume | — | 1024 px | P02, P03, P05 |
| `tex_grass_ground` | Sol végétalisé | P1 | 1 | Selon fiche / sans volume | — | 1024 px | P01, P02, P03, P04, P05, P06 |
| `tex_wood_weathered` | Bois patiné | P0 | 1 | Selon fiche / sans volume | — | 1024 px | P01, P06 |
| `tex_rock` | Pierre naturelle | P1 | 1 | Selon fiche / sans volume | — | 1024 px | P03, P05, P06 |
| `water_normals` | Normales d’eau répétables | P0 | 2 | Selon fiche / sans volume | — | 512 px | P01, P02, P03, P04, P05, P06 |
| `water_contact_mask` | Masque de contact eau/berge | P0 | 1 | Selon fiche / sans volume | — | 512 px | P01, P02, P03, P04, P05, P06 |
| `fx_ripple` | Atlas de rides locales | P0 | 1 | Selon fiche / sans volume | — | 512 px | P01, P02, P03, P04, P05, P06 |
| `fx_splash` | Atlas gouttes et petit splash | P0 | 1 | Selon fiche / sans volume | — | 512 px | P01, P02, P03, P04, P05, P06 |
| `fx_foam_local` | Mousse de contact locale | P2 | 1 | Selon fiche / sans volume | — | 256 px | P01, P02, P03, P04, P05, P06 |
| `sky_environment` | Ciel et environnement lumineux | P0 | 1 | Selon fiche / sans volume | — | 1024 px | P01, P02, P03, P04, P05, P06 |
| `water_audio` | Familles de sons de contact d’eau | P1 | 6 | Selon fiche / sans volume | — | — | P01, P02, P03, P04, P05, P06 |
| `spot_previews` | Captures in-game des six postes | P1 | 6 | Selon fiche / sans volume | — | 1024 px | P01, P02, P03, P04, P05, P06 |

Chaque entrée JSON ajoute son brief, les formats source/runtime, le pivot, le mouvement et le suivi de production. Les détails de collision et de compatibilité sont à compléter selon le dépôt.
