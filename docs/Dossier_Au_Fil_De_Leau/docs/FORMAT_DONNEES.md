# Format des données et intégration

## Statut de ce dossier

Les JSON sont portables, en UTF-8, sans dépendance au moteur. Ils décrivent un catalogue et des propositions. L’agent les adapte au système actuel plutôt que créer un deuxième stock ou une deuxième logique de combat. Les identifiants sont stables dans ce dossier ; ils ne remplacent pas automatiquement ceux du jeu.

Chaque fichier a une enveloppe avec `schema_version`, `research_date`, `implementation_status`, `numerical_parameters_origin`, `entries` et quelques notes. Une entrée source n’est pas un composant jouable. Le champ de provenance numérique de l’enveloppe est générique : il ne s’applique pas à une date ou à un nom scientifique.

## Fichiers

| Fichier | Contenu | Points essentiels |
|---|---|---|
| sources.json | Références consultées | `id`, `url`, `coverage`, consultation ; limites explicites |
| poissons.json | Profils biologiques et jeu | Taxon, faits, habitat, régime, stade, six attributs proposés, affinités candidates |
| apparences.json | Formes/robes supplémentaires | Parent **candidat**, type et contrôle d’identité ; poids de rareté non fixé |
| correspondances_images.csv | Les 101 chemins fournis | Parent candidat, type, statut et empreinte d’audit ; aucune image embarquée |
| methodes.json | Méthodes et approches | Famille, types de canne, composants centraux et contexte requis |
| montages.json | Recettes | Méthodes admises, slots, principe sourcé, adaptation de jeu et overrides |
| appats_leurres_amorces.json | Esches, artificiels, amorçage | Présentation, régime imité, consommation, affinités à tester |
| familles_materiel.json | Familles de composants | Emplacement, méthodes candidates, comportement et dimension de variantes |
| equipements.json | 274 références de conception | Une variante par ID ; tailles d’exemple, propriétés exactes encore manquantes |
| slots.json | Emplacements | Traductions UI des IDs techniques |
| kit_gratuit.json | Kit de secours | Gratuit renouvelable ; non revendable ; pas d’objets payants dupliqués |
| graphe_montage_exemples.json | Cas de casse | Attaches, branches et résultats conditionnels attendus |
| regimes_et_imitation.json | Pont entre tags biologiques et appâts | Une plausibilité alimentaire ne donne pas une probabilité de capture |
| manifest.json | Comptages | Inventaire du dossier, pas du jeu déployé |

## Ce que signifie une valeur

`biological_facts` résume la source indiquée, avec ses limites. `attributes`, `combat_proposal`, `candidate_bait_affinities` et `game_proposal` sont de la conception. Les tags de présentation d’un appât sont candidats : un produit exact et son état peuvent modifier sa densité.

`candidate_bait_affinities.affinity = 0.65` est un **prior uniforme de prototypage**, utilisé seulement pour signaler une compatibilité proposée. Ce n’est pas « 65 % de chances de mordre », ni une valeur préférentielle mesurée. L’agent peut remplacer cette liste par des règles de présentation et des affinités plus détaillées, en conservant leur provenance.

Les résistances, forces de frein et plages de lancer inconnues sont `null`. Cela signifie **non renseigné**, jamais zéro, résistance infinie ou compatibilité garantie. Une référence ne devient pas achetable tant que ces paramètres nécessaires à son usage ne sont pas définis et testés. Les prix sont également `null`, à définir en monnaie du jeu.

Les tailles de moulinet sont des codes d’exemple : « 3000 » ne dit pas la force du frein, la capacité ou la récupération. Les numéros d’hameçon ne sont pas des dimensions universelles : ajouter ouverture/hampe réelles lorsque le modèle est spécifié. Le diamètre du fil ne détermine pas à lui seul une charge de rupture. Les densités et courbes d’action doivent provenir d’un modèle déclaré ou être marquées comme approximation.

## Résolution des emplacements

`methodes.required_slots` décrit une **disposition par défaut**, pas une obligation cumulée de toutes les recettes. Le résolveur prend `methodes.core_slots` puis les slots de la recette. `montages.method_slot_overrides` remplace les slots de recette lorsqu’une méthode exige une autre structure.

