# FishDex — Progression, raretés, spots et méthodes

Date : 2 octobre 2026. Cahier des charges pour Codex et Claude.

## 1. Objectif et statut

Créer une progression de jeu de pêche solo sur navigateur mobile qui donne envie de découvrir des poissons, de préparer des montages et d'explorer un même plan d'eau. Le choix du lieu, du matériel et de la pratique doit changer les décisions du joueur.

Demandes actées : niveaux de rareté ; contenu progressivement accessible ; carte de lac ou d'étang avec postes prédéfinis ; poissons répartis selon leur habitat ; certains postes initialement occupés par un pêcheur ; difficulté environnementale ; pratiques de pêche réellement différentes. Direction artistique : Basalte & Turquoise. Le FishDex reste la collection principale, le carnet l'historique des prises.

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
| Spécialisation | Niveau 6 OU objectif technique annoncé | Pointe exposée, équipement spécialisé ; initiation au posé si implémentée |
| Maîtrise | Niveau 10 OU défi préparatoire pertinent | Cassure profonde puis bois immergé, selon les conditions propres à chaque poste |
| Prestige | Accomplissements de long terme | Collection, records, cosmétiques et défis remarquables |

Ces niveaux servent de première configuration ajustable. Une alternative par maîtrise utilise une pratique déjà accessible : aucun objectif ne doit dépendre du poste ou de l'objet qu'il débloque. Limiter chaque verrou à une ou deux conditions lisibles. Les contenus futurs restent marqués « À venir » et ne deviennent pas accessibles simplement parce que le niveau est atteint.

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

Pendant le combat, la distance de la ligne est physiquement limitée. Piloter la canne, utiliser son amortissement et éventuellement l'élastique permettent d'amener le poisson dans la zone de réception. Il n'existe pas de récupération par moulinet sur une canne qui n'en possède pas. La gestion complète du déboîtement des kits reste une extension ; la première version doit rester cohérente et lisible.

### Prototype B : leurres

Le guide Caperlan décrit différentes animations : récupération continue, variations de vitesse, pauses et mouvements du scion [S4]. Traduction proposée : choix de trajectoire, temps de descente, vitesse de récupération et petites animations de canne. La touche peut survenir pendant le mouvement ou une pause cohérente avec le leurre.

Pour mobile, proposer une vitesse de récupération facilement ajustable et un geste de canne lisible. Éviter une succession obligatoire de figures à mémoriser. Le retour principal passe par le leurre, le fil, la canne, le son et quelques effets sobres. Les indicateurs pédagogiques temporaires se désactivent après compréhension.

### Posé, feeder et mouche

Préparer dès maintenant les emplacements de montage, états et données nécessaires. Les rendre jouables progressivement après validation des deux premières boucles. Le feeder se distingue par sa cage d'amorçage et la lecture du scion sensible [S5] ; il ne doit pas recevoir automatiquement le même flotteur et les mêmes signaux que le coup.

Pour le posé, prévoir les différences entre ligne à ferrer et montage correctement auto-ferrant. Pour la mouche, séparer lancer, présentation et gestion de ligne. Un simple changement d'image d'appât ne constitue pas une nouvelle pratique implémentée.

### Combat commun, interactions adaptées

Utiliser un même noyau de simulation : déplacement du poisson, tension, élasticité, résistance des composants, maintien de l'hameçon, fatigue, distance et obstacles. Chaque pratique fournit les outils et actions qu'elle permet réellement.

Le prototype de combat récemment proposé, avec gestion de canne et récupération assistée selon l'état du poisson, peut être testé sur les ensembles avec moulinet. La branche coup reçoit un adaptateur sans récupération fictive. Conserver le prototype comme mode de test tant qu'il n'a pas été évalué au toucher sur téléphone.

Une tension trop basse prolongée augmente le risque de décrochage, avec une tolérance brève lisible. Une surtension augmente le risque de rupture, selon le maillon faible et la durée. Une tension utile fatigue progressivement le poisson. La récupération devient plus efficace lorsqu'il cède ; un petit poisson laisse davantage de marge avec un ensemble adapté. Éviter une consigne permanente de garder le fil détendu.

Après ferrage, avec un montage au flotteur, le fil et la canne portent les informations principales ; le flotteur peut rester immergé et réapparaître près du bord. Les méthodes sans flotteur utilisent leurs signaux propres. Ne pas exiger de suivre des jauges multiples pour réussir.

## 6. Ma canne, Mon sac, Ensembles et Boutique

L'organisation suit la préparation d'une vraie session.

**Ma canne** : aperçu central de la canne avec repères tactiles ; pratique active ; canne, moulinet si pertinent, corps de ligne ; accès au montage détaillé. Une fiche compacte résume portée, compatibilité, capacité et risque principal. Changer de pratique propose un ensemble compatible en préservant l'ancien ensemble.

