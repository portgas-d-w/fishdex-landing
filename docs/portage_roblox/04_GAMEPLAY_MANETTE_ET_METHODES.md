# 04 — Gameplay manette et méthodes

## Principe

Des contrôles peu nombreux, contextuels et continus. La manette est le point de référence du nouveau jeu. Le mobile utilise les mêmes actions et règles avec des gestes adaptés. Les affectations ci-dessous sont un profil initial à mesurer, pas une obligation de conserver une touche qui se révèle inconfortable.

## Caméra et états d'entrée

En exploration : stick gauche déplacement, stick droit caméra. Au spot : position stabilisée, stick droit pour viser ou conduire la canne. Pendant le combat, caméra automatique amortie centrée sur la zone utile et non sur un poisson constamment visible. Un mode regard ponctuel peut être ajouté sans simultanément déplacer la canne ; afficher cet état. Aucune lutte entre caméra et canne sur un même stick.

Utiliser Input Action System et des contextes Exploration, Visée, Attente, Combat, Réception, Atelier, Menu. Une seule destination active pour une action. Le dispositif préféré change l'interface et les pictogrammes ; une manette sur PC reçoit la même expérience. Voir S03/S04.

| Contexte | Commande initiale | Effet |
| --- | --- | --- |
| Exploration | Stick gauche / droit | Déplacement / regard |
| Exploration | Carré / X | Interagir avec le spot ou un objet proche |
| Visée à moulinet | Stick droit | Direction et cible plausibles selon portée |
| Visée à moulinet | R2 / RT maintenu puis relâché | Préparer la puissance et lancer ; annulation dédiée |
| Ligne fixe | Stick droit + validation contextuelle | Positionner puis déposer dans la portée de canne |
| Attente, si ferrage requis | L2 / LT, action brève | Lever la canne pour ferrer la touche observée |
| Combat moulinet | Stick droit | Orientation et pression de canne |
| Combat moulinet | R2 / RT maintenu | Récupération mesurée selon la situation |
| Combat avec frein | L1 / LB ouvre réglage, croix directionnelle ajuste | Réglage borné et expliqué, sans troisième geste permanent |
| Combat kit | Action contextuelle puis stick gauche | Reculer la canne ; orienter avec le stick droit |
| Kit au raccord | Court déplacement guidé + confirmation | Séparer réellement le kit à la bonne position |
| Récupération manuelle | Geste court de stick gauche dans son contexte | Tirer une longueur bornée, retour de main sans gain fictif |
| Réception | Stick droit + gâchette contextuelle | Placer puis lever l'épuisette lorsque recevable |
| Menu | Croix/stick, Croix/A, Rond/B, L1/R1 ou LB/RB | Sélection, validation, retour, changement d'onglet |
| Atelier | Sélection → stick pour déplacer → confirmer | Placer un composant compatible en unités réelles |

Les boutons système Roblox conservent leur rôle. Chaque contexte a une action retour/annulation distincte, sans déclencher de lancer au relâchement d'un menu. Ajouter zone morte, réglage de sensibilité et inversion si utile. Perte de focus, manette déconnectée ou contexte fermé : relâcher toutes les actions maintenues et arrêter les vibrations.

## Combat commun

La résistance imposée au poisson dépend de l'orientation utile de la canne, de sa fuite, du fil, du frein, de l'élasticité et du terrain. La pression fatigue progressivement. Un retour vers le joueur ou une pause offre une récupération ; un poisson léger peut être récupéré pendant sa lutte dans les marges de l'ensemble. Trop de mou avec agitation augmente le risque de décrochage ; trop d'effort, frottement ou surcharge peut casser.

Ne pas transformer « tirer à l'opposé » en une flèche gauche/droite mécanique : la trajectoire, les obstacles et la géométrie comptent. Fournir des indices suffisants via direction du fil, courbure, bruit de frein, remous et haptique. Le flotteur ferré peut être immergé et ne revient qu'en approche ; le jeu reste lisible sans le voir.

