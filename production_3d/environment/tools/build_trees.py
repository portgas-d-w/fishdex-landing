"""Arbres de rive FishDex : aulnes, chênes, saules ; LOD0/LOD1 ramifiés + cartes de feuilles, LOD2 imposteur.

blender -b --factory-startup --python production_3d/environment/tools/build_trees.py [-- --seed 11]

Un seul GLB (`fdx-trees.glb`) partage écorce, atlas de feuillage et atlas d'imposteurs entre les trois
familles du registre (une seule copie des textures en mémoire). Objets : fdx_tree_<espèce>_<variante>_lod<n>.
Pivot : pied du tronc au niveau du sol (le tronc s'enfonce de 0,3 m pour absorber la pente du terrain).
Les cartes de feuilles portent des normales « de volume » (vers l'extérieur du houppier et le ciel) pour un
éclairage continu ; l'intérieur du houppier est assombri par couleur de sommet.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
import numpy as np
from mathutils import Vector, Matrix
import fdx_blender as fx

args = fx.cli_args(); SEED = int(args[args.index('--seed') + 1]) if '--seed' in args else 11
UP = Vector((0, 0, 1))
CELL_UV = {0: (0.0, 0.5), 1: (0.5, 0.5), 2: (0.0, 0.0), 3: (0.5, 0.0)}  # coin bas-gauche des cellules (v depuis le bas)

SPECIES = {
    'alder': dict(variants=3, height=(8.6, 10.2), trunk_r=0.17, leader=True, lean=4, prims=(13, 16), prim_from=0.22,
                  prim_elev=(50, 70), prim_len=(1.9, 3.2), cone=0.55, secs=(3, 5), sec_len=(0.4, 0.6), tropism=0.10,
                  gravity=0.02, card=(1.5, 2.0), cell=0, cards=150, fill=36),
    'oak': dict(variants=3, height=(8.2, 9.6), trunk_r=0.27, leader=False, fork=0.36, lean=3, prims=(4, 6), prim_from=0.82,
                prim_elev=(30, 58), prim_len=(3.6, 5.0), cone=0.0, secs=(5, 7), sec_len=(0.38, 0.55), tropism=0.06,
                gravity=0.04, card=(1.8, 2.4), cell=1, cards=170, fill=46),
    'willow': dict(variants=2, height=(7.6, 8.8), trunk_r=0.26, leader=False, fork=0.34, lean=10, prims=(5, 7), prim_from=0.85,
                   prim_elev=(26, 48), prim_len=(3.6, 4.8), cone=0.0, secs=(5, 7), sec_len=(0.4, 0.58), tropism=0.04,
                   gravity=0.3, card=(1.0, 1.3), cell=2, cards=150, fill=24),
    # Buisson de rive (cornouiller/saule marsault) : tiges multiples depuis le sol, masse dense, pas de tronc.
    'shrub': dict(variants=3, height=(1.1, 1.5), trunk_r=0.035, leader=False, fork=0.05, lean=0, prims=(6, 8), prim_from=0.0,
                  prim_elev=(18, 52), prim_len=(0.75, 1.15), cone=0.0, secs=(1, 2), sec_len=(0.4, 0.6), tropism=0.12,
                  gravity=0.08, card=(0.62, 0.85), cell=0, cards=46, fill=16, stems=True),
}


def branch(start, direction, length, r0, r1, steps, rnd, tropism, gravity, wobble=0.18):
    pts = [start.copy()]; d = direction.normalized(); p = start.copy()
    for i in range(steps):
        d = (d + UP * tropism + Vector((0, 0, -gravity)) * (i / steps) * 2.2 +
             Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1))) * wobble).normalized()
        p = p + d * (length / steps); pts.append(p.copy())
    radii = [r0 + (r1 - r0) * (i / steps) for i in range(steps + 1)]
    return pts, radii


def tube(bm, pts, radii, sides, uvl, cl, tint, v0=0.0):
    rings = []; acc = v0
    for k, p in enumerate(pts):
        d = (pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]).normalized()
        a = d.orthogonal().normalized(); b = d.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(s * 2 * math.pi / sides) + b * math.sin(s * 2 * math.pi / sides)) * radii[k]) for s in range(sides)])
    vs = [v0]
    for k in range(1, len(pts)):
        acc += (pts[k] - pts[k - 1]).length / 2.2; vs.append(acc)
    for k in range(len(pts) - 1):
        circ = max(0.25, 2 * math.pi * radii[k] / 1.1)
        for s in range(sides):
            f = bm.faces.new([rings[k][s], rings[k][(s + 1) % sides], rings[k + 1][(s + 1) % sides], rings[k + 1][s]])
            for loop, (ss, kk) in zip(f.loops, [(s, k), (s + 1, k), (s + 1, k + 1), (s, k + 1)]):
                loop[uvl].uv = (ss / sides * circ, vs[kk]); loop[cl] = fx.vcol(tint)
            f.material_index = 0


def card(bm, center, normal, size, roll, cell, uvl, cl, tint, hang=None, custom=None):
    """Carte de feuillage double face. hang=(longueur, largeur) : rideau de saule suspendu par le haut."""
    if hang:
        n = Vector((normal.x, normal.y, 0)).normalized(); u = UP.cross(n).normalized(); v = UP
        L, W = hang
        corners = [center - u * W / 2 - v * L, center + u * W / 2 - v * L, center + u * W / 2, center - u * W / 2]
    else:
        n = normal.normalized(); u = n.orthogonal().normalized(); u = Matrix.Rotation(roll, 3, n) @ u; v = n.cross(u)
        corners = [center + (-u - v) * size / 2, center + (u - v) * size / 2, center + (u + v) * size / 2, center + (-u + v) * size / 2]
    vs = [bm.verts.new(c) for c in corners]
    f = bm.faces.new(vs); f.material_index = 1
    cu, cv = CELL_UV[cell]
    for loop, (a, b) in zip(f.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop[uvl].uv = (cu + 0.004 + a * 0.492, cv + 0.004 + b * 0.492); loop[cl] = fx.vcol(tint)
    if custom is not None:
        for v in vs:
            custom[v] = (n * 0.55 + UP * 0.45).normalized()


def make_tree(species, variant, lod, rnd_seed, mats, col):
    sp = SPECIES[species]; rnd = fx.rng(rnd_seed)
    H = rnd.uniform(*sp['height']); bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cl = bm.loops.layers.color.new('Col')
    custom = {}; sides0, sides1, sides2 = ((8, 6, 4) if lod == 0 else (6, 4, 3))
    lean_dir = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)).normalized()
    trunk_dir = (UP + lean_dir * math.tan(math.radians(sp['lean']))).normalized()
    trunk_len = H * (0.92 if sp['leader'] else sp['fork'])
    if sp.get('stems'):
        trunk_dir = UP; trunk_len = 0.12
    trunk, tr = branch(Vector((0, 0, -0.3)), trunk_dir, trunk_len + 0.3, sp['trunk_r'], sp['trunk_r'] * (0.25 if sp['leader'] else 0.62), 12, rnd, 0.04, 0, 0.05)
    tr[0] *= 1.25; tr[1] *= 1.12  # empattement
    if not sp.get('stems'):
        tube(bm, trunk, tr, sides0, uvl, cl, (0.92, 0.9, 0.86, 1))
    n_prim = rnd.randint(*sp['prims']); golden = math.radians(137.5); anchors = []
    axis = trunk[-1].copy(); axis.z = 0
    for i in range(n_prim):
        t = sp['prim_from'] + (1 - sp['prim_from']) * (i + rnd.random() * 0.6) / n_prim
        k = min(len(trunk) - 2, int(t * (len(trunk) - 1))); base = trunk[k].lerp(trunk[k + 1], rnd.random()); rb = tr[k]
        if sp.get('stems'):
            base = Vector((rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12), -0.05)); rb = 0.03
        az = i * golden + rnd.uniform(-0.4, 0.4); el = math.radians(rnd.uniform(*sp['prim_elev']))
        d = Vector((math.cos(az) * math.sin(el), math.sin(az) * math.sin(el), math.cos(el)))
        L = rnd.uniform(*sp['prim_len']) * (1 - sp['cone'] * (t - sp['prim_from']) / max(0.01, 1 - sp['prim_from']))
        pts, rr = branch(base, d, L, rb * (0.55 if sp['leader'] else 0.85), 0.02, 7 if lod == 0 else 5, rnd, sp['tropism'], sp['gravity'])
        tube(bm, pts, rr, 4 if sp.get('stems') else sides1, uvl, cl, (0.9, 0.88, 0.84, 1), v0=rnd.random())
        anchors += [(pts[m], 1) for m in range(len(pts) // 2, len(pts))]
        for j in range(rnd.randint(*sp['secs'])):
            s_ = rnd.uniform(0.3, 0.95); kk = min(len(pts) - 2, int(s_ * (len(pts) - 1)))
            sb = pts[kk].lerp(pts[kk + 1], rnd.random()); pd = (pts[kk + 1] - pts[kk]).normalized()
            off = Matrix.Rotation(rnd.uniform(0, 2 * math.pi), 3, pd) @ pd.orthogonal().normalized()
            sd = (pd * 0.6 + off * 0.8 + UP * sp['tropism']).normalized()
            spts, srr = branch(sb, sd, L * rnd.uniform(*sp['sec_len']), rr[kk] * 0.5, 0.008, 4, rnd, sp['tropism'] * 1.5, sp['gravity'] * 1.4)
            if lod == 0:
                tube(bm, spts, srr, sides2, uvl, cl, (0.88, 0.86, 0.82, 1), v0=rnd.random())
            anchors += [(spts[m], 2) for m in range(1, len(spts))]
    crown_c = sum((p for p, _ in anchors), Vector()) / max(1, len(anchors))
    radius = max((Vector((p.x - crown_c.x, p.y - crown_c.y, 0)).length for p, _ in anchors), default=1.0)
    n_cards = sp['cards'] if lod == 0 else sp['cards'] // 2
    for c in range(n_cards):  # feuillage ancré sur les rameaux, face vers l'extérieur (lisible de profil)
        at, depth_lvl = rnd.choice(anchors)
        out = Vector((at.x - crown_c.x, at.y - crown_c.y, 0)); r_rel = min(1.0, out.length / max(0.5, radius))
        if out.length < 0.05:
            out = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0))
        out.normalize(); out = Matrix.Rotation(rnd.uniform(-0.8, 0.8), 3, UP) @ out
        shade = 0.7 + 0.32 * r_rel + 0.08 * max(0.0, (at.z - crown_c.z) / 3)
        tint = (shade * rnd.uniform(0.92, 1.05), shade * rnd.uniform(0.95, 1.05), shade * rnd.uniform(0.88, 1.0), 1)
        if sp['cell'] == 2:
            card(bm, at + out * 0.15, out, 0, 0, 2, uvl, cl, tint, hang=(rnd.uniform(2.0, 3.4), rnd.uniform(*sp['card']) * (1.35 if lod else 1)), custom=custom)
        else:
            n = (out + Vector((0, 0, rnd.uniform(-0.2, 0.9)))).normalized()
            card(bm, at + out * 0.25, n, rnd.uniform(*sp['card']) * (1.3 if lod else 1), rnd.uniform(0, 6.28), sp['cell'], uvl, cl, tint, custom=custom)
    for i in range(sp['fill'] if lod == 0 else sp['fill'] // 2):  # masse intérieure dense et plus sombre
        at, _ = rnd.choice(anchors); inward = Vector((crown_c.x - at.x, crown_c.y - at.y, 0)) * rnd.uniform(0.15, 0.45)
        p = at + inward; out = Vector((p.x - crown_c.x, p.y - crown_c.y, rnd.uniform(-0.2, 0.8)))
        if out.length < 0.05:
            out = Vector((1, 0, 0.3))
        tint = (0.6, 0.64, 0.56, 1) if sp['cell'] != 2 else (0.66, 0.7, 0.6, 1)
        card(bm, p, out.normalized(), rnd.uniform(*sp['card']) * (1.15 if sp['cell'] != 2 else 1.8), rnd.uniform(0, 6.28), 3, uvl, cl, tint, custom=custom)
    name = f'fdx_tree_{species}_{"abc"[variant]}_lod{lod}'
    me = bpy.data.meshes.new(name); bm.to_mesh(me)
    if custom:  # normales de volume pour les cartes, normales lisses ailleurs
        me.update()
        normals = [Vector(v.normal) for v in me.vertices]
        for i, v in enumerate(bm.verts):
            if v in custom:
                normals[i] = custom[v]
        for p in me.polygons:
            p.use_smooth = True
        me.normals_split_custom_set_from_vertices([tuple(n) for n in normals])
    bm.free()
    obj = bpy.data.objects.new(name, me); col.objects.link(obj)
    me.materials.append(mats['bark']); me.materials.append(mats['leaves'])
    return obj, H


def wet_tint(z, dry=(0.86, 0.83, 0.78, 1)):
    """Bois mort : blanchi au sec, film d'algues à la ligne d'eau, sombre sous l'eau."""
    if z > 0.12:
        return dry
    if z > 0.0:
        return (0.62, 0.62, 0.52, 1)
    if z > -0.2:
        return (0.46, 0.52, 0.38, 1)
    return (0.36, 0.38, 0.31, 1)


