# Dossier Au fil de l’eau — Codex / Claude

Recherche et conception du **2 octobre 2026**. Ce dossier ajoute le système « Ma canne / Mon montage » au projet actuel de jeu sur fishdex.fr. Il n’est pas un nouveau jeu ni une copie de son dépôt.

## À lire

1. [Dossier principal](DOSSIER_MONTAGES_MATERIEL_POISSONS.md) : décisions, interface, logique de pêche, casse, inventaire, kit et migration.
2. [Profils de poissons](docs/PROFILS_POISSONS.md) : faits sourcés, limites d’identification et comportements proposés.
3. [Catalogues](docs/CATALOGUES_CONTENU.md) : méthodes, recettes, esches, leurres, amorces et familles de matériel.
4. [Données et intégration](docs/FORMAT_DONNEES.md) : schémas, unités et activation.
5. [Sources et limites](docs/SOURCES_ET_LIMITES.md) : références consultées et portée.
6. [Démarrer avec Codex](DEMARRER_AVEC_CODEX.md) : consigne de travail à transmettre à l’agent dans le dépôt.
7. [Relais Codex / Claude](RELAIS_CODEX_CLAUDE.md) : état du travail et points à vérifier lors de l’intégration.

## Ce que contient le dossier

- 62 profils de poissons, dont 3 identités en attente : gobie, sandre doré, silure mandarin.
- 22 méthodes et approches ; 55 recettes de montage.
- 80 entrées d’esches, leurres et amorces.
- 84 familles de matériel ; 274 exemples de tailles/configurations d’équipement.
- 101 correspondances avec les images de poissons fournies ; 27 apparences supplémentaires cataloguées.
- 91 références web, avec leurs limites.

Les **274 équipements sont des exemples de conception**, pas 274 produits commerciaux validés. Le catalogue n’est pas intégralement jouable. Il prépare les interfaces et données, avec des statuts pour le futur. Les valeurs de combat sont des réglages à tester ; les résistances, prix et paramètres de produits sont à compléter avant achat.

## Utilisation

Dézipper ce dossier dans le dépôt du jeu, par exemple sous `docs/dossiers/`. Donner à Codex le contenu de `DEMARRER_AVEC_CODEX.md` en ajustant le chemin s’il le faut. L’agent doit adapter les données aux identifiants et systèmes existants, conserver les sauvegardes et mettre à jour le relais du projet.

Les JSON n’installent aucune dépendance. Les scripts utilisent uniquement Python 3 standard :

```bash
python3 scripts/construire_dossier.py
python3 scripts/valider_dossier.py
```

Ils reconstruisent et vérifient **ce dossier** ; ils ne testent pas l’application de pêche et ne modifient aucune sauvegarde. Les sources TSV sont séparées des fichiers dérivés JSON/Markdown pour permettre les ajouts. Les images et modèles ne sont pas inclus : les chemins désignent les ressources de l’application FishDex fournie.

## Consignes à préserver

**Mouliner par simple appui ; ne jamais réintroduire les cercles.** Orientation de canne simultanée, lancer gestuel sans bouton « Lancer », tension continue et risque de décrochage si mou prolongé. Préserver le jeu solo, l’UI discrète, le pack 3D actuel, les correctifs tactiles et les fonctionnalités déjà réalisées.
