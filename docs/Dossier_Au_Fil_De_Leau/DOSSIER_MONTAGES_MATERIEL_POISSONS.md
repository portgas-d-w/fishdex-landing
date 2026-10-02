# Au fil de l’eau — Ma canne, montages, matériel et poissons

Version 1.0 — Recherche et conception du 2 octobre 2026.

Ce dossier est destiné à Codex et Claude Code pour travailler dans le dépôt actuel du jeu navigateur solo. Il spécifie les nouvelles fonctionnalités et fournit des catalogues à intégrer progressivement. Il ne prétend pas que ce contenu existe déjà dans le jeu déployé.

## 1. Décisions prioritaires

Le parcours devient **choisir sa canne → choisir une méthode compatible → préparer le montage → pêcher**. Cette décision remplace l’ancien ordre « méthode d’abord » lorsque les deux consignes divergent.

L’écran Matériel est organisé en **Ma canne / Mon sac / Ensembles**. Ma canne est un atelier visuel : une canne au centre, des repères reliés à ses composants ; toucher Montage ouvre son assemblage en gros plan.

Chaque élément équipé a une fonction : présentation de l’appât, profondeur, tenue au courant, action du leurre, discrétion, résistance, amortissement ou réception. Les rencontres et le combat utilisent ces propriétés réellement.

Le montage peut casser. Les éléments effectivement détachés sont perdus ; une canne, un moulinet et toute une bobine ne disparaissent pas lors d’une rupture du fil. Le joueur dispose toujours d’un kit gratuit renouvelable.

Chaque poisson possède un profil biologique documenté et une traduction ludique explicite. Ses paramètres de combat sont des propositions d’équilibrage, pas des mesures scientifiques.

**Commande de moulinage : simple appui, jamais des cercles.** L’orientation de la canne reste indépendante et simultanée. Conserver le lancer manuel par glissement, la tension continue, le fil comme indice principal, la discrétion de l’interface pendant la pêche et les correctifs tactiles déjà demandés.

## 2. Périmètre et ordre de lecture

Lire ce document, `docs/PROFILS_POISSONS.md`, `docs/CATALOGUES_CONTENU.md`, puis les JSON de `data/`. `data/sources.json` contient les URL consultées et les limites de leur utilisation. `data/correspondances_images.csv` couvre les images de poissons, les variétés et les mutations fournies.

Le dossier fournit **62 profils**, dont trois identités en attente, **22 méthodes et approches, 55 recettes, 80 entrées d’esches/leurres/amorces, 84 familles de matériel et 274 exemples d’équipements**. Il indexe 101 images de poissons reçues et 91 références. Ces nombres décrivent le dossier, pas les fonctions déjà jouables sur le site. Les 274 équipements sont des exemples originaux de configurations, à paramétrer avant activation.

Le pack 3D acheté reste utilisé. Aucune nouvelle génération 3D, dépense, dépendance payante, obligation de compte ou architecture multijoueur. L’application FishDex est une référence en lecture seule. Ne pas modifier son dépôt ou sa base.

Ces nouvelles règles précisent les modules matériel, rencontres, économie et combat. Les autres exigences du projet restent applicables : FishDex principal inspiré d’un Pokédex, carnet des prises secondaire, photos rémunérées une fois, XP et maîtrise, cinq spécimens favoris maximum dans l’aquarium, sauvegarde et migrations.

Les espèces exactes jouables, les noms de modèles et les valeurs existantes doivent être lus dans le dépôt actuel. Une capture d’écran mentionne 59 groupes, 96 fiches et 15 espèces jouables ; ces chiffres ne permettent pas de reconstituer une base de données. Ce dossier couvre les fichiers visuels reçus et une base de recherche, sans inventer une copie complète de l’application source.

## 3. Ce qui est documenté et ce qui est proposé

Trois couches séparées :

1. **Biologie documentée** : alimentation, habitat et activité d’après les références.
2. **Pratique de pêche** : présentation, composants et fonctionnement d’un montage d’après organismes et fabricants. Un conseil commercial ne démontre pas une probabilité de capture.
3. **Conception du jeu** : paramètres normalisés, profils de combat, préférences d’appâts, prix, progression et tolérances. Ils doivent être testés et ajustés.

