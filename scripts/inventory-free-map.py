"""Inspect the downloaded models locally; no source file is modified."""
import bpy, json
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]
base=root/'assets-source/free-map-01'
files=[*sorted((base/'nature').glob('*.glb')),base/'reed/reed.fbx',base/'waterlily/waterlily_half.fbx']
rows=[]
for path in files:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if path.suffix=='.glb': bpy.ops.import_scene.gltf(filepath=str(path))
    else: bpy.ops.import_scene.fbx(filepath=str(path))
    objects=[]
    for ob in bpy.context.scene.objects:
        if ob.type!='MESH': continue
        points=[ob.matrix_world@Vector(c) for c in ob.bound_box]
        objects.append(dict(name=ob.name,vertices=len(ob.data.vertices),triangles=sum(len(p.vertices)-2 for p in ob.data.polygons),materials=[m.name for m in ob.data.materials if m],dimensions=[max(p[i] for p in points)-min(p[i] for p in points) for i in range(3)],location=list(ob.matrix_world.translation)))
    rows.append(dict(file=str(path.relative_to(root)),objects=objects,images=[dict(name=im.name,size=list(im.size),filepath=im.filepath) for im in bpy.data.images]))
    print(path.name,[(o['name'],o['triangles']) for o in objects])
    if path.suffix=='.glb': bpy.ops.wm.save_as_mainfile(filepath=str(base/'nature'/(path.stem+'.blend')))
bpy.ops.wm.read_factory_settings(use_empty=True)
im=bpy.data.images.load(str(base/'sky-1k.hdr'));bpy.context.scene.render.image_settings.file_format='JPEG';bpy.context.scene.render.image_settings.color_mode='RGB';bpy.context.scene.render.image_settings.quality=85
bpy.context.scene.view_settings.view_transform='AgX';bpy.context.scene.view_settings.exposure=-.7
(root/'public/map-assets').mkdir(exist_ok=True)
im.save_render(str(root/'public/map-assets/sky-day.jpg'),scene=bpy.context.scene)
(base/'inventory.json').write_text(json.dumps(dict(blender=bpy.app.version_string,models=rows),indent=2)+'\n',encoding='utf8')
