"""Roselières (reeds) et touffes d'herbe (grass_clump) : lames fines courbes, base fixée, sans texture.

blender -b --factory-startup --python production_3d/environment/tools/build_reeds.py [-- --seed 9]

Roseaux : massif irrégulier de phragmites (tiges 1,5–2,4 m, panicules brunes) et de massettes (feuilles
larges, épis bruns) ; quelques tiges dominantes, base sous l'eau (y=-0,35) pour un contact franc.
Herbe : touffes de 0,35–0,6 m. Couleur par sommet (base sombre/humide → pointe claire) ; lames double face.
Pivot : centre de la base au niveau de l'eau (roseaux) ou du sol (herbe). Fichier : fdx-reeds.glb.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
from mathutils import Vector
import fdx_blender as fx

args = fx.cli_args(); SEED = int(args[args.index('--seed') + 1]) if '--seed' in args else 9
UP = Vector((0, 0, 1))


def blade(bm, cl, base, height, width, lean_dir, bend, segs, c_base, c_tip, twist=0.0, custom=None):
    """Lame effilée courbée (ruban) ; normales orientées vers le ciel et l'extérieur pour un éclairage doux."""
    side = Vector((-lean_dir.y, lean_dir.x, 0)).normalized()
    side = side * math.cos(twist) + lean_dir * math.sin(twist)
    left, right = [], []
    for i in range(segs + 1):
        t = i / segs
        p = base + UP * height * t + lean_dir * bend * height * t * t
        w = width * (1 - t) ** 0.9 + 0.002
        left.append(bm.verts.new(p - side * w / 2)); right.append(bm.verts.new(p + side * w / 2))
    for i in range(segs):
        f = bm.faces.new([left[i], right[i], right[i + 1], left[i + 1]])
        for loop in f.loops:
            t = (loop.vert.co.z - base.z) / max(0.01, height)
            loop[cl] = fx.vcol(tuple(a + (b - a) * t for a, b in zip(c_base, c_tip)) + (1,))
    if custom is not None:
        n = (lean_dir * 0.5 + UP * 0.8).normalized()
        for v in left + right:
            custom[v] = n


def head(bm, cl, at, length, radius, color):
    """Épi/panicule : petit fuseau à 4 faces."""
    pts = [at + UP * length * t for t in (0, 0.5, 1)]
    ring = []
    for k, p in enumerate(pts):
        r = radius * (0.6, 1.0, 0.3)[k]
        ring.append([bm.verts.new(p + Vector((math.cos(a), math.sin(a), 0)) * r) for a in (0, math.pi / 2, math.pi, 1.5 * math.pi)])
    for k in range(2):
        for s in range(4):
            f = bm.faces.new([ring[k][s], ring[k][(s + 1) % 4], ring[k + 1][(s + 1) % 4], ring[k + 1][s]])
            for loop in f.loops:
                loop[cl] = fx.vcol(color)


def reed_clump(variant, lod, col, mat):
    rnd = fx.rng(SEED * 100 + variant); bm = bmesh.new(); cl = bm.loops.layers.color.new('Col'); custom = {}
    n_phrag = (58, 26, 10)[lod] + variant * 6; n_typha = (24, 11, 5)[lod]; segs = (4, 3, 2)[lod]
    rx, rz = 0.75 + 0.15 * variant, 0.6 + 0.1 * variant
    for i in range(n_phrag):
        a = rnd.uniform(0, 2 * math.pi); r = math.sqrt(rnd.random())
        base = Vector((math.cos(a) * r * rx, math.sin(a) * r * rz, -0.35))
        dominant = rnd.random() < 0.18
        h = rnd.uniform(1.7, 2.4) if dominant else rnd.uniform(1.2, 1.9)
        lean = Vector((math.cos(a), math.sin(a), 0)) * 0.6 + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) * 0.4
        lean.normalize()
        blade(bm, cl, base, h, 0.022, lean, rnd.uniform(0.04, 0.12), segs, (0.33, 0.36, 0.22), (0.66, 0.66, 0.42), rnd.uniform(0, 1.5), custom)
        if lod < 2 and dominant:  # panicule fine et sombre, seulement sur les tiges dominantes
            top = base + UP * h + lean * h * 0.1
            head(bm, cl, top - UP * 0.04, 0.26, 0.016, (0.4, 0.31, 0.29, 1))
    for i in range(n_typha):  # feuilles larges de massette en éventail
        a = rnd.uniform(0, 2 * math.pi); r = math.sqrt(rnd.random()) * 0.7
        base = Vector((math.cos(a) * r * rx, math.sin(a) * r * rz, -0.35))
        lean = Vector((math.cos(a + rnd.uniform(-1, 1)), math.sin(a + rnd.uniform(-1, 1)), 0)).normalized()
        blade(bm, cl, base, rnd.uniform(1.1, 1.7), 0.065, lean, rnd.uniform(0.15, 0.32), segs + 1, (0.3, 0.36, 0.2), (0.55, 0.62, 0.36), rnd.uniform(0, 0.4), custom)
    if lod < 2:
        for k in range(2 + variant % 2):  # épis de massette bruns, peu nombreux
            a = rnd.uniform(0, 2 * math.pi); r = rnd.uniform(0, 0.5)
            base = Vector((math.cos(a) * r * rx, math.sin(a) * r * rz, -0.35)); h = rnd.uniform(1.4, 1.9)
            blade(bm, cl, base, h, 0.014, Vector((1, 0, 0)), 0.01, 2, (0.35, 0.38, 0.22), (0.5, 0.52, 0.32))
            head(bm, cl, base + UP * (h - 0.32), 0.26, 0.035, (0.33, 0.22, 0.14, 1))
    return finish(bm, custom, f'fdx_reeds_{"abc"[variant]}_lod{lod}', col, mat)