Les colonnes `source_ids`, `research_status`, `identity_status` et `gameplay_is_proposal` servent à garder cette séparation. Ne jamais afficher au joueur une note de « caractère scientifique » dérivée des valeurs de jeu.

Les faits sont reformulés ; aucune photo ni illustration des références n’est intégrée. Les images FishDex appartiennent au corpus fourni par le joueur. Le dossier n’importe pas de contenu sous licence depuis les sites documentaires.

Les recherches ont mis en évidence des difficultés utiles : synonymes taxonomiques, variantes d’élevage, fichiers de trophées, espèces filtrantes, adultes migrateurs qui ne s’alimentent plus et cas d’identité non résolue. Ne pas masquer ces difficultés par une liste d’appâts universelle.

## 4. Refonte complète de Matériel

### 4.1 Ma canne : écran par défaut

Sur mobile, utiliser l’espace disponible comme un écran d’atelier, plutôt qu’un long catalogue dans une fenêtre. En-tête compact, retour clair et opaque, onglets lisibles, aucune transparence laissant passer le contenu derrière le titre.

La canne équipée occupe le centre. Afficher autour quatre à six points de sélection, avec traits courts qui ne se croisent pas : Canne, Méthode, Moulinet, Fil, Bas de ligne, Montage. Un composant absent de cette technique n’est pas affiché. Une canne au coup peut avoir un élastique et aucune commande de moulinet.

Utiliser les images du matériel disponibles, sinon une représentation par code ou une silhouette neutre. Un aperçu 3D réutilisant la canne existante est possible, à condition de ne pas charger un second moteur ni de rendre la scène de pêche inutilement en arrière-plan. Une image ou un schéma suffit au lancement du système.

Chaque repère montre uniquement nom de composant et élément équipé. Les nombres détaillés et comparaisons s’ouvrent après sélection. Les longs traits ne sont pas des zones tactiles ; les boutons ont des cibles confortables d’au moins environ 44 px.

Toucher Canne ouvre la liste des cannes possédées. Choisir une canne montre les méthodes compatibles et les conséquences sur l’ensemble. Si un changement rend un composant incompatible, expliquer le remplacement proposé avant de le réaliser ; ne pas effacer un équipement acheté ni acheter automatiquement une solution.

Toucher Méthode ouvre un sélecteur groupé : flotteur, fond/feeder, leurre, mouche, appâts en dérive, techniques particulières. Les méthodes futures restent visibles avec « À venir ».

Toucher Fil, Moulinet ou Bas de ligne ouvre un panneau de choix parmi les éléments possédés compatibles. Afficher deux ou trois propriétés utiles, quantité disponible et action Équiper. Un article absent peut mener à sa fiche Boutique ; aucune liste de produits non possédés n’envahit Ma canne.

Accessoires de réception dans une section secondaire repliable. La préparation de la prochaine ligne est indisponible durant un combat actif, sauf si la partie est réellement en pause ; ne pas changer les statistiques du montage qui est déjà dans l’eau.

### 4.2 Mon montage : assemblage en gros plan

Afficher le montage verticalement, avec fil, fixation et composants dans l’ordre réel. Chaque emplacement modifiable est sélectionnable. Le panneau de détail se referme sans perdre les choix en cours. Réglages avancés dans un panneau secondaire.

| Famille | Emplacements et réglages principaux |
| --- | --- |
| Flotteur | Flotteur, fixation/stops, plombée, émerillon éventuel, bas de ligne, hameçon, appât, profondeur |
| Fond simple | Lest, coulissement ou clip, butée, émerillon, bas de ligne, hameçon, appât |
| Feeder | Cage/type de feeder, fixation, contenu d’amorçage, bas de ligne, hameçon, appât |
| Method feeder | Feeder method, remplissage, bas de ligne court, hameçon, cheveux/bague, esche |
| Carpe spécialisée | Système de lest et libération, bas de ligne, hameçon, cheveu, esche équilibrée/coulante/flottante |
| Leurre souple | Leurre, hameçon/tête plombée, lest selon montage, agrafe éventuelle, bas de ligne |
| Leurre dur | Leurre, armement prévu par le produit, agrafe éventuelle, bas de ligne |
| Mouche | Soie, leader, pointe, mouche ; pas de flotteur ou de plomb par défaut sur une sèche |
| Toc/dérive | Fil, indicateur éventuel, plombée adaptée, bas de ligne, hameçon, appât |

