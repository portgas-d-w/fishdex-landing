# Mission autonome — Au fil de l’eau

## Instruction de lancement

Tu travailles dans le dépôt du jeu « Au fil de l’eau », déjà développé et déployé. Je te donne également accès au dossier de mon application FishDex, qui sert de référence pour les espèces, les illustrations, les variantes, les techniques et les appâts.

Je serai absent et mon PC restera allumé. Exécute cette mission maintenant : prends les décisions courantes seul, implémente, vérifie, corrige et poursuis dans l’ordre des priorités. Toutes les fonctionnalités décrites ici sont validées dans ce périmètre. Ne termine pas après un audit, un plan, une première fonctionnalité ou une proposition de suite. Avance aussi loin que possible avec tes capacités et les accès disponibles.

L’objectif est de retrouver à mon retour un jeu nettement plus complet, jouable et cohérent sur navigateur mobile, accompagné d’un compte rendu exact. Une fonctionnalité terminée et vérifiée vaut mieux que plusieurs écrans sans fonctionnement.

## 1. Autorisation et limites

Tu peux modifier le jeu, ses ressources, sa documentation, ses tests et sa configuration de déploiement. Tu peux installer les dépendances gratuites nécessaires et utiliser les outils locaux disponibles, dont Blender. Conserve autant que possible la pile actuelle : inspecte le dépôt avant de décider.

Tu peux copier depuis FishDex les contenus pertinents et les adapter pour le jeu. Le projet FishDex lui-même est une source en lecture seule : ne modifie pas ses fichiers, son dépôt, sa base de données ou son déploiement. Ne copie pas ses secrets, ses comptes utilisateurs ou les captures personnelles de ses utilisateurs. Le jeu possède ses propres sauvegardes et sa propre progression.

Aucun nouvel abonnement, paiement ou service payant. Aucun multijoueur. Aucun compte obligatoire, synchronisation distante ou nouveau backend pour cette mission. Aucun appel à une IA externe pendant une partie. Tripo et la refonte définitive des poissons seront traités plus tard : ne dépense pas de crédits Tripo ici.

Je valide les décisions de conception et les changements nécessaires décrits dans cette mission. Respecte cependant les permissions réellement disponibles : ne contourne pas les contrôles de sécurité, une approbation requise ou une limite d’usage. Si une opération reste bloquée, documente-la et continue les tâches indépendantes.

Le déploiement du jeu sur mon projet Vercel existant `fishdex-landing`, équipe `portgas-d-ws-projects`, est autorisé une fois les vérifications réussies. Vérifie la liaison effective du dépôt avant de déployer. Ne touche pas au site FishDex ni à un autre projet Vercel. Aucun achat, changement de domaine ou suppression de projet. Si tu ne peux pas vérifier la cible, livre une version locale utilisable et indique précisément le blocage.

## 2. Commencer par comprendre et préserver l’existant

1. Lis les instructions applicables, notamment `AGENTS.md`, `RELAIS_PROJET.md`, `CLAUDE.md`, le README et les documents de conception présents.
2. Inspecte les sources, la version effectivement utilisée, les modèles et animations disponibles, les sauvegardes actuelles, les commandes de vérification et la liaison Vercel.
3. Vérifie le statut Git. Préserve les modifications déjà présentes et ne les annule pas. Crée un point de reprise adapté à l’état du dépôt, sans embarquer de secrets ni publier des changements sans rapport avec la mission. Ne fais pas de reset destructif ou de push forcé.
4. Établis une courte liste de travail dans `docs/MISSION_AUTONOME.md`, avec état, dépendances et critères de validation. Mets-la à jour au fil de la mission.
5. Lance les vérifications existantes pour identifier les problèmes antérieurs et corrige ceux qui bloquent le travail.

Si les chemins des projets ne sont pas fournis, cherche d’abord dans le workspace et ses dossiers de projets habituels, de façon ciblée. N’interromps pas toute la mission si FishDex est introuvable : commence le gameplay du jeu et consigne ce qui dépend du dossier absent.

Les améliorations de lancer et de combat déjà réalisées doivent être conservées et complétées. Si elles ne sont pas encore présentes, implémente-les dans cette mission.

## 3. Ordre de travail obligatoire

Travaille par étapes fonctionnelles et vérifiées :

