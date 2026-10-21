"""Draws Wards' symbols and writes them to src/ui/icon-paths.ts.

Each symbol is our own drawing, built from simple shapes (rounded lines, circles, rounded rectangles) and modelled
on the SF Symbol it is named after. SF Symbols were only looked at on screen as a reference; none of Apple's files are
used (DECISIONS 2026-10-18). Coordinates are on the design system's 20pt grid.

Run by hand after changing a drawing (needs Python 3 with shapely and svgpathtools):
    python3 -m venv /tmp/icons && /tmp/icons/bin/pip install shapely svgpathtools
    /tmp/icons/bin/python scripts/icons/draw_icons.py
"""
import math
import os

from shapely import affinity
from shapely.geometry import LineString, MultiPolygon, Point, Polygon, box
from shapely.ops import unary_union
from svgpathtools import parse_path

W = 1.4  # line weight of outline symbols (SF Symbols Regular at this size)


# ---- shape helpers -------------------------------------------------------------------------------------------
def line(pts, w=W, cap='round'):
    return LineString(pts).buffer(w / 2, quad_segs=12, cap_style=cap, join_style='round')


def circle(cx, cy, r):
    return Point(cx, cy).buffer(r, quad_segs=16)


def ring(cx, cy, r, w=W):
    return circle(cx, cy, r + w / 2).difference(circle(cx, cy, r - w / 2))


def rounded(shape, r):
    """Rounds the convex corners of a shape."""
    return shape.buffer(-r, quad_segs=12, join_style='round').buffer(r, quad_segs=12, join_style='round')


def rrect(x0, y0, x1, y1, r):
    return rounded(box(x0, y0, x1, y1), r) if r else box(x0, y0, x1, y1)


def poly(pts, r=0):
    p = Polygon(pts)
    return rounded(p, r) if r else p


def path(d, n=24):
    """A closed SVG path drawn by hand (used for organic outlines), as a shape."""
    pts = []
    for seg in parse_path(d):
        for i in range(n):
            z = seg.point(i / n)
            pts.append((z.real, z.imag))
    return Polygon(pts).buffer(0)


def bez(p0, p1, p2, p3, n=24):
    return [tuple(p0[k] * (1 - t) ** 3 + 3 * p1[k] * t * (1 - t) ** 2 + 3 * p2[k] * t * t * (1 - t) + p3[k] * t ** 3
                  for k in (0, 1)) for t in (i / n for i in range(n + 1))]


def arc(cx, cy, r, a0, a1, n=32):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n)))
            for i in range(n + 1)]


def mirror(shape):
    return affinity.scale(shape, -1, 1, origin=(10, 10))


def U(*shapes):
    return unary_union(shapes)


# ---- symbols -------------------------------------------------------------------------------------------------
def house_fill():  # house.fill
    k = 6.4 / 8.15  # roof slope
    roof = line([(1.85, 9.5), (10, 3.1), (18.15, 9.5)], 1.55)
    # the chimney rises from the roof line
    chimney = rrect(14.65, 3.75, 16.7, 9, .45).difference(Polygon([(10, 3.6), (20, 3.6 + 10 * k), (20, 20), (10, 20)]))
    top = 3.1 + 1.56 * math.hypot(1, k)  # under the roof line, leaving a gap
    body = rounded(poly([(3.45, top + 6.55 * k), (10, top), (16.55, top + 6.55 * k), (16.55, 17.85), (3.45, 17.85)]), .35)
    body = body.difference(box(3, 15, 17, 18)).union(rrect(3.45, 13, 16.55, 17.85, 1.2))
    door = rrect(8, 11.6, 12, 16.5, .5)
    return U(roof, chimney, body.difference(door))


def staroflife_fill():  # staroflife.fill
    bar = rrect(8.4, 2.1, 11.6, 17.9, .7)
    return U(*[affinity.rotate(bar, a, origin=(10, 10)) for a in (0, 60, 120)])


