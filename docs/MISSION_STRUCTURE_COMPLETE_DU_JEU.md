# Au fil de l’eau — construire la structure complète du jeu

Référence de conception du 1er octobre 2026. Jeu navigateur solo, utilisable sur mobile et PC, actuellement accessible sur fishdex.fr.

Mission unique : structure complète, refonte de toutes les interfaces et amélioration visuelle de la scène. Les anciennes consignes séparées ne sont pas nécessaires ; applique ce document dans son ensemble.

## 1. Instruction principale

Construis maintenant **la structure complète de tout le jeu**, ses interfaces et les connexions entre ses systèmes. L’objectif ne se limite pas à préparer le matériel ou à améliorer quelques menus.

Cette mission consolide les décisions de l’utilisateur et remplace les anciennes consignes contradictoires. Le FishDex inspiré du Pokédex est le cœur de la collection ; le carnet est un historique secondaire. Toutes les interfaces du périmètre décrit doivent être construites, même si une partie du contenu et des techniques sera ajoutée plus tard.

Exécute la mission dans le dépôt actuel : inspecte, implémente, vérifie, corrige et documente. Ne livre pas seulement une proposition d’architecture, des maquettes ou des écrans déconnectés. Préserve et améliore les systèmes qui existent déjà. Les choix courants nécessaires à ce périmètre sont validés.

La structure complète signifie : navigation réelle, écrans construits, données cohérentes, états pris en charge, sauvegarde, parcours fonctionnels avec le contenu disponible et points d’intégration utilisables pour le contenu futur. Elle ne signifie pas que toutes les espèces ou toutes les méthodes futures sont déjà jouables.

## 2. Périmètre et contraintes

- Jeu solo ; aucun multijoueur, compte obligatoire ou nouveau backend pour cette mission.
- Conserve le moteur et la pile existants autant que possible. Pas de réécriture générale sans nécessité démontrée.
- Aucune nouvelle dépense ni abonnement. Pas de génération de modèles 3D pour le moment.
- Utilise les poissons du pack acheté ; rends leurs remplacements futurs indépendants de la progression enregistrée.
- Le projet source de l’application FishDex sert de référence en lecture seule. Ne modifie pas son dépôt, ses utilisateurs, ses secrets, sa base ou son déploiement.
- Les images fournies servent aux fiches, au matériel et aux références visuelles. Une image ne fournit pas à elle seule une espèce jouable ou sa logique de pêche.
- Conserve les sauvegardes actuelles, l’export/import et les modifications utilisateur présentes dans le dépôt.
- Ne contourne pas les permissions ou les limites des outils. Documente un blocage et poursuis les tâches indépendantes.

Le projet Vercel du jeu précédemment autorisé est `fishdex-landing`, équipe `portgas-d-ws-projects`. Vérifie la liaison effective avant publication. Conserve le domaine actuel et les autres projets. Le déploiement de cette mission est autorisé après validation.

## 3. Première étape : audit de l’ensemble existant

Lis les instructions applicables, les fichiers de relais et les sources. Vérifie le statut Git et crée un point de reprise adapté, sans annuler les modifications présentes ni publier de secrets.

Inventorie chaque écran et système : présent et fonctionnel, partiel, absent ou bloqué. Identifie les divergences avec ce document et les modèles de sauvegarde à migrer.

Crée `docs/STRUCTURE_COMPLETE.md`, avec la liste des interfaces, leur état, les connexions et les conditions de validation. Construis à partir de l’existant ; ne crée pas un second jeu parallèle.

## 4. Tous les espaces du jeu

| Espace | Écrans et fonctions attendus |
| --- | --- |
| Pêche | Préparation, lancer, attente, touche/ferrage, combat, réception, photographie, résultat |
| FishDex | Catalogue principal, catégories, recherche/filtres, entrées inconnues, fiches, variantes, objectifs de collection |
| Carnet | Historique des spécimens, filtres combinables, tris, photos, détail d’une prise, records et favoris |
| Matériel | Inventaire, préparation, familles d’équipement, fiches, montages compatibles, équipement actif et réglages |
| Boutique | Catégories, fiches produits, prix, possession, conditions d’accès, achats et confirmations |
| Lieux | Choix des lieux disponibles, fiches et habitats ; emplacement des lieux futurs |
| Aquarium | Vue 3D, cinq favoris, sélection des spécimens, personnalisation, décoration et fiche d’un favori |
| Progression | Niveau/XP, étapes accessibles, badges de maîtrise, records et objectifs |
| Réglages et aide | Audio, qualité graphique, commandes, tutoriel consultable, export/import de sauvegarde |

