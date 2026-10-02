# Couverture V2 : méthodes, recettes et systèmes

2 octobre 2026 — version 0.9.0. Les ID du dossier matériel sont conservés.
« Fonctionnel » désigne ici le prototype jouable, pas une simulation exhaustive
du geste réel. « Contrôlé » signifie une vérification exécutée ; les tests au
toucher sur appareil restent distincts.

## Preuves communes aux 22 pratiques

`tests/techniques.test.ts` exécute chaque ensemble par rencontre **naturelle**,
présentation adaptée, ferrage, combat, arrivée réelle à 1,81 m, réception sans
récompense anticipée, identité du spécimen, gain unique et sauvegarde/relecture.
Il exécute aussi la chaîne naturelle des **55 recettes**, chacune avec une pratique
compatible. `tests/browser/techniques.spec.ts` vérifie les 22 chaînes par les
interfaces, combat/réception/photo locale/rechargement, sur bureau et 390 × 844.
La rencontre y est forcée et annoncée : ce test navigateur ne prouve pas la biologie.
Les 44 prises et leurs ID sont consignés dans `apercus/v2/*-22-chains.json`.

Le banc `scripts/techniques-bench.ts` ajoute 12 lancers naturels par pratique,
avec portefeuille et stock finis. Résultats dans `apercus/v2/natural-economy.json`.
Il utilise un contrôleur parfait et suppose 8 s de photo/préparation : il ne mesure
ni un joueur, ni l'économie sur téléphone.

## Matrice par pratique

Toutes les lignes : **fonctionnel + contrôlé** par les chaînes ci-dessus ;
**à tester au toucher** pour les sensations, l'apprentissage et l'équilibrage.
Aucune pratique des 22 ne reste un simple écran « À venir ».

