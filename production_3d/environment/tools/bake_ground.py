"""Cuisson du sol de l'Étang des Saules : macro-couleur + texture de détail tuilée.

node --experimental-strip-types production_3d/environment/tools/ground-fields.mts
python production_3d/environment/tools/bake_ground.py

Remplace l'ancien atlas où chaque matière, répétée en tuiles de ~18 px, se moyennait en beige.
- public/map-assets/ground-macro.jpg (1024², sRGB) : couleurs naturelles par zone (prairie variée, terre de berge,
  vase humide à la ligne d'eau, sentiers derrière les postes, graviers P03/P05, prairie humide P02/P04,
  sédiment visible sous l'eau peu profonde). Ligne 0 = z=-31, à charger avec invertY=false.
- public/map-assets/ground-detail.png (512², linéaire, gris+alpha) : canal R = détail d'albédo (0,5 neutre)
  pour StandardMaterial.detailMap, tuilé tous les 3 m ; pas de normale de détail sur mobile.
Sources CC0 : leafy_grass, forest_ground_04 (Poly Haven).
"""
import json, os
import numpy as np
from PIL import Image, ImageFilter

TOOLS = os.path.dirname(os.path.abspath(__file__)); ENV = os.path.dirname(TOOLS); ROOT = os.path.dirname(os.path.dirname(ENV))
FIELDS = os.path.join(ENV, 'textures', 'fields'); SRC = os.path.join(ENV, 'textures', 'source')
OUT = os.path.join(ROOT, 'public', 'map-assets')
rng = np.random.default_rng(127)


def fbm(h, w, octaves, base, persistence=0.55):
    acc = np.zeros((h, w), np.float32); amp = 1.0; total = 0.0
    for o in range(octaves):
        cells = (max(2, int(base * 2 ** o * h / w)), max(2, int(base * 2 ** o)))
        grid = rng.random(cells).astype(np.float32)
        layer = np.asarray(Image.fromarray(grid).resize((w, h), Image.Resampling.BICUBIC), np.float32)
        acc += layer * amp; total += amp; amp *= persistence
    acc /= total
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def mix(a, b, t):
    return a * (1 - t[..., None]) + b * t[..., None]


def col(hexs):
    return np.array([int(hexs[i:i + 2], 16) for i in (1, 3, 5)], np.float32)


def macro():
    meta = json.load(open(os.path.join(FIELDS, 'ground-fields.json')))
    w, h = meta['width'], meta['height']
    f = np.fromfile(os.path.join(FIELDS, 'ground-fields.f32'), np.float32).reshape(h, w, 7)
    inside, depth, shore, height, trail, stand, gravel = (f[..., k] for k in range(7))
    n1 = fbm(h, w, 5, 6); n2 = fbm(h, w, 4, 18); n3 = fbm(h, w, 3, 40)
    G = lambda s: np.broadcast_to(col(s), (h, w, 3))
    grass = mix(G('#5f6d3b'), G('#73804a'), smooth(0.3, 0.7, n1))
    grass = mix(grass, G('#878452'), smooth(0.62, 0.85, n2) * 0.55)          # touffes sèches
    grass = mix(grass, G('#4e5d35'), smooth(0.55, 0.85, n3) * 0.35)          # ombres d'herbes hautes
    earth = mix(G('#6c5a41'), G('#5d4c37'), n2)
    bank = smooth(3.2, 0.4, shore) * (0.55 + 0.45 * n2)
    land = mix(grass, earth, np.clip(bank, 0, 1) * 0.9)
    land = mix(land, G('#463b2d'), smooth(1.0, 0.0, shore) * 0.85)           # vase humide au contact
    marsh = np.clip(-gravel, 0, 1); grav = np.clip(gravel, 0, 1)
    land = mix(land, G('#5b6339'), marsh * smooth(6, 1.5, shore) * 0.7)       # prairie humide (anse, roseaux)
    land = mix(land, G('#857b68'), grav * smooth(0.35, 0.7, n3) * 0.75)       # graviers (rive ouverte, pointe)
    land = mix(land, G('#7a6850'), np.clip(trail, 0, 1) * (0.7 + 0.3 * n3))   # sentiers tassés
    land = mix(land, G('#6e604a'), np.clip(stand, 0, 1) * 0.55)               # poste piétiné
    water = mix(G('#5b553b'), G('#3f4231'), smooth(0.2, 3.0, depth))
    water = mix(water, G('#4a4030'), smooth(1.4, 0.0, shore) * 0.6)
    out = np.where(inside[..., None] > 0.5, water, land)
    out *= (0.95 + 0.1 * fbm(h, w, 2, 160))[..., None]
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).resize((1024, 1024), Image.Resampling.LANCZOS)
    img.save(os.path.join(OUT, 'ground-macro.jpg'), quality=88, optimize=True)


def tileable_highpass(path, size, radius):
    im = Image.open(path).convert('L').resize((size, size), Image.Resampling.LANCZOS)
    big = Image.new('L', (size * 3, size * 3))
    for y in range(3):
        for x in range(3):
            big.paste(im, (x * size, y * size))
    blur = big.filter(ImageFilter.GaussianBlur(radius)).crop((size, size, 2 * size, 2 * size))
    a = np.asarray(im, np.float32) - np.asarray(blur, np.float32)
    return a / (np.abs(a).mean() * 2.5 + 1e-6)


def detail():
    s = 512
    g = tileable_highpass(os.path.join(SRC, 'leafy_grass-color.jpg'), s, 18)
    e = tileable_highpass(os.path.join(SRC, 'forest_ground_04-color.jpg'), s, 18)
    d = 0.5 + 0.11 * (0.62 * g + 0.38 * e)
    # PNG niveaux de gris + alpha 0,5 : Babylon lit la normale de détail dans .wy ; avec alpha=0,5 et
    # bumpLevel=0 elle reste verticale (un JPEG sans alpha donne une normale nulle, donc un sol blanc).
    r = (np.clip(d, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(np.stack([r, np.full_like(r, 128)], -1), 'LA').save(os.path.join(OUT, 'ground-detail.png'), optimize=True)


if __name__ == '__main__':
    for n in ('leafy_grass-color.jpg', 'forest_ground_04-color.jpg'):
        if not os.path.exists(os.path.join(SRC, n)):
            import shutil
            shutil.copy2(os.path.normpath(os.path.join(ROOT, '..', '..', '..', 'assets-source', 'free-map-01', n)), os.path.join(SRC, n))
    macro(); detail()
    print('ground', os.path.getsize(os.path.join(OUT, 'ground-macro.jpg')), os.path.getsize(os.path.join(OUT, 'ground-detail.png')))
