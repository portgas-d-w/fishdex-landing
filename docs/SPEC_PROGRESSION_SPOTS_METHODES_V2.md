# FishDex — Progression, raretés, spots et méthodes

Date : 2 octobre 2026. Version 2 — toutes les techniques jouables et mode de développement. Cahier des charges pour Codex et Claude.

## 1. Objectif et statut

Créer une progression de jeu de pêche solo sur navigateur mobile qui donne envie de découvrir des poissons, de préparer des montages et d'explorer un même plan d'eau. Le choix du lieu, du matériel et de la pratique doit changer les décisions du joueur.

Demandes actées : niveaux de rareté ; contenu progressivement accessible ; carte de lac ou d'étang avec postes prédéfinis ; poissons répartis selon leur habitat ; certains postes initialement occupés par un pêcheur ; difficulté environnementale ; pratiques de pêche réellement différentes. Direction artistique : Basalte & Turquoise. Le FishDex reste la collection principale, le carnet l'historique des prises.

**Nouvelle priorité utilisateur : implémenter toutes les techniques du catalogue et l'ensemble des systèmes qui influencent le gameplay.** Elles doivent pouvoir être essayées avec de l'argent illimité pendant le développement. Ce document remplace les anciennes consignes limitant le chantier au coup et aux leurres ou laissant les autres techniques uniquement préparées. L'ordre de construction reste progressif ; l'objectif de livraison couvre toutes les techniques.

Le périmètre vérifiable comprend les 22 méthodes et approches du dossier matériel existant, leurs 55 recettes de montage à raccorder, les équipements/appâts correspondants, les postes et la chaîne complète de pêche. Vérifier ces nombres et leur correspondance dans le dépôt. Une approche peut réutiliser une méthode ; chaque recette doit apporter les comportements que ses composants promettent. Ce périmètre ne prétend pas recenser toutes les pratiques mondiales. Tout ajout déjà prévu dans le dépôt doit être inventorié et intégré au suivi.

Ce document propose une conception à implémenter. Les noms de postes, seuils de niveau, objectifs, taux et paramètres indiqués sont des hypothèses de prototype. Ils ne décrivent ni le code actuel, ni des statistiques biologiques mesurées. Lire le projet et ses données avant de modifier quoi que ce soit. Réutiliser les identifiants et systèmes existants.

## 2. Trois axes pour classer chaque élément

Chaque élément du catalogue reçoit une rareté de jeu, des conditions d'accès et des caractéristiques propres. Ces champs ont des fonctions distinctes.

| Axe | Fonction | Exemple |
| --- | --- | --- |
| Rareté | Signaler la fréquence ou la singularité d'une découverte | Un grand spécimen peut être exceptionnel dans une espèce commune |
| Accès | Dire quand et comment l'élément devient utilisable | Une spécialisation ouverte après une courte initiation |
| Capacités | Décrire son intérêt et ses limites | Une canne légère précise pour les petites présentations |

### Échelle de rareté

| Rareté | Poissons et spécimens | Équipements et objets |
| --- | --- | --- |
| Commun | Rencontres habituelles dans un habitat adapté | Matériel accessible, fiable et utile durablement |
| Peu commun | Rencontres moins régulières ou présentation plus spécifique | Variante répondant à un besoin précis |
| Rare | Conditions de rencontre plus ciblées | Spécialisation ou objet de collection |
| Exceptionnel | Individu remarquable ou rencontre particulièrement exigeante à obtenir | Pièce distinctive, obtenue par une progression notable |
| Légendaire | Rencontre emblématique conçue et annoncée comme telle | Récompense de prestige, notamment cosmétique |

Il s'agit d'une classification de jeu, sans rapport automatique avec le statut de conservation d'une espèce. Une espèce peut être fréquente dans un lac et peu fréquente dans un autre. Enregistrer une rareté de collection et, séparément, sa distribution locale. La rareté du spécimen dépend aussi de sa taille et de ses caractéristiques individuelles ; éviter de générer artificiellement des variantes anatomiques impossibles.

Pour les équipements, la rareté ne multiplie pas toutes les statistiques. Une pièce rare peut être spécialisée dans la finesse ; un montage commun reste pertinent pour une autre pratique. La puissance, la qualité, la sensibilité, la précision, la réserve de ligne, la compatibilité et la résistance sont des propriétés explicites, avec des compromis.

Pour les méthodes et les lieux, stocker également un palier de découverte. Afficher prioritairement « initiation », « spécialisation » ou « maîtrise », et une difficulté environnementale pour les postes. La pêche à la mouche ne constitue pas une amélioration générale de la pêche au coup. La rareté éditoriale d'une méthode ne détermine pas son efficacité biologique.

Les appâts et consommables utilisent la même classification de catalogue. Un appât rare a une pertinence spécifique ; son prix ou sa rareté ne rendent pas tous les poissons plus attirés. Les décorations et badges peuvent surtout exprimer le prestige.

### Paliers d'accès proposés

| Palier | Accès proposé | Contenu |
| --- | --- | --- |
| Découverte | Début de partie | Trois postes ouverts, kit gratuit au coup, premiers poissons et premières fiches |
| Initiation | Première capture et courte initiation aux leurres | Kit de base aux leurres ; achats usuels ; deux pratiques au choix |
| Exploration | Niveau 3 OU petit objectif de maîtrise accessible | Poste des roseaux ; premières variantes de montage |
| Spécialisation | Niveau 6 OU objectif technique annoncé | Pointe exposée, équipement spécialisé ; initiations au posé et au feeder |
| Maîtrise | Niveau 10 OU défi préparatoire pertinent | Cassure profonde puis bois immergé, selon les conditions propres à chaque poste |
| Prestige | Accomplissements de long terme | Collection, records, cosmétiques et défis remarquables |

