"""Quantifie un PNG RGBA en PNG8 (palette + alpha binaire), pour atlas alpha-test. python quantize_png.py <fichier.png>"""
import sys
from PIL import Image
path = sys.argv[1]
im = Image.open(path).convert('RGBA')
im.quantize(colors=255, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(path, optimize=True)
print('quantized', path)
