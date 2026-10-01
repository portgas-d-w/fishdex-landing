# Gestes et combat — 0.4.0, 1 octobre 2026

La mission jointe remplace les calculs 0.3. La jauge compacte demandée en 0.3.1 reste entre les deux boutons, sans panneau de comportement. Sauvegardes v2, quinze modèles et moteur conservés.

## Portée tactile

Canvas de pêche et commandes : user-select:none, -webkit-user-select:none, -webkit-touch-callout:none ; contextmenu/selectstart/dragstart empêchés sur ces surfaces. Canvas, canne et moulinet : touch-action:none. Aucun touch-action:none sur app/body ou conteneur portant les menus. Dialogues défilables, champs user-select:text et touch-action:auto, événements de sélection/contexte conservés. Les images ne démarrent pas de glissement natif. Les canvas de fiches et de bassin laissent défiler leurs panneaux.

Canne et moulinet ont des identifiants/captures distincts. Une fin ou annulation retire uniquement le doigt concerné ; blur, pagehide, perte de visibilité, pause, redimensionnement et ouverture de menu nettoient les deux gestes et les tours en attente. Un appui immobile ne mouline pas. La préparation de lancer annulée restaure la pose précédente.

## Règles de combat

La longueur de fil est retirée par les tours réellement effectués et augmentée par le frein automatique sous charge. Distance du poisson, hauteur/angle de pointe et extension élastique produisent la tension ; elle est amortie avant l’affichage. Le poisson continue de tirer sans tours. Un retour rapproche le poisson et crée du mou ; récupérer ce fil rétablit le contact.

Pression modérée (0,12 à 0,95) : fatigue selon la pression et le guidage progressif. Fil libre : récupération lente du poisson. Surcharge soutenue au-delà de 0,97 pendant plus de 0,8 s : casse ; contact perdu plus de 4 s, avec récupération progressive du compteur : décrochage. Les écarts brefs sont tolérés. Le frein rend du fil avant cette surcharge, et fait tourner le moulinet dans l’autre sens avec un cliquetis local si le son est activé.

Force relative au matériel et fatigue déterminent la nage et sa résistance à la ligne. Un faible poisson peut céder pendant son départ ; un puissant demande davantage de récupération entre les départs. L’orientation agit continûment, sans condition d’angle pour capturer. Capture seulement près du bord (distance radiale ≤1,81), tension utile 0,08–0,94 ; aucun minuteur de victoire. Un poisson parti au-delà de 45 unités peut atteindre son refuge. Paramètres de jeu simplifiés, sans prétention de simulation biologique.

Canne flexible, fil et point d’entrée suivent le même état ; le mou produit une courbe plus profonde. Flotteur immergé pendant l’essentiel du combat, revenant au bord ; absent au leurre et au fond. Alertes brèves seulement. Flexion plafonnée visuellement pour garder la pointe dans le cadre.

## Lancer

Départ dans le tiers inférieur ; ailleurs, aucune préparation. La canne suit le déplacement. Relâchement à ≤62 % de la hauteur, à l’intérieur de l’écran, avec mouvement vers l’eau et cible valide : lancer. Traverser ne lance pas. Relâchement bas, annulation, interruption ou cible invalide : retour à la pose précédente. En combat les gestes orientent exclusivement la canne.

Puissance : vitesse vers l’avant sur les échantillons récents de 180 ms, avec amplitude secondaire ; portée bornée par la canne. Une pause avant relâchement annule une projection devenue immobile. Cible, arc affiché et arrivée partagent les mêmes coordonnées et courbe ; origine à la pointe, animation de projection continue. Aucun bouton ni poste automatique dans l’interface.

## Évidence et limites

npm run check : 30 tests Node, TypeScript et build réussis. Tests dédiés : départ sans moulinage/frein, surcharge, mou/tolérance, retour/reprise de contact, petite force pendant résistance, effets continus des angles, quinze captures gérées, absence de victoire automatique, lancers doux/rapides/diagonaux/annulés.

Comparaison reproductible : node --experimental-strip-types scripts/compare-combat.mts ; résultats dans apercus/physics-combat-comparison.json. Quinze rencontres de taille médiane, même matériel 1,32 et mêmes règles de moulinage : canne fixe et suivie peuvent toutes deux capturer ; suivre le fil réduit les durées. Cela remplace le critère ancien 0/15 vs 15/15, devenu incompatible avec des angles progressifs. Ce sont des mesures de simulation, pas du ressenti humain.

Résultats navigateur, rendus et publication : docs/VERIFICATION.md et RELAIS_PROJET.md. Chromium tactile 390×844 et bureau ; aucun test Safari/iPhone physique, aucun résultat de chauffe ou garantie de fluidité appareil.
