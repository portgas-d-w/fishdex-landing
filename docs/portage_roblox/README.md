# FishDex — Portage complet vers Roblox, priorité console

Version 1 — 5 octobre 2026. Responsable de l'implémentation : Claude Code. Codex : reprise, revue ou lot délégué explicitement.

## Décision

FishDex devient une expérience Roblox conçue d'abord pour la manette et les téléviseurs. PC et mobile restent des cibles secondaires. L'expérience demeure principalement solo. Le portage couvre tout le jeu : méthodes, poissons, monde, montage, inventaire, progression, boutique, collection, carnet et aquarium.

Ce dossier est une mission de développement et de migration. Il ne contient pas de jeu Roblox déjà construit, de compte connecté, d'assets déjà importés ou de performances console mesurées. Le dépôt actuel n'a pas été audité dans cette préparation.

## Comment démarrer

1. Extraire ce dossier à côté du dépôt actuel du jeu, ou dans son répertoire `docs/portage_roblox/`. Garder les chemins d'origine des assets accessibles à Claude.
2. Lire et transmettre `PREVENIR_CODEX.md` à la session Codex actuelle avant de lui faire continuer son ancien chantier. Ce fichier prépare le relais ; il n'envoie pas lui-même de message à Codex.
3. Ouvrir Claude Code sur le PC Windows qui héberge le dépôt et Roblox Studio. Lui transmettre `DEMARRER_AVEC_CLAUDE.md`.
4. Claude réalise l'audit, sauvegarde le travail courant, crée un projet Roblox distinct et suit les lots. Si Studio ou le compte ne sont pas accessibles, il avance sur le code, les données et les conversions possibles, puis indique précisément l'action locale nécessaire.
5. Tester les versions privées avec une manette, puis sur une vraie console quand elle est disponible. Une session Studio sur PC ne vaut pas un test PS5.

Le nouveau projet doit être séparé du projet web. Aucun fichier de production Vercel, domaine ou base de données de l'app compagnon n'est supprimé pour réaliser cette migration. La version navigateur devient une référence conservée, et ses nouveaux travaux spécifiques sont suspendus après sauvegarde.

## Ordre de lecture

| Fichier | Fonction |
| --- | --- |
| DEMARRER_AVEC_CLAUDE.md | Mission complète à transmettre à Claude |
| PREVENIR_CODEX.md | Décision de migration et coordination de Codex |
| 00_DECISIONS_ET_PERIMETRE.md | Priorités, contenu à conserver et arbitrages |
| 01_AUDIT_ET_RECUPERATION.md | Audit du dépôt, branches, contenus et sauvegardes |
| 02_INSTALLATION_ET_FLUX_DE_TRAVAIL.md | Studio, MCP, Git, Rojo et tests privés |
| 03_ARCHITECTURE_ET_DONNEES.md | Architecture Luau, simulation, réseau et sauvegardes |
| 04_GAMEPLAY_MANETTE_ET_METHODES.md | États de contrôle, combat et couverture des méthodes |
| 05_UI_MATERIEL_ET_BOUTIQUE.md | Interface console, atelier, collection et aide |
| 06_CARTE_EAU_ASSETS_ET_POISSONS.md | Portage artistique, Blender et rendu |
| 07_LOTS_ET_CRITERES_DE_FIN.md | Lots successifs jusqu'au portage complet |
| 08_TESTS_PERFORMANCES_ET_PUBLICATION.md | Vérifications, mesures, déploiement et retour arrière |
| 09_RELAIS_ET_SOURCES.md | Coordination, sources officielles et limites |
| data/ | Plans, états de contrôles, palette et couverture initiale |
| templates/ | Modèles d'audit, relais et rapports |
| references/ | Documents antérieurs, pour leur conception uniquement |

## Premier résultat attendu

Une expérience privée jouable à la manette avec un spot d'étang, une canne à moulinet, quelques poissons du catalogue réellement disponible, lancer, touche, combat, réception, récompense, collection et reprise après reconnexion. Puis une ligne fixe et une grande canne à déboîter valident les autres contrôleurs avant l'extension de tout le contenu.

Les nombres de poissons, spots ou assets présents seront déterminés par l'audit. Le dossier ne transforme pas une ancienne liste de candidats en inventaire du jeu.
