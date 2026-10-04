"""Scène étalon : cube d'un mètre, flèche et objet asymétrique.

blender -b --factory-startup --python production_3d/environment/tools/build_calibration.py
Attendu dans Babylon (main gauche, Y haut) : cube 1×1×1 m posé sur y=0, flèche vers +Z,
repère rouge vers -X, poteau en (x=-0.4, z=-0.4).
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bmesh
from mathutils import Vector
import fdx_blender as fx

fx.reset()
grey = fx.material('cal-grey', color=(0.55, 0.55, 0.52, 1))
teal = fx.material('cal-arrow', color=(0.18, 0.62, 0.6, 1))
red = fx.material('cal-marker', color=(0.75, 0.15, 0.12, 1))

bm = bmesh.new(); fx.box_bm(bm, 1, 1, 1, (0, 0, 0.5)); cube = fx.mesh_from_bmesh('cal-cube-1m', bm, mat=grey)
bm = bmesh.new(); fx.box_bm(bm, 0.12, 1.3, 0.08, (0, -0.65, 1.06))
r = bmesh.ops.create_cone(bm, cap_ends=True, segments=4, radius1=0.22, radius2=0.0, depth=0.4)
bmesh.ops.rotate(bm, verts=r['verts'], cent=(0, 0, 0), matrix=__import__('mathutils').Matrix.Rotation(1.5708, 3, 'X'))
bmesh.ops.translate(bm, vec=Vector((0, -1.5, 1.06)), verts=r['verts'])
arrow = fx.mesh_from_bmesh('cal-arrow-blender-minus-y', bm, mat=teal)
bm = bmesh.new(); fx.box_bm(bm, 0.25, 0.25, 0.25, (0.8, 0, 0.125)); marker = fx.mesh_from_bmesh('cal-marker-blender-plus-x', bm, mat=red)
bm = bmesh.new(); fx.box_bm(bm, 0.08, 0.08, 1.6, (0.4, 0.4, 0.8)); post = fx.mesh_from_bmesh('cal-post-blender-xy', bm, mat=red)
objs = [cube, arrow, marker, post]

fx.save_blend(os.path.join(fx.SOURCE, 'calibration.blend'))
previews = fx.render_views(objs, os.path.join(fx.PREVIEWS, 'calibration', 'calibration'), views=('top', 'persp'))
glb = fx.export_glb(objs, os.path.join(fx.EXPORTS, 'calibration.glb'))
report = fx.inspect_glb(glb)
report.update({'id': 'calibration', 'pivot': 'base_center (cube posé sur le sol)', 'previews': previews,
               'expected_babylon': {'cube_size_m': [1, 1, 1], 'arrow_points': '+Z', 'red_marker': '-X', 'post_xz': [-0.4, -0.4]}})
fx.write_json(os.path.join(fx.REPORTS, 'export', 'calibration.json'), report)
print('CALIBRATION', report['triangles'], report['size_m_xyz_blender'])
