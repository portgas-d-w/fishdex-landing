# FishDex — Assets gratuits pour la première carte

Sélection vérifiée sur les pages des auteurs le 3 octobre 2026.

## Le choix recommandé

Construire une base naturelle : bois patiné, terre brune, vase humide, verts modérés et quelques pierres moussues. Garder la DA Basalte & Turquoise pour les menus ; le paysage garde les couleurs de son milieu. La sélection est destinée au jeu navigateur/mobile existant et ne demande aucun abonnement supplémentaire.

La meilleure première étape est de texturer et composer correctement les meshes actuels, puis de remplacer seulement les silhouettes insuffisantes. Le pack Quaternius constitue une base texturée légèrement stylisée, pas un ensemble photoréaliste de végétaux français. Quelques rochers réalistes peuvent enrichir le premier plan après optimisation.

Ce dossier contient des liens et des consignes. Les archives des créateurs ne sont pas téléchargées ici et aucun GLB n’a été intégré ou mesuré dans le jeu. Les formats et chiffres annoncés sont ceux des pages sources ; seuls les tests dans le dépôt confirmeront le coût final sur iPhone.

## Licence

Les ressources retenues sont annoncées sous CC0 : usage commercial et modification autorisés, sans attribution obligatoire au titre de cette licence. Conserver tout de même la provenance et la licence de chaque fichier effectivement intégré. Cela s’applique aux assets téléchargés, pas à tous les contenus du site : logos, textes et certains aperçus de Poly Haven ne sont pas inclus dans la licence de ses assets. Produire les captures de présentation dans le jeu.

