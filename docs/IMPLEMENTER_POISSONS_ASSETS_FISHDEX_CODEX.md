# FishDex — Chantier complet poissons, collection et assets

Consigne à exécuter **après avoir terminé et vérifié le chantier des méthodes de pêche actuellement en cours**. Version du 2 octobre 2026. Document destiné à Codex dans le dépôt existant du jeu. Ce document prépare le travail ; il ne décrit pas une implémentation déjà livrée.

## 1. Mission et résultat attendu

Intégrer en une même mission le catalogue complet de poissons de l’application FishDex, les variétés et apparences confirmées, les illustrations existantes, les profils de comportement et tous les systèmes qui utilisent ces poissons. Poursuivre jusqu’à une chaîne fonctionnelle de découverte, rencontre, capture, réception, photo, carnet, collection, progression et aquarium. Ajouter des données dans un JSON ou afficher des fiches ne suffit pas.

Les lots ci-dessous organisent le travail ; ils ne réduisent pas le périmètre. Travailler de manière autonome sur les choix techniques réversibles. Préserver les changements récents, les données du joueur et les instructions applicables du dépôt. Lire le fichier de relais avant toute modification, puis le tenir à jour à chaque lot validé.

Ce fichier réunit la nouvelle mission, les données du dossier de recherche et l’audit `EXPLOITER_ASSETS_FISHDEX_CODEX.md`. **Il n’est pas nécessaire de transmettre cet ancien audit séparément.** L’annexe d’audit conserve ses observations datées ; les règles de cette mission priment sur ses anciennes limites de contenu.

La spécification des méthodes et des spots déjà utilisée par le chantier en cours reste la base de gameplay. Ne pas reconstruire une seconde version des méthodes, du matériel, du combat ou de la sauvegarde pour les poissons.

## 2. Entrées à utiliser

- Dépôt du jeu et documentation de relais : autorité pour les identifiants, le code et les fonctions réellement existantes.
- Projet de l’application FishDex accessible au poste de travail : **lecture seule** pour son catalogue, ses images, espèces, variantes, méthodes et informations. Ne pas modifier son dépôt, sa base ou son déploiement.
- Archives fournies : `fishes.rar`, `varieties.rar`, `mutations.rar`, `techniques - Copie.rar`, `backgrounds.rar`.
- Pack 3D acheté déjà utilisé par le jeu : inventorier précisément les modèles, textures, squelettes et animations.
- Données de recherche incluses en annexe B : point de départ à confronter au catalogue de l’application et aux sources.
- Nouvelles illustrations de matériel, si elles sont présentes dans les fichiers transmis ou le dépôt : compléter le registre sans attendre d’autres générations.

Les annexes ne contiennent pas les octets des images. Retrouver les fichiers dans les archives ou dans le projet source. Ne pas inventer un chemin local, une illustration ou un modèle absent.

L’audit a recensé **101 illustrations de poissons, formes et colorations**, et **205 fichiers** au total dans les cinq archives. Le dossier de recherche fournit **62 profils**, dont trois identités non résolues. Aucun de ces nombres n’est un objectif arbitraire de nombre d’espèces : établir le périmètre final à partir de l’application et du dépôt, avec les synonymes et relations confirmés.

## 3. Audit initial et registre de couverture

À la fin du chantier des méthodes, enregistrer un état de référence testé. Lire le catalogue réellement utilisé par l’application, puis inventorier tout le contenu du jeu et toutes les ressources disponibles.

Créer une matrice versionnée avec, pour chaque entrée : identifiant source, identifiant canonique du jeu, nom français, taxon s’il est renseigné, statut d’identité, parent éventuel, type d’entrée, image, représentation 3D, habitat, méthodes compatibles, profil de comportement, statut fonctionnel et vérifications.

Types distincts : espèce, forme domestique, coloration, hybride confirmé, spécimen/record, illustration, alias et identité à résoudre. Ne pas transformer une image « géant », « trophée », « record » ou « gold » en espèce supplémentaire. Ne pas fusionner des taxons distincts à partir d’une ressemblance de nom.

Un rattachement douteux doit être résolu à partir de la source ou conservé en attente avec sa raison. Continuer toutes les autres entrées. Les éléments non résolus sont visibles dans l’outil de développement et exclus des objectifs obligatoires du joueur.

