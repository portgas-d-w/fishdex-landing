"""Pack geometry as GLB and deduplicate shared texture files by content hash."""
from pathlib import Path
import json,struct,hashlib
root=Path(__file__).resolve().parents[1];src=root/'assets-source/free-map-01';out=root/'public/models/environment';images=out;out.mkdir(exist_ok=True)
rows=json.loads((src/'exported-models.json').read_text())
for row in rows:
    name=row['name'];path=src/'exports'/(name+'.gltf');data=json.loads(path.read_text());blob=(path.parent/data['buffers'][0]['uri']).read_bytes();del data['buffers'][0]['uri'];image_rows=[]
    # The mobile matte adapter does not sample tree normals; do not transfer them.
    for material in data.get('materials',[]):material.pop('normalTexture',None)
    def references(value):
        if isinstance(value,dict):
            for key,item in value.items():
                if key.endswith('Texture') and isinstance(item,dict) and 'index' in item:yield item
                else:yield from references(item)
        elif isinstance(value,list):
            for item in value:yield from references(item)
    refs=list(references(data.get('materials',[])));used=sorted({r['index'] for r in refs});textures=data.get('textures',[]);images_used=sorted({textures[i]['source'] for i in used})
    for ref in refs:ref['index']=used.index(ref['index'])
    data['textures']=[dict(textures[i],source=images_used.index(textures[i]['source'])) for i in used];data['images']=[data['images'][i] for i in images_used] if images_used else []
    for im in data.get('images',[]):
        source=path.parent/im['uri'];raw=source.read_bytes();hash=hashlib.sha256(raw).hexdigest();file='nature-'+hash[:12]+source.suffix.lower();(images/file).write_bytes(raw);im['uri']=file;image_rows.append(dict(file='/models/environment/'+file,bytes=len(raw),sha256=hash))
    encoded=json.dumps(data,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4);blob+=b'\0'*((-len(blob))%4)
    glb=struct.pack('<III',0x46546c67,2,12+16+len(encoded)+len(blob))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(blob),0x004e4942)+blob
    dest=out/('free-'+name+'.glb');dest.write_bytes(glb);row.update(file='/models/environment/'+dest.name,bytes=len(glb),sha256=hashlib.sha256(glb).hexdigest(),textures=image_rows)
(src/'runtime-models.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8')