Ces espaces doivent être reliés par une navigation utilisable. Le FishDex doit avoir une visibilité supérieure à celle du carnet. Les lieux peuvent être intégrés à la préparation ou au menu pour limiter le nombre d’entrées principales.

L’ouverture d’un menu pendant un combat met explicitement la partie en pause. Les actions derrière les panneaux sont bloquées. Le retour restaure l’état approprié, les filtres et la consultation quand c’est pertinent.

## 5. Le parcours complet de pêche

Formalise les transitions réelles : préparation → lancer → montage dans l’eau → touche/ferrage → combat → réception → photo et résultat → retour à la pêche.

Traite aussi annulation du lancer, montage incompatible, cible invalide, absence de touche, casse, décrochage, changement de lieu, pause/reprise et interruption d’un geste. Une transition ne doit pas laisser une commande active ou créditer une prise non obtenue.

### Lancer validé

En phase prête à lancer, le geste commence dans le tiers inférieur environ. Le doigt contrôle visiblement la canne pendant la préparation puis la projection.

Le relâchement dans la partie centrale ou haute déclenche le lancer si le geste et la cible sont valides. La direction vient du mouvement ; la puissance dépend surtout de la vitesse de projection, avec une contribution de l’amplitude et une limite liée au matériel. Une prévisualisation discrète est possible pendant le geste.

Relâcher dans la zone basse ou annuler le geste ne lance pas. Un geste sur un menu ou sur le moulinet ne prépare pas de lancer. Aucun bouton « Lancer la ligne » ou lancer automatique vers un poste prédéfini.

### Combat validé

Le joueur garde une tension utile pour maintenir le contact et fatiguer le poisson. Fil trop mou : risque progressif de décrochage. Tension excessive : risque de casse. Prévois des tolérances aux écarts courts.

La tension dépend du poisson, de la longueur de ligne, de la pointe de la canne, de sa flexion et du moulinage. Arrêter de mouliner ne rend pas automatiquement le fil mou. Un frein simplifié peut laisser sortir du fil sous résistance pendant les départs puissants.

Le doigt oriente la canne horizontalement et verticalement ; cette orientation modifie réellement pression, amortissement et guidage. La commande de moulinet fonctionne indépendamment et simultanément : geste circulaire avec un second doigt sur mobile ; glissement de souris pour la canne et molette pour récupérer du fil sur PC.

Un poisson qui tire fortement demande du contrôle ; une accalmie permet de récupérer du fil ; un retour vers le joueur demande de récupérer le mou. Un petit poisson faible par rapport au matériel peut être ramené pendant sa résistance. Un poisson qui ralentit peut repartir.

Le fil et la courbure de la canne sont les indices principaux. Le fil reste attaché à ses extrémités et lisible. Sur les montages au flotteur, le bouchon reste immergé pendant l’essentiel du combat et réapparaît près du bord.

Les espèces, gabarits, comportements et matériels modifient ce système par des paramètres. Aucun bouton ou délai seul ne doit résoudre tous les combats.

## 6. FishDex : le cœur de la collection

Construis un FishDex fortement inspiré des codes d’un Pokédex : entrées numérotées, grille, silhouettes, découverte, identification et objectifs visibles.

- Organise les catégories selon les données vérifiées du projet FishDex.
- Affiche clairement capturé/non capturé, progression et prochaines découvertes possibles.
- Prévois une fiche par espèce : illustration, informations connues, indices utiles de lieu/méthode/appât, formes/robes, records et maîtrise.
- À la première capture, révèle après le combat le nom, le numéro, l’image et l’avancement obtenu, avec une animation courte.
- Les prises suivantes peuvent découvrir une variante, améliorer un record ou faire progresser la maîtrise.
- Propose un accès aux entrées manquantes et à des objectifs concrets que le joueur peut poursuivre.

Distingue dans les données et les compteurs : espèce, forme/variété, coloration, gabarit et individu. Les objectifs espèces, variantes et maîtrise restent séparés.

