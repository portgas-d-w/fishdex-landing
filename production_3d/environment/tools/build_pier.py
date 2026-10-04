"""Ponton du poste P01 (jetty) : planches, longerons, chevêtres, pieux, contreventements.

blender -b --factory-startup --python production_3d/environment/tools/build_pier.py [-- --seed 2026]

Repère de sortie (après export glTF +Y) : pivot au niveau de l'eau (y=0), sur l'axe du ponton, au milieu
de sa longueur. Le ponton s'étend de z=-4 (rive) à z=+4 (eau) en coordonnées locales Babylon ; placé en
(0, 0, -4) dans l'étang il couvre z∈[-8, 0] comme le ponton procédural historique. Dessus des planches
y=+0.355. Les fonds de pieux suivent la bathymétrie réelle de pond-map (relevés ci-dessous) + 0,45 m d'ancrage.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bmesh
from mathutils import Vector, Matrix
import fdx_blender as fx

args = fx.cli_args(); SEED = int(args[args.index('--seed') + 1]) if '--seed' in args else 2026
R = fx.rng(SEED)
DECK_TOP = 0.355; LENGTH = 8.0; WIDTH = 2.4; PLANK_T = 0.035; PITCH = 8.0 / 52; PLANK_W = PITCH - 0.012
# Fond relevé avec pondGround() le long de l'axe (z jeu → y) ; en Blender y = -(z_jeu + 4).
GROUND = {-8: 0.43, -7: 0.26, -6: 0.10, -5: -0.18, -4: -0.37, -3: -0.57, -2: -0.76, -1: -0.96, 0: -1.16, 1: -1.36}
BOARD_U = 1 / 6.2  # largeur d'une planche dans la texture wood_planks_dirt (6 planches visibles)


def ground_at(z_game):
    k = math.floor(z_game); t = z_game - k
    a = GROUND.get(k, GROUND[max(min(k, 1), -8)]); b = GROUND.get(k + 1, a)
    return a + (b - a) * t


def by(z_game):
    return -(z_game + 4.0)


def box(bm, cx, cy, cz, sx, sy, sz, uv_mode, color, u0=0.0, v0=0.0, rot=None, skip_bottom=False):
    """Boîte UV-mappée. uv_mode 'plank' (fil selon X), 'beam_y' (fil selon Y), 'beam_x'."""
    hx, hy, hz = sx / 2, sy / 2, sz / 2
    corners = [Vector((x, y, z)) for x in (-hx, hx) for y in (-hy, hy) for z in (-hz, hz)]
    m = rot or Matrix.Identity(3)
    vs = [bm.verts.new(Vector((cx, cy, cz)) + m @ c) for c in corners]
    idx = lambda x, y, z: x * 4 + y * 2 + z
    faces = [((0, 0, 1), [idx(0, 0, 1), idx(1, 0, 1), idx(1, 1, 1), idx(0, 1, 1)]),
             ((0, 0, -1), [idx(0, 0, 0), idx(0, 1, 0), idx(1, 1, 0), idx(1, 0, 0)]),
             ((0, -1, 0), [idx(0, 0, 0), idx(1, 0, 0), idx(1, 0, 1), idx(0, 0, 1)]),
             ((0, 1, 0), [idx(0, 1, 0), idx(0, 1, 1), idx(1, 1, 1), idx(1, 1, 0)]),
             ((-1, 0, 0), [idx(0, 0, 0), idx(0, 0, 1), idx(0, 1, 1), idx(0, 1, 0)]),
             ((1, 0, 0), [idx(1, 0, 0), idx(1, 1, 0), idx(1, 1, 1), idx(1, 0, 1)])]
    uvl = bm.loops.layers.uv.verify(); col = bm.loops.layers.color.get('Col') or bm.loops.layers.color.new('Col')
    for n, ids in faces:
        if skip_bottom and n == (0, 0, -1):
            continue
        f = bm.faces.new([vs[i] for i in ids])
        for loop in f.loops:
            c = corners[ids[[vs[i] for i in ids].index(loop.vert)]]
            lx, ly, lz = c.x + hx, c.y + hy, c.z + hz
            if uv_mode == 'plank':
                if n[2]:
                    uv = (u0 + ly / sy * BOARD_U * 0.92, v0 + lx / 1.2)
                elif n[1]:
                    uv = (u0 + lz / sz * BOARD_U * 0.2, v0 + lx / 1.2)
                else:
                    uv = (u0 + ly / sy * BOARD_U * 0.92, v0 + lz / 1.2)
            elif uv_mode == 'beam_y':
                uv = (u0 + (lx if n[2] else lz if n[0] else lx) / max(sx, sz) * BOARD_U * 0.9, v0 + ly / 1.2)
            else:
                uv = (u0 + (ly if n[2] else lz) / max(sy, sz) * BOARD_U * 0.9, v0 + lx / 1.2)
            loop[uvl].uv = uv
            loop[col] = fx.vcol(color)
    return vs


def pile(bm, x, z_game, top, radius, sides, color_fn, lean=(0.0, 0.0), u0=0.0):
    """Pieu cylindrique effilé, sommet chanfreiné ; anneaux aux hauteurs de la ligne d'eau pour le dégradé humide."""
    bottom = ground_at(z_game) - 0.45
    levels = sorted({bottom, -0.6, -0.28, -0.08, 0.04, 0.16, top - 0.03, top} | ({0.36} if top > 0.5 else set()))
    levels = [h for h in levels if bottom <= h <= top]
    cy = by(z_game); uvl = bm.loops.layers.uv.verify(); col = bm.loops.layers.color.get('Col') or bm.loops.layers.color.new('Col')
    rings = []
    for h in levels:
        r = radius * (0.92 + 0.08 * (h - bottom) / (top - bottom))
        if h == top:
            r *= 0.78
        ring = []
        for i in range(sides):
            a = 2 * math.pi * i / sides
            jitter = 1 + 0.04 * math.sin(i * 2.3 + x * 7)
            off = Vector((lean[0] * (h - bottom), lean[1] * (h - bottom), 0))
            ring.append(bm.verts.new(Vector((x + math.cos(a) * r * jitter, cy + math.sin(a) * r * jitter, h)) + off))
        rings.append((h, ring))
    circ = 2 * math.pi * radius
    for (h0, r0), (h1, r1) in zip(rings, rings[1:]):
        for i in range(sides):
            j = (i + 1) % sides
            f = bm.faces.new([r0[i], r0[j], r1[j], r1[i]])
            for loop, (k, h) in zip(f.loops, [(i, h0), (i + 1, h0), (i + 1, h1), (i, h1)]):
                loop[uvl].uv = (u0 + k / sides * circ / 0.95, h / 1.2)
                loop[col] = fx.vcol(color_fn(h))
    top_ring = rings[-1][1]
    f = bm.faces.new(top_ring)
    for loop in f.loops:
        p = loop.vert.co
        loop[uvl].uv = (u0 + 0.3 + (p.x - x) * 0.6, 0.5 + (p.y - cy) * 0.6)
        loop[col] = fx.vcol(color_fn(top))


