# 00 — Décisions et périmètre

## Priorités de produit

1. Jeu de pêche plaisant à la manette : gestes lisibles, contrôle direct, satisfaction des prises et collection.
2. Rendu naturel soigné, eau et poissons crédibles, carte agréable, performance stable.
3. Matériel complet mais compréhensible, méthodes distinctes et préparation visuelle utile.
4. Progression et contenu récupérés, sans catalogue fictif ni migration destructive.
5. PC et mobile compatibles avec les mêmes règles, avec présentation adaptée.

Consoles visées : PlayStation et Xbox prises en charge par Roblox. FishDex est lancé dans Roblox avec son compte et sa connexion, pas comme un titre autonome livré sur les stores console. Aucune version hors ligne n'est promise. Ne pas élargir le périmètre à des plateformes non vérifiées.

## Ce que le portage doit couvrir

- Tous les poissons et apparences présents dans le dépôt/app selon audit ; profils distincts, images, paramètres, animations et disponibilité honnête.
- Toutes les méthodes déjà livrées, leur présentation, touche, conduite et réception ; quatre contrôleurs de fond, pas un faux combat différent pour chaque couleur de canne.
- Carte initiale complète, spots, obstacles, profondeurs, courant lorsqu'utile, population plausible et navigation entre spots.
- Préparation : canne → méthode → ensemble → montage → appât → test de présentation → pêche.
- Inventaire, boutique catégorisée, stock, consommables, kit permanent, pertes liées au point de rupture.
- XP, grandes étapes de quinze niveaux ou quête alternative, achats, maîtrise, badges, monnaie de jeu et photos de spécimens.
- FishDex comme collection principale ; carnet filtrable secondaire ; aquarium de cinq prises favorites et personnalisation.
- Réglages, aide progressive, manette, clavier/souris, tactile secondaire, sauvegarde et reprise.

Pas de boutique en Robux, abonnement, récompense quotidienne obligatoire, échange entre joueurs ou coopération ajoutés par défaut. La monnaie du jeu reste indépendante des Robux. Des serveurs Roblox ne rendent pas obligatoire une refonte multijoueur : viser une session de pêche solo avec réglage de capacité adapté, à vérifier dans Studio.

## Priorité des spécifications

Décisions récentes du propriétaire → présent dossier Roblox → relais du dépôt et implémentation auditée → références antérieures compatibles. Les règles de progression et de montage de la référence gameplay sont reprises ; les commandes sont adaptées à la nouvelle plateforme. Les anciens chiffres de pêche sont des valeurs de conception à mesurer, jamais des lois biologiques.

## Réutilisation et périmètre historique

Le chantier carte Blender déjà engagé doit laisser des fichiers récupérables : scènes, scripts, textures, modèles, placements et rapports. Ne pas exiger une nouvelle validation complète du navigateur avant d'extraire les assets pour Roblox. Préserver cependant son état et les échecs connus.

Le futur chantier de production de poissons bascule vers des exports adaptés à Roblox. Les sources Blender et références anatomiques restent pertinentes ; GLB, water shader web, scripts TypeScript et CSS ne sont pas des livrables natifs Roblox.

L'app compagnon FishDex reste un projet distinct. Aucun schéma Supabase, accès utilisateur, page web ou domaine n'est modifié pour réaliser le jeu Roblox. Les données publiques de catalogue et images utilisables peuvent être exportées depuis ses sources autorisées.

## Incertitudes à lever au lot 0

Chemin du dépôt réel, état des branches, fonctions réellement terminées, nombre d'espèces, droits des packs, disponibilité de Studio/MCP/manette/console, identité du compte propriétaire, sauvegardes et export actuels. Ces inconnues ne sont pas remplacées par des chiffres inventés.