Ne pas empiler automatiquement flotteur, plomb de fond et leurre sur toutes les lignes. Un montage est une recette de compatibilité, pas une obligation de remplir tous les emplacements connus.

Au flotteur, représenter la masse totale et la répartition des petits lests ; proposer d’abord des répartitions compréhensibles : étalée, groupée, groupée avec plomb de touche. La manipulation libre de chaque petit plomb peut arriver plus tard.

La portance nominale et le lest intégré du flotteur sont distincts. Un flotteur préplombé n’attend pas la même masse ajoutée qu’un flotteur non préplombé. Tenir compte aussi de l’hameçon, de l’esche et des accessoires selon une approximation déclarée ; ne pas traduire aveuglément « flotteur 2 g = exactement 2 g de plombs ajoutés ».

Contrôles bloquants : élément obligatoire absent, méthode non implémentée, quantité nulle, incompatibilité d’attache, poids hors limites autorisées. Avertissements non bloquants : montage peu discret, trop lourd pour la présentation, profondeur inadaptée, déséquilibre excessif.

Les avertissements sont concrets : « Cette plombée immerge le flotteur », « Cet appât reste au-dessus de la zone visée », « Ce bas de ligne résiste mal aux dents ». Ne pas afficher un pourcentage de réussite inventé.

### 4.3 Mon sac

Uniquement les possessions. Catégories : cannes, moulinets/soies, fils, bas de ligne, hameçons, flotteurs, lests, feeders, accessoires de montage, appâts, leurres, amorces, réception.

Présentation en petites vignettes ou lignes compactes : image, nom, quantité ou longueur restante, badge Équipé. Une seule action principale au bon endroit. Supprimer le bouton désactivé « Possédé » lorsqu’une information équivalente est déjà affichée.

Filtres : famille, compatible avec ma canne, compatible avec la méthode, consommables en faible quantité. Pas de filtre obligatoire ni de formulaire géant avant la liste. Les descriptions et statistiques sont dans la fiche.

### 4.4 Ensembles

Enregistrer une configuration nommée : canne, méthode, composants et réglages. Le preset mémorise une recette et des références d’objets ; il ne crée pas un stock supplémentaire ni une copie gratuite de matériel.

Équiper un ensemble vérifie les possessions et les quantités. Si un élément manque, montrer le manque et proposer une substitution possédée, le kit gratuit ou un accès Boutique. Aucun achat automatique. Les favoris sont accessibles rapidement avant de lancer.

### 4.5 Boutique

Même catalogue que Mon sac ; aucune seconde définition des statistiques. Séparer équipements durables, composants remplaçables et consommables. Regrouper les tailles/grammages d’un même produit dans sa fiche : ne pas afficher cent cartes identiques.

Montrer quantité achetée, prix total, argent restant, compatibilité, quantité possédée et coût approximatif des composants exposés à la perte. Les prix sont en monnaie virtuelle, sans référence aux prix réels des fabricants.

Un article en stock débloqué et fonctionnel peut être acheté. Un contenu catalogué « À venir » possède déjà sa fiche et son emplacement, mais pas un faux bouton d’achat. Pour rendre achetable une technique future avant son gameplay, il faudrait accepter qu’elle soit inutilisable ; ce dossier recommande d’attendre sa mise en service, tout en conservant son contenu visible.

## 5. Modèle physique simplifié mais cohérent

### 5.1 Ce qui agit sur les touches

La canne ne fait pas apparaître une espèce. Elle conditionne distance, précision, capacité d’animation et contrôle d’un montage. Les poissons doivent être présents dans le lieu et la zone atteinte.

La disponibilité d’une touche repose sur habitat, profondeur actuelle de présentation, alimentation/stade de vie, activité, taille de l’esche, mouvement du leurre, discrétion du montage, bruit et pression de pêche si simulés. Ajouter saison, température, luminosité et courant uniquement lorsqu’ils existent réellement dans le moteur.

Processus : identifier les poissons présents → vérifier s’ils peuvent rencontrer la présentation → évaluer intérêt et méfiance → approche, examen, suivi, attaque ou refus → touche observable → ferrage selon méthode.