Ces niveaux servent de première configuration ajustable pour la partie normale. Une alternative par maîtrise utilise une pratique déjà accessible : aucun objectif ne doit dépendre du poste ou de l'objet qu'il débloque. Limiter chaque verrou à une ou deux conditions lisibles. Les autres pratiques reçoivent une initiation ou un palier cohérent avec leur contexte. Pendant le développement, le profil de test permet de toutes les essayer immédiatement une fois leur implémentation fonctionnelle, indépendamment des verrous normaux.

Ouvrir tôt une deuxième pratique évite d'imposer une longue carrière au coup à un joueur qui préfère les leurres. Les spécialisations progressent ensuite en parallèle. Les poissons d'un habitat accessible sont éligibles dès que leur présence et la présentation sont cohérentes ; leur niveau de collection ne les fait pas disparaître arbitrairement.

## 3. Carte et postes autour d'un plan d'eau

### Construction mobile

Commencer avec un seul étang cohérent et six postes prédéfinis. La carte est une vue simplifiée du rivage, avec des repères tactiles espacés. Choisir un poste déplace la caméra et le point de pêche dans la même scène. Une courte transition permet de changer les éléments proches si nécessaire.

Ne pas ajouter de déplacement libre pour cette première version. Chaque poste possède une position de joueur, une orientation, un secteur autorisé de placement/lancer et une zone de réception. La structure pourra recevoir plusieurs positions prédéfinies par poste plus tard. Réutiliser eau, ciel, végétation, éclairage et assets existants ; aucun nouveau modèle généré n'est requis.

| Poste proposé | Accès initial | Contraintes locales | Opportunités de jeu |
| --- | --- | --- | --- |
| Ponton dégagé | Ouvert | Peu d'obstacles, réception aisée | Apprentissage, petits poissons et occasions de surprise |
| Anse abritée | Ouvert | Faible profondeur, quelques herbiers | Placement précis et observation du flotteur |
| Rive ouverte | Ouvert | Plusieurs distances et profondeurs exploitables | Découverte des leurres et comparaison des présentations |
| Bordure des roseaux | Occupée jusqu'au palier Exploration | Couloirs étroits, accrochages près des herbiers | Amorçage local et maîtrise de la direction du fil |
| Pointe et cassure | Verrou Spécialisation | Vent latéral, relief du fond, éloignement | Lecture du milieu et gestion de profondeur |
| Bois immergé | Verrou Maîtrise | Branches, angles de sortie limités | Présentation précise et anticipation des obstacles |

La « pointe et cassure » pourra être séparée en deux postes dans une extension. Pour le prototype, conserver six postes afin de limiter les travaux de scène et de réglage.

### Définition de la difficulté

La difficulté d'un poste provient de son environnement : place disponible pour lancer, précision utile, végétation, branches, profondeur, vent, dérive, distance et accès à une zone de réception. Utiliser seulement les contraintes réellement simulées. Un poste ne doit pas afficher une difficulté due au vent si le vent est purement décoratif.

Aucun multiplicateur global de force, de fatigue ou de dégâts du poisson ne dépend du niveau du poste. Un même individu conserve ses capacités intrinsèques. Près d'une branche, sa fuite habituelle peut toutefois produire une situation délicate : le joueur doit réorienter sa canne et garder sa ligne dégagée. Un petit poisson peut rester facile dans un poste technique ; un grand spécimen peut demander de l'attention au ponton.

La fiche du poste montre une difficulté courte (« Accessible », « Technique », « Exigeant »), deux contraintes réelles, les pratiques adaptées et quelques indices de milieu. Les espèces non découvertes restent suggérées par des indices, pour préserver le FishDex.

### Pêcheur occupant un poste

L'occupation sert de mise en scène d'un déblocage permanent. Exemple : « Je te laisse cette place après ton initiation aux bordures : atteins le niveau 3 ou réussis le défi de précision au ponton. » Le personnage peut offrir un conseil sur les herbiers.

Afficher la condition dès la première visite. Après l'objectif, le poste devient définitivement accessible. Ne pas exiger une attente réelle, une heure de connexion, une dépense répétée ou un tirage aléatoire. Le personnage pourra ensuite apparaître ailleurs en décor. Vérifier qu'il existe toujours un objectif réalisable avec le kit gratuit.

Changer de poste n'est possible qu'après avoir remonté sa ligne et hors combat. Si une touche est en cours, l'interface indique l'action nécessaire ; elle ne provoque pas une perte silencieuse du montage. Pas de frais de trajet dans ce premier étang.

## 4. Répartition des poissons et sélection des rencontres

### Fondement biologique et traduction en jeu

La Fédération de pêche de Gironde décrit l'affinité de la perche pour les obstacles immergés et des eaux relativement profondes [S1]. L'association régionale d'Île-de-France décrit le gardon dans les eaux tempérées lentes ou stagnantes, et les couloirs de végétation comme des postes intéressants [S2]. Ces observations soutiennent des affinités d'habitat ; elles ne fournissent aucun pourcentage de rencontre pour notre jeu.

Pour chaque espèce déjà présente dans le catalogue, conserver : habitats, profondeurs plausibles, alimentation, activité, présentations pertinentes et sources. Distinguer comportement de recherche de nourriture et comportement après ferrage. Une description « chasseur visuel » ne prouve pas à elle seule une vitesse ou une endurance de combat.

Configurer d'abord les espèces réellement jouables avec les assets existants. Les espèces prévues peuvent avoir leurs données préparées et leur statut futur, sans apparaître comme capturables. Les profils comportementaux doivent garder une variation individuelle : une espèce possède des tendances, pas une séquence identique pour tous ses individus.

### Calcul de rencontre

