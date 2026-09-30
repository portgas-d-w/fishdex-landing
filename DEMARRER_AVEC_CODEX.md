# Message à donner à Codex sur le PC

Tu travailles dans le dossier `au-fil-de-leau` que je viens d’extraire.
Lis `AGENTS.md`, `RELAIS_PROJET.md` et `docs/BACKLOG.md`.

Prends en charge la partie technique : vérifie Node.js, installe les dépendances
verrouillées avec `npm ci`, exécute les vérifications, puis lance le jeu pour que
je puisse le tester. Si Node.js est absent, guide-moi sur son installation officielle ;
ne me demande pas d’écrire ou de modifier du code.

Ce chantier contient déjà une première boucle de pêche 3D. Ne le recrée pas.
Corrige les problèmes concrets que tu constates, puis avance selon les priorités
du backlog : commandes tactiles, fluidité, rendu des poissons et sensation de combat.
Travaille par petites étapes vérifiées, sans acheter de services.

Blender peut être utilisé pour préparer les assets. Les cinq poissons GLB actuels
sont déjà fournis ; les originaux sont dans `assets-source/riverfishpack.zip`.

Prépare la publication sur mon Vercel. Avant de relier ou remplacer un site existant,
demande-moi son nom ou son URL si cette information n’est pas déjà fournie.
Une fois la cible connue, examine sa configuration et prépare une URL de préproduction.

À chaque fin de session, mets à jour `RELAIS_PROJET.md` avec ce que tu as réellement
fait et testé. Claude Code devra pouvoir reprendre dimanche en lisant ce fichier.

# Message de reprise pour Claude

Reprends le projet existant `au-fil-de-leau`. Lis `CLAUDE.md`, `AGENTS.md`, puis
`RELAIS_PROJET.md` et `docs/BACKLOG.md`. Vérifie l’état des fichiers et les tests,
puis continue la prochaine tâche indiquée sans repartir de zéro. Mets à jour le
document de relais à la fin de ta session.