Utiliser un taux de touche par unité de temps, pas un tirage à chaque frame. Proposition : taux = abondance × activité × rencontre × intérêt × présentation × discrétion ; les coefficients sont de jeu. Probabilité d’un événement sur dt : `1 - exp(-taux * dt)`. Ajouter des plafonds, une latence et des interactions spatiales ; éviter les touches simultanées incohérentes.

Un taux nul est réservé à une impossibilité explicite, comme aucun poisson dans cet habitat ou un adulte non nourrissant dans l’état simulé. Une préférence moindre ne doit pas toujours devenir une interdiction absolue.

La liste d’appâts favorables dans les profils est une hypothèse de gameplay/pratique, pas un tableau expérimental. Ne pas assimiler automatiquement régime naturel et appât capturant. Les pellets d’élevage ne remplacent pas universellement l’alimentation sauvage d’une espèce.

### 5.2 Compromis matériels

- Fil : résistance déclarée, diamètre, élasticité, abrasion, discrétion contextuelle. Le diamètre seul ne détermine pas une résistance universelle.
- Bas de ligne : mêmes propriétés, plus protection contre les dents et compatibilité des fixations. Le fluorocarbone n’est ni invisible dans toutes les conditions ni une protection absolue contre un brochet.
- Canne : longueur, plage de masse au lancer, action, amortissement et contrôle. Ne pas confondre grammes de puissance au lancer, livre de test curve et résistance du fil.
- Moulinet : capacité, frein et vitesse de récupération. Avoir un frein performant permet de rendre du fil pendant un départ ; il ne supprime pas le besoin d’orienter la canne.
- Hameçon : ouverture, taille, tenue et ardillon. Les tailles usuelles sont des désignations, pas des millimètres proportionnels ; gérer les tailles 20→1 puis 1/0→6/0 avec un ordre explicite.
- Lest : masse, forme, coulissement, position et densité. Il modifie descente, tenue et animation ; plus lourd ne signifie pas meilleur.
- Leurre : taille, masse, flottabilité, profondeur de fonctionnement et animations admises. Les coloris sont un facteur contextuel léger, pas un mécanisme de rareté biologique.

S’il faut des forces cohérentes, choisir une unité interne unique en newtons ; convertir une charge de rupture indiquée en kgf avec environ 9,81 N/kgf. Le poids d’un poisson en kilogrammes n’est pas directement la tension du fil. Les coefficients d’un profil ne sont pas des forces mesurées.

### 5.3 Animation et visibilité

Les poissons conservent leur identité biologique, leur gabarit et leur robe à travers combat, réception, photo et aquarium. Réutiliser les poissons 3D existants ; une espèce sans modèle ne devient pas jouable par substitution silencieuse.

Préparer références d’animations : nage calme, accélération, virage, secousse, respiration et débattement. Les utiliser seulement si disponibles ; distinguer animation réelle et animation provisoire par code. La simulation du poisson ne dépend pas du nombre de modèles rendus : seuls les acteurs visibles doivent être chargés.

## 6. Combat et comportement

Le combat est piloté par la tension, la direction de traction, la longueur de fil, la flexion, le frein, le terrain et l’énergie du poisson. Le joueur oriente la canne et mouline par appui. Il peut guider sans mouliner.

En tension utile, le poisson dépense de l’énergie lorsqu’il lutte contre la résistance. Trop mou : perte progressive de contact, puis risque de décrocher. Trop tendu : surcharge cumulative, puis rupture. Prévoir une tolérance aux brèves variations ; aucun échec instantané arbitraire après un petit écart tactile.

Le poisson alternе déplacement libre, départ, déplacement latéral, secousse, recherche de refuge, rapprochement, accalmie et nouveau départ selon ses paramètres et le terrain. Les transitions sont pondérées et conditionnelles ; aucune séquence répétée identique pour chaque espèce.

Un poisson revenant vers le pêcheur peut provoquer du mou même si le moulinet est appuyé ; récupérer ce fil doit être possible. Un petit poisson face à un ensemble adapté peut être ramené pendant sa résistance. Un gros départ peut faire sortir du fil via le frein malgré le moulinage.