def wood_tube(bm, pts, radii, sides, uvl, cl, jag=None):
    """Tube de bois mort teinté selon la hauteur réelle ; jag : extrémité cassée en échardes."""
    rings = []; acc = 0.0
    for k, p in enumerate(pts):
        d = (pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]).normalized(); a = d.orthogonal().normalized(); b = d.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(i * 2 * math.pi / sides) + b * math.sin(i * 2 * math.pi / sides)) * radii[k]) for i in range(sides)])
    vs = [0.0]
    for k in range(1, len(pts)):
        acc += (pts[k] - pts[k - 1]).length / 2.2; vs.append(acc)
    for k in range(len(pts) - 1):
        circ = max(0.25, 2 * math.pi * radii[k] / 1.1)
        for i in range(sides):
            f = bm.faces.new([rings[k][i], rings[k][(i + 1) % sides], rings[k + 1][(i + 1) % sides], rings[k + 1][i]])
            for loop, (ii, kk) in zip(f.loops, [(i, k), (i + 1, k), (i + 1, k + 1), (i, k + 1)]):
                loop[uvl].uv = (ii / sides * circ, vs[kk]); loop[cl] = fx.vcol(wet_tint(loop.vert.co.z))
    if jag is not None:  # échardes : sommets du dernier anneau tirés irrégulièrement puis cône
        last = rings[-1]; d = (pts[-1] - pts[-2]).normalized(); tip = bm.verts.new(pts[-1] + d * radii[-1] * 0.8)
        for i, v in enumerate(last):
            v.co += d * radii[-1] * (0.4 + 1.6 * jag.random())
        for i in range(sides):
            f = bm.faces.new([last[i], last[(i + 1) % sides], tip])
            for loop in f.loops:
                loop[uvl].uv = (0.92, 0.1 + loop.vert.co.x * 0.01); loop[cl] = fx.vcol((0.95, 0.9, 0.82, 1))