1. Filtrer par plan d'eau, espèce implémentée, habitat et présentation biologiquement possibles.
2. Identifier la microzone réellement atteinte : bordure, eau ouverte, herbier, cassure, bois, profondeur.
3. Pondérer les candidats par abondance locale, affinité d'habitat, activité et intérêt pour la présentation.
4. Appliquer les effets temporaires implémentés : amorçage local, dérive ou passage d'un leurre à une certaine profondeur.
5. Normaliser les poids valides ; tirer une rencontre et un individu dans une distribution locale de tailles configurée.

Une présentation impossible donne un poids nul. Un poisson qui peut être pris aux appâts naturels et aux leurres doit pouvoir bénéficier de ces deux voies, avec des appâts et animations appropriés. Ne pas enfermer chaque espèce dans une seule pratique par commodité.

L'absence de candidat produit une période sans activité accompagnée, si nécessaire, d'un indice contextuel discret. Elle ne déclenche pas une espèce incohérente. Éviter les aides cachées qui garantiraient un trophée après un nombre de lancers ; si un tutoriel utilise une capture guidée, la définir séparément.

Pour une ligne statique, évaluer l'activité autour de la présentation et de l'amorçage. Pour un leurre, évaluer sa trajectoire, sa profondeur, sa vitesse et ses pauses. Aucun poisson ne doit être définitivement sélectionné au début du lancer si la boucle promet que son animation influence la touche.

Les coefficients sont ajustables et versionnés. Les taux affichés comme exemples dans les outils de développement restent des paramètres de jeu, sans prétendre mesurer une population réelle. La carte peut montrer « perches observées près des branches » après découverte, plutôt qu'un pourcentage exact dans le HUD.

## 5. Pratiques : des décisions différentes avant et après la touche

Le lancer est un geste utilisé par plusieurs pratiques. Le flotteur est un composant de montage : il peut servir au coup sans moulinet ou avec un moulinet dans d'autres pratiques. Le catalogue doit donc séparer pratique, équipement et montage.

| Pratique | Action principale avant la touche | Signal de touche | Gestion après ferrage |
| --- | --- | --- | --- |
| Coup sans moulinet | Placer à portée, régler la profondeur, amorcer localement | Flotteur qui s'enfonce, remonte ou se déplace | Canne et éventuellement élastique ; rapprochement à portée et réception |
| Flotteur avec moulinet | Lancer, régler la profondeur et contrôler la dérive | Flotteur | Canne, frein et récupération de ligne |
| Leurres | Prospecter, choisir profondeur, vitesse, pauses et animation | Changement de tension, contact et mouvement perceptibles | Canne, frein et récupération |
| Posé / fond | Déposer précisément le montage, régler la présentation | Fil, scion ou indicateur selon montage | Ferrage ou auto-ferrage approprié, puis gestion canne/moulinet |
| Feeder | Remplir la cage, atteindre une zone d'amorçage, renouveler le dépôt | Scion sensible | Ferrage puis gestion canne/moulinet |
| Mouche | Préparer le lancer et présenter/faire dériver selon contexte | Mouche visible, indicateur ou ligne selon montage | Gestion de ligne et canne ; moulinet selon situation |

### Prototype A : coup sans moulinet

La source Caperlan présente le placement de ligne, le sondage et l'amorçage comme des composantes du coup [S3]. Traduction proposée : placement proche limité par la longueur de canne/ligne ; réglage simple de profondeur dans Ma canne ; petite action d'amorçage local ; observation de touches visuelles variées avant ferrage.

Le joueur apprend à reconnaître une vraie touche sans répondre à une succession de faux signaux arbitraires. L'équilibrage du flotteur et la profondeur changent la lisibilité et la pertinence de la présentation. Un montage incohérent doit pouvoir être corrigé avec une explication courte dans la préparation du matériel.

Pendant le combat, la distance de la ligne est physiquement limitée. Piloter la canne, utiliser son amortissement et éventuellement l'élastique permettent d'amener le poisson dans la zone de réception. Il n'existe pas de récupération par moulinet sur une canne qui n'en possède pas. Pour la grande canne, implémenter un déboîtement simplifié mais effectif : une action contextuelle raccourcit les sections jusqu'au kit, sous contrôle de tension ; elle prépare la réception sans téléporter le poisson ni annuler l'élastique.

### Prototype B : leurres

Le guide Caperlan décrit différentes animations : récupération continue, variations de vitesse, pauses et mouvements du scion [S4]. Traduction proposée : choix de trajectoire, temps de descente, vitesse de récupération et petites animations de canne. La touche peut survenir pendant le mouvement ou une pause cohérente avec le leurre.

Pour mobile, proposer une vitesse de récupération facilement ajustable et un geste de canne lisible. Éviter une succession obligatoire de figures à mémoriser. Le retour principal passe par le leurre, le fil, la canne, le son et quelques effets sobres. Les indicateurs pédagogiques temporaires se désactivent après compréhension.

### Posé, feeder et mouche : implémentation requise

Implémenter les emplacements de montage, états et interactions, puis rendre ces méthodes jouables pendant ce chantier. Le feeder se distingue par sa cage d'amorçage et la lecture du scion sensible [S5] ; il ne doit pas recevoir automatiquement le même flotteur et les mêmes signaux que le coup.

Pour le posé, prévoir les différences entre ligne à ferrer et montage correctement auto-ferrant. Pour la mouche, séparer lancer, présentation et gestion de ligne. Un simple changement d'image d'appât ne constitue pas une nouvelle pratique implémentée.

### Matrice de couverture : 22 méthodes et approches

Cette matrice est une proposition d'adaptation mobile. Les identifiants proviennent du fichier `data/methodes.json` du dossier matériel. Les règles physiques et les pratiques doivent être vérifiées avec les sources du dossier ; compléter celles marquées `partial` ou `needs_research`. Les gestes proposés ne sont pas présentés comme une simulation complète de la gestuelle réelle.