Exemple : un pellet waggler préplombé n’impose pas une plombée externe parce que le défaut anglaise mentionne `weight`. Un leurre dur n’ajoute pas un hameçon séparé si son armement est intégré. Une tête plombée ne facture pas encore un hameçon. Une nymphe au fil ne force pas backing + soie du montage mouche classique. Les accessoires optionnels ne doivent pas faire disparaître la cohérence de la recette.

En pratique :

1. Choisir la canne et vérifier sa compatibilité mécanique avec la méthode.
2. Résoudre la recette active et les composants obligatoires réels.
3. Vérifier connexions, tailles, masse complète au lancer et stock.
4. Calculer les paramètres physiques à partir des objets/segments effectivement assemblés.
5. Afficher les repères correspondant à cet ensemble uniquement.

Les compatibilités des familles sont larges et **candidates** : la variante précise décide ensuite si sa plage de lancer, sa taille et son système permettent l’usage. Une canne casting ne reçoit pas un moulinet spinning parce que tous deux mentionnent « leurre ».

## Stock et montages

`inventory_unit` d’un équipement est `piece` ou `meter`. Le fil en réserve, le fil sur moulinet, la portion engagée et la portion perdue sont distincts. Les paquets contiennent un nombre/une longueur explicite. Ne pas retirer un paquet entier pour un hameçon perdu.

Les appâts ont une règle de consommation, mais aucune quantité de départ n’est inventée ici. Une esche montée peut tenir plusieurs instants/actions : débit à la mise en service ou au remplacement selon le système, jamais automatiquement à chaque frame. Définir la tenue et consommation de la portion. L’amorce consommée au lancer et la portion déjà distribuée sont irréversibles ; une préparation annulée ne les consomme pas.

Une configuration en préparation, un montage actif et un preset sont trois objets distincts. Un preset ne possède rien. Un montage actif réserve ses composants et porte un graphe des segments, connexions et attaches. Une modification ne change pas les statistiques du combat en cours.

Une perte est un événement avec ID unique, résultats et transaction de stock. Une seconde résolution du même ID n’applique rien une deuxième fois. Les pièces gratuites du kit sont des sources virtuelles non revendables ; les éléments payants ont un stock réel même s’ils sont assemblés au kit.

## États indépendants

Le dossier initialise `playable: false` / `purchase_enabled: false`. **Ne pas appliquer ces valeurs comme une désactivation globale du contenu existant.** C’est un état prudent du catalogue externe avant réconciliation. L’agent doit garder ce qui fonctionne et promouvoir les correspondances vérifiées.

Conserver distincts : présent au catalogue, mécanique implémentée, disponible dans un lieu, débloqué par progression, possédé, équipé. Les comptes de complétion du FishDex utilisent le contenu actuellement accessible. Un futur équipement peut avoir sa fiche détaillée et son emplacement dans la boutique sans être acheté inutilement.

Les méthodes `needs_research` et taxons `identity_pending` ne s’activent pas par simple passage de booléen. Il faut résoudre leurs données et systèmes. Les poissons `observation` nécessitent une vraie mécanique de découverte si l’objectif devient réalisable ; un simple portrait dans le menu ne compte pas comme découverte.

## Reconstruction et validation

Les TSV de recherche utilisent un séparateur `|`, sans `|` à l’intérieur des valeurs. Les listes internes sont séparées par des virgules. Pour ajouter un poisson, renseigner taxon, fait résumé et source, puis proposer le gameplay explicitement. Pour ajouter une famille de matériel, compléter la section `FAMILIES_TEXT` du script ; elle est la source des variantes générées.

`images_fishdex.json` conserve uniquement les chemins, groupes et empreintes de l’inventaire reçu. Il permet de reconstruire les correspondances sans disposer des PNG. Pour ajouter des images, étendre ce manifeste et le mapping du script après contrôle d’identité.

```bash
python3 scripts/construire_dossier.py
python3 scripts/valider_dossier.py
```

Ces commandes valident les références internes, bornes, états et comptages. Le jeu demande ensuite ses propres tests de montage, physique, stock, sauvegarde, gestuelle et rendu.
