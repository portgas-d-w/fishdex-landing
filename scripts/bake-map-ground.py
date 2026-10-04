"""Bake the four actual ground maps offline; two runtime reads replace eight."""
from pathlib import Path
from PIL import Image, ImageChops
root=Path(__file__).resolve().parents[1];src=root/'assets-source/free-map-01';out=root/'public/map-assets';n=1024
weights=[channel.resize((n,n),Image.Resampling.BILINEAR) for channel in Image.frombytes('RGBA',(256,256),(src/'ground-mask.rgba').read_bytes()).split()]
ground=Image.new('RGB',(n,n));rough=Image.new('L',(n,n))
for i,(slug,meters) in enumerate([('forest_ground_04',3.2),('brown_mud_02',1.3),('leafy_grass',2),('pebble_ground_01',1.5)]):
    size=(max(1,round(n*meters/180)),max(1,round(n*meters/140)))
    for kind in ['color','orm']:
        image=Image.open(src/(slug+'-'+kind+('.jpg' if kind=='color' else '.png'))).convert('RGB').resize(size,Image.Resampling.LANCZOS)
        tile=Image.new('RGB',(n,n))
        for y in range(0,n,size[1]):
            for x in range(0,n,size[0]):tile.paste(image,(x,y))
        if kind=='color':ground=ImageChops.add(ground,ImageChops.multiply(tile,Image.merge('RGB',(weights[i],)*3)))
        else:rough=ImageChops.add(rough,ImageChops.multiply(tile.getchannel('G'),weights[i]))
ground.save(out/'ground-atlas.jpg',quality=88,optimize=True)
rough.resize((512,512),Image.Resampling.LANCZOS).save(src/'prepared/ground-roughness.png',optimize=True)
