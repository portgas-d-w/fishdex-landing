# FishDex — Gameplay mobile de pêche et atelier Matériel

Version 2 — 3 octobre 2026. Périmètre corrigé : les chantiers poissons/assets et méthodes sont terminés selon le joueur. Direction de gameplay validée. Spécification destinée à Codex dans le dépôt existant ; aucune implémentation n’a été réalisée par ce document.

## 1. Mission et priorité

Implémenter cette logique de gameplay, son retour visuel et la refonte ergonomique de Matériel. L’objectif est une pêche expressive et compréhensible au téléphone : le joueur contrôle sa présentation, la canne, la récupération et la réception ; les résultats dépendent du poisson, du milieu et du matériel.

Le joueur indique que les chantiers précédents des méthodes et des poissons sont terminés. **Commencer maintenant dans le dépôt actuel**, après lecture du relais et audit des fonctions réellement livrées. Ne pas attendre un chantier encore en cours et ne pas relancer l’import global des poissons, des assets ou les anciens travaux de catalogue.

Cette mission est autonome : aucun ancien ZIP n’est requis pour commencer. Consulter les spécifications déjà présentes dans le dépôt pour comprendre leurs règles, puis appliquer ce document aux gestes et à Matériel. S’appuyer sur les espèces, profils, méthodes, équipements et ressources déjà intégrés. Construire et vérifier le noyau mobile sur quelques scénarios contrôlés, puis raccorder tous les poissons et toutes les méthodes existantes à ce noyau. Les deux premiers ensembles de validation ne constituent pas une réduction du périmètre.

Préserver catalogue, images, variantes, habitats, progression, économie, inventaire, captures, aquarium et sauvegardes. Une adaptation du schéma est possible lorsqu’elle est nécessaire au nouveau gameplay, avec migration et conservation des données. Corriger une incompatibilité réelle rencontrée ; ne pas reconstruire tout le système en supposant que le travail précédent n’existe pas.

Le périmètre actif est : nouveau combat, commandes mobiles, signes dans la scène, manipulation de grande canne, réception, adaptation des présentations et refonte pédagogique de Matériel. Le catalogue complet est une dépendance existante à raccorder, pas un nouvel import à effectuer.

Ce document remplace les anciennes propositions de combat assisté qui permettaient à une action unique de diriger, fatiguer et ramener automatiquement le poisson. Il précise les interactions de la spécification des méthodes sans supprimer leurs différences. Les autres systèmes déjà implémentés restent la base à conserver et à raccorder.

Lire les instructions du dépôt et le relais. Adapter l’existant plutôt que construire des systèmes concurrents. Aucun nouvel abonnement, service externe de génération, compte obligatoire ou multijoueur. La génération d’images est arrêtée ; utiliser les ressources et représentations déjà disponibles dans le jeu.

## 2. Principes de conception

- Une commande agit sur un outil ou un mouvement précis ; elle ne résout pas toute une situation.
- L’intérêt vient du choix de direction, du moment, de l’intensité du mouvement et de la préparation.
- Les gestes restent accessibles : grande cible, tolérance aux mouvements imparfaits, absence de mouvements circulaires obligatoires et de précision au dixième de seconde.
- Une erreur est perceptible avant sa conséquence ; une brève maladresse ne déclenche pas une casse arbitraire.
- Pas de longue suite obligatoire de petits gestes répétitifs pour chaque poisson ordinaire.
- Les signes dans la scène sont suffisamment expressifs pour comprendre le combat sans tableaux de données.
- Profondeur, obstacles, présentation et propriétés du montage ont des effets réels, avec des compromis compréhensibles.

## 3. Grammaire tactile en portrait

Deux zones larges en bas de l’écran, sans panneau opaque envahissant :

**Canne**, à gauche par défaut : déplacement horizontal = orientation ; déplacement vertical = hauteur. Commencer le geste à la position du doigt et appliquer des deltas pour éviter un saut au contact. Limiter les angles à des amplitudes plausibles ; le joueur ne retourne pas la canne à travers son corps. Réponse rapide avec une inertie légère, indépendante de la fréquence des images.

À la fin du geste, conserver l’orientation souhaitée. Les forces du poisson continuent d’influencer la flexion. Cette conservation ne choisit pas une contre-pression optimale et ne suit pas automatiquement le poisson.

**Récupération**, à droite par défaut : au moulinet, maintien = rotation et récupération mécanique du fil ; relâchement = arrêt de cette action. La direction de canne reste indépendante. Aucun cercle pour mouliner. L’intensité d’une commande ne dépend pas d’une pression matérielle de l’écran, non disponible de manière fiable.

