# FishDex — Gameplay mobile, progression et atelier de montage

Version 1 — 4 octobre 2026. Dossier de conception et mission de développement pour Codex et Claude.

## 0. Statut, priorité et lecture

Le joueur demande de formaliser puis développer une pêche plus accessible sur mobile : mini-défis de combat expressifs, familles de cannes compréhensibles, déblocages espacés et préparation tactile du montage. Les méthodes et les poissons sont déjà livrés selon le joueur. L’implémentation actuelle doit être auditée dans le dépôt ; ce dossier n’atteste pas son fonctionnement.

Ce document remplace les propositions de paliers rapprochés et précise le cadrage `FISHDEX_CADRAGE_CANNES_COMBATS_MATERIEL.md`. Les décisions fonctionnelles sont la référence pour ce chantier ; les chiffres explicitement marqués « valeurs initiales » sont à mesurer et ajuster. Les autres spécifications restent applicables hors de ce périmètre. Aucun nouveau moteur, abonnement, modèle 3D ou service hébergé n’est nécessaire.

Lire l’ensemble, puis réaliser les lots de la section 11 dans l’ordre. Ne pas engager simultanément une refonte du monde, des poissons ou de tous les menus. Réutiliser le dépôt, la DA Basalte & Turquoise, la boutique et les profils biologiques existants. La physique et le catalogue doivent avoir une source de vérité commune.

## 1. Expérience de référence

Cycle complet : choisir un poste → sélectionner une canne → choisir une méthode → ajuster le montage → présenter l’appât → lire la touche → ferrer si nécessaire → conduire le combat → recevoir → photographier → progresser et compléter le FishDex.

Chaque étape doit rester compréhensible en quelques gestes. Une méthode change surtout la présentation et la lecture de touche. La canne, le système de récupération et le poisson déterminent la conduite du combat. Les montages apportent des effets de profondeur, de descente, de contact, de ferrage et de résistance. Les postes apportent courant, obstacles, portée et habitats.

Les récompenses principales restent la prise photographiée, l’argent existant, l’XP, le FishDex et les badges de maîtrise. Les réussites de combat apportent satisfaction visuelle et progression de maîtrise ; elles n’ajoutent pas une nouvelle monnaie. Carnet et aquarium gardent leur rôle existant.

## 2. Progression : grandes étapes tous les quinze niveaux

### 2.1 Disponibilité, achat et équipement sont distincts

Une famille devient disponible à l’achat si le joueur atteint son niveau OU termine sa quête d’apprentissage. Il n’est jamais obligatoire de remplir ces deux conditions. La disponibilité donne accès au modèle de découverte et à son ensemble de base ; elle ne donne pas tous les modèles experts ni tous les montages avancés.

Pour l’équipement, il faut posséder les objets et disposer d’un montage compatible. Pour une pratique dépendant d’un contexte, il faut aussi un lieu de test ou un poste approprié. Le kit gratuit de départ reste accessible indéfiniment, même si le portefeuille est vide.

```text
famille_disponible = entitlement_ancien OU niveau >= palier OU quête_terminée
achat_possible = famille_disponible ET conditions_objet ET argent_suffisant
pratique_possible = ensemble_possédé ET capacités_compatibles ET contexte_adapté
```

Les quêtes s’ouvrent dix niveaux avant le palier, selon la table. Il s’agit d’une accélération par apprentissage, pas d’une deuxième barrière obligatoire. La condition de niveau porte sur l’accès à la quête ; une quête terminée reste acquise. Les objets de prêt et les profils de test ne remplissent pas la possession normale.

### 2.2 Ordre des familles

| Ordre | Nom public | Nom réel sur la fiche | Palier direct | Quête accessible | Difficulté d’apprentissage / 5 |
| --- | --- | --- | --- | --- | --- |
| 1 | Bordure | Canne au coup à ligne fixe | 1 | Tutoriel initial | 1 |
| 2 | Exploration | Canne aux leurres spinning ; casting en variante | 15 | Niveau 5 | 2 |
| 3 | Précision | Canne feeder | 30 | Niveau 20 | 2 |
| 4 | Distance | Canne anglaise et ensembles à lancer adaptés | 45 | Niveau 35 | 2 |
| 5 | Puissance | Canne au posé / carpe | 60 | Niveau 50 | 3 |
| 6 | Contrôle | Grande canne à déboîter | 75 | Niveau 65 | 3 |
| 7 | Rivière | Ensembles toc et bolognaise, présentés séparément | 90 | Niveau 80 | 3 |
| 8 | Soie | Canne à mouche et ensemble de nymphe | 105 | Niveau 95 | 4 |
| 9 | Profondeur | Ensembles pour verticale et gambe, présentés séparément | 120 | Niveau 110 | 3 |
| 10 | Traîne | Ensemble adapté à la traîne | 135 | Niveau 125 | 3 |
| 11 | Silure | Ensemble silure adapté au clonk | 150 | Niveau 140 | 4 |

Le palier mesure la place dans le parcours de découverte, pas une puissance ni une difficulté absolue. Profondeur peut arriver après Soie tout en demandant moins de précision tactile : elle apporte un contexte et du matériel différents. Rivière et Profondeur sont des rayons de découverte, pas des cannes universelles. Chaque objet conserve sa véritable identité.

Toutes les captures plausibles avec une autre famille restent possibles. Une carpe peut être prise au coup ou au feeder. Ne pas imposer une canne nommée « Puissance » par simple identité d’espèce. Spinning et casting sont deux ensembles compatibles avec des usages partagés, pas une évolution obligatoire du faible vers le fort.

### 2.3 Progression entre deux grandes étapes

À chaque intervalle de quinze niveaux, distribuer trois jalons secondaires aux décalages +4, +8 et +12 : découverte d’appât ou recette ; équipement complémentaire ; défi de maîtrise, personnalisation ou indice de collection. Les associer au contenu existant pour éviter des récompenses vides. La prochaine étape et un seul objectif actif sont visibles dans Progression ; ils n’encombrent pas l’écran de pêche.

Les variantes avancées s’obtiennent aussi par maîtrise de leur famille. Adapter les badges existants à cinq rangs fonctionnels : découverte, contact, conduite, présentation, spécialisation. Un rang exige une réussite distincte et reproductible, pas uniquement un nombre croissant de prises. Le joueur gagne l’XP générale avec sa pratique préférée ; aucun palier direct ne dépend d’avoir maîtrisé toutes les familles précédentes.