def heart_text_clipboard_fill():  # heart.text.clipboard.fill
    body = rrect(4.1, 3.85, 15.9, 18.5, 1.8)
    clip = rrect(7.05, 1.5, 12.95, 5.35, 1.15)
    body = body.difference(clip.buffer(.6))
    clip = clip.difference(circle(10, 3.05, .62))
    heart = path('M8.2 11.4c-.2 0-.4-.1-.5-.2C5.9 10 5.2 9.1 5.2 8.1c0-1 .7-1.7 1.6-1.7.6 0 1.1.3 1.4.8.3-.5.8-.8 1.4-.8.9 0 1.6.7 1.6 1.7 0 1-.7 1.9-2.5 3.1-.1.1-.3.2-.5.2z')
    heart = affinity.translate(affinity.scale(heart, .66, .66, origin=(8.2, 8.9)), 0, .7)
    lines = U(line([(6.85, 12.95), (13.05, 12.95)], 1.05), line([(6.85, 15.65), (10.4, 15.65)], 1.05))
    return U(body.difference(heart).difference(lines), clip)


def cross_case_fill():  # cross.case.fill
    handle = LineString([(6.75, 5.6)] + arc(7.95, 4.85, 1.2, 180, 270) + arc(12.05, 4.85, 1.2, 270, 360) + [(13.25, 5.6)])
    handle = handle.buffer(.58, quad_segs=12, cap_style='flat', join_style='round')
    body = rrect(1.6, 5.4, 18.4, 17, 1.85)
    plus = U(rrect(8.68, 7.74, 11.32, 14.62, .45), rrect(6.56, 9.86, 13.44, 12.5, .45))
    return U(handle, body.difference(plus))


def gearshape():  # gearshape
    # Eight short, rounded teeth on a round body, and a center ring, as in SF Symbols (not deep square cogs).
    pts = []
    for i in range(8):
        a = i * 45 - 90
        for ang, r in ((a - 15.5, 6.55), (a - 9, 8.15), (a + 9, 8.15), (a + 15.5, 6.55)):
            pts.append((10 + r * math.cos(math.radians(ang)), 10 + r * math.sin(math.radians(ang))))
    body = rounded(Polygon(pts), .55)
    outline = LineString(list(body.exterior.coords)).buffer(W / 2, quad_segs=12, join_style='round')
    return U(outline, ring(10, 10, 2.75))


def chevron_backward():  # chevron.backward
    return line([(13.1, 3.3), (6.6, 10), (13.1, 16.7)], 1.55)


def chevron_down():  # chevron.down (the backward chevron turned a quarter, as SF Symbols draws it)
    return line([(3.3, 6.9), (10, 13.4), (16.7, 6.9)], 1.55)


def checkmark():  # checkmark (a short and a long stroke meeting low, as SF Symbols draws it)
    return line([(4.3, 10.7), (8.2, 14.6), (15.8, 5.3)], 1.55)


def plus():  # plus
    return U(line([(4.4, 10), (15.6, 10)], 1.5), line([(10, 4.4), (10, 15.6)], 1.5))


def minus():  # minus
    return line([(4.4, 10), (15.6, 10)], 1.5)


def xmark():  # xmark
    return U(line([(4.9, 4.9), (15.1, 15.1)], 1.45), line([(15.1, 4.9), (4.9, 15.1)], 1.45))


def arrow_up_right():  # arrow.up.right
    return U(line([(5.2, 14.8), (14.6, 5.4)], 1.45), line([(7.4, 5.2), (14.8, 5.2), (14.8, 12.6)], 1.45))


def list_bullet():  # list.bullet
    return U(*[circle(3.6, y, 1.15) for y in (5, 10, 15)], *[line([(7.6, y), (17.3, y)]) for y in (5, 10, 15)])


def chevron_up_chevron_down():  # chevron.up.chevron.down
    return U(line([(6.2, 7.4), (10, 3.6), (13.8, 7.4)]), line([(6.2, 12.6), (10, 16.4), (13.8, 12.6)]))