def wet(h):
    """Couleur de sommet (multiplie la base color) : sec, film d'algues à la ligne d'eau, bois noyé."""
    if h > 0.16:
        return (1.0, 0.99, 0.96, 1)
    if h > 0.04:
        return (0.82, 0.82, 0.74, 1)
    if h > -0.08:
        return (0.6, 0.66, 0.5, 1)
    if h > -0.28:
        return (0.48, 0.55, 0.4, 1)
    return (0.36, 0.4, 0.33, 1)


def build_lod0(col, mat):
    parts = {}
    # Planches transversales : légères variations de hauteur, de vrille et de longueur ; deux planches remplacées.
    bm = bmesh.new(); new_planks = {R.randrange(8, 44), R.randrange(8, 44)}
    for i in range(52):
        z_game = -8 + PITCH * (i + 0.5)
        tint = R.uniform(0.84, 0.98)
        c = (1.0, 0.97, 0.88, 1) if i in new_planks else (tint, tint * 0.98, tint * 0.95, 1)
        if z_game < -6.6:  # bout côté rive : terre et mousse
            c = (c[0] * 0.82, c[1] * 0.86, c[2] * 0.74, 1)
        rot = Matrix.Rotation(math.radians(R.uniform(-0.7, 0.7)), 3, 'X') @ Matrix.Rotation(math.radians(R.uniform(-0.5, 0.5)), 3, 'Z')
        length = WIDTH + R.uniform(-0.04, 0.05)
        box(bm, R.uniform(-0.025, 0.025), by(z_game), DECK_TOP - PLANK_T / 2 + R.uniform(-0.004, 0.003), length, PLANK_W, PLANK_T,
            'plank', c, u0=R.randrange(6) * BOARD_U + 0.004, v0=R.uniform(0, 1), rot=rot, skip_bottom=True)
    parts['planks'] = fx.mesh_from_bmesh('pier-planks', bm, col, mat)
    # Longerons (sous les planches), lisses de rive, chevêtres et contreventements.
    bm = bmesh.new(); dark = (0.74, 0.72, 0.66, 1)
    for x in (-0.95, 0.0, 0.95):
        box(bm, x, by(-4), DECK_TOP - PLANK_T - 0.075, 0.07, LENGTH - 0.05, 0.15, 'beam_y', dark, u0=R.randrange(6) * BOARD_U)
    for s in (-1, 1):
        box(bm, s * (WIDTH / 2 + 0.014), by(-4), DECK_TOP - PLANK_T - 0.06, 0.028, LENGTH, 0.14, 'beam_y', (0.8, 0.78, 0.72, 1), u0=R.randrange(6) * BOARD_U)
    rows = [-7.85, -6.0, -4.0, -2.0, -0.18]
    for z in rows:
        box(bm, 0, by(z), DECK_TOP - PLANK_T - 0.15 - 0.07, WIDTH + 0.12, 0.11, 0.13, 'beam_x', (0.66, 0.64, 0.58, 1) if z > -7 else (0.5, 0.5, 0.42, 1), u0=R.randrange(6) * BOARD_U)
    for z in (-4.0, -2.0):  # croix de Saint-André entre les pieux, sous le tablier
        for s in (-1, 1):
            a = math.atan2(0.55, 2.0) * s
            box(bm, 0, by(z) + 0.07 * s, -0.12, 2.25, 0.03, 0.11, 'beam_x', (0.5, 0.52, 0.42, 1), u0=R.randrange(6) * BOARD_U,
                rot=Matrix.Rotation(a, 3, 'Y'))
    parts['frame'] = fx.mesh_from_bmesh('pier-frame', bm, col, mat)
    # Pieux : sous le tablier aux rangées intermédiaires, poteaux hauts au bout et au milieu.
    bm = bmesh.new()
    for z in rows[1:]:
        tall = z in (-4.0, -0.18)
        for s in (-1, 1):
            xx = s * (1.29 if tall else 1.06)
            pile(bm, xx + R.uniform(-0.01, 0.01), z + R.uniform(-0.03, 0.03), (0.78 + R.uniform(-0.05, 0.04)) if tall else 0.08,
                 0.11 if tall else 0.095, 10, wet, lean=(R.uniform(-0.012, 0.012), R.uniform(-0.012, 0.012)), u0=R.random())
    parts['piles'] = fx.mesh_from_bmesh('pier-piles', bm, col, mat)
    return parts


