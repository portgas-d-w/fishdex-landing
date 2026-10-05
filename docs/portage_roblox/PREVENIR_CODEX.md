# Relais pour Codex — changement de plateforme

Décision du propriétaire, 5 octobre 2026 : portage complet de FishDex vers Roblox ; consoles et manette deviennent prioritaires. Claude Code est responsable du chantier principal.

À lire avant de reprendre une tâche FishDex, puis à référencer dans `RELAIS_PROJET.md` et dans les consignes d'agents du dépôt, en conservant leurs autres instructions.

## Travail immédiat de Codex

1. Sauvegarder proprement son chantier actuel : branche, état Git, modifications non commités, tests en cours et dernière version connue. Préserver les assets et fichiers non suivis ; ne pas les supprimer.
2. Arrêter de lancer de nouveaux lots spécifiques au navigateur. Une opération déjà en cours doit atteindre un point de sauvegarde sûr. Ne pas interrompre une sauvegarde ou supprimer des fichiers pour accélérer la transition.
3. Écrire un relais technique court : ce qui fonctionne, ce qui manque, emplacements des catalogues, contrôleurs, compatibilités, progression, inventaire, sauvegardes, assets, tests et bugs.
4. Fournir à Claude les chemins et commits utiles. Ne pas fusionner automatiquement des branches anciennes ni redéployer le web pour le remplacer.
5. Sur Roblox, intervenir uniquement sur un lot coordonné : audit de données, tests de logique, outils de conversion, revue ou reprise explicitement confiée. Claude garde l'intégration générale. Un seul agent écrit dans la scène Studio à un instant donné.

Le portage réutilise les règles et contenus, mais remplace la couche moteur et l'interface. Les vieux prompts de correction tactile/CSS, de publication Vercel et de visualisation GLB restent historiques. Ils ne doivent pas déclencher un nouveau déploiement web pendant ce chantier.

Les dernières décisions visibles du propriétaire et le présent dossier priment pour la nouvelle cible. Les références décrivent le produit, pas une obligation de conserver une interface mobile sur console. Lire `00_DECISIONS_ET_PERIMETRE.md` et `04_GAMEPLAY_MANETTE_ET_METHODES.md` avant de changer un contrôle.

## Message prêt à transmettre à la session Codex

Le projet change de plateforme : nous portons complètement FishDex sur Roblox, avec priorité aux consoles et à la manette. Claude pilote le portage. Lis `PORTAGE_FISHDEX_ROBLOX_CONSOLE/PREVENIR_CODEX.md`, ou son chemin réel une fois extrait, et les décisions du dossier. Sauvegarde ton travail courant, documente les fichiers et commits à récupérer, puis suspends les nouveaux chantiers propres au navigateur. Mets le relais et les consignes d'agents à jour sans effacer leurs autres règles. Prépare un transfert clair vers Claude. Ne supprime ni le site, ni les assets, ni les données. Pour la suite, travaille sur des lots Roblox coordonnés ou reprends le chantier lorsque je te le confie.

Statut : ce fichier est une consigne à lire/transmettre. Il ne prouve pas que la session Codex externe l'a reçue.
