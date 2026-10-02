"""Blender 4.5+ : blender --background --python scripts/convert_fish.py
Conversion locale déterministe ; aucun envoi à un service d’IA.
Les originaux restent dans assets-source/riverfishpack.zip.
"""
import bpy
import json
import math
import tempfile
import zipfile
import os
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
NAMES = os.environ.get('FISH_MODELS', 'Roach,EuropeanPerch,CommonCarp,NorthernPike,Zander').split(',')
OUT = Path(os.environ.get('FISH_OUTPUT', str(ROOT / 'public' / 'models')))
OUT.mkdir(parents=True, exist_ok=True)
report = []

with tempfile.TemporaryDirectory(prefix='riverfish-') as tmp:
    tmp = Path(tmp)
    with zipfile.ZipFile(ROOT / 'assets-source' / 'riverfishpack.zip') as archive:
        for name in NAMES:
            (tmp / (name + '.fbx')).write_bytes(archive.read(f'RiverFishPack/FBX/{name}.fbx'))
    for name in NAMES:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.fbx(filepath=str(tmp / (name + '.fbx')), use_image_search=True)
        meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
        armatures = len([o for o in bpy.context.scene.objects if o.type == 'ARMATURE'])
        animations = len(bpy.data.actions)
        if not meshes:
            raise RuntimeError(f'{name}: aucune géométrie')
        bpy.ops.object.select_all(action='DESELECT')
        for obj in meshes:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = meshes[0]
        bpy.ops.object.join()
        obj = bpy.context.object
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        original_dimensions = list(obj.dimensions)
        longest = max(range(3), key=lambda i: obj.dimensions[i])
        if longest == 1:
            obj.rotation_euler.z = math.pi / 2
        elif longest == 2:
            obj.rotation_euler.y = math.pi / 2
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        bbox = [Vector(v) for v in obj.bound_box]
        center = sum(bbox, Vector()) / 8
        factor = 2.0 / max(obj.dimensions)
        for vertex in obj.data.vertices:
            vertex.co = (vertex.co - center) * factor
        obj.location = (0, 0, 0)
        obj.name = name
        material = bpy.data.materials.new(name + '_surface')
        material.use_nodes = True
        material.use_backface_culling = False
        bsdf = material.node_tree.nodes.get('Principled BSDF')
        bsdf.inputs['Roughness'].default_value = 0.78
        bsdf.inputs['Metallic'].default_value = 0.0
        images = [im for im in bpy.data.images if im.type == 'IMAGE' and im.size[0] > 0]
        if not images:
            raise RuntimeError(f'{name}: texture manquante')
        image = max(images, key=lambda im: im.size[0] * im.size[1])
        image.scale(512, 512)
        image.filepath_raw = str(tmp / (name + '.png'))
        image.file_format = 'PNG'
        image.save()
        image.pack()
        tex = material.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = image
        material.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
        obj.data.materials.clear()
        obj.data.materials.append(material)
        for poly in obj.data.polygons:
            poly.material_index = 0
        obj.data.calc_loop_triangles()
        output = OUT / (name + '.glb')
        bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', use_selection=True,
                                  export_animations=False, export_yup=True, export_image_format='AUTO')
        report.append({'model': name, 'triangles': len(obj.data.loop_triangles), 'source_dimensions': original_dimensions, 'armatures': armatures, 'source_animations': animations,
                       'display_length': 2.0, 'texture': '512x512 PNG embedded', 'bytes': output.stat().st_size})
        print('CONVERTED', name, report[-1])

(OUT / 'manifest.json').write_text(json.dumps({'source': 'River fish / TricksUp, supplied by owner',
    'converter': bpy.app.version_string, 'models': report}, indent=2) + '\n', encoding='utf-8')