def plus_forwardslash_minus():  # plus.forwardslash.minus
    return U(line([(3, 6.1), (8.1, 6.1)]), line([(5.55, 3.55), (5.55, 8.65)]), line([(13.7, 2.9), (7.6, 17.1)]),
             line([(12, 15.6), (17.1, 15.6)]))


def checklist():  # checklist
    tick = line([(3.42, 5.95), (4.38, 6.92), (5.98, 4.54)], .9)
    return U(circle(4.7, 5.63, 3.21).difference(tick), ring(4.7, 14.43, 2.7, 1.03),
             line([(10.3, 5.63), (17.85, 5.63)], 1.28), line([(10.3, 14.43), (17.85, 14.43)], 1.28))


def arrow_left_arrow_right():  # arrow.left.arrow.right
    return U(line([(16.6, 6.5), (3.5, 6.5)]), line([(7.3, 2.7), (3.5, 6.5), (7.3, 10.3)]),
             line([(3.4, 13.5), (16.5, 13.5)]), line([(12.7, 9.7), (16.5, 13.5), (12.7, 17.3)]))


def pills_fill():  # pills.fill
    cap = line([(3.77, 11.98), (10.96, 4.79)], 5.69)
    gap = line([(7.36 - 4, 8.38 - 4), (7.36 + 4, 8.38 + 4)], .9, 'flat')
    pill = circle(14.73, 13.41, 3.71).difference(box(0, 12.86, 20, 13.72))
    return U(cap.difference(gap), pill)


def flowchart_fill():  # flowchart.fill
    head = poly([(7.25, 14.85), (12.75, 14.85), (10, 18.1)], .3)
    return U(rrect(2.6, 1.9, 17.4, 7.05, 1.6), rrect(2.6, 7.85, 17.4, 13, 1.6), box(9.35, 12.8, 10.65, 15.4), head)


def testtube_2():  # testtube.2
    def tube(dx, right):
        rim = rrect(1.53 + dx, 1.5, 9.38 + dx, 2.97, .73)
        body = U(box(2.35 + dx, 2.5, 8.51 + dx, 15.42), circle(5.43 + dx, 15.42, 3.08))
        ticks = [(6.66, 7.54), (9.0, 10.0), (11.76, 12.75)]
        if not right:
            cut = U(box(3.82 + dx, 2.9, 7.1 + dx, 5.02),
                    *[U(box(3.82 + dx, a, 5.6 + dx, b), circle(5.6 + dx, (a + b) / 2, (b - a) / 2)) for a, b in ticks])
        else:
            cut = box(3.82 + dx, 2.9, 7.1 + dx, 14.22)
            cut = cut.difference(U(*[U(box(3.7 + dx, a, 5.6 + dx, b), circle(5.6 + dx, (a + b) / 2, (b - a) / 2)) for a, b in ticks]))
        return U(rim, body.difference(cut))
    return U(tube(0, False), tube(9.14, True))


def heart_fill():  # heart.fill
    return path('M10 17.4c-.3 0-.7-.1-1-.3C4.6 14.3 1.8 11.2 1.8 7.6c0-2.8 2.1-4.8 4.6-4.8 1.6 0 2.8.8 3.6 2 .8-1.2 2-2 3.6-2 2.5 0 4.6 2 4.6 4.8 0 3.6-2.8 6.7-7.2 9.5-.3.2-.7.3-1 .3z')


def lungs_fill():  # lungs.fill
    outer = bez((4.35, 3.6), (2.6, 6.5), (1.4, 11.5), (1.45, 15.2))
    outline = Polygon([(8.25, 3.6)] + outer + [(2.6, 16.0), (8.25, 14.75)])
    lobe = U(rounded(outline, 1.5), rounded(outline.intersection(box(6.6, 0, 9, 20)), .45))
    bronchus = U(line([(10, 11.2), (8.25, 11.9), (4.75, 12.6)], 1.04), line([(6.7, 12.2), (5.25, 9.65)], 1.04))
    left = lobe.difference(bronchus)
    stem = bronchus.intersection(box(8.25, 0, 11.75, 20))
    trachea = line([(10, 4.1), (10, 11.2)], 1.04)
    return U(left, mirror(left), trachea, stem, mirror(stem))


