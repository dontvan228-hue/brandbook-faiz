"""Drinks menu «НАПИТКИ» for the FAIZ bakery: A4 and A3, chocolate field, cream ink.

Vector logo; «НАПИТКИ» in Playfair Display, volumes and ₽ in Manrope — all text
converted to outlines. Empty ruled lines for names and prices (written by hand
or filled in later). Volumes match the cups: 250 / 300 / 400 ml.

Usage: python -P print/bakery/make_menu.py <PlayfairDisplay[wght].ttf> <Manrope[wght].ttf>
"""
import re, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'menu'
OUT.mkdir(exist_ok=True)
CREAM, CHOC = '#F4DEAF', '#5C3A28'
W, H, BLEED = 210.0, 297.0, 3.0          # designed on A4; A3 is the same drawing scaled
VOLUMES = ['250 мл', '300 мл', '400 мл']
ROWS = 10


class Face:
    def __init__(self, path, wght):
        f = instantiateVariableFont(TTFont(path), {'wght': wght})
        self.gs, self.cmap, self.hmtx = f.getGlyphSet(), f.getBestCmap(), f['hmtx']
        self.cap = f['OS/2'].sCapHeight

    def width(self, s, cap, track=0.0):
        k = cap / self.cap
        return sum(self.hmtx[self.cmap[ord(c)]][0] * k for c in s) + track * cap * (len(s) - 1)

    def path(self, s, x, base, cap, anchor='start', track=0.0):
        k = cap / self.cap
        w = self.width(s, cap, track)
        x -= {'start': 0, 'middle': w / 2, 'end': w}[anchor]
        out = []
        for c in s:
            name = self.cmap[ord(c)]
            pen = SVGPathPen(self.gs)
            self.gs[name].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
            out.append(pen.getCommands())
            x += self.hmtx[name][0] * k + track * cap
        return ' '.join(p for p in out if p)


serif = Face(sys.argv[1], 600)
sans = Face(sys.argv[2], 600)

html = (ROOT / 'bakery.html').read_text(encoding='utf-8')
sym = re.search(r'<symbol id="fl" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
vb = [float(v) for v in sym.group(1).split()]
LD = re.search(r' d="([^"]+)"', sym.group(2)).group(1)

M = 16.0                                   # side margin
LOGO_W, LOGO_TOP = 100.0, 22.0
lk = LOGO_W / vb[2]
logo = (f'<path fill="{CREAM}" fill-rule="evenodd" transform="matrix({lk:.6f} 0 0 {lk:.6f} '
        f'{W / 2 - LOGO_W / 2 - vb[0] * lk:.3f} {LOGO_TOP - vb[1] * lk:.3f})" d="{LD}"/>')
logo_bottom = LOGO_TOP + vb[3] * lk

title_base = logo_bottom + 12 + 11
text = [serif.path('НАПИТКИ', W / 2, title_base, 11, 'middle', track=0.12)]

cols = [W - M - 2 * 24, W - M - 24, W - M]          # right edges of the price columns
head_base = title_base + 17
for x, v in zip(cols, VOLUMES):
    text.append(sans.path(v, x, head_base, 3.4, 'end'))

lines = []
first, last = head_base + 13, H - 20
pitch = (last - first) / (ROWS - 1)
rub_w = sans.width('₽', 4.0)
for i in range(ROWS):
    y = first + i * pitch
    lines.append(f'M{M} {y:.2f}H{cols[0] - 30:.2f}')
    for x in cols:
        text.append(sans.path('₽', x, y, 4.0, 'end'))
        lines.append(f'M{x - rub_w - 13:.2f} {y:.2f}H{x - rub_w - 1.6:.2f}')

art = (f'<rect x="{-BLEED}" y="{-BLEED}" width="{W + 2 * BLEED}" height="{H + 2 * BLEED}" fill="{CHOC}"/>{logo}'
       f'<path fill="{CREAM}" d="{" ".join(text)}"/>'
       f'<path d="{" ".join(lines)}" stroke="{CREAM}" stroke-width="0.35" stroke-linecap="round" fill="none"/>')

for fmt, scale in (('A4', 1.0), ('A3', 2 ** 0.5)):
    sw, sh = (W + 2 * BLEED) * scale, (H + 2 * BLEED) * scale
    svg = (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{sw:.2f}mm" height="{sh:.2f}mm" '
           f'viewBox="{-BLEED} {-BLEED} {W + 2 * BLEED} {H + 2 * BLEED}">\n'
           f'  <title>ФАЙЗ — меню «Напитки», {fmt}, вылеты {BLEED * scale:.0f} мм</title>\n  <g id="Artwork">{art}</g>\n</svg>\n')
    (OUT / f'faiz-menu-drinks_{fmt}.svg').write_text(svg, encoding='utf-8')
    (OUT / f'_pdf_{fmt}.html').write_text(
        f'<!doctype html><html><head><meta charset="utf-8"><style>@page{{size:{sw:.2f}mm {sh:.2f}mm;margin:0}}html,body{{margin:0}}svg{{display:block}}</style></head><body>{svg.split("?>", 1)[1]}</body></html>',
        encoding='utf-8')
print('menu written; rows', ROWS, 'pitch %.1f mm' % pitch)