### 2.4 Rareté, maîtrise et puissance

Conserver les identifiants de rareté déjà livrés. Les rôles proposés à mapper sont : Standard — ensemble fiable accessible ; Affiné — meilleure précision ou confort avec compromis ; Expert — capacité spécialisée ; Prestige — présentation distinctive et spécialisation maîtrisée. Ne pas convertir tous les objets sans migration ni assimiler Prestige à « meilleur partout ».

Le niveau ouvre une famille ; la maîtrise ouvre certaines variantes ; la rareté décrit l’objet ; la compatibilité physique valide le montage. Une amélioration matérielle ne devient pas une nouvelle méthode. Les descriptions expliquent le gain concret et le compromis, sans bonus mystérieux de « chance poisson rare ».

## 3. Quêtes d’apprentissage et économie

Chaque quête propose une mise en situation avec un ensemble prêté et un montage valable. Le prêt reste marqué, n’entre pas dans l’inventaire et ne peut être vendu ou démonté pour obtenir du stock. Les ressources de l’exercice sont restaurées au recommencement. L’exercice doit fonctionner sans achat préalable de la canne qu’il débloque.

| Famille | Nom de quête | Actions à apprendre et à valider |
| --- | --- | --- |
| Bordure | Ma première prise | Ajuster une profondeur simple, ferrer une vraie touche, conduire une prise à portée |
| Exploration | Trouver la bonne animation | Faire passer un leurre dans une couche utile, changer sa présentation, récupérer lors d’une ouverture réelle |
| Précision | Revenir sur mon coup | Déposer deux cages dans une même zone, constater leur diffusion, recevoir une prise après lecture du scion |
| Distance | Garder le contact | Régler un montage distant, reprendre de la bannière, recevoir une prise sans mou prolongé |
| Puissance | Laisser partir, reprendre | Accompagner un départ, ajuster le frein dans une plage raisonnable, récupérer et recevoir |
| Contrôle | Jusqu’au kit | Gérer l’élastique, revenir à une longueur recevable et effectuer le déboîtement |
| Rivière | Lire une veine d’eau | Accompagner une dérive, distinguer une touche, conduire une prise vers une zone favorable |
| Soie | Présenter sans tirer | Déposer correctement, éviter une dérive trop contrainte, récupérer de la ligne à la main sur une prise adaptée |
| Profondeur | Trouver la couche | Prospecter deux profondeurs, lire une touche, contrôler une remontée et une replongée |
| Traîne | Le bon passage | Déployer une ligne adaptée, choisir un trajet utile, mettre l’embarcation en situation de combat puis recevoir |
| Silure | Répondre au départ | Présenter à une profondeur utile, produire une série de clonk espacée, contrôler une prise adaptée à l’exercice |

Les étapes sont sauvegardées ; pas de remise à zéro pour un petit échec. Aucun objectif ne demande un poisson exceptionnel tiré au hasard. Pour les exercices nécessaires au déblocage, choisir une population plausible et des comportements guidés afin que la touche soit obtenable rapidement. Toute capture de scénario forcé est exclue du carnet, de l’argent et du FishDex normaux ; la récompense vient de la quête, une fois seulement.

La quête débloque la disponibilité commerciale et apporte une récompense en argent de la monnaie existante, calibrée à environ la moitié du prix du kit d’entrée. L’achat reste un objectif court : prix initial à calibrer autour du revenu de cinq à huit prises ordinaires au stade considéré. Évaluer ce revenu hors captures exceptionnelles et bonus de première découverte. Garder des prix fixes dans le catalogue ; ces ratios servent au réglage hors jeu, pas à changer le prix selon le portefeuille.

Une récompense de quête se réclame une seule fois ; un exercice peut être rejoué sans multiplier l’argent. Captures et argent des profils de test restent séparés. Ne pas laisser un gain de pièces de prêt ou de composants gratuits être revendu en boucle.

## 4. Règles communes du combat mobile

### 4.1 Capacités et présentation

Quatre contrôleurs de fond : ligne fixe ; grande canne / kit ; moulinet ; ligne manuelle avec moulinet éventuel. Les fiches de la section 5 définissent les profils de conduite. Les propriétés réelles de l’ensemble choisissent le contrôleur ; le nom d’un rayon n’accorde pas un moulinet ou un élastique inexistant.

La simulation relie poisson, fil, canne, raccords, hameçon, élastique éventuel et obstacles. Une orientation utile dépend de la géométrie, de la trajectoire et du terrain, pas d’une consigne automatique « gauche si poisson à droite ». Une pression raisonnable fatigue progressivement le poisson. Récupérer du mou prend d’abord la ligne libre ; tirer une ligne tendue ajoute une contrainte. Un petit poisson peut être ramené pendant sa lutte si l’ensemble le permet.

L’activité ne suit pas un cycle obligatoire de phases identiques. La conduite, la fatigue et les ouvertures proviennent des comportements existants du poisson. Les profils biologiques ne doivent pas être remplacés par un script gauche-droite interchangeable.

### 4.2 Gestes et visibilité

Orientation de canne : glissement continu dans la zone basse de jeu, avec course courte et bornée. Les profils à moulinet gardent la récupération par appui maintenu. Le réglage de frein, lorsqu’utile, s’ouvre sur une courte glissière contextuelle ; il n’ajoute pas un troisième geste simultané obligatoire. Les profils manuels utilisent un rail distinct de récupération. Une action de préparation ou de réception a son contexte propre et ne déclenche pas un lancer par erreur.

Maximum deux contacts simultanés à gérer ; les premiers exercices se réussissent avec un doigt et des actions alternées. Réutiliser les conventions de commandes actuelles ; pas de retour à la récupération circulaire. Une action garde un effet mesuré : aucun bouton ne lance tout le combat automatiquement.

Le monde porte le retour : flexion de canne, direction du fil, départs d’eau, bruit du frein et élastique. Un petit repère de contact près de la poignée peut montrer trois états, sans pourcentage ni tableau : contact utile, pression excessive, mou prolongé. Le repère est optionnel après apprentissage ; les alertes nécessaires restent compréhensibles avec le monde et le son. La couleur seule ne suffit pas.

Après ferrage, le flotteur peut rester immergé jusqu’à l’approche du bord. Ne pas reconstruire un combat autour d’un bouchon constamment visible. Pour un poisson invisible, donner assez d’indices de direction et d’activité via la ligne et l’eau.

### 4.3 Tolérances et moments satisfaisants

