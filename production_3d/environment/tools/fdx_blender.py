"""Outils communs FishDex pour Blender 5.1 (bpy, mode --background).

Conventions :
- unités métriques, 1 unité = 1 m ;
- export glTF +Y up : Blender -Y devient Babylon +Z (vers l'eau au ponton), Blender +X devient Babylon -X
  (rotation de 180° autour de la verticale, pas de miroir) ; vérifié par build_calibration.py ;
- pivots documentés par asset dans le rapport ; aucune transformation non appliquée à l'export ;
- matières naturelles : metallic 0, roughness élevée ; base color sRGB, normal map linéaire (OpenGL, Y+).
"""
import bpy, bmesh, json, math, os, random, sys, hashlib
from mathutils import Vector, Matrix

TOOLS = os.path.dirname(os.path.abspath(__file__))
ENV = os.path.dirname(TOOLS)
ROOT = os.path.dirname(os.path.dirname(ENV))
TEX_SRC = os.path.join(ENV, 'textures', 'source')
TEX_PREP = os.path.join(ENV, 'textures', 'prepared')
SOURCE = os.path.join(ENV, 'source')
EXPORTS = os.path.join(ENV, 'exports')
PREVIEWS = os.path.join(ENV, 'previews')
REPORTS = os.path.join(ENV, 'reports')
RUNTIME = os.path.join(ROOT, 'public', 'models', 'environment')
for _d in (SOURCE, EXPORTS, PREVIEWS, REPORTS, TEX_PREP):
    os.makedirs(_d, exist_ok=True)


def cli_args():
    argv = sys.argv
    return argv[argv.index('--') + 1:] if '--' in argv else []


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.unit_settings.system = 'METRIC'
    s.unit_settings.scale_length = 1.0
    return s


def collection(name, parent=None):
    col = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if col.name not in (parent or bpy.context.scene.collection).children:
        (parent or bpy.context.scene.collection).children.link(col)
    return col


def link(obj, col=None):
    (col or bpy.context.scene.collection).objects.link(obj)
    return obj


def image(path, non_color=False):
    img = bpy.data.images.load(path, check_existing=True)
    if non_color:
        img.colorspace_settings.name = 'Non-Color'
    return img