Les espèces futures possèdent leur place et un état « À venir ». Le pourcentage de l’objectif actuellement réalisable ne doit pas exiger du contenu non implémenté. Ne transforme pas un nom de fichier « record », « géant » ou « trophée » en nouvelle espèce.

## 7. Carnet secondaire et filtrage intelligent

Le carnet conserve toutes les prises individuelles : identifiant unique, espèce, forme, coloration, longueur, poids, photo, date, lieu, méthode et équipement/appât lorsque connus.

Prévois des filtres combinables par espèce, variante, rareté, lieu, méthode, période, taille/poids et favoris ; des tris par date, poids, longueur et rareté ; le nombre de résultats, les filtres actifs et leur réinitialisation.

Ajoute des vues rapides utiles : dernières prises, records personnels, premières découvertes, variantes et favoris de l’aquarium. Utilise les données réellement enregistrées et gère les champs manquants des anciennes prises.

Depuis une prise, ouvre sa fiche FishDex ou gère son statut de favori. Depuis une espèce, accède à ses prises filtrées. La fiche individuelle ne doit pas se confondre avec la fiche de l’espèce.

## 8. Matériel, méthodes et boutique

Prévois dès maintenant les catégories et fiches de cannes, moulinets, lignes, bas de ligne, hameçons, montages, flotteurs, plombs, feeders, appâts naturels, leurres, amorces et accessoires de réception.

La préparation s’organise par méthode → canne/montage compatible → appât/leurre. Les emplacements requis dépendent de la technique ; un moulinet ou un flotteur n’est pas imposé à toutes les méthodes.

Montre l’ensemble actif, les incompatibilités, les éléments manquants et les propriétés utiles. Les réglages comme profondeur et frein ont leur place et sont actifs uniquement lorsqu’ils sont pris en charge.

Prépare les familles référencées dans FishDex, dont flotteur, fond, feeder, leurre et mouche lorsqu’elles existent dans le catalogue. Les méthodes jouables utilisent une logique réelle adaptée. Les futures méthodes possèdent leurs fiches et emplacements, mais leur lancement reste désactivé et expliqué.

La boutique utilise le même catalogue d’objets que l’inventaire. Elle expose prix, quantité possédée, disponibilité et conditions. Les achats fonctionnent et persistent. Distingue acheté et équipé. Prévois des décorations d’aquarium et leur accès depuis l’espace concerné.

Conserve un équipement de base permettant de continuer à pêcher sans argent. Aucun paiement réel. Les articles prévus n’ont pas de bouton d’achat factice.

## 9. Lieux, habitats et conditions

Construis le choix des lieux présents et l’emplacement des futurs lieux, avec fiche, état d’accès et habitats disponibles. Préserve les scènes actuelles ; cette mission n’impose pas de créer immédiatement plusieurs grands environnements.

Associe les rencontres à la position réelle du montage, à la méthode et à l’appât, ainsi qu’aux conditions simulées effectivement prises en charge. Prévois dans les données les informations de profondeur, type de zone et conditions utiles aux extensions.

Les lieux, rencontres et conditions doivent pouvoir être étendus sans modifier toutes les interfaces. Aucun service météorologique payant ni nouvelle fonctionnalité de géolocalisation.

## 10. Capture, photos, argent, XP et badges

À chaque capture réussie, une opération cohérente : enregistre le spécimen et sa photo locale, met à jour découvertes/variantes et records, attribue argent et XP, évalue les badges, puis affiche le résultat.

La photo est produite par le rendu du spécimen du jeu, sans IA externe. Sa rémunération virtuelle est attribuée une seule fois par capture. Prévois une valeur de base, l’effet du gabarit et de la variante, puis les bonus de découverte ou de record. Les prises communes restent utiles.

Les niveaux ouvrent des possibilités ; les badges récompensent des objectifs de maîtrise observables. Prévois leurs fiches, conditions, progression, obtention et liens vers les objectifs concernés. Les déblocages sont gérés par un système commun, pas par des conditions contradictoires dispersées dans les écrans.

La présentation met la photo au premier plan, puis espèce/variante, dimensions, gains et nouveautés. Les actions « Continuer à pêcher » et « Ajouter aux favoris » sont claires. Ne verse pas une seconde récompense après rechargement, retour à l’écran ou import.

## 11. Aquarium et personnalisation

