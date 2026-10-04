# Lot 03 — Progression, lieux, carte et accès à l'observation

## Constats

Ma progression affiche niveau et XP, puis une longue liste des 22 pratiques avant les objectifs. Les conditions utilisent fréquemment « Niveau … OU … prises avec une pratique de la même famille ». Une seconde rubrique repliée « Mes 22 techniques » existe aussi : vérifier le doublon et son origine.

Les lieux affichés comprennent l'étang, la rivière, le lac profond et l'embarcation. La carte de l'étang présente six postes, puis une série de boutons de destinations très différentes. La fiche du ponton liste de nombreuses pratiques en un paragraphe. L'écran d'observation au ponton indique qu'aucun poisson n'est disponible et affiche plusieurs commandes désactivées.

Ces constats portent sur une nouvelle partie. Les accès, nombres et noms exacts doivent être lus dans la version actuelle du dépôt.

## Progression : prochain choix avant historique complet

En haut : niveau, XP vers le prochain niveau et résumé discret de la collection. Ensuite une carte « Mon prochain objectif » avec action concrète, avancement et conséquence réelle : découverte, technique ou accès. Les récompenses déjà présentes sont affichées exactement ; aucune nouvelle économie introduite pour remplir l'écran.

Puis « Prochains déblocages » : quelques étapes proches, chacune avec condition compréhensible, avancement et bouton de contexte. Les alternatives logiques sont présentées comme alternatives : « Atteindre le niveau X, ou réussir Y prises dans [famille nommée] ». Calculer séparément les chemins ; ne pas additionner des pourcentages ni transformer OR en AND.

Le joueur peut choisir un objectif à suivre. Cela ne le complète pas ni ne change l'attribution des récompenses. Si le projet ne stocke pas déjà cet objectif, ajouter seulement un état UI persistant compatible avec la sauvegarde, avec une valeur par défaut déterministe. L'objectif reste accessible dans les menus ; pas de nouvelle grande jauge permanente sur la pêche.

Trois vues : Mon parcours ; Techniques ; Badges. Regrouper les 22 techniques par familles lisibles, sans en supprimer et sans faire d'une meilleure canne une technique. Les techniques ouvertes montrent un résumé et un lien matériel ; les verrouillées montrent une étape précise. Les droits acquis restent permanents selon les règles actuelles.

Les badges affichent nom, illustration légère, condition, avancement, état obtenu et éventuelle récompense réelle. Un badge déjà obtenu n'offre pas un nouveau gain lors d'une revisite. Les listes de sources, anciennes maîtrises et règles internes rejoignent le mode de développement.

## Destinations puis postes

### Lieux de pêche

Une page de destinations : illustration ou photo in-game, nom, type de milieu, identité de pêche en une phrase, état Accessible / À débloquer / À venir, et action cohérente. Les photos doivent venir des scènes du jeu quand disponibles. Si la 3D ne démarre pas, ne pas enregistrer une image de panne comme aperçu ; utiliser un fallback explicite.

Différencier destination, embarcation/contexte et poste. La classification du dépôt peut être adaptée dans une couche de présentation sans renommer les IDs ni inventer de nouveaux mondes jouables. Une embarcation n'est pas présentée comme une étendue d'eau autonome si elle est un contexte de déplacement.

La destination actuelle possède un accès « Choisir mon poste ». Les autres ouvrent leur fiche ou leurs conditions. Les aperçus différents doivent refléter les lieux réels ; ne pas recycler la même image plate comme si tous les milieux étaient identiques.

### Carte locale

La carte montre uniquement le lieu consulté et ses postes prédéfinis. Le changement de destination est une action séparée « Autres lieux ». Les noms des postes sont disponibles au toucher et dans l'accessibilité ; éviter les simples numéros sans légende.

Le dessin de la carte reprend les données géographiques actuelles. Ne pas coder une nouvelle forme d'étang déconnectée du terrain ou des coordonnées. Indiquer rive, obstacles et zones utiles quand les données les décrivent réellement. Une carte 2D/SVG suffit ; pas de nouveau rendu 3D en continu.