Sources : [CC0 en français](https://creativecommons.org/publicdomain/zero/1.0/deed.fr), [licence Poly Haven](https://polyhaven.com/license), [licence ambientCG](https://docs.ambientcg.com/license/), [FAQ Quaternius](https://quaternius.com/faq.html). Les fiches OpenGameArt/Kenney indiquent leur licence individuellement.

## Téléchargements à privilégier

1. T01–T06 : six matériaux, en **1K**. Couleur + normal OpenGL + roughness ou ORM ; les height/displacement ne sont pas nécessaires à cette première passe.
2. A01 : ciel **HDR 1K**, à convertir/préfiltrer pour le moteur.
3. M01 : pack Quaternius **glTF** ; importer une petite sélection de feuillus, buissons, herbes et rochers. Son miroir poly.pizza annonce également des GLB.
4. M02 et M03 : les petites archives **reed.zip** et **waterlily.zip**, à convertir en GLB.
5. M04 seulement si le ponton actuel ne convient pas : archive **woodendock_fbxgltftextures.zip**. Extraire les pièces choisies, pas toute la scène.

Commencer par ce panier. Les options/alternatives suivantes servent à remplacer un choix ou ajouter un détail utile, pas à gonfler automatiquement le téléchargement mobile.

## Catalogue

Les identifiants ci-dessous correspondent à `selection_assets.json` et à la couverture des 40 familles. « Base » signifie ressource proposée pour la première passe ; cela ne signifie pas prête à charger sans contrôle.

### Ressources de base

| ID | Ressource et source | Usage | À télécharger / contrôler |
|---|---|---|---|
| T01 | [Forest Ground 04](https://polyhaven.com/a/forest_ground_04) — Rob Tuytel; Rico Cilliers | Terre sèche, talus et sentier | Choisir 1K. Le matériau représente une zone de 3,2 m ; adapter les UV à l’échelle plutôt qu’étirer sur toute la carte. |
| T02 | [Brown Mud 02](https://polyhaven.com/a/brown_mud_02) — Rob Tuytel | Vase et contact de berge humide | Choisir 1K ; petites plages locales, pas une bande brillante uniforme. Échelle annoncée : 1,3 m. |
| T03 | [Leafy Grass](https://polyhaven.com/a/leafy_grass) — Charlotte Baglioni | Sol végétalisé et transitions sous les arbres | Choisir 1K ; texture de sol, pas des brins d’herbe 3D. Échelle annoncée : 2 m. |
| T04 | [Pebble Ground 01](https://polyhaven.com/a/pebble_ground_01) — Rob Tuytel | Petites plages de gravier de rive | Choisir 1K ; matière de sol, ne crée pas de galets en volume. Échelle annoncée : 1,5 m. |
| T05 | [Wood Planks Dirt](https://polyhaven.com/a/wood_planks_dirt) — Rob Tuytel | Habiller le ponton actuel si son mesh convient | Choisir 1K. Présence de traces de peinture ; contrôler l’aperçu dans la scène. Échelle annoncée : 2 m. Ne pas appliquer aveuglément sur le trimsheet du pack de ponton. |
| T06 | [Bark Willow 02](https://polyhaven.com/a/bark_willow_02) — Charlotte Baglioni | Écorce d’un saule existant, troncs et bois immergé provisoire | Choisir 1K. L’écorce ne transforme pas un arbre générique en saule. Échelle annoncée : 2,2 m. |
| M01 | [Ultimate Stylized Nature Pack](https://quaternius.com/packs/ultimatestylizednature.html) — Quaternius | Feuillus génériques, buissons, herbes, rochers et arbres morts | 63 modèles annoncés. Pack texturé ; base intermédiaire légèrement stylisée. Sélectionner quelques modèles cohérents, exclure palmiers. Triangles par modèle et matériaux à mesurer après téléchargement. Ne garantit pas des aulnes, saules ou chênes exacts. |
| M02 | [LowPoly Reed](https://opengameart.org/content/lowpoly-reed) — Aredon | Touffes de roseaux et masses végétales de bordure | Archive reed.zip annoncée 140,2 Ko. Convertir en GLB ; textures et nombre de triangles à inspecter. Vérifier si la forme est celle d’une massette ou d’un roseau, garder une désignation botanique honnête. |
| M03 | [LowPoly Waterlily](https://opengameart.org/content/lowpoly-waterlily) — Aredon | Nénuphars proches de l’anse et des roseaux | Archive waterlily.zip annoncée 252,9 Ko. Convertir en GLB ; recoloration et matériau possibles. Pas de triangle supposé avant inspection. |
| M04 | [Modular Wooden Docks](https://opengameart.org/content/modular-wooden-docks) — loafbrr_1 | Ponton, modules et petits éléments bois utilisables | Prendre woodendock_fbxgltftextures.zip (95,8 Mo annoncés), pas le projet Godot. Le pack décrit 176 objets, 15 matériaux et 15 856 triangles ; valeurs globales de l’auteur, pas le coût du ponton final. Extraire seulement les pièces nécessaires ; contrôler et réduire les matériaux. |
| A01 | [Kloofendal 48d Partly Cloudy (Pure Sky)](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) — Greg Zaal; Jarod Guest | Ciel, ambiance et base de réflexion de l’eau | Choisir HDR 1K. Ciel seul ; pas de montagnes africaines à afficher dans l’étang. Préfiltrer pour le moteur ; adapter la direction et l’intensité du soleil. |

### Finitions facultatives

| ID | Ressource et source | Usage | À télécharger / contrôler |
|---|---|---|---|
| T07 | [Aerial Grass Rock](https://polyhaven.com/a/aerial_grass_rock) — Rob Tuytel | Roche avec mousse, grands talus minéraux | Choisir 1K. Texture de grande surface (15 m annoncés) : contrôler la fréquence du détail sur un petit rocher. |
| T08 | [Coast Sand 01](https://polyhaven.com/a/coast_sand_01) — Rob Tuytel | Une bordure sableuse si le terrain la justifie | Choisir 1K ; sable brun humide, ne pas transformer tout l’étang en plage littorale. Échelle annoncée : 15 m. |
| T09 | [Bark Brown 02](https://polyhaven.com/a/bark_brown_02) — Poly Haven; auteur à relever lors du téléchargement | Alternative d’écorce pour un tronc générique | Choisir 1K ; variante de matière, pas besoin de la charger avec T06 si elle n’apporte rien. |
| M05 | [Park Bench](https://opengameart.org/content/park-bench) — Teh_Bucket | Un banc près de l’accès ou d’une rive ouverte | Deux versions annoncées : environ 2 000 et 900 triangles. Le modèle en fonte évoque un parc aménagé ; garder un banc existant en bois si cela convient mieux. |
| M06 | [Rock Moss Set 01](https://polyhaven.com/a/rock_moss_set_01) — Kless Gyzen | Quelques rochers proches pour une finition plus réaliste | Six pierres ; environ 63 000 triangles affichés pour l’ensemble. Choisir le fichier glTF à textures 1K, isoler 1–2 variantes puis optimiser. Le 1K ne réduit pas la géométrie. |
| M07 | [Tree Stump 01](https://polyhaven.com/a/tree_stump_01) — Rob Tuytel | Une souche proche du bois immergé | Environ 41 000 triangles affichés ; trop détaillé pour multiplier le modèle brut. Réduire et créer des LOD en conservant silhouette et UV. |
| F01 | [Particle Pack](https://kenney.nl/assets/particle-pack) — Kenney | Masques de particules pour gouttes et petites réactions d’eau | 80 fichiers en 512 × 512 annoncés. Choisir 1–3 masques utiles après inspection. Ce pack n’est ni une eau 3D ni un ensemble complet d’animations de pêche. |

### Alternatives

| ID | Ressource et source | Usage | À télécharger / contrôler |
|---|---|---|---|
| B01 | [Nature Kit](https://kenney.nl/assets/nature-kit) — Kenney | Solution de secours pour silhouettes de végétation | 330 fichiers annoncés, CC0. Style plus géométrique ; ne pas cumuler avec M01 par défaut. Formats exacts et triangles non vérifiés dans l’archive. |
| B02 | [Lily Pads](https://opengameart.org/content/lily-pads) — Starry Skydancer | Alternative de nénuphars avec LOD | Version contenant LOD et collision selon l’auteur, mais modèles à texturer et modificateurs solidify à appliquer. Retenir une forme Nymphaea ; Victoria évoque un autre milieu. |
| B03 | [Ground 037](https://ambientcg.com/view?id=Ground037) — ambientCG / Lennart Demes | Alternative de sol moussu et humide à T03 | Téléchargement 1K-PNG conseillé pour les données ; échelle ca. 2,1 × 2,1 m. Alternative, pas une couche supplémentaire obligatoire. |
| B04 | [Grass 004](https://ambientcg.com/view?id=Grass004) — ambientCG / Lennart Demes | Herbe courte près d’un accès entretenu | 1K-PNG ; aspect pelouse, moins adapté à une berge sauvage. Échelle ca. 1,4 × 1,4 m. |
| B05 | [Planks 038](https://ambientcg.com/view?id=Planks038) — ambientCG / Lennart Demes | Alternative de bois moussu pour zone humide | 1K-PNG ; échelle ca. 1,1 m × 0,55 m. Ne pas couvrir tout le ponton de mousse si le matériau devient visuellement glissant. |

## Choix écartés et limites utiles

- **Tree Small 02, Poly Haven** : la fiche affiche environ **5 millions de triangles**, et décrit une espèce *Burkea africana*. Ce n’est ni un arbre français exact, ni une ressource à charger brute sur mobile. [Source](https://polyhaven.com/a/tree_small_02). Non inclus dans le manifeste de téléchargement recommandé.
- **Stylized Nature MegaKit récent** : l’auteur distingue une partie gratuite et une partie supplémentaire payante. Le panier choisit le pack gratuit de 2022, pas une édition complète payante. [Source](https://quaternius.com/packs/stylizednaturemegakit.html).
- Le saule penché, l’aulne et le chêne exacts de notre plan ne sont pas garantis par un pack de feuillus génériques. Garder des proxies cohérents et réserver leur remplacement à un travail spécifique.
- Les racines de berge, les herbiers immergés exacts, le pêcheur assis et les sons ne disposent pas tous d’une ressource prête validée dans cette sélection. `COUVERTURE_40_FAMILLES.md` rend ces limites explicites et propose des solutions avec les éléments actuels.
- Une archive de ponton de 95,8 Mo ou un modèle de souche détaillé n’est pas le budget transféré aux joueurs : le jeu doit servir seulement les modèles exportés et optimisés réellement nécessaires.
- Aucun shader « eau Unreal » n’est fourni. Normales et petits masques peuvent être produits par code gratuitement ; le rendu d’eau et ses interactions restent des systèmes du moteur.

## Formats simples

- Modèles de jeu : **GLB / glTF 2.0** ; `.blend`, `.fbx`, `.obj` servent à préparer un export lorsque nécessaire. Une archive Godot/Unity/Unreal n’est pas le bon livrable du navigateur.
- Matériaux : télécharger la source 1K en PNG pour normales/données ; JPEG possible pour la couleur opaque. Couleur en sRGB, données en linéaire. Normale tangent OpenGL (+Y), à vérifier dans le loader.
- ORM : rouge = occlusion, vert = roughness, bleu = metallic. Le bois, les feuilles, la terre et la roche restent non métalliques. Vérifier les canaux du fichier au lieu de supposer d’après son nom.
- Feuillages : masque alpha propre, mipmaps, double face seulement si nécessaire. Éviter les grandes cartes transparentes superposées.
- KTX2, Meshopt ou Draco sont des options après vérification des extensions et décodeurs du moteur installé. La compression géométrique ne remplace pas la réduction des triangles. Le format WebP seul ne garantit pas une économie de mémoire GPU.

## Dossier de travail

Lire `DEMARRER_AVEC_CODEX.md`, puis `INTEGRATION_ET_RECETTE.md`. `selection_assets.json` sert de registre des sources, et `couverture_familles.json` relie chaque besoin du plan à une décision. Les IDs de carte et les ressources déjà bonnes du dépôt restent prioritaires.
