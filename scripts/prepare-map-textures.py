"""512px runtime maps from the six selected 1K sources. Linear data remain PNG."""
from pathlib import Path
from PIL import Image, ImageOps
import json, hashlib
root=Path(__file__).resolve().parents[1];source=root/'assets-source/free-map-01';out=root/'public/map-assets';out.mkdir(exist_ok=True);prepared=source/'prepared';prepared.mkdir(exist_ok=True)
rows=[]
for slug in ['forest_ground_04','brown_mud_02','leafy_grass','pebble_ground_01','wood_planks_dirt','bark_willow_02']:
    for kind in ['color','normal','orm']:
        path=source/(slug+'-'+kind+('.jpg' if kind=='color' else '.png'))
        image=Image.open(path).convert('RGB');image.thumbnail((512,512),Image.Resampling.LANCZOS)
        # A/R/M channels are taken from the supplied ARM image, not inferred from filename.
        if kind=='orm':
            r,g,b=image.split();b=Image.new('L',image.size,0);image=Image.merge('RGB',(r,g,b))
        dest=(out if slug in ['wood_planks_dirt','bark_willow_02'] and kind!='orm' else prepared)/(slug+'-'+kind+('.jpg' if kind=='color' else '.png'))
        if kind=='color': image.save(dest,quality=86,optimize=True)
        else: image.save(dest,optimize=True)
        if kind=='orm' and slug in ['wood_planks_dirt','bark_willow_02']:
            rough=image.getchannel('G');spec=ImageOps.invert(rough);spec=spec.point(lambda p:int(p*.32));gloss=ImageOps.invert(rough)
            Image.merge('RGBA',(spec,spec,spec,gloss)).save(out/(slug+'-specular.png'),optimize=True)
        rows.append(dict(source=str(path.relative_to(root)),file=str(dest.relative_to(root)),dimensions=list(image.size),colorSpace='sRGB' if kind=='color' else 'linear',bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
(source/'prepared-textures.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8')
