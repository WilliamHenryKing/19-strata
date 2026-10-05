"""STRATA / a clay atelier opening through layered arcades into a planted court.

Original architecture, joinery, furniture and objects, authored at metre scale.
The coordinating renderer supplies the photographed CC0 PBR materials, HDRI,
CUDA configuration and output. This module only constructs one complete world
and selects its wide or detail camera; it never renders or writes files.
"""

import math
import random

import bmesh
import bpy
from mathutils import Vector
from mathutils.geometry import interpolate_bezier

from world_common import (
    baked_cloth,
    area,
    branch,
    camera,
    cube,
    cylinder,
    lathe_vessel,
    leaf_material,
    material,
    plant,
    poly_curve,
    rounded_box,
    sun,
    uv_project,
)


def mesh_object(name, vertices, faces, mat, bevel=0, smooth=False):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    mesh.materials.append(mat)
    uv_project(obj)
    if smooth:
        for face in mesh.polygons:
            face.use_smooth = True
    if bevel:
        modifier = obj.modifiers.new('Small constructed edge radius', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 3
        modifier.limit_method = 'ANGLE'
        normal = obj.modifiers.new('Weighted masonry normals', 'WEIGHTED_NORMAL')
        normal.keep_sharp = True
    return obj


def lathe(name, position, profile, mat, segments=96):
    """Closed ceramic/metal wall profile, including its actual inner surface."""
    vertices = [
        (r * math.cos(i * math.tau / segments),
         r * math.sin(i * math.tau / segments), z)
        for r, z in profile for i in range(segments)
    ]
    faces = []
    for j in range(len(profile) - 1):
        for i in range(segments):
            k = (i + 1) % segments
            faces.append((j * segments + i, j * segments + k,
                          (j + 1) * segments + k, (j + 1) * segments + i))
    obj = mesh_object(name, vertices, faces, mat, smooth=True)
    obj.location = position
    return obj


def arch_head(name, x, y, width, spring, top, depth, mat):
    """Solid spandrel over a real clear opening; no boolean cutter or false facade."""
    count = 96
    radius = width / 2
    vertices = []
    for yy in (y - depth / 2, y + depth / 2):
        for i in range(count + 1):
            a = math.pi * (1 - i / count)
            xx = x + math.cos(a) * radius
            zz = spring + math.sin(a) * radius
            vertices.extend(((xx, yy, zz), (xx, yy, top)))
    stride = 2 * (count + 1)
    faces = []
    for i in range(count):
        a = 2 * i
        b = a + 2
        faces.extend(((a, b, b + 1, a + 1),
                      (stride + a, stride + a + 1, stride + b + 1, stride + b),
                      (a, stride + a, stride + b, b),
                      (a + 1, b + 1, stride + b + 1, stride + a + 1)))
    faces.extend(((0, 1, stride + 1, stride),
                  (2 * count, stride + 2 * count,
                   stride + 2 * count + 1, 2 * count + 1)))
    return mesh_object(name, vertices, faces, mat, bevel=.012)


def arcade(name, y, mat, height=4.4, spring=2.53, depth=.52):
    openings = [(-3.14, 2.02), (0, 2.40), (3.14, 2.02)]
    cursor = -4.85
    for index, (centre, width) in enumerate(openings):
        left, right = centre - width / 2, centre + width / 2
        cube(f'{name} / substantial pier {index}',
             ((cursor + left) / 2, y, height / 2),
             (left - cursor, depth, height), mat, .012)
        arch_head(f'{name} / continuous curved reveal {index}',
                  centre, y, width, spring, height, depth, mat)
        cursor = right
    cube(f'{name} / terminal pier', ((cursor + 4.85) / 2, y, height / 2),
         (4.85 - cursor, depth, height), mat, .012)


def tiled_floor(m):
    cube('Continuous structural floor below real stone joints',
         (0, -1, -.17), (10.1, 11.2, .20), m['concrete'], .005)
    pitch_x, pitch_y = .97, 1.03
    for i in range(10):
        for j in range(11):
            # Each slab has its own UV origin, eased arris and 3 mm mortar joint.
            cube(f'Interior honed limestone slab {i:02}-{j:02}',
                 ((i - 4.5) * pitch_x, -5.7 + j * pitch_y, -.035),
                 (pitch_x - .003, pitch_y - .003, .07), m['floor'], .003)
    cube('Stone sill across atelier courtyard threshold', (0, 3.84, .025),
         (9.65, .65, .05), m['stone'], .006)
    # A continuous courtyard path can be followed through both rows of openings.
    for i in range(4):
        for j in range(9):
            cube(f'Courtyard paving {i:02}-{j:02}',
                 ((i - 1.5) * .80, 4.65 + j * .90, -.045),
                 (.794, .894, .09), m['floor'], .004)
    cube('Courtyard earth substrate', (0, 8.4, -.17), (10.8, 9.4, .25), m['soil'], 0)


def architecture(m):
    # Camera is within a genuine enclosed atelier, looking north into the court.
    cube('Left handworked wall / full depth', (-4.87, -.95, 2.20),
         (.34, 10.1, 4.40), m['clay'], .012)
    cube('Right handworked wall / foreground depth', (4.87, -.95, 2.20),
         (.34, 10.1, 4.40), m['clay'], .012)
    arcade('Atelier courtyard arcade', 3.92, m['clay'])
    # A foreground reveal describes the entrance without putting a slab in front of the camera.
    cube('Entry reveal at near right edge', (4.30, -5.76, 2.20),
         (1.20, .50, 4.40), m['clay'], .013)
    cube('Entry upper lintel', (0, -5.76, 4.17), (9.6, .50, .46), m['clay'], .014)
    cube('Left limestone skirting', (-4.676, -.85, .055),
         (.025, 9.75, .11), m['stone'], .003)
    cube('Right limestone skirting', (4.676, -.85, .055),
         (.025, 9.75, .11), m['stone'], .003)

    # Built roof surrounds an elongated glazed light well, with deep visible reveals.
    cube('Lime ceiling above sample wall', (-2.91, -.90, 4.48),
         (3.90, 10.1, .22), m['plaster'], .015)
    cube('Lime ceiling above entry', (1.94, -4.40, 4.48),
         (5.80, 3.10, .22), m['plaster'], .015)
    cube('Lime ceiling courtyard cross beam', (1.94, 3.64, 4.48),
         (5.80, .84, .22), m['plaster'], .015)
    cube('Skylight right edge beam', (4.58, .10, 4.48),
         (.52, 6.35, .22), m['plaster'], .015)
    for i in range(7):
        x = -.53 + i * .78
        cube(f'Exposed oak roof joist {i}', (x, .14, 4.50),
             (.105, 6.22, .26), m['oak'], .006)
    cube('Clear skylight over atelier', (1.67, .15, 4.68),
         (5.34, 6.23, .014), m['glass'], .001)

    # Opposing walls and a second arcade make the garden a place, not a backdrop.
    cube('Court left enclosure', (-4.87, 8.37, 1.87),
         (.34, 8.50, 3.74), m['clay'], .012)
    cube('Court right enclosure', (4.87, 8.37, 1.87),
         (.34, 8.50, 3.74), m['clay'], .012)
    arcade('Receding garden colonnade', 10.22, m['clay'],
           height=3.93, spring=2.19, depth=.44)
    cube('Distant garden end wall', (0, 13.45, 1.75),
         (10.0, .35, 3.50), m['plaster'], .012)
    for side in (-1, 1):
        cube(f'Sheltered court canopy {side}', (side * 3.82, 7.1, 3.90),
             (2.10, 6.20, .18), m['clay'], .012)
        for j in range(7):
            cube(f'Garden oak rafter {side}-{j}', (side * 3.85, 4.9 + j * .78, 3.78),
                 (2.12, .07, .13), m['oak'], .004)


def sideboard(m):
    # Five full-height doors, toe-kick, a countertop and separate back panels.
    cube('Archive cabinet recessed dark toe kick', (-4.19, .0, .08),
         (.64, 5.38, .16), m['ink'], .003)
    cube('Archive cabinet walnut carcass', (-4.18, .0, .49),
         (.73, 5.50, .70), m['walnut'], .006)
    for i in range(5):
        y = -2.15 + i * 1.075
        cube(f'Archive door {i} / separate face', (-3.788, y, .49),
             (.037, 1.064, .68), m['walnut'], .004)
        for j in range(23):
            cylinder(f'Archive door {i} / convex wood flute {j}',
                     (-3.760, y - .497 + j * .045, .49),
                     .020, .65, m['walnut'], vertices=16, bevel=.001)
        cube(f'Archive door {i} / satin pull', (-3.731, y + .36, .66),
             (.035, .15, .012), m['brass'], .003)
    cube('Archive shadow joint below stone', (-4.16, 0, .859),
         (.80, 5.58, .017), m['ink'], .002)
    cube('Archive honed stone top / eased 45 mm edge', (-4.12, 0, .89),
         (.91, 5.64, .05), m['stone'], .009)

    for z in (1.48, 2.27):
        cube(f'Sample wall oak shelf at {z}', (-4.35, .05, z),
             (.58, 5.15, .044), m['oak'], .005)
        for y in (-2.1, -.65, .80, 2.20):
            cube('Recessed metal shelf bracket', (-4.48, y, z - .072),
                 (.28, .018, .12), m['brass'], .002)
    # Upright, supported finish samples create readable, physically plausible scale.
    finish_order = ['stone', 'clay', 'plaster', 'metal', 'oak', 'stone', 'walnut']
    for i, key in enumerate(finish_order):
        y = -2.03 + i * .63
        obj = cube(f'Archive finish sample / {key} {i}', (-4.50, y, 1.805),
                   (.025, .47, .60), m[key], .003)
        obj.rotation_euler[1] = -.05
        cube('Sample stop rail', (-4.12, y, 1.51), (.026, .50, .025), m['brass'], .002)
    for i in range(4):
        # Horizontal folios sit on the top shelf rather than hover in a display grid.
        cube(f'Material folio {i}', (-4.25, -.70, 2.31 + i * .032),
             (.38, .73 - .025 * i, .027), m['linen'] if i % 2 else m['clay'], .002)
    vessel = lathe_vessel('Archive ceramic vessel / open rim', (-4.18, 1.75, 2.297), m['clay'])
    vessel.scale = (.78, .78, .78)
    lathe_vessel('Low shelf stoneware vessel', (-4.04, -1.68, .92), m['plaster'])


def workbench(m):
    cube('Workbench floating appearance grounded by recessed toe kick',
         (-.45, -.10, .082), (3.12, 1.03, .164), m['ink'], .006)
    cube('Workbench structural walnut body', (-.45, -.10, .50),
         (3.20, 1.24, .73), m['walnut'], .008)
    # Three separate fronts with rounded solid timber beads and 4 mm door reveals.
    for door in range(3):
        x = -1.53 + door * 1.08
        cube(f'Workbench drawer front {door}', (x, -.744, .51),
             (1.074, .030, .682), m['walnut'], .003)
        for i in range(24):
            cylinder(f'Workbench front {door} / solid walnut flute {i}',
                     (x - .516 + i * .0448, -.766, .51),
                     .0215, .667, m['walnut'], vertices=20, bevel=.001)
        cube(f'Workbench drawer recessed pull {door}', (x, -.793, .797),
             (.235, .022, .012), m['brass'], .003)
    for x in (-2.07, 1.17):
        cube('Workbench stone gable / supported edge', (x, -.10, .49),
             (.09, 1.28, .77), m['stone'], .006)
    cube('Workbench fine recessed metal joint', (-.45, -.10, .89),
         (3.49, 1.40, .017), m['metal'], .002)
    cube('Workbench continuous honed slab / full 65 mm section',
         (-.45, -.10, .934), (3.62, 1.52, .068), m['stone'], .015)

    # Material selection lies on the actual working surface, not a floating sculpture.
    for i, key in enumerate(('clay', 'walnut', 'plaster')):
        sample = cube(f'Loose workshop finish sample {key}',
                      (-1.45 + i * .34, -.24 + i * .045, .981 + i * .010),
                      (.47, .34, .019), m[key], .004)
        sample.rotation_euler[2] = -.11 + i * .09
    cube('Brushed metal finish coupon', (-1.41, .20, .98),
         (.42, .17, .012), m['metal'], .004)
    # Thin paper leaves, folded book cover and a real-scale 300 mm brass rule.
    paper = material('STRATA / warm uncoated drawing paper', (.65, .62, .53),
                     (.79, .76, .65), .91, (4, 4, 4))
    for i in range(5):
        obj = cube(f'Working drawing sheet {i}', (.22, -.29, .971 + i * .001),
                   (.59, .42, .0007), paper, 0)
        obj.rotation_euler[2] = -.14 + i * .007
    rule = cube('Solid brass 300 mm straightedge', (.12, -.35, .978),
                (.30, .025, .002), m['brass'], .0006)
    rule.rotation_euler[2] = -.14
    for i in range(31):
        length = .013 if i % 10 == 0 else (.009 if i % 5 == 0 else .005)
        mark = cube(f'Engraved rule division {i}',
                    (-.029 + .0099 * i, -.357, .9791),
                    (.00035, length, .00015), m['ink'], 0)
        # Rotate each engraving about the rule centre, keeping it on its surface.
        v = Vector(mark.location) - Vector((.12, -.35, .978))
        mark.location = (.12 + v.x * math.cos(-.14) - v.y * math.sin(-.14),
                         -.35 + v.x * math.sin(-.14) + v.y * math.cos(-.14), .9791)
        mark.rotation_euler[2] = -.14
    branch('Graphite pencil / oiled cedar', (.01, -.48, .981),
           (.19, -.405, .981), .0034, m['oak'], .0034)

    glaze = material('STRATA / aubergine glazed ceramic', (.037, .009, .021),
                     (.13, .042, .063), .24, (5, 5, 5))
    bowl_profile = [(.001, 0), (.08, 0), (.10, .014), (.18, .064), (.23, .105),
                    (.24, .119), (.24, .131), (.224, .132), (.213, .114),
                    (.17, .081), (.09, .034), (.001, .022)]
    lathe('Glazed aubergine bowl / thin open rim', (.71, .05, .969), bowl_profile, glaze)
    cup_profile = [(.001, 0), (.047, 0), (.056, .016), (.058, .105), (.061, .122),
                   (.059, .128), (.052, .128), (.049, .115), (.047, .018), (.001, .015)]
    lathe('Stoneware coffee cup / open cavity', (.84, -.42, .969), cup_profile, m['clay'])
    lathe('Small brushed sample tray', (-1.70, .37, .969),
          [(.001, 0), (.115, 0), (.125, .018), (.125, .022),
           (.119, .022), (.112, .008), (.001, .008)], m['metal'])


def chair(name, position, angle, m):
    """Joinery-scale walnut counter chair with rails, braced legs and sewn upholstery."""
    origin = Vector(position)
    ca, sa = math.cos(angle), math.sin(angle)

    def point(co):
        return origin + Vector((co[0] * ca - co[1] * sa,
                                co[0] * sa + co[1] * ca, co[2]))

    for side in (-1, 1):
        branch(name + ' / front tapered leg', point((side * .205, -.195, .03)),
               point((side * .17, -.15, .62)), .022, m['walnut'], .030)
        branch(name + ' / continuous rear leg', point((side * .22, .22, .03)),
               point((side * .18, .185, .97)), .021, m['walnut'], .025)
        branch(name + ' / side stretcher', point((side * .195, -.18, .25)),
               point((side * .205, .215, .25)), .013, m['walnut'], .013)
        branch(name + ' / seat side rail', point((side * .19, -.20, .595)),
               point((side * .19, .21, .595)), .027, m['walnut'], .027)
    branch(name + ' / brass foot rail', point((-.195, -.18, .25)),
           point((.195, -.18, .25)), .012, m['brass'], .012)
    for z in (.595, .95):
        poly_curve(name + ' / curved back rail',
                   [point((-.22, .16, z)), point((0, .252, z)), point((.22, .16, z))],
                   .027, m['walnut'])
    for i in range(7):
        x = -.168 + i * .056
        y = .241 - .073 * (x / .20) ** 2
        branch(name + f' / carved back spindle {i}', point((x, y, .63)),
               point((x, y, .932)), .008, m['walnut'], .010)
    cushion = rounded_box(name + ' / rounded woven seat', point((0, -.005, .646)),
                          (.47, .46, .097), m['linen'], .047)
    cushion.rotation_euler[2] = angle
    seam = []
    for i in range(65):
        a = i * math.tau / 64
        # Superellipse seam follows the upholstered rounded rectangular perimeter.
        xx = .211 * math.copysign(abs(math.cos(a)) ** .34, math.cos(a))
        yy = .207 * math.copysign(abs(math.sin(a)) ** .34, math.sin(a))
        seam.append(point((xx, yy - .005, .651)))
    poly_curve(name + ' / hand sewn seat piping', seam, .0018, m['linen'])


def bench_and_lights(m):
    # A partial foreground bench is low enough to preserve the view through the room.
    for x in (-3.07, -1.32):
        cube('Entry bench solid limestone support', (x, -3.78, .225),
             (.16, .52, .45), m['stone'], .010)
    cube('Entry bench thick limestone seat', (-2.20, -3.78, .483),
         (2.36, .64, .073), m['stone'], .014)
    rounded_box('Entry bench woven loose cushion', (-2.60, -3.80, .562),
                (.85, .56, .096), m['linen'], .048)
    baked_cloth('strata',m['linen'],'Bench linen throw / actual simulated drape')
    chair('Near walnut counter chair', (1.82, -1.85, 0), math.radians(-18), m)
    chair('Second walnut counter chair', (.45, -1.90, 0), math.radians(9), m)

    # A brushed aluminium pendant reflects the real room and sky rather than a studio card.
    shade_profile = [(.058, .255), (.074, .244), (.13, .176), (.21, .065),
                     (.26, .012), (.264, .004), (.264, 0), (.252, 0),
                     (.205, .058), (.122, .173), (.064, .236), (.055, .244)]
    lathe('Brushed aluminium atelier pendant / hollow shade',
          (-.53, .12, 2.39), shade_profile, m['metal'])
    cylinder('Pendant fabric flex', (-.53, .12, 3.53), .004, 1.79, m['ink'], 12, .0003)
    cylinder('Pendant ceiling rose', (-.53, .12, 4.42), .068, .032, m['metal'], 48, .004)
    cylinder('Pendant opal diffuser', (-.53, .12, 2.43), .152, .015, m['plaster'], 64, .005)
    area('Subtle warm pendant pool', (-.53, .12, 2.41), (-.53, .12, .90),
         16, (1, .82, .65), .24)


def gravel(name, centre, width, depth, mat, count=230, seed=22):
    rng = random.Random(seed)
    vertices, faces = [], []
    for _ in range(count):
        x, y = centre[0] + rng.uniform(-width / 2, width / 2), centre[1] + rng.uniform(-depth / 2, depth / 2)
        radius = rng.uniform(.012, .035)
        scale = rng.uniform(.6, 1.5)
        index = len(vertices)
        for j in range(5):
            latitude = j * math.pi / 4
            for k in range(8):
                angle = k * math.tau / 8
                vertices.append((x + radius * math.sin(latitude) * math.cos(angle),
                                 y + radius * math.sin(latitude) * math.sin(angle) * scale,
                                 centre[2] + radius * (.4 + .55 * math.cos(latitude))))
        for j in range(4):
            for k in range(8):
                a, b = index + j * 8 + k, index + j * 8 + (k + 1) % 8
                faces.append((a, b, b + 8, a + 8))
    return mesh_object(name, vertices, faces, mat, smooth=True)


# Mediterranean planting. Deliberately scene-local: the checkpoint renderer fingerprints
# world_common.py for every scene, so improving the shared tree would discard AUREL's
# completed, reviewed master. SOLARIS carries an identical copy for the same reason.
OLIVE_LEAVES = (('Olive leaf / grey-green upper', (.066, .082, .036)),
                ('Olive leaf / silvered underside', (.15, .165, .118)),
                ('Olive leaf / shaded inner leaf', (.036, .05, .02)),
                ('Olive leaf / young sunlit growth', (.098, .125, .044)))
OLIVE_WEIGHTS = (5, 2, 3, 1)
CYPRESS_LEAVES = (('Cypress scale foliage / deep green', (.016, .036, .015)),
                  ('Cypress scale foliage / lit sprays', (.036, .064, .024)))
CYPRESS_WEIGHTS = (3, 1)
SHRUBS = {
    'pittosporum': ((('Clipped pittosporum / glossy green', (.042, .075, .026)),
                     ('Clipped pittosporum / new growth', (.075, .11, .035))), (4, 1), .05, .022),
    'santolina': ((('Santolina mound / grey-green', (.11, .125, .08)),
                   ('Santolina mound / shaded', (.06, .07, .045))), (3, 2), .036, .014),
    'rosemary': ((('Rosemary / dark needle green', (.035, .055, .028)),
                  ('Rosemary / silvered needle', (.09, .105, .075))), (3, 1), .045, .009),
}


def foliage_object(name, buffers, palette):
    verts, faces, indices = buffers
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    # Leaf shaders ignore UVs; a placeholder layer spares the renderer's per-loop projection.
    mesh.uv_layers.new(name='Leaf / unused')
    for label, colour in palette:
        mesh.materials.append(leaf_material(label, colour))
    mesh.polygons.foreach_set('material_index', indices)
    mesh.polygons.foreach_set('use_smooth', [True] * len(faces))
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj['leaves'] = len(faces) // 4
    return obj


def leaf_shell(rng, buffers, centre, radii, count, length, width, weights, lift=.55, keep=None):
    """Leaves through an ellipsoid clump, densest towards its surface, facing outwards and upwards."""
    verts, faces, indices = buffers
    choices = range(len(weights))
    for _ in range(count):
        z = rng.uniform(-1, 1)
        a = rng.uniform(0, math.tau)
        s = math.sqrt(max(0., 1 - z * z))
        d = Vector((s * math.cos(a), s * math.sin(a), z))
        r = 1 - .62 * rng.random() ** 1.6
        p = Vector((centre[0] + d.x * radii[0] * r, centre[1] + d.y * radii[1] * r,
                    centre[2] + d.z * radii[2] * r))
        if keep and not keep(p):
            continue
        n = Vector((d.x + rng.uniform(-.5, .5), d.y + rng.uniform(-.5, .5),
                    d.z + rng.uniform(.05, lift + .25)))
        n.normalize()
        t = n.cross(Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))))
        u = (t if t.length > 1e-5 else n.orthogonal()).normalized()
        v = n.cross(u)
        leaf = length * rng.uniform(.72, 1.28)
        half = width * rng.uniform(.4, .6)
        k = len(verts)
        verts.extend((p - u * (leaf * .45), p + v * half - u * (leaf * .1),
                      p + u * (leaf * .55) - n * (leaf * .08), p - v * half - u * (leaf * .1),
                      p + n * (leaf * .035)))
        faces.extend(((k + 4, k, k + 1), (k + 4, k + 1, k + 2),
                      (k + 4, k + 2, k + 3), (k + 4, k + 3, k)))
        shade = rng.choices(choices, weights=weights)[0]
        indices.extend((shade, shade, shade, shade))