| ID / pratique | Boucle mobile à implémenter | Différence effective / contexte |
| --- | --- | --- |
| `coup` — télescopique | Placer à portée, sonder, régler, amorcer, observer puis ferrer | Ligne fixe, longueur limitée, réception sans moulinet |
| `grande_canne` — emmanchements | Avancer/placer le montage, retenir la ligne, ferrer, contrôler l'élastique, déboîter pour recevoir | Longueur et sections ; amortissement de l'élastique |
| `anglaise` — waggler | Lancer, régler la profondeur, contrôler la bannière et observer le flotteur | Fixe/coulissant ; distance, profondeur et gestion de ligne avec moulinet |
| `bolognaise` | Placer en amont, accompagner ou retenir une dérive puis ferrer | Courant simulé, longue canne et contrôle de la trajectoire |
| `fond` — plombée | Lancer, laisser poser, tendre correctement, lire fil/scion puis ferrer | Lest coulissant ou fixe ; présentation réellement au fond |
| `feeder` — cage | Remplir, lancer dans la même zone, laisser diffuser, lire le scion | Amorçage spatial, cage qui se vide, précision des dépôts |
| `method_feeder` | Garnir le feeder, placer l'esche à proximité, lancer et suivre le départ | Présentation groupée, tenue du remplissage, fonctionnement du montage choisi |
| `carpe` — posé | Préparer cheveu/esche/lest, amorcer puis déposer précisément et répondre au départ | Présentation au fond, esche coulante/équilibrée/flottante, auto-ferrage seulement si adapté |
| `stalking` — approche | Observer la bordure, approcher sobrement et présenter à courte portée | Méfiance et bruit locaux ; utilise un montage compatible existant |
| `surface` | Déposer une esche flottante, contrôler la dérive et observer sa prise | Esche en surface, inspection visible et moment de ferrage |
| `leurre` | Lancer, atteindre une couche d'eau, récupérer, animer, interrompre puis reprendre | Trajectoire et animations compatibles avec chaque leurre |
| `verticale` | Descendre sous le poste, choisir la couche, faire de petites levées/pauses | Présentation verticale ; ponton profond ou embarcation |
| `mort_manie` | Monter un poisson-appât, animer par tirées et relâchés avec pauses | Monture et appât consommable ; trajectoire différente selon plombée |
| `toc` | Déposer en amont, régler plombée et accompagner la dérive | Courant, vitesse de l'esche, indicateur/contact ; pas un flotteur obligatoire |
| `mouche` | Choisir sèche/noyée/streamer, préparer le lancer, présenter et gérer soie/dérive ou animation | Masse de soie ; courte gestuelle guidée, libération au moment choisi |
| `nymphe_fil` | Déposer, suivre l'indicateur et contrôler profondeur/vitesse de dérive | Nymphe immergée et contact ; contexte de rivière |
| `bombette` | Choisir flottabilité, lancer l'esche légère puis récupérer avec pauses | Corps porteur, couche d'eau et long bas de ligne |
| `gambe` | Descendre le train d'imitations, choisir la couche, lever doucement et lire la touche | Montage à plusieurs potences ; eau profonde adaptée |
| `traine` | Déployer une ligne, choisir vitesse et parcours de bateau, suivre le leurre puis gérer la touche | Le déplacement de l'embarcation anime la présentation |
| `clonk` | Placer à la verticale, produire une courte série sonore, laisser une pause et observer | Action du clonk, profondeur et réaction conditionnelle du silure |
| `ultraleger` — approche | Boucle leurres avec petites présentations et ensemble léger | Précision, sensibilité et marges de résistance propres ; moteur partagé |
| `carpodrome` — approche | Boucle grande canne avec amorçage et ensemble adapté au plan d'eau | Élastique, contrôle et réception ; moteur grande canne partagé |

Une méthode est terminée lorsqu'un joueur peut préparer son ensemble, présenter correctement, obtenir une touche plausible, ferrer selon ses règles, combattre, recevoir, photographier et sauvegarder. Les approches ne justifient pas de dupliquer les moteurs ; elles doivent modifier effectivement contexte, équipements ou décisions.

### Contextes nécessaires pour tout tester

Conserver l'étang principal et ses six postes. Ajouter une zone de test de rivière avec courant réel pour toc, bolognaise et nymphe ; une zone de lac profond pour verticale et gambe ; une embarcation légère pour traîne et clonk. Ces contextes peuvent être des variantes sobres de scène utilisant les assets existants et des formes procédurales. Une interface de choix suffit, sans monde ouvert ni conduite complexe. La traîne doit toutefois faire réellement avancer le point de pêche et la présentation le long d'un parcours contrôlable.

Les zones de test utilisent des populations compatibles. Ne pas simuler une rivière en changeant seulement le nom du spot, ni faire apparaître une espèce absente de l'habitat pour prétendre couvrir la méthode. Si un modèle d'espèce requis manque, tester sa présentation et son combat dans un scénario technique avec représentation provisoire clairement identifiée ; conserver cette prise hors collection. La chaîne de capture complète peut être validée avec une espèce compatible déjà représentée. Documenter toute couverture manquante.

Pour `gambe`, instancier les potences et les interactions des imitations, avec une politique explicite pour une éventuelle seconde prise : pas de seconde récompense sans individu effectivement simulé et reçu. L'interface de combat reste lisible. Vérifier les limites pratiques avant de fixer le nombre de potences dans la configuration.

### Recettes, appâts et présentation

Raccorder toutes les recettes cataloguées aux méthodes compatibles : plombée, coulissement, cheveu, pop-up/wafter, clip de lest, fixation d'hameçon, tête plombée, drop-shot, montages de leurres, soie/pointe et autres variantes du dossier. Chaque propriété promise produit un effet mesurable. Réutiliser des modèles paramétrés ; il n'est pas nécessaire de créer un mini-jeu par recette ou SKU.

