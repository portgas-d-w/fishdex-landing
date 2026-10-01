import json
import sys
from PIL import Image
for item in json.load(open(sys.argv[1], encoding='utf-8')):
    with Image.open(item['source']) as image:
        image.thumbnail((360, 240))
        image.save(item['target'], 'WEBP', quality=78, method=6)
print('Illustrations optimisées, 360 × 240 maximum, WebP')