Valeurs initiales à tester : alerte après environ 0,6 s de mou significatif ou de pression excessive ; risque qui s’accumule ensuite selon le matériel, l’hameçon, les mouvements et les obstacles. Ces délais ne rendent pas toute ligne incassable pendant 0,6 s : un effort dépassant fortement la résistance peut rompre immédiatement. Un simple passage transitoire par faible tension ne fait pas décrocher automatiquement.

Une correction doit réduire la situation dangereuse progressivement. Les mauvaises actions répétées aggravent le risque ; une bonne action ne réinitialise pas instantanément toutes les conséquences. Les tolérances tiennent compte des interruptions et des faibles fréquences d’affichage.

Quatre réussites communes : contact retrouvé ; trajectoire détournée d’un obstacle ; récupération productive ; réception propre. Elles provoquent un retour bref, localisé et sonore, au maximum une petite notification. Elles correspondent à des événements physiques détectés, pas à des bonus de dégâts ou un combo multiplicateur. Compter les réussites significatives avec un délai et un seuil minimum ; des micro-allers-retours ne doivent pas générer d’XP illimitée.

Objectifs initiaux de durée, avec matériel adapté : prise courante 15–30 s ; belle prise 40–90 s. Une pause de poisson offre une ouverture, pas une victoire automatique. La durée varie selon espèce, taille, température, obstacles et ensemble. Mesurer avant de modifier la fatigue ; ne pas réduire chaque poisson à un chrono ni allonger tous les combats au niveau élevé.

### 4.4 Réception commune

La réception devient accessible lorsque distance, activité et matériel la rendent plausible. Pour l’épuisette : une action contextuelle ouvre un geste court de positionnement ; le joueur fait passer la tête du poisson au-dessus du filet puis lève avec un glissement. Le filet a une vraie position et une ouverture ; un raté permet de reprendre la conduite du combat.

Pour une petite prise sans épuisette lorsque le matériel le permet : une levée contrôlée conclut le geste. Un gros spécimen réclame un moyen de réception approprié. Ne pas obliger à acheter un accessoire absent du kit pour terminer la première prise. La phase ne dure que quelques secondes lorsque bien préparée.

## 5. Fiches de gameplay par famille

### 5.1 Bordure — Guider jusqu’à soi

- Vrai nom : canne au coup à ligne fixe. Difficulté 1/5. Contrôleur ligne fixe ; élastique seulement si équipé.
- Préparation : flotteur, plombée, bas de ligne, hameçon, appât ; profondeur essentielle.
- Présentation : déposer à portée, ajuster la profondeur et éventuellement amorcer. Le placement n’utilise pas un lancer de moulinet.
- Touche : lire une immersion, une remontée ou un déplacement crédible, puis lever pour ferrer.
- Combat : le doigt conduit la canne latéralement et en hauteur. Accompagner le départ conserve une marge ; réorienter rapproche la prise d’une zone recevable. La portée dépend réellement de la longueur et du fil.
- Petite victoire : reprendre une trajectoire vers soi après un départ. Échec : forte surcharge, mou prolongé avec agitation, obstacle.
- Matériel : souplesse, portée et résistance changent les marges ; un fil plus fort ne donne pas de moulinet.
- Réception : levée adaptée ou épuisette. Le joueur ne replie pas une canne télescopique ordinaire pour aspirer le poisson.
- Validation : une petite prise arrive à portée uniquement par géométrie et conduite ; aucune longueur de fil supprimée sans mécanisme.

### 5.2 Exploration — Tourner et profiter de l’ouverture

- Vrai nom : spinning ou casting compatible. Difficulté 2/5. Contrôleur moulinet.
- Préparation : fil, bas de ligne adapté, leurre, tête ou lest selon recette. Casting exige une interface de moulinet appropriée ; ce n’est pas une amélioration universelle du spinning.
- Présentation : lancer, attendre une couche d’eau et alterner récupération, petites animations et pauses compatibles avec le leurre. Les familles de leurres ont des réponses distinctes.
- Touche : attaque ressentie dans la canne et la ligne, ferrage selon armement.
- Combat : virages courts, orientation puis récupération. L’ouverture est lisible quand la contrainte baisse ou que le poisson revient ; elle reste issue de la simulation.
- Petite victoire : détourner un départ puis récupérer effectivement de la distance. Échec : tirer vers un obstacle ou forcer au-delà des capacités.
- Matériel : action de canne, précision, vitesse de récupération, frein et résistance influencent le confort et la portée.
- Réception : filet lorsque approprié, notamment près d’un carnassier. Ne pas prévoir une prise à la main universelle.
- Validation : ultraléger modifie les marges et la présentation ; il n’ajoute pas un moteur de combat indépendant.

### 5.3 Précision — Petites levées et récupération propre

- Vrai nom : canne feeder. Difficulté 2/5. Contrôleur moulinet, profil de conduite douce.
- Préparation : scion, cage ou method, amorce, esche et longueur terminale. La charge de lancer inclut le remplissage.
- Présentation : remplir, déposer précisément, laisser diffuser, ajuster le contact et lire le scion. Method regroupe la présentation autour du feeder.
- Touche : tremblement ou traction crédible du scion ; ferrage dépend du montage, pas du nom « feeder ».
- Combat : de courtes levées puis une récupération pendant la baisse de canne permettent un rythme clair. C’est une option efficace, pas une obligation artificielle ; récupérer sans pompage reste possible quand la physique l’autorise.
- Petite victoire : succession de reprises propres conservant le contact. Échec : grands gestes brusques sur un montage fin ou récupération sous forte surcharge.
- Matériel : sensibilité du scion sert surtout avant le combat ; action du blank, frein et montage terminal servent pendant.
- Réception : diriger vers le filet. La présence d’une cage ne fait pas gagner une endurance magique.
- Validation : deux dépôts répétés créent un effet local d’amorçage mesurable ; le signal reste celui du scion, sans flotteur ajouté.

### 5.4 Distance — Reprendre la bannière et garder le contact