Le fil et la canne restent les indices principaux, avec sons subtils et mouvements de l’eau. Pas de grands tableaux de caractéristiques pendant le combat. Le flotteur reste immergé durant l’essentiel du combat au flotteur, et redevient visible à l’approche du bord selon la géométrie.

Les paramètres `burst`, `endurance`, `agility`, `head_shakes`, `cover_seeking` et `slack_pressure` sont normalisés entre 0 et 1 pour l’équilibrage. Leur valeur initiale ne correspond pas à une note scientifique. Les profils documentent séparément faits et propositions de combat. L’attaque alimentaire d’un poisson n’est pas une preuve de son comportement une fois ferré.

Ajouter des variations individuelles bornées : taille, état énergétique, prudence liée au contexte et petites différences d’intensité. Garder les grandes tendances reconnaissables. Ne pas attribuer une personnalité unique figée à chaque robe de carpe.

## 7. Casse, perte et consommables

### 7.1 Le montage est un assemblage connecté

Chaque instance de montage comporte des nœuds/composants et des liaisons : nœud de fil, émerillon, agrafe, fixation coulissante ou clip. La rupture est localisée sur une liaison réellement présente. Les composants perdus sont calculés à partir de ce qui se détache, du coulissement et des dispositifs de libération.

La résistance effective dépend du composant, de son état et d’un coefficient de nœud simplifié. Définir explicitement ces coefficients comme valeurs de jeu. Il ne faut pas toujours casser le composant le plus cher ni faire disparaître un montage entier par défaut.

| Événement | Résultat attendu |
| --- | --- |
| Hameçon décroché | Poisson perdu ; montage généralement récupérable ; appât selon son état |
| Rupture du bas de ligne | Partie après la rupture perdue ; flotteur ou lest situés avant généralement conservés selon fixations |
| Rupture du corps de ligne | Partie détachée perdue ; longueur de fil engagée correspondante déduite |
| Lest libéré par clip | Lest déduit ; poisson et reste du montage éventuellement encore attachés |
| Hameçon ouvert ou liaison rompue | Échec distinct d’un décrochage ; traiter uniquement les composants réellement perdus |
| Accrochage puis rupture | Perte calculée sur la rupture, pas une seconde perte pour l’accrochage |

Les systèmes de libération ont une fonction documentée dans la pêche réelle ; le choix de leurs probabilités et conditions dans le jeu est un équilibrage. Référence : `tech_lead_clip` et `tech_chod`.

### 7.2 Quantités et réservation

Avant de lancer, réserver les composants nécessaires de manière atomique. Un flotteur monté ou un leurre en service reste possédé : l’interface doit distinguer stock libre et quantité en service. La réservation empêche de réutiliser le même exemplaire pour un autre montage sans démontage.

Retour intact : libérer la réservation, garder les composants réutilisables. Appât consommé : déduire une portion selon l’événement. Casse : déduire uniquement les composants perdus ; libérer les autres. Un appât déjà déduit au lancer ne doit pas être déduit une seconde fois lors d’une touche ou d’une casse.

Choisir une politique unique de consommation et la documenter : ici, l’appât est réservé à la préparation et comptabilisé lors de sa consommation/perte ou du retour lorsqu’il est inutilisable. Le PVA est consommé au lancer valide ; l’amorce suit les portions effectivement délivrées. Les leurres durent jusqu’à perte ou retrait ; pas de perte à chaque poisson.

Fil : stock en mètres, longueur sur moulinet et longueur engagée distinctes. Déduire seulement la portion perdue. Sur la première version, les dommages cumulatifs invisibles peuvent être omis ; si l’usure existe, la montrer avant qu’elle devienne punitive.

Une interruption, un rechargement ou un retour menu ne doit ni dupliquer le matériel ni doubler sa perte. Persister un identifiant d’action et la résolution de la ligne en service. Mettre en pause en arrière-plan ; définir une politique de récupération cohérente pour un combat interrompu, sans produire une prise gratuite.

### 7.3 Kit gratuit illimité

Kit d’initiation complet : canne de base, moulinet de base si nécessaire, fil, bas de ligne, flotteur, plombée, hameçon sans ardillon et appât de base. Les composants de ce kit sont identifiés `starter_unlimited`; ils restent utilisables à volonté après une casse.

