# Ressources du projet

## Pack de poissons

Source : **River fish**, auteur **TricksUp**.
Fiche fournie par le propriétaire :
https://www.fab.com/listings/f48dca2b-434c-4f23-b2e5-c70261d85585

Archive fournie : `riverfishpack.zip`, conservée dans `assets-source/`.
Contenu constaté : 50 FBX, textures PNG 1024² embarquées, un fichier Fish_info.txt.
448 à 790 triangles par modèle, pas de squelette ni d’animation dans ces FBX.

## Préparation réalisée

Conversion locale avec Blender 4.5.3 LTS et `scripts/convert_fish.py`.
Cinq modèles : Roach, EuropeanPerch, CommonCarp, NorthernPike, Zander.
Modèles centrés, longueur de présentation normalisée à 2 unités ; cette longueur
est destinée à l’aperçu et n’est pas leur taille biologique.
Textures réduites à 512² et embarquées dans les GLB. Matériau simple sans métal.
Les FBX et leurs textures originales ne sont jamais écrasés.

Reproduire depuis la racine du projet, avec Blender installé :

```sh
blender --background --python scripts/convert_fish.py
```

Sur Windows, l’agent peut invoquer le chemin complet du Blender installé.
`public/models/manifest.json` conserve les triangles et tailles réelles des exports.
Les GLB sont livrés : aucune reconversion nécessaire pour jouer.

## Utilisation

Les assets ne deviennent pas libres de droits par cette conversion. Conserver la
preuve d’achat et les termes associés au pack. Ne pas publier l’archive brute,
ne pas proposer de téléchargement autonome du pack, ne pas envoyer les modèles ou
textures à un service génératif. Le projet privé est destiné à son propriétaire.

## Autres ressources

Paysage, eau, favicon et icônes : géométrie/code procédural ou SVG du projet.
Sons : synthèse locale. Polices : polices système, aucune dépendance à un CDN de fontes.
Tripo n’est pas nécessaire à ce prototype ; conserver son usage pour les objets
qui apporteraient un bénéfice identifié (canne, cabane, accessoires) après validation du style.

## Extension du 1 octobre 2026 — état actuel

Les informations de préparation ci-dessus décrivent la livraison initiale. La version 0.2 contient quinze modèles, reconvertis avec Blender 5.1.2 puis optimisés en JPEG embarqué 512², 1 731 232 octets au total. L’inventaire des 50 FBX, les associations biologiques, l’atlas et les limites de nage procédurale se trouvent dans ASSETS_POISSONS.md et PACK_INVENTAIRE.json.

88 illustrations statiques réutilisées depuis les fichiers FishDex, optimisées en WebP ; provenance contrôlée, aucun contenu utilisateur ni secret copié. Archive source toujours privée, jamais ajoutée au dépôt ou au déploiement. Les ressources GLB nécessaires au rendu du jeu sont servies publiquement ; elles ne constituent pas une redistribution autonome du pack original.