def grass_tuft(variant, lod, col, mat):
    rnd = fx.rng(SEED * 200 + variant); bm = bmesh.new(); cl = bm.loops.layers.color.new('Col'); custom = {}
    for i in range((26, 12, 6)[lod] + variant * 3):
        a = rnd.uniform(0, 2 * math.pi); r = math.sqrt(rnd.random()) * 0.16
        base = Vector((math.cos(a) * r, math.sin(a) * r, -0.03))
        lean = Vector((math.cos(a + rnd.uniform(-0.6, 0.6)), math.sin(a + rnd.uniform(-0.6, 0.6)), 0)).normalized()
        blade(bm, cl, base, rnd.uniform(0.3, 0.6), 0.03, lean, rnd.uniform(0.2, 0.55), (3, 2, 2)[lod], (0.32, 0.38, 0.2), (0.62, 0.66, 0.38) if variant != 2 else (0.72, 0.68, 0.42), rnd.uniform(0, 1), custom)
    return finish(bm, custom, f'fdx_grass_{"abc"[variant]}_lod{lod}', col, mat)


def finish(bm, custom, name, col, mat):
    me = bpy.data.meshes.new(name); bm.to_mesh(me)
    normals = [Vector(v.normal) for v in me.vertices]
    for i, v in enumerate(bm.verts):
        if v in custom:
            normals[i] = custom[v]
    for p in me.polygons:
        p.use_smooth = True
    me.normals_split_custom_set_from_vertices([tuple(n) for n in normals]); bm.free()
    obj = bpy.data.objects.new(name, me); col.objects.link(obj); me.materials.append(mat)
    return obj


def main():
    fx.reset(); col = fx.collection('reeds_export')
    mat = fx.material('fdx_reed_blade', color=(1, 1, 1, 1), roughness=0.75, vertex_color=True, double_sided=True)
    objs = []; stats = {}
    for v in range(3):
        for lod in range(3):
            for o in (reed_clump(v, lod, col, mat), grass_tuft(v, lod, col, mat)):
                objs.append(o); stats[o.name] = fx.triangles(o)
    fx.save_blend(os.path.join(fx.SOURCE, 'reeds.blend'))
    previews = fx.render_views([bpy.data.objects['fdx_reeds_a_lod0']], os.path.join(fx.PREVIEWS, 'reeds', 'reeds-a'), views=('front', 'persp'), size=(600, 500))
    previews += fx.render_views([bpy.data.objects['fdx_grass_a_lod0']], os.path.join(fx.PREVIEWS, 'reeds', 'grass-a'), views=('persp',), size=(500, 400))
    glb = fx.export_glb(objs, os.path.join(fx.RUNTIME, 'fdx-reeds.glb'))
    rep = fx.inspect_glb(glb); rep['per_mesh_triangles'] = stats
    fx.write_json(os.path.join(fx.REPORTS, 'export', 'reeds.json'), {'id': 'reeds+grass_clump', 'seed': SEED, 'script': 'production_3d/environment/tools/build_reeds.py',
        'source_blend': 'production_3d/environment/source/reeds.blend', 'variants': {'reeds': ['fdx_reeds_a', 'fdx_reeds_b', 'fdx_reeds_c'], 'grass_clump': ['fdx_grass_a', 'fdx_grass_b', 'fdx_grass_c']},
        'pivot': 'centre de la base ; roseaux enracinés à -0,35 m sous l’eau, herbe à -0,03 m', 'materials': 1, 'textures': [],
        'export': rep, 'previews': previews})
    print('REEDS', rep['triangles'], rep['bytes'], stats)


main()