| ID | Présentation et différence effective | Ferrage / combat / réception | Statut et limite précise |
| --- | --- | --- | --- |
| `coup` | Portée 6,4 m, flotteur/profondeur/plombée, amorçage local | Manuel ; ligne fixe, élasticité, petite prise/épuisette | Fonctionnel, contrôlé ; toucher à tester |
| `grande_canne` | Portée 12 m, sections, flotteur et retenue | Manuel ; sans moulinet, déboîtement progressif jusqu'au kit | Fonctionnel, contrôlé ; deux appuis et confort du déboîtement à tester |
| `anglaise` | Waggler fixe/coulissant/préplombé, stop, profondeur et bannière | Flotteur ; moulinet et frein | Fonctionnel, contrôlé ; précision du geste à tester |
| `bolognaise` | Rivière, dérive effectivement déplacée par courant ; retenue ralentit | Flotteur ; moulinet et longue canne | Fonctionnel, contrôlé ; lecture de coulée à tester |
| `fond` | Fond réel, lest coulissant/potence/tube, reprise de contact | Fil/scion, manuel ; moulinet/frein | Fonctionnel, contrôlé ; contact et patience à tester |
| `feeder` | Cage garnie avant chaque lancer, dépôt à durée limitée | Scion, ferrage ; moulinet/frein | Fonctionnel, contrôlé ; renouvellement d'amorce à tester |
| `method_feeder` | Esche groupée près de la cage, terminal court ; variante élastique | Ferrage mécanique seulement avec masse et contact ; moulinet | Fonctionnel, contrôlé ; lisibilité de départ à tester |
| `carpe` | Cheveu, wafter/pop-up, inline/clip/hélicoptère, PVA soluble | Manuel/mécanique selon montage et contact ; épuisette/tapis | Fonctionnel, contrôlé ; gros individus et coûts à tester |
| `stalking` | Placement proche et plus discret, inspection et refus possibles | Attendre la prise de surface ; moulinet | Fonctionnel, contrôlé ; perturbations et compréhension à tester |
| `surface` | Esche flottante libre/contrôleur, dérive et tenue de l'esche | Prise en surface, fenêtre courte ; moulinet | Fonctionnel, contrôlé ; visibilité à tester |
| `leurre` | Descente, récupération/vitesse/pauses/animations, terminal lié à la recette | Contact du fil/scion ; moulinet/frein | Fonctionnel, contrôlé ; sensations et revenu à tester |
| `verticale` | Lac profond/embarcation ; couche réglable et petites levées | Contact vertical ; moulinet/frein | Fonctionnel, contrôlé ; lecture sous l'eau à tester |
| `mort_manie` | Monture avec poisson-appât consommé ; tirées et pauses près du fond | Contact, manuel ; moulinet | Fonctionnel, contrôlé ; animation et consommation à tester |
| `toc` | Courant réel, plombée étagée, indicateur, contact et retenue | Manuel bref ; moulinet comme réserve | Fonctionnel, contrôlé ; sensibilité du contact à tester |
| `mouche` | Préparation/énergie de soie ; sèche/noyée/nymphe/streamer, couches distinctes | Mouche/soie selon recette ; gestion de ligne et moulinet | Fonctionnel, contrôlé ; projection mobile simplifiée à tester. Truite non représentée, prises compatibles actuelles |
| `nymphe_fil` | Corps de ligne sans soie, pointe, indicateur, dérive retenue | Manuel bref ; ligne et canne | Fonctionnel, contrôlé ; visibilité et gestes à tester |
| `bombette` | Corps porteur flottant/plongeant distinct de l'esche et du terminal | Contact/bannière ; récupération et frein | Fonctionnel, contrôlé ; réglage du terminal à tester |
| `gambe` | 1–3 potences réellement instanciées à couches espacées, levées/pauses | Branche ferrée identifiée ; une prise simulée/récompensée | Fonctionnel, contrôlé ; confort à tester. Corégone absent : perche compatible ; pas de double capture fictive |
| `traine` | Bateau et point de pêche avancent ; vitesse/parcours/profondeur effectifs | Contact ; arrêt du déplacement au combat, moulinet | Fonctionnel, contrôlé ; parcours borné et embarcation procédurale, toucher à tester |
| `clonk` | Embarcation, profondeur, pulse d'attraction temporaire et pause de 25 s | Contact vertical ; silure compatible, réaction non garantie | Fonctionnel, contrôlé ; cadence et ressenti à tester |
| `ultraleger` | Petit ensemble moins puissant, descente/animation/pauses | Contact sensible ; moulinet/frein | Fonctionnel, contrôlé ; compromis finesse/réserve à tester |
| `carpodrome` | Grande canne, amorçage local et ensemble compatible | Flotteur ; élastique et déboîtement effectif | Fonctionnel, contrôlé ; réception de grands individus à tester |

## Recettes et propriétés

Les 55 recettes conservent les ID de `recipes-data.json`. Elles utilisent 33
emplacements de montage ; chaque emplacement a des composants jouables.
Les 80 entrées appâts/amorce/leurres disposent de composants, régimes,
compatibilités, dimensions, flottabilité et consommation configurés.
Les 274 exemples commerciaux incomplets restent des fiches de conception ;
leurs caractéristiques inconnues ne sont pas inventées comme produits jouables.

| Groupe | Effets raccordés et contrôles |
| --- | --- |
| Flotteurs / plombées / waggler | Portance et charge totale, répartition et descente ; coulissement/stop dans le graphe, différence de descente ; préplombé sans lest externe |
| Fond / feeder | Fond réel, contact, cage garnie, diffusion limitée ; attaches coulissantes, potence et tube, risques d'emmêlement ; terminal sur élastique |
| Carpe / surface | Cheveu distinct, hauteur wafter/pop-up, clip de lest, rotation, présentation remise en place après refus ; PVA 8/4 s puis diffusion 35 s ; discrétion et tenue |
| Souples / métalliques / durs | Tête/lest/insert distincts, descente, protection contre accroche, séparation du lest, hauteur drop-shot/Tokyo, orientation Ned/Neko, rotation cuiller, armement intégré et surface |
| Mouche / toc / bombette | Backing/soie/pointe ou ligne directe, sèche/noyée/nymphe/streamer ; courant/contact ; corps porteur indépendant, longueur du terminal |
| Gambe / traîne / clonk | Potences, profondeur et pertes par branche ; vitesse/course du bateau ; pulse temporaire, délai de sollicitation et filtrage silure |