def build_lod1(col, mat):
    bm = bmesh.new()
    box(bm, 0, by(-4), DECK_TOP - 0.06, WIDTH, LENGTH, 0.12, 'plank', (0.92, 0.9, 0.86, 1), u0=0.0, v0=0.0, skip_bottom=False)
    # Le tablier simplifié réutilise la texture de planches en travers (planches lues par la texture).
    uvl = bm.loops.layers.uv.verify()
    for f in bm.faces:
        if f.normal.z > 0.5:
            for loop in f.loops:
                p = loop.vert.co
                loop[uvl].uv = ((p.y + 4) / 0.92, (p.x + 1.2) / 1.2)
    for z in (-6.0, -4.0, -2.0, -0.18):
        tall = z in (-4.0, -0.18)
        for s in (-1, 1):
            pile(bm, s * (1.29 if tall else 1.06), z, 0.78 if tall else 0.08, 0.1, 6, wet)
    return fx.mesh_from_bmesh('pier-lod1', bm, col, mat)


def build_lod2(col, mat):
    bm = bmesh.new()
    box(bm, 0, by(-4), DECK_TOP - 0.1, WIDTH, LENGTH, 0.2, 'plank', (0.85, 0.83, 0.78, 1))
    uvl = bm.loops.layers.uv.verify()
    for f in bm.faces:
        if f.normal.z > 0.5:
            for loop in f.loops:
                p = loop.vert.co
                loop[uvl].uv = ((p.y + 4) / 0.92, (p.x + 1.2) / 1.2)
    for z in (-4.0, -0.18):
        for s in (-1, 1):
            box(bm, s * 1.29, by(z), 0.2, 0.18, 0.18, 1.2, 'beam_y', (0.7, 0.68, 0.6, 1))
    return fx.mesh_from_bmesh('pier-lod2', bm, col, mat)