Le joueur expose au maximum cinq **spécimens individuels déjà capturés**. Ils conservent leur identité, robe et gabarit. Toutes les prises restent dans le carnet, même lorsqu’elles ne sont pas exposées.

Construis la vue, les cinq emplacements, la sélection/remplacement/retrait des favoris, leurs fiches et les panneaux de personnalisation. Prévois sol, plantes, rochers, fond et lumière avec choix sauvegardés et emplacements pour des décorations futures.

La nage est douce, adaptée aux formes et contenue dans le bassin. Charge seulement les modèles utiles ; la scène de pêche cachée ne continue pas à tourner inutilement. Aucun entretien obligatoire ni pénalité d’absence.

## 12. Base de données locale et possibilités d’extension

Formalise les entités utiles : espèces, formes/colorations, ressources visuelles, méthodes, objets, montages, lieux/habitats, rencontres, spécimens, photos, découvertes, objectifs/badges, progression, inventaire, aquarium et sauvegarde.

Utilise des identifiants stables. Les liens entre données, modèles 3D et illustrations sont explicites. Remplacer une ressource graphique ne doit pas casser les captures ou les découvertes enregistrées.

Prévois aussi les références d’animations par poisson : nage calme, nage rapide, débattement suspendu, débattement sur tapis et respiration hors de l’eau. Le système distingue une animation réellement disponible d’une solution provisoire ou absente. Il permet de remplacer les poissons du pack par les futurs modèles animés sans refaire combat, capture, photos ou aquarium.

Sépare les catalogues statiques de la progression du joueur et les règles du rendu. Centralise récompenses, compatibilités, déblocages et paramètres de rencontre/combat. Appuie-toi sur l’architecture actuelle ; ne construis pas un framework général ou de nombreux services vides.

Définis les points d’intégration concrets pour ajouter : une espèce et son modèle, une variante, un objet, une technique, un lieu, une décoration et un badge. Fournis des exemples de configuration fondés sur le contenu disponible, puis vérifie qu’une extension de données apparaît au bon endroit sans refonte de navigation.

## 13. Sauvegarde, réglages et états transversaux

Versionne les sauvegardes et migre les données existantes. Persiste équipement, progression, argent, carnet, découvertes, badges, favoris, aquarium et réglages utiles.

Préserve export/import avec validation. Gère une photo manquante, une ressource introuvable, un manque de stockage et un fichier d’import invalide sans effacer la progression saine. Prévois les écrans et messages de récupération nécessaires.

Tous les espaces prennent en charge disponible, verrouillé, à venir, vide, chargement et erreur lorsque pertinents. Un contenu « verrouillé » doit être implémenté et accessible après sa condition ; un contenu « à venir » manque encore à l’implémentation. Ne mélange pas ces états.

Les interactions tactiles ne doivent pas sélectionner le texte, ouvrir un menu natif ou déplacer la page pendant la pêche. Préserve les règles validées : `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none` sur les éléments de jeu concernés ; `touch-action: none` sur les surfaces de lancer/canne/moulinet. Ne bloque pas le défilement des menus ou la saisie et la sélection dans leurs champs.

Gère chaque doigt indépendamment et nettoie les commandes à la fin, lors d’une annulation ou d’une perte de focus. Aucun geste ne reste actif après avoir retiré le doigt.

## 14. Mission visuelle complète : scène 3D et toutes les interfaces

L’amélioration visuelle est un livrable à part entière de cette mission. Produis une différence nette et cohérente, au-delà d’un changement de couleurs ou de quelques effets activés. Inspecte la scène et les menus dans le navigateur, identifie les faiblesses et corrige-les réellement.

### 14.1 Direction artistique et méthode de travail

Vise une ambiance naturelle stylisée et soignée : matin doux au bord d’un étang, lumière légèrement dorée, ombres fraîches, eau profonde, végétation variée et paysage composé en plusieurs plans. Harmonise les scènes de pêche, les présentations de poissons, l’aquarium et les menus.

Avant de modifier le rendu, conserve des captures de référence de la scène et des principaux écrans, puis une mesure de performances dans les conditions disponibles. Travaille par passes et compare les résultats. Réutilise les modèles et ressources actuels ; améliore les matières, textures légères, éclairages, disposition et effets par le code. Aucune génération de nouveaux modèles 3D, aucun achat et aucune nouvelle dépendance payante.

### 14.2 Eau : première priorité de la scène

