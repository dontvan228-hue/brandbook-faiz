"""Round sticker «ФАЙЗ — С ЛЮБОВЬЮ», 80 mm, bleed 2 mm, two colourways.

Vector logo (#fl from bakery.html); the arc caption is Playfair Display SemiBold
converted to outlines, so the print shop needs no fonts.

Usage: python -P print/bakery/make_sticker.py <PlayfairDisplay[wght].ttf>
Writes print/bakery/sticker/*.svg and _pdf_*.html (headless Chrome turns those into PDF).
"""
import math, re, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'sticker'
OUT.mkdir(exist_ok=True)
CREAM, CHOC = '#F4DEAF', '#5C3A28'
D, BLEED = 80.0, 2.0
S = D + 2 * BLEED; C = S / 2                     # 84 x 84 artboard, centre 42
RING_R, RING_W = 35.5, 0.65                      # dashed ring: 4.5 mm inside the cut
LOGO_W, LOGO_CY = 50.0, C - 3.0
TEXT, TEXT_SIZE, TRACK = 'С ЛЮБОВЬЮ', 6.0, 0.16  # caption, cap size in mm, tracking (em)
BASE_R = 30.2                                    # caption baseline radius (letters face the centre)

font = instantiateVariableFont(TTFont(sys.argv[1]), {'wght': 600})
gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font['hmtx']
upm = font['head'].unitsPerEm
k = TEXT_SIZE / upm
cap = font['OS/2'].sCapHeight * k


def glyph_path(ch, a, ox):
    """Glyph `ch` placed so that its baseline-left sits at arc angle `a` (0 = bottom), shifted ox mm along."""
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    # local glyph coords (font units, y up) -> mm, y down, then rotate to the arc
    ca, sa = math.cos(-a), math.sin(-a)
    px, py = C + BASE_R * math.sin(a), C + BASE_R * math.cos(a)
    # x' = ca*(k*x+ox) - sa*(-k*y) + px ; y' = sa*(k*x+ox) + ca*(-k*y) + py
    t = (ca * k, sa * k, sa * k, -ca * k, ca * ox + px, sa * ox + py)
    gs[name].draw(TransformPen(pen, t))
    return pen.getCommands(), hmtx[name][0] * k


# caption: lay letters along the arc at the mid-height radius so spacing looks even
mid_r = BASE_R - cap / 2
widths = [hmtx[cmap[ord(c)]][0] * k + (TRACK * TEXT_SIZE if i < len(TEXT) - 1 else 0) for i, c in enumerate(TEXT)]
total = sum(widths)
a = -total / 2 / mid_r                          # start on the left (negative angle = left of the bottom)
caption = []
for c, w in zip(TEXT, widths):
    if c != ' ':
        adv = hmtx[cmap[ord(c)]][0] * k
        ac = a + adv / 2 / mid_r                  # glyph centre angle
        d, _ = glyph_path(c, ac, -adv / 2)
        caption.append(d)
    a += w / mid_r
caption_d = ' '.join(caption)

# logo
html = (ROOT / 'bakery.html').read_text(encoding='utf-8')
sym = re.search(r'<symbol id="fl" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
vb = [float(v) for v in sym.group(1).split()]
LD = re.search(r' d="([^"]+)"', sym.group(2)).group(1)
lk = LOGO_W / vb[2]
lx, ly = C - LOGO_W / 2 - vb[0] * lk, LOGO_CY - vb[3] * lk / 2 - vb[1] * lk

for name, bg, ink in (('chocolate', CHOC, CREAM), ('cream', CREAM, CHOC)):
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{S:g}mm" height="{S:g}mm" viewBox="0 0 {S:g} {S:g}">
  <title>ФАЙЗ — наклейка «С любовью», D80 мм, вылеты 2 мм</title>
  <g id="Design">
    <circle cx="{C:g}" cy="{C:g}" r="{C:g}" fill="{bg}"/>
    <circle cx="{C:g}" cy="{C:g}" r="{RING_R}" fill="none" stroke="{ink}" stroke-width="{RING_W}" stroke-dasharray="1.8 1.8" stroke-linecap="round"/>
    <path fill="{ink}" fill-rule="evenodd" transform="matrix({lk:.6f} 0 0 {lk:.6f} {lx:.4f} {ly:.4f})" d="{LD}"/>
    <path fill="{ink}" d="{caption_d}"/>
  </g>
  <g id="CutContour">
    <circle cx="{C:g}" cy="{C:g}" r="{D / 2:g}" fill="none" stroke="#ff00ff" stroke-width="0.1"/>
  </g>
</svg>
'''
    (OUT / f'faiz-sticker_d80_{name}.svg').write_text(svg, encoding='utf-8')
    (OUT / f'_pdf_{name}.html').write_text(
        f'<!doctype html><html><head><meta charset="utf-8"><style>@page{{size:{S:g}mm {S:g}mm;margin:0}}html,body{{margin:0}}svg{{display:block}}</style></head><body>{svg.split("?>", 1)[1]}</body></html>',
        encoding='utf-8')
print('sticker written; caption cap height %.1f mm' % cap)