États séparés : `identityStatus`, `researchStatus`, `visualStatus`, `gameplayStatus`. Une entrée peut avoir un gameplay fonctionnel et un modèle provisoire. Une autre peut avoir une belle image et une identité encore non validée.

## 4. Catalogue commun et identité des spécimens

Adapter les données aux conventions du dépôt, avec un seul registre consommé par la pêche, le FishDex, le carnet et l’aquarium.

| Entité | Informations nécessaires |
| --- | --- |
| Espèce | ID stable, noms/alias, taxon, morphologie, habitats, alimentation, activité, profil, sources, découverte |
| Apparence | Espèce ou parent confirmé, écaillure/robe, illustration, rendu, probabilité de jeu, conditions de présence |
| Population locale | Lieu/poste/microzone, abondance, tailles, stades, apparences disponibles, conditions |
| Spécimen | ID unique, espèce, apparence, longueur, masse, état individuel, graine, capture et photo |
| Référence visuelle | Illustration, modèle ou représentation provisoire, échelle, axes, animations disponibles |
| Découverte | Espèce/forme reconnue, première rencontre, première capture, records, maîtrise et récompenses attribuées |

Le spécimen reste identique pendant la touche, le combat, la réception, la photo et l’aquarium. Ne pas tirer à nouveau espèce, robe ou poids à chaque écran.

Longueur et masse proviennent d’une distribution plausible par espèce, avec relation cohérente entre elles. Séparer taille habituelle, grand individu et trophée ; un record n’est pas une nouvelle espèce. Les coefficients et distributions restent des réglages de jeu documentés, jamais des mesures scientifiques inventées.

## 5. Tous les poissons avec les ressources actuelles

Aucune nouvelle génération d’image ou de modèle par un service externe et aucun abonnement supplémentaire. Utiliser les ressources existantes et des adaptations par code.

Ordre de traitement :

1. Associer les modèles du pack uniquement aux espèces qu’ils représentent effectivement.
2. Réutiliser des modèles de même morphologie pour des variantes confirmées, avec matériaux/écaillures adaptés et proportions plausibles.
3. Pour les espèces sans modèle adapté, créer une **représentation 3D provisoire par code**, légère, fondée sur leur famille morphologique et leur silhouette de référence : corps, nageoires, queue, proportions et robe suffisamment distinctifs. Réutiliser le moteur actuel et les primitives/maillages paramétriques ; aucun outil 3D externe n’est imposé.
4. Afficher l’illustration exacte sur la fiche et à côté du rendu lorsque cela aide à identifier le poisson. Marquer le rendu provisoire dans la fiche ou les réglages, sans ajouter un avertissement permanent au combat.
5. Préparer un remplacement ultérieur par un GLB final sans modifier simulation, captures ou sauvegardes.

Une carpe simplement renommée en brochet ou esturgeon ne satisfait pas ce besoin. La représentation provisoire doit être reconnaissable à l’échelle utile et porter le bon gabarit. Si une espèce reste techniquement impossible à représenter correctement, documenter ce cas précis dans la matrice, sans arrêter les autres ni prétendre que son visuel est terminé.

Cette règle remplace l’ancienne exigence du dossier qui conditionnait toute activation à un modèle exact déjà présent dans le pack. Les garde-fous d’identité, d’habitat et de fonctionnement restent nécessaires.

Prévoir nage calme, accélération, virage, secousse, respiration et débattement à partir des animations disponibles ou de déformations procédurales cohérentes. Adapter l’amplitude à la morphologie et l’intensité à l’état ; éviter une animation identique et rigide pour toutes les espèces.

## 6. Comportements qui changent réellement la pêche

Raccorder les profils au moteur partagé, pas seulement aux descriptions. Distinguer comportement alimentaire, prudence avant la touche et réponse après ferrage.

Avant la touche : présence spatiale, profondeur, activité, taille de proie/esche, présentation, intérêt, approche, suivi, examen, refus ou attaque. Pendant le combat : départs, déplacements latéraux, secousses, recherche d’abri, retours créant du mou, accalmies et reprises.

Utiliser notamment les paramètres provisoires `burst`, `endurance`, `agility`, `head_shakes`, `cover_seeking`, `slack_pressure`, en conservant leur origine de conception. Ils pondèrent des actions conditionnelles ; ils ne sont ni une force en newtons ni des probabilités de capture.