- Remplace les lignes trop régulières ou l’aspect quadrillé par des ondulations naturelles superposées à plusieurs échelles, avec mouvement lent et irrégulier.
- Travaille les reflets du ciel, les variations de teinte et la distinction entre berge et profondeur. Utilise une transparence localisée si elle apporte un résultat convaincant, sans rendre tous les poissons visibles à travers l’eau.
- Ajoute des rides localisées à l’arrivée du montage et des éclaboussures discrètes lors des mouvements proches de la surface. Les effets doivent correspondre aux événements réels du jeu.
- Préserve en permanence le contraste du fil, le point d’entrée dans l’eau et le montage lorsqu’il doit être visible. La surface ne doit pas devenir un miroir aveuglant.
- Ne modifie pas les coordonnées de lancer, la profondeur logique ou la simulation du combat simplement pour produire l’effet visuel.

### 14.3 Éclairage, atmosphère et profondeur

Crée une lumière principale cohérente, un éclairage ambiant équilibré et des ombres douces limitées aux éléments qui en bénéficient réellement. Ajuste exposition, contraste et teintes pour supprimer l’impression de voile gris et de surfaces uniformes.

Ajoute une brume légère au loin et plusieurs plans de paysage lisibles. Harmonise l’éclairage avec le ciel et les matériaux. Un effet lumineux discret peut être utilisé s’il améliore le rendu après comparaison ; évite les effets qui masquent le fil ou rendent les commandes moins lisibles. Pas de flou de mouvement ou de profondeur de champ pendant le combat.

### 14.4 Décor et matières

Varie les arbres existants par tailles, orientations, couleurs et regroupements. Réduis les répétitions immédiatement visibles, les alignements artificiels et les intersections incohérentes.

Compose les berges avec des irrégularités et des éléments sobres : herbes, roseaux, petits éléments de sol et nénuphars, à partir des ressources disponibles ou de formes simples déjà utilisées dans le projet. Place-les en fonction de la composition et de l’espace de pêche ; ne surcharge pas le décor au hasard.

Améliore les matières du ponton, du sol et de la canne avec les textures disponibles ou procédurales légères. Préserve les proportions, évite l’aspect plastique et les textures répétées trop visiblement. Réutilise efficacement les éléments répétés et limite les superpositions de transparence.

### 14.5 Poissons, photos et aquarium

Conserve les modèles du pack. Corrige si nécessaire leurs échelles, textures, matériaux et éclairages pour révéler leurs détails sans leur donner un aspect métallique ou artificiellement brillant.

Soigne les cadrages de réception et de photo : poisson identifiable, silhouette entière, fond calme et dimensions cohérentes. L’apparence du spécimen doit rester la même dans la pêche, la photo et l’aquarium.

Dans l’aquarium, travaille le fond, le sol, l’éclairage et la disposition des décorations pour mettre les cinq favoris en valeur. La personnalisation doit réellement modifier le rendu, avec un équilibre visuel et un coût maîtrisé.

### 14.6 Refonte graphique de toutes les interfaces

Crée un système visuel centralisé : fonds vert profond et ardoise, textes clairs, accents crème/dorés, couleurs de rareté réservées à la rareté, typographie lisible, espacements réguliers, icônes cohérentes, composants réutilisables et états de commandes visibles. Les titres, valeurs et informations secondaires doivent avoir une hiérarchie nette.

Applique cette refonte à tous les espaces de la section 4. Le FishDex doit évoquer un appareil de découverte et une collection à compléter : entrées numérotées, silhouettes, progression, fiches et révélations satisfaisantes. Le carnet conserve un traitement secondaire, centré sur les souvenirs et le filtrage des prises.

Pour le matériel et la boutique, privilégie les illustrations, l’équipement actif, les compatibilités, les prix et les actions utiles. Pour la progression, présente clairement la prochaine étape et les objectifs de maîtrise. Pour les résultats, donne la priorité au poisson et à sa photo, puis aux gains et aux découvertes.

Adapte les dispositions mobile/PC, portrait/paysage. Prévois retour, défilement, filtres, fiches, aides contextuelles et navigation au clavier. Les boutons doivent être confortables au toucher ; aucune information essentielle ne dépend d’un survol. Les écrans futurs sont construits avec leurs états expliqués, pas représentés par des liens morts.