À la grande canne à emmanchement, cette seconde zone reçoit les gestes de recul et de déboîtement décrits en section 7. Aux autres méthodes, elle reçoit l’action adaptée effectivement permise par l’équipement.

Proposer une inversion gauche/droite. Ajouter un mode accessible à un doigt avec commandes successives : la canne garde sa position pendant la récupération et le joueur peut la reprendre. Cela ne doit pas ajouter une assistance cachée au combat.

Les zones ont un petit repère au repos et un retour visuel discret pendant le toucher. L’initiation montre leur emplacement ; elles ne doivent pas être des surfaces invisibles à découvrir par hasard. Prévoir marges de sécurité et gestes système du téléphone. Le doigt ne doit pas masquer le point d’entrée du fil.

Ne pas accumuler la caméra, le lancer et le combat sur un même geste simultané. Distribuer les interactions selon l’état du jeu ; bloquer les mouvements de caméra qui perturbent le combat.

## 4. Un combat continu, aucune phase gagnante automatique

Le poisson peut partir, ralentir, céder du terrain, revenir, tourner vers un refuge ou repartir. Le joueur décide où exercer sa pression, quand accompagner et quand récupérer. Ne pas attendre qu’une barre de fatigue soit vide pour permettre la récupération.

| Situation | Action possible | Effet attendu |
| --- | --- | --- |
| Déplacement latéral | Pression latérale adaptée | Modifier la trajectoire et imposer un effort si le montage reste en contact |
| Départ puissant | Accompagner et laisser agir le frein | Du fil peut sortir ; le montage reste chargé sans surcharge systématique |
| Poisson qui cède | Guider et récupérer | Réduction possible de la distance et de la longueur de fil sortie |
| Retour vers le joueur | Récupérer rapidement le mou | Rétablir le contact ; l’action ne crée pas une traction tant que le mou subsiste |
| Refuge proche | Modifier l’angle de traction | Tenter de détourner le poisson ; risque réel si le fil atteint l’obstacle |
| Approche du bord | Ajuster la pression et préparer la réception | Conserver une marge face à un dernier départ |

Le côté utile dépend de la position du poisson, du point de traction et des obstacles. Ne pas implémenter un puzzle « gauche = bonne réponse quand le poisson va à droite ». L’orientation de la canne modifie sa géométrie et la force transmise ; une règle d’efficacité abstraite n’est acceptable qu’en approximation documentée de cette géométrie.

Un poisson immobile peut encore maintenir la tension. Un poisson venant vers le pêcheur peut produire du mou. Un petit poisson peut être ramené pendant qu’il résiste si le matériel le permet.

La récupération reste possible à tout moment ; sa conséquence dépend du mou, de la force et du frein. Face à un départ fort, mouliner peut ne pas réduire la distance, et le fil peut continuer de sortir. Aucun dommage automatique ajouté uniquement parce que le bouton est appuyé.

Le geste de lever progressivement la canne peut gagner du terrain ; l’abaisser avec une récupération adaptée permet de conserver ce gain. Ne pas attribuer des mètres gratuits au simple geste vertical : le déplacement du scion et la traction doivent l’expliquer.

## 5. Noyau de simulation partagé

Séparer simulation, entrée utilisateur, rendu et aides pédagogiques. Adapter le schéma aux conventions du dépôt.

État minimum : position/vitesse/intention du poisson, énergie et effort courant, longueur de ligne sortie, géométrie du fil, mou, tension, flexion de canne, frein, élasticité, composants et obstacles. La fatigue, la distance du poisson et la longueur sortie sont des variables distinctes.

La tension découle de la longueur disponible, du trajet de ligne, de la compliance canne/fil/élastique et du mouvement relatif. La ligne n’exerce pas de traction lorsqu’elle est en mou. Les calculs sont bornés et stables. Pour un calcul de forces, conserver une unité interne cohérente ; le poids du poisson n’est pas directement une tension de ligne.

Le frein laisse sortir du fil lorsque la charge dépasse son seuil, dans les limites de réserve. Ne pas supprimer la charge dès que le frein agit. Le moulinet a une capacité de récupération liée à l’ensemble et à la charge ; il ne téléporte pas le poisson vers le bord.

