# Structure complète — audit du 1 octobre 2026, Codex

Mission MISSION_STRUCTURE_COMPLETE_DU_JEU.md prioritaire. Base Git propre 5fd5748, branche codex/structure-complete, tag local archive/au-fil-de-leau-before-structure-2026-10-01. Référence FishDex en lecture seule ; sources déjà importées avec empreintes dans src/game/fishdex.json. Aucune base ou secret consulté.

| Espace | État initial | Écart à traiter | Validation attendue |
| --- | --- | --- | --- |
| Pêche / résultat | Fonctionnel | Révélation numérotée, liens FishDex et priorité photo | Capture réelle, récompense unique, pause et gestes |
| FishDex | Partiel, listes dépliables | Grille numérotée, vraie fiche, records, maîtrise, objectifs et prises | Découverte, manquants, variantes, retour avec filtres |
| Carnet | Partiel | Filtres combinables et tris, vues rapides | Anciennes prises, photo absente, fiche et favori |
| Matériel | Partiel | Catalogue de familles, fiche et montage compatible | Kit gratuit, achat distinct de l'équipement, préparation persistante |
| Boutique | Achats fonctionnels | Catégories, fiches, confirmation et déblocages communs | Achat persisté, indisponible/à venir distincts |
| Lieux | Absent comme écran | Étang réel, habitats et fiches futures | Choix cohérent, changement hors partie |
| Aquarium | Fonctionnel | Cinq emplacements, remplacement, accès déco et refonte | Cinq individus, réglages persistants, scène pêche suspendue |
| Progression | Partiel | Fiches badges et progression/objectifs/liens | Maîtrise observable et prochaine étape |
| Aide / réglages | Fonctionnel | Sauvegarde accessible, récupération et options | Export/import validés, champs natifs |
| Rendu | Fonctionnel peu soigné | Eau, lumière, décor/matières et tous les écrans | Avant/après mêmes vues, mesure logiciel, fil visible |

## Connexions conservées

FishingGame → résultat identifié → recordCatch idempotent → journal/records/variantes/XP/écus/badges → photo IndexedDB. FishDex et objectifs lisent cette progression ; carnet et aquarium référencent les IDs individuels. Inventaire et boutique partagent les IDs d'objets, l'équipement influence la simulation. Les panneaux suspendent la pêche et nettoient les pointeurs.

## État intégré après implémentation

Tous les espaces présents sont maintenant reliés : FishDex grille numérotée et fiche → prises filtrées / préparation ; carnet avec onze critères combinables, quatre tris et vues rapides → spécimen → FishDex / favori ; préparation → catégories/fiches / techniques futures / lieux ; boutique → fiche / confirmation / achat / équipement ; progression → fiche badge / objectif / matériel ; aquarium → cinq slots / sélection / remplacement / fiche / décoration boutique ; aide → audio / qualité / mode appui-cercle / sauvegarde.

Sauvegarde v3 migre v1/v2, garde IDs et récompenses uniques, persiste préparation et mode moulinet. Fichier corrompu préservé et exportable ; stockage plein signalé. Découvertes espèces/apparences/maîtrise indépendantes ; contenu futur exclu des objectifs réalisables. Feeder, mouche et rivière sont des fiches fonctionnelles avec lancement/achat indisponibles ; leur simulation reste **à venir**. Les anciennes prises v1 restent des agrégats, pas de faux individus ou photos inventés.

Contrôles actuels : 35 tests Node + TypeScript/build réussis ; première passe 16/16 puis suite navigateur complète 38 réussis / 2 ignorés (4,2 min). Mobile 390×844 et bureau, gestes/cercle/appui/interruptions, filtres/retours, achats, remplacement cinq favoris, photos/models/sauvegarde et menus natifs. Dernier réglage de rendu et build sans QA à vérifier avant publication.

## Points de reprise

Audit et baseline avant rendu terminés. Implémentation et validations en cours. Aucun écran futur n'est déclaré jouable. Migration v3 intégrée, clé conservée. Pas d'essai iPhone physique possible depuis cet environnement.
