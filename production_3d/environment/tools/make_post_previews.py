"""Aperçus des six postes (fiches de la carte) depuis les captures réelles du jeu après intégration.

python production_3d/environment/tools/make_post_previews.py [dossier_captures]
Entrée : docs/apercus/visuels-blender/<dossier>/desktop-<poste>-morning.jpg (1440×900, interface masquée).
Sortie : public/map-assets/post-<poste>.jpg 576×360 (même format que la version précédente).
"""
import os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
src = sys.argv[1] if len(sys.argv) > 1 else 'after'
for post in ['jetty', 'cove', 'bank', 'reed-bank', 'point', 'timber']:
    im = Image.open(os.path.join(ROOT, 'docs', 'apercus', 'visuels-blender', src, f'desktop-{post}-morning.jpg')).convert('RGB')
    out = os.path.join(ROOT, 'public', 'map-assets', f'post-{post}.jpg')
    im.resize((576, 360), Image.Resampling.LANCZOS).save(out, quality=83, optimize=True)
    print(post, os.path.getsize(out))
