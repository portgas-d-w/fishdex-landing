# Instructions de chantier — Codex et Claude Code

## Changement de plateforme — décision du propriétaire, 5 octobre 2026

FishDex est porté **complètement vers Roblox**, priorité console et manette. **Claude Code pilote le portage** dans le projet distinct `../fishdex-roblox` (relais : `../fishdex-roblox/RELAIS_PORTAGE_ROBLOX.md`). Ce dépôt web devient une **référence gelée** (tag `archive/web-reference-avant-roblox-2026-10-05`) ; fishdex.fr et l'app FishDex restent en ligne.

- Codex : lire `docs/portage_roblox/PREVENIR_CODEX.md`. Ne plus lancer de nouveau lot spécifique au navigateur de façon autonome ; sauvegarder son chantier, documenter commits et fichiers utiles, puis n'intervenir sur Roblox que sur un lot coordonné explicitement confié.
- Les agents ne modifient jamais simultanément la même scène Studio ni les mêmes fichiers ; réserver un lot dans le relais avant de commencer.
- Aucun redéploiement du web pour « remplacer » le jeu ; les anciens prompts tactiles/CSS/Vercel/GLB sont historiques. Les commits limités à la documentation ne déclenchent pas de build Vercel (`ignoreCommand`).
- Les règles ci-dessous restent valables pour toute intervention sur ce dépôt web.



## Mission et contraintes

Construire progressivement un jeu de pêche 3D solo agréable sur navigateur mobile.
L’utilisateur pilote par prompts, choix et tests ; il n’a pas à écrire du code.
Priorité : petite boucle amusante et fluide, avant la multiplication des contenus.
Pas de nouvel abonnement ni API payante. Pas de multijoueur, de Steam, de backend,
de compte joueur ou de boutique dans cette version.

Les règles de produit communes sont dans `RELAIS_PROJET.md`.
Lire ce fichier puis `docs/BACKLOG.md` avant de modifier le code.
Le nom et le décor sont provisoires, proposés pour avancer.

## Exécution

- Travailler dans ce dossier ; inspecter d’abord les changements existants.
- Installer avec `npm ci` après vérification de Node.js. `node scripts/setup.mjs` prépare une nouvelle machine.
- Ne pas demander à l’utilisateur de modifier des sources à la main.
- Garder les règles de jeu dans `src/game/`, indépendantes de Babylon et du DOM.
- Conserver Babylon.js + TypeScript + Vite. Ne pas changer de moteur sans raison explicitée.
- Garder les versions cohérentes de `@babylonjs/core` et `@babylonjs/loaders`.
- Utiliser Blender en ligne de commande pour les futures préparations de modèles si nécessaire.
- Les cinq GLB sont déjà livrés : Blender n’est pas nécessaire pour lancer le jeu.
- Ne pas charger les 50 poissons au démarrage ni ajouter d’effets coûteux sans mesure.
- Arrêter toute commande maintenue sur pointercancel, perte de capture, fermeture de page ou pause.
- Préserver les sauvegardes et prévoir une migration si leur schéma change.
- Ne jamais mettre de secret dans `VITE_*` ou dans les fichiers publics.

## Validation proportionnée

Après changement fonctionnel : `npm run check`.
Pour les commandes, les modales et le chargement des poissons : lancer les tests navigateur
pertinents et inspecter le rendu à 390 × 844, puis à une largeur bureau.
Ne pas prétendre à des tests iPhone réels après une simple émulation Chromium.
Les objectifs de fluidité sont des objectifs tant qu’ils n’ont pas été mesurés sur appareil.

## Vercel et ressources

La cible confirmée est `portgas-d-ws-projects/fishdex-landing`, dépôt
`portgas-d-w/fishdex-landing`, branche de production `main`.
Le propriétaire autorise le remplacement de FishDex après vérification de la
préproduction. Conserver le projet et ses domaines ; préserver le retour arrière.
Pas de déploiement sur un projet deviné. Ne pas relier le dépôt à un autre service sans demande.

Le pack original appartient à l’utilisateur. Garder `assets-source/` hors des builds
et des dépôts publics. Ne pas envoyer les textures ou modèles à un service génératif.
Le script Blender réalise uniquement une conversion locale.

## Relais obligatoire

À chaque fin de session, mettre à jour `RELAIS_PROJET.md` :
date, agent, changements concrets, commandes et résultats réels, problème restant,
prochaine tâche. Déplacer les tâches dans `docs/BACKLOG.md` et consigner les décisions
structurantes dans `docs/DECISIONS.md`.

Si Git est initialisé, faire des commits cohérents après vérification, sans écraser
le travail d’un autre agent. Pas de force-push. Ne pas travailler à deux sur les mêmes
fichiers simultanément. Le relais passe par le dossier et son état Git, jamais par
l’hypothèse d’une mémoire partagée entre les assistants.