Une sélection ouvre un aperçu de poste sans transporter le joueur immédiatement. Action finale « S'installer ici », revalidation des droits et des contraintes de changement de poste. Respecter les règles actuelles si une ligne est en service ; expliquer quand il faut la ramener, plutôt que supprimer la partie en cours.

### Fiche du poste

Ordre : aperçu ; nom et disponibilité ; ambiance/habitat ; contraintes lisibles ; poissons ou indices locaux ; quelques techniques conseillées ; « S'installer ici ». Liste exhaustive de techniques dans les détails.

Exemples de contraintes UI : Réception dégagée ; Obstacles proches ; Bordure peu profonde ; Zone profonde ; Courant. Afficher seulement celles issues des données. Une difficulté de poste décrit des situations plus délicates ou des poissons plus susceptibles de poser un problème ; aucun multiplicateur arbitraire de force ajouté au combat.

Une indication de difficulté peut être qualitative et accompagnée de sa cause. Si les données ne définissent pas une valeur fiable, montrer les contraintes et « Adapté pour débuter » lorsqu'il existe une règle d'éligibilité, plutôt qu'une note inventée.

Les poissons conseillés et fréquences relatives suivent les tables de population et les conditions. Respecter les identités cachées du FishDex. Pas de taux de morsure chiffré sans calcul réellement disponible.

Pour un poste occupé ou verrouillé : texte de raison, condition permanente d'accès et lien vers l'objectif. Ne pas fabriquer une attente en temps réel ou un PNJ bloquant si cette règle n'existe pas. Vérifier les conditions historiques comme « captures dans le cercle du ponton » et traduire leur sens en termes compréhensibles, sans conserver un jargon de debug.

## Observation : rejoindre une situation utile

L'entrée « Observer » dans le menu ouvre le contexte courant. Si aucun poisson n'est observable, afficher une vraie proposition : liste courte des destinations ou postes accessibles avec identités observables, et bouton vers leur fiche. Les lieux inaccessibles restent consultables avec leur condition.

Le bouton prépare la navigation ; il ne démarre pas une observation fictive et ne révèle pas les identités cachées. Le lot 03 améliore l'accès et les informations, pas la durée ou les récompenses de l'action d'observation. Une simple destination valide ne signifie pas qu'une espèce est actuellement repérée.

État prêt à observer : espèce ou indice autorisé, contexte et prochaine action. Détails des récompenses hors du premier bloc. Respecter l'indépendance entre observation, capture et poisson favori d'aquarium telle que définie dans le projet.

## Cohérence des conditions et recommandations

Centraliser les raisons d'éligibilité affichées via les services existants : ouvert, verrouillé, incompatible, contenu futur. Même condition dans progression, boutique, carte et FishDex. Les changements d'affichage n'accordent aucun droit.

Une recommandation doit pouvoir expliquer son choix. Priorité à une prochaine étape accessible et utile, puis à un objectif proche ; éviter de suggérer une initiation dans un état où ses prérequis ne sont pas remplis. Les conditions de recours au kit gratuit restent celles du lot 01.

Le mode développement peut rendre toutes les techniques testables suivant les mécanismes existants. La partie normale continue à afficher les conditions de déblocage réelles. Ne pas remplacer toutes les conditions par ouvert pour simplifier la recette UI.

## Accueil : point d'intégration

Livrer un composant résumé « Prochaine étape » réutilisable dans le menu. Le lot 04 organise l'accueil final. Si le résumé est immédiatement intégré, le placer discrètement sans multiplier les cartes et sans reprendre les autres sections.

## Contrats conceptuels

ObjectiveView : identifiant, titre, action attendue, progression, récompense réelle, raisons d'éligibilité, destination de navigation.

PostView : identifiant existant, lieu/contexte parent, position cartographique, état d'accès, contraintes, recommandations, état courant.

Ces contrats sont des formes de présentation, pas un nouveau backend obligatoire. Documenter le mapping vers les données actuelles et conserver l'historique des droits et des records de chaque technique.
