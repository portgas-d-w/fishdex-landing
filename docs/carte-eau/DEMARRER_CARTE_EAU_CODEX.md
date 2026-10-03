# FishDex — Première carte complète et eau interactive

Consigne de production du 3 octobre 2026. À exécuter dans le dépôt actuel du jeu. Ce dossier prépare l’implémentation ; il ne contient pas de carte 3D ni de modèles terminés.

## 1. Mission

Créer la première carte de pêche complète, belle et jouable sur navigateur mobile : un étang naturel avec six postes distincts, relief du fond, habitats, obstacles, accès et réception. Construire une eau particulièrement soignée, avec reflets, profondeur apparente et événements synchronisés à la pêche. Préparer un registre d’assets permettant de remplacer ensuite les décors provisoires par des modèles Blender de meilleure qualité.

Livrer toute la carte pendant cette tâche, avec les ressources actuelles et des objets provisoires par code. La production des assets finaux est un chantier ultérieur : elle ne bloque pas le terrain, les postes, l’eau, les interactions ou le déploiement.

Les chantiers poissons et méthodes sont terminés selon le joueur. Auditer leur état réel et utiliser leurs identifiants, profils et systèmes. Le chantier récent `CHANTIER_GAMEPLAY_MOBILE_MATERIEL_CODEX.md` définit les interactions ; conserver sa logique. Si un autre agent travaille dans le dépôt, se coordonner via le relais et des changements isolés, sans écraser ses fichiers. Ne pas reconstruire le catalogue ni remettre en chantier ses imports.

## 2. Lecture et autorité

Lire ce fichier, puis `CARTE_01_PLAN_TECHNIQUE.md`, `EAU_EVENEMENTS_QUALITE.md` et `ASSETS_A_CONCEVOIR_BLENDER.md`. Les JSON associés sont des données de conception et des contrats proposés, pas des fichiers à importer aveuglément.

Le relais et le dépôt décrivent ce qui existe effectivement. Ce dossier fait autorité sur la nouvelle carte, son pipeline de remplacement et la qualité visuelle visée. Les interactions et la progression existantes restent applicables, avec conservation des droits acquis.

Tous les chiffres de dimensions, budgets, fréquences et durées sont des objectifs de prototype à vérifier. Réajuster avec justification dans le relais lorsqu’une mesure ou une contrainte du dépôt le nécessite. Aucun budget générique ne garantit les performances sur un téléphone.

## 3. Audit initial indispensable

Relever : moteur et version, coordonnées/échelle, rendu de l’eau, gestion des postes/caméras, relief et collisions, flotteur/leurres, trajectoires de fil, poissons, animation, éclairage, sauvegarde, mode développement et hébergement autorisé.

Identifier les scènes déjà construites et réutilisables. Si une première carte existe, la compléter et l’améliorer plutôt que créer un second monde incompatible. Réutiliser l’ID du plan d’eau et des postes existants lorsque leur rôle est conservé ; sinon prévoir une table d’alias/migration.

Mesurer avant modification : images/s et temps de frame, résolution interne, nombre d’appels de dessin, triangles visibles, textures, taille transférée à froid, chargements et comportement après plusieurs changements de poste. Noter l’appareil réellement utilisé et les mesures non accessibles.

Ne pas changer de moteur, de framework, d’hébergement ou de système de sauvegarde pour cette tâche. Les recommandations Babylon.js s’appliquent si c’est le moteur effectivement présent ; sinon adapter les fonctions à l’existant sans ajouter un second moteur.

## 4. Direction artistique de la carte

Une nature crédible, lisible et apaisante : eau olive/bleu-vert selon profondeur et ciel, sol humide sombre, végétation verte avec variations, bois patiné, pierres mates. L’interface conserve Basalte & Turquoise ; le décor ne reçoit pas une teinte turquoise globale.

