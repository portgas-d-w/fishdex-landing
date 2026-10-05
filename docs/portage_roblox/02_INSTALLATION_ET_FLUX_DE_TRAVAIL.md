# 02 — Installation et flux de travail

## Environnement local

Claude travaille depuis le PC Windows du propriétaire. Vérifier Roblox Studio à jour, Claude Code, Git et les outils Blender présents. Une session distante sans Studio ne peut pas être présentée comme une intégration testée dans le moteur local.

Le serveur MCP officiel est intégré à Studio et prend en charge Claude Code et Codex CLI. Activer dans Studio : Assistant → menu … → Manage MCP Servers → Enable Studio as MCP server ; utiliser Quick connect pour le client installé. Vérifier la connexion par un état de Studio, une lecture de scène et un playtest. Les chemins exacts doivent venir de l'installation réelle, pas d'un ancien exemple copié aveuglément. Voir source S01.

Les actions de connexion au compte, 2FA et vérification d'âge appartiennent au propriétaire. Ne pas stocker de mot de passe ni demander des secrets dans un prompt. Si l'accès est bloqué, produire une instruction locale précise et poursuivre le code et les données hors de cette dépendance.

## Projet et source de vérité

Recommandation : nouveau dossier voisin `fishdex-roblox/`, historique Git distinct ou worktree convenablement isolé selon l'existant. Ne pas remplacer le dossier web. Une branche `portage/roblox-console` convient ; adapter au dépôt plutôt que supposer qu'elle existe.

Versionner les scripts Luau via Rojo, avec CLI et plugin compatibles. La documentation distingue le serveur CLI et le plugin Studio ; l'extension VS Code ne garantit pas un binaire `rojo` dans PATH. Installer depuis les sources officielles, tester les commandes, puis enregistrer les versions réellement retenues. Voir S02.

Le dépôt conserve les scripts, configurations, catalogues, sources/export d'assets et scènes. Les chemins `src/client`, `src/server`, `src/shared` sont proposés, pas imposés à un framework tiers. Utiliser Luau simple et typé avant d'introduire un gros framework.

Rojo n'est pas un aller-retour universel pour toutes les modifications de scène. Définir explicitement ce qu'il gère. Les scripts synchronisés sont écrits dans les fichiers ; les zones de monde/terrain éditées dans Studio sont sauvegardées dans des scènes ou modèles versionnés non écrasés par la synchronisation. Ne pas laisser un script corrigé seulement via MCP dans Studio être remplacé par une version ancienne sur disque.

## Arborescence cible indicative

| Chemin | Contenu |
| --- | --- |
| src/client/ | Input, caméra, UI, retours visuels/sonores et présentation |
| src/server/ | Sessions, simulation validée, récompenses, stock et sauvegardes |
| src/shared/ | Types, catalogues communs nécessaires au client, règles pures |
| assets/source/ | Blender et sources dont les droits le permettent |
| assets/export/ | Exports validés FBX/glTF, textures et sons |
| places/ | Sauvegardes de scènes avec ownership explicite des zones Rojo/Studio |
| tools/ | Générateurs de catalogues, validations et conversion |
| tests/ | Vérifications de logique et scénarios de jeu significatifs |
| docs/portage/ | Audit, couverture, décisions, recettes et relais |

Ajouter configuration Rojo, ignore des secrets, toolchain épinglée et procédure build/serve/test réellement exécutée. Un fichier de place construit avec succès et une ouverture Studio réussie valent plus qu'une arborescence vide.

## Deux expériences distinctes

Créer `FishDex — Test` pour les essais et `FishDex` pour la version stable, dans le compte du propriétaire. Garder les deux privées au début. Renseigner leurs vrais universe/place IDs seulement après création. Leur séparation isole les sauvegardes ; deux places dans la même expérience peuvent accéder aux mêmes DataStores. Voir S06.

La publication privée test est l'objectif opérationnel de développement. Si une console ne peut pas ouvrir le jeu selon les réglages disponibles, vérifier l'accès et les exigences d'audience plutôt que rendre automatiquement le jeu public. Limited et Public ont des conditions propres. Les testeurs externes avec uniquement Playtest ne peuvent pas simplement accéder à un jeu Private ; vérifier Limited → Playtesters dans le Dashboard. Voir S09.

## Cycle quotidien

Modifier → vérifier la logique → synchroniser → playtest Studio à la manette → enregistrer scène et Git → publier une version test identifiée → tester sur matériel disponible → consigner résultat. Une publication ne met pas à jour instantanément une session déjà ouverte : rejoindre un serveur récent ou redémarrer seulement les serveurs de test concernés. Voir S10.

Toute version de test expose discrètement un identifiant de build dans Réglages, pas dans le HUD de combat. Le propriétaire peut jouer à la version publiée pendant que Claude modifie la version locale. Codex prend des lots isolés ; il ne pilote pas simultanément la scène active de Claude.
