from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
for post in ['jetty','cove','bank','reed-bank','point','timber']:
 im=Image.open(root/f'docs/apercus/assets-gratuits/after-desktop-{post}.png').convert('RGB');im.resize((576,360),Image.Resampling.LANCZOS).save(root/f'public/map-assets/post-{post}.jpg',quality=83,optimize=True)