Éviter les arbres en boules uniformes, les berges parfaitement circulaires, les pontons démesurés, les matériaux brillants sur la terre et les textures trop répétitives. Composer les premiers plans sans masquer le fil, le flotteur ou la réception. Les six postes ont une identité par la composition et leurs contraintes, pas seulement une nouvelle caméra devant le même décor.

Privilégier la qualité de l’eau et des berges visibles, puis la lumière, les silhouettes végétales et les accessoires. Les objets lointains sont moins détaillés. Des approximations visuelles sont acceptables si elles restent cohérentes lorsque le joueur change de poste.

## 5. Carte entièrement fonctionnelle

Construire le contour irrégulier, terrain extérieur, fond immergé, plateau peu profond, cassure, fosse, bois immergé, végétation de bordure, ponton et zones dégagées. Ajouter six ancrages joueur/caméra, secteurs de lancer ou dépôt, zones de réception et volumes d’obstacles.

Une vue simplifiée de la carte permet de sélectionner le poste. Pas de déplacement libre obligatoire pour cette première version. Les transitions changent la position réelle de pêche et les informations locales ; elles ne sont pas un simple changement d’image.

Les postes réutilisent les systèmes d’accès existants. Trois postes de départ restent ouverts pour une nouvelle sauvegarde ; les autres peuvent être occupés par un pêcheur avec condition explicite de libération permanente. Conserver tous les accès déjà acquis. En mode développement, les six postes sont accessibles.

Chaque poste est utilisable depuis préparation jusqu’à capture. Le choix de poste est interdit tant qu’un montage est engagé dans l’eau ou un combat actif, selon la règle existante : proposer de récupérer, ne pas perdre silencieusement le montage. La consultation d’un menu de pause ne poursuit pas la simulation en arrière-plan.

Raccorder profondeur/habitat à la présentation, aux populations et au sondage. Les poissons présents proviennent du catalogue réel du jeu et des habitats compatibles. Ne pas placer toutes les espèces dans cet étang ni transformer un contexte lacustre en rivière pour y faire entrer artificiellement toutes les méthodes.

Les autres contextes déjà implémentés pour rivière, traîne ou techniques particulières restent accessibles. Une méthode inadaptée à ce poste reçoit une explication, pas une simulation incohérente ni une suppression du catalogue.

Les difficultés des postes viennent d’obstacles, de géométrie, de profondeur et des populations. Ne pas multiplier la force intrinsèque du même poisson selon le poste. N’afficher une contrainte de vent/courant que si elle agit réellement sur le gameplay.

## 6. Eau : qualité prioritaire et budget contrôlé

Construire le meilleur rendu réalisable dans le budget mobile, selon `EAU_EVENEMENTS_QUALITE.md`. Comparer le matériau existant, le matériau d’eau fourni par le moteur et un shader dédié léger. Choisir sur une scène représentative et documenter le choix ; un shader plus complexe n’est pas automatiquement meilleur.

Obligatoires : animation douce non répétitive à court terme, réponse à l’angle de vue, variation de couleur avec profondeur, contact propre avec la berge, reflets crédibles, lisibilité des objets utiles et événements issus de la simulation. Les profils haut/moyen/bas changent la fidélité, pas les conséquences de pêche.

Les signaux du fil et du poisson restent prioritaires. Une eau opaque peut masquer naturellement un poisson profond ; elle ne doit pas masquer tout flotteur en surface ni présenter une fausse détension de fil. Réduire les reflets localement via un réglage visuel global cohérent plutôt que mettre un halo artificiel permanent sur le flotteur.

## 7. Lumière et ambiance

Livrer une ambiance principale « matin doux » et deux réglages de contrôle, jour couvert et fin de journée, pour vérifier la lisibilité. Si le jeu possède déjà heure/météo, utiliser ses valeurs. Sinon, ces réglages sont des variantes visuelles en développement ; ne pas inventer un cycle de progression ou une météo influençant les poissons.

