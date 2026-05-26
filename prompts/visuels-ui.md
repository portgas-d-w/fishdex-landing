# Prompts — Visuels UI & sections manquantes

## Style global landing page

L'identité visuelle FishDex utilise :
- Palette sombre : `#071118` (deep), `#0F1C23` (mid), `#8FBFA3` (sage), `#D9C89E` (sand), `#C9A96E` (gold)
- Typographie : Cormorant Garamond (serif élégant) + DM Sans
- Ambiance : nature sauvage, eau, pêche, contemplation — **jamais touristique ou sportif**
- Lumière naturelle dorée, brumeuse, dramatique — **pas de couleurs saturées criardes**
- Formato : paysage 16:9 ou 3:2 pour les backgrounds, portrait 9:16 pour les mockups

---

## 1. Image Hero principale — `hero-background.png`

À utiliser comme fond alternatif pour la section hero si on veut remplacer le SVG animé.

```
Dark atmospheric fishing landscape, cinematic wide angle shot, misty lake at dawn, golden hour light reflecting on still water, silhouette of a fisherman standing on the shore casting a line, dense forest reflections, soft morning fog rising from the water surface, deep dark teal and warm gold color palette, no people visible except distant silhouette, moody contemplative atmosphere, photorealistic, 8K, cinematic lighting, rule of thirds composition, --ar 16:9
```

**Variante avec smartphone FishDex :**
```
A fisherman's hand holding a modern dark-themed smartphone showing a fish identification app interface, blurred background of a misty lake at dawn with golden reflections, shallow depth of field, dark moody color palette (deep teal, warm gold), cinematic photography, product lifestyle photo, --ar 16:9
```

---

## 2. Sessions — Carte GPS de session — `session-map-real.png`

Pour remplacer le SVG de la carte dans la section Sessions.

```
Minimalist dark UI map screenshot showing a fishing session route on a lake, dark background (#0a1f18), the lake outline in deep blue-green (#0d2e38), GPS track dotted line in soft sage green, 3 marker pins with gold dots indicating capture locations, clean typography labels, glassmorphism style card overlaid, dark nature-themed app interface, no grid lines, organic lake shape, top-down aerial view style illustration
```

---

## 3. Sessions — Mockup téléphone avec session active — `session-phone-mockup.png`

```
Realistic smartphone mockup showing a dark fishing app interface, the screen displays an active session with: a timeline on the left side, fish icons with timestamps, weather indicator (12°C, partly cloudy), a lake map thumbnail, session duration counter showing "5h 32min", the phone is slightly tilted at 15 degrees, dark background (#071118), screen glowing softly, no reflections on screen, isolated on dark background, PNG transparent background
```

---

## 4. Premium section — Téléphone montrant la fiche espèce — `premium-phone-species.png`

```
Ultra-realistic smartphone floating on dark background showing a beautiful fish species detail page, the screen shows: large illustrated brown trout image at top, species name "Truite fario" in elegant serif font, star/rarity rating, brief biology text, habitat map, the app uses dark (#0F1C23) background with sage green (#8FBFA3) accents and gold (#D9C89E) typography, phone slightly 3D perspective tilted, cinematic lighting on the device, premium app screenshot, PNG transparent background
```

---

## 5. Community section — Background ambiance communauté — `community-bg.png`

```
Wide angle atmospheric shot of multiple fishermen and fisherwomen gathered at dusk on a lakeshore, warm bonfire light mixing with last golden hour sunlight, people sharing stories, backlit silhouettes, reflection of warm light on dark water, trees framing the scene, sense of community and belonging, dark moody color palette with warm amber accents, cinematic photography style, --ar 21:9
```

---

## 6. FishDex App Icon — Context photo — `app-context-phone.png`

```
Modern smartphone lying on wooden fishing tackle box, screen showing a fish identification app with dark interface, surrounded by fishing accessories (fishing line, hook, natural oak leaves), shallow depth of field, warm golden hour natural light, cozy outdoor fishing atmosphere, still life photography, dark rich wood tones, --ar 4:3
```

---

## 7. Section CTA final — Background eau dramatique — `cta-water-bg.png`

```
Dramatic close-up of dark river water surface at golden hour, abstract light reflections creating rippling golden and teal patterns on black water, no fish visible, pure abstract texture, deep dark background with luminous reflections, ultra wide shot, --ar 21:9, 8K, cinematic color grading
```

---

## 8. Backgrounds supplémentaires pour les cartes Univers

### Aube grise (variante automne) — `background-nature-lac-aube-grise.png`
```
Overcast grey dawn over a still lake surrounded by autumn trees, foggy atmosphere, silver light on flat calm water, bare or turning-yellow trees reflected perfectly, monochromatic cold palette (silver, dark grey, muted olive), melancholic beauty, no sun visible, low cloud ceiling, atmospheric photography, --ar 3:2
```

### Surface eau nuit — `background-aquatique-surface-nuit-reflets.png`
```
Dark water surface at night reflecting a full moon and scattered stars, perfect mirror-like reflection on completely still lake, moonbeam glittering path on black water, no shoreline visible, pure abstract night water texture, deep navy and silver palette, ethereal and mysterious, --ar 3:2
```

---

## 9. Textures de fond

### Texture holographique aqua — `background-texture-eau-holographique-cyan.png`
```
Abstract holographic iridescent water texture, flowing cyan and teal liquid metal, light refractions creating rainbow micro-patterns, dark background, premium luxury material feel, macro photography style, metallic sheen, --ar 1:1
```

---

## Conseils de génération

1. **ChatGPT** (GPT-4o avec DALL-E 3) : coller le prompt directement dans un chat avec image generation activée
2. **Midjourney** : ajouter `--style raw` pour moins de saturation artificielle, `--ar 16:9` ou `--ar 3:2`
3. **Adobe Firefly** : utilise l'option "Photo" pour les ambiances, "Illustration" pour les poissons
4. **Pour les PNG transparents des poissons** : générer d'abord sur fond blanc, puis utiliser remove.bg ou Photoshop IA pour retirer le fond

## Nommage et destination

| Image | Destination |
|-------|-------------|
| `hero-background.png` | `public/images/bg/` |
| `session-map-real.png` | `public/images/mockups/` |
| `session-phone-mockup.png` | `public/images/mockups/` |
| `premium-phone-species.png` | `public/images/mockups/` |
| `community-bg.png` | `public/images/bg/` |
| `app-context-phone.png` | `public/images/mockups/` |
| `cta-water-bg.png` | `public/images/bg/` |
| Poissons manquants | `public/images/fishes/` |