Prévoir les couches d'eau, la vitesse de descente, la flottabilité, la position des composants, les temps de diffusion de l'amorce, la tenue de l'esche et les animations autorisées. L'équilibrage du flotteur dépend de la portance et de sa charge totale. Les dimensions d'un objet modifient ses paramètres au lieu de dupliquer la logique.

## 5 bis. Mode Développement / Bac à sable

### Activation et sauvegardes

Créer une entrée compacte « Mode test » dans les réglages de la version de développement, avec retour immédiat à la partie normale. Fournir la procédure exacte pour l'ouvrir sur téléphone. La configuration du build/du projet contrôle sa disponibilité ; ne pas activer automatiquement ce mode pour tous les joueurs de la version normale.

Créer un profil de test séparé : portefeuille, stock, captures, FishDex, badges et aquarium de test indépendants. L'activation ne modifie pas la sauvegarde normale ; le retour restaure celle-ci sans y importer l'argent, les achats ou les captures de test. Rechargement, export et import conservent cette séparation. Afficher un discret badge TEST hors combat et un rappel dans les menus.

### Argent illimité et accès libre

Afficher `∞` dans le portefeuille de test. Toutes les transactions valides sont autorisées sans contrainte de solde. Ne pas stocker `Infinity` comme nombre JSON : utiliser un indicateur de mode et conserver des valeurs finies. Prix, quantités, compatibilités, achats et réservation fonctionnent normalement. Journaliser le coût théorique pour pouvoir comparer les ensembles.

Permettre toutes les pratiques implémentées, leurs équipements achetables et les spots de test indépendamment des paliers, raretés ou pêcheurs occupants. Cela ne valide pas automatiquement les objectifs ni la collection. Le mode test ne rend pas un montage incompatible valide et ne transforme pas une fonction non programmée en fonction jouable.

Les pertes de matériel et la consommation restent actives par défaut, car elles font partie du gameplay à vérifier. Ajouter séparément « Réapprovisionner mon sac » et une option « Stock illimité ». L'argent illimité ne doit pas empêcher de tester une casse, une rupture, un stock épuisé ou un achat normal.

### Outils de scénarios

- Ensemble prêt à pêcher pour chaque méthode, avec accès immédiat à ses variantes et à son montage.
- Choix d'un poste, d'une microzone, du courant, du vent et du moment de la journée lorsqu'ils influencent réellement le moteur.
- Choix d'une espèce implémentée et d'un gabarit, puis scénario « touche rapide » ou « combat direct » ; affichage clair des prérequis biologiques contournés dans ce scénario.
- Rejouer le même poisson et la même situation avec une graine fixe, pour comparer deux équipements.
- Déclencher un décrochage, une casse localisée, un accrochage et une libération ; vérifier stock et explication affichée.
- Réinitialiser seulement le profil de test ; créer aussi une partie de test neuve en règles normales avec argent limité.
- Diagnostics repliables : profondeur, tension, composants, cause d'échec, durée et coûts simulés. Aucun tableau permanent au-dessus du terrain de pêche.

Les scénarios forcés et le stock illimité sont des outils d'essai. Les tests de distribution naturelle et d'équilibre économique se font avec ces aides désactivées. Une récompense n'est comptabilisée qu'une fois par capture, même en test.

## 5 ter. Systèmes de gameplay à livrer

La demande couvre la chaîne complète, au-delà des méthodes. Chaque système ci-dessous doit avoir un comportement fonctionnel, des données configurables et un scénario de vérification.

1. **Préparation** : sélection de canne puis méthode compatible, assemblage réel, montage équilibré, stocks et réglages ; ensembles sauvegardés et réparables.
2. **Présentation** : portée, précision, profondeur, plombée, flottabilité, récupération, animation, dérive, amorçage et discrétion selon la méthode.
3. **Milieu** : carte, postes, microzones, obstacles, zones de réception, courant et vent lorsqu'utilisés ; situations de test appropriées.
4. **Rencontre** : habitat, alimentation, appât pertinent, activité, approche/examen/suivi/attaque/refus ; événements indépendants du nombre d'images par seconde.
5. **Touche et ferrage** : signaux visuels/sonores propres ; délai lisible ; ferrage manuel ou mécanisme du montage approprié ; pas de touche commune artificielle pour toutes les pratiques.
6. **Combat** : comportements d'espèce et variations individuelles, tension basse/utile/haute, élasticité, flexion, frein, réserve de ligne, fatigue, distance et obstacles ; transitions explicables.
7. **Échecs** : décrochage, accrochage, rupture localisée, perte des composants détachés, consommation atomique, récupération/réparation et secours gratuit.
8. **Réception** : rapprochement réel, petite prise ou épuisette/tapis selon gabarit ; étape contextuelle courte ; poisson identique au spécimen simulé. Les animations provisoires par code sont autorisées et documentées.
9. **Capture** : taille, masse, variété plausible, rareté du spécimen, photo rémunérée une seule fois, carnet filtrable et records.
10. **Collection** : découverte de fiches et variétés, avancement FishDex, indices, maîtrise par espèce et objectifs réalisables.
11. **Progression** : XP, niveaux, maîtrises de pratique, badges, conditions de déblocage et choix de spécialisation ; indépendance entre puissance du matériel et méthode.
12. **Économie** : prix, quantités, achats, valeur des photos, coûts exposés et reprise après perte ; argent illimité uniquement dans le profil de développement.
13. **Aquarium** : choix de cinq spécimens capturés au maximum, nage et personnalisation déjà prévues, conservation de l'identité et du profil de sauvegarde.
14. **Session et ergonomie** : états cohérents, pause, interruption, changement de poste/méthode, apprentissage contextuel, feedback sobre, sauvegarde/migration et gestes tactiles propres.