Une lumière directionnelle principale, lumière d’environnement, exposition et contraste réglés ensemble. Ombres dynamiques réservées à des objets importants et une zone utile ; occlusion/précalcul pour les décors immobiles si les outils existent. Ne pas attendre Blender pour livrer un éclairage crédible avec les objets actuels.

Préparer le pipeline de lightmaps pour les assets futurs, avec UV distincts et affectation explicite dans le moteur. Les lightmaps ne se transmettent pas automatiquement par simple export GLB. Un éclairage précalculé fixe doit être adapté ou désactivé si une autre heure de journée le contredit.

Brume légère dans la distance pour relier les plans ; éviter un volumétrique coûteux indispensable au rendu. Mouvement subtil de végétation selon un vent visuel partagé. Si le vent a aussi un effet de jeu, les deux utilisent la même source.

## 8. Assets remplaçables après livraison

Construire un registre par identifiant stable avec ressource visuelle, version, dimensions attendues, pivot, niveau de détail, matériaux, collisions et sockets d’interaction. Le code de pêche référence l’identifiant, pas un chemin GLB dispersé dans plusieurs fichiers.

Les objets provisoires ont déjà les bonnes proportions et points d’ancrage. Chaque instance de ponton/obstacle/épuisette conserve son rôle lorsque la ressource visuelle change. Garder la logique de collision indépendante des détails artistiques ; adapter explicitement le volume lorsque les dimensions changent.

Le registre charge un GLB final s’il existe et est valide, sinon utilise la représentation actuelle sans écran cassé. Il signale ce remplacement dans les outils de développement, pas dans le HUD joueur. Éviter de recharger toutes les ressources lorsqu’une seule famille est remplacée.

La liste en JSON et son tableau servent au chantier Blender ultérieur. À la fin de cette tâche, Codex doit les actualiser à partir de ce qu’il a réellement placé : asset déjà satisfaisant, amélioration requise, quantités, dépendances, captures de référence et priorité. Ne pas demander au joueur de fabriquer des modèles pour terminer la carte.

## 9. Budget mobile et ressources

Cible principale : navigateur Safari sur iPhone 14 Pro, plus navigateur desktop pour contrôle. Viser un rendu stable à 30 images/s minimum, 60 lorsque possible, pendant combat et effets. Contrôler aussi la tenue après plusieurs minutes ; un pic à froid ne prouve pas la fluidité durable.

Budgets initiaux, non garantis :

| Mesure | Profil standard proposé |
| --- | --- |
| Triangles visibles du décor, hors passe de reflets | Environ 100 000–220 000, à ajuster par mesures |
| Appels de dessin totaux de la frame, reflets/ombres compris | Objectif 120–180 maximum ; observer le coût réel |
| Lumières dynamiques créant des ombres | Une principale, liste de casteurs limitée |
| Textures | 512/1024 courantes ; 2048 pour rares éléments proches justifiés |
| Poids transféré spécifique à la première carte | Objectif 15–25 Mio à froid, hors code du jeu et catalogue non chargé |
| Résolution interne | Adaptative, sans obligation d’utiliser toute la densité physique de l’écran |
| Particules et événements simultanés | Pools bornés et priorités, voir profils d’eau |

Le budget de triangles ne couvre pas l’overdraw des feuillages et particules : mesurer les deux. Grouper les végétaux instanciés par zones spatiales pour ne pas rendre toute la forêt à cause d’une boîte englobante géante. Réutiliser maillages et matériaux, LOD et atlas.

Limiter les transparences superposées, les passes plein écran et les cascades d’ombres. Charger les détails du poste proche à la demande, garder le fond commun léger, libérer proprement ressources/observateurs/sons inutilisés. Utiliser les codecs déjà disponibles ; n’ajouter compression avancée que si son poids et son coût de décodage apportent un gain mesuré.