def waveform_path_ecg():  # waveform.path.ecg
    return line([(2.1, 10.5), (5.3, 10.5), (7.85, 2.6), (10.9, 17.4), (13.15, 8.8), (14.4, 10.5), (17.9, 10.5)], 1.4)


def microbe_fill():  # microbe.fill
    return U(circle(10, 10, 4.95), *[circle(10 + 7.6 * math.cos(math.radians(a)), 10 + 7.6 * math.sin(math.radians(a)), .95)
                                     for a in range(0, 360, 30)])


def drop_fill():  # drop.fill
    return path('M10 2.3c.3 0 .5.2.7.4 1.7 2.3 4.7 6.2 4.7 9.8a5.4 5.4 0 0 1-10.8 0c0-3.6 3-7.5 4.7-9.8.2-.2.4-.4.7-.4z')


def figure_walk():  # figure.walk
    head = circle(10, 3.09, 1.62)
    torso = line([(9.15, 6.95), (9.4, 11.9)], 2.95)
    back_arm = line([(7.6, 7.4), (6.05, 10.6)], 1.62)
    front_arm = line([(10.9, 7.45), (12.15, 9.15), (14.45, 9.15)], 1.62)
    front_arm = front_arm.difference(torso.buffer(.42))
    front_leg = line([(9.65, 12.2), (12.6, 17.6)], 1.73)
    back_leg = line([(8.6, 12.4), (8.2, 14.6), (5.6, 17.55)], 1.73).difference(front_leg.buffer(.42))
    return U(head, torso, back_arm, front_arm, front_leg, back_leg)


def brain_head_profile_fill():  # brain.head.profile.fill
    back = bez((16.07, 15.0), (16.07, 12.6), (18.2, 11.2), (17.95, 8.2)) + bez((17.95, 8.2), (17.6, 3.9), (14.3, 1.5), (10.8, 1.5))[1:] \
        + bez((10.8, 1.5), (7.5, 1.5), (5.0, 3.4), (4.4, 5.6))[1:]
    face = [(3.7, 8.4), (2.35, 11.25), (2.45, 11.95), (3.55, 12.5), (3.55, 15.5), (3.85, 16.55), (4.75, 16.95), (7.6, 16.95), (7.6, 18.5), (16.07, 18.5)]
    head = rounded(Polygon(back + face), .35)
    blobs = [(7.3, 6.0, 1.55), (9.2, 4.85, 1.75), (11.6, 4.75, 1.8), (13.7, 6.05, 1.75), (14.55, 8.45, 1.55), (13.0, 10.15, 1.55),
             (10.4, 9.85, 1.7), (7.75, 8.6, 1.6), (10.6, 7.3, 2.2)]
    brain = U(*[circle(x, y, r) for x, y, r in blobs]).buffer(.35).buffer(-.35)
    folds = U(line(bez((9.05, 3.4), (9.6, 4.8), (9.9, 6.2), (8.9, 7.3)), .85),
              line(bez((12.0, 6.6), (11.6, 8.0), (12.4, 9.2), (14.3, 10.0)), .85),
              line([(11.9, 3.1), (11.6, 4.6)], .85))
    return head.difference(brain.difference(folds))


def bubble_left_and_bubble_right_fill():  # bubble.left.and.bubble.right.fill
    back = U(rrect(1.19, 3.08, 14.43, 13.1, 2.3), poly([(3.75, 12.6), (4.2, 15.14), (7.2, 12.85)], .25))
    front = U(rrect(7.71, 5.98, 18.8, 14.78, 2.3), poly([(12.19, 14.4), (15.34, 17.02), (15.96, 14.4)], .25))
    return U(back.difference(front.buffer(.62)), front)


