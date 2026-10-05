# 09 — Relais, sources et limites

## Coordination

Claude intègre le portage. Codex conserve son travail web et transmet les sources, puis participe à un lot séparé ou reprend selon instruction. Utiliser `RELAIS_PROJET.md` et `RELAIS_PORTAGE_ROBLOX.md` : responsable actif, branche/commit, état réel, lot, fichiers, tests, appareils, version test, prochaine commande et blocages.

Ne pas demander aux deux agents de modifier simultanément la même fenêtre Studio. Des branches/worktrees distincts peuvent accueillir conversions, catalogues ou tests, mais leur intégration est explicite. Un message dans ce dossier n'est pas une notification effectivement envoyée à un autre agent externe.

Conserver les références gameplay/DA incluses. Leurs anciens prompts ne sont pas à exécuter. La palette et les règles métier compatibles restent utiles. Les autres archives poissons/carte peuvent être fournies depuis le poste du propriétaire ; le dossier ne duplique pas les packs commerciaux ni n'annonce des modèles déjà fabriqués.

## Sources officielles vérifiées le 5 octobre 2026

| ID | Page | Utilité |
| --- | --- | --- |
| S01 | [Roblox Studio MCP](https://create.roblox.com/docs/studio/mcp) | Connexion officielle aux IA, session locale, lecture/écriture et playtests |
| S02 | [Installation Rojo](https://rojo.space/docs/v7/getting-started/installation/) | CLI, plugin Studio, versions compatibles et source officielle |
| S03 | [Roblox gamepad input](https://create.roblox.com/docs/input/gamepad) | Entrées manette, dispositif préféré, émulateur et haptique |
| S04 | [Cross-platform development](https://create.roblox.com/docs/projects/cross-platform) | Actions communes, adaptation au dispositif et aux écrans |
| S05 | [Console development guidelines](https://create.roblox.com/docs/production/publishing/console-guidelines) | Navigation, zone TV, boutons et divulgation progressive |
| S06 | [Data stores](https://create.roblox.com/docs/cloud-services/data-stores) | Persistance, partage par expérience et isolation des tests |
| S07 | [Client-server boundary](https://create.roblox.com/docs/scripting/security/client-server-boundary) | Validation des opérations et protection de l'économie |
| S08 | [Importer](https://create.roblox.com/docs/studio/importer) | Types de fichiers, rigs, PBR, animations et upload d'assets |
| S09 | [Publishing games and places](https://create.roblox.com/docs/production/publishing/publish-games-and-places) | Publication, audience, accès et conditions actuelles |
| S10 | [Release game updates](https://create.roblox.com/docs/projects/update-games) | Versions publiées et redémarrage des anciens serveurs |
| S11 | [Design for performance](https://create.roblox.com/docs/performance-optimization/design) | Mesures sur appareils, streaming, mémoire, transparence |
| S12 | [Studio testing modes](https://create.roblox.com/docs/studio/testing-modes) | Tests moteur et émulation d'entrées/appareils |
| S13 | [Roblox sur PS5 — PlayStation](https://blog.playstation.com/2026/04/14/an-upgraded-version-of-roblox-launches-on-ps5-today/) | Distribution via l'application Roblox sur PS5 |

Les affectations de touches, tailles d'interface, budgets d'assets, objectifs de FPS et ordre des lots sont des propositions de conception de ce dossier. Les sources attestent des capacités et contraintes, pas du plaisir ni des performances futures de FishDex. Elles devront être consultées de nouveau si les outils/conditions changent.

## Ce qui n'a pas été effectué dans cette préparation

Aucun accès au dépôt Git réel ni à Studio du propriétaire ; aucun import de modèle ou création d'expérience ; aucune notification envoyée à une session Codex externe ; aucun paiement ; aucun test PS5/Xbox/iPhone ; aucune suppression ou modification de fishdex.fr. Les deux références incluses ont été lues dans leur version disponible avant rédaction. Le rapport utilisateur de Claude sert de contexte à vérifier.

## Format de compte rendu

« Réalisé » exige fichier ou scène intégrée. « Testé » exige cas exécuté et environnement. « Publié » exige cible et build identifiés. « Console validée » exige console réelle. « En attente » indique action nécessaire, responsable et travail poursuivable. Une capture générée d'intention ne remplace pas une capture in-game.
