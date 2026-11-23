"""Reusable dry-erase price tag for the FAIZ bakery: 80x60 and 75x55 mm, rounded corners R 4.5.

Blue band (25 % of the height) with the vector logo, cream field left empty for a
marker, «₽» set right of centre near the bottom (Manrope, outlined). Bleed 2 mm,
cut contour on its own layer. Also writes a filled-in example for the site.

Usage: python -P print/bakery/make_pricetag.py <PlayfairDisplay[wght].ttf> <Manrope[wght].ttf>
"""
import re, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'pricetag'
OUT.mkdir(exist_ok=True)
CREAM, BLUE, CHOC = '#F4DEAF', '#A0BEDA', '#5C3A28'
BLEED, R = 2.0, 4.5


class Face:
    def __init__(self, path, wght):
        f = instantiateVariableFont(TTFont(path), {'wght': wght})
        self.gs, self.cmap, self.hmtx, self.capu = f.getGlyphSet(), f.getBestCmap(), f['hmtx'], f['OS/2'].sCapHeight

    def path(self, s, x, base, cap, anchor='start', track=0.0):
        k = cap / self.capu
        w = sum(self.hmtx[self.cmap[ord(c)]][0] * k for c in s) + track * cap * (len(s) - 1)
        x -= {'start': 0, 'middle': w / 2, 'end': w}[anchor]
        out = []
        for c in s:
            n = self.cmap[ord(c)]
            pen = SVGPathPen(self.gs)
            self.gs[n].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
            out.append(pen.getCommands())
            x += self.hmtx[n][0] * k + track * cap
        return ' '.join(p for p in out if p)


serif, sans = Face(sys.argv[1], 600), Face(sys.argv[2], 600)
sans_r = Face(sys.argv[2], 500)
html = (ROOT / 'bakery.html').read_text(encoding='utf-8')
sym = re.search(r'<symbol id="fl" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
vb = [float(v) for v in sym.group(1).split()]
LD = re.search(r' d="([^"]+)"', sym.group(2)).group(1)


def tag(W, H, filled=False):
    band = round(H * 0.25, 2)
    lw = W * 0.42
    lk = lw / vb[2]
    lh = vb[3] * lk
    logo = (f'<path fill="{CHOC}" fill-rule="evenodd" transform="matrix({lk:.6f} 0 0 {lk:.6f} '
            f'{W / 2 - lw / 2 - vb[0] * lk:.3f} {band / 2 - lh / 2 - vb[1] * lk:.3f})" d="{LD}"/>')
    rub_x, rub_base, rub_cap = W / 2 + 13, H - 8, H * 0.115
    ink = [sans.path('₽', rub_x, rub_base, rub_cap)]
    if filled:   # example of marker handwriting, shown on the site only
        ink.append(serif.path('Круассан', W / 2, band + H * 0.2, H * 0.075, 'middle'))
        ink.append(sans_r.path('сливочное масло · 80 г', W / 2, band + H * 0.29, H * 0.04, 'middle'))
        ink.append(serif.path('140', rub_x - 1.6, rub_base, rub_cap, 'end'))
    art = (f'<rect x="{-BLEED}" y="{-BLEED}" width="{W + 2 * BLEED}" height="{H + 2 * BLEED}" fill="{CREAM}"/>'
           f'<rect x="{-BLEED}" y="{-BLEED}" width="{W + 2 * BLEED}" height="{band + BLEED}" fill="{BLUE}"/>'
           f'{logo}<path fill="{CHOC}" d="{" ".join(ink)}"/>')
    cut = f'<rect width="{W}" height="{H}" rx="{R}" fill="none" stroke="#ff00ff" stroke-width="0.1"/>'
    return art, cut


for W, H in ((80, 60), (75, 55)):
    art, cut = tag(W, H)
    S = (W + 2 * BLEED, H + 2 * BLEED)
    svg = (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{S[0]:g}mm" height="{S[1]:g}mm" '
           f'viewBox="{-BLEED} {-BLEED} {S[0]:g} {S[1]:g}">\n  <title>ФАЙЗ — ценник «пиши-стирай» {W}×{H} мм, R {R}, вылеты {BLEED:g} мм</title>\n'
           f'  <g id="Artwork">{art}</g>\n  <g id="CutContour">{cut}</g>\n</svg>\n')
    (OUT / f'faiz-pricetag_{W}x{H}.svg').write_text(svg, encoding='utf-8')
    (OUT / f'_pdf_{W}x{H}.html').write_text(
        f'<!doctype html><html><head><meta charset="utf-8"><style>@page{{size:{S[0]:g}mm {S[1]:g}mm;margin:0}}html,body{{margin:0}}svg{{display:block}}</style></head><body>{svg.split("?>", 1)[1]}</body></html>',
        encoding='utf-8')

# site preview: blank and filled side by side, clipped to the rounded shape
W, H = 80, 60
prev = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 {2 * W + 14} {H + 4}" role="img" aria-label="Ценник ФАЙЗ: чистый бланк и пример заполнения маркером — Круассан, сливочное масло 80 г, 140 рублей">'
        f'<defs><clipPath id="c"><rect width="{W}" height="{H}" rx="{R}"/></clipPath></defs>'
        + ''.join(f'<g transform="translate({i * (W + 10)} 0)"><g clip-path="url(#c)">{tag(W, H, f)[0]}</g>'
                  f'<rect width="{W}" height="{H}" rx="{R}" fill="none" stroke="rgba(92,58,40,.25)" stroke-width="0.3"/></g>'
                  for i, f in enumerate((False, True)))
        + '</svg>')
(ROOT / 'img/bakery/pricetag.svg').write_text(prev, encoding='utf-8')
print('price tags written')