def make_log(variant, lod, seed, mats, col):
    rnd = fx.rng(seed); bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cl = bm.loops.layers.color.new('Col')
    sides = (10, 7, 5)[lod]; steps = (12, 7, 2)[lod]
    pts = [Vector((-2.7 + 5.4 * i / steps, 0.08 * math.sin(i * 0.9 + variant), 0.05 + 0.04 * math.sin(i * 0.6))) for i in range(steps + 1)]
    radii = [0.27 - 0.09 * i / steps for i in range(steps + 1)]
    wood_tube(bm, pts, radii, sides, uvl, cl, jag=rnd if lod < 2 else None)
    if lod < 2:  # moignons et une branche morte qui sort de l'eau
        for j, (t, az, el, L, r) in enumerate([(0.25, 1.2, 50, 0.45, 0.07), (0.45, -1.4, 35, 0.35, 0.06), (0.62, 0.9, 62, 1.7, 0.08), (0.8, -0.6, 20, 0.5, 0.05)]):
            if lod == 1 and L < 0.5:
                continue
            base = pts[0].lerp(pts[-1], t); d = Vector((0, math.cos(az), 0)) * math.cos(math.radians(el)) + Vector((0.25, 0, math.sin(math.radians(el))))
            bp, br = branch(base, d, L, r, r * 0.35, 4 if L > 1 else 2, rnd, 0.02, 0.0, 0.12)
            wood_tube(bm, bp, br, 5 if lod == 0 else 4, uvl, cl, jag=rnd if lod == 0 else None)
            if L > 1 and lod == 0:
                fp, fr = branch(bp[2], (d + Vector((0, 0.6, 0.3))).normalized(), 0.6, r * 0.5, 0.012, 3, rnd, 0.05, 0, 0.15)
                wood_tube(bm, fp, fr, 4, uvl, cl)
    name = f'fdx_log_{"abc"[variant]}_lod{lod}'
    obj = fx.mesh_from_bmesh(name, bm, col, mats['bark']); fx.shade_smooth(obj, 60)
    return obj