Ne pas convertir les textures de normales/roughness avec un outil qui applique une correction de couleur. La compression du téléchargement et la mémoire GPU sont deux mesures différentes. Le poids du GLB ne suffit pas à qualifier sa légèreté.

## 10. Outils de développement et captures

Ajouter un panneau fermé par défaut : poste, profils de qualité, ambiance, scène d’eau au repos, événements déclenchables, graine, affichage habitats/profondeurs/obstacles/secteurs, compteur d’effets, timings de rendu et ressources. Aucun compteur technique dans le HUD normal.

Les scénarios forcés sont séparés de la progression normale. Ils permettent une comparaison à conditions identiques. Produire les six vignettes de poste depuis le jeu, interface masquée, avec recadrage horizontal et portrait si utile. Aucune illustration générée de faux spot.

Produire un relevé avant/après du rendu, avec même caméra et ambiance. Conserver les captures dans la documentation du dépôt et les associer aux familles d’assets restant à embellir.

## 11. Ordre de travail

1. Audit du dépôt, mesures de référence et correspondance des identifiants.
2. Terrain/fond, six postes, ancrages, accès, habitats et volumes de jeu.
3. Eau de base crédible, profondeur/berges et lumière du spot de référence au ponton.
4. Événements d’eau raccordés au gameplay et trois profils de qualité.
5. Extension du rendu aux cinq autres postes ; végétation, détails provisoires et réception.
6. Registre d’assets, remplacement à chaud contrôlé, manifest actualisé et captures de postes.
7. Vérifications fonctionnelles, performance, migration, relais et déploiement autorisé.

Valider la composition au ponton avant d’étendre les détails, mais poursuivre jusqu’à la carte entière. Aucun lot de cette liste ne constitue un arrêt après une seule rive.

## 12. Critères de livraison

- Six postes distincts, carte de sélection, transitions, secteurs et zones de réception fonctionnels.
- Relief, habitats, sondage, rencontres et obstacles cohérents avec l’espace réellement visible.
- Eau lisible et soignée depuis les six postes et les ambiances de contrôle.
- Tous les événements applicables de la matrice d’eau ont un déclencheur réel ou une raison explicite de non-applicabilité ; aucun simple bouton de démonstration présenté comme intégration.
- Variantes qualité testées ; même gameplay et mêmes signaux essentiels dans tous les profils.
- Première capture et combat complet possibles au ponton ; autres postes fonctionnels avec contenus compatibles.
- Catalogue, achats, captures, XP, fonds, favoris et accès acquis conservés ; aucun effet forcé donnant une récompense normale.
- Changer de poste dix fois ne crée pas dix surfaces d’eau, dix ambiances sonores ou des listeners accumulés.
- Menus défilables et champs éditables ; commandes tactiles et état de pause conformes à la consigne du dépôt.
- Liste d’assets future avec formats, dimensions, pivots, budgets, priorités et tâches Blender actualisée selon la carte livrée.
- Vérifications du projet exécutées ; mesures avec appareil/résolution/profil/durée indiqués. Les tests iPhone absents sont nommés « à tester sur appareil », jamais simulés dans le compte rendu.

Déployer sur le projet Vercel du jeu déjà autorisé, conformément aux instructions du dépôt. Ne pas toucher à l’application source FishDex, ni publier sur un autre projet. Mise à jour du relais : fichiers/règles changés, matrice des postes/événements, ressources provisoires, mesures, résultats de vérification, procédure de test et URL/version réellement déployées.

## 13. Instruction de lancement

« Lis ce dossier et le relais du dépôt. Implémente la première carte complète à six postes, son eau et tous les événements applicables. Utilise les poissons et méthodes déjà présents. Termine la carte avec des décors provisoires remplaçables, sans attendre les futurs assets Blender. Actualise leur liste selon ta livraison, vérifie le gameplay et les performances, puis déploie sur le projet du jeu autorisé. »
