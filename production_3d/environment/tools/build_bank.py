"""Modules de berge de terre érodée (bank_earth) : talus irrégulier, racines fines, contact humide.

blender -b --factory-startup --python production_3d/environment/tools/build_bank.py [-- --seed 41]

Repère (Babylon, après export) : x le long de la rive (4 m, -2..2), z vers l'eau, y = niveau de l'eau.
Le dos du module (z=-2.2) s'enfonce sous le terrain réel (pondGround : 0,08 + 0,17·distance à la rive),
la lèvre érodée (z≈-0.15) dépasse de 0,1 à 0,2 m, la face tombe sous l'eau et finit enterrée dans le fond.
Les extrémités x=±2 rejoignent le terrain pour poser les modules bout à bout ou isolés.
Trois variantes dans un seul GLB : fdx_bank_earth_<a|b|c>_lod<0|1|2> (variantes et LOD déclarés au registre).
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bmesh
from mathutils import Vector
from mathutils.noise import noise as pnoise
import fdx_blender as fx

args = fx.cli_args(); SEED = int(args[args.index('--seed') + 1]) if '--seed' in args else 41
HALF = 2.0


def terrain(z_game):
    """pondGround sur terre près de la rive (distance = -z), pente du fond dans l'eau."""
    return 0.08 + 0.17 * max(0.0, -z_game) if z_game <= 0 else -0.2 * z_game


def profile(variant, x, z, rnd):
    """Hauteur du talus (y) et décalage z de la lèvre, en coordonnées jeu."""
    end = math.cos(min(1.0, abs(x) / HALF) * math.pi / 2) ** 1.4          # 1 au centre, 0 aux extrémités
    wav = pnoise(Vector((x * 0.9 + variant * 7.1, 0.3, 1.7))) * 0.18 + pnoise(Vector((x * 2.7, variant * 3.3, 0.2))) * 0.06
    lip_z = -0.12 + wav                                                   # lèvre ondulée
    lip_h = (0.12 + 0.08 * (pnoise(Vector((x * 1.3, variant * 1.9, 4.0))) + 0.5)) * end
    if z <= lip_z:                                                        # dessus : rejoint le terrain vers l'arrière
        back = max(0.0, min(1.0, (lip_z - z) / 1.9))
        lift = lip_h * (1 - back) ** 1.5 - 0.05 * back - 0.03 * (1 - end)
        bump = pnoise(Vector((x * 3.1, z * 3.1, variant))) * 0.025 * end
        return terrain(z) + lift + bump
    t = min(1.0, (z - lip_z) / (0.32 + 0.1 * end))                        # face érodée puis pied enterré
    top = terrain(lip_z) + lip_h - 0.03 * (1 - end)
    face = top - (top + 0.32) * (t ** 0.8)
    if z > lip_z + 0.32 + 0.1 * end:
        face = -0.32 - 0.35 * (z - lip_z - 0.42)
    return face + pnoise(Vector((x * 4.0, z * 4.0, variant + 9))) * 0.03 * end


def vcolor(y, z, lip_z):
    if y < -0.06:
        return (0.42, 0.42, 0.33, 1)
    if y < 0.05:
        return (0.5, 0.46, 0.38, 1)
    if z > lip_z - 0.05:
        return (0.78, 0.66, 0.54, 1)
    back = min(1.0, (lip_z - z) / 1.2)
    return (0.8 - 0.18 * back, 0.7 + 0.02 * back, 0.55 - 0.1 * back, 1)


