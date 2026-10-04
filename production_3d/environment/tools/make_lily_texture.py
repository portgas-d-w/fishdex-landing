"""Texture de feuille de nénuphar (Python 3 + Pillow) : limbe vert, nervures rayonnantes, liseré brun-rouge.

python production_3d/environment/tools/make_lily_texture.py
Sortie : production_3d/environment/textures/prepared/fdx-lily-pad.jpg (256², sRGB). Échancrure orientée vers +u.
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'textures', 'prepared', 'fdx-lily-pad.jpg')
R = random.Random(3); S = 512; c = S / 2
img = Image.new('RGB', (S, S), (74, 98, 46)); d = ImageDraw.Draw(img)
for r in range(int(c), 0, -2):  # dégradé : centre plus clair
    t = r / c; d.ellipse([c - r, c - r, c + r, c + r], fill=(int(70 + 22 * (1 - t)), int(96 + 26 * (1 - t)), int(44 + 10 * (1 - t))))
for i in range(36):  # nervures rayonnantes
    a = 2 * math.pi * i / 36 + R.uniform(-0.03, 0.03)
    if abs(math.atan2(math.sin(a), math.cos(a))) < 0.16:
        continue
    d.line([(c, c), (c + math.cos(a) * c * 0.97, c + math.sin(a) * c * 0.97)], fill=(104, 128, 64), width=3)
for i in range(140):  # taches et usure
    x, y = R.uniform(0, S), R.uniform(0, S); r = R.uniform(2, 7)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(R.randint(58, 92), R.randint(80, 110), R.randint(36, 52)))
d.ellipse([4, 4, S - 4, S - 4], outline=(112, 78, 52), width=10)  # liseré
img = img.filter(ImageFilter.GaussianBlur(1.2)).resize((256, 256), Image.Resampling.LANCZOS)
img.save(OUT, quality=88, optimize=True); print('lily texture', OUT, os.path.getsize(OUT))
