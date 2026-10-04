"""Atlas de feuillage procédural (Python 3 + Pillow), alpha-mask, 1024² en 2×2 cellules de 512 px.

python production_3d/environment/tools/make_foliage_atlas.py [--seed 7]
Cellules (u, v depuis le haut) :
  (0,0) aulne : rameau, feuilles obovales arrondies vert sombre ;
  (1,0) chêne : feuilles lobées vert moyen, plus espacées ;
  (0,1) saule : rameaux retombants, feuilles lancéolées vert-gris (lecture verticale) ;
  (1,1) masse dense générique pour LOD1 et intérieur des houppiers.
Les pixels transparents reçoivent la couleur moyenne voisine (pas de liseré sombre avec les mipmaps).
Aucune ressource externe : formes dessinées, graine fixe.
"""
import math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

TOOLS = os.path.dirname(os.path.abspath(__file__)); ENV = os.path.dirname(TOOLS)
OUT = os.path.join(ENV, 'textures', 'prepared', 'fdx-foliage-atlas.png')
SEED = int(sys.argv[sys.argv.index('--seed') + 1]) if '--seed' in sys.argv else 7
R = random.Random(SEED); SS = 2; CELL = 512 * SS


def hsv(h, s, v):
    import colorsys
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return int(r * 255), int(g * 255), int(b * 255)


def leaf_poly(cx, cy, length, width, angle, kind):
    pts = []
    n = 14
    for i in range(n + 1):
        t = i / n
        if kind == 'obovate':
            w = width * math.sin(math.pi * t) * (0.55 + 0.6 * t) * (1 - 0.15 * t)
        elif kind == 'lanceolate':
            w = width * math.sin(math.pi * t) ** 0.8 * (1 - 0.3 * t)
        else:  # lobed
            w = width * math.sin(math.pi * t) * (0.75 + 0.35 * math.sin(t * math.pi * 5) ** 2)
        pts.append((t * length, w))
    outline = pts + [(x, -y) for x, y in reversed(pts)]
    ca, sa = math.cos(angle), math.sin(angle)
    return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in outline]


def draw_leaf(d, cx, cy, length, width, angle, kind, base):
    h, s, v = base
    col = hsv(h + R.uniform(-0.02, 0.02), s * R.uniform(0.85, 1.1), v * R.uniform(0.78, 1.12))
    d.polygon(leaf_poly(cx, cy, length, width, angle, kind), fill=col + (255,))
    vein = tuple(min(255, int(c * 1.18)) for c in col)
    d.line([(cx, cy), (cx + math.cos(angle) * length * 0.85, cy + math.sin(angle) * length * 0.85)], fill=vein + (255,), width=max(1, SS))


def twig_cell(kind, base, count, leaf_len, leaf_w, spread=1.0):
    img = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx, cy = CELL / 2, CELL / 2
    stems = []
    for b in range(5):  # rameau principal + secondaires
        a0 = -math.pi / 2 + R.uniform(-1.1, 1.1) * spread
        x, y = cx + R.uniform(-60, 60) * SS, CELL * 0.92
        pts = [(x, y)]
        for k in range(8):
            a0 += R.uniform(-0.25, 0.25)
            x += math.cos(a0) * CELL * 0.1; y += math.sin(a0) * CELL * 0.1
            pts.append((x, y))
        stems.append(pts)
        d.line(pts, fill=(78, 64, 46, 255), width=3 * SS)
    for i in range(count):
        st = R.choice(stems); k = R.randrange(2, len(st)); (x0, y0), (x1, y1) = st[k - 1], st[k]
        t = R.random(); x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        ang = math.atan2(y1 - y0, x1 - x0) + R.choice((-1, 1)) * R.uniform(0.5, 1.3)
        draw_leaf(d, x, y, leaf_len * SS * R.uniform(0.75, 1.15), leaf_w * SS * R.uniform(0.8, 1.15), ang, kind, base)
    return img


def willow_cell(base):
    img = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    for s in range(12):
        x = CELL * (0.08 + 0.84 * s / 8) + R.uniform(-20, 20) * SS; y = 0.0
        pts = [(x, y)]
        while y < CELL * R.uniform(0.82, 0.98):
            x += R.uniform(-6, 6) * SS; y += CELL * 0.06; pts.append((x, y))
        d.line(pts, fill=(96, 92, 60, 255), width=2 * SS)
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            for k in range(4):
                t = R.random(); px, py = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                ang = math.pi / 2 + R.choice((-1, 1)) * R.uniform(0.25, 0.7)
                draw_leaf(d, px, py, 34 * SS * R.uniform(0.8, 1.2), 4.5 * SS, ang, 'lanceolate', base)
    return img


def dense_cell(base):
    img = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    for i in range(900):
        r = CELL * 0.46 * math.sqrt(R.random()); a = R.uniform(0, 2 * math.pi)
        x, y = CELL / 2 + math.cos(a) * r, CELL / 2 + math.sin(a) * r * 0.9
        shade = 0.72 + 0.4 * (1 - r / (CELL * 0.46)) * 0.5 + 0.25 * (CELL / 2 - y) / CELL
        h, s, v = base
        draw_leaf(d, x, y, 26 * SS, 11 * SS, R.uniform(0, 2 * math.pi), 'obovate', (h, s, v * shade))
    return img


def bleed(img):
    a = np.asarray(img).astype(np.float32); alpha = a[..., 3:4] / 255
    rgb = a[..., :3] * alpha
    acc = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(12))
    w = Image.fromarray((alpha[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(12))
    accn = np.asarray(acc, np.float32); wn = np.asarray(w, np.float32)[..., None] / 255 + 1e-4
    fill = np.clip(accn / wn, 0, 255)
    out = a.copy(); out[..., :3] = np.where(alpha > 0.5, a[..., :3], fill)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def main():
    cells = [twig_cell('obovate', (0.27, 0.52, 0.42), 340, 30, 15),
             twig_cell('lobed', (0.24, 0.5, 0.5), 280, 36, 13, spread=1.2),
             willow_cell((0.22, 0.32, 0.6)),
             dense_cell((0.26, 0.5, 0.42))]
    atlas = Image.new('RGBA', (CELL * 2, CELL * 2), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        atlas.paste(c, ((i % 2) * CELL, (i // 2) * CELL))
    atlas = atlas.resize((1024, 1024), Image.Resampling.LANCZOS)
    a = np.asarray(atlas).copy(); a[..., 3] = np.where(a[..., 3] > 110, 255, 0); atlas = bleed(Image.fromarray(a, 'RGBA'))
    atlas = atlas.quantize(colors=255, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)  # PNG8 + alpha
    atlas.save(OUT, optimize=True)
    print('foliage', OUT, os.path.getsize(OUT))


if __name__ == '__main__':
    main()
