"""Original conceptual scientific illustrations for the website, written as SVG.

Every illustration is drawn from simple geometry with a fixed random seed, so
the output is the same on every run. None of them shows real data, real
people or real results: they are visual metaphors for each research area.

Usage, from the top folder of the website:
    python3 scripts/illustrations.py src/assets/illustrations

It needs Python 3 with numpy (pip install numpy).
"""
import math
import os
import random
import sys

import numpy as np

W, H = 1200, 800
NAVY = '#0b1a2e'
NAVY2 = '#12304d'
TEAL = '#4fb3ae'
TEAL_L = '#9adcd6'
VIOLET = '#8a7dd4'
VIOLET_L = '#c3baf2'
MIST = '#dce7f3'
SLATE = '#6f86a6'
AMBER = '#e6b871'


def f(x):
    return f'{x:.1f}'.rstrip('0').rstrip('.')


class Svg:
    def __init__(self, name, bg=(NAVY, NAVY2), glow=(820, 260, TEAL)):
        self.name = name
        self.defs = []
        self.body = []
        self.css = []
        gid = self.id('bg')
        self.defs.append(
            f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0" stop-color="{bg[0]}"/><stop offset="1" stop-color="{bg[1]}"/></linearGradient>'
        )
        rid = self.id('glow')
        self.defs.append(
            f'<radialGradient id="{rid}" cx="0.5" cy="0.5" r="0.5">'
            f'<stop offset="0" stop-color="{glow[2]}" stop-opacity="0.35"/>'
            f'<stop offset="1" stop-color="{glow[2]}" stop-opacity="0"/></radialGradient>'
        )
        pid = self.id('dots')
        self.defs.append(
            f'<pattern id="{pid}" width="28" height="28" patternUnits="userSpaceOnUse">'
            f'<circle cx="2" cy="2" r="1.2" fill="{MIST}" fill-opacity="0.07"/></pattern>'
        )
        self.body.append(f'<rect width="{W}" height="{H}" fill="url(#{gid})"/>')
        self.body.append(f'<rect width="{W}" height="{H}" fill="url(#{pid})"/>')
        self.body.append(f'<circle cx="{glow[0]}" cy="{glow[1]}" r="520" fill="url(#{rid})"/>')

    def id(self, part):
        return f'il-{self.name}-{part}'

    def add(self, s):
        self.body.append(s)

    def anim(self, cls, rule):
        self.css.append(f'.{cls}{{{rule}}}')

    def render(self):
        style = ''
        if self.css:
            style = '<style>' + ''.join(self.css) + '</style>'
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">'
            f'{style}<defs>{"".join(self.defs)}</defs>{"".join(self.body)}</svg>'
        )


