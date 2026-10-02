# Consigne à transmettre à Codex dans le dépôt actuel du jeu

Travaille sur **le jeu existant Au fil de l’eau / fishdex.fr**, dans le dépôt déjà utilisé. Le dossier `Dossier_Au_Fil_De_Leau` contient mes nouvelles décisions et la recherche préparée pour toi. Retrouve son emplacement dans le dépôt, puis lis README.md, le dossier principal, les documents de docs/ et les catalogues de data/.

Objectif : intégrer une vraie préparation de canne et de montage, réorganiser Matériel, enrichir les catalogues dès maintenant et rendre les poissons déjà jouables plus distincts. Avance jusqu’à une fonctionnalité vérifiée, sans te limiter à proposer un plan. Ce dossier est une base de conception, pas la preuve que tout son contenu est déjà implémenté.

Lis d’abord AGENTS.md, RELAIS_PROJET.md et les consignes actuelles ; inspecte les modifications présentes. Conserve toutes les fonctionnalités et sauvegardes saines. Les nouvelles règles remplacent seulement les anciennes consignes contradictoires sur l’organisation du matériel et l’ordre de préparation.

Les décisions sont :

- **Choisir la canne, puis une méthode compatible, puis préparer le montage.**
- Matériel comporte **Ma canne / Mon sac / Ensembles**. Ma canne s’ouvre par défaut et montre la canne au centre avec des repères tactiles : canne, méthode, moulinet, fil, bas de ligne, montage. Les repères dépendent de la technique.
- Toucher Montage ouvre un assemblage visuel en gros plan. On y change bouchon, plombée, fixation, terminal, hameçon, esche ou leurre selon la recette. Utilise les images possédées ou un schéma léger par code ; aucune nouvelle génération de modèles 3D n’est demandée.
- Boutique et inventaire utilisent les mêmes données. Les fiches futures existent et ont une place ; ne les présenter comme achetables/jouables qu’une fois leur usage fonctionnel. Regrouper les tailles dans une fiche, pas dans des centaines de grandes cartes identiques.
- Les composants influencent réellement profondeur, présentation, accès au poste, espèces candidates et contrôle du combat. Pas de poisson apparaissant hors de son habitat ni de tableau d’appâts universel.
- Rupture localisée : perdre uniquement les segments et objets réellement détachés. Canne, moulinet, accessoires hors ligne et bobine restante sont conservés. Gérer composants coulissants, branches, libération du plomb, réservation de stock et événements idempotents.
- Kit gratuit complet utilisable à l’infini après une casse, non revendable. Les composants payants mélangés au kit restent exposés à leur perte normale. Zéro argent ne bloque jamais la pêche.
- Attribuer aux espèces déjà jouables leur profil biologique et un comportement de jeu individuel. Notes normalisées, appâts candidats, rareté et économie sont des hypothèses d’équilibrage ; ne les afficher comme faits scientifiques. Les identités douteuses et fiches d’observation restent telles quelles jusqu’à résolution.
- **Moulinage par simple appui, jamais des cercles.** L’orientation de la canne fonctionne en même temps et reste le contrôle de combat principal. Maintenir une tension modérée, fatiguer le poisson, récupérer pendant ses pauses ; autoriser récupération limitée d’un petit poisson selon le matériel. Ne pas transformer l’arrêt du moulinage en relâchement automatique du fil.
- Préserver le lancer manuel : geste initié dans la zone basse contrôlant la canne, relâchement en zone médiane/haute pour envoyer, direction et puissance du geste déterminant la trajectoire. Pas de bouton « Lancer la ligne ».
- Préserver les correctifs iOS : aucune sélection involontaire/drag/menu natif sur les gestes de jeu ; `touch-action: none` seulement sur leurs surfaces. Les menus défilent, les champs restent éditables, les doigts sont suivis indépendamment et toutes les annulations stoppent le moulinage.
- Conserver FishDex principal, carnet secondaire filtrable, cinq favoris maximum à l’aquarium, XP/maîtrise, captures/photo/argent et progression existante.

Procède dans cet ordre :

1. Audit du dépôt et table de correspondance des identifiants. Exécuter la validation du dossier et établir l’état actuel réel du jeu.
2. Catalogues complets avec états explicites et nouvelle organisation de Matériel. Réutiliser la direction visuelle actuelle, avec contenu compact, header opaque, retours stables et menus utilisables sur téléphone.
3. Chaîne fonctionnelle au flotteur : canne → montage → stock → lancer → profondeur/rencontre → combat → casse ou capture → photo → sauvegarde. Préserver et raccorder les méthodes fond/leurre si elles existent.
4. Profils et variations des poissons actuellement disponibles. Ajouter les autres méthodes seulement si leurs mécaniques, assets et habitats sont réellement prêts.
5. Tests pertinents, build et contrôle tactile/visuel. Vérifier anciennes sauvegardes, manque de stock, mélange gratuit/payant, presets et événement répété. Corriger les erreurs avant livraison.

Ne refais pas l’application FishDex source : utilise-la en lecture seule pour confirmer taxons et réutiliser les ressources fournies. Pas de nouvel abonnement, service payant, backend imposé ni remplacement du pack de poissons actuel.

Mets à jour RELAIS_PROJET.md ainsi que RELAIS_CODEX_CLAUDE.md avec terminé/partiel/futur, décisions, migrations, vérifications et suite. Ne demande pas une validation pour chaque choix réversible déjà cadré ; tranche les détails de mise en œuvre et explique-les dans le relais. N’invente pas des paramètres biologiques ou une identité pour combler une donnée manquante.

Le déploiement reste celui déjà autorisé : contrôler la liaison Vercel du **jeu `fishdex-landing`, équipe `portgas-d-ws-projects`**, conserver fishdex.fr et les autres projets. Ne déploie qu’après les contrôles du projet. Si les accès ne sont pas présents, termine l’intégration locale et donne le blocage exact ; ne remplace pas un autre projet.

À la fin, livre l’état réellement vérifié, les changements, les limites et les prochaines étapes. « Catalogue présent » et « mécanique jouable » doivent rester deux états distincts.