Lire le périmètre déjà défini dans les autres documents du projet et intégrer les fonctionnalités de gameplay qui y sont présentes. Les nouveaux modèles 3D ne sont pas une condition pour commencer : réutiliser les assets, images, schémas et animations par code. Aucune nouvelle génération 3D ni abonnement supplémentaire n'est demandé.

### Combat commun, interactions adaptées

Utiliser un même noyau de simulation : déplacement du poisson, tension, élasticité, résistance des composants, maintien de l'hameçon, fatigue, distance et obstacles. Chaque pratique fournit les outils et actions qu'elle permet réellement.

Le prototype de combat récemment proposé, avec gestion de canne et récupération assistée selon l'état du poisson, peut être testé sur les ensembles avec moulinet. La branche coup reçoit un adaptateur sans récupération fictive. Conserver le prototype comme mode de test tant qu'il n'a pas été évalué au toucher sur téléphone.

Une tension trop basse prolongée augmente le risque de décrochage, avec une tolérance brève lisible. Une surtension augmente le risque de rupture, selon le maillon faible et la durée. Une tension utile fatigue progressivement le poisson. La récupération devient plus efficace lorsqu'il cède ; un petit poisson laisse davantage de marge avec un ensemble adapté. Éviter une consigne permanente de garder le fil détendu.

Après ferrage, avec un montage au flotteur, le fil et la canne portent les informations principales ; le flotteur peut rester immergé et réapparaître près du bord. Les méthodes sans flotteur utilisent leurs signaux propres. Ne pas exiger de suivre des jauges multiples pour réussir.

## 6. Ma canne, Mon sac, Ensembles et Boutique

L'organisation suit la préparation d'une vraie session.

**Ma canne** : aperçu central de la canne avec repères tactiles ; pratique active ; canne, moulinet si pertinent, corps de ligne ; accès au montage détaillé. Une fiche compacte résume portée, compatibilité, capacité et risque principal. Changer de pratique propose un ensemble compatible en préservant l'ancien ensemble.

**Montage** : schéma lisible de la ligne, composants sélectionnables dans l'ordre utile. Afficher uniquement les emplacements pertinents : flotteur/plombée/profondeur au coup, leurre/agrafe/bas de ligne aux leurres, plomb/hameçon/appât au posé, cage au feeder. Toutes les familles du périmètre reçoivent leur atelier et leurs règles fonctionnelles.

**Mon sac** : catégories, quantités, matériel possédé et réserve de consommables. Liste compacte, recherche et filtres adaptés ; détails et comparaison dans une fiche dédiée. La rareté est un petit repère avec libellé. L'onglet ne mélange pas tous les articles de boutique avec le matériel possédé.

**Ensembles** : sauvegarder et retrouver un montage par pratique/usage. Après rupture, montrer ce qui manque ; proposer « Réparer avec ma réserve » puis le kit gratuit compatible en secours. Ne pas payer ou consommer silencieusement des pièces chères.

**Boutique** : achats, progression et aperçu des objets verrouillés. Montrer quantité, prix, compatibilité, intérêt concret et condition exacte d'accès. Distinguer disponible, verrouillé, possédé et à venir. Une variante non implémentée ne doit pas être achetable.

**Carte** : accès depuis une commande compacte hors combat ; sélection de poste et petite fiche. Le menu principal conserve le FishDex comme accès de collection prioritaire. Sur l'écran de pêche, afficher les informations indispensables dans le contexte où elles servent. Conserver les formulaires utilisables et le défilement des menus malgré la gestion tactile du jeu.

## 7. Progression et économie

Le niveau général ouvre des possibilités ; les maîtrises de pratique récompensent l'apprentissage ; le FishDex récompense la découverte. Les records personnels et les variétés soutiennent les retours sur les anciens postes. Éviter que la première rive devienne inutile après deux niveaux.

Boucle proposée : observer un indice de milieu → préparer un ensemble → choisir un poste et une microzone → réussir présentation et capture → photographier le spécimen → découvrir une fiche/variété ou améliorer un record → financer une spécialisation → explorer une nouvelle possibilité.

Les photos de captures habituelles restent rémunératrices. Ajouter des bonus explicites pour première découverte et record. Équilibrer les gains par minute en intégrant les temps d'attente, de déplacement, de préparation et les consommables perdus ; ne pas comparer seulement le prix d'un poisson.

Fournir un kit de secours gratuit, renouvelable et non revendable pour chaque pratique implémentée débloquée. Il est utilisable, avec des limites connues. La réparation d'un kit gratuit n'accorde ni argent ni expérience. La perte d'une pièce payante peut être compensée progressivement en jouant avec le kit de secours.

Lors d'une rupture, perdre seulement les composants réellement détachés du point de casse : par exemple, le bas de ligne et ce qui se trouve après. Préserver canne, moulinet et réserve non engagée. Un accrochage peut parfois être libéré avant rupture avec une action cohérente. Les premières pertes de la phase d'apprentissage utilisent le kit gratuit.

Le matériel améliore des capacités concrètes : précision, amortissement, sensibilité, contrôle, réserve ou adéquation à un spécimen. La maîtrise peut débloquer des réglages et offrir des conseils ; éviter des bonus invisibles qui changent arbitrairement les lois du combat.

## 8. Structure de données proposée

Adapter au dépôt existant. Noms ci-dessous conceptuels, à mapper sur les identifiants réels.

| Entité | Champs ou relations essentiels |
| --- | --- |
| Élément de catalogue | id, type, rareté, palier, condition d'accès, statut d'implémentation |
| Méthode | pratiques compatibles, emplacements de montage, présentation, signaux, adaptateur d'interaction |
| Équipement | capacités, compatibilités, propriétés physiques, prix, quantité, consommation, kit gratuit |
| Montage | pratique, composants ordonnés, réglages, maillon faible et état |
| Plan d'eau | postes, habitats, espèces présentes, ressources de scène |
| Poste | caméra, position, secteur, zone de réception, microzones, obstacles, accès, occupation |
| Espèce | habitat, alimentation, présentation, activité, profil comportemental, sources, statut jouable |
| Population locale | espèce, abondance, affinités de microzone, distribution de tailles |
| Spécimen | espèce, taille, masse, variété plausible, paramètres individuels, rareté du spécimen |
| Progression | niveau, maîtrises, découvertes, records, conditions remplies, postes ouverts |