Le poisson dépense de l’énergie lorsqu’il fournit un effort, notamment contre la résistance. Aucun drainage arbitraire « doigt du bon côté = dégâts ». Les profils pondèrent des actions conditionnelles et des capacités ; ils n’imposent pas une séquence fixe. Prévoir accalmies et reprises bornées pour éviter des combats sans fin.

Risques séparés : perte de contact prolongée, surcharge cumulée, abrasion, accrochage et liaison rompue. Conserver la localisation de casse et les pertes de composants déjà implémentées ; compléter uniquement les effets nécessaires au nouveau combat. Les tolérances et coefficients sont des choix d’équilibrage centralisés, pas des constantes biologiques.

Échantillonner les intentions avec une graine reproductible ; faire évoluer la simulation avec un pas temporel stable ou des sous-pas bornés. Comparer au minimum le comportement à 30 et 60 images/s. Aucun tirage de casse ou de touche par frame.

Le réglage du frein est préparé dans Matériel. En combat, un accès compact facultatif peut ouvrir un réglage simple, sans troisième commande permanente obligatoire. Le réglage réellement utilisé doit être visible au moment de l’ajustement. Les aides ne modifient pas silencieusement les propriétés achetées.

## 6. Lire le combat sans surcharge d’interface

| Événement | Signal principal |
| --- | --- |
| Charge qui monte | Courbure et oscillation de canne plus marquées |
| Sortie de fil | Son et animation du frein, déplacement du point d’entrée |
| Trajectoire latérale | Point d’entrée du fil et perturbations d’eau cohérentes |
| Apparition de mou | Courbe visible du fil, diminution de charge sur la canne |
| Secousse | Impulsion courte et amortie dans le fil et la canne |
| Accalmie | Mouvement moins soutenu et récupération plus efficace |
| Élastique sollicité | Allongement visible et retour progressif |

Ne pas rendre un poisson sous l’eau toujours visible comme aide universelle. Ne pas imposer un flotteur aux méthodes qui n’en utilisent pas. Au flotteur, après ferrage, le fil et la canne restent les indices principaux ; le flotteur peut être immergé et réapparaître à l’approche.

Amplifier légèrement les signes pour leur lecture sur petit écran, sans mentir sur l’état : une ligne affichée tendue ne doit pas être traitée comme détendue. Conserver du contraste sur plusieurs eaux et lumières ; éviter de coder la tension uniquement par une couleur.

Pas de grosse barre de vie, de compteur de fatigue ou de multiples jauges permanentes. Prévoir un petit indicateur de tension optionnel, des textes d’apprentissage brefs et des aides accessibles aux joueurs qui utilisent peu le son. Haptique uniquement si disponible, jamais indispensable.

Les conseils contextuels s’espacent après des réussites ; ils restent réactivables. Une aide de lecture n’exécute pas le geste. Exemple : « Il revient : reprends le fil » uniquement lorsque cet état est réellement détecté.

## 7. Grande canne à emmanchement et canne à ligne fixe

Ne pas confondre ces équipements.

**Grande canne à emmanchement** : orientation à gauche, recul dans la zone droite par glissements vers soi. Le recul est proportionnel au mouvement du doigt, avec une vitesse maximale et une animation de translation réelle. Il modifie la position du scion ; il ne consomme ni ne raccourcit magiquement la ligne.

Quand une jonction devient accessible, afficher un repère discret au point de manipulation et une indication courte lors de la première utilisation. Un glissement latéral dans la zone droite réalise le déboîtement. Recul et déboîtement ne sont pas actifs sur la même interprétation ambiguë du geste : décider selon l’état et l’axe initial, puis conserver cette décision jusqu’au relâchement.

La longueur de canne réellement manipulée change ; les éléments retirés sont rangés visuellement sans encombrer l’eau. Le joueur garde le kit en main. Déboîter ne réduit pas la longueur du montage. Le mouvement reste compatible avec l’espace du poste représenté ; simplifier le rangement, pas la conséquence physique.

L’élastique absorbe les départs selon ses propriétés et sa plage utile. Le recul peut être arrêté ; accompagner ou réavancer peut être nécessaire lors d’un départ. Ne pas bloquer le joueur dans une progression irréversible qui impose la casse.

Le déboîtement n’est pas un événement chronométré : le geste est facile. Le moment et la stabilité de la situation font l’intérêt. Une maladresse de direction ne détruit pas un élément de canne.

**Canne télescopique à ligne fixe** : orientation, hauteur, accompagnement et réception adaptés à sa longueur. Aucun déboîtement fictif en combat. Les limitations de portée et de réserve de ligne doivent être cohérentes ; ne pas lui ajouter un moulinet caché.

