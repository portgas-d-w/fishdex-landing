# Carte 01 — Étang des Aulnes

Plan proposé, à adapter au terrain déjà livré et aux identifiants existants. Le nom est éditorial, pas un nom de site réel. Dimensions et profondeurs sont des paramètres de conception.

## 1. Échelle et coordonnées

Emprise de travail : 180 × 140 m. Plan d’eau irrégulier d’environ 125 × 90 m, non parfaitement elliptique. Niveau moyen de surface = 0 m. Berges de +0,25 à +1,5 m ; terrain extérieur généralement +0,5 à +4 m. Fond entre −0,3 et −8 m selon la zone.

Convention neutre du plan : X vers l’est, Z vers le nord, Y vertical ; unités en mètres. Adapter cette convention au moteur existant. Le signe de Z pour le nord est un choix cartographique, pas une déclaration sur le système droit/gauche du moteur.

Ne pas modifier la handedness d’une scène existante pour suivre ce dossier. L’import GLB reçoit une conversion unique. Blender travaille normalement avec Z vertical ; l’export et le loader doivent être contrôlés sur un asset étalon, sans double rotation ou miroir.

Le fichier `carte_plan.json` fournit le contour, les ancrages et habitats de départ. Les ancrages sont indicatifs : la hauteur réelle du sol et les collisions décident du placement final. Toute position corrigée doit être répercutée dans le manifest livré.

## 2. Relief et cohérence des données

Plateau littoral : bande de 2–8 m depuis la rive, profondeur progressivement de 0 à 1,5 m. Zone intermédiaire : 1,5–3 m. Cassure au nord-est : passage vers 4–6 m. Fosse centrale/nord-est : maximum 8 m, bord de transition continu. L’anse sud-ouest reste généralement peu profonde.

Une fonction/ressource bathymétrique partagée alimente maillage du fond, sondage, profondeurs affichées, présentations et habitats. Ne pas dessiner une fosse de 8 m tout en faisant croire au gameplay que tout le plan d’eau fait 2 m. Une interpolation continue et une carte de profondeur précalculée peuvent être utilisées, avec version et résolution documentées.

Séparer profondeur mesurée sous le niveau moyen, profondeur instantanée de surface si vagues physiques, hauteur de scion et longueur de ligne. Les micro-rides visuelles ne changent pas arbitrairement la profondeur des populations.

Le contour doit coïncider avec les zones de surface, relief et carte. Un grand plan d’eau masqué par le terrain peut servir au rendu, mais les tests de lancer/effets utilisent le vrai contour et ne créent pas de rides sur la terre.

## 3. Six postes

| Poste | Ancrage horizontal proposé X,Z | Vue vers X,Z | Accès nouvelle partie | Relief et intérêt | Contraintes de production |
| --- | --- | --- | --- | --- | --- |
| P01 Ponton dégagé | 0, −40 | 0, −8 | Ouvert | Bordure 1–2 m, pleine eau plus loin ; initiation | Ponton 8 × 2,4 m depuis la rive sud ; pêche à son extrémité ; réception sur côté libre |
| P02 Anse abritée | −53, −32 | −32, −14 | Ouvert | 0,4–1,8 m, zone calme et petits herbiers | Terre stable, premier plan discret, accès épuisette sans barrière |
| P03 Rive ouverte | 57, −25 | 30, −4 | Ouvert | 1–3 m puis pleine eau ; prospection | Espace arrière pour grande canne ; longueurs de lancer adaptées au bassin |
| P04 Bordure des roseaux | −59, 25 | −37, 17 | Occupé / accès existant Exploration | 0,8–2,5 m, couloirs de végétation | Volume d’accrochage raccordé aux roseaux, voie de réception dégagée |
| P05 Pointe et cassure | 24, 49 | 17, 21 | Accès existant Spécialisation | Plateau puis 4–6 m, fosse plus loin | Rive lisible depuis le nord ; ne pas afficher du vent difficile uniquement décoratif |
| P06 Bois immergé | 64, 20 | 44, 13 | Occupé / accès existant Maîtrise | 1,5–4 m, branches partiellement submergées | Obstacles précis ; chemin de traction viable et réception possible |

Adapter les déblocages aux règles et droits acquis du dépôt. Les conditions existantes priment sur l’invention de nouveaux paliers. Les valeurs de difficulté ne renforcent pas les poissons.

## 4. Contrat d’un poste

Chaque poste définit : identifiant stable/alias, position joueur, hauteur et cible de caméra, champ de vue portrait, angle de lancer autorisé, distance/portée géométrique, microzones, zone de réception, espace arrière de canne, volumes d’obstacles, accès et preview.

La caméra peut légèrement suivre une traction ou un rapprochement, avec limites qui gardent le fil et le point d’eau lisibles. Elle ne franchit pas la berge et ne masque pas les commandes. Prévoir un réglage de mouvement réduit.

La zone de réception doit être atteignable par l’épuisette montée. Les volumes qui concernent le fil sont distincts des simples collisions caméra. L’espace arrière tient compte du recul de grande canne ; ne pas placer un arbre dans cet espace puis simuler une manipulation à travers le tronc.

Les secteurs proposés dans le JSON sont des plages d’angle par rapport à la direction d’eau du poste, à vérifier visuellement. Dépôt court et lancer au moulinet ont des portées différentes. Un trait virtuel sur la carte peut expliquer la zone, mais ne devient pas une grille permanente sur l’eau.

## 5. Habitats et placement

Habitat proche du ponton, anse peu profonde, herbiers, roseaux, eau ouverte, cassure, fosse et bois immergé. Les zones peuvent se recouper. Les profondeurs et volumes réels permettent de choisir le contexte ; les étiquettes seules ne suffisent pas.

Attribuer les espèces à partir des profils présents dans le jeu. L’interface de carte donne deux contraintes concrètes et des indices de milieu ; elle ne révèle pas gratuitement les espèces non découvertes. Les rares robes et grands spécimens suivent les distributions de populations, pas la quantité d’arbres décoratifs.

Placer les nénuphars en amas irréguliers, à proximité de zones peu profondes adaptées ; pas partout au centre de la fosse. Leurs volumes de jeu correspondent au choix de simulation déjà fait pour les herbiers. Les feuilles sont au contact de l’eau, jamais en lévitation.

## 6. Décor lisible de tous les postes

Un sentier simple suggère les connexions terrestres. Masses végétales et repères (ponton, arbre penché, groupe de pierres, pointe) aident à reconnaître les rives. Un arrière-plan forestier léger ferme l’horizon, avec assez de profondeur pour éviter un mur uniforme.

Le joueur change de poste dans la même carte ; les repères visibles depuis une autre rive doivent conserver leurs positions. Ne pas utiliser six décors indépendants contradictoires sans relation spatiale.

Le PNJ occupant un poste est un proxy local léger, éventuellement une silhouette assise avec matériel minimal. Il ne crée pas de multijoueur. Animation décorative simple, aucun cerveau de pêche concurrent requis pour ouvrir la carte.

## 7. Documents à produire dans le dépôt

Configuration finale de carte/postes, fonction ou ressource de profondeur, volumes/habitats, registre de placement avec graines, manifest d’assets réellement utilisés, captures in-game des six postes, matrice fonctionnelle et relevé des performances. Les captures des postes sont remplacées après embellissement sans changer leur ID.