def shell_count(radius, length, width, density, coverage=.25):
    return max(24, int(density * coverage * 4 * math.pi * radius * radius / (.5 * length * width)))


def tube(name, points, radii, mat, sides=14):
    """One continuous swept limb: no internal caps, kinks or bark seams between segments."""
    count = len(points)
    tangents = [(points[min(count - 1, k + 1)] - points[max(0, k - 1)]).normalized() for k in range(count)]
    reference = Vector((0, 0, 1)) if abs(tangents[0].z) < .9 else Vector((1, 0, 0))
    normal = tangents[0].cross(reference).normalized()
    verts, faces, along = [], [], [0.]
    for k in range(count):
        tangent = tangents[k]
        normal = (normal - tangent * normal.dot(tangent)).normalized()  # parallel transport
        binormal = tangent.cross(normal)
        if k:
            along.append(along[-1] + (points[k] - points[k - 1]).length)
        for i in range(sides):
            a = i / sides * math.tau
            verts.append(points[k] + (normal * math.cos(a) + binormal * math.sin(a)) * radii[k])
    for k in range(count - 1):
        for i in range(sides):
            j = (i + 1) % sides
            faces.append((k * sides + i, k * sides + j, (k + 1) * sides + j, (k + 1) * sides + i))
    faces.append(tuple(range(sides - 1, -1, -1)))
    faces.append(tuple((count - 1) * sides + i for i in range(sides)))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    layer = mesh.uv_layers.new(name='Bark / around and along limb in metres')
    for poly in mesh.polygons:
        poly.use_smooth = len(poly.vertices) == 4
        wrap = len(poly.vertices) == 4 and poly.vertices[0] % sides == sides - 1
        for loop in poly.loop_indices:
            index = mesh.loops[loop].vertex_index
            ring, step = divmod(index, sides)
            if wrap and step == 0:
                step = sides
            layer.data[loop].uv = (step / sides * math.tau * radii[ring], along[ring])
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    mesh.materials.append(mat)
    return obj