def main():
    fx.reset()
    mat = fx.material('fdx_wood_weathered', base=os.path.join(fx.TEX_PREP, 'fdx-wood-weathered-color.jpg'),
                      normal=os.path.join(fx.TEX_PREP, 'fdx-wood-weathered-normal.jpg'), roughness=0.88, normal_strength=0.8,
                      vertex_color=True)
    parts_col = fx.collection('pier_parts_editable')
    parts = build_lod0(parts_col, mat)
    lod_col = fx.collection('pier_export')
    lod0 = fx.join([o.copy() for o in parts.values()] and [_dup(o, lod_col) for o in parts.values()], 'fdx_pier_jetty_lod0')
    for o in parts.values():
        fx.shade_smooth(o, 35)
    fx.shade_smooth(lod0, 35)
    lod1 = build_lod1(lod_col, mat); fx.shade_smooth(lod1, 35)
    lod2 = build_lod2(lod_col, mat)
    fx.save_blend(os.path.join(fx.SOURCE, 'pier_jetty.blend'))
    previews = []
    for name, o in (('lod0', lod0), ('lod1', lod1), ('lod2', lod2)):
        previews += fx.render_views([o], os.path.join(fx.PREVIEWS, 'pier', f'pier-{name}'), views=('persp', 'side', 'low') if name == 'lod0' else ('persp',))
    # Un seul GLB : trois meshes nommés *_lod0/_lod1/_lod2 qui partagent matériau et textures.
    # Les distances de bascule sont déclarées dans src/render/environment-registry.json (lod.levels).
    lod1.name = lod1.data.name = 'fdx_pier_jetty_lod1'; lod2.name = lod2.data.name = 'fdx_pier_jetty_lod2'
    glb = fx.export_glb([lod0, lod1, lod2], os.path.join(fx.RUNTIME, 'fdx-pier-jetty.glb'))
    stats = {n: {'triangles': fx.triangles(o)} for n, o in (('lod0', lod0), ('lod1', lod1), ('lod2', lod2))}
    reports = fx.inspect_glb(glb); reports['per_lod'] = stats
    fx.write_json(os.path.join(fx.REPORTS, 'export', 'pier_jetty.json'), {
        'id': 'pier_jetty', 'seed': SEED, 'script': 'production_3d/environment/tools/build_pier.py',
        'source_blend': 'production_3d/environment/source/pier_jetty.blend',
        'pivot': 'niveau de l’eau (y=0), axe du ponton, milieu de la longueur ; placement étang (0,0,-4), yaw 0',
        'deck_top_y': DECK_TOP, 'length_m': LENGTH, 'width_m': WIDTH, 'materials': 1,
        'textures': ['fdx-wood-weathered-color.jpg (1024, sRGB)', 'fdx-wood-weathered-normal.jpg (512, linéaire)'],
        'export': reports, 'previews': previews})
    print('PIER', reports['triangles'], reports['bytes'], stats)


def _dup(o, col):
    c = o.copy(); c.data = o.data.copy(); col.objects.link(c); return c


main()