Séparer propriété du joueur et disponibilité du catalogue. Vérifier les conditions côté logique d'achat/équipement et à l'affichage. Les règles de déblocage doivent pouvoir exprimer un OU entre niveau et objectif, sans confondre cela avec l'obligation de tout remplir.

Centraliser les poids de rencontres, seuils, tarifs et récompenses dans une configuration versionnée. Donner aux données un statut factuel : renseigné depuis source, hypothèse de jeu ou à documenter. Les interfaces joueur affichent seulement les informations utiles ; ces détails restent dans les outils de développement.

Migration : conserver les anciennes captures, photos, XP, argent, records, poissons d'aquarium, objets possédés et capacités déjà ouvertes. Reconnaître les droits acquis lors de la migration plutôt que retirer des accès avec les nouveaux paliers. Ne pas réinitialiser une sauvegarde pour adapter le schéma.

## 9. Ordre d'implémentation

### Étape 1 — Audit, fondations et profil de test

Lire les instructions du dépôt, les fichiers de relais, les systèmes de sauvegarde, de catalogue, de pêche, d'achat et de rendu. Relever les identifiants réellement utilisés. Inventorier toutes les méthodes, recettes et systèmes de gameplay, puis créer une matrice de suivi. Ajouter la configuration de rareté, accès et compatibilité. Écrire la migration et les validations nécessaires. Créer le profil de test séparé avec argent illimité et accès aux contenus fonctionnels. Mettre à jour le fichier de relais avec décisions, changements, vérifications et limitations.

### Étape 2 — Un étang et ses six postes

Créer la carte, les ancrages de caméra, trois postes ouverts en progression normale, les indices de milieu et les déblocages des autres postes. Les six postes sont utilisables dans le profil de test et leurs contraintes sont réellement simulées. Ajouter les microzones et une distribution cohérente pour les poissons existants. Réutiliser les assets disponibles. Construire les contextes de test rivière, profondeur et embarcation nécessaires aux autres techniques.

### Étape 3 — Toutes les familles de gameplay

Commencer par valider le noyau avec coup et leurres, puis poursuivre sans s'arrêter à ces deux techniques. Implémenter grande canne/élastique, flotteur avec moulinet/dérive, fond/feeder/carpe, appâts animés/verticale, mouche/nymphe, puis gambe/traîne/clonk. Raccorder les 22 méthodes et approches, les recettes et les propriétés de composants à ces moteurs partagés. Compléter les recherches insuffisantes pour les pratiques concernées. Ajouter les signaux, ferrages et combats adaptés, avec scénarios répétables pour chaque entrée. Préserver les fonctionnalités déjà présentes.

### Étape 4 — Organisation du matériel et progression

Construire Ma canne, le détail du montage, Mon sac, Ensembles, les filtres de Boutique et les conditions de déblocage. Intégrer quantités, pertes de composants, réparation explicite et secours gratuit. Relier découvertes et objectifs au FishDex. Garder les menus compacts et le terrain de pêche dégagé.

### Étape 5 — Chaîne complète et équilibrage

Terminer tous les systèmes de la section 5 ter : réception, photo, carnet, FishDex, progression, économie, aquarium et interruptions. Vérifier chaque méthode de préparation jusqu'à sauvegarde. Ajuster équilibre et confort à partir de sessions mesurées, avec aides de test désactivées pour les mesures naturelles. Les lots sont un ordre de réalisation, pas une réduction de l'objectif. Une limite technique persistante doit être précisée dans le relais avec le travail restant ; aucun simple écran À venir ne satisfait l'implémentation d'une technique du périmètre.

## 10. Vérifications et équilibrage

### Scénarios d'acceptation prioritaires

- Nouvelle partie : trois postes visitables, kit gratuit valide, première capture possible, deuxième pratique accessible après une courte initiation.
- Couverture : les 22 méthodes/approches sont essayables dans leurs contextes, chacune avec un ensemble compatible et une chaîne de pêche complète ; recettes et variantes ont leurs effets annoncés.
- Mode test : argent affiché ∞, achats et accès libres, quantités et compatibilités cohérentes ; aucune valeur numérique infinie dans la sauvegarde.
- Profils : l'activation, le rechargement et le retour au jeu normal n'importent aucun argent, objet ou prise de test dans la partie normale.
- Scénarios : même graine et même individu permettent une comparaison ; casse/décrochage/stock épuisé peuvent être vérifiés sans attendre.
- Contextes : courant fonctionnel pour les dérives, profondeur pour les techniques verticales, déplacement réel du point de pêche pour la traîne.
- Carte : condition exacte visible pour un poste occupé ; accès permanent après validation ; aucune dépendance circulaire.
- Ancienne sauvegarde : possessions, progression et captures conservées ; aucun retrait d'accès acquis.
- Coup : portée cohérente, signal de flotteur, réglage de profondeur, absence de récupération par moulinet inexistant.
- Leurres : profondeur et animation participent réellement à l'éligibilité de la touche ; absence de flotteur imposé.
- Habitat : une espèce incompatible n'apparaît pas ; plusieurs pratiques peuvent capturer une même espèce quand pertinent.
- Combat : le lieu ne modifie pas la force intrinsèque ; obstacles et tension ont des conséquences compréhensibles.
- Rupture : perte cohérente avec le point de casse ; canne, moulinet et réserve préservés ; kit gratuit disponible.
- Interface : menu défilable, champs éditables, boutons accessibles au pouce, sortie claire et faible encombrement pendant la pêche.