- Vrai nom : canne anglaise ; ensemble compatible pour bombette selon objet. Difficulté 2/5. Contrôleur moulinet.
- Préparation : flotteur fixe/coulissant ou bombette, butées et profondeur/portance selon recette.
- Présentation : lancer à distance et contrôler la ligne libre. Le poisson n’est pas attiré uniquement parce que la canne porte le bon nom.
- Touche : flotteur ou contact selon présentation ; ferrage adapté à la distance et au montage.
- Combat : les déplacements latéraux et la longueur de ligne rendent le contact plus variable. Reprendre le mou puis diriger vers une trajectoire de retour offre la satisfaction principale.
- Petite victoire : retrouver le contact après un retour du poisson sans arracher le montage. Échec : bannière négligée ou surcharge au rapprochement.
- Matériel : portée, élasticité de ligne et frein changent les réactions. L’interface n’impose pas des corrections supplémentaires lorsque la situation est déjà stable.
- Réception : filet ou levée compatible, avec vigilance au changement de marge près du bord.
- Validation : une ligne détendue récupérée se tend avant de transmettre une force ; longue ligne et courte ligne donnent des différences observables.

### 5.5 Puissance — Accompagner le départ et reprendre du terrain

- Vrai nom : ensemble au posé / carpe. Difficulté 3/5. Contrôleur moulinet avec accès simple au frein.
- Préparation : lest, montage terminal, esche et amorçage. Les présentations fond/surface et l’auto-ferrage dépendent de la recette.
- Présentation : dépôt précis et attente active par observation. L’appui sur une touche de pêche n’obtient pas une capture automatique.
- Touche : départ ou signal de ligne ; prise de canne et ferrage selon montage.
- Combat : choisir une résistance raisonnable, accompagner les longues poussées, orienter le poisson et récupérer dans les ouvertures. La glissière de frein se manipule ponctuellement, pas simultanément avec trois actions.
- Petite victoire : détourner une fuite d’un obstacle puis récupérer plusieurs mètres réellement. Échec : frein excessif ou impossibilité de maintenir le contact après sortie trop libre.
- Matériel : réserve, progressivité du frein et amortissement ; résistance et discrétion restent des compromis.
- Réception : épuisette adaptée puis tapis si nécessaire. Accessoires de réception ne sont pas consommés par une rupture.
- Validation : un frein modifié change la sortie de fil et la contrainte ; aucune alternance active/calme imposée artificiellement.

### 5.6 Contrôle — Élastique, retour de canne et kit

- Vrai nom : grande canne à déboîter. Difficulté 3/5. Contrôleur grande canne.
- Préparation : kit, élastique, ligne de coup et moyen de réception. Contrôle latéral de l’élastique seulement avec dispositif compatible.
- Présentation : avancer et déposer précisément la ligne ; amorçage par coupelle si réellement équipée.
- Touche : flotteur, puis levée courte. L’élastique absorbe les départs selon ses paramètres.
- Combat : guider le poisson ; lorsqu’il revient à une distance pertinente, une commande contextuelle ouvre le rail « Reculer la canne ». Le glissement fait réellement coulisser la canne vers l’arrière. Le raccord pertinent devient saisissable ; un court glissement sépare le kit, puis le joueur reprend sa conduite.
- Un recul incorrect laisse de la portée à reprendre ou du contact à corriger ; il ne réinitialise pas le combat. La longueur de fil reste conservée lors du déboîtement. Un kit à contrôle externe donne un réglage contextuel additionnel ; un kit simple n’a pas cet outil.
- Petite victoire : revenir au kit en conservant un contact utile. Échec : gérer l’élastique comme un câble rigide, reculer au mauvais moment ou utiliser un montage inadapté.
- Matériel : kit, élastique et dispositifs influencent amortissement et réception, pas une récupération fictive.
- Validation : poisson, ligne et élastique restent cohérents avant/après retour et déboîtement ; le kit peut encore accompagner un départ.

### 5.7 Rivière — Accompagner la dérive et choisir la trajectoire

- Vrais ensembles : toc ou bolognaise, choisis dans deux sous-fiches. Difficulté 3/5 ; premières dérives guidées 2/5.
- Préparation : plombée et indicateur/contact au toc ; flotteur, bannière et profondeur en bolognaise.
- Présentation : déposer en amont et suivre ou retenir selon la technique. Le courant agit sur appât et ligne ; sa vitesse n’est pas uniforme partout.
- Touche : contact au toc ; flotteur en bolognaise. Le geste de ferrage est bref et tolérant, fondé sur le signal.
- Combat : la conduite favorise une zone de réception plus calme. Le courant et les obstacles modifient réellement les efforts ; le poisson n’exige pas un déplacement de canne arbitraire à chaque seconde.
- Au toc, proposer un rail de récupération de fil à la main lorsque l’ensemble le permet. Un aller tire une quantité bornée, le retour replace la main sans pousser le poisson ni donner du fil gratuitement. Le moulinet reste utilisable selon ses capacités. En bolognaise, utiliser le contrôleur moulinet.
- Petite victoire : ramener dans une trajectoire favorable après une dérive. Échec : ignorer l’effet du courant sur la ligne ou tirer vers une cache.
- Validation : toc et bolognaise ont des présentations et signaux distincts ; le choix du contrôleur dépend du matériel.

### 5.8 Soie — Présenter et récupérer de la ligne libre

- Vrai nom : ensemble mouche / nymphe. Difficulté 4/5 ; sèche guidée 3/5. Contrôleur ligne manuelle avec transition éventuelle au moulinet.
- Préparation : soie ou système de nymphe, bas de ligne, pointe et imitation. Les sous-techniques restent identifiables.
- Présentation : un aller-retour tactile guidé charge le lancer ; relâcher dépose. Quelques corrections courtes gèrent la dérive. La nymphe au fil a son geste de dépose et son contrôle de profondeur ; elle n’impose pas un fouetté complet.
- Touche : gobage, déplacement de ligne/indicateur ou contact selon présentation.
- Combat : récupération manuelle sur un rail court, avec liberté de ligne et résistance cohérentes. Passer au moulinet devient pertinent lorsque la situation et la réserve de ligne le permettent ; un repère explicite annonce cette transition. Ne pas récupérer simultanément à la main et au moulinet la même longueur de fil.
- Petite victoire : retrouver le contact après reprise de ligne, puis gérer un départ. Échec : surcharge de pointe ou mou prolongé pendant agitation.
- Matériel : soie et longueur de pointe servent à la présentation ; frein, action et pointe à la conduite.
- Validation : ligne libre, ligne sur bobine et distance ne créent aucune longueur fictive à la transition.

### 5.9 Profondeur — Prospecter et contrôler la remontée