def make_snag(variant, lod, seed, mats, col):
    """Branches immergées reliées à une section de tronc noyée ; rayon horizontal ≤ 0,9 m (volume d'accroche du jeu)."""
    rnd = fx.rng(seed); bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cl = bm.loops.layers.color.new('Col')
    a = rnd.uniform(0, math.pi); d = Vector((math.cos(a), math.sin(a), 0.12))
    trunk = [Vector((0, 0, -0.62)) + d * (t - 0.5) * 2.0 for t in (0, 0.5, 1)]
    wood_tube(bm, trunk, [0.16, 0.14, 0.11], (8, 6, 4)[lod], uvl, cl, jag=rnd if lod == 0 else None)
    n = (5, 4, 3)[lod] - (variant % 2)
    for j in range(n):
        base = trunk[0].lerp(trunk[2], rnd.uniform(0.15, 0.85)); az = rnd.uniform(0, 2 * math.pi); el = rnd.uniform(18, 48)
        h = rnd.uniform(0.95, 1.6)
        dd = Vector((math.cos(az) * math.sin(math.radians(el)), math.sin(az) * math.sin(math.radians(el)), math.cos(math.radians(el))))
        bp, br = branch(base, dd, h, rnd.uniform(0.05, 0.08), 0.012, (5, 3, 1)[lod], rnd, -0.02, 0.0, 0.14)
        for p in bp:  # reste dans le volume d'accroche
            r = math.hypot(p.x, p.y)
            if r > 0.9:
                p.x *= 0.9 / r; p.y *= 0.9 / r
        wood_tube(bm, bp, br, (5, 4, 3)[lod], uvl, cl, jag=rnd if lod == 0 else None)
        if lod == 0 and h > 1.2:
            fp, fr = branch(bp[3], (dd + Vector((rnd.uniform(-0.6, 0.6), rnd.uniform(-0.6, 0.6), 0.2))).normalized(), 0.45, br[3] * 0.7, 0.008, 2, rnd, 0, 0, 0.1)
            wood_tube(bm, fp, fr, 4, uvl, cl)
    name = f'fdx_snag_{"abc"[variant]}_lod{lod}'
    obj = fx.mesh_from_bmesh(name, bm, col, mats['bark']); fx.shade_smooth(obj, 60)
    return obj