### Banc d'essai

Pour les ensembles avec moulinet : trois individus représentatifs, trois ensembles adaptés de capacités différentes, deux environnements (dégagé/encombré), soit 18 situations comparables. Fixer les graines aléatoires et comparer le même individu avant/après une modification. Ajouter des scénarios propres au coup, puis comparer entre méthodes uniquement les espèces et situations compatibles.

Mesurer : temps avant touche, durée de capture, taux de réussite, cause des échecs, dépenses, gains nets par minute et fréquence des découvertes. Distinguer difficulté de présentation, rencontre d'un individu exigeant et difficulté de réception. Les petits poissons avec un matériel approprié doivent garder un rythme court ; les individus remarquables demandent davantage de décisions sans combat interminable.

Vérifier qu'une amélioration aide dans son domaine sans rendre toute autre pièce inutile. Aucune pratique ne doit dominer systématiquement la progression, les revenus et la collection. Un kit de secours doit permettre un retour économique réel sans stratégie de revente infinie.

Effectuer des tests humains au toucher sur téléphone pour compréhension, plaisir et fatigue du pouce. Une simulation ou une fenêtre à taille mobile ne prouve pas la fluidité sur iPhone. Relever les performances du matériel réellement testé ; ajuster effets et densité de scène à partir de mesures. La carte et les postes doivent réutiliser les ressources, sans accumuler des scènes actives à chaque changement.

## 11. Instruction à transmettre à Codex

> La demande a évolué : implémente toutes les techniques de pêche du catalogue et tous les systèmes de gameplay décrits dans cette version 2. Les anciennes consignes qui limitaient le chantier à deux techniques ou prévoyaient seulement des écrans À venir pour les autres sont remplacées. Lis le document, les instructions du dépôt, le dossier matériel et le relais. Audite les fonctions existantes et établis la correspondance des identifiants. Crée d'abord un Mode test facilement accessible sur mobile, avec sauvegarde séparée, argent illimité affiché ∞, équipements achetables sans limite de solde et accès aux méthodes/spots implémentés. Conserve les prix et les règles de stock, de compatibilité et de casse pour les essais ; ajoute les outils de scénario de la section 5 bis. Implémente les 22 méthodes et approches avec leurs gameplay propres, les recettes et composants, ainsi que les contextes rivière, lac profond et embarcation qui sont nécessaires. Utilise des moteurs partagés sans effacer les différences de présentation, de touche et de ferrage. Chaque méthode doit permettre préparation, pêche, combat, réception, photo et sauvegarde. Mets en œuvre les spots, distributions de poissons, comportements, tension, frein, obstacles, pertes, réparation, économie, XP, maîtrises, badges, FishDex, carnet et aquarium prévus. Organise Ma canne, montage, Mon sac, Ensembles et Boutique. Réutilise les assets actuels, des schémas et des animations procédurales ; aucune génération de modèles 3D ni nouvel abonnement. Préserve les sauvegardes normales et les droits acquis. Développe et vérifie par lots, mais poursuis jusqu'à couvrir le périmètre plutôt que terminer après coup et leurres. Complète les sources insuffisantes avant de fixer les règles des techniques concernées. Produis une matrice par méthode et système : fonctionnel, contrôlé, à tester au toucher ou bloqué avec cause précise. Une entrée JSON ou un bouton ne prouve pas un gameplay livré. Actualise le relais et fournis la procédure exacte pour tout essayer sur téléphone, ainsi que les vérifications réellement exécutées.

## 12. Sources consultées et limites

Consultées le 2 octobre 2026. Les sources expliquent des habitats et pratiques réels. Les raretés, paliers, récompenses, noms de postes et interactions mobiles de ce document sont des propositions de conception.

- [S1] Fédération de pêche de Gironde — La perche : https://www.peche33.com/ou-pecher-en-gironde/les-poissons-et-techniques/les-carnassiers/la-perche/
- [S2] Association régionale de pêche d'Île-de-France — Le gardon : https://www.peche-idf.fr/4953-le-gardon.htm
- [S3] Caperlan / Decathlon — Débuter la pêche au coup : https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-coup
- [S4] Caperlan / Decathlon — Animer son leurre souple : https://conseilsport.decathlon.fr/comment-animer-son-leurre-souple
- [S5] Caperlan / Decathlon — Débuter la pêche au feeder : https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-feeder
- [S6] Europêche — Animation au poisson mort manié : https://www.europeche.fr/fiches-conseils/peche-au-poisson-mort-manie-tout-est-dans-lanimation.html
- [S7] Rapala — Gold Miner, exemple de leurre de traîne en eau douce : https://www.rapala.fr/eu_fr/gold-miner
- [S8] Alpes Fishing — Montage d'une gambe à corégone : https://alpes-fishing.fr/comment-monter-une-gambe-a-coregone-lavaret-fera/
- [S9] Fédération de pêche des Deux-Sèvres — Le silure, dont approche au clonk : https://peche-en-deux-sevres.com/wp-content/uploads/Le-silure.pdf

Complément de la version 2 : les sources S6–S9 éclairent les présentations particulières ajoutées à la matrice. S6 décrit une animation par mouvements et pauses ; S7 illustre l'adaptation d'un leurre à la traîne ; S8 documente l'assemblage d'imitations sur potences. Les coefficients de réaction au clonk, les gestes mobiles et les probabilités restent des propositions de jeu. Les données commerciales ne sont pas des mesures générales d'efficacité.

Une fiche d'espèce documentée dans FishDex peut alimenter ce système, sous réserve de vérifier ses données et sa source. Ce cahier des charges ne constitue pas un inventaire validé de toutes les espèces ni de tous leurs comportements de combat.
