# 07 — Lots jusqu'au portage complet

Le premier jalon jouable n'est pas la fin du contrat. Les lots sont successifs, avec commits et relais. Lorsque le matériel console manque, la validation matérielle reste en attente et Claude continue les tâches indépendantes ; aucune case n'est cochée sans preuve.

| Lot | Travail | Critère de sortie |
| --- | --- | --- |
| 0 — Sauvegarde et audit | Relais Codex, état des branches, matrices contenu/assets/fonctions, sources et export des données | Aucune perte, vrai inventaire et stratégie de migration documentés |
| 1 — Fondation Roblox | Nouveau projet, Studio/MCP, Git/Rojo, une scène, contextes d'entrée, test privé et profil dev protégé | Build reproductible, scène ouverte, manette détectée, IDs réels et accès de test documentés |
| 2 — Première pêche complète | Spot pilote, moulinet, quelques poissons, lancer, présentation, touche, combat, réception, argent/XP/collection, sauvegarde | Partie jouable sans souris ; capture normale conservée après reconnexion ; récompense unique |
| 3 — Contrôleurs et préparation | Ligne fixe, kit/élastique et récupération manuelle ; Ma canne, atelier, stock, compatibilité et casse | Pas de récupération fictive ; pièces placées changent la présentation ; annuler ne duplique pas |
| 4 — Toutes les méthodes | Couvrir les 22 IDs de référence et les entrées réelles supplémentaires ; contextes rivière/profondeur/bateau | Chaque méthode possède une boucle complète jouable et une validation, même via zones test dédiées |
| 5 — Monde et bestiaire | Toute première carte, tous les spots audités, poissons/profils/images/variantes et modèles disponibles ; eau/FX | Aucun contenu courant perdu, population plausible, événements eau reliés au gameplay et ressources accessibles |
| 6 — Jeu complet | Boutique catégorisée, progression, quêtes, maîtrise, FishDex, carnet, aquarium et aide | Tout le parcours normal est navigable manette et sauvegardé ; pas seulement des écrans de façade |
| 7 — Équilibrage et compatibilité | Parcours neufs et avancés, économie, réglages, profils graphiques, PC/mobile secondaire, réseau | Rapports de rythme/risques/prix ; tests ciblés et limites identifiées ; pas de contamination dev |
| 8 — Livraison et sortie | Recette matérielle, correction, version stable privée, dossier de sortie public et retour arrière | Versions identifiées, preuves de tests, méthode de publication et restauration, décision publique prête |

## Détail du jalon 2

Un spot cohérent, au moins une canne à moulinet et trois profils de poisson contrastés déjà disponibles, choisis après audit. Le joueur choisit son appât/méthode compatible, lance à un endroit utile, observe la touche, mène un combat à direction et récupération, reçoit la prise, voit son spécimen et retrouve la prise dans la collection après retour au jeu.

Inclure scénario de casse/décrochage, argent à zéro et récupération du kit gratuit. Ne pas seulement forcer une animation de prise réussie. Les essais guidés ont un profil dev distinct, sans récompense normale.

## Boucles représentatives au jalon 3

Ligne fixe sans longueur de fil supprimée ; moulinet qui prend d'abord le mou et surcharge ensuite si forcé ; grande canne qui recule puis déboîte au raccord ; récupération manuelle bornée et transition explicite au moulinet. Une méthode utilisant ces systèmes choisit le bon contrôleur par capacités.

## Contenu et production 3D

Porter tôt toutes les données utiles, puis activer les contenus quand leurs contextes et assets sont réellement jouables. Les placeholders acceptables sont listés avec remplacement prévu ; ils ne constituent pas une production 3D « terminée ». Réutiliser les modèles du pack autorisé au début. Le chantier Blender des poissons est adapté à Roblox et intégré par familles pour ne pas bloquer la mécanique sur la fabrication de tout le bestiaire.

## Discipline de livraison

À chaque lot : tâches réalisées, chemins/commit, tests exécutés, captures utiles, blocages, prochaine action. Un échec de test antérieur est distingué d'une régression nouvelle sans être masqué. Ne pas lancer une large suite répétitive lorsqu'un résultat récent suffit ; les nouveaux comportements à risque ont des tests ciblés.

Ne pas demander une validation pour chaque bouton ou décision technique ordinaire. Demander seulement ce qui manque réellement au propriétaire, après avoir préparé la proposition concrète, et continuer le reste. L'accès compte/matériel et la décision de sortie publique restent distincts du développement autonome.
