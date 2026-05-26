# Dossier Prompts — FishDex Landing

Ce dossier contient les prompts ChatGPT/Midjourney pour générer les images manquantes.

## Fichiers

| Fichier | Contenu |
|---------|---------|
| `poissons-manquants.md` | 17 espèces de poissons à illustrer pour atteindre les 92 totales |
| `visuels-ui.md` | Fonds, mockups téléphone, visuels pour les sections Hero, Sessions, Premium, Community |

## État actuel des assets

- **Poissons illustrés** : 75 / 92 → **17 manquants**
- **Backgrounds nature** : ✅ complets (lever soleil, orage, coucher soleil, nuit)
- **Photos ambiance** : ✅ 11 photos disponibles
- **Mockups UI** : ✅ disponibles dans `public/images/mockups/`
- **Hero background** : SVG animé — remplaçable par vraie photo si souhaité
- **Sessions mockup téléphone** : à générer
- **Premium mockup téléphone** : à générer

## Workflow recommandé

1. Ouvrir ChatGPT avec GPT-4o + image generation
2. Copier-coller le prompt du fichier concerné
3. Télécharger l'image générée
4. La renommer selon les conventions kebab-case indiquées
5. La placer dans `public/images/fishes/` ou `public/images/bg/` ou `public/images/mockups/`
6. Pour les poissons : vérifier que le fond est transparent (PNG) sinon passer par remove.bg
