"""Print-ready cup wraps (paper cup developments) for the FAIZ bakery.

Each cup is a cone frustum, so its printed sheet is a ring sector. The logo is
vector (the #fl path from bakery.html) and is bent along the arc, so it stands
straight on the finished cup. Brand colours only: cream #F4DEAF, blue #A0BEDA,
chocolate #5C3A28.

Usage: python -P print/bakery/make_cups.py   (writes print/bakery/cups/*.svg + *.html for PDF)
"""
import math, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'cups'
OUT.mkdir(exist_ok=True)

CREAM, BLUE, CHOC = '#F4DEAF', '#A0BEDA', '#5C3A28'
BLEED, GLUE = 3.0, 8.0
BAND = (0.27, 0.66)        # blue band, share of the wall height from the top
LOGO_SHARE = 0.31          # logo width as a share of the cup girth at band centre

CUPS = [  # name, top D, bottom D, height (mm)
    ('250', 80, 55, 92),
    ('300', 80, 56, 108),
    ('400', 90, 60, 115),
]

# ---- logo path: absolute M/C/Z only ----
html = (ROOT / 'bakery.html').read_text(encoding='utf-8')
sym = re.search(r'<symbol id="fl" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
vb = [float(v) for v in sym.group(1).split()]
LD = re.search(r' d="([^"]+)"', sym.group(2)).group(1)
assert set(re.findall(r'[A-Za-z]', LD)) <= {'M', 'C', 'Z'}
TOK = re.findall(r'[MCZ]|-?\d*\.?\d+(?:e-?\d+)?', LD)


def warp_logo(phi_c, r_c, width):
    """Logo centred at angle phi_c / radius r_c, `width` mm wide along the arc."""
    k = width / vb[2]
    cx, cy = vb[0] + vb[2] / 2, vb[1] + vb[3] / 2

    def pt(x, y):
        s, t = (x - cx) * k, (y - cy) * k        # along the arc / downwards (towards the apex)
        rho, phi = r_c - t, phi_c + s / r_c
        return f'{rho * math.sin(phi):.3f} {-rho * math.cos(phi):.3f}'

    out, i = [], 0
    while i < len(TOK):
        c = TOK[i]; i += 1
        if c == 'Z':
            out.append('Z'); continue
        n = 1 if c == 'M' else 3
        pts = []
        for _ in range(n):
            pts.append(pt(float(TOK[i]), float(TOK[i + 1]))); i += 2
        out.append(c + ' ' + ' '.join(pts))
        while i < len(TOK) and TOK[i] not in 'MCZ':   # implicit repeats
            pts = []
            for _ in range(n):
                pts.append(pt(float(TOK[i]), float(TOK[i + 1]))); i += 2
            out.append(('L' if c == 'M' else c) + ' ' + ' '.join(pts))
    return ' '.join(out)


def sector(R, r, a0, a1):
    p = lambda rad, a: f'{rad * math.sin(a):.3f} {-rad * math.cos(a):.3f}'
    big = 1 if a1 - a0 > math.pi else 0
    return (f'M {p(R, a0)} A {R:.3f} {R:.3f} 0 {big} 1 {p(R, a1)} '
            f'L {p(r, a1)} A {r:.3f} {r:.3f} 0 {big} 0 {p(r, a0)} Z')


for name, Dt, Db, H in CUPS:
    L = math.hypot(H, (Dt - Db) / 2)              # slant height
    R = L * Dt / (Dt - Db); r = R - L              # outer / inner radius of the sector
    th = math.pi * Dt / R                          # wrap angle without overlap
    tg = GLUE / ((R + r) / 2)                      # overlap on the right
    a0, a1 = -th / 2, th / 2 + tg
    eb0, eb1 = a0 - BLEED / r, a1 + BLEED / r
    Rb, rb = R + BLEED, r - BLEED
    band_o, band_i = R - BAND[0] * L, R - BAND[1] * L
    rc = (band_o + band_i) / 2
    girth = th * rc
    lw = LOGO_SHARE * girth
    logos = ''.join(f'<path fill-rule="evenodd" fill="{CHOC}" d="{warp_logo(s * th / 4, rc, lw)}"/>' for s in (-1, 1))

    # bounding box of the bleed sector + room for notes underneath
    xs = [Rb * math.sin(a) for a in (eb0, eb1)] + [rb * math.sin(a) for a in (eb0, eb1)]
    x0, x1 = min(xs) - 4, max(xs) + 4
    y0 = -Rb - 4
    y1 = max(-rb * math.cos(eb0), -rb * math.cos(eb1)) + 22
    W, Hh = x1 - x0, y1 - y0
    seam = f'M {R * math.sin(th / 2):.3f} {-R * math.cos(th / 2):.3f} L {r * math.sin(th / 2):.3f} {-r * math.cos(th / 2):.3f}'
    gx, gy = (R + r) / 2 * math.sin(th / 2 + tg / 2), -(R + r) / 2 * math.cos(th / 2 + tg / 2)
    gang = math.degrees(th / 2 + tg / 2) + 90
    ny = -rb * math.cos(eb0) + 8 if -rb * math.cos(eb0) > -rb * math.cos(eb1) else -rb * math.cos(eb1) + 8
    ny = max(-rb * math.cos(eb0), -rb * math.cos(eb1)) + 7
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W:.2f}mm" height="{Hh:.2f}mm" viewBox="{x0:.3f} {y0:.3f} {W:.3f} {Hh:.3f}">
  <title>ФАЙЗ — стакан {name} мл, развёртка 1:1</title>
  <defs><clipPath id="bleed"><path d="{sector(Rb, rb, eb0, eb1)}"/></clipPath></defs>
  <g id="Artwork_Bleed" clip-path="url(#bleed)">
    <path d="{sector(Rb, rb, eb0, eb1)}" fill="{CREAM}"/>
    <path d="{sector(band_o, band_i, eb0, eb1)}" fill="{BLUE}"/>
    {logos}
  </g>
  <g id="DieCut_NonPrint" fill="none">
    <path d="{sector(R, r, a0, a1)}" stroke="#ff00ff" stroke-width="0.35"/>
    <path d="{seam}" stroke="#00aeef" stroke-width="0.3" stroke-dasharray="2 1.5"/>
    <text x="{gx:.3f}" y="{gy:.3f}" transform="rotate({gang:.2f} {gx:.3f} {gy:.3f})" font-family="Arial, sans-serif" font-size="2.2" fill="#00aeef" text-anchor="middle">СКЛЕЙКА 8 мм</text>
  </g>
  <g id="Notes_NonPrint" font-family="Arial, sans-serif" fill="#444">
    <text x="{x0 + 4:.3f}" y="{ny:.3f}" font-size="3.2" font-weight="bold" fill="#222">ФАЙЗ — стакан {name} мл · развёртка 1:1, мм</text>
    <text x="{x0 + 4:.3f}" y="{ny + 4.5:.3f}" font-size="2.5">D верх {Dt} · D низ {Db} · H {H} · угол {math.degrees(th):.2f}° + нахлёст {GLUE:.0f} мм · вылеты {BLEED:.0f} мм · логотип {lw:.0f} мм, вектор, дважды (лицо и оборот)</text>
    <text x="{x0 + 4:.3f}" y="{ny + 8.5:.3f}" font-size="2.5">Цвета: фон {CREAM} · полоса {BLUE} · логотип {CHOC}. Пурпурный контур, голубая линия и эти надписи — не печатать</text>
  </g>
</svg>
'''
    (OUT / f'faiz-cup_{name}ml_wrap.svg').write_text(svg, encoding='utf-8')
    page = (f'<!doctype html><html><head><meta charset="utf-8"><style>@page{{size:{W:.2f}mm {Hh:.2f}mm;margin:0}}'
            f'html,body{{margin:0}}svg{{display:block}}</style></head>'
            f'<body>{svg.split("?>", 1)[1]}</body></html>')
    (OUT / f'_pdf_{name}.html').write_text(page, encoding='utf-8')
    print(f'{name} ml: R={R:.2f} r={r:.2f} angle={math.degrees(th):.2f} logo={lw:.1f}mm sheet={W:.0f}x{Hh:.0f}mm')
