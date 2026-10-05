# 06 — Carte, eau, assets et poissons

## Stratégie de portage artistique

Récupérer d'abord les sources de la carte Blender et un poisson représentatif. Monter un spot pilote dans Roblox et vérifier lumière, PBR, collisions, tailles, animations, droits et coût de rendu. Étendre ensuite à la carte entière ; ne pas refaire les arbres déjà suffisants ni importer des centaines de variantes sans essai moteur.

La carte possède un vrai lac/étang cohérent, berges accessibles, profondeurs utiles, obstacles et spots prédéfinis. Les habitats et contraintes doivent servir les méthodes. Le ponton, les arbres, roseaux, nénuphars, bois immergés, sols et raccords de berge forment la première base à récupérer. Le nombre exact de spots et leurs IDs vient du dépôt.

Navigation initiale recommandée : carte des spots et accès rapide à un poste, avec exploration locale simple si elle s'intègre au monde. Ne pas ajouter un vaste monde ouvert ou une conduite complexe de personnage pour retarder la pêche. Un poste difficile expose davantage courant, obstacles, portée ou gros poissons ; il ne multiplie pas automatiquement la durée de chaque combat.

## Formats et ownership

| Asset | Source à conserver | Export de travail |
| --- | --- | --- |
| Poisson animé | .blend, textures, rig et clips nommés | .fbx ou .gltf validé avec rig/animations |
| Prop/arbres/plantes/quai | .blend ou source originale et licence | .fbx/.gltf ; .obj seulement pour statique simple adapté |
| Textures et UI | Source originale et provenance | PNG/JPG selon alpha et usage, puis asset Roblox |
| Sons | Source et licence | WAV/OGG ou autre format admis validé |
| Scène/terrain | Sauvegarde Studio et script/manifest de reconstruction si utilisé | .rbxl/.rbxlx et modèles selon workflow retenu |

Roblox importe notamment FBX/glTF avec rigs, animation et PBR. Voir S08. Prévoir conversion des GLB historiques depuis leurs sources, sans supposer leur compatibilité identique à celle du moteur web. Un matériau procédural Blender doit être adapté/baké ; un shader web ne suit pas l'import.

Importer au nom du même propriétaire que l'expérience, vérifier droits d'usage et accès aux IDs en test et stable. Le manifest contient chemins source, licence, export, modèle Roblox, textures, animations, statut de modération et preuve de lecture dans le jeu publié. Aucun ID fictif n'est un asset intégré.

Budget initial proposé, à adapter après mesures : poissons courants 3 000–8 000 triangles visibles, hero 8 000–15 000 si utile, variantes LOD moins coûteuses ; texture courante 512–1 024, poisson montré en gros plan jusqu'à 2 048 si justifié ; matériaux peu nombreux. Ce sont des budgets artistiques de départ, pas des limites Roblox universelles. Vérifier les exigences actuelles de l'importateur et découper correctement si nécessaire.

## Animations poissons

Contrat d'usage : nage calme, nage soutenue, virage/transition de direction, poussée/debat aquatique, fatigue, réception, respiration/debat hors de l'eau avec intensité adaptée, aquarium. Il n'est pas nécessaire de fabriquer un fichier distinct pour chaque état si un blend/clip partagé produit un résultat crédible.

Conserver morphologie et locomotion : pas de poisson rigide translaté ni de nage identique pour toutes les familles. Apparences partagent un rig lorsque la morphologie le permet ; les variantes ne deviennent pas des espèces biologiques sans raison. Ne pas dupliquer inutilement un modèle complet pour une recoloration. Un modèle temporaire est déclaré dans la matrice ; l'objectif final reste tous les poissons.

## Eau et événements

Point de départ recommandé : eau Terrain Roblox et rendu natif, complétés par effets localisés, tant que le pilote apporte la qualité nécessaire. Étudier une surface spécialisée seulement si un manque précis est démontré. Ne pas superposer partout plusieurs grandes surfaces transparentes, ni promettre de porter à l'identique un shader Babylon.

Rendre cohérents couleur selon profondeur, lecture des berges, réflexion disponible, vagues modérées, vent, végétation et lumière. Les reflets et transparences sont évalués dans le moteur réel ; une belle capture Blender ne suffit pas.

| Événement | Retours nécessaires |
| --- | --- |
| Dépôt/lancer | Impact à la bonne position, rides amorties, son, objet qui pénètre réellement la surface |
| Flotteur posé | Flottaison, dérive, oscillation et profondeur cohérentes avec montage |
| Touche/ferrage | Signal dépendant du poisson et du montage ; mouvement d'eau et de ligne crédible |
| Départ/sprint | Sillage/remous localisés ; poisson pas révélé systématiquement |
| Retour/approche | Eau lisible au bord, déplacement et visibilité plausible |
| Réception/relâche | Splash proportionné, rides puis extinction, transition du poisson |
| Vent/pluie | Réponse modérée de surface et impacts proches, sans avalanche de particules |
| Courant | Dérive des éléments appropriés et effet réel sur la présentation |

Les événements de simulation alimentent les effets ; aucun effet seul ne modifie la récompense. Réutiliser des pools, limiter distances et durées, adapter densité à la qualité, nettoyer en sortie de spot. Éviter les boucles par particule/poisson chaque frame sans nécessité.

## Qualité et streaming

Trois profils : console/PC confortable ; console modérée ; mobile allégé. Les règles et indices indispensables sont identiques. Variations : ombres, densité des plantes, FX, distance de décor et détails secondaires. Ne pas retirer le fil ou une touche essentielle au profil mobile.

Étudier le streaming pour les cartes plus grandes : les IDs métier/habitats restent sur le serveur, les assets éloignés peuvent se décharger. Le chargement d'un poisson ou d'un aquarium ne doit pas charger tout le catalogue. Voir S11. Chaque modèle, texture et connexion a une durée de vie gérée.