Le kit n’est ni revendable ni convertible en équipement payant. Il ne renouvelle pas un leurre acheté, une amorce spéciale ou les autres composants ajoutés par le joueur. Un montage mixte gratuit/payant conserve les règles de perte des éléments payants.

Rééquiper le kit se fait en une action explicite, sans vider le sac. Prévenir les impasses : même avec zéro argent et aucun consommable acheté, le joueur peut capturer des poissons accessibles, photographier ses prises et reprendre sa progression.

### 7.4 Économie et plaisir de jeu

Les achats sont financés par les photos déjà prévues, créditées une fois par spécimen. Un remboursement ou retour ne recrédite pas une capture. Les coûts de montage, la fréquence de casse et les revenus doivent permettre la reprise après erreur.

Les prix des JSON restent `null` jusqu’à l’équilibrage. Les prix ajoutés par l’agent sont provisoires, en pièces virtuelles. Ne pas utiliser des prix réels issus des pages commerciales. Un matériel coûteux offre des compromis intéressants, jamais une multiplication universelle de la rareté ou un combat gagné automatiquement.

Après un échec : explication courte, éléments perdus, valeur approximative et action Refaire / Kit gratuit. Les détails se consultent après le combat. Pas d’achat bloquant en surimpression pendant la pêche.

## 8. Catalogue riche dès maintenant, jouabilité honnête

Charger l’intégralité des définitions dans les interfaces, sans charger toutes leurs ressources 3D. Chaque entrée a un état indépendant : `catalogued`, `implemented`, `unlocked`, `owned`, `equipped`. La présence dans un JSON ne vaut pas implémentation.

Le contenu fourni est initialement `catalogued`; Codex doit comparer avec le dépôt et promouvoir seulement les fonctions réellement disponibles. Les conditions d’accès futures ne doivent pas être confondues avec les éléments non programmés.

Les fiches prévues restent consultables : image fournie ou silhouette, nom, principe, composants, compatibilités et état À venir. Un bouton de lancer ou d’achat ne prétend pas fonctionner pour une méthode absente. Les objectifs de collection réalisables ne comptent pas les futures espèces.

Prévoir dès aujourd’hui les familles coup, anglaise, bolognaise, fond, feeder, carpe, leurres, verticale, mouche, toc et techniques particulières. Les termes hair rig, drop-shot, wafter, feeder et stalking désignent respectivement des montages, appâts, dispositifs ou approches : ne pas tout mettre au même niveau de navigation.

Les catalogues fournis distinguent `method`, `rig`, `bait/lure/groundbait` et `equipment`. Plusieurs dimensions d’un même produit sont des variantes de SKU, pas de nouvelles techniques ni des objets avec une biologie différente.

## 9. Identités, variantes et poissons particuliers

Les fichiers images ne sont pas une nomenclature scientifique. Ne pas prendre « record », « géant », « trophée » ou une couleur pour une espèce. Ne pas réunir automatiquement deux taxons distincts sous prétexte qu’ils se ressemblent.

Correspondances à contrôler dans l’application : amour blanc/carpe herbivore ; baeri/esturgeon sibérien ; perche/perche fluviatile ; hotu/nase ; brème bronze/brème commune ; blageon/soufie ; lavaret/corégone palée. Plusieurs ressemblent à des alias, d’autres demandent le taxon source.

Carpes miroir, cuir, linéaire et fully scaled : formes d’écaillure à rattacher proprement. Koï, Ghost et colorations ornementales : conserver leur origine de collection et confirmer le groupe/taxon dans FishDex avant fusion. Une robe albinos ne justifie pas un supplément d’endurance ; taille et état sont séparés.

`sandre-dore.png` peut désigner le doré jaune nord-américain, mais le nom du fichier ne prouve pas l’espèce. `silure-mandarin.png` ne permet pas d’identifier un taxon. `gobie.png` est trop générique. Ces fiches sont présentes mais leur activation exige résolution.

Les filtrantes argentée/marbrée n’obtiennent pas une table universelle maïs/bouillette/leurre. Prévoir d’abord une découverte par observation, ou une mécanique spécialisée documentée plus tard. Les lamproies ne deviennent pas des prises classiques au ver : leurs stades alimentaires demandent un traitement distinct.