def impostor_atlas(trees, size=256):
    """Rend chaque LOD0 de face (ortho, fond transparent) et compose un atlas 4×4 pour les LOD2."""
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'; scene.render.film_transparent = True
    scene.render.resolution_x = scene.render.resolution_y = size; scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'; scene.view_settings.view_transform = 'Standard'
    world = bpy.data.worlds.new('imp'); world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.75, 0.82, 0.86, 1); world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.75
    scene.world = world
    sun = bpy.data.objects.new('imp-sun', bpy.data.lights.new('imp-sun', 'SUN')); scene.collection.objects.link(sun)
    sun.data.energy = 2.0; sun.rotation_euler = (math.radians(40), 0, math.radians(-30))
    cam = bpy.data.objects.new('imp-cam', bpy.data.cameras.new('imp-cam')); scene.collection.objects.link(cam); scene.camera = cam
    cam.data.type = 'ORTHO'; cells = []; tmp = os.path.join(fx.PREVIEWS, 'trees', 'impostor'); os.makedirs(tmp, exist_ok=True)
    for idx, (obj, H) in enumerate(trees):
        for o in scene.objects:
            if o.type == 'MESH':
                o.hide_render = o is not obj
        lo, hi = fx.bounds([obj]); ext = max(hi.x - lo.x, hi.y - lo.y, hi.z - lo.z) * 1.02
        cx = (lo.x + hi.x) / 2
        cam.data.ortho_scale = ext; cam.location = (cx, -40, lo.z + ext / 2); cam.rotation_euler = (math.radians(90), 0, 0)
        path = os.path.join(tmp, f'{obj.name}.png'); scene.render.filepath = path; bpy.ops.render.render(write_still=True)
        cells.append({'name': obj.name, 'path': path, 'ext': ext, 'bottom': lo.z, 'cx': cx})
    ROWS = 4; W, Hh = 4 * size, ROWS * size; atlas = np.zeros((Hh, W, 4), np.float32)  # 4×4 cellules (≤16 variantes, POT)
    for i, c in enumerate(cells):
        img = bpy.data.images.load(c['path']); px = np.array(img.pixels[:], np.float32).reshape(size, size, 4)
        x0, y0 = (i % 4) * size, (ROWS - 1 - i // 4) * size  # pixels Blender : ligne 0 en bas
        atlas[y0:y0 + size, x0:x0 + size] = px; c['cell'] = (i % 4, i // 4)
    a = atlas[..., 3] > 0.5
    rgb = atlas[..., :3].copy()
    for _ in range(6):  # étale la couleur sous les pixels transparents (mipmaps sans liseré)
        shifted = [np.roll(rgb, s, axis=ax) for ax in (0, 1) for s in (-1, 1)]; ma = [np.roll(a, s, axis=ax) for ax in (0, 1) for s in (-1, 1)]
        acc = sum(sv * m[..., None] for sv, m in zip(shifted, ma)); cnt = sum(m.astype(np.float32) for m in ma)
        grow = (~a) & (cnt > 0); rgb[grow] = (acc[grow] / cnt[grow][..., None]); a = a | grow
    atlas[..., :3] = rgb * 0.82  # l'éclairage du jeu s'ajoute à celui cuit dans l'imposteur
    atlas[..., 3] = (atlas[..., 3] > 0.5).astype(np.float32)
    out = bpy.data.images.new('fdx-tree-impostors', W, Hh, alpha=True); out.pixels = atlas.ravel().tolist()
    out.filepath_raw = os.path.join(fx.TEX_PREP, 'fdx-tree-impostors.png'); out.file_format = 'PNG'; out.save()
    for o in scene.objects:
        if o.type == 'MESH':
            o.hide_render = False
    return cells


def impostor_mesh(cell, mat, col, H):
    bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); custom = {}
    ext = cell['ext']; b = cell['bottom']; cu, cv = cell['cell'][0] * 0.25, (3 - cell['cell'][1]) * 0.25
    for ang in (0, math.pi / 2):
        d = Vector((math.cos(ang), math.sin(ang), 0)); w = ext / 2
        vs = [bm.verts.new(Vector((0, 0, b)) + d * -w), bm.verts.new(Vector((0, 0, b)) + d * w),
              bm.verts.new(Vector((0, 0, b + ext)) + d * w), bm.verts.new(Vector((0, 0, b + ext)) + d * -w)]
        f = bm.faces.new(vs); f.material_index = 0
        for loop, (x, y) in zip(f.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]):
            loop[uvl].uv = (cu + 0.002 + x * 0.246, cv + 0.002 + y * 0.246)
    name = cell['name'].replace('_lod0', '_lod2')
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    me.normals_split_custom_set_from_vertices([(0.0, 0.0, 1.0)] * len(me.vertices))
    obj = bpy.data.objects.new(name, me); col.objects.link(obj); me.materials.append(mat)
    return obj


