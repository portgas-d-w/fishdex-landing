# Architecture du prototype

## Choix

Babylon.js 9.28.0, TypeScript 5.9.3 et Vite 8.3.1, versions exactes et lockfile.
Pas de React, de backend, de base de données ou de compte joueur pour cette boucle.
Le serveur Vite sert au développement ; la production est constituée de fichiers statiques.

## Responsabilités

`game/catalog.ts` : espèces et paramètres de gameplay, postes, pondérations d’appâts.
Les probabilités, tailles et forces sont réglées pour le jeu ; ce n’est pas un simulateur scientifique.

`game/fishing.ts` : machine à états et combat, indépendante du navigateur.
Séquence idle → casting → waiting → bite → fighting → caught/lost → idle.
La simulation avance à pas fixe de 1/60 s, les pauses ne consomment pas la fenêtre de ferrage.
Les transitions remettent à zéro le maintien du moulinet.

`game/save.ts` : schéma v1 du carnet, parsing restrictif, validation et stockage.
Clé `au-fil-de-leau.save.v1`. Les imports sont limités à 100 Ko et demandent une
confirmation visible avant de remplacer les prises. Pas de HTML importé depuis le fichier.

`render/world.ts` : environnement procédural, caméra fixe, eau par shader,
ponton, végétation, bouchon, ligne et ondes. Rendu limité à 30 images/s en économie,
résolution limitée à 1,25× ; qualité élevée jusqu’à 2× et fréquence de l’écran.
Ce sont des limites visées, pas des performances mesurées sur un téléphone physique.

`render/fish-preview.ts` : deuxième contexte WebGL créé à la première prise pour
montrer son GLB. Ressources de la prise supprimées à la fermeture, boucle stoppée.
Pas de nage animée dans cette version : le modèle est présenté avec une caméra oscillante.

`main.ts` : DOM, contrôles pointer/keyboard, modales, pause et orchestration.
`ui/audio.ts` : sons synthétisés via Web Audio, après interaction et si activés.
Pas de requêtes vers une API de son ou d’image.

## Limites à traiter

- Paysage de prototype, rendu de l’eau simplifié sans réflexion physique.
- Effets du combat limités au bouchon et à la ligne ; pas de canne animée ni de poisson qui saute.
- Le module principal regroupe encore beaucoup d’interface. Extraire des contrôleurs
  d’UI seulement lorsque l’ajout de fonctions le justifie.
- La scène végétale mérite une mesure de draw calls et de temps GPU sur téléphone.
- Un contexte supplémentaire pour la prise est acceptable pour ce prototype mais
  doit être testé sur Safari ; un viewport unique reste une option d’optimisation.
- Pas de service worker, pas de jeu hors connexion garanti, pas de synchronisation cloud.
- Pas de progression économique, d’amélioration de matériel ou de cycle météo.

## Contrat de test

Les tests unitaires tournent avec Node et le TypeScript effaçable, sans transpileur de test.
Playwright lance le serveur Vite avec `VITE_E2E=1`. Une petite interface de test donne
accès à l’état et à l’avancement de la simulation. Elle n’existe que lorsque
`import.meta.env.DEV` est vrai et cette variable activée : absente du build de production.