Apron et esturgeon européen : proposition d’observation dans des habitats adaptés, plutôt que poissons trophées ordinaires. C’est un choix de conception du dossier ; il n’est pas présenté comme un résumé juridique de toutes les réglementations. Aucun moteur réglementaire par pays n’est demandé.

Saumons et aloses en remontée : ne pas attribuer automatiquement une faim alimentaire à leurs attaques sur artificiels. Prévoir un mode de réaction distinct, ou conserver ces fiches en contenu futur jusqu’à validation de la mécanique.

## 10. Architecture et intégration

Les JSON sont une base de conception portable ; les adapter à la pile et aux identifiants déjà présents. Ne pas injecter de nouveaux identifiants dans les anciennes prises sans une table explicite de migration.

Entités centrales : espèce/groupe, forme/coloration, profil de comportement, méthode, recette de montage, famille de composants, article/SKU, possession/quantité, canne équipée, instance de montage en service, preset, lieu/habitat et événement de pêche.

Conserver catalogue statique séparé du stock, de la progression et de l’état de combat. La boutique, le sac, les presets et la validation de lancer utilisent les mêmes compatibilités et références. Pour les unités : grammes, mètres, millimètres, désignations d’hameçons, charges déclarées et newtons ne sont jamais des valeurs interchangeables.

Les recettes donnent des `required_slots`, `optional_slots`, contraintes de présentation, méthodes admises et politique de perte. Les emplacements désignent des familles, pas un modèle commercial imposé. Les valeurs de compatibilité biologiques sont dans le profil ou les règles de présentation, pas enfouies dans le composant d’interface.

Prévoir : sélection de canne, validation du montage, liste des articles compatibles, assemblage de la ligne, réservation du stock, événement de touche, comportement de combat, résolution de casse, enregistrement de capture et sauvegarde. Réutiliser les modules existants ; pas de framework vide surdimensionné.

Les catalogues volumineux ne justifient pas une simulation de centaines de poissons à chaque frame. Préfiltrer les espèces du lieu, puis tester les candidats proches de la présentation. Les données sont légères ; images et modèles sont chargés à la demande.

### Migration

1. Lire la sauvegarde existante et sa version ; créer une migration testable.
2. Conserver toutes les espèces, variantes, prises, photos, argent, XP et favoris.
3. Transformer la possession booléenne d’anciens durables en instance possédée.
4. Pour les anciens composants réutilisables, accorder un exemplaire compatible ou une dotation de migration documentée ; ne pas supprimer un achat.
5. Ajouter le kit gratuit et convertir l’ancien ensemble actif en configuration valide.
6. Les presets mémorisent les références migrées ; les anciennes espèces non résolues restent conservées, sans fusion destructrice.
7. Export/import valide quantités, états, références et doublons. Une définition future manquante ne doit pas effacer une ancienne prise saine.

## 11. Interactions tactiles et états de jeu

Conserver la consigne utilisateur corrigée : `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none` sur le jeu et ses commandes ; bloquer le drag natif des images et les menus contextuels qui interrompent ces gestes.

`touch-action: none` seulement sur canvas et surfaces de lancer/canne/moulinet. Ne pas l’appliquer à un parent englobant les menus. Ma canne, Mon sac, boutique, carnet et fiches conservent leur défilement ; les champs restent éditables et leur texte sélectionnable.

Suivi indépendant des doigts, capture de pointeur et nettoyage sur relâchement, `pointercancel`, perte de capture et perte de focus. Aucun moulinage restant actif après retrait du doigt. Les menus bloquent les actions derrière eux et mettent clairement le combat en pause.

Ne pas reconstruire l’ancien combat à bouton appuyer/relâcher seul : un appui commande le moulinage, mais orientation, poisson, frein et tension restent indépendants.

## 12. Ordre d’exécution pour Codex / Claude

### Étape A — Audit et préservation

Lire AGENTS.md et RELAIS_PROJET.md, inspecter Git, la navigation, les catalogues, les espèces jouables, le stock, la sauvegarde et le combat. Ne pas annuler les changements présents. Créer un point de reprise adapté. Établir la correspondance entre les identifiants du dossier et du jeu.

### Étape B — Catalogue complet et nouvelle navigation

