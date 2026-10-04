"""Bouquets de nénuphars (lily_cluster) : feuilles échancrées flottantes, tailles variées, aucune fleur géante.

blender -b --factory-startup --python production_3d/environment/tools/build_lily.py [-- --seed 5]
Pivot : centre du bouquet au niveau de l'eau (y=0) ; feuilles entre +0,006 et +0,02 m (étagées, pas de z-fighting).
Trois variantes dans fdx-lily.glb : fdx_lily_<a|b|c>_lod<0|1|2> (16, 8 puis 6 segments, moins de feuilles au loin).
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
from mathutils import Vector
import fdx_blender as fx

args = fx.cli_args(); SEED = int(args[args.index('--seed') + 1]) if '--seed' in args else 5


def pad(bm, uvl, cl, center, radius, rot, seg, z, tint, rnd):
    notch = math.radians(rnd.uniform(14, 24)); cup = radius * 0.06
    c = bm.verts.new(Vector((center.x, center.y, z)))
    ring = []
    for i in range(seg + 1):
        a = notch / 2 + (2 * math.pi - notch) * i / seg
        r = radius * (1 + 0.03 * math.sin(i * 1.7))
        ring.append((bm.verts.new(Vector((center.x + math.cos(a + rot) * r, center.y + math.sin(a + rot) * r, z + cup))), a))
    for (v0, a0), (v1, a1) in zip(ring, ring[1:]):
        f = bm.faces.new([c, v0, v1])
        for loop in f.loops:
            if loop.vert is c:
                uv = (0.5, 0.5)
            else:
                a = a0 if loop.vert is v0 else a1
                uv = (0.5 + math.cos(a) * 0.48, 0.5 + math.sin(a) * 0.48)
            loop[uvl].uv = uv; loop[cl] = fx.vcol(tint)


def cluster(variant, lod, col, mat):
    rnd = fx.rng(SEED * 100 + variant); bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cl = bm.loops.layers.color.new('Col')
    count = (11, 9, 6)[lod] - variant; seg = (16, 8, 6)[lod]; placed = []
    tries = 0
    while len(placed) < count and tries < 400:
        tries += 1
        r = rnd.uniform(0.1, 0.24) if len(placed) > 1 else rnd.uniform(0.2, 0.26)
        ang = rnd.uniform(0, 2 * math.pi); dist = math.sqrt(rnd.random()) * (0.95 - r)
        p = Vector((math.cos(ang) * dist * (1.15 if variant == 1 else 1), math.sin(ang) * dist, 0))
        if any((p - q).length < (r + rq) * 0.82 for q, rq in placed):
            continue
        placed.append((p, r))
    for k, (p, r) in enumerate(sorted(placed, key=lambda t: t[1])):
        h = rnd.uniform(0.9, 1.06)
        pad(bm, uvl, cl, p, r, rnd.uniform(0, 2 * math.pi), seg, 0.006 + 0.0012 * k, (h, h * rnd.uniform(0.96, 1.04), h * 0.95, 1), rnd)
    name = f'fdx_lily_{"abc"[variant]}_lod{lod}'
    obj = fx.mesh_from_bmesh(name, bm, col, mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.data.normals_split_custom_set_from_vertices([(0.0, 0.0, 1.0)] * len(obj.data.vertices))
    return obj


def main():
    fx.reset(); col = fx.collection('lily_export')
    mat = fx.material('fdx_lily_pad', base=os.path.join(fx.TEX_PREP, 'fdx-lily-pad.jpg'), roughness=0.55, vertex_color=True)
    objs = []; stats = {}
    for v in range(3):
        for lod in range(3):
            o = cluster(v, lod, col, mat); objs.append(o); stats[o.name] = fx.triangles(o)
    lod0 = [o for o in objs if o.name.endswith('lod0')]
    fx.save_blend(os.path.join(fx.SOURCE, 'lily.blend'))
    previews = fx.render_views([lod0[0]], os.path.join(fx.PREVIEWS, 'lily', 'lily-a'), views=('top', 'persp'), size=(600, 400))
    glb = fx.export_glb(objs, os.path.join(fx.RUNTIME, 'fdx-lily.glb'))
    rep = fx.inspect_glb(glb); rep['per_mesh_triangles'] = stats
    fx.write_json(os.path.join(fx.REPORTS, 'export', 'lily.json'), {'id': 'lily_cluster', 'seed': SEED, 'script': 'production_3d/environment/tools/build_lily.py',
        'source_blend': 'production_3d/environment/source/lily.blend', 'variants': ['fdx_lily_a', 'fdx_lily_b', 'fdx_lily_c'],
        'pivot': 'centre du bouquet au niveau de l’eau', 'materials': 1, 'textures': ['fdx-lily-pad.jpg (256 sRGB, procédurale)'],
        'export': rep, 'previews': previews})
    print('LILY', rep['triangles'], rep['bytes'], stats)


main()