- Vrais ensembles : verticale et gambe distinctes. Difficulté 3/5 ; verticale simple 2/5. Contrôleur selon ensemble.
- Préparation : leurre/lest pour verticale ; train d’imitations et potences autorisées pour gambe. Matériel fin à gambe et matériel lourd restent distincts.
- Présentation : descente par couche, petites levées et pauses ; la profondeur et l’animation modifient la rencontre.
- Touche : contact de ligne/scion. Le fond n’est pas automatiquement une touche de poisson.
- Combat : accompagner les replongées et récupérer une remontée effective, avec contrôle latéral près des obstacles ou de la coque. Les couches servent au retour ponctuel, pas à un ascenseur de points.
- Petite victoire : reprendre une remontée après une replongée. Échec : accrocher le fond ou forcer une prise au-dessus des capacités.
- Gambe : commencer avec une seule prise active ; définir explicitement l’état des autres hameçons. Toute évolution à deux prises devra réellement simuler et recevoir chaque individu avant d’attribuer une récompense.
- Validation : profondeur simulée cohérente ; aucune victoire obtenue uniquement en remplissant une jauge verticale.

### 5.10 Traîne — Préparer le passage, puis conduire la prise

- Vrai nom : ensemble adapté à la traîne. Difficulté 3/5. Contrôleur moulinet.
- Préparation : leurre, profondeur et ligne adaptés ; embarcation requise.
- Présentation : choisir un passage, ajuster une vitesse simple et déployer réellement la ligne. Le déplacement anime le leurre ; une trajectoire peut être suivie sans exiger une simulation complète de conduite.
- Touche : signal crédible ; l’embarcation ralentit pour permettre la reprise en main. Le joueur choisit une zone de combat sur un court geste de direction, puis un maintien de cap simple évite une troisième commande permanente.
- Combat : moulinet et trajectoire du poisson, avec influence de la position de coque et des obstacles. Ne pas demander de manœuvrer activement le bateau en continu tout en conduisant un combat à deux doigts.
- Petite victoire : mettre la prise dans une position favorable puis récupérer. Échec : contact de ligne avec obstacle ou mauvaise trajectoire persistante.
- Réception : filet depuis la coque ou moyen cohérent avec la prise.
- Validation : le leurre se déplace réellement avec le bateau ; ralentir et repositionner affectent la géométrie.

### 5.11 Silure — Espacer l’attraction et maîtriser les poussées

- Vrai nom : ensemble silure avec clonk et présentation compatible. Difficulté 4/5. Contrôleur moulinet, profil puissant.
- Préparation : ensemble et montage adaptés ; le clonk est un accessoire d’attraction, pas une technique de combat magique.
- Présentation : profondeur utile, une courte série sonore manipulée puis pause. La réaction du poisson dépend de son profil et du contexte ; répéter vite ne garantit pas une attaque.
- Touche : départ plausible, ferrage selon montage.
- Combat : mêmes lois de fil et de frein, avec poussées et changements de direction du poisson. Quelques décisions espacées de conduite et de résistance donnent le défi ; éviter une rafale de boutons ou un combat artificiellement très long.
- Petite victoire : contenir une trajectoire dangereuse sans surcharge puis reprendre du terrain. Échec : ensemble inadapté ou sortie de fil non maîtrisée.
- Réception : équipement approprié, mise en scène cohérente et brève ; pas de petit poisson agrandi reçu avec les mains par défaut.
- Validation : le clonk a un effet conditionnel avant touche et aucun bonus de dégâts pendant combat.

## 6. Couverture des méthodes et difficulté détaillée

Les 22 IDs sont conservés. La difficulté ci-dessous concerne l’apprentissage mobile dans un contexte approprié ; les variantes de poste/poisson constituent une difficulté indépendante. La disponibilité de la canne d’entrée ne débloque pas toutes ses variantes expertes.

| ID | Nom public | Famille de découverte | Difficulté / 5 | Accès fonctionnel proposé |
| --- | --- | --- | --- | --- |
| coup | Au flotteur | Bordure | 1 | Montage de départ |
| leurre | Lancer et animer | Exploration | 2 | Ensemble de découverte |
| ultraleger | Petits leurres | Exploration | 3 | Maîtrise 2 ; ensemble léger adapté |
| mort_manie | Poisson-appât animé | Exploration | 3 | Maîtrise 3 ; monture et stock adaptés |
| feeder | Cage d’amorce | Précision | 2 | Ensemble de découverte |
| method_feeder | Appât groupé | Précision | 2 | Maîtrise 2 ; method compatible |
| anglaise | Flotteur à distance | Distance | 2 | Ensemble de découverte |
| bombette | Lancer un appât léger | Distance | 3 | Maîtrise 2 ; ensemble porteur adapté |
| fond | Au fond | Puissance | 2 | Ensemble de découverte |
| carpe | Posé pour la carpe | Puissance | 3 | Première recette puis variantes maîtrise 2–4 |
| surface | Appât en surface | Puissance, puis recommandations croisées | 2 | Présentation compatible et découverte de recette |
| stalking | Approche discrète | Puissance, puis recommandations croisées | 3 | Défi de présentation ; ne verrouille pas le bruit physique des autres pratiques |
| grande_canne | Déposer avec le kit | Contrôle | 3 | Ensemble de découverte |
| carpodrome | Carpe au coup | Contrôle | 3 | Maîtrise 2 ; kit adapté et lieu approprié |
| bolognaise | Flotteur en rivière | Rivière | 3 | Sous-ensemble bolognaise de découverte |
| toc | Dérive naturelle | Rivière | 3 | Sous-ensemble toc de découverte |
| mouche | Présenter une mouche | Soie | 3 sèche ; 4 autres variantes | Sèche de découverte ; noyée/streamer maîtrise 2 |
| nymphe_fil | Nymphe sous l’eau | Soie | 4 | Maîtrise 3 ; ensemble et rivière adaptés |
| verticale | Sous le poste | Profondeur | 2 | Sous-ensemble de découverte |
| gambe | Train d’imitations | Profondeur | 3 | Maîtrise 2 ; autre ensemble adapté |
| traine | Pêcher en déplacement | Traîne | 3 | Ensemble + embarcation accessibles ensemble |
| clonk | Attirer en profondeur | Silure | 4 | Ensemble + accessoire + contexte |

Surface et stalking sont des présentations/approches, pas des espèces de canne. Leur découverte dans Puissance guide le parcours ; réutiliser leurs recettes avec d’autres ensembles réellement compatibles lorsque le joueur les connaît. Coup sur grande canne utilise le contrôleur kit ; toc n’implique pas nécessairement le même type de moulinet ; un objet démontable à moulinet n’est pas une grande canne à déboîter.

