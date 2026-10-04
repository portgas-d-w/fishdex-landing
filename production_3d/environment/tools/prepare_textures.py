"""Prépare les textures runtime à partir des sources CC0 Poly Haven (Python 3 + Pillow, hors Blender).

python production_3d/environment/tools/prepare_textures.py
Sources : production_3d/environment/textures/source/ (copiées depuis assets-source/free-map-01 si absentes,
chemin modifiable par FDX_ASSET_SOURCE). Sortie : production_3d/environment/textures/prepared/.
Base color en sRGB (JPEG), normal map OpenGL linéaire (JPEG q92, accepté par glTF 2.0).
"""
import hashlib, json, os, shutil
from PIL import Image, ImageEnhance, ImageFilter, ImageChops

TOOLS = os.path.dirname(os.path.abspath(__file__)); ENV = os.path.dirname(TOOLS)
SRC = os.path.join(ENV, 'textures', 'source'); OUT = os.path.join(ENV, 'textures', 'prepared')
os.makedirs(SRC, exist_ok=True); os.makedirs(OUT, exist_ok=True)
ORIGIN = os.environ.get('FDX_ASSET_SOURCE', os.path.normpath(os.path.join(ENV, '..', '..', '..', '..', '..', 'assets-source', 'free-map-01')))
if not os.path.isdir(ORIGIN):
    ORIGIN = os.path.normpath(os.path.join(ENV, '..', '..', 'assets-source', 'free-map-01'))

PROVENANCE = {
    'wood_planks_dirt': ('Rob Tuytel', 'https://polyhaven.com/a/wood_planks_dirt'),
    'bark_willow_02': ('Charlotte Baglioni', 'https://polyhaven.com/a/bark_willow_02'),
    'brown_mud_02': ('Rob Tuytel', 'https://polyhaven.com/a/brown_mud_02'),
    'forest_ground_04': ('Rob Tuytel, Rico Cilliers', 'https://polyhaven.com/a/forest_ground_04'),
    'leafy_grass': ('Charlotte Baglioni', 'https://polyhaven.com/a/leafy_grass'),
    'pebble_ground_01': ('Rob Tuytel', 'https://polyhaven.com/a/pebble_ground_01'),
}


def source(name):
    path = os.path.join(SRC, name)
    if not os.path.exists(path):
        shutil.copy2(os.path.join(ORIGIN, name), path)
    return path


def color(slug, size, out, saturation=1.0, brightness=1.0, quality=86):
    im = Image.open(source(f'{slug}-color.jpg')).convert('RGB').resize((size, size), Image.Resampling.LANCZOS)
    im = ImageEnhance.Color(im).enhance(saturation); im = ImageEnhance.Brightness(im).enhance(brightness)
    im.save(os.path.join(OUT, out), quality=quality, optimize=True, progressive=False)


def normal(slug, size, out, quality=92):
    im = Image.open(source(f'{slug}-normal.png')).convert('RGB').resize((size, size), Image.Resampling.LANCZOS)
    im.save(os.path.join(OUT, out), quality=quality, optimize=True)


def main():
    color('wood_planks_dirt', 1024, 'fdx-wood-weathered-color.jpg', saturation=0.8, brightness=1.04)
    normal('wood_planks_dirt', 512, 'fdx-wood-weathered-normal.jpg')
    color('brown_mud_02', 512, 'fdx-bank-mud-color.jpg', saturation=0.9)
    normal('brown_mud_02', 512, 'fdx-bank-mud-normal.jpg')
    color('bark_willow_02', 512, 'fdx-bark-color.jpg', saturation=0.85)
    normal('bark_willow_02', 512, 'fdx-bark-normal.jpg')
    records = []
    for f in sorted(os.listdir(SRC)):
        if f.endswith(('.jpg', '.png')):
            slug = f.rsplit('-', 1)[0]; author, url = PROVENANCE.get(slug, ('?', '?'))
            p = os.path.join(SRC, f)
            records.append({'file': f, 'bytes': os.path.getsize(p), 'sha256': hashlib.sha256(open(p, 'rb').read()).hexdigest(),
                            'author': author, 'page': url, 'license': 'CC0 1.0', 'licenseSource': 'https://polyhaven.com/license',
                            'downloaded': '2026-10-03 (Codex, assets gratuits carte 01)', 'resolution': '1k'})
    with open(os.path.join(SRC, 'PROVENANCE.json'), 'w', encoding='utf-8') as fh:
        json.dump({'note': 'Sources CC0 réellement utilisées par les scripts Blender FishDex.', 'files': records}, fh, indent=2, ensure_ascii=False)
    print('prepared', sorted(os.listdir(OUT)))


if __name__ == '__main__':
    main()
