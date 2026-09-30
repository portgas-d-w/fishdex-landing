# Au fil de l’eau — prototype 0.1

Jeu de pêche 3D solo pour navigateur, pensé d’abord pour le téléphone.
Nom et direction artistique provisoires. Ce dossier est un chantier fonctionnel, pas un jeu terminé.

## Commencer sans écrire de code

1. Extraire tout le dossier `au-fil-de-leau` sur le PC.
2. Ouvrir ce dossier dans Codex ou Claude Code.
3. Lui demander de lire `AGENTS.md`, puis `RELAIS_PROJET.md`, et de lancer le projet.

Le prompt prêt à donner à l’agent se trouve dans `DEMARRER_AVEC_CODEX.md`.
Les dépendances ont été installées et vérifiées dans l’environnement de création.
Sur un autre ordinateur, l’agent doit les réinstaller à partir du fichier verrouillé.
Il ne faut pas ouvrir `index.html` par double-clic.

## Installation pour l’agent

Prérequis : Node.js 24 LTS recommandé, npm inclus. Minimum technique : Node.js 22.12.

```sh
node scripts/setup.mjs
npm run dev
```

`setup.mjs` exécute `npm ci`, les vérifications TypeScript, les tests et le build.
Le terminal donne l’adresse locale du jeu. Pour un essai depuis le téléphone,
utiliser l’adresse réseau du PC affichée par Vite, sur le même Wi-Fi.
La préproduction Vercel est préférable pour tester Safari en HTTPS.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm ci` | Réinstaller exactement les dépendances du lockfile |
| `npm run dev` | Serveur de développement, accessible sur le réseau local |
| `npm run build` | Vérification TypeScript puis production dans `dist/` |
| `npm run preview` | Essai local du build de production |
| `npm test` | Tests de combat, sélection des espèces, sauvegarde |
| `npx playwright install chromium` | Installer le navigateur des essais automatisés, facultatif pour jouer |
| `npm run test:e2e` | Tests navigateur bureau et viewport mobile |
| `npm run check` | TypeScript + tests unitaires + build |

## Première version

- Étang 3D procédural : eau animée, végétation, relief, ponton et bouchon.
- Trois postes, deux appâts, cinq espèces accessibles par différentes combinaisons.
- Lancer → attente → touche → ferrage → combat → prise ou fuite.
- Maintenir pour mouliner, relâcher pour réduire la tension ; espace sur ordinateur.
- Carnet des espèces, meilleur record en centimètres, nombre de prises.
- Sauvegarde locale versionnée, export/import JSON avec validation et confirmation du remplacement.
- Affichage du poisson capturé avec les modèles réels du pack de l’utilisateur.
- Son facultatif, qualité graphique réglable, pause en quittant l’onglet.

Pas de compte joueur ni de serveur applicatif. Aucune clé API nécessaire.
La sauvegarde dépend du navigateur et du domaine ; elle ne se synchronise pas automatiquement.
Le mode hors connexion/PWA n’est pas implémenté.

## Organisation

```text
src/game/          Règles, catalogue et sauvegarde, indépendants du rendu
src/render/        Scène Babylon.js et aperçu 3D de la prise
src/ui/            Sons locaux
src/main.ts        Interface, commandes, transitions et orchestration
src/style.css      Interface responsive
public/models/    Cinq poissons GLB optimisés et leur manifeste
assets-source/    Archive originale privée, exclue de Git et de Vercel
scripts/          Installation et conversion Blender
tests/            Tests de logique et navigateur
docs/             Architecture, décisions, déploiement, vérification et tâches
RELAIS_PROJET.md   Source de vérité pour le relais entre agents
```

## Hébergement

`vercel.json` configure le build Vite et le dossier `dist/`.
Voir `docs/VERCEL.md`. Aucun déploiement n’a été effectué, aucun site existant modifié.
Le choix du projet Vercel et le lien avec son dépôt restent à fournir.

## Poissons et droits

Les poissons proviennent du pack **River fish / TricksUp**, fourni par l’utilisateur.
Ils restent des ressources tierces sous leur licence d’origine, sans redistribution
autonome ni nouvelle licence attribuée par ce projet. Voir `docs/ASSETS.md`.
Le dossier complet est destiné au propriétaire du pack et à son chantier privé.

## Reprise

Lire `RELAIS_PROJET.md` en début de session et le mettre à jour en fin de session.
Ne pas recommencer le projet à zéro au changement d’agent.