## 7. Préparation : choisir, comprendre, manipuler

### 7.1 Parcours et navigation

Choix de canne → Ma canne → méthode compatible → amélioration de l’ensemble et atelier Montage → appliquer → pêcher.

Ma canne présente une représentation centrale avec points Ensemble, Fil, Montage, Appât/Leurre et un accès Réception. Choisir une méthode charge une recette de départ en aperçu ; afficher les changements et pièces nécessaires avant application. Toute modification respecte l’inventaire. Un équipement déjà installé demeure tant qu’il reste compatible ; un changement de méthode ne détruit pas discrètement l’ensemble.

Le mode simple montre deux ou trois réglages essentiels par recette. Personnaliser ouvre le même montage, jamais un objet de simulation séparé. Mes équipements gère le stock ; Boutique vend ; Ma canne prépare. Les descriptions présentent rôle, effet et cas utile, puis les chiffres détaillés. Les vrais noms sont consultables dans les fiches.

### 7.2 Atelier tactile

La ligne agrandie est orientée de la canne vers l’hameçon avec segments identifiables. Le mot public « Montage » couvre corps de ligne et bas de ligne. Un bandeau discret indique le segment sélectionné. Le panier d’éléments ne contient que les possibilités compatibles avec le contexte choisi ; un accès « Autre montage » permet des changements dépendants expliqués.

Prendre une pièce, glisser, voir une prévisualisation d’emplacement et relâcher. L’aimantation facilite le dépôt ; une règle graduée et des ajustements fins permettent la précision. Afficher des positions réelles en cm/m, adaptées au zoom ; une position enregistrée ne dépend pas des pixels de l’écran.

| Pièce | Règle de manipulation | Effet calculé |
| --- | --- | --- |
| Plomb fendu | Position sur segments autorisés ; exclusion des nœuds et objets selon recette | Répartition de masse et descente |
| Plombs regroupés | Sélection multiple et glissement du groupe sans changer l’espacement interne | Plombée groupée/étalée |
| Flotteur fixe réglable | Déplacer son point de réglage dans la portion autorisée | Profondeur et équilibre |
| Flotteur coulissant | Déplacer les butées ; le corps conserve sa mobilité définie | Limites de coulissement et profondeur |
| Lest/feeder coulissant | Enfilage sur bon segment avec pièces de protection/raccord requises | Mobilité et transmission du signal |
| Lest fixe / clip | Connexion sur le point prévu, pas libre sur tout le fil | Tenue, éventuelle libération et charge |
| Bas de ligne | Choisir matière, longueur et raccords | Discrétion, mobilité, résistance |
| Hameçon, potence, leurre | Raccord terminal ou point autorisé par la recette | Présentation et ferrage |
| Appât / cheveu | Placement compatible ; longueur du cheveu selon recette | Flottabilité et présentation terminale |

Les attaches se font par une courte connexion guidée, avec animation et message de rôle. Pas de dextérité au pixel pour un nœud ni de mini-jeu de nœud obligatoire répété à chaque changement d’appât. Déplacer un composant fixe peut nécessiter un remontage explicite ; ne pas transformer chaque pièce en curseur coulissant.

### 7.3 Test dans l’eau et compatibilité

Une petite vue de test utilise les mêmes paramètres que la présentation en jeu : descente, flotteur, profondeur, mobilité terminale et réaction au courant. Sa scène peut être simplifiée graphiquement, mais ne doit pas raconter un effet que le gameplay n’utilise pas.

Exemples d’effets pédagogiques : regroupement des plombs et descente ; flotteur sous/sur-lesté ; longueur de bas de ligne et mobilité ; appât flottant et présentation selon montage. Fournir une seule explication prioritaire à la fois : « Ton flotteur est trop chargé » ou « Ton appât reste au-dessus de la couche visée ».

La compatibilité distingue : impossible ; possible mais inadapté au poste ; stock manquant ; progression manquante. Les choix invisibles dans un segment ne doivent pas empêcher d’évoluer : proposer une transformation de recette avec remplacement des dépendances en aperçu, coût en pièces et possibilité d’annuler. Garder la compatibilité basée sur propriétés, connecteurs et recette, pas uniquement sur catégories.

### 7.4 Stock et ruptures

L’atelier travaille sur un brouillon. Déplacement d’une pièce déjà équipée = repositionnement, pas création. Un objet pris en stock est réservé dans le brouillon ; abandon libère les réservations. Appliquer valide et consomme atomiquement les ressources réellement nécessaires. Les pièces retirées retournent au stock lorsqu’elles sont réutilisables ; règles explicites pour esches et consommables. Annuler, changer d’écran et recharger ne permettent jamais de dupliquer des pièces.

Chaque montage sauvegarde graphe de connexions, segments, positions réelles, propriétés de mobilité et références d’inventaire. Une rupture détache les éléments situés sur la portion perdue selon le graphe et les éventuelles libérations de montage. Ne pas retirer systématiquement tout le montage ni garder toutes les pièces par défaut. Canne, moulinet, filet et tapis restent possédés.

Une recette favorite conserve références et réglages ; sa reconstruction demande le stock. Afficher « Remonter ma recette » avec pièces disponibles/manquantes. Aucun achat silencieux ; le kit gratuit reste le recours permanent, non revendable.

## 8. Modèle de données et migration

Réutiliser les systèmes actuels ; adapter les noms ci-dessous au dépôt. Conserver les IDs métier des méthodes, poissons, objets et captures. Les noms publics sont des labels localisés, pas de nouveaux IDs.

Séparer RodCapabilities (récupération, construction, longueur, interface moulinet, kit, élastique), MethodDefinition (présentation et touche), RigGraph (assemblage), CombatProfile (sensation/paramètres), UnlockRule (niveau OU quête), Mastery (réussites), Inventory (stock) et Context (poste/eau/embarcation). Un rayon d’interface peut référencer plusieurs objets, pas leur fusion.

Schéma indicatif de règle, à intégrer à l’architecture existante :

```json
{
  "familyKey": "exploration",
  "displayName": "Exploration",
  "unlock": {
    "anyOf": [
      {"playerLevelAtLeast": 15},
      {"questCompleted": "apprentissage_exploration"}
    ]
  },
  "questAccess": {"playerLevelAtLeast": 5},
  "starterEntitlement": "availability_only",
  "controllerFromActualCapabilities": true
}
```

