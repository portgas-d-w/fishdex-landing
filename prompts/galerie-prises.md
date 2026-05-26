# Prompts — Galerie mosaïque · Prises de poisson sans visage

## Mise en page de la grille (référence)

```
┌─────────────────────┬──────────────┬────────────────┐
│                     │   CASE 2     │    CASE 3      │
│      CASE 1         │  (3×1) 3:2   │   (4×1) 2:1    │
│     (5×2) 5:4       ├──────────────┼──────────────┬─┤
│    portrait large   │   CASE 4     │    CASE 5    │ │
│                     │  (3×1) 3:2   │   (4×1) 2:1  │ │
├─────────────────────┴──────────────┴──────────────┤ │
│         CASE 6 (4×2) carré ~1:1                   │ │
│                                    CASE 7 (3×2)   │ │
├────────────────────────────────────── portrait ───┤ │
│            CASE 8 (5×1) ultra-large 5:2            │ │
└───────────────────────────────────────────────────┘
```

## Style commun (à inclure dans CHAQUE prompt)

> dark cinematic fishing photography, angler holding a fish, **no face visible** (shot from behind / hands only / torso only / backlit silhouette), moody atmospheric light, golden hour or dusk, dark water reflections, French freshwater fishing, photorealistic, 8K, high detail

---

## CASE 1 — Portrait large · Format 5:4 (ex: 1000×800 px)

*Pêcheur en bateau, silhouette de dos au lever du soleil*

```
dark cinematic fishing photography, angler holding a fish, no face visible, backlit silhouette of a male angler on a small wooden boat, holding up a large pike (brochet) with both hands, misty lake at golden hour dawn, warm amber sunrise reflected on still water, dense forest treeline in background, fog rising from water surface, shot from behind at slight angle, tall portrait composition, moody and atmospheric, photorealistic, 8K --ar 5:4
```

**Nom fichier :** `galerie-prise-01-brochet-bateau-aube.png`

---

## CASE 2 — Paysage · Format 3:2 (ex: 900×600 px)

*Mains tenant une grosse brème, très serré*

```
dark cinematic fishing photography, no face visible, extreme close-up of two hands holding a large bream (brème) fish over dark water, golden hour warm sidelight illuminating the fish's silver-bronze scales, water droplets on fish skin, hands wet from the catch, shallow depth of field, dark moody background, French freshwater fishing, photorealistic, 8K --ar 3:2
```

**Nom fichier :** `galerie-prise-02-breme-mains.png`

---

## CASE 3 — Ultra-large · Format 2:1 (ex: 1200×600 px)

*Pêcheuse de dos au coucher de soleil tenant sa prise*

```
dark cinematic fishing photography, no face visible, female angler seen from behind standing at lake shore, holding a medium-sized fish with both hands at waist level, dramatic golden sunset sky reflected in calm lake, silhouette composition, warm orange and teal tones, very wide cinematic panoramic crop, low camera angle, photorealistic, 8K --ar 2:1
```

**Nom fichier :** `galerie-prise-03-pecheuse-coucher-soleil.png`

---

## CASE 4 — Paysage · Format 3:2 (ex: 900×600 px)

*Vue sous-marine : poisson tenu depuis en dessous, rayons de lumière*

```
dark cinematic underwater photography, looking up from below water surface, large common carp being held by unseen hands just above water surface, sunbeams penetrating from above, dark deep water below, fish scales catching the light, bubbles, teal and dark blue tones, French freshwater lake, photorealistic, 8K --ar 3:2
```

**Nom fichier :** `galerie-prise-04-carpe-sous-marin.png`

---

## CASE 5 — Ultra-large · Format 2:1 (ex: 1200×600 px)

*Pêcheur de dos sous l'orage, ambiance sombre et dramatique*

```
dark cinematic fishing photography, no face visible, male angler standing on riverbank from behind, hunched in rain, holding a large perch (perche) at arm's length, dramatic stormy sky with dark purple-grey clouds, lightning glow on horizon, rain ripples on dark water surface, very dark moody atmosphere, desaturated teal and dark palette, wide cinematic crop, photorealistic, 8K --ar 2:1
```

**Nom fichier :** `galerie-prise-05-pecheur-orage.png`

---

## CASE 6 — Carré · Format 1:1 (ex: 800×800 px)

*Lancer au coucher du soleil, silhouette complète*

```
dark cinematic fishing photography, no face visible, full body silhouette of angler casting a spinning rod at sunset, shot from the side, dramatic backlit composition, warm golden-orange sunset sky, dark water lake in foreground, rod and fishing line visible against bright sky, square composition, photorealistic, 8K --ar 1:1
```

**Nom fichier :** `galerie-prise-06-lancer-silhouette.png`

---

## CASE 7 — Portrait vertical · Format 3:4 (ex: 600×800 px)

*Mains tenant une belle truite, portrait serré vertical*

```
dark cinematic fishing photography, no face visible, close-up vertical portrait of both hands holding a beautiful large brown trout (truite fario) against dark blurred water background, golden light catching the fish's spots and orange-gold flanks, fish still wet and gleaming, hands showing fishing gloves or bare, dark atmospheric mood, tall portrait composition, photorealistic, 8K --ar 3:4
```

**Nom fichier :** `galerie-prise-07-truite-mains-portrait.png`

---

## CASE 8 — Ultra-large horizontal · Format 5:2 (ex: 1500×600 px)

*Surface d'eau au moment du relâcher, bulles et remous*

```
dark cinematic fishing photography, no face visible, ultra wide panoramic shot of dark lake water surface, a large common carp being gently released back into water, only forearms and hands visible at bottom edge of frame, fish half-submerged creating ripples and bubbles, mirror-like golden reflections on water surface, evening light, extremely wide crop, peaceful contemplative atmosphere, photorealistic, 8K --ar 5:2
```

**Nom fichier :** `galerie-prise-08-relacher-carpe-panorama.png`

---

## Conseils de génération

### ChatGPT (DALL-E 3)
- Copier le prompt complet dans ChatGPT avec image generation
- Si le visage apparaît quand même : ajouter *"camera angle from behind, person facing away from camera, face not visible, no portrait"* en début de prompt
- Générer 2-3 variantes par case et choisir la meilleure

### Midjourney
- Ajouter `--style raw` pour éviter le côté trop lisse
- Ajouter `--no face, portrait, frontal` dans les paramètres négatifs
- Chaque `--ar` est déjà indiqué dans le prompt

### Destination
Une fois les images générées :
1. Les renommer selon les noms de fichiers indiqués
2. Les placer dans `public/images/bg/`
3. Mettre à jour `app/page.tsx` dans le tableau `gallery-mosaic` en remplaçant les entrées `src` correspondantes

### Mapping dans le code (app/page.tsx)
```
index 0 → galerie-prise-01-brochet-bateau-aube.png
index 1 → galerie-prise-02-breme-mains.png
index 2 → galerie-prise-03-pecheuse-coucher-soleil.png
index 3 → galerie-prise-04-carpe-sous-marin.png
index 4 → galerie-prise-05-pecheur-orage.png
index 5 → galerie-prise-06-lancer-silhouette.png
index 6 → galerie-prise-07-truite-mains-portrait.png
index 7 → galerie-prise-08-relacher-carpe-panorama.png
```