Une bonne correction apporte un retour bref : contact retrouvé, trajectoire détournée, récupération productive, réception propre. Pas de combo abstrait qui inflige des dégâts au poisson. Les comportements varient réellement par espèce, taille et contexte ; ils ne suivent pas tous une alternance gauche-droite chronométrée.

Référence de durée à tester : prise ordinaire 15–30 secondes ; belle prise adaptée 40–90 secondes. Ce sont des objectifs de conception, pas des délais forcés. Les fenêtres tolèrent les mouvements imprécis d'un débutant. Alertes utiles, pas accumulation de jauges. Le plaisir doit aussi venir de l'attente, de la lecture et de la capture.

## Couverture initiale à réconcilier

La référence de gameplay contient 22 IDs. `data/couverture_methodes.csv` les reprend. L'audit ajoute toute entrée livrée supplémentaire et marque renommages/alias sans détruire les anciennes correspondances. Tous les cycles doivent être portés ; un label « bientôt » ne compte pas comme gameplay implémenté.

| Groupe | Présentation/touche à conserver | Identité de conduite |
| --- | --- | --- |
| Coup | Dépôt, profondeur, plombée, lecture flotteur | Ligne fixe, portée et géométrie |
| Leurre, ultraléger, mort manié | Couche, rythme, animations et pauses adaptées | Moulinet, direction et récupération |
| Feeder, method feeder | Dépôt précis, charge, diffusion, lecture du scion | Moulinet, conduite douce et reprise |
| Anglaise, bombette | Distance, profondeur/bannière, présentation légère | Moulinet et contact distant |
| Fond, carpe | Posé, signal compatible, éventuel auto-ferrage réel | Frein, départs, récupération et obstacles |
| Surface, stalking | Présentation visible/discrète et approche | Contrôleur de l'ensemble réellement utilisé |
| Grande canne, carpodrome | Dépôt avec kit, profondeur et élastique équipé | Recul, déboîtement et réception |
| Bolognaise, toc | Dérive, courant, contact et ferrage | Moulinet ou récupération manuelle selon ensemble |
| Mouche, nymphe au fil | Présentation/dérive et tension de ligne | Ligne manuelle avec passage éventuel au moulinet |
| Verticale, gambe | Couche, animation verticale et remontée | Moulinet et conduite depuis poste compatible |
| Traîne | Déploiement, parcours utile, vitesse, position de coque | Bateau mis en situation avant combat, puis canne |
| Clonk | Rythme d'attraction, profondeur et contexte | Ensemble adapté au silure, poussées et récupération |

Le geste de lancer varie : ligne fixe déposée, canne à moulinet lancée, soie présentée. Ne pas ajouter une roue de rythme identique à toutes les techniques. Les méthodes qui exigent rivière, profondeur ou bateau doivent disposer d'un contexte jouable, même dans une zone test distincte en attendant une carte appropriée.

## Progression

Reprendre les familles : Bordure 1 ; Exploration 15 ; Précision 30 ; Distance 45 ; Puissance 60 ; Contrôle 75 ; Rivière 90 ; Soie 105 ; Profondeur 120 ; Traîne 135 ; Silure 150. Niveau requis OU quête d'apprentissage terminée ouvre l'achat. Quête ouverte dix niveaux avant le palier, kit prêté, réussite sauvegardée, récompense unique. Les anciens droits restent acquis si une migration de profil est effectuée.

Les noms publics restent simples ; la fiche indique le vrai type de canne. Variantes spécialisées par maîtrise, rareté descriptive, objets achetés et montage compatible sont des conditions distinctes. Ne pas assimiler difficulté du spot, difficulté de méthode, rareté du poisson et puissance du matériel.

Les nouveaux joueurs suivent le kit et le tutoriel de ligne fixe. L'expérience de test permet de choisir tous les contrôleurs indépendamment de cette progression normale. Un bac à sable illimité ne valide pas la cadence de déblocage.