Taille, fatigue, contraintes physiques du matériel et terrain déterminent les effets réels. Ajouter des variations individuelles bornées. Une coloration rare ne rend pas automatiquement un poisson plus puissant ou plus agressif.

La machine de comportement ne doit pas choisir des refuges inexistants, traverser la rive ou imposer des départs interminables sans fenêtre exploitable. Les signaux passent par fil, canne, eau et sons sobres.

Les paramètres d’activité ne doivent dépendre de saison, météo, température ou pression que si ces variables sont réellement simulées. Distinguer une préférence d’une impossibilité : un appât moins favorable n’interdit pas systématiquement une espèce.

Reprendre les sources du dossier ; compléter les faits manquants dans des sources spécialisées fiables. Enregistrer URL, date, fait retenu et limite. Les comportements de combat et coefficients de jeu doivent rester présentés comme propositions à tester. Ne pas déduire un comportement ferré d’une description du régime alimentaire.

## 7. Habitats, spots, montages et méthodes

Relier chaque population à des lieux cohérents. Aucun poisson ne doit devenir disponible dans tous les spots pour remplir artificiellement la collection.

La difficulté d’un poste vient de ses obstacles, accès, courant, profondeur, présentation et populations susceptibles de poser des problèmes. Elle ne multiplie pas arbitrairement la force du même spécimen.

Reprendre les contextes créés pour les méthodes : étang/lac, rivière avec courant, profondeur et embarcation lorsque nécessaires. Ajouter les habitats fonctionnels manquants au périmètre confirmé de l’application. Si un contexte particulier reste indisponible, l’indiquer précisément ; ne pas placer son poisson dans un milieu incompatible.

Les méthodes et montages ciblent des possibilités réelles : profondeur atteinte, taille de l’esche, mouvement, discrétion, armement, courant et disponibilité de nourriture. La rareté d’une canne n’est pas une permission magique de rencontrer une espèce.

Conserver les règles de stade, les identités à confirmer et les modes de découverte spécialisés présents dans les données. Pour une entrée dont la capture ne peut pas être justifiée, implémenter une découverte **par observation** avec fiche, objectif et enregistrement fonctionnels, plutôt qu’une fausse capture à n’importe quel appât. Son mode de découverte doit être clair pour le joueur.

## 8. Rareté, progression, revenus et récompenses

Séparer quatre notions : rareté de rencontre, rareté d’apparence, caractère remarquable du spécimen et palier d’accès au contenu. Une espèce commune peut fournir un trophée rare. Une technique spécialisée n’a pas besoin d’être une amélioration universelle.

Équilibrer abondance et conditions par lieu, avec des indices utiles pour préparer la découverte. Plusieurs méthodes peuvent capturer la même espèce lorsqu’elles sont pertinentes. Conserver les captures ordinaires utiles aux revenus et à la maîtrise.

Prévoir récompenses distinctes, attribuées une seule fois quand applicable : première espèce, première apparence, record personnel, badge de maîtrise. Photo rémunérée une seule fois par capture ; consultation ou nouvelle ouverture du carnet ne verse rien.

Le prix d’une photo est une formule configurable tenant compte de l’espèce et du spécimen avec bornes lisibles. Éviter qu’un tirage exceptionnel court-circuite toute l’économie. Mesurer gains nets par minute, coûts de consommables et risques de pertes ; ne pas équilibrer seulement le prix unitaire.

Les conditions de déblocage ne doivent pas exiger un poisson accessible uniquement après ce même déblocage. Conserver les droits acquis des anciennes sauvegardes.

## 9. FishDex, carnet et aquarium

**FishDex principal** : vraie collection inspirée d’un Pokédex, grille compacte, numéros stables, silhouettes propres à chaque poisson non découvert, découverte visuelle gratifiante et brève, fiches riches après identification. Variétés rattachées à leur parent confirmé, records séparés. Filtrer milieu, statut de découverte et disponibilité ; afficher des indices utiles sans dévoiler gratuitement tout le résultat.

La progression principale compte le contenu réellement accessible dans la version de jeu. Les entrées connues mais non disponibles peuvent avoir un espace séparé ; elles ne rendent pas une complétion annoncée impossible. Pour les découvertes par observation, préciser la règle dans l’objectif. Ne pas bloquer la progression derrière une identité encore inconnue des développeurs.

