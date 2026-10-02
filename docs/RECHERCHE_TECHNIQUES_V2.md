# Compléments techniques V2 — 2 octobre 2026

Les identifiants du dossier fourni sont conservés dans `techniques-data.json`,
`recipes-data.json` et `baits-data.json`. Les quatre identifiants historiques
`pole`, `float`, `bottom`, `lure` restent les familles des anciennes captures.
Les nouvelles captures ajoutent `technique` et `recipe` ; aucune ancienne prise
n'est réattribuée à une technique que le carnet ne connaissait pas.

## Sources consultées et portée de l'adaptation

| Source directe | Principe retenu dans le prototype | Limite |
| --- | --- | --- |
| [IFI — méthodes truite](https://fishinginireland.info/trout/trmethods/) | Sèche en surface, noyée immergée, nymphe aquatique ; soie et présentation distinctes. | Ce texte ne fournit pas de probabilité de capture ni de simulation détaillée du lancer. Les espèces actuelles compatibles remplacent la truite absente des modèles livrés. |
| [Caperlan — toc](https://conseilsport.decathlon.fr/comment-bien-debuter-la-peche-au-toc) | Plombée adaptée au courant, moulinet comme réserve, dérive accompagnée. | Courant, masses et sensibilité sont des unités configurées de jeu. |
| [Fédération 06 — toc](https://www.peche06.fr/4547-la-peche-au-toc.htm) | Contact du fil, indicateur et arrêt de dérive ; ferrage bref après prise. | La vibration est représentée visuellement et par son optionnel ; sensation tactile non mesurée. |
| [Caperlan — bombette](https://www.decathlon.fr/c/htc/comment-choisir-sa-bombette_f1c4b6db-1c43-4e78-87c8-1d7021ca862f) | Corps porteur, masse de lancer et flottabilité séparée de l'esche. | Deux variantes de jeu ; aucune reproduction d'un produit commercial précis. |
| [VMC — Texas](https://www.rapala.com/us_en/trk-texas-rig-kit) | Lest, hameçon et leurre souple distincts. | Protection réduisant les accrochages, jamais immunité aux obstacles. |
| [VMC — Neko](https://blog.rapala.com/vmc/vmc-neko-rigs-trigger-bass-bites-when-nothing-else-will/) | Insert de lest à une extrémité, chute orientée et petites animations. | L'effet du lest est une proposition physique ; aucune garantie d'efficacité biologique. |
| [Drennan — hélicoptère feeder](https://www.drennantackle.com/products/tackle/bits-and-pieces/helicopter-rigs-kits/) | Rotation du terminal et diminution des emmêlements ; fixation distincte du feeder. | Le graphe de pertes représente les attaches du prototype, pas toutes les variantes réelles de sécurité. |
| [Drennan — feeder semi-fixe](https://www.drennantackle.com/products/feeders/bolt-rig-feeder/) | Masse du feeder et contact pouvant produire un ferrage mécanique. | Le prototype exige une masse terminale suffisante et du contact ; aucun ferrage automatique universel. |
| [Preston — guide matériel](https://www.prestoninnovations.com/globalassets/blocks---preston/articles/93010-preston-gear-guide-2022-uk-sterling.pdf) | Feeder garni, placement de l'esche et amortissement intégré ; liaison élastique dans le graphe. | Le système retenu est une adaptation de jeu ; ne pas présenter ce montage comme conseil de sécurité pour un montage réel. |
| [Korda — surface](https://kordatackle.com/knowledge/fishing-for-carp-on-the-surface) et [contrôleur](https://kordatackle.com/products/interceptor-controller-float) | Esche flottante, inspection avant prise, contrôleur distinct du terminal. | Une carpe représentée peut prendre en surface avec une esche pertinente ; cette possibilité ne s'étend pas à tous les poissons de fond. |
| [Korda — montages combinés](https://kordatackle.com/knowledge/what-are-combi-rigs-and-how-to-use-them) et [guide montages](https://kordatackle.com/knowledge/a-guide-to-the-best-carp-rigs) | Sections distinctes, cheveu, pop-up et présentation remise en place après refus. | Pas de bonus caché de maîtrise ou de capture. Géométrie et risques restent ceux du moteur. |
| [Europeche — mort manié](https://www.europeche.fr/fiches-conseils/peche-au-poisson-mort-manie-tout-est-dans-lanimation.html) | Monture, tirées, relâchés et pauses ; poisson-appât consommé par ligne utilisée. | Article de conseil commercial ; les vitesses du jeu ne sont pas des mesures réelles. |
| [Alpes Fishing — gambe](https://alpes-fishing.fr/comment-monter-une-gambe-a-coregone-lavaret-fera/) | Potences espacées, imitations en couches distinctes et lest terminal. | Trois potences choisies pour la lisibilité. Ce nombre n'est pas une indication réglementaire. Corégone absent : chaîne complète vérifiée avec la perche existante compatible. Une seule prise simulée et récompensée à la fois. |
| [Fédération 79 — silure](https://peche-en-deux-sevres.com/wp-content/uploads/Le-silure.pdf) | Sollicitation sonore brève en embarcation et présentation verticale ; réaction éventuelle. | Pause de 25 s et fenêtre d'attraction de 8 s : configuration de prototype, aucune réaction garantie. |
| [Rapala — leurre de traîne](https://www.rapala.fr/eu_fr/gold-miner) | La vitesse de l'embarcation anime le leurre et contribue à sa profondeur. | Exemple de produit, pas loi universelle. Le bateau du jeu suit un parcours borné et contrôlable. |
| [Garbolino — catalogue coup](https://garbolino.fr/catalogues/2017/coup/GARBO_COUP_2017_web.pdf) | Grande canne, contrôle de ligne et matériel spécialisé. | Déboîtement progressif sous tension dans le prototype ; ergonomie à tester au toucher. |

## Paramètres et limites

Les chiffres de `TECHNIQUE_CONFIG`, `recipeMechanics`, des composants de secours,
des populations et des postes sont des hypothèses de jeu versionnées. Les sources
confirment les principes ; elles ne valident pas ces valeurs. Les 274 exemples
commerciaux du dossier conservent leurs fiches de conception et leurs paramètres
inconnus : ils ne deviennent pas 274 produits physiques inventés. Les composants
jouables du prototype couvrent les emplacements des 55 recettes, avec variantes
de secours et payantes explicitement configurées.

La validation automatisée d'une capture ne prouve pas l'équilibre économique,
le réalisme exhaustif, la fluidité sur téléphone ni l'agrément du geste.
L'interface et les animations procédurales doivent être contrôlées séparément.