def material(name, base=None, normal=None, color=(0.5, 0.5, 0.5, 1), roughness=0.9, metallic=0.0,
             normal_strength=1.0, alpha_clip=None, vertex_color=False, double_sided=False):
    """Matériau Principled exportable glTF : base color (texture x facteur x couleur de sommet), normal, rugosité."""
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); out.location = (400, 0)
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled'); bsdf.location = (100, 0)
    nt.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Base Color'].default_value = color
    col_socket = None
    if base:
        t = nt.nodes.new('ShaderNodeTexImage'); t.location = (-500, 150); t.image = image(base)
        col_socket = t.outputs['Color']
        if alpha_clip is not None:
            nt.links.new(t.outputs['Alpha'], bsdf.inputs['Alpha'])
    if vertex_color:
        vc = nt.nodes.new('ShaderNodeVertexColor'); vc.location = (-500, -100); vc.layer_name = 'Col'
        if col_socket is not None:
            mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.location = (-200, 100)
            mix.inputs['Factor'].default_value = 1.0
            nt.links.new(col_socket, mix.inputs[6]); nt.links.new(vc.outputs['Color'], mix.inputs[7])
            col_socket = mix.outputs[2]
        else:
            col_socket = vc.outputs['Color']
    if col_socket is not None:
        nt.links.new(col_socket, bsdf.inputs['Base Color'])
    if normal:
        n = nt.nodes.new('ShaderNodeTexImage'); n.location = (-500, -350); n.image = image(normal, non_color=True)
        nm = nt.nodes.new('ShaderNodeNormalMap'); nm.location = (-200, -350); nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(n.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
    if alpha_clip is not None:
        m.blend_method = 'CLIP' if hasattr(m, 'blend_method') else None
        try:
            m.alpha_threshold = alpha_clip
        except AttributeError:
            pass
        m.surface_render_method = 'DITHERED'
    m.use_backface_culling = not double_sided
    return m


def mesh_from_bmesh(name, bm, col=None, mat=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new(name, me)
    link(obj, col)
    if mat:
        me.materials.append(mat)
    return obj


def shade_smooth(obj, angle_deg=40):
    me = obj.data
    for p in me.polygons:
        p.use_smooth = True
    try:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.shade_auto_smooth(angle=math.radians(angle_deg))
        obj.select_set(False)
    except Exception:
        pass


def apply_all(obj):
    """Applique modificateurs et transformations (l'export reste sans transformation cachée)."""
    bpy.context.view_layer.objects.active = obj
    for o in bpy.context.selected_objects:
        o.select_set(False)
    obj.select_set(True)
    for mod in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.select_set(False)


def join(objs, name):
    for o in bpy.context.selected_objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.name = name; obj.data.name = name
    obj.select_set(False)
    return obj


def triangles(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


def bounds(objs):
    lo = Vector((1e9, 1e9, 1e9)); hi = Vector((-1e9, -1e9, -1e9))
    for o in objs:
        if o.type != 'MESH':
            continue
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi


def decimate_copy(obj, ratio, name, planar=False):
    """Copie décimée pour LOD : garde UV et matériaux ; la silhouette est vérifiée sur les rendus."""
    c = obj.copy(); c.data = obj.data.copy(); c.name = name; c.data.name = name
    for col in obj.users_collection:
        col.objects.link(c)
    mod = c.modifiers.new('lod', 'DECIMATE')
    if planar:
        mod.decimate_type = 'DISSOLVE'; mod.angle_limit = math.radians(ratio)
    else:
        mod.ratio = ratio
        mod.use_collapse_triangulate = True
    apply_all(c)
    return c


def export_glb(objs, path, image_format='AUTO', jpeg_quality=85):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_apply=True,
                              export_yup=True, export_texcoords=True, export_normals=True, export_tangents=False,
                              export_materials='EXPORT', export_image_format=image_format,
                              export_jpeg_quality=jpeg_quality, export_vertex_color='MATERIAL',
                              export_cameras=False, export_lights=False, export_extras=False)
    for o in objs:
        o.select_set(False)
    return path


def inspect_glb(path):
    """Réimporte le GLB dans une scène neuve et relève ce que le moteur recevra."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    lo, hi = bounds(meshes)
    mats = sorted({s.material.name for o in meshes for s in o.material_slots if s.material})
    imgs = [{'name': i.name, 'size': list(i.size)} for i in bpy.data.images if i.size[0]]
    return {
        'file': os.path.relpath(path, ROOT).replace('\\', '/'),
        'bytes': os.path.getsize(path),
        'sha256': hashlib.sha256(open(path, 'rb').read()).hexdigest(),
        'meshes': len(meshes),
        'triangles': sum(triangles(o) for o in meshes),
        'vertices': sum(len(o.data.vertices) for o in meshes),
        'materials': mats,
        'images': imgs,
        'uv_layers': sorted({uv.name for o in meshes for uv in o.data.uv_layers}),
        'vertex_colors': any(len(o.data.color_attributes) for o in meshes),
        'bounds_blender_min': [round(v, 4) for v in lo],
        'bounds_blender_max': [round(v, 4) for v in hi],
        'size_m_xyz_blender': [round(h - l, 4) for l, h in zip(lo, hi)],
    }


def save_blend(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=path, compress=True)


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')


def render_views(objs, prefix, views=('front', 'side', 'top', 'persp'), size=(900, 600), background=(0.78, 0.82, 0.82)):
    """Planches de contrôle EEVEE (preuves de contrôle, jamais distribuées au navigateur)."""
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x, scene.render.resolution_y = size
    scene.render.film_transparent = False
    scene.view_settings.view_transform = 'Standard'
    scene.render.image_settings.file_format = 'JPEG'; scene.render.image_settings.quality = 88
    world = bpy.data.worlds.get('fdx-preview') or bpy.data.worlds.new('fdx-preview')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (*background, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
    scene.world = world
    sun = bpy.data.objects.get('fdx-preview-sun')
    if not sun:
        sun = bpy.data.objects.new('fdx-preview-sun', bpy.data.lights.new('fdx-preview-sun', 'SUN'))
        scene.collection.objects.link(sun)
    sun.data.energy = 3.2
    sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(35))
    lo, hi = bounds(objs)
    center = (lo + hi) / 2; ext = max((hi - lo).length, 0.5)
    cam = bpy.data.objects.get('fdx-preview-cam')
    if not cam:
        cam = bpy.data.objects.new('fdx-preview-cam', bpy.data.cameras.new('fdx-preview-cam'))
        scene.collection.objects.link(cam)
    scene.camera = cam
    hidden = []
    for o in scene.objects:
        if o.type == 'MESH' and o not in objs and not o.hide_render:
            o.hide_render = True; hidden.append(o)
    dirs = {'front': Vector((0, -1, 0.0001)), 'back': Vector((0, 1, 0.0001)), 'side': Vector((1, 0, 0.0001)),
            'top': Vector((0.0001, -0.0001, 1)), 'persp': Vector((0.8, -1.1, 0.65)), 'low': Vector((0.9, -1.0, 0.12))}
    out = []
    for v in views:
        d = dirs[v].normalized()
        cam.data.type = 'PERSP' if v in ('persp', 'low') else 'ORTHO'
        cam.data.ortho_scale = ext * 1.08
        cam.data.lens = 50
        cam.data.clip_end = ext * 20
        cam.location = center + d * ext * (2.2 if cam.data.type == 'PERSP' else 4)
        cam.rotation_euler = (center - cam.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = f'{prefix}-{v}.jpg'
        bpy.ops.render.render(write_still=True)
        out.append(os.path.relpath(scene.render.filepath, ROOT).replace('\\', '/'))
    for o in hidden:
        o.hide_render = False
    return out


def box_bm(bm, sx, sy, sz, center=(0, 0, 0)):
    r = bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector((sx, sy, sz)), verts=r['verts'])
    bmesh.ops.translate(bm, vec=Vector(center), verts=r['verts'])
    return r['verts']


def rng(seed):
    return random.Random(seed)


def vcol(c):
    """Couleur de sommet voulue comme multiplicateur dans Babylon (StandardMaterial, espace gamma).
    Les couches couleur Blender sont stockées en sRGB et l'exporteur glTF les linéarise : on encode donc
    le multiplicateur en sRGB pour qu'il ressorte inchangé dans COLOR_0."""
    def enc(v):
        v = max(0.0, min(1.0, v))
        return v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055
    return (enc(c[0]), enc(c[1]), enc(c[2]), c[3] if len(c) > 3 else 1.0)
