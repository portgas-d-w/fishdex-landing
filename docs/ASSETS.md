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