def module(name, variant, nx, zs, roots, col, mat, rnd):
    bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cl = bm.loops.layers.color.new('Col')
    grid = []
    for j, z in enumerate(zs):
        row = []
        for i in range(nx + 1):
            x = -HALF + 2 * HALF * i / nx
            y = profile(variant, x, z, rnd)
            row.append(bm.verts.new(Vector((-x, -z, y))))                 # Blender : X=-x jeu, Y=-z jeu
        grid.append(row)
    for j in range(len(zs) - 1):
        for i in range(nx):
            f = bm.faces.new([grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]]); f.normal_update()
            steep = abs(f.normal.z) < 0.6
            for loop in f.loops:
                p = loop.vert.co
                loop[uvl].uv = ((-p.x) / 1.5 + variant * 0.31, (p.z if steep else -p.y) / 1.5)
                xg = -p.x; lip_z = -0.12 + pnoise(Vector((xg * 0.9 + variant * 7.1, 0.3, 1.7))) * 0.18
                loop[cl] = fx.vcol(vcolor(p.z, -p.y, lip_z))
    # Surface ouverte : l'ordre des sommets donne déjà des normales vers le haut/l'eau (pas de recalc qui pourrait inverser).
    up = sum(f.normal.z for f in bm.faces)
    if up < 0:
        bmesh.ops.reverse_faces(bm, faces=list(bm.faces))
    for r in range(roots):                                                # racines fines qui sortent de la face
        x = rnd.uniform(-1.4, 1.4); lip_z = -0.12 + pnoise(Vector((x * 0.9 + variant * 7.1, 0.3, 1.7))) * 0.18
        y0 = profile(variant, x, lip_z + 0.06, rnd) - rnd.uniform(0.0, 0.08)
        if y0 < 0.02:
            continue
        pts = []; length = rnd.uniform(0.18, 0.42); droop = rnd.uniform(0.08, 0.2); side = rnd.uniform(-0.15, 0.15)
        for k in range(7):
            t = k / 6
            pts.append(Vector((-(x + side * t), -(lip_z + 0.02 + length * t * 0.8), y0 - droop * t * t + 0.03 * math.sin(t * 5 + r))))
        rad = rnd.uniform(0.007, 0.014); sides = 4; rings = []
        for k, p in enumerate(pts):
            d = (pts[min(k + 1, 6)] - pts[max(k - 1, 0)]).normalized(); a = d.orthogonal().normalized(); b = d.cross(a)
            rr = rad * (1 - 0.7 * k / 6)
            rings.append([bm.verts.new(p + (a * math.cos(s * 2 * math.pi / sides) + b * math.sin(s * 2 * math.pi / sides)) * rr) for s in range(sides)])
        for k in range(6):
            for s in range(sides):
                f = bm.faces.new([rings[k][s], rings[k][(s + 1) % sides], rings[k + 1][(s + 1) % sides], rings[k + 1][s]])
                for loop in f.loops:
                    loop[uvl].uv = (0.9 + s * 0.02, k * 0.05); loop[cl] = fx.vcol((0.42, 0.33, 0.25, 1))
    return fx.mesh_from_bmesh(name, bm, col, mat)


def main():
    fx.reset(); rnd = fx.rng(SEED)
    mat = fx.material('fdx_bank_mud', base=os.path.join(fx.TEX_PREP, 'fdx-bank-mud-color.jpg'),
                      normal=os.path.join(fx.TEX_PREP, 'fdx-bank-mud-normal.jpg'), roughness=0.95, normal_strength=0.9, vertex_color=True)
    col = fx.collection('bank_earth_export')
    zs0 = [-2.3, -1.7, -1.2, -0.8, -0.5, -0.32, -0.2, -0.1, 0.0, 0.1, 0.22, 0.38, 0.6]
    zs1 = [-2.3, -1.2, -0.5, -0.2, 0.0, 0.2, 0.6]
    zs2 = [-2.3, -0.4, 0.0, 0.6]
    objs = []; stats = {}
    for v, letter in enumerate('abc'):
        lods = [module(f'fdx_bank_earth_{letter}_lod0', v, 20, zs0, 6, col, mat, rnd),
                module(f'fdx_bank_earth_{letter}_lod1', v, 8, zs1, 0, col, mat, rnd),
                module(f'fdx_bank_earth_{letter}_lod2', v, 4, zs2, 0, col, mat, rnd)]
        for o in lods:
            fx.shade_smooth(o, 50); stats[o.name] = fx.triangles(o)
        objs += lods
    fx.save_blend(os.path.join(fx.SOURCE, 'bank_earth.blend'))
    previews = []
    for letter in 'abc':
        o = bpy_obj(f'fdx_bank_earth_{letter}_lod0')
        previews += fx.render_views([o], os.path.join(fx.PREVIEWS, 'bank', f'bank-{letter}'), views=('persp', 'low', 'front') if letter == 'a' else ('persp',))
    glb = fx.export_glb(objs, os.path.join(fx.RUNTIME, 'fdx-bank-earth.glb'))
    rep = fx.inspect_glb(glb); rep['per_mesh_triangles'] = stats
    fx.write_json(os.path.join(fx.REPORTS, 'export', 'bank_earth.json'), {
        'id': 'bank_earth', 'seed': SEED, 'script': 'production_3d/environment/tools/build_bank.py',
        'source_blend': 'production_3d/environment/source/bank_earth.blend', 'variants': ['a', 'b', 'c'],
        'pivot': 'milieu de la lèvre de rive au niveau de l’eau ; +z vers l’eau ; yaw = normale intérieure du contour',
        'materials': 1, 'textures': ['fdx-bank-mud-color.jpg (512 sRGB)', 'fdx-bank-mud-normal.jpg (512 linéaire)'],
        'export': rep, 'previews': previews})
    print('BANK', rep['triangles'], rep['bytes'], stats)


def bpy_obj(name):
    import bpy
    return bpy.data.objects[name]


main()
