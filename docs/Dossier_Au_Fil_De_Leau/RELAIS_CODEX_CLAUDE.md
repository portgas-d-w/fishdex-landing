# Intégration dans le jeu — relais du 2 octobre 2026

## Module canne / montages — 2 octobre 2026, Codex, 0.6.0 en vérification

Branche codex/canne-montages-2026-10-02, base 8b646ad. Consigne jointe et docs/Dossier_Au_Fil_De_Leau lus ; validation du dossier PASS, 6 151 contrôles. Modifications utilisateur de DEMARRER_AVEC_CODEX.md préservées. Référence FishDex lue par git show (checkout de contenu partiellement supprimé) : six empreintes identiques à l’import, aucune modification de la référence.

Terminé localement : Ma canne / Mon sac / Ensembles, montage schématique contextuel, choix des possessions, réglages de profondeur/plombée, catalogues complets différés et variantes groupées, boutique/stock communs, réservations atomiques, résolution de casse localisée et idempotente, kit illimité sans protection des ajouts payants, trois méthodes raccordées, quinze profils et rencontres habitat/profondeur/régime, moulinage uniquement par appui. Version 4 migre v1/v2/v3 et préserve achats, prises, photos, XP, écus et cinq favoris. Reload d’une ligne = retour conservateur sans prise, esche utilisée débitée une fois.

Partiel : atelier SVG et forces normalisées de jeu, frein automatique ; sortie d’un coulissant, branches et clip traités par le graphe, seulement les fixations activées de base sont proposées. Futur : 274 exemples de SKU sans paramètres ni achat, autres méthodes, autres GLB/habitats, observation et identités douteuses, rig squelettique, positions libres de plombs et usure. Les prix et notes sont des hypothèses d’équilibrage. Aucun test Safari/iPhone physique.

Vérifications réelles : Node 24.15.0, npm ci (0 vulnérabilité), npm run check réussi (47 tests, TypeScript et build). Suite navigateur complète : 48 réussis / 2 ignorés (4,2 min ; multitouch bureau et modèles mobile exclus par leur configuration). Après correction visuelle des cases du sac : atelier 6/6 (42,6 s), nouveau check réussi. Smoke local du build sans QA : 8/8 (1,8 min), capture réelle, photo/transfert, quinze GLB, achats/favoris et atelier/catalogue/presets. Mobile 390×844 et bureau inspectés. Les premières passes partielles ont révélé sélecteurs ambigus et attentes de combat anciennes, corrigés ; elles ne constituent pas le résultat global. Comparaison quinze espèces : suivi 13–41 s contre canne fixe 15–55 s, matériel 1,32, graine/gabarit contrôlés ; toutes les espèces ramenées dans les deux stratégies, orientation accélère et améliore le contact.

Liaison Vercel vérifiée : portgas-d-w / portgas-d-ws-projects / fishdex-landing, ID prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, GitHub portgas-d-w/fishdex-landing, production main, Vite/dist/Node24. CLI 62.0.0 déjà disponible. Domaines fishdex.fr → www.fishdex.fr conservés ; production précédente dpl_668C9o4wZNaKFtskyRQ9qR21saFP. Déploiement non effectué à ce stade ; suit tests et smoke du build.

Détails : docs/MONTAGES_IMPLEMENTATION.md et docs/CORRESPONDANCES_MONTAGES.md. Prochaine tâche de cette session : finaliser les vérifications, preview, production autorisée, puis compléter ce relais.


---

# Relais Codex / Claude — module canne, montage et poissons

État initial du dossier au **2 octobre 2026**. Aucun code du jeu n’a été modifié par la préparation de ce dossier. Le dépôt courant, son modèle de sauvegarde et les poissons réellement jouables devront être audités par l’agent qui intègre le travail.

| Module | État | À faire dans le dépôt |
|---|---|---|
| Recherche et sources | Préparé ; limites explicites | Résoudre identités et recettes moins documentées avant activation |
| Catalogue statique | Préparé en JSON/TSV | Faire correspondre les IDs et compléter les valeurs de jeu |
| Ma canne / Mon montage | Spécifié | Construire l’atelier visuel et les panneaux contextuels |
| Mon sac / Ensembles / Boutique | Spécifié | Brancher sur le même stock et catalogue |
| Casse et perte | Spécifié ; graphes d’exemples | Implémenter résolution localisée et transactions idempotentes |
| Kit illimité | Spécifié | Raccorder au kit de départ existant sans exploitation économique |
| Comportements des poissons | Profils proposés | Raccorder aux espèces existantes et équilibrer par taille/contexte |
| Méthodes spécialistes futures | Catalogue partiel | Recherche dédiée, systèmes et lieux avant activation |
| Migration des sauvegardes | Critères spécifiés | Écrire et tester une migration conservatrice du format actuel |
| Vérification du dossier | Script fourni | Exécuter ; vérifier séparément l’intégration et le jeu |

## Consignes permanentes de ce module

Moulinage par simple appui. Aucune commande circulaire. Orientation simultanée de canne. Lancer gestuel sans bouton. Combat à tension continue avec deux risques : mou prolongé et surcharge. Kit gratuit illimité ; paid gear perdu seulement s’il se détache. FishDex principal, carnet secondaire, aquarium limité à cinq spécimens favoris.

## Questions à résoudre par lecture du dépôt / FishDex

- Identités de gobie, sandre doré, silure mandarin ; taxon du groupe koï.
- Alias biologiques, forme « gardon rouge », apparences de truites, hybride possible tiger, image esturgeon gold suspecte.
- Quelles 15 espèces de la capture d’écran sont actuellement disponibles ? Ne pas déduire cette liste de ce dossier.
- Formats et identifiants existants, règles d’économie/stock, composants et assets présents.
- Méthodes toc/gambe/clonk/traîne et autres recettes partielles : mécanismes et contexte à valider.

## Bloc à remplir à chaque relais

- Agent / date / commit de référence :
- Modules terminés et accessibles dans le jeu :
- Modules partiels et limites visibles :
- Contenu catalogué seulement :
- Correspondances d’identifiants / migrations appliquées :
- Décisions de conception / valeurs d’équilibrage avec origine :
- Vérifications exécutées et résultat exact :
- Déploiement : projet, URL et résultat si réalisé :
- Prochaine action concrète :

Mettre également à jour le relais général du dépôt. Ce fichier complète ce relais ; il ne l’efface pas.