**Carnet secondaire** : historique des spécimens avec photos, date, lieu/poste, méthode, montage, longueur, masse, robe et records. Recherche et filtres combinables ; tri par date, taille, espèce, lieu et première découverte. Distinguer illustration de fiche et photo réellement prise dans la scène.

**Aquarium** : cinq spécimens capturés favoris au maximum, conservant leur identité, robe et gabarit relatif. Nage adaptée et placement sans traverser les parois. Définir une échelle d’exposition cohérente pour les grandes espèces. Les observations seules ne créent pas un spécimen capturé à exposer. Réutiliser les représentations provisoires lorsque nécessaires et préparer leur remplacement.

Basalte & Turquoise pour les interfaces : surfaces mates sombres, textes lisibles, accents turquoise discrets, couleurs naturelles des poissons et appâts. Fiches et menus détaillés ; scène de pêche dégagée. Conserver l’organisation **Ma canne / Mon sac / Ensembles**, avec Boutique séparée. Enrichir ces écrans avec les illustrations de techniques et composants réellement correspondants.

## 10. Import des assets et performances

Appliquer l’audit en annexe A : registre partagé, correspondances explicites, conservation des originaux, résolution des doublons, proportions préservées, normalisation des marges transparentes et variantes d’affichage adaptées.

Les nouvelles images de matériel disponibles complètent les familles suivantes : cannes, moulinet, feeder, flotteur, leurre souple ; fils/bobines, hameçon, plombs, émerillon et agrafe ; bas de ligne, stops/perles/clip/bague, élastique, épuisette/tapis, sonde et amorçage. Ne pas inventer une livraison locale si ces fichiers n’ont pas été fournis. Utiliser un schéma neutre pour une ressource manquante et consigner le besoin.

Les fonds illustrent les écrans selon leur cadrage ; ils ne deviennent pas automatiquement des matériaux 3D. Les vignettes de spots viennent de captures du jeu.

Charger images et modèles à la demande, partager ressources et matériaux, libérer les ressources inutilisées lors des changements. Ne pas charger tous les poissons animés derrière les menus ou simuler toutes les espèces comme acteurs visibles simultanés. La simulation peut être indépendante du rendu.

Adapter les détails des modèles procéduraux et les textures au téléphone. Mesurer les performances réellement accessibles et noter le matériel testé. Une fenêtre de navigateur réduite ne constitue pas un test sur iPhone. Ne pas sacrifier lisibilité du fil et réaction tactile à des effets cosmétiques.

## 11. Mode développement et outils d’essai

Étendre le mode test séparé déjà demandé pour les méthodes, avec argent illimité, accès à tous les contenus fonctionnels et aucune contamination de la partie normale. Conserver prix et consommation pour mesurer le fonctionnement.

Ajouter un panneau de développement, fermé par défaut, permettant :

- sélectionner espèce/apparence/spécimen et graine reproductible ;
- choisir tailles usuelles et remarquables avec limites explicites ;
- sélectionner lieu, poste, contexte, montage et méthode compatibles ;
- forcer une rencontre ou un combat pour examiner les signaux ;
- tester nage, réception, photo, fiche et aquarium du même spécimen ;
- comparer plusieurs profils sans changer les autres conditions ;
- provoquer casse/décrochage et vérifier stocks/récompenses ;
- afficher états, compatibilités, taux et raisons de refus à des fins de diagnostic.

Les scénarios forcés ne donnent pas d’argent, d’XP ou de découverte à la sauvegarde normale. Ne pas sérialiser `Infinity` dans les données financières. Fournir une procédure courte pour essayer chaque poisson et méthode sur téléphone.

## 12. Migration, vérifications et critères de livraison

Préserver captures anciennes, argent, XP, inventaire, records, favoris d’aquarium et accès acquis. Conserver une table d’alias pour les IDs renommés ; ne pas supprimer une capture impossible à remapper, mais la conserver comme entrée historique explicite. Versionner le schéma et tester chargement, migration et rechargement.

Vérifications nécessaires :