def eye_fill():  # eye.fill
    almond = rounded(path('M1.2 10C3.3 6.4 6.4 4.55 10 4.55S16.7 6.4 18.8 10C16.7 13.6 13.6 15.45 10 15.45S3.3 13.6 1.2 10z'), .5)
    return U(almond.difference(circle(10, 10, 3.65)), circle(10, 10, 1.45))


def figure_and_child_holdinghands():  # figure.and.child.holdinghands
    adult = U(circle(7.61, 3.2, 1.7), poly([(5.15, 6.1), (10.06, 6.1), (9.43, 12.4), (6.03, 12.4)], .85),
              line([(5.45, 6.75), (3.3, 10.6)], 1.76), line([(9.75, 6.9), (11.2, 9.35)], 1.76),
              line([(6.55, 11.9), (5.3, 18.0)], 2.0), line([(8.8, 11.9), (10.05, 18.0)], 2.0))
    arm = line([(13.1, 11.6), (11.85, 9.65)], 1.39).difference(adult.buffer(.4))
    child = U(circle(14.1, 8.85, 1.3), poly([(12.84, 11.2), (15.73, 11.2), (15.48, 15.05), (13.21, 15.05)], .6), arm,
              line([(15.65, 11.8), (16.9, 14.15)], 1.39), line([(13.6, 14.8), (12.85, 18.15)], 1.6),
              line([(15.2, 14.8), (15.95, 18.15)], 1.6))
    return U(adult, child.difference(adult.buffer(.4)))


def bed_double_fill():  # bed.double.fill
    head = U(rrect(2.93, 4.16, 17.07, 10, 1.7)).intersection(box(0, 0, 20, 8.07))
    head = head.difference(U(rrect(4.71, 6.06, 9.25, 9.5, .5), rrect(10.86, 6.06, 15.4, 9.5, .5)))
    mattress = U(rrect(1.2, 9.11, 18.8, 14.28, 1.4), box(1.2, 12, 18.8, 14.28))
    legs = U(rrect(1.2, 12.5, 2.93, 15.84, .6), rrect(17.07, 12.5, 18.8, 15.84, .6))
    return U(head, mattress, legs)


# Custom symbols (no SF Symbol exists), drawn in the same filled style.
def stomach():
    tube = line([(11.4, 2.0), (11.4, 5.6)], 1.9)
    body = path('M10.4 4.9C8 3.8 4.3 4.8 3.5 8.6 2.6 12.6 4.9 17 9.5 17c2.8 0 4.8-1.2 6-2.8l1.6-1.4c.4-.4.4-1 0-1.3l-.6-.5c-.4-.3-.9-.3-1.3 0l-1.4 1.2c-.9.8-2 1.2-3 1.1-1.6-.1-2.4-1.4-2-2.9.4-1.5 3-2.8 3.5-4.6l.1-.9z')
    return U(tube, rounded(body, .3))


def liver():
    return rounded(path('M2 8.3C2 5.4 4.4 3.8 8 3.8c3.7 0 7.6.5 9.3 1.6.9.6 1 1.7.2 2.4-1.9 1.7-4.6 3.8-7 5.9-1.9 1.6-3.7 3-5.6 3C2.9 16.7 2 12.6 2 8.3z'), .3)


def kidney():
    bean = path('M10.2 2.4C5.9 2.4 3.2 5.8 3.2 10s2.7 7.6 7 7.6c2.1 0 3.5-1.3 3.5-2.9 0-1.2-.7-1.9-1.5-2.6-.6-.6-.6-1.6 0-2.2.8-.7 1.5-1.4 1.5-2.6 0-2-1.4-4.9-3.5-4.9z')
    ureter = line(bez((13.3, 10.4), (14.9, 10.5), (15.9, 11.4), (15.9, 13.0)) + [(15.9, 16.6)], 1.25)
    return U(bean, ureter.difference(bean.buffer(.0)))


