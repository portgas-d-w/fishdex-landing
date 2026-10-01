"""Inventaire Blender local des 50 sources, sans les publier."""
import bpy
import zipfile
import tempfile
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
inventory = []
with zipfile.ZipFile(root / 'assets-source' / 'riverfishpack.zip') as archive, tempfile.TemporaryDirectory(prefix='fish-inventory-') as tmp:
    for name in sorted(n for n in archive.namelist() if n.endswith('.fbx')):
        source = Path(tmp) / Path(name).name
        source.write_bytes(archive.read(name))
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.fbx(filepath=str(source))
        meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
        for mesh in meshes: mesh.data.calc_loop_triangles()
        inventory.append({ 'model': source.stem, 'format': 'FBX 7400', 'sourceBytes': source.stat().st_size,
            'meshes': len(meshes), 'triangles': sum(len(mesh.data.loop_triangles) for mesh in meshes),
            'dimensions': [list(mesh.dimensions) for mesh in meshes], 'armatures': sum(obj.type == 'ARMATURE' for obj in bpy.context.scene.objects),
            'actions': len(bpy.data.actions), 'textures': [list(im.size) for im in bpy.data.images if im.type == 'IMAGE' and im.size[0] > 0] })
(root / 'docs' / 'PACK_INVENTAIRE.json').write_text(json.dumps({'blender': bpy.app.version_string, 'models': inventory}, indent=2)+'\n', encoding='utf-8')
print('INVENTORY', len(inventory), 'models')