**Montage** : schéma lisible de la ligne, composants sélectionnables dans l'ordre utile. Afficher uniquement les emplacements pertinents : flotteur/plombée/profondeur au coup, leurre/agrafe/bas de ligne aux leurres, plomb/hameçon/appât au posé, cage au feeder. Les familles futures ont une place dans les données et une entrée clairement annoncée.

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

### Étape 1 — Audit et fondations

Lire les instructions du dépôt, les fichiers de relais, les systèmes de sauvegarde, de catalogue, de pêche, d'achat et de rendu. Relever les identifiants réellement utilisés. Ajouter la configuration de rareté, accès et compatibilité. Écrire la migration et les validations nécessaires. Mettre à jour le fichier de relais avec décisions, changements, vérifications et limitations.

### Étape 2 — Un étang et ses six postes

Créer la carte, les ancrages de caméra, trois postes ouverts, les indices de milieu et un premier poste occupé avec condition réalisable. Les six postes sont définis ; ceux dont les contraintes ne sont pas simulées restent clairement en préparation. Ajouter les microzones et une distribution cohérente pour les poissons existants. Réutiliser les assets disponibles.

### Étape 3 — Deux boucles vraiment distinctes

Rendre le coup et les leurres jouables avec leurs équipements, montages, signaux et actions propres. Ne pas supprimer les pratiques déjà fonctionnelles : les adapter aux nouvelles règles ou signaler clairement leur statut réel. Ajouter le combat expérimental dans le périmètre adapté, avec moyen de comparaison pendant les tests.

### Étape 4 — Organisation du matériel et progression

Construire Ma canne, le détail du montage, Mon sac, Ensembles, les filtres de Boutique et les conditions de déblocage. Intégrer quantités, pertes de composants, réparation explicite et secours gratuit. Relier découvertes et objectifs au FishDex. Garder les menus compacts et le terrain de pêche dégagé.

### Étape 5 — Extensions et réglages

Implémenter progressivement posé, feeder puis autres pratiques selon faisabilité. Les places des contenus existent déjà, avec statuts honnêtes. Ajuster équilibre et confort à partir de sessions mesurées, puis envisager d'autres plans d'eau.

## 10. Vérifications et équilibrage

### Scénarios d'acceptation prioritaires

- Nouvelle partie : trois postes visitables, kit gratuit valide, première capture possible, deuxième pratique accessible après une courte initiation.
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

> Lis ce cahier des charges, les instructions du dépôt et le fichier de relais. Audite d'abord les systèmes existants et leurs identifiants. Mets en œuvre la progression, la classification de rareté et les postes autour d'un premier étang avec les assets actuels. Priorise une version jouable avec trois postes ouverts, un déblocage permanent mis en scène par un pêcheur, une distribution de poissons liée aux microzones et deux boucles distinctes : coup sans moulinet et leurres. Organise le matériel en Ma canne, montage détaillé, Mon sac et Ensembles, avec une Boutique dédiée. Les méthodes futures possèdent leur structure et un statut À venir. La difficulté du poste vient de ses contraintes effectivement simulées. Implémente le combat expérimental avec des adaptateurs cohérents selon les équipements. Préserve les droits acquis et les sauvegardes. Vérifie les pertes de composants et le kit gratuit de secours. Les chiffres du document sont une configuration de prototype à ajuster. Réalise les contrôles adaptés, documente ce qui fonctionne, ce qui manque et ce qui doit être testé au toucher, puis actualise le relais pour Claude.

## 12. Sources consultées et limites

Consultées le 2 octobre 2026. Les sources expliquent des habitats et pratiques réels. Les raretés, paliers, récompenses, noms de postes et interactions mobiles de ce document sont des propositions de conception.

- [S1] Fédération de pêche de Gironde — La perche : https://www.peche33.com/ou-pecher-en-gironde/les-poissons-et-techniques/les-carnassiers/la-perche/
- [S2] Association régionale de pêche d'Île-de-France — Le gardon : https://www.peche-idf.fr/4953-le-gardon.htm
- [S3] Caperlan / Decathlon — Débuter la pêche au coup : https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-coup
- [S4] Caperlan / Decathlon — Animer son leurre souple : https://conseilsport.decathlon.fr/comment-animer-son-leurre-souple
- [S5] Caperlan / Decathlon — Débuter la pêche au feeder : https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-feeder

Une fiche d'espèce documentée dans FishDex peut alimenter ce système, sous réserve de vérifier ses données et sa source. Ce cahier des charges ne constitue pas un inventaire validé de toutes les espèces ni de tous leurs comportements de combat.