Un ancien joueur ne perd ni objet, ni prise, ni argent, ni accès déjà acquis. Prévoir des droits hérités pour les familles, variantes et méthodes possédées/utilisées ; conserver son montage actif ou expliquer une réparation de compatibilité en migration. Distinguer disponibilité héritée et propriété des objets : ne pas offrir tout le stock d’une famille. Les profils de test ne donnent aucun droit hérité normal.

Le niveau normal doit être dérivé de l’XP cumulée par la courbe retenue. Si l’existant diffère, concevoir une conversion qui préserve la progression et documenter le résultat. Ne pas remettre tous les joueurs au niveau 1 pour appliquer la table.

## 9. Valeurs initiales et plan d’équilibrage

Les paramètres sont centralisés et versionnés, sans nombres disséminés par méthode. Les valeurs suivantes sont des graines de test, pas des résultats de recherche ni des promesses de cadence :

- Déblocages : 1, puis multiples de 15 jusqu’à 150 ; quêtes accessibles dix niveaux avant chaque palier.
- XP nécessaire pour passer du niveau L au suivant : `50 + min(6 × (L − 1), 160)`, plafond de niveau initial 150. Le coût par niveau plafonne à 210 XP pour éviter des paliers tardifs démesurés. Construire les seuils cumulés. Réconcilier avec la courbe existante plutôt que l’écraser sans analyse.
- Capture ordinaire de référence : environ 40 XP au départ ; adapter les profils actuels et récompenses de découverte/maîtrise. Aucune pénalité générale pour aimer pêcher la même espèce. Éviter qu’une prise techniquement triviale devienne le meilleur farm à tous les stades.
- Bonus de conduite propre : jusqu’à 10 % de l’XP de capture, attribué une fois à la réception et seulement si des réussites significatives sont validées. Conserver une victoire normale gratifiante même sans bonus.
- Objectif de cadence : première découverte Exploration en 15–30 minutes par quête, ou environ 45–75 minutes par niveau direct, sur sessions débutantes. Plus tard, viser 60–120 minutes d’activité variée entre paliers directs. Ajuster récompenses et courbe si ces cibles ne sont pas atteintes ; ne pas ajouter une inflation automatique d’XP cachée par famille.
- Combat : 15–30 s courant ; 40–90 s belle prise adaptée. Réception quelques secondes.
- Apprentissage : une introduction courte, puis exercices cumulables ; pas d’examen parfait ni d’échec qui annule une quête.
- Kit d’entrée : cinq à huit prises ordinaires de revenu ; pièces perdues d’un montage courant récupérables en une à trois prises adaptées. Contrôler les achats d’amorces, d’appâts et de bateau dans ce bilan.

Avant de figer ces chiffres, simuler et mesurer des parcours complets, avec temps de préparation, attente de touche, échecs et achats. Rapporter séparément débutant prudent, joueur expérimenté et joueur restant dans sa pratique préférée. Un calcul d’XP seul ne représente pas le temps joué. Les paliers tardifs ne doivent pas être testés uniquement avec un profil riche et tout débloqué.

Mesures locales possibles : temps jusqu’à premier équipement supplémentaire ; XP/argent par minute hors récompenses uniques ; durée médiane et haute des combats ; taux de réception ; erreurs de montage ; usage de recettes et atelier ; compréhension des signaux. Aucune infrastructure analytique payante ni télémétrie externe nécessaire. Ne pas présenter des simulations comme des tests de vrais joueurs.

## 10. Tactile, accessibilité et mode de développement

Les surfaces de jeu empêchent sélection et appui long natifs ; les commandes capturent leurs pointeurs indépendamment et libèrent sur relâchement, annulation et perte de focus. Réserver `touch-action: none` au canvas et aux gestes de jeu. Les menus, inventaires, fiches et recherches gardent défilement et édition. L’atelier désactive les gestes natifs sur sa surface manipulable uniquement, en conservant le défilement de la boîte de pièces.

Ajouter une alternative tap → sélectionner emplacement ou réglage aux glissements de l’atelier ; cibles tactiles au moins 44 CSS px dans la disposition mobile de référence. Le zoom ne change pas les mesures stockées. Prévoir droitier/gaucher lorsque les rails secondaires risquent de masquer la ligne. Son désactivé, les signaux restent visibles.

Le mode test séparé permet argent illimité, toutes disponibilités, variantes et contextes, poissons/scénarios contrôlés, inspection du montage et de la tension. Il n’envoie pas les captures forcées dans la sauvegarde normale. Prévoir aussi un profil neuf normal et un mode progression accélérée séparé pour tester les quêtes et la courbe. Le profil « tout débloqué » ne valide pas la progression normale.

## 11. Développement dans le dépôt : six lots successifs

### Lot 0 — Audit et correspondance

Lire AGENTS.md, relais et dernières modifications. Cartographier les 22 méthodes, les capacités des cannes, l’inventaire, les sauvegardes, les contrôleurs, la boutique et le mode test. Comparer chaque fiche avec les fonctions actuelles ; préserver ce qui répond déjà à la spécification. Produire `AUDIT_GAMEPLAY.md`, un tableau des écarts et le plan de migration. Critère : aucun ID oublié, aucun état existant effacé et aucun catalogue parallèle prévu.

### Lot 1 — Progression et disponibilité commerciale

Implémenter niveaux OU quêtes, droits hérités, variantes par maîtrise, états de boutique et mode test séparé. Raccorder les quêtes aux événements existants avec prêts et récompenses uniques. Critère : niveau direct sans quête, quête anticipée sans niveau palier, achat sans argent, ancien joueur et rejouabilité fonctionnent distinctement. Une quête n’exige pas de posséder l’objet qu’elle débloque.

### Lot 2 — Ma canne et atelier

Construire le parcours de préparation et la manipulation de ligne avec les recettes existantes. Commencer par flotteur de Bordure, cage de Précision et leurre d’Exploration ; ensuite étendre tous les composants. Critère : déplacer une plombée change effectivement la présentation ; compatibles filtrés ; remplacement dépendant explicable ; annuler/recharger n’invente pas de stock. La vue de test utilise les mêmes paramètres que le jeu.

### Lot 3 — Trois prototypes représentatifs

Livrer Bordure, Exploration et Contrôle avec scénario de comparaison, réception et retours sobres. Chaque contrôleur est piloté par capacités. Critère : ligne fixe sans récupération fictive ; moulinet avec tension et mou cohérents ; kit/élastique/déboîtement géométriquement valables. Jeux possibles sur petit écran et premiers exercices à un doigt. Affiner ici les tolérances communes.