Les paramètres sont des **hypothèses de prototype**. Le graphe représente les
attaches choisies pour le jeu ; il ne constitue pas une instruction de montage réel.
Les contrôles causaux supplémentaires sont dans `tests/recipe-effects.test.ts`
et `tests/rig.test.ts` : stock réservé, descente/diffusion/tenue, charge, rotation,
frein, pertes localisées, compatibilité et interruption.

## Matrice des systèmes de la section 5 ter

| Système | Fonctionnel et contrôlé | À tester au toucher / limite |
| --- | --- | --- |
| Préparation | Canne → pratique compatible, 55 recettes, composants/stock ; ensembles, réparation explicite et secours | Lisibilité des montages longs et comparaison de matériel |
| Présentation | Portée/profondeur/charge, descente, récupération, animations, courant/retenue, amorçage, discrétion | Agrément et compréhension des réglages |
| Milieu | Six postes de l'étang + rivière/lac profond/embarcation ; microzones, secteurs, profondeur 6–18 m, vent, obstacles, même scène | Lecture du relief ; géométrie sobre, sans monde ouvert |
| Rencontre | Présence/habitat/régime/couche/activité ; approche/examen/suivi/attaque/refus ; naturel séparé des forçages, dt en secondes | Variété des sessions ; observations de joueurs nécessaires |
| Touche / ferrage | Flotteur, scion/contact/surface ; sons optionnels distincts, fenêtres et ferrage mécanique conditionnel | Perception réelle des signaux et ratés |
| Combat | Profils d'espèce et individu, tension/fatigue/distance, élasticité, frein, réserve, sections et obstacles ; coup sans reel | Assistance toujours expérimentale ; confort et grands poissons |
| Échecs | Pertes du sous-graphe détaché, branche gambe, pointe/lest/clip ; consommation atomique, dégagement, stock vide, secours gratuit | Frustration, réparation et compréhension du maillon faible |
| Réception | Arrivée réelle, étape distincte sans gain anticipé, petite prise/épuisette/tapis ; sections jusqu'au kit ; même poisson/taille | Silhouette procédurale de réception ; modèle réel dans la photo |
| Capture | Taille/masse, variétés plausibles, rareté, photo/gain uniques, filtres/records ; chargement différé des 15 GLB | Qualité de photo et partage/export sur appareils |
| Collection | FishDex, fiches, variétés, indices et objectifs/records conservés | Espèces sans modèle restent futures, dont truite/corégone |
| Progression | XP/niveaux, 22 maîtrises et familles anciennes, badges, accès permanents niveau OU objectif ; pêcheur des roseaux | Rythme normal sans aides et choix de spécialisation |
| Économie | Prix/lots, achats validés, coûts théoriques en test, monnaie finie, récompenses uniques, reprise après perte | Banc 264 lancers ≠ équilibre humain ; revenus dispersés |
| Aquarium | Cinq favoris maximum, nage/décors existants, identité et profil conservés ; moteur de pêche suspendu derrière le bassin | FPS/chauffe sur appareil et coût de cinq modèles |
| Session / ergonomie | Pause, annulations/blur/pagehide, commandes indépendantes, changement de poste au repos ; v1–v5 → v6, import/export et profils isolés | Safari/iOS/Android physiques, perte de contexte WebGL et réseau mobile |

Il n'y a pas de blocage technique connu empêchant d'essayer une des 22 pratiques.
Les essais physiques, l'équilibrage humain, l'authenticité exhaustive des gestes
et les espèces sans asset ne sont pas déclarés livrés par les tests automatisés.
Voir `ESSAIS_TELEPHONE_V2.md`, `IMPLEMENTATION_V2.md` et `PUBLICATION_V2.md`.
