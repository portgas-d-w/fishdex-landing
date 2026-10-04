# Gameplay et progression — livraison 0.15.0

4 octobre 2026, Codex. Spécification intégrale archivée dans SPECIFICATION.md ; identité du dépôt et état initial dans AUDIT_GAMEPLAY.md. Les lots ont été réalisés successivement, avec relais et commits distincts. Babylon 9.28.0 / TypeScript 5.9.3 / Vite 8.3.1 / Node 24.15.0 conservés. Pas de dépendance nouvelle, de réimport de poissons ni de chantier de monde/eau parallèle.

|Lot|Livraison concrète|Contrôles lors du lot|Commit|
|---|---|---|---|
|0|Audit 22 IDs, contrôleurs, v7 et profils ; archive du cahier des charges|npm ci, 214 tests + TS/build|9f3eb09|
|1|11 familles, grands paliers jusqu’à150, niveau OU quête, variantes/maîtrise, prêt isolé et droits hérités|216 tests, 2 parcours navigateur|dfca71c|
|2|Atelier brouillon/appliquer/annuler, métrique et segments, connecteurs, transformation et aperçu physique|218 tests, 2 parcours navigateur|3e65672|
|3|Capacités selon canne/composants, kit, ligne fixe, avertissements et réussites distinctes|219 tests, 6 prototypes, 4 contrôles et 6 cycles navigateur|a750f61|
|4|Manuelle mouche/nymphe/toc, traîne/bateau, feeder local/courant et cycles des22 méthodes|222 tests/55 recettes naturelles simulées, 44 cycles forcés et 4 gestes navigateur|162dc64|
|5|Prix d’entrée/achat explicite, secours sans don payant, recettes par maîtrise, plombs individuels, aperçu de méthode, aide, exercices fiables et réception fondée sur effort réel|227 tests + TS/build ; 12 cas dont44 cycles, 22 parcours UI, 6 parcours publics locaux sans QA|Commit de finition, voir historique et PUBLICATION.md|

## Ce qui change réellement

Disponibilité commerciale distincte de possession ; une famille s’ouvre par niveau OU quête accomplie. Le prêt gratuit n’accorde pas sa canne à la partie normale, ne vend pas ses captures, n’alimente pas son carnet et donne une récompense unique. Les droits sont rafraîchis dès les gestes acquis. Le profil normal, TEST illimité et TEST en règles normales conservent leurs clés séparées ; accélération de niveau limitée au dernier profil.

Brouillon transactionnel, annulation et erreur explicites, stock engagé au lancer selon le modèle existant. Les positions, profondeur, bas de ligne, cheveu, appât et plombée alimentent la présentation et le graphe de pertes. Jusqu’à8 unités de la même référence, sélection/déplacement groupé sans collision, zoom réel et réglage numérique fin. Prévisualiser une méthode ne change pas le montage avant application. La fiche et le pin Appât/Leurre/Mouche donnent accès aux pièces compatibles.

Moulinet par appui maintenu ; aucune rotation ajoutée. Tirée manuelle bornée puis retour neutre, conservation de la ligne et transition exclusive. Kit/déboîtement et élastique dépendent du matériel réel. Vitesse/bateau, feeder, profondeur/couches, mouche et clonk réutilisent les événements des moteurs existants. Réception demande fatigue, position/hauteur et matériel appropriés, avec indication relative du filet. Fermeture/pause/perte de pointeur interrompent les commandes.

## Vérifications et mesures

Dernier `npm run check` :227/227, TypeScript/build PASS. La suite inclut les55 recettes en cycles à rencontres naturelles simulées. Chromium390×844 et1440×900 :12 scénarios de contrôleurs (44 cycles22 méthodes avec poisson forcé),22 scénarios sans QA de préparation/annulation/groupes/achats répétitifs/consommables/retours/verrous/profils,6 parcours locaux sur le build public (prise naturelle, vraie réception, photo, export/import/reload, aquarium et matériel). Les pilotes de combat restent des outils de tests ; aucune capture automatique ajoutée au jeu normal.

EXERCICES.json :11/11 quêtes terminées avec gestes et rencontres naturelles dans la logique ; niveau initial de chaque quête préconfiguré, aucun composant prêté transféré,0 capture au carnet parent et récompense45 écus sauf Bordure0. Ce n’est pas une partie humaine montée de1 à140.

PARCOURS_NORMAUX.json :trois simulations normales jusqu’au niveau15, au coup, graine147, sans poisson forcé ni droits de bac à sable. Préparation hypothétique incluse :débutant prudent22,28min/21prises/5échecs, expérimenté12,11min/22prises, préférence coup14,36min/22prises. Premier achat65écus au troisième essai. Médianes combat+réception17,22–18,82s ; p9024,58–25,28s. Les scripts utilisent un pilote de géométrie efficace, pas un joueur humain. Les pauses de préparation sont des hypothèses clairement séparées des attentes/combats simulés.

PROTOTYPES.json :six diagnostics forcés contrôleur×gardon15/carpe55. Les grosses prises restent27–30s sur ces graines ; certaines petites prises moulinet/kit sont8s. La cadence directe niveau15 est inférieure à45–75min et les gros combats inférieurs à40–90s proposés : équilibrage non considéré validé humainement. Aucun ralentissement artificiel ou minuteur de quête ajouté pour cacher ces écarts.

PERFORMANCES.json compare les octets et SHA du build à0.14.1. Aucune passe GPU/ressource3D supplémentaire. Pas de mesure FPS, chauffe, autonomie, Safari ou VRAM sur téléphone réel. L’avertissement Vite de gros chunk reste présent ; ne pas assimiler le poids du JS à une mesure de fluidité.

## Écarts et suite concrète

La plombée individuelle utilise une référence commune : une plombée hétérogène n’est pas livrée. Le rangement du fil libre sur bobine à la transition manuelle reste simplifié/instantané. Engagement de stock au lancer conservé plutôt qu’une allocation définitive à l’application du brouillon. Les petits jalons +4/+8/+12 orientent vers de vrais contenus existants ; ils ne créent pas de récompenses fictives.

Les22 méthodes ont leur cycle contrôlé (voir MATRICE.md), mais cela ne valide ni réalisme biologique ni équilibre humain. Priorité suivante :jouer les11 apprentissages sur iPhone/Safari avec débutants, chronométrer préparation/attente/combat/réception et retoucher CURRICULUM_CONFIG/COMBAT_CONFIG seulement après ces relevés. Procédure exacte TEST_MOBILE.md. Captures dans docs/apercus/gameplay-progression, dont lot5-plombs-* et lot5-public-local. Publication et contrôle des fichiers dans PUBLICATION.md.

Modification préalable DEMARRER_AVEC_CODEX.md préservée hors commits. Sourcepack et environnement privés restent ignorés ; aucun nouveau service ou modèle.