def olive_bark(name):
    """Fissured grey bark: Voronoi plates stretched along each swept limb's length."""
    mat = bpy.data.materials.get(name)
    if mat:
        return mat
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    shader = nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value = .9
    coord = nodes.new('ShaderNodeTexCoord')
    mapping = nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value = (9, 2.6, 1)
    links.new(coord.outputs['UV'], mapping.inputs['Vector'])
    warp = nodes.new('ShaderNodeTexNoise')
    warp.inputs['Scale'].default_value = 3
    warp.inputs['Detail'].default_value = 3
    links.new(mapping.outputs['Vector'], warp.inputs['Vector'])
    offset = nodes.new('ShaderNodeVectorMath')
    offset.operation = 'MULTIPLY_ADD'
    offset.inputs[1].default_value = (.35, .35, .35)
    links.new(warp.outputs['Color'], offset.inputs[0])
    links.new(mapping.outputs['Vector'], offset.inputs[2])
    plates = nodes.new('ShaderNodeTexVoronoi')
    plates.feature = 'DISTANCE_TO_EDGE'
    plates.inputs['Scale'].default_value = 7.5
    links.new(offset.outputs['Vector'], plates.inputs['Vector'])
    colour = nodes.new('ShaderNodeValToRGB')
    colour.color_ramp.elements[0].position = .0
    colour.color_ramp.elements[0].color = (.018, .016, .013, 1)
    colour.color_ramp.elements[1].position = .06
    colour.color_ramp.elements[1].color = (.115, .108, .09, 1)
    links.new(plates.outputs['Distance'], colour.inputs['Fac'])
    links.new(colour.outputs['Color'], shader.inputs['Base Color'])
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = .55
    bump.inputs['Distance'].default_value = .006
    links.new(plates.outputs['Distance'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    return mat


def olive_tree(name, pos, height=4.5, seed=1, stems=1, density=1.0, heading=None, clip=None):
    """Gnarled olive: sinuous trunk, a few spreading primary limbs and a broad clumped crown."""
    rng = random.Random(seed)
    h = height
    bark = olive_bark('Olive / fissured grey bark')
    origin = Vector(pos)
    buffers = ([], [], [])
    leaf_len = .085 * max(.75, min(h / 5, 1.2))
    leaf_w = leaf_len * .24

    def limb(label, a, b, r0, r1):
        a = a - (b - a).normalized() * (r0 * .8)  # overlap conceals each joint
        branch(label, a, b, r0, bark, r1)

    def chain(label, points, radii):
        tube(label, points, radii, bark, 16 if radii[0] > .05 else 10)

    def curve(a, a_handle, b_handle, b, count):
        return list(interpolate_bezier(a, a_handle, b_handle, b, count))

    # One broad dome envelope shared by every stem; clumps overlap into a single canopy.
    crown_base = h * rng.uniform(.36, .44)
    half_w = h * rng.uniform(.34, .42)
    half_h = (h - crown_base) * .5
    crown = origin + Vector((rng.uniform(-.04, .04) * h, rng.uniform(-.04, .04) * h, crown_base + half_h))

    def outer_leaf(p):
        if clip and not clip(p):
            return False
        q = p - crown
        e = (q.x / half_w) ** 2 + (q.y / half_w) ** 2 + (q.z / half_h) ** 2
        return e > .38 or rng.random() < .16  # shaded interiors keep only sparse leaves

    anchors = []  # (point, radius) along every trunk head and primary limb
    ang0 = rng.uniform(0, math.tau) if heading is None else heading
    r0 = h * (.042 if stems == 1 else .03)
    rise = crown_base + h * .02
    for s in range(stems):
        stem_heading = ang0 + s * math.tau / stems
        outward = Vector((math.cos(stem_heading), math.sin(stem_heading), 0))
        spread = (.12 if stems > 1 else .04) * h
        base = origin + outward * (r0 * .55 if stems > 1 else 0)
        head = origin + outward * spread + Vector((rng.uniform(-.02, .02) * h, rng.uniform(-.02, .02) * h, rise))

        def sway():
            return Vector((rng.uniform(-.045, .045) * h, rng.uniform(-.045, .045) * h, 0))
        points = curve(base, base + Vector((0, 0, rise * .38)) + sway(),
                       head - Vector((0, 0, rise * .32)) + sway(), head, 9)
        radii = [r0 * (1.14 - .5 * k / 8) * rng.uniform(.95, 1.05) for k in range(9)]
        head_r = radii[-1]
        # A short tapered crown closes the trunk inside the emerging limbs.
        points.append(head + (head - points[-2]).normalized() * (head_r * 1.4))
        radii.append(head_r * .45)
        chain(f'{name} / gnarled trunk {s}', points, radii)
        head = points[-3]
        anchors.extend(zip(points[5:-1], radii[5:-1]))
        primaries = rng.randint(3, 5) if stems == 1 else rng.randint(2, 3)
        for i in range(primaries):
            if stems == 1:
                az = stem_heading + (i + rng.uniform(-.3, .3)) * math.tau / primaries
            else:
                az = stem_heading + rng.uniform(-1.05, 1.05)  # each stem keeps to its own side
            direction = Vector((math.cos(az), math.sin(az), 0))
            reach = half_w * rng.uniform(.62, .86)
            lift = half_h * rng.uniform(.85, 1.35)
            tip = Vector((crown.x, crown.y, head.z)) + direction * reach + Vector((0, 0, lift))
            limb_points = curve(head, head + direction * (reach * .25) + Vector((0, 0, lift * .45)),
                                tip - direction * (reach * .3) + Vector((rng.uniform(-.1, .1) * h,
                                                                         rng.uniform(-.1, .1) * h, 0)), tip, 6)
            limb_radii = [head_r * .76 * (1 - .74 * k / 5) for k in range(6)]
            chain(f'{name} / primary limb {s}-{i}', limb_points, limb_radii)
            anchors.extend(zip(limb_points[1:], limb_radii[1:]))
    for i in range(int(13 + 2.2 * h)):
        # Clump centres sit in the outer part of the dome, more above than below.
        az = ang0 + i * 2.39996 + rng.uniform(-.25, .25)
        z = rng.uniform(-.55, 1.0)
        reach = rng.uniform(.5, .82)
        horizontal = math.sqrt(max(0., 1 - z * z))
        centre = crown + Vector((math.cos(az) * horizontal * half_w * reach,
                                 math.sin(az) * horizontal * half_w * reach, z * half_h * reach))
        start, radius = min(anchors, key=lambda anchor: (anchor[0] - centre).length)
        bend = start.lerp(centre, .5) + Vector((0, 0, rng.uniform(.02, .07) * h))
        twig = max(.006, radius * .45)
        limb(f'{name} / leafy branch {i}', start, bend, twig, twig * .7)
        limb(f'{name} / leafy branch tip {i}', bend, centre, twig * .7, twig * .25)
        sub = h * rng.uniform(.105, .16)
        leaf_shell(rng, buffers, centre, (sub, sub, sub * .8),
                   shell_count(sub, leaf_len, leaf_w, density, .2), leaf_len, leaf_w, OLIVE_WEIGHTS,
                   keep=outer_leaf)
    return foliage_object(name + ' / clumped olive canopy', buffers, OLIVE_LEAVES)


def cypress(name, pos, height=8.0, seed=1, density=1.0):
    """Mediterranean cypress: a narrow, slightly irregular column of dense sprays."""
    rng = random.Random(seed)
    origin = Vector(pos)
    bark = material(name + ' / cypress bark', (.05, .035, .022), (.15, .10, .06), .9, (20, 20, .6), grain=True)
    branch(name + ' / trunk', origin, origin + Vector((0, 0, height * .9)), height * .016, bark, height * .004)
    buffers = ([], [], [])
    leaf_len, leaf_w = .07, .028
    radius = height * rng.uniform(.078, .094)
    levels = max(6, int(height / .4))
    for i in range(levels):
        t = (i + .5) / levels
        # Columnar: slightly narrow at the foot, fullest near a third, tapering to a point.
        r = radius * max(.12, (1 - t ** 2.2) ** .7) * (.8 + .2 * min(1, t / .22))
        r *= .93 + .14 * math.sin(t * 11 + seed)
        for _ in range(2):
            centre = origin + Vector((rng.uniform(-.2, .2) * r, rng.uniform(-.2, .2) * r,
                                      height * (.04 + .94 * t)))
            leaf_shell(rng, buffers, centre, (r, r, max(r, height / levels) * 1.05),
                       shell_count(r, leaf_len, leaf_w, density, .24), leaf_len, leaf_w, CYPRESS_WEIGHTS, lift=.25)
    return foliage_object(name + ' / dense cypress column', buffers, CYPRESS_LEAVES)


def shrub(name, pos, radius=.5, height=.6, seed=1, kind='pittosporum', density=1.0):
    """Low irregular mound of overlapping leaf clumps resting on its planting bed."""
    rng = random.Random(seed)
    palette, weights, leaf_len, leaf_w = SHRUBS[kind]
    origin = Vector(pos)
    buffers = ([], [], [])
    for _ in range(rng.randint(4, 6)):
        offset = Vector((rng.uniform(-.55, .55) * radius, rng.uniform(-.55, .55) * radius, 0))
        r = radius * rng.uniform(.42, .72)
        top = height * rng.uniform(.62, 1.0)
        centre = origin + offset + Vector((0, 0, top * .5))
        leaf_shell(rng, buffers, centre, (r, r * rng.uniform(.8, 1.1), top * .52),
                   shell_count(r, leaf_len, leaf_w, density, .42), leaf_len, leaf_w, weights, lift=.7)
    return foliage_object(name, buffers, palette)


def courtyard(m):
    # Offset water and planting leave a walkable centreline into the back garden.
    cube('Courtyard reflection trough outer stone body', (3.0, 7.24, .16),
         (1.64, 4.52, .32), m['stone'], .012)
    cube('Dark inset pool basin', (3.0, 7.24, .324),
         (1.40, 4.28, .020), m['ink'], .005)
    cube('Quiet water visible below rim', (3.0, 7.24, .348),
         (1.39, 4.27, .020), m['water'], .001)
    for x in (2.205, 3.795):
        cube('Pool long raised coping', (x, 7.24, .354),
             (.05, 4.51, .068), m['stone'], .007)
    for y in (5.005, 9.475):
        cube('Pool end coping', (3.0, y, .354),
             (1.54, .05, .068), m['stone'], .007)
    cube('Garden left planting soil', (-3.14, 7.17, -.006),
         (2.50, 4.90, .065), m['soil'], .004)
    gravel('Limestone gravel in planted border', (-3.13, 7.2, .015),
           2.33, 4.65, m['floor'], count=400)
    for i, (x, y, size) in enumerate([
        (-3.83, 5.27, .72), (-2.47, 5.72, .62), (-3.65, 6.87, .93),
        (-2.68, 8.22, .83), (-3.80, 8.96, .63), (4.21, 6.2, .54),
        (4.18, 8.50, .72), (-2.2, 11.8, .85), (2.7, 11.9, .95),
    ]):
        # Clumps in the raised gravel bed sit on its surface; the rest root in the court soil.
        in_bed = -4.39 < x < -1.89 and 4.72 < y < 9.62
        plant(f'Courtyard soft grass clump {i}', (x, y, .04 if in_bed else -.045), size, seed=49 + i)
    for i, (x, y, radius, height, kind) in enumerate([
        (-3.9, 5.95, .4, .42, 'rosemary'), (-2.35, 9.1, .34, .3, 'santolina'),
        (4.25, 7.35, .3, .36, 'pittosporum'),
    ]):
        shrub(f'Courtyard {kind} mound {i}', (x, y, .02 if x < 0 else -.045), radius, height,
              seed=140 + i, kind=kind)

    def clear_of_court_masonry(p):
        if abs(p.x) > 2.72 and 4.0 < p.y < 10.25 and p.z > 3.68:
            return False  # beneath the sheltered side canopies and oak rafters
        if abs(p.x) > 4.66 and p.z < 3.78:
            return False  # court enclosure walls
        if 9.96 < p.y < 10.48 and p.z < 3.97:
            return False  # receding garden colonnade
        return not (13.23 < p.y < 13.67 and p.z < 3.54)  # garden end wall

    olive_tree('Courtyard olive in full ground', (-2.95, 7.7, .015), height=3.9, seed=67,
               clip=clear_of_court_masonry)
    olive_tree('Distant garden olive through central opening', (.75, 12.12, -.06), height=4.8,
               seed=83, clip=clear_of_court_masonry)
    cypress('Distant garden cypress at left', (-3.30, 12.15, -.06), height=6.0, seed=97)
    # Sheltered seating belongs to the colonnade, not merely to the foreground styling.
    for y in (6.1, 8.4):
        cube('Garden bench stone foot', (-4.09, y, .20),
             (.43, .16, .40), m['stone'], .009)
    cube('Garden bench timber seat', (-4.09, 7.25, .44),
         (.57, 2.70, .075), m['walnut'], .013)
    for i in range(3):
        cube(f'Garden bench seat board joint {i}', (-4.29 + i * .20, 7.25, .479),
             (.003, 2.65, .001), m['ink'], 0)
    # Large ceramic planter at the interior edge grounds the near view in another scale.
    planter_profile = [(.001, 0), (.25, 0), (.28, .05), (.32, .44), (.34, .52),
                       (.34, .55), (.306, .55), (.292, .47), (.25, .09), (.001, .07)]
    lathe('Hand-thrown entrance planter', (-3.96, -3.69, .005), planter_profile, m['clay'])
    cylinder('Planter real earth surface', (-3.96, -3.69, .49), .292, .03, m['soil'], 64, .001)
    plant('Entrance plant fine arching leaves', (-3.96, -3.69, .51), 1.08, seed=17)


def build(m, view='wide'):
    tiled_floor(m)
    architecture(m)
    sideboard(m)
    workbench(m)
    bench_and_lights(m)
    courtyard(m)

    # High side light enters the real roof opening and rakes both visible cabinet fronts.
    sun((6, -3, 12), (-2, 1, 0), energy=2.15, color=(1, .91, .78), angle=.030)
    area('Open courtyard sky bounce', (0, 7.0, 5.8), (0, -.7, 1.1),
         180, (.84, .91, 1), 5.0)
    area('Entry ambient fill', (1, -6.9, 3.4), (-1, 1.2, 1.3),
         90, (1, .92, .82), 4.0)
    if view == 'detail':
        camera((2.17, -3.28, 1.42), (-.54, -.05, 1.08),
               lens=55, focus=(-.47, -.63, .96), fstop=7.1)
    else:
        camera((2.50, -6.78, 1.68), (-.52, 3.83, 1.76),
               lens=29, focus=(-.45, 1.05, 1.25), fstop=11)
    return {
        'world': 'STRATA / clay atelier and layered courtyard',
        'view': view,
        'units': 'metres',
        'originalGeometry': True,
        'description': 'Eye-level inhabited atelier: stone flooring and workbench, fluted walnut '
                       'joinery, sample archive, sewn linen counter chairs, ceramic and drafting '
                       'objects, deep clay arcades, glazed oak roof and a planted reflection court '
                       'with a second colonnade and distant living canopy.',
    }