Pendant la pêche, laisse seulement un petit accès au menu, la préparation compacte hors combat et les commandes indispensables en combat. Aucun titre/slogan décoratif, compteur permanent, grand panneau ou pied de page sur l’eau. Les récompenses sont présentées après capture. Les nouveaux styles ne doivent pas créer de surfaces invisibles interceptant les gestes.

### 14.7 Qualité mobile et validation visuelle

Prévois des réglages de qualité avec un choix équilibré par défaut. Limite la résolution de rendu, le nombre de particules, les ombres, les textures et les effets selon les mesures. Les reflets supplémentaires et autres effets coûteux ne sont activés sur mobile que si leur coût est acceptable. Le mode réduit doit conserver une composition et des couleurs soignées.

Après chaque passe, vérifie la scène dans le navigateur. Capture les vues avant/après avec la même caméra et, si possible, les mêmes conditions d’ambiance. Inspecte aussi la pêche, le combat, le FishDex, une fiche, le matériel, la boutique, le résultat de capture et l’aquarium.

Compare les performances dans les mêmes conditions et consigne les effets conservés ou allégés. Une émulation mobile ne prouve pas les performances sur un iPhone physique. Vérifie de nouveau le lancer, les deux gestes simultanés, le combat, les menus et les sauvegardes après les changements graphiques.

## 15. Ordre d’exécution et critères de livraison

1. Auditer, préserver l’existant et fixer les données/connexions communes nécessaires.
2. Rendre fonctionnel le parcours pêche → capture → récompenses → sauvegarde.
3. Construire le FishDex principal et le carnet secondaire connectés à ce parcours.
4. Achever navigation, matériel/boutique, lieux, progression et aquarium.
5. Construire les fiches et états du contenu futur, puis vérifier les points d’extension.
6. Harmoniser tous les écrans et améliorer la scène ; vérifier après chaque passe.

Valide au minimum :

- navigation de tous les espaces sans impasse, pause et reprise correctes ;
- gestes de lancer et de combat, deux doigts simultanés, casse/décrochage et capture ;
- première découverte FishDex, variante, record, filtrage du carnet et retour depuis une fiche ;
- équipement compatible, achat, déblocage et équipement de base sans monnaie ;
- gains uniques et cohérence de toutes les mises à jour après une prise ;
- cinq favoris maximum, sélection/remplacement et personnalisation persistante ;
- rechargement, migration, export/import et gestion des anciennes données ;
- visibilité des contenus futurs sans faux achat, fausse capture ou objectif impossible ;
- ajout de contenu par les configurations prévues ;
- formats mobile/PC, contrôles du projet, build et performances observées ;
- application du système visuel à tous les écrans, scène nettement améliorée et comparaison avant/après documentée ;
- lisibilité du fil et absence de régression du lancer, du combat ou du défilement des menus après les améliorations graphiques.

L’émulation mobile ne constitue pas un test sur iPhone physique. Vise une expérience stable à 30 images/seconde, rapporte les conditions et les mesures disponibles, et limite les effets coûteux si nécessaire.

## 16. Livrables et relais

Laisse les sources intégrées au dépôt, les changements identifiables et :

- `docs/STRUCTURE_COMPLETE.md` : carte de tous les espaces et systèmes, liens et état réel ;
- `docs/EXTENSION_CONTENU.md` : exemples et procédure d’ajout pour chaque famille de contenu prévue ;
- `docs/DECISIONS_JEU.md` : décisions et paramètres d’équilibrage ;
- `docs/QUALITE_VISUELLE.md` : direction artistique, passes réalisées, réglages, comparaisons avant/après et performances observées ;
- documentation des ressources et correspondances FishDex/3D ;
- `RELAIS_PROJET.md` actualisé pour Claude et Codex ;
- captures des principaux écrans et de la scène, résultats des vérifications et informations de déploiement.

Actualise les points de reprise après chaque étape importante. Distingue clairement terminé, partiel, à venir et bloqué. Ne déclare pas une interface complète si ses actions essentielles ne fonctionnent pas avec le contenu présent.

Après validation, contrôle si possible une prévisualisation Vercel puis publie sur le projet vérifié déjà autorisé. Si une publication est bloquée, termine les livrables locaux et indique précisément la prochaine action.

Commence maintenant et poursuis jusqu’à construire l’ensemble réalisable de cette structure. Ne t’arrête pas après le matériel ou le premier écran refondu.