- **P0 :** lancer tactile, combat guidé par le fil et la canne, capture complète sur les poissons actuellement utilisables.
- **P1 :** catalogue FishDex, spécimens individuels, photos, raretés, sauvegarde et migration.
- **P2 :** XP, badges de maîtrise, argent et boutique utilisable.
- **P3 :** aquarium personnalisé avec cinq spécimens favoris animés.
- **P4 :** méthodes de pêche supplémentaires, extension du pack, animations et présentation, confort et performances.

Prépare tôt les structures communes nécessaires aux étapes suivantes, sans retarder P0 par une refonte générale. Ne développe pas en priorité de nouveaux environnements complexes ou des fonctions non demandées.

## 4. P0 — Lancer libre par glissement

Sur téléphone, le joueur choisit sa direction et sa distance par un glissement du doigt, puis lance en relâchant. La cible est un emplacement réel dans l’eau, et non un choix dissimulé parmi trois spots fixes.

- Pendant le geste, affiche une prévisualisation discrète de trajectoire et une cible lisible.
- Relie la longueur et la direction du geste à la distance et à la direction du lancer, avec limites raisonnables et réglage facile de la sensibilité.
- Refuse clairement les cibles hors de l’eau ou hors de portée, sans gaspiller un appât.
- Annule proprement un geste interrompu ou initié sur un menu.
- À l’arrivée, l’appât, le montage et les effets d’eau apparaissent à la cible réelle.
- La profondeur ou le type de zone influence les rencontres. Remplace progressivement les anciens spots fixes par des habitats associés aux coordonnées.
- Fournis un équivalent à la souris sur PC. Préserve les comportements existants qui restent utiles.

Valide les gestes courts, longs, diagonaux, annulés, les bords d’écran et les changements de taille de fenêtre.

## 5. P0 — Combat lisible par le fil et la canne

**Correction de conception prioritaire : dans notre jeu, une fois le poisson ferré, le bouchon reste immergé pendant l’essentiel du combat. Il redevient visible à l’approche du bord. Le joueur observe principalement le fil et la canne.**

Ce comportement remplace toute ancienne consigne faisant du bouchon visible le principal indicateur du combat. Il concerne les montages qui possèdent un bouchon ; n’ajoute pas de bouchon aux autres méthodes.

Le comportement du poisson doit être la cause des mouvements visibles : position, direction, accélération et profondeur influencent le fil, la tension et la canne. Ne juxtapose pas des animations décoratives à un combat décidé indépendamment.

- Le joueur oriente la canne horizontalement et verticalement par glissement.
- Prévois une commande de moulinage qui peut être utilisée simultanément avec l’orientation : deux doigts indépendants sur mobile, souris et raccourci clavier sur PC.
- Distingue correctement les doigts et les commandes de l’interface. Pas de page qui défile ou zoome pendant une action de pêche.
- Le fil reste attaché à la pointe de la canne et au montage. Son angle, sa tension, son mou et son point d’entrée dans l’eau rendent le combat compréhensible.
- La courbure de la canne évolue avec la traction. Ne fais pas apparaître le poisson en permanence à travers l’eau pour révéler sa position.
- L’orientation et le moulinage modifient réellement le résultat : récupération, maintien du contact, amortissement des départs et guidage vers la berge.
- Le poisson alterne départs, changements de direction et récupération selon un comportement ajustable par espèce et gabarit. Évite les tirages aléatoires violents sans signe perceptible.
- Une tension excessive provoque une casse après un avertissement lisible ; un mou prolongé peut permettre un décrochage. Un bref écart ne doit pas provoquer une perte instantanée injuste.
- Termine la capture par une proximité suffisante et un contrôle du poisson. Ne donne pas une victoire automatique après un délai indépendant des actions.

Rends le fil visible sur téléphone par son rendu et son contraste. De petits indicateurs de secours sont acceptables ; la scène doit permettre de comprendre le combat sans une énorme flèche donnant constamment la solution.

## 6. Poissons provisoires et animations

Utilise les modèles du pack acheté et les modèles déjà intégrés. Nous remplacerons ces ressources plus tard par des poissons créés avec Tripo ou Blender.