### Lot 4 — Tous les profils et cycles de méthodes

Raccorder Précision, Distance, Puissance, Rivière, Soie, Profondeur, Traîne et Silure, puis les variantes du catalogue. Réutiliser les moteurs, signaux et données. Critère : chacune des 22 entrées a une différence de présentation ou contexte réelle ; chaque boucle va de préparation à capture sauvegardée ; les méthodes de rivière/profondeur/bateau ont leurs contextes utilisables. Signaler honnêtement une couverture manquante.

### Lot 5 — Équilibrage, ergonomie et livraison

Mesurer trois parcours normaux et scénarios de combat, corriger cadence, prix et risques, inspecter l’écran en action. Terminer aide courte et descriptions réelles. Exécuter les vérifications requises du dépôt et les tests significatifs. Rapporter limites, paramètres ajustés et procédure de test sur téléphone. Déploiement sur le projet Vercel du jeu déjà autorisé si ce workflow est accessible ; ne pas remplacer un autre projet ni promettre un test sur iPhone physique non réalisé.

Pendant les lots, maintenir un relais Codex/Claude : lot courant, décisions prises, fichiers modifiés, tests exécutés, limites et prochaine étape. Une décision de mise en œuvre ordinaire peut être résolue autonomement dans le cadre de ces spécifications. Une incompatibilité de conception majeure est documentée et proposée explicitement, pas masquée par un fonctionnement de façade.

## 12. Validation minimale significative

| Domaine | Cas indispensables |
| --- | --- |
| Déblocage | Niveau seul ; quête seule ; aucun des deux ; ancien droit ; variante non acquise ; prêt |
| Quête | Accès avant palier ; pas d’achat préalable ; reprise après échec ; récompense une fois ; prise forcée exclue du profil normal |
| Stock | Ajouter puis annuler ; repositionner ; retirer ; changer de méthode ; recharger ; rupture de segments différents |
| Montage | Flotteur mal équilibré ; plombs répartis ; lest coulissant ; connecteur absent ; poids chargé trop élevé ; position après zoom |
| Combat | Poisson qui revient ; départ puissant ; virage ; obstacle ; mou ; surcharge ; matériel léger ; réception ratée |
| Contrôleurs | Aucune longueur créée en récupération manuelle/moulinet ; kit déboîté ; élastique ; absence réelle de moulinet |
| Contextes | Courant ; eau profonde ; coque ; bordure ; population plausible pour l’exercice |
| Tactile | Appui long ; deux doigts ; annulation ; perte de focus ; défilement menu ; texte éditable ; petit écran |
| Progression | Neuf normal ; ancien normal ; argent vide ; pratique préférée ; bac à sable indépendant |

Tester logique et intégration là où il existe un risque de duplication, perte de sauvegarde ou rupture des contrôles. Ne pas ajouter des tests qui copient simplement les tables de configuration. Une vérification automatisée n’est pas une observation de plaisir utilisateur ; compléter avec parcours manipulables et captures de validation lorsque les outils le permettent.

## 13. Sources et limites de réalisme

La classification s’appuie sur des sources primaires de matériel et de pratique. Les paliers, noms simples, gestes mobiles, tolérances et prix sont des décisions de game design à tester.

- [Caperlan — Monter ses premières lignes](https://conseilsport.decathlon.fr/comment-monter-ses-premieres-lignes) : corps de ligne, flotteur, lestage, bas de ligne et raccords.
- [Caperlan — Débuter au coup](https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-coup) : présentation et répartition des plombs selon conditions.
- [Garbolino — Choisir un kit de grande canne](https://www.garbolino.fr/bien-choisir-son-kit-de-grande-canne-peche/) : capacités de kits et contrôle d’élastique selon équipement.
- [Garbolino — Carpodrome et kit ELC](https://www.garbolino.fr/peche-en-carpodrome-ligne-fine-elastique-creux-kit-elc/) : amortissement et contrôle latéral pour réception.
- [Caperlan — Feeder](https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-feeder) : cage, diffusion et scion.
- [Caperlan — Techniques truite](https://conseilsport.decathlon.fr/quelle-technique-pour-pecher-la-truite-1) : toc, ligne à la main, soie et présentations.
- [Orvis — Ligne à la main et moulinet](https://howtoflyfish.orvis.com/video-lessons/toms-short-tips/1716-should-you-reel-with-your-right-or-left-hand) : deux modes de récupération possibles.
- [Daiwa — Gamme Exceler](https://daiwa.fr/exceler-2025) : diversité des ensembles spinning/casting et des puissances.

Les recettes spécialisées doivent être rapprochées de leurs fiches documentées existantes. Ne pas annoncer qu’une gambe, un montage de silure ou une recette de carpe est physiquement juste seulement parce qu’un nom existe dans cette matrice.

## 14. Prompt de démarrage à transmettre à Codex

Lis `FISHDEX_GAMEPLAY_COMPLET_PROGRESSION_CODEX.md` en entier, puis les consignes du dépôt et le relais de projet. Ce dossier définit le nouveau chantier : progression avec grandes étapes tous les quinze niveaux et quêtes alternatives, familles de cannes lisibles, préparation tactile de montage et gameplay mobile de pêche complet.

Commence par le Lot 0, puis réalise les Lots 1 à 5 dans l’ordre. Pour chaque lot, réutilise le code et les contenus existants, implémente les comportements réels, vérifie ses critères et mets à jour le relais avant de passer au suivant. L’audit ne doit pas devenir une fin en soi : enchaîne sur l’implémentation dans le périmètre décrit. Garde les paramètres d’équilibrage ajustables, les sauvegardes et droits acquis préservés, et les profils normaux/test séparés.

La disponibilité commerciale des familles suit bien niveau OU quête terminée. La récupération au moulinet reste par appui maintenu ; l’atelier et les contrôleurs spécifiques ajoutent uniquement les gestes utiles décrits. Les composants manipulés doivent changer réellement les paramètres du montage et de sa présentation. Aucun réimport global des poissons, aucune nouvelle dépendance payante, aucune refonte du monde en parallèle.

Termine par les vérifications adaptées, une procédure de test mobile et le déploiement sur le projet Vercel du jeu déjà autorisé si accessible. Distingue les observations sur appareil réel, les tests de navigateur et les simulations. Rapporte ce qui est livré, les écarts restants et la prochaine étape concrète.
