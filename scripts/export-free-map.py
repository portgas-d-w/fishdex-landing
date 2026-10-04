"""Local extraction and optimisation of selected CC0 models, preserving originals."""
import bpy,json,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1];src=root/'assets-source/free-map-01';out=src/'exports';out.mkdir(exist_ok=True)
jobs=[('tree-birch','birch','BirchTree_1',(5.3,4.1,8.5)),('bush','bush','Bush',(1.4,1.2,1.0)),('grass','grass','Grass_Small',(.8,.7,.55)),('rock','rocks','Rock_1',(1.4,1.2,.8)),('rock-alt','rocks','Rock_2',(1.4,1.2,.8)),('reeds',None,None,(2,2,2)),('lily',None,None,(.32,.25,.01))]
rows=[]
for name,pack,obj_name,target in jobs:
    if pack:
        bpy.ops.wm.open_mainfile(filepath=str(src/'nature'/(pack+'.blend')))
        keep=bpy.data.objects[obj_name]
        transform=keep.matrix_world.copy();keep.parent=None;keep.matrix_world=transform
        for ob in list(bpy.context.scene.objects):
            if ob!=keep:bpy.data.objects.remove(ob,do_unlink=True)
        bpy.context.view_layer.objects.active=keep;keep.select_set(True)
    else:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        path=src/('reed/reed.fbx' if name=='reeds' else 'waterlily/waterlily_half.fbx')
        bpy.ops.import_scene.fbx(filepath=str(path))
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    # Apply transforms before measuring so source collection offsets do not survive.
    bpy.ops.object.select_all(action='DESELECT')
    for ob in meshes:ob.select_set(True)
    bpy.context.view_layer.objects.active=meshes[0];bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    points=[ob.matrix_world@Vector(c) for ob in meshes for c in ob.bound_box]
    lo=Vector(tuple(min(p[i] for p in points) for i in range(3)));hi=Vector(tuple(max(p[i] for p in points) for i in range(3)))
    center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,(lo.z+hi.z)/2 if name=='lily' else lo.z));size=hi-lo
    # Contract dimensions describe visual proxies; collisions remain in game data.
    for ob in meshes:
        for v in ob.data.vertices:
            v.co-=center
            for i in range(3):v.co[i]*=target[i]/max(size[i],.0001)
        ob.data.update()
    if name=='reeds':
        # Two actual cattail tufts; no dense wall or invented reed species.
        for ob in meshes:
            for v in ob.data.vertices:v.co.x*=.44;v.co.y*=.44
            ob.location.x=-.54;ob.location.y=-.48
            other=ob.copy();other.data=ob.data.copy();bpy.context.collection.objects.link(other);other.location.x=.54;other.location.y=.48;other.rotation_euler.z=.7;other.select_set(True)
        meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    # The two old FBX files contain plain materials; keep moderate terrestrial greens.
    for mat in bpy.data.materials:
        if not mat.use_nodes:mat.use_nodes=True
        bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if bs:
            bs.inputs['Metallic'].default_value=0;bs.inputs['Roughness'].default_value=.9
            if name in ['reeds','lily']:
                col=mat.diffuse_color
                bs.inputs['Base Color'].default_value=((.30,.36,.18,1) if col[1]>col[0] else (.24,.17,.10,1))
            if pack: # tame excess original texture saturation with a neutral factor
                bs.inputs['Base Color'].default_value=(.78,.82,.74,1)
    for im in bpy.data.images:
        if im.size[0]>512 or im.size[1]>512:im.scale(512,512)
    dest=out/(name+'.gltf');bpy.ops.export_scene.gltf(filepath=str(dest),export_format='GLTF_SEPARATE',export_image_format='AUTO',export_yup=True,export_materials='EXPORT',export_animations=False)
    count=sum(sum(len(p.vertices)-2 for p in ob.data.polygons) for ob in meshes)
    rows.append(dict(name=name,source=pack or ('M02' if name=='reeds' else 'M03'),selected_object=obj_name,triangles=count,materials=len({m.name for ob in meshes for m in ob.data.materials if m}),blender_dimensions=target))
    print(name,count)
(src/'exported-models.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8')