Inventorie les ressources réellement disponibles : espèce représentée, format, échelle, textures, poids, présence de squelette et d’animations. Vérifie les noms et les silhouettes avant d’associer un modèle à une espèce FishDex.

Intègre autant de modèles identifiables que possible après stabilisation du gameplay, avec conversion et optimisation si nécessaire. Préserve les ressources sources et les informations de licence. N’utilise pas un modèle de poisson différent pour prétendre qu’une espèce manquante est déjà terminée.

Prévois une correspondance remplaçable entre identifiant d’espèce, forme, coloration, ressource 3D et animations. Aucune logique de progression ne doit dépendre du nom d’un fichier modèle.

Animations souhaitées :

| Animation | Utilisation |
| --- | --- |
| Nage lente | Aquarium, poissons visibles près du bord |
| Nage rapide | Fuite et combat |
| Débattement suspendu | Présentation des petits poissons au bout du fil |
| Débattement sur tapis | Présentation des gros spécimens |
| Respiration | Bouche et opercules lors de la présentation |

Si le pack n’a pas de squelette, développe d’abord une animation légère et convaincante sur un poisson. Selon les outils disponibles, utilise Blender ou une déformation procédurale maîtrisée ; garde la tête, les nageoires et le corps attachés, sans étirement incohérent. Applique ensuite la méthode aux formes compatibles. Une anguille ne doit pas se déplacer comme une carpe.

Les rotations ou déplacements d’un modèle rigide peuvent servir de solution provisoire, mais ne les présente pas comme une nage anatomique finalisée. Une animation de respiration absente reste à faire : documente-la honnêtement.

Le poisson observé, capturé, photographié et placé dans l’aquarium conserve son identité, sa forme, sa coloration et un gabarit cohérent. Pour les gros poissons, prévois une arrivée à l’épuisette puis une présentation sur tapis lorsque cette séquence est réalisable. La présentation simple reste fonctionnelle pendant sa mise en place.

## 7. P1 — Réutiliser le contenu réel de FishDex

Inspecte le code et les ressources de FishDex : catalogue, fiches, noms scientifiques, catégories, images, tailles et poids, variantes, techniques, appâts et relations déjà définies. Utilise les fichiers réels comme référence ; ne suppose pas que tous les contenus annoncés dans un ancien document sont implémentés.

Le cadrage précédent mentionne 92 espèces, les collections « Paisibles », « Prédateurs » et « Eaux vives », et les raretés « Commun », « Peu commun », « Rare », « Épique », « Légendaire », « Mirage ». Confirme cela dans le projet accessible et documente les écarts.

Crée un catalogue de jeu propre et indépendant à partir des contenus réutilisables. Conserve la provenance des données et rends l’import reproductible si cela apporte une utilité réelle. Ne transporte pas toute la pile technique de FishDex dans le jeu.

Distingue :

- l’espèce biologique ;
- la forme ou variété, par exemple la carpe miroir ;
- la robe ou coloration, notamment les variantes de koïs ;
- une variante exceptionnelle « Mirage » ;
- le spécimen individuel pêché.

Les variantes ne gonflent pas artificiellement le compteur des espèces. Elles possèdent cependant leurs découvertes et leurs records. La rareté de rencontre dans le jeu est une règle de gameplay distincte d’un statut réel de conservation.

Le catalogue peut contenir davantage d’entrées que les poissons jouables. Une espèce sans représentation disponible peut apparaître comme contenu prévu, avec un statut honnête, mais ne doit pas être tirée comme capture 3D terminée.

Construis une encyclopédie adaptée au mobile : catégories, recherche, filtres utiles, silhouettes ou état inconnu, fiches et progression des découvertes. Les images FishDex servent aux fiches lorsque leur réutilisation est appropriée ; les captures du joueur utilisent le spécimen du jeu.

## 8. P1 — Spécimens, photographie et sauvegarde

Chaque capture possède un identifiant unique, une espèce, une forme, une coloration, une longueur, un poids, une date, un lieu, une méthode, un équipement et un appât lorsque ces informations existent. Le poids et la longueur doivent suivre des règles plausibles et ajustables pour l’espèce, pas deux valeurs indépendantes sans cohérence.

Crée automatiquement une photo du spécimen grâce au rendu local du jeu, sans service externe. Elle doit être cadrée, lisible et conserver l’apparence exacte de la capture. Affiche la fiche de résultat, les découvertes, les records et les récompenses obtenues.

