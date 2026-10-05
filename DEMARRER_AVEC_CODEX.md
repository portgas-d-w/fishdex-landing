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

## Cible Vercel confirmée — remplacement autorisé

Je souhaite remplacer mon ancien site FishDex par le jeu **Au fil de l’eau** dans le projet Vercel suivant :

- **Équipe :** `portgas-d-ws-projects`
- **Projet :** `fishdex-landing`
- **Lien fourni :** https://vercel.com/portgas-d-ws-projects/fishdex-landing/DhwVxfAjFKwy1TsbCddjPoG1iiTk

Cette instruction remplace toute mention indiquant que la cible Vercel reste à choisir. J’autorise le remplacement du site actuellement publié par le jeu, une fois les vérifications réussies.

Procède ainsi :

1. Vérifie que tu es connecté au bon compte et au bon projet. Si une authentification est nécessaire, accompagne-moi dans la connexion officielle, sans me demander de coller un jeton dans la conversation.
2. Inspecte le dépôt Git associé, la branche de production, les domaines et les paramètres de build. Identifie comment conserver une possibilité de retour à l’ancien site.
3. **Conserve le projet Vercel existant** et ses domaines. Remplace son contenu par le jeu ; supprimer puis recréer le projet n’est pas nécessaire.
4. Adapte sa configuration à ce projet Vite : commande `npm run build`, sortie `dist`, dossier racine correct. Assure-toi que les prochains déploiements Git publieront bien le jeu.
5. Exécute les vérifications du projet, puis déploie une préproduction. Contrôle le chargement des poissons, les commandes, une capture et la sauvegarde.
6. Si ces contrôles réussissent, publie le jeu en production sur ce projet. Mon autorisation de remplacement est déjà donnée.
7. Mets à jour `RELAIS_PROJET.md` et `docs/VERCEL.md` avec la configuration réellement utilisée, les résultats, les URL et la procédure de retour arrière.

N’interviens pas sur mes autres projets ou services. N’active aucun abonnement supplémentaire. N’inclus pas l’archive originale des poissons dans les fichiers publics.

Effectue les opérations accessibles toi-même. À la fin, donne-moi **l’URL de production du jeu**, ce qui a été vérifié et les éventuels points restant à tester sur mon téléphone.

# Message de reprise pour Claude

Reprends le projet existant `au-fil-de-leau`. Lis `CLAUDE.md`, `AGENTS.md`, puis
`RELAIS_PROJET.md` et `docs/BACKLOG.md`. Vérifie l’état des fichiers et les tests,
puis continue la prochaine tâche indiquée sans repartir de zéro. Mets à jour le
document de relais à la fin de ta session.