def ribbon():
    w, c, r = 2.0, (10, 5.9), 3.0
    right = (c[0] + r * math.cos(math.radians(35)), c[1] + r * math.sin(math.radians(35)))
    left = (c[0] - r * math.cos(math.radians(35)), right[1])
    over = [(6.5, 18.2), right]
    strand = line(over + arc(*c, r, 35, -215, 48)[1:], w)
    under = line([left, (13.5, 18.2)], w).difference(line(over, w + .9))
    return U(strand.buffer(0), under).intersection(box(0, 0, 20, 17.6))


def thyroid():
    lobe = U(affinity.scale(circle(0, 0, 1), 2.55, 6.4), affinity.translate(affinity.scale(circle(0, 0, 1), 2.75, 3.3), .2, 3.0))
    lobe = affinity.translate(affinity.rotate(lobe, -7, origin=(0, 0)), 5.75, 9.7).buffer(.9).buffer(-.9)
    isthmus = rrect(7.2, 11.6, 12.8, 14.3, .7)
    return U(lobe, mirror(lobe), isthmus).buffer(.4).buffer(-.4)


def quote_opening():  # quote.opening
    def mark(dx):
        blob = circle(5.4 + dx, 12.4, 2.75)
        tail = line(bez((2.85 + dx, 12.6), (2.6 + dx, 9.2), (4.4 + dx, 6.6), (7.6 + dx, 5.5)), 1.7)
        return U(blob, tail)
    return U(mark(0), mark(8.2)).buffer(.2).buffer(-.2)


ICONS = {
    'house': house_fill, 'staroflifeFill': staroflife_fill, 'heartTextClipboard': heart_text_clipboard_fill,
    'crossCase': cross_case_fill, 'gearshape': gearshape,
    'xmark': xmark, 'checkmark': checkmark, 'plus': plus, 'minus': minus, 'chevronBackward': chevron_backward, 'chevronDown': chevron_down, 'arrowUpRight': arrow_up_right,
    'listBullet': list_bullet, 'chevronUpChevronDown': chevron_up_chevron_down,
    'plusForwardslashMinus': plus_forwardslash_minus, 'checklist': checklist, 'arrowLeftArrowRight': arrow_left_arrow_right,
    'pills': pills_fill, 'flowchart': flowchart_fill, 'testtube2': testtube_2,
    'heart': heart_fill, 'lungs': lungs_fill, 'waveformPathEcg': waveform_path_ecg, 'stomach': stomach, 'liver': liver,
    'kidney': kidney, 'microbe': microbe_fill, 'dropFill': drop_fill, 'ribbon': ribbon, 'thyroid': thyroid,
    'figureWalk': figure_walk, 'brainHeadProfile': brain_head_profile_fill,
    'bubbleLeftAndBubbleRight': bubble_left_and_bubble_right_fill, 'eye': eye_fill,
    'figureAndChildHoldinghands': figure_and_child_holdinghands, 'bedDouble': bed_double_fill,
    'quoteOpening': quote_opening,
}


# ---- output --------------------------------------------------------------------------------------------------
def fmt(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def ring_d(coords):
    pts = list(coords)[:-1]
    return 'M' + 'L'.join(f'{fmt(x)} {fmt(y)}' for x, y in pts) + 'Z'


def to_d(shape):
    shape = shape.buffer(0).simplify(.02)
    polys = shape.geoms if isinstance(shape, MultiPolygon) else [shape]
    return ''.join(ring_d(p.exterior.coords) + ''.join(ring_d(i.coords) for i in p.interiors) for p in polys if not p.is_empty)


if __name__ == '__main__':
    root = os.path.join(os.path.dirname(__file__), '..', '..')
    out = ['// Generated by scripts/icons/draw_icons.py: edit the drawings there, not here.',
           '// Outlines of Wards\' symbols on a 20pt grid (our own drawings; see that script).',
           'export const iconPaths = {']
    for name, fn in ICONS.items():
        out.append(f"  {name}: '{to_d(fn())}',")
    out.append('} as const;')
    with open(os.path.join(root, 'src', 'ui', 'icon-paths.ts'), 'w') as f:
        f.write('\n'.join(out) + '\n')
    print('wrote', len(ICONS), 'symbols')