def poisson(rng, n, inside, rmin, tries=6000):
    pts = []
    for _ in range(tries):
        if len(pts) >= n:
            break
        p = inside(rng)
        if all((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 >= rmin * rmin for q in pts):
            pts.append(p)
    return pts


def in_circle(cx, cy, r):
    def sample(rng):
        a = rng.uniform(0, 2 * math.pi)
        d = r * math.sqrt(rng.uniform(0, 1))
        return (cx + d * math.cos(a), cy + d * math.sin(a))
    return sample


def in_ellipse(cx, cy, rx, ry):
    def sample(rng):
        a = rng.uniform(0, 2 * math.pi)
        d = math.sqrt(rng.uniform(0, 1))
        return (cx + rx * d * math.cos(a), cy + ry * d * math.sin(a))
    return sample


def pack(rng, sample, rmin, rmax, n, tries=20000, bound=None):
    circles = []
    for _ in range(tries):
        if len(circles) >= n:
            break
        x, y = sample(rng)
        r = rng.uniform(rmin, rmax)
        if bound and not bound(x, y, r):
            continue
        if all((x - c[0]) ** 2 + (y - c[1]) ** 2 >= (r + c[2] + 2) ** 2 for c in circles):
            circles.append((x, y, r))
    return circles


def lattice(svg, rng, cx, cy, r, n, rmin, width=(3, 7), colour=MIST, opacity=0.55):
    """A trabecular-bone-like network: points joined to their nearest neighbours."""
    pts = poisson(rng, n, in_circle(cx, cy, r), rmin)
    arr = np.array(pts)
    seen = set()
    for i, p in enumerate(arr):
        d = np.hypot(*(arr - p).T)
        for j in np.argsort(d)[1:4]:
            key = tuple(sorted((i, int(j))))
            if key in seen or d[j] > rmin * 2.3:
                continue
            seen.add(key)
            q = arr[j]
            mx, my = (p + q) / 2 + rng.uniform(-6, 6, 2)
            w = rng.uniform(*width)
            svg.add(
                f'<path d="M{f(p[0])} {f(p[1])}Q{f(mx)} {f(my)} {f(q[0])} {f(q[1])}" fill="none" '
                f'stroke="{colour}" stroke-opacity="{opacity}" stroke-width="{f(w)}" stroke-linecap="round"/>'
            )
    for p in pts:
        svg.add(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="{f(rng.uniform(3, 6))}" fill="{colour}" fill-opacity="{opacity}"/>')


def musculoskeletal(seed=3):
    """Bone microarchitecture, a muscle cross-section and adipose tissue."""
    rng = random.Random(seed)
    nrng = np.random.default_rng(seed)
    s = Svg('msk', glow=(760, 380, TEAL))
    # Bone: cortical shell around a trabecular network.
    lattice_rng = np.random.default_rng(seed)
    s.add(f'<circle cx="300" cy="400" r="235" fill="{NAVY}" fill-opacity="0.55" stroke="{MIST}" stroke-opacity="0.75" stroke-width="20"/>')
    lattice(s, lattice_rng, 300, 400, 205, 70, 34)
    # Muscle: fascicles packed with fibres, inside a perimysium.
    s.add(f'<ellipse cx="780" cy="360" rx="265" ry="228" fill="{TEAL}" fill-opacity="0.06" stroke="{VIOLET_L}" stroke-opacity="0.65" stroke-width="5"/>')
    fascicles = pack(rng, in_ellipse(780, 360, 190, 160), 62, 86, 7, bound=lambda x, y, r: ((x - 780) / 245) ** 2 + ((y - 360) / 208) ** 2 < 0.62)
    glow_i = 0
    for (fx, fy, fr) in fascicles:
        s.add(f'<circle cx="{f(fx)}" cy="{f(fy)}" r="{f(fr)}" fill="none" stroke="{VIOLET_L}" stroke-opacity="0.45" stroke-width="3"/>')
        fibres = pack(rng, in_circle(fx, fy, fr - 10), 7, 11, 60, bound=lambda x, y, r, fx=fx, fy=fy, fr=fr: math.hypot(x - fx, y - fy) + r < fr - 4)
        for (x, y, r) in fibres:
            op = rng.uniform(0.35, 0.85)
            cls = ''
            if rng.random() < 0.08:
                glow_i += 1
                cls = f' class="il-msk-fibre il-msk-d{glow_i % 4}"'
            s.add(f'<circle{cls} cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{TEAL}" fill-opacity="{f(op)}" stroke="{TEAL_L}" stroke-opacity="0.35" stroke-width="1"/>')
    # Adipose tissue: large, thin-walled cells.
    cells = pack(rng, lambda r: (r.uniform(860, 1180), r.uniform(560, 800)), 26, 44, 26)
    for (x, y, r) in cells:
        s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{AMBER}" fill-opacity="0.08" stroke="{AMBER}" stroke-opacity="0.55" stroke-width="2"/>')
        s.add(f'<circle cx="{f(x + r * 0.45)}" cy="{f(y - r * 0.4)}" r="3.2" fill="{AMBER}" fill-opacity="0.7"/>')
    s.anim('il-msk-fibre', 'animation:il-msk-pulse 7s ease-in-out infinite')
    s.anim('il-msk-d1', 'animation-delay:-1.7s')
    s.anim('il-msk-d2', 'animation-delay:-3.4s')
    s.anim('il-msk-d3', 'animation-delay:-5.1s')
    s.css.append('@keyframes il-msk-pulse{0%,100%{fill-opacity:.4}50%{fill-opacity:1}}')
    return s.render()


def bone(seed=11):
    """Bone microarchitecture under a density scan, for musculoskeletal ageing."""
    rng = np.random.default_rng(seed)
    s = Svg('bone', glow=(380, 420, VIOLET))
    # Scan band, as in a densitometry image.
    gid = s.id('scan')
    s.defs.append(
        f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0">'
        f'<stop offset="0" stop-color="{TEAL}" stop-opacity="0"/><stop offset="0.5" stop-color="{TEAL}" stop-opacity="0.22"/>'
        f'<stop offset="1" stop-color="{TEAL}" stop-opacity="0"/></linearGradient>'
    )
    cid = s.id('clip')
    s.defs.append(f'<clipPath id="{cid}"><circle cx="560" cy="400" r="330"/></clipPath>')
    s.add(f'<circle cx="560" cy="400" r="345" fill="{NAVY}" fill-opacity="0.6" stroke="{MIST}" stroke-opacity="0.8" stroke-width="26"/>')
    s.add(f'<g clip-path="url(#{cid})">')
    lattice(s, rng, 560, 400, 320, 150, 36, width=(4, 10), colour=MIST, opacity=0.6)
    s.add(f'<rect class="il-bone-scan" x="230" y="70" width="180" height="660" fill="url(#{gid})"/>')
    s.add('</g>')
    # Density profile on the right.
    xs = np.linspace(0, 1, 60)
    ys = 0.55 + 0.25 * np.sin(xs * 5.2) * np.exp(-xs * 0.8) + 0.05 * np.sin(xs * 23)
    path = 'M' + ' L'.join(f'{f(960 + 180 * x)} {f(640 - 330 * y)}' for x, y in zip(xs, ys))
    s.add(f'<path d="M960 640H1150M960 640V250" stroke="{MIST}" stroke-opacity="0.35" stroke-width="2" fill="none"/>')
    s.add(f'<path d="{path}" fill="none" stroke="{VIOLET_L}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
    s.anim('il-bone-scan', 'animation:il-bone-sweep 9s ease-in-out infinite alternate')
    s.css.append('@keyframes il-bone-sweep{from{transform:translateX(0)}to{transform:translateX(480px)}}')
    return s.render()


def prediction(seed=5):
    """Population data feeding a prediction model, with a decision boundary."""
    rng = random.Random(seed)
    s = Svg('ai', glow=(620, 400, VIOLET))
    # Data rows on the left.
    for i in range(11):
        y = 190 + i * 40
        s.add(f'<rect x="60" y="{y}" width="34" height="20" rx="4" fill="{MIST}" fill-opacity="0.18"/>')
        for k in range(4):
            w = rng.uniform(18, 46)
            col = TEAL if (i + k) % 3 else VIOLET
            s.add(f'<rect x="{f(104 + k * 52)}" y="{y}" width="{f(w)}" height="20" rx="4" fill="{col}" fill-opacity="{f(rng.uniform(0.25, 0.7))}"/>')
    # Network.
    layers = [(380, 5), (520, 7), (660, 7), (800, 3)]
    nodes = []
    for x, n in layers:
        span = (n - 1) * 72
        nodes.append([(x, 400 - span / 2 + k * 72) for k in range(n)])
    for a, b in zip(nodes, nodes[1:]):
        for p in a:
            for q in b:
                mx = (p[0] + q[0]) / 2
                s.add(f'<path d="M{f(p[0])} {f(p[1])}C{f(mx)} {f(p[1])} {f(mx)} {f(q[1])} {f(q[0])} {f(q[1])}" fill="none" stroke="{MIST}" stroke-opacity="0.12" stroke-width="1.5"/>')
    # A highlighted route through the network.
    route = [nodes[0][2], nodes[1][1], nodes[2][4], nodes[3][1]]
    d = f'M{f(route[0][0])} {f(route[0][1])}'
    for p, q in zip(route, route[1:]):
        mx = (p[0] + q[0]) / 2
        d += f'C{f(mx)} {f(p[1])} {f(mx)} {f(q[1])} {f(q[0])} {f(q[1])}'
    s.add(f'<path class="il-ai-flow" d="{d}" fill="none" stroke="{TEAL_L}" stroke-width="4" stroke-linecap="round" stroke-dasharray="14 18"/>')
    for li, layer in enumerate(nodes):
        for k, (x, y) in enumerate(layer):
            ring = TEAL if li % 2 == 0 else VIOLET_L
            s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="15" fill="{NAVY}" stroke="{ring}" stroke-width="3"/>')
            s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="5" fill="{ring}" fill-opacity="0.85"/>')
    # Two groups separated by a smooth boundary.
    s.add(f'<rect x="880" y="200" width="270" height="400" rx="18" fill="{MIST}" fill-opacity="0.04" stroke="{MIST}" stroke-opacity="0.2" stroke-width="2"/>')
    bx = [880 + i * 6.75 for i in range(41)]
    by = [400 + 120 * math.sin((x - 880) / 270 * math.pi * 1.1 - 0.4) * 0.8 for x in bx]
    bpath = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in zip(bx, by))
    s.add(f'<path d="{bpath}" fill="none" stroke="{MIST}" stroke-opacity="0.75" stroke-width="3" stroke-dasharray="10 8"/>')
    for _ in range(46):
        x = rng.uniform(900, 1130)
        y = rng.uniform(220, 580)
        boundary = 400 + 120 * math.sin((x - 880) / 270 * math.pi * 1.1 - 0.4) * 0.8
        above = y < boundary - 14
        below = y > boundary + 14
        if not (above or below):
            continue
        col = TEAL if above else VIOLET
        s.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="7" fill="{col}" fill-opacity="0.85"/>')
    s.anim('il-ai-flow', 'animation:il-ai-dash 3.5s linear infinite')
    s.css.append('@keyframes il-ai-dash{to{stroke-dashoffset:-64}}')
    return s.render()


def exercise():
    """A walking figure with joint markers, motion arcs and a force curve."""
    s = Svg('ex', glow=(560, 380, TEAL))
    s.add(f'<path d="M140 690H1060" stroke="{MIST}" stroke-opacity="0.3" stroke-width="3"/>')
    for x in range(160, 1060, 60):
        s.add(f'<path d="M{x} 690v10" stroke="{MIST}" stroke-opacity="0.2" stroke-width="2"/>')

    def figure(dx, op, joints=True):
        pts = {
            'head': (560, 175), 'neck': (560, 238), 'hip': (556, 430),
            'elbowF': (500, 330), 'handF': (478, 418), 'elbowB': (618, 338), 'handB': (664, 410),
            'kneeF': (640, 545), 'ankleF': (672, 672), 'toeF': (726, 680),
            'kneeB': (512, 556), 'ankleB': (452, 660), 'toeB': (418, 640),
        }
        p = {k: (x + dx, y) for k, (x, y) in pts.items()}
        g = f'<g opacity="{op}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="{MIST}">'

        def line(*names, w):
            return f'<path d="M' + ' L'.join(f'{f(p[n][0])} {f(p[n][1])}' for n in names) + f'" stroke-width="{w}"/>'

        g += line('neck', 'elbowB', 'handB', w=22)
        g += line('hip', 'kneeB', 'ankleB', 'toeB', w=26)
        g += line('neck', 'hip', w=40)
        g += line('hip', 'kneeF', 'ankleF', 'toeF', w=28)
        g += line('neck', 'elbowF', 'handF', w=22)
        g += f'<circle cx="{f(p["head"][0])}" cy="{f(p["head"][1])}" r="40" fill="{MIST}" stroke="none"/>'
        g += '</g>'
        s.add(g)
        return p

    figure(-150, 0.08)
    figure(-75, 0.16)
    p = figure(0, 0.92)
    # Working muscle on the front thigh.
    s.add(f'<ellipse class="il-ex-muscle" cx="{f((p["hip"][0] + p["kneeF"][0]) / 2 + 6)}" cy="{f((p["hip"][1] + p["kneeF"][1]) / 2)}" rx="20" ry="58" transform="rotate(-34 {f((p["hip"][0] + p["kneeF"][0]) / 2 + 6)} {f((p["hip"][1] + p["kneeF"][1]) / 2)})" fill="{TEAL}" fill-opacity="0.75"/>')
    for k in ('neck', 'hip', 'kneeF', 'ankleF', 'kneeB', 'ankleB', 'elbowF', 'elbowB'):
        s.add(f'<circle cx="{f(p[k][0])}" cy="{f(p[k][1])}" r="9" fill="{NAVY}" stroke="{TEAL_L}" stroke-width="4"/>')
    # Knee angle.
    kx, ky = p['kneeF']
    s.add(f'<path d="M{f(kx - 30)} {f(ky - 52)}A60 60 0 0 1 {f(kx + 22)} {f(ky + 56)}" fill="none" stroke="{VIOLET_L}" stroke-width="4" stroke-dasharray="6 7"/>')
    # Force curve.
    s.add(f'<rect x="830" y="200" width="300" height="200" rx="16" fill="{MIST}" fill-opacity="0.04" stroke="{MIST}" stroke-opacity="0.2" stroke-width="2"/>')
    xs = np.linspace(0, 1, 70)
    ys = 0.8 * np.exp(-((xs - 0.25) / 0.11) ** 2) + 0.65 * np.exp(-((xs - 0.68) / 0.13) ** 2)
    path = 'M' + ' L'.join(f'{f(850 + 260 * x)} {f(380 - 150 * y)}' for x, y in zip(xs, ys))
    s.add(f'<path class="il-ex-trace" d="{path}" fill="none" stroke="{TEAL_L}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>')
    s.anim('il-ex-trace', 'animation:il-ex-draw 6s ease-in-out infinite')
    s.css.append('@keyframes il-ex-draw{0%{stroke-dashoffset:1}50%,100%{stroke-dashoffset:0}}')
    s.anim('il-ex-muscle', 'animation:il-ex-glow 3s ease-in-out infinite')
    s.css.append('@keyframes il-ex-glow{0%,100%{fill-opacity:.45}50%{fill-opacity:.9}}')
    return s.render()


def digital(seed=8):
    """A virtual reality headset over a perspective grid, with dual-task cues."""
    rng = random.Random(seed)
    s = Svg('vr', glow=(600, 330, VIOLET))
    vx, vy = 600, 300
    for x in range(-1400, 2700, 120):
        s.add(f'<path d="M{vx} {vy}L{x} 800" stroke="{MIST}" stroke-opacity="0.09" stroke-width="1.5"/>')
    for k in range(1, 9):
        y = vy + (800 - vy) * (k / 8) ** 1.8
        s.add(f'<path d="M0 {f(y)}H1200" stroke="{MIST}" stroke-opacity="{f(0.05 + 0.02 * k)}" stroke-width="1.5"/>')
    # Footsteps along the floor: walking while thinking.
    for k in range(7):
        t = k / 6
        y = 760 - 330 * t ** 0.9
        x = 600 + (-1) ** k * (34 - 18 * t)
        sc = 1 - 0.65 * t
        s.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(16 * sc)}" ry="{f(30 * sc)}" fill="{TEAL}" fill-opacity="{f(0.55 - 0.3 * t)}"/>')
    # Headset.
    lid = s.id('lens')
    s.defs.append(
        f'<radialGradient id="{lid}" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="{VIOLET_L}"/>'
        f'<stop offset="1" stop-color="{VIOLET}" stop-opacity="0.35"/></radialGradient>'
    )
    s.add(f'<path d="M370 250C300 260 270 320 300 360" fill="none" stroke="{SLATE}" stroke-width="16" stroke-linecap="round"/>')
    s.add(f'<path d="M830 250C900 260 930 320 900 360" fill="none" stroke="{SLATE}" stroke-width="16" stroke-linecap="round"/>')
    s.add(f'<rect x="380" y="200" width="440" height="200" rx="70" fill="{NAVY}" stroke="{MIST}" stroke-opacity="0.85" stroke-width="6"/>')
    s.add(f'<rect x="400" y="220" width="400" height="160" rx="56" fill="{MIST}" fill-opacity="0.05"/>')
    s.add(f'<circle cx="510" cy="300" r="52" fill="url(#{lid})"/><circle cx="690" cy="300" r="52" fill="url(#{lid})"/>')
    s.add(f'<path d="M560 403C575 368 625 368 640 403" fill="{NAVY2}" stroke="{MIST}" stroke-opacity="0.85" stroke-width="6" stroke-linejoin="round"/>')
    # Floating cognitive tasks.
    shapes = []
    for k in range(9):
        a = rng.uniform(0, 2 * math.pi)
        r = rng.uniform(250, 420)
        x = 600 + r * math.cos(a) * 1.25
        y = 300 + r * math.sin(a) * 0.55
        if 170 < y < 430 and 330 < x < 870:
            continue
        col = TEAL_L if k % 2 else VIOLET_L
        kind = k % 3
        cls = f'il-vr-float il-vr-d{k % 3}'
        if kind == 0:
            shapes.append(f'<circle class="{cls}" cx="{f(x)}" cy="{f(y)}" r="16" fill="none" stroke="{col}" stroke-width="4"/>')
        elif kind == 1:
            shapes.append(f'<rect class="{cls}" x="{f(x - 14)}" y="{f(y - 14)}" width="28" height="28" rx="5" fill="none" stroke="{col}" stroke-width="4"/>')
        else:
            shapes.append(f'<path class="{cls}" d="M{f(x)} {f(y - 17)}L{f(x + 16)} {f(y + 12)}H{f(x - 16)}Z" fill="none" stroke="{col}" stroke-width="4" stroke-linejoin="round"/>')
    for sh in shapes:
        s.add(sh)
    s.anim('il-vr-float', 'animation:il-vr-bob 6s ease-in-out infinite')
    s.anim('il-vr-d1', 'animation-delay:-2s')
    s.anim('il-vr-d2', 'animation-delay:-4s')
    s.css.append('@keyframes il-vr-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}')
    return s.render()


def microneedle(seed=13):
    """A dissolving microneedle patch above the layers of the skin."""
    rng = random.Random(seed)
    s = Svg('mn', glow=(600, 260, TEAL))
    # Skin layers.
    def wave(y, amp, ph):
        pts = [(x, y + amp * math.sin(x / 95 + ph)) for x in range(0, 1201, 20)]
        return ' L'.join(f'{x} {f(yy)}' for x, yy in pts)
    s.add(f'<path d="M0 470 L{wave(470, 8, 0)} L1200 800 L0 800Z" fill="{AMBER}" fill-opacity="0.10"/>')
    s.add(f'<path d="M0 470 L{wave(470, 8, 0)}" fill="none" stroke="{AMBER}" stroke-opacity="0.55" stroke-width="4"/>')
    s.add(f'<path d="M0 560 L{wave(560, 14, 1.2)} L1200 800 L0 800Z" fill="{TEAL}" fill-opacity="0.09"/>')
    s.add(f'<path d="M0 670 L{wave(670, 18, 2.1)} L1200 800 L0 800Z" fill="{VIOLET}" fill-opacity="0.12"/>')
    for k in range(9):
        y = 712 + k * 11
        s.add(f'<path d="M0 {y}H1200" stroke="{VIOLET_L}" stroke-opacity="0.12" stroke-width="3"/>')
    # Patch backing in perspective.
    s.add(f'<path d="M300 150 L900 150 L980 250 L220 250Z" fill="{MIST}" fill-opacity="0.16" stroke="{MIST}" stroke-opacity="0.7" stroke-width="3" stroke-linejoin="round"/>')
    s.add(f'<path d="M220 250 L980 250 L980 268 L220 268Z" fill="{MIST}" fill-opacity="0.28"/>')
    gid = s.id('needle')
    s.defs.append(
        f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{TEAL_L}"/>'
        f'<stop offset="0.55" stop-color="{TEAL}"/><stop offset="1" stop-color="{NAVY2}"/></linearGradient>'
    )
    # Needles in rows, back rows smaller.
    for row in range(3):
        depth = row / 2
        y0 = 268
        n = 11
        x0 = 250 + 18 * (2 - row)
        x1 = 950 - 18 * (2 - row)
        h = 150 + 70 * depth
        w = 26 + 10 * depth
        for i in range(n):
            x = x0 + (x1 - x0) * i / (n - 1) + (row - 1) * 12
            tip = y0 + h + (row == 2) * rng.uniform(0, 40)
            op = 0.45 + 0.5 * depth
            dissolving = row == 2 and i % 3 == 1
            fill_op = 0.4 if dissolving else op
            s.add(f'<path d="M{f(x - w / 2)} {y0} L{f(x)} {f(tip)} L{f(x + w / 2)} {y0}Z" fill="url(#{gid})" fill-opacity="{f(fill_op)}"/>')
            if row == 2:
                for _ in range(5 if dissolving else 2):
                    px = x + rng.uniform(-30, 30)
                    py = tip + rng.uniform(5, 90)
                    s.add(f'<circle class="il-mn-drop il-mn-d{rng.randint(0, 2)}" cx="{f(px)}" cy="{f(py)}" r="{f(rng.uniform(3, 6))}" fill="{VIOLET_L}" fill-opacity="0.85"/>')
    s.anim('il-mn-drop', 'animation:il-mn-sink 7s ease-in-out infinite')
    s.anim('il-mn-d1', 'animation-delay:-2.3s')
    s.anim('il-mn-d2', 'animation-delay:-4.6s')
    s.css.append('@keyframes il-mn-sink{0%{transform:translateY(-6px);opacity:.2}50%{opacity:1}100%{transform:translateY(16px);opacity:.15}}')
    return s.render()


def person(x, y, h, colour, op=1.0):
    """A simple standing figure: head and rounded body."""
    r = h * 0.13
    body = (
        f'<path d="M{f(x - h * 0.17)} {f(y)}C{f(x - h * 0.2)} {f(y - h * 0.55)} {f(x - h * 0.12)} {f(y - h * 0.68)} {f(x)} {f(y - h * 0.68)}'
        f'C{f(x + h * 0.12)} {f(y - h * 0.68)} {f(x + h * 0.2)} {f(y - h * 0.55)} {f(x + h * 0.17)} {f(y)}Z" fill="{colour}" fill-opacity="{op}"/>'
    )
    head = f'<circle cx="{f(x)}" cy="{f(y - h * 0.84)}" r="{f(r)}" fill="{colour}" fill-opacity="{op}"/>'
    return body + head


def community():
    """Older adults walking together, linked to a phone showing activity."""
    s = Svg('com', glow=(900, 240, AMBER))
    s.add(f'<circle cx="905" cy="215" r="80" fill="{AMBER}" fill-opacity="0.75"/>')
    s.add(f'<path d="M0 600C220 520 420 560 600 590S980 640 1200 560V800H0Z" fill="{TEAL}" fill-opacity="0.12"/>')
    s.add(f'<path d="M0 650C260 600 480 640 700 660S1020 690 1200 640V800H0Z" fill="{TEAL}" fill-opacity="0.18"/>')
    s.add(f'<path d="M80 700C300 660 520 690 760 700" fill="none" stroke="{MIST}" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="4 14" stroke-linecap="round"/>')
    for x, y, h, c in [(170, 690, 230, MIST), (300, 685, 200, VIOLET_L), (430, 690, 240, TEAL_L), (560, 692, 210, MIST)]:
        s.add(person(x, y, h, c, 0.9))
    # Phone with an activity ring and bars (no real data).
    s.add(f'<rect x="830" y="330" width="220" height="400" rx="34" fill="{NAVY}" stroke="{MIST}" stroke-opacity="0.8" stroke-width="5"/>')
    s.add(f'<rect x="900" y="350" width="80" height="10" rx="5" fill="{MIST}" fill-opacity="0.35"/>')
    s.add(f'<circle cx="940" cy="460" r="58" fill="none" stroke="{MIST}" stroke-opacity="0.15" stroke-width="14"/>')
    s.add(f'<circle class="il-com-ring" cx="940" cy="460" r="58" fill="none" stroke="{TEAL}" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="72 100" transform="rotate(-90 940 460)"/>')
    for k, hgt in enumerate([40, 64, 52, 88, 70, 96, 60]):
        s.add(f'<rect x="{858 + k * 24}" y="{f(690 - hgt)}" width="14" height="{hgt}" rx="5" fill="{VIOLET_L if k % 2 else TEAL_L}" fill-opacity="0.8"/>')
    s.add(f'<path d="M620 560C700 520 760 500 828 480" fill="none" stroke="{TEAL_L}" stroke-opacity="0.6" stroke-width="3" stroke-dasharray="8 10"/>')
    s.anim('il-com-ring', 'animation:il-com-fill 8s ease-in-out infinite')
    s.css.append('@keyframes il-com-fill{0%{stroke-dasharray:10 100}60%,100%{stroke-dasharray:72 100}}')
    return s.render()


def physioverse():
    """A 3D view of the knee joint with axes, inside a browser window."""
    s = Svg('pv', glow=(600, 420, TEAL))
    s.add(f'<rect x="150" y="90" width="900" height="620" rx="22" fill="{NAVY}" fill-opacity="0.65" stroke="{MIST}" stroke-opacity="0.45" stroke-width="3"/>')
    s.add(f'<path d="M150 140H1050" stroke="{MIST}" stroke-opacity="0.3" stroke-width="2"/>')
    for k, c in enumerate([AMBER, TEAL, VIOLET_L]):
        s.add(f'<circle cx="{185 + k * 26}" cy="115" r="7" fill="{c}" fill-opacity="0.8"/>')
    # Isometric floor grid.
    for k in range(-6, 7):
        s.add(f'<path d="M{600 + k * 40 - 280} {600 - k * 20 + 140}L{600 + k * 40 + 280} {600 - k * 20 - 140}" stroke="{MIST}" stroke-opacity="0.08" stroke-width="1.5"/>')
        s.add(f'<path d="M{600 + k * 40 - 280} {600 + k * 20 - 140}L{600 + k * 40 + 280} {600 + k * 20 + 140}" stroke="{MIST}" stroke-opacity="0.08" stroke-width="1.5"/>')
    g = '<g class="il-pv-rot">'
    # Femur and tibia.
    g += f'<path d="M568 170H632L638 372C678 386 692 432 664 456C646 470 624 456 600 456C576 456 554 470 536 456C508 432 522 386 562 372Z" fill="{MIST}" fill-opacity="0.92"/>'
    g += f'<path d="M528 486C540 474 660 474 672 486C680 504 668 520 646 528L640 700H560L554 528C532 520 520 504 528 486Z" fill="{MIST}" fill-opacity="0.78"/>'
    g += f'<ellipse cx="682" cy="420" rx="16" ry="24" fill="{MIST}" fill-opacity="0.65"/>'
    # Quadriceps and hamstrings as bands.
    g += f'<path d="M640 190C690 260 700 360 672 430" fill="none" stroke="{TEAL}" stroke-width="22" stroke-linecap="round" stroke-opacity="0.85"/>'
    g += f'<path d="M548 200C510 290 512 380 540 470" fill="none" stroke="{VIOLET}" stroke-width="18" stroke-linecap="round" stroke-opacity="0.75"/>'
    g += '</g>'
    s.add(g)
    # Rotation arrow and axes.
    s.add(f'<path d="M470 320A140 60 0 1 0 760 340" fill="none" stroke="{TEAL_L}" stroke-width="4" stroke-dasharray="10 9"/>')
    s.add(f'<path d="M760 340l-20-6 8 18z" fill="{TEAL_L}"/>')
    s.add(f'<path d="M260 620v-90M260 620l80-40M260 620l-70-36" stroke-width="5" stroke-linecap="round" fill="none" stroke="{MIST}" stroke-opacity="0.8"/>')
    s.add(f'<circle cx="260" cy="530" r="6" fill="{TEAL_L}"/><circle cx="340" cy="580" r="6" fill="{VIOLET_L}"/><circle cx="190" cy="584" r="6" fill="{AMBER}"/>')
    s.anim('il-pv-rot', 'transform-origin:600px 440px;animation:il-pv-sway 10s ease-in-out infinite')
    s.css.append('@keyframes il-pv-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}')
    return s.render()


def quiz():
    """Multiple-choice question cards with a progress bar."""
    s = Svg('qz', glow=(600, 380, VIOLET))
    s.add(f'<rect x="300" y="130" width="560" height="560" rx="28" fill="{NAVY}" fill-opacity="0.5" stroke="{MIST}" stroke-opacity="0.15" stroke-width="2" transform="rotate(-6 580 410)"/>')
    s.add(f'<rect x="340" y="110" width="560" height="580" rx="28" fill="{NAVY}" stroke="{MIST}" stroke-opacity="0.7" stroke-width="4"/>')
    s.add(f'<rect x="380" y="150" width="480" height="12" rx="6" fill="{MIST}" fill-opacity="0.15"/>')
    s.add(f'<rect class="il-qz-progress" x="380" y="150" width="300" height="12" rx="6" fill="{TEAL}"/>')
    s.add(f'<rect x="380" y="200" width="420" height="20" rx="10" fill="{MIST}" fill-opacity="0.6"/>')
    s.add(f'<rect x="380" y="234" width="300" height="20" rx="10" fill="{MIST}" fill-opacity="0.35"/>')
    for k in range(4):
        y = 300 + k * 92
        correct = k == 2
        stroke = TEAL if correct else MIST
        s.add(f'<rect x="380" y="{y}" width="480" height="68" rx="16" fill="{TEAL if correct else MIST}" fill-opacity="{0.18 if correct else 0.05}" stroke="{stroke}" stroke-opacity="{0.9 if correct else 0.3}" stroke-width="3"/>')
        s.add(f'<circle cx="420" cy="{y + 34}" r="14" fill="none" stroke="{stroke}" stroke-opacity="{0.9 if correct else 0.5}" stroke-width="3"/>')
        s.add(f'<rect x="452" y="{y + 26}" width="{[260, 200, 300, 230][k]}" height="16" rx="8" fill="{MIST}" fill-opacity="{0.55 if correct else 0.3}"/>')
        if correct:
            s.add(f'<path class="il-qz-tick" d="M410 {y + 34}l7 8 14-16" fill="none" stroke="{TEAL_L}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>')
    s.anim('il-qz-tick', 'animation:il-qz-draw 4s ease-in-out infinite')
    s.css.append('@keyframes il-qz-draw{0%,15%{stroke-dashoffset:1}40%,100%{stroke-dashoffset:0}}')
    return s.render()


ILLUSTRATIONS = {
    'musculoskeletal': musculoskeletal,
    'bone': bone,
    'prediction': prediction,
    'exercise': exercise,
    'digital': digital,
    'microneedle': microneedle,
    'community': community,
    'physioverse': physioverse,
    'quiz': quiz,
}

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for name, fn in ILLUSTRATIONS.items():
        svg = fn()
        with open(os.path.join(out, f'{name}.svg'), 'w') as fh:
            fh.write(svg)
        print(name, len(svg) // 1024, 'KB')