1. Tous les identifiants d’espèces, apparences, sources, images, appâts et méthodes se résolvent ; pas de doublon canonique ni de référence cassée.
2. Chaque entrée confirmée possède une chaîne de découverte réellement fonctionnelle ; capture ou observation selon le mode justifié. Les cas en attente sont comptés séparément.
3. Chaque espèce capturable possède au moins un lieu, une présentation et un montage accessibles, avec rencontre naturelle possible et scénario reproductible.
4. Les distributions respectent les habitats et les limites de tailles ; aucun trophée créé comme taxon.
5. Les profils influencent effectivement les actions et se distinguent dans des scénarios comparables ; variations et fatigue ont un effet vérifiable.
6. Identité et robe stables entre combat, réception, photo, carnet et aquarium ; quatre ouvertures de la photo ne donnent pas quatre récompenses.
7. Progression réalisable et sans dépendance circulaire ; compteur de collection cohérent avec le contenu disponible.
8. Casse, réservation et consommation n’effectuent aucune double déduction ; le kit de secours reste utilisable.
9. Ancienne sauvegarde migrée sans perte, essais séparés de la partie normale, sauvegarde/rechargement des cinq favoris.
10. Aucune image manquante ou déformée, menus défilables, recherches éditables, commandes simultanées et pauses cohérentes ; contrôles du projet exécutés et parcours testés.

Ne pas créer des tests qui ne vérifient que la présence des mêmes champs que le code. Couvrir les invariants, migrations, chaîne de capture et risques de duplication avec les outils déjà utilisés par le projet.

## 13. Lots de travail et relais final

1. Terminer/vérifier les méthodes ; état de référence et audit des poissons/assets.
2. Catalogue canonique, taxonomie et correspondances, migration, import des illustrations.
3. Profils, populations, rencontres et représentations provisoires ; premiers parcours complets.
4. Extension à toutes les entrées confirmées ; résolution des habitats et découvertes particulières.
5. FishDex, carnet, photo, économie, progression, aquarium et outils d’essai.
6. Vérifications, équilibrage, performances, mise à jour du relais et déploiement sur **le projet Vercel du jeu déjà autorisé**, selon les règles du dépôt. Ne pas toucher à l’application FishDex.

Dans le relais final : nombres séparés d’espèces, formes/colorations et images ; liste des entrées fonctionnelles, vérifiées, à tester au toucher et bloquées avec raison exacte ; statut des visuels définitifs/provisoires ; sources complétées ; migration ; commandes et résultats des vérifications ; emplacement des outils de test ; URL et version réellement déployées si déploiement réussi.

Ne pas déclarer « tous les poissons implémentés » si seuls leurs noms sont affichés. Le résultat attendu est une collection que l’on peut réellement découvrir, avec des poissons qui utilisent les méthodes et systèmes du jeu.

## 14. Fichiers complémentaires dans ce dossier

**Annexe A — `EXPLOITER_ASSETS_FISHDEX_CODEX.md`** : audit existant et inventaire portable des cinq archives. Les six nouvelles images évoquées dans sa section 2 étaient le premier lot de génération, pas un inventaire actuel exhaustif. Aucun quota de six ressources ne doit être imposé.

**Annexe B — `catalogues/data/` et `catalogues/docs/`** : données structurées et notes de recherche, copiées du dossier du 2 octobre. Les champs `playable: false` décrivent leur état de préparation initial ; ils ne doivent pas désactiver mécaniquement le nouveau chantier. Confirmer identité et fonctionnement avant activation. Les entrées `specialist_future` sont à traiter, documenter et rendre découvrables lorsque possible, pas à considérer comme terminées par un libellé À venir.

**Annexe C — `SPEC_PROGRESSION_SPOTS_METHODES.md`** : spécification version 2 des méthodes et spots, pour comprendre les relations avec le chantier déjà en cours. Cette nouvelle mission prolonge cette base ; sa règle de représentation provisoire remplace la limite de modèles exacts. Les choix plus récents consignés dans le relais sur les interactions priment sur les anciennes formulations expérimentales.

Les fichiers JSON/CSV de `catalogues/data/` doivent être lus puis adaptés aux schémas du dépôt. Ils constituent des données de départ ; aucune valeur ne doit être importée aveuglément comme une certitude biologique ou un réglage déjà équilibré.


Lire d’abord cette instruction. Consulter ensuite les fichiers utiles au lot en cours ; ne pas charger tous les catalogues dans le contexte en une fois. Les archives d’images et le projet source FishDex sont à fournir séparément si absents du poste de travail.