Un dispositif de traction d’élastique ne peut recevoir un geste de contrôle que si l’équipement monté possède réellement ce dispositif ; le document ne le rend pas universel.

## 8. Réception contrôlée par le joueur

Lorsque le poisson entre dans la zone de réception, rendre l’épuisette accessible. Une transition explicite remplace l’action secondaire par son positionnement ; ne pas voler un appui de moulinage déjà en cours. Conserver le contrôle de la canne. Permettre un retour à la récupération si le poisson repart.

Le joueur glisse pour positionner la tête d’épuisette dans l’eau, guide le poisson au-dessus, puis effectue un court mouvement de relevage. Réussite selon position, gabarit, orientation et état du poisson. L’aire de réussite est tolérante ; aucun alignement au pixel ni jauge chronométrée obligatoire.

La rencontre avec l’épuisette doit être confirmée par la simulation. Ne pas capturer automatiquement à un seuil de fatigue ou de distance. Conserver une reprise possible avant réception et une fin claire après capture. La taille et la portée d’épuisette ont un effet utile, expliqué avant la session.

Prévoir un geste court adapté aux petits poissons lorsque l’équipement le permet, sans lancer la même longue séquence que pour un spécimen imposant. Tapis, photo et retour à la pêche gardent un rythme fluide.

## 9. Mécaniques des méthodes : cohérence et réutilisation

Le catalogue de méthodes déjà implémenté est le périmètre à raccorder ; vérifier chaque entrée sans réimplémenter aveuglément son moteur. Regrouper les adaptateurs sans transformer toutes les méthodes en flotteur plus bouton de capture.

| Famille | Interaction utile avant combat |
| --- | --- |
| Flotteur | Placement, profondeur, plombée, signal et ferrage |
| Fond, feeder, method, carpe | Placement, dépôt/amorçage, mise en contact, scion ou indicateur adapté |
| Leurres, ultraléger, stalking actif | Récupération, pauses, changements de direction et hauteur |
| Toc, flotteur en dérive | Accompagnement, contact et présentation dans le courant |
| Mouche, nymphe | Présentation et dérive ; gestion de soie/ligne selon équipement |
| Verticale, mort manié, gambe | Profondeur, mouvements courts et pauses adaptés |
| Traîne | Trajectoire/vitesse de déplacement et profondeur de présentation |
| Clonk | Placement et coups espacés avec retour cohérent, sans effet magique garanti |

Certaines entrées sont des approches ou contextes : carpodrome, surface, bombette et stalking ne nécessitent pas forcément un nouveau moteur de combat. Les raccorder à leurs outils et interactions réels. Fournir une matrice pour toutes les entrées du dépôt.

Ajouter les mécaniques utiles : sondage, réglage de profondeur, amorçage ciblé, animation et contrôle de dérive. Le sondage explore un point ; l’amorçage choisit une zone et une portion ; leurs conséquences sont visibles et raccordées aux populations. Ne pas ajouter un minijeu de fabrication de nœud, d’ouverture de boîte ou de coupe du fil à chaque capture sans enjeu réel.

Le lancer manuel reste un geste de préparation : départ dans la zone basse, contrôle de canne, libération vers la zone milieu/haute, direction et puissance calculées depuis le geste avec limites du montage. Pour les pratiques sans lancer balistique, utiliser dépôt ou présentation adaptés. Le même glissement ne doit pas lancer une ligne pendant un combat ou dans un menu.

Le ferrage est un mouvement bref de canne quand la touche s’y prête. Tolérer une amplitude et une durée larges sur mobile ; différencier les règles de ferrage selon montage, sans multiplier les commandes.

## 10. Matériel : compréhension progressive et atelier visuel

Conserver **Ma canne / Mon sac / Ensembles**, Boutique séparée. Ma canne s’ouvre sur l’ensemble équipé ; le parcours reste canne → méthode compatible → montage.

### Vue principale

Canne au centre, repères tactiles reliés aux composants, méthode active et résumé du montage. Afficher seulement les emplacements pertinents. Le bouton « Montage » ouvre son gros plan. Au maximum quelques repères visibles ; grouper les accessoires dans le détail du montage.

En-tête opaque et stable, un seul défilement principal, sortie claire, cibles d’au moins environ 44 px, prise en compte des marges du téléphone. Le contenu ne passe pas derrière le titre comme dans les anciennes captures.

### Choix d’un composant