Enregistre le journal des captures, les records personnels, les favoris, la collection, les découvertes, l’équipement, les monnaies, l’XP et les badges. Préserve la progression de la version existante par une migration versionnée. Conserve l’export/import et adapte-le aux nouvelles données.

Stocke les images de manière adaptée, avec taille maîtrisée, miniatures et gestion des erreurs de stockage. N’accumule pas de grandes images encodées dans un stockage inadapté. Une photo manquante ne doit pas bloquer ou effacer une capture enregistrée.

Un rechargement pendant ou après la présentation du résultat ne doit pas dupliquer la capture, l’XP ou l’argent. L’import d’une sauvegarde ne doit pas rejouer les récompenses historiques. Valide les fichiers importés et ne remplace pas une sauvegarde saine par un fichier illisible.

## 9. P2 — XP, badges, argent et boutique

Implémente trois systèmes complémentaires :

- **XP et niveaux :** progression générale, nouvelles possibilités, matériel ou techniques accessibles.
- **Badges de maîtrise :** objectifs observables liés aux méthodes, aux captures et à la connaissance du jeu ; ils ne sont pas tous de simples compteurs d’XP.
- **Argent virtuel :** rémunération des photographies de captures, permettant d’acheter du matériel, des appâts et des éléments d’aquarium.

Chaque capture réussie rémunère sa photo une seule fois. Prévois une valeur de base par espèce, une influence raisonnable du gabarit et de la variante, puis des bonus distincts de première découverte et de record. Garde les poissons communs utiles et évite une progression qui impose de répéter indéfiniment la même prise.

Affiche clairement les gains et leurs raisons, sans noyer l’écran de notifications. La photo reste dans le carnet après sa rémunération : le joueur ne perd pas son souvenir.

Crée une boutique avec des achats effectifs, inventaire et équipement utilisables. Les propriétés ont un effet dans le gameplay et les incompatibilités sont compréhensibles. Prévois un équipement de base réutilisable permettant de continuer à jouer si le joueur n’a plus d’argent ou d’appât consommable. Aucun paiement réel, aucune publicité et aucune monétisation.

Centralise les paramètres de récompenses et de prix pour faciliter l’équilibrage. Les exigences d’XP et les prix ne doivent pas former une double barrière arbitraire à chaque action.

## 10. P3 — Aquarium de cinq favoris

Le joueur choisit jusqu’à **cinq spécimens individuels déjà pêchés**, pas simplement cinq espèces. Chaque poisson expose sa robe, son gabarit et ses informations personnelles.

- Ajout, retrait et remplacement depuis la collection ou l’aquarium.
- Maximum cinq visibles simultanément, même si le journal contient de nombreuses captures.
- Nage autonome douce, mouvements variés, limites du bassin respectées et collisions/intersections visuelles évitées autant que possible.
- Personnalisation du sol, des plantes, des rochers, du fond et de l’ambiance lumineuse, avec choix sauvegardés. Les premiers choix peuvent être limités, mais doivent fonctionner.
- Décorations réellement visibles après achat ou sélection.
- Consultation de la fiche d’un favori sans perdre sa progression.

Charge seulement les modèles nécessaires et évite de faire tourner en même temps la scène de pêche cachée et l’aquarium. Les cinq poissons ne garantissent pas à eux seuls les performances : maîtrise aussi les textures, le décor, les effets, la résolution de rendu et la mémoire.

L’aquarium est un espace de collection contemplatif. Aucun entretien obligatoire, minuteur de faim ou pénalité d’absence n’est demandé.

## 11. P4 — Méthodes de pêche et enrichissement

Utilise FishDex pour les noms, les associations et les descriptions réellement présents. Si une règle manque, choisis une première règle simple, cohérente et paramétrable, et consigne cette décision.

Organise les choix par méthode, canne/montage compatibles, puis appât ou leurre. Le lieu et la présentation influencent les rencontres, sans transformer tout le jeu en tirage purement aléatoire.

Développe progressivement trois familles :

1. **Au flotteur :** attente, observation de la touche et ferrage, puis combat par le fil.
2. **Au leurre :** lancer, récupération et animation du leurre influencent les touches.
3. **Au fond :** présentation au fond et détection adaptée par la canne ou la ligne, sans bouchon artificiel.

