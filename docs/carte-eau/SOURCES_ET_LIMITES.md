# Sources techniques et limites

**État d’implémentation du 3 octobre 2026 :** les paragraphes ci-dessous proviennent du dossier de conception initial. La carte, les shaders et les captures sont maintenant réalisés et contrôlés dans ce dépôt ; voir `LIVRAISON.md`, `PERFORMANCES.md` et `PUBLICATION.md` pour les résultats réels. Les GLB/Blender finaux, lightmaps, LOD exportés et essais physiques iPhone/Android restent à faire.

Consultées le 3 octobre 2026. Les dimensions de carte, budgets d’assets, profils de rendu, événements et objectifs de performance sont des décisions de conception. Les références documentent les possibilités et conventions des outils, pas une garantie de fluidité.

- Babylon.js, Water Material : https://github.com/BabylonJS/Documentation/blob/master/content/toolsAndResources/assetLibraries/materialsLibrary/waterMat.md — matériau de base, texture de perturbation et liste de rendu réflexion/réfraction. Le système d’événements de ce dossier est à développer dans le jeu.
- Babylon.js, Thin Instances : https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/mesh/copies/thinInstances.md — instanciation et gestion par buffers ; vérifier les limites de regroupement et de contrôle avec la version du dépôt.
- Babylon.js, glTF loader : https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/importers/glTF.md — formats/extensions de compression, décodeurs et conversion de coordonnées. Les dépendances exactes doivent suivre la version du jeu.
- KhronosGroup, documentation du glTF Blender IO : https://github.com/KhronosGroup/glTF-Blender-IO/blob/main/docs/blender_docs/scene_gltf2.rst — matériaux PBR, normales tangent +Y, canaux roughness/metallic/occlusion, export de maillages et animations. Les possibilités de certains extensions ne sont pas universelles.

Le rendu visé n’a pas été testé ici dans le dépôt ou sur iPhone. Les objets, shaders, captures, GLB et sources Blender restent à produire par les tâches correspondantes. Le dossier fournit la conception, la liste de production et les critères de contrôle.