def leaf_material(name, path):
    m = fx.material(name, base=path, roughness=0.8, vertex_color=True, alpha_clip=0.5, double_sided=True)
    nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']; tex = [n for n in nt.nodes if n.type == 'TEX_IMAGE'][0]
    for l in list(bsdf.inputs['Alpha'].links):
        nt.links.remove(l)
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5  # → glTF alphaMode MASK
    nt.links.new(tex.outputs['Alpha'], gt.inputs[0]); nt.links.new(gt.outputs[0], bsdf.inputs['Alpha'])
    tex.interpolation = 'Linear'
    return m


def main():
    fx.reset(); col = fx.collection('trees_export')
    bark = fx.material('fdx_bark', base=os.path.join(fx.TEX_PREP, 'fdx-bark-color.jpg'), normal=os.path.join(fx.TEX_PREP, 'fdx-bark-normal.jpg'),
                       roughness=0.92, normal_strength=0.9, vertex_color=True)
    leaves = leaf_material('fdx_leaves', os.path.join(fx.TEX_PREP, 'fdx-foliage-atlas.png'))
    mats = {'bark': bark, 'leaves': leaves}
    lod0 = []; objs = []; stats = {}
    for species, sp in SPECIES.items():
        for v in range(sp['variants']):
            seed = SEED * 1000 + {'alder': 100, 'oak': 200, 'willow': 300, 'shrub': 400}[species] + v
            o0, H = make_tree(species, v, 0, seed, mats, col); o1, _ = make_tree(species, v, 1, seed, mats, col)
            lod0.append((o0, H)); objs += [o0, o1]
            stats[o0.name] = fx.triangles(o0); stats[o1.name] = fx.triangles(o1)
    for v in range(2):  # bois immergé du poste P06
        for kind, fn, base in (('log', make_log, 500), ('snag', make_snag, 600)):
            for lod in range(3):
                o = fn(v, lod, SEED * 1000 + base + v, mats, col); objs.append(o); stats[o.name] = fx.triangles(o)
    o = make_snag(2, 0, SEED * 1000 + 602, mats, col); objs.append(o); stats[o.name] = fx.triangles(o)
    for lod in (1, 2):
        o = make_snag(2, lod, SEED * 1000 + 602, mats, col); objs.append(o); stats[o.name] = fx.triangles(o)
    previews = []
    for o, H in lod0:
        previews += fx.render_views([o], os.path.join(fx.PREVIEWS, 'trees', o.name), views=('front', 'persp') if o.name.endswith('a_lod0') else ('front',), size=(600, 600))
    cells = impostor_atlas(lod0)
    imp = fx.material('fdx_tree_impostor', base=os.path.join(fx.TEX_PREP, 'fdx-tree-impostors.png'), roughness=0.9, alpha_clip=0.5, double_sided=True)
    nt = imp.node_tree; bsdf = nt.nodes['Principled BSDF']; tex = [n for n in nt.nodes if n.type == 'TEX_IMAGE'][0]
    for l in list(bsdf.inputs['Alpha'].links):
        nt.links.remove(l)
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5
    nt.links.new(tex.outputs['Alpha'], gt.inputs[0]); nt.links.new(gt.outputs[0], bsdf.inputs['Alpha'])
    for c, (o, H) in zip(cells, lod0):
        o2 = impostor_mesh(c, imp, col, H); objs.append(o2); stats[o2.name] = fx.triangles(o2)
    for name in ('fdx_log_a_lod0', 'fdx_snag_a_lod0', 'fdx_snag_b_lod0'):
        previews += fx.render_views([bpy.data.objects[name]], os.path.join(fx.PREVIEWS, 'trees', name), views=('persp', 'side'), size=(600, 400))
    fx.save_blend(os.path.join(fx.SOURCE, 'trees.blend'))
    variants = [o.name.replace('_lod0', '') for o, _ in lod0]; heights = {o.name: round(H, 2) for o, H in lod0}
    sizes = {}
    for o, _ in lod0:
        lo, hi = fx.bounds([o]); sizes[o.name] = [round(hi.x - lo.x, 2), round(hi.z - lo.z, 2), round(hi.y - lo.y, 2)]  # x, hauteur, profondeur (axes Babylon)
    glb = fx.export_glb(objs, os.path.join(fx.RUNTIME, 'fdx-trees.glb'))
    rep = fx.inspect_glb(glb); rep['per_mesh_triangles'] = stats
    fx.write_json(os.path.join(fx.REPORTS, 'export', 'trees.json'), {
        'id': 'trees', 'seed': SEED, 'script': 'production_3d/environment/tools/build_trees.py',
        'source_blend': 'production_3d/environment/source/trees.blend', 'variants': variants,
        'heights_m': heights, 'lod0_size_xyz_babylon': sizes,
        'pivot': 'pied du tronc au niveau du sol (tronc enterré de 0,3 m)', 'materials': 3,
        'textures': ['fdx-bark-color.jpg (512 sRGB)', 'fdx-bark-normal.jpg (512 linéaire)', 'fdx-foliage-atlas.png (1024 PNG8 alpha)', 'fdx-tree-impostors.png (1024² alpha, 4×4 cellules, rendu Blender)'],
        'export': rep, 'previews': previews})
    print('TREES', rep['triangles'], rep['bytes'], stats)


main()