Ne considère pas une méthode terminée si seul son nom change dans un menu. Si tu ne peux pas finir une famille, laisse-la hors des choix jouables et décris exactement ce qui manque. Étends ensuite les espèces identifiables du pack et leurs comportements.

Améliore le confort : tutoriel court et contextuel, boutons faciles à toucher, menus cohérents, transitions, sons existants ou gratuits si disponibles, réglages audio et qualité. Respecte l’ambiance naturelle et calme du jeu. Évite les systèmes secondaires non demandés.

## 12. Validation et performances

Utilise les tests et commandes réellement présents, puis ajoute uniquement les vérifications utiles aux comportements introduits. Vérifie au minimum :

- analyse TypeScript/lint lorsqu’ils existent, tests pertinents et build de production ;
- lancer valide, lancer refusé et annulation ;
- orientation et moulinage simultanés, perte de focus et interruption de geste ;
- capture gagnée, casse et décrochage ;
- continuité d’identité du poisson et rattachement visuel du fil ;
- récompense unique, achat, changement d’équipement et absence de blocage sans monnaie ;
- persistance après rechargement, migration, export et import ;
- ajout et retrait des favoris, limite de cinq et personnalisation ;
- navigation répétée entre pêche, carnet, boutique et aquarium, sans boucle de rendu ou mémoire qui s’accumule ;
- erreurs de chargement d’une ressource et retour à un état utilisable.

Vérifie le rendu dans un navigateur réel avec les outils disponibles. L’émulation tactile vérifie l’interface ; elle ne constitue pas un test sur iPhone physique. Le téléphone cible de référence est un iPhone 14 Pro. Vise d’abord une expérience stable à 30 images/seconde, puis améliore sans alourdir inutilement. Rapporte les mesures observées et l’environnement de test, sans annoncer des performances non mesurées.

Prévois un mode qualité réduit si nécessaire, limite la résolution de rendu et charge les modèles à la demande. Ne télécharge pas tout le catalogue 3D au démarrage.

Les vérifications bloquantes doivent être corrigées avant publication. Ne laisse pas une vérification cassée en supprimant simplement sa couverture ou en masquant l’erreur.

## 13. Publication, compte rendu et relais Claude

Lorsque l’ensemble jouable est validé, réalise si possible un déploiement de prévisualisation sur la cible Vercel vérifiée et contrôle la version publiée. Puis publie en production sur le même projet, conformément à l’autorisation de cette mission. Ne pousse pas sur une branche déclenchant automatiquement la production avant les vérifications nécessaires.

À la fin, laisse :

- les sources fonctionnelles et les changements clairement identifiés ;
- un `RELAIS_PROJET.md` à jour pour Claude et Codex ;
- `docs/MISSION_AUTONOME.md` avec ce qui est terminé, partiel, bloqué et restant ;
- `docs/ASSETS_POISSONS.md` avec les modèles utilisés, les correspondances, les animations et le remplacement futur ;
- `docs/DECISIONS_JEU.md` avec les choix de gameplay et d’équilibrage à revoir après mon test ;
- les commandes de lancement et les résultats des vérifications ;
- des captures d’écran des principales scènes, si les outils le permettent ;
- l’URL et la version du déploiement réellement effectué, ou les informations exactes pour lancer localement.

Actualise les documents de reprise après chaque étape importante : l’objectif est qu’une autre session puisse continuer même si la tienne atteint sa limite. Si la documentation existante impose une validation désormais accordée par cette mission pour ces changements du jeu, prends en compte cette autorisation explicite et consigne-la ; elle n’autorise pas des actions sans rapport avec le périmètre.

Ne qualifie pas une fonction de terminée si elle est seulement dessinée, simulée dans un écran ou non vérifiée. Signale les solutions provisoires, notamment pour les animations et les modèles. Si tu atteins une limite technique ou de session, sauvegarde l’état et la prochaine action exacte. N’affirme pas que le travail continuera après l’arrêt de ta session.

Commence maintenant par l’inspection du dépôt, puis réalise P0. Continue ensuite jusqu’au dernier objectif réalisable, sans attendre mon retour pour les décisions courantes.