Intégrer les familles et toutes les fiches prévues, leurs états, les trois onglets et les choix contextuels. Construire Ma canne et Mon montage avec une représentation visuelle légère. Réutiliser les assets contrôlés. La boutique et Mon sac partagent le catalogue.

### Étape C — Une chaîne complète fonctionnelle

Activer d’abord le flotteur : montage équilibré, profondeur réellement prise en compte, appât, rencontres, combat existant amélioré, réservation du stock, casse localisée, réception, photo et sauvegarde. Si leurre/fond existent déjà, les préserver et les brancher progressivement sur les mêmes règles.

### Étape D — Profils de poissons présents

Pour chaque espèce déjà jouable, attribuer le profil documenté correspondant ; tester plusieurs gabarits et des variations individuelles. Ne pas activer toutes les fiches futures avec le même poisson 3D. Les fiches d’observation peuvent exister avant que leur mécanique soit implémentée.

### Étape E — Extension et finition

Étendre les méthodes réellement réalisables avec leurs animations et règles propres. Harmoniser les fiches, les comparaisons et les états vides. Documenter un exemple d’ajout pour espèce, montage, appât, SKU et comportement.

Dans le relais, écrire pour chaque module : terminé, partiel, à venir, blocage, fichiers modifiés, vérifications et décision d’équilibrage. Ne jamais annoncer « tout le contenu jouable » au seul motif que les fichiers JSON sont présents.

## 13. Critères d’acceptation

- Sur mobile, Matériel s’ouvre directement sur Ma canne ; choisir une canne puis modifier le montage prend peu d’actions et ne nécessite pas de défiler tout un catalogue.
- Chaque point visuel correspond au bon composant ; les traits ne se croisent pas et aucune information passe derrière l’en-tête.
- Une canne au coup n’obtient pas un moulinet fictif ; les emplacements correspondent à la technique.
- Un montage trop plombé au flotteur a un effet cohérent, distinct du courant ou d’un poisson qui tire.
- Lancer dans deux habitats ou à deux profondeurs produit des rencontres cohérentes avec les poissons présents, sans apparition magique d’une espèce absente.
- Canne et moulinage fonctionnent simultanément ; le moulinage est un simple appui. Les gestes annulés s’arrêtent proprement.
- Un fil brièvement mou n’échoue pas instantanément ; le mou prolongé et la surcharge présentent deux risques distincts.
- Une casse du bas de ligne et une casse du corps de ligne ont des pertes différentes ; un décrochage ne détruit pas tout.
- Une résolution rejouée, un rechargement ou une capture sauvegardée ne dupliquent ni perte, ni récompense, ni objets.
- Avec zéro argent, le kit gratuit permet de continuer. Mélanger composants gratuits et payants ne rend pas les composants payants gratuits.
- Les presets ne dupliquent pas l’inventaire ; un ensemble incomplet explique les éléments manquants.
- Les fiches futures sont visibles et signalées ; aucun achat ou objectif factice.
- Les anciennes sauvegardes, prises, découvertes, XP, argent et cinq favoris sont conservés.
- Vérifier portrait/paysage et plusieurs largeurs, le défilement, les champs de saisie, clavier, gros textes et contraste. Tester sur iPhone si accessible ; l’émulation ne prouve pas les performances physiques.
- Vérifications du projet et build passent. Déployer seulement sur le projet du jeu déjà autorisé `fishdex-landing`, équipe `portgas-d-ws-projects`, après contrôle de la liaison ; conserver fishdex.fr et les autres projets.

## 14. Limites et compléments à poursuivre

Les statistiques normalisées et les prix demandent des essais de gameplay. Il n’existe pas ici de mesures comparables d’effort de traction, de taux de morsure ou d’endurance par espèce. Aucun chiffre de ce type n’est inventé comme fait biologique.

Les variantes, la taxonomie exacte de l’application et les espèces réellement jouables nécessitent la lecture de son catalogue source. Les éléments incertains restent désactivés jusqu’à résolution. Les techniques particulières moins documentées dans ce dossier sont identifiées comme à approfondir.

Le catalogue vise une base large pour ce jeu d’eau douce et ses extensions associées ; il ne prétend pas recenser toutes les techniques mondiales, les références commerciales ni les réglementations de pêche. Les entrées supplémentaires ont leur place dès maintenant dans la même structure.