Liste compacte des objets possédés compatibles, élément équipé repéré, nom et deux effets utiles au maximum. Articles incompatibles masqués par défaut, consultables avec explication. Les variantes de taille/grammage sont dans la fiche, pas sous cent cartes presque identiques.

Chaque fiche répond : **À quoi cela sert ? Qu’est-ce que cela change dans le jeu ? Quand est-ce utile ? Quel est le compromis ?** Lier le texte aux propriétés effectives. Ne pas promettre une mécanique absente.

Exemple de comparaison : « Amortit davantage les à-coups · transmet moins directement certains mouvements ». Détails techniques dans un panneau secondaire avec unités et définitions accessibles. Utiliser les noms réels avec un libellé simple lorsque nécessaire : « Bas de ligne — dernière portion de fil ».

### Préparation guidée

Proposer un montage conseillé compatible avec la canne, la méthode et le poste. Expliquer en une phrase ce qu’il permet. Le joueur peut équiper l’ensemble puis modifier une pièce. Les conseils ne supposent pas une capture garantie ni ne révèlent tous les poissons cachés.

Un conseil n’effectue pas d’achat. Si une pièce manque, montrer les options : réserve possédée, kit gratuit compatible ou Boutique avec prix total. Garder les réglages avancés disponibles à tout moment, sans les imposer au débutant.

### Démonstrations utiles

Dans le détail du montage, montrer la descente de l’esche, l’équilibre du flotteur et la profondeur. Changer un lest ou un réglage actualise l’aperçu, alimenté par la même logique que la pêche ou par une approximation explicitement documentée. La démonstration ne doit pas contredire le comportement dans l’eau.

Utiliser un aperçu simple et léger, sans lancer une deuxième grande scène 3D. Quelques dessins/animations par code suffisent à expliquer le fonctionnement.

### Sac, ensembles et Boutique

Sac = possessions, quantités libres/en service, recherche et filtres courts. Ensembles = configurations nommées, favorites, état prêt/incomplet et réparation explicite. Boutique = disponibilités, compatibilités, intérêt, prix et conditions d’accès, issus du même catalogue.

Montrer les coûts exposés à une casse au moment de préparer, pas en plein combat. Si un réglage est incohérent, expliquer le problème au point concerné et proposer une correction. Bloquer seulement les impossibilités réelles ; les compromis peu favorables restent essayables.

Basalte & Turquoise pour les surfaces et sélections ; couleurs naturelles pour poissons et matériel. Le mode guidé réduit la quantité d’information affichée, pas le contenu disponible.

## 11. États et correctifs tactiles obligatoires

Prévoir explicitement préparation, présentation/lancer, attente ou animation, touche/ferrage, combat, réception, résultat et menus en pause. Les intentions du poisson sont des états internes ; elles ne verrouillent pas la récupération en phases artificielles.

Respecter la consigne tactile validée :

- `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none` sur zone de jeu et commandes ; empêcher glissement natif d’images et menus contextuels perturbateurs.
- `touch-action: none` uniquement sur canvas et surfaces de gestes dédiées ; aucun ancêtre commun englobant les menus ne bloque leur défilement.
- Recherches et champs restent éditables, avec sélection possible. Les menus gardent leur défilement normal.
- Suivi indépendant des pointeurs, capture pendant le geste, nettoyage sur relâchement, annulation, perte de focus, ouverture de menu et changement d’état.
- Relâcher un doigt arrête la commande correspondante uniquement. À la fermeture d’un menu, une ancienne capture ne réactive pas la récupération.

Conserver une pause réelle lorsque l’application perd le focus ou qu’un menu de pause est ouvert. Au retour, remettre les commandes au repos et laisser le joueur reprendre clairement. Ne pas compter des secondes d’absence comme une rupture de fil. Versionner l’état de session si sa sauvegarde est utilisée ; ne pas créer de doublon de capture ou de récompense.

## 12. Prototype de validation, puis généralisation

Commencer en mode développement par deux ensembles : un au moulinet, un à grande canne. Pour chacun, tester plusieurs individus et un milieu dégagé puis encombré. Réutiliser les scénarios, profils et graines déjà présents dans le dépôt ; ajouter uniquement les scénarios de comparaison manquants.

Cette étape doit produire des gestes jouables, un poisson simulé, une ligne lisible et une réception. Puis raccorder tous les adaptateurs et le catalogue existant complet ; ne pas s’arrêter à une démo séparée et ne pas importer à nouveau ce catalogue.

Les essais forcés restent dans le profil de développement avec argent illimité, captures et progression séparées. Comparer avant/après avec le même individu et le même équipement. L’ancien comportement peut rester temporairement accessible en développement pour comparer, sans devenir une seconde architecture permanente.

Critères de vérification :

1. Orienter la canne modifie réellement géométrie/traction/trajectoire ; la position reste stable quand le doigt est retiré.
2. Un maintien de récupération sans action de canne ne garantit pas tous les combats ; un petit poisson accessible n’exige pas artificiellement une longue lutte.
3. Un retour du poisson crée du mou selon les longueurs ; récupérer le retire ; un poisson simplement immobile ne produit pas automatiquement du mou.
4. Le frein peut rendre du fil malgré la récupération ; réserve, charge et animation concordent.
5. Lever/abaisser la canne n’accorde aucun gain de distance sans conséquence physique.
6. Reculer/déboîter la grande canne modifie la géométrie et la longueur manipulée, jamais directement la longueur de ligne ; la canne télescopique n’a pas ce geste.
7. Deux doigts simultanés, inversion des zones, un doigt, relâchement et annulations n’entraînent ni saut ni commande bloquée.
8. Les signes de mou, de tension et d’élastique correspondent à la simulation ; le combat reste lisible sans son et sans plusieurs jauges.
9. La réception nécessite positionnement réel ; reprise avant capture possible ; récompenses accordées une seule fois.
10. Chaque méthode a une chaîne de présentation/ferrage/combat/réception adaptée ; aucune méthode ne reçoit un outil inexistant.
11. Un débutant peut équiper un montage conseillé, expliquer le rôle d’une pièce, lire son compromis et corriger un problème sans parcourir tout le catalogue.
12. Menus défilables, champs éditables, marges/cibles correctes en portrait ; ouverture/fermeture et perte de focus sûres.
13. Résultats comparables à fréquences d’images différentes ; sauvegardes normales et migration intactes.

Exécuter les vérifications du projet et les parcours automatisables utiles. Mesurer les performances réellement testées ; viser au moins un rendu stable à 30 images/s sur la cible mobile, avec 60 si possible, sans présenter une fenêtre desktop comme preuve de performance iPhone.

Le confort au pouce nécessite un essai humain au téléphone. S’il n’est pas réalisable sur le poste de Codex, fournir la procédure et marquer ces contrôles « à tester au toucher ». Continuer le travail et les vérifications disponibles ; ne pas annoncer une validation tactile fictive.

## 13. Livraison et passage entre agents

Actualiser le relais avec choix de gestes, schéma de simulation, coefficients provisoires, adaptateurs, interactions réellement présentes et scénarios. Distinguer implémenté, vérifié automatiquement, testé en navigateur, testé au téléphone et blocages exacts.

Rendre le nouveau parcours essayable dans le jeu après les vérifications disponibles ; une maquette ou des boutons sans effets ne suffisent pas. Déployer sur le projet Vercel du jeu déjà autorisé, conformément aux instructions du dépôt, sans modifier l’application FishDex.

Fournir une courte procédure : essayer un départ, un retour créant du mou, un obstacle, un recul/déboîtement, une réception et la préparation guidée. Noter précisément les limites et les essais humains restant à faire.

## 14. Fondement et limites

Les interactions tactiles, les tolérances, l’amplification des signaux et les paramètres de simulation sont des décisions de conception, à ajuster par essais. Les profils biologiques et les correspondances restent dans les catalogues existants du projet.

Références déjà consultées lors de la conception du combat, le 3 octobre 2026 :

- Caperlan / Decathlon, fonctionnement du frein : https://www.decathlon.fr/c/htc/comment-choisir-son-moulinet_c5efe0bf-7a21-46f9-9cc7-a41a4d6bbeb3
- Caperlan / Decathlon, élastiques et montage de kit : https://conseilsport.decathlon.fr/comment-monter-son-kit-avec-un-passe-elastique-externe
- Fédération de pêche du Calvados, guide et déboîtement à la grande canne : https://www.federation-peche14.fr/wp-content/uploads/2024/11/livre-un-pecheur-sachant-pecher.pdf — extrait retrouvé dans les résultats de recherche ; ouverture du PDF indisponible lors de cette consultation, à compléter avant de reprendre ses détails.

Ces références expliquent certains outils et gestes réels. Elles ne valident pas les coefficients, commandes ou probabilités de ce jeu. Compléter les points insuffisamment documentés avant de fixer une règle de méthode particulière.
